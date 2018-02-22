import React, { Component } from 'react'
import './App.css'

 class AttendeeCell extends Component {
  render() {
    const task = this.props.task
    const difference = this.props.difference
    let title = this.props.title
    // if (title.length > 40){
    //   var newTitle = task.sessionName.slice(0, 40)
    //   title = newTitle + "..."
    // }
  
    return(
      <span className='cellBoxLeft'>
        <span className='cellBoxTop'>
          <p className='introText'>{"title"}</p>
        </span>
        <p className="questionText">"{"text"}"</p>
        {/* { task.anom
            ? <p className="nameText">
                -Anonymous
              </p>
            : <p className="nameText">
               
              </p>
        } */}
      </span>
    )
  }
}

export default AttendeeCell