import {
    SET_ACCESS_TOKEN
} from './actionTypes';


const initialState = {
    'bitbucket': {
        'accessToken': null
    }
};

export function apisReducer(state = initialState, action) {
    switch (action.type) {
        case SET_ACCESS_TOKEN:
            return {
                ...state,
                bitbucket: {
                    ...state.bitbucket,
                    accessToken: action.payload.accessToken
                }
            };

        default:
            return state;
    }
}

