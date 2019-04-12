import React, { Component } from 'react'
import './App.css'
import { translate as t } from '@doubledutch/admin-client'
import Modal from 'react-modal'

export class CustomModal extends Component {
  render() {
    const areUrlsOkay =
      this.props.selectedContent.type !== 'web' || !!this.props.selectedContent.url
    const isContentComplete = this.checkContent()
    const isCSV = !!(
      this.props.selectedContent.type === 'textCSV' ||
      this.props.selectedContent.type === 'webCSV' ||
      this.props.selectedContent.type === 'videoCSV'
    )
    const letPublish = this.props.selectedContent
      ? (areUrlsOkay && (isCSV && this.props.selectedContent.rawData)) ||
        (this.props.selectedContent.checkAll ||
          this.props.selectedContent.attendeeIds.length > 0 ||
          this.props.selectedContent.groupIds.length > 0 ||
          this.props.selectedContent.tierIds.length > 0)
      : false
    return (
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
          <button className="closeButton" onClick={this.props.closeModal}>
            X
          </button>
          <div className="modalTextBox">
            {this.modalMessage(letPublish, areUrlsOkay, isContentComplete)}
          </div>
          <div className="modalButtonBox">
            {this.modalButtons(letPublish, areUrlsOkay, isContentComplete)}
          </div>
        </div>
      </Modal>
    )
  }

  checkContent = () => {
    const itemType = this.props.selectedContent.type
    let publishOkay = true
    if (itemType === 'web' || itemType === 'video') {
      const content = this.props.selectedContent.url || ''
      publishOkay = content.trim() ? this.props.selectedContent.url.length : false
      return publishOkay
    }
    if (itemType === 'text' || itemType === 'html') {
      const content = this.props.selectedContent.text || ''
      publishOkay = content.trim() ? this.props.selectedContent.text.length : false
      return publishOkay
    }
    if (itemType === 'survey') {
      return !!this.props.selectedContent.title.trim()
    }
    return publishOkay
  }

  modalMessage = (letPublish, areUrlsOkay, isContentComplete) => {
    if (this.props.selectedContent.type && letPublish && isContentComplete) {
      return (
        <div>
          {this.props.isPublished ? (
            <p className="modalHeadline">{t('unpublishConfirm')}</p>
          ) : (
            <p className="modalHeadline">{t('publishConfirm')}</p>
          )}
          <p className="modalText">{titleFor(this.props.selectedContent)}</p>
        </div>
      )
    }

    if (
      this.props.selectedContent.type &&
      letPublish === false &&
      areUrlsOkay &&
      isContentComplete
    ) {
      return (
        <div>
          <p className="modalHeadline">{t('assign')}</p>
        </div>
      )
    }

    return (
      <div>
        <p className="modalHeadline">{t('contentComplete')}</p>
      </div>
    )
  }

  modalButtons = (letPublish, areUrlsOkay, isContentComplete) => {
    const c = this.props.selectedContent
    if (this.props.selectedContent.type && letPublish && isContentComplete && areUrlsOkay) {
      return (
        <div>
          <button className="modalDone" onClick={this.props.closeModal}>
            {t('cancel')}
          </button>
          {this.props.isPublished ? (
            <button className="modalExport" onClick={this.unpublish(c)}>
              {t('unpublishContent')}
            </button>
          ) : (
            <button className="modalExport" onClick={this.publish(c)}>
              {t('publishContent')}
            </button>
          )}
        </div>
      )
    }

    return (
      <div>
        <button className="modalDone" onClick={this.props.closeModal}>
          {t('cancel')}
        </button>
      </div>
    )
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

const titleFor = c => c.title || (c.type === 'survey' ? 'Survey' : '"No Title"')

export default CustomModal
