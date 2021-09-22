import {Enumerable} from "../../query/internal"

describe("Enumerable Iterable", () => {
    beforeAll(() => {
    })

    test("iterable-enumerables-await", async () => {
        const sequence1 = Enumerable.of([1, 2, 3])
        const expectedResult = [1, 2, 3]
        const arr = []

        for await (const val of sequence1) {
            arr.push(val)
        }
        expect(arr).toEqual(expectedResult)
    })

    test("iterable-toArray", async () => {
        const sequence1 = Enumerable.of([1, 2, 3])
        const values = await sequence1.toArray()
        const expectedResult = [1, 2, 3]
        const arr = []

        for (const val of values) {
            arr.push(val)
        }
        expect(arr).toEqual(expectedResult)
    })
})
