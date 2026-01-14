import OpenAI from 'openai';
import { getAIConfig } from './ai-config';
import { RenamePlan } from '../types/agent';

export class AgentService {
    private openai: OpenAI;

    constructor() {
        const config = getAIConfig();
        this.openai = new OpenAI({
            apiKey: config.apiKey || 'dummy', // Prevent throw on init, handle later
            baseURL: config.baseUrl,
            dangerouslyAllowBrowser: true
        });
    }

    async generateRenamePlan(files: string[], userInstruction: string, onProgress?: (msg: string) => void): Promise<RenamePlan> {
        const config = getAIConfig();

        // Safety check
        if (!config.apiKey) {
            throw new Error("Missing API Key. Please configure it in Settings.");
        }

        // Re-init in case config changed
        this.openai = new OpenAI({
            apiKey: config.apiKey,
            baseURL: config.baseUrl,
            dangerouslyAllowBrowser: true
        });

        // Initial Context: Just file paths, no content
        const fileListContext = files.map(f => `File: ${f}`).join('\n');

        const systemPrompt = `
You are an expert file management assistant for macOS. 
Your goal is to help the user rename files in bulk based on their natural language instructions.

You have access to the following tools:
1. \`read_file_content(path)\`: Read the text content of a file (up to 50KB). Use this if the user's instruction depends on file content (e.g., "rename based on title in first line").
2. \`read_image_exif(path)\`: Read EXIF metadata from an image (DateTimeOriginal, Model, etc). Use this for photos.
3. \`describe_image(path)\`: Analyze the content of an image using Vision AI. Use this to rename based on visual content.
4. \`submit_rename_plan(summary, operations)\`: Submit the final renaming plan.

Process:
1. **THINK FIRST**: Before calling any tool, output a brief thought process explaining why you are taking the next step. (e.g., "I need to check the date taken for these photos.").
2. Analyze the file list and instruction.
3. Call the appropriate tool.
4. Repeat until you have enough information.
5. Generate the plan and submit.

Rules:
- Only include files that actually need to be renamed in the "operations" list.
- Preserve file extensions unless explicitly asked to change them.
- Ensure "new" path is fully qualified (absolute path).
`;

        const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: `File List:\n${fileListContext}\n\nInstruction:\n${userInstruction}` }
        ];

        const tools = [
            {
                type: "function" as const,
                function: {
                    name: "read_file_content",
                    description: "Read the text content of a specific file. Useful for extracting metadata or checking content.",
                    parameters: {
                        type: "object",
                        properties: {
                            path: { type: "string", description: "Absolute path of the file to read" }
                        },
                        required: ["path"]
                    }
                }
            },
            {
                type: "function" as const,
                function: {
                    name: "read_image_exif",
                    description: "Read EXIF metadata from an image file.",
                    parameters: {
                        type: "object",
                        properties: {
                            path: { type: "string", description: "Absolute path of the image file" }
                        },
                        required: ["path"]
                    }
                }
            },
            {
                type: "function" as const,
                function: {
                    name: "describe_image",
                    description: "Analyze the content of an image using Vision AI. Use this to rename based on visual content (e.g. 'cat', 'sunset').",
                    parameters: {
                        type: "object",
                        properties: {
                            path: { type: "string", description: "Absolute path of the image file" }
                        },
                        required: ["path"]
                    }
                }
            },
            {
                type: "function" as const,
                function: {
                    name: "submit_rename_plan",
                    description: "Submit a final plan to rename files.",
                    parameters: {
                        type: "object",
                        properties: {
                            summary: {
                                type: "string",
                                description: "Brief explanation of what will be done"
                            },
                            operations: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        original: { type: "string", description: "Absolute path of the original file" },
                                        new: { type: "string", description: "Absolute path of the new file" }
                                    },
                                    required: ["original", "new"]
                                },
                                description: "List of renaming operations"
                            }
                        },
                        required: ["summary", "operations"]
                    }
                }
            }
        ];

        const MAX_TURNS = 50; // Increased to allow batch processing of images

        try {
            for (let i = 0; i < MAX_TURNS; i++) {
                const completion = await this.openai.chat.completions.create({
                    model: config.model,
                    messages: messages,
                    tools: tools,
                    tool_choice: "auto"
                });

                const message = completion.choices[0].message;

                // Capture thought process
                if (message.content && message.content.trim() !== "") {
                    onProgress?.(`💭 ${message.content}`);
                }

                // Sanitize content: Bedrock hates empty strings in content if tool_calls matches.
                if (message.content === "") {
                    message.content = null;
                }
                messages.push(message); // Add assistant message to history

                const toolCalls = message.tool_calls;

                if (toolCalls && toolCalls.length > 0) {
                    for (const toolCall of toolCalls) {
                        if (toolCall.type !== 'function') continue;

                        if (toolCall.function.name === 'submit_rename_plan') {
                            onProgress?.(`⚡️ Submitting plan...`);
                            const args = JSON.parse(toolCall.function.arguments);
                            return args as RenamePlan;
                        }

                        if (toolCall.function.name === 'read_file_content') {
                            const args = JSON.parse(toolCall.function.arguments);
                            onProgress?.(`⚡️ Reading file: ${args.path.split('/').pop()}...`);
                            const path = args.path;

                            // Execute tool (IPC call needs to be wrapped or mocked if not in renderer)
                            // Since this service runs in Renderer, we can use window.ipcRenderer
                            let contentResponse = "";
                            try {
                                // @ts-ignore
                                const result = await window.ipcRenderer.invoke('read-file-content', path);
                                if (result.success) {
                                    // Truncate to save context window
                                    contentResponse = result.content ? result.content.slice(0, 2000) : "[Empty File]";
                                } else {
                                    contentResponse = `Error: ${result.error}`;
                                }
                            } catch (e) {
                                contentResponse = `Error executing tool: ${(e as Error).message}`;
                            }

                            messages.push({
                                role: "tool",
                                tool_call_id: toolCall.id,
                                content: contentResponse
                            });
                        }

                        if (toolCall.function.name === 'read_image_exif') {
                            const args = JSON.parse(toolCall.function.arguments);
                            onProgress?.(`⚡️ Reading EXIF: ${args.path.split('/').pop()}...`);
                            const path = args.path;

                            let contentResponse = "";
                            try {
                                // @ts-ignore
                                const result = await window.ipcRenderer.invoke('read-image-exif', path);
                                if (result.success) {
                                    contentResponse = JSON.stringify(result.exif);
                                } else {
                                    contentResponse = `Error: ${result.error}`;
                                }
                            } catch (e) {
                                contentResponse = `Error executing tool: ${(e as Error).message}`;
                            }

                            messages.push({
                                role: "tool",
                                tool_call_id: toolCall.id,
                                content: contentResponse
                            });
                        }

                        if (toolCall.function.name === 'describe_image') {
                            const args = JSON.parse(toolCall.function.arguments);
                            onProgress?.(`👁️ Analyzing image: ${args.path.split('/').pop()}...`);
                            const path = args.path;

                            let contentResponse = "";
                            try {
                                // 1. Read Base64
                                // @ts-ignore
                                const result = await window.ipcRenderer.invoke('read-file-buffer', path);

                                if (!result.success || !result.buffer) {
                                    contentResponse = `Error reading image: ${result.error}`;
                                } else {
                                    // 2. Call Vision Model (StepFun)
                                    // Initialize a separate client for StepFun Vision
                                    const visionClient = new OpenAI({
                                        apiKey: "6gPqOUU4Q2BTSpUHERTfsM6kgbTfURu5ePAQNPxeiWO1jDr83vIJfd6Wydysdw8O2",
                                        baseURL: "https://api.stepfun.com/v1",
                                        dangerouslyAllowBrowser: true
                                    });

                                    const visionResponse = await visionClient.chat.completions.create({
                                        model: "step-1o-turbo-vision",
                                        messages: [
                                            {
                                                role: "user",
                                                content: [
                                                    { type: "text", text: "Describe this image in 10-15 words for a filename. Focus on the main subject and action." },
                                                    {
                                                        type: "image_url",
                                                        image_url: {
                                                            url: `data:image/jpeg;base64,${result.buffer}`
                                                        }
                                                    }
                                                ]
                                            }
                                        ],
                                        max_tokens: 100
                                    });

                                    contentResponse = visionResponse.choices[0].message.content || "No description generated.";
                                }
                            } catch (e) {
                                contentResponse = `Error executing vision analysis: ${(e as Error).message}`;
                            }

                            messages.push({
                                role: "tool",
                                tool_call_id: toolCall.id,
                                content: contentResponse
                            });
                        }
                    }
                } else {
                    // Just thinking...
                }
            }

            throw new Error("Maximum conversation turns reached without a plan.");

        } catch (e) {
            console.error("AI Generation Error:", e);
            throw e;
        }
    }
}

export const agentService = new AgentService();
