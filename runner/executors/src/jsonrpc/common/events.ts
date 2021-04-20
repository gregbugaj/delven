/**
 * Part of the code based on :
 * https://github.com/microsoft/vscode-languageserver-node/
 *
 */
import { Disposable } from "./disposable";


/**
 * Represents a typed event.
 */
export interface Event<T> {

  /**
   *
   * @param listener The listener function will be call when the event happens.
   * @param thisArgs The 'this' which will be used when calling the event listener.
   * @param disposables An array to which a {{IDisposable}} will be added. The
   * @return
  */
  (listener: (e: T) => any, thisArgs?: any, disposables?: Disposable[]): Disposable;
}


export namespace Event {
  const _disposable = { dispose() { } };
  export const None: Event<any> = function () { return _disposable; };
}
