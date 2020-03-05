import React, { Component } from 'react';
import './App.css';
import { bitbucketCourier } from './dataFuncs/courier'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      response: ""
    }
  }

  componentDidMount() {
    bitbucketCourier('')//REDACTED
      .then(response => {
        console.log()
        this.setState({
          response: JSON.stringify(response, null, 4)
        })
      }
      )
  }

  render() {
    return (
      <div>
        <pre>
          {this.state.response}
        </pre>
      </div >
    );
  }
}

export default App;
