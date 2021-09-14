import {Enumerable} from "../query/internal"

describe("Enumerable Concat", () => {
    beforeAll(() => {})

    test("concat-enumerables", async () => {
        const sequence1 = Enumerable.of([1, 2, 3])
        const sequence2 = Enumerable.of([4, 5, 6])

        const results = sequence1.Concat(sequence2)

        const expectedResult = [1, 2, 3, 4, 5, 6]
        const arr = await results.toArray()
        const arr2 = await results.toArray()

        expect(arr).toEqual(arr2)
        expect(arr).toEqual(expectedResult)
    })


    test("concat-iterable", async () => {
        const sequence1 = Enumerable.of([1, 2, 3])
        const sequence2 = [4, 5, 6]

        const results = sequence1.Concat(sequence2)

        const expectedResult = [1, 2, 3, 4, 5, 6]
        const arr = await results.toArray()
        const arr2 = await results.toArray()

        expect(arr).toEqual(arr2)
        expect(arr).toEqual(expectedResult)
    })
})
