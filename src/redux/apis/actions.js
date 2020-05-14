import {fetchWorkspaces} from '../workspaces/actions';
import {
    SET_ACCESS_TOKEN
} from './actionTypes';

export const setAccessToken = (accessToken) => {
    const action = {
        type: SET_ACCESS_TOKEN,
        payload: {
            accessToken
        }
    };

    console.log('New access token. Performing initial fetches');

    // If we have an access token, fetch workspaces
    return dispatch => {
        dispatch(action);
        dispatch(fetchWorkspaces());
    };
};