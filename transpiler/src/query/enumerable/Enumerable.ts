import ArgumentNullException from "../ArgumentNullException"
import InvalidOperationException from "../InvalidOperationException"
import {
    Action,
    BiAction,
    IterableDataSource,
    Tuple,
    IEnumerable,
    ConcatEnumerable,
    SelectEnumerable,
    SelectManyEnumerable,
    SkipEnumerable,
    SkipWhileEnumerable,
    TakeEnumerable,
    TakeWhileEnumerable,
    WhereEnumerable,
    ZipEnumerable,
    IQueryable,
    Queryable,
    IQueryProvider
} from "../internal"

/**
 * Iterable type guard
 * @param x
 */
function isIterator(x: any): x is Iterable<unknown> {
    return Symbol.iterator in x
}

/**
 * Async iterator type guard
 * @param x
 */
function isAsyncIterator(x: any): x is AsyncGenerator<unknown> {
    return Symbol.asyncIterator in x
}

/**
 * Default implementation of IEnumerable
 *
 * https://stackoverflow.com/questions/39614311/class-constructor-type-in-typescript
 * https://www.typescriptlang.org/docs/handbook/interfaces.html
 */
export class Enumerable<T extends unknown> implements IEnumerable<T> {
    // source can be of any type and it should not be bound to type T
    readonly source: IterableDataSource<any>
    state: "NEW" | "STARTED" | "COMPLETED"
    private warn = false

