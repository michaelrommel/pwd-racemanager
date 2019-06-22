import React, { Component } from 'react'
import { Card, Elevation, H3 } from '@blueprintjs/core'
import { Flex, Box } from 'reflexbox'
import axios from 'axios'
import memoizeOne from 'memoize-one'

function RaceCardList (props) {
  const races = props.races
  if (races === undefined ||
    races === null ||
    races.length === 0
  ) return null

  return (
    <React.Fragment>
      {races.map((race) =>
        <Box p={2} w={1 / 3} key={race[0]}>
          <Card
            elevation={Elevation.TWO}
            id={race[0]}
            interactive
            onClick={props.raceClickHandler}>
            <H3>{race[0]}</H3>
            <p>{race[1]}</p>
          </Card>
        </Box>
      )}
    </React.Fragment>
  )
}

class RaceList extends Component {
  constructor (props) {
    super(props)
    this.state = {
      'briefRaces': []
    }
  }

  componentDidMount () {
    console.log('RaceList: mounted.')
    this.memoizeGetRaces(this.props.user, this.props.refreshToggle)
  }

  componentDidUpdate () {
    console.log('RaceList: updated')
    this.memoizeGetRaces(this.props.user, this.props.refreshToggle)
    console.log('RaceList::componentDidUpdate: briefRaces is', this.state.briefRaces)
  }

  memoizeGetRaces = memoizeOne(
    (p) => {
      console.log('RaceList::memoizedGetRaces: props are', p)
      this.getRaces()
    }
  )

  getRaces = async () => {
    console.log('RaceList::getRaces: getting races from server')
    try {
      if (!this.props.user) {
        console.log('RaceList::getRaces: not logged in, cannot get!')
        return false
      }
      let config = {
        headers: { 'Authorization': 'Bearer ' + this.props.user.token }
      }
      let races = await axios.get(
        this.props.urlprefix + '/race', config)
      // we got an array of race objects
      const briefRaces = races.data.map((race) =>
        [
          Object.keys(race)[0],
          race[Object.keys(race)[0]].description
        ]
      )
      this.setState({ briefRaces })
      return true
    } catch (err) {
      console.log('Error getting race list: ', err)
      return false
    }
  }

  raceClickHandler = (e) => {
    console.log(e.currentTarget.id)
    this.props.openRaceInEditpanel(e.currentTarget.id)
  }

  render () {
    return (
      <React.Fragment>
        <Flex justify='flex-start' wrap>
          <RaceCardList
            races={this.state.briefRaces}
            raceClickHandler={this.raceClickHandler}
          />
        </Flex>
      </React.Fragment>
    )
  }
}

export default RaceList
