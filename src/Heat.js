import React, { Component } from 'react'
import { HTMLTable, Intent, Tag } from '@blueprintjs/core'

function Heatrows (props) {
  const laneColour = [
    'Gray', 'Blue', 'Orange', 'Berry'
  ]
  const statusIcons = {
    'unknown': 'help',
    'correct': 'tick-circle',
    'ok': 'tick-circle',
    'wrong': 'ban-circle'
  }
  const statusIntents = {
    'unknown': Intent.NONE,
    'correct': Intent.SUCCESS,
    'ok': Intent.SUCCESS,
    'wrong': Intent.DANGER
  }

  const heats = props.heat
  if (heats === undefined ||
    heats === null ||
    heats.results === undefined ||
    heats.results.length === 0
  ) return null

  console.log('Heat::Heatrows:: iterating over', heats.results)

  return (
    <React.Fragment>
      {heats.results.map((lane, i) =>
        <tr key={i + 1}>
          <td>{i + 1}</td>
          <td>{lane.ow}</td>
          <td>{laneColour[i]}</td>
          {!props.isNext
            ? <>
              <td>
                <Tag round
                  icon={statusIcons[lane.status]}
                  intent={statusIntents[lane.status]}
                >
                  {lane.status}
                </Tag>
              </td>
              <td>{lane.t}</td>
              <td>{lane.score}</td>
              </>
            : null}
        </tr>
      )}
    </React.Fragment>
  )
}

class Heat extends Component {
  constructor (props) {
    super(props)
    this.heatStatusIntents = {
      'nok': Intent.DANGER,
      'running': Intent.WARNING,
      'just finished': Intent.SUCCESS
    }
  }

  render () {
    let heatNumber = this.props.heat ? this.props.heat.heat : '-'
    let heatStatus = this.props.heat ? this.props.heat.status : '-'
    let heatStatusIntent = this.heatStatusIntents[heatStatus]

    console.log('Heat: rendering', this.props.heat)

    return (
      <React.Fragment>
        <p>
          <strong className='pwd-label'>{'Heat \u2116 '}</strong>
          <Tag round intent={Intent.NONE}>{heatNumber}</Tag>
          <strong className='pwd-label'>Status</strong>
          <Tag round intent={heatStatusIntent}>{heatStatus}</Tag>
        </p>
        <HTMLTable condensed striped width={'100%'}>
          <thead><tr>
            <th>Pos.</th>
            <th>Owner</th>
            <th>Lane</th>
            {!this.props.isNext
              ? <>
                <th>Status</th>
                <th>Time</th>
                <th>Score</th>
                </>
              : null}
          </tr></thead>
          <tbody>
            <Heatrows heat={this.props.heat} isNext={this.props.isNext || false} />
          </tbody>
        </HTMLTable>
      </React.Fragment>
    )
  }
}

export default Heat
