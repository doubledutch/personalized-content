import React, { PureComponent } from 'react'
import SearchBar from './SearchBar'

export default class AttendeeSelector extends PureComponent {
  state = {
    newList: [],
    search: false
  }

  render() {
    return this.renderTable()
  }

  renderTable = () => {
    const {content} = this.props
    let list = this.props.allUsers
    if (this.state.search){
      list = this.state.newList
    }
    return (
      <div>
        <p>Select Attendees</p>
        <SearchBar updateList={this.updateList}/>
        <span className="leftContainer">
          <ul className="formBox">{ list.map(c => (
            this.selectAttendee(c)))}
          </ul>
        </span>
        <div>Tiers: {JSON.stringify(this.props.tiers)}</div>
        <div>Attendee Groups: {JSON.stringify(this.props.groups)}</div>
        <div>
          {content.attendeeIds.length
            ? <button onClick={this.removeAllAttendeeIds}>- attendee</button>
            : <button onClick={() => this.addAttendeeId(24601)}>+ attendee</button>
          }
          {content.tierIds.length
            ? <button onClick={this.removeAllTierIds}>- tiers</button>
            : <span><button onClick={() => this.addTierId(42)}>+ tier 42</button><button onClick={() => this.addTierId('default')}>+ default tier</button></span>
          }
        </div>
      </div>
    )
  }

  updateList = (value) => {
    var queryText = value.toLowerCase()
    if (queryText.length > 0){
      var queryResult=[];
      this.props.list.forEach(function(person){
        var fullName = person.firstName + " " + person.lastName
        if (fullName.toLowerCase().indexOf(queryText)!=-1){
          queryResult.push(person);
        }
      });
      this.setState({search: true, newList: queryResult})
    }
    else {
      this.setState({search: false})
    }
  }

  selectAttendee = (c) => {
    var attendeeBool = false
    var currentList = []
    if (this.props.content.attendeeIds) {
      currentList = this.props.content.attendeeIds
    }
    if (currentList.length > 0) {
      attendeeBool = this.props.content.attendeeIds.find(o => o === c.id)
    }
    return (
      <div className ="listItem">
        <input
          className="checkBox"
          name= {c.id}
          type="checkbox"
          value = {attendeeBool}
          onChange={this.addAttendee} />
        <label className="boxTitle">
          {c.firstName + " " + c.lastName}
        </label>
      </div>
    )
  }

  addAttendee = (event) => {
    if (event.target.checked) {
      this.addAttendeeId(event.target.name)
    }
    else {
      this.removeAttendeeId(event.target.name)
    }
  }

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