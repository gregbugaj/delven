import {createSlice} from "@reduxjs/toolkit";

// The initial state of the component
export const initialState = {
    data: [],
    loading: false,
    error: false,
};

export const Slice = createSlice({
    name: "counter",
    initialState: {
        value: 0
    },
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

export const selectCount = (state) => state.counter.value;
export const {increment, decrement, changeByValue} = Slice.actions;
export default Slice.reducer;