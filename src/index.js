'use strict'
if (require('electron-squirrel-startup')) return
const {
  app,
  shell,
  BrowserWindow,
  Menu
} = require('electron')
let win = null
const gotTheLock = app.requestSingleInstanceLock()
if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    if (win) {
      if (win.isMinimized()) win.restore()
      win.show()
    }
  })
  app.on('ready', () => createWin())
}
app.on('window-all-closed', () => {
  if (process.platform != 'darwin') app.quit()
})

function createWin() {
  const menu = Menu.buildFromTemplate([{
    label: 'メニュー',
    submenu: [{
        label: 'リロード',
        accelerator: 'CmdOrCtrl+R',
        click: () => win.reload()
      },
      {
        label: 'デバッグ',
        accelerator: 'CmdOrCtrl+Shift+I',
        click: () => win.toggleDevTools()
      }
    ]
  }])
  Menu.setApplicationMenu(menu)
  win = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true
    },
    show: false,
    width: 960,
    height: 540,
    minWidth: 768,
    minHeight: 432,
    icon: `${__dirname}/images/icon.png`
  })
  win.once('ready-to-show', () => win.show())
  win.loadURL(`file://${__dirname}/index.html`)
  win.webContents.on('new-window', (ev, url) => {
    ev.preventDefault()
    shell.openExternal(url)
  })
  win.menuBarVisible = false
  win.on('closed', () => win = null)
}