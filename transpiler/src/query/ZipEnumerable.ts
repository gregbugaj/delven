import {Tuple, Enumerable, BiAction, IterableDataSource} from "./internal"
import ArgumentNullException from "./ArgumentNullException"

export class ZipEnumerable<TFirst, TSecond, TResult> extends Enumerable<TResult | Tuple<TFirst, TSecond>> {
    readonly results: any[]
    readonly first: IterableDataSource<TFirst>
    readonly second: IterableDataSource<TSecond>
    readonly transformer: BiAction<TFirst, TSecond, TResult> | undefined

    constructor(
        first: IterableDataSource<TFirst>,
        second: IterableDataSource<TSecond>,
        transformer?: BiAction<TFirst, TSecond, TResult>
    ) {
        super(first)
        this.results = []
        this.first = this.source
        this.second = second
        this.transformer = transformer
    }

    async* [Symbol.asyncIterator](): AsyncGenerator<TResult | Tuple<TFirst, TSecond>, unknown, unknown> {
        this.state = "STARTED"
        if (this.first == undefined) {
            throw new ArgumentNullException("first should not be null")
        }
        if (this.second == undefined) {
            throw new ArgumentNullException("second should not be null")
        }

        const iter1 = this.first[Symbol.asyncIterator]()
        const iter2 = this.second[Symbol.asyncIterator]()

        while (true) {
            const first = await iter1.next()
            const second = await iter2.next()

            if (first == undefined || second == undefined) {
                break
            }
            if (first.done || second.done) {
                break
            }

            if (this.transformer === undefined) {
                yield [first.value, second.value] as Tuple<TFirst, TSecond>
            } else {
                yield this.transformer(first.value as TFirst, second.value as TSecond)
            }
        }

        this.state = "COMPLETED"
        return undefined
    }

    async toArray(): Promise<Array<TResult | Tuple<TFirst, TSecond>>> {
        if (this.state === "COMPLETED") {
            return this.results
        }

        // invokes our `async* [Symbol.asyncIterator]()`
        for await (const item of this) {
            this.results.push(item)
        }

        return this.results
    }
}
