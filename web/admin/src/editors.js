import React, { PureComponent } from 'react'

export class TextEditor extends PureComponent {
  state = {}

  componentWillMount() {
    const {content, prop} = this.props
    this.setState({value: content[prop]})
  }

  render() {
    const {title, placeholder} = this.props

    return (
      <div className="contentBox">
        <h3>{title}</h3>
          <input className="textInput" type="text" value={this.state.value} onChange={this.onChange} onBlur={this.onBlur} placeholder={placeholder}/>
      </div>
    )
  }

  onChange = e => this.setState({value: e.target.value})
  
  onBlur = () => this.props.onUpdate(this.props.prop, this.state.value)
}
