import React, { Component } from 'react';
import { Grommet } from 'grommet';
import getEnv from './env'
import getPRData from './dataFuncs/getPRData'
import MainWindow from './components/MainWindow'
import qs from 'qs'

const theme = {
    global: {
        font: {
            family: 'Roboto',
            size: '14px',
            height: '20px',
        },
        colors: {
            background: 'light-1'
        }
    },
};

class App extends Component {
    constructor(props) {
        super(props);

        this.getReposData = this.getReposData.bind(this);

        this.state = {
            accessToken: getEnv().bitbucket.accessToken,
            prData: null,
            reposFound: getEnv().bitbucket.repoNameSuggestions,
            reposSelected: getEnv().bitbucket.repoNameSuggestions,
            loadingData: false
        };
    }

    componentDidMount() {
        this.getReposData(this.state.reposSelected);
    }

    getAccessTokenFromURL() {
        const hashArgs = qs.parse(window.location.hash.slice(1));
        return hashArgs.access_token;
    }

    getAccessToken() {
        let accessToken = this.getAccessTokenFromURL();
        if (accessToken) {
            this.setState({
                accessToken: accessToken
            })
        }
        else {
            accessToken = this.state.accessToken;
        }

        return accessToken;
    }

    getReposData(repoNames) {
        const accessToken = this.getAccessToken();
        if (!accessToken) {
            return;
        }

        this.setState({
            loadingData: true
        });

        console.log(`Fetching data for repos: ${repoNames}`)
        getPRData(repoNames, accessToken).then(prData => {
            this.setState({
                prData: prData,
                reposSelected: repoNames,
                loadingData: false
            });
        }).catch(error => alert(`${error}. API key expired?`))
    }

    render() {
        return (
            <Grommet theme={theme}>
                <MainWindow
                    missingBitbucketAuth={this.state.accessToken ? false : true}
                    loadingData={this.state.loadingData}
                    prData={this.state.prData}
                    reposSelected={this.state.reposSelected}
                    repoNameSuggestions={this.state.reposFound}
                    updateRepoList={this.getReposData}
                />
            </Grommet>
        );
    }
}

export default App;
