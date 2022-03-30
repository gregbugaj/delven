import { Action, Enumerable, IterableDataSource } from "./internal";
export declare class WhereEnumerable<TSource> extends Enumerable<TSource> {
    predicate: Action<TSource, boolean>;
    results: TSource[];
    constructor(source: IterableDataSource<TSource>, predicate: Action<TSource, boolean>);
    push(item: TSource): void;
    [Symbol.asyncIterator](): AsyncGenerator<TSource, unknown, unknown>;
    toArray(): Promise<ArrayLike<TSource>>;
}
