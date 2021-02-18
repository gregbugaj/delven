import {Tuple} from "./IEnumerable"
import {Action} from "./internal"
import {BiAction} from "./internal"
import {IEnumerable} from "./internal"
import {SelectEnumerable} from "./internal"
import {TakeEnumerable} from "./internal"
import {WhereEnumerable} from "./internal"
import {ZipEnumerable} from "./internal"

/**
 * Default implementaion of IQueryable
 */

export function sleep(ms: number): Promise<number> {
    return new Promise(resolve => setTimeout(resolve, ms))
}

// https://stackoverflow.com/questions/39614311/class-constructor-type-in-typescript
// https://www.typescriptlang.org/docs/handbook/interfaces.html
export class Enumerable<T> extends IEnumerable<T> {
    readonly source: ArrayLike<T>

    constructor(source: ArrayLike<T>) {
        super()
        this.source = source
    }

    /**
     * Crate enumerable
     * @param source
     */
    static of<T>(source: ArrayLike<T>): IEnumerable<T> {
        return new Enumerable(source)
    }

    Select<R>(selector: Action<T, R>): IEnumerable<R> {
        return new SelectEnumerable<T, R>(this.source, selector)
    }

    Any(): boolean {
        throw new Error("Method not implemented.")
    }

    Count(): number {
        return this.source?.length
    }

    Where(predicate: Action<T, boolean>): IEnumerable<T> {
        return new WhereEnumerable(this.source, predicate)
    }

    Take(count: number): IEnumerable<T> {
        return new TakeEnumerable(this.source, count)
    }

    Sum(action?: Action<T, number>): number {
        if (typeof action === "undefined") {
            // identitity action
            const ident = (arg: T): number => {
                if (typeof arg === "number") {
                    return arg
                } else if (typeof arg === "string") {
                    return parseInt(arg)
                }
                throw new Error(`Unknow type for : ${typeof action}`)
            }
            action = ident
        }

        let sum = 0
        for (let i = 0; i < this.source.length; ++i) {
            const val = action(this.source[i])
            if (val == undefined) {
                continue
            }
            sum += val
        }
        return sum
    }

    iter(): AsyncGenerator<T, unknown, unknown> {
        throw new Error("Method not implemented.")
    }

    iterOfIter(): AsyncGenerator<T, unknown, unknown> {
        throw new Error("Method not implemented.")
    }

    async *asyncIterator(): AsyncGenerator<T, unknown, unknown> {
        for (let i = 0; i < this.source.length; ++i) {
            yield this.source[i]
        }
        return undefined
    }

    async toArray(): Promise<ArrayLike<T>> {
        return Promise.resolve(this.source)
    }

    Zip<TSecond, TResult>(
        other: IEnumerable<TSecond>,
        transformer?: BiAction<T, TSecond, TResult>
    ): IEnumerable<TResult | Tuple<T, TSecond>> {
        return new ZipEnumerable<T, TSecond, TResult>(this, other, transformer)
    }
}
