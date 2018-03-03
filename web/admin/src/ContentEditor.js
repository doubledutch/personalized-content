import React, { PureComponent } from 'react'
import { Link } from 'react-router-dom'

import AttendeeSelector from './AttendeeSelector'
import ContentDetailsEditor from './ContentDetailsEditor'
import ContentButtons from './ContentButtons'
import ContentPreview from './ContentPreview'

export default class ContentEditor extends PureComponent {
  constructor(props) {
    super()
  }
  render() {
    const {content, getAttendees, groups, onDelete, onUpdate, surveys, tiers} = this.props
    return (
      <div>
        <div>
          <button className="button-big red" onClick={onDelete}>Delete</button>
        </div>
        <AttendeeSelector
          content={content}
          onUpdate={onUpdate}
          getAttendees={getAttendees}
          allUsers={this.props.allUsers}
          groups={groups}
          tiers={tiers}
        />
        <div className="content-editor__content">
          <div className="editorBox">
            <ContentButtons content={content} onUpdate={onUpdate}/>
            <ContentPreview content={[content]} surveys={surveys}/>
          </div>
          <ContentDetailsEditor content={content} onUpdate={onUpdate} surveys={surveys} />
          <Link to="/" className="button-big">Submit Content</Link>
        </div>
      </div>
    )
  }
}
