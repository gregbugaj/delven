import {Action, Enumerable} from "./internal"
export declare class WhereEnumerable<TSource> extends Enumerable<TSource> {
    predicate: Action<TSource, boolean>
    results: TSource[]
    executed: boolean
    constructor(soure: ArrayLike<TSource>, predicate: Action<TSource, boolean>)
    asyncIterator(): AsyncGenerator<TSource, unknown, unknown>
    toArray(): Promise<ArrayLike<TSource>>
}
