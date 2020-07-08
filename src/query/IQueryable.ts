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

export abstract class IQueryable<T> {
    // abstract iterator(): IterableIterator<string>;
    abstract iter(): AsyncGenerator<T, unknown, T | unknown>
}

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

export class MockQueryable implements IQueryable<number> {

    constructor() {
        console.info("entry")
    }

    async * iter(): AsyncGenerator<number, unknown, unknown> {
        for (let i = 0; i < 10; ++i) {
            await sleep(100);
            yield i;
        }
        return;
    }
}
