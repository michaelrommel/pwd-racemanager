import React, { Component } from 'react'
import { Tag, Intent, Card, Elevation } from '@blueprintjs/core'
import { Flex, Box } from 'reflexbox'
import axios from 'axios'
import memoizeOne from 'memoize-one'
import { getCodeForName } from './iso3166.js'

function CarCardList (props) {
  const cars = props.cars
  if (cars === undefined ||
    cars === null ||
    cars.length === 0
  ) return null

  let tags

  return (
    <React.Fragment>
      {cars.map((car) => {
        let code = getCodeForName(car[2])
        if (car[3]) {
          tags = car[3].map(
            (tag) => <Tag round intent={Intent.PRIMARY}>{tag}</Tag>)
        } else {
          tags = ''
        }
        return (
          <Box p={1} w={1 / 3} key={car[0]}>
            <Card key={car[0]} elevation={Elevation.TWO}>
              <Flex w={1} p={0}>
                <Box>
                  <i className={'flag-icons ' + code} />
                </Box>
                <Box px={1}>
                  <strong>{car[1]}</strong>
                  <p>{car[2]}</p>
                  <p>{car[0]}</p>
                  {tags}
                </Box>
              </Flex>
            </Card>
          </Box>
        )
      })}
    </React.Fragment>
  )
}

class CarList extends Component {
  constructor (props) {
    super(props)
    this.state = {
      'briefCars': []
    }
    // this.getRaces = this.getRaces.bind(this)
  }

  componentDidMount () {
    console.log('CarList: mounted.')
    this.memoizeGetCars(this.props.user, this.props.refreshToggle)
  }

  componentDidUpdate () {
    console.log('CarList: updated')
    this.memoizeGetCars(this.props.user, this.props.refreshToggle)
    console.log('CarList::componentDidUpdate: briefCars is', this.state.briefCars)
  }

  memoizeGetCars = memoizeOne(
    (p) => {
      console.log('CarList::memoizedGetCars: props are', p)
      this.getCars()
    }
  )

  getCars = async () => {
    console.log('CarList::getCars: getting cars from server')
    try {
      if (!this.props.user) {
        console.log('CarList::getCars: not logged in, cannot get!')
        return
      }
      let config = {
        headers: { 'Authorization': 'Bearer ' + this.props.user.token }
      }
      let response = await axios.get(
        this.props.urlprefix + '/car', config)
      // we got an array of car objects in response.data
      const briefCars = response.data.map((car) =>
        [
          Object.keys(car)[0],
          car[Object.keys(car)[0]].name,
          car[Object.keys(car)[0]].country,
          car[Object.keys(car)[0]].races
        ]
      )
      this.setState({ 'briefCars': briefCars })
      // the return status doesn't really matter
      return true
    } catch (err) {
      console.log('CarList::getCars:eError getting car list: ', err)
      // the return status doesn't really matter
      return false
    }
  }

  render () {
    return (
      <React.Fragment>
        <Flex justify='flex-start' wrap>
          <CarCardList cars={this.state.briefCars} />
        </Flex>
      </React.Fragment>
    )
  }
}

export default CarList
