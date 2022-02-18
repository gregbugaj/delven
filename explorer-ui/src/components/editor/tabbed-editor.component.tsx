import {useState, Fragment, useMemo} from "react"
import * as React from "react"

import {
    EuiButtonIcon,
    EuiFlexGroup,
    EuiFlexItem,
    EuiPanel,
    useGeneratedHtmlId,
    EuiContextMenuItem,
    EuiContextMenuPanel,
    EuiPopover,
    EuiIcon,
    EuiTabs,
    EuiTab,
} from "@elastic/eui"

import "../globalServices"
import ResizableDivider from "../explorer/ResizableDivider"
import styled from "styled-components"
import {IEditor, ISession} from "../workspace/slice"
import {useSessions} from "../workspace/WorkspacePanel"
import {useAppDispatch, useAppSelector} from "../../redux/hooks"
import {selectActiveSession} from "../workspace/selectors"

import ConsoleDisplay, { ConsoleMessageLevel, ConsoleMessage } from '../console/ConsoleDisplay'


const XComponent = styled.div`
  &:hover {
    background-color: #E8E8E8;
    border-radius: 50%;
  }
`
// Custom styling of the tabs
const EuiTabStyled = styled(EuiTab)`
{
  color: red;
}
`
console.info(globalThis.services)

const EditorTabs = React.memo(() => {
    const [selectedTabId, setSelectedTabId] = useState("editor-01--id")
    const activeSession = useAppSelector(selectActiveSession)
    const editors = activeSession?.editors as IEditor[]
    const tabs = []

    if (!activeSession?.editors) {
        return (<></>)
    }

    for (const editor of editors) {
        const tab = {
            id: `editor-${editor.id}--id`,
            name: `${editor.name} - ${editor.id}`,
            append: (
                <XComponent>
                    <EuiIcon type="cross" size="s" onClick={() => {
                        console.info(`Closing tab : ${editor.id}`)
                    }} />
                </XComponent>
            ),
            prepend: (<></>),
            disabled: false,
            href: `#/editor-${editor.id}#`,
            content: (
                <> Default </>
            )
        }
        tabs.push(tab)
    }

    // const selectedTabContent = useMemo(() => {
    //     return tabs.find((obj) => obj.id === selectedTabId)?.content
    // }, [selectedTabId])

    const onSelectedTabChanged = (id: string) => {
        setSelectedTabId(id)
    }

    const renderTabs = () => {
        return tabs.map((tab, index) => (
            <EuiTabStyled
                key={index}
                // href={tab.href}
                onClick={() => onSelectedTabChanged(tab.id)}
                isSelected={tab.id === selectedTabId}
                disabled={tab.disabled}
                prepend={tab.prepend}
                append={tab.append}
            >
                {tab.name}
            </EuiTabStyled>
        ))
    }

    return (
        <>
            <div>AA $: {Date.now()}</div>
            <EuiTabs size={"s"} bottomBorder={false} style={{lineHeight: "px"}}>{renderTabs()}</EuiTabs>
        </>
    )
})


