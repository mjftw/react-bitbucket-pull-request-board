import {
    getWorkspaces,
    getRepoListPage,
    redirectBitbucketOauthUrl
} from '../utils/bitbucket';
import {cancelRequests} from '../utils/courier';

import {
    SET_REPOS_SELECTION,
    SET_WORKSPACE_SELECTION,
    SET_REFRESH_MINS,
    SET_SHOULD_DATA_REFRESH,
    FETCH_WORKSPACES_BEGIN,
    FETCH_WORKSPACES_SUCCESS,
    FETCH_WORKSPACES_FAILURE,
    SET_ACCESS_TOKEN,
    FETCH_REPOS_PAGES_BEGIN,
    FETCH_REPOS_PAGE_SUCCESS,
    FETCH_REPOS_PAGE_FAILURE,
    FETCH_REPOS_PAGE_CANCELLED,
    FETCH_REPOS_PAGES_END
} from './actionTypes';
import {errorIsRequestCancelled, errorIs401} from '../utils/courier';

export const setReposSelection = (repoNames) => ({
    type: SET_REPOS_SELECTION,
    payload: {
        repoNames
    }
});

export const setWorkspaceSelection = (workspace) => {
    const action = {
        type: SET_WORKSPACE_SELECTION,
        payload: {
            workspace
        }
    };

    return dispatch => {
        dispatch(action);
        cancelRequests();
        dispatch(fetchReposPages());
    };
};

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

export const fetchWorkspaces = () => {
    return (dispatch, getState) => {
        const state = getState();
        const accessToken = state.external.bitbucket.accessToken;

        dispatch(fetchWorkspacesBegin());
        return getWorkspaces(accessToken)
            .then(workspaces => {
                dispatch(fetchWorkspacesSuccess(workspaces));

                // Select first workspace found
                if (workspaces && workspaces.length) {
                    dispatch(setWorkspaceSelection(workspaces[ 0 ]));
                }

                return workspaces;
            })
            .catch(error =>
                handleRequestError(dispatch, error,
                    fetchWorkspacesFailure));
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

export const fetchReposPages = () => {
    const action = {
        type: FETCH_REPOS_PAGES_BEGIN
    };

    return dispatch => {
        dispatch(action);
        dispatch(fetchReposPageBegin());
    };
};

export const fetchReposPageBegin = (pageUrl) => {
    return (dispatch, getState) => {
        const state = getState();
        const accessToken = state.external.bitbucket.accessToken;
        const workspaceName = state.workspaces.selected.name;
        // Get next page if page URL, otherwise first page
        getRepoListPage(pageUrl, workspaceName, accessToken)
            .then(reposPage => {
                dispatch(fetchReposPageSuccess(reposPage.repoNames));
                if (reposPage.nextPageUrl) {
                    dispatch(fetchReposPageBegin(reposPage.nextPageUrl));
                }
                else {
                    dispatch(fetchReposPagesEnd());
                }
            })
            .catch(error =>
                handleRequestError(dispatch, error,
                    fetchReposPageFailure, fetchReposPageCancelled));
    };
};

export const fetchReposPageSuccess = (repos) => ({
    type: FETCH_REPOS_PAGE_SUCCESS,
    payload: {
        repos
    }
});

export const fetchReposPageFailure = (error) => ({
    type: FETCH_REPOS_PAGE_FAILURE,
    payload: {
        error
    }
});

export const fetchReposPageCancelled = () => ({
    type: FETCH_REPOS_PAGE_CANCELLED
});

export const fetchReposPagesEnd = () => ({
    type: FETCH_REPOS_PAGES_END
});