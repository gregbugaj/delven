import * as antlr4 from "antlr4"
import { ECMAScriptParser as DelvenParser } from "./parser/ECMAScriptParser"
import { ECMAScriptLexer as DelvenLexer } from "./parser/ECMAScriptLexer"

import ASTParser, { ParserType } from "./ASTParser"
import SourceGenerator from "./SourceGenerator";
import * as fs from 'fs'

let toJson = (obj: any): string => JSON.stringify(obj, function replacer(key, value) { return value }, 2);

function writeJson(outputFilename: string, obj: any): void {
        fs.writeFile(outputFilename, toJson(obj), function (err) {
                if (err) {
                        console.log(err);
                } else {
                        console.log("JSON saved to " + outputFilename);
                }
        });
}

console.info('Transpiller');
let input1 = "1"
let input2 = "var x = function(y, z) { console.info('this is a string') ; }"
let input3 = "var x =  2 + 4"

/* 
const input = "1";
const chars = new antlr4.InputStream(input);
const lexer = new DelvenLexer(chars);
lexer.strictMode = false;
const tokens = new antlr4.CommonTokenStream(lexer);
const parser = new DelvenParser(tokens);
parser.buildParseTrees = true;
const tree = parser.program(); */

console.info("---------------------");
//let result = tree.accept(this.visitor);


/*
        {
        true 
        false
        "true"
        }
 */

 // literals

//  let ast = ASTParser.parse({ type: "code", value: ' 1 '}); //NumericLiteral
//  let ast = ASTParser.parse({ type: "code", value: ' 1,2,3,4 '}); 
//  let ast = ASTParser.parse({ type: "code", value: ' true '}); 
//  let ast = ASTParser.parse({ type: "code", value: ' "test xyz" '}); 
//  let ast = ASTParser.parse({ type: "code", value: " 'test xyz' "}); 
//  let ast = ASTParser.parse({ type: "code", value: ' /[a-z]/gi '}); 
//  let ast = ASTParser.parse({ type: "code", value: '`Payload ${Param1} middle ${Param2} endof ${Param3} end`'}); 

//let astparser = ASTParser.parse({ type: "code", value: "source" }, ParserType.ECMAScript);
// let ast = ASTParser.parse({ type: "code", value: "{ var x = 1;   var x = 2; }" });
// let ast = ASTParser.parse({ type: "code", value: "{ {  } }" });
// let ast = ASTParser.parse({ type: "code", value: "  x = 1  " });
// let ast = ASTParser.parse({ type: "code", value: "  let x = 1  " });
// let ast = ASTParser.parse({ type: "code", value: "  x /= 1  " });
//let ast = ASTParser.parse({ type: "code", value: "{ { 1, true, 'A'} } " });
//  let ast = ASTParser.parse({ type: "code", value: "trurm e, 1, 'A', \"X\"" });
//let ast = ASTParser.parse({ type: "code", value: "x = 1" });
//  let ast = ASTParser.parse({ type: "code", value: " 1, true, 'A' "});
//let ast = ASTParser.parse({ type: "code", value: " 1.2 ,true, \"Text\""});
// let ast = ASTParser.parse({ type: "code", value: " function AA(x, y){}"});
// let ast = ASTParser.parse({ type: "code", value: " function AA(x, y){}  function BB(x, y){} "});

