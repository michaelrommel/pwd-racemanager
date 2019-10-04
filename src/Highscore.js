import React, { Component } from 'react';
import { HTMLTable } from '@blueprintjs/core';

function Highscorerows (props) {
  const scores = props.highscore;
  if (scores === undefined ||
    scores === null ||
    scores.length === 0
  ) return null;

  return (
    <React.Fragment>
      {scores.map((scores) =>
        <tr key={scores.rank}>
          <td>{scores.rank}</td>
          <td>{scores.ow}</td>
          <td>{scores.t}</td>
          <td>{scores.heat}</td>
        </tr>
      )}
    </React.Fragment>
  );
}

class Highscore extends Component {
  render () {
    return (
      <React.Fragment>
        <HTMLTable condensed striped width={'100%'}>
          <thead><tr>
            <th>Rank</th>
            <th>Owner</th>
            <th>Time</th>
            <th>Heat</th></tr></thead>
          <tbody>
            <Highscorerows highscore={this.props.highscore} />
          </tbody>
        </HTMLTable>
      </React.Fragment>
    );
  }
}

export default Highscore;
