import { Tuple, IEnumerable, Enumerable, BiAction } from "./internal";
export declare class ZipEnumerable<TFirst, TSecond, TResult> extends Enumerable<TResult | Tuple<TFirst, TSecond>> {
    results: TResult[];
    executed: boolean;
    first: IEnumerable<TFirst>;
    second: IEnumerable<TSecond>;
    transformer: BiAction<TFirst, TSecond, TResult> | undefined;
    constructor(first: IEnumerable<TFirst>, second: IEnumerable<TSecond>, transformer?: BiAction<TFirst, TSecond, TResult>);
    asyncIterator(): AsyncGenerator<TResult | Tuple<TFirst, TSecond>, unknown, unknown>;
    toArray(): Promise<ArrayLike<TResult>>;
}
