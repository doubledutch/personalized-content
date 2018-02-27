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
