import {Enumerable} from "../query/internal"

describe("Enumerable TakeWhile", () => {
    beforeAll(() => {})

    test("TakeWhile-001", async () => {
      let enumerable = new Enumerable<number>([1, 2, 1, 2, 3, 2, 3])
      let results = await enumerable.TakeWhile(x => x <= 2).toArray()
      console.info(results)
      let expectedResult = [ 1, 2, 1, 2 ]
      expect(results).toEqual(expectedResult)
  })
})
