import React, { Component } from 'react'
import {Tab, Tabs} from '@blueprintjs/core'
import CarPanel from './CarPanel'
import RacePanel from './RacePanel'
import SettingsPanel from './SettingsPanel'
import UserPanel from './UserPanel'
import SessionPanel from './SessionPanel'
import './App.css'

class Tablist extends Component {
  constructor (props) {
    super(props)
    this.handleTabChange = this.handleTabChange.bind(this)
    this.state = {
      'tabId': 'session',
      'user': ''
    }
  }

  handleTabChange (newTabId) {
    this.setState(
      {
        'tabId': newTabId
      }
    )
  }

  render () {
    return (
      <Tabs id='tablist' animate onChange={this.handleTabChange} selectedTabId={this.state.tabId}>
        <Tab id='cars' disabled title='Cars' panel={<CarPanel />} />
        <Tab id='races' disabled title='Races' panel={<RacePanel />} />
        <Tab id='settings' disabled title='Settings' panel={<SettingsPanel />} />
        <Tab id='users' disabled title='Users' panel={<UserPanel />} />
        <Tab id='session' title='Session' panel={<SessionPanel user={this.state.user} />} />
      </Tabs>
    )
  }
}

class App extends Component {
  render () {
    return (
      <div className={`App bp3-dark`}>
        <Tablist />
      </div>
    )
  }
}

export default App
