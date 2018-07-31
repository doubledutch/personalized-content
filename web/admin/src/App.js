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
import './App.css'
import moment from 'moment'
import client from '@doubledutch/admin-client'
import FirebaseConnector from '@doubledutch/firebase-connector'
import { HashRouter as Router, Redirect, Route } from 'react-router-dom'
import ContentEditor from './ContentEditor'
import AllAttendees from './AllAttendees'
import CurrentContent from './CurrentContent'
import ContentPreview from './ContentPreview'
import '@doubledutch/react-components/lib/base.css'

const fbc = FirebaseConnector(client, 'personalizedcontent')
fbc.initializeAppWithSimpleBackend()
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

export default class App extends PureComponent {
  constructor() {
    super()
    this.state = {
      publishedContent: {}, // Published content is stored by key
      pendingContent: [],
      homeView: true,
      currentContent: '',
      allUsers: [],
      searchContent: [],
      search: false,
      userContent : [],
      hidden : false,
      disable : false,
      surveys: []
    }

    this.signin = fbc.signinAdmin()
      .then(user => this.user = user)
      .catch(err => console.error(err))
  }

  componentDidMount() {
    this.signin.then(() => {
      client.getUsers().then(users => {
        this.setState({allUsers: users})
      })

      client.getTiers().then(tiers => this.setState({tiers}))
      client.getAttendeeGroups().then(groups => this.setState({groups}))
      client.getSurveys().then(surveys => surveys.filter(isGlobalSurvey)).then(surveys => this.setState({surveys}))

      const addContent = stateKey => data => this.setState(state => (
        {[stateKey]: [...state[stateKey], {...addDefaults(data.val()), key: data.key}].sort(sortContent)}))
      const removeContent = stateKey => data => this.setState(state => (
        {[stateKey]: state[stateKey].filter(x => x.key !== data.key).map((x, i) => ({...x, order: i}) )}))
      const changeContent = stateKey => data => this.setState(state => (
        {[stateKey]: state[stateKey].map(x => x.key === data.key ? {...addDefaults(data.val()), key: data.key} : x).sort(sortContent)}))
      
      const setPublishedContent = data => this.setState(state => ({publishedContent: {...state.publishedContent, [data.key]: addDefaults(data.val())}}))

      publishedContentRef().on('child_added', setPublishedContent)
      pendingContentRef().on('child_added', addContent('pendingContent'))

      publishedContentRef().on('child_removed', data => this.setState(state => {
        const { [data.key]: deletedItem, ...publishedContent } = state.publishedContent
        return {publishedContent}
      }))
      pendingContentRef().on('child_removed', removeContent('pendingContent'))

      publishedContentRef().on('child_changed', setPublishedContent)
      pendingContentRef().on('child_changed', changeContent('pendingContent'))

      lastPublishedAtRef().on('value', data => {
        const time = data.val()
        this.setState({lastPublishedAt: time ? moment(data.val()) : null})
      })
    })
  }

