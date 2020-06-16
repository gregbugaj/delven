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

class DelvenASTVisitor extends _ECMAScriptVisitor.ECMAScriptVisitor {
  ruleTypeMap = new Map();

  constructor() {
    super();
    this.setupTypeRules();
  }

  setupTypeRules() {
    const keys = Object.getOwnPropertyNames(_ECMAScriptParser.ECMAScriptParser);

    for (var key in keys) {
      let name = keys[key];

      if (name.startsWith('RULE_')) {
        this.ruleTypeMap.set(parseInt(_ECMAScriptParser.ECMAScriptParser[name]), name);
      }
    }
  }

  dumpContext(ctx) {
    const keys = Object.getOwnPropertyNames(_ECMAScriptParser.ECMAScriptParser);
    let context = [];

    for (var key in keys) {
      let name = keys[key];

      if (name.endsWith('Context')) {
        if (ctx instanceof _ECMAScriptParser.ECMAScriptParser[name]) {
          context.push(name);
        }
      }
    }

    return context;
  }

  dumpContextAllChildren(ctx, indent = 0) {
    let pad = " ".padStart(indent, "\t");
    let nodes = this.dumpContext(ctx);

    if (nodes.length > 0) {
      console.info(pad + " * " + nodes);
    }

    for (let i = 0; i < ctx.getChildCount(); ++i) {
      let child = ctx === null || ctx === void 0 ? void 0 : ctx.getChild(i);

      if (child) {
        this.dumpContextAllChildren(child, ++indent);
        --indent;
      }
    }
  }
  /**
   * Get rule name by the Id
   * @param id 
   */


  getRuleById(id) {
    return this.ruleTypeMap.get(id);
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
  }

  throwTypeError(typeId) {
    throw new Error("Unhandled type : " + typeId + " : " + this.getRuleById(typeId));
  } // Visit a parse tree produced by ECMAScriptParser#program.


  visitProgram(ctx) {
    console.info("visitProgram [%s] : [%s]", ctx.getChildCount(), ctx.getText()); // Interval { start: 0, stop: 0 }

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

    let script = new _nodes.Script(statements);
    return this.decorate(script, this.asMarker(this.asMetadata(interval)));
  }

  // Visit a parse tree produced by ECMAScriptParser#statement.
  visitStatement(ctx) {
    console.info("visitStatement [%s] : %s", ctx.getChildCount(), ctx.getText());
    this.dumpContextAllChildren(ctx);

    if (ctx.getChildCount() != 1) {//   throw new Error("Wrong child count, expected 1 got : " + ctx.getChildCount());
    }

    let node = ctx.getChild(0);
    let type = node.ruleIndex;

    if (type == _ECMAScriptParser.ECMAScriptParser.RULE_block) {
      return this.visitBlock(node);
    } else if (type == _ECMAScriptParser.ECMAScriptParser.RULE_expressionStatement) {
      return this.visitExpressionStatement(node);
    } else {
      this.throwTypeError(type);
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
        this.throwTypeError(type);
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
        this.throwTypeError(type);
      }
    }

