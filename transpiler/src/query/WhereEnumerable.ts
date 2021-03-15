import { Action, Enumerable, IterableDataSource } from "./internal"

export class WhereEnumerable<TSource> extends Enumerable<TSource> {
  predicate: Action<TSource, boolean>

  results: TSource[]

  constructor(source: IterableDataSource<TSource>, predicate: Action<TSource, boolean>) {
    super(source)
    this.predicate = predicate
    this.results = []
    console.info("where source : " + source)
  }

  push(item: TSource): void {
    if (this.state === "STARTED") {
      this.results.push(item)
    }
  }

  async *[Symbol.asyncIterator](): AsyncGenerator<TSource, unknown, unknown> {
    // console.info("WHERE : asyncIterator START")
    this.state = "STARTED"
    for await (let val of this.source) {
      if (this.predicate(val)) {
        this.push(val)
        yield val
      }
    }
    this.state = "COMPLETED"
    // TReturn = any
    // console.info("WHERE : asyncIterator END")
    return undefined
  }

  async toArray(): Promise<ArrayLike<TSource>> {
    if (this.state === "COMPLETED") {
      return this.results
    }

    for await (const item of this) {
      // NOOP to invoke evaluation
    }
    return this.results
  }
}
