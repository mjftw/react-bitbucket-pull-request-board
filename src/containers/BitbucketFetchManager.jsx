import {Component} from 'react';
import {connect} from 'react-redux';
import {fetchWorkspaces} from '../redux/actions';

/* TODO: Move functionality from App.js
*   - Workspace fetching
*   - Repo list fetching
*   - Pull request fetching
*   - Refresh timer handling
* TODO: Different types of fetch manager, returned by HOC
*   - bitbucketFetchManager for Bitbucket data
*   - githubFetchManager for Github data
*   - ...
*/

class BitbucketFetchManager extends Component {
    componentDidMount() {
        this.props.dispatch(fetchWorkspaces());
    }
    render() {return null;}
}

export default connect()(BitbucketFetchManager);