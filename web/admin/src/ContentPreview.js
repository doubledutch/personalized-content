import React, { PureComponent } from 'react'
import { TextEditor } from './editors'

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
      <iframe src="https://www.google.com" style="border:2px solid grey;></iframe>

       {/* <WebView autosize={true} src="http://www.google.com" /> */}
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