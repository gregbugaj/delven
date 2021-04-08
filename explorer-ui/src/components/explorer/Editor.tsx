import React, { useMemo } from 'react'
import Grid from '@material-ui/core/Grid';
import { CodeMirrorManager } from './CodeMirror'
import Button from '@material-ui/core/Button';
import BlurLinearIcon from '@material-ui/icons/BlurLinear';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import ConsoleDisplay, { ConsoleMessageLevel, ConsoleMessage } from './ConsoleDisplay'
import { EventTypeEditorKeyDown, EventTypeCompileReply, EventTypeEvaluateReply, EventTypeSampleQuery } from "../bus/message-bus-events";
import { ServerExecutor } from "../../executors";

import { GlobalHotKeys } from 'react-hotkeys';
import { configure } from 'react-hotkeys';

import { useEffect, useLayoutEffect } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import globalServices from '../globalServices';
import { useRef } from "react";
import classNames from "classnames";
import TextAreaCodeEditor from './TextAreaCodeEditor';

import { v4 as uuidv4 } from 'uuid';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';
import { http } from '../../http';
import ResizibleDivider from './ResizibleDivider';
import { IconButton } from '@material-ui/core';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';

// https://stackoverflow.com/questions/47659664/flexbox-with-fixed-header-and-footer-and-scrollable-content


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
interface EditorProps {
  id: string
  onLoadComplete: () => void
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


type ServiceReplyEventType = {
  status: string,
  msg?: string
  data?: any
}
interface EditorSet {
  ecma: CodeMirrorManager | undefined,
  ast: CodeMirrorManager | undefined,
  generator: CodeMirrorManager | undefined
}

const executor = new ServerExecutor();
const editorSets = new Map<String, EditorSet>();

// props:EditorProps
function EditorImpl(props: EditorProps) {
  console.info("------------- EDITOR -----------------")
  console.info(props)

  const jsonContainerRef = React.createRef<HTMLDivElement>();
  const compiledContainerRef = React.createRef<HTMLDivElement>();

  const { id, onLoadComplete, ...other } = props
  const eventBus = globalServices.eventBus

  const classes = useStyles();
  const inputRef = useRef(null);
  const [value, setValue] = React.useState(0);
  const [compileInProgress, setCompileInProgress] = React.useState(false);

  let ecmaEditor: CodeMirrorManager;
  let astEditor: CodeMirrorManager;
  let generatorEditor: CodeMirrorManager;

  if (editorSets.has(id)) {
    const editorSet = editorSets.get(id)
    if (editorSet) {

      if (editorSet.ecma) {
        ecmaEditor = editorSet.ecma
      } else {
        throw new Error("ECMA editor not defined for : " + id)
      }

      if (editorSet.ast) {
        astEditor = editorSet.ast
      } else {
        throw new Error("AST editor not defined for : " + id)
      }

      if (editorSet.generator) {
        generatorEditor = editorSet.generator
      } else {
        throw new Error("GENERATOR editor not defined for : " + id)
      }
    }
  } else {
    console.info("Adding empty editorset : " + id)
    editorSets.set(id, { ecma: undefined, ast: undefined, generator: undefined })
  }

  const setEcmaEditor = (cm: CodeMirrorManager) => {
    const editorSet = editorSets.get(id)
    if (editorSet) {
      editorSet.ecma = ecmaEditor = cm
    }
  }

  const setAstEditor = (cm: CodeMirrorManager) => {
    const editorSet = editorSets.get(id)
    if (editorSet) {
      editorSet.ast = astEditor = cm
    }
  }

  const setGeneratorEditor = (cm: CodeMirrorManager) => {
    const editorSet = editorSets.get(id)
    if (editorSet) {
      editorSet.generator = generatorEditor = cm
    }
  }

  const observeNodeChange = (targetNode: HTMLElement | null, observer: (args: MutationRecord[]) => void) => {
    if (targetNode === null) {
      console.warn('Observable node is null')
      return
    }
    const observable = new MutationObserver(mutations => observer(mutations));
    observable.observe(targetNode, { attributes: true, childList: true });
  }


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
    let editor = ecmaEditor
    let tabId = id
    eventBus.on(
      EventTypeSampleQuery,
      (event): void => {
        const activeId = globalServices.state.activeTabId
        if (tabId !== activeId) {
          return
        }

        if (event.data.type !== "file") {
          return;
        }
        let id = event.data.id
          ; (async () => {
            const reply = await http<ServiceReplyEventType>(`/api/v1/samples/${id}`);
            if (reply.status === 'error') {
              alert(reply.msg)
            } else if (reply.status === 'ok') {
              editor.setValue(reply.data);
            }
          }
          )()
      }
    )

    // All the messages from executor for this ID will be pumped onto the Even Bus specific event
    // this converts from server side message event to client side EventBus message
    // compile.reply  evaluate.reply
    executor.on(id, "*", msg => {
      // console.info(`Received from backend : ${stringify(msg)}`)
      switch (msg.type) {
        case "compile.reply":
          eventBus.emit(new EventTypeCompileReply(msg.data));
          break;
        case "evaluate.reply":
          eventBus.emit(new EventTypeEvaluateReply(msg.data));
          break;

        case null:
        case undefined: {
          console.warn(`Event without type(log only) : ${stringify(msg)}`)
          break
        }
        default:
          throw new Error(`Event not handled : ${stringify(msg)}`)
      }
    })

    executor.on(id, 'compile.reply', msg => {
      // console.info(`Received compile backend ${id} : ${stringify(msg)}`)
      try {
        const data = msg.data
        if (data.exception != undefined) {
          let exception = data.exception
          if (generatorEditor) {
            generatorEditor.setValue(stringify(data))
          }
        } else {
          log("success", "Compile reply")
          if (astEditor !== undefined) {
            astEditor.setValue(stringify(data.ast))
          } else {
            console.warn("AST Editor is undefined")
          }

          if (generatorEditor !== undefined) {
            generatorEditor.setValue(data.generated)
          } else {
            console.warn("Generator Editor is undefined")
          }
        }
      } finally {
        setCompileInProgress(false)

      }
    })

    // CodeMirror does not update properly so we are forcing refresh after the layout has been udpated
    observeNodeChange(jsonContainerRef.current, mutations => astEditor.refresh())
    observeNodeChange(compiledContainerRef.current, mutations => generatorEditor.refresh())

    // At this editor is ready and should be visible and ready to receive events
    onLoadComplete()
  }, []);


  useEffect(() => {
    // const { user } = props;
    console.log("useEffect newValue--->", value);
  }, [value]);//run every time value changes


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

    if (compileInProgress) {
      console.warn('Compilation already in progress')
      return
    }

    setCompileInProgress(true)

    const txt = ecmaEditor.getValue()
    const unit = { id: uuidv4(), code: txt }
    console.info('Compilation Unit')
    console.info(unit)
    executor.emit(id, 'code:compile', unit)
  }

  async function evaluate() {
    log("success", "Evaluating Script")
    if (ecmaEditor === undefined) {
      console.error("EMCA editor not available")
      return
    }

    const txt = ecmaEditor.getValue()
    const unit = { id: uuidv4(), code: txt }
    executor.emit(id, 'code:evaluate', unit)
  }

  const handlers = {
    COMPILE: compile,
    EVALUATE: evaluate,
  };

  const keyMap = {
    COMPILE: ['command+enter', 'ctrl+enter'],
    EVALUATE: "ctrl+alt+enter", // Issues with
  };

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

  // This is the prop children are interested in
  const [clicks, setClicks] = React.useState(0);
  const [ticks, setTicks] = React.useState(0);
  const [renderType, setRenderType] = React.useState('compiled');

  // setTimeout(() => setTicks(ticks + 1), 1500);
  const tickRef = React.useRef<{ ticks: number, value: number }>();

  tickRef.current = {
    ticks: ticks,
    value: value
  }


  function handleViewChange(event: any, renderType: string) {
    if (renderType == null)
      return
    setRenderType(renderType)
  }

  const onEditorReadyEcma = (cme: CodeMirrorManager) => setEcmaEditor(cme);
  const onEditorReadyAst = (cme: CodeMirrorManager) => setAstEditor(cme);
  const onEditorReadyCompiled = (cme: CodeMirrorManager) => setGeneratorEditor(cme);


  return (
    <div className='Editor-Container'>
      <div className='Editor-Container-Header'>

        <GlobalHotKeys keyMap={keyMap} handlers={handlers} />
        <Grid container style={{ padding: "0px", border: "0px solid purple", backgroundColor: '#f7f7f7' }}>
          <Grid item sm={12} md={6}>
            <Grid container justify="space-between" style={{ padding: "0px", border: "0px solid green" }} >
              <Grid item>
{/*
                <Button disabled={compileInProgress} size="medium" variant="contained" color="primary" style={{ minWidth: 140, marginRight: '20px' }}
                  endIcon={< BlurLinearIcon fontSize="large" />}
                  onClick={compile}>{compileInProgress ? '' : 'Compile'}</Button>

                <Button size="medium" variant="contained" color="secondary" style={{ minWidth: 120 }}
                  endIcon={
                    <BxsRightArrowIcon />
                  }
                  onClick={evaluate}>Run</Button>

                   */}

                <Button disabled={compileInProgress} size="small" color="primary" style={{ minWidth: 60, marginRight: '20px' }}
                  endIcon={< BlurLinearIcon fontSize="small" />}
                  onClick={compile}>{compileInProgress ? '' : ''}</Button>

                <Button size="small" color="secondary" style={{ minWidth: 60 }}
                  endIcon={
                    <BxsRightArrowIcon />
                  }
                  onClick={evaluate}></Button>
              </Grid>

            </Grid>

          </Grid>
          <Grid item sm={12} md={6}>

            <ToggleButtonGroup style={{ border:'0px solid red', height:'24px'}} size="small" exclusive onChange={handleViewChange} value={renderType} aria-label="text primary button group" className='btn-group special'>
              <ToggleButton className='btn btn-default' size="small" value="json">AST</ToggleButton>
              <ToggleButton className='btn btn-default' size="small" value="compiled">Compiled</ToggleButton>
              <ToggleButton className='btn btn-default' size="small" value="console">Console</ToggleButton>
              <ToggleButton className='btn btn-default' size="small" value="results">Results</ToggleButton>
              <ToggleButton className='btn btn-default' size="small" value="graph">Query Optimizer</ToggleButton>
            </ToggleButtonGroup>

          </Grid>
        </Grid>
      </div>

      {/* Samples  */}

      {/*
      <div style={{display: "flex", width:'800px', height:'100px', border: "2px solid blue" }}>
        <div style={{ display:"flex", width:"50%"}}>Left</div>
          <ResizibleDivider direction="horizontal"/>
        <div style={{display:"flex", flex: "1 1 0%", border: "2px solid pink" }}>Right</div>
      </div> */}

      {/* <div style={{display: "flex", flexDirection:"column", width:'800px', height:'100px', border: "2px solid green" }}>
        <div style={{ display:"flex"}}>TOP</div>
          <ResizibleDivider direction="vertical"/>
        <div style={{display:"flex", flex: "1 1 0%", height:'40px', border: "2px solid pink" }}>Bottom</div>
      </div> */}

      {/*
      <div className='Editor-Container' style={{ padding: "0px", border: "2px solid red", }} >
        <div className='Editor-Content' style={{display:'flex'}}>
          CCC
         </div>

        <ResizibleDivider direction="vertical" />

        <div className='Editor-Container-Footer' style={{ display: "flex", flex: "1 1 0%", border: "1px solid purple", height: '100px' }}>
          Resizable Footer Inner : {renderType}  {Date.now()}
        </div>
      </div>

      <hr />
      */}


      <div className='Editor-Content' style={{ display: "" }}>
        <div className='Editor-Container' style={{ padding: "0px", border: "0px solid red" }} >
          <div className='Editor-Container-Header' style={{ border: "1px solid blue", display: "none" }}>
            RenderType :  {renderType}  {Date.now()}
            id :  {id}
          </div>

          <div className='Editor-Content' >
            <div style={{ padding: "0px", border: "0px solid blue", display: 'flex', height: '100%' }}>

              <div style={{ display: "flex", width: "50%", border: "0px solid purple", overflowY: 'auto', minWidth: '120px' }}>
                <EcmaEditorContentMemo id={id} onEditorReady={onEditorReadyEcma} />
              </div>

              <ResizibleDivider direction="horizontal" />

              <div style={{ flex: ' 1 1 0%', border: "0px solid purple" }}>
                <div ref={jsonContainerRef} id={`json-container:${id}`} style={{ display: renderType === 'json' ? "flex" : "none", flexDirection: 'column', height: '100%' }}>
                  <div style={{ border: "1px solid blue", height: '32px', display: 'none' }}>
                    Navbar[JSON] {Date.now()}
                    <Button size="small" variant="contained" color="primary" style={{ minWidth: 120, marginRight: '20px' }}
                      endIcon={< BlurLinearIcon fontSize="small" />}
                      onClick={compile}>Compile</Button>
                  </div>

                  <AstEditorContentMemo id={id} onEditorReady={onEditorReadyAst} />
                </div>

                <div ref={compiledContainerRef} id={`compiled-container:${id}`} style={{ display: renderType === 'compiled' ? "flex" : "none", flexDirection: 'column', height: '100%' }}>
                  <div style={{ border: "1px solid blue", height: '32px', display: 'none' }}>
                    Navbar[Compliled] {Date.now()}
                    <Button size="small" variant="contained" color="primary" style={{ minWidth: 120, marginRight: '20px' }}
                      endIcon={< BlurLinearIcon fontSize="small" />}
                      onClick={compile}>Compile</Button>
                  </div>

                  <CompiledEditorContentMemo id={id} onEditorReady={onEditorReadyCompiled} />
                </div>

                <div id={`console-container:${id}`} style={{ display: renderType === 'console' ? "flex" : "none", flexDirection: 'column', height: '100%' }}>
                  CONSOLE  {Date.now()}
                  {/* <EditorContentMemo id={0} tickRef={tickRef} renderType='console' /> */}
                </div>

                <div id='graph-container' style={{ display: renderType === 'graph' ? "flex" : "none", flexDirection: 'column', height: '100%' }}>
                  Job Graph / Query Optimizer  {Date.now()}
                  {/* <EditorContentMemo id={0} tickRef={tickRef} renderType='graph' /> */}
                </div>

                <div id='results-container' style={{ display: renderType === 'results' ? "flex" : "none", flexDirection: 'column', height: '100%' }}>
                  Results  {Date.now()}
                  {/* <EditorContentMemo id={0} tickRef={tickRef} renderType='results' /> */}
                </div>

              </div>
            </div>
          </div>

          <ResizibleDivider direction="vertical" />

          <div className='Editor-Container-Footer' style={{ display: "flex", flex: "1 1 0%", border: "0px solid purple", }}>
            <BottomFooter />
          </div>
        </div>
      </div>

      {/* No footers currently */}
      <div className='Editor-Container-Footer' style={{ border: "1px solid purple", display: "none" }}>
        Footer Outter : {renderType}  {Date.now()}
      </div>
    </div>
  )
}

