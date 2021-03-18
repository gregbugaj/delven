import React from 'react';
import { useState, useEffect } from 'react';
import { makeStyles, Theme, useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import Divider from "@material-ui/core/Divider";
import FavoriteIcon from '@material-ui/icons/AccountBox';
import AddIcon from '@material-ui/icons/Add';
import { EventTypeSampleQuery } from "../bus/message-bus-events";
import "../globalServices"
import Editor from './Editor';
import { Button, Grid, IconButton, Paper } from '@material-ui/core';


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
            id={`query-tabpanel-${index}`}
            aria-labelledby={`query-tab-${index}`}
            style={{
              overflowY:'auto',
              padding: "0px", border: "0px solid purple",  height: '100%', width: '100%', flexDirection: 'column' }}
            {...other}
        >
            {value === index && (
                <div style={{ padding: "0px", border: "0px solid purple",  height: '100%', width: '100%', flexDirection: 'column' }}>
                    {/* {children} */}
                    <Editor/>
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
        minWidth: 80,
        fontWeight: theme.typography.fontWeightLight,
        marginRight: theme.spacing(1),
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
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
  const theme = useTheme();
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
        let id = event.data.id
          ; (async () => {
            if(event.data.type === 'file') {
                addTab(event.data.id, event.data.name)
            }
          }
          )()
      }
    )

  const addTab = (id:string, label: string)=>{
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

  const handleChangeTabAdd = (event: React.ChangeEvent<{}>) => {
    console.info('Adding tab')
    addTab(`${new Date().getTime()}`, 'New Tab')
  };

    const preventDefault = (event: React.SyntheticEvent) => event.preventDefault();

    return (
        <div className={classes.root}
          style={{
          padding: "0px", border: "0px solid purple",
          display: 'flex', height: '100%', width: '100%', flexDirection: 'column' }}
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
                      style={{ padding: "0px", border: "0px solid green", display: 'flex',  width: '100%', flexDirection: 'column' }}
                    >
                      <Tab label="Script" {...a11TabProps(0)} className={classes.tab} ></Tab>
                      {
                            tabList?.map((tab)=>(
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
            <TabPanel value={value} index={0} label = {'Script x'}/>
        </div>
    );
}
