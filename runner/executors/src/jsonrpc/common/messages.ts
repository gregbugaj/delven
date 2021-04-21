/**
 * Protocol definition based on JSON-RPC and standarized to be compliant with Visual Studio Language Server
 * https://microsoft.github.io/language-server-protocol/specification
 * https://github.com/microsoft/vscode-languageserver-node
 */

import * as is from './is';

type integer = number

export interface Message {
  jsonrpc: string;
}

/**
 * Request message
 */
 export interface RequestMessage extends Message {

	/**
	 * The request id.
	 */
	id: number | string | null;

	/**
	 * The method to be invoked.
	 */
	method: string;

	/**
	 * The method's params.
	 */
	params?: any[] | object
}

/**
 * Predefined error codes.
 */
export namespace ErrorCodes {
	// Defined by JSON RPC
	export const ParseError: number = -32700;
	export const InvalidRequest: number = -32600;
	export const MethodNotFound: number = -32601;
	export const InvalidParams: number = -32602;
	export const InternalError: number = -32603;

	/**
	 * This is the start range of JSON RPC reserved error codes.
	 * It doesn't denote a real error code. No application error codes should
	 * be defined between the start and end range. For backwards
	 * compatibility the `ServerNotInitialized` and the `UnknownErrorCode`
	 * are left in the range.
	 *
	 * @since 3.16.0
	*/
	export const jsonrpcReservedErrorRangeStart: number = -32099;
	/** @deprecated use  jsonrpcReservedErrorRangeStart */
	export const serverErrorStart: number = jsonrpcReservedErrorRangeStart;

	export const MessageWriteError: number = -32099;
	export const MessageReadError: number = -32098;

	export const ServerNotInitialized: number = -32002;
	export const UnknownErrorCode: number = -32001;

	/**
	 * This is the end range of JSON RPC reserved error codes.
	 * It doesn't denote a real error code.
	 *
	 * @since 3.16.0
	*/
	export const jsonrpcReservedErrorRangeEnd = -32000;
	/** @deprecated use  jsonrpcReservedErrorRangeEnd */
	export const serverErrorEnd: number = jsonrpcReservedErrorRangeEnd;
}

export interface ResponseErrorLiteral<D> {
	/**
	 * A number indicating the error type that occured.
	 */
	code: number;

	/**
	 * A string providing a short decription of the error.
	 */
	message: string;

	/**
	 * A Primitive or Structured value that contains additional
	 * information about the error. Can be omitted.
	 */
	data?: D;
}

/**
 * An error object return in a response in case a request
 * has failed.
 */
export class ResponseError<D> extends Error {

	public readonly code: number;
	public readonly data: D | undefined;

	constructor(code: number, message: string, data?: D) {
		super(message);
		this.code = is.number(code) ? code : ErrorCodes.UnknownErrorCode;
		this.data = data;
		Object.setPrototypeOf(this, ResponseError.prototype);
	}

	public toJson(): ResponseErrorLiteral<D> {
		return {
			code: this.code,
			message: this.message,
			data: this.data,
		};
	}
}

/**
 * A response message.
 */
export interface ResponseMessage extends Message {
	/**
	 * The request id.
	 */
	id: number | string | null;

	/**
	 * The result of a request. This member is REQUIRED on success.
	 * This member MUST NOT exist if there was an error invoking the method.
	 */
	result?: string | number | boolean | object | any[] | null;

	/**
	 * The error object in case a request fails.
	 */
	error?: ResponseErrorLiteral<any>;
}



export class ParameterStructures {
	/**
	 * The parameter structure is automatically inferred on the number of parameters
	 * and the parameter type in case of a single param.
	 */
	public static readonly auto = new ParameterStructures('auto');

	/**
	 * Forces `byPosition` parameter structure. This is useful if you have a single
	 * parameter which has a literal type.
	 */
	public static readonly byPosition = new ParameterStructures('byPosition');

	/**
	 * Forces `byName` parameter structure. This is only useful when having a single
	 * parameter. The library will report errors if used with a different number of
	 * parameters.
	 */
	public static readonly byName = new ParameterStructures('byName');

	private constructor(private readonly kind: string) {
	}

	public static is(value: any): value is ParameterStructures {
		return value === ParameterStructures.auto || value === ParameterStructures.byName || value === ParameterStructures.byPosition;
	}

	public toString(): string {
		return this.kind;
	}
}

/**
 * An interface to type messages.
 */
export interface MessageSignature {
	readonly method: string;
	readonly numberOfParams: number;
	readonly parameterStructures: ParameterStructures;
}

/**
 * An abstract implementation of a MessageType.
 */
export abstract class AbstractMessageSignature implements MessageSignature {

	public readonly method: string;
	public readonly numberOfParams: number;

	constructor(method: string, numberOfParams: number) {
		this.method = method;
		this.numberOfParams = numberOfParams;
	}

	get parameterStructures(): ParameterStructures {
		return ParameterStructures.auto;
	}
}


/**
 * Notification Message
 */
 export interface NotificationMessage extends Message {
	/**
	 * The method to be invoked.
	 */
	method: string;

	/**
	 * The notification's params.
	 */
	params?: [] | object
}

export class NotificationType<P> extends AbstractMessageSignature {
	/**
	 * Clients must not use this property. It is here to ensure correct typing.
	 */
	public readonly _: [P, _EM] | undefined;
	constructor(method: string, private _parameterStructures: ParameterStructures = ParameterStructures.auto) {
		super(method, 1);
	}

