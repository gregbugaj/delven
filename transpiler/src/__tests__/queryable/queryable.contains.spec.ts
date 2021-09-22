import {Enumerable} from "../../query/internal"

describe("Queryable Contains", () => {
    beforeAll(() => {
    })

    test("contains-01", async () => {
        let enumerable = Enumerable.of(["apple", "banana", "mango", "orange", "passionfruit", "grape" ]).AsQueryable()
        let fruit = 'mango'
        let hasElements = await enumerable.Contains(fruit)
        expect(hasElements).toBe(true)
    })

    test("contains-02", async () => {
        let enumerable = Enumerable.of(["apple", "banana", "mango", "orange", "passionfruit", "grape" ]).AsQueryable()
        let fruit = 'pineapple'
        let hasElements = await enumerable.Contains(fruit)
        expect(hasElements).toBe(false)
    })

})
