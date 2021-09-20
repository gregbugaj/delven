import {Action, IQueryable} from "../internal"

/**
 * The query provider responsible for interpreting and executing the query.
 *
 * The definition of "executing" is specific to a query provider.
 * For example, it may involve translating the expression tree to a query language appropriate for an underlying data source.
 */
export interface IQueryProvider<T> extends AsyncIterable<unknown> {
    /**
     * Return current 'async' iterator
     */
    [Symbol.asyncIterator](): AsyncGenerator<unknown, unknown>

    Select<R>(selector: Action<T, R>): IQueryable<R>

    Where(predicate: Action<T, boolean>): IQueryable<T>

    Take(count: number): IQueryable<T>

    toArray(): Promise<any[]>

    First(predicate?: Action<T, boolean>): Promise<T>
}
