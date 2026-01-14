import { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Wand2, ArrowRight, Check, X } from "lucide-react"
import { RenamePlan } from '@/types/agent'
import { cn } from '@/lib/utils'

interface ChatInterfaceProps {
    onGenerate: (instruction: string) => void
    onApply: () => void
    onCancel: () => void
    isLoading: boolean
    plan: RenamePlan | null
    logs: string[]
    error: string | null
}

export function ChatInterface({
    onGenerate,
    onApply,
    onCancel,
    isLoading,
    plan,
    logs,
    error
}: ChatInterfaceProps) {
    const [instruction, setInstruction] = useState('')
    // Auto-scroll logs
    const logsEndRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (logsEndRef.current) {
            logsEndRef.current.scrollIntoView({ behavior: 'smooth' })
        }
    }, [logs])

    const handleSubmit = () => {
        if (!instruction.trim()) return
        onGenerate(instruction)
    }

    return (
        <div className="flex flex-col gap-4 w-full">
            {/* Logs / Status Area (Floating above input) */}
            {(isLoading || logs.length > 0 || error) && !plan && (
                <div className="bg-background/80 backdrop-blur-xl border shadow-lg rounded-2xl p-4 max-h-[200px] overflow-y-auto animate-in slide-in-from-bottom-2 flex flex-col gap-2">
                    {logs.map((log, i) => (
                        <div key={i} className="flex gap-2 text-sm text-muted-foreground items-start font-mono">
                            <span className="text-primary/50 shrink-0 mt-0.5">❯</span>
                            <span>{log}</span>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex gap-2 text-sm text-primary animate-pulse items-center font-medium">
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            Thinking...
                        </div>
                    )}
                    {error && (
                        <div className="flex gap-2 text-sm text-destructive items-center font-medium bg-destructive/5 p-2 rounded-lg border border-destructive/10">
                            <X className="w-4 h-4" />
                            {error}
                        </div>
                    )}
                    <div ref={logsEndRef} />
                </div>
            )}

            {/* Main Command Bar */}
            <div className={cn(
                "relative transition-all duration-300 w-full max-w-2xl mx-auto",
                plan ? "" : ""
            )}>
                {plan ? (
                    // Confirmation Mode - Compact Pill
                    <div className="bg-background/90 backdrop-blur-2xl border shadow-2xl rounded-full p-1.5 ring-1 ring-black/5 dark:ring-white/10 flex items-center gap-2 animate-in fade-in zoom-in-95">
                        <div className="flex-1 min-w-0 px-4">
                            <div className="flex items-center gap-2">
                                <span className="font-semibold text-sm whitespace-nowrap">Plan Ready</span>
                                <span className="text-muted-foreground/30">|</span>
                                <span className="text-xs text-muted-foreground truncate max-w-[200px]">{plan.summary}</span>
                            </div>
                        </div>
                        <div className="flex gap-1 shrink-0">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={onCancel}
                                className="rounded-full w-9 h-9 hover:bg-muted text-muted-foreground hover:text-foreground"
                                title="Cancel"
                            >
                                <X className="w-4 h-4" />
                            </Button>
                            <Button
                                onClick={onApply}
                                disabled={isLoading}
                                className="rounded-full px-4 bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm h-9"
                            >
                                {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-2" /> : <Check className="w-3.5 h-3.5 mr-2" />}
                                Apply
                            </Button>
                        </div>
                    </div>
                ) : (
                    // Input Mode - ChatGPT Style Pill
                    <div className="bg-background shadow-2xl rounded-[26px] border ring-1 ring-black/5 dark:ring-white/10 flex items-end p-2 gap-2 relative transition-all focus-within:ring-2 focus-within:ring-primary/20">
                        <div className="pl-3 py-2.5 flex items-center justify-center text-muted-foreground/40 shrink-0">
                            <Wand2 className="w-5 h-5" />
                        </div>
                        <Textarea
                            value={instruction}
                            onChange={(e) => setInstruction(e.target.value)}
                            placeholder="Ask rename to..."
                            disabled={isLoading}
                            className="flex-1 min-h-[44px] max-h-[200px] bg-transparent border-0 ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 resize-none py-3 px-2 placeholder:text-muted-foreground/40 text-base shadow-none leading-relaxed"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
                                    e.preventDefault()
                                    handleSubmit()
                                }
                            }}
                        />
                        <div className="pb-1 pr-1 shrink-0">
                            <Button
                                size="icon"
                                className={cn(
                                    "w-8 h-8 rounded-full shadow-none transition-all duration-200",
                                    instruction.trim() ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                                )}
                                onClick={handleSubmit}
                                disabled={isLoading || !instruction.trim()}
                            >
                                {isLoading ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <ArrowRight className="w-4 h-4" />
                                )}
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* Hint Text */}
            {!plan && !isLoading && !error && instruction.length === 0 && (
                <div className="text-center text-xs text-muted-foreground/40 animate-in fade-in delay-500">
                    Press <kbd className="font-mono bg-muted/50 px-1 rounded">Enter</kbd> to generate plan
                </div>
            )}
        </div>
    )
}
