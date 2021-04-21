/**
 * Connection handler
 */
import { CancellationToken } from "./cancellation";
import { DataCallback, MessageReader } from "./messageReader";
import { MessageWriter } from "./messageWriter";
import { InitializeResult, MessageSignature, RequestMessage, ParameterStructures, NotificationMessage, RequestType, RequestType0, RequestType1, RequestType2, RequestType3, ResponseError, NotificationType0, NotificationType, NotificationType1, NotificationType2, NotificationType3, Message, ResponseMessage, isRequestMessage, isResponseMessage } from "./messages";
import * as Is from './is'
import { Disposable, RAL } from "./api";
import { Emitter } from "./message-bus";
import { LinkedMap } from "./linkedMap";


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

type MessageQueue = LinkedMap<string, Message>;

enum ConnectionState {
	New = 1,
	Listening = 2,
	Closed = 3,
	Disposed = 4
}

export type HandlerResult<R, E> = R | ResponseError<E> | Thenable<R> | Thenable<ResponseError<E>> | Thenable<R | ResponseError<E>>;

export interface StarRequestHandler {
	(method: string, params: any[] | object | undefined, token: CancellationToken): HandlerResult<any, any>;
}

namespace StarRequestHandler {
	export function is(value: any): value is StarRequestHandler {
		return Is.func(value);
	}
}

export interface GenericRequestHandler<R, E> {
	(...params: any[]): HandlerResult<R, E>;
}

export interface RequestHandler0<R, E> {
	(token: CancellationToken): HandlerResult<R, E>;
}

export interface RequestHandler<P, R, E> {
	(params: P, token: CancellationToken): HandlerResult<R, E>;
}

export interface RequestHandler1<P1, R, E> {
	(p1: P1, token: CancellationToken): HandlerResult<R, E>;
}

export interface RequestHandler2<P1, P2, R, E> {
	(p1: P1, p2: P2, token: CancellationToken): HandlerResult<R, E>;
}

export interface RequestHandler3<P1, P2, P3, R, E> {
	(p1: P1, p2: P2, p3: P3, token: CancellationToken): HandlerResult<R, E>;
}

export interface StarNotificationHandler {
	(method: string, params: any[] | object | undefined): void;
}

export interface GenericNotificationHandler {
	(...params: any[]): void;
}

export interface NotificationHandler0 {
	(): void;
}

export interface NotificationHandler<P> {
	(params: P): void;
}

export interface NotificationHandler1<P1> {
	(p1: P1): void;
}

export interface NotificationHandler2<P1, P2> {
	(p1: P1, p2: P2): void;
}

export interface NotificationHandler3<P1, P2, P3> {
	(p1: P1, p2: P2, p3: P3): void;
}

export interface MessageConnection {

	sendRequest<R, E>(type: RequestType0<R, E>, token?: CancellationToken): Promise<R>;
	sendRequest<P, R, E>(type: RequestType<P, R, E>, params: P, token?: CancellationToken): Promise<R>;
	sendRequest<P1, R, E>(type: RequestType1<P1, R, E>, p1: P1, token?: CancellationToken): Promise<R>;
	sendRequest<P1, P2, R, E>(type: RequestType2<P1, P2, R, E>, p1: P1, p2: P2, token?: CancellationToken): Promise<R>;
	sendRequest<P1, P2, P3, R, E>(type: RequestType3<P1, P2, P3, R, E>, p1: P1, p2: P2, p3: P3, token?: CancellationToken): Promise<R>;
	sendRequest<R>(method: string, r0?: ParameterStructures | any, ...rest: any[]): Promise<R>;

	onRequest<R, E>(type: RequestType0<R, E>, handler: RequestHandler0<R, E>): Disposable;
	onRequest<P, R, E>(type: RequestType<P, R, E>, handler: RequestHandler<P, R, E>): Disposable;
	onRequest<P1, R, E>(type: RequestType1<P1, R, E>, handler: RequestHandler1<P1, R, E>): Disposable;
	onRequest<P1, P2, R, E>(type: RequestType2<P1, P2, R, E>, handler: RequestHandler2<P1, P2, R, E>): Disposable;
	onRequest<P1, P2, P3, R, E>(type: RequestType3<P1, P2, P3, R, E>, handler: RequestHandler3<P1, P2, P3, R, E>): Disposable;
	onRequest<R, E>(method: string, handler: GenericRequestHandler<R, E>): Disposable;
	onRequest(handler: StarRequestHandler): Disposable;

