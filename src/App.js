import React, {Component} from 'react';
import {Grommet} from 'grommet';
import getEnv from './env';
import {getRepoPRDataPromises, getWorkspaces, getRepoListPage, getPrUid} from './utils/bitbucket';
import {cancelRequests} from './utils/courier';
import MainWindow from './components/MainWindow';
import qs from 'qs';
import {Mutex} from 'async-mutex';

const theme = {
    global: {
        font: {
            family: 'Roboto',
            size: '14px',
            height: '20px',
        },
        colors: {
            background: 'light-1',
            focus: 'neutral-3'
        }
    },
};

class App extends Component {
    constructor(props) {
        super(props);

        this.getReposData = this.getReposData.bind(this);
        this.updateReposData = this.updateReposData.bind(this);
        this.updatePRData = this.updatePRData.bind(this);
        this.removeReposData = this.removeReposData.bind(this);
        this.setWorkspaceSelection = this.setWorkspaceSelection.bind(this);
        this.handleRequestError = this.handleRequestError.bind(this);
        this.setRefeshIntervalTimer = this.setRefeshIntervalTimer.bind(this);
        this.setrefreshMins = this.setrefreshMins.bind(this);
        this.setShouldDataRefresh = this.setShouldDataRefresh.bind(this);

        this.state = {
            accessToken: getEnv().bitbucket.defaultAccessToken,
            prData: null,
            reposFound: null,
            reposSelected: [],
            workspaceSelected: null,
            workspacesFound: [],
            loadingData: false,
            loadingReposList: false,
            shouldDataRefresh: true,
            refreshMins: 10
        };

        // List of all repo names which have ongoing data fetches
        this.fetchingRepos = [];
        this.fetchListMutex = new Mutex();

        this.updateTimer = null;
        this.updateTimerInterval = null;
    }

    componentDidMount() {
        const accessToken = this.getAccessToken();
        this.setState({
            accessToken: accessToken
        });

        getWorkspaces(accessToken).then(workspaces => {
            // Select first workspace found
            const workspaceSelected = workspaces.length ? workspaces[ 0 ] : null;

            this.setState({
                workspacesFound: workspaces,
                workspaceSelected: workspaceSelected
            });

            if (workspaceSelected) {
                this.getRepoSuggestions(
                    workspaceSelected.name
                );
            }
            //TODO: Display info about no workspaces found
        }).catch(this.handleRequestError);
    }

    componentWillUnmount() {
        this.disableRefreshData();
    }

