import React, { useMemo } from 'react'
import Grid from '@material-ui/core/Grid';
import { CodeMirrorManager } from './CodeMirror'
import Button from '@material-ui/core/Button';
import BlurLinearIcon from '@material-ui/icons/BlurLinear';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import ConsoleDisplay, { ConsoleMessageLevel, ConsoleMessage } from './ConsoleDisplay'
import { EventTypeCompileReply, EventTypeEvaluateReply } from "../bus/message-bus-events";
import { ServerExecutor } from "../../executors";

import { GlobalHotKeys } from 'react-hotkeys';
import { configure } from 'react-hotkeys';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import { useEffect, useLayoutEffect } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import globalServices from '../globalServices';
import { useRef } from "react";
import { createStyles, Typography } from '@material-ui/core';
import classNames from "classnames";

configure({
  ignoreTags: ['input', 'select', 'textarea'],
  ignoreEventsCondition: () => { return false }
});


// https://reactsvgicons.com/search?q=arrow
const BxsRightArrowIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
    >
      <path d="M5.536 21.886a1.004 1.004 0 001.033-.064l13-9a1 1 0 000-1.644l-13-9A1 1 0 005 3v18a1 1 0 00.536.886z" />
    </svg>
  );
}


const stringify = (obj: unknown): string => JSON.stringify(obj, function replacer(key, value) { return value }, 4);
// class Editor extends React.Component<EditorProps, IState> {
interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
  label: string;
}

