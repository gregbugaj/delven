import React from 'react';

import {
    EuiCollapsibleNavGroup,
    EuiButton,
    EuiPanel,
    EuiFlexItem,
    EuiFlexGroup,
    EuiListGroup,
    EuiSearchBar
} from '@elastic/eui';

import "../globalServices"
import {SharedDeployPanel} from "../shared/SharedPanelContainer";

function HelpSidePanel({
                           isVisible,
                           label
                       }: React.PropsWithChildren<{ isVisible: boolean, label: string }>) {

    console.info(`HelpSidePanel visible : ${isVisible} : [${label}]`)

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
                    <EuiCollapsibleNavGroup
                        title={
                            <a
                                className="eui-textInheritColor"
                                href="#/help"
                            >
                                <h1>Help :: {label}</h1>
                            </a>
                        }
                        buttonElement="div"
                        iconType="logoKibana"
                        isCollapsible={true}
                        initialIsOpen={true}
                        onToggle={(isOpen: boolean) => () => {
                        }}
                    >
                        <EuiSearchBar
                            box={{
                                placeholder: 'e.g. type:keyword -is:select from',
                                incremental: true,
                            }}
                        />
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

export default React.memo(HelpSidePanel);