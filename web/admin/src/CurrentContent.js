import React, { PureComponent } from 'react'
import { Link } from 'react-router-dom'

export default class CurrentContent extends PureComponent {
  render() {
    const {content} = this.props
    return (
      <div className="current-content">
        <h2>Current Content</h2>
        <ul className="current-content__list">
          { content.map(c => <li key={c.key}>
            <img src={iconFor(c)} className="current-content__icon" alt={c.type} />
            <span className="current-content__title">{titleFor(c)}</span>
            <Link to={`/content/${c.key}`} className="current-content__view">View</Link>
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