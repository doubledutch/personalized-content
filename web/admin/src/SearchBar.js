import React, { Component } from 'react'

export default class SearchBar extends Component {
  constructor(props) {
    super()
    this.state = {
      value: ''
    }
  }

  handleChange = (event) => {
    this.setState({value: event.target.value});
    this.props.updateList(event.target.value)
  }


  render() {
    return (
      <div style={{margin: 5, marginLeft: 30, marginTop: 7}}>
        <input style={{height: 27, padding: 0, paddingLeft: 10, borderRadius: 15, fontSize: 16, width: 150}}type="text" id="myInput" value={this.state.value} onChange={this.handleChange} placeholder="Search"/>
      </div>
    )
  }
}
