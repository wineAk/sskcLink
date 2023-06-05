'use strict'
if (require('electron-squirrel-startup')) return
const {app, BrowserWindow, ipcMain, Menu, shell} = require('electron')
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
ipcMain.on('now-version', (event) => {
  const packagejson = require('./package.json')
  event.returnValue = packagejson['version']
})

function createWin() {
  const path = require('path')
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
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'js', 'preload.js')
    },
    show: false,
    width: 768,
    height: 432,
    minWidth: 512,
    minHeight: 432,
    icon: `${__dirname}/images/icon.png`
  })
  win.once('ready-to-show', () => win.show())
  win.loadFile(path.join(__dirname, 'index.html'))
  win.webContents.on('new-window', (ev, url) => {
    ev.preventDefault()
    shell.openExternal(url)
  })
  win.menuBarVisible = false
  win.on('closed', () => win = null)
}