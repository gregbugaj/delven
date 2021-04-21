/**
 * Connection handler
 */

import { CancellationToken } from "./cancellation";
import { DataCallback, MessageReader } from "./messageReader";
import { MessageWriter } from "./messageWriter";
import { InitializeResult, RequestMessage } from "./protocol";


export enum ConnectionErrors {
	/**
	 * The connection is closed.
	 */
	Closed = 1,
	/**
	 * The connection got disposed.
	 */
	Disposed = 2,
	/**
	 * The connection is already in listening mode.
	 */
	AlreadyListening = 3
}
export class ConnectionError extends Error {

	public readonly code: ConnectionErrors;

	constructor(code: ConnectionErrors, message: string) {
		super(message);
		this.code = code;
		Object.setPrototypeOf(this, ConnectionError.prototype);
	}
}

enum ConnectionState {
	New = 1,
	Listening = 2,
	Closed = 3,
	Disposed = 4
}
export interface MessageConnection {

  // sendRequest<R, E>(type: RequestType0<R, E>, token?: CancellationToken): Promise<R>;
  sendRequest<R, E>(type: any, token?: CancellationToken): Promise<R>;

  listen(): void;
  end(): void;
  dispose(): void;
}

export function createMessageConnection(messageReader: MessageReader, messageWriter: MessageWriter): MessageConnection {

	let state:ConnectionState = ConnectionState.New

	function isListening(): boolean {
		return state === ConnectionState.Listening;
	}

	function isClosed(): boolean {
		return state === ConnectionState.Closed;
	}

	function isDisposed(): boolean {
		return state === ConnectionState.Disposed;
	}

	function throwIfListening() {
		if (isListening()) {
			throw new ConnectionError(ConnectionErrors.AlreadyListening, 'Connection is already listening');
		}
	}

	function throwIfNotListening() {
		if (!isListening()) {
			throw new Error('Call listen() first.');
		}
	}

	function throwIfClosedOrDisposed() {
		if (isClosed()) {
			throw new ConnectionError(ConnectionErrors.Closed, 'Connection is closed.');
		}
		if (isDisposed()) {
			throw new ConnectionError(ConnectionErrors.Disposed, 'Connection is disposed.');
		}
	}

	const callback: DataCallback = (message) => {
		console.info(`Callback : ${message}`)
	}

  const connection: MessageConnection = {
    sendRequest<R, E>(type: any, token?: CancellationToken): Promise<R> {

      const request: RequestMessage = {
        jsonrpc: '2.0',
        id: 1,
        method: 'example'
      };

      messageWriter.write(request);
      throw new Error("Not implemented")
    },

    listen(): void {
			throwIfClosedOrDisposed();
			throwIfListening();

			state = ConnectionState.Listening;
			messageReader.listen(callback);
    },
    end(): void {
      throw new Error("Not implemented")
    },
    dispose(): void {
      throw new Error("Not implemented")
    }
  }

  return connection;
}
