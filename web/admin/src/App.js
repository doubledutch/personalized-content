import React, { PureComponent } from 'react'
import './App.css'
import moment from 'moment'
import client from '@doubledutch/admin-client'
import FirebaseConnector from '@doubledutch/firebase-connector'
import { BrowserRouter as Router, Redirect, Route } from 'react-router-dom'
import ContentEditor from './ContentEditor'
import AllAttendees from './AllAttendees'
import CurrentContent from './CurrentContent'

const fbc = FirebaseConnector(client, 'personalizedcontent')
fbc.initializeAppWithSimpleBackend()

export default class App extends PureComponent {
  constructor() {
    super()
    this.state = {
      content: [],
      pendingContent: [],
      homeView: true,
      currentContent: '',
      allUsers: []
    }

    this.signin = fbc.signinAdmin()
      .then(user => this.user = user)
      .catch(err => console.error(err))
  }

  lastPublishedText = () => this.state.lastPublishedAt ? `Last published ${this.state.lastPublishedAt.fromNow()}` : 'Not yet published'
  hasUnpublishedChanges = () => JSON.stringify(this.state.content) !== JSON.stringify(this.state.pendingContent) // Brute force easy way to check deep equality

  componentDidMount() {
    this.signin.then(() => {
      client.getUsers().then(users => {
        this.setState({allUsers: users})
      })

      client.getTiers().then(tiers => this.setState({tiers}))
      client.getAttendeeGroups().then(groups => this.setState({groups}))

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
    const {groups, pendingContent, lastPublishedAt, tiers} = this.state
    if (lastPublishedAt === undefined) return <div>Loading...</div>
    return (
      <div className="app">
        <Router>
          <div>
            <Route exact path="/" render={({history}) => (
              <div>
                <h1>Custom content</h1>
                <div>
                  {this.lastPublishedText()}
                  { this.hasUnpublishedChanges() ? <span>
                      <button onClick={this.publish}>Publish changes</button>
                      <button onClick={this.discard}>Discard changes</button>
                    </span> : null }
                </div>
                <button className="button-big" onClick={() => this.addNewContent({history})}>Add New Content</button>
                <CurrentContent content={pendingContent} />
                <AllAttendees />
              </div>
            )} />
            <Route exact path="/content/:contentId" render={({match}) => {
              const {contentId} = match.params
              const editingContent = this.state.pendingContent.find(c => c.key === contentId)
              if (!editingContent) return <Redirect to="/" />
              return (
                <ContentEditor
                  content={editingContent}
                  getAttendees={this.getAttendees}
                  groups={groups}
                  tiers={tiers}
                  onUpdate={(prop, value) => this.onUpdate(editingContent, prop, value)}
                  onDelete={() => this.deleteContent(editingContent.key)} />
              )
            }} />
          </div>
        </Router>
      </div>
    )
  }

  getAttendees = query => client.getAttendees(query)

  updateList = (list) => {
    this.setState({currentList: list})
  }

  addNewContent = ({history}) => {
    const {pendingContent} = this.state
    const ref = pendingContentRef().push({type: 'text', order: pendingContent.length})
    history.push(`/content/${ref.key}`)
  }

  stopEditing = () => this.setState({editingContentId: null})
  deleteContent = key => pendingContentRef().child(key).remove()

  onUpdate = (contentItem, prop, value) => {
    if (contentItem[prop] !== value) {
      if (value === undefined) value = null
      pendingContentRef().child(contentItem.key).update({[prop]: value})
    }
  }

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
