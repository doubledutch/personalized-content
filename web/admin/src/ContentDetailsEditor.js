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
    const {onUpdate} = this.props
    switch (c.type) {
      case 'text': return <div>
        <TextEditor content={c} prop="title" title="Title" onUpdate={onUpdate} />
        <TextEditor content={c} prop="text" title="Text" onUpdate={onUpdate} />
      </div>
      case 'web': return <div>
        <TextEditor content={c} prop="title" title="Title" onUpdate={onUpdate} />
        <TextEditor content={c} prop="url" title="URL" onUpdate={onUpdate} />
      </div>
      case 'survey': return <div>
        TODO: Survey UI
      </div>
      default: return <div />
    }
  }
}