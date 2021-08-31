import { RequestType, RequestType0, NotificationType, NotificationType0, ProgressType, _EM, ParameterStructures } from 'delven-jsonrpc';
import { ProtocolRequestType } from './messages';

/**
 * The initialize parameters
 */
export interface _InitializeParams {
    /**
     * The process Id of the parent process that started
     * the server.
     */
    processId: number | null;

    /**
     * Information about the client
     *
     * @since 3.15.0
     */
    clientInfo?: {
        /**
         * The name of the client as defined by the client.
         */
        name: string;

        /**
         * The client's version as defined by the client.
         */
        version?: string;
    };

    /**
     * User provided initialization options.
     */
    initializationOptions?: any;

    /**
     * The initial trace setting. If omitted trace is disabled ('off').
     */
    trace?: 'off' | 'messages' | 'verbose';
}

export type InitializeParams = _InitializeParams;

/**
 * The result returned from an initialize request.
 */
export interface InitializeResult<T = any> {

    /**
     * The capabilities the language server provides.
     */
    capabilities: ServerCapabilities<T>;

    /**
     * Information about the server.
     *
     * @since 3.15.0
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

    /**
     * Custom initialization results.
     */
    [custom: string]: any;
}

/**
 * The server capabilities of a [ExecuteCommandRequest](#ExecuteCommandRequest).
 */
export interface ExecuteCommandOptions {
    /**
     * The commands to be executed on the server
     */
    commands: string[]
}

/**
 * Defines the capabilities provided by a language
 * server.
 */
export interface _ServerCapabilities<T = any> {
    /**
     * The server provides execute command support.
     */
    executeCommandProvider?: ExecuteCommandOptions;
}

export type ServerCapabilities<T = any> = _ServerCapabilities<T>;

/**
 * The data type of the ResponseError if the
 * initialize request fails.
 */
export interface InitializeError {
    /**
     * Indicates whether the client execute the following retry logic:
     * (1) show the message provided by the ResponseError to the user
     * (2) user selects retry or cancel
     * (3) if user selected retry the initialize method is sent again.
     */
    retry: boolean;
}

/**
 * The initialize request is sent from the client to the server.
 * It is sent once as the request after starting up the server.
 * The requests parameter is of type [InitializeParams](#InitializeParams)
 * the response if of type [InitializeResult](#InitializeResult) of a Thenable that
 * resolves to such.
 */
export namespace InitializeRequest {
    export const type = new ProtocolRequestType<InitializeParams, InitializeResult, never, InitializeError, void>('initialize');
}