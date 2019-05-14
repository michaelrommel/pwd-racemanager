import React, { Component } from 'react'
import {Button,H3} from '@blueprintjs/core'

class SessionPanel extends Component {
  constructor (props) {
    super(props)
    this.state = {
      'loggedIn': false,
      'user': props.user
    }
  }

  handleClick (e) {
    if (this.state.loggedIn) {
      console.log('Logging out user: ' + this.state.user)
      this.setState(
        {
          'user': '',
          'loggedIn': false
        }
      )
    } else {
      console.log('Logging in user')
      this.setState(
        {
          'user': 'test',
          'loggedIn': true
        }
      )
    }
  }

  render () {
    return (
      <div className='sessionpanel'>
        <H3>Login / Logout</H3>
        <p className='sessionpanel'>
          <Button intent='primary' onClick={this.handleClick} text='Login'/>
        </p>
      </div>
    )
  }
}

export default SessionPanel
