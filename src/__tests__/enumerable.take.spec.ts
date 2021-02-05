
import { Enumerable } from "../query/Enumerable";

describe("Enumerable Take", () => {
    beforeAll(() => { });

    test("take-001", async () => {
        let enumerable = new Enumerable([0, 1, 2, 3, 4, 5, 6, 7, 8])
        let t3 = await enumerable.Take(2).toArray()
        let expectedResult = [0, 1]
        expect(t3).toEqual(expectedResult);
    });
});
