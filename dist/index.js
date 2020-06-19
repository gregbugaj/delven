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

let ast = _ASTParser.default.parse({
  type: "code",
  value: ' x+=y '
});

console.info(toJson(ast)); //let generator = new SourceGenerator();
//generator.visit(ast);
// Trick to prevent  
// All files must be modules when the '--isolatedModules' flag is provided.ts(1208)
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC50cyJdLCJuYW1lcyI6WyJ0b0pzb24iLCJvYmoiLCJKU09OIiwic3RyaW5naWZ5IiwicmVwbGFjZXIiLCJrZXkiLCJ2YWx1ZSIsImNvbnNvbGUiLCJpbmZvIiwiaW5wdXQxIiwiaW5wdXQyIiwiaW5wdXQzIiwiYXN0IiwiQVNUUGFyc2VyIiwicGFyc2UiLCJ0eXBlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFJQTs7OztBQUlBLElBQUlBLE1BQU0sR0FBSUMsR0FBRCxJQUFtQkMsSUFBSSxDQUFDQyxTQUFMLENBQWVGLEdBQWYsRUFBb0IsU0FBU0csUUFBVCxDQUFrQkMsR0FBbEIsRUFBdUJDLEtBQXZCLEVBQThCO0FBQUUsU0FBT0EsS0FBUDtBQUFhLENBQWpFLENBQWhDOztBQUVBQyxPQUFPLENBQUNDLElBQVIsQ0FBYSxhQUFiO0FBQ0EsSUFBSUMsTUFBTSxHQUFHLEdBQWI7QUFDQSxJQUFJQyxNQUFNLEdBQUcsK0RBQWI7QUFDQSxJQUFJQyxNQUFNLEdBQUcsZ0JBQWI7QUFFQTs7Ozs7Ozs7OztBQVVBSixPQUFPLENBQUNDLElBQVIsQ0FBYSx1QkFBYixFLENBQ0E7O0FBR0E7Ozs7Ozs7QUFPQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0M7QUFDRDtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFDQSxJQUFJSSxHQUFHLEdBQUdDLG1CQUFVQyxLQUFWLENBQWdCO0FBQUVDLEVBQUFBLElBQUksRUFBRSxNQUFSO0FBQWdCVCxFQUFBQSxLQUFLLEVBQUU7QUFBdkIsQ0FBaEIsQ0FBVjs7QUFDQUMsT0FBTyxDQUFDQyxJQUFSLENBQWFSLE1BQU0sQ0FBQ1ksR0FBRCxDQUFuQixFLENBQ0E7QUFDQTtBQUVBO0FBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBhbnRscjQgZnJvbSBcImFudGxyNFwiXG5pbXBvcnQgeyBFQ01BU2NyaXB0UGFyc2VyIGFzIERlbHZlblBhcnNlciB9IGZyb20gXCIuL3BhcnNlci9FQ01BU2NyaXB0UGFyc2VyXCJcbmltcG9ydCB7IEVDTUFTY3JpcHRMZXhlciBhcyBEZWx2ZW5MZXhlciB9IGZyb20gXCIuL3BhcnNlci9FQ01BU2NyaXB0TGV4ZXJcIlxuXG5pbXBvcnQgQVNUUGFyc2VyLCB7IFBhcnNlclR5cGUgfSBmcm9tIFwiLi9BU1RQYXJzZXJcIlxuaW1wb3J0IFNvdXJjZUdlbmVyYXRvciBmcm9tIFwiLi9Tb3VyY2VHZW5lcmF0b3JcIjtcblxuXG5sZXQgdG9Kc29uID0gKG9iajphbnkpOiBzdHJpbmc9PkpTT04uc3RyaW5naWZ5KG9iaiwgZnVuY3Rpb24gcmVwbGFjZXIoa2V5LCB2YWx1ZSkgeyByZXR1cm4gdmFsdWV9KTtcblxuY29uc29sZS5pbmZvKCdUcmFuc3BpbGxlcicpO1xubGV0IGlucHV0MSA9IFwiMVwiXG5sZXQgaW5wdXQyID0gXCJ2YXIgeCA9IGZ1bmN0aW9uKHksIHopIHsgY29uc29sZS5pbmZvKCd0aGlzIGlzIGEgc3RyaW5nJykgOyB9XCJcbmxldCBpbnB1dDMgPSBcInZhciB4ID0gIDIgKyA0XCJcblxuLyogXG5jb25zdCBpbnB1dCA9IFwiMVwiO1xuY29uc3QgY2hhcnMgPSBuZXcgYW50bHI0LklucHV0U3RyZWFtKGlucHV0KTtcbmNvbnN0IGxleGVyID0gbmV3IERlbHZlbkxleGVyKGNoYXJzKTtcbmxleGVyLnN0cmljdE1vZGUgPSBmYWxzZTtcbmNvbnN0IHRva2VucyA9IG5ldyBhbnRscjQuQ29tbW9uVG9rZW5TdHJlYW0obGV4ZXIpO1xuY29uc3QgcGFyc2VyID0gbmV3IERlbHZlblBhcnNlcih0b2tlbnMpO1xucGFyc2VyLmJ1aWxkUGFyc2VUcmVlcyA9IHRydWU7XG5jb25zdCB0cmVlID0gcGFyc2VyLnByb2dyYW0oKTsgKi9cblxuY29uc29sZS5pbmZvKFwiLS0tLS0tLS0tLS0tLS0tLS0tLS0tXCIpO1xuLy9sZXQgcmVzdWx0ID0gdHJlZS5hY2NlcHQodGhpcy52aXNpdG9yKTtcblxuXG4vKlxuICAgICAgICB7XG4gICAgICAgIHRydWUgXG4gICAgICAgIGZhbHNlXG4gICAgICAgIFwidHJ1ZVwiXG4gICAgICAgIH1cbiAqL1xuLy9sZXQgYXN0cGFyc2VyID0gQVNUUGFyc2VyLnBhcnNlKHsgdHlwZTogXCJjb2RlXCIsIHZhbHVlOiBcInNvdXJjZVwiIH0sIFBhcnNlclR5cGUuRUNNQVNjcmlwdCk7XG4vLyBsZXQgYXN0ID0gQVNUUGFyc2VyLnBhcnNlKHsgdHlwZTogXCJjb2RlXCIsIHZhbHVlOiBcInsgdmFyIHggPSAxOyAgIHZhciB4ID0gMjsgfVwiIH0pO1xuLy8gbGV0IGFzdCA9IEFTVFBhcnNlci5wYXJzZSh7IHR5cGU6IFwiY29kZVwiLCB2YWx1ZTogXCJ7IHsgIH0gfVwiIH0pO1xuLy9sZXQgYXN0ID0gQVNUUGFyc2VyLnBhcnNlKHsgdHlwZTogXCJjb2RlXCIsIHZhbHVlOiBcInsgIHggPSAxIH1cIiB9KTtcblxuLy9sZXQgYXN0ID0gQVNUUGFyc2VyLnBhcnNlKHsgdHlwZTogXCJjb2RlXCIsIHZhbHVlOiBcInsgeyAxLCB0cnVlLCAnQSd9IH1cIiB9KTtcbi8vIGxldCBhc3QgPSBBU1RQYXJzZXIucGFyc2UoeyB0eXBlOiBcImNvZGVcIiwgdmFsdWU6IFwidHJ1ZSwgMSwgJ0EnLCBcXFwiWFxcXCJcIiB9KTtcbi8vbGV0IGFzdCA9IEFTVFBhcnNlci5wYXJzZSh7IHR5cGU6IFwiY29kZVwiLCB2YWx1ZTogXCJ4ID0gMVwiIH0pO1xuLy8gIGxldCBhc3QgPSBBU1RQYXJzZXIucGFyc2UoeyB0eXBlOiBcImNvZGVcIiwgdmFsdWU6IFwiIDEsIHRydWUsICdBJyBcIn0pO1xuIC8vbGV0IGFzdCA9IEFTVFBhcnNlci5wYXJzZSh7IHR5cGU6IFwiY29kZVwiLCB2YWx1ZTogXCIgMS4yICx0cnVlLCBcXFwiVGV4dFxcXCJcIn0pO1xuLy8gbGV0IGFzdCA9IEFTVFBhcnNlci5wYXJzZSh7IHR5cGU6IFwiY29kZVwiLCB2YWx1ZTogXCIgZnVuY3Rpb24gQUEoeCwgeSl7fSAgZnVuY3Rpb24gQkIoeCwgeSl7fSBcIn0pO1xuXG4vLyBsZXQgYXN0ID0gQVNUUGFyc2VyLnBhcnNlKHsgdHlwZTogXCJjb2RlXCIsIHZhbHVlOiBcIigxICsgMSlcIn0pO1xuLy9sZXQgYXN0ID0gQVNUUGFyc2VyLnBhcnNlKHsgdHlwZTogXCJjb2RlXCIsIHZhbHVlOiBcIjEgKyAyXCJ9KTtcbi8vbGV0IGFzdCA9IEFTVFBhcnNlci5wYXJzZSh7IHR5cGU6IFwiY29kZVwiLCB2YWx1ZTogXCJ4IC8gMlwifSk7XG4vLyBsZXQgYXN0ID0gQVNUUGFyc2VyLnBhcnNlKHsgdHlwZTogXCJjb2RlXCIsIHZhbHVlOiBcInggLyAxICArIDFcIn0pO1xuLy9sZXQgYXN0ID0gQVNUUGFyc2VyLnBhcnNlKHsgdHlwZTogXCJjb2RlXCIsIHZhbHVlOiBcInggKyAxICsgMVwifSk7XG4vL2xldCBhc3QgPSBBU1RQYXJzZXIucGFyc2UoeyB0eXBlOiBcImNvZGVcIiwgdmFsdWU6IFwieSA9IHggKyAxICsgMVwifSk7XG4vLy8vLy4ubGV0IGFzdCA9IEFTVFBhcnNlci5wYXJzZSh7IHR5cGU6IFwiY29kZVwiLCB2YWx1ZTogXCJ4ID0gMSsyXCJ9KTtcbi8vIGxldCBhc3QgPSBBU1RQYXJzZXIucGFyc2UoeyB0eXBlOiBcImNvZGVcIiwgdmFsdWU6IFwidmFyIHggPSAxICsgMVwifSk7XG4vLyBsZXQgYXN0ID0gQVNUUGFyc2VyLnBhcnNlKHsgdHlwZTogXCJjb2RlXCIsIHZhbHVlOiBcInggPSBbeCwgMiArIDFdXCJ9KTtcbi8vIGxldCBhc3QgPSBBU1RQYXJzZXIucGFyc2UoeyB0eXBlOiBcImNvZGVcIiwgdmFsdWU6IFwiWzEsIDIsIDMsLCwsXVwifSk7XG4vL2xldCBhc3QgPSBBU1RQYXJzZXIucGFyc2UoeyB0eXBlOiBcImNvZGVcIiwgdmFsdWU6IFwidmFyIHgsIHlcIn0pO1xuLy9sZXQgYXN0ID0gQVNUUGFyc2VyLnBhcnNlKHsgdHlwZTogXCJjb2RlXCIsIHZhbHVlOiAneCA9IHtcIkFcIjogMSwgeDoyfSd9KTtcbi8vbGV0IGFzdCA9IEFTVFBhcnNlci5wYXJzZSh7IHR5cGU6IFwiY29kZVwiLCB2YWx1ZTogJ1sxMSwsLF0nfSk7XG4vLyBsZXQgYXN0ID0gQVNUUGFyc2VyLnBhcnNlKHsgdHlwZTogXCJjb2RlXCIsIHZhbHVlOiAndmFyIHggPSB7XCJhXCI6MX0nfSk7XG4vL2xldCBhc3QgPSBBU1RQYXJzZXIucGFyc2UoeyB0eXBlOiBcImNvZGVcIiwgdmFsdWU6ICd2YXIgeCA9IFsxLDJdJ30pO1xuLy9sZXQgYXN0ID0gQVNUUGFyc2VyLnBhcnNlKHsgdHlwZTogXCJjb2RlXCIsIHZhbHVlOiAnIHZhciB4ID0gWzEsIHt9XSd9KTtcbi8vIGxldCBhc3QgPSBBU1RQYXJzZXIucGFyc2UoeyB0eXBlOiBcImNvZGVcIiwgdmFsdWU6ICcgdmFyIHggPSBbMSwge1wiYVwiOjIzLCB6OlwiYWJjXCJ9XSd9KTtcbiAvLyBsZXQgYXN0ID0gQVNUUGFyc2VyLnBhcnNlKHsgdHlwZTogXCJjb2RlXCIsIHZhbHVlOiAnKDEgKyAxICknfSk7XG4vLyBsZXQgYXN0ID0gQVNUUGFyc2VyLnBhcnNlKHsgdHlwZTogXCJjb2RlXCIsIHZhbHVlOiAnIHggIT0gMSAnfSk7XG4vL2xldCBhc3QgPSBBU1RQYXJzZXIucGFyc2UoeyB0eXBlOiBcImNvZGVcIiwgdmFsdWU6ICcgaWYoeCAhPSAxKXsgfSd9KTtcbi8vIGxldCBhc3QgPSBBU1RQYXJzZXIucGFyc2UoeyB0eXBlOiBcImNvZGVcIiwgdmFsdWU6ICcgaWYoeCl7IH0nfSk7XG4vL2xldCBhc3QgPSBBU1RQYXJzZXIucGFyc2UoeyB0eXBlOiBcImNvZGVcIiwgdmFsdWU6ICcgaWYoeCAhPSAxKXsgfSBlbHNlIHt9ICd9KTtcbi8vbGV0IGFzdCA9IEFTVFBhcnNlci5wYXJzZSh7IHR5cGU6IFwiY29kZVwiLCB2YWx1ZTogJyBpZih4ICE9IDEpeyB9IGVsc2UgaWYgKHggPT0gMikge30nfSk7XG4vL2xldCBhc3QgPSBBU1RQYXJzZXIucGFyc2UoeyB0eXBlOiBcImNvZGVcIiwgdmFsdWU6ICcgaWYoeCAhPSAxKXsgfSBlbHNlIGlmICh4ID09IDIpIHt9IGVsc2Uge30nfSk7XG4vLyBsZXQgYXN0ID0gQVNUUGFyc2VyLnBhcnNlKHsgdHlwZTogXCJjb2RlXCIsIHZhbHVlOiAnIHggPSB5LnogJ30pO1xuLy9sZXQgYXN0ID0gQVNUUGFyc2VyLnBhcnNlKHsgdHlwZTogXCJjb2RlXCIsIHZhbHVlOiAnIHhbMV0gJ30pOyBcbi8vbGV0IGFzdCA9IEFTVFBhcnNlci5wYXJzZSh7IHR5cGU6IFwiY29kZVwiLCB2YWx1ZTogJyB4Kz0xICd9KTsgXG5sZXQgYXN0ID0gQVNUUGFyc2VyLnBhcnNlKHsgdHlwZTogXCJjb2RlXCIsIHZhbHVlOiAnIHgrPXkgJ30pO1xuY29uc29sZS5pbmZvKHRvSnNvbihhc3QpKVxuLy9sZXQgZ2VuZXJhdG9yID0gbmV3IFNvdXJjZUdlbmVyYXRvcigpO1xuLy9nZW5lcmF0b3IudmlzaXQoYXN0KTtcblxuLy8gVHJpY2sgdG8gcHJldmVudCAgXG4vLyBBbGwgZmlsZXMgbXVzdCBiZSBtb2R1bGVzIHdoZW4gdGhlICctLWlzb2xhdGVkTW9kdWxlcycgZmxhZyBpcyBwcm92aWRlZC50cygxMjA4KVxuZXhwb3J0IHsgfSAiXX0=