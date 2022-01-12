
import React, { useCallback, useEffect, useLayoutEffect, useReducer, useState } from 'react';
import { makeStyles, Theme, useTheme } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import MenuIcon from "@material-ui/icons/Menu";
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';

import { EventTypeAddTab, EventTypeSampleQuery, EventTypeCloseTab } from "../../bus/message-bus-events";
import "../globalServices"
import Editor from './Editor';
import { AppBar, Grid, IconButton, withStyles } from '@material-ui/core';
import { v4 as uuidv4 } from 'uuid';
import { EditorContext, IEditor, ISession } from './EditorContext';
import { filter } from 'rxjs/operators';
import { MessageBusService } from '../../bus/message-bus';

/**
 * Prevent React component from re-rendering
 * https://stackoverflow.com/questions/40909902/shouldcomponentupdate-in-function-components/40910993
 */
interface TabPanelProps {
  children?: React.ReactNode;
  index: string; // This is not really index but an tabId
  label: string;
  onLoadComplete?: () => void
}

const TabPanel = React.memo((props: TabPanelProps) => {
  const { children, index, onLoadComplete, ...other } = props;
  const onLoadCompleteHandler = onLoadComplete || (() => { console.info(`TabPanel onLoadComplete ${index}`) })

  return (
    <div
      role="tabpanel"
      id={`editorview-tabpanel-${index}`}
      aria-labelledby={`editorview-tabpanel-${index}`}
      style={{
        overflowY: 'auto',
        padding: "0px", border: "0px solid green", height: '100%', width: '100%', flexDirection: 'column'
      }}
      {...other}
    >
      {
        <div style={{ padding: "0px", border: "0px solid black", height: '100%', width: '100%', flexDirection: 'column' }}>
          <Editor id={index} onLoadComplete={onLoadCompleteHandler} />
        </div>
      }
    </div>
  );
}, (prev, next) => true)


function a11TabProps(index: any) {
  return {
    id: `editor-tab-${index}`,
    'aria-controls': `editor-tabpanel-${index}`,
  };
}

const tabHeight = '48px' // default: '48px'
const useStyles = makeStyles((theme: Theme) => ({
  root: {
    flexGrow: 1,
    width: '100%',
    height: '100%',
    backgroundColor: theme.palette.background.paper,
  },

  tab: {

    minHeight: tabHeight,
    height: tabHeight,
    textTransform: 'none',
    minWidth: 120,
    fontWeight: theme.typography.fontWeightMedium,
    marginRight: theme.spacing(2),
    fontFamily: [
      '"Source Code Pro"',
      'monospace'
    ].join(','),
    '&:hover': {
      color: '#40a9ff',
      opacity: 1,
    },
    '&$selected': {
      color: '#1890ff',
      fontWeight: theme.typography.fontWeightBold,
    },
    '&:focus': {
      color: '#40a9ff',
    },
  },

}));

// const TabbedEditor = React.memo((props:any) => {
//   return TabbedEditorImp(props)
// })
// export default TabbedEditor

const eventBusMap = new Map<String, MessageBusService>();

const getEventBus = (channelId: string): MessageBusService => {
  if (!eventBusMap.has(channelId)) {
    const bus = new MessageBusService();
    eventBusMap.set(channelId, bus)
  }

  return eventBusMap.get(channelId)
}

interface CustomEditorTabProps {
  value: any;
  label?: string;
}

// https://material-ui.com/api/tab/#css
function CustomEditorTab(props: CustomEditorTabProps) {

  const handleCloseClick = (event:any, value:string) => {
    event.preventDefault();
    console.info('Close tab requested : ' + value)
  }

  return (
    <Tab
    wrapped ={true}
      component="div"
      //   onClick={(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      //     event.preventDefault();
      //  }}
      {...props}

      label={
        <React.Fragment>
          <div style={{ width: '160px', maxWidth:'160px', border: '0px solid red', padding: '0px', margin: '0px', cursor: 'pointer'}}>
            <div style={{ float: 'left' }}>
              <div style={{float:'left', width : '12px', textAlign:'left', border:'0px solid red'}}>
                <FiberManualRecordIcon style={{height: '10px', width:'10px', color:'green', padding:'0px', margin:'0px'}}/>
              </div>
              <span>{props.label}</span>
            </div>
            <div style={{ float: 'right' }} >
              <IconButton size='small' color="primary" aria-label="close tab" onClick={(event) => { handleCloseClick(event, props.value)}}>
                <CloseIcon style={{ height: '14px' }} />
              </IconButton>
            </div>
          </div>
        </React.Fragment>
      }
    />
  );
}

