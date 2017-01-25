import React from 'react'
import { ipcRenderer } from 'electron'

export default class Menu extends React.Component{
  constructor(props) {
    super(props)

    this.state = {
      timer_type: 'working time',
      timer_status: 'stop'
    }

    this.registerMainProcess()
  }
  registerMainProcess() {
    ipcRenderer.on('finish-timer', (event, finish_type) => {
      if (finish_type === 'work') {
        this.setState({ timer_type: 'break time' })
      } else {
        this.setState({ timer_type: 'working time' })
      }
      this.setState({ timer_status: 'stop' })
    })
  }
  startTimer() {
    this.setState({ timer_status: 'progress' })
    ipcRenderer.send('start-timer');
  }
  stopTimer() {
    this.setState({ timer_status: 'stop' })
    ipcRenderer.send('stop-timer');
  }
  render() {
    const start_button =
      <a href="#" className="button"
         onClick={ this.startTimer.bind(this) }>START</a>
    const stop_button =
      <a href="#" className="button"
           onClick={ this.stopTimer.bind(this) }>STOP</a>
    return (
      <div className="container">
        <p>now: { this.state.timer_type }</p>
        { this.state.timer_status == 'progress' ? stop_button : start_button }
      </div>
    )
  }
}
