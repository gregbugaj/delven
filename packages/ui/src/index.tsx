
import React from 'react';
// import {StrictMode} from "react";
import ReactDOM from 'react-dom';
import createCache from '@emotion/cache';
import {EuiProvider} from '@elastic/eui';
import {Provider} from "react-redux";
import { container } from './ioc';

import {store} from "./redux/store";
// import App from './App';
import {InversifyContextProvider} from "./ioc.react";
import {HelloComponentWithInjection} from "./Hello";

import '@elastic/eui/dist/eui_theme_light.css';
import './index.css';


const AppInjected = () => {
    return (
        <InversifyContextProvider container={container}>
            <div>
                <HelloComponentWithInjection/>
            </div>
        </InversifyContextProvider>
    );
};

ReactDOM.render(<AppInjected/>, document.getElementById('root'));

/*
if (false) {
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
 }

 */
