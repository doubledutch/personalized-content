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
import { translate as t } from '@doubledutch/admin-client'
import debounce from 'lodash.debounce'

export default class AllAttendees extends PureComponent {
  constructor() {
    super()
    this.state = {
      search: '',
      id: '',
      content: {},
      attendees: [],
    }
  }

  componentDidMount() {
    this.searchAttendees(this.state.search)
    this.downloadUserData(this.state.id, this.props.content)
    this.setState({ content: this.props.content })
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.content !== nextProps.content) {
      this.downloadUserData(this.state.id, nextProps.content)
      this.setState({ content: nextProps.content })
    }
    if (nextProps.hidden) {
      this.setState({ search: '' })
      this.searchAttendees('')
    }
  }

  searchAttendees = debounce(query => {
    this.lastSearch = query
    // The purpose of this line of code is to prevent queries with any special characters which will in any case return no results but also cause the search results to error out
    if (!/[~`!#$%^&*+=\-()[\]\\';,/{}|\\":<>?]/g.test(query)) {
      this.props.getAttendees(query).then(attendees => {
        if (this.lastSearch === query) {
          this.setState({ attendees: attendees.sort(sortUsers) })
        }
      })
    }
  }, 300)

  onSearchChange = event => {
    const search = event.target.value
    this.setState({ search })
    this.searchAttendees(search)
  }

  render() {
    const { search } = this.state
    const { hidden } = this.props
    if (hidden) {
      return (
        <div className="all-attendees__table">
          <span className="content-bar">
            <button
              className="contentTitle__button"
              disabled={this.props.disable}
              onClick={this.props.hideTable}
            >
              {t('hideAttendees')}
            </button>
            <div className="searchBar">
              <input
                type="text"
                placeholder="Search"
                value={search}
                onChange={this.onSearchChange}
              />
            </div>
          </span>
          <div className="attendee-selector">
            <table className="attendee-selector__table">
              <tbody>{[this.renderTableRows()]}</tbody>
            </table>
          </div>
        </div>
      )
    }

    return (
      <div className="all-attendees__table">
        <span className="content-bar">
          <button
            className="contentTitle__button"
            disabled={this.props.disable}
            onClick={this.props.hideTable}
          >
            {t('viewAttendees')}
          </button>
        </span>
      </div>
    )
  }

  renderTableRows = () => {
    if (!this.state.attendees.length) {
      if (this.state.search) {
        return (
          <div className="current-content__list-text">
            <h1>{t('searchHelp')}</h1>
            <h2>{t('searchHelpDes')}</h2>
          </div>
        )
      }

      if (this.props.allUsers)
        return (
          <tr key={0}>
            <td />
            <td />
          </tr>
        )
    }
    return this.state.attendees.map(a => (
      <tr
        key={a.id}
        className={`attendee-selector__attendee${this.state.id === a.id ? '--gray' : ''}`}
      >
        <td>
          <button
            className={`attendee-selector__button${this.state.id === a.id ? '--gray' : ''}`}
            value={a.id}
            onClick={this.setId}
          >
            {a.firstName} {a.lastName}
          </button>
        </td>
      </tr>
    ))
  }

  setId = event => {
    if (event.target.value === this.state.id) {
      this.setState({ id: '' })
      this.downloadUserData('', this.props.content)
    } else {
      const id = event.target.value
      this.setState({ id })
      this.downloadUserData(id, this.state.content)
    }
  }

  downloadUserData = (id, content) => {
    if (id) {
      const user = this.state.attendees.find(user => user.id === id)
      const userContent = Object.values(content).filter(
        c =>
          doArraysIntersect(user.userGroupIds, c.groupIds) || // Is attendee part of one of the selected attendee groups?
          c.attendeeIds.includes(user.id) || // ...or is he/she specifically selected?
          c.tierIds.includes(user.tierId), // ...or is he/she in one of the selected tiers?
      )
      this.props.updateUserData(userContent)
    }
  }
}

function sortUsers(a, b) {
  const aFirst = a.firstName.toLowerCase()
  const bFirst = b.firstName.toLowerCase()
  const aLast = a.lastName.toLowerCase()
  const bLast = b.firstName.toLowerCase()
  if (aFirst !== bFirst) return aFirst < bFirst ? -1 : 1
  return aLast < bLast ? -1 : 1
}

const doArraysIntersect = (a, b) => !!a.find(aItem => b.includes(aItem))
