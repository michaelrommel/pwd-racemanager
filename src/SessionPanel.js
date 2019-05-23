import React, { Component } from 'react'
import { Button, Card, InputGroup, Intent, Tooltip, HTMLTable, H5 } from '@blueprintjs/core'
import { Flex, Box } from 'reflexbox'
import axios from 'axios'

class SessionPanel extends Component {
  constructor (props) {
    super(props)
    this.state = {
      'user': props.user,
      'showPassword': false,
      'newuser': '',
      'newpass': ''
    }
    this.handleLoginClick = this.handleLoginClick.bind(this)
    this.handleLogoutClick = this.handleLogoutClick.bind(this)
    this.handleLockClick = this.handleLockClick.bind(this)
  }

  handleUsernameChange = (e) => {
    this.setState( { 'newuser': e.target.value } )
  }

  handlePasswordChange = (e) => {
    this.setState( { 'newpass': e.target.value } )
  }

  handleLogoutClick = (e) => {
    console.log('Logging out user: ' + this.state.user)
    this.setState(
      {
        'user': null,
        'newuser': '',
        'newpass': ''
      }
    )
    this.props.onUserChange(null)
  }

  handleLoginClick = async (e) => {
    const username = this.state.newuser
    const password = this.state.newpass

    console.log('Logging in user: ' + username)
    // Do something to validate the user/pass combination
    try {
      let user = await axios.post('https://pwd-racetrack/auth/local-login',
        {
          'username': username,
          'password': password
        })
      // we got a user, propagate it to the state
      this.setState(
        {
          'user': user.data
        }
      )
      this.props.onUserChange(user.data)
    } catch (err) {
      console.log('Error in logging in: ', err)
    }
  }

  handleLockClick = () => {
    this.setState({ 'showPassword': !this.state.showPassword })
  }

  render () {
    const { showPassword, user } = this.state

    const loggedIn = user === null ? false : true

    const panelActive = this.props.active ? {} : {'display': 'none'}

    const hiddenIfLoggedIn = loggedIn ? {'display': 'none'} : {}
    const hiddenIfLoggedOut = loggedIn ? {} : {'display': 'none'} 

    const lockButton = (
      <Tooltip content={`${this.state.showPassword ? "Hide" : "Show"} Password`}>
        <Button
          icon={this.state.showPassword ? "unlock" : "lock"}
          intent={Intent.NONE}
          onClick={this.handleLockClick}
        />
      </Tooltip>
    )

    return (
      <div className='sessionpanel' style={panelActive}>
        <Flex p={2} align='center' justify='center'>
          <Box w={1/2} style={hiddenIfLoggedOut}>
            <Card>
              <H5>Session Information</H5>
              <HTMLTable className='sessiontable'>
                <thead><tr><th width="25%">Key</th><th>Value</th></tr></thead>
                <tbody>
                  <tr>
                    <td>User</td>
                    <td>{this.state.user !== null ? this.state.user.name : ''}</td>
                  </tr>
                  <tr>
                    <td>Role</td>
                    <td>{this.state.user !== null ? this.state.user.role : ''}</td>
                  </tr>
                  <tr>
                    <td>Token</td>
                    <td>{this.state.user !== null ? this.state.user.token : ''}</td>
                  </tr>
                </tbody>
              </HTMLTable>
            </Card>
          </Box>
          <Box w={1/2} style={hiddenIfLoggedIn}>
            <InputGroup className='logingroup' large leftIcon="person" 
              placeholder='Username' value={this.state.newuser}
              onChange={this.handleUsernameChange} />
            <InputGroup className='logingroup' large leftIcon='key' 
              placeholder='Password' value={this.state.newpass} 
              rightElement={lockButton} type={showPassword ? 'text' : 'password'}
              onChange={this.handlePasswordChange} />
          </Box>
        </Flex>
        <Flex p={2} align='center' justify='center'>
          <Box align='center' justify='center'>
            <Button intent={Intent.PRIMARY} style={hiddenIfLoggedIn} active={true}
              onClick={this.handleLoginClick} text='Login'/>
            <Button intent={Intent.PRIMARY} style={hiddenIfLoggedOut} active={true}
              onClick={this.handleLogoutClick} text='Logout'/>
          </Box>
        </Flex>
      </div>
    )
  }
}

export default SessionPanel
