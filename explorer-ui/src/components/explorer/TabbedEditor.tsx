
import React, { useEffect, useLayoutEffect } from 'react';
import { makeStyles, Theme, useTheme } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import MenuIcon from "@material-ui/icons/Menu";
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';

import { EventTypeAddTab, EventTypeSampleQuery } from "../bus/message-bus-events";
import "../globalServices"
import Editor from './Editor';
import { AppBar, Grid, IconButton } from '@material-ui/core';
import { v4 as uuidv4 } from 'uuid';

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
  console.info(`index = ${index}`)
  // console.info(`activeId = ${activeId}`)
  console.info(props)
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


export default function FullWidthTabbedEditor() {

  const eventBus = globalThis.services.eventBus
  const classes = useStyles();
  const [value, setActiveTabValue] = React.useState("");
  const [tabList, setTabListState] = React.useState<TabPanelProps[]>();

  const handleChange = (event: React.ChangeEvent<{}>, newValue: string) => {
    console.info(`setting active tab to  = ${newValue}`)
    // TODO : use ReactHooks and Context to provide global state
    setActiveTabValue(newValue);
  };

  eventBus.on(
    EventTypeAddTab,
    (event: EventTypeAddTab): void => {
      (async () => {
        if (event.data !== undefined) {
          let data = event.data
          if (data.type === 'file') {
            //data.id
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

  useLayoutEffect(() => {
    // setup main tab
    const id = uuidv4()
    addTab(id, `Script`, () => console.info('Root TAB added'))
  }, []);


  const addTab = (id: string, label: string, onLoadComplete: () => void) => {
    // TODO : This should be handled better
    globalThis.services.state.activeTabId = id

    const loaded = ()=> {
      onLoadComplete()
      console.info("load Completed ** ")
    }

    const prop = {
      index: id,
      value: id,
      label: label,
      onLoadComplete:loaded
    }

    if (tabList === undefined) {
      setTabListState([prop])
    } else {
      setTabListState([...tabList, prop])
    }

    setActiveTabValue(id);
  }

  const handleTabAdd = () => {
    addTab(uuidv4(), 'New script', () => {
      console.info("Tab from ADD loaded")
    })
  };


  const handleSessionAdd = () => {
    alert("Adding session")
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
        <Grid container justify="space-between" style={{ padding: "0px", border: "0px solid green" }} xs={12}>
          <Grid item xs={10} style={{ padding: "0px", border: "0px solid green" }}>

              <Tabs
                value={value}
                onChange={handleChange}
                indicatorColor="primary"
                textColor="primary"
                variant="scrollable"
                scrollButtons="auto"
                aria-label="Query samples"
                // style={{ padding: "0px", border: "0px solid green", display: 'flex', width: '100%', flexDirection: 'column' }}
                TabIndicatorProps={{
                  style: {
                    height: "4px",
                  }
                }}
              >

                {/* <Tab label="Script #1" {...a11TabProps(0)} className={classes.tab} ></Tab> */}
                {/* <Tab label="Script #2" {...a11TabProps(1)} className={classes.tab} ></Tab> */}

                {
                  tabList?.map((tab, i) => (
                    <Tab
                      value={tab.index}
                      label={tab.label}
                      {...a11TabProps(tab.index)}
                      className={classes.tab}
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
        {/* Initial panel */}

        {/* <div style={getVisibilityStyle(value != 0)}>
          <TabPanel index={0} label={'Script 0'} />
        </div> */}

        {/*
        <div style={getVisibilityStyle(value != 1)}>
          <TabPanel index={1} label={'Script 1'} />
        </div> */}

        {
          tabList?.map((tab, i) => (
            <div style={getVisibilityStyle(value != tab.index)}>
              <TabPanel index={tab.index} label={`Script # ${i}`} onLoadComplete={tab.onLoadComplete} />
            </div>
          ))
        }

      </div>
    </div>
  );
}

