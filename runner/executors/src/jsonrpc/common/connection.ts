/**
 * Connection handler
 */
import { AbstractCancellationTokenSource, CancellationToken, CancellationTokenSource } from "./cancellation";
import { DataCallback, MessageReader } from "./messageReader";
import { MessageWriter } from "./messageWriter";
import { InitializeResult, MessageSignature, RequestMessage, ParameterStructures, NotificationMessage, RequestType, RequestType0, RequestType1, RequestType2, RequestType3, ResponseError, NotificationType0, NotificationType, NotificationType1, NotificationType2, NotificationType3, Message, ResponseMessage, isRequestMessage, isResponseMessage, ProgressType, CancelParams, isNotificationMessage, ErrorCodes, LSPMessageType } from "./messages";
import * as Is from './is'
import { Disposable, RAL } from "./api";
import { Emitter } from "./message-bus";
import { LinkedMap } from "./linkedMap";
import { Console } from "node:console";


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

interface ResponsePromise {
	method: string;
	timerStart: number;
	resolve: (response: any) => void;
	reject: (error: any) => void
}

enum ConnectionState {
	New = 1,
	Listening = 2,
	Closed = 3,
	Disposed = 4
}

namespace CancelNotification {
	export const type = new NotificationType<CancelParams>('$/cancelRequest');
}

export type ProgressToken = number | string;
interface ProgressParams<T> {
	/**
	 * The progress token provided by the client or server.
	 */
	token: ProgressToken;

	/**
	 * The progress data.
	 */
	value: T;
}
namespace ProgressNotification {
	export const type = new NotificationType<ProgressParams<any>>('$/progress');
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

export interface Logger {
	error(message: string): void;
	warn(message: string): void;
	info(message: string): void;
	log(message: string): void;
}

export const NullLogger: Logger = Object.freeze({
	error: () => {},
	warn: () => {},
	info: () => {},
	log: () => {}
});

export const ConsoleLogger: Logger = Object.freeze({
	error: console.error,
	warn: console.warn,
	info: console.info,
	log: console.log
});


export enum Trace {
	Off, Messages, Verbose
}

export type TraceValues = 'off' | 'messages' | 'verbose';
export namespace Trace {
	export function fromString(value: string): Trace {
		if (!Is.string(value)) {
			return Trace.Off;
		}
		value = value.toLowerCase();
		switch (value) {
			case 'off':
				return Trace.Off;
			case 'messages':
				return Trace.Messages;
			case 'verbose':
				return Trace.Verbose;
			default:
				return Trace.Off;
		}
	}

	export function toString(value: Trace): TraceValues {
		switch (value) {
			case Trace.Off:
				return 'off';
			case Trace.Messages:
				return 'messages';
			case Trace.Verbose:
				return 'verbose';
			default:
				return 'off';
		}
	}
}

export enum TraceFormat {
	Text = 'text',
	JSON = 'json'
}
export namespace TraceFormat {
	export function fromString(value: string): TraceFormat {
		if (!Is.string(value)) {
			return TraceFormat.Text;
		}
		value = value.toLowerCase();
		if (value === 'json') {
			return TraceFormat.JSON;
		} else {
			return TraceFormat.Text;
		}
	}
}

export interface TraceOptions {
	sendNotification?: boolean;
	traceFormat?: TraceFormat;
}

export interface SetTraceParams {
	value: TraceValues;
}

export namespace SetTraceNotification {
	export const type = new NotificationType<SetTraceParams>('$/setTrace');
}

export interface LogTraceParams {
	message: string;
	verbose?: string;
}

export namespace LogTraceNotification {
	export const type = new NotificationType<LogTraceParams>('$/logTrace');
}

export interface Tracer {
	log(dataObject: any): void;
	log(message: string, data?: string): void;
}

export type ConnectionStrategy = {
	cancelUndispatched?: (message: Message, next: (message: Message) => ResponseMessage | undefined) => ResponseMessage | undefined;
};

export namespace ConnectionStrategy {
	export function is(value: any): value is ConnectionStrategy {
		const candidate: ConnectionStrategy = value;
		return candidate && Is.func(candidate.cancelUndispatched);
	}
}

export type CancellationId = number | string;
export interface CancellationReceiverStrategy {
	createCancellationTokenSource(id: CancellationId): AbstractCancellationTokenSource;
	dispose?(): void;
}
export namespace CancellationReceiverStrategy {
	export const Message: CancellationReceiverStrategy = Object.freeze({
		createCancellationTokenSource(_: CancellationId): AbstractCancellationTokenSource {
			return new CancellationTokenSource();
		}
	});

