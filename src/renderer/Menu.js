'use strict';

import React from 'react'
import { ipcRenderer } from 'electron'
import { TIMER_TYPE_WORK, TIMER_TYPE_BREAK, TIMER_STATUS_PROGRESS, TIMER_STATUS_PAUSE } from '../constants'

export default class Menu extends React.Component{
  constructor(props) {
    super(props)

    this.state = {
      timer_type: TIMER_TYPE_WORK,
      timer_status: TIMER_STATUS_PAUSE,
      time: '00:10'
    }

    this.registerMainProcess()
  }

  registerMainProcess() {
    ipcRenderer.on('finish-timer', (event, previous_type) => {
      if (previous_type === TIMER_TYPE_WORK) {
        this.setState({ timer_type: TIMER_TYPE_BREAK })
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

  render() {
    return (
      <div className="container">
        <div className={`time ${this.state.timer_type}`}
             onClick={ this.startTimer.bind(this) }>{ this.state.time }</div>
        <div>
          <i className="fa fa-pause"></i>
        </div>
      </div>
    )
  }
}
