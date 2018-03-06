import React, { PureComponent } from 'react'
import { StyleSheet, Text, TouchableOpacity, View, WebView, Image } from 'react-native'
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
    const {surveyId, surveyName} = this.props
    const text = "This is sample text that needs to be replaced to a props for the survey description. This is to test the spacing among other design"
    return (
       <View style={s.container}>
        <View style={s.rowContainer}>
          <Image style={s.icon} source={{uri: "https://dml2n2dpleynv.cloudfront.net/extensions/personalized-content/survey_icon@2x.png"}}/>
          <View style={s.textContainer}>
            <Text style={s.textTitleLeft}>{surveyId}</Text>
            <View style={s.desText}>
              { text && text.length > showMoreTextLimit
                ? <View>
                    <Text style={[s.desText, showMore ? s.textTextShowMore : null]}>{showMore ? text : text.substring(0,showMoreTextLimit) + '...'}</Text>
                    <TouchableOpacity style={s.textShowMoreContainer} onPress={this.toggleShowMore}>
                      <Text style={s.textShowMore}>{showMore ? 'Show Less' : 'Show More'}</Text>
                    </TouchableOpacity>
                  </View>
                : <Text style={s.desText}>{text}</Text>
              }
            </View>
          </View>
       </View>
       <TouchableOpacity style={s.surveyButton}>
          <Text style={s.surveyButtonText}>{"Take the Survey"}</Text>
       </TouchableOpacity>
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
    textAlign: 'center',
    fontSize: 14,
    fontWeight: "bold",
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