	get parameterStructures(): ParameterStructures {
		return this._parameterStructures;
	}
}

export class NotificationType0 extends AbstractMessageSignature {
	/**
	 * Clients must not use this property. It is here to ensure correct typing.
	 */
	public readonly _: [_EM] | undefined;
	constructor(method: string) {
		super(method, 0);
	}
}

export class NotificationType1<P1> extends AbstractMessageSignature {
	/**
	 * Clients must not use this property. It is here to ensure correct typing.
	 */
	public readonly _: [P1, _EM] | undefined;
	constructor(method: string, private _parameterStructures: ParameterStructures = ParameterStructures.auto) {
		super(method, 1);
	}

	get parameterStructures(): ParameterStructures {
		return this._parameterStructures;
	}
}

export class NotificationType2<P1, P2> extends AbstractMessageSignature {
	/**
	 * Clients must not use this property. It is here to ensure correct typing.
	 */
	public readonly _: [P1, P2, _EM] | undefined;
	constructor(method: string) {
		super(method, 2);
	}
}

export class NotificationType3<P1, P2, P3> extends AbstractMessageSignature {
	/**
	 * Clients must not use this property. It is here to ensure correct typing.
	 */
	public readonly _: [P1, P2, P3, _EM] | undefined;
	constructor(method: string) {
		super(method, 3);
	}
}



/**
 * End marker interface for request and notification types.
 */
export interface _EM {
	_$endMarker$_: number;
}

/**
 * Classes to type request response pairs
 */
 export class RequestType0<R, E> extends AbstractMessageSignature {
	/**
	 * Clients must not use this property. It is here to ensure correct typing.
	 */
	public readonly _: [R, E, _EM] | undefined;
	constructor(method: string) {
		super(method, 0);
	}
}

export class RequestType<P, R, E> extends AbstractMessageSignature {
	/**
	 * Clients must not use this property. It is here to ensure correct typing.
	 */
	public readonly _: [P, R, E, _EM] | undefined;
	constructor(method: string, private _parameterStructures: ParameterStructures = ParameterStructures.auto) {
		super(method, 1);
	}

	get parameterStructures(): ParameterStructures {
		return this._parameterStructures;
	}
}


export class RequestType1<P1, R, E> extends AbstractMessageSignature {
	/**
	 * Clients must not use this property. It is here to ensure correct typing.
	 */
	public readonly _: [P1, R, E, _EM] | undefined;
	constructor(method: string, private _parameterStructures: ParameterStructures = ParameterStructures.auto) {
		super(method, 1);
	}

	get parameterStructures(): ParameterStructures {
		return this._parameterStructures;
	}
}
export class RequestType2<P1, P2, R, E> extends AbstractMessageSignature {
	/**
	 * Clients must not use this property. It is here to ensure correct typing.
	 */
	public readonly _: [P1, P2, R, E, _EM] | undefined;
	constructor(method: string) {
		super(method, 2);
	}
}

export class RequestType3<P1, P2, P3, R, E> extends AbstractMessageSignature {
	/**
	 * Clients must not use this property. It is here to ensure correct typing.
	 */
	public readonly _: [P1, P2, P3, R, E, _EM] | undefined;
	constructor(method: string) {
		super(method, 3);
	}
}

/**
 * To cancel a request, a notification message with the following properties is sent:
 * method: ‘$/cancelRequest’
 */
export interface CancelParams {
  /**
   * The request id to cancel.
   */
  id: integer | string;
}


/**
 * Class which represents server capabilities.
 */
export interface ServerCapabilities {

  /**
    * The servfer provides native code execution
    */
  canExecuteNative: boolean
}


export interface InitializeResult {
  /**
   * The capabilities the language server provides.
   */
  capabilities: ServerCapabilities;

  /**
   * Information about the server.
   */
  serverInfo?: {
    /**
     * The name of the server as defined by the server.
     */
    name: string;

    /**
     * The server's version as defined by the server.
     */
    version?: string;
  };
}

export interface CallbackFunction<T = any> {
  (event: T): void;
}

export type EvaluationResult = {
  exception?: string | Error | undefined
  stdout?: string
  stderr?: string
}


export type NotifierEvent = {
  id: string
  type: string
  payload?: any
}

// both the runner and explorer share this type
export type CompilationUnit = {
  id: string
  code: string,
  compileTime: number
  exception?: string
  ast?: any,
  generated?: string
}



/**
 * Tests if the given message is a request message
 */
 export function isRequestMessage(message: Message | undefined): message is RequestMessage {
	const candidate = <RequestMessage>message;
	return candidate && is.string(candidate.method) && (is.string(candidate.id) || is.number(candidate.id));
}

/**
 * Tests if the given message is a notification message
 */
export function isNotificationMessage(message: Message | undefined): message is NotificationMessage {
	const candidate = <NotificationMessage>message;
	return candidate && is.string(candidate.method) && (<any>message).id === void 0;
}

/**
 * Tests if the given message is a response message
 */
export function isResponseMessage(message: Message | undefined): message is ResponseMessage {
	const candidate = <ResponseMessage>message;
	return candidate && (candidate.result !== void 0 || !!candidate.error) && (is.string(candidate.id) || is.number(candidate.id) || candidate.id === null);
}
