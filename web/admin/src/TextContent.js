import React, { Component } from 'react'
import './App.css'

export default class TextContent extends Component {
  constructor(props) {
    super()
    this.state = {
    }
  }

  render() {
    return (
      <div>
        <p>Attendee Content</p>
        <span className="leftContainer">
          <ul className="contentList">{ this.props.pendingContent.map(c => (
            this.contentCell(c)))}
          </ul>
        </span>
      </div>
    )
  }
}
