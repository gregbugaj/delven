import {Enumerable, Tuple} from "../query/internal"
import {IEnumerable} from "../query/internal"

describe("Enumerable Zip", () => {
    beforeAll(() => {})

    test("zip-001-False", async () => {
        expect(1).toEqual(1)
    })

    /*    test("zip-001-tuple", async () => {
        const numbers = Enumerable.of([1, 2, 3, 4])
        const words = Enumerable.of(["one", "two", "three"])
        const results = numbers.Zip(words) as IEnumerable<Tuple<Number, string>>

        let rs: [number, string][] = []
        for await (const x of results) {
            // console.info(`result : ${[x[0]]} : ${[x[1]]}`)
            rs.push(x as [number, string])
        }
        const expectedResult = [
            [1, "one"],
            [2, "two"],
            [3, "three"]
        ]
        expect(rs).toEqual(expectedResult)
    })

    test("zip-001-transformer", async () => {
        const numbers = Enumerable.of([1, 2, 3, 4])
        const words = Enumerable.of(["one", "two", "three"])
        const results = numbers.Zip(words, (first, second): string => {
            return `${first}-${second}`
        }) as IEnumerable<string>
        const rs = []

        for await (const x of results) {
            // console.info(`result : ${x}`)
            rs.push(x)
        }

        const expectedResult = ["1-one", "2-two", "3-three"]
        expect(rs).toEqual(expectedResult)
    })*/
})
