import * as antlr4 from "antlr4"
import { ECMAScriptParser as DelvenParser } from "./parser/ECMAScriptParser"
import { ECMAScriptLexer as DelvenLexer } from "./parser/ECMAScriptLexer"

import ASTParser, { ParserType } from "./ASTParser"
import SourceGenerator from "./SourceGenerator";

let toJson = (obj:any): string=>JSON.stringify(obj, function replacer(key, value) { return value});

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
//let astparser = ASTParser.parse({ type: "code", value: "source" }, ParserType.ECMAScript);
// let ast = ASTParser.parse({ type: "code", value: "{ var x = 1;   var x = 2; }" });
// let ast = ASTParser.parse({ type: "code", value: "{ {  } }" });
// let ast = ASTParser.parse({ type: "code", value: "  x = 1  " });
// let ast = ASTParser.parse({ type: "code", value: "  x /= 1  " });
//let ast = ASTParser.parse({ type: "code", value: "{ { 1, true, 'A'} } " });
//  let ast = ASTParser.parse({ type: "code", value: "true, 1, 'A', \"X\"" });
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
// let ast = ASTParser.parse({ type: "code", value: 'class x {} '});
// let ast = ASTParser.parse({ type: "code", value: 'class x extends y {} '});// Call stack
// let ast = ASTParser.parse({ type: "code", value: 'class x extends function() {} {}'}); // Call stack
// let ast = ASTParser.parse({ type: "code", value: 'class x extends function() {} {}'});// Call stack
// let ast = ASTParser.parse({ type: "code", value: 'class x {constructor(){}}'});// Call stack
// let ast = ASTParser.parse({ type: "code", value: 'async function test() {}'});
//let ast = ASTParser.parse({ type: "code", value: 'import * as antlr4 from "antlr4"'});
// let ast = ASTParser.parse({ type: "code", value: 'try{}catch(e){}'});
// let ast = ASTParser.parse({ type: "code", value: ' function gen(x, y){} '});
// let ast = ASTParser.parse({ type: "code", value: ' async function gen(x, y){} '});
//  let ast = ASTParser.parse({ type: "code", value: 'async function* gen(z, x = 2, y){} '});
// let ast = ASTParser.parse({ type: "code", value: 'let x = 2'});
//let ast = ASTParser.parse({ type: "code", value: 'let {} = {"a":2, "b":4}'});
//let ast = ASTParser.parse({ type: "code", value: 'let {x, z} = {"a":2, "b":4}'});
// let ast = ASTParser.parse({ type: "code", value: 'let x, y = {"A":2, "B":1}'});
//let ast = ASTParser.parse({ type: "code", value: 'let x, y = 1'});
// Object Literall Expressions

// let ast = ASTParser.parse({ type: "code", value: ' x = {} '}); 
// let ast = ASTParser.parse({ type: "code", value: ' x = {y:1, z:2, a} '}); 
// let ast = ASTParser.parse({ type: "code", value: 'x = {[pxy]: 15} '}); // ComputedPropertyExpressionAssignment
// let ast = ASTParser.parse({ type: "code", value: 'x = {[1+1]: 2, "A":4} '}); // ComputedPropertyExpressionAssignment
 //let ast = ASTParser.parse({ type: "code", value: 'x = {"A":2, "B":1, [propName]: 15}'}); // ComputedPropertyExpressionAssignment
//let ast = ASTParser.parse({ type: "code", value: ' x =  {y : {async pxy(){}}}  '}); // 
//let ast = ASTParser.parse({ type: "code", value: ' x = { async pxy(){}} '}); //   FunctionProperty
let ast = ASTParser.parse({ type: "code", value: ' x = {z : 1, async pxy(){}} '}); //   FunctionProperty
// let ast = ASTParser.parse({ type: "code", value: 'x = {async pxy(){}, byz(){}} '}); 
// let ast = ASTParser.parse({ type: "code", value: 'x = { type: 'Monster', name, power }; '});  // Shorthand
console.info(toJson(ast))
//let generator = new SourceGenerator();
//generator.visit(ast);

// Trick to prevent  
// All files must be modules when the '--isolatedModules' flag is provided.ts(1208)
export { } 