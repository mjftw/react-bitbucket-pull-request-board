import {Component} from 'react';
import {connect} from 'react-redux';
import {setAccessToken} from '../redux/external/actions';
import {getAccessTokenFromURL} from '../utils/bitbucket';


// Handles getting API access token, and performing initial fetches
// when we get a new access token.
class BitbucketKeyManager extends Component {
    componentDidMount() {
        const accessToken = getAccessTokenFromURL();
        if (accessToken) {
            console.log('Got access token from URL');

            // Initial dispatch
            this.props.dispatch(setAccessToken(accessToken));
        }
    }

    render() {return null;}
}

export default connect()(BitbucketKeyManager);