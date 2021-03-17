import { Enumerable } from "../query/internal"

describe("Enumerable TakeWhile", () => {
  beforeAll(() => { })

  test("TakeWhile-001", async () => {
    let enumerable = new Enumerable<number>([1, 2, 1, 2, 3, 2, 3])
    let results = await enumerable.TakeWhile(x => x <= 2).toArray()
    let expectedResult = [1, 2, 1, 2]
    expect(results).toEqual(expectedResult)
  })

  test("TakeWhile-002", async () => {
    let enumerable = [1, 2, 1, 2, 3, 2, 3].asEnumerable()
    let results = await enumerable.TakeWhile(x => x <= 2).toArray()
    let expectedResult = [1, 2, 1, 2]
    expect(results).toEqual(expectedResult)
  })

  test("TakeWhile-003", async () => {
    const data = [1, 2, 1, 2, 3, 2, 3]
    let enumerable = data.asEnumerable()
    let results = await enumerable.TakeWhile(x => true).toArray()
    expect(results).toEqual(data)
  })


  // https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.takewhile
  test("TakeWhile-003 with index", async () => {
    const data = ["apple", "passionfruit", "banana", "mango","orange", "blueberry", "grape", "strawberry"]
    const expectedResult = ["apple", "passionfruit", "banana", "mango","orange", "blueberry"]
    let enumerable = data.asEnumerable()
    let results = await enumerable.TakeWhile((fruit, index) => fruit.length >= index).toArray()
    expect(results).toEqual(expectedResult)
  })


})
