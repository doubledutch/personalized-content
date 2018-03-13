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
import SearchBar from './SearchBar'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import PageIcon from './images/text-doc.svg'
import WebIcon from './images/earth.svg'
import TextIcon from './images/TextIcon.png'
import ReorderIcon from './images/Reorder.png'
import CustomModal from './Modal'

// using some little inline style helpers to make the app look okay
const getItemStyle = (draggableStyle, isDragging) => ({
// some basic styles to make the items look a bit nicer
userSelect: 'none',
display: "flex",
flexFlow: "row wrap",
alignItems: "center",
margin: '-1px -1px 0px -1px',
minHeight: 40,
padding: 0,
border: "1px solid #e2e2e2",
textAlign: "center",
// change background colour if dragging
background: isDragging ? 'lightgray' : 'white',

// styles we need to apply on draggables
...draggableStyle,
});
const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? 'white' : 'white',
  margin: 0,
  padding: 0,
  height: 351,
  overflowY: "scroll",
  backgroundColor: "#fbfbfb",
  border: "1px solid #e2e2e2"
});

export default class CurrentContent extends PureComponent {
  constructor() {
    super()
    this.state = {
      move: false,
      showModal: false,
      selectedContent: '',
      isPublished: true
    }
  }

  render(){
    const {content, publishedContent} = this.props
    // const content = []
    if (content.length){
      if (this.state.move){
        return (
          <div className="current-content">
            {this.renderModal()}
            <span className="content-bar">
              <h2 className="contentTitle">Current Content</h2>
              <button className="button-small__white" onClick={this.cancelNow}>Cancel</button>
              <button className="button-small__color" style={{marginLeft: 10}} onClick={this.saveNow}>Save Order</button>
              <SearchBar updateList={this.props.updateList}/>
            </span>
            <DragDropContext onDragEnd={this.props.onDragEnd}>
            <Droppable droppableId="droppable">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  style={getListStyle(snapshot.isDraggingOver)}
                >
                {
                  content.map((c, i) => 
                  (
                    <Draggable key={i} draggableId={i}>
                      {(provided, snapshot) => (
                        <div>
                          <div
                            ref={provided.innerRef}
                            style={getItemStyle(
                              provided.draggableStyle,
                              snapshot.isDragging
                              )}
                              {...provided.dragHandleProps}
                            >
                              <img src={ReorderIcon} className="current-content__move" alt={c.type} />
                              <img src={iconFor(c)} className="current-content__icon" alt={c.type} />
                              <span className="current-content__title">{titleFor(c)}</span>
                            </div>
                            {provided.placeholder}
                          </div>
                        )}
                      </Draggable>
                  ))
                }
                {provided.placeholder}
                </div>
                )}
              </Droppable>
            </DragDropContext>  
          </div>
        )
      }
      else {
        return (
          <div className="current-content">
            {this.renderModal()}
            <span className="content-bar">
              <h2 className="contentTitle">Current Content</h2>
              <button className="button-small__white" onClick={this.moveNow}>Reorder Content</button>
              <SearchBar updateList={this.props.updateList}/>
            </span>
            <ul className="current-content__list">
              { content.map(c => {
                const isPublished = areEqual(c, publishedContent[c.key])
                return (
                  <li key={c.key}>
                    <Link to={`/content/${c.key}`} className="current-content__link">
                      <img src={iconFor(c)} className="current-content__icon" alt={c.type} />
                      <p className="current-content__title">{titleFor(c)}</p>
                    </Link>
                    { isPublished
                      ? <span className="current-content__live">Live</span>
                      : <span className="current-content__draft">Draft</span> }
                    { isPublished
                      ? <button className="current-content__pub button-thin__borderless" onClick={this.unpublish(c)}>Unpublish</button>
                      : <button className="current-content__pub button-thin__blue" onClick={this.publish(c)}>Publish</button> }
                  </li>
                )
              })}
            </ul>
          </div>
        )
      }
    }
    else {
      return (
        <div className="current-content">
          <span className="content-bar">
            <h2 className="contentTitle">Current Content</h2>
            <button className="button-small__white" onClick={this.moveNow}>Reorder Content</button>
            <SearchBar updateList={this.props.updateList}/>
          </span>
          <div className="current-content__list">
            <div className="current-content__list-text">
              <h1>Curate your attendees&#39; experience with custom content</h1>
              <h2>Click below to build your first piece of content</h2>
              <button className="button-big" onClick={() => this.props.addNewContent(this.props.history)}>Add New Content</button>
            </div>
          </div>
        </div>
      )
    }
  }

  publish = content => () => this.openModal(content, false)
  unpublish = content => () => this.openModal(content, true)

  moveNow = () => this.setState({move: !this.state.move})

  saveNow = () => {
    this.moveNow()
    this.props.checkOrder()
  }

  cancelNow = () => {
    this.moveNow()
    this.props.cancelUpdates()
  }

  openModal = (c, p) => {
    this.setState({selectedContent: c, isPublished: p, showModal: true})
  }

  closeModal = () => {
    this.setState({showModal:false})
  }

  renderModal = () => {
    return (
      <CustomModal
      showModal = {this.state.showModal}
      closeModal = {this.closeModal}
      selectedContent={this.state.selectedContent}
      publish={this.props.publish}
      unpublish={this.props.unpublish}
      isPublished={this.state.isPublished}
      />
    )
  }


}

function iconFor(c) {
  switch (c.type) {
    case 'html':
    case 'text': return TextIcon
    case 'web': return WebIcon
    case 'survey': return PageIcon
    default: return null
  }
}

const titleFor = c => c.title || (c.type==='survey' ? 'Survey' : 'Unknown')

const areEqual = (c1, c2) => {
  if (!c1 || !c2) return false
  const keyLess = c => {
    const {key, ...rest} = c
    return rest
  }

  return JSON.stringify(keyLess(c1)) === JSON.stringify(keyLess(c2))
}