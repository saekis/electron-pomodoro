import {app, Tray, ipcMain, nativeImage} from 'electron'
import path from 'path'
import Timer from './Timer'
import Window from './Window'
import { TIMER_STATUS_PAUSE, TIMER_STATUS_PROGRESS, ROOT_PATH } from '../constants'

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
  const icon_path = nativeImage.createFromPath(__dirname, 'resources', 'tomato.png')
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

const setEvents = () => {
  tray.on('click', window.toggle)
  tray.on('right-click', window.toggle)
  tray.on('double-click', window.toggle)

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

  ipcMain.on('quit-app', (event) => {
    app.quit();
  });
}
