const electron = require('electron');
const url = require('url');
const path = require('path');

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const { ipcMain } = electron;

let mainWindow;

require('./api-dist/server');
require('./static/server');

function createWindow () {
    mainWindow = new BrowserWindow({
        width: 1024, 
        height: 800,
        icon: __dirname + '/icon.png',
        webPreferences: {
            nodeIntegration: false
        }
    });

    mainWindow.loadURL(url.format({
        host: 'localhost:3002',
        protocol: 'http',
        slashes: true
    }));

    mainWindow.on('closed', function () {
        mainWindow = null
    });
}

app.on('ready', createWindow);
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});

app.on('browser-window-focus',() => {
  mainWindow.webContents.send('window-state', 'focus');
});

app.on('browser-window-blur', () => {
  mainWindow.webContents.send('window-state', 'blur');
});

ipcMain.on('show-notification', (event, data) => {
  app.dock.setBadge('•');
  app.dock.bounce();
});

ipcMain.on('hide-notification', (event, data) => {
  app.setBadgeCount(0)
});
