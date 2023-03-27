// 在上下文隔离启用的情况下使用预加载
const { contextBridge, ipcRenderer, ipcMain, shell } = require('electron')
contextBridge.exposeInMainWorld('electron', {
  send: (channel: string, data: any) => ipcRenderer.invoke(channel, data), // 渲染进程向主进程发送信息
  // onUpdateCounter: (callback: any) => ipcRenderer.on('update-counter', callback), //
  onUpdateCounter: (channel: string, callback: any) => ipcRenderer.on(channel, callback), //
  onUpdate: (callback: any) => ipcRenderer.on('update-v', callback),
  open: (url: string) => shell.openExternal(url)
})
