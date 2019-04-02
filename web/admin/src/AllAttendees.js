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
import client, { translate as t } from '@doubledutch/admin-client'
import debounce from 'lodash.debounce'

export default class AllAttendees extends PureComponent {
  constructor() {
    super()
    this.state = {
      search: '',
      id: '',
      attendees: [],
    }
  }

  componentDidMount() {
    this.searchAttendees(this.state.search)
    this.downloadUserData(this.props.id || '')
  }

  componentDidUpdate(prevProps, prevState) {
    const { attendeeContent, groupContent, tierContent } = this.state
    if (prevProps.hidden !== this.props.hidden) {
      this.setState({ search: '', id: '' })
      this.searchAttendees('')
    }
    if (
      JSON.stringify(attendeeContent) !== JSON.stringify(prevState.attendeeContent) ||
      JSON.stringify(groupContent) !== JSON.stringify(prevState.groupContent) ||
      JSON.stringify(tierContent) !== JSON.stringify(prevState.tierContent)
    ) {
      if (!attendeeContent && !groupContent && !tierContent) return null
      const content = unique(
        x => x.key,
        (attendeeContent || []).concat(tierContent || []).concat(groupContent || []),
      ).sort((a, b) => a.order - b.order)
      this.props.updateUserData(content)
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

  downloadUserData = id => {
    if (id) {
      const user = this.state.attendees.find(user => id === user.id)
      if (user) {
        const setContent = (stateKey, filter) => data => {
          const content = data.val() || {}
          const contentArray = Object.keys(content).map(key => Object.assign(content[key], { key }))
          const filteredContentArray = filter ? contentArray.filter(filter) : contentArray
          this.setState({ [stateKey]: filteredContentArray })
        }
        this.props.fbc.database.public
          .adminRef('content')
          .once(
            'value',
            setContent(
              'groupContent',
              c =>
                !c.groupIds || user.userGroupIds.find(g => Object.values(c.groupIds).includes(g)),
            ),
          )
        this.props.fbc.database.private
          .adminableUsersRef(id)
          .once('value', setContent('attendeeContent'))
        this.props.fbc.database.private
          .tiersRef(user.tierId)
          .once('value', setContent('tierContent'))
      }
    } else {
      this.props.hideModal()
    }
  }
}

function unique(identityFn, array) {
  const alreadySeenKeys = {}
  return array.filter(x => {
    const key = identityFn(x)
    if (alreadySeenKeys[key]) return false
    alreadySeenKeys[key] = true
    return true
  })
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
