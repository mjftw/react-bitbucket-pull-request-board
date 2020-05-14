import {combineReducers} from 'redux';
import {workspacesReducer} from './workspaces/reducers';
import {reposReducer} from './repos/reducers';
import {refreshReducer} from './refresh/reducers';
import {externalReducer} from './external/reducers';
import {pullRequestsReducer} from './pullRequests/reducers';

export default combineReducers({
    workspaces: workspacesReducer,
    repos: reposReducer,
    refresh: refreshReducer,
    external: externalReducer,
    pullRequests: pullRequestsReducer
});