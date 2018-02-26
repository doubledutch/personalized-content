import React, { PureComponent } from 'react'
// import Background from '..images/iPhone.png'

export default class ContentPreview extends PureComponent {

  render() {
    const {content} = this.props
    const sectionStyle = {
      backgroundImage: 'url(' + require('./iPhone.png') + ')' 
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
        <h2 style={{fontSize: 16, padding: 0, margin: 3}}>{c.title}</h2>
        <p style={{fontSize: 12, padding: 0, margin: 3}}>{c.text}</p>
      </div>
      case 'web': return <div className="webCell">
        <iframe src={c.url} style={{height: 245, width: 268, border:"none"}}title="webview" ></iframe>
      </div>
      case 'api': return <div>
     
    </div>
      case 'survey': return <div className="textCell">
      <h2 style={{fontSize: 16, padding: 0, margin: 3, flex:1, textAlign: "center"}}>{c.title}</h2>
      <p style={{fontSize: 12, padding: 0, margin: 3}}>{c.text}</p>
      <button style={{height: 30, backgroundColor: "red", color: "white", borderRadius: 5, marginTop: 5}}>Take the survey</button>
    </div>
      default: return <div />
    }
  }
}