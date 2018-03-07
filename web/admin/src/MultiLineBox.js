export class MultiLineEditorBox extends PureComponent {
  state = {}

  componentWillMount() {
    const {content, prop} = this.props
    this.setState({value: content[prop]})
  }

  render() {
    return (
      <div className="multiline-editor__box">
        <div className="editorBox__header">
          {this.renderButton("text", "Text", 1)}
          {this.renderButton("html", "HTML", 2)}
        </div>
        <textarea
          className="multiline-editor__input"
          type="text"
          value={this.state.value}
          onChange={this.onChange}
          onBlur={this.onBlur}
          maxLength={15000}
        />
        <div className="editorBox__footer">
          <p className="multiline-editor__counter">{"Characters: " + this.renderCounter() + " (Limit: 15000)"} </p>
        </div>
      </div>
    )
  }
  renderCounter = () => {
    if (this.props.content.text) return this.props.content.text
    else return "0"
  }

  onSelect = (e) => {
    if (e.target.value !== this.props.content.type) {
      this.props.onUpdate("type", e.target.value)
    }
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