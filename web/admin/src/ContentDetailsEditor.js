import React, { PureComponent } from 'react'
import { SelectEditor, TextEditor, MultiLineEditor } from './editors'

export default class ContentDetailsEditor extends PureComponent {
  render() {
    const {content, onUpdate, surveys} = this.props
    
    switch (content.type) {
      case 'text': return <div className="content-editor__box">
          <div>
            <h2 className="contentTitle">Add a Title</h2>
            <TextEditor content={content} prop="title" title="Title" placeholder="Acme Co Name" onUpdate={onUpdate} isTitle={true}/>
          </div>
          <div className="homeBox">
            <h2 className="contentTitle">Add Content</h2>
            <MultiLineEditor content={content} prop="text" title="Content" placeholder="Acme Co Details" onUpdate={onUpdate} />
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
          <SelectEditor size={6} content={content} prop="surveyId" title="Survey" onUpdate={onUpdate} options={surveys} />
        </div>
      default: return <div />
    }
  }
}
