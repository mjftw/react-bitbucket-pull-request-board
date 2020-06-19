import {getWorkspaces} from '../../utils/bitbucket';
import {cancelRequests} from '../../utils/courier';
import {fetchReposPages, updateReposSelection} from '../repos/actions';
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
        dispatch(updateReposSelection([]));
        dispatch(fetchReposPages());
    };
};

export const fetchWorkspaces = () => {
    return (dispatch, getState) => {
        const state = getState();
        const accessToken = state.apis.bitbucket.accessToken;
        const workspaceSelected = state.workspaces.selected;

        dispatch(fetchWorkspacesBegin());
        return getWorkspaces(accessToken)
            .then(workspaces => {
                dispatch(fetchWorkspacesSuccess(workspaces));

                let selectedInFetched = false;
                if (workspaceSelected) {
                    selectedInFetched = workspaces.map(w => w.name).indexOf(
                        workspaceSelected.name) >= 0;
                }

                // Select first workspace found if no workspace selected or
                //  if workspace selected is not found
                if (!selectedInFetched && workspaces && workspaces.length) {
                    dispatch(setWorkspaceSelection(workspaces[ 0 ]));
                }
                else {
                    // setWorkspaceSelection would usually do this step
                    dispatch(fetchReposPages());
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
