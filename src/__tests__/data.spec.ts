import ASTParser from "../ASTParser";
import MockQuerySource from "../query/MockQuerySource";

describe("Datasource provider", () => {
  beforeAll(() => {
    ASTParser.trace(false);
  });

  test("Mock provider", async () => {
    let expectedResult = 5;
    let input = 0;
    let provider = MockQuerySource.create(expectedResult);
    for await (const val of provider.iter()) {
      //   console.info(`provider iter : ${val}`);
      ++input;
    }

    expect(input).toBe(expectedResult);
  });

  test("Mock provider iterator[symbol]", async () => {
    let expectedResult = 5;
    let input = 0;
    let provider = MockQuerySource.create(expectedResult);
    for await (const val of provider) {
      console.info(`provider iter : ${val}`);
      ++input;
    }

    expect(input).toBe(expectedResult);
  });
});
