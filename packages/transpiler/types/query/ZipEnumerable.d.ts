import { Tuple, Enumerable, BiAction, IterableDataSource } from "./internal";
export declare class ZipEnumerable<TFirst, TSecond, TResult> extends Enumerable<TResult | Tuple<TFirst, TSecond>> {
    results: TResult[];
    executed: boolean;
    first: IterableDataSource<TFirst>;
    second: IterableDataSource<TSecond>;
    transformer: BiAction<TFirst, TSecond, TResult> | undefined;
    constructor(first: IterableDataSource<TFirst>, second: IterableDataSource<TSecond>, transformer?: BiAction<TFirst, TSecond, TResult>);
    asyncIterator(): AsyncGenerator<TResult | Tuple<TFirst, TSecond>, unknown, unknown>;
    toArray(): Promise<ArrayLike<TResult>>;
}
