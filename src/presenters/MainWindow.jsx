import React from 'react';
import {connect} from 'react-redux';
import {Box} from 'grommet';
import InfoBoard from './InfoBoard';
import FilterMenu from './FilterMenu';
import Sidebar from './Sidebar';
import SpinnerOverlay from './SpinnerOverlay';
import BitbucketLink from './BitbucketLink';
import Footer from './Footer';

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
                            <FilterMenu />
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