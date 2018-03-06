import React, { PureComponent } from 'react'
import { SelectEditor, TextEditor, MultiLineEditor } from './editors'

export default class ContentDetailsEditor extends PureComponent {
  constructor() {
    super()

    this.state = {expand: false}
  }

  renderTextEditor = (content, onUpdate) => {
    if (this.state.expand){
      return <MultiLineEditor content={content} prop="text" title="Content" placeholder="Acme Co Details" onUpdate={onUpdate}/>
    }
    else {
      return <label className="text-editor">
        <div className="text-editor__title">{"Content"}</div>
        <div className="text-editor__inputBox">
          <input
            className="text-editor__input"
            type="text"
            placeholder="Acme Co Details"
            onFocus={this.onExpand}
          />
        </div>
      </label>
    }
  }
  
  onExpand = () => {
    const currentState = this.state.expand
    this.setState({expand: !currentState})
  }

  render() {
    const {content, onUpdate, surveys} = this.props
    
    switch (content.type) {
      case "html":
      case 'text': return <div className="content-editor__box">
          <div>
            <h2 className="contentTitle">Add a Title</h2>
            <TextEditor content={content} prop="title" title="Title" placeholder="Acme Co Name" onUpdate={onUpdate} isTitle={true}/>
          </div>
          <div className="homeBox">
            <h2 className="contentTitle">Add Content</h2>
            {this.renderTextEditor(content, onUpdate)}
          </div>
        </div>
      case 'web': return <div className="content-editor__box">
          <div>
            <h2 className="contentTitle">Add a Title</h2>
            <TextEditor content={content} prop="title" title="Title" placeholder="Acme Co Website" onUpdate={onUpdate} />
          </div>
          <div className="homeBox">
            <h2 className="contentTitle">Add Content</h2>
            <TextEditor content={content} prop="url" title="URL" regex={/^https?:\/\/[^/]/} validationMessage="The URL must begin with 'https://' or'http://'" placeholder="http://www.acme.com" onUpdate={onUpdate} />
          </div>
        </div>
      case 'survey': return <div className="content-editor__box">
          <h2 className="contentTitle">Choose Survey</h2>
          <SelectEditor size={6} content={content} prop="surveyId" title="Survey" onUpdate={onUpdate} options={surveys} />
        </div>
      default: return <div />
    }
  }

   

}
