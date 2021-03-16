import {Action, Enumerable, identityAction, IterableDataSource} from "./internal"

export class SelectEnumerable<TSource, TResult> extends Enumerable<TResult> {
    readonly selectable: IterableDataSource<TSource> // source does not have to have push, pop
    results: TResult[] // results should have push,pop
    executed: boolean
    selector: Action<TSource, TResult>

    constructor(source: IterableDataSource<TSource>, selector: Action<TSource, TResult> = identityAction) {
        super([])
        this.selectable = source
        this.results = []
        this.executed = false
        this.selector = selector
    }

    async *[Symbol.asyncIterator](): AsyncGenerator<TResult, unknown, unknown> {
        for await (let val of this.selectable) {
            // T = unknown
            const retval: TResult = this.selector(val)
            yield retval
        }
        // TReturn = any
        return undefined
    }

    async toArray(): Promise<ArrayLike<TResult>> {
        if (this.executed) {
            return this.results
        }
        for await (const item of this) {
            this.results.push(item)
        }
        this.executed = true
        return this.results
    }
}
