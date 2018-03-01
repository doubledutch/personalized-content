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
          <Link to="/" className="button-big">Done</Link>
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
        <div>
          <div className="editorBox">
            <ContentButtons content={content} onUpdate={onUpdate}/>
            <ContentPreview content={content}/>
          </div>
          <ContentDetailsEditor content={content} onUpdate={onUpdate} surveys={surveys} />
          
        </div>
      </div>
    )
  }
}