	export function is(value: any): value is CancellationReceiverStrategy {
		const candidate: CancellationReceiverStrategy = value;
		return candidate && Is.func(candidate.createCancellationTokenSource);
	}
}

export interface CancellationSenderStrategy {
	sendCancellation(conn: MessageConnection, id: CancellationId): void;
	cleanup(id: CancellationId): void;
	dispose?(): void;
}
export namespace CancellationSenderStrategy {
	export const Message: CancellationSenderStrategy = Object.freeze({
		sendCancellation(conn: MessageConnection, id: CancellationId): void {
			conn.sendNotification(CancelNotification.type, { id });
		},
		cleanup(_: CancellationId): void { }
	});

	export function is(value: any): value is CancellationSenderStrategy {
		const candidate: CancellationSenderStrategy = value;
		return candidate && Is.func(candidate.sendCancellation) && Is.func(candidate.cleanup);
	}
}

export interface CancellationStrategy {
	receiver: CancellationReceiverStrategy;
	sender: CancellationSenderStrategy;
}
export namespace CancellationStrategy {
	export const Message: CancellationStrategy = Object.freeze({
		receiver: CancellationReceiverStrategy.Message,
		sender: CancellationSenderStrategy.Message
	});

	export function is(value: any): value is CancellationStrategy {
		const candidate: CancellationStrategy = value;
		return candidate && CancellationReceiverStrategy.is(candidate.receiver) && CancellationSenderStrategy.is(candidate.sender);
	}
}

export interface ConnectionOptions {
	cancellationStrategy?: CancellationStrategy
	connectionStrategy?: ConnectionStrategy
}
export namespace ConnectionOptions {
	export function is(value: any): value is ConnectionOptions {
		const candidate: ConnectionOptions = value;
		return candidate && (CancellationStrategy.is(candidate.cancellationStrategy) || ConnectionStrategy.is(candidate.connectionStrategy));
	}
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

