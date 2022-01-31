import React from "react"
import PropTypes from "prop-types"
import classNames from "classnames"
import {EuiPanel, EuiCode, EuiSpacer} from "@elastic/eui"

import {EuiText, EuiResizableContainer} from "@elastic/eui"
import ResizibleDivider from "../explorer/ResizibleDivider"
import {Route, Switch} from "react-router-dom"
import ShortcutsComponent from "../settings/Shortcuts"

const DefaultComponent = () => {
    return (
        <div>
            Default Component
        </div>
        // <div style={{ border: '0px solid red', height: '100%' }}>
        //     <TabbedEditor></TabbedEditor>
        // </div>
    );
};

const SettingsComponent = () => {
    return (
        <div>
            Settings Component
        </div>
    );
};

const IntegrationComponent = () => {
    return (
        <div>
            Integration Component
        </div>
    );
};


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


            {/* 32px refers to size of fixed footer */}
            {/*<Container maxWidth="xl" className={classes.container} style={{ border: '0px solid green', padding: '0px', height: 'calc(100vh - 32px)' }} >*/}

                <Switch>
                    <Route exact path='/explorer' component={DefaultComponent} />
                    <Route exact path='/explorer/settings' component={SettingsComponent} />
                    <Route path='/explorer/integration' component={IntegrationComponent} />
                    <Route path='/explorer/settings/shortcuts' component={ShortcutsComponent} />
                </Switch>

            {/*</Container>*/}

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