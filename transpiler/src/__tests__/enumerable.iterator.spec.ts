import { Enumerable } from "../query/internal"

describe("Enumerable Iterator", () => {
  beforeAll(() => { })

  test("basic-async-iter", async () => {
    const src = [2, 6, 4, 8].count()
    const src2 = [2, 6, 4, 8].asEnumerable()

    console.info(`count = ${src2}`)
    const numbers = Enumerable.of(src)
    const results = []
    for await (const val of numbers) {
      results.push(val)
    }
    expect(results).toEqual(src)
  })


  if(false)
  test("basic-iter", async () => {
    const src = [2, 6, 4, 8]
    const numbers = Enumerable.of(src)
    const results = []
    for await (const val of numbers) {
      results.push(val)
    }

    expect(results).toEqual(src)
  })

  // test("first-predicate-002", async () => {
  //     const numbers = Enumerable.of([2, 6, 4, 8])
  //     const results = await numbers.First(k => k == 4)
  //     expect(results).toEqual(4)
  // })


})
