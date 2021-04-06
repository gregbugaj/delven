import React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import "../globalServices"

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import { Collapse } from '@material-ui/core';
import { useStylesSidePanel } from './useStylesSidePanel';

import { EventTypeAddTab } from "../bus/message-bus-events";
import { useThemeContext } from './ReferenceDataContext';


const useStyles = makeStyles((theme: Theme) => ({
  root: {
    flexGrow: 1,
    width: '100%',
    height: '100%',
    backgroundColor: theme.palette.background.paper,
  },

}));

export default function EditorPanel() {
  // const useTheme = () => React.useContext(ThemeContext);
  const { theme, setTheme } = useThemeContext()!;

  return (
    <div className='Editor-Content'>
      <div className='Editor-Container' style={{ padding: "0px", border: "0px solid red" }} >
        <div className='Editor-Container-Header' style={{ border: "1px solid blue", display: "none" }}>
          HD :  {Date.now()}
        </div>

        <div className='Editor-Content' style={{ border: "0px solid green" }} >

          <div style={{ backgroundColor: theme }}>
            <select value={theme} onChange={e => setTheme(e.currentTarget.value)}>
              <option value="white">White</option>
              <option value="lightblue">Blue</option>
              <option value="lightgreen">Green</option>
            </select>
            <span>Hello!</span>
          </div>

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
  const [openEditor, setOpenEditor] = React.useState(true);
  const [openSession, setOpenSession] = React.useState(true);

  const handleEditorClick = () => {
    setOpenEditor(!openEditor);
  };

  const handleSessionClick = () => {
    setOpenSession(!openSession);
  };

  const classes = useStylesSidePanel();
  const { theme } = useThemeContext()!;

  return (
    <List className={classes.root}>

      <ListItem button onClick={handleEditorClick} className={classes.item}>
        <ListItemText
          disableTypography
          primary={<Typography className={classes.heading}>Editors</Typography>}
        />
        {openEditor ? <ExpandLess /> : <ExpandMore />}
      </ListItem>

      <Collapse in={openEditor} timeout="auto">
        AAA theme = {theme} <EditorListing />
      </Collapse>

      <ListItem button onClick={handleSessionClick} className={classes.item}>
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

function EditorListing() {
  return (
    <div>
      AA
      Editors {Date.now()}
    </div>
  )
}
