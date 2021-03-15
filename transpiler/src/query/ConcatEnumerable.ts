import {IEnumerable, Enumerable, IterableDataSource} from "./internal"

/**
 * Concatenate two iterable datasources
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

    async *asyncIterator(): AsyncGenerator<TSource, unknown, unknown> {
        this.state = "STARTED"
        for await (let val of this.source) {
            // T = unknown
            const retval: TSource = val
            this.push(retval)
            yield retval
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

    async toArray(): Promise<ArrayLike<TSource>> {
        if (this.state === "COMPLETED") {
            return Promise.resolve(this.results)
        }

        for await (const item of this.asyncIterator()) {
            // this.results.push(item)
            // noop to force eval
        }

        return Promise.resolve(this.results)
    }
}
