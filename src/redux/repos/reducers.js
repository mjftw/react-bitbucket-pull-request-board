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
    'loading': false,
    'fetchError': null,
    'all': [],
    'selected': []
};

export function reposReducer(state = initialState, action) {
    switch (action.type) {
        case ADD_REPO_SELECTION:
            return {
                ...state,
                selected: [
                    ...state.selected,
                    action.payload.repoName
                ]
            };

        case REMOVE_REPO_SELECTION:
            return {
                ...state,
                selected: state.selected.filter(selectedRepo =>
                    selectedRepo !== action.payload.repoName)
            };

        case FETCH_REPOS_PAGES_BEGIN:
            return {
                ...state,
                all: [],
                loading: true,
                fetchError: null
            };

        case FETCH_REPOS_PAGE_SUCCESS:
            return {
                ...state,
                all: [
                    ...state.all,
                    ...action.payload.repos
                ]
            };

        case FETCH_REPOS_PAGE_CANCELLED:
            return {
                ...state,
                loading: false
            };

        case FETCH_REPOS_PAGE_FAILURE:
            return {
                ...state,
                all: [],
                loading: false,
                fetchError: action.payload.error,
            };

        case FETCH_REPOS_PAGES_END:
            return {
                ...state,
                loading: false
            };

        default:
            return state;
    }
}