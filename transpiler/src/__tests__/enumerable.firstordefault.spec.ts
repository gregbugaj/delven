import {Enumerable} from "../query/internal"

describe("Enumerable FirstOrDefault", () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    beforeAll(() => {})

    test("FirstOrDefault-001", async () => {
        const numbers = Enumerable.of([2, 6, 4, 8])
        const results = await numbers.FirstOrDefault()
        expect(results).toEqual(2)
    })

    test("FirstOrDefault-002", async () => {
        const numbers = Enumerable.of([2, 6, 4, 8])
        const results = await numbers.FirstOrDefault(k => k > 10)
        expect(results).toEqual(0)
    })

    test("FirstOrDefault-003", async () => {
        const numbers = Enumerable.of(["apple", "banana", "tomato"])
        const results = await numbers.FirstOrDefault(val => val.length > 20)
        expect(results).toEqual("")
    })

    test("FirstOrDefault-004", async () => {
        const numbers = Enumerable.of([
            {name: "greg", city: "oklahoma", age: 100},
            {name: "roman", city: "el reno", age: 120}
        ])
        const results = await numbers.FirstOrDefault(val => val["name"] == "steve")
        expect(results).toEqual({name: "", city: "", age: 0})
    })

    test("FirstOrDefault-005", async () => {
        const numbers = Enumerable.of([{name: "greg", city: "oklahoma", age: 100, point: {x: 1, y: 2}}])
        const results = await numbers.FirstOrDefault(val => val["name"] == "steve")
        expect(results).toEqual({name: "", city: "", age: 0, point: {x: 0, y: 0}})
    })
})
