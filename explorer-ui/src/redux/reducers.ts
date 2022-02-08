/**
 * Combine all reducers in this file and export the combined reducers.
 */

import {combineReducers} from "@reduxjs/toolkit"

// import {reducer as counterReducer} from "../features/slice";

import {reducer as sessionReducer} from "../components/workspace/slice"

/**
 * Merges the main reducer with the router state and dynamically injected reducers
 */
export default function createReducer(injectedReducers = {}) {
    const rootReducer = combineReducers({
        // counter: counterReducer,
        session: sessionReducer,
        ...injectedReducers
    })

    return rootReducer
}