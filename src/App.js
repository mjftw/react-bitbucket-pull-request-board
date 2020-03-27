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
        this.updateReposData = this.updateReposData.bind(this);
        this.appendPRData = this.appendPRData.bind(this);
        this.removeReposData = this.removeReposData.bind(this);

        this.state = {
            accessToken: getEnv().bitbucket.accessToken,
            prData: null,
            workspaceName: getEnv().bitbucket.workspaceName,
            reposFound: getEnv().bitbucket.repoNameSuggestions,
            reposSelected: [],
            loadingData: false
        };
    }

    componentDidMount() {
        this.setState({
            accessToken: this.getAccessToken()
        });
        this.updateReposData(getEnv().bitbucket.repoNameSuggestions);
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

    updateReposData(repoNames) {
        const reposRemoved = this.state.reposSelected.filter(
            selected => (repoNames.indexOf(selected) < 0)
        );

        const reposAdded = repoNames.filter(
            name => (this.state.reposSelected.indexOf(name) < 0)
        );

        if (reposRemoved.length > 0) {
            this.removeReposData(reposRemoved);
        }

        if (reposAdded.length > 0) {
            this.getReposData(reposAdded);
        }
    }

    removeReposData(repoNames) {
        let prData = this.state.prData ? this.state.prData.slice() : [];
        let reposSelected = this.state.reposSelected ? this.state.reposSelected.slice() : [];

        // Filter out any PRs with a repo name in repoNames
        prData = prData.filter(pr => (repoNames.indexOf(pr.repoName) < 0));
        reposSelected = reposSelected.filter(selected => (repoNames.indexOf(selected) < 0));

        this.setState({
            prData: prData,
            reposSelected
        });
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
                reposSelected: this.state.reposSelected.concat(repoNames),
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
                    updateRepoList={this.updateReposData}
                />
            </Grommet>
        );
    }
}

export default App;
