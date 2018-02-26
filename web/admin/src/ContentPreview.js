import React, { PureComponent } from 'react'

export default class ContentPreview extends PureComponent {

  render() {
    const {content} = this.props
    
    return (
      <div className="phoneBox">
        { this.editorFor(content) }
      
      </div>
    )
  }

  editorFor = c => {
    switch (c.type) {
      case 'text': return <div>
       
      </div>
      case 'web': return <div style={{flex:1}}>
      <iframe src={c.url} title="webview" ></iframe>

      </div>
      case 'api': return <div>
     
    </div>
      case 'survey': return <div>
        TODO: Survey UI
      </div>
      default: return <div />
    }
  }
}