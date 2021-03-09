import React from 'react';
import clsx from 'clsx';

import logo from './logo.svg';
import './App.css';


import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';

import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import NotificationsIcon from '@material-ui/icons/Notifications';

import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";

import NavBar from './components/NavBar'
import ModuleSelect from './components/shared/select-modules'
import RunnerApplication from "./components/runner/RunnerApplication";
import AstExplorerApplication from "./components/explorer/AstExplorerApplication";

import { BrowserRouter as Router, Route, Link, withRouter } from "react-router-dom"

import { mainListItems, secondaryListItems } from './listItems';

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    padding: 10

  },

  card: {
    maxWidth: 345,
    minWidth: 345,
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'column'
  },

  grid: {
    display: 'flex'
  },

  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },


  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },

  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },

  appBarSpacer: {
    minHeight: 56,
  },

  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },

  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 240,
  },

}));


export function Application() {
  const classes = useStyles();

  return (
    <div>
      <CssBaseline />

      <Router>
        <Route path='/runner' component={RunnerApplication} />
        <Route path='/explorer' component={AstExplorerApplication} />

        <Route exact path="/">
          <NavBar />
          <div className={classes.root}>
            <Grid container justify="flex-start" spacing={8}>
              <Grid item className={classes.grid}>
                <Card className={classes.card}>

                  <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                      D-SQL Runner
                      </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">

                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" color="primary" component={Link} to="/runner">
                      Launch
                      </Button>
                  </CardActions>

                </Card>
              </Grid>

              <Grid item className={classes.grid}>
                <Card className={classes.card}>
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                       Explorer
                      </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                       AST Viewer & Compiler
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" color="primary" component={Link} to="/explorer">
                      Launch
                      </Button>
                  </CardActions>
                </Card>
              </Grid>

            </Grid>
          </div>
        </Route>
      </Router>
    </div>
  );
}


function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">

    </Typography>
  );
}



//#export default App;
export default Application
