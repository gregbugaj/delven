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
  EuiFlexGroup,
  EuiSplitPanel,
  EuiCode,
  EuiHeaderSectionItem,
  EuiHeaderLinks,
  EuiHeaderLink,
  useGeneratedHtmlId,
} from '@elastic/eui';

import "./App.css";
import TerminalSidePanel from './components/explorer/TerminalSidePanel';


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

const LearnLinks: EuiPinnableListGroupItemProps[] = [
  { label: 'Docs', onClick: () => { } },
  { label: 'Blogs', onClick: () => { } },
  { label: 'Webinars', onClick: () => { } },
  { label: 'Elastic.co', href: 'https://elastic.co' },
];




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

  const collapsibleNavId = useGeneratedHtmlId({ prefix: 'collapsibleNav' });

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
            <p>And you would want the panel on the right to expand with it.el on the right to expand with it.el on the right to expand with it.</p>
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
              style={{ background: '#404040', padding: '8px' }}
            >

              <EuiFlexGroup
                gutterSize="none"
                direction="column"
                className="eui-fullHeight"
              >

                <EuiFlexItem grow={true} >
                  <EuiButtonIcon
                    iconType="apps"
                    aria-label="Applications"
                    color="ghost"
                    size="m"
                    iconSize="xl"
                    style={{ marginBottom: '16px' }}
                  />

                  <EuiButtonIcon
                    iconType="documents"
                    aria-label="Sessions and Editors"
                    color="ghost"
                    size="m"
                    iconSize="xl"
                    style={{ marginBottom: '16px' }}
                  />

                <EuiButtonIcon
                    iconType="database"
                    aria-label="Queries"
                    color="ghost"
                    size="m"
                    iconSize="xl"
                    style={{ marginBottom: '16px' }}
                  />

                <EuiButtonIcon
                    iconType="branch"
                    aria-label="Share"
                    color="ghost"
                    size="m"
                    iconSize="xl"
                    style={{ marginBottom: '16px' }}
                  />

                  <EuiButtonIcon
                    iconType="gear"
                    aria-label="Apps"
                    color="ghost"
                    size="m"
                    iconSize="xl"
                    style={{ marginBottom: '16px' }}
                  />

                  <EuiButtonIcon
                    iconType="console"
                    aria-label="Apps"
                    color="ghost"
                    size="m"
                    iconSize="xl"
                    style={{ marginBottom: '16px' }}
                  />
                </EuiFlexItem>

                {/* anchor to the bottom of the view */}
                <EuiFlexItem grow={false} >
                  <EuiButtonIcon
                    iconType="help"
                    aria-label="Icon button"
                    color="ghost"
                    size="m"
                    iconSize="xl"
                  />
                </EuiFlexItem>
              </EuiFlexGroup>
            </EuiPanel>
          </EuiFlexItem>


          <EuiFlexItem grow={false}  style={{ background: ' ', padding: '0px', margin: '0px', maxWidth: '400px', minWidth:'280px' }}>


           <TerminalSidePanel></TerminalSidePanel>
 
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

        <EuiPanel
          hasShadow={false}
          hasBorder={false}
          borderRadius='none'
          paddingSize='none'
          style={{ background: ' ', padding: '0px', margin: '0px', minHeight: '80px' }}
        >

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


        </EuiPanel>

      </EuiFlexItem> 

    </EuiFlexGroup>

  


  </EuiPageTemplate>
);




export default CollapsibleNavAll;