import { IExecutor, ISetupParams, Message, CallbackFunction } from './executor';

import { filter } from "rxjs/operators";
import { Subject } from "rxjs";
import { Subscription } from "rxjs";

export class ServerExecutor implements IExecutor {
    id?: string
    ws?: WebSocket
    private eventStream: Subject<Message>

    constructor() {
        this.eventStream = new Subject();
    }

    public on(eventNameFilter: string, callback: CallbackFunction<Message>): Subscription {
        return this.eventStream
            .pipe(filter((event: Message): boolean => eventNameFilter === "*" || event?.event === eventNameFilter))
            .subscribe((event: Message): void => {
                try {
                    callback.call(null, event);
                } catch (error) {
                    console.error('Unable to handle envent', error)
                }
            }
            )
    }

    public emit(event: string, data?: any): void {
        this.ws?.send(JSON.stringify({ type: event, data: data }));
    }

    public async setup(params: ISetupParams): Promise<boolean> {
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

                this.ws.onmessage = message => {
                    console.log('onmessage', message);
                    self.eventStream.next(message as unknown as Message);
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