import store from './store';
import {getWorkspaces, getRepoListPage} from '../utils/bitbucket';
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
    FETCH_REPOS_PAGES_END
} from './actionTypes';

export const setReposSelection = (repoNames) => ({
    type: SET_REPOS_SELECTION,
    payload: {
        repoNames
    }
});

export const setWorkspaceSelection = (workspace) => {
    cancelRequests();

    return {
        type: SET_WORKSPACE_SELECTION,
        payload: {
            workspace
        }
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

export const setAccessToken = (accessToken) => ({
    type: SET_ACCESS_TOKEN,
    payload: {
        accessToken
    }
});

export const fetchWorkspaces = () => {
    return dispatch => {
        const state = store.getState();
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

export const fetchReposPagesStart = () => {
    return dispatch => {
        dispatch(fetchReposPageBegin());

        return {
            type: FETCH_REPOS_PAGES_BEGIN
        };
    };
};

export const fetchReposPageBegin = (pageUrl) => {
    let accessToken = null;
    let workspaceName = null;

    // If no page URL, then we need enough info to get first repo page
    if (!pageUrl) {
        const state = store.getState();
        accessToken = state.external.bitbucket.accessToken;
        workspaceName = state.workspaces.selected.name;
    }

    return dispatch => {
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
            .catch(error => dispatch(fetchReposPageFailure(error)));
    };
};

// if (nextPageUrl) {
//     dispatch(fetchReposPageBegin(nextPageUrl));
// }
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

export const fetchReposPagesEnd = () => ({
    type: FETCH_REPOS_PAGES_END
});