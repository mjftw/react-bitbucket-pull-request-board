import {Component} from 'react';
import {connect} from 'react-redux';
import {fetchWorkspaces, setAccessToken} from '../redux/actions';
import {getAccessTokenFromURL, redirectBitbucketOauthUrl} from '../utils/bitbucket';


// Handles getting API access token, and performing initial fetches
// when we get a new access token.
class BitbucketFetchManager extends Component {
    // Called if accessToken changes or is invalidated
    render() {
        // If access token invalid, get a new one
        if (this.props.accessTokenInvalid) {
            // Function does not return
            redirectBitbucketOauthUrl();
        }
        // If we have an access token, fetch workspaces
        else if (this.props.accessToken) {
            this.props.dispatch(fetchWorkspaces());
        }
        // No access token, can we get one from URL args?
        else {
            // If access token available in URL, save this to store
            const accessToken = getAccessTokenFromURL();
            if (accessToken) {
                this.props.dispatch(setAccessToken(accessToken));
            }
        }
        // If still no accessToken, do nothing.
        // Leave it up to UI to display "Connect to Bitbucket" button

        return null;
    }
}

export default connect(
    (state) => ({
        accessToken: state.external.bitbucket.accessToken,
        accessTokenInvalid: state.external.bitbucket.gotNoAuthFetchError
    })
)(BitbucketFetchManager);