import {Enumerable} from "../query/internal"

describe("Queryable SkipWhile", () => {
    beforeAll(() => {
    })

    test("SkipWhile-predicate-true", async () => {
        const enumerable = Enumerable.of([1, 2, 1, 2, 3, 2, 3]).AsQueryable()
        const results = await enumerable.SkipWhile(x => true).toArray()
        const expectedResult = []
        expect(results).toEqual(expectedResult)
    })

    test("SkipWhile-predicate-false", async () => {
        const data = [1, 2, 1, 2, 3, 2, 3]
        const enumerable = Enumerable.of(data).AsQueryable()
        const results = await enumerable.SkipWhile(x => false).toArray()
        expect(results).toEqual(data)
    })

    test("SkipWhile-value less than", async () => {
        let enumerable = [1, 2, 3, 4, 5, 6, 7, 8].asEnumerable().AsQueryable()
        let results = await enumerable.SkipWhile(x => x <= 4).toArray()
        let expectedResult = [5, 6, 7, 8]
        expect(results).toEqual(expectedResult)
    })

    test("SkipWhile-index is less than", async () => {
        let enumerable = [1, 2, 3, 4, 5, 6, 7, 8].asEnumerable().AsQueryable()
        let results = await enumerable.SkipWhile((x, index) => index < 6).toArray()
        let expectedResult = [7, 8]
        expect(results).toEqual(expectedResult)
    })

    test("SkipWhile complex predicate is true", async () => {
        // https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.skipwhile
        let enumerable = [5000, 2500, 9000, 8000, 6500, 4000, 1500, 5500].asEnumerable().AsQueryable()
        let results = await enumerable.SkipWhile((amount, index) => amount > index * 1000).toArray()
        let expectedResult = [4000, 1500, 5500]
        expect(results).toEqual(expectedResult)
    })
})
