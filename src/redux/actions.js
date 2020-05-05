import {
    SET_REPOS_SELECTION,
    SET_WORKSPACE_SELECTION,
    SET_REFRESH_MINS,
    SET_SHOULD_DATA_REFRESH
} from './actionTypes';

export const updateReposData = (repoNames) => ({
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