// let ast = ASTParser.parse({ type: "code", value: "(1 + 1)"});
//let ast = ASTParser.parse({ type: "code", value: "1 + 2"});
//let ast = ASTParser.parse({ type: "code", value: "x / 2"});
// let ast = ASTParser.parse({ type: "code", value: "x / 1  + 1"});
//let ast = ASTParser.parse({ type: "code", value: "x + 1 + 1"});
//let ast = ASTParser.parse({ type: "code", value: "y = x + 1 + 1"});
/////..let ast = ASTParser.parse({ type: "code", value: "x = 1+2"});
// let ast = ASTParser.parse({ type: "code", value: "var x = 1 + 1"});
// let ast = ASTParser.parse({ type: "code", value: "x = [x, 2 + 1]"});
// let ast = ASTParser.parse({ type: "code", value: "[1, 2, 3,,,,]"});
//let ast = ASTParser.parse({ type: "code", value: "var x, y"});
//let ast = ASTParser.parse({ type: "code", value: 'x = {"A": 1, x:2}'});
//let ast = ASTParser.parse({ type: "code", value: '[11,,,]'});
// let ast = ASTParser.parse({ type: "code", value: 'var x = {"a":1}'});
//let ast = ASTParser.parse({ type: "code", value: 'var x = [1,2]'});
//let ast = ASTParser.parse({ type: "code", value: ' var x = [1, {}]'});
// let ast = ASTParser.parse({ type: "code", value: ' var x = [1, {"a":23, z:"abc"}]'});
// let ast = ASTParser.parse({ type: "code", value: '(1 + 1 )'});
// let ast = ASTParser.parse({ type: "code", value: ' x != 1 '});
//let ast = ASTParser.parse({ type: "code", value: ' if(x != 1){ }'});
// let ast = ASTParser.parse({ type: "code", value: ' if(x){ }'});
//let ast = ASTParser.parse({ type: "code", value: ' if(x != 1){ } else {} '});
//let ast = ASTParser.parse({ type: "code", value: ' if(x != 1){ } else if (x == 2) {}'});
//let ast = ASTParser.parse({ type: "code", value: ' if(x != 1){ } else if (x == 2) {} else {}'});
// let ast = ASTParser.parse({ type: "code", value: ' x = y.z '});
//let ast = ASTParser.parse({ type: "code", value: ' x[1] '}); 
//let ast = ASTParser.parse({ type: "code", value: ' x+=1 '}); 
//let ast = ASTParser.parse({ type: "code", value: ' x+=y '});

// let ast = ASTParser.parse({ type: "code", value: 'async function test() {}'});
//let ast = ASTParser.parse({ type: "code", value: 'import * as antlr4 from "antlr4"'});
// let ast = ASTParser.parse({ type: "code", value: 'try{}catch(e){}'});
// let ast = ASTParser.parse({ type: "code", value: ' function gen(x, y){} '});
// let ast = ASTParser.parse({ type: "code", value: ' async function gen(x, y){} '});
//  let ast = ASTParser.parse({ type: "code", value: 'async function* gen(z, x = 2, y){} '});

// Class Defintion
// let ast = ASTParser.parse({ type: "code", value: ' class x {}'}); 
// let ast = ASTParser.parse({ type: "code", value: ' class x extends y {}'});  // Fixme
// let ast = ASTParser.parse({ type: "code", value: ' class x extends function(){} {} '});   // FIXME
// let ast = ASTParser.parse({ type: "code", value: ' class x { constructor(w, h) {} } '}); 
// let ast = ASTParser.parse({ type: "code", value: ' class x { constructor(w, h) {}  hello() {} } '}); 
//let ast = ASTParser.parse({ type: "code", value: ' class x { static hello() {} } '}); 
// let ast = ASTParser.parse({ type: "code", value: ' class x { * hello() {} } '}); 
// let ast = ASTParser.parse({ type: "code", value: ' class x { static hello() {} } '});  // FIXME
// let ast = ASTParser.parse({ type: "code", value: " class Animal { constructor(name = 'anonymous', legs = 4, noise = 'nothing') {} } "});  

// Class Expressions 
// let ast = ASTParser.parse({ type: "code", value: 'let x = class y {}'});  
// let ast = ASTParser.parse({ type: "code", value: 'let x = class {}'});  
// let ast = ASTParser.parse({ type: "code", value: 'let x = (class {})'});  
// let ast = ASTParser.parse({ type: "code", value: ' class x { constructor(w, h) {this.p1 = 2} }  '}); 

