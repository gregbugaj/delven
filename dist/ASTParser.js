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

var fs = _interopRequireWildcard(require("fs"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

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
          contextName = `${name} [ ** ${chain}]`;
        }
      }

      return [contextName];
    }

    return context;
  }

  dumpContextAllChildren(ctx, indent = 0) {
    const pad = " ".padStart(indent, "\t");
    const nodes = this.dumpContext(ctx);

    if (nodes.length > 0) {
      const marker = indent == 0 ? " # " : " * ";
      console.info(pad + marker + nodes);
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
    const body = [];

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
    this.assertType(ctx, _ECMAScriptParser.ECMAScriptParser.VariableStatementContext);
    this.assertNodeCount(ctx, 3);
    const n0 = ctx.getChild(0); // var

    const n1 = ctx.getChild(1); // variable list

    const n2 = ctx.getChild(2); //EosContext

    this.dumpContextAllChildren(n2);
    const declarations = this.visitVariableDeclarationList(n1);
    const kind = "var";
    return new _nodes.VariableDeclaration(declarations, kind);
  } // Visit a parse tree produced by ECMAScriptParser#variableDeclarationList.


  visitVariableDeclarationList(ctx) {
    console.info("VariableDeclarationListContext [%s] : %s", ctx.getChildCount(), ctx.getText());
    this.assertType(ctx, _ECMAScriptParser.ECMAScriptParser.VariableDeclarationListContext); //this.assertNodeCount(ctx, 3);

    const declarations = [];
    const nodes = this.filterSymbols(ctx);
    nodes.forEach(node => {
      if (node instanceof _ECMAScriptParser.ECMAScriptParser.VariableDeclarationContext) {
        const declaration = this.visitVariableDeclaration(node);
        declarations.push(declaration);
      } else {
        this.throwInsanceError(this.dumpContext(node));
      }
    });
    return declarations;
  } // Visit a parse tree produced by ECMAScriptParser#variableDeclaration.


  visitVariableDeclaration(ctx) {
    console.info("visitVariableDeclaration [%s] : %s", ctx.getChildCount(), ctx.getText());
    this.assertType(ctx, _ECMAScriptParser.ECMAScriptParser.VariableDeclarationContext); // lenght of 1 or 2
    // 1 `var x`
    // 2 `var x = {}`

    const text = ctx.getText();
    const id = new _nodes.Identifier(text);
    let init = null;

    if (ctx.getChildCount() == 2) {
      init = this.visitInitialiser(ctx.getChild(1));
    } else {
      throw new TypeError("Unknow variable declaration type");
    }

    return new _nodes.VariableDeclarator(id, init);
  } // Visit a parse tree produced by ECMAScriptParser#initialiser.


  visitInitialiser(ctx) {
    console.info("visitInitialiser [%s] : %s", ctx.getChildCount(), ctx.getText());
    this.assertType(ctx, _ECMAScriptParser.ECMAScriptParser.InitialiserContext);
    this.assertNodeCount(ctx, 2);
    this.dumpContextAllChildren(ctx);
    const node = ctx.getChild(1);

    if (node instanceof _ECMAScriptParser.ECMAScriptParser.ObjectLiteralExpressionContext) {
      return this.visitObjectLiteralExpression(node);
    } else if (node instanceof _ECMAScriptParser.ECMAScriptParser.ArrayLiteralExpressionContext) {
      return this.visitArrayLiteralExpression(node);
    }

    this.throwInsanceError(this.dumpContext(node));
  } // Visit a parse tree produced by ECMAScriptParser#emptyStatement.


  visitEmptyStatement(ctx) {
    console.info("visitEmptyStatement [%s] : %s", ctx.getChildCount(), ctx.getText());
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

    const node = ctx.getChild(0); // visitExpressionSequence 

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
    this.assertType(ctx, _ECMAScriptParser.ECMAScriptParser.ArrayLiteralContext); // we just got `[]`

    if (ctx.getChildCount() == 2) {
      return [];
    }

    let results = []; // skip `[ and  ]` 

    for (let i = 1; i < ctx.getChildCount() - 1; ++i) {
      const node = ctx.getChild(i);
      let exp = [];

      if (node instanceof _ECMAScriptParser.ECMAScriptParser.ElementListContext) {
        exp = this.visitElementList(node);
      } else if (node instanceof _ECMAScriptParser.ECMAScriptParser.ElisionContext) {
        exp = this.visitElision(node);
      } else {
        // special case for handling elision values like :  [11,,,11] ]  [,,]
        if (node.symbol != undefined) {
          exp = [null];
        } else {
          this.throwInsanceError(this.dumpContext(node));
        }
      }

      results = [...results, ...exp];
    }

    return results;
  } // Visit a parse tree produced by ECMAScriptParser#elementList.


  visitElementList(ctx) {
    console.info("visitElementList [%s] : %s", ctx.getChildCount(), ctx.getText());
    this.assertType(ctx, _ECMAScriptParser.ECMAScriptParser.ElementListContext);
    const elements = [];
    const nodes = this.filterSymbols(ctx);

    for (let i = 0; i < nodes.length; ++i) {
      const elem = this.singleExpression(nodes[i]);
      elements.push(elem);
    }

    return elements;
  } // Visit a parse tree produced by ECMAScriptParser#elision.


  visitElision(ctx) {
    console.info("visitElision [%s] : %s", ctx.getChildCount(), ctx.getText());
    this.assertType(ctx, _ECMAScriptParser.ECMAScriptParser.ElisionContext); // compliance: esprima compliane or returning `null` 

    const elision = [];

    for (let i = 0; i < ctx.getChildCount(); ++i) {
      elision.push(null);
    }

    return elision;
  } // Visit a parse tree produced by ECMAScriptParser#objectLiteral.


  visitObjectLiteral(ctx) {
    console.info("visitObjectLiteral [%s] : %s", ctx.getChildCount(), ctx.getText());
    this.assertType(ctx, _ECMAScriptParser.ECMAScriptParser.ObjectLiteralContext);
    const node = ctx.getChild(1);

    if (node instanceof _ECMAScriptParser.ECMAScriptParser.PropertyNameAndValueListContext) {
      return this.visitPropertyNameAndValueList(node);
    }

    return [];
  } // Visit a parse tree produced by ECMAScriptParser#propertyNameAndValueList.


  visitPropertyNameAndValueList(ctx) {
    console.info("visitPropertyNameAndValueList [%s] : %s", ctx.getChildCount(), ctx.getText());
    this.assertType(ctx, _ECMAScriptParser.ECMAScriptParser.PropertyNameAndValueListContext);
    const properties = [];
    const nodes = this.filterSymbols(ctx);

    for (let i = 0; i < nodes.length; ++i) {
      const node = nodes[i];

      if (node instanceof _ECMAScriptParser.ECMAScriptParser.PropertyExpressionAssignmentContext) {
        const property = this.visitPropertyExpressionAssignment(node);
        properties.push(property);
      } else {
        this.throwInsanceError(this.dumpContext(node));
      }
    }

    return properties;
  }
  /**
   * Filter out TerminalNodes (commas, pipes, brackets)
   * @param ctx 
   */


  filterSymbols(ctx) {
    const filtered = [];

    for (let i = 0; i < ctx.getChildCount(); ++i) {
      const node = ctx.getChild(i); // there might be a better way

      if (node.symbol != undefined) {
        continue;
      }

      filtered.push(node);
    }

    return filtered;
  } // Visit a parse tree produced by ECMAScriptParser#PropertyExpressionAssignment.


  visitPropertyExpressionAssignment(ctx) {
    console.info("visitPropertyExpressionAssignment [%s] : %s", ctx.getChildCount(), ctx.getText());
    this.assertType(ctx, _ECMAScriptParser.ECMAScriptParser.PropertyExpressionAssignmentContext);
    this.assertNodeCount(ctx, 3);
    let n0 = ctx.getChild(0); // PropertyName

    let n1 = ctx.getChild(1); // symbol :

    let n2 = ctx.getChild(2); //  singleExpression 

    const key = this.visitPropertyName(n0);
    const value = this.singleExpression(n2);
    const computed = false;
    const method = false;
    const shorthand = false;
    return new _nodes.Property("init", key, computed, value, method, shorthand);
  } // Visit a parse tree produced by ECMAScriptParser#PropertyGetter.


  visitPropertyGetter(ctx) {
    console.trace('not implemented');
  } // Visit a parse tree produced by ECMAScriptParser#PropertySetter.


  visitPropertySetter(ctx) {
    console.trace('not implemented');
  } // Visit a parse tree produced by ECMAScriptParser#propertyName.


  visitPropertyName(ctx) {
    console.info("visitPropertyName [%s] : %s", ctx.getChildCount(), ctx.getText());
    this.assertType(ctx, _ECMAScriptParser.ECMAScriptParser.PropertyNameContext);
    this.assertNodeCount(ctx, 1);
    const node = ctx.getChild(0);
    const count = node.getChildCount();

    if (count == 0) {
      // literal
      return this.createLiteralValue(node);
    } else if (count == 1) {
      return this.visitIdentifierName(node);
    }

    this.throwInsanceError(this.dumpContext(node));
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
    const expressions = []; // each node is a singleExpression

    for (let i = 0; i < ctx.getChildCount(); ++i) {
      const node = ctx.getChild(i);
      const exp = this.singleExpression(node);
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
  }
  /**
   * Evaluate a singleExpression
   * @param node 
   */


  singleExpression(node) {
    if (node instanceof _ECMAScriptParser.ECMAScriptParser.LiteralExpressionContext) {
      return this.visitLiteralExpression(node);
    } else if (node instanceof _ECMAScriptParser.ECMAScriptParser.ObjectLiteralExpressionContext) {
      return this.visitObjectLiteralExpression(node);
    } else if (node instanceof _ECMAScriptParser.ECMAScriptParser.AssignmentExpressionContext) {
      return this.visitAssignmentExpression(node);
    } else if (node instanceof _ECMAScriptParser.ECMAScriptParser.AdditiveExpressionContext) {
      return this.visitAdditiveExpression(node);
    } else if (node instanceof _ECMAScriptParser.ECMAScriptParser.MultiplicativeExpressionContext) {
      return this.visitMultiplicativeExpression(node);
    } else if (node instanceof _ECMAScriptParser.ECMAScriptParser.ArrayLiteralExpressionContext) {
      return this.visitArrayLiteralExpression(node);
    }

    this.throwInsanceError(this.dumpContext(node));
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
    const node = ctx.getChild(0);
    const properties = this.visitObjectLiteral(node);
    return new _nodes.ObjectExpression(properties);
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
    const node = ctx.getChild(0);
    const elements = this.visitArrayLiteral(node);
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
    const initialiser = ctx.getChild(0);
    const name = initialiser.getText();
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
    const node = ctx.getChild(0);

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
    const value = ctx.getText(); // TODO : Figure out better way

    const literal = new _nodes.Literal(Number(value), value);
    return this.decorate(literal, this.asMarker(this.asMetadata(ctx.getSourceInterval())));
  }

  createLiteralValue(ctx) {
    console.info("createLiteralValue [%s]: [%s]", ctx.getChildCount(), ctx.getText());
    const value = ctx.getText();
    const literal = new _nodes.Literal(value, value);
    return this.decorate(literal, this.asMarker(this.asMetadata(ctx.getSourceInterval())));
  } // Visit a parse tree produced by ECMAScriptParser#identifierName.


  visitIdentifierName(ctx) {
    console.info("visitIdentifierName [%s]: [%s]", ctx.getChildCount(), ctx.getText());
    this.assertType(ctx, _ECMAScriptParser.ECMAScriptParser.IdentifierNameContext);
    this.assertNodeCount(ctx, 1);
    const value = ctx.getText();
    const identifier = new _nodes.Identifier(value);
    return this.decorate(identifier, this.asMarker(this.asMetadata(ctx.getSourceInterval())));
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9BU1RQYXJzZXIudHMiXSwibmFtZXMiOlsiUGFyc2VyVHlwZSIsIkFTVFBhcnNlciIsImNvbnN0cnVjdG9yIiwidmlzaXRvciIsIkRlbHZlbkFTVFZpc2l0b3IiLCJnZW5lcmF0ZSIsInNvdXJjZSIsImNvZGUiLCJ0eXBlIiwidmFsdWUiLCJmcyIsInJlYWRGaWxlU3luYyIsImNoYXJzIiwiYW50bHI0IiwiSW5wdXRTdHJlYW0iLCJsZXhlciIsIkRlbHZlbkxleGVyIiwidG9rZW5zIiwiQ29tbW9uVG9rZW5TdHJlYW0iLCJwYXJzZXIiLCJEZWx2ZW5QYXJzZXIiLCJ0cmVlIiwicHJvZ3JhbSIsImFjY2VwdCIsIlByaW50VmlzaXRvciIsImNvbnNvbGUiLCJpbmZvIiwicmVzdWx0IiwicGFyc2UiLCJFQ01BU2NyaXB0IiwiQVNUUGFyc2VyRGVmYXVsdCIsIkVycm9yIiwiRGVsdmVuVmlzaXRvciIsInJ1bGVUeXBlTWFwIiwiTWFwIiwic2V0dXBUeXBlUnVsZXMiLCJrZXlzIiwiT2JqZWN0IiwiZ2V0T3duUHJvcGVydHlOYW1lcyIsIkVDTUFTY3JpcHRQYXJzZXIiLCJrZXkiLCJuYW1lIiwic3RhcnRzV2l0aCIsInNldCIsInBhcnNlSW50IiwiZHVtcENvbnRleHQiLCJjdHgiLCJjb250ZXh0IiwiZW5kc1dpdGgiLCJwdXNoIiwibGVuZ3RoIiwiY29udGV4dE5hbWUiLCJsb25nZXN0Iiwib2JqIiwiY2hhaW4iLCJwcm90b3R5cGUiLCJfX3Byb3RvX18iLCJkdW1wQ29udGV4dEFsbENoaWxkcmVuIiwiaW5kZW50IiwicGFkIiwicGFkU3RhcnQiLCJub2RlcyIsIm1hcmtlciIsImkiLCJnZXRDaGlsZENvdW50IiwiY2hpbGQiLCJnZXRDaGlsZCIsImdldFJ1bGVCeUlkIiwiaWQiLCJnZXQiLCJhc01hcmtlciIsIm1ldGFkYXRhIiwiaW5kZXgiLCJsaW5lIiwiY29sdW1uIiwiZGVjb3JhdGUiLCJub2RlIiwic3RhcnQiLCJlbmQiLCJ0aHJvd1R5cGVFcnJvciIsInR5cGVJZCIsIlR5cGVFcnJvciIsInRocm93SW5zYW5jZUVycm9yIiwiYXNzZXJ0VHlwZSIsInZpc2l0UHJvZ3JhbSIsImdldFRleHQiLCJzdGF0ZW1lbnRzIiwic3RtIiwiU3RhdGVtZW50Q29udGV4dCIsInN0YXRlbWVudCIsInZpc2l0U3RhdGVtZW50IiwiaW50ZXJ2YWwiLCJnZXRTb3VyY2VJbnRlcnZhbCIsInNjcmlwdCIsIlNjcmlwdCIsImFzTWV0YWRhdGEiLCJFeHByZXNzaW9uU3RhdGVtZW50Q29udGV4dCIsInZpc2l0RXhwcmVzc2lvblN0YXRlbWVudCIsIlZhcmlhYmxlU3RhdGVtZW50Q29udGV4dCIsInZpc2l0VmFyaWFibGVTdGF0ZW1lbnQiLCJCbG9ja0NvbnRleHQiLCJ2aXNpdEJsb2NrIiwiRW1wdHlTdGF0ZW1lbnRDb250ZXh0IiwiYm9keSIsIlN0YXRlbWVudExpc3RDb250ZXh0Iiwic3RhdGVtZW50TGlzdCIsInZpc2l0U3RhdGVtZW50TGlzdCIsIkJsb2NrU3RhdGVtZW50IiwicnVsZUluZGV4IiwiUlVMRV9zdGF0ZW1lbnQiLCJ1bmRlZmluZWQiLCJhc3NlcnROb2RlQ291bnQiLCJuMCIsIm4xIiwibjIiLCJkZWNsYXJhdGlvbnMiLCJ2aXNpdFZhcmlhYmxlRGVjbGFyYXRpb25MaXN0Iiwia2luZCIsIlZhcmlhYmxlRGVjbGFyYXRpb24iLCJWYXJpYWJsZURlY2xhcmF0aW9uTGlzdENvbnRleHQiLCJmaWx0ZXJTeW1ib2xzIiwiZm9yRWFjaCIsIlZhcmlhYmxlRGVjbGFyYXRpb25Db250ZXh0IiwiZGVjbGFyYXRpb24iLCJ2aXNpdFZhcmlhYmxlRGVjbGFyYXRpb24iLCJ0ZXh0IiwiSWRlbnRpZmllciIsImluaXQiLCJ2aXNpdEluaXRpYWxpc2VyIiwiVmFyaWFibGVEZWNsYXJhdG9yIiwiSW5pdGlhbGlzZXJDb250ZXh0IiwiT2JqZWN0TGl0ZXJhbEV4cHJlc3Npb25Db250ZXh0IiwidmlzaXRPYmplY3RMaXRlcmFsRXhwcmVzc2lvbiIsIkFycmF5TGl0ZXJhbEV4cHJlc3Npb25Db250ZXh0IiwidmlzaXRBcnJheUxpdGVyYWxFeHByZXNzaW9uIiwidmlzaXRFbXB0eVN0YXRlbWVudCIsImdldFJ1bGVUeXBlIiwiY291bnQiLCJleHAiLCJFeHByZXNzaW9uU2VxdWVuY2VDb250ZXh0IiwidmlzaXRFeHByZXNzaW9uU2VxdWVuY2UiLCJvZmZzZXQiLCJzdG9wIiwidmlzaXRJZlN0YXRlbWVudCIsInZpc2l0RG9TdGF0ZW1lbnQiLCJ2aXNpdFdoaWxlU3RhdGVtZW50IiwidmlzaXRGb3JTdGF0ZW1lbnQiLCJ2aXNpdEZvclZhclN0YXRlbWVudCIsInRyYWNlIiwidmlzaXRGb3JJblN0YXRlbWVudCIsInZpc2l0Rm9yVmFySW5TdGF0ZW1lbnQiLCJ2aXNpdENvbnRpbnVlU3RhdGVtZW50IiwidmlzaXRCcmVha1N0YXRlbWVudCIsInZpc2l0UmV0dXJuU3RhdGVtZW50IiwidmlzaXRXaXRoU3RhdGVtZW50IiwidmlzaXRTd2l0Y2hTdGF0ZW1lbnQiLCJ2aXNpdENhc2VCbG9jayIsInZpc2l0Q2FzZUNsYXVzZXMiLCJ2aXNpdENhc2VDbGF1c2UiLCJ2aXNpdERlZmF1bHRDbGF1c2UiLCJ2aXNpdExhYmVsbGVkU3RhdGVtZW50IiwidmlzaXRUaHJvd1N0YXRlbWVudCIsInZpc2l0VHJ5U3RhdGVtZW50IiwidmlzaXRDYXRjaFByb2R1Y3Rpb24iLCJ2aXNpdEZpbmFsbHlQcm9kdWN0aW9uIiwidmlzaXREZWJ1Z2dlclN0YXRlbWVudCIsInZpc2l0RnVuY3Rpb25EZWNsYXJhdGlvbiIsInZpc2l0Rm9ybWFsUGFyYW1ldGVyTGlzdCIsInZpc2l0RnVuY3Rpb25Cb2R5IiwidmlzaXRBcnJheUxpdGVyYWwiLCJBcnJheUxpdGVyYWxDb250ZXh0IiwicmVzdWx0cyIsIkVsZW1lbnRMaXN0Q29udGV4dCIsInZpc2l0RWxlbWVudExpc3QiLCJFbGlzaW9uQ29udGV4dCIsInZpc2l0RWxpc2lvbiIsInN5bWJvbCIsImVsZW1lbnRzIiwiZWxlbSIsInNpbmdsZUV4cHJlc3Npb24iLCJlbGlzaW9uIiwidmlzaXRPYmplY3RMaXRlcmFsIiwiT2JqZWN0TGl0ZXJhbENvbnRleHQiLCJQcm9wZXJ0eU5hbWVBbmRWYWx1ZUxpc3RDb250ZXh0IiwidmlzaXRQcm9wZXJ0eU5hbWVBbmRWYWx1ZUxpc3QiLCJwcm9wZXJ0aWVzIiwiUHJvcGVydHlFeHByZXNzaW9uQXNzaWdubWVudENvbnRleHQiLCJwcm9wZXJ0eSIsInZpc2l0UHJvcGVydHlFeHByZXNzaW9uQXNzaWdubWVudCIsImZpbHRlcmVkIiwidmlzaXRQcm9wZXJ0eU5hbWUiLCJjb21wdXRlZCIsIm1ldGhvZCIsInNob3J0aGFuZCIsIlByb3BlcnR5IiwidmlzaXRQcm9wZXJ0eUdldHRlciIsInZpc2l0UHJvcGVydHlTZXR0ZXIiLCJQcm9wZXJ0eU5hbWVDb250ZXh0IiwiY3JlYXRlTGl0ZXJhbFZhbHVlIiwidmlzaXRJZGVudGlmaWVyTmFtZSIsInZpc2l0UHJvcGVydHlTZXRQYXJhbWV0ZXJMaXN0IiwidmlzaXRBcmd1bWVudHMiLCJ2aXNpdEFyZ3VtZW50TGlzdCIsImV4cHJlc3Npb25zIiwiRXhwcmVzc2lvblN0YXRlbWVudCIsIlNlcXVlbmNlRXhwcmVzc2lvbiIsIkxpdGVyYWxFeHByZXNzaW9uQ29udGV4dCIsInZpc2l0TGl0ZXJhbEV4cHJlc3Npb24iLCJBc3NpZ25tZW50RXhwcmVzc2lvbkNvbnRleHQiLCJ2aXNpdEFzc2lnbm1lbnRFeHByZXNzaW9uIiwiQWRkaXRpdmVFeHByZXNzaW9uQ29udGV4dCIsInZpc2l0QWRkaXRpdmVFeHByZXNzaW9uIiwiTXVsdGlwbGljYXRpdmVFeHByZXNzaW9uQ29udGV4dCIsInZpc2l0TXVsdGlwbGljYXRpdmVFeHByZXNzaW9uIiwidmlzaXRUZXJuYXJ5RXhwcmVzc2lvbiIsInZpc2l0TG9naWNhbEFuZEV4cHJlc3Npb24iLCJ2aXNpdFByZUluY3JlbWVudEV4cHJlc3Npb24iLCJPYmplY3RFeHByZXNzaW9uIiwidmlzaXRJbkV4cHJlc3Npb24iLCJ2aXNpdExvZ2ljYWxPckV4cHJlc3Npb24iLCJ2aXNpdE5vdEV4cHJlc3Npb24iLCJ2aXNpdFByZURlY3JlYXNlRXhwcmVzc2lvbiIsInZpc2l0QXJndW1lbnRzRXhwcmVzc2lvbiIsInZpc2l0VGhpc0V4cHJlc3Npb24iLCJ2aXNpdEZ1bmN0aW9uRXhwcmVzc2lvbiIsInZpc2l0VW5hcnlNaW51c0V4cHJlc3Npb24iLCJ2aXNpdFBvc3REZWNyZWFzZUV4cHJlc3Npb24iLCJpbml0aWFsaXNlciIsIm9wZXJhdG9yIiwiZXhwcmVzc2lvbiIsImxocyIsInZpc2l0SWRlbnRpZmllckV4cHJlc3Npb24iLCJyaHMiLCJBc3NpZ25tZW50RXhwcmVzc2lvbiIsInZpc2l0VHlwZW9mRXhwcmVzc2lvbiIsInZpc2l0SW5zdGFuY2VvZkV4cHJlc3Npb24iLCJ2aXNpdFVuYXJ5UGx1c0V4cHJlc3Npb24iLCJ2aXNpdERlbGV0ZUV4cHJlc3Npb24iLCJ2aXNpdEVxdWFsaXR5RXhwcmVzc2lvbiIsInZpc2l0Qml0WE9yRXhwcmVzc2lvbiIsImxlZnQiLCJyaWdodCIsInZpc2l0QmluYXJ5RXhwcmVzc2lvbiIsIkJpbmFyeUV4cHJlc3Npb24iLCJ2aXNpdEJpdFNoaWZ0RXhwcmVzc2lvbiIsInZpc2l0UGFyZW50aGVzaXplZEV4cHJlc3Npb24iLCJfdmlzaXRCaW5hcnlFeHByZXNzaW9uIiwiSWRlbnRpZmllckV4cHJlc3Npb25Db250ZXh0IiwidmlzaXRSZWxhdGlvbmFsRXhwcmVzc2lvbiIsInZpc2l0UG9zdEluY3JlbWVudEV4cHJlc3Npb24iLCJ2aXNpdEJpdE5vdEV4cHJlc3Npb24iLCJ2aXNpdE5ld0V4cHJlc3Npb24iLCJMaXRlcmFsQ29udGV4dCIsInZpc2l0TGl0ZXJhbCIsIk51bWVyaWNMaXRlcmFsQ29udGV4dCIsInZpc2l0TnVtZXJpY0xpdGVyYWwiLCJBcnJheUV4cHJlc3Npb24iLCJ2aXNpdE1lbWJlckRvdEV4cHJlc3Npb24iLCJ2aXNpdE1lbWJlckluZGV4RXhwcmVzc2lvbiIsInZpc2l0Qml0QW5kRXhwcmVzc2lvbiIsInZpc2l0Qml0T3JFeHByZXNzaW9uIiwidmlzaXRBc3NpZ25tZW50T3BlcmF0b3JFeHByZXNzaW9uIiwidmlzaXRWb2lkRXhwcmVzc2lvbiIsInZpc2l0QXNzaWdubWVudE9wZXJhdG9yIiwibGl0ZXJhbCIsIkxpdGVyYWwiLCJOdW1iZXIiLCJJZGVudGlmaWVyTmFtZUNvbnRleHQiLCJpZGVudGlmaWVyIiwidmlzaXRSZXNlcnZlZFdvcmQiLCJ2aXNpdEtleXdvcmQiLCJ2aXNpdEZ1dHVyZVJlc2VydmVkV29yZCIsInZpc2l0R2V0dGVyIiwidmlzaXRTZXR0ZXIiLCJ2aXNpdEVvcyIsInZpc2l0RW9mIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBRUE7O0FBRUE7O0FBR0E7Ozs7OztBQUVBOzs7Ozs7OztJQVFZQSxVOzs7V0FBQUEsVTtBQUFBQSxFQUFBQSxVLENBQUFBLFU7R0FBQUEsVSwwQkFBQUEsVTs7QUFZRyxNQUFlQyxTQUFmLENBQXlCO0FBR3BDQyxFQUFBQSxXQUFXLENBQUNDLE9BQUQsRUFBNkI7QUFDcEMsU0FBS0EsT0FBTCxHQUFlQSxPQUFPLElBQUksSUFBSUMsZ0JBQUosRUFBMUI7QUFDSDs7QUFFREMsRUFBQUEsUUFBUSxDQUFDQyxNQUFELEVBQThCO0FBQ2xDLFFBQUlDLElBQUo7O0FBQ0EsWUFBUUQsTUFBTSxDQUFDRSxJQUFmO0FBQ0ksV0FBSyxNQUFMO0FBQ0lELFFBQUFBLElBQUksR0FBR0QsTUFBTSxDQUFDRyxLQUFkO0FBQ0E7O0FBQ0osV0FBSyxVQUFMO0FBQ0lGLFFBQUFBLElBQUksR0FBR0csRUFBRSxDQUFDQyxZQUFILENBQWdCTCxNQUFNLENBQUNHLEtBQXZCLEVBQThCLE1BQTlCLENBQVA7QUFDQTtBQU5SOztBQVNBLFFBQUlHLEtBQUssR0FBRyxJQUFJQyxNQUFNLENBQUNDLFdBQVgsQ0FBdUJQLElBQXZCLENBQVo7QUFDQSxRQUFJUSxLQUFLLEdBQUcsSUFBSUMsZ0NBQUosQ0FBZ0JKLEtBQWhCLENBQVo7QUFDQSxRQUFJSyxNQUFN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aUIsQ0FBQy9OLEdBQUQsRUFBbUI7QUFDaENyQixJQUFBQSxPQUFPLENBQUNDLElBQVIsQ0FBYSx3QkFBd0JvQixHQUFHLENBQUN1QyxPQUFKLEVBQXJDO0FBQ0gsR0FoaUMrQyxDQWtpQ2hEOzs7QUFDQXlMLEVBQUFBLFlBQVksQ0FBQ2hPLEdBQUQsRUFBbUI7QUFDM0JyQixJQUFBQSxPQUFPLENBQUNDLElBQVIsQ0FBYSxtQkFBbUJvQixHQUFHLENBQUN1QyxPQUFKLEVBQWhDO0FBRUgsR0F0aUMrQyxDQXlpQ2hEOzs7QUFDQTBMLEVBQUFBLHVCQUF1QixDQUFDak8sR0FBRCxFQUFtQjtBQUN0Q3JCLElBQUFBLE9BQU8sQ0FBQzJILEtBQVIsQ0FBYyxpQkFBZDtBQUNILEdBNWlDK0MsQ0E4aUNoRDs7O0FBQ0E0SCxFQUFBQSxXQUFXLENBQUNsTyxHQUFELEVBQW1CO0FBQzFCckIsSUFBQUEsT0FBTyxDQUFDMkgsS0FBUixDQUFjLGlCQUFkO0FBQ0gsR0FqakMrQyxDQWtqQ2hEOzs7QUFDQTZILEVBQUFBLFdBQVcsQ0FBQ25PLEdBQUQsRUFBbUI7QUFDMUJyQixJQUFBQSxPQUFPLENBQUMySCxLQUFSLENBQWMsaUJBQWQ7QUFDSCxHQXJqQytDLENBdWpDaEQ7OztBQUNBOEgsRUFBQUEsUUFBUSxDQUFDcE8sR0FBRCxFQUFtQixDQUUxQixDQUZPLENBQ0o7QUFHSjs7O0FBQ0FxTyxFQUFBQSxRQUFRLENBQUNyTyxHQUFELEVBQW1CO0FBQ3ZCckIsSUFBQUEsT0FBTyxDQUFDMkgsS0FBUixDQUFjLGlCQUFkO0FBQ0g7O0FBL2pDK0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBhbnRscjQgZnJvbSBcImFudGxyNFwiXG5pbXBvcnQgeyBFQ01BU2NyaXB0VmlzaXRvciBhcyBEZWx2ZW5WaXNpdG9yIH0gZnJvbSBcIi4vcGFyc2VyL0VDTUFTY3JpcHRWaXNpdG9yXCJcbmltcG9ydCB7IEVDTUFTY3JpcHRQYXJzZXIgYXMgRGVsdmVuUGFyc2VyLCBFQ01BU2NyaXB0UGFyc2VyIH0gZnJvbSBcIi4vcGFyc2VyL0VDTUFTY3JpcHRQYXJzZXJcIlxuaW1wb3J0IHsgRUNNQVNjcmlwdExleGVyIGFzIERlbHZlbkxleGVyIH0gZnJvbSBcIi4vcGFyc2VyL0VDTUFTY3JpcHRMZXhlclwiXG5pbXBvcnQgeyBSdWxlQ29udGV4dCB9IGZyb20gXCJhbnRscjQvUnVsZUNvbnRleHRcIlxuaW1wb3J0IHsgUHJpbnRWaXNpdG9yIH0gZnJvbSBcIi4vUHJpbnRWaXNpdG9yXCJcbmltcG9ydCBBU1ROb2RlIGZyb20gXCIuL0FTVE5vZGVcIjtcbmltcG9ydCB7IEV4cHJlc3Npb25TdGF0ZW1lbnQsIExpdGVyYWwsIFNjcmlwdCwgQmxvY2tTdGF0ZW1lbnQsIFN0YXRlbWVudCwgU2VxdWVuY2VFeHByZXNzaW9uLCBUaHJvd1N0YXRlbWVudCwgQXNzaWdubWVudEV4cHJlc3Npb24sIElkZW50aWZpZXIsIEJpbmFyeUV4cHJlc3Npb24sIEFycmF5RXhwcmVzc2lvbiwgT2JqZWN0RXhwcmVzc2lvbiwgT2JqZWN0RXhwcmVzc2lvblByb3BlcnR5LCBQcm9wZXJ0eSwgUHJvcGVydHlLZXksIFZhcmlhYmxlRGVjbGFyYXRpb24sIFZhcmlhYmxlRGVjbGFyYXRvciB9IGZyb20gXCIuL25vZGVzXCI7XG5pbXBvcnQgeyBTeW50YXggfSBmcm9tIFwiLi9zeW50YXhcIjtcbmltcG9ydCB7IHR5cGUgfSBmcm9tIFwib3NcIlxuaW1wb3J0ICogYXMgZnMgZnJvbSBcImZzXCJcblxuLyoqXG4gKiBWZXJzaW9uIHRoYXQgd2UgZ2VuZXJhdGUgdGhlIEFTVCBmb3IuIFxuICogVGhpcyBhbGxvd3MgZm9yIHRlc3RpbmcgZGlmZmVyZW50IGltcGxlbWVudGF0aW9uc1xuICogXG4gKiBDdXJyZW50bHkgb25seSBFQ01BU2NyaXB0IGlzIHN1cHBvcnRlZFxuICogXG4gKiBodHRwczovL2dpdGh1Yi5jb20vZXN0cmVlL2VzdHJlZVxuICovXG5leHBvcnQgZW51bSBQYXJzZXJUeXBlIHsgRUNNQVNjcmlwdCB9XG5leHBvcnQgdHlwZSBTb3VyY2VUeXBlID0gXCJjb2RlXCIgfCBcImZpbGVuYW1lXCI7XG5leHBvcnQgdHlwZSBTb3VyY2VDb2RlID0ge1xuICAgIHR5cGU6IFNvdXJjZVR5cGUsXG4gICAgdmFsdWU6IHN0cmluZ1xufVxuZXhwb3J0IGludGVyZmFjZSBNYXJrZXIge1xuICAgIGluZGV4OiBudW1iZXI7XG4gICAgbGluZTogbnVtYmVyO1xuICAgIGNvbHVtbjogbnVtYmVyO1xufVxuXG5leHBvcnQgZGVmYXVsdCBhYnN0cmFjdCBjbGFzcyBBU1RQYXJzZXIge1xuICAgIHByaXZhdGUgdmlzaXRvcjogKHR5cGVvZiBEZWx2ZW5WaXNpdG9yIHwgbnVsbClcblxuICAgIGNvbnN0cnVjdG9yKHZpc2l0b3I/OiBEZWx2ZW5BU1RWaXNpdG9yKSB7XG4gICAgICAgIHRoaXMudmlzaXRvciA9IHZpc2l0b3IgfHwgbmV3IERlbHZlbkFTVFZpc2l0b3IoKTtcbiAgICB9XG5cbiAgICBnZW5lcmF0ZShzb3VyY2U6IFNvdXJjZUNvZGUpOiBBU1ROb2RlIHtcbiAgICAgICAgbGV0IGNvZGU7XG4gICAgICAgIHN3aXRjaCAoc291cmNlLnR5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgXCJjb2RlXCI6XG4gICAgICAgICAgICAgICAgY29kZSA9IHNvdXJjZS52YWx1ZTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJmaWxlbmFtZVwiOlxuICAgICAgICAgICAgICAgIGNvZGUgPSBmcy5yZWFkRmlsZVN5bmMoc291cmNlLnZhbHVlLCBcInV0ZjhcIik7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgY2hhcnMgPSBuZXcgYW50bHI0LklucHV0U3RyZWFtKGNvZGUpO1xuICAgICAgICBsZXQgbGV4ZXIgPSBuZXcgRGVsdmVuTGV4ZXIoY2hhcnMpO1xuICAgICAgICBsZXQgdG9rZW5zID0gbmV3IGFudGxyNC5Db21tb25Ub2tlblN0cmVhbShsZXhlcik7XG4gICAgICAgIGxldCBwYXJzZXIgPSBuZXcgRGVsdmVuUGFyc2VyKHRva2Vucyk7XG4gICAgICAgIGxldCB0cmVlID0gcGFyc2VyLnByb2dyYW0oKTtcbiAgICAgICAgLy8gY29uc29sZS5pbmZvKHRyZWUudG9TdHJpbmdUcmVlKCkpXG4gICAgICAgIHRyZWUuYWNjZXB0KG5ldyBQcmludFZpc2l0b3IoKSk7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcIi0tLS0tLS0tLS0tLS0tLS0tLS0tLVwiKTtcbiAgICAgICAgbGV0IHJlc3VsdCA9IHRyZWUuYWNjZXB0KHRoaXMudmlzaXRvcik7XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUGFyc2Ugc291cmNlIGFuZCBnZW5lcmVhdGUgQVNUIHRyZWVcbiAgICAgKiBAcGFyYW0gc291cmNlIFxuICAgICAqIEBwYXJhbSB0eXBlIFxuICAgICAqL1xuICAgIHN0YXRpYyBwYXJzZShzb3VyY2U6IFNvdXJjZUNvZGUsIHR5cGU/OiBQYXJzZXJUeXBlKTogQVNUTm9kZSB7XG4gICAgICAgIGlmICh0eXBlID09IG51bGwpXG4gICAgICAgICAgICB0eXBlID0gUGFyc2VyVHlwZS5FQ01BU2NyaXB0O1xuICAgICAgICBsZXQgcGFyc2VyO1xuICAgICAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgUGFyc2VyVHlwZS5FQ01BU2NyaXB0OlxuICAgICAgICAgICAgICAgIHBhcnNlciA9IG5ldyBBU1RQYXJzZXJEZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlVua293biBwYXJzZXIgdHlwZVwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBwYXJzZXIuZ2VuZXJhdGUoc291cmNlKVxuICAgIH1cbn1cblxuY2xhc3MgQVNUUGFyc2VyRGVmYXVsdCBleHRlbmRzIEFTVFBhcnNlciB7XG5cbn1cblxuZXhwb3J0IGNsYXNzIERlbHZlbkFTVFZpc2l0b3IgZXh0ZW5kcyBEZWx2ZW5WaXNpdG9yIHtcbiAgICBwcml2YXRlIHJ1bGVUeXBlTWFwOiBNYXA8bnVtYmVyLCBzdHJpbmc+ID0gbmV3IE1hcCgpO1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuc2V0dXBUeXBlUnVsZXMoKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHNldHVwVHlwZVJ1bGVzKCkge1xuICAgICAgICBjb25zdCBrZXlzID0gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoRUNNQVNjcmlwdFBhcnNlcik7XG4gICAgICAgIGZvciAodmFyIGtleSBpbiBrZXlzKSB7XG4gICAgICAgICAgICBsZXQgbmFtZSA9IGtleXNba2V5XTtcbiAgICAgICAgICAgIGlmIChuYW1lLnN0YXJ0c1dpdGgoJ1JVTEVfJykpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJ1bGVUeXBlTWFwLnNldChwYXJzZUludChFQ01BU2NyaXB0UGFyc2VyW25hbWVdKSwgbmFtZSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgZHVtcENvbnRleHQoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zdCBrZXlzID0gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoRUNNQVNjcmlwdFBhcnNlcik7XG4gICAgICAgIGxldCBjb250ZXh0ID0gW11cbiAgICAgICAgZm9yICh2YXIga2V5IGluIGtleXMpIHtcbiAgICAgICAgICAgIGxldCBuYW1lID0ga2V5c1trZXldO1xuICAgICAgICAgICAgLy8gdGhpcyBvbmx5IHRlc3QgaW5oZXJpdGFuY2VcbiAgICAgICAgICAgIGlmIChuYW1lLmVuZHNXaXRoKCdDb250ZXh0JykpIHtcbiAgICAgICAgICAgICAgICBpZiAoY3R4IGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlcltuYW1lXSkge1xuICAgICAgICAgICAgICAgICAgICBjb250ZXh0LnB1c2gobmFtZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gZGlyeSBoYWNrIGZvciB3YWxraW5nIGFudGxlciBkZXBlbmN5IGNoYWluIFxuICAgICAgICAvLyBmaW5kIGxvbmdlc3QgZGVwZW5kZW5jeSBjaGFpbmc7XG4gICAgICAgIC8vIHRoaXMgdHJhdmVyc2FsIGlzIHNwZWNpZmljIHRvIEFOVEwgcGFyc2VyXG4gICAgICAgIC8vIFdlIHdhbnQgdG8gYmUgYWJsZSB0byBmaW5kIGRlcGVuZGVuY2llcyBzdWNoIGFzO1xuICAgICAgICAvKlxuICAgICAgICAgICAgLS0tLS0tLS0gLS0tLS0tLS0tLS0tXG4gICAgICAgICAgICBQcm9wZXJ0eUV4cHJlc3Npb25Bc3NpZ25tZW50Q29udGV4dFxuICAgICAgICAgICAgKiogUHJvcGVydHlBc3NpZ25tZW50Q29udGV4dFxuICAgICAgICAgICAgKiogUGFyc2VyUnVsZUNvbnRleHRcbiAgICAgICAgICAgIC0tLS0tLS0tIC0tLS0tLS0tLS0tLVxuICAgICAgICAgICAgUHJvcGVydHlBc3NpZ25tZW50Q29udGV4dFxuICAgICAgICAgICAgKiogUGFyc2VyUnVsZUNvbnRleHRcbiAgICAgICAgICovXG4gICAgICAgIGlmIChjb250ZXh0Lmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgIGxldCBjb250ZXh0TmFtZTtcbiAgICAgICAgICAgIGxldCBsb25nZXN0ID0gMDtcbiAgICAgICAgICAgIGZvciAoY29uc3Qga2V5IGluIGNvbnRleHQpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBuYW1lID0gY29udGV4dFtrZXldO1xuICAgICAgICAgICAgICAgIGxldCBvYmogPSBFQ01BU2NyaXB0UGFyc2VyW25hbWVdO1xuICAgICAgICAgICAgICAgIGxldCBjaGFpbiA9IDE7XG4gICAgICAgICAgICAgICAgZG8ge1xuICAgICAgICAgICAgICAgICAgICArK2NoYWluO1xuICAgICAgICAgICAgICAgICAgICBvYmogPSBFQ01BU2NyaXB0UGFyc2VyW29iai5wcm90b3R5cGUuX19wcm90b19fLmNvbnN0cnVjdG9yLm5hbWVdO1xuICAgICAgICAgICAgICAgIH0gd2hpbGUgKG9iaiAmJiBvYmoucHJvdG90eXBlKVxuICAgICAgICAgICAgICAgIGlmIChjaGFpbiA+IGxvbmdlc3QpIHtcbiAgICAgICAgICAgICAgICAgICAgbG9uZ2VzdCA9IGNoYWluO1xuICAgICAgICAgICAgICAgICAgICBjb250ZXh0TmFtZSA9IGAke25hbWV9IFsgKiogJHtjaGFpbn1dYDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gW2NvbnRleHROYW1lXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY29udGV4dDtcbiAgICB9XG5cbiAgICBwcml2YXRlIGR1bXBDb250ZXh0QWxsQ2hpbGRyZW4oY3R4OiBSdWxlQ29udGV4dCwgaW5kZW50OiBudW1iZXIgPSAwKSB7XG4gICAgICAgIGNvbnN0IHBhZCA9IFwiIFwiLnBhZFN0YXJ0KGluZGVudCwgXCJcXHRcIik7XG4gICAgICAgIGNvbnN0IG5vZGVzID0gdGhpcy5kdW1wQ29udGV4dChjdHgpO1xuICAgICAgICBpZiAobm9kZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgY29uc3QgbWFya2VyID0gaW5kZW50ID09IDAgPyBcIiAjIFwiIDogXCIgKiBcIjtcbiAgICAgICAgICAgIGNvbnNvbGUuaW5mbyhwYWQgKyBtYXJrZXIgKyBub2RlcylcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGN0eC5nZXRDaGlsZENvdW50KCk7ICsraSkge1xuICAgICAgICAgICAgbGV0IGNoaWxkID0gY3R4Py5nZXRDaGlsZChpKTtcbiAgICAgICAgICAgIGlmIChjaGlsZCkge1xuICAgICAgICAgICAgICAgIHRoaXMuZHVtcENvbnRleHRBbGxDaGlsZHJlbihjaGlsZCwgKytpbmRlbnQpO1xuICAgICAgICAgICAgICAgIC0taW5kZW50O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0IHJ1bGUgbmFtZSBieSB0aGUgSWRcbiAgICAgKiBAcGFyYW0gaWQgXG4gICAgICovXG4gICAgZ2V0UnVsZUJ5SWQoaWQ6IG51bWJlcik6IHN0cmluZyB8IHVuZGVmaW5lZCB7XG4gICAgICAgIHJldHVybiB0aGlzLnJ1bGVUeXBlTWFwLmdldChpZCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc01hcmtlcihtZXRhZGF0YTogYW55KSB7XG4gICAgICAgIHJldHVybiB7IGluZGV4OiAxLCBsaW5lOiAxLCBjb2x1bW46IDEgfVxuICAgIH1cblxuICAgIHByaXZhdGUgZGVjb3JhdGUobm9kZTogYW55LCBtYXJrZXI6IE1hcmtlcik6IGFueSB7XG4gICAgICAgIG5vZGUuc3RhcnQgPSAwO1xuICAgICAgICBub2RlLmVuZCA9IDA7XG4gICAgICAgIHJldHVybiBub2RlO1xuICAgIH1cblxuICAgIHByaXZhdGUgdGhyb3dUeXBlRXJyb3IodHlwZUlkOiBhbnkpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlVuaGFuZGxlZCB0eXBlIDogXCIgKyB0eXBlSWQgKyBcIiA6IFwiICsgdGhpcy5nZXRSdWxlQnlJZCh0eXBlSWQpKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUaHJvdyBUeXBlRXJyb3Igb25seSB3aGVuIHRoZXJlIGlzIGEgdHlwZSBwcm92aWRlZC4gXG4gICAgICogVGhpcyBpcyB1c2VmdWxsIHdoZW4gdGhlcmUgbm9kZSBpdGEgVGVybWluYWxOb2RlIFxuICAgICAqIEBwYXJhbSB0eXBlIFxuICAgICAqL1xuICAgIHByaXZhdGUgdGhyb3dJbnNhbmNlRXJyb3IodHlwZTogYW55KTogdm9pZCB7XG4gICAgICAgIC8qICAgICAgICAgaWYgKHR5cGUgPT0gdW5kZWZpbmVkIHx8IHR5cGUgPT0gXCJcIikge1xuICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9ICovXG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJVbmhhbmRsZWQgaW5zdGFuY2UgdHlwZSA6IFwiICsgdHlwZSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc3NlcnRUeXBlKGN0eDogUnVsZUNvbnRleHQsIHR5cGU6IGFueSk6IHZvaWQge1xuICAgICAgICBpZiAoIShjdHggaW5zdGFuY2VvZiB0eXBlKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkludmFsaWQgdHlwZSBleHBlY3RlZCA6ICdcIiArIHR5cGUubmFtZSArIFwiJyByZWNlaXZlZCAnXCIgKyB0aGlzLmR1bXBDb250ZXh0KGN0eCkpICsgXCInXCI7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNwcm9ncmFtLlxuICAgIHZpc2l0UHJvZ3JhbShjdHg6IEVDTUFTY3JpcHRQYXJzZXIuUHJvZ3JhbUNvbnRleHQpOiBTY3JpcHQge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJ2aXNpdFByb2dyYW0gWyVzXSA6ICVzXCIsIGN0eC5nZXRDaGlsZENvdW50KCksIGN0eC5nZXRUZXh0KCkpO1xuICAgICAgICAvLyB2aXNpdFByb2dyYW0gLT52aXNpdFNvdXJjZUVsZW1lbnRzIC0+IHZpc2l0U291cmNlRWxlbWVudCAtPiB2aXNpdFN0YXRlbWVudFxuICAgICAgICBsZXQgc3RhdGVtZW50czogYW55ID0gW107XG4gICAgICAgIGxldCBub2RlID0gY3R4LmdldENoaWxkKDApOyAgLy8gdmlzaXRQcm9ncmFtIC0+dmlzaXRTb3VyY2VFbGVtZW50cyBcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBub2RlLmdldENoaWxkQ291bnQoKTsgKytpKSB7XG4gICAgICAgICAgICBsZXQgc3RtID0gbm9kZS5nZXRDaGlsZChpKS5nZXRDaGlsZCgwKTsgLy8gU291cmNlRWxlbWVudHNDb250ZXh0ID4gU3RhdGVtZW50Q29udGV4dFxuICAgICAgICAgICAgaWYgKHN0bSBpbnN0YW5jZW9mIEVDTUFTY3JpcHRQYXJzZXIuU3RhdGVtZW50Q29udGV4dCkge1xuICAgICAgICAgICAgICAgIGxldCBzdGF0ZW1lbnQgPSB0aGlzLnZpc2l0U3RhdGVtZW50KHN0bSk7XG4gICAgICAgICAgICAgICAgc3RhdGVtZW50cy5wdXNoKHN0YXRlbWVudCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMudGhyb3dJbnNhbmNlRXJyb3IodGhpcy5kdW1wQ29udGV4dChzdG0pKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBsZXQgaW50ZXJ2YWwgPSBjdHguZ2V0U291cmNlSW50ZXJ2YWwoKTtcbiAgICAgICAgbGV0IHNjcmlwdCA9IG5ldyBTY3JpcHQoc3RhdGVtZW50cyk7XG4gICAgICAgIHJldHVybiB0aGlzLmRlY29yYXRlKHNjcmlwdCwgdGhpcy5hc01hcmtlcih0aGlzLmFzTWV0YWRhdGEoaW50ZXJ2YWwpKSk7XG4gICAgfVxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjc3RhdGVtZW50LlxuICAgIHZpc2l0U3RhdGVtZW50KGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgdGhpcy5hc3NlcnRUeXBlKGN0eCwgRUNNQVNjcmlwdFBhcnNlci5TdGF0ZW1lbnRDb250ZXh0KVxuICAgICAgICBjb25zb2xlLmluZm8oXCJ2aXNpdFN0YXRlbWVudCBbJXNdIDogJXNcIiwgY3R4LmdldENoaWxkQ291bnQoKSwgY3R4LmdldFRleHQoKSk7XG4gICAgICAgIGxldCBub2RlOiBSdWxlQ29udGV4dCA9IGN0eC5nZXRDaGlsZCgwKTtcblxuICAgICAgICBpZiAobm9kZSBpbnN0YW5jZW9mIEVDTUFTY3JpcHRQYXJzZXIuRXhwcmVzc2lvblN0YXRlbWVudENvbnRleHQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnZpc2l0RXhwcmVzc2lvblN0YXRlbWVudChub2RlKTtcbiAgICAgICAgfSBlbHNlIGlmIChub2RlIGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5WYXJpYWJsZVN0YXRlbWVudENvbnRleHQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnZpc2l0VmFyaWFibGVTdGF0ZW1lbnQobm9kZSk7XG4gICAgICAgIH0gZWxzZSBpZiAobm9kZSBpbnN0YW5jZW9mIEVDTUFTY3JpcHRQYXJzZXIuQmxvY2tDb250ZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy52aXNpdEJsb2NrKG5vZGUpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKG5vZGUgaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLkVtcHR5U3RhdGVtZW50Q29udGV4dCkge1xuICAgICAgICAgICAgLy8gTk9PUCxcbiAgICAgICAgICAgIC8vIHZhciB4O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy50aHJvd0luc2FuY2VFcnJvcih0aGlzLmR1bXBDb250ZXh0KG5vZGUpKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2Jsb2NrLlxuICAgIHZpc2l0QmxvY2soY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJ2aXNpdEJsb2NrIFslc10gOiAlc1wiLCBjdHguZ2V0Q2hpbGRDb3VudCgpLCBjdHguZ2V0VGV4dCgpKTtcbiAgICAgICAgdGhpcy5hc3NlcnRUeXBlKGN0eCwgRUNNQVNjcmlwdFBhcnNlci5CbG9ja0NvbnRleHQpXG4gICAgICAgIGxldCBib2R5ID0gW107XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY3R4LmdldENoaWxkQ291bnQoKTsgKytpKSB7XG4gICAgICAgICAgICBsZXQgbm9kZTogUnVsZUNvbnRleHQgPSBjdHguZ2V0Q2hpbGQoaSk7XG4gICAgICAgICAgICBpZiAobm9kZSBpbnN0YW5jZW9mIEVDTUFTY3JpcHRQYXJzZXIuU3RhdGVtZW50TGlzdENvbnRleHQpIHtcbiAgICAgICAgICAgICAgICBsZXQgc3RhdGVtZW50TGlzdCA9IHRoaXMudmlzaXRTdGF0ZW1lbnRMaXN0KG5vZGUpO1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGluZGV4IGluIHN0YXRlbWVudExpc3QpIHtcbiAgICAgICAgICAgICAgICAgICAgYm9keS5wdXNoKHN0YXRlbWVudExpc3RbaW5kZXhdKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMudGhyb3dJbnNhbmNlRXJyb3IodGhpcy5kdW1wQ29udGV4dChub2RlKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuZGVjb3JhdGUobmV3IEJsb2NrU3RhdGVtZW50KGJvZHkpLCB0aGlzLmFzTWFya2VyKHRoaXMuYXNNZXRhZGF0YShjdHguZ2V0U291cmNlSW50ZXJ2YWwoKSkpKTtcbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI3N0YXRlbWVudExpc3QuXG4gICAgdmlzaXRTdGF0ZW1lbnRMaXN0KGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS5pbmZvKFwidmlzaXRTdGF0ZW1lbnRMaXN0IFslc10gOiAlc1wiLCBjdHguZ2V0Q2hpbGRDb3VudCgpLCBjdHguZ2V0VGV4dCgpKTtcbiAgICAgICAgY29uc3QgYm9keSA9IFtdO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGN0eC5nZXRDaGlsZENvdW50KCk7ICsraSkge1xuICAgICAgICAgICAgbGV0IG5vZGU6IFJ1bGVDb250ZXh0ID0gY3R4LmdldENoaWxkKGkpO1xuICAgICAgICAgICAgbGV0IHR5cGUgPSBub2RlLnJ1bGVJbmRleDtcbiAgICAgICAgICAgIGlmICh0eXBlID09IEVDTUFTY3JpcHRQYXJzZXIuUlVMRV9zdGF0ZW1lbnQpIHtcbiAgICAgICAgICAgICAgICBsZXQgc3RhdGVtZW50OiBhbnkgPSB0aGlzLnZpc2l0U3RhdGVtZW50KG5vZGUpO1xuICAgICAgICAgICAgICAgIGJvZHkucHVzaChzdGF0ZW1lbnQpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy50aHJvd1R5cGVFcnJvcih0eXBlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYm9keTtcbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciN2YXJpYWJsZVN0YXRlbWVudC5cbiAgICB2aXNpdFZhcmlhYmxlU3RhdGVtZW50KGN0eDogUnVsZUNvbnRleHQpOiBWYXJpYWJsZURlY2xhcmF0aW9uIHtcbiAgICAgICAgY29uc29sZS5pbmZvKFwidmlzaXRWYXJpYWJsZVN0YXRlbWVudCBbJXNdIDogJXNcIiwgY3R4LmdldENoaWxkQ291bnQoKSwgY3R4LmdldFRleHQoKSk7XG4gICAgICAgIHRoaXMuYXNzZXJ0VHlwZShjdHgsIEVDTUFTY3JpcHRQYXJzZXIuVmFyaWFibGVTdGF0ZW1lbnRDb250ZXh0KVxuICAgICAgICB0aGlzLmFzc2VydE5vZGVDb3VudChjdHgsIDMpO1xuXG4gICAgICAgIGNvbnN0IG4wID0gY3R4LmdldENoaWxkKDApOyAvLyB2YXJcbiAgICAgICAgY29uc3QgbjEgPSBjdHguZ2V0Q2hpbGQoMSk7IC8vIHZhcmlhYmxlIGxpc3RcbiAgICAgICAgY29uc3QgbjIgPSBjdHguZ2V0Q2hpbGQoMik7ICAvL0Vvc0NvbnRleHRcblxuICAgICAgICB0aGlzLmR1bXBDb250ZXh0QWxsQ2hpbGRyZW4objIpXG4gICAgICAgIGNvbnN0IGRlY2xhcmF0aW9uczogVmFyaWFibGVEZWNsYXJhdG9yW10gPSB0aGlzLnZpc2l0VmFyaWFibGVEZWNsYXJhdGlvbkxpc3QobjEpO1xuICAgICAgICBjb25zdCBraW5kID0gXCJ2YXJcIjtcbiAgICAgICAgcmV0dXJuIG5ldyBWYXJpYWJsZURlY2xhcmF0aW9uKGRlY2xhcmF0aW9ucywga2luZCk7XG4gICAgfVxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjdmFyaWFibGVEZWNsYXJhdGlvbkxpc3QuXG4gICAgdmlzaXRWYXJpYWJsZURlY2xhcmF0aW9uTGlzdChjdHg6IFJ1bGVDb250ZXh0KTogVmFyaWFibGVEZWNsYXJhdG9yW10ge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJWYXJpYWJsZURlY2xhcmF0aW9uTGlzdENvbnRleHQgWyVzXSA6ICVzXCIsIGN0eC5nZXRDaGlsZENvdW50KCksIGN0eC5nZXRUZXh0KCkpO1xuICAgICAgICB0aGlzLmFzc2VydFR5cGUoY3R4LCBFQ01BU2NyaXB0UGFyc2VyLlZhcmlhYmxlRGVjbGFyYXRpb25MaXN0Q29udGV4dClcbiAgICAgICAgXG4gICAgICAgIC8vdGhpcy5hc3NlcnROb2RlQ291bnQoY3R4LCAzKTtcblxuICAgICAgICBjb25zdCBkZWNsYXJhdGlvbnM6IFZhcmlhYmxlRGVjbGFyYXRvcltdID0gW107XG4gICAgICAgIGNvbnN0IG5vZGVzID0gdGhpcy5maWx0ZXJTeW1ib2xzKGN0eCk7XG4gICAgICAgIG5vZGVzLmZvckVhY2gobm9kZSA9PiB7XG4gICAgICAgICAgICBpZiAobm9kZSBpbnN0YW5jZW9mIEVDTUFTY3JpcHRQYXJzZXIuVmFyaWFibGVEZWNsYXJhdGlvbkNvbnRleHQpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBkZWNsYXJhdGlvbiA9IHRoaXMudmlzaXRWYXJpYWJsZURlY2xhcmF0aW9uKG5vZGUpXG4gICAgICAgICAgICAgICAgZGVjbGFyYXRpb25zLnB1c2goZGVjbGFyYXRpb24pXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMudGhyb3dJbnNhbmNlRXJyb3IodGhpcy5kdW1wQ29udGV4dChub2RlKSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBkZWNsYXJhdGlvbnM7XG4gICAgfVxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjdmFyaWFibGVEZWNsYXJhdGlvbi5cbiAgICB2aXNpdFZhcmlhYmxlRGVjbGFyYXRpb24oY3R4OiBSdWxlQ29udGV4dCk6IFZhcmlhYmxlRGVjbGFyYXRvciB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0VmFyaWFibGVEZWNsYXJhdGlvbiBbJXNdIDogJXNcIiwgY3R4LmdldENoaWxkQ291bnQoKSwgY3R4LmdldFRleHQoKSk7XG4gICAgICAgIHRoaXMuYXNzZXJ0VHlwZShjdHgsIEVDTUFTY3JpcHRQYXJzZXIuVmFyaWFibGVEZWNsYXJhdGlvbkNvbnRleHQpXG4gICAgICAgIC8vIGxlbmdodCBvZiAxIG9yIDJcbiAgICAgICAgLy8gMSBgdmFyIHhgXG4gICAgICAgIC8vIDIgYHZhciB4ID0ge31gXG4gICAgICAgIGNvbnN0IHRleHQgPSBjdHguZ2V0VGV4dCgpO1xuICAgICAgICBjb25zdCBpZCA9IG5ldyBJZGVudGlmaWVyKHRleHQpO1xuICAgICAgICBsZXQgaW5pdCA9IG51bGw7XG4gICAgICAgIGlmKGN0eC5nZXRDaGlsZENvdW50KCkgPT0gMikge1xuICAgICAgICAgICAgaW5pdCAgPSB0aGlzLnZpc2l0SW5pdGlhbGlzZXIoY3R4LmdldENoaWxkKDEpKTtcbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiVW5rbm93IHZhcmlhYmxlIGRlY2xhcmF0aW9uIHR5cGVcIik7XG4gICAgICAgIH0gICAgXG4gICAgICAgIHJldHVybiBuZXcgVmFyaWFibGVEZWNsYXJhdG9yKGlkLCBpbml0KTtcbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNpbml0aWFsaXNlci5cbiAgICB2aXNpdEluaXRpYWxpc2VyKGN0eDogUnVsZUNvbnRleHQpIDogT2JqZWN0RXhwcmVzc2lvbiB8IEFycmF5RXhwcmVzc2lvbiB8IHVuZGVmaW5lZCB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0SW5pdGlhbGlzZXIgWyVzXSA6ICVzXCIsIGN0eC5nZXRDaGlsZENvdW50KCksIGN0eC5nZXRUZXh0KCkpO1xuICAgICAgICB0aGlzLmFzc2VydFR5cGUoY3R4LCBFQ01BU2NyaXB0UGFyc2VyLkluaXRpYWxpc2VyQ29udGV4dClcbiAgICAgICAgdGhpcy5hc3NlcnROb2RlQ291bnQoY3R4LCAyKTtcbiAgICAgICAgdGhpcy5kdW1wQ29udGV4dEFsbENoaWxkcmVuKGN0eClcbiAgICAgICAgY29uc3Qgbm9kZTpSdWxlQ29udGV4dCA9IGN0eC5nZXRDaGlsZCgxKTtcbiAgICAgICAgaWYobm9kZSBpbnN0YW5jZW9mIEVDTUFTY3JpcHRQYXJzZXIuT2JqZWN0TGl0ZXJhbEV4cHJlc3Npb25Db250ZXh0KXtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnZpc2l0T2JqZWN0TGl0ZXJhbEV4cHJlc3Npb24obm9kZSk7XG4gICAgICAgIH0gIGVsc2UgaWYobm9kZSBpbnN0YW5jZW9mIEVDTUFTY3JpcHRQYXJzZXIuQXJyYXlMaXRlcmFsRXhwcmVzc2lvbkNvbnRleHQpe1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmlzaXRBcnJheUxpdGVyYWxFeHByZXNzaW9uKG5vZGUpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMudGhyb3dJbnNhbmNlRXJyb3IodGhpcy5kdW1wQ29udGV4dChub2RlKSlcbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNlbXB0eVN0YXRlbWVudC5cbiAgICB2aXNpdEVtcHR5U3RhdGVtZW50KGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS5pbmZvKFwidmlzaXRFbXB0eVN0YXRlbWVudCBbJXNdIDogJXNcIiwgY3R4LmdldENoaWxkQ291bnQoKSwgY3R4LmdldFRleHQoKSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRSdWxlVHlwZShub2RlOiBhbnksIGluZGV4OiBudW1iZXIpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gbm9kZS5nZXRDaGlsZChpbmRleCkucnVsZUluZGV4O1xuICAgIH1cblxuICAgIHByaXZhdGUgYXNzZXJ0Tm9kZUNvdW50KGN0eDogUnVsZUNvbnRleHQsIGNvdW50OiBudW1iZXIpIHtcbiAgICAgICAgaWYgKGN0eC5nZXRDaGlsZENvdW50KCkgIT0gY291bnQpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIldyb25nIGNoaWxkIGNvdW50LCBleHBlY3RlZCAnXCIgKyBjb3VudCArIFwiJyBnb3QgOiBcIiArIGN0eC5nZXRDaGlsZENvdW50KCkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjZXhwcmVzc2lvblN0YXRlbWVudC5cbiAgICB2aXNpdEV4cHJlc3Npb25TdGF0ZW1lbnQoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJ2aXNpdEV4cHJlc3Npb25TdGF0ZW1lbnQ6IFwiICsgY3R4LmdldFRleHQoKSk7XG4gICAgICAgIHRoaXMuYXNzZXJ0VHlwZShjdHgsIEVDTUFTY3JpcHRQYXJzZXIuRXhwcmVzc2lvblN0YXRlbWVudENvbnRleHQpXG4gICAgICAgIHRoaXMuYXNzZXJ0Tm9kZUNvdW50KGN0eCwgMSk7XG4gICAgICAgIC8vIHZpc2l0RXhwcmVzc2lvblN0YXRlbWVudDo+dmlzaXRFeHByZXNzaW9uU2VxdWVuY2VcbiAgICAgICAgY29uc3Qgbm9kZTogUnVsZUNvbnRleHQgPSBjdHguZ2V0Q2hpbGQoMCk7IC8vIHZpc2l0RXhwcmVzc2lvblNlcXVlbmNlIFxuICAgICAgICBsZXQgZXhwXG4gICAgICAgIGlmIChub2RlIGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5FeHByZXNzaW9uU2VxdWVuY2VDb250ZXh0KSB7XG4gICAgICAgICAgICBleHAgPSB0aGlzLnZpc2l0RXhwcmVzc2lvblNlcXVlbmNlKG5vZGUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy50aHJvd0luc2FuY2VFcnJvcih0aGlzLmR1bXBDb250ZXh0KG5vZGUpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBleHAgLy90aGlzLmRlY29yYXRlKGV4cCwgdGhpcy5hc01hcmtlcih0aGlzLmFzTWV0YWRhdGEoY3R4LmdldFNvdXJjZUludGVydmFsKCkpKSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc01ldGFkYXRhKGludGVydmFsOiBJbnRlcnZhbCk6IGFueSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBzdGFydDoge1xuICAgICAgICAgICAgICAgIGxpbmU6IDEsXG4gICAgICAgICAgICAgICAgY29sdW1uOiBpbnRlcnZhbC5zdGFydCxcbiAgICAgICAgICAgICAgICBvZmZzZXQ6IDBcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBlbmQ6IHtcbiAgICAgICAgICAgICAgICBsaW5lOiAxLFxuICAgICAgICAgICAgICAgIGNvbHVtbjogaW50ZXJ2YWwuc3RvcCxcbiAgICAgICAgICAgICAgICBvZmZzZXQ6IDNcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2lmU3RhdGVtZW50LlxuICAgIHZpc2l0SWZTdGF0ZW1lbnQoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJ2aXNpdElmU3RhdGVtZW50OiBcIiArIGN0eC5nZXRUZXh0KCkpO1xuXG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNEb1N0YXRlbWVudC5cbiAgICB2aXNpdERvU3RhdGVtZW50KGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS5pbmZvKFwidmlzaXREb1N0YXRlbWVudDogXCIgKyBjdHguZ2V0VGV4dCgpKTtcblxuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjV2hpbGVTdGF0ZW1lbnQuXG4gICAgdmlzaXRXaGlsZVN0YXRlbWVudChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0V2hpbGVTdGF0ZW1lbnQ6IFwiICsgY3R4LmdldFRleHQoKSk7XG5cbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI0ZvclN0YXRlbWVudC5cbiAgICB2aXNpdEZvclN0YXRlbWVudChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0V2hpbGVTdGF0ZW1lbnQ6IFwiICsgY3R4LmdldFRleHQoKSk7XG5cbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI0ZvclZhclN0YXRlbWVudC5cbiAgICB2aXNpdEZvclZhclN0YXRlbWVudChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG5cbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI0ZvckluU3RhdGVtZW50LlxuICAgIHZpc2l0Rm9ySW5TdGF0ZW1lbnQoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuXG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNGb3JWYXJJblN0YXRlbWVudC5cbiAgICB2aXNpdEZvclZhckluU3RhdGVtZW50KGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcblxuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjY29udGludWVTdGF0ZW1lbnQuXG4gICAgdmlzaXRDb250aW51ZVN0YXRlbWVudChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG5cbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2JyZWFrU3RhdGVtZW50LlxuICAgIHZpc2l0QnJlYWtTdGF0ZW1lbnQoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuXG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNyZXR1cm5TdGF0ZW1lbnQuXG4gICAgdmlzaXRSZXR1cm5TdGF0ZW1lbnQoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuXG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciN3aXRoU3RhdGVtZW50LlxuICAgIHZpc2l0V2l0aFN0YXRlbWVudChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG5cbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI3N3aXRjaFN0YXRlbWVudC5cbiAgICB2aXNpdFN3aXRjaFN0YXRlbWVudChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG5cbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2Nhc2VCbG9jay5cbiAgICB2aXNpdENhc2VCbG9jayhjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG5cbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2Nhc2VDbGF1c2VzLlxuICAgIHZpc2l0Q2FzZUNsYXVzZXMoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuXG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNjYXNlQ2xhdXNlLlxuICAgIHZpc2l0Q2FzZUNsYXVzZShjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG5cbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2RlZmF1bHRDbGF1c2UuXG4gICAgdmlzaXREZWZhdWx0Q2xhdXNlKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcblxuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjbGFiZWxsZWRTdGF0ZW1lbnQuXG4gICAgdmlzaXRMYWJlbGxlZFN0YXRlbWVudChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG5cbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI3Rocm93U3RhdGVtZW50LlxuICAgIHZpc2l0VGhyb3dTdGF0ZW1lbnQoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuXG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciN0cnlTdGF0ZW1lbnQuXG4gICAgdmlzaXRUcnlTdGF0ZW1lbnQoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuXG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNjYXRjaFByb2R1Y3Rpb24uXG4gICAgdmlzaXRDYXRjaFByb2R1Y3Rpb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuXG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNmaW5hbGx5UHJvZHVjdGlvbi5cbiAgICB2aXNpdEZpbmFsbHlQcm9kdWN0aW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcblxuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjZGVidWdnZXJTdGF0ZW1lbnQuXG4gICAgdmlzaXREZWJ1Z2dlclN0YXRlbWVudChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG5cbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2Z1bmN0aW9uRGVjbGFyYXRpb24uXG4gICAgdmlzaXRGdW5jdGlvbkRlY2xhcmF0aW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcblxuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjZm9ybWFsUGFyYW1ldGVyTGlzdC5cbiAgICB2aXNpdEZvcm1hbFBhcmFtZXRlckxpc3QoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjZnVuY3Rpb25Cb2R5LlxuICAgIHZpc2l0RnVuY3Rpb25Cb2R5KGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS5pbmZvKFwidmlzaXRGdW5jdGlvbkJvZHk6IFwiICsgY3R4LmdldFRleHQoKSk7XG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNhcnJheUxpdGVyYWwuXG4gICAgdmlzaXRBcnJheUxpdGVyYWwoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJ2aXNpdEFycmF5TGl0ZXJhbCBbJXNdIDogJXNcIiwgY3R4LmdldENoaWxkQ291bnQoKSwgY3R4LmdldFRleHQoKSk7XG4gICAgICAgIHRoaXMuYXNzZXJ0VHlwZShjdHgsIEVDTUFTY3JpcHRQYXJzZXIuQXJyYXlMaXRlcmFsQ29udGV4dClcbiAgICAgICAgLy8gd2UganVzdCBnb3QgYFtdYFxuICAgICAgICBpZiAoY3R4LmdldENoaWxkQ291bnQoKSA9PSAyKSB7XG4gICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgcmVzdWx0cyA9IFtdXG4gICAgICAgIC8vIHNraXAgYFsgYW5kICBdYCBcbiAgICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPCBjdHguZ2V0Q2hpbGRDb3VudCgpIC0gMTsgKytpKSB7XG4gICAgICAgICAgICBjb25zdCBub2RlID0gY3R4LmdldENoaWxkKGkpO1xuICAgICAgICAgICAgbGV0IGV4cCA9IFtdO1xuICAgICAgICAgICAgaWYgKG5vZGUgaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLkVsZW1lbnRMaXN0Q29udGV4dCkge1xuICAgICAgICAgICAgICAgIGV4cCA9IHRoaXMudmlzaXRFbGVtZW50TGlzdChub2RlKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAobm9kZSBpbnN0YW5jZW9mIEVDTUFTY3JpcHRQYXJzZXIuRWxpc2lvbkNvbnRleHQpIHtcbiAgICAgICAgICAgICAgICBleHAgPSB0aGlzLnZpc2l0RWxpc2lvbihub2RlKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gc3BlY2lhbCBjYXNlIGZvciBoYW5kbGluZyBlbGlzaW9uIHZhbHVlcyBsaWtlIDogIFsxMSwsLDExXSBdICBbLCxdXG4gICAgICAgICAgICAgICAgaWYgKG5vZGUuc3ltYm9sICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICBleHAgPSBbbnVsbF1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudGhyb3dJbnNhbmNlRXJyb3IodGhpcy5kdW1wQ29udGV4dChub2RlKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmVzdWx0cyA9IFsuLi5yZXN1bHRzLCAuLi5leHBdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHRzO1xuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2VsZW1lbnRMaXN0LlxuICAgIHZpc2l0RWxlbWVudExpc3QoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJ2aXNpdEVsZW1lbnRMaXN0IFslc10gOiAlc1wiLCBjdHguZ2V0Q2hpbGRDb3VudCgpLCBjdHguZ2V0VGV4dCgpKTtcbiAgICAgICAgdGhpcy5hc3NlcnRUeXBlKGN0eCwgRUNNQVNjcmlwdFBhcnNlci5FbGVtZW50TGlzdENvbnRleHQpXG4gICAgICAgIGNvbnN0IGVsZW1lbnRzID0gW107XG4gICAgICAgIGNvbnN0IG5vZGVzOiBSdWxlQ29udGV4dFtdID0gdGhpcy5maWx0ZXJTeW1ib2xzKGN0eCk7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgIGNvbnN0IGVsZW0gPSB0aGlzLnNpbmdsZUV4cHJlc3Npb24obm9kZXNbaV0pO1xuICAgICAgICAgICAgZWxlbWVudHMucHVzaChlbGVtKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZWxlbWVudHM7XG4gICAgfVxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjZWxpc2lvbi5cbiAgICB2aXNpdEVsaXNpb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJ2aXNpdEVsaXNpb24gWyVzXSA6ICVzXCIsIGN0eC5nZXRDaGlsZENvdW50KCksIGN0eC5nZXRUZXh0KCkpO1xuICAgICAgICB0aGlzLmFzc2VydFR5cGUoY3R4LCBFQ01BU2NyaXB0UGFyc2VyLkVsaXNpb25Db250ZXh0KVxuICAgICAgICAvLyBjb21wbGlhbmNlOiBlc3ByaW1hIGNvbXBsaWFuZSBvciByZXR1cm5pbmcgYG51bGxgIFxuICAgICAgICBjb25zdCBlbGlzaW9uID0gW107XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY3R4LmdldENoaWxkQ291bnQoKTsgKytpKSB7XG4gICAgICAgICAgICBlbGlzaW9uLnB1c2gobnVsbCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGVsaXNpb247XG4gICAgfVxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjb2JqZWN0TGl0ZXJhbC5cbiAgICB2aXNpdE9iamVjdExpdGVyYWwoY3R4OiBSdWxlQ29udGV4dCk6IE9iamVjdEV4cHJlc3Npb25Qcm9wZXJ0eVtdIHtcbiAgICAgICAgY29uc29sZS5pbmZvKFwidmlzaXRPYmplY3RMaXRlcmFsIFslc10gOiAlc1wiLCBjdHguZ2V0Q2hpbGRDb3VudCgpLCBjdHguZ2V0VGV4dCgpKTtcbiAgICAgICAgdGhpcy5hc3NlcnRUeXBlKGN0eCwgRUNNQVNjcmlwdFBhcnNlci5PYmplY3RMaXRlcmFsQ29udGV4dCk7XG4gICAgICAgIGNvbnN0IG5vZGU6UnVsZUNvbnRleHQgPSBjdHguZ2V0Q2hpbGQoMSk7XG4gICAgICAgIGlmIChub2RlIGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5Qcm9wZXJ0eU5hbWVBbmRWYWx1ZUxpc3RDb250ZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy52aXNpdFByb3BlcnR5TmFtZUFuZFZhbHVlTGlzdChub2RlKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gW107XG4gICAgfVxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjcHJvcGVydHlOYW1lQW5kVmFsdWVMaXN0LlxuICAgIHZpc2l0UHJvcGVydHlOYW1lQW5kVmFsdWVMaXN0KGN0eDogUnVsZUNvbnRleHQpOiBPYmplY3RFeHByZXNzaW9uUHJvcGVydHlbXSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0UHJvcGVydHlOYW1lQW5kVmFsdWVMaXN0IFslc10gOiAlc1wiLCBjdHguZ2V0Q2hpbGRDb3VudCgpLCBjdHguZ2V0VGV4dCgpKTtcbiAgICAgICAgdGhpcy5hc3NlcnRUeXBlKGN0eCwgRUNNQVNjcmlwdFBhcnNlci5Qcm9wZXJ0eU5hbWVBbmRWYWx1ZUxpc3RDb250ZXh0KTtcbiAgICAgICAgY29uc3QgcHJvcGVydGllczogT2JqZWN0RXhwcmVzc2lvblByb3BlcnR5W10gPSBbXTtcbiAgICAgICAgY29uc3Qgbm9kZXM6IFJ1bGVDb250ZXh0W10gPSB0aGlzLmZpbHRlclN5bWJvbHMoY3R4KTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgY29uc3Qgbm9kZSA9IG5vZGVzW2ldO1xuICAgICAgICAgICAgaWYgKG5vZGUgaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLlByb3BlcnR5RXhwcmVzc2lvbkFzc2lnbm1lbnRDb250ZXh0KSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcHJvcGVydHk6IE9iamVjdEV4cHJlc3Npb25Qcm9wZXJ0eSA9IHRoaXMudmlzaXRQcm9wZXJ0eUV4cHJlc3Npb25Bc3NpZ25tZW50KG5vZGUpO1xuICAgICAgICAgICAgICAgIHByb3BlcnRpZXMucHVzaChwcm9wZXJ0eSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMudGhyb3dJbnNhbmNlRXJyb3IodGhpcy5kdW1wQ29udGV4dChub2RlKSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcHJvcGVydGllcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBGaWx0ZXIgb3V0IFRlcm1pbmFsTm9kZXMgKGNvbW1hcywgcGlwZXMsIGJyYWNrZXRzKVxuICAgICAqIEBwYXJhbSBjdHggXG4gICAgICovXG4gICAgcHJpdmF0ZSBmaWx0ZXJTeW1ib2xzKGN0eDogUnVsZUNvbnRleHQpOiBSdWxlQ29udGV4dFtdIHtcbiAgICAgICAgY29uc3QgZmlsdGVyZWQ6IFJ1bGVDb250ZXh0W10gPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjdHguZ2V0Q2hpbGRDb3VudCgpOyArK2kpIHtcbiAgICAgICAgICAgIGNvbnN0IG5vZGUgPSBjdHguZ2V0Q2hpbGQoaSk7XG4gICAgICAgICAgICAvLyB0aGVyZSBtaWdodCBiZSBhIGJldHRlciB3YXlcbiAgICAgICAgICAgIGlmIChub2RlLnN5bWJvbCAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZpbHRlcmVkLnB1c2gobm9kZSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZpbHRlcmVkO1xuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI1Byb3BlcnR5RXhwcmVzc2lvbkFzc2lnbm1lbnQuXG4gICAgdmlzaXRQcm9wZXJ0eUV4cHJlc3Npb25Bc3NpZ25tZW50KGN0eDogUnVsZUNvbnRleHQpOiBPYmplY3RFeHByZXNzaW9uUHJvcGVydHkge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJ2aXNpdFByb3BlcnR5RXhwcmVzc2lvbkFzc2lnbm1lbnQgWyVzXSA6ICVzXCIsIGN0eC5nZXRDaGlsZENvdW50KCksIGN0eC5nZXRUZXh0KCkpO1xuICAgICAgICB0aGlzLmFzc2VydFR5cGUoY3R4LCBFQ01BU2NyaXB0UGFyc2VyLlByb3BlcnR5RXhwcmVzc2lvbkFzc2lnbm1lbnRDb250ZXh0KTtcbiAgICAgICAgdGhpcy5hc3NlcnROb2RlQ291bnQoY3R4LCAzKTtcbiAgICAgICAgbGV0IG4wID0gY3R4LmdldENoaWxkKDApOyAvLyBQcm9wZXJ0eU5hbWVcbiAgICAgICAgbGV0IG4xID0gY3R4LmdldENoaWxkKDEpOyAvLyBzeW1ib2wgOlxuICAgICAgICBsZXQgbjIgPSBjdHguZ2V0Q2hpbGQoMik7IC8vICBzaW5nbGVFeHByZXNzaW9uIFxuICAgICAgICBjb25zdCBrZXk6IFByb3BlcnR5S2V5ID0gdGhpcy52aXNpdFByb3BlcnR5TmFtZShuMCk7XG4gICAgICAgIGNvbnN0IHZhbHVlID0gdGhpcy5zaW5nbGVFeHByZXNzaW9uKG4yKTtcbiAgICAgICAgY29uc3QgY29tcHV0ZWQgPSBmYWxzZTtcbiAgICAgICAgY29uc3QgbWV0aG9kID0gZmFsc2U7XG4gICAgICAgIGNvbnN0IHNob3J0aGFuZCA9IGZhbHNlO1xuXG4gICAgICAgIHJldHVybiBuZXcgUHJvcGVydHkoXCJpbml0XCIsIGtleSwgY29tcHV0ZWQsIHZhbHVlLCBtZXRob2QsIHNob3J0aGFuZCk7XG4gICAgfVxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjUHJvcGVydHlHZXR0ZXIuXG4gICAgdmlzaXRQcm9wZXJ0eUdldHRlcihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG5cbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI1Byb3BlcnR5U2V0dGVyLlxuICAgIHZpc2l0UHJvcGVydHlTZXR0ZXIoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuXG4gICAgfVxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjcHJvcGVydHlOYW1lLlxuICAgIHZpc2l0UHJvcGVydHlOYW1lKGN0eDogUnVsZUNvbnRleHQpOiBQcm9wZXJ0eUtleSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0UHJvcGVydHlOYW1lIFslc10gOiAlc1wiLCBjdHguZ2V0Q2hpbGRDb3VudCgpLCBjdHguZ2V0VGV4dCgpKTtcbiAgICAgICAgdGhpcy5hc3NlcnRUeXBlKGN0eCwgRUNNQVNjcmlwdFBhcnNlci5Qcm9wZXJ0eU5hbWVDb250ZXh0KTtcbiAgICAgICAgdGhpcy5hc3NlcnROb2RlQ291bnQoY3R4LCAxKTtcbiAgICAgICAgY29uc3Qgbm9kZSA9IGN0eC5nZXRDaGlsZCgwKTtcbiAgICAgICAgY29uc3QgY291bnQgPSBub2RlLmdldENoaWxkQ291bnQoKTtcbiAgICAgICAgaWYgKGNvdW50ID09IDApIHsgLy8gbGl0ZXJhbFxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY3JlYXRlTGl0ZXJhbFZhbHVlKG5vZGUpO1xuICAgICAgICB9IGVsc2UgaWYgKGNvdW50ID09IDEpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnZpc2l0SWRlbnRpZmllck5hbWUobm9kZSlcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnRocm93SW5zYW5jZUVycm9yKHRoaXMuZHVtcENvbnRleHQobm9kZSkpO1xuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI3Byb3BlcnR5U2V0UGFyYW1ldGVyTGlzdC5cbiAgICB2aXNpdFByb3BlcnR5U2V0UGFyYW1ldGVyTGlzdChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG5cbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNhcmd1bWVudHMuXG4gICAgdmlzaXRBcmd1bWVudHMoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJ2aXNpdEFyZ3VtZW50czogXCIgKyBjdHguZ2V0VGV4dCgpKTtcblxuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2FyZ3VtZW50TGlzdC5cbiAgICB2aXNpdEFyZ3VtZW50TGlzdChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0QXJndW1lbnRMaXN0OiBcIiArIGN0eC5nZXRUZXh0KCkpO1xuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2V4cHJlc3Npb25TZXF1ZW5jZS5cbiAgICB2aXNpdEV4cHJlc3Npb25TZXF1ZW5jZShjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0RXhwcmVzc2lvblNlcXVlbmNlIFslc10gOiBbJXNdXCIsIGN0eC5nZXRDaGlsZENvdW50KCksIGN0eC5nZXRUZXh0KCkpO1xuICAgICAgICB0aGlzLmFzc2VydFR5cGUoY3R4LCBFQ01BU2NyaXB0UGFyc2VyLkV4cHJlc3Npb25TZXF1ZW5jZUNvbnRleHQpO1xuICAgICAgICBjb25zdCBleHByZXNzaW9ucyA9IFtdO1xuICAgICAgICAvLyBlYWNoIG5vZGUgaXMgYSBzaW5nbGVFeHByZXNzaW9uXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY3R4LmdldENoaWxkQ291bnQoKTsgKytpKSB7XG4gICAgICAgICAgICBjb25zdCBub2RlOiBSdWxlQ29udGV4dCA9IGN0eC5nZXRDaGlsZChpKTtcbiAgICAgICAgICAgIGNvbnN0IGV4cCA9IHRoaXMuc2luZ2xlRXhwcmVzc2lvbihub2RlKTtcbiAgICAgICAgICAgIGV4cHJlc3Npb25zLnB1c2goZXhwKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBjb21wbGlhbmNlOiBlc3Bpcm1hLCBlc3ByZWVcbiAgICAgICAgLy8gdGhpcyBjaGVjayB0byBzZWUgaWYgdGhlcmUgYXJlIG11bHRpcGxlIGV4cHJlc3Npb25zIGlmIHNvIHRoZW4gd2UgbGVhdmUgdGhlbSBhcyBTZXF1ZW5jZUV4cHJlc3Npb24gXG4gICAgICAgIC8vIG90aGVyd2lzZSB3ZSB3aWxsIHJvbGwgdGhlbSB1cCBpbnRvIEV4cHJlc3Npb25TdGF0ZW1lbnQgd2l0aCBvbmUgZXhwcmVzc2lvblxuICAgICAgICAvLyBgMWAgPSBFeHByZXNzaW9uU3RhdGVtZW50IC0+IExpdGVyYWxcbiAgICAgICAgLy8gYDEsIDJgID0gRXhwcmVzc2lvblN0YXRlbWVudCAtPiBTZXF1ZW5jZUV4cHJlc3Npb24gLT4gTGl0ZXJhbCwgTGl0ZXJhbFxuICAgICAgICBsZXQgZXhwO1xuICAgICAgICBpZiAoZXhwcmVzc2lvbnMubGVuZ3RoID09IDEpIHtcbiAgICAgICAgICAgIGV4cCA9IG5ldyBFeHByZXNzaW9uU3RhdGVtZW50KGV4cHJlc3Npb25zWzBdKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZXhwID0gbmV3IFNlcXVlbmNlRXhwcmVzc2lvbihleHByZXNzaW9ucyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuZGVjb3JhdGUoZXhwLCB0aGlzLmFzTWFya2VyKHRoaXMuYXNNZXRhZGF0YShjdHguZ2V0U291cmNlSW50ZXJ2YWwoKSkpKVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEV2YWx1YXRlIGEgc2luZ2xlRXhwcmVzc2lvblxuICAgICAqIEBwYXJhbSBub2RlIFxuICAgICAqL1xuICAgIHNpbmdsZUV4cHJlc3Npb24obm9kZTogUnVsZUNvbnRleHQpOiBhbnkge1xuICAgICAgICBpZiAobm9kZSBpbnN0YW5jZW9mIEVDTUFTY3JpcHRQYXJzZXIuTGl0ZXJhbEV4cHJlc3Npb25Db250ZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy52aXNpdExpdGVyYWxFeHByZXNzaW9uKG5vZGUpO1xuICAgICAgICB9IGVsc2UgaWYgKG5vZGUgaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLk9iamVjdExpdGVyYWxFeHByZXNzaW9uQ29udGV4dCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmlzaXRPYmplY3RMaXRlcmFsRXhwcmVzc2lvbihub2RlKTtcbiAgICAgICAgfSBlbHNlIGlmIChub2RlIGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5Bc3NpZ25tZW50RXhwcmVzc2lvbkNvbnRleHQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnZpc2l0QXNzaWdubWVudEV4cHJlc3Npb24obm9kZSk7XG4gICAgICAgIH0gZWxzZSBpZiAobm9kZSBpbnN0YW5jZW9mIEVDTUFTY3JpcHRQYXJzZXIuQWRkaXRpdmVFeHByZXNzaW9uQ29udGV4dCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmlzaXRBZGRpdGl2ZUV4cHJlc3Npb24obm9kZSk7XG4gICAgICAgIH0gZWxzZSBpZiAobm9kZSBpbnN0YW5jZW9mIEVDTUFTY3JpcHRQYXJzZXIuTXVsdGlwbGljYXRpdmVFeHByZXNzaW9uQ29udGV4dCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmlzaXRNdWx0aXBsaWNhdGl2ZUV4cHJlc3Npb24obm9kZSk7XG4gICAgICAgIH0gZWxzZSBpZiAobm9kZSBpbnN0YW5jZW9mIEVDTUFTY3JpcHRQYXJzZXIuQXJyYXlMaXRlcmFsRXhwcmVzc2lvbkNvbnRleHQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnZpc2l0QXJyYXlMaXRlcmFsRXhwcmVzc2lvbihub2RlKTtcbiAgICAgICAgfSBcbiAgICAgICAgdGhpcy50aHJvd0luc2FuY2VFcnJvcih0aGlzLmR1bXBDb250ZXh0KG5vZGUpKTtcbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNUZXJuYXJ5RXhwcmVzc2lvbi5cbiAgICB2aXNpdFRlcm5hcnlFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI0xvZ2ljYWxBbmRFeHByZXNzaW9uLlxuICAgIHZpc2l0TG9naWNhbEFuZEV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuXG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNQcmVJbmNyZW1lbnRFeHByZXNzaW9uLlxuICAgIHZpc2l0UHJlSW5jcmVtZW50RXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG5cbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNPYmplY3RMaXRlcmFsRXhwcmVzc2lvbi5cbiAgICB2aXNpdE9iamVjdExpdGVyYWxFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpOiBPYmplY3RFeHByZXNzaW9uIHtcbiAgICAgICAgY29uc29sZS5pbmZvKFwidmlzaXRPYmplY3RMaXRlcmFsRXhwcmVzc2lvbiBbJXNdIDogJXNcIiwgY3R4LmdldENoaWxkQ291bnQoKSwgY3R4LmdldFRleHQoKSk7XG4gICAgICAgIHRoaXMuYXNzZXJ0VHlwZShjdHgsIEVDTUFTY3JpcHRQYXJzZXIuT2JqZWN0TGl0ZXJhbEV4cHJlc3Npb25Db250ZXh0KTtcbiAgICAgICAgY29uc3Qgbm9kZSA9IGN0eC5nZXRDaGlsZCgwKTtcbiAgICAgICAgY29uc3QgcHJvcGVydGllczogT2JqZWN0RXhwcmVzc2lvblByb3BlcnR5W10gPSB0aGlzLnZpc2l0T2JqZWN0TGl0ZXJhbChub2RlKTtcbiAgICAgICAgcmV0dXJuIG5ldyBPYmplY3RFeHByZXNzaW9uKHByb3BlcnRpZXMpO1xuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjSW5FeHByZXNzaW9uLlxuICAgIHZpc2l0SW5FeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcblxuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjTG9naWNhbE9yRXhwcmVzc2lvbi5cbiAgICB2aXNpdExvZ2ljYWxPckV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuXG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNOb3RFeHByZXNzaW9uLlxuICAgIHZpc2l0Tm90RXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG5cbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI1ByZURlY3JlYXNlRXhwcmVzc2lvbi5cbiAgICB2aXNpdFByZURlY3JlYXNlRXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG5cbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI0FyZ3VtZW50c0V4cHJlc3Npb24uXG4gICAgdmlzaXRBcmd1bWVudHNFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS5pbmZvKFwidmlzaXRBcmd1bWVudHNFeHByZXNzaW9uOiBcIiArIGN0eC5nZXRUZXh0KCkpO1xuXG5cbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI1RoaXNFeHByZXNzaW9uLlxuICAgIHZpc2l0VGhpc0V4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuXG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNGdW5jdGlvbkV4cHJlc3Npb24uXG4gICAgdmlzaXRGdW5jdGlvbkV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuXG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNVbmFyeU1pbnVzRXhwcmVzc2lvbi5cbiAgICB2aXNpdFVuYXJ5TWludXNFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcblxuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjUG9zdERlY3JlYXNlRXhwcmVzc2lvbi5cbiAgICB2aXNpdFBvc3REZWNyZWFzZUV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuXG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNBc3NpZ25tZW50RXhwcmVzc2lvbi5cbiAgICB2aXNpdEFzc2lnbm1lbnRFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS5pbmZvKFwidmlzaXRBc3NpZ25tZW50RXhwcmVzc2lvbiBbJXNdIDogWyVzXVwiLCBjdHguZ2V0Q2hpbGRDb3VudCgpLCBjdHguZ2V0VGV4dCgpKTtcbiAgICAgICAgdGhpcy5hc3NlcnRUeXBlKGN0eCwgRUNNQVNjcmlwdFBhcnNlci5Bc3NpZ25tZW50RXhwcmVzc2lvbkNvbnRleHQpO1xuICAgICAgICB0aGlzLmFzc2VydE5vZGVDb3VudChjdHgsIDMpXG5cbiAgICAgICAgbGV0IGluaXRpYWxpc2VyID0gY3R4LmdldENoaWxkKDApOyAvLyBJZGVudGlmaWVyRXhwcmVzc2lvbkNvbnRleHRcbiAgICAgICAgbGV0IG9wZXJhdG9yID0gY3R4LmdldENoaWxkKDEpLmdldFRleHQoKTsgLy8gTm8gdHlwZSAoID0gKVxuICAgICAgICBsZXQgZXhwcmVzc2lvbiA9IGN0eC5nZXRDaGlsZCgyKTsgIC8vRXhwcmVzc2lvblNlcXVlbmNlQ29udGV4dFxuXG4gICAgICAgIGxldCBsaHMgPSB0aGlzLnZpc2l0SWRlbnRpZmllckV4cHJlc3Npb24oaW5pdGlhbGlzZXIpO1xuICAgICAgICBsZXQgcmhzID0gdGhpcy52aXNpdEV4cHJlc3Npb25TZXF1ZW5jZShleHByZXNzaW9uKTtcbiAgICAgICAgLy8gQ29tcGxpYW5jZSA6IHB1bGxpbmcgdXAgRXhwcmVzc2lvblN0YXRlbWVudCBpbnRvIEFzc2lnZW1lbnRFeHByZXNzaW9uXG4gICAgICAgIGxldCBub2RlID0gbmV3IEFzc2lnbm1lbnRFeHByZXNzaW9uKG9wZXJhdG9yLCBsaHMsIHJocy5leHByZXNzaW9uKVxuICAgICAgICByZXR1cm4gbm9kZTtcbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI1R5cGVvZkV4cHJlc3Npb24uXG4gICAgdmlzaXRUeXBlb2ZFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcblxuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjSW5zdGFuY2VvZkV4cHJlc3Npb24uXG4gICAgdmlzaXRJbnN0YW5jZW9mRXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG5cbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI1VuYXJ5UGx1c0V4cHJlc3Npb24uXG4gICAgdmlzaXRVbmFyeVBsdXNFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcblxuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjRGVsZXRlRXhwcmVzc2lvbi5cbiAgICB2aXNpdERlbGV0ZUV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuXG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNFcXVhbGl0eUV4cHJlc3Npb24uXG4gICAgdmlzaXRFcXVhbGl0eUV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuXG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNCaXRYT3JFeHByZXNzaW9uLlxuICAgIHZpc2l0Qml0WE9yRXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG5cbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI011bHRpcGxpY2F0aXZlRXhwcmVzc2lvbi5cbiAgICB2aXNpdE11bHRpcGxpY2F0aXZlRXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0TXVsdGlwbGljYXRpdmVFeHByZXNzaW9uIFslc10gOiAlc1wiLCBjdHguZ2V0Q2hpbGRDb3VudCgpLCBjdHguZ2V0VGV4dCgpKTtcbiAgICAgICAgdGhpcy5hc3NlcnRUeXBlKGN0eCwgRUNNQVNjcmlwdFBhcnNlci5NdWx0aXBsaWNhdGl2ZUV4cHJlc3Npb25Db250ZXh0KTtcbiAgICAgICAgdGhpcy5hc3NlcnROb2RlQ291bnQoY3R4LCAzKVxuXG4gICAgICAgIGxldCBsZWZ0ID0gY3R4LmdldENoaWxkKDApO1xuICAgICAgICBsZXQgb3BlcmF0b3IgPSBjdHguZ2V0Q2hpbGQoMSkuZ2V0VGV4dCgpOyAvLyBObyB0eXBlICggKywtIClcbiAgICAgICAgbGV0IHJpZ2h0ID0gY3R4LmdldENoaWxkKDIpO1xuICAgICAgICBsZXQgbGhzID0gdGhpcy52aXNpdEJpbmFyeUV4cHJlc3Npb24obGVmdCk7XG4gICAgICAgIGxldCByaHMgPSB0aGlzLnZpc2l0QmluYXJ5RXhwcmVzc2lvbihyaWdodCk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuZGVjb3JhdGUobmV3IEJpbmFyeUV4cHJlc3Npb24ob3BlcmF0b3IsIGxocywgcmhzKSwge30pO1xuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI0JpdFNoaWZ0RXhwcmVzc2lvbi5cbiAgICB2aXNpdEJpdFNoaWZ0RXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG5cbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNQYXJlbnRoZXNpemVkRXhwcmVzc2lvbi5cbiAgICB2aXNpdFBhcmVudGhlc2l6ZWRFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS5pbmZvKFwidmlzaXRQYXJlbnRoZXNpemVkRXhwcmVzc2lvbjogXCIgKyBjdHguZ2V0VGV4dCgpKTtcbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNBZGRpdGl2ZUV4cHJlc3Npb24uXG4gICAgdmlzaXRBZGRpdGl2ZUV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJ2aXNpdEFkZGl0aXZlRXhwcmVzc2lvbiBbJXNdIDogJXNcIiwgY3R4LmdldENoaWxkQ291bnQoKSwgY3R4LmdldFRleHQoKSk7XG4gICAgICAgIHRoaXMuYXNzZXJ0VHlwZShjdHgsIEVDTUFTY3JpcHRQYXJzZXIuQWRkaXRpdmVFeHByZXNzaW9uQ29udGV4dCk7XG4gICAgICAgIHRoaXMuYXNzZXJ0Tm9kZUNvdW50KGN0eCwgMylcblxuICAgICAgICBsZXQgbGVmdCA9IGN0eC5nZXRDaGlsZCgwKTtcbiAgICAgICAgbGV0IG9wZXJhdG9yID0gY3R4LmdldENoaWxkKDEpLmdldFRleHQoKTsgLy8gTm8gdHlwZSAoICssLSApXG4gICAgICAgIGxldCByaWdodCA9IGN0eC5nZXRDaGlsZCgyKTtcbiAgICAgICAgbGV0IGxocyA9IHRoaXMuX3Zpc2l0QmluYXJ5RXhwcmVzc2lvbihsZWZ0KTtcbiAgICAgICAgbGV0IHJocyA9IHRoaXMuX3Zpc2l0QmluYXJ5RXhwcmVzc2lvbihyaWdodCk7XG4gICAgICAgIC8vIHJldHVybiB0aGlzLmRlY29yYXRlKG5ldyBCaW5hcnlFeHByZXNzaW9uKG9wZXJhdG9yLCBsaHMgLHJocyksIHRoaXMuYXNNYXJrZXIodGhpcy5hc01ldGFkYXRhKGN0eC5zeW1ib2wpKSk7XG4gICAgICAgIHJldHVybiBuZXcgQmluYXJ5RXhwcmVzc2lvbihvcGVyYXRvciwgbGhzLCByaHMpO1xuICAgIH1cblxuICAgIF92aXNpdEJpbmFyeUV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJldmFsQmluYXJ5RXhwcmVzc2lvbiBbJXNdIDogJXNcIiwgY3R4LmdldENoaWxkQ291bnQoKSwgY3R4LmdldFRleHQoKSk7XG4gICAgICAgIGlmIChjdHggaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLklkZW50aWZpZXJFeHByZXNzaW9uQ29udGV4dCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmlzaXRJZGVudGlmaWVyRXhwcmVzc2lvbihjdHgpO1xuICAgICAgICB9IGVsc2UgaWYgKGN0eCBpbnN0YW5jZW9mIEVDTUFTY3JpcHRQYXJzZXIuTGl0ZXJhbEV4cHJlc3Npb25Db250ZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy52aXNpdExpdGVyYWxFeHByZXNzaW9uKGN0eCk7XG4gICAgICAgIH0gZWxzZSBpZiAoY3R4IGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5BZGRpdGl2ZUV4cHJlc3Npb25Db250ZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy52aXNpdEFkZGl0aXZlRXhwcmVzc2lvbihjdHgpO1xuICAgICAgICB9IGVsc2UgaWYgKGN0eCBpbnN0YW5jZW9mIEVDTUFTY3JpcHRQYXJzZXIuTXVsdGlwbGljYXRpdmVFeHByZXNzaW9uQ29udGV4dCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmlzaXRNdWx0aXBsaWNhdGl2ZUV4cHJlc3Npb24oY3R4KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnRocm93SW5zYW5jZUVycm9yKHRoaXMuZHVtcENvbnRleHQoY3R4KSk7XG4gICAgfVxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjUmVsYXRpb25hbEV4cHJlc3Npb24uXG4gICAgdmlzaXRSZWxhdGlvbmFsRXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gICAgfVxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjUG9zdEluY3JlbWVudEV4cHJlc3Npb24uXG4gICAgdmlzaXRQb3N0SW5jcmVtZW50RXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gICAgfVxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjQml0Tm90RXhwcmVzc2lvbi5cbiAgICB2aXNpdEJpdE5vdEV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuXG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNOZXdFeHByZXNzaW9uLlxuICAgIHZpc2l0TmV3RXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG5cbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI0xpdGVyYWxFeHByZXNzaW9uLlxuICAgIHZpc2l0TGl0ZXJhbEV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJ2aXNpdExpdGVyYWxFeHByZXNzaW9uIFslc10gOiBbJXNdXCIsIGN0eC5nZXRDaGlsZENvdW50KCksIGN0eC5nZXRUZXh0KCkpO1xuICAgICAgICB0aGlzLmFzc2VydFR5cGUoY3R4LCBFQ01BU2NyaXB0UGFyc2VyLkxpdGVyYWxFeHByZXNzaW9uQ29udGV4dCk7XG4gICAgICAgIHRoaXMuYXNzZXJ0Tm9kZUNvdW50KGN0eCwgMSk7XG4gICAgICAgIC8vIHZpc2l0TGl0ZXJhbEV4cHJlc3Npb246ID4gdmlzaXRMaXRlcmFsXG4gICAgICAgIGxldCBub2RlID0gY3R4LmdldENoaWxkKDApXG4gICAgICAgIGlmIChub2RlIGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5MaXRlcmFsQ29udGV4dCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmlzaXRMaXRlcmFsKG5vZGUpO1xuICAgICAgICB9IGVsc2UgaWYgKG5vZGUgaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLk51bWVyaWNMaXRlcmFsQ29udGV4dCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmlzaXROdW1lcmljTGl0ZXJhbChub2RlKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnRocm93SW5zYW5jZUVycm9yKHRoaXMuZHVtcENvbnRleHQobm9kZSkpO1xuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI0FycmF5TGl0ZXJhbEV4cHJlc3Npb24uXG4gICAgdmlzaXRBcnJheUxpdGVyYWxFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpOiBBcnJheUV4cHJlc3Npb24ge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJ2aXNpdEFycmF5TGl0ZXJhbEV4cHJlc3Npb24gWyVzXSA6ICVzXCIsIGN0eC5nZXRDaGlsZENvdW50KCksIGN0eC5nZXRUZXh0KCkpO1xuICAgICAgICB0aGlzLmFzc2VydFR5cGUoY3R4LCBFQ01BU2NyaXB0UGFyc2VyLkFycmF5TGl0ZXJhbEV4cHJlc3Npb25Db250ZXh0KTtcbiAgICAgICAgdGhpcy5hc3NlcnROb2RlQ291bnQoY3R4LCAxKTtcbiAgICAgICAgY29uc3Qgbm9kZSA9IGN0eC5nZXRDaGlsZCgwKTtcbiAgICAgICAgY29uc3QgZWxlbWVudHMgPSB0aGlzLnZpc2l0QXJyYXlMaXRlcmFsKG5vZGUpO1xuICAgICAgICByZXR1cm4gbmV3IEFycmF5RXhwcmVzc2lvbihlbGVtZW50cyk7XG4gICAgfVxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjTWVtYmVyRG90RXhwcmVzc2lvbi5cbiAgICB2aXNpdE1lbWJlckRvdEV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJ2aXNpdE1lbWJlckRvdEV4cHJlc3Npb24gWyVzXSA6ICVzXCIsIGN0eC5nZXRDaGlsZENvdW50KCksIGN0eC5nZXRUZXh0KCkpO1xuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI01lbWJlckluZGV4RXhwcmVzc2lvbi5cbiAgICB2aXNpdE1lbWJlckluZGV4RXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNJZGVudGlmaWVyRXhwcmVzc2lvbi5cbiAgICB2aXNpdElkZW50aWZpZXJFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpOiBJZGVudGlmaWVye1xuICAgICAgICBjb25zb2xlLmluZm8oXCJ2aXNpdElkZW50aWZpZXJFeHByZXNzaW9uIFslc10gOiAlc1wiLCBjdHguZ2V0Q2hpbGRDb3VudCgpLCBjdHguZ2V0VGV4dCgpKTtcbiAgICAgICAgdGhpcy5hc3NlcnRUeXBlKGN0eCwgRUNNQVNjcmlwdFBhcnNlci5JZGVudGlmaWVyRXhwcmVzc2lvbkNvbnRleHQpO1xuICAgICAgICB0aGlzLmFzc2VydE5vZGVDb3VudChjdHgsIDEpXG4gICAgICAgIGNvbnN0IGluaXRpYWxpc2VyID0gY3R4LmdldENoaWxkKDApO1xuICAgICAgICBjb25zdCBuYW1lID0gaW5pdGlhbGlzZXIuZ2V0VGV4dCgpO1xuICAgICAgICByZXR1cm4gdGhpcy5kZWNvcmF0ZShuZXcgSWRlbnRpZmllcihuYW1lKSwgdGhpcy5hc01hcmtlcih0aGlzLmFzTWV0YWRhdGEoaW5pdGlhbGlzZXIuc3ltYm9sKSkpXG4gICAgfVxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjQml0QW5kRXhwcmVzc2lvbi5cbiAgICB2aXNpdEJpdEFuZEV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI0JpdE9yRXhwcmVzc2lvbi5cbiAgICB2aXNpdEJpdE9yRXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNBc3NpZ25tZW50T3BlcmF0b3JFeHByZXNzaW9uLlxuICAgIHZpc2l0QXNzaWdubWVudE9wZXJhdG9yRXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNWb2lkRXhwcmVzc2lvbi5cbiAgICB2aXNpdFZvaWRFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcblxuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2Fzc2lnbm1lbnRPcGVyYXRvci5cbiAgICB2aXNpdEFzc2lnbm1lbnRPcGVyYXRvcihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0QXNzaWdubWVudE9wZXJhdG9yOiBcIiArIGN0eC5nZXRUZXh0KCkpO1xuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2xpdGVyYWwuXG4gICAgdmlzaXRMaXRlcmFsKGN0eDogUnVsZUNvbnRleHQpOiBMaXRlcmFsIHtcbiAgICAgICAgY29uc29sZS5pbmZvKFwidmlzaXRMaXRlcmFsIFslc10gOiBbJXNdXCIsIGN0eC5nZXRDaGlsZENvdW50KCksIGN0eC5nZXRUZXh0KCkpO1xuICAgICAgICB0aGlzLmFzc2VydFR5cGUoY3R4LCBFQ01BU2NyaXB0UGFyc2VyLkxpdGVyYWxDb250ZXh0KVxuICAgICAgICB0aGlzLmFzc2VydE5vZGVDb3VudChjdHgsIDEpO1xuICAgICAgICBjb25zdCBub2RlOiBSdWxlQ29udGV4dCA9IGN0eC5nZXRDaGlsZCgwKTtcbiAgICAgICAgaWYgKG5vZGUuZ2V0Q2hpbGRDb3VudCgpID09IDEpIHtcbiAgICAgICAgICAgIGlmIChub2RlIGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5OdW1lcmljTGl0ZXJhbENvbnRleHQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy52aXNpdE51bWVyaWNMaXRlcmFsKG5vZGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy50aHJvd0luc2FuY2VFcnJvcih0aGlzLmR1bXBDb250ZXh0KG5vZGUpKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChub2RlLmdldENoaWxkQ291bnQoKSA9PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jcmVhdGVMaXRlcmFsVmFsdWUobm9kZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNudW1lcmljTGl0ZXJhbC5cbiAgICB2aXNpdE51bWVyaWNMaXRlcmFsKGN0eDogUnVsZUNvbnRleHQpOiBMaXRlcmFsIHtcbiAgICAgICAgY29uc29sZS5pbmZvKFwidmlzaXROdW1lcmljTGl0ZXJhbCBbJXNdIDogWyVzXVwiLCBjdHguZ2V0Q2hpbGRDb3VudCgpLCBjdHguZ2V0VGV4dCgpKTtcbiAgICAgICAgdGhpcy5hc3NlcnRUeXBlKGN0eCwgRUNNQVNjcmlwdFBhcnNlci5OdW1lcmljTGl0ZXJhbENvbnRleHQpXG4gICAgICAgIHRoaXMuYXNzZXJ0Tm9kZUNvdW50KGN0eCwgMSk7XG4gICAgICAgIGNvbnN0IHZhbHVlID0gY3R4LmdldFRleHQoKTtcbiAgICAgICAgLy8gVE9ETyA6IEZpZ3VyZSBvdXQgYmV0dGVyIHdheVxuICAgICAgICBjb25zdCBsaXRlcmFsID0gbmV3IExpdGVyYWwoTnVtYmVyKHZhbHVlKSwgdmFsdWUpO1xuICAgICAgICByZXR1cm4gdGhpcy5kZWNvcmF0ZShsaXRlcmFsLCB0aGlzLmFzTWFya2VyKHRoaXMuYXNNZXRhZGF0YShjdHguZ2V0U291cmNlSW50ZXJ2YWwoKSkpKVxuICAgIH1cblxuICAgIGNyZWF0ZUxpdGVyYWxWYWx1ZShjdHg6IFJ1bGVDb250ZXh0KTogTGl0ZXJhbCB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcImNyZWF0ZUxpdGVyYWxWYWx1ZSBbJXNdOiBbJXNdXCIsIGN0eC5nZXRDaGlsZENvdW50KCksIGN0eC5nZXRUZXh0KCkpO1xuICAgICAgICBjb25zdCB2YWx1ZSA9IGN0eC5nZXRUZXh0KCk7XG4gICAgICAgIGNvbnN0IGxpdGVyYWwgPSBuZXcgTGl0ZXJhbCh2YWx1ZSwgdmFsdWUpO1xuICAgICAgICByZXR1cm4gdGhpcy5kZWNvcmF0ZShsaXRlcmFsLCB0aGlzLmFzTWFya2VyKHRoaXMuYXNNZXRhZGF0YShjdHguZ2V0U291cmNlSW50ZXJ2YWwoKSkpKVxuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2lkZW50aWZpZXJOYW1lLlxuICAgIHZpc2l0SWRlbnRpZmllck5hbWUoY3R4OiBSdWxlQ29udGV4dCk6IElkZW50aWZpZXIge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJ2aXNpdElkZW50aWZpZXJOYW1lIFslc106IFslc11cIiwgY3R4LmdldENoaWxkQ291bnQoKSwgY3R4LmdldFRleHQoKSk7XG4gICAgICAgIHRoaXMuYXNzZXJ0VHlwZShjdHgsIEVDTUFTY3JpcHRQYXJzZXIuSWRlbnRpZmllck5hbWVDb250ZXh0KVxuICAgICAgICB0aGlzLmFzc2VydE5vZGVDb3VudChjdHgsIDEpO1xuICAgICAgICBjb25zdCB2YWx1ZSA9IGN0eC5nZXRUZXh0KCk7XG4gICAgICAgIGNvbnN0IGlkZW50aWZpZXIgPSBuZXcgSWRlbnRpZmllcih2YWx1ZSk7XG4gICAgICAgIHJldHVybiB0aGlzLmRlY29yYXRlKGlkZW50aWZpZXIsIHRoaXMuYXNNYXJrZXIodGhpcy5hc01ldGFkYXRhKGN0eC5nZXRTb3VyY2VJbnRlcnZhbCgpKSkpXG4gICAgfVxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjcmVzZXJ2ZWRXb3JkLlxuICAgIHZpc2l0UmVzZXJ2ZWRXb3JkKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS5pbmZvKFwidmlzaXRSZXNlcnZlZFdvcmQ6IFwiICsgY3R4LmdldFRleHQoKSk7XG4gICAgfVxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIja2V5d29yZC5cbiAgICB2aXNpdEtleXdvcmQoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJ2aXNpdEtleXdvcmQ6IFwiICsgY3R4LmdldFRleHQoKSk7XG5cbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2Z1dHVyZVJlc2VydmVkV29yZC5cbiAgICB2aXNpdEZ1dHVyZVJlc2VydmVkV29yZChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gICAgfVxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjZ2V0dGVyLlxuICAgIHZpc2l0R2V0dGVyKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICB9XG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjc2V0dGVyLlxuICAgIHZpc2l0U2V0dGVyKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNlb3MuXG4gICAgdmlzaXRFb3MoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICAvL2NvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gICAgfVxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjZW9mLlxuICAgIHZpc2l0RW9mKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICB9XG5cbn0iXX0=