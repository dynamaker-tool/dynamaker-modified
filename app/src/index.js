const { app, BrowserWindow, Menu, dialog, globalShortcut } = require('electron');
const shell = require('electron').shell;
const path = require('path');
const fs = require('fs')
const openAboutWindow = require('about-window').default;
app.showExitPrompt = true

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  // Ternary assignment based on OS
  const mainWindow = process.platform === 'darwin' ?
  new BrowserWindow({
    width: 1618,
    height: 940,
    fullscreen: false,
    fullscreenable: true,
    autoHideMenuBar: true,
  }) :
  new BrowserWindow({
    width: 1618,
    height: 940,
    fullscreen: false,
    autoHideMenuBar: true,
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Open the DevTools.
  //mainWindow.webContents.openDevTools();

  // Closing dialog
  mainWindow.on('close', (e) => {
    if (app.showExitPrompt) {
      e.preventDefault() // Prevents the window from closing 
      dialog.showMessageBox({
        type: 'question',
        buttons: ['是', '否'],
        title: 'Confirm',
        message: '未保存的譜面將丟失。 您確定要關閉製譜器嗎？'
      }).then(result => {
        if (result.response === 0) { // Runs the following if 'Yes' is clicked
          app.showExitPrompt = false
          mainWindow.close()
          app.showExitPrompt = true
        }
      })
    }
  })
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);


// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});


// Jmak - Overriding Menu
// i0ntempest - macOS specific improvements
const template = [
   {
       label: '文件',
       submenu: [
         {
            label: '關於',
            //Ref: https://github.com/rhysd/electron-about-window
            click: () =>
                openAboutWindow({
                    icon_path: (path.join(__dirname, 'DynaMaker.ico')),
                    product_name: 'DynaMaker',
                    app: 'DynaMaker',
                    description: 'Dynamite 與 Dynamix 的製譜工具。',
                    copyright: '版權所有屬於 ©C4Cat Entertainment Limited 以及 ©TunerGames.',
                    use_version_info: [
                        ['版本', '1.21.5']
                    ],
                    win_options: {
                     modal: true,
                     resizable: false
                 },
                 show_close_button: '關閉'
                }),
          },
          {
            label: '新視窗',
            accelerator: process.platform === 'darwin' ? 'Cmd+N' : 'Ctrl+N',
            click () { createWindow() }
          },
          {
            label: '關閉前警告',
            type: "checkbox",
            checked: app.showExitPrompt,
            click () {
              app.showExitPrompt = ! app.showExitPrompt
            }
          },
          {
             type: 'separator'
          },
          { 
            role: 'quit',
            label: '退出',
            accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Alt+F4'
          }
       ]
   },
   {
      label: '編輯',
      submenu: [
         {
            label: '快捷鍵幫助',
            accelerator: 'H'
         },
         {
            type: 'separator'
         },
         {
            role: 'undo',
            label: '撤銷',
            accelerator: 'Shift+Left'
         },
         {
            role: 'redo',
            label: '恢復',
            accelerator: 'Shift+Right'
         },
         {
            type: 'separator'
         },
         {
             label: '鼠標滾輪方向',
            accelerator: 'B'
         },
         {
            label: '簡潔模式',
            accelerator: 'L'
         },
         {
            type: 'separator'
         },
         {
            label: 'Bleed',
            accelerator: 'G'
         },
         {
            label: '音符計算器',
            accelerator: 'N'
         },
         {
             type: 'separator'
         },
         {
            label: '鎖定/解鎖小節',
            accelerator: 'Z'
         },
         {
            label: '鎖定/解鎖X軸',
            accelerator: 'X'
         },
         {
             type: 'separator'
         },
         {
            label: '增加小節切分數',
            accelerator: 'C'
         },
         {
            label: '減少小節切分數',
            accelerator: 'V'
         },
         {
             type: 'separator'
         },
         {
            label: '後退0.01秒',
             accelerator: 'A'
         },
         {
            label: '前進0.01秒',
            accelerator: 'D'
         },
         {
             type: 'separator'
         },
         {
            label: '顯示左側小節線',
            accelerator: 'Left'
         },
         {
            label: '顯示中間小節線',
            accelerator: 'Down'
         },
         {
            label: '顯示右側小節線',
            accelerator: 'Right'
         }

      ]
   },

   {
      label: '查看',
      submenu: [
         {
            role: 'reload',
            label: '刷新'
         },
         {
            role: 'toggledevtools',
            label: '開發者工具'
         },
         {
            type: 'separator'
         },
         {
            role: 'resetzoom',
            label: '實際大小'
         },
         {
            role: 'zoomin',
            label: '放大'
         },
         {
            role: 'zoomout',
            label: '縮小'
         },
         {
            type: 'separator'
         },
         {
            role: 'togglefullscreen',
            label: '全屏'
         }
      ]
   },
   
   {
      role: 'window',
      label: '視窗',
      submenu: [
         {
            role: 'minimize',
            label: '最小化'
         },
         {
            role: 'close',
            label: '關閉'
         }
      ]
   },

   {
      role: 'Help',
      label: '幫助',
      submenu: [
         {
            label:'DynaMaker修改版',
            click() { 
                shell.openExternal('https://github.com/jmakxd/dynamaker-modified')
            },
            accelerator: 'CmdOrCtrl+Shift+C'
        },
        {
            label:'DynaMaker教程',
            click() { 
                shell.openExternal('https://tlchicken.github.io/dynamaker-guide/')
            }
         },
         {
            label:'DyM譜面工具',
            click() { 
                  shell.openExternal('https://github.com/Jono997/dym-chart-tool')
            }
         },
         {
            label:'DynaMaker',
            click() { 
                  shell.openExternal('https://dynamaker.tunergames.com/')
            }
         }
      ]
   }
]

const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.