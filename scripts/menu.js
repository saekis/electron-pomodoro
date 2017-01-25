import React from 'react'
import { ipcRenderer } from 'electron'

export default class Menu extends React.Component{
  constructor(props) {
    super(props)

    this.state = {
      timer_type: 'work',
      timer_status: 'stop'
    }
  }
  startTimer() {
    this.setState({ timer_status: 'progress' })
    ipcRenderer.send('start-timer');
  }
  stopTimer() {
    this.setState({ timer_status: 'stop' })
    ipcRenderer.send('stop-timer');
  }
  fetchTimerType() {
    return ipcRenderer.send('timer-type');
  }
  fetchTimerStatus() {
    return ipcRenderer.send('timer-status');
  }
  render() {
    const start_button = () => {
      const button_value = this.state.timer_type == 'work' ? 'START WORK TIME' : 'START BREAK TIME'
      return (
        <a href="#" className="button"
           onClick={ this.startTimer.bind(this) }>{ button_value }</a>
      )
    }
    const stop_button = () => {
      const button_value = this.state.timer_type === 'work' ? 'STOP WORK TIME' : 'STOP BREAK TIME'
      return (
        <a href="#" className="button"
           onClick={ this.stopTimer.bind(this) }>{ button_value }</a>
      )
    }
    return (
      <div className="container">
        { this.state.timer_status == 'progress' ? stop_button() : start_button() }
      </div>
    )
  }
}
