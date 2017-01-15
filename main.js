const {app, Menu, Tray, BrowserWindow} = require('electron')
const dateFormat = require("dateformat")
const path = require('path')

let tray = undefined
let window = undefined

// Hide icon from dock menu
app.dock.hide()

app.on('ready', () => {
  createTray()
  createWindow()
})

const createTray = () => {
  tray = new Tray(__dirname + '/images/icon.png')
  tray.setToolTip('pomodoro^^')

  const callback = () => {}
  const timer = startTimer(tray, callback, 25, 0)

  tray.on('click', toggleWindow)
}

const toggleWindow = () => {
  if (window.isVisible()) {
    window.hide()
  } else {
    showWindow()
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
      // Prevents renderer process code from not running when window is
      // hidden
      backgroundThrottling: false
    }
  })
  window.loadURL(`file://${path.join(__dirname, 'index.html')}`)

  // Hide the window when it loses focus
  window.on('blur', () => {
    if (!window.webContents.isDevToolsOpened()) {
      window.hide()
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

  return {x: x, y: y}
}

const showWindow = () => {
  const position = getWindowPosition()
  window.setPosition(position.x, position.y, false)
  window.show()
  window.focus()
}

const startTimer = (tray, callback, m, s) => {
  // Initiallize Date object
  let time = new Date(null, null, null, null, m, s)

  const start_time = dateFormat(time, 'MM:ss')
  let displaying_time = start_time
  tray.setTitle(displaying_time);

  const timer = setInterval(() => {
    time.setSeconds(time.getSeconds() - 1);
    displaying_time = dateFormat(time, 'MM:ss')
    tray.setTitle(displaying_time);
    if (displaying_time == '00:00') {
      callback()
      clearInterval(timer);
    }
  }, 1000)
  return timer
}
