/*
 * Copyright 2018 DoubleDutch, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { PureComponent } from 'react'
import { Link } from 'react-router-dom'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { translate as t } from '@doubledutch/admin-client'
import SearchBar from './SearchBar'
import PageIcon from './images/text-doc.svg'
import WebIcon from './images/earth.svg'
import TextIcon from './images/TextIcon.png'
import Reorder from './images/Reorder.png'
import ReorderIcon from './images/ReorderIcon.png'
import CustomModal from './Modal'
import HTMLIcon from './images/HTMLIcon.png'
import VideoIcon from './images/video.svg'

// using some little inline style helpers to make the app look okay
const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? 'white' : 'white',
  margin: 0,
  padding: 0,
  height: 351,
  overflowY: 'scroll',
  backgroundColor: '#fbfbfb',
  border: '1px solid #e2e2e2',
})

export default class CurrentContent extends PureComponent {
  constructor() {
    super()
    this.state = {
      move: false,
      showModal: false,
      selectedContent: '',
      isPublished: true,
    }
  }

  render() {
    const { content, publishedContent } = this.props
    if (this.state.move) {
      return (
        <div className="current-content">
          {this.renderModal()}
          <span className="content-bar">
            <h2 className="contentTitle">{t('currentCards')}</h2>
            <button className="button-small__white" onClick={this.cancelNow}>
              {t('cancel')}
            </button>
            <button
              className="button-small__color"
              style={{ marginLeft: 10 }}
              onClick={this.saveNow}
            >
              {t('saveOrder')}
            </button>
            <SearchBar disable={this.props.disable} updateList={this.props.updateList} />
          </span>
          <DragDropContext onDragEnd={this.props.onDragEnd}>
            <Droppable droppableId="droppable">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  style={getListStyle(snapshot.isDraggingOver)}
                  {...provided.droppableProps}
                >
                  {content.map((c, i) => (
                    <div>{this.renderCell(c, i)}</div>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      )
    }

    return (
      <div className="current-content">
        {this.renderModal()}
        <span className="content-bar">
          <h2 className="contentTitle">{t('currentCards')}</h2>
          <button
            className="button-small__white"
            disabled={!this.props.content.length}
            onClick={this.moveNow}
          >
            <img src={ReorderIcon} className="reorder-content__move" alt="" />
            {t('reorder')}
          </button>
          <SearchBar disable={this.props.disable} updateList={this.props.updateList} />
        </span>
        {this.renderBox(content, publishedContent)}
      </div>
    )
  }

  renderCell = (item, i) => (
    <Draggable draggableId={i} index={i}>
      {(provided, snapshot) => {
        const style = {
          userSelect: 'none',
          display: 'flex',
          flexFlow: 'nowrap',
          alignItems: 'center',
          margin: '-1px -1px 0px -1px',
          minHeight: 40,
          padding: 0,
          border: '1px solid #e2e2e2',
          textAlign: 'center',
          background: 'white',
          boxShadow: snapshot.isDragging ? '0 2px 10px 0 rgba(0,0,0,0.5)' : '',
          ...provided.draggableProps.style,
        }
        return (
          <div>
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              style={style}
            >
              <img src={Reorder} className="current-content__move" alt={item.type} />
              {iconFor(item)}
              <p className="current-content__title-drag">{titleFor(item)}</p>
            </div>
            {provided.placeholder}
          </div>
        )
      }}
    </Draggable>
  )

  renderBox = (content, publishedContent) => {
    if (content.length) {
      return (
        <ul className="current-content__list">
          {content.map(c => {
            const isPublished =
              areEqual(c, publishedContent[c.key]) || this.csvIsPublished(c, publishedContent)
            const previousPublish = publishedContent[c.key]
            return (
              <li key={c.key}>
                <Link to={`/content/${c.key}`} className="current-content__link">
                  {iconFor(c)}
                  <p className="current-content__title">{titleFor(c)}</p>
                </Link>
                {this.renderStatus(isPublished, previousPublish)}
                {isPublished ? (
                  <button
                    className="current-content__pub button-thin__borderless"
                    onClick={this.confirmUnpublish(c)}
                  >
                    {t('unpublish')}
                  </button>
                ) : (
                  <button
                    className="current-content__pub button-thin__blue"
                    onClick={this.confirmPublish(c)}
                  >
                    {t('publish')}
                  </button>
                )}
              </li>
            )
          })}
        </ul>
      )
    }

    return <div className="current-content__list--gray">{this.promptMessage()}</div>
  }

  csvIsPublished = (c, publishedContent) => {
    const isCSV = !!(c.type === 'textCSV' || c.type === 'webCSV' || c.type === 'videoCSV')
    if (isCSV && publishedContent[c.key]) {
      if (c.rawData && publishedContent[c.key].rawData) {
        if (c.rawData.length !== publishedContent[c.key].rawData.length) {
          return false
        }
      }
      let areSameArray = true
      for (const i in c.rawData) {
        if (publishedContent[c.key].rawData) {
          if (c.rawData[i].text !== publishedContent[c.key].rawData[i].text) {
            areSameArray = false
          }
        }
      }
      return areSameArray
    }
    return false
  }

  renderStatus = (isPublished, previousPublish) => {
    if (isPublished) return <span className="current-content__live">{t('live')}</span>

    if (previousPublish) return <span className="current-content__changes">{t('unpublished')}</span>
    return <span className="current-content__draft">{t('draft')}</span>
  }

  promptMessage = () => {
    if (this.props.search) {
      return (
        <div className="current-content__list-text">
          <h1>{t('searchHelp')}</h1>
          <h2>{t('searchContent')}</h2>
        </div>
      )
    }

    return (
      <div className="current-content__list-text">
        <h1>{t('currentMessage')}</h1>
        <h2>{t('firstContent')}</h2>
        <button className="button-big" onClick={() => this.props.addNewContent(this.props.history)}>
          {t('addNew')}
        </button>
      </div>
    )
  }

  confirmPublish = content => () => this.openModal(content, false)

  confirmUnpublish = content => () => this.openModal(content, true)

  moveNow = () => {
    this.setState({ move: !this.state.move })
    this.props.disableButtons()
  }

  saveNow = () => {
    this.moveNow()
    this.props.checkOrder()
  }

  cancelNow = () => {
    this.moveNow()
    this.props.cancelUpdates()
  }

  openModal = (c, p) => {
    this.setState({ selectedContent: c, isPublished: p, showModal: true })
  }

  closeModal = () => {
    this.setState({ showModal: false })
  }

  renderModal = () => (
    <CustomModal
      showModal={this.state.showModal}
      closeModal={this.closeModal}
      selectedContent={this.state.selectedContent}
      publish={this.props.publish}
      unpublish={this.props.unpublish}
      isPublished={this.state.isPublished}
    />
  )
}

function iconFor(c) {
  switch (c.type) {
    case 'survey':
      return <img className="current-content__icon" src={PageIcon} alt="survey" />
    case 'textCSV':
    case 'text':
      return <img className="current-content__icon" src={TextIcon} alt="text" />
    case 'html':
      return <img className="current-content__icon-html" src={HTMLIcon} alt="html" />
    case 'webCSV':
    case 'web':
      return <img className="current-content__icon" src={WebIcon} alt="web" />
    case 'videoCSV':
    case 'video':
      return <img className="current-content__icon" src={VideoIcon} alt="video" />
    default:
      return <div className="current-content__icon" alt="blank" />
  }
}

const titleFor = c => c.title || (c.type === 'survey' ? 'Survey' : '"No Title"')

const areEqual = (c1, c2) => {
  if (!c1 || !c2) return false
  const actualContent = c => {
    const { key, order, ...rest } = c
    return rest
  }

  return JSON.stringify(actualContent(c1)) === JSON.stringify(actualContent(c2))
}
