import React, { Component } from 'react'
import { H3 } from '@blueprintjs/core'

class UserPanel extends Component {
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
      <div className='userpanel' style={panelActive}>
        <H3>Settings</H3>
        <p className='userpanel'>
          Manage Pinewood Derby users and admins.
        </p>
      </div>
    )
  }
}

export default UserPanel
