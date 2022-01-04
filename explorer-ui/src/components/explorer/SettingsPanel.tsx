import React from 'react';
import {makeStyles, Theme} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import "../globalServices"
import {Button, Collapse} from '@material-ui/core';

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import {useStylesSidePanel} from './useStylesSidePanel';


import Switch from '@material-ui/core/Switch';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        flexGrow: 1,
        width: '100%',
        height: '100%',
        backgroundColor: theme.palette.background.paper,
    },

}));

export default function SettingsPanel() {

    return (
        <div className='Editor-Content'>
            <div className='Editor-Container' style={{padding: "0px", border: "0px solid red"}}>
                <div className='Editor-Container-Header' style={{border: "1px solid blue", display: "none"}}>
                    HD : {Date.now()}
                </div>

                <div className='Editor-Content' style={{border: "px solid green"}}>
                    <ListMenu/>
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

    const [checkedLineNumbers, setCheckedLineNumbers] = React.useState(true);
    const [checkedIndentWithTabs, setCheckedIndentWithTabs] = React.useState(false);
    const [checkedWrapLines, setCheckedWrapLines] = React.useState(false);

    const toggleLineNumbersChecked = () => {
        setCheckedLineNumbers((prev) => !prev)
    }

    const toggleIndentWithTabsChecked = () => {
        setCheckedIndentWithTabs((prev) => !prev)
    }

    const toggleWrapLinesChecked = () => {
        setCheckedWrapLines((prev) => !prev)
    }

    const handleChange = (event: Object) => {
        console.info("Selection : %s", event)
    }

    const classes = useStylesSidePanel();

    return (
        <List className={classes.root}>

            <ListItem button onClick={handleEditorClick} className={classes.item}>
                <ListItemText
                    disableTypography
                    primary={<Typography className={classes.heading}>Editor Settings</Typography>}
                />
                {openEditor ? <ExpandLess/> : <ExpandMore/>}
            </ListItem>

            <Collapse in={openEditor} timeout="auto" className={classes.details}>
                {/* <h4>Editor layout</h4>
        <hr /> */}
                <h4>General</h4>

                <FormGroup>
                    <FormControlLabel
                        control={<Switch checked={checkedLineNumbers} onChange={toggleLineNumbersChecked}/>}
                        label="Line numbers"
                    />

                    <FormControlLabel
                        control={<Switch checked={checkedIndentWithTabs} onChange={toggleIndentWithTabsChecked}/>}
                        label="Indent with tabs"
                    />

                    <FormControlLabel
                        control={<Switch checked={checkedWrapLines} onChange={toggleWrapLinesChecked}/>}
                        label="Wrap Lines"
                    />

                    <FormControl color="primary">
                        <InputLabel id="indent-select-label">Indent size</InputLabel>
                        <Select
                            labelId="indent-select-label"
                            onChange={handleChange}
                        >
                            <MenuItem value={2}>2 Spaces</MenuItem>
                            <MenuItem value={4}>4 Spaces</MenuItem>
                        </Select>
                    </FormControl>
                </FormGroup>

            </Collapse>

            <ListItem button onClick={handleSessionClick} className={classes.item}>

                <ListItemText
                    disableTypography
                    primary={<Typography className={classes.heading}>Executor Runner</Typography>}
                />
                {openSession ? <ExpandLess/> : <ExpandMore/>}
            </ListItem>

            <Collapse in={openSession} timeout="auto" className={classes.details}>
                Runner info
            </Collapse>
        </List>
    )
}
