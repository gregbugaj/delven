import React, {useState, Fragment, useMemo} from "react"

import {
    EuiButton,
    EuiButtonIcon,
    EuiFlexGroup,
    EuiFlexItem,
    EuiPanel,
    EuiResizableContainer,
    useGeneratedHtmlId,
    EuiContextMenuItem,
    EuiContextMenuPanel,
    EuiPopover,
    EuiIcon,
    EuiTabs,
    EuiTab,
    EuiSpacer,
    EuiText,
    EuiNotificationBadge
} from "@elastic/eui"

import "../globalServices"
import ResizableDivider from "../explorer/ResizableDivider"
import styled from "styled-components"
import {ISession} from "../workspace/slice"
import {useSessions} from "../workspace/WorkspacePanel"
import {useAppDispatch, useAppSelector} from "../../redux/hooks"

const XComponent = styled.div`
  &:hover {
    background-color: #E8E8E8;
    border-radius: 50%;
  }
`

const tabs = [
    {
        id: "cobalt--id",
        name: "Cobalt",
        content: (
            <Fragment>
                <EuiText>
                    <p>
                        Cobalt is a chemical element with symbol Co and atomic number 27.
                        Like nickel, cobalt is found in the Earth&rsquo;s crust only in
                        chemically combined form, save for small deposits found in alloys of
                        natural meteoric iron. The free element, produced by reductive
                        smelting, is a hard, lustrous, silver-gray metal.
                    </p>
                </EuiText>
            </Fragment>
        )
    },
    {
        id: "dextrose--id",
        name: "Dextrose",
        content: (
            <Fragment>
                <EuiText>
                    <p>
                        Intravenous sugar solution, also known as dextrose solution, is a
                        mixture of dextrose (glucose) and water. It is used to treat low
                        blood sugar or water loss without electrolyte loss.
                    </p>
                </EuiText>
            </Fragment>
        )
    },
    {
        id: "hydrogen--id",
        disabled: false,
        name: "Hydrogen",
        prepend: <EuiIcon type="heatmap" />,
        content: (
            <Fragment>
                <EuiText>
                    <p>
                        Hydrogen is a chemical element with symbol H and atomic number 1.
                        With a standard atomic weight of 1.008, hydrogen is the lightest
                        element on the periodic table
                    </p>
                </EuiText>
            </Fragment>
        )
    },
    {
        id: "sample-script-001--id",
        name: "Sample Script",
        append: (
            <XComponent>
                <EuiIcon type="cross" size="s" onClick={() => {  }}  />
            </XComponent>
        ),
        href: "#/navigation/tabs#monosodium",
        content: (
            <Fragment>
                <EuiSpacer />
                <EuiText>
                    <p>
                        Monosodium glutamate (MSG, also known as sodium glutamate) is the
                        sodium salt of glutamic acid, one of the most abundant naturally
                        occurring non-essential amino acids. Monosodium glutamate is found
                        naturally in tomatoes, cheese and other foods.
                    </p>
                </EuiText>
            </Fragment>
        )
    }
]

