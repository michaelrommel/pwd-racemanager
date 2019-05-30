import React, { Component } from 'react'
import axios from 'axios'
import { Intent } from '@blueprintjs/core'
import Navigation from './Navigation'
import Panels from './Panels'
import DisplayToast from './DisplayToast'
import { rehydrateStateWithLocalStorage, saveStateToLocalStorage } from './localstorageFunctions'
import { getCurrentRace } from './raceFunctions'
import { getLeaderboard } from './leaderboardFunctions'
import { getHighscore } from './highscoreFunctions'
import { getCurrentHeat, getNextHeat } from './heatFunctions'
import './App.css'

class App extends Component {
  constructor (props) {
    super(props)
    // get the environment
    let environment = process.env.REACT_APP_ENVIRONMENT
    let nodeEnv = process.env.NODE_ENV
    this.state = {
      'darktheme': true,
      'environment': environment,
      'urlprefix': (nodeEnv === 'development')
        ? 'https://pwd-racetrack' : '',
      'appState': '',
      'panelId': '',
      'wsconns': [],
      'user': null,
      'raceId': null,
      'currentHeat': null,
      'nextHeat': null,
      'leaderboard': null,
      'highscore': null
    }
  }

  componentDidMount () {
    console.log('App: mounted')
    // rehydrate the state from local storage to initialize the app
    let newState = rehydrateStateWithLocalStorage('app', this.state)
    this.setState(newState)
    // add event listener to save state to localStorage
    // when user leaves/refreshes the page
    window.addEventListener(
      'beforeunload',
      this.saveStateHandler
    )
    // get general configuration of the backend from the network
    this.getAppState()
    // get the current race status from the racetrack
    this.getRacetrackStatus()
    // initialize the websocket communication
    this.initWebsocket(this.updateRacetrackStatus)
  }

  componentWillUnmount () {
    console.log('App will unmount')
    window.removeEventListener(
      'beforeunload',
      this.saveStateHandler
    )
    // saves if component has a chance to unmount
    this.saveStateHandler()
  }

  saveStateHandler = () => {
    saveStateToLocalStorage('app', this.state)
  }

  changeTheme = () => {
    this.setState((state, props) => ({
      'darktheme': !state.darktheme
    }))
  }

  changePanel = (panelId) => { this.setState({ 'panelId': panelId }) }
  changeRace = (raceId) => { this.setState({ 'raceId': raceId }) }
  changeUser = (user) => {
    console.log('App: changing user to: ', user)
    this.setState({ 'user': user })
    this.getAppState()
  }

  getAppState = async () => {
    let settings
    try {
      console.log('App: getting application state: ')
      // try to get the view for anonymous users
      settings = await axios.get(this.state.urlprefix + '/admin/init')
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

  initWebsocket = async (processMessageCallback) => {
    let wsurlprefix = this.state.urlprefix.replace('https', 'wss')
    var ws = new window.WebSocket(wsurlprefix + '/websocket/attach')

    ws.onerror = function (error) {
      console.log('ws error')
      throw (error)
    }

    ws.onclose = function () {
      console.log('ws onclose')
    }

    ws.onopen = function () {
      ws.send('Connection established. Hello server!')
    }

    ws.onmessage = function (msg) {
      console.log(msg)
      if (msg.data) {
        processMessageCallback(msg.data)
      }
    }
  }

  updateRacetrackStatus = (websocketMessage) => {
    const wsmap = {
      'lanestatus': this.mergeLaneStatus,
      'leaderboard': (lb) => { this.setState({ 'leaderboard': lb.data.splice(0, 15) }) },
      'highscore': (hs) => { this.setState({ 'highscore': hs.data.splice(0, 15) }) }
    }
    // we need to parse the message into an object
    let data = JSON.parse(websocketMessage)
    if (data.raceId === this.state.raceId) {
      // the event really relates to this race
      let cb = wsmap[data.type]
      if (cb && typeof cb === 'function') {
        cb(data)
      } else {
        console.log('App::updateRacetrackStatus: stray message of type', data.type)
      }
    } else {
      console.log('App::updateRacetrackStatus: stray message for race', data.raceId)
    }
  }

  mergeLaneStatus = (laneStatus) => {
    console.log(JSON.stringify(laneStatus, null, 2))
    let lanes = this.state.currentHeat
    // now mix in the status information into to original heat info
    for (let i = 0; i < lanes.results.length; i++) {
      for (let j = 0; j < laneStatus.data.lanes.length; j++) {
        if (laneStatus.data.lanes[j].lane === i) {
          // this is the status for the i-th lane
          lanes.results[i].status = laneStatus.data.lanes[j].status
          console.log('Updating lane', j, i)
        }
      }
    }
    this.setState({ 'currentHeat': lanes })
  }

  getRacetrackStatus = async () => {
    // all others depend on this ID
    let raceId = await getCurrentRace(this.state.urlprefix, this.state.user)
    this.setState({ 'raceId': raceId })
    // now can parallelize these requests, use var instead of state
    // as it might have not yet updated due to the async nature of React
    let currentHeat = getCurrentHeat(this.state.urlprefix, this.state.user, raceId)
    let nextHeat = getNextHeat(this.state.urlprefix, this.state.user, raceId)
    let leaderboard = getLeaderboard(this.state.urlprefix, this.state.user, raceId)
    let highscore = getHighscore(this.state.urlprefix, this.state.user, raceId)
    // assemble the state once all promises returned
    let newState = {
      'currentHeat': await currentHeat,
      'nextHeat': await nextHeat,
      'leaderboard': await leaderboard,
      'highscore': await highscore
    }
    // once we have the new state complete, update the state
    this.setState(newState)
  }

  showToast = (msg, intent, icon) => {
    DisplayToast.show({ 'message': msg, 'intent': intent, 'icon': icon })
  }

  render () {
    let displayProps = {
      'currentHeat': this.state.currentHeat,
      'nextHeat': this.state.nextHeat,
      'leaderboard': this.state.leaderboard,
      'highscore': this.state.highscore
    }
    return (
      <div className={`App ${this.state.darktheme ? 'bp3-dark' : ''}`}>
        <Navigation
          className={`pwd-${this.state.environment}`}
          changeTheme={this.changeTheme}
          changePanel={this.changePanel}
          environment={this.state.environment}
          darktheme={this.state.darktheme}
          user={this.state.user}
          panelId={this.state.panelId}
        />
        <Panels
          changeRace={this.changeRace}
          changeUser={this.changeUser}
          panelId={this.state.panelId}
          urlprefix={this.state.urlprefix}
          user={this.state.user}
          raceId={this.state.raceId}
          displayProps={displayProps}
        />
      </div>
    )
  }
}

export default App
