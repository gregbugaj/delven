import { Enumerable } from "../query/internal"
import InvalidOperationException from "../query/InvalidOperationException"

describe("Enumerable First", () => {
  beforeAll(() => { })

  test("first-001", async () => {
    const numbers = Enumerable.of([2, 6, 4, 8])
    const results = numbers.First()
    expect(results).toEqual(2)
  })

  test("first-predicate-002", async () => {
    const numbers = Enumerable.of([2, 6, 4, 8])
    const results = numbers.First(k => k == 4)
    expect(results).toEqual(4)
  })

  test("first-predicate-003", async () => {
    const numbers = Enumerable.of([2, 6, 4, 8])
    const results = numbers.First(k => k > 6)
    expect(results).toEqual(2)
  })

  test("first-predicate-004", async () => {
    const t = () => {
      const numbers = Enumerable.of([2, 6, 4, 8])
      const results = numbers.First(k => k > 10)
    }

    expect(t).toThrow(InvalidOperationException)
  })
})
