import React, { useState } from 'react';
import find from 'lodash/find';
import findIndex from 'lodash/findIndex';

import {
  EuiCollapsibleNav,
  EuiCollapsibleNavGroup,
  EuiHeaderSectionItemButton,
  EuiHeaderLogo,
  EuiHeader,
  EuiIcon,
  EuiButton,
  EuiButtonEmpty,
  EuiPageTemplate,
  EuiPinnableListGroup,
  EuiPinnableListGroupItemProps,
  EuiFlexItem,
  EuiHorizontalRule,
  EuiImage,
  EuiListGroup,
  EuiText,
  EuiListGroupProps,
  EuiSpacer,
  EuiButtonIcon,
  EuiLink,
  EuiPanel,
  EuiControlBar,

  useGeneratedHtmlId,
} from '@elastic/eui';


import {
  EuiFlexGroup,
  EuiSplitPanel,
  EuiCode,
} from '@elastic/eui';


import {
  EuiHeaderSectionItem,
  EuiHeaderLinks,
  EuiHeaderLink,
} from '@elastic/eui';
import { type } from 'os';


import "./App.css";

export const KibanaNavLinks: EuiPinnableListGroupItemProps[] = [
  { label: 'Discover' },
  { label: 'Visualize' },
  { label: 'Dashboards' },
  { label: 'Canvas' },
  { label: 'Maps' },
  { label: 'Machine Learning' },
  { label: 'Graph' },
];

const TopLinks: EuiPinnableListGroupItemProps[] = [
  {
    label: 'Home',
    iconType: 'home',
    isActive: true,
    'aria-current': true,
    onClick: () => { },
    pinnable: false,
  },
];


const KibanaLinks: EuiPinnableListGroupItemProps[] = KibanaNavLinks.map(
  (link) => {
    return {
      ...link,
      onClick: () => { },
    };
  }
);


const LearnLinks: EuiPinnableListGroupItemProps[] = [
  { label: 'Docs', onClick: () => { } },
  { label: 'Blogs', onClick: () => { } },
  { label: 'Webinars', onClick: () => { } },
  { label: 'Elastic.co', href: 'https://elastic.co' },
];


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


