import {
    SET_WORKSPACE_SELECTION,
    FETCH_WORKSPACES_BEGIN,
    FETCH_WORKSPACES_SUCCESS,
    FETCH_WORKSPACES_FAILURE
} from './actionTypes';


const initialState = {
    'loading': false,
    'fetchError': null,
    'selected': null,
    'all': []
};

export function workspacesReducer(state = initialState, action) {
    switch (action.type) {
        case SET_WORKSPACE_SELECTION:
            return {
                ...state,
                selected: action.payload.workspace
            };

        case FETCH_WORKSPACES_BEGIN:
            return {
                ...state,
                loading: true,
                fetchError: null
            };

        case FETCH_WORKSPACES_SUCCESS:
            return {
                ...state,
                loading: false,
                all: action.payload.workspaces
            };

        case FETCH_WORKSPACES_FAILURE:
            return {
                ...state,
                loading: false,
                all: [],
                fetchError: action.payload.error
            };

        default:
            return state;
    }
}