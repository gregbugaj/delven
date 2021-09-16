import {Enumerable} from "../query/internal"

describe("Enumerable Select", () => {
    beforeAll(() => {})

    test("select-iterator", async () => {
        const enumerable = Enumerable.of([
            {name: "Greg", val: 50},
            {name: "Roman", val: 60},
            {name: "Leo", val: 50}
        ])
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

    test("select-toArray", async () => {
        const enumerable = Enumerable.of([
            {name: "Greg", val: 50},
            {name: "Roman", val: 60},
            {name: "Leo", val: 50}
        ])
        const selection = enumerable.Select((val): {name: string} => ({
            name: val.name
        }))
        const names = selection.toArray()
        const results = await names

        const expectedResult = [{name: "Greg"}, {name: "Roman"}, {name: "Leo"}]
        expect(results).toEqual(expectedResult)
    })

    test("select-AsEnumerable", async () => {
        const queryable = Enumerable.of([
            {name: "Greg", val: 50},
            {name: "Roman", val: 60},
            {name: "Leo", val: 50}
        ]).AsQueryable()

        const selection = queryable.Select((val): {name: string} => ({
            name: val.name
        }))

        const results = await selection.toArray()
        const expectedResult = [{name: "Greg"}, {name: "Roman"}, {name: "Leo"}]
        expect(results).toEqual(expectedResult)
    })
})
