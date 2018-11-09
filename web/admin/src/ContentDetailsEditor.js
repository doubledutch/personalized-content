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
import client, {translate as t} from '@doubledutch/admin-client'
import CsvParse from '@vtex/react-csv-parse'
import RadioIcon from "./RadioIcon"
import { CSVLink } from 'react-csv'

export default class ContentDetailsEditor extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      successfulImport: 0,
      totalImport: 0
    }

  }
  render() {
    const {content, onUpdate, surveys} = this.props
    switch (content.type) {
      case "html": return <div className="content-editor__box" key={`${content.type}Fields`}>
        <div>
          <h2 className="contentTitle">Add a Title</h2>
          <TextEditor content={content} prop="title" title="Title" placeholder="Acme Co. Name" onUpdate={onUpdate} isTitle={true} hideTitle={true}/>
        </div>
        <div className="homeBox">
          <h2 className="contentTitle">Add Content</h2>
          <MultiLineEditor content={content} prop="text" title="Content" onUpdate={onUpdate} hideTitle={true}/>
        </div>
      </div>
      case "textCSV":
      case 'text': return <div className="content-editor__box" key={`${content.type}Fields`}>
          <div>
            <h2 className="contentTitle">Would you like to import individualized content from a CSV?</h2>
            <RadioIcon checked = {this.isCSV()} offApprove = {this.offCSV} onApprove = {this.onCSV}/>
            <h2 className="contentTitle">Add a Title</h2>
            <TextEditor content={content} prop="title" title="Title" placeholder="Acme Co. Name" onUpdate={onUpdate} isTitle={true} hideTitle={true}/>
          </div>
          {this.isCSV()
          ? <div>
              <h2 className="contentTitle">Download a CSV Template</h2>
              <CSVLink className="csvButton" data={this.makeCSVTemplate()} filename={"questions.csv"}>Download</CSVLink>
              <h2 className="contentTitle">Choose file for import</h2>
              <CsvParse
                className="csv-input"
                keys={["email", "description"]}
                onDataUploaded={this.handleImport}
                onError={this.props.handleError}
                render={onChange => <input type="file" onChange={onChange} />}
              />
              {content.rawData ? <CSVLink className="csvButton" data={content.rawData} filename={"questions.csv"}>Download Uploaded Content</CSVLink> : null}
              {this.state.totalImport > 0 && <h2 className="successText">{`Successfully imported ${this.state.succesfulImport} of ${this.state.totalImport}`}</h2>}
          </div>
          : <div className="homeBox">
            <h2 className="contentTitle">Add Content</h2>
            <MultiLineEditor content={content} prop="text" title="Content" onUpdate={onUpdate} hideTitle={true}/>
          </div>}
        </div>
      case "webCSV":
      case 'web': return <div className="content-editor__box" key={`${content.type}Fields`}>
          <div>
            <h2 className="contentTitle">Would you like to import individualized content from a CSV?</h2>
            <RadioIcon checked = {this.isCSV()} offApprove = {this.offCSV} onApprove = {this.onCSV}/>
            <h2 className="contentTitle">Add a Title</h2>
            <TextEditor content={content} prop="title" title="Title" placeholder="Acme Co. Website" onUpdate={onUpdate} isTitle={true} hideTitle={true}/>
          </div>
          {this.isCSV()
          ? <div>
              <h2 className="contentTitle">Download a CSV Template</h2>
              <CSVLink className="csvButton" data={this.makeCSVTemplate()} filename={"questions.csv"}>Download</CSVLink>
              <h2 className="contentTitle">Choose file for import</h2>
              <CsvParse
                className="csv-input"
                keys={["email", "url"]}
                onDataUploaded={this.handleImport}
                onError={this.props.handleError}
                render={onChange => <input type="file" onChange={onChange} />}
              />
              {content.rawData ? <CSVLink className="csvButton" data={content.rawData} filename={"questions.csv"}>Download Uploaded Content</CSVLink> : null}
              {this.state.totalImport > 0 && <h2 className="successText">{`Successfully imported ${this.state.succesfulImport} of ${this.state.totalImport}`}</h2>}
          </div>
          : <div className="homeBox">
            <h2 className="contentTitle">Add Content</h2>
            <TextEditor content={content} prop="url" title="URL" regex={/^https?:\/\/[^/]/} validationMessage="The URL must begin with 'https://' or 'http://'" placeholder="http://www.acme.com" onUpdate={onUpdate} hideTitle={true}/>
          </div>}
        </div>
      case "videoCSV":
      case 'video': return <div className="content-editor__box" key={`${content.type}Fields`}>
        <div>
          <h2 className="contentTitle">Would you like to import individualized content from a CSV?</h2>
          <RadioIcon checked = {this.isCSV()} offApprove = {this.offCSV} onApprove = {this.onCSV}/>
          <h2 className="contentTitle">Add a Title</h2>
          <TextEditor content={content} prop="title" title="Title" placeholder="Acme Co. Website" onUpdate={onUpdate} isTitle={true} hideTitle={true}/>
        </div>
        {this.isCSV()
        ? <div>
            <h2 className="contentTitle">Download a CSV Template</h2>
            <CSVLink className="csvButton" data={this.makeCSVTemplate()} filename={"questions.csv"}>Download</CSVLink>
            <h2 className="contentTitle">Choose file for import</h2>
            <CsvParse
              className="csv-input"
              keys={["email", "url"]}
              onDataUploaded={this.handleImport}
              onError={this.props.handleError}
              render={onChange => <input type="file" onChange={onChange} />}
            />
            {content.rawData ? <CSVLink className="csvButton" data={content.rawData} filename={"questions.csv"}>Download Uploaded Content</CSVLink> : null}
            {this.state.totalImport > 0 && <h2 className="successText">{`Successfully imported ${this.state.succesfulImport} of ${this.state.totalImport}`}</h2>}
          </div>
          : <div className="homeBox">
            <h2 className="contentTitle">Add a Youtube Link</h2>
            <TextEditor content={content} prop="url" title="URL" regex={/^(https?:\/\/)(www\.)?(youtube\.com|youtu\.?be)\/.+$/} validationMessage="Your video must follow the placeholder format" placeholder="https://www.youtube.com/watch?v=Ycd-C85AdCk" onUpdate={onUpdate} hideTitle={true}/>
          </div>}
        </div>
      case 'survey': return <div className="content-editor__box" key={`${content.type}Fields`}>
          <h2 className="contentTitle">Choose Survey</h2>
          <SelectEditor size={6} content={content} prop="surveyId" title="Survey" onUpdate={this.onUpdateSurvey} options={surveys} />
        </div>
      default: return <div />
    }
  }

  isCSV = () => {
    return ['textCSV', 'webCSV', 'videoCSV'].includes(this.props.content.type)
  }

  onCSV = () => {
    const {onUpdate} = this.props
    onUpdate('type', `${this.props.content.type}CSV`)
  }

  offCSV = () => {
    const {onUpdate} = this.props
    onUpdate('type', this.props.content.type.replace('CSV', ''))
  }

  handleImport = (data) => {
    const {content} = this.props
    let newData = []
    const attendeeImportPromises = data.map(cell => client.getAttendees(cell.email)
    .then(attendees => ({...attendees[0]}))
    .catch(err => "error"))
    Promise.all(attendeeImportPromises).then(attendees =>{
      data.forEach(userInfo => {
        const currentUser = attendees.find(user => user.email === userInfo.email)
        if (currentUser) {
          let newUserData = {}
          const underlyingType = content.type.replace('CSV', '')
          console.log(userInfo)
          if (underlyingType === 'text' ? userInfo.description.length : userInfo.url.length) {
            newUserData = {checkAll: false, order: content.order, title: content.title, type: underlyingType, attendeeIds: [currentUser.id]}
            if (underlyingType === 'text') {
              newUserData.text = userInfo.description
            } else {
              newUserData.url = userInfo.url
            }
            newData.push(newUserData)
          }
        }
      })
      this.setState({succesfulImport: newData.length, totalImport: data.length})
      this.props.onUpdate("rawData", newData)
    }
    )
  }

  makeCSVTemplate = () => {
    const {content} = this.props
    let csvTemplate = [{}]
    if (content.type === "textCSV") csvTemplate = [{"email": "test@doubledutch.me", "description": "test info"}]
    if (content.type === "webCSV" || content.type === "videoCSV") csvTemplate = [{"email": "test@doubledutch.me", "url": "https://test.youtube.com"}]
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
