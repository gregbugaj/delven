import React from 'react'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'

import { fade, makeStyles } from '@material-ui/core/styles';
import ModuleSelect from './shared/select-modules';

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
      },

    formControl: {
      margin: theme.spacing(1),
      minWidth: 200,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },

    title: {
        flexGrow: 1,
        display: 'none',
        [theme.breakpoints.up('sm')]: {
          display: 'block',
        },
      }
  }));
  
const NavBar = () => {
    const classes = useStyles();
    return(
        <div className={classes.root}>
            <AppBar position="static">
                <Toolbar>
                    <Typography className={classes.title} variant="h5" noWrap>
                        Delven Module Selection
                    </Typography>

                    <ModuleSelect/>
                </Toolbar>
            </AppBar>
        </div>
    )
}

export default NavBar;