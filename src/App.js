import React, { Component } from 'react'
import {Tab, Tabs, H3} from '@blueprintjs/core'
import SettingsPanel from './SettingsPanel'
import './App.css'

const DevicesPanel = () => (
  <div className='devicespanel'>
    <H3>Devices</H3>
    <p className='deviceslist'>
      Here is a list of all registered devices.
    </p>
  </div>
)

const UsersPanel = () => (
  <div className='userpanel'>
    <H3>Users</H3>
    <p className='userslist'>
      Here is a list of all configured users.
    </p>
  </div>
)

class Tablist extends Component {
  constructor (props) {
    super(props)
    this.handleTabChange = this.handleTabChange.bind(this)
    this.state = {
      tabId: 'devices'
    }
  }

  handleTabChange (newTabId) {
    this.setState(
      {
        tabId: newTabId
      }
    )
  }

  render () {
    return (
      <Tabs id='tablist' animate onChange={this.handleTabChange} selectedTabId={this.state.tabId}>
        <Tab id='devices' title='Devices' panel={<DevicesPanel />} />
        <Tab id='users' title='Users' panel={<UsersPanel />} />
        <Tab id='settings' title='Settings' panel={<SettingsPanel />} />
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