// let ast = ASTParser.parse({ type: "code", value: 'class x extends y {} '});// Call stack
// let ast = ASTParser.parse({ type: "code", value: 'class x extends function() {} {}'}); // Call stack
// let ast = ASTParser.parse({ type: "code", value: 'class x extends function() {} {}'});// Call stack
// let ast = ASTParser.parse({ type: "code", value: 'class x {constructor(){}}'});// Call stack



// VariableDeclarator 
// let ast = ASTParser.parse({ type: "code", value: 'let x = 2'});
//let ast = ASTParser.parse({ type: "code", value: 'let {} = {"a":2, "b":4}'});
//let ast = ASTParser.parse({ type: "code", value: 'let {x, z} = {"a":2, "b":4}'});
// let ast = ASTParser.parse({ type: "code", value: 'let x, y = {"A":2, "B":1}'});
//let ast = ASTParser.parse({ type: "code", value: 'let x, y = 1'});
//let ast = ASTParser.parse({ type: "code", value: 'let [x, y] = 1'}); 
// let ast = ASTParser.parse({ type: "code", value: 'let {x, y} = 1'}); 
//let ast = ASTParser.parse({ type: "code", value: 'let {x=2, y} = 1'});  // THIS BREAKS OUR GRAMMAR We expect AssignmentPattern


// Object Literall Expressions

// let ast = ASTParser.parse({ type: "code", value: ' x = {} '}); 
// let ast = ASTParser.parse({ type: "code", value: ' x = {y:1, z:2, a} '}); 
// let ast = ASTParser.parse({ type: "code", value: 'x = {[pxy]: 15} '}); // ComputedPropertyExpressionAssignment
// let ast = ASTParser.parse({ type: "code", value: 'x = {[1+1]: 2, "A":4} '}); // ComputedPropertyExpressionAssignment
//let ast = ASTParser.parse({ type: "code", value: 'x = {"A":2, "B":1, [propName]: 15}'}); // ComputedPropertyExpressionAssignment
//let ast = ASTParser.parse({ type: "code", value: ' x =  {y : {async pxy(){}}}  '}); // 
//let ast = ASTParser.parse({ type: "code", value: ' x = { async pxy(){}} '}); //   FunctionProperty
// let ast = ASTParser.parse({ type: "code", value: ' x = {z : 1, async pxy(){}} '}); //   FunctionProperty
// let ast = ASTParser.parse({ type: "code", value: 'x = {async pxy(){}, byz(){}} '}); 
// let ast = ASTParser.parse({ type: "code", value: 'x = { type: "Monster", name, power }; '});  // Shorthand

// Array Literals
//  let ast = ASTParser.parse({ type: "code", value: 'x = []'}); 
// let ast = ASTParser.parse({ type: "code", value: 'x = [1, 2, 3]' });
//let ast = ASTParser.parse({ type: "code", value: 'let x = [,,...a, b]'}); // SpreadElement
// let ast = ASTParser.parse({ type: "code", value: 'let x = [,,...{a:2}, b]'}); // SpreadElement > ObjectExpression

// let ast = ASTParser.parse({ type: "code", value: ' a:2 '}); //LabeledStatement

