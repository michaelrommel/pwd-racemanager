import React, { Component } from 'react'
import {Navbar, Button, Alignment, Intent} from '@blueprintjs/core'
import axios from 'axios'
import CarPanel from './CarPanel'
import RacePanel from './RacePanel'
import SettingsPanel from './SettingsPanel'
import UserPanel from './UserPanel'
import SessionPanel from './SessionPanel'
import './App.css'

class Navigation extends Component {
  constructor (props) {
    super(props)

    this.state = {
      'panelId': 'session',
      'appState': '',
      'user': null,
      'raceId': ''
    }
  }

  toCars = () => { this.setState({ 'panelId': 'cars' }) }
  toRaces = () => { this.setState({ 'panelId': 'races' }) }
  toUsers = () => { this.setState({ 'panelId': 'users' }) }
  toSettings = () => { this.setState({ 'panelId': 'settings' }) }
  toSession = () => { this.setState({ 'panelId': 'session' }) }

  raceChange = (raceId) => { this.setState({ 'raceId': raceId }) }
  
  userChange = (user) => { 
    console.log('changing user to: ', user)
    this.setState({ 'user': user })
  }

  componentDidMount() {
    console.log('App mounted')
    this.getAppSettings()
  }

  async getAppSettings() {
    let settings
    try {
      console.log('App: getting application settings: ')
      let config
      if (this.state.user) {
        // a user already logged in, use the user token
        config = {
          headers: {'Authorization': 'Bearer ' + this.state.user.token}
        };
        settings = await axios.get('https://pwd-racetrack/admin/settings', config)
      } else {
        // try to get the view for anonymous users
        settings = await axios.get('https://pwd-racetrack/admin/init')
      }
      console.log('App: got application state: ', settings)
      this.setState({ 'appState': settings.data.appState })
    } catch (err) {
      console.log('Error getting application state: ', err)
      settings.data.appState = undefined
    }
    console.log('Setting the active panel')
    this.setState({ 'panelId': (settings.data.appState === 'fresh') ? 'settings' : 'session' })
  }

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
              disabled={ this.state.user !== null || this.state.appState === 'fresh' ? false : true}
              large={true} type='button' icon='cog' />
            <Button id='session' onClick={this.toSession} className='navigation-button'
              intent={ this.state.panelId === 'session' ? Intent.PRIMARY : Intent.NONE }
              large={true} type='button' icon={ this.state.user ? 'log-out' : 'log-in'} />
          </Navbar.Group>
        </Navbar>
        <CarPanel active={this.state.panelId === 'cars' ? true : false}
          user={this.state.user} />
        <RacePanel active={this.state.panelId === 'races' ? true : false}
          user={this.state.user}
          onRaceChange={this.raceChange} />
        <UserPanel active={this.state.panelId === 'users' ? true : false}
          user={this.state.user} />
        <SettingsPanel active={this.state.panelId === 'settings' ? true : false}
          user={this.state.user}
          onUserChange={this.userChange} />
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
