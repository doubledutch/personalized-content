import React, { Component } from 'react'
import './App.css'
import Modal  from 'react-modal'

export class CustomModal extends Component {
  
  render() {
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
            {this.modalMessage()}
          </div>
          <div className="modalButtonBox">
            {this.modalButtons()}
          </div >    
        </div>
      </Modal>
    )
  }

  modalMessage = () => {
    return (
      <div>
        { this.props.isPublished
        ? <p className="modalHeadline">Are you sure you want to unpublish this content?</p>
        : <p className="modalHeadline">Are you sure you want to publish this content?</p> }
          <p className="modalText">{titleFor(this.props.selectedContent)}</p>
      </div>
    )
  }

  modalButtons = () => {
    const c = this.props.selectedContent
    return (
      <div>
        <button className="modalDone" onClick={this.props.closeModal}>Cancel</button>
        { this.props.isPublished
        ? <button className="modalExport" onClick={this.unpublish(c)}>Unpublish Content</button>
        : <button className="modalExport" onClick={this.publish(c)}>Publish Content</button> }
      </div>
    ) 
  }

  publish = content => () => this.props.publish(content)
  unpublish = content => () => this.props.unpublish(content)

}

  const titleFor = c => c.title || (c.type==='survey' ? 'Survey' : 'Unknown')


export default CustomModal