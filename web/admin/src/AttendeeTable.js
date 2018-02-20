import React, { Component } from 'react'
import './App.css'
import client from '@doubledutch/admin-client'
import AttendeeCell from './AttendeeCell'

class AttendeeTable extends Component {
  constructor(props) {
    super()
    this.state = {
      // list: this.props.pendingContent
    }
  }

  // contentCell = (c) => {
  //     return (
  //       <li key={c.key}>
  //           {JSON.stringify(c)}
  //         </li>
  //     )
  // }


  render() {
    return (
      <div>
        <p>Attendee Content</p>
        <span className="leftContainer">
          {/* <ul>{ this.props.pendingContent.map(c => (
            this.contentCell(c)))}
          </ul> */}
        </span>
      </div>
    )
  }

}

export default AttendeeTable