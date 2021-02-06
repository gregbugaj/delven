import { Action, IEnumerable, Enumerable } from "./internal";

export class ZipEnumerable<TFirst, TSecond, TResult> extends Enumerable<TResult> {
    results: TResult[];
    executed: boolean;
    first: IEnumerable<TFirst>;
    second: IEnumerable<TSecond>;
    transformer: Action<TFirst, TSecond> | undefined;

    constructor(first: IEnumerable<TFirst>, second: IEnumerable<TSecond>, transformer?: Action<TFirst, TSecond>) {
        super([]);
        this.results = [];
        this.executed = false;
        this.first = first;
        this.second = second;
        this.transformer = transformer;
    }

    async *asyncIterator(): AsyncGenerator<TResult, unknown, unknown> {

        const lhs = this.first.asyncIterator();
        const rhs = this.second.asyncIterator();

        while (true) {
            let first = await lhs.next();
            let second = await rhs.next();

            if (first == undefined || second == undefined) {
                break;
            }
            if (first.done || second.done) {
                break;
            }

            yield { "first": first.value, "second": second.value };
        }
        // TReturn = any
        return undefined;
    }

    async toArray(): Promise<ArrayLike<TResult>> {
        if (this.executed) {
            return Promise.resolve(this.results);
        }
        for await (const item of this.asyncIterator()) {
            this.results.push(item);
        }
        this.executed = true;
        return Promise.resolve(this.results);
    }
}
