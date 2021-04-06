import React from 'react';
import { useState, useEffect } from 'react';
import { makeStyles, createStyles, Theme, useTheme } from '@material-ui/core/styles';
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

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import PeopleIcon from "@material-ui/icons/People";
import { Collapse } from '@material-ui/core';


const useStyles = makeStyles((theme: Theme) => ({
  root: {
    flexGrow: 1,
    width: '100%',
    height: '100%',
    backgroundColor: theme.palette.background.paper,
  },

}));


export default function EditorPanel(props: {}) {
  const classes = useStyles();
  const eventBus = globalThis.services.eventBus;

  return (

    <div className='Editor-Content'>
      <div className='Editor-Container' style={{ padding: "0px", border: "0px solid red" }} >
        <div className='Editor-Container-Header' style={{ border: "1px solid blue", display: "none" }}>
          HD :  {Date.now()}
        </div>

        <div className='Editor-Content' style={{ border: "0px solid green" }} >
          <ListMenu />
        </div>

        <div className='Editor-Container-Footer' style={{ border: "1px solid blue", display: "none" }}>
          FT :   {Date.now()}
        </div>
      </div>
    </div>
  );
}


const useStylesAccord = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      height:"100%",
      // border:"1px solid red"
    },
    heading: {
      fontSize: theme.typography.pxToRem(12),
      fontWeight: theme.typography.fontWeightBold,
    },

    summary: {
      backgroundColor: '',
      padding: '2px',
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

        <ListItem button onClick={handleEditorClick}  >
          <ListItemText primary="Editors" />
          {openEditor ? <ExpandLess /> : <ExpandMore />}
        </ListItem>

        <Collapse in={openEditor} timeout="auto">
           Editors {Date.now()}
          <hr/>
        </Collapse>

        <ListItem button onClick={handleSessionClick}  >
          <ListItemText primary="Sessions" />
          {openSession ? <ExpandLess /> : <ExpandMore />}
        </ListItem>

         <Collapse in={openSession} timeout="auto" >
           Sessions {Date.now()}
          <hr/>
        </Collapse>
      </List>
  )
}
