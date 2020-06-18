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
    } // diry hack for walking antler depency chain 
    // find longest dependency chaing;
    // this traversal is specific to ANTL parser
    // We want to be able to find dependencies such as;

    /*
        -------- ------------
        PropertyExpressionAssignmentContext
        ** PropertyAssignmentContext
        ** ParserRuleContext
        -------- ------------
        PropertyAssignmentContext
        ** ParserRuleContext
     */


    if (context.length > 1) {
      let contextName;
      let longest = 0;

      for (const key in context) {
        const name = context[key];
        let obj = _ECMAScriptParser.ECMAScriptParser[name];
        let chain = 1;

        do {
          ++chain;
          obj = _ECMAScriptParser.ECMAScriptParser[obj.prototype.__proto__.constructor.name];
        } while (obj && obj.prototype);

        if (chain > longest) {
          longest = chain;
          contextName = `${name} [${chain}]`;
        }
      }

      return [contextName];
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9BU1RQYXJzZXIudHMiXSwibmFtZXMiOlsiZnMiLCJyZXF1aXJlIiwiUGFyc2VyVHlwZSIsIkFTVFBhcnNlciIsImNvbnN0cnVjdG9yIiwidmlzaXRvciIsIkRlbHZlbkFTVFZpc2l0b3IiLCJnZW5lcmF0ZSIsInNvdXJjZSIsImNvZGUiLCJ0eXBlIiwidmFsdWUiLCJyZWFkRmlsZVN5bmMiLCJjaGFycyIsImFudGxyNCIsIklucHV0U3RyZWFtIiwibGV4ZXIiLCJEZWx2ZW5MZXhlciIsInRva2VucyIsIkNvbW1vblRva2VuU3RyZWFtIiwicGFyc2VyIiwiRGVsdmVuUGFyc2VyIiwidHJlZSIsInByb2dyYW0iLCJhY2NlcHQiLCJQcmludFZpc2l0b3IiLCJjb25zb2xlIiwiaW5mbyIsInJlc3VsdCIsInBhcnNlIiwiRUNNQVNjcmlwdCIsIkFTVFBhcnNlckRlZmF1bHQiLCJFcnJvciIsIkRlbHZlblZpc2l0b3IiLCJydWxlVHlwZU1hcCIsIk1hcCIsInNldHVwVHlwZVJ1bGVzIiwia2V5cyIsIk9iamVjdCIsImdldE93blByb3BlcnR5TmFtZXMiLCJFQ01BU2NyaXB0UGFyc2VyIiwia2V5IiwibmFtZSIsInN0YXJ0c1dpdGgiLCJzZXQiLCJwYXJzZUludCIsImR1bXBDb250ZXh0IiwiY3R4IiwiY29udGV4dCIsImVuZHNXaXRoIiwicHVzaCIsImxlbmd0aCIsImNvbnRleHROYW1lIiwibG9uZ2VzdCIsIm9iaiIsImNoYWluIiwicHJvdG90eXBlIiwiX19wcm90b19fIiwiZHVtcENvbnRleHRBbGxDaGlsZHJlbiIsImluZGVudCIsInBhZCIsInBhZFN0YXJ0Iiwibm9kZXMiLCJpIiwiZ2V0Q2hpbGRDb3VudCIsImNoaWxkIiwiZ2V0Q2hpbGQiLCJnZXRSdWxlQnlJZCIsImlkIiwiZ2V0IiwiYXNNYXJrZXIiLCJtZXRhZGF0YSIsImluZGV4IiwibGluZSIsImNvbHVtbiIsImRlY29yYXRlIiwibm9kZSIsIm1hcmtlciIsInN0YXJ0IiwiZW5kIiwidGhyb3dUeXBlRXJyb3IiLCJ0eXBlSWQiLCJUeXBlRXJyb3IiLCJ0aHJvd0luc2FuY2VFcnJvciIsImFzc2VydFR5cGUiLCJ2aXNpdFByb2dyYW0iLCJnZXRUZXh0Iiwic3RhdGVtZW50cyIsInN0bSIsIlN0YXRlbWVudENvbnRleHQiLCJzdGF0ZW1lbnQiLCJ2aXNpdFN0YXRlbWVudCIsImludGVydmFsIiwiZ2V0U291cmNlSW50ZXJ2YWwiLCJzY3JpcHQiLCJTY3JpcHQiLCJhc01ldGFkYXRhIiwiRXhwcmVzc2lvblN0YXRlbWVudENvbnRleHQiLCJ2aXNpdEV4cHJlc3Npb25TdGF0ZW1lbnQiLCJWYXJpYWJsZVN0YXRlbWVudENvbnRleHQiLCJ2aXNpdFZhcmlhYmxlU3RhdGVtZW50IiwiQmxvY2tDb250ZXh0IiwidmlzaXRCbG9jayIsIkVtcHR5U3RhdGVtZW50Q29udGV4dCIsImJvZHkiLCJTdGF0ZW1lbnRMaXN0Q29udGV4dCIsInN0YXRlbWVudExpc3QiLCJ2aXNpdFN0YXRlbWVudExpc3QiLCJCbG9ja1N0YXRlbWVudCIsInJ1bGVJbmRleCIsIlJVTEVfc3RhdGVtZW50IiwidW5kZWZpbmVkIiwidmlzaXRWYXJpYWJsZURlY2xhcmF0aW9uTGlzdCIsInRyYWNlIiwidmlzaXRWYXJpYWJsZURlY2xhcmF0aW9uIiwidmlzaXRJbml0aWFsaXNlciIsInZpc2l0RW1wdHlTdGF0ZW1lbnQiLCJnZXRSdWxlVHlwZSIsImFzc2VydE5vZGVDb3VudCIsImNvdW50IiwiZXhwIiwiRXhwcmVzc2lvblNlcXVlbmNlQ29udGV4dCIsInZpc2l0RXhwcmVzc2lvblNlcXVlbmNlIiwib2Zmc2V0Iiwic3RvcCIsInZpc2l0SWZTdGF0ZW1lbnQiLCJ2aXNpdERvU3RhdGVtZW50IiwidmlzaXRXaGlsZVN0YXRlbWVudCIsInZpc2l0Rm9yU3RhdGVtZW50IiwidmlzaXRGb3JWYXJTdGF0ZW1lbnQiLCJ2aXNpdEZvckluU3RhdGVtZW50IiwidmlzaXRGb3JWYXJJblN0YXRlbWVudCIsInZpc2l0Q29udGludWVTdGF0ZW1lbnQiLCJ2aXNpdEJyZWFrU3RhdGVtZW50IiwidmlzaXRSZXR1cm5TdGF0ZW1lbnQiLCJ2aXNpdFdpdGhTdGF0ZW1lbnQiLCJ2aXNpdFN3aXRjaFN0YXRlbWVudCIsInZpc2l0Q2FzZUJsb2NrIiwidmlzaXRDYXNlQ2xhdXNlcyIsInZpc2l0Q2FzZUNsYXVzZSIsInZpc2l0RGVmYXVsdENsYXVzZSIsInZpc2l0TGFiZWxsZWRTdGF0ZW1lbnQiLCJ2aXNpdFRocm93U3RhdGVtZW50IiwidmlzaXRUcnlTdGF0ZW1lbnQiLCJ2aXNpdENhdGNoUHJvZHVjdGlvbiIsInZpc2l0RmluYWxseVByb2R1Y3Rpb24iLCJ2aXNpdERlYnVnZ2VyU3RhdGVtZW50IiwidmlzaXRGdW5jdGlvbkRlY2xhcmF0aW9uIiwidmlzaXRGb3JtYWxQYXJhbWV0ZXJMaXN0IiwidmlzaXRGdW5jdGlvbkJvZHkiLCJ2aXNpdEFycmF5TGl0ZXJhbCIsIkFycmF5TGl0ZXJhbENvbnRleHQiLCJlbGVtZW50TGlzdCIsImVsZW1lbnRzIiwidmlzaXRFbGVtZW50TGlzdCIsImVsaXNpb25WYWx1ZXMiLCJlbGlzaW9uIiwidmlzaXRFbGlzaW9uIiwibGl0ZXJhbHMiLCJjb25jYXQiLCJFbGVtZW50TGlzdENvbnRleHQiLCJzeW1ib2wiLCJlbGVtIiwiSWRlbnRpZmllckV4cHJlc3Npb25Db250ZXh0IiwidmlzaXRJZGVudGlmaWVyRXhwcmVzc2lvbiIsIkxpdGVyYWxFeHByZXNzaW9uQ29udGV4dCIsInZpc2l0TGl0ZXJhbEV4cHJlc3Npb24iLCJBZGRpdGl2ZUV4cHJlc3Npb25Db250ZXh0IiwidmlzaXRBZGRpdGl2ZUV4cHJlc3Npb24iLCJNdWx0aXBsaWNhdGl2ZUV4cHJlc3Npb25Db250ZXh0IiwidmlzaXRNdWx0aXBsaWNhdGl2ZUV4cHJlc3Npb24iLCJFbGlzaW9uQ29udGV4dCIsInZpc2l0T2JqZWN0TGl0ZXJhbCIsIk9iamVjdExpdGVyYWxDb250ZXh0IiwidmFsIiwidmlzaXRQcm9wZXJ0eU5hbWVBbmRWYWx1ZUxpc3QiLCJ2aXNpdFByb3BlcnR5RXhwcmVzc2lvbkFzc2lnbm1lbnQiLCJ2aXNpdFByb3BlcnR5R2V0dGVyIiwidmlzaXRQcm9wZXJ0eVNldHRlciIsInZpc2l0UHJvcGVydHlOYW1lIiwidmlzaXRQcm9wZXJ0eVNldFBhcmFtZXRlckxpc3QiLCJ2aXNpdEFyZ3VtZW50cyIsInZpc2l0QXJndW1lbnRMaXN0IiwiZXhwcmVzc2lvbnMiLCJPYmplY3RMaXRlcmFsRXhwcmVzc2lvbkNvbnRleHQiLCJ2aXNpdE9iamVjdExpdGVyYWxFeHByZXNzaW9uIiwiQXNzaWdubWVudEV4cHJlc3Npb25Db250ZXh0IiwidmlzaXRBc3NpZ25tZW50RXhwcmVzc2lvbiIsIkFycmF5TGl0ZXJhbEV4cHJlc3Npb25Db250ZXh0IiwidmlzaXRBcnJheUxpdGVyYWxFeHByZXNzaW9uIiwiRXhwcmVzc2lvblN0YXRlbWVudCIsIlNlcXVlbmNlRXhwcmVzc2lvbiIsInZpc2l0VGVybmFyeUV4cHJlc3Npb24iLCJ2aXNpdExvZ2ljYWxBbmRFeHByZXNzaW9uIiwidmlzaXRQcmVJbmNyZW1lbnRFeHByZXNzaW9uIiwidmlzaXRJbkV4cHJlc3Npb24iLCJ2aXNpdExvZ2ljYWxPckV4cHJlc3Npb24iLCJ2aXNpdE5vdEV4cHJlc3Npb24iLCJ2aXNpdFByZURlY3JlYXNlRXhwcmVzc2lvbiIsInZpc2l0QXJndW1lbnRzRXhwcmVzc2lvbiIsInZpc2l0VGhpc0V4cHJlc3Npb24iLCJ2aXNpdEZ1bmN0aW9uRXhwcmVzc2lvbiIsInZpc2l0VW5hcnlNaW51c0V4cHJlc3Npb24iLCJ2aXNpdFBvc3REZWNyZWFzZUV4cHJlc3Npb24iLCJpbml0aWFsaXNlciIsIm9wZXJhdG9yIiwiZXhwcmVzc2lvbiIsImxocyIsInJocyIsIkFzc2lnbm1lbnRFeHByZXNzaW9uIiwidmlzaXRUeXBlb2ZFeHByZXNzaW9uIiwidmlzaXRJbnN0YW5jZW9mRXhwcmVzc2lvbiIsInZpc2l0VW5hcnlQbHVzRXhwcmVzc2lvbiIsInZpc2l0RGVsZXRlRXhwcmVzc2lvbiIsInZpc2l0RXF1YWxpdHlFeHByZXNzaW9uIiwidmlzaXRCaXRYT3JFeHByZXNzaW9uIiwibGVmdCIsInJpZ2h0IiwidmlzaXRCaW5hcnlFeHByZXNzaW9uIiwiQmluYXJ5RXhwcmVzc2lvbiIsInZpc2l0Qml0U2hpZnRFeHByZXNzaW9uIiwidmlzaXRQYXJlbnRoZXNpemVkRXhwcmVzc2lvbiIsIl92aXNpdEJpbmFyeUV4cHJlc3Npb24iLCJ2aXNpdFJlbGF0aW9uYWxFeHByZXNzaW9uIiwidmlzaXRQb3N0SW5jcmVtZW50RXhwcmVzc2lvbiIsInZpc2l0Qml0Tm90RXhwcmVzc2lvbiIsInZpc2l0TmV3RXhwcmVzc2lvbiIsIkxpdGVyYWxDb250ZXh0IiwidmlzaXRMaXRlcmFsIiwiTnVtZXJpY0xpdGVyYWxDb250ZXh0IiwidmlzaXROdW1lcmljTGl0ZXJhbCIsIkFycmF5RXhwcmVzc2lvbiIsInZpc2l0TWVtYmVyRG90RXhwcmVzc2lvbiIsInZpc2l0TWVtYmVySW5kZXhFeHByZXNzaW9uIiwiSWRlbnRpZmllciIsInZpc2l0Qml0QW5kRXhwcmVzc2lvbiIsInZpc2l0Qml0T3JFeHByZXNzaW9uIiwidmlzaXRBc3NpZ25tZW50T3BlcmF0b3JFeHByZXNzaW9uIiwidmlzaXRWb2lkRXhwcmVzc2lvbiIsInZpc2l0QXNzaWdubWVudE9wZXJhdG9yIiwiY3JlYXRlTGl0ZXJhbFZhbHVlIiwibGl0ZXJhbCIsIkxpdGVyYWwiLCJOdW1iZXIiLCJ2aXNpdElkZW50aWZpZXJOYW1lIiwidmlzaXRSZXNlcnZlZFdvcmQiLCJ2aXNpdEtleXdvcmQiLCJ2aXNpdEZ1dHVyZVJlc2VydmVkV29yZCIsInZpc2l0R2V0dGVyIiwidmlzaXRTZXR0ZXIiLCJ2aXNpdEVvcyIsInZpc2l0RW9mIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBRUE7O0FBRUE7Ozs7OztBQUlBLElBQUlBLEVBQUUsR0FBR0MsT0FBTyxDQUFDLElBQUQsQ0FBaEI7QUFFQTs7Ozs7Ozs7OztJQVFZQyxVOzs7V0FB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QUFKLEVBQXJDO0FBR0gsR0FuOEIrQyxDQXM4QmhEOzs7QUFDQWdLLEVBQUFBLFlBQVksQ0FBQ3ZNLEdBQUQsRUFBbUI7QUFDM0JyQixJQUFBQSxPQUFPLENBQUNDLElBQVIsQ0FBYSxtQkFBbUJvQixHQUFHLENBQUN1QyxPQUFKLEVBQWhDO0FBR0gsR0EzOEIrQyxDQTg4QmhEOzs7QUFDQWlLLEVBQUFBLHVCQUF1QixDQUFDeE0sR0FBRCxFQUFtQjtBQUN0Q3JCLElBQUFBLE9BQU8sQ0FBQ3VGLEtBQVIsQ0FBYyxpQkFBZDtBQUVILEdBbDlCK0MsQ0FxOUJoRDs7O0FBQ0F1SSxFQUFBQSxXQUFXLENBQUN6TSxHQUFELEVBQW1CO0FBQzFCckIsSUFBQUEsT0FBTyxDQUFDdUYsS0FBUixDQUFjLGlCQUFkO0FBRUgsR0F6OUIrQyxDQTQ5QmhEOzs7QUFDQXdJLEVBQUFBLFdBQVcsQ0FBQzFNLEdBQUQsRUFBbUI7QUFDMUJyQixJQUFBQSxPQUFPLENBQUN1RixLQUFSLENBQWMsaUJBQWQ7QUFFSCxHQWgrQitDLENBaytCaEQ7OztBQUNBeUksRUFBQUEsUUFBUSxDQUFDM00sR0FBRCxFQUFtQixDQUcxQixDQUhPLENBQ0o7QUFJSjs7O0FBQ0E0TSxFQUFBQSxRQUFRLENBQUM1TSxHQUFELEVBQW1CO0FBQ3ZCckIsSUFBQUEsT0FBTyxDQUFDdUYsS0FBUixDQUFjLGlCQUFkO0FBRUg7O0FBNStCK0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBhbnRscjQgZnJvbSBcImFudGxyNFwiXG5pbXBvcnQgeyBFQ01BU2NyaXB0VmlzaXRvciBhcyBEZWx2ZW5WaXNpdG9yIH0gZnJvbSBcIi4vcGFyc2VyL0VDTUFTY3JpcHRWaXNpdG9yXCJcbmltcG9ydCB7IEVDTUFTY3JpcHRQYXJzZXIgYXMgRGVsdmVuUGFyc2VyLCBFQ01BU2NyaXB0UGFyc2VyIH0gZnJvbSBcIi4vcGFyc2VyL0VDTUFTY3JpcHRQYXJzZXJcIlxuaW1wb3J0IHsgRUNNQVNjcmlwdExleGVyIGFzIERlbHZlbkxleGVyIH0gZnJvbSBcIi4vcGFyc2VyL0VDTUFTY3JpcHRMZXhlclwiXG5pbXBvcnQgeyBSdWxlQ29udGV4dCB9IGZyb20gXCJhbnRscjQvUnVsZUNvbnRleHRcIlxuaW1wb3J0IHsgUHJpbnRWaXNpdG9yIH0gZnJvbSBcIi4vUHJpbnRWaXNpdG9yXCJcbmltcG9ydCBBU1ROb2RlIGZyb20gXCIuL0FTVE5vZGVcIjtcbmltcG9ydCB7IEV4cHJlc3Npb25TdGF0ZW1lbnQsIExpdGVyYWwsIFNjcmlwdCwgQmxvY2tTdGF0ZW1lbnQsIFN0YXRlbWVudCwgU2VxdWVuY2VFeHByZXNzaW9uLCBUaHJvd1N0YXRlbWVudCwgQXNzaWdubWVudEV4cHJlc3Npb24sIElkZW50aWZpZXIsIEJpbmFyeUV4cHJlc3Npb24sIEFycmF5RXhwcmVzc2lvbiB9IGZyb20gXCIuL25vZGVzXCI7XG5pbXBvcnQgeyBTeW50YXggfSBmcm9tIFwiLi9zeW50YXhcIjtcbmltcG9ydCB7IHR5cGUgfSBmcm9tIFwib3NcIlxuaW1wb3J0IHsgSW50ZXJ2YWwgfSBmcm9tIFwiYW50bHI0XCJcbmxldCBmcyA9IHJlcXVpcmUoXCJmc1wiKTtcblxuLyoqXG4gKiBWZXJzaW9uIHRoYXQgd2UgZ2VuZXJhdGUgdGhlIEFTVCBmb3IuIFxuICogVGhpcyBhbGxvd3MgZm9yIHRlc3RpbmcgZGlmZmVyZW50IGltcGxlbWVudGF0aW9uc1xuICogXG4gKiBDdXJyZW50bHkgb25seSBFQ01BU2NyaXB0IGlzIHN1cHBvcnRlZFxuICogXG4gKiBodHRwczovL2dpdGh1Yi5jb20vZXN0cmVlL2VzdHJlZVxuICovXG5leHBvcnQgZW51bSBQYXJzZXJUeXBlIHsgRUNNQVNjcmlwdCB9XG5leHBvcnQgdHlwZSBTb3VyY2VUeXBlID0gXCJjb2RlXCIgfCBcImZpbGVuYW1lXCI7XG5leHBvcnQgdHlwZSBTb3VyY2VDb2RlID0ge1xuICAgIHR5cGU6IFNvdXJjZVR5cGUsXG4gICAgdmFsdWU6IHN0cmluZ1xufVxuZXhwb3J0IGludGVyZmFjZSBNYXJrZXIge1xuICAgIGluZGV4OiBudW1iZXI7XG4gICAgbGluZTogbnVtYmVyO1xuICAgIGNvbHVtbjogbnVtYmVyO1xufVxuXG5leHBvcnQgZGVmYXVsdCBhYnN0cmFjdCBjbGFzcyBBU1RQYXJzZXIge1xuICAgIHByaXZhdGUgdmlzaXRvcjogKHR5cGVvZiBEZWx2ZW5WaXNpdG9yIHwgbnVsbClcblxuICAgIGNvbnN0cnVjdG9yKHZpc2l0b3I/OiBEZWx2ZW5BU1RWaXNpdG9yKSB7XG4gICAgICAgIHRoaXMudmlzaXRvciA9IHZpc2l0b3IgfHwgbmV3IERlbHZlbkFTVFZpc2l0b3IoKTtcbiAgICB9XG5cbiAgICBnZW5lcmF0ZShzb3VyY2U6IFNvdXJjZUNvZGUpOiBBU1ROb2RlIHtcbiAgICAgICAgbGV0IGNvZGU7XG4gICAgICAgIHN3aXRjaCAoc291cmNlLnR5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgXCJjb2RlXCI6XG4gICAgICAgICAgICAgICAgY29kZSA9IHNvdXJjZS52YWx1ZTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJmaWxlbmFtZVwiOlxuICAgICAgICAgICAgICAgIGNvZGUgPSBmcy5yZWFkRmlsZVN5bmMoc291cmNlLnZhbHVlLCBcInV0ZjhcIik7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgY2hhcnMgPSBuZXcgYW50bHI0LklucHV0U3RyZWFtKGNvZGUpO1xuICAgICAgICBsZXQgbGV4ZXIgPSBuZXcgRGVsdmVuTGV4ZXIoY2hhcnMpO1xuICAgICAgICBsZXQgdG9rZW5zID0gbmV3IGFudGxyNC5Db21tb25Ub2tlblN0cmVhbShsZXhlcik7XG4gICAgICAgIGxldCBwYXJzZXIgPSBuZXcgRGVsdmVuUGFyc2VyKHRva2Vucyk7XG4gICAgICAgIGxldCB0cmVlID0gcGFyc2VyLnByb2dyYW0oKTtcbiAgICAgICAgLy8gY29uc29sZS5pbmZvKHRyZWUudG9TdHJpbmdUcmVlKCkpXG4gICAgICAgIHRyZWUuYWNjZXB0KG5ldyBQcmludFZpc2l0b3IoKSk7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcIi0tLS0tLS0tLS0tLS0tLS0tLS0tLVwiKTtcbiAgICAgICAgbGV0IHJlc3VsdCA9IHRyZWUuYWNjZXB0KHRoaXMudmlzaXRvcik7XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUGFyc2Ugc291cmNlIGFuZCBnZW5lcmVhdGUgQVNUIHRyZWVcbiAgICAgKiBAcGFyYW0gc291cmNlIFxuICAgICAqIEBwYXJhbSB0eXBlIFxuICAgICAqL1xuICAgIHN0YXRpYyBwYXJzZShzb3VyY2U6IFNvdXJjZUNvZGUsIHR5cGU/OiBQYXJzZXJUeXBlKTogQVNUTm9kZSB7XG4gICAgICAgIGlmICh0eXBlID09IG51bGwpXG4gICAgICAgICAgICB0eXBlID0gUGFyc2VyVHlwZS5FQ01BU2NyaXB0O1xuICAgICAgICBsZXQgcGFyc2VyO1xuICAgICAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgUGFyc2VyVHlwZS5FQ01BU2NyaXB0OlxuICAgICAgICAgICAgICAgIHBhcnNlciA9IG5ldyBBU1RQYXJzZXJEZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlVua293biBwYXJzZXIgdHlwZVwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBwYXJzZXIuZ2VuZXJhdGUoc291cmNlKVxuICAgIH1cbn1cblxuY2xhc3MgQVNUUGFyc2VyRGVmYXVsdCBleHRlbmRzIEFTVFBhcnNlciB7XG5cbn1cblxuZXhwb3J0IGNsYXNzIERlbHZlbkFTVFZpc2l0b3IgZXh0ZW5kcyBEZWx2ZW5WaXNpdG9yIHtcbiAgICBwcml2YXRlIHJ1bGVUeXBlTWFwOiBNYXA8bnVtYmVyLCBzdHJpbmc+ID0gbmV3IE1hcCgpO1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuc2V0dXBUeXBlUnVsZXMoKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHNldHVwVHlwZVJ1bGVzKCkge1xuICAgICAgICBjb25zdCBrZXlzID0gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoRUNNQVNjcmlwdFBhcnNlcik7XG4gICAgICAgIGZvciAodmFyIGtleSBpbiBrZXlzKSB7XG4gICAgICAgICAgICBsZXQgbmFtZSA9IGtleXNba2V5XTtcbiAgICAgICAgICAgIGlmIChuYW1lLnN0YXJ0c1dpdGgoJ1JVTEVfJykpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJ1bGVUeXBlTWFwLnNldChwYXJzZUludChFQ01BU2NyaXB0UGFyc2VyW25hbWVdKSwgbmFtZSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgZHVtcENvbnRleHQoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zdCBrZXlzID0gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoRUNNQVNjcmlwdFBhcnNlcik7XG4gICAgICAgIGxldCBjb250ZXh0ID0gW11cbiAgICAgICAgZm9yICh2YXIga2V5IGluIGtleXMpIHtcbiAgICAgICAgICAgIGxldCBuYW1lID0ga2V5c1trZXldO1xuICAgICAgICAgICAgLy8gdGhpcyBvbmx5IHRlc3QgaW5oZXJpdGFuY2VcbiAgICAgICAgICAgIGlmIChuYW1lLmVuZHNXaXRoKCdDb250ZXh0JykpIHtcbiAgICAgICAgICAgICAgICBpZiAoY3R4IGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlcltuYW1lXSkge1xuICAgICAgICAgICAgICAgICAgICBjb250ZXh0LnB1c2gobmFtZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gZGlyeSBoYWNrIGZvciB3YWxraW5nIGFudGxlciBkZXBlbmN5IGNoYWluIFxuICAgICAgICAvLyBmaW5kIGxvbmdlc3QgZGVwZW5kZW5jeSBjaGFpbmc7XG4gICAgICAgIC8vIHRoaXMgdHJhdmVyc2FsIGlzIHNwZWNpZmljIHRvIEFOVEwgcGFyc2VyXG4gICAgICAgIC8vIFdlIHdhbnQgdG8gYmUgYWJsZSB0byBmaW5kIGRlcGVuZGVuY2llcyBzdWNoIGFzO1xuICAgICAgICAvKlxuICAgICAgICAgICAgLS0tLS0tLS0gLS0tLS0tLS0tLS0tXG4gICAgICAgICAgICBQcm9wZXJ0eUV4cHJlc3Npb25Bc3NpZ25tZW50Q29udGV4dFxuICAgICAgICAgICAgKiogUHJvcGVydHlBc3NpZ25tZW50Q29udGV4dFxuICAgICAgICAgICAgKiogUGFyc2VyUnVsZUNvbnRleHRcbiAgICAgICAgICAgIC0tLS0tLS0tIC0tLS0tLS0tLS0tLVxuICAgICAgICAgICAgUHJvcGVydHlBc3NpZ25tZW50Q29udGV4dFxuICAgICAgICAgICAgKiogUGFyc2VyUnVsZUNvbnRleHRcbiAgICAgICAgICovXG4gICAgICAgICBpZiAoY29udGV4dC5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICBsZXQgY29udGV4dE5hbWU7XG4gICAgICAgICAgICBsZXQgbG9uZ2VzdCA9IDA7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGtleSBpbiBjb250ZXh0KSB7XG4gICAgICAgICAgICAgICAgY29uc3QgbmFtZSA9IGNvbnRleHRba2V5XTtcbiAgICAgICAgICAgICAgICBsZXQgb2JqID0gRUNNQVNjcmlwdFBhcnNlcltuYW1lXTtcbiAgICAgICAgICAgICAgICBsZXQgY2hhaW4gPSAxO1xuICAgICAgICAgICAgICAgIGRvIHtcbiAgICAgICAgICAgICAgICAgICAgKytjaGFpbjtcbiAgICAgICAgICAgICAgICAgICAgb2JqID0gRUNNQVNjcmlwdFBhcnNlcltvYmoucHJvdG90eXBlLl9fcHJvdG9fXy5jb25zdHJ1Y3Rvci5uYW1lXTtcbiAgICAgICAgICAgICAgICB9IHdoaWxlIChvYmogJiYgb2JqLnByb3RvdHlwZSlcbiAgICAgICAgICAgICAgICBpZihjaGFpbiA+IGxvbmdlc3Qpe1xuICAgICAgICAgICAgICAgICAgICBsb25nZXN0ID0gY2hhaW47XG4gICAgICAgICAgICAgICAgICAgIGNvbnRleHROYW1lID0gYCR7bmFtZX0gWyR7Y2hhaW59XWA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIFtjb250ZXh0TmFtZV07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNvbnRleHQ7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBkdW1wQ29udGV4dEFsbENoaWxkcmVuKGN0eDogUnVsZUNvbnRleHQsIGluZGVudDogbnVtYmVyID0gMCkge1xuICAgICAgICBsZXQgcGFkID0gXCIgXCIucGFkU3RhcnQoaW5kZW50LCBcIlxcdFwiKTtcbiAgICAgICAgbGV0IG5vZGVzID0gdGhpcy5kdW1wQ29udGV4dChjdHgpO1xuICAgICAgICBpZiAobm9kZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgY29uc29sZS5pbmZvKHBhZCArIFwiICogXCIgKyBub2RlcylcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGN0eC5nZXRDaGlsZENvdW50KCk7ICsraSkge1xuICAgICAgICAgICAgbGV0IGNoaWxkID0gY3R4Py5nZXRDaGlsZChpKTtcbiAgICAgICAgICAgIGlmIChjaGlsZCkge1xuICAgICAgICAgICAgICAgIHRoaXMuZHVtcENvbnRleHRBbGxDaGlsZHJlbihjaGlsZCwgKytpbmRlbnQpO1xuICAgICAgICAgICAgICAgIC0taW5kZW50O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0IHJ1bGUgbmFtZSBieSB0aGUgSWRcbiAgICAgKiBAcGFyYW0gaWQgXG4gICAgICovXG4gICAgZ2V0UnVsZUJ5SWQoaWQ6IG51bWJlcik6IHN0cmluZyB8IHVuZGVmaW5lZCB7XG4gICAgICAgIHJldHVybiB0aGlzLnJ1bGVUeXBlTWFwLmdldChpZCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc01hcmtlcihtZXRhZGF0YTogYW55KSB7XG4gICAgICAgIHJldHVybiB7IGluZGV4OiAxLCBsaW5lOiAxLCBjb2x1bW46IDEgfVxuICAgIH1cblxuICAgIHByaXZhdGUgZGVjb3JhdGUobm9kZTogYW55LCBtYXJrZXI6IE1hcmtlcik6IGFueSB7XG4gICAgICAgIG5vZGUuc3RhcnQgPSAwO1xuICAgICAgICBub2RlLmVuZCA9IDA7XG4gICAgICAgIHJldHVybiBub2RlO1xuICAgIH1cblxuICAgIHByaXZhdGUgdGhyb3dUeXBlRXJyb3IodHlwZUlkOiBhbnkpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlVuaGFuZGxlZCB0eXBlIDogXCIgKyB0eXBlSWQgKyBcIiA6IFwiICsgdGhpcy5nZXRSdWxlQnlJZCh0eXBlSWQpKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUaHJvdyBUeXBlRXJyb3Igb25seSB3aGVuIHRoZXJlIGlzIGEgdHlwZSBwcm92aWRlZC4gXG4gICAgICogVGhpcyBpcyB1c2VmdWxsIHdoZW4gdGhlcmUgbm9kZSBpdGEgVGVybWluYWxOb2RlIFxuICAgICAqIEBwYXJhbSB0eXBlIFxuICAgICAqL1xuICAgIHByaXZhdGUgdGhyb3dJbnNhbmNlRXJyb3IodHlwZTogYW55KSB7XG4gICAgICAgIC8qICAgICAgICAgaWYgKHR5cGUgPT0gdW5kZWZpbmVkIHx8IHR5cGUgPT0gXCJcIikge1xuICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9ICovXG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJVbmhhbmRsZWQgaW5zdGFuY2UgdHlwZSA6IFwiICsgdHlwZSk7XG4gICAgfVxuXG4gICAgYXNzZXJ0VHlwZShjdHg6IFJ1bGVDb250ZXh0LCB0eXBlOiBhbnkpIHtcbiAgICAgICAgaWYgKCEoY3R4IGluc3RhbmNlb2YgdHlwZSkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJJbnZhbGlkIHR5cGUgZXhwZWN0ZWQgOiAnXCIgKyB0eXBlLm5hbWUgKyBcIicgcmVjZWl2ZWQgJ1wiICsgdGhpcy5kdW1wQ29udGV4dChjdHgpKSArIFwiJ1wiO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjcHJvZ3JhbS5cbiAgICB2aXNpdFByb2dyYW0oY3R4OiBFQ01BU2NyaXB0UGFyc2VyLlByb2dyYW1Db250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0UHJvZ3JhbSBbJXNdIDogJXNcIiwgY3R4LmdldENoaWxkQ291bnQoKSwgY3R4LmdldFRleHQoKSk7XG4gICAgICAgIC8vIHZpc2l0UHJvZ3JhbSAtPnZpc2l0U291cmNlRWxlbWVudHMgLT4gdmlzaXRTb3VyY2VFbGVtZW50IC0+IHZpc2l0U3RhdGVtZW50XG4gICAgICAgIGxldCBzdGF0ZW1lbnRzOiBhbnkgPSBbXTtcbiAgICAgICAgbGV0IG5vZGUgPSBjdHguZ2V0Q2hpbGQoMCk7ICAvLyB2aXNpdFByb2dyYW0gLT52aXNpdFNvdXJjZUVsZW1lbnRzIFxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5vZGUuZ2V0Q2hpbGRDb3VudCgpOyArK2kpIHtcbiAgICAgICAgICAgIGxldCBzdG0gPSBub2RlLmdldENoaWxkKGkpLmdldENoaWxkKDApOyAvLyBTb3VyY2VFbGVtZW50c0NvbnRleHQgPiBTdGF0ZW1lbnRDb250ZXh0XG4gICAgICAgICAgICBpZiAoc3RtIGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5TdGF0ZW1lbnRDb250ZXh0KSB7XG4gICAgICAgICAgICAgICAgbGV0IHN0YXRlbWVudCA9IHRoaXMudmlzaXRTdGF0ZW1lbnQoc3RtKTtcbiAgICAgICAgICAgICAgICBzdGF0ZW1lbnRzLnB1c2goc3RhdGVtZW50KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy50aHJvd0luc2FuY2VFcnJvcih0aGlzLmR1bXBDb250ZXh0KHN0bSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGxldCBpbnRlcnZhbCA9IGN0eC5nZXRTb3VyY2VJbnRlcnZhbCgpO1xuICAgICAgICBsZXQgc2NyaXB0ID0gbmV3IFNjcmlwdChzdGF0ZW1lbnRzKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGVjb3JhdGUoc2NyaXB0LCB0aGlzLmFzTWFya2VyKHRoaXMuYXNNZXRhZGF0YShpbnRlcnZhbCkpKTtcbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNzdGF0ZW1lbnQuXG4gICAgdmlzaXRTdGF0ZW1lbnQoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICB0aGlzLmFzc2VydFR5cGUoY3R4LCBFQ01BU2NyaXB0UGFyc2VyLlN0YXRlbWVudENvbnRleHQpXG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0U3RhdGVtZW50IFslc10gOiAlc1wiLCBjdHguZ2V0Q2hpbGRDb3VudCgpLCBjdHguZ2V0VGV4dCgpKTtcbiAgICAgICAgbGV0IG5vZGU6IFJ1bGVDb250ZXh0ID0gY3R4LmdldENoaWxkKDApO1xuXG4gICAgICAgIGlmIChub2RlIGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5FeHByZXNzaW9uU3RhdGVtZW50Q29udGV4dCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmlzaXRFeHByZXNzaW9uU3RhdGVtZW50KG5vZGUpO1xuICAgICAgICB9IGVsc2UgaWYgKG5vZGUgaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLlZhcmlhYmxlU3RhdGVtZW50Q29udGV4dCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmlzaXRWYXJpYWJsZVN0YXRlbWVudChub2RlKTtcbiAgICAgICAgfSBlbHNlIGlmIChub2RlIGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5CbG9ja0NvbnRleHQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnZpc2l0QmxvY2sobm9kZSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAobm9kZSBpbnN0YW5jZW9mIEVDTUFTY3JpcHRQYXJzZXIuRW1wdHlTdGF0ZW1lbnRDb250ZXh0KSB7XG4gICAgICAgICAgICAvLyBOT09QLFxuICAgICAgICAgICAgLy8gdmFyIHg7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnRocm93SW5zYW5jZUVycm9yKHRoaXMuZHVtcENvbnRleHQobm9kZSkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjYmxvY2suXG4gICAgdmlzaXRCbG9jayhjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0QmxvY2sgWyVzXSA6ICVzXCIsIGN0eC5nZXRDaGlsZENvdW50KCksIGN0eC5nZXRUZXh0KCkpO1xuICAgICAgICB0aGlzLmFzc2VydFR5cGUoY3R4LCBFQ01BU2NyaXB0UGFyc2VyLkJsb2NrQ29udGV4dClcbiAgICAgICAgbGV0IGJvZHkgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjdHguZ2V0Q2hpbGRDb3VudCgpOyArK2kpIHtcbiAgICAgICAgICAgIGxldCBub2RlOiBSdWxlQ29udGV4dCA9IGN0eC5nZXRDaGlsZChpKTtcbiAgICAgICAgICAgIGlmIChub2RlIGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5TdGF0ZW1lbnRMaXN0Q29udGV4dCkge1xuICAgICAgICAgICAgICAgIGxldCBzdGF0ZW1lbnRMaXN0ID0gdGhpcy52aXNpdFN0YXRlbWVudExpc3Qobm9kZSk7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaW5kZXggaW4gc3RhdGVtZW50TGlzdCkge1xuICAgICAgICAgICAgICAgICAgICBib2R5LnB1c2goc3RhdGVtZW50TGlzdFtpbmRleF0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy50aHJvd0luc2FuY2VFcnJvcih0aGlzLmR1bXBDb250ZXh0KG5vZGUpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5kZWNvcmF0ZShuZXcgQmxvY2tTdGF0ZW1lbnQoYm9keSksIHRoaXMuYXNNYXJrZXIodGhpcy5hc01ldGFkYXRhKGN0eC5nZXRTb3VyY2VJbnRlcnZhbCgpKSkpO1xuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjc3RhdGVtZW50TGlzdC5cbiAgICB2aXNpdFN0YXRlbWVudExpc3QoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJ2aXNpdFN0YXRlbWVudExpc3QgWyVzXSA6ICVzXCIsIGN0eC5nZXRDaGlsZENvdW50KCksIGN0eC5nZXRUZXh0KCkpO1xuICAgICAgICBsZXQgYm9keSA9IFtdO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGN0eC5nZXRDaGlsZENvdW50KCk7ICsraSkge1xuICAgICAgICAgICAgbGV0IG5vZGU6IFJ1bGVDb250ZXh0ID0gY3R4LmdldENoaWxkKGkpO1xuICAgICAgICAgICAgbGV0IHR5cGUgPSBub2RlLnJ1bGVJbmRleDtcbiAgICAgICAgICAgIGlmICh0eXBlID09IEVDTUFTY3JpcHRQYXJzZXIuUlVMRV9zdGF0ZW1lbnQpIHtcbiAgICAgICAgICAgICAgICBsZXQgc3RhdGVtZW50OiBhbnkgPSB0aGlzLnZpc2l0U3RhdGVtZW50KG5vZGUpO1xuICAgICAgICAgICAgICAgIGJvZHkucHVzaChzdGF0ZW1lbnQpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy50aHJvd1R5cGVFcnJvcih0eXBlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYm9keTtcbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciN2YXJpYWJsZVN0YXRlbWVudC5cbiAgICB2aXNpdFZhcmlhYmxlU3RhdGVtZW50KGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS5pbmZvKFwidmlzaXRWYXJpYWJsZVN0YXRlbWVudCBbJXNdIDogJXNcIiwgY3R4LmdldENoaWxkQ291bnQoKSwgY3R4LmdldFRleHQoKSk7XG4gICAgICAgIHRoaXMuZHVtcENvbnRleHRBbGxDaGlsZHJlbihjdHgpXG5cbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciN2YXJpYWJsZURlY2xhcmF0aW9uTGlzdC5cbiAgICB2aXNpdFZhcmlhYmxlRGVjbGFyYXRpb25MaXN0KGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZShcInZpc2l0VmFyaWFibGVEZWNsYXJhdGlvbkxpc3Q6IFwiICsgY3R4LmdldFRleHQoKSk7XG4gICAgfVxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjdmFyaWFibGVEZWNsYXJhdGlvbi5cbiAgICB2aXNpdFZhcmlhYmxlRGVjbGFyYXRpb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKFwidmlzaXRWYXJpYWJsZURlY2xhcmF0aW9uOiBcIiArIGN0eC5nZXRUZXh0KCkpO1xuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjaW5pdGlhbGlzZXIuXG4gICAgdmlzaXRJbml0aWFsaXNlcihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoXCJ2aXNpdEluaXRpYWxpc2VyOiBcIiArIGN0eC5nZXRUZXh0KCkpO1xuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjZW1wdHlTdGF0ZW1lbnQuXG4gICAgdmlzaXRFbXB0eVN0YXRlbWVudChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0RW1wdHlTdGF0ZW1lbnRYWDogXCIgKyBjdHguZ2V0VGV4dCgpKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldFJ1bGVUeXBlKG5vZGU6IGFueSwgaW5kZXg6IG51bWJlcik6IG51bWJlciB7XG4gICAgICAgIHJldHVybiBub2RlLmdldENoaWxkKGluZGV4KS5ydWxlSW5kZXg7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc3NlcnROb2RlQ291bnQoY3R4OiBSdWxlQ29udGV4dCwgY291bnQ6IG51bWJlcikge1xuICAgICAgICBpZiAoY3R4LmdldENoaWxkQ291bnQoKSAhPSBjb3VudCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiV3JvbmcgY2hpbGQgY291bnQsIGV4cGVjdGVkICdcIiArIGNvdW50ICsgXCInIGdvdCA6IFwiICsgY3R4LmdldENoaWxkQ291bnQoKSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNleHByZXNzaW9uU3RhdGVtZW50LlxuICAgIHZpc2l0RXhwcmVzc2lvblN0YXRlbWVudChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0RXhwcmVzc2lvblN0YXRlbWVudDogXCIgKyBjdHguZ2V0VGV4dCgpKTtcbiAgICAgICAgdGhpcy5hc3NlcnRUeXBlKGN0eCwgRUNNQVNjcmlwdFBhcnNlci5FeHByZXNzaW9uU3RhdGVtZW50Q29udGV4dClcbiAgICAgICAgdGhpcy5hc3NlcnROb2RlQ291bnQoY3R4LCAxKTtcbiAgICAgICAgLy8gdmlzaXRFeHByZXNzaW9uU3RhdGVtZW50Oj52aXNpdEV4cHJlc3Npb25TZXF1ZW5jZVxuICAgICAgICBsZXQgbm9kZTogUnVsZUNvbnRleHQgPSBjdHguZ2V0Q2hpbGQoMCk7IC8vIHZpc2l0RXhwcmVzc2lvblNlcXVlbmNlIFxuICAgICAgICBsZXQgZXhwXG4gICAgICAgIGlmIChub2RlIGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5FeHByZXNzaW9uU2VxdWVuY2VDb250ZXh0KSB7XG4gICAgICAgICAgICBleHAgPSB0aGlzLnZpc2l0RXhwcmVzc2lvblNlcXVlbmNlKG5vZGUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy50aHJvd0luc2FuY2VFcnJvcih0aGlzLmR1bXBDb250ZXh0KG5vZGUpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBleHAgLy90aGlzLmRlY29yYXRlKGV4cCwgdGhpcy5hc01hcmtlcih0aGlzLmFzTWV0YWRhdGEoY3R4LmdldFNvdXJjZUludGVydmFsKCkpKSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc01ldGFkYXRhKGludGVydmFsOiBJbnRlcnZhbCk6IGFueSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBzdGFydDoge1xuICAgICAgICAgICAgICAgIGxpbmU6IDEsXG4gICAgICAgICAgICAgICAgY29sdW1uOiBpbnRlcnZhbC5zdGFydCxcbiAgICAgICAgICAgICAgICBvZmZzZXQ6IDBcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBlbmQ6IHtcbiAgICAgICAgICAgICAgICBsaW5lOiAxLFxuICAgICAgICAgICAgICAgIGNvbHVtbjogaW50ZXJ2YWwuc3RvcCxcbiAgICAgICAgICAgICAgICBvZmZzZXQ6IDNcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2lmU3RhdGVtZW50LlxuICAgIHZpc2l0SWZTdGF0ZW1lbnQoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJ2aXNpdElmU3RhdGVtZW50OiBcIiArIGN0eC5nZXRUZXh0KCkpO1xuXG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNEb1N0YXRlbWVudC5cbiAgICB2aXNpdERvU3RhdGVtZW50KGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS5pbmZvKFwidmlzaXREb1N0YXRlbWVudDogXCIgKyBjdHguZ2V0VGV4dCgpKTtcblxuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjV2hpbGVTdGF0ZW1lbnQuXG4gICAgdmlzaXRXaGlsZVN0YXRlbWVudChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0V2hpbGVTdGF0ZW1lbnQ6IFwiICsgY3R4LmdldFRleHQoKSk7XG5cbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI0ZvclN0YXRlbWVudC5cbiAgICB2aXNpdEZvclN0YXRlbWVudChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0V2hpbGVTdGF0ZW1lbnQ6IFwiICsgY3R4LmdldFRleHQoKSk7XG5cbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI0ZvclZhclN0YXRlbWVudC5cbiAgICB2aXNpdEZvclZhclN0YXRlbWVudChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG5cbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI0ZvckluU3RhdGVtZW50LlxuICAgIHZpc2l0Rm9ySW5TdGF0ZW1lbnQoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuXG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNGb3JWYXJJblN0YXRlbWVudC5cbiAgICB2aXNpdEZvclZhckluU3RhdGVtZW50KGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcblxuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjY29udGludWVTdGF0ZW1lbnQuXG4gICAgdmlzaXRDb250aW51ZVN0YXRlbWVudChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG5cbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2JyZWFrU3RhdGVtZW50LlxuICAgIHZpc2l0QnJlYWtTdGF0ZW1lbnQoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuXG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNyZXR1cm5TdGF0ZW1lbnQuXG4gICAgdmlzaXRSZXR1cm5TdGF0ZW1lbnQoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuXG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciN3aXRoU3RhdGVtZW50LlxuICAgIHZpc2l0V2l0aFN0YXRlbWVudChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG5cbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI3N3aXRjaFN0YXRlbWVudC5cbiAgICB2aXNpdFN3aXRjaFN0YXRlbWVudChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG5cbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2Nhc2VCbG9jay5cbiAgICB2aXNpdENhc2VCbG9jayhjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG5cbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2Nhc2VDbGF1c2VzLlxuICAgIHZpc2l0Q2FzZUNsYXVzZXMoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuXG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNjYXNlQ2xhdXNlLlxuICAgIHZpc2l0Q2FzZUNsYXVzZShjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG5cbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2RlZmF1bHRDbGF1c2UuXG4gICAgdmlzaXREZWZhdWx0Q2xhdXNlKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcblxuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjbGFiZWxsZWRTdGF0ZW1lbnQuXG4gICAgdmlzaXRMYWJlbGxlZFN0YXRlbWVudChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG5cbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI3Rocm93U3RhdGVtZW50LlxuICAgIHZpc2l0VGhyb3dTdGF0ZW1lbnQoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuXG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciN0cnlTdGF0ZW1lbnQuXG4gICAgdmlzaXRUcnlTdGF0ZW1lbnQoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuXG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNjYXRjaFByb2R1Y3Rpb24uXG4gICAgdmlzaXRDYXRjaFByb2R1Y3Rpb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuXG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNmaW5hbGx5UHJvZHVjdGlvbi5cbiAgICB2aXNpdEZpbmFsbHlQcm9kdWN0aW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcblxuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjZGVidWdnZXJTdGF0ZW1lbnQuXG4gICAgdmlzaXREZWJ1Z2dlclN0YXRlbWVudChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG5cbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2Z1bmN0aW9uRGVjbGFyYXRpb24uXG4gICAgdmlzaXRGdW5jdGlvbkRlY2xhcmF0aW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcblxuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjZm9ybWFsUGFyYW1ldGVyTGlzdC5cbiAgICB2aXNpdEZvcm1hbFBhcmFtZXRlckxpc3QoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjZnVuY3Rpb25Cb2R5LlxuICAgIHZpc2l0RnVuY3Rpb25Cb2R5KGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS5pbmZvKFwidmlzaXRGdW5jdGlvbkJvZHk6IFwiICsgY3R4LmdldFRleHQoKSk7XG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNhcnJheUxpdGVyYWwuXG4gICAgdmlzaXRBcnJheUxpdGVyYWwoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJ2aXNpdEFycmF5TGl0ZXJhbCBbJXNdIDogJXNcIiwgY3R4LmdldENoaWxkQ291bnQoKSwgY3R4LmdldFRleHQoKSk7XG4gICAgICAgIHRoaXMuYXNzZXJ0VHlwZShjdHgsIEVDTUFTY3JpcHRQYXJzZXIuQXJyYXlMaXRlcmFsQ29udGV4dClcbiAgICAgICAgLy8gdGhpcy5hc3NlcnROb2RlQ291bnQoY3R4LCAzKVxuICAgICAgICBsZXQgZWxlbWVudExpc3QgPSBjdHguZ2V0Q2hpbGQoMSk7XG4gICAgICAgIGxldCBlbGVtZW50cyA9IHRoaXMudmlzaXRFbGVtZW50TGlzdChlbGVtZW50TGlzdCk7XG4gICAgICAgIGxldCBlbGlzaW9uVmFsdWVzXG4gICAgICAgIGlmIChjdHguZ2V0Q2hpbGRDb3VudCgpID09IDUpIHtcbiAgICAgICAgICAgIGxldCBlbGlzaW9uID0gY3R4LmdldENoaWxkKDMpO1xuICAgICAgICAgICAgZWxpc2lvblZhbHVlcyA9IHRoaXMudmlzaXRFbGlzaW9uKGVsaXNpb24pO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGxpdGVyYWxzID0gW107XG4gICAgICAgIGxpdGVyYWxzID0gbGl0ZXJhbHMuY29uY2F0KGVsZW1lbnRzKTtcbiAgICAgICAgbGl0ZXJhbHMgPSBsaXRlcmFscy5jb25jYXQoZWxpc2lvblZhbHVlcyk7XG4gICAgICAgIHJldHVybiBsaXRlcmFscztcbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNlbGVtZW50TGlzdC5cbiAgICB2aXNpdEVsZW1lbnRMaXN0KGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS5pbmZvKFwidmlzaXRFbGVtZW50TGlzdCBbJXNdIDogJXNcIiwgY3R4LmdldENoaWxkQ291bnQoKSwgY3R4LmdldFRleHQoKSk7XG4gICAgICAgIHRoaXMuYXNzZXJ0VHlwZShjdHgsIEVDTUFTY3JpcHRQYXJzZXIuRWxlbWVudExpc3RDb250ZXh0KVxuXG4gICAgICAgIGxldCBlbGVtZW50cyA9IFtdO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGN0eC5nZXRDaGlsZENvdW50KCk7ICsraSkge1xuICAgICAgICAgICAgbGV0IG5vZGUgPSBjdHguZ2V0Q2hpbGQoaSk7XG5cbiAgICAgICAgICAgIGlmIChub2RlLnN5bWJvbCAhPSB1bmRlZmluZWQpXG4gICAgICAgICAgICAgICAgY29udGludWU7XG5cbiAgICAgICAgICAgIGxldCBlbGVtO1xuICAgICAgICAgICAgaWYgKG5vZGUgaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLklkZW50aWZpZXJFeHByZXNzaW9uQ29udGV4dCkge1xuICAgICAgICAgICAgICAgIGVsZW0gPSB0aGlzLnZpc2l0SWRlbnRpZmllckV4cHJlc3Npb24obm9kZSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG5vZGUgaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLkxpdGVyYWxFeHByZXNzaW9uQ29udGV4dCkge1xuICAgICAgICAgICAgICAgIGVsZW0gPSB0aGlzLnZpc2l0TGl0ZXJhbEV4cHJlc3Npb24obm9kZSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG5vZGUgaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLkFkZGl0aXZlRXhwcmVzc2lvbkNvbnRleHQpIHtcbiAgICAgICAgICAgICAgICBlbGVtID0gdGhpcy52aXNpdEFkZGl0aXZlRXhwcmVzc2lvbihub2RlKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAobm9kZSBpbnN0YW5jZW9mIEVDTUFTY3JpcHRQYXJzZXIuTXVsdGlwbGljYXRpdmVFeHByZXNzaW9uQ29udGV4dCkge1xuICAgICAgICAgICAgICAgIGVsZW0gPSB0aGlzLnZpc2l0TXVsdGlwbGljYXRpdmVFeHByZXNzaW9uKG5vZGUpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnRocm93SW5zYW5jZUVycm9yKHRoaXMuZHVtcENvbnRleHQobm9kZSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxlbWVudHMucHVzaChlbGVtKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZWxlbWVudHM7XG4gICAgfVxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjZWxpc2lvbi5cbiAgICB2aXNpdEVsaXNpb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJ2aXNpdEVsaXNpb24gWyVzXSA6ICVzXCIsIGN0eC5nZXRDaGlsZENvdW50KCksIGN0eC5nZXRUZXh0KCkpO1xuICAgICAgICB0aGlzLmFzc2VydFR5cGUoY3R4LCBFQ01BU2NyaXB0UGFyc2VyLkVsaXNpb25Db250ZXh0KVxuICAgICAgICAvLyBjb21wbGlhbmNlOiBlc3ByaW1hIGNvbXBsaWFuZSBvciByZXR1cm5pbmcgYG51bGxgIFxuICAgICAgICBsZXQgZWxpc2lvbiA9IFtdO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGN0eC5nZXRDaGlsZENvdW50KCk7ICsraSkge1xuICAgICAgICAgICAgZWxpc2lvbi5wdXNoKG51bGwpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBlbGlzaW9uO1xuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI29iamVjdExpdGVyYWwuXG4gICAgdmlzaXRPYmplY3RMaXRlcmFsKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS5pbmZvKFwidmlzaXRPYmplY3RMaXRlcmFsIFslc10gOiAlc1wiLCBjdHguZ2V0Q2hpbGRDb3VudCgpLCBjdHguZ2V0VGV4dCgpKTtcbiAgICAgICAgdGhpcy5hc3NlcnRUeXBlKGN0eCwgRUNNQVNjcmlwdFBhcnNlci5PYmplY3RMaXRlcmFsQ29udGV4dCk7XG4gICAgICAgIC8vIHRoaXMuZHVtcENvbnRleHRBbGxDaGlsZHJlbihjdHgpXG4gICAgICAgIGxldCB2YWwgPSB0aGlzLmR1bXBDb250ZXh0KGN0eC5nZXRDaGlsZCgxKS5nZXRDaGlsZCgwKSk7XG4gICAgICAgIGNvbnNvbGUuaW5mbyh2YWwpXG4gICAgfVxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjcHJvcGVydHlOYW1lQW5kVmFsdWVMaXN0LlxuICAgIHZpc2l0UHJvcGVydHlOYW1lQW5kVmFsdWVMaXN0KGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI1Byb3BlcnR5RXhwcmVzc2lvbkFzc2lnbm1lbnQuXG4gICAgdmlzaXRQcm9wZXJ0eUV4cHJlc3Npb25Bc3NpZ25tZW50KGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcblxuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjUHJvcGVydHlHZXR0ZXIuXG4gICAgdmlzaXRQcm9wZXJ0eUdldHRlcihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG5cbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI1Byb3BlcnR5U2V0dGVyLlxuICAgIHZpc2l0UHJvcGVydHlTZXR0ZXIoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuXG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNwcm9wZXJ0eU5hbWUuXG4gICAgdmlzaXRQcm9wZXJ0eU5hbWUoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuXG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNwcm9wZXJ0eVNldFBhcmFtZXRlckxpc3QuXG4gICAgdmlzaXRQcm9wZXJ0eVNldFBhcmFtZXRlckxpc3QoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuXG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNhcmd1bWVudHMuXG4gICAgdmlzaXRBcmd1bWVudHMoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJ2aXNpdEFyZ3VtZW50czogXCIgKyBjdHguZ2V0VGV4dCgpKTtcblxuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2FyZ3VtZW50TGlzdC5cbiAgICB2aXNpdEFyZ3VtZW50TGlzdChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0QXJndW1lbnRMaXN0OiBcIiArIGN0eC5nZXRUZXh0KCkpO1xuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2V4cHJlc3Npb25TZXF1ZW5jZS5cbiAgICB2aXNpdEV4cHJlc3Npb25TZXF1ZW5jZShjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0RXhwcmVzc2lvblNlcXVlbmNlIFslc10gOiBbJXNdXCIsIGN0eC5nZXRDaGlsZENvdW50KCksIGN0eC5nZXRUZXh0KCkpO1xuICAgICAgICB0aGlzLmFzc2VydFR5cGUoY3R4LCBFQ01BU2NyaXB0UGFyc2VyLkV4cHJlc3Npb25TZXF1ZW5jZUNvbnRleHQpO1xuICAgICAgICBsZXQgZXhwcmVzc2lvbnMgPSBbXTtcblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGN0eC5nZXRDaGlsZENvdW50KCk7ICsraSkge1xuICAgICAgICAgICAgbGV0IG5vZGU6IFJ1bGVDb250ZXh0ID0gY3R4LmdldENoaWxkKGkpO1xuICAgICAgICAgICAgbGV0IGV4cDtcbiAgICAgICAgICAgIGlmIChub2RlIGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5MaXRlcmFsRXhwcmVzc2lvbkNvbnRleHQpIHtcbiAgICAgICAgICAgICAgICBleHAgPSB0aGlzLnZpc2l0TGl0ZXJhbEV4cHJlc3Npb24obm9kZSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG5vZGUgaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLk9iamVjdExpdGVyYWxFeHByZXNzaW9uQ29udGV4dCkge1xuICAgICAgICAgICAgICAgIGV4cCA9IHRoaXMudmlzaXRPYmplY3RMaXRlcmFsRXhwcmVzc2lvbihub2RlKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAobm9kZSBpbnN0YW5jZW9mIEVDTUFTY3JpcHRQYXJzZXIuQXNzaWdubWVudEV4cHJlc3Npb25Db250ZXh0KSB7XG4gICAgICAgICAgICAgICAgZXhwID0gdGhpcy52aXNpdEFzc2lnbm1lbnRFeHByZXNzaW9uKG5vZGUpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChub2RlIGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5BZGRpdGl2ZUV4cHJlc3Npb25Db250ZXh0KSB7XG4gICAgICAgICAgICAgICAgbGV0IG5vZGUgPSBleHAgPSB0aGlzLnZpc2l0QWRkaXRpdmVFeHByZXNzaW9uKG5vZGUpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChub2RlIGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5NdWx0aXBsaWNhdGl2ZUV4cHJlc3Npb25Db250ZXh0KSB7XG4gICAgICAgICAgICAgICAgZXhwID0gdGhpcy52aXNpdE11bHRpcGxpY2F0aXZlRXhwcmVzc2lvbihub2RlKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAobm9kZSBpbnN0YW5jZW9mIEVDTUFTY3JpcHRQYXJzZXIuQXJyYXlMaXRlcmFsRXhwcmVzc2lvbkNvbnRleHQpIHtcbiAgICAgICAgICAgICAgICBleHAgPSB0aGlzLnZpc2l0QXJyYXlMaXRlcmFsRXhwcmVzc2lvbihub2RlKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy50aHJvd0luc2FuY2VFcnJvcih0aGlzLmR1bXBDb250ZXh0KG5vZGUpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGV4cHJlc3Npb25zLnB1c2goZXhwKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBjb21wbGlhbmNlOiBlc3Bpcm1hLCBlc3ByZWVcbiAgICAgICAgLy8gdGhpcyBjaGVjayB0byBzZWUgaWYgdGhlcmUgYXJlIG11bHRpcGxlIGV4cHJlc3Npb25zIGlmIHNvIHRoZW4gd2UgbGVhdmUgdGhlbSBhcyBTZXF1ZW5jZUV4cHJlc3Npb24gXG4gICAgICAgIC8vIG90aGVyd2lzZSB3ZSB3aWxsIHJvbGwgdGhlbSB1cCBpbnRvIEV4cHJlc3Npb25TdGF0ZW1lbnQgd2l0aCBvbmUgZXhwcmVzc2lvblxuICAgICAgICAvLyBgMWAgPSBFeHByZXNzaW9uU3RhdGVtZW50IC0+IExpdGVyYWxcbiAgICAgICAgLy8gYDEsIDJgID0gRXhwcmVzc2lvblN0YXRlbWVudCAtPiBTZXF1ZW5jZUV4cHJlc3Npb24gLT4gTGl0ZXJhbCwgTGl0ZXJhbFxuICAgICAgICBsZXQgZXhwO1xuICAgICAgICBpZiAoZXhwcmVzc2lvbnMubGVuZ3RoID09IDEpIHtcbiAgICAgICAgICAgIGV4cCA9IG5ldyBFeHByZXNzaW9uU3RhdGVtZW50KGV4cHJlc3Npb25zWzBdKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZXhwID0gbmV3IFNlcXVlbmNlRXhwcmVzc2lvbihleHByZXNzaW9ucyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuZGVjb3JhdGUoZXhwLCB0aGlzLmFzTWFya2VyKHRoaXMuYXNNZXRhZGF0YShjdHguZ2V0U291cmNlSW50ZXJ2YWwoKSkpKVxuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjVGVybmFyeUV4cHJlc3Npb24uXG4gICAgdmlzaXRUZXJuYXJ5RXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG5cbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI0xvZ2ljYWxBbmRFeHByZXNzaW9uLlxuICAgIHZpc2l0TG9naWNhbEFuZEV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuXG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNQcmVJbmNyZW1lbnRFeHByZXNzaW9uLlxuICAgIHZpc2l0UHJlSW5jcmVtZW50RXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG5cbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI09iamVjdExpdGVyYWxFeHByZXNzaW9uLlxuICAgIHZpc2l0T2JqZWN0TGl0ZXJhbEV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJ2aXNpdE9iamVjdExpdGVyYWxFeHByZXNzaW9uIFslc10gOiAlc1wiLCBjdHguZ2V0Q2hpbGRDb3VudCgpLCBjdHguZ2V0VGV4dCgpKTtcbiAgICAgICAgdGhpcy5hc3NlcnRUeXBlKGN0eCwgRUNNQVNjcmlwdFBhcnNlci5PYmplY3RMaXRlcmFsRXhwcmVzc2lvbkNvbnRleHQpO1xuICAgICAgICBsZXQgZXhwcmVzc2lvbnMgPSBbXTtcbiAgICAgICAgbGV0IG5vZGUgPSBjdHguZ2V0Q2hpbGQoMCk7XG4gICAgICAgIHRoaXMuZHVtcENvbnRleHRBbGxDaGlsZHJlbihub2RlKTtcbiAgICAgICAgbGV0IG9iaiA9IHRoaXMudmlzaXRPYmplY3RMaXRlcmFsKG5vZGUpO1xuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjSW5FeHByZXNzaW9uLlxuICAgIHZpc2l0SW5FeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcblxuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjTG9naWNhbE9yRXhwcmVzc2lvbi5cbiAgICB2aXNpdExvZ2ljYWxPckV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuXG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNOb3RFeHByZXNzaW9uLlxuICAgIHZpc2l0Tm90RXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG5cbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI1ByZURlY3JlYXNlRXhwcmVzc2lvbi5cbiAgICB2aXNpdFByZURlY3JlYXNlRXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG5cbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI0FyZ3VtZW50c0V4cHJlc3Npb24uXG4gICAgdmlzaXRBcmd1bWVudHNFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS5pbmZvKFwidmlzaXRBcmd1bWVudHNFeHByZXNzaW9uOiBcIiArIGN0eC5nZXRUZXh0KCkpO1xuXG5cbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI1RoaXNFeHByZXNzaW9uLlxuICAgIHZpc2l0VGhpc0V4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuXG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNGdW5jdGlvbkV4cHJlc3Npb24uXG4gICAgdmlzaXRGdW5jdGlvbkV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuXG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNVbmFyeU1pbnVzRXhwcmVzc2lvbi5cbiAgICB2aXNpdFVuYXJ5TWludXNFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcblxuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjUG9zdERlY3JlYXNlRXhwcmVzc2lvbi5cbiAgICB2aXNpdFBvc3REZWNyZWFzZUV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuXG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNBc3NpZ25tZW50RXhwcmVzc2lvbi5cbiAgICB2aXNpdEFzc2lnbm1lbnRFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS5pbmZvKFwidmlzaXRBc3NpZ25tZW50RXhwcmVzc2lvbiBbJXNdIDogWyVzXVwiLCBjdHguZ2V0Q2hpbGRDb3VudCgpLCBjdHguZ2V0VGV4dCgpKTtcbiAgICAgICAgdGhpcy5hc3NlcnRUeXBlKGN0eCwgRUNNQVNjcmlwdFBhcnNlci5Bc3NpZ25tZW50RXhwcmVzc2lvbkNvbnRleHQpO1xuICAgICAgICB0aGlzLmFzc2VydE5vZGVDb3VudChjdHgsIDMpXG5cbiAgICAgICAgbGV0IGluaXRpYWxpc2VyID0gY3R4LmdldENoaWxkKDApOyAvLyBJZGVudGlmaWVyRXhwcmVzc2lvbkNvbnRleHRcbiAgICAgICAgbGV0IG9wZXJhdG9yID0gY3R4LmdldENoaWxkKDEpLmdldFRleHQoKTsgLy8gTm8gdHlwZSAoID0gKVxuICAgICAgICBsZXQgZXhwcmVzc2lvbiA9IGN0eC5nZXRDaGlsZCgyKTsgIC8vRXhwcmVzc2lvblNlcXVlbmNlQ29udGV4dFxuXG4gICAgICAgIGxldCBsaHMgPSB0aGlzLnZpc2l0SWRlbnRpZmllckV4cHJlc3Npb24oaW5pdGlhbGlzZXIpO1xuICAgICAgICBsZXQgcmhzID0gdGhpcy52aXNpdEV4cHJlc3Npb25TZXF1ZW5jZShleHByZXNzaW9uKTtcbiAgICAgICAgLy8gQ29tcGxpYW5jZSA6IHB1bGxpbmcgdXAgRXhwcmVzc2lvblN0YXRlbWVudCBpbnRvIEFzc2lnZW1lbnRFeHByZXNzaW9uXG4gICAgICAgIGxldCBub2RlID0gbmV3IEFzc2lnbm1lbnRFeHByZXNzaW9uKG9wZXJhdG9yLCBsaHMsIHJocy5leHByZXNzaW9uKVxuICAgICAgICByZXR1cm4gbm9kZTtcbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI1R5cGVvZkV4cHJlc3Npb24uXG4gICAgdmlzaXRUeXBlb2ZFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcblxuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjSW5zdGFuY2VvZkV4cHJlc3Npb24uXG4gICAgdmlzaXRJbnN0YW5jZW9mRXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG5cbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI1VuYXJ5UGx1c0V4cHJlc3Npb24uXG4gICAgdmlzaXRVbmFyeVBsdXNFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcblxuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjRGVsZXRlRXhwcmVzc2lvbi5cbiAgICB2aXNpdERlbGV0ZUV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuXG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNFcXVhbGl0eUV4cHJlc3Npb24uXG4gICAgdmlzaXRFcXVhbGl0eUV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuXG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNCaXRYT3JFeHByZXNzaW9uLlxuICAgIHZpc2l0Qml0WE9yRXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG5cbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI011bHRpcGxpY2F0aXZlRXhwcmVzc2lvbi5cbiAgICB2aXNpdE11bHRpcGxpY2F0aXZlRXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0TXVsdGlwbGljYXRpdmVFeHByZXNzaW9uIFslc10gOiAlc1wiLCBjdHguZ2V0Q2hpbGRDb3VudCgpLCBjdHguZ2V0VGV4dCgpKTtcbiAgICAgICAgdGhpcy5hc3NlcnRUeXBlKGN0eCwgRUNNQVNjcmlwdFBhcnNlci5NdWx0aXBsaWNhdGl2ZUV4cHJlc3Npb25Db250ZXh0KTtcbiAgICAgICAgdGhpcy5hc3NlcnROb2RlQ291bnQoY3R4LCAzKVxuXG4gICAgICAgIGxldCBsZWZ0ID0gY3R4LmdldENoaWxkKDApO1xuICAgICAgICBsZXQgb3BlcmF0b3IgPSBjdHguZ2V0Q2hpbGQoMSkuZ2V0VGV4dCgpOyAvLyBObyB0eXBlICggKywtIClcbiAgICAgICAgbGV0IHJpZ2h0ID0gY3R4LmdldENoaWxkKDIpO1xuICAgICAgICBsZXQgbGhzID0gdGhpcy52aXNpdEJpbmFyeUV4cHJlc3Npb24obGVmdCk7XG4gICAgICAgIGxldCByaHMgPSB0aGlzLnZpc2l0QmluYXJ5RXhwcmVzc2lvbihyaWdodCk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuZGVjb3JhdGUobmV3IEJpbmFyeUV4cHJlc3Npb24ob3BlcmF0b3IsIGxocywgcmhzKSwge30pO1xuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI0JpdFNoaWZ0RXhwcmVzc2lvbi5cbiAgICB2aXNpdEJpdFNoaWZ0RXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG5cbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNQYXJlbnRoZXNpemVkRXhwcmVzc2lvbi5cbiAgICB2aXNpdFBhcmVudGhlc2l6ZWRFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS5pbmZvKFwidmlzaXRQYXJlbnRoZXNpemVkRXhwcmVzc2lvbjogXCIgKyBjdHguZ2V0VGV4dCgpKTtcbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNBZGRpdGl2ZUV4cHJlc3Npb24uXG4gICAgdmlzaXRBZGRpdGl2ZUV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJ2aXNpdEFkZGl0aXZlRXhwcmVzc2lvbiBbJXNdIDogJXNcIiwgY3R4LmdldENoaWxkQ291bnQoKSwgY3R4LmdldFRleHQoKSk7XG4gICAgICAgIHRoaXMuYXNzZXJ0VHlwZShjdHgsIEVDTUFTY3JpcHRQYXJzZXIuQWRkaXRpdmVFeHByZXNzaW9uQ29udGV4dCk7XG4gICAgICAgIHRoaXMuYXNzZXJ0Tm9kZUNvdW50KGN0eCwgMylcblxuICAgICAgICBsZXQgbGVmdCA9IGN0eC5nZXRDaGlsZCgwKTtcbiAgICAgICAgbGV0IG9wZXJhdG9yID0gY3R4LmdldENoaWxkKDEpLmdldFRleHQoKTsgLy8gTm8gdHlwZSAoICssLSApXG4gICAgICAgIGxldCByaWdodCA9IGN0eC5nZXRDaGlsZCgyKTtcbiAgICAgICAgbGV0IGxocyA9IHRoaXMuX3Zpc2l0QmluYXJ5RXhwcmVzc2lvbihsZWZ0KTtcbiAgICAgICAgbGV0IHJocyA9IHRoaXMuX3Zpc2l0QmluYXJ5RXhwcmVzc2lvbihyaWdodCk7XG4gICAgICAgIC8vIHJldHVybiB0aGlzLmRlY29yYXRlKG5ldyBCaW5hcnlFeHByZXNzaW9uKG9wZXJhdG9yLCBsaHMgLHJocyksIHRoaXMuYXNNYXJrZXIodGhpcy5hc01ldGFkYXRhKGN0eC5zeW1ib2wpKSk7XG4gICAgICAgIHJldHVybiBuZXcgQmluYXJ5RXhwcmVzc2lvbihvcGVyYXRvciwgbGhzLCByaHMpO1xuICAgIH1cblxuICAgIF92aXNpdEJpbmFyeUV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJldmFsQmluYXJ5RXhwcmVzc2lvbiBbJXNdIDogJXNcIiwgY3R4LmdldENoaWxkQ291bnQoKSwgY3R4LmdldFRleHQoKSk7XG4gICAgICAgIGlmIChjdHggaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLklkZW50aWZpZXJFeHByZXNzaW9uQ29udGV4dCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmlzaXRJZGVudGlmaWVyRXhwcmVzc2lvbihjdHgpO1xuICAgICAgICB9IGVsc2UgaWYgKGN0eCBpbnN0YW5jZW9mIEVDTUFTY3JpcHRQYXJzZXIuTGl0ZXJhbEV4cHJlc3Npb25Db250ZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy52aXNpdExpdGVyYWxFeHByZXNzaW9uKGN0eCk7XG4gICAgICAgIH0gZWxzZSBpZiAoY3R4IGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5BZGRpdGl2ZUV4cHJlc3Npb25Db250ZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy52aXNpdEFkZGl0aXZlRXhwcmVzc2lvbihjdHgpO1xuICAgICAgICB9IGVsc2UgaWYgKGN0eCBpbnN0YW5jZW9mIEVDTUFTY3JpcHRQYXJzZXIuTXVsdGlwbGljYXRpdmVFeHByZXNzaW9uQ29udGV4dCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmlzaXRNdWx0aXBsaWNhdGl2ZUV4cHJlc3Npb24oY3R4KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnRocm93SW5zYW5jZUVycm9yKHRoaXMuZHVtcENvbnRleHQoY3R4KSk7XG4gICAgfVxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjUmVsYXRpb25hbEV4cHJlc3Npb24uXG4gICAgdmlzaXRSZWxhdGlvbmFsRXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gICAgfVxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjUG9zdEluY3JlbWVudEV4cHJlc3Npb24uXG4gICAgdmlzaXRQb3N0SW5jcmVtZW50RXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gICAgfVxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjQml0Tm90RXhwcmVzc2lvbi5cbiAgICB2aXNpdEJpdE5vdEV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuXG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNOZXdFeHByZXNzaW9uLlxuICAgIHZpc2l0TmV3RXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG5cbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI0xpdGVyYWxFeHByZXNzaW9uLlxuICAgIHZpc2l0TGl0ZXJhbEV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJ2aXNpdExpdGVyYWxFeHByZXNzaW9uIFslc10gOiBbJXNdXCIsIGN0eC5nZXRDaGlsZENvdW50KCksIGN0eC5nZXRUZXh0KCkpO1xuICAgICAgICB0aGlzLmFzc2VydFR5cGUoY3R4LCBFQ01BU2NyaXB0UGFyc2VyLkxpdGVyYWxFeHByZXNzaW9uQ29udGV4dCk7XG4gICAgICAgIHRoaXMuYXNzZXJ0Tm9kZUNvdW50KGN0eCwgMSk7XG4gICAgICAgIC8vIHZpc2l0TGl0ZXJhbEV4cHJlc3Npb246ID4gdmlzaXRMaXRlcmFsXG4gICAgICAgIGxldCBub2RlID0gY3R4LmdldENoaWxkKDApXG4gICAgICAgIGlmIChub2RlIGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5MaXRlcmFsQ29udGV4dCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmlzaXRMaXRlcmFsKG5vZGUpO1xuICAgICAgICB9IGVsc2UgaWYgKG5vZGUgaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLk51bWVyaWNMaXRlcmFsQ29udGV4dCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmlzaXROdW1lcmljTGl0ZXJhbChub2RlKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnRocm93SW5zYW5jZUVycm9yKHRoaXMuZHVtcENvbnRleHQobm9kZSkpO1xuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI0FycmF5TGl0ZXJhbEV4cHJlc3Npb24uXG4gICAgdmlzaXRBcnJheUxpdGVyYWxFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS5pbmZvKFwidmlzaXRBcnJheUxpdGVyYWxFeHByZXNzaW9uIFslc10gOiAlc1wiLCBjdHguZ2V0Q2hpbGRDb3VudCgpLCBjdHguZ2V0VGV4dCgpKTtcbiAgICAgICAgdGhpcy5hc3NlcnRUeXBlKGN0eCwgRUNNQVNjcmlwdFBhcnNlci5BcnJheUxpdGVyYWxFeHByZXNzaW9uQ29udGV4dCk7XG4gICAgICAgIHRoaXMuYXNzZXJ0Tm9kZUNvdW50KGN0eCwgMSk7XG4gICAgICAgIGxldCBub2RlID0gY3R4LmdldENoaWxkKDApO1xuICAgICAgICBsZXQgZWxlbWVudHMgPSB0aGlzLnZpc2l0QXJyYXlMaXRlcmFsKG5vZGUpO1xuXG4gICAgICAgIHJldHVybiBuZXcgQXJyYXlFeHByZXNzaW9uKGVsZW1lbnRzKTtcbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNNZW1iZXJEb3RFeHByZXNzaW9uLlxuICAgIHZpc2l0TWVtYmVyRG90RXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0TWVtYmVyRG90RXhwcmVzc2lvbiBbJXNdIDogJXNcIiwgY3R4LmdldENoaWxkQ291bnQoKSwgY3R4LmdldFRleHQoKSk7XG4gICAgfVxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjTWVtYmVySW5kZXhFeHByZXNzaW9uLlxuICAgIHZpc2l0TWVtYmVySW5kZXhFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI0lkZW50aWZpZXJFeHByZXNzaW9uLlxuICAgIHZpc2l0SWRlbnRpZmllckV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJ2aXNpdElkZW50aWZpZXJFeHByZXNzaW9uIFslc10gOiAlc1wiLCBjdHguZ2V0Q2hpbGRDb3VudCgpLCBjdHguZ2V0VGV4dCgpKTtcbiAgICAgICAgdGhpcy5hc3NlcnRUeXBlKGN0eCwgRUNNQVNjcmlwdFBhcnNlci5JZGVudGlmaWVyRXhwcmVzc2lvbkNvbnRleHQpO1xuICAgICAgICB0aGlzLmFzc2VydE5vZGVDb3VudChjdHgsIDEpXG4gICAgICAgIGxldCBpbml0aWFsaXNlciA9IGN0eC5nZXRDaGlsZCgwKTtcbiAgICAgICAgbGV0IG5hbWUgPSBpbml0aWFsaXNlci5nZXRUZXh0KCk7XG4gICAgICAgIHJldHVybiB0aGlzLmRlY29yYXRlKG5ldyBJZGVudGlmaWVyKG5hbWUpLCB0aGlzLmFzTWFya2VyKHRoaXMuYXNNZXRhZGF0YShpbml0aWFsaXNlci5zeW1ib2wpKSlcbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNCaXRBbmRFeHByZXNzaW9uLlxuICAgIHZpc2l0Qml0QW5kRXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gICAgfVxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjQml0T3JFeHByZXNzaW9uLlxuICAgIHZpc2l0Qml0T3JFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI0Fzc2lnbm1lbnRPcGVyYXRvckV4cHJlc3Npb24uXG4gICAgdmlzaXRBc3NpZ25tZW50T3BlcmF0b3JFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI1ZvaWRFeHByZXNzaW9uLlxuICAgIHZpc2l0Vm9pZEV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuXG4gICAgfVxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjYXNzaWdubWVudE9wZXJhdG9yLlxuICAgIHZpc2l0QXNzaWdubWVudE9wZXJhdG9yKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS5pbmZvKFwidmlzaXRBc3NpZ25tZW50T3BlcmF0b3I6IFwiICsgY3R4LmdldFRleHQoKSk7XG4gICAgfVxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjbGl0ZXJhbC5cbiAgICB2aXNpdExpdGVyYWwoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJ2aXNpdExpdGVyYWwgWyVzXSA6IFslc11cIiwgY3R4LmdldENoaWxkQ291bnQoKSwgY3R4LmdldFRleHQoKSk7XG4gICAgICAgIHRoaXMuYXNzZXJ0VHlwZShjdHgsIEVDTUFTY3JpcHRQYXJzZXIuTGl0ZXJhbENvbnRleHQpXG4gICAgICAgIHRoaXMuYXNzZXJ0Tm9kZUNvdW50KGN0eCwgMSk7XG4gICAgICAgIGxldCBub2RlOiBSdWxlQ29udGV4dCA9IGN0eC5nZXRDaGlsZCgwKTtcbiAgICAgICAgaWYgKG5vZGUuZ2V0Q2hpbGRDb3VudCgpID09IDEpIHtcbiAgICAgICAgICAgIGlmIChub2RlIGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5OdW1lcmljTGl0ZXJhbENvbnRleHQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy52aXNpdE51bWVyaWNMaXRlcmFsKG5vZGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy50aHJvd0luc2FuY2VFcnJvcih0aGlzLmR1bXBDb250ZXh0KG5vZGUpKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChub2RlLmdldENoaWxkQ291bnQoKSA9PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jcmVhdGVMaXRlcmFsVmFsdWUobm9kZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNudW1lcmljTGl0ZXJhbC5cbiAgICB2aXNpdE51bWVyaWNMaXRlcmFsKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS5pbmZvKFwidmlzaXROdW1lcmljTGl0ZXJhbCBbJXNdIDogWyVzXVwiLCBjdHguZ2V0Q2hpbGRDb3VudCgpLCBjdHguZ2V0VGV4dCgpKTtcbiAgICAgICAgdGhpcy5hc3NlcnRUeXBlKGN0eCwgRUNNQVNjcmlwdFBhcnNlci5OdW1lcmljTGl0ZXJhbENvbnRleHQpXG4gICAgICAgIHRoaXMuYXNzZXJ0Tm9kZUNvdW50KGN0eCwgMSk7XG4gICAgICAgIGxldCB2YWx1ZSA9IGN0eC5nZXRUZXh0KCk7XG4gICAgICAgIC8vIFRPRE8gOiBGaWd1cmUgb3V0IGJldHRlciB3YXlcbiAgICAgICAgbGV0IGxpdGVyYWwgPSBuZXcgTGl0ZXJhbChOdW1iZXIodmFsdWUpLCB2YWx1ZSk7XG4gICAgICAgIHJldHVybiB0aGlzLmRlY29yYXRlKGxpdGVyYWwsIHRoaXMuYXNNYXJrZXIodGhpcy5hc01ldGFkYXRhKGN0eC5nZXRTb3VyY2VJbnRlcnZhbCgpKSkpXG4gICAgfVxuXG4gICAgY3JlYXRlTGl0ZXJhbFZhbHVlKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS5pbmZvKFwiY3JlYXRlTGl0ZXJhbFZhbHVlIFslc106IFslc11cIiwgY3R4LmdldENoaWxkQ291bnQoKSwgY3R4LmdldFRleHQoKSk7XG4gICAgICAgIGxldCB2YWx1ZSA9IGN0eC5nZXRUZXh0KCk7XG4gICAgICAgIGxldCBsaXRlcmFsID0gbmV3IExpdGVyYWwodmFsdWUsIHZhbHVlKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGVjb3JhdGUobGl0ZXJhbCwgdGhpcy5hc01hcmtlcih0aGlzLmFzTWV0YWRhdGEoY3R4LmdldFNvdXJjZUludGVydmFsKCkpKSlcbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNpZGVudGlmaWVyTmFtZS5cbiAgICB2aXNpdElkZW50aWZpZXJOYW1lKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS5pbmZvKFwidmlzaXRJZGVudGlmaWVyTmFtZTogXCIgKyBjdHguZ2V0VGV4dCgpKTtcbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI3Jlc2VydmVkV29yZC5cbiAgICB2aXNpdFJlc2VydmVkV29yZChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0UmVzZXJ2ZWRXb3JkOiBcIiArIGN0eC5nZXRUZXh0KCkpO1xuXG5cbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2tleXdvcmQuXG4gICAgdmlzaXRLZXl3b3JkKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS5pbmZvKFwidmlzaXRLZXl3b3JkOiBcIiArIGN0eC5nZXRUZXh0KCkpO1xuXG5cbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2Z1dHVyZVJlc2VydmVkV29yZC5cbiAgICB2aXNpdEZ1dHVyZVJlc2VydmVkV29yZChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG5cbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2dldHRlci5cbiAgICB2aXNpdEdldHRlcihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG5cbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI3NldHRlci5cbiAgICB2aXNpdFNldHRlcihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG5cbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNlb3MuXG4gICAgdmlzaXRFb3MoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICAvL2NvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG5cbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNlb2YuXG4gICAgdmlzaXRFb2YoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuXG4gICAgfVxuXG59Il19