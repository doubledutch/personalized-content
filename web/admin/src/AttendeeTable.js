import React, { Component } from 'react'
import './App.css'
import client from '@doubledutch/admin-client'
import AttendeeCell from './AttendeeCell'

class AttendeeTable extends Component {
  constructor(props) {
    super()
    this.state = {
      list: [1,2,3,4,5,6]
    }
  }

  contentCell = () => {
    this.state.list.map(item => {
      return (
        <AttendeeCell/>
      )
    }
  )
  }


  render() {
    return (
      <div>
      <p>Attendee Content</p>
      <span className="leftContainer">
        <ul>
          {this.contentCell()}
        </ul>
      </span>
      </div>
    )
  }

}

export default AttendeeTable