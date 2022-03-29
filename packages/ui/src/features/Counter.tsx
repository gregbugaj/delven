import React, {useState} from "react";
import {name, actions, reducer} from "./slice";
import {useAppDispatch, useAppSelector} from "../redux/hooks";
import {shallowEqual} from 'react-redux'
import {selectCount} from "./selectors";

// https://react-redux.js.org/api/hooks

const Counter = () => {
    console.info('Creating XX')
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
            <button onClick={() => dispatch(actions.increment())}>Create session</button>
            <button onClick={() => dispatch(actions.decrement())}>Decrement</button>
            <button onClick={() => dispatch(actions.changeByValue(3))}>
                Change by Value
            </button>
        </>
    );
};
export default Counter;