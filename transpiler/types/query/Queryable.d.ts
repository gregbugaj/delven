import IQueryProvider from "./IQueryProvider";
import { IQueryable } from "./IQueryable";
import { Action, IEnumerable } from "./IEnumerable";
import { Expression } from "../nodes";
/**
 * Provides functionality to evaluate queries against a specific data source wherein the type of the data is known.
 */
export default class Queryable<T> extends IQueryable<T> {
    provider: IQueryProvider;
    expression: Expression;
    constructor(provider: IQueryProvider, expression: Expression);
    iterOfIter(): AsyncGenerator<T, unknown, unknown>;
    toArray(): Promise<ArrayLike<any>>;
    Any(): boolean;
    Count(): number;
    Where(predicate: Action<T, boolean>): IEnumerable<T>;
    Select<R>(selector: Action<T, R>): IEnumerable<R>;
    Take(count: number): IEnumerable<T>;
    Sum<R extends number>(action?: Action<T, R>): number;
    Zip<K, T>(other: IEnumerable<K>): IEnumerable<T>;
}
