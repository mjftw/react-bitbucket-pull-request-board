import {
    redirectBitbucketOauthUrl
} from '../utils/bitbucket';
import {errorIsRequestCancelled, errorIs401} from '../utils/courier';


export const handleRequestError = (dispatch, error, errorAction, cancelledAction) => {
    if (errorIsRequestCancelled(error) && cancelledAction !== undefined) {
        dispatch(cancelledAction(error));
    }
    else if (errorIs401(error)) {
        redirectBitbucketOauthUrl();
    }
    else if (errorAction !== undefined) {
        dispatch(errorAction());
    }
};
