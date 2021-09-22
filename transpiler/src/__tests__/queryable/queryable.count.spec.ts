import {Enumerable} from "../../query/internal"

describe("Queryable Count", () => {
    beforeAll(() => {
    })

    test("count-001", async () => {
        let ds = [1, 2, 3]
        let enumerable = Enumerable.of(ds).AsQueryable()
        let count = await enumerable.Count()
        expect(count).toBe(ds.length)
    })

    test("count-002", async () => {
        let ds = [1, 2, 3]
        let enumerable = Enumerable.of(ds).AsQueryable()
        let count = await enumerable.Count(x => x == 2)
        expect(count).toBe(1)
    })

})
