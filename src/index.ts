import ASTParser, { ParserType } from "./ASTParser"
// Grammar 
// https://github.com/antlr/grammars-v4/tree/master/javascript/javascript
// https://stackoverflow.com/questions/1786565/ebnf-for-ecmascript

console.info('Transpiller');
let input1 = "1"
let input2 = "var x = function(y, z) { console.info('this is a string') ; }"
let input3 = "var x =  2 + 4"

//let astparser = ASTParser.parse({ type: "code", value: "source" }, ParserType.ECMAScript);
// let ast = ASTParser.parse({ type: "code", value: "{ var x = 1;   var x = 2; }" });
let ast = ASTParser.parse({ type: "code", value: "{ { 1 } }" });

console.info(JSON.stringify(ast, function replacer(key, value) { return value}))

// Trick to prevent  
// All files must be modules when the '--isolatedModules' flag is provided.ts(1208)
export { } 