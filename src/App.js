import React, { Component } from 'react'
import {Navbar, Button, Alignment, Intent} from '@blueprintjs/core'
import CarPanel from './CarPanel'
import RacePanel from './RacePanel'
import SettingsPanel from './SettingsPanel'
import UserPanel from './UserPanel'
import SessionPanel from './SessionPanel'
import './App.css'

class Navigation extends Component {
  constructor (props) {
    super(props)
    this.toCars = this.toCars.bind(this)
    this.toRaces = this.toRaces.bind(this)
    this.toUsers = this.toUsers.bind(this)
    this.toSettings = this.toSettings.bind(this)
    this.toSession = this.toSession.bind(this)

    this.userChange = this.userChange.bind(this)
    this.raceChange = this.raceChange.bind(this)

    this.state = {
      'panelId': 'session',
      'user': null,
      'raceId': ''
    }
  }

  toCars = () => { this.setState({ 'panelId': 'cars' }) }
  toRaces = () => { this.setState({ 'panelId': 'races' }) }
  toUsers = () => { this.setState({ 'panelId': 'users' }) }
  toSettings = () => { this.setState({ 'panelId': 'settings' }) }
  toSession = () => { this.setState({ 'panelId': 'session' }) }

  userChange = (user) => { this.setState({ 'user': user }) }
  raceChange = (raceId) => { this.setState({ 'raceId': raceId }) }

  render () {
    return (
      <React.Fragment>
      <Navbar>
        <Navbar.Group className='navigation'>
          <Navbar.Heading>
            <strong>pwd-racemanager</strong>
          </Navbar.Heading>
          <Navbar.Divider />
          <Button id='cars' onClick={this.toCars} className='navigation-button'
            intent={ this.state.panelId === 'cars' ? Intent.PRIMARY : Intent.NONE }
            disabled={ this.state.user !== null ? false : true}
            large={true} type='button' icon='drive-time' text='Cars' />
          <Button id='races' onClick={this.toRaces} className='navigation-button'
            intent={ this.state.panelId === 'races' ? Intent.PRIMARY : Intent.NONE }
            disabled={ this.state.user !== null ? false : true}
            large={true} type='button' icon='horizontal-bar-chart' text='Races' />
          <Button id='users' onClick={this.toUsers} className='navigation-button'
            intent={ this.state.panelId === 'users' ? Intent.PRIMARY : Intent.NONE }
            disabled={ this.state.user !== null ? false : true}
            large={true} type='button' icon='person' text='Users' />
        </Navbar.Group>
        <Navbar.Group align={Alignment.RIGHT}>
          <Button id='settings' onClick={this.toSettings} className='navigation-button'
            intent={ this.state.panelId === 'settings' ? Intent.PRIMARY : Intent.NONE }
            disabled={ this.state.user !== null ? false : true}
            large={true} type='button' icon='cog' />
          <Button id='session' onClick={this.toSession} className='navigation-button'
            intent={ this.state.panelId === 'session' ? Intent.PRIMARY : Intent.NONE }
            large={true} type='button' icon={ this.state.user ? 'log-out' : 'log-in'} />
        </Navbar.Group>
      </Navbar>
        <CarPanel active={this.state.panelId === 'cars' ? true : false} />
        <RacePanel active={this.state.panelId === 'races' ? true : false}
          onRaceChange={this.raceChange} user={this.state.user} />
        <UserPanel active={this.state.panelId === 'users' ? true : false} />
        <SettingsPanel active={this.state.panelId === 'settings' ? true : false} />
        <SessionPanel active={this.state.panelId === 'session' ? true : false}
          user={this.state.user}
          onUserChange={this.userChange} />
      </React.Fragment>
    )
  }
}

class App extends Component {
  render () {
    return (
      <div className={`App bp3-dark`}>
        <Navigation />
      </div>
    )
  }
}

export default App
