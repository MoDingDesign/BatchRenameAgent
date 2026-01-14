import React, { useCallback, useState } from 'react'
import { FolderOpen, Upload } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DropZoneProps {
    onFilesSelected: (paths: string[]) => void
    disabled?: boolean
}

export function DropZone({ onFilesSelected, disabled }: DropZoneProps) {
    const [isDragging, setIsDragging] = useState(false)

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        if (disabled) return
        setIsDragging(true)
    }, [disabled])

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
    }, [])

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
        if (disabled) return

        const files = Array.from(e.dataTransfer.files)
        if (files.length > 0) {
            const paths = files.map(f => (f as File & { path: string }).path)
            onFilesSelected(paths)
        }
    }, [disabled, onFilesSelected])

    const handleClick = useCallback(async () => {
        if (disabled) return
        const paths = await window.ipcRenderer.invoke('open-dialog')
        if (paths && paths.length > 0) {
            onFilesSelected(paths)
        }
    }, [disabled, onFilesSelected])

    return (
        <div
            onClick={handleClick}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
                "group relative overflow-hidden rounded-2xl border transition-all duration-300 cursor-pointer h-64 flex flex-col items-center justify-center gap-6",
                isDragging
                    ? "border-primary ring-2 ring-primary/20 bg-primary/5 scale-[1.01]"
                    : "border-border hover:border-primary/50 hover:bg-muted/50",
                disabled && "opacity-50 cursor-not-allowed pointer-events-none"
            )}
        >
            <div className={cn(
                "p-5 rounded-2xl transition-all duration-300 ring-1 ring-border shadow-sm",
                isDragging ? "bg-background scale-110 shadow-lg" : "bg-card group-hover:shadow-md"
            )}>
                {isDragging ? (
                    <FolderOpen className="w-8 h-8 text-primary animate-bounce-short" />
                ) : (
                    <Upload className="w-8 h-8 text-muted-foreground group-hover:text-foreground transition-colors" />
                )}
            </div>

            <div className="text-center space-y-1 z-10">
                <p className="text-lg font-medium text-foreground group-hover:text-primary transition-colors">
                    {isDragging ? "Release to scan" : "Click or drag folder"}
                </p>
                <p className="text-sm text-muted-foreground max-w-[240px] mx-auto leading-relaxed">
                    Support for files and folders.
                </p>
            </div>

            {/* Subtle background pattern could go here if needed, keeping it clean for now */}
        </div>
    )
}
