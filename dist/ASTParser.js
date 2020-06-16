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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9BU1RQYXJzZXIudHMiXSwibmFtZXMiOlsiZnMiLCJyZXF1aXJlIiwiUGFyc2VyVHlwZSIsIkFTVFBhcnNlciIsImNvbnN0cnVjdG9yIiwidmlzaXRvciIsIkRlbHZlbkFTVFZpc2l0b3IiLCJnZW5lcmF0ZSIsInNvdXJjZSIsImNvZGUiLCJ0eXBlIiwidmFsdWUiLCJyZWFkRmlsZVN5bmMiLCJjaGFycyIsImFudGxyNCIsIklucHV0U3RyZWFtIiwibGV4ZXIiLCJEZWx2ZW5MZXhlciIsInRva2VucyIsIkNvbW1vblRva2VuU3RyZWFtIiwicGFyc2VyIiwiRGVsdmVuUGFyc2VyIiwidHJlZSIsInByb2dyYW0iLCJhY2NlcHQiLCJQcmludFZpc2l0b3IiLCJjb25zb2xlIiwiaW5mbyIsInJlc3VsdCIsInBhcnNlIiwiRUNNQVNjcmlwdCIsIkFTVFBhcnNlckRlZmF1bHQiLCJFcnJvciIsIm8iLCJuYW1lIiwiRGVsdmVuVmlzaXRvciIsImFzTWFya2VyIiwibWV0YWRhdGEiLCJpbmRleCIsImxpbmUiLCJjb2x1bW4iLCJkZWNvcmF0ZSIsIm5vZGUiLCJtYXJrZXIiLCJzdGFydCIsImVuZCIsInZpc2l0UHJvZ3JhbSIsImN0eCIsImdldFRleHQiLCJpbnRlcnZhbCIsImdldFNvdXJjZUludGVydmFsIiwiSlNPTiIsInN0cmluZ2lmeSIsInN0YXRlbWVudHMiLCJnZXRDaGlsZENvdW50IiwiZ2V0Q2hpbGQiLCJzdGF0ZW1lbnQiLCJ2aXNpdFN0YXRlbWVudCIsInB1c2giLCJvZmZzZXQiLCJzdG9wIiwic2NyaXB0IiwiU2NyaXB0IiwicnVsZUluZGV4IiwiRUNNQVNjcmlwdFBhcnNlciIsIlJVTEVfYmxvY2siLCJ2aXNpdEJsb2NrIiwiUlVMRV9leHByZXNzaW9uU3RhdGVtZW50IiwidmlzaXRFeHByZXNzaW9uU3RhdGVtZW50IiwiYm9keSIsImkiLCJSVUxFX3N0YXRlbWVudExpc3QiLCJzdGF0ZW1lbnRMaXN0IiwidmlzaXRTdGF0ZW1lbnRMaXN0IiwiZXhwcmVzc2lvbiIsInVuZGVmaW5lZCIsIkJsb2NrU3RhdGVtZW50IiwiUlVMRV9zdGF0ZW1lbnQiLCJ2aXNpdFZhcmlhYmxlU3RhdGVtZW50IiwidmlzaXRDaGlsZHJlbiIsInZpc2l0VmFyaWFibGVEZWNsYXJhdGlvbkxpc3QiLCJ2aXNpdFZhcmlhYmxlRGVjbGFyYXRpb24iLCJ2aXNpdEluaXRpYWxpc2VyIiwidmlzaXRFbXB0eVN0YXRlbWVudCIsImV4cHJlc3Npb25JZCIsImxpdGVyYWwiLCJSVUxFX3NpbmdsZUV4cHJlc3Npb24iLCJ2aXNpdExpdGVyYWxFeHByZXNzaW9uIiwiRXhwcmVzc2lvblN0YXRlbWVudCIsInZpc2l0SWZTdGF0ZW1lbnQiLCJ2aXNpdERvU3RhdGVtZW50IiwidmlzaXRXaGlsZVN0YXRlbWVudCIsInZpc2l0Rm9yU3RhdGVtZW50IiwidmlzaXRGb3JWYXJTdGF0ZW1lbnQiLCJ0cmFjZSIsInZpc2l0Rm9ySW5TdGF0ZW1lbnQiLCJ2aXNpdEZvclZhckluU3RhdGVtZW50IiwidmlzaXRDb250aW51ZVN0YXRlbWVudCIsInZpc2l0QnJlYWtTdGF0ZW1lbnQiLCJ2aXNpdFJldHVyblN0YXRlbWVudCIsInZpc2l0V2l0aFN0YXRlbWVudCIsInZpc2l0U3dpdGNoU3RhdGVtZW50IiwidmlzaXRDYXNlQmxvY2siLCJ2aXNpdENhc2VDbGF1c2VzIiwidmlzaXRDYXNlQ2xhdXNlIiwidmlzaXREZWZhdWx0Q2xhdXNlIiwidmlzaXRMYWJlbGxlZFN0YXRlbWVudCIsInZpc2l0VGhyb3dTdGF0ZW1lbnQiLCJ2aXNpdFRyeVN0YXRlbWVudCIsInZpc2l0Q2F0Y2hQcm9kdWN0aW9uIiwidmlzaXRGaW5hbGx5UHJvZHVjdGlvbiIsInZpc2l0RGVidWdnZXJTdGF0ZW1lbnQiLCJ2aXNpdEZ1bmN0aW9uRGVjbGFyYXRpb24iLCJ2aXNpdEZvcm1hbFBhcmFtZXRlckxpc3QiLCJ2aXNpdEZ1bmN0aW9uQm9keSIsInZpc2l0QXJyYXlMaXRlcmFsIiwidmlzaXRFbGVtZW50TGlzdCIsInZpc2l0RWxpc2lvbiIsInZpc2l0T2JqZWN0TGl0ZXJhbCIsInZpc2l0UHJvcGVydHlOYW1lQW5kVmFsdWVMaXN0IiwidmlzaXRQcm9wZXJ0eUV4cHJlc3Npb25Bc3NpZ25tZW50IiwidmlzaXRQcm9wZXJ0eUdldHRlciIsInZpc2l0UHJvcGVydHlTZXR0ZXIiLCJ2aXNpdFByb3BlcnR5TmFtZSIsInZpc2l0UHJvcGVydHlTZXRQYXJhbWV0ZXJMaXN0IiwidmlzaXRBcmd1bWVudHMiLCJ2aXNpdEFyZ3VtZW50TGlzdCIsInZpc2l0RXhwcmVzc2lvblNlcXVlbmNlIiwidmlzaXRUZXJuYXJ5RXhwcmVzc2lvbiIsInZpc2l0TG9naWNhbEFuZEV4cHJlc3Npb24iLCJ2aXNpdFByZUluY3JlbWVudEV4cHJlc3Npb24iLCJ2aXNpdE9iamVjdExpdGVyYWxFeHByZXNzaW9uIiwidmlzaXRJbkV4cHJlc3Npb24iLCJ2aXNpdExvZ2ljYWxPckV4cHJlc3Npb24iLCJ2aXNpdE5vdEV4cHJlc3Npb24iLCJ2aXNpdFByZURlY3JlYXNlRXhwcmVzc2lvbiIsInZpc2l0QXJndW1lbnRzRXhwcmVzc2lvbiIsInZpc2l0VGhpc0V4cHJlc3Npb24iLCJ2aXNpdEZ1bmN0aW9uRXhwcmVzc2lvbiIsInZpc2l0VW5hcnlNaW51c0V4cHJlc3Npb24iLCJ2aXNpdFBvc3REZWNyZWFzZUV4cHJlc3Npb24iLCJ2aXNpdEFzc2lnbm1lbnRFeHByZXNzaW9uIiwidmlzaXRUeXBlb2ZFeHByZXNzaW9uIiwidmlzaXRJbnN0YW5jZW9mRXhwcmVzc2lvbiIsInZpc2l0VW5hcnlQbHVzRXhwcmVzc2lvbiIsInZpc2l0RGVsZXRlRXhwcmVzc2lvbiIsInZpc2l0RXF1YWxpdHlFeHByZXNzaW9uIiwidmlzaXRCaXRYT3JFeHByZXNzaW9uIiwidmlzaXRNdWx0aXBsaWNhdGl2ZUV4cHJlc3Npb24iLCJ2aXNpdEJpdFNoaWZ0RXhwcmVzc2lvbiIsInZpc2l0UGFyZW50aGVzaXplZEV4cHJlc3Npb24iLCJ2aXNpdEFkZGl0aXZlRXhwcmVzc2lvbiIsInZpc2l0UmVsYXRpb25hbEV4cHJlc3Npb24iLCJ2aXNpdFBvc3RJbmNyZW1lbnRFeHByZXNzaW9uIiwidmlzaXRCaXROb3RFeHByZXNzaW9uIiwidmlzaXROZXdFeHByZXNzaW9uIiwiUlVMRV9udW1lcmljTGl0ZXJhbCIsInZpc2l0TnVtZXJpY0xpdGVyYWwiLCJ2aXNpdEFycmF5TGl0ZXJhbEV4cHJlc3Npb24iLCJ2aXNpdE1lbWJlckRvdEV4cHJlc3Npb24iLCJ2aXNpdE1lbWJlckluZGV4RXhwcmVzc2lvbiIsInZpc2l0SWRlbnRpZmllckV4cHJlc3Npb24iLCJ2aXNpdEJpdEFuZEV4cHJlc3Npb24iLCJ2aXNpdEJpdE9yRXhwcmVzc2lvbiIsInZpc2l0QXNzaWdubWVudE9wZXJhdG9yRXhwcmVzc2lvbiIsInZpc2l0Vm9pZEV4cHJlc3Npb24iLCJ2aXNpdEFzc2lnbm1lbnRPcGVyYXRvciIsInZpc2l0TGl0ZXJhbCIsIkxpdGVyYWwiLCJ2aXNpdElkZW50aWZpZXJOYW1lIiwidmlzaXRSZXNlcnZlZFdvcmQiLCJ2aXNpdEtleXdvcmQiLCJ2aXNpdEZ1dHVyZVJlc2VydmVkV29yZCIsInZpc2l0R2V0dGVyIiwidmlzaXRTZXR0ZXIiLCJ2aXNpdEVvcyIsInZpc2l0RW9mIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBRUE7O0FBRUE7Ozs7OztBQUVBLElBQUlBLEVBQUUsR0FBR0MsT0FBTyxDQUFDLElBQUQsQ0FBaEI7QUFFQTs7Ozs7Ozs7OztJQVFZQyxVOzs7V0FBQUEsVTtBQUFBQSxFQUFBQSxVLENBQUFBLFU7R0FBQUEsVSwwQkFBQUEsVTs7QUFVWDs7QUFFYyxNQUFlQyxTQUFmLENBQXlCO0FBRXBDQyxFQUFBQSxXQUFXLENBQUNDLE9BQUQsRUFBNkI7QUFDcEMsU0FBS0EsT0FBTCxHQUFlQSxPQUFPLElBQUksSUFBSUMsZ0JBQUosRUFBMUI7QUFDSDs7QUFFREMsRUFBQUEsUUFBUSxDQUFDQyxNQUFELEVBQThCO0FBQ2xDLFFBQUlDLElBQUo7O0FB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QzdILEdBQUQsRUFBbUI7QUFDdENyQixJQUFBQSxPQUFPLENBQUNvRSxLQUFSLENBQWMsaUJBQWQ7QUFDQSxTQUFLZixhQUFMLENBQW1CaEMsR0FBbkI7QUFDSDs7QUFHRDtBQUNBOEgsRUFBQUEsV0FBVyxDQUFDOUgsR0FBRCxFQUFtQjtBQUMxQnJCLElBQUFBLE9BQU8sQ0FBQ29FLEtBQVIsQ0FBYyxpQkFBZDtBQUNBLFNBQUtmLGFBQUwsQ0FBbUJoQyxHQUFuQjtBQUNIOztBQUdEO0FBQ0ErSCxFQUFBQSxXQUFXLENBQUMvSCxHQUFELEVBQW1CO0FBQzFCckIsSUFBQUEsT0FBTyxDQUFDb0UsS0FBUixDQUFjLGlCQUFkO0FBQ0EsU0FBS2YsYUFBTCxDQUFtQmhDLEdBQW5CO0FBQ0g7O0FBRUQ7QUFDQWdJLEVBQUFBLFFBQVEsQ0FBQ2hJLEdBQUQsRUFBbUI7QUFDdkI7QUFDQSxTQUFLZ0MsYUFBTCxDQUFtQmhDLEdBQW5CO0FBQ0g7O0FBRUQ7QUFDQWlJLEVBQUFBLFFBQVEsQ0FBQ2pJLEdBQUQsRUFBbUI7QUFDdkJyQixJQUFBQSxPQUFPLENBQUNvRSxLQUFSLENBQWMsaUJBQWQ7QUFDQSxTQUFLZixhQUFMLENBQW1CaEMsR0FBbkI7QUFDSDs7QUFueUIrQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGFudGxyNCBmcm9tIFwiYW50bHI0XCJcbmltcG9ydCB7IEVDTUFTY3JpcHRWaXNpdG9yIGFzIERlbHZlblZpc2l0b3IgfSBmcm9tIFwiLi9wYXJzZXIvRUNNQVNjcmlwdFZpc2l0b3JcIlxuaW1wb3J0IHsgRUNNQVNjcmlwdFBhcnNlciBhcyBEZWx2ZW5QYXJzZXIsIEVDTUFTY3JpcHRQYXJzZXIgfSBmcm9tIFwiLi9wYXJzZXIvRUNNQVNjcmlwdFBhcnNlclwiXG5pbXBvcnQgeyBFQ01BU2NyaXB0TGV4ZXIgYXMgRGVsdmVuTGV4ZXIgfSBmcm9tIFwiLi9wYXJzZXIvRUNNQVNjcmlwdExleGVyXCJcbmltcG9ydCB7IFJ1bGVDb250ZXh0IH0gZnJvbSBcImFudGxyNC9SdWxlQ29udGV4dFwiXG5pbXBvcnQgeyBQcmludFZpc2l0b3IgfSBmcm9tIFwiLi9QcmludFZpc2l0b3JcIlxuaW1wb3J0IEFTVE5vZGUgZnJvbSBcIi4vQVNUTm9kZVwiO1xuaW1wb3J0IHsgRXhwcmVzc2lvblN0YXRlbWVudCwgTGl0ZXJhbCwgU2NyaXB0LCBCbG9ja1N0YXRlbWVudCwgU3RhdGVtZW50IH0gZnJvbSBcIi4vbm9kZXNcIjtcbmltcG9ydCB7IFN5bnRheCB9IGZyb20gXCIuL3N5bnRheFwiO1xubGV0IGZzID0gcmVxdWlyZShcImZzXCIpO1xuXG4vKipcbiAqIFZlcnNpb24gdGhhdCB3ZSBnZW5lcmF0ZSB0aGUgQVNUIGZvci4gXG4gKiBUaGlzIGFsbG93cyBmb3IgdGVzdGluZyBkaWZmZXJlbnQgaW1wbGVtZW50YXRpb25zXG4gKiBcbiAqIEN1cnJlbnRseSBvbmx5IEVDTUFTY3JpcHQgaXMgc3VwcG9ydGVkXG4gKiBcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9lc3RyZWUvZXN0cmVlXG4gKi9cbmV4cG9ydCBlbnVtIFBhcnNlclR5cGUgeyBFQ01BU2NyaXB0IH1cbmV4cG9ydCB0eXBlIFNvdXJjZVR5cGUgPSBcImNvZGVcIiB8IFwiZmlsZW5hbWVcIjtcbmV4cG9ydCB0eXBlIFNvdXJjZUNvZGUgPSB7XG4gICAgdHlwZTogU291cmNlVHlwZSxcbiAgICB2YWx1ZTogc3RyaW5nXG59XG5leHBvcnQgaW50ZXJmYWNlIE1hcmtlciB7XG4gICAgaW5kZXg6IG51bWJlcjtcbiAgICBsaW5lOiBudW1iZXI7XG4gICAgY29sdW1uOiBudW1iZXI7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBhYnN0cmFjdCBjbGFzcyBBU1RQYXJzZXIge1xuICAgIHByaXZhdGUgdmlzaXRvcjogKHR5cGVvZiBEZWx2ZW5WaXNpdG9yIHwgbnVsbClcbiAgICBjb25zdHJ1Y3Rvcih2aXNpdG9yPzogRGVsdmVuQVNUVmlzaXRvcikge1xuICAgICAgICB0aGlzLnZpc2l0b3IgPSB2aXNpdG9yIHx8IG5ldyBEZWx2ZW5BU1RWaXNpdG9yKCk7XG4gICAgfVxuXG4gICAgZ2VuZXJhdGUoc291cmNlOiBTb3VyY2VDb2RlKTogQVNUTm9kZSB7XG4gICAgICAgIGxldCBjb2RlO1xuICAgICAgICBzd2l0Y2ggKHNvdXJjZS50eXBlKSB7XG4gICAgICAgICAgICBjYXNlIFwiY29kZVwiOlxuICAgICAgICAgICAgICAgIGNvZGUgPSBzb3VyY2UudmFsdWU7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwiZmlsZW5hbWVcIjpcbiAgICAgICAgICAgICAgICBjb2RlID0gZnMucmVhZEZpbGVTeW5jKHNvdXJjZS52YWx1ZSwgXCJ1dGY4XCIpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGNoYXJzID0gbmV3IGFudGxyNC5JbnB1dFN0cmVhbShjb2RlKTtcbiAgICAgICAgbGV0IGxleGVyID0gbmV3IERlbHZlbkxleGVyKGNoYXJzKTtcbiAgICAgICAgbGV0IHRva2VucyA9IG5ldyBhbnRscjQuQ29tbW9uVG9rZW5TdHJlYW0obGV4ZXIpO1xuICAgICAgICBsZXQgcGFyc2VyID0gbmV3IERlbHZlblBhcnNlcih0b2tlbnMpO1xuICAgICAgICBsZXQgdHJlZSA9IHBhcnNlci5wcm9ncmFtKCk7XG4gICAgICAgIC8vIGNvbnNvbGUuaW5mbyh0cmVlLnRvU3RyaW5nVHJlZSgpKVxuICAgICAgICB0cmVlLmFjY2VwdChuZXcgUHJpbnRWaXNpdG9yKCkpO1xuICAgICAgICBjb25zb2xlLmluZm8oXCItLS0tLS0tLS0tLS0tLS0tLS0tLS1cIik7XG4gICAgICAgIGxldCByZXN1bHQgPSB0cmVlLmFjY2VwdCh0aGlzLnZpc2l0b3IpO1xuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFBhcnNlIHNvdXJjZSBhbmQgZ2VuZXJlYXRlIEFTVCB0cmVlXG4gICAgICogQHBhcmFtIHNvdXJjZSBcbiAgICAgKiBAcGFyYW0gdHlwZSBcbiAgICAgKi9cbiAgICBzdGF0aWMgcGFyc2Uoc291cmNlOiBTb3VyY2VDb2RlLCB0eXBlPzogUGFyc2VyVHlwZSk6IEFTVE5vZGUge1xuICAgICAgICBpZiAodHlwZSA9PSBudWxsKVxuICAgICAgICAgICAgdHlwZSA9IFBhcnNlclR5cGUuRUNNQVNjcmlwdDtcbiAgICAgICAgbGV0IHBhcnNlcjtcbiAgICAgICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICAgICAgICBjYXNlIFBhcnNlclR5cGUuRUNNQVNjcmlwdDpcbiAgICAgICAgICAgICAgICBwYXJzZXIgPSBuZXcgQVNUUGFyc2VyRGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJVbmtvd24gcGFyc2VyIHR5cGVcIik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHBhcnNlci5nZW5lcmF0ZShzb3VyY2UpXG4gICAgfVxufVxuXG5jbGFzcyBBU1RQYXJzZXJEZWZhdWx0IGV4dGVuZHMgQVNUUGFyc2VyIHtcblxufVxuZnVuY3Rpb24gdHlwZShvKSB7XG4gICAgcmV0dXJuIG8gJiYgby5jb25zdHJ1Y3RvciAmJiBvLmNvbnN0cnVjdG9yLm5hbWVcbn1cblxuZXhwb3J0IGNsYXNzIERlbHZlbkFTVFZpc2l0b3IgZXh0ZW5kcyBEZWx2ZW5WaXNpdG9yIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFzTWFya2VyKG1ldGFkYXRhOiBhbnkpIHtcbiAgICAgICAgcmV0dXJuIHsgaW5kZXg6IDEsIGxpbmU6IDEsIGNvbHVtbjogMSB9O1xuICAgIH1cblxuICAgIHByaXZhdGUgZGVjb3JhdGUobm9kZTogYW55LCBtYXJrZXI6IE1hcmtlcik6IGFueSB7XG4gICAgICAgIG5vZGUuc3RhcnQgPSAwO1xuICAgICAgICBub2RlLmVuZCA9IDA7XG4gICAgICAgIHJldHVybiBub2RlO1xuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI3Byb2dyYW0uXG4gICAgdmlzaXRQcm9ncmFtKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS5pbmZvKFwidmlzaXRQcm9ncmFtOiBcIiArIGN0eC5nZXRUZXh0KCkpO1xuICAgICAgICAvLyBJbnRlcnZhbCB7IHN0YXJ0OiAwLCBzdG9wOiAwIH1cbiAgICAgICAgbGV0IGludGVydmFsID0gY3R4LmdldFNvdXJjZUludGVydmFsKCk7XG4gICAgICAgIGNvbnNvbGUuaW5mbygnaW50ZXJ2YWwgOiAlcycsIEpTT04uc3RyaW5naWZ5KGludGVydmFsKSlcbiAgICAgICAgLy8gdmlzaXRQcm9ncmFtIC0+dmlzaXRTb3VyY2VFbGVtZW50cyAtPiB2aXNpdFNvdXJjZUVsZW1lbnQgLT4gdmlzaXRTdGF0ZW1lbnRcbiAgICAgICAgbGV0IHN0YXRlbWVudHM6IGFueSA9IFtdO1xuICAgICAgICBpZiAoY3R4LmdldENoaWxkQ291bnQoKSA+IDEpIHsgLy8gZXhjbHVkZSA8RU9GPlxuICAgICAgICAgICAgaWYgKGN0eC5nZXRDaGlsZCgwKS5nZXRDaGlsZENvdW50KCkgPiAwKSB7XG4gICAgICAgICAgICAgICAgbGV0IG5vZGUgPSBjdHguZ2V0Q2hpbGQoMCkuZ2V0Q2hpbGQoMCkuZ2V0Q2hpbGQoMCk7XG4gICAgICAgICAgICAgICAgbGV0IHN0YXRlbWVudCA9IHRoaXMudmlzaXRTdGF0ZW1lbnQobm9kZSk7XG4gICAgICAgICAgICAgICAgc3RhdGVtZW50cy5wdXNoKHN0YXRlbWVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgbGV0IG1ldGFkYXRhID0ge1xuICAgICAgICAgICAgc3RhcnQ6IHtcbiAgICAgICAgICAgICAgICBsaW5lOiAxLFxuICAgICAgICAgICAgICAgIGNvbHVtbjogaW50ZXJ2YWwuc3RhcnQsXG4gICAgICAgICAgICAgICAgb2Zmc2V0OiAwXG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICBlbmQ6IHtcbiAgICAgICAgICAgICAgICBsaW5lOiAxLFxuICAgICAgICAgICAgICAgIGNvbHVtbjogaW50ZXJ2YWwuc3RvcCxcbiAgICAgICAgICAgICAgICBvZmZzZXQ6IDBcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICBsZXQgc2NyaXB0ID0gbmV3IFNjcmlwdChzdGF0ZW1lbnRzKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGVjb3JhdGUoc2NyaXB0LCB0aGlzLmFzTWFya2VyKG1ldGFkYXRhKSk7XG4gICAgfTtcblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI3N0YXRlbWVudC5cbiAgICB2aXNpdFN0YXRlbWVudChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0U3RhdGVtZW50IFslc10gOiAlc1wiLCBjdHguZ2V0Q2hpbGRDb3VudCgpLCBjdHguZ2V0VGV4dCgpKTtcbiAgICAgICAgaWYgKGN0eC5nZXRDaGlsZENvdW50KCkgIT0gMSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiV3JvbmcgY2hpbGQgY291bnQsIGV4cGVjdGVkIDEgZ290IDogXCIgKyBjdHguZ2V0Q2hpbGRDb3VudCgpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBub2RlOiBSdWxlQ29udGV4dCA9IGN0eC5nZXRDaGlsZCgwKTtcbiAgICAgICAgbGV0IHR5cGUgPSBub2RlLnJ1bGVJbmRleDtcbiAgICAgICAgaWYgKHR5cGUgPT0gRUNNQVNjcmlwdFBhcnNlci5SVUxFX2Jsb2NrKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy52aXNpdEJsb2NrKG5vZGUpO1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGUgPT0gRUNNQVNjcmlwdFBhcnNlci5SVUxFX2V4cHJlc3Npb25TdGF0ZW1lbnQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnZpc2l0RXhwcmVzc2lvblN0YXRlbWVudChub2RlKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlVuaGFuZGxlZCB0eXBlIFhYOiBcIiArIHR5cGUpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2Jsb2NrLlxuICAgIHZpc2l0QmxvY2soY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJ2aXNpdEJsb2NrOiBcIiArIGN0eC5nZXRUZXh0KCkgKyBcIiA9PSBcIiArIGN0eCk7XG4gICAgICAgIGxldCBib2R5ID0gW107XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY3R4LmdldENoaWxkQ291bnQoKTsgKytpKSB7XG4gICAgICAgICAgICBsZXQgbm9kZTogUnVsZUNvbnRleHQgPSBjdHguZ2V0Q2hpbGQoaSk7XG4gICAgICAgICAgICBsZXQgdHlwZSA9IG5vZGUucnVsZUluZGV4O1xuICAgICAgICAgICAgaWYgKHR5cGUgPT0gRUNNQVNjcmlwdFBhcnNlci5SVUxFX3N0YXRlbWVudExpc3QpIHtcbiAgICAgICAgICAgICAgICBsZXQgc3RhdGVtZW50TGlzdCA9IHRoaXMudmlzaXRTdGF0ZW1lbnRMaXN0KG5vZGUpO1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGluZGV4IGluIHN0YXRlbWVudExpc3QpIHtcbiAgICAgICAgICAgICAgICAgICAgYm9keS5wdXNoKHN0YXRlbWVudExpc3RbaW5kZXhdKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGUgPT0gRUNNQVNjcmlwdFBhcnNlci5SVUxFX2V4cHJlc3Npb25TdGF0ZW1lbnQpIHtcbiAgICAgICAgICAgICAgICBsZXQgZXhwcmVzc2lvbiA9IHRoaXMudmlzaXRFeHByZXNzaW9uU3RhdGVtZW50KG5vZGUpO1xuICAgICAgICAgICAgICAgIGJvZHkucHVzaChleHByZXNzaW9uKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZWxzZSBpZiAodHlwZSA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlVuaGFuZGxlZCB0eXBlIDogXCIgKyB0eXBlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFRPRE8gOiBJbXBsZW1lbnQgbWVcbiAgICAgICAgcmV0dXJuIG5ldyBCbG9ja1N0YXRlbWVudChib2R5KTtcbiAgICB9O1xuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNzdGF0ZW1lbnRMaXN0LlxuICAgIHZpc2l0U3RhdGVtZW50TGlzdChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0U3RhdGVtZW50TGlzdDogXCIgKyBjdHguZ2V0VGV4dCgpKTtcbiAgICAgICAgbGV0IGJvZHkgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjdHguZ2V0Q2hpbGRDb3VudCgpOyArK2kpIHtcbiAgICAgICAgICAgIGxldCBub2RlOiBSdWxlQ29udGV4dCA9IGN0eC5nZXRDaGlsZChpKTtcbiAgICAgICAgICAgIGxldCB0eXBlID0gbm9kZS5ydWxlSW5kZXg7XG4gICAgICAgICAgICBpZiAodHlwZSA9PSBFQ01BU2NyaXB0UGFyc2VyLlJVTEVfc3RhdGVtZW50KSB7XG4gICAgICAgICAgICAgICAgbGV0IHN0YXRlbWVudDogYW55ID0gdGhpcy52aXNpdFN0YXRlbWVudChub2RlKTtcbiAgICAgICAgICAgICAgICBib2R5LnB1c2goc3RhdGVtZW50KTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZSA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlVuaGFuZGxlZCB0eXBlIDogXCIgKyB0eXBlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYm9keTtcbiAgICB9O1xuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjdmFyaWFibGVTdGF0ZW1lbnQuXG4gICAgdmlzaXRWYXJpYWJsZVN0YXRlbWVudChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0VmFyaWFibGVTdGF0ZW1lbnQ6IFwiICsgY3R4LmdldFRleHQoKSk7XG4gICAgICAgIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICAgIH07XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI3ZhcmlhYmxlRGVjbGFyYXRpb25MaXN0LlxuICAgIHZpc2l0VmFyaWFibGVEZWNsYXJhdGlvbkxpc3QoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJ2aXNpdFZhcmlhYmxlRGVjbGFyYXRpb25MaXN0OiBcIiArIGN0eC5nZXRUZXh0KCkpO1xuXG4gICAgfTtcblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjdmFyaWFibGVEZWNsYXJhdGlvbi5cbiAgICB2aXNpdFZhcmlhYmxlRGVjbGFyYXRpb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJ2aXNpdFZhcmlhYmxlRGVjbGFyYXRpb246IFwiICsgY3R4LmdldFRleHQoKSk7XG5cbiAgICB9O1xuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNpbml0aWFsaXNlci5cbiAgICB2aXNpdEluaXRpYWxpc2VyKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS5pbmZvKFwidmlzaXRJbml0aWFsaXNlcjogXCIgKyBjdHguZ2V0VGV4dCgpKTtcbiAgICB9O1xuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNlbXB0eVN0YXRlbWVudC5cbiAgICB2aXNpdEVtcHR5U3RhdGVtZW50KGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS5pbmZvKFwidmlzaXRFbXB0eVN0YXRlbWVudFhYOiBcIiArIGN0eC5nZXRUZXh0KCkpO1xuICAgIH07XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2V4cHJlc3Npb25TdGF0ZW1lbnQuXG4gICAgdmlzaXRFeHByZXNzaW9uU3RhdGVtZW50KGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS5pbmZvKFwidmlzaXRFeHByZXNzaW9uU3RhdGVtZW50OiBcIiArIGN0eC5nZXRUZXh0KCkpO1xuICAgICAgICBpZiAoY3R4LmdldENoaWxkQ291bnQoKSAhPSAxKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJXcm9uZyBjaGlsZCBjb3VudCwgZXhwZWN0ZWQgMSBnb3QgOiBcIiArIGN0eC5nZXRDaGlsZENvdW50KCkpO1xuICAgICAgICB9XG4gICAgICAgIC8vIHZpc2l0RXhwcmVzc2lvblN0YXRlbWVudDo+dmlzaXRFeHByZXNzaW9uU2VxdWVuY2U6PnZpc2l0TGl0ZXJhbEV4cHJlc3Npb25cbiAgICAgICAgbGV0IG5vZGU6IFJ1bGVDb250ZXh0ID0gY3R4LmdldENoaWxkKDApOyAvLyB2aXNpdEV4cHJlc3Npb25TZXF1ZW5jZSBcbiAgICAgICAgbGV0IGV4cHJlc3Npb24gPSBub2RlLmdldENoaWxkKDApO1xuICAgICAgICBsZXQgZXhwcmVzc2lvbklkID0gZXhwcmVzc2lvbi5ydWxlSW5kZXg7XG4gICAgICAgIGxldCBsaXRlcmFsO1xuICAgICAgICBpZiAoZXhwcmVzc2lvbklkID09IEVDTUFTY3JpcHRQYXJzZXIuUlVMRV9zaW5nbGVFeHByZXNzaW9uKSB7ICAgICAgICAgICAgXG4gICAgICAgICAgICBsaXRlcmFsID0gdGhpcy52aXNpdExpdGVyYWxFeHByZXNzaW9uKGV4cHJlc3Npb24pOyAgICAgICAgICAgIFxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVW5oYW5kbGVkIHR5cGUgOiBcIiArIHR5cGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGludGVydmFsID0gZXhwcmVzc2lvbi5nZXRTb3VyY2VJbnRlcnZhbCgpO1xuICAgICAgICBsZXQgc3RhdGVtZW50ID0gbmV3IEV4cHJlc3Npb25TdGF0ZW1lbnQobGl0ZXJhbCk7XG4gICAgICAgIGNvbnN0IG1ldGFkYXRhID0ge1xuICAgICAgICAgICAgc3RhcnQ6IHtcbiAgICAgICAgICAgICAgICBsaW5lOiAxLFxuICAgICAgICAgICAgICAgIGNvbHVtbjogaW50ZXJ2YWwuc3RhcnQsXG4gICAgICAgICAgICAgICAgb2Zmc2V0OiAwXG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICBlbmQ6IHtcbiAgICAgICAgICAgICAgICBsaW5lOiAxLFxuICAgICAgICAgICAgICAgIGNvbHVtbjogaW50ZXJ2YWwuc3RvcCxcbiAgICAgICAgICAgICAgICBvZmZzZXQ6IDNcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gdGhpcy5kZWNvcmF0ZShzdGF0ZW1lbnQsIHRoaXMuYXNNYXJrZXIobWV0YWRhdGEpKTtcbiAgICB9O1xuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNpZlN0YXRlbWVudC5cbiAgICB2aXNpdElmU3RhdGVtZW50KGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS5pbmZvKFwidmlzaXRJZlN0YXRlbWVudDogXCIgKyBjdHguZ2V0VGV4dCgpKTtcbiAgICAgICAgdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gICAgfTtcblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjRG9TdGF0ZW1lbnQuXG4gICAgdmlzaXREb1N0YXRlbWVudChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0RG9TdGF0ZW1lbnQ6IFwiICsgY3R4LmdldFRleHQoKSk7XG4gICAgICAgIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICAgIH07XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI1doaWxlU3RhdGVtZW50LlxuICAgIHZpc2l0V2hpbGVTdGF0ZW1lbnQoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJ2aXNpdFdoaWxlU3RhdGVtZW50OiBcIiArIGN0eC5nZXRUZXh0KCkpO1xuICAgICAgICB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgICB9O1xuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNGb3JTdGF0ZW1lbnQuXG4gICAgdmlzaXRGb3JTdGF0ZW1lbnQoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJ2aXNpdFdoaWxlU3RhdGVtZW50OiBcIiArIGN0eC5nZXRUZXh0KCkpO1xuICAgICAgICB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgICB9O1xuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNGb3JWYXJTdGF0ZW1lbnQuXG4gICAgdmlzaXRGb3JWYXJTdGF0ZW1lbnQoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgICAgICB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgICB9O1xuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNGb3JJblN0YXRlbWVudC5cbiAgICB2aXNpdEZvckluU3RhdGVtZW50KGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICAgICAgdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gICAgfTtcblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjRm9yVmFySW5TdGF0ZW1lbnQuXG4gICAgdmlzaXRGb3JWYXJJblN0YXRlbWVudChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gICAgICAgIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICAgIH07XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2NvbnRpbnVlU3RhdGVtZW50LlxuICAgIHZpc2l0Q29udGludWVTdGF0ZW1lbnQoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgICAgICB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgICB9O1xuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNicmVha1N0YXRlbWVudC5cbiAgICB2aXNpdEJyZWFrU3RhdGVtZW50KGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICAgICAgdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gICAgfTtcblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjcmV0dXJuU3RhdGVtZW50LlxuICAgIHZpc2l0UmV0dXJuU3RhdGVtZW50KGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICAgICAgdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gICAgfTtcblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjd2l0aFN0YXRlbWVudC5cbiAgICB2aXNpdFdpdGhTdGF0ZW1lbnQoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgICAgICB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgICB9O1xuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNzd2l0Y2hTdGF0ZW1lbnQuXG4gICAgdmlzaXRTd2l0Y2hTdGF0ZW1lbnQoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgICAgICB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgICB9O1xuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNjYXNlQmxvY2suXG4gICAgdmlzaXRDYXNlQmxvY2soY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgICAgICB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgICB9O1xuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNjYXNlQ2xhdXNlcy5cbiAgICB2aXNpdENhc2VDbGF1c2VzKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICAgICAgdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gICAgfTtcblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjY2FzZUNsYXVzZS5cbiAgICB2aXNpdENhc2VDbGF1c2UoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgICAgICB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgICB9O1xuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNkZWZhdWx0Q2xhdXNlLlxuICAgIHZpc2l0RGVmYXVsdENsYXVzZShjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gICAgICAgIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICAgIH07XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2xhYmVsbGVkU3RhdGVtZW50LlxuICAgIHZpc2l0TGFiZWxsZWRTdGF0ZW1lbnQoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgICAgICB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgICB9O1xuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciN0aHJvd1N0YXRlbWVudC5cbiAgICB2aXNpdFRocm93U3RhdGVtZW50KGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICAgICAgdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gICAgfTtcblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjdHJ5U3RhdGVtZW50LlxuICAgIHZpc2l0VHJ5U3RhdGVtZW50KGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICAgICAgdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gICAgfTtcblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjY2F0Y2hQcm9kdWN0aW9uLlxuICAgIHZpc2l0Q2F0Y2hQcm9kdWN0aW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICAgICAgdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gICAgfTtcblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjZmluYWxseVByb2R1Y3Rpb24uXG4gICAgdmlzaXRGaW5hbGx5UHJvZHVjdGlvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gICAgICAgIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICAgIH07XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2RlYnVnZ2VyU3RhdGVtZW50LlxuICAgIHZpc2l0RGVidWdnZXJTdGF0ZW1lbnQoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgICAgICB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgICB9O1xuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNmdW5jdGlvbkRlY2xhcmF0aW9uLlxuICAgIHZpc2l0RnVuY3Rpb25EZWNsYXJhdGlvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gICAgICAgIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICAgIH07XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2Zvcm1hbFBhcmFtZXRlckxpc3QuXG4gICAgdmlzaXRGb3JtYWxQYXJhbWV0ZXJMaXN0KGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICAgICAgdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gICAgfTtcblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjZnVuY3Rpb25Cb2R5LlxuICAgIHZpc2l0RnVuY3Rpb25Cb2R5KGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS5pbmZvKFwidmlzaXRGdW5jdGlvbkJvZHk6IFwiICsgY3R4LmdldFRleHQoKSk7XG5cbiAgICAgICAgdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gICAgfTtcblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjYXJyYXlMaXRlcmFsLlxuICAgIHZpc2l0QXJyYXlMaXRlcmFsKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICAgICAgdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gICAgfTtcblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjZWxlbWVudExpc3QuXG4gICAgdmlzaXRFbGVtZW50TGlzdChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gICAgICAgIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICAgIH07XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2VsaXNpb24uXG4gICAgdmlzaXRFbGlzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICAgICAgdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gICAgfTtcblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjb2JqZWN0TGl0ZXJhbC5cbiAgICB2aXNpdE9iamVjdExpdGVyYWwoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgICAgICB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgICB9O1xuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNwcm9wZXJ0eU5hbWVBbmRWYWx1ZUxpc3QuXG4gICAgdmlzaXRQcm9wZXJ0eU5hbWVBbmRWYWx1ZUxpc3QoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgICAgICB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgICB9O1xuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNQcm9wZXJ0eUV4cHJlc3Npb25Bc3NpZ25tZW50LlxuICAgIHZpc2l0UHJvcGVydHlFeHByZXNzaW9uQXNzaWdubWVudChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gICAgICAgIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICAgIH07XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI1Byb3BlcnR5R2V0dGVyLlxuICAgIHZpc2l0UHJvcGVydHlHZXR0ZXIoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgICAgICB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgICB9O1xuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNQcm9wZXJ0eVNldHRlci5cbiAgICB2aXNpdFByb3BlcnR5U2V0dGVyKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICAgICAgdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gICAgfTtcblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjcHJvcGVydHlOYW1lLlxuICAgIHZpc2l0UHJvcGVydHlOYW1lKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICAgICAgdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gICAgfTtcblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjcHJvcGVydHlTZXRQYXJhbWV0ZXJMaXN0LlxuICAgIHZpc2l0UHJvcGVydHlTZXRQYXJhbWV0ZXJMaXN0KGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICAgICAgdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gICAgfTtcblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjYXJndW1lbnRzLlxuICAgIHZpc2l0QXJndW1lbnRzKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS5pbmZvKFwidmlzaXRBcmd1bWVudHM6IFwiICsgY3R4LmdldFRleHQoKSk7XG4gICAgICAgIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICAgIH07XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2FyZ3VtZW50TGlzdC5cbiAgICB2aXNpdEFyZ3VtZW50TGlzdChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0QXJndW1lbnRMaXN0OiBcIiArIGN0eC5nZXRUZXh0KCkpO1xuXG4gICAgICAgIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICAgIH07XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2V4cHJlc3Npb25TZXF1ZW5jZS5cbiAgICB2aXNpdEV4cHJlc3Npb25TZXF1ZW5jZShjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0RXhwcmVzc2lvblNlcXVlbmNlOiBcIiArIGN0eC5nZXRUZXh0KCkpO1xuICAgICAgICB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgICB9O1xuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNUZXJuYXJ5RXhwcmVzc2lvbi5cbiAgICB2aXNpdFRlcm5hcnlFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICAgICAgdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gICAgfTtcblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjTG9naWNhbEFuZEV4cHJlc3Npb24uXG4gICAgdmlzaXRMb2dpY2FsQW5kRXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gICAgICAgIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICAgIH07XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI1ByZUluY3JlbWVudEV4cHJlc3Npb24uXG4gICAgdmlzaXRQcmVJbmNyZW1lbnRFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICAgICAgdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gICAgfTtcblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjT2JqZWN0TGl0ZXJhbEV4cHJlc3Npb24uXG4gICAgdmlzaXRPYmplY3RMaXRlcmFsRXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gICAgICAgIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICAgIH07XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI0luRXhwcmVzc2lvbi5cbiAgICB2aXNpdEluRXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gICAgICAgIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICAgIH07XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI0xvZ2ljYWxPckV4cHJlc3Npb24uXG4gICAgdmlzaXRMb2dpY2FsT3JFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICAgICAgdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gICAgfTtcblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjTm90RXhwcmVzc2lvbi5cbiAgICB2aXNpdE5vdEV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgICAgICB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgICB9O1xuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNQcmVEZWNyZWFzZUV4cHJlc3Npb24uXG4gICAgdmlzaXRQcmVEZWNyZWFzZUV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgICAgICB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgICB9O1xuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNBcmd1bWVudHNFeHByZXNzaW9uLlxuICAgIHZpc2l0QXJndW1lbnRzRXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0QXJndW1lbnRzRXhwcmVzc2lvbjogXCIgKyBjdHguZ2V0VGV4dCgpKTtcblxuICAgICAgICB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgICB9O1xuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNUaGlzRXhwcmVzc2lvbi5cbiAgICB2aXNpdFRoaXNFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICAgICAgdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gICAgfTtcblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjRnVuY3Rpb25FeHByZXNzaW9uLlxuICAgIHZpc2l0RnVuY3Rpb25FeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICAgICAgdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gICAgfTtcblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjVW5hcnlNaW51c0V4cHJlc3Npb24uXG4gICAgdmlzaXRVbmFyeU1pbnVzRXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gICAgICAgIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICAgIH07XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI1Bvc3REZWNyZWFzZUV4cHJlc3Npb24uXG4gICAgdmlzaXRQb3N0RGVjcmVhc2VFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICAgICAgdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gICAgfTtcblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjQXNzaWdubWVudEV4cHJlc3Npb24uXG4gICAgdmlzaXRBc3NpZ25tZW50RXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gICAgICAgIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICAgIH07XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI1R5cGVvZkV4cHJlc3Npb24uXG4gICAgdmlzaXRUeXBlb2ZFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICAgICAgdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gICAgfTtcblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjSW5zdGFuY2VvZkV4cHJlc3Npb24uXG4gICAgdmlzaXRJbnN0YW5jZW9mRXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gICAgICAgIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICAgIH07XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI1VuYXJ5UGx1c0V4cHJlc3Npb24uXG4gICAgdmlzaXRVbmFyeVBsdXNFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICAgICAgdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gICAgfTtcblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjRGVsZXRlRXhwcmVzc2lvbi5cbiAgICB2aXNpdERlbGV0ZUV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgICAgICB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgICB9O1xuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNFcXVhbGl0eUV4cHJlc3Npb24uXG4gICAgdmlzaXRFcXVhbGl0eUV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgICAgICB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgICB9O1xuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNCaXRYT3JFeHByZXNzaW9uLlxuICAgIHZpc2l0Qml0WE9yRXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gICAgICAgIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICAgIH07XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI011bHRpcGxpY2F0aXZlRXhwcmVzc2lvbi5cbiAgICB2aXNpdE11bHRpcGxpY2F0aXZlRXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gICAgICAgIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICAgIH07XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI0JpdFNoaWZ0RXhwcmVzc2lvbi5cbiAgICB2aXNpdEJpdFNoaWZ0RXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gICAgICAgIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICAgIH07XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI1BhcmVudGhlc2l6ZWRFeHByZXNzaW9uLlxuICAgIHZpc2l0UGFyZW50aGVzaXplZEV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJ2aXNpdFBhcmVudGhlc2l6ZWRFeHByZXNzaW9uOiBcIiArIGN0eC5nZXRUZXh0KCkpO1xuXG4gICAgICAgIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICAgIH07XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI0FkZGl0aXZlRXhwcmVzc2lvbi5cbiAgICB2aXNpdEFkZGl0aXZlRXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0QWRkaXRpdmVFeHByZXNzaW9uOiBcIiArIGN0eC5nZXRUZXh0KCkpO1xuICAgICAgICB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgICB9O1xuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNSZWxhdGlvbmFsRXhwcmVzc2lvbi5cbiAgICB2aXNpdFJlbGF0aW9uYWxFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICAgICAgdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gICAgfTtcblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjUG9zdEluY3JlbWVudEV4cHJlc3Npb24uXG4gICAgdmlzaXRQb3N0SW5jcmVtZW50RXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gICAgICAgIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICAgIH07XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI0JpdE5vdEV4cHJlc3Npb24uXG4gICAgdmlzaXRCaXROb3RFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICAgICAgdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gICAgfTtcblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjTmV3RXhwcmVzc2lvbi5cbiAgICB2aXNpdE5ld0V4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgICAgICB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgICB9O1xuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNMaXRlcmFsRXhwcmVzc2lvbi5cbiAgICB2aXNpdExpdGVyYWxFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS5pbmZvKFwidmlzaXRMaXRlcmFsRXhwcmVzc2lvbjogXCIgKyBjdHguZ2V0VGV4dCgpKTtcbiAgICAgICAgaWYgKGN0eC5nZXRDaGlsZENvdW50KCkgIT0gMSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiV3JvbmcgY2hpbGQgY291bnQsIGV4cGVjdGVkIDEgZ290IDogXCIgKyBjdHguZ2V0Q2hpbGRDb3VudCgpKTtcbiAgICAgICAgfVxuICAgICAgICAvLyB2aXNpdExpdGVyYWxFeHByZXNzaW9uOiA+IHZpc2l0TGl0ZXJhbDogIHZpc2l0TnVtZXJpY0xpdGVyYWw6XG4gICAgICAgIGxldCBub2RlOiBSdWxlQ29udGV4dCA9IGN0eC5nZXRDaGlsZCgwKTtcbiAgICAgICAgbGV0IGV4cHJlc3Npb24gPSBub2RlLmdldENoaWxkKDApO1xuICAgICAgICBsZXQgZXhwcmVzc2lvbklkID0gZXhwcmVzc2lvbi5ydWxlSW5kZXg7XG4gICAgICAgIGlmIChleHByZXNzaW9uSWQgPT0gRUNNQVNjcmlwdFBhcnNlci5SVUxFX251bWVyaWNMaXRlcmFsKSB7ICAgICAgICAgICAgXG4gICAgICAgICAgICByZXR1cm4gdGhpcy52aXNpdE51bWVyaWNMaXRlcmFsKGN0eCk7ICAgICAgICAgICAgXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJVbmhhbmRsZWQgdHlwZSA6IFwiICsgdHlwZSk7XG4gICAgICAgIH1cbiAgICB9O1xuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNBcnJheUxpdGVyYWxFeHByZXNzaW9uLlxuICAgIHZpc2l0QXJyYXlMaXRlcmFsRXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gICAgICAgIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICAgIH07XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI01lbWJlckRvdEV4cHJlc3Npb24uXG4gICAgdmlzaXRNZW1iZXJEb3RFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS5pbmZvKFwidmlzaXRNZW1iZXJEb3RFeHByZXNzaW9uOiBcIiArIGN0eC5nZXRUZXh0KCkpO1xuICAgICAgICB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgICB9O1xuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNNZW1iZXJJbmRleEV4cHJlc3Npb24uXG4gICAgdmlzaXRNZW1iZXJJbmRleEV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgICAgICB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgICB9O1xuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNJZGVudGlmaWVyRXhwcmVzc2lvbi5cbiAgICB2aXNpdElkZW50aWZpZXJFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS5pbmZvKFwidmlzaXRJZGVudGlmaWVyRXhwcmVzc2lvbjogXCIgKyBjdHguZ2V0VGV4dCgpKTtcblxuICAgICAgICB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgICB9O1xuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNCaXRBbmRFeHByZXNzaW9uLlxuICAgIHZpc2l0Qml0QW5kRXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gICAgICAgIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICAgIH07XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI0JpdE9yRXhwcmVzc2lvbi5cbiAgICB2aXNpdEJpdE9yRXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gICAgICAgIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICAgIH07XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI0Fzc2lnbm1lbnRPcGVyYXRvckV4cHJlc3Npb24uXG4gICAgdmlzaXRBc3NpZ25tZW50T3BlcmF0b3JFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICAgICAgdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gICAgfTtcblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjVm9pZEV4cHJlc3Npb24uXG4gICAgdmlzaXRWb2lkRXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gICAgICAgIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICAgIH07XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNhc3NpZ25tZW50T3BlcmF0b3IuXG4gICAgdmlzaXRBc3NpZ25tZW50T3BlcmF0b3IoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJ2aXNpdEFzc2lnbm1lbnRPcGVyYXRvcjogXCIgKyBjdHguZ2V0VGV4dCgpKTtcbiAgICAgICAgdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gICAgfTtcblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjbGl0ZXJhbC5cbiAgICB2aXNpdExpdGVyYWwoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJ2aXNpdExpdGVyYWw6IFwiICsgY3R4LmdldFRleHQoKSk7XG4gICAgICAgIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICAgIH07XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI251bWVyaWNMaXRlcmFsLlxuICAgIHZpc2l0TnVtZXJpY0xpdGVyYWwoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJ2aXNpdE51bWVyaWNMaXRlcmFsOiBcIiArIGN0eC5nZXRUZXh0KCkpO1xuICAgICAgICBsZXQgdmFsdWUgPSBjdHguZ2V0VGV4dCgpO1xuICAgICAgICBsZXQgZXhwcmVzc2lvbiA9IG5ldyBMaXRlcmFsKFwibnVtYmVyXCIsIHZhbHVlKTtcbiAgICAgICAgcmV0dXJuIGV4cHJlc3Npb247JydcbiAgICB9O1xuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNpZGVudGlmaWVyTmFtZS5cbiAgICB2aXNpdElkZW50aWZpZXJOYW1lKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS5pbmZvKFwidmlzaXRJZGVudGlmaWVyTmFtZTogXCIgKyBjdHguZ2V0VGV4dCgpKTtcbiAgICAgICAgdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gICAgfTtcblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjcmVzZXJ2ZWRXb3JkLlxuICAgIHZpc2l0UmVzZXJ2ZWRXb3JkKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS5pbmZvKFwidmlzaXRSZXNlcnZlZFdvcmQ6IFwiICsgY3R4LmdldFRleHQoKSk7XG5cbiAgICAgICAgdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gICAgfTtcblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIja2V5d29yZC5cbiAgICB2aXNpdEtleXdvcmQoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJ2aXNpdEtleXdvcmQ6IFwiICsgY3R4LmdldFRleHQoKSk7XG5cbiAgICAgICAgdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gICAgfTtcblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjZnV0dXJlUmVzZXJ2ZWRXb3JkLlxuICAgIHZpc2l0RnV0dXJlUmVzZXJ2ZWRXb3JkKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICAgICAgdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gICAgfTtcblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjZ2V0dGVyLlxuICAgIHZpc2l0R2V0dGVyKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICAgICAgdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gICAgfTtcblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjc2V0dGVyLlxuICAgIHZpc2l0U2V0dGVyKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICAgICAgdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gICAgfTtcblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2Vvcy5cbiAgICB2aXNpdEVvcyhjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIC8vY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICAgICAgdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gICAgfTtcblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2VvZi5cbiAgICB2aXNpdEVvZihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gICAgICAgIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICAgIH07XG5cbn0iXX0=