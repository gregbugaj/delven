import React, { useEffect } from 'react';
import { makeStyles, withStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import "../globalServices"

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import MuiListItem from "@material-ui/core/ListItem";

import ListItemText from "@material-ui/core/ListItemText";
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import { Collapse, ListItemSecondaryAction, IconButton, createStyles } from '@material-ui/core';
import { useStylesSidePanel } from './useStylesSidePanel';

import CloseIcon from '@material-ui/icons/Close';
import { EventTypeAddTab, EventTypeCloseTab } from "../bus/message-bus-events";
import { useThemeContext } from './ReferenceDataContext';
import { EditorContext } from './EditorContext';


const useStyles = makeStyles((theme: Theme) => ({
  root: {
    flexGrow: 1,
    width: '100%',
    height: '100%',
    backgroundColor: theme.palette.background.paper,
  },

}));

export default function EditorPanel() {
  const { theme, setTheme } = useThemeContext()!;
  return (
    <div className='Editor-Content'>
      <div className='Editor-Container' style={{ padding: "0px", border: "0px solid red" }} >
        <div className='Editor-Container-Header' style={{ border: "1px solid blue", display: "none" }}>
          HD :  {Date.now()}
        </div>

        <div className='Editor-Content' style={{ border: "0px solid green" }} >
          {/* <div style={{ backgroundColor: theme }}>
            <select value={theme} onChange={e => setTheme(e.currentTarget.value)}>
              <option value="white">White</option>
              <option value="lightblue">Blue</option>
              <option value="lightgreen">Green</option>
            </select>
            <span>Hello!</span>
          </div> */}

          <ListMenu />
        </div>

        <div className='Editor-Container-Footer' style={{ border: "1px solid blue", display: "none" }}>
          FT :   {Date.now()}
        </div>
      </div>
    </div>
  );
}


function ListMenu() {
  const [session, setSession] = React.useContext(EditorContext)

  const [openEditor, setOpenEditor] = React.useState(true);
  const [openSession, setOpenSession] = React.useState(true);

  const handleEditorClick = () => {
    setOpenEditor(!openEditor);
  };

  const handleSessionClick = () => {
    setOpenSession(!openSession);
  };

  const classes = useStylesSidePanel();


  useEffect(()=>{
    console.info("Session effect")
    console.info(session)

  }, [session])


  const useStylesEditorListing = makeStyles((theme: Theme) => createStyles({
    root: {
      width: '100%',
      height: "100%",
      border: "1px solid red",
      padding: "0px",
      margin: "0px"
    },

    parent: {
      backgroundColor: 'yellow',
      '&:hover $child': {
        color: 'red'
      }

    },
    child: {
      fontSize: '2em',
      padding: 10
    }
  }));

  // const editorClasses = useStylesEditorListing()

  // const ListItem = withStyles({
  //   root: {
  //     "&$selected": {
  //       backgroundColor: "red",
  //       color: "white"
  //     },
  //     "&$selected:hover": {
  //       backgroundColor: "purple",
  //       color: "white"
  //     },
  //     "&:hover": {
  //       backgroundColor: "blue",
  //       color: "white"
  //     }
  //   },
  //   selected: {}
  // })(MuiListItem);

  const eventBus = globalThis.services.eventBus;

  const handleEditorClose = (id) => {
    console.info('Closing editor : ' + id)
    eventBus.emit(new EventTypeCloseTab(id));
  }

  return (
    <List className={classes.root}>

      <ListItem button onClick={handleEditorClick} className={classes.item} key="editors">
        <ListItemText
          disableTypography
          primary={<Typography className={classes.heading}>Editors</Typography>}
        />
        {openEditor ? <ExpandLess /> : <ExpandMore />}
      </ListItem>

      <Collapse in={openEditor} timeout="auto">
        <List dense={true} >
          {
            session.editors?.map((editor, i) => (
              <ListItem key={editor.id}>
                <ListItemText primary={`${editor.name}`} />
                <ListItemSecondaryAction>
                  <IconButton edge="end" aria-label="close" onClick={() => handleEditorClose(editor.id)}>
                    <CloseIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))
          }
        </List>
      </Collapse>

      <ListItem button onClick={handleSessionClick} className={classes.item} key="session">
        <ListItemText
          disableTypography
          primary={<Typography className={classes.heading}>Sessions</Typography>}
        />
        {openSession ? <ExpandLess /> : <ExpandMore />}
      </ListItem>

      <Collapse in={openSession} timeout="auto" >
        Sessions {Date.now()}
      </Collapse>
    </List>
  )
}
