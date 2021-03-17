import { Enumerable } from "../query/internal"

describe("Enumerable Skip", () => {
  beforeAll(() => { })

  test("skip-toArray()", async () => {
    let enumerable = new Enumerable([0, 1, 2, 3, 4, 5, 6, 7, 8])
    let t3 = await enumerable.Skip(2).toArray()
    let expectedResult = [2, 3, 4, 5, 6, 7, 8]
    expect(t3).toEqual(expectedResult)
  })


  test("skip-iterator", async () => {
    const enumerable = new Enumerable([0, 1, 2, 3, 4, 5, 6, 7, 8])
    const expectedResult = [2, 3, 4, 5, 6, 7, 8]
    const results = []
    for await (const val of enumerable.Skip(2)) {
      results.push(val)
    }

    expect(results).toEqual(expectedResult)
  })

  test("skip-outofrange", async () => {
    const data = [0, 1, 2, 3, 4, 5, 6, 7, 8]
    const result = await data.asEnumerable().Skip(-1).toArray()
    expect(result).toEqual(data)
  })

  test("skip-outofrange-iterable", async () => {
    const data = [0, 1, 2, 3, 4, 5, 6, 7, 8]
    const enumerable = data.asEnumerable()
    const results = []

    for await (const val of enumerable.Skip(-1)) {
      results.push(val)
    }

    expect(results).toEqual(data)
  })

})
