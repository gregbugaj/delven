import React from 'react';

import {
    EuiCollapsibleNavGroup,
    EuiButton,
    EuiPanel,
    EuiFlexItem,
    EuiFlexGroup,
} from '@elastic/eui';

import "../globalServices"
import {SharedDeployPanel} from "../shared/SharedPanelContainer";

function RepositorySidePanel({
                                 isVisible,
                                 label
                             }: React.PropsWithChildren<{ isVisible: boolean, label: string }>) {

    console.info(`GitSidePanel visible : ${isVisible} : [${label}]`)

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
                    {/*<h1>View : {isVisible ? 'show' : 'hide'} : [{label}] : {Date.now()}</h1>*/}
                    <EuiCollapsibleNavGroup>
                        <EuiButton fill fullWidth iconType="plusInCircleFilled">
                            Add Connector
                        </EuiButton>
                    </EuiCollapsibleNavGroup>

                    <EuiCollapsibleNavGroup
                        title={
                            <a
                                className="eui-textInheritColor"
                                href="#/repositories"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <h1>Repositories :: {label}</h1>
                            </a>
                        }
                        buttonElement="div"
                        iconType="logoKibana"
                        isCollapsible={true}
                        initialIsOpen={true}
                        onToggle={(isOpen: boolean) => () => {
                        }}
                    >
                        <div>
                            Manage code host connections to sync repositories.
                        </div>
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

export default React.memo(RepositorySidePanel);