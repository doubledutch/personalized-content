import React, { Component } from 'react'
import ReactNative, { Text, View, Image, TouchableOpacity } from 'react-native'

export default class TextView extends Component {

  renderBox = () => {

  }




  render() {
    const { image, title, description } = this.props
    return(
      <View>
        <View style={s.top}>
          <Text style={s.header2}>{"OFFER"}</Text>
          <TouchableOpacity  style={{}}>
            <Text style={s.button}>{"Test"}</Text>
          </TouchableOpacity>
        </View>
        <View style={s.main}>
          <Image style={s.image} source={{uri: "https://pbs.twimg.com/profile_images/830196364600414209/eRwYazQG_400x400.jpg"}} />
          <View style={s.info}>
            <Text style={s.title}>{"DoubleDutch Registration"}</Text>
            <Text style={s.description}>{"Start your trial in building an end to end event solution"}</Text>
          </View>
        </View>
      </View>
    )
  }

}
    
const s = ReactNative.StyleSheet.create({
  top: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    flexDirection: 'row',
    height: 25,
    justifyContent: 'center'
  },
  button: {
    alignSelf: 'flex-end',
    color:"#707070",
    backgroundColor: "white",
  },

  header2: {
    textAlign: "left",
    fontSize: 18,
    height: 22,
    flex: 1,
    marginLeft: 15,
    color:"#707070",
    paddingBottom:  5
  },

  main: {
    padding: 10,
    borderColor:'#D8D8D8',
    borderWidth:1,
    borderRadius: 5,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  image: {
    height: 50,
    width: 50,
  },
  info: {
    marginLeft: 10,
    marginRight: 15,
    flexDirection: 'column',
    flex: 1
  },
  title: {
    fontSize: 18,
    marginBottom: 5
  },
  description: {
    fontSize: 14
  }
})