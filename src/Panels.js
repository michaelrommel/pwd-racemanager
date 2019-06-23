import React, { Component } from 'react'
import CarPanel from './CarPanel'
import RacePanel from './RacePanel'
import UserPanel from './UserPanel'
import DisplayPanel from './DisplayPanel'
import SettingsPanel from './SettingsPanel'
import SessionPanel from './SessionPanel'
import { rehydrateStateWithLocalStorage, saveStateToLocalStorage } from './localstorageFunctions'

class Panels extends Component {
  componentDidMount () {
    console.log('Panels: mounted')
    // rehydrate the state from local storage to initialize the app
    rehydrateStateWithLocalStorage('panels', this.state)
    // add event listener to save state to localStorage
    // when user leaves/refreshes the page
    window.addEventListener(
      'beforeunload',
      this.saveStateHandler
    )
  }

  componentWillUnmount () {
    window.removeEventListener(
      'beforeunload',
      this.saveStateHandler
    )
    // saves if component has a chance to unmount
    this.saveStateHandler()
  }

  saveStateHandler = () => {
    saveStateToLocalStorage('panels', this.state)
  }

  render () {
    return (
      <React.Fragment>
        <CarPanel active={this.props.panelId === 'cars'}
          urlprefix={this.props.urlprefix}
          user={this.props.user}
          raceId={this.props.raceId}
          toggleRaceRefresh={this.props.toggleRaceRefresh}
          scaleIp={this.props.scaleIp} />
        <RacePanel active={this.props.panelId === 'races'}
          urlprefix={this.props.urlprefix}
          user={this.props.user}
          raceId={this.props.raceId}
          toggleRaceRefresh={this.props.toggleRaceRefresh}
          raceRefreshToggle={this.props.raceRefreshToggle}
          onRaceChange={this.props.changeRace} />
        <UserPanel active={this.props.panelId === 'users'}
          urlprefix={this.props.urlprefix}
          user={this.props.user} />
        <DisplayPanel active={this.props.panelId === 'display'}
          urlprefix={this.props.urlprefix}
          user={this.props.user}
          raceId={this.props.raceId}
          displayProps={this.props.displayProps} />
        <SettingsPanel active={this.props.panelId === 'settings'}
          urlprefix={this.props.urlprefix}
          user={this.props.user}
          scaleIp={this.props.scaleIp}
          changeScaleIp={this.props.changeScaleIp}
          changeUser={this.props.changeUser} />
        <SessionPanel active={this.props.panelId === 'session'}
          urlprefix={this.props.urlprefix}
          user={this.props.user}
          changeUser={this.props.changeUser} />
      </React.Fragment>
    )
  }
}

export default Panels
