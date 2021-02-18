import {Action, Enumerable} from "./internal"

export class WhereEnumerable<TSource> extends Enumerable<TSource> {
    predicate: Action<TSource, boolean>
    results: TSource[]
    executed: boolean

    constructor(soure: ArrayLike<TSource>, predicate: Action<TSource, boolean>) {
        super(soure)
        this.predicate = predicate
        this.results = []
        this.executed = false
    }

    async *asyncIterator(): AsyncGenerator<TSource, unknown, unknown> {
        for (let i = 0; i < this.source.length; ++i) {
            // T = unknown
            if (this.predicate(this.source[i])) {
                yield this.source[i]
            }
        }
        // TReturn = any
        return undefined
    }

    async toArray(): Promise<ArrayLike<TSource>> {
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
