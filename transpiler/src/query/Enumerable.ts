import ArgumentNullException from "./ArgumentNullException"
import InvalidOperationException from "./InvalidOperationException"
import {Tuple, IterableDataSource} from "./internal"
import {Action} from "./internal"
import {BiAction} from "./internal"
import {IEnumerable} from "./internal"
import {SelectEnumerable} from "./internal"
import {TakeEnumerable} from "./internal"
import {WhereEnumerable} from "./internal"
import {ZipEnumerable} from "./internal"
import {ConcatEnumerable} from "./internal"

/**
 * Default implementaion of IQueryable
 */

export function sleep(ms: number): Promise<number> {
    return new Promise(resolve => setTimeout(resolve, ms))
}

// https://stackoverflow.com/questions/39614311/class-constructor-type-in-typescript
// https://www.typescriptlang.org/docs/handbook/interfaces.html
export class Enumerable<T> extends IEnumerable<T> {
    readonly source: IterableDataSource<T>

    state: "NEW" | "STARTED" | "COMPLETED"

    constructor(source: IterableDataSource<T>) {
        super()
        this.source = source
        this.state = "NEW"
    }

    /**
     * Crate enumerable
     * @param source
     */
    static of<T>(source: IterableDataSource<T>): IEnumerable<T> {
        return new Enumerable(source)
    }

    Select<R>(selector: Action<T, R>): IEnumerable<R> {
        return new SelectEnumerable<T, R>(this.source, selector)
    }

    async Any(): Promise<boolean> {
        throw new Error("Method not implemented.")
    }

    async Count(): Promise<number> {
        // return this.source?.length
        throw new Error("Method not implemented.")
    }

    Where(predicate: Action<T, boolean>): IEnumerable<T> {
        return new WhereEnumerable(this.source, predicate)
    }

    Take(count: number): IEnumerable<T> {
        return new TakeEnumerable(this.source, count)
    }

    async First(predicate?: Action<T, boolean>): Promise<T> {
        if (this.source == undefined) {
            throw new ArgumentNullException("source should not be null")
        }
        if (typeof predicate === "undefined") {
            return this.source[0]
        } else {
            for await (let val of this.source) {
                if (predicate(val)) {
                    return val
                }
            }
        }
        throw new InvalidOperationException("No element satisfies the condition in predicate.")
    }

    async FirstOrDefault(predicate?: Action<T, boolean>): Promise<T> {
        const _defaults = (obj: any | null): void => {
            if (obj == null || obj == undefined) {
                return
            }
            const keys = Object.getOwnPropertyNames(obj)
            for (const key in keys) {
                const name = keys[key]
                if (obj[name] && typeof obj[name] === "object") {
                    _defaults(obj[name])
                } else if (typeof obj[name] === "string") {
                    obj[name] = ""
                } else if (typeof obj[name] === "number") {
                    obj[name] = 0
                } else {
                    throw new Error(`Unhandled type : ${typeof obj[name]}`)
                }
            }
        }

        const createDefaultFromObject = (src): T => {
            if (typeof src === "string") {
                return ("" as unknown) as T
            } else if (typeof src === "number") {
                return (0 as unknown) as T
            } else if (typeof src === "object") {
                const copy: T = Object.assign({}, src)
                _defaults(copy)
                return copy
            }
            throw new Error(`Unhandled conversion from object : ${typeof src}`)
        }

        try {
            return await this.First(predicate)
        } catch (e) {
            if (e instanceof InvalidOperationException) {
                return createDefaultFromObject(this.source[0])
            }
        }
        return (null as unknown) as T
    }

    async Sum(action?: Action<T, number>): Promise<number> {
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
        for await (let item of this.source) {
            const val = action(item)
            if (val == undefined) {
                continue
            }
            sum += val
        }
        return sum
    }

    Concat(secondSource: IterableDataSource<T>): IEnumerable<T> {
        return new ConcatEnumerable<T>(this.source, secondSource)
    }

    iter(): AsyncGenerator<T, unknown, unknown> {
        throw new Error("Method not implemented.")
    }

    iterOfIter(): AsyncGenerator<T, unknown, unknown> {
        throw new Error("Method not implemented.")
    }

    async *asyncIterator(): AsyncGenerator<T, unknown, unknown> {
        for await (let val of this.source) {
            yield val
        }
        return undefined
    }

    async toArray(): Promise<ArrayLike<T>> {
        let results: T[] = []
        for await (const item of this.asyncIterator()) {
            results.push(item)
        }
        return results
    }

    Zip<TSecond, TResult>(
        other: IEnumerable<TSecond>,
        transformer?: BiAction<T, TSecond, TResult>
    ): IEnumerable<TResult | Tuple<T, TSecond>> {
        return new ZipEnumerable<T, TSecond, TResult>(this, other, transformer)
    }
}
