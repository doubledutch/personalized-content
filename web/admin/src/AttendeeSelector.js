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
import {translate as t} from '@doubledutch/admin-client'
import debounce from 'lodash.debounce'

export default class AttendeeSelector extends PureComponent {
  constructor(props) {
    super(props)
    this.updateTiersAndGroups(props)
  }

  state = {
    search: '',
    view: 'attendees',
    attendees: [],
  }

  componentWillReceiveProps(props) {
    this.updateTiersAndGroups(props)
  }

  updateTiersAndGroups = props => {
    const getById = prop => this.props[prop].reduce((byId, obj) => { byId[obj.id] = obj; return byId; }, {})
    this.tiers = getById('tiers')
    this.groups = getById('groups')
  }

  componentDidMount() {
    this.searchAttendees(this.state.search)
  }

  searchAttendees = debounce(query => {
    this.lastSearch = query
    //The purpose of this line of code is to prevent queries with any special characters which will in any case return no results but also cause the search results to error out
    if (/^[a-zA-Z0-9 _]*$/.test(query)) {
      this.props.getAttendees(query).then(attendees => {
        if (this.lastSearch === query) {
          this.setState({attendees: attendees.sort(sortUsers)})
        }
      })
    }
  }, 300)

  onSearchChange = event => {
    const search = event.target.value
    this.setState({search})
    this.searchAttendees(search)
  }

  render() {
    const {search, view} = this.state
    const type = this.props.content.type
    if (type === "textCSV" || type === "webCSV" || type === "videoCSV") this.csvSelectAll()
    return (
      <div>
        <h2 className="contentTitle">{t("selectAttendees")}</h2>
        {type === "textCSV" || type === "webCSV" || type === "videoCSV"? <p>{t("unavailableCSV")}</p> : <div className="attendee-selector">
          <div className="attendee-selector__menu">
            <div className="attendee-selector__menu-header">{this.menuHeaderText()}</div>
            <div className={this.classNameForMenuItem('attendees')} onClick={this.viewAllAttendees}>{t("allAttendees")}</div>
            <div className={this.classNameForMenuItem('tiers')} onClick={this.viewTiers}>{t("tiers")}</div>
            <div className={this.classNameForMenuItem('groups')} onClick={this.viewGroups}>{t("groups")}</div>
          </div>
          <table className="attendee-selector__table">
            <thead>
              { view === 'attendees'
                ? <tr>
                    <td>{this.selectAll()}</td>
                    <td className="attendee-selector__column__space"><input className="attendee-selector__search" type="text" placeholder="Search" value={search} onChange={this.onSearchChange} /></td>
                    <td className="attendee-selector__column">{t("tiers")}</td> 
                    <td className="attendee-selector__column">{t("groups")}</td> 
                  </tr>
                : <tr>
                    <td>&nbsp;</td>
                    <td>{view.substring(0,1).toUpperCase()}{view.substring(1)}</td>
                  </tr>
              }
            </thead>
            <tbody>
              { [this.renderTableRows()] }
            </tbody>
          </table>
        </div>}
      </div>
    )
  }

  renderTableRows = () => {
    const {tierIds, groupIds} = this.props.content
    switch (this.state.view) {
      case 'attendees':
      const {attendeeIds} = this.props.content
      if (!this.state.attendees.length){
        if (this.state.search) {
          return (
            <div className="current-content__list-text">
              <h1>{t("searchHelp")}</h1>
              <h2>{t("searchHelpDes")}</h2>
            </div>
          )
        }
        else {
          return <tr key={0}><td></td><td></td></tr>
        }
      }
        return this.state.attendees.map(a => {
          const inTierOrGroup = isAttendeeInTierOrGroup(a, tierIds, groupIds)
          return <tr key={a.id} className={'attendee-selector__attendee' + (inTierOrGroup ? '--disabled' : '')}>
            <td>
              {!inTierOrGroup && <input type="checkbox" checked={attendeeIds.includes(a.id)} onChange={this.onAttendeeChange(a.id)} /> }
            </td>
            <td className="attendee-selector__name">{a.firstName} {a.lastName}</td>
            <td>
              { this.tiers[a.tierId] && <span className="pill blue">{this.tiers[a.tierId].name}</span> }
            </td>
            <td>
              { a.userGroupIds.map(id => this.groups[id] && <span className="pill white" key={id}>{this.groups[id].name}</span>) }
            </td>
          </tr>
        })
      case 'tiers':
        return this.props.tiers.map(t => <tr key={t.id}>
          <td><input type="checkbox" checked={tierIds.includes(t.id)} onChange={this.onTierChange(t.id)} /></td>
          <td className="attendee-selector__name">{t.name}</td>
          <td className="attendee-selector__name">{t.attendeeCount} attendee{(t.attendeeCount > 1) ? "s" : ""}</td>
        </tr>)
      case 'groups':
      return this.props.groups.map(g => <tr key={g.id}>
        <td><input type="checkbox" checked={groupIds.includes(g.id)} onChange={this.onGroupChange(g.id)} /></td>
        <td className="attendee-selector__name">{g.name}</td>
      </tr>)
    default:
        return null
    }
  }

