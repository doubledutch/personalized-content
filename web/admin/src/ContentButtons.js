import React, { Component } from 'react'

export default class ContentButtons extends Component {
  render() {
    const types = [{name: "Web Page", type: "web"}, {name: "Plain Text", type: "text"}, {name: "External API", type: "api"}, {name: "Survey", type: "survey"}]
    return (
      <div>
        <h2>Select Content Type</h2>
        <span className="buttonsBox">
          {
            types.map((type, i) => (
              this.renderButton(type, i)
            ))
          }
        </span>
      </div>
    )
  }

  renderButton = (type, i) => {
    var color = "#FFFFFF"
    if (type.type === this.props.content.type){
      color = "#AEAEAE"
    }
    return (
      <button className="typeButton" key = {i} style={{backgroundColor: color}} name={type.type} onClick={this.updateCell}>{type.name}</button>
    )
  }

  updateCell = (event) => {
    const {onUpdate} = this.props
    var name = event.target.name
    onUpdate("type", name)
  }
}
