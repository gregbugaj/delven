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

export type SessionType = typeof initialState

let mockSession = (): ISession => {
    let max = 100
    const gen = () => Math.floor(Math.random() * max)
    let id = gen()
    return {
        name: `Session : ${id}`,
        id: `${id}`,
        editors: [
            {
                id: `${gen()}`,
                name: "Editor 01"
            },
            {
                id: `${gen()}`,
                name: "Editor 02"
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
            try {
                state.sessions = JSON.parse(String(localStorage.getItem('sessions')))
            } catch (e) {
                state.error = true
                console.error(e)
            }
            state.loading = false;
        },

        /**
         * Add new session to the store
         * @param state
         */
        createSession: (state) => {
            const session = mockSession()
            state.sessions.push(session)
        },

        /**
         * Remove session from the store
         * @param state
         * @param action
         */
        removeSession: (state, action) => {
            const sessionId = action.payload
            if (sessionId === undefined) {
                return
            }
            const sessions = state.sessions
            sessions.forEach((item, index) => {
                if (item.id === sessionId) {
                    console.info(`Session removed : ${sessionId}`)
                    sessions.splice(index, 1)
                }
            })
        },

        /**
         * Remove tab by ID
         * @param state
         * @param action
         */
        removeTabById: (state, action) => {
            const tabId = action.payload
            if (tabId === undefined) {
                return
            }
            const sessions = state.sessions
            sessions.forEach((session, index) => {
                let editors = session.editors
                editors?.forEach((editor, index) => {
                    if (editor.id === tabId) {
                        console.info(`Tab removed : ${tabId}`)
                        editors.splice(index, 1)
                    }
                })
            })
        }
    }
});

export const {name, actions, reducer} = slice

// export const {increment, decrement, changeByValue} = slice.actions;
// export default Slice.reducer;

