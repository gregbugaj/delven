import {Action, Enumerable} from "./internal"
export declare class SelectEnumerable<TSource, TResult> extends Enumerable<TResult> {
    readonly selectable: ArrayLike<TSource>
    results: TResult[]
    executed: boolean
    selector: Action<TSource, TResult>
    constructor(source: ArrayLike<TSource>, selector: Action<TSource, TResult>)
    asyncIterator(): AsyncGenerator<TResult, unknown, unknown>
    toArray(): Promise<ArrayLike<TResult>>
}
