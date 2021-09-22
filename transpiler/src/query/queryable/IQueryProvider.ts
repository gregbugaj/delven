import {Action, BiAction, IQueryable, IterableDataSource, Tuple} from "../internal"

/**
 * The query provider responsible for interpreting and executing the query.
 *
 * The definition of "executing" is specific to a query provider.
 * For example, it may involve translating the expression tree to a query language appropriate for an underlying data source.
 */
export interface IQueryProvider<T> extends AsyncIterable<unknown>, Iterable<unknown> {
    /**
     * Return current 'async' iterator
     */
    [Symbol.asyncIterator](): AsyncGenerator<unknown, unknown>

    /**
     * Iterable interface
     */
    [Symbol.iterator](): Iterator<T>

    Select<R>(selector: Action<T, R>): IQueryable<R>

    SelectMany<R, K>(selector: Action<T, IterableDataSource<R>>, transform?: BiAction<T, R, K>): IQueryable<K>

    Where(predicate: Action<T, boolean>): IQueryable<T>

    Take(count: number): IQueryable<T>

    TakeWhile(predicate: BiAction<T, number, boolean>): IQueryable<T>

    Skip(count: number): IQueryable<T>

    Sum(action?: Action<T, number>): Promise<number>

    SkipWhile(action: BiAction<T, number, boolean>): IQueryable<T>

    toArray(): Promise<any[]>

    Concat(second: IterableDataSource<T>): IQueryable<T>

    First(predicate?: Action<T, boolean>): Promise<T>

    FirstOrDefault(predicate?: Action<T, boolean>): Promise<T>

    Zip<TSecond, TResult>(other: IterableDataSource<TSecond>, transformer?: BiAction<T, TSecond, TResult>): IQueryable<TResult | Tuple<T, TSecond>>

    All(predicate: Action<T, boolean>): Promise<boolean>
}
