import React, { Component } from 'react'
import axios from 'axios'
import memoizeOne from 'memoize-one'
import SelectableCarCardList from './SelectableCarCardList'

class RemainingCarPool extends Component {
  constructor (props) {
    super(props)
    this.state = {
      carDetails: {}
    }
  }

  componentDidMount () {
    console.log('RemainingCarPool: mounted.')
    this.memoizeGetCars(this.props.raceToEdit, this.props.refreshToggle)
  }

  componentDidUpdate () {
    console.log('RemainingCarPool: updated')
    this.memoizeGetCars(this.props.raceToEdit, this.props.refreshToggle)
    console.log('RemainingCarPool::componentDidUpdate: state is', this.state)
  }

  componentWillUnmount () {
    console.log('RemainingCarPool: will unmount')
  }

  memoizeGetCars = memoizeOne(
    (p) => {
      console.log('RemainingCarPool::memoizedGetCars: props are', p)
      this.getCars()
    }
  )

  getCars = async () => {
    console.log('RemainingCarPool::getCars: getting cars from server')
    try {
      if (!this.props.user) {
        console.log('RemainingCarPool::getCars: not logged in, cannot get!')
        return false
      }
      let config = {
        headers: { 'Authorization': 'Bearer ' + this.props.user.token }
      }
      let response = await axios.get(
        this.props.urlprefix + '/car', config)
      // we got an array of car objects in response.data
      const carDetails = response.data.reduce((acc, cur, i) => {
        acc[Object.keys(cur)[0]] = Object.values(cur)[0]
        return acc
      })
      this.setState({ 'carDetails': carDetails })
      return true
    } catch (err) {
      console.log('RemainingCarPool::getCars: Error getting car list: ', err)
      return false
    }
  }

  render () {
    // Here we can add more information from the stored car details
    // before passing the object onwards to the list renderer
    let addedCars = this.props.values[this.props.fieldname]
    let remainingCars = { ...this.state.carDetails }
    Object.keys(addedCars).forEach((startNum) => {
      delete remainingCars[addedCars[startNum]]
    })

    return (
      <SelectableCarCardList
        cars={remainingCars}
        handleChange={this.props.handleChange}
        addClickHandler={this.props.addClickHandler}
        columns={1}
      />
    )
  }
}

export default RemainingCarPool
