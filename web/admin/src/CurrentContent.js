import React, { PureComponent } from 'react'
import { Link } from 'react-router-dom'
import SearchBar from './SearchBar'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import PageIcon from './images/text-doc.svg'
import WebIcon from './images/earth.svg'
import TextIcon from './images/TextIcon.png'
import ReorderIcon from './images/Reorder.png'

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
      move: false
    }
  }

  render(){
    const {content} = this.props
    // const content = []
    if (content.length){
      if (this.state.move){
        return (
          <div className="current-content">
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
            <span className="content-bar">
              <h2 className="contentTitle">Current Content</h2>
              <button className="button-small__white" onClick={this.moveNow}>Reorder Content</button>
              <SearchBar updateList={this.props.updateList}/>
            </span>
            <ul className="current-content__list">
              { content.map(c => <li key={c.key}>
                <img src={iconFor(c)} className="current-content__icon" alt={c.type} />
                <span className="current-content__title">{titleFor(c)}</span>
                <Link to={`/content/${c.key}`} className="current-content__view">View</Link>
              </li>)}
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
              <h1>Curate your attendees' experience with custom content</h1>
              <h2>Click below to build your first piece of content</h2>
              <button className="button-big" onClick={() => this.props.addNewContent(this.props.history)}>Add New Content</button>
            </div>
          </div>
        </div>
      )
    }
  }

  

  moveNow = () => {
    var state = this.state.move
    this.setState({move: !state})
  }

  saveNow = () => {
    this.moveNow()
    this.props.checkOrder()
  }

  cancelNow = () => {
    this.moveNow()
    this.props.cancelUpdates()
  }


}

function iconFor(c) {
  switch (c.type) {
    case 'html':
    case 'text': return TextIcon
    case 'web': return WebIcon
    case 'survey': return PageIcon
    default: return <div/>
  }
}

const titleFor = c => c.title || (c.type==='survey' ? 'Survey' : 'Unknown')