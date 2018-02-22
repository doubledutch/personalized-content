import React, { PureComponent } from 'react'
import { TextEditor } from './editors'
import SearchBar from './SearchBar'

export default class ContentEditor extends PureComponent {
  constructor(props) {
    super()
    this.state = {
      newList: [],
      search: false
    }
  }
  render() {
    const {content, onExit, onDelete} = this.props
    const {key} = content
    return (
      <div>
        <div>
          <button onClick={onExit}>&lt; Back</button>
          <button onClick={onDelete}>Delete</button>
        </div>
        <div>TODO - Content editor goes here for content w/ key: "{key}"</div>
          {this.renderTable()}
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
        { this.editorFor(content) }
      </div>
    )
  }

  renderTable = () => {
    var list = this.props.list
    if (this.state.search){
      list = this.state.newList
    }
    return (
      <div>
        <p>Who should receive this content?</p>
        <SearchBar updateList={this.updateList}/>
        <span className="leftContainer">
          <ul className="formBox">{ list.map(c => (
            this.selectAttendee(c)))}
          </ul>
        </span>
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

  editorFor = c => {
    const {onUpdate} = this.props
    switch (c.type) {
      case 'text': return <div>
        <TextEditor content={c} prop="title" title="Title" onUpdate={onUpdate} />
        <TextEditor content={c} prop="text" title="Text" onUpdate={onUpdate} />
        <div>{JSON.stringify(c)}</div>
      </div>
      case 'web': return <div>
        <TextEditor content={c} prop="title" title="Title" onUpdate={onUpdate} />
        <TextEditor content={c} prop="url" title="URL" onUpdate={onUpdate} />
        <div>{JSON.stringify(c)}</div>
      </div>
      case 'survey': return <div>
        <div>{JSON.stringify(c)}</div>
      </div>
      default: return <div />
    }
  }
}
