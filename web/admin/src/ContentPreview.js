import React, { PureComponent } from 'react'
import { TextEditor } from './editors'

export default class ContentPreview extends PureComponent {

  render() {
    const {content} = this.props
    
    return (
      <div>
        { this.editorFor(content) }
      
      </div>
    )
  }

  editorFor = c => {
    switch (c.type) {
      case 'text': return <div>
       
      </div>
      case 'web': return <div>
       
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