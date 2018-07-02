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
import CsvParse from '@vtex/react-csv-parse'
import { CSVLink } from 'react-csv'

export default class ContentDetailsEditor extends PureComponent {
  render() {
    const {content, onUpdate, surveys} = this.props
    const csvKeys = ["email", "Title", "Description"]
    
    switch (content.type) {
      case "html":
      case 'text': return <div className="content-editor__box" key={`${content.type}Fields`}>
          <div>
            <h2 className="contentTitle">Add a Title</h2>
            <TextEditor content={content} prop="title" title="Title" placeholder="Acme Co. Name" onUpdate={onUpdate} isTitle={true} hideTitle={true}/>
          </div>
          <div className="homeBox">
            <h2 className="contentTitle">Add Content</h2>
            <MultiLineEditor content={content} prop="text" title="Content" onUpdate={onUpdate} hideTitle={true}/>
          </div>
        </div>
      case 'web': return <div className="content-editor__box" key={`${content.type}Fields`}>
          <div>
            <h2 className="contentTitle">Add a Title</h2>
            <TextEditor content={content} prop="title" title="Title" placeholder="Acme Co. Website" onUpdate={onUpdate} isTitle={true} hideTitle={true}/>
          </div>
          <div className="homeBox">
            <h2 className="contentTitle">Add Content</h2>
            <TextEditor content={content} prop="url" title="URL" regex={/^https?:\/\/[^/]/} validationMessage="The URL must begin with 'https://' or 'http://'" placeholder="http://www.acme.com" onUpdate={onUpdate} hideTitle={true}/>
          </div>
        </div>
      case 'video': return <div className="content-editor__box" key={`${content.type}Fields`}>
         <div>
           <h2 className="contentTitle">Add a Title</h2>
           <TextEditor content={content} prop="title" title="Title" placeholder="Acme Co. Website" onUpdate={onUpdate} isTitle={true} hideTitle={true}/>
         </div>
         <div className="homeBox">
           <h2 className="contentTitle">Add a Youtube Link</h2>
           <TextEditor content={content} prop="url" title="URL" regex={/^(https?\:\/\/)(www\.)?(youtube\.com|youtu\.?be)\/.+$/} validationMessage="Your video must follow the placeholder format" placeholder="https://www.youtube.com/watch?v=Ycd-C85AdCk" onUpdate={onUpdate} hideTitle={true}/>
         </div>
        </div>
        case 'csv': return <div className="content-editor__box" key={`${content.type}Fields`}>
          <div>
            <h2 className="contentTitle">Add a Title</h2>
            <TextEditor content={content} prop="title" title="Title" placeholder="Your Travel Details" onUpdate={onUpdate} isTitle={true} hideTitle={true}/>
          </div>
          <h2 className="contentTitle">Download a CSV Template</h2>
          <CSVLink className="csvButton" data={this.makeCSVTemplate()} filename={"questions.csv"}>Download</CSVLink>
        <h2 className="contentTitle">Choose file for import</h2>
        <CsvParse
          className="csv-input"
          keys={csvKeys}
          onDataUploaded={this.handleImport}
          onError={this.props.handleError}
          render={onChange => <input type="file" onChange={onChange} />}
        />
        </div>
      case 'survey': return <div className="content-editor__box" key={`${content.type}Fields`}>
          <h2 className="contentTitle">Choose Survey</h2>
          <SelectEditor size={6} content={content} prop="surveyId" title="Survey" onUpdate={this.onUpdateSurvey} options={surveys} />
        </div>
      default: return <div />
    }
  }

  handleImport = (data) => {
    const {content, allUsers} = this.props
    let newData = []
    data.forEach(userInfo => {
      const currentUser = allUsers.find(user => user.email === userInfo.email)
      if (currentUser) {
        const newUserData = {"checkAll": false, "order": content.order, "title": content.title, "type": "text", "text": userInfo.Description, attendeeIds: [currentUser.id]}
        newData.push(newUserData)
      }
    })
    this.props.onUpdate("rawData", newData)
  }

  makeCSVTemplate = () => {
    const {content, allUsers} = this.props
    let csvTemplate = []
    allUsers.forEach(user => {
      const blankInfo = {"email": user.email, "firstName": user.firstName, "lastName": user.lastName, "description": ""}
      csvTemplate.push(blankInfo)
    })
    return csvTemplate
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
