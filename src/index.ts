import ASTParser, { ErrorNode } from "./ASTParser"
import SourceGenerator from "./SourceGenerator";
import Utils from './util'
import * as fs from "fs"
import { resolve } from "path"
import fetch from 'node-fetch'

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

    const code = `    
    var \u{41}\u{42}\u{43}; var \u{4133}
`
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