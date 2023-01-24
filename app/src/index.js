const { app, BrowserWindow, Menu, dialog, globalShortcut } = require('electron');
const shell = require('electron').shell;
const path = require('path');
const fs = require('fs')
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
        buttons: ['Yes', 'No'],
        title: 'Confirm',
        message: 'Unsaved edits will be lost. Are you sure you want to close the editor?'
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
     label: 'File',
      submenu: [
         {
           label: 'New Window',
           accelerator: 'CmdOrCtrl+N',
           click () { createWindow() }
         },
         {
           label: 'Warn Before Closing',
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
           accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Alt+F4'
         }
      ]
   },
   {
      label: 'Edit',
      submenu: [
         {
            label: 'Button Menu',
            accelerator: 'H'
         },
         {
            type: 'separator'
         },
         {
            role: 'Undo',
            accelerator: 'Shift+Left'
         },
         {
            role: 'Redo',
            accelerator: 'Shift+Right'
         },
         {
            type: 'separator'
         },
         {
             label: 'Invert Scrolling',
            accelerator: 'B'
         },
         {
            label: 'Simple Mode',
            accelerator: 'L'
         },
         {
            type: 'separator'
         },
         {
            label: 'Bleed Mod',
            accelerator: 'G'
         },
         {
            label: 'Note Counter',
            accelerator: 'N'
         },
         {
             type: 'separator'
         },
         {
            label: 'Lock/Unlock Bar',
            accelerator: 'Z'
         },
         {
            label: 'Lock/Unlock X-Axis',
            accelerator: 'X'
         },
         {
             type: 'separator'
         },
         {
            label: 'Increase Division',
            accelerator: 'C'
         },
         {
            label: 'Decrease Division',
            accelerator: 'V'
         },
         {
             type: 'separator'
         },
         {
            label: 'Back 0.01s',
             accelerator: 'A'
         },
         {
            label: 'Forward 0.01s',
            accelerator: 'D'
         },
         {
             type: 'separator'
         },
         {
            label: 'Show Left Barline',
            accelerator: 'Left'
         },
         {
            label: 'Show Middle Barline',
            accelerator: 'Down'
         },
         {
            label: 'Show Right Barline',
            accelerator: 'Right'
         }

      ]
   },

   {
      label: 'View',
      submenu: [
         {
            role: 'reload'
         },
         {
            role: 'toggledevtools'
         },
         {
            type: 'separator'
         },
         {
            role: 'resetzoom'
         },
         {
            role: 'zoomin'
         },
         {
            role: 'zoomout'
         },
         {
            type: 'separator'
         },
         {
            role: 'togglefullscreen'
         }
      ]
   },
   
   {
      role: 'window',
      submenu: [
         {
            role: 'minimize'
         },
         {
            role: 'close'
         }
      ]
   },

   {
      role: 'Help',
      submenu: [
         {
            label:'DynaMaker Modified',
            click() { 
                shell.openExternal('https://github.com/jmakxd/dynamaker-modified')
            },
            accelerator: 'CmdOrCtrl+Shift+C'
        },
        {
            label:'DynaMaker Guide',
            click() { 
                shell.openExternal('https://tlchicken.github.io/dynamaker-guide/')
            }
         },
         {
            label:'DyM Chart Tool',
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