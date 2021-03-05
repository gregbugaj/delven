import { Tuple } from "./IEnumerable";
import { Action } from "./internal";
import { BiAction } from "./internal";
import { IEnumerable } from "./internal";
/**
 * Default implementaion of IQueryable
 */
export declare function sleep(ms: number): Promise<number>;
export declare class Enumerable<T> extends IEnumerable<T> {
    readonly source: ArrayLike<T>;
    constructor(source: ArrayLike<T>);
    /**
     * Crate enumerable
     * @param source
     */
    static of<T>(source: ArrayLike<T>): IEnumerable<T>;
    Select<R>(selector: Action<T, R>): IEnumerable<R>;
    Any(): boolean;
    Count(): number;
    Where(predicate: Action<T, boolean>): IEnumerable<T>;
    Take(count: number): IEnumerable<T>;
    Sum(action?: Action<T, number>): number;
    iter(): AsyncGenerator<T, unknown, unknown>;
    iterOfIter(): AsyncGenerator<T, unknown, unknown>;
    asyncIterator(): AsyncGenerator<T, unknown, unknown>;
    toArray(): Promise<ArrayLike<T>>;
    Zip<TSecond, TResult>(other: IEnumerable<TSecond>, transformer?: BiAction<T, TSecond, TResult>): IEnumerable<TResult | Tuple<T, TSecond>>;
}
