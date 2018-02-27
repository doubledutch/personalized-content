import React, { PureComponent } from 'react'
import { Link } from 'react-router-dom'
import SearchBar from './SearchBar'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

// using some little inline style helpers to make the app look okay
const getItemStyle = (draggableStyle, isDragging) => ({
// some basic styles to make the items look a bit nicer
userSelect: 'none',
display: "flex",
flexFlow: "row wrap",
alignItems: "center",
margin: '-1 -1 0 -1',
height: 40,
padding: 0,
border: "1px solid #e2e2e2",
textAlign: "center",
borderRadius: 4,
fontFamily: "-apple-system, BlinkMacSystemFont, 'Fira Sans', 'Open Sans', 'Helvetica Neue', sans-serif",
// change background colour if dragging
background: isDragging ? 'lightgray' : 'white',

// styles we need to apply on draggables
...draggableStyle,
});
const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? 'white' : 'white',
  width: '100%',
  margin: 0,
  padding: 0,
  height: 351,
  overflowY: "scroll",
  backgroundColor: "#fbfbfb",
  border: "1px solid #e2e2e2"
});

export default class CurrentContent extends PureComponent {

  onDragEnd = (result) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }
    const items = reorder(
      this.state.items,
      result.source.index,
      result.destination.index
    );

    this.setState({
      items,
    });
   
  }

  // render() {
  //   const {content} = this.props
  //   return (
  //     <div className="current-content">
  //       <span className="content-bar">
  //         <h2>Current Content</h2>
  //         <button className="button-small">Reorder Content</button>
  //         <SearchBar updateList={this.props.updateList}/>
  //       </span>
  //       <ul className="current-content__list">
  //         { content.map(c => <li key={c.key}>
  //           <img src={iconFor(c)} className="current-content__icon" alt={c.type} />
  //           <span className="current-content__title">{titleFor(c)}</span>
  //           <Link to={`/content/${c.key}`} className="current-content__view">View</Link>
  //         </li>)}
  //       </ul>
  //     </div>
  //   )
  // }

  render(){
    const {content} = this.props
    return (
      <div className="current-content">
      <span className="content-bar">
        <h2>Current Content</h2>
        <button className="button-small">Reorder Content</button>
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
                          <img src={iconFor(c)} className="current-content__icon" alt={c.type} />
                          <span className="current-content__title">{titleFor(c)}</span>
                          <Link to={`/content/${c.key}`} className="current-content__view">View</Link>
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




}

function iconFor(c) {
  switch (c.type) {
    case 'text': return 'https://dummyimage.com/18x18/000/fff.png&text=T'
    case 'web': return 'https://dummyimage.com/18x18/000/fff.png&text=W'
    case 'survey': return 'https://dummyimage.com/18x18/000/fff.png&text=S'
    default: return 'https://dummyimage.com/18x18/000/fff.png&text=?'
  }
}

const titleFor = c => c.title || (c.type==='survey' ? 'Survey' : 'Unknown')