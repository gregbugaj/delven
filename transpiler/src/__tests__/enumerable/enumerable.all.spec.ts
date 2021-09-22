import {Enumerable} from "../../query/internal"

describe("Enumerable All", () => {
    beforeAll(() => {
    })

    test("all-001", async () => {
        let enumerable = Enumerable.of(["1", 2, 3])
        let all = await enumerable.All(x => typeof x === "number")
        expect(all).toBe(false)
    })

    test("all-002", async () => {
        let enumerable = Enumerable.of([1, 2, 3])
        let all = await enumerable.All(x => typeof x === "number")
        expect(all).toBe(true)
    })

    test("all-003", async () => {
        let enumerable = Enumerable.of([() => {
        }, () => {
        }, () => {
        }])
        let all = await enumerable.All(x => typeof x === "function")
        expect(all).toBe(true)
    })
})