// Arrow Function
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions
//  let ast = ASTParser.parse({ type: "code", value: ' ()=> { } '});  //BlockStatement not ObjectLiteral
//  let ast = ASTParser.parse({ type: "code", value: ' ()=> { x = 2 } '});  //BlockStatement not ObjectLiteral
//  let ast = ASTParser.parse({ type: "code", value: ' params => {foo: bar} '}); // LabeledStatement
//  let ast = ASTParser.parse({ type: "code", value: ' params => ({foo: bar}) '}); //  Parenthesize the body of a function to return an object literal expression
//  let ast = ASTParser.parse({ type: "code", value: ' params => ({foo: bar, x:2}, z = 3) '}); //  Parenthesize the body of a function to return an object literal expression
//  let ast = ASTParser.parse({ type: "code", value: '()=>{ a:2 } '}); 
// let ast = ASTParser.parse({ type: "code", value: '()=>{ let x = 1} '}); 
// let ast = ASTParser.parse({ type: "code", value: ' () =>  1 + 1'}); 
// let ast = ASTParser.parse({ type: "code", value: ' test =>  1 + 1'}); 
// let ast = ASTParser.parse({ type: "code", value: 'test=>{}'}); 
// let ast = ASTParser.parse({ type: "code", value: '(test)=>{}'}); 
// let ast = ASTParser.parse({ type: "code", value: ' (param1, param2, ...rest) => {  } '});  // Rest parameters 
// let ast = ASTParser.parse({ type: "code", value: ' let x = (param1, param2, ...rest) => {  } '});  // Rest parameters 
// let ast = ASTParser.parse({ type: "code", value: ' (param1 = defaultValue1, param2) => { 1 }'});  // default parameters 
// let ast = ASTParser.parse({ type: "code", value: ' (param1, param2, ...rest) =>  1 + 1'});  // Expressions 


// New Expression

//  let ast = ASTParser.parse({ type: "code", value: ' let x = new []'}); 
//  let ast = ASTParser.parse({ type: "code", value: ' let x = new [1, 2]'}); 
//  let ast = ASTParser.parse({ type: "code", value: ' let x = new z '}); 
//  let ast = ASTParser.parse({ type: "code", value: ' let x = new z() '}); 
//  let ast = ASTParser.parse({ type: "code", value: ' let x = new z(...k) '}); 
//  let ast = ASTParser.parse({ type: "code", value: ' let x =  new String(z, y, ...rest)'}); 
//  let ast = ASTParser.parse({ type: "code", value: ' let x = Test(x, y)'}); 
//  let ast = ASTParser.parse({ type: "code", value: ' let x = new String(x, y);'}); 
// let ast = ASTParser.parse({ type: "code", value: ' let x = this'}); // This Expression
// Member Expression
// let ast = ASTParser.parse({ type: "code", value: ' let x = z.y'});
// let ast = ASTParser.parse({ type: "code", value: ' let x = z[p]'});
//let ast = ASTParser.parse({ type: "code", value: ' let x = y[z=2]'});

// Function Declaration (FunctionDeclaration vs FunctionExpression)
// let ast = ASTParser.parse({ type: "code", value: 'function x(){}' }); // BlockStatement
//  let ast = ASTParser.parse({ type: "code", value: ' function x(){ {} } ' }); // BlockStatement > BlockStatement
// let ast = ASTParser.parse({ type: "code", value: ' function x(){ {z} } ' }); // FunctionDeclaration BlockStatement > BlockStatement
// let ast = ASTParser.parse({ type: "code", value: ' z = function x(){ } ' }); // ExpressionStatement > FunctionExpression
// let ast = ASTParser.parse({ type: "code", value: ' (function x(){ }) ' }); // ExpressionStatement > FunctionExpression
// let ast = ASTParser.parse({ type: "code", value: ' ((function x(){ })) ' }); // ExpressionStatement > FunctionExpression
// let ast = ASTParser.parse({ type: "code", value: ' z = (function x(){ }) ' }); // ExpressionStatement > FunctionExpression
// let ast = ASTParser.parse({ type: "code", value: ' 1 ' }); 


//let ast = ASTParser.parse({ type: "code", value: 'void x' }); // Void Expressions

// let ast = ASTParser.parse({ type: "code", value: 'x++' });
// let ast = ASTParser.parse({ type: "code", value: '++x' }); 

