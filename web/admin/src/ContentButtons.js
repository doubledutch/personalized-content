import React, { Component } from 'react'
import PageIcon from './images/text-doc.svg'
import WebIcon from './images/earth.svg'
import TextIcon from './images/TextIcon.png'

export default class ContentButtons extends Component {
  render() {
    const types = [{name: "Web Page", type: "web"}, {name: "Plain Text", type: "text"}, {name: "Survey", type: "survey"}, {name: "HTML", type: "html"}]
    return (
      <span className="content-buttons__box">
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
      color = "#E2E2E2"
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
    if (name !== this.props.content.type) {
      onUpdate("type", name)
    }
  }

  renderIcon = (type) => {
    switch (type) {
    case 'survey': return <img src={PageIcon} alt="survey"/>
    case 'text': return <img src={TextIcon} alt="text"/>
    case 'html': return <img src={TextIcon} alt="text"/>
    case 'web': return <img src={WebIcon} alt="web"/>
    default: return <div/>
    }
  }
}
