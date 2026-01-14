
import { useState } from 'react'
import { DropZone } from '@/components/DropZone'
import { FileList } from '@/components/FileList'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { ChatInterface } from '@/components/ChatInterface'
import { RenamePlan } from '@/types/agent'

function App() {
  const [files, setFiles] = useState<FileEntry[]>([])
  const [currentPath, setCurrentPath] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)

  const handleFilesSelected = async (paths: string[]) => {
    setIsLoading(true)
    try {
      setFiles([])

      // If multiple files, show count. If single, show path.
      if (paths.length === 1) {
        setCurrentPath(paths[0])
      } else {
        setCurrentPath(`${paths.length} items selected`)
      }

      const entries = await window.ipcRenderer.invoke('scan-directory', paths)

      setFiles(entries)

      if (entries.length === 0) {
        // Handle empty case
      }
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }

  const handleApplyPlan = async (plan: RenamePlan) => {
    setIsLoading(true)
    try {
      const result = await window.ipcRenderer.invoke('rename-files', plan)
      if (result.success) {
        // Refresh files
        // We need to re-scan. Assuming valid path context from earlier logic
        // But files might be scattered.
        // For simple MVP: refresh the list using the last known paths?
        // Actually, if we selected random files, re-scanning might be tricky if we don't track parent dirs.
        // Let's just clear selection or show success message.
        alert(`Successfully renamed ${result.count} files!`)
        setFiles([]) // Clear for now
        setCurrentPath('')
      } else {
        alert(`Failed to rename: ${result.error} `)
      }
    } catch (e) {
      console.error(e)
      alert('Error executing rename')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col p-6 gap-6">
      <header className="flex justify-between items-center pb-6 border-b">
        <div>
          <h1 className="text-2xl font-bold">SmartRename</h1>
          <p className="text-sm text-muted-foreground">AI-Powered Batch Renaming</p>
        </div>
        <Button variant="outline" size="sm">Settings</Button>
      </header>

      <main className="flex-1 flex flex-col gap-6 overflow-hidden relative">
        {isLoading && (
          <div className="absolute inset-0 bg-background/50 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-sm font-medium">Scanning...</p>
            </div>
          </div>
        )}

        {files.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center">
            <DropZone onFilesSelected={handleFilesSelected} disabled={isLoading} />
            {!isLoading && currentPath && (
              <p className="mt-4 text-xs text-red-500">
                No files found or invalid selection
              </p>
            )}
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center gap-4 animate-in fade-in slide-in-from-bottom-4">
            <div className="w-full flex justify-between items-center px-2">
              <span className="text-sm font-mono text-muted-foreground truncate max-w-[500px]" title={currentPath}>
                {currentPath}
              </span>
              <Button variant="ghost" size="sm" onClick={() => { setFiles([]); setCurrentPath('') }}>
                Clear
              </Button>
            </div>
            <FileList files={files} />

            {/* Placeholder for Input Area */}
            <div className="w-full flex-1 min-h-0 border-t pt-4">
              <ChatInterface files={files} onApplyPlan={handleApplyPlan} />
            </div>
          </div>
        )}
      </main>
    </div>
  )
}


export default App