const EcmaEditorContentMemo = React.memo(EcmaEditorContent, (prev, next) => true)
const AstEditorContentMemo = React.memo(AstEditorContent, (prev, next) => true)
const CompiledEditorContentMemo = React.memo(CompiledEditorContent, (prev, next) => true)

function EcmaEditorContent(props: { id: string, tickRef?: any, onEditorReady?: (cme: CodeMirrorManager) => void }) {
  // console.info('EcmaEditorContent')
  const { id, onEditorReady } = props
  let eventBus = globalServices.eventBus

  const _onEditorReady = (instance: CodeMirrorManager) => {
    // console.info('onEditorReady ECMA** ')
    if (onEditorReady) {
      onEditorReady(instance)
    }
  };

  const onEditorKeyDown = (instance: CodeMirror.Editor, event: KeyboardEvent) => {
    // console.info('onEditorKeyDown')
    eventBus.emit(new EventTypeEditorKeyDown(instance.getCursor()));
  };

  return (
    <TextAreaCodeEditor
      onEditorReady={_onEditorReady}
      onKeyDown={onEditorKeyDown}
      name={`editor-ecma:${id}`}
      id={`editor-ecma:${id}`}
      focus={true}
      value="let x = 0 + 1" />
  )
}

function CompiledEditorContent(props: { id: string, onEditorReady?: (cme: CodeMirrorManager) => void }) {
  // console.info('CompiledEditorContent')
  const { id, onEditorReady } = props

  const _onEditorReady = (instance: CodeMirrorManager) => {
    // console.info('onEditorReady COMPILED** ')
    if (onEditorReady) {
      onEditorReady(instance)
    }
  };

  return (
    <TextAreaCodeEditor
      onEditorReady={_onEditorReady}
      name={`editor-compiled:${id}`}
      id={`editor-compiled:${id}`}
      focus={true}
      value="// Generated code" />
  )
}

