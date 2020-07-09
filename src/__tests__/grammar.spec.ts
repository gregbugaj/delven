import ASTParser from "../ASTParser"
import ASTNode from "../ASTNode"
//import SourceGenerator from "../SourceGenerator";
import Utils from '../util'
import glob from 'glob'
import * as fs from 'fs'
import * as path from 'path'
import { diffString, diff } from 'json-diff'

export type TestType = "tree" | "tokens" | "path"
export type TestCase = {
    name: string,
    type: TestType
    code: string,
    expected: string,
    enabled: boolean
}

function discover(): TestCase[] {
    const results = glob("./test/fixtures/ES6/**/*.js", { sync: true });
    function getType(name: string): TestType {
        return ['tree', 'tokens', 'path', 'failure'].find(type => type === name.split('.')[1]) as TestType
    }

    const cases: TestCase[] = []

    for (const filePath of results) {
        const name = path.basename(filePath)
        const dir = path.dirname(filePath)
        const chunks = name.split('.')
        if (chunks.length != 3) {
            throw new Error("Expected name in format label.module|program.js")
        }
        const content = fs.readFileSync(filePath, 'utf-8')
        const label = chunks[0]
        for (const assetPath of glob(`${dir}/**/${label}.*.json`, { sync: true })) {
            const assetName = path.basename(assetPath)
            cases.push({
                name: label,
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
    it.each(mapped)(`%# test : %s`, (label, _case) => {
        const deck = _case as TestCase
        const ast = ASTParser.parse({ type: "code", value: deck.code });
        const expected = JSON.parse(deck.expected) as ASTNode
        const scores = diff(ast, expected)
        if (scores != undefined) {
            console.log(diffString(ast, expected));
        }
        expect(scores).toBeUndefined();
    })
})