import React, { PureComponent } from 'react'

export class TextEditor extends PureComponent {
  state = {}

  componentWillMount() {
    const {content, prop} = this.props
    this.setState({value: content[prop]})
  }

  render() {
    const {title} = this.props

    return (
      <div>
        <label>
          {title} <input type="text" value={this.state.value} onChange={this.onChange} onBlur={this.onBlur} />
        </label>
      </div>
    )
  }

  onChange = e => this.setState({value: e.target.value})
  
  onBlur = () => this.props.onUpdate(this.props.content, this.props.prop, this.state.value)
}
