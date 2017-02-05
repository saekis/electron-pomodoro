'use strict';

import dateFormat from "dateformat"
import { TIMER_TYPE_WORK, TIMER_TYPE_BREAK, TIMER_STATUS_PAUSE } from '../constants'

module.exports = class Timer {
  constructor(tray, window) {
    this.tray = tray
    this.window = window
    this.timer = null
    this.datetime = null
    this.status = TIMER_STATUS_PAUSE
    this.type = TIMER_TYPE_WORK
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
    this.window.setTime(worktime)
    this.setTime(0, 10)
  }

  setBreaktime() {
    const breaktime = this.format(0, 5)
    this.tray.setTitle(breaktime)
    this.window.setTime(breaktime)
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
      this.window.setTime(displaying_time)
    }, 1000)
  }

  pause() {
    clearInterval(this.timer)
  }

  finish() {
    clearInterval(this.timer)
    this.window.sendToOtherProcess('finish-timer', this.type)
    if (this.type === TIMER_TYPE_WORK) {
      this.setBreaktime()
      this.type = TIMER_TYPE_BREAK
    } else {
      this.setWorktime()
      this.type = TIMER_TYPE_WORK
    }
  }

  format(m, s) {
    const time = new Date(null, null, null, null, m, s)
    return dateFormat(time, 'MM:ss')
  }
}
