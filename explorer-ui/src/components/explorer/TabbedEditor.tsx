import React from 'react';
import { makeStyles, Theme, useTheme } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import AddIcon from '@material-ui/icons/Add';
import { EventTypeSampleQuery } from "../bus/message-bus-events";
import "../globalServices"
import Editor from './Editor';
import { Grid, IconButton } from '@material-ui/core';
import { stringify } from 'node:querystring';
import { v4 as uuidv4 } from 'uuid';
/**
 * Prevent React component from re-rendering
 * https://stackoverflow.com/questions/40909902/shouldcomponentupdate-in-function-components/40910993
 */
interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  label: string;
}

const TabPanel = React.memo((props: TabPanelProps) => {
  const { children, index, ...other } = props;
  console.info(`Rendering TabPanel : ${index}`)

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
          <Editor id={ uuidv4() }/>
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
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const [tabList, setTabList] = React.useState<TabPanelProps[]>();

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  // get message bus
  let eventBus = globalThis.services.eventBus
  eventBus.on(
    EventTypeSampleQuery,
    (event): void => {
      (async () => {
        if (event.data.type === 'file') {
          addTab(event.data.id, event.data.name)
        }
      }
      )()
    }
  )

  const addTab = (id: string, label: string) => {
    let prop = {
      index: id,
      value: id,
      label: label
    }
    if (tabList == undefined) {
      setTabList([prop])
    } else {
      setTabList([...tabList, prop])
    }
  }

  const handleChangeTabAdd = () => {
    console.info('Adding tab')
    addTab(`${new Date().getTime()}`, 'New Tab')
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


  const MemoChild = React.memo(Editor, (p, n) => { return true });

  return (
    <div className='Editor-Container'>
      <div className='Editor-Container-Header'>
        <Grid container justify="space-between" style={{ padding: "0px", border: "0px solid green" }} >
          <Grid item>
            <Tabs
              value={value}
              onChange={handleChange}
              indicatorColor="primary"
              textColor="primary"
              variant="scrollable"
              scrollButtons="auto"
              aria-label="Query samples"
              style={{ padding: "0px", border: "0px solid green", display: 'flex', width: '100%', flexDirection: 'column' }}

              TabIndicatorProps={{
                style: {
                  height: "4px",
                }
              }}
            >
              <Tab label="Script #1" {...a11TabProps(0)} className={classes.tab} ></Tab>
              <Tab label="Script #2" {...a11TabProps(1)} className={classes.tab} ></Tab>

              {
                tabList?.map((tab) => (
                  <Tab
                    value={tab.index}
                    label={tab.label}
                    {...a11TabProps(tab.index)}
                    className={classes.tab}
                  />
                ))
              }
            </Tabs>
          </Grid>
          <Grid item>
            <IconButton color="primary" aria-label="add tab" component="span" onClick={handleChangeTabAdd}>
              <AddIcon />
            </IconButton>
          </Grid>
        </Grid>
      </div>


      <div className='Editor-Content'>
        {/* Initial panel */}
        <div style={getVisibilityStyle(value != 0)}>
          <TabPanel index={0} label={'Script 0'} />
        </div>
{/*
        <div style={getVisibilityStyle(value != 1)}>
          <TabPanel index={1} label={'Script 1'} />
        </div> */}
      </div>
    </div>
  );
}
