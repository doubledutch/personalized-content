import React, { PureComponent } from 'react'
import Background from './iPhone.png'

export default class ContentPreview extends PureComponent {

  render() {
    const {content, hidden} = this.props
    const sectionStyle = {
      backgroundImage: `url(${Background})`
    }
    if (hidden) {
      if (content) {
        return (
          <div className="content-preview">
            <div className="phoneBox" style={sectionStyle}>
              <div className="phoneScroll">
                { content.map(this.editorFor) }
              </div>
            </div>
          </div>
        )
      }
      else {
        return (
          <div className="content-preview">
            <div className="phoneBox" style={sectionStyle}>
              <div className="phoneScroll">
                <h1 className="staticText">Assign content to this attendee to see it previewed here</h1>
              </div>
            </div>
          </div>
        )
      }
    }
    else return null
  }

  getContent = (id) => {
    const survey = this.props.surveys.find(s => s.id === id)
    if (survey) {
      return (
        <div>
          <h2 className="textCellTitle">{survey.name}</h2>
          <p className="textCellText" style={{textAlign: "center"}}>{survey.description}</p>
        </div>
      )
    }
  }

  editorFor = (c, i) => {
    switch (c.type) {
      case 'text': return <div className="textCell" key={i}>
        <h2 className="textCellTitle">{c.title}</h2>
        <p className="textCellText" rows={5}>{c.text}</p>
      </div>
      case 'web': return <div className="webCell" key={i}>
        <iframe className="iFrameBox" src={c.url} title="webview"></iframe>
      </div>
      case 'html': return <div className="htmlCell" key={i}>
        <h2 className="textCellTitle">{c.title}</h2>
        <iframe className="htmlBox" srcdoc={c.text} title="webview"></iframe>
    </div>
      case 'survey': return <div className="textCell" key={i}>
      {this.getContent(c.surveyId)}
      <button className="surveyButton">Take the survey</button>
    </div>
      default: return <div key={i}/>
    }
  }
}
