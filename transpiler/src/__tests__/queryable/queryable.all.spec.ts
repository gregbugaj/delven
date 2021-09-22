import {Enumerable} from "../../query/internal"

describe("Queryable All", () => {
    beforeAll(() => {
    })

    test("all-001", async () => {
        let enumerable = Enumerable.of(["1", 2, 3]).AsQueryable()
        let all = await enumerable.All(x => typeof x === "number")
        expect(all).toBe(false)
    })

    test("all-002", async () => {
        let enumerable = Enumerable.of([1, 2, 3]).AsQueryable()
        let all = await enumerable.All(x => typeof x === "number")
        expect(all).toBe(true)
    })

    test("all-003", async () => {
        let enumerable = Enumerable.of([() => {
        }, () => {
        }, () => {
        }]).AsQueryable()
        let all = await enumerable.All(x => typeof x === "function")
        expect(all).toBe(true)
    })
})
