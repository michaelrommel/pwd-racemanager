import React, { Component } from 'react'
import { Button, Intent, H4, H5 } from '@blueprintjs/core'
import { Flex, Box } from 'reflexbox'
import memoizeOne from 'memoize-one'
import axios from 'axios'
import DisplayToast from './DisplayToast'
import Leaderboard from './Leaderboard'

class RaceConductor extends Component {
  constructor (props) {
    super(props)
    this.state = {
      'heats': []
    }
  }

  componentDidMount () {
    console.log('RaceConductor: mounted.')
    this.memoizeGetHeats(this.props.raceToRun, this.props.raceRefreshCounter)
  }

  componentDidUpdate (prevProps, prevState, snapshot) {
    console.log('RaceConductor::componentDidUpdate: state is', this.state)
    this.memoizeGetHeats(this.props.raceToRun, this.props.raceRefreshCounter)
    // checking if currentHeat number changed or the status changed,
    // trigger a new update
    let mustRefresh = false
    if (
      (this.props.displayProps !== undefined &&
      this.props.displayProps !== null &&
      this.props.displayProps.currentHeat !== undefined &&
      this.props.displayProps.currentHeat !== null &&
      prevProps.displayProps !== undefined &&
      prevProps.displayProps !== null &&
      prevProps.displayProps.currentHeat !== undefined &&
      prevProps.displayProps.currentHeat !== null) &&
      (this.props.displayProps.currentHeat.heat !==
      prevProps.displayProps.currentHeat.heat ||
      this.props.displayProps.currentHeat.status !==
      prevProps.displayProps.currentHeat.status)
    ) {
      mustRefresh = true
    }
    if (
      (this.props.displayProps !== undefined &&
      this.props.displayProps !== null &&
      this.props.displayProps.nextHeat !== undefined &&
      this.props.displayProps.nextHeat !== null &&
      prevProps.displayProps !== undefined &&
      prevProps.displayProps !== null &&
      prevProps.displayProps.nextHeat !== undefined &&
      prevProps.displayProps.nextHeat !== null) &&
      (this.props.displayProps.nextHeat.heat !==
      prevProps.displayProps.nextHeat.heat ||
      this.props.displayProps.nextHeat.status !==
      prevProps.displayProps.nextHeat.status)
    ) {
      mustRefresh = true
    }
    if (mustRefresh) {
      console.log('RaceConductor::CDU: heatnumber or status changed, refreshing')
      this.getHeats(this.props.raceToRun)
    }
  }

  memoizeGetHeats = memoizeOne(
    (p) => {
      console.log('RaceConductor::memoizedGetHeats: submitted race is', p)
      this.getHeats(this.props.raceToRun)
    }
  )

  getHeats = async (raceId) => {
    console.log('RaceConductor::getHeats: getting heats from server')
    let heats
    if (raceId === null) {
      // not initialized yet, so return
      return null
    } else {
      // try to get all heats for a race
      try {
        if (!this.props.user) {
          console.log('RaceConductor::getHeats: not logged in, cannot get!')
          throw (new Error('Not Logged In'))
        }
        let config = {
          headers: { 'Authorization': 'Bearer ' + this.props.user.token }
        }
        let response = await axios.get(
          this.props.urlprefix + '/race/heats/' + raceId, config)
        // we got all heats for the race, is an array of objects
        heats = response.data
      } catch (err) {
        console.log('RaceConductor::getHeats: Error getting heats ', err)
        return false
      }
    }
    // store it in the state of this component
    this.setState({ 'heats': heats })
  }

