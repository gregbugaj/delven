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
    throw new TypeError("Unhandled type : " + typeId + " : " + this.getRuleById(typeId));
  }
  /**
   * Throw TypeError only when there is a type provided. 
   * This is usefull when there node ita TerminalNode 
   * @param type 
   */


  throwInsanceError(type) {
    /*         if (type == undefined || type == "") {
               return;
            } */
    throw new TypeError("Unhandled instance type : " + type);
  }

  assertType(ctx, type) {
    if (!(ctx instanceof type)) {
      throw new TypeError("Invalid type expected : '" + type.name + "' received '" + this.dumpContext(ctx)) + "'";
    }
  } // Visit a parse tree produced by ECMAScriptParser#program.


  visitProgram(ctx) {
    console.info("visitProgram [%s] : %s", ctx.getChildCount(), ctx.getText()); // visitProgram ->visitSourceElements -> visitSourceElement -> visitStatement

    let statements = [];
    let node = ctx.getChild(0); // visitProgram ->visitSourceElements 

    for (let i = 0; i < node.getChildCount(); ++i) {
      let stm = node.getChild(i).getChild(0); // SourceElementsContext > StatementContext

      if (stm instanceof _ECMAScriptParser.ECMAScriptParser.StatementContext) {
        let statement = this.visitStatement(stm);
        statements.push(statement);
      } else {
        this.throwInsanceError(this.dumpContext(stm));
      }
    }

    let interval = ctx.getSourceInterval();
    let script = new _nodes.Script(statements);
    return this.decorate(script, this.asMarker(this.asMetadata(interval)));
  } // Visit a parse tree produced by ECMAScriptParser#statement.


  visitStatement(ctx) {
    this.assertType(ctx, _ECMAScriptParser.ECMAScriptParser.StatementContext);
    console.info("visitStatement [%s] : %s", ctx.getChildCount(), ctx.getText());
    let node = ctx.getChild(0);

    if (node instanceof _ECMAScriptParser.ECMAScriptParser.ExpressionStatementContext) {
      return this.visitExpressionStatement(node);
    } else if (node instanceof _ECMAScriptParser.ECMAScriptParser.VariableStatementContext) {
      return this.visitVariableStatement(node);
    } else if (node instanceof _ECMAScriptParser.ECMAScriptParser.BlockContext) {
      return this.visitBlock(node);
    } else if (node instanceof _ECMAScriptParser.ECMAScriptParser.EmptyStatementContext) {// NOOP,
      // var x;
    } else {
      this.throwInsanceError(this.dumpContext(node));
    }
  } // Visit a parse tree produced by ECMAScriptParser#block.


  visitBlock(ctx) {
    console.info("visitBlock [%s] : %s", ctx.getChildCount(), ctx.getText());
    this.assertType(ctx, _ECMAScriptParser.ECMAScriptParser.BlockContext);
    let body = [];

    for (let i = 0; i < ctx.getChildCount(); ++i) {
      let node = ctx.getChild(i);

      if (node instanceof _ECMAScriptParser.ECMAScriptParser.StatementListContext) {
        let statementList = this.visitStatementList(node);

        for (let index in statementList) {
          body.push(statementList[index]);
        }
      } else {
        this.throwInsanceError(this.dumpContext(node));
      }
    }

    return this.decorate(new _nodes.BlockStatement(body), this.asMarker(this.asMetadata(ctx.getSourceInterval())));
  } // Visit a parse tree produced by ECMAScriptParser#statementList.


  visitStatementList(ctx) {
    console.info("visitStatementList [%s] : %s", ctx.getChildCount(), ctx.getText());
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
  } // Visit a parse tree produced by ECMAScriptParser#variableStatement.


  visitVariableStatement(ctx) {
    console.info("visitVariableStatement [%s] : %s", ctx.getChildCount(), ctx.getText());
    this.dumpContextAllChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#variableDeclarationList.


  visitVariableDeclarationList(ctx) {
    console.trace("visitVariableDeclarationList: " + ctx.getText());
  } // Visit a parse tree produced by ECMAScriptParser#variableDeclaration.


  visitVariableDeclaration(ctx) {
    console.trace("visitVariableDeclaration: " + ctx.getText());
  } // Visit a parse tree produced by ECMAScriptParser#initialiser.


  visitInitialiser(ctx) {
    console.trace("visitInitialiser: " + ctx.getText());
  } // Visit a parse tree produced by ECMAScriptParser#emptyStatement.


  visitEmptyStatement(ctx) {
    console.info("visitEmptyStatementXX: " + ctx.getText());
  }

  getRuleType(node, index) {
    return node.getChild(index).ruleIndex;
  }

  assertNodeCount(ctx, count) {
    if (ctx.getChildCount() != count) {
      throw new Error("Wrong child count, expected '" + count + "' got : " + ctx.getChildCount());
    }
  } // Visit a parse tree produced by ECMAScriptParser#expressionStatement.


  visitExpressionStatement(ctx) {
    console.info("visitExpressionStatement: " + ctx.getText());
    this.assertType(ctx, _ECMAScriptParser.ECMAScriptParser.ExpressionStatementContext);
    this.assertNodeCount(ctx, 1); // visitExpressionStatement:>visitExpressionSequence

    let node = ctx.getChild(0); // visitExpressionSequence 

    let exp;

    if (node instanceof _ECMAScriptParser.ECMAScriptParser.ExpressionSequenceContext) {
      exp = this.visitExpressionSequence(node);
    } else {
      this.throwInsanceError(this.dumpContext(node));
    }

    return exp; //this.decorate(exp, this.asMarker(this.asMetadata(ctx.getSourceInterval())));
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
  } // Visit a parse tree produced by ECMAScriptParser#DoStatement.


  visitDoStatement(ctx) {
    console.info("visitDoStatement: " + ctx.getText());
  } // Visit a parse tree produced by ECMAScriptParser#WhileStatement.


  visitWhileStatement(ctx) {
    console.info("visitWhileStatement: " + ctx.getText());
  } // Visit a parse tree produced by ECMAScriptParser#ForStatement.


  visitForStatement(ctx) {
    console.info("visitWhileStatement: " + ctx.getText());
  } // Visit a parse tree produced by ECMAScriptParser#ForVarStatement.


  visitForVarStatement(ctx) {
    console.trace('not implemented');
  } // Visit a parse tree produced by ECMAScriptParser#ForInStatement.


  visitForInStatement(ctx) {
    console.trace('not implemented');
  } // Visit a parse tree produced by ECMAScriptParser#ForVarInStatement.


  visitForVarInStatement(ctx) {
    console.trace('not implemented');
  } // Visit a parse tree produced by ECMAScriptParser#continueStatement.


  visitContinueStatement(ctx) {
    console.trace('not implemented');
  } // Visit a parse tree produced by ECMAScriptParser#breakStatement.


  visitBreakStatement(ctx) {
    console.trace('not implemented');
  } // Visit a parse tree produced by ECMAScriptParser#returnStatement.


  visitReturnStatement(ctx) {
    console.trace('not implemented');
  } // Visit a parse tree produced by ECMAScriptParser#withStatement.


  visitWithStatement(ctx) {
    console.trace('not implemented');
  } // Visit a parse tree produced by ECMAScriptParser#switchStatement.


  visitSwitchStatement(ctx) {
    console.trace('not implemented');
  } // Visit a parse tree produced by ECMAScriptParser#caseBlock.


  visitCaseBlock(ctx) {
    console.trace('not implemented');
  } // Visit a parse tree produced by ECMAScriptParser#caseClauses.


  visitCaseClauses(ctx) {
    console.trace('not implemented');
  } // Visit a parse tree produced by ECMAScriptParser#caseClause.


  visitCaseClause(ctx) {
    console.trace('not implemented');
  } // Visit a parse tree produced by ECMAScriptParser#defaultClause.


  visitDefaultClause(ctx) {
    console.trace('not implemented');
  } // Visit a parse tree produced by ECMAScriptParser#labelledStatement.


  visitLabelledStatement(ctx) {
    console.trace('not implemented');
  } // Visit a parse tree produced by ECMAScriptParser#throwStatement.


  visitThrowStatement(ctx) {
    console.trace('not implemented');
  } // Visit a parse tree produced by ECMAScriptParser#tryStatement.


  visitTryStatement(ctx) {
    console.trace('not implemented');
  } // Visit a parse tree produced by ECMAScriptParser#catchProduction.


  visitCatchProduction(ctx) {
    console.trace('not implemented');
  } // Visit a parse tree produced by ECMAScriptParser#finallyProduction.


  visitFinallyProduction(ctx) {
    console.trace('not implemented');
  } // Visit a parse tree produced by ECMAScriptParser#debuggerStatement.


  visitDebuggerStatement(ctx) {
    console.trace('not implemented');
  } // Visit a parse tree produced by ECMAScriptParser#functionDeclaration.


  visitFunctionDeclaration(ctx) {
    console.trace('not implemented');
  } // Visit a parse tree produced by ECMAScriptParser#formalParameterList.


  visitFormalParameterList(ctx) {
    console.trace('not implemented');
  } // Visit a parse tree produced by ECMAScriptParser#functionBody.


  visitFunctionBody(ctx) {
    console.info("visitFunctionBody: " + ctx.getText());
  } // Visit a parse tree produced by ECMAScriptParser#arrayLiteral.


  visitArrayLiteral(ctx) {
    console.info("visitArrayLiteral [%s] : %s", ctx.getChildCount(), ctx.getText());
    this.assertType(ctx, _ECMAScriptParser.ECMAScriptParser.ArrayLiteralContext); // this.assertNodeCount(ctx, 3)

    let elementList = ctx.getChild(1);
    let elements = this.visitElementList(elementList);
    let elisionValues;

    if (ctx.getChildCount() == 5) {
      let elision = ctx.getChild(3);
      elisionValues = this.visitElision(elision);
    }

    let literals = [];
    literals = literals.concat(elements);
    literals = literals.concat(elisionValues);
    return literals;
  } // Visit a parse tree produced by ECMAScriptParser#elementList.


  visitElementList(ctx) {
    console.info("visitElementList [%s] : %s", ctx.getChildCount(), ctx.getText());
    this.assertType(ctx, _ECMAScriptParser.ECMAScriptParser.ElementListContext);
    let elements = [];

    for (let i = 0; i < ctx.getChildCount(); ++i) {
      let node = ctx.getChild(i);
      if (node.symbol != undefined) continue;
      let elem;

      if (node instanceof _ECMAScriptParser.ECMAScriptParser.IdentifierExpressionContext) {
        elem = this.visitIdentifierExpression(node);
      } else if (node instanceof _ECMAScriptParser.ECMAScriptParser.LiteralExpressionContext) {
        elem = this.visitLiteralExpression(node);
      } else if (node instanceof _ECMAScriptParser.ECMAScriptParser.AdditiveExpressionContext) {
        elem = this.visitAdditiveExpression(node);
      } else if (node instanceof _ECMAScriptParser.ECMAScriptParser.MultiplicativeExpressionContext) {
        elem = this.visitMultiplicativeExpression(node);
      } else {
        this.throwInsanceError(this.dumpContext(node));
      }

      elements.push(elem);
    }

    return elements;
  } // Visit a parse tree produced by ECMAScriptParser#elision.


  visitElision(ctx) {
    console.info("visitElision [%s] : %s", ctx.getChildCount(), ctx.getText());
    this.assertType(ctx, _ECMAScriptParser.ECMAScriptParser.ElisionContext); // compliance: esprima compliane or returning `null` 

    let elision = [];

    for (let i = 0; i < ctx.getChildCount(); ++i) {
      elision.push(null);
    }

    return elision;
  } // Visit a parse tree produced by ECMAScriptParser#objectLiteral.


  visitObjectLiteral(ctx) {
    console.trace('not implemented');
  } // Visit a parse tree produced by ECMAScriptParser#propertyNameAndValueList.


  visitPropertyNameAndValueList(ctx) {
    console.trace('not implemented');
  } // Visit a parse tree produced by ECMAScriptParser#PropertyExpressionAssignment.


  visitPropertyExpressionAssignment(ctx) {
    console.trace('not implemented');
  } // Visit a parse tree produced by ECMAScriptParser#PropertyGetter.


  visitPropertyGetter(ctx) {
    console.trace('not implemented');
  } // Visit a parse tree produced by ECMAScriptParser#PropertySetter.


  visitPropertySetter(ctx) {
    console.trace('not implemented');
  } // Visit a parse tree produced by ECMAScriptParser#propertyName.


  visitPropertyName(ctx) {
    console.trace('not implemented');
  } // Visit a parse tree produced by ECMAScriptParser#propertySetParameterList.


  visitPropertySetParameterList(ctx) {
    console.trace('not implemented');
  } // Visit a parse tree produced by ECMAScriptParser#arguments.


  visitArguments(ctx) {
    console.info("visitArguments: " + ctx.getText());
  } // Visit a parse tree produced by ECMAScriptParser#argumentList.


  visitArgumentList(ctx) {
    console.info("visitArgumentList: " + ctx.getText());
  } // Visit a parse tree produced by ECMAScriptParser#expressionSequence.


  visitExpressionSequence(ctx) {
    console.info("visitExpressionSequence [%s] : [%s]", ctx.getChildCount(), ctx.getText());
    this.assertType(ctx, _ECMAScriptParser.ECMAScriptParser.ExpressionSequenceContext);
    let expressions = [];

    for (let i = 0; i < ctx.getChildCount(); ++i) {
      let node = ctx.getChild(i);
      let exp;

      if (node instanceof _ECMAScriptParser.ECMAScriptParser.LiteralExpressionContext) {
        exp = this.visitLiteralExpression(node);
      } else if (node instanceof _ECMAScriptParser.ECMAScriptParser.AssignmentExpressionContext) {
        exp = this.visitAssignmentExpression(node);
      } else if (node instanceof _ECMAScriptParser.ECMAScriptParser.AdditiveExpressionContext) {
        exp = this.visitAdditiveExpression(node);
      } else if (node instanceof _ECMAScriptParser.ECMAScriptParser.MultiplicativeExpressionContext) {
        exp = this.visitMultiplicativeExpression(node);
      } else if (node instanceof _ECMAScriptParser.ECMAScriptParser.ArrayLiteralExpressionContext) {
        exp = this.visitArrayLiteralExpression(node);
      } else {
        this.throwInsanceError(this.dumpContext(node));
      }

      expressions.push(exp);
    } // compliance: espirma, espree
    // this check to see if there are multiple expressions if so then we leave them as SequenceExpression 
    // otherwise we will roll them up into ExpressionStatement with one expression
    // `1` = ExpressionStatement -> Literal
    // `1, 2` = ExpressionStatement -> SequenceExpression -> Literal, Literal


    let exp;

    if (expressions.length == 1) {
      exp = new _nodes.ExpressionStatement(expressions[0]);
    } else {
      exp = new _nodes.SequenceExpression(expressions);
    }

    return this.decorate(exp, this.asMarker(this.asMetadata(ctx.getSourceInterval())));
  } // Visit a parse tree produced by ECMAScriptParser#TernaryExpression.


  visitTernaryExpression(ctx) {
    console.trace('not implemented');
  } // Visit a parse tree produced by ECMAScriptParser#LogicalAndExpression.


  visitLogicalAndExpression(ctx) {
    console.trace('not implemented');
  } // Visit a parse tree produced by ECMAScriptParser#PreIncrementExpression.


  visitPreIncrementExpression(ctx) {
    console.trace('not implemented');
  } // Visit a parse tree produced by ECMAScriptParser#ObjectLiteralExpression.


  visitObjectLiteralExpression(ctx) {
    console.trace('not implemented');
  } // Visit a parse tree produced by ECMAScriptParser#InExpression.


  visitInExpression(ctx) {
    console.trace('not implemented');
  } // Visit a parse tree produced by ECMAScriptParser#LogicalOrExpression.


  visitLogicalOrExpression(ctx) {
    console.trace('not implemented');
  } // Visit a parse tree produced by ECMAScriptParser#NotExpression.


  visitNotExpression(ctx) {
    console.trace('not implemented');
  } // Visit a parse tree produced by ECMAScriptParser#PreDecreaseExpression.


  visitPreDecreaseExpression(ctx) {
    console.trace('not implemented');
  } // Visit a parse tree produced by ECMAScriptParser#ArgumentsExpression.


  visitArgumentsExpression(ctx) {
    console.info("visitArgumentsExpression: " + ctx.getText());
  } // Visit a parse tree produced by ECMAScriptParser#ThisExpression.


  visitThisExpression(ctx) {
    console.trace('not implemented');
  } // Visit a parse tree produced by ECMAScriptParser#FunctionExpression.


  visitFunctionExpression(ctx) {
    console.trace('not implemented');
  } // Visit a parse tree produced by ECMAScriptParser#UnaryMinusExpression.


  visitUnaryMinusExpression(ctx) {
    console.trace('not implemented');
  } // Visit a parse tree produced by ECMAScriptParser#PostDecreaseExpression.


  visitPostDecreaseExpression(ctx) {
    console.trace('not implemented');
  } // Visit a parse tree produced by ECMAScriptParser#AssignmentExpression.


  visitAssignmentExpression(ctx) {
    console.info("visitAssignmentExpression [%s] : [%s]", ctx.getChildCount(), ctx.getText());
    this.assertType(ctx, _ECMAScriptParser.ECMAScriptParser.AssignmentExpressionContext);
    this.assertNodeCount(ctx, 3);
    let initialiser = ctx.getChild(0); // IdentifierExpressionContext

    let operator = ctx.getChild(1).getText(); // No type ( = )

    let expression = ctx.getChild(2); //ExpressionSequenceContext

    let lhs = this.visitIdentifierExpression(initialiser);
    let rhs = this.visitExpressionSequence(expression); // Compliance : pulling up ExpressionStatement into AssigementExpression

    let node = new _nodes.AssignmentExpression(operator, lhs, rhs.expression);
    return node;
  } // Visit a parse tree produced by ECMAScriptParser#TypeofExpression.


  visitTypeofExpression(ctx) {
    console.trace('not implemented');
  } // Visit a parse tree produced by ECMAScriptParser#InstanceofExpression.


  visitInstanceofExpression(ctx) {
    console.trace('not implemented');
  } // Visit a parse tree produced by ECMAScriptParser#UnaryPlusExpression.


  visitUnaryPlusExpression(ctx) {
    console.trace('not implemented');
  } // Visit a parse tree produced by ECMAScriptParser#DeleteExpression.


  visitDeleteExpression(ctx) {
    console.trace('not implemented');
  } // Visit a parse tree produced by ECMAScriptParser#EqualityExpression.


  visitEqualityExpression(ctx) {
    console.trace('not implemented');
  } // Visit a parse tree produced by ECMAScriptParser#BitXOrExpression.


  visitBitXOrExpression(ctx) {
    console.trace('not implemented');
  } // Visit a parse tree produced by ECMAScriptParser#MultiplicativeExpression.


  visitMultiplicativeExpression(ctx) {
    console.info("visitMultiplicativeExpression [%s] : %s", ctx.getChildCount(), ctx.getText());
    this.assertType(ctx, _ECMAScriptParser.ECMAScriptParser.MultiplicativeExpressionContext);
    this.assertNodeCount(ctx, 3);
    let left = ctx.getChild(0);
    let operator = ctx.getChild(1).getText(); // No type ( +,- )

    let right = ctx.getChild(2);
    let lhs = this.visitBinaryExpression(left);
    let rhs = this.visitBinaryExpression(right);
    return this.decorate(new _nodes.BinaryExpression(operator, lhs, rhs), {});
  } // Visit a parse tree produced by ECMAScriptParser#BitShiftExpression.


  visitBitShiftExpression(ctx) {
    console.trace('not implemented');
  } // Visit a parse tree produced by ECMAScriptParser#ParenthesizedExpression.


  visitParenthesizedExpression(ctx) {
    console.info("visitParenthesizedExpression: " + ctx.getText());
  } // Visit a parse tree produced by ECMAScriptParser#AdditiveExpression.


  visitAdditiveExpression(ctx) {
    console.info("visitAdditiveExpression [%s] : %s", ctx.getChildCount(), ctx.getText());
    this.assertType(ctx, _ECMAScriptParser.ECMAScriptParser.AdditiveExpressionContext);
    this.assertNodeCount(ctx, 3);
    let left = ctx.getChild(0);
    let operator = ctx.getChild(1).getText(); // No type ( +,- )

    let right = ctx.getChild(2);

    let lhs = this._visitBinaryExpression(left);

    let rhs = this._visitBinaryExpression(right); // return this.decorate(new BinaryExpression(operator, lhs ,rhs), this.asMarker(this.asMetadata(ctx.symbol)));


    return new _nodes.BinaryExpression(operator, lhs, rhs);
  }

  _visitBinaryExpression(ctx) {
    console.info("evalBinaryExpression [%s] : %s", ctx.getChildCount(), ctx.getText());

    if (ctx instanceof _ECMAScriptParser.ECMAScriptParser.IdentifierExpressionContext) {
      return this.visitIdentifierExpression(ctx);
    } else if (ctx instanceof _ECMAScriptParser.ECMAScriptParser.LiteralExpressionContext) {
      return this.visitLiteralExpression(ctx);
    } else if (ctx instanceof _ECMAScriptParser.ECMAScriptParser.AdditiveExpressionContext) {
      return this.visitAdditiveExpression(ctx);
    } else if (ctx instanceof _ECMAScriptParser.ECMAScriptParser.MultiplicativeExpressionContext) {
      return this.visitMultiplicativeExpression(ctx);
    }

    this.throwInsanceError(this.dumpContext(ctx));
  } // Visit a parse tree produced by ECMAScriptParser#RelationalExpression.


  visitRelationalExpression(ctx) {
    console.trace('not implemented');
  } // Visit a parse tree produced by ECMAScriptParser#PostIncrementExpression.


  visitPostIncrementExpression(ctx) {
    console.trace('not implemented');
  } // Visit a parse tree produced by ECMAScriptParser#BitNotExpression.


  visitBitNotExpression(ctx) {
    console.trace('not implemented');
  } // Visit a parse tree produced by ECMAScriptParser#NewExpression.


  visitNewExpression(ctx) {
    console.trace('not implemented');
  } // Visit a parse tree produced by ECMAScriptParser#LiteralExpression.


  visitLiteralExpression(ctx) {
    console.info("visitLiteralExpression [%s] : [%s]", ctx.getChildCount(), ctx.getText());
    this.assertType(ctx, _ECMAScriptParser.ECMAScriptParser.LiteralExpressionContext);
    this.assertNodeCount(ctx, 1); // visitLiteralExpression: > visitLiteral

    let node = ctx.getChild(0);

    if (node instanceof _ECMAScriptParser.ECMAScriptParser.LiteralContext) {
      return this.visitLiteral(node);
    } else if (node instanceof _ECMAScriptParser.ECMAScriptParser.NumericLiteralContext) {
      return this.visitNumericLiteral(node);
    }

    this.throwInsanceError(this.dumpContext(node));
  } // Visit a parse tree produced by ECMAScriptParser#ArrayLiteralExpression.


  visitArrayLiteralExpression(ctx) {
    console.info("visitArrayLiteralExpression [%s] : %s", ctx.getChildCount(), ctx.getText());
    this.assertType(ctx, _ECMAScriptParser.ECMAScriptParser.ArrayLiteralExpressionContext);
    this.assertNodeCount(ctx, 1);
    let node = ctx.getChild(0);
    let elements = this.visitArrayLiteral(node);
    return new _nodes.ArrayExpression(elements);
  } // Visit a parse tree produced by ECMAScriptParser#MemberDotExpression.


  visitMemberDotExpression(ctx) {
    console.info("visitMemberDotExpression [%s] : %s", ctx.getChildCount(), ctx.getText());
  } // Visit a parse tree produced by ECMAScriptParser#MemberIndexExpression.


  visitMemberIndexExpression(ctx) {
    console.trace('not implemented');
  } // Visit a parse tree produced by ECMAScriptParser#IdentifierExpression.


  visitIdentifierExpression(ctx) {
    console.info("visitIdentifierExpression [%s] : %s", ctx.getChildCount(), ctx.getText());
    this.assertType(ctx, _ECMAScriptParser.ECMAScriptParser.IdentifierExpressionContext);
    this.assertNodeCount(ctx, 1);
    let initialiser = ctx.getChild(0);
    let name = initialiser.getText();
    return this.decorate(new _nodes.Identifier(name), this.asMarker(this.asMetadata(initialiser.symbol)));
  } // Visit a parse tree produced by ECMAScriptParser#BitAndExpression.


  visitBitAndExpression(ctx) {
    console.trace('not implemented');
  } // Visit a parse tree produced by ECMAScriptParser#BitOrExpression.


  visitBitOrExpression(ctx) {
    console.trace('not implemented');
  } // Visit a parse tree produced by ECMAScriptParser#AssignmentOperatorExpression.


  visitAssignmentOperatorExpression(ctx) {
    console.trace('not implemented');
  } // Visit a parse tree produced by ECMAScriptParser#VoidExpression.


  visitVoidExpression(ctx) {
    console.trace('not implemented');
  } // Visit a parse tree produced by ECMAScriptParser#assignmentOperator.


  visitAssignmentOperator(ctx) {
    console.info("visitAssignmentOperator: " + ctx.getText());
  } // Visit a parse tree produced by ECMAScriptParser#literal.


  visitLiteral(ctx) {
    console.info("visitLiteral [%s] : [%s]", ctx.getChildCount(), ctx.getText());
    this.assertType(ctx, _ECMAScriptParser.ECMAScriptParser.LiteralContext);
    this.assertNodeCount(ctx, 1);
    let node = ctx.getChild(0);

    if (node.getChildCount() == 1) {
      if (node instanceof _ECMAScriptParser.ECMAScriptParser.NumericLiteralContext) {
        return this.visitNumericLiteral(node);
      }

      this.throwInsanceError(this.dumpContext(node));
    } else if (node.getChildCount() == 0) {
      return this.createLiteralValue(node);
    }
  } // Visit a parse tree produced by ECMAScriptParser#numericLiteral.


  visitNumericLiteral(ctx) {
    console.info("visitNumericLiteral [%s] : [%s]", ctx.getChildCount(), ctx.getText());
    this.assertType(ctx, _ECMAScriptParser.ECMAScriptParser.NumericLiteralContext);
    this.assertNodeCount(ctx, 1);
    let value = ctx.getText(); // TODO : Figure out better way

    let literal = new _nodes.Literal(Number(value), value);
    return this.decorate(literal, this.asMarker(this.asMetadata(ctx.getSourceInterval())));
  }

  createLiteralValue(ctx) {
    console.info("createLiteralValue [%s]: [%s]", ctx.getChildCount(), ctx.getText());
    let value = ctx.getText();
    let literal = new _nodes.Literal(value, value);
    return this.decorate(literal, this.asMarker(this.asMetadata(ctx.getSourceInterval())));
  } // Visit a parse tree produced by ECMAScriptParser#identifierName.


  visitIdentifierName(ctx) {
    console.info("visitIdentifierName: " + ctx.getText());
  } // Visit a parse tree produced by ECMAScriptParser#reservedWord.


  visitReservedWord(ctx) {
    console.info("visitReservedWord: " + ctx.getText());
  } // Visit a parse tree produced by ECMAScriptParser#keyword.


  visitKeyword(ctx) {
    console.info("visitKeyword: " + ctx.getText());
  } // Visit a parse tree produced by ECMAScriptParser#futureReservedWord.


  visitFutureReservedWord(ctx) {
    console.trace('not implemented');
  } // Visit a parse tree produced by ECMAScriptParser#getter.


  visitGetter(ctx) {
    console.trace('not implemented');
  } // Visit a parse tree produced by ECMAScriptParser#setter.


  visitSetter(ctx) {
    console.trace('not implemented');
  } // Visit a parse tree produced by ECMAScriptParser#eos.


  visitEos(ctx) {} //console.trace('not implemented')
  // Visit a parse tree produced by ECMAScriptParser#eof.


  visitEof(ctx) {
    console.trace('not implemented');
  }

}

