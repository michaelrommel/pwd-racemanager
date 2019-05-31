import React, { Component } from 'react'
import { HTMLTable } from '@blueprintjs/core'

function Leaderboardrows (props) {
  const leaders = props.leaderboard
  if (leaders === undefined ||
    leaders === null ||
    leaders.length === 0
  ) return null

  console.log('Leaderboard::Leaderboardrows:: iterating over', leaders)

  return (
    <React.Fragment>
      {leaders.map((leader, i) =>
        <tr key={i + 1}>
          <td>{i + 1}</td>
          <td>{leader.ow}</td>
          <td>{leader.cumulatedScore}</td>
          <td>{leader.cumulatedTime}</td></tr>
      )}
    </React.Fragment>
  )
}

class Leaderboard extends Component {
  render () {
    return (
      <React.Fragment>
        <HTMLTable condensed striped width={'100%'}>
          <thead><tr>
            <th>Rank</th>
            <th>Owner</th>
            <th>Score</th>
            <th>Time</th></tr></thead>
          <tbody>
            <Leaderboardrows leaderboard={this.props.leaderboard} />
          </tbody>
        </HTMLTable>
      </React.Fragment>
    )
  }
}

export default Leaderboard
