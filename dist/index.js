"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var antlr4 = _interopRequireWildcard(require("antlr4"));

var _ECMAScriptParser = require("./parser/ECMAScriptParser");

var _ECMAScriptLexer = require("./parser/ECMAScriptLexer");

var _PrintVisitor = require("./PrintVisitor");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

let fs = require('fs'); // Grammar 
// https://github.com/antlr/grammars-v4/tree/master/javascript/javascript
// https://stackoverflow.com/questions/1786565/ebnf-for-ecmascript


console.info('Transpiller');
let input1 = "( 1 + 2 )";
let input2 = "var x = function(y, z) { console.info('this is a string') ; }";
let input3 = "var x =  2 + 4";
let chars = new antlr4.InputStream(input1);
let lexer = new _ECMAScriptLexer.ECMAScriptLexer(chars);
let tokens = new antlr4.CommonTokenStream(lexer);
let parser = new _ECMAScriptParser.ECMAScriptParser(tokens);
parser.buildParseTrees = true;
let tree = parser.program(); // console.info(tree.toStringTree())

tree.accept(new _PrintVisitor.PrintVisitor()); // Trick to prevent  
// All files must be modules when the '--isolatedModules' flag is provided.ts(1208)
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC50cyJdLCJuYW1lcyI6WyJjb25zb2xlIiwiaW5mbyIsImlucHV0MSIsImlucHV0MiIsImlucHV0MyIsImNoYXJzIiwiYW50bHI0IiwiSW5wdXRTdHJlYW0iLCJsZXhlciIsIkRlbHZlbkxleGVyIiwidG9rZW5zIiwiQ29tbW9uVG9rZW5TdHJlYW0iLCJwYXJzZXIiLCJEZWx2ZW5QYXJzZXIiLCJidWlsZFBhcnNlVHJlZXMiLCJ0cmVlIiwicHJvZ3JhbSIsImFjY2VwdCIsIlByaW50VmlzaXRvciJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7O0FBRUE7O0FBQ0E7O0FBRUE7Ozs7OztBQUVBO0FBQ0E7QUFFQUEsT0FBTyxDQUFDQyxJQUFSLENBQWEsYUFBYjtBQUNBLElBQUlDLE1BQU0sR0FBRyxXQUFiO0FBQ0EsSUFBSUMsTUFBTSxHQUFHLCtEQUFiO0FBQ0EsSUFBSUMsTUFBTSxHQUFHLGdCQUFiO0FBRUEsSUFBSUMsS0FBSyxHQUFHLElBQUlDLE1BQU0sQ0FBQ0MsV0FBWCxDQUF1QkwsTUFBdkIsQ0FBWjtBQUNBLElBQUlNLEtBQUssR0FBRyxJQUFJQyxnQ0FBSixDQUFnQkosS0FBaEIsQ0FBWjtBQUNBLElBQUlLLE1BQU0sR0FBSSxJQUFJSixNQUFNLENBQUNLLGlCQUFYLENBQTZCSCxLQUE3QixDQUFkO0FBQ0EsSUFBSUksTUFBTSxHQUFHLElBQUlDLGtDQUFKLENBQWlCSCxNQUFqQixDQUFiO0FBQ0FFLE1BQU0sQ0FBQ0UsZUFBUCxHQUF5QixJQUF6QjtBQUNBLElBQUlDLElBQUksR0FBR0gsTUFBTSxDQUFDSSxPQUFQLEVBQVgsQyxDQUNBOztBQUNBRCxJQUFJLENBQUNFLE1BQUwsQ0FBWSxJQUFJQywwQkFBSixFQUFaLEUsQ0FFQTtBQUNBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgYW50bHI0ICBmcm9tIFwiYW50bHI0XCJcbmltcG9ydCB7RUNNQVNjcmlwdFZpc2l0b3IgYXMgRGVsdmVuVmlzaXRvcn0gZnJvbSBcIi4vcGFyc2VyL0VDTUFTY3JpcHRWaXNpdG9yXCJcbmltcG9ydCB7RUNNQVNjcmlwdFBhcnNlciBhcyAgRGVsdmVuUGFyc2VyfSBmcm9tIFwiLi9wYXJzZXIvRUNNQVNjcmlwdFBhcnNlclwiXG5pbXBvcnQge0VDTUFTY3JpcHRMZXhlciBhcyBEZWx2ZW5MZXhlcn0gZnJvbSBcIi4vcGFyc2VyL0VDTUFTY3JpcHRMZXhlclwiXG5pbXBvcnQgeyBSdWxlQ29udGV4dCB9IGZyb20gXCJhbnRscjQvUnVsZUNvbnRleHRcIlxuaW1wb3J0IHsgUHJpbnRWaXNpdG9yIH0gZnJvbSBcIi4vUHJpbnRWaXNpdG9yXCJcblxuLy8gR3JhbW1hciBcbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9hbnRsci9ncmFtbWFycy12NC90cmVlL21hc3Rlci9qYXZhc2NyaXB0L2phdmFzY3JpcHRcblxuY29uc29sZS5pbmZvKCdUcmFuc3BpbGxlcicpO1xubGV0IGlucHV0MSA9IFwiKCAxICsgMiApXCIgXG5sZXQgaW5wdXQyID0gXCJ2YXIgeCA9IGZ1bmN0aW9uKHksIHopIHsgY29uc29sZS5pbmZvKCd0aGlzIGlzIGEgc3RyaW5nJykgOyB9XCIgXG5sZXQgaW5wdXQzID0gXCJ2YXIgeCA9ICAyICsgNFwiIFxuXG5sZXQgY2hhcnMgPSBuZXcgYW50bHI0LklucHV0U3RyZWFtKGlucHV0MSk7XG5sZXQgbGV4ZXIgPSBuZXcgRGVsdmVuTGV4ZXIoY2hhcnMpO1xubGV0IHRva2VucyAgPSBuZXcgYW50bHI0LkNvbW1vblRva2VuU3RyZWFtKGxleGVyKTtcbmxldCBwYXJzZXIgPSBuZXcgRGVsdmVuUGFyc2VyKHRva2Vucyk7XG5wYXJzZXIuYnVpbGRQYXJzZVRyZWVzID0gdHJ1ZTtcbmxldCB0cmVlID0gcGFyc2VyLnByb2dyYW0oKTtcbi8vIGNvbnNvbGUuaW5mbyh0cmVlLnRvU3RyaW5nVHJlZSgpKVxudHJlZS5hY2NlcHQobmV3IFByaW50VmlzaXRvcigpKTtcblxuLy8gVHJpY2sgdG8gcHJldmVudCAgXG4vLyBBbGwgZmlsZXMgbXVzdCBiZSBtb2R1bGVzIHdoZW4gdGhlICctLWlzb2xhdGVkTW9kdWxlcycgZmxhZyBpcyBwcm92aWRlZC50cygxMjA4KVxuZXhwb3J0IHt9ICJdfQ==