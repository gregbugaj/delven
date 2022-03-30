import { BiAction, Enumerable, IterableDataSource } from "./internal";
export declare class TakeWhileEnumerable<TSource> extends Enumerable<TSource> {
    predicate: BiAction<TSource, number, boolean>;
    results: TSource[];
    constructor(source: IterableDataSource<TSource>, predicate: BiAction<TSource, number, boolean>);
    push(item: TSource): void;
    [Symbol.asyncIterator](): AsyncGenerator<TSource, unknown, unknown>;
    toArray(): Promise<ArrayLike<TSource>>;
}
