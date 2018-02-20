import React, { Component } from 'react'
import './App.css'
import client from '@doubledutch/admin-client'

class ContentTable extends Component {
  constructor(props) {
    super()
    this.state = {
    }
  }

  contentCell = (c) => {
    return (
      <li key={c.key} className="listItem">
          <div className="contentListItem">
          <p className="contentIcon">X</p>
          <p className="itemTitle">{c.title}</p>
          <p className="itemTitle">{c.attendeeIds.length} Attendees</p>
          <p className="itemTitle">View</p>
          </div>
        </li>
    )
}

// {JSON.stringify(c)}
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

export default ContentTable