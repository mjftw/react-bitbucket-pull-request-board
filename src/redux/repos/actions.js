import {getRepoListPage} from '../../utils/bitbucket';
import {handleRequestError} from '../commonActions';
import {
    SET_REPOS_SELECTION,
    FETCH_REPOS_PAGES_BEGIN,
    FETCH_REPOS_PAGE_SUCCESS,
    FETCH_REPOS_PAGE_FAILURE,
    FETCH_REPOS_PAGE_CANCELLED,
    FETCH_REPOS_PAGES_END
} from './actionTypes';

export const setReposSelection = (repoNames) => ({
    type: SET_REPOS_SELECTION,
    payload: {
        repoNames
    }
});


export const fetchReposPages = () => {
    const action = {
        type: FETCH_REPOS_PAGES_BEGIN
    };

    return dispatch => {
        dispatch(action);
        dispatch(fetchReposPageBegin());
    };
};

export const fetchReposPageBegin = (pageUrl) => {
    return (dispatch, getState) => {
        const state = getState();
        const accessToken = state.apis.bitbucket.accessToken;
        const workspaceName = state.workspaces.selected.name;
        // Get next page if page URL, otherwise first page
        getRepoListPage(pageUrl, workspaceName, accessToken)
            .then(reposPage => {
                dispatch(fetchReposPageSuccess(reposPage.repoNames));
                if (reposPage.nextPageUrl) {
                    dispatch(fetchReposPageBegin(reposPage.nextPageUrl));
                }
                else {
                    dispatch(fetchReposPagesEnd());
                }
            })
            .catch(error =>
                handleRequestError(dispatch, error,
                    fetchReposPageFailure, fetchReposPageCancelled));
    };
};

export const fetchReposPageSuccess = (repos) => ({
    type: FETCH_REPOS_PAGE_SUCCESS,
    payload: {
        repos
    }
});

export const fetchReposPageFailure = (error) => ({
    type: FETCH_REPOS_PAGE_FAILURE,
    payload: {
        error
    }
});

export const fetchReposPageCancelled = () => ({
    type: FETCH_REPOS_PAGE_CANCELLED
});

export const fetchReposPagesEnd = () => ({
    type: FETCH_REPOS_PAGES_END
});