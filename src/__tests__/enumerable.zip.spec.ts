
import { Enumerable } from "../query/internal";
import { IEnumerable } from "../query/internal";

describe("Enumerable Zip", () => {
    beforeAll(() => { });

    test("zip-001", async () => {
        const numbers = Enumerable.of([1, 2, 3, 4])
        const words = Enumerable.of(['one', 'two', 'three'])
        let results:IEnumerable<string> = numbers.Zip(words)
        let rs = await results
        console.info(rs)

        for await(const x of results){

        }
        // for await(const result of results){
        //     console.info(`result : ${result}`)
        // }

        // expect(result).toEqual(expectedResult);
    });
});
