import React from 'react'
import Typography from '@material-ui/core/Typography'
import { fade, makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

import { CodeMirrorManager } from './CodeMirror'
import ReactDOM from 'react-dom';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';


import { green } from '@material-ui/core/colors';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

import ConsoleDisplay, { ConsoleMessageLevel, ConsoleMessage } from './ConsoleDisplay'
import { ASTParser, SourceGenerator } from "delven";
import { EventTypeSampleQuery } from "../bus/message-bus-events";
import "../globalServices"
import { http } from "../../http"

import { ServerExecutor } from "../../executors";

const useStyles = makeStyles((theme) => ({

}));

type EditorProps = {
  ecmaName: string
  ecmaValue: string
  ecmaAutoFocus: boolean

  astName: string
  astValue: string
  astAutoFocus: boolean

  jsonName: string
}

interface IState {
  display?: string
}
class Editor extends React.Component<EditorProps, IState> {

  private ecmaEditor?: CodeMirrorManager;

  private astEditor?: CodeMirrorManager;

  private jsonEditor?: CodeMirrorManager;

  static defaultProps = {
    ecmaName: 'editor-ecma',
    ecmaValue: 'let x = 1',
    ecmaAutoFocus: true,

    astName: 'editor-ast',
    astValue: 'let x = 1',
    astAutoFocus: true,

    jsonName: 'editor-json',
  }

  classes?: Record<never, string>;

  constructor(props: EditorProps) {
    super(props)
    this.state = {
      display: 'compiled',
    }

    this.handleViewChange = this.handleViewChange.bind(this)
    this.evaluate = this.evaluate.bind(this)
  }

  observeEditorChange(targetNode: HTMLElement) {
    let e1 = this.jsonEditor
    let e2 = this.astEditor
    let observer = new MutationObserver(function (mutations) {
      if (targetNode?.style.display != 'none') {
        if (targetNode.id == 'json-container')
          e1?.refresh()
        else if (targetNode.id == 'json-container')
          e2?.refresh()
      }
    });

    observer.observe(targetNode, { attributes: true, childList: true });
  }

  async componentDidMount() {
    const ecmaNode: HTMLTextAreaElement = document.getElementById(this.props.ecmaName) as HTMLTextAreaElement;
    const astNode: HTMLTextAreaElement = document.getElementById(this.props.astName) as HTMLTextAreaElement;
    const jsonNode: HTMLTextAreaElement = document.getElementById(this.props.jsonName) as HTMLTextAreaElement;

    // var $this = ReactDOM.findDOMNode(this)
    this.ecmaEditor = new CodeMirrorManager(ecmaNode)
    this.astEditor = new CodeMirrorManager(astNode)
    this.jsonEditor = new CodeMirrorManager(jsonNode)

    this.jsonEditor.setValue('')
    this.astEditor.setValue('')

    this.observeEditorChange(document.getElementById('json-container') as HTMLElement)
    this.observeEditorChange(document.getElementById('compiled-container') as HTMLElement)

    // get message bus
    let eventBus = globalThis.services.eventBus;
    let editor = this.ecmaEditor
    eventBus.on(
      EventTypeSampleQuery,
      (event): void => {
        let payload = event.payload
        let id = payload.id
        console.log("Event-EventTypeSampleQuery [on]:", payload);
        (async () => {
          const data = await http<{ code: string }>(`/api/v1/samples/${id}`)
          const code = data.code
          editor.setValue(code)
        }
        )()
      }
    )
  }

  log(level: ConsoleMessageLevel, message: string) {
    let consoleDisplay = this.refs.child as ConsoleDisplay
    if (consoleDisplay)
      consoleDisplay.append({time:new Date().toISOString(), level, message })
  }
  async evaluate() {
    this.log("success", "Evaluating Script")

    let hostname = window.location.hostname
    let host = `ws://${hostname}:8080/ws`
    let executor = new ServerExecutor();
    // executor.setup({"uri":host})
    // .then(val=>{
    //   console.info("Executor ready")

    // }).catch(e=>{console.info("Unable to setup executor", e)})

    executor.on("*", msg => console.info(`Received : ${msg.event}`))
    let status = await executor.setup({ "uri": host })
    console.info(`Executor ready : ${status}`);

    let x = false
    if (x) {
      const toJson = (obj: unknown): string => JSON.stringify(obj, function replacer(key, value) { return value }, 4);

      if (this.astEditor && this.ecmaEditor && this.jsonEditor) {
        const txt = this.ecmaEditor.getValue()
        const ast = ASTParser.parse({ type: "code", value: txt });
        const json = toJson(ast)
        const generator = new SourceGenerator();
        const script = generator.toSource(ast);

        this.jsonEditor.setValue(json)
        this.astEditor.setValue(script)
      }
    }
  }

  handleViewChange(event: any, renderType: string) {
    if (renderType == null)
      return
    this.setState({ display: renderType });
  }

  render() {
    let messages: ConsoleMessage[] = []
    messages.push({ time: new Date().toISOString(), level: "info", message: "Important message" })
    messages.push({ time: new Date().toISOString(), level: "info", message: "Important message" })
    messages.push({ time: new Date().toISOString(), level: "warn", message: "Important message" })
    messages.push({ level: "error", message: "Error message" })
    messages.push({ message: "Important message" })
    messages.push({ time: new Date().toISOString(), level: "raw", message: "Raw message" })

    return (
      <div style={{ border: "0px solid purple", display: 'flex', height: '100%', width: '100%', flexDirection: 'column' }} >
        <Grid container style={{ padding: "0px", border: "0px solid purple" }}>
          <Grid item sm={12} md={6}>
            <Grid container justify="space-between" style={{ padding: "0px", border: "0px solid purple" }} >
              <Grid item>
                <Button variant="contained" color="primary" style={{ minWidth: 80 }} onClick={this.evaluate}>Execute</Button>
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
            <ToggleButtonGroup size="small" exclusive onChange={this.handleViewChange} value={this.state.display} aria-label="text primary button group">
              {/* <ToggleButton value="tree">Tree</ToggleButton> */}
              <ToggleButton value="json">JSON</ToggleButton>
              <ToggleButton value="compiled">Compiled</ToggleButton>
              <ToggleButton value="console">Console</ToggleButton>
              <ToggleButton value="graph">Graph</ToggleButton>
            </ToggleButtonGroup >

          </Grid>
        </Grid>

        <div style={{ display: 'flex', flex: '1 1 auto', overflowY: 'auto' }}>
          <div style={{ flex: ' 1 0 0%', border: "0px solid purple" }}>
            <textarea
              name={this.props.ecmaName}
              id={this.props.ecmaName}
              defaultValue={this.props.ecmaValue}
              autoComplete="off"
              autoFocus={this.props.ecmaAutoFocus}
            />
          </div>

          <div style={{ flex: ' 1 1 0%', border: "0px solid purple", overflowY: 'auto' }}>
            <div style={{ display: 'flex', height: '100%', width: '100%', flexDirection: 'column' }} >
              <div style={{ flex: ' 1 0 50%', border: "0px solid purple", overflowY: 'auto' }}>
                <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

                  <div id='json-container' style={{ display: this.state.display == 'json' ? "flex" : "none", flexDirection: 'column', height: '100%' }}>
                    <textarea
                      name={this.props.jsonName}
                      id={this.props.jsonName}
                      defaultValue=''
                      autoComplete="off"
                    />

                  </div>

                  <div id='compiled-container' style={{ display: this.state.display == 'compiled' ? "flex" : "none", flexDirection: 'column', height: '100%' }}>
                    <textarea
                      name={this.props.astName}
                      id={this.props.astName}
                      defaultValue={this.props.astValue}
                      autoComplete="off"
                      autoFocus={this.props.astAutoFocus}
                    />
                  </div>

                  <div id='console-container' style={{ display: this.state.display == 'console' ? "flex" : "none", flexDirection: 'column', height: '100%' }}>
                    <ConsoleDisplay messages={messages} ref="child"></ConsoleDisplay>
                  </div>

                  <div id='graph-container' style={{ display: this.state.display == 'graph' ? "flex" : "none", flexDirection: 'column', height: '100%' }}>
                    Graph
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Editor;