function AstEditorContent(props: { id: string, onEditorReady?: (cme: CodeMirrorManager) => void }) {
  // console.info('ASTEditorContent')
  const { id, onEditorReady } = props
  let editor: CodeMirrorManager;
  const _onEditorReady = (instance: CodeMirrorManager) => {
    // console.info('onEditorReady AST** ')
    if (onEditorReady) {
      onEditorReady(instance)
    }
  };

  return (
    <TextAreaCodeEditor
      onEditorReady={_onEditorReady}
      name={`editor-ast:${id}`}
      id={`editor-ast:${id}`}
      focus={false}
      value="AST" />
  )
}



function BottomFooter() {
  const [openEditor, setOpenEditor] = React.useState(true);
  const [openSession, setOpenSession] = React.useState(true);

  const handleEditorClick = () => {
    setOpenEditor(!openEditor);
  };

  const handleSessionClick = () => {
    setOpenSession(!openSession);
  };

  return (
      <div className='Editor-Container' style={{ padding: "0px", border: "0px solid red", height:'200px'}} >
        <div className='Editor-Content-Header' style={{backgroundColor:'#eaeae1'}}>

        <Grid container justify="space-between" style={{ padding: "0px", border: "0px solid green", }} xs={12}>
          <Grid item xs={11} style={{ padding: "0px", border: "0px solid green" }}>
            Console Panel : {Date.now()}
          </Grid>
          <Grid item xs={1} style={{ textAlign: 'right' }} >
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open "
              aria-controls="editor-menu"
              aria-haspopup="true"

              style={{ height: "24px" }}
            >
              <MoreHorizIcon style={{ height: "24px" }}/>
            </IconButton>

          </Grid>
        </Grid>
        </div>
        <div className='Editor-Content' >

        CONTENT

         </div>

        <div className='Editor-Container-Footer' style={{ display: "none", flex: "1 1 0%", border: "0px solid purple", height: '20px' }}>
          Resizable Footer Inner :   {Date.now()}
        </div>
      </div>

  )
}


export default EditorImpl
