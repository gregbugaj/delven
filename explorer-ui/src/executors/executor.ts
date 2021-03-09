import { Subscription } from "rxjs";


/**
 * Messager returned via WS
 */
export interface WebSocketMessage {
  type: string | undefined,
  data?: any
}

abstract class AbstractWebSocketMessage<T> implements WebSocketMessage {
  type: string | undefined;
  data?: T;
}

export class TextMessage implements AbstractWebSocketMessage<any>{
  type: string;
  data?: any;

  constructor(type: string, data?: any) {
    this.type = type;
    this.data = data;
  }
}
export interface ISetupParams {
  uri: string;
}

export interface CallbackFunction<T = any> {
  (event: T): void;
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
  on(eventNameFilter: string | null, callback: CallbackFunction<WebSocketMessage>): Subscription;
}
