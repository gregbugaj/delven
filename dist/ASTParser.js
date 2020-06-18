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
      let name = keys[key]; // this only test inheritance

      if (name.endsWith('Context')) {
        if (ctx instanceof _ECMAScriptParser.ECMAScriptParser[name]) {
          context.push(name);
        }
      }
    }

    for (let key in context) {
      let name = context[key];
      let clazz = _ECMAScriptParser.ECMAScriptParser[name];

      if (ctx == clazz.prototype) {
        console.info("Target : " + clazz);
      } // console.info("CLAZZ : "+  key+ " -- "+ clazz.prototype.constructor.)
      //console.info("CLAZZ : "+  key+ " -- " + clazz.prototype)

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
    console.info("visitObjectLiteral [%s] : %s", ctx.getChildCount(), ctx.getText());
    this.assertType(ctx, _ECMAScriptParser.ECMAScriptParser.ObjectLiteralContext); // this.dumpContextAllChildren(ctx)

    let val = this.dumpContext(ctx.getChild(1).getChild(0));
    console.info(val);
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
      } else if (node instanceof _ECMAScriptParser.ECMAScriptParser.ObjectLiteralExpressionContext) {
        exp = this.visitObjectLiteralExpression(node);
      } else if (node instanceof _ECMAScriptParser.ECMAScriptParser.AssignmentExpressionContext) {
        exp = this.visitAssignmentExpression(node);
      } else if (node instanceof _ECMAScriptParser.ECMAScriptParser.AdditiveExpressionContext) {
        let node = exp = this.visitAdditiveExpression(node);
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
    console.info("visitObjectLiteralExpression [%s] : %s", ctx.getChildCount(), ctx.getText());
    this.assertType(ctx, _ECMAScriptParser.ECMAScriptParser.ObjectLiteralExpressionContext);
    let expressions = [];
    let node = ctx.getChild(0);
    this.dumpContextAllChildren(node);
    let obj = this.visitObjectLiteral(node);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9BU1RQYXJzZXIudHMiXSwibmFtZXMiOlsiZnMiLCJyZXF1aXJlIiwiUGFyc2VyVHlwZSIsIkFTVFBhcnNlciIsImNvbnN0cnVjdG9yIiwidmlzaXRvciIsIkRlbHZlbkFTVFZpc2l0b3IiLCJnZW5lcmF0ZSIsInNvdXJjZSIsImNvZGUiLCJ0eXBlIiwidmFsdWUiLCJyZWFkRmlsZVN5bmMiLCJjaGFycyIsImFudGxyNCIsIklucHV0U3RyZWFtIiwibGV4ZXIiLCJEZWx2ZW5MZXhlciIsInRva2VucyIsIkNvbW1vblRva2VuU3RyZWFtIiwicGFyc2VyIiwiRGVsdmVuUGFyc2VyIiwidHJlZSIsInByb2dyYW0iLCJhY2NlcHQiLCJQcmludFZpc2l0b3IiLCJjb25zb2xlIiwiaW5mbyIsInJlc3VsdCIsInBhcnNlIiwiRUNNQVNjcmlwdCIsIkFTVFBhcnNlckRlZmF1bHQiLCJFcnJvciIsIkRlbHZlblZpc2l0b3IiLCJydWxlVHlwZU1hcCIsIk1hcCIsInNldHVwVHlwZVJ1bGVzIiwia2V5cyIsIk9iamVjdCIsImdldE93blByb3BlcnR5TmFtZXMiLCJFQ01BU2NyaXB0UGFyc2VyIiwia2V5IiwibmFtZSIsInN0YXJ0c1dpdGgiLCJzZXQiLCJwYXJzZUludCIsImR1bXBDb250ZXh0IiwiY3R4IiwiY29udGV4dCIsImVuZHNXaXRoIiwicHVzaCIsImNsYXp6IiwicHJvdG90eXBlIiwiZHVtcENvbnRleHRBbGxDaGlsZHJlbiIsImluZGVudCIsInBhZCIsInBhZFN0YXJ0Iiwibm9kZXMiLCJsZW5ndGgiLCJpIiwiZ2V0Q2hpbGRDb3VudCIsImNoaWxkIiwiZ2V0Q2hpbGQiLCJnZXRSdWxlQnlJZCIsImlkIiwiZ2V0IiwiYXNNYXJrZXIiLCJtZXRhZGF0YSIsImluZGV4IiwibGluZSIsImNvbHVtbiIsImRlY29yYXRlIiwibm9kZSIsIm1hcmtlciIsInN0YXJ0IiwiZW5kIiwidGhyb3dUeXBlRXJyb3IiLCJ0eXBlSWQiLCJUeXBlRXJyb3IiLCJ0aHJvd0luc2FuY2VFcnJvciIsImFzc2VydFR5cGUiLCJ2aXNpdFByb2dyYW0iLCJnZXRUZXh0Iiwic3RhdGVtZW50cyIsInN0bSIsIlN0YXRlbWVudENvbnRleHQiLCJzdGF0ZW1lbnQiLCJ2aXNpdFN0YXRlbWVudCIsImludGVydmFsIiwiZ2V0U291cmNlSW50ZXJ2YWwiLCJzY3JpcHQiLCJTY3JpcHQiLCJhc01ldGFkYXRhIiwiRXhwcmVzc2lvblN0YXRlbWVudENvbnRleHQiLCJ2aXNpdEV4cHJlc3Npb25TdGF0ZW1lbnQiLCJWYXJpYWJsZVN0YXRlbWVudENvbnRleHQiLCJ2aXNpdFZhcmlhYmxlU3RhdGVtZW50IiwiQmxvY2tDb250ZXh0IiwidmlzaXRCbG9jayIsIkVtcHR5U3RhdGVtZW50Q29udGV4dCIsImJvZHkiLCJTdGF0ZW1lbnRMaXN0Q29udGV4dCIsInN0YXRlbWVudExpc3QiLCJ2aXNpdFN0YXRlbWVudExpc3QiLCJCbG9ja1N0YXRlbWVudCIsInJ1bGVJbmRleCIsIlJVTEVfc3RhdGVtZW50IiwidW5kZWZpbmVkIiwidmlzaXRWYXJpYWJsZURlY2xhcmF0aW9uTGlzdCIsInRyYWNlIiwidmlzaXRWYXJpYWJsZURlY2xhcmF0aW9uIiwidmlzaXRJbml0aWFsaXNlciIsInZpc2l0RW1wdHlTdGF0ZW1lbnQiLCJnZXRSdWxlVHlwZSIsImFzc2VydE5vZGVDb3VudCIsImNvdW50IiwiZXhwIiwiRXhwcmVzc2lvblNlcXVlbmNlQ29udGV4dCIsInZpc2l0RXhwcmVzc2lvblNlcXVlbmNlIiwib2Zmc2V0Iiwic3RvcCIsInZpc2l0SWZTdGF0ZW1lbnQiLCJ2aXNpdERvU3RhdGVtZW50IiwidmlzaXRXaGlsZVN0YXRlbWVudCIsInZpc2l0Rm9yU3RhdGVtZW50IiwidmlzaXRGb3JWYXJTdGF0ZW1lbnQiLCJ2aXNpdEZvckluU3RhdGVtZW50IiwidmlzaXRGb3JWYXJJblN0YXRlbWVudCIsInZpc2l0Q29udGludWVTdGF0ZW1lbnQiLCJ2aXNpdEJyZWFrU3RhdGVtZW50IiwidmlzaXRSZXR1cm5TdGF0ZW1lbnQiLCJ2aXNpdFdpdGhTdGF0ZW1lbnQiLCJ2aXNpdFN3aXRjaFN0YXRlbWVudCIsInZpc2l0Q2FzZUJsb2NrIiwidmlzaXRDYXNlQ2xhdXNlcyIsInZpc2l0Q2FzZUNsYXVzZSIsInZpc2l0RGVmYXVsdENsYXVzZSIsInZpc2l0TGFiZWxsZWRTdGF0ZW1lbnQiLCJ2aXNpdFRocm93U3RhdGVtZW50IiwidmlzaXRUcnlTdGF0ZW1lbnQiLCJ2aXNpdENhdGNoUHJvZHVjdGlvbiIsInZpc2l0RmluYWxseVByb2R1Y3Rpb24iLCJ2aXNpdERlYnVnZ2VyU3RhdGVtZW50IiwidmlzaXRGdW5jdGlvbkRlY2xhcmF0aW9uIiwidmlzaXRGb3JtYWxQYXJhbWV0ZXJMaXN0IiwidmlzaXRGdW5jdGlvbkJvZHkiLCJ2aXNpdEFycmF5TGl0ZXJhbCIsIkFycmF5TGl0ZXJhbENvbnRleHQiLCJlbGVtZW50TGlzdCIsImVsZW1lbnRzIiwidmlzaXRFbGVtZW50TGlzdCIsImVsaXNpb25WYWx1ZXMiLCJlbGlzaW9uIiwidmlzaXRFbGlzaW9uIiwibGl0ZXJhbHMiLCJjb25jYXQiLCJFbGVtZW50TGlzdENvbnRleHQiLCJzeW1ib2wiLCJlbGVtIiwiSWRlbnRpZmllckV4cHJlc3Npb25Db250ZXh0IiwidmlzaXRJZGVudGlmaWVyRXhwcmVzc2lvbiIsIkxpdGVyYWxFeHByZXNzaW9uQ29udGV4dCIsInZpc2l0TGl0ZXJhbEV4cHJlc3Npb24iLCJBZGRpdGl2ZUV4cHJlc3Npb25Db250ZXh0IiwidmlzaXRBZGRpdGl2ZUV4cHJlc3Npb24iLCJNdWx0aXBsaWNhdGl2ZUV4cHJlc3Npb25Db250ZXh0IiwidmlzaXRNdWx0aXBsaWNhdGl2ZUV4cHJlc3Npb24iLCJFbGlzaW9uQ29udGV4dCIsInZpc2l0T2JqZWN0TGl0ZXJhbCIsIk9iamVjdExpdGVyYWxDb250ZXh0IiwidmFsIiwidmlzaXRQcm9wZXJ0eU5hbWVBbmRWYWx1ZUxpc3QiLCJ2aXNpdFByb3BlcnR5RXhwcmVzc2lvbkFzc2lnbm1lbnQiLCJ2aXNpdFByb3BlcnR5R2V0dGVyIiwidmlzaXRQcm9wZXJ0eVNldHRlciIsInZpc2l0UHJvcGVydHlOYW1lIiwidmlzaXRQcm9wZXJ0eVNldFBhcmFtZXRlckxpc3QiLCJ2aXNpdEFyZ3VtZW50cyIsInZpc2l0QXJndW1lbnRMaXN0IiwiZXhwcmVzc2lvbnMiLCJPYmplY3RMaXRlcmFsRXhwcmVzc2lvbkNvbnRleHQiLCJ2aXNpdE9iamVjdExpdGVyYWxFeHByZXNzaW9uIiwiQXNzaWdubWVudEV4cHJlc3Npb25Db250ZXh0IiwidmlzaXRBc3NpZ25tZW50RXhwcmVzc2lvbiIsIkFycmF5TGl0ZXJhbEV4cHJlc3Npb25Db250ZXh0IiwidmlzaXRBcnJheUxpdGVyYWxFeHByZXNzaW9uIiwiRXhwcmVzc2lvblN0YXRlbWVudCIsIlNlcXVlbmNlRXhwcmVzc2lvbiIsInZpc2l0VGVybmFyeUV4cHJlc3Npb24iLCJ2aXNpdExvZ2ljYWxBbmRFeHByZXNzaW9uIiwidmlzaXRQcmVJbmNyZW1lbnRFeHByZXNzaW9uIiwib2JqIiwidmlzaXRJbkV4cHJlc3Npb24iLCJ2aXNpdExvZ2ljYWxPckV4cHJlc3Npb24iLCJ2aXNpdE5vdEV4cHJlc3Npb24iLCJ2aXNpdFByZURlY3JlYXNlRXhwcmVzc2lvbiIsInZpc2l0QXJndW1lbnRzRXhwcmVzc2lvbiIsInZpc2l0VGhpc0V4cHJlc3Npb24iLCJ2aXNpdEZ1bmN0aW9uRXhwcmVzc2lvbiIsInZpc2l0VW5hcnlNaW51c0V4cHJlc3Npb24iLCJ2aXNpdFBvc3REZWNyZWFzZUV4cHJlc3Npb24iLCJpbml0aWFsaXNlciIsIm9wZXJhdG9yIiwiZXhwcmVzc2lvbiIsImxocyIsInJocyIsIkFzc2lnbm1lbnRFeHByZXNzaW9uIiwidmlzaXRUeXBlb2ZFeHByZXNzaW9uIiwidmlzaXRJbnN0YW5jZW9mRXhwcmVzc2lvbiIsInZpc2l0VW5hcnlQbHVzRXhwcmVzc2lvbiIsInZpc2l0RGVsZXRlRXhwcmVzc2lvbiIsInZpc2l0RXF1YWxpdHlFeHByZXNzaW9uIiwidmlzaXRCaXRYT3JFeHByZXNzaW9uIiwibGVmdCIsInJpZ2h0IiwidmlzaXRCaW5hcnlFeHByZXNzaW9uIiwiQmluYXJ5RXhwcmVzc2lvbiIsInZpc2l0Qml0U2hpZnRFeHByZXNzaW9uIiwidmlzaXRQYXJlbnRoZXNpemVkRXhwcmVzc2lvbiIsIl92aXNpdEJpbmFyeUV4cHJlc3Npb24iLCJ2aXNpdFJlbGF0aW9uYWxFeHByZXNzaW9uIiwidmlzaXRQb3N0SW5jcmVtZW50RXhwcmVzc2lvbiIsInZpc2l0Qml0Tm90RXhwcmVzc2lvbiIsInZpc2l0TmV3RXhwcmVzc2lvbiIsIkxpdGVyYWxDb250ZXh0IiwidmlzaXRMaXRlcmFsIiwiTnVtZXJpY0xpdGVyYWxDb250ZXh0IiwidmlzaXROdW1lcmljTGl0ZXJhbCIsIkFycmF5RXhwcmVzc2lvbiIsInZpc2l0TWVtYmVyRG90RXhwcmVzc2lvbiIsInZpc2l0TWVtYmVySW5kZXhFeHByZXNzaW9uIiwiSWRlbnRpZmllciIsInZpc2l0Qml0QW5kRXhwcmVzc2lvbiIsInZpc2l0Qml0T3JFeHByZXNzaW9uIiwidmlzaXRBc3NpZ25tZW50T3BlcmF0b3JFeHByZXNzaW9uIiwidmlzaXRWb2lkRXhwcmVzc2lvbiIsInZpc2l0QXNzaWdubWVudE9wZXJhdG9yIiwiY3JlYXRlTGl0ZXJhbFZhbHVlIiwibGl0ZXJhbCIsIkxpdGVyYWwiLCJOdW1iZXIiLCJ2aXNpdElkZW50aWZpZXJOYW1lIiwidmlzaXRSZXNlcnZlZFdvcmQiLCJ2aXNpdEtleXdvcmQiLCJ2aXNpdEZ1dHVyZVJlc2VydmVkV29yZCIsInZpc2l0R2V0dGVyIiwidmlzaXRTZXR0ZXIiLCJ2aXNpdEVvcyIsInZpc2l0RW9mIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBRUE7O0FBRUE7Ozs7OztBQUlBLElBQUlBLEVBQUUsR0FBR0MsT0FBTyxDQUFDLElBQUQsQ0FBaEI7QUFFQTs7Ozs7Ozs7OztJQVFZQyxVOzs7V0FBQUEsVTtBQUFBQSxFQUFBQSxVLENBQUFBLFU7R0FBQUEsVSww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QVEsQ0FBQ3hNLEdBQUQsRUFBbUIsQ0FHMUIsQ0FITyxDQUNKO0FBSUo7OztBQUNBeU0sRUFBQUEsUUFBUSxDQUFDek0sR0FBRCxFQUFtQjtBQUN2QnJCLElBQUFBLE9BQU8sQ0FBQ21GLEtBQVIsQ0FBYyxpQkFBZDtBQUVIOztBQXo5QitDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgYW50bHI0IGZyb20gXCJhbnRscjRcIlxuaW1wb3J0IHsgRUNNQVNjcmlwdFZpc2l0b3IgYXMgRGVsdmVuVmlzaXRvciB9IGZyb20gXCIuL3BhcnNlci9FQ01BU2NyaXB0VmlzaXRvclwiXG5pbXBvcnQgeyBFQ01BU2NyaXB0UGFyc2VyIGFzIERlbHZlblBhcnNlciwgRUNNQVNjcmlwdFBhcnNlciB9IGZyb20gXCIuL3BhcnNlci9FQ01BU2NyaXB0UGFyc2VyXCJcbmltcG9ydCB7IEVDTUFTY3JpcHRMZXhlciBhcyBEZWx2ZW5MZXhlciB9IGZyb20gXCIuL3BhcnNlci9FQ01BU2NyaXB0TGV4ZXJcIlxuaW1wb3J0IHsgUnVsZUNvbnRleHQgfSBmcm9tIFwiYW50bHI0L1J1bGVDb250ZXh0XCJcbmltcG9ydCB7IFByaW50VmlzaXRvciB9IGZyb20gXCIuL1ByaW50VmlzaXRvclwiXG5pbXBvcnQgQVNUTm9kZSBmcm9tIFwiLi9BU1ROb2RlXCI7XG5pbXBvcnQgeyBFeHByZXNzaW9uU3RhdGVtZW50LCBMaXRlcmFsLCBTY3JpcHQsIEJsb2NrU3RhdGVtZW50LCBTdGF0ZW1lbnQsIFNlcXVlbmNlRXhwcmVzc2lvbiwgVGhyb3dTdGF0ZW1lbnQsIEFzc2lnbm1lbnRFeHByZXNzaW9uLCBJZGVudGlmaWVyLCBCaW5hcnlFeHByZXNzaW9uLCBBcnJheUV4cHJlc3Npb24gfSBmcm9tIFwiLi9ub2Rlc1wiO1xuaW1wb3J0IHsgU3ludGF4IH0gZnJvbSBcIi4vc3ludGF4XCI7XG5pbXBvcnQgeyB0eXBlIH0gZnJvbSBcIm9zXCJcbmltcG9ydCB7IEludGVydmFsIH0gZnJvbSBcImFudGxyNFwiXG5sZXQgZnMgPSByZXF1aXJlKFwiZnNcIik7XG5cbi8qKlxuICogVmVyc2lvbiB0aGF0IHdlIGdlbmVyYXRlIHRoZSBBU1QgZm9yLiBcbiAqIFRoaXMgYWxsb3dzIGZvciB0ZXN0aW5nIGRpZmZlcmVudCBpbXBsZW1lbnRhdGlvbnNcbiAqIFxuICogQ3VycmVudGx5IG9ubHkgRUNNQVNjcmlwdCBpcyBzdXBwb3J0ZWRcbiAqIFxuICogaHR0cHM6Ly9naXRodWIuY29tL2VzdHJlZS9lc3RyZWVcbiAqL1xuZXhwb3J0IGVudW0gUGFyc2VyVHlwZSB7IEVDTUFTY3JpcHQgfVxuZXhwb3J0IHR5cGUgU291cmNlVHlwZSA9IFwiY29kZVwiIHwgXCJmaWxlbmFtZVwiO1xuZXhwb3J0IHR5cGUgU291cmNlQ29kZSA9IHtcbiAgICB0eXBlOiBTb3VyY2VUeXBlLFxuICAgIHZhbHVlOiBzdHJpbmdcbn1cbmV4cG9ydCBpbnRlcmZhY2UgTWFya2VyIHtcbiAgICBpbmRleDogbnVtYmVyO1xuICAgIGxpbmU6IG51bWJlcjtcbiAgICBjb2x1bW46IG51bWJlcjtcbn1cblxuZXhwb3J0IGRlZmF1bHQgYWJzdHJhY3QgY2xhc3MgQVNUUGFyc2VyIHtcbiAgICBwcml2YXRlIHZpc2l0b3I6ICh0eXBlb2YgRGVsdmVuVmlzaXRvciB8IG51bGwpXG5cbiAgICBjb25zdHJ1Y3Rvcih2aXNpdG9yPzogRGVsdmVuQVNUVmlzaXRvcikge1xuICAgICAgICB0aGlzLnZpc2l0b3IgPSB2aXNpdG9yIHx8IG5ldyBEZWx2ZW5BU1RWaXNpdG9yKCk7XG4gICAgfVxuXG4gICAgZ2VuZXJhdGUoc291cmNlOiBTb3VyY2VDb2RlKTogQVNUTm9kZSB7XG4gICAgICAgIGxldCBjb2RlO1xuICAgICAgICBzd2l0Y2ggKHNvdXJjZS50eXBlKSB7XG4gICAgICAgICAgICBjYXNlIFwiY29kZVwiOlxuICAgICAgICAgICAgICAgIGNvZGUgPSBzb3VyY2UudmFsdWU7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwiZmlsZW5hbWVcIjpcbiAgICAgICAgICAgICAgICBjb2RlID0gZnMucmVhZEZpbGVTeW5jKHNvdXJjZS52YWx1ZSwgXCJ1dGY4XCIpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGNoYXJzID0gbmV3IGFudGxyNC5JbnB1dFN0cmVhbShjb2RlKTtcbiAgICAgICAgbGV0IGxleGVyID0gbmV3IERlbHZlbkxleGVyKGNoYXJzKTtcbiAgICAgICAgbGV0IHRva2VucyA9IG5ldyBhbnRscjQuQ29tbW9uVG9rZW5TdHJlYW0obGV4ZXIpO1xuICAgICAgICBsZXQgcGFyc2VyID0gbmV3IERlbHZlblBhcnNlcih0b2tlbnMpO1xuICAgICAgICBsZXQgdHJlZSA9IHBhcnNlci5wcm9ncmFtKCk7XG4gICAgICAgIC8vIGNvbnNvbGUuaW5mbyh0cmVlLnRvU3RyaW5nVHJlZSgpKVxuICAgICAgICB0cmVlLmFjY2VwdChuZXcgUHJpbnRWaXNpdG9yKCkpO1xuICAgICAgICBjb25zb2xlLmluZm8oXCItLS0tLS0tLS0tLS0tLS0tLS0tLS1cIik7XG4gICAgICAgIGxldCByZXN1bHQgPSB0cmVlLmFjY2VwdCh0aGlzLnZpc2l0b3IpO1xuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFBhcnNlIHNvdXJjZSBhbmQgZ2VuZXJlYXRlIEFTVCB0cmVlXG4gICAgICogQHBhcmFtIHNvdXJjZSBcbiAgICAgKiBAcGFyYW0gdHlwZSBcbiAgICAgKi9cbiAgICBzdGF0aWMgcGFyc2Uoc291cmNlOiBTb3VyY2VDb2RlLCB0eXBlPzogUGFyc2VyVHlwZSk6IEFTVE5vZGUge1xuICAgICAgICBpZiAodHlwZSA9PSBudWxsKVxuICAgICAgICAgICAgdHlwZSA9IFBhcnNlclR5cGUuRUNNQVNjcmlwdDtcbiAgICAgICAgbGV0IHBhcnNlcjtcbiAgICAgICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICAgICAgICBjYXNlIFBhcnNlclR5cGUuRUNNQVNjcmlwdDpcbiAgICAgICAgICAgICAgICBwYXJzZXIgPSBuZXcgQVNUUGFyc2VyRGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJVbmtvd24gcGFyc2VyIHR5cGVcIik7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcGFyc2VyLmdlbmVyYXRlKHNvdXJjZSlcbiAgICB9XG59XG5cbmNsYXNzIEFTVFBhcnNlckRlZmF1bHQgZXh0ZW5kcyBBU1RQYXJzZXIge1xuXG59XG5cbmV4cG9ydCBjbGFzcyBEZWx2ZW5BU1RWaXNpdG9yIGV4dGVuZHMgRGVsdmVuVmlzaXRvciB7XG4gICAgcHJpdmF0ZSBydWxlVHlwZU1hcDogTWFwPG51bWJlciwgc3RyaW5nPiA9IG5ldyBNYXAoKTtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLnNldHVwVHlwZVJ1bGVzKCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzZXR1cFR5cGVSdWxlcygpIHtcbiAgICAgICAgY29uc3Qga2V5cyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKEVDTUFTY3JpcHRQYXJzZXIpO1xuICAgICAgICBmb3IgKHZhciBrZXkgaW4ga2V5cykge1xuICAgICAgICAgICAgbGV0IG5hbWUgPSBrZXlzW2tleV07XG4gICAgICAgICAgICBpZiAobmFtZS5zdGFydHNXaXRoKCdSVUxFXycpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5ydWxlVHlwZU1hcC5zZXQocGFyc2VJbnQoRUNNQVNjcmlwdFBhcnNlcltuYW1lXSksIG5hbWUpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGR1bXBDb250ZXh0KGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc3Qga2V5cyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKEVDTUFTY3JpcHRQYXJzZXIpO1xuICAgICAgICBsZXQgY29udGV4dCA9IFtdXG4gICAgICAgIFxuICAgICAgICBmb3IgKHZhciBrZXkgaW4ga2V5cykge1xuICAgICAgICAgICAgbGV0IG5hbWUgPSBrZXlzW2tleV07XG4gICAgICAgICAgICAvLyB0aGlzIG9ubHkgdGVzdCBpbmhlcml0YW5jZVxuICAgICAgICAgICAgaWYgKG5hbWUuZW5kc1dpdGgoJ0NvbnRleHQnKSkge1xuICAgICAgICAgICAgICAgIGlmIChjdHggaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyW25hbWVdKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRleHQucHVzaChuYW1lKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIGZvcihsZXQga2V5IGluIGNvbnRleHQpe1xuICAgICAgICAgICAgbGV0IG5hbWUgPSBjb250ZXh0W2tleV07XG4gICAgICAgICAgICBsZXQgY2xhenogPSAgRUNNQVNjcmlwdFBhcnNlcltuYW1lXTtcbiAgICAgICAgICAgIGlmKGN0eCA9PSBjbGF6ei5wcm90b3R5cGUpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmluZm8oXCJUYXJnZXQgOiBcIiArIGNsYXp6KVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyBjb25zb2xlLmluZm8oXCJDTEFaWiA6IFwiKyAga2V5KyBcIiAtLSBcIisgY2xhenoucHJvdG90eXBlLmNvbnN0cnVjdG9yLilcbiAgICAgICAgICAgIC8vY29uc29sZS5pbmZvKFwiQ0xBWlogOiBcIisgIGtleSsgXCIgLS0gXCIgKyBjbGF6ei5wcm90b3R5cGUpXG5cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAgY29udGV4dDtcbiAgICB9XG5cbiAgICBwcml2YXRlIGR1bXBDb250ZXh0QWxsQ2hpbGRyZW4oY3R4OiBSdWxlQ29udGV4dCwgaW5kZW50OiBudW1iZXIgPSAwKSB7XG4gICAgICAgIGxldCBwYWQgPSBcIiBcIi5wYWRTdGFydChpbmRlbnQsIFwiXFx0XCIpO1xuICAgICAgICBsZXQgbm9kZXMgPSB0aGlzLmR1bXBDb250ZXh0KGN0eCk7XG4gICAgICAgIGlmIChub2Rlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBjb25zb2xlLmluZm8ocGFkICsgXCIgKiBcIiArIG5vZGVzKVxuICAgICAgICB9XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY3R4LmdldENoaWxkQ291bnQoKTsgKytpKSB7XG4gICAgICAgICAgICBsZXQgY2hpbGQgPSBjdHg/LmdldENoaWxkKGkpO1xuICAgICAgICAgICAgaWYgKGNoaWxkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5kdW1wQ29udGV4dEFsbENoaWxkcmVuKGNoaWxkLCArK2luZGVudCk7XG4gICAgICAgICAgICAgICAgLS1pbmRlbnQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXQgcnVsZSBuYW1lIGJ5IHRoZSBJZFxuICAgICAqIEBwYXJhbSBpZCBcbiAgICAgKi9cbiAgICBnZXRSdWxlQnlJZChpZDogbnVtYmVyKTogc3RyaW5nIHwgdW5kZWZpbmVkIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucnVsZVR5cGVNYXAuZ2V0KGlkKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFzTWFya2VyKG1ldGFkYXRhOiBhbnkpIHtcbiAgICAgICAgcmV0dXJuIHsgaW5kZXg6IDEsIGxpbmU6IDEsIGNvbHVtbjogMSB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBkZWNvcmF0ZShub2RlOiBhbnksIG1hcmtlcjogTWFya2VyKTogYW55IHtcbiAgICAgICAgbm9kZS5zdGFydCA9IDA7XG4gICAgICAgIG5vZGUuZW5kID0gMDtcbiAgICAgICAgcmV0dXJuIG5vZGU7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSB0aHJvd1R5cGVFcnJvcih0eXBlSWQ6IGFueSkge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiVW5oYW5kbGVkIHR5cGUgOiBcIiArIHR5cGVJZCArIFwiIDogXCIgKyB0aGlzLmdldFJ1bGVCeUlkKHR5cGVJZCkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRocm93IFR5cGVFcnJvciBvbmx5IHdoZW4gdGhlcmUgaXMgYSB0eXBlIHByb3ZpZGVkLiBcbiAgICAgKiBUaGlzIGlzIHVzZWZ1bGwgd2hlbiB0aGVyZSBub2RlIGl0YSBUZXJtaW5hbE5vZGUgXG4gICAgICogQHBhcmFtIHR5cGUgXG4gICAgICovXG4gICAgcHJpdmF0ZSB0aHJvd0luc2FuY2VFcnJvcih0eXBlOiBhbnkpIHtcbi8qICAgICAgICAgaWYgKHR5cGUgPT0gdW5kZWZpbmVkIHx8IHR5cGUgPT0gXCJcIikge1xuICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH0gKi9cbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlVuaGFuZGxlZCBpbnN0YW5jZSB0eXBlIDogXCIgKyB0eXBlKTtcbiAgICB9XG5cbiAgICBhc3NlcnRUeXBlKGN0eDogUnVsZUNvbnRleHQsIHR5cGU6IGFueSkge1xuICAgICAgICBpZiAoIShjdHggaW5zdGFuY2VvZiB0eXBlKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkludmFsaWQgdHlwZSBleHBlY3RlZCA6ICdcIiArIHR5cGUubmFtZSArIFwiJyByZWNlaXZlZCAnXCIgKyB0aGlzLmR1bXBDb250ZXh0KGN0eCkpICsgXCInXCI7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNwcm9ncmFtLlxuICAgIHZpc2l0UHJvZ3JhbShjdHg6IEVDTUFTY3JpcHRQYXJzZXIuUHJvZ3JhbUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS5pbmZvKFwidmlzaXRQcm9ncmFtIFslc10gOiAlc1wiLCBjdHguZ2V0Q2hpbGRDb3VudCgpLCBjdHguZ2V0VGV4dCgpKTtcbiAgICAgICAgLy8gdmlzaXRQcm9ncmFtIC0+dmlzaXRTb3VyY2VFbGVtZW50cyAtPiB2aXNpdFNvdXJjZUVsZW1lbnQgLT4gdmlzaXRTdGF0ZW1lbnRcbiAgICAgICAgbGV0IHN0YXRlbWVudHM6IGFueSA9IFtdO1xuICAgICAgICBsZXQgbm9kZSA9IGN0eC5nZXRDaGlsZCgwKTsgIC8vIHZpc2l0UHJvZ3JhbSAtPnZpc2l0U291cmNlRWxlbWVudHMgXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbm9kZS5nZXRDaGlsZENvdW50KCk7ICsraSkge1xuICAgICAgICAgICAgbGV0IHN0bSA9IG5vZGUuZ2V0Q2hpbGQoaSkuZ2V0Q2hpbGQoMCk7IC8vIFNvdXJjZUVsZW1lbnRzQ29udGV4dCA+IFN0YXRlbWVudENvbnRleHRcbiAgICAgICAgICAgIGlmIChzdG0gaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLlN0YXRlbWVudENvbnRleHQpIHtcbiAgICAgICAgICAgICAgICBsZXQgc3RhdGVtZW50ID0gdGhpcy52aXNpdFN0YXRlbWVudChzdG0pO1xuICAgICAgICAgICAgICAgIHN0YXRlbWVudHMucHVzaChzdGF0ZW1lbnQpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnRocm93SW5zYW5jZUVycm9yKHRoaXMuZHVtcENvbnRleHQoc3RtKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGludGVydmFsID0gY3R4LmdldFNvdXJjZUludGVydmFsKCk7XG4gICAgICAgIGxldCBzY3JpcHQgPSBuZXcgU2NyaXB0KHN0YXRlbWVudHMpO1xuICAgICAgICByZXR1cm4gdGhpcy5kZWNvcmF0ZShzY3JpcHQsIHRoaXMuYXNNYXJrZXIodGhpcy5hc01ldGFkYXRhKGludGVydmFsKSkpO1xuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI3N0YXRlbWVudC5cbiAgICB2aXNpdFN0YXRlbWVudChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIHRoaXMuYXNzZXJ0VHlwZShjdHgsIEVDTUFTY3JpcHRQYXJzZXIuU3RhdGVtZW50Q29udGV4dClcbiAgICAgICAgY29uc29sZS5pbmZvKFwidmlzaXRTdGF0ZW1lbnQgWyVzXSA6ICVzXCIsIGN0eC5nZXRDaGlsZENvdW50KCksIGN0eC5nZXRUZXh0KCkpO1xuICAgICAgICBsZXQgbm9kZTogUnVsZUNvbnRleHQgPSBjdHguZ2V0Q2hpbGQoMCk7XG5cbiAgICAgICAgaWYgKG5vZGUgaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLkV4cHJlc3Npb25TdGF0ZW1lbnRDb250ZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy52aXNpdEV4cHJlc3Npb25TdGF0ZW1lbnQobm9kZSk7XG4gICAgICAgIH0gZWxzZSBpZiAobm9kZSBpbnN0YW5jZW9mIEVDTUFTY3JpcHRQYXJzZXIuVmFyaWFibGVTdGF0ZW1lbnRDb250ZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy52aXNpdFZhcmlhYmxlU3RhdGVtZW50KG5vZGUpO1xuICAgICAgICB9IGVsc2UgaWYgKG5vZGUgaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLkJsb2NrQ29udGV4dCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmlzaXRCbG9jayhub2RlKTt9XG4gICAgICAgICBlbHNlIGlmIChub2RlIGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5FbXB0eVN0YXRlbWVudENvbnRleHQpIHtcbiAgICAgICAgICAgIC8vIE5PT1AsXG4gICAgICAgICAgICAvLyB2YXIgeDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMudGhyb3dJbnNhbmNlRXJyb3IodGhpcy5kdW1wQ29udGV4dChub2RlKSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNibG9jay5cbiAgICB2aXNpdEJsb2NrKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS5pbmZvKFwidmlzaXRCbG9jayBbJXNdIDogJXNcIiwgY3R4LmdldENoaWxkQ291bnQoKSwgY3R4LmdldFRleHQoKSk7XG4gICAgICAgIHRoaXMuYXNzZXJ0VHlwZShjdHgsIEVDTUFTY3JpcHRQYXJzZXIuQmxvY2tDb250ZXh0KVxuICAgICAgICBsZXQgYm9keSA9IFtdO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGN0eC5nZXRDaGlsZENvdW50KCk7ICsraSkge1xuICAgICAgICAgICAgbGV0IG5vZGU6IFJ1bGVDb250ZXh0ID0gY3R4LmdldENoaWxkKGkpO1xuICAgICAgICAgICAgaWYgKG5vZGUgaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLlN0YXRlbWVudExpc3RDb250ZXh0KSB7XG4gICAgICAgICAgICAgICAgbGV0IHN0YXRlbWVudExpc3QgPSB0aGlzLnZpc2l0U3RhdGVtZW50TGlzdChub2RlKTtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpbmRleCBpbiBzdGF0ZW1lbnRMaXN0KSB7XG4gICAgICAgICAgICAgICAgICAgIGJvZHkucHVzaChzdGF0ZW1lbnRMaXN0W2luZGV4XSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnRocm93SW5zYW5jZUVycm9yKHRoaXMuZHVtcENvbnRleHQobm9kZSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmRlY29yYXRlKG5ldyBCbG9ja1N0YXRlbWVudChib2R5KSwgdGhpcy5hc01hcmtlcih0aGlzLmFzTWV0YWRhdGEoY3R4LmdldFNvdXJjZUludGVydmFsKCkpKSk7XG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNzdGF0ZW1lbnRMaXN0LlxuICAgIHZpc2l0U3RhdGVtZW50TGlzdChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0U3RhdGVtZW50TGlzdCBbJXNdIDogJXNcIiwgY3R4LmdldENoaWxkQ291bnQoKSwgY3R4LmdldFRleHQoKSk7XG4gICAgICAgIGxldCBib2R5ID0gW107XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY3R4LmdldENoaWxkQ291bnQoKTsgKytpKSB7XG4gICAgICAgICAgICBsZXQgbm9kZTogUnVsZUNvbnRleHQgPSBjdHguZ2V0Q2hpbGQoaSk7XG4gICAgICAgICAgICBsZXQgdHlwZSA9IG5vZGUucnVsZUluZGV4O1xuICAgICAgICAgICAgaWYgKHR5cGUgPT0gRUNNQVNjcmlwdFBhcnNlci5SVUxFX3N0YXRlbWVudCkge1xuICAgICAgICAgICAgICAgIGxldCBzdGF0ZW1lbnQ6IGFueSA9IHRoaXMudmlzaXRTdGF0ZW1lbnQobm9kZSk7XG4gICAgICAgICAgICAgICAgYm9keS5wdXNoKHN0YXRlbWVudCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGUgPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnRocm93VHlwZUVycm9yKHR5cGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBib2R5O1xuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI3ZhcmlhYmxlU3RhdGVtZW50LlxuICAgIHZpc2l0VmFyaWFibGVTdGF0ZW1lbnQoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJ2aXNpdFZhcmlhYmxlU3RhdGVtZW50IFslc10gOiAlc1wiLCBjdHguZ2V0Q2hpbGRDb3VudCgpLCBjdHguZ2V0VGV4dCgpKTtcbiAgICAgICAgdGhpcy5kdW1wQ29udGV4dEFsbENoaWxkcmVuKGN0eClcblxuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI3ZhcmlhYmxlRGVjbGFyYXRpb25MaXN0LlxuICAgIHZpc2l0VmFyaWFibGVEZWNsYXJhdGlvbkxpc3QoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKFwidmlzaXRWYXJpYWJsZURlY2xhcmF0aW9uTGlzdDogXCIgKyBjdHguZ2V0VGV4dCgpKTtcbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciN2YXJpYWJsZURlY2xhcmF0aW9uLlxuICAgIHZpc2l0VmFyaWFibGVEZWNsYXJhdGlvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoXCJ2aXNpdFZhcmlhYmxlRGVjbGFyYXRpb246IFwiICsgY3R4LmdldFRleHQoKSk7XG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNpbml0aWFsaXNlci5cbiAgICB2aXNpdEluaXRpYWxpc2VyKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZShcInZpc2l0SW5pdGlhbGlzZXI6IFwiICsgY3R4LmdldFRleHQoKSk7XG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNlbXB0eVN0YXRlbWVudC5cbiAgICB2aXNpdEVtcHR5U3RhdGVtZW50KGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS5pbmZvKFwidmlzaXRFbXB0eVN0YXRlbWVudFhYOiBcIiArIGN0eC5nZXRUZXh0KCkpO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0UnVsZVR5cGUobm9kZTogYW55LCBpbmRleDogbnVtYmVyKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIG5vZGUuZ2V0Q2hpbGQoaW5kZXgpLnJ1bGVJbmRleDtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFzc2VydE5vZGVDb3VudChjdHg6IFJ1bGVDb250ZXh0LCBjb3VudDogbnVtYmVyKSB7XG4gICAgICAgIGlmIChjdHguZ2V0Q2hpbGRDb3VudCgpICE9IGNvdW50KSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJXcm9uZyBjaGlsZCBjb3VudCwgZXhwZWN0ZWQgJ1wiICsgY291bnQgKyBcIicgZ290IDogXCIgKyBjdHguZ2V0Q2hpbGRDb3VudCgpKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2V4cHJlc3Npb25TdGF0ZW1lbnQuXG4gICAgdmlzaXRFeHByZXNzaW9uU3RhdGVtZW50KGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS5pbmZvKFwidmlzaXRFeHByZXNzaW9uU3RhdGVtZW50OiBcIiArIGN0eC5nZXRUZXh0KCkpO1xuICAgICAgICB0aGlzLmFzc2VydFR5cGUoY3R4LCBFQ01BU2NyaXB0UGFyc2VyLkV4cHJlc3Npb25TdGF0ZW1lbnRDb250ZXh0KVxuICAgICAgICB0aGlzLmFzc2VydE5vZGVDb3VudChjdHgsIDEpO1xuICAgICAgICAvLyB2aXNpdEV4cHJlc3Npb25TdGF0ZW1lbnQ6PnZpc2l0RXhwcmVzc2lvblNlcXVlbmNlXG4gICAgICAgIGxldCBub2RlOiBSdWxlQ29udGV4dCA9IGN0eC5nZXRDaGlsZCgwKTsgLy8gdmlzaXRFeHByZXNzaW9uU2VxdWVuY2UgXG4gICAgICAgIGxldCBleHBcbiAgICAgICAgaWYgKG5vZGUgaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLkV4cHJlc3Npb25TZXF1ZW5jZUNvbnRleHQpIHtcbiAgICAgICAgICAgIGV4cCA9IHRoaXMudmlzaXRFeHByZXNzaW9uU2VxdWVuY2Uobm9kZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnRocm93SW5zYW5jZUVycm9yKHRoaXMuZHVtcENvbnRleHQobm9kZSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGV4cCAvL3RoaXMuZGVjb3JhdGUoZXhwLCB0aGlzLmFzTWFya2VyKHRoaXMuYXNNZXRhZGF0YShjdHguZ2V0U291cmNlSW50ZXJ2YWwoKSkpKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFzTWV0YWRhdGEoaW50ZXJ2YWw6IEludGVydmFsKTogYW55IHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHN0YXJ0OiB7XG4gICAgICAgICAgICAgICAgbGluZTogMSxcbiAgICAgICAgICAgICAgICBjb2x1bW46IGludGVydmFsLnN0YXJ0LFxuICAgICAgICAgICAgICAgIG9mZnNldDogMFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGVuZDoge1xuICAgICAgICAgICAgICAgIGxpbmU6IDEsXG4gICAgICAgICAgICAgICAgY29sdW1uOiBpbnRlcnZhbC5zdG9wLFxuICAgICAgICAgICAgICAgIG9mZnNldDogM1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjaWZTdGF0ZW1lbnQuXG4gICAgdmlzaXRJZlN0YXRlbWVudChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0SWZTdGF0ZW1lbnQ6IFwiICsgY3R4LmdldFRleHQoKSk7XG5cbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI0RvU3RhdGVtZW50LlxuICAgIHZpc2l0RG9TdGF0ZW1lbnQoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJ2aXNpdERvU3RhdGVtZW50OiBcIiArIGN0eC5nZXRUZXh0KCkpO1xuXG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNXaGlsZVN0YXRlbWVudC5cbiAgICB2aXNpdFdoaWxlU3RhdGVtZW50KGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS5pbmZvKFwidmlzaXRXaGlsZVN0YXRlbWVudDogXCIgKyBjdHguZ2V0VGV4dCgpKTtcblxuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjRm9yU3RhdGVtZW50LlxuICAgIHZpc2l0Rm9yU3RhdGVtZW50KGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS5pbmZvKFwidmlzaXRXaGlsZVN0YXRlbWVudDogXCIgKyBjdHguZ2V0VGV4dCgpKTtcblxuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjRm9yVmFyU3RhdGVtZW50LlxuICAgIHZpc2l0Rm9yVmFyU3RhdGVtZW50KGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcblxuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjRm9ySW5TdGF0ZW1lbnQuXG4gICAgdmlzaXRGb3JJblN0YXRlbWVudChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG5cbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI0ZvclZhckluU3RhdGVtZW50LlxuICAgIHZpc2l0Rm9yVmFySW5TdGF0ZW1lbnQoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuXG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNjb250aW51ZVN0YXRlbWVudC5cbiAgICB2aXNpdENvbnRpbnVlU3RhdGVtZW50KGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcblxuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjYnJlYWtTdGF0ZW1lbnQuXG4gICAgdmlzaXRCcmVha1N0YXRlbWVudChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG5cbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI3JldHVyblN0YXRlbWVudC5cbiAgICB2aXNpdFJldHVyblN0YXRlbWVudChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG5cbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI3dpdGhTdGF0ZW1lbnQuXG4gICAgdmlzaXRXaXRoU3RhdGVtZW50KGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcblxuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjc3dpdGNoU3RhdGVtZW50LlxuICAgIHZpc2l0U3dpdGNoU3RhdGVtZW50KGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcblxuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjY2FzZUJsb2NrLlxuICAgIHZpc2l0Q2FzZUJsb2NrKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcblxuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjY2FzZUNsYXVzZXMuXG4gICAgdmlzaXRDYXNlQ2xhdXNlcyhjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG5cbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2Nhc2VDbGF1c2UuXG4gICAgdmlzaXRDYXNlQ2xhdXNlKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcblxuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjZGVmYXVsdENsYXVzZS5cbiAgICB2aXNpdERlZmF1bHRDbGF1c2UoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuXG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNsYWJlbGxlZFN0YXRlbWVudC5cbiAgICB2aXNpdExhYmVsbGVkU3RhdGVtZW50KGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcblxuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjdGhyb3dTdGF0ZW1lbnQuXG4gICAgdmlzaXRUaHJvd1N0YXRlbWVudChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG5cbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI3RyeVN0YXRlbWVudC5cbiAgICB2aXNpdFRyeVN0YXRlbWVudChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG5cbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2NhdGNoUHJvZHVjdGlvbi5cbiAgICB2aXNpdENhdGNoUHJvZHVjdGlvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG5cbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2ZpbmFsbHlQcm9kdWN0aW9uLlxuICAgIHZpc2l0RmluYWxseVByb2R1Y3Rpb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuXG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNkZWJ1Z2dlclN0YXRlbWVudC5cbiAgICB2aXNpdERlYnVnZ2VyU3RhdGVtZW50KGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcblxuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjZnVuY3Rpb25EZWNsYXJhdGlvbi5cbiAgICB2aXNpdEZ1bmN0aW9uRGVjbGFyYXRpb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuXG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNmb3JtYWxQYXJhbWV0ZXJMaXN0LlxuICAgIHZpc2l0Rm9ybWFsUGFyYW1ldGVyTGlzdChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNmdW5jdGlvbkJvZHkuXG4gICAgdmlzaXRGdW5jdGlvbkJvZHkoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJ2aXNpdEZ1bmN0aW9uQm9keTogXCIgKyBjdHguZ2V0VGV4dCgpKTtcbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2FycmF5TGl0ZXJhbC5cbiAgICB2aXNpdEFycmF5TGl0ZXJhbChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0QXJyYXlMaXRlcmFsIFslc10gOiAlc1wiLCBjdHguZ2V0Q2hpbGRDb3VudCgpLCBjdHguZ2V0VGV4dCgpKTtcbiAgICAgICAgdGhpcy5hc3NlcnRUeXBlKGN0eCwgRUNNQVNjcmlwdFBhcnNlci5BcnJheUxpdGVyYWxDb250ZXh0KVxuICAgICAgICAvLyB0aGlzLmFzc2VydE5vZGVDb3VudChjdHgsIDMpXG4gICAgICAgIGxldCBlbGVtZW50TGlzdCA9IGN0eC5nZXRDaGlsZCgxKTtcbiAgICAgICAgbGV0IGVsZW1lbnRzID0gIHRoaXMudmlzaXRFbGVtZW50TGlzdChlbGVtZW50TGlzdCk7XG4gICAgICAgIGxldCBlbGlzaW9uVmFsdWVzXG4gICAgICAgIGlmKGN0eC5nZXRDaGlsZENvdW50KCkgPT0gNSkge1xuICAgICAgICAgICAgbGV0IGVsaXNpb24gPSBjdHguZ2V0Q2hpbGQoMyk7XG4gICAgICAgICAgICBlbGlzaW9uVmFsdWVzID0gdGhpcy52aXNpdEVsaXNpb24oZWxpc2lvbik7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgbGl0ZXJhbHMgPSBbXTtcbiAgICAgICAgbGl0ZXJhbHMgPSBsaXRlcmFscy5jb25jYXQoZWxlbWVudHMpO1xuICAgICAgICBsaXRlcmFscyA9IGxpdGVyYWxzLmNvbmNhdChlbGlzaW9uVmFsdWVzKTtcbiAgICAgICAgcmV0dXJuIGxpdGVyYWxzO1xuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2VsZW1lbnRMaXN0LlxuICAgIHZpc2l0RWxlbWVudExpc3QoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJ2aXNpdEVsZW1lbnRMaXN0IFslc10gOiAlc1wiLCBjdHguZ2V0Q2hpbGRDb3VudCgpLCBjdHguZ2V0VGV4dCgpKTtcbiAgICAgICAgdGhpcy5hc3NlcnRUeXBlKGN0eCwgRUNNQVNjcmlwdFBhcnNlci5FbGVtZW50TGlzdENvbnRleHQpXG5cbiAgICAgICAgbGV0IGVsZW1lbnRzID0gW107XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY3R4LmdldENoaWxkQ291bnQoKTsgKytpKSB7XG4gICAgICAgICAgICBsZXQgbm9kZSA9IGN0eC5nZXRDaGlsZChpKTtcblxuICAgICAgICAgICAgaWYobm9kZS5zeW1ib2wgIT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBsZXQgZWxlbTtcbiAgICAgICAgICAgIGlmIChub2RlIGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5JZGVudGlmaWVyRXhwcmVzc2lvbkNvbnRleHQpIHtcbiAgICAgICAgICAgICAgICBlbGVtID0gdGhpcy52aXNpdElkZW50aWZpZXJFeHByZXNzaW9uKG5vZGUpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChub2RlIGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5MaXRlcmFsRXhwcmVzc2lvbkNvbnRleHQpIHtcbiAgICAgICAgICAgICAgICBlbGVtID0gdGhpcy52aXNpdExpdGVyYWxFeHByZXNzaW9uKG5vZGUpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChub2RlIGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5BZGRpdGl2ZUV4cHJlc3Npb25Db250ZXh0KSB7XG4gICAgICAgICAgICAgICAgZWxlbSA9IHRoaXMudmlzaXRBZGRpdGl2ZUV4cHJlc3Npb24obm9kZSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG5vZGUgaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLk11bHRpcGxpY2F0aXZlRXhwcmVzc2lvbkNvbnRleHQpIHtcbiAgICAgICAgICAgICAgICBlbGVtID0gdGhpcy52aXNpdE11bHRpcGxpY2F0aXZlRXhwcmVzc2lvbihub2RlKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICB0aGlzLnRocm93SW5zYW5jZUVycm9yKHRoaXMuZHVtcENvbnRleHQobm9kZSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxlbWVudHMucHVzaChlbGVtKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZWxlbWVudHM7XG4gICAgfVxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjZWxpc2lvbi5cbiAgICB2aXNpdEVsaXNpb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJ2aXNpdEVsaXNpb24gWyVzXSA6ICVzXCIsIGN0eC5nZXRDaGlsZENvdW50KCksIGN0eC5nZXRUZXh0KCkpO1xuICAgICAgICB0aGlzLmFzc2VydFR5cGUoY3R4LCBFQ01BU2NyaXB0UGFyc2VyLkVsaXNpb25Db250ZXh0KVxuICAgICAgICAvLyBjb21wbGlhbmNlOiBlc3ByaW1hIGNvbXBsaWFuZSBvciByZXR1cm5pbmcgYG51bGxgIFxuICAgICAgICBsZXQgZWxpc2lvbiA9IFtdO1xuICAgICAgICBmb3IobGV0IGkgPSAwOyBpIDwgY3R4LmdldENoaWxkQ291bnQoKTsgKytpKSB7XG4gICAgICAgICAgICBlbGlzaW9uLnB1c2gobnVsbCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGVsaXNpb247XG4gICAgfVxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjb2JqZWN0TGl0ZXJhbC5cbiAgICB2aXNpdE9iamVjdExpdGVyYWwoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJ2aXNpdE9iamVjdExpdGVyYWwgWyVzXSA6ICVzXCIsIGN0eC5nZXRDaGlsZENvdW50KCksIGN0eC5nZXRUZXh0KCkpO1xuICAgICAgICB0aGlzLmFzc2VydFR5cGUoY3R4LCBFQ01BU2NyaXB0UGFyc2VyLk9iamVjdExpdGVyYWxDb250ZXh0KTtcbiAgICAgICAgLy8gdGhpcy5kdW1wQ29udGV4dEFsbENoaWxkcmVuKGN0eClcbiAgICAgICAgbGV0IHZhbCA9IHRoaXMuZHVtcENvbnRleHQoY3R4LmdldENoaWxkKDEpLmdldENoaWxkKDApKTtcbiAgICAgICAgY29uc29sZS5pbmZvKHZhbClcbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNwcm9wZXJ0eU5hbWVBbmRWYWx1ZUxpc3QuXG4gICAgdmlzaXRQcm9wZXJ0eU5hbWVBbmRWYWx1ZUxpc3QoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjUHJvcGVydHlFeHByZXNzaW9uQXNzaWdubWVudC5cbiAgICB2aXNpdFByb3BlcnR5RXhwcmVzc2lvbkFzc2lnbm1lbnQoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuXG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNQcm9wZXJ0eUdldHRlci5cbiAgICB2aXNpdFByb3BlcnR5R2V0dGVyKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcblxuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjUHJvcGVydHlTZXR0ZXIuXG4gICAgdmlzaXRQcm9wZXJ0eVNldHRlcihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG5cbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI3Byb3BlcnR5TmFtZS5cbiAgICB2aXNpdFByb3BlcnR5TmFtZShjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG5cbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI3Byb3BlcnR5U2V0UGFyYW1ldGVyTGlzdC5cbiAgICB2aXNpdFByb3BlcnR5U2V0UGFyYW1ldGVyTGlzdChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG5cbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2FyZ3VtZW50cy5cbiAgICB2aXNpdEFyZ3VtZW50cyhjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0QXJndW1lbnRzOiBcIiArIGN0eC5nZXRUZXh0KCkpO1xuXG4gICAgfVxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjYXJndW1lbnRMaXN0LlxuICAgIHZpc2l0QXJndW1lbnRMaXN0KGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS5pbmZvKFwidmlzaXRBcmd1bWVudExpc3Q6IFwiICsgY3R4LmdldFRleHQoKSk7XG4gICAgfVxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjZXhwcmVzc2lvblNlcXVlbmNlLlxuICAgIHZpc2l0RXhwcmVzc2lvblNlcXVlbmNlKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS5pbmZvKFwidmlzaXRFeHByZXNzaW9uU2VxdWVuY2UgWyVzXSA6IFslc11cIiwgY3R4LmdldENoaWxkQ291bnQoKSwgY3R4LmdldFRleHQoKSk7XG4gICAgICAgIHRoaXMuYXNzZXJ0VHlwZShjdHgsIEVDTUFTY3JpcHRQYXJzZXIuRXhwcmVzc2lvblNlcXVlbmNlQ29udGV4dCk7XG4gICAgICAgIGxldCBleHByZXNzaW9ucyA9IFtdO1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY3R4LmdldENoaWxkQ291bnQoKTsgKytpKSB7XG4gICAgICAgICAgICBsZXQgbm9kZTogUnVsZUNvbnRleHQgPSBjdHguZ2V0Q2hpbGQoaSk7XG4gICAgICAgICAgICBsZXQgZXhwO1xuICAgICAgICAgICAgaWYgKG5vZGUgaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLkxpdGVyYWxFeHByZXNzaW9uQ29udGV4dCkge1xuICAgICAgICAgICAgICAgIGV4cCA9IHRoaXMudmlzaXRMaXRlcmFsRXhwcmVzc2lvbihub2RlKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAobm9kZSBpbnN0YW5jZW9mIEVDTUFTY3JpcHRQYXJzZXIuT2JqZWN0TGl0ZXJhbEV4cHJlc3Npb25Db250ZXh0KSB7XG4gICAgICAgICAgICAgICAgZXhwID0gdGhpcy52aXNpdE9iamVjdExpdGVyYWxFeHByZXNzaW9uKG5vZGUpO1xuICAgICAgICAgICAgfWVsc2UgaWYgKG5vZGUgaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLkFzc2lnbm1lbnRFeHByZXNzaW9uQ29udGV4dCkge1xuICAgICAgICAgICAgICAgIGV4cCA9IHRoaXMudmlzaXRBc3NpZ25tZW50RXhwcmVzc2lvbihub2RlKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAobm9kZSBpbnN0YW5jZW9mIEVDTUFTY3JpcHRQYXJzZXIuQWRkaXRpdmVFeHByZXNzaW9uQ29udGV4dCkge1xuICAgICAgICAgICAgICAgIGxldCBub2RlID0gZXhwID0gdGhpcy52aXNpdEFkZGl0aXZlRXhwcmVzc2lvbihub2RlKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAobm9kZSBpbnN0YW5jZW9mIEVDTUFTY3JpcHRQYXJzZXIuTXVsdGlwbGljYXRpdmVFeHByZXNzaW9uQ29udGV4dCkge1xuICAgICAgICAgICAgICAgIGV4cCA9IHRoaXMudmlzaXRNdWx0aXBsaWNhdGl2ZUV4cHJlc3Npb24obm9kZSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG5vZGUgaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLkFycmF5TGl0ZXJhbEV4cHJlc3Npb25Db250ZXh0KSB7XG4gICAgICAgICAgICAgICAgZXhwID0gdGhpcy52aXNpdEFycmF5TGl0ZXJhbEV4cHJlc3Npb24obm9kZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMudGhyb3dJbnNhbmNlRXJyb3IodGhpcy5kdW1wQ29udGV4dChub2RlKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBleHByZXNzaW9ucy5wdXNoKGV4cCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gY29tcGxpYW5jZTogZXNwaXJtYSwgZXNwcmVlXG4gICAgICAgIC8vIHRoaXMgY2hlY2sgdG8gc2VlIGlmIHRoZXJlIGFyZSBtdWx0aXBsZSBleHByZXNzaW9ucyBpZiBzbyB0aGVuIHdlIGxlYXZlIHRoZW0gYXMgU2VxdWVuY2VFeHByZXNzaW9uIFxuICAgICAgICAvLyBvdGhlcndpc2Ugd2Ugd2lsbCByb2xsIHRoZW0gdXAgaW50byBFeHByZXNzaW9uU3RhdGVtZW50IHdpdGggb25lIGV4cHJlc3Npb25cbiAgICAgICAgLy8gYDFgID0gRXhwcmVzc2lvblN0YXRlbWVudCAtPiBMaXRlcmFsXG4gICAgICAgIC8vIGAxLCAyYCA9IEV4cHJlc3Npb25TdGF0ZW1lbnQgLT4gU2VxdWVuY2VFeHByZXNzaW9uIC0+IExpdGVyYWwsIExpdGVyYWxcbiAgICAgICAgbGV0IGV4cDtcbiAgICAgICAgaWYgKGV4cHJlc3Npb25zLmxlbmd0aCA9PSAxKSB7XG4gICAgICAgICAgICBleHAgPSBuZXcgRXhwcmVzc2lvblN0YXRlbWVudChleHByZXNzaW9uc1swXSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGV4cCA9IG5ldyBTZXF1ZW5jZUV4cHJlc3Npb24oZXhwcmVzc2lvbnMpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmRlY29yYXRlKGV4cCwgdGhpcy5hc01hcmtlcih0aGlzLmFzTWV0YWRhdGEoY3R4LmdldFNvdXJjZUludGVydmFsKCkpKSlcbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI1Rlcm5hcnlFeHByZXNzaW9uLlxuICAgIHZpc2l0VGVybmFyeUV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuXG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNMb2dpY2FsQW5kRXhwcmVzc2lvbi5cbiAgICB2aXNpdExvZ2ljYWxBbmRFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcblxuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjUHJlSW5jcmVtZW50RXhwcmVzc2lvbi5cbiAgICB2aXNpdFByZUluY3JlbWVudEV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuXG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNPYmplY3RMaXRlcmFsRXhwcmVzc2lvbi5cbiAgICB2aXNpdE9iamVjdExpdGVyYWxFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS5pbmZvKFwidmlzaXRPYmplY3RMaXRlcmFsRXhwcmVzc2lvbiBbJXNdIDogJXNcIiwgY3R4LmdldENoaWxkQ291bnQoKSwgY3R4LmdldFRleHQoKSk7XG4gICAgICAgIHRoaXMuYXNzZXJ0VHlwZShjdHgsIEVDTUFTY3JpcHRQYXJzZXIuT2JqZWN0TGl0ZXJhbEV4cHJlc3Npb25Db250ZXh0KTtcbiAgICAgICAgbGV0IGV4cHJlc3Npb25zID0gW107XG4gICAgICAgIGxldCBub2RlID0gY3R4LmdldENoaWxkKDApO1xuICAgICAgICB0aGlzLmR1bXBDb250ZXh0QWxsQ2hpbGRyZW4obm9kZSk7XG4gICAgICAgIGxldCBvYmogPSB0aGlzLnZpc2l0T2JqZWN0TGl0ZXJhbChub2RlKTtcbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI0luRXhwcmVzc2lvbi5cbiAgICB2aXNpdEluRXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG5cbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI0xvZ2ljYWxPckV4cHJlc3Npb24uXG4gICAgdmlzaXRMb2dpY2FsT3JFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcblxuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjTm90RXhwcmVzc2lvbi5cbiAgICB2aXNpdE5vdEV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuXG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNQcmVEZWNyZWFzZUV4cHJlc3Npb24uXG4gICAgdmlzaXRQcmVEZWNyZWFzZUV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuXG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNBcmd1bWVudHNFeHByZXNzaW9uLlxuICAgIHZpc2l0QXJndW1lbnRzRXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0QXJndW1lbnRzRXhwcmVzc2lvbjogXCIgKyBjdHguZ2V0VGV4dCgpKTtcblxuXG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNUaGlzRXhwcmVzc2lvbi5cbiAgICB2aXNpdFRoaXNFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcblxuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjRnVuY3Rpb25FeHByZXNzaW9uLlxuICAgIHZpc2l0RnVuY3Rpb25FeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcblxuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjVW5hcnlNaW51c0V4cHJlc3Npb24uXG4gICAgdmlzaXRVbmFyeU1pbnVzRXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG5cbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI1Bvc3REZWNyZWFzZUV4cHJlc3Npb24uXG4gICAgdmlzaXRQb3N0RGVjcmVhc2VFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcblxuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjQXNzaWdubWVudEV4cHJlc3Npb24uXG4gICAgdmlzaXRBc3NpZ25tZW50RXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0QXNzaWdubWVudEV4cHJlc3Npb24gWyVzXSA6IFslc11cIiwgY3R4LmdldENoaWxkQ291bnQoKSwgY3R4LmdldFRleHQoKSk7XG4gICAgICAgIHRoaXMuYXNzZXJ0VHlwZShjdHgsIEVDTUFTY3JpcHRQYXJzZXIuQXNzaWdubWVudEV4cHJlc3Npb25Db250ZXh0KTtcbiAgICAgICAgdGhpcy5hc3NlcnROb2RlQ291bnQoY3R4LCAzKVxuXG4gICAgICAgIGxldCBpbml0aWFsaXNlciA9IGN0eC5nZXRDaGlsZCgwKTsgLy8gSWRlbnRpZmllckV4cHJlc3Npb25Db250ZXh0XG4gICAgICAgIGxldCBvcGVyYXRvciA9IGN0eC5nZXRDaGlsZCgxKS5nZXRUZXh0KCk7IC8vIE5vIHR5cGUgKCA9IClcbiAgICAgICAgbGV0IGV4cHJlc3Npb24gPSBjdHguZ2V0Q2hpbGQoMik7ICAvL0V4cHJlc3Npb25TZXF1ZW5jZUNvbnRleHRcblxuICAgICAgICBsZXQgbGhzID0gdGhpcy52aXNpdElkZW50aWZpZXJFeHByZXNzaW9uKGluaXRpYWxpc2VyKTtcbiAgICAgICAgbGV0IHJocyA9IHRoaXMudmlzaXRFeHByZXNzaW9uU2VxdWVuY2UoZXhwcmVzc2lvbik7XG4gICAgICAgIC8vIENvbXBsaWFuY2UgOiBwdWxsaW5nIHVwIEV4cHJlc3Npb25TdGF0ZW1lbnQgaW50byBBc3NpZ2VtZW50RXhwcmVzc2lvblxuICAgICAgICBsZXQgbm9kZSA9IG5ldyBBc3NpZ25tZW50RXhwcmVzc2lvbihvcGVyYXRvciwgbGhzLCByaHMuZXhwcmVzc2lvbilcbiAgICAgICAgcmV0dXJuIG5vZGU7XG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNUeXBlb2ZFeHByZXNzaW9uLlxuICAgIHZpc2l0VHlwZW9mRXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG5cbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI0luc3RhbmNlb2ZFeHByZXNzaW9uLlxuICAgIHZpc2l0SW5zdGFuY2VvZkV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuXG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNVbmFyeVBsdXNFeHByZXNzaW9uLlxuICAgIHZpc2l0VW5hcnlQbHVzRXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG5cbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI0RlbGV0ZUV4cHJlc3Npb24uXG4gICAgdmlzaXREZWxldGVFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcblxuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjRXF1YWxpdHlFeHByZXNzaW9uLlxuICAgIHZpc2l0RXF1YWxpdHlFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcblxuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjQml0WE9yRXhwcmVzc2lvbi5cbiAgICB2aXNpdEJpdFhPckV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuXG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNNdWx0aXBsaWNhdGl2ZUV4cHJlc3Npb24uXG4gICAgdmlzaXRNdWx0aXBsaWNhdGl2ZUV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJ2aXNpdE11bHRpcGxpY2F0aXZlRXhwcmVzc2lvbiBbJXNdIDogJXNcIiwgY3R4LmdldENoaWxkQ291bnQoKSwgY3R4LmdldFRleHQoKSk7XG4gICAgICAgIHRoaXMuYXNzZXJ0VHlwZShjdHgsIEVDTUFTY3JpcHRQYXJzZXIuTXVsdGlwbGljYXRpdmVFeHByZXNzaW9uQ29udGV4dCk7XG4gICAgICAgIHRoaXMuYXNzZXJ0Tm9kZUNvdW50KGN0eCwgMylcblxuICAgICAgICBsZXQgbGVmdCA9IGN0eC5nZXRDaGlsZCgwKTtcbiAgICAgICAgbGV0IG9wZXJhdG9yID0gY3R4LmdldENoaWxkKDEpLmdldFRleHQoKTsgLy8gTm8gdHlwZSAoICssLSApXG4gICAgICAgIGxldCByaWdodCA9IGN0eC5nZXRDaGlsZCgyKTtcbiAgICAgICAgbGV0IGxocyA9IHRoaXMudmlzaXRCaW5hcnlFeHByZXNzaW9uKGxlZnQpO1xuICAgICAgICBsZXQgcmhzID0gdGhpcy52aXNpdEJpbmFyeUV4cHJlc3Npb24ocmlnaHQpO1xuXG4gICAgICAgIHJldHVybiB0aGlzLmRlY29yYXRlKG5ldyBCaW5hcnlFeHByZXNzaW9uKG9wZXJhdG9yLCBsaHMsIHJocyksIHt9KTtcbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNCaXRTaGlmdEV4cHJlc3Npb24uXG4gICAgdmlzaXRCaXRTaGlmdEV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuXG4gICAgfVxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjUGFyZW50aGVzaXplZEV4cHJlc3Npb24uXG4gICAgdmlzaXRQYXJlbnRoZXNpemVkRXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0UGFyZW50aGVzaXplZEV4cHJlc3Npb246IFwiICsgY3R4LmdldFRleHQoKSk7XG4gICAgfVxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjQWRkaXRpdmVFeHByZXNzaW9uLlxuICAgIHZpc2l0QWRkaXRpdmVFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS5pbmZvKFwidmlzaXRBZGRpdGl2ZUV4cHJlc3Npb24gWyVzXSA6ICVzXCIsIGN0eC5nZXRDaGlsZENvdW50KCksIGN0eC5nZXRUZXh0KCkpO1xuICAgICAgICB0aGlzLmFzc2VydFR5cGUoY3R4LCBFQ01BU2NyaXB0UGFyc2VyLkFkZGl0aXZlRXhwcmVzc2lvbkNvbnRleHQpO1xuICAgICAgICB0aGlzLmFzc2VydE5vZGVDb3VudChjdHgsIDMpXG5cbiAgICAgICAgbGV0IGxlZnQgPSBjdHguZ2V0Q2hpbGQoMCk7XG4gICAgICAgIGxldCBvcGVyYXRvciA9IGN0eC5nZXRDaGlsZCgxKS5nZXRUZXh0KCk7IC8vIE5vIHR5cGUgKCArLC0gKVxuICAgICAgICBsZXQgcmlnaHQgPSBjdHguZ2V0Q2hpbGQoMik7XG4gICAgICAgIGxldCBsaHMgPSB0aGlzLl92aXNpdEJpbmFyeUV4cHJlc3Npb24obGVmdCk7XG4gICAgICAgIGxldCByaHMgPSB0aGlzLl92aXNpdEJpbmFyeUV4cHJlc3Npb24ocmlnaHQpO1xuICAgICAgICAvLyByZXR1cm4gdGhpcy5kZWNvcmF0ZShuZXcgQmluYXJ5RXhwcmVzc2lvbihvcGVyYXRvciwgbGhzICxyaHMpLCB0aGlzLmFzTWFya2VyKHRoaXMuYXNNZXRhZGF0YShjdHguc3ltYm9sKSkpO1xuICAgICAgICByZXR1cm4gbmV3IEJpbmFyeUV4cHJlc3Npb24ob3BlcmF0b3IsIGxocywgcmhzKTtcbiAgICB9XG5cbiAgICBfdmlzaXRCaW5hcnlFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS5pbmZvKFwiZXZhbEJpbmFyeUV4cHJlc3Npb24gWyVzXSA6ICVzXCIsIGN0eC5nZXRDaGlsZENvdW50KCksIGN0eC5nZXRUZXh0KCkpO1xuICAgICAgICBpZiAoY3R4IGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5JZGVudGlmaWVyRXhwcmVzc2lvbkNvbnRleHQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnZpc2l0SWRlbnRpZmllckV4cHJlc3Npb24oY3R4KTtcbiAgICAgICAgfSBlbHNlIGlmIChjdHggaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLkxpdGVyYWxFeHByZXNzaW9uQ29udGV4dCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmlzaXRMaXRlcmFsRXhwcmVzc2lvbihjdHgpO1xuICAgICAgICB9IGVsc2UgaWYgKGN0eCBpbnN0YW5jZW9mIEVDTUFTY3JpcHRQYXJzZXIuQWRkaXRpdmVFeHByZXNzaW9uQ29udGV4dCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmlzaXRBZGRpdGl2ZUV4cHJlc3Npb24oY3R4KTtcbiAgICAgICAgfSBlbHNlIGlmIChjdHggaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLk11bHRpcGxpY2F0aXZlRXhwcmVzc2lvbkNvbnRleHQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnZpc2l0TXVsdGlwbGljYXRpdmVFeHByZXNzaW9uKGN0eCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy50aHJvd0luc2FuY2VFcnJvcih0aGlzLmR1bXBDb250ZXh0KGN0eCkpO1xuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI1JlbGF0aW9uYWxFeHByZXNzaW9uLlxuICAgIHZpc2l0UmVsYXRpb25hbEV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI1Bvc3RJbmNyZW1lbnRFeHByZXNzaW9uLlxuICAgIHZpc2l0UG9zdEluY3JlbWVudEV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI0JpdE5vdEV4cHJlc3Npb24uXG4gICAgdmlzaXRCaXROb3RFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcblxuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjTmV3RXhwcmVzc2lvbi5cbiAgICB2aXNpdE5ld0V4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuXG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNMaXRlcmFsRXhwcmVzc2lvbi5cbiAgICB2aXNpdExpdGVyYWxFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS5pbmZvKFwidmlzaXRMaXRlcmFsRXhwcmVzc2lvbiBbJXNdIDogWyVzXVwiLCBjdHguZ2V0Q2hpbGRDb3VudCgpLCBjdHguZ2V0VGV4dCgpKTtcbiAgICAgICAgdGhpcy5hc3NlcnRUeXBlKGN0eCwgRUNNQVNjcmlwdFBhcnNlci5MaXRlcmFsRXhwcmVzc2lvbkNvbnRleHQpO1xuICAgICAgICB0aGlzLmFzc2VydE5vZGVDb3VudChjdHgsIDEpO1xuICAgICAgICAvLyB2aXNpdExpdGVyYWxFeHByZXNzaW9uOiA+IHZpc2l0TGl0ZXJhbFxuICAgICAgICBsZXQgbm9kZSA9IGN0eC5nZXRDaGlsZCgwKVxuICAgICAgICBpZiAobm9kZSBpbnN0YW5jZW9mIEVDTUFTY3JpcHRQYXJzZXIuTGl0ZXJhbENvbnRleHQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnZpc2l0TGl0ZXJhbChub2RlKTtcbiAgICAgICAgfSBlbHNlIGlmIChub2RlIGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5OdW1lcmljTGl0ZXJhbENvbnRleHQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnZpc2l0TnVtZXJpY0xpdGVyYWwobm9kZSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy50aHJvd0luc2FuY2VFcnJvcih0aGlzLmR1bXBDb250ZXh0KG5vZGUpKTtcbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNBcnJheUxpdGVyYWxFeHByZXNzaW9uLlxuICAgIHZpc2l0QXJyYXlMaXRlcmFsRXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0QXJyYXlMaXRlcmFsRXhwcmVzc2lvbiBbJXNdIDogJXNcIiwgY3R4LmdldENoaWxkQ291bnQoKSwgY3R4LmdldFRleHQoKSk7XG4gICAgICAgIHRoaXMuYXNzZXJ0VHlwZShjdHgsIEVDTUFTY3JpcHRQYXJzZXIuQXJyYXlMaXRlcmFsRXhwcmVzc2lvbkNvbnRleHQpO1xuICAgICAgICB0aGlzLmFzc2VydE5vZGVDb3VudChjdHgsIDEpO1xuICAgICAgICBsZXQgbm9kZSA9IGN0eC5nZXRDaGlsZCgwKTtcbiAgICAgICAgbGV0IGVsZW1lbnRzID0gdGhpcy52aXNpdEFycmF5TGl0ZXJhbChub2RlKTtcblxuICAgICAgICByZXR1cm4gbmV3IEFycmF5RXhwcmVzc2lvbihlbGVtZW50cyk7XG4gICAgfVxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjTWVtYmVyRG90RXhwcmVzc2lvbi5cbiAgICB2aXNpdE1lbWJlckRvdEV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJ2aXNpdE1lbWJlckRvdEV4cHJlc3Npb24gWyVzXSA6ICVzXCIsIGN0eC5nZXRDaGlsZENvdW50KCksIGN0eC5nZXRUZXh0KCkpO1xuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI01lbWJlckluZGV4RXhwcmVzc2lvbi5cbiAgICB2aXNpdE1lbWJlckluZGV4RXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNJZGVudGlmaWVyRXhwcmVzc2lvbi5cbiAgICB2aXNpdElkZW50aWZpZXJFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS5pbmZvKFwidmlzaXRJZGVudGlmaWVyRXhwcmVzc2lvbiBbJXNdIDogJXNcIiwgY3R4LmdldENoaWxkQ291bnQoKSwgY3R4LmdldFRleHQoKSk7XG4gICAgICAgIHRoaXMuYXNzZXJ0VHlwZShjdHgsIEVDTUFTY3JpcHRQYXJzZXIuSWRlbnRpZmllckV4cHJlc3Npb25Db250ZXh0KTtcbiAgICAgICAgdGhpcy5hc3NlcnROb2RlQ291bnQoY3R4LCAxKVxuICAgICAgICBsZXQgaW5pdGlhbGlzZXIgPSBjdHguZ2V0Q2hpbGQoMCk7XG4gICAgICAgIGxldCBuYW1lID0gaW5pdGlhbGlzZXIuZ2V0VGV4dCgpO1xuICAgICAgICByZXR1cm4gdGhpcy5kZWNvcmF0ZShuZXcgSWRlbnRpZmllcihuYW1lKSwgdGhpcy5hc01hcmtlcih0aGlzLmFzTWV0YWRhdGEoaW5pdGlhbGlzZXIuc3ltYm9sKSkpXG4gICAgfVxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjQml0QW5kRXhwcmVzc2lvbi5cbiAgICB2aXNpdEJpdEFuZEV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI0JpdE9yRXhwcmVzc2lvbi5cbiAgICB2aXNpdEJpdE9yRXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNBc3NpZ25tZW50T3BlcmF0b3JFeHByZXNzaW9uLlxuICAgIHZpc2l0QXNzaWdubWVudE9wZXJhdG9yRXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNWb2lkRXhwcmVzc2lvbi5cbiAgICB2aXNpdFZvaWRFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcblxuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2Fzc2lnbm1lbnRPcGVyYXRvci5cbiAgICB2aXNpdEFzc2lnbm1lbnRPcGVyYXRvcihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0QXNzaWdubWVudE9wZXJhdG9yOiBcIiArIGN0eC5nZXRUZXh0KCkpO1xuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2xpdGVyYWwuXG4gICAgdmlzaXRMaXRlcmFsKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS5pbmZvKFwidmlzaXRMaXRlcmFsIFslc10gOiBbJXNdXCIsIGN0eC5nZXRDaGlsZENvdW50KCksIGN0eC5nZXRUZXh0KCkpO1xuICAgICAgICB0aGlzLmFzc2VydFR5cGUoY3R4LCBFQ01BU2NyaXB0UGFyc2VyLkxpdGVyYWxDb250ZXh0KVxuICAgICAgICB0aGlzLmFzc2VydE5vZGVDb3VudChjdHgsIDEpO1xuICAgICAgICBsZXQgbm9kZTogUnVsZUNvbnRleHQgPSBjdHguZ2V0Q2hpbGQoMCk7XG4gICAgICAgIGlmIChub2RlLmdldENoaWxkQ291bnQoKSA9PSAxKSB7XG4gICAgICAgICAgICBpZiAobm9kZSBpbnN0YW5jZW9mIEVDTUFTY3JpcHRQYXJzZXIuTnVtZXJpY0xpdGVyYWxDb250ZXh0KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMudmlzaXROdW1lcmljTGl0ZXJhbChub2RlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMudGhyb3dJbnNhbmNlRXJyb3IodGhpcy5kdW1wQ29udGV4dChub2RlKSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAobm9kZS5nZXRDaGlsZENvdW50KCkgPT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY3JlYXRlTGl0ZXJhbFZhbHVlKG5vZGUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjbnVtZXJpY0xpdGVyYWwuXG4gICAgdmlzaXROdW1lcmljTGl0ZXJhbChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0TnVtZXJpY0xpdGVyYWwgWyVzXSA6IFslc11cIiwgY3R4LmdldENoaWxkQ291bnQoKSwgY3R4LmdldFRleHQoKSk7XG4gICAgICAgIHRoaXMuYXNzZXJ0VHlwZShjdHgsIEVDTUFTY3JpcHRQYXJzZXIuTnVtZXJpY0xpdGVyYWxDb250ZXh0KVxuICAgICAgICB0aGlzLmFzc2VydE5vZGVDb3VudChjdHgsIDEpO1xuICAgICAgICBsZXQgdmFsdWUgPSBjdHguZ2V0VGV4dCgpO1xuICAgICAgICAvLyBUT0RPIDogRmlndXJlIG91dCBiZXR0ZXIgd2F5XG4gICAgICAgIGxldCBsaXRlcmFsID0gbmV3IExpdGVyYWwoTnVtYmVyKHZhbHVlKSwgdmFsdWUpO1xuICAgICAgICByZXR1cm4gdGhpcy5kZWNvcmF0ZShsaXRlcmFsLCB0aGlzLmFzTWFya2VyKHRoaXMuYXNNZXRhZGF0YShjdHguZ2V0U291cmNlSW50ZXJ2YWwoKSkpKVxuICAgIH1cblxuICAgIGNyZWF0ZUxpdGVyYWxWYWx1ZShjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcImNyZWF0ZUxpdGVyYWxWYWx1ZSBbJXNdOiBbJXNdXCIsIGN0eC5nZXRDaGlsZENvdW50KCksIGN0eC5nZXRUZXh0KCkpO1xuICAgICAgICBsZXQgdmFsdWUgPSBjdHguZ2V0VGV4dCgpO1xuICAgICAgICBsZXQgbGl0ZXJhbCA9IG5ldyBMaXRlcmFsKHZhbHVlLCB2YWx1ZSk7XG4gICAgICAgIHJldHVybiB0aGlzLmRlY29yYXRlKGxpdGVyYWwsIHRoaXMuYXNNYXJrZXIodGhpcy5hc01ldGFkYXRhKGN0eC5nZXRTb3VyY2VJbnRlcnZhbCgpKSkpXG4gICAgfVxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjaWRlbnRpZmllck5hbWUuXG4gICAgdmlzaXRJZGVudGlmaWVyTmFtZShjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0SWRlbnRpZmllck5hbWU6IFwiICsgY3R4LmdldFRleHQoKSk7XG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNyZXNlcnZlZFdvcmQuXG4gICAgdmlzaXRSZXNlcnZlZFdvcmQoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJ2aXNpdFJlc2VydmVkV29yZDogXCIgKyBjdHguZ2V0VGV4dCgpKTtcblxuXG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNrZXl3b3JkLlxuICAgIHZpc2l0S2V5d29yZChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0S2V5d29yZDogXCIgKyBjdHguZ2V0VGV4dCgpKTtcblxuXG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNmdXR1cmVSZXNlcnZlZFdvcmQuXG4gICAgdmlzaXRGdXR1cmVSZXNlcnZlZFdvcmQoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuXG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNnZXR0ZXIuXG4gICAgdmlzaXRHZXR0ZXIoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuXG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNzZXR0ZXIuXG4gICAgdmlzaXRTZXR0ZXIoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuXG4gICAgfVxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjZW9zLlxuICAgIHZpc2l0RW9zKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgLy9jb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuXG4gICAgfVxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjZW9mLlxuICAgIHZpc2l0RW9mKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcblxuICAgIH1cblxufSJdfQ==