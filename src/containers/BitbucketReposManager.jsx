import {Component} from 'react';
import {connect} from 'react-redux';
import {fetchReposPages} from '../redux/actions';
import {cancelRequests} from '../utils/courier';

// Dispatch action to fetch repos list if workspace selected
class BitbucketReposManager extends Component {

    // Called when new workspace selected
    render() {
        if (this.props.workspaceSelected) {
            cancelRequests();
            this.props.dispatch(fetchReposPages());
        }

        return null;
    }
}

export default connect(
    (state) => ({
        workspaceSelected: state.workspaces.selected
    })
)(BitbucketReposManager);