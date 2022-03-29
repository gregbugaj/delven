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

import { EventTypeAddTab, EventTypeSampleQuery } from "../../bus/message-bus-events";
import "../globalServices"
import { http } from "../../http"

interface RenderTree {
  id: string;
  name: string;
  children?: RenderTree[];
}

function SideTreeView(props: {}) {
  const classes = useStyles();
  const [treeData, setTreeDataState] = useState({} as RenderTree);
  const eventBus = globalThis.services.eventBus;

  const nodeClicked = (event: React.SyntheticEvent, node: RenderTree) => {
    event.preventDefault();
    console.info(`Clicked Tree : ${JSON.stringify(node)}`)
    let _type = "folder"
    if (node.children && node.children.length == 0) {
      _type = "file"
    }

    const payload = { name: node.name, id: node.id, type: _type }
    if (_type === "file") {
      console.info(`Request to add new tab : ${payload}`)
      // Add tab
      eventBus.emit(new EventTypeAddTab(payload));
    }
  }

  const renderTree = (nodes: RenderTree) => (
    <TreeItem key={nodes.id} nodeId={nodes.id} label={nodes.name} onLabelClick={(event) => nodeClicked(event, nodes)}>
      {Array.isArray(nodes.children)
        ? nodes.children.map((node) => renderTree(node))
        : null}
    </TreeItem>
  );

  const renderTreeTopLevel = (nodes: RenderTree[] | undefined) => (
    Array.isArray(nodes)
      ? nodes.map((node) => renderTree(node))
      : null
  );

  React.useEffect(() => {
    (async () => {
      const data = await http<RenderTree>('/api/v1/samples')
      setTreeDataState(data)
    })()
    return () => {
      console.log(`Unmounted`)
    }
  }, [])


  return (
    <TreeView
      className={classes.root}
      defaultCollapseIcon={<ExpandMoreIcon />}
      // defaultExpanded={["root"]}
      defaultExpandIcon={<ChevronRightIcon />}
    >
      {renderTreeTopLevel(treeData.children)}
    </TreeView>
  );
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`query-tabpanel-${index}`}
      aria-labelledby={`query-tab-${index}`}
      {...other}
    >
      {value === index && (
        <div>{children}</div>
      )}
    </div>
  );
}

function a11yProps(index: any) {
  return {
    id: `query-tab-${index}`,
    'aria-controls': `query-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    flexGrow: 1,
    width: '100%',
    height: '100%',
    backgroundColor: theme.palette.background.paper,
  },

  tab: {
    textTransform: 'none',
    minWidth: 80,
    fontWeight: theme.typography.fontWeightMedium,
    marginRight: theme.spacing(2),
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    '&:hover': {
      color: '#40a9ff',
      opacity: 1,
    },
    '&$selected': {
      color: '#1890ff',
      fontWeight: theme.typography.fontWeightBold,
    },
    '&:focus': {
      color: '#40a9ff',
    },
  },
}));


export default function FullWidthTabs() {
  const classes = useStyles();
  const theme = useTheme();
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  const preventDefault = (event: React.SyntheticEvent) => event.preventDefault();

  return (
    <div className={classes.root}>
      <AppBar position="static" color="default">
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          aria-label="Query samples"
        >
          <Tab label="My Queries" {...a11yProps(0)} className={classes.tab} />
          <Tab label="Samples" {...a11yProps(1)} className={classes.tab} />
        </Tabs>
      </AppBar>

      <TabPanel value={value} index={0}>
        <Link href="#" onClick={preventDefault}>Share</Link>
        <Link href="#" onClick={preventDefault}>Expand All</Link>
        <Link href="#" onClick={preventDefault}>Collapse All</Link>

        <Divider />
        <SideTreeView />
      </TabPanel>

      <TabPanel value={value} index={1}>
        <Link href="#" onClick={preventDefault}>Update</Link>
        <Divider />
        <SideTreeView />
      </TabPanel>
    </div>
  );
}


export {FullWidthTabs, SideTreeView}
