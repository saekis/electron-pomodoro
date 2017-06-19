'use strict';

import React from 'react'
import { ipcRenderer } from 'electron'
import { TIMER_TYPE_WORK, TIMER_TYPE_BREAK, TIMER_STATUS_PROGRESS, TIMER_STATUS_PAUSE } from '../constants'
import Todos from './Todos'
import DB from '../main/DB'

export default class Menu extends React.Component{
  constructor(props) {
    super(props)
    this.db = new DB()

    this.state = {
      timer_type: TIMER_TYPE_WORK,
      timer_status: TIMER_STATUS_PAUSE,
      time: '00:10',
      pomodoro_count: '',
      todos: [],
      show_settings_box: false
    }

    this.registerMainProcess()
    this.updateCountFromDB()
    this.startTimer = this.startTimer.bind(this)
    this.pauseTimer = this.pauseTimer.bind(this)
    this.incrementPomodoroCount = this.incrementPomodoroCount.bind(this)
  }

  registerMainProcess() {
    // when finish timer
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

  updateCountFromDB() {
    this.db.getCountInToday((err, data) => {
      let pomodoro_count = 0
      if (data) {
        pomodoro_count = data.pomodoro_count
      }
      this.setState({ pomodoro_count })
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
    const new_count = this.state.pomodoro_count + 1
    this.setState({ pomodoro_count: new_count })
    this.db.updateCount(new_count)
  }

  addTodo(text) {
    this.setState({
      todos: [
        ...this.state.todos,
        { text, checked: false, done: false, deleted: false }
      ]
    })
  }

  handleOnCheck(i) {
    const todos = this.state.todos
    const checked = todos[i].checked
    todos[i].checked = checked ? false : true
    this.setState(todos)
  }

  handleOnDelete(i) {
    const todos = this.state.todos
    todos[i].deleted = true
    this.setState(todos)
  }

  removeDoneTodoFromList(todos) {
    todos.map((todo) => {
      if (todo.checked) todo.done = true
      return todo
    })
    this.setState({ todos })
  }

  quitApp() {
    ipcRenderer.send('quit-app');
  }

  clickSettingsIcon() {
    if (this.state.show_settings_box) {
      this.setState({ show_settings_box: false })
    } else {
      this.setState({ show_settings_box: true })
    }
  }

  render() {
    const is_worktime = this.state.timer_type === TIMER_TYPE_WORK
    const is_progress = this.state.timer_status === TIMER_STATUS_PROGRESS
    return (
      <div className="container">
        <div className="settings"
             onClick={ this.clickSettingsIcon.bind(this) }>
          <i className="fa fa-cog"></i>
        </div>
        {this.state.show_settings_box &&
          <div className="settings-box">
            <a className="settings-box-item">reset count</a>
            <a className="settings-box-item"
               onClick={ this.quitApp }>quit</a>
          </div>
        }
        <div className="day-progress">
          <span>Today</span> <span className="count">{ this.state.pomodoro_count }/10</span>
        </div>
        <div className="timer-button-wrapper">
          <div className={`time ${is_worktime ? 'work' : 'break' }`}
               onClick={ is_progress ? this.pauseTimer : this.startTimer }>
            { this.state.time }
          </div>
          <div className="timer-button"
               onClick={ is_progress ? this.pauseTimer : this.startTimer }>
            <i className={`fa ${is_progress ? 'fa-pause-circle-o' : 'fa-play-circle-o'} ${is_worktime ? 'work' : 'break' }`}></i>
          </div>
        </div>
        <Todos todos={ this.state.todos }
               addTodo={ this.addTodo.bind(this) }
               handleOnCheck={ this.handleOnCheck.bind(this) }
               handleOnDelete={ this.handleOnDelete.bind(this) } />
      </div>
    )
  }
}
