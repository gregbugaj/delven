import {Enumerable, IterableDataSource} from "./internal"

/**
 * Concatenate two iterable data sources
 */
export class ConcatEnumerable<TSource> extends Enumerable<TSource> {
    readonly secondSource: IterableDataSource<TSource>
    results: TSource[] // results should have push,pop

    constructor(source: IterableDataSource<TSource>, secondSource: IterableDataSource<TSource>) {
        super(source)
        this.secondSource = secondSource
        this.results = []
    }

    push(item: TSource): void {
        if (this.state === "STARTED") {
            this.results.push(item)
        }
    }

    async* [Symbol.asyncIterator](): AsyncGenerator<TSource, unknown> {
        this.state = "STARTED"
        for await (const val of this.source) {
            // T = unknown
            this.push(val)
            yield val
        }

        const si = this.secondSource
        for await (const item of si) {
            this.push(item)
            yield item
        }
        // TReturn = any
        this.state = "COMPLETED"
        return undefined
    }

    async toArray(): Promise<TSource[]> {
        if (this.state === "COMPLETED") {
            return this.results
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        for await (const item of this) {
            // this.results.push(item)
            // noop to force eval
        }
        return this.results
    }
}