  render() {
    const {groups, lastPublishedAt, pendingContent, publishedContent, surveys, tiers, search, newList} = this.state
    var searchContent = pendingContent
    if (search) {
      searchContent = newList
    }
    const allContent = this.state.pendingContent.length > 0
    const published = Object.values(this.state.publishedContent).length > 0
    
    if (lastPublishedAt === undefined) return <div>Loading...</div>
    return (
      <div className="app">
        <Router>
          <div>
            <Route exact path="/" render={({history}) => (
              <div>
                <h1 className="pageTitle">Custom Content</h1>
                <button className="button-big" disabled={this.state.disable} onClick={() => this.addNewContent({history})}>Add New Content</button>
                <CurrentContent
                  content={searchContent}
                  publishedContent={publishedContent}
                  updateList={this.updateList}
                  addNewContent={this.addNewContent}
                  history={{history}}
                  publish={this.publish}
                  unpublish={this.unpublish}
                  onDragEnd={this.onDragEnd}
                  checkOrder={this.checkOrder}
                  cancelUpdates={this.cancelUpdates} 
                  publish={this.publish}
                  hideTable={this.hideTable}
                  disableButtons={this.disableButtons}
                  disable={this.state.disable}
                  search={this.state.search}
                  unpublish={this.unpublish} />
                <div className="AttendeeBox" style={{marginTop: 50}}>
                  <AllAttendees content={this.state.publishedContent}
                    updateUserData={this.updateUserData}
                    getAttendees={this.getAttendees}
                    allUsers={this.state.allUsers} 
                    hidden={this.state.hidden}
                    disable={this.state.disable}
                    hideTable={this.hideTable} />
                  <ContentPreview content={this.state.userContent} allUsers={this.state.allUsers}  surveys={surveys} hidden={this.state.hidden} allContent={allContent} isPublished={published}/>
                </div>
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
                  surveys={surveys}
                  onUpdate={(prop, value) => this.onUpdate(editingContent, prop, value)}
                  onDelete={() => this.deleteContent(editingContent.key)} />
              )
            }} />
          </div>
        </Router>
      </div>
    )
  }

  updateList = (value) => {
    var queryText = value.toLowerCase()
    if (queryText.length > 0){
      var queryResult=[];
      this.state.pendingContent.forEach(function(content){
        var title = content.title
        if (title) {
          if (title.toLowerCase().indexOf(queryText)!== -1){
            queryResult.push(content);
          }
        }
      });
      this.setState({search: true, newList: queryResult})
    }
    else {
      this.setState({search: false})
    }
  }

  updateUserData = (content) => {
    const userContent = content.sort(sortContent)
    this.setState({userContent})
  }

  onDragEnd = (result) =>{
    var pendingContent = this.state.pendingContent
    // dropped outside the list
    if (!result.destination) {
      return;
    }
    else {
      pendingContent = reorder(
        this.state.pendingContent,
        result.source.index,
        result.destination.index
      )
    }   
    this.setState({ pendingContent })
  }

  checkOrder = () => {
    const updates = this.state.pendingContent.map((c, index) => {
      if (c.order !== index) {
        this.onUpdate(c, "order", index) // update pending content
        if (this.state.publishedContent[c.key]) {
          return publishedContentRef().child(c.key).child('order').set(index) // update published content
        }
      }
      return Promise.resolve()
    })

    // Publish the order changes only
    Promise.all(updates).then(() => this.doPublish({} /* no content updated */))
  }

  getAttendees = query => client.getAttendees(query)

  cancelUpdates = () => {
    var pendingContent = this.state.pendingContent
    pendingContent.sort(sortContent)
    this.setState({pendingContent})
  }

  addNewContent = ({history}) => {
    const {pendingContent} = this.state
    const ref = pendingContentRef().push({order: pendingContent.length})
    history.push(`/content/${ref.key}`)
    this.setState({search: false})
  }

  stopEditing = () => this.setState({editingContentId: null})

  deleteContent = key => {
   this.unpublish({key})
   pendingContentRef().child(key).remove()
  }

  onUpdate = (contentItem, prop, value) => {
    const { attendeeIds, tierIds, groupIds, order } = contentItem
    const checkAll = contentItem.checkAll ? contentItem.checkAll : false
    if (contentItem[prop] !== value) {
      if (value === undefined) value = null
      if (prop === 'type') {
        pendingContentRef().child(contentItem.key).set({[prop]: value, attendeeIds, tierIds, groupIds, checkAll, order})
      } else {
        pendingContentRef().child(contentItem.key).update({[prop]: value})
      }
    }
  }

  hideTable = () => {
    var current = this.state.hidden
    this.setState({hidden: !current})
  }

  disableButtons = () => {
    var current = this.state.disable
    this.setState({disable: !current})
  }

  unpublish = content => this.doPublish({key: content.key}) // "Publish" with no values set, resulting in removal
  publish = content => {
    this.doPublish(content)
  }

  doPublish = content => {
    // 1. Remove all derived copies of all content
    publicContentRef().remove()
    usersRef().remove()
    tiersRef().remove()

    // 2. Create derived copies from `publishedContent`
    const { key, ...contentToPublish } = content
    const publishedContent = Object.keys({...this.state.publishedContent, [key]: content})
    .map(k => k === key ? content : {...this.state.publishedContent[k], key: k})
    .filter(x => Object.keys(x).length > 1) // Ignore key-only objects that are being unpublished
    
    // 2a. Public bucket gets copies of global content and those with attendee group filters.
    const publicContent = contentArrayToFirebaseObject(publishedContent
      .filter(c =>
        c.groupIds.length
        || (!c.tierIds.length && !c.attendeeIds.length))
      .map(c => ({...c, tierIds: null, attendeeIds: null}))
    )
    
    publicContentRef().set(publicContent)

    // 2b. Users bucket gets a copy for each attendee
    usersRef().set(getDerivedCopiesGroupedBy(publishedContent, 'attendeeIds'))

    // 2c. Tiers bucket gets a copy for each tier
    tiersRef().set(getDerivedCopiesGroupedBy(publishedContent, 'tierIds'))
    
    // 3. Copy content to published location
    if (key) publishedContentRef().child(key).set(contentToPublish)
    
    // 4. Update published timestamp
    lastPublishedAtRef().set(moment().valueOf())
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
  if (!content.type) content.type = ''
  return content
}

const sortContent = (a,b) => a.order < b.order ? -1 : 1

const publishedContentRef = () => fbc.database.private.adminRef('content')
const pendingContentRef = () => fbc.database.private.adminRef('pendingContent')
const lastPublishedAtRef = () => fbc.database.private.adminRef('lastPublishedAt')

const publicContentRef = () => fbc.database.public.adminRef('content')
const usersRef = userId => fbc.database.private.adminableUsersRef(userId)
const tiersRef = tierId => fbc.database.private.tiersRef(tierId)

const isGlobalSurvey = s => !s.listId && !s.itemIds.length
