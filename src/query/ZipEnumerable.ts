import { Tuple, Action, IEnumerable, Enumerable, BiAction } from "./internal";

export class ZipEnumerable<TFirst, TSecond, TResult> extends Enumerable<TResult | Tuple<TFirst, TSecond>> {
    results: TResult[];
    executed: boolean;
    first: IEnumerable<TFirst>;
    second: IEnumerable<TSecond>;
    transformer: BiAction<TFirst, TSecond, TResult> | undefined;

    constructor(first: IEnumerable<TFirst>, second: IEnumerable<TSecond>, transformer?: BiAction<TFirst, TSecond, TResult>) {
        super([]);
        this.results = [];
        this.executed = false;
        this.first = first;
        this.second = second;
        this.transformer = transformer;
    }

    async *asyncIterator(): AsyncGenerator<TResult | Tuple<TFirst, TSecond>, unknown, unknown> {

        const lhs = this.first.asyncIterator();
        const rhs = this.second.asyncIterator();

        while (true) {
            const first = await lhs.next();
            const second = await rhs.next();

            if (first == undefined || second == undefined) {
                break;
            }
            if (first.done || second.done) {
                break;
            }

            if (this.transformer === undefined) {
                yield [first.value, second.value] as Tuple<TFirst, TSecond>
            } else {
                yield this.transformer(first.value as TFirst, second.value as TSecond);
            }
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
