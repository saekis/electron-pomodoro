'use strict';

import React from 'react'
import { ipcRenderer } from 'electron'
import { TIMER_TYPE_WORK, TIMER_TYPE_BREAK, TIMER_STATUS_PROGRESS, TIMER_STATUS_PAUSE } from '../constants'
import Todos from './Todos'

export default class Menu extends React.Component{
  constructor(props) {
    super(props)

    this.state = {
      timer_type: TIMER_TYPE_WORK,
      timer_status: TIMER_STATUS_PAUSE,
      time: '00:10',
      pomodoro_count: 0
    }

    this.registerMainProcess()
    this.startTimer = this.startTimer.bind(this)
    this.pauseTimer = this.pauseTimer.bind(this)
    this.incrementPomodoroCount = this.incrementPomodoroCount.bind(this)
  }

  registerMainProcess() {
    ipcRenderer.on('finish-timer', (event, previous_type) => {
      if (previous_type === TIMER_TYPE_WORK) {
        this.setState({ timer_type: TIMER_TYPE_BREAK })
        this.incrementPomodoroCount()
      } else {
        this.setState({ timer_type: TIMER_TYPE_WORK })
      }
      this.setState({ timer_status: TIMER_STATUS_PAUSE })
    })

    ipcRenderer.on('time', (event, time) => {
      this.setState({ time })
    })
  }

  startTimer() {
    this.setState({ timer_status: TIMER_STATUS_PROGRESS })
    ipcRenderer.send('start-timer');
  }

  pauseTimer() {
    this.setState({ timer_status: TIMER_STATUS_PAUSE })
    ipcRenderer.send('pause-timer');
  }

  incrementPomodoroCount() {
    this.setState({ pomodoro_count: this.state.pomodoro_count + 1 })
  }

  render() {
    const is_work_time = this.state.timer_type === TIMER_TYPE_WORK
    const is_progress = this.state.timer_status === TIMER_STATUS_PROGRESS
    return (
      <div className="container">
        <div className="day-progress">
          <span>Today</span> <span className="count">{ this.state.pomodoro_count }/10</span>
        </div>
        <div className="timer-button-wrapper">
          <div className={`time ${is_work_time ? 'work' : 'break' }`}
               onClick={ is_progress ? this.pauseTimer : this.startTimer }>
            { this.state.time }
          </div>
          <div className="timer-button"
               onClick={ is_progress ? this.pauseTimer : this.startTimer }>
            <i className={`fa ${is_progress ? 'fa-pause-circle-o' : 'fa-play-circle-o'} ${is_work_time ? 'work' : 'break' }`}></i>
          </div>
        </div>
        <Todos />
      </div>
    )
  }
}
