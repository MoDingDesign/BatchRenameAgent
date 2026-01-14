import { app, BrowserWindow, ipcMain, dialog } from 'electron'
import { stat, rename, readFile } from 'node:fs/promises'
import exifr from 'exifr'
import fg from 'fast-glob'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, '..')

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST

let win: BrowserWindow | null

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
    },
  })

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(RENDERER_DIST, 'index.html'))
  }
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.whenReady().then(() => {
  ipcMain.handle('scan-directory', async (_event, inputPaths: string | string[]) => {
    try {
      const paths = Array.isArray(inputPaths) ? inputPaths : [inputPaths]
      const results: any[] = []

      for (const p of paths) {
        try {
          const stats = await stat(p)

          if (!stats.isDirectory()) {
            results.push({
              path: p,
              name: path.basename(p),
              isDirectory: false,
              size: stats.size
            })
            continue
          }

          // If directory, scan it
          const entries = await fg(['*'], {
            cwd: p,
            stats: true,
            onlyFiles: false,
            absolute: true,
            deep: 1
          })

          const fileEntries = entries.map(entry => ({
            path: entry.path,
            name: entry.name,
            isDirectory: entry.dirent.isDirectory(),
            size: entry.stats?.size
          }))
          results.push(...fileEntries)
        } catch (err) {
          console.error(`Failed to process path ${p}:`, err)
        }
      }

      // Deduplicate by path
      const uniqueResults = Array.from(new Map(results.map(item => [item.path, item])).values())

      return uniqueResults
    } catch (error) {
      console.error('Failed to scan paths:', error)
      return []
    }
  })

  ipcMain.handle('open-dialog', async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog({
      properties: ['openDirectory', 'openFile', 'multiSelections']
    })
    if (canceled) {
      return null
    } else {
      return filePaths
    }
  })

  ipcMain.handle('rename-files', async (_event, plan: any) => {
    // Basic validation
    if (!plan || !Array.isArray(plan.operations)) {
      return { success: false, error: 'Invalid plan format' }
    }

    let successCount = 0
    let firstError = ''

    for (const op of plan.operations) {
      try {
        if (op.original && op.new) {
          await rename(op.original, op.new)
          successCount++
        }
      } catch (err) {
        console.error(`Rename failed for ${op.original} -> ${op.new}`, err)
        if (!firstError) firstError = (err as Error).message
      }
    }

    if (successCount === plan.operations.length) {
      return { success: true, count: successCount }
    } else {
      return { success: false, count: successCount, error: firstError || 'Partial failure' }
    }
  })

  ipcMain.handle('read-file-content', async (_event, filePath: string) => {
    try {
      const stats = await stat(filePath)
      // Limit to 50KB to avoid huge payloads
      if (stats.size > 50 * 1024) {
        return { success: false, error: 'File too large (>50KB)' }
      }

      const buffer = await readFile(filePath)

      // Simple heuristic for binary check: look for null bytes
      if (buffer.indexOf(0) !== -1) {
        return { success: false, error: 'Binary file detected' }
      }

      return { success: true, content: buffer.toString('utf-8') }
    } catch (error) {
      console.error('Failed to read file:', error)
      return { success: false, error: (error as Error).message }
    }
  })

  ipcMain.handle('read-image-exif', async (_event, filePath: string) => {
    try {
      const output = await exifr.parse(filePath)
      return { success: true, exif: output }
    } catch (error) {
      console.error('Failed to read EXIF:', error)
      return { success: false, error: (error as Error).message }
    }
  })

  ipcMain.handle('read-file-buffer', async (_event, filePath: string) => {
    try {
      const stats = await stat(filePath)
      // Limit to 5MB for images to avoid crashing or huge tokens
      if (stats.size > 5 * 1024 * 1024) {
        return { success: false, error: 'File too large (>5MB)' }
      }

      const buffer = await readFile(filePath)
      return { success: true, buffer: buffer.toString('base64') }
    } catch (error) {
      console.error('Failed to read file buffer:', error)
      return { success: false, error: (error as Error).message }
    }
  })

  createWindow()
})
