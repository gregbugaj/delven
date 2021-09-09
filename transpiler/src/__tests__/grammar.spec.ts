import ASTParser, {ErrorNode} from "../ASTParser"
import ASTNode from "../ASTNode"
import glob from "glob"
import * as fs from "fs"
import * as path from "path"
import Utils from "../util"
// import { diffString, diff } from 'json-diff'
import * as jsondiffpatch from "jsondiffpatch"
import SourceGeneratorWithBuilder from "../SourceGenerator";

export type TestType = "tree" | "tokens" | "path" | "failure" | "raw"
export type TestCase = {
    name: string
    type: TestType
    code: string
    expected: string
    enabled: boolean
}

function discover(expectType: TestType): TestCase[] {
    const results = glob("./test/fixtures/**/*.js", {sync: true})

    function getType(name: string): TestType {
        return ["tree", "tokens", "path", "failure"].find(type => type === name.split(".")[1]) as TestType
    }

    const cases: TestCase[] = []

    for (const filePath of results) {
        const name = path.basename(filePath)
        const dir = path.dirname(filePath)
        const chunks = name.split(".")
        const content = fs.readFileSync(filePath, "utf-8")
        const label = chunks[0]

        if (expectType === "raw") {
            const assetName = path.basename(filePath)
            let basename = filePath.slice("./test/fixtures".length + 1, filePath.indexOf(assetName) - 1)
            basename = basename.replace(/\//g, ".")
            cases.push({
                name: `${basename}[${label}]`,
                type: "raw",
                code: content,
                expected: content,
                enabled: true
            } as TestCase)
        } else {
            for (const assetPath of glob(`${dir}/**/${label}.*.json`, {
                sync: true
            })) {
                const assetName = path.basename(assetPath)
                let basename = assetPath.slice("./test/fixtures".length + 1, assetPath.indexOf(assetName) - 1)
                basename = basename.replace(/\//g, ".")
                const type = getType(assetName)
                if (type !== expectType) {
                    continue
                }

                cases.push({
                    name: `${basename}[${label}]`,
                    type: type,
                    code: content,
                    expected: fs.readFileSync(assetPath, "utf-8"),
                    enabled: true
                } as TestCase)
            }
        }
    }

    // return cases.filter(c => c.name === 'es2018.rest-property[destructuring-mirror]')
    // return cases.filter(c => c.name === 'es2017.trailing-commas[trailing-comma-new]')
    // return cases.filter(c => c.name === 'prettier.sequence[sequence-001]')
    // return cases.filter(c => c.name === 'antlr.ArrowFunctions[StatementBodies]')
    // return cases.filter(c => c.name === 'statement.labelled[migrated_0001]')
    // return cases.filter(c => c.name === 'ES6.identifier[escaped_math_alef]')
    // return cases.filter(c => c.name === 'ES6.identifier[escaped_math_dal_part]')
    // return cases.filter(c => c.name.indexOf('class-001') > -1)
    // return [cases[0]]
    return cases
    // return []
}

const createOptions = function () {
    return {
        // used to match objects when diffing arrays, by default only === operator is used
        objectHash: function (obj) {
            // this function is used only to when objects are not equal by ref
            return obj._id || obj.id
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

        /*  propertyFilter: function (name, context) {
              console.info(`:::: ${name}`)
              if (name == 'start' || name== 'end'){
                  let left = context.left[name], right = context.right[name];
                  context.left[name] = 0
                  context.right[name] = 0
                  return false
              }

              return true
          },*/

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

const hasError = (ast: any): boolean => ast instanceof ErrorNode

const assertSame = function (expected, ast): { same: boolean; delta: any } {
    const a = Utils.toJson(ast)
    const b = Utils.toJson(expected)

    console.debug(a)
    console.debug(b)
    // bug in json diffpatcher when there is an array with null values `"elements": [null, null, {} ]`
    // to cause a bad compare, example : expression.primary.array[array-0004]
    if (a === b) {
        return {same: true, delta: undefined}
    }

    /*     console.info(a)
        console.info('----------------------')
        console.info('----------------------')
        console.info(b) 
     */
    const diffpatcher = jsondiffpatch.create(createOptions())
    const delta = diffpatcher.diff(ast, expected)

    if (delta != undefined) {
        // let annotated = jsondiffpatch.formatters.annotated.format(delta, expected)
        console.log(delta)
    }

    return {same: delta == undefined, delta: delta}
}

if (false)
    describe("Generated Grammar Test Suite", () => {
        beforeAll(() => {
            ASTParser.trace(false)
        })

        const cases: TestCase[] = discover("tree")
        const mapped = cases.map(_case => [_case.name, _case])

        it.each(mapped)(`%# AST : %s`, (label, _case) => {
            const deck = _case as TestCase
            const ast = ASTParser.parse({type: "code", value: deck.code})

            if (hasError(ast)) {
                const detail = ast.toString()
                const emsg = `Parsing error for :
            \n${detail}\n
            ------------------Source-----------------------
            \n${deck.code}\n
             `
                throw new Error(emsg)
            }

            const expected = JSON.parse(deck.expected) as ASTNode
            const {same, delta} = assertSame(expected, ast)

            expect(delta).toBeUndefined()
        })
    })


/**
 *
 * @param obj the object to sanitize
 */
function sanitize(obj: any | null): void {
    if (obj == null) {
        return
    }

    // delete start/end location nodes so we can perform JSON diff
    delete obj["start"]
    delete obj["end"]

    const keys = Object.getOwnPropertyNames(obj)

    for (const key in keys) {
        const name = keys[key]
        // make sure that we are not following
        if (obj[name] && typeof obj[name] === "object" && name !== '__parent__') {
            sanitize(obj[name])
        }
    }
}

describe("Source-to-Source Test", () => {
    beforeAll(() => {
        ASTParser.trace(false)
    })

    const cases: TestCase[] = discover("raw")
    const mapped = cases.map(_case => [_case.name, _case])

    it.each(mapped)(`%# Source : %s`, (label, _case) => {
        const deck = _case as TestCase
         // deck.code = `   var 𞸀`
        // console.info(deck.code)
        const ast = ASTParser.parse({type: "code", value: deck.code})

        if (hasError(ast)) {
            const detail = ast.toString()
            const emsg = `Parsing error for source-to-source translation :
            \n${detail}\n
            ------------------Source-----------------------
            \n${deck.code}\n
             `
            throw new Error(emsg)
        }

        const generator = new SourceGeneratorWithBuilder()
        let script = generator.toSource(ast)

        console.info("script")
        console.info(deck.code)
        console.info(script)

        const ast2 = ASTParser.parse({type: "code", value: script})

        if (hasError(ast2)) {
            const detail = ast2.toString()
            const emsg = `Parsing error for source-to-source translation :
            \n${detail}\n
            ------------------Source-----------------------
            \n${deck.code}\n
            ------------------Target-----------------------
            \n${script}\n
            -----------------------------------------------
             `
            throw new Error(emsg)
        }

        // both source and target AST should be this same
        sanitize(ast)
        sanitize(ast2)

        const {same, delta} = assertSame(ast, ast2)

        if (delta) {
            console.info("AST Trees")
            const a = Utils.toJson(ast)
            const b = Utils.toJson(ast2)
            console.info(a)
            console.info(b)
            // Utils._write('/tmp/delta-a.json', a)
            // Utils._write('/tmp/delta-b.json', b)
        }

        expect(delta).toBeUndefined()
    })
})
