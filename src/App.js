import React, {Component} from 'react';
import {Provider} from 'react-redux';
import {Grommet} from 'grommet';
import store from './redux/store';
import BitbucketKeyManager from './containers/BitbucketKeyManager';
import RefreshManager from './containers/RefreshManager';
import MainWindow from './presenters/MainWindow';

const theme = {
    global: {
        font: {
            family: 'Roboto',
            size: '14px',
            height: '20px',
        },
        colors: {
            background: 'light-1',
            focus: 'neutral-3'
        }
    },
};

class App extends Component {
    render() {
        return (
            <Provider store={store}>
                <Grommet theme={theme}>
                    <BitbucketKeyManager />
                    <RefreshManager />
                    <MainWindow />
                </Grommet>
            </Provider>
        );
    }
}

export default App;
