import React, { PureComponent } from 'react'
import { SelectEditor, TextEditor } from './editors'

export default class ContentDetailsEditor extends PureComponent {

  render() {
    const {content} = this.props
    
    return (
      <div>
        { this.editorFor(content) }
        <div>{JSON.stringify(content)}</div>
      </div>
    )
  }

  editorFor = c => {
    const {onUpdate, surveys} = this.props
    switch (c.type) {
      case 'text': return <div>
          <div>
            <h2>Add a Title</h2>
            <TextEditor content={c} prop="title" title="Title" placeholder="Acme Co Name" onUpdate={onUpdate} />
          </div>
          <div className="homeBox">
            <h2>Add Content</h2>
            <TextEditor content={c} prop="text" title="Content" placeholder="Acme Co Details" onUpdate={onUpdate} />
          </div>
        </div>
      case 'web': return <div>
          <div>
            <h2>Add a Title</h2>
            <TextEditor content={c} prop="title" title="Title" placeholder="Acme Co Website" onUpdate={onUpdate} />
          </div>
          <div className="homeBox">
            <h2>Add Content</h2>
            <TextEditor content={c} prop="url" title="URL" regex={/^https?:\/\/[^/]/} validationMessage="The URL must begin with 'https://' or'http://'" placeholder="http://www.acme.com" onUpdate={onUpdate} />
          </div>
        </div>
      case 'survey': return <div>
          <h2>Select a global survey</h2>
          <SelectEditor content={c} prop="surveyId" title="Survey" onUpdate={onUpdate} options={surveys} />
        </div>
      default: return null
    }
  }
}