export interface AIConfig {
    provider: 'custom'
    baseUrl: string
    apiKey: string
    model: string
}

export const defaultConfig: AIConfig = {
    provider: 'custom',
    baseUrl: 'https://xiaoai.plus/v1',
    apiKey: 'sk-UgVcxqxRam8M5zW9TN9uhtgiJThNzCOyuyunwsgL1O6roAIh',
    model: 'claude-3-5-sonnet-20241022'
}

export function getAIConfig(): AIConfig {
    const stored = localStorage.getItem('ai-config')
    if (stored) {
        try {
            return JSON.parse(stored)
        } catch {
            return defaultConfig
        }
    }
    return defaultConfig
}

export function saveAIConfig(config: AIConfig) {
    localStorage.setItem('ai-config', JSON.stringify(config))
}
