import { app, BrowserWindow, shell, dialog, ipcMain } from 'electron'
import { release } from 'node:os'
import { join } from 'node:path'
import { createWebService } from '../web/main'
import { useBaseConfigStore } from '../store/counter'

process.env.DIST_ELECTRON = join(__dirname, '..')
process.env.DIST = join(process.env.DIST_ELECTRON, '../dist')
process.env.VITE_PUBLIC = process.env.VITE_DEV_SERVER_URL
  ? join(process.env.DIST_ELECTRON, '../public')
  : process.env.DIST

// Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1')) app.disableHardwareAcceleration()

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}


// 启动一个web服务
createWebService('127.0.0.1', 18273)


let win: BrowserWindow | null = null
// Here, you can also use other preload
const preload = join(__dirname, '../preload/index.js')
const url = process.env.VITE_DEV_SERVER_URL
const indexHtml = join(process.env.DIST, 'index.html')

const width = 1280
const height = 720

async function createWindow() {
  win = new BrowserWindow({
    title: 'UniTranslateTool',
    width: width,
    minWidth: 1000,
    height: height,
    minHeight: 700,
    icon: join(process.env.VITE_PUBLIC, 'favicon.ico'),
    frame: false, /*去掉顶部导航 去掉关闭按钮 最大化最小化按钮*/
    webPreferences: {
      preload,
      // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
      // Consider using contextBridge.exposeInMainWorld
      // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
      nodeIntegration: true,
      contextIsolation: false,
    },
  })

  if (process.env.VITE_DEV_SERVER_URL) { // electron-vite-vue#298
    win.loadURL(url)
    // Open devTool if the app is not packaged
    win.webContents.openDevTools()
  } else {
    win.loadFile(indexHtml)
  }

  // Test actively push message to the Electron-Renderer
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString())
  })

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url)
    return { action: 'deny' }
  })
  // win.webContents.on('will-navigate', (event, url) => { }) #344

  win.on('resize', () => {
    const isFullScreen = win.isFullScreen()
    win.webContents.send('windowResizeEvent', isFullScreen)
  })

  ipcMain.on('windows-min', () => {
    win.minimize()
  })
  
  ipcMain.on('windows-max', () => {
    const sys = process.platform
    if (win.isMaximized()) {
      if (sys == 'darwin') {
        win.setContentSize(width, height);
      } else {
        win.restore()
      }
    } else {
      if (sys == 'darwin') {
        win.setFullScreen(!win.isFullScreen())
      } else {
        win.maximize()
      }
    }
  })
  
  ipcMain.on('windows-close', () => {
    app.quit()
  })
  
  ipcMain.on('windows-full-screen', () => {
    (win as any).setFullScreen(!(win as any).isFullScreen())
  })
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  win = null
  if (process.platform !== 'darwin') app.quit()
})

app.on('second-instance', () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore()
    win.focus()
  }
})

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows()
  if (allWindows.length) {
    allWindows[0].focus()
  } else {
    createWindow()
  }
})



// New window example arg: new windows url
ipcMain.handle('open-win', (_, arg) => {
  const childWindow = new BrowserWindow({
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: false,
    },
  })

  if (process.env.VITE_DEV_SERVER_URL) {
    childWindow.loadURL(`${url}#${arg}`)
  } else {
    childWindow.loadFile(indexHtml, { hash: arg })
  }
})


ipcMain.on('save-base-config', (_, data: {path: string}) => {
  useBaseConfigStore.set({defaultOutPutPath: data.path})
})
ipcMain.on('get-base-config', (e, _) => {
  const baseConfig = useBaseConfigStore.get()
  e.reply('get-base-config-back', baseConfig ?? {defaultOutPutPath: ''})
})

ipcMain.on('windows-select-dir', (e, data) => {
  let select = dialog.showOpenDialogSync(win, {
    properties: ['openDirectory']
  })

  select ??= []

  let selectStr = select.length <= 0 ? '' : select[0]

  e.reply('windows-select-dir-back', {
    e: data.e,
    path: selectStr
  })
})