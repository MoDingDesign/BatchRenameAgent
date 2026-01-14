import { FileIcon, FolderIcon } from 'lucide-react'
import { ScrollArea } from "@/components/ui/scroll-area"

interface FileListProps {
    files: FileEntry[]
}

export function FileList({ files }: FileListProps) {
    if (files.length === 0) {
        return (
            <div className="text-center p-8 text-muted-foreground">
                No files found
            </div>
        )
    }

    return (
        <ScrollArea className="h-[400px] w-full rounded-md border p-4">
            <div className="space-y-2">
                {files.map((file, index) => (
                    <div
                        key={file.path + index}
                        className="flex items-center gap-2 p-2 rounded hover:bg-muted/50 text-sm"
                    >
                        {file.isDirectory ? (
                            <FolderIcon className="w-4 h-4 text-blue-500" />
                        ) : (
                            <FileIcon className="w-4 h-4 text-gray-500" />
                        )}
                        <span className="truncate flex-1">{file.name}</span>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {file.isDirectory ? 'Dir' : formatBytes(file.size || 0)}
                        </span>
                    </div>
                ))}
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
