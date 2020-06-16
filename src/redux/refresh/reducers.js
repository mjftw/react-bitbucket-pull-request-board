import {
    SET_REFRESH_MINS,
    SET_SHOULD_DATA_REFRESH
} from './actionTypes';


const initialState = {
    'shouldDataRefresh': true,
    'mins': 10
};

export function refreshReducer(state = initialState, action) {
    switch (action.type) {
        case SET_REFRESH_MINS:
            return {
                ...state,
                mins: action.payload.mins
            };

        case SET_SHOULD_DATA_REFRESH:
            return {
                ...state,
                shouldDataRefresh: action.payload.yesNo
            };

        default:
            return state;
    }
}

