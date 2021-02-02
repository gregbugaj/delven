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

    constructor(provider: IQueryProvider, expression: Expression) {
        super();
        this.provider = provider;
        this.expression = expression;
    }

    iterOfIter(): AsyncGenerator<T, unknown, unknown> {
        throw new Error("Method not implemented.");
    }
    toArray(): Promise<ArrayLike<any>> {
        throw new Error("Method not implemented.");
    }
    Any(): boolean {
        throw new Error("Method not implemented.");
    }
    Count(): number {
        throw new Error("Method not implemented.");
    }
    Where(predicate: Action<T, boolean>): IEnumerable<T> {
        throw new Error("Method not implemented.");
    }
    Select<R>(selector: Action<T, R>): IEnumerable<R> {
        throw new Error("Method not implemented.");
    }
    Take(count: number): IEnumerable<T> {
        throw new Error("Method not implemented.");
    }
    Sum<R extends number>(action?: Action<T, R>): number {
        throw new Error("Method not implemented.");
    }
    Zip<K, T>(other: IEnumerable<K>): IEnumerable<T> {
        throw new Error("Method not implemented.");
    }
}
