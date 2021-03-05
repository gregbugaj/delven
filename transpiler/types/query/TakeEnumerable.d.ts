import { Enumerable } from "./internal";
export declare class TakeEnumerable<TSource> extends Enumerable<TSource> {
    results: TSource[];
    executed: boolean;
    count: number;
    constructor(source: ArrayLike<TSource>, count: number);
    asyncIterator(): AsyncGenerator<TSource, unknown, unknown>;
    toArray(): Promise<ArrayLike<TSource>>;
}
