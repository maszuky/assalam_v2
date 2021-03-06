

const electron = require('electron')
const { 
  app,  
  dialog,
  Menu,
  MenuItem,
  ipcMain,
  globalShortcut, 
  BrowserWindow
} = electron

Stream = require('node-rtsp-stream')
stream = new Stream({
  name: 'name',
  streamUrl: 'rtsp://192.168.0.31:554/live/0/MAIN',
  wsPort: 8082,
  ffmpegOptions: { // options ffmpeg flags
    '-stats': '', // an option with no neccessary value uses a blank string
    '-r': 30 // options with required values specify the value after the key
  }
})

let mainWindow
//variabel
const display = 'http://localhost/imasjid';
const pengaturan = 'http://localhost/imasjid/settings';
//const ipcam = 'rtsp://192.168.0.31:554/live/0/MAIN';
const path = require('path')
const modalPath = path.join('file://', __dirname, 'index.html')

app.on('ready', () => {
  const {width, height} = electron.screen.getPrimaryDisplay().workAreaSize
  mainWindow = new BrowserWindow({
    fullscreen: true,
    frame: false
  })
  mainWindow.loadURL(display)
})

// Fungsi Menu
const menu = new Menu()
menu.append(new MenuItem({
  label: 'Diplay (CTRL + X)',
  click() {
    mainWindow.loadURL(display)
    mainWindow.show()
  }
}))

menu.append(new MenuItem({
  label: 'Live Video (CTRL + L)',
  click() {
    mainWindow.loadURL(modalPath)
    mainWindow.show()
  }
}))

menu.append(new MenuItem({ type: 'separator' }))

menu.append(new MenuItem({
  label: 'Pengaturan (CTRL + P)',
  click() {
    mainWindow.loadURL(pengaturan)
    mainWindow.show()
  }
}))

menu.append(new MenuItem({
  label: 'Keluar (ESC)',
  click() {
    mainWindow.close();
  }
}))

app.on('browser-window-created', (event, winMenu) => {
  winMenu.webContents.on('context-menu', (e, params) => {
    menu.popup(winMenu, params.x, params.y)
  })
})

ipcMain.on('show-context-menu', (event) => {
  const winMenu = BrowserWindow.fromWebContents(event.sender)
  menu.popup(winMenu)
})

// Fungsi untuk keypress keyboard
app.on('ready', () => {
  globalShortcut.register('Esc', () => {
    mainWindow.close();
  })
})
app.on('ready', () => {
  globalShortcut.register('CommandOrControl+x', () => {
    mainWindow.loadURL(display)
    mainWindow.show()
  })
})
app.on('ready', () => {
  globalShortcut.register('CommandOrControl+l', () => {
    mainWindow.loadURL(modalPath)
    mainWindow.show()
  })
})
app.on('ready', () => {
  globalShortcut.register('CommandOrControl+p', () => {
    mainWindow.loadURL(pengaturan)
    mainWindow.show()
  })
})

app.on('will-quit', () => {
  globalShortcut.unregisterAll()
})
