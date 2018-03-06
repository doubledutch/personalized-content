import React, { PureComponent } from 'react'

export class TextEditor extends PureComponent {
  state = {}

  componentWillMount() {
    this.reset(this.props)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.content !== this.props.content || nextProps.prop !== this.props.prop) {
      this.reset(nextProps)
    }
  }

  reset = ({content, prop}) => this.setState({value: content[prop]})

  render() {
    const {title, placeholder, validationMessage} = this.props

    return (
      <label className="text-editor">
        <div className="text-editor__title">{title}</div>
        { this.isValid() ? null : <div className="text-editor__error">{validationMessage}</div> }
        <div className="text-editor__inputBox">
          <input
            className="text-editor__input"
            type="text"
            placeholder={placeholder}
            value={this.state.value}
            onChange={this.onChange}
            onBlur={this.onBlur}
            maxLength={150}
          />
          {this.isTitle()}
        </div>
      </label>
    )
  }

  isTitle = () => {
    if (this.props.isTitle && this.state.value) {
      return (
        <p className="text-editor__counter">{150 - this.state.value.length} </p>
      )
    }
  }

  onChange = e => this.setState({value: e.target.value})
  
  onBlur = () => this.isValid() && this.props.onUpdate(this.props.prop, this.state.value)

  isValid = () => {
    const {regex} = this.props
    const {value} = this.state
    return !regex || value == null || value.match(regex)
  }
}

export class MultiLineEditorBox extends PureComponent {
  state = {}
  componentWillMount() {
    const {content, prop, validationMessage} = this.props
    this.setState({value: content[prop]})
  }
  render() {
    return (
      <div className="multiline-editor__box">
        <div className="editorBox__header">
          {this.renderButton("text", "Text", 1)}
          {this.renderButton("html", "HTML", 2)}
        </div>
        <MultiLineEditor content={this.props.content} prop="text" title="Content" placeholder="Acme Co Details" onUpdate={this.props.onUpdate} onChange={this.onChange}/>
        <div className="editorBox__footer">
          <p className="multiline-editor__counter">{"Characters: " + this.renderCounter() + " (Limit: 15000)"} </p>
        </div> 
      </div>
    )
  }

  renderCounter = () => {
    if (this.state.value) return this.state.value.length
    else return "0"
  }

  onSelect = (e) => {
    if (e.target.value !== this.props.content.type) {
      this.props.onUpdate("type", e.target.value)
    }
  }

  onChange = (e) => {
    this.setState({value: e.target.value})
  }

  renderButton = (type, title, i) => {
    var color = "#D8D8D8"
    var font = "#9B9B9B"
    if (type === this.props.content.type){
      color = "#9B9B9B"
      font = "#ffffff"
    }
    return (
      <button className="switch__button" key = {i} style={{backgroundColor: color, color: font}} value={type} onClick={this.onSelect}>  
        {title}
      </button>
    )
  }
}



export class MultiLineEditor extends PureComponent {
  state = {}

  componentWillMount() {
    const {content, prop, validationMessage} = this.props
    this.setState({value: content[prop]})
  }

  render() {
    return (
      <div>
        <textarea
          className="multiline-editor__input"
          type="text"
          value={this.state.value}
          onChange={this.onChange}
          onBlur={this.onBlur}
          maxLength={15000}
        />
      </div>
    )
  }

  onChange = (e) => {
    this.props.onChange(e)
    this.setState({value: e.target.value})
  }
  
  onBlur = () => this.isValid() && this.props.onUpdate(this.props.prop, this.state.value)
  
  isValid = () => {
    const {regex} = this.props
    const {value} = this.state
    return !regex || value == null || value.match(regex)
  }
}

export class SelectEditor extends PureComponent {
  componentDidMount() {
    const {content, prop, onUpdate} = this.props
    const {value} = this.select
    if (content[prop] !== value) onUpdate(prop, +value)
  }

  render() {
    const {content, options, prop, size} = this.props

    return (
      <label className="select-editor">
        <select
          size={size || 0}
          className="select-editor__select"
          ref={select => this.select = select}
          value={content[prop]}
          onChange={this.onChange}
        >
          { options.map(o => <option className="select-editor__option" value={o.id} key={o.id}>{o.name}</option>) }
        </select>
      </label>
    )
  }

  onChange = e => {
    this.props.onUpdate(this.props.prop, +e.target.value)
  }
}