    async getRepoSuggestions(workspaceName) {
        this.setState({loadingReposList: true});

        let reposFound = [];
        let repoNameListPage = null;
        let getNextPage = getRepoListPage(
            workspaceName, null, this.getAccessToken());

        do {
            repoNameListPage = await getNextPage;
            getNextPage = repoNameListPage.getNextPage;

            reposFound.push(...repoNameListPage.repoNames);

            this.setState({
                reposFound: reposFound
            });
        } while (getNextPage);

        this.setState({loadingReposList: false});
        return reposFound;
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
            });
        }
        else {
            accessToken = this.state.accessToken;
        }

        return accessToken;
    }

    setrefreshMins(mins) {
        this.setState({
            refreshMins: mins
        });
    }

    setShouldDataRefresh(yesNo) {
        this.setState({
            shouldDataRefresh: yesNo ? true : false
        });
    }

    disableRefreshData() {
        if (this.updateTimerInterval) {
            console.log('Disabling data refresh');

            clearInterval(this.updateTimer);
            this.updateTimerInterval = null;
        }
    }

    setRefeshIntervalTimer(mins) {
        if (this.updateTimerInterval === mins) {
            return;
        }

        this.disableRefreshData();

        console.log(`Setting data refresh rate to ${mins} mins`);
        this.updateTimerInterval = mins;
        this.updateTimer = setInterval(() => (
            this.getReposData(
                this.state.reposSelected,
                this.state.workspace)),
            this.updateTimerInterval * 1000 * 60);
    }

    updatePRData(singlePrData) {
        const prUid = getPrUid(singlePrData);
        let prData = this.state.prData ? this.state.prData.slice() : [];

        // If PR on board, update data rather than adding new
        const dataIndex = prData.map(getPrUid).indexOf(prUid);
        if (dataIndex >= 0) {
            console.log(`Updating data for pull request ${prUid}`);
            prData[ dataIndex ] = singlePrData;
        }
        else {
            prData.push(singlePrData);
        }

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

        const workspaceName = workspace ? workspace.name : this.state.workspaceSelected.name;

        this.setState({
            loadingData: true
        });

        let allPromises = Promise.all(repoNames.map(async repoName => {
            // Prevent creating a duplicate request promises
            if (this.fetchingRepos.indexOf(repoName) >= 0) {
                console.log(`Preventing fetch data for ${repoName} as fetch in progress`);
                return null;
            }

            const release = await this.fetchListMutex.acquire();
            try {
                this.fetchingRepos.push(repoName);
            }
            finally {
                release();
            }

            return getRepoPRDataPromises(
                workspaceName, repoName, accessToken
            ).then(promises => {
                promises.map(promise =>
                    promise.then(prData =>
                        this.updatePRData(prData)
                    )
                );
                return Promise.all(promises);
            });
        }));

        allPromises.then(() => this.fetchListMutex.acquire())
            .then(release => {
                // Remove repoNames from list of repos being fetched
                this.fetchingRepos = this.fetchingRepos.filter(repoName =>
                    repoNames.indexOf(repoName) < 0
                );
                release();
            })
            .then(() => {
                let newReposSelected = this.state.reposSelected.concat(repoNames);

                // Prevent selecting duplicate repos
                newReposSelected = [ ...new Set(newReposSelected) ];

                this.setState({
                    reposSelected: newReposSelected,
                    loadingData: false
                });
            });
    }

    handleRequestError(error) {
        console.log(error);
        console.log(JSON.stringify(error));

        const notAuthorizedMsg = 'Request failed with status code 401';

        if (error.message === notAuthorizedMsg) {
            if (this.state.accessToken) {
                // Access token probably expired, get new one

                // Clear access token from state
                this.setState({
                    accessToken: null
                });

                // Redirect to Bitbucket to get new token
                window.location.replace(getEnv().bitbucket.oauthUrl);
            }
        }
    }

    setWorkspaceSelection(workspace) {
        // If changed workspace, also reset repos found & selected & prData
        // We also need to cancel any ongoing bitbucket API requests
        if (workspace.name !== this.state.workspaceSelected.name) {
            cancelRequests();

            this.setState({
                workspaceSelected: workspace,
                reposFound: [],
                reposSelected: [],
                prData: null
            });

            this.getRepoSuggestions(workspace.name);
        }
    }

    render() {
        if (this.state.shouldDataRefresh) {
            this.setRefeshIntervalTimer(this.state.refreshMins);
        }
        else {
            this.disableRefreshData();
        }

        return (
            <Grommet theme={theme}>
                <MainWindow
                    missingBitbucketAuth={this.state.accessToken ? false : true}
                    loadingData={this.state.loadingData}
                    loadingReposSuggestions={this.state.loadingReposList}
                    prData={this.state.prData}
                    reposSelected={this.state.reposSelected}
                    repoNameSuggestions={this.state.reposFound}
                    setReposSelection={this.updateReposData}
                    workspaceSelected={this.state.workspaceSelected}
                    workspaceSuggestions={this.state.workspacesFound}
                    setWorkspaceSelection={this.setWorkspaceSelection}
                    setrefreshMins={this.setrefreshMins}
                    refreshMins={this.state.refreshMins}
                    setShouldDataRefresh={this.setShouldDataRefresh}
                    shouldDataRefresh={this.state.shouldDataRefresh}
                />
            </Grommet>
        );
    }
}

export default App;
