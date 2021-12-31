import '@elastic/eui/dist/eui_theme_light.css';

import React from 'react';
import ReactDOM from 'react-dom';
import createCache from '@emotion/cache';
import { EuiProvider } from '@elastic/eui';
import '@elastic/eui/dist/eui_theme_light.css';

// import './index.css';
import App from './App';
// import * as serviceWorker from './serviceWorker';

// ReactDOM.render(<App />, document.getElementById('root'));

const cache = createCache({
    key: 'delven',
    container: document.querySelector('meta[name="global-styles"]'),
});

ReactDOM.render(
    <EuiProvider cache={cache} colorMode="light">
        <App />
    </EuiProvider>,
    document.getElementById('root')
);