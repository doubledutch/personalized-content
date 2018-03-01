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
        <div className="phoneScroll">
          { content.map(this.editorFor) }
        </div>
      </div>
    )
  }

  getContent = (id) => {
    const survey = this.props.surveys.find(s => s.id === id)
    if (survey) {
      return (
        <div>
          <h2 className="textCellTitle" style={{textAlign: "center"}}>{survey.name}</h2>
          <p className="textCellText" style={{textAlign: "center"}}>{survey.description}</p>
        </div>
      )
    }
  }

  editorFor = (c, i) => {
    switch (c.type) {
      case 'text': return <div className="textCell" key={i}>
        <h2 className="textCellTitle">{c.title}</h2>
        <p className="textCellText">{c.text}</p>
      </div>
      case 'web': return <div className="webCell" key={i}>
        <iframe className="iFrameBox" src={c.url} title="webview" ></iframe>
      </div>
      case 'api': return <div>
     
    </div>
      case 'survey': return <div className="textCell" key={i}>
      {this.getContent(c.surveyId)}
      <button className="surveyButton">Take the survey</button>
    </div>
      default: return <div key={i}/>
    }
  }
}