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
//let ast = ASTParser.parse({ type: "code", value: "var x, y"});
//let ast = ASTParser.parse({ type: "code", value: 'x = {"A": 1, x:2}'});
//let ast = ASTParser.parse({ type: "code", value: '[11,,,]'});
// let ast = ASTParser.parse({ type: "code", value: 'var x = {"a":1}'});
//let ast = ASTParser.parse({ type: "code", value: 'var x = [1,2]'});
//let ast = ASTParser.parse({ type: "code", value: ' var x = [1, {}]'});

let ast = _ASTParser.default.parse({
  type: "code",
  value: ' var x = [1, {"a":23, z:"abc"}]'
});

console.info(toJson(ast)); //let generator = new SourceGenerator();
//generator.visit(ast);
// Trick to prevent  
// All files must be modules when the '--isolatedModules' flag is provided.ts(1208)
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC50cyJdLCJuYW1lcyI6WyJ0b0pzb24iLCJvYmoiLCJKU09OIiwic3RyaW5naWZ5IiwicmVwbGFjZXIiLCJrZXkiLCJ2YWx1ZSIsImNvbnNvbGUiLCJpbmZvIiwiaW5wdXQxIiwiaW5wdXQyIiwiaW5wdXQzIiwiYXN0IiwiQVNUUGFyc2VyIiwicGFyc2UiLCJ0eXBlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7OztBQUdBLElBQUlBLE1BQU0sR0FBSUMsR0FBRCxJQUFtQkMsSUFBSSxDQUFDQyxTQUFMLENBQWVGLEdBQWYsRUFBb0IsU0FBU0csUUFBVCxDQUFrQkMsR0FBbEIsRUFBdUJDLEtBQXZCLEVBQThCO0FBQUUsU0FBT0EsS0FBUDtBQUFhLENBQWpFLENBQWhDOztBQUVBQyxPQUFPLENBQUNDLElBQVIsQ0FBYSxhQUFiO0FBQ0EsSUFBSUMsTUFBTSxHQUFHLEdBQWI7QUFDQSxJQUFJQyxNQUFNLEdBQUcsK0RBQWI7QUFDQSxJQUFJQyxNQUFNLEdBQUcsZ0JBQWI7QUFDQTs7Ozs7OztBQU9BO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQztBQUNEO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBQ0EsSUFBSUMsR0FBRyxHQUFHQyxtQkFBVUMsS0FBVixDQUFnQjtBQUFFQyxFQUFBQSxJQUFJLEVBQUUsTUFBUjtBQUFnQlQsRUFBQUEsS0FBSyxFQUFFO0FBQXZCLENBQWhCLENBQVY7O0FBRUFDLE9BQU8sQ0FBQ0MsSUFBUixDQUFhUixNQUFNLENBQUNZLEdBQUQsQ0FBbkIsRSxDQUNBO0FBQ0E7QUFFQTtBQUNBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEFTVFBhcnNlciwgeyBQYXJzZXJUeXBlIH0gZnJvbSBcIi4vQVNUUGFyc2VyXCJcbmltcG9ydCBTb3VyY2VHZW5lcmF0b3IgZnJvbSBcIi4vU291cmNlR2VuZXJhdG9yXCI7XG5cbmxldCB0b0pzb24gPSAob2JqOmFueSk6IHN0cmluZz0+SlNPTi5zdHJpbmdpZnkob2JqLCBmdW5jdGlvbiByZXBsYWNlcihrZXksIHZhbHVlKSB7IHJldHVybiB2YWx1ZX0pO1xuXG5jb25zb2xlLmluZm8oJ1RyYW5zcGlsbGVyJyk7XG5sZXQgaW5wdXQxID0gXCIxXCJcbmxldCBpbnB1dDIgPSBcInZhciB4ID0gZnVuY3Rpb24oeSwgeikgeyBjb25zb2xlLmluZm8oJ3RoaXMgaXMgYSBzdHJpbmcnKSA7IH1cIlxubGV0IGlucHV0MyA9IFwidmFyIHggPSAgMiArIDRcIlxuLypcbiAgICAgICAge1xuICAgICAgICB0cnVlIFxuICAgICAgICBmYWxzZVxuICAgICAgICBcInRydWVcIlxuICAgICAgICB9XG4gKi9cbi8vbGV0IGFzdHBhcnNlciA9IEFTVFBhcnNlci5wYXJzZSh7IHR5cGU6IFwiY29kZVwiLCB2YWx1ZTogXCJzb3VyY2VcIiB9LCBQYXJzZXJUeXBlLkVDTUFTY3JpcHQpO1xuLy8gbGV0IGFzdCA9IEFTVFBhcnNlci5wYXJzZSh7IHR5cGU6IFwiY29kZVwiLCB2YWx1ZTogXCJ7IHZhciB4ID0gMTsgICB2YXIgeCA9IDI7IH1cIiB9KTtcbi8vIGxldCBhc3QgPSBBU1RQYXJzZXIucGFyc2UoeyB0eXBlOiBcImNvZGVcIiwgdmFsdWU6IFwieyB7ICB9IH1cIiB9KTtcbi8vbGV0IGFzdCA9IEFTVFBhcnNlci5wYXJzZSh7IHR5cGU6IFwiY29kZVwiLCB2YWx1ZTogXCJ7ICB4ID0gMSB9XCIgfSk7XG5cbi8vbGV0IGFzdCA9IEFTVFBhcnNlci5wYXJzZSh7IHR5cGU6IFwiY29kZVwiLCB2YWx1ZTogXCJ7IHsgMSwgdHJ1ZSwgJ0EnfSB9XCIgfSk7XG4vLyBsZXQgYXN0ID0gQVNUUGFyc2VyLnBhcnNlKHsgdHlwZTogXCJjb2RlXCIsIHZhbHVlOiBcInRydWUsIDEsICdBJywgXFxcIlhcXFwiXCIgfSk7XG4vL2xldCBhc3QgPSBBU1RQYXJzZXIucGFyc2UoeyB0eXBlOiBcImNvZGVcIiwgdmFsdWU6IFwieCA9IDFcIiB9KTtcbi8vICBsZXQgYXN0ID0gQVNUUGFyc2VyLnBhcnNlKHsgdHlwZTogXCJjb2RlXCIsIHZhbHVlOiBcIiAxLCB0cnVlLCAnQScgXCJ9KTtcbiAvL2xldCBhc3QgPSBBU1RQYXJzZXIucGFyc2UoeyB0eXBlOiBcImNvZGVcIiwgdmFsdWU6IFwiIDEuMiAsdHJ1ZSwgXFxcIlRleHRcXFwiXCJ9KTtcbi8vIGxldCBhc3QgPSBBU1RQYXJzZXIucGFyc2UoeyB0eXBlOiBcImNvZGVcIiwgdmFsdWU6IFwiIGZ1bmN0aW9uIEFBKHgsIHkpe30gIGZ1bmN0aW9uIEJCKHgsIHkpe30gXCJ9KTtcblxuLy8gbGV0IGFzdCA9IEFTVFBhcnNlci5wYXJzZSh7IHR5cGU6IFwiY29kZVwiLCB2YWx1ZTogXCIoMSArIDEpXCJ9KTtcbi8vbGV0IGFzdCA9IEFTVFBhcnNlci5wYXJzZSh7IHR5cGU6IFwiY29kZVwiLCB2YWx1ZTogXCIxICsgMlwifSk7XG4vL2xldCBhc3QgPSBBU1RQYXJzZXIucGFyc2UoeyB0eXBlOiBcImNvZGVcIiwgdmFsdWU6IFwieCAvIDJcIn0pO1xuLy8gbGV0IGFzdCA9IEFTVFBhcnNlci5wYXJzZSh7IHR5cGU6IFwiY29kZVwiLCB2YWx1ZTogXCJ4IC8gMSAgKyAxXCJ9KTtcbi8vbGV0IGFzdCA9IEFTVFBhcnNlci5wYXJzZSh7IHR5cGU6IFwiY29kZVwiLCB2YWx1ZTogXCJ4ICsgMSArIDFcIn0pO1xuLy9sZXQgYXN0ID0gQVNUUGFyc2VyLnBhcnNlKHsgdHlwZTogXCJjb2RlXCIsIHZhbHVlOiBcInkgPSB4ICsgMSArIDFcIn0pO1xuLy8vLy8uLmxldCBhc3QgPSBBU1RQYXJzZXIucGFyc2UoeyB0eXBlOiBcImNvZGVcIiwgdmFsdWU6IFwieCA9IDErMlwifSk7XG4vLyBsZXQgYXN0ID0gQVNUUGFyc2VyLnBhcnNlKHsgdHlwZTogXCJjb2RlXCIsIHZhbHVlOiBcInZhciB4ID0gMSArIDFcIn0pO1xuLy8gbGV0IGFzdCA9IEFTVFBhcnNlci5wYXJzZSh7IHR5cGU6IFwiY29kZVwiLCB2YWx1ZTogXCJ4ID0gW3gsIDIgKyAxXVwifSk7XG4vLyBsZXQgYXN0ID0gQVNUUGFyc2VyLnBhcnNlKHsgdHlwZTogXCJjb2RlXCIsIHZhbHVlOiBcIlsxLCAyLCAzLCwsLF1cIn0pO1xuLy9sZXQgYXN0ID0gQVNUUGFyc2VyLnBhcnNlKHsgdHlwZTogXCJjb2RlXCIsIHZhbHVlOiBcInZhciB4LCB5XCJ9KTtcbi8vbGV0IGFzdCA9IEFTVFBhcnNlci5wYXJzZSh7IHR5cGU6IFwiY29kZVwiLCB2YWx1ZTogJ3ggPSB7XCJBXCI6IDEsIHg6Mn0nfSk7XG4vL2xldCBhc3QgPSBBU1RQYXJzZXIucGFyc2UoeyB0eXBlOiBcImNvZGVcIiwgdmFsdWU6ICdbMTEsLCxdJ30pO1xuLy8gbGV0IGFzdCA9IEFTVFBhcnNlci5wYXJzZSh7IHR5cGU6IFwiY29kZVwiLCB2YWx1ZTogJ3ZhciB4ID0ge1wiYVwiOjF9J30pO1xuLy9sZXQgYXN0ID0gQVNUUGFyc2VyLnBhcnNlKHsgdHlwZTogXCJjb2RlXCIsIHZhbHVlOiAndmFyIHggPSBbMSwyXSd9KTtcbi8vbGV0IGFzdCA9IEFTVFBhcnNlci5wYXJzZSh7IHR5cGU6IFwiY29kZVwiLCB2YWx1ZTogJyB2YXIgeCA9IFsxLCB7fV0nfSk7XG5sZXQgYXN0ID0gQVNUUGFyc2VyLnBhcnNlKHsgdHlwZTogXCJjb2RlXCIsIHZhbHVlOiAnIHZhciB4ID0gWzEsIHtcImFcIjoyMywgejpcImFiY1wifV0nfSk7XG5cbmNvbnNvbGUuaW5mbyh0b0pzb24oYXN0KSlcbi8vbGV0IGdlbmVyYXRvciA9IG5ldyBTb3VyY2VHZW5lcmF0b3IoKTtcbi8vZ2VuZXJhdG9yLnZpc2l0KGFzdCk7XG5cbi8vIFRyaWNrIHRvIHByZXZlbnQgIFxuLy8gQWxsIGZpbGVzIG11c3QgYmUgbW9kdWxlcyB3aGVuIHRoZSAnLS1pc29sYXRlZE1vZHVsZXMnIGZsYWcgaXMgcHJvdmlkZWQudHMoMTIwOClcbmV4cG9ydCB7IH0gIl19