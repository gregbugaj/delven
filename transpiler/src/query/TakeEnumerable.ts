import { Enumerable, IterableDataSource } from "./internal"

export class TakeEnumerable<TSource> extends Enumerable<TSource> {
  results: TSource[]
  count: number

  constructor(source: IterableDataSource<TSource>, count: number) {
    super(source)
    this.results = []
    this.count = count
  }

  push(item: TSource): void {
    if (this.state === "STARTED") {
      this.results.push(item)
    }
  }

  async *[Symbol.asyncIterator](): AsyncGenerator<TSource, unknown, unknown> {
    console.info("TAKE : asyncIterator START")

    this.state = "STARTED"
    let index = 0
    for await (const val of this.source) {
      if (index++ >= this.count) {
        break
      }
      this.push(val)
      yield val
    }

    this.state = "COMPLETED"
    console.info("TAKE : asyncIterator END")
    return undefined
  }

  async toArray(): Promise<ArrayLike<TSource>> {
    if (this.state === "COMPLETED") {
      return this.results
    }

    for await (const item of this) {
      // this.results.push(item)
      // noop to force eval
    }

    return this.results
  }
}
