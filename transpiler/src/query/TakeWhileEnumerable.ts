import {Action, BiAction, Enumerable, IterableDataSource} from "./internal"

export class TakeWhileEnumerable<TSource> extends Enumerable<TSource> {
    readonly predicate: BiAction<TSource, number, boolean>
    readonly results: TSource[]

    constructor(source: IterableDataSource<TSource>, predicate: BiAction<TSource, number, boolean>) {
        super(source)
        this.predicate = predicate
        this.results = []
    }

    private push(item: TSource): void {
        this.results.push(item)
    }

    async* [Symbol.asyncIterator](): AsyncGenerator<TSource, unknown, unknown> {
        this.state = "STARTED"
        let index = 0
        for await (const item of this.source) {
            const val = this.unwrap(item)
            if (!this.predicate(val, index++)) {
                return undefined
            }
            this.push(val)
            yield val
        }
        this.state = "COMPLETED"
        // TReturn = any
        return undefined
    }

    async toArray(): Promise<TSource[]> {
        if (this.state === "COMPLETED") {
            return this.results
        }

        for await (const item of this) {
            // NOOP to invoke evaluation
        }
        return this.results
    }
}
