import {Enumerable} from "../query/internal"

describe("Queryable Sum", () => {
    beforeAll(() => {})

    test("sum-generic", async () => {
        let expectedResult = 6
        let querySum = new Enumerable(["1", 2, 3]).AsQueryable()
        let sum0 = await querySum.Sum()

        expect(sum0).toBe(expectedResult)
    })

    test("sum-function", async () => {
        let expectedResult = 6
        let querySum = new Enumerable(["1", 2, 3]).AsQueryable()
        let sum1 = await querySum.Sum((val: number | string): number => {
            if (typeof val == "string") return parseInt(val)
            return val
        })

        expect(sum1).toBe(expectedResult)
    })

    test("sum-undefined", async () => {
        let expectedResult = 2
        let querySum = new Enumerable(["1", "1", 2, 3]).AsQueryable()
        let sum1 = await querySum.Sum((val: number | string): number => {
            if (typeof val == "string") return parseInt(val)
            return undefined
        })

        expect(sum1).toBe(expectedResult)
    })
})
