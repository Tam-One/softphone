const { app, BrowserWindow, screen: electronScreen } = require('electron')
const isDev = require('electron-is-dev')
const path = require('path')

const createMainWindow = () => {
  let mainWindow = new BrowserWindow({
    width: 350, //electronScreen.getPrimaryDisplay().workArea.width * 0.3,
    height: 716, //electronScreen.getPrimaryDisplay().workArea.height,
    show: false,
    backgroundColor: 'white',
    webPreferences: {
      nodeIntegration: false,
      devTools: isDev,
    },
    icon: __dirname + '/Icon/Icon.icns',
    resizable: false,
  })
  const startURL = isDev
    ? 'http://localhost:3000'
    : `file://${path.join(__dirname, '../build/index.html')}`

  mainWindow.loadURL(startURL)

  mainWindow.once('ready-to-show', () => mainWindow.show())

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  mainWindow.webContents.on('new-window', (event, url) => {
    event.preventDefault()
    mainWindow.loadURL(url)
  })
}

if (require('electron-squirrel-startup')) {
  return
}

app.whenReady().then(() => {
  createMainWindow()

  app.on('activate', () => {
    if (!BrowserWindow.getAllWindows().length) {
      createMainWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
