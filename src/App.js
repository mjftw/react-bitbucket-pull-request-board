import React, { Component } from 'react';
import { Grommet } from 'grommet';
import getEnv from './env'
import { getRepoPRDataPromises } from './utils/bitbucket'
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
        this.appendPRData = this.appendPRData.bind(this);

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

    appendPRData(singlePrData) {
        let prData = this.state.prData ? this.state.prData.slice() : [];
        prData.push(singlePrData);

        this.setState({
            prData: prData
        });
    }

    getReposData(repoNames) {
        const accessToken = this.getAccessToken();
        if (!accessToken) {
            return;
        }

        this.setState({
            loadingData: true,
            prData: []
        });

        const workspaceName = this.state.workspaceName;

        let allPromises = Promise.all(repoNames.map(repoName =>
            getRepoPRDataPromises(
                workspaceName, repoName, accessToken
            ).then(promises => {
                promises.map(promise =>
                    promise.then(prData =>
                        this.appendPRData(prData)
                    )
                )
                return Promise.all(promises);
            })
        ))

        allPromises.then(() => {
            this.setState({
                reposSelected: repoNames,
                loadingData: false
            })
        });
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
