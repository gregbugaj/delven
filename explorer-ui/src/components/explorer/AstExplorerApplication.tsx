import React, { useEffect, useState } from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Drawer from "@material-ui/core/Drawer";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Grid from '@material-ui/core/Grid';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';

import DescriptionIcon from '@material-ui/icons/Description';
import SettingsIcon from '@material-ui/icons/Settings';
import LiveHelpIcon from '@material-ui/icons/LiveHelp';
import InfoIcon from '@material-ui/icons/Info';
import SimCardIcon from '@material-ui/icons/SimCard';

import { Route, Switch } from "react-router-dom"

import BreadcrumModule from '../shared/breadcrumbs';

import TabbedEditor from './TabbedEditor'
import { EventTypeCompileReply, EventTypeEditorKeyDown } from "../bus/message-bus-events";
import ShortcutsComponent from "../settings/Shortcuts";
import EditorPanel from "./EditorPanel";
import WorkspacePanel from "./WorkspacePanel";
import SettingsPanel from "./SettingsPanel";

import { ThemeProvider } from "./ReferenceDataContext"
import { EditorProvider, EditorContext, IEditor, ISession } from "./EditorContext"

const drawerWidth = 300;

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    padding: 0,
    minHeight: 'calc(100vh - 32px)',
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

    width: '5px',//theme.spacing(27),
    [theme.breakpoints.up("sm")]: {
      // width: theme.spacing(9),
      width: theme.spacing(0),
    },
  },

  content: {
    flexGrow: 1,
    overflow: "auto",
  },

  container: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(4),
    paddingLeft: 0,
    paddingRight: 0
  },

  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column"
  },

  nested: {
    paddingLeft: theme.spacing(4),
  },

}));


const DefaultComponent = () => {
  return (
    <div style={{ border: '0px solid red', height: '100%' }}>
      <TabbedEditor></TabbedEditor>
    </div>
  );
};

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
  '/explorer/settings/shortcuts': 'Shortcuts',
};



const useStylesModal = makeStyles((theme) => ({
  paper: {
    // position: 'absolute',
    width: 800,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },

  modal: {
    display: 'flex',
    padding: theme.spacing(3),
    alignItems: 'center',
    justifyContent: 'center',
  },

}));


