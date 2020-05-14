import React from 'react';
import InfoBoard from './InfoBoard';
import FilterMenu from './FilterMenu';
import Sidebar from './Sidebar';
import SpinnerOverlay from './SpinnerOverlay';
import BitbucketLink from './BitbucketLink';
import Footer from './Footer';
import {Box} from 'grommet';
import {connect} from 'react-redux';

function MainWindow(props) {
    if (props.missingBitbucketAuth) {
        return <BitbucketLink />;
    }
    else {
        return (
            <SpinnerOverlay show={props.loadingData}>
                <Box
                    direction='column'
                    height={{
                        min: '100vh'
                    }}
                >
                    <Box
                        direction='row'
                        flex='grow'>
                        <Sidebar>
                            <FilterMenu
                                reposSelected={props.reposSelected}
                                repoNameSuggestions={props.repoNameSuggestions}
                                setReposSelection={props.setReposSelection}
                                workspaceSelected={props.workspaceSelected}
                                workspaceSuggestions={props.workspaceSuggestions}
                                setWorkspaceSelection={props.setWorkspaceSelection}
                                loadingReposSuggestions={props.loadingReposSuggestions}
                                setRefreshMins={props.setRefreshMins}
                                refreshMins={props.refreshMins}
                                setShouldDataRefresh={props.setShouldDataRefresh}
                                shouldDataRefresh={props.shouldDataRefresh}
                            />
                        </Sidebar>
                        <InfoBoard
                            prData={props.prData}
                        />
                    </Box>
                    <Box border='top' flex='shrink'>
                        <Footer />
                    </Box>
                </Box>
            </SpinnerOverlay>
        );
    }
}

export default connect(
    (state) => ({
        missingBitbucketAuth: state.apis.bitbucket.accessToken ? false : true,
        loadingData: state.pullRequests.loading
    })
)(MainWindow);