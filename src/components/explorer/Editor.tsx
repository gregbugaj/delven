import React from 'react'
import Typography from '@material-ui/core/Typography'
import { fade, makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';

import { CodeMirrorManager } from './CodeMirror'
import ReactDOM from 'react-dom';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import TextField from '@material-ui/core/TextField';
import { Paper } from '@material-ui/core';
import { Divider } from 'material-ui';

const useStyles = makeStyles((theme) => ({

}));

type EditorProps = {
  ecmaName: string
  ecmaValue: string
  ecmaAutoFocus: boolean

  astName: string
  astValue: string
  astAutoFocus: boolean
}

class Editor extends React.Component<EditorProps> {

  private ecmaEditor?: CodeMirrorManager;

  private astEditor?: CodeMirrorManager;

  static defaultProps = {
    ecmaName: 'editor-ecma',
    ecmaValue: 'let x = 1',
    ecmaAutoFocus: false,

    astName: 'editor-ast',
    astValue: 'let x = 1',
    astAutoFocus: false,
  }

  classes?: Record<never, string>;

  constructor(props: EditorProps) {
    super(props)
  }

  componentDidMount() {
    const ecmaNode: HTMLTextAreaElement = document.getElementById(this.props.ecmaName) as HTMLTextAreaElement;
    const astNode: HTMLTextAreaElement = document.getElementById(this.props.astName) as HTMLTextAreaElement;
    // var $this = ReactDOM.findDOMNode(this)
    this.ecmaEditor = new CodeMirrorManager(ecmaNode)
    this.astEditor = new CodeMirrorManager(astNode)
  }


  render() {
    return (
      <div style={{ border: "0px solid purple", display: 'flex', height: '100%', width: '100%', flexDirection: 'column' }} >
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

                  <ButtonGroup variant="text" color="primary" aria-label="text primary button group">
                    <Button>Tree</Button>
                    <Button>JSON</Button>
                    <Button>Compiled</Button>
                  </ButtonGroup>

                  <textarea
                    name={this.props.astName}
                    id={this.props.astName}
                    defaultValue={this.props.astValue}
                    autoComplete="off"
                    autoFocus={this.props.astAutoFocus}
                  />

                </div>
              </div>

              <div style={{ flex: ' 1 0 0%', border: "0px solid purple", overflowY: 'hidden', padding: '0px', marginTop: '10px' }}>
                <Grid
                  container
                  direction="row"
                  justify="flex-start"
                  alignItems="stretch"
                  style={{ height: '100%', overflowY: 'hidden', }}
                >
                  <Grid item xs={2} container>

                    <Grid container spacing={5} direction="column" >
                      <Grid item>
                        <Button variant="contained" style={{ minWidth: 120 }}>Evaluate</Button>
                      </Grid>
                      <Grid item>
                        <Button variant="contained" style={{ minWidth: 120 }}>Clear</Button>
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid item xs={10} >
                    <textarea style={{ width: '100%', height: '100%' }}
                      defaultValue=''
                      autoComplete="off"
                    />
                  </Grid>
                </Grid>

              </div>
            </div>

          </div>
        </div>
      </div>
    )
  }
}

export default Editor;
