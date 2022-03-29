/* eslint-disable no-param-reassign */
/*
 * Slice
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

// The initial state of the component
export const initialState = {
    data: [],
    value: 0,
    loading: false,
    error: false,
};

const slice = createSlice({
    name: "counter",
    initialState,
    reducers: {
        increment: (state) => {
            state.value += 1;
        },
        decrement: (state) => {
            state.value -= 1;
        },
        changeByValue: (state, action) => {
            state.value += action.payload;
        }
    }
});

export const {name, actions, reducer} = slice

// export const {increment, decrement, changeByValue} = slice.actions;
// export default Slice.reducer;