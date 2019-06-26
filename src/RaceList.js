import React, { Component } from 'react'
import { Callout, Elevation, Button, Tag, Intent, H3, H4 } from '@blueprintjs/core'
import { Flex, Box } from 'reflexbox'
import axios from 'axios'
import memoizeOne from 'memoize-one'
import DisplayToast from './DisplayToast'

function RaceCardList (props) {
  const races = props.races
  if (races === undefined ||
    races === null ||
    races.length === 0
  ) return null

  const getIntentFor = (stat) => {
    if (stat === 'out of sync') {
      return Intent.WARNING
    } else if (stat === 'finished') {
      return Intent.NONE
    } else if (stat === 'in sync') {
      return Intent.PRIMARY
    } else if (stat === 'locked') {
      return Intent.DANGER
    } else if (stat === 'running') {
      return Intent.SUCCESS
    }
  }

  let stat

  return (
    <React.Fragment>
      {races.map((race) => {
        stat = Object.values(race)[0].raceStatus
        return (
          <Box p={2} w={1 / 4} key={Object.keys(race)[0]}>
            <Callout
              elevation={Elevation.TWO}
              id={Object.keys(race)[0]}
              onClick={props.editRaceClickHandler}
            >
              <Flex column align={'center'} className={'pwd-racecard'}>
                <Box p={2}>
                  <H3>{Object.keys(race)[0]}</H3>
                  <p><i>{Object.values(race)[0].description}</i></p>
                  <p>Status: &nbsp;
                    <Tag round intent={getIntentFor(stat)}>
                      {Object.values(race)[0].raceStatus}
                    </Tag>
                  </p>
                </Box>
                <Box w={0.7} p={1} className={'pwd-racecarddetails'}>
                  <H4>Number of cars: {Object.values(race)[0].countCars}</H4>
                  <H4>Number of rounds: {Object.values(race)[0].rounds}</H4>
                  <H4>Number of finalists: {Object.values(race)[0].finalists}</H4>
                </Box>
                <Box w={0.7} p={2}>
                  <Button className={'formbutton-tight'}
                    onClick={props.initRaceClickHandler}
                    id={'init-' + Object.keys(race)[0]}
                    type='button'
                    intent={Intent.SUCCESS}
                    large fill
                    icon={'confirm'}
                    text={'Init race'}
                  />
                  <Button className={'formbutton-tight'}
                    onClick={props.runRaceClickHandler}
                    id={'run-' + Object.keys(race)[0]}
                    type='button'
                    intent={Intent.PRIMARY}
                    large fill
                    icon={'play'}
                    text={'Start race'}
                  />
                </Box>
              </Flex>
            </Callout>
          </Box>
        )
      })}
    </React.Fragment>
  )
}

class RaceList extends Component {
  constructor (props) {
    super(props)
    this.state = {
      'races': []
    }
  }

  componentDidMount () {
    console.log('RaceList: mounted.')
    this.memoizeGetRaces(this.props.user, this.props.raceRefreshCounter)
  }

  componentDidUpdate () {
    console.log('RaceList: updated')
    this.memoizeGetRaces(this.props.user, this.props.raceRefreshCounter)
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
      let response = await axios.get(this.props.urlprefix + '/race', config)
      this.setState({ 'races': response.data })
      return true
    } catch (err) {
      console.log('Error getting race list: ', err)
      return false
    }
  }

  initRace = async (raceId) => {
    console.log('RaceList::initRace: initializing race')
    try {
      if (!this.props.user) {
        console.log('RaceList::initRace: not logged in, cannot mark!')
        throw (new Error('Not Logged In'))
      }
      let config = {
        headers: { 'Authorization': 'Bearer ' + this.props.user.token }
      }
      let response = await axios.post(
        this.props.urlprefix + '/race/init/' + raceId, {}, config)
      if (response) {
        this.showToast('Initialized race', Intent.SUCCESS,
          'tick-circle', 1000)
      } else {
        this.showToast('Error initializing race', Intent.DANGER,
          'warning sign', 3000)
      }
    } catch (err) {
      console.log('RaceList::initRace: Error initializing race: ', err)
      return false
    }
  }

  showToast = (msg, intent, icon, timeout) => {
    DisplayToast.show({
      'message': msg,
      'intent': intent,
      'icon': icon,
      'timeout': timeout
    })
  }

  editRaceClickHandler = (e) => {
    console.log(e.currentTarget.id)
    this.props.openRaceInEditpanel(e.currentTarget.id)
  }

  runRaceClickHandler = (e) => {
    console.log(e.currentTarget.id)
    this.props.openRaceInRunpanel(e.currentTarget.id.slice(4))
    e.stopPropagation()
  }

  initRaceClickHandler = (e) => {
    console.log(e.currentTarget.id)
    if (e.currentTarget.id !== undefined) {
      this.initRace(e.currentTarget.id.slice(5))
    }
    e.stopPropagation()
  }

  render () {
    return (
      <React.Fragment>
        <Flex justify='flex-start' wrap>
          <RaceCardList
            races={this.state.races}
            editRaceClickHandler={this.editRaceClickHandler}
            runRaceClickHandler={this.runRaceClickHandler}
            initRaceClickHandler={this.initRaceClickHandler}
          />
        </Flex>
      </React.Fragment>
    )
  }
}

export default RaceList
