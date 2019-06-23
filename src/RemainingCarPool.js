import React, { Component } from 'react'
import SelectableCarCardList from './SelectableCarCardList'

class RemainingCarPool extends Component {
  render () {
    // Here we can add more information from the stored car details
    // before passing the object onwards to the list renderer
    let addedCars = this.props.values[this.props.fieldname]
    let remainingCars = { ...this.props.allCars }
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
