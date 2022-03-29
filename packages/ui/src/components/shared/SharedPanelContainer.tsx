import React from 'react';

import {
    EuiCollapsibleNavGroup,
    EuiButton,
    EuiText,
    EuiButtonIcon,
    EuiLink,
} from '@elastic/eui';

/**
 * Deployment Panel
 * @constructor
 */
function SharedDeployPanel() {

    return (
        <EuiCollapsibleNavGroup
            background="light"
            iconType="logoSecurity"
            title="Deployment"
            isCollapsible={true}
            initialIsOpen={true}
            arrowDisplay="none"
            extraAction={
                <EuiButtonIcon
                    aria-label="Hide and never show again"
                    title="Hide and never show again"
                    iconType="cross"
                />
            }>
            <EuiText size="s" color="subdued" style={{padding: '0 8px 8px'}}>
                <p>
                    You can deploy a production version of your sandbox using one of our supported
                    providers.
                    <EuiLink target="_blank">Learn more</EuiLink>
                </p>
                <p>You need to be signed in to deploy this sandbox.</p>

            </EuiText>

            time : {Date.now()}
            <EuiButton fill fullWidth iconType="logoGithub">
                You need to be signed in
            </EuiButton>
        </EuiCollapsibleNavGroup>
    )
}

export {SharedDeployPanel}