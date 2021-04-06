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

// Tree view
import TreeView from "@material-ui/lab/TreeView";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import TreeItem from "@material-ui/lab/TreeItem";

import { EventTypeAddTab, EventTypeSampleQuery } from "../bus/message-bus-events";
import "../globalServices"
import { http } from "../../http"


const useStyles = makeStyles((theme: Theme) => ({
  root: {
    flexGrow: 1,
    width: '100%',
    height: '100%',
    backgroundColor: theme.palette.background.paper,
  },

}));

export default function SettingsPanel(props: {}) {
  const classes = useStyles();
  const eventBus = globalThis.services.eventBus;

  return (
    <div className='Editor-Content'>
      <div className='Editor-Container' style={{ padding: "0px", border: "0px solid red" }} >
        <div className='Editor-Container-Header' style={{ border: "1px solid blue", display: "" }}>
          HD :   {Date.now()}
        </div>

        <div className='Editor-Content' style={{border: "1px solid green" }} >
          Settings<br/>
       </div>

        <div className='Editor-Container-Footer' style={{ border: "1px solid blue", display: "" }}>
          FT :   {Date.now()}
        </div>
      </div>
    </div>
  );
}



