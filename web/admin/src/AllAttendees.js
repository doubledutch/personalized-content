import React, { PureComponent } from 'react'
import debounce from 'lodash.debounce'

export default class AllAttendees extends PureComponent {

  state = {
    search: '',
    id: "",
    hidden: false
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

  hideTable = () => {
    var current = this.state.hide
    this.setState({hide: !current})

  }

  render() {
    const {search} = this.state
    if (this.state.hide) {
      return (
        <div className="all-attendees__table">
          <span className="content-bar">
            <button className='contentTitle__button' onClick={this.hideTable}>Hide Attendees</button>
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
        </div>
      )
    }
    else {
      return (
        <div className="all-attendees__table">
        <span className="content-bar">
          <button className='contentTitle__button' onClick={this.hideTable}>Show Attendees</button>
        </span>
      </div>
      )
    }
  }

  renderTableRows = () => {
    
    if (!this.state.attendees) return <tr key={0}><td></td><td>Loading...</td></tr>
    return this.state.attendees.map(a => {
      return <tr key={a.id} className={'attendee-selector__attendee' + ((this.state.id === a.id) ? '--gray' : '')}> 
        <td><button className={'attendee-selector__name' + ((this.state.id === a.id) ? '--gray' : '')} value={a.id} onClick={this.downloadUserData}>{a.firstName} {a.lastName}</button></td>       
      </tr>
    })
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
    this.setState({id})
  }
}

const doArraysIntersect = (a, b) => !!a.find(aItem => b.includes(aItem))
