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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9BU1RQYXJzZXIudHMiXSwibmFtZXMiOlsiUGFyc2VyVHlwZSIsIkFTVFBhcnNlciIsImNvbnN0cnVjdG9yIiwidmlzaXRvciIsIkRlbHZlbkFTVFZpc2l0b3IiLCJnZW5lcmF0ZSIsInNvdXJjZSIsImNvZGUiLCJ0eXBlIiwidmFsdWUiLCJmcyIsInJlYWRGaWxlU3luYyIsImNoYXJzIiwiYW50bHI0IiwiSW5wdXRTdHJlYW0iLCJsZXhlciIsIkRlbHZlbkxleGVyIiwidG9rZW5zIiwiQ29tbW9uVG9rZW5TdHJlYW0iLCJwYXJzZXIiLCJEZWx2ZW5QYXJzZXIiLCJ0cmVlIiwicHJvZ3JhbSIsImFjY2VwdCIsIlByaW50VmlzaXRvciIsImNvbnNvbGUiLCJpbmZvIiwicmVzdWx0IiwicGFyc2UiLCJFQ01BU2NyaXB0IiwiQVNUUGFyc2VyRGVmYXVsdCIsIkVycm9yIiwiRGVsdmVuVmlzaXRvciIsInJ1bGVUeXBlTWFwIiwiTWFwIiwic2V0dXBUeXBlUnVsZXMiLCJrZXlzIiwiT2JqZWN0IiwiZ2V0T3duUHJvcGVydHlOYW1lcyIsIkVDTUFTY3JpcHRQYXJzZXIiLCJrZXkiLCJuYW1lIiwic3RhcnRzV2l0aCIsInNldCIsInBhcnNlSW50IiwiZHVtcENvbnRleHQiLCJjdHgiLCJjb250ZXh0IiwiZW5kc1dpdGgiLCJwdXNoIiwibGVuZ3RoIiwiY29udGV4dE5hbWUiLCJsb25nZXN0Iiwib2JqIiwiY2hhaW4iLCJwcm90b3R5cGUiLCJfX3Byb3RvX18iLCJkdW1wQ29udGV4dEFsbENoaWxkcmVuIiwiaW5kZW50IiwicGFkIiwicGFkU3RhcnQiLCJub2RlcyIsIm1hcmtlciIsImkiLCJnZXRDaGlsZENvdW50IiwiY2hpbGQiLCJnZXRDaGlsZCIsImdldFJ1bGVCeUlkIiwiaWQiLCJnZXQiLCJhc01hcmtlciIsIm1ldGFkYXRhIiwiaW5kZXgiLCJsaW5lIiwiY29sdW1uIiwiZGVjb3JhdGUiLCJub2RlIiwic3RhcnQiLCJlbmQiLCJ0aHJvd1R5cGVFcnJvciIsInR5cGVJZCIsIlR5cGVFcnJvciIsInRocm93SW5zYW5jZUVycm9yIiwiYXNzZXJ0VHlwZSIsInZpc2l0UHJvZ3JhbSIsImdldFRleHQiLCJzdGF0ZW1lbnRzIiwic3RtIiwiU3RhdGVtZW50Q29udGV4dCIsInN0YXRlbWVudCIsInZpc2l0U3RhdGVtZW50IiwiaW50ZXJ2YWwiLCJnZXRTb3VyY2VJbnRlcnZhbCIsInNjcmlwdCIsIlNjcmlwdCIsImFzTWV0YWRhdGEiLCJFeHByZXNzaW9uU3RhdGVtZW50Q29udGV4dCIsInZpc2l0RXhwcmVzc2lvblN0YXRlbWVudCIsIlZhcmlhYmxlU3RhdGVtZW50Q29udGV4dCIsInZpc2l0VmFyaWFibGVTdGF0ZW1lbnQiLCJCbG9ja0NvbnRleHQiLCJ2aXNpdEJsb2NrIiwiRW1wdHlTdGF0ZW1lbnRDb250ZXh0IiwiYm9keSIsIlN0YXRlbWVudExpc3RDb250ZXh0Iiwic3RhdGVtZW50TGlzdCIsInZpc2l0U3RhdGVtZW50TGlzdCIsIkJsb2NrU3RhdGVtZW50IiwicnVsZUluZGV4IiwiUlVMRV9zdGF0ZW1lbnQiLCJ1bmRlZmluZWQiLCJhc3NlcnROb2RlQ291bnQiLCJuMCIsIm4xIiwibjIiLCJkZWNsYXJhdGlvbnMiLCJ2aXNpdFZhcmlhYmxlRGVjbGFyYXRpb25MaXN0Iiwia2luZCIsIlZhcmlhYmxlRGVjbGFyYXRpb24iLCJWYXJpYWJsZURlY2xhcmF0aW9uTGlzdENvbnRleHQiLCJmaWx0ZXJTeW1ib2xzIiwiZm9yRWFjaCIsIlZhcmlhYmxlRGVjbGFyYXRpb25Db250ZXh0IiwiZGVjbGFyYXRpb24iLCJ2aXNpdFZhcmlhYmxlRGVjbGFyYXRpb24iLCJ0ZXh0IiwiSWRlbnRpZmllciIsImluaXQiLCJ2aXNpdEluaXRpYWxpc2VyIiwiVmFyaWFibGVEZWNsYXJhdG9yIiwiSW5pdGlhbGlzZXJDb250ZXh0IiwiT2JqZWN0TGl0ZXJhbEV4cHJlc3Npb25Db250ZXh0IiwidmlzaXRPYmplY3RMaXRlcmFsRXhwcmVzc2lvbiIsIkFycmF5TGl0ZXJhbEV4cHJlc3Npb25Db250ZXh0IiwidmlzaXRBcnJheUxpdGVyYWxFeHByZXNzaW9uIiwidmlzaXRFbXB0eVN0YXRlbWVudCIsImdldFJ1bGVUeXBlIiwiY291bnQiLCJleHAiLCJFeHByZXNzaW9uU2VxdWVuY2VDb250ZXh0IiwidmlzaXRFeHByZXNzaW9uU2VxdWVuY2UiLCJvZmZzZXQiLCJzdG9wIiwidmlzaXRJZlN0YXRlbWVudCIsInZpc2l0RG9TdGF0ZW1lbnQiLCJ2aXNpdFdoaWxlU3RhdGVtZW50IiwidmlzaXRGb3JTdGF0ZW1lbnQiLCJ2aXNpdEZvclZhclN0YXRlbWVudCIsInRyYWNlIiwidmlzaXRGb3JJblN0YXRlbWVudCIsInZpc2l0Rm9yVmFySW5TdGF0ZW1lbnQiLCJ2aXNpdENvbnRpbnVlU3RhdGVtZW50IiwidmlzaXRCcmVha1N0YXRlbWVudCIsInZpc2l0UmV0dXJuU3RhdGVtZW50IiwidmlzaXRXaXRoU3RhdGVtZW50IiwidmlzaXRTd2l0Y2hTdGF0ZW1lbnQiLCJ2aXNpdENhc2VCbG9jayIsInZpc2l0Q2FzZUNsYXVzZXMiLCJ2aXNpdENhc2VDbGF1c2UiLCJ2aXNpdERlZmF1bHRDbGF1c2UiLCJ2aXNpdExhYmVsbGVkU3RhdGVtZW50IiwidmlzaXRUaHJvd1N0YXRlbWVudCIsInZpc2l0VHJ5U3RhdGVtZW50IiwidmlzaXRDYXRjaFByb2R1Y3Rpb24iLCJ2aXNpdEZpbmFsbHlQcm9kdWN0aW9uIiwidmlzaXREZWJ1Z2dlclN0YXRlbWVudCIsInZpc2l0RnVuY3Rpb25EZWNsYXJhdGlvbiIsInZpc2l0Rm9ybWFsUGFyYW1ldGVyTGlzdCIsInZpc2l0RnVuY3Rpb25Cb2R5IiwidmlzaXRBcnJheUxpdGVyYWwiLCJBcnJheUxpdGVyYWxDb250ZXh0IiwicmVzdWx0cyIsIkVsZW1lbnRMaXN0Q29udGV4dCIsInZpc2l0RWxlbWVudExpc3QiLCJFbGlzaW9uQ29udGV4dCIsInZpc2l0RWxpc2lvbiIsInN5bWJvbCIsImVsZW1lbnRzIiwiZWxlbSIsInNpbmdsZUV4cHJlc3Npb24iLCJlbGlzaW9uIiwidmlzaXRPYmplY3RMaXRlcmFsIiwiT2JqZWN0TGl0ZXJhbENvbnRleHQiLCJQcm9wZXJ0eU5hbWVBbmRWYWx1ZUxpc3RDb250ZXh0IiwidmlzaXRQcm9wZXJ0eU5hbWVBbmRWYWx1ZUxpc3QiLCJwcm9wZXJ0aWVzIiwiUHJvcGVydHlFeHByZXNzaW9uQXNzaWdubWVudENvbnRleHQiLCJwcm9wZXJ0eSIsInZpc2l0UHJvcGVydHlFeHByZXNzaW9uQXNzaWdubWVudCIsImZpbHRlcmVkIiwidmlzaXRQcm9wZXJ0eU5hbWUiLCJjb21wdXRlZCIsIm1ldGhvZCIsInNob3J0aGFuZCIsIlByb3BlcnR5IiwidmlzaXRQcm9wZXJ0eUdldHRlciIsInZpc2l0UHJvcGVydHlTZXR0ZXIiLCJQcm9wZXJ0eU5hbWVDb250ZXh0IiwiY3JlYXRlTGl0ZXJhbFZhbHVlIiwidmlzaXRJZGVudGlmaWVyTmFtZSIsInZpc2l0UHJvcGVydHlTZXRQYXJhbWV0ZXJMaXN0IiwidmlzaXRBcmd1bWVudHMiLCJ2aXNpdEFyZ3VtZW50TGlzdCIsImV4cHJlc3Npb25zIiwiRXhwcmVzc2lvblN0YXRlbWVudCIsIlNlcXVlbmNlRXhwcmVzc2lvbiIsIkxpdGVyYWxFeHByZXNzaW9uQ29udGV4dCIsInZpc2l0TGl0ZXJhbEV4cHJlc3Npb24iLCJBc3NpZ25tZW50RXhwcmVzc2lvbkNvbnRleHQiLCJ2aXNpdEFzc2lnbm1lbnRFeHByZXNzaW9uIiwiQWRkaXRpdmVFeHByZXNzaW9uQ29udGV4dCIsInZpc2l0QWRkaXRpdmVFeHByZXNzaW9uIiwiTXVsdGlwbGljYXRpdmVFeHByZXNzaW9uQ29udGV4dCIsInZpc2l0TXVsdGlwbGljYXRpdmVFeHByZXNzaW9uIiwidmlzaXRUZXJuYXJ5RXhwcmVzc2lvbiIsInZpc2l0TG9naWNhbEFuZEV4cHJlc3Npb24iLCJ2aXNpdFByZUluY3JlbWVudEV4cHJlc3Npb24iLCJPYmplY3RFeHByZXNzaW9uIiwidmlzaXRJbkV4cHJlc3Npb24iLCJ2aXNpdExvZ2ljYWxPckV4cHJlc3Npb24iLCJ2aXNpdE5vdEV4cHJlc3Npb24iLCJ2aXNpdFByZURlY3JlYXNlRXhwcmVzc2lvbiIsInZpc2l0QXJndW1lbnRzRXhwcmVzc2lvbiIsInZpc2l0VGhpc0V4cHJlc3Npb24iLCJ2aXNpdEZ1bmN0aW9uRXhwcmVzc2lvbiIsInZpc2l0VW5hcnlNaW51c0V4cHJlc3Npb24iLCJ2aXNpdFBvc3REZWNyZWFzZUV4cHJlc3Npb24iLCJpbml0aWFsaXNlciIsIm9wZXJhdG9yIiwiZXhwcmVzc2lvbiIsImxocyIsInZpc2l0SWRlbnRpZmllckV4cHJlc3Npb24iLCJyaHMiLCJBc3NpZ25tZW50RXhwcmVzc2lvbiIsInZpc2l0VHlwZW9mRXhwcmVzc2lvbiIsInZpc2l0SW5zdGFuY2VvZkV4cHJlc3Npb24iLCJ2aXNpdFVuYXJ5UGx1c0V4cHJlc3Npb24iLCJ2aXNpdERlbGV0ZUV4cHJlc3Npb24iLCJ2aXNpdEVxdWFsaXR5RXhwcmVzc2lvbiIsInZpc2l0Qml0WE9yRXhwcmVzc2lvbiIsImxlZnQiLCJyaWdodCIsInZpc2l0QmluYXJ5RXhwcmVzc2lvbiIsIkJpbmFyeUV4cHJlc3Npb24iLCJ2aXNpdEJpdFNoaWZ0RXhwcmVzc2lvbiIsInZpc2l0UGFyZW50aGVzaXplZEV4cHJlc3Npb24iLCJfdmlzaXRCaW5hcnlFeHByZXNzaW9uIiwiSWRlbnRpZmllckV4cHJlc3Npb25Db250ZXh0IiwidmlzaXRSZWxhdGlvbmFsRXhwcmVzc2lvbiIsInZpc2l0UG9zdEluY3JlbWVudEV4cHJlc3Npb24iLCJ2aXNpdEJpdE5vdEV4cHJlc3Npb24iLCJ2aXNpdE5ld0V4cHJlc3Npb24iLCJMaXRlcmFsQ29udGV4dCIsInZpc2l0TGl0ZXJhbCIsIk51bWVyaWNMaXRlcmFsQ29udGV4dCIsInZpc2l0TnVtZXJpY0xpdGVyYWwiLCJBcnJheUV4cHJlc3Npb24iLCJ2aXNpdE1lbWJlckRvdEV4cHJlc3Npb24iLCJ2aXNpdE1lbWJlckluZGV4RXhwcmVzc2lvbiIsInZpc2l0Qml0QW5kRXhwcmVzc2lvbiIsInZpc2l0Qml0T3JFeHByZXNzaW9uIiwidmlzaXRBc3NpZ25tZW50T3BlcmF0b3JFeHByZXNzaW9uIiwidmlzaXRWb2lkRXhwcmVzc2lvbiIsInZpc2l0QXNzaWdubWVudE9wZXJhdG9yIiwibGl0ZXJhbCIsIkxpdGVyYWwiLCJOdW1iZXIiLCJJZGVudGlmaWVyTmFtZUNvbnRleHQiLCJpZGVudGlmaWVyIiwidmlzaXRSZXNlcnZlZFdvcmQiLCJ2aXNpdEtleXdvcmQiLCJ2aXNpdEZ1dHVyZVJlc2VydmVkV29yZCIsInZpc2l0R2V0dGVyIiwidmlzaXRTZXR0ZXIiLCJ2aXNpdEVvcyIsInZpc2l0RW9mIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBRUE7O0FBRUE7O0FBR0E7Ozs7OztBQUVBOzs7Ozs7OztJQVFZQSxVOzs7V0FBQUEsVTtBQUFBQSxFQUFBQSxVLENBQUFBLFU7R0FBQUEsVSwwQkFBQUEsVTs7QUFZRyxNQUFlQyxTQUFmLENBQXlCO0FBR3BDQyxFQUFBQSxXQUFXLENBQUNDLE9BQUQsRUFBNkI7QUFDcEMsU0FBS0EsT0FBTCxHQUFlQSxPQUFPLElBQUksSUFBSUMsZ0JBQUosRUFBMUI7QUFDSDs7QUFFREMsRUFBQUEsUUFBUSxDQUFDQyxNQUFELEVBQThCO0FBQ2xDLFFBQUlDLElBQUo7O0FBQ0EsWUFBUUQsTUFBTSxDQUFDRSxJQUFmO0FBQ0ksV0FBSyxNQUFMO0FBQ0lELFFBQUFBLElBQUksR0FBR0QsTUFBTSxDQUFDRyxLQUFkO0FBQ0E7O0FBQ0osV0FBSyxVQUFMO0FBQ0lGLFFBQUFBLElBQUksR0FBR0csRUFBRSxDQUFDQyxZQUFILENBQWdCTCxNQUFNLENBQUNHLEtBQXZCLEVBQThCLE1BQTlCLENBQVA7QUFDQTtBQU5SOztBQVNBLFFBQUlHLEtBQUssR0FBRyxJQUFJQyxNQUFNLENBQUNDLFdBQVgsQ0FBdUJQLElBQXZCLENBQVo7QUFDQSxRQUFJUSxLQUFLLEdBQUcsSUFBSUMsZ0NBQUosQ0FBZ0JKLEtBQWhCLENBQVo7QUFDQSxRQUFJSyxNQUFN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QUFpQixDQUFDL04sR0FBRCxFQUFtQjtBQUNoQ3JCLElBQUFBLE9BQU8sQ0FBQ0MsSUFBUixDQUFhLHdCQUF3Qm9CLEdBQUcsQ0FBQ3VDLE9BQUosRUFBckM7QUFDSCxHQWhpQytDLENBa2lDaEQ7OztBQUNBeUwsRUFBQUEsWUFBWSxDQUFDaE8sR0FBRCxFQUFtQjtBQUMzQnJCLElBQUFBLE9BQU8sQ0FBQ0MsSUFBUixDQUFhLG1CQUFtQm9CLEdBQUcsQ0FBQ3VDLE9BQUosRUFBaEM7QUFFSCxHQXRpQytDLENBeWlDaEQ7OztBQUNBMEwsRUFBQUEsdUJBQXVCLENBQUNqTyxHQUFELEVBQW1CO0FBQ3RDckIsSUFBQUEsT0FBTyxDQUFDMkgsS0FBUixDQUFjLGlCQUFkO0FBQ0gsR0E1aUMrQyxDQThpQ2hEOzs7QUFDQTRILEVBQUFBLFdBQVcsQ0FBQ2xPLEdBQUQsRUFBbUI7QUFDMUJyQixJQUFBQSxPQUFPLENBQUMySCxLQUFSLENBQWMsaUJBQWQ7QUFDSCxHQWpqQytDLENBa2pDaEQ7OztBQUNBNkgsRUFBQUEsV0FBVyxDQUFDbk8sR0FBRCxFQUFtQjtBQUMxQnJCLElBQUFBLE9BQU8sQ0FBQzJILEtBQVIsQ0FBYyxpQkFBZDtBQUNILEdBcmpDK0MsQ0F1akNoRDs7O0FBQ0E4SCxFQUFBQSxRQUFRLENBQUNwTyxHQUFELEVBQW1CLENBRTFCLENBRk8sQ0FDSjtBQUdKOzs7QUFDQXFPLEVBQUFBLFFBQVEsQ0FBQ3JPLEdBQUQsRUFBbUI7QUFDdkJyQixJQUFBQSxPQUFPLENBQUMySCxLQUFSLENBQWMsaUJBQWQ7QUFDSDs7QUEvakMrQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGFudGxyNCBmcm9tIFwiYW50bHI0XCJcbmltcG9ydCB7IEVDTUFTY3JpcHRWaXNpdG9yIGFzIERlbHZlblZpc2l0b3IgfSBmcm9tIFwiLi9wYXJzZXIvRUNNQVNjcmlwdFZpc2l0b3JcIlxuaW1wb3J0IHsgRUNNQVNjcmlwdFBhcnNlciBhcyBEZWx2ZW5QYXJzZXIsIEVDTUFTY3JpcHRQYXJzZXIgfSBmcm9tIFwiLi9wYXJzZXIvRUNNQVNjcmlwdFBhcnNlclwiXG5pbXBvcnQgeyBFQ01BU2NyaXB0TGV4ZXIgYXMgRGVsdmVuTGV4ZXIgfSBmcm9tIFwiLi9wYXJzZXIvRUNNQVNjcmlwdExleGVyXCJcbmltcG9ydCB7IFJ1bGVDb250ZXh0IH0gZnJvbSBcImFudGxyNC9SdWxlQ29udGV4dFwiXG5pbXBvcnQgeyBQcmludFZpc2l0b3IgfSBmcm9tIFwiLi9QcmludFZpc2l0b3JcIlxuaW1wb3J0IEFTVE5vZGUgZnJvbSBcIi4vQVNUTm9kZVwiO1xuaW1wb3J0IHsgRXhwcmVzc2lvblN0YXRlbWVudCwgTGl0ZXJhbCwgU2NyaXB0LCBCbG9ja1N0YXRlbWVudCwgU3RhdGVtZW50LCBTZXF1ZW5jZUV4cHJlc3Npb24sIFRocm93U3RhdGVtZW50LCBBc3NpZ25tZW50RXhwcmVzc2lvbiwgSWRlbnRpZmllciwgQmluYXJ5RXhwcmVzc2lvbiwgQXJyYXlFeHByZXNzaW9uLCBPYmplY3RFeHByZXNzaW9uLCBPYmplY3RFeHByZXNzaW9uUHJvcGVydHksIFByb3BlcnR5LCBQcm9wZXJ0eUtleSwgVmFyaWFibGVEZWNsYXJhdGlvbiwgVmFyaWFibGVEZWNsYXJhdG9yIH0gZnJvbSBcIi4vbm9kZXNcIjtcbmltcG9ydCB7IFN5bnRheCB9IGZyb20gXCIuL3N5bnRheFwiO1xuaW1wb3J0IHsgdHlwZSB9IGZyb20gXCJvc1wiXG5pbXBvcnQgKiBhcyBmcyBmcm9tIFwiZnNcIlxuXG4vKipcbiAqIFZlcnNpb24gdGhhdCB3ZSBnZW5lcmF0ZSB0aGUgQVNUIGZvci4gXG4gKiBUaGlzIGFsbG93cyBmb3IgdGVzdGluZyBkaWZmZXJlbnQgaW1wbGVtZW50YXRpb25zXG4gKiBcbiAqIEN1cnJlbnRseSBvbmx5IEVDTUFTY3JpcHQgaXMgc3VwcG9ydGVkXG4gKiBcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9lc3RyZWUvZXN0cmVlXG4gKi9cbmV4cG9ydCBlbnVtIFBhcnNlclR5cGUgeyBFQ01BU2NyaXB0IH1cbmV4cG9ydCB0eXBlIFNvdXJjZVR5cGUgPSBcImNvZGVcIiB8IFwiZmlsZW5hbWVcIjtcbmV4cG9ydCB0eXBlIFNvdXJjZUNvZGUgPSB7XG4gICAgdHlwZTogU291cmNlVHlwZSxcbiAgICB2YWx1ZTogc3RyaW5nXG59XG5leHBvcnQgaW50ZXJmYWNlIE1hcmtlciB7XG4gICAgaW5kZXg6IG51bWJlcjtcbiAgICBsaW5lOiBudW1iZXI7XG4gICAgY29sdW1uOiBudW1iZXI7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGFic3RyYWN0IGNsYXNzIEFTVFBhcnNlciB7XG4gICAgcHJpdmF0ZSB2aXNpdG9yOiAodHlwZW9mIERlbHZlblZpc2l0b3IgfCBudWxsKVxuXG4gICAgY29uc3RydWN0b3IodmlzaXRvcj86IERlbHZlbkFTVFZpc2l0b3IpIHtcbiAgICAgICAgdGhpcy52aXNpdG9yID0gdmlzaXRvciB8fCBuZXcgRGVsdmVuQVNUVmlzaXRvcigpO1xuICAgIH1cblxuICAgIGdlbmVyYXRlKHNvdXJjZTogU291cmNlQ29kZSk6IEFTVE5vZGUge1xuICAgICAgICBsZXQgY29kZTtcbiAgICAgICAgc3dpdGNoIChzb3VyY2UudHlwZSkge1xuICAgICAgICAgICAgY2FzZSBcImNvZGVcIjpcbiAgICAgICAgICAgICAgICBjb2RlID0gc291cmNlLnZhbHVlO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcImZpbGVuYW1lXCI6XG4gICAgICAgICAgICAgICAgY29kZSA9IGZzLnJlYWRGaWxlU3luYyhzb3VyY2UudmFsdWUsIFwidXRmOFwiKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBjaGFycyA9IG5ldyBhbnRscjQuSW5wdXRTdHJlYW0oY29kZSk7XG4gICAgICAgIGxldCBsZXhlciA9IG5ldyBEZWx2ZW5MZXhlcihjaGFycyk7XG4gICAgICAgIGxldCB0b2tlbnMgPSBuZXcgYW50bHI0LkNvbW1vblRva2VuU3RyZWFtKGxleGVyKTtcbiAgICAgICAgbGV0IHBhcnNlciA9IG5ldyBEZWx2ZW5QYXJzZXIodG9rZW5zKTtcbiAgICAgICAgbGV0IHRyZWUgPSBwYXJzZXIucHJvZ3JhbSgpO1xuICAgICAgICAvLyBjb25zb2xlLmluZm8odHJlZS50b1N0cmluZ1RyZWUoKSlcbiAgICAgICAgdHJlZS5hY2NlcHQobmV3IFByaW50VmlzaXRvcigpKTtcbiAgICAgICAgY29uc29sZS5pbmZvKFwiLS0tLS0tLS0tLS0tLS0tLS0tLS0tXCIpO1xuICAgICAgICBsZXQgcmVzdWx0ID0gdHJlZS5hY2NlcHQodGhpcy52aXNpdG9yKTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBQYXJzZSBzb3VyY2UgYW5kIGdlbmVyZWF0ZSBBU1QgdHJlZVxuICAgICAqIEBwYXJhbSBzb3VyY2UgXG4gICAgICogQHBhcmFtIHR5cGUgXG4gICAgICovXG4gICAgc3RhdGljIHBhcnNlKHNvdXJjZTogU291cmNlQ29kZSwgdHlwZT86IFBhcnNlclR5cGUpOiBBU1ROb2RlIHtcbiAgICAgICAgaWYgKHR5cGUgPT0gbnVsbClcbiAgICAgICAgICAgIHR5cGUgPSBQYXJzZXJUeXBlLkVDTUFTY3JpcHQ7XG4gICAgICAgIGxldCBwYXJzZXI7XG4gICAgICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgICAgICAgY2FzZSBQYXJzZXJUeXBlLkVDTUFTY3JpcHQ6XG4gICAgICAgICAgICAgICAgcGFyc2VyID0gbmV3IEFTVFBhcnNlckRlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVW5rb3duIHBhcnNlciB0eXBlXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHBhcnNlci5nZW5lcmF0ZShzb3VyY2UpXG4gICAgfVxufVxuXG5jbGFzcyBBU1RQYXJzZXJEZWZhdWx0IGV4dGVuZHMgQVNUUGFyc2VyIHtcblxufVxuXG5leHBvcnQgY2xhc3MgRGVsdmVuQVNUVmlzaXRvciBleHRlbmRzIERlbHZlblZpc2l0b3Ige1xuICAgIHByaXZhdGUgcnVsZVR5cGVNYXA6IE1hcDxudW1iZXIsIHN0cmluZz4gPSBuZXcgTWFwKCk7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5zZXR1cFR5cGVSdWxlcygpO1xuICAgIH1cblxuICAgIHByaXZhdGUgc2V0dXBUeXBlUnVsZXMoKSB7XG4gICAgICAgIGNvbnN0IGtleXMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhFQ01BU2NyaXB0UGFyc2VyKTtcbiAgICAgICAgZm9yICh2YXIga2V5IGluIGtleXMpIHtcbiAgICAgICAgICAgIGxldCBuYW1lID0ga2V5c1trZXldO1xuICAgICAgICAgICAgaWYgKG5hbWUuc3RhcnRzV2l0aCgnUlVMRV8nKSkge1xuICAgICAgICAgICAgICAgIHRoaXMucnVsZVR5cGVNYXAuc2V0KHBhcnNlSW50KEVDTUFTY3JpcHRQYXJzZXJbbmFtZV0pLCBuYW1lKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBkdW1wQ29udGV4dChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnN0IGtleXMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhFQ01BU2NyaXB0UGFyc2VyKTtcbiAgICAgICAgbGV0IGNvbnRleHQgPSBbXVxuICAgICAgICBmb3IgKHZhciBrZXkgaW4ga2V5cykge1xuICAgICAgICAgICAgbGV0IG5hbWUgPSBrZXlzW2tleV07XG4gICAgICAgICAgICAvLyB0aGlzIG9ubHkgdGVzdCBpbmhlcml0YW5jZVxuICAgICAgICAgICAgaWYgKG5hbWUuZW5kc1dpdGgoJ0NvbnRleHQnKSkge1xuICAgICAgICAgICAgICAgIGlmIChjdHggaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyW25hbWVdKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRleHQucHVzaChuYW1lKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBkaXJ5IGhhY2sgZm9yIHdhbGtpbmcgYW50bGVyIGRlcGVuY3kgY2hhaW4gXG4gICAgICAgIC8vIGZpbmQgbG9uZ2VzdCBkZXBlbmRlbmN5IGNoYWluZztcbiAgICAgICAgLy8gdGhpcyB0cmF2ZXJzYWwgaXMgc3BlY2lmaWMgdG8gQU5UTCBwYXJzZXJcbiAgICAgICAgLy8gV2Ugd2FudCB0byBiZSBhYmxlIHRvIGZpbmQgZGVwZW5kZW5jaWVzIHN1Y2ggYXM7XG4gICAgICAgIC8qXG4gICAgICAgICAgICAtLS0tLS0tLSAtLS0tLS0tLS0tLS1cbiAgICAgICAgICAgIFByb3BlcnR5RXhwcmVzc2lvbkFzc2lnbm1lbnRDb250ZXh0XG4gICAgICAgICAgICAqKiBQcm9wZXJ0eUFzc2lnbm1lbnRDb250ZXh0XG4gICAgICAgICAgICAqKiBQYXJzZXJSdWxlQ29udGV4dFxuICAgICAgICAgICAgLS0tLS0tLS0gLS0tLS0tLS0tLS0tXG4gICAgICAgICAgICBQcm9wZXJ0eUFzc2lnbm1lbnRDb250ZXh0XG4gICAgICAgICAgICAqKiBQYXJzZXJSdWxlQ29udGV4dFxuICAgICAgICAgKi9cbiAgICAgICAgaWYgKGNvbnRleHQubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgbGV0IGNvbnRleHROYW1lO1xuICAgICAgICAgICAgbGV0IGxvbmdlc3QgPSAwO1xuICAgICAgICAgICAgZm9yIChjb25zdCBrZXkgaW4gY29udGV4dCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IG5hbWUgPSBjb250ZXh0W2tleV07XG4gICAgICAgICAgICAgICAgbGV0IG9iaiA9IEVDTUFTY3JpcHRQYXJzZXJbbmFtZV07XG4gICAgICAgICAgICAgICAgbGV0IGNoYWluID0gMTtcbiAgICAgICAgICAgICAgICBkbyB7XG4gICAgICAgICAgICAgICAgICAgICsrY2hhaW47XG4gICAgICAgICAgICAgICAgICAgIG9iaiA9IEVDTUFTY3JpcHRQYXJzZXJbb2JqLnByb3RvdHlwZS5fX3Byb3RvX18uY29uc3RydWN0b3IubmFtZV07XG4gICAgICAgICAgICAgICAgfSB3aGlsZSAob2JqICYmIG9iai5wcm90b3R5cGUpXG4gICAgICAgICAgICAgICAgaWYgKGNoYWluID4gbG9uZ2VzdCkge1xuICAgICAgICAgICAgICAgICAgICBsb25nZXN0ID0gY2hhaW47XG4gICAgICAgICAgICAgICAgICAgIGNvbnRleHROYW1lID0gYCR7bmFtZX0gWyAqKiAke2NoYWlufV1gO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBbY29udGV4dE5hbWVdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjb250ZXh0O1xuICAgIH1cblxuICAgIHByaXZhdGUgZHVtcENvbnRleHRBbGxDaGlsZHJlbihjdHg6IFJ1bGVDb250ZXh0LCBpbmRlbnQ6IG51bWJlciA9IDApIHtcbiAgICAgICAgY29uc3QgcGFkID0gXCIgXCIucGFkU3RhcnQoaW5kZW50LCBcIlxcdFwiKTtcbiAgICAgICAgY29uc3Qgbm9kZXMgPSB0aGlzLmR1bXBDb250ZXh0KGN0eCk7XG4gICAgICAgIGlmIChub2Rlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBjb25zdCBtYXJrZXIgPSBpbmRlbnQgPT0gMCA/IFwiICMgXCIgOiBcIiAqIFwiO1xuICAgICAgICAgICAgY29uc29sZS5pbmZvKHBhZCArIG1hcmtlciArIG5vZGVzKVxuICAgICAgICB9XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY3R4LmdldENoaWxkQ291bnQoKTsgKytpKSB7XG4gICAgICAgICAgICBsZXQgY2hpbGQgPSBjdHg/LmdldENoaWxkKGkpO1xuICAgICAgICAgICAgaWYgKGNoaWxkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5kdW1wQ29udGV4dEFsbENoaWxkcmVuKGNoaWxkLCArK2luZGVudCk7XG4gICAgICAgICAgICAgICAgLS1pbmRlbnQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXQgcnVsZSBuYW1lIGJ5IHRoZSBJZFxuICAgICAqIEBwYXJhbSBpZCBcbiAgICAgKi9cbiAgICBnZXRSdWxlQnlJZChpZDogbnVtYmVyKTogc3RyaW5nIHwgdW5kZWZpbmVkIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucnVsZVR5cGVNYXAuZ2V0KGlkKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFzTWFya2VyKG1ldGFkYXRhOiBhbnkpIHtcbiAgICAgICAgcmV0dXJuIHsgaW5kZXg6IDEsIGxpbmU6IDEsIGNvbHVtbjogMSB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBkZWNvcmF0ZShub2RlOiBhbnksIG1hcmtlcjogTWFya2VyKTogYW55IHtcbiAgICAgICAgbm9kZS5zdGFydCA9IDA7XG4gICAgICAgIG5vZGUuZW5kID0gMDtcbiAgICAgICAgcmV0dXJuIG5vZGU7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSB0aHJvd1R5cGVFcnJvcih0eXBlSWQ6IGFueSkge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiVW5oYW5kbGVkIHR5cGUgOiBcIiArIHR5cGVJZCArIFwiIDogXCIgKyB0aGlzLmdldFJ1bGVCeUlkKHR5cGVJZCkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRocm93IFR5cGVFcnJvciBvbmx5IHdoZW4gdGhlcmUgaXMgYSB0eXBlIHByb3ZpZGVkLiBcbiAgICAgKiBUaGlzIGlzIHVzZWZ1bGwgd2hlbiB0aGVyZSBub2RlIGl0YSBUZXJtaW5hbE5vZGUgXG4gICAgICogQHBhcmFtIHR5cGUgXG4gICAgICovXG4gICAgcHJpdmF0ZSB0aHJvd0luc2FuY2VFcnJvcih0eXBlOiBhbnkpOiB2b2lkIHtcbiAgICAgICAgLyogICAgICAgICBpZiAodHlwZSA9PSB1bmRlZmluZWQgfHwgdHlwZSA9PSBcIlwiKSB7XG4gICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH0gKi9cbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlVuaGFuZGxlZCBpbnN0YW5jZSB0eXBlIDogXCIgKyB0eXBlKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFzc2VydFR5cGUoY3R4OiBSdWxlQ29udGV4dCwgdHlwZTogYW55KTogdm9pZCB7XG4gICAgICAgIGlmICghKGN0eCBpbnN0YW5jZW9mIHR5cGUpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiSW52YWxpZCB0eXBlIGV4cGVjdGVkIDogJ1wiICsgdHlwZS5uYW1lICsgXCInIHJlY2VpdmVkICdcIiArIHRoaXMuZHVtcENvbnRleHQoY3R4KSkgKyBcIidcIjtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI3Byb2dyYW0uXG4gICAgdmlzaXRQcm9ncmFtKGN0eDogRUNNQVNjcmlwdFBhcnNlci5Qcm9ncmFtQ29udGV4dCk6IFNjcmlwdCB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0UHJvZ3JhbSBbJXNdIDogJXNcIiwgY3R4LmdldENoaWxkQ291bnQoKSwgY3R4LmdldFRleHQoKSk7XG4gICAgICAgIC8vIHZpc2l0UHJvZ3JhbSAtPnZpc2l0U291cmNlRWxlbWVudHMgLT4gdmlzaXRTb3VyY2VFbGVtZW50IC0+IHZpc2l0U3RhdGVtZW50XG4gICAgICAgIGxldCBzdGF0ZW1lbnRzOiBhbnkgPSBbXTtcbiAgICAgICAgbGV0IG5vZGUgPSBjdHguZ2V0Q2hpbGQoMCk7ICAvLyB2aXNpdFByb2dyYW0gLT52aXNpdFNvdXJjZUVsZW1lbnRzIFxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5vZGUuZ2V0Q2hpbGRDb3VudCgpOyArK2kpIHtcbiAgICAgICAgICAgIGxldCBzdG0gPSBub2RlLmdldENoaWxkKGkpLmdldENoaWxkKDApOyAvLyBTb3VyY2VFbGVtZW50c0NvbnRleHQgPiBTdGF0ZW1lbnRDb250ZXh0XG4gICAgICAgICAgICBpZiAoc3RtIGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5TdGF0ZW1lbnRDb250ZXh0KSB7XG4gICAgICAgICAgICAgICAgbGV0IHN0YXRlbWVudCA9IHRoaXMudmlzaXRTdGF0ZW1lbnQoc3RtKTtcbiAgICAgICAgICAgICAgICBzdGF0ZW1lbnRzLnB1c2goc3RhdGVtZW50KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy50aHJvd0luc2FuY2VFcnJvcih0aGlzLmR1bXBDb250ZXh0KHN0bSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGxldCBpbnRlcnZhbCA9IGN0eC5nZXRTb3VyY2VJbnRlcnZhbCgpO1xuICAgICAgICBsZXQgc2NyaXB0ID0gbmV3IFNjcmlwdChzdGF0ZW1lbnRzKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGVjb3JhdGUoc2NyaXB0LCB0aGlzLmFzTWFya2VyKHRoaXMuYXNNZXRhZGF0YShpbnRlcnZhbCkpKTtcbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNzdGF0ZW1lbnQuXG4gICAgdmlzaXRTdGF0ZW1lbnQoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICB0aGlzLmFzc2VydFR5cGUoY3R4LCBFQ01BU2NyaXB0UGFyc2VyLlN0YXRlbWVudENvbnRleHQpXG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0U3RhdGVtZW50IFslc10gOiAlc1wiLCBjdHguZ2V0Q2hpbGRDb3VudCgpLCBjdHguZ2V0VGV4dCgpKTtcbiAgICAgICAgbGV0IG5vZGU6IFJ1bGVDb250ZXh0ID0gY3R4LmdldENoaWxkKDApO1xuXG4gICAgICAgIGlmIChub2RlIGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5FeHByZXNzaW9uU3RhdGVtZW50Q29udGV4dCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmlzaXRFeHByZXNzaW9uU3RhdGVtZW50KG5vZGUpO1xuICAgICAgICB9IGVsc2UgaWYgKG5vZGUgaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLlZhcmlhYmxlU3RhdGVtZW50Q29udGV4dCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmlzaXRWYXJpYWJsZVN0YXRlbWVudChub2RlKTtcbiAgICAgICAgfSBlbHNlIGlmIChub2RlIGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5CbG9ja0NvbnRleHQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnZpc2l0QmxvY2sobm9kZSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAobm9kZSBpbnN0YW5jZW9mIEVDTUFTY3JpcHRQYXJzZXIuRW1wdHlTdGF0ZW1lbnRDb250ZXh0KSB7XG4gICAgICAgICAgICAvLyBOT09QLFxuICAgICAgICAgICAgLy8gdmFyIHg7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnRocm93SW5zYW5jZUVycm9yKHRoaXMuZHVtcENvbnRleHQobm9kZSkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjYmxvY2suXG4gICAgdmlzaXRCbG9jayhjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0QmxvY2sgWyVzXSA6ICVzXCIsIGN0eC5nZXRDaGlsZENvdW50KCksIGN0eC5nZXRUZXh0KCkpO1xuICAgICAgICB0aGlzLmFzc2VydFR5cGUoY3R4LCBFQ01BU2NyaXB0UGFyc2VyLkJsb2NrQ29udGV4dClcbiAgICAgICAgbGV0IGJvZHkgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjdHguZ2V0Q2hpbGRDb3VudCgpOyArK2kpIHtcbiAgICAgICAgICAgIGxldCBub2RlOiBSdWxlQ29udGV4dCA9IGN0eC5nZXRDaGlsZChpKTtcbiAgICAgICAgICAgIGlmIChub2RlIGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5TdGF0ZW1lbnRMaXN0Q29udGV4dCkge1xuICAgICAgICAgICAgICAgIGxldCBzdGF0ZW1lbnRMaXN0ID0gdGhpcy52aXNpdFN0YXRlbWVudExpc3Qobm9kZSk7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaW5kZXggaW4gc3RhdGVtZW50TGlzdCkge1xuICAgICAgICAgICAgICAgICAgICBib2R5LnB1c2goc3RhdGVtZW50TGlzdFtpbmRleF0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy50aHJvd0luc2FuY2VFcnJvcih0aGlzLmR1bXBDb250ZXh0KG5vZGUpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5kZWNvcmF0ZShuZXcgQmxvY2tTdGF0ZW1lbnQoYm9keSksIHRoaXMuYXNNYXJrZXIodGhpcy5hc01ldGFkYXRhKGN0eC5nZXRTb3VyY2VJbnRlcnZhbCgpKSkpO1xuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjc3RhdGVtZW50TGlzdC5cbiAgICB2aXNpdFN0YXRlbWVudExpc3QoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJ2aXNpdFN0YXRlbWVudExpc3QgWyVzXSA6ICVzXCIsIGN0eC5nZXRDaGlsZENvdW50KCksIGN0eC5nZXRUZXh0KCkpO1xuICAgICAgICBjb25zdCBib2R5ID0gW107XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY3R4LmdldENoaWxkQ291bnQoKTsgKytpKSB7XG4gICAgICAgICAgICBsZXQgbm9kZTogUnVsZUNvbnRleHQgPSBjdHguZ2V0Q2hpbGQoaSk7XG4gICAgICAgICAgICBsZXQgdHlwZSA9IG5vZGUucnVsZUluZGV4O1xuICAgICAgICAgICAgaWYgKHR5cGUgPT0gRUNNQVNjcmlwdFBhcnNlci5SVUxFX3N0YXRlbWVudCkge1xuICAgICAgICAgICAgICAgIGxldCBzdGF0ZW1lbnQ6IGFueSA9IHRoaXMudmlzaXRTdGF0ZW1lbnQobm9kZSk7XG4gICAgICAgICAgICAgICAgYm9keS5wdXNoKHN0YXRlbWVudCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGUgPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnRocm93VHlwZUVycm9yKHR5cGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBib2R5O1xuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI3ZhcmlhYmxlU3RhdGVtZW50LlxuICAgIHZpc2l0VmFyaWFibGVTdGF0ZW1lbnQoY3R4OiBSdWxlQ29udGV4dCk6IFZhcmlhYmxlRGVjbGFyYXRpb24ge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJ2aXNpdFZhcmlhYmxlU3RhdGVtZW50IFslc10gOiAlc1wiLCBjdHguZ2V0Q2hpbGRDb3VudCgpLCBjdHguZ2V0VGV4dCgpKTtcbiAgICAgICAgdGhpcy5hc3NlcnRUeXBlKGN0eCwgRUNNQVNjcmlwdFBhcnNlci5WYXJpYWJsZVN0YXRlbWVudENvbnRleHQpXG4gICAgICAgIHRoaXMuYXNzZXJ0Tm9kZUNvdW50KGN0eCwgMyk7XG5cbiAgICAgICAgY29uc3QgbjAgPSBjdHguZ2V0Q2hpbGQoMCk7IC8vIHZhclxuICAgICAgICBjb25zdCBuMSA9IGN0eC5nZXRDaGlsZCgxKTsgLy8gdmFyaWFibGUgbGlzdFxuICAgICAgICBjb25zdCBuMiA9IGN0eC5nZXRDaGlsZCgyKTsgIC8vRW9zQ29udGV4dFxuXG4gICAgICAgIHRoaXMuZHVtcENvbnRleHRBbGxDaGlsZHJlbihuMilcbiAgICAgICAgY29uc3QgZGVjbGFyYXRpb25zOiBWYXJpYWJsZURlY2xhcmF0b3JbXSA9IHRoaXMudmlzaXRWYXJpYWJsZURlY2xhcmF0aW9uTGlzdChuMSk7XG4gICAgICAgIGNvbnN0IGtpbmQgPSBcInZhclwiO1xuICAgICAgICByZXR1cm4gbmV3IFZhcmlhYmxlRGVjbGFyYXRpb24oZGVjbGFyYXRpb25zLCBraW5kKTtcbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciN2YXJpYWJsZURlY2xhcmF0aW9uTGlzdC5cbiAgICB2aXNpdFZhcmlhYmxlRGVjbGFyYXRpb25MaXN0KGN0eDogUnVsZUNvbnRleHQpOiBWYXJpYWJsZURlY2xhcmF0b3JbXSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcIlZhcmlhYmxlRGVjbGFyYXRpb25MaXN0Q29udGV4dCBbJXNdIDogJXNcIiwgY3R4LmdldENoaWxkQ291bnQoKSwgY3R4LmdldFRleHQoKSk7XG4gICAgICAgIHRoaXMuYXNzZXJ0VHlwZShjdHgsIEVDTUFTY3JpcHRQYXJzZXIuVmFyaWFibGVEZWNsYXJhdGlvbkxpc3RDb250ZXh0KVxuICAgICAgICBcbiAgICAgICAgLy90aGlzLmFzc2VydE5vZGVDb3VudChjdHgsIDMpO1xuXG4gICAgICAgIGNvbnN0IGRlY2xhcmF0aW9uczogVmFyaWFibGVEZWNsYXJhdG9yW10gPSBbXTtcbiAgICAgICAgY29uc3Qgbm9kZXMgPSB0aGlzLmZpbHRlclN5bWJvbHMoY3R4KTtcbiAgICAgICAgbm9kZXMuZm9yRWFjaChub2RlID0+IHtcbiAgICAgICAgICAgIGlmIChub2RlIGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5WYXJpYWJsZURlY2xhcmF0aW9uQ29udGV4dCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGRlY2xhcmF0aW9uID0gdGhpcy52aXNpdFZhcmlhYmxlRGVjbGFyYXRpb24obm9kZSlcbiAgICAgICAgICAgICAgICBkZWNsYXJhdGlvbnMucHVzaChkZWNsYXJhdGlvbilcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy50aHJvd0luc2FuY2VFcnJvcih0aGlzLmR1bXBDb250ZXh0KG5vZGUpKVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGRlY2xhcmF0aW9ucztcbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciN2YXJpYWJsZURlY2xhcmF0aW9uLlxuICAgIHZpc2l0VmFyaWFibGVEZWNsYXJhdGlvbihjdHg6IFJ1bGVDb250ZXh0KTogVmFyaWFibGVEZWNsYXJhdG9yIHtcbiAgICAgICAgY29uc29sZS5pbmZvKFwidmlzaXRWYXJpYWJsZURlY2xhcmF0aW9uIFslc10gOiAlc1wiLCBjdHguZ2V0Q2hpbGRDb3VudCgpLCBjdHguZ2V0VGV4dCgpKTtcbiAgICAgICAgdGhpcy5hc3NlcnRUeXBlKGN0eCwgRUNNQVNjcmlwdFBhcnNlci5WYXJpYWJsZURlY2xhcmF0aW9uQ29udGV4dClcbiAgICAgICAgLy8gbGVuZ2h0IG9mIDEgb3IgMlxuICAgICAgICAvLyAxIGB2YXIgeGBcbiAgICAgICAgLy8gMiBgdmFyIHggPSB7fWBcbiAgICAgICAgY29uc3QgdGV4dCA9IGN0eC5nZXRUZXh0KCk7XG4gICAgICAgIGNvbnN0IGlkID0gbmV3IElkZW50aWZpZXIodGV4dCk7XG4gICAgICAgIGxldCBpbml0ID0gbnVsbDtcbiAgICAgICAgaWYoY3R4LmdldENoaWxkQ291bnQoKSA9PSAyKSB7XG4gICAgICAgICAgICBpbml0ICA9IHRoaXMudmlzaXRJbml0aWFsaXNlcihjdHguZ2V0Q2hpbGQoMSkpO1xuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJVbmtub3cgdmFyaWFibGUgZGVjbGFyYXRpb24gdHlwZVwiKTtcbiAgICAgICAgfSAgICBcbiAgICAgICAgcmV0dXJuIG5ldyBWYXJpYWJsZURlY2xhcmF0b3IoaWQsIGluaXQpO1xuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2luaXRpYWxpc2VyLlxuICAgIHZpc2l0SW5pdGlhbGlzZXIoY3R4OiBSdWxlQ29udGV4dCkgOiBPYmplY3RFeHByZXNzaW9uIHwgQXJyYXlFeHByZXNzaW9uIHwgdW5kZWZpbmVkIHtcbiAgICAgICAgY29uc29sZS5pbmZvKFwidmlzaXRJbml0aWFsaXNlciBbJXNdIDogJXNcIiwgY3R4LmdldENoaWxkQ291bnQoKSwgY3R4LmdldFRleHQoKSk7XG4gICAgICAgIHRoaXMuYXNzZXJ0VHlwZShjdHgsIEVDTUFTY3JpcHRQYXJzZXIuSW5pdGlhbGlzZXJDb250ZXh0KVxuICAgICAgICB0aGlzLmFzc2VydE5vZGVDb3VudChjdHgsIDIpO1xuICAgICAgICB0aGlzLmR1bXBDb250ZXh0QWxsQ2hpbGRyZW4oY3R4KVxuICAgICAgICBjb25zdCBub2RlOlJ1bGVDb250ZXh0ID0gY3R4LmdldENoaWxkKDEpO1xuICAgICAgICBpZihub2RlIGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5PYmplY3RMaXRlcmFsRXhwcmVzc2lvbkNvbnRleHQpe1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmlzaXRPYmplY3RMaXRlcmFsRXhwcmVzc2lvbihub2RlKTtcbiAgICAgICAgfSAgZWxzZSBpZihub2RlIGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5BcnJheUxpdGVyYWxFeHByZXNzaW9uQ29udGV4dCl7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy52aXNpdEFycmF5TGl0ZXJhbEV4cHJlc3Npb24obm9kZSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy50aHJvd0luc2FuY2VFcnJvcih0aGlzLmR1bXBDb250ZXh0KG5vZGUpKVxuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2VtcHR5U3RhdGVtZW50LlxuICAgIHZpc2l0RW1wdHlTdGF0ZW1lbnQoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJ2aXNpdEVtcHR5U3RhdGVtZW50IFslc10gOiAlc1wiLCBjdHguZ2V0Q2hpbGRDb3VudCgpLCBjdHguZ2V0VGV4dCgpKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldFJ1bGVUeXBlKG5vZGU6IGFueSwgaW5kZXg6IG51bWJlcik6IG51bWJlciB7XG4gICAgICAgIHJldHVybiBub2RlLmdldENoaWxkKGluZGV4KS5ydWxlSW5kZXg7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc3NlcnROb2RlQ291bnQoY3R4OiBSdWxlQ29udGV4dCwgY291bnQ6IG51bWJlcikge1xuICAgICAgICBpZiAoY3R4LmdldENoaWxkQ291bnQoKSAhPSBjb3VudCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiV3JvbmcgY2hpbGQgY291bnQsIGV4cGVjdGVkICdcIiArIGNvdW50ICsgXCInIGdvdCA6IFwiICsgY3R4LmdldENoaWxkQ291bnQoKSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNleHByZXNzaW9uU3RhdGVtZW50LlxuICAgIHZpc2l0RXhwcmVzc2lvblN0YXRlbWVudChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0RXhwcmVzc2lvblN0YXRlbWVudDogXCIgKyBjdHguZ2V0VGV4dCgpKTtcbiAgICAgICAgdGhpcy5hc3NlcnRUeXBlKGN0eCwgRUNNQVNjcmlwdFBhcnNlci5FeHByZXNzaW9uU3RhdGVtZW50Q29udGV4dClcbiAgICAgICAgdGhpcy5hc3NlcnROb2RlQ291bnQoY3R4LCAxKTtcbiAgICAgICAgLy8gdmlzaXRFeHByZXNzaW9uU3RhdGVtZW50Oj52aXNpdEV4cHJlc3Npb25TZXF1ZW5jZVxuICAgICAgICBjb25zdCBub2RlOiBSdWxlQ29udGV4dCA9IGN0eC5nZXRDaGlsZCgwKTsgLy8gdmlzaXRFeHByZXNzaW9uU2VxdWVuY2UgXG4gICAgICAgIGxldCBleHBcbiAgICAgICAgaWYgKG5vZGUgaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLkV4cHJlc3Npb25TZXF1ZW5jZUNvbnRleHQpIHtcbiAgICAgICAgICAgIGV4cCA9IHRoaXMudmlzaXRFeHByZXNzaW9uU2VxdWVuY2Uobm9kZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnRocm93SW5zYW5jZUVycm9yKHRoaXMuZHVtcENvbnRleHQobm9kZSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGV4cCAvL3RoaXMuZGVjb3JhdGUoZXhwLCB0aGlzLmFzTWFya2VyKHRoaXMuYXNNZXRhZGF0YShjdHguZ2V0U291cmNlSW50ZXJ2YWwoKSkpKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFzTWV0YWRhdGEoaW50ZXJ2YWw6IEludGVydmFsKTogYW55IHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHN0YXJ0OiB7XG4gICAgICAgICAgICAgICAgbGluZTogMSxcbiAgICAgICAgICAgICAgICBjb2x1bW46IGludGVydmFsLnN0YXJ0LFxuICAgICAgICAgICAgICAgIG9mZnNldDogMFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGVuZDoge1xuICAgICAgICAgICAgICAgIGxpbmU6IDEsXG4gICAgICAgICAgICAgICAgY29sdW1uOiBpbnRlcnZhbC5zdG9wLFxuICAgICAgICAgICAgICAgIG9mZnNldDogM1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjaWZTdGF0ZW1lbnQuXG4gICAgdmlzaXRJZlN0YXRlbWVudChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0SWZTdGF0ZW1lbnQ6IFwiICsgY3R4LmdldFRleHQoKSk7XG5cbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI0RvU3RhdGVtZW50LlxuICAgIHZpc2l0RG9TdGF0ZW1lbnQoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJ2aXNpdERvU3RhdGVtZW50OiBcIiArIGN0eC5nZXRUZXh0KCkpO1xuXG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNXaGlsZVN0YXRlbWVudC5cbiAgICB2aXNpdFdoaWxlU3RhdGVtZW50KGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS5pbmZvKFwidmlzaXRXaGlsZVN0YXRlbWVudDogXCIgKyBjdHguZ2V0VGV4dCgpKTtcblxuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjRm9yU3RhdGVtZW50LlxuICAgIHZpc2l0Rm9yU3RhdGVtZW50KGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS5pbmZvKFwidmlzaXRXaGlsZVN0YXRlbWVudDogXCIgKyBjdHguZ2V0VGV4dCgpKTtcblxuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjRm9yVmFyU3RhdGVtZW50LlxuICAgIHZpc2l0Rm9yVmFyU3RhdGVtZW50KGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcblxuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjRm9ySW5TdGF0ZW1lbnQuXG4gICAgdmlzaXRGb3JJblN0YXRlbWVudChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG5cbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI0ZvclZhckluU3RhdGVtZW50LlxuICAgIHZpc2l0Rm9yVmFySW5TdGF0ZW1lbnQoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuXG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNjb250aW51ZVN0YXRlbWVudC5cbiAgICB2aXNpdENvbnRpbnVlU3RhdGVtZW50KGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcblxuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjYnJlYWtTdGF0ZW1lbnQuXG4gICAgdmlzaXRCcmVha1N0YXRlbWVudChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG5cbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI3JldHVyblN0YXRlbWVudC5cbiAgICB2aXNpdFJldHVyblN0YXRlbWVudChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG5cbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI3dpdGhTdGF0ZW1lbnQuXG4gICAgdmlzaXRXaXRoU3RhdGVtZW50KGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcblxuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjc3dpdGNoU3RhdGVtZW50LlxuICAgIHZpc2l0U3dpdGNoU3RhdGVtZW50KGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcblxuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjY2FzZUJsb2NrLlxuICAgIHZpc2l0Q2FzZUJsb2NrKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcblxuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjY2FzZUNsYXVzZXMuXG4gICAgdmlzaXRDYXNlQ2xhdXNlcyhjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG5cbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2Nhc2VDbGF1c2UuXG4gICAgdmlzaXRDYXNlQ2xhdXNlKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcblxuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjZGVmYXVsdENsYXVzZS5cbiAgICB2aXNpdERlZmF1bHRDbGF1c2UoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuXG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNsYWJlbGxlZFN0YXRlbWVudC5cbiAgICB2aXNpdExhYmVsbGVkU3RhdGVtZW50KGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcblxuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjdGhyb3dTdGF0ZW1lbnQuXG4gICAgdmlzaXRUaHJvd1N0YXRlbWVudChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG5cbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI3RyeVN0YXRlbWVudC5cbiAgICB2aXNpdFRyeVN0YXRlbWVudChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG5cbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2NhdGNoUHJvZHVjdGlvbi5cbiAgICB2aXNpdENhdGNoUHJvZHVjdGlvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG5cbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2ZpbmFsbHlQcm9kdWN0aW9uLlxuICAgIHZpc2l0RmluYWxseVByb2R1Y3Rpb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuXG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNkZWJ1Z2dlclN0YXRlbWVudC5cbiAgICB2aXNpdERlYnVnZ2VyU3RhdGVtZW50KGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcblxuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjZnVuY3Rpb25EZWNsYXJhdGlvbi5cbiAgICB2aXNpdEZ1bmN0aW9uRGVjbGFyYXRpb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuXG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNmb3JtYWxQYXJhbWV0ZXJMaXN0LlxuICAgIHZpc2l0Rm9ybWFsUGFyYW1ldGVyTGlzdChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNmdW5jdGlvbkJvZHkuXG4gICAgdmlzaXRGdW5jdGlvbkJvZHkoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJ2aXNpdEZ1bmN0aW9uQm9keTogXCIgKyBjdHguZ2V0VGV4dCgpKTtcbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2FycmF5TGl0ZXJhbC5cbiAgICB2aXNpdEFycmF5TGl0ZXJhbChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0QXJyYXlMaXRlcmFsIFslc10gOiAlc1wiLCBjdHguZ2V0Q2hpbGRDb3VudCgpLCBjdHguZ2V0VGV4dCgpKTtcbiAgICAgICAgdGhpcy5hc3NlcnRUeXBlKGN0eCwgRUNNQVNjcmlwdFBhcnNlci5BcnJheUxpdGVyYWxDb250ZXh0KVxuICAgICAgICAvLyB3ZSBqdXN0IGdvdCBgW11gXG4gICAgICAgIGlmIChjdHguZ2V0Q2hpbGRDb3VudCgpID09IDIpIHtcbiAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCByZXN1bHRzID0gW11cbiAgICAgICAgLy8gc2tpcCBgWyBhbmQgIF1gIFxuICAgICAgICBmb3IgKGxldCBpID0gMTsgaSA8IGN0eC5nZXRDaGlsZENvdW50KCkgLSAxOyArK2kpIHtcbiAgICAgICAgICAgIGNvbnN0IG5vZGU6UnVsZUNvbnRleHQgPSBjdHguZ2V0Q2hpbGQoaSk7XG4gICAgICAgICAgICBsZXQgZXhwID0gW107XG4gICAgICAgICAgICBpZiAobm9kZSBpbnN0YW5jZW9mIEVDTUFTY3JpcHRQYXJzZXIuRWxlbWVudExpc3RDb250ZXh0KSB7XG4gICAgICAgICAgICAgICAgZXhwID0gdGhpcy52aXNpdEVsZW1lbnRMaXN0KG5vZGUpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChub2RlIGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5FbGlzaW9uQ29udGV4dCkge1xuICAgICAgICAgICAgICAgIGV4cCA9IHRoaXMudmlzaXRFbGlzaW9uKG5vZGUpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBzcGVjaWFsIGNhc2UgZm9yIGhhbmRsaW5nIGVsaXNpb24gdmFsdWVzIGxpa2UgOiAgWzExLCwsMTFdIF0gIFssLF1cbiAgICAgICAgICAgICAgICBpZiAobm9kZS5zeW1ib2wgIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIGV4cCA9IFtudWxsXVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50aHJvd0luc2FuY2VFcnJvcih0aGlzLmR1bXBDb250ZXh0KG5vZGUpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXN1bHRzID0gWy4uLnJlc3VsdHMsIC4uLmV4cF07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgfVxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjZWxlbWVudExpc3QuXG4gICAgdmlzaXRFbGVtZW50TGlzdChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0RWxlbWVudExpc3QgWyVzXSA6ICVzXCIsIGN0eC5nZXRDaGlsZENvdW50KCksIGN0eC5nZXRUZXh0KCkpO1xuICAgICAgICB0aGlzLmFzc2VydFR5cGUoY3R4LCBFQ01BU2NyaXB0UGFyc2VyLkVsZW1lbnRMaXN0Q29udGV4dClcbiAgICAgICAgY29uc3QgZWxlbWVudHMgPSBbXTtcbiAgICAgICAgY29uc3Qgbm9kZXM6IFJ1bGVDb250ZXh0W10gPSB0aGlzLmZpbHRlclN5bWJvbHMoY3R4KTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgY29uc3QgZWxlbSA9IHRoaXMuc2luZ2xlRXhwcmVzc2lvbihub2Rlc1tpXSk7XG4gICAgICAgICAgICBlbGVtZW50cy5wdXNoKGVsZW0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBlbGVtZW50cztcbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNlbGlzaW9uLlxuICAgIHZpc2l0RWxpc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0RWxpc2lvbiBbJXNdIDogJXNcIiwgY3R4LmdldENoaWxkQ291bnQoKSwgY3R4LmdldFRleHQoKSk7XG4gICAgICAgIHRoaXMuYXNzZXJ0VHlwZShjdHgsIEVDTUFTY3JpcHRQYXJzZXIuRWxpc2lvbkNvbnRleHQpXG4gICAgICAgIC8vIGNvbXBsaWFuY2U6IGVzcHJpbWEgY29tcGxpYW5lIG9yIHJldHVybmluZyBgbnVsbGAgXG4gICAgICAgIGNvbnN0IGVsaXNpb24gPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjdHguZ2V0Q2hpbGRDb3VudCgpOyArK2kpIHtcbiAgICAgICAgICAgIGVsaXNpb24ucHVzaChudWxsKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZWxpc2lvbjtcbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNvYmplY3RMaXRlcmFsLlxuICAgIHZpc2l0T2JqZWN0TGl0ZXJhbChjdHg6IFJ1bGVDb250ZXh0KTogT2JqZWN0RXhwcmVzc2lvblByb3BlcnR5W10ge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJ2aXNpdE9iamVjdExpdGVyYWwgWyVzXSA6ICVzXCIsIGN0eC5nZXRDaGlsZENvdW50KCksIGN0eC5nZXRUZXh0KCkpO1xuICAgICAgICB0aGlzLmFzc2VydFR5cGUoY3R4LCBFQ01BU2NyaXB0UGFyc2VyLk9iamVjdExpdGVyYWxDb250ZXh0KTtcbiAgICAgICAgY29uc3Qgbm9kZTpSdWxlQ29udGV4dCA9IGN0eC5nZXRDaGlsZCgxKTtcbiAgICAgICAgaWYgKG5vZGUgaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLlByb3BlcnR5TmFtZUFuZFZhbHVlTGlzdENvbnRleHQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnZpc2l0UHJvcGVydHlOYW1lQW5kVmFsdWVMaXN0KG5vZGUpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBbXTtcbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNwcm9wZXJ0eU5hbWVBbmRWYWx1ZUxpc3QuXG4gICAgdmlzaXRQcm9wZXJ0eU5hbWVBbmRWYWx1ZUxpc3QoY3R4OiBSdWxlQ29udGV4dCk6IE9iamVjdEV4cHJlc3Npb25Qcm9wZXJ0eVtdIHtcbiAgICAgICAgY29uc29sZS5pbmZvKFwidmlzaXRQcm9wZXJ0eU5hbWVBbmRWYWx1ZUxpc3QgWyVzXSA6ICVzXCIsIGN0eC5nZXRDaGlsZENvdW50KCksIGN0eC5nZXRUZXh0KCkpO1xuICAgICAgICB0aGlzLmFzc2VydFR5cGUoY3R4LCBFQ01BU2NyaXB0UGFyc2VyLlByb3BlcnR5TmFtZUFuZFZhbHVlTGlzdENvbnRleHQpO1xuICAgICAgICBjb25zdCBwcm9wZXJ0aWVzOiBPYmplY3RFeHByZXNzaW9uUHJvcGVydHlbXSA9IFtdO1xuICAgICAgICBjb25zdCBub2RlczogUnVsZUNvbnRleHRbXSA9IHRoaXMuZmlsdGVyU3ltYm9scyhjdHgpO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICBjb25zdCBub2RlID0gbm9kZXNbaV07XG4gICAgICAgICAgICBpZiAobm9kZSBpbnN0YW5jZW9mIEVDTUFTY3JpcHRQYXJzZXIuUHJvcGVydHlFeHByZXNzaW9uQXNzaWdubWVudENvbnRleHQpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBwcm9wZXJ0eTogT2JqZWN0RXhwcmVzc2lvblByb3BlcnR5ID0gdGhpcy52aXNpdFByb3BlcnR5RXhwcmVzc2lvbkFzc2lnbm1lbnQobm9kZSk7XG4gICAgICAgICAgICAgICAgcHJvcGVydGllcy5wdXNoKHByb3BlcnR5KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy50aHJvd0luc2FuY2VFcnJvcih0aGlzLmR1bXBDb250ZXh0KG5vZGUpKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBwcm9wZXJ0aWVzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEZpbHRlciBvdXQgVGVybWluYWxOb2RlcyAoY29tbWFzLCBwaXBlcywgYnJhY2tldHMpXG4gICAgICogQHBhcmFtIGN0eCBcbiAgICAgKi9cbiAgICBwcml2YXRlIGZpbHRlclN5bWJvbHMoY3R4OiBSdWxlQ29udGV4dCk6IFJ1bGVDb250ZXh0W10ge1xuICAgICAgICBjb25zdCBmaWx0ZXJlZDogUnVsZUNvbnRleHRbXSA9IFtdO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGN0eC5nZXRDaGlsZENvdW50KCk7ICsraSkge1xuICAgICAgICAgICAgY29uc3Qgbm9kZSA9IGN0eC5nZXRDaGlsZChpKTtcbiAgICAgICAgICAgIC8vIHRoZXJlIG1pZ2h0IGJlIGEgYmV0dGVyIHdheVxuICAgICAgICAgICAgaWYgKG5vZGUuc3ltYm9sICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZmlsdGVyZWQucHVzaChub2RlKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmlsdGVyZWQ7XG4gICAgfVxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjUHJvcGVydHlFeHByZXNzaW9uQXNzaWdubWVudC5cbiAgICB2aXNpdFByb3BlcnR5RXhwcmVzc2lvbkFzc2lnbm1lbnQoY3R4OiBSdWxlQ29udGV4dCk6IE9iamVjdEV4cHJlc3Npb25Qcm9wZXJ0eSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0UHJvcGVydHlFeHByZXNzaW9uQXNzaWdubWVudCBbJXNdIDogJXNcIiwgY3R4LmdldENoaWxkQ291bnQoKSwgY3R4LmdldFRleHQoKSk7XG4gICAgICAgIHRoaXMuYXNzZXJ0VHlwZShjdHgsIEVDTUFTY3JpcHRQYXJzZXIuUHJvcGVydHlFeHByZXNzaW9uQXNzaWdubWVudENvbnRleHQpO1xuICAgICAgICB0aGlzLmFzc2VydE5vZGVDb3VudChjdHgsIDMpO1xuICAgICAgICBsZXQgbjAgPSBjdHguZ2V0Q2hpbGQoMCk7IC8vIFByb3BlcnR5TmFtZVxuICAgICAgICBsZXQgbjEgPSBjdHguZ2V0Q2hpbGQoMSk7IC8vIHN5bWJvbCA6XG4gICAgICAgIGxldCBuMiA9IGN0eC5nZXRDaGlsZCgyKTsgLy8gIHNpbmdsZUV4cHJlc3Npb24gXG4gICAgICAgIGNvbnN0IGtleTogUHJvcGVydHlLZXkgPSB0aGlzLnZpc2l0UHJvcGVydHlOYW1lKG4wKTtcbiAgICAgICAgY29uc3QgdmFsdWUgPSB0aGlzLnNpbmdsZUV4cHJlc3Npb24objIpO1xuICAgICAgICBjb25zdCBjb21wdXRlZCA9IGZhbHNlO1xuICAgICAgICBjb25zdCBtZXRob2QgPSBmYWxzZTtcbiAgICAgICAgY29uc3Qgc2hvcnRoYW5kID0gZmFsc2U7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBQcm9wZXJ0eShcImluaXRcIiwga2V5LCBjb21wdXRlZCwgdmFsdWUsIG1ldGhvZCwgc2hvcnRoYW5kKTtcbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNQcm9wZXJ0eUdldHRlci5cbiAgICB2aXNpdFByb3BlcnR5R2V0dGVyKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcblxuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjUHJvcGVydHlTZXR0ZXIuXG4gICAgdmlzaXRQcm9wZXJ0eVNldHRlcihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG5cbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNwcm9wZXJ0eU5hbWUuXG4gICAgdmlzaXRQcm9wZXJ0eU5hbWUoY3R4OiBSdWxlQ29udGV4dCk6IFByb3BlcnR5S2V5IHtcbiAgICAgICAgY29uc29sZS5pbmZvKFwidmlzaXRQcm9wZXJ0eU5hbWUgWyVzXSA6ICVzXCIsIGN0eC5nZXRDaGlsZENvdW50KCksIGN0eC5nZXRUZXh0KCkpO1xuICAgICAgICB0aGlzLmFzc2VydFR5cGUoY3R4LCBFQ01BU2NyaXB0UGFyc2VyLlByb3BlcnR5TmFtZUNvbnRleHQpO1xuICAgICAgICB0aGlzLmFzc2VydE5vZGVDb3VudChjdHgsIDEpO1xuICAgICAgICBjb25zdCBub2RlID0gY3R4LmdldENoaWxkKDApO1xuICAgICAgICBjb25zdCBjb3VudCA9IG5vZGUuZ2V0Q2hpbGRDb3VudCgpO1xuICAgICAgICBpZiAoY291bnQgPT0gMCkgeyAvLyBsaXRlcmFsXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jcmVhdGVMaXRlcmFsVmFsdWUobm9kZSk7XG4gICAgICAgIH0gZWxzZSBpZiAoY291bnQgPT0gMSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmlzaXRJZGVudGlmaWVyTmFtZShub2RlKVxuICAgICAgICB9XG4gICAgICAgIHRoaXMudGhyb3dJbnNhbmNlRXJyb3IodGhpcy5kdW1wQ29udGV4dChub2RlKSk7XG4gICAgfVxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjcHJvcGVydHlTZXRQYXJhbWV0ZXJMaXN0LlxuICAgIHZpc2l0UHJvcGVydHlTZXRQYXJhbWV0ZXJMaXN0KGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcblxuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2FyZ3VtZW50cy5cbiAgICB2aXNpdEFyZ3VtZW50cyhjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0QXJndW1lbnRzOiBcIiArIGN0eC5nZXRUZXh0KCkpO1xuXG4gICAgfVxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjYXJndW1lbnRMaXN0LlxuICAgIHZpc2l0QXJndW1lbnRMaXN0KGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS5pbmZvKFwidmlzaXRBcmd1bWVudExpc3Q6IFwiICsgY3R4LmdldFRleHQoKSk7XG4gICAgfVxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjZXhwcmVzc2lvblNlcXVlbmNlLlxuICAgIHZpc2l0RXhwcmVzc2lvblNlcXVlbmNlKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS5pbmZvKFwidmlzaXRFeHByZXNzaW9uU2VxdWVuY2UgWyVzXSA6IFslc11cIiwgY3R4LmdldENoaWxkQ291bnQoKSwgY3R4LmdldFRleHQoKSk7XG4gICAgICAgIHRoaXMuYXNzZXJ0VHlwZShjdHgsIEVDTUFTY3JpcHRQYXJzZXIuRXhwcmVzc2lvblNlcXVlbmNlQ29udGV4dCk7XG4gICAgICAgIGNvbnN0IGV4cHJlc3Npb25zID0gW107XG4gICAgICAgIC8vIGVhY2ggbm9kZSBpcyBhIHNpbmdsZUV4cHJlc3Npb25cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjdHguZ2V0Q2hpbGRDb3VudCgpOyArK2kpIHtcbiAgICAgICAgICAgIGNvbnN0IG5vZGU6IFJ1bGVDb250ZXh0ID0gY3R4LmdldENoaWxkKGkpO1xuICAgICAgICAgICAgY29uc3QgZXhwID0gdGhpcy5zaW5nbGVFeHByZXNzaW9uKG5vZGUpO1xuICAgICAgICAgICAgZXhwcmVzc2lvbnMucHVzaChleHApO1xuICAgICAgICB9XG4gICAgICAgIC8vIGNvbXBsaWFuY2U6IGVzcGlybWEsIGVzcHJlZVxuICAgICAgICAvLyB0aGlzIGNoZWNrIHRvIHNlZSBpZiB0aGVyZSBhcmUgbXVsdGlwbGUgZXhwcmVzc2lvbnMgaWYgc28gdGhlbiB3ZSBsZWF2ZSB0aGVtIGFzIFNlcXVlbmNlRXhwcmVzc2lvbiBcbiAgICAgICAgLy8gb3RoZXJ3aXNlIHdlIHdpbGwgcm9sbCB0aGVtIHVwIGludG8gRXhwcmVzc2lvblN0YXRlbWVudCB3aXRoIG9uZSBleHByZXNzaW9uXG4gICAgICAgIC8vIGAxYCA9IEV4cHJlc3Npb25TdGF0ZW1lbnQgLT4gTGl0ZXJhbFxuICAgICAgICAvLyBgMSwgMmAgPSBFeHByZXNzaW9uU3RhdGVtZW50IC0+IFNlcXVlbmNlRXhwcmVzc2lvbiAtPiBMaXRlcmFsLCBMaXRlcmFsXG4gICAgICAgIGxldCBleHA7XG4gICAgICAgIGlmIChleHByZXNzaW9ucy5sZW5ndGggPT0gMSkge1xuICAgICAgICAgICAgZXhwID0gbmV3IEV4cHJlc3Npb25TdGF0ZW1lbnQoZXhwcmVzc2lvbnNbMF0pXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBleHAgPSBuZXcgU2VxdWVuY2VFeHByZXNzaW9uKGV4cHJlc3Npb25zKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5kZWNvcmF0ZShleHAsIHRoaXMuYXNNYXJrZXIodGhpcy5hc01ldGFkYXRhKGN0eC5nZXRTb3VyY2VJbnRlcnZhbCgpKSkpXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRXZhbHVhdGUgYSBzaW5nbGVFeHByZXNzaW9uXG4gICAgICogQHBhcmFtIG5vZGUgXG4gICAgICovXG4gICAgc2luZ2xlRXhwcmVzc2lvbihub2RlOiBSdWxlQ29udGV4dCk6IGFueSB7XG4gICAgICAgIGlmIChub2RlIGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5MaXRlcmFsRXhwcmVzc2lvbkNvbnRleHQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnZpc2l0TGl0ZXJhbEV4cHJlc3Npb24obm9kZSk7XG4gICAgICAgIH0gZWxzZSBpZiAobm9kZSBpbnN0YW5jZW9mIEVDTUFTY3JpcHRQYXJzZXIuT2JqZWN0TGl0ZXJhbEV4cHJlc3Npb25Db250ZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy52aXNpdE9iamVjdExpdGVyYWxFeHByZXNzaW9uKG5vZGUpO1xuICAgICAgICB9IGVsc2UgaWYgKG5vZGUgaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLkFzc2lnbm1lbnRFeHByZXNzaW9uQ29udGV4dCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmlzaXRBc3NpZ25tZW50RXhwcmVzc2lvbihub2RlKTtcbiAgICAgICAgfSBlbHNlIGlmIChub2RlIGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5BZGRpdGl2ZUV4cHJlc3Npb25Db250ZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy52aXNpdEFkZGl0aXZlRXhwcmVzc2lvbihub2RlKTtcbiAgICAgICAgfSBlbHNlIGlmIChub2RlIGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5NdWx0aXBsaWNhdGl2ZUV4cHJlc3Npb25Db250ZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy52aXNpdE11bHRpcGxpY2F0aXZlRXhwcmVzc2lvbihub2RlKTtcbiAgICAgICAgfSBlbHNlIGlmIChub2RlIGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5BcnJheUxpdGVyYWxFeHByZXNzaW9uQ29udGV4dCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmlzaXRBcnJheUxpdGVyYWxFeHByZXNzaW9uKG5vZGUpO1xuICAgICAgICB9IFxuICAgICAgICB0aGlzLnRocm93SW5zYW5jZUVycm9yKHRoaXMuZHVtcENvbnRleHQobm9kZSkpO1xuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI1Rlcm5hcnlFeHByZXNzaW9uLlxuICAgIHZpc2l0VGVybmFyeUV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjTG9naWNhbEFuZEV4cHJlc3Npb24uXG4gICAgdmlzaXRMb2dpY2FsQW5kRXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG5cbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI1ByZUluY3JlbWVudEV4cHJlc3Npb24uXG4gICAgdmlzaXRQcmVJbmNyZW1lbnRFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcblxuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI09iamVjdExpdGVyYWxFeHByZXNzaW9uLlxuICAgIHZpc2l0T2JqZWN0TGl0ZXJhbEV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCk6IE9iamVjdEV4cHJlc3Npb24ge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJ2aXNpdE9iamVjdExpdGVyYWxFeHByZXNzaW9uIFslc10gOiAlc1wiLCBjdHguZ2V0Q2hpbGRDb3VudCgpLCBjdHguZ2V0VGV4dCgpKTtcbiAgICAgICAgdGhpcy5hc3NlcnRUeXBlKGN0eCwgRUNNQVNjcmlwdFBhcnNlci5PYmplY3RMaXRlcmFsRXhwcmVzc2lvbkNvbnRleHQpO1xuICAgICAgICBjb25zdCBub2RlID0gY3R4LmdldENoaWxkKDApO1xuICAgICAgICBjb25zdCBwcm9wZXJ0aWVzOiBPYmplY3RFeHByZXNzaW9uUHJvcGVydHlbXSA9IHRoaXMudmlzaXRPYmplY3RMaXRlcmFsKG5vZGUpO1xuICAgICAgICByZXR1cm4gbmV3IE9iamVjdEV4cHJlc3Npb24ocHJvcGVydGllcyk7XG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNJbkV4cHJlc3Npb24uXG4gICAgdmlzaXRJbkV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuXG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNMb2dpY2FsT3JFeHByZXNzaW9uLlxuICAgIHZpc2l0TG9naWNhbE9yRXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG5cbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI05vdEV4cHJlc3Npb24uXG4gICAgdmlzaXROb3RFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcblxuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjUHJlRGVjcmVhc2VFeHByZXNzaW9uLlxuICAgIHZpc2l0UHJlRGVjcmVhc2VFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcblxuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjQXJndW1lbnRzRXhwcmVzc2lvbi5cbiAgICB2aXNpdEFyZ3VtZW50c0V4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJ2aXNpdEFyZ3VtZW50c0V4cHJlc3Npb246IFwiICsgY3R4LmdldFRleHQoKSk7XG5cblxuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjVGhpc0V4cHJlc3Npb24uXG4gICAgdmlzaXRUaGlzRXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG5cbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI0Z1bmN0aW9uRXhwcmVzc2lvbi5cbiAgICB2aXNpdEZ1bmN0aW9uRXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG5cbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI1VuYXJ5TWludXNFeHByZXNzaW9uLlxuICAgIHZpc2l0VW5hcnlNaW51c0V4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuXG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNQb3N0RGVjcmVhc2VFeHByZXNzaW9uLlxuICAgIHZpc2l0UG9zdERlY3JlYXNlRXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG5cbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI0Fzc2lnbm1lbnRFeHByZXNzaW9uLlxuICAgIHZpc2l0QXNzaWdubWVudEV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJ2aXNpdEFzc2lnbm1lbnRFeHByZXNzaW9uIFslc10gOiBbJXNdXCIsIGN0eC5nZXRDaGlsZENvdW50KCksIGN0eC5nZXRUZXh0KCkpO1xuICAgICAgICB0aGlzLmFzc2VydFR5cGUoY3R4LCBFQ01BU2NyaXB0UGFyc2VyLkFzc2lnbm1lbnRFeHByZXNzaW9uQ29udGV4dCk7XG4gICAgICAgIHRoaXMuYXNzZXJ0Tm9kZUNvdW50KGN0eCwgMylcblxuICAgICAgICBsZXQgaW5pdGlhbGlzZXIgPSBjdHguZ2V0Q2hpbGQoMCk7IC8vIElkZW50aWZpZXJFeHByZXNzaW9uQ29udGV4dFxuICAgICAgICBsZXQgb3BlcmF0b3IgPSBjdHguZ2V0Q2hpbGQoMSkuZ2V0VGV4dCgpOyAvLyBObyB0eXBlICggPSApXG4gICAgICAgIGxldCBleHByZXNzaW9uID0gY3R4LmdldENoaWxkKDIpOyAgLy9FeHByZXNzaW9uU2VxdWVuY2VDb250ZXh0XG5cbiAgICAgICAgbGV0IGxocyA9IHRoaXMudmlzaXRJZGVudGlmaWVyRXhwcmVzc2lvbihpbml0aWFsaXNlcik7XG4gICAgICAgIGxldCByaHMgPSB0aGlzLnZpc2l0RXhwcmVzc2lvblNlcXVlbmNlKGV4cHJlc3Npb24pO1xuICAgICAgICAvLyBDb21wbGlhbmNlIDogcHVsbGluZyB1cCBFeHByZXNzaW9uU3RhdGVtZW50IGludG8gQXNzaWdlbWVudEV4cHJlc3Npb25cbiAgICAgICAgbGV0IG5vZGUgPSBuZXcgQXNzaWdubWVudEV4cHJlc3Npb24ob3BlcmF0b3IsIGxocywgcmhzLmV4cHJlc3Npb24pXG4gICAgICAgIHJldHVybiBub2RlO1xuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjVHlwZW9mRXhwcmVzc2lvbi5cbiAgICB2aXNpdFR5cGVvZkV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuXG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNJbnN0YW5jZW9mRXhwcmVzc2lvbi5cbiAgICB2aXNpdEluc3RhbmNlb2ZFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcblxuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjVW5hcnlQbHVzRXhwcmVzc2lvbi5cbiAgICB2aXNpdFVuYXJ5UGx1c0V4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuXG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNEZWxldGVFeHByZXNzaW9uLlxuICAgIHZpc2l0RGVsZXRlRXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG5cbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI0VxdWFsaXR5RXhwcmVzc2lvbi5cbiAgICB2aXNpdEVxdWFsaXR5RXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG5cbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI0JpdFhPckV4cHJlc3Npb24uXG4gICAgdmlzaXRCaXRYT3JFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcblxuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjTXVsdGlwbGljYXRpdmVFeHByZXNzaW9uLlxuICAgIHZpc2l0TXVsdGlwbGljYXRpdmVFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS5pbmZvKFwidmlzaXRNdWx0aXBsaWNhdGl2ZUV4cHJlc3Npb24gWyVzXSA6ICVzXCIsIGN0eC5nZXRDaGlsZENvdW50KCksIGN0eC5nZXRUZXh0KCkpO1xuICAgICAgICB0aGlzLmFzc2VydFR5cGUoY3R4LCBFQ01BU2NyaXB0UGFyc2VyLk11bHRpcGxpY2F0aXZlRXhwcmVzc2lvbkNvbnRleHQpO1xuICAgICAgICB0aGlzLmFzc2VydE5vZGVDb3VudChjdHgsIDMpXG5cbiAgICAgICAgbGV0IGxlZnQgPSBjdHguZ2V0Q2hpbGQoMCk7XG4gICAgICAgIGxldCBvcGVyYXRvciA9IGN0eC5nZXRDaGlsZCgxKS5nZXRUZXh0KCk7IC8vIE5vIHR5cGUgKCArLC0gKVxuICAgICAgICBsZXQgcmlnaHQgPSBjdHguZ2V0Q2hpbGQoMik7XG4gICAgICAgIGxldCBsaHMgPSB0aGlzLnZpc2l0QmluYXJ5RXhwcmVzc2lvbihsZWZ0KTtcbiAgICAgICAgbGV0IHJocyA9IHRoaXMudmlzaXRCaW5hcnlFeHByZXNzaW9uKHJpZ2h0KTtcblxuICAgICAgICByZXR1cm4gdGhpcy5kZWNvcmF0ZShuZXcgQmluYXJ5RXhwcmVzc2lvbihvcGVyYXRvciwgbGhzLCByaHMpLCB7fSk7XG4gICAgfVxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjQml0U2hpZnRFeHByZXNzaW9uLlxuICAgIHZpc2l0Qml0U2hpZnRFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcblxuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI1BhcmVudGhlc2l6ZWRFeHByZXNzaW9uLlxuICAgIHZpc2l0UGFyZW50aGVzaXplZEV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJ2aXNpdFBhcmVudGhlc2l6ZWRFeHByZXNzaW9uOiBcIiArIGN0eC5nZXRUZXh0KCkpO1xuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI0FkZGl0aXZlRXhwcmVzc2lvbi5cbiAgICB2aXNpdEFkZGl0aXZlRXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0QWRkaXRpdmVFeHByZXNzaW9uIFslc10gOiAlc1wiLCBjdHguZ2V0Q2hpbGRDb3VudCgpLCBjdHguZ2V0VGV4dCgpKTtcbiAgICAgICAgdGhpcy5hc3NlcnRUeXBlKGN0eCwgRUNNQVNjcmlwdFBhcnNlci5BZGRpdGl2ZUV4cHJlc3Npb25Db250ZXh0KTtcbiAgICAgICAgdGhpcy5hc3NlcnROb2RlQ291bnQoY3R4LCAzKVxuXG4gICAgICAgIGxldCBsZWZ0ID0gY3R4LmdldENoaWxkKDApO1xuICAgICAgICBsZXQgb3BlcmF0b3IgPSBjdHguZ2V0Q2hpbGQoMSkuZ2V0VGV4dCgpOyAvLyBObyB0eXBlICggKywtIClcbiAgICAgICAgbGV0IHJpZ2h0ID0gY3R4LmdldENoaWxkKDIpO1xuICAgICAgICBsZXQgbGhzID0gdGhpcy5fdmlzaXRCaW5hcnlFeHByZXNzaW9uKGxlZnQpO1xuICAgICAgICBsZXQgcmhzID0gdGhpcy5fdmlzaXRCaW5hcnlFeHByZXNzaW9uKHJpZ2h0KTtcbiAgICAgICAgLy8gcmV0dXJuIHRoaXMuZGVjb3JhdGUobmV3IEJpbmFyeUV4cHJlc3Npb24ob3BlcmF0b3IsIGxocyAscmhzKSwgdGhpcy5hc01hcmtlcih0aGlzLmFzTWV0YWRhdGEoY3R4LnN5bWJvbCkpKTtcbiAgICAgICAgcmV0dXJuIG5ldyBCaW5hcnlFeHByZXNzaW9uKG9wZXJhdG9yLCBsaHMsIHJocyk7XG4gICAgfVxuXG4gICAgX3Zpc2l0QmluYXJ5RXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcImV2YWxCaW5hcnlFeHByZXNzaW9uIFslc10gOiAlc1wiLCBjdHguZ2V0Q2hpbGRDb3VudCgpLCBjdHguZ2V0VGV4dCgpKTtcbiAgICAgICAgaWYgKGN0eCBpbnN0YW5jZW9mIEVDTUFTY3JpcHRQYXJzZXIuSWRlbnRpZmllckV4cHJlc3Npb25Db250ZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy52aXNpdElkZW50aWZpZXJFeHByZXNzaW9uKGN0eCk7XG4gICAgICAgIH0gZWxzZSBpZiAoY3R4IGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5MaXRlcmFsRXhwcmVzc2lvbkNvbnRleHQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnZpc2l0TGl0ZXJhbEV4cHJlc3Npb24oY3R4KTtcbiAgICAgICAgfSBlbHNlIGlmIChjdHggaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLkFkZGl0aXZlRXhwcmVzc2lvbkNvbnRleHQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnZpc2l0QWRkaXRpdmVFeHByZXNzaW9uKGN0eCk7XG4gICAgICAgIH0gZWxzZSBpZiAoY3R4IGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5NdWx0aXBsaWNhdGl2ZUV4cHJlc3Npb25Db250ZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy52aXNpdE11bHRpcGxpY2F0aXZlRXhwcmVzc2lvbihjdHgpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMudGhyb3dJbnNhbmNlRXJyb3IodGhpcy5kdW1wQ29udGV4dChjdHgpKTtcbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNSZWxhdGlvbmFsRXhwcmVzc2lvbi5cbiAgICB2aXNpdFJlbGF0aW9uYWxFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNQb3N0SW5jcmVtZW50RXhwcmVzc2lvbi5cbiAgICB2aXNpdFBvc3RJbmNyZW1lbnRFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNCaXROb3RFeHByZXNzaW9uLlxuICAgIHZpc2l0Qml0Tm90RXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG5cbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI05ld0V4cHJlc3Npb24uXG4gICAgdmlzaXROZXdFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcblxuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjTGl0ZXJhbEV4cHJlc3Npb24uXG4gICAgdmlzaXRMaXRlcmFsRXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0TGl0ZXJhbEV4cHJlc3Npb24gWyVzXSA6IFslc11cIiwgY3R4LmdldENoaWxkQ291bnQoKSwgY3R4LmdldFRleHQoKSk7XG4gICAgICAgIHRoaXMuYXNzZXJ0VHlwZShjdHgsIEVDTUFTY3JpcHRQYXJzZXIuTGl0ZXJhbEV4cHJlc3Npb25Db250ZXh0KTtcbiAgICAgICAgdGhpcy5hc3NlcnROb2RlQ291bnQoY3R4LCAxKTtcbiAgICAgICAgLy8gdmlzaXRMaXRlcmFsRXhwcmVzc2lvbjogPiB2aXNpdExpdGVyYWxcbiAgICAgICAgbGV0IG5vZGUgPSBjdHguZ2V0Q2hpbGQoMClcbiAgICAgICAgaWYgKG5vZGUgaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLkxpdGVyYWxDb250ZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy52aXNpdExpdGVyYWwobm9kZSk7XG4gICAgICAgIH0gZWxzZSBpZiAobm9kZSBpbnN0YW5jZW9mIEVDTUFTY3JpcHRQYXJzZXIuTnVtZXJpY0xpdGVyYWxDb250ZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy52aXNpdE51bWVyaWNMaXRlcmFsKG5vZGUpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMudGhyb3dJbnNhbmNlRXJyb3IodGhpcy5kdW1wQ29udGV4dChub2RlKSk7XG4gICAgfVxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjQXJyYXlMaXRlcmFsRXhwcmVzc2lvbi5cbiAgICB2aXNpdEFycmF5TGl0ZXJhbEV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCk6IEFycmF5RXhwcmVzc2lvbiB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0QXJyYXlMaXRlcmFsRXhwcmVzc2lvbiBbJXNdIDogJXNcIiwgY3R4LmdldENoaWxkQ291bnQoKSwgY3R4LmdldFRleHQoKSk7XG4gICAgICAgIHRoaXMuYXNzZXJ0VHlwZShjdHgsIEVDTUFTY3JpcHRQYXJzZXIuQXJyYXlMaXRlcmFsRXhwcmVzc2lvbkNvbnRleHQpO1xuICAgICAgICB0aGlzLmFzc2VydE5vZGVDb3VudChjdHgsIDEpO1xuICAgICAgICBjb25zdCBub2RlID0gY3R4LmdldENoaWxkKDApO1xuICAgICAgICBjb25zdCBlbGVtZW50cyA9IHRoaXMudmlzaXRBcnJheUxpdGVyYWwobm9kZSk7XG4gICAgICAgIHJldHVybiBuZXcgQXJyYXlFeHByZXNzaW9uKGVsZW1lbnRzKTtcbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNNZW1iZXJEb3RFeHByZXNzaW9uLlxuICAgIHZpc2l0TWVtYmVyRG90RXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0TWVtYmVyRG90RXhwcmVzc2lvbiBbJXNdIDogJXNcIiwgY3R4LmdldENoaWxkQ291bnQoKSwgY3R4LmdldFRleHQoKSk7XG4gICAgfVxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjTWVtYmVySW5kZXhFeHByZXNzaW9uLlxuICAgIHZpc2l0TWVtYmVySW5kZXhFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI0lkZW50aWZpZXJFeHByZXNzaW9uLlxuICAgIHZpc2l0SWRlbnRpZmllckV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCk6IElkZW50aWZpZXJ7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0SWRlbnRpZmllckV4cHJlc3Npb24gWyVzXSA6ICVzXCIsIGN0eC5nZXRDaGlsZENvdW50KCksIGN0eC5nZXRUZXh0KCkpO1xuICAgICAgICB0aGlzLmFzc2VydFR5cGUoY3R4LCBFQ01BU2NyaXB0UGFyc2VyLklkZW50aWZpZXJFeHByZXNzaW9uQ29udGV4dCk7XG4gICAgICAgIHRoaXMuYXNzZXJ0Tm9kZUNvdW50KGN0eCwgMSlcbiAgICAgICAgY29uc3QgaW5pdGlhbGlzZXIgPSBjdHguZ2V0Q2hpbGQoMCk7XG4gICAgICAgIGNvbnN0IG5hbWUgPSBpbml0aWFsaXNlci5nZXRUZXh0KCk7XG4gICAgICAgIHJldHVybiB0aGlzLmRlY29yYXRlKG5ldyBJZGVudGlmaWVyKG5hbWUpLCB0aGlzLmFzTWFya2VyKHRoaXMuYXNNZXRhZGF0YShpbml0aWFsaXNlci5zeW1ib2wpKSlcbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNCaXRBbmRFeHByZXNzaW9uLlxuICAgIHZpc2l0Qml0QW5kRXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gICAgfVxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjQml0T3JFeHByZXNzaW9uLlxuICAgIHZpc2l0Qml0T3JFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI0Fzc2lnbm1lbnRPcGVyYXRvckV4cHJlc3Npb24uXG4gICAgdmlzaXRBc3NpZ25tZW50T3BlcmF0b3JFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI1ZvaWRFeHByZXNzaW9uLlxuICAgIHZpc2l0Vm9pZEV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuXG4gICAgfVxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjYXNzaWdubWVudE9wZXJhdG9yLlxuICAgIHZpc2l0QXNzaWdubWVudE9wZXJhdG9yKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS5pbmZvKFwidmlzaXRBc3NpZ25tZW50T3BlcmF0b3I6IFwiICsgY3R4LmdldFRleHQoKSk7XG4gICAgfVxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjbGl0ZXJhbC5cbiAgICB2aXNpdExpdGVyYWwoY3R4OiBSdWxlQ29udGV4dCk6IExpdGVyYWwge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJ2aXNpdExpdGVyYWwgWyVzXSA6IFslc11cIiwgY3R4LmdldENoaWxkQ291bnQoKSwgY3R4LmdldFRleHQoKSk7XG4gICAgICAgIHRoaXMuYXNzZXJ0VHlwZShjdHgsIEVDTUFTY3JpcHRQYXJzZXIuTGl0ZXJhbENvbnRleHQpXG4gICAgICAgIHRoaXMuYXNzZXJ0Tm9kZUNvdW50KGN0eCwgMSk7XG4gICAgICAgIGNvbnN0IG5vZGU6IFJ1bGVDb250ZXh0ID0gY3R4LmdldENoaWxkKDApO1xuICAgICAgICBpZiAobm9kZS5nZXRDaGlsZENvdW50KCkgPT0gMSkge1xuICAgICAgICAgICAgaWYgKG5vZGUgaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLk51bWVyaWNMaXRlcmFsQ29udGV4dCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnZpc2l0TnVtZXJpY0xpdGVyYWwobm9kZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnRocm93SW5zYW5jZUVycm9yKHRoaXMuZHVtcENvbnRleHQobm9kZSkpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKG5vZGUuZ2V0Q2hpbGRDb3VudCgpID09IDApIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNyZWF0ZUxpdGVyYWxWYWx1ZShub2RlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI251bWVyaWNMaXRlcmFsLlxuICAgIHZpc2l0TnVtZXJpY0xpdGVyYWwoY3R4OiBSdWxlQ29udGV4dCk6IExpdGVyYWwge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJ2aXNpdE51bWVyaWNMaXRlcmFsIFslc10gOiBbJXNdXCIsIGN0eC5nZXRDaGlsZENvdW50KCksIGN0eC5nZXRUZXh0KCkpO1xuICAgICAgICB0aGlzLmFzc2VydFR5cGUoY3R4LCBFQ01BU2NyaXB0UGFyc2VyLk51bWVyaWNMaXRlcmFsQ29udGV4dClcbiAgICAgICAgdGhpcy5hc3NlcnROb2RlQ291bnQoY3R4LCAxKTtcbiAgICAgICAgY29uc3QgdmFsdWUgPSBjdHguZ2V0VGV4dCgpO1xuICAgICAgICAvLyBUT0RPIDogRmlndXJlIG91dCBiZXR0ZXIgd2F5XG4gICAgICAgIGNvbnN0IGxpdGVyYWwgPSBuZXcgTGl0ZXJhbChOdW1iZXIodmFsdWUpLCB2YWx1ZSk7XG4gICAgICAgIHJldHVybiB0aGlzLmRlY29yYXRlKGxpdGVyYWwsIHRoaXMuYXNNYXJrZXIodGhpcy5hc01ldGFkYXRhKGN0eC5nZXRTb3VyY2VJbnRlcnZhbCgpKSkpXG4gICAgfVxuXG4gICAgY3JlYXRlTGl0ZXJhbFZhbHVlKGN0eDogUnVsZUNvbnRleHQpOiBMaXRlcmFsIHtcbiAgICAgICAgY29uc29sZS5pbmZvKFwiY3JlYXRlTGl0ZXJhbFZhbHVlIFslc106IFslc11cIiwgY3R4LmdldENoaWxkQ291bnQoKSwgY3R4LmdldFRleHQoKSk7XG4gICAgICAgIGNvbnN0IHZhbHVlID0gY3R4LmdldFRleHQoKTtcbiAgICAgICAgY29uc3QgbGl0ZXJhbCA9IG5ldyBMaXRlcmFsKHZhbHVlLCB2YWx1ZSk7XG4gICAgICAgIHJldHVybiB0aGlzLmRlY29yYXRlKGxpdGVyYWwsIHRoaXMuYXNNYXJrZXIodGhpcy5hc01ldGFkYXRhKGN0eC5nZXRTb3VyY2VJbnRlcnZhbCgpKSkpXG4gICAgfVxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjaWRlbnRpZmllck5hbWUuXG4gICAgdmlzaXRJZGVudGlmaWVyTmFtZShjdHg6IFJ1bGVDb250ZXh0KTogSWRlbnRpZmllciB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0SWRlbnRpZmllck5hbWUgWyVzXTogWyVzXVwiLCBjdHguZ2V0Q2hpbGRDb3VudCgpLCBjdHguZ2V0VGV4dCgpKTtcbiAgICAgICAgdGhpcy5hc3NlcnRUeXBlKGN0eCwgRUNNQVNjcmlwdFBhcnNlci5JZGVudGlmaWVyTmFtZUNvbnRleHQpXG4gICAgICAgIHRoaXMuYXNzZXJ0Tm9kZUNvdW50KGN0eCwgMSk7XG4gICAgICAgIGNvbnN0IHZhbHVlID0gY3R4LmdldFRleHQoKTtcbiAgICAgICAgY29uc3QgaWRlbnRpZmllciA9IG5ldyBJZGVudGlmaWVyKHZhbHVlKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGVjb3JhdGUoaWRlbnRpZmllciwgdGhpcy5hc01hcmtlcih0aGlzLmFzTWV0YWRhdGEoY3R4LmdldFNvdXJjZUludGVydmFsKCkpKSlcbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNyZXNlcnZlZFdvcmQuXG4gICAgdmlzaXRSZXNlcnZlZFdvcmQoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJ2aXNpdFJlc2VydmVkV29yZDogXCIgKyBjdHguZ2V0VGV4dCgpKTtcbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNrZXl3b3JkLlxuICAgIHZpc2l0S2V5d29yZChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0S2V5d29yZDogXCIgKyBjdHguZ2V0VGV4dCgpKTtcblxuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjZnV0dXJlUmVzZXJ2ZWRXb3JkLlxuICAgIHZpc2l0RnV0dXJlUmVzZXJ2ZWRXb3JkKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNnZXR0ZXIuXG4gICAgdmlzaXRHZXR0ZXIoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgIH1cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNzZXR0ZXIuXG4gICAgdmlzaXRTZXR0ZXIoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2Vvcy5cbiAgICB2aXNpdEVvcyhjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIC8vY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNlb2YuXG4gICAgdmlzaXRFb2YoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgIH1cblxufSJdfQ==