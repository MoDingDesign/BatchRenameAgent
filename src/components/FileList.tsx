import { FileIcon, FolderIcon, ArrowRight, Minus } from 'lucide-react'
import { ScrollArea } from "@/components/ui/scroll-area"
import { RenamePlan } from '@/types/agent'
import { cn } from '@/lib/utils'

interface FileListProps {
    files: FileEntry[]
    plan: RenamePlan | null
}

export function FileList({ files, plan }: FileListProps) {
    if (files.length === 0) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground/50 text-sm gap-2">
                <div className="w-12 h-12 rounded-full bg-muted/30 flex items-center justify-center">
                    <FileIcon className="w-6 h-6 opacity-50" />
                </div>
                <span>No files to display</span>
            </div>
        )
    }

    // Create a map for faster lookup if plan exists
    const operationMap = new Map<string, string>();
    if (plan) {
        plan.operations.forEach(op => {
            operationMap.set(op.original, op.new);
        });
    }

    return (
        <ScrollArea className="h-full w-full">
            <div className="flex flex-col min-w-full pb-24">
                {/* Header */}
                <div className="flex items-center gap-4 px-6 py-3 text-xs font-semibold text-muted-foreground border-b bg-muted/40 sticky top-0 z-10 backdrop-blur-md uppercase tracking-wider">
                    <div className="flex-1">Original Filename</div>
                    {plan && <div className="w-6"></div>}
                    {plan && <div className="flex-1 text-green-600/80">New Filename</div>}
                    <div className="w-24 text-right">Size</div>
                </div>

                <div className="p-2 space-y-1">
                    {files.map((file, index) => {
                        const newPath = plan ? operationMap.get(file.path) : undefined;
                        const newName = newPath ? newPath.split('/').pop() : undefined;
                        const isRenamed = !!newName && newName !== file.name;

                        return (
                            <div
                                key={file.path + index}
                                className={cn(
                                    "group flex items-center gap-4 px-4 py-3 rounded-xl transition-all text-sm border border-transparent",
                                    isRenamed
                                        ? "bg-green-50/50 hover:bg-green-100/50 border-green-100 dark:bg-green-950/10 dark:hover:bg-green-900/20 dark:border-green-900/30"
                                        : "hover:bg-white/50 dark:hover:bg-white/5"
                                )}
                            >
                                {/* Original Name Column */}
                                <div className="flex-1 flex items-center gap-3 min-w-0">
                                    {file.isDirectory ? (
                                        <FolderIcon className="w-5 h-5 text-blue-400/80 shrink-0" />
                                    ) : (
                                        <FileIcon className="w-5 h-5 text-slate-400 shrink-0" />
                                    )}
                                    <span className={cn(
                                        "truncate font-medium transition-colors",
                                        isRenamed ? "text-muted-foreground line-through decoration-slate-300" : "text-foreground/80"
                                    )}>
                                        {file.name}
                                    </span>
                                </div>

                                {/* Arrow Column (only if plan) */}
                                {plan && (
                                    <div className="w-6 flex items-center justify-center shrink-0">
                                        {isRenamed ? (
                                            <ArrowRight className="w-4 h-4 text-green-500/50" />
                                        ) : (
                                            <Minus className="w-3 h-3 text-slate-200 dark:text-slate-800" />
                                        )}
                                    </div>
                                )}

                                {/* New Name Column (only if plan) */}
                                {plan && (
                                    <div className="flex-1 min-w-0">
                                        {isRenamed ? (
                                            <span className="truncate font-semibold text-green-600 dark:text-green-400 block p-1 rounded">
                                                {newName}
                                            </span>
                                        ) : (
                                            <span className="text-muted-foreground/30 italic text-xs pl-1">
                                                Unchanged
                                            </span>
                                        )}
                                    </div>
                                )}

                                {/* Size Column */}
                                <span className="text-xs text-muted-foreground/50 tabular-nums w-24 text-right shrink-0">
                                    {file.isDirectory ? '--' : formatBytes(file.size || 0)}
                                </span>
                            </div>
                        )
                    })}
                </div>
            </div>
        </ScrollArea>
    )
}

function formatBytes(bytes: number, decimals = 2) {
    if (!+bytes) return '0 B'
    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}
