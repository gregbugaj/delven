import {Action, Enumerable, identityAction, IterableDataSource} from "../internal"

export class SelectEnumerable<TSource, TResult> extends Enumerable<TResult> {
    readonly results: TResult[] // results should have push,pop
    readonly selector: Action<TSource, TResult>

    constructor(source: IterableDataSource<TSource>, selector: Action<TSource, TResult> = identityAction) {
        super(source)
        this.results = []
        this.selector = selector
    }

    async *[Symbol.asyncIterator](): AsyncGenerator<TResult, unknown> {
        for await (const val of this.source) {
            // T = unknown
            const ret: TResult = this.selector(this.unwrap(val))
            this.results.push(ret)
            yield ret
        }
        // TReturn = any
        return undefined
    }

    async toArray(): Promise<TResult[]> {
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
