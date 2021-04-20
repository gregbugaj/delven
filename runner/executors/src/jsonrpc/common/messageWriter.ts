import { Event } from "./events";
import { Emitter } from "./message-bus";
import { Message } from "./protocol";

/** Writes JSON-RPC messages to an underlying transport. */
export interface MessageWriter {
  /** Raised whenever an error occurs while writing a message. */
  readonly onError: Event<[Error, Message | undefined, number | undefined]>;

  /** An event raised when the underlying transport has closed and writing is no longer possible. */
  readonly onClose: Event<void>;

  /**
   * Sends a JSON-RPC message.
   * @param msg The JSON-RPC message to be sent.
   * @description Implementations should guarantee messages are transmitted in the same order that they are received by this method.
   */
  write(msg: Message): Promise<void>;

  end(): void;

  /** Releases resources incurred from writing or raising events. Does NOT close the underlying transport, if any. */
  dispose(): void;
}


export abstract class AbstractMessageWriter {

  private errorEmitter: Emitter<[Error, Message | undefined, number | undefined]>;
  private closeEmitter: Emitter<void>;

  constructor() {
    this.errorEmitter = new Emitter<[Error, Message | undefined, number | undefined]>();
    this.closeEmitter = new Emitter<void>();
  }

  public dispose(): void {
    this.errorEmitter.dispose();
    this.closeEmitter.dispose();
  }

  public get onError(): Event<[Error, Message | undefined, number | undefined]> {
    throw new Error("Not yet implemented")
    // return this.errorEmitter.event;
  }

  protected fireError(error: any, message?: Message, count?: number): void {
    this.errorEmitter.fire([this.asError(error), message, count]);
  }

  public get onClose(): Event<void> {
    throw new Error("Not yet implemented")
    // return this.closeEmitter.event;
  }

  protected fireClose(): void {
    this.closeEmitter.fire(undefined);
  }

  private asError(error: any): Error {
    if (error instanceof Error) {
      return error;
    } else {
      return new Error(`Writer received error. Reason: ${error.message}`);
    }
  }
}
