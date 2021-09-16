/**
 * Provides functionality to evaluate queries against a specific data source
 *
 * Much of the API has been driven by the original LINQ API design
 *
 * https://github.com/microsoft/TypeScript/issues/25710
 * https://www.typescriptlang.org/docs/handbook/interfaces.html
 * https://docs.microsoft.com/en-us/dotnet/api/system.linq.iqueryable-1
 */

/**
 * This interface represents remote queryable datasource
 */
import {Tuple, IterableDataSource, Action, BiAction, identityAction} from "./types"

export interface IQueryable<T> extends AsyncIterable<unknown> {

    /**
     * Return current 'async' iterator
     */
    [Symbol.asyncIterator](): AsyncGenerator<unknown, unknown>

    /**
     * Use the toArray method to create an array from results of a query.
     * Calling toArray also forces immediate execution of the query.
     *
     * ES5: ArrayLike was an acceptable type with ES6: Iterable is preferred as RHS assigment of 'for(let x of source)`
     * requires an iterable
     */
    toArray(): Promise<any[]>

    /**
     * Determines whether a sequence contains any elements
     * @returns <code>true</code> if the source sequence contains any elements; otherwise, <code>false</code>.
     */
    Any(): Promise<boolean>

    /**
     * Gets the number of elements in the collection
     */
    Count(): Promise<number>

    /**
     * Filters a sequence of values based on a predicate.
     * @alias Array.filter
     * @param predicate a function to test each element for a condition
     * @returns
     */
    Where(predicate: Action<T, boolean>): IQueryable<T>

    /**
     * Returns elements from an Enumerable as long as a specified condition is true, and then skips the remaining elements
     * @param predicate a function to test each element for a condition
     * @returns An Enumerable that contains the elements from the input sequence before the predicate failed
     */
    TakeWhile(predicate: BiAction<T, number, boolean>): IQueryable<T>

    /**
     * Determines whether all elements of a sequence satisfy a condition.
     * @param predicate A function to test each element for a condition.
     */
    All(predicate: Action<T, boolean>): Promise<boolean>

    /**
     * Projects each element of a sequence into a new form.
     * If no `selector` has been provided an identity function will be used to return a value
     * @param selector
     */
    Select<R>(selector?: Action<T, R>): IQueryable<R>

    /**
     * Projects each element of a sequence to an IEnumerable and flattens the resulting sequences into one sequence.
     * If no `selector` has been provided an identity function will be used to return a value
     * @param selector
     * @param transform
     */
    SelectMany<R, K = unknown>(
        selector: Action<T, IterableDataSource<R>>,
        transform?: BiAction<T, R, K>
    ): IQueryable<K>

    /**
     * Concatenates two sequences.
     * @param second
     */
    Concat(second: IterableDataSource<T>): IQueryable<T>

    /**
     * Return new Enumerable where first n elements are taken
     *
     * @param count The number of elements to skip before returning the remaining elements.
     */
    Take(count: number): IQueryable<T>

    /**
     * Bypasses a specified number of elements in a sequence and then returns the remaining elements.
     *
     * @param count
     */
    Skip(count: number): IQueryable<T>

    /**
     * Bypasses elements in a sequence as long as a specified condition is true and then returns the remaining elements.
     * If predicate returns true for all elements in the sequence, an empty IEnumerable<T> is returned.
     *
     * @param action a function to test each element for a condition
     * @returns An Enumerable that contains the elements from the input sequence before the predicate failed
     */
    SkipWhile(action: BiAction<T, number, boolean>): IQueryable<T>

    /**
     * Computes the sum of the sequence of that are obtained by invoking a transform
     * function on each element of the input sequence
     * @param action A transform function to apply to each element.
     */
    Sum<R extends number>(action?: Action<T, R>): Promise<number>

    /**
     * Returns the first element of a sequence that satisfies a specified condition.
     * Method throws an exception if no matching element is found in source.
     * @param predicate A function to test each element for a condition.
     */
    First(predicate?: Action<T, boolean>): Promise<T>

    /**
     * Returns the first element of the sequence that satisfies a condition or a default value if no such element is found.
     * @param predicate A function to test each element for a condition.
     */
    //  abstract FirstOrDefault(predicate?: Action<T, boolean> | Action<T, Tuple<boolean, T>>): T
    FirstOrDefault(predicate?: Action<T, boolean>): Promise<T>

    /**
     * Produces a sequence of tuples with elements from the two specified sequences.
     * The function will only iterate over the smallest list passed
     *
     * @param other
     * @param transformer
     */
    Zip<TSecond, TResult>(
        other: IQueryable<TSecond>,
        transformer?: BiAction<T, TSecond, TResult>
    ): IQueryable<TResult | Tuple<T, TSecond>>
}