    return body;
  }

  // Visit a parse tree produced by ECMAScriptParser#variableStatement.
  visitVariableStatement(ctx) {
    console.info("visitVariableStatement: " + ctx.getText());
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

  getRuleType(node, index) {
    return node.getChild(index).ruleIndex;
  }

  assertNodeCount(ctx, count) {
    if (ctx.getChildCount() != count) {
      throw new Error("Wrong child count, expected 1 got : " + ctx.getChildCount());
    }
  } // Visit a parse tree produced by ECMAScriptParser#expressionStatement.


  visitExpressionStatement(ctx) {
    console.info("visitExpressionStatement: " + ctx.getText());
    this.assertNodeCount(ctx, 1); // visitExpressionStatement:>visitExpressionSequence:>visitLiteralExpression

    let node = ctx.getChild(0); // visitExpressionSequence 

    let sequence = this.visitExpressionSequence(node);
    return sequence;
  }

  asMetadata(interval) {
    return {
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
  } // Visit a parse tree produced by ECMAScriptParser#ifStatement.


  visitIfStatement(ctx) {
    console.info("visitIfStatement: " + ctx.getText());
  }

  // Visit a parse tree produced by ECMAScriptParser#DoStatement.
  visitDoStatement(ctx) {
    console.info("visitDoStatement: " + ctx.getText());
  }

  // Visit a parse tree produced by ECMAScriptParser#WhileStatement.
  visitWhileStatement(ctx) {
    console.info("visitWhileStatement: " + ctx.getText());
  }

  // Visit a parse tree produced by ECMAScriptParser#ForStatement.
  visitForStatement(ctx) {
    console.info("visitWhileStatement: " + ctx.getText());
  }

  // Visit a parse tree produced by ECMAScriptParser#ForVarStatement.
  visitForVarStatement(ctx) {
    console.trace('not implemented');
  }

  // Visit a parse tree produced by ECMAScriptParser#ForInStatement.
  visitForInStatement(ctx) {
    console.trace('not implemented');
  }

  // Visit a parse tree produced by ECMAScriptParser#ForVarInStatement.
  visitForVarInStatement(ctx) {
    console.trace('not implemented');
  }

  // Visit a parse tree produced by ECMAScriptParser#continueStatement.
  visitContinueStatement(ctx) {
    console.trace('not implemented');
  }

  // Visit a parse tree produced by ECMAScriptParser#breakStatement.
  visitBreakStatement(ctx) {
    console.trace('not implemented');
  }

  // Visit a parse tree produced by ECMAScriptParser#returnStatement.
  visitReturnStatement(ctx) {
    console.trace('not implemented');
  }

  // Visit a parse tree produced by ECMAScriptParser#withStatement.
  visitWithStatement(ctx) {
    console.trace('not implemented');
  }

  // Visit a parse tree produced by ECMAScriptParser#switchStatement.
  visitSwitchStatement(ctx) {
    console.trace('not implemented');
  }

  // Visit a parse tree produced by ECMAScriptParser#caseBlock.
  visitCaseBlock(ctx) {
    console.trace('not implemented');
  }

  // Visit a parse tree produced by ECMAScriptParser#caseClauses.
  visitCaseClauses(ctx) {
    console.trace('not implemented');
  }

  // Visit a parse tree produced by ECMAScriptParser#caseClause.
  visitCaseClause(ctx) {
    console.trace('not implemented');
  }

  // Visit a parse tree produced by ECMAScriptParser#defaultClause.
  visitDefaultClause(ctx) {
    console.trace('not implemented');
  }

  // Visit a parse tree produced by ECMAScriptParser#labelledStatement.
  visitLabelledStatement(ctx) {
    console.trace('not implemented');
  }

  // Visit a parse tree produced by ECMAScriptParser#throwStatement.
  visitThrowStatement(ctx) {
    console.trace('not implemented');
  }

  // Visit a parse tree produced by ECMAScriptParser#tryStatement.
  visitTryStatement(ctx) {
    console.trace('not implemented');
  }

  // Visit a parse tree produced by ECMAScriptParser#catchProduction.
  visitCatchProduction(ctx) {
    console.trace('not implemented');
  }

  // Visit a parse tree produced by ECMAScriptParser#finallyProduction.
  visitFinallyProduction(ctx) {
    console.trace('not implemented');
  }

  // Visit a parse tree produced by ECMAScriptParser#debuggerStatement.
  visitDebuggerStatement(ctx) {
    console.trace('not implemented');
  }

  // Visit a parse tree produced by ECMAScriptParser#functionDeclaration.
  visitFunctionDeclaration(ctx) {
    console.trace('not implemented');
  }

  // Visit a parse tree produced by ECMAScriptParser#formalParameterList.
  visitFormalParameterList(ctx) {
    console.trace('not implemented');
  }

  // Visit a parse tree produced by ECMAScriptParser#functionBody.
  visitFunctionBody(ctx) {
    console.info("visitFunctionBody: " + ctx.getText());
  }

  // Visit a parse tree produced by ECMAScriptParser#arrayLiteral.
  visitArrayLiteral(ctx) {
    console.trace('not implemented');
  }

  // Visit a parse tree produced by ECMAScriptParser#elementList.
  visitElementList(ctx) {
    console.trace('not implemented');
  }

  // Visit a parse tree produced by ECMAScriptParser#elision.
  visitElision(ctx) {
    console.trace('not implemented');
  }

  // Visit a parse tree produced by ECMAScriptParser#objectLiteral.
  visitObjectLiteral(ctx) {
    console.trace('not implemented');
  }

  // Visit a parse tree produced by ECMAScriptParser#propertyNameAndValueList.
  visitPropertyNameAndValueList(ctx) {
    console.trace('not implemented');
  }

  // Visit a parse tree produced by ECMAScriptParser#PropertyExpressionAssignment.
  visitPropertyExpressionAssignment(ctx) {
    console.trace('not implemented');
  }

  // Visit a parse tree produced by ECMAScriptParser#PropertyGetter.
  visitPropertyGetter(ctx) {
    console.trace('not implemented');
  }

  // Visit a parse tree produced by ECMAScriptParser#PropertySetter.
  visitPropertySetter(ctx) {
    console.trace('not implemented');
  }

  // Visit a parse tree produced by ECMAScriptParser#propertyName.
  visitPropertyName(ctx) {
    console.trace('not implemented');
  }

  // Visit a parse tree produced by ECMAScriptParser#propertySetParameterList.
  visitPropertySetParameterList(ctx) {
    console.trace('not implemented');
  }

  // Visit a parse tree produced by ECMAScriptParser#arguments.
  visitArguments(ctx) {
    console.info("visitArguments: " + ctx.getText());
  }

  // Visit a parse tree produced by ECMAScriptParser#argumentList.
  visitArgumentList(ctx) {
    console.info("visitArgumentList: " + ctx.getText());
  }

  // Visit a parse tree produced by ECMAScriptParser#expressionSequence.
  visitExpressionSequence(ctx) {
    console.info("visitExpressionSequence [%s] : [%s]", ctx.getChildCount(), ctx.getText());
    this.dumpContextAllChildren(ctx);
    if (true) return;
    let node = ctx;
    let count = node.getChildCount();
    let interval = node.getSourceInterval();
    let expressions = [];
    this.dumpContext(ctx);
    let child = node.getChild(0);

    if (child instanceof _ECMAScriptParser.ECMAScriptParser.AssignmentExpressionContext) {
      console.info("ASSIGMENT :: ");
    }

    for (var i = 0; i < count; ++i) {
      let child = node.getChild(i);
      let typeId = child.ruleIndex;
      let type = this.getRuleById(typeId);
      console.info("*** " + type);

      if (typeId == undefined) {
        continue;
      } else if (typeId == _ECMAScriptParser.ECMAScriptParser.RULE_singleExpression) {
        let literal = this.visitLiteralExpression(child);
        expressions.push(literal);
      } else {
        this.throwTypeError(typeId);
      }
    }

    let sequence = new _nodes.SequenceExpression(expressions);
    return this.decorate(sequence, this.asMarker(this.asMetadata(ctx.getSourceInterval())));
  }

  // Visit a parse tree produced by ECMAScriptParser#TernaryExpression.
  visitTernaryExpression(ctx) {
    console.trace('not implemented');
  }

  // Visit a parse tree produced by ECMAScriptParser#LogicalAndExpression.
  visitLogicalAndExpression(ctx) {
    console.trace('not implemented');
  }

  // Visit a parse tree produced by ECMAScriptParser#PreIncrementExpression.
  visitPreIncrementExpression(ctx) {
    console.trace('not implemented');
  }

  // Visit a parse tree produced by ECMAScriptParser#ObjectLiteralExpression.
  visitObjectLiteralExpression(ctx) {
    console.trace('not implemented');
  }

  // Visit a parse tree produced by ECMAScriptParser#InExpression.
  visitInExpression(ctx) {
    console.trace('not implemented');
  }

  // Visit a parse tree produced by ECMAScriptParser#LogicalOrExpression.
  visitLogicalOrExpression(ctx) {
    console.trace('not implemented');
  }

  // Visit a parse tree produced by ECMAScriptParser#NotExpression.
  visitNotExpression(ctx) {
    console.trace('not implemented');
  }

  // Visit a parse tree produced by ECMAScriptParser#PreDecreaseExpression.
  visitPreDecreaseExpression(ctx) {
    console.trace('not implemented');
  }

  // Visit a parse tree produced by ECMAScriptParser#ArgumentsExpression.
  visitArgumentsExpression(ctx) {
    console.info("visitArgumentsExpression: " + ctx.getText());
  }

  // Visit a parse tree produced by ECMAScriptParser#ThisExpression.
  visitThisExpression(ctx) {
    console.trace('not implemented');
  }

  // Visit a parse tree produced by ECMAScriptParser#FunctionExpression.
  visitFunctionExpression(ctx) {
    console.trace('not implemented');
  }

  // Visit a parse tree produced by ECMAScriptParser#UnaryMinusExpression.
  visitUnaryMinusExpression(ctx) {
    console.trace('not implemented');
  }

  // Visit a parse tree produced by ECMAScriptParser#PostDecreaseExpression.
  visitPostDecreaseExpression(ctx) {
    console.trace('not implemented');
  }

  // Visit a parse tree produced by ECMAScriptParser#AssignmentExpression.
  visitAssignmentExpression(ctx) {
    console.trace('not implemented');
  }

  // Visit a parse tree produced by ECMAScriptParser#TypeofExpression.
  visitTypeofExpression(ctx) {
    console.trace('not implemented');
  }

  // Visit a parse tree produced by ECMAScriptParser#InstanceofExpression.
  visitInstanceofExpression(ctx) {
    console.trace('not implemented');
  }

  // Visit a parse tree produced by ECMAScriptParser#UnaryPlusExpression.
  visitUnaryPlusExpression(ctx) {
    console.trace('not implemented');
  }

  // Visit a parse tree produced by ECMAScriptParser#DeleteExpression.
  visitDeleteExpression(ctx) {
    console.trace('not implemented');
  }

  // Visit a parse tree produced by ECMAScriptParser#EqualityExpression.
  visitEqualityExpression(ctx) {
    console.trace('not implemented');
  }

  // Visit a parse tree produced by ECMAScriptParser#BitXOrExpression.
  visitBitXOrExpression(ctx) {
    console.trace('not implemented');
  }

  // Visit a parse tree produced by ECMAScriptParser#MultiplicativeExpression.
  visitMultiplicativeExpression(ctx) {
    console.trace('not implemented');
  }

  // Visit a parse tree produced by ECMAScriptParser#BitShiftExpression.
  visitBitShiftExpression(ctx) {
    console.trace('not implemented');
  }

  // Visit a parse tree produced by ECMAScriptParser#ParenthesizedExpression.
  visitParenthesizedExpression(ctx) {
    console.info("visitParenthesizedExpression: " + ctx.getText());
  }

  // Visit a parse tree produced by ECMAScriptParser#AdditiveExpression.
  visitAdditiveExpression(ctx) {
    console.info("visitAdditiveExpression: " + ctx.getText());
  }

  // Visit a parse tree produced by ECMAScriptParser#RelationalExpression.
  visitRelationalExpression(ctx) {
    console.trace('not implemented');
  }

  // Visit a parse tree produced by ECMAScriptParser#PostIncrementExpression.
  visitPostIncrementExpression(ctx) {
    console.trace('not implemented');
  }

  // Visit a parse tree produced by ECMAScriptParser#BitNotExpression.
  visitBitNotExpression(ctx) {
    console.trace('not implemented');
  }

  // Visit a parse tree produced by ECMAScriptParser#NewExpression.
  visitNewExpression(ctx) {
    console.trace('not implemented');
  }

  // Visit a parse tree produced by ECMAScriptParser#LiteralExpression.
  visitLiteralExpression(ctx) {
    console.info("visitLiteralExpression [%s] : [%s]", ctx.getChildCount(), ctx.getText());
    this.assertNodeCount(ctx, 1); // visitLiteralExpression: > visitLiteral

    return this.visitLiteral(ctx.getChild(0));
  } // Visit a parse tree produced by ECMAScriptParser#ArrayLiteralExpression.


  visitArrayLiteralExpression(ctx) {
    console.trace('not implemented');
  }

  // Visit a parse tree produced by ECMAScriptParser#MemberDotExpression.
  visitMemberDotExpression(ctx) {
    console.info("visitMemberDotExpression: " + ctx.getText());
  }

  // Visit a parse tree produced by ECMAScriptParser#MemberIndexExpression.
  visitMemberIndexExpression(ctx) {
    console.trace('not implemented');
  }

  // Visit a parse tree produced by ECMAScriptParser#IdentifierExpression.
  visitIdentifierExpression(ctx) {
    console.info("visitIdentifierExpression: " + ctx.getText());
  }

  // Visit a parse tree produced by ECMAScriptParser#BitAndExpression.
  visitBitAndExpression(ctx) {
    console.trace('not implemented');
  }

  // Visit a parse tree produced by ECMAScriptParser#BitOrExpression.
  visitBitOrExpression(ctx) {
    console.trace('not implemented');
  }

  // Visit a parse tree produced by ECMAScriptParser#AssignmentOperatorExpression.
  visitAssignmentOperatorExpression(ctx) {
    console.trace('not implemented');
  }

  // Visit a parse tree produced by ECMAScriptParser#VoidExpression.
  visitVoidExpression(ctx) {
    console.trace('not implemented');
  }

  // Visit a parse tree produced by ECMAScriptParser#assignmentOperator.
  visitAssignmentOperator(ctx) {
    console.info("visitAssignmentOperator: " + ctx.getText());
  }

  // Visit a parse tree produced by ECMAScriptParser#literal.
  visitLiteral(ctx) {
    console.info("visitLiteral [%s] : [%s]", ctx.getChildCount(), ctx.getText());
    this.assertNodeCount(ctx, 1);
    let node = ctx.getChild(0);
    let typeId = node.ruleIndex;
    let count = node.getChildCount();
    console.info('typeId ' + typeId + " count = " + count); //  visitLiteral

    if (count == 0) {
      if (typeId == undefined) {
        // TerminalNode
        return this.createLiteralValue(node);
      }
    } else if (count == 1) {
      // only RULE_numericLiteral parsed right now ??
      let count = ctx.getChildCount();
      let node = ctx.getChild(0);
      let expression = node.getChild(0);
      let expressionId = expression.ruleIndex;

      if (expressionId == _ECMAScriptParser.ECMAScriptParser.RULE_numericLiteral) {
        return this.visitNumericLiteral(ctx);
      }
    }

    this.throwTypeError(typeId);
  } // Visit a parse tree produced by ECMAScriptParser#numericLiteral.


  visitNumericLiteral(ctx) {
    return this.createLiteralValue(ctx);
  }

  createLiteralValue(ctx) {
    console.info("createLiteralValue [%s]: [%s]", ctx.getChildCount(), ctx.getText());
    let value = ctx.getText();
    let literal = new _nodes.Literal(value, value);
    return this.decorate(literal, this.asMarker(this.asMetadata(ctx.getSourceInterval())));
  } // Visit a parse tree produced by ECMAScriptParser#identifierName.


  visitIdentifierName(ctx) {
    console.info("visitIdentifierName: " + ctx.getText());
  }

  // Visit a parse tree produced by ECMAScriptParser#reservedWord.
  visitReservedWord(ctx) {
    console.info("visitReservedWord: " + ctx.getText());
  }

  // Visit a parse tree produced by ECMAScriptParser#keyword.
  visitKeyword(ctx) {
    console.info("visitKeyword: " + ctx.getText());
  }

  // Visit a parse tree produced by ECMAScriptParser#futureReservedWord.
  visitFutureReservedWord(ctx) {
    console.trace('not implemented');
  }

  // Visit a parse tree produced by ECMAScriptParser#getter.
  visitGetter(ctx) {
    console.trace('not implemented');
  }

  // Visit a parse tree produced by ECMAScriptParser#setter.
  visitSetter(ctx) {
    console.trace('not implemented');
  }

  // Visit a parse tree produced by ECMAScriptParser#eos.
  visitEos(ctx) {//console.trace('not implemented')
  }

  // Visit a parse tree produced by ECMAScriptParser#eof.
  visitEof(ctx) {
    console.trace('not implemented');
  }

}

exports.DelvenASTVisitor = DelvenASTVisitor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9BU1RQYXJzZXIudHMiXSwibmFtZXMiOlsiZnMiLCJyZXF1aXJlIiwiUGFyc2VyVHlwZSIsIkFTVFBhcnNlciIsImNvbnN0cnVjdG9yIiwidmlzaXRvciIsIkRlbHZlbkFTVFZpc2l0b3IiLCJnZW5lcmF0ZSIsInNvdXJjZSIsImNvZGUiLCJ0eXBlIiwidmFsdWUiLCJyZWFkRmlsZVN5bmMiLCJjaGFycyIsImFudGxyNCIsIklucHV0U3RyZWFtIiwibGV4ZXIiLCJEZWx2ZW5MZXhlciIsInRva2VucyIsIkNvbW1vblRva2VuU3RyZWFtIiwicGFyc2VyIiwiRGVsdmVuUGFyc2VyIiwidHJlZSIsInByb2dyYW0iLCJhY2NlcHQiLCJQcmludFZpc2l0b3IiLCJjb25zb2xlIiwiaW5mbyIsInJlc3VsdCIsInBhcnNlIiwiRUNNQVNjcmlwdCIsIkFTVFBhcnNlckRlZmF1bHQiLCJFcnJvciIsIkRlbHZlblZpc2l0b3IiLCJydWxlVHlwZU1hcCIsIk1hcCIsInNldHVwVHlwZVJ1bGVzIiwia2V5cyIsIk9iamVjdCIsImdldE93blByb3BlcnR5TmFtZXMiLCJFQ01BU2NyaXB0UGFyc2VyIiwia2V5IiwibmFtZSIsInN0YXJ0c1dpdGgiLCJzZXQiLCJwYXJzZUludCIsImR1bXBDb250ZXh0IiwiY3R4IiwiY29udGV4dCIsImVuZHNXaXRoIiwicHVzaCIsImR1bXBDb250ZXh0QWxsQ2hpbGRyZW4iLCJpbmRlbnQiLCJwYWQiLCJwYWRTdGFydCIsIm5vZGVzIiwibGVuZ3RoIiwiaSIsImdldENoaWxkQ291bnQiLCJjaGlsZCIsImdldENoaWxkIiwiZ2V0UnVsZUJ5SWQiLCJpZCIsImdldCIsImFzTWFya2VyIiwibWV0YWRhdGEiLCJpbmRleCIsImxpbmUiLCJjb2x1bW4iLCJkZWNvcmF0ZSIsIm5vZGUiLCJtYXJrZXIiLCJzdGFydCIsImVuZCIsInRocm93VHlwZUVycm9yIiwidHlwZUlkIiwidmlzaXRQcm9ncmFtIiwiZ2V0VGV4dCIsImludGVydmFsIiwiZ2V0U291cmNlSW50ZXJ2YWwiLCJKU09OIiwic3RyaW5naWZ5Iiwic3RhdGVtZW50cyIsInN0YXRlbWVudCIsInZpc2l0U3RhdGVtZW50Iiwic2NyaXB0IiwiU2NyaXB0IiwiYXNNZXRhZGF0YSIsInJ1bGVJbmRleCIsIlJVTEVfYmxvY2siLCJ2aXNpdEJsb2NrIiwiUlVMRV9leHByZXNzaW9uU3RhdGVtZW50IiwidmlzaXRFeHByZXNzaW9uU3RhdGVtZW50IiwiYm9keSIsIlJVTEVfc3RhdGVtZW50TGlzdCIsInN0YXRlbWVudExpc3QiLCJ2aXNpdFN0YXRlbWVudExpc3QiLCJleHByZXNzaW9uIiwidW5kZWZpbmVkIiwiQmxvY2tTdGF0ZW1lbnQiLCJSVUxFX3N0YXRlbWVudCIsInZpc2l0VmFyaWFibGVTdGF0ZW1lbnQiLCJ2aXNpdFZhcmlhYmxlRGVjbGFyYXRpb25MaXN0IiwidmlzaXRWYXJpYWJsZURlY2xhcmF0aW9uIiwidmlzaXRJbml0aWFsaXNlciIsInZpc2l0RW1wdHlTdGF0ZW1lbnQiLCJnZXRSdWxlVHlwZSIsImFzc2VydE5vZGVDb3VudCIsImNvdW50Iiwic2VxdWVuY2UiLCJ2aXNpdEV4cHJlc3Npb25TZXF1ZW5jZSIsIm9mZnNldCIsInN0b3AiLCJ2aXNpdElmU3RhdGVtZW50IiwidmlzaXREb1N0YXRlbWVudCIsInZpc2l0V2hpbGVTdGF0ZW1lbnQiLCJ2aXNpdEZvclN0YXRlbWVudCIsInZpc2l0Rm9yVmFyU3RhdGVtZW50IiwidHJhY2UiLCJ2aXNpdEZvckluU3RhdGVtZW50IiwidmlzaXRGb3JWYXJJblN0YXRlbWVudCIsInZpc2l0Q29udGludWVTdGF0ZW1lbnQiLCJ2aXNpdEJyZWFrU3RhdGVtZW50IiwidmlzaXRSZXR1cm5TdGF0ZW1lbnQiLCJ2aXNpdFdpdGhTdGF0ZW1lbnQiLCJ2aXNpdFN3aXRjaFN0YXRlbWVudCIsInZpc2l0Q2FzZUJsb2NrIiwidmlzaXRDYXNlQ2xhdXNlcyIsInZpc2l0Q2FzZUNsYXVzZSIsInZpc2l0RGVmYXVsdENsYXVzZSIsInZpc2l0TGFiZWxsZWRTdGF0ZW1lbnQiLCJ2aXNpdFRocm93U3RhdGVtZW50IiwidmlzaXRUcnlTdGF0ZW1lbnQiLCJ2aXNpdENhdGNoUHJvZHVjdGlvbiIsInZpc2l0RmluYWxseVByb2R1Y3Rpb24iLCJ2aXNpdERlYnVnZ2VyU3RhdGVtZW50IiwidmlzaXRGdW5jdGlvbkRlY2xhcmF0aW9uIiwidmlzaXRGb3JtYWxQYXJhbWV0ZXJMaXN0IiwidmlzaXRGdW5jdGlvbkJvZHkiLCJ2aXNpdEFycmF5TGl0ZXJhbCIsInZpc2l0RWxlbWVudExpc3QiLCJ2aXNpdEVsaXNpb24iLCJ2aXNpdE9iamVjdExpdGVyYWwiLCJ2aXNpdFByb3BlcnR5TmFtZUFuZFZhbHVlTGlzdCIsInZpc2l0UHJvcGVydHlFeHByZXNzaW9uQXNzaWdubWVudCIsInZpc2l0UHJvcGVydHlHZXR0ZXIiLCJ2aXNpdFByb3BlcnR5U2V0dGVyIiwidmlzaXRQcm9wZXJ0eU5hbWUiLCJ2aXNpdFByb3BlcnR5U2V0UGFyYW1ldGVyTGlzdCIsInZpc2l0QXJndW1lbnRzIiwidmlzaXRBcmd1bWVudExpc3QiLCJleHByZXNzaW9ucyIsIkFzc2lnbm1lbnRFeHByZXNzaW9uQ29udGV4dCIsIlJVTEVfc2luZ2xlRXhwcmVzc2lvbiIsImxpdGVyYWwiLCJ2aXNpdExpdGVyYWxFeHByZXNzaW9uIiwiU2VxdWVuY2VFeHByZXNzaW9uIiwidmlzaXRUZXJuYXJ5RXhwcmVzc2lvbiIsInZpc2l0TG9naWNhbEFuZEV4cHJlc3Npb24iLCJ2aXNpdFByZUluY3JlbWVudEV4cHJlc3Npb24iLCJ2aXNpdE9iamVjdExpdGVyYWxFeHByZXNzaW9uIiwidmlzaXRJbkV4cHJlc3Npb24iLCJ2aXNpdExvZ2ljYWxPckV4cHJlc3Npb24iLCJ2aXNpdE5vdEV4cHJlc3Npb24iLCJ2aXNpdFByZURlY3JlYXNlRXhwcmVzc2lvbiIsInZpc2l0QXJndW1lbnRzRXhwcmVzc2lvbiIsInZpc2l0VGhpc0V4cHJlc3Npb24iLCJ2aXNpdEZ1bmN0aW9uRXhwcmVzc2lvbiIsInZpc2l0VW5hcnlNaW51c0V4cHJlc3Npb24iLCJ2aXNpdFBvc3REZWNyZWFzZUV4cHJlc3Npb24iLCJ2aXNpdEFzc2lnbm1lbnRFeHByZXNzaW9uIiwidmlzaXRUeXBlb2ZFeHByZXNzaW9uIiwidmlzaXRJbnN0YW5jZW9mRXhwcmVzc2lvbiIsInZpc2l0VW5hcnlQbHVzRXhwcmVzc2lvbiIsInZpc2l0RGVsZXRlRXhwcmVzc2lvbiIsInZpc2l0RXF1YWxpdHlFeHByZXNzaW9uIiwidmlzaXRCaXRYT3JFeHByZXNzaW9uIiwidmlzaXRNdWx0aXBsaWNhdGl2ZUV4cHJlc3Npb24iLCJ2aXNpdEJpdFNoaWZ0RXhwcmVzc2lvbiIsInZpc2l0UGFyZW50aGVzaXplZEV4cHJlc3Npb24iLCJ2aXNpdEFkZGl0aXZlRXhwcmVzc2lvbiIsInZpc2l0UmVsYXRpb25hbEV4cHJlc3Npb24iLCJ2aXNpdFBvc3RJbmNyZW1lbnRFeHByZXNzaW9uIiwidmlzaXRCaXROb3RFeHByZXNzaW9uIiwidmlzaXROZXdFeHByZXNzaW9uIiwidmlzaXRMaXRlcmFsIiwidmlzaXRBcnJheUxpdGVyYWxFeHByZXNzaW9uIiwidmlzaXRNZW1iZXJEb3RFeHByZXNzaW9uIiwidmlzaXRNZW1iZXJJbmRleEV4cHJlc3Npb24iLCJ2aXNpdElkZW50aWZpZXJFeHByZXNzaW9uIiwidmlzaXRCaXRBbmRFeHByZXNzaW9uIiwidmlzaXRCaXRPckV4cHJlc3Npb24iLCJ2aXNpdEFzc2lnbm1lbnRPcGVyYXRvckV4cHJlc3Npb24iLCJ2aXNpdFZvaWRFeHByZXNzaW9uIiwidmlzaXRBc3NpZ25tZW50T3BlcmF0b3IiLCJjcmVhdGVMaXRlcmFsVmFsdWUiLCJleHByZXNzaW9uSWQiLCJSVUxFX251bWVyaWNMaXRlcmFsIiwidmlzaXROdW1lcmljTGl0ZXJhbCIsIkxpdGVyYWwiLCJ2aXNpdElkZW50aWZpZXJOYW1lIiwidmlzaXRSZXNlcnZlZFdvcmQiLCJ2aXNpdEtleXdvcmQiLCJ2aXNpdEZ1dHVyZVJlc2VydmVkV29yZCIsInZpc2l0R2V0dGVyIiwidmlz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LHVCQUF1QixDQUFDNUosR0FBRCxFQUFtQjtBQUN0Q3JCLElBQUFBLE9BQU8sQ0FBQzRGLEtBQVIsQ0FBYyxpQkFBZDtBQUVIOztBQUdEO0FBQ0FzRixFQUFBQSxXQUFXLENBQUM3SixHQUFELEVBQW1CO0FBQzFCckIsSUFBQUEsT0FBTyxDQUFDNEYsS0FBUixDQUFjLGlCQUFkO0FBRUg7O0FBR0Q7QUFDQXVGLEVBQUFBLFdBQVcsQ0FBQzlKLEdBQUQsRUFBbUI7QUFDMUJyQixJQUFBQSxPQUFPLENBQUM0RixLQUFSLENBQWMsaUJBQWQ7QUFFSDs7QUFFRDtBQUNBd0YsRUFBQUEsUUFBUSxDQUFDL0osR0FBRCxFQUFtQixDQUN2QjtBQUVIOztBQUVEO0FBQ0FnSyxFQUFBQSxRQUFRLENBQUNoSyxHQUFELEVBQW1CO0FBQ3ZCckIsSUFBQUEsT0FBTyxDQUFDNEYsS0FBUixDQUFjLGlCQUFkO0FBRUg7O0FBNTNCK0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBhbnRscjQgZnJvbSBcImFudGxyNFwiXG5pbXBvcnQgeyBFQ01BU2NyaXB0VmlzaXRvciBhcyBEZWx2ZW5WaXNpdG9yIH0gZnJvbSBcIi4vcGFyc2VyL0VDTUFTY3JpcHRWaXNpdG9yXCJcbmltcG9ydCB7IEVDTUFTY3JpcHRQYXJzZXIgYXMgRGVsdmVuUGFyc2VyLCBFQ01BU2NyaXB0UGFyc2VyIH0gZnJvbSBcIi4vcGFyc2VyL0VDTUFTY3JpcHRQYXJzZXJcIlxuaW1wb3J0IHsgRUNNQVNjcmlwdExleGVyIGFzIERlbHZlbkxleGVyIH0gZnJvbSBcIi4vcGFyc2VyL0VDTUFTY3JpcHRMZXhlclwiXG5pbXBvcnQgeyBSdWxlQ29udGV4dCB9IGZyb20gXCJhbnRscjQvUnVsZUNvbnRleHRcIlxuaW1wb3J0IHsgUHJpbnRWaXNpdG9yIH0gZnJvbSBcIi4vUHJpbnRWaXNpdG9yXCJcbmltcG9ydCBBU1ROb2RlIGZyb20gXCIuL0FTVE5vZGVcIjtcbmltcG9ydCB7IEV4cHJlc3Npb25TdGF0ZW1lbnQsIExpdGVyYWwsIFNjcmlwdCwgQmxvY2tTdGF0ZW1lbnQsIFN0YXRlbWVudCwgU2VxdWVuY2VFeHByZXNzaW9uIH0gZnJvbSBcIi4vbm9kZXNcIjtcbmltcG9ydCB7IFN5bnRheCB9IGZyb20gXCIuL3N5bnRheFwiO1xuaW1wb3J0IHsgdHlwZSB9IGZyb20gXCJvc1wiXG5pbXBvcnQgeyBJbnRlcnZhbCB9IGZyb20gXCJhbnRscjRcIlxubGV0IGZzID0gcmVxdWlyZShcImZzXCIpO1xuXG4vKipcbiAqIFZlcnNpb24gdGhhdCB3ZSBnZW5lcmF0ZSB0aGUgQVNUIGZvci4gXG4gKiBUaGlzIGFsbG93cyBmb3IgdGVzdGluZyBkaWZmZXJlbnQgaW1wbGVtZW50YXRpb25zXG4gKiBcbiAqIEN1cnJlbnRseSBvbmx5IEVDTUFTY3JpcHQgaXMgc3VwcG9ydGVkXG4gKiBcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9lc3RyZWUvZXN0cmVlXG4gKi9cbmV4cG9ydCBlbnVtIFBhcnNlclR5cGUgeyBFQ01BU2NyaXB0IH1cbmV4cG9ydCB0eXBlIFNvdXJjZVR5cGUgPSBcImNvZGVcIiB8IFwiZmlsZW5hbWVcIjtcbmV4cG9ydCB0eXBlIFNvdXJjZUNvZGUgPSB7XG4gICAgdHlwZTogU291cmNlVHlwZSxcbiAgICB2YWx1ZTogc3RyaW5nXG59XG5leHBvcnQgaW50ZXJmYWNlIE1hcmtlciB7XG4gICAgaW5kZXg6IG51bWJlcjtcbiAgICBsaW5lOiBudW1iZXI7XG4gICAgY29sdW1uOiBudW1iZXI7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBhYnN0cmFjdCBjbGFzcyBBU1RQYXJzZXIge1xuICAgIHByaXZhdGUgdmlzaXRvcjogKHR5cGVvZiBEZWx2ZW5WaXNpdG9yIHwgbnVsbClcbiAgIFxuICAgIGNvbnN0cnVjdG9yKHZpc2l0b3I/OiBEZWx2ZW5BU1RWaXNpdG9yKSB7XG4gICAgICAgIHRoaXMudmlzaXRvciA9IHZpc2l0b3IgfHwgbmV3IERlbHZlbkFTVFZpc2l0b3IoKTtcbiAgICB9XG5cbiAgICBnZW5lcmF0ZShzb3VyY2U6IFNvdXJjZUNvZGUpOiBBU1ROb2RlIHtcbiAgICAgICAgbGV0IGNvZGU7XG4gICAgICAgIHN3aXRjaCAoc291cmNlLnR5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgXCJjb2RlXCI6XG4gICAgICAgICAgICAgICAgY29kZSA9IHNvdXJjZS52YWx1ZTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJmaWxlbmFtZVwiOlxuICAgICAgICAgICAgICAgIGNvZGUgPSBmcy5yZWFkRmlsZVN5bmMoc291cmNlLnZhbHVlLCBcInV0ZjhcIik7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgY2hhcnMgPSBuZXcgYW50bHI0LklucHV0U3RyZWFtKGNvZGUpO1xuICAgICAgICBsZXQgbGV4ZXIgPSBuZXcgRGVsdmVuTGV4ZXIoY2hhcnMpO1xuICAgICAgICBsZXQgdG9rZW5zID0gbmV3IGFudGxyNC5Db21tb25Ub2tlblN0cmVhbShsZXhlcik7XG4gICAgICAgIGxldCBwYXJzZXIgPSBuZXcgRGVsdmVuUGFyc2VyKHRva2Vucyk7XG4gXG4gXG4gICAgICAgIGxldCB0cmVlID0gcGFyc2VyLnByb2dyYW0oKTtcbiAgICAgICAgLy8gY29uc29sZS5pbmZvKHRyZWUudG9TdHJpbmdUcmVlKCkpXG4gICAgICAgIHRyZWUuYWNjZXB0KG5ldyBQcmludFZpc2l0b3IoKSk7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcIi0tLS0tLS0tLS0tLS0tLS0tLS0tLVwiKTtcbiAgICAgICAgbGV0IHJlc3VsdCA9IHRyZWUuYWNjZXB0KHRoaXMudmlzaXRvcik7XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUGFyc2Ugc291cmNlIGFuZCBnZW5lcmVhdGUgQVNUIHRyZWVcbiAgICAgKiBAcGFyYW0gc291cmNlIFxuICAgICAqIEBwYXJhbSB0eXBlIFxuICAgICAqL1xuICAgIHN0YXRpYyBwYXJzZShzb3VyY2U6IFNvdXJjZUNvZGUsIHR5cGU/OiBQYXJzZXJUeXBlKTogQVNUTm9kZSB7XG4gICAgICAgIGlmICh0eXBlID09IG51bGwpXG4gICAgICAgICAgICB0eXBlID0gUGFyc2VyVHlwZS5FQ01BU2NyaXB0O1xuICAgICAgICBsZXQgcGFyc2VyO1xuICAgICAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgUGFyc2VyVHlwZS5FQ01BU2NyaXB0OlxuICAgICAgICAgICAgICAgIHBhcnNlciA9IG5ldyBBU1RQYXJzZXJEZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlVua293biBwYXJzZXIgdHlwZVwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgcmV0dXJuIHBhcnNlci5nZW5lcmF0ZShzb3VyY2UpXG4gICAgfVxufVxuXG5jbGFzcyBBU1RQYXJzZXJEZWZhdWx0IGV4dGVuZHMgQVNUUGFyc2VyIHtcblxufVxuXG5leHBvcnQgY2xhc3MgRGVsdmVuQVNUVmlzaXRvciBleHRlbmRzIERlbHZlblZpc2l0b3Ige1xuICAgIHByaXZhdGUgcnVsZVR5cGVNYXA6IE1hcDxudW1iZXIsIHN0cmluZz4gPSBuZXcgTWFwKCk7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5zZXR1cFR5cGVSdWxlcygpO1xuICAgIH1cblxuICAgIHByaXZhdGUgc2V0dXBUeXBlUnVsZXMoKXtcbiAgICAgICAgY29uc3Qga2V5cyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKEVDTUFTY3JpcHRQYXJzZXIpO1xuICAgICAgICBmb3IodmFyIGtleSBpbiBrZXlzKXtcbiAgICAgICAgICAgIGxldCBuYW1lID0ga2V5c1trZXldO1xuICAgICAgICAgICAgaWYobmFtZS5zdGFydHNXaXRoKCdSVUxFXycpKXtcbiAgICAgICAgICAgICAgICB0aGlzLnJ1bGVUeXBlTWFwLnNldChwYXJzZUludChFQ01BU2NyaXB0UGFyc2VyW25hbWVdKSwgbmFtZSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgZHVtcENvbnRleHQoY3R4OiBSdWxlQ29udGV4dCl7XG4gICAgICAgIGNvbnN0IGtleXMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhFQ01BU2NyaXB0UGFyc2VyKTtcbiAgICAgICAgbGV0IGNvbnRleHQgPSBbXVxuICAgICAgICBmb3IodmFyIGtleSBpbiBrZXlzKXtcbiAgICAgICAgICAgIGxldCBuYW1lID0ga2V5c1trZXldO1xuICAgICAgICAgICAgaWYobmFtZS5lbmRzV2l0aCgnQ29udGV4dCcpKXtcbiAgICAgICAgICAgICAgICBpZihjdHggaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyW25hbWVdKXtcbiAgICAgICAgICAgICAgICAgICAgY29udGV4dC5wdXNoKG5hbWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY29udGV4dDtcbiAgICB9XG5cbiAgICBwcml2YXRlIGR1bXBDb250ZXh0QWxsQ2hpbGRyZW4oY3R4OiBSdWxlQ29udGV4dCwgaW5kZW50Om51bWJlciA9IDApe1xuICAgICAgICBsZXQgcGFkID0gXCIgXCIucGFkU3RhcnQoaW5kZW50LCBcIlxcdFwiKTtcbiAgICAgICAgbGV0IG5vZGVzID0gdGhpcy5kdW1wQ29udGV4dChjdHgpO1xuICAgICAgICBpZihub2Rlcy5sZW5ndGggPiAwKXtcbiAgICAgICAgICAgIGNvbnNvbGUuaW5mbyhwYWQgKyBcIiAqIFwiICsgbm9kZXMpXG4gICAgICAgIH1cbiAgICAgICAgZm9yKGxldCBpID0gMDsgaSA8IGN0eC5nZXRDaGlsZENvdW50KCk7ICsraSlcbiAgICAgICAge1xuICAgICAgICAgICAgbGV0IGNoaWxkID0gY3R4Py5nZXRDaGlsZChpKTtcbiAgICAgICAgICAgIGlmKGNoaWxkKXtcbiAgICAgICAgICAgICAgICB0aGlzLmR1bXBDb250ZXh0QWxsQ2hpbGRyZW4oY2hpbGQsICsraW5kZW50KTtcbiAgICAgICAgICAgICAgICAtLWluZGVudDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBcbiAgICAvKipcbiAgICAgKiBHZXQgcnVsZSBuYW1lIGJ5IHRoZSBJZFxuICAgICAqIEBwYXJhbSBpZCBcbiAgICAgKi9cbiAgICBnZXRSdWxlQnlJZChpZDogbnVtYmVyKTogc3RyaW5nIHwgdW5kZWZpbmVkIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucnVsZVR5cGVNYXAuZ2V0KGlkKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFzTWFya2VyKG1ldGFkYXRhOiBhbnkpIHtcbiAgICAgICAgcmV0dXJuIHsgaW5kZXg6IDEsIGxpbmU6IDEsIGNvbHVtbjogMSB9O1xuICAgIH1cblxuICAgIHByaXZhdGUgZGVjb3JhdGUobm9kZTogYW55LCBtYXJrZXI6IE1hcmtlcik6IGFueSB7XG4gICAgICAgIG5vZGUuc3RhcnQgPSAwO1xuICAgICAgICBub2RlLmVuZCA9IDA7XG4gICAgICAgIHJldHVybiBub2RlO1xuICAgIH1cblxuICAgIHByaXZhdGUgdGhyb3dUeXBlRXJyb3IodHlwZUlkOiBhbnkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVW5oYW5kbGVkIHR5cGUgOiBcIiArIHR5cGVJZCArIFwiIDogXCIgKyB0aGlzLmdldFJ1bGVCeUlkKHR5cGVJZCkpO1xuICAgIH1cbiAgICBcbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNwcm9ncmFtLlxuICAgIHZpc2l0UHJvZ3JhbShjdHg6IEVDTUFTY3JpcHRQYXJzZXIuUHJvZ3JhbUNvbnRleHQpIHsgICAgICAgICAgICAgICAgXG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0UHJvZ3JhbSBbJXNdIDogWyVzXVwiLGN0eC5nZXRDaGlsZENvdW50KCksIGN0eC5nZXRUZXh0KCkpOyAgICAgICBcblxuICAgICAgICBcbiAgICAgICAgLy8gSW50ZXJ2YWwgeyBzdGFydDogMCwgc3RvcDogMCB9XG4gICAgICAgIGxldCBpbnRlcnZhbCA9IGN0eC5nZXRTb3VyY2VJbnRlcnZhbCgpO1xuICAgICAgICBjb25zb2xlLmluZm8oJ2ludGVydmFsIDogJXMnLCBKU09OLnN0cmluZ2lmeShpbnRlcnZhbCkpXG4gICAgICAgIC8vIHZpc2l0UHJvZ3JhbSAtPnZpc2l0U291cmNlRWxlbWVudHMgLT4gdmlzaXRTb3VyY2VFbGVtZW50IC0+IHZpc2l0U3RhdGVtZW50XG4gICAgICAgIGxldCBzdGF0ZW1lbnRzOiBhbnkgPSBbXTtcbiAgICAgICAgaWYgKGN0eC5nZXRDaGlsZENvdW50KCkgPiAxKSB7IC8vIGV4Y2x1ZGUgPEVPRj5cbiAgICAgICAgICAgIGlmIChjdHguZ2V0Q2hpbGQoMCkuZ2V0Q2hpbGRDb3VudCgpID4gMCkge1xuICAgICAgICAgICAgICAgIGxldCBub2RlID0gY3R4LmdldENoaWxkKDApLmdldENoaWxkKDApLmdldENoaWxkKDApO1xuICAgICAgICAgICAgICAgIGxldCBzdGF0ZW1lbnQgPSB0aGlzLnZpc2l0U3RhdGVtZW50KG5vZGUpO1xuICAgICAgICAgICAgICAgIHN0YXRlbWVudHMucHVzaChzdGF0ZW1lbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHNjcmlwdCA9IG5ldyBTY3JpcHQoc3RhdGVtZW50cyk7XG4gICAgICAgIHJldHVybiB0aGlzLmRlY29yYXRlKHNjcmlwdCwgdGhpcy5hc01hcmtlcih0aGlzLmFzTWV0YWRhdGEoaW50ZXJ2YWwpKSk7XG4gICAgfTtcblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI3N0YXRlbWVudC5cbiAgICB2aXNpdFN0YXRlbWVudChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0U3RhdGVtZW50IFslc10gOiAlc1wiLCBjdHguZ2V0Q2hpbGRDb3VudCgpLCBjdHguZ2V0VGV4dCgpKTtcbiAgICAgICAgdGhpcy5kdW1wQ29udGV4dEFsbENoaWxkcmVuKGN0eCk7XG4gICAgICAgIGlmIChjdHguZ2V0Q2hpbGRDb3VudCgpICE9IDEpIHtcbiAgICAgICAgIC8vICAgdGhyb3cgbmV3IEVycm9yKFwiV3JvbmcgY2hpbGQgY291bnQsIGV4cGVjdGVkIDEgZ290IDogXCIgKyBjdHguZ2V0Q2hpbGRDb3VudCgpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBub2RlOiBSdWxlQ29udGV4dCA9IGN0eC5nZXRDaGlsZCgwKTtcbiAgICAgICBcbiAgICAgICAgbGV0IHR5cGUgPSBub2RlLnJ1bGVJbmRleDtcbiAgICAgICAgaWYgKHR5cGUgPT0gRUNNQVNjcmlwdFBhcnNlci5SVUxFX2Jsb2NrKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy52aXNpdEJsb2NrKG5vZGUpO1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGUgPT0gRUNNQVNjcmlwdFBhcnNlci5SVUxFX2V4cHJlc3Npb25TdGF0ZW1lbnQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnZpc2l0RXhwcmVzc2lvblN0YXRlbWVudChub2RlKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHsgICAgICAgICAgICBcbiAgICAgICAgICAgIHRoaXMudGhyb3dUeXBlRXJyb3IodHlwZSlcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNibG9jay5cbiAgICB2aXNpdEJsb2NrKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS5pbmZvKFwidmlzaXRCbG9jazogXCIgKyBjdHguZ2V0VGV4dCgpICsgXCIgPT0gXCIgKyBjdHgpO1xuICAgICAgICBsZXQgYm9keSA9IFtdO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGN0eC5nZXRDaGlsZENvdW50KCk7ICsraSkge1xuICAgICAgICAgICAgbGV0IG5vZGU6IFJ1bGVDb250ZXh0ID0gY3R4LmdldENoaWxkKGkpO1xuICAgICAgICAgICAgbGV0IHR5cGUgPSBub2RlLnJ1bGVJbmRleDtcbiAgICAgICAgICAgIGlmICh0eXBlID09IEVDTUFTY3JpcHRQYXJzZXIuUlVMRV9zdGF0ZW1lbnRMaXN0KSB7XG4gICAgICAgICAgICAgICAgbGV0IHN0YXRlbWVudExpc3QgPSB0aGlzLnZpc2l0U3RhdGVtZW50TGlzdChub2RlKTtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpbmRleCBpbiBzdGF0ZW1lbnRMaXN0KSB7XG4gICAgICAgICAgICAgICAgICAgIGJvZHkucHVzaChzdGF0ZW1lbnRMaXN0W2luZGV4XSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlID09IEVDTUFTY3JpcHRQYXJzZXIuUlVMRV9leHByZXNzaW9uU3RhdGVtZW50KSB7XG4gICAgICAgICAgICAgICAgbGV0IGV4cHJlc3Npb24gPSB0aGlzLnZpc2l0RXhwcmVzc2lvblN0YXRlbWVudChub2RlKTtcbiAgICAgICAgICAgICAgICBib2R5LnB1c2goZXhwcmVzc2lvbik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmICh0eXBlID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7ICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHRoaXMudGhyb3dUeXBlRXJyb3IodHlwZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBUT0RPIDogSW1wbGVtZW50IG1lXG4gICAgICAgIHJldHVybiBuZXcgQmxvY2tTdGF0ZW1lbnQoYm9keSk7XG4gICAgfTtcblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjc3RhdGVtZW50TGlzdC5cbiAgICB2aXNpdFN0YXRlbWVudExpc3QoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJ2aXNpdFN0YXRlbWVudExpc3Q6IFwiICsgY3R4LmdldFRleHQoKSk7XG4gICAgICAgIGxldCBib2R5ID0gW107XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY3R4LmdldENoaWxkQ291bnQoKTsgKytpKSB7XG4gICAgICAgICAgICBsZXQgbm9kZTogUnVsZUNvbnRleHQgPSBjdHguZ2V0Q2hpbGQoaSk7XG4gICAgICAgICAgICBsZXQgdHlwZSA9IG5vZGUucnVsZUluZGV4O1xuICAgICAgICAgICAgaWYgKHR5cGUgPT0gRUNNQVNjcmlwdFBhcnNlci5SVUxFX3N0YXRlbWVudCkge1xuICAgICAgICAgICAgICAgIGxldCBzdGF0ZW1lbnQ6IGFueSA9IHRoaXMudmlzaXRTdGF0ZW1lbnQobm9kZSk7XG4gICAgICAgICAgICAgICAgYm9keS5wdXNoKHN0YXRlbWVudCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGUgPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnRocm93VHlwZUVycm9yKHR5cGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBib2R5O1xuICAgIH07XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciN2YXJpYWJsZVN0YXRlbWVudC5cbiAgICB2aXNpdFZhcmlhYmxlU3RhdGVtZW50KGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS5pbmZvKFwidmlzaXRWYXJpYWJsZVN0YXRlbWVudDogXCIgKyBjdHguZ2V0VGV4dCgpKTtcbiAgICAgICAgXG4gICAgfTtcblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjdmFyaWFibGVEZWNsYXJhdGlvbkxpc3QuXG4gICAgdmlzaXRWYXJpYWJsZURlY2xhcmF0aW9uTGlzdChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0VmFyaWFibGVEZWNsYXJhdGlvbkxpc3Q6IFwiICsgY3R4LmdldFRleHQoKSk7XG5cbiAgICB9O1xuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciN2YXJpYWJsZURlY2xhcmF0aW9uLlxuICAgIHZpc2l0VmFyaWFibGVEZWNsYXJhdGlvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0VmFyaWFibGVEZWNsYXJhdGlvbjogXCIgKyBjdHguZ2V0VGV4dCgpKTtcblxuICAgIH07XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2luaXRpYWxpc2VyLlxuICAgIHZpc2l0SW5pdGlhbGlzZXIoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJ2aXNpdEluaXRpYWxpc2VyOiBcIiArIGN0eC5nZXRUZXh0KCkpO1xuICAgIH07XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2VtcHR5U3RhdGVtZW50LlxuICAgIHZpc2l0RW1wdHlTdGF0ZW1lbnQoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJ2aXNpdEVtcHR5U3RhdGVtZW50WFg6IFwiICsgY3R4LmdldFRleHQoKSk7XG4gICAgfTtcblxuICAgIHByaXZhdGUgZ2V0UnVsZVR5cGUobm9kZTphbnksIGluZGV4Om51bWJlcikgOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gbm9kZS5nZXRDaGlsZChpbmRleCkucnVsZUluZGV4O1xuICAgIH1cbiAgICBcbiAgICBwcml2YXRlIGFzc2VydE5vZGVDb3VudChjdHg6IFJ1bGVDb250ZXh0LCBjb3VudDogbnVtYmVyKSB7XG4gICAgICAgIGlmIChjdHguZ2V0Q2hpbGRDb3VudCgpICE9IGNvdW50KSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJXcm9uZyBjaGlsZCBjb3VudCwgZXhwZWN0ZWQgMSBnb3QgOiBcIiArIGN0eC5nZXRDaGlsZENvdW50KCkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjZXhwcmVzc2lvblN0YXRlbWVudC5cbiAgICB2aXNpdEV4cHJlc3Npb25TdGF0ZW1lbnQoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJ2aXNpdEV4cHJlc3Npb25TdGF0ZW1lbnQ6IFwiICsgY3R4LmdldFRleHQoKSk7XG4gICAgICAgIHRoaXMuYXNzZXJ0Tm9kZUNvdW50KGN0eCwgMSk7XG5cbiAgICAgICAgLy8gdmlzaXRFeHByZXNzaW9uU3RhdGVtZW50Oj52aXNpdEV4cHJlc3Npb25TZXF1ZW5jZTo+dmlzaXRMaXRlcmFsRXhwcmVzc2lvblxuICAgICAgICBsZXQgbm9kZTogUnVsZUNvbnRleHQgPSBjdHguZ2V0Q2hpbGQoMCk7IC8vIHZpc2l0RXhwcmVzc2lvblNlcXVlbmNlIFxuICAgICAgICBsZXQgc2VxdWVuY2UgPSB0aGlzLnZpc2l0RXhwcmVzc2lvblNlcXVlbmNlKG5vZGUpO1xuICAgICAgICByZXR1cm4gc2VxdWVuY2U7XG4gICAgfVxuICAgIFxuICAgIHByaXZhdGUgYXNNZXRhZGF0YShpbnRlcnZhbDogSW50ZXJ2YWwpOiBhbnkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgc3RhcnQ6IHtcbiAgICAgICAgICAgICAgICBsaW5lOiAxLFxuICAgICAgICAgICAgICAgIGNvbHVtbjogaW50ZXJ2YWwuc3RhcnQsXG4gICAgICAgICAgICAgICAgb2Zmc2V0OiAwXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZW5kOiB7XG4gICAgICAgICAgICAgICAgbGluZTogMSxcbiAgICAgICAgICAgICAgICBjb2x1bW46IGludGVydmFsLnN0b3AsXG4gICAgICAgICAgICAgICAgb2Zmc2V0OiAzXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNpZlN0YXRlbWVudC5cbiAgICB2aXNpdElmU3RhdGVtZW50KGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS5pbmZvKFwidmlzaXRJZlN0YXRlbWVudDogXCIgKyBjdHguZ2V0VGV4dCgpKTtcbiAgICAgICAgXG4gICAgfTtcblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjRG9TdGF0ZW1lbnQuXG4gICAgdmlzaXREb1N0YXRlbWVudChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0RG9TdGF0ZW1lbnQ6IFwiICsgY3R4LmdldFRleHQoKSk7XG4gICAgICAgIFxuICAgIH07XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI1doaWxlU3RhdGVtZW50LlxuICAgIHZpc2l0V2hpbGVTdGF0ZW1lbnQoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJ2aXNpdFdoaWxlU3RhdGVtZW50OiBcIiArIGN0eC5nZXRUZXh0KCkpO1xuICAgICAgICBcbiAgICB9O1xuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNGb3JTdGF0ZW1lbnQuXG4gICAgdmlzaXRGb3JTdGF0ZW1lbnQoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJ2aXNpdFdoaWxlU3RhdGVtZW50OiBcIiArIGN0eC5nZXRUZXh0KCkpO1xuICAgICAgICBcbiAgICB9O1xuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNGb3JWYXJTdGF0ZW1lbnQuXG4gICAgdmlzaXRGb3JWYXJTdGF0ZW1lbnQoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgICAgICBcbiAgICB9O1xuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNGb3JJblN0YXRlbWVudC5cbiAgICB2aXNpdEZvckluU3RhdGVtZW50KGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICAgICAgXG4gICAgfTtcblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjRm9yVmFySW5TdGF0ZW1lbnQuXG4gICAgdmlzaXRGb3JWYXJJblN0YXRlbWVudChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gICAgICAgIFxuICAgIH07XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2NvbnRpbnVlU3RhdGVtZW50LlxuICAgIHZpc2l0Q29udGludWVTdGF0ZW1lbnQoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgICAgICBcbiAgICB9O1xuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNicmVha1N0YXRlbWVudC5cbiAgICB2aXNpdEJyZWFrU3RhdGVtZW50KGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICAgICAgXG4gICAgfTtcblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjcmV0dXJuU3RhdGVtZW50LlxuICAgIHZpc2l0UmV0dXJuU3RhdGVtZW50KGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICAgICAgXG4gICAgfTtcblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjd2l0aFN0YXRlbWVudC5cbiAgICB2aXNpdFdpdGhTdGF0ZW1lbnQoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgICAgICBcbiAgICB9O1xuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNzd2l0Y2hTdGF0ZW1lbnQuXG4gICAgdmlzaXRTd2l0Y2hTdGF0ZW1lbnQoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgICAgICBcbiAgICB9O1xuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNjYXNlQmxvY2suXG4gICAgdmlzaXRDYXNlQmxvY2soY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgICAgICBcbiAgICB9O1xuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNjYXNlQ2xhdXNlcy5cbiAgICB2aXNpdENhc2VDbGF1c2VzKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICAgICAgXG4gICAgfTtcblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjY2FzZUNsYXVzZS5cbiAgICB2aXNpdENhc2VDbGF1c2UoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgICAgICBcbiAgICB9O1xuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNkZWZhdWx0Q2xhdXNlLlxuICAgIHZpc2l0RGVmYXVsdENsYXVzZShjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gICAgICAgIFxuICAgIH07XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2xhYmVsbGVkU3RhdGVtZW50LlxuICAgIHZpc2l0TGFiZWxsZWRTdGF0ZW1lbnQoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgICAgICBcbiAgICB9O1xuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciN0aHJvd1N0YXRlbWVudC5cbiAgICB2aXNpdFRocm93U3RhdGVtZW50KGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICAgICAgXG4gICAgfTtcblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjdHJ5U3RhdGVtZW50LlxuICAgIHZpc2l0VHJ5U3RhdGVtZW50KGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICAgICAgXG4gICAgfTtcblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjY2F0Y2hQcm9kdWN0aW9uLlxuICAgIHZpc2l0Q2F0Y2hQcm9kdWN0aW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICAgICAgXG4gICAgfTtcblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjZmluYWxseVByb2R1Y3Rpb24uXG4gICAgdmlzaXRGaW5hbGx5UHJvZHVjdGlvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gICAgICAgIFxuICAgIH07XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2RlYnVnZ2VyU3RhdGVtZW50LlxuICAgIHZpc2l0RGVidWdnZXJTdGF0ZW1lbnQoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgICAgICBcbiAgICB9O1xuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNmdW5jdGlvbkRlY2xhcmF0aW9uLlxuICAgIHZpc2l0RnVuY3Rpb25EZWNsYXJhdGlvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gICAgICAgIFxuICAgIH07XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2Zvcm1hbFBhcmFtZXRlckxpc3QuXG4gICAgdmlzaXRGb3JtYWxQYXJhbWV0ZXJMaXN0KGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICAgICAgXG4gICAgfTtcblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjZnVuY3Rpb25Cb2R5LlxuICAgIHZpc2l0RnVuY3Rpb25Cb2R5KGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS5pbmZvKFwidmlzaXRGdW5jdGlvbkJvZHk6IFwiICsgY3R4LmdldFRleHQoKSk7XG5cbiAgICAgICAgXG4gICAgfTtcblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjYXJyYXlMaXRlcmFsLlxuICAgIHZpc2l0QXJyYXlMaXRlcmFsKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICAgICAgXG4gICAgfTtcblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjZWxlbWVudExpc3QuXG4gICAgdmlzaXRFbGVtZW50TGlzdChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gICAgICAgIFxuICAgIH07XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2VsaXNpb24uXG4gICAgdmlzaXRFbGlzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICAgICAgXG4gICAgfTtcblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjb2JqZWN0TGl0ZXJhbC5cbiAgICB2aXNpdE9iamVjdExpdGVyYWwoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgICAgICBcbiAgICB9O1xuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNwcm9wZXJ0eU5hbWVBbmRWYWx1ZUxpc3QuXG4gICAgdmlzaXRQcm9wZXJ0eU5hbWVBbmRWYWx1ZUxpc3QoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgICAgICBcbiAgICB9O1xuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNQcm9wZXJ0eUV4cHJlc3Npb25Bc3NpZ25tZW50LlxuICAgIHZpc2l0UHJvcGVydHlFeHByZXNzaW9uQXNzaWdubWVudChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gICAgICAgIFxuICAgIH07XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI1Byb3BlcnR5R2V0dGVyLlxuICAgIHZpc2l0UHJvcGVydHlHZXR0ZXIoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgICAgICBcbiAgICB9O1xuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNQcm9wZXJ0eVNldHRlci5cbiAgICB2aXNpdFByb3BlcnR5U2V0dGVyKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICAgICAgXG4gICAgfTtcblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjcHJvcGVydHlOYW1lLlxuICAgIHZpc2l0UHJvcGVydHlOYW1lKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICAgICAgXG4gICAgfTtcblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjcHJvcGVydHlTZXRQYXJhbWV0ZXJMaXN0LlxuICAgIHZpc2l0UHJvcGVydHlTZXRQYXJhbWV0ZXJMaXN0KGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICAgICAgXG4gICAgfTtcblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjYXJndW1lbnRzLlxuICAgIHZpc2l0QXJndW1lbnRzKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS5pbmZvKFwidmlzaXRBcmd1bWVudHM6IFwiICsgY3R4LmdldFRleHQoKSk7XG4gICAgICAgIFxuICAgIH07XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2FyZ3VtZW50TGlzdC5cbiAgICB2aXNpdEFyZ3VtZW50TGlzdChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0QXJndW1lbnRMaXN0OiBcIiArIGN0eC5nZXRUZXh0KCkpO1xuICAgIH07XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNleHByZXNzaW9uU2VxdWVuY2UuXG4gICAgdmlzaXRFeHByZXNzaW9uU2VxdWVuY2UoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJ2aXNpdEV4cHJlc3Npb25TZXF1ZW5jZSBbJXNdIDogWyVzXVwiLCBjdHguZ2V0Q2hpbGRDb3VudCgpLCBjdHguZ2V0VGV4dCgpKTtcblxuICAgICAgICB0aGlzLmR1bXBDb250ZXh0QWxsQ2hpbGRyZW4oY3R4KTtcblxuICAgICAgICBpZih0cnVlKVxuICAgICAgICAgICAgcmV0dXJuO1xuXG5cbiAgICAgICAgbGV0IG5vZGUgPSBjdHg7XG4gICAgICAgIGxldCBjb3VudCA9IG5vZGUuZ2V0Q2hpbGRDb3VudCgpO1xuICAgICAgICBsZXQgaW50ZXJ2YWwgPSBub2RlLmdldFNvdXJjZUludGVydmFsKCk7XG4gICAgICAgIGxldCBleHByZXNzaW9uczpbXSA9IFtdO1xuXG4gICAgICAgIHRoaXMuZHVtcENvbnRleHQoY3R4KVxuICAgICAgICBsZXQgY2hpbGQgID0gbm9kZS5nZXRDaGlsZCgwKTtcbiAgICAgICAgaWYoY2hpbGQgaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLkFzc2lnbm1lbnRFeHByZXNzaW9uQ29udGV4dClcbiAgICAgICAge1xuICAgICAgICAgICAgY29uc29sZS5pbmZvKFwiQVNTSUdNRU5UIDo6IFwiIClcbiAgICAgICAgfVxuXG4gICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCBjb3VudDsgKytpKXtcbiAgICAgICAgICAgIGxldCBjaGlsZCA9IG5vZGUuZ2V0Q2hpbGQoaSk7XG4gICAgICAgICAgICBsZXQgdHlwZUlkID0gY2hpbGQucnVsZUluZGV4O1xuICAgICAgICAgICAgbGV0IHR5cGUgID0gdGhpcy5nZXRSdWxlQnlJZCh0eXBlSWQpO1xuXG4gICAgICAgICAgICBjb25zb2xlLmluZm8oXCIqKiogXCIgKyB0eXBlKVxuICAgICAgICAgICAgaWYodHlwZUlkID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfWVsc2UgaWYgKHR5cGVJZCA9PSBFQ01BU2NyaXB0UGFyc2VyLlJVTEVfc2luZ2xlRXhwcmVzc2lvbikgeyAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGxldCBsaXRlcmFsID0gdGhpcy52aXNpdExpdGVyYWxFeHByZXNzaW9uKGNoaWxkKTsgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgZXhwcmVzc2lvbnMucHVzaChsaXRlcmFsKTtcbiAgICAgICAgICAgIH0gIFxuICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMudGhyb3dUeXBlRXJyb3IodHlwZUlkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBzZXF1ZW5jZSA9IG5ldyBTZXF1ZW5jZUV4cHJlc3Npb24oZXhwcmVzc2lvbnMpOyAgIFxuICAgICAgICByZXR1cm4gdGhpcy5kZWNvcmF0ZShzZXF1ZW5jZSwgdGhpcy5hc01hcmtlcih0aGlzLmFzTWV0YWRhdGEoY3R4LmdldFNvdXJjZUludGVydmFsKCkpKSlcbiAgICB9O1xuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNUZXJuYXJ5RXhwcmVzc2lvbi5cbiAgICB2aXNpdFRlcm5hcnlFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICAgICAgXG4gICAgfTtcblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjTG9naWNhbEFuZEV4cHJlc3Npb24uXG4gICAgdmlzaXRMb2dpY2FsQW5kRXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gICAgICAgIFxuICAgIH07XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI1ByZUluY3JlbWVudEV4cHJlc3Npb24uXG4gICAgdmlzaXRQcmVJbmNyZW1lbnRFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICAgICAgXG4gICAgfTtcblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjT2JqZWN0TGl0ZXJhbEV4cHJlc3Npb24uXG4gICAgdmlzaXRPYmplY3RMaXRlcmFsRXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gICAgICAgIFxuICAgIH07XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI0luRXhwcmVzc2lvbi5cbiAgICB2aXNpdEluRXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gICAgICAgIFxuICAgIH07XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI0xvZ2ljYWxPckV4cHJlc3Npb24uXG4gICAgdmlzaXRMb2dpY2FsT3JFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICAgICAgXG4gICAgfTtcblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjTm90RXhwcmVzc2lvbi5cbiAgICB2aXNpdE5vdEV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgICAgICBcbiAgICB9O1xuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNQcmVEZWNyZWFzZUV4cHJlc3Npb24uXG4gICAgdmlzaXRQcmVEZWNyZWFzZUV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgICAgICBcbiAgICB9O1xuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNBcmd1bWVudHNFeHByZXNzaW9uLlxuICAgIHZpc2l0QXJndW1lbnRzRXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0QXJndW1lbnRzRXhwcmVzc2lvbjogXCIgKyBjdHguZ2V0VGV4dCgpKTtcblxuICAgICAgICBcbiAgICB9O1xuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNUaGlzRXhwcmVzc2lvbi5cbiAgICB2aXNpdFRoaXNFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICAgICAgXG4gICAgfTtcblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjRnVuY3Rpb25FeHByZXNzaW9uLlxuICAgIHZpc2l0RnVuY3Rpb25FeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICAgICAgXG4gICAgfTtcblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjVW5hcnlNaW51c0V4cHJlc3Npb24uXG4gICAgdmlzaXRVbmFyeU1pbnVzRXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gICAgICAgIFxuICAgIH07XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI1Bvc3REZWNyZWFzZUV4cHJlc3Npb24uXG4gICAgdmlzaXRQb3N0RGVjcmVhc2VFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICAgICAgXG4gICAgfTtcblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjQXNzaWdubWVudEV4cHJlc3Npb24uXG4gICAgdmlzaXRBc3NpZ25tZW50RXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gICAgICAgIFxuICAgIH07XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI1R5cGVvZkV4cHJlc3Npb24uXG4gICAgdmlzaXRUeXBlb2ZFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICAgICAgXG4gICAgfTtcblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjSW5zdGFuY2VvZkV4cHJlc3Npb24uXG4gICAgdmlzaXRJbnN0YW5jZW9mRXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gICAgICAgIFxuICAgIH07XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI1VuYXJ5UGx1c0V4cHJlc3Npb24uXG4gICAgdmlzaXRVbmFyeVBsdXNFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICAgICAgXG4gICAgfTtcblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjRGVsZXRlRXhwcmVzc2lvbi5cbiAgICB2aXNpdERlbGV0ZUV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgICAgICBcbiAgICB9O1xuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNFcXVhbGl0eUV4cHJlc3Npb24uXG4gICAgdmlzaXRFcXVhbGl0eUV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgICAgICBcbiAgICB9O1xuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNCaXRYT3JFeHByZXNzaW9uLlxuICAgIHZpc2l0Qml0WE9yRXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gICAgICAgIFxuICAgIH07XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI011bHRpcGxpY2F0aXZlRXhwcmVzc2lvbi5cbiAgICB2aXNpdE11bHRpcGxpY2F0aXZlRXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gICAgICAgIFxuICAgIH07XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI0JpdFNoaWZ0RXhwcmVzc2lvbi5cbiAgICB2aXNpdEJpdFNoaWZ0RXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gICAgICAgIFxuICAgIH07XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI1BhcmVudGhlc2l6ZWRFeHByZXNzaW9uLlxuICAgIHZpc2l0UGFyZW50aGVzaXplZEV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJ2aXNpdFBhcmVudGhlc2l6ZWRFeHByZXNzaW9uOiBcIiArIGN0eC5nZXRUZXh0KCkpO1xuXG4gICAgICAgIFxuICAgIH07XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI0FkZGl0aXZlRXhwcmVzc2lvbi5cbiAgICB2aXNpdEFkZGl0aXZlRXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0QWRkaXRpdmVFeHByZXNzaW9uOiBcIiArIGN0eC5nZXRUZXh0KCkpO1xuICAgICAgICBcbiAgICB9O1xuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNSZWxhdGlvbmFsRXhwcmVzc2lvbi5cbiAgICB2aXNpdFJlbGF0aW9uYWxFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICAgICAgXG4gICAgfTtcblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjUG9zdEluY3JlbWVudEV4cHJlc3Npb24uXG4gICAgdmlzaXRQb3N0SW5jcmVtZW50RXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gICAgICAgIFxuICAgIH07XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI0JpdE5vdEV4cHJlc3Npb24uXG4gICAgdmlzaXRCaXROb3RFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICAgICAgXG4gICAgfTtcblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjTmV3RXhwcmVzc2lvbi5cbiAgICB2aXNpdE5ld0V4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgICAgICBcbiAgICB9O1xuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNMaXRlcmFsRXhwcmVzc2lvbi5cbiAgICB2aXNpdExpdGVyYWxFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS5pbmZvKFwidmlzaXRMaXRlcmFsRXhwcmVzc2lvbiBbJXNdIDogWyVzXVwiLGN0eC5nZXRDaGlsZENvdW50KCksIGN0eC5nZXRUZXh0KCkpO1xuICAgICAgICB0aGlzLmFzc2VydE5vZGVDb3VudChjdHgsIDEpO1xuICAgICAgICAvLyB2aXNpdExpdGVyYWxFeHByZXNzaW9uOiA+IHZpc2l0TGl0ZXJhbFxuICAgICAgICByZXR1cm4gdGhpcy52aXNpdExpdGVyYWwoY3R4LmdldENoaWxkKDApKVxuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI0FycmF5TGl0ZXJhbEV4cHJlc3Npb24uXG4gICAgdmlzaXRBcnJheUxpdGVyYWxFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICAgICAgXG4gICAgfTtcblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjTWVtYmVyRG90RXhwcmVzc2lvbi5cbiAgICB2aXNpdE1lbWJlckRvdEV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJ2aXNpdE1lbWJlckRvdEV4cHJlc3Npb246IFwiICsgY3R4LmdldFRleHQoKSk7XG4gICAgICAgIFxuICAgIH07XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI01lbWJlckluZGV4RXhwcmVzc2lvbi5cbiAgICB2aXNpdE1lbWJlckluZGV4RXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gICAgICAgIFxuICAgIH07XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI0lkZW50aWZpZXJFeHByZXNzaW9uLlxuICAgIHZpc2l0SWRlbnRpZmllckV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJ2aXNpdElkZW50aWZpZXJFeHByZXNzaW9uOiBcIiArIGN0eC5nZXRUZXh0KCkpO1xuXG4gICAgICAgIFxuICAgIH07XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI0JpdEFuZEV4cHJlc3Npb24uXG4gICAgdmlzaXRCaXRBbmRFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICAgICAgXG4gICAgfTtcblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjQml0T3JFeHByZXNzaW9uLlxuICAgIHZpc2l0Qml0T3JFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICAgICAgXG4gICAgfTtcblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjQXNzaWdubWVudE9wZXJhdG9yRXhwcmVzc2lvbi5cbiAgICB2aXNpdEFzc2lnbm1lbnRPcGVyYXRvckV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgICAgICBcbiAgICB9O1xuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNWb2lkRXhwcmVzc2lvbi5cbiAgICB2aXNpdFZvaWRFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICAgICAgXG4gICAgfTtcblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2Fzc2lnbm1lbnRPcGVyYXRvci5cbiAgICB2aXNpdEFzc2lnbm1lbnRPcGVyYXRvcihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0QXNzaWdubWVudE9wZXJhdG9yOiBcIiArIGN0eC5nZXRUZXh0KCkpO1xuICAgICAgICBcbiAgICB9O1xuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjbGl0ZXJhbC5cbiAgICB2aXNpdExpdGVyYWwoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJ2aXNpdExpdGVyYWwgWyVzXSA6IFslc11cIixjdHguZ2V0Q2hpbGRDb3VudCgpLCBjdHguZ2V0VGV4dCgpKTtcbiAgICAgICAgdGhpcy5hc3NlcnROb2RlQ291bnQoY3R4LCAxKTtcbiAgICAgICAgbGV0IG5vZGU6IFJ1bGVDb250ZXh0ID0gY3R4LmdldENoaWxkKDApO1xuICAgICAgICBsZXQgdHlwZUlkID0gbm9kZS5ydWxlSW5kZXg7XG4gICAgICAgIGxldCBjb3VudCA9IG5vZGUuZ2V0Q2hpbGRDb3VudCgpOyBcbiAgICAgICAgY29uc29sZS5pbmZvKCd0eXBlSWQgJyArIHR5cGVJZCArIFwiIGNvdW50ID0gXCIgKyBjb3VudClcbiAgICAgICAgLy8gIHZpc2l0TGl0ZXJhbFxuICAgICAgICBpZihjb3VudCA9PSAwKSB7IFxuICAgICAgICAgICAgaWYodHlwZUlkID09IHVuZGVmaW5lZCl7IC8vIFRlcm1pbmFsTm9kZVxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmNyZWF0ZUxpdGVyYWxWYWx1ZShub2RlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmKGNvdW50ID09IDEpIHsgXG4gICAgICAgICAgICAvLyBvbmx5IFJVTEVfbnVtZXJpY0xpdGVyYWwgcGFyc2VkIHJpZ2h0IG5vdyA/P1xuICAgICAgICAgICAgbGV0IGNvdW50ID0gY3R4LmdldENoaWxkQ291bnQoKTtcbiAgICAgICAgICAgIGxldCBub2RlOiBSdWxlQ29udGV4dCA9IGN0eC5nZXRDaGlsZCgwKTtcbiAgICAgICAgICAgIGxldCBleHByZXNzaW9uID0gbm9kZS5nZXRDaGlsZCgwKTtcbiAgICAgICAgICAgIGxldCBleHByZXNzaW9uSWQgPSBleHByZXNzaW9uLnJ1bGVJbmRleDtcbiAgICAgICAgICAgIGlmIChleHByZXNzaW9uSWQgPT0gRUNNQVNjcmlwdFBhcnNlci5SVUxFX251bWVyaWNMaXRlcmFsKSB7ICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMudmlzaXROdW1lcmljTGl0ZXJhbChjdHgpOyAgICAgICAgICAgIFxuICAgICAgICAgICAgfSBcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMudGhyb3dUeXBlRXJyb3IodHlwZUlkKTtcbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI251bWVyaWNMaXRlcmFsLlxuICAgIHZpc2l0TnVtZXJpY0xpdGVyYWwoY3R4OiBSdWxlQ29udGV4dCkgeyAgICAgICAgXG4gICAgICAgIHJldHVybiB0aGlzLmNyZWF0ZUxpdGVyYWxWYWx1ZShjdHgpO1xuICAgIH1cbiAgICBcbiAgICBjcmVhdGVMaXRlcmFsVmFsdWUoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJjcmVhdGVMaXRlcmFsVmFsdWUgWyVzXTogWyVzXVwiLCBjdHguZ2V0Q2hpbGRDb3VudCgpLCBjdHguZ2V0VGV4dCgpKTtcbiAgICAgICAgbGV0IHZhbHVlID0gY3R4LmdldFRleHQoKTtcbiAgICAgICAgbGV0IGxpdGVyYWwgPSBuZXcgTGl0ZXJhbCh2YWx1ZSwgdmFsdWUpO1xuICAgICAgICByZXR1cm4gdGhpcy5kZWNvcmF0ZShsaXRlcmFsLCB0aGlzLmFzTWFya2VyKHRoaXMuYXNNZXRhZGF0YShjdHguZ2V0U291cmNlSW50ZXJ2YWwoKSkpKVxuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2lkZW50aWZpZXJOYW1lLlxuICAgIHZpc2l0SWRlbnRpZmllck5hbWUoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJ2aXNpdElkZW50aWZpZXJOYW1lOiBcIiArIGN0eC5nZXRUZXh0KCkpO1xuICAgIH07XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI3Jlc2VydmVkV29yZC5cbiAgICB2aXNpdFJlc2VydmVkV29yZChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0UmVzZXJ2ZWRXb3JkOiBcIiArIGN0eC5nZXRUZXh0KCkpO1xuXG4gICAgICAgIFxuICAgIH07XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2tleXdvcmQuXG4gICAgdmlzaXRLZXl3b3JkKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS5pbmZvKFwidmlzaXRLZXl3b3JkOiBcIiArIGN0eC5nZXRUZXh0KCkpO1xuXG4gICAgICAgIFxuICAgIH07XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2Z1dHVyZVJlc2VydmVkV29yZC5cbiAgICB2aXNpdEZ1dHVyZVJlc2VydmVkV29yZChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gICAgICAgIFxuICAgIH07XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2dldHRlci5cbiAgICB2aXNpdEdldHRlcihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gICAgICAgIFxuICAgIH07XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI3NldHRlci5cbiAgICB2aXNpdFNldHRlcihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gICAgICAgIFxuICAgIH07XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNlb3MuXG4gICAgdmlzaXRFb3MoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICAvL2NvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gICAgICAgIFxuICAgIH07XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNlb2YuXG4gICAgdmlzaXRFb2YoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgICAgICBcbiAgICB9O1xuXG59Il19