  markNext = async (e) => {
    console.log('RaceConductor::markNext: marking next heat')
    let heatkey = e.currentTarget.id
    if (heatkey === null) {
      // not initialized yet, so return
      return null
    } else {
      // strip prefix
      heatkey = heatkey.slice(5)
      try {
        if (!this.props.user) {
          console.log('RaceConductor::markNext: not logged in, cannot mark!')
          throw (new Error('Not Logged In'))
        }
        let config = {
          headers: { 'Authorization': 'Bearer ' + this.props.user.token }
        }
        let response = await axios.put(
          this.props.urlprefix + '/heat/next/' + heatkey, {}, config)
        if (response) {
          this.showToast('Marked next heat', Intent.SUCCESS,
            'tick-circle', 1000)
        } else {
          this.showToast('Error marking next heat', Intent.DANGER,
            'warning sign', 3000)
        }
        // trigger a refresh of the heats
        this.props.updateCurrentNextHeat()
      } catch (err) {
        console.log('RaceConductor::markNext: Error marking next heat: ', err)
        return false
      }
    }
  }

  initHeat = async (e) => {
    console.log('RaceConductor::initHeat: initializing current heat')
    let heatkey = e.currentTarget.id
    if (heatkey === null) {
      // not initialized yet, so return
      return null
    } else {
      // strip prefix
      heatkey = heatkey.slice(5)
      try {
        if (!this.props.user) {
          console.log('RaceConductor::initHeat: not logged in, cannot mark!')
          throw (new Error('Not Logged In'))
        }
        let config = {
          headers: { 'Authorization': 'Bearer ' + this.props.user.token }
        }
        let response = await axios.put(
          this.props.urlprefix + '/heat/init/' + heatkey, {}, config)
        if (response) {
          this.showToast('Initialized current heat', Intent.SUCCESS,
            'tick-circle', 1000)
        } else {
          this.showToast('Error initializing current heat', Intent.DANGER,
            'warning sign', 3000)
        }
        // trigger a refresh of the heats
        this.props.updateCurrentNextHeat()
      } catch (err) {
        console.log('RaceConductor::initHeat: Error initializing current heat: ', err)
        return false
      }
    }
  }

  startHeat = async (e) => {
    console.log('RaceConductor::startHeat: initializing current heat')
    let heatkey = e.currentTarget.id
    if (heatkey === null) {
      // not initialized yet, so return
      return null
    } else {
      // strip prefix
      heatkey = heatkey.slice(6)
      try {
        if (!this.props.user) {
          console.log('RaceConductor::startHeat: not logged in, cannot mark!')
          throw (new Error('Not Logged In'))
        }
        let config = {
          headers: { 'Authorization': 'Bearer ' + this.props.user.token }
        }
        let response = await axios.put(
          this.props.urlprefix + '/heat/go/' + heatkey, {}, config)
        if (response) {
          this.showToast('Started current heat', Intent.SUCCESS,
            'tick-circle', 1000)
        } else {
          this.showToast('Error starting current heat', Intent.DANGER,
            'warning sign', 3000)
        }
        // trigger a refresh of the heats
        this.props.updateCurrentNextHeat()
      } catch (err) {
        console.log('RaceConductor::startHeat: Error starting current heat: ', err)
        return false
      }
    }
  }

