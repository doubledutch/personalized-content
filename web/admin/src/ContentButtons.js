import React, { Component } from 'react'
import TextIcon from './images/text-doc.svg'
import WebIcon from './images/earth.svg'

export default class ContentButtons extends Component {
  render() {
    const types = [{name: "Web Page", type: "web"}, {name: "Plain Text", type: "text"}, {name: "Survey", type: "survey"}]
    return (
      <span>
        <h2 className="contentTitle" >Select Content Type</h2>
        <span className="buttonsBox">
          {
            types.map((type, i) => (
              this.renderButton(type, i)
            ))
          }
        </span>
      </span>
    )
  }

  renderButton = (type, i) => {
    var color = "#FFFFFF"
    if (type.type === this.props.content.type){
      color = "#AEAEAE"
    }
    return (
      <button className="typeButton" key = {i} style={{backgroundColor: color}} name={type.type} onClick={this.updateCell}>
        <div>
          {this.renderIcon(type.type)}
          {type.name}
        </div>
      </button>
    )
  }

  updateCell = (event) => {
    const {onUpdate} = this.props
    const name = event.target.name
    onUpdate("type", name)
  }

  renderIcon = (type) => {
    switch (type) {
    case 'survey': return <img src={TextIcon} alt="survey"/>
    case 'text': return <p>T</p>
    case 'web': return <img src={WebIcon} alt="web"/>
    default: return <div/>
    }
  }
}
