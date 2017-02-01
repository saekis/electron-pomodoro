'use strict';

import React from 'react'

export default class Todos extends React.Component{
  constructor(props) {
    super(props)
    this.state = {
      todos: [
        {
          checked: false,
          text: 'これはやること'
        },
        {
          checked: true,
          text: 'これもやること'
        }
      ]
    }
  }

  render() {
    return (
      <div className="todos">
        <div className="todo">
          <input type="text" style={{ display: "block", width: "100%" }} />
        </div>
        { this.state.todos.map((todo) => {
          return (
            <div className="todo">
              <input type="checkbox" checked={ todo.checked } /> <span>{ todo.text }</span>
            </div>
          )
        })}
      </div>
    )
  }
}
