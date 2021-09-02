import ASTParser, { ErrorNode } from "./ASTParser"
import SourceGenerator from "./SourceGenerator"
import Utils from "./util"
import * as fs from "fs"
import { resolve } from "path"
// import * as chalk from "chalk"
import chalk from "chalk"
import SourceGeneratorWithBuilder from "./SourceGenerator"
import { type } from "os"
import { PrintVisitor } from "./PrintVisitor"
import { assert } from "console"
import { Enumerable } from "./query/internal"

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
  const codexx = `
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

  // const code = `let x = ()=> {1}`
  // const code = `select x, css('#s', 1) as s, css('#z') as z from http://google.com where 1==1 || 2==2 && css('#s') == true`
  // const code = `({x, ...y} = {x, ...y})` // Needs proper quotes
  // const code = `({x} = {x})`
  // const code = `{ do { } while (false) false }`
  // const code = `let x = 1 + 2 + 3 / 2`
  // const code = `let k = (1+2) * x++`
  // const code = `let k = (1+2) * (1 * x++)`
  // const code = `(function(){ return x; })()`
  // const code = `let k = [...(1+1) * 2]`
  // const code = `[...(fun() + x)]`
  // const code = `if(zz + 2 == (x == 2 ^ 2)){}`
  // const code = `e => ({ property: 42 })`
  // const code = `(x) => ((y, z) => (x, y, z))`
  // const code = `1+2 * (2+1)`
  // const code = `k = { *foo() {} }`
  // const code = `let k = ((x)=> 1, (y)=>2)`
  const codeXXX = `
        (function funa() {
        func(() => {thing(); console.info(a);}, identifier);
        })()

        function z(){
        let z = 1
        }
    `

  let code = `
    {
        {}
        function a(){{let levela1 = {abc}} }
        function b(){
          function x(){}
        }
        {
          let x = 1
          let w = {a:1, b:2, z:function(){let k = 1; ()=>{ m++}},z:2}
          }
      }
    `
  // const code = `{{} {x = 1}} {} {} let x = 1 + 2`
  // const code = `{{} {x = 1; y = 1+ 2 / 2}} {} let x = 1 + 2`
  // const code = `{let x = 1 + 2; y = 2} `
  // const code = `if( x == 1) {{x =1,y=2, 4}}`
  code = `{function x(){
        {{}}
        let x = {}

    }} `

  // code = `function x(){{}}`
  // code = `try{} catch(e){} finally{{let x=2}}`
  // code = `try{} catch(e){} finally{{let x=2}}`

  code = `let x =function(){}`
  code = `for(let x= 1; x<2;++i){}`
  // code = `for(let x=1;i<2;){}`
  // code = `for(let x=1;i<2; k++){}`
  // code = `for(1;2;3){}`
  // code = `for(;;){}`
  code = `while(x<10){}`
  code = `do {}while(true)`
  code = `do {x=1}while(true)`
  code = `

    {
        if (x)
          x
        else if(y)
          y
        else if(z)
          z, s
        }

    `
  code = `

    if(z) z, s
    {
        x+q, ad
      }
    `

  code = "(1,2),3"

  code = `

    if (true)
    return 1
  else if (false)
    return xx
  else if (false) {a}
  else 2

    `

  code = `
    if (1 == x) return 1+1
    if (1 == x) {
        return 1+1
    }else if(2 == x) {return 2
    }
    // if (1 == x) return 1
    // else if(2 == x) return 2
    // else if(3 == x) return 3
    // else {
    // if(x==y) return 3
    // }
    `

  code = `
       let x = select x from source()
    `

  const parser_label = chalk.green("parser")
  console.time(parser_label)
  const ast = ASTParser.parse({ type: "code", value: code })
  console.info("Serialized")
  console.info(Utils.toJson(ast))
  console.timeEnd(parser_label)

  const generator_label = chalk.green("generator")
  console.time(generator_label)
  const generator = new SourceGeneratorWithBuilder()
  const script = generator.toSource(ast)
  console.info("-------")
  console.info(script)

  console.info("----SOURCE----")
  console.info(code)

  console.timeEnd(generator_label)
}

async function enumerable001() {
  let queryWhere = new Enumerable([1, 2, "A", 1, 2, 3, 2, 3])
  // let results = await queryWhere.Where((val: string | number) => {return val === 2}).Take(2).toArray()
  let results = await queryWhere.Where((val: string | number) => { return val === 2 }).Take(3).toArray()

  console.info(results)
}

async function enumerable002() {
  let queryWhere = new Enumerable([1, 2, "A", 1, 2, 3, 2, 3])
  // let results = await queryWhere.Where((val: string | number) => {return val === 2}).Take(2).toArray()
  let results = queryWhere.Where((val: string | number) => { return val === 2 }).Take(3).Take(1)

  for await (let x of results) {
    console.info(x)
  }
}
async function enumerable003() {
  let queryWhere = [1, 2, "A", () => 3].asEnumerable()
  let results = queryWhere.Where((val: string | number) => { return val === 2 }).Select()
  for await (let x of results) {
    console.info(x)
  }
}

async function enumerable() {
  let enumerables = [1, 2, 2, 3, 3].asEnumerable()
  // lazy evaluated
  let results = enumerables.Where(x => x === 2).Select(x => `item-${x}`).Take(1)
  for await (let x of results) {
    console.info(x)
  }
}

; (async () => {
  // await query()
  await main()

  // await enumerable()
  console.info("Transpiler")
})().catch(err => {
  console.error("error in main", err)
})

// Trick to prevent  > All files must be modules when the '--isolatedModules' flag is provided.ts(1208)
export { ASTParser, SourceGenerator }
