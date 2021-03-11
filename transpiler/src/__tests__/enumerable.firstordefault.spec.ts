import { Enumerable } from "../query/internal"
import InvalidOperationException from "../query/InvalidOperationException"

describe("Enumerable FirstOrDefault", () => {
  beforeAll(() => { })

  test("FirstOrDefault-001", async () => {
    const numbers = Enumerable.of([2, 6, 4, 8])
    const results = numbers.FirstOrDefault()
    expect(results).toEqual(2)
  })

  test("FirstOrDefault-002", async () => {
    const numbers = Enumerable.of([2, 6, 4, 8])
    const results = numbers.FirstOrDefault(k => k > 10)
    expect(results).toEqual(0)
  })

  test("FirstOrDefault-003", async () => {
    const numbers = Enumerable.of(["apple", "bannana", "tommato"])
    const results = numbers.FirstOrDefault(val => val.length > 20)
    expect(results).toEqual("")
  })

  test("FirstOrDefault-004", async () => {
    const numbers = Enumerable.of([{ "name": "greg", "city": "oklahoma", "age": 100 }, { "name": "roman", "city": "el reno", "age": 120 }])
    const results = numbers.FirstOrDefault(val => val["name"] == 'steve')
    expect(results).toEqual({ "name": "", "city": "", "age": 0 })
  })

  test("FirstOrDefault-005", async () => {
    const numbers = Enumerable.of([{ "name": "greg", "city": "oklahoma", "age": 100, point: { "x": 1, "y": 2 } }])
    const results = numbers.FirstOrDefault(val => val["name"] == 'steve')
    expect(results).toEqual({ "name": "", "city": "", "age": 0, point: { "x": 0, "y": 0 } })
  })
})
