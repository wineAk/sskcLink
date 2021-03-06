'use strict'
if (require('electron-squirrel-startup')) return
const packagejson = require('./package.json')
const {app, BrowserWindow, ipcMain, Menu, shell} = require('electron')
const path = require('path')
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
  event.returnValue = packagejson['version']
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
  console.log('app.getAppPath()', app.getAppPath());
  win = new BrowserWindow({
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'js\\preload.js')
    },
    show: false,
    width: 768,
    height: 432,
    minWidth: 512,
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