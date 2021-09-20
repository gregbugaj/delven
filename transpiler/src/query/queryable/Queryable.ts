import {Action, BiAction, IterableDataSource, Tuple, IQueryable, IQueryProvider} from "../internal"

/**
 * Provides functionality to evaluate queries against a specific data source wherein the type of the data is known.
 */
export class Queryable<T> implements IQueryable<T> {
    readonly provider: IQueryProvider<T>

    constructor(provider: IQueryProvider<T>) {
        this.provider = provider
    }

    Select<R>(selector: Action<T, R>): IQueryable<R> {
        this.assertMethodPresent(Queryable.prototype.Select.name)
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
        this.assertMethodPresent(Queryable.prototype.Where.name)
        return this.provider.Where(predicate)
    }

    TakeWhile(predicate: BiAction<T, number, boolean>): IQueryable<T> {
        throw new Error("Method not implemented.")
    }

    async All(predicate: Action<T, boolean>): Promise<boolean> {
        throw new Error("Method not implemented.")
    }

    Take(count: number): IQueryable<T> {
        this.assertMethodPresent(Queryable.prototype.Take.name)
        return this.provider.Take(count)
    }

    Skip(count: number): IQueryable<T> {
        throw new Error("Method not implemented.")
    }

    SkipWhile(action: BiAction<T, number, boolean>): IQueryable<T> {
        throw new Error("Method not implemented.")
    }

    async First(predicate?: Action<T, boolean>): Promise<T> {
        this.assertMethodPresent(Queryable.prototype.First.name)
        return this.provider.First(predicate)
    }

    async FirstOrDefault(predicate?: Action<T, boolean>): Promise<T> {
        this.assertMethodPresent(Queryable.prototype.FirstOrDefault.name)
        return this.provider.FirstOrDefault(predicate)
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

    async toArray(): Promise<T[]> {
        this.assertMethodPresent(Queryable.prototype.toArray.name)
        return this.provider.toArray()
    }

    async* [Symbol.asyncIterator](): AsyncGenerator<T, unknown> {
        for await (const val of this.provider[Symbol.asyncIterator]()) {
            yield val as T
        }
        return undefined
    }

    /**
     * Check if object has specific method present and if not throw an Error
     * @param name the name of the method to check
     */
    assertMethodPresent(name: string): void {
        if (this.provider[name] === undefined) {
            throw new Error(`IQueryProvider does not implement : ${name}`)
        }
    }
}
