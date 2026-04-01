const { app, BrowserWindow } = require('electron');
const path = require('path');

// Determine if we are running in development mode
const isDev = !app.isPackaged;

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      nodeIntegration: false,
      contextIsolation: true,
    },
    title: "ContriHub",
  });

  mainWindow.setMenuBarVisibility(false);

  if (isDev) {
    // In dev, load Vite's local dev server
    mainWindow.loadURL('http://localhost:5173');
  } else {
    // In production, load the static HTML file
    mainWindow.loadFile(path.join(__dirname, 'dist', 'index.html'));
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});