exports.DelvenASTVisitor = DelvenASTVisitor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9BU1RQYXJzZXIudHMiXSwibmFtZXMiOlsiZnMiLCJyZXF1aXJlIiwiUGFyc2VyVHlwZSIsIkFTVFBhcnNlciIsImNvbnN0cnVjdG9yIiwidmlzaXRvciIsIkRlbHZlbkFTVFZpc2l0b3IiLCJnZW5lcmF0ZSIsInNvdXJjZSIsImNvZGUiLCJ0eXBlIiwidmFsdWUiLCJyZWFkRmlsZVN5bmMiLCJjaGFycyIsImFudGxyNCIsIklucHV0U3RyZWFtIiwibGV4ZXIiLCJEZWx2ZW5MZXhlciIsInRva2VucyIsIkNvbW1vblRva2VuU3RyZWFtIiwicGFyc2VyIiwiRGVsdmVuUGFyc2VyIiwidHJlZSIsInByb2dyYW0iLCJhY2NlcHQiLCJQcmludFZpc2l0b3IiLCJjb25zb2xlIiwiaW5mbyIsInJlc3VsdCIsInBhcnNlIiwiRUNNQVNjcmlwdCIsIkFTVFBhcnNlckRlZmF1bHQiLCJFcnJvciIsIkRlbHZlblZpc2l0b3IiLCJydWxlVHlwZU1hcCIsIk1hcCIsInNldHVwVHlwZVJ1bGVzIiwia2V5cyIsIk9iamVjdCIsImdldE93blByb3BlcnR5TmFtZXMiLCJFQ01BU2NyaXB0UGFyc2VyIiwia2V5IiwibmFtZSIsInN0YXJ0c1dpdGgiLCJzZXQiLCJwYXJzZUludCIsImR1bXBDb250ZXh0IiwiY3R4IiwiY29udGV4dCIsImVuZHNXaXRoIiwicHVzaCIsImR1bXBDb250ZXh0QWxsQ2hpbGRyZW4iLCJpbmRlbnQiLCJwYWQiLCJwYWRTdGFydCIsIm5vZGVzIiwibGVuZ3RoIiwiaSIsImdldENoaWxkQ291bnQiLCJjaGlsZCIsImdldENoaWxkIiwiZ2V0UnVsZUJ5SWQiLCJpZCIsImdldCIsImFzTWFya2VyIiwibWV0YWRhdGEiLCJpbmRleCIsImxpbmUiLCJjb2x1bW4iLCJkZWNvcmF0ZSIsIm5vZGUiLCJtYXJrZXIiLCJzdGFydCIsImVuZCIsInRocm93VHlwZUVycm9yIiwidHlwZUlkIiwiVHlwZUVycm9yIiwidGhyb3dJbnNhbmNlRXJyb3IiLCJhc3NlcnRUeXBlIiwidmlzaXRQcm9ncmFtIiwiZ2V0VGV4dCIsInN0YXRlbWVudHMiLCJzdG0iLCJTdGF0ZW1lbnRDb250ZXh0Iiwic3RhdGVtZW50IiwidmlzaXRTdGF0ZW1lbnQiLCJpbnRlcnZhbCIsImdldFNvdXJjZUludGVydmFsIiwic2NyaXB0IiwiU2NyaXB0IiwiYXNNZXRhZGF0YSIsIkV4cHJlc3Npb25TdGF0ZW1lbnRDb250ZXh0IiwidmlzaXRFeHByZXNzaW9uU3RhdGVtZW50IiwiVmFyaWFibGVTdGF0ZW1lbnRDb250ZXh0IiwidmlzaXRWYXJpYWJsZVN0YXRlbWVudCIsIkJsb2NrQ29udGV4dCIsInZpc2l0QmxvY2siLCJFbXB0eVN0YXRlbWVudENvbnRleHQiLCJib2R5IiwiU3RhdGVtZW50TGlzdENvbnRleHQiLCJzdGF0ZW1lbnRMaXN0IiwidmlzaXRTdGF0ZW1lbnRMaXN0IiwiQmxvY2tTdGF0ZW1lbnQiLCJydWxlSW5kZXgiLCJSVUxFX3N0YXRlbWVudCIsInVuZGVmaW5lZCIsInZpc2l0VmFyaWFibGVEZWNsYXJhdGlvbkxpc3QiLCJ0cmFjZSIsInZpc2l0VmFyaWFibGVEZWNsYXJhdGlvbiIsInZpc2l0SW5pdGlhbGlzZXIiLCJ2aXNpdEVtcHR5U3RhdGVtZW50IiwiZ2V0UnVsZVR5cGUiLCJhc3NlcnROb2RlQ291bnQiLCJjb3VudCIsImV4cCIsIkV4cHJlc3Npb25TZXF1ZW5jZUNvbnRleHQiLCJ2aXNpdEV4cHJlc3Npb25TZXF1ZW5jZSIsIm9mZnNldCIsInN0b3AiLCJ2aXNpdElmU3RhdGVtZW50IiwidmlzaXREb1N0YXRlbWVudCIsInZpc2l0V2hpbGVTdGF0ZW1lbnQiLCJ2aXNpdEZvclN0YXRlbWVudCIsInZpc2l0Rm9yVmFyU3RhdGVtZW50IiwidmlzaXRGb3JJblN0YXRlbWVudCIsInZpc2l0Rm9yVmFySW5TdGF0ZW1lbnQiLCJ2aXNpdENvbnRpbnVlU3RhdGVtZW50IiwidmlzaXRCcmVha1N0YXRlbWVudCIsInZpc2l0UmV0dXJuU3RhdGVtZW50IiwidmlzaXRXaXRoU3RhdGVtZW50IiwidmlzaXRTd2l0Y2hTdGF0ZW1lbnQiLCJ2aXNpdENhc2VCbG9jayIsInZpc2l0Q2FzZUNsYXVzZXMiLCJ2aXNpdENhc2VDbGF1c2UiLCJ2aXNpdERlZmF1bHRDbGF1c2UiLCJ2aXNpdExhYmVsbGVkU3RhdGVtZW50IiwidmlzaXRUaHJvd1N0YXRlbWVudCIsInZpc2l0VHJ5U3RhdGVtZW50IiwidmlzaXRDYXRjaFByb2R1Y3Rpb24iLCJ2aXNpdEZpbmFsbHlQcm9kdWN0aW9uIiwidmlzaXREZWJ1Z2dlclN0YXRlbWVudCIsInZpc2l0RnVuY3Rpb25EZWNsYXJhdGlvbiIsInZpc2l0Rm9ybWFsUGFyYW1ldGVyTGlzdCIsInZpc2l0RnVuY3Rpb25Cb2R5IiwidmlzaXRBcnJheUxpdGVyYWwiLCJBcnJheUxpdGVyYWxDb250ZXh0IiwiZWxlbWVudExpc3QiLCJlbGVtZW50cyIsInZpc2l0RWxlbWVudExpc3QiLCJlbGlzaW9uVmFsdWVzIiwiZWxpc2lvbiIsInZpc2l0RWxpc2lvbiIsImxpdGVyYWxzIiwiY29uY2F0IiwiRWxlbWVudExpc3RDb250ZXh0Iiwic3ltYm9sIiwiZWxlbSIsIklkZW50aWZpZXJFeHByZXNzaW9uQ29udGV4dCIsInZpc2l0SWRlbnRpZmllckV4cHJlc3Npb24iLCJMaXRlcmFsRXhwcmVzc2lvbkNvbnRleHQiLCJ2aXNpdExpdGVyYWxFeHByZXNzaW9uIiwiQWRkaXRpdmVFeHByZXNzaW9uQ29udGV4dCIsInZpc2l0QWRkaXRpdmVFeHByZXNzaW9uIiwiTXVsdGlwbGljYXRpdmVFeHByZXNzaW9uQ29udGV4dCIsInZpc2l0TXVsdGlwbGljYXRpdmVFeHByZXNzaW9uIiwiRWxpc2lvbkNvbnRleHQiLCJ2aXNpdE9iamVjdExpdGVyYWwiLCJ2aXNpdFByb3BlcnR5TmFtZUFuZFZhbHVlTGlzdCIsInZpc2l0UHJvcGVydHlFeHByZXNzaW9uQXNzaWdubWVudCIsInZpc2l0UHJvcGVydHlHZXR0ZXIiLCJ2aXNpdFByb3BlcnR5U2V0dGVyIiwidmlzaXRQcm9wZXJ0eU5hbWUiLCJ2aXNpdFByb3BlcnR5U2V0UGFyYW1ldGVyTGlzdCIsInZpc2l0QXJndW1lbnRzIiwidmlzaXRBcmd1bWVudExpc3QiLCJleHByZXNzaW9ucyIsIkFzc2lnbm1lbnRFeHByZXNzaW9uQ29udGV4dCIsInZpc2l0QXNzaWdubWVudEV4cHJlc3Npb24iLCJBcnJheUxpdGVyYWxFeHByZXNzaW9uQ29udGV4dCIsInZpc2l0QXJyYXlMaXRlcmFsRXhwcmVzc2lvbiIsIkV4cHJlc3Npb25TdGF0ZW1lbnQiLCJTZXF1ZW5jZUV4cHJlc3Npb24iLCJ2aXNpdFRlcm5hcnlFeHByZXNzaW9uIiwidmlzaXRMb2dpY2FsQW5kRXhwcmVzc2lvbiIsInZpc2l0UHJlSW5jcmVtZW50RXhwcmVzc2lvbiIsInZpc2l0T2JqZWN0TGl0ZXJhbEV4cHJlc3Npb24iLCJ2aXNpdEluRXhwcmVzc2lvbiIsInZpc2l0TG9naWNhbE9yRXhwcmVzc2lvbiIsInZpc2l0Tm90RXhwcmVzc2lvbiIsInZpc2l0UHJlRGVjcmVhc2VFeHByZXNzaW9uIiwidmlzaXRBcmd1bWVudHNFeHByZXNzaW9uIiwidmlzaXRUaGlzRXhwcmVzc2lvbiIsInZpc2l0RnVuY3Rpb25FeHByZXNzaW9uIiwidmlzaXRVbmFyeU1pbnVzRXhwcmVzc2lvbiIsInZpc2l0UG9zdERlY3JlYXNlRXhwcmVzc2lvbiIsImluaXRpYWxpc2VyIiwib3BlcmF0b3IiLCJleHByZXNzaW9uIiwibGhzIiwicmhzIiwiQXNzaWdubWVudEV4cHJlc3Npb24iLCJ2aXNpdFR5cGVvZkV4cHJlc3Npb24iLCJ2aXNpdEluc3RhbmNlb2ZFeHByZXNzaW9uIiwidmlzaXRVbmFyeVBsdXNFeHByZXNzaW9uIiwidmlzaXREZWxldGVFeHByZXNzaW9uIiwidmlzaXRFcXVhbGl0eUV4cHJlc3Npb24iLCJ2aXNpdEJpdFhPckV4cHJlc3Npb24iLCJsZWZ0IiwicmlnaHQiLCJ2aXNpdEJpbmFyeUV4cHJlc3Npb24iLCJCaW5hcnlFeHByZXNzaW9uIiwidmlzaXRCaXRTaGlmdEV4cHJlc3Npb24iLCJ2aXNpdFBhcmVudGhlc2l6ZWRFeHByZXNzaW9uIiwiX3Zpc2l0QmluYXJ5RXhwcmVzc2lvbiIsInZpc2l0UmVsYXRpb25hbEV4cHJlc3Npb24iLCJ2aXNpdFBvc3RJbmNyZW1lbnRFeHByZXNzaW9uIiwidmlzaXRCaXROb3RFeHByZXNzaW9uIiwidmlzaXROZXdFeHByZXNzaW9uIiwiTGl0ZXJhbENvbnRleHQiLCJ2aXNpdExpdGVyYWwiLCJOdW1lcmljTGl0ZXJhbENvbnRleHQiLCJ2aXNpdE51bWVyaWNMaXRlcmFsIiwiQXJyYXlFeHByZXNzaW9uIiwidmlzaXRNZW1iZXJEb3RFeHByZXNzaW9uIiwidmlzaXRNZW1iZXJJbmRleEV4cHJlc3Npb24iLCJJZGVudGlmaWVyIiwidmlzaXRCaXRBbmRFeHByZXNzaW9uIiwidmlzaXRCaXRPckV4cHJlc3Npb24iLCJ2aXNpdEFzc2lnbm1lbnRPcGVyYXRvckV4cHJlc3Npb24iLCJ2aXNpdFZvaWRFeHByZXNzaW9uIiwidmlzaXRBc3NpZ25tZW50T3BlcmF0b3IiLCJjcmVhdGVMaXRlcmFsVmFsdWUiLCJsaXRlcmFsIiwiTGl0ZXJhbCIsIk51bWJlciIsInZpc2l0SWRlbnRpZmllck5hbWUiLCJ2aXNpdFJlc2VydmVkV29yZCIsInZpc2l0S2V5d29yZCIsInZpc2l0RnV0dXJlUmVzZXJ2ZWRXb3JkIiwidmlzaXRHZXR0ZXIiLCJ2aXNpdFNldHRlciIsInZpc2l0RW9zIiwidmlzaXRFb2YiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFFQTs7QUFFQTs7Ozs7O0FBSUEsSUFBSUEsRUFBRSxHQUFHQyxPQUFPLENBQUMsSUFBRCxDQUFoQjtBQUVBOzs7Ozs7Ozs7O0lBUVlDLFU7OztXQUFBQSxVO0FBQUFBLEVBQUFBLFUsQ0FBQUEsVTtHQUFBQSxVLDBCQUFBQSxVOztBQVlHLE1BQWVDLFNBQWYsQ0FBeUI7QUFHcENDLEVBQUFBLFdBQVcsQ0FBQ0MsT0FBRCxFQUE2QjtBQUNwQyxTQUFLQSxPQUFMLEdBQWVB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QUFFSDs7QUFoOEIrQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGFudGxyNCBmcm9tIFwiYW50bHI0XCJcbmltcG9ydCB7IEVDTUFTY3JpcHRWaXNpdG9yIGFzIERlbHZlblZpc2l0b3IgfSBmcm9tIFwiLi9wYXJzZXIvRUNNQVNjcmlwdFZpc2l0b3JcIlxuaW1wb3J0IHsgRUNNQVNjcmlwdFBhcnNlciBhcyBEZWx2ZW5QYXJzZXIsIEVDTUFTY3JpcHRQYXJzZXIgfSBmcm9tIFwiLi9wYXJzZXIvRUNNQVNjcmlwdFBhcnNlclwiXG5pbXBvcnQgeyBFQ01BU2NyaXB0TGV4ZXIgYXMgRGVsdmVuTGV4ZXIgfSBmcm9tIFwiLi9wYXJzZXIvRUNNQVNjcmlwdExleGVyXCJcbmltcG9ydCB7IFJ1bGVDb250ZXh0IH0gZnJvbSBcImFudGxyNC9SdWxlQ29udGV4dFwiXG5pbXBvcnQgeyBQcmludFZpc2l0b3IgfSBmcm9tIFwiLi9QcmludFZpc2l0b3JcIlxuaW1wb3J0IEFTVE5vZGUgZnJvbSBcIi4vQVNUTm9kZVwiO1xuaW1wb3J0IHsgRXhwcmVzc2lvblN0YXRlbWVudCwgTGl0ZXJhbCwgU2NyaXB0LCBCbG9ja1N0YXRlbWVudCwgU3RhdGVtZW50LCBTZXF1ZW5jZUV4cHJlc3Npb24sIFRocm93U3RhdGVtZW50LCBBc3NpZ25tZW50RXhwcmVzc2lvbiwgSWRlbnRpZmllciwgQmluYXJ5RXhwcmVzc2lvbiwgQXJyYXlFeHByZXNzaW9uIH0gZnJvbSBcIi4vbm9kZXNcIjtcbmltcG9ydCB7IFN5bnRheCB9IGZyb20gXCIuL3N5bnRheFwiO1xuaW1wb3J0IHsgdHlwZSB9IGZyb20gXCJvc1wiXG5pbXBvcnQgeyBJbnRlcnZhbCB9IGZyb20gXCJhbnRscjRcIlxubGV0IGZzID0gcmVxdWlyZShcImZzXCIpO1xuXG4vKipcbiAqIFZlcnNpb24gdGhhdCB3ZSBnZW5lcmF0ZSB0aGUgQVNUIGZvci4gXG4gKiBUaGlzIGFsbG93cyBmb3IgdGVzdGluZyBkaWZmZXJlbnQgaW1wbGVtZW50YXRpb25zXG4gKiBcbiAqIEN1cnJlbnRseSBvbmx5IEVDTUFTY3JpcHQgaXMgc3VwcG9ydGVkXG4gKiBcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9lc3RyZWUvZXN0cmVlXG4gKi9cbmV4cG9ydCBlbnVtIFBhcnNlclR5cGUgeyBFQ01BU2NyaXB0IH1cbmV4cG9ydCB0eXBlIFNvdXJjZVR5cGUgPSBcImNvZGVcIiB8IFwiZmlsZW5hbWVcIjtcbmV4cG9ydCB0eXBlIFNvdXJjZUNvZGUgPSB7XG4gICAgdHlwZTogU291cmNlVHlwZSxcbiAgICB2YWx1ZTogc3RyaW5nXG59XG5leHBvcnQgaW50ZXJmYWNlIE1hcmtlciB7XG4gICAgaW5kZXg6IG51bWJlcjtcbiAgICBsaW5lOiBudW1iZXI7XG4gICAgY29sdW1uOiBudW1iZXI7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGFic3RyYWN0IGNsYXNzIEFTVFBhcnNlciB7XG4gICAgcHJpdmF0ZSB2aXNpdG9yOiAodHlwZW9mIERlbHZlblZpc2l0b3IgfCBudWxsKVxuXG4gICAgY29uc3RydWN0b3IodmlzaXRvcj86IERlbHZlbkFTVFZpc2l0b3IpIHtcbiAgICAgICAgdGhpcy52aXNpdG9yID0gdmlzaXRvciB8fCBuZXcgRGVsdmVuQVNUVmlzaXRvcigpO1xuICAgIH1cblxuICAgIGdlbmVyYXRlKHNvdXJjZTogU291cmNlQ29kZSk6IEFTVE5vZGUge1xuICAgICAgICBsZXQgY29kZTtcbiAgICAgICAgc3dpdGNoIChzb3VyY2UudHlwZSkge1xuICAgICAgICAgICAgY2FzZSBcImNvZGVcIjpcbiAgICAgICAgICAgICAgICBjb2RlID0gc291cmNlLnZhbHVlO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcImZpbGVuYW1lXCI6XG4gICAgICAgICAgICAgICAgY29kZSA9IGZzLnJlYWRGaWxlU3luYyhzb3VyY2UudmFsdWUsIFwidXRmOFwiKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBjaGFycyA9IG5ldyBhbnRscjQuSW5wdXRTdHJlYW0oY29kZSk7XG4gICAgICAgIGxldCBsZXhlciA9IG5ldyBEZWx2ZW5MZXhlcihjaGFycyk7XG4gICAgICAgIGxldCB0b2tlbnMgPSBuZXcgYW50bHI0LkNvbW1vblRva2VuU3RyZWFtKGxleGVyKTtcbiAgICAgICAgbGV0IHBhcnNlciA9IG5ldyBEZWx2ZW5QYXJzZXIodG9rZW5zKTtcbiAgICAgICAgbGV0IHRyZWUgPSBwYXJzZXIucHJvZ3JhbSgpO1xuICAgICAgICAvLyBjb25zb2xlLmluZm8odHJlZS50b1N0cmluZ1RyZWUoKSlcbiAgICAgICAgdHJlZS5hY2NlcHQobmV3IFByaW50VmlzaXRvcigpKTtcbiAgICAgICAgY29uc29sZS5pbmZvKFwiLS0tLS0tLS0tLS0tLS0tLS0tLS0tXCIpO1xuICAgICAgICBsZXQgcmVzdWx0ID0gdHJlZS5hY2NlcHQodGhpcy52aXNpdG9yKTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBQYXJzZSBzb3VyY2UgYW5kIGdlbmVyZWF0ZSBBU1QgdHJlZVxuICAgICAqIEBwYXJhbSBzb3VyY2UgXG4gICAgICogQHBhcmFtIHR5cGUgXG4gICAgICovXG4gICAgc3RhdGljIHBhcnNlKHNvdXJjZTogU291cmNlQ29kZSwgdHlwZT86IFBhcnNlclR5cGUpOiBBU1ROb2RlIHtcbiAgICAgICAgaWYgKHR5cGUgPT0gbnVsbClcbiAgICAgICAgICAgIHR5cGUgPSBQYXJzZXJUeXBlLkVDTUFTY3JpcHQ7XG4gICAgICAgIGxldCBwYXJzZXI7XG4gICAgICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgICAgICAgY2FzZSBQYXJzZXJUeXBlLkVDTUFTY3JpcHQ6XG4gICAgICAgICAgICAgICAgcGFyc2VyID0gbmV3IEFTVFBhcnNlckRlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVW5rb3duIHBhcnNlciB0eXBlXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHBhcnNlci5nZW5lcmF0ZShzb3VyY2UpXG4gICAgfVxufVxuXG5jbGFzcyBBU1RQYXJzZXJEZWZhdWx0IGV4dGVuZHMgQVNUUGFyc2VyIHtcblxufVxuXG5leHBvcnQgY2xhc3MgRGVsdmVuQVNUVmlzaXRvciBleHRlbmRzIERlbHZlblZpc2l0b3Ige1xuICAgIHByaXZhdGUgcnVsZVR5cGVNYXA6IE1hcDxudW1iZXIsIHN0cmluZz4gPSBuZXcgTWFwKCk7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5zZXR1cFR5cGVSdWxlcygpO1xuICAgIH1cblxuICAgIHByaXZhdGUgc2V0dXBUeXBlUnVsZXMoKSB7XG4gICAgICAgIGNvbnN0IGtleXMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhFQ01BU2NyaXB0UGFyc2VyKTtcbiAgICAgICAgZm9yICh2YXIga2V5IGluIGtleXMpIHtcbiAgICAgICAgICAgIGxldCBuYW1lID0ga2V5c1trZXldO1xuICAgICAgICAgICAgaWYgKG5hbWUuc3RhcnRzV2l0aCgnUlVMRV8nKSkge1xuICAgICAgICAgICAgICAgIHRoaXMucnVsZVR5cGVNYXAuc2V0KHBhcnNlSW50KEVDTUFTY3JpcHRQYXJzZXJbbmFtZV0pLCBuYW1lKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBkdW1wQ29udGV4dChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnN0IGtleXMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhFQ01BU2NyaXB0UGFyc2VyKTtcbiAgICAgICAgbGV0IGNvbnRleHQgPSBbXVxuICAgICAgICBmb3IgKHZhciBrZXkgaW4ga2V5cykge1xuICAgICAgICAgICAgbGV0IG5hbWUgPSBrZXlzW2tleV07XG4gICAgICAgICAgICBpZiAobmFtZS5lbmRzV2l0aCgnQ29udGV4dCcpKSB7XG4gICAgICAgICAgICAgICAgaWYgKGN0eCBpbnN0YW5jZW9mIEVDTUFTY3JpcHRQYXJzZXJbbmFtZV0pIHtcbiAgICAgICAgICAgICAgICAgICAgY29udGV4dC5wdXNoKG5hbWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY29udGV4dDtcbiAgICB9XG5cbiAgICBwcml2YXRlIGR1bXBDb250ZXh0QWxsQ2hpbGRyZW4oY3R4OiBSdWxlQ29udGV4dCwgaW5kZW50OiBudW1iZXIgPSAwKSB7XG4gICAgICAgIGxldCBwYWQgPSBcIiBcIi5wYWRTdGFydChpbmRlbnQsIFwiXFx0XCIpO1xuICAgICAgICBsZXQgbm9kZXMgPSB0aGlzLmR1bXBDb250ZXh0KGN0eCk7XG4gICAgICAgIGlmIChub2Rlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBjb25zb2xlLmluZm8ocGFkICsgXCIgKiBcIiArIG5vZGVzKVxuICAgICAgICB9XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY3R4LmdldENoaWxkQ291bnQoKTsgKytpKSB7XG4gICAgICAgICAgICBsZXQgY2hpbGQgPSBjdHg/LmdldENoaWxkKGkpO1xuICAgICAgICAgICAgaWYgKGNoaWxkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5kdW1wQ29udGV4dEFsbENoaWxkcmVuKGNoaWxkLCArK2luZGVudCk7XG4gICAgICAgICAgICAgICAgLS1pbmRlbnQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXQgcnVsZSBuYW1lIGJ5IHRoZSBJZFxuICAgICAqIEBwYXJhbSBpZCBcbiAgICAgKi9cbiAgICBnZXRSdWxlQnlJZChpZDogbnVtYmVyKTogc3RyaW5nIHwgdW5kZWZpbmVkIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucnVsZVR5cGVNYXAuZ2V0KGlkKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFzTWFya2VyKG1ldGFkYXRhOiBhbnkpIHtcbiAgICAgICAgcmV0dXJuIHsgaW5kZXg6IDEsIGxpbmU6IDEsIGNvbHVtbjogMSB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBkZWNvcmF0ZShub2RlOiBhbnksIG1hcmtlcjogTWFya2VyKTogYW55IHtcbiAgICAgICAgbm9kZS5zdGFydCA9IDA7XG4gICAgICAgIG5vZGUuZW5kID0gMDtcbiAgICAgICAgcmV0dXJuIG5vZGU7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSB0aHJvd1R5cGVFcnJvcih0eXBlSWQ6IGFueSkge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiVW5oYW5kbGVkIHR5cGUgOiBcIiArIHR5cGVJZCArIFwiIDogXCIgKyB0aGlzLmdldFJ1bGVCeUlkKHR5cGVJZCkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRocm93IFR5cGVFcnJvciBvbmx5IHdoZW4gdGhlcmUgaXMgYSB0eXBlIHByb3ZpZGVkLiBcbiAgICAgKiBUaGlzIGlzIHVzZWZ1bGwgd2hlbiB0aGVyZSBub2RlIGl0YSBUZXJtaW5hbE5vZGUgXG4gICAgICogQHBhcmFtIHR5cGUgXG4gICAgICovXG4gICAgcHJpdmF0ZSB0aHJvd0luc2FuY2VFcnJvcih0eXBlOiBhbnkpIHtcbi8qICAgICAgICAgaWYgKHR5cGUgPT0gdW5kZWZpbmVkIHx8IHR5cGUgPT0gXCJcIikge1xuICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH0gKi9cbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlVuaGFuZGxlZCBpbnN0YW5jZSB0eXBlIDogXCIgKyB0eXBlKTtcbiAgICB9XG5cbiAgICBhc3NlcnRUeXBlKGN0eDogUnVsZUNvbnRleHQsIHR5cGU6IGFueSkge1xuICAgICAgICBpZiAoIShjdHggaW5zdGFuY2VvZiB0eXBlKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkludmFsaWQgdHlwZSBleHBlY3RlZCA6ICdcIiArIHR5cGUubmFtZSArIFwiJyByZWNlaXZlZCAnXCIgKyB0aGlzLmR1bXBDb250ZXh0KGN0eCkpICsgXCInXCI7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNwcm9ncmFtLlxuICAgIHZpc2l0UHJvZ3JhbShjdHg6IEVDTUFTY3JpcHRQYXJzZXIuUHJvZ3JhbUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS5pbmZvKFwidmlzaXRQcm9ncmFtIFslc10gOiAlc1wiLCBjdHguZ2V0Q2hpbGRDb3VudCgpLCBjdHguZ2V0VGV4dCgpKTtcbiAgICAgICAgLy8gdmlzaXRQcm9ncmFtIC0+dmlzaXRTb3VyY2VFbGVtZW50cyAtPiB2aXNpdFNvdXJjZUVsZW1lbnQgLT4gdmlzaXRTdGF0ZW1lbnRcbiAgICAgICAgbGV0IHN0YXRlbWVudHM6IGFueSA9IFtdO1xuICAgICAgICBsZXQgbm9kZSA9IGN0eC5nZXRDaGlsZCgwKTsgIC8vIHZpc2l0UHJvZ3JhbSAtPnZpc2l0U291cmNlRWxlbWVudHMgXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbm9kZS5nZXRDaGlsZENvdW50KCk7ICsraSkge1xuICAgICAgICAgICAgbGV0IHN0bSA9IG5vZGUuZ2V0Q2hpbGQoaSkuZ2V0Q2hpbGQoMCk7IC8vIFNvdXJjZUVsZW1lbnRzQ29udGV4dCA+IFN0YXRlbWVudENvbnRleHRcbiAgICAgICAgICAgIGlmIChzdG0gaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLlN0YXRlbWVudENvbnRleHQpIHtcbiAgICAgICAgICAgICAgICBsZXQgc3RhdGVtZW50ID0gdGhpcy52aXNpdFN0YXRlbWVudChzdG0pO1xuICAgICAgICAgICAgICAgIHN0YXRlbWVudHMucHVzaChzdGF0ZW1lbnQpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnRocm93SW5zYW5jZUVycm9yKHRoaXMuZHVtcENvbnRleHQoc3RtKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGludGVydmFsID0gY3R4LmdldFNvdXJjZUludGVydmFsKCk7XG4gICAgICAgIGxldCBzY3JpcHQgPSBuZXcgU2NyaXB0KHN0YXRlbWVudHMpO1xuICAgICAgICByZXR1cm4gdGhpcy5kZWNvcmF0ZShzY3JpcHQsIHRoaXMuYXNNYXJrZXIodGhpcy5hc01ldGFkYXRhKGludGVydmFsKSkpO1xuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI3N0YXRlbWVudC5cbiAgICB2aXNpdFN0YXRlbWVudChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIHRoaXMuYXNzZXJ0VHlwZShjdHgsIEVDTUFTY3JpcHRQYXJzZXIuU3RhdGVtZW50Q29udGV4dClcbiAgICAgICAgY29uc29sZS5pbmZvKFwidmlzaXRTdGF0ZW1lbnQgWyVzXSA6ICVzXCIsIGN0eC5nZXRDaGlsZENvdW50KCksIGN0eC5nZXRUZXh0KCkpO1xuICAgICAgICBsZXQgbm9kZTogUnVsZUNvbnRleHQgPSBjdHguZ2V0Q2hpbGQoMCk7XG5cbiAgICAgICAgaWYgKG5vZGUgaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLkV4cHJlc3Npb25TdGF0ZW1lbnRDb250ZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy52aXNpdEV4cHJlc3Npb25TdGF0ZW1lbnQobm9kZSk7XG4gICAgICAgIH0gZWxzZSBpZiAobm9kZSBpbnN0YW5jZW9mIEVDTUFTY3JpcHRQYXJzZXIuVmFyaWFibGVTdGF0ZW1lbnRDb250ZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy52aXNpdFZhcmlhYmxlU3RhdGVtZW50KG5vZGUpO1xuICAgICAgICB9IGVsc2UgaWYgKG5vZGUgaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLkJsb2NrQ29udGV4dCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmlzaXRCbG9jayhub2RlKTt9XG4gICAgICAgICBlbHNlIGlmIChub2RlIGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5FbXB0eVN0YXRlbWVudENvbnRleHQpIHtcbiAgICAgICAgICAgIC8vIE5PT1AsXG4gICAgICAgICAgICAvLyB2YXIgeDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMudGhyb3dJbnNhbmNlRXJyb3IodGhpcy5kdW1wQ29udGV4dChub2RlKSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNibG9jay5cbiAgICB2aXNpdEJsb2NrKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS5pbmZvKFwidmlzaXRCbG9jayBbJXNdIDogJXNcIiwgY3R4LmdldENoaWxkQ291bnQoKSwgY3R4LmdldFRleHQoKSk7XG4gICAgICAgIHRoaXMuYXNzZXJ0VHlwZShjdHgsIEVDTUFTY3JpcHRQYXJzZXIuQmxvY2tDb250ZXh0KVxuICAgICAgICBsZXQgYm9keSA9IFtdO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGN0eC5nZXRDaGlsZENvdW50KCk7ICsraSkge1xuICAgICAgICAgICAgbGV0IG5vZGU6IFJ1bGVDb250ZXh0ID0gY3R4LmdldENoaWxkKGkpO1xuICAgICAgICAgICAgaWYgKG5vZGUgaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLlN0YXRlbWVudExpc3RDb250ZXh0KSB7XG4gICAgICAgICAgICAgICAgbGV0IHN0YXRlbWVudExpc3QgPSB0aGlzLnZpc2l0U3RhdGVtZW50TGlzdChub2RlKTtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpbmRleCBpbiBzdGF0ZW1lbnRMaXN0KSB7XG4gICAgICAgICAgICAgICAgICAgIGJvZHkucHVzaChzdGF0ZW1lbnRMaXN0W2luZGV4XSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnRocm93SW5zYW5jZUVycm9yKHRoaXMuZHVtcENvbnRleHQobm9kZSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmRlY29yYXRlKG5ldyBCbG9ja1N0YXRlbWVudChib2R5KSwgdGhpcy5hc01hcmtlcih0aGlzLmFzTWV0YWRhdGEoY3R4LmdldFNvdXJjZUludGVydmFsKCkpKSk7XG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNzdGF0ZW1lbnRMaXN0LlxuICAgIHZpc2l0U3RhdGVtZW50TGlzdChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0U3RhdGVtZW50TGlzdCBbJXNdIDogJXNcIiwgY3R4LmdldENoaWxkQ291bnQoKSwgY3R4LmdldFRleHQoKSk7XG4gICAgICAgIGxldCBib2R5ID0gW107XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY3R4LmdldENoaWxkQ291bnQoKTsgKytpKSB7XG4gICAgICAgICAgICBsZXQgbm9kZTogUnVsZUNvbnRleHQgPSBjdHguZ2V0Q2hpbGQoaSk7XG4gICAgICAgICAgICBsZXQgdHlwZSA9IG5vZGUucnVsZUluZGV4O1xuICAgICAgICAgICAgaWYgKHR5cGUgPT0gRUNNQVNjcmlwdFBhcnNlci5SVUxFX3N0YXRlbWVudCkge1xuICAgICAgICAgICAgICAgIGxldCBzdGF0ZW1lbnQ6IGFueSA9IHRoaXMudmlzaXRTdGF0ZW1lbnQobm9kZSk7XG4gICAgICAgICAgICAgICAgYm9keS5wdXNoKHN0YXRlbWVudCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGUgPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnRocm93VHlwZUVycm9yKHR5cGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBib2R5O1xuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI3ZhcmlhYmxlU3RhdGVtZW50LlxuICAgIHZpc2l0VmFyaWFibGVTdGF0ZW1lbnQoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJ2aXNpdFZhcmlhYmxlU3RhdGVtZW50IFslc10gOiAlc1wiLCBjdHguZ2V0Q2hpbGRDb3VudCgpLCBjdHguZ2V0VGV4dCgpKTtcbiAgICAgICAgdGhpcy5kdW1wQ29udGV4dEFsbENoaWxkcmVuKGN0eClcbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciN2YXJpYWJsZURlY2xhcmF0aW9uTGlzdC5cbiAgICB2aXNpdFZhcmlhYmxlRGVjbGFyYXRpb25MaXN0KGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZShcInZpc2l0VmFyaWFibGVEZWNsYXJhdGlvbkxpc3Q6IFwiICsgY3R4LmdldFRleHQoKSk7XG4gICAgfVxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjdmFyaWFibGVEZWNsYXJhdGlvbi5cbiAgICB2aXNpdFZhcmlhYmxlRGVjbGFyYXRpb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKFwidmlzaXRWYXJpYWJsZURlY2xhcmF0aW9uOiBcIiArIGN0eC5nZXRUZXh0KCkpO1xuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjaW5pdGlhbGlzZXIuXG4gICAgdmlzaXRJbml0aWFsaXNlcihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoXCJ2aXNpdEluaXRpYWxpc2VyOiBcIiArIGN0eC5nZXRUZXh0KCkpO1xuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjZW1wdHlTdGF0ZW1lbnQuXG4gICAgdmlzaXRFbXB0eVN0YXRlbWVudChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0RW1wdHlTdGF0ZW1lbnRYWDogXCIgKyBjdHguZ2V0VGV4dCgpKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldFJ1bGVUeXBlKG5vZGU6IGFueSwgaW5kZXg6IG51bWJlcik6IG51bWJlciB7XG4gICAgICAgIHJldHVybiBub2RlLmdldENoaWxkKGluZGV4KS5ydWxlSW5kZXg7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc3NlcnROb2RlQ291bnQoY3R4OiBSdWxlQ29udGV4dCwgY291bnQ6IG51bWJlcikge1xuICAgICAgICBpZiAoY3R4LmdldENoaWxkQ291bnQoKSAhPSBjb3VudCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiV3JvbmcgY2hpbGQgY291bnQsIGV4cGVjdGVkICdcIiArIGNvdW50ICsgXCInIGdvdCA6IFwiICsgY3R4LmdldENoaWxkQ291bnQoKSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNleHByZXNzaW9uU3RhdGVtZW50LlxuICAgIHZpc2l0RXhwcmVzc2lvblN0YXRlbWVudChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0RXhwcmVzc2lvblN0YXRlbWVudDogXCIgKyBjdHguZ2V0VGV4dCgpKTtcbiAgICAgICAgdGhpcy5hc3NlcnRUeXBlKGN0eCwgRUNNQVNjcmlwdFBhcnNlci5FeHByZXNzaW9uU3RhdGVtZW50Q29udGV4dClcbiAgICAgICAgdGhpcy5hc3NlcnROb2RlQ291bnQoY3R4LCAxKTtcbiAgICAgICAgLy8gdmlzaXRFeHByZXNzaW9uU3RhdGVtZW50Oj52aXNpdEV4cHJlc3Npb25TZXF1ZW5jZVxuICAgICAgICBsZXQgbm9kZTogUnVsZUNvbnRleHQgPSBjdHguZ2V0Q2hpbGQoMCk7IC8vIHZpc2l0RXhwcmVzc2lvblNlcXVlbmNlIFxuICAgICAgICBsZXQgZXhwXG4gICAgICAgIGlmIChub2RlIGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5FeHByZXNzaW9uU2VxdWVuY2VDb250ZXh0KSB7XG4gICAgICAgICAgICBleHAgPSB0aGlzLnZpc2l0RXhwcmVzc2lvblNlcXVlbmNlKG5vZGUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy50aHJvd0luc2FuY2VFcnJvcih0aGlzLmR1bXBDb250ZXh0KG5vZGUpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBleHAgLy90aGlzLmRlY29yYXRlKGV4cCwgdGhpcy5hc01hcmtlcih0aGlzLmFzTWV0YWRhdGEoY3R4LmdldFNvdXJjZUludGVydmFsKCkpKSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc01ldGFkYXRhKGludGVydmFsOiBJbnRlcnZhbCk6IGFueSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBzdGFydDoge1xuICAgICAgICAgICAgICAgIGxpbmU6IDEsXG4gICAgICAgICAgICAgICAgY29sdW1uOiBpbnRlcnZhbC5zdGFydCxcbiAgICAgICAgICAgICAgICBvZmZzZXQ6IDBcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBlbmQ6IHtcbiAgICAgICAgICAgICAgICBsaW5lOiAxLFxuICAgICAgICAgICAgICAgIGNvbHVtbjogaW50ZXJ2YWwuc3RvcCxcbiAgICAgICAgICAgICAgICBvZmZzZXQ6IDNcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2lmU3RhdGVtZW50LlxuICAgIHZpc2l0SWZTdGF0ZW1lbnQoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJ2aXNpdElmU3RhdGVtZW50OiBcIiArIGN0eC5nZXRUZXh0KCkpO1xuXG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNEb1N0YXRlbWVudC5cbiAgICB2aXNpdERvU3RhdGVtZW50KGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS5pbmZvKFwidmlzaXREb1N0YXRlbWVudDogXCIgKyBjdHguZ2V0VGV4dCgpKTtcblxuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjV2hpbGVTdGF0ZW1lbnQuXG4gICAgdmlzaXRXaGlsZVN0YXRlbWVudChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0V2hpbGVTdGF0ZW1lbnQ6IFwiICsgY3R4LmdldFRleHQoKSk7XG5cbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI0ZvclN0YXRlbWVudC5cbiAgICB2aXNpdEZvclN0YXRlbWVudChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0V2hpbGVTdGF0ZW1lbnQ6IFwiICsgY3R4LmdldFRleHQoKSk7XG5cbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI0ZvclZhclN0YXRlbWVudC5cbiAgICB2aXNpdEZvclZhclN0YXRlbWVudChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG5cbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI0ZvckluU3RhdGVtZW50LlxuICAgIHZpc2l0Rm9ySW5TdGF0ZW1lbnQoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuXG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNGb3JWYXJJblN0YXRlbWVudC5cbiAgICB2aXNpdEZvclZhckluU3RhdGVtZW50KGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcblxuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjY29udGludWVTdGF0ZW1lbnQuXG4gICAgdmlzaXRDb250aW51ZVN0YXRlbWVudChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG5cbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2JyZWFrU3RhdGVtZW50LlxuICAgIHZpc2l0QnJlYWtTdGF0ZW1lbnQoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuXG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNyZXR1cm5TdGF0ZW1lbnQuXG4gICAgdmlzaXRSZXR1cm5TdGF0ZW1lbnQoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuXG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciN3aXRoU3RhdGVtZW50LlxuICAgIHZpc2l0V2l0aFN0YXRlbWVudChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG5cbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI3N3aXRjaFN0YXRlbWVudC5cbiAgICB2aXNpdFN3aXRjaFN0YXRlbWVudChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG5cbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2Nhc2VCbG9jay5cbiAgICB2aXNpdENhc2VCbG9jayhjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG5cbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2Nhc2VDbGF1c2VzLlxuICAgIHZpc2l0Q2FzZUNsYXVzZXMoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuXG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNjYXNlQ2xhdXNlLlxuICAgIHZpc2l0Q2FzZUNsYXVzZShjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG5cbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2RlZmF1bHRDbGF1c2UuXG4gICAgdmlzaXREZWZhdWx0Q2xhdXNlKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcblxuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjbGFiZWxsZWRTdGF0ZW1lbnQuXG4gICAgdmlzaXRMYWJlbGxlZFN0YXRlbWVudChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG5cbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI3Rocm93U3RhdGVtZW50LlxuICAgIHZpc2l0VGhyb3dTdGF0ZW1lbnQoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuXG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciN0cnlTdGF0ZW1lbnQuXG4gICAgdmlzaXRUcnlTdGF0ZW1lbnQoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuXG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNjYXRjaFByb2R1Y3Rpb24uXG4gICAgdmlzaXRDYXRjaFByb2R1Y3Rpb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuXG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNmaW5hbGx5UHJvZHVjdGlvbi5cbiAgICB2aXNpdEZpbmFsbHlQcm9kdWN0aW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcblxuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjZGVidWdnZXJTdGF0ZW1lbnQuXG4gICAgdmlzaXREZWJ1Z2dlclN0YXRlbWVudChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG5cbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2Z1bmN0aW9uRGVjbGFyYXRpb24uXG4gICAgdmlzaXRGdW5jdGlvbkRlY2xhcmF0aW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcblxuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjZm9ybWFsUGFyYW1ldGVyTGlzdC5cbiAgICB2aXNpdEZvcm1hbFBhcmFtZXRlckxpc3QoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjZnVuY3Rpb25Cb2R5LlxuICAgIHZpc2l0RnVuY3Rpb25Cb2R5KGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS5pbmZvKFwidmlzaXRGdW5jdGlvbkJvZHk6IFwiICsgY3R4LmdldFRleHQoKSk7XG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNhcnJheUxpdGVyYWwuXG4gICAgdmlzaXRBcnJheUxpdGVyYWwoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJ2aXNpdEFycmF5TGl0ZXJhbCBbJXNdIDogJXNcIiwgY3R4LmdldENoaWxkQ291bnQoKSwgY3R4LmdldFRleHQoKSk7XG4gICAgICAgIHRoaXMuYXNzZXJ0VHlwZShjdHgsIEVDTUFTY3JpcHRQYXJzZXIuQXJyYXlMaXRlcmFsQ29udGV4dClcbiAgICAgICAgLy8gdGhpcy5hc3NlcnROb2RlQ291bnQoY3R4LCAzKVxuICAgICAgICBsZXQgZWxlbWVudExpc3QgPSBjdHguZ2V0Q2hpbGQoMSk7XG4gICAgICAgIGxldCBlbGVtZW50cyA9ICB0aGlzLnZpc2l0RWxlbWVudExpc3QoZWxlbWVudExpc3QpO1xuICAgICAgICBsZXQgZWxpc2lvblZhbHVlc1xuICAgICAgICBpZihjdHguZ2V0Q2hpbGRDb3VudCgpID09IDUpIHtcbiAgICAgICAgICAgIGxldCBlbGlzaW9uID0gY3R4LmdldENoaWxkKDMpO1xuICAgICAgICAgICAgZWxpc2lvblZhbHVlcyA9IHRoaXMudmlzaXRFbGlzaW9uKGVsaXNpb24pO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGxpdGVyYWxzID0gW107XG4gICAgICAgIGxpdGVyYWxzID0gbGl0ZXJhbHMuY29uY2F0KGVsZW1lbnRzKTtcbiAgICAgICAgbGl0ZXJhbHMgPSBsaXRlcmFscy5jb25jYXQoZWxpc2lvblZhbHVlcyk7XG4gICAgICAgIHJldHVybiBsaXRlcmFscztcbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNlbGVtZW50TGlzdC5cbiAgICB2aXNpdEVsZW1lbnRMaXN0KGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS5pbmZvKFwidmlzaXRFbGVtZW50TGlzdCBbJXNdIDogJXNcIiwgY3R4LmdldENoaWxkQ291bnQoKSwgY3R4LmdldFRleHQoKSk7XG4gICAgICAgIHRoaXMuYXNzZXJ0VHlwZShjdHgsIEVDTUFTY3JpcHRQYXJzZXIuRWxlbWVudExpc3RDb250ZXh0KVxuXG4gICAgICAgIGxldCBlbGVtZW50cyA9IFtdO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGN0eC5nZXRDaGlsZENvdW50KCk7ICsraSkge1xuICAgICAgICAgICAgbGV0IG5vZGUgPSBjdHguZ2V0Q2hpbGQoaSk7XG5cbiAgICAgICAgICAgIGlmKG5vZGUuc3ltYm9sICE9IHVuZGVmaW5lZClcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgbGV0IGVsZW07XG4gICAgICAgICAgICBpZiAobm9kZSBpbnN0YW5jZW9mIEVDTUFTY3JpcHRQYXJzZXIuSWRlbnRpZmllckV4cHJlc3Npb25Db250ZXh0KSB7XG4gICAgICAgICAgICAgICAgZWxlbSA9IHRoaXMudmlzaXRJZGVudGlmaWVyRXhwcmVzc2lvbihub2RlKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAobm9kZSBpbnN0YW5jZW9mIEVDTUFTY3JpcHRQYXJzZXIuTGl0ZXJhbEV4cHJlc3Npb25Db250ZXh0KSB7XG4gICAgICAgICAgICAgICAgZWxlbSA9IHRoaXMudmlzaXRMaXRlcmFsRXhwcmVzc2lvbihub2RlKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAobm9kZSBpbnN0YW5jZW9mIEVDTUFTY3JpcHRQYXJzZXIuQWRkaXRpdmVFeHByZXNzaW9uQ29udGV4dCkge1xuICAgICAgICAgICAgICAgIGVsZW0gPSB0aGlzLnZpc2l0QWRkaXRpdmVFeHByZXNzaW9uKG5vZGUpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChub2RlIGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5NdWx0aXBsaWNhdGl2ZUV4cHJlc3Npb25Db250ZXh0KSB7XG4gICAgICAgICAgICAgICAgZWxlbSA9IHRoaXMudmlzaXRNdWx0aXBsaWNhdGl2ZUV4cHJlc3Npb24obm9kZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgdGhpcy50aHJvd0luc2FuY2VFcnJvcih0aGlzLmR1bXBDb250ZXh0KG5vZGUpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsZW1lbnRzLnB1c2goZWxlbSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGVsZW1lbnRzO1xuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2VsaXNpb24uXG4gICAgdmlzaXRFbGlzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS5pbmZvKFwidmlzaXRFbGlzaW9uIFslc10gOiAlc1wiLCBjdHguZ2V0Q2hpbGRDb3VudCgpLCBjdHguZ2V0VGV4dCgpKTtcbiAgICAgICAgdGhpcy5hc3NlcnRUeXBlKGN0eCwgRUNNQVNjcmlwdFBhcnNlci5FbGlzaW9uQ29udGV4dClcbiAgICAgICAgLy8gY29tcGxpYW5jZTogZXNwcmltYSBjb21wbGlhbmUgb3IgcmV0dXJuaW5nIGBudWxsYCBcbiAgICAgICAgbGV0IGVsaXNpb24gPSBbXTtcbiAgICAgICAgZm9yKGxldCBpID0gMDsgaSA8IGN0eC5nZXRDaGlsZENvdW50KCk7ICsraSkge1xuICAgICAgICAgICAgZWxpc2lvbi5wdXNoKG51bGwpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBlbGlzaW9uO1xuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI29iamVjdExpdGVyYWwuXG4gICAgdmlzaXRPYmplY3RMaXRlcmFsKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcblxuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI3Byb3BlcnR5TmFtZUFuZFZhbHVlTGlzdC5cbiAgICB2aXNpdFByb3BlcnR5TmFtZUFuZFZhbHVlTGlzdChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG5cbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI1Byb3BlcnR5RXhwcmVzc2lvbkFzc2lnbm1lbnQuXG4gICAgdmlzaXRQcm9wZXJ0eUV4cHJlc3Npb25Bc3NpZ25tZW50KGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcblxuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjUHJvcGVydHlHZXR0ZXIuXG4gICAgdmlzaXRQcm9wZXJ0eUdldHRlcihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG5cbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI1Byb3BlcnR5U2V0dGVyLlxuICAgIHZpc2l0UHJvcGVydHlTZXR0ZXIoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuXG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNwcm9wZXJ0eU5hbWUuXG4gICAgdmlzaXRQcm9wZXJ0eU5hbWUoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuXG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNwcm9wZXJ0eVNldFBhcmFtZXRlckxpc3QuXG4gICAgdmlzaXRQcm9wZXJ0eVNldFBhcmFtZXRlckxpc3QoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuXG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNhcmd1bWVudHMuXG4gICAgdmlzaXRBcmd1bWVudHMoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJ2aXNpdEFyZ3VtZW50czogXCIgKyBjdHguZ2V0VGV4dCgpKTtcblxuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2FyZ3VtZW50TGlzdC5cbiAgICB2aXNpdEFyZ3VtZW50TGlzdChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0QXJndW1lbnRMaXN0OiBcIiArIGN0eC5nZXRUZXh0KCkpO1xuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2V4cHJlc3Npb25TZXF1ZW5jZS5cbiAgICB2aXNpdEV4cHJlc3Npb25TZXF1ZW5jZShjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0RXhwcmVzc2lvblNlcXVlbmNlIFslc10gOiBbJXNdXCIsIGN0eC5nZXRDaGlsZENvdW50KCksIGN0eC5nZXRUZXh0KCkpO1xuICAgICAgICB0aGlzLmFzc2VydFR5cGUoY3R4LCBFQ01BU2NyaXB0UGFyc2VyLkV4cHJlc3Npb25TZXF1ZW5jZUNvbnRleHQpO1xuICAgICAgICBsZXQgZXhwcmVzc2lvbnMgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjdHguZ2V0Q2hpbGRDb3VudCgpOyArK2kpIHtcbiAgICAgICAgICAgIGxldCBub2RlOiBSdWxlQ29udGV4dCA9IGN0eC5nZXRDaGlsZChpKTtcbiAgICAgICAgICAgIGxldCBleHA7XG4gICAgICAgICAgICBpZiAobm9kZSBpbnN0YW5jZW9mIEVDTUFTY3JpcHRQYXJzZXIuTGl0ZXJhbEV4cHJlc3Npb25Db250ZXh0KSB7XG4gICAgICAgICAgICAgICAgZXhwID0gdGhpcy52aXNpdExpdGVyYWxFeHByZXNzaW9uKG5vZGUpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChub2RlIGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5Bc3NpZ25tZW50RXhwcmVzc2lvbkNvbnRleHQpIHtcbiAgICAgICAgICAgICAgICBleHAgPSB0aGlzLnZpc2l0QXNzaWdubWVudEV4cHJlc3Npb24obm9kZSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG5vZGUgaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLkFkZGl0aXZlRXhwcmVzc2lvbkNvbnRleHQpIHtcbiAgICAgICAgICAgICAgICBleHAgPSB0aGlzLnZpc2l0QWRkaXRpdmVFeHByZXNzaW9uKG5vZGUpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChub2RlIGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5NdWx0aXBsaWNhdGl2ZUV4cHJlc3Npb25Db250ZXh0KSB7XG4gICAgICAgICAgICAgICAgZXhwID0gdGhpcy52aXNpdE11bHRpcGxpY2F0aXZlRXhwcmVzc2lvbihub2RlKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAobm9kZSBpbnN0YW5jZW9mIEVDTUFTY3JpcHRQYXJzZXIuQXJyYXlMaXRlcmFsRXhwcmVzc2lvbkNvbnRleHQpIHtcbiAgICAgICAgICAgICAgICBleHAgPSB0aGlzLnZpc2l0QXJyYXlMaXRlcmFsRXhwcmVzc2lvbihub2RlKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy50aHJvd0luc2FuY2VFcnJvcih0aGlzLmR1bXBDb250ZXh0KG5vZGUpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGV4cHJlc3Npb25zLnB1c2goZXhwKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBjb21wbGlhbmNlOiBlc3Bpcm1hLCBlc3ByZWVcbiAgICAgICAgLy8gdGhpcyBjaGVjayB0byBzZWUgaWYgdGhlcmUgYXJlIG11bHRpcGxlIGV4cHJlc3Npb25zIGlmIHNvIHRoZW4gd2UgbGVhdmUgdGhlbSBhcyBTZXF1ZW5jZUV4cHJlc3Npb24gXG4gICAgICAgIC8vIG90aGVyd2lzZSB3ZSB3aWxsIHJvbGwgdGhlbSB1cCBpbnRvIEV4cHJlc3Npb25TdGF0ZW1lbnQgd2l0aCBvbmUgZXhwcmVzc2lvblxuICAgICAgICAvLyBgMWAgPSBFeHByZXNzaW9uU3RhdGVtZW50IC0+IExpdGVyYWxcbiAgICAgICAgLy8gYDEsIDJgID0gRXhwcmVzc2lvblN0YXRlbWVudCAtPiBTZXF1ZW5jZUV4cHJlc3Npb24gLT4gTGl0ZXJhbCwgTGl0ZXJhbFxuICAgICAgICBsZXQgZXhwO1xuICAgICAgICBpZiAoZXhwcmVzc2lvbnMubGVuZ3RoID09IDEpIHtcbiAgICAgICAgICAgIGV4cCA9IG5ldyBFeHByZXNzaW9uU3RhdGVtZW50KGV4cHJlc3Npb25zWzBdKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZXhwID0gbmV3IFNlcXVlbmNlRXhwcmVzc2lvbihleHByZXNzaW9ucyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuZGVjb3JhdGUoZXhwLCB0aGlzLmFzTWFya2VyKHRoaXMuYXNNZXRhZGF0YShjdHguZ2V0U291cmNlSW50ZXJ2YWwoKSkpKVxuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjVGVybmFyeUV4cHJlc3Npb24uXG4gICAgdmlzaXRUZXJuYXJ5RXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG5cbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI0xvZ2ljYWxBbmRFeHByZXNzaW9uLlxuICAgIHZpc2l0TG9naWNhbEFuZEV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuXG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNQcmVJbmNyZW1lbnRFeHByZXNzaW9uLlxuICAgIHZpc2l0UHJlSW5jcmVtZW50RXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG5cbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI09iamVjdExpdGVyYWxFeHByZXNzaW9uLlxuICAgIHZpc2l0T2JqZWN0TGl0ZXJhbEV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuXG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNJbkV4cHJlc3Npb24uXG4gICAgdmlzaXRJbkV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuXG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNMb2dpY2FsT3JFeHByZXNzaW9uLlxuICAgIHZpc2l0TG9naWNhbE9yRXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG5cbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI05vdEV4cHJlc3Npb24uXG4gICAgdmlzaXROb3RFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcblxuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjUHJlRGVjcmVhc2VFeHByZXNzaW9uLlxuICAgIHZpc2l0UHJlRGVjcmVhc2VFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcblxuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjQXJndW1lbnRzRXhwcmVzc2lvbi5cbiAgICB2aXNpdEFyZ3VtZW50c0V4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJ2aXNpdEFyZ3VtZW50c0V4cHJlc3Npb246IFwiICsgY3R4LmdldFRleHQoKSk7XG5cblxuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjVGhpc0V4cHJlc3Npb24uXG4gICAgdmlzaXRUaGlzRXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG5cbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI0Z1bmN0aW9uRXhwcmVzc2lvbi5cbiAgICB2aXNpdEZ1bmN0aW9uRXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG5cbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI1VuYXJ5TWludXNFeHByZXNzaW9uLlxuICAgIHZpc2l0VW5hcnlNaW51c0V4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuXG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNQb3N0RGVjcmVhc2VFeHByZXNzaW9uLlxuICAgIHZpc2l0UG9zdERlY3JlYXNlRXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG5cbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI0Fzc2lnbm1lbnRFeHByZXNzaW9uLlxuICAgIHZpc2l0QXNzaWdubWVudEV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJ2aXNpdEFzc2lnbm1lbnRFeHByZXNzaW9uIFslc10gOiBbJXNdXCIsIGN0eC5nZXRDaGlsZENvdW50KCksIGN0eC5nZXRUZXh0KCkpO1xuICAgICAgICB0aGlzLmFzc2VydFR5cGUoY3R4LCBFQ01BU2NyaXB0UGFyc2VyLkFzc2lnbm1lbnRFeHByZXNzaW9uQ29udGV4dCk7XG4gICAgICAgIHRoaXMuYXNzZXJ0Tm9kZUNvdW50KGN0eCwgMylcblxuICAgICAgICBsZXQgaW5pdGlhbGlzZXIgPSBjdHguZ2V0Q2hpbGQoMCk7IC8vIElkZW50aWZpZXJFeHByZXNzaW9uQ29udGV4dFxuICAgICAgICBsZXQgb3BlcmF0b3IgPSBjdHguZ2V0Q2hpbGQoMSkuZ2V0VGV4dCgpOyAvLyBObyB0eXBlICggPSApXG4gICAgICAgIGxldCBleHByZXNzaW9uID0gY3R4LmdldENoaWxkKDIpOyAgLy9FeHByZXNzaW9uU2VxdWVuY2VDb250ZXh0XG5cbiAgICAgICAgbGV0IGxocyA9IHRoaXMudmlzaXRJZGVudGlmaWVyRXhwcmVzc2lvbihpbml0aWFsaXNlcik7XG4gICAgICAgIGxldCByaHMgPSB0aGlzLnZpc2l0RXhwcmVzc2lvblNlcXVlbmNlKGV4cHJlc3Npb24pO1xuICAgICAgICAvLyBDb21wbGlhbmNlIDogcHVsbGluZyB1cCBFeHByZXNzaW9uU3RhdGVtZW50IGludG8gQXNzaWdlbWVudEV4cHJlc3Npb25cbiAgICAgICAgbGV0IG5vZGUgPSBuZXcgQXNzaWdubWVudEV4cHJlc3Npb24ob3BlcmF0b3IsIGxocywgcmhzLmV4cHJlc3Npb24pXG4gICAgICAgIHJldHVybiBub2RlO1xuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjVHlwZW9mRXhwcmVzc2lvbi5cbiAgICB2aXNpdFR5cGVvZkV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuXG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNJbnN0YW5jZW9mRXhwcmVzc2lvbi5cbiAgICB2aXNpdEluc3RhbmNlb2ZFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcblxuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjVW5hcnlQbHVzRXhwcmVzc2lvbi5cbiAgICB2aXNpdFVuYXJ5UGx1c0V4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuXG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNEZWxldGVFeHByZXNzaW9uLlxuICAgIHZpc2l0RGVsZXRlRXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG5cbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI0VxdWFsaXR5RXhwcmVzc2lvbi5cbiAgICB2aXNpdEVxdWFsaXR5RXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG5cbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI0JpdFhPckV4cHJlc3Npb24uXG4gICAgdmlzaXRCaXRYT3JFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcblxuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjTXVsdGlwbGljYXRpdmVFeHByZXNzaW9uLlxuICAgIHZpc2l0TXVsdGlwbGljYXRpdmVFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS5pbmZvKFwidmlzaXRNdWx0aXBsaWNhdGl2ZUV4cHJlc3Npb24gWyVzXSA6ICVzXCIsIGN0eC5nZXRDaGlsZENvdW50KCksIGN0eC5nZXRUZXh0KCkpO1xuICAgICAgICB0aGlzLmFzc2VydFR5cGUoY3R4LCBFQ01BU2NyaXB0UGFyc2VyLk11bHRpcGxpY2F0aXZlRXhwcmVzc2lvbkNvbnRleHQpO1xuICAgICAgICB0aGlzLmFzc2VydE5vZGVDb3VudChjdHgsIDMpXG5cbiAgICAgICAgbGV0IGxlZnQgPSBjdHguZ2V0Q2hpbGQoMCk7XG4gICAgICAgIGxldCBvcGVyYXRvciA9IGN0eC5nZXRDaGlsZCgxKS5nZXRUZXh0KCk7IC8vIE5vIHR5cGUgKCArLC0gKVxuICAgICAgICBsZXQgcmlnaHQgPSBjdHguZ2V0Q2hpbGQoMik7XG4gICAgICAgIGxldCBsaHMgPSB0aGlzLnZpc2l0QmluYXJ5RXhwcmVzc2lvbihsZWZ0KTtcbiAgICAgICAgbGV0IHJocyA9IHRoaXMudmlzaXRCaW5hcnlFeHByZXNzaW9uKHJpZ2h0KTtcblxuICAgICAgICByZXR1cm4gdGhpcy5kZWNvcmF0ZShuZXcgQmluYXJ5RXhwcmVzc2lvbihvcGVyYXRvciwgbGhzLCByaHMpLCB7fSk7XG4gICAgfVxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjQml0U2hpZnRFeHByZXNzaW9uLlxuICAgIHZpc2l0Qml0U2hpZnRFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcblxuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI1BhcmVudGhlc2l6ZWRFeHByZXNzaW9uLlxuICAgIHZpc2l0UGFyZW50aGVzaXplZEV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJ2aXNpdFBhcmVudGhlc2l6ZWRFeHByZXNzaW9uOiBcIiArIGN0eC5nZXRUZXh0KCkpO1xuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI0FkZGl0aXZlRXhwcmVzc2lvbi5cbiAgICB2aXNpdEFkZGl0aXZlRXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0QWRkaXRpdmVFeHByZXNzaW9uIFslc10gOiAlc1wiLCBjdHguZ2V0Q2hpbGRDb3VudCgpLCBjdHguZ2V0VGV4dCgpKTtcbiAgICAgICAgdGhpcy5hc3NlcnRUeXBlKGN0eCwgRUNNQVNjcmlwdFBhcnNlci5BZGRpdGl2ZUV4cHJlc3Npb25Db250ZXh0KTtcbiAgICAgICAgdGhpcy5hc3NlcnROb2RlQ291bnQoY3R4LCAzKVxuXG4gICAgICAgIGxldCBsZWZ0ID0gY3R4LmdldENoaWxkKDApO1xuICAgICAgICBsZXQgb3BlcmF0b3IgPSBjdHguZ2V0Q2hpbGQoMSkuZ2V0VGV4dCgpOyAvLyBObyB0eXBlICggKywtIClcbiAgICAgICAgbGV0IHJpZ2h0ID0gY3R4LmdldENoaWxkKDIpO1xuICAgICAgICBsZXQgbGhzID0gdGhpcy5fdmlzaXRCaW5hcnlFeHByZXNzaW9uKGxlZnQpO1xuICAgICAgICBsZXQgcmhzID0gdGhpcy5fdmlzaXRCaW5hcnlFeHByZXNzaW9uKHJpZ2h0KTtcbiAgICAgICAgLy8gcmV0dXJuIHRoaXMuZGVjb3JhdGUobmV3IEJpbmFyeUV4cHJlc3Npb24ob3BlcmF0b3IsIGxocyAscmhzKSwgdGhpcy5hc01hcmtlcih0aGlzLmFzTWV0YWRhdGEoY3R4LnN5bWJvbCkpKTtcbiAgICAgICAgcmV0dXJuIG5ldyBCaW5hcnlFeHByZXNzaW9uKG9wZXJhdG9yLCBsaHMsIHJocyk7XG4gICAgfVxuXG4gICAgX3Zpc2l0QmluYXJ5RXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcImV2YWxCaW5hcnlFeHByZXNzaW9uIFslc10gOiAlc1wiLCBjdHguZ2V0Q2hpbGRDb3VudCgpLCBjdHguZ2V0VGV4dCgpKTtcbiAgICAgICAgaWYgKGN0eCBpbnN0YW5jZW9mIEVDTUFTY3JpcHRQYXJzZXIuSWRlbnRpZmllckV4cHJlc3Npb25Db250ZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy52aXNpdElkZW50aWZpZXJFeHByZXNzaW9uKGN0eCk7XG4gICAgICAgIH0gZWxzZSBpZiAoY3R4IGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5MaXRlcmFsRXhwcmVzc2lvbkNvbnRleHQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnZpc2l0TGl0ZXJhbEV4cHJlc3Npb24oY3R4KTtcbiAgICAgICAgfSBlbHNlIGlmIChjdHggaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLkFkZGl0aXZlRXhwcmVzc2lvbkNvbnRleHQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnZpc2l0QWRkaXRpdmVFeHByZXNzaW9uKGN0eCk7XG4gICAgICAgIH0gZWxzZSBpZiAoY3R4IGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5NdWx0aXBsaWNhdGl2ZUV4cHJlc3Npb25Db250ZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy52aXNpdE11bHRpcGxpY2F0aXZlRXhwcmVzc2lvbihjdHgpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMudGhyb3dJbnNhbmNlRXJyb3IodGhpcy5kdW1wQ29udGV4dChjdHgpKTtcbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNSZWxhdGlvbmFsRXhwcmVzc2lvbi5cbiAgICB2aXNpdFJlbGF0aW9uYWxFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNQb3N0SW5jcmVtZW50RXhwcmVzc2lvbi5cbiAgICB2aXNpdFBvc3RJbmNyZW1lbnRFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNCaXROb3RFeHByZXNzaW9uLlxuICAgIHZpc2l0Qml0Tm90RXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG5cbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI05ld0V4cHJlc3Npb24uXG4gICAgdmlzaXROZXdFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcblxuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjTGl0ZXJhbEV4cHJlc3Npb24uXG4gICAgdmlzaXRMaXRlcmFsRXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0TGl0ZXJhbEV4cHJlc3Npb24gWyVzXSA6IFslc11cIiwgY3R4LmdldENoaWxkQ291bnQoKSwgY3R4LmdldFRleHQoKSk7XG4gICAgICAgIHRoaXMuYXNzZXJ0VHlwZShjdHgsIEVDTUFTY3JpcHRQYXJzZXIuTGl0ZXJhbEV4cHJlc3Npb25Db250ZXh0KTtcbiAgICAgICAgdGhpcy5hc3NlcnROb2RlQ291bnQoY3R4LCAxKTtcbiAgICAgICAgLy8gdmlzaXRMaXRlcmFsRXhwcmVzc2lvbjogPiB2aXNpdExpdGVyYWxcbiAgICAgICAgbGV0IG5vZGUgPSBjdHguZ2V0Q2hpbGQoMClcbiAgICAgICAgaWYgKG5vZGUgaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLkxpdGVyYWxDb250ZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy52aXNpdExpdGVyYWwobm9kZSk7XG4gICAgICAgIH0gZWxzZSBpZiAobm9kZSBpbnN0YW5jZW9mIEVDTUFTY3JpcHRQYXJzZXIuTnVtZXJpY0xpdGVyYWxDb250ZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy52aXNpdE51bWVyaWNMaXRlcmFsKG5vZGUpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMudGhyb3dJbnNhbmNlRXJyb3IodGhpcy5kdW1wQ29udGV4dChub2RlKSk7XG4gICAgfVxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjQXJyYXlMaXRlcmFsRXhwcmVzc2lvbi5cbiAgICB2aXNpdEFycmF5TGl0ZXJhbEV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJ2aXNpdEFycmF5TGl0ZXJhbEV4cHJlc3Npb24gWyVzXSA6ICVzXCIsIGN0eC5nZXRDaGlsZENvdW50KCksIGN0eC5nZXRUZXh0KCkpO1xuICAgICAgICB0aGlzLmFzc2VydFR5cGUoY3R4LCBFQ01BU2NyaXB0UGFyc2VyLkFycmF5TGl0ZXJhbEV4cHJlc3Npb25Db250ZXh0KTtcbiAgICAgICAgdGhpcy5hc3NlcnROb2RlQ291bnQoY3R4LCAxKTtcbiAgICAgICAgbGV0IG5vZGUgPSBjdHguZ2V0Q2hpbGQoMCk7XG4gICAgICAgIGxldCBlbGVtZW50cyA9IHRoaXMudmlzaXRBcnJheUxpdGVyYWwobm9kZSk7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBBcnJheUV4cHJlc3Npb24oZWxlbWVudHMpO1xuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI01lbWJlckRvdEV4cHJlc3Npb24uXG4gICAgdmlzaXRNZW1iZXJEb3RFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS5pbmZvKFwidmlzaXRNZW1iZXJEb3RFeHByZXNzaW9uIFslc10gOiAlc1wiLCBjdHguZ2V0Q2hpbGRDb3VudCgpLCBjdHguZ2V0VGV4dCgpKTtcbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNNZW1iZXJJbmRleEV4cHJlc3Npb24uXG4gICAgdmlzaXRNZW1iZXJJbmRleEV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjSWRlbnRpZmllckV4cHJlc3Npb24uXG4gICAgdmlzaXRJZGVudGlmaWVyRXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0SWRlbnRpZmllckV4cHJlc3Npb24gWyVzXSA6ICVzXCIsIGN0eC5nZXRDaGlsZENvdW50KCksIGN0eC5nZXRUZXh0KCkpO1xuICAgICAgICB0aGlzLmFzc2VydFR5cGUoY3R4LCBFQ01BU2NyaXB0UGFyc2VyLklkZW50aWZpZXJFeHByZXNzaW9uQ29udGV4dCk7XG4gICAgICAgIHRoaXMuYXNzZXJ0Tm9kZUNvdW50KGN0eCwgMSlcbiAgICAgICAgbGV0IGluaXRpYWxpc2VyID0gY3R4LmdldENoaWxkKDApO1xuICAgICAgICBsZXQgbmFtZSA9IGluaXRpYWxpc2VyLmdldFRleHQoKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGVjb3JhdGUobmV3IElkZW50aWZpZXIobmFtZSksIHRoaXMuYXNNYXJrZXIodGhpcy5hc01ldGFkYXRhKGluaXRpYWxpc2VyLnN5bWJvbCkpKVxuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI0JpdEFuZEV4cHJlc3Npb24uXG4gICAgdmlzaXRCaXRBbmRFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNCaXRPckV4cHJlc3Npb24uXG4gICAgdmlzaXRCaXRPckV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjQXNzaWdubWVudE9wZXJhdG9yRXhwcmVzc2lvbi5cbiAgICB2aXNpdEFzc2lnbm1lbnRPcGVyYXRvckV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjVm9pZEV4cHJlc3Npb24uXG4gICAgdmlzaXRWb2lkRXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG5cbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNhc3NpZ25tZW50T3BlcmF0b3IuXG4gICAgdmlzaXRBc3NpZ25tZW50T3BlcmF0b3IoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJ2aXNpdEFzc2lnbm1lbnRPcGVyYXRvcjogXCIgKyBjdHguZ2V0VGV4dCgpKTtcbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNsaXRlcmFsLlxuICAgIHZpc2l0TGl0ZXJhbChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0TGl0ZXJhbCBbJXNdIDogWyVzXVwiLCBjdHguZ2V0Q2hpbGRDb3VudCgpLCBjdHguZ2V0VGV4dCgpKTtcbiAgICAgICAgdGhpcy5hc3NlcnRUeXBlKGN0eCwgRUNNQVNjcmlwdFBhcnNlci5MaXRlcmFsQ29udGV4dClcbiAgICAgICAgdGhpcy5hc3NlcnROb2RlQ291bnQoY3R4LCAxKTtcbiAgICAgICAgbGV0IG5vZGU6IFJ1bGVDb250ZXh0ID0gY3R4LmdldENoaWxkKDApO1xuICAgICAgICBpZiAobm9kZS5nZXRDaGlsZENvdW50KCkgPT0gMSkge1xuICAgICAgICAgICAgaWYgKG5vZGUgaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLk51bWVyaWNMaXRlcmFsQ29udGV4dCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnZpc2l0TnVtZXJpY0xpdGVyYWwobm9kZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnRocm93SW5zYW5jZUVycm9yKHRoaXMuZHVtcENvbnRleHQobm9kZSkpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKG5vZGUuZ2V0Q2hpbGRDb3VudCgpID09IDApIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNyZWF0ZUxpdGVyYWxWYWx1ZShub2RlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI251bWVyaWNMaXRlcmFsLlxuICAgIHZpc2l0TnVtZXJpY0xpdGVyYWwoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJ2aXNpdE51bWVyaWNMaXRlcmFsIFslc10gOiBbJXNdXCIsIGN0eC5nZXRDaGlsZENvdW50KCksIGN0eC5nZXRUZXh0KCkpO1xuICAgICAgICB0aGlzLmFzc2VydFR5cGUoY3R4LCBFQ01BU2NyaXB0UGFyc2VyLk51bWVyaWNMaXRlcmFsQ29udGV4dClcbiAgICAgICAgdGhpcy5hc3NlcnROb2RlQ291bnQoY3R4LCAxKTtcbiAgICAgICAgbGV0IHZhbHVlID0gY3R4LmdldFRleHQoKTtcbiAgICAgICAgLy8gVE9ETyA6IEZpZ3VyZSBvdXQgYmV0dGVyIHdheVxuICAgICAgICBsZXQgbGl0ZXJhbCA9IG5ldyBMaXRlcmFsKE51bWJlcih2YWx1ZSksIHZhbHVlKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGVjb3JhdGUobGl0ZXJhbCwgdGhpcy5hc01hcmtlcih0aGlzLmFzTWV0YWRhdGEoY3R4LmdldFNvdXJjZUludGVydmFsKCkpKSlcbiAgICB9XG5cbiAgICBjcmVhdGVMaXRlcmFsVmFsdWUoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJjcmVhdGVMaXRlcmFsVmFsdWUgWyVzXTogWyVzXVwiLCBjdHguZ2V0Q2hpbGRDb3VudCgpLCBjdHguZ2V0VGV4dCgpKTtcbiAgICAgICAgbGV0IHZhbHVlID0gY3R4LmdldFRleHQoKTtcbiAgICAgICAgbGV0IGxpdGVyYWwgPSBuZXcgTGl0ZXJhbCh2YWx1ZSwgdmFsdWUpO1xuICAgICAgICByZXR1cm4gdGhpcy5kZWNvcmF0ZShsaXRlcmFsLCB0aGlzLmFzTWFya2VyKHRoaXMuYXNNZXRhZGF0YShjdHguZ2V0U291cmNlSW50ZXJ2YWwoKSkpKVxuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2lkZW50aWZpZXJOYW1lLlxuICAgIHZpc2l0SWRlbnRpZmllck5hbWUoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJ2aXNpdElkZW50aWZpZXJOYW1lOiBcIiArIGN0eC5nZXRUZXh0KCkpO1xuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjcmVzZXJ2ZWRXb3JkLlxuICAgIHZpc2l0UmVzZXJ2ZWRXb3JkKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS5pbmZvKFwidmlzaXRSZXNlcnZlZFdvcmQ6IFwiICsgY3R4LmdldFRleHQoKSk7XG5cblxuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIja2V5d29yZC5cbiAgICB2aXNpdEtleXdvcmQoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJ2aXNpdEtleXdvcmQ6IFwiICsgY3R4LmdldFRleHQoKSk7XG5cblxuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjZnV0dXJlUmVzZXJ2ZWRXb3JkLlxuICAgIHZpc2l0RnV0dXJlUmVzZXJ2ZWRXb3JkKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcblxuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjZ2V0dGVyLlxuICAgIHZpc2l0R2V0dGVyKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcblxuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjc2V0dGVyLlxuICAgIHZpc2l0U2V0dGVyKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcblxuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2Vvcy5cbiAgICB2aXNpdEVvcyhjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIC8vY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcblxuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2VvZi5cbiAgICB2aXNpdEVvZihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG5cbiAgICB9XG5cbn0iXX0=