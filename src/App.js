import React, { Component } from 'react'
import { Intent } from '@blueprintjs/core'
import axios from 'axios'
import ReconnectingWebSocket from 'reconnecting-websocket'
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
    let reactAppVersion = process.env.REACT_APP_VERSION || ''
    let nodeEnv = process.env.NODE_ENV || ''
    this.state = {
      'darktheme': true,
      'version': reactAppVersion,
      'environment': nodeEnv,
      'urlprefix': (nodeEnv === 'development')
        ? 'https://pwd-racetrack.michaelrommel.com'
        : window.location.protocol + '//' + window.location.hostname,
      'appState': '',
      'panelId': '',
      'wsconns': [],
      'user': null,
      'scaleIp': '123',
      'raceId': null,
      'currentHeat': null,
      'nextHeat': null,
      'leaderboard': null,
      'highscore': null
    }
    this.dontrestore = [
      'environment',
      'urlprefix'
    ]
  }

  componentDidMount () {
    console.log('App: mounted')
    // rehydrate the state from local storage to initialize the app
    let newState = rehydrateStateWithLocalStorage('app', this.state)
    for (let key of this.dontrestore) {
      delete newState[key]
    }
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
  changeScaleIp = (scaleIp) => { this.setState({ 'scaleIp': scaleIp }) }
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
    const wsurlprefix = this.state.urlprefix.replace('https', 'wss')
    const config = {
      connectionTimeout: 2000,
      minreconnectionDelay: 250,
      maxReconnectionDelay: 10000,
      reconnectionDelayGrowFactor: 1.3,
      maxRetries: Infinity,
      debug: false
    }
    var ws = new ReconnectingWebSocket(wsurlprefix + '/websocket/attach', [], config)

    ws.onerror = function (error) {
      console.log('App::websocket::onerror: websocket error reported:', error)
    }

    ws.onclose = function () {
      console.log('App::websocket::onclose: server closed websocket connection')
    }

    ws.onopen = function () {
      console.log('App::websocket::onopen: established connection to websocket server')
      ws.send('pwd-racemananager attached!')
    }

    ws.onmessage = function (msg) {
      console.log('App::websocket::onmessage: received message from websocket server', msg)
      if (msg.data) {
        processMessageCallback(msg.data)
      }
    }
  }

  updateRacetrackStatus = (websocketData) => {
    // this is a map of functions to call, when a particular message arrives
    const wsmap = {
      'lanestatus': this.mergeLaneStatus,
      'currentheat': this.mergeHeat,
      'nextheat': (nh) => { this.setState({ 'nextHeat': nh.data }) },
      'leaderboard': (lb) => { this.setState({ 'leaderboard': lb.data.splice(0, 20) }) },
      'highscore': (hs) => { this.setState({ 'highscore': hs.data.splice(0, 20) }) }
    }
    // we need to parse the message into an object
    let data = JSON.parse(websocketData)
    if (data.raceId === this.state.raceId) {
      // the event really relates to this race
      let cb = wsmap[data.type]
      if (cb && typeof cb === 'function') {
        console.log('App::updateRacetrackStatus: setting data from ws message of type', data.type)
        cb(data)
      } else {
        console.log('App::updateRacetrackStatus: stray message of type', data.type)
      }
    } else {
      console.log('App::updateRacetrackStatus: stray or malformed message:', data)
    }
  }

  mergeHeat = (heat) => {
    console.log(JSON.stringify(heat, null, 2))
    let lanes = this.state.currentHeat
    if (lanes === undefined || lanes === null) return
    // now mix in the status information into to original heat info
    for (let i = 0; i < lanes.results.length; i++) {
      Object.assign(lanes.results[i], heat.data.results[i])
    }
    lanes.status = heat.data.status
    lanes.heat = heat.data.heat
    this.setState({ 'currentHeat': lanes })
  }

  mergeLaneStatus = (laneStatus) => {
    console.log(JSON.stringify(laneStatus, null, 2))
    if (laneStatus.data.heat !== this.state.currentHeat.heat) {
      console.log('ignoring lane status for not current heat, racetrack out of sync')
      return
    }
    let lanes = this.state.currentHeat
    if (lanes === undefined || lanes === null) return
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
    lanes.status = laneStatus.data.status
    this.setState({ 'currentHeat': lanes })
  }

  getRacetrackStatus = async () => {
    // all others depend on this ID
    let raceId = await getCurrentRace(this.state.urlprefix, this.state.user)
    this.setState({ 'raceId': raceId })
    // now can parallelize these requests, use var instead of state
    // as it might have not yet updated due to the async nature of React
    console.log('App::getRacetrackStatus: getting current heat')
    let currentHeat = getCurrentHeat(this.state.urlprefix, this.state.user, raceId)
    console.log('App::getRacetrackStatus: getting next heat')
    let nextHeat = getNextHeat(this.state.urlprefix, this.state.user, raceId)
    console.log('App::getRacetrackStatus: getting leaderboard')
    let leaderboard = getLeaderboard(this.state.urlprefix, this.state.user, raceId)
    console.log('App::getRacetrackStatus: getting highscore')
    let highscore = getHighscore(this.state.urlprefix, this.state.user, raceId)
    // assemble the state once all promises returned
    let newState = {
      'currentHeat': await currentHeat,
      'nextHeat': await nextHeat || [],
      'leaderboard': await leaderboard,
      'highscore': await highscore
    }
    console.log('App::getRacetrackStatus: got racetrack status, setting state')
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
          changeScaleIp={this.changeScaleIp}
          panelId={this.state.panelId}
          urlprefix={this.state.urlprefix}
          user={this.state.user}
          raceId={this.state.raceId}
          scaleIp={this.state.scaleIp}
          displayProps={displayProps}
        />
      </div>
    )
  }
}

export default App
