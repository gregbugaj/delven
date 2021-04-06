import React, { useContext } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';


import "../globalServices"

import { SideTreeView } from './TabbedMenu';
import { Button, Collapse } from '@material-ui/core';


import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import { useStylesSidePanel } from './useStylesSidePanel';
import { EditorContext } from './EditorContext';


const useStyles = makeStyles((theme: Theme) => ({
  root: {
    flexGrow: 1,
    width: '100%',
    height: '100%',
    backgroundColor: theme.palette.background.paper,
  },

}));

export default function WorkspacePanel() {
  const x = React.useContext(EditorContext)

  const useTheme = () => React.useContext(EditorContext);
  console.info(useTheme)

  let editors = x[0]
  console.info(x)
  console.info(editors)

  return (
    <div className='Editor-Content'>
      <div className='Editor-Container' style={{ padding: "0px", border: "0px solid red" }} >
        <div className='Editor-Container-Header' style={{ border: "1px solid blue", display: "none" }}>
          HD :   {Date.now()}
        </div>

        <div className='Editor-Content' style={{ border: "px solid green" }} >
          Editors:
          <ul>
            {
              editors?.map((editor, i) => (
                <li>
                  {editor.name} <br />
                </li>
              ))
            }
          </ul>
          <ListMenu />
        </div>

        <div className='Editor-Container-Footer' style={{ border: "0px solid blue", display: "", minHeight: "120px", padding: "2px", backgroundColor: "#F5F5F5" }}>
          <div style={{ overflowWrap: "break-word" }}>
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
  return (
    <List className={classes.root}>

      <ListItem button onClick={handleEditorClick} className={classes.item} >
        <ListItemText
          disableTypography
          primary={<Typography className={classes.heading}>My Queries</Typography>}
        />
        {openEditor ? <ExpandLess /> : <ExpandMore />}
      </ListItem>

      <Collapse in={openEditor} timeout="auto" className={classes.details}>
        <p>No items present</p>
      </Collapse>

      <ListItem button onClick={handleSessionClick} className={classes.item} >

        <ListItemText
          disableTypography
          primary={<Typography className={classes.heading}>Sample Queries</Typography>}
        />
        {openSession ? <ExpandLess /> : <ExpandMore />}
      </ListItem>

      <Collapse in={openSession} timeout="auto" className={classes.details}>
        <SideTreeView></SideTreeView>
      </Collapse>
    </List>
  )
}
