import React, { Component } from 'react'
import { Button, Intent } from '@blueprintjs/core'
import { Flex, Box } from 'reflexbox'
import RaceList from './RaceList'
import RaceEditor from './RaceEditor'
import RaceConductor from './RaceConductor'

class RacePanel extends Component {
  constructor (props) {
    super(props)
    this.state = {
      'briefRaces': [],
      'subPanel': 'racelist',
      'raceToEdit': null
    }
  }

  switchSubPanel = (panel) => {
    this.setState({ 'subPanel': panel })
  }

  switchToRacelist = () => {
    this.switchSubPanel('racelist')
  }

  openRaceInEditpanel = (id) => {
    // component is instantiated with raceToEdit = null
    // only if this function is called then the state is changed
    // and propagated to the edit window. As soon as ....
    // is finished, the state is reset to null and the edit window
    // can function as new edit panel again
    this.props.incrementRaceRefresh()
    this.setState({
      'raceToEdit': id,
      'subPanel': 'editrace'
    })
  }

  openRaceInRunpanel = (id) => {
    this.setState({
      'raceToEdit': id,
      'subPanel': 'runrace'
    })
  }

  subPanelStyle = (subPanelName) => {
    return (this.state.subPanel === subPanelName)
      ? {}
      : { 'display': 'none' }
  }

  render () {
    const panelActive = this.props.active ? {} : { 'display': 'none' }

    return (
      <div className='racepanel' style={panelActive}>
        <div className='racelist' style={this.subPanelStyle('racelist')}>
          <Flex w={1} p={0}>
            <Box w={1}>
              <RaceList
                user={this.props.user}
                urlprefix={this.props.urlprefix}
                refreshToggle={this.props.refreshToggle}
                openRaceInEditpanel={this.openRaceInEditpanel}
                openRaceInRunpanel={this.openRaceInRunpanel}
                raceRefreshCounter={this.props.raceRefreshCounter}
                incrementRaceRefresh={this.props.incrementRaceRefresh}
              />
            </Box>
          </Flex>
        </div>
        <div className='editrace' style={this.subPanelStyle('editrace')}>
          <Flex w={1} p={0} column>
            <Box p={2}>
              <Button className={'formbutton-tight'}
                onClick={this.switchToRacelist}
                type='button'
                intent={Intent.NONE}
                large
                icon={'chevron-left'}
                text={'Back to race list'}
              />
            </Box>
            <Box w={1}>
              <RaceEditor
                user={this.props.user}
                urlprefix={this.props.urlprefix}
                raceToEdit={this.state.raceToEdit}
                raceRefreshCounter={this.props.raceRefreshCounter}
                incrementRaceRefresh={this.props.incrementRaceRefresh}
                openRaceInEditpanel={this.openRaceInEditpanel}
              />
            </Box>
          </Flex>
        </div>
        <div className='runrace' style={this.subPanelStyle('runrace')}>
          <Flex w={1} p={0} column>
            <Box p={2}>
              <Button className={'formbutton-tight'}
                onClick={this.switchToRacelist}
                type='button'
                intent={Intent.NONE}
                large
                icon={'chevron-left'}
                text={'Back to race list'}
              />
            </Box>
            <Box w={1}>
              <RaceConductor
                raceToRun={this.state.raceToEdit}
                user={this.props.user}
                displayProps={this.props.displayProps}
                urlprefix={this.props.urlprefix}
                updateCurrentNextHeat={this.props.updateCurrentNextHeat}
                raceRefreshCounter={this.props.raceRefreshCounter}
              />
            </Box>
          </Flex>
        </div>
      </div>
    )
  }
}

export default RacePanel
