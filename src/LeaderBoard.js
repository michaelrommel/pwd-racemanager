import React, { Component } from 'react'
import { HTMLTable } from '@blueprintjs/core'
import axios from 'axios'
import memoize from 'memoize-one'

function Leaderboardrows (props) {
  const leaders = props.leaderboard
  if (leaders === undefined || leaders === null) return null

  return (
    <React.Fragment>
      {leaders.map((leader, i) => 
        <tr key={i + 1}><td>{i + 1}</td>
            <td>{leader.ow}</td>
            <td>{leader.cumulatedScore}</td>
            <td>{leader.cumulatedTime}</td></tr>
      )}
    </React.Fragment>
  )
}

class LeaderBoard extends Component {
  constructor (props) {
    super(props)
    this.state = {
      'leaderboard': []
    }
  }

  componentDidMount () {
    console.log('LeaderBoard: mounted.')
    this.getLeaderboard()
  }

  getLeaderboard = async () => {
    if (this.props.user) {
      console.log('LeaderBoard: getting latest data')
      try {
        let config = {
          headers: {'Authorization': 'Bearer ' + this.props.user.token}
        };
        let leaderboard = await axios.get('https://pwd-racetrack/race/leaderboard/2018-Quali', config)
        this.setState({ 'leaderboard': leaderboard.data.splice(0,10) })
      } catch (err) {
        console.log('Error getting race list: ', err)
      }
    }
  }

  loadNewData = memoize(
    (user) => { this.getLeaderboard() }
  )

  render () {
    this.loadNewData(this.props.user)
    return (
      <React.Fragment>
        <HTMLTable condensed striped width={'100%'}>
          <thead><tr>
            <th>Rank</th>
            <th>Owner</th>
            <th>Score</th>
            <th>Time</th></tr></thead>
          <tbody>
            <Leaderboardrows leaderboard={this.state.leaderboard} />
          </tbody>
        </HTMLTable>
      </React.Fragment>
    )
  }
}

export default LeaderBoard
