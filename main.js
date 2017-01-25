const {app, Tray, BrowserWindow, ipcMain} = require('electron')
const Timer = require('./scripts/Timer')
const path = require('path')

let tray = undefined
let window = undefined
let timer = undefined

// Hide icon from dock menu
app.dock.hide()

app.on('ready', () => {
  createTray()
  createWindow()
  craeteTimer()
})

const createTray = () => {
  tray = new Tray(__dirname + '/images/tomato.png')
  tray.setToolTip('pomodoro')
  tray.on('click', toggleWindow)
}

const craeteTimer = () => {
  timer = new Timer(tray, window)
  timer.setTray(tray)
  timer.create()
}

const toggleWindow = () => {
  if (window.isVisible()) {
    window.hide()
    tray.setHighlightMode('never')
  } else {
    showWindow()
    tray.setHighlightMode('always')
  }
}

const createWindow = () => {
  window = new BrowserWindow({
    width: 300,
    height: 450,
    show: false,
    frame: false,
    fullscreenable: false,
    resizable: false,
    transparent: true,
    webPreferences: {
      backgroundThrottling: false
    }
  })
  window.loadURL(`file://${path.join(__dirname, 'index.html')}`)

  window.openDevTools({mode: 'undocked'})

  // Hide the window when it loses focus
  window.on('blur', () => {
    if (!window.webContents.isDevToolsOpened()) {
      toggleWindow()
    }
  })
}

const getWindowPosition = () => {
  const windowBounds = window.getBounds()
  const trayBounds = tray.getBounds()

  // Center window horizontally below the tray icon
  const x = Math.round(trayBounds.x + (trayBounds.width / 2) - (windowBounds.width / 2))

  // Position window 4 pixels vertically below the tray icon
  const y = Math.round(trayBounds.y + trayBounds.height + 4)

  return {x, y}
}

const showWindow = () => {
  const position = getWindowPosition()
  window.setPosition(position.x, position.y, false)
  window.show()
  window.focus()
}

ipcMain.on('start-timer', (event) => {
  timer.setStatus('progress')
  timer.start()
  toggleWindow()
  event.sender.send('asynchronous-reply', 'start-timer');
})

ipcMain.on('stop-timer', (event) => {
  timer.setStatus('stop')
  timer.stop()
  toggleWindow()
  event.sender.send('asynchronous-reply', 'stop-timer');
});