// ReturnStatement
//  let ast = ASTParser.parse({ type: "code", value: 'function s(){ return  }' });  
//  let ast = ASTParser.parse({ type: "code", value: 'function s(){ return 1 }' });  
//  let ast = ASTParser.parse({ type: "code", value: 'function s(){ return (1, 2) }' });  
// Iterator statements
// let ast = ASTParser.parse({ type: "code", value: 'while(true){ x++ }' });  // WhileStatement > Literal 
// let ast = ASTParser.parse({ type: "code", value: 'while(true, false){ x++ }' });  // WhileStatement > SequenceExpression
// let ast = ASTParser.parse({ type: "code", value: ' while(true){ continue } ' });  
// let ast = ASTParser.parse({ type: "code", value: ' while(true){ continue x; } ' });  
// let ast = ASTParser.parse({ type: "code", value: ' while(true){ break ; } ' });  
// let ast = ASTParser.parse({ type: "code", value: ' while(true){ break x; } ' });  

// Destructuring assignment  *** NOT SUPPORTED
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment
// let ast = ASTParser.parse({ type: "code", value: ' [a, b] = [10, 20]; '}); 
// let ast = ASTParser.parse({ type: "code", value: ' function a(x, y){}'});  // default parameters 

// CallExpression
 //let ast = ASTParser.parse({ type: "code", value: 'method(x, y);'}); 

 // Code gen testing
// let ast = ASTParser.parse({ type: "code", value: "{ {  1,2,3  } }" });
// let ast = ASTParser.parse({ type: "code", value: "{{let x = 1; var y; const z = 2}}" });
// let ast = ASTParser.parse({ type: "code", value: ' x = {1 : 2, "a":2}' });
// let ast = ASTParser.parse({ type: "code", value: ' ({z : 2}) ' });
// let ast = ASTParser.parse({ type: "code", value: ' ({z : (a = 1, b)=>{}}) ' });
// let ast = ASTParser.parse({ type: "code", value: ' ({z : (a = 1, b = [1,, 2, ...rest])=>{}}) ' });
// let ast = ASTParser.parse({ type: "code", value: ' 1+2+(3+4) ' });
// let ast = ASTParser.parse({ type: "code", value: ' 1+2 ' });
// let ast = ASTParser.parse({ type: "code", value: ' 1 && 1 ' });
// let ast = ASTParser.parse({ type: "code", value: ' (1 || 2) && (2 || 3) || 4' });
// let ast = ASTParser.parse({ type: "code", value: ' ({z : (a = 1, b = [1,, 2, ...rest])=>{}}) ' });
// let ast = ASTParser.parse({ type: "code", value: ' ({z : (a = 1, b = [1,, 2, ...(1 + 2)])=>{}}) ' });
//  let ast = ASTParser.parse({ type: "code", value: '(class z {})' });
//  let ast = ASTParser.parse({ type: "code", value: '((class  { constructor () {} }))' });
//  let ast = ASTParser.parse({ type: "filename", value: './tests/codegen/class/001.syntax.js' });
//  let ast = ASTParser.parse({ type: "filename", value: './tests/codegen/arrowfunction/001.syntax.js' });

//  let ast = ASTParser.parse({ type: "filename", value: './tests/codegen/function/006.syntax.js' });
//  let ast = ASTParser.parse({ type: "filename", value: './tests/codegen/array/001.syntax.js' });
//  let ast = ASTParser.parse({ type: "filename", value: './tests/codegen/object/002.syntax.js' });
//  let ast = ASTParser.parse({ type: "filename", value: './tests/codegen/object/003.syntax.js' });

