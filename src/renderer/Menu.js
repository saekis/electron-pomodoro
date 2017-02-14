'use strict';

import React from 'react'
import { ipcRenderer } from 'electron'
import { TIMER_TYPE_WORK, TIMER_TYPE_BREAK, TIMER_STATUS_PROGRESS, TIMER_STATUS_PAUSE } from '../constants'
import Todos from './Todos'
import Slack from '../utils/slack'

export default class Menu extends React.Component{
  constructor(props) {
    super(props)

    this.state = {
      timer_type: TIMER_TYPE_WORK,
      timer_status: TIMER_STATUS_PAUSE,
      time: '00:10',
      pomodoro_count: 0,
      todos: [],
      settings: {
        auto_send_slack: true
      }
    }

    this.registerMainProcess()

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
        // 休憩時間が終わったら完了したTODOをスラックに通知
        // TODO: slackに通知するタイミングを考える
        if (this.state.settings.auto_send_slack) {
          this.sendDoneTodosToSlack()
        }
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

  handleOnClickSendToSlack() {
    this.sendDoneTodosToSlack()
  }

  sendDoneTodosToSlack() {
    const text = this.buildForSlack(this.state.todos)
    if (text) Slack.send(text)
    this.removeDoneTodoFromList(this.state.todos)
  }

  buildForSlack(todos) {
    const texts = []
    for (let i = 0; i < todos.length; i++) {
      const todo = todos[i]
      if (todo.deleted || todo.done) continue;
      texts.push(`・ ${todo.checked ? '~' + todo.text + '~' : todo.text}`)
    }
    const text = texts.join('\r\n')
    return text
  }

  removeDoneTodoFromList(todos) {
    todos.map((todo) => {
      if (todo.checked) todo.done = true
      return todo
    })
    this.setState({ todos })
  }

  render() {
    const is_worktime = this.state.timer_type === TIMER_TYPE_WORK
    const is_progress = this.state.timer_status === TIMER_STATUS_PROGRESS
    return (
      <div className="container">
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
               handleOnDelete={ this.handleOnDelete.bind(this) }
               handleOnClickSendToSlack={ this.handleOnClickSendToSlack.bind(this) } />
      </div>
    )
  }
}
