/// <reference types="vite/client" />

import { RenamePlan } from './types/agent'

declare global {
    interface FileEntry {
        path: string
        name: string
        isDirectory: boolean
        size?: number
    }

    interface Window {
        ipcRenderer: {
            invoke(channel: 'scan-directory', path: string | string[]): Promise<FileEntry[]>
            invoke(channel: 'open-dialog'): Promise<string[] | null>
            invoke(channel: 'read-file-content', path: string): Promise<{ success: boolean, content?: string, error?: string }>
            invoke(channel: 'read-image-exif', path: string): Promise<{ success: boolean, exif?: any, error?: string }>
            invoke(channel: 'read-file-buffer', path: string): Promise<{ success: boolean, buffer?: string, error?: string }>
            invoke(channel: 'rename-files', plan: RenamePlan): Promise<{ success: boolean, count: number, error?: string }>
            on(channel: string, func: (...args: any[]) => void): void
            off(channel: string, func: (...args: any[]) => void): void
            send(channel: string, ...args: any[]): void
        }
    }
}
