import React, { PureComponent } from 'react'
import AttendeeSelector from './AttendeeSelector'
import ContentDetailsEditor from './ContentDetailsEditor'
import ContentButtons from './ContentButtons'

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
          <button onClick={onDelete}>Delete</button>
        </div>
        <div>TODO - Content editor goes here for content w/ key: "{key}"</div>
        <AttendeeSelector content={content} onUpdate={onUpdate} allUsers={this.props.allUsers} />
        <ContentButtons content={content} onUpdate={onUpdate}/>
        <ContentDetailsEditor content={content} onSave={onExit} onUpdate={onUpdate} />
      </div>
    )
  }
}