const tabHeight = '48px' // default: '48px'
const useStyles = makeStyles((theme: Theme) => ({
  root: {
    flexGrow: 1,
    width: '100%',
    height: '100%',
    backgroundColor: theme.palette.background.paper,
  },

  tab: {

    minHeight: tabHeight,
    height: tabHeight,
    textTransform: 'none',
    minWidth: 120,
    fontWeight: theme.typography.fontWeightMedium,
    marginRight: theme.spacing(2),
    fontFamily: [
      '"Source Code Pro"',
      'monospace'
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


let defaultProps = {
  ecmaName: 'editor-ecma',
  ecmaValue: 'let x = 1',
  ecmaAutoFocus: true,
  astName: 'editor-ast',
  astValue: 'let x = 1',
  astAutoFocus: true,
  jsonName: 'editor-json',
}

// props:EditorProps
export default function Editor() {

  let ecmaEditor: CodeMirrorManager;

  let astEditor: CodeMirrorManager;

  let jsonEditor: CodeMirrorManager;

  let executor: ServerExecutor;

  let state = {
    display: 'compiled',
  }

  let props = defaultProps
  const classes = useStyles();
  const inputRef = useRef(null);
  const [value, setValue] = React.useState(0);

  //  handleViewChange  = handleViewChange.bind(this)
  //  compile = compile.bind(this)
  //  evaluate = evaluate.bind(this)
  executor = new ServerExecutor();

  function observeEditorChange(targetNode: HTMLElement) {

    console.info(targetNode)
    let e1 = jsonEditor
    let e2 = astEditor
    let observer = new MutationObserver(function (mutations) {

      console.info(mutations)
      if (targetNode?.style.display != 'none') {
        if (targetNode.id == 'json-container')
          e1?.refresh()
        else if (targetNode.id == 'json-container')
          e2?.refresh()
      }
    });

    observer.observe(targetNode, { attributes: true, childList: true });
  }
  // Similar to componentDidMount and componentDidUpdate
  // https://reacttraining.com/blog/useEffect-is-not-the-new-componentDidMount/
  useLayoutEffect(() => {
    setTimeout(() => {

      // componentDidMount();

    }, 10);
  }, []);

  useEffect(() => {
    // const { user } = props;
    console.log("useEffect newValue--->", value);
  }, [value]);//run every time value changes


  interface TextAreaCodeEditorProps {
    name: string;
    id: string;
    value:string;
    focus:boolean;
  }

  function TextAreaCodeEditor(props: TextAreaCodeEditorProps) {
    const { name, value, id, focus, ...other } = props;
    let ref = React.createRef<HTMLTextAreaElement>();
    let editor: CodeMirrorManager
    useLayoutEffect(() => {
      console.info('Textaread Editor init')
      console.info(ref.current)
      if (ref.current == null) {
        return
      }

      editor = new CodeMirrorManager(ref.current)
    }, [])

    return (
      <div>
        <textarea
          ref={ref}
          name={name}
          id={id}
          defaultValue={value}
          autoComplete="off"
          autoFocus={focus}
        />
      </div>
    )
  }

  function componentDidMount() {
    console.info("componentDidMount")

    let ecmaNode: HTMLTextAreaElement = document.getElementById(props.ecmaName) as HTMLTextAreaElement;
    let astNode: HTMLTextAreaElement = document.getElementById(props.astName) as HTMLTextAreaElement;
    let jsonNode: HTMLTextAreaElement = document.getElementById(props.jsonName) as HTMLTextAreaElement;

    console.info(ecmaNode)
    console.info(astNode)
    console.info(jsonNode)

    // nodes will be null if they are set with 'display:none' as initial state
    // https://stackoverflow.com/questions/38093760/how-to-access-a-dom-element-in-react-what-is-the-equilvalent-of-document-getele

    // var $this = ReactDOM.findDOMNode(this)
    ecmaEditor = new CodeMirrorManager(ecmaNode)
    astEditor = new CodeMirrorManager(astNode)
    jsonEditor = new CodeMirrorManager(jsonNode)

    jsonEditor.setValue('')
    astEditor.setValue('')

    observeEditorChange(document.getElementById('json-container') as HTMLElement)
    observeEditorChange(document.getElementById('compiled-container') as HTMLElement)

    // get message bus
    let eventBus = globalServices.eventBus

    // eventBus.on(
    //   EventTypeSampleQuery,
    //   (event): void => {
    //     let id = event.data.id
    //       ; (async () => {
    //         const reply = await http<ServiceReplyEventType>(`/api/v1/samples/${id}`);
    //         if (reply.status === 'error') {
    //           alert(reply.msg)
    //         } else if (reply.status === 'ok') {
    //           editor.setValue(reply.data);
    //         }
    //       }
    //       )()
    //   }
    // )

    const hostname = window.location.hostname

    // All the messages from executor will be pumped onto the Even Bus specific event
    // this converts from server side message event to client side EventBus message
    // compile.reply  evaluate.reply
    executor.on("*", msg => {
      console.group(`Received from backend`)
      console.info(msg)

      switch (msg.type) {
        case "compile.reply":
          eventBus.emit(new EventTypeCompileReply(msg.data));
          break;
        case "evaluate.reply":
          eventBus.emit(new EventTypeEvaluateReply(msg.data));
          break;
        default:
          throw new Error("Event not handled : " + msg)
      }

      console.groupEnd();
    })

    executor.on('compile.reply', msg => {
      console.info(`Received compile backend : ${stringify(msg)}`)
      const data = msg.data
      if (data.exception != undefined) {
        let exception = data.exception

        if (jsonEditor) {
          jsonEditor.setValue(stringify(data))
        }
      } else {
        if (astEditor && jsonEditor) {

          log()
          jsonEditor.setValue(stringify(data.ast))
          astEditor.setValue(data.generated)
        }
      }
    })

    executor.on('evaluate.reply', msg => {
      console.info(`Received evaluate backend : ${msg}`)
      let data = msg.data
      if (data.exception) {
        let exception = data.exception
        log()
        log()
      } else if (data.stdout) {
        console.info(data.stdout)
        log()
        let chunks = data.stdout.split('\r')
        log()
        log()
      }
    })

    // let status = await executor.setup({ "uri": host })
    // console.debug(`Executor ready : ${status}`);
  }


  function log() {
    // const consoleDisplay = refs.child as ConsoleDisplay
    // const combined: ConsoleMessage[] = []

    // if (consoleDisplay) {
    //   if (message instanceof Array) {
    //     for (let chunk of message) {
    //       combined.push(_log(level, chunk))
    //     }
    //   } else {
    //     combined.push(_log(level, message))
    //   }
    //   consoleDisplay.append(combined)
    // }
  }

  async function compile() {
    log()
    if (ecmaEditor) {
      const txt = ecmaEditor.getValue()
      executor.emit('code:compile', txt)
    }
  }

  async function evaluate() {
    log()
    if (ecmaEditor) {
      const txt = ecmaEditor.getValue()
      executor.emit('code:evaluate', txt)
    }
  }


  const handlers = {
    COMPILE: compile,
    EVALUATE: evaluate,
  };

  const keyMap = {
    COMPILE: ['command+enter', 'ctrl+enter'],
    EVALUATE: "ctrl+alt+enter", // Issues with
  };


  function a11TabProps(index: any) {
    return {
      id: `result-tab-${index}`,
      'aria-controls': `result-tabpanel-${index}`,
    };
  }

  let messages: ConsoleMessage[] = []

  const [] = React.useState(0);

  const [showPanelConsole, toggleShowPanelConsole] = React.useState(false);
  const [showPanelJson, toggleShowPanelJson] = React.useState(false);


  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    console.info(newValue)
    if (newValue == 0) {
      state.display = 'json'
      toggleShowPanelJson(true)
      toggleShowPanelConsole(false)
      // jsonEditor.refresh()
    }

    else if (newValue == 1)
      state.display = 'compiled'
    else if (newValue == 2) {
      state.display = 'console'
      toggleShowPanelJson(false)
      toggleShowPanelConsole(true)
      // ecmaEditor.refresh()
    }

    setValue(newValue);
    // setSelectedTab(newValue);

    console.info("state.display : " + state.display)
  };

  const useTabContainerStyles = makeStyles(() => createStyles({
    root: {
      padding: 8 * 3
    },
    tabcontainerInActive: {
      display: "none"
    }
  })
  );


  function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`query-tabpanel-${index}`}
        aria-labelledby={`query-tab-${index}`}
        style={{
          overflowY: 'auto',
          padding: "0px", border: "0px solid purple", height: '100%', width: '100%', flexDirection: 'column'
        }}
        {...other}
      >
        {value === index && (
          <div style={{ padding: "0px", border: "0px solid purple", height: '100%', width: '100%', flexDirection: 'column' }}>

            {children}
          </div>
        )}
      </div>
    );
  }



  return (
    <React.StrictMode>
      <GlobalHotKeys keyMap={keyMap} handlers={handlers} />

      <div style={{ padding: "0px", border: "0px solid purple", display: 'flex', height: '100%', width: '100%', flexDirection: 'column' }} >
        <Grid container style={{ padding: "4px", border: "0px solid purple", backgroundColor: '#f7f7f7' }}>
          <Grid item sm={12} md={6}>
            <Grid container justify="space-between" style={{ padding: "0px", border: "0px solid green" }} >

              <Grid item>
                <Button size="medium" variant="contained" color="primary" style={{ minWidth: 120, marginRight: '20px' }}
                  endIcon={< BlurLinearIcon fontSize="large" />}
                  onClick={compile}>Compile</Button>

                <Button size="medium" variant="contained" color="secondary" style={{ minWidth: 120 }}
                  endIcon={
                    <BxsRightArrowIcon />
                  }
                  onClick={evaluate}>Run</Button>
              </Grid>

              <Grid item>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="checkedB"
                      color="primary"
                    />
                  }
                  label="Query optimizer"
                />

                <FormControlLabel
                  control={
                    <Checkbox
                      name="checkedB"
                      color="primary"
                    />
                  }
                  label="Mock provider"
                />
              </Grid>
            </Grid>

          </Grid>
          <Grid item sm={12} md={6}>
            <Tabs
              value={value}
              onChange={handleChange}
              indicatorColor="primary"
              textColor="primary"
              variant="scrollable"
              scrollButtons="auto"
              aria-label="Query samples"
              style={{ padding: "0px", border: "0px solid green", display: 'flex', width: '100%', flexDirection: 'column' }}
              TabIndicatorProps={{
                style: {
                  height: "4px",
                }
              }}
            >
              <Tab label="JSON-AST" {...a11TabProps(0)} className={classes.tab} ></Tab>
              <Tab label="Compiled" {...a11TabProps(1)} className={classes.tab}  ></Tab>
              <Tab label="Console" {...a11TabProps(2)} className={classes.tab} ></Tab>
              <Tab label="Results" {...a11TabProps(3)} className={classes.tab}  ></Tab>
              <Tab label="Graph" {...a11TabProps(4)} className={classes.tab} ></Tab>
            </Tabs>

            {/* <TabContainer id={0} active={selectedTab === 0} >
              Item One
             </TabContainer>
            <TabContainer id={1} active={selectedTab === 1}>
              Item Two
                </TabContainer>
            <TabContainer id={2} active={selectedTab === 2}>
              Item Three
            </TabContainer>

            <TabContainer id={3} active={selectedTab === 3}>
              Item Four
            </TabContainer>

            <TabContainer id={4} active={selectedTab === 4}>
              Item Five
            </TabContainer> */}

            {/* <ToggleButtonGroup size="small" exclusive onChange={handleViewChange} value={state.display} aria-label="text primary button group">
                <ToggleButton size="small" value="json">JSON - AST</ToggleButton>
                <ToggleButton size="small" value="compiled">Compiled</ToggleButton>
                <ToggleButton size="small" value="console">Console</ToggleButton>
                <ToggleButton size="small" value="results">Results</ToggleButton>
                <ToggleButton size="small" value="graph">Job Graph</ToggleButton>
              </ToggleButtonGroup > */}

          </Grid>
        </Grid>

        <div style={{ display: 'flex', flex: '1 1 auto', overflowY: 'auto' }}>
          <div style={{ flex: ' 1 0 0%', border: "0px solid purple" }}>
            <textarea
              name={props.ecmaName}
              id={props.ecmaName}
              defaultValue={props.ecmaValue}
              autoComplete="off"
              autoFocus={props.ecmaAutoFocus}
            />
          </div>

          <div style={{ flex: ' 1 1 0%', border: "0px solid purple", overflowY: 'auto' }}>
            <div style={{ display: 'flex', height: '100%', width: '100%', flexDirection: 'column' }} >
              <div style={{ flex: ' 1 0 50%', border: "0px solid purple", overflowY: 'auto' }}>
                <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>


                  <TabPanel value={value} index={0} label={'JSON'}>
                    <TextAreaCodeEditor name='json' id='r-json' focus={true} value="let x = 'json' "></TextAreaCodeEditor>
                  </TabPanel>
                  <TabPanel value={value} index={1} label={'Script x'}>
                    <TextAreaCodeEditor name='json' id='r-json' focus={true} value="let x = 'Compiled' "></TextAreaCodeEditor>
                  </TabPanel>
                  <TabPanel value={value} index={2} label={'Script x'}>
                    <TextAreaCodeEditor name='json' id='r-json' focus={true} value="let x = 'Console' "></TextAreaCodeEditor>
                  </TabPanel>
                  <TabPanel value={value} index={3} label={'Script x'}>
                    <TextAreaCodeEditor name='json' id='r-json' focus={true} value="let x = 'Results' "></TextAreaCodeEditor>
                  </TabPanel>
                  <TabPanel value={value} index={4} label={'Script x'}>
                    <TextAreaCodeEditor name='json' id='r-json' focus={true} value="let x = 'Graph' "></TextAreaCodeEditor>
                  </TabPanel>


                  <div id='compiled-container' style={{ display: state.display == 'compiled' ? "flex" : "none", flexDirection: 'column', height: '100%' }}>
                    <textarea
                      name={props.astName}
                      id={props.astName}
                      defaultValue={props.astValue}
                      autoComplete="off"
                      autoFocus={props.astAutoFocus}
                    />
                  </div>

                  <div id='console-container' style={{ display: state.display == 'console' ? "flex" : "none", flexDirection: 'column', height: '100%' }}>
                    <ConsoleDisplay messages={messages} ref={inputRef} />
                  </div>

                  <div id='graph-container' style={{ display: state.display == 'graph' ? "flex" : "none", flexDirection: 'column', height: '100%' }}>
                    Job Graph / Query Optimizer
                    </div>
                  <div id='results' style={{ display: state.display == 'results' ? "flex" : "none", flexDirection: 'column', height: '100%' }}>
                    Job Graph / Query Optimizer
                    </div>

                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </React.StrictMode>
  )
}

// export default Editor;
