import React from 'react';

import {
    EuiCollapsibleNavGroup,
    EuiButton,
    EuiPanel,
    EuiFlexItem,
    EuiFlexGroup,
    EuiListGroup,
} from '@elastic/eui';

import "../globalServices"
import {SharedDeployPanel} from "../shared/SharedPanelContainer";

function RunnerSidePanel({
                             isVisible,
                             label
                         }: React.PropsWithChildren<{ isVisible: boolean, label: string }>) {

    console.info(`RunnerSidePanel visible : ${isVisible} : [${label}]`)

    return (
        <EuiPanel tabIndex={0}
                  hasShadow={false}
                  hasBorder={false}
                  borderRadius='none'
                  paddingSize='none'
                  hidden={!isVisible}
        >
            <EuiFlexGroup gutterSize="none" direction="column" className="eui-fullHeight">
                <EuiFlexItem grow={true}>
                    <EuiCollapsibleNavGroup
                        title={
                            <a
                                className="eui-textInheritColor"
                                href="#/runners"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <h1>Terminal :: {label}</h1>
                            </a>
                        }
                        buttonElement="div"
                        iconType="logoKibana"
                        isCollapsible={true}
                        initialIsOpen={true}
                        onToggle={(isOpen: boolean) => () => {
                        }}
                    >
                        <div>System runners</div>
                    </EuiCollapsibleNavGroup>
                </EuiFlexItem>

                {/* anchor to the bottom of the view */}
                <EuiFlexItem grow={false}>
                    <SharedDeployPanel/>
                </EuiFlexItem>
            </EuiFlexGroup>
        </EuiPanel>
    );
}

export default React.memo(RunnerSidePanel);