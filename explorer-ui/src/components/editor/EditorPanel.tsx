import React from "react"

import {
    EuiCollapsibleNavGroup,
    EuiButton,
    EuiPanel,
    EuiFlexItem,
    EuiFlexGroup,
    EuiListGroup
} from "@elastic/eui"

import "../globalServices"
import {SharedDeployPanel} from "../shared/SharedPanelContainer"

function EditorSidePanel({
                             isVisible,
                             label
                         }: React.PropsWithChildren<{isVisible: boolean, label: string}>) {

    console.info(`EditorSidePanel visible : ${isVisible} : [${label}]`)

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
                    <h1>View : {isVisible ? "show" : "hide"} : [{label}] : {Date.now()}</h1>
                    <EuiCollapsibleNavGroup>
                        <EuiButton fill fullWidth iconType="plusInCircleFilled">
                            New Tab
                        </EuiButton>
                    </EuiCollapsibleNavGroup>

                    <EuiCollapsibleNavGroup
                        title={
                            <a
                                className="eui-textInheritColor"
                                href="#/editor"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <h1>Editor :: {label}</h1>
                            </a>
                        }
                        buttonElement="div"
                        iconType="logoKibana"
                        isCollapsible={true}
                        initialIsOpen={true}
                        onToggle={(isOpen: boolean) => () => {
                        }}
                    >
                        <EuiListGroup
                            aria-label="Panel" // A11y : EuiCollapsibleNavGroup can't correctly pass the `title` as the `aria-label` to the right HTML element, so it must be added manually
                            listItems={[
                                {
                                    label: "Discover", onClick: () => {
                                    }
                                },
                                {
                                    label: "Visualize", onClick: () => {
                                    }
                                },
                                {
                                    label: "Graph", onClick: () => {
                                    }
                                }
                            ]}
                            maxWidth="none"
                            color="subdued"
                            gutterSize="none"
                            size="s"
                        />
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

export default React.memo(EditorSidePanel)

