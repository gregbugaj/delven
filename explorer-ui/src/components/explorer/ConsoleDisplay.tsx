import React, { useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { TextField } from '@material-ui/core';


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

	messagesEndRef = React.createRef<HTMLDivElement>()

  constructor(props: ConsoleMessageProps) {
    super(props)
    this.state = {
      messages: props.messages || []
		}
  }

  public append(messages: ConsoleMessage | ConsoleMessage[]) {
    this.setState({ messages: this.state.messages?.concat(messages) })
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

	scrollToBottom = () => {
		// this.messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
		//  this will get the 'console-view' element and scroll into view
		const target = this.messagesEndRef.current
		const parent = target.parentElement.parentElement
		// parent.scrollIntoView({ behavior: 'smooth' })
		parent.scrollTop = target.scrollHeight;
	}

	componentDidMount () {
		this.scrollToBottom()
	}

	componentDidUpdate () {
		this.scrollToBottom()
	}

  render() {
    // console.info('RENDER ' +Date.now())

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
        <span style={{ margin: '0em', display: 'flex', minHeight: '18px', fontFamily: 'Cousine,monospace' }}>
          <span style={{ display: 'flex', marginRight: '.2em', width: '1em' }}>  </span>
          <span style={{ display: 'flex', marginRight: '.5em', color: '#666', minWidth: '2.5em', textAlign: 'right' }}> {props.index + 1} </span>
          <span style={{ display: message.time == null ? 'none' : 'block', marginRight: '.5em', minWidth:'180px' }}>

            <span style={{ color: colors.gray }}>[</span>
            <span style={{ color: '#666' }}>{message.time}</span>
            <span style={{ color: colors.gray }}>]</span>

          </span>
          <span style={{ display: 'flex', color: color }}>{message.message}</span>
        </span>
      )
    }

    const RenderConsoleMessages = (messages?: ConsoleMessage[]) => {
      return (
        <div className='console-messages'>
          {messages?.map((message, index) => <MessageItem index={index} message={message} />)}
        </div>
      );
    }

		return (
			<React.Fragment>
				<div className='console-view' style={{ border: "0px solid blue", display: 'flex',}}>
					<div style={{ display: 'flex', width: "100%", }}>
						{RenderConsoleMessages(this.state.messages)}
					</div>
					<div style={{ float:"left", clear: "both" }} ref={this.messagesEndRef}></div>
				</div>
			</React.Fragment>
		)
  }
}

export default ConsoleDisplay;

// {/*
//         <div className='Editor-Container console-view' style={{ backgroundColor: '#222', padding: '5px', }}>
//           <div className='Editor-Content-Header' style={{ display: 'noneXX' }}>
//             HEADER
//          </div>

// 				 <div className='Editor-Content' style={{ height: '100%' }}>
//             <div style={{ padding: "0px", border: "2px solid blue", display: 'flex', height: '100%' }}>
// 	            {RenderConsoleMessages(this.state.messages)}
//           	</div>
//           </div> */}

//           {/* <div className='Editor-Content-Footer' style={{ margin: '.5em', fontFamily: 'Cousine,monospace', color:'#FFF' }}>
//             <hr/>
//            REPL :
//         </div> */}

// 				{/* </div> */}
