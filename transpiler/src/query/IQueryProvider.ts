import {IQueryable} from "./IQueryable"
import {Action} from "./types"

/**
 * The query provider responsible for interpreting and executing the query.
 *
 * The definition of "executing" is specific to a query provider.
 * For example, it may involve translating the expression tree to a query language appropriate for an underlying data source.
 */
export default interface IQueryProvider<T> {

    Select<R>(selector: Action<T, R>): IQueryable<R>

    // CreateQuery<T>(): IQueryable<T>
    // Execute<T>(): T
}
