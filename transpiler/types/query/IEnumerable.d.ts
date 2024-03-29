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
 *
 * https://www.typescriptlang.org/docs/handbook/generics.html
 */
/**
 * Tuple can contain two values of different data types.
 */
export declare type Tuple<TFirts, TSecond> = [TFirts, TSecond]
/**
 * Action interface represents a function that accepts one argument and produces a result.
 *
 * Type parameters:
 *   T - the type of the input to the function
 *   R - the type of the result of the function
 */
export interface Action<T = any, R = any> {
    (val: T): R
}
/**
 * BiAction interface represents a function that accepts two arguments and produces a result.
 *
 * Type parameters:
 *   TFirst - the type of the input to the function
 *   TSecond - the type of the input to the function
 *   TReturn - the type of the result of the function
 */
export interface BiAction<TFirst = any, TSecond = any, TReturn = any> {
    (first: TFirst, second: TSecond): TReturn
}
export declare abstract class IEnumerable<T> {
    /**
     * Return iterator for current datasouce
     */
    abstract asyncIterator(): AsyncGenerator<unknown, unknown, unknown>
    iterator(): IterableIterator<T>
    /**
     * Return chainable iterator
     */
    abstract iterOfIter(): AsyncGenerator<T, unknown, T | unknown>
    /**
     * Return current 'async' iterator
     */
    [Symbol.asyncIterator](): AsyncGenerator<unknown, unknown, unknown>
    /**
     * Prevent default use of non asycn iterator
     */
    [Symbol.iterator](): IterableIterator<T>
    /**
     * Use the toArray method to create an array from results of a query.
     * Calling toArray also forces immediate execution of the query.
     */
    abstract toArray(): Promise<ArrayLike<any>>
    /**
     * Determines wheter a sequence contains any elements
     * @returns <code>true</code> if the source sequence contains any elements; otherwise, <code>false</code>.
     */
    abstract Any(): boolean
    /**
     * Gets the number of elements in the collection
     */
    abstract Count(): number
    /**
     * Filters a sequence of values based on a predicate.
     * @param predicate
     */
    abstract Where(predicate: Action<T, boolean>): IEnumerable<T>
    /**
     * Projects each element of a sequence into a new form.
     * @param selector
     */
    abstract Select<R>(selector: Action<T, R>): IEnumerable<R>
    /**
     * Return new Enumerable where first n elements are taken
     * @param count
     */
    abstract Take(count: number): IEnumerable<T>
    /**
     * Computes the sum of the sequence of that are obtained by invoking a transform
     * function on each element of the input sequence
     * @param action A transform function to apply to each element.
     */
    abstract Sum<R extends number>(action?: Action<T, R>): number
    /**
     * Produces a sequence of tuples with elements from the two specified sequences.
     * The function will only iterate over the smallest list passed
     *
     * @param other
     * @param transformer
     */
    abstract Zip<TSecond, TResult>(
        other: IEnumerable<TSecond>,
        transformer?: BiAction<T, TSecond, TResult>
    ): IEnumerable<TResult | Tuple<T, TSecond>>
}
