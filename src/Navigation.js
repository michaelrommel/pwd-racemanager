import React, { Component } from 'react'
import { Switch, Navbar, Button, Alignment, Intent } from '@blueprintjs/core'
import axios from 'axios'
import CarPanel from './CarPanel'
import RacePanel from './RacePanel'
import SettingsPanel from './SettingsPanel'
import UserPanel from './UserPanel'
import DisplayPanel from './DisplayPanel'
import SessionPanel from './SessionPanel'
import { DisplayToast } from './DisplayToast'

class Navigation extends Component {
  constructor (props) {
    super(props)

    this.state = {
      'panelId': '',
      'appState': '',
      'user': null,
      'raceId': ''
    }
  }

  componentDidMount () {
    console.log('App: mounted')
    // rehydrate the state from local storage to initialize the app
    this.rehydrateStateWithLocalStorage()
    // get general configuration of the backend from the network
    this.getAppSettings()
    // add event listener to save state to localStorage
    // when user leaves/refreshes the page
    window.addEventListener(
      'beforeunload',
      this.saveStateToLocalStorage.bind(this)
    )
  }

  componentWillUnmount () {
    window.removeEventListener(
      'beforeunload',
      this.saveStateToLocalStorage.bind(this)
    )
    // saves if component has a chance to unmount
    this.saveStateToLocalStorage()
  }

  rehydrateStateWithLocalStorage () {
    // for all items in state
    for (let key in this.state) {
      // if the key exists in localStorage
      if (window.localStorage.hasOwnProperty(key)) {
        // get the key's value from localStorage
        let value = window.localStorage.getItem(key)
        // parse the localStorage string and setState
        try {
          value = JSON.parse(value)
          this.setState({ [key]: value })
        } catch (e) {
          // handle empty string
          throw (e)
        }
      }
    }
  }

  saveStateToLocalStorage () {
    // for every item in React state
    for (let key in this.state) {
      // save to localStorage
      window.localStorage.setItem(key, JSON.stringify(this.state[key]))
    }
  }

  // helper functions to switch between panels
  toCars = () => { this.setState({ 'panelId': 'cars' }) }
  toRaces = () => { this.setState({ 'panelId': 'races' }) }
  toUsers = () => { this.setState({ 'panelId': 'users' }) }
  toDisplay = () => { this.setState({ 'panelId': 'display' }) }
  toSettings = () => { this.setState({ 'panelId': 'settings' }) }
  toSession = () => { this.setState({ 'panelId': 'session' }) }

  // current race is stored in this state
  raceChange = (raceId) => { this.setState({ 'raceId': raceId }) }

  // when changing the user, we need to re-initialize the app
  userChange = (user) => {
    console.log('App: changing user to: ', user)
    this.setState({ 'user': user })
    this.getAppSettings()
  }

  async getAppSettings () {
    let settings
    try {
      console.log('App: getting application settings: ')
      let config
      if (this.state.user) {
        // a user already logged in, use the user token
        config = {
          headers: { 'Authorization': 'Bearer ' + this.state.user.token }
        }
        settings = await axios.get('https://pwd-racetrack/admin/settings', config)
      } else {
        // try to get the view for anonymous users
        settings = await axios.get('https://pwd-racetrack/admin/init')
      }
      console.log('App: got application state: ', settings)
      this.setState({ 'appState': settings.data.appState })
    } catch (err) {
      console.log('App: Error getting application state: ', err)
      settings = {
        data: {
          'appState': undefined
        }
      }
      this.showToast('Network error while getting app settings.', Intent.DANGER, 'warning-sign')
    }
    if (settings.data.appState === 'fresh') {
      // we should forcefully redirect the user to the settings page
      // in order to change the root password
      console.log('App: Directing the user to settings for configuring the fresh install')
      this.setState({ 'panelId': 'settings' })
    } else if (!this.state.user) {
      console.log('App: No current user, direct to login page')
      this.setState({ 'panelId': 'session' })
    }
  }

  showToast = (msg, intent, icon) => {
    // create toasts in response to interactions.
    // in most cases, it's enough to simply create and forget (thanks to timeout).
    DisplayToast.show({ 'message': msg, 'intent': intent, 'icon': icon })
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
              intent={this.state.panelId === 'cars' ? Intent.PRIMARY : Intent.NONE}
              disabled={!this.state.user}
              large={false} type='button' icon='drive-time' text='Cars' />
            <Button id='races' onClick={this.toRaces} className='navigation-button'
              intent={this.state.panelId === 'races' ? Intent.PRIMARY : Intent.NONE}
              disabled={!this.state.user}
              large={false} type='button' icon='horizontal-bar-chart' text='Races' />
            <Button id='users' onClick={this.toUsers} className='navigation-button'
              intent={this.state.panelId === 'users' ? Intent.PRIMARY : Intent.NONE}
              disabled={!this.state.user}
              large={false} type='button' icon='person' text='Users' />
            <Navbar.Divider />
            <Button id='display' onClick={this.toDisplay} className='navigation-button'
              intent={this.state.panelId === 'display' ? Intent.PRIMARY : Intent.WARNING}
              large={false} type='button' icon='grouped-bar-chart' text='Display' />
          </Navbar.Group>
          <Navbar.Group align={Alignment.RIGHT}>
            <Switch checked={this.props.darktheme} inline label='Dark'
              onChange={this.props.changeTheme} />
            <Button id='settings' onClick={this.toSettings} className='navigation-button'
              intent={this.state.panelId === 'settings' ? Intent.PRIMARY : Intent.NONE}
              disabled={!this.state.user && this.state.appState !== 'fresh'}
              large={false} type='button' icon='cog' />
            <Button id='session' onClick={this.toSession} className='navigation-button'
              intent={this.state.panelId === 'session' ? Intent.PRIMARY : Intent.NONE}
              large={false} type='button' icon={this.state.user ? 'log-out' : 'log-in'} />
          </Navbar.Group>
        </Navbar>
        <CarPanel active={this.state.panelId === 'cars'}
          user={this.state.user} />
        <RacePanel active={this.state.panelId === 'races'}
          user={this.state.user} race={this.state.raceId}
          onRaceChange={this.raceChange} />
        <UserPanel active={this.state.panelId === 'users'}
          user={this.state.user} />
        <DisplayPanel active={this.state.panelId === 'display'}
          user={this.state.user} />
        <SettingsPanel active={this.state.panelId === 'settings'}
          user={this.state.user}
          onUserChange={this.userChange} />
        <SessionPanel active={this.state.panelId === 'session'}
          user={this.state.user}
          onUserChange={this.userChange} />
      </React.Fragment>
    )
  }
}

export default Navigation
