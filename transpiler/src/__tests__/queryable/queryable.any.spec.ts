import {Enumerable} from "../../query/internal"

describe("Queryable Any", () => {
    beforeAll(() => {
    })

    test("any-true", async () => {
        let enumerable = Enumerable.of([1, 2, 3, 2]).AsQueryable()
        let hasElements = await enumerable.Any((x) => x == 2)
        expect(hasElements).toBe(true)
    })

    test("any-true-01", async () => {
        let enumerable = Enumerable.of([1, 2, 3, 2]).AsQueryable()
        let hasElements = await enumerable.Any()
        expect(hasElements).toBe(true)
    })

    test("any-false", async () => {
        let enumerable = Enumerable.of([1, 2, 3, 2]).AsQueryable()
        let hasElements = await enumerable.Any((x) => x == 5)
        expect(hasElements).toBe(false)
    })

    test("any-empty-false-00", async () => {
        let enumerable = Enumerable.of([]).AsQueryable()
        let hasElements = await enumerable.Any((x) => true)
        expect(hasElements).toBe(false)
    })

    test("any-empty-false-01", async () => {
        let enumerable = Enumerable.of([]).AsQueryable()
        let hasElements = await enumerable.Any()
        expect(hasElements).toBe(false)
    })
})
