import {Action, Enumerable, IterableDataSource} from "./internal"

export class WhereEnumerable<TSource> extends Enumerable<TSource> {
    predicate: Action<TSource, boolean>
    results: TSource[]

    constructor(source: IterableDataSource<TSource>, predicate: Action<TSource, boolean>) {
        super(source)
        this.predicate = predicate
        this.results = []
    }

    push(item: TSource): void {
        if (this.state === "STARTED") {
            this.results.push(item)
        }
    }

    async *asyncIterator(): AsyncGenerator<TSource, unknown, unknown> {
        this.state = "STARTED"
        for await (let val of this.source) {
            if (this.predicate(val)) {
                this.push(val)
                yield val
            }
        }
        this.state = "COMPLETED"
        // TReturn = any
        return undefined
    }

    async toArray(): Promise<ArrayLike<TSource>> {
        if (this.state === "COMPLETED") {
            return this.results
        }

        for await (const item of this.asyncIterator()) {
            // NOOP to invoke evaluation
        }
        return this.results
    }
}
