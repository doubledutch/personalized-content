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
import client, { translate as t, useStrings } from '@doubledutch/admin-client'
import { provideFirebaseConnectorToReactComponent } from '@doubledutch/firebase-connector'
import { HashRouter as Router, Redirect, Route, Link } from 'react-router-dom'
import Modal from 'react-modal'
import i18n from './i18n'
import ContentEditor from './ContentEditor'
import AllAttendees from './AllAttendees'
import AttendeeSelector from './AttendeeSelector'
import CurrentContent from './CurrentContent'
import ContentPreview from './ContentPreview'
import '@doubledutch/react-components/lib/base.css'

useStrings(i18n)

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)
  return result
}

class App extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      publishedContent: {}, // Published content is stored by key
      pendingContent: [],
      homeView: true,
      currentContent: '',
      allUsers: [],
      searchContent: [],
      search: false,
      userContent: [],
      hidden: false,
      disable: false,
      surveys: [],
      showSaving: false,
      showModal: false,
    }

    this.signin = props.fbc
      .signinAdmin()
      .then(user => (this.user = user))
      .catch(err => console.error(err))
  }

  componentDidMount() {
    this.signin.then(() => {
      client.getAttendees().then(users => {
        this.setState({ allUsers: users })
      })

      client.getTiers().then(tiers => this.setState({ tiers }))
      client.getAttendeeGroups().then(groups => this.setState({ groups }))
      client
        .getSurveys()
        .then(surveys => surveys.filter(isGlobalSurvey))
        .then(surveys => this.setState({ surveys }))

      const addContent = stateKey => data =>
        this.setState(state => ({
          [stateKey]: [...state[stateKey], { ...addDefaults(data.val()), key: data.key }].sort(
            sortContent,
          ),
        }))

      const removeContent = stateKey => data =>
        this.setState(state => ({
          [stateKey]: state[stateKey]
            .filter(x => x.key !== data.key)
            .map((x, i) => ({ ...x, order: i })),
        }))
      const changeContent = stateKey => data =>
        this.setState(state => ({
          [stateKey]: state[stateKey]
            .map(x => (x.key === data.key ? { ...addDefaults(data.val()), key: data.key } : x))
            .sort(sortContent),
        }))

      const setPublishedContent = data =>
        this.setState(state => ({
          publishedContent: { ...state.publishedContent, [data.key]: addDefaults(data.val()) },
        }))

      this.publishedContentRef().on('child_added', setPublishedContent)
      this.pendingContentRef().on('child_added', addContent('pendingContent'))

      this.publishedContentRef().on('child_removed', data =>
        this.setState(state => {
          const { [data.key]: deletedItem, ...publishedContent } = state.publishedContent
          return { publishedContent }
        }),
      )
      this.pendingContentRef().on('child_removed', removeContent('pendingContent'))

      this.publishedContentRef().on('child_changed', setPublishedContent)
      this.pendingContentRef().on('child_changed', changeContent('pendingContent'))

      this.lastPublishedAtRef().on('value', data => {
        const time = data.val()
        this.setState({ lastPublishedAt: time ? moment(data.val()) : null })
      })
    })
  }

  render() {
    const {
      groups,
      lastPublishedAt,
      pendingContent,
      publishedContent,
      surveys,
      tiers,
      search,
      newList,
      showModal,
    } = this.state
    let searchContent = pendingContent
    if (search) {
      searchContent = newList
    }
    const allContent = this.state.pendingContent.length > 0
    const published = Object.values(this.state.publishedContent).length > 0

    if (lastPublishedAt === undefined) return <div>{t('loading')}</div>
    return (
      <div className="app">
        <Router>
          <div>
            <Route
              exact
              path="/"
              render={({ history }) => (
                <div>
                  <Modal
                    ariaHideApp={false}
                    isOpen={showModal}
                    onRequestClose={() => {
                      this.setState({ showModal: false })
                    }}
                    contentLabel="Modal"
                    className="Modal"
                    overlayClassName="Overlay"
                  >
                    <button
                      className="closeButton"
                      onClick={() => this.setState({ showModal: false })}
                    >
                      X
                    </button>
                    <div className="modalHeader">
                      <h2 className="modalTitle">Content Preview</h2>
                    </div>
                    <ContentPreview
                      content={this.state.userContent}
                      allUsers={this.state.allUsers}
                      surveys={surveys}
                      hidden={this.state.hidden}
                      allContent={allContent}
                      isPublished={published}
                    />
                    <div className="modalFooter">
                      <button
                        className="dd-bordered"
                        onClick={() => this.setState({ showModal: false })}
                      >
                        {t('close')}
                      </button>
                    </div>
                  </Modal>
                  <h1 className="pageTitle">My Info</h1>
                  <button
                    className="button-big"
                    disabled={this.state.disable}
                    onClick={() => this.addNewContent({ history })}
                  >
                    {t('addNew')}
                  </button>
                  <CurrentContent
                    content={searchContent}
                    publishedContent={publishedContent}
                    updateList={this.updateList}
                    addNewContent={this.addNewContent}
                    history={{ history }}
                    publish={this.publish}
                    unpublish={this.unpublish}
                    onDragEnd={this.onDragEnd}
                    checkOrder={this.checkOrder}
                    cancelUpdates={this.cancelUpdates}
                    hideTable={this.hideTable}
                    disableButtons={this.disableButtons}
                    disable={this.state.disable}
                    search={this.state.search}
                  />
                  <div className="AttendeeBox" style={{ marginTop: 50 }}>
                    <AllAttendees
                      content={this.state.publishedContent}
                      updateUserData={this.updateUserData}
                      getAttendees={this.getAttendees}
                      allUsers={this.state.allUsers}
                      hidden={this.state.hidden}
                      disable={this.state.disable}
                      hideTable={this.hideTable}
                      hideModal={this.hideModal}
                      fbc={this.props.fbc}
                    />
                  </div>
                </div>
              )}
            />
            <Route
              exact
              path="/content/:contentId"
              render={({ match }) => {
                const { contentId } = match.params
                const editingContent = this.state.pendingContent.find(c => c.key === contentId)
                if (!editingContent) return <Redirect to="/" />
                return (
                  <div>
                    <div className="isActiveTextBox">
                      {this.state.showSaving && <p className="isActiveText">Saving...</p>}
                    </div>
                    <ContentEditor
                      content={editingContent}
                      getAttendees={this.getAttendees}
                      handleImport={this.handleImport}
                      contentId={contentId}
                      surveys={surveys}
                      onUpdate={(prop, value) => this.onUpdate(editingContent, prop, value)}
                      onDelete={() => this.deleteContent(editingContent.key)}
                    />
                  </div>
                )
              }}
            />
            <Route
              exact
              path="/content/:contentId/attendeeSelector"
              render={({ match }) => {
                const { contentId } = match.params
                const editingContent = this.state.pendingContent.find(c => c.key === contentId)
                if (!editingContent) return <Redirect to="/" />
                return (
                  <div>
                    <div className="isActiveTextBox">
                      {this.state.showSaving && <p className="isActiveText">Saving...</p>}
                    </div>
                    <AttendeeSelector
                      content={editingContent}
                      onUpdate={(prop, value) => this.onUpdate(editingContent, prop, value)}
                      getAttendees={this.getAttendees}
                      allUsers={this.state.allUsers}
                      groups={groups}
                      tiers={tiers}
                    />
                    <button
                      className="button-big red"
                      onClick={() => this.deleteContent(editingContent.key)}
                    >
                      {t('delete')}
                    </button>
                    <Link to="/" className="button-big">
                      {t('close')}
                    </Link>
                  </div>
                )
              }}
            />
          </div>
        </Router>
      </div>
    )
  }

  updateList = value => {
    const queryText = value.toLowerCase()
    if (queryText.length > 0) {
      const queryResult = []
      this.state.pendingContent.forEach(content => {
        const title = content.title
        if (title) {
          if (title.toLowerCase().indexOf(queryText) !== -1) {
            queryResult.push(content)
          }
        }
      })
      this.setState({ search: true, newList: queryResult })
    } else {
      this.setState({ search: false })
    }
  }

  updateUserData = content => {
    const userContent = content.sort(sortContent)

    this.setState({ userContent, showModal: true })
  }

  hideModal = () => {
    this.setState({ showModal: false })
  }

  onDragEnd = result => {
    let pendingContent = this.state.pendingContent
    // dropped outside the list
    if (!result.destination) {
      return
    }
    pendingContent = reorder(
      this.state.pendingContent,
      result.source.index,
      result.destination.index,
    )

    this.setState({ pendingContent })
  }

  checkOrder = isNewContent => {
    const updates = this.state.pendingContent.map((c, index) => {
      if (c.order !== index || isNewContent) {
        const newIndex = isNewContent ? c.order + 1 : index
        this.onUpdate(c, 'order', newIndex) // update pending content
        if (this.state.publishedContent[c.key]) {
          return this.publishedContentRef()
            .child(c.key)
            .child('order')
            .set(newIndex) // update published content
        }
      }
      return Promise.resolve()
    })
    // Publish the order changes only
    Promise.all(updates).then(() => this.doPublish({} /* no content updated */))
  }

  getAttendees = query => client.getAttendees(query)

  cancelUpdates = () => {
    const pendingContent = this.state.pendingContent
    pendingContent.sort(sortContent)
    this.setState({ pendingContent })
  }

  addNewContent = ({ history }) => {
    const ref = this.pendingContentRef().push({ order: 0 })
    this.checkOrder(true)
    history.push(`/content/${ref.key}`)
    this.setState({
      search: false,
      searchContent: [],
      showModal: false,
    })
  }

  stopEditing = () => this.setState({ editingContentId: null })

  deleteContent = key => {
    if (window.confirm(t('confirmDelete'))) {
      this.unpublish({ key })
      this.pendingContentRef()
        .child(key)
        .remove()
    }
  }

  onUpdate = (contentItem, prop, value) => {
    this.setState({ showSaving: true })
    const isCSV = prop === 'type' ? value.includes('CSV') : false
    const { attendeeIds, tierIds, groupIds, order } = contentItem
    const checkAll = contentItem.checkAll && !isCSV ? contentItem.checkAll : false
    if (contentItem[prop] !== value) {
      if (value === undefined) value = null
      if (prop === 'type') {
        this.pendingContentRef()
          .child(contentItem.key)
          .set({ [prop]: value, attendeeIds, tierIds, groupIds, checkAll, order })
      } else {
        this.pendingContentRef()
          .child(contentItem.key)
          .update({ [prop]: value })
      }
    }
    setTimeout(() => this.setState({ showSaving: false }), 1000)
  }

  hideTable = () => {
    const current = this.state.hidden
    this.setState({ hidden: !current, userContent: [], showModal: false })
  }

  disableButtons = () => {
    const current = this.state.disable
    this.setState({ disable: !current, search: false, searchContent: [] })
  }

  unpublish = content => this.doPublish({ key: content.key })

  // "Publish" with no values set, resulting in removal
  publish = content => {
    this.doPublish(content)
  }

  doPublish = origContent => {
    // 1. Remove all derived copies of all content
    this.publicContentRef().remove()
    this.usersRef().remove()
    this.tiersRef().remove()

    // 2. Create derived copies from `publishedContent`
    const content = Object.assign({}, origContent)
    const { key, ...contentToPublish } = content
    let csvData = []

    // check if new object is for csv
    if (content.rawData) {
      const publishData = content.rawData.slice()

      // add key to data then remove so not published publically

      csvData = this.publishCSVData(publishData, key, content.title)
      delete content.rawData
    }

    const publishedContent = Object.keys({ ...this.state.publishedContent, [key]: content })
      .map(k => (k === key ? content : { ...this.state.publishedContent[k], key: k }))
      .filter(x => Object.keys(x).length > 1) // Ignore key-only objects that are being unpublished

    // check for reordering thus content blank
    if (Object.keys(content).length === 0) {
      publishedContent.forEach(item => {
        if (item.type === 'textCSV' || item.type === 'webCSV' || item.type === 'videoCSV') {
          const newOrderData = item.rawData
          newOrderData.forEach(newItem => {
            newItem.order = item.order
          })
          csvData = csvData.concat(newOrderData)
        }
      })
    }

    // check if its a different item being changes to read csv items
    publishedContent.forEach(item => {
      if (item.key !== content.key) {
        if (item.type === 'textCSV' || item.type === 'webCSV' || item.type === 'videoCSV') {
          const data = this.publishCSVData(item.rawData, item.key, item.title)
          csvData = csvData.concat(data)
        }
      }
    })

    // 2a. Public bucket gets copies of global content and those with attendee group filters.
    const publicContent = contentArrayToFirebaseObject(
      publishedContent
        .filter(
          c =>
            c.groupIds.length ||
            (!c.tierIds.length && !c.attendeeIds.length && !c.type.includes('CSV')),
        )
        .map(c => ({ ...c, tierIds: null, attendeeIds: null })),
    )
    this.publicContentRef().set(publicContent)

    // 2b. Users bucket gets a copy for each attendee
    // add back user CSV data
    const newContent = publishedContent.concat(csvData)
    this.usersRef().set(getDerivedCopiesGroupedBy(newContent, 'attendeeIds'))

    // 2c. Tiers bucket gets a copy for each tier
    this.tiersRef().set(getDerivedCopiesGroupedBy(publishedContent, 'tierIds'))

    // 3. Copy content to published location
    if (key)
      this.publishedContentRef()
        .child(key)
        .set(contentToPublish)

    // 4. Update published timestamp
    this.lastPublishedAtRef().set(moment().valueOf())
  }

  publishCSVData = (data, key, title) => {
    data.forEach((item, i) => {
      item.key = key + i
      item.title = title || ''
    })
    return data
  }

  publishedContentRef = () => this.props.fbc.database.private.adminRef('content')

  pendingContentRef = () => this.props.fbc.database.private.adminRef('pendingContent')

  lastPublishedAtRef = () => this.props.fbc.database.private.adminRef('lastPublishedAt')

  publicContentRef = () => this.props.fbc.database.public.adminRef('content')

  usersRef = userId => this.props.fbc.database.private.adminableUsersRef(userId)

  tiersRef = tierId => this.props.fbc.database.private.tiersRef(tierId)
}

export default provideFirebaseConnectorToReactComponent(
  client,
  'personalizedcontent',
  (props, fbc) => <App {...props} fbc={fbc} />,
  PureComponent,
)

function getDerivedCopiesGroupedBy(pendingContent, groupIdArrayKey) {
  const groupedArrays = pendingContent.reduce((groupedArrays, c) => {
    if (c[groupIdArrayKey].length) {
      const content = { ...c, tierIds: null, attendeeIds: null, groupIds: null }
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
const contentArrayToFirebaseObject = arr =>
  arr.reduce((obj, c) => {
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

const sortContent = (a, b) => (a.order < b.order ? -1 : 1)

const isGlobalSurvey = s => !s.listId && !s.itemIds.length
