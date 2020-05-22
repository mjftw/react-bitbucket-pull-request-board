import {fetchPullRequestsForRepoBegin} from '../pullRequests/actions';

import {
    SET_REFRESH_MINS,
    SET_SHOULD_DATA_REFRESH,
    REFRESH_DATA
} from './actionTypes';



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

export const refreshData = () => {
    const action = {
        type: REFRESH_DATA
    };

    return (dispatch, getState) => {
        const state = getState();
        const selected = state.repos.selected;

        dispatch(action);
        selected.map(repoName => {
            dispatch(fetchPullRequestsForRepoBegin(repoName));
        });
    };
};