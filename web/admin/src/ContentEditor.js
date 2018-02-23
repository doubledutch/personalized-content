import React, { PureComponent } from 'react'
import AttendeeSelector from './AttendeeSelector'
import ContentDetailsEditor from './ContentDetailsEditor'

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
        <ContentDetailsEditor content={content} onUpdate={onUpdate} />
      </div>
    )
  }
}
