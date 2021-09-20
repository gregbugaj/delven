import {Enumerable} from "../query/internal"

describe("Enumerable Select-Fluent", () => {
    beforeAll(() => {
        // no-op
    })

    test("where-select", async () => {
        const source = [
            {name: "Greg", val: 50},
            {name: "Roman", val: 60},
            {name: "Leo", val: 50}
        ]

        const selection = Enumerable.of(source)
            .Where(p => p.val == 50)
            .Select((val): {name: string} => ({
                name: val.name
            }))

        const results = []

        for await (const result of selection) {
            console.info(`Result : ${JSON.stringify(result)}`)
            results.push(result)
        }

        let expectedResult = [{name: "Greg"}, {name: "Leo"}]
        expect(results).toEqual(expectedResult)
    })

    test("select-where-select", async () => {
        const source = [
            {name: "Greg", val: 50},
            {name: "Roman", val: 60},
            {name: "Leo", val: 50}
        ]

        const selection = Enumerable.of(source)
            .Select(sel => sel)
            .Where(p => p.val == 50)
            .Select((val): {name: string} => ({
                name: val.name
            }))

        const results = []

        for await (const result of selection) {
            console.info(`Result : ${JSON.stringify(result)}`)
            results.push(result)
        }

        let expectedResult = [{name: "Greg"}, {name: "Leo"}]
        expect(results).toEqual(expectedResult)
    })
})