	sendNotification(type: NotificationType0): void;
	sendNotification<P>(type: NotificationType<P>, params?: P): void;
	sendNotification<P1>(type: NotificationType1<P1>, p1: P1): void;
	sendNotification<P1, P2>(type: NotificationType2<P1, P2>, p1: P1, p2: P2): void;
	sendNotification<P1, P2, P3>(type: NotificationType3<P1, P2, P3>, p1: P1, p2: P2, p3: P3): void;

	onNotification(type: NotificationType0, handler: NotificationHandler0): Disposable;
	onNotification<P>(type: NotificationType<P>, handler: NotificationHandler<P>): Disposable;
	onNotification<P1>(type: NotificationType1<P1>, handler: NotificationHandler1<P1>): Disposable;
	onNotification<P1, P2>(type: NotificationType2<P1, P2>, handler: NotificationHandler2<P1, P2>): Disposable;
	onNotification<P1, P2, P3>(type: NotificationType3<P1, P2, P3>, handler: NotificationHandler3<P1, P2, P3>): Disposable;

	listen(): void;
	end(): void;
	dispose(): void;
}


interface RequestHandlerElement {
	type: MessageSignature | undefined;
	handler: GenericRequestHandler<any, any>;
}
interface NotificationHandlerElement {
	type: MessageSignature | undefined;
	handler: GenericNotificationHandler;
}

