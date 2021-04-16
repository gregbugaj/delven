/**
 * Connection handler
 */

import { InitializeResult } from "./protocol";

export interface IConnectionHandler {
  /**
   *
   * @param params
   */
  onInitialize(params: any): InitializeResult;
}

