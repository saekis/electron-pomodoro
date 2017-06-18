'use strict';

import React from 'react'
import ReactDOM from 'react-dom'

export default class Todos extends React.Component{
  constructor(props) {
    super(props)

    this.onKeyPress = this.onKeyPress.bind(this)
  }

  onKeyPress(e) {
    const text = e.target.value
    if (e.key === 'Enter' && text !== '') {
      this.props.addTodo(text)

      // Clear form text
      ReactDOM.findDOMNode(this.refs['text']).value = ''
    }
  }

  render() {
    return (
      <div className="todos">
        <div className="form">
          <input type="text"
                 className="input"
                 ref="text"
                 onKeyPress={ this.onKeyPress }
                 placeholder="Enter task name....." />
        </div>
        { this.props.todos.map((todo, i) => {
          if (todo.deleted || todo.done) return null
          return (
            <div className="todo" key={ i }>
              <div className="checkbox">
                <input type="checkbox"
                       checked={ todo.checked }
                       onClick={ () => { this.props.handleOnCheck(i) } }/>
              </div>
              <div className={`text ${todo.checked && 'checked'}`}
                   onClick={ () => { this.props.handleOnCheck(i) } }>{ todo.text }</div>
              <div className="delete">
                <i className="fa fa-times"
                   onClick={ () => { this.props.handleOnDelete(i) } }></i>
              </div>
            </div>
          )
        })}
      </div>
    )
  }
}
