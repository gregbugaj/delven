import {createSelector} from "@reduxjs/toolkit";
import {name, initialState} from './slice';
// createSelector

/**
 * Direct selector to the active state
 */
const selectSessions = (state) => state[name] || initialState

/**
 * Default selector
 */

const makeSelectSessions = () => createSelector(selectSessions, (state) => state);

/**
 * Other specific selectors
 * @param state
 */
export const selectCount = (state) => state[name].sessions.length;

export const selectActiveSession= (state) => state[name].sessions.length;

export {selectSessions, makeSelectSessions}