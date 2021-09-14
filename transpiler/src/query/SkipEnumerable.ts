import {Enumerable, IterableDataSource} from "./internal"

export class SkipEnumerable<TSource> extends Enumerable<TSource> {
    results: TSource[]
    count: number

    constructor(source: IterableDataSource<TSource>, count: number) {
        super(source)
        this.results = []
        this.count = count
    }

    push(item: TSource): void {
        if (this.state === "STARTED") {
            this.results.push(item)
        }
    }

    async *[Symbol.asyncIterator](): AsyncGenerator<TSource, unknown, unknown> {
        this.state = "STARTED"
        let index = 0
        for await (const item of this.source) {
            if (index++ < this.count) {
                continue
            }
            const val = this.unwrap(item)
            this.push(val)
            yield val
        }

        this.state = "COMPLETED"
        return undefined
    }

    async toArray(): Promise<TSource[]> {
        if (this.state === "COMPLETED") {
            return this.results
        }

        for await (const item of this) {
            // this.results.push(item)
            // noop to force eval
        }

        return this.results
    }
}
