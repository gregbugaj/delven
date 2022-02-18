import '@elastic/eui/dist/eui_theme_light.css';

import React from 'react';
import {StrictMode} from "react";
import ReactDOM from 'react-dom';
import createCache from '@emotion/cache';
import {EuiProvider} from '@elastic/eui';
import '@elastic/eui/dist/eui_theme_light.css';
import {Provider} from "react-redux";

import './index.css';
import {store} from "./redux/store";
import Session, { HeaderTimer } from '../examples/session/session.component';

import App from './App';

const cache = createCache({
    key: 'delven',
    container: document.querySelector('meta[name="global-styles"]'),
});

ReactDOM.render(
    // Strict mode causes us double renders, due to need to run analysis on the components
    // <StrictMode> </StrictMode>
        <EuiProvider colorMode="light">
            <Provider store={store}>
                <App/>
            </Provider>
        </EuiProvider>
    ,
    document.getElementById('root')
)