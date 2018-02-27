import React, { PureComponent } from 'react'
import Background from './iPhone.png'

export default class ContentPreview extends PureComponent {

  render() {
    const {content} = this.props
    const sectionStyle = {
      backgroundImage: `url(${Background})`
    }
    return (
      <div className="phoneBox" style={sectionStyle}>
        { this.editorFor(content) }
      
      </div>
    )
  }

  editorFor = c => {
    switch (c.type) {
      case 'text': return <div className="textCell">
        <h2 className="textCellTitle">{c.title}</h2>
        <p className="textCellText">{c.text}</p>
      </div>
      case 'web': return <div className="webCell">
        <iframe className="iFrameBox" src={c.url} title="webview" ></iframe>
      </div>
      case 'api': return <div>
     
    </div>
      case 'survey': return <div className="textCell">
      <h2 className="textCellTitle" style={{textAlign: "center"}}>{c.title}</h2>
      <p className="textCellText">{c.text}</p>
      <button className="surveyButton">Take the survey</button>
    </div>
      default: return <div />
    }
  }
}