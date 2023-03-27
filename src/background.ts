'use strict'

import { app, protocol, BrowserWindow, globalShortcut, Menu, ipcRenderer, ipcMain, dialog } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS3_DEVTOOLS } from 'electron-devtools-installer'
import { initContents, initModels, sqlLink, initOracleClient } from '@/views/electronIpcRenderer'

const isDevelopment = process.env.NODE_ENV !== 'production'
const path = require('path')

// 解压和移动相关
const fs = require('fs')
const adm_zip = require('adm-zip')
const packageModele = require('../package.json')
console.log('当前版本号', packageModele.version)

let win// 主程序
let filepath = ''// 安装程序路径
let winFilepath = ''// win 安装路径
let codeType = 0// 1:前端代码 2:后台代码 3:更新文件
// 获取用户安装路径
filepath = app.getAppPath()
winFilepath = filepath.replace('app.asar', '')// 替换目录
console.log('用户安装路径', filepath)
console.log('替换路径', winFilepath)

// 提示框弹框
ipcMain.handle('message', async(event, args) => {
  win.webContents.send('el-message', args)
})

// 数据库登录
ipcMain.handle('sql-link', async(event, args) => {
  return await sqlLink(event, args)
})
// 初始化oracle客户端
ipcMain.handle('oracle-init', async(event, args) => {
  return await initOracleClient(event, args)
})
// 数据库查询
ipcMain.handle('sql-list', async(event, args) => {
  return await initModels(event, args)
})
// 获取数据库模块
ipcMain.handle('sql-module', async(event, args) => {
  return await initContents(event, args)
})
// 获取文件路径
ipcMain.handle('dialog:openFile', handleFileOpen)

async function handleFileOpen() {
  // 选择文件夹
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ['openDirectory']
  })
  if (canceled) {
    // return
  } else {
    return filePaths[0]
  }
}

// 下载文件
let downloadArgs: any = null
ipcMain.handle('download', (event, args) => fileOpen(args))
ipcMain.handle('code-download', (event, args) => fileOpen(args))

async function fileOpen(args: any) {
  downloadArgs = null
  codeType = args.codeType
  console.log(process.platform)
  console.log(args)
  downloadArgs = args
  // 下载路径
  win.webContents.downloadURL(args.path)
}

async function willDownload() {
  win.webContents.session.on('will-download', (event, item, webContents) => {
    const filename = item.getFilename()
    console.log('下载名称', filename)
    if (downloadArgs && downloadArgs.pathUrl) {
      // 无需对话框提示， 直接将文件保存到路径、
      item.setSavePath(downloadArgs.pathUrl + '/' + filename)
    } else {
      // 无需对话框提示， 直接将文件保存到路径、
      item.setSavePath(winFilepath + filename)
    }

    // 下载进度
    let value = 0
    item.on('updated', (event, state) => {
      if (state === 'interrupted') {
        console.log('Download is interrupted but can be resumed')
        console.log('下载已经中断，可以恢复')
      } else if (state === 'progressing') {
        if (item.isPaused()) {
          console.log('Download is paused')
          console.log('下载已暂停')
        } else {
          console.log(`Received bytes: ${item.getReceivedBytes()}`)
          console.log(`接收的字节数：${item.getReceivedBytes()}`, `总字节数：${item.getTotalBytes()}`)
          if (item.getReceivedBytes() && item.getTotalBytes()) {
            value = parseFloat((item.getReceivedBytes() / item.getTotalBytes()))
          }
          if (value === 1) {
            value = -1
          }
          win.setProgressBar(value)
          console.log(value)
        }
      }
    })
    item.once('done', (event, state) => {
      if (state === 'completed') {
        console.log('Download successfully')
        console.log('下载成功')

        if (downloadArgs && downloadArgs.pathUrl) {
          // 下载成功提示
          const unzip = new adm_zip(downloadArgs.pathUrl + '/' + filename)
          unzip.extractAllTo(downloadArgs.pathUrl + '/', true)
          fs.unlink(downloadArgs.pathUrl + '/' + filename, err => {
            if (err) console.log(err)
            else {
              console.log('删除代码压缩包')
            }
          })
        } else {
          // 下载成功提示
          const unzip = new adm_zip(winFilepath + filename)
          unzip.extractAllTo(winFilepath, true)
          fs.unlink(winFilepath + filename, err => {
            if (err) console.log(err)
            else {
              console.log('删除更新包')
            }
          })
        }
        if (codeType === 2) {
          // 下载更新
          win.webContents.send('el-message', {
            type: 'success',
            msg: '代码下载成功'
          })
        }
        if (codeType === 3) {
          // 下载更新
          win.webContents.send('el-message', {
            type: 'success',
            msg: '更新成功,软件3秒后重启'
          })
          setTimeout(() => {
            app.relaunch()
            app.quit()
          }, 3000)
        }
      } else {
        console.log(`Download failed: ${state}`)
        console.log('下载失败')
      }
    })
  })
}

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

