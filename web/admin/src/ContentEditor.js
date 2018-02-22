import React, { PureComponent } from 'react'

export default class ContentEditor extends PureComponent {
  render() {
    const {content, onExit, onDelete} = this.props
    return (
      <div>
        <button onClick={onExit}>&lt; Back</button>
        TODO - Content editor goes here for content w/ key: "{content.key}"
        <button onClick={onDelete}>Delete</button>
      </div>
    )
  }
}