const CollapsibleNavAll = () => {
  const exitPath = () => { return "#" };
  const [navIsOpen, setNavIsOpen] = useState(true);

  /**
   * Accordion toggling
   */
  const [openGroups, setOpenGroups] = useState(
    JSON.parse(String(localStorage.getItem('openNavGroups'))) || [
      'Kibana',
      'Learn',
    ]
  );

  // Save which groups are open and which are not with state and local store
  const toggleAccordion = (isOpen: boolean, title?: string) => {
    if (!title) return;
    const itExists = openGroups.includes(title);
    if (isOpen) {
      if (itExists) return;
      openGroups.push(title);
    } else {
      const index = openGroups.indexOf(title);
      if (index > -1) {
        openGroups.splice(index, 1);
      }
    }
    setOpenGroups([...openGroups]);
    localStorage.setItem('openNavGroups', JSON.stringify(openGroups));
  };

  /**
   * Pinning
   */
  const [pinnedItems, setPinnedItems] = useState<
    EuiPinnableListGroupItemProps[]
  >(JSON.parse(String(localStorage.getItem('pinnedItems'))) || []);

  const addPin = (item: any) => {
    if (!item || find(pinnedItems, { label: item.label })) {
      return;
    }
    item.pinned = true;
    const newPinnedItems = pinnedItems ? pinnedItems.concat(item) : [item];
    setPinnedItems(newPinnedItems);
    localStorage.setItem('pinnedItems', JSON.stringify(newPinnedItems));
  };

  const removePin = (item: any) => {
    const pinIndex = findIndex(pinnedItems, { label: item.label });
    if (pinIndex > -1) {
      item.pinned = false;
      const newPinnedItems = pinnedItems;
      newPinnedItems.splice(pinIndex, 1);
      setPinnedItems([...newPinnedItems]);
      localStorage.setItem('pinnedItems', JSON.stringify(newPinnedItems));
    }
  };

  function alterLinksWithCurrentState(
    links: EuiPinnableListGroupItemProps[],
    showPinned = false
  ): EuiPinnableListGroupItemProps[] {
    return links.map((link) => {
      const { pinned, ...rest } = link;
      return {
        pinned: showPinned ? pinned : false,
        ...rest,
      };
    });
  }

  function addLinkNameToPinTitle(listItem: EuiPinnableListGroupItemProps) {
    return `Pin ${listItem.label} to top`;
  }

  function addLinkNameToUnpinTitle(listItem: EuiPinnableListGroupItemProps) {
    return `Unpin ${listItem.label}`;
  }

  const collapsibleNavId = useGeneratedHtmlId({ prefix: 'collapsibleNav' });

  const collapsibleNav = (
    <EuiFlexGroup
          className="eui-fullHeight"
          gutterSize="none"
          direction="column"
          responsive={false}
        >
      {/* Dark deployments section */}
      <EuiFlexItem grow={false} style={{ flexShrink: 0 }}>
        <EuiCollapsibleNavGroup isCollapsible={false} background="dark">
          <EuiListGroup
            color="ghost"
            maxWidth="none"
            gutterSize="none"
            size="s"
            listItems={[
              {
                label: 'Manage deployment',
                href: '#',
                iconType: 'logoCloud',
                iconProps: {
                  color: 'ghost',
                },
              },
            ]}
          />
        </EuiCollapsibleNavGroup>
      </EuiFlexItem>

      {/* Shaded pinned section always with a home item */}
      <EuiFlexItem grow={false} style={{ flexShrink: 0 }}>
        <EuiCollapsibleNavGroup
          background="light"
          className="eui-yScroll"
          style={{ maxHeight: '40vh' }}
        >
          <EuiPinnableListGroup
            aria-label="Pinned links" // A11y : Since this group doesn't have a visible `title` it should be provided an accessible description
            listItems={alterLinksWithCurrentState(TopLinks).concat(
              alterLinksWithCurrentState(pinnedItems, true)
            )}
            unpinTitle={addLinkNameToUnpinTitle}
            onPinClick={removePin}
            maxWidth="none"
            color="text"
            gutterSize="none"
            size="s"
          />
        </EuiCollapsibleNavGroup>
      </EuiFlexItem>

      <EuiHorizontalRule margin="none" />

      {/* BOTTOM */}
      <EuiFlexItem className="eui-yScroll">
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
          initialIsOpen={openGroups.includes('Kibana')}
          onToggle={(isOpen: boolean) => toggleAccordion(isOpen, 'Kibana')}
        >
          <EuiPinnableListGroup
            aria-label="Kibana" // A11y : EuiCollapsibleNavGroup can't correctly pass the `title` as the `aria-label` to the right HTML element, so it must be added manually
            listItems={alterLinksWithCurrentState(KibanaLinks)}
            pinTitle={addLinkNameToPinTitle}
            onPinClick={addPin}
            maxWidth="none"
            color="subdued"
            gutterSize="none"
            size="s"
          />
        </EuiCollapsibleNavGroup>


        {/* Learn section */}
        <EuiCollapsibleNavGroup
          title={
            <a
              className="eui-textInheritColor"
              href="#/navigation/collapsible-nav"
              onClick={(e) => e.stopPropagation()}
            >
              Training
            </a>
          }
          buttonElement="div"
          iconType="training"
          isCollapsible={true}
          initialIsOpen={openGroups.includes('Learn')}
          onToggle={(isOpen: boolean) => toggleAccordion(isOpen, 'Learn')}
        >
          <EuiPinnableListGroup
            aria-label="Learn" // A11y : EuiCollapsibleNavGroup can't correctly pass the `title` as the `aria-label` to the right HTML element, so it must be added manually
            listItems={alterLinksWithCurrentState(LearnLinks)}
            pinTitle={addLinkNameToPinTitle}
            onPinClick={addPin}
            maxWidth="none"
            color="subdued"
            gutterSize="none"
            size="s"
          />
        </EuiCollapsibleNavGroup>
      </EuiFlexItem>

      <EuiFlexItem grow={false}>
        {/* Span fakes the nav group into not being the first item and therefore adding a top border */}
        <span />

        {/* Security callout */}
        {SecurityGroup}

        <EuiCollapsibleNavGroup>
          <EuiButton fill fullWidth iconType="plusInCircleFilled">
            Add data
          </EuiButton>
        </EuiCollapsibleNavGroup>
      </EuiFlexItem>
    </EuiFlexGroup>
  );

  const leftSectionItems = [
    collapsibleNav,
    <EuiHeaderLogo href='#' iconType="logoElastic">
      Delven
    </EuiHeaderLogo>,
  ];

  return (
    <>
      <EuiHeader
        position="static"
        sections={[
          // {
          //   items: leftSectionItems,
          //   borders: 'right',
          // },
          {
            items: [
              <EuiHeaderLogo href='#' iconType="logoElastic">
                Delven
              </EuiHeaderLogo>,
            ]
          },
          {
            items: [
              <EuiHeaderSectionItem>
                <EuiHeaderLinks aria-label="App navigation links example">
                  <EuiHeaderLink isActive>Docs</EuiHeaderLink>
                  <EuiHeaderLink>Code</EuiHeaderLink>
                  <EuiHeaderLink iconType="help">Help</EuiHeaderLink>
                </EuiHeaderLinks>
              </EuiHeaderSectionItem>
            ],
          },
        ]}
      />
 
 <SidenavWithContent button={<EuiButton>Sidebar</EuiButton>}
    content={
    <>
            <p>A side nav might be in this one.</p>
            <p>And you would want the panel on the right to expand with it.</p>
            <p>And you would want the panel on the right to expand with it.</p>
            <p>And you would want the panel on the right to expand with it.</p>
            <p>And you would want the panel on the right to expand with it.</p>
            <p>And you would want the panel on the right to expand with it.</p>
            <p>And you would want the panel on the right to expand with it.</p>
            <p>And you would want the panel on the right to expand with it.</p>
            <p>And you would want the panel on the right to expand with it.</p>
            <p>And you would want the panel on the right to expand with it.</p>
            <p>And you would want the panel on the right to expand with it.</p>
            <p>And you would want the panel on the right to expand with it.</p>            <p>A side nav might be in this one.</p>
            <p>And you would want the panel on the right to expand with it.</p>
            <p>And you would want the panel on the right to expand with it.</p>
            <p>And you would want the panel on the right to expand with it.</p>
            <p>And you would want the panel on the right to expand with it.</p>
            <p>And you would want the panel on the right to expand with it.</p>
            <p>And you would want the panel on the right to expand with it.</p>
            <p>And you would want the panel on the right to expand with it.</p>
            <p>And you would want the panel on the right to expand with it.</p>
            <p>And you would want the panel on the right to expand with it.</p>
            <p>And you would want the panel on the right to expand with it.</p>
            <p>And you would want the panel on the right to expand with it.</p>
            <p>And you would want the panel on the right to expand with it.</p>
            <p>And you would want the panel on the right to expand with it.</p>
            <p>And you would want the panel on the right to expand with it.</p>
            <p>And you would want the panel on the right to expand with it.</p>
            <p>And you would want the panel on the right to expand with it.</p>
            <p>And you would want the panel on the right to expand with it.</p>
            <p>And you would want the panel on the right to expand with it.</p>
            <p>And you would want the panel on the right to expand with it.</p>
            <p>And you would want the panel on the right to expand with it.</p>
            <p>And you would want the panel on the right to expand with it.</p>
            <p>And you would want the panel on the right to expand with it.</p>
            <p>And you would want the panel on the right to expand with it.</p>
            <p>And you would want the panel on the right to expand with it.</p>
            <p>And you would want the panel on the right to expand with it.</p>
            <p>And you would want the panel on the right to expand with it.</p>
            <p>And you would want the panel on the right to expand with it.</p>
            <p>And you would want the panel on the right to expand with it.</p>
<p>A side nav might be in this one.</p>
            <p>And you would want the panel on the right to expand with it.</p>
            <p>And you would want the panel on the right to expand with it.</p>
            <p>And you would want the panel on the right to expand with it.</p>
            <p>And you would want the panel on the right to expand with it.</p>
            <p>And you would want the panel on the right to expand with it.</p>
            <p>And you would want the panel on the right to expand with it.</p>
            <p>And you would want the panel on the right to expand with it.</p>
            <p>And you would want the panel on the right to expand with it.</p>
            <p>And you would want the panel on the right to expand with it.</p>
            <p>And you would want the panel on the right to expand with it.</p>
            <p>And you would want the panel on the right to expand with it.</p>
            <p>And you would want the panel on the right to expand with it.</p>
            <p>And you would want the panel on the right to expand with it.</p>
            <p>And you would want the panel on the right to expand with it.</p>
            <p>And you would want the panel on the right to expand with it.</p>
            <p>And you would want the panel on the right to expand with it.</p>
            <p>And you would want the panel on the right to expand with it.</p>
            <p>And you would want the panel on the right to expand with it.</p>
            <p>And you would want the panel on the right to expand with it.</p>
            <p>And you would want the panel on the right to expand with it.</p>
            <p>And you would want the panel on the right to expand with it.</p>

    </>
    }
    />
    

    </>
  );
};


