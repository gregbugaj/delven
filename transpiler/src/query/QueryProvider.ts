import {IQueryable} from "./IQueryable"
import {IQueryContext} from "./IQueryContext"
import IQueryProvider from "./IQueryProvider"
import {Action} from "./types"

export class QueryProvider<T = unknown> implements IQueryProvider<T> {
    readonly context: IQueryContext

    constructor(context: IQueryContext) {
        this.context = context
    }

    Select<R>(selector: Action<T, R>): IQueryable<R> {
        return undefined
    }

}
