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
//let ast = ASTParser.parse({ type: "code", value: "var x = 1;"});

let ast = _ASTParser.default.parse({
  type: "code",
  value: 'x = {"A": 1, x:2}'
});

console.info(toJson(ast)); //let generator = new SourceGenerator();
//generator.visit(ast);
// Trick to prevent  
// All files must be modules when the '--isolatedModules' flag is provided.ts(1208)
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC50cyJdLCJuYW1lcyI6WyJ0b0pzb24iLCJvYmoiLCJKU09OIiwic3RyaW5naWZ5IiwicmVwbGFjZXIiLCJrZXkiLCJ2YWx1ZSIsImNvbnNvbGUiLCJpbmZvIiwiaW5wdXQxIiwiaW5wdXQyIiwiaW5wdXQzIiwiYXN0IiwiQVNUUGFyc2VyIiwicGFyc2UiLCJ0eXBlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7OztBQUdBLElBQUlBLE1BQU0sR0FBSUMsR0FBRCxJQUFtQkMsSUFBSSxDQUFDQyxTQUFMLENBQWVGLEdBQWYsRUFBb0IsU0FBU0csUUFBVCxDQUFrQkMsR0FBbEIsRUFBdUJDLEtBQXZCLEVBQThCO0FBQUUsU0FBT0EsS0FBUDtBQUFhLENBQWpFLENBQWhDOztBQUVBQyxPQUFPLENBQUNDLElBQVIsQ0FBYSxhQUFiO0FBQ0EsSUFBSUMsTUFBTSxHQUFHLEdBQWI7QUFDQSxJQUFJQyxNQUFNLEdBQUcsK0RBQWI7QUFDQSxJQUFJQyxNQUFNLEdBQUcsZ0JBQWI7QUFDQTs7Ozs7OztBQU9BO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQztBQUNEO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFDQSxJQUFJQyxHQUFHLEdBQUdDLG1CQUFVQyxLQUFWLENBQWdCO0FBQUVDLEVBQUFBLElBQUksRUFBRSxNQUFSO0FBQWdCVCxFQUFBQSxLQUFLLEVBQUU7QUFBdkIsQ0FBaEIsQ0FBVjs7QUFDQUMsT0FBTyxDQUFDQyxJQUFSLENBQWFSLE1BQU0sQ0FBQ1ksR0FBRCxDQUFuQixFLENBQ0E7QUFDQTtBQUVBO0FBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQVNUUGFyc2VyLCB7IFBhcnNlclR5cGUgfSBmcm9tIFwiLi9BU1RQYXJzZXJcIlxuaW1wb3J0IFNvdXJjZUdlbmVyYXRvciBmcm9tIFwiLi9Tb3VyY2VHZW5lcmF0b3JcIjtcblxubGV0IHRvSnNvbiA9IChvYmo6YW55KTogc3RyaW5nPT5KU09OLnN0cmluZ2lmeShvYmosIGZ1bmN0aW9uIHJlcGxhY2VyKGtleSwgdmFsdWUpIHsgcmV0dXJuIHZhbHVlfSk7XG5cbmNvbnNvbGUuaW5mbygnVHJhbnNwaWxsZXInKTtcbmxldCBpbnB1dDEgPSBcIjFcIlxubGV0IGlucHV0MiA9IFwidmFyIHggPSBmdW5jdGlvbih5LCB6KSB7IGNvbnNvbGUuaW5mbygndGhpcyBpcyBhIHN0cmluZycpIDsgfVwiXG5sZXQgaW5wdXQzID0gXCJ2YXIgeCA9ICAyICsgNFwiXG4vKlxuICAgICAgICB7XG4gICAgICAgIHRydWUgXG4gICAgICAgIGZhbHNlXG4gICAgICAgIFwidHJ1ZVwiXG4gICAgICAgIH1cbiAqL1xuLy9sZXQgYXN0cGFyc2VyID0gQVNUUGFyc2VyLnBhcnNlKHsgdHlwZTogXCJjb2RlXCIsIHZhbHVlOiBcInNvdXJjZVwiIH0sIFBhcnNlclR5cGUuRUNNQVNjcmlwdCk7XG4vLyBsZXQgYXN0ID0gQVNUUGFyc2VyLnBhcnNlKHsgdHlwZTogXCJjb2RlXCIsIHZhbHVlOiBcInsgdmFyIHggPSAxOyAgIHZhciB4ID0gMjsgfVwiIH0pO1xuLy8gbGV0IGFzdCA9IEFTVFBhcnNlci5wYXJzZSh7IHR5cGU6IFwiY29kZVwiLCB2YWx1ZTogXCJ7IHsgIH0gfVwiIH0pO1xuLy9sZXQgYXN0ID0gQVNUUGFyc2VyLnBhcnNlKHsgdHlwZTogXCJjb2RlXCIsIHZhbHVlOiBcInsgIHggPSAxIH1cIiB9KTtcblxuLy9sZXQgYXN0ID0gQVNUUGFyc2VyLnBhcnNlKHsgdHlwZTogXCJjb2RlXCIsIHZhbHVlOiBcInsgeyAxLCB0cnVlLCAnQSd9IH1cIiB9KTtcbi8vIGxldCBhc3QgPSBBU1RQYXJzZXIucGFyc2UoeyB0eXBlOiBcImNvZGVcIiwgdmFsdWU6IFwidHJ1ZSwgMSwgJ0EnLCBcXFwiWFxcXCJcIiB9KTtcbi8vbGV0IGFzdCA9IEFTVFBhcnNlci5wYXJzZSh7IHR5cGU6IFwiY29kZVwiLCB2YWx1ZTogXCJ4ID0gMVwiIH0pO1xuLy8gIGxldCBhc3QgPSBBU1RQYXJzZXIucGFyc2UoeyB0eXBlOiBcImNvZGVcIiwgdmFsdWU6IFwiIDEsIHRydWUsICdBJyBcIn0pO1xuIC8vbGV0IGFzdCA9IEFTVFBhcnNlci5wYXJzZSh7IHR5cGU6IFwiY29kZVwiLCB2YWx1ZTogXCIgMS4yICx0cnVlLCBcXFwiVGV4dFxcXCJcIn0pO1xuLy8gbGV0IGFzdCA9IEFTVFBhcnNlci5wYXJzZSh7IHR5cGU6IFwiY29kZVwiLCB2YWx1ZTogXCIgZnVuY3Rpb24gQUEoeCwgeSl7fSAgZnVuY3Rpb24gQkIoeCwgeSl7fSBcIn0pO1xuXG4vLyBsZXQgYXN0ID0gQVNUUGFyc2VyLnBhcnNlKHsgdHlwZTogXCJjb2RlXCIsIHZhbHVlOiBcIigxICsgMSlcIn0pO1xuLy9sZXQgYXN0ID0gQVNUUGFyc2VyLnBhcnNlKHsgdHlwZTogXCJjb2RlXCIsIHZhbHVlOiBcIjEgKyAyXCJ9KTtcbi8vbGV0IGFzdCA9IEFTVFBhcnNlci5wYXJzZSh7IHR5cGU6IFwiY29kZVwiLCB2YWx1ZTogXCJ4IC8gMlwifSk7XG4vLyBsZXQgYXN0ID0gQVNUUGFyc2VyLnBhcnNlKHsgdHlwZTogXCJjb2RlXCIsIHZhbHVlOiBcInggLyAxICArIDFcIn0pO1xuLy9sZXQgYXN0ID0gQVNUUGFyc2VyLnBhcnNlKHsgdHlwZTogXCJjb2RlXCIsIHZhbHVlOiBcInggKyAxICsgMVwifSk7XG4vL2xldCBhc3QgPSBBU1RQYXJzZXIucGFyc2UoeyB0eXBlOiBcImNvZGVcIiwgdmFsdWU6IFwieSA9IHggKyAxICsgMVwifSk7XG4vLy8vLy4ubGV0IGFzdCA9IEFTVFBhcnNlci5wYXJzZSh7IHR5cGU6IFwiY29kZVwiLCB2YWx1ZTogXCJ4ID0gMSsyXCJ9KTtcbi8vIGxldCBhc3QgPSBBU1RQYXJzZXIucGFyc2UoeyB0eXBlOiBcImNvZGVcIiwgdmFsdWU6IFwidmFyIHggPSAxICsgMVwifSk7XG4vLyBsZXQgYXN0ID0gQVNUUGFyc2VyLnBhcnNlKHsgdHlwZTogXCJjb2RlXCIsIHZhbHVlOiBcInggPSBbeCwgMiArIDFdXCJ9KTtcbi8vIGxldCBhc3QgPSBBU1RQYXJzZXIucGFyc2UoeyB0eXBlOiBcImNvZGVcIiwgdmFsdWU6IFwiWzEsIDIsIDMsLCwsXVwifSk7XG4vL2xldCBhc3QgPSBBU1RQYXJzZXIucGFyc2UoeyB0eXBlOiBcImNvZGVcIiwgdmFsdWU6IFwidmFyIHggPSAxO1wifSk7XG5sZXQgYXN0ID0gQVNUUGFyc2VyLnBhcnNlKHsgdHlwZTogXCJjb2RlXCIsIHZhbHVlOiAneCA9IHtcIkFcIjogMSwgeDoyfSd9KTtcbmNvbnNvbGUuaW5mbyh0b0pzb24oYXN0KSlcbi8vbGV0IGdlbmVyYXRvciA9IG5ldyBTb3VyY2VHZW5lcmF0b3IoKTtcbi8vZ2VuZXJhdG9yLnZpc2l0KGFzdCk7XG5cbi8vIFRyaWNrIHRvIHByZXZlbnQgIFxuLy8gQWxsIGZpbGVzIG11c3QgYmUgbW9kdWxlcyB3aGVuIHRoZSAnLS1pc29sYXRlZE1vZHVsZXMnIGZsYWcgaXMgcHJvdmlkZWQudHMoMTIwOClcbmV4cG9ydCB7IH0gIl19