import React, { Component } from 'react'
import axios from 'axios'
import memoizeOne from 'memoize-one'
import DraggableCarCardList from './DraggableCarCardList'

class CarListField extends Component {
  constructor (props) {
    super(props)
    this.state = {
      carDetails: {}
    }
  }

  componentDidMount () {
    console.log('CarListField: mounted.')
    this.memoizeGetCars(this.props.raceToEdit, this.props.refreshToggle)
  }

  componentDidUpdate () {
    console.log('CarListField: updated')
    this.memoizeGetCars(this.props.raceToEdit, this.props.refreshToggle)
    console.log('CarListField::componentDidUpdate: state is', this.state)
  }

  componentWillUnmount () {
    console.log('CarListField: will unmount')
  }

  memoizeGetCars = memoizeOne(
    (p) => {
      console.log('CarListField::memoizedGetCars: props are', p)
      this.getCars()
    }
  )

  getCars = async () => {
    console.log('CarListField::getCars: getting cars from server')
    try {
      if (!this.props.user) {
        console.log('CarListField::getCars: not logged in, cannot get!')
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
      console.log('CarListField::getCars: Error getting car list: ', err)
      return false
    }
  }

  render () {
    // Here we can add more information from the stored car details
    // before passing the object onwards to the list renderer
    let originalCars = this.props.values[this.props.fieldname]
    let amendedCars = {}
    Object.keys(originalCars).forEach((startNum) => {
      amendedCars[startNum] = this.state.carDetails[originalCars[startNum]]
    })

    return (
      <DraggableCarCardList
        cars={amendedCars}
        handleChange={this.props.handleChange}
        removeClickHandler={this.props.removeClickHandler}
        columns={this.props.columns}
      />
    )
  }
}

export default CarListField
