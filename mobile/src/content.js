import React, { PureComponent } from 'react'
import { StyleSheet, Text, TouchableOpacity, View, WebView } from 'react-native'

const showMoreTextLimit = 300
export class TextContent extends PureComponent {
  state = {}
  render() {
    const {text, title} = this.props
    const {showMore} = this.state
    return (
      <View style={s.container}>
        <Text style={s.textTitle}>{title}</Text>
        <View style={s.textText}>
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
        <TouchableOpacity style={s.webFooter}>
          <Text style={s.webFooterTitle}>{title}</Text>
          <Text style={s.webFooterLink}>View Page</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

export class SurveyContent extends PureComponent {
  render() {
    const {surveyId} = this.props
    return (
      <View style={s.container}>
        <Text>Survey ID: {surveyId}</Text>
      </View>
    )
  }
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
  textTitle: {
    fontSize: 18,
    marginTop: 15,
    marginBottom: 3,
    textAlign: 'center'
  },
  textText: {
    margin: 7
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
    marginHorizontal: 15,
    fontSize: 18,
    fontWeight: 'bold',
    color: gray
  },
  webFooterLink: {
    marginHorizontal: 15,
    fontSize: 18,
    color: gray
  },
  web: {
    flex: 1
  }
})