import ASTParser from "../ASTParser";
import MockQuerySource from "./MockDataProvider";

describe("Datasource provider", () => {
    beforeAll(() => {
        ASTParser.trace(false);
    });

    test("Mock provider", async () => {
        const expectedResult = 5;
        let input = 0;
        const provider = MockQuerySource.create(expectedResult, 0, (index) => index);
        for await (const val of provider.iter()) {
            //   console.info(`provider iter : ${val}`);
            ++input;
        }

        expect(input).toBe(expectedResult);
    });

    test("Mock provider iterator[symbol]", async () => {
        const expectedResult = 5;
        let input = 0;
        const provider = MockQuerySource.create(expectedResult, 0, (index) => index);
        for await (const val of provider) {
            console.info(`provider iter : ${val}`);
            ++input;
        }

        expect(input).toBe(expectedResult);
    });
});
