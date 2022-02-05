import React, {useLayoutEffect, useState, forwardRef} from "react"

import {
    EuiHeaderLogo,
    EuiHeader,
    EuiPageTemplate,
    EuiFlexItem,
    EuiButtonIcon,
    EuiPanel,
    EuiControlBar,
    EuiFlexGroup,
    EuiHeaderSectionItem,
    EuiHeaderLinks,
    EuiHeaderLink,
    EuiHeaderSection,
    EuiHeaderSectionItemButton,
    EuiIcon,
    EuiButton,
    useGeneratedHtmlId
} from "@elastic/eui"

import "../../App.css"

import ResizableDivider from './ResizableDivider';


import EditorPanel from "../editor/EditorPanel"
import WorkspacePanel from "../workspace/WorkspacePanel"
import SettingsPanel from "../settings/SettingsPanel"
import TerminalPanel from "../terminal/TerminalPanel"
import RunnerPanel from "../runner/RunnerPanel"
import ContentStage from "../stage/Stage"
import GitPanel from "../repository/RepositoriesPanel"
import HelpPanel from "../help/HelpPanel"

const ExplorerAppLayout = () => {

    const exitPath = () => {
        return "#"
    }
    const [navIsOpen, setNavIsOpen] = useState(true)

    /**
     * Accordion toggling
     */
    const [openGroups, setOpenGroups] = useState(
        JSON.parse(String(localStorage.getItem("openNavGroups"))) || [
            "Kibana",
            "Learn"
        ]
    )

    // Save which groups are open and which are not with state and local store
    const toggleAccordion = (isOpen: boolean, title?: string) => {
        if (!title) return
        const itExists = openGroups.includes(title)
        if (isOpen) {
            if (itExists) return
            openGroups.push(title)
        } else {
            const index = openGroups.indexOf(title)
            if (index > -1) {
                openGroups.splice(index, 1)
            }
        }
        setOpenGroups([...openGroups])
        localStorage.setItem("openNavGroups", JSON.stringify(openGroups))
    }

    const collapsibleNavId = useGeneratedHtmlId({prefix: "collapsibleNav"})

    return (
        <>
            <EuiHeader
                position="static"

            >

                <EuiHeaderSection grow={false}>
                    <EuiHeaderSectionItem>
                        <EuiHeaderLogo href="#" iconType="logoElastic">
                            Delven
                        </EuiHeaderLogo>

                        <EuiHeaderLinks aria-label="App navigation links">
                            <EuiButton size="s">Share</EuiButton>
                            <EuiButton size="s">Fork</EuiButton>
                        </EuiHeaderLinks>

                    </EuiHeaderSectionItem>
                </EuiHeaderSection>

                <EuiHeaderSection grow={false}>

                    <EuiHeaderSectionItem>
                        <EuiHeaderLinks aria-label="App navigation">
                            <EuiHeaderLink>Docs</EuiHeaderLink>
                            <EuiHeaderLink>Code</EuiHeaderLink>
                            <EuiHeaderLink iconType="help">Help</EuiHeaderLink>
                        </EuiHeaderLinks>
                    </EuiHeaderSectionItem>
                </EuiHeaderSection>
            </EuiHeader>

            <SidenavWithContent />
        </>
    )
}


