import {Enumerable} from "../query/internal"

/***
 *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols
 */
describe("Enumerable Iterator", () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    beforeAll(() => {
    })

    test("basic-async-iter", async () => {
        const src = [2, 6, 4, 8]
        const numbers = Enumerable.of(src)
        const results = []
        for await (const val of numbers) {
            results.push(val)
        }
        expect(results).toEqual(src)
    })

    test("primitive-async-iter", async () => {
        const src = 4
        const numbers = Enumerable.of(src)
        const results = []
        for await (const val of numbers) {
            results.push(val)
        }
        expect(results).toEqual([src])
    })

    /**
     * A String is an example of a built-in iterable object
     * Strings iterate over characters so the return value will be a char array
     */
    test("string-async-iter", async () => {
        const src = "TEST"
        const enumerable = Enumerable.of(src)
        const results = []
        for await (const val of enumerable) {
            results.push(val)
        }
        expect(results).toEqual(["T", "E", "S", "T"])
    })

    test("basic-iter", async () => {
        const src = [2, 6, 4, 8]
        const numbers = Enumerable.of(src)
        const results = []
        // @ts-ignore
        for (const val of numbers) {
            results.push(val)
        }
        expect(results).toEqual(src)
    })
})
