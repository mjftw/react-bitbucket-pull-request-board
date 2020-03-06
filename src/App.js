import React, { Component } from 'react';
import './App.css';
import getEnv from './env'
import getPRData from './dataFuncs/getPRData'
import InfoBoard from './components/InfoBoard';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            prData: null
        }
    }

    componentDidMount() {
        getPRData(getEnv().bitbucket.repos).then(prData => {
            console.log()
            this.setState({
                prData: prData
            })
        }
        )
    }

    render() {
        return (
            <InfoBoard prData={this.state.prData}></InfoBoard>
        );
    }
}

export default App;
