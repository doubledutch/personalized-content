import React, { Component } from 'react'
import './App.css'
import client from '@doubledutch/admin-client'

class ContentTable extends Component {
  constructor(props) {
    super()
    this.state = {
    }
  }

  contentCell = () => {
    return (
      <li>
        </li>
    )
  }
  render() {
    return (
      <div>
      <p>Current Content</p>
      <span className="leftContainer">
        <ul>
        </ul>
      </span>
      </div>
    )
  }

}

export default ContentTable