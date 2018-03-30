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

import React, { PureComponent } from 'react'
import Background from './iPhone.png'

export default class ContentPreview extends PureComponent {

  render() {
    const {content, hidden, allContent} = this.props
    const sectionStyle = {
      backgroundImage: `url(${Background})`
    }

    if (hidden) {
      if (content.length) {
        return (
          <div className="content-preview">
            <div className="phoneBox" style={sectionStyle}>
              <div className="phoneScroll">
                { content.map(this.editorFor) }
              </div>
            </div>
          </div>
        )
      }
      else {
        return (
          <div className="content-preview">
            <div className="phoneBox" style={sectionStyle}>
              <div className="phoneScroll">
                {this.renderText()}
              </div>
            </div>
          </div>
        )
      }
    }
    else return null
  }

  renderText = () => {
    if (this.props.allUsers.length){
      if (this.props.allContent) {
        if (this.props.isPublished) {
          return (
            <h1 className="staticText">No content is available</h1>
          )
        }
        else {
          return (
            <h1 className="staticText">Publish content to see it previewed here</h1>
          )
        }
      }
      else {
        return (
          <h1 className="staticText">No content is available</h1>
        )
      }
    }
    else return <h1 className="staticText"></h1>
  }

  editorFor = (c, i) => {
    switch (c.type) {
      case 'text': return <div className="textCell" key={i}>
        <h2 className="textCellTitle">{c.title}</h2>
        <p className="textCellText" rows={5}>{c.text}</p>
      </div>
      case 'web': return <div className="webCell" key={i}>
        <iframe className="iFrameBox" src={c.url} title="webview"></iframe>
        <div className="webFooter">
          <h2 className="webFooterTitle">{c.title}</h2>
          <p className="webFooterLink">View Page</p>
        </div>
      </div>
      case 'html': return <div className="htmlCell" key={i}>
        <h2 className="textCellTitle">{c.title}</h2>
        <iframe className="htmlBox" srcDoc={c.text} title="webview" onClick="return false"></iframe>
      </div>
      case 'survey': return <div className="textCell" key={i}>
        <h2 className="textCellTitle">{c.title}</h2>
        <p className="surveyCellText" rows={5}>{c.description}</p>
        <button className="surveyButton">Take the survey</button>
      </div>
      default: return <div key={i}/>
    }
  }
}
