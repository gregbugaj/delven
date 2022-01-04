import {createSlice} from "@reduxjs/toolkit";

// The initial state of the component
export const initialState = {
    data: [],
    value: 0,
    loading: false,
    error: false,
};

export const Slice = createSlice({
    name: "counter",
    initialState: initialState,
    reducers: {
        increment: state => {
            state.value += 1;
        },
        decrement: state => {
            state.value -= 1;
        },
        changeByValue: (state, action) => {
            state.value += action.payload;
        }
    }
});

export const {increment, decrement, changeByValue} = Slice.actions;
export default Slice.reducer;