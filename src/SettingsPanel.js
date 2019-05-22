import React, { Component } from 'react'
import { H3 } from '@blueprintjs/core'

class SettingsPanel extends Component {
  constructor (props) {
    super(props)
    this.state = {
      'loggedIn' : true
    }
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick = (e) => {
    this.setState( { 'xxx': e.target.value } )
  }

  render () {
    const { loggedIn } = this.state

    const panelActive = this.props.active ? {} : {'display': 'none'}

    return (
      <div className='settingspanel' style={panelActive}>
        <H3>Settings</H3>
        <p className='settingspanel'>
          Here you can change the settings of the racemanager.
        </p>
      </div>
    )
  }
}

export default SettingsPanel
