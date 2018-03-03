import React, { PureComponent } from 'react'
import { SelectEditor, TextEditor, MultiLineEditor } from './editors'

export default class ContentDetailsEditor extends PureComponent {

  render() {
    const {content} = this.props
    
    return (
      <div>
        { this.editorFor(content) }
      </div>
    )
  }

  editorFor = c => {
    const {onUpdate, surveys} = this.props
    switch (c.type) {
      case 'text': return <div>
          <div>
            <h2 className="contentTitle">Add a Title</h2>
            <TextEditor content={c} prop="title" title="Title" placeholder="Acme Co Name" onUpdate={onUpdate} isTitle={true}/>
          </div>
          <div className="homeBox">
            <h2 className="contentTitle">Add Content</h2>
            <MultiLineEditor content={c} prop="text" title="Content" placeholder="Acme Co Details" onUpdate={onUpdate} />
          </div>
        </div>
      case 'web': return <div>
          <div>
            <h2 className="contentTitle">Add a Title</h2>
            <TextEditor content={c} prop="title" title="Title" placeholder="Acme Co Website" onUpdate={onUpdate} />
          </div>
          <div className="homeBox">
            <h2 className="contentTitle">Add Content</h2>
            <TextEditor content={c} prop="url" title="URL" regex={/^https?:\/\/[^/]/} validationMessage="The URL must begin with 'https://' or'http://'" placeholder="http://www.acme.com" onUpdate={onUpdate} />
          </div>
        </div>
      case 'survey': return <div>
          <h2 className="contentTitle">Choose Survey</h2>
          <SelectEditor size={6} content={c} prop="surveyId" title="Survey" onUpdate={onUpdate} options={surveys} />
        </div>
      default: return null
    }
  }
}