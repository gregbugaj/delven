import ArgumentNullException from "./ArgumentNullException"
import InvalidOperationException from "./InvalidOperationException"
import {
    Action,
    BiAction,
    ConcatEnumerable,
    IEnumerable,
    IterableDataSource,
    SelectEnumerable,
    SelectManyEnumerable,
    SkipEnumerable,
    SkipWhileEnumerable,
    TakeEnumerable,
    TakeWhileEnumerable,
    Tuple,
    WhereEnumerable,
    ZipEnumerable
} from "./internal"

/**
 * Default implementation of IEnumerable
 *
 * https://stackoverflow.com/questions/39614311/class-constructor-type-in-typescript
 * https://www.typescriptlang.org/docs/handbook/interfaces.html
 */
export class Enumerable<T extends unknown> extends IEnumerable<T> {
    // source can be of any type and it should not be bound to type T
    readonly source:IterableDataSource<any>
    state: "NEW" | "STARTED" | "COMPLETED"

    constructor(source: IterableDataSource<any>) {
        super()
        this.source = source
        this.state = "NEW"
    }

    /**
     * Unwrap and evaluate item if it is an function
     *
     * @param val the value to unwrap
     * @returns val or evaluated function value
     */
    protected unwrap<K>(val: K): K {
        return (typeof val === "function") ? val() : val
    }

    /**
     * Crate enumerable from a IterableDataSource, ArrayLike or non ArrayLike value
     *
     * @param source
     */
    static of<T>(source: IterableDataSource<T> | T): IEnumerable<T> {
        const isIterable = <K>(obj: K) => {
            if (obj == null) return false
            return typeof obj[Symbol.iterator] === "function" || typeof obj[Symbol.asyncIterator] === "function"
        }
        if (isIterable(source)) {
            return new Enumerable(<IterableDataSource<T>>source)
        } else {
            return new Enumerable([source])
        }
    }

    Select<R>(selector: Action<T, R>): IEnumerable<R> {
        return new SelectEnumerable<T, R>(this, selector)
    }

    SelectMany<R, K>(selector: Action<T, IterableDataSource<R>>, transform?: BiAction<T, R, K>): IEnumerable<K> {
        return new SelectManyEnumerable<T, R, K>(this, selector, transform)
    }

    async Any(): Promise<boolean> {
        throw new Error("Method not implemented.")
    }

    async Count(): Promise<number> {
        // return this.source?.length
        throw new Error("Method not implemented.")
    }

    Where(predicate: Action<T, boolean>): IEnumerable<T> {
        return new WhereEnumerable(this, predicate)
    }

    TakeWhile(predicate: BiAction<T, number, boolean>): IEnumerable<T> {
        return new TakeWhileEnumerable(this, predicate)
    }

    async All(predicate: Action<T, boolean>): Promise<boolean> {
        for await (const item of this) {
            const val = this.unwrap(item)
            if (!predicate(val)) {
                return false
            }
        }
        return true
    }

    Take(count: number): IEnumerable<T> {
        return new TakeEnumerable(this, count)
    }

    Skip(count: number): IEnumerable<T> {
        return new SkipEnumerable(this, count)
    }

    SkipWhile(action: BiAction<T, number, boolean>): IEnumerable<T> {
        return new SkipWhileEnumerable(this, action)
    }

    async First(predicate?: Action<T, boolean>): Promise<T> {
        if (this.source == undefined) {
            throw new ArgumentNullException("source should not be null")
        }

        for await (const item of this) {
            const val = this.unwrap(item)
            if (typeof predicate === "undefined") {
                return val
            } else {
                if (predicate(val)) {
                    return val
                }
            }
        }
        throw new InvalidOperationException("No element satisfies the condition in predicate.")
    }

    async FirstOrDefault(action?: Action<T, boolean>): Promise<T> {
        const _defaults =<K> (obj: K | null): void => {
            if (obj == null) {
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

        // identity action
        if (typeof action === "undefined") {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            action = (arg: T): boolean => true
        }
        // TODO : The semantics here don't make sense, we need to make this one pass operation.
        try {
            return await this.First(action)
        } catch (e) {
            if (e instanceof InvalidOperationException) {
                for await (const item of this) {
                    if (item == undefined) {
                        continue
                    }
                    // Handle InvalidOperationException: No element satisfies the condition in predicate.
                    return createDefaultFromObject(item)
                }
            }
        }
        return (null as unknown) as T
    }

    async Sum(action?: Action<T, number>): Promise<number> {
        if (typeof action === "undefined") {
            // identity action
            action = (arg: T): number => {
                if (typeof arg === "number") {
                    return arg
                } else if (typeof arg === "string") {
                    return parseInt(arg)
                }
                throw new Error(`Unknown type for : ${typeof action}`)
            }
        }

        let sum = 0
        for await (const item of this) {
            const val = action(item)
            if (val == undefined) {
                continue
            }
            sum += val
        }
        return sum
    }

    Concat(second: IterableDataSource<T>): IEnumerable<T> {
        return new ConcatEnumerable<T>(this, second)
    }

    Zip<TSecond, TResult>(
        other: IEnumerable<TSecond>,
        transformer?: BiAction<T, TSecond, TResult>
    ): IEnumerable<TResult | Tuple<T, TSecond>> {
        // FIXME : Type of the `other` is not correct here
        return new ZipEnumerable<T, TSecond, TResult>(this, other as Enumerable<TSecond>, transformer)
    }

    /**
     * Default `AsyncIterable` implementation
     */
    async *[Symbol.asyncIterator](): AsyncGenerator<T, unknown> {
        for await (const val of this.source) {
            yield val as T
        }
        return undefined
    }

    async toArray(): Promise<T[]> {
        const results: T[] = []
        // calls internally 'sync *[Symbol.asyncIterator]()' via 'this'
        for await (const item of this) {
            results.push(item)
        }
        return results
    }
}

/**
 * Extension methods
 *  Until the global.d.ts is filed we have to have a mock import as such
 * import { Enumerable } from "../query/internal"
 * Enumerable.of([])
 *
 * And at this point we can use the extension methods
 *
 * let enumerable = [1, 2].asEnumerable();
 */

export {}
declare global {
    interface Array<T> {
        count(): number

        asEnumerable(): IEnumerable<T>
    }
}

if (!Array.prototype.asEnumerable) {
    Object.defineProperty(Array.prototype, "asEnumerable", {
        enumerable: false,
        writable: false,
        configurable: false,
        value: function asEnumerable() {
            return new Enumerable(this)
        }
    })
}
// Testing only
if (!Array.prototype.count) {
    Object.defineProperty(Array.prototype, "count", {
        enumerable: false,
        writable: false,
        configurable: false,
        value: function count() {
            return this.length
        }
    })
}
