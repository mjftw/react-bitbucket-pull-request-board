import {
    ADD_REPO_SELECTION,
    REMOVE_REPO_SELECTION,
    FETCH_REPOS_PAGES_BEGIN,
    FETCH_REPOS_PAGE_SUCCESS,
    FETCH_REPOS_PAGE_FAILURE,
    FETCH_REPOS_PAGE_CANCELLED,
    FETCH_REPOS_PAGES_END
} from './actionTypes';


const initialState = {
    "loading": false,
    "fetchError": null,
    "all": [],
    "selected": []
};

export function reposReducer(state, action) {
    let newState = (state === undefined) ? {...initialState} : {...state};

    switch (action.type) {
        case ADD_REPO_SELECTION:
            newState.selected = [
                ...newState.selected,
                action.payload.repoName
            ];
            break;

        case REMOVE_REPO_SELECTION:
            newState.selected = newState.selected.filter(selectedRepo =>
                selectedRepo !== action.payload.repoName);
            break;

        case FETCH_REPOS_PAGES_BEGIN:
            newState.all = [];
            newState.selected = [];
            newState.loading = true;
            newState.fetchError = null;
            break;

        case FETCH_REPOS_PAGE_SUCCESS:
            newState.all = [
                ...newState.all,
                ...action.payload.repos
            ];
            break;

        case FETCH_REPOS_PAGE_CANCELLED:
            newState.loading = false;
            break;

        case FETCH_REPOS_PAGE_FAILURE:
            newState.all = [];
            newState.loading = false;
            newState.fetchError = action.payload.error;
            break;

        case FETCH_REPOS_PAGES_END:
            newState.loading = false;
            break;

        default:
            break;
    }

    return newState;
}