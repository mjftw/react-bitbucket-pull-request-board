import React, { Component } from 'react';
import { Grommet } from 'grommet';
import getEnv from './env'
import { getReposPRData } from './utils/bitbucket'
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
            workspaceName: getEnv().bitbucket.workspaceName,
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

        const workspaceName = this.state.workspaceName;

        console.log(`Fetching data for repos: ${repoNames}`)
        getReposPRData(workspaceName, repoNames, accessToken).then(prData => {
            console.log('prData: ');
            console.log(prData)
            this.setState({
                prData: prData,
                reposSelected: repoNames,
                loadingData: false
            });
        }).catch(error => {
            console.log(error);
            console.log('Error fetching bitbucket data. Resetting access token.');
            this.setState({
                accessToken: null
            })
        })
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
