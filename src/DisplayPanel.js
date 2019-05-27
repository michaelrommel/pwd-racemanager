import React, { Component } from 'react'
import { H1, H4 } from '@blueprintjs/core'
import { Flex, Box } from 'reflexbox'
import LeaderBoard from './LeaderBoard'
import HighScore from './HighScore'

class DisplayPanel extends Component {
  constructor (props) {
    super(props)
    this.state = {
    }
  }

  componentDidMount () {
    console.log('DisplayPanel: mounted.')
  }

  render () {
    const panelActive = this.props.active ? {} : { 'display': 'none' }

    return (
      <Flex className='display' style={panelActive}>
        <Box w={1}>
          <Flex w={1} justify='center'>
            <Box w={1} p={1} align='center' justify='center' className='displaybanner'>
              <H1>SRS Pinewood Derby</H1>
            </Box>
          </Flex>
          <Flex w={1}>
            <Box w={1 / 3}>
              <Flex w={1} column>
                <Box w={1} p={1} align='stretch' className='displaysectionleft'>
                  <H4>Current Race</H4>
                </Box>
                <Box w={1} p={1} align='stretch' className='displaysectionleft'>
                  <H4>Next Race</H4>
                </Box>
              </Flex>
            </Box>
            <Box w={1 / 3} align='stretch' className='displaysectionright'>
              <Flex w={1}>
                <Box w={1} p={1}>
                  <H4>Leaderboard</H4>
                  <div align='center'>
                    <LeaderBoard user={this.props.user} />
                  </div>
                </Box>
              </Flex>
            </Box>
            <Box w={1 / 3} align='stretch' className='displaysectionright'>
              <Flex w={1}>
                <Box w={1} p={1}>
                  <H4>Highscores</H4>
                  <div align='center'>
                    <HighScore user={this.props.user} />
                  </div>
                </Box>
              </Flex>
            </Box>
          </Flex>
        </Box>
      </Flex>
    )
  }
}

export default DisplayPanel
