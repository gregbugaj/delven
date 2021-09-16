import IQueryProvider from "./IQueryProvider"
import {IQueryable} from "./IQueryable"
import {Action, BiAction, IterableDataSource, Tuple} from "./types"

/**
 * Provides functionality to evaluate queries against a specific data source wherein the type of the data is known.
 */
export default class Queryable<T> implements IQueryable<T> {
    readonly provider: IQueryProvider<T>

    constructor(provider: IQueryProvider<T>) {
        this.provider = provider
    }

    Select<R>(selector: Action<T, R>): IQueryable<R> {
        return this.provider.Select(selector)
    }

    SelectMany<R, K>(selector: Action<T, IterableDataSource<R>>, transform?: BiAction<T, R, K>): IQueryable<K> {
        throw new Error("Method not implemented.")
    }

    async Any(): Promise<boolean> {
        throw new Error("Method not implemented.")
    }

    async Count(): Promise<number> {
        // return this.source?.length
        throw new Error("Method not implemented.")
    }

    Where(predicate: Action<T, boolean>): IQueryable<T> {
        throw new Error("Method not implemented.")
    }

    TakeWhile(predicate: BiAction<T, number, boolean>): IQueryable<T> {
        throw new Error("Method not implemented.")
    }

    async All(predicate: Action<T, boolean>): Promise<boolean> {
        throw new Error("Method not implemented.")
    }


    Take(count: number): IQueryable<T> {
        throw new Error("Method not implemented.")
    }

    Skip(count: number): IQueryable<T> {
        throw new Error("Method not implemented.")
    }

    SkipWhile(action: BiAction<T, number, boolean>): IQueryable<T> {
        throw new Error("Method not implemented.")
    }

    async First(predicate?: Action<T, boolean>): Promise<T> {
        throw new Error("Method not implemented.")
    }

    async FirstOrDefault(action?: Action<T, boolean>): Promise<T> {
        throw new Error("Method not implemented.")
    }

    async Sum(action?: Action<T, number>): Promise<number> {
        throw new Error("Method not implemented.")
    }

    Concat(second: IterableDataSource<T>): IQueryable<T> {
        throw new Error("Method not implemented.")
    }

    Zip<TSecond, TResult>(
        other: IQueryable<TSecond>,
        transformer?: BiAction<T, TSecond, TResult>
    ): IQueryable<TResult | Tuple<T, TSecond>> {
        throw new Error("Method not implemented.")
    }

    async* [Symbol.asyncIterator](): AsyncGenerator<T, unknown> {
        throw new Error("Method not implemented.")
    }

    async toArray(): Promise<T[]> {
        throw new Error("Method not implemented.")
    }
}
