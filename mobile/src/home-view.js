import React, { Component } from 'react'
import ReactNative, {
  KeyboardAvoidingView, Platform, TouchableOpacity, Text, TextInput, View, ScrollView
} from 'react-native'
import TextView from './Text'
import client, { Avatar, TitleBar } from '@doubledutch/rn-client'
import FirebaseConnector from '@doubledutch/firebase-connector'
const fbc = FirebaseConnector(client, 'personalizedcontent')

fbc.initializeAppWithSimpleBackend()

export default class HomeView extends Component {
  constructor() {
    super()

    this.state = {componentConfigs: [{type: "TextView"}] }

    this.signin = fbc.signin()
      .then(user => this.user = user)
      .catch(err => console.error(err))
  }

  componentDidMount() {
    this.signin.then(() => {
      const userPrivateRef = fbc.database.private.userRef('tasks')
    })
  
  }

  render() {
    

    return (
      <KeyboardAvoidingView style={s.container} behavior={Platform.select({ios: "padding", android: null})}>
        <TitleBar title="My Feed" client={client} signin={this.signin} />
        <ScrollView style={s.scroll}>
          { this.state.componentConfigs.map(this.getComponent) }
        </ScrollView>
      </KeyboardAvoidingView>
    )
  }

  getComponent = (details, i) => {
    switch(details.type) {
      case "TextView" :
        return(
          <TextView/>
        )
    }
  }


}


const fontSize = 18
const s = ReactNative.StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scroll: {
    flex: 1,
    padding: 10
  },
})