// 顶部菜单
// Create the Application's main menu
const template = [{
  label: 'Application',
  submenu: [
    { label: 'About Application', selector: 'orderFrontStandardAboutPanel:' },
    { type: 'separator' },
    {
      label: '退出',
      accelerator: 'Command+Q',
      click: function() {
        app.quit()
      }
    }
  ]
},
{
  label: '菜单',
  visible: true,
  acceleratorWorksWhenHidden: false,
  submenu: [
    // { label: 'Undo', accelerator: 'CmdOrCtrl+Z', selector: 'undo:' },
    // { label: 'Redo', accelerator: 'Shift+CmdOrCtrl+Z', selector: 'redo:' },
    // { type: 'separator' },
    // { label: 'Cut', accelerator: 'CmdOrCtrl+X', selector: 'cut:' },
    { label: '复制', accelerator: 'CmdOrCtrl+C', selector: 'copy:' },
    { label: '粘贴', accelerator: 'CmdOrCtrl+V', selector: 'paste:' }
    // { label: 'Select All', accelerator: 'CmdOrCtrl+A', selector: 'selectAll:' }
  ]
}
]
if (process.platform == 'darwin') {
  console.log('这是mac系统')
  Menu.setApplicationMenu(Menu.buildFromTemplate(template))
}
if (process.platform == 'win32') {
  console.log('这是windows系统')
  // 隐藏顶部菜单
  Menu.setApplicationMenu(null)
}

async function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 980,
    // height: 710,
    height: 800,
    // fullscreen: true,//设置全屏
    show: false, // 默认最大化
    frame: true,
    // icon: path.join(__dirname, '../public/win.ico'),
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: (process.env
        .ELECTRON_NODE_INTEGRATION as unknown) as boolean,
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
      preload: path.join(__dirname, 'preload.js'),
      webviewTag: true
    }
  })
  // if (process.platform === 'darwin') {
  //   app.dock.setIcon(path.join(__dirname, './public/login2.ico'))
  // }
  win.maximize()
  win.show()

  win.webContents.on('dom-ready', () => {
    console.log('dom-ready')
    // 一个框架中的文本加载完成后触发该事件。
  })
  win.webContents.on('did-finish-load', () => {
    console.log('监听页面渲染完毕')
    win.webContents.send('update-v', packageModele.version)
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
// 快捷键
app.whenReady().then(() => {
  globalShortcut.register('CommandOrControl+I', () => {
    console.log('服务器地址修改快捷键')
    win.webContents.send('el-inf', true)
    console.log('服务器地址修改快捷键成功')
  })
  globalShortcut.register('CommandOrControl+Alt+I', () => {
    console.log('开始注册控制台快捷键')
    win.webContents.openDevTools()
    console.log('注册控制台快捷键成功')
  })
}).catch(err => {
  console.log(err, '错误')
})
app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async() => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS3_DEVTOOLS)
    } catch (e: any) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  createWindow()
  willDownload()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
