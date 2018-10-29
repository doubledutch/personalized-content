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

import React, { Component } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { TextContent, WebContent, SurveyContent, HTMLContent} from './content'
import VideoContent from "./video-content"
import client, { Avatar, TitleBar } from '@doubledutch/rn-client'
import FirebaseConnector from '@doubledutch/firebase-connector'
const fbc = FirebaseConnector(client, 'personalizedcontent')
fbc.initializeAppWithSimpleBackend()

const publicContentRef = () => fbc.database.public.adminRef('content')
const userRef = () => fbc.database.private.adminableUsersRef(client.currentUser.id)
const tierRef = () => fbc.database.private.tiersRef(client.currentUser.tierId)

export default class HomeView extends Component {
  constructor() {
    super()

    this.state = { }

    this.signin = fbc.signin()
      .then(user => this.user = user)
      .then(() => client.getAttendee(client.currentUser.id))

    this.signin.catch(err => console.log(err))
   
  }

  componentDidMount() {
    this.signin.then(currentUser => {
      client.currentUser = currentUser
      const setContent = (stateKey, filter) => data => {
        const content = data.val() || {}
        const contentArray = Object.keys(content).map(key => Object.assign(content[key], {key}))
        const filteredContentArray = filter ? contentArray.filter(filter) : contentArray
        this.setState({[stateKey]: filteredContentArray})
      }
      
      publicContentRef().on('value', setContent('groupContent', c => !c.groupIds || currentUser.userGroupIds.find(g => c.groupIds.includes(g))))
      userRef().on('value', setContent('attendeeContent'))
      tierRef().on('value', setContent('tierContent'))

    })
  }

  render() {
    return (
      <View style={s.container}>
        <TitleBar title="My Info" client={client} signin={this.signin} />
        <ScrollView style={s.scroll} contentContainerStyle={s.scrollContent}>
          { this.renderContent() }
        </ScrollView>
      </View>
    )
  }

  content = () => {
    let {attendeeContent, groupContent, tierContent} = this.state
    if (!attendeeContent && !groupContent && !tierContent) return null    
    return unique(x => x.key,
      (attendeeContent || [])
      .concat(tierContent || [])
      .concat(groupContent || [])
    ).sort((a,b) => a.order - b.order)
  }

  renderContent() {
    const content = this.content()
    if (!content) return <Text>Loading...</Text>
    if (content.length === 0) return <Text style={s.helpText}>No Assigned Content</Text>
    return content.map(c => <View style={s.contentWrapper} key={c.key}>{renderContentItem(c)}</View>)
    return <Text>{content.length}</Text>    
  }
}

function unique(identityFn, array) {
  const alreadySeenKeys = {}
  return array.filter(x => {
    const key = identityFn(x)
    if (alreadySeenKeys[key]) return false
    alreadySeenKeys[key] = true
    return true
  })
}

function renderContentItem(c) {
  switch (c.type) {
    case 'text': return <TextContent {...c} />
    case 'web': return <WebContent {...c} />
    case 'survey': return <SurveyContent {...c} />
    case 'html': return <HTMLContent {...c} />
    case 'video': return <VideoContent {...c} />
    default: return null
  }
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scroll: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 7
  },
  contentWrapper: {
    marginBottom: 10
  },
  helpText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10
  }
})
