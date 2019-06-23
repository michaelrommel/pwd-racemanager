import React, { Component } from 'react'
import { Button, Intent } from '@blueprintjs/core'
import { Flex, Box } from 'reflexbox'
import RaceList from './RaceList'
import RaceEditor from './RaceEditor'

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
    this.props.toggleRaceRefresh()
    this.setState({
      'raceToEdit': id,
      'subPanel': 'editrace'
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
                refreshToggle={this.props.refreshToggle}
                openRaceInEditpanel={this.openRaceInEditpanel}
              />
            </Box>
          </Flex>
        </div>
      </div>
    )
  }
}

export default RacePanel
