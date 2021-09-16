import {Action, Enumerable, IterableDataSource} from "./internal"

export class WhereEnumerable<TSource> extends Enumerable<TSource> {
    readonly predicate: Action<TSource, boolean>
    readonly results: TSource[]

    constructor(source: IterableDataSource<TSource>, predicate: Action<TSource, boolean>) {
        super(source)
        this.predicate = predicate
        this.results = []
    }

    async* [Symbol.asyncIterator](): AsyncGenerator<TSource, unknown, unknown> {
        this.state = "STARTED"
        for await (const item of this.source) {
            const val = this.unwrap(item)
            if (this.predicate(val)) {
                this.results.push(item)
                yield val
            }
        }
        this.state = "COMPLETED"
        // TReturn = any
        return undefined
    }

    async toArray(): Promise<TSource[]> {
        if (this.state === "COMPLETED") {
            return this.results
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        for await (const item of this) {
            // NOOP to invoke evaluation
        }
        return this.results
    }
}