  onSubmit = async (values, actions) => {
    try {
      if (await this.saveRace(values)) {
        this.showToast('Successfully saved the race',
          Intent.SUCCESS, 'tick-circle', 2000)
      } else {
        this.showToast('Failed to save the race',
          Intent.DANGER, 'warning-sign', 5000)
      }
      actions.setSubmitting(false)
    } catch (err) {
      this.showToast('Failed to submit the race',
        Intent.DANGER, 'warning-sign', 5000)
      actions.setSubmitting(false)
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

  render () {
    if (this.state.heats.length === 0) return null

    console.log('RaceConductor: rendering, with displayProps:',
      JSON.stringify(this.props.displayProps, null, 0))
    console.log('RaceConductor: rendering, with state:',
      JSON.stringify(this.state.heats, null, 0))

    const emptyLane = {
      'ow': '-',
      't': 0,
      'score': 0
    }

    return (
      <Flex w={1} p={1}>
        <Box w={2 / 3} p={3}>
          <H4>Heat Controller</H4>
          <div className={'pwd-raceconductorcontainer'}>
            <Flex w={1} column className={'pwd-raceconductor'}>
              <React.Fragment>
                {this.state.heats.map((heat) => {
                  if (this.props.displayProps !== undefined &&
                    this.props.displayProps.currentHeat !== undefined &&
                    this.props.displayProps.currentHeat.heat === heat.heat) {
                    // the currently to be displayed row is more current in the
                    // displayprops, take values from there
                    console.log('RaceConductor: Old current heat: ', heat)
                    heat = { ...heat, ...this.props.displayProps.currentHeat }
                    console.log('RaceConductor: New current heat: ', heat)
                  } else if (this.props.displayProps !== undefined &&
                    this.props.displayProps.nextHeat !== undefined &&
                    this.props.displayProps.nextHeat.heat === heat.heat) {
                    // the currently to be displayed row is more current in the
                    // displayprops, take values from there
                    console.log('RaceConductor: Old next heat: ', heat)
                    heat = { ...heat, ...this.props.displayProps.nextHeat }
                    console.log('RaceConductor: New next heat: ', heat)
                  }

                  // add missing lane information for runs with cars < lanes
                  for (let i = 0; i < 4; i++) {
                    if (heat.results[i] === undefined) {
                      heat.results[i] = { ...emptyLane }
                    }
                  }

                  console.log('Rendering heat: ', heat)
                  return (
                    <Box w={1} my={1} key={heat.heat} className={'pwd-heat'}>
                      <Flex w={1}>
                        <Box w={0.05} p={2}>
                          <H5>{heat.heat}</H5>
                        </Box>
                        <Box w={0.15} px={1} py={2} className={'pwd-gray'}>
                          <H5>{heat.results[0].ow}</H5>
                          <p>{heat.results[0].t} / {heat.results[0].score}</p>
                        </Box>
                        <Box w={0.15} px={1} py={2} className={'pwd-blue'}>
                          <H5>{heat.results[1].ow}</H5>
                          <p>{heat.results[1].t} / {heat.results[1].score}</p>
                        </Box>
                        <Box w={0.15} px={1} py={2} className={'pwd-orange'}>
                          <H5>{heat.results[2].ow}</H5>
                          <p>{heat.results[2].t} / {heat.results[2].score}</p>
                        </Box>
                        <Box w={0.15} px={1} py={2} className={'pwd-berry'}>
                          <H5>{heat.results[3].ow}</H5>
                          <p>{heat.results[3].t} / {heat.results[3].score}</p>
                        </Box>
                        <Box w={0.15} px={1} py={2} className={'pwd-status'}>
                          <H5>{heat.status}</H5>
                        </Box>
                        <Box w={0.20} p={1} className={'pwd-controls'}>
                          <Button className={'formbutton-tight'}
                            onClick={this.markNext}
                            id={'next-' + heat.heatkey}
                            type='button' fill
                            intent={Intent.NONE}
                            icon={'tick-circle'}
                            text={'Mark Next'}
                          />
                          <Button className={'formbutton-tight'}
                            onClick={this.initHeat}
                            id={'init-' + heat.heatkey}
                            type='button' fill
                            intent={Intent.NONE}
                            icon={'confirm'}
                            text={'Init Heat'}
                          />
                          <Button className={'formbutton-tight'}
                            onClick={this.startHeat}
                            id={'start-' + heat.heatkey}
                            type='button' fill
                            intent={Intent.NONE}
                            icon={heat.status === 'just finished'
                              ? 'repeat'
                              : 'play'}
                            text={heat.status === 'just finished'
                              ? 'Repeat Heat'
                              : 'Start Heat'}
                          />
                        </Box>
                      </Flex>
                    </Box>
                  )
                })}
              </React.Fragment>
            </Flex>
          </div>
        </Box>
        <Box w={1 / 3} p={3}>
          <H4>Leaderboard</H4>
          <div align='center'>
            <Leaderboard leaderboard={this.props.displayProps.leaderboard} />
          </div>
        </Box>
      </Flex>
    )
  }
}

export default RaceConductor
