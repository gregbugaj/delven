import React, { useMemo } from 'react'
import Grid from '@material-ui/core/Grid';
import { CodeMirrorManager } from './CodeMirror'
import Button from '@material-ui/core/Button';
import BlurLinearIcon from '@material-ui/icons/BlurLinear';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import ConsoleDisplay, { ConsoleMessageLevel, ConsoleMessage } from './ConsoleDisplay'
import { EventTypeEditorKeyDown, EventTypeCompileReply, EventTypeEvaluateReply } from "../bus/message-bus-events";
import { ServerExecutor } from "../../executors";

import { GlobalHotKeys } from 'react-hotkeys';
import { configure } from 'react-hotkeys';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import { useEffect, useLayoutEffect } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import globalServices from '../globalServices';
import { useRef } from "react";
import { Box, createStyles, Typography } from '@material-ui/core';
import classNames from "classnames";
import TextAreaCodeEditor from './TextAreaCodeEditor';

import { v4 as uuidv4 } from 'uuid';

// keyboard shortcuts
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

// https://stackoverflow.com/questions/47659664/flexbox-with-fixed-header-and-footer-and-scrollable-content
export default function Editor(){
  return (
    // <div style={{ border: "0px solid purple", display: 'flex', height: '100%', width:'100%', flexDirection: 'column'}} >
    <div className='Editor-Container' >

    <div className='Editor-Container-Header'>
      <p>Header 1</p>
      <p>Header 2</p>
      <p>Header 3</p>
    </div>

    <div className='Editor-Content' >

      <p>xx</p>      <p>xx</p>      <p>xx</p>      <p>xx</p>      <p>xx</p>      <p>xx</p>
      <p>xx</p>      <p>xx</p>      <p>xx</p>      <p>xx</p>      <p>xx</p>      <p>xx</p>
      <p>xx</p>      <p>xx</p>      <p>xx</p>      <p>xx</p>      <p>xx</p>      <p>xx</p>
      <p>xx</p>      <p>xx</p>      <p>xx</p>      <p>xx</p>      <p>xx</p>      <p>xx</p>
      <p>xx</p>      <p>xx</p>      <p>xx</p>      <p>xx</p>      <p>xx</p>      <p>xx</p>
      <p>xx</p>      <p>xx</p>      <p>xx</p>      <p>xx</p>      <p>xx</p>      <p>xx</p>
      <p>xx</p>      <p>xx</p>      <p>xx</p>      <p>xx</p>      <p>xx</p>      <p>xx</p>

    </div>

    <div className='Editor-Container-Footer'>
      <p>Footer 1</p>
      <p>Footer 2</p>
      <p>Footer 3</p>
    </div>

   </div>
  )
}
// props:EditorProps
export function EditorXXX() {

  let ecmaEditor: CodeMirrorManager;

  let astEditor: CodeMirrorManager;

  let generatorEditor: CodeMirrorManager;

  let executor: ServerExecutor;

  let eventBus = globalServices.eventBus

  let props = defaultProps
  const classes = useStyles();
  const inputRef = useRef(null);
  const [value, setValue] = React.useState(0);

  executor = new ServerExecutor();

  // Similar to componentDidMount and componentDidUpdate
  // This function will onyl run once after DOM components have been layedout
  // https://reacttraining.com/blog/useEffect-is-not-the-new-componentDidMount/
  useLayoutEffect(() => {
    // host responsible for executing scripts
    const hostname = window.location.hostname
    const host = `ws://${hostname}:5000/ws` as string

    (async () => {
      let status = await executor.setup({ "uri": host })
      console.debug(`Executor ready : ${status}`);
    })()

    // hook up events

    // All the messages from executor will be pumped onto the Even Bus specific event
    // this converts from server side message event to client side EventBus message
    // compile.reply  evaluate.reply
    if(false){
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
            throw new Error(`Event not handled : ${stringify(msg)}`)
        }
        console.groupEnd();
      })
    }

    executor.on('compile.reply', msg => {
      console.info(`Received compile backend : ${stringify(msg)}`)
      const data = msg.data
      if (data.exception != undefined) {
        let exception = data.exception
        if (generatorEditor) {
          generatorEditor.setValue(stringify(data))
        }
      } else {
          log("success", "Compile reply")
          astEditor.setValue(stringify(data.ast))
          generatorEditor.setValue(data.generated)
      }
    })

  }, []);

  useEffect(() => {
    // const { user } = props;
    console.log("useEffect newValue--->", value);
  }, [value]);//run every time value changes


  const EcmaTextEditor = () => {
    const onEditorReady = (instance: CodeMirrorManager) => {
      console.info('onEditorReady ECMA** ')
      ecmaEditor = instance
    };

    return <TextAreaCodeEditor
      onEditorReady={onEditorReady}
      onKeyDown={onEditorKeyDown}
      name='editor-ecma'
      id='editor-ecma'
      focus={true}
      value="let x = 0 + 1" />
  }

  const AstTextEditor = () => {
    const onEditorReady = (instance: CodeMirrorManager) => {
      console.info('onEditorReady AST ** ')
      astEditor = instance
    };

    return <TextAreaCodeEditor
      onEditorReady={onEditorReady}
      onKeyDown={onEditorKeyDown}
      name='editor-ast'
      id='editor-ast'
      focus={false}
      value="AST Viewer" />
  }

  const GeneratorTextEditor = () => {
    const onEditorReady = (instance: CodeMirrorManager) => {
      console.info('onEditorReady Generator ** ')
      generatorEditor = instance
    };

    return <TextAreaCodeEditor
      onEditorReady={onEditorReady}
      onKeyDown={onEditorKeyDown}
      name='editor-generator'
      id='editor-generator'
      focus={false}
      value="// Generated" />
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
    generatorEditor = new CodeMirrorManager(jsonNode)

    generatorEditor.setValue('')
    astEditor.setValue('')

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

        if (generatorEditor) {
          generatorEditor.setValue(stringify(data))
        }
      } else {
        if (astEditor && generatorEditor) {
          log("success", "Compile reply")
          generatorEditor.setValue(stringify(data.ast))
          astEditor.setValue(data.generated)
        }
      }
    })

    executor.on('evaluate.reply', msg => {
      console.info(`Received evaluate backend : ${msg}`)
      let data = msg.data
      if (data.exception) {
        let exception = data.exception
        log("raw", exception.message)
        log("raw", exception.stack)
      } else if (data.stdout) {
        console.info(data.stdout)
        log("raw", "------------------------------------")
        let chunks = data.stdout.split('\r')
        log("raw", chunks)
        log("raw", "------------------------------------")
      }
    })

    // let status = await executor.setup({ "uri": host })
    // console.debug(`Executor ready : ${status}`);
  }

  function log(level: ConsoleMessageLevel, message: string | string[]) {
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
    console.info("Compiling script")
    log("success", "Compiling Script")
    if (ecmaEditor === undefined) {
      console.error("EMCA editor not available")
      return
    }

    const txt = ecmaEditor.getValue()
    const unit = { id: uuidv4(), code: txt }
    executor.emit('code:compile', unit)
  }

  async function evaluate() {
    log("success", "Evaluating Script")

    if (ecmaEditor === undefined) {
      console.error("EMCA editor not available")
      return
    }

    const txt = ecmaEditor.getValue()
    const unit = { id: uuidv4(), code: txt }
    executor.emit('code:evaluate', unit)
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

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    console.info(newValue)
    setValue(newValue)
  };

  const onEditorKeyDown = (instance: CodeMirror.Editor, event: KeyboardEvent) => {
    console.info('onEditorKeyDown')
    let cursor = instance.getCursor()
    // eventBus.emit(new EventTypeEditorKeyDown(cursor));
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

  // const  TabPanelXX = React.memo((props:TabPanelProps)=>{
  //   console.info(props)
  //   return TabPanelInner(props)
  // });

  const getVisibilityStyle = (hiddenCondition: boolean): any => {
    if (hiddenCondition) {
      return {
        visibility: 'hidden',
        height: 0,
      };
    }
    return {
      visibility: 'visible',
      height: 'inherit',
      border: "1px solid purple"
    };
  };

  const TabPanel = React.memo((props: TabPanelProps) => {
    const { children, value, index, ...other } = props;
    return (
      <div
        role="tabpanel"
        id={`query-tabpanel-${index}`}
        aria-labelledby={`query-tab-${index}`}
        style={{
          overflowY: 'auto',
          padding: "0px", border: "0px solid purple", height: '100%', width: '100%', flexDirection: 'column'
        }}
        {...other}
      >
        {(
          <div style={{ padding: "0px", border: "0px solid purple", height: '100%', width: '100%', flexDirection: 'column' }}>
            {children}
          </div>
        )}
      </div>
    );
  });

  return (

    <div style={{ padding: "0px", border: "0px solid purple", display: 'flex', height: '100%', width:'100%', flexDirection: 'column', flex: '1'}} >

      <div >
        <p>Header 1</p>
        <p>Header 2</p>
        <p>Header 3</p>
      </div>

      <div style={{ height: '100%', width:'100%'}} >
        {/* // Full height */}
        <div style={{ padding: "0px", border: "0px solid purple", display: 'flex', height: '100%', width:'100%' }} >
          {/*
            it is important that this container has the 'height' set to get the scrolling working
          // Split horizontally with full height
          */}
          <div style={{ padding: "0px", border: "1px solid blue", display: 'flex', flex: '1 auto', height: '100%'}}>

            {/* LHS Panel */}
            <div style={{ flex: '1 0 0%', border: "1px solid purple", backgroundColor: '#CCC', overflowY: 'auto' }}>
              <EcmaTextEditor />
            </div>

            {/* RHS Panel */}
            <div style={{ padding: "0px", border: "1px solid blue", display: 'flex', flex: '1 auto', height: '100%'}}>

              <div style={{ flex: '1 0 0%', border: "1px solid purple", backgroundColor: '#CCC', overflowY: 'auto' }}>
                <AstTextEditor />
              </div>

            </div>

          </div>
        </div>
      </div>

      <div>

          <p>footer</p>
      </div>

    </div>
  )
}


