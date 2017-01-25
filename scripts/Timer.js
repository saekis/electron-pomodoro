'use strict';

const { ipcMain } = require('electron')
const dateFormat = require("dateformat")

module.exports = class Timer {
  constructor(tray, window) {
    this.tray = tray
    this.window = window
    this.timer = null
    this.datetime = null
    this.status = 'stop'
    this.type = 'work'
  }

  timer() {
    return this.timer
  }

  datetime() {
    return this.datetime
  }

  status() {
    return this.status
  }

  type() {
    return this.type
  }

  setTray(tray) {
    this.tray = tray
  }

  setTime(m, s) {
    this.datetime = new Date(null, null, null, null, m, s)
  }

  setStatus(status) {
    this.status = status
  }

  setType(type) {
    this.type = type
  }

  setWorktime() {
    const worktime = this.format(0, 10)
    this.tray.setTitle(worktime)
    this.setTime(0, 10)
  }

  setBreaktime() {
    const worktime = this.format(0, 5)
    this.tray.setTitle(worktime)
    this.setTime(0, 5)
  }

  create() {
    this.setWorktime()
  }

  start() {
    let displaying_time = dateFormat(this.datetime, 'MM:ss')
    this.timer = setInterval(() => {
      if (displaying_time == '00:00') {
        this.finish()
        return
      }

      this.datetime.setSeconds(this.datetime.getSeconds() - 1);
      displaying_time = dateFormat(this.datetime, 'MM:ss')
      this.tray.setTitle(displaying_time)
    }, 1000)
  }

  stop() {
    clearInterval(this.timer)
  }

  finish() {
    clearInterval(this.timer)
    if (this.type === 'work') {
      this.setBreaktime()
      this.window.webContents.send('finish-timer', 'work');
      this.type = 'break'
    } else {
      this.setWorktime()
      this.window.webContents.send('finish-timer', 'break');
      this.type = 'work'
    }
  }

  format(m, s) {
    const time = new Date(null, null, null, null, m, s)
    return dateFormat(time, 'MM:ss')
  }
}
