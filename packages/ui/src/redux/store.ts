import {configureStore} from "@reduxjs/toolkit";
import logger from 'redux-logger'
import thunkMiddleware from 'redux-thunk'
import createReducer from './reducers';

// import {createInjectorsEnhancer, forceReducerReload} from 'redux-injectors';
// import createSagaMiddleware from 'redux-saga';
//
// const reduxSagaMonitorOptions = {};
// const sagaMiddleware = createSagaMiddleware(reduxSagaMonitorOptions);
// const {run: runSaga} = sagaMiddleware;

// const enhancers = [
//     createInjectorsEnhancer({
//         createReducer,
//         runSaga,
//     }),
// ];

export const store = configureStore({
    reducer: createReducer(),
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .prepend(
                thunkMiddleware
            )
            // prepend and concat calls can be chained
            .concat(logger),
    devTools: process.env.NODE_ENV !== 'production',
    // enhancers
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type
export type AppDispatch = typeof store.dispatch
