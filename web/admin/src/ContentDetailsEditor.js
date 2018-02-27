import React, { PureComponent } from 'react'
import { TextEditor } from './editors'

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
    const {onUpdate, onSave} = this.props
    switch (c.type) {
      case 'text': return <div>
        <div>
            <h2>Add a Title</h2>
            <TextEditor content={c} prop="title" title="Title" placeholder="Acme Co Name" onUpdate={onUpdate} />
          </div>
          <div className="homeBox">
            <h2>Add Content</h2>
            <TextEditor content={c} prop="text" title="Content" placeholder="Acme Co Details" onUpdate={onUpdate} />
            <button className="button-big" onClick={onSave}>Submit Content</button>
          </div>
      </div>
      case 'web': return <div>
        <div>
          <h2>Add a Title</h2>
          <TextEditor content={c} prop="title" title="Title" placeholder="Acme Co Website" onUpdate={onUpdate} />
        </div>
        <div className="homeBox">
          <h2>Add Content</h2>
          <TextEditor content={c} prop="url" title="URL" regex={/^https?:\/\/[^\/]/} validationMessage="The URL must begin with 'https://' or'http://'" placeholder="http://www.acme.com" onUpdate={onUpdate} />
          <button className="button-big" onClick={onSave}>Submit Content</button>
        </div>
      </div>
      case 'api': return <div>
        <div>
          <h2 className>Add a Title</h2>
          <TextEditor content={c} prop="title" title="Title" placeholder="Acme Co Website" onUpdate={onUpdate} />
        </div>
        <div className="homeBox">
          <h2>Add Content</h2>
          <TextEditor content={c} prop="url" title="URI" placeholder="" onUpdate={onUpdate} />
          <TextEditor content={c} prop="url" title="Username" placeholder="" onUpdate={onUpdate} />
          <TextEditor content={c} prop="url" title="Password" placeholder="" onUpdate={onUpdate} />
          <button className="button-big" onClick={onSave}>Submit Content</button>
        </div>
    </div>
      case 'survey': return <div>
        <div>
            <h2>Add a Title</h2>
            <TextEditor content={c} prop="title" title="Title" placeholder="Acme Co Name" onUpdate={onUpdate} />
          </div>
          <div className="homeBox">
            <h2>Add Content</h2>
            <TextEditor content={c} prop="text" title="Content" placeholder="Acme Co Details" onUpdate={onUpdate} />
            <TextEditor content={c} prop="url" title="URL" placeholder="http://www.acme.com" onUpdate={onUpdate} />
            <button className="button-big" onClick={onSave}>Submit Content</button>
          </div>
      </div>
      default: return <div />
    }
  }
}