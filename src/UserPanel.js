import React, { Component } from 'react'
import { H3 } from '@blueprintjs/core'
import { Flex, Box } from 'reflexbox'

class UserPanel extends Component {
  constructor (props) {
    super(props)
    this.state = {
    }
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick = (e) => {
    this.setState({ 'xxx': e.target.value })
  }

  render () {
    const panelActive = this.props.active ? {} : { 'display': 'none' }

    return (
      <Flex className='userpanel' style={panelActive}>
        <Box>
          <H3>Users</H3>
          <p className='userpanel'>
            Manage Pinewood Derby users and admins.
          </p>
        </Box>
      </Flex>
    )
  }
}

export default UserPanel
