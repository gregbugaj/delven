import React from "react"
import PropTypes from "prop-types"
import classNames from "classnames"
import {EuiPanel, EuiCode, EuiSpacer} from "@elastic/eui"

import {EuiText, EuiResizableContainer} from "@elastic/eui"
import ResizibleDivider from "../explorer/ResizibleDivider"


function LHSPanel() {
    const classes = classNames("euiComponent", "content-stage")
    return (
        <div className={classes}>
            Content Window Panel<br />
            RenderTime : {Date.now()}
        </div>
    )
}

const LHSPane = React.memo(LHSPanel)

function Stage({
                   children,
                   label
               }: React.PropsWithChildren<{label: string}>) {
    const classes = classNames("euiComponent", "content-stage")

    return (
        <>
            <div style={{display: "flex", height: "100px", border: "2px solid blue"}}>
                <div style={{display: "flex", width: "50%", border: "1px solid green", minWidth: "400px"}}>Left

                    Content Window Panel<br />
                    RenderTime : {Date.now()}

                </div>
                <ResizibleDivider direction="horizontal" />
                <div style={{display: "flex", flex: "1 1 0%", border: "2px solid pink", minWidth: "400px"}}>Right

                    Content Window Panel<br />
                    RenderTime : {Date.now()}
                </div>
            </div>

            <hr />

            <EuiResizableContainer onPanelWidthChange={() => {
                console.info("Resized")
            }}>

                {(EuiResizablePanel, EuiResizableButton) => (
                    <>
                        <EuiResizablePanel initialSize={50} minSize="200px" mode="custom">

                            <LHSPane></LHSPane>
                        </EuiResizablePanel>

                        <EuiResizableButton style={{border: "1px solid pink"}} />

                        <EuiResizablePanel initialSize={50} minSize="200px">
                            Right Panel
                            <div className={classes}>
                                Content Window Panel<br />
                                RenderTime : {Date.now()}
                            </div>

                        </EuiResizablePanel>
                    </>
                )}
            </EuiResizableContainer>

        </>
    )
}

Stage.propTypes = {
    className: PropTypes.string
}

export default React.memo(Stage)