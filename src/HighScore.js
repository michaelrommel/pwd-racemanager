import React, { Component } from 'react'
import { HTMLTable } from '@blueprintjs/core'
import axios from 'axios'
import memoize from 'memoize-one'

function Highscorerows (props) {
  const scores = props.highscore
  if (scores === undefined || scores === null) return null

  return (
    <React.Fragment>
      {scores.map((scores, i) =>
        <tr key={scores.rank}>
          <td>{scores.rank}</td>
          <td>{scores.ow}</td>
          <td>{scores.t}</td>
          <td>{scores.heat}</td>
        </tr>
      )}
    </React.Fragment>
  )
}

class HighScore extends Component {
  constructor (props) {
    super(props)
    this.state = {
      'highscore': []
    }
  }

  componentDidMount () {
    console.log('HighScore: mounted.')
    this.getHighscore()
  }

  getHighscore = async () => {
    console.log('HighScore: getting latest data')
    let config = {}
    if (this.props.user) {
      config = {
        headers: { 'Authorization': 'Bearer ' + this.props.user.token }
      }
    }
    try {
      let highscore = await axios.get('https://pwd-racetrack/race/highscore/2018-Quali', config)
      this.setState({ 'highscore': highscore.data.splice(0, 10) })
    } catch (err) {
      console.log('Error getting race list: ', err)
    }
  }

  loadNewData = memoize(
    (user) => { this.getHighscore() }
  )

  render () {
    this.loadNewData(this.props.user)
    return (
      <React.Fragment>
        <HTMLTable condensed striped width={'100%'}>
          <thead><tr>
            <th>Rank</th>
            <th>Owner</th>
            <th>Time</th>
            <th>Heat</th></tr></thead>
          <tbody>
            <Highscorerows highscore={this.state.highscore} />
          </tbody>
        </HTMLTable>
      </React.Fragment>
    )
  }
}

export default HighScore
