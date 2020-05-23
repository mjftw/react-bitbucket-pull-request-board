import {
    SET_REFRESH_MINS,
    SET_SHOULD_DATA_REFRESH
} from './actionTypes';


const initialState = {
    "shouldDataRefresh": true,
    "mins": 10
};

export function refreshReducer(state, action) {
    let newState = (state === undefined) ? {...initialState} : {...state};

    switch (action.type) {
        case SET_REFRESH_MINS:
            newState.mins = action.payload.mins;
            break;

        case SET_SHOULD_DATA_REFRESH:
            newState.shouldDataRefresh = action.payload.yesNo;
            break;

        default:
            break;
    }

    return newState;
}

