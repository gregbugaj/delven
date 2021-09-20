import {BiAction, Enumerable, IterableDataSource} from "../internal"

export class SkipWhileEnumerable<TSource> extends Enumerable<TSource> {
    readonly predicate: BiAction<TSource, number, boolean>
    readonly results: TSource[]

    constructor(source: IterableDataSource<TSource>, predicate: BiAction<TSource, number, boolean>) {
        super(source)
        this.predicate = predicate
        this.results = []
    }

    async *[Symbol.asyncIterator](): AsyncGenerator<TSource, unknown> {
        this.state = "STARTED"
        let index = 0
        let marked = false

        for await (const item of this.source) {
            const val = this.unwrap(item)
            const currentIndex = index++
            if (!marked) {
                if (this.predicate(val, currentIndex)) {
                    continue
                } else {
                    marked = true
                }
            }
            this.results.push(val)
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

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        for await (const item of this) {
            // NOOP to invoke evaluation
        }
        return this.results
    }
}
