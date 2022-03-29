import {Action, BiAction, Enumerable, identityAction, IterableDataSource} from "./internal"

export class SelectManyEnumerable<TSource, TResult, K> extends Enumerable<K> {
    results: K[] // results should have push,pop
    executed: boolean
    collector: Action<TSource, IterableDataSource<TResult>>
    transform: BiAction<TSource, TResult, K>

    constructor(
        source: IterableDataSource<TSource>,
        collector: Action<TSource, IterableDataSource<TResult>>,
        transform?: BiAction<TSource, TResult, K>
    ) {
        super(source)
        this.results = []
        this.executed = false
        this.collector = collector
        this.transform = transform || ((x: TSource, y: any): K => y)
    }

    async *[Symbol.asyncIterator](): AsyncGenerator<K, unknown, unknown> {
        for await (const val of this.source) {
            // T = unknown
            const source = this.unwrap(val)
            const retval = this.collector(source)
            if (Array.isArray(retval)) {
                for await (const col of retval) {
                    yield this.transform(source, col)
                }
            } else {
                throw new Error("Collector did not return an arraylike object")
                // yield this.transform (source, retval)
            }
        }
        // TReturn = any
        return undefined
    }

    async toArray(): Promise<ArrayLike<K>> {
        if (this.executed) {
            return this.results
        }
        for await (const item of this) {
            this.results.push(item)
        }
        this.executed = true
        return this.results
    }
}
