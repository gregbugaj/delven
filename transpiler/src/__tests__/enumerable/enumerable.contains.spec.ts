import {Enumerable} from "../../query/internal"

describe("Enumerable Contains", () => {
    beforeAll(() => {
    })

    test("contains-01", async () => {
        let enumerable = Enumerable.of(["apple", "banana", "mango", "orange", "passionfruit", "grape" ])
        let fruit = 'mango'
        let hasElements = await enumerable.Contains(fruit)
        expect(hasElements).toBe(true)
    })

    test("contains-02", async () => {
        let enumerable = Enumerable.of(["apple", "banana", "mango", "orange", "passionfruit", "grape" ])
        let fruit = 'pineapple'
        let hasElements = await enumerable.Contains(fruit)
        expect(hasElements).toBe(false)
    })

})
