import { Action, BiAction, Enumerable, IterableDataSource } from "./internal";
export declare class SelectManyEnumerable<TSource, TResult, K> extends Enumerable<K> {
    results: K[];
    executed: boolean;
    collector: Action<TSource, IterableDataSource<TResult>>;
    transform: BiAction<TSource, TResult, K>;
    constructor(source: IterableDataSource<TSource>, collector: Action<TSource, IterableDataSource<TResult>>, transform?: BiAction<TSource, TResult, K>);
    [Symbol.asyncIterator](): AsyncGenerator<K, unknown, unknown>;
    toArray(): Promise<ArrayLike<K>>;
}
