import React from 'react';
import RingLoader from 'react-spinners/RingLoader';
import {Layer} from 'grommet';
import {connect} from 'react-redux';

function SpinnerOverlay(props) {
    const spinnerLayer = (
        <Layer
            full={false}
            modal={false}
            animate={true}
            animation='fadeIn'
            plain={true}
        >
            <RingLoader size='5em' color='midnightBlue' />
        </Layer>
    );

    return (
        <React.Fragment>
            {props.show ? spinnerLayer : null}
            {props.children}
        </React.Fragment>
    );
}

export default connect(
    (state, ownProps) => ({
        show: state.pullRequests.loadingRepos.length > 0,
        children: ownProps.children
    })
)(SpinnerOverlay);