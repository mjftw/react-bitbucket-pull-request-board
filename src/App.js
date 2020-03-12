import React, { Component } from 'react';
import { Grommet } from 'grommet';
import getEnv from './env'
import getPRData from './dataFuncs/getPRData'
import InfoBoard from './components/InfoBoard';

const theme = {
    global: {
        font: {
            family: 'Roboto',
            size: '14px',
            height: '20px',
        },
    },
};

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
        }).catch(error => alert(`${error}. API key expired?`))
    }

    render() {
        return (
            <Grommet theme={theme}>
                <InfoBoard prData={this.state.prData}></InfoBoard>
            </Grommet>
        );
    }
}

export default App;
