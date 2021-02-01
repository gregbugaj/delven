import { Action, IEnumerable } from "./IEnumerable";
/**
 * Default implementaion of IQueryable
 */

export function sleep(ms: number): Promise<number> {
    return new Promise(resolve => setTimeout(resolve, ms))
}

// https://stackoverflow.com/questions/39614311/class-constructor-type-in-typescript
// https://www.typescriptlang.org/docs/handbook/interfaces.html
export class Enumerable<T> extends IEnumerable<T> {
    readonly source: ArrayLike<T>

    constructor( source: ArrayLike<T>) {
        super()
        this.source = source
    }

    Select<R>(selector: Action<T, R>): IEnumerable<R> {
        return new SelectEnumerable<T, R>(this.source, selector);
    }

    Any(): boolean {
        throw new Error("Method not implemented.");
    }

    Count(): number {
        return this.source?.length
    }

    Where(predicate: Action<T, boolean>): IEnumerable<T> {
        return new WhereEnumerable(this.source, predicate);
    }

    Take(count: number): IEnumerable<T> {
        return new TakeEnumerable(this.source, count)
    }

    Sum(action?: Action<T, number>): number {
        if (typeof action === 'undefined') {
            // identitity action
            const ident = (arg: T): number => {
                if (typeof arg === 'number') {
                    return arg;
                } else if (typeof arg === 'string') {
                    return parseInt(arg)
                }
                throw new Error(`Unknow type for : ${(typeof action)}`);
            }
            action = ident
        }

        let sum = 0
        for (let i = 0; i < this.source.length; ++i) {
            sum += action(this.source[i]);
        }
        return sum;
    }

    iter(): AsyncGenerator<T, unknown, unknown> {
        throw new Error("Method not implemented.");
    }

    iterOfIter(): AsyncGenerator<T, unknown, unknown> {
        throw new Error("Method not implemented.");
    }

    async toArray(): Promise<ArrayLike<T>> {
        return Promise.resolve(this.source);
    }

    Zip<K, T>(other: IEnumerable<K>): IEnumerable<T> {
        throw new Error("Method not implemented.");
    }
}
class TakeEnumerable<TSource> extends Enumerable<TSource> {
    results: TSource[]
    executed: boolean
    count: number;

    constructor(source: ArrayLike<TSource>, count: number) {
        super(source)
        this.results = []
        this.executed = false
        this.count = count
    }

    async *asyncIterator(): AsyncGenerator<TSource, unknown, unknown> {
        for (let i = 0; i < Math.min(this.count, this.source.length); ++i) {
            await sleep(1000)
            yield this.source[i]
        }
        return undefined
    }

    async toArray(): Promise<ArrayLike<TSource>> {
        if (this.executed) {
            return Promise.resolve(this.results)
        }
        for await (const item of this.asyncIterator()) {
            this.results.push(item)
        }
        this.executed = true
        return Promise.resolve(this.results)
    }
}

class WhereEnumerable<TSource> extends Enumerable<TSource> {
    predicate: Action<TSource, boolean>;
    results: TSource[]
    executed: boolean;

    constructor(soure: ArrayLike<TSource>, predicate: Action<TSource, boolean>){
        super(soure);
        this.predicate = predicate
        this.results = []
        this.executed = false
    }

    async *asyncIterator(): AsyncGenerator<TSource, unknown, unknown> {
        for (let i = 0; i < this.source.length; ++i) {
            // T = unknown
            if(this.predicate(this.source[i])){
                yield this.source[i]
            }
        }
        // TReturn = any
        return undefined
    }

    async toArray(): Promise<ArrayLike<TSource>> {
        if (this.executed) {
            return Promise.resolve(this.results)
        }
        for await (const item of this.asyncIterator()) {
            this.results.push(item)
        }
        this.executed = true
        return Promise.resolve(this.results)
    }
}

class SelectEnumerable<TSource, TResult> extends Enumerable<TResult> {
    readonly selectable: ArrayLike<TSource> // source does not have to have push, pop
    results: TResult[] // results should have push,pop
    executed: boolean
    selector: Action<TSource, TResult>

    constructor(source: ArrayLike<TSource>, selector: Action<TSource, TResult>) {
        super([])
        this.selectable = source
        this.results = []
        this.executed = false
        this.selector = selector
    }

    async *asyncIterator(): AsyncGenerator<TResult, unknown, unknown> {
        for (let i = 0; i < this.selectable.length; ++i) {
            // T = unknown
            const retval: TResult = this.selector(this.selectable[i])
            yield retval
        }
        // TReturn = any
        return undefined
    }

    async toArray(): Promise<ArrayLike<TResult>> {
        if (this.executed) {
            return Promise.resolve(this.results)
        }
        for await (const item of this.asyncIterator()) {
            this.results.push(item)
        }
        this.executed = true
        return Promise.resolve(this.results)
    }
}