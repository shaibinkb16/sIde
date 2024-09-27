const { app, Menu, BrowserWindow, dialog, ipcMain } = require('electron');
const { readdirSync, lstatSync, readFile, writeFile } = require('fs');
const { join, dirname } = require('path');
const { fileURLToPath } = require('url');

let mainWindow;
let currentFilePath = null;
app.on('ready', () => {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            preload: join(__dirname, 'preload.js') // Optional: use preload.js for additional security
        }
    });

    mainWindow.loadURL('http://localhost:5173'); // Update this URL to your React app

    const menu = Menu.buildFromTemplate([
        {
            label: 'File',
            submenu: [
                {
                    label: 'Open Folder',
                    click: async () => {
                        const { filePaths } = await dialog.showOpenDialog(mainWindow, {
                            properties: ['openDirectory']
                        });
                        if (filePaths.length > 0) {
                            try {
                                loadFolderStructure(filePaths[0]);
                            } catch (error) {
                                console.error('Failed to load folder structure:', error);
                            }
                        }
                    }
                },
                {
                    label: 'Open File',
                    click: async () => {
                        const { filePaths } = await dialog.showOpenDialog(mainWindow, {
                            properties: ['openFile']
                        });
                        if (filePaths.length > 0) {
                            try {
                                openFile(filePaths[0]);
                                currentFilePath = filePaths[0]; // Store the current file path
                            } catch (error) {
                                console.error('Failed to open file:', error);
                            }
                        }
                    }
                },
                { type: 'separator' },
                {
                    label: 'Save File',
                    click: () => {
                        if (currentFilePath) {
                            mainWindow.webContents.send('save-file', currentFilePath);
                        } else {
                            dialog.showMessageBox(mainWindow, {
                                type: 'warning',
                                title: 'No File Open',
                                message: 'You need to open a file before saving.'
                            });
                        }
                    }
                },
                {
                    label: 'Save As',
                    click: async () => {
                        const { filePath } = await dialog.showSaveDialog(mainWindow);
                        if (filePath) {
                            mainWindow.webContents.send('save-as-file', filePath);
                            currentFilePath = filePath; // Update the current file path
                        }
                    }
                },
                { type: 'separator' },
                {
                    label: 'Exit',
                    role: 'quit'
                }
            ]
        },
        {
            label: 'Edit',
            submenu: [
                { label: 'Undo', role: 'undo' },
                { label: 'Redo', role: 'redo' },
                { type: 'separator' },
                { label: 'Cut', role: 'cut' },
                { label: 'Copy', role: 'copy' },
                { label: 'Paste', role: 'paste' },
                { label: 'Select All', role: 'selectAll' }
            ]
        },
        {
            label: 'View',
            submenu: [
                { label: 'Reload', role: 'reload' },
                { label: 'Toggle Developer Tools', role: 'toggleDevTools' },
                { type: 'separator' },
                { label: 'Actual Size', role: 'resetZoom' },
                { label: 'Zoom In', role: 'zoomIn' },
                { label: 'Zoom Out', role: 'zoomOut' },
                { type: 'separator' },
                { label: 'Toggle Fullscreen', role: 'togglefullscreen' }
            ]
        },
        {
            label: 'Help',
            submenu: [
                {
                    label: 'About',
                    click: () => {
                        dialog.showMessageBox(mainWindow, {
                            type: 'info',
                            title: 'About',
                            message: 'This is your custom code editor built with Electron.',
                            buttons: ['OK']
                        });
                    }
                },
                {
                    label: 'Learn More',
                    click: async () => {
                        await require('electron').shell.openExternal('https://www.electronjs.org');
                    }
                }
            ]
        }
    ]);

    Menu.setApplicationMenu(menu);

    ipcMain.on('open-file', (event, filePath) => {
        openFile(filePath);
    });

    ipcMain.on('request-folder-structure', (event, folderPath) => {
        loadFolderStructure(folderPath);
    });

    ipcMain.on('save-file', async (event, filePath, content) => {
        try {
            await writeFileAsync(filePath, content);
            dialog.showMessageBox(mainWindow, {
                type: 'info',
                title: 'File Saved',
                message: `File saved successfully: ${filePath}`
            });
        } catch (error) {
            console.error('Failed to save file:', error);
            dialog.showMessageBox(mainWindow, {
                type: 'error',
                title: 'Save Error',
                message: `Failed to save file: ${error.message}`
            });
        }
    });

    ipcMain.on('save-as-file', async (event, filePath, content) => {
        try {
            await writeFileAsync(filePath, content);
            dialog.showMessageBox(mainWindow, {
                type: 'info',
                title: 'File Saved As',
                message: `File saved successfully: ${filePath}`
            });
        } catch (error) {
            console.error('Failed to save file:', error);
            dialog.showMessageBox(mainWindow, {
                type: 'error',
                title: 'Save As Error',
                message: `Failed to save file: ${error.message}`
            });
        }
    });
});

// Helper function to handle file writing
function writeFileAsync(filePath, content) {
    return new Promise((resolve, reject) => {
        writeFile(filePath, content, 'utf-8', (err) => {
            if (err) reject(err);
            else resolve();
        });
    });
}

function loadFolderStructure(folderPath) {
    try {
        const folderStructure = readDirectory(folderPath);
        console.log('Emitting folder structure:', folderStructure); // Debugging
        mainWindow.webContents.send('folder-selected', folderStructure); // Send structure to React
    } catch (error) {
        console.error('Failed to load folder structure:', error);
    }
}

function readDirectory(dirPath) {
    try {
        const items = readdirSync(dirPath);
        return items.map(item => {
            const fullPath = join(dirPath, item);
            const isDirectory = lstatSync(fullPath).isDirectory();
            return {
                name: item,
                path: fullPath,
                isDirectory,
                children: isDirectory ? readDirectory(fullPath) : []
            };
        });
    } catch (error) {
        console.error('Failed to read directory:', error);
        return [];
    }
}

function openFile(filePath) {
    readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
            console.error('Failed to read file:', err);
            return;
        }
        console.log('Emitting file content:', { filePath, content: data }); // Debugging
        mainWindow.webContents.send('file-opened', { filePath, content: data });
    });
}
