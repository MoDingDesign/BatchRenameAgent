import { X } from 'lucide-react'
import { Button } from './ui/button'
import { useEffect, useState } from 'react'
import { getAIConfig, saveAIConfig, AIConfig } from '@/lib/ai-config'

interface SettingsModalProps {
    isOpen: boolean
    onClose: () => void
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
    const [config, setConfig] = useState<AIConfig>(getAIConfig())

    useEffect(() => {
        if (isOpen) {
            setConfig(getAIConfig())
        }
    }, [isOpen])

    const handleSave = () => {
        saveAIConfig(config)
        onClose()
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-md bg-background rounded-3xl shadow-2xl border border-white/20 overflow-hidden animate-in zoom-in-95 duration-200 scale-100 ring-1 ring-black/5">
                <div className="flex items-center justify-between p-5 border-b bg-muted/30">
                    <h2 className="text-lg font-semibold tracking-tight">Settings</h2>
                    <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0 rounded-full hover:bg-black/5">
                        <X className="w-4 h-4" />
                    </Button>
                </div>

                <div className="p-6 space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Base URL
                        </label>
                        <input
                            type="text"
                            className="flex h-10 w-full rounded-xl border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="https://api.openai.com/v1"
                            value={config.baseUrl}
                            onChange={(e) => setConfig({ ...config, baseUrl: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            API Key
                        </label>
                        <input
                            type="password"
                            className="flex h-10 w-full rounded-xl border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="sk-..."
                            value={config.apiKey}
                            onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
                        />
                        <p className="text-[0.8rem] text-muted-foreground">
                            Stored locally in your browser.
                        </p>
                    </div>

                    <div className="space-y-3">
                        <label className="text-sm font-medium">Model</label>
                        <div className="grid grid-cols-2 gap-2">
                            {['gpt-4o', 'claude-3-5-sonnet-20241022'].map((m) => (
                                <Button
                                    key={m}
                                    variant={config.model === m ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setConfig({ ...config, model: m })}
                                    className="w-full justify-start px-3 rounded-lg truncate"
                                    title={m}
                                >
                                    {m}
                                </Button>
                            ))}
                        </div>
                        <input
                            type="text"
                            className="flex h-9 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-xs shadow-sm placeholder:text-muted-foreground/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            placeholder="Custom model name..."
                            value={config.model}
                            onChange={(e) => setConfig({ ...config, model: e.target.value })}
                        />
                    </div>
                </div>

                <div className="p-4 bg-muted/30 flex justify-end gap-3">
                    <Button variant="ghost" onClick={onClose} className="rounded-xl">Cancel</Button>
                    <Button onClick={handleSave} className="rounded-xl shadow-lg shadow-primary/20">Save Configuration</Button>
                </div>
            </div>
        </div>
    )
}
