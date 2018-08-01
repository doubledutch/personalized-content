'use strict'
import React, { Component } from 'react'
import ReactNative, { StyleSheet, Text, TouchableHighlight, View, WebView, Image, Linking, Platform } from 'react-native'
import client, { Color } from '@doubledutch/rn-client'
import YouTube, { YouTubeStandaloneAndroid } from 'react-native-youtube'
import Video from 'react-native-video'
import secrets from './secrets'

export default class VideoContent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      paused: true, muted: true,
      loading: true, progress: 0.0
    }
  }
  render() {
    const {title, url} = this.props
    return (
      <View style={[s.container]}>
        <View style={s.dimensionStyle}>
            {this.renderPlayer(url)}
        </View>
        <View style={s.webFooter}>
          <View  style={{flex: 1}}>
            <Text style={s.webFooterTitle} ellipsizeMode='tail' numberOfLines={2}>{title}</Text>
          </View>
        </View>
      </View>
    )
  }

  onPressVideo = () => {
    this.setState({
      paused: !this.state.paused
    })
  }
 
  renderYouTubePlayer(videoId) {
      // Android has special rendering because the youtube component uses fragments
      // which don't play nice in list views. I'm sure someone smarter can figure out
      // how to make that work, but I could not.
    if (Platform.OS === 'android') {
      return (
        <TouchableHighlight
        style={{ flex: 1 }}
        onPress={() => {
        YouTubeStandaloneAndroid.playVideo({
            apiKey: secrets.youTube.apiKey,
            videoId: videoId,
            autoplay: true
        })
        }}>
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <Image
            source={{ uri: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` }}
            resizeMode='cover'
            style={ s.video }
            />
            <View style={ s.playButton }>
              <Text style={ s.playButtonText }>▶</Text>
            </View>
          </View>
        </TouchableHighlight>
      )
    } 
    else {
      return (
        <YouTube
          videoId={videoId}        // The YouTube video ID
          play={true}             // control playback of video with true/false
          fullscreen={false}       // control whether the video should play in fullscreen or inline
          loop={false}             // control whether the video should loop when ended
          onReady={e => this.setState({ isReady: true })}
          onChangeState={e => this.setState({ status: e.state })}
          onChangeQuality={e => this.setState({ quality: e.quality })}
          onError={e => this.setState({ error: e.error })}
          style = {s.video}
        />
      )
    }
  }
  
  renderVimeoPlayer(url) {
    return (
      <WebView
        source={url}
        style={s.video}
      />
    )
  }
  
  renderVideoPlayer(url) {
    return (
      <TouchableHighlight
      ref={(ref) => {
      }} style={{ flex: 1 }} onPress={() => this.videoRef.presentFullscreenPlayer()}>
        <Video
          ref={(ref) => {
          }}
          source={{ uri: url }}
          style={s.video}
          paused={true}
        />
      </TouchableHighlight>
    )
  }
  
  renderPlayer(video) {
    if (video) {
      if (video.toLowerCase().indexOf('youtube.com') >= 0) {
        const videoId = video.replace(/.+v=(.+?)(&|$)/g, '$1')
        return this.renderYouTubePlayer(videoId)
      } 
      else if (video.toLowerCase().indexOf('vimeo.com') >= 0) {
        return this.renderVimeoPlayer(video)
      } 
      else {
        return this.renderVideoPlayer(video)
      }
    }
    return this.renderYouTubePlayer('-xAFnaYDQa4')
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
  containerFlex: {
    flex: 1
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
    marginTop: 5,
    marginBottom: 5
  },
  webFooterLink: {
    marginLeft: 5,
    marginRight: 15,
    fontSize: 18,
    padding: 0,
    margin: 5,
    width: 90,
    color: gray
  },
  web: {
    flex: 1
  },
  dimensionStyle : {
    flexDirection: "row", 
    flexGrow: 1,
    aspectRatio: 1.777,
    justifyContent: 'center'
  },
  video: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 200,
    // backgroundColor: 'red',
    alignItems: 'stretch',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  playButton: {
    height: 80,
    width: 80,
    backgroundColor: 'rgba(170,170,170,0.6)',
    zIndex: 3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 40
  },
  playButtonText: {
    fontSize: 40,
    lineHeight: 32,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    color: 'rgba(255,255,255,0.5)',
  },
})