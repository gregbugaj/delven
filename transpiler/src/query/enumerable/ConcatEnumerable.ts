import {Enumerable, IterableDataSource} from "../internal"

/**
 * Concatenate two iterable data sources
 */
export class ConcatEnumerable<TSource> extends Enumerable<TSource> {
    readonly secondSource: IterableDataSource<TSource>
    readonly results: TSource[] // results should have push,pop

    constructor(source: IterableDataSource<TSource>, secondSource: IterableDataSource<TSource>) {
        super(source)
        this.secondSource = secondSource
        this.results = []
    }

    async *[Symbol.asyncIterator](): AsyncGenerator<TSource, unknown> {
        this.state = "STARTED"
        for await (const val of this.source) {
            // T = unknown
            this.results.push(val)
            yield val
        }

        for await (const val of this.secondSource) {
            this.results.push(val)
            yield val
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
            // noop to force eval
        }
        return this.results
    }
}
