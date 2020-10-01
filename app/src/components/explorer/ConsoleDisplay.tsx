import React from 'react'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles';

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
  gray: "gray",
  red: "#E86C5D",
  green: "#74ED7B",
  blue: "#3F6FFB",
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

  componentDidMount(){
    const objDiv = document.getElementById("console-out");
    console.info(objDiv)
    if(objDiv != null){
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
        <div style={{ color: color, margin: '0em', display: 'flex' }}>
          <span style={{ display: message.time == null ? 'none' : 'block', marginRight: '.5em' }}>[{message.time}]</span>
          <span style={{ display: 'flex' }}>{message.message}</span>
        </div>
      )
    }

    let renderConsoleMessages = (messages?: ConsoleMessage[]) => {
      return (
        <div id='console-messages'>
          {messages?.map((message, index) => <MessageItem key={index} message={message} />)}
        </div>
      );
    }

    return (
      // <div className={classes.root}>
      <div id='console-header' style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <div>
          <Typography variant="h6" >
            Console Display
        </Typography>
        </div>

        <div id='console-out' style={{ height: '100%', backgroundColor: '#000', padding: '5px', overflowY: 'auto' }}>
          {renderConsoleMessages(this.state.messages)}
        </div>
      </div>
    )
  }
}

export default ConsoleDisplay;