import {
    SET_REPOS_SELECTION,
    SET_WORKSPACE_SELECTION,
    SET_REFRESH_MINS,
    SET_SHOULD_DATA_REFRESH,
    FETCH_WORKSPACES_BEGIN,
    FETCH_WORKSPACES_SUCCESS,
    FETCH_WORKSPACES_FAILURE,
    SET_ACCESS_TOKEN
} from './actionTypes';
import {errorIs401, cancelRequests} from '../utils/courier';
export function rootReducer(state, action) {
    let newState = {...state};

    switch (action.type) {
        case SET_REPOS_SELECTION:
            newState.repos.selected = action.payload.repoNames;
            break;

        case SET_WORKSPACE_SELECTION:
            newState.workspaces.selected = action.payload.workspace;
            newState.repos.all = [];
            newState.repos.selected = [];
            newState.pullRequests.all = [];

            // Changing workspace, so cancel all ongoing requests
            cancelRequests();
            break;

        case SET_REFRESH_MINS:
            newState.refresh.mins = action.payload.mins;
            break;

        case SET_SHOULD_DATA_REFRESH:
            newState.refresh.shouldDataRefresh = action.payload.yesNo;
            break;

        case FETCH_WORKSPACES_BEGIN:
            newState.workspaces.loading = true;
            newState.workspaces.fetchError = null;
            break;

        case FETCH_WORKSPACES_SUCCESS:
            newState.workspaces.loading = false;
            newState.workspaces.all = action.payload.workspaces;
            break;

        case FETCH_WORKSPACES_FAILURE:
            newState.workspaces.loading = false;
            newState.workspaces.all = [];
            newState.workspaces.fetchError = action.payload.error;
            newState.external.bitbucket.gotNoAuthFetchError = errorIs401(action.payload.error);
            break;

        case SET_ACCESS_TOKEN:
            newState.external.bitbucket.accessToken = action.payload.accessToken;
            newState.external.bitbucket.gotNoAuthFetchError = false;
            break;

        default:
            break;
    }

    return newState;
}