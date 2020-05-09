import store from './store';
import {getWorkspaces} from '../utils/bitbucket';

import {
    SET_REPOS_SELECTION,
    SET_WORKSPACE_SELECTION,
    SET_REFRESH_MINS,
    SET_SHOULD_DATA_REFRESH,
    FETCH_WORKSPACES_BEGIN,
    FETCH_WORKSPACES_SUCCESS,
    FETCH_WORKSPACES_FAILURE
} from './actionTypes';

export const setReposSelection = (repoNames) => ({
    type: SET_REPOS_SELECTION,
    payload: {
        repoNames
    }
});

export const setWorkspaceSelection = (workspace) => ({
    type: SET_WORKSPACE_SELECTION,
    payload: {
        workspace
    }
});

export const setRefreshMins = (mins) => ({
    type: SET_REFRESH_MINS,
    payload: {
        mins
    }
});

export const setShouldDataRefresh = (yesNo) => ({
    type: SET_SHOULD_DATA_REFRESH,
    payload: {
        yesNo
    }
});

export const fetchWorkspaces = () => {
    return dispatch => {
        const state = store.getState();
        const accessToken = state.external.bitbucket.accessToken;

        if (!accessToken) {
            //TODO: dispatch action to get new accessToken
            // (see App.getAccessToken())
        }

        //TODO: dispatch action to cancel ongoing requests
        // (see utils.courier.cancelRequests())

        dispatch(fetchWorkspacesBegin());
        return getWorkspaces(accessToken)
            .then(workspaces => {
                dispatch(fetchWorkspacesSuccess(workspaces));

                // Select first workspace found
                if (workspaces && workspaces.length) {
                    dispatch(setWorkspaceSelection(workspaces[ 0 ]));
                }

                //TODO: dispatch action to get repos list
                // (See App.getRepoSuggestions(...))

                return workspaces;
            })
            .catch(error => dispatch(fetchWorkspacesFailure(error)));
    };
};

export const fetchWorkspacesBegin = () => ({
    type: FETCH_WORKSPACES_BEGIN
});

export const fetchWorkspacesSuccess = (workspaces) => ({
    type: FETCH_WORKSPACES_SUCCESS,
    payload: {
        workspaces
    }
});

export const fetchWorkspacesFailure = (error) => ({
    type: FETCH_WORKSPACES_FAILURE,
    payload: {
        error
    }
});