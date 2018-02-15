import React, { Component } from 'react'
import './App.css'
import ContentTable from './ContentTable'
import AttendeeTable from './AttendeeTable'
import client from '@doubledutch/admin-client'
import FirebaseConnector from '@doubledutch/firebase-connector'
const fbc = FirebaseConnector(client, 'personalizedcontent')
fbc.initializeAppWithSimpleBackend()

export default class App extends Component {
  constructor() {
    super()
    this.state = { sharedTasks: [] }
  }

  componentDidMount() {
    fbc.signinAdmin()
    .then(user => {
      const sharedRef = fbc.database.public.allRef('tasks')
      sharedRef.on('child_added', data => {
        this.setState({ sharedTasks: [...this.state.sharedTasks, {...data.val(), key: data.key }] })
      })
      sharedRef.on('child_removed', data => {
        this.setState({ sharedTasks: this.state.sharedTasks.filter(x => x.key !== data.key) })
      })  
    })
  }

  render() {
    return (
      <div className="App">
        <h3>Custom Content</h3>
        <ContentTable />
        <AttendeeTable />
      </div>
    )
  }

  markComplete(task) {
    fbc.database.public.allRef('tasks').child(task.key).remove()
  }
}
