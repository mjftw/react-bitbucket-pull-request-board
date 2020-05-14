import {
    SET_ACCESS_TOKEN
} from './actionTypes';


const initialState = {
    "bitbucket": {
        "accessToken": null
    }
};

export function externalReducer(state, action) {
    let newState = (state === undefined) ? {...initialState} : {...state};

    switch (action.type) {
        case SET_ACCESS_TOKEN:
            newState.bitbucket.accessToken = action.payload.accessToken;
            break;

        default:
            break;
    }

    return newState;
}

