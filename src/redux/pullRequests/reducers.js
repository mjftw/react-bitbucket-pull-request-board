import {
    ADD_PULL_REQUESTS_FOR_REPO,
    REMOVE_PULL_REQUESTS_FOR_REPO,
    ADD_PULL_REQUEST,
    UPDATE_PULL_REQUEST,
    FETCH_PULL_REQUESTS_FOR_REPO_BEGIN,
    FETCH_PULL_REQUEST_BEGIN,
    FETCH_PULL_REQUEST_SUCCESS,
    FETCH_PULL_REQUEST_FAILURE,
    FETCH_PULL_REQUEST_CANCELLED,
    FETCH_PULL_REQUESTS_FOR_REPO_END
} from './actionTypes';
import {inArray} from '../../utils/array';

const initialState = {
    "loadingRepos": [],
    "fetchError": null,
    "all": []
};

export function pullRequestsReducer(state, action) {
    let newState = (state === undefined) ? {...initialState} : {...state};

    switch (action.type) {
        case FETCH_PULL_REQUESTS_FOR_REPO_BEGIN:
            newState.fetchError = null;
            newState.loadingRepos = [
                ...newState.loadingRepos,
                action.payload.repo
            ];
            break;

        case FETCH_PULL_REQUEST_FAILURE:
            newState.fetchError = action.payload.error;
            break;

        case FETCH_PULL_REQUEST_CANCELLED:
            break;

        case FETCH_PULL_REQUESTS_FOR_REPO_END:
            newState.loadingRepos = newState.loadingRepos.filter(
                repoName => !inArray(repoName, newState.loadingRepos)
            );
            break;

        case ADD_PULL_REQUEST:
            newState.all = [ ...newState.all, action.payload.pullRequest ];
            break;

        default:
            break;
    }

    return newState;
}
