"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ASTParser = _interopRequireDefault(require("./ASTParser"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let toJson = obj => JSON.stringify(obj, function replacer(key, value) {
  return value;
});

console.info('Transpiller');
let input1 = "1";
let input2 = "var x = function(y, z) { console.info('this is a string') ; }";
let input3 = "var x =  2 + 4";
/* 
const input = "1";
const chars = new antlr4.InputStream(input);
const lexer = new DelvenLexer(chars);
lexer.strictMode = false;
const tokens = new antlr4.CommonTokenStream(lexer);
const parser = new DelvenParser(tokens);
parser.buildParseTrees = true;
const tree = parser.program(); */

console.info("---------------------"); //let result = tree.accept(this.visitor);

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
// let ast = ASTParser.parse({ type: "code", value: ' x = {z : 1, async pxy(){}} '}); //   FunctionProperty
// let ast = ASTParser.parse({ type: "code", value: 'x = {async pxy(){}, byz(){}} '}); 
// let ast = ASTParser.parse({ type: "code", value: 'x = { type: "Monster", name, power }; '});  // Shorthand
// Array Literals
// let ast = ASTParser.parse({ type: "code", value: 'x = []'}); 
//let ast = ASTParser.parse({ type: "code", value: 'let x = [,,...a, b]'}); // SpreadElement
//let ast = ASTParser.parse({ type: "code", value: 'let x = [,,...{a:2}, b]'}); 
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

let ast = _ASTParser.default.parse({
  type: "code",
  value: ' (param1, param2, ...rest) =>  1 + 1'
}); // Expressions 
// Destructuring assignment  *** NOT SUPPORTED
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment
// let ast = ASTParser.parse({ type: "code", value: ' [a, b] = [10, 20]; '}); 
// let ast = ASTParser.parse({ type: "code", value: ' function a(x, y){}'});  // default parameters 


