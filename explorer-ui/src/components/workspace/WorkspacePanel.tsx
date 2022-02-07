import React, {useCallback, useContext, useEffect} from "react"
import {
    EuiCollapsibleNavGroup,
    EuiButton,
    EuiPanel,
    EuiFlexItem,
    EuiFlexGroup,
    EuiListGroup,
    EuiListGroupItem, EuiButtonIcon
} from "@elastic/eui"

import "../globalServices"
import {SharedDeployPanel} from "../shared/SharedPanelContainer"
import {useAppDispatch, useAppSelector} from "../../redux/hooks"
import {makeSelectSessions} from "./selectors"
import {shallowEqual} from "react-redux"
import {actions, ISession} from "./slice"

// https://react-redux.js.org/api/hooks

export function useSessions({limit = 100}) {
    const dispatch = useAppDispatch()
    const store = useAppSelector(makeSelectSessions(), shallowEqual)
    // Initial load
    useEffect(() => {
        if (!store?.sessions?.length && !store?.loading) {
            console.info("useSessions : Loading")
            dispatch(actions.fetch({limit}))
        }
    }, [])

    return store
}


const SessionItem = React.memo(function({id}: React.PropsWithChildren<{id: string}>) {
    console.info(`Session item : ${id}`)
    const dispatch = useAppDispatch()
    const session = useAppSelector((state) => state.session.sessions.find(item => item.id === id))

    // useCallback
    const removeSessionHandler = useCallback((id) => {
        console.info(`Removing session : ${id}`)
        dispatch(actions.removeSession(session.id))
    }, [dispatch])

    /* (id) => (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
         console.info(`Activate session : ${id}`)
         console.info(event)
         // dispatch(actions.removeSession(session.id))
     }*/

    const activateSessionHandler = useCallback((id) => {
        console.info(`Activate session : ${id}`)
        dispatch(actions.markSessionActive(session.id))
    }, [dispatch])

    if (session === undefined) {
        return <></>
    }

    let label = `${Date.now()} - ${session.name}`
    return (
        <EuiListGroupItem href="#" label={label} color="text" onClick={() => {
            console.info(`Group item exec : ${session.id}`)
            activateSessionHandler(session.id)
        }}
                          extraAction={{
                              color: "text",
                              onClick: () => {
                                  console.info("Group item exec:delete")
                                  removeSessionHandler(session.id)
                              },
                              iconType: "trash",
                              iconSize: "s",
                              "aria-label": `Remove session : ${session.id}`,
                              alwaysShow: true
                          }}

        />
    )
})

function ListSessions() {
    const state = useSessions({limit: 100})
    const sessions = state.sessions as ISession[]
    // const items = useAppSelector((state) => {
    //     return state['session'].sessions
    // });
    return (
        <>
            {sessions.map((item) => (
                <SessionItem key={item.id} id={item.id} />
            ))}
        </>
    )
}

function WorkspaceSidePanel({
                                isVisible,
                                label
                            }: React.PropsWithChildren<{isVisible: boolean, label: string}>) {

    console.info(`WorkspaceSidePanel visible : ${isVisible} : [${label}]`)
    const dispatch = useAppDispatch()

    return (
        <EuiPanel tabIndex={0}
                  hasShadow={false}
                  hasBorder={false}
                  borderRadius="none"
                  paddingSize="none"
                  hidden={!isVisible}
        >
            <EuiFlexGroup gutterSize="none" direction="column" className="eui-fullHeight">
                <EuiFlexItem grow={true}>

                    <EuiCollapsibleNavGroup>
                        <EuiButton fill fullWidth iconType="plusInCircleFilled"
                                   onClick={() => dispatch(actions.createSession())}>
                            Create Workspace
                        </EuiButton>
                    </EuiCollapsibleNavGroup>

                    <EuiCollapsibleNavGroup
                        title={
                            <a
                                className="eui-textInheritColor"
                                href="#/workspace"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <h1>Workspaces</h1>
                            </a>
                        }
                        buttonElement="div"
                        iconType="logoAppSearch"
                        isCollapsible={true}
                        initialIsOpen={true}
                        onToggle={(isOpen: boolean) => () => {
                        }}
                    >
                        <EuiListGroup
                            aria-label="Panel" // A11y : EuiCollapsibleNavGroup can't correctly pass the `title` as the `aria-label` to the right HTML element, so it must be added manually
                            maxWidth="none"
                            color="subdued"
                            gutterSize="none"
                            size="s"
                        >
                            <ListSessions />
                        </EuiListGroup>


                    </EuiCollapsibleNavGroup>
                </EuiFlexItem>

                {/* anchor to the bottom of the view */}
                <EuiFlexItem grow={false}>
                    <SharedDeployPanel />
                </EuiFlexItem>
            </EuiFlexGroup>
        </EuiPanel>
    )
}

export default React.memo(WorkspaceSidePanel)