import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import {composeWithDevTools} from 'redux-devtools-extension';
import {persistStore, persistReducer} from 'redux-persist';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import storage from 'redux-persist/lib/storage';
import rootReducer from './rootReducer';

const persistConfig = {
    key: 'root',
    storage: storage,
    stateReconciler: autoMergeLevel2,
    blacklist: [ 'apis' ]
};

const pReducer = persistReducer(persistConfig, rootReducer);

const store = createStore(
    pReducer,
    undefined, // Get initial state from subdirectory reducers
    composeWithDevTools(
        applyMiddleware(thunk)
    )
);
export default store;
export const persistor = persistStore(store);
