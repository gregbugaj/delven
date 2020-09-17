/**
 * Provides functionality to evaluate queries against a specific data source
 *
 * https://github.com/microsoft/TypeScript/issues/25710
 * https://www.typescriptlang.org/docs/handbook/interfaces.html
 *  Async Generators
 * https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-3.html
 *
 * https://javascript.info/async-iterators-generators
 *
 * https://github.com/microsoft/TypeScript/issues/33458
 */
export declare abstract class IQueryable<T> {
    abstract iter(): AsyncGenerator<T, unknown, T | unknown>;
    abstract iterOfIter(): AsyncGenerator<T, unknown, T | unknown>;
}
export declare class MockQueryable implements IQueryable<number> {
    constructor();
    iterOfIter(): AsyncGenerator<number, unknown, unknown>;
    iter(): AsyncGenerator<number, unknown, unknown>;
}
