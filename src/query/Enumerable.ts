import { Action, IEnumerable } from "./IEnumerable";
/**
 * Default implementaion of IQueryable
 */

export function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms))
}
 
export class Enumerable<T> extends IEnumerable<T> {
    source: ArrayLike<T>
 
    constructor(source:ArrayLike<T>){
        super()
        this.source = source
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

    Select<R>(selector: Action<T, R>): IEnumerable<R> {
        return new SelectEnumerable<T, R>(this.source, selector);
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

class TakeEnumerable<T> extends Enumerable<T> {
    results: T[]
    executed: boolean
    count: number;

    constructor(source: ArrayLike<T>, count: number){
        super(source)
        this.results = []
        this.executed = false
        this.count = count
    }

    async *asyncIterator(): AsyncGenerator<T, T | unknown, unknown> {
        for (let i = 0; i < Math.min(this.count, this.source.length);++i){
            await sleep(1000)
           yield this.source[i]
        }
        return undefined
    }

    async toArray(): Promise<ArrayLike<T>> {
        if(this.executed){
            return Promise.resolve(this.results)
        }
        for await (const item of this){
            this.results.push(item)
        }
        this.executed = true
        return Promise.resolve(this.results)
    }
}


class SelectEnumerable<T, R> extends Enumerable<T> {
    results: T[];
    executed: boolean
    selector: Action<T, R>;

    constructor(source: ArrayLike<T>, selector: Action<T, R>){
        super(source)        
        this.results =  []
        this.executed = false
        this.selector = selector
    }

    async *asyncIterator(): AsyncGenerator<T, R|unknown, unknown> {
        for (let i = 0; i < this.source.length;++i){
            yield this.selector(this.source[i])
        }
        
        return undefined
    }

    async toArray(): Promise<ArrayLike<T>> {
        if(this.executed){
            return Promise.resolve(this.results)
        }
        for await (const item of this){
            this.results.push(item)
        }
        this.executed = true
        return Promise.resolve(this.results)
    }
}