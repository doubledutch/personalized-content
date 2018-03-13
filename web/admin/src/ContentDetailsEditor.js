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
import { SelectEditor, TextEditor, MultiLineEditor } from './editors'

export default class ContentDetailsEditor extends PureComponent {
  render() {
    const {content, onUpdate, surveys} = this.props
    
    switch (content.type) {
      case "html":
      case 'text': return <div className="content-editor__box">
          <div>
            <h2 className="contentTitle">Add a Title</h2>
            <TextEditor content={content} prop="title" title="Title" placeholder="Acme Co Name" onUpdate={onUpdate} isTitle={true}/>
          </div>
          <div className="homeBox">
            <h2 className="contentTitle">Add Content</h2>
            <MultiLineEditor content={content} prop="text" title="Content" placeholder="Acme Co Details" onUpdate={onUpdate}/>
          </div>
        </div>
      case 'web': return <div className="content-editor__box">
          <div>
            <h2 className="contentTitle">Add a Title</h2>
            <TextEditor content={content} prop="title" title="Title" placeholder="Acme Co Website" onUpdate={onUpdate} />
          </div>
          <div className="homeBox">
            <h2 className="contentTitle">Add Content</h2>
            <TextEditor content={content} prop="url" title="URL" regex={/^https?:\/\/[^/]/} validationMessage="The URL must begin with 'https://' or'http://'" placeholder="http://www.acme.com" onUpdate={onUpdate} />
          </div>
        </div>
      case 'survey': return <div className="content-editor__box">
          <h2 className="contentTitle">Choose Survey</h2>
          <SelectEditor size={6} content={content} prop="surveyId" title="Survey" onUpdate={this.onUpdateSurvey} options={surveys} />
        </div>
      default: return <div />
    }
  }

  onUpdateSurvey = (prop, value) => {
    const {onUpdate, surveys} = this.props
    onUpdate(prop, value)
    const survey = surveys.find(s => s.id === value)
    if (survey) {
      onUpdate('title', survey.name)
      onUpdate('description', survey.description)
    }
  }
}
