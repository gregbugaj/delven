import '@elastic/eui/dist/eui_theme_light.css';

import React from 'react';
import {StrictMode} from "react";
import ReactDOM from 'react-dom';
import createCache from '@emotion/cache';
import {EuiProvider} from '@elastic/eui';
import '@elastic/eui/dist/eui_theme_light.css';
import {Provider} from "react-redux";

import './index.css';
// import App from './App';
import {store} from "./redux/store";
import Counter from './features/Counter';
import Session from './components/session/session.component';
import {actions} from "./components/session/slice";

const cache = createCache({
    key: 'delven',
    container: document.querySelector('meta[name="global-styles"]'),
});


ReactDOM.render(
    <StrictMode>
        <EuiProvider colorMode="light">
            <Provider store={store}>
                <Session>
                </Session>
            </Provider>

        </EuiProvider>
    </StrictMode>,
    document.getElementById('root')
)