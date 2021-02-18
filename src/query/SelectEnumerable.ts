import {Action, Enumerable} from "./internal"

export class SelectEnumerable<TSource, TResult> extends Enumerable<TResult> {
    readonly selectable: ArrayLike<TSource> // source does not have to have push, pop
    results: TResult[] // results should have push,pop
    executed: boolean
    selector: Action<TSource, TResult>

    constructor(source: ArrayLike<TSource>, selector: Action<TSource, TResult>) {
        super([])
        this.selectable = source
        this.results = []
        this.executed = false
        this.selector = selector
    }

    async *asyncIterator(): AsyncGenerator<TResult, unknown, unknown> {
        for (let i = 0; i < this.selectable.length; ++i) {
            // T = unknown
            const retval: TResult = this.selector(this.selectable[i])
            yield retval
        }
        // TReturn = any
        return undefined
    }

    async toArray(): Promise<ArrayLike<TResult>> {
        if (this.executed) {
            return Promise.resolve(this.results)
        }
        for await (const item of this.asyncIterator()) {
            this.results.push(item)
        }
        this.executed = true
        return Promise.resolve(this.results)
    }
}
