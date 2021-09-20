import {Action, IQueryContext, IQueryable, IQueryProvider} from "../internal"

export class QueryProvider<T = unknown> implements IQueryProvider<T> {
    readonly context: IQueryContext

    constructor(context: IQueryContext) {
        this.context = context
    }

    Select<R>(selector: Action<T, R>): IQueryable<R> {
        return undefined
    }
}
