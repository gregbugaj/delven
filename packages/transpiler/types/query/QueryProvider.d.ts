import {Expression} from "../nodes"
import {IQueryable} from "./IQueryable"
import {IQueryContext} from "./IQueryContext"
import IQueryProvider from "./IQueryProvider"
export declare class QueryProvider implements IQueryProvider {
    readonly context: IQueryContext
    constructor(context: IQueryContext)
    CreateQuery<T>(expression: Expression): IQueryable<T>
    Execute<T>(expression: Expression): T
}
