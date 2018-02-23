import React, { PureComponent } from 'react'
import { TextEditor } from './editors'
import AttendeeSelector from './AttendeeSelector'

export default class ContentEditor extends PureComponent {
  constructor(props) {
    super()
  }
  render() {
    const {content, onExit, onDelete, onUpdate} = this.props
    const {key} = content
    return (
      <div>
        <div>
          <button onClick={onExit}>&lt; Back</button>
          <button onClick={onDelete}>Delete</button>
        </div>
        <div>TODO - Content editor goes here for content w/ key: "{key}"</div>
        <AttendeeSelector content={content} onUpdate={onUpdate} allUsers={this.props.allUsers} />
        <div>
          {content.attendeeIds.length
            ? <button onClick={this.removeAllAttendeeIds}>- attendee</button>
            : <button onClick={() => this.addAttendeeId(24601)}>+ attendee</button>
          }
          {content.tierIds.length
            ? <button onClick={this.removeAllTierIds}>- tiers</button>
            : <span><button onClick={() => this.addTierId(42)}>+ tier 42</button><button onClick={() => this.addTierId('default')}>+ default tier</button></span>
          }
        </div>
        { this.editorFor(content) }
      </div>
    )
  }

  editorFor = c => {
    const {onUpdate} = this.props
    switch (c.type) {
      case 'text': return <div>
        <TextEditor content={c} prop="title" title="Title" onUpdate={onUpdate} />
        <TextEditor content={c} prop="text" title="Text" onUpdate={onUpdate} />
        <div>{JSON.stringify(c)}</div>
      </div>
      case 'web': return <div>
        <TextEditor content={c} prop="title" title="Title" onUpdate={onUpdate} />
        <TextEditor content={c} prop="url" title="URL" onUpdate={onUpdate} />
        <div>{JSON.stringify(c)}</div>
      </div>
      case 'survey': return <div>
        <div>{JSON.stringify(c)}</div>
      </div>
      default: return <div />
    }
  }
}
