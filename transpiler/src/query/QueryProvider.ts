import {IQueryable} from "./IQueryable"
import {IQueryContext} from "./IQueryContext"
import IQueryProvider from "./IQueryProvider"
import Queryable from "./Queryable"

export class QueryProvider implements IQueryProvider {
    readonly context: IQueryContext

    constructor(context: IQueryContext) {
        this.context = context
    }

    CreateQuery<T>(): IQueryable<T> {
        return new Queryable<T>(this)
    }

    Execute<T>(): T {
        const query = this.CreateQuery()
        // this should invoke the iterator on teh crated expresisson
        return undefined
    }
}
