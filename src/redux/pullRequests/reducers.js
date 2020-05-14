const initialState = {
    "loading": false,
    "all": []
};

export function pullRequestsReducer(state, action) {
    let newState = (state === undefined) ? {...initialState} : {...state};

    switch (action.type) {
        default:
            break;
    }

    return newState;
}
