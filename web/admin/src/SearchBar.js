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
      <div style={{margin: 5}}>
        <input type="text" id="myInput" value={this.state.value} onChange={this.handleChange}/>
      </div>
    )
  }
}
