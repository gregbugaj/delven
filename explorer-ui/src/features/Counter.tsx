import React, {useState} from "react";
import {
    increment,
    decrement,
    changeByValue,
} from "./slice";
import {useAppDispatch, useAppSelector} from "../hooks";
import {selectCount} from "./selectors";

// https://react-redux.js.org/api/hooks

const Counter = () => {
    const count = useAppSelector(selectCount);
    const dispatch = useAppDispatch();
    const [value, setValue] = useState<number>();

    const handleChange = (e) => {
        const num = parseInt(e.target.value);
        setValue(num);
    };

    return (
        <>
            <p>Count: {count}</p>
            <button onClick={() => dispatch(increment())}>Increment</button>
            <button onClick={() => dispatch(decrement())}>Decrement</button>
            <button onClick={() => dispatch(changeByValue(3))}>
                Change by Value
            </button>
        </>
    );
};
export default Counter;