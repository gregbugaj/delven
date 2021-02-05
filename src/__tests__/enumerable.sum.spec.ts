
import { Enumerable } from "../query/Enumerable";

describe("Enumerable Sum", () => {
    beforeAll(() => {});

    test("sum-generic", () => {
        let expectedResult = 6;

        let querySum = new Enumerable(["1", 2, 3])
        let sum0 = querySum.Sum();

        expect(sum0).toBe(expectedResult);
    });


    test("sum-function", () => {
        let expectedResult = 6;

        let querySum = new Enumerable(["1", 2, 3])
        let sum1 = querySum.Sum((val: number | string): number => {
            if (typeof val == 'string')
                return parseInt(val)
            return val
        });

        expect(sum1).toBe(expectedResult);
    });


    test("sum-undefined", () => {
        let expectedResult = 2;

        let querySum = new Enumerable(["1", "1", 2, 3])
        let sum1 = querySum.Sum((val: number | string): number => {
            if (typeof val == 'string')
                return parseInt(val)
            return undefined
        });

        expect(sum1).toBe(expectedResult);
    });
});
