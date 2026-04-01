const { contextBridge, ipcRenderer } = require('electron');

// We use contextBridge to safely expose specific native OS APIs to our React frontend
contextBridge.exposeInMainWorld('electronAPI', {
  // Add backend communication bindings here as needed
  // example: fetchItems: () => ipcRenderer.invoke('fetch-xyz')
});
