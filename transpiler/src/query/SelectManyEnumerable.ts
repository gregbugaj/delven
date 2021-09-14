import {Action, BiAction, Enumerable, IterableDataSource} from "./internal"

export class SelectManyEnumerable<TSource, TResult, K> extends Enumerable<K> {
    results: K[] // results should have push,pop
    collector: Action<TSource, IterableDataSource<TResult>>
    transform: BiAction<TSource, TResult, K>

    constructor(
        source: IterableDataSource<TSource>,
        collector: Action<TSource, IterableDataSource<TResult>>,
        transform?: BiAction<TSource, TResult, K>
    ) {
        super(source)
        this.results = []
        this.collector = collector
        this.transform = transform || ((x: TSource, y: any): K => y)
    }

    async* [Symbol.asyncIterator](): AsyncGenerator<K, unknown> {
        this.state = "STARTED"

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

        this.state = "COMPLETED"
        return undefined
    }

    async toArray(): Promise<K[]> {
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
