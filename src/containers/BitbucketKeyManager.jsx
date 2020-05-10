import {Component} from 'react';
import {connect} from 'react-redux';
import {fetchWorkspaces, setAccessToken} from '../redux/actions';
import {getAccessTokenFromURL, redirectBitbucketOauthUrl} from '../utils/bitbucket';


// Handles getting API access token, and performing initial fetches
// when we get a new access token.
class BitbucketKeyManager extends Component {
    // Called if accessToken changes or is invalidated
    render() {
        // If access token invalid, get a new one
        if (this.props.accessTokenInvalid) {
            // Function does not return
            console.log('Access token invalid, redirecting to Bitbucket');
            redirectBitbucketOauthUrl();
        }
        // If we have an access token, fetch workspaces
        else if (this.props.accessToken) {
            console.log('New access token. Performing initial fetches');
            this.props.dispatch(fetchWorkspaces());
        }
        // No access token, can we get one from URL args?
        else {
            // If access token available in URL, save this to store
            const accessToken = getAccessTokenFromURL();
            if (accessToken) {
                console.log('Got access token from URL');
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
)(BitbucketKeyManager);