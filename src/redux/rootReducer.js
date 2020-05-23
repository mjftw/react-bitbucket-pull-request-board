import {combineReducers} from 'redux';
import {workspacesReducer} from './workspaces/reducers';
import {reposReducer} from './repos/reducers';
import {refreshReducer} from './refresh/reducers';
import {apisReducer} from './apis/reducers';
import {pullRequestsReducer} from './pullRequests/reducers';

export default combineReducers({
    workspaces: workspacesReducer,
    repos: reposReducer,
    refresh: refreshReducer,
    apis: apisReducer,
    pullRequests: pullRequestsReducer
});