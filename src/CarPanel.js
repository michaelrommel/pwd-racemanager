import React, { Component } from 'react'
import { H3 } from '@blueprintjs/core'

class CarPanel extends Component {
  constructor (props) {
    super(props)
    this.state = {
    }
  }

  handleClick = (e) => {
    this.setState({ 'xxx': e.target.value })
  }

  render () {
    const panelActive = this.props.active ? {} : { 'display': 'none' }

    return (
      <div className='carpanel' style={panelActive}>
        <H3>Cars</H3>
        <p className='carpanel'>
          Manage Pinewood Derby cars.
        </p>
      </div>
    )
  }
}

export default CarPanel
