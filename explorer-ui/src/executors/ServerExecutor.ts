import { IExecutor, ISetupParams, Message, CallbackFunction } from './executor';

import { filter, map } from "rxjs/operators";
import { Subject } from "rxjs";
import { Subscription } from "rxjs";

export class ServerExecutor implements IExecutor {
    id?: string
    ws?: WebSocket
    private eventStream: Subject<MessageEvent>
    params: ISetupParams | undefined;

    constructor() {
        this.eventStream = new Subject();
    }

    public on(eventNameFilter: string, callback: CallbackFunction<Message>): Subscription {
        return this.eventStream
            .pipe(map((event: MessageEvent): Message => {
                return JSON.parse(event.data)
            }))
            .pipe(filter((event: Message): boolean => {
                return eventNameFilter === "*" || event?.type === eventNameFilter
            }))
            .subscribe((event: Message): void => {
                try {
                    callback.call(null, event);
                } catch (error) {
                    console.error('Unable to handle envent', error)
                }
            })
    }

    public async emit(event: string, data?: any): Promise<undefined> {
        if (this.ws?.readyState == WebSocket.CLOSED) {
            console.info("Connection closed")
            if (this.params != undefined) {
                await this.setup(this.params)
            }
        }

        if (this.ws?.readyState == WebSocket.OPEN) {
            this.ws.send(JSON.stringify({ type: event, data: data }));
        }

        return Promise.resolve(undefined)
    }

    public async setup(params: ISetupParams): Promise<boolean> {
        this.params = params
        const uri = params.uri
        console.info(`Attempting to setup connection for : ${uri}`)
        if (this.ws?.readyState === WebSocket.OPEN) {
            return Promise.resolve(true)
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
                    console.log("Error ", event)
                    reject(event)
                }

                this.ws.onmessage = (message: MessageEvent) => {
                    console.log('onmessage', message);
                    self.eventStream.next(message);
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

    private terminalMessage(msg: string) {
        this.emit('terminal:message', `> Sandbox Container: ${msg}\n\r`);
    }
}