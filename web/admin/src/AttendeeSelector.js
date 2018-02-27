import React, { PureComponent } from 'react'
import debounce from 'lodash.debounce'

export default class AttendeeSelector extends PureComponent {
  state = {
    search: '',
    view: 'attendees'
  }

  componentDidMount() {
    this.searchAttendees(this.state.search)
  }

  searchAttendees = debounce(query => {
    this.lastSearch = query
    this.props.getAttendees(query).then(attendees => {
      if (this.lastSearch === query) {
        this.setState({attendees})
      }
    })
  }, 300)

  onSearchChange = event => {
    const search = event.target.value
    this.setState({search})
    this.searchAttendees(search)
  }

  render() {
    const {search, view} = this.state
    return (
      <div>
        <h2>Select Attendees</h2>

        <div className="attendee-selector">
          <div className="attendee-selector__menu">
            <div className="attendee-selector__menu-header">{this.menuHeaderText()}</div>
            <div className={this.classNameForMenuItem('attendees')} onClick={this.viewAllAttendees}>All attendees</div>
            <div className={this.classNameForMenuItem('tiers')} onClick={this.viewTiers}>Tiers</div>
            <div className={this.classNameForMenuItem('groups')} onClick={this.viewGroups}>Groups</div>
          </div>
          <table className="attendee-selector__table">
            <thead>
              { view === 'attendees'
                ? <tr>
                    <td>&nbsp;</td>
                    <td><input className="attendee-selector__search" type="text" placeholder="Search" value={search} onChange={this.onSearchChange} /></td>
                    <td>Tiers</td> 
                    <td>Groups</td> 
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
        </div>
      </div>      
    )
  }

  renderTableRows = () => {
    switch (this.state.view) {
      case 'attendees':
      const {attendeeIds} = this.props.content
        if (!this.state.attendees) return <tr key={0}><td></td><td>Loading...</td></tr>
        return this.state.attendees.map(a => <tr key={a.id}>
          <td><input type="checkbox" checked={attendeeIds.includes(a.id)} onChange={this.onAttendeeChange(a.id)} /></td>
          <td className="attendee-selector__name">{a.firstName} {a.lastName}</td>
          <td><span className="pill blue">VIP</span></td>
          <td><span className="pill white">Engineering</span><span className="pill white">Marketing</span></td>
        </tr>)
      case 'tiers':
      const {tierIds} = this.props.content
        return this.props.tiers.map(t => <tr key={t.id}>
          <td><input type="checkbox" checked={tierIds.includes(t.id)} onChange={this.onTierChange(t.id)} /></td>
          <td className="attendee-selector__name">{t.name}</td>
          <td className="attendee-selector__name">{t.attendeeCount} attendees</td>
        </tr>)
      case 'groups':
      const {groupIds} = this.props.content
      return this.props.groups.map(g => <tr key={g.id}>
        <td><input type="checkbox" checked={groupIds.includes(g.id)} onChange={this.onGroupChange(g.id)} /></td>
        <td className="attendee-selector__name">{g.name}</td>
      </tr>)
    default:
        return null
    }
  }

  menuHeaderText = () => {
    const {content, tiers} = this.props
    const {attendeeIds, tierIds, groupIds} = content
    if (groupIds.length) return 'Filters selected'
    if (!attendeeIds.length && !tierIds.length) return 'No filters selected'
    const tiersById = tiers.reduce((byId, tier) => { byId[tier.id] = tier; return byId; }, {})
    const count = attendeeIds.length + tierIds.reduce((count, tierId) => count + (tiersById[tierId] ? tiersById[tierId].attendeeCount : 0), 0)
    return `${count} selected`
    //if (attendeeIds.length && !tierids.length && !gro)
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
  }

  removeAllFilters = filterKey => () => this.props.onUpdate(filterKey, [])
  removeFilter = filterKey => id => {
    const {content, onUpdate} = this.props
    onUpdate(filterKey, content[filterKey].filter(x => x !== id))
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
