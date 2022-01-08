import React, {useEffect, useState, useCallback, ReactNode} from "react";
import {name, actions, reducer, ISession} from "./slice";
import {useAppDispatch, useAppSelector} from "../../redux/hooks";
import {makeSelectSessions, selectCount} from "./selectors";
import {shallowEqual} from "react-redux";
import {string} from "prop-types";

// https://react-redux.js.org/api/hooks

export function useSessions({limit = 1} = {}) {
    const dispatch = useAppDispatch();
    const store = useAppSelector(makeSelectSessions(), shallowEqual)
    useEffect(() => {
        if (!store?.sessions?.length && !store?.loading) {
            console.info('useSessions : Loading')
            dispatch(actions.fetch({limit}))
        }
    }, [])

    return store;
}

function HeaderTimer() {
    return (
        <div>
            render time [{Date.now()}]
            <hr/>
        </div>
    )
}


function Session({children, props}) {
    console.info('Creating Session')
    return (
        <>
            Current : {Date.now()}
            <HeaderTimer/>
            <SessionContent/>
            {children}
        </>
    );
}

function SessionContent({children, props}) {
    console.info('Creating Session')
    const state = useSessions({limit: 1})
    // const count = useAppSelector(selectCount);
    const count = state.sessions.length
    const dispatch = useAppDispatch();
    const [value, setValue] = useState<number>();

    const handleChange = (e) => {
        const num = parseInt(e.target.value);
        setValue(num);
    };

    return (
        <>
            {console.info('rendering main***')}
            <p>Session Counter: {count} [{Date.now()}]</p>
            <button onClick={() => dispatch(actions.createSession())}>Create session</button>

            <ListSessions/>
            <hr/>
            Child component :
            <HeaderTimer/>
        </>
    );
};

const SessionItem = React.memo(function ({children}: { children: ReactNode }, {id}: { id: string }) {
    const dispatch = useAppDispatch();
    const session = useAppSelector((state) => state.session.sessions.find(item => item.id === id))

    const handleClick = useCallback((id) => (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        console.info('Event **')
        console.info(event)
        console.info(`Handler called : ${id}`)
        dispatch(actions.removeTabById(id))
    }, [dispatch]);

    if (session === undefined) {
        return <></>
    }

    return (
        <li key={id}>
            <div>
                VAL : {session.id} : {session.name} - [{Date.now()}]
                <a onClick={() => dispatch(actions.removeSession(session.id))}>Remove</a>
            </div>
            <ul>
                {session.editors.map(editor => {
                    return (
                        <>
                            <li style={{marginLeft: '20px'}}>
                                {editor.id} - {editor.name} ::
                                <button onClick={handleClick(editor.id)}>Remove</button>
                            </li>
                        </>
                    )
                })}
            </ul>
        </li>
    )
})

function ListSessions() {
    const state = useSessions({limit: 1})
    const sessions = state.sessions
    // const items = useAppSelector((state) => {
    //     return state['session'].sessions
    // });
    return (
        <>
            {console.info('rendering items***')}
            <h1>Session items</h1>
            <ul>
                {sessions.map((item) => (
                    <SessionItem id={item.id}/>
                ))}
            </ul>
        </>
    )
}

// export default Session;
export default React.memo(Session);