export const SidenavWithContent = ({ button = <></>, content }) => (
  <EuiPageTemplate fullHeight template="empty" restrictWidth={false} paddingSize='none'> 
    <EuiFlexGroup
      className="eui-fullHeight"
      gutterSize="none"
      direction="column"
      responsive={false}
    >

      {/* <EuiFlexItem grow={false}>
        <EuiPanel color="danger" >
          TOP Panel
        </EuiPanel>
      </EuiFlexItem> 

      <EuiSpacer size="l" />

      */}

      {/* eui-yScroll */}
      <EuiFlexItem className="eui-fullHeight">
        <EuiFlexGroup className="eui-fullHeight" gutterSize="none">

          <EuiFlexItem grow={false} >
            <EuiPanel tabIndex={0} className="eui-"
              hasShadow={false}
              hasBorder={false}
              borderRadius='none'
              paddingSize='none'
              style={{ background: '#404040', padding:'2px' }}
            >

            <EuiButtonIcon 
                iconType="help"
                aria-label="Icon button"
                color="ghost"
                size="m"
                iconSize="xl"
              />
            </EuiPanel>
          </EuiFlexItem>


          <EuiFlexItem>
            <EuiPanel tabIndex={0}
              hasShadow={false}
              hasBorder={false}
              borderRadius='none'
              paddingSize='none'
              style={{ background: ' ', padding: '0px', margin: '0px', maxWidth: '400px' }}
            >

              {SecurityGroup}

              AAA

              <EuiCollapsibleNavGroup>
                <EuiButton fill fullWidth iconType="plusInCircleFilled">
                  Add data
                </EuiButton>
              </EuiCollapsibleNavGroup>
           BBB

          CCCC
                {/* BOTTOM */}
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
            onToggle={(isOpen: boolean) => ()=>{}}
          >
            <EuiPinnableListGroup
              aria-label="Kibana" // A11y : EuiCollapsibleNavGroup can't correctly pass the `title` as the `aria-label` to the right HTML element, so it must be added manually
              listItems={KibanaLinks}
              pinTitle={()=>{return "Name AA"}}
              onPinClick={()=>{}}
              maxWidth="none"
              color="subdued"
              gutterSize="none"
              size="s"
            />
          </EuiCollapsibleNavGroup>

           DDD

            </EuiPanel>
          </EuiFlexItem>


          <EuiFlexItem>
            <EuiPanel 
              tabIndex={0} 
              className="eui-yScroll" 
              hasShadow={false} 
              hasBorder={false} 
              borderRadius='none' 
              paddingSize='none'
              style={{ background: ' ', padding:'0px', margin:'0px' }}
              >
              {content}
              {content}
              {content}
            </EuiPanel>
          </EuiFlexItem>


        </EuiFlexGroup>
      </EuiFlexItem>

      <EuiFlexItem grow={false}>
        <EuiPanel color="danger" >
          Bottom Panel
        </EuiPanel>
      </EuiFlexItem> 

    </EuiFlexGroup>

  
    <EuiControlBar
    size="s"
    position='relative'
  showContent={false}
  controls={
    [{
      iconType: 'submodule',
      id: 'root_icon',
      controlType: 'icon',
      'aria-label': 'Project Root',
    },
    {
      controlType: 'breadcrumbs',
      id: 'current_file_path',
      responsive: true,
      breadcrumbs: [
        {
          text: 'src',
        },
        {
          text: 'components',
        },
      ],
    },
    {
      controlType: 'spacer',
    },
    {
      controlType: 'icon',
      id: 'status_icon',
      iconType: 'alert',
      color: 'warning',
      'aria-label': 'Repo Status',
    },
    {
      controlType: 'divider',
    },
    {
      controlType: 'button',
      id: 'open_history_view',
      label: 'Show history',
      color: 'primary',
      onClick: () => { }
    }]
  }
/>


  </EuiPageTemplate>
);




export default CollapsibleNavAll;