import {app, Tray, ipcMain} from 'electron'
import Timer from './Timer'
import Window from './Window'
import DB from './DB'
import { TIMER_STATUS_PAUSE, TIMER_STATUS_PROGRESS } from '../constants'

let tray = undefined
let window = undefined
let timer = undefined

// Hide icon from dock menu
app.dock.hide()

app.on('ready', () => {
  createTray()
  createWindow()
  craeteTimer()
  createDB()
  setEvents()
})

const createTray = () => {
  const icon_path = './images/tomato.png'
  tray = new Tray(icon_path)
  tray.setHighlightMode(false)
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

const createDB = () => {
  new DB()
}

const setEvents = () => {
  tray.on('click', window.toggle)

  ipcMain.on('start-timer', (event) => {
    timer.setStatus(TIMER_STATUS_PROGRESS)
    timer.start()
    event.sender.send('asynchronous-reply', 'start-timer');
  })

  ipcMain.on('pause-timer', (event) => {
    timer.setStatus(TIMER_STATUS_PAUSE)
    timer.pause()
    event.sender.send('asynchronous-reply', 'pause-timer');
  });
}
