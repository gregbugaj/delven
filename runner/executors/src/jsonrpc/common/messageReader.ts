import { Disposable } from "./disposable";
import { Event } from "./events";
import { Message } from "./protocol";

/**
 * A callback that receives each incoming JSON-RPC message.
 */
export interface DataCallback {
  (data: Message): void;
}

/** Reads JSON-RPC messages from some underlying transport. */
export interface MessageReader {
  /** Raised whenever an error occurs while reading a message. */
  readonly onError: Event<Error>;

  /** An event raised when the end of the underlying transport has been reached. */
  readonly onClose: Event<void>;

  /**
   * Begins listening for incoming messages. To be called at most once.
   * @param callback A callback for receiving decoded messages.
   */
  listen(callback: DataCallback): Disposable;

  /** Releases resources incurred from reading or raising events. Does NOT close the underlying transport, if any. */
  dispose(): void;
}
