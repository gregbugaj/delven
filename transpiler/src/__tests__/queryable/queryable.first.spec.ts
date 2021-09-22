import {Enumerable} from "../../query/internal"
import InvalidOperationException from "../../query/InvalidOperationException"

describe("Queryable First", () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    beforeAll(() => {
    })

    test("first-001", async () => {
        const numbers = Enumerable.of([2, 6, 4, 8]).AsQueryable()
        const results = await numbers.First()
        expect(results).toEqual(2)
    })

    test("first-predicate-002", async () => {
        const numbers = Enumerable.of([2, 6, 4, 8]).AsQueryable()
        const results = await numbers.First(k => k == 4)
        expect(results).toEqual(4)
    })

    test("first-predicate-003", async () => {
        const numbers = Enumerable.of([2, 6, 4, 8]).AsQueryable()
        const results = await numbers.First(k => k > 6)
        expect(results).toEqual(8)
    })

    test("first-predicate-004", async () => {
        const t = async () => {
            const numbers = Enumerable.of([2, 6, 4, 8]).AsQueryable()
            return await numbers.First(k => k > 10)
        }

        await expect(t())
            .rejects
            .toThrow(InvalidOperationException)
    })
})
