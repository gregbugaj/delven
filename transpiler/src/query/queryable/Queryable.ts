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
        this.assertMethodPresent(Queryable.prototype.SelectMany.name)
        return this.provider.SelectMany(selector, transform)
    }

    async Any(predicate?: Action<T, boolean>): Promise<boolean> {
        this.assertMethodPresent(Queryable.prototype.Any.name)
        return this.provider.Any(predicate)
    }

    async Count(predicate?: Action<T, boolean>): Promise<number>{
        this.assertMethodPresent(Queryable.prototype.Count.name)
        return this.provider.Count(predicate)
    }

    Where(predicate: Action<T, boolean>): IQueryable<T> {
        this.assertMethodPresent(Queryable.prototype.Where.name)
        return this.provider.Where(predicate)
    }

    TakeWhile(predicate: BiAction<T, number, boolean>): IQueryable<T> {
        this.assertMethodPresent(Queryable.prototype.TakeWhile.name)
        return this.provider.TakeWhile(predicate)
    }

    async All(predicate: Action<T, boolean>): Promise<boolean> {
        this.assertMethodPresent(Queryable.prototype.All.name)
        return this.provider.All(predicate)
    }

    Take(count: number): IQueryable<T> {
        this.assertMethodPresent(Queryable.prototype.Take.name)
        return this.provider.Take(count)
    }

    Skip(count: number): IQueryable<T> {
        this.assertMethodPresent(Queryable.prototype.Skip.name)
        return this.provider.Skip(count)
    }

    SkipWhile(action: BiAction<T, number, boolean>): IQueryable<T> {
        this.assertMethodPresent(Queryable.prototype.Skip.name)
        return this.provider.SkipWhile(action)
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
        this.assertMethodPresent(Queryable.prototype.Sum.name)
        return this.provider.Sum(action)
    }

    Concat(second: IterableDataSource<T>): IQueryable<T> {
        this.assertMethodPresent(Queryable.prototype.Concat.name)
        return this.provider.Concat(second)
    }

    Zip<TSecond, TResult>(
        other: IterableDataSource<TSecond>,
        transformer?: BiAction<T, TSecond, TResult>
    ): IQueryable<TResult | Tuple<T, TSecond>> {
        this.assertMethodPresent(Queryable.prototype.Zip.name)
        return this.provider.Zip(other, transformer)
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

    [Symbol.iterator](): Iterator<T> {
        return this.provider[Symbol.iterator]()
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