function TabbedEditorComponent({
                                   isVisible,
                                   label
                               }: React.PropsWithChildren<{isVisible: boolean, label: string}>) {

    console.info(`Tabbed Component visible : ${isVisible}`)

    const [selectedSuperTabId, setSelectedSuperTabId] = useState("supertab-ast--id")

    const onSelectedSuperTabChanged = (id: string) => {
        setSelectedSuperTabId(id)
    }

    const [isPopoverOpen, setPopover] = useState(false)

    const [isCenterPanelOpen, setCenterPanelOpen] = useState(false)
    const [centerPanelState, setCenterPanelState] = useState({lhs: "50%", rhs: "50%"})

    const [isBottomPanelOpen, setBottomPanelOpen] = useState(false)
    const [bottomPanelState, setBottomPanelState] = useState({top: "70%", bottom: "30%"})

    const splitButtonPopoverId = useGeneratedHtmlId({
        prefix: "splitButtonPopover"
    })

    const leftPanelId = useGeneratedHtmlId({prefix: "splitPanelLeft"})
    const rightPanelId = useGeneratedHtmlId({prefix: "splitPanelRight"})

    const topPanelRef = React.createRef<HTMLDivElement>()
    const bottomPanelRef = React.createRef<HTMLDivElement>()

    const leftPanelRef = React.createRef<HTMLDivElement>()
    const rightPanelRef = React.createRef<HTMLDivElement>()

    const onExpandCollapseMainPanelClick = () => {
        const lhs = leftPanelRef.current
        const rhs = rightPanelRef.current
        if (!lhs || !rhs) {
            return
        }

        setCenterPanelOpen(!isCenterPanelOpen)
        setCenterPanelState({lhs: lhs.style.width, rhs: rhs.style.width})

        if (isCenterPanelOpen) {
            lhs.style.width = centerPanelState.lhs //"50%"
            rhs.style.width = centerPanelState.rhs //"50%"
            rhs.style.display = "flex"
        } else {
            lhs.style.width = "100%"
            rhs.style.width = "0%"
            rhs.style.display = "none"
        }
    }

    const onExpandCollapseBottomPanelClick = () => {
        const top = topPanelRef.current
        const bottom = bottomPanelRef.current
        if (!top || !bottom) {
            return
        }

        setBottomPanelOpen(!isBottomPanelOpen)
        setBottomPanelState({top: top.style.height, bottom: bottom.style.height})

        if (isBottomPanelOpen) {
            top.style.height = bottomPanelState.top
            bottom.style.height = bottomPanelState.bottom
            bottom.style.display = "flex"
        } else {
            top.style.height = "100%"
            bottom.style.height = "0%"
            bottom.style.minHeight = "24px"
        }
    }

    const onButtonClick = () => {
        setPopover(!isPopoverOpen)
    }

    const closePopover = () => {
        setPopover(false)
    }

    const items = [
        <EuiContextMenuItem key="closeAll" icon="pencil" onClick={closePopover}>
            Close All Tabs
        </EuiContextMenuItem>,
        <EuiContextMenuItem key="closeUnmodified" icon="share" onClick={closePopover}>
            Close Unmodified Tabs
        </EuiContextMenuItem>,
        <EuiContextMenuItem key="reopen" icon="share" onClick={closePopover}>
            Reopen Closed Tab
        </EuiContextMenuItem>
    ]

    const [toggle1On, setToggle1On] = useState(true)
    const activeSession = useAppSelector(selectActiveSession)

    // Both flex-groups need to have eui-fullHeight in order to have scrollable container

    let messages: ConsoleMessage[] = []
    messages.push({ time: new Date().toISOString(), level: "info", message: "Important message" })
    messages.push({ time: new Date().toISOString(), level: "info", message: "Important message" })
    messages.push({ time: new Date().toISOString(), level: "warn", message: "Important message" })
    messages.push({ level: "error", message: "Error message" })
    messages.push({ message: "Important message" })
    messages.push({ time: new Date().toISOString(), level: "raw", message: "Raw message" })
    messages.push({ time: new Date().toISOString(), level: "info", message: "Important message" })
    messages.push({ time: new Date().toISOString(), level: "warn", message: "Important message" })
    messages.push({ level: "error", message: "Error message" })
    messages.push({ message: "Important message" })
    messages.push({ time: new Date().toISOString(), level: "raw", message: "Raw message" })
    messages.push({ time: new Date().toISOString(), level: "raw", message: "Raw message" })
    messages.push({ time: new Date().toISOString(), level: "info", message: "Important message" })
    messages.push({ time: new Date().toISOString(), level: "warn", message: "Important message" })
    messages.push({ level: "error", message: "Error message" })
    messages.push({ message: "Important message" })
    messages.push({ time: new Date().toISOString(), level: "raw", message: "Raw message" })


    return (
        <>
            <div style={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
                border: "0px solid red",
                backgroundColor: "#FFF"
            }} className="eui-fullHeight">


                <div ref={topPanelRef} className="panel_top" style={{
                    display: "flex",
                    flex: "1 1 auto",
                    width: "100%",
                    border: "0px solid blue",
                    height: "70%",
                    minHeight: "30%"
                }}>
                    <div id={leftPanelId} ref={leftPanelRef} className="panel_main"
                         style={{display: "flex", width: "50%", minWidth: "200px"}}>

                        <EuiFlexGroup
                            style={{background: "#FFF", padding: "0px", margin: "0px", border: "0px solid green"}}
                            gutterSize="none"
                            direction="column"
                        >

                            <EuiFlexItem grow={false} style={{borderBottom: "1px solid #CCC"}}>
                                <EuiFlexGroup gutterSize="none"
                                              responsive={false}
                                              style={{
                                                  background: "#FFF",
                                                  paddingRight: "8px",
                                                  margin: "0px",
                                                  border: "0px solid red"
                                              }}>

                                    <EuiFlexItem grow={true}>
                                        <EditorTabs />
                                    </EuiFlexItem>

                                    <EuiFlexItem grow={false} style={{minWidth: "180px", border: "0px solid blue"}}>
                                        {/*marginLeft: Floats the items to the right of the container*/}
                                        <EuiFlexGroup responsive={false} gutterSize="xs"
                                                      style={{border: "0px solid green", marginLeft: "auto"}}>

                                            <EuiFlexItem grow={false} style={{border: "0px solid red"}}>
                                                <EuiButtonIcon
                                                    size="xs"
                                                    iconType={isCenterPanelOpen ? "arrowLeft" : "arrowRight"}
                                                    aria-label="More"
                                                    onClick={onExpandCollapseMainPanelClick}
                                                />
                                            </EuiFlexItem>
                                            <EuiFlexItem grow={false} style={{border: "0px solid red"}}>
                                                <EuiPopover
                                                    id={splitButtonPopoverId}
                                                    button={
                                                        <EuiButtonIcon
                                                            size="xs"
                                                            iconType="boxesVertical"
                                                            aria-label="More"
                                                            onClick={onButtonClick}
                                                        />
                                                    }
                                                    isOpen={isPopoverOpen}
                                                    closePopover={closePopover}
                                                    panelPaddingSize="none"
                                                    anchorPosition="downLeft"
                                                >
                                                    <EuiContextMenuPanel size="s" items={items} />
                                                </EuiPopover>
                                            </EuiFlexItem>
                                        </EuiFlexGroup>
                                    </EuiFlexItem>
                                </EuiFlexGroup>
                            </EuiFlexItem>

                            {/*Toolbar*/}
                            <EuiFlexItem grow={false}>
                                <EuiPanel color="danger" paddingSize="none"
                                          hasShadow={false}
                                          hasBorder={false}
                                          borderRadius="none"
                                          style={{
                                              border: "0px solid red",
                                              color: "#cfcfcf",
                                              backgroundColor: "#F5F5F5",
                                              borderBottom: "1px solid #CCC"
                                          }}>

                                    <EuiFlexGroup responsive={false} gutterSize="xs"
                                                  style={{border: "0px solid green", marginLeft: "auto"}}>

                                        {/*doubleArrowLeft doubleArrowRight*/}
                                        <EuiFlexItem grow={false} style={{border: "0px solid red"}}>

                                            <EuiButtonIcon
                                                title={toggle1On ? "Play" : "Pause"}
                                                aria-label={toggle1On ? "Play" : "Pause"}
                                                iconType={toggle1On ? "play" : "pause"}
                                                onClick={() => {
                                                    setToggle1On((isOn) => !isOn)
                                                }}
                                                color={"success"}
                                            />

                                        </EuiFlexItem>
                                        <EuiFlexItem grow={false} style={{border: "0px solid red"}}>
                                            <EuiButtonIcon
                                                size="xs"
                                                iconType="stop"
                                                aria-label="Stop"
                                                color={"danger"}
                                            />
                                        </EuiFlexItem>
                                    </EuiFlexGroup>

                                </EuiPanel>
                            </EuiFlexItem>

                            <EuiFlexItem grow={true}>
                                Session INFO : {Date.now()} : <h1 key={activeSession?.id}>{activeSession?.name}</h1>
                                <hr />
                                {activeSession?.editors.map((editor, key) => (
                                    <h1 key={editor.id}>Editor : {editor.name} : {editor.id}</h1>
                                ))}

                                {/*{selectedTabContent}*/}
                            </EuiFlexItem>
                        </EuiFlexGroup>
                    </div>

                    <ResizableDivider direction="horizontal" />

                    <div id={rightPanelId} ref={rightPanelRef}
                         style={{display: "flex", width: "50%", minWidth: "200px"}}>

                        <div style={{
                            display: "flex",
                            flexDirection: "column",
                            width: "100%",
                            flex: "1 1 auto",
                            overflow: "hidden"
                        }}>

                            <EuiFlexGroup gutterSize="none"
                                          responsive={false}
                                          direction={"column"}
                                          style={{
                                              background: "#FFF",
                                              paddingRight: "8px",
                                              margin: "0px",
                                              border: "0px solid red"
                                          }}>

                                <EuiFlexItem grow={false} style={{borderBottom: "1px solid #CCC"}}>
                                    <EuiTabs size={"s"} bottomBorder={false}>
                                        <EuiTab
                                            key="ast"
                                            href={"#/"}
                                            onClick={() => onSelectedSuperTabChanged("supertab-ast--id")}
                                            isSelected={"supertab-ast--id" === selectedSuperTabId}
                                        >
                                            Syntax Tree(AST)
                                        </EuiTab>

                                        <EuiTab
                                            key="compiledjs"
                                            href={"#/"}
                                            onClick={() => onSelectedSuperTabChanged("supertab-compiledjs--id")}
                                            isSelected={"supertab-compiledjs--id" === selectedSuperTabId}
                                        >
                                            Generated Code
                                        </EuiTab>

                                        <EuiTab
                                            key="supertab-optimized"
                                            href={"#/"}
                                            onClick={() => onSelectedSuperTabChanged("supertab-optimized--id")}
                                            isSelected={"supertab-optimized--id" === selectedSuperTabId}
                                        >
                                            Job Graph / Optimizer
                                        </EuiTab>

                                        <EuiTab
                                            key="supertab-execution"
                                            href={"#/"}
                                            onClick={() => onSelectedSuperTabChanged("supertab-execution--id")}
                                            isSelected={"supertab-execution--id" === selectedSuperTabId}
                                        >
                                            Execution
                                        </EuiTab>

                                    </EuiTabs>
                                </EuiFlexItem>

                                <EuiFlexItem grow={false} style={{minWidth: "180px", border: "0px solid blue"}}>
                                    <p>Tab : {Date.now()}: {selectedSuperTabId} </p>
                                </EuiFlexItem>
                            </EuiFlexGroup>
                        </div>
                    </div>
                </div>

                <ResizableDivider direction="vertical" />

                <div ref={bottomPanelRef}
                     style={{
                         display: "flex",
                         flex: "1 1 auto",
                         width: "100%",
                         height: "30%",
                         border: "0px solid green"
                     }}
                     className="panel_bottom">
                    <EuiFlexGroup
                        style={{background: "#FFF", padding: "0px", margin: "0px", border: "0px solid green"}}
                        gutterSize="none"
                        direction="column"
                    >

                        <EuiFlexItem grow={false} style={{
                            backgroundColor: "#f5f5f5",
                            borderBottom: "1px solid #CCC"
                        }}>
                            <EuiFlexGroup gutterSize="none"
                                          responsive={false}
                                          style={{
                                              paddingTop: "0px",
                                              paddingRight: "8px",
                                              paddingLeft: "8px",
                                              margin: "0px",
                                              border: "0px solid red"
                                          }}>

                                <EuiFlexItem grow={true}>
                                    <strong>Terminal</strong>
                                </EuiFlexItem>

                                <EuiFlexItem grow={false}
                                             style={{minWidth: "180px", border: "0px solid blue", margin: "0px"}}>

                                    {/*marginLeft: Floats the items to the right of the container*/}
                                    <EuiFlexGroup responsive={false}
                                                  style={{border: "0px solid green", marginLeft: "auto"}}>

                                        <EuiFlexItem grow={false} style={{border: "0px solid red"}}>
                                            <EuiButtonIcon
                                                size="xs"
                                                // style={{height:"12px"}}
                                                iconType={isBottomPanelOpen ? "arrowDown" : "arrowUp"}
                                                aria-label="Collapse"
                                                onClick={onExpandCollapseBottomPanelClick}
                                            />
                                        </EuiFlexItem>
                                    </EuiFlexGroup>
                                </EuiFlexItem>
                            </EuiFlexGroup>
                        </EuiFlexItem>


                        <EuiFlexItem grow={true}  className="eui-yScroll"
                        				style={{ border: '0px solid red',
                                        backgroundColor: '#303030', padding: '0px'}}>

                            <ConsoleDisplay key={"main"} messages={messages} />

                        </EuiFlexItem>
                    </EuiFlexGroup>
                </div>
            </div>
        </>
    )
}

export default React.memo(TabbedEditorComponent)

/*
    <div style={{backgroundColor: "#FFF", display: "flex", height: "75%", minHeight: "200px"}}>

    </div>

    <ResizableDivider direction="vertical" />

    <div style={{display: "flex", height: "25%", minHeight: "120px"}}>
        Console terminal
    </div>
*/