  menuHeaderText = () => {
    const {attendeeIds, tierIds, groupIds} = this.props.content
    if (groupIds.length) return 'Filters selected'
    if (tierIds.length) {
      const count = tierIds.reduce((count, tierId) => count + (this.tiers[tierId] ? this.tiers[tierId].attendeeCount : 0), 0)
      return (attendeeIds.length) ? `${count}+ selected` : `${count} selected`
    }
    if (this.props.content.checkAll) return "All selected"
    if (attendeeIds.length) return `${attendeeIds.length} selected`
    return 'No filters selected'
  }

  classNameForMenuItem = view => `attendee-selector__main-menu-item${view===this.state.view ? '--selected' : ''}`

  setView = view => this.setState({view})
  viewAllAttendees = () => this.setView('attendees')
  viewTiers = () => this.setView('tiers')
  viewGroups = () => this.setView('groups')

  onAttendeeChange = id => event => event.target.checked ? this.addAttendeeId(id) : this.removeAttendeeId(id)
  onTierChange     = id => event => event.target.checked ? this.addTierId(id)     : this.removeTierId(id)
  onGroupChange    = id => event => event.target.checked ? this.addGroupId(id)    : this.removeGroupId(id)

  addFilter = filterKey => id => {
    const {content, onUpdate} = this.props
    if (!content[filterKey].includes(id)) {
      onUpdate(filterKey, [...content[filterKey], id])
    }
    if (this.props.content.checkAll) {
      onUpdate("checkAll", false)
    }    
  }

  selectAll = () => {
    return (
      <label className="attendee-selector__column__checkBox">
        <input
          className="attendee-selector__column__checkBox__input"
          name="selectAll"
          type="checkbox"
          checked={this.props.content.checkAll}
          onChange={this.addSelectAll} />
           {t("selectAll")}
      </label>
    )
  }

  removeAllFilters = filterKey => () => this.props.onUpdate(filterKey, [])
  removeFilter = filterKey => id => {
    const {content, onUpdate} = this.props
    onUpdate(filterKey, content[filterKey].filter(x => x !== id))
  }

  addSelectAll = (e) => {
    var check = e.target.checked
    if (check) {
      this.removeAllAttendeeIds()
      this.removeAllTierIds()
      this.removeAllGroupIds()
    }
    this.props.onUpdate("checkAll", check)
  }

  csvSelectAll = () => {
    this.removeAllAttendeeIds()
    this.removeAllTierIds()
    this.removeAllGroupIds()
  }

  addAttendeeId = this.addFilter('attendeeIds')
  removeAttendeeId = this.removeFilter('attendeeIds')
  removeAllAttendeeIds = this.removeAllFilters('attendeeIds')

  addTierId = this.addFilter('tierIds')
  removeTierId = this.removeFilter('tierIds')
  removeAllTierIds = this.removeAllFilters('tierIds')

  addGroupId = this.addFilter('groupIds')
  removeGroupId = this.removeFilter('groupIds')
  removeAllGroupIds = this.removeAllFilters('groupIds')
}

function sortUsers(a,b) {
  const aFirst = a.firstName.toLowerCase()
  const bFirst = b.firstName.toLowerCase()
  const aLast = a.lastName.toLowerCase()
  const bLast = b.firstName.toLowerCase()
  if (aFirst !== bFirst) return aFirst < bFirst ? -1 : 1
  return aLast < bLast ? -1 : 1
}

export function isAttendeeInTierOrGroup(attendee, tierIds, groupIds) {
  return tierIds.includes(attendee.tierId) || !!groupIds.find(g => attendee.userGroupIds.includes(g))
}