// let ast = ASTParser.parse({ type: "code", value: ' if (x || y) { let z = 1} else {let  w = 2}  ' });
// let ast = ASTParser.parse({ type: "code", value: ' switch(x){ case 1: {} case (1+2): {break;} default: {}} ' });
// let ast = ASTParser.parse({ type: "code", value: ' switch(x, y){ case 1: {} case (1+2): {break _label;} default: {}}  ' });
// let ast = ASTParser.parse({ type: "code", value: ' switch(x==2){ case "x" : {} case (1+2): {break;}  default: { let z =1}}  ' });
// let ast = ASTParser.parse({ type: "code", value: ' switch(x==2){ case (z, x)=>{} : {} case "x" : {} }   ' });
// let ast = ASTParser.parse({ type: "code", value: ' switch(x==2){ default: {let z = 1} } ' });
// let ast = ASTParser.parse({ type: "code", value: '  (z, x)=>{}  ' });
// let ast = ASTParser.parse({ type: "code", value: ' { function x() { } function y() { }  function z() { } } ' });
// let ast = ASTParser.parse({ type: "code", value: ' function x() { } function y() { }  function z() { } ' });
// let ast = ASTParser.parse({ type: "code", value: ' { function x() { }  } ' });
// let ast = ASTParser.parse({ type: "code", value: ' ()=>{} ' }); //ExpressionStatement > ArrowFunctionExpression
// let ast = ASTParser.parse({ type: "code", value: ' x = function(){}' }); // ExpressionStatement > AssignmentExpression >FunctionExpression
// let ast = ASTParser.parse({ type: "code", value: ' ()=> (1+2 !=1) ' });
// let ast = ASTParser.parse({ type: "code", value: ' tips.forEach((tip, i) => console.log("Tip ${i}:" + tip)); ' }); 


// let ast = ASTParser.parse({ type: "code", value: " import defaultExport from 'module_name'; " });
// let ast = ASTParser.parse({ type: "code", value: " import defaultExport, { contentA, contentB } from 'module_name';" });
// let ast = ASTParser.parse({ type: "code", value: " import * as importeModule from 'module_name'; " });
// let ast = ASTParser.parse({ type: "code", value: " import { content as zz, yy, www } from 'module_name'; " });


// Try-Catch
// let ast = ASTParser.parse({ type: "filename", value: './tests/codegen/try-catch/006.syntax.js' });

//ObjectExpression
//  let ast = ASTParser.parse({ type: "filename", value: './tests/codegen/object/001.syntax.js' });
// let ast = ASTParser.parse({ type: "code", value: " let  z = {fullName: function(){}} " });
// let ast = ASTParser.parse({ type: "code", value: " let z = {fullName: (x, u)=>{}} " });
// let ast = ASTParser.parse({ type: "code", value: " x = function(){} " });

// let ast = ASTParser.parse({ type: "code", value: " let x = fu.x()" });

// InExpression
// let ast = ASTParser.parse({ type: "code", value: "  let z = (3 in val)  " });

// Iteration
// let ast = ASTParser.parse({ type: "filename", value: './tests/codegen/iteration/001.syntax.js' }); // WhileStatement
// let ast = ASTParser.parse({ type: "filename", value: './tests/codegen/iteration/002.syntax.js' }); // DoWhileStatement
// let ast = ASTParser.parse({ type: "filename", value: './tests/codegen/iteration/004.syntax.js' });    // ForOfStatement
// let ast = ASTParser.parse({ type: "filename", value: './tests/codegen/iteration/006.syntax.js' });    // ForInStatement


//let ast = ASTParser.parse({ type: "filename", value: './tests/codegen/function/007.syntax.js' });

//Precedence And Associativity
// let ast = ASTParser.parse({ type: "code", value: 'console.log(echo("left", 6) / echo("right", 2));' });  // Division Operator
// let ast = ASTParser.parse({ type: "code", value: ' console.log(echo("left", 2) ** echo("right", 3));' });  // Exponentiation  Operator

// let ast = ASTParser.parse({ type: "code", value: " let o = {fun(){}, b, c, [z]:()=> 1+(2+3)} " });  
// let ast = ASTParser.parse({ type: "code", value: " {delete trees[3];} " });  
// let ast = ASTParser.parse({ type: "code", value: " ({c=()=>1}) => 0 " });    // ObjectPattern
// let ast = ASTParser.parse({ type: "code", value: " ({b=2}) => 0 " });    // ObjectPattern
// let ast = ASTParser.parse({ type: "code", value: " ({b=2, c=3}) => 0 " });    // ObjectPattern
// let ast = ASTParser.parse({ type: "code", value: " ([{a=1}, {b=2}]) => 0 " });    // ArrayPattern
// let ast = ASTParser.parse({ type: "code", value: " [a , b] = 1 " });    // ArrayPattern
// let ast = ASTParser.parse({ type: "code", value: " [a, b, ...rest] = [10, 20, 30, 40, 50];" });    // ArrayPattern : Expressions - Destructuring assignment
// let ast = ASTParser.parse({ type: "code", value: " z = [a , b] = 1 " });    // ArrayPattern
// let ast = ASTParser.parse({ type: "code", value: " z = [a , b] " });    // ArrayExpression
// let ast = ASTParser.parse({ type: "code", value: '(e) => "test"'});    

