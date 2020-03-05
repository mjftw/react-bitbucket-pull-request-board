import React, { Component } from 'react';
import './App.css';
import getEnv from './env'
import getBitbucketData from './dataFuncs/getBitbucketData'

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            response: ""
        }
    }

    componentDidMount() {
        getBitbucketData(getEnv().bitbucket.repos)
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
