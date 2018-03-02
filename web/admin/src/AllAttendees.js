import React, { PureComponent } from 'react'
import debounce from 'lodash.debounce'

export default class AllAttendees extends PureComponent {

  state = {
    search: ''
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
    const {search} = this.state
    return (
      <div style={{width: 600, marginRight: 60}}>
        <span className="content-bar">
          <h2 className="contentTitle">Select Attendees</h2>
          <div className="searchBar">
          <input type="text" placeholder="Search" value={search} onChange={this.onSearchChange} />
          </div>
        </span>
        <div className="attendee-selector">
          <table className="attendee-selector__table">
            <tbody>
              { [this.renderTableRows()] }
              
            </tbody>
          </table>
          
        </div>
        { this.renderSelectRows()}
      </div>
      
    )
  }

  renderTableRows = () => {
        if (!this.state.attendees) return <tr key={0}><td></td><td>Loading...</td></tr>
        return this.state.attendees.map(a => {
          return <tr key={a.id} className={'attendee-selector__attendee'}>
            <td><button className="attendee-selector__name" value={a.id} onClick={this.downloadUserData}>{a.firstName} {a.lastName}</button></td>       
            {/* <button value={a.id} onClick={this.downloadUserData}>View</button> */}
          </tr>
        })
  }

  

  renderSelectRows = () => {
    if (!this.state.attendees) return <tr key={0}><td></td><td>Loading...</td></tr>
    
    return<label className="select-editor" style={{width: 500}}>
    <select
      size={6}
    >
      { this.state.attendees.map(o => <option className="select-editor__option" value={o.id} key={o.id}>{o.name}</option>) }
    </select>
  </label>
  }

  downloadUserData = (event) => {
    const id = event.target.value
    const user = this.state.attendees.find(user => user.id === id)
    const userContent = this.props.content.filter(c =>
      doArraysIntersect(user.userGroupIds, c.groupIds)  // Is attendee part of one of the selected attendee groups?
      || c.attendeeIds.includes(user.id)                // ...or is he/she specifically selected?
      || c.tierIds.includes(user.tierId)                // ...or is he/she in one of the selected tiers?
    )
    this.props.updateUserData(userContent)
  }
}

const doArraysIntersect = (a, b) => !!a.find(aItem => b.includes(aItem))
