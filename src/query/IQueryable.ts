/**
 * Provides functionality to evaluate queries against a specific data source
 *
 * https://github.com/microsoft/TypeScript/issues/25710
 * https://www.typescriptlang.org/docs/handbook/interfaces.html
 *
 * Async Generators
 * https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-3.html
 *
 * https://javascript.info/async-iterators-generators
 *
 * https://github.com/microsoft/TypeScript/issues/33458
 */

export abstract class IQueryable<T> {
  /**
   * Return iterator for current datasouce
   */
  abstract iter(): AsyncGenerator<T, unknown, T | unknown>;

  /**
   * Return chainable iterator
   */
  abstract iterOfIter(): AsyncGenerator<T, unknown, T | unknown>;

  /**
   * Return current 'async' iterator 
   */
  [Symbol.asyncIterator](): AsyncGenerator<T, unknown, unknown> {
    return this.iter();
  }

  /**
   * Prevent default use of non asycn iterator 
   */
  [Symbol.iterator](): IterableIterator<T> {
    throw new Error("Non 'async' iterators not suppoerted");
  }
}