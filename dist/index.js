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

let ast = _ASTParser.default.parse({
  type: "code",
  value: 'x = { type: "Monster", name, power }; '
}); // Shorthand


console.info(toJson(ast)); //let generator = new SourceGenerator();
//generator.visit(ast);
// Trick to prevent  
// All files must be modules when the '--isolatedModules' flag is provided.ts(1208)
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC50cyJdLCJuYW1lcyI6WyJ0b0pzb24iLCJvYmoiLCJKU09OIiwic3RyaW5naWZ5IiwicmVwbGFjZXIiLCJrZXkiLCJ2YWx1ZSIsImNvbnNvbGUiLCJpbmZvIiwiaW5wdXQxIiwiaW5wdXQyIiwiaW5wdXQzIiwiYXN0IiwiQVNUUGFyc2VyIiwicGFyc2UiLCJ0eXBlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFJQTs7OztBQUdBLElBQUlBLE1BQU0sR0FBSUMsR0FBRCxJQUFtQkMsSUFBSSxDQUFDQyxTQUFMLENBQWVGLEdBQWYsRUFBb0IsU0FBU0csUUFBVCxDQUFrQkMsR0FBbEIsRUFBdUJDLEtBQXZCLEVBQThCO0FBQUUsU0FBT0EsS0FBUDtBQUFhLENBQWpFLENBQWhDOztBQUVBQyxPQUFPLENBQUNDLElBQVIsQ0FBYSxhQUFiO0FBQ0EsSUFBSUMsTUFBTSxHQUFHLEdBQWI7QUFDQSxJQUFJQyxNQUFNLEdBQUcsK0RBQWI7QUFDQSxJQUFJQyxNQUFNLEdBQUcsZ0JBQWI7QUFFQTs7Ozs7Ozs7OztBQVVBSixPQUFPLENBQUNDLElBQVIsQ0FBYSx1QkFBYixFLENBQ0E7O0FBR0E7Ozs7Ozs7QUFPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQztBQUNEO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0M7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7O0FBQ0EsSUFBSUksR0FBRyxHQUFHQyxtQkFBVUMsS0FBVixDQUFnQjtBQUFFQyxFQUFBQSxJQUFJLEVBQUUsTUFBUjtBQUFnQlQsRUFBQUEsS0FBSyxFQUFFO0FBQXZCLENBQWhCLENBQVYsQyxDQUE4Rjs7O0FBQzlGQyxPQUFPLENBQUNDLElBQVIsQ0FBYVIsTUFBTSxDQUFDWSxHQUFELENBQW5CLEUsQ0FDQTtBQUNBO0FBRUE7QUFDQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGFudGxyNCBmcm9tIFwiYW50bHI0XCJcbmltcG9ydCB7IEVDTUFTY3JpcHRQYXJzZXIgYXMgRGVsdmVuUGFyc2VyIH0gZnJvbSBcIi4vcGFyc2VyL0VDTUFTY3JpcHRQYXJzZXJcIlxuaW1wb3J0IHsgRUNNQVNjcmlwdExleGVyIGFzIERlbHZlbkxleGVyIH0gZnJvbSBcIi4vcGFyc2VyL0VDTUFTY3JpcHRMZXhlclwiXG5cbmltcG9ydCBBU1RQYXJzZXIsIHsgUGFyc2VyVHlwZSB9IGZyb20gXCIuL0FTVFBhcnNlclwiXG5pbXBvcnQgU291cmNlR2VuZXJhdG9yIGZyb20gXCIuL1NvdXJjZUdlbmVyYXRvclwiO1xuXG5sZXQgdG9Kc29uID0gKG9iajphbnkpOiBzdHJpbmc9PkpTT04uc3RyaW5naWZ5KG9iaiwgZnVuY3Rpb24gcmVwbGFjZXIoa2V5LCB2YWx1ZSkgeyByZXR1cm4gdmFsdWV9KTtcblxuY29uc29sZS5pbmZvKCdUcmFuc3BpbGxlcicpO1xubGV0IGlucHV0MSA9IFwiMVwiXG5sZXQgaW5wdXQyID0gXCJ2YXIgeCA9IGZ1bmN0aW9uKHksIHopIHsgY29uc29sZS5pbmZvKCd0aGlzIGlzIGEgc3RyaW5nJykgOyB9XCJcbmxldCBpbnB1dDMgPSBcInZhciB4ID0gIDIgKyA0XCJcblxuLyogXG5jb25zdCBpbnB1dCA9IFwiMVwiO1xuY29uc3QgY2hhcnMgPSBuZXcgYW50bHI0LklucHV0U3RyZWFtKGlucHV0KTtcbmNvbnN0IGxleGVyID0gbmV3IERlbHZlbkxleGVyKGNoYXJzKTtcbmxleGVyLnN0cmljdE1vZGUgPSBmYWxzZTtcbmNvbnN0IHRva2VucyA9IG5ldyBhbnRscjQuQ29tbW9uVG9rZW5TdHJlYW0obGV4ZXIpO1xuY29uc3QgcGFyc2VyID0gbmV3IERlbHZlblBhcnNlcih0b2tlbnMpO1xucGFyc2VyLmJ1aWxkUGFyc2VUcmVlcyA9IHRydWU7XG5jb25zdCB0cmVlID0gcGFyc2VyLnByb2dyYW0oKTsgKi9cblxuY29uc29sZS5pbmZvKFwiLS0tLS0tLS0tLS0tLS0tLS0tLS0tXCIpO1xuLy9sZXQgcmVzdWx0ID0gdHJlZS5hY2NlcHQodGhpcy52aXNpdG9yKTtcblxuXG4vKlxuICAgICAgICB7XG4gICAgICAgIHRydWUgXG4gICAgICAgIGZhbHNlXG4gICAgICAgIFwidHJ1ZVwiXG4gICAgICAgIH1cbiAqL1xuLy9sZXQgYXN0cGFyc2VyID0gQVNUUGFyc2VyLnBhcnNlKHsgdHlwZTogXCJjb2RlXCIsIHZhbHVlOiBcInNvdXJjZVwiIH0sIFBhcnNlclR5cGUuRUNNQVNjcmlwdCk7XG4vLyBsZXQgYXN0ID0gQVNUUGFyc2VyLnBhcnNlKHsgdHlwZTogXCJjb2RlXCIsIHZhbHVlOiBcInsgdmFyIHggPSAxOyAgIHZhciB4ID0gMjsgfVwiIH0pO1xuLy8gbGV0IGFzdCA9IEFTVFBhcnNlci5wYXJzZSh7IHR5cGU6IFwiY29kZVwiLCB2YWx1ZTogXCJ7IHsgIH0gfVwiIH0pO1xuLy8gbGV0IGFzdCA9IEFTVFBhcnNlci5wYXJzZSh7IHR5cGU6IFwiY29kZVwiLCB2YWx1ZTogXCIgIHggPSAxICBcIiB9KTtcbi8vIGxldCBhc3QgPSBBU1RQYXJzZXIucGFyc2UoeyB0eXBlOiBcImNvZGVcIiwgdmFsdWU6IFwiICB4IC89IDEgIFwiIH0pO1xuLy9sZXQgYXN0ID0gQVNUUGFyc2VyLnBhcnNlKHsgdHlwZTogXCJjb2RlXCIsIHZhbHVlOiBcInsgeyAxLCB0cnVlLCAnQSd9IH0gXCIgfSk7XG4vLyAgbGV0IGFzdCA9IEFTVFBhcnNlci5wYXJzZSh7IHR5cGU6IFwiY29kZVwiLCB2YWx1ZTogXCJ0cnVlLCAxLCAnQScsIFxcXCJYXFxcIlwiIH0pO1xuLy9sZXQgYXN0ID0gQVNUUGFyc2VyLnBhcnNlKHsgdHlwZTogXCJjb2RlXCIsIHZhbHVlOiBcInggPSAxXCIgfSk7XG4vLyAgbGV0IGFzdCA9IEFTVFBhcnNlci5wYXJzZSh7IHR5cGU6IFwiY29kZVwiLCB2YWx1ZTogXCIgMSwgdHJ1ZSwgJ0EnIFwifSk7XG4gLy9sZXQgYXN0ID0gQVNUUGFyc2VyLnBhcnNlKHsgdHlwZTogXCJjb2RlXCIsIHZhbHVlOiBcIiAxLjIgLHRydWUsIFxcXCJUZXh0XFxcIlwifSk7XG4vLyBsZXQgYXN0ID0gQVNUUGFyc2VyLnBhcnNlKHsgdHlwZTogXCJjb2RlXCIsIHZhbHVlOiBcIiBmdW5jdGlvbiBBQSh4LCB5KXt9XCJ9KTtcbi8vIGxldCBhc3QgPSBBU1RQYXJzZXIucGFyc2UoeyB0eXBlOiBcImNvZGVcIiwgdmFsdWU6IFwiIGZ1bmN0aW9uIEFBKHgsIHkpe30gIGZ1bmN0aW9uIEJCKHgsIHkpe30gXCJ9KTtcblxuLy8gbGV0IGFzdCA9IEFTVFBhcnNlci5wYXJzZSh7IHR5cGU6IFwiY29kZVwiLCB2YWx1ZTogXCIoMSArIDEpXCJ9KTtcbi8vbGV0IGFzdCA9IEFTVFBhcnNlci5wYXJzZSh7IHR5cGU6IFwiY29kZVwiLCB2YWx1ZTogXCIxICsgMlwifSk7XG4vL2xldCBhc3QgPSBBU1RQYXJzZXIucGFyc2UoeyB0eXBlOiBcImNvZGVcIiwgdmFsdWU6IFwieCAvIDJcIn0pO1xuLy8gbGV0IGFzdCA9IEFTVFBhcnNlci5wYXJzZSh7IHR5cGU6IFwiY29kZVwiLCB2YWx1ZTogXCJ4IC8gMSAgKyAxXCJ9KTtcbi8vbGV0IGFzdCA9IEFTVFBhcnNlci5wYXJzZSh7IHR5cGU6IFwiY29kZVwiLCB2YWx1ZTogXCJ4ICsgMSArIDFcIn0pO1xuLy9sZXQgYXN0ID0gQVNUUGFyc2VyLnBhcnNlKHsgdHlwZTogXCJjb2RlXCIsIHZhbHVlOiBcInkgPSB4ICsgMSArIDFcIn0pO1xuLy8vLy8uLmxldCBhc3QgPSBBU1RQYXJzZXIucGFyc2UoeyB0eXBlOiBcImNvZGVcIiwgdmFsdWU6IFwieCA9IDErMlwifSk7XG4vLyBsZXQgYXN0ID0gQVNUUGFyc2VyLnBhcnNlKHsgdHlwZTogXCJjb2RlXCIsIHZhbHVlOiBcInZhciB4ID0gMSArIDFcIn0pO1xuLy8gbGV0IGFzdCA9IEFTVFBhcnNlci5wYXJzZSh7IHR5cGU6IFwiY29kZVwiLCB2YWx1ZTogXCJ4ID0gW3gsIDIgKyAxXVwifSk7XG4vLyBsZXQgYXN0ID0gQVNUUGFyc2VyLnBhcnNlKHsgdHlwZTogXCJjb2RlXCIsIHZhbHVlOiBcIlsxLCAyLCAzLCwsLF1cIn0pO1xuLy9sZXQgYXN0ID0gQVNUUGFyc2VyLnBhcnNlKHsgdHlwZTogXCJjb2RlXCIsIHZhbHVlOiBcInZhciB4LCB5XCJ9KTtcbi8vbGV0IGFzdCA9IEFTVFBhcnNlci5wYXJzZSh7IHR5cGU6IFwiY29kZVwiLCB2YWx1ZTogJ3ggPSB7XCJBXCI6IDEsIHg6Mn0nfSk7XG4vL2xldCBhc3QgPSBBU1RQYXJzZXIucGFyc2UoeyB0eXBlOiBcImNvZGVcIiwgdmFsdWU6ICdbMTEsLCxdJ30pO1xuLy8gbGV0IGFzdCA9IEFTVFBhcnNlci5wYXJzZSh7IHR5cGU6IFwiY29kZVwiLCB2YWx1ZTogJ3ZhciB4ID0ge1wiYVwiOjF9J30pO1xuLy9sZXQgYXN0ID0gQVNUUGFyc2VyLnBhcnNlKHsgdHlwZTogXCJjb2RlXCIsIHZhbHVlOiAndmFyIHggPSBbMSwyXSd9KTtcbi8vbGV0IGFzdCA9IEFTVFBhcnNlci5wYXJzZSh7IHR5cGU6IFwiY29kZVwiLCB2YWx1ZTogJyB2YXIgeCA9IFsxLCB7fV0nfSk7XG4vLyBsZXQgYXN0ID0gQVNUUGFyc2VyLnBhcnNlKHsgdHlwZTogXCJjb2RlXCIsIHZhbHVlOiAnIHZhciB4ID0gWzEsIHtcImFcIjoyMywgejpcImFiY1wifV0nfSk7XG4gLy8gbGV0IGFzdCA9IEFTVFBhcnNlci5wYXJzZSh7IHR5cGU6IFwiY29kZVwiLCB2YWx1ZTogJygxICsgMSApJ30pO1xuLy8gbGV0IGFzdCA9IEFTVFBhcnNlci5wYXJzZSh7IHR5cGU6IFwiY29kZVwiLCB2YWx1ZTogJyB4ICE9IDEgJ30pO1xuLy9sZXQgYXN0ID0gQVNUUGFyc2VyLnBhcnNlKHsgdHlwZTogXCJjb2RlXCIsIHZhbHVlOiAnIGlmKHggIT0gMSl7IH0nfSk7XG4vLyBsZXQgYXN0ID0gQVNUUGFyc2VyLnBhcnNlKHsgdHlwZTogXCJjb2RlXCIsIHZhbHVlOiAnIGlmKHgpeyB9J30pO1xuLy9sZXQgYXN0ID0gQVNUUGFyc2VyLnBhcnNlKHsgdHlwZTogXCJjb2RlXCIsIHZhbHVlOiAnIGlmKHggIT0gMSl7IH0gZWxzZSB7fSAnfSk7XG4vL2xldCBhc3QgPSBBU1RQYXJzZXIucGFyc2UoeyB0eXBlOiBcImNvZGVcIiwgdmFsdWU6ICcgaWYoeCAhPSAxKXsgfSBlbHNlIGlmICh4ID09IDIpIHt9J30pO1xuLy9sZXQgYXN0ID0gQVNUUGFyc2VyLnBhcnNlKHsgdHlwZTogXCJjb2RlXCIsIHZhbHVlOiAnIGlmKHggIT0gMSl7IH0gZWxzZSBpZiAoeCA9PSAyKSB7fSBlbHNlIHt9J30pO1xuLy8gbGV0IGFzdCA9IEFTVFBhcnNlci5wYXJzZSh7IHR5cGU6IFwiY29kZVwiLCB2YWx1ZTogJyB4ID0geS56ICd9KTtcbi8vbGV0IGFzdCA9IEFTVFBhcnNlci5wYXJzZSh7IHR5cGU6IFwiY29kZVwiLCB2YWx1ZTogJyB4WzFdICd9KTsgXG4vL2xldCBhc3QgPSBBU1RQYXJzZXIucGFyc2UoeyB0eXBlOiBcImNvZGVcIiwgdmFsdWU6ICcgeCs9MSAnfSk7IFxuLy9sZXQgYXN0ID0gQVNUUGFyc2VyLnBhcnNlKHsgdHlwZTogXCJjb2RlXCIsIHZhbHVlOiAnIHgrPXkgJ30pO1xuLy8gbGV0IGFzdCA9IEFTVFBhcnNlci5wYXJzZSh7IHR5cGU6IFwiY29kZVwiLCB2YWx1ZTogJ2NsYXNzIHgge30gJ30pO1xuLy8gbGV0IGFzdCA9IEFTVFBhcnNlci5wYXJzZSh7IHR5cGU6IFwiY29kZVwiLCB2YWx1ZTogJ2NsYXNzIHggZXh0ZW5kcyB5IHt9ICd9KTsvLyBDYWxsIHN0YWNrXG4vLyBsZXQgYXN0ID0gQVNUUGFyc2VyLnBhcnNlKHsgdHlwZTogXCJjb2RlXCIsIHZhbHVlOiAnY2xhc3MgeCBleHRlbmRzIGZ1bmN0aW9uKCkge30ge30nfSk7IC8vIENhbGwgc3RhY2tcbi8vIGxldCBhc3QgPSBBU1RQYXJzZXIucGFyc2UoeyB0eXBlOiBcImNvZGVcIiwgdmFsdWU6ICdjbGFzcyB4IGV4dGVuZHMgZnVuY3Rpb24oKSB7fSB7fSd9KTsvLyBDYWxsIHN0YWNrXG4vLyBsZXQgYXN0ID0gQVNUUGFyc2VyLnBhcnNlKHsgdHlwZTogXCJjb2RlXCIsIHZhbHVlOiAnY2xhc3MgeCB7Y29uc3RydWN0b3IoKXt9fSd9KTsvLyBDYWxsIHN0YWNrXG4vLyBsZXQgYXN0ID0gQVNUUGFyc2VyLnBhcnNlKHsgdHlwZTogXCJjb2RlXCIsIHZhbHVlOiAnYXN5bmMgZnVuY3Rpb24gdGVzdCgpIHt9J30pO1xuLy9sZXQgYXN0ID0gQVNUUGFyc2VyLnBhcnNlKHsgdHlwZTogXCJjb2RlXCIsIHZhbHVlOiAnaW1wb3J0ICogYXMgYW50bHI0IGZyb20gXCJhbnRscjRcIid9KTtcbi8vIGxldCBhc3QgPSBBU1RQYXJzZXIucGFyc2UoeyB0eXBlOiBcImNvZGVcIiwgdmFsdWU6ICd0cnl7fWNhdGNoKGUpe30nfSk7XG4vLyBsZXQgYXN0ID0gQVNUUGFyc2VyLnBhcnNlKHsgdHlwZTogXCJjb2RlXCIsIHZhbHVlOiAnIGZ1bmN0aW9uIGdlbih4LCB5KXt9ICd9KTtcbi8vIGxldCBhc3QgPSBBU1RQYXJzZXIucGFyc2UoeyB0eXBlOiBcImNvZGVcIiwgdmFsdWU6ICcgYXN5bmMgZnVuY3Rpb24gZ2VuKHgsIHkpe30gJ30pO1xuLy8gIGxldCBhc3QgPSBBU1RQYXJzZXIucGFyc2UoeyB0eXBlOiBcImNvZGVcIiwgdmFsdWU6ICdhc3luYyBmdW5jdGlvbiogZ2VuKHosIHggPSAyLCB5KXt9ICd9KTtcbi8vIGxldCBhc3QgPSBBU1RQYXJzZXIucGFyc2UoeyB0eXBlOiBcImNvZGVcIiwgdmFsdWU6ICdsZXQgeCA9IDInfSk7XG4vL2xldCBhc3QgPSBBU1RQYXJzZXIucGFyc2UoeyB0eXBlOiBcImNvZGVcIiwgdmFsdWU6ICdsZXQge30gPSB7XCJhXCI6MiwgXCJiXCI6NH0nfSk7XG4vL2xldCBhc3QgPSBBU1RQYXJzZXIucGFyc2UoeyB0eXBlOiBcImNvZGVcIiwgdmFsdWU6ICdsZXQge3gsIHp9ID0ge1wiYVwiOjIsIFwiYlwiOjR9J30pO1xuLy8gbGV0IGFzdCA9IEFTVFBhcnNlci5wYXJzZSh7IHR5cGU6IFwiY29kZVwiLCB2YWx1ZTogJ2xldCB4LCB5ID0ge1wiQVwiOjIsIFwiQlwiOjF9J30pO1xuLy9sZXQgYXN0ID0gQVNUUGFyc2VyLnBhcnNlKHsgdHlwZTogXCJjb2RlXCIsIHZhbHVlOiAnbGV0IHgsIHkgPSAxJ30pO1xuLy8gT2JqZWN0IExpdGVyYWxsIEV4cHJlc3Npb25zXG5cbi8vIGxldCBhc3QgPSBBU1RQYXJzZXIucGFyc2UoeyB0eXBlOiBcImNvZGVcIiwgdmFsdWU6ICcgeCA9IHt9ICd9KTsgXG4vLyBsZXQgYXN0ID0gQVNUUGFyc2VyLnBhcnNlKHsgdHlwZTogXCJjb2RlXCIsIHZhbHVlOiAnIHggPSB7eToxLCB6OjIsIGF9ICd9KTsgXG4vLyBsZXQgYXN0ID0gQVNUUGFyc2VyLnBhcnNlKHsgdHlwZTogXCJjb2RlXCIsIHZhbHVlOiAneCA9IHtbcHh5XTogMTV9ICd9KTsgLy8gQ29tcHV0ZWRQcm9wZXJ0eUV4cHJlc3Npb25Bc3NpZ25tZW50XG4vLyBsZXQgYXN0ID0gQVNUUGFyc2VyLnBhcnNlKHsgdHlwZTogXCJjb2RlXCIsIHZhbHVlOiAneCA9IHtbMSsxXTogMiwgXCJBXCI6NH0gJ30pOyAvLyBDb21wdXRlZFByb3BlcnR5RXhwcmVzc2lvbkFzc2lnbm1lbnRcbiAvL2xldCBhc3QgPSBBU1RQYXJzZXIucGFyc2UoeyB0eXBlOiBcImNvZGVcIiwgdmFsdWU6ICd4ID0ge1wiQVwiOjIsIFwiQlwiOjEsIFtwcm9wTmFtZV06IDE1fSd9KTsgLy8gQ29tcHV0ZWRQcm9wZXJ0eUV4cHJlc3Npb25Bc3NpZ25tZW50XG4vL2xldCBhc3QgPSBBU1RQYXJzZXIucGFyc2UoeyB0eXBlOiBcImNvZGVcIiwgdmFsdWU6ICcgeCA9ICB7eSA6IHthc3luYyBweHkoKXt9fX0gICd9KTsgLy8gXG4vL2xldCBhc3QgPSBBU1RQYXJzZXIucGFyc2UoeyB0eXBlOiBcImNvZGVcIiwgdmFsdWU6ICcgeCA9IHsgYXN5bmMgcHh5KCl7fX0gJ30pOyAvLyAgIEZ1bmN0aW9uUHJvcGVydHlcbi8vIGxldCBhc3QgPSBBU1RQYXJzZXIucGFyc2UoeyB0eXBlOiBcImNvZGVcIiwgdmFsdWU6ICcgeCA9IHt6IDogMSwgYXN5bmMgcHh5KCl7fX0gJ30pOyAvLyAgIEZ1bmN0aW9uUHJvcGVydHlcbi8vIGxldCBhc3QgPSBBU1RQYXJzZXIucGFyc2UoeyB0eXBlOiBcImNvZGVcIiwgdmFsdWU6ICd4ID0ge2FzeW5jIHB4eSgpe30sIGJ5eigpe319ICd9KTsgXG5sZXQgYXN0ID0gQVNUUGFyc2VyLnBhcnNlKHsgdHlwZTogXCJjb2RlXCIsIHZhbHVlOiAneCA9IHsgdHlwZTogXCJNb25zdGVyXCIsIG5hbWUsIHBvd2VyIH07ICd9KTsgIC8vIFNob3J0aGFuZFxuY29uc29sZS5pbmZvKHRvSnNvbihhc3QpKVxuLy9sZXQgZ2VuZXJhdG9yID0gbmV3IFNvdXJjZUdlbmVyYXRvcigpO1xuLy9nZW5lcmF0b3IudmlzaXQoYXN0KTtcblxuLy8gVHJpY2sgdG8gcHJldmVudCAgXG4vLyBBbGwgZmlsZXMgbXVzdCBiZSBtb2R1bGVzIHdoZW4gdGhlICctLWlzb2xhdGVkTW9kdWxlcycgZmxhZyBpcyBwcm92aWRlZC50cygxMjA4KVxuZXhwb3J0IHsgfSAiXX0=