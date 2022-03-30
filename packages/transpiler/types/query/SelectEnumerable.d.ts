import { Action, Enumerable, IterableDataSource } from "./internal";
export declare class SelectEnumerable<TSource, TResult> extends Enumerable<TResult> {
    results: TResult[];
    executed: boolean;
    selector: Action<TSource, TResult>;
    constructor(source: IterableDataSource<TSource>, selector?: Action<TSource, TResult>);
    [Symbol.asyncIterator](): AsyncGenerator<TResult, unknown, unknown>;
    toArray(): Promise<ArrayLike<TResult>>;
}
