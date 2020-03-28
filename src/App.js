import React, { Component } from 'react';
import { Grommet } from 'grommet';
import getEnv from './env'
import { getRepoPRDataPromises, getWorkspaces } from './utils/bitbucket'
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
        this.setWorkspaceSelection = this.setWorkspaceSelection.bind(this);
        this.handleRequestError = this.handleRequestError.bind(this);

        this.state = {
            accessToken: getEnv().bitbucket.accessToken,
            prData: null,
            reposFound: getEnv().bitbucket.repoNameSuggestions,
            reposSelected: [],
            workspaceSelected: null,
            workspacesFound: [],
            loadingData: false
        };
    }

    componentDidMount() {
        const accessToken = this.getAccessToken();
        this.setState({
            accessToken: accessToken
        });

        getWorkspaces(accessToken).then(workspaces => {
            // Select first workspace found
            const workspaceSelected = workspaces.length ? workspaces[0] : null;

            this.setState({
                workspacesFound: workspaces,
                workspaceSelected: workspaceSelected
            });
            console.log('Workspaces: ')
            console.log(workspaces)

            if (workspaceSelected) {
                this.updateReposData(
                    getEnv().bitbucket.repoNameSuggestions,
                    workspaceSelected);
            }
            //TODO: Display info about no workspaces found
        }).catch(this.handleRequestError)
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

    updateReposData(repoNames, workspace) {
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
            this.getReposData(reposAdded, workspace);
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

    getReposData(repoNames, workspace) {
        const accessToken = this.getAccessToken();
        if (!accessToken) {
            return;
        }

        const workspaceName = workspace ? workspace.name : this.state.workspace.name;

        this.setState({
            loadingData: true
        });

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
        }).catch(this.handleRequestError);
    }

    handleRequestError(error) {
        console.log(JSON.stringify(error));

        const notAuthorizedMsg = 'Request failed with status code 401';

        if (error.message === notAuthorizedMsg) {
            if (this.state.accessToken) {
                // Access token probably expired, get new one

                // Clear access token from state
                this.setState({
                    accessToken: null
                })

                // Redirect to Bitbucket to get new token
                window.location.replace(getEnv().bitbucket.oauthUrl);
            }
        }
    }

    setWorkspaceSelection(workspace) {
        this.setState({
            workspaceSelected: workspace
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
                    setReposSelection={this.updateReposData}
                    workspaceSelected={this.state.workspaceSelected}
                    workspaceSuggestions={this.state.workspacesFound}
                    setWorkspaceSelection={this.setWorkspaceSelection}
                />
            </Grommet>
        );
    }
}

export default App;
