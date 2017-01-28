const {app, Tray, ipcMain} = require('electron')
const Timer = require('./scripts/Timer')
const Window = require('./scripts/Window')

let tray = undefined
let window = undefined
let timer = undefined

// Hide icon from dock menu
app.dock.hide()

app.on('ready', () => {
  createTray()
  createWindow()
  craeteTimer()
  setEvents()
})

const createTray = () => {
  tray = new Tray(__dirname + '/images/tomato.png')
  tray.setToolTip('pomodoro')
}

const createWindow = () => {
  window = new Window(tray)
  window.create()
}

const craeteTimer = () => {
  timer = new Timer(tray, window)
  timer.create()
}

const setEvents = () => {
  tray.on('click', window.toggle)

  ipcMain.on('start-timer', (event) => {
    timer.setStatus('progress')
    timer.start()
    window.toggle()
    event.sender.send('asynchronous-reply', 'start-timer');
  })

  ipcMain.on('stop-timer', (event) => {
    timer.setStatus('stop')
    timer.stop()
    window.toggle()
    event.sender.send('asynchronous-reply', 'stop-timer');
  });
}
