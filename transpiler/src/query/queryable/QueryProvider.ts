import {Action, IQueryContext, IQueryable, IQueryProvider, IterableDataSource, BiAction, Tuple} from "../internal"

export class QueryProvider<T = unknown> implements IQueryProvider<T> {
    readonly context: IQueryContext

    constructor(context: IQueryContext) {
        this.context = context
    }

    async Count(predicate?: Action<T, boolean>): Promise<number> {
        throw new Error("Method not implemented.")
    }

    async Any(predicate?: Action<T, boolean>): Promise<boolean> {
        throw new Error("Method not implemented.")
    }

    async Contains(value: unknown): Promise<boolean> {
        throw new Error("Method not implemented.")
    }

    [Symbol.asyncIterator](): AsyncGenerator<unknown, unknown> {
        throw new Error("Not yet implemented")
    }

    [Symbol.iterator](): Iterator<T> {
        throw new Error("Not yet implemented")
    }

    Select<R>(selector: Action<T, R>): IQueryable<R> {
        throw new Error("Not yet implemented")
    }

    SelectMany<R, K>(selector: Action<T, IterableDataSource<R>>, transform?: BiAction<T, R, K>): IQueryable<K> {
        throw new Error("Not yet implemented")
    }

    Take(count: number): IQueryable<T> {
        throw new Error("Not yet implemented")
    }

    TakeWhile(predicate: BiAction<T, number, boolean>): IQueryable<T> {
        throw new Error("Not yet implemented")
    }

    Skip(count: number): IQueryable<T> {
        throw new Error("Not yet implemented")
    }

    SkipWhile(action: BiAction<T, number, boolean>): IQueryable<T> {
        throw new Error("Not yet implemented")
    }

    async Sum(action?: Action<T, number>): Promise<number> {
        throw new Error("Not yet implemented")
    }

    async toArray(): Promise<any[]> {
        throw new Error("Not yet implemented")
    }

    Where(predicate: Action<T, boolean>): IQueryable<T> {
        throw new Error("Not yet implemented")
    }

    Concat(second: IterableDataSource<T>): IQueryable<T> {
        throw new Error("Not yet implemented")
    }

    async First(predicate?: Action<T, boolean>): Promise<T> {
        throw new Error("Not yet implemented")
    }

    async FirstOrDefault(predicate?: Action<T, boolean>): Promise<T> {
        throw new Error("Not yet implemented")
    }

    Zip<TSecond, TResult>(other: IterableDataSource<TSecond>, transformer?: BiAction<T, TSecond, TResult>): IQueryable<TResult | Tuple<T, TSecond>> {
        throw new Error("Not yet implemented")
    }

    async All(predicate: Action<T, boolean>): Promise<boolean> {
        throw new Error("Not yet implemented")
    }
}
