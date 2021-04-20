'use strict'
const { contextBridge, ipcRenderer} = require("electron")
const nowVersion = ipcRenderer.sendSync('now-version')
document.addEventListener('DOMContentLoaded', () => {
  if (nowVersion) document.getElementById('version').textContent = nowVersion
}, false)