import React, {useEffect, useState} from "react";
import {name, actions, reducer, ISession} from "./slice";
import {useAppDispatch, useAppSelector} from "../../redux/hooks";
import {makeSelectSessions, selectCount} from "./selectors";
import {shallowEqual, useSelector} from "react-redux";

import { useInjectReducer, useInjectSaga } from 'redux-injectors';

// https://react-redux.js.org/api/hooks

export function useSessions({limit = 1} = {}) {
    useInjectReducer({ key: name, reducer });
    console.group();
    console.info('Store created')
    const dispatch = useAppDispatch();
    const store = useAppSelector(makeSelectSessions, shallowEqual)
    useEffect(() => {
        console.info('useEffect ')
        // @ts-ignore
        if (!store?.sessions?.length && !store?.loading) {
            console.info('Loading')
            dispatch(actions.fetch({limit}))
        }
    }, [])

    console.info('Store ready')
    console.groupEnd();
    return store
}

function Session({children, props}) {
    console.info('Creating Session')
    const store = useSessions({limit: 1})

    const count = useAppSelector(selectCount);
    const dispatch = useAppDispatch();
    const [value, setValue] = useState<number>();

    const handleChange = (e) => {
        const num = parseInt(e.target.value);
        setValue(num);
    };

    return (
        <>
            {console.info('rendering main***')}
            <p>Session Counter: {count}</p>
            <button onClick={() => dispatch(actions.createSession())}>Create session</button>

            <ListSessions/>
        </>
    );
};

const SessionItem = ({id}) => {
    const session = useAppSelector((state) => state.session.sessions.find(item => item.id === id))
    if (session === undefined) {
        return <></>
    }
    return (
        <li key={id}> VAL : {session.id} : {session.name}</li>
    )
}

function ListSessions() {
    const store = useSessions({limit: 1})

    console.info('-----------')
    const items = useAppSelector((state) => {
        console.info('XXX')
        return state['session'].sessions
    });

    return (
        <>
            {console.info('rendering items***')}
            {console.info(items)}
            <h1>Session items</h1>
            <ul>
                {items.map((item) => (
                    <SessionItem id={item.id}/>
                ))}
            </ul>
        </>
    )
}

export default Session;
// export default React.memo(Session);
