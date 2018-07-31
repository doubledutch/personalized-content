/*
 * Copyright 2018 DoubleDutch, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { Component } from 'react'
import PageIcon from './images/text-doc.svg'
import WebIcon from './images/earth.svg'
import VideoIcon from "./images/video.svg"
import TextIcon from './images/TextIcon.png'
import HTMLIcon from './images/HTMLIcon.png'

export default class ContentButtons extends Component {
  render() {
    const types = [{name: "Web Page", type: "web"}, {name: "Plain Text", type: "text"}, {name: "Survey", type: "survey"}, {name: "HTML", type: "html"}, {name: "Video", type:"video"}]
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
    case 'survey': return <img className="standIcon" src={PageIcon} alt="survey"/>
    case 'text': return <img className="standIcon" src={TextIcon} alt="text"/>
    case 'html': return <img className="htmlIcon" src={HTMLIcon} alt="html"/>
    case 'web': return <img className="standIcon" src={WebIcon} alt="web"/>
    case 'video': return <img className="standIcon" src={VideoIcon} alt="video"/>
    default: return <div/>
    }
  }
}
