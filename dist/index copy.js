"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var antlr4 = _interopRequireWildcard(require("antlr4"));

var _ECMAScriptVisitor = require("./parser/ECMAScriptVisitor");

var _ECMAScriptParser = require("./parser/ECMAScriptParser");

var _ECMAScriptLexer = require("./parser/ECMAScriptLexer");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

// Grammar 
// https://github.com/antlr/grammars-v4/tree/master/javascript/javascript
console.info('Transpiller');
let input = "var x = function(y, z) {}";
let chars = new antlr4.InputStream(input);
let lexer = new _ECMAScriptLexer.ECMAScriptLexer(chars);
lexer.setStrictMode(false);
lexer.strictMode = false;
let tokens = new antlr4.CommonTokenStream(lexer);
let parser = new _ECMAScriptParser.ECMAScriptParser(tokens);
parser.buildParseTrees = true;
let tree = parser.program();

class PrintVisitor extends _ECMAScriptVisitor.ECMAScriptVisitor {
  visitVariableDeclaration(ctx) {
    console.info("variable declaration : " + ctx.getText());
    return this.visitChildren(ctx);
  }

  visitChildrenXX(ctx) {
    console.info("Context :" + ctx.getText());

    if (!ctx) {
      return;
    }

    if (ctx.children) {
      return ctx.children.map(child => {
        if (child.children && child.children.length != 0) {
          return child.accept(this);
        } else {
          return child.getText();
        }
      });
    }
  }

}

tree.accept(new PrintVisitor());
/* 
console.info(chars);
console.info(lexer);
console.info(tokens);
console.info(parser); */
// let tree = parser.program() 
// Trick to prevent 
// All files must be modules when the '--isolatedModules' flag is provided.ts(1208)