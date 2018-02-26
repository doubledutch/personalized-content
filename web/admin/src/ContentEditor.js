import React, { PureComponent } from 'react'
import { Link } from 'react-router-dom'

import AttendeeSelector from './AttendeeSelector'
import ContentDetailsEditor from './ContentDetailsEditor'
import ContentButtons from './ContentButtons'

export default class ContentEditor extends PureComponent {
  constructor(props) {
    super()
  }
  render() {
    const {content, groups, onDelete, onUpdate, tiers} = this.props
    const {key} = content
    return (
      <div>
        <div>
          <Link to="/" className="button-big">Done</Link>
          <button className="button-big red" onClick={onDelete}>Delete</button>
        </div>
        <AttendeeSelector content={content} onUpdate={onUpdate} allUsers={this.props.allUsers} groups={groups} tiers={tiers} />
        <ContentButtons content={content} onUpdate={onUpdate}/>
        <ContentDetailsEditor content={content} onUpdate={onUpdate} />
      </div>
    )
  }
}