console.info(toJson(ast)); //let generator = new SourceGenerator();
//generator.visit(ast);
// Trick to prevent  
// All files must be modules when the '--isolatedModules' flag is provided.ts(1208)
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC50cyJdLCJuYW1lcyI6WyJ0b0pzb24iLCJvYmoiLCJKU09OIiwic3RyaW5naWZ5IiwicmVwbGFjZXIiLCJrZXkiLCJ2YWx1ZSIsImNvbnNvbGUiLCJpbmZvIiwiaW5wdXQxIiwiaW5wdXQyIiwiaW5wdXQzIiwiYXN0IiwiQVNUUGFyc2VyIiwicGFyc2UiLCJ0eXBlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFJQTs7OztBQUdBLElBQUlBLE1BQU0sR0FBSUMsR0FBRCxJQUFtQkMsSUFBSSxDQUFDQyxTQUFMLENBQWVGLEdBQWYsRUFBb0IsU0FBU0csUUFBVCxDQUFrQkMsR0FBbEIsRUFBdUJDLEtBQXZCLEVBQThCO0FBQUUsU0FBT0EsS0FBUDtBQUFhLENBQWpFLENBQWhDOztBQUVBQyxPQUFPLENBQUNDLElBQVIsQ0FBYSxhQUFiO0FBQ0EsSUFBSUMsTUFBTSxHQUFHLEdBQWI7QUFDQSxJQUFJQyxNQUFNLEdBQUcsK0RBQWI7QUFDQSxJQUFJQyxNQUFNLEdBQUcsZ0JBQWI7QUFFQTs7Ozs7Ozs7OztBQVVBSixPQUFPLENBQUNDLElBQVIsQ0FBYSx1QkFBYixFLENBQ0E7O0FBR0E7Ozs7Ozs7QUFPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQztBQUNEO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0M7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFDQSxJQUFJSSxHQUFHLEdBQUdDLG1CQUFVQyxLQUFWLENBQWdCO0FBQUVDLEVBQUFBLElBQUksRUFBRSxNQUFSO0FBQWdCVCxFQUFBQSxLQUFLLEVBQUU7QUFBdkIsQ0FBaEIsQ0FBVixDLENBQTRGO0FBRTVGO0FBQ0E7QUFDQTtBQUdBOzs7QUFFQUMsT0FBTyxDQUFDQyxJQUFSLENBQWFSLE1BQU0sQ0FBQ1ksR0FBRCxDQUFuQixFLENBQ0E7QUFDQTtBQUVBO0FBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBhbnRscjQgZnJvbSBcImFudGxyNFwiXG5pbXBvcnQgeyBFQ01BU2NyaXB0UGFyc2VyIGFzIERlbHZlblBhcnNlciB9IGZyb20gXCIuL3BhcnNlci9FQ01BU2NyaXB0UGFyc2VyXCJcbmltcG9ydCB7IEVDTUFTY3JpcHRMZXhlciBhcyBEZWx2ZW5MZXhlciB9IGZyb20gXCIuL3BhcnNlci9FQ01BU2NyaXB0TGV4ZXJcIlxuXG5pbXBvcnQgQVNUUGFyc2VyLCB7IFBhcnNlclR5cGUgfSBmcm9tIFwiLi9BU1RQYXJzZXJcIlxuaW1wb3J0IFNvdXJjZUdlbmVyYXRvciBmcm9tIFwiLi9Tb3VyY2VHZW5lcmF0b3JcIjtcblxubGV0IHRvSnNvbiA9IChvYmo6YW55KTogc3RyaW5nPT5KU09OLnN0cmluZ2lmeShvYmosIGZ1bmN0aW9uIHJlcGxhY2VyKGtleSwgdmFsdWUpIHsgcmV0dXJuIHZhbHVlfSk7XG5cbmNvbnNvbGUuaW5mbygnVHJhbnNwaWxsZXInKTtcbmxldCBpbnB1dDEgPSBcIjFcIlxubGV0IGlucHV0MiA9IFwidmFyIHggPSBmdW5jdGlvbih5LCB6KSB7IGNvbnNvbGUuaW5mbygndGhpcyBpcyBhIHN0cmluZycpIDsgfVwiXG5sZXQgaW5wdXQzID0gXCJ2YXIgeCA9ICAyICsgNFwiXG5cbi8qIFxuY29uc3QgaW5wdXQgPSBcIjFcIjtcbmNvbnN0IGNoYXJzID0gbmV3IGFudGxyNC5JbnB1dFN0cmVhbShpbnB1dCk7XG5jb25zdCBsZXhlciA9IG5ldyBEZWx2ZW5MZXhlcihjaGFycyk7XG5sZXhlci5zdHJpY3RNb2RlID0gZmFsc2U7XG5jb25zdCB0b2tlbnMgPSBuZXcgYW50bHI0LkNvbW1vblRva2VuU3RyZWFtKGxleGVyKTtcbmNvbnN0IHBhcnNlciA9IG5ldyBEZWx2ZW5QYXJzZXIodG9rZW5zKTtcbnBhcnNlci5idWlsZFBhcnNlVHJlZXMgPSB0cnVlO1xuY29uc3QgdHJlZSA9IHBhcnNlci5wcm9ncmFtKCk7ICovXG5cbmNvbnNvbGUuaW5mbyhcIi0tLS0tLS0tLS0tLS0tLS0tLS0tLVwiKTtcbi8vbGV0IHJlc3VsdCA9IHRyZWUuYWNjZXB0KHRoaXMudmlzaXRvcik7XG5cblxuLypcbiAgICAgICAge1xuICAgICAgICB0cnVlIFxuICAgICAgICBmYWxzZVxuICAgICAgICBcInRydWVcIlxuICAgICAgICB9XG4gKi9cbi8vbGV0IGFzdHBhcnNlciA9IEFTVFBhcnNlci5wYXJzZSh7IHR5cGU6IFwiY29kZVwiLCB2YWx1ZTogXCJzb3VyY2VcIiB9LCBQYXJzZXJUeXBlLkVDTUFTY3JpcHQpO1xuLy8gbGV0IGFzdCA9IEFTVFBhcnNlci5wYXJzZSh7IHR5cGU6IFwiY29kZVwiLCB2YWx1ZTogXCJ7IHZhciB4ID0gMTsgICB2YXIgeCA9IDI7IH1cIiB9KTtcbi8vIGxldCBhc3QgPSBBU1RQYXJzZXIucGFyc2UoeyB0eXBlOiBcImNvZGVcIiwgdmFsdWU6IFwieyB7ICB9IH1cIiB9KTtcbi8vIGxldCBhc3QgPSBBU1RQYXJzZXIucGFyc2UoeyB0eXBlOiBcImNvZGVcIiwgdmFsdWU6IFwiICB4ID0gMSAgXCIgfSk7XG4vLyBsZXQgYXN0ID0gQVNUUGFyc2VyLnBhcnNlKHsgdHlwZTogXCJjb2RlXCIsIHZhbHVlOiBcIiAgeCAvPSAxICBcIiB9KTtcbi8vbGV0IGFzdCA9IEFTVFBhcnNlci5wYXJzZSh7IHR5cGU6IFwiY29kZVwiLCB2YWx1ZTogXCJ7IHsgMSwgdHJ1ZSwgJ0EnfSB9IFwiIH0pO1xuLy8gIGxldCBhc3QgPSBBU1RQYXJzZXIucGFyc2UoeyB0eXBlOiBcImNvZGVcIiwgdmFsdWU6IFwidHJ1ZSwgMSwgJ0EnLCBcXFwiWFxcXCJcIiB9KTtcbi8vbGV0IGFzdCA9IEFTVFBhcnNlci5wYXJzZSh7IHR5cGU6IFwiY29kZVwiLCB2YWx1ZTogXCJ4ID0gMVwiIH0pO1xuLy8gIGxldCBhc3QgPSBBU1RQYXJzZXIucGFyc2UoeyB0eXBlOiBcImNvZGVcIiwgdmFsdWU6IFwiIDEsIHRydWUsICdBJyBcIn0pO1xuIC8vbGV0IGFzdCA9IEFTVFBhcnNlci5wYXJzZSh7IHR5cGU6IFwiY29kZVwiLCB2YWx1ZTogXCIgMS4yICx0cnVlLCBcXFwiVGV4dFxcXCJcIn0pO1xuLy8gbGV0IGFzdCA9IEFTVFBhcnNlci5wYXJzZSh7IHR5cGU6IFwiY29kZVwiLCB2YWx1ZTogXCIgZnVuY3Rpb24gQUEoeCwgeSl7fVwifSk7XG4vLyBsZXQgYXN0ID0gQVNUUGFyc2VyLnBhcnNlKHsgdHlwZTogXCJjb2RlXCIsIHZhbHVlOiBcIiBmdW5jdGlvbiBBQSh4LCB5KXt9ICBmdW5jdGlvbiBCQih4LCB5KXt9IFwifSk7XG5cbi8vIGxldCBhc3QgPSBBU1RQYXJzZXIucGFyc2UoeyB0eXBlOiBcImNvZGVcIiwgdmFsdWU6IFwiKDEgKyAxKVwifSk7XG4vL2xldCBhc3QgPSBBU1RQYXJzZXIucGFyc2UoeyB0eXBlOiBcImNvZGVcIiwgdmFsdWU6IFwiMSArIDJcIn0pO1xuLy9sZXQgYXN0ID0gQVNUUGFyc2VyLnBhcnNlKHsgdHlwZTogXCJjb2RlXCIsIHZhbHVlOiBcInggLyAyXCJ9KTtcbi8vIGxldCBhc3QgPSBBU1RQYXJzZXIucGFyc2UoeyB0eXBlOiBcImNvZGVcIiwgdmFsdWU6IFwieCAvIDEgICsgMVwifSk7XG4vL2xldCBhc3QgPSBBU1RQYXJzZXIucGFyc2UoeyB0eXBlOiBcImNvZGVcIiwgdmFsdWU6IFwieCArIDEgKyAxXCJ9KTtcbi8vbGV0IGFzdCA9IEFTVFBhcnNlci5wYXJzZSh7IHR5cGU6IFwiY29kZVwiLCB2YWx1ZTogXCJ5ID0geCArIDEgKyAxXCJ9KTtcbi8vLy8vLi5sZXQgYXN0ID0gQVNUUGFyc2VyLnBhcnNlKHsgdHlwZTogXCJjb2RlXCIsIHZhbHVlOiBcInggPSAxKzJcIn0pO1xuLy8gbGV0IGFzdCA9IEFTVFBhcnNlci5wYXJzZSh7IHR5cGU6IFwiY29kZVwiLCB2YWx1ZTogXCJ2YXIgeCA9IDEgKyAxXCJ9KTtcbi8vIGxldCBhc3QgPSBBU1RQYXJzZXIucGFyc2UoeyB0eXBlOiBcImNvZGVcIiwgdmFsdWU6IFwieCA9IFt4LCAyICsgMV1cIn0pO1xuLy8gbGV0IGFzdCA9IEFTVFBhcnNlci5wYXJzZSh7IHR5cGU6IFwiY29kZVwiLCB2YWx1ZTogXCJbMSwgMiwgMywsLCxdXCJ9KTtcbi8vbGV0IGFzdCA9IEFTVFBhcnNlci5wYXJzZSh7IHR5cGU6IFwiY29kZVwiLCB2YWx1ZTogXCJ2YXIgeCwgeVwifSk7XG4vL2xldCBhc3QgPSBBU1RQYXJzZXIucGFyc2UoeyB0eXBlOiBcImNvZGVcIiwgdmFsdWU6ICd4ID0ge1wiQVwiOiAxLCB4OjJ9J30pO1xuLy9sZXQgYXN0ID0gQVNUUGFyc2VyLnBhcnNlKHsgdHlwZTogXCJjb2RlXCIsIHZhbHVlOiAnWzExLCwsXSd9KTtcbi8vIGxldCBhc3QgPSBBU1RQYXJzZXIucGFyc2UoeyB0eXBlOiBcImNvZGVcIiwgdmFsdWU6ICd2YXIgeCA9IHtcImFcIjoxfSd9KTtcbi8vbGV0IGFzdCA9IEFTVFBhcnNlci5wYXJzZSh7IHR5cGU6IFwiY29kZVwiLCB2YWx1ZTogJ3ZhciB4ID0gWzEsMl0nfSk7XG4vL2xldCBhc3QgPSBBU1RQYXJzZXIucGFyc2UoeyB0eXBlOiBcImNvZGVcIiwgdmFsdWU6ICcgdmFyIHggPSBbMSwge31dJ30pO1xuLy8gbGV0IGFzdCA9IEFTVFBhcnNlci5wYXJzZSh7IHR5cGU6IFwiY29kZVwiLCB2YWx1ZTogJyB2YXIgeCA9IFsxLCB7XCJhXCI6MjMsIHo6XCJhYmNcIn1dJ30pO1xuIC8vIGxldCBhc3QgPSBBU1RQYXJzZXIucGFyc2UoeyB0eXBlOiBcImNvZGVcIiwgdmFsdWU6ICcoMSArIDEgKSd9KTtcbi8vIGxldCBhc3QgPSBBU1RQYXJzZXIucGFyc2UoeyB0eXBlOiBcImNvZGVcIiwgdmFsdWU6ICcgeCAhPSAxICd9KTtcbi8vbGV0IGFzdCA9IEFTVFBhcnNlci5wYXJzZSh7IHR5cGU6IFwiY29kZVwiLCB2YWx1ZTogJyBpZih4ICE9IDEpeyB9J30pO1xuLy8gbGV0IGFzdCA9IEFTVFBhcnNlci5wYXJzZSh7IHR5cGU6IFwiY29kZVwiLCB2YWx1ZTogJyBpZih4KXsgfSd9KTtcbi8vbGV0IGFzdCA9IEFTVFBhcnNlci5wYXJzZSh7IHR5cGU6IFwiY29kZVwiLCB2YWx1ZTogJyBpZih4ICE9IDEpeyB9IGVsc2Uge30gJ30pO1xuLy9sZXQgYXN0ID0gQVNUUGFyc2VyLnBhcnNlKHsgdHlwZTogXCJjb2RlXCIsIHZhbHVlOiAnIGlmKHggIT0gMSl7IH0gZWxzZSBpZiAoeCA9PSAyKSB7fSd9KTtcbi8vbGV0IGFzdCA9IEFTVFBhcnNlci5wYXJzZSh7IHR5cGU6IFwiY29kZVwiLCB2YWx1ZTogJyBpZih4ICE9IDEpeyB9IGVsc2UgaWYgKHggPT0gMikge30gZWxzZSB7fSd9KTtcbi8vIGxldCBhc3QgPSBBU1RQYXJzZXIucGFyc2UoeyB0eXBlOiBcImNvZGVcIiwgdmFsdWU6ICcgeCA9IHkueiAnfSk7XG4vL2xldCBhc3QgPSBBU1RQYXJzZXIucGFyc2UoeyB0eXBlOiBcImNvZGVcIiwgdmFsdWU6ICcgeFsxXSAnfSk7IFxuLy9sZXQgYXN0ID0gQVNUUGFyc2VyLnBhcnNlKHsgdHlwZTogXCJjb2RlXCIsIHZhbHVlOiAnIHgrPTEgJ30pOyBcbi8vbGV0IGFzdCA9IEFTVFBhcnNlci5wYXJzZSh7IHR5cGU6IFwiY29kZVwiLCB2YWx1ZTogJyB4Kz15ICd9KTtcbi8vIGxldCBhc3QgPSBBU1RQYXJzZXIucGFyc2UoeyB0eXBlOiBcImNvZGVcIiwgdmFsdWU6ICdjbGFzcyB4IHt9ICd9KTtcbi8vIGxldCBhc3QgPSBBU1RQYXJzZXIucGFyc2UoeyB0eXBlOiBcImNvZGVcIiwgdmFsdWU6ICdjbGFzcyB4IGV4dGVuZHMgeSB7fSAnfSk7Ly8gQ2FsbCBzdGFja1xuLy8gbGV0IGFzdCA9IEFTVFBhcnNlci5wYXJzZSh7IHR5cGU6IFwiY29kZVwiLCB2YWx1ZTogJ2NsYXNzIHggZXh0ZW5kcyBmdW5jdGlvbigpIHt9IHt9J30pOyAvLyBDYWxsIHN0YWNrXG4vLyBsZXQgYXN0ID0gQVNUUGFyc2VyLnBhcnNlKHsgdHlwZTogXCJjb2RlXCIsIHZhbHVlOiAnY2xhc3MgeCBleHRlbmRzIGZ1bmN0aW9uKCkge30ge30nfSk7Ly8gQ2FsbCBzdGFja1xuLy8gbGV0IGFzdCA9IEFTVFBhcnNlci5wYXJzZSh7IHR5cGU6IFwiY29kZVwiLCB2YWx1ZTogJ2NsYXNzIHgge2NvbnN0cnVjdG9yKCl7fX0nfSk7Ly8gQ2FsbCBzdGFja1xuLy8gbGV0IGFzdCA9IEFTVFBhcnNlci5wYXJzZSh7IHR5cGU6IFwiY29kZVwiLCB2YWx1ZTogJ2FzeW5jIGZ1bmN0aW9uIHRlc3QoKSB7fSd9KTtcbi8vbGV0IGFzdCA9IEFTVFBhcnNlci5wYXJzZSh7IHR5cGU6IFwiY29kZVwiLCB2YWx1ZTogJ2ltcG9ydCAqIGFzIGFudGxyNCBmcm9tIFwiYW50bHI0XCInfSk7XG4vLyBsZXQgYXN0ID0gQVNUUGFyc2VyLnBhcnNlKHsgdHlwZTogXCJjb2RlXCIsIHZhbHVlOiAndHJ5e31jYXRjaChlKXt9J30pO1xuLy8gbGV0IGFzdCA9IEFTVFBhcnNlci5wYXJzZSh7IHR5cGU6IFwiY29kZVwiLCB2YWx1ZTogJyBmdW5jdGlvbiBnZW4oeCwgeSl7fSAnfSk7XG4vLyBsZXQgYXN0ID0gQVNUUGFyc2VyLnBhcnNlKHsgdHlwZTogXCJjb2RlXCIsIHZhbHVlOiAnIGFzeW5jIGZ1bmN0aW9uIGdlbih4LCB5KXt9ICd9KTtcbi8vICBsZXQgYXN0ID0gQVNUUGFyc2VyLnBhcnNlKHsgdHlwZTogXCJjb2RlXCIsIHZhbHVlOiAnYXN5bmMgZnVuY3Rpb24qIGdlbih6LCB4ID0gMiwgeSl7fSAnfSk7XG4vLyBsZXQgYXN0ID0gQVNUUGFyc2VyLnBhcnNlKHsgdHlwZTogXCJjb2RlXCIsIHZhbHVlOiAnbGV0IHggPSAyJ30pO1xuLy9sZXQgYXN0ID0gQVNUUGFyc2VyLnBhcnNlKHsgdHlwZTogXCJjb2RlXCIsIHZhbHVlOiAnbGV0IHt9ID0ge1wiYVwiOjIsIFwiYlwiOjR9J30pO1xuLy9sZXQgYXN0ID0gQVNUUGFyc2VyLnBhcnNlKHsgdHlwZTogXCJjb2RlXCIsIHZhbHVlOiAnbGV0IHt4LCB6fSA9IHtcImFcIjoyLCBcImJcIjo0fSd9KTtcbi8vIGxldCBhc3QgPSBBU1RQYXJzZXIucGFyc2UoeyB0eXBlOiBcImNvZGVcIiwgdmFsdWU6ICdsZXQgeCwgeSA9IHtcIkFcIjoyLCBcIkJcIjoxfSd9KTtcbi8vbGV0IGFzdCA9IEFTVFBhcnNlci5wYXJzZSh7IHR5cGU6IFwiY29kZVwiLCB2YWx1ZTogJ2xldCB4LCB5ID0gMSd9KTtcbi8vIE9iamVjdCBMaXRlcmFsbCBFeHByZXNzaW9uc1xuXG4vLyBsZXQgYXN0ID0gQVNUUGFyc2VyLnBhcnNlKHsgdHlwZTogXCJjb2RlXCIsIHZhbHVlOiAnIHggPSB7fSAnfSk7IFxuLy8gbGV0IGFzdCA9IEFTVFBhcnNlci5wYXJzZSh7IHR5cGU6IFwiY29kZVwiLCB2YWx1ZTogJyB4ID0ge3k6MSwgejoyLCBhfSAnfSk7IFxuLy8gbGV0IGFzdCA9IEFTVFBhcnNlci5wYXJzZSh7IHR5cGU6IFwiY29kZVwiLCB2YWx1ZTogJ3ggPSB7W3B4eV06IDE1fSAnfSk7IC8vIENvbXB1dGVkUHJvcGVydHlFeHByZXNzaW9uQXNzaWdubWVudFxuLy8gbGV0IGFzdCA9IEFTVFBhcnNlci5wYXJzZSh7IHR5cGU6IFwiY29kZVwiLCB2YWx1ZTogJ3ggPSB7WzErMV06IDIsIFwiQVwiOjR9ICd9KTsgLy8gQ29tcHV0ZWRQcm9wZXJ0eUV4cHJlc3Npb25Bc3NpZ25tZW50XG4gLy9sZXQgYXN0ID0gQVNUUGFyc2VyLnBhcnNlKHsgdHlwZTogXCJjb2RlXCIsIHZhbHVlOiAneCA9IHtcIkFcIjoyLCBcIkJcIjoxLCBbcHJvcE5hbWVdOiAxNX0nfSk7IC8vIENvbXB1dGVkUHJvcGVydHlFeHByZXNzaW9uQXNzaWdubWVudFxuLy9sZXQgYXN0ID0gQVNUUGFyc2VyLnBhcnNlKHsgdHlwZTogXCJjb2RlXCIsIHZhbHVlOiAnIHggPSAge3kgOiB7YXN5bmMgcHh5KCl7fX19ICAnfSk7IC8vIFxuLy9sZXQgYXN0ID0gQVNUUGFyc2VyLnBhcnNlKHsgdHlwZTogXCJjb2RlXCIsIHZhbHVlOiAnIHggPSB7IGFzeW5jIHB4eSgpe319ICd9KTsgLy8gICBGdW5jdGlvblByb3BlcnR5XG4vLyBsZXQgYXN0ID0gQVNUUGFyc2VyLnBhcnNlKHsgdHlwZTogXCJjb2RlXCIsIHZhbHVlOiAnIHggPSB7eiA6IDEsIGFzeW5jIHB4eSgpe319ICd9KTsgLy8gICBGdW5jdGlvblByb3BlcnR5XG4vLyBsZXQgYXN0ID0gQVNUUGFyc2VyLnBhcnNlKHsgdHlwZTogXCJjb2RlXCIsIHZhbHVlOiAneCA9IHthc3luYyBweHkoKXt9LCBieXooKXt9fSAnfSk7IFxuLy8gbGV0IGFzdCA9IEFTVFBhcnNlci5wYXJzZSh7IHR5cGU6IFwiY29kZVwiLCB2YWx1ZTogJ3ggPSB7IHR5cGU6IFwiTW9uc3RlclwiLCBuYW1lLCBwb3dlciB9OyAnfSk7ICAvLyBTaG9ydGhhbmRcblxuLy8gQXJyYXkgTGl0ZXJhbHNcbi8vIGxldCBhc3QgPSBBU1RQYXJzZXIucGFyc2UoeyB0eXBlOiBcImNvZGVcIiwgdmFsdWU6ICd4ID0gW10nfSk7IFxuLy9sZXQgYXN0ID0gQVNUUGFyc2VyLnBhcnNlKHsgdHlwZTogXCJjb2RlXCIsIHZhbHVlOiAnbGV0IHggPSBbLCwuLi5hLCBiXSd9KTsgLy8gU3ByZWFkRWxlbWVudFxuLy9sZXQgYXN0ID0gQVNUUGFyc2VyLnBhcnNlKHsgdHlwZTogXCJjb2RlXCIsIHZhbHVlOiAnbGV0IHggPSBbLCwuLi57YToyfSwgYl0nfSk7IFxuXG4vLyBsZXQgYXN0ID0gQVNUUGFyc2VyLnBhcnNlKHsgdHlwZTogXCJjb2RlXCIsIHZhbHVlOiAnIGE6MiAnfSk7IC8vTGFiZWxlZFN0YXRlbWVudFxuXG4vLyBBcnJvdyBGdW5jdGlvblxuLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvRnVuY3Rpb25zL0Fycm93X2Z1bmN0aW9uc1xuLy8gIGxldCBhc3QgPSBBU1RQYXJzZXIucGFyc2UoeyB0eXBlOiBcImNvZGVcIiwgdmFsdWU6ICcgKCk9PiB7IH0gJ30pOyAgLy9CbG9ja1N0YXRlbWVudCBub3QgT2JqZWN0TGl0ZXJhbFxuLy8gIGxldCBhc3QgPSBBU1RQYXJzZXIucGFyc2UoeyB0eXBlOiBcImNvZGVcIiwgdmFsdWU6ICcgKCk9PiB7IHggPSAyIH0gJ30pOyAgLy9CbG9ja1N0YXRlbWVudCBub3QgT2JqZWN0TGl0ZXJhbFxuLy8gIGxldCBhc3QgPSBBU1RQYXJzZXIucGFyc2UoeyB0eXBlOiBcImNvZGVcIiwgdmFsdWU6ICcgcGFyYW1zID0+IHtmb286IGJhcn0gJ30pOyAvLyBMYWJlbGVkU3RhdGVtZW50XG4vLyAgbGV0IGFzdCA9IEFTVFBhcnNlci5wYXJzZSh7IHR5cGU6IFwiY29kZVwiLCB2YWx1ZTogJyBwYXJhbXMgPT4gKHtmb286IGJhcn0pICd9KTsgLy8gIFBhcmVudGhlc2l6ZSB0aGUgYm9keSBvZiBhIGZ1bmN0aW9uIHRvIHJldHVybiBhbiBvYmplY3QgbGl0ZXJhbCBleHByZXNzaW9uXG4vLyAgbGV0IGFzdCA9IEFTVFBhcnNlci5wYXJzZSh7IHR5cGU6IFwiY29kZVwiLCB2YWx1ZTogJyBwYXJhbXMgPT4gKHtmb286IGJhciwgeDoyfSwgeiA9IDMpICd9KTsgLy8gIFBhcmVudGhlc2l6ZSB0aGUgYm9keSBvZiBhIGZ1bmN0aW9uIHRvIHJldHVybiBhbiBvYmplY3QgbGl0ZXJhbCBleHByZXNzaW9uXG4vLyAgbGV0IGFzdCA9IEFTVFBhcnNlci5wYXJzZSh7IHR5cGU6IFwiY29kZVwiLCB2YWx1ZTogJygpPT57IGE6MiB9ICd9KTsgXG4vLyBsZXQgYXN0ID0gQVNUUGFyc2VyLnBhcnNlKHsgdHlwZTogXCJjb2RlXCIsIHZhbHVlOiAnKCk9PnsgbGV0IHggPSAxfSAnfSk7IFxuLy8gbGV0IGFzdCA9IEFTVFBhcnNlci5wYXJzZSh7IHR5cGU6IFwiY29kZVwiLCB2YWx1ZTogJyAoKSA9PiAgMSArIDEnfSk7IFxuLy8gbGV0IGFzdCA9IEFTVFBhcnNlci5wYXJzZSh7IHR5cGU6IFwiY29kZVwiLCB2YWx1ZTogJyB0ZXN0ID0+ICAxICsgMSd9KTsgXG4vLyBsZXQgYXN0ID0gQVNUUGFyc2VyLnBhcnNlKHsgdHlwZTogXCJjb2RlXCIsIHZhbHVlOiAndGVzdD0+e30nfSk7IFxuLy8gbGV0IGFzdCA9IEFTVFBhcnNlci5wYXJzZSh7IHR5cGU6IFwiY29kZVwiLCB2YWx1ZTogJyh0ZXN0KT0+e30nfSk7IFxuLy8gbGV0IGFzdCA9IEFTVFBhcnNlci5wYXJzZSh7IHR5cGU6IFwiY29kZVwiLCB2YWx1ZTogJyAocGFyYW0xLCBwYXJhbTIsIC4uLnJlc3QpID0+IHsgIH0gJ30pOyAgLy8gUmVzdCBwYXJhbWV0ZXJzIFxuLy8gbGV0IGFzdCA9IEFTVFBhcnNlci5wYXJzZSh7IHR5cGU6IFwiY29kZVwiLCB2YWx1ZTogJyBsZXQgeCA9IChwYXJhbTEsIHBhcmFtMiwgLi4ucmVzdCkgPT4geyAgfSAnfSk7ICAvLyBSZXN0IHBhcmFtZXRlcnMgXG4vLyBsZXQgYXN0ID0gQVNUUGFyc2VyLnBhcnNlKHsgdHlwZTogXCJjb2RlXCIsIHZhbHVlOiAnIChwYXJhbTEgPSBkZWZhdWx0VmFsdWUxLCBwYXJhbTIpID0+IHsgMSB9J30pOyAgLy8gZGVmYXVsdCBwYXJhbWV0ZXJzIFxubGV0IGFzdCA9IEFTVFBhcnNlci5wYXJzZSh7IHR5cGU6IFwiY29kZVwiLCB2YWx1ZTogJyAocGFyYW0xLCBwYXJhbTIsIC4uLnJlc3QpID0+ICAxICsgMSd9KTsgIC8vIEV4cHJlc3Npb25zIFxuXG4vLyBEZXN0cnVjdHVyaW5nIGFzc2lnbm1lbnQgICoqKiBOT1QgU1VQUE9SVEVEXG4vLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9PcGVyYXRvcnMvRGVzdHJ1Y3R1cmluZ19hc3NpZ25tZW50XG4vLyBsZXQgYXN0ID0gQVNUUGFyc2VyLnBhcnNlKHsgdHlwZTogXCJjb2RlXCIsIHZhbHVlOiAnIFthLCBiXSA9IFsxMCwgMjBdOyAnfSk7IFxuXG5cbi8vIGxldCBhc3QgPSBBU1RQYXJzZXIucGFyc2UoeyB0eXBlOiBcImNvZGVcIiwgdmFsdWU6ICcgZnVuY3Rpb24gYSh4LCB5KXt9J30pOyAgLy8gZGVmYXVsdCBwYXJhbWV0ZXJzIFxuXG5jb25zb2xlLmluZm8odG9Kc29uKGFzdCkpXG4vL2xldCBnZW5lcmF0b3IgPSBuZXcgU291cmNlR2VuZXJhdG9yKCk7XG4vL2dlbmVyYXRvci52aXNpdChhc3QpO1xuXG4vLyBUcmljayB0byBwcmV2ZW50ICBcbi8vIEFsbCBmaWxlcyBtdXN0IGJlIG1vZHVsZXMgd2hlbiB0aGUgJy0taXNvbGF0ZWRNb2R1bGVzJyBmbGFnIGlzIHByb3ZpZGVkLnRzKDEyMDgpXG5leHBvcnQgeyB9ICJdfQ==