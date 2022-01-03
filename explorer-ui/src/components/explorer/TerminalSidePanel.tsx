import React from 'react';

import {
  EuiCollapsibleNavGroup,
  EuiButton,
  EuiPinnableListGroup,
  EuiText,
  EuiButtonIcon,
  EuiLink,
  EuiPanel,
  EuiPinnableListGroupItemProps,
} from '@elastic/eui';

import "../globalServices"


export const KibanaNavLinks: EuiPinnableListGroupItemProps[] = [
  { label: 'Discover' },
  { label: 'Visualize' },
  { label: 'Dashboards' },
  { label: 'Canvas' },
  { label: 'Maps' },
  { label: 'Machine Learning' },
  { label: 'Graph' },
];


const KibanaLinks: EuiPinnableListGroupItemProps[] = KibanaNavLinks.map(
  (link) => {
    return {
      ...link,
      onClick: () => { },
    };
  }
);


export const SecurityGroup = (
  <EuiCollapsibleNavGroup
    background="light"
    iconType="logoSecurity"
    title="Elastic Security"
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
        Threat prevention, detection, and response with SIEM and endpoint
        security.
        <br />
        <EuiLink>Learn more</EuiLink>
      </p>
    </EuiText>
  </EuiCollapsibleNavGroup>
);

export default function TerminalSidePanel() {

  return (

    <EuiPanel tabIndex={0}
      hasShadow={false}
      hasBorder={false}
      borderRadius='none'
      paddingSize='none'
    >

      {SecurityGroup}

      <EuiCollapsibleNavGroup>
        <EuiButton fill fullWidth iconType="plusInCircleFilled">
          Add data
        </EuiButton>
      </EuiCollapsibleNavGroup>

      {/* Kibana section */}
      <EuiCollapsibleNavGroup
        title={
          <a
            className="eui-textInheritColor"
            href="#/navigation/collapsible-nav"
            onClick={(e) => e.stopPropagation()}
          >
            Kibana
          </a>
        }
        buttonElement="div"
        iconType="logoKibana"
        isCollapsible={true}
        initialIsOpen={true}
        onToggle={(isOpen: boolean) => () => { }}
      >
        <EuiPinnableListGroup
          aria-label="Kibana" // A11y : EuiCollapsibleNavGroup can't correctly pass the `title` as the `aria-label` to the right HTML element, so it must be added manually
          listItems={KibanaLinks}
          pinTitle={() => { return "Name AA" }}
          onPinClick={() => { }}
          maxWidth="none"
          color="subdued"
          gutterSize="none"
          size="s"
        />
      </EuiCollapsibleNavGroup>

    </EuiPanel>
  );
}


function ListMenu() {

  const [openEditor, setOpenEditor] = React.useState(true);
  const [openSession, setOpenSession] = React.useState(true);

  const handleEditorClick = () => {
    setOpenEditor(!openEditor);
  };

  const handleSessionClick = () => {
    setOpenSession(!openSession);
  };

  return (
    <React.Fragment>

      Fragment
    </React.Fragment>
  )
}