function AstExplorerApplication() {
  const classes = useStyles();
  const [compileTime, setCompileTime] = React.useState(0);
  const [renderType, setRenderType] = React.useState("editor");
  // https://kentcdodds.com/blog/how-to-use-react-context-effectively
  // const CountContext = React.createContext({ch:1, line:1})
  const [pos, setEditorPosition] = React.useState({ ch: 0, line: 0 });
  const [open, setOpen] = React.useState(true);

  function handleViewChange(renderTypeChange: string) {
    if (renderTypeChange != renderType) {
      setOpen(true);
      setRenderType(renderTypeChange)
    } else if (renderTypeChange == renderType) {
      setOpen(!open);
    }
  }

  let eventBus = globalThis.services.eventBus

  eventBus.on(EventTypeCompileReply,
    (event: EventTypeCompileReply): void => {
      // console.info(`event == ${JSON.stringify(event)}  ${new Date()}`)
      const compileTime = event.data.compileTime;
      setCompileTime(compileTime);
    }
  )

  eventBus.on(EventTypeEditorKeyDown, (event: EventTypeEditorKeyDown): void => {
    let data = event.data
    // console.info(`Data : ${ch} , ${line}`)
    setEditorPosition(data)
  }
  )

  const modalClasses = useStylesModal();
  const [modalopen, setModalOpen] = React.useState(false);

  const handleShortcutsOpen = () => {
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
  };

  interface ModalProps {
    children?: React.ReactNode;
  }

  const SimpleModal = (props: ModalProps) => {
    const { children } = props;
    return (
      <Modal
        open={modalopen}
        onClose={handleClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        className={modalClasses.modal}
      >
        <div className={modalClasses.paper}>
          {children}
        </div>
      </Modal>
    )
  }

  const styles = {
    largeIcon: {
      width: 40,
      height: 60,
    },
  };


  const initialState: ISession = {
    name: `Session : ${Date.now()}`,
    editors: [
      {
        name: "Editor 1a",
        id: 11
      },
      {
        name: "Editor 2b",
        id: 22
      }, {
        name: "Editor 3c",
        id: 22
      }
    ]
  };


  function ChangeButtonComponent() {
    const [session, setSession] = React.useContext(EditorContext)

    const toggleLocale = () => {
      console.info('Locale change ')

      const val: IEditor = {
        name: `EditorA >>  : ${Date.now()}`,
        id: Date.now(),
      }

      const updated: ISession = {
        name: session.name,
        editors: [...session.editors, val]
      }
      setSession(updated)
    }

    return (
      <React.Fragment>
        <Button onClick={toggleLocale}> Change</Button>
        <div>session: ${session.name}</div>
        {/*
        Session Editors:
          <ul>
            {
              session.editors?.map((editor, i) => (
                <li>
                  {editor.name} <br />
                </li>
              ))
            }
          </ul> */}
      </React.Fragment>
    )
  }


  return (
    <div style={{ border: '0px solid green', padding: '0px' }} >
      <CssBaseline />
      <EditorProvider>

        <SimpleModal>
          <ShortcutsComponent />
          {/* <h2 id="modal-title">Text in a modal</h2>
          <p id="modal-description">
            Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
        </p> */}
        </SimpleModal>


        <div className={classes.root} style={{
          border: '0px solid green', padding: '0px', width: '60px', float: 'left',
          backgroundColor: "#eaeae1"
        }}  >

          <List>
            <ListItem button key="editor" onClick={(e) => handleViewChange('editor')}>
              <ListItemIcon><DescriptionIcon style={styles.largeIcon} /></ListItemIcon>
            </ListItem>

            <ListItem button key="workspace" onClick={(e) => handleViewChange('workspace')}>
              <ListItemIcon><SimCardIcon style={styles.largeIcon} /></ListItemIcon>
            </ListItem>

            <ListItem button key="settings" onClick={(e) => handleViewChange('settings')}>
              <ListItemIcon><SettingsIcon style={styles.largeIcon} /></ListItemIcon>
            </ListItem>

            <ListItem button key="runners" onClick={(e) => handleViewChange('runners')}>
              <ListItemIcon><InfoIcon style={styles.largeIcon} /></ListItemIcon>
            </ListItem>

            <ListItem button key="help" onClick={(e) => handleViewChange('help')}>
              <ListItemIcon><LiveHelpIcon style={styles.largeIcon} /></ListItemIcon>
            </ListItem>

          </List>
        </div>

        <div className={classes.root} style={{ border: '0px solid green', padding: '0px' }} >

          <Drawer
            transitionDuration={0}
            variant="persistent"
            classes={{
              paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose)
            }}
            open={open}
          >

            <div className='Editor-Container' style={{ padding: "0px", border: "0px solid red", overflowX: 'hidden', height: 'calc(100vh - 32px)' }} >
              <div className='Editor-Container-Header' style={{ border: "0px solid blue", display: "none" }}>
                <h5>RenderType :  {renderType} {Date.now()}</h5>
              </div>

              <div className='Editor-Content' style={{ paddingLeft: '5px' }} >

                <div id={`side-container-editor`} style={{ display: renderType === 'editor' ? "flex" : "none", flexDirection: 'column', height: '100%' }}>
                  <ThemeProvider>
                    <EditorPanel></EditorPanel>
                  </ThemeProvider>
                </div>

                <div id={`side-container-workspace`} style={{ display: renderType === 'workspace' ? "flex" : "none", flexDirection: 'column', height: '100%' }}>
                  <WorkspacePanel></WorkspacePanel>
                </div>

                <div id={`side-container-settings`} style={{ display: renderType === 'settings' ? "flex" : "none", flexDirection: 'column', height: '100%' }}>
                  <SettingsPanel></SettingsPanel>
                </div>

                <div id={`side-container-runners`} style={{ display: renderType === 'runners' ? "flex" : "none", flexDirection: 'column', height: '100%' }}>
                  runners
                  RenderType :  {renderType}  {Date.now()}
                </div>

                <div id={`side-container-help`} style={{ display: renderType === 'help' ? "flex" : "none", flexDirection: 'column', height: '100%' }}>
                  help
                  RenderType :  {renderType}  {Date.now()}
                </div>

              </div>

              <div className='Editor-Container-Footer' style={{ border: "1px solid blue", display: "None" }}>
                Footer
              RenderType :  {renderType}  {Date.now()}
              </div>
            </div>

          </Drawer>

          <main className={classes.content}>
            {/* 32px refers to size of fixed footer */}
            <Container maxWidth="xl" className={classes.container} style={{ border: '0px solid green', padding: '0px', height: 'calc(100vh - 32px)' }} >

              <Switch>
                <Route exact path='/explorer' component={DefaultComponent} />
                <Route exact path='/explorer/settings' component={SettingsComponent} />
                <Route path='/explorer/integration' component={IntegrationComponent} />
                <Route path='/explorer/settings/shortcuts' component={ShortcutsComponent} />
              </Switch>

            </Container>
          </main>
        </div>

        <div className="footer">
          <Grid container direction="row" justify="space-between">
            <Grid item>
              <ButtonGroup size="small" variant="text" color="primary" aria-label="text primary button group">
                <Button>Execution time : {compileTime}ms</Button>
                <Button>Line  {pos.line}, Column {pos.ch}</Button>
                <Button> <BreadcrumModule breadcrumbs={breadcrumbNameMap} label="Explorer" /></Button>
              </ButtonGroup>

            </Grid>
            <Grid item>
              <ButtonGroup size="small" variant="text" color="primary" aria-label="text primary button group">
                <Button onClick={handleShortcutsOpen}>Shortcuts</Button>
                <Button>Fork</Button>
                <Button>Share</Button>
                <Button>Build : ####</Button>
              </ButtonGroup>
            </Grid>
          </Grid>
        </div>

      </EditorProvider>
    </div>
  );
}

export default AstExplorerApplication;
