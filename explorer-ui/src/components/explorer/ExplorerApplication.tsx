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

import "../../App.css";

import { EventTypeCompileReply, EventTypeEditorKeyDown } from "../bus/message-bus-events";

import TerminalPanel from './TerminalPanel';
import EditorPanel from "./EditorPanel";
import WorkspacePanel from "./WorkspacePanel";
import SettingsPanel from "./SettingsPanel";


const ExplorerAppLayout = () => {

  const [compileTime, setCompileTime] = React.useState(0);
  const [renderType, setRenderType] = React.useState("editor");
  // https://kentcdodds.com/blog/how-to-use-react-context-effectively
  // const CountContext = React.createContext({ch:1, line:1})
  const [pos, setEditorPosition] = React.useState({ ch: 0, line: 0 });
  const [open, setOpen] = React.useState(true);

  function handleViewChange(renderTypeChange: string) {
    if (renderTypeChange != renderType) {
      setOpen(true);
      setRenderType(renderTypeChange)
    } else if (renderTypeChange == renderType) {
      setOpen(!open);
    }
  }

  let eventBus = globalThis.services.eventBus

  eventBus.on(EventTypeCompileReply,
    (event: EventTypeCompileReply): void => {
      // console.info(`event == ${JSON.stringify(event)}  ${new Date()}`)
      const compileTime = event.data.compileTime;
      setCompileTime(compileTime);
    }
  )

  eventBus.on(EventTypeEditorKeyDown, (event: EventTypeEditorKeyDown): void => {
    let data = event.data
    // console.info(`Data : ${ch} , ${line}`)
    setEditorPosition(data)
  }
  )

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
                Delven Studio
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

      <SidenavWithContent
        content={
          <>
            Test
          </>
        }
      />
    </>
  );
};

export const SidenavWithContent = ({ content }) => (
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
                    onClick={() => { console.info("Apps clicked") }}
                  />

                  <EuiButtonIcon
                    iconType="documents"
                    aria-label="Sessions and Editors"
                    color="ghost"
                    size="m"
                    iconSize="xl"
                    style={{ marginBottom: '16px' }}
                    onClick={() => { console.info("Sessions Clicked") }}
                  />

                  <EuiButtonIcon
                    iconType="database"
                    aria-label="Queries"
                    color="ghost"
                    size="m"
                    iconSize="xl"
                    style={{ marginBottom: '16px' }}
                    onClick={() => { console.info("Queries cliked") }}
                  />

                  <EuiButtonIcon
                    iconType="branch"
                    aria-label="Share"
                    color="ghost"
                    size="m"
                    iconSize="xl"
                    style={{ marginBottom: '16px' }}
                    onClick={() => { console.info("Branch/Share cliked") }}
                  />

                  <EuiButtonIcon
                    iconType="gear"
                    aria-label="Apps"
                    color="ghost"
                    size="m"
                    iconSize="xl"
                    style={{ marginBottom: '16px' }}
                    onClick={() => { console.info("Settings cliked") }}
                  />

                  <EuiButtonIcon
                    iconType="console"
                    aria-label="Apps"
                    color="ghost"
                    size="m"
                    iconSize="xl"
                    style={{ marginBottom: '16px' }}
                    onClick={() => { console.info("Terminal cliked") }}
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

          <EuiFlexItem grow={false} style={{ background: ' ', padding: '0px', margin: '0px', maxWidth: '400px', minWidth: '280px' }}>

            {/* RenderType :  {renderType}  {Date.now()} */}
            {/* <TerminalPanel></TerminalPanel> */}
            {/* <EditorPanel></EditorPanel> */}
            {/* <WorkspacePanel></WorkspacePanel> */}
            {/* <SettingsPanel></SettingsPanel> */}

          </EuiFlexItem>

          <EuiFlexItem>
            <EuiPanel
              tabIndex={0}
              className="eui-yScroll"
              hasShadow={false}
              hasBorder={false}
              borderRadius='none'
              paddingSize='none'
              style={{ background: ' ', padding: '0px', margin: '0px' }}
            >
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


export default ExplorerAppLayout;