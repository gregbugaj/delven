import {EuiButtonIcon, EuiFlexGroup, EuiPanel, EuiResizableContainer} from "@elastic/eui"
import React, {useState, Fragment, useMemo} from "react"

import "../globalServices"
import ResizableDivider from "../explorer/ResizableDivider"

function ScorllableComponentSample({
                                   isVisible,
                                   label
                               }: React.PropsWithChildren<{isVisible: boolean, label: string}>) {

    console.info(`Tabbed Component visible : ${isVisible} : [${label}]`)


    // Both flex-groups need to have eui-fullHeight in order to have scrollable container
    return (
        <>
            <div style={{display: "flex", width: "100%", height: "25%"}} className="eui-fullHeight">
                <div style={{display: "flex", width: "50%", minWidth: "200px"}}  >
                    <EuiPanel
                        tabIndex={0}
                        className="eui-yScroll"
                        hasShadow={false}
                        hasBorder={false}
                        borderRadius="none"
                        paddingSize="none"
                        style={{background: "#FFF", padding: "0px", margin: "0px", border: "1px solid red"}}
                    >
                        1 Test<br />Test<br />Test<br />Test<br />Test<br />Test<br />Test<br />Test<br />Test<br />Test<br />
                        2 Test<br />Test<br />Test<br />Test<br />Test<br />Test<br />Test<br />Test<br />Test<br />Test<br />
                        3 Test<br />Test<br />Test<br />Test<br />Test<br />Test<br />Test<br />Test<br />Test<br />Test<br />
                        4 Test<br />Test<br />Test<br />Test<br />Test<br />Test<br />Test<br />Test<br />Test<br />Test<br />
                        5 Test<br />Test<br />Test<br />Test<br />Test<br />Test<br />Test<br />Test<br />Test<br />Test<br />
                        6 Test<br />Test<br />Test<br />Test<br />Test<br />Test<br />Test<br />Test<br />Test<br />Test<br />
                        7 Test<br />Test<br />Test<br />Test<br />Test<br />Test<br />Test<br />Test<br />Test<br />Test<br />
                    </EuiPanel>
                </div>

                <ResizableDivider direction="horizontal" />

                <div style={{display: "flex",width: "50%", minWidth: "200px"}}>

                    <div style={{display: "flex", flexDirection:"column", width: "100%", flex: "1 1 auto", overflow: "hidden"}}>
                        <div style={{display: "flex", width: "50%", minHeight: "200px"}}>Left</div>
                        <ResizableDivider direction="vertical" />
                        <div style={{display: "flex", width: "50%", minHeight: "200px"}}>Right</div>
                    </div>

                </div>
            </div>
        </>
    )
}