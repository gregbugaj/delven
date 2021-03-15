import {IEnumerable, Enumerable} from "./internal"

export class ConcatEnumerable<TSource> extends Enumerable<TSource> {
    // readonly secondSource: ArrayLike<TSource> // source does not have to have push, pop
    readonly secondSource: IEnumerable<TSource>

    results: TSource[] // results should have push,pop
    state: "NEW" | "STARTED" | "COMPLETED"

    constructor(source: ArrayLike<TSource>, secondSource: IEnumerable<TSource>) {
        super(source)
        this.secondSource = secondSource
        this.results = []
        this.state = "NEW"
    }

    push(item: TSource): void {
        if (this.state === "STARTED") {
            this.results.push(item)
        }
    }

    async *asyncIterator(): AsyncGenerator<TSource, unknown, unknown> {
        this.state = "STARTED"
        for (let i = 0; i < this.source.length; ++i) {
            // T = unknown
            const retval: TSource = this.source[i]
            this.push(retval)
            yield retval
        }

        const si = this.secondSource.asyncIterator()
        for await (const item of si) {
            this.push(item)
            yield item
        }
        // TReturn = any
        this.state = "COMPLETED"
        return undefined
    }

    async toArray(): Promise<ArrayLike<TSource>> {
      console.info(this.state)
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
