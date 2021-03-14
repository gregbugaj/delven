import {Enumerable} from "../query/internal"

describe("Enumerable Concat", () => {
    beforeAll(() => {})

    test("concat", async () => {
        const sequence1 = Enumerable.of([1,2, 3])
        const sequence2 = Enumerable.of([1,2, 3])

        const selection = enumerable.Select((val): {name: string} => ({
            name: val.name
        }))
        const results = []

        for await (const result of selection) {
            // console.info(`Result : ${JSON.stringify(result)}`)
            results.push(result)
        }

        let expectedResult = [{name: "Greg"}, {name: "Roman"}, {name: "Leo"}]
        expect(results).toEqual(expectedResult)
    })

    // test("concat-toArray", async () => {
    //     const enumerable = Enumerable.of([
    //         {name: "Greg", val: 50},
    //         {name: "Roman", val: 60},
    //         {name: "Leo", val: 50}
    //     ])
    //     const selection = enumerable.Select((val): {name: string} => ({
    //         name: val.name
    //     }))
    //     const names = selection.toArray()
    //     const results = await names

    //     const expectedResult = [{name: "Greg"}, {name: "Roman"}, {name: "Leo"}]
    //     expect(results).toEqual(expectedResult)
    // })
})
