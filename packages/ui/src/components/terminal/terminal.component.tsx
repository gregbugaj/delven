import {EuiButtonIcon, EuiFlexGroup, EuiFlexItem, EuiPanel} from "@elastic/eui"
import React from "react"
import "../globalServices"

function TerminalComponent({
                               isVisible,
                               label
                           }: React.PropsWithChildren<{isVisible: boolean, label: string}>) {

    console.info(`TerminalComponent visible : ${isVisible} : [${label}]`)

    // Both flex-groups need to have eui-fullHeight in order to have scrollable container
    return (
        <EuiFlexGroup
            gutterSize="none"
            direction="column" // Align vertically
            className="eui-fullHeight"
            style={{background: "#CCC", padding: "0px", margin: "0px", border: "1px solid red"}}
        >

            <EuiFlexItem grow={false}>
                Top
            </EuiFlexItem>

            <EuiFlexItem grow={true}
                         style={{background: "#FFF", padding: "0px", margin: "0px", border: "1px solid red"}}
                         className="eui-fullHeight"
            >
                <EuiPanel
                    tabIndex={0}
                    className="eui-yScroll"
                    hasShadow={false}
                    hasBorder={false}
                    borderRadius="none"
                    paddingSize="none"
                    style={{background: "#FFF", padding: "0px", margin: "0px", border: "1px solid red"}}
                >
                    <div>Terminal component V</div>
                    Line <br /> Line <br />Line <br /> Line <br />Line <br /> Line <br />Line <br /> Line <br />
                    Line <br /> Line <br />Line <br /> Line <br />Line <br /> Line <br />Line <br /> Line <br />
                    Line <br /> Line <br />Line <br /> Line <br />Line <br /> Line <br />Line <br /> Line <br />
                    Line <br /> Line <br />Line <br /> Line <br />Line <br /> Line <br />Line <br /> Line <br />
                    Line <br /> Line <br />Line <br /> Line <br />Line <br /> Line <br />Line <br /> Line <br />
                    Line <br /> Line <br />Line <br /> Line <br />Line <br /> Line <br />Line <br /> Line <br />
                    Line <br /> Line <br />Line <br /> Line <br />Line <br /> Line <br />Line <br /> Line <br />
                </EuiPanel>

            </EuiFlexItem>

            {/* anchor to the bottom of the view */}
            <EuiFlexItem grow={false}>
                Bottom
            </EuiFlexItem>
        </EuiFlexGroup>
    )
}

export default React.memo(TerminalComponent)

