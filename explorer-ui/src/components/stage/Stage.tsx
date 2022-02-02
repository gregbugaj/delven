import React from "react"
import PropTypes from "prop-types"

import {Route, Switch} from "react-router-dom"
import ShortcutsComponent from "../settings/Shortcuts"

import TerminalComponent from "../terminal/terminal.component"
import TabbedEditorComponent from "../editor/tabbed-editor.component"
import {EuiResizableContainer} from "@elastic/eui"

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

const TerminalComponentXX = () => {
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
            <Switch>
                <Route exact path="/runner" component={TabbedEditorComponent} />
                <Route exact path="/runner/terminal" component={TerminalComponent} />
                <Route exact path="/explorer/settings" component={SettingsComponent} />
                <Route path="/explorer/integration" component={IntegrationComponent} />
                <Route path="/explorer/settings/shortcuts" component={ShortcutsComponent} />
            </Switch>
        </React.Fragment>
    )
}

Stage.propTypes = {
    className: PropTypes.string
}

export default React.memo(Stage)