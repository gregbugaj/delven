import React from 'react';

import {
  EuiCollapsibleNavGroup,
  EuiButton,
  EuiText,
  EuiButtonIcon,
  EuiLink,
  EuiPanel,
  EuiFlexItem,
  EuiFlexGroup,
  EuiListGroup,
} from '@elastic/eui';

import "../globalServices"

export default function TerminalSidePanel() {

  return (
    <EuiPanel tabIndex={0}
      hasShadow={false}
      hasBorder={false}
      borderRadius='none'
      paddingSize='none'
    >
      <EuiFlexGroup gutterSize="none" direction="column" className="eui-fullHeight">
        <EuiFlexItem grow={true} >
          <h1>Terminal</h1>
          <EuiCollapsibleNavGroup>
            <EuiButton fill fullWidth iconType="plusInCircleFilled">
              Add data
            </EuiButton>
          </EuiCollapsibleNavGroup>

          <EuiCollapsibleNavGroup
            title={
              <a
                className="eui-textInheritColor"
                href="#/terminal"
                onClick={(e) => e.stopPropagation()}
              >
                Terminal
              </a>
            }
            buttonElement="div"
            iconType="logoKibana"
            isCollapsible={true}
            initialIsOpen={true}
            onToggle={(isOpen: boolean) => () => { }}
          >
            <EuiListGroup
              aria-label="Kibana" // A11y : EuiCollapsibleNavGroup can't correctly pass the `title` as the `aria-label` to the right HTML element, so it must be added manually
              listItems={[
                { label: 'Discover', onClick: () => { } },
                { label: 'Visualize', onClick: () => { } },
                { label: 'Graph', onClick: () => { } },
              ]}
              maxWidth="none"
              color="subdued"
              gutterSize="none"
              size="s"
            />
          </EuiCollapsibleNavGroup>

        </EuiFlexItem>

        {/* anchor to the bottom of the view */}
        <EuiFlexItem grow={false} >
          <EuiCollapsibleNavGroup
            background="light"
            iconType="logoSecurity"
            title="Terminal"
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
            <EuiText size="s" color="subdued" style={{ padding: '0 8px 8px' }}>
              <p>
                 Build terminals in the browser <br/>
                <EuiLink target="_blank" >Learn more</EuiLink>
              </p>
            </EuiText>
          </EuiCollapsibleNavGroup>
        </EuiFlexItem>
      </EuiFlexGroup>
    </EuiPanel>
  );
}