	onProgress<P>(type: ProgressType<P>, token: string | number, handler: NotificationHandler<P>): Disposable;
	sendProgress<P>(type: ProgressType<P>, token: string | number, value: P): void;

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

export function createMessageConnection(messageReader: MessageReader, messageWriter: MessageWriter, options?: ConnectionOptions): MessageConnection {
	const logger: Logger =  ConsoleLogger;

	let sequenceNumber = 0;
	let notificationSequenceNumber = 0;
	let unknownResponseSequenceNumber = 0;
	const version: string = '2.0';

	let starRequestHandler: StarRequestHandler | undefined = undefined;
	const requestHandlers: { [name: string]: RequestHandlerElement | undefined } = Object.create(null);
	let starNotificationHandler: StarNotificationHandler | undefined = undefined;
	const notificationHandlers: { [name: string]: NotificationHandlerElement | undefined } = Object.create(null);
	const progressHandlers: Map<number | string, NotificationHandler1<any>> = new Map();

	let timer: RAL.ImmediateHandle | undefined;
	let messageQueue: MessageQueue = new LinkedMap<string, Message>();
	let responsePromises: { [name: string]: ResponsePromise } = Object.create(null);
	let knownCanceledRequests: Set<string | number> = new Set();
	let requestTokens: { [id: string]: AbstractCancellationTokenSource } = Object.create(null);

	let trace: Trace = Trace.Off;
	let traceFormat: TraceFormat = TraceFormat.Text;
	let tracer: Tracer | undefined;

	let state: ConnectionState = ConnectionState.New;
	const errorEmitter: Emitter<[Error, Message | undefined, number | undefined]> = new Emitter<[Error, Message | undefined, number | undefined]>();
	const closeEmitter: Emitter<void> = new Emitter<void>();
	const unhandledNotificationEmitter: Emitter<NotificationMessage> = new Emitter<NotificationMessage>();
	const unhandledProgressEmitter: Emitter<ProgressParams<any>> = new Emitter<ProgressParams<any>>();

	const disposeEmitter: Emitter<void> = new Emitter<void>();
	const cancellationStrategy = (options && options.cancellationStrategy) ? options.cancellationStrategy : CancellationStrategy.Message;


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

	function triggerMessageQueue(): void {
		if (timer || messageQueue.size === 0) {
			return;
		}
		timer = RAL().timer.setImmediate(() => {
			timer = undefined;
			processMessageQueue();
		});
	}

	function processMessageQueue(): void {
		if (messageQueue.size === 0) {
			return;
		}
		const message = messageQueue.shift()!;
		try {
			if (isRequestMessage(message)) {
				handleRequest(message);
			} else if (isNotificationMessage(message)) {
				handleNotification(message);
			} else if (isResponseMessage(message)) {
				handleResponse(message);
			} else {
				handleInvalidMessage(message);
			}
		} finally {
			triggerMessageQueue();
		}
	}

	const callback: DataCallback = (message) => {
		try {
			// We have received a cancellation message. Check if the message is still in the queue
			// and cancel it if allowed to do so.
			if (isNotificationMessage(message) && message.method === CancelNotification.type.method) {
				const cancelId = (message.params as CancelParams).id;
				const key = createRequestQueueKey(cancelId);
				const toCancel = messageQueue.get(key);
				if (isRequestMessage(toCancel)) {
					const strategy = options?.connectionStrategy;
					const response = (strategy && strategy.cancelUndispatched) ? strategy.cancelUndispatched(toCancel, cancelUndispatched) : cancelUndispatched(toCancel);
					if (response && (response.error !== undefined || response.result !== undefined)) {
						messageQueue.delete(key);
						response.id = toCancel.id;
						traceSendingResponse(response, message.method, Date.now());
						messageWriter.write(response);
						return;
					}
				}
				const tokenKey = String(cancelId);
				const cancellationToken = requestTokens[tokenKey];
				// The request is already running. Cancel the token
				if (cancellationToken !== undefined) {
					cancellationToken.cancel();
					traceReceivedNotification(message);
					return;
				} else {
					// Remember the cancel but still queue the message to
					// clean up state in process message.
					knownCanceledRequests.add(cancelId);
				}
			}
			addMessageToQueue(messageQueue, message);
		} finally {
			triggerMessageQueue();
		}
	};


	function handleRequest(requestMessage: RequestMessage) {
		if (isDisposed()) {
			// we return here silently since we fired an event when the
			// connection got disposed.
			return;
		}

		function reply(resultOrError: any | ResponseError<any>, method: string, startTime: number): void {
			const message: ResponseMessage = {
				jsonrpc: version,
				id: requestMessage.id
			};
			if (resultOrError instanceof ResponseError) {
				message.error = (<ResponseError<any>>resultOrError).toJson();
			} else {
				message.result = resultOrError === undefined ? null : resultOrError;
			}
			traceSendingResponse(message, method, startTime);
			messageWriter.write(message);
		}
		function replyError(error: ResponseError<any>, method: string, startTime: number) {
			const message: ResponseMessage = {
				jsonrpc: version,
				id: requestMessage.id,
				error: error.toJson()
			};
			traceSendingResponse(message, method, startTime);
			messageWriter.write(message);
		}
		function replySuccess(result: any, method: string, startTime: number) {
			// The JSON RPC defines that a response must either have a result or an error
			// So we can't treat undefined as a valid response result.
			if (result === undefined) {
				result = null;
			}
			const message: ResponseMessage = {
				jsonrpc: version,
				id: requestMessage.id,
				result: result
			};
			traceSendingResponse(message, method, startTime);
			messageWriter.write(message);
		}
		traceReceivedRequest(requestMessage);

		const element = requestHandlers[requestMessage.method];
		let type: MessageSignature | undefined;
		let requestHandler: GenericRequestHandler<any, any> | undefined;
		if (element) {
			type = element.type;
			requestHandler = element.handler;
		}
		const startTime = Date.now();
		if (requestHandler || starRequestHandler) {
			const tokenKey = String(requestMessage.id);
			const cancellationSource = cancellationStrategy.receiver.createCancellationTokenSource(tokenKey);
			if (requestMessage.id !== null && knownCanceledRequests.has(requestMessage.id)) {
				cancellationSource.cancel();
			}
			requestTokens[tokenKey] = cancellationSource;
			try {
				let handlerResult: any;
				if (requestHandler) {
					if (requestMessage.params === undefined) {
						if (type !== undefined && type.numberOfParams !== 0) {
							replyError(new ResponseError<void>(ErrorCodes.InvalidParams, `Request ${requestMessage.method} defines ${type.numberOfParams} params but received none.`), requestMessage.method, startTime);
							return;
						}
						handlerResult = requestHandler(cancellationSource.token);
					} else if (Array.isArray(requestMessage.params)) {
						if (type !== undefined && type.parameterStructures === ParameterStructures.byName) {
							replyError(new ResponseError<void>(ErrorCodes.InvalidParams, `Request ${requestMessage.method} defines parameters by name but received parameters by position`), requestMessage.method, startTime);
							return;
						}
						handlerResult = requestHandler(...requestMessage.params, cancellationSource.token);
					} else {
						if (type !== undefined && type.parameterStructures === ParameterStructures.byPosition) {
							replyError(new ResponseError<void>(ErrorCodes.InvalidParams, `Request ${requestMessage.method} defines parameters by position but received parameters by name`), requestMessage.method, startTime);
							return;
						}
						handlerResult = requestHandler(requestMessage.params, cancellationSource.token);
					}
				} else if (starRequestHandler) {
					handlerResult = starRequestHandler(requestMessage.method, requestMessage.params, cancellationSource.token);
				}

				const promise = handlerResult as Thenable<any | ResponseError<any>>;
				if (!handlerResult) {
					delete requestTokens[tokenKey];
					replySuccess(handlerResult, requestMessage.method, startTime);
				} else if (promise.then) {
					promise.then((resultOrError): any | ResponseError<any> => {
						delete requestTokens[tokenKey];
						reply(resultOrError, requestMessage.method, startTime);
					}, error => {
						delete requestTokens[tokenKey];
						if (error instanceof ResponseError) {
							replyError(<ResponseError<any>>error, requestMessage.method, startTime);
						} else if (error && Is.string(error.message)) {
							replyError(new ResponseError<void>(ErrorCodes.InternalError, `Request ${requestMessage.method} failed with message: ${error.message}`), requestMessage.method, startTime);
						} else {
							replyError(new ResponseError<void>(ErrorCodes.InternalError, `Request ${requestMessage.method} failed unexpectedly without providing any details.`), requestMessage.method, startTime);
						}
					});
				} else {
					delete requestTokens[tokenKey];
					reply(handlerResult, requestMessage.method, startTime);
				}
			} catch (error) {
				delete requestTokens[tokenKey];
				if (error instanceof ResponseError) {
					reply(<ResponseError<any>>error, requestMessage.method, startTime);
				} else if (error && Is.string(error.message)) {
					replyError(new ResponseError<void>(ErrorCodes.InternalError, `Request ${requestMessage.method} failed with message: ${error.message}`), requestMessage.method, startTime);
				} else {
					replyError(new ResponseError<void>(ErrorCodes.InternalError, `Request ${requestMessage.method} failed unexpectedly without providing any details.`), requestMessage.method, startTime);
				}
			}
		} else {
			replyError(new ResponseError<void>(ErrorCodes.MethodNotFound, `Unhandled method ${requestMessage.method}`), requestMessage.method, startTime);
		}
	}

	function handleResponse(responseMessage: ResponseMessage) {
		if (isDisposed()) {
			// See handle request.
			return;
		}

		if (responseMessage.id === null) {
			if (responseMessage.error) {
				logger.error(`Received response message without id: Error is: \n${JSON.stringify(responseMessage.error, undefined, 4)}`);
			} else {
				logger.error(`Received response message without id. No further error information provided.`);
			}
		} else {
			const key = String(responseMessage.id);
			const responsePromise = responsePromises[key];
			traceReceivedResponse(responseMessage, responsePromise);
			if (responsePromise) {
				delete responsePromises[key];
				try {
					if (responseMessage.error) {
						const error = responseMessage.error;
						responsePromise.reject(new ResponseError(error.code, error.message, error.data));
					} else if (responseMessage.result !== undefined) {
						responsePromise.resolve(responseMessage.result);
					} else {
						throw new Error('Should never happen.');
					}
				} catch (error) {
					if (error.message) {
						logger.error(`Response handler '${responsePromise.method}' failed with message: ${error.message}`);
					} else {
						logger.error(`Response handler '${responsePromise.method}' failed unexpectedly.`);
					}
				}
			}
		}

	}

	function handleNotification(message: NotificationMessage) {
		if (isDisposed()) {
			// See handle request.
			return;
		}
		let type: MessageSignature | undefined = undefined;
		let notificationHandler: GenericNotificationHandler | undefined;
		if (message.method === CancelNotification.type.method) {
			const cancelId = (message.params as CancelParams).id;
			knownCanceledRequests.delete(cancelId);
			traceReceivedNotification(message);
			return;
		} else {
			const element = notificationHandlers[message.method];
			if (element) {
				notificationHandler = element.handler;
				type = element.type;
			}
		}
		if (notificationHandler || starNotificationHandler) {
			try {
				traceReceivedNotification(message);
				if (notificationHandler) {
					if (message.params === undefined) {
						if (type !== undefined) {
							if (type.numberOfParams !== 0 && type.parameterStructures !== ParameterStructures.byName) {
								logger.error(`Notification ${message.method} defines ${type.numberOfParams} params but received none.`);
							}
						}
						notificationHandler();
					} else if (Array.isArray(message.params)) {
						if (type !== undefined) {
							if (type.parameterStructures === ParameterStructures.byName) {
								logger.error(`Notification ${message.method} defines parameters by name but received parameters by position`);
							}
							if (type.numberOfParams !== message.params.length) {
								logger.error(`Notification ${message.method} defines ${type.numberOfParams} params but received ${message.params.length} arguments`);
							}
						}
						notificationHandler(...message.params);
					} else {
						if (type !== undefined && type.parameterStructures === ParameterStructures.byPosition) {
							logger.error(`Notification ${message.method} defines parameters by position but received parameters by name`);
						}
						notificationHandler(message.params);
					}
				} else if (starNotificationHandler) {
					starNotificationHandler(message.method, message.params);
				}
			} catch (error) {
				if (error.message) {
					logger.error(`Notification handler '${message.method}' failed with message: ${error.message}`);
				} else {
					logger.error(`Notification handler '${message.method}' failed unexpectedly.`);
				}
			}
		} else {
			unhandledNotificationEmitter.fire(message);
		}
	}

	function handleInvalidMessage(message: Message) {
		if (!message) {
			logger.error('Received empty message.');
			return;
		}
		logger.error(`Received message which is neither a response nor a notification message:\n${JSON.stringify(message, null, 4)}`);
		// Test whether we find an id to reject the promise
		const responseMessage: ResponseMessage = message as ResponseMessage;
		if (Is.string(responseMessage.id) || Is.number(responseMessage.id)) {
			const key = String(responseMessage.id);
			const responseHandler = responsePromises[key];
			if (responseHandler) {
				responseHandler.reject(new Error('The received response has neither a result nor an error property.'));
			}
		}
	}

	function traceSendingRequest(message: RequestMessage): void {
		if (trace === Trace.Off || !tracer) {
			return;
		}

		if (traceFormat === TraceFormat.Text) {
			let data: string | undefined = undefined;
			if (trace === Trace.Verbose && message.params) {
				data = `Params: ${JSON.stringify(message.params, null, 4)}\n\n`;
			}
			tracer.log(`Sending request '${message.method} - (${message.id})'.`, data);
		} else {
			logLSPMessage('send-request', message);
		}
	}

	function traceSendingNotification(message: NotificationMessage): void {
		if (trace === Trace.Off || !tracer) {
			return;
		}

		if (traceFormat === TraceFormat.Text) {
			let data: string | undefined = undefined;
			if (trace === Trace.Verbose) {
				if (message.params) {
					data = `Params: ${JSON.stringify(message.params, null, 4)}\n\n`;
				} else {
					data = 'No parameters provided.\n\n';
				}
			}
			tracer.log(`Sending notification '${message.method}'.`, data);
		} else {
			logLSPMessage('send-notification', message);
		}
	}

	function traceSendingResponse(message: ResponseMessage, method: string, startTime: number): void {
		if (trace === Trace.Off || !tracer) {
			return;
		}

		if (traceFormat === TraceFormat.Text) {
			let data: string | undefined = undefined;
			if (trace === Trace.Verbose) {
				if (message.error && message.error.data) {
					data = `Error data: ${JSON.stringify(message.error.data, null, 4)}\n\n`;
				} else {
					if (message.result) {
						data = `Result: ${JSON.stringify(message.result, null, 4)}\n\n`;
					} else if (message.error === undefined) {
						data = 'No result returned.\n\n';
					}
				}
			}
			tracer.log(`Sending response '${method} - (${message.id})'. Processing request took ${Date.now() - startTime}ms`, data);
		} else {
			logLSPMessage('send-response', message);
		}
	}

	function traceReceivedRequest(message: RequestMessage): void {
		if (trace === Trace.Off || !tracer) {
			return;
		}

		if (traceFormat === TraceFormat.Text) {
			let data: string | undefined = undefined;
			if (trace === Trace.Verbose && message.params) {
				data = `Params: ${JSON.stringify(message.params, null, 4)}\n\n`;
			}
			tracer.log(`Received request '${message.method} - (${message.id})'.`, data);
		} else {
			logLSPMessage('receive-request', message);
		}
	}

	function traceReceivedNotification(message: NotificationMessage): void {
		if (trace === Trace.Off || !tracer || message.method === LogTraceNotification.type.method) {
			return;
		}

		if (traceFormat === TraceFormat.Text) {
			let data: string | undefined = undefined;
			if (trace === Trace.Verbose) {
				if (message.params) {
					data = `Params: ${JSON.stringify(message.params, null, 4)}\n\n`;
				} else {
					data = 'No parameters provided.\n\n';
				}
			}
			tracer.log(`Received notification '${message.method}'.`, data);
		} else {
			logLSPMessage('receive-notification', message);
		}
	}

	function traceReceivedResponse(message: ResponseMessage, responsePromise: ResponsePromise): void {
		if (trace === Trace.Off || !tracer) {
			return;
		}

		if (traceFormat === TraceFormat.Text) {
			let data: string | undefined = undefined;
			if (trace === Trace.Verbose) {
				if (message.error && message.error.data) {
					data = `Error data: ${JSON.stringify(message.error.data, null, 4)}\n\n`;
				} else {
					if (message.result) {
						data = `Result: ${JSON.stringify(message.result, null, 4)}\n\n`;
					} else if (message.error === undefined) {
						data = 'No result returned.\n\n';
					}
				}
			}
			if (responsePromise) {
				const error = message.error ? ` Request failed: ${message.error.message} (${message.error.code}).` : '';
				tracer.log(`Received response '${responsePromise.method} - (${message.id})' in ${Date.now() - responsePromise.timerStart}ms.${error}`, data);
			} else {
				tracer.log(`Received response ${message.id} without active response promise.`, data);
			}
		} else {
			logLSPMessage('receive-response', message);
		}
	}

	function logLSPMessage(type: LSPMessageType, message: RequestMessage | ResponseMessage | NotificationMessage): void {
		if (!tracer || trace === Trace.Off) {
			return;
		}

		const lspMessage = {
			isLSPMessage: true,
			type,
			message,
			timestamp: Date.now()
		};

		tracer.log(lspMessage);
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
		onNotification: (type: string | MessageSignature | StarNotificationHandler, handler?: GenericNotificationHandler): Disposable => {
			throwIfClosedOrDisposed();
			let method: string | undefined;
			if (Is.func(type)) {
				starNotificationHandler = type as StarNotificationHandler;
			} else if (handler) {
				if (Is.string(type)) {
					method = type;
					notificationHandlers[type] = { type: undefined, handler };
				} else {
					method = type.method;
					notificationHandlers[type.method] = { type, handler };
				}
			}
			return {
				dispose: () => {
					if (method !== undefined) {
						delete notificationHandlers[method];
					} else {
						starNotificationHandler = undefined;
					}
				}
			};
		},
		onProgress: <P>(_type: ProgressType<P>, token: string | number, handler: NotificationHandler<P>): Disposable => {
			if (progressHandlers.has(token)) {
				throw new Error(`Progress handler for token ${token} already registered`);
			}
			progressHandlers.set(token, handler);
			return {
				dispose: () => {
					progressHandlers.delete(token);
				}
			};
		},
		sendProgress: <P>(_type: ProgressType<P>, token: string | number, value: P): void => {
			connection.sendNotification(ProgressNotification.type, { token, value });
		},
		// sendRequest<R, E>(type: any, token?: CancellationToken): Promise<R> {

		// 	const request: RequestMessage = {
		// 		jsonrpc: '2.0',
		// 		id: 1,
		// 		method: 'example'
		// 	};

		// 	messageWriter.write(request);
		// },

		sendRequest: <R, E>(type: string | MessageSignature, ...args: any[]) => {
			throwIfClosedOrDisposed();
			throwIfNotListening();

			let method: string;
			let messageParams: object | [] | undefined;
			let token: CancellationToken | undefined = undefined;
			if (Is.string(type)) {
				method = type;
				const first: unknown = args[0];
				const last: unknown = args[args.length - 1];
				let paramStart: number = 0;
				let parameterStructures: ParameterStructures = ParameterStructures.auto;
				if (ParameterStructures.is(first)) {
					paramStart = 1;
					parameterStructures = first;
				}
				let paramEnd: number = args.length;
				if (CancellationToken.is(last)) {
					paramEnd = paramEnd - 1;
					token = last;
				}
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
							throw new Error(`Received ${numberOfParams} parameters for 'by Name' request parameter structure.`);
						}
						messageParams = args.slice(paramStart, paramEnd).map(value => undefinedToNull(value));
						break;
				}
			} else {
				const params = args;
				method = type.method;
				messageParams = computeMessageParams(type, params);
				const numberOfParams = type.numberOfParams;
				token = CancellationToken.is(params[numberOfParams]) ? params[numberOfParams] : undefined;
			}

			const id = sequenceNumber++;
			let disposable: Disposable;
			if (token) {
				disposable = token.onCancellationRequested(() => {
					cancellationStrategy.sender.sendCancellation(connection, id);
				});
			}
			const result = new Promise<R | ResponseError<E>>((resolve, reject) => {
				const requestMessage: RequestMessage = {
					jsonrpc: version,
					id: id,
					method: method,
					params: messageParams
				};

				const resolveWithCleanup = (r: any) => {
					resolve(r);
					cancellationStrategy.sender.cleanup(id);
					disposable?.dispose();

				};
				const rejectWithCleanup = (r: any) => {
					reject(r);
					cancellationStrategy.sender.cleanup(id);
					disposable?.dispose();
				};

				let responsePromise: ResponsePromise | null = { method: method, timerStart: Date.now(), resolve: resolveWithCleanup, reject: rejectWithCleanup };
				traceSendingRequest(requestMessage);
				try {
					messageWriter.write(requestMessage);
				} catch (e) {
					// Writing the message failed. So we need to reject the promise.
					responsePromise.reject(new ResponseError<void>(ErrorCodes.MessageWriteError, e.message ? e.message : 'Unknown reason'));
					responsePromise = null;
				}
				if (responsePromise) {
					responsePromises[String(id)] = responsePromise;
				}
			});
			return result;
		},

