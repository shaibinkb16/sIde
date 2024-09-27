const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    on: (channel, callback) => ipcRenderer.on(channel, callback),
    removeListener: (channel, callback) => ipcRenderer.removeListener(channel, callback),
    send: (channel, ...args) => ipcRenderer.send(channel, ...args),
  },
  openFileDialog: () => ipcRenderer.invoke('open-file-dialog'),
  readFile: (filePath) => ipcRenderer.invoke('read-file', filePath),
  readDirectory: (dirPath) => ipcRenderer.invoke('read-directory', dirPath),
  saveFile: () => ipcRenderer.invoke('save-file'),
  saveAsFile: (filePath) => ipcRenderer.invoke('save-as-file', filePath),
});
