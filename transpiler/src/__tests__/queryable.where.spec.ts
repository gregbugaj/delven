import {Enumerable} from "../query/internal"

describe("Queryable Where", () => {
    beforeAll(() => {
    })

    test("where-toArray()", async () => {
        let queryWhere = new Enumerable([1, 2, "A", 1, 2, 3, 2, 3]).AsQueryable()
        let where = await queryWhere.Where((val: string | number) => {
            return val === "A"
        })

        let result = await where.toArray()
        let expectedResult = ["A"]
        expect(result).toEqual(expectedResult)
    })

    test("where-iterator-async", async () => {
        let queryWhere = Enumerable.of([1, 2, "A", 1, 2, 3, 2, 3]).AsQueryable()
        let where = queryWhere.Where((val: string | number) => {
            return val === 2
        })
        let expectedResult = [2, 2, 2]
        let results = []

        for await (const val of where) {
            results.push(val)
        }

        expect(results).toEqual(expectedResult)
    })

    test("where-iterator-composite", async () => {
        let queryWhere = Enumerable.of([1, 2, "A", 1, 2, 3, 2, 3]).AsQueryable()
        let results = await queryWhere
            .Where((val: string | number) => {
                return val === 2
            })
            .Take(2)
            .toArray()

        let expectedResult = [2, 2]
        expect(results).toEqual(expectedResult)
    })
})
