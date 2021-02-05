import MockQuerySource from "./MockDataProvider";

describe("Mock datasource provider", () => {
    beforeAll(() => {
        // noop
    });

    test("Mock provider", async () => {
        const expectedResult = 5;
        let input = 0;
        const provider = MockQuerySource.create(expectedResult, 0, (index) => index);
        for await (const val of provider.iter()) {
            ++input;
        }

        expect(input).toBe(expectedResult);
    });

    test("Mock provider iterator[symbol]", async () => {
        const expectedResult = 5;
        let input = 0;
        const provider = MockQuerySource.create(expectedResult, 0, (index) => index);
        for await (const val of provider.iter()) {
            ++input;
        }

        expect(input).toBe(expectedResult);
    });

    test("Mock provider iterator of iterator", async () => {
        const expectedResult = 2;
        let input = 0;
        const provider = MockQuerySource.create(expectedResult, 0, (index) => index);
        for await (const iter of provider.iterOfIter()) {
            for await (const val of iter) {
                ++input
            }
        }

        expect(input).toBe(expectedResult * 2);
    });
});
