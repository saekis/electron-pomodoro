'use strict';

import React from 'react'
import ReactDOM from 'react-dom'

export default class Todos extends React.Component{
  constructor(props) {
    super(props)
    this.state = {
      todos: []
    }

    this.add = this.add.bind(this)
    this._handleKeyPress = this._handleKeyPress.bind(this)
  }

  add(text) {
    this.setState({
      todos: [...this.state.todos, { text, checked: false, deleted: false }]
    })
  }

  remove() {

  }

  _handleKeyPress(e) {
    const text = e.target.value
    if (e.key === 'Enter' && text !== '') {
      this.add(text)

      // フォームをクリア
      ReactDOM.findDOMNode(this.refs['text']).value = ''
    }
  }

  onCheck(i) {
    const todos = this.state.todos
    const checked = todos[i].checked
    todos[i].checked = checked ? false : true
    this.setState(todos)
  }

  onDelete(i) {
    const todos = this.state.todos
    todos[i].deleted = true
    this.setState(todos)
  }

  render() {
    return (
      <div className="todos">
        <div className="form">
          <input type="text"
                 className="input"
                 ref="text"
                 onKeyPress={ this._handleKeyPress }
                 placeholder="Enter task name....." />
        </div>
        { this.state.todos.map((todo, i) => {
          if (todo.deleted) return null
          return (
            <div className="todo" key={ i }>
              <div className="checkbox">
                <input type="checkbox"
                       checked={ todo.checked }
                       onClick={ this.onCheck.bind(this, i) } />
              </div>
              <div className={`text ${todo.checked && 'checked'}`}
                   onClick={ this.onCheck.bind(this, i) }>{ todo.text }</div>
              <div className="delete">
                <i className="fa fa-times"
                   onClick={ this.onDelete.bind(this, i) }></i>
              </div>
            </div>
          )
        })}
      </div>
    )
  }
}
