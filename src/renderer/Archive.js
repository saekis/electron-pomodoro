'use strict';

import React from 'react'
import ReactDOM from 'react-dom'
import DB from '../main/DB'

export default class Archive extends React.Component{
  constructor(props) {
    super(props)
    this.db = new DB()
    this.state = {
      items: []
    }
  }

  componentWillMount() {
    this.db.find((err, items) => {
      this.setState({ items })
    })
  }

  render() {
    return (
      <div className="archive">
        <h2 className="archive-title">Archive</h2>
        <div className="timer-link"
             onClick={ this.props.backToTimerMode }>
          <i className="fa fa-chevron-right"></i>
        </div>
        <ul className="archive-items">
          { this.state.items.map((item, i) => {
            return (
              <li key={i}>
                <p>{ item.date } { item.pomodoro_count }</p>
              </li>
            )
          }) }
        </ul>
      </div>
    )
  }
}
