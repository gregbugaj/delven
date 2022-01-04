import '@elastic/eui/dist/eui_theme_light.css';

import React from 'react';
import {StrictMode} from "react";
import ReactDOM from 'react-dom';
import createCache from '@emotion/cache';
import {EuiProvider} from '@elastic/eui';
import '@elastic/eui/dist/eui_theme_light.css';
import {Provider} from "react-redux";

// import './index.css';
// import App from './App';
import {Store} from "./store";
import Counter from './features/Counter';

const cache = createCache({
    key: 'delven',
    container: document.querySelector('meta[name="global-styles"]'),
});

ReactDOM.render(
    <EuiProvider cache={cache} colorMode="light">
        <Provider store={Store}>
            <Counter/>
        </Provider>
    </EuiProvider>,
    document.getElementById('root')
);