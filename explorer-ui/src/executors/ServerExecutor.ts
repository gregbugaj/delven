import { IExecutor, ISetupParams, WebSocketMessage, CallbackFunction } from './executor';

import { filter, map } from "rxjs/operators";
import { Subject } from "rxjs";
import { Subscription } from "rxjs";

// https://gist.github.com/staltz/868e7e9bc2a7b8c1f754
// https://medium.com/javascript-everyday/yet-another-way-to-handle-rxjs-subscriptions-1f15554ce3b5
export class ServerExecutor implements IExecutor {
  id?: string
  ws?: WebSocket
  params: ISetupParams | undefined;

  private eventStreamSink: Subject<MessageEvent>
  private messageMap: Map<String, String>

  constructor() {
    this.eventStreamSink = new Subject()
    this.messageMap = new Map<String, String>()
  }

  public on(target: string, eventNameFilter: string, callback: CallbackFunction<WebSocketMessage>): Subscription {
    let sub = this.eventStreamSink
      .pipe(map((event: MessageEvent): WebSocketMessage => {
        return JSON.parse(event.data);
      }))
      .pipe(filter((event: WebSocketMessage): boolean => {
        return eventNameFilter === "*" || event?.type === eventNameFilter
      }))
      .pipe(filter((event: WebSocketMessage): boolean => {

        console.info(event)
        // check if we are the designated recipient
        if (target && target !== "*") {
          let data = event.data
          if (data && data.hasOwnProperty("id")) {
            const replyId = data["id"]
            const targetId = this.messageMap.get(replyId);
            console.warn(`Event Id : '${replyId}  target = ${targetId}' `)

            if (replyId && targetId !== target) {
              return false
            } else {
              // this.messageMap.delete(replyId)
            }
          }
        }
        return true
      }))
      .subscribe((event: WebSocketMessage): void => {
        try {
          callback.call(null, event);
        } catch (error) {
          console.error('Unable to handle envent', error)
        }
      })

    console.info(sub)
    return sub
  }

  public async emit(source: string, event: string, data?: any): Promise<undefined> {

    if (this.ws?.readyState == WebSocket.CLOSED) {
      console.info("Connection closed")
      if (this.params != undefined) {
        await this.setup(this.params)
      }
    }

    if (this.ws?.readyState == WebSocket.OPEN) {
      if (data && data.hasOwnProperty("id")) {
        this.messageMap.set(data["id"], source)
      } else {
        console.warn(`Event : '${event}' does not have a unique id`)
      }

      console.info(this.messageMap)
      // send CompilationUnit
      this.ws.send(JSON.stringify({ type: event, data: data }));
      return
    }

    console.warn(`Unable to emit message : ${event} >  ${JSON.stringify(data)}`)
    return undefined;
  }

  public async setup(params: ISetupParams): Promise<boolean> {
    this.params = params
    const uri = params.uri
    console.info(`Attempting to setup connection for : ${uri}`)
    if (this.ws?.readyState === WebSocket.OPEN) {
      return true
    }

    let self = this
    return new Promise<boolean>((resolve, reject) => {
      try {
        this.ws = new WebSocket(uri);

        this.ws.onopen = event => {
          console.log("Connected ", event)
          this.terminalMessage('System ready')
          resolve(true);
        }

        this.ws.onerror = event => {
          console.error("Error ", event)
          reject(event)
        }

        this.ws.onmessage = (message: MessageEvent) => {
          console.log('onmessage', message);
          self.eventStreamSink.next(message);
        };
      } catch (e) {
        console.error("Error connecting", e)
        reject(e)
      }
    });
  }

  public async dispose() {
    if (this.ws) {
      this.ws.close();
      this.ws = undefined;
    }
  }

  /**
   * Push message to the remote client
   * @param msg to display in logs
   */
  private terminalMessage(msg: string) {
    this.emit('terminal:message', `> Sandbox Container: ${msg}\n\r`);
  }
}
