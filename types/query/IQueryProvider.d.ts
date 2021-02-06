import * as Node from "../nodes"
/**
 * The query provider responsible for interpreting and executing the query.
 *
 * The definition of "executing an expression tree" is specific to a query provider.
 * For example, it may involve translating the expression tree to a query language appropriate for an underlying data source.
 */
export default interface IQueryProvider {
    CreateQuery(expression: Node.Expression): void
}
