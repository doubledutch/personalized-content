import React, { PureComponent } from 'react'

export default class CurrentContent extends PureComponent {
  render() {
    const {content, onView} = this.props
    return (
      <div className="current-content">
        <h2>Current Content</h2>
        <ul className="current-content__list">
          { content.map(c => <li key={c.key}>
            <img src={iconFor(c)} className="current-content__icon" alt={c.type} />
            <span className="current-content__title">{titleFor(c)}</span>
            <a onClick={() => onView(c)} href={`#/content/${c.key}`} className="current-content__view">View</a>
          </li>)}
        </ul>
      </div>
    )
  }
}

function iconFor(c) {
  switch (c.type) {
    case 'text': return 'https://dummyimage.com/18x18/000/fff.png&text=T'
    case 'web': return 'https://dummyimage.com/18x18/000/fff.png&text=W'
    case 'survey': return 'https://dummyimage.com/18x18/000/fff.png&text=S'
    default: return 'https://dummyimage.com/18x18/000/fff.png&text=?'
  }
}

const titleFor = c => c.title || (c.type==='survey' ? 'Survey' : 'Unknown')