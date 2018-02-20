import React, { Component } from 'react'
import './App.css'
import client from '@doubledutch/admin-client'

class SelectTable extends Component {
  constructor(props) {
    super()
    this.state = {
      newList: [],
      newContent: ''
    }
  }

  selectAttendee = (c) => {
    var attendeeBool = false
    if (this.props.currentList.length > 0) {
      attendeeBool = this.props.currentList.find(o => o === c.id)
    }
    return (
      <div className ="listItem">
        <input
          className="checkBox"
          name= {c.id}
          type="checkbox"
          value = {attendeeBool}
          onChange={this.addAttendee} />
        <label className="boxTitle">
          {c.firstName + " " + c.lastName}
        </label>
      </div>
    )
  
}



  render() {
    return (
      <div>
        <p>Who should receive this content?</p>
        <span className="leftContainer">
          <ul className="formBox">{ this.props.list.map(c => (
            this.selectAttendee(c)))}
          </ul>
        </span>
      </div>
    )
  }

  addAttendee = (event) => {
    var list = this.state.newList
    if (event.target.checked) {
      list.push(event.target.name)
      this.setState({newList: list})
    }
    else {
      var index = this.props.currentList.findIndex(o => o === event.target.name)
      var items = this.state.newList
      items.splice(index, 1)
      this.setState({newList: items})
    }
  }



}

export default SelectTable