import React, { Component } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'

import { TextContent, WebContent, SurveyContent, HTMLContent } from './content'

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
      .catch(err => console.error(err))
  }

  componentDidMount() {
    this.signin.then(() => {
      const setContent = (stateKey, filter) => data => {
        const content = data.val() || {}
        const contentArray = Object.keys(content).map(key => Object.assign(content[key], {key}))
        const filteredContentArray = filter ? contentArray.filter(filter) : contentArray
        this.setState({[stateKey]: filteredContentArray})
      }
      
      publicContentRef().on('value', setContent('groupContent', c => !c.groupIds || client.currentUser.userGroupIds.find(g => c.groupIds.includes(g))))
      userRef().on('value', setContent('attendeeContent'))
      tierRef().on('value', setContent('tierContent'))
      
    })
  }

  render() {
    return (
      <View style={s.container}>
        <TitleBar title="My Content" client={client} signin={this.signin} />
        <ScrollView style={s.scroll} contentContainerStyle={s.scrollContent}>
          { this.renderContent() }
        </ScrollView>
      </View>
    )
  }

  content = () => {
    let {attendeeContent, groupContent, tierContent} = this.state
    if (!attendeeContent && !groupContent && !tierContent) return null
    const sorted = (attendeeContent || [])
      .concat(tierContent || [])
      .concat(groupContent || [])
      .sort((a,b) => a.order - b.order)
    return sorted
  }

  renderContent() {
    const content = this.content()
    if (!content) return <Text>Loading...</Text>
    return content.map(c => <View style={s.contentWrapper} key={c.key}>{renderContentItem(c)}</View>)
    return <Text>{content.length}</Text>    
  }
}

function renderContentItem(c) {
  switch (c.type) {
    case 'text': return <TextContent {...c} />
    case 'web': return <WebContent {...c} />
    case 'survey': return <SurveyContent {...c} />
    case 'html': return <HTMLContent {...c} />
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
  }
})
