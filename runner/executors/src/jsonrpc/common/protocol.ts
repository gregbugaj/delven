/**
 * Protocol definition based on JSON-RPC and standarized to be compliant with Visual Studio Language Server
 * https://microsoft.github.io/language-server-protocol/specification
 * https://github.com/microsoft/vscode-languageserver-node
 */

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