    constructor(source: IterableDataSource<any>) {
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
        return typeof val === "function" ? val() : val
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

    /**
     * Projects each element of a sequence into a new form.
     * If no `selector` has been provided an identity function will be used to return a value
     * @param selector
     */
    Select<R>(selector: Action<T, R>): IEnumerable<R> {
        return new SelectEnumerable<T, R>(this, selector)
    }

    /**
     * Projects each element of a sequence to an IEnumerable and flattens the resulting sequences into one sequence.
     * If no `selector` has been provided an identity function will be used to return a value
     * @param selector
     * @param transform
     */
    SelectMany<R, K>(selector: Action<T, IterableDataSource<R>>, transform?: BiAction<T, R, K>): IEnumerable<K> {
        return new SelectManyEnumerable<T, R, K>(this, selector, transform)
    }

    /**
     * Determines whether a sequence contains any elements
     * @returns <code>true</code> if the source sequence contains any elements; otherwise, <code>false</code>.
     */
    async Any(): Promise<boolean> {
        throw new Error("Method not implemented.")
    }

    /**
     * Gets the number of elements in the collection
     */
    async Count(): Promise<number> {
        // return this.source?.length
        throw new Error("Method not implemented.")
    }

    /**
     * Filters a sequence of values based on a predicate.
     * @alias Array.filter
     * @param predicate a function to test each element for a condition
     * @returns
     */
    Where(predicate: Action<T, boolean>): IEnumerable<T> {
        return new WhereEnumerable(this, predicate)
    }

    /**
     * Returns elements from an Enumerable as long as a specified condition is true, and then skips the remaining elements
     * @param predicate a function to test each element for a condition
     * @returns An Enumerable that contains the elements from the input sequence before the predicate failed
     */
    TakeWhile(predicate: BiAction<T, number, boolean>): IEnumerable<T> {
        return new TakeWhileEnumerable(this, predicate)
    }

    /**
     * Determines whether all elements of a sequence satisfy a condition.
     * @param predicate A function to test each element for a condition.
     */
    async All(predicate: Action<T, boolean>): Promise<boolean> {
        for await (const item of this) {
            const val = this.unwrap(item)
            if (!predicate(val)) {
                return false
            }
        }
        return true
    }

    /**
     * Return new Enumerable where first n elements are taken
     *
     * @param count The number of elements to skip before returning the remaining elements.
     */
    Take(count: number): IEnumerable<T> {
        return new TakeEnumerable(this, count)
    }

    /**
     * Bypasses a specified number of elements in a sequence and then returns the remaining elements.
     *
     * @param count
     */
    Skip(count: number): IEnumerable<T> {
        return new SkipEnumerable(this, count)
    }

    /**
     * Bypasses elements in a sequence as long as a specified condition is true and then returns the remaining elements.
     * If predicate returns true for all elements in the sequence, an empty IEnumerable<T> is returned.
     *
     * @param action a function to test each element for a condition
     * @returns An Enumerable that contains the elements from the input sequence before the predicate failed
     */
    SkipWhile(action: BiAction<T, number, boolean>): IEnumerable<T> {
        return new SkipWhileEnumerable(this, action)
    }

    /**
     * Returns the first element of a sequence that satisfies a specified condition.
     * Method throws an exception if no matching element is found in source.
     * @param predicate A function to test each element for a condition.
     */
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

    /**
     * Returns the first element of the sequence that satisfies a condition or a default value if no such element is found.
     * @param action A function to test each element for a condition.
     */
    async FirstOrDefault(action?: Action<T, boolean>): Promise<T> {
        const _defaults = <K>(obj: K | null): void => {
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

    /**
     * Computes the sum of the sequence of that are obtained by invoking a transform
     * function on each element of the input sequence
     * @param action A transform function to apply to each element.
     */
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

    /**
     * Concatenates two sequences.
     * @param second
     */
    Concat(second: IterableDataSource<T>): IEnumerable<T> {
        return new ConcatEnumerable<T>(this, second)
    }

    /**
     * Produces a sequence of tuples with elements from the two specified sequences.
     * The function will only iterate over the smallest list passed
     *
     * @param other
     * @param transformer
     */
    Zip<TSecond, TResult>(
        other: Enumerable<TSecond>,
        transformer?: BiAction<T, TSecond, TResult>
    ): IEnumerable<TResult | Tuple<T, TSecond>> {
        return new ZipEnumerable<T, TSecond, TResult>(this, other as Enumerable<TSecond>, transformer)
    }

    /**
     * Default IEnumerable aka `AsyncIterable` implementation
     */
    async* [Symbol.asyncIterator](): AsyncGenerator<T, unknown> {
        if (this.warn && !isAsyncIterator(this.source)) {
            console.warn(`Source is not an isAsyncIterator: ${this.source}`)
        }

        for await (const val of this.source) {
            yield val as T
        }
        return undefined
    }

    /**
     * Return an generator for the current iterator, this allows us to use the `yield`  instead of implementing the
     * `next` method and having to trac the state
     */
    * [Symbol.iterator](): Iterator<T> {
        if (isIterator(this.source)) {
            for (const val of this.source) {
                yield val as T
            }
            return undefined
        }
        throw new InvalidOperationException("Source is not Iterable")
    }

    /**
     * Use the toArray method to create an array from results of a query.
     * Calling toArray also forces immediate execution of the query.
     *
     * ES5: ArrayLike was an acceptable type with ES6: Iterable is preferred as RHS assigment of 'for(let x of source)`
     * requires an iterable
     */
    async toArray(): Promise<T[]> {
        const results: T[] = []
        // calls internally 'sync *[Symbol.asyncIterator]()' via 'this'
        for await (const item of this) {
            results.push(item)
        }
        return results
    }

    AsQueryable(): IQueryable<T> {
        class _internal implements IQueryProvider<T> {
            private readonly delegate: IEnumerable<any>

            constructor(delegate: IEnumerable<any>) {
                this.delegate = delegate
            }

            Take(count: number): IQueryable<T> {
                return this.delegate.Take(count).AsQueryable()
            }

            [Symbol.asyncIterator](): AsyncGenerator<unknown, unknown> {
                return this.delegate[Symbol.asyncIterator]()
            }

            [Symbol.iterator](): Iterator<T> {
                return this.delegate[Symbol.iterator]()
            }

            Select<R>(selector: Action<T, R>): IQueryable<R> {
                return this.delegate.Select(selector).AsQueryable()
            }

            async toArray(): Promise<any[]> {
                return this.delegate.toArray()
            }

            Where(predicate: Action<T, boolean>): IQueryable<T> {
                return this.delegate.Where(predicate).AsQueryable()
            }

            First(predicate?: Action<T, boolean>): Promise<T> {
                return this.delegate.First(predicate)
            }

            FirstOrDefault(predicate?: Action<T, boolean>): Promise<T> {
                return this.delegate.FirstOrDefault(predicate)
            }

        }

        return new Queryable(new _internal(this))
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

        asEnumerable(): Enumerable<T>
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
