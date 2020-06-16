"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DelvenASTVisitor = exports.default = exports.ParserType = void 0;

var antlr4 = _interopRequireWildcard(require("antlr4"));

var _ECMAScriptVisitor = require("./parser/ECMAScriptVisitor");

var _ECMAScriptParser = require("./parser/ECMAScriptParser");

var _ECMAScriptLexer = require("./parser/ECMAScriptLexer");

var _PrintVisitor = require("./PrintVisitor");

var _nodes = require("./nodes");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

let fs = require("fs");
/**
 * Version that we generate the AST for. 
 * This allows for testing different implementations
 * 
 * Currently only ECMAScript is supported
 * 
 * https://github.com/estree/estree
 */


let ParserType;
exports.ParserType = ParserType;

(function (ParserType) {
  ParserType[ParserType["ECMAScript"] = 0] = "ECMAScript";
})(ParserType || (exports.ParserType = ParserType = {}));

;

class ASTParser {
  constructor(visitor) {
    this.visitor = visitor || new DelvenASTVisitor();
  }

  generate(source) {
    let code;

    switch (source.type) {
      case "code":
        code = source.value;
        break;

      case "filename":
        code = fs.readFileSync(source.value, "utf8");
        break;
    }

    let chars = new antlr4.InputStream(code);
    let lexer = new _ECMAScriptLexer.ECMAScriptLexer(chars);
    let tokens = new antlr4.CommonTokenStream(lexer);
    let parser = new _ECMAScriptParser.ECMAScriptParser(tokens);
    let tree = parser.program(); // console.info(tree.toStringTree())

    tree.accept(new _PrintVisitor.PrintVisitor());
    console.info("---------------------");
    let result = tree.accept(this.visitor);
    return result;
  }
  /**
   * Parse source and genereate AST tree
   * @param source 
   * @param type 
   */


  static parse(source, type) {
    if (type == null) type = ParserType.ECMAScript;
    let parser;

    switch (type) {
      case ParserType.ECMAScript:
        parser = new ASTParserDefault();
        break;

      default:
        throw new Error("Unkown parser type");
    }

    return parser.generate(source);
  }

}

exports.default = ASTParser;

class ASTParserDefault extends ASTParser {}

function type(o) {
  return o && o.constructor && o.constructor.name;
}

class DelvenASTVisitor extends _ECMAScriptVisitor.ECMAScriptVisitor {
  constructor() {
    super();
  }

  asMarker(metadata) {
    return {
      index: 1,
      line: 1,
      column: 1
    };
  }

  decorate(node, marker) {
    node.start = 0;
    node.end = 0;
    return node;
  } // Visit a parse tree produced by ECMAScriptParser#program.


  visitProgram(ctx) {
    console.info("visitProgram: " + ctx.getText()); // Interval { start: 0, stop: 0 }

    let interval = ctx.getSourceInterval();
    console.info('interval : %s', JSON.stringify(interval)); // visitProgram ->visitSourceElements -> visitSourceElement -> visitStatement

    let statements = [];

    if (ctx.getChildCount() > 1) {
      // exclude <EOF>
      if (ctx.getChild(0).getChildCount() > 0) {
        let node = ctx.getChild(0).getChild(0).getChild(0);
        let statement = this.visitStatement(node);
        statements.push(statement);
      }
    }

    let metadata = {
      start: {
        line: 1,
        column: interval.start,
        offset: 0
      },
      end: {
        line: 1,
        column: interval.stop,
        offset: 0
      }
    };
    let script = new _nodes.Script(statements);
    return this.decorate(script, this.asMarker(metadata));
  }

  // Visit a parse tree produced by ECMAScriptParser#statement.
  visitStatement(ctx) {
    console.info("visitStatement [%s] : %s", ctx.getChildCount(), ctx.getText());

    if (ctx.getChildCount() != 1) {
      throw new Error("Wrong child count, expected 1 got : " + ctx.getChildCount());
    }

    let node = ctx.getChild(0);
    let type = node.ruleIndex;

    if (type == _ECMAScriptParser.ECMAScriptParser.RULE_block) {
      return this.visitBlock(node);
    } else if (type == _ECMAScriptParser.ECMAScriptParser.RULE_expressionStatement) {
      return this.visitExpressionStatement(node);
    } else {
      throw new Error("Unhandled type XX: " + type);
    }
  }

  // Visit a parse tree produced by ECMAScriptParser#block.
  visitBlock(ctx) {
    console.info("visitBlock: " + ctx.getText() + " == " + ctx);
    let body = [];

    for (let i = 0; i < ctx.getChildCount(); ++i) {
      let node = ctx.getChild(i);
      let type = node.ruleIndex;

      if (type == _ECMAScriptParser.ECMAScriptParser.RULE_statementList) {
        let statementList = this.visitStatementList(node);

        for (let index in statementList) {
          body.push(statementList[index]);
        }
      } else if (type == _ECMAScriptParser.ECMAScriptParser.RULE_expressionStatement) {
        let expression = this.visitExpressionStatement(node);
        body.push(expression);
      } else if (type == undefined) {
        continue;
      } else {
        throw new Error("Unhandled type : " + type);
      }
    } // TODO : Implement me


    return new _nodes.BlockStatement(body);
  }

  // Visit a parse tree produced by ECMAScriptParser#statementList.
  visitStatementList(ctx) {
    console.info("visitStatementList: " + ctx.getText());
    let body = [];

    for (let i = 0; i < ctx.getChildCount(); ++i) {
      let node = ctx.getChild(i);
      let type = node.ruleIndex;

      if (type == _ECMAScriptParser.ECMAScriptParser.RULE_statement) {
        let statement = this.visitStatement(node);
        body.push(statement);
      } else if (type == undefined) {
        continue;
      } else {
        throw new Error("Unhandled type : " + type);
      }
    }

    return body;
  }

