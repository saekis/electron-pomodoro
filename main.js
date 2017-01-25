const {app, Menu, Tray, BrowserWindow, ipcMain} = require('electron')
const dateFormat = require("dateformat")
const path = require('path')

let tray = undefined
let window = undefined
let timer = undefined
let datetime = undefined
let timer_type = 'work'
let timer_status = 'stop'

// Hide icon from dock menu
app.dock.hide()

app.on('ready', () => {
  createTray()
  createWindow()
})

const createTray = () => {
  tray = new Tray(__dirname + '/images/tomato.png')
  tray.setToolTip('pomodoro')

  const initWorkTime = formatTime(25, 0)
  tray.setTitle(initWorkTime)
  setDateTime(25, 0)

  tray.on('click', toggleWindow)
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

  // window.toggleDevTools()

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

const startTimer = (m, s) => {
  datetime = new Date(null, null, null, null, m, s)
  timer = setInterval(() => {
    datetime.setSeconds(datetime.getSeconds() - 1);
    const displaying_time = dateFormat(datetime, 'MM:ss')
    tray.setTitle(displaying_time)
    if (displaying_time == '00:00') {
      clearInterval(timer)
    }
  }, 1000)
}

const formatTime = (m, s) => {
  const time = new Date(null, null, null, null, m, s)
  return dateFormat(time, 'MM:ss')
}

const startWorkTime = () => {
}

const startBreakTime = (m, s) => {
}

const stopWorkTime = () => {

}

const stopBreakTime = () => {

}

const setDateTime = (m, s) => {
  datetime = new Date(null, null, null, null, m, s)
}

const setTimerStatus = (status) => {
  timer_status = status
}

const setTimerType = (type) => {
  timer_type = type
}

ipcMain.on('start-timer', (event, arg) => {
  startTimer(datetime.getMinutes(), datetime.getSeconds())
  toggleWindow()
  setTimerStatus('progress')
})

ipcMain.on('stop-timer', (event, arg) => {
  clearInterval(timer)
  toggleWindow()
  setTimerStatus('stop')
});

ipcMain.on('timer-type', (event, arg) => {
  event.sender.send('asynchronous-reply', timer_type);
});

ipcMain.on('timer-status', (event, arg) => {
  event.sender.send('asynchronous-reply', timer_status);
});
