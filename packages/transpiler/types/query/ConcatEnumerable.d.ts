import { Enumerable, IterableDataSource } from "./internal";
/**
 * Concatenate two iterable datasources
 */
export declare class ConcatEnumerable<TSource> extends Enumerable<TSource> {
    readonly secondSource: IterableDataSource<TSource>;
    results: TSource[];
    constructor(source: IterableDataSource<TSource>, secondSource: IterableDataSource<TSource>);
    push(item: TSource): void;
    [Symbol.asyncIterator](): AsyncGenerator<TSource, unknown, unknown>;
    toArray(): Promise<ArrayLike<TSource>>;
}
