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