// ExportDeclaration
// Exporting individual features
// let ast = ASTParser.parse({ type: "code", value: 'export let name1, name2'});    
// let ast = ASTParser.parse({ type: "code", value: 'export function test(){}'});    
// let ast = ASTParser.parse({ type: "code", value: 'export class ClassName {}'});    
// let ast = ASTParser.parse({ type: "code", value: 'export { name1, name2,  nameN as x};'}); // [ExportNamedDeclaration] Export list
// let ast = ASTParser.parse({ type: "code", value: 'export let x = Math.sqrt(2), y'}); //G [ExportNamedDeclaration] Export list
// let ast = ASTParser.parse({ type: "code", value: 'export const { name1, name2: bar } = o; '}); //G [ExportNamedDeclaration] Renaming exports
// let ast = ASTParser.parse({ type: "code", value: 'export { variable1 as name1, variable2 as name2};'}); // Renaming exports

// // Default exports
// let ast = ASTParser.parse({ type: "code", value: ' export default function() { }  '}); // [ExportDefaultDeclaration > FunctionDeclaration]
// let ast = ASTParser.parse({ type: "code", value: ' export default class xx { }  '}); // [ExportDefaultDeclaration > ClassDeclaration]
// let ast = ASTParser.parse({ type: "code", value: 'export default class {  } '}); // [ExportDefaultDeclaration > ClassDeclaration]
// let ast = ASTParser.parse({ type: "code", value: 'export default class Z { } '}); // [ExportDefaultDeclaration > ClassDeclaration]
// let ast = ASTParser.parse({ type: "code", value: ' export default { a:1 }  '}); // [ExportDefaultDeclaration > ObjectExpression]
// let ast = ASTParser.parse({ type: "code", value: ' export default x = 1  '}); // [ExportDefaultDeclaration > AssignmentExpression]
// let ast = ASTParser.parse({ type: "code", value: " export { myClass } from 'module'; "});  
// let ast = ASTParser.parse({ type: "code", value: " export { myClass as ZZ } from 'module'; "});  
// let ast = ASTParser.parse({ type: "code", value: " export * from 'module' "});  // ExportAllDeclaration

// CoalesceExpressionContext
// let ast = ASTParser.parse({ type: "code", value: ' x = param ?? 2 '});    

// AwaitExpressionContext 
// let ast = ASTParser.parse({ type: "code", value: ' async ()=> await (1, 2)  '});    
//let ast = ASTParser.parse({ type: "code", value: ' async ()=> 1  '});    

// let ast = ASTParser.parse({ type: "code", value: ' x = typeof b + z '});  

// ConditionalExpression
// let ast = ASTParser.parse({ type: "code", value: ' x = true ? x : z '});  
// let ast = ASTParser.parse({ type: "code", value: ' x = (1, 2, {a:1}) ? x : z'});  
// let ast = ASTParser.parse({ type: "code", value: ' x = 1, 2, {a:1} ? x : z ?? 3'});  

let ast = ASTParser.parse({ type: "code", value: ' x >>>= 1 '});  

console.table(toJson(ast))

if(true) {
    const generator = new SourceGenerator();
    const script = generator.toSource(ast);

    console.info('-------')
    console.info(script)
}
// Trick to prevent  
// All files must be modules when the '--isolatedModules' flag is provided.ts(1208)
export { } 