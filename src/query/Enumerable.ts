import { Action, IEnumerable } from "./IEnumerable";
/**
 * Default implementaion of IQueryable
 */

export function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms))
}
 
// https://stackoverflow.com/questions/39614311/class-constructor-type-in-typescript
// https://www.typescriptlang.org/docs/handbook/interfaces.html
export class Enumerable<T> extends IEnumerable<T> {
    readonly source: ArrayLike<T>
 
    constructor(source:ArrayLike<T>){
        super()
        this.source = source
    }

    Select<R>(selector: Action<T, R>): IEnumerable<R> {
        const  enumerable:IEnumerable<R> = new SelectEnumerable<T, R>(this.source, selector);
        return enumerable
    }

    Any(): boolean {
        throw new Error("Method not implemented.");
    }
    
    Count(): number {
        return this.source?.length
    }
    
    Where(predicate: Action<T, boolean>): IEnumerable<T> {
        const data = new Array<T>()
        for (let i = 0; i < this.source.length;++i){
            if(predicate(this.source[i])){
                data.push(this.source[i])
            }
        }
        return new Enumerable(data);
    }
   
    Take(count: number): IEnumerable<T> {
        return new TakeEnumerable(this.source, count)
    }
    
    Sum<R>(action?: Action<T, R>): number {
        throw new Error("Method not implemented.");
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

    constructor(source: ArrayLike<TSource>, count: number){
        super(source)
        this.results = []
        this.executed = false
        this.count = count
    }

    async *asyncIterator(): AsyncGenerator<TSource, unknown, unknown> {
        for (let i = 0; i < Math.min(this.count, this.source.length);++i){
            await sleep(1000)
            yield this.source[i]
        }
        return undefined
    }

    async toArray(): Promise<ArrayLike<TSource>> {
        if(this.executed){
            return Promise.resolve(this.results)
        }
        for await (const item of this.asyncIterator()){
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

    constructor(source: ArrayLike<TSource>, selector: Action<TSource, TResult>){
        super([])        
        this.selectable = source
        this.results = []
        this.executed = false
        this.selector = selector
    }

    async *asyncIterator(): AsyncGenerator<TResult, unknown, unknown> {
        for (let i = 0; i < this.selectable.length;++i){
            // T = unknown
            const retval:TResult = this.selector(this.selectable[i])
            yield retval
        }        
        // TReturn = any
        return undefined
    }

    async toArray(): Promise<ArrayLike<TResult>> {
        if(this.executed){
            return Promise.resolve(this.results)
        }
        for await (const item of this.asyncIterator()){
            this.results.push(item)
        }
        this.executed = true
        return Promise.resolve(this.results)
    }
}