import { IExecutor, ISetupParams, WebSocketMessage, CallbackFunction } from './executor';

import { catchError, debounceTime, distinctUntilChanged, filter, finalize, map, tap } from "rxjs/operators";
import { MonoTypeOperatorFunction, Observable, pipe, Subject } from "rxjs";
import { Subscription } from "rxjs";
import { Stream } from 'stream';

// https://gist.github.com/staltz/868e7e9bc2a7b8c1f754
// https://medium.com/javascript-everyday/yet-another-way-to-handle-rxjs-subscriptions-1f15554ce3b5


function tapOnce<T>(action: Function): MonoTypeOperatorFunction<T> {
  let isFirst = true
  return pipe(
    tap(next => {
      if (!isFirst) {
        return
      }

      action(next);
      isFirst = false
    })
  )
}

export class ServerExecutor implements IExecutor {
  id?: string
  ws?: WebSocket
  params: ISetupParams | undefined;

  private eventStreamSink: Subject<MessageEvent>
  private messageMap: Map<String, String>
  private targetStreamMap: Map<String, Subject<WebSocketMessage>>

  // private subscriptions:Subscription

  constructor() {
    this.eventStreamSink = new Subject()
    this.messageMap = new Map()
    this.targetStreamMap = new Map()
    this.eventStreamSink
      .pipe(
        map((event: MessageEvent): WebSocketMessage => {
          return JSON.parse(event.data);
        }),
      )
      .subscribe(val => this.split(val))
  }

  split(message: WebSocketMessage): void {
    // Messages like this will not haVe a data element but still need to be pushed
    // {↵	"id": "0003",↵	"code": "Unhandled type : > Sand…Container: System ready\n\r",↵	"compileTime": 0↵}"

    if (!message.hasOwnProperty("data")) {
      console.warn("Unhandled message")
      console.warn(message)
      return
    }

    const data = message.data
    const hasId = data.hasOwnProperty("id")

    if (data && hasId) {
      const replyId = data["id"]
      const targetId = this.messageMap.get(replyId);
      console.warn(`Event/target Id : '${replyId}  = ${targetId}' `)
      if (targetId === undefined) {
        throw new Error("TargerId should not be null/undefined")
      }

      const stream = this.targetStreamMap.get(targetId)
      if (stream === undefined) {
        throw new Error("stream should not be null/undefined")
      }

      stream.next(message)
      // TODO : This needs to be fixed
    //  this.messageMap.delete(replyId)
    } else if (data && !hasId) {
      throw new Error("Reply has no ID property")
    }
  }

  public on(target: string, eventNameFilter: string, callback: CallbackFunction<WebSocketMessage>): Subscription {

    // console.trace(`target = ${target}`)

    let stream: Subject<WebSocketMessage> | undefined = this.targetStreamMap.get(target)
    if (stream === undefined) {
      stream = new Subject<WebSocketMessage>()
      this.targetStreamMap.set(target, stream)
    }

    if (stream === undefined) {
      throw new Error("Stream should not be null")
    }

    return stream
      .pipe(
        catchError(error => {
          console.log('error occured:', error);
          throw error;
        }),

        filter((event: WebSocketMessage): boolean => {
          return eventNameFilter === "*" || event?.type === eventNameFilter
        }),
      )
      .subscribe(
        (value: WebSocketMessage) => {
          try {
            callback.call(null, value);
          } catch (err) {
            console.error('Unable to handle envent', err)
          }
        },
        err => {
          console.error("Error in subscriber", err)
        },
      )
  }

  public async emit(source: string, event: string, data?: any): Promise<undefined> {

    console.info(`emit.source : ${source}`)
    console.info(`emit.event  : ${event}`)
    console.info(data)

    if (this.ws?.readyState === WebSocket.CLOSED) {
      console.info("Connection closed")
      if (this.params !== undefined) {
        await this.setup(this.params)
      }
    }

    if (this.ws?.readyState === WebSocket.OPEN) {
      if (data && data.hasOwnProperty("id")) {
        this.messageMap.set(data["id"], source)
      } else {
        console.warn(`Event : '${event}' does not have a unique id`)
      }

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
          console.error("Websocket error ", event)
          this.eventStreamSink.error(event)
          reject(event)
        }

        this.ws.onmessage = (message: MessageEvent) => {
          self.eventStreamSink.next(message);
        };

        this.ws.onclose = (e: CloseEvent) => {
          if (e.wasClean) {
            this.eventStreamSink.complete()
          } else {
            this.eventStreamSink.error(e)
          }
        }
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
