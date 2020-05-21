import {inArray} from '../../utils/array';
import {getRepoPRDataPromises} from '../../utils/bitbucket';
import {handleRequestError} from '../commonActions';
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
import {addRepoSelection} from '../repos/actions';

export const addPullRequestsForRepo = (repoName) => {
    // TODO: Have way of using cached data if not too old rather than
    //  always fetching

    return (dispatch, getState) => {
        const state = getState();
        const loadingRepos = state.pullRequests.loadingRepos;

        if (!inArray(repoName, loadingRepos)) {
            dispatch(fetchPullRequestsForRepoBegin(repoName));
        }
        else {
            // Repo pull requests already being fetched, do nothing
            return null;
        }
    };
};
export const removePullRequestsForRepo = (repoName) => ({
    type: REMOVE_PULL_REQUESTS_FOR_REPO,
    payload: {
        repoName
    }
});

export const fetchPullRequestsForRepoBegin = (repoName) => {
    const action = {
        type: FETCH_PULL_REQUESTS_FOR_REPO_BEGIN,
        payload: {
            repoName
        }
    };

    return (dispatch, getState) => {
        const state = getState();
        const workspaceName = state.workspaces.selected.name;
        const accessToken = state.apis.bitbucket.accessToken;

        dispatch(action);
        getRepoPRDataPromises(workspaceName, repoName, accessToken)
            .then(pullRequestPromises => {
                pullRequestPromises.map(promise => {
                    promise.then(pullRequest => {
                        // TODO: Add check to see if we should update data
                        //   rather than add new

                        dispatch(addPullRequest(pullRequest));
                    });
                });
                return Promise.all(pullRequestPromises);
            })
            .catch(error => handleRequestError(
                dispatch, error,
                fetchPullRequestFailure, fetchPullRequestCancelled))
            .then(() => {
                dispatch(fetchPullRequestsForRepoEnd(repoName));
            });
    };
};

export const fetchPullRequestFailure = (error) => ({
    type: FETCH_PULL_REQUEST_FAILURE,
    payload: {
        error
    }
});

export const fetchPullRequestCancelled = () => ({
    type: FETCH_PULL_REQUEST_CANCELLED
});

export const addPullRequest = (pullRequest) => ({
    type: ADD_PULL_REQUEST,
    payload: {
        pullRequest
    }
});

export const fetchPullRequestsForRepoEnd = (repoName) => {
    const action = {
        type: FETCH_PULL_REQUESTS_FOR_REPO_END,
        payload: {
            repoName
        }
    };

    return (dispatch, getState) => {
        const state = getState();
        const selected = state.repos.selected;
        dispatch(action);

        if (!inArray(repoName, selected)) {
            dispatch(addRepoSelection(repoName));
        }
    };
};