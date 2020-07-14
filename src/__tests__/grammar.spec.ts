import ASTParser from "../ASTParser"
import ASTNode from "../ASTNode"
import SourceGenerator from "../SourceGenerator";
import glob from 'glob'
import * as fs from 'fs'
import * as path from 'path'
// import { diffString, diff } from 'json-diff'
import * as jsondiffpatch from 'jsondiffpatch'

export type TestType = "tree" | "tokens" | "path"
export type TestCase = {
    name: string,
    type: TestType
    code: string,
    expected: string,
    enabled: boolean
}

function discover(): TestCase[] {
    const results = glob("./test/fixtures/**/*.js", { sync: true });
    function getType(name: string): TestType {
        return ['tree', 'tokens', 'path', 'failure'].find(type => type === name.split('.')[1]) as TestType
    }

    const cases: TestCase[] = []

    for (const filePath of results) {
        const name = path.basename(filePath)
        const dir = path.dirname(filePath)
        const chunks = name.split('.')
        const content = fs.readFileSync(filePath, 'utf-8')
        const label = chunks[0]

        for (const assetPath of glob(`${dir}/**/${label}.*.json`, { sync: true })) {
            const assetName = path.basename(assetPath)
            const basename = path.basename(path.dirname(assetPath))
            cases.push({
                name: `${basename}[${label}]`,
                type: getType(assetName),
                code: content,
                expected: fs.readFileSync(assetPath, 'utf-8'),
                enabled: true
            } as TestCase)
        }
    }
    return cases
}

describe('Generated Grammar Test Suite', () => {
    beforeAll(() => {
        ASTParser.trace(false)
    });

    const cases: TestCase[] = discover()
    const mapped = cases.map(_case => [_case.name, _case])
    it.each(mapped)(`%# AST : %s`, (label, _case) => {
        const deck = _case as TestCase
        const ast = ASTParser.parse({ type: "code", value: deck.code });
        const expected = JSON.parse(deck.expected) as ASTNode
        // create a configured instance, match objects by name
        // undefined => no difference
        const diffpatcher = jsondiffpatch.create({});
        const delta = diffpatcher.diff(ast, expected);
        if (delta != undefined) {
            console.log(delta);
        }
        expect(delta).toBeUndefined();
    })
})

describe('Source Generator Test', () => {
    beforeAll(() => {
        ASTParser.trace(false)
    });

    const cases: TestCase[] = discover()
    const mapped = cases.map(_case => [_case.name, _case])
    it.each(mapped)(`%# Source : %s`, (label, _case) => {
        const deck = _case as TestCase
        const ast = ASTParser.parse({ type: "code", value: deck.code });

        const generator = new SourceGenerator();
        const script = generator.toSource(ast);

        const ast2 = ASTParser.parse({ type: "code", value: script });
        const diffpatcher = jsondiffpatch.create({});

        const delta = diffpatcher.diff(ast, ast2);
        if (delta != undefined) {
            console.log(delta);
        }
        expect(delta).toBeUndefined();
    })
})