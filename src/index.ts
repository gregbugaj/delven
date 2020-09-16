import ASTParser, { ErrorNode } from "./ASTParser"
import SourceGenerator from "./SourceGenerator";
import Utils from './util'
import * as fs from "fs"
import { resolve } from "path"

async function main() {
    /*
                  let iter = { *[Symbol.iterator]() {}}
                  let iter = { *[()=>{}]() { }}
                  */


    // ({ [x]() { } }) computed  = true
    // ({ foo() { } })  computed  = false
    // ;({ async foo() { } })
    // ;({ *foo() { } })
    // ;({ get foo() { } })
    // ;({ get [foo]() { } })
    // ;({ set foo(x) { } })
    // ;({ set [foo](x) { } })

    // let a = async function () { }  
    // let b = async function foo() { }  
    // let c = function () { }  
    // let d = function foo() { }  
    // let e = function* () { }  
    // let f = function* foo() { }  
    // let g = ()=>  { }
    // let h = async  ()=>  { }
    // let i = ()=>  1
    // let j = async ()=>  1
    // let k  = class cls {	method(){} }
    // let l  = class cls {	get method(){} }
    // let m  = class cls { set method(x){} }
    // let n  = class cls { set [method](x){} }
    // let o = {'x': function foo(n) {return 1}};

    const codeX = `    
  let ℮
`
    //    const code = "`$` "

const codezz = `
    odds  = evens.map(v => v + 1)
    pairs = evens.map(v => ({ even: v, odd: v + 1 }))
    nums  = evens.map((v, i) => v + i)
 `
    // const code = fs.readFileSync('test/fixtures/ES6/identifier/escaped_math_zain_start.js', "utf8")
 
    // x = y?.z 
    // x = y()?.test
    // y?.test()
    // const code =  "let x = tag`A ${1+2} B + C${b}D`"

    // ({x, ...y} = {x, ...y})
    const code = `
    odds  = evens.map(v => v + 1)
    pairs = evens.map(v => ({ even: v, odd: v + 1 }))
    nums  = evens.map((v, i) => v + i)
    `

    // antlr.ArrowFunctions[ExpressionBodies]
   
//  antlr.Classes[ClassDefinition]

    // x = {fun(){}, ...z} 
    // Bad source
    // let x = {async test(){}} 
    // x = {fun(){}, z} 

    const ast = ASTParser.parse({ type: "code", value: code });
    console.info(Utils.toJson(ast))

    const generator = new SourceGenerator();
    const script = generator.toSource(ast);
    console.info('-------')
    console.info(script)

    console.info('----SOURCE----')
    console.info(code)
    const dir = resolve(__dirname, '../test/fixtures', ...["", ""])
}

(async () => {
    await main()
})().catch(err => {
    console.error("error in main", err)
})

// Trick to prevent  > All files must be modules when the '--isolatedModules' flag is provided.ts(1208)
export { } 



