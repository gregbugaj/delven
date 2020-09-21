import React from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import Badge from "@material-ui/core/Badge";
import Container from "@material-ui/core/Container";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import NotificationsIcon from "@material-ui/icons/Notifications";

import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ListSubheader from "@material-ui/core/ListSubheader";
import DashboardIcon from "@material-ui/icons/Dashboard";
import PeopleIcon from "@material-ui/icons/People";
import BarChartIcon from "@material-ui/icons/BarChart";
import LayersIcon from "@material-ui/icons/Layers";
import AssignmentIcon from "@material-ui/icons/Assignment";
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Collapse from '@material-ui/core/Collapse';

import { BrowserRouter as Router, Route, withRouter, Switch} from "react-router-dom"

// Customization
import { AdapterLink } from "../utils/NavLinkMui";
import ModuleSelect from '../shared/select-modules';
import BreadcrumModule from '../shared/breadcrumbs';

import Editor from './Editor'
import FullWidthTabs from './TabbedMenu'

import { EventTypes } from "../bus/message-bus-events";
import { EventTypeA, EventTypeB, EventTypeC, EventTypeSampleQuery  } from "../bus/message-bus-events";
import { MessageBusGroup } from "../bus/message-bus";
import { MessageBusService } from "../bus/message-bus";
 

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    padding:0,
    minHeight:"100vh",

  },
  toolbar: {
    paddingRight: 24 // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "0 8px",
    ...theme.mixins.toolbar
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  menuButton: {
    marginRight: 36
  },
  menuButtonHidden: {
    display: "none"
  },
  title: {
    flexGrow: 1
  },
  drawerPaper: {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  drawerPaperClose: {
    overflowX: "hidden",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9)
    }
  },

  appBarSpacer: {
    minHeight: 80,
    border:'0px solid green'
  },

  content: {
    flexGrow: 1,
    height: "100vh",
    overflow: "auto",
  },
  
  container: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(4),
    paddingLeft : 0,
    paddingRight : 0
  },

  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column"
  },

  fixedHeight: {
    height: 240
  },

  nested: {
    paddingLeft: theme.spacing(4),
  },
}));

const DefaultComponent = () => {
    return (
       <div style={{border:'0px solid red', height:'100%'}}>
          <Editor></Editor>
       </div>
    );
};

//<Editor></Editor>

const SettingsComponent = () => {
    return (
        <div>
            <Typography variant="h6">
            Settings Component
            </Typography>
        </div>
    );
};

const IntegrationComponent = () => {
    return (
        <div>
            <Typography variant="h6">
            Integration Component
            </Typography>
        </div>
    );
};


const breadcrumbNameMap: { [key: string]: string } = {
  '/explorer': 'AST Explorer',
  '/explorer/settings': 'Settings',
  '/explorer/settings/plugins': 'Plugins',
  '/explorer/settings/feature-b': 'Admin - Future B',
  '/explorer/settings/feature-c': 'Admin - Future C',
};
 

function AstExplorerApplication() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);
  
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const [openAdmin, setOpenAdmin] = React.useState(true);

  const handleAdminClick = () => {
      setOpenAdmin(!openAdmin);
  };


  return (

    // style={{ height: 40, minHeight:40 }}
    // style={{ height: 40, minHeight:40 }}
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        color='default'
        position="absolute"
        className={clsx(classes.appBar, open && classes.appBarShift)}  
      >
        <Toolbar className={classes.toolbar} >
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            className={clsx(
              classes.menuButton,
              open && classes.menuButtonHidden
            )}
          >
            <MenuIcon />
          </IconButton>

          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            className={classes.title}
          >

            <BreadcrumModule breadcrumbs={breadcrumbNameMap} label="Explorer"/>
          </Typography>

          <ModuleSelect/>
        </Toolbar>
      </AppBar>

      
      <Drawer
        variant="permanent"
        classes={{
          paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose)
        }}
        open={open}
      >
        <div className={classes.toolbarIcon}>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />

        <List>

          <ListItem button onClick={handleAdminClick} component={AdapterLink} to='/explorer/settings' >
            <ListItemIcon>
              <PeopleIcon />
            </ListItemIcon>
            <ListItemText primary="Settings" />
            {openAdmin ? <ExpandLess /> : <ExpandMore />}
          </ListItem>

            <Collapse in={openAdmin} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                <ListItem button component={AdapterLink} to='/explorer/settings/plugins' className={classes.nested}>
                    <ListItemIcon>
                         <AssignmentIcon />
                    </ListItemIcon>
                    <ListItemText primary="Plugins" />
                </ListItem>

                <ListItem button component={AdapterLink} to='/explorer/settings/feature-b' className={classes.nested}>
                    <ListItemIcon>
                         <AssignmentIcon />
                    </ListItemIcon>
                    <ListItemText primary="Feature B" />
                </ListItem>

                <ListItem button component={AdapterLink} to='/explorer/settings/feature-c' className={classes.nested}>
                    <ListItemIcon>
                         <AssignmentIcon />
                    </ListItemIcon>
                    <ListItemText primary="Feature C" />
                </ListItem>
                </List>
            </Collapse>


          <ListItem button component={AdapterLink} to='/explorer/integration'>
            <ListItemIcon>
              <LayersIcon />
            </ListItemIcon>
            <ListItemText primary="Integrations" />
          </ListItem>
        </List>
        <Divider />

        <FullWidthTabs></FullWidthTabs>
      </Drawer>

      <main className={classes.content}>
        <div style={{minHeight:64}}/>
        <Container maxWidth="xl" className={classes.container} style={{border:'0px solid green', padding:'0px', height: 'calc(100vh - 64px)'}} >

          <Switch>
            <Route exact path='/explorer' component={DefaultComponent} />
            <Route exact path='/explorer/settings' component={SettingsComponent} />
            <Route path='/explorer/integration' component={IntegrationComponent} />
          </Switch>

          </Container>  
      </main>
    </div>    

  );
}

/*
  <div className={classes.appBarSpacer}  />

        <Container maxWidth="xl" className={classes.container} style={{border:'0px solid green',  height: "100vh"}} >

          <Switch>
            <Route exact path='/explorer' component={DefaultComponent} />
            <Route exact path='/explorer/settings' component={SettingsComponent} />
            <Route path='/explorer/integration' component={IntegrationComponent} />
          </Switch>
   
        </Container>  
*/

function FooterXXX() {
  return (
      <AppBar position="static" color="primary">
        <Container maxWidth="md">
          <Toolbar>
            <Typography variant="body1" color="inherit">
              &copy; 2020 Greg
            </Typography>
          </Toolbar>
        </Container>
      </AppBar>
  )
}


export default AstExplorerApplication;
