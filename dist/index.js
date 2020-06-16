"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ASTParser = _interopRequireDefault(require("./ASTParser"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
// let ast = ASTParser.parse({ type: "code", value: "{ { 1 } }" });
//let ast = ASTParser.parse({ type: "code", value: "{  x = 1 }" });
//let ast = ASTParser.parse({ type: "code", value: "{ { 1, true, 'A'} }" });
// let ast = ASTParser.parse({ type: "code", value: "true, 1, 'A', \"X\"" });
//let ast = ASTParser.parse({ type: "code", value: "x = 1" });

let ast = _ASTParser.default.parse({
  type: "code",
  value: " 1, 2, true, false, 'A' "
});

console.info(JSON.stringify(ast, function replacer(key, value) {
  return value;
})); //let generator = new SourceGenerator();
//generator.visit(ast);
// Trick to prevent  
// All files must be modules when the '--isolatedModules' flag is provided.ts(1208)
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC50cyJdLCJuYW1lcyI6WyJjb25zb2xlIiwiaW5mbyIsImlucHV0MSIsImlucHV0MiIsImlucHV0MyIsImFzdCIsIkFTVFBhcnNlciIsInBhcnNlIiwidHlwZSIsInZhbHVlIiwiSlNPTiIsInN0cmluZ2lmeSIsInJlcGxhY2VyIiwia2V5Il0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7OztBQUdBQSxPQUFPLENBQUNDLElBQVIsQ0FBYSxhQUFiO0FBQ0EsSUFBSUMsTUFBTSxHQUFHLEdBQWI7QUFDQSxJQUFJQyxNQUFNLEdBQUcsK0RBQWI7QUFDQSxJQUFJQyxNQUFNLEdBQUcsZ0JBQWI7QUFFQTs7Ozs7OztBQU9BO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBOztBQUNBLElBQUlDLEdBQUcsR0FBR0MsbUJBQVVDLEtBQVYsQ0FBZ0I7QUFBRUMsRUFBQUEsSUFBSSxFQUFFLE1BQVI7QUFBZ0JDLEVBQUFBLEtBQUssRUFBRTtBQUF2QixDQUFoQixDQUFWOztBQUNBVCxPQUFPLENBQUNDLElBQVIsQ0FBYVMsSUFBSSxDQUFDQyxTQUFMLENBQWVOLEdBQWYsRUFBb0IsU0FBU08sUUFBVCxDQUFrQkMsR0FBbEIsRUFBdUJKLEtBQXZCLEVBQThCO0FBQUUsU0FBT0EsS0FBUDtBQUFhLENBQWpFLENBQWIsRSxDQUVBO0FBQ0E7QUFFQTtBQUNBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEFTVFBhcnNlciwgeyBQYXJzZXJUeXBlIH0gZnJvbSBcIi4vQVNUUGFyc2VyXCJcbmltcG9ydCBTb3VyY2VHZW5lcmF0b3IgZnJvbSBcIi4vU291cmNlR2VuZXJhdG9yXCI7XG5cbmNvbnNvbGUuaW5mbygnVHJhbnNwaWxsZXInKTtcbmxldCBpbnB1dDEgPSBcIjFcIlxubGV0IGlucHV0MiA9IFwidmFyIHggPSBmdW5jdGlvbih5LCB6KSB7IGNvbnNvbGUuaW5mbygndGhpcyBpcyBhIHN0cmluZycpIDsgfVwiXG5sZXQgaW5wdXQzID0gXCJ2YXIgeCA9ICAyICsgNFwiXG5cbi8qXG4gICAgICAgIHtcbiAgICAgICAgdHJ1ZSBcbiAgICAgICAgZmFsc2VcbiAgICAgICAgXCJ0cnVlXCJcbiAgICAgICAgfVxuICovXG4vL2xldCBhc3RwYXJzZXIgPSBBU1RQYXJzZXIucGFyc2UoeyB0eXBlOiBcImNvZGVcIiwgdmFsdWU6IFwic291cmNlXCIgfSwgUGFyc2VyVHlwZS5FQ01BU2NyaXB0KTtcbi8vIGxldCBhc3QgPSBBU1RQYXJzZXIucGFyc2UoeyB0eXBlOiBcImNvZGVcIiwgdmFsdWU6IFwieyB2YXIgeCA9IDE7ICAgdmFyIHggPSAyOyB9XCIgfSk7XG4vLyBsZXQgYXN0ID0gQVNUUGFyc2VyLnBhcnNlKHsgdHlwZTogXCJjb2RlXCIsIHZhbHVlOiBcInsgeyAxIH0gfVwiIH0pO1xuLy9sZXQgYXN0ID0gQVNUUGFyc2VyLnBhcnNlKHsgdHlwZTogXCJjb2RlXCIsIHZhbHVlOiBcInsgIHggPSAxIH1cIiB9KTtcblxuLy9sZXQgYXN0ID0gQVNUUGFyc2VyLnBhcnNlKHsgdHlwZTogXCJjb2RlXCIsIHZhbHVlOiBcInsgeyAxLCB0cnVlLCAnQSd9IH1cIiB9KTtcbi8vIGxldCBhc3QgPSBBU1RQYXJzZXIucGFyc2UoeyB0eXBlOiBcImNvZGVcIiwgdmFsdWU6IFwidHJ1ZSwgMSwgJ0EnLCBcXFwiWFxcXCJcIiB9KTtcbi8vbGV0IGFzdCA9IEFTVFBhcnNlci5wYXJzZSh7IHR5cGU6IFwiY29kZVwiLCB2YWx1ZTogXCJ4ID0gMVwiIH0pO1xubGV0IGFzdCA9IEFTVFBhcnNlci5wYXJzZSh7IHR5cGU6IFwiY29kZVwiLCB2YWx1ZTogXCIgMSwgMiwgdHJ1ZSwgZmFsc2UsICdBJyBcIn0pO1xuY29uc29sZS5pbmZvKEpTT04uc3RyaW5naWZ5KGFzdCwgZnVuY3Rpb24gcmVwbGFjZXIoa2V5LCB2YWx1ZSkgeyByZXR1cm4gdmFsdWV9KSlcblxuLy9sZXQgZ2VuZXJhdG9yID0gbmV3IFNvdXJjZUdlbmVyYXRvcigpO1xuLy9nZW5lcmF0b3IudmlzaXQoYXN0KTtcblxuLy8gVHJpY2sgdG8gcHJldmVudCAgXG4vLyBBbGwgZmlsZXMgbXVzdCBiZSBtb2R1bGVzIHdoZW4gdGhlICctLWlzb2xhdGVkTW9kdWxlcycgZmxhZyBpcyBwcm92aWRlZC50cygxMjA4KVxuZXhwb3J0IHsgfSAiXX0=