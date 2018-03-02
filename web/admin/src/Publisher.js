import React, { Component } from 'react'

export default class Publisher extends Component {
  render() {
    const {publish, discard} = this.props
    return (
      <div className="publish-content__box">
        <p>Would you like to publish all new content and changes to the mobile app?</p>
        <button onClick={discard}>Discard changes</button>
        <button onClick={publish}>Publish changes</button>
      </div> 
    )
  }
}
