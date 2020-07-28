import ASTParser from "../ASTParser"
import ASTNode from "../ASTNode"
import SourceGenerator from "../SourceGenerator";
import glob from 'glob'
import * as fs from 'fs'
import * as path from 'path'
// import { diffString, diff } from 'json-diff'
import * as jsondiffpatch from 'jsondiffpatch'

export type TestType = "tree" | "tokens" | "path" | "failure"
export type TestCase = {
    name: string,
    type: TestType
    code: string,
    expected: string,
    enabled: boolean
}

function discover(expectType: TestType): TestCase[] {
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
            let basename = assetPath.slice('./test/fixtures'.length + 1, assetPath.indexOf(assetName) - 1)
            basename = basename.replace(/\//g, '.')
            const type = getType(assetName)
            if (type !== expectType){
                continue
            }

            cases.push({
                name: `${basename}[${label}]`,
                type: type,
                code: content,
                expected: fs.readFileSync(assetPath, 'utf-8'),
                enabled: true
            } as TestCase)
        }
    }
    
    // return cases.filter(c => c.name === 'antlr.Generators[generators-symbol-iterator]')
    return cases
}

const toJson = (obj: unknown): string => JSON.stringify(obj, function replacer(key, value) { return value }, 4);

const createOptions = function () {
    return {
        // used to match objects when diffing arrays, by default only === operator is used
        objectHash: function (obj) {
            // this function is used only to when objects are not equal by ref
            return obj._id || obj.id;
        },
        arrays: {
            // default true, detect items moved inside the array (otherwise they will be registered as remove+add)
            detectMove: true,
            // default false, the value of items moved is not included in deltas
            includeValueOnMove: false
        },
        textDiff: {
            // default 60, minimum string length (left and right sides) to use text diff algorythm: google-diff-match-patch
            minLength: 60
        },
        /*propertyFilter: function (name, context) {
            
             this optional function can be specified to ignore object properties (eg. volatile data)
              name: property name, present in either context.left or context.right objects
              context: the diff context (has context.left and context.right objects)
            *
            return name.slice(0, 1) !== '$';
        },/
        cloneDiffValues: false /* default false. if true, values in the obtained delta will be cloned
          (using jsondiffpatch.clone by default), to ensure delta keeps no references to left or right objects. this becomes useful if you're diffing and patching the same objects multiple times without serializing deltas.
          instead of true, a function can be specified here to provide a custom clone(value)
          */
    }
}

const assertSame = function (expected, ast): { same: boolean, delta: any} {
    const a = toJson(ast)
    const b = toJson(expected)
    // bug in json diffpatcher when there is an array with null values `"elements": [null, null, {} ]`
    // to cause a bad compare, example : expression.primary.array[array-0004]
    if (a === b) {
        return { same: true, delta: undefined }
    }

/*     console.info(a)
    console.info('----------------------')
    console.info('----------------------')
    console.info(b) 
 */
    const diffpatcher = jsondiffpatch.create(createOptions())
    const delta = diffpatcher.diff(ast, expected);

    if (delta != undefined) {
        // let annotated = jsondiffpatch.formatters.annotated.format(delta, expected)
        // console.log(delta);
    }

    return { same: delta == undefined, delta: delta }
}

describe('Generated Grammar Test Suite', () => {
    beforeAll(() => {
        ASTParser.trace(false)
    });

    const cases: TestCase[] = discover("tree")
    const mapped = cases.map(_case => [_case.name, _case])
    it.each(mapped)(`%# AST : %s`, (label, _case) => {
        const deck = _case as TestCase
        const ast = ASTParser.parse({ type: "code", value: deck.code })
        const expected = JSON.parse(deck.expected) as ASTNode
        const {same, delta} = assertSame(expected, ast)
        
        expect(delta).toBeUndefined();
    })
})

if(false)
describe('Source Generator Test', () => {
    beforeAll(() => {
        ASTParser.trace(false)
    });

    const cases: TestCase[] = discover("tree")
    const mapped = cases.map(_case => [_case.name, _case])
    it.each(mapped)(`%# Source : %s`, (label, _case) => {
        const deck = _case as TestCase
        const ast = ASTParser.parse({ type: "code", value: deck.code });

        const generator = new SourceGenerator();
        const script = generator.toSource(ast);
        const ast2 = ASTParser.parse({ type: "code", value: script });
        const {same, delta} = assertSame(ast, ast2)

        expect(delta).toBeUndefined();
    })
})