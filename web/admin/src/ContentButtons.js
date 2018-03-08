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
          { types.map(this.renderButton) }
        </span>
      </span>
    )
  }

  renderButton = type => {
    var color = "#FFFFFF"
    if (type.type === this.props.content.type){
      color = "#E2E2E2"
    }
    return (
      <button className="typeButton" key={type.type} style={{backgroundColor: color}} onClick={this.selectType(type.type)}>
        <div>
          {this.renderIcon(type.type)}
          {type.name}
        </div>
      </button>
    )
  }

  selectType = type => event => {
    const {onUpdate} = this.props
    if (type !== this.props.content.type) {
      onUpdate('type', type)
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
