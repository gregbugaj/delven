import React from 'react';
import { makeStyles, Theme, useTheme } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import AddIcon from '@material-ui/icons/Add';
import { EventTypeSampleQuery } from "../bus/message-bus-events";
import "../globalServices"
import Editor from './Editor';
import { Grid, IconButton } from '@material-ui/core';


interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
  label: string;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      style={{
        overflowY: 'auto',
        padding: "0px", border: "2px solid green", height: '100%', width: '100%', flexDirection: 'column'
      }}
      {...other}
    >
      {value === index && (
        <div style={{ padding: "0px", border: "2px solid black", height: '100%', width: '100%', flexDirection: 'column' }}>
        {/* {children} */}

          <Editor/>

          {/* Full Size panel */}
          {/* <div style={{ padding: "0px", border: "2px solid purple", display: 'flex', height: '100%', width: '100%', flexDirection: 'column' }} >
              Main
          </div> */}

        </div>
      )}
    </div>
  );
}

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


  return (
    <div className={classes.root}
      style={{
        padding: "0px", border: "0px solid purple",
        display: 'flex', height: '100%', width: '100%', flexDirection: 'column'
      }}
    >

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
            <Tab label="Script" {...a11TabProps(0)} className={classes.tab} ></Tab>

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

      {/* Initial panel */}
      <TabPanel value={value} index={0} label={'Script x'} />
    </div>
  );
}
