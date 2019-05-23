import React, { Component } from 'react'
import { Card, Button, Intent, Icon, H3 } from '@blueprintjs/core'
import { Flex, Box } from 'reflexbox';
import axios from 'axios'

function RaceCardList (props) {
  const races = props.races
  if (races === undefined || races === null) return null
  return (
    <>
      {races.map((race) => 
        <Box p={2} w={1/3} key={race[0]}>
          <Card key={race[0]}>
            <H3>{race[0]}</H3>
            <p>{race[1]}</p>
          </Card>
        </Box>
      )}
    </>
  )
}


class RacePanel extends Component {
  constructor (props) {
    super(props)
    this.state = {
      'shortRaces': []
    }
    this.getRaces = this.getRaces.bind(this)
  }

  getRaces = async () => {
    try {
      let config = {
            headers: {'Authorization': 'Bearer ' + this.props.user.token}
      };
      let races = await axios.get('https://pwd-racetrack/race', config)
      // we got an array of race objects
      const shortRaces = races.data.map((race)=>[Object.keys(race)[0],race[Object.keys(race)[0]].description])
      this.setState({ shortRaces })
    } catch (err) {
      console.log('Error getting race list: ', err)
    }
  }

  render () {
    const panelActive = this.props.active ? {} : {'display': 'none'}

    return (
      <React-Fragment>
      <Flex justify='center' className='racelistbutton' style={panelActive}>
        <Box p={2}>
          <Button id='getraces' onClick={this.getRaces}
            intent={ this.state.panelId === 'cars' ? Intent.PRIMARY : Intent.NONE }
            large={true} type='button' icon='refresh' text='Get list of races' />
        </Box>
      </Flex>
      <Flex justify='center' className='racepanel' style={panelActive}>
        <RaceCardList races={this.state.shortRaces} />
      </Flex>
    </React-Fragment>
    )
  }
}

export default RacePanel
