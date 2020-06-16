"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ASTParser = _interopRequireDefault(require("./ASTParser"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Grammar 
// https://github.com/antlr/grammars-v4/tree/master/javascript/javascript
// https://stackoverflow.com/questions/1786565/ebnf-for-ecmascript
console.info('Transpiller');
let input1 = "1";
let input2 = "var x = function(y, z) { console.info('this is a string') ; }";
let input3 = "var x =  2 + 4"; //let astparser = ASTParser.parse({ type: "code", value: "source" }, ParserType.ECMAScript);
// let ast = ASTParser.parse({ type: "code", value: "{ var x = 1;   var x = 2; }" });

let ast = _ASTParser.default.parse({
  type: "code",
  value: "{ { 1 } }"
});

console.info(JSON.stringify(ast, function replacer(key, value) {
  return value;
})); // Trick to prevent  
// All files must be modules when the '--isolatedModules' flag is provided.ts(1208)
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC50cyJdLCJuYW1lcyI6WyJjb25zb2xlIiwiaW5mbyIsImlucHV0MSIsImlucHV0MiIsImlucHV0MyIsImFzdCIsIkFTVFBhcnNlciIsInBhcnNlIiwidHlwZSIsInZhbHVlIiwiSlNPTiIsInN0cmluZ2lmeSIsInJlcGxhY2VyIiwia2V5Il0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7OztBQUNBO0FBQ0E7QUFDQTtBQUVBQSxPQUFPLENBQUNDLElBQVIsQ0FBYSxhQUFiO0FBQ0EsSUFBSUMsTUFBTSxHQUFHLEdBQWI7QUFDQSxJQUFJQyxNQUFNLEdBQUcsK0RBQWI7QUFDQSxJQUFJQyxNQUFNLEdBQUcsZ0JBQWIsQyxDQUVBO0FBQ0E7O0FBQ0EsSUFBSUMsR0FBRyxHQUFHQyxtQkFBVUMsS0FBVixDQUFnQjtBQUFFQyxFQUFBQSxJQUFJLEVBQUUsTUFBUjtBQUFnQkMsRUFBQUEsS0FBSyxFQUFFO0FBQXZCLENBQWhCLENBQVY7O0FBRUFULE9BQU8sQ0FBQ0MsSUFBUixDQUFhUyxJQUFJLENBQUNDLFNBQUwsQ0FBZU4sR0FBZixFQUFvQixTQUFTTyxRQUFULENBQWtCQyxHQUFsQixFQUF1QkosS0FBdkIsRUFBOEI7QUFBRSxTQUFPQSxLQUFQO0FBQWEsQ0FBakUsQ0FBYixFLENBRUE7QUFDQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBBU1RQYXJzZXIsIHsgUGFyc2VyVHlwZSB9IGZyb20gXCIuL0FTVFBhcnNlclwiXG4vLyBHcmFtbWFyIFxuLy8gaHR0cHM6Ly9naXRodWIuY29tL2FudGxyL2dyYW1tYXJzLXY0L3RyZWUvbWFzdGVyL2phdmFzY3JpcHQvamF2YXNjcmlwdFxuLy8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMTc4NjU2NS9lYm5mLWZvci1lY21hc2NyaXB0XG5cbmNvbnNvbGUuaW5mbygnVHJhbnNwaWxsZXInKTtcbmxldCBpbnB1dDEgPSBcIjFcIlxubGV0IGlucHV0MiA9IFwidmFyIHggPSBmdW5jdGlvbih5LCB6KSB7IGNvbnNvbGUuaW5mbygndGhpcyBpcyBhIHN0cmluZycpIDsgfVwiXG5sZXQgaW5wdXQzID0gXCJ2YXIgeCA9ICAyICsgNFwiXG5cbi8vbGV0IGFzdHBhcnNlciA9IEFTVFBhcnNlci5wYXJzZSh7IHR5cGU6IFwiY29kZVwiLCB2YWx1ZTogXCJzb3VyY2VcIiB9LCBQYXJzZXJUeXBlLkVDTUFTY3JpcHQpO1xuLy8gbGV0IGFzdCA9IEFTVFBhcnNlci5wYXJzZSh7IHR5cGU6IFwiY29kZVwiLCB2YWx1ZTogXCJ7IHZhciB4ID0gMTsgICB2YXIgeCA9IDI7IH1cIiB9KTtcbmxldCBhc3QgPSBBU1RQYXJzZXIucGFyc2UoeyB0eXBlOiBcImNvZGVcIiwgdmFsdWU6IFwieyB7IDEgfSB9XCIgfSk7XG5cbmNvbnNvbGUuaW5mbyhKU09OLnN0cmluZ2lmeShhc3QsIGZ1bmN0aW9uIHJlcGxhY2VyKGtleSwgdmFsdWUpIHsgcmV0dXJuIHZhbHVlfSkpXG5cbi8vIFRyaWNrIHRvIHByZXZlbnQgIFxuLy8gQWxsIGZpbGVzIG11c3QgYmUgbW9kdWxlcyB3aGVuIHRoZSAnLS1pc29sYXRlZE1vZHVsZXMnIGZsYWcgaXMgcHJvdmlkZWQudHMoMTIwOClcbmV4cG9ydCB7IH0gIl19