import { Event } from "./events";
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
