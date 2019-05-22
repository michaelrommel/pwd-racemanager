import React, { Component } from 'react'
import {Navbar, Tab, Tabs, Button, Alignment, Intent} from '@blueprintjs/core'
import {Flex, Box} from 'reflexbox'
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
      <React.Fragment>
      <Navbar>
        <Navbar.Group>
          <Navbar.Heading>
            pwd-racemanager
          </Navbar.Heading>
          <Navbar.Divider />
          <Button id='car' onClick={this.handlePanelChange} icon='drive-time' text='Cars' />
          <Button id='race' onClick={this.handlePanelChange} icon='horizontal-bar-chart' text='Race' />
          <Button id='users' onClick={this.handlePanelChange} icon='person' text='Users' />
        </Navbar.Group>
        <Navbar.Group align={Alignment.RIGHT}>
          <Button id='settings' onClick={this.handlePanelChange} icon='cog' />
          <Button id='session' intent={Intent.PRIMARY} onClick={this.handlePanelChange} icon='log-in' />
        </Navbar.Group>
      </Navbar>
        <CarPanel />
        <RacePanel />
        <UserPanel />
        <SettingsPanel />
        <SessionPanel active />
      </React.Fragment>
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