/*

return (


  <div style={{ padding: "0px", border: "0px solid purple", display: 'flex', height: '100%', width: '100%', flexDirection: 'column' }} >

    <div style={{ padding: "0px", border: "0px solid purple", display: 'flex', height: '100%', width: '100%', flexDirection: 'column' }} >

      <div style={{padding: "0px", border: "2px solid blue", display: 'flex', flex: '1 1 auto'}}>
          <div style={{ flex: ' 1 0 0%', border: "2px solid purple" }}>
            <EcmaTextEditor />
          </div>

           <div style={{ flex: ' 1 0 0%', border: "2px solid red" }}>
            <div style={{ padding: "0px", border: "0px solid purple", height: '100%', width: '100%', flexDirection: 'column' }}>
               <AstTextEditor />
            </div>

              <div style={getVisibilityStyle(value != 1)}>
                <GeneratorTextEditor />
              </div>

              <div style={getVisibilityStyle(value != 2)}>
                <ConsoleDisplay ref={inputRef} />
              </div>

              <div style={getVisibilityStyle(value != 3)}>
                Job Graph / Query Optimizer
                </div>

              <div style={getVisibilityStyle(value != 4)}>
                Results
                </div>
         </div>

      </div>
    </div>
  </div>
)
*/

{/*


    <GlobalHotKeys keyMap={keyMap} handlers={handlers} />
      <Grid container style={{ padding: "4px", border: "2px solid purple", backgroundColor: '#f7f7f7' }}>
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
              <Tab label="JSON-AST" {...a11TabProps(0)} className={classes.tab}></Tab>
              <Tab label="Compiled" {...a11TabProps(1)} className={classes.tab}></Tab>
              <Tab label="Console" {...a11TabProps(2)} className={classes.tab}></Tab>
              <Tab label="Results" {...a11TabProps(3)} className={classes.tab}></Tab>
              <Tab label="Graph" {...a11TabProps(4)} className={classes.tab}></Tab>
            </Tabs>

          </Grid>
        </Grid>



*/}



