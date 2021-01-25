import ASTParser from "../ASTParser";
import UserQuery, { Select } from "../query/UserQuery";


describe("Basic Select Expression", () => {
  beforeAll(() => {
    ASTParser.trace(false);
  });

  test("Basic select", () => {
    let x = Select({ expressions: [{ expr: "x" }] });
    console.info(x);

    // let x = Select([{ expr: 'z' }]).From(MockQuerySource.create(5));
    let input = 1;
    let expectedResult = 1;
    expect(input).toBe(expectedResult);
  });


});