export const SidenavWithContent = () => {

    const [renderType, setRenderType] = React.useState("editor")
    const [open, setOpen] = React.useState(true)

    function handleViewChange(renderTypeChange: string) {
        if (renderTypeChange !== renderType) {
            setOpen(true)
            setRenderType(renderTypeChange)
        } else if (renderTypeChange === renderType) {
            setOpen(!open)
        }
    }

    let sidePanelOpenStyle = {
        padding: "0px", margin: "0px", width:"240px", maxWidth: "540px", minWidth: "240px", display: ""
    }

    let sidePanelCloseStyle = {
        padding: "0px", margin: "0px", width: "0px", maxWidth: "540px",  display: "none"
    }

    const resizablePanelLhsId = useGeneratedHtmlId({prefix: "resizablePanel"})
    const resizablePanelRhsId = useGeneratedHtmlId({prefix: "resizablePanel"})

    const resizablePanelLhsRef= React.useRef<HTMLDivElement>(null);
    const resizablePanelRhsRef = React.useRef<HTMLDivElement>(null);

    // Current error
    // Function components cannot be given refs. Attempts to access this ref will fail. Did you mean to use React.forwardRef()
    useLayoutEffect(() => {
        console.info('Render complete')
        console.log(resizablePanelLhsRef);
        console.log(resizablePanelRhsRef);
    })

    // @ts-ignore
    return (

        <EuiPageTemplate fullHeight template="empty" restrictWidth={false} paddingSize="none">
            <EuiFlexGroup
                className="eui-fullHeight"
                gutterSize="none"
                direction="column"
                responsive={false}
            >

                {/* <EuiFlexItem grow={false}>
                    <EuiPanel color="danger" >
                      TOP Panel
                    </EuiPanel>
                  </EuiFlexItem>

                  <EuiSpacer size="l" />

                  */}

                {/* eui-yScroll */}
                <EuiFlexItem className="eui-fullHeight">
                    <EuiFlexGroup className="eui-fullHeight" gutterSize="none">

                        <EuiFlexItem grow={false}>
                            <EuiPanel tabIndex={0} className="eui-"
                                      hasShadow={false}
                                      hasBorder={false}
                                      borderRadius="none"
                                      paddingSize="none"
                                      style={{background: "#404040", padding: "8px"}}
                            >

                                <EuiFlexGroup
                                    gutterSize="none"
                                    direction="column"
                                    className="eui-fullHeight"
                                >

                                    <EuiFlexItem grow={true}>
                                        <EuiButtonIcon
                                            iconType="apps"
                                            aria-label="Applications"
                                            color="ghost"
                                            size="m"
                                            iconSize="xl"
                                            style={{marginBottom: "16px"}}
                                            onClick={() => {
                                                console.info("Apps clicked")
                                            }}
                                        />

                                        <EuiButtonIcon
                                            iconType="documents"
                                            aria-label="Sessions and Editors"
                                            color="ghost"
                                            size="m"
                                            iconSize="xl"
                                            style={{marginBottom: "16px"}}
                                            onClick={(e) => handleViewChange("editor")}
                                        />

                                        <EuiButtonIcon
                                            iconType="database"
                                            aria-label="Queries"
                                            color="ghost"
                                            size="m"
                                            iconSize="xl"
                                            style={{marginBottom: "16px"}}
                                            onClick={(e) => handleViewChange("workspace")}
                                        />

                                        <EuiButtonIcon
                                            iconType="logoGithub"
                                            aria-label="Share"
                                            color="ghost"
                                            size="m"
                                            iconSize="xl"
                                            style={{marginBottom: "16px"}}
                                            onClick={(e) => handleViewChange("repository")}
                                        />

                                        <EuiButtonIcon
                                            iconType="gear"
                                            aria-label="Apps"
                                            color="ghost"
                                            size="m"
                                            iconSize="xl"
                                            style={{marginBottom: "16px"}}
                                            onClick={(e) => handleViewChange("settings")}
                                        />

                                        <EuiButtonIcon
                                            iconType="console"
                                            aria-label="Apps"
                                            color="ghost"
                                            size="m"
                                            iconSize="xl"
                                            style={{marginBottom: "16px"}}
                                            // onClick={(e) => handleViewChange('terminal')}
                                            onClick={() => {
                                            }}
                                            href="/runner/terminal"
                                        />
                                    </EuiFlexItem>

                                    {/* anchor to the bottom of the view */}
                                    <EuiFlexItem grow={false}>
                                        <EuiButtonIcon
                                            iconType="help"
                                            aria-label="Icon button"
                                            color="ghost"
                                            size="m"
                                            iconSize="xl"
                                            onClick={(e) => handleViewChange("help")}
                                        />
                                    </EuiFlexItem>
                                </EuiFlexGroup>
                            </EuiPanel>
                        </EuiFlexItem>

                        <EuiFlexItem
                            id={resizablePanelLhsId}
                            grow={false}
                            style={(open) ? sidePanelOpenStyle : sidePanelCloseStyle}
                        >

                            <EditorPanel isVisible={renderType === "editor"} label="editor" />
                            <WorkspacePanel isVisible={renderType === "workspace"} label="workspace" />
                            <SettingsPanel isVisible={renderType === "settings"} label="settings" />
                            <RunnerPanel isVisible={renderType === "runners"} label="runners" />
                            <GitPanel isVisible={renderType === "repository"} label="git" />
                            <HelpPanel isVisible={renderType === "help"} label="help" />
                            <TerminalPanel isVisible={renderType === "terminal"} label="terminal" />

                        </EuiFlexItem>

                        {/*/!*<ResizibleDivider direction="horizontal"/>*!/*/}
                        {/*<div style={{ display:"flex", width:"100%", minWidth:"300px"}}>*/}
                        {/*    <div style={{ display:"flex", width:"50%"}}>Left</div>*/}
                        {/*<ResizibleDivider direction="horizontal" containerARef={resizablePanelLhsRef} containerBRef={resizablePanelRhsRef}/>*/}
                        {/*</div>*/}

                        <ResizableDivider direction="horizontal"/>
                        {/*style={{ display:"flex", width:"100%", minWidth:"300px"}}*/}
                        <EuiFlexItem id={resizablePanelRhsId}  >
                            <ContentStage label="Main stage" />
                        </EuiFlexItem>
                    </EuiFlexGroup>
                </EuiFlexItem>

                <EuiFlexItem grow={false}>

                    <EuiPanel
                        hasShadow={false}
                        hasBorder={false}
                        borderRadius="none"
                        paddingSize="none"
                        style={{background: " ", padding: "0px", margin: "0px", minHeight: "80px"}}
                    >

                        <EuiControlBar
                            size="s"
                            position="relative"
                            showContent={false}
                            controls={
                                [{
                                    iconType: "submodule",
                                    id: "root_icon",
                                    controlType: "icon",
                                    "aria-label": "Project Root"
                                },
                                    {
                                        controlType: "breadcrumbs",
                                        id: "current_file_path",
                                        responsive: true,
                                        breadcrumbs: [
                                            {
                                                text: "src"
                                            },
                                            {
                                                text: "components"
                                            }
                                        ]
                                    },
                                    {
                                        controlType: "spacer"
                                    },
                                    {
                                        controlType: "icon",
                                        id: "status_icon",
                                        iconType: "alert",
                                        color: "warning",
                                        "aria-label": "Repo Status"
                                    },
                                    {
                                        controlType: "divider"
                                    },
                                    {
                                        controlType: "button",
                                        id: "open_history_view",
                                        label: "Show history",
                                        color: "primary",
                                        onClick: () => {
                                        }
                                    }]
                            }
                        />

                    </EuiPanel>
                </EuiFlexItem>
            </EuiFlexGroup>
        </EuiPageTemplate>
    )
}


export default ExplorerAppLayout