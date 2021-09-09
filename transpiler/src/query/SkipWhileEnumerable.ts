import {Action, BiAction, Enumerable, IterableDataSource} from "./internal"

export class SkipWhileEnumerable<TSource> extends Enumerable<TSource> {
    predicate: BiAction<TSource, number, boolean>

    results: TSource[]

    constructor(source: IterableDataSource<TSource>, predicate: BiAction<TSource, number, boolean>) {
        super(source)
        this.predicate = predicate
        this.results = []
    }

    push(item: TSource): void {
        if (this.state === "STARTED") {
            this.results.push(item)
        }
    }

    async *[Symbol.asyncIterator](): AsyncGenerator<TSource, unknown, unknown> {
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
            this.push(val)
            yield val
        }
        this.state = "COMPLETED"
        // TReturn = any
        return undefined
    }

    async toArray(): Promise<ArrayLike<TSource>> {
        if (this.state === "COMPLETED") {
            return this.results
        }

        for await (const item of this) {
            // NOOP to invoke evaluation
        }
        return this.results
    }
}
