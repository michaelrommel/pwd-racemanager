import React, { Component } from 'react';
import DraggableCarCardList from './DraggableCarCardList';

class CarListField extends Component {
  render () {
    // Here we can add more information from the stored car details
    // before passing the object onwards to the list renderer
    const originalCars = this.props.values[this.props.fieldname];
    const amendedCars = {};
    if (this.props.allCars === undefined) {
      // return, because the list would be uninformative
      return null;
    }
    Object.keys(originalCars).forEach((startNum) => {
      amendedCars[startNum] = this.props.allCars[originalCars[startNum]];
    });

    return (
      <DraggableCarCardList
        cars={amendedCars}
        handleChange={this.props.handleChange}
        removeClickHandler={this.props.removeClickHandler}
        columns={this.props.columns}
      />
    );
  }
}

export default CarListField;
