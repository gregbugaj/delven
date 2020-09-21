import React from 'react';
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


import { EventTypes } from "../bus/message-bus-events";
import { EventTypeSampleQuery  } from "../bus/message-bus-events";
import { MessageBusGroup } from "../bus/message-bus";
import { MessageBusService } from "../bus/message-bus";
import "../globalServices"

interface RenderTree {
    id: string;
    name: string;
    children?: RenderTree[];
}

const data: RenderTree = {
    id: "root",
    name: "Parent",
    children: [
        {
            id: "1",
            name: "Child - 1"
        },
        {
            id: "3",
            name: "Child - 3",
            children: [
                {
                    id: "4",
                    name: "Child - 4"
                }
            ]
        }
    ]
};

function RecursiveTreeView() {
    const classes = useStyles();
    const [val, setStateVal] = React.useState("");
    const eventBus = globalThis.services.eventBus;

    const nodeClicked = (event: React.SyntheticEvent, node: RenderTree) => {
        event.preventDefault();
        console.info('Clicked node')
        eventBus.emit(new EventTypeSampleQuery({ name: node.name, id : node.id }));
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

    return (
        <TreeView
            className={classes.root}
            defaultCollapseIcon={<ExpandMoreIcon />}
            // defaultExpanded={["root"]}
            defaultExpandIcon={<ChevronRightIcon />}
        >
            {renderTreeTopLevel(data.children)}
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
                <Box p={1}>
                    <Typography>{children}</Typography>
                </Box>
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

    const handleChangeIndex = (index: number) => {
        setValue(index);
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
                <Divider />
                <RecursiveTreeView />
            </TabPanel>

            <TabPanel value={value} index={1}>
                <Link href="#" onClick={preventDefault}>Update</Link>
                <Divider />
                <RecursiveTreeView />
            </TabPanel>
        </div>
    );
}
