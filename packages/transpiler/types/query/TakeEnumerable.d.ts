import { Enumerable, IterableDataSource } from "./internal";
export declare class TakeEnumerable<TSource> extends Enumerable<TSource> {
    results: TSource[];
    count: number;
    constructor(source: IterableDataSource<TSource>, count: number);
    push(item: TSource): void;
    [Symbol.asyncIterator](): AsyncGenerator<TSource, unknown, unknown>;
    toArray(): Promise<ArrayLike<TSource>>;
}
