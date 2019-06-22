import React, { Component } from 'react'
import { Flex } from 'reflexbox'
import axios from 'axios'
import memoizeOne from 'memoize-one'
import CarCardList from './CarCardList'

class CarList extends Component {
  constructor (props) {
    super(props)
    this.state = {
      'briefCars': []
    }
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
        return false
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
      return true
    } catch (err) {
      console.log('CarList::getCars: Error getting car list: ', err)
      return false
    }
  }

  carClickHandler = (e) => {
    console.log(e.currentTarget.id)
    this.props.openCarInEditpanel(e.currentTarget.id)
  }

  render () {
    return (
      <React.Fragment>
        <Flex justify='flex-start' wrap>
          <CarCardList
            columns={this.props.columns}
            cars={this.state.briefCars}
            carClickHandler={this.carClickHandler}
          />
        </Flex>
      </React.Fragment>
    )
  }
}

export default CarList
