import {
    REMOVE_PULL_REQUESTS_FOR_REPO,
    ADD_PULL_REQUEST,
    FETCH_PULL_REQUESTS_FOR_REPO_BEGIN,
    FETCH_PULL_REQUEST_FAILURE,
    FETCH_PULL_REQUESTS_FOR_REPO_END
} from './actionTypes';

const initialState = {
    'loadingRepos': [],
    'fetchError': null,
    'all': []
};

export function pullRequestsReducer(state, action) {
    if (state === undefined) {
        return initialState;
    }

    switch (action.type) {
        case FETCH_PULL_REQUESTS_FOR_REPO_BEGIN:
            return {
                ...state,
                fetchError: null,
                loadingRepos: [
                    ...state.loadingRepos,
                    action.payload.repoName
                ]
            };

        case FETCH_PULL_REQUEST_FAILURE:
            return {
                ...state,
                fetchError: action.payload.error
            };

        case FETCH_PULL_REQUESTS_FOR_REPO_END:
            return {
                ...state,
                loadingRepos: state.loadingRepos.filter(repoName =>
                    repoName !== action.payload.repoName)

            };

        case ADD_PULL_REQUEST:
            const allPullRequestUrls = state.all.map(
                pullRequest => pullRequest.prUrl);

            const index = allPullRequestUrls.indexOf(
                action.payload.pullRequest.prUrl);

            // Pull request already added, so update instead
            let newAll = null;
            if (index >= 0) {
                newAll = [ ...state.all ];
                newAll[ index ] = action.payload.pullRequest;
            }
            else {
                newAll = [ ...state.all, action.payload.pullRequest ];
            }

            return {
                ...state,
                all: newAll
            };

        case REMOVE_PULL_REQUESTS_FOR_REPO:
            return {
                ...state,
                all: state.all.filter(pullRequest =>
                    pullRequest.repoName !== action.payload.repoName)
            };

        default:
            return state;
    }
}