  // Visit a parse tree produced by ECMAScriptParser#variableStatement.
  visitVariableStatement(ctx) {
    console.info("visitVariableStatement: " + ctx.getText());
    this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#variableDeclarationList.
  visitVariableDeclarationList(ctx) {
    console.info("visitVariableDeclarationList: " + ctx.getText());
  }

  // Visit a parse tree produced by ECMAScriptParser#variableDeclaration.
  visitVariableDeclaration(ctx) {
    console.info("visitVariableDeclaration: " + ctx.getText());
  }

  // Visit a parse tree produced by ECMAScriptParser#initialiser.
  visitInitialiser(ctx) {
    console.info("visitInitialiser: " + ctx.getText());
  }

  // Visit a parse tree produced by ECMAScriptParser#emptyStatement.
  visitEmptyStatement(ctx) {
    console.info("visitEmptyStatementXX: " + ctx.getText());
  }

  // Visit a parse tree produced by ECMAScriptParser#expressionStatement.
  visitExpressionStatement(ctx) {
    console.info("visitExpressionStatement: " + ctx.getText());

    if (ctx.getChildCount() != 1) {
      throw new Error("Wrong child count, expected 1 got : " + ctx.getChildCount());
    } // visitExpressionStatement:>visitExpressionSequence:>visitLiteralExpression


    let node = ctx.getChild(0); // visitExpressionSequence 

    let expression = node.getChild(0);
    let expressionId = expression.ruleIndex;
    let literal;

    if (expressionId == _ECMAScriptParser.ECMAScriptParser.RULE_singleExpression) {
      literal = this.visitLiteralExpression(expression);
    } else {
      throw new Error("Unhandled type : " + type);
    }

    let interval = expression.getSourceInterval();
    let statement = new _nodes.ExpressionStatement(literal);
    const metadata = {
      start: {
        line: 1,
        column: interval.start,
        offset: 0
      },
      end: {
        line: 1,
        column: interval.stop,
        offset: 3
      }
    };
    return this.decorate(statement, this.asMarker(metadata));
  }

  // Visit a parse tree produced by ECMAScriptParser#ifStatement.
  visitIfStatement(ctx) {
    console.info("visitIfStatement: " + ctx.getText());
    this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#DoStatement.
  visitDoStatement(ctx) {
    console.info("visitDoStatement: " + ctx.getText());
    this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#WhileStatement.
  visitWhileStatement(ctx) {
    console.info("visitWhileStatement: " + ctx.getText());
    this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#ForStatement.
  visitForStatement(ctx) {
    console.info("visitWhileStatement: " + ctx.getText());
    this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#ForVarStatement.
  visitForVarStatement(ctx) {
    console.trace('not implemented');
    this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#ForInStatement.
  visitForInStatement(ctx) {
    console.trace('not implemented');
    this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#ForVarInStatement.
  visitForVarInStatement(ctx) {
    console.trace('not implemented');
    this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#continueStatement.
  visitContinueStatement(ctx) {
    console.trace('not implemented');
    this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#breakStatement.
  visitBreakStatement(ctx) {
    console.trace('not implemented');
    this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#returnStatement.
  visitReturnStatement(ctx) {
    console.trace('not implemented');
    this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#withStatement.
  visitWithStatement(ctx) {
    console.trace('not implemented');
    this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#switchStatement.
  visitSwitchStatement(ctx) {
    console.trace('not implemented');
    this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#caseBlock.
  visitCaseBlock(ctx) {
    console.trace('not implemented');
    this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#caseClauses.
  visitCaseClauses(ctx) {
    console.trace('not implemented');
    this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#caseClause.
  visitCaseClause(ctx) {
    console.trace('not implemented');
    this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#defaultClause.
  visitDefaultClause(ctx) {
    console.trace('not implemented');
    this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#labelledStatement.
  visitLabelledStatement(ctx) {
    console.trace('not implemented');
    this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#throwStatement.
  visitThrowStatement(ctx) {
    console.trace('not implemented');
    this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#tryStatement.
  visitTryStatement(ctx) {
    console.trace('not implemented');
    this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#catchProduction.
  visitCatchProduction(ctx) {
    console.trace('not implemented');
    this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#finallyProduction.
  visitFinallyProduction(ctx) {
    console.trace('not implemented');
    this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#debuggerStatement.
  visitDebuggerStatement(ctx) {
    console.trace('not implemented');
    this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#functionDeclaration.
  visitFunctionDeclaration(ctx) {
    console.trace('not implemented');
    this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#formalParameterList.
  visitFormalParameterList(ctx) {
    console.trace('not implemented');
    this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#functionBody.
  visitFunctionBody(ctx) {
    console.info("visitFunctionBody: " + ctx.getText());
    this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#arrayLiteral.
  visitArrayLiteral(ctx) {
    console.trace('not implemented');
    this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#elementList.
  visitElementList(ctx) {
    console.trace('not implemented');
    this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#elision.
  visitElision(ctx) {
    console.trace('not implemented');
    this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#objectLiteral.
  visitObjectLiteral(ctx) {
    console.trace('not implemented');
    this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#propertyNameAndValueList.
  visitPropertyNameAndValueList(ctx) {
    console.trace('not implemented');
    this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#PropertyExpressionAssignment.
  visitPropertyExpressionAssignment(ctx) {
    console.trace('not implemented');
    this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#PropertyGetter.
  visitPropertyGetter(ctx) {
    console.trace('not implemented');
    this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#PropertySetter.
  visitPropertySetter(ctx) {
    console.trace('not implemented');
    this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#propertyName.
  visitPropertyName(ctx) {
    console.trace('not implemented');
    this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#propertySetParameterList.
  visitPropertySetParameterList(ctx) {
    console.trace('not implemented');
    this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#arguments.
  visitArguments(ctx) {
    console.info("visitArguments: " + ctx.getText());
    this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#argumentList.
  visitArgumentList(ctx) {
    console.info("visitArgumentList: " + ctx.getText());
    this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#expressionSequence.
  visitExpressionSequence(ctx) {
    console.info("visitExpressionSequence: " + ctx.getText());
    this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#TernaryExpression.
  visitTernaryExpression(ctx) {
    console.trace('not implemented');
    this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#LogicalAndExpression.
  visitLogicalAndExpression(ctx) {
    console.trace('not implemented');
    this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#PreIncrementExpression.
  visitPreIncrementExpression(ctx) {
    console.trace('not implemented');
    this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#ObjectLiteralExpression.
  visitObjectLiteralExpression(ctx) {
    console.trace('not implemented');
    this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#InExpression.
  visitInExpression(ctx) {
    console.trace('not implemented');
    this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#LogicalOrExpression.
  visitLogicalOrExpression(ctx) {
    console.trace('not implemented');
    this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#NotExpression.
  visitNotExpression(ctx) {
    console.trace('not implemented');
    this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#PreDecreaseExpression.
  visitPreDecreaseExpression(ctx) {
    console.trace('not implemented');
    this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#ArgumentsExpression.
  visitArgumentsExpression(ctx) {
    console.info("visitArgumentsExpression: " + ctx.getText());
    this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#ThisExpression.
  visitThisExpression(ctx) {
    console.trace('not implemented');
    this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#FunctionExpression.
  visitFunctionExpression(ctx) {
    console.trace('not implemented');
    this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#UnaryMinusExpression.
  visitUnaryMinusExpression(ctx) {
    console.trace('not implemented');
    this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#PostDecreaseExpression.
  visitPostDecreaseExpression(ctx) {
    console.trace('not implemented');
    this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#AssignmentExpression.
  visitAssignmentExpression(ctx) {
    console.trace('not implemented');
    this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#TypeofExpression.
  visitTypeofExpression(ctx) {
    console.trace('not implemented');
    this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#InstanceofExpression.
  visitInstanceofExpression(ctx) {
    console.trace('not implemented');
    this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#UnaryPlusExpression.
  visitUnaryPlusExpression(ctx) {
    console.trace('not implemented');
    this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#DeleteExpression.
  visitDeleteExpression(ctx) {
    console.trace('not implemented');
    this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#EqualityExpression.
  visitEqualityExpression(ctx) {
    console.trace('not implemented');
    this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#BitXOrExpression.
  visitBitXOrExpression(ctx) {
    console.trace('not implemented');
    this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#MultiplicativeExpression.
  visitMultiplicativeExpression(ctx) {
    console.trace('not implemented');
    this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#BitShiftExpression.
  visitBitShiftExpression(ctx) {
    console.trace('not implemented');
    this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#ParenthesizedExpression.
  visitParenthesizedExpression(ctx) {
    console.info("visitParenthesizedExpression: " + ctx.getText());
    this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#AdditiveExpression.
  visitAdditiveExpression(ctx) {
    console.info("visitAdditiveExpression: " + ctx.getText());
    this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#RelationalExpression.
  visitRelationalExpression(ctx) {
    console.trace('not implemented');
    this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#PostIncrementExpression.
  visitPostIncrementExpression(ctx) {
    console.trace('not implemented');
    this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#BitNotExpression.
  visitBitNotExpression(ctx) {
    console.trace('not implemented');
    this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#NewExpression.
  visitNewExpression(ctx) {
    console.trace('not implemented');
    this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#LiteralExpression.
  visitLiteralExpression(ctx) {
    console.info("visitLiteralExpression: " + ctx.getText());

    if (ctx.getChildCount() != 1) {
      throw new Error("Wrong child count, expected 1 got : " + ctx.getChildCount());
    } // visitLiteralExpression: > visitLiteral:  visitNumericLiteral:


    let node = ctx.getChild(0);
    let expression = node.getChild(0);
    let expressionId = expression.ruleIndex;

    if (expressionId == _ECMAScriptParser.ECMAScriptParser.RULE_numericLiteral) {
      return this.visitNumericLiteral(ctx);
    } else {
      throw new Error("Unhandled type : " + type);
    }
  }

  // Visit a parse tree produced by ECMAScriptParser#ArrayLiteralExpression.
  visitArrayLiteralExpression(ctx) {
    console.trace('not implemented');
    this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#MemberDotExpression.
  visitMemberDotExpression(ctx) {
    console.info("visitMemberDotExpression: " + ctx.getText());
    this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#MemberIndexExpression.
  visitMemberIndexExpression(ctx) {
    console.trace('not implemented');
    this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#IdentifierExpression.
  visitIdentifierExpression(ctx) {
    console.info("visitIdentifierExpression: " + ctx.getText());
    this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#BitAndExpression.
  visitBitAndExpression(ctx) {
    console.trace('not implemented');
    this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#BitOrExpression.
  visitBitOrExpression(ctx) {
    console.trace('not implemented');
    this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#AssignmentOperatorExpression.
  visitAssignmentOperatorExpression(ctx) {
    console.trace('not implemented');
    this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#VoidExpression.
  visitVoidExpression(ctx) {
    console.trace('not implemented');
    this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#assignmentOperator.
  visitAssignmentOperator(ctx) {
    console.info("visitAssignmentOperator: " + ctx.getText());
    this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#literal.
  visitLiteral(ctx) {
    console.info("visitLiteral: " + ctx.getText());
    this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#numericLiteral.
  visitNumericLiteral(ctx) {
    console.info("visitNumericLiteral: " + ctx.getText());
    let value = ctx.getText();
    let expression = new _nodes.Literal("number", value);
    return expression;
    '';
  }

  // Visit a parse tree produced by ECMAScriptParser#identifierName.
  visitIdentifierName(ctx) {
    console.info("visitIdentifierName: " + ctx.getText());
    this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#reservedWord.
  visitReservedWord(ctx) {
    console.info("visitReservedWord: " + ctx.getText());
    this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#keyword.
  visitKeyword(ctx) {
    console.info("visitKeyword: " + ctx.getText());
    this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#futureReservedWord.
  visitFutureReservedWord(ctx) {
    console.trace('not implemented');
    this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#getter.
  visitGetter(ctx) {
    console.trace('not implemented');
    this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#setter.
  visitSetter(ctx) {
    console.trace('not implemented');
    this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#eos.
  visitEos(ctx) {
    //console.trace('not implemented')
    this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#eof.
  visitEof(ctx) {
    console.trace('not implemented');
    this.visitChildren(ctx);
  }

}

exports.DelvenASTVisitor = DelvenASTVisitor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9BU1RQYXJzZXIudHMiXSwibmFtZXMiOlsiZnMiLCJyZXF1aXJlIiwiUGFyc2VyVHlwZSIsIkFTVFBhcnNlciIsImNvbnN0cnVjdG9yIiwidmlzaXRvciIsIkRlbHZlbkFTVFZpc2l0b3IiLCJnZW5lcmF0ZSIsInNvdXJjZSIsImNvZGUiLCJ0eXBlIiwidmFsdWUiLCJyZWFkRmlsZVN5bmMiLCJjaGFycyIsImFudGxyNCIsIklucHV0U3RyZWFtIiwibGV4ZXIiLCJEZWx2ZW5MZXhlciIsInRva2VucyIsIkNvbW1vblRva2VuU3RyZWFtIiwicGFyc2VyIiwiRGVsdmVuUGFyc2VyIiwidHJlZSIsInByb2dyYW0iLCJhY2NlcHQiLCJQcmludFZpc2l0b3IiLCJjb25zb2xlIiwiaW5mbyIsInJlc3VsdCIsInBhcnNlIiwiRUNNQVNjcmlwdCIsIkFTVFBhcnNlckRlZmF1bHQiLCJFcnJvciIsIm8iLCJuYW1lIiwiRGVsdmVuVmlzaXRvciIsImFzTWFya2VyIiwibWV0YWRhdGEiLCJpbmRleCIsImxpbmUiLCJjb2x1bW4iLCJkZWNvcmF0ZSIsIm5vZGUiLCJtYXJrZXIiLCJzdGFydCIsImVuZCIsInZpc2l0UHJvZ3JhbSIsImN0eCIsImdldFRleHQiLCJpbnRlcnZhbCIsImdldFNvdXJjZUludGVydmFsIiwiSlNPTiIsInN0cmluZ2lmeSIsInN0YXRlbWVudHMiLCJnZXRDaGlsZENvdW50IiwiZ2V0Q2hpbGQiLCJzdGF0ZW1lbnQiLCJ2aXNpdFN0YXRlbWVudCIsInB1c2giLCJvZmZzZXQiLCJzdG9wIiwic2NyaXB0IiwiU2NyaXB0IiwicnVsZUluZGV4IiwiRUNNQVNjcmlwdFBhcnNlciIsIlJVTEVfYmxvY2siLCJ2aXNpdEJsb2NrIiwiUlVMRV9leHByZXNzaW9uU3RhdGVtZW50IiwidmlzaXRFeHByZXNzaW9uU3RhdGVtZW50IiwiYm9keSIsImkiLCJSVUxFX3N0YXRlbWVudExpc3QiLCJzdGF0ZW1lbnRMaXN0IiwidmlzaXRTdGF0ZW1lbnRMaXN0IiwiZXhwcmVzc2lvbiIsInVuZGVmaW5lZCIsIkJsb2NrU3RhdGVtZW50IiwiUlVMRV9zdGF0ZW1lbnQiLCJ2aXNpdFZhcmlhYmxlU3RhdGVtZW50IiwidmlzaXRDaGlsZHJlbiIsInZpc2l0VmFyaWFibGVEZWNsYXJhdGlvbkxpc3QiLCJ2aXNpdFZhcmlhYmxlRGVjbGFyYXRpb24iLCJ2aXNpdEluaXRpYWxpc2VyIiwidmlzaXRFbXB0eVN0YXRlbWVudCIsImV4cHJlc3Npb25JZCIsImxpdGVyYWwiLCJSVUxFX3NpbmdsZUV4cHJlc3Npb24iLCJ2aXNpdExpdGVyYWxFeHByZXNzaW9uIiwiRXhwcmVzc2lvblN0YXRlbWVudCIsInZpc2l0SWZTdGF0ZW1lbnQiLCJ2aXNpdERvU3RhdGVtZW50IiwidmlzaXRXaGlsZVN0YXRlbWVudCIsInZpc2l0Rm9yU3RhdGVtZW50IiwidmlzaXRGb3JWYXJTdGF0ZW1lbnQiLCJ0cmFjZSIsInZpc2l0Rm9ySW5TdGF0ZW1lbnQiLCJ2aXNpdEZvclZhckluU3RhdGVtZW50IiwidmlzaXRDb250aW51ZVN0YXRlbWVudCIsInZpc2l0QnJlYWtTdGF0ZW1lbnQiLCJ2aXNpdFJldHVyblN0YXRlbWVudCIsInZpc2l0V2l0aFN0YXRlbWVudCIsInZpc2l0U3dpdGNoU3RhdGVtZW50IiwidmlzaXRDYXNlQmxvY2siLCJ2aXNpdENhc2VDbGF1c2VzIiwidmlzaXRDYXNlQ2xhdXNlIiwidmlzaXREZWZhdWx0Q2xhdXNlIiwidmlzaXRMYWJlbGxlZFN0YXRlbWVudCIsInZpc2l0VGhyb3dTdGF0ZW1lbnQiLCJ2aXNpdFRyeVN0YXRlbWVudCIsInZpc2l0Q2F0Y2hQcm9kdWN0aW9uIiwidmlzaXRGaW5hbGx5UHJvZHVjdGlvbiIsInZpc2l0RGVidWdnZXJTdGF0ZW1lbnQiLCJ2aXNpdEZ1bmN0aW9uRGVjbGFyYXRpb24iLCJ2aXNpdEZvcm1hbFBhcmFtZXRlckxpc3QiLCJ2aXNpdEZ1bmN0aW9uQm9keSIsInZpc2l0QXJyYXlMaXRlcmFsIiwidmlzaXRFbGVtZW50TGlzdCIsInZpc2l0RWxpc2lvbiIsInZpc2l0T2JqZWN0TGl0ZXJhbCIsInZpc2l0UHJvcGVydHlOYW1lQW5kVmFsdWVMaXN0IiwidmlzaXRQcm9wZXJ0eUV4cHJlc3Npb25Bc3NpZ25tZW50IiwidmlzaXRQcm9wZXJ0eUdldHRlciIsInZpc2l0UHJvcGVydHlTZXR0ZXIiLCJ2aXNpdFByb3BlcnR5TmFtZSIsInZpc2l0UHJvcGVydHlTZXRQYXJhbWV0ZXJMaXN0IiwidmlzaXRBcmd1bWVudHMiLCJ2aXNpdEFyZ3VtZW50TGlzdCIsInZpc2l0RXhwcmVzc2lvblNlcXVlbmNlIiwidmlzaXRUZXJuYXJ5RXhwcmVzc2lvbiIsInZpc2l0TG9naWNhbEFuZEV4cHJlc3Npb24iLCJ2aXNpdFByZUluY3JlbWVudEV4cHJlc3Npb24iLCJ2aXNpdE9iamVjdExpdGVyYWxFeHByZXNzaW9uIiwidmlzaXRJbkV4cHJlc3Npb24iLCJ2aXNpdExvZ2ljYWxPckV4cHJlc3Npb24iLCJ2aXNpdE5vdEV4cHJlc3Npb24iLCJ2aXNpdFByZURlY3JlYXNlRXhwcmVzc2lvbiIsInZpc2l0QXJndW1lbnRzRXhwcmVzc2lvbiIsInZpc2l0VGhpc0V4cHJlc3Npb24iLCJ2aXNpdEZ1bmN0aW9uRXhwcmVzc2lvbiIsInZpc2l0VW5hcnlNaW51c0V4cHJlc3Npb24iLCJ2aXNpdFBvc3REZWNyZWFzZUV4cHJlc3Npb24iLCJ2aXNpdEFzc2lnbm1lbnRFeHByZXNzaW9uIiwidmlzaXRUeXBlb2ZFeHByZXNzaW9uIiwidmlzaXRJbnN0YW5jZW9mRXhwcmVzc2lvbiIsInZpc2l0VW5hcnlQbHVzRXhwcmVzc2lvbiIsInZpc2l0RGVsZXRlRXhwcmVzc2lvbiIsInZpc2l0RXF1YWxpdHlFeHByZXNzaW9uIiwidmlzaXRCaXRYT3JFeHByZXNzaW9uIiwidmlzaXRNdWx0aXBsaWNhdGl2ZUV4cHJlc3Npb24iLCJ2aXNpdEJpdFNoaWZ0RXhwcmVzc2lvbiIsInZpc2l0UGFyZW50aGVzaXplZEV4cHJlc3Npb24iLCJ2aXNpdEFkZGl0aXZlRXhwcmVzc2lvbiIsInZpc2l0UmVsYXRpb25hbEV4cHJlc3Npb24iLCJ2aXNpdFBvc3RJbmNyZW1lbnRFeHByZXNzaW9uIiwidmlzaXRCaXROb3RFeHByZXNzaW9uIiwidmlzaXROZXdFeHByZXNzaW9uIiwiUlVMRV9udW1lcmljTGl0ZXJhbCIsInZpc2l0TnVtZXJpY0xpdGVyYWwiLCJ2aXNpdEFycmF5TGl0ZXJhbEV4cHJlc3Npb24iLCJ2aXNpdE1lbWJlckRvdEV4cHJlc3Npb24iLCJ2aXNpdE1lbWJlckluZGV4RXhwcmVzc2lvbiIsInZpc2l0SWRlbnRpZmllckV4cHJlc3Npb24iLCJ2aXNpdEJpdEFuZEV4cHJlc3Npb24iLCJ2aXNpdEJpdE9yRXhwcmVzc2lvbiIsInZpc2l0QXNzaWdubWVudE9wZXJhdG9yRXhwcmVzc2lvbiIsInZpc2l0Vm9pZEV4cHJlc3Npb24iLCJ2aXNpdEFzc2lnbm1lbnRPcGVyYXRvciIsInZpc2l0TGl0ZXJhbCIsIkxpdGVyYWwiLCJ2aXNpdElkZW50aWZpZXJOYW1lIiwidmlzaXRSZXNlcnZlZFdvcmQiLCJ2aXNpdEtleXdvcmQiLCJ2aXNpdEZ1dHVyZVJlc2VydmVkV29yZCIsInZpc2l0R2V0dGVyIiwidmlzaXRTZXR0ZXIiLCJ2aXNpdEVvcyIsInZpc2l0RW9mIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBRUE7O0FBR0E7Ozs7OztBQUVBLElBQUlBLEVBQUUsR0FBR0MsT0FBTyxDQUFDLElBQUQsQ0FBaEI7QUFFQTs7Ozs7Ozs7OztJQVFZQyxVOzs7V0FBQUEsVTtBQUFBQSxFQUFBQSxVLENBQUFBLFU7R0FBQUEsVSwwQkFBQUEsVTs7QUFVWDs7QUFFYyxNQUFlQyxTQUFmLENBQXlCO0FBRXBDQyxFQUFBQSxXQUFXLENBQUNDLE9BQUQsRUFBNkI7QUFDcEMsU0FBS0EsT0FBTCxHQUFlQSxPQUFPLElBQUksSUFBSUMsZ0JBQUosRUFBMUI7QUFDSDs7QUFFREMsRUFBQUEsUUFBUSxDQUFDQyxNQUFELEVBQThCO0FBQ2xDLFFBQUlDLElBQUo7O0FB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QzdILEdBQUQsRUFBbUI7QUFDdENyQixJQUFBQSxPQUFPLENBQUNvRSxLQUFSLENBQWMsaUJBQWQ7QUFDQSxTQUFLZixhQUFMLENBQW1CaEMsR0FBbkI7QUFDSDs7QUFHRDtBQUNBOEgsRUFBQUEsV0FBVyxDQUFDOUgsR0FBRCxFQUFtQjtBQUMxQnJCLElBQUFBLE9BQU8sQ0FBQ29FLEtBQVIsQ0FBYyxpQkFBZDtBQUNBLFNBQUtmLGFBQUwsQ0FBbUJoQyxHQUFuQjtBQUNIOztBQUdEO0FBQ0ErSCxFQUFBQSxXQUFXLENBQUMvSCxHQUFELEVBQW1CO0FBQzFCckIsSUFBQUEsT0FBTyxDQUFDb0UsS0FBUixDQUFjLGlCQUFkO0FBQ0EsU0FBS2YsYUFBTCxDQUFtQmhDLEdBQW5CO0FBQ0g7O0FBRUQ7QUFDQWdJLEVBQUFBLFFBQVEsQ0FBQ2hJLEdBQUQsRUFBbUI7QUFDdkI7QUFDQSxTQUFLZ0MsYUFBTCxDQUFtQmhDLEdBQW5CO0FBQ0g7O0FBRUQ7QUFDQWlJLEVBQUFBLFFBQVEsQ0FBQ2pJLEdBQUQsRUFBbUI7QUFDdkJyQixJQUFBQSxPQUFPLENBQUNvRSxLQUFSLENBQWMsaUJBQWQ7QUFDQSxTQUFLZixhQUFMLENBQW1CaEMsR0FBbkI7QUFDSDs7QUFueUIrQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGFudGxyNCBmcm9tIFwiYW50bHI0XCJcbmltcG9ydCB7IEVDTUFTY3JpcHRWaXNpdG9yIGFzIERlbHZlblZpc2l0b3IgfSBmcm9tIFwiLi9wYXJzZXIvRUNNQVNjcmlwdFZpc2l0b3JcIlxuaW1wb3J0IHsgRUNNQVNjcmlwdFBhcnNlciBhcyBEZWx2ZW5QYXJzZXIsIEVDTUFTY3JpcHRQYXJzZXIgfSBmcm9tIFwiLi9wYXJzZXIvRUNNQVNjcmlwdFBhcnNlclwiXG5pbXBvcnQgeyBFQ01BU2NyaXB0TGV4ZXIgYXMgRGVsdmVuTGV4ZXIgfSBmcm9tIFwiLi9wYXJzZXIvRUNNQVNjcmlwdExleGVyXCJcbmltcG9ydCB7IFJ1bGVDb250ZXh0IH0gZnJvbSBcImFudGxyNC9SdWxlQ29udGV4dFwiXG5pbXBvcnQgeyBQcmludFZpc2l0b3IgfSBmcm9tIFwiLi9QcmludFZpc2l0b3JcIlxuXG5pbXBvcnQgQVNUTm9kZSBmcm9tIFwiLi9BU1ROb2RlXCI7XG5pbXBvcnQgeyBFeHByZXNzaW9uU3RhdGVtZW50LCBMaXRlcmFsLCBTY3JpcHQsIEJsb2NrU3RhdGVtZW50LCBTdGF0ZW1lbnQgfSBmcm9tIFwiLi9ub2Rlc1wiO1xuaW1wb3J0IHsgU3ludGF4IH0gZnJvbSBcIi4vc3ludGF4XCI7XG5sZXQgZnMgPSByZXF1aXJlKFwiZnNcIik7XG5cbi8qKlxuICogVmVyc2lvbiB0aGF0IHdlIGdlbmVyYXRlIHRoZSBBU1QgZm9yLiBcbiAqIFRoaXMgYWxsb3dzIGZvciB0ZXN0aW5nIGRpZmZlcmVudCBpbXBsZW1lbnRhdGlvbnNcbiAqIFxuICogQ3VycmVudGx5IG9ubHkgRUNNQVNjcmlwdCBpcyBzdXBwb3J0ZWRcbiAqIFxuICogaHR0cHM6Ly9naXRodWIuY29tL2VzdHJlZS9lc3RyZWVcbiAqL1xuZXhwb3J0IGVudW0gUGFyc2VyVHlwZSB7IEVDTUFTY3JpcHQgfVxuZXhwb3J0IHR5cGUgU291cmNlVHlwZSA9IFwiY29kZVwiIHwgXCJmaWxlbmFtZVwiO1xuZXhwb3J0IHR5cGUgU291cmNlQ29kZSA9IHtcbiAgICB0eXBlOiBTb3VyY2VUeXBlLFxuICAgIHZhbHVlOiBzdHJpbmdcbn1cbmV4cG9ydCBpbnRlcmZhY2UgTWFya2VyIHtcbiAgICBpbmRleDogbnVtYmVyO1xuICAgIGxpbmU6IG51bWJlcjtcbiAgICBjb2x1bW46IG51bWJlcjtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGFic3RyYWN0IGNsYXNzIEFTVFBhcnNlciB7XG4gICAgcHJpdmF0ZSB2aXNpdG9yOiAodHlwZW9mIERlbHZlblZpc2l0b3IgfCBudWxsKVxuICAgIGNvbnN0cnVjdG9yKHZpc2l0b3I/OiBEZWx2ZW5BU1RWaXNpdG9yKSB7XG4gICAgICAgIHRoaXMudmlzaXRvciA9IHZpc2l0b3IgfHwgbmV3IERlbHZlbkFTVFZpc2l0b3IoKTtcbiAgICB9XG5cbiAgICBnZW5lcmF0ZShzb3VyY2U6IFNvdXJjZUNvZGUpOiBBU1ROb2RlIHtcbiAgICAgICAgbGV0IGNvZGU7XG4gICAgICAgIHN3aXRjaCAoc291cmNlLnR5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgXCJjb2RlXCI6XG4gICAgICAgICAgICAgICAgY29kZSA9IHNvdXJjZS52YWx1ZTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJmaWxlbmFtZVwiOlxuICAgICAgICAgICAgICAgIGNvZGUgPSBmcy5yZWFkRmlsZVN5bmMoc291cmNlLnZhbHVlLCBcInV0ZjhcIik7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgY2hhcnMgPSBuZXcgYW50bHI0LklucHV0U3RyZWFtKGNvZGUpO1xuICAgICAgICBsZXQgbGV4ZXIgPSBuZXcgRGVsdmVuTGV4ZXIoY2hhcnMpO1xuICAgICAgICBsZXQgdG9rZW5zID0gbmV3IGFudGxyNC5Db21tb25Ub2tlblN0cmVhbShsZXhlcik7XG4gICAgICAgIGxldCBwYXJzZXIgPSBuZXcgRGVsdmVuUGFyc2VyKHRva2Vucyk7XG4gICAgICAgIGxldCB0cmVlID0gcGFyc2VyLnByb2dyYW0oKTtcbiAgICAgICAgLy8gY29uc29sZS5pbmZvKHRyZWUudG9TdHJpbmdUcmVlKCkpXG4gICAgICAgIHRyZWUuYWNjZXB0KG5ldyBQcmludFZpc2l0b3IoKSk7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcIi0tLS0tLS0tLS0tLS0tLS0tLS0tLVwiKTtcbiAgICAgICAgbGV0IHJlc3VsdCA9IHRyZWUuYWNjZXB0KHRoaXMudmlzaXRvcik7XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUGFyc2Ugc291cmNlIGFuZCBnZW5lcmVhdGUgQVNUIHRyZWVcbiAgICAgKiBAcGFyYW0gc291cmNlIFxuICAgICAqIEBwYXJhbSB0eXBlIFxuICAgICAqL1xuICAgIHN0YXRpYyBwYXJzZShzb3VyY2U6IFNvdXJjZUNvZGUsIHR5cGU/OiBQYXJzZXJUeXBlKTogQVNUTm9kZSB7XG4gICAgICAgIGlmICh0eXBlID09IG51bGwpXG4gICAgICAgICAgICB0eXBlID0gUGFyc2VyVHlwZS5FQ01BU2NyaXB0O1xuICAgICAgICBsZXQgcGFyc2VyO1xuICAgICAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgUGFyc2VyVHlwZS5FQ01BU2NyaXB0OlxuICAgICAgICAgICAgICAgIHBhcnNlciA9IG5ldyBBU1RQYXJzZXJEZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlVua293biBwYXJzZXIgdHlwZVwiKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcGFyc2VyLmdlbmVyYXRlKHNvdXJjZSlcbiAgICB9XG59XG5cbmNsYXNzIEFTVFBhcnNlckRlZmF1bHQgZXh0ZW5kcyBBU1RQYXJzZXIge1xuXG59XG5mdW5jdGlvbiB0eXBlKG8pIHtcbiAgICByZXR1cm4gbyAmJiBvLmNvbnN0cnVjdG9yICYmIG8uY29uc3RydWN0b3IubmFtZVxufVxuXG5leHBvcnQgY2xhc3MgRGVsdmVuQVNUVmlzaXRvciBleHRlbmRzIERlbHZlblZpc2l0b3Ige1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpO1xuICAgIH1cblxuICAgIHByaXZhdGUgYXNNYXJrZXIobWV0YWRhdGE6IGFueSkge1xuICAgICAgICByZXR1cm4geyBpbmRleDogMSwgbGluZTogMSwgY29sdW1uOiAxIH07XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBkZWNvcmF0ZShub2RlOiBhbnksIG1hcmtlcjogTWFya2VyKTogYW55IHtcbiAgICAgICAgbm9kZS5zdGFydCA9IDA7XG4gICAgICAgIG5vZGUuZW5kID0gMDtcbiAgICAgICAgcmV0dXJuIG5vZGU7XG4gICAgfVxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjcHJvZ3JhbS5cbiAgICB2aXNpdFByb2dyYW0oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJ2aXNpdFByb2dyYW06IFwiICsgY3R4LmdldFRleHQoKSk7XG4gICAgICAgIC8vIEludGVydmFsIHsgc3RhcnQ6IDAsIHN0b3A6IDAgfVxuICAgICAgICBsZXQgaW50ZXJ2YWwgPSBjdHguZ2V0U291cmNlSW50ZXJ2YWwoKTtcbiAgICAgICAgY29uc29sZS5pbmZvKCdpbnRlcnZhbCA6ICVzJywgSlNPTi5zdHJpbmdpZnkoaW50ZXJ2YWwpKVxuICAgICAgICAvLyB2aXNpdFByb2dyYW0gLT52aXNpdFNvdXJjZUVsZW1lbnRzIC0+IHZpc2l0U291cmNlRWxlbWVudCAtPiB2aXNpdFN0YXRlbWVudFxuICAgICAgICBsZXQgc3RhdGVtZW50czogYW55ID0gW107XG4gICAgICAgIGlmIChjdHguZ2V0Q2hpbGRDb3VudCgpID4gMSkgeyAvLyBleGNsdWRlIDxFT0Y+XG4gICAgICAgICAgICBpZiAoY3R4LmdldENoaWxkKDApLmdldENoaWxkQ291bnQoKSA+IDApIHtcbiAgICAgICAgICAgICAgICBsZXQgbm9kZSA9IGN0eC5nZXRDaGlsZCgwKS5nZXRDaGlsZCgwKS5nZXRDaGlsZCgwKTtcbiAgICAgICAgICAgICAgICBsZXQgc3RhdGVtZW50ID0gdGhpcy52aXNpdFN0YXRlbWVudChub2RlKTtcbiAgICAgICAgICAgICAgICBzdGF0ZW1lbnRzLnB1c2goc3RhdGVtZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBsZXQgbWV0YWRhdGEgPSB7XG4gICAgICAgICAgICBzdGFydDoge1xuICAgICAgICAgICAgICAgIGxpbmU6IDEsXG4gICAgICAgICAgICAgICAgY29sdW1uOiBpbnRlcnZhbC5zdGFydCxcbiAgICAgICAgICAgICAgICBvZmZzZXQ6IDBcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIGVuZDoge1xuICAgICAgICAgICAgICAgIGxpbmU6IDEsXG4gICAgICAgICAgICAgICAgY29sdW1uOiBpbnRlcnZhbC5zdG9wLFxuICAgICAgICAgICAgICAgIG9mZnNldDogMFxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIGxldCBzY3JpcHQgPSBuZXcgU2NyaXB0KHN0YXRlbWVudHMpO1xuICAgICAgICByZXR1cm4gdGhpcy5kZWNvcmF0ZShzY3JpcHQsIHRoaXMuYXNNYXJrZXIobWV0YWRhdGEpKTtcbiAgICB9O1xuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjc3RhdGVtZW50LlxuICAgIHZpc2l0U3RhdGVtZW50KGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS5pbmZvKFwidmlzaXRTdGF0ZW1lbnQgWyVzXSA6ICVzXCIsIGN0eC5nZXRDaGlsZENvdW50KCksIGN0eC5nZXRUZXh0KCkpO1xuICAgICAgICBpZiAoY3R4LmdldENoaWxkQ291bnQoKSAhPSAxKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJXcm9uZyBjaGlsZCBjb3VudCwgZXhwZWN0ZWQgMSBnb3QgOiBcIiArIGN0eC5nZXRDaGlsZENvdW50KCkpO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IG5vZGU6IFJ1bGVDb250ZXh0ID0gY3R4LmdldENoaWxkKDApO1xuICAgICAgICBsZXQgdHlwZSA9IG5vZGUucnVsZUluZGV4O1xuICAgICAgICBpZiAodHlwZSA9PSBFQ01BU2NyaXB0UGFyc2VyLlJVTEVfYmxvY2spIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnZpc2l0QmxvY2sobm9kZSk7XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZSA9PSBFQ01BU2NyaXB0UGFyc2VyLlJVTEVfZXhwcmVzc2lvblN0YXRlbWVudCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmlzaXRFeHByZXNzaW9uU3RhdGVtZW50KG5vZGUpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVW5oYW5kbGVkIHR5cGUgWFg6IFwiICsgdHlwZSk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjYmxvY2suXG4gICAgdmlzaXRCbG9jayhjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0QmxvY2s6IFwiICsgY3R4LmdldFRleHQoKSArIFwiID09IFwiICsgY3R4KTtcbiAgICAgICAgbGV0IGJvZHkgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjdHguZ2V0Q2hpbGRDb3VudCgpOyArK2kpIHtcbiAgICAgICAgICAgIGxldCBub2RlOiBSdWxlQ29udGV4dCA9IGN0eC5nZXRDaGlsZChpKTtcbiAgICAgICAgICAgIGxldCB0eXBlID0gbm9kZS5ydWxlSW5kZXg7XG4gICAgICAgICAgICBpZiAodHlwZSA9PSBFQ01BU2NyaXB0UGFyc2VyLlJVTEVfc3RhdGVtZW50TGlzdCkge1xuICAgICAgICAgICAgICAgIGxldCBzdGF0ZW1lbnRMaXN0ID0gdGhpcy52aXNpdFN0YXRlbWVudExpc3Qobm9kZSk7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaW5kZXggaW4gc3RhdGVtZW50TGlzdCkge1xuICAgICAgICAgICAgICAgICAgICBib2R5LnB1c2goc3RhdGVtZW50TGlzdFtpbmRleF0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZSA9PSBFQ01BU2NyaXB0UGFyc2VyLlJVTEVfZXhwcmVzc2lvblN0YXRlbWVudCkge1xuICAgICAgICAgICAgICAgIGxldCBleHByZXNzaW9uID0gdGhpcy52aXNpdEV4cHJlc3Npb25TdGF0ZW1lbnQobm9kZSk7XG4gICAgICAgICAgICAgICAgYm9keS5wdXNoKGV4cHJlc3Npb24pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBlbHNlIGlmICh0eXBlID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVW5oYW5kbGVkIHR5cGUgOiBcIiArIHR5cGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gVE9ETyA6IEltcGxlbWVudCBtZVxuICAgICAgICByZXR1cm4gbmV3IEJsb2NrU3RhdGVtZW50KGJvZHkpO1xuICAgIH07XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI3N0YXRlbWVudExpc3QuXG4gICAgdmlzaXRTdGF0ZW1lbnRMaXN0KGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS5pbmZvKFwidmlzaXRTdGF0ZW1lbnRMaXN0OiBcIiArIGN0eC5nZXRUZXh0KCkpO1xuICAgICAgICBsZXQgYm9keSA9IFtdO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGN0eC5nZXRDaGlsZENvdW50KCk7ICsraSkge1xuICAgICAgICAgICAgbGV0IG5vZGU6IFJ1bGVDb250ZXh0ID0gY3R4LmdldENoaWxkKGkpO1xuICAgICAgICAgICAgbGV0IHR5cGUgPSBub2RlLnJ1bGVJbmRleDtcbiAgICAgICAgICAgIGlmICh0eXBlID09IEVDTUFTY3JpcHRQYXJzZXIuUlVMRV9zdGF0ZW1lbnQpIHtcbiAgICAgICAgICAgICAgICBsZXQgc3RhdGVtZW50OiBhbnkgPSB0aGlzLnZpc2l0U3RhdGVtZW50KG5vZGUpO1xuICAgICAgICAgICAgICAgIGJvZHkucHVzaChzdGF0ZW1lbnQpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVW5oYW5kbGVkIHR5cGUgOiBcIiArIHR5cGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBib2R5O1xuICAgIH07XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciN2YXJpYWJsZVN0YXRlbWVudC5cbiAgICB2aXNpdFZhcmlhYmxlU3RhdGVtZW50KGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS5pbmZvKFwidmlzaXRWYXJpYWJsZVN0YXRlbWVudDogXCIgKyBjdHguZ2V0VGV4dCgpKTtcbiAgICAgICAgdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gICAgfTtcblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjdmFyaWFibGVEZWNsYXJhdGlvbkxpc3QuXG4gICAgdmlzaXRWYXJpYWJsZURlY2xhcmF0aW9uTGlzdChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0VmFyaWFibGVEZWNsYXJhdGlvbkxpc3Q6IFwiICsgY3R4LmdldFRleHQoKSk7XG5cbiAgICB9O1xuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciN2YXJpYWJsZURlY2xhcmF0aW9uLlxuICAgIHZpc2l0VmFyaWFibGVEZWNsYXJhdGlvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0VmFyaWFibGVEZWNsYXJhdGlvbjogXCIgKyBjdHguZ2V0VGV4dCgpKTtcblxuICAgIH07XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2luaXRpYWxpc2VyLlxuICAgIHZpc2l0SW5pdGlhbGlzZXIoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJ2aXNpdEluaXRpYWxpc2VyOiBcIiArIGN0eC5nZXRUZXh0KCkpO1xuICAgIH07XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2VtcHR5U3RhdGVtZW50LlxuICAgIHZpc2l0RW1wdHlTdGF0ZW1lbnQoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJ2aXNpdEVtcHR5U3RhdGVtZW50WFg6IFwiICsgY3R4LmdldFRleHQoKSk7XG4gICAgfTtcblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjZXhwcmVzc2lvblN0YXRlbWVudC5cbiAgICB2aXNpdEV4cHJlc3Npb25TdGF0ZW1lbnQoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJ2aXNpdEV4cHJlc3Npb25TdGF0ZW1lbnQ6IFwiICsgY3R4LmdldFRleHQoKSk7XG4gICAgICAgIGlmIChjdHguZ2V0Q2hpbGRDb3VudCgpICE9IDEpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIldyb25nIGNoaWxkIGNvdW50LCBleHBlY3RlZCAxIGdvdCA6IFwiICsgY3R4LmdldENoaWxkQ291bnQoKSk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gdmlzaXRFeHByZXNzaW9uU3RhdGVtZW50Oj52aXNpdEV4cHJlc3Npb25TZXF1ZW5jZTo+dmlzaXRMaXRlcmFsRXhwcmVzc2lvblxuICAgICAgICBsZXQgbm9kZTogUnVsZUNvbnRleHQgPSBjdHguZ2V0Q2hpbGQoMCk7IC8vIHZpc2l0RXhwcmVzc2lvblNlcXVlbmNlIFxuICAgICAgICBsZXQgZXhwcmVzc2lvbiA9IG5vZGUuZ2V0Q2hpbGQoMCk7XG4gICAgICAgIGxldCBleHByZXNzaW9uSWQgPSBleHByZXNzaW9uLnJ1bGVJbmRleDtcbiAgICAgICAgbGV0IGxpdGVyYWw7XG4gICAgICAgIGlmIChleHByZXNzaW9uSWQgPT0gRUNNQVNjcmlwdFBhcnNlci5SVUxFX3NpbmdsZUV4cHJlc3Npb24pIHsgICAgICAgICAgICBcbiAgICAgICAgICAgIGxpdGVyYWwgPSB0aGlzLnZpc2l0TGl0ZXJhbEV4cHJlc3Npb24oZXhwcmVzc2lvbik7ICAgICAgICAgICAgXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJVbmhhbmRsZWQgdHlwZSA6IFwiICsgdHlwZSk7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgaW50ZXJ2YWwgPSBleHByZXNzaW9uLmdldFNvdXJjZUludGVydmFsKCk7XG4gICAgICAgIGxldCBzdGF0ZW1lbnQgPSBuZXcgRXhwcmVzc2lvblN0YXRlbWVudChsaXRlcmFsKTtcbiAgICAgICAgY29uc3QgbWV0YWRhdGEgPSB7XG4gICAgICAgICAgICBzdGFydDoge1xuICAgICAgICAgICAgICAgIGxpbmU6IDEsXG4gICAgICAgICAgICAgICAgY29sdW1uOiBpbnRlcnZhbC5zdGFydCxcbiAgICAgICAgICAgICAgICBvZmZzZXQ6IDBcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIGVuZDoge1xuICAgICAgICAgICAgICAgIGxpbmU6IDEsXG4gICAgICAgICAgICAgICAgY29sdW1uOiBpbnRlcnZhbC5zdG9wLFxuICAgICAgICAgICAgICAgIG9mZnNldDogM1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiB0aGlzLmRlY29yYXRlKHN0YXRlbWVudCwgdGhpcy5hc01hcmtlcihtZXRhZGF0YSkpO1xuICAgIH07XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2lmU3RhdGVtZW50LlxuICAgIHZpc2l0SWZTdGF0ZW1lbnQoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJ2aXNpdElmU3RhdGVtZW50OiBcIiArIGN0eC5nZXRUZXh0KCkpO1xuICAgICAgICB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgICB9O1xuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNEb1N0YXRlbWVudC5cbiAgICB2aXNpdERvU3RhdGVtZW50KGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS5pbmZvKFwidmlzaXREb1N0YXRlbWVudDogXCIgKyBjdHguZ2V0VGV4dCgpKTtcbiAgICAgICAgdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gICAgfTtcblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjV2hpbGVTdGF0ZW1lbnQuXG4gICAgdmlzaXRXaGlsZVN0YXRlbWVudChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0V2hpbGVTdGF0ZW1lbnQ6IFwiICsgY3R4LmdldFRleHQoKSk7XG4gICAgICAgIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICAgIH07XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI0ZvclN0YXRlbWVudC5cbiAgICB2aXNpdEZvclN0YXRlbWVudChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0V2hpbGVTdGF0ZW1lbnQ6IFwiICsgY3R4LmdldFRleHQoKSk7XG4gICAgICAgIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICAgIH07XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI0ZvclZhclN0YXRlbWVudC5cbiAgICB2aXNpdEZvclZhclN0YXRlbWVudChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gICAgICAgIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICAgIH07XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI0ZvckluU3RhdGVtZW50LlxuICAgIHZpc2l0Rm9ySW5TdGF0ZW1lbnQoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgICAgICB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgICB9O1xuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNGb3JWYXJJblN0YXRlbWVudC5cbiAgICB2aXNpdEZvclZhckluU3RhdGVtZW50KGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICAgICAgdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gICAgfTtcblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjY29udGludWVTdGF0ZW1lbnQuXG4gICAgdmlzaXRDb250aW51ZVN0YXRlbWVudChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gICAgICAgIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICAgIH07XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2JyZWFrU3RhdGVtZW50LlxuICAgIHZpc2l0QnJlYWtTdGF0ZW1lbnQoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgICAgICB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgICB9O1xuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNyZXR1cm5TdGF0ZW1lbnQuXG4gICAgdmlzaXRSZXR1cm5TdGF0ZW1lbnQoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgICAgICB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgICB9O1xuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciN3aXRoU3RhdGVtZW50LlxuICAgIHZpc2l0V2l0aFN0YXRlbWVudChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gICAgICAgIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICAgIH07XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI3N3aXRjaFN0YXRlbWVudC5cbiAgICB2aXNpdFN3aXRjaFN0YXRlbWVudChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gICAgICAgIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICAgIH07XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2Nhc2VCbG9jay5cbiAgICB2aXNpdENhc2VCbG9jayhjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gICAgICAgIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICAgIH07XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2Nhc2VDbGF1c2VzLlxuICAgIHZpc2l0Q2FzZUNsYXVzZXMoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgICAgICB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgICB9O1xuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNjYXNlQ2xhdXNlLlxuICAgIHZpc2l0Q2FzZUNsYXVzZShjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gICAgICAgIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICAgIH07XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2RlZmF1bHRDbGF1c2UuXG4gICAgdmlzaXREZWZhdWx0Q2xhdXNlKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICAgICAgdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gICAgfTtcblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjbGFiZWxsZWRTdGF0ZW1lbnQuXG4gICAgdmlzaXRMYWJlbGxlZFN0YXRlbWVudChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gICAgICAgIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICAgIH07XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI3Rocm93U3RhdGVtZW50LlxuICAgIHZpc2l0VGhyb3dTdGF0ZW1lbnQoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgICAgICB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgICB9O1xuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciN0cnlTdGF0ZW1lbnQuXG4gICAgdmlzaXRUcnlTdGF0ZW1lbnQoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgICAgICB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgICB9O1xuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNjYXRjaFByb2R1Y3Rpb24uXG4gICAgdmlzaXRDYXRjaFByb2R1Y3Rpb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgICAgICB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgICB9O1xuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNmaW5hbGx5UHJvZHVjdGlvbi5cbiAgICB2aXNpdEZpbmFsbHlQcm9kdWN0aW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICAgICAgdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gICAgfTtcblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjZGVidWdnZXJTdGF0ZW1lbnQuXG4gICAgdmlzaXREZWJ1Z2dlclN0YXRlbWVudChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gICAgICAgIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICAgIH07XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2Z1bmN0aW9uRGVjbGFyYXRpb24uXG4gICAgdmlzaXRGdW5jdGlvbkRlY2xhcmF0aW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICAgICAgdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gICAgfTtcblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjZm9ybWFsUGFyYW1ldGVyTGlzdC5cbiAgICB2aXNpdEZvcm1hbFBhcmFtZXRlckxpc3QoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgICAgICB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgICB9O1xuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNmdW5jdGlvbkJvZHkuXG4gICAgdmlzaXRGdW5jdGlvbkJvZHkoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJ2aXNpdEZ1bmN0aW9uQm9keTogXCIgKyBjdHguZ2V0VGV4dCgpKTtcblxuICAgICAgICB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgICB9O1xuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNhcnJheUxpdGVyYWwuXG4gICAgdmlzaXRBcnJheUxpdGVyYWwoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgICAgICB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgICB9O1xuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNlbGVtZW50TGlzdC5cbiAgICB2aXNpdEVsZW1lbnRMaXN0KGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICAgICAgdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gICAgfTtcblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjZWxpc2lvbi5cbiAgICB2aXNpdEVsaXNpb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgICAgICB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgICB9O1xuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNvYmplY3RMaXRlcmFsLlxuICAgIHZpc2l0T2JqZWN0TGl0ZXJhbChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gICAgICAgIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICAgIH07XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI3Byb3BlcnR5TmFtZUFuZFZhbHVlTGlzdC5cbiAgICB2aXNpdFByb3BlcnR5TmFtZUFuZFZhbHVlTGlzdChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gICAgICAgIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICAgIH07XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI1Byb3BlcnR5RXhwcmVzc2lvbkFzc2lnbm1lbnQuXG4gICAgdmlzaXRQcm9wZXJ0eUV4cHJlc3Npb25Bc3NpZ25tZW50KGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICAgICAgdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gICAgfTtcblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjUHJvcGVydHlHZXR0ZXIuXG4gICAgdmlzaXRQcm9wZXJ0eUdldHRlcihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gICAgICAgIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICAgIH07XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI1Byb3BlcnR5U2V0dGVyLlxuICAgIHZpc2l0UHJvcGVydHlTZXR0ZXIoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgICAgICB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgICB9O1xuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNwcm9wZXJ0eU5hbWUuXG4gICAgdmlzaXRQcm9wZXJ0eU5hbWUoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgICAgICB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgICB9O1xuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNwcm9wZXJ0eVNldFBhcmFtZXRlckxpc3QuXG4gICAgdmlzaXRQcm9wZXJ0eVNldFBhcmFtZXRlckxpc3QoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgICAgICB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgICB9O1xuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNhcmd1bWVudHMuXG4gICAgdmlzaXRBcmd1bWVudHMoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJ2aXNpdEFyZ3VtZW50czogXCIgKyBjdHguZ2V0VGV4dCgpKTtcbiAgICAgICAgdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gICAgfTtcblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjYXJndW1lbnRMaXN0LlxuICAgIHZpc2l0QXJndW1lbnRMaXN0KGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS5pbmZvKFwidmlzaXRBcmd1bWVudExpc3Q6IFwiICsgY3R4LmdldFRleHQoKSk7XG5cbiAgICAgICAgdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gICAgfTtcblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjZXhwcmVzc2lvblNlcXVlbmNlLlxuICAgIHZpc2l0RXhwcmVzc2lvblNlcXVlbmNlKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS5pbmZvKFwidmlzaXRFeHByZXNzaW9uU2VxdWVuY2U6IFwiICsgY3R4LmdldFRleHQoKSk7XG4gICAgICAgIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICAgIH07XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI1Rlcm5hcnlFeHByZXNzaW9uLlxuICAgIHZpc2l0VGVybmFyeUV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgICAgICB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgICB9O1xuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNMb2dpY2FsQW5kRXhwcmVzc2lvbi5cbiAgICB2aXNpdExvZ2ljYWxBbmRFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICAgICAgdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gICAgfTtcblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjUHJlSW5jcmVtZW50RXhwcmVzc2lvbi5cbiAgICB2aXNpdFByZUluY3JlbWVudEV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgICAgICB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgICB9O1xuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNPYmplY3RMaXRlcmFsRXhwcmVzc2lvbi5cbiAgICB2aXNpdE9iamVjdExpdGVyYWxFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICAgICAgdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gICAgfTtcblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjSW5FeHByZXNzaW9uLlxuICAgIHZpc2l0SW5FeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICAgICAgdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gICAgfTtcblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjTG9naWNhbE9yRXhwcmVzc2lvbi5cbiAgICB2aXNpdExvZ2ljYWxPckV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgICAgICB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgICB9O1xuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNOb3RFeHByZXNzaW9uLlxuICAgIHZpc2l0Tm90RXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gICAgICAgIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICAgIH07XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI1ByZURlY3JlYXNlRXhwcmVzc2lvbi5cbiAgICB2aXNpdFByZURlY3JlYXNlRXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gICAgICAgIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICAgIH07XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI0FyZ3VtZW50c0V4cHJlc3Npb24uXG4gICAgdmlzaXRBcmd1bWVudHNFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS5pbmZvKFwidmlzaXRBcmd1bWVudHNFeHByZXNzaW9uOiBcIiArIGN0eC5nZXRUZXh0KCkpO1xuXG4gICAgICAgIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICAgIH07XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI1RoaXNFeHByZXNzaW9uLlxuICAgIHZpc2l0VGhpc0V4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgICAgICB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgICB9O1xuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNGdW5jdGlvbkV4cHJlc3Npb24uXG4gICAgdmlzaXRGdW5jdGlvbkV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgICAgICB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgICB9O1xuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNVbmFyeU1pbnVzRXhwcmVzc2lvbi5cbiAgICB2aXNpdFVuYXJ5TWludXNFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICAgICAgdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gICAgfTtcblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjUG9zdERlY3JlYXNlRXhwcmVzc2lvbi5cbiAgICB2aXNpdFBvc3REZWNyZWFzZUV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgICAgICB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgICB9O1xuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNBc3NpZ25tZW50RXhwcmVzc2lvbi5cbiAgICB2aXNpdEFzc2lnbm1lbnRFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICAgICAgdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gICAgfTtcblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjVHlwZW9mRXhwcmVzc2lvbi5cbiAgICB2aXNpdFR5cGVvZkV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgICAgICB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgICB9O1xuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNJbnN0YW5jZW9mRXhwcmVzc2lvbi5cbiAgICB2aXNpdEluc3RhbmNlb2ZFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICAgICAgdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gICAgfTtcblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjVW5hcnlQbHVzRXhwcmVzc2lvbi5cbiAgICB2aXNpdFVuYXJ5UGx1c0V4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgICAgICB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgICB9O1xuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNEZWxldGVFeHByZXNzaW9uLlxuICAgIHZpc2l0RGVsZXRlRXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gICAgICAgIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICAgIH07XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI0VxdWFsaXR5RXhwcmVzc2lvbi5cbiAgICB2aXNpdEVxdWFsaXR5RXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gICAgICAgIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICAgIH07XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI0JpdFhPckV4cHJlc3Npb24uXG4gICAgdmlzaXRCaXRYT3JFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICAgICAgdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gICAgfTtcblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjTXVsdGlwbGljYXRpdmVFeHByZXNzaW9uLlxuICAgIHZpc2l0TXVsdGlwbGljYXRpdmVFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICAgICAgdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gICAgfTtcblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjQml0U2hpZnRFeHByZXNzaW9uLlxuICAgIHZpc2l0Qml0U2hpZnRFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICAgICAgdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gICAgfTtcblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjUGFyZW50aGVzaXplZEV4cHJlc3Npb24uXG4gICAgdmlzaXRQYXJlbnRoZXNpemVkRXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0UGFyZW50aGVzaXplZEV4cHJlc3Npb246IFwiICsgY3R4LmdldFRleHQoKSk7XG5cbiAgICAgICAgdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gICAgfTtcblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjQWRkaXRpdmVFeHByZXNzaW9uLlxuICAgIHZpc2l0QWRkaXRpdmVFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS5pbmZvKFwidmlzaXRBZGRpdGl2ZUV4cHJlc3Npb246IFwiICsgY3R4LmdldFRleHQoKSk7XG4gICAgICAgIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICAgIH07XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI1JlbGF0aW9uYWxFeHByZXNzaW9uLlxuICAgIHZpc2l0UmVsYXRpb25hbEV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgICAgICB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgICB9O1xuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNQb3N0SW5jcmVtZW50RXhwcmVzc2lvbi5cbiAgICB2aXNpdFBvc3RJbmNyZW1lbnRFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICAgICAgdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gICAgfTtcblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjQml0Tm90RXhwcmVzc2lvbi5cbiAgICB2aXNpdEJpdE5vdEV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgICAgICB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgICB9O1xuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNOZXdFeHByZXNzaW9uLlxuICAgIHZpc2l0TmV3RXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gICAgICAgIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICAgIH07XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI0xpdGVyYWxFeHByZXNzaW9uLlxuICAgIHZpc2l0TGl0ZXJhbEV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJ2aXNpdExpdGVyYWxFeHByZXNzaW9uOiBcIiArIGN0eC5nZXRUZXh0KCkpO1xuICAgICAgICBpZiAoY3R4LmdldENoaWxkQ291bnQoKSAhPSAxKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJXcm9uZyBjaGlsZCBjb3VudCwgZXhwZWN0ZWQgMSBnb3QgOiBcIiArIGN0eC5nZXRDaGlsZENvdW50KCkpO1xuICAgICAgICB9XG4gICAgICAgIC8vIHZpc2l0TGl0ZXJhbEV4cHJlc3Npb246ID4gdmlzaXRMaXRlcmFsOiAgdmlzaXROdW1lcmljTGl0ZXJhbDpcbiAgICAgICAgbGV0IG5vZGU6IFJ1bGVDb250ZXh0ID0gY3R4LmdldENoaWxkKDApO1xuICAgICAgICBsZXQgZXhwcmVzc2lvbiA9IG5vZGUuZ2V0Q2hpbGQoMCk7XG4gICAgICAgIGxldCBleHByZXNzaW9uSWQgPSBleHByZXNzaW9uLnJ1bGVJbmRleDtcbiAgICAgICAgaWYgKGV4cHJlc3Npb25JZCA9PSBFQ01BU2NyaXB0UGFyc2VyLlJVTEVfbnVtZXJpY0xpdGVyYWwpIHsgICAgICAgICAgICBcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnZpc2l0TnVtZXJpY0xpdGVyYWwoY3R4KTsgICAgICAgICAgICBcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlVuaGFuZGxlZCB0eXBlIDogXCIgKyB0eXBlKTtcbiAgICAgICAgfVxuICAgIH07XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI0FycmF5TGl0ZXJhbEV4cHJlc3Npb24uXG4gICAgdmlzaXRBcnJheUxpdGVyYWxFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICAgICAgdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gICAgfTtcblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjTWVtYmVyRG90RXhwcmVzc2lvbi5cbiAgICB2aXNpdE1lbWJlckRvdEV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJ2aXNpdE1lbWJlckRvdEV4cHJlc3Npb246IFwiICsgY3R4LmdldFRleHQoKSk7XG4gICAgICAgIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICAgIH07XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI01lbWJlckluZGV4RXhwcmVzc2lvbi5cbiAgICB2aXNpdE1lbWJlckluZGV4RXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gICAgICAgIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICAgIH07XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI0lkZW50aWZpZXJFeHByZXNzaW9uLlxuICAgIHZpc2l0SWRlbnRpZmllckV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJ2aXNpdElkZW50aWZpZXJFeHByZXNzaW9uOiBcIiArIGN0eC5nZXRUZXh0KCkpO1xuXG4gICAgICAgIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICAgIH07XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI0JpdEFuZEV4cHJlc3Npb24uXG4gICAgdmlzaXRCaXRBbmRFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICAgICAgdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gICAgfTtcblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjQml0T3JFeHByZXNzaW9uLlxuICAgIHZpc2l0Qml0T3JFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICAgICAgdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gICAgfTtcblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjQXNzaWdubWVudE9wZXJhdG9yRXhwcmVzc2lvbi5cbiAgICB2aXNpdEFzc2lnbm1lbnRPcGVyYXRvckV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgICAgICB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgICB9O1xuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNWb2lkRXhwcmVzc2lvbi5cbiAgICB2aXNpdFZvaWRFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICAgICAgdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gICAgfTtcblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2Fzc2lnbm1lbnRPcGVyYXRvci5cbiAgICB2aXNpdEFzc2lnbm1lbnRPcGVyYXRvcihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0QXNzaWdubWVudE9wZXJhdG9yOiBcIiArIGN0eC5nZXRUZXh0KCkpO1xuICAgICAgICB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgICB9O1xuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNsaXRlcmFsLlxuICAgIHZpc2l0TGl0ZXJhbChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0TGl0ZXJhbDogXCIgKyBjdHguZ2V0VGV4dCgpKTtcbiAgICAgICAgdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gICAgfTtcblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjbnVtZXJpY0xpdGVyYWwuXG4gICAgdmlzaXROdW1lcmljTGl0ZXJhbChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0TnVtZXJpY0xpdGVyYWw6IFwiICsgY3R4LmdldFRleHQoKSk7XG4gICAgICAgIGxldCB2YWx1ZSA9IGN0eC5nZXRUZXh0KCk7XG4gICAgICAgIGxldCBleHByZXNzaW9uID0gbmV3IExpdGVyYWwoXCJudW1iZXJcIiwgdmFsdWUpO1xuICAgICAgICByZXR1cm4gZXhwcmVzc2lvbjsnJ1xuICAgIH07XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2lkZW50aWZpZXJOYW1lLlxuICAgIHZpc2l0SWRlbnRpZmllck5hbWUoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJ2aXNpdElkZW50aWZpZXJOYW1lOiBcIiArIGN0eC5nZXRUZXh0KCkpO1xuICAgICAgICB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgICB9O1xuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNyZXNlcnZlZFdvcmQuXG4gICAgdmlzaXRSZXNlcnZlZFdvcmQoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJ2aXNpdFJlc2VydmVkV29yZDogXCIgKyBjdHguZ2V0VGV4dCgpKTtcblxuICAgICAgICB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgICB9O1xuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNrZXl3b3JkLlxuICAgIHZpc2l0S2V5d29yZChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0S2V5d29yZDogXCIgKyBjdHguZ2V0VGV4dCgpKTtcblxuICAgICAgICB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgICB9O1xuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNmdXR1cmVSZXNlcnZlZFdvcmQuXG4gICAgdmlzaXRGdXR1cmVSZXNlcnZlZFdvcmQoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgICAgICB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgICB9O1xuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNnZXR0ZXIuXG4gICAgdmlzaXRHZXR0ZXIoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgICAgICB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgICB9O1xuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNzZXR0ZXIuXG4gICAgdmlzaXRTZXR0ZXIoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgICAgICB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgICB9O1xuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjZW9zLlxuICAgIHZpc2l0RW9zKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgLy9jb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgICAgICB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgICB9O1xuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjZW9mLlxuICAgIHZpc2l0RW9mKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICAgICAgdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gICAgfTtcblxufSJdfQ==