import React, { Component } from 'react'
import './App.css'
import client from '@doubledutch/admin-client'

class ContentButtons extends Component {
  constructor(props) {
    super()
    this.state = {
      currentType: '',
      color: "#AEAEAE"
    }
  }



// {JSON.stringify(c)}
  render() {
    const types = [ "Web Page", "Plain Text", "External API", "Survey"]
    return (
      <div>
        <h2>Select Content Type</h2>
        <span className="buttonsBox">
          {
            types.map((type, i) => (
              this.renderButton(type, i)
            ))

          }
          
          {/* <button className="typeButton" style={{backgroundColor: this.state.color}} name="web" id="button1" onClick={this.updateCell}>Web Page</button>
          <button className="typeButton" style={{backgroundColor: this.state.color}} onClick={this.updateCell}>Plain Text</button>
          <button className="typeButton" style={{backgroundColor: "#FFFFFF"}} onClick={this.updateCell}>External API</button>
          <button className="typeButton" style={{backgroundColor: "#FFFFFF"}} onClick={this.updateCell}>Survey</button> */}
        </span>
      </div>
    )
  }

  renderButton = (type, i) => {
    var color = "#FFFFFF"
    if (type === this.state.currentType){
      color = this.state.color
    }
    return (
      <button className="typeButton" key = {i} style={{backgroundColor: color}} name={type} onClick={this.updateCell}>{type}</button>
    )

  }


  updateCell = (event) => {
  const {onUpdate, content} = this.props
  var name = event.target.name
  this.setState({currentType: name})
  onUpdate(content, "type", name)
  }
}



export default ContentButtons