{/*
          <div style={{ flex: ' 1 1 0%', border: "0px solid purple", overflowY: 'auto' }}>
            <div style={{ display: 'flex', height: '100%', width: '100%', flexDirection: 'column' }} >

              <div style={{ flex: ' 1 0 50%', border: "0px solid purple", overflowY: 'auto' }}>
                <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>


                </div>
              </div>

            </div>
          </div>
*/}






export  function EditorXXXXX(){


  return (
    <div style={{ border: "0px solid purple", display: 'flex', height: '100%', width:'100%', flexDirection: 'column'}} >

    <div >
      <p>Header 1</p>
      <p>Header 2</p>
      <p>Header 3</p>
    </div>

    <div style={{ padding: "0px", border: "0px solid purple", height: '100%', width:'100%', flex:'1'}} >
      {/*
        it is important that this container has the 'height' set to get the scrolling working
      // Split horizontally with full height
      */}
        <div style={{ padding: "0px", border: "1px solid red", display: 'flex', flex: '1 auto', height: '100%'}}>
          <div style={{ flex: '1 0 0%', border: "1px solid purple", backgroundColor:'#CCC', overflowY:'auto'}}>
            <p>test</p>
            <p>test</p>
            <p>test</p>
            <p>test</p>
            <p>test</p>
            <p>test</p>
            <p>test</p>
            <p>test</p>
            <p>test</p>
            <p>test</p>
            <p>test</p>
            <p>test</p>
            <p>test</p>
            <p>test</p>
            <p>test</p>
            <p>test</p>
            <p>test</p>
            <p>test</p>
            <p>test</p>
            <p>test</p>
            <p>test</p>
            <p>test</p>
            <p>test</p>
            <p>test</p>
            <p>test</p>
            <p>test</p>
            <p>test</p>
            <p>test</p>
            <p>test</p>
            <p>test</p>
            <p>test</p>
            <p>test</p>
            <p>test</p>
            <p>test</p>
            <p>test</p>
            <p>test</p>
            <p>test</p>
            <p>test</p>
            <p>test</p>
            <p>test</p>
            <p>test</p>
            <p>test</p>
            <p>test</p>
            <p>test</p>
            <p>test</p>
            <p>test</p>
            <p>test</p>
            <p>test</p>
        </div>

        <div style={{ padding: "0px", border: "1px solid red", display: 'flex', flex: '1 auto', height: '100%'}}>
          <div style={{ flex: '1 0 0%', border: "1px solid purple", backgroundColor:'#CCC', overflowY:'auto'}}>

            <p>test</p>
            <p>test</p>
            <p>test</p>
            <p>test</p>
            <p>test</p>
            <p>test</p>
            <p>test</p>
            <p>test</p>
            <p>test</p>
            <p>test</p>
            <p>test</p>
            <p>test</p>
            <p>test</p>
            <p>test</p>
            <p>test</p>
            <p>test</p>

            <p>test</p>
            <p>test</p>
            <p>test</p>
            <p>test</p>
            <p>test</p>
            <p>test</p>
            <p>test</p>
            <p>test</p>
            <p>test</p>
            <p>test</p>
            <p>test</p>
            <p>test</p>
            <p>test</p>
            <p>test</p>
            <p>test</p>
            <p>test</p>

            <p>test</p>
            <p>test</p>
            <p>test</p>
            <p>test</p>
            <p>test</p>
            <p>test</p>
            <p>test</p>
            <p>test</p>
            <p>test</p>
            <p>test</p>
            <p>test</p>
            <p>test</p>
            <p>test</p>
            <p>test</p>
            <p>test</p>
            <p>test</p>

            <p>test</p>
            <p>test</p>
            <p>test</p>
            <p>test</p>
            <p>test</p>
            <p>test</p>
            <p>test</p>
            <p>test</p>
            <p>test</p>
            <p>test</p>
            <p>test</p>
            <p>test</p>
            <p>test</p>
            <p>test</p>
            <p>test</p>
            <p>test</p>


           </div>
        </div>

       </div>
      </div>
    </div>
  )
}
