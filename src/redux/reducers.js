import {
    SET_REPOS_SELECTION,
    SET_WORKSPACE_SELECTION,
    SET_REFRESH_MINS,
    SET_SHOULD_DATA_REFRESH
} from './actionTypes';


export function rootReducer(state, action) {
    let newState = {...state};

    switch (action.type) {
        case SET_REPOS_SELECTION:
            //TODO:
            break;
        case SET_WORKSPACE_SELECTION:
            //TODO:
            break;
        case SET_REFRESH_MINS:
            newState.refresh.mins = action.payload.mins;
            break;
        case SET_SHOULD_DATA_REFRESH:
            newState.refresh.shouldDataRefresh = action.payload.yesNo;
            break;
        default:
            break;
    }

    return newState;
}