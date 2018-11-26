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
import { translate as t } from '@doubledutch/admin-client'
import Background from './iPhone.png'
import VideoPlaceholder from './images/videoplaceholder.png'

export default class ContentPreview extends PureComponent {
  render() {
    const { content, hidden } = this.props
    const sectionStyle = {
      backgroundImage: `url(${Background})`,
    }

    console.log(content)

    // let csvContent = content.filter(item => item.rawData)
    // csvContent = csvContent.map(item => this.publishCSVData(item.rawData, item.key))
    // const newContent = content.concat(csvContent)

    if (hidden) {
      if (content.length) {
        return (
          <div className="content-preview">
            <div className="phoneBox" style={sectionStyle}>
              <div className="phoneScroll">{content.map(this.editorFor)}</div>
            </div>
          </div>
        )
      }

      return (
        <div className="content-preview">
          <div className="phoneBox" style={sectionStyle}>
            <div className="phoneScroll">{this.renderText()}</div>
          </div>
        </div>
      )
    }
    return null
  }

  publishCSVData = (data, key) => {
    data.forEach(item => {
      item.key = key
    })
    return data
  }

  renderText = () => {
    if (this.props.allUsers.length) {
      if (this.props.allContent) {
        if (this.props.isPublished) {
          return <h1 className="staticText">{t('noContent')}</h1>
        }

        return <h1 className="staticText">{t('noPublish')}</h1>
      }

      return <h1 className="staticText">{t('noContent')}</h1>
    }
    return <h1 className="staticText">...</h1>
  }

  editorFor = (c, i) => {
    switch (c.type) {
      case 'textCSV':
      case 'text':
        return (
          <div className="textCell" key={i}>
            <h2 className="textCellTitle">{c.title}</h2>
            <p className="textCellText" rows={5}>
              {c.text}
            </p>
          </div>
        )
      case 'webCSV':
      case 'web':
        return (
          <div className="webCell" key={i}>
            <iframe className="iFrameBox" src={c.url} title="webview" />
            <div className="webFooter">
              <h2 className="webFooterTitle">{c.title}</h2>
              <p className="webFooterLink">{t('viewPage')}</p>
            </div>
          </div>
        )
      case 'html':
        return (
          <div className="htmlCell" key={i}>
            <h2 className="textCellTitle">{c.title}</h2>
            <iframe className="htmlBox" srcDoc={c.text} title="webview" onClick="return false" />
          </div>
        )
      case 'survey':
        return (
          <div className="textCell" key={i}>
            <h2 className="textCellTitle">{c.title}</h2>
            <p className="surveyCellText" rows={5}>
              {c.description}
            </p>
            <button className="surveyButton">{t('takeSurvey')}</button>
          </div>
        )
      case 'videoCSV':
      case 'video':
        return (
          <div className="webCell" key={i}>
            <img className="videoBox" src={VideoPlaceholder} title="videoview" alt="video" />
            <div className="webFooter">
              <h2 className="webFooterTitle">{c.title}</h2>
            </div>
          </div>
        )
      default:
        return <div key={i} />
    }
  }
}
