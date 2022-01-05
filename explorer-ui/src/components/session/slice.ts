/* eslint-disable no-param-reassign */
/*
 * Session Slice
 *
 * Here we define:
 * - The shape of our container's slice of Redux store,
 * - All the actions which can be triggered for this slice, including their effects on the store.
 *
 * Note that, while we are using dot notation in our reducer, we are not actually mutating the state
 * manually. Under the hood, we use immer to apply these updates to a new copy of the state.
 * Please see https://immerjs.github.io/immer/docs/introduction for more information.
 *
 */
import {createSlice} from "@reduxjs/toolkit";

export type IEditor = {
    name: string;
    id: string;
    content?: string;
}

export type ISession = {
    id: string;
    name: string;
    editors: IEditor[]
}

// The initial state of the component
export const initialState = {
    sessions: [] as ISession[],
    loading: false,
    error: false,
};

let mockSession = (): ISession => {
    let max = 100
    let id = Math.floor(Math.random() * max)
    return {
        name: `Session : ${id}`,
        id: `${id}`,
        editors: [
            {
                id: "00",
                name: "Editor 00"
            },
            {
                id: "01",
                name: "Editor 01"
            }
        ]
    }
}

if (false) {
    let sessions = [mockSession(), mockSession(), mockSession()]
    localStorage.setItem('sessions', JSON.stringify(sessions));
}

const slice = createSlice({
    name: "session",
    initialState,
    reducers: {

        /**
         * Load all sessions from the store
         * @param state
         */
        fetch: (state, payload) => {
            console.info('fetch')
            state.loading = true;
            state.error = false;
            state.sessions = JSON.parse(String(localStorage.getItem('sessions')))
        },

        /**
         * Add new session to the store
         * @param state
         */
        createSession: (state) => {
            const session = mockSession()
            state.sessions.push(session)
        },

        removeSession: (state, action) => {
            let id = action.payload.id
        }
    }
});

export const {name, actions, reducer} = slice

// export const {increment, decrement, changeByValue} = slice.actions;
// export default Slice.reducer;

