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
export declare type Tuple<TFirst, TSecond> = [TFirst, TSecond];
/**
 * Datasource that should be used with the IEnumerable
 */
export declare type IterableDataSource<TSource> = Iterable<TSource> | AsyncIterable<TSource>;
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
export declare const identityAction: <T = any, R = any>(val: T) => R;
/**
 * BiAction interface represents a function that accepts two arguments and produces a result.
 *
 * Type parameters:
 *   TFirst - the type of the input to the function
 *   TSecond - the type of the input to the function
 *   TReturn - the type of the result of the function
 */
export interface BiAction<TFirst = any, TSecond = any, TReturn = any> {
    (first: TFirst, second: TSecond): TReturn;
}
export declare abstract class IEnumerable<T> {
    /**
     * Return async iterator for current datasource
     */
    /**
     * Return iterator for current datasource
     */
    /**
     * Return current 'async' iterator
     */
    abstract [Symbol.asyncIterator](): AsyncGenerator<unknown, unknown, unknown>;
    /**
     * Return current iterator by invoking the to
     */
    /**
     * Use the toArray method to create an array from results of a query.
     * Calling toArray also forces immediate execution of the query.
     */
    abstract toArray(): Promise<ArrayLike<any>>;
    /**
     * Determines whether a sequence contains any elements
     * @returns <code>true</code> if the source sequence contains any elements; otherwise, <code>false</code>.
     */
    abstract Any(): Promise<boolean>;
    /**
     * Gets the number of elements in the collection
     */
    abstract Count(): Promise<number>;
    /**
     * Filters a sequence of values based on a predicate.
     * @alias Array.filter
     * @param predicate a function to test each element for a condition
     * @returns
     */
    abstract Where(predicate: Action<T, boolean>): IEnumerable<T>;
    /**
     * Returns elements from an Enumerable as long as a specified condition is true, and then skips the remaining elements
     * @param predicate a function to test each element for a condition
     * @returns An Enumerable that contains the elements from the input sequence before the predicate failed
     */
    abstract TakeWhile(predicate: BiAction<T, number, boolean>): IEnumerable<T>;
    /**
     * Determines whether all elements of a sequence satisfy a condition.
     * @param predicate A function to test each element for a condition.
     */
    abstract All(predicate: Action<T, boolean>): Promise<boolean>;
    /**
     * Projects each element of a sequence into a new form.
     * If no `selector` has been provided an identity function will be used to return a value
     * @param selector
     */
    abstract Select<R>(selector?: Action<T, R>): IEnumerable<R>;
    /**
     * Projects each element of a sequence to an IEnumerable and flattens the resulting sequences into one sequence.
     * If no `selector` has been provided an idenity function will be used to return a value
     * @param selector
     * @param transform
     */
    abstract SelectMany<R, K = any>(selector: Action<T, IterableDataSource<R>>, transform?: BiAction<T, R, K>): IEnumerable<K>;
    /**
     * Concatenates two sequences.
     * @param selector
     */
    /**
     * Return new Enumerable where first n elements are taken
     *
     * @param count The number of elements to skip before returning the remaining elements.
     */
    abstract Take(count: number): IEnumerable<T>;
    /**
     * Bypasses a specified number of elements in a sequence and then returns the remaining elements.
     *
     * @param count
     */
    abstract Skip(count: number): IEnumerable<T>;
    /**
     * Bypasses elements in a sequence as long as a specified condition is true and then returns the remaining elements.
     * If predicate returns true for all elements in the sequence, an empty IEnumerable<T> is returned.
     *
     * @param predicate a function to test each element for a condition
     * @returns An Enumerable that contains the elements from the input sequence before the predicate failed
     */
    abstract SkipWhile(predicate: BiAction<T, number, boolean>): IEnumerable<T>;
    /**
     * Computes the sum of the sequence of that are obtained by invoking a transform
     * function on each element of the input sequence
     * @param action A transform function to apply to each element.
     */
    abstract Sum<R extends number>(action?: Action<T, R>): Promise<number>;
    /**
     * Returns the first element of a sequence that satisfies a specified condition.
     * Method throws an exception if no matching element is found in source.
     * @param predicate A function to test each element for a condition.
     */
    abstract First(predicate?: Action<T, boolean>): Promise<T>;
    /**
     * Returns the first element of the sequence that satisfies a condition or a default value if no such element is found.
     * @param predicate A function to test each element for a condition.
     */
    abstract FirstOrDefault(predicate?: Action<T, boolean>): Promise<T>;
    /**
     * Produces a sequence of tuples with elements from the two specified sequences.
     * The function will only iterate over the smallest list passed
     *
     * @param other
     * @param transformer
     */
    abstract Zip<TSecond, TResult>(other: IEnumerable<TSecond>, transformer?: BiAction<T, TSecond, TResult>): IEnumerable<TResult | Tuple<T, TSecond>>;
}
