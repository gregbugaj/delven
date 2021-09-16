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
export type Tuple<TFirst, TSecond> = [TFirst, TSecond]

/**
 * Datasource that should be used with the IEnumerable
 */
export type IterableDataSource<TSource> = AsyncIterable<TSource> | Iterable<TSource> | TSource[]

/**
 * Action interface represents a function that accepts one argument and produces a result.
 *
 * Type parameters:
 *   T - the type of the input to the function
 *   R - the type of the result of the function
 */
export interface Action<T = unknown, R = unknown> {
    (val: T): R
}

export const identityAction = <T = unknown, R = unknown>(val: T): R => (val as unknown) as R

/**
 * BiAction interface represents a function that accepts two arguments and produces a result.
 *
 * Type parameters:
 *   TFirst - the type of the input to the function
 *   TSecond - the type of the input to the function
 *   TReturn - the type of the result of the function
 */
export interface BiAction<TFirst = unknown, TSecond = unknown, TReturn = unknown> {
    (first: TFirst, second: TSecond): TReturn
}

export abstract class IEnumerable<T=unknown> implements AsyncIterable<T> {
    /**
     * Return current 'async' iterator
     */
    abstract [Symbol.asyncIterator](): AsyncGenerator<T, unknown>
}