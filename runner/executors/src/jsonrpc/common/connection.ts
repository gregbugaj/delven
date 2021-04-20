/**
 * Connection handler
 */

import { CancellationToken } from "./cancellation";
import { InitializeResult } from "./protocol";

// export interface IConnectionHandler {
//   /**
//    *
//    * @param params
//    */
//   onInitialize(params: any): InitializeResult;
// }


export interface MessageConnection {

  // sendRequest<R, E>(type: RequestType0<R, E>, token?: CancellationToken): Promise<R>;
  sendRequest<R, E>(type: any, token?: CancellationToken): Promise<R>;

  listen(): void;
  end(): void;
  dispose(): void;
}
