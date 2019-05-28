import React, { Component } from 'react'
import Navigation from './Navigation'
import './App.css'

class App extends Component {
  constructor (props) {
    super(props)

    this.state = {
      'darktheme': true
    }
  }

  changeTheme = () => {
    this.setState((state, props) => ({
      'darktheme': !state.darktheme
    }))
  }

  render () {
    return (
      <div className={`App ${this.state.darktheme ? 'bp3-dark' : ''}`}>
        <Navigation
          changeTheme={this.changeTheme}
          darktheme={this.state.darktheme} />
      </div>
    )
  }
}

export default App
