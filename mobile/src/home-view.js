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
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import i18n from './i18n'
import client, { Avatar, TitleBar, translate as t, useStrings } from '@doubledutch/rn-client'
import { provideFirebaseConnectorToReactComponent } from '@doubledutch/firebase-connector'
import { TextContent, WebContent, SurveyContent, HTMLContent } from './content'
import VideoContent from './video-content'

useStrings(i18n)

class HomeView extends PureComponent {
  publicContentRef = () => this.props.fbc.database.public.adminRef('content')

  userRef = () => this.props.fbc.database.private.adminableUsersRef(this.state.currentUser.id)

  tierRef = () => this.props.fbc.database.private.tiersRef(this.state.currentUser.tierId)

  constructor(props) {
    super(props)

    this.state = {}

    this.signin = props.fbc.signin().then(user => (this.user = user))
    // .then(() => client.getAttendee(client.currentUser.id))

    this.signin.catch(err => console.error(err))
  }

  componentDidMount() {
    const { fbc } = this.props
    client.getPrimaryColor().then(primaryColor => this.setState({ primaryColor }))
    client.getCurrentUser().then(currentUser => {
      this.setState({ currentUser })
      this.signin.then(() => {
        const setContent = (stateKey, filter) => data => {
          const content = data.val() || {}
          const contentArray = Object.keys(content).map(key => Object.assign(content[key], { key }))
          const filteredContentArray = filter ? contentArray.filter(filter) : contentArray
          this.setState({ [stateKey]: filteredContentArray })
        }

        this.publicContentRef().on(
          'value',
          setContent(
            'groupContent',
            c => !c.groupIds || currentUser.userGroupIds.find(g => c.groupIds.includes(g)),
          ),
        )
        this.userRef().on('value', setContent('attendeeContent'))
        this.tierRef().on('value', setContent('tierContent'))
      })
    })
  }

  render() {
    const { suggestedTitle } = this.props
    const { currentUser, primaryColor } = this.state
    if (!currentUser || !primaryColor) return null

    return (
      <View style={s.container}>
        <TitleBar title={suggestedTitle || 'My Info'} client={client} signin={this.signin} />
        <ScrollView style={s.scroll} contentContainerStyle={s.scrollContent}>
          {this.renderContent()}
        </ScrollView>
      </View>
    )
  }

  content = () => {
    const { attendeeContent, groupContent, tierContent } = this.state
    if (!attendeeContent && !groupContent && !tierContent) return null
    return unique(
      x => x.key,
      (attendeeContent || []).concat(tierContent || []).concat(groupContent || []),
    ).sort((a, b) => a.order - b.order)
  }

  renderContent() {
    const content = this.content()
    if (!content) return <Text>Loading...</Text>
    if (content.length === 0) return <Text style={s.helpText}>{t('noAssign')}</Text>
    return content.map(c => (
      <View style={s.contentWrapper} key={c.key}>
        {this.renderContentItem(c)}
      </View>
    ))
    return <Text>{content.length}</Text>
  }

  renderContentItem(c) {
    switch (c.type) {
      case 'text':
        return <TextContent {...c} />
      case 'web':
        return <WebContent {...c} />
      case 'survey':
        return <SurveyContent {...c} primaryColor={this.state.primaryColor} />
      case 'html':
        return <HTMLContent {...c} />
      case 'video':
        return <VideoContent {...c} />
      default:
        return null
    }
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

export default provideFirebaseConnectorToReactComponent(
  client,
  'personalizedcontent',
  (props, fbc) => <HomeView {...props} fbc={fbc} />,
  PureComponent,
)

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scroll: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 7,
  },
  contentWrapper: {
    marginBottom: 10,
  },
  helpText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
  },
})
