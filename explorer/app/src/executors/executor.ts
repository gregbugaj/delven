import { Subscription } from "rxjs";

export interface ISetupParams {
    uri: string;
}


export interface CallbackFunction<T = any> {
    (event: T): void;
}

export interface Message {
    type: string,
    data?: any 
}


/**
 * An executor is responsible for communication with the service that executes the code
 */
export interface IExecutor {
    id?: string

    /**
     * Setup  
     */
    setup(params: ISetupParams): Promise<boolean>

    /**
     * Perform cleanup
     */
    dispose()

    /**
     * Emit message to the executor backend
     * 
     * @param event 
     * @param data 
     */
    emit(event: string, data?: any): void;

    /**
     * Subscribe to the message bus, but only invoke the callback when the event is of specific type,
     * passing `*` will be equivalent to subscribing to all events.
     * 
     * <code>
     * executor.on('*', (message)=> console.info(`Incomming message = ${message}`)
     * executor.on('eventA', (message)=> console.info(`Incomming message type A = ${message}`)
     * </code>
     * 
     * @param eventNameFilter 
     * @param callback 
     */
    on(eventNameFilter: string | null, callback: CallbackFunction<Message>): Subscription;
}
