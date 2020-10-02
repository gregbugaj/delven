import React from 'react'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

const colors = {
  white: "white",
  black: "black",
  silver: "silver",
  gray: "#f1f1f1",
  red: "#E86C5D",
  green: "#74ED7B",
  blue: "#96CBFE",
  gold: "gold",
  yellow: "yellow",
  pink: "pink",
  cyan: "cyan"
}

export type ConsoleMessageLevel = "raw" | "success" | "info" | "warn" | "error"

export interface ConsoleMessage {
  time?: string
  level?: ConsoleMessageLevel
  message: string
}

type ConsoleMessageProps = {
  messages?: ConsoleMessage[]
}

interface IState {
  messages: ConsoleMessage[]
}
/**
 * <pre>
 *     let messages: ConsoleMessage[] = []
    messages.push({ time: new Date().toISOString(), level: "info", message: "Important message" })
    messages.push({ time: new Date().toISOString(), level: "info", message: "Important message" })
    messages.push({ time: new Date().toISOString(), level: "warn", message: "Important message" })
    messages.push({ level: "error", message: "Error message" })
    messages.push({ message: "Important message" })
    messages.push({ time: new Date().toISOString(), level: "raw", message: "Raw message" })

 * </pre>
 */
export class ConsoleDisplay extends React.Component<ConsoleMessageProps, IState> {
  constructor(props: ConsoleMessageProps) {
    super(props)
    this.state = {
      messages: props.messages || []
    }
  }

  public append(message: ConsoleMessage) {
    this.setState({ messages: this.state.messages?.concat(message) })
  }

  private _append(level: ConsoleMessageLevel, message: string) {
    this.append({ time: new Date().toISOString(), level: level, message: message })
  }

  public success(message: string) {
    this._append("success", message)
  }

  public error(message: string) {
    this._append("error", message)
  }

  public warn(message: string) {
    this._append("warn", message)
  }

  public info(message: string) {
    this._append("info", message)
  }

  public raw(message: string) {
    this._append("raw", message)
  }

  componentDidMount() {
    const objDiv = document.getElementById("console-out");
    console.info(objDiv)
    if (objDiv != null) {
      objDiv.scrollIntoView(false)
      // objDiv.scrollTop = objDiv.scrollHeight;
    }
  }

  render() {
    function MessageItem(props) {
      let message = props.message
      let color = colors.gray

      switch (message.level) {
        case "raw": color = colors.gray; break;
        case "success": color = colors.green; break;
        case "info": color = colors.gray; break;
        case "warn": color = colors.gold; break;
        case "error": color = colors.red; break;
      }

      return (
        <div style={{ margin: '0em', display: 'flex', minHeight: '18px', fontFamily: 'Cousine,monospace' }}>
          <span style={{ display: 'flex', marginRight: '.2em', width: '1em' }}>  </span>
          <span style={{ display: 'flex', marginRight: '.5em', color: '#666', minWidth: '1.5em', textAlign: 'right' }}> {props.index + 1} </span>
          <span style={{ display: message.time == null ? 'none' : 'block', marginRight: '.5em' }}>

            <span style={{ color: colors.gray }}>[</span>
            <span style={{ color: '#666' }}>{message.time}</span>
            <span style={{ color: colors.gray }}>]</span>

          </span>
          <span style={{ display: 'flex', color: color }}>{message.message}</span>
        </div>
      )
    }

    let renderConsoleMessages = (messages?: ConsoleMessage[]) => {
      return (
        <div id='console-messages'>
          {messages?.map((message, index) => <MessageItem index={index} message={message} />)}
        </div>
      );
    }

    return (
      // <div className={classes.root}>
      <div id='console-header' style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <div>
          <Grid container justify="space-between" style={{ padding: "0px", border: "0px solid purple" }} >
            <Grid item>
              <Typography variant="h6" >
                Console Display
                </Typography>
            </Grid>
            <Grid item>
              <Button  size="small" variant="contained" style={{ minWidth: 80 }} >Raw logs</Button>
            </Grid>
          </Grid>
        </div>

        <div id='console-out' style={{ height: '100%', backgroundColor: '#222', padding: '5px', overflowY: 'auto' }}>
          {renderConsoleMessages(this.state.messages)}
        </div>
      </div>
    )
  }
}

export default ConsoleDisplay;