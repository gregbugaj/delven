import {createSelector} from "@reduxjs/toolkit"
import {name, initialState} from "./slice"
import {Exception} from "sass"

// createSelector
// createSelector creates memoized selector functions that only recalculate the output if the inputs change.
// https://stackoverflow.com/questions/63493433/confusion-about-useselector-and-createselector-with-redux-toolkit

/**
 *
 * Direct selector to the active state
 */
const selectSessions = (state) => state[name] || initialState

/**
 * Default selector
 */

const makeSelectSessions = () => createSelector(selectSessions, (state) => state)

/**
 * Other specific selectors
 * @param state
 */
export const selectCount = (state) => state[name].sessions.length

/**
 * Active Session selector
 * @param state
 */
const selectActiveSession = (state) => {
    if (state[name].activeSessionId === null) {
        return state[name].sessions[0]
    }
    return state[name].sessions.find(session => session.id === state[name].activeSessionId)
}

export {selectSessions, makeSelectSessions, selectActiveSession}