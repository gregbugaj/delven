/**
 * Interface provides the ability to iterate through the collection by exposing
 * the different types of AsyncGenerator
 * 
 * LINQ provides two different behaviors of Query Execution –
 *   Deferred Execution 
 *   Immediate Execution
 *
 * Much of the API has been driven the original MS-LINQ implementation
 * 
 * https://github.com/microsoft/TypeScript/issues/25710
 * https://www.typescriptlang.org/docs/handbook/interfaces.html
 * https://docs.microsoft.com/en-us/dotnet/api/system.linq.iqueryable-1
 * 
 * Async Generators
 * 
 * https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-3.html
 * https://fnune.com/typescript/2020/07/31/typescript-series-4-poor-mans-async-await-in-typescript-using-generators/
 * https://javascript.info/async-iterators-generators
 * https://github.com/microsoft/TypeScript/issues/33458
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/yield
 */


/**
 * Action interface represents a function that accepts one argument and produces a result. 
 * 
 * Type parameters:
 *   T - the type of the input to the function
 *   R - the type of the result of the function
 */
export interface Action<T = any, R = any> {
  (val: T): R;
}

 export abstract class IEnumerable<T> {
  
  /**
   * Return iterator for current datasouce
   */
  asyncIterator(): AsyncGenerator<unknown, unknown, unknown>{
    throw new Error("Method not implemented");
  }

  iterator(): IterableIterator<T> {
    throw new Error("Method not implemented");
  }

  /**
   * Return chainable iterator
   */
  abstract iterOfIter(): AsyncGenerator<T, unknown, T | unknown>;

  /**
   * Return current 'async' iterator 
   */
  [Symbol.asyncIterator](): AsyncGenerator<unknown, unknown, unknown> {
    return this.asyncIterator();
  }

  /**
   * Prevent default use of non asycn iterator 
   */
  [Symbol.iterator](): IterableIterator<T> {
    return this.iterator();
  }

  /**
   * Use the toArray method to create an array from results of a query. 
   * Calling toArray also forces immediate execution of the query.
   */
  abstract toArray(): Promise<ArrayLike<any>> 
  
  /**
   * Determines wheter a sequence contains any elements
   * @returns <code>true</code> if the source sequence contains any elements; otherwise, <code>false</code>.
   */
  abstract Any(): boolean;

   /**
    * Gets the number of elements in the collection
    */
  abstract Count(): number;

  /**
   * Filters a sequence of values based on a predicate.
   * @param predicate 
   */
  abstract Where(predicate:Action<T, boolean>): IEnumerable<T>

  /**
   * Projects each element of a sequence into a new form.
   * @param selector 
   */
  abstract Select<R>(selector:Action<T, R>): IEnumerable<R>

  /**
   * Return new Enumerable where first n elements are taken
   * @param count 
   */
  abstract Take(count:number): IEnumerable<T>

  /**
   * Returns the sum of all data elements
   * @param action expression to transform the data
   */ 
  abstract Sum<R>(action?:Action<T, R>): number;

  /**
   * 
   * @param other 
   */
  abstract Zip<K,T>(other:IEnumerable<K>): IEnumerable<T>

  /*
  Sample Implemenation

   async * iterOfIter(): AsyncGenerator<number, unknown, unknown> {
        for (let i = 0; i < 5; ++i) {
            await sleep(100);
            yield* this.iter()
        }
        return;
    }

    async * iter(): AsyncGenerator<number, unknown, unknown> {
        for (let i = 0; i < 5; ++i) {
            await sleep(100);
            yield i;
        }
        return;
    }
  */
}

