import {
    SET_WORKSPACE_SELECTION,
    FETCH_WORKSPACES_BEGIN,
    FETCH_WORKSPACES_SUCCESS,
    FETCH_WORKSPACES_FAILURE
} from './actionTypes';


const initialState = {
    "loading": false,
    "fetchError": null,
    "selected": null,
    "all": []
};

export function workspacesReducer(state, action) {
    let newState = (state === undefined) ? {...initialState} : {...state};

    switch (action.type) {
        case SET_WORKSPACE_SELECTION:
            newState.selected = action.payload.workspace;
            break;

        case FETCH_WORKSPACES_BEGIN:
            newState.loading = true;
            newState.fetchError = null;
            break;

        case FETCH_WORKSPACES_SUCCESS:
            newState.loading = false;
            newState.all = action.payload.workspaces;
            break;

        case FETCH_WORKSPACES_FAILURE:
            newState.loading = false;
            newState.all = [];
            newState.fetchError = action.payload.error;
            break;

        default:
            break;
    }

    return newState;
}