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
import Session, { HeaderTimer } from './components/session/session.component';

import App from './App';


const cache = createCache({
    key: 'delven',
    container: document.querySelector('meta[name="global-styles"]'),
});

ReactDOM.render(
    <StrictMode>
        <EuiProvider colorMode="light">
            <Provider store={store}>

                <App/>
                {/*<Session label='SessionLabelProp'>*/}
                {/*     Child component (no session ref)  : {Date.now()}*/}
                {/*    <HeaderTimer label={`  > Session child : ${Date.now()}`}/>*/}
                {/*</Session>*/}
            </Provider>
        </EuiProvider>
    </StrictMode>,
    document.getElementById('root')
)