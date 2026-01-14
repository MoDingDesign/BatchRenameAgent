

import { useState } from 'react'
import { DropZone } from '@/components/DropZone'
import { FileList } from '@/components/FileList'
import { Button } from '@/components/ui/button'
import { ChatInterface } from '@/components/ChatInterface'
import { RenamePlan } from '@/types/agent'
import { SettingsModal } from '@/components/SettingsModal'
import { agentService } from '@/lib/agent-service'

function App() {
  const [files, setFiles] = useState<FileEntry[]>([])
  const [currentPath, setCurrentPath] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  // Lifted State
  const [plan, setPlan] = useState<RenamePlan | null>(null)
  const [processingLogs, setProcessingLogs] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)

  const handleFilesSelected = async (paths: string[]) => {
    setIsLoading(true)
    // Reset state on new selection
    setPlan(null)
    setProcessingLogs([])
    setError(null)

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
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGeneratePlan = async (instruction: string) => {
    setIsLoading(true)
    setPlan(null)
    setProcessingLogs([])
    setError(null)

    try {
      const filePaths = files.map(f => f.path)
      const generatedPlan = await agentService.generateRenamePlan(filePaths, instruction, (msg) => {
        setProcessingLogs(prev => [...prev, msg])
      })
      setPlan(generatedPlan)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleApplyPlan = async () => {
    if (!plan) return
    setIsLoading(true)
    try {
      const result = await window.ipcRenderer.invoke('rename-files', plan)
      if (result.success) {
        // alert(`Successfully renamed ${result.count} files!`)
        // Clear everything after success
        // setFiles([]) 
        // setCurrentPath('')
        // setPlan(null)

        // Better UX: Refresh the file list to show new names, clear plan
        setPlan(null)
        setProcessingLogs([])
        // We'd ideally re-scan here. for now just clear to avoid staleness or maybe we can update local state?
        // Let's re-scan if we have a path. 
        // Actually, let's keep it simple: just clear plan and show files (which are now stale... we should refresh).
        // Since we don't store the root path easily for scattered files, let's clear.
        setFiles([])
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

  const handleClear = () => {
    setFiles([])
    setCurrentPath('')
    setPlan(null)
    setProcessingLogs([])
    setError(null)
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/10 overflow-hidden">
      {/* Dynamic Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-indigo-50/50 via-background to-blue-50/30 dark:from-indigo-950/20 dark:via-background dark:to-blue-950/20 -z-10" />

      <div className="max-w-5xl mx-auto h-screen flex flex-col p-4 md:p-6 gap-6 relative">
        {/* Header */}
        <header className="flex justify-between items-center py-2 shrink-0 z-10">
          <div className="flex items-center gap-3 select-none">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary to-violet-500 text-primary-foreground flex items-center justify-center font-bold text-lg shadow-md shadow-primary/20">
              S
            </div>
            <span className="font-semibold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">SmartRename</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground rounded-full"
            onClick={() => setIsSettingsOpen(true)}
          >
            Settings
          </Button>
        </header>

        <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />

        <main className="flex-1 flex flex-col min-h-0 relative z-0">
          {files.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="w-full max-w-lg space-y-8">
                <div className="text-center space-y-3">
                  <h2 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/60">Batch rename with AI</h2>
                  <p className="text-muted-foreground text-lg">
                    Drag text, images, or folders here to start.
                  </p>
                </div>
                <DropZone onFilesSelected={handleFilesSelected} disabled={isLoading} />
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-300 h-full relative">
              {/* Top Control Bar */}
              <div className="flex items-center justify-between px-2 shrink-0">
                <div className="flex items-center gap-3 text-sm">
                  <span className="bg-primary/10 text-primary px-2.5 py-1 rounded-full font-medium text-xs">
                    {files.length} items
                  </span>
                  <span className="truncate max-w-[300px] text-muted-foreground font-medium" title={currentPath}>
                    {currentPath}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClear}
                  className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors h-8 px-3 rounded-full text-xs"
                >
                  Clear
                </Button>
              </div>

              {/* Unified Smart Canvas */}
              <div className="flex-1 min-h-0 border rounded-3xl bg-card/50 backdrop-blur-sm shadow-xl shadow-indigo-500/5 overflow-hidden flex flex-col relative ring-1 ring-border/50">
                <div className="flex-1 overflow-hidden relative">
                  <FileList files={files} plan={plan} />
                </div>

                {/* Floating Command Bar Overlay */}
                <div className="absolute bottom-6 left-0 right-0 z-20 px-6 flex justify-center pointer-events-none">
                  <div className="w-full max-w-2xl pointer-events-auto">
                    <ChatInterface
                      onGenerate={handleGeneratePlan}
                      onApply={handleApplyPlan}
                      onCancel={() => setPlan(null)}
                      isLoading={isLoading}
                      plan={plan}
                      logs={processingLogs}
                      error={error}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default App
