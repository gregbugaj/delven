import * as Node from "../nodes";
import { IQueryable } from "./IQueryable";

/**
 * The query provider responsible for interpreting and executing the query.
 * 
 * The definition of "executing an expression tree" is specific to a query provider. 
 * For example, it may involve translating the expression tree to a query language appropriate for an underlying data source.
 */
export default interface IQueryProvider {

    /**
     * Create queries that are associated with the data source. 
     * @param expression 
     */
    CreateQuery<T>(expression: Node.Expression): IQueryable<T>

    /**
     * Execute method sends queries off to be executed.
     * @param expression 
     */
    Execute<T>(expression: Node.Expression): T;
}