		onRequest: <R, E>(type: string | MessageSignature | StarRequestHandler, handler?: GenericRequestHandler<R, E>): Disposable => {
			throwIfClosedOrDisposed();

			let method: string | undefined | null = null;
			if (StarRequestHandler.is(type)) {
				method = undefined;
				starRequestHandler = type;
			} else if (Is.string(type)) {
				method = null;
				if (handler !== undefined) {
					method = type;
					requestHandlers[type] = { handler: handler, type: undefined };
				}
			} else {
				if (handler !== undefined) {
					method = type.method;
					requestHandlers[type.method] = { type, handler };
				}
			}
			return {
				dispose: () => {
					if (method === null) {
						return;
					}
					if (method !== undefined) {
						delete requestHandlers[method];
					} else {
						starRequestHandler = undefined;
					}
				}
			};
		},
		listen(): void {
			throwIfClosedOrDisposed();
			throwIfListening();

			state = ConnectionState.Listening;
			messageReader.listen(callback);
		},
		end: () => {
			messageWriter.end();
		},
		dispose: () => {
			if (isDisposed()) {
				return;
			}
			state = ConnectionState.Disposed;
			disposeEmitter.fire(undefined);
			const error = new Error('Connection got disposed.');
			Object.keys(responsePromises).forEach((key) => {
				responsePromises[key].reject(error);
			});
			responsePromises = Object.create(null);
			requestTokens = Object.create(null);
			knownCanceledRequests = new Set();
			messageQueue = new LinkedMap<string, Message>();
			// Test for backwards compatibility
			if (Is.func(messageWriter.dispose)) {
				messageWriter.dispose();
			}
			if (Is.func(messageReader.dispose)) {
				messageReader.dispose();
			}
		},
	}

	return connection;
}

