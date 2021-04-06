import React from 'react';
import { useState, useEffect } from 'react';
import { createStyles, makeStyles, Theme, useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import Divider from "@material-ui/core/Divider";

// Tree view
import TreeView from "@material-ui/lab/TreeView";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import TreeItem from "@material-ui/lab/TreeItem";

import { EventTypeAddTab, EventTypeSampleQuery } from "../bus/message-bus-events";
import "../globalServices"
import { http } from "../../http"

import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import FullWidthTabs, { SideTreeView } from './TabbedMenu';
import { AccordionActions, Button, Collapse } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';


import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import PeopleIcon from "@material-ui/icons/People";



const useStyles = makeStyles((theme: Theme) => ({
  root: {
    flexGrow: 1,
    width: '100%',
    height: '100%',
    backgroundColor: theme.palette.background.paper,
  },

}));

export default function WorkspacePanel(props: {}) {
  const classes = useStyles();
  const eventBus = globalThis.services.eventBus;

  return (
    <div className='Editor-Content'>
      <div className='Editor-Container' style={{ padding: "0px", border: "0px solid red" }} >
        <div className='Editor-Container-Header' style={{ border: "1px solid blue", display: "none" }}>
          HD :   {Date.now()}
        </div>

        <div className='Editor-Content' style={{ border: "px solid green" }} >
          <ListMenu />
        </div>

        <div className='Editor-Container-Footer' style={{ border: "0px solid blue", display: "", minHeight:"120px", padding:"2px",  backgroundColor: "#F5F5F5"}}>
            <div style={{overflowWrap:"break-word"}}>
            {/* <p>FT :   {Date.now()}</p> */}
            <h5>Link GitHub Account to save your work</h5>
            <Button variant="outlined" color="primary">
              Link
            </Button>
            </div>
        </div>
      </div>
    </div>
  );
}



const useStylesAccord = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      height: "100%",
      // border:"1px solid red"
      padding: "0px"
    },
    item: {
      // border:"1px solid red"
      padding: "2px",
      backgroundColor: "#F5F5F5",
    },

    heading: {
      fontSize: theme.typography.pxToRem(16),
      fontWeight: theme.typography.fontWeightBold,

    },

    details: {
      backgroundColor: '',
      padding: '2px',
    },

  }),
);

function ListMenu() {

  const [openEditor, setOpenEditor] = React.useState(true);
  const [openSession, setOpenSession] = React.useState(true);

  const handleEditorClick = () => {
    setOpenEditor(!openEditor);
  };

  const handleSessionClick = () => {
    setOpenSession(!openSession);
  };

  const classes = useStylesAccord();
  return (
    <List className={classes.root}>

      <ListItem button onClick={handleEditorClick} className={classes.item} >
        <ListItemText
        disableTypography
        // primary="My Queries"
        primary={
            <Typography style={{ color: '#000', fontWeight: 'bold', textTransform:"uppercase" }}>My Queries</Typography>
           }
        />
        {openEditor ? <ExpandLess /> : <ExpandMore />}
      </ListItem>

      <Collapse in={openEditor} timeout="auto" className={classes.details}>
        <p>No items present</p>
      </Collapse>

      <ListItem button onClick={handleSessionClick} className={classes.item} >

        <ListItemText
          disableTypography
          // primary="My Queries"
          primary={
              <Typography style={{ color: '#000', fontWeight: 'bold', textTransform:"uppercase" }}>Sample Queries</Typography>
            }
          />
        {openSession ? <ExpandLess /> : <ExpandMore />}
      </ListItem>

      <Collapse in={openSession} timeout="auto" className={classes.details}>
        <SideTreeView></SideTreeView>
      </Collapse>
    </List>
  )
}