export function createMessageConnection(messageReader: MessageReader, messageWriter: MessageWriter): MessageConnection {

	let sequenceNumber = 0;
	let notificationSequenceNumber = 0;
	let unknownResponseSequenceNumber = 0;
	const version: string = '2.0';

	let starRequestHandler: StarRequestHandler | undefined = undefined;
	const requestHandlers: { [name: string]: RequestHandlerElement | undefined } = Object.create(null);
	let starNotificationHandler: StarNotificationHandler | undefined = undefined;
	const notificationHandlers: { [name: string]: NotificationHandlerElement | undefined } = Object.create(null);

	let timer: RAL.ImmediateHandle | undefined;
	let messageQueue: MessageQueue = new LinkedMap<string, Message>();

	let state: ConnectionState = ConnectionState.New;
	const errorEmitter: Emitter<[Error, Message | undefined, number | undefined]> = new Emitter<[Error, Message | undefined, number | undefined]>();
	const closeEmitter: Emitter<void> = new Emitter<void>();
	const unhandledNotificationEmitter: Emitter<NotificationMessage> = new Emitter<NotificationMessage>();
	const disposeEmitter: Emitter<void> = new Emitter<void>();

	function createRequestQueueKey(id: string | number | null): string {
		if (id === null) {
			throw new Error(`Can't send requests with id null since the response can't be correlated.`);
		}
		return 'req-' + id.toString();
	}

	function createResponseQueueKey(id: string | number | null): string {
		if (id === null) {
			return 'res-unknown-' + (++unknownResponseSequenceNumber).toString();
		} else {
			return 'res-' + id.toString();
		}
	}

	function createNotificationQueueKey(): string {
		return 'not-' + (++notificationSequenceNumber).toString();
	}

	function addMessageToQueue(queue: MessageQueue, message: Message): void {
		if (isRequestMessage(message)) {
			queue.set(createRequestQueueKey(message.id), message);
		} else if (isResponseMessage(message)) {
			queue.set(createResponseQueueKey(message.id), message);
		} else {
			queue.set(createNotificationQueueKey(), message);
		}
	}

	function cancelUndispatched(_message: Message): ResponseMessage | undefined {
		return undefined;
	}

	function isListening(): boolean {
		return state === ConnectionState.Listening;
	}

	function isClosed(): boolean {
		return state === ConnectionState.Closed;
	}

	function isDisposed(): boolean {
		return state === ConnectionState.Disposed;
	}

	function closeHandler(): void {
		if (state === ConnectionState.New || state === ConnectionState.Listening) {
			state = ConnectionState.Closed;
			closeEmitter.fire(undefined);
		}
		// If the connection is disposed don't sent close events.
	}

	function readErrorHandler(error: Error): void {
		errorEmitter.fire([error, undefined, undefined]);
	}

	function writeErrorHandler(data: [Error, Message | undefined, number | undefined]): void {
		errorEmitter.fire(data);
	}

	messageReader.onClose(closeHandler);
	messageReader.onError(readErrorHandler);

	messageWriter.onClose(closeHandler);
	messageWriter.onError(writeErrorHandler);

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

	function undefinedToNull(param: any) {
		if (param === undefined) {
			return null;
		} else {
			return param;
		}
	}

	function nullToUndefined(param: any) {
		if (param === null) {
			return undefined;
		} else {
			return param;
		}
	}

	function isNamedParam(param: any): boolean {
		return param !== undefined && param !== null && !Array.isArray(param) && typeof param === 'object';
	}

	function computeSingleParam(parameterStructures: ParameterStructures, param: any): any | any[] {
		switch (parameterStructures) {
			case ParameterStructures.auto:
				if (isNamedParam(param)) {
					return nullToUndefined(param);
				} else {
					return [undefinedToNull(param)];
				}
			case ParameterStructures.byName:
				if (!isNamedParam(param)) {
					throw new Error(`Received parameters by name but param is not an object literal.`);
				}
				return nullToUndefined(param);
			case ParameterStructures.byPosition:
				return [undefinedToNull(param)];
			default:
				throw new Error(`Unknown parameter structure ${parameterStructures.toString()}`);
		}
	}

	function computeMessageParams(type: MessageSignature, params: any[]): any | any[] | null {
		let result: any | any[] | null;
		const numberOfParams = type.numberOfParams;
		switch (numberOfParams) {
			case 0:
				result = undefined;
				break;
			case 1:
				result = computeSingleParam(type.parameterStructures, params[0]);
				break;
			default:
				result = [];
				for (let i = 0; i < params.length && i < numberOfParams; i++) {
					result.push(undefinedToNull(params[i]));
				}
				if (params.length < numberOfParams) {
					for (let i = params.length; i < numberOfParams; i++) {
						result.push(null);
					}
				}
				break;
		}
		return result;
	}


	const callback: DataCallback = (message) => {
		console.info(`Callback : ${message}`)
	}

	const connection: MessageConnection = {

		sendNotification: (type: string | MessageSignature, ...args: any[]): void => {
			throwIfClosedOrDisposed();

			let method: string;
			let messageParams: object | [] | undefined;
			if (Is.string(type)) {
				method = type;
				const first: unknown = args[0];
				let paramStart: number = 0;
				let parameterStructures: ParameterStructures = ParameterStructures.auto;
				if (ParameterStructures.is(first)) {
					paramStart = 1;
					parameterStructures = first;
				}
				let paramEnd: number = args.length;
				const numberOfParams = paramEnd - paramStart;
				switch (numberOfParams) {
					case 0:
						messageParams = undefined;
						break;
					case 1:
						messageParams = computeSingleParam(parameterStructures, args[paramStart]);
						break;
					default:
						if (parameterStructures === ParameterStructures.byName) {
							throw new Error(`Received ${numberOfParams} parameters for 'by Name' notification parameter structure.`);
						}
						messageParams = args.slice(paramStart, paramEnd).map(value => undefinedToNull(value));
						break;
				}
			} else {
				const params = args;
				method = type.method;
				messageParams = computeMessageParams(type, params);
			}

			const notificationMessage: NotificationMessage = {
				jsonrpc: version,
				method: method,
				params: messageParams
			};
			// traceSendingNotification(notificationMessage);
			messageWriter.write(notificationMessage);
		},


		sendRequest<R, E>(type: any, token?: CancellationToken): Promise<R> {

			const request: RequestMessage = {
				jsonrpc: '2.0',
				id: 1,
				method: 'example'
			};

			messageWriter.write(request);
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

