/**
 * Mock object populator
 * @param index
 * @param obj
 */
export declare function populator(index: number, obj: any): any
declare type TypeCreator<T> = (index: number) => T
/**
 * Mock datasource provider
 * ref : https://github.com/microsoft/TypeScript/issues/26959
 * https://stackoverflow.com/questions/38508172/typescript-make-class-objects-iterable
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for-await...of
 */
export default class MockDataProvider<T> {
    count: number
    sleeptime: number
    creator: TypeCreator<T>
    constructor(count: number, sleeptime: number, creator: TypeCreator<T>)
    iterOfIter(): AsyncGenerator<AsyncGenerator<T, unknown, unknown>, void, unknown>
    iter(): AsyncGenerator<T, unknown, unknown>
    /**
     * Create a mock data source provider
     *
     * @param count
     * @param timeout
     */
    static create<T>(count: number, sleeptime: number, creator: TypeCreator<T>): MockDataProvider<T>
}
export {}
