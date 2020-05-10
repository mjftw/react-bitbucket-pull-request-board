import {getWorkspaces, getRepoListPage} from '../utils/bitbucket';

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
import {errorIsRequestCancelled} from '../utils/courier';

export const setReposSelection = (repoNames) => ({
    type: SET_REPOS_SELECTION,
    payload: {
        repoNames
    }
});

export const setWorkspaceSelection = (workspace) => {
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

export const fetchReposPages = () => {
    return dispatch => {
        dispatch(fetchReposPagesStart());
        dispatch(fetchReposPageBegin());
    };
};

export const fetchReposPagesStart = () => ({
    type: FETCH_REPOS_PAGES_BEGIN
});

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
            .catch(error => {
                if (errorIsRequestCancelled(error)) {
                    dispatch(fetchReposPageCancelled());
                }
                else {
                    dispatch(fetchReposPageFailure(error));
                }
            });
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