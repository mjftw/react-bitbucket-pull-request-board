import {getWorkspaces} from '../../utils/bitbucket';
import {cancelRequests} from '../../utils/courier';
import {fetchReposPages} from '../repos/actions';
import {handleRequestError} from '../commonActions';
import {
    SET_WORKSPACE_SELECTION,
    FETCH_WORKSPACES_BEGIN,
    FETCH_WORKSPACES_SUCCESS,
    FETCH_WORKSPACES_FAILURE
} from './actionTypes';


export const setWorkspaceSelection = (workspace) => {
    const action = {
        type: SET_WORKSPACE_SELECTION,
        payload: {
            workspace
        }
    };

    return dispatch => {
        dispatch(action);
        cancelRequests();
        dispatch(fetchReposPages());
    };
};

export const fetchWorkspaces = () => {
    return (dispatch, getState) => {
        const state = getState();
        const accessToken = state.external.bitbucket.accessToken;

        dispatch(fetchWorkspacesBegin());
        return getWorkspaces(accessToken)
            .then(workspaces => {
                dispatch(fetchWorkspacesSuccess(workspaces));

                // Select first workspace found
                if (workspaces && workspaces.length) {
                    dispatch(setWorkspaceSelection(workspaces[ 0 ]));
                }

                return workspaces;
            })
            .catch(error =>
                handleRequestError(dispatch, error,
                    fetchWorkspacesFailure));
    };
};

export const fetchWorkspacesBegin = () => ({
    type: FETCH_WORKSPACES_BEGIN
});

export const fetchWorkspacesSuccess = (workspaces) => ({
    type: FETCH_WORKSPACES_SUCCESS,
    payload: {
        workspaces
    }
});

export const fetchWorkspacesFailure = (error) => ({
    type: FETCH_WORKSPACES_FAILURE,
    payload: {
        error
    }
});
