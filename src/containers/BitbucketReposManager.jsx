import {Component} from 'react';
import {connect} from 'react-redux';
import {fetchReposPagesStart} from '../redux/actions';

// Dispatch action to fetch repos list if workspace selected
class BitbucketReposManager extends Component {

    // Called when new workspace selected
    render() {
        if (this.props.workspaceSelected) {
            this.props.dispatch(fetchReposPagesStart());
        }

        return null;
    }
}

export default connect(
    (state) => ({
        workspaceSelected: state.workspaces.selected
    })
)(BitbucketReposManager);