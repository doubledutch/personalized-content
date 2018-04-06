import React, { Component } from 'react'
import './App.css'
import Modal  from 'react-modal'

export class CustomModal extends Component {

  render() {
    const letPublish = (this.props.selectedContent) ? (this.props.selectedContent.checkAll) || (this.props.selectedContent.attendeeIds.length > 0) || (this.props.selectedContent.groupIds.length > 0) || (this.props.selectedContent.tierIds.length > 0) : false
    var ifURL = true
    if (this.props.selectedContent.type === 'web') ((this.props.selectedContent.url) ? ifURL = true : ifURL = false)
    
    return(
      <Modal
      ariaHideApp={false}
      isOpen={this.props.showModal}
      onAfterOpen={this.props.afterOpenModal}
      onRequestClose={this.props.closeModal}
      contentLabel="Modal"
      className="Modal"
      overlayClassName="Overlay"
      >
        <div>
          <button className="closeButton" onClick={this.props.closeModal}>X</button>
          <div className="modalTextBox">
            {this.modalMessage(letPublish, ifURL)}
          </div>
          <div className="modalButtonBox">
            {this.modalButtons(letPublish, ifURL)}
          </div >    
        </div>
      </Modal>
    )
  }

  modalMessage = (letPublish, ifURL) => {
    if (this.props.selectedContent.type && letPublish && ifURL) {
      return (
        <div>
          { this.props.isPublished
          ? <p className="modalHeadline">Are you sure you want to unpublish this content?</p>
          : <p className="modalHeadline">Are you sure you want to publish this content?</p> }
            <p className="modalText">{titleFor(this.props.selectedContent)}</p>
        </div>
      )
    }
    else {
      if (this.props.selectedContent.type && letPublish === false) {
        return (
          <div>
            <p className="modalHeadline">Content must be assigned to at least one attendee in order to publish.</p>
          </div>
        )
      }
      else {
        return (
          <div>
            <p className="modalHeadline">Content must be completed in order to publish.</p>
          </div>
        )
      }
    }
  }

  modalButtons = (letPublish, ifURL) => {
    const c = this.props.selectedContent
    if (this.props.selectedContent.type && letPublish && ifURL) {
      return (
        <div>
          <button className="modalDone" onClick={this.props.closeModal}>Cancel</button>
          { this.props.isPublished
          ? <button className="modalExport" onClick={this.unpublish(c)}>Unpublish Content</button>
          : <button className="modalExport" onClick={this.publish(c)}>Publish Content</button> }
        </div>
      ) 
    }
    else {
      return (
        <div>
          <button className="modalDone" onClick={this.props.closeModal}>Cancel</button>
        </div>
      )
    }
  }

  publish = content => () => {
    this.props.publish(content)
    this.props.closeModal()
  }
  unpublish = content => () => {
    this.props.unpublish(content)
    this.props.closeModal()
  }

}

  const titleFor = c => c.title || (c.type==='survey' ? 'Survey' : '"No Title"')


export default CustomModal