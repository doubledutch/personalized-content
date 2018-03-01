import React, { PureComponent } from 'react'

export class TextEditor extends PureComponent {
  state = {}

  componentWillMount() {
    const {content, prop} = this.props
    this.setState({value: content[prop]})
  }

  render() {
    const {title, placeholder, validationMessage} = this.props

    return (
      <label className="text-editor">
        <div className="text-editor__title">{title}</div>
        { this.isValid() ? null : <div className="text-editor__error">{validationMessage}</div> }
        <input
          className="text-editor__input"
          type="text"
          placeholder={placeholder}
          value={this.state.value}
          onChange={this.onChange}
          onBlur={this.onBlur}
        />
      </label>
    )
  }

  onChange = e => this.setState({value: e.target.value})
  
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
    const {content, options, prop, title} = this.props
    console.log(options)
    return (
      <label className="select-editor">
        <select
          className="select-editor__select"
          ref={select => this.select = select}
          value={content[prop]}
          onChange={this.onChange}
          size={6}
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

