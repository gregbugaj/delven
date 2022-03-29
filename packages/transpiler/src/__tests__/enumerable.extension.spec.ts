import {Enumerable} from "../query/internal"

describe("Enumerable Extensions", () => {
    beforeAll(() => {
        // If we don't import the enumerable then
        Enumerable.of([])
    })

    test("should have a .count method", function() {
        let counter = [].count()
    })

    test("should have a .select method", function() {
        let enumerable = [1, 2].asEnumerable()
        expect(enumerable.Select).toBeTruthy()
    })

    // test("basic-async-iter", async () => {
    //   const numbers = [].asEnumerable()

    //   const results = []
    //   for await (const val of numbers) {
    //     results.push(val)
    //   }

    //   expect(results).toEqual(src)
    // })

    // test("basic-async-iter", async () => {
    //   const numbers = [2, 6, 4, 8].asEnumerable()

    //   const results = []
    //   for await (const val of numbers) {
    //     results.push(val)
    //   }
    //   expect(results).toEqual(src)
    // })
})
