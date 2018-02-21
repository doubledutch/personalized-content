import React, { PureComponent } from 'react'
import './App.css'

import moment from 'moment'
import client from '@doubledutch/admin-client'
import FirebaseConnector from '@doubledutch/firebase-connector'

import { TextEditor } from './editors'

const fbc = FirebaseConnector(client, 'personalizedcontent')
fbc.initializeAppWithSimpleBackend()

export default class App extends PureComponent {
  state = {
    content: [],
    pendingContent: []
  }

  lastPublishedText = () => this.state.lastPublishedAt ? `Last published ${this.state.lastPublishedAt.fromNow()}` : 'Not yet published'
  hasUnpublishedChanges = () => JSON.stringify(this.state.content) !== JSON.stringify(this.state.pendingContent) // Brute force easy way to check deep equality

  componentDidMount() {
    fbc.signinAdmin()
    .then(user => {

      const addContent = stateKey => data => this.setState(state => (
        {[stateKey]: [...state[stateKey], {...addDefaults(data.val()), key: data.key}].sort(sortContent)}))
      const removeContent = stateKey => data => this.setState(state => (
        {[stateKey]: state[stateKey].filter(x => x.key !== data.key)}))
      const changeContent = stateKey => data => this.setState(state => (
        {[stateKey]: state[stateKey].map(x => x.key === data.key ? {...addDefaults(data.val()), key: data.key} : x).sort(sortContent)}))

      contentRef().on('child_added', addContent('content'))
      pendingContentRef().on('child_added', addContent('pendingContent'))

      contentRef().on('child_removed', removeContent('content'))
      pendingContentRef().on('child_removed', removeContent('pendingContent'))

      contentRef().on('child_changed', changeContent('content'))
      pendingContentRef().on('child_changed', changeContent('pendingContent'))

      lastPublishedAtRef().on('value', data => {
        const time = data.val()
        this.setState({lastPublishedAt: time ? moment(data.val()) : null})
      })
    })
  }

  render() {
    const {pendingContent, lastPublishedAt} = this.state
    if (lastPublishedAt === undefined) return <div>Loading...</div>

    return (
      <div className="App">
        <div>
          <span>{this.lastPublishedText()}</span>
          { this.hasUnpublishedChanges() ? <span>
            <button onClick={this.publish}>Publish changes</button>
            <button onClick={this.discard}>Discard changes</button>
          </span> : null }
        </div>
        <button onClick={() => pendingContentRef().push({type: 'text', title: 'Title', text: 'Sample text', order: pendingContent.length})}>+ Text</button>
        <button onClick={() => pendingContentRef().push({type: 'web', title: 'Title', url: 'https://doubledutch.me', order: pendingContent.length})}>+ Web</button>
        <button onClick={() => pendingContentRef().push({type: 'survey', surveyId: 42, order: pendingContent.length})}>+ Survey</button>
        <ul>
          { pendingContent.map(c => <li key={c.key}>
            {c.attendeeIds.length
              ? <button onClick={() => pendingContentRef().child(c.key).update({attendeeIds: []})}>- attendee</button>
              : <button onClick={() => pendingContentRef().child(c.key).update({attendeeIds: [24601]})}>+ attendee</button>
            }
            {c.tierIds.length
              ? <button onClick={() => pendingContentRef().child(c.key).update({tierIds: []})}>- tiers</button>
              : <span><button onClick={() => pendingContentRef().child(c.key).update({tierIds: [42]})}>+ tier</button><button onClick={() => pendingContentRef().child(c.key).update({tierIds: ['default', 42]})}>+ tiers</button></span>
            }
            { this.editorFor(c) }
          </li>)}
        </ul>
      </div>
    )
  }

  editorFor = c => {
    switch (c.type) {
      case 'text': return <div>
        <TextEditor content={c} prop="title" title="Title" onUpdate={this.onUpdate} />
        <TextEditor content={c} prop="text" title="Text" onUpdate={this.onUpdate} />
        <div>{JSON.stringify(c)}</div>
      </div>
      case 'web': return <div>
        <TextEditor content={c} prop="title" title="Title" onUpdate={this.onUpdate} />
        <TextEditor content={c} prop="url" title="URL" onUpdate={this.onUpdate} />
        <div>{JSON.stringify(c)}</div>
      </div>
      case 'survey': return <div>
        <div>{JSON.stringify(c)}</div>
      </div>
      default: return <div />
    }
  }

  onUpdate = (component, prop, value) => pendingContentRef().child(component.key).update({[prop]: value})

  publish = () => {
    if (window.confirm('Are you sure you want to push all pending changes live to attendees?')) {
      // 1. Remove all derived copies
      publicContentRef().remove()
      usersRef().remove()
      tiersRef().remove()

      // 2. Create derived copies from `pendingContent`
      
      // 2a. Public bucket gets copies of global content and those with attendee group filters.
      publicContentRef().set(
        contentArrayToFirebaseObject(this.state.pendingContent
          .filter(c =>
            c.groupIds.length
            || (!c.tierIds.length && !c.attendeeIds.length))
          .map(c => ({...c, tierIds: null, attendeeIds: null}))
        )
      )

      // 2b. Users bucket gets a copy for each attendee
      usersRef().set(getDerivedCopiesGroupedBy(this.state.pendingContent, 'attendeeIds'))

      // 2c. Tiers bucket gets a copy for each tier
      tiersRef().set(getDerivedCopiesGroupedBy(this.state.pendingContent, 'tierIds'))
      
      // 3. Copy `pendingContent` to `content`
      contentRef().set(contentArrayToFirebaseObject(this.state.pendingContent))

      // 4. Update published timestamp
      lastPublishedAtRef().set(moment().valueOf())
    }
  }

  discard = () => {
    if (window.confirm('Are you sure you want to discard all pending changes and revert this editor to the currently published content?')) {
      // Copy `content` to `pendingContent` (discarding the current pendingContent)
      pendingContentRef().set(contentArrayToFirebaseObject(this.state.content))
    }
  }
}

function getDerivedCopiesGroupedBy(pendingContent, groupIdArrayKey) {
  const groupedArrays = pendingContent.reduce((groupedArrays, c) => {
    if (c[groupIdArrayKey].length) {
      const content = {...c, tierIds: null, attendeeIds: null, groupIds: null}
      c[groupIdArrayKey].forEach(id => {
        if (!groupedArrays[id]) groupedArrays[id] = []
        groupedArrays[id].push(content)
      })
    }
    return groupedArrays
  }, {})
  return Object.keys(groupedArrays).reduce((obj, id) => {
    obj[id] = contentArrayToFirebaseObject(groupedArrays[id])
    return obj
  }, {})
}

// Converts [{key: 'abc', ...}, ...] to {abc: {...}, ...}
const contentArrayToFirebaseObject = arr => arr.reduce((obj, c) => {
  const { key, ...content } = c
  obj[key] = content
  return obj
}, {})

function addDefaults(content) {
  if (!content.tierIds) content.tierIds = []
  if (!content.groupIds) content.groupIds = []
  if (!content.attendeeIds) content.attendeeIds = []
  return content
}

const sortContent = (a,b) => a.order < b.order ? -1 : 1

const contentRef = () => fbc.database.private.adminRef('content')
const pendingContentRef = () => fbc.database.private.adminRef('pendingContent')
const lastPublishedAtRef = () => fbc.database.private.adminRef('lastPublishedAt')

const publicContentRef = () => fbc.database.public.adminRef('content')
const usersRef = userId => fbc.database.private.adminableUsersRef(userId)
const tiersRef = tierId => fbc.database.private.tiersRef(tierId)
