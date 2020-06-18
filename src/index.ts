import ASTParser, { ParserType } from "./ASTParser"
import SourceGenerator from "./SourceGenerator";

let toJson = (obj:any): string=>JSON.stringify(obj, function replacer(key, value) { return value});

console.info('Transpiller');
let input1 = "1"
let input2 = "var x = function(y, z) { console.info('this is a string') ; }"
let input3 = "var x =  2 + 4"
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
//let ast = ASTParser.parse({ type: "code", value: "{  x = 1 }" });

//let ast = ASTParser.parse({ type: "code", value: "{ { 1, true, 'A'} }" });
// let ast = ASTParser.parse({ type: "code", value: "true, 1, 'A', \"X\"" });
//let ast = ASTParser.parse({ type: "code", value: "x = 1" });
//  let ast = ASTParser.parse({ type: "code", value: " 1, true, 'A' "});
 //let ast = ASTParser.parse({ type: "code", value: " 1.2 ,true, \"Text\""});
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
let ast = ASTParser.parse({ type: "code", value: ' var x = [1, {"a":23, z:"abc"}]'});

console.info(toJson(ast))
//let generator = new SourceGenerator();
//generator.visit(ast);

// Trick to prevent  
// All files must be modules when the '--isolatedModules' flag is provided.ts(1208)
export { } 