import ASTParser from "../ASTParser"
import ASTNode from "../ASTNode"
import SourceGenerator from "../SourceGenerator";

describe('Select Expression', () => {
    beforeAll(() => {
        ASTParser.trace(false)
    });

    test('Basic select', () => {
        const input = 1.59
        const expectedResult = 1.59

        expect(input).toBe(expectedResult)
    })
})