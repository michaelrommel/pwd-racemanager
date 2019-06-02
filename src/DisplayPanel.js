import React, { Component } from 'react'
import { H1, H4, Intent, Tag } from '@blueprintjs/core'
import { Flex, Box } from 'reflexbox'
import Leaderboard from './Leaderboard'
import Highscore from './Highscore'
import Heat from './Heat'

class DisplayPanel extends Component {
  render () {
    const panelActive = this.props.active ? {} : { 'display': 'none' }

    return (
      <Flex className='display' style={panelActive}>
        <Box w={1}>
          <Flex w={1} justify='center'>
            <Box w={1} p={1} align='center'
              justify='center'
              className='displaybanner'>
              <H1>SRS Pinewood Derby</H1>
            </Box>
          </Flex>
          <Flex w={1}>
            <Box w={15 / 40}>
              <Flex w={1} column>
                <Box w={1} p={2} className='displaysectionleft'>
                  <Tag large round intent={Intent.PRIMARY}>
                    <strong>{this.props.raceId}</strong>
                  </Tag>
                </Box>
                <Box w={1} p={1} align='stretch' className='displaysectionleft'>
                  <H4>Current Heat</H4>
                  <div align='center'>
                    <Heat heat={this.props.displayProps.currentHeat} />
                  </div>
                </Box>
                <Box w={1} p={1} align='stretch' className='displaysectionleft'>
                  <H4>Next Heat</H4>
                  <div align='center'>
                    <Heat heat={this.props.displayProps.nextHeat} isNext />
                  </div>
                </Box>
              </Flex>
            </Box>
            <Box w={12 / 40} align='stretch' className='displaysectionright'>
              <Flex w={1}>
                <Box w={1} p={1}>
                  <H4>Leaderboard</H4>
                  <div align='center'>
                    <Leaderboard leaderboard={this.props.displayProps.leaderboard} />
                  </div>
                </Box>
              </Flex>
            </Box>
            <Box w={13 / 40} align='stretch' className='displaysectionright'>
              <Flex w={1}>
                <Box w={1} p={1}>
                  <H4>Highscores</H4>
                  <div align='center'>
                    <Highscore highscore={this.props.displayProps.highscore} />
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
