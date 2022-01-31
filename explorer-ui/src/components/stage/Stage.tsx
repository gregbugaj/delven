import React from "react"
import PropTypes from "prop-types"

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
    )
}

const SettingsComponent = () => {
    return (
        <div>
            Settings Component
        </div>
    )
}

const TerminalComponent = () => {
    return (
        <div>
            Terminal Component
        </div>
    )
}

const IntegrationComponent = () => {
    return (
        <div>
            Integration Component
        </div>
    )
}

function Stage({
                   children,
                   label
               }: React.PropsWithChildren<{label: string}>) {
    return (
        <React.Fragment>
            {/*<Container maxWidth="xl" className={classes.container} style={{ border: '0px solid green', padding: '0px', height: 'calc(100vh - 32px)' }} >*/}
            <Switch>
                <Route exact path="/runner" component={DefaultComponent} />
                <Route exact path="/runner/terminal" component={TerminalComponent} />
                <Route exact path="/explorer/settings" component={SettingsComponent} />
                <Route path="/explorer/integration" component={IntegrationComponent} />
                <Route path="/explorer/settings/shortcuts" component={ShortcutsComponent} />
            </Switch>
            {/*</Container>*/}
        </React.Fragment>
    )
}

Stage.propTypes = {
    className: PropTypes.string
}

export default React.memo(Stage)