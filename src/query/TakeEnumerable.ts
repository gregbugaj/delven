import {Enumerable, sleep} from "./internal"

export class TakeEnumerable<TSource> extends Enumerable<TSource> {
    results: TSource[]
    executed: boolean
    count: number

    constructor(source: ArrayLike<TSource>, count: number) {
        super(source)
        this.results = []
        this.executed = false
        this.count = count
    }

    async *asyncIterator(): AsyncGenerator<TSource, unknown, unknown> {
        for (let i = 0; i < Math.min(this.count, this.source.length); ++i) {
            await sleep(1000)
            yield this.source[i]
        }
        return undefined
    }

    async toArray(): Promise<ArrayLike<TSource>> {
        if (this.executed) {
            return Promise.resolve(this.results)
        }
        for await (const item of this.asyncIterator()) {
            this.results.push(item)
        }
        this.executed = true
        return Promise.resolve(this.results)
    }
}
