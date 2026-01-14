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
                "border-2 border-dashed rounded-lg p-12 text-center transition-colors cursor-pointer",
                isDragging ? "border-primary bg-primary/10" : "border-muted-foreground/25 hover:border-primary/50",
                disabled && "opacity-50 cursor-not-allowed"
            )}
        >
            <div className="flex flex-col items-center justify-center gap-4">
                <div className="p-4 rounded-full bg-muted">
                    {isDragging ? (
                        <FolderOpen className="w-8 h-8 text-primary animate-bounce" />
                    ) : (
                        <Upload className="w-8 h-8 text-muted-foreground" />
                    )}
                </div>
                <div className="space-y-1">
                    <p className="text-lg font-medium">
                        {isDragging ? "Drop to scan" : "Click or drag folder here"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                        Select one or multiple files/folders
                    </p>
                </div>
            </div>
        </div>
    )
}
