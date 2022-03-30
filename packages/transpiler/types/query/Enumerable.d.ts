import { Action, BiAction, IEnumerable, IterableDataSource, Tuple } from "./internal";
/**
 * Default implementation of IQueryable
 */
export declare function sleep(ms: number): Promise<number>;
export declare class Enumerable<T> extends IEnumerable<T> {
    readonly source: IterableDataSource<any>;
    state: "NEW" | "STARTED" | "COMPLETED";
    constructor(source: IterableDataSource<any>);
    /**
     * Unwrap and evaluate item
     * @param val the value to unwrap
     * @returns val or evaluated function value
     */
    protected unwrap(val: any): any;
    /**
     * Crate enumerable from a IterableDataSource or non ArrayLike value
     * @param source
     */
    static of<T>(source: IterableDataSource<T> | T): IEnumerable<T>;
    Select<R>(selector: Action<T, R>): IEnumerable<R>;
    SelectMany<R, K>(selector: Action<T, IterableDataSource<R>>, transform?: BiAction<T, R, K>): IEnumerable<K>;
    Any(): Promise<boolean>;
    Count(): Promise<number>;
    Where(predicate: Action<T, boolean>): IEnumerable<T>;
    TakeWhile(predicate: BiAction<T, number, boolean>): IEnumerable<T>;
    All(predicate: Action<T, boolean>): Promise<boolean>;
    Take(count: number): IEnumerable<T>;
    Skip(count: number): IEnumerable<T>;
    SkipWhile(predicate: BiAction<T, number, boolean>): IEnumerable<T>;
    First(predicate?: Action<T, boolean>): Promise<T>;
    FirstOrDefault(action?: Action<T, boolean>): Promise<T>;
    Sum(action?: Action<T, number>): Promise<number>;
    Concat(secondSource: IterableDataSource<T>): IEnumerable<T>;
    [Symbol.asyncIterator](): AsyncGenerator<T, unknown, unknown>;
    toArray(): Promise<ArrayLike<T>>;
    Zip<TSecond, TResult>(other: IEnumerable<TSecond>, transformer?: BiAction<T, TSecond, TResult>): IEnumerable<TResult | Tuple<T, TSecond>>;
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
export {};
declare global {
    interface Array<T> {
        count(): number;
        asEnumerable(): IEnumerable<T>;
    }
}
