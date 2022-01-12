import React, {useContext} from 'react';
import {makeStyles, Theme} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';


import "../globalServices"

import {SideTreeView} from '../explorer/TabbedMenu';
import {Button, Collapse} from '@material-ui/core';


import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import {useStylesSidePanel} from '../explorer/useStylesSidePanel';
import {EditorContext} from '../explorer/EditorContext';

import {
    EuiCollapsibleNavGroup,
    EuiButton,
    EuiPanel,
    EuiFlexItem,
    EuiFlexGroup,
    EuiListGroup,
} from '@elastic/eui';

import "../globalServices"
import {SharedDeployPanel} from "../shared/SharedPanelContainer";


const useStyles = makeStyles((theme: Theme) => ({
    root: {
        flexGrow: 1,
        width: '100%',
        height: '100%',
        backgroundColor: theme.palette.background.paper,
    },

}));

function WorkspacePanelV1() {
    const [session, setSession] = React.useContext(EditorContext)

    return (
        <div className='Editor-Content'>
            <div className='Editor-Container' style={{padding: "0px", border: "0px solid red"}}>
                <div className='Editor-Container-Header' style={{border: "1px solid blue", display: "none"}}>
                    HD : {Date.now()}
                </div>

                <div className='Editor-Content' style={{border: "px solid green"}}>
                    {/* Editors:
          <ul>
            {
              session.editors?.map((editor, i) => (
                <li>
                  {editor.name} <br />
                </li>
              ))
            }
          </ul> */}
                    <ListMenu/>
                </div>

                <div className='Editor-Container-Footer' style={{
                    border: "0px solid blue",
                    display: "",
                    minHeight: "120px",
                    padding: "2px",
                    backgroundColor: "#F5F5F5"
                }}>
                    <div style={{overflowWrap: "break-word"}}>
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

            <ListItem button onClick={handleEditorClick} className={classes.item}>
                <ListItemText
                    disableTypography
                    primary={<Typography className={classes.heading}>My Queries</Typography>}
                />
                {openEditor ? <ExpandLess/> : <ExpandMore/>}
            </ListItem>

            <Collapse in={openEditor} timeout="auto" className={classes.details}>
                <p>No items present</p>

                <hr/>
                <Button size="small" variant="contained" color="primary">
                    Add Script
                </Button>
            </Collapse>

            <ListItem button onClick={handleSessionClick} className={classes.item}>

                <ListItemText
                    disableTypography
                    primary={<Typography className={classes.heading}>Sample Queries</Typography>}
                />
                {openSession ? <ExpandLess/> : <ExpandMore/>}
            </ListItem>

            <Collapse in={openSession} timeout="auto" className={classes.details}>
                <SideTreeView></SideTreeView>
            </Collapse>
        </List>
    )
}

function WorkspaceSidePanel({
                               isVisible,
                               label
                           }: React.PropsWithChildren<{ isVisible: boolean, label: string }>) {

    console.info(`WorkspaceSidePanel visible : ${isVisible} : [${label}]`)

    return (
        <EuiPanel tabIndex={0}
                  hasShadow={false}
                  hasBorder={false}
                  borderRadius='none'
                  paddingSize='none'
                  hidden={!isVisible}
        >
            <EuiFlexGroup gutterSize="none" direction="column" className="eui-fullHeight">
                <EuiFlexItem grow={true}>
                    <EuiCollapsibleNavGroup
                        title={
                            <a
                                className="eui-textInheritColor"
                                href="#/workspace"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <h1>Workspace :: {label}</h1>
                            </a>
                        }
                        buttonElement="div"
                        iconType="logoKibana"
                        isCollapsible={true}
                        initialIsOpen={true}
                        onToggle={(isOpen: boolean) => () => {
                        }}
                    >

                        <div>Workspace content</div>
                    </EuiCollapsibleNavGroup>
                </EuiFlexItem>

                {/* anchor to the bottom of the view */}
                <EuiFlexItem grow={false}>
                    <SharedDeployPanel/>
                </EuiFlexItem>
            </EuiFlexGroup>
        </EuiPanel>
    );
}

export default React.memo(WorkspaceSidePanel);