function TabbedEditorComponent({
                                   isVisible,
                                   label
                               }: React.PropsWithChildren<{isVisible: boolean, label: string}>) {

    console.info(`Tabbed Component visible`)

    const [selectedSuperTabId, setSelectedSuperTabId] = useState("supertab-ast--id")

    const onSelectedSuperTabChanged = (id: string) => {
        setSelectedSuperTabId(id)
    }


    const [selectedTabId, setSelectedTabId] = useState("cobalt--id")

    const selectedTabContent = useMemo(() => {
        return tabs.find((obj) => obj.id === selectedTabId)?.content
    }, [selectedTabId])

    const onSelectedTabChanged = (id: string) => {
        setSelectedTabId(id)
    }

    const renderTabs = () => {
        return tabs.map((tab, index) => (
            <EuiTab
                key={index}
                href={tab.href}
                onClick={() => onSelectedTabChanged(tab.id)}
                isSelected={tab.id === selectedTabId}
                disabled={tab.disabled}
                prepend={tab.prepend}
                append={tab.append}
            >
                {tab.name}
            </EuiTab>
        ))
    }

    const [isPopoverOpen, setPopover] = useState(false)
    const [isCenterPanelOpen, setCenterPanelOpen] = useState(false)

    const splitButtonPopoverId = useGeneratedHtmlId({
        prefix: "splitButtonPopover"
    })

    const leftPanelId = useGeneratedHtmlId({prefix: "splitPanelLeft"})
    const rightPanelId = useGeneratedHtmlId({prefix: "splitPanelRight"})

    const leftPanelRef = React.createRef<HTMLDivElement>(null)
    const rightPanelRef = React.createRef<HTMLDivElement>(null)

    const onExpandCollapseButtonClick = () => {
        setCenterPanelOpen(!isCenterPanelOpen)

        const lhs = leftPanelRef.current
        const rhs = rightPanelRef.current

        if (!lhs || !rhs) {
            return
        }

        if (isCenterPanelOpen) {
            lhs.style.width = "50%"
            rhs.style.width = "50%"
            rhs.style.display = "flex"
        } else {
            lhs.style.width = "100%"
            rhs.style.width = "0%"
            rhs.style.display = "none"
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

    const state = useSessions({limit: 100})
    const sessions = state.sessions as ISession[]

    const session = useAppSelector((state) => state.session.sessions.find(item => item.id === state.activeSessionId))
    console.info(session)

    // Both flex-groups need to have eui-fullHeight in order to have scrollable container
    return (
        <>
            <div style={{display: "flex", width: "100%", height: "25%"}} className="eui-fullHeight">
                <div id={leftPanelId} ref={leftPanelRef} style={{display: "flex", width: "50%", minWidth: "200px"}}>

                    <EuiFlexGroup
                        style={{background: "#FFF", padding: "0px", margin: "0px", border: "0px solid green"}}
                        gutterSize="none"
                        direction="column"
                    >

                        <EuiFlexItem grow={false}>
                            <EuiFlexGroup gutterSize="none"
                                          responsive={false}
                                          style={{
                                              background: "#FFF",
                                              paddingTop: "8px",
                                              paddingRight: "8px",
                                              margin: "0px",
                                              border: "0px solid red"
                                          }}>

                                <EuiFlexItem grow={true}>
                                    <EuiTabs size={"s"} bottomBorder={false}>{renderTabs()}</EuiTabs>
                                </EuiFlexItem>

                                <EuiFlexItem grow={false} style={{minWidth: "180px", border: "0px solid blue"}}>
                                    {/*marginLeft: Floats the items to the right of the container*/}
                                    <EuiFlexGroup responsive={false} gutterSize="xs"
                                                  style={{border: "0px solid green", marginLeft: "auto"}}>

                                        {/*doubleArrowLeft doubleArrowRight*/}
                                        <EuiFlexItem grow={false} style={{border: "0px solid red"}}>
                                            <EuiButtonIcon
                                                display="base"
                                                size="xs"
                                                iconType={isCenterPanelOpen ? "doubleArrowLeft" : "doubleArrowRight"}
                                                aria-label="More"
                                                onClick={onExpandCollapseButtonClick}
                                            />
                                        </EuiFlexItem>
                                        <EuiFlexItem grow={false} style={{border: "0px solid red"}}>
                                            <EuiPopover
                                                id={splitButtonPopoverId}
                                                button={
                                                    <EuiButtonIcon
                                                        display="base"
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

                        <EuiFlexItem grow={false}>
                            <EuiPanel color="danger" paddingSize="none" style={{
                                border: "0px solid red",
                                height: "1px",
                                color: "#CCC",
                                backgroundColor: "#CCC"
                            }} />
                        </EuiFlexItem>

                        <EuiFlexItem grow={true}
                                     style={{
                                         background: "#FFF",
                                         padding: "0px",
                                         margin: "0px",
                                         border: "0px solid red"
                                     }}>


                            Session Content : {sessions.map((session, index) => (<h1 key={session.id}>{session.name}</h1>))}
                            <hr/>

                            {selectedTabContent}

                        </EuiFlexItem>
                    </EuiFlexGroup>
                </div>

                <ResizableDivider direction="horizontal" />

                <div id={rightPanelId} ref={rightPanelRef} style={{display: "flex", width: "50%", minWidth: "200px"}}>

                    <div style={{
                        display: "flex",
                        flexDirection: "column",
                        width: "100%",
                        flex: "1 1 auto",
                        overflow: "hidden"
                    }}>
                        <div style={{backgroundColor:"#FFF", display: "flex", height: "75%", minHeight: "200px"}}>

                            <EuiFlexGroup gutterSize="none"
                                          responsive={false}
                                          direction={"column"}
                                          style={{
                                              background: "#FFF",
                                              paddingTop: "8px",
                                              paddingRight: "8px",
                                              margin: "0px",
                                              border: "0px solid red"
                                          }}>

                                <EuiFlexItem grow={false}>
                                    <EuiTabs size={"s"} bottomBorder={false}>
                                        <EuiTab
                                            key='ast'
                                            href={"#/"}
                                            onClick={() => onSelectedSuperTabChanged('supertab-ast--id')}
                                            isSelected={'supertab-ast--id' === selectedSuperTabId}
                                        >
                                         Syntax Tree(AST)
                                        </EuiTab>

                                        <EuiTab
                                            key='compiledjs'
                                            href={"#/"}
                                            onClick={() => onSelectedSuperTabChanged('supertab-compiledjs--id')}
                                            isSelected={'supertab-compiledjs--id' === selectedSuperTabId}
                                        >
                                         Generated Code
                                        </EuiTab>

                                        <EuiTab
                                            key='supertab-optimized'
                                            href={"#/"}
                                            onClick={() => onSelectedSuperTabChanged('supertab-optimized--id')}
                                            isSelected={'supertab-optimized--id' === selectedSuperTabId}
                                        >
                                            Job Graph / Optimizer
                                        </EuiTab>
                                    </EuiTabs>
                                </EuiFlexItem>

                                <EuiFlexItem grow={false}>
                                    <EuiPanel color="danger" paddingSize="none" style={{
                                        border: "0px solid red",
                                        height: "1px",
                                        color: "#CCC",
                                        backgroundColor: "#CCC"
                                    }} />
                                </EuiFlexItem>

                                <EuiFlexItem grow={false} style={{minWidth: "180px", border: "0px solid blue"}}>
                                    <p>Tab {selectedTabId} :: {selectedSuperTabId} </p>
                                </EuiFlexItem>

                            </EuiFlexGroup>

                        </div>

                        <ResizableDivider direction="vertical" />

                        <div style={{display: "flex", height: "25%", minHeight: "120px"}}>
                            Console terminal
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default React.memo(TabbedEditorComponent)


/*
        <EuiFlexGroup
            className="eui-fullHeight"
            gutterSize="none"
            direction="row"
        >
        </EuiFlexGroup>

                <EuiFlexGroup
                    style={{background: "#FFF", padding: "0px", margin: "0px", border: "0px solid green"}}
                    gutterSize="none"
                    direction="column"
                >

                    <EuiFlexItem grow={false}>
                        <EuiFlexGroup gutterSize="none"
                                      responsive={false}
                                      style={{
                                          background: "#FFF",
                                          padding: "0px",
                                          margin: "0px",
                                          border: "0px solid red"
                                      }}>
                            <EuiFlexItem grow={true}>
                                <EuiTabs size={"s"}>{renderTabs()}</EuiTabs>
                            </EuiFlexItem>

                            <EuiFlexItem grow={false}>
                                Expand | Collapse
                            </EuiFlexItem>

                        </EuiFlexGroup>
                    </EuiFlexItem>

                    <hr/>
                    <EuiFlexItem grow={true}
                                 style={{background: "#FFF", padding: "0px", margin: "0px", border: "0px solid red"}}>
                        {selectedTabContent}
                    </EuiFlexItem>
                </EuiFlexGroup>

*/

/*
<EuiFlexGroup
    style={{background: "#FFF", padding: "0px", margin: "0px", border: "4px solid green"}}
    grow={true}
    className="eui-fullHeight"
    gutterSize="none"
    direction="column"
>
    <EuiFlexItem grow={false}>
        {/!*        <EuiFlexGroup gutterSize="none"
                              responsive={false}
                              style={{background: "#FFF", padding: "0px", margin: "0px", border: "1px solid red"}}>
                    <EuiFlexItem grow={true}>
                        <EuiTabs size={"s"}>{renderTabs()}</EuiTabs>
                    </EuiFlexItem>
                    <EuiFlexItem grow={false}>
                        RHS
                    </EuiFlexItem>
                </EuiFlexGroup>*!/}
    </EuiFlexItem>

    <EuiFlexItem grow={true}
                 style={{background: "#CCC", padding: "0px", margin: "0px", border: "1px solid red"}}>
        {selectedTabContent}
    </EuiFlexItem>
</EuiFlexGroup>

*/


/*

<EuiFlexGroup
style={{background: "#FFF", padding: "0px", margin: "0px", border: "4px solid green"}}
grow={true}
className="eui-fullHeight"
gutterSize="none"
direction="column"
    >
    <EuiFlexItem grow={false}>
    <EuiFlexGroup gutterSize="none"
responsive={false}
style={{background: "#FFF", padding: "0px", margin: "0px", border: "1px solid red"}}>
<EuiFlexItem grow={true}>
    <EuiTabs size={"s"}>{renderTabs()}</EuiTabs>
</EuiFlexItem>
<EuiFlexItem grow={false}>
    RHS
</EuiFlexItem>
</EuiFlexGroup>
</EuiFlexItem>

<EuiFlexItem grow={true}
             style={{background: "#CCC", padding: "0px", margin: "0px", border: "1px solid red"}}>
    {selectedTabContent}
</EuiFlexItem>
</EuiFlexGroup>*/
