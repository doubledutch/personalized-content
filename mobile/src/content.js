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
import { StyleSheet, Text, TouchableOpacity, View, WebView, Image, Linking } from 'react-native'
import client, { Color } from '@doubledutch/rn-client'

const showMoreTextLimit = 300
export class TextContent extends PureComponent {
  state = {}
  render() {
    const {text, title} = this.props
    const {showMore} = this.state
    return (
      <View style={s.container}>
        <Text style={s.textTitle}>{title}</Text>
        <View>
          { text && text.length > showMoreTextLimit
            ? <View>
                <Text style={[s.textText, showMore ? s.textTextShowMore : null]}>{showMore ? text : text.substring(0,showMoreTextLimit) + '...'}</Text>
                <TouchableOpacity style={s.textShowMoreContainer} onPress={this.toggleShowMore}>
                  <Text style={s.textShowMore}>{showMore ? 'Show Less' : 'Show More'}</Text>
                </TouchableOpacity>
              </View>
            : <Text style={s.textText}>{text}</Text>
          }
        </View>
      </View>
    )
  }

  toggleShowMore = () => this.setState(state => ({showMore: !state.showMore}))
}

export class WebContent extends PureComponent {
  render() {
    const {title, url} = this.props
    return (
      <View style={[s.container, s.webContainer]}>
        <WebView style={s.web} source={{uri: url}} />
        <View style={s.webFooter}>
          <View  style={{flex: 1}}>
            <Text style={s.webFooterTitle} ellipsizeMode='tail' numberOfLines={2}>{title}</Text>
          </View>
          <TouchableOpacity style={{fustifyContent: 'center'}} onPress={()=>{Linking.openURL(url)}}>
            <Text style={s.webFooterLink}>View Page</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

export class HTMLContent extends PureComponent {
  render() {
    const {title, text} = this.props
    return (
      <View style={s.container}>
        <Text style={s.textTitle}>{title}</Text>
        <View style={s.htmlContainer}>
        <WebView style={s.web} source={{html: text}} />
        </View>
      </View>
    )
  }
}

export class SurveyContent extends PureComponent {
  render() {
    const {description, title} = this.props
    const text = "This is sample text that needs to be replaced to a props for the survey description. This is to test the spacing among other design"
    return (
       <View style={s.container}>
        <View style={s.rowContainer}>
          <Image style={s.icon} source={{uri: "https://dml2n2dpleynv.cloudfront.net/extensions/personalized-content/survey_icon@2x.png"}}/>
          <View style={s.textContainer}>
            <Text style={s.textTitleLeft}>{title}</Text>
            <View>
              { description && description.length > showMoreTextLimit
                ? <View>
                    <Text style={[s.desText, showMore ? s.textTextShowMore : null]}>{showMore ? description : description.substring(0,showMoreTextLimit) + '...'}</Text>
                    <TouchableOpacity style={s.textShowMoreContainer} onPress={this.toggleShowMore}>
                      <Text style={s.textShowMore}>{showMore ? 'Show Less' : 'Show More'}</Text>
                    </TouchableOpacity>
                  </View>
                : <Text style={s.desText}>{description}</Text>
              }
            </View>
          </View>
       </View>
       <TouchableOpacity style={s.surveyButton} onPress={this.takeSurvey}>
          <Text style={s.surveyButtonText}>{"Take the Survey"}</Text>
       </TouchableOpacity>
     </View>
    )
  }

  takeSurvey = () => client.openURL(`dd://survey/${this.props.surveyId}`)
}

const gray = '#4b4b4b'
const lightGray = '#bbbbbb'
const s = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: lightGray,
    overflow: 'hidden'
  },
  rowContainer: {
    flexDirection: 'row',
  },
  textContainer: {
    marginRight: 24,
    paddingRight: 24
  },
  icon: {
    height: 40,
    width: 32,
    padding: 1,
    marginTop: 15,
    marginLeft: 24,
    marginRight: 24
  },
  surveyButtonText: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: "bold",
    color: "white",
  },

  surveyButton: {
    backgroundColor: client.primaryColor,
    flex: 1,
    padding: 12,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 14,
    marginTop: 14,
    borderRadius: 4,
  },
  textTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: gray,
    marginTop: 15,
    marginBottom: 3,
    textAlign: 'center'
  },
  textText: {
    margin: 7,
    color: gray
  },
  textTitleLeft: {
    fontSize: 18,
    fontWeight: "bold",
    color: gray,
    marginTop: 15,
    marginBottom: 3,
    marginRight: 24
  },
  desText: {
    color: gray,
    marginLeft: 0,
    marginTop: 0,
    marginRight: 24,
    flex: 1,
    paddingLeft: 0,
  },
  textTextShowMore: {
    marginBottom: 20
  },
  textShowMoreContainer: {
    position: 'absolute',
    bottom: 0,
    right: 5
  },
  textShowMore: {
    paddingLeft: 5,
    paddingTop: 5,
    color: '#2789c0',
    backgroundColor: 'rgba(255,255,255,0.8)'
  },
  htmlContainer: {
    height: 200
  },
  webContainer: {
    height: 300
  },
  webFooter: {
    height: 50,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  webFooterTitle: {
    marginLeft: 15,
    marginRight: 5,
    fontSize: 18,
    fontWeight: 'bold',
    color: gray,
    height: 40,
  },
  webFooterLink: {
    marginLeft: 5,
    marginRight: 15,
    fontSize: 18,
    padding: 0,
    margin: 5,
    width: 90,
    color: gray,
  },
  web: {
    flex: 1
  }
})