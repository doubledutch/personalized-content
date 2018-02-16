import React, { PureComponent } from 'react'
import './App.css'

import moment from 'moment'
import client from '@doubledutch/admin-client'
import FirebaseConnector from '@doubledutch/firebase-connector'
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

      const addContent = stateKey => data => this.setState(state => ({[stateKey]: [...state[stateKey], {...data.val(), key: data.key}].sort(sortContent)}))
      const removeContent = stateKey => data => this.setState(state => ({[stateKey]: state[stateKey].filter(x => x.key !== data.key)}))
      const changeContent = stateKey => data => this.setState(state => ({[stateKey]: state[stateKey].map(x => x.key === data.key ? {...data.val(), key: data.key} : x).sort(sortContent)}))

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
        <ul>{ pendingContent.map(c => (
          <li key={c.key}>
            {JSON.stringify(c)}
          </li>
        ))}</ul>
      </div>
    )
  }

  publish = () => {
    if (window.confirm('Are you sure you want to push all pending changes live to attendees?')) {
      // 1. Remove all derived copies
      publicContentRef().remove()
      usersRef().remove()
      //tiersRef().remove()

      // 2. Create derived copies from `pendingContent`
      // TODO: create derived copies in public/admin, private/adminable/users, & private/adminable/tiers

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

const contentArrayToFirebaseObject = arr => arr.reduce((obj, c) => {
  const { key, ...content } = c
  obj[key] = content
  return obj
}, {})

const sortContent = (a,b) => a.order < b.order ? -1 : 1
const contentRef = () => fbc.database.private.adminRef('content')
const pendingContentRef = () => fbc.database.private.adminRef('pendingContent')
const lastPublishedAtRef = () => fbc.database.private.adminRef('lastPublishedAt')
const publicContentRef = () => fbc.database.public.adminRef('content')
const usersRef = () => fbc.database.private.adminableUsersRef()
//const tiersRef = () => fbc.database.private.tiersRef()