export default function TabbedEditor(props: any) {
  console.info("**** TabbedEditor ****")
  // const eventBus =  globalThis.services.eventBus
  const [session, setSession] = React.useContext(EditorContext)

  const classes = useStyles();

  const [isReady, setIsReady] = React.useState(false);
  const [activeTabId, setActiveTabId] = React.useState("0000-0000-0000-0000");
  const [tabList, setTabListState] = React.useState<TabPanelProps[]>();

  const handleChange = (event: React.ChangeEvent<{}>, newValue: string) => {
    globalThis.services.state.activeTabId = newValue
    console.info(`setting active tab to  = ${newValue}`)
    console.info(tabList)
    console.info(session.editors)
    // TODO : use ReactHooks and Context to provide global state
    setActiveTabId(newValue);
  };

  // need to make sure that there are no multiple subscriptions
  useEffect(() => {
    console.info('TAB EDITOR : useEffect')

    if (!isReady){


      setIsReady(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabList])

  useLayoutEffect(() => {
    console.info('TAB EDITOR : useEffect : ' + isReady)
    // not yet ready
    if (isReady === false) {
      return
    }

    const eventBus =  getEventBus('Main')
    const eventBusGlobal = globalThis.services.eventBus;

    eventBusGlobal.on(
      EventTypeAddTab,
      (event: EventTypeAddTab): void => {
        // IMPORTANT: DO NOT REMOVE THE ASYNC CALL OR THIS WILL BREAK REACT LIFECYCLE
        // AND STATE VARIABLE WILL NOT BE AVAILABLE
        (async () => {
           if (event.data !== undefined) {
            const data = event.data
            if (data.type === 'file') {

              console.info('Event received')
              console.info(tabList)
              console.info(session.editors)

              addTab(uuidv4(), data.name, () => {
                console.info("Tab from EventTypeAdd added")
                // Load value to the active tab
                eventBus.emit(new EventTypeSampleQuery(data));
              })
            }
          }
        }
        )()
      }
    )

    // FIXME : Not sure why this is not working, tabList state is always null
    eventBus.on(
      EventTypeCloseTab,
      (event: EventTypeCloseTab): void => {

        // IMPORTANT: DO NOT REMOVE THE ASYNC / TIMEOUT CALL OR THIS WILL BREAK REACT LIFECYCLE
        // AND STATE VARIABLE WILL NOT BE AVAILABLE
        if (event.data !== undefined) {
          const tabId = event.data
          console.info('Event received')
          closeTab(tabId)
        }
      }
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady])


  useLayoutEffect(() => {
    // setup main tab
    const id = uuidv4()
    addTab(id, `Script`, () => {
      console.info('Root TAB added')
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run only once

  // const closeTab = (tabId: string) =>{
  const closeTab = useCallback((tabId: string)=>{
      console.info(`useCallback Closing TabId # ${tabId}`)

      console.info(isReady)
      console.info(tabList)
      console.info(session.editors)

      if (tabList === undefined) {
        // throw Error("this is bad, tabList is null")
        console.warn("this is bad, tabList is null")
        return;
      }

      // const filtered = tabList.filter(tab => tab.index === tabId)
      // const tab = filtered[0]
      const editors: IEditor[] = []
      console.info(session.editors)

      for (let editor of session.editors) {
        console.info("  >> " + editor.id)
        if (tabId !== editor.id)
          continue;

        editors.push(editor)
      }

      const updated: ISession = {
        name: session.name,
        editors: editors
      }

      // setSession(updated)
      /*
        if (tabList === undefined) {
        setTabListState([prop])
      } else {
        setTabListState([...tabList, prop])
      }
      setActiveTabValue(id);
      */
    }
  , [tabList, session]);


  function addTab(id: string, label: string, onLoadComplete: () => void) {
    console.info('addTab **')
    console.info(tabList)
    console.info(session.editors)

    // TODO : This should be handled better
    globalThis.services.state.activeTabId = id
    const loaded = () => {
      try {
        onLoadComplete()
      } finally {
        console.info("load Completed ** ")
      }
    }

    const prop = {
      index: id,
      value: id,
      label: label,
      onLoadComplete: loaded
    }

    if (tabList === undefined) {
      setTabListState([prop])
    } else {
      setTabListState([...tabList, prop])
    }
    setActiveTabId(id);

    const val: IEditor = {
      name: label,
      id: id
    }

    const updated: ISession = {
      name: session.name,
      editors: [...session.editors, val]
    }

    setSession(updated)
  }

  const handleTabAdd = () => {
    addTab(uuidv4(), 'New script', () => {
      console.debug("Tab from ADD loaded")
    })
  };

  const handleSessionAdd = () => {
    console.info("Adding session")
    console.info(tabList)
    console.info(session.editors)

    const id = "000"
    // const eventBus = globalThis.services.eventBus;
    const eventBus =  getEventBus('Main')
    console.info('Closing editor : ' + id)
    eventBus.emit(new EventTypeCloseTab(id));
    // closeTab(id)
  };

  const getVisibilityStyle = (hiddenCondition: boolean): any => {
    if (hiddenCondition) {
      return {
        visibility: 'hidden',
        height: 0,
      };
    }
    return {
      visibility: 'visible',
      height: 'inherit',
    };
  };


  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    console.info(event)
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = (event: React.MouseEvent<HTMLLIElement>) => {
    console.info(event)
    setAnchorEl(null);
  };

  function handleCloseTab(index: string) {
    console.info(`Closing Tab # ${index}`)
  }

  return (
    <div className='Editor-Container'>
      <div className='Editor-Container-Header'>
        <Grid container justify="space-between" style={{ padding: "0px", border: "0px solid green" }}>
          <Grid item xs={10} style={{ padding: "0px", border: "0px solid green" }}>

            <Tabs
              value={activeTabId}
              onChange={handleChange}
              indicatorColor="primary"
              textColor="primary"
              variant="scrollable"
              scrollButtons="auto"
              aria-label="Query samples"
              // style={{ padding: "0px", border: "0px solid green", display: 'flex', width: '100%', flexDirection: 'column' }}
              TabIndicatorProps={{
                style: {
                  height: "2px",
                }
              }}
            >

              {/* <Tab label="Script #1" {...a11TabProps(0)} className={classes.tab} ></Tab> */}
              {/* <Tab label="Script #2" {...a11TabProps(1)} className={classes.tab} ></Tab> */}

              {
                tabList?.map((tab, i) => (
                  // <Tab
                  //   icon={<CloseIcon />}
                  //   value={tab.index}
                  //   label={tab.label}
                  //   {...a11TabProps(tab.index)}
                  //   className={classes.tab}
                  // />

                  <CustomEditorTab
                    value={tab.index}
                    label={tab.label}
                    {...a11TabProps(tab.index)}
                  />
                ))
              }
              {/*
              {
                tabList?.map((tab, i) => (
                  <div>
                    <Tab
                      value={tab.index}
                      label={tab.label}
                      {...a11TabProps(tab.index)}
                      className={classes.tab}
                    />
                    <IconButton color="primary" aria-label="add tab" component="span" onClick={(event) => handleCloseTab(tab.index)}>
                      <CloseIcon />
                    </IconButton>
                  </div>
                ))
              } */}

            </Tabs>
          </Grid>
          <Grid item xs={2} style={{ textAlign: 'right', }}>

            <IconButton color="primary" aria-label="Save Session" component="span" onClick={handleSessionAdd}>
              <CloudUploadIcon />
            </IconButton>

            <IconButton color="primary" aria-label="add tab" component="span" onClick={handleTabAdd}>
              <AddIcon />
            </IconButton>

            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              aria-controls="editor-menu"
              aria-haspopup="true"
              onClick={handleMenuClick}
            >
              <MoreHorizIcon />
            </IconButton>

            <Menu
              id="editor-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={handleMenuClose}>Close Current   CTRL+K W</MenuItem>
              <MenuItem onClick={handleMenuClose}>Close Saved     CTRL+K U</MenuItem>
              <hr />
              <MenuItem onClick={handleMenuClose}>Close All       CTRL+K X</MenuItem>
            </Menu>

          </Grid>
        </Grid>
      </div>

      <div className='Editor-Content'>
        {
          tabList?.map((tab, i) => (
            <div style={getVisibilityStyle(activeTabId !== tab.index)}>
              <TabPanel index={tab.index} label={`Query # ${i}`} onLoadComplete={tab.onLoadComplete} key={i} />
            </div>
          ))
        }
      </div>
    </div>
  );
}

