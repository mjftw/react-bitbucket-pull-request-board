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
                action.payload.repoName
            ];
            break;

        case FETCH_PULL_REQUEST_FAILURE:
            newState.fetchError = action.payload.error;
            break;

        case FETCH_PULL_REQUEST_CANCELLED:
            break;

        case FETCH_PULL_REQUESTS_FOR_REPO_END:
            newState.loadingRepos = newState.loadingRepos.filter(repoName =>
                repoName !== action.payload.repoName);
            break;

        case ADD_PULL_REQUEST:
            const allPullRequestUrls = newState.all.map(
                pullRequest => pullRequest.prUrl);

            const index = allPullRequestUrls.indexOf(
                action.payload.pullRequest.prUrl);

            // Pull request already added, so update instead
            if (index >= 0) {
                const newAll = [ ...newState.all ];
                newAll[ index ] = action.payload.pullRequest;
                newState.all = newAll;
            }
            else {
                newState.all = [ ...newState.all, action.payload.pullRequest ];
            }
            break;

        case REMOVE_PULL_REQUESTS_FOR_REPO:
            newState.all = newState.all.filter(pullRequest =>
                pullRequest.repoName !== action.payload.repoName);
            break;

        default:
            break;
    }

    return newState;
}
