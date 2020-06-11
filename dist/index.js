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

// Grammar 
// https://github.com/antlr/grammars-v4/tree/master/javascript/javascript
console.info('Transpiller');
let input1 = "( 1 + 2 )";
let input2 = "var x = function(y, z) { console.info('this is a string');}";
let input3 = "var x =  2 + 4";
let chars = new antlr4.InputStream(input1);
let lexer = new _ECMAScriptLexer.ECMAScriptLexer(chars);
let tokens = new antlr4.CommonTokenStream(lexer);
let parser = new _ECMAScriptParser.ECMAScriptParser(tokens);
parser.buildParseTrees = true;
let tree = parser.program();
tree.accept(new _PrintVisitor.PrintVisitor()); // Trick to prevent  
// All files must be modules when the '--isolatedModules' flag is provided.ts(1208)