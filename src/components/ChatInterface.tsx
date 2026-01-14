import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Loader2, Wand2, Check, X, ArrowRight } from "lucide-react"
import { agentService } from '@/lib/agent-service'
import { RenamePlan } from '@/types/agent'

interface ChatInterfaceProps {
    files: FileEntry[]
    onApplyPlan: (plan: RenamePlan) => void
}

export function ChatInterface({ files, onApplyPlan }: ChatInterfaceProps) {
    const [instruction, setInstruction] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [logs, setLogs] = useState<string[]>([])
    const [plan, setPlan] = useState<RenamePlan | null>(null)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async () => {
        if (!instruction.trim()) return

        setIsLoading(true)
        setError(null)
        setPlan(null)
        setLogs([]) // Clear previous logs

        try {
            // Filter out directories from the list sent to AI, assuming we rename files inside?
            // Or send everything. Let's send everything for context.
            const filePaths = files.map(f => f.path)

            const generatedPlan = await agentService.generateRenamePlan(filePaths, instruction, (msg) => {
                setLogs(prev => [...prev, msg])
            })

            setPlan(generatedPlan)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error occurred')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex flex-col h-full gap-4">
            {/* Diff Preview Area */}
            <div className="flex-1 min-h-0 border rounded-lg bg-card overflow-hidden flex flex-col">
                <div className="p-2 border-b bg-muted/30 font-medium text-sm flex justify-between items-center">
                    <span>Preview Changes</span>
                    {plan && <span className="text-xs text-muted-foreground">{plan.summary}</span>}
                </div>

                <ScrollArea className="flex-1 p-4">
                    {!plan && !isLoading && !error && (
                        <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-50">
                            <Wand2 className="w-12 h-12 mb-2" />
                            <p>Enter instructions below to generate a preview</p>
                        </div>
                    )}

                    {/* Progress / Logs Area */}
                    {(isLoading || logs.length > 0) && !plan && !error && (
                        <div className="space-y-2 mb-4 font-mono text-xs text-muted-foreground">
                            {logs.map((log, i) => (
                                <div key={i} className="animate-in fade-in slide-in-from-bottom-1 duration-300">
                                    {log}
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex items-center gap-2 text-primary/70 pt-2">
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                    <span>Thinking...</span>
                                </div>
                            )}
                        </div>
                    )}

                    {error && (
                        <div className="p-4 rounded-md bg-destructive/10 text-destructive text-sm">
                            Error: {error}
                        </div>
                    )}

                    {plan && (
                        <div className="space-y-4">
                            {plan.operations.length === 0 ? (
                                <p className="text-center text-muted-foreground">No files match criteria.</p>
                            ) : (
                                plan.operations.map((op, idx) => (
                                    <div key={idx} className="flex items-center gap-2 text-sm p-2 rounded bg-muted/50">
                                        <div className="flex-1 font-mono text-xs truncate text-red-500/80" title={op.original}>
                                            {op.original.split('/').pop()}
                                        </div>
                                        <ArrowRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                                        <div className="flex-1 font-mono text-xs truncate text-green-600 font-bold" title={op.new}>
                                            {op.new.split('/').pop()}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </ScrollArea>

                {/* Confirm Actions */}
                {plan && plan.operations.length > 0 && (
                    <div className="p-4 border-t bg-muted/20 flex justify-end gap-2">
                        <Button variant="ghost" onClick={() => setPlan(null)}>
                            <X className="w-4 h-4 mr-1" /> Discard
                        </Button>
                        <Button onClick={() => onApplyPlan(plan)}>
                            <Check className="w-4 h-4 mr-1" /> Apply Changes
                        </Button>
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="flex gap-2">
                <Textarea
                    value={instruction}
                    onChange={(e) => setInstruction(e.target.value)}
                    placeholder="e.g. Replace spaces with underscores, or add date prefix..."
                    className="resize-none min-h-[50px] shadow-sm"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault()
                            handleSubmit()
                        }
                    }}
                />
                <Button
                    className="h-auto w-14"
                    onClick={handleSubmit}
                    disabled={isLoading || !instruction.trim()}
                >
                    <ArrowRight className="w-5 h-5" />
                </Button>
            </div>
        </div>
    )
}
