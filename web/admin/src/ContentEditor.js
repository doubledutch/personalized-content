/*
 * Copyright 2018 DoubleDutch, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
    const {
      content,
      getAttendees,
      groups,
      onDelete,
      onUpdate,
      surveys,
      tiers,
      handleImport,
    } = this.props
    return (
      <div>
        <div />
        <div className="content-editor__content">
          <div className="editorBox">
            <ContentButtons content={content} onUpdate={onUpdate} />
            <ContentPreview content={[content]} surveys={surveys} hidden />
          </div>
          <ContentDetailsEditor
            content={content}
            onUpdate={onUpdate}
            surveys={surveys}
            handleImport={handleImport}
            allUsers={this.props.allUsers}
          />
        </div>
        <AttendeeSelector
          content={content}
          onUpdate={onUpdate}
          getAttendees={getAttendees}
          allUsers={this.props.allUsers}
          groups={groups}
          tiers={tiers}
        />
        <button className="button-big red" onClick={onDelete}>
          Delete
        </button>
        <Link to="/" className="button-big">
          Done
        </Link>
      </div>
    )
  }
}
