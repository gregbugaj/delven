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
    const node = ctx.getChild(0);

    if (node instanceof _ECMAScriptParser.ECMAScriptParser.ExpressionStatementContext) {
      return this.visitExpressionStatement(node);
    } else if (node instanceof _ECMAScriptParser.ECMAScriptParser.VariableStatementContext) {
      return this.visitVariableStatement(node);
    } else if (node instanceof _ECMAScriptParser.ECMAScriptParser.BlockContext) {
      return this.visitBlock(node);
    } else if (node instanceof _ECMAScriptParser.ECMAScriptParser.IfStatementContext) {
      return this.visitIfStatement(node);
    } else if (node instanceof _ECMAScriptParser.ECMAScriptParser.EmptyStatementContext) {// NOOP,
      // var x;
    } else {
      this.throwInsanceError(this.dumpContext(node));
    }
  }
  /**
   * Visit a parse tree produced by ECMAScriptParser#block.
   * /// Block :
   * ///     { StatementList? }
   */


  visitBlock(ctx) {
    console.info("visitBlock [%s] : %s", ctx.getChildCount(), ctx.getText());
    this.assertType(ctx, _ECMAScriptParser.ECMAScriptParser.BlockContext);
    const body = [];

    for (let i = 1; i < ctx.getChildCount() - 1; ++i) {
      const node = ctx.getChild(i);

      if (node instanceof _ECMAScriptParser.ECMAScriptParser.StatementListContext) {
        const statementList = this.visitStatementList(node);

        for (const index in statementList) {
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
    console.info("visitExpressionStatement [%s] : %s", ctx.getChildCount(), ctx.getText());
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
  /**
   *
   *  /// IfStatement :
   * ///     if ( Expression ) Statement else Statement    => 7 Nodes
   * ///     if ( Expression ) Statement                   => 5 Nodes    
   */


  visitIfStatement(ctx) {
    console.info("visitIfStatement [%s] : %s", ctx.getChildCount(), ctx.getText());
    this.assertType(ctx, _ECMAScriptParser.ECMAScriptParser.IfStatementContext);
    const count = ctx.getChildCount();
    const test = this.visitExpressionSequence(ctx.getChild(2));
    const consequent = this.visitStatement(ctx.getChild(4));
    const alternate = count == 7 ? this.visitStatement(ctx.getChild(6)) : undefined;
    return new _nodes.IfStatement(test, consequent, alternate);
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
    } else if (node instanceof _ECMAScriptParser.ECMAScriptParser.EqualityExpressionContext) {
      return this.visitEqualityExpression(node);
    } else if (node instanceof _ECMAScriptParser.ECMAScriptParser.ParenthesizedExpressionContext) {
      return this.visitParenthesizedExpression(node);
    } else if (node instanceof _ECMAScriptParser.ECMAScriptParser.RelationalExpressionContext) {
      return this.visitRelationalExpression(node);
    } else if (node instanceof _ECMAScriptParser.ECMAScriptParser.IdentifierExpressionContext) {
      return this.visitIdentifierExpression(node);
    } else if (node instanceof _ECMAScriptParser.ECMAScriptParser.MemberDotExpressionContext) {
      return this.visitMemberDotExpression(node);
    } else if (node instanceof _ECMAScriptParser.ECMAScriptParser.MemberIndexExpressionContext) {
      return this.visitMemberIndexExpression(node);
    } else if (node instanceof _ECMAScriptParser.ECMAScriptParser.AssignmentOperatorExpressionContext) {
      return this.visitAssignmentOperatorExpression(node);
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
    console.info("visitEqualityExpression [%s] : %s", ctx.getChildCount(), ctx.getText());
    this.assertType(ctx, _ECMAScriptParser.ECMAScriptParser.EqualityExpressionContext);
    this.assertNodeCount(ctx, 3);
    let left = ctx.getChild(0);
    let operator = ctx.getChild(1).getText(); // No type ( +,- )

    let right = ctx.getChild(2);

    let lhs = this._visitBinaryExpression(left);

    let rhs = this._visitBinaryExpression(right);

    return this.decorate(new _nodes.BinaryExpression(operator, lhs, rhs), {});
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
    console.info("visitParenthesizedExpression [%s] : %s", ctx.getChildCount(), ctx.getText());
    this.assertType(ctx, _ECMAScriptParser.ECMAScriptParser.ParenthesizedExpressionContext);
    this.assertNodeCount(ctx, 3);
    let left = ctx.getChild(0);
    let expression = ctx.getChild(1);
    let right = ctx.getChild(2);
    this.dumpContextAllChildren(expression);
    return this.visitExpressionSequence(expression);
  } // Visit a parse tree produced by ECMAScriptParser#AdditiveExpression.


  visitAdditiveExpression(ctx) {
    console.info("visitAdditiveExpression [%s] : %s", ctx.getChildCount(), ctx.getText());
    this.assertType(ctx, _ECMAScriptParser.ECMAScriptParser.AdditiveExpressionContext);
    this.assertNodeCount(ctx, 3);
    const left = ctx.getChild(0);
    const operator = ctx.getChild(1).getText(); // No type ( +,- )

    const right = ctx.getChild(2);

    const lhs = this._visitBinaryExpression(left);

    const rhs = this._visitBinaryExpression(right); // return this.decorate(new BinaryExpression(operator, lhs ,rhs), this.asMarker(this.asMetadata(ctx.symbol)));


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
    } else if (ctx instanceof _ECMAScriptParser.ECMAScriptParser.RelationalExpressionContext) {
      return this.visitRelationalExpression(ctx);
    }

    this.throwInsanceError(this.dumpContext(ctx));
  } // Visit a parse tree produced by ECMAScriptParser#RelationalExpression.


  visitRelationalExpression(ctx) {
    console.info("visitRelationalExpression [%s] : %s", ctx.getChildCount(), ctx.getText());
    this.assertType(ctx, _ECMAScriptParser.ECMAScriptParser.RelationalExpressionContext);
    this.assertNodeCount(ctx, 3);
    const left = ctx.getChild(0);
    const operator = ctx.getChild(1).getText(); // No type ( +,- )

    const right = ctx.getChild(2);

    const lhs = this._visitBinaryExpression(left);

    const rhs = this._visitBinaryExpression(right); // return this.decorate(new BinaryExpression(operator, lhs ,rhs), this.asMarker(this.asMetadata(ctx.symbol)));


    return new _nodes.BinaryExpression(operator, lhs, rhs);
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
  }
  /**
   * // computed = false `x.z`
   * // computed = true `y[1]`
   * // Visit a parse tree produced by ECMAScriptParser#MemberDotExpression.
   */


  visitMemberDotExpression(ctx) {
    console.info("visitArrayLiteralExpression [%s] : %s", ctx.getChildCount(), ctx.getText());
    this.assertType(ctx, _ECMAScriptParser.ECMAScriptParser.MemberDotExpressionContext);
    this.assertNodeCount(ctx, 3);
    const expr = this.singleExpression(ctx.getChild(0));
    const property = this.visitIdentifierName(ctx.getChild(2));
    return new _nodes.StaticMemberExpression(expr, property);
  }

  print(ctx) {
    console.info(" *****  ");
    const visitor = new _PrintVisitor.PrintVisitor();
    ctx.accept(visitor);
  } // Visit a parse tree produced by ECMAScriptParser#MemberIndexExpression.


  visitMemberIndexExpression(ctx) {
    console.info("visitMemberIndexExpression [%s] : %s", ctx.getChildCount(), ctx.getText());
    this.assertType(ctx, _ECMAScriptParser.ECMAScriptParser.MemberIndexExpressionContext);
    this.assertNodeCount(ctx, 4);
    const expr = this.singleExpression(ctx.getChild(0));
    const property = this.visitExpressionSequence(ctx.getChild(2));
    return new _nodes.ComputedMemberExpression(expr, property);
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
    console.info("visitAssignmentOperatorExpression [%s] : %s", ctx.getChildCount(), ctx.getText());
    this.assertType(ctx, _ECMAScriptParser.ECMAScriptParser.AssignmentOperatorExpressionContext);
    this.assertNodeCount(ctx, 3);
    const lhs = this.singleExpression(ctx.getChild(0));
    const operator = ctx.getChild(1).getText();
    const rhs = this.visitExpressionSequence(ctx.getChild(2));
    return this.decorate(new _nodes.AssignmentExpression(operator, lhs, rhs));
  } // Visit a parse tree produced by ECMAScriptParser#VoidExpression.


  visitVoidExpression(ctx) {
    console.trace('not implemented');
  } // Visit a parse tree produced by ECMAScriptParser#assignmentOperator.


  visitAssignmentOperator(ctx) {
    console.info("visitAssignmentOperator [%s] : [%s]", ctx.getChildCount(), ctx.getText());
  } // Visit a parse tree produced by ECMAScriptParser#literal.


  visitLiteral(ctx) {
    console.info("visitLiteral [%s] : [%s]", ctx.getChildCount(), ctx.getText());
    this.assertType(ctx, _ECMAScriptParser.ECMAScriptParser.LiteralContext);
    this.assertNodeCount(ctx, 1);
    const node = ctx.getChild(0);

    if (node.getChildCount() == 0) {
      return this.createLiteralValue(node);
    } else if (node.getChildCount() == 1) {
      if (node instanceof _ECMAScriptParser.ECMAScriptParser.NumericLiteralContext) {
        return this.visitNumericLiteral(node);
      }

      this.throwInsanceError(this.dumpContext(node));
    }

    this.throwInsanceError(this.dumpContext(node));
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9BU1RQYXJzZXIudHMiXSwibmFtZXMiOlsiUGFyc2VyVHlwZSIsIkFTVFBhcnNlciIsImNvbnN0cnVjdG9yIiwidmlzaXRvciIsIkRlbHZlbkFTVFZpc2l0b3IiLCJnZW5lcmF0ZSIsInNvdXJjZSIsImNvZGUiLCJ0eXBlIiwidmFsdWUiLCJmcyIsInJlYWRGaWxlU3luYyIsImNoYXJzIiwiYW50bHI0IiwiSW5wdXRTdHJlYW0iLCJsZXhlciIsIkRlbHZlbkxleGVyIiwidG9rZW5zIiwiQ29tbW9uVG9rZW5TdHJlYW0iLCJwYXJzZXIiLCJEZWx2ZW5QYXJzZXIiLCJ0cmVlIiwicHJvZ3JhbSIsImFjY2VwdCIsIlByaW50VmlzaXRvciIsImNvbnNvbGUiLCJpbmZvIiwicmVzdWx0IiwicGFyc2UiLCJFQ01BU2NyaXB0IiwiQVNUUGFyc2VyRGVmYXVsdCIsIkVycm9yIiwiRGVsdmVuVmlzaXRvciIsInJ1bGVUeXBlTWFwIiwiTWFwIiwic2V0dXBUeXBlUnVsZXMiLCJrZXlzIiwiT2JqZWN0IiwiZ2V0T3duUHJvcGVydHlOYW1lcyIsIkVDTUFTY3JpcHRQYXJzZXIiLCJrZXkiLCJuYW1lIiwic3RhcnRzV2l0aCIsInNldCIsInBhcnNlSW50IiwiZHVtcENvbnRleHQiLCJjdHgiLCJjb250ZXh0IiwiZW5kc1dpdGgiLCJwdXNoIiwibGVuZ3RoIiwiY29udGV4dE5hbWUiLCJsb25nZXN0Iiwib2JqIiwiY2hhaW4iLCJwcm90b3R5cGUiLCJfX3Byb3RvX18iLCJkdW1wQ29udGV4dEFsbENoaWxkcmVuIiwiaW5kZW50IiwicGFkIiwicGFkU3RhcnQiLCJub2RlcyIsIm1hcmtlciIsImkiLCJnZXRDaGlsZENvdW50IiwiY2hpbGQiLCJnZXRDaGlsZCIsImdldFJ1bGVCeUlkIiwiaWQiLCJnZXQiLCJhc01hcmtlciIsIm1ldGFkYXRhIiwiaW5kZXgiLCJsaW5lIiwiY29sdW1uIiwiZGVjb3JhdGUiLCJub2RlIiwic3RhcnQiLCJlbmQiLCJhc01ldGFkYXRhIiwiaW50ZXJ2YWwiLCJvZmZzZXQiLCJzdG9wIiwidGhyb3dUeXBlRXJyb3IiLCJ0eXBlSWQiLCJUeXBlRXJyb3IiLCJ0aHJvd0luc2FuY2VFcnJvciIsImFzc2VydFR5cGUiLCJ2aXNpdFByb2dyYW0iLCJnZXRUZXh0Iiwic3RhdGVtZW50cyIsInN0bSIsIlN0YXRlbWVudENvbnRleHQiLCJzdGF0ZW1lbnQiLCJ2aXNpdFN0YXRlbWVudCIsImdldFNvdXJjZUludGVydmFsIiwic2NyaXB0IiwiU2NyaXB0IiwiRXhwcmVzc2lvblN0YXRlbWVudENvbnRleHQiLCJ2aXNpdEV4cHJlc3Npb25TdGF0ZW1lbnQiLCJWYXJpYWJsZVN0YXRlbWVudENvbnRleHQiLCJ2aXNpdFZhcmlhYmxlU3RhdGVtZW50IiwiQmxvY2tDb250ZXh0IiwidmlzaXRCbG9jayIsIklmU3RhdGVtZW50Q29udGV4dCIsInZpc2l0SWZTdGF0ZW1lbnQiLCJFbXB0eVN0YXRlbWVudENvbnRleHQiLCJib2R5IiwiU3RhdGVtZW50TGlzdENvbnRleHQiLCJzdGF0ZW1lbnRMaXN0IiwidmlzaXRTdGF0ZW1lbnRMaXN0IiwiQmxvY2tTdGF0ZW1lbnQiLCJydWxlSW5kZXgiLCJSVUxFX3N0YXRlbWVudCIsInVuZGVmaW5lZCIsImFzc2VydE5vZGVDb3VudCIsIm4wIiwibjEiLCJuMiIsImRlY2xhcmF0aW9ucyIsInZpc2l0VmFyaWFibGVEZWNsYXJhdGlvbkxpc3QiLCJraW5kIiwiVmFyaWFibGVEZWNsYXJhdGlvbiIsIlZhcmlhYmxlRGVjbGFyYXRpb25MaXN0Q29udGV4dCIsImZpbHRlclN5bWJvbHMiLCJmb3JFYWNoIiwiVmFyaWFibGVEZWNsYXJhdGlvbkNvbnRleHQiLCJkZWNsYXJhdGlvbiIsInZpc2l0VmFyaWFibGVEZWNsYXJhdGlvbiIsInRleHQiLCJJZGVudGlmaWVyIiwiaW5pdCIsInZpc2l0SW5pdGlhbGlzZXIiLCJWYXJpYWJsZURlY2xhcmF0b3IiLCJJbml0aWFsaXNlckNvbnRleHQiLCJPYmplY3RMaXRlcmFsRXhwcmVzc2lvbkNvbnRleHQiLCJ2aXNpdE9iamVjdExpdGVyYWxFeHByZXNzaW9uIiwiQXJyYXlMaXRlcmFsRXhwcmVzc2lvbkNvbnRleHQiLCJ2aXNpdEFycmF5TGl0ZXJhbEV4cHJlc3Npb24iLCJ2aXNpdEVtcHR5U3RhdGVtZW50IiwiZ2V0UnVsZVR5cGUiLCJjb3VudCIsImV4cCIsIkV4cHJlc3Npb25TZXF1ZW5jZUNvbnRleHQiLCJ2aXNpdEV4cHJlc3Npb25TZXF1ZW5jZSIsInRlc3QiLCJjb25zZXF1ZW50IiwiYWx0ZXJuYXRlIiwiSWZTdGF0ZW1lbnQiLCJ2aXNpdERvU3RhdGVtZW50IiwidmlzaXRXaGlsZVN0YXRlbWVudCIsInZpc2l0Rm9yU3RhdGVtZW50IiwidmlzaXRGb3JWYXJTdGF0ZW1lbnQiLCJ0cmFjZSIsInZpc2l0Rm9ySW5TdGF0ZW1lbnQiLCJ2aXNpdEZvclZhckluU3RhdGVtZW50IiwidmlzaXRDb250aW51ZVN0YXRlbWVudCIsInZpc2l0QnJlYWtTdGF0ZW1lbnQiLCJ2aXNpdFJldHVyblN0YXRlbWVudCIsInZpc2l0V2l0aFN0YXRlbWVudCIsInZpc2l0U3dpdGNoU3RhdGVtZW50IiwidmlzaXRDYXNlQmxvY2siLCJ2aXNpdENhc2VDbGF1c2VzIiwidmlzaXRDYXNlQ2xhdXNlIiwidmlzaXREZWZhdWx0Q2xhdXNlIiwidmlzaXRMYWJlbGxlZFN0YXRlbWVudCIsInZpc2l0VGhyb3dTdGF0ZW1lbnQiLCJ2aXNpdFRyeVN0YXRlbWVudCIsInZpc2l0Q2F0Y2hQcm9kdWN0aW9uIiwidmlzaXRGaW5hbGx5UHJvZHVjdGlvbiIsInZpc2l0RGVidWdnZXJTdGF0ZW1lbnQiLCJ2aXNpdEZ1bmN0aW9uRGVjbGFyYXRpb24iLCJ2aXNpdEZvcm1hbFBhcmFtZXRlckxpc3QiLCJ2aXNpdEZ1bmN0aW9uQm9keSIsInZpc2l0QXJyYXlMaXRlcmFsIiwiQXJyYXlMaXRlcmFsQ29udGV4dCIsInJlc3VsdHMiLCJFbGVtZW50TGlzdENvbnRleHQiLCJ2aXNpdEVsZW1lbnRMaXN0IiwiRWxpc2lvbkNvbnRleHQiLCJ2aXNpdEVsaXNpb24iLCJzeW1ib2wiLCJlbGVtZW50cyIsImVsZW0iLCJzaW5nbGVFeHByZXNzaW9uIiwiZWxpc2lvbiIsInZpc2l0T2JqZWN0TGl0ZXJhbCIsIk9iamVjdExpdGVyYWxDb250ZXh0IiwiUHJvcGVydHlOYW1lQW5kVmFsdWVMaXN0Q29udGV4dCIsInZpc2l0UHJvcGVydHlOYW1lQW5kVmFsdWVMaXN0IiwicHJvcGVydGllcyIsIlByb3BlcnR5RXhwcmVzc2lvbkFzc2lnbm1lbnRDb250ZXh0IiwicHJvcGVydHkiLCJ2aXNpdFByb3BlcnR5RXhwcmVzc2lvbkFzc2lnbm1lbnQiLCJmaWx0ZXJlZCIsInZpc2l0UHJvcGVydHlOYW1lIiwiY29tcHV0ZWQiLCJtZXRob2QiLCJzaG9ydGhhbmQiLCJQcm9wZXJ0eSIsInZpc2l0UHJvcGVydHlHZXR0ZXIiLCJ2aXNpdFByb3BlcnR5U2V0dGVyIiwiUHJvcGVydHlOYW1lQ29udGV4dCIsImNyZWF0ZUxpdGVyYWxWYWx1ZSIsInZpc2l0SWRlbnRpZmllck5hbWUiLCJ2aXNpdFByb3BlcnR5U2V0UGFyYW1ldGVyTGlzdCIsInZpc2l0QXJndW1lbnRzIiwidmlzaXRBcmd1bWVudExpc3QiLCJleHByZXNzaW9ucyIsIkV4cHJlc3Npb25TdGF0ZW1lbnQiLCJTZXF1ZW5jZUV4cHJlc3Npb24iLCJMaXRlcmFsRXhwcmVzc2lvbkNvbnRleHQiLCJ2aXNpdExpdGVyYWxFeHByZXNzaW9uIiwiQXNzaWdubWVudEV4cHJlc3Npb25Db250ZXh0IiwidmlzaXRBc3NpZ25tZW50RXhwcmVzc2lvbiIsIkFkZGl0aXZlRXhwcmVzc2lvbkNvbnRleHQiLCJ2aXNpdEFkZGl0aXZlRXhwcmVzc2lvbiIsIk11bHRpcGxpY2F0aXZlRXhwcmVzc2lvbkNvbnRleHQiLCJ2aXNpdE11bHRpcGxpY2F0aXZlRXhwcmVzc2lvbiIsIkVxdWFsaXR5RXhwcmVzc2lvbkNvbnRleHQiLCJ2aXNpdEVxdWFsaXR5RXhwcmVzc2lvbiIsIlBhcmVudGhlc2l6ZWRFeHByZXNzaW9uQ29udGV4dCIsInZpc2l0UGFyZW50aGVzaXplZEV4cHJlc3Npb24iLCJSZWxhdGlvbmFsRXhwcmVzc2lvbkNvbnRleHQiLCJ2aXNpdFJlbGF0aW9uYWxFeHByZXNzaW9uIiwiSWRlbnRpZmllckV4cHJlc3Npb25Db250ZXh0IiwidmlzaXRJZGVudGlmaWVyRXhwcmVzc2lvbiIsIk1lbWJlckRvdEV4cHJlc3Npb25Db250ZXh0IiwidmlzaXRNZW1iZXJEb3RFeHByZXNzaW9uIiwiTWVtYmVySW5kZXhFeHByZXNzaW9uQ29udGV4dCIsInZpc2l0TWVtYmVySW5kZXhFeHByZXNzaW9uIiwiQXNzaWdubWVudE9wZXJhdG9yRXhwcmVzc2lvbkNvbnRleHQiLCJ2aXNpdEFzc2lnbm1lbnRPcGVyYXRvckV4cHJlc3Npb24iLCJ2aXNpdFRlcm5hcnlFeHByZXNzaW9uIiwidmlzaXRMb2dpY2FsQW5kRXhwcmVzc2lvbiIsInZpc2l0UHJlSW5jcmVtZW50RXhwcmVzc2lvbiIsIk9iamVjdEV4cHJlc3Npb24iLCJ2aXNpdEluRXhwcmVzc2lvbiIsInZpc2l0TG9naWNhbE9yRXhwcmVzc2lvbiIsInZpc2l0Tm90RXhwcmVzc2lvbiIsInZpc2l0UHJlRGVjcmVhc2VFeHByZXNzaW9uIiwidmlzaXRBcmd1bWVudHNFeHByZXNzaW9uIiwidmlzaXRUaGlzRXhwcmVzc2lvbiIsInZpc2l0RnVuY3Rpb25FeHByZXNzaW9uIiwidmlzaXRVbmFyeU1pbnVzRXhwcmVzc2lvbiIsInZpc2l0UG9zdERlY3JlYXNlRXhwcmVzc2lvbiIsImluaXRpYWxpc2VyIiwib3BlcmF0b3IiLCJleHByZXNzaW9uIiwibGhzIiwicmhzIiwiQXNzaWdubWVudEV4cHJlc3Npb24iLCJ2aXNpdFR5cGVvZkV4cHJlc3Npb24iLCJ2aXNpdEluc3RhbmNlb2ZFeHByZXNzaW9uIiwidmlzaXRVbmFyeVBsdXNFeHByZXNzaW9uIiwidmlzaXREZWxldGVFeHByZXNzaW9uIiwibGVmdCIsInJpZ2h0IiwiX3Zpc2l0QmluYXJ5RXhwcmVzc2lvbiIsIkJpbmFyeUV4cHJlc3Npb24iLCJ2aXNpdEJpdFhPckV4cHJlc3Npb24iLCJ2aXNpdEJpbmFyeUV4cHJlc3Npb24iLCJ2aXNpdEJpdFNoaWZ0RXhwcmVzc2lvbiIsInZpc2l0UG9zdEluY3JlbWVudEV4cHJlc3Npb24iLCJ2aXNpdEJpdE5vdEV4cHJlc3Npb24iLCJ2aXNpdE5ld0V4cHJlc3Npb24iLCJMaXRlcmFsQ29udGV4dCIsInZpc2l0TGl0ZXJhbCIsIk51bWVyaWNMaXRlcmFsQ29udGV4dCIsInZpc2l0TnVtZXJpY0xpdGVyYWwiLCJBcnJheUV4cHJlc3Npb24iLCJleHByIiwiU3RhdGljTWVtYmVyRXhwcmVzc2lvbiIsInByaW50IiwiQ29tcHV0ZWRNZW1iZXJFeHByZXNzaW9uIiwidmlzaXRCaXRBbmRFeHByZXNzaW9uIiwidmlzaXRCaXRPckV4cHJlc3Npb24iLCJ2aXNpdFZvaWRFeHByZXNzaW9uIiwidmlzaXRBc3NpZ25tZW50T3BlcmF0b3IiLCJsaXRlcmFsIiwiTGl0ZXJhbCIsIk51bWJlciIsIklkZW50aWZpZXJOYW1lQ29udGV4dCIsImlkZW50aWZpZXIiLCJ2aXNpdFJlc2VydmVkV29yZCIsInZpc2l0S2V5d29yZCIsInZpc2l0RnV0dXJlUmVzZXJ2ZWRXb3JkIiwidmlzaXRHZXR0ZXIiLCJ2aXNpdFNldHRlciIsInZpc2l0RW9zIiwidmlzaXRFb2YiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFFQTs7QUFFQTs7QUFHQTs7Ozs7O0FBR0E7Ozs7Ozs7O0lBUVlBLFU7OztXQUFBQSxVO0FBQUFBLEVBQUFBLFUsQ0FBQUEsVTtHQUFBQSxVLDBCQUFBQSxVOztBQVlHLE1BQWVDLFNBQWYsQ0FBeUI7QUFHcENDLEVBQUFBLFdBQVcsQ0FBQ0MsT0FBRCxFQUE2QjtBQUNwQyxTQUFLQSxPQUFMLEdBQWVBLE9BQU8sSUFBSSxJQUFJQyxnQkFBSixFQUExQjtBQUNIOztBQUVEQyxFQUFBQSxRQUFRLENBQUNDLE1BQUQsRUFBOEI7QUFDbEMsUUFBSUMsSUFBSjs7QUFDQSxZQUFRRCxNQUFNLENBQUNFLElBQWY7QUFDSSxXQUFLLE1BQUw7QUFDSUQsUUFBQUEsSUFBSSxHQUFHRCxNQUFNLENBQUNHLEtBQWQ7QUFDQTs7QUFDSixXQUFLLFVBQUw7QUFDSUYsUUFBQUEsSUFBSSxHQUFHRyxFQUFFLENBQUNDLFlBQUgsQ0FBZ0JMLE1BQU0sQ0FBQ0csS0FBdkIsRUFBOEIsTUFBOUIsQ0FBUDtBQUNBO0FBTlI7O0FBU0EsUUFBSUcsS0FBSyxHQUFHLElBQUlDLE1BQU0sQ0FBQ0MsV0FBWCxDQUF1QlAsSUFBdkIsQ0FBWjtBQUNBLFFBQUlRLEtBQUssR0FBRyxJQUFJQyxnQ0FBSixDQUFnQkosS0FBaEIsQ0FBWjtBQUNBLFFBQUlLLE1BQU0sR0FBRyxJQUFJSixNQUFNLENBQUNLLGlCQUFYLENBQTZCSCxLQUE3QixDQUFiO0FBQ0EsUUFBSUksTUFBTSxHQUFHLElBQUlDLGtDQUFKLENBQWlCSCxNQUFqQixDQUFiO0FBQ0EsUUFBSUksSUFBSSxHQUFHRixNQUFNLENBQUNHLE9BQVAsRUFBWCxDQWZrQyxDQWdCbEM7O0FBQ0FELElBQUFBLElBQUksQ0FBQ0UsTUFBTCxDQUFZLElBQUlDLDBCQUFKLEVBQVo7QUFDQUMsSUFBQUEsT0FBTyxDQUFDQyxJQUFSLENBQWEsdUJBQWI7QUFDQSxRQUFJQyxNQUFNLEdBQUdOLElBQUksQ0FBQ0UsTUFBTCxDQUFZLEtBQUtwQixPQUFqQixDQUFiO0FBQ0EsV0FBT3dCLE1BQVA7QUFDSDtBQUVEOzs7Ozs7O0FBS0EsU0FBT0MsS0FBUCxDQUFhdEIsTUFBYixFQUFpQ0UsSUFBakMsRUFBNkQ7QUFDekQsUUFBSUEsSUFBSSxJQUFJLElBQVosRUFDSUEsSUFBSSxHQUFHUixVQUFVLENBQUM2QixVQUFsQjtBQUNKLFFBQUlWLE1BQUo7O0FBQ0EsWUFBUVgsSUFBUjtBQUNJLFdBQUtSLFVBQVUsQ0FBQzZCLFVBQWhCO0FBQ0lWLFFBQUFBLE1BQU0sR0FBRyxJQUFJVyxnQkFBSixFQUFUO0FBQ0E7O0FBQ0o7QUFDSSxjQUFNLElBQUlDLEtBQUosQ0FBVSxvQkFBVixDQUFOO0FBTFI7O0FBUUEsV0FBT1osTUFBTSxDQUFDZCxRQUFQLENBQWdCQyxNQUFoQixDQUFQO0FBQ0g7O0FBaERtQzs7OztBQW1EeEMsTUFBTXdCLGdCQUFOLFNBQStCN0IsU0FBL0IsQ0FBeUM7O0FBSWxDLE1BQU1HLGdCQUFOLFNBQStCNEIsb0NBQS9CLENBQTZDO0FBQ3hDQyxFQUFBQSxXQUFSLEdBQTJDLElBQUlDLEdBQUosRUFBM0M7O0FBRUFoQyxFQUFBQSxXQUFXLEdBQUc7QUFDVjtBQUNBLFNBQUtpQyxjQUFMO0FBQ0g7O0FBRU9BLEVBQUFBLGNBQVIsR0FBeUI7QUFDckIsVUFBTUMsSUFBSSxHQUFHQyxNQUFNLENBQUNDLG1CQUFQLENBQTJCQyxrQ0FBM0IsQ0FBYjs7QUFDQSxTQUFLLElBQUlDLEdBQVQsSUFBZ0JKLElBQWhCLEVBQXNCO0FBQ2xCLFVBQUlLLElBQUksR0FBR0wsSUFBSSxDQUFDSSxHQUFELENBQWY7O0FBQ0EsVUFBSUMsSUFBSSxDQUFDQyxVQUFMLENBQWdCLE9BQWhCLENBQUosRUFBOEI7QUFDMUIsYUFBS1QsV0FBTCxDQUFpQlUsR0FBakIsQ0FBcUJDLFFBQVEsQ0FBQ0wsbUNBQWlCRSxJQUFqQixDQUFELENBQTdCLEVBQXVEQSxJQUF2RDtBQUNIO0FBQ0o7QUFDSjs7QUFFT0ksRUFBQUEsV0FBUixDQUFvQkMsR0FBcEIsRUFBc0M7QUFDbEMsVUFBTVYsSUFBSSxHQUFHQyxNQUFNLENBQUNDLG1CQUFQLENBQTJCQyxrQ0FBM0IsQ0FBYjtBQUNBLFFBQUlRLE9BQU8sR0FBRyxFQUFkOztBQUNBLFNBQUssSUFBSVAsR0FBVCxJQUFnQkosSUFBaEIsRUFBc0I7QUFDbEIsVUFBSUssSUFBSSxHQUFHTCxJQUFJLENBQUNJLEdBQUQsQ0FBZixDQURrQixDQUVsQjs7QUFDQSxVQUFJQyxJQUFJLENBQUNPLFFBQUwsQ0FBYyxTQUFkLENBQUosRUFBOEI7QUFDMUIsWUFBSUYsR0FBRyxZQUFZUCxtQ0FBaUJFLElBQWpCLENBQW5CLEVBQTJDO0FBQ3ZDTSxVQUFBQSxPQUFPLENBQUNFLElBQVIsQ0FBYVIsSUFBYjtBQUNIO0FBQ0o7QUFDSixLQVhpQyxDQWFsQztBQUNBO0FBQ0E7QUFDQTs7QUFDQTs7Ozs7Ozs7Ozs7QUFTQSxRQUFJTSxPQUFPLENBQUNHLE1BQVIsR0FBaUIsQ0FBckIsRUFBd0I7QUFDcEIsVUFBSUMsV0FBSjtBQUNBLFVBQUlDLE9BQU8sR0FBRyxDQUFkOztBQUNBLFdBQUssTUFBTVosR0FBWCxJQUFrQk8sT0FBbEIsRUFBMkI7QUFDdkIsY0FBTU4sSUFBSSxHQUFHTSxPQUFPLENBQUNQLEdBQUQsQ0FBcEI7QUFDQSxZQUFJYSxHQUFHLEdBQUdkLG1DQUFpQkUsSUFBakIsQ0FBVjtBQUNBLFlBQUlhLEtBQUssR0FBRyxDQUFaOztBQUNBLFdBQUc7QUFDQyxZQUFFQSxLQUFGO0FBQ0FELFVBQUFBLEdBQUcsR0FBR2QsbUNBQWlCYyxHQUFHLENBQUNFLFNBQUosQ0FBY0MsU0FBZCxDQUF3QnRELFdBQXhCLENBQW9DdUMsSUFBckQsQ0FBTjtBQUNILFNBSEQsUUFHU1ksR0FBRyxJQUFJQSxHQUFHLENBQUNFLFNBSHBCOztBQUlBLFlBQUlELEtBQUssR0FBR0YsT0FBWixFQUFxQjtBQUNqQkEsVUFBQUEsT0FBTyxHQUFHRSxLQUFWO0FBQ0FILFVBQUFBLFdBQVcsR0FBSSxHQUFFVixJQUFLLFNBQVFhLEtBQU0sR0FBcEM7QUFDSDtBQUNKOztBQUNELGFBQU8sQ0FBQ0gsV0FBRCxDQUFQO0FBQ0g7O0FBQ0QsV0FBT0osT0FBUDtBQUNIOztBQUVPVSxFQUFBQSxzQkFBUixDQUErQlgsR0FBL0IsRUFBaURZLE1BQWMsR0FBRyxDQUFsRSxFQUFxRTtBQUNqRSxVQUFNQyxHQUFHLEdBQUcsSUFBSUMsUUFBSixDQUFhRixNQUFiLEVBQXFCLElBQXJCLENBQVo7QUFDQSxVQUFNRyxLQUFLLEdBQUcsS0FBS2hCLFdBQUwsQ0FBaUJDLEdBQWpCLENBQWQ7O0FBQ0EsUUFBSWUsS0FBSyxDQUFDWCxNQUFOLEdBQWUsQ0FBbkIsRUFBc0I7QUFDbEIsWUFBTVksTUFBTSxHQUFHSixNQUFNLElBQUksQ0FBVixHQUFjLEtBQWQsR0FBc0IsS0FBckM7QUFDQWpDLE1BQUFBLE9BQU8sQ0FBQ0MsSUFBUixDQUFhaUMsR0FBRyxHQUFHRyxNQUFOLEdBQWVELEtBQTVCO0FBQ0g7O0FBQ0QsU0FBSyxJQUFJRSxDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHakIsR0FBRyxDQUFDa0IsYUFBSixFQUFwQixFQUF5QyxFQUFFRCxDQUEzQyxFQUE4QztBQUMxQyxVQUFJRSxLQUFLLEdBQUduQixHQUFILGFBQUdBLEdBQUgsdUJBQUdBLEdBQUcsQ0FBRW9CLFFBQUwsQ0FBY0gsQ0FBZCxDQUFaOztBQUNBLFVBQUlFLEtBQUosRUFBVztBQUNQLGFBQUtSLHNCQUFMLENBQTRCUSxLQUE1QixFQUFtQyxFQUFFUCxNQUFyQztBQUNBLFVBQUVBLE1BQUY7QUFDSDtBQUNKO0FBQ0o7QUFFRDs7Ozs7O0FBSUFTLEVBQUFBLFdBQVcsQ0FBQ0MsRUFBRCxFQUFpQztBQUN4QyxXQUFPLEtBQUtuQyxXQUFMLENBQWlCb0MsR0FBakIsQ0FBcUJELEVBQXJCLENBQVA7QUFDSDs7QUFFT0UsRUFBQUEsUUFBUixDQUFpQkMsUUFBakIsRUFBZ0M7QUFDNUIsV0FBTztBQUFFQyxNQUFBQSxLQUFLLEVBQUUsQ0FBVDtBQUFZQyxNQUFBQSxJQUFJLEVBQUUsQ0FBbEI7QUFBcUJDLE1BQUFBLE1BQU0sRUFBRTtBQUE3QixLQUFQO0FBQ0g7O0FBRU9DLEVBQUFBLFFBQVIsQ0FBaUJDLElBQWpCLEVBQTRCZCxNQUE1QixFQUFpRDtBQUM3Q2MsSUFBQUEsSUFBSSxDQUFDQyxLQUFMLEdBQWEsQ0FBYjtBQUNBRCxJQUFBQSxJQUFJLENBQUNFLEdBQUwsR0FBVyxDQUFYO0FBQ0EsV0FBT0YsSUFBUDtBQUNIOztBQUVPRyxFQUFBQSxVQUFSLENBQW1CQyxRQUFuQixFQUE0QztBQUN4QyxXQUFPO0FBQ0hILE1BQUFBLEtBQUssRUFBRTtBQUNISixRQUFBQSxJQUFJLEVBQUUsQ0FESDtBQUVIQyxRQUFBQSxNQUFNLEVBQUVNLFFBQVEsQ0FBQ0gsS0FGZDtBQUdISSxRQUFBQSxNQUFNLEVBQUU7QUFITCxPQURKO0FBTUhILE1BQUFBLEdBQUcsRUFBRTtBQUNETCxRQUFBQSxJQUFJLEVBQUUsQ0FETDtBQUVEQyxRQUFBQSxNQUFNLEVBQUVNLFFBQVEsQ0FBQ0UsSUFGaEI7QUFHREQsUUFBQUEsTUFBTSxFQUFFO0FBSFA7QUFORixLQUFQO0FBWUg7O0FBRU9FLEVBQUFBLGNBQVIsQ0FBdUJDLE1BQXZCLEVBQW9DO0FBQ2hDLFVBQU0sSUFBSUMsU0FBSixDQUFjLHNCQUFzQkQsTUFBdEIsR0FBK0IsS0FBL0IsR0FBdUMsS0FBS2pCLFdBQUwsQ0FBaUJpQixNQUFqQixDQUFyRCxDQUFOO0FBQ0g7QUFFRDs7Ozs7OztBQUtRRSxFQUFBQSxpQkFBUixDQUEwQjlFLElBQTFCLEVBQTJDO0FBQ3ZDOzs7QUFHQSxVQUFNLElBQUk2RSxTQUFKLENBQWMsK0JBQStCN0UsSUFBN0MsQ0FBTjtBQUNIOztBQUVPK0UsRUFBQUEsVUFBUixDQUFtQnpDLEdBQW5CLEVBQXFDdEMsSUFBckMsRUFBc0Q7QUFDbEQsUUFBSSxFQUFFc0MsR0FBRyxZQUFZdEMsSUFBakIsQ0FBSixFQUE0QjtBQUN4QixZQUFNLElBQUk2RSxTQUFKLENBQWMsOEJBQThCN0UsSUFBSSxDQUFDaUMsSUFBbkMsR0FBMEMsY0FBMUMsR0FBMkQsS0FBS0ksV0FBTCxDQUFpQkMsR0FBakIsQ0FBekUsSUFBa0csR0FBeEc7QUFDSDtBQUNKLEdBdEkrQyxDQXdJaEQ7OztBQUNBMEMsRUFBQUEsWUFBWSxDQUFDMUMsR0FBRCxFQUErQztBQUN2RHJCLElBQUFBLE9BQU8sQ0FBQ0MsSUFBUixDQUFhLHdCQUFiLEVBQXVDb0IsR0FBRyxDQUFDa0IsYUFBSixFQUF2QyxFQUE0RGxCLEdBQUcsQ0FBQzJDLE9BQUosRUFBNUQsRUFEdUQsQ0FFdkQ7O0FBQ0EsUUFBSUMsVUFBZSxHQUFHLEVBQXRCO0FBQ0EsUUFBSWQsSUFBSSxHQUFHOUIsR0FBRyxDQUFDb0IsUUFBSixDQUFhLENBQWIsQ0FBWCxDQUp1RCxDQUkxQjs7QUFDN0IsU0FBSyxJQUFJSCxDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHYSxJQUFJLENBQUNaLGFBQUwsRUFBcEIsRUFBMEMsRUFBRUQsQ0FBNUMsRUFBK0M7QUFDM0MsVUFBSTRCLEdBQUcsR0FBR2YsSUFBSSxDQUFDVixRQUFMLENBQWNILENBQWQsRUFBaUJHLFFBQWpCLENBQTBCLENBQTFCLENBQVYsQ0FEMkMsQ0FDSDs7QUFDeEMsVUFBSXlCLEdBQUcsWUFBWXBELG1DQUFpQnFELGdCQUFwQyxFQUFzRDtBQUNsRCxZQUFJQyxTQUFTLEdBQUcsS0FBS0MsY0FBTCxDQUFvQkgsR0FBcEIsQ0FBaEI7QUFDQUQsUUFBQUEsVUFBVSxDQUFDekMsSUFBWCxDQUFnQjRDLFNBQWhCO0FBQ0gsT0FIRCxNQUdPO0FBQ0gsYUFBS1AsaUJBQUwsQ0FBdUIsS0FBS3pDLFdBQUwsQ0FBaUI4QyxHQUFqQixDQUF2QjtBQUNIO0FBQ0o7O0FBQ0QsUUFBSVgsUUFBUSxHQUFHbEMsR0FBRyxDQUFDaUQsaUJBQUosRUFBZjtBQUNBLFFBQUlDLE1BQU0sR0FBRyxJQUFJQyxhQUFKLENBQVdQLFVBQVgsQ0FBYjtBQUNBLFdBQU8sS0FBS2YsUUFBTCxDQUFjcUIsTUFBZCxFQUFzQixLQUFLMUIsUUFBTCxDQUFjLEtBQUtTLFVBQUwsQ0FBZ0JDLFFBQWhCLENBQWQsQ0FBdEIsQ0FBUDtBQUNILEdBMUorQyxDQTRKaEQ7OztBQUNBYyxFQUFBQSxjQUFjLENBQUNoRCxHQUFELEVBQXlCO0FBQ25DLFNBQUt5QyxVQUFMLENBQWdCekMsR0FBaEIsRUFBcUJQLG1DQUFpQnFELGdCQUF0QztBQUNBbkUsSUFBQUEsT0FBTyxDQUFDQyxJQUFSLENBQWEsMEJBQWIsRUFBeUNvQixHQUFHLENBQUNrQixhQUFKLEVBQXpDLEVBQThEbEIsR0FBRyxDQUFDMkMsT0FBSixFQUE5RDtBQUNBLFVBQU1iLElBQWlCLEdBQUc5QixHQUFHLENBQUNvQixRQUFKLENBQWEsQ0FBYixDQUExQjs7QUFFQSxRQUFJVSxJQUFJLFlBQVlyQyxtQ0FBaUIyRCwwQkFBckMsRUFBaUU7QUFDN0QsYUFBTyxLQUFLQyx3QkFBTCxDQUE4QnZCLElBQTlCLENBQVA7QUFDSCxLQUZELE1BRU8sSUFBSUEsSUFBSSxZQUFZckMsbUNBQWlCNkQsd0JBQXJDLEVBQStEO0FBQ2xFLGFBQU8sS0FBS0Msc0JBQUwsQ0FBNEJ6QixJQUE1QixDQUFQO0FBQ0gsS0FGTSxNQUVBLElBQUlBLElBQUksWUFBWXJDLG1DQUFpQitELFlBQXJDLEVBQW1EO0FBQ3RELGFBQU8sS0FBS0MsVUFBTCxDQUFnQjNCLElBQWhCLENBQVA7QUFDSCxLQUZNLE1BRUQsSUFBSUEsSUFBSSxZQUFZckMsbUNBQWlCaUUsa0JBQXJDLEVBQXlEO0FBQzNELGFBQU8sS0FBS0MsZ0JBQUwsQ0FBc0I3QixJQUF0QixDQUFQO0FBQ0gsS0FGSyxNQUVDLElBQUlBLElBQUksWUFBWXJDLG1DQUFpQm1FLHFCQUFyQyxFQUE0RCxDQUMvRDtBQUNBO0FBQ0gsS0FITSxNQUdBO0FBQ0gsV0FBS3BCLGlCQUFMLENBQXVCLEtBQUt6QyxXQUFMLENBQWlCK0IsSUFBakIsQ0FBdkI7QUFDSDtBQUNKO0FBRUQ7Ozs7Ozs7QUFLQTJCLEVBQUFBLFVBQVUsQ0FBQ3pELEdBQUQsRUFBa0M7QUFDeENyQixJQUFBQSxPQUFPLENBQUNDLElBQVIsQ0FBYSxzQkFBYixFQUFxQ29CLEdBQUcsQ0FBQ2tCLGFBQUosRUFBckMsRUFBMERsQixHQUFHLENBQUMyQyxPQUFKLEVBQTFEO0FBQ0EsU0FBS0YsVUFBTCxDQUFnQnpDLEdBQWhCLEVBQXFCUCxtQ0FBaUIrRCxZQUF0QztBQUNBLFVBQU1LLElBQUksR0FBRyxFQUFiOztBQUNBLFNBQUssSUFBSTVDLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUdqQixHQUFHLENBQUNrQixhQUFKLEtBQW9CLENBQXhDLEVBQTJDLEVBQUVELENBQTdDLEVBQWdEO0FBQzVDLFlBQU1hLElBQWlCLEdBQUc5QixHQUFHLENBQUNvQixRQUFKLENBQWFILENBQWIsQ0FBMUI7O0FBQ0EsVUFBSWEsSUFBSSxZQUFZckMsbUNBQWlCcUUsb0JBQXJDLEVBQTJEO0FBQ3ZELGNBQU1DLGFBQWEsR0FBRyxLQUFLQyxrQkFBTCxDQUF3QmxDLElBQXhCLENBQXRCOztBQUNBLGFBQUssTUFBTUosS0FBWCxJQUFvQnFDLGFBQXBCLEVBQW1DO0FBQy9CRixVQUFBQSxJQUFJLENBQUMxRCxJQUFMLENBQVU0RCxhQUFhLENBQUNyQyxLQUFELENBQXZCO0FBQ0g7QUFDSixPQUxELE1BS087QUFDSCxhQUFLYyxpQkFBTCxDQUF1QixLQUFLekMsV0FBTCxDQUFpQitCLElBQWpCLENBQXZCO0FBQ0g7QUFDSjs7QUFFRCxXQUFPLEtBQUtELFFBQUwsQ0FBYyxJQUFJb0MscUJBQUosQ0FBbUJKLElBQW5CLENBQWQsRUFBd0MsS0FBS3JDLFFBQUwsQ0FBYyxLQUFLUyxVQUFMLENBQWdCakMsR0FBRyxDQUFDaUQsaUJBQUosRUFBaEIsQ0FBZCxDQUF4QyxDQUFQO0FBQ0gsR0F4TStDLENBMk1oRDs7O0FBQ0FlLEVBQUFBLGtCQUFrQixDQUFDaEUsR0FBRCxFQUFtQjtBQUNqQ3JCLElBQUFBLE9BQU8sQ0FBQ0MsSUFBUixDQUFhLDhCQUFiLEVBQTZDb0IsR0FBRyxDQUFDa0IsYUFBSixFQUE3QyxFQUFrRWxCLEdBQUcsQ0FBQzJDLE9BQUosRUFBbEU7QUFDQSxVQUFNa0IsSUFBSSxHQUFHLEVBQWI7O0FBQ0EsU0FBSyxJQUFJNUMsQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBR2pCLEdBQUcsQ0FBQ2tCLGFBQUosRUFBcEIsRUFBeUMsRUFBRUQsQ0FBM0MsRUFBOEM7QUFDMUMsVUFBSWEsSUFBaUIsR0FBRzlCLEdBQUcsQ0FBQ29CLFFBQUosQ0FBYUgsQ0FBYixDQUF4QjtBQUNBLFVBQUl2RCxJQUFJLEdBQUdvRSxJQUFJLENBQUNvQyxTQUFoQjs7QUFDQSxVQUFJeEcsSUFBSSxJQUFJK0IsbUNBQWlCMEUsY0FBN0IsRUFBNkM7QUFDekMsWUFBSXBCLFNBQWMsR0FBRyxLQUFLQyxjQUFMLENBQW9CbEIsSUFBcEIsQ0FBckI7QUFDQStCLFFBQUFBLElBQUksQ0FBQzFELElBQUwsQ0FBVTRDLFNBQVY7QUFDSCxPQUhELE1BR08sSUFBSXJGLElBQUksSUFBSTBHLFNBQVosRUFBdUI7QUFDMUI7QUFDSCxPQUZNLE1BR0Y7QUFDRCxhQUFLL0IsY0FBTCxDQUFvQjNFLElBQXBCO0FBQ0g7QUFDSjs7QUFDRCxXQUFPbUcsSUFBUDtBQUNILEdBN04rQyxDQStOaEQ7OztBQUNBTixFQUFBQSxzQkFBc0IsQ0FBQ3ZELEdBQUQsRUFBd0M7QUFDMURyQixJQUFBQSxPQUFPLENBQUNDLElBQVIsQ0FBYSxrQ0FBYixFQUFpRG9CLEdBQUcsQ0FBQ2tCLGFBQUosRUFBakQsRUFBc0VsQixHQUFHLENBQUMyQyxPQUFKLEVBQXRFO0FBQ0EsU0FBS0YsVUFBTCxDQUFnQnpDLEdBQWhCLEVBQXFCUCxtQ0FBaUI2RCx3QkFBdEM7QUFDQSxTQUFLZSxlQUFMLENBQXFCckUsR0FBckIsRUFBMEIsQ0FBMUI7QUFFQSxVQUFNc0UsRUFBRSxHQUFHdEUsR0FBRyxDQUFDb0IsUUFBSixDQUFhLENBQWIsQ0FBWCxDQUwwRCxDQUs5Qjs7QUFDNUIsVUFBTW1ELEVBQUUsR0FBR3ZFLEdBQUcsQ0FBQ29CLFFBQUosQ0FBYSxDQUFiLENBQVgsQ0FOMEQsQ0FNOUI7O0FBQzVCLFVBQU1vRCxFQUFFLEdBQUd4RSxHQUFHLENBQUNvQixRQUFKLENBQWEsQ0FBYixDQUFYLENBUDBELENBTzdCOztBQUU3QixTQUFLVCxzQkFBTCxDQUE0QjZELEVBQTVCO0FBQ0EsVUFBTUMsWUFBa0MsR0FBRyxLQUFLQyw0QkFBTCxDQUFrQ0gsRUFBbEMsQ0FBM0M7QUFDQSxVQUFNSSxJQUFJLEdBQUcsS0FBYjtBQUNBLFdBQU8sSUFBSUMsMEJBQUosQ0FBd0JILFlBQXhCLEVBQXNDRSxJQUF0QyxDQUFQO0FBQ0gsR0E3TytDLENBK09oRDs7O0FBQ0FELEVBQUFBLDRCQUE0QixDQUFDMUUsR0FBRCxFQUF5QztBQUNqRXJCLElBQUFBLE9BQU8sQ0FBQ0MsSUFBUixDQUFhLDBDQUFiLEVBQXlEb0IsR0FBRyxDQUFDa0IsYUFBSixFQUF6RCxFQUE4RWxCLEdBQUcsQ0FBQzJDLE9BQUosRUFBOUU7QUFDQSxTQUFLRixVQUFMLENBQWdCekMsR0FBaEIsRUFBcUJQLG1DQUFpQm9GLDhCQUF0QyxFQUZpRSxDQUlqRTs7QUFFQSxVQUFNSixZQUFrQyxHQUFHLEVBQTNDO0FBQ0EsVUFBTTFELEtBQUssR0FBRyxLQUFLK0QsYUFBTCxDQUFtQjlFLEdBQW5CLENBQWQ7QUFDQWUsSUFBQUEsS0FBSyxDQUFDZ0UsT0FBTixDQUFjakQsSUFBSSxJQUFJO0FBQ2xCLFVBQUlBLElBQUksWUFBWXJDLG1DQUFpQnVGLDBCQUFyQyxFQUFpRTtBQUM3RCxjQUFNQyxXQUFXLEdBQUcsS0FBS0Msd0JBQUwsQ0FBOEJwRCxJQUE5QixDQUFwQjtBQUNBMkMsUUFBQUEsWUFBWSxDQUFDdEUsSUFBYixDQUFrQjhFLFdBQWxCO0FBQ0gsT0FIRCxNQUdPO0FBQ0gsYUFBS3pDLGlCQUFMLENBQXVCLEtBQUt6QyxXQUFMLENBQWlCK0IsSUFBakIsQ0FBdkI7QUFDSDtBQUNKLEtBUEQ7QUFRQSxXQUFPMkMsWUFBUDtBQUNILEdBalErQyxDQW1RaEQ7OztBQUNBUyxFQUFBQSx3QkFBd0IsQ0FBQ2xGLEdBQUQsRUFBdUM7QUFDM0RyQixJQUFBQSxPQUFPLENBQUNDLElBQVIsQ0FBYSxvQ0FBYixFQUFtRG9CLEdBQUcsQ0FBQ2tCLGFBQUosRUFBbkQsRUFBd0VsQixHQUFHLENBQUMyQyxPQUFKLEVBQXhFO0FBQ0EsU0FBS0YsVUFBTCxDQUFnQnpDLEdBQWhCLEVBQXFCUCxtQ0FBaUJ1RiwwQkFBdEMsRUFGMkQsQ0FHM0Q7QUFDQTtBQUNBOztBQUNBLFVBQU1HLElBQUksR0FBR25GLEdBQUcsQ0FBQzJDLE9BQUosRUFBYjtBQUNBLFVBQU1yQixFQUFFLEdBQUcsSUFBSThELGlCQUFKLENBQWVELElBQWYsQ0FBWDtBQUNBLFFBQUlFLElBQUksR0FBRyxJQUFYOztBQUNBLFFBQUlyRixHQUFHLENBQUNrQixhQUFKLE1BQXVCLENBQTNCLEVBQThCO0FBQzFCbUUsTUFBQUEsSUFBSSxHQUFHLEtBQUtDLGdCQUFMLENBQXNCdEYsR0FBRyxDQUFDb0IsUUFBSixDQUFhLENBQWIsQ0FBdEIsQ0FBUDtBQUNILEtBRkQsTUFFTztBQUNILFlBQU0sSUFBSW1CLFNBQUosQ0FBYyxrQ0FBZCxDQUFOO0FBQ0g7O0FBQ0QsV0FBTyxJQUFJZ0QseUJBQUosQ0FBdUJqRSxFQUF2QixFQUEyQitELElBQTNCLENBQVA7QUFDSCxHQW5SK0MsQ0FxUmhEOzs7QUFDQUMsRUFBQUEsZ0JBQWdCLENBQUN0RixHQUFELEVBQW1FO0FBQy9FckIsSUFBQUEsT0FBTyxDQUFDQyxJQUFSLENBQWEsNEJBQWIsRUFBMkNvQixHQUFHLENBQUNrQixhQUFKLEVBQTNDLEVBQWdFbEIsR0FBRyxDQUFDMkMsT0FBSixFQUFoRTtBQUNBLFNBQUtGLFVBQUwsQ0FBZ0J6QyxHQUFoQixFQUFxQlAsbUNBQWlCK0Ysa0JBQXRDO0FBQ0EsU0FBS25CLGVBQUwsQ0FBcUJyRSxHQUFyQixFQUEwQixDQUExQjtBQUNBLFVBQU04QixJQUFpQixHQUFHOUIsR0FBRyxDQUFDb0IsUUFBSixDQUFhLENBQWIsQ0FBMUI7O0FBQ0EsUUFBSVUsSUFBSSxZQUFZckMsbUNBQWlCZ0csOEJBQXJDLEVBQXFFO0FBQ2pFLGFBQU8sS0FBS0MsNEJBQUwsQ0FBa0M1RCxJQUFsQyxDQUFQO0FBQ0gsS0FGRCxNQUVPLElBQUlBLElBQUksWUFBWXJDLG1DQUFpQmtHLDZCQUFyQyxFQUFvRTtBQUN2RSxhQUFPLEtBQUtDLDJCQUFMLENBQWlDOUQsSUFBakMsQ0FBUDtBQUNIOztBQUNELFNBQUtVLGlCQUFMLENBQXVCLEtBQUt6QyxXQUFMLENBQWlCK0IsSUFBakIsQ0FBdkI7QUFDSCxHQWpTK0MsQ0FtU2hEOzs7QUFDQStELEVBQUFBLG1CQUFtQixDQUFDN0YsR0FBRCxFQUFtQjtBQUNsQ3JCLElBQUFBLE9BQU8sQ0FBQ0MsSUFBUixDQUFhLCtCQUFiLEVBQThDb0IsR0FBRyxDQUFDa0IsYUFBSixFQUE5QyxFQUFtRWxCLEdBQUcsQ0FBQzJDLE9BQUosRUFBbkU7QUFDSDs7QUFFT21ELEVBQUFBLFdBQVIsQ0FBb0JoRSxJQUFwQixFQUErQkosS0FBL0IsRUFBc0Q7QUFDbEQsV0FBT0ksSUFBSSxDQUFDVixRQUFMLENBQWNNLEtBQWQsRUFBcUJ3QyxTQUE1QjtBQUNIOztBQUVPRyxFQUFBQSxlQUFSLENBQXdCckUsR0FBeEIsRUFBMEMrRixLQUExQyxFQUF5RDtBQUNyRCxRQUFJL0YsR0FBRyxDQUFDa0IsYUFBSixNQUF1QjZFLEtBQTNCLEVBQWtDO0FBQzlCLFlBQU0sSUFBSTlHLEtBQUosQ0FBVSxrQ0FBa0M4RyxLQUFsQyxHQUEwQyxVQUExQyxHQUF1RC9GLEdBQUcsQ0FBQ2tCLGFBQUosRUFBakUsQ0FBTjtBQUNIO0FBQ0osR0FoVCtDLENBa1RoRDs7O0FBQ0FtQyxFQUFBQSx3QkFBd0IsQ0FBQ3JELEdBQUQsRUFBbUI7QUFDdkNyQixJQUFBQSxPQUFPLENBQUNDLElBQVIsQ0FBYSxvQ0FBYixFQUFtRG9CLEdBQUcsQ0FBQ2tCLGFBQUosRUFBbkQsRUFBd0VsQixHQUFHLENBQUMyQyxPQUFKLEVBQXhFO0FBQ0EsU0FBS0YsVUFBTCxDQUFnQnpDLEdBQWhCLEVBQXFCUCxtQ0FBaUIyRCwwQkFBdEM7QUFDQSxTQUFLaUIsZUFBTCxDQUFxQnJFLEdBQXJCLEVBQTBCLENBQTFCLEVBSHVDLENBSXZDOztBQUNBLFVBQU04QixJQUFpQixHQUFHOUIsR0FBRyxDQUFDb0IsUUFBSixDQUFhLENBQWIsQ0FBMUIsQ0FMdUMsQ0FLSTs7QUFDM0MsUUFBSTRFLEdBQUo7O0FBQ0EsUUFBSWxFLElBQUksWUFBWXJDLG1DQUFpQndHLHlCQUFyQyxFQUFnRTtBQUM1REQsTUFBQUEsR0FBRyxHQUFHLEtBQUtFLHVCQUFMLENBQTZCcEUsSUFBN0IsQ0FBTjtBQUNILEtBRkQsTUFFTztBQUNILFdBQUtVLGlCQUFMLENBQXVCLEtBQUt6QyxXQUFMLENBQWlCK0IsSUFBakIsQ0FBdkI7QUFDSDs7QUFFRCxXQUFPa0UsR0FBUCxDQWJ1QyxDQWE1QjtBQUNkO0FBRUQ7Ozs7Ozs7O0FBTUFyQyxFQUFBQSxnQkFBZ0IsQ0FBQzNELEdBQUQsRUFBZ0M7QUFDNUNyQixJQUFBQSxPQUFPLENBQUNDLElBQVIsQ0FBYSw0QkFBYixFQUEyQ29CLEdBQUcsQ0FBQ2tCLGFBQUosRUFBM0MsRUFBZ0VsQixHQUFHLENBQUMyQyxPQUFKLEVBQWhFO0FBQ0EsU0FBS0YsVUFBTCxDQUFnQnpDLEdBQWhCLEVBQXFCUCxtQ0FBaUJpRSxrQkFBdEM7QUFDQSxVQUFNcUMsS0FBSyxHQUFHL0YsR0FBRyxDQUFDa0IsYUFBSixFQUFkO0FBQ0EsVUFBTWlGLElBQUksR0FBRyxLQUFLRCx1QkFBTCxDQUE2QmxHLEdBQUcsQ0FBQ29CLFFBQUosQ0FBYSxDQUFiLENBQTdCLENBQWI7QUFDQSxVQUFNZ0YsVUFBVSxHQUFHLEtBQUtwRCxjQUFMLENBQW9CaEQsR0FBRyxDQUFDb0IsUUFBSixDQUFhLENBQWIsQ0FBcEIsQ0FBbkI7QUFDQSxVQUFNaUYsU0FBUyxHQUFHTixLQUFLLElBQUksQ0FBVCxHQUFhLEtBQUsvQyxjQUFMLENBQW9CaEQsR0FBRyxDQUFDb0IsUUFBSixDQUFhLENBQWIsQ0FBcEIsQ0FBYixHQUFvRGdELFNBQXRFO0FBRUEsV0FBTyxJQUFJa0Msa0JBQUosQ0FBZ0JILElBQWhCLEVBQXNCQyxVQUF0QixFQUFrQ0MsU0FBbEMsQ0FBUDtBQUNILEdBbFYrQyxDQW9WaEQ7OztBQUNBRSxFQUFBQSxnQkFBZ0IsQ0FBQ3ZHLEdBQUQsRUFBbUI7QUFDL0JyQixJQUFBQSxPQUFPLENBQUNDLElBQVIsQ0FBYSx1QkFBdUJvQixHQUFHLENBQUMyQyxPQUFKLEVBQXBDO0FBRUgsR0F4VitDLENBMlZoRDs7O0FBQ0E2RCxFQUFBQSxtQkFBbUIsQ0FBQ3hHLEdBQUQsRUFBbUI7QUFDbENyQixJQUFBQSxPQUFPLENBQUNDLElBQVIsQ0FBYSwwQkFBMEJvQixHQUFHLENBQUMyQyxPQUFKLEVBQXZDO0FBRUgsR0EvVitDLENBa1doRDs7O0FBQ0E4RCxFQUFBQSxpQkFBaUIsQ0FBQ3pHLEdBQUQsRUFBbUI7QUFDaENyQixJQUFBQSxPQUFPLENBQUNDLElBQVIsQ0FBYSwwQkFBMEJvQixHQUFHLENBQUMyQyxPQUFKLEVBQXZDO0FBRUgsR0F0VytDLENBeVdoRDs7O0FBQ0ErRCxFQUFBQSxvQkFBb0IsQ0FBQzFHLEdBQUQsRUFBbUI7QUFDbkNyQixJQUFBQSxPQUFPLENBQUNnSSxLQUFSLENBQWMsaUJBQWQ7QUFFSCxHQTdXK0MsQ0FnWGhEOzs7QUFDQUMsRUFBQUEsbUJBQW1CLENBQUM1RyxHQUFELEVBQW1CO0FBQ2xDckIsSUFBQUEsT0FBTyxDQUFDZ0ksS0FBUixDQUFjLGlCQUFkO0FBRUgsR0FwWCtDLENBdVhoRDs7O0FBQ0FFLEVBQUFBLHNCQUFzQixDQUFDN0csR0FBRCxFQUFtQjtBQUNyQ3JCLElBQUFBLE9BQU8sQ0FBQ2dJLEtBQVIsQ0FBYyxpQkFBZDtBQUVILEdBM1grQyxDQThYaEQ7OztBQUNBRyxFQUFBQSxzQkFBc0IsQ0FBQzlHLEdBQUQsRUFBbUI7QUFDckNyQixJQUFBQSxPQUFPLENBQUNnSSxLQUFSLENBQWMsaUJBQWQ7QUFFSCxHQWxZK0MsQ0FxWWhEOzs7QUFDQUksRUFBQUEsbUJBQW1CLENBQUMvRyxHQUFELEVBQW1CO0FBQ2xDckIsSUFBQUEsT0FBTyxDQUFDZ0ksS0FBUixDQUFjLGlCQUFkO0FBRUgsR0F6WStDLENBNFloRDs7O0FBQ0FLLEVBQUFBLG9CQUFvQixDQUFDaEgsR0FBRCxFQUFtQjtBQUNuQ3JCLElBQUFBLE9BQU8sQ0FBQ2dJLEtBQVIsQ0FBYyxpQkFBZDtBQUVILEdBaForQyxDQW1aaEQ7OztBQUNBTSxFQUFBQSxrQkFBa0IsQ0FBQ2pILEdBQUQsRUFBbUI7QUFDakNyQixJQUFBQSxPQUFPLENBQUNnSSxLQUFSLENBQWMsaUJBQWQ7QUFFSCxHQXZaK0MsQ0EwWmhEOzs7QUFDQU8sRUFBQUEsb0JBQW9CLENBQUNsSCxHQUFELEVBQW1CO0FBQ25DckIsSUFBQUEsT0FBTyxDQUFDZ0ksS0FBUixDQUFjLGlCQUFkO0FBRUgsR0E5WitDLENBaWFoRDs7O0FBQ0FRLEVBQUFBLGNBQWMsQ0FBQ25ILEdBQUQsRUFBbUI7QUFDN0JyQixJQUFBQSxPQUFPLENBQUNnSSxLQUFSLENBQWMsaUJBQWQ7QUFFSCxHQXJhK0MsQ0F3YWhEOzs7QUFDQVMsRUFBQUEsZ0JBQWdCLENBQUNwSCxHQUFELEVBQW1CO0FBQy9CckIsSUFBQUEsT0FBTyxDQUFDZ0ksS0FBUixDQUFjLGlCQUFkO0FBRUgsR0E1YStDLENBK2FoRDs7O0FBQ0FVLEVBQUFBLGVBQWUsQ0FBQ3JILEdBQUQsRUFBbUI7QUFDOUJyQixJQUFBQSxPQUFPLENBQUNnSSxLQUFSLENBQWMsaUJBQWQ7QUFFSCxHQW5iK0MsQ0FzYmhEOzs7QUFDQVcsRUFBQUEsa0JBQWtCLENBQUN0SCxHQUFELEVBQW1CO0FBQ2pDckIsSUFBQUEsT0FBTyxDQUFDZ0ksS0FBUixDQUFjLGlCQUFkO0FBRUgsR0ExYitDLENBNmJoRDs7O0FBQ0FZLEVBQUFBLHNCQUFzQixDQUFDdkgsR0FBRCxFQUFtQjtBQUNyQ3JCLElBQUFBLE9BQU8sQ0FBQ2dJLEtBQVIsQ0FBYyxpQkFBZDtBQUVILEdBamMrQyxDQW9jaEQ7OztBQUNBYSxFQUFBQSxtQkFBbUIsQ0FBQ3hILEdBQUQsRUFBbUI7QUFDbENyQixJQUFBQSxPQUFPLENBQUNnSSxLQUFSLENBQWMsaUJBQWQ7QUFFSCxHQXhjK0MsQ0EyY2hEOzs7QUFDQWMsRUFBQUEsaUJBQWlCLENBQUN6SCxHQUFELEVBQW1CO0FBQ2hDckIsSUFBQUEsT0FBTyxDQUFDZ0ksS0FBUixDQUFjLGlCQUFkO0FBRUgsR0EvYytDLENBa2RoRDs7O0FBQ0FlLEVBQUFBLG9CQUFvQixDQUFDMUgsR0FBRCxFQUFtQjtBQUNuQ3JCLElBQUFBLE9BQU8sQ0FBQ2dJLEtBQVIsQ0FBYyxpQkFBZDtBQUVILEdBdGQrQyxDQXlkaEQ7OztBQUNBZ0IsRUFBQUEsc0JBQXNCLENBQUMzSCxHQUFELEVBQW1CO0FBQ3JDckIsSUFBQUEsT0FBTyxDQUFDZ0ksS0FBUixDQUFjLGlCQUFkO0FBRUgsR0E3ZCtDLENBZ2VoRDs7O0FBQ0FpQixFQUFBQSxzQkFBc0IsQ0FBQzVILEdBQUQsRUFBbUI7QUFDckNyQixJQUFBQSxPQUFPLENBQUNnSSxLQUFSLENBQWMsaUJBQWQ7QUFFSCxHQXBlK0MsQ0F1ZWhEOzs7QUFDQWtCLEVBQUFBLHdCQUF3QixDQUFDN0gsR0FBRCxFQUFtQjtBQUN2Q3JCLElBQUFBLE9BQU8sQ0FBQ2dJLEtBQVIsQ0FBYyxpQkFBZDtBQUVILEdBM2UrQyxDQThlaEQ7OztBQUNBbUIsRUFBQUEsd0JBQXdCLENBQUM5SCxHQUFELEVBQW1CO0FBQ3ZDckIsSUFBQUEsT0FBTyxDQUFDZ0ksS0FBUixDQUFjLGlCQUFkO0FBQ0gsR0FqZitDLENBb2ZoRDs7O0FBQ0FvQixFQUFBQSxpQkFBaUIsQ0FBQy9ILEdBQUQsRUFBbUI7QUFDaENyQixJQUFBQSxPQUFPLENBQUNDLElBQVIsQ0FBYSx3QkFBd0JvQixHQUFHLENBQUMyQyxPQUFKLEVBQXJDO0FBQ0gsR0F2ZitDLENBMGZoRDs7O0FBQ0FxRixFQUFBQSxpQkFBaUIsQ0FBQ2hJLEdBQUQsRUFBbUI7QUFDaENyQixJQUFBQSxPQUFPLENBQUNDLElBQVIsQ0FBYSw2QkFBYixFQUE0Q29CLEdBQUcsQ0FBQ2tCLGFBQUosRUFBNUMsRUFBaUVsQixHQUFHLENBQUMyQyxPQUFKLEVBQWpFO0FBQ0EsU0FBS0YsVUFBTCxDQUFnQnpDLEdBQWhCLEVBQXFCUCxtQ0FBaUJ3SSxtQkFBdEMsRUFGZ0MsQ0FHaEM7O0FBQ0EsUUFBSWpJLEdBQUcsQ0FBQ2tCLGFBQUosTUFBdUIsQ0FBM0IsRUFBOEI7QUFDMUIsYUFBTyxFQUFQO0FBQ0g7O0FBRUQsUUFBSWdILE9BQU8sR0FBRyxFQUFkLENBUmdDLENBU2hDOztBQUNBLFNBQUssSUFBSWpILENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUdqQixHQUFHLENBQUNrQixhQUFKLEtBQXNCLENBQTFDLEVBQTZDLEVBQUVELENBQS9DLEVBQWtEO0FBQzlDLFlBQU1hLElBQWlCLEdBQUc5QixHQUFHLENBQUNvQixRQUFKLENBQWFILENBQWIsQ0FBMUI7QUFDQSxVQUFJK0UsR0FBRyxHQUFHLEVBQVY7O0FBQ0EsVUFBSWxFLElBQUksWUFBWXJDLG1DQUFpQjBJLGtCQUFyQyxFQUF5RDtBQUNyRG5DLFFBQUFBLEdBQUcsR0FBRyxLQUFLb0MsZ0JBQUwsQ0FBc0J0RyxJQUF0QixDQUFOO0FBQ0gsT0FGRCxNQUVPLElBQUlBLElBQUksWUFBWXJDLG1DQUFpQjRJLGNBQXJDLEVBQXFEO0FBQ3hEckMsUUFBQUEsR0FBRyxHQUFHLEtBQUtzQyxZQUFMLENBQWtCeEcsSUFBbEIsQ0FBTjtBQUNILE9BRk0sTUFFQTtBQUNIO0FBQ0EsWUFBSUEsSUFBSSxDQUFDeUcsTUFBTCxJQUFlbkUsU0FBbkIsRUFBOEI7QUFDMUI0QixVQUFBQSxHQUFHLEdBQUcsQ0FBQyxJQUFELENBQU47QUFDSCxTQUZELE1BR0s7QUFDRCxlQUFLeEQsaUJBQUwsQ0FBdUIsS0FBS3pDLFdBQUwsQ0FBaUIrQixJQUFqQixDQUF2QjtBQUNIO0FBQ0o7O0FBQ0RvRyxNQUFBQSxPQUFPLEdBQUcsQ0FBQyxHQUFHQSxPQUFKLEVBQWEsR0FBR2xDLEdBQWhCLENBQVY7QUFDSDs7QUFDRCxXQUFPa0MsT0FBUDtBQUNILEdBeGhCK0MsQ0EwaEJoRDs7O0FBQ0FFLEVBQUFBLGdCQUFnQixDQUFDcEksR0FBRCxFQUFtQjtBQUMvQnJCLElBQUFBLE9BQU8sQ0FBQ0MsSUFBUixDQUFhLDRCQUFiLEVBQTJDb0IsR0FBRyxDQUFDa0IsYUFBSixFQUEzQyxFQUFnRWxCLEdBQUcsQ0FBQzJDLE9BQUosRUFBaEU7QUFDQSxTQUFLRixVQUFMLENBQWdCekMsR0FBaEIsRUFBcUJQLG1DQUFpQjBJLGtCQUF0QztBQUNBLFVBQU1LLFFBQVEsR0FBRyxFQUFqQjtBQUNBLFVBQU16SCxLQUFvQixHQUFHLEtBQUsrRCxhQUFMLENBQW1COUUsR0FBbkIsQ0FBN0I7O0FBQ0EsU0FBSyxJQUFJaUIsQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBR0YsS0FBSyxDQUFDWCxNQUExQixFQUFrQyxFQUFFYSxDQUFwQyxFQUF1QztBQUNuQyxZQUFNd0gsSUFBSSxHQUFHLEtBQUtDLGdCQUFMLENBQXNCM0gsS0FBSyxDQUFDRSxDQUFELENBQTNCLENBQWI7QUFDQXVILE1BQUFBLFFBQVEsQ0FBQ3JJLElBQVQsQ0FBY3NJLElBQWQ7QUFDSDs7QUFDRCxXQUFPRCxRQUFQO0FBQ0gsR0FyaUIrQyxDQXVpQmhEOzs7QUFDQUYsRUFBQUEsWUFBWSxDQUFDdEksR0FBRCxFQUFtQjtBQUMzQnJCLElBQUFBLE9BQU8sQ0FBQ0MsSUFBUixDQUFhLHdCQUFiLEVBQXVDb0IsR0FBRyxDQUFDa0IsYUFBSixFQUF2QyxFQUE0RGxCLEdBQUcsQ0FBQzJDLE9BQUosRUFBNUQ7QUFDQSxTQUFLRixVQUFMLENBQWdCekMsR0FBaEIsRUFBcUJQLG1DQUFpQjRJLGNBQXRDLEVBRjJCLENBRzNCOztBQUNBLFVBQU1NLE9BQU8sR0FBRyxFQUFoQjs7QUFDQSxTQUFLLElBQUkxSCxDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHakIsR0FBRyxDQUFDa0IsYUFBSixFQUFwQixFQUF5QyxFQUFFRCxDQUEzQyxFQUE4QztBQUMxQzBILE1BQUFBLE9BQU8sQ0FBQ3hJLElBQVIsQ0FBYSxJQUFiO0FBQ0g7O0FBQ0QsV0FBT3dJLE9BQVA7QUFDSCxHQWpqQitDLENBbWpCaEQ7OztBQUNBQyxFQUFBQSxrQkFBa0IsQ0FBQzVJLEdBQUQsRUFBK0M7QUFDN0RyQixJQUFBQSxPQUFPLENBQUNDLElBQVIsQ0FBYSw4QkFBYixFQUE2Q29CLEdBQUcsQ0FBQ2tCLGFBQUosRUFBN0MsRUFBa0VsQixHQUFHLENBQUMyQyxPQUFKLEVBQWxFO0FBQ0EsU0FBS0YsVUFBTCxDQUFnQnpDLEdBQWhCLEVBQXFCUCxtQ0FBaUJvSixvQkFBdEM7QUFDQSxVQUFNL0csSUFBaUIsR0FBRzlCLEdBQUcsQ0FBQ29CLFFBQUosQ0FBYSxDQUFiLENBQTFCOztBQUNBLFFBQUlVLElBQUksWUFBWXJDLG1DQUFpQnFKLCtCQUFyQyxFQUFzRTtBQUNsRSxhQUFPLEtBQUtDLDZCQUFMLENBQW1DakgsSUFBbkMsQ0FBUDtBQUNIOztBQUNELFdBQU8sRUFBUDtBQUNILEdBNWpCK0MsQ0E4akJoRDs7O0FBQ0FpSCxFQUFBQSw2QkFBNkIsQ0FBQy9JLEdBQUQsRUFBK0M7QUFDeEVyQixJQUFBQSxPQUFPLENBQUNDLElBQVIsQ0FBYSx5Q0FBYixFQUF3RG9CLEdBQUcsQ0FBQ2tCLGFBQUosRUFBeEQsRUFBNkVsQixHQUFHLENBQUMyQyxPQUFKLEVBQTdFO0FBQ0EsU0FBS0YsVUFBTCxDQUFnQnpDLEdBQWhCLEVBQXFCUCxtQ0FBaUJxSiwrQkFBdEM7QUFDQSxVQUFNRSxVQUFzQyxHQUFHLEVBQS9DO0FBQ0EsVUFBTWpJLEtBQW9CLEdBQUcsS0FBSytELGFBQUwsQ0FBbUI5RSxHQUFuQixDQUE3Qjs7QUFDQSxTQUFLLElBQUlpQixDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHRixLQUFLLENBQUNYLE1BQTFCLEVBQWtDLEVBQUVhLENBQXBDLEVBQXVDO0FBQ25DLFlBQU1hLElBQUksR0FBR2YsS0FBSyxDQUFDRSxDQUFELENBQWxCOztBQUNBLFVBQUlhLElBQUksWUFBWXJDLG1DQUFpQndKLG1DQUFyQyxFQUEwRTtBQUN0RSxjQUFNQyxRQUFrQyxHQUFHLEtBQUtDLGlDQUFMLENBQXVDckgsSUFBdkMsQ0FBM0M7QUFDQWtILFFBQUFBLFVBQVUsQ0FBQzdJLElBQVgsQ0FBZ0IrSSxRQUFoQjtBQUNILE9BSEQsTUFHTztBQUNILGFBQUsxRyxpQkFBTCxDQUF1QixLQUFLekMsV0FBTCxDQUFpQitCLElBQWpCLENBQXZCO0FBQ0g7QUFDSjs7QUFDRCxXQUFPa0gsVUFBUDtBQUNIO0FBRUQ7Ozs7OztBQUlRbEUsRUFBQUEsYUFBUixDQUFzQjlFLEdBQXRCLEVBQXVEO0FBQ25ELFVBQU1vSixRQUF1QixHQUFHLEVBQWhDOztBQUNBLFNBQUssSUFBSW5JLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUdqQixHQUFHLENBQUNrQixhQUFKLEVBQXBCLEVBQXlDLEVBQUVELENBQTNDLEVBQThDO0FBQzFDLFlBQU1hLElBQUksR0FBRzlCLEdBQUcsQ0FBQ29CLFFBQUosQ0FBYUgsQ0FBYixDQUFiLENBRDBDLENBRTFDOztBQUNBLFVBQUlhLElBQUksQ0FBQ3lHLE1BQUwsSUFBZW5FLFNBQW5CLEVBQThCO0FBQzFCO0FBQ0g7O0FBQ0RnRixNQUFBQSxRQUFRLENBQUNqSixJQUFULENBQWMyQixJQUFkO0FBQ0g7O0FBQ0QsV0FBT3NILFFBQVA7QUFDSCxHQS9sQitDLENBaW1CaEQ7OztBQUNBRCxFQUFBQSxpQ0FBaUMsQ0FBQ25KLEdBQUQsRUFBNkM7QUFDMUVyQixJQUFBQSxPQUFPLENBQUNDLElBQVIsQ0FBYSw2Q0FBYixFQUE0RG9CLEdBQUcsQ0FBQ2tCLGFBQUosRUFBNUQsRUFBaUZsQixHQUFHLENBQUMyQyxPQUFKLEVBQWpGO0FBQ0EsU0FBS0YsVUFBTCxDQUFnQnpDLEdBQWhCLEVBQXFCUCxtQ0FBaUJ3SixtQ0FBdEM7QUFDQSxTQUFLNUUsZUFBTCxDQUFxQnJFLEdBQXJCLEVBQTBCLENBQTFCO0FBQ0EsUUFBSXNFLEVBQUUsR0FBR3RFLEdBQUcsQ0FBQ29CLFFBQUosQ0FBYSxDQUFiLENBQVQsQ0FKMEUsQ0FJaEQ7O0FBQzFCLFFBQUltRCxFQUFFLEdBQUd2RSxHQUFHLENBQUNvQixRQUFKLENBQWEsQ0FBYixDQUFULENBTDBFLENBS2hEOztBQUMxQixRQUFJb0QsRUFBRSxHQUFHeEUsR0FBRyxDQUFDb0IsUUFBSixDQUFhLENBQWIsQ0FBVCxDQU4wRSxDQU1oRDs7QUFDMUIsVUFBTTFCLEdBQWdCLEdBQUcsS0FBSzJKLGlCQUFMLENBQXVCL0UsRUFBdkIsQ0FBekI7QUFDQSxVQUFNM0csS0FBSyxHQUFHLEtBQUsrSyxnQkFBTCxDQUFzQmxFLEVBQXRCLENBQWQ7QUFDQSxVQUFNOEUsUUFBUSxHQUFHLEtBQWpCO0FBQ0EsVUFBTUMsTUFBTSxHQUFHLEtBQWY7QUFDQSxVQUFNQyxTQUFTLEdBQUcsS0FBbEI7QUFFQSxXQUFPLElBQUlDLGVBQUosQ0FBYSxNQUFiLEVBQXFCL0osR0FBckIsRUFBMEI0SixRQUExQixFQUFvQzNMLEtBQXBDLEVBQTJDNEwsTUFBM0MsRUFBbURDLFNBQW5ELENBQVA7QUFDSCxHQWhuQitDLENBa25CaEQ7OztBQUNBRSxFQUFBQSxtQkFBbUIsQ0FBQzFKLEdBQUQsRUFBbUI7QUFDbENyQixJQUFBQSxPQUFPLENBQUNnSSxLQUFSLENBQWMsaUJBQWQ7QUFFSCxHQXRuQitDLENBeW5CaEQ7OztBQUNBZ0QsRUFBQUEsbUJBQW1CLENBQUMzSixHQUFELEVBQW1CO0FBQ2xDckIsSUFBQUEsT0FBTyxDQUFDZ0ksS0FBUixDQUFjLGlCQUFkO0FBRUgsR0E3bkIrQyxDQStuQmhEOzs7QUFDQTBDLEVBQUFBLGlCQUFpQixDQUFDckosR0FBRCxFQUFnQztBQUM3Q3JCLElBQUFBLE9BQU8sQ0FBQ0MsSUFBUixDQUFhLDZCQUFiLEVBQTRDb0IsR0FBRyxDQUFDa0IsYUFBSixFQUE1QyxFQUFpRWxCLEdBQUcsQ0FBQzJDLE9BQUosRUFBakU7QUFDQSxTQUFLRixVQUFMLENBQWdCekMsR0FBaEIsRUFBcUJQLG1DQUFpQm1LLG1CQUF0QztBQUNBLFNBQUt2RixlQUFMLENBQXFCckUsR0FBckIsRUFBMEIsQ0FBMUI7QUFDQSxVQUFNOEIsSUFBSSxHQUFHOUIsR0FBRyxDQUFDb0IsUUFBSixDQUFhLENBQWIsQ0FBYjtBQUNBLFVBQU0yRSxLQUFLLEdBQUdqRSxJQUFJLENBQUNaLGFBQUwsRUFBZDs7QUFDQSxRQUFJNkUsS0FBSyxJQUFJLENBQWIsRUFBZ0I7QUFBRTtBQUNkLGFBQU8sS0FBSzhELGtCQUFMLENBQXdCL0gsSUFBeEIsQ0FBUDtBQUNILEtBRkQsTUFFTyxJQUFJaUUsS0FBSyxJQUFJLENBQWIsRUFBZ0I7QUFDbkIsYUFBTyxLQUFLK0QsbUJBQUwsQ0FBeUJoSSxJQUF6QixDQUFQO0FBQ0g7O0FBQ0QsU0FBS1UsaUJBQUwsQ0FBdUIsS0FBS3pDLFdBQUwsQ0FBaUIrQixJQUFqQixDQUF2QjtBQUNILEdBNW9CK0MsQ0E4b0JoRDs7O0FBQ0FpSSxFQUFBQSw2QkFBNkIsQ0FBQy9KLEdBQUQsRUFBbUI7QUFDNUNyQixJQUFBQSxPQUFPLENBQUNnSSxLQUFSLENBQWMsaUJBQWQ7QUFFSCxHQWxwQitDLENBb3BCaEQ7OztBQUNBcUQsRUFBQUEsY0FBYyxDQUFDaEssR0FBRCxFQUFtQjtBQUM3QnJCLElBQUFBLE9BQU8sQ0FBQ0MsSUFBUixDQUFhLHFCQUFxQm9CLEdBQUcsQ0FBQzJDLE9BQUosRUFBbEM7QUFFSCxHQXhwQitDLENBMHBCaEQ7OztBQUNBc0gsRUFBQUEsaUJBQWlCLENBQUNqSyxHQUFELEVBQW1CO0FBQ2hDckIsSUFBQUEsT0FBTyxDQUFDQyxJQUFSLENBQWEsd0JBQXdCb0IsR0FBRyxDQUFDMkMsT0FBSixFQUFyQztBQUNILEdBN3BCK0MsQ0ErcEJoRDs7O0FBQ0F1RCxFQUFBQSx1QkFBdUIsQ0FBQ2xHLEdBQUQsRUFBNkQ7QUFDaEZyQixJQUFBQSxPQUFPLENBQUNDLElBQVIsQ0FBYSxxQ0FBYixFQUFvRG9CLEdBQUcsQ0FBQ2tCLGFBQUosRUFBcEQsRUFBeUVsQixHQUFHLENBQUMyQyxPQUFKLEVBQXpFO0FBQ0EsU0FBS0YsVUFBTCxDQUFnQnpDLEdBQWhCLEVBQXFCUCxtQ0FBaUJ3Ryx5QkFBdEM7QUFDQSxVQUFNaUUsV0FBVyxHQUFHLEVBQXBCLENBSGdGLENBSWhGOztBQUNBLFNBQUssSUFBSWpKLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUdqQixHQUFHLENBQUNrQixhQUFKLEVBQXBCLEVBQXlDLEVBQUVELENBQTNDLEVBQThDO0FBQzFDLFlBQU1hLElBQWlCLEdBQUc5QixHQUFHLENBQUNvQixRQUFKLENBQWFILENBQWIsQ0FBMUI7QUFDQSxZQUFNK0UsR0FBRyxHQUFHLEtBQUswQyxnQkFBTCxDQUFzQjVHLElBQXRCLENBQVo7QUFDQW9JLE1BQUFBLFdBQVcsQ0FBQy9KLElBQVosQ0FBaUI2RixHQUFqQjtBQUNILEtBVCtFLENBVWhGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNBLFFBQUlBLEdBQUo7O0FBQ0EsUUFBSWtFLFdBQVcsQ0FBQzlKLE1BQVosSUFBc0IsQ0FBMUIsRUFBNkI7QUFDekI0RixNQUFBQSxHQUFHLEdBQUcsSUFBSW1FLDBCQUFKLENBQXdCRCxXQUFXLENBQUMsQ0FBRCxDQUFuQyxDQUFOO0FBQ0gsS0FGRCxNQUVPO0FBQ0hsRSxNQUFBQSxHQUFHLEdBQUcsSUFBSW9FLHlCQUFKLENBQXVCRixXQUF2QixDQUFOO0FBQ0g7O0FBQ0QsV0FBTyxLQUFLckksUUFBTCxDQUFjbUUsR0FBZCxFQUFtQixLQUFLeEUsUUFBTCxDQUFjLEtBQUtTLFVBQUwsQ0FBZ0JqQyxHQUFHLENBQUNpRCxpQkFBSixFQUFoQixDQUFkLENBQW5CLENBQVA7QUFDSDtBQUVEOzs7Ozs7QUFJQXlGLEVBQUFBLGdCQUFnQixDQUFDNUcsSUFBRCxFQUF5QjtBQUNyQyxRQUFJQSxJQUFJLFlBQVlyQyxtQ0FBaUI0Syx3QkFBckMsRUFBK0Q7QUFDM0QsYUFBTyxLQUFLQyxzQkFBTCxDQUE0QnhJLElBQTVCLENBQVA7QUFDSCxLQUZELE1BRU8sSUFBSUEsSUFBSSxZQUFZckMsbUNBQWlCZ0csOEJBQXJDLEVBQXFFO0FBQ3hFLGFBQU8sS0FBS0MsNEJBQUwsQ0FBa0M1RCxJQUFsQyxDQUFQO0FBQ0gsS0FGTSxNQUVBLElBQUlBLElBQUksWUFBWXJDLG1DQUFpQjhLLDJCQUFyQyxFQUFrRTtBQUNyRSxhQUFPLEtBQUtDLHlCQUFMLENBQStCMUksSUFBL0IsQ0FBUDtBQUNILEtBRk0sTUFFQSxJQUFJQSxJQUFJLFlBQVlyQyxtQ0FBaUJnTCx5QkFBckMsRUFBZ0U7QUFDbkUsYUFBTyxLQUFLQyx1QkFBTCxDQUE2QjVJLElBQTdCLENBQVA7QUFDSCxLQUZNLE1BRUEsSUFBSUEsSUFBSSxZQUFZckMsbUNBQWlCa0wsK0JBQXJDLEVBQXNFO0FBQ3pFLGFBQU8sS0FBS0MsNkJBQUwsQ0FBbUM5SSxJQUFuQyxDQUFQO0FBQ0gsS0FGTSxNQUVBLElBQUlBLElBQUksWUFBWXJDLG1DQUFpQmtHLDZCQUFyQyxFQUFvRTtBQUN2RSxhQUFPLEtBQUtDLDJCQUFMLENBQWlDOUQsSUFBakMsQ0FBUDtBQUNILEtBRk0sTUFFQSxJQUFJQSxJQUFJLFlBQVlyQyxtQ0FBaUJvTCx5QkFBckMsRUFBZ0U7QUFDbkUsYUFBTyxLQUFLQyx1QkFBTCxDQUE2QmhKLElBQTdCLENBQVA7QUFDSCxLQUZNLE1BRUEsSUFBSUEsSUFBSSxZQUFZckMsbUNBQWlCc0wsOEJBQXJDLEVBQXFFO0FBQ3hFLGFBQU8sS0FBS0MsNEJBQUwsQ0FBa0NsSixJQUFsQyxDQUFQO0FBQ0gsS0FGTSxNQUVBLElBQUlBLElBQUksWUFBWXJDLG1DQUFpQndMLDJCQUFyQyxFQUFrRTtBQUNyRSxhQUFPLEtBQUtDLHlCQUFMLENBQStCcEosSUFBL0IsQ0FBUDtBQUNILEtBRk0sTUFFQSxJQUFJQSxJQUFJLFlBQVlyQyxtQ0FBaUIwTCwyQkFBckMsRUFBa0U7QUFDckUsYUFBTyxLQUFLQyx5QkFBTCxDQUErQnRKLElBQS9CLENBQVA7QUFDSCxLQUZNLE1BRUEsSUFBSUEsSUFBSSxZQUFZckMsbUNBQWlCNEwsMEJBQXJDLEVBQWlFO0FBQ3BFLGFBQU8sS0FBS0Msd0JBQUwsQ0FBOEJ4SixJQUE5QixDQUFQO0FBQ0gsS0FGTSxNQUVBLElBQUlBLElBQUksWUFBWXJDLG1DQUFpQjhMLDRCQUFyQyxFQUFtRTtBQUN0RSxhQUFPLEtBQUtDLDBCQUFMLENBQWdDMUosSUFBaEMsQ0FBUDtBQUNILEtBRk0sTUFFRCxJQUFJQSxJQUFJLFlBQVlyQyxtQ0FBaUJnTSxtQ0FBckMsRUFBMEU7QUFDNUUsYUFBTyxLQUFLQyxpQ0FBTCxDQUF1QzVKLElBQXZDLENBQVA7QUFDSDs7QUFDRCxTQUFLVSxpQkFBTCxDQUF1QixLQUFLekMsV0FBTCxDQUFpQitCLElBQWpCLENBQXZCO0FBQ0gsR0F6dEIrQyxDQTJ0QmhEOzs7QUFDQTZKLEVBQUFBLHNCQUFzQixDQUFDM0wsR0FBRCxFQUFtQjtBQUNyQ3JCLElBQUFBLE9BQU8sQ0FBQ2dJLEtBQVIsQ0FBYyxpQkFBZDtBQUNILEdBOXRCK0MsQ0FpdUJoRDs7O0FBQ0FpRixFQUFBQSx5QkFBeUIsQ0FBQzVMLEdBQUQsRUFBbUI7QUFDeENyQixJQUFBQSxPQUFPLENBQUNnSSxLQUFSLENBQWMsaUJBQWQ7QUFFSCxHQXJ1QitDLENBd3VCaEQ7OztBQUNBa0YsRUFBQUEsMkJBQTJCLENBQUM3TCxHQUFELEVBQW1CO0FBQzFDckIsSUFBQUEsT0FBTyxDQUFDZ0ksS0FBUixDQUFjLGlCQUFkO0FBRUgsR0E1dUIrQyxDQTh1QmhEOzs7QUFDQWpCLEVBQUFBLDRCQUE0QixDQUFDMUYsR0FBRCxFQUFxQztBQUM3RHJCLElBQUFBLE9BQU8sQ0FBQ0MsSUFBUixDQUFhLHdDQUFiLEVBQXVEb0IsR0FBRyxDQUFDa0IsYUFBSixFQUF2RCxFQUE0RWxCLEdBQUcsQ0FBQzJDLE9BQUosRUFBNUU7QUFDQSxTQUFLRixVQUFMLENBQWdCekMsR0FBaEIsRUFBcUJQLG1DQUFpQmdHLDhCQUF0QztBQUNBLFVBQU0zRCxJQUFJLEdBQUc5QixHQUFHLENBQUNvQixRQUFKLENBQWEsQ0FBYixDQUFiO0FBQ0EsVUFBTTRILFVBQXNDLEdBQUcsS0FBS0osa0JBQUwsQ0FBd0I5RyxJQUF4QixDQUEvQztBQUNBLFdBQU8sSUFBSWdLLHVCQUFKLENBQXFCOUMsVUFBckIsQ0FBUDtBQUNILEdBcnZCK0MsQ0F3dkJoRDs7O0FBQ0ErQyxFQUFBQSxpQkFBaUIsQ0FBQy9MLEdBQUQsRUFBbUI7QUFDaENyQixJQUFBQSxPQUFPLENBQUNnSSxLQUFSLENBQWMsaUJBQWQ7QUFFSCxHQTV2QitDLENBK3ZCaEQ7OztBQUNBcUYsRUFBQUEsd0JBQXdCLENBQUNoTSxHQUFELEVBQW1CO0FBQ3ZDckIsSUFBQUEsT0FBTyxDQUFDZ0ksS0FBUixDQUFjLGlCQUFkO0FBRUgsR0Fud0IrQyxDQXN3QmhEOzs7QUFDQXNGLEVBQUFBLGtCQUFrQixDQUFDak0sR0FBRCxFQUFtQjtBQUNqQ3JCLElBQUFBLE9BQU8sQ0FBQ2dJLEtBQVIsQ0FBYyxpQkFBZDtBQUVILEdBMXdCK0MsQ0E2d0JoRDs7O0FBQ0F1RixFQUFBQSwwQkFBMEIsQ0FBQ2xNLEdBQUQsRUFBbUI7QUFDekNyQixJQUFBQSxPQUFPLENBQUNnSSxLQUFSLENBQWMsaUJBQWQ7QUFFSCxHQWp4QitDLENBb3hCaEQ7OztBQUNBd0YsRUFBQUEsd0JBQXdCLENBQUNuTSxHQUFELEVBQW1CO0FBQ3ZDckIsSUFBQUEsT0FBTyxDQUFDQyxJQUFSLENBQWEsK0JBQStCb0IsR0FBRyxDQUFDMkMsT0FBSixFQUE1QztBQUdILEdBenhCK0MsQ0E0eEJoRDs7O0FBQ0F5SixFQUFBQSxtQkFBbUIsQ0FBQ3BNLEdBQUQsRUFBbUI7QUFDbENyQixJQUFBQSxPQUFPLENBQUNnSSxLQUFSLENBQWMsaUJBQWQ7QUFFSCxHQWh5QitDLENBbXlCaEQ7OztBQUNBMEYsRUFBQUEsdUJBQXVCLENBQUNyTSxHQUFELEVBQW1CO0FBQ3RDckIsSUFBQUEsT0FBTyxDQUFDZ0ksS0FBUixDQUFjLGlCQUFkO0FBRUgsR0F2eUIrQyxDQTB5QmhEOzs7QUFDQTJGLEVBQUFBLHlCQUF5QixDQUFDdE0sR0FBRCxFQUFtQjtBQUN4Q3JCLElBQUFBLE9BQU8sQ0FBQ2dJLEtBQVIsQ0FBYyxpQkFBZDtBQUVILEdBOXlCK0MsQ0FpekJoRDs7O0FBQ0E0RixFQUFBQSwyQkFBMkIsQ0FBQ3ZNLEdBQUQsRUFBbUI7QUFDMUNyQixJQUFBQSxPQUFPLENBQUNnSSxLQUFSLENBQWMsaUJBQWQ7QUFFSCxHQXJ6QitDLENBd3pCaEQ7OztBQUNBNkQsRUFBQUEseUJBQXlCLENBQUN4SyxHQUFELEVBQW1CO0FBQ3hDckIsSUFBQUEsT0FBTyxDQUFDQyxJQUFSLENBQWEsdUNBQWIsRUFBc0RvQixHQUFHLENBQUNrQixhQUFKLEVBQXRELEVBQTJFbEIsR0FBRyxDQUFDMkMsT0FBSixFQUEzRTtBQUNBLFNBQUtGLFVBQUwsQ0FBZ0J6QyxHQUFoQixFQUFxQlAsbUNBQWlCOEssMkJBQXRDO0FBQ0EsU0FBS2xHLGVBQUwsQ0FBcUJyRSxHQUFyQixFQUEwQixDQUExQjtBQUVBLFFBQUl3TSxXQUFXLEdBQUd4TSxHQUFHLENBQUNvQixRQUFKLENBQWEsQ0FBYixDQUFsQixDQUx3QyxDQUtMOztBQUNuQyxRQUFJcUwsUUFBUSxHQUFHek0sR0FBRyxDQUFDb0IsUUFBSixDQUFhLENBQWIsRUFBZ0J1QixPQUFoQixFQUFmLENBTndDLENBTUU7O0FBQzFDLFFBQUkrSixVQUFVLEdBQUcxTSxHQUFHLENBQUNvQixRQUFKLENBQWEsQ0FBYixDQUFqQixDQVB3QyxDQU9MOztBQUVuQyxRQUFJdUwsR0FBRyxHQUFHLEtBQUt2Qix5QkFBTCxDQUErQm9CLFdBQS9CLENBQVY7QUFDQSxRQUFJSSxHQUFHLEdBQUcsS0FBSzFHLHVCQUFMLENBQTZCd0csVUFBN0IsQ0FBVixDQVZ3QyxDQVd4Qzs7QUFDQSxRQUFJNUssSUFBSSxHQUFHLElBQUkrSywyQkFBSixDQUF5QkosUUFBekIsRUFBbUNFLEdBQW5DLEVBQXdDQyxHQUFHLENBQUNGLFVBQTVDLENBQVg7QUFDQSxXQUFPNUssSUFBUDtBQUNILEdBdjBCK0MsQ0EwMEJoRDs7O0FBQ0FnTCxFQUFBQSxxQkFBcUIsQ0FBQzlNLEdBQUQsRUFBbUI7QUFDcENyQixJQUFBQSxPQUFPLENBQUNnSSxLQUFSLENBQWMsaUJBQWQ7QUFFSCxHQTkwQitDLENBaTFCaEQ7OztBQUNBb0csRUFBQUEseUJBQXlCLENBQUMvTSxHQUFELEVBQW1CO0FBQ3hDckIsSUFBQUEsT0FBTyxDQUFDZ0ksS0FBUixDQUFjLGlCQUFkO0FBRUgsR0FyMUIrQyxDQXUxQmhEOzs7QUFDQXFHLEVBQUFBLHdCQUF3QixDQUFDaE4sR0FBRCxFQUFtQjtBQUN2Q3JCLElBQUFBLE9BQU8sQ0FBQ2dJLEtBQVIsQ0FBYyxpQkFBZDtBQUVILEdBMzFCK0MsQ0E2MUJoRDs7O0FBQ0FzRyxFQUFBQSxxQkFBcUIsQ0FBQ2pOLEdBQUQsRUFBbUI7QUFDcENyQixJQUFBQSxPQUFPLENBQUNnSSxLQUFSLENBQWMsaUJBQWQ7QUFDSCxHQWgyQitDLENBazJCaEQ7OztBQUNBbUUsRUFBQUEsdUJBQXVCLENBQUM5SyxHQUFELEVBQXFDO0FBQ3hEckIsSUFBQUEsT0FBTyxDQUFDQyxJQUFSLENBQWEsbUNBQWIsRUFBa0RvQixHQUFHLENBQUNrQixhQUFKLEVBQWxELEVBQXVFbEIsR0FBRyxDQUFDMkMsT0FBSixFQUF2RTtBQUNBLFNBQUtGLFVBQUwsQ0FBZ0J6QyxHQUFoQixFQUFxQlAsbUNBQWlCb0wseUJBQXRDO0FBQ0EsU0FBS3hHLGVBQUwsQ0FBcUJyRSxHQUFyQixFQUEwQixDQUExQjtBQUVBLFFBQUlrTixJQUFJLEdBQUdsTixHQUFHLENBQUNvQixRQUFKLENBQWEsQ0FBYixDQUFYO0FBQ0EsUUFBSXFMLFFBQVEsR0FBR3pNLEdBQUcsQ0FBQ29CLFFBQUosQ0FBYSxDQUFiLEVBQWdCdUIsT0FBaEIsRUFBZixDQU53RCxDQU1kOztBQUMxQyxRQUFJd0ssS0FBSyxHQUFHbk4sR0FBRyxDQUFDb0IsUUFBSixDQUFhLENBQWIsQ0FBWjs7QUFDQSxRQUFJdUwsR0FBRyxHQUFHLEtBQUtTLHNCQUFMLENBQTRCRixJQUE1QixDQUFWOztBQUNBLFFBQUlOLEdBQUcsR0FBRyxLQUFLUSxzQkFBTCxDQUE0QkQsS0FBNUIsQ0FBVjs7QUFFQSxXQUFPLEtBQUt0TCxRQUFMLENBQWMsSUFBSXdMLHVCQUFKLENBQXFCWixRQUFyQixFQUErQkUsR0FBL0IsRUFBb0NDLEdBQXBDLENBQWQsRUFBd0QsRUFBeEQsQ0FBUDtBQUNILEdBLzJCK0MsQ0FrM0JoRDs7O0FBQ0FVLEVBQUFBLHFCQUFxQixDQUFDdE4sR0FBRCxFQUFtQjtBQUNwQ3JCLElBQUFBLE9BQU8sQ0FBQ2dJLEtBQVIsQ0FBYyxpQkFBZDtBQUVILEdBdDNCK0MsQ0F5M0JoRDs7O0FBQ0FpRSxFQUFBQSw2QkFBNkIsQ0FBQzVLLEdBQUQsRUFBcUM7QUFDOURyQixJQUFBQSxPQUFPLENBQUNDLElBQVIsQ0FBYSx5Q0FBYixFQUF3RG9CLEdBQUcsQ0FBQ2tCLGFBQUosRUFBeEQsRUFBNkVsQixHQUFHLENBQUMyQyxPQUFKLEVBQTdFO0FBQ0EsU0FBS0YsVUFBTCxDQUFnQnpDLEdBQWhCLEVBQXFCUCxtQ0FBaUJrTCwrQkFBdEM7QUFDQSxTQUFLdEcsZUFBTCxDQUFxQnJFLEdBQXJCLEVBQTBCLENBQTFCO0FBRUEsUUFBSWtOLElBQUksR0FBR2xOLEdBQUcsQ0FBQ29CLFFBQUosQ0FBYSxDQUFiLENBQVg7QUFDQSxRQUFJcUwsUUFBUSxHQUFHek0sR0FBRyxDQUFDb0IsUUFBSixDQUFhLENBQWIsRUFBZ0J1QixPQUFoQixFQUFmLENBTjhELENBTXBCOztBQUMxQyxRQUFJd0ssS0FBSyxHQUFHbk4sR0FBRyxDQUFDb0IsUUFBSixDQUFhLENBQWIsQ0FBWjtBQUNBLFFBQUl1TCxHQUFHLEdBQUcsS0FBS1kscUJBQUwsQ0FBMkJMLElBQTNCLENBQVY7QUFDQSxRQUFJTixHQUFHLEdBQUcsS0FBS1cscUJBQUwsQ0FBMkJKLEtBQTNCLENBQVY7QUFFQSxXQUFPLEtBQUt0TCxRQUFMLENBQWMsSUFBSXdMLHVCQUFKLENBQXFCWixRQUFyQixFQUErQkUsR0FBL0IsRUFBb0NDLEdBQXBDLENBQWQsRUFBd0QsRUFBeEQsQ0FBUDtBQUNILEdBdDRCK0MsQ0F3NEJoRDs7O0FBQ0FZLEVBQUFBLHVCQUF1QixDQUFDeE4sR0FBRCxFQUFtQjtBQUN0Q3JCLElBQUFBLE9BQU8sQ0FBQ2dJLEtBQVIsQ0FBYyxpQkFBZDtBQUVILEdBNTRCK0MsQ0E4NEJoRDs7O0FBQ0FxRSxFQUFBQSw0QkFBNEIsQ0FBQ2hMLEdBQUQsRUFBbUI7QUFDM0NyQixJQUFBQSxPQUFPLENBQUNDLElBQVIsQ0FBYSx3Q0FBYixFQUF1RG9CLEdBQUcsQ0FBQ2tCLGFBQUosRUFBdkQsRUFBNEVsQixHQUFHLENBQUMyQyxPQUFKLEVBQTVFO0FBQ0EsU0FBS0YsVUFBTCxDQUFnQnpDLEdBQWhCLEVBQXFCUCxtQ0FBaUJzTCw4QkFBdEM7QUFDQSxTQUFLMUcsZUFBTCxDQUFxQnJFLEdBQXJCLEVBQTBCLENBQTFCO0FBQ0EsUUFBSWtOLElBQUksR0FBR2xOLEdBQUcsQ0FBQ29CLFFBQUosQ0FBYSxDQUFiLENBQVg7QUFDQSxRQUFJc0wsVUFBVSxHQUFHMU0sR0FBRyxDQUFDb0IsUUFBSixDQUFhLENBQWIsQ0FBakI7QUFDQSxRQUFJK0wsS0FBSyxHQUFHbk4sR0FBRyxDQUFDb0IsUUFBSixDQUFhLENBQWIsQ0FBWjtBQUNBLFNBQUtULHNCQUFMLENBQTRCK0wsVUFBNUI7QUFDQSxXQUFPLEtBQUt4Ryx1QkFBTCxDQUE2QndHLFVBQTdCLENBQVA7QUFDSCxHQXg1QitDLENBMDVCaEQ7OztBQUNBaEMsRUFBQUEsdUJBQXVCLENBQUMxSyxHQUFELEVBQXFDO0FBQ3hEckIsSUFBQUEsT0FBTyxDQUFDQyxJQUFSLENBQWEsbUNBQWIsRUFBa0RvQixHQUFHLENBQUNrQixhQUFKLEVBQWxELEVBQXVFbEIsR0FBRyxDQUFDMkMsT0FBSixFQUF2RTtBQUNBLFNBQUtGLFVBQUwsQ0FBZ0J6QyxHQUFoQixFQUFxQlAsbUNBQWlCZ0wseUJBQXRDO0FBQ0EsU0FBS3BHLGVBQUwsQ0FBcUJyRSxHQUFyQixFQUEwQixDQUExQjtBQUVBLFVBQU1rTixJQUFJLEdBQUdsTixHQUFHLENBQUNvQixRQUFKLENBQWEsQ0FBYixDQUFiO0FBQ0EsVUFBTXFMLFFBQVEsR0FBR3pNLEdBQUcsQ0FBQ29CLFFBQUosQ0FBYSxDQUFiLEVBQWdCdUIsT0FBaEIsRUFBakIsQ0FOd0QsQ0FNWjs7QUFDNUMsVUFBTXdLLEtBQUssR0FBR25OLEdBQUcsQ0FBQ29CLFFBQUosQ0FBYSxDQUFiLENBQWQ7O0FBQ0EsVUFBTXVMLEdBQUcsR0FBRyxLQUFLUyxzQkFBTCxDQUE0QkYsSUFBNUIsQ0FBWjs7QUFDQSxVQUFNTixHQUFHLEdBQUcsS0FBS1Esc0JBQUwsQ0FBNEJELEtBQTVCLENBQVosQ0FUd0QsQ0FVeEQ7OztBQUNBLFdBQU8sSUFBSUUsdUJBQUosQ0FBcUJaLFFBQXJCLEVBQStCRSxHQUEvQixFQUFvQ0MsR0FBcEMsQ0FBUDtBQUNIOztBQUVEUSxFQUFBQSxzQkFBc0IsQ0FBQ3BOLEdBQUQsRUFBb0I7QUFFdENyQixJQUFBQSxPQUFPLENBQUNDLElBQVIsQ0FBYSxnQ0FBYixFQUErQ29CLEdBQUcsQ0FBQ2tCLGFBQUosRUFBL0MsRUFBb0VsQixHQUFHLENBQUMyQyxPQUFKLEVBQXBFOztBQUNBLFFBQUkzQyxHQUFHLFlBQVlQLG1DQUFpQjBMLDJCQUFwQyxFQUFpRTtBQUM3RCxhQUFPLEtBQUtDLHlCQUFMLENBQStCcEwsR0FBL0IsQ0FBUDtBQUNILEtBRkQsTUFFTyxJQUFJQSxHQUFHLFlBQVlQLG1DQUFpQjRLLHdCQUFwQyxFQUE4RDtBQUNqRSxhQUFPLEtBQUtDLHNCQUFMLENBQTRCdEssR0FBNUIsQ0FBUDtBQUNILEtBRk0sTUFFQSxJQUFJQSxHQUFHLFlBQVlQLG1DQUFpQmdMLHlCQUFwQyxFQUErRDtBQUNsRSxhQUFPLEtBQUtDLHVCQUFMLENBQTZCMUssR0FBN0IsQ0FBUDtBQUNILEtBRk0sTUFFQSxJQUFJQSxHQUFHLFlBQVlQLG1DQUFpQmtMLCtCQUFwQyxFQUFxRTtBQUN4RSxhQUFPLEtBQUtDLDZCQUFMLENBQW1DNUssR0FBbkMsQ0FBUDtBQUNILEtBRk0sTUFFRCxJQUFJQSxHQUFHLFlBQVlQLG1DQUFpQndMLDJCQUFwQyxFQUFpRTtBQUNuRSxhQUFPLEtBQUtDLHlCQUFMLENBQStCbEwsR0FBL0IsQ0FBUDtBQUNIOztBQUNELFNBQUt3QyxpQkFBTCxDQUF1QixLQUFLekMsV0FBTCxDQUFpQkMsR0FBakIsQ0FBdkI7QUFDSCxHQXg3QitDLENBMDdCaEQ7OztBQUNBa0wsRUFBQUEseUJBQXlCLENBQUNsTCxHQUFELEVBQXFDO0FBQzFEckIsSUFBQUEsT0FBTyxDQUFDQyxJQUFSLENBQWEscUNBQWIsRUFBb0RvQixHQUFHLENBQUNrQixhQUFKLEVBQXBELEVBQXlFbEIsR0FBRyxDQUFDMkMsT0FBSixFQUF6RTtBQUNBLFNBQUtGLFVBQUwsQ0FBZ0J6QyxHQUFoQixFQUFxQlAsbUNBQWlCd0wsMkJBQXRDO0FBQ0EsU0FBSzVHLGVBQUwsQ0FBcUJyRSxHQUFyQixFQUEwQixDQUExQjtBQUNBLFVBQU1rTixJQUFJLEdBQUdsTixHQUFHLENBQUNvQixRQUFKLENBQWEsQ0FBYixDQUFiO0FBQ0EsVUFBTXFMLFFBQVEsR0FBR3pNLEdBQUcsQ0FBQ29CLFFBQUosQ0FBYSxDQUFiLEVBQWdCdUIsT0FBaEIsRUFBakIsQ0FMMEQsQ0FLZDs7QUFDNUMsVUFBTXdLLEtBQUssR0FBR25OLEdBQUcsQ0FBQ29CLFFBQUosQ0FBYSxDQUFiLENBQWQ7O0FBQ0EsVUFBTXVMLEdBQUcsR0FBRyxLQUFLUyxzQkFBTCxDQUE0QkYsSUFBNUIsQ0FBWjs7QUFDQSxVQUFNTixHQUFHLEdBQUcsS0FBS1Esc0JBQUwsQ0FBNEJELEtBQTVCLENBQVosQ0FSMEQsQ0FTMUQ7OztBQUNBLFdBQU8sSUFBSUUsdUJBQUosQ0FBcUJaLFFBQXJCLEVBQStCRSxHQUEvQixFQUFvQ0MsR0FBcEMsQ0FBUDtBQUNILEdBdDhCK0MsQ0F3OEJoRDs7O0FBQ0FhLEVBQUFBLDRCQUE0QixDQUFDek4sR0FBRCxFQUFtQjtBQUMzQ3JCLElBQUFBLE9BQU8sQ0FBQ2dJLEtBQVIsQ0FBYyxpQkFBZDtBQUNILEdBMzhCK0MsQ0E2OEJoRDs7O0FBQ0ErRyxFQUFBQSxxQkFBcUIsQ0FBQzFOLEdBQUQsRUFBbUI7QUFDcENyQixJQUFBQSxPQUFPLENBQUNnSSxLQUFSLENBQWMsaUJBQWQ7QUFFSCxHQWo5QitDLENBbzlCaEQ7OztBQUNBZ0gsRUFBQUEsa0JBQWtCLENBQUMzTixHQUFELEVBQW1CO0FBQ2pDckIsSUFBQUEsT0FBTyxDQUFDZ0ksS0FBUixDQUFjLGlCQUFkO0FBRUgsR0F4OUIrQyxDQTI5QmhEOzs7QUFDQTJELEVBQUFBLHNCQUFzQixDQUFDdEssR0FBRCxFQUFtQjtBQUNyQ3JCLElBQUFBLE9BQU8sQ0FBQ0MsSUFBUixDQUFhLG9DQUFiLEVBQW1Eb0IsR0FBRyxDQUFDa0IsYUFBSixFQUFuRCxFQUF3RWxCLEdBQUcsQ0FBQzJDLE9BQUosRUFBeEU7QUFDQSxTQUFLRixVQUFMLENBQWdCekMsR0FBaEIsRUFBcUJQLG1DQUFpQjRLLHdCQUF0QztBQUNBLFNBQUtoRyxlQUFMLENBQXFCckUsR0FBckIsRUFBMEIsQ0FBMUIsRUFIcUMsQ0FJckM7O0FBQ0EsUUFBSThCLElBQUksR0FBRzlCLEdBQUcsQ0FBQ29CLFFBQUosQ0FBYSxDQUFiLENBQVg7O0FBQ0EsUUFBSVUsSUFBSSxZQUFZckMsbUNBQWlCbU8sY0FBckMsRUFBcUQ7QUFDakQsYUFBTyxLQUFLQyxZQUFMLENBQWtCL0wsSUFBbEIsQ0FBUDtBQUNILEtBRkQsTUFFTyxJQUFJQSxJQUFJLFlBQVlyQyxtQ0FBaUJxTyxxQkFBckMsRUFBNEQ7QUFDL0QsYUFBTyxLQUFLQyxtQkFBTCxDQUF5QmpNLElBQXpCLENBQVA7QUFDSDs7QUFDRCxTQUFLVSxpQkFBTCxDQUF1QixLQUFLekMsV0FBTCxDQUFpQitCLElBQWpCLENBQXZCO0FBQ0gsR0F4K0IrQyxDQTArQmhEOzs7QUFDQThELEVBQUFBLDJCQUEyQixDQUFDNUYsR0FBRCxFQUFvQztBQUMzRHJCLElBQUFBLE9BQU8sQ0FBQ0MsSUFBUixDQUFhLHVDQUFiLEVBQXNEb0IsR0FBRyxDQUFDa0IsYUFBSixFQUF0RCxFQUEyRWxCLEdBQUcsQ0FBQzJDLE9BQUosRUFBM0U7QUFDQSxTQUFLRixVQUFMLENBQWdCekMsR0FBaEIsRUFBcUJQLG1DQUFpQmtHLDZCQUF0QztBQUNBLFNBQUt0QixlQUFMLENBQXFCckUsR0FBckIsRUFBMEIsQ0FBMUI7QUFDQSxVQUFNOEIsSUFBSSxHQUFHOUIsR0FBRyxDQUFDb0IsUUFBSixDQUFhLENBQWIsQ0FBYjtBQUNBLFVBQU1vSCxRQUFRLEdBQUcsS0FBS1IsaUJBQUwsQ0FBdUJsRyxJQUF2QixDQUFqQjtBQUNBLFdBQU8sSUFBSWtNLHNCQUFKLENBQW9CeEYsUUFBcEIsQ0FBUDtBQUNIO0FBRUQ7Ozs7Ozs7QUFLQThDLEVBQUFBLHdCQUF3QixDQUFDdEwsR0FBRCxFQUEwQztBQUM5RHJCLElBQUFBLE9BQU8sQ0FBQ0MsSUFBUixDQUFhLHVDQUFiLEVBQXNEb0IsR0FBRyxDQUFDa0IsYUFBSixFQUF0RCxFQUEyRWxCLEdBQUcsQ0FBQzJDLE9BQUosRUFBM0U7QUFDQSxTQUFLRixVQUFMLENBQWdCekMsR0FBaEIsRUFBcUJQLG1DQUFpQjRMLDBCQUF0QztBQUNBLFNBQUtoSCxlQUFMLENBQXFCckUsR0FBckIsRUFBMEIsQ0FBMUI7QUFDQSxVQUFNaU8sSUFBSSxHQUFHLEtBQUt2RixnQkFBTCxDQUFzQjFJLEdBQUcsQ0FBQ29CLFFBQUosQ0FBYSxDQUFiLENBQXRCLENBQWI7QUFDQSxVQUFNOEgsUUFBUSxHQUFHLEtBQUtZLG1CQUFMLENBQXlCOUosR0FBRyxDQUFDb0IsUUFBSixDQUFhLENBQWIsQ0FBekIsQ0FBakI7QUFDQSxXQUFPLElBQUk4TSw2QkFBSixDQUEyQkQsSUFBM0IsRUFBaUMvRSxRQUFqQyxDQUFQO0FBQ0g7O0FBRURpRixFQUFBQSxLQUFLLENBQUNuTyxHQUFELEVBQXdCO0FBQ3pCckIsSUFBQUEsT0FBTyxDQUFDQyxJQUFSLENBQWEsVUFBYjtBQUNBLFVBQU12QixPQUFPLEdBQUcsSUFBSXFCLDBCQUFKLEVBQWhCO0FBQ0FzQixJQUFBQSxHQUFHLENBQUN2QixNQUFKLENBQVdwQixPQUFYO0FBQ0gsR0F0Z0MrQyxDQXdnQ2hEOzs7QUFDQW1PLEVBQUFBLDBCQUEwQixDQUFDeEwsR0FBRCxFQUE0QztBQUNsRXJCLElBQUFBLE9BQU8sQ0FBQ0MsSUFBUixDQUFhLHNDQUFiLEVBQXFEb0IsR0FBRyxDQUFDa0IsYUFBSixFQUFyRCxFQUEwRWxCLEdBQUcsQ0FBQzJDLE9BQUosRUFBMUU7QUFDQSxTQUFLRixVQUFMLENBQWdCekMsR0FBaEIsRUFBcUJQLG1DQUFpQjhMLDRCQUF0QztBQUNBLFNBQUtsSCxlQUFMLENBQXFCckUsR0FBckIsRUFBMEIsQ0FBMUI7QUFDQSxVQUFNaU8sSUFBSSxHQUFHLEtBQUt2RixnQkFBTCxDQUFzQjFJLEdBQUcsQ0FBQ29CLFFBQUosQ0FBYSxDQUFiLENBQXRCLENBQWI7QUFDQSxVQUFNOEgsUUFBUSxHQUFHLEtBQUtoRCx1QkFBTCxDQUE2QmxHLEdBQUcsQ0FBQ29CLFFBQUosQ0FBYSxDQUFiLENBQTdCLENBQWpCO0FBQ0EsV0FBTyxJQUFJZ04sK0JBQUosQ0FBNkJILElBQTdCLEVBQW1DL0UsUUFBbkMsQ0FBUDtBQUNILEdBaGhDK0MsQ0FraENoRDs7O0FBQ0FrQyxFQUFBQSx5QkFBeUIsQ0FBQ3BMLEdBQUQsRUFBK0I7QUFDcERyQixJQUFBQSxPQUFPLENBQUNDLElBQVIsQ0FBYSxxQ0FBYixFQUFvRG9CLEdBQUcsQ0FBQ2tCLGFBQUosRUFBcEQsRUFBeUVsQixHQUFHLENBQUMyQyxPQUFKLEVBQXpFO0FBQ0EsU0FBS0YsVUFBTCxDQUFnQnpDLEdBQWhCLEVBQXFCUCxtQ0FBaUIwTCwyQkFBdEM7QUFDQSxTQUFLOUcsZUFBTCxDQUFxQnJFLEdBQXJCLEVBQTBCLENBQTFCO0FBQ0EsVUFBTXdNLFdBQVcsR0FBR3hNLEdBQUcsQ0FBQ29CLFFBQUosQ0FBYSxDQUFiLENBQXBCO0FBQ0EsVUFBTXpCLElBQUksR0FBRzZNLFdBQVcsQ0FBQzdKLE9BQVosRUFBYjtBQUNBLFdBQU8sS0FBS2QsUUFBTCxDQUFjLElBQUl1RCxpQkFBSixDQUFlekYsSUFBZixDQUFkLEVBQW9DLEtBQUs2QixRQUFMLENBQWMsS0FBS1MsVUFBTCxDQUFnQnVLLFdBQVcsQ0FBQ2pFLE1BQTVCLENBQWQsQ0FBcEMsQ0FBUDtBQUNILEdBMWhDK0MsQ0E0aENoRDs7O0FBQ0E4RixFQUFBQSxxQkFBcUIsQ0FBQ3JPLEdBQUQsRUFBbUI7QUFDcENyQixJQUFBQSxPQUFPLENBQUNnSSxLQUFSLENBQWMsaUJBQWQ7QUFDSCxHQS9oQytDLENBaWlDaEQ7OztBQUNBMkgsRUFBQUEsb0JBQW9CLENBQUN0TyxHQUFELEVBQW1CO0FBQ25DckIsSUFBQUEsT0FBTyxDQUFDZ0ksS0FBUixDQUFjLGlCQUFkO0FBQ0gsR0FwaUMrQyxDQXVpQ2hEOzs7QUFDQStFLEVBQUFBLGlDQUFpQyxDQUFDMUwsR0FBRCxFQUF3QztBQUNyRXJCLElBQUFBLE9BQU8sQ0FBQ0MsSUFBUixDQUFhLDZDQUFiLEVBQTREb0IsR0FBRyxDQUFDa0IsYUFBSixFQUE1RCxFQUFpRmxCLEdBQUcsQ0FBQzJDLE9BQUosRUFBakY7QUFDQSxTQUFLRixVQUFMLENBQWdCekMsR0FBaEIsRUFBcUJQLG1DQUFpQmdNLG1DQUF0QztBQUNBLFNBQUtwSCxlQUFMLENBQXFCckUsR0FBckIsRUFBMEIsQ0FBMUI7QUFDQSxVQUFNMk0sR0FBRyxHQUFHLEtBQUtqRSxnQkFBTCxDQUFzQjFJLEdBQUcsQ0FBQ29CLFFBQUosQ0FBYSxDQUFiLENBQXRCLENBQVo7QUFDQSxVQUFNcUwsUUFBUSxHQUFHek0sR0FBRyxDQUFDb0IsUUFBSixDQUFhLENBQWIsRUFBZ0J1QixPQUFoQixFQUFqQjtBQUNBLFVBQU1pSyxHQUFHLEdBQUcsS0FBSzFHLHVCQUFMLENBQTZCbEcsR0FBRyxDQUFDb0IsUUFBSixDQUFhLENBQWIsQ0FBN0IsQ0FBWjtBQUVBLFdBQU8sS0FBS1MsUUFBTCxDQUFjLElBQUlnTCwyQkFBSixDQUF5QkosUUFBekIsRUFBbUNFLEdBQW5DLEVBQXdDQyxHQUF4QyxDQUFkLENBQVA7QUFDSCxHQWpqQytDLENBb2pDaEQ7OztBQUNBMkIsRUFBQUEsbUJBQW1CLENBQUN2TyxHQUFELEVBQW1CO0FBQ2xDckIsSUFBQUEsT0FBTyxDQUFDZ0ksS0FBUixDQUFjLGlCQUFkO0FBRUgsR0F4akMrQyxDQTBqQ2hEOzs7QUFDQTZILEVBQUFBLHVCQUF1QixDQUFDeE8sR0FBRCxFQUFtQjtBQUN0Q3JCLElBQUFBLE9BQU8sQ0FBQ0MsSUFBUixDQUFhLHFDQUFiLEVBQW9Eb0IsR0FBRyxDQUFDa0IsYUFBSixFQUFwRCxFQUF5RWxCLEdBQUcsQ0FBQzJDLE9BQUosRUFBekU7QUFDSCxHQTdqQytDLENBK2pDaEQ7OztBQUNBa0wsRUFBQUEsWUFBWSxDQUFDN04sR0FBRCxFQUE0QjtBQUNwQ3JCLElBQUFBLE9BQU8sQ0FBQ0MsSUFBUixDQUFhLDBCQUFiLEVBQXlDb0IsR0FBRyxDQUFDa0IsYUFBSixFQUF6QyxFQUE4RGxCLEdBQUcsQ0FBQzJDLE9BQUosRUFBOUQ7QUFDQSxTQUFLRixVQUFMLENBQWdCekMsR0FBaEIsRUFBcUJQLG1DQUFpQm1PLGNBQXRDO0FBQ0EsU0FBS3ZKLGVBQUwsQ0FBcUJyRSxHQUFyQixFQUEwQixDQUExQjtBQUNBLFVBQU04QixJQUFpQixHQUFHOUIsR0FBRyxDQUFDb0IsUUFBSixDQUFhLENBQWIsQ0FBMUI7O0FBRUEsUUFBSVUsSUFBSSxDQUFDWixhQUFMLE1BQXdCLENBQTVCLEVBQStCO0FBQzNCLGFBQU8sS0FBSzJJLGtCQUFMLENBQXdCL0gsSUFBeEIsQ0FBUDtBQUNILEtBRkQsTUFHSyxJQUFJQSxJQUFJLENBQUNaLGFBQUwsTUFBd0IsQ0FBNUIsRUFBK0I7QUFDaEMsVUFBSVksSUFBSSxZQUFZckMsbUNBQWlCcU8scUJBQXJDLEVBQTREO0FBQ3hELGVBQU8sS0FBS0MsbUJBQUwsQ0FBeUJqTSxJQUF6QixDQUFQO0FBQ0g7O0FBQ0QsV0FBS1UsaUJBQUwsQ0FBdUIsS0FBS3pDLFdBQUwsQ0FBaUIrQixJQUFqQixDQUF2QjtBQUNIOztBQUNELFNBQUtVLGlCQUFMLENBQXVCLEtBQUt6QyxXQUFMLENBQWlCK0IsSUFBakIsQ0FBdkI7QUFDSCxHQWhsQytDLENBa2xDaEQ7OztBQUNBaU0sRUFBQUEsbUJBQW1CLENBQUMvTixHQUFELEVBQTRCO0FBQzNDckIsSUFBQUEsT0FBTyxDQUFDQyxJQUFSLENBQWEsaUNBQWIsRUFBZ0RvQixHQUFHLENBQUNrQixhQUFKLEVBQWhELEVBQXFFbEIsR0FBRyxDQUFDMkMsT0FBSixFQUFyRTtBQUNBLFNBQUtGLFVBQUwsQ0FBZ0J6QyxHQUFoQixFQUFxQlAsbUNBQWlCcU8scUJBQXRDO0FBQ0EsU0FBS3pKLGVBQUwsQ0FBcUJyRSxHQUFyQixFQUEwQixDQUExQjtBQUNBLFVBQU1yQyxLQUFLLEdBQUdxQyxHQUFHLENBQUMyQyxPQUFKLEVBQWQsQ0FKMkMsQ0FLM0M7O0FBQ0EsVUFBTThMLE9BQU8sR0FBRyxJQUFJQyxjQUFKLENBQVlDLE1BQU0sQ0FBQ2hSLEtBQUQsQ0FBbEIsRUFBMkJBLEtBQTNCLENBQWhCO0FBQ0EsV0FBTyxLQUFLa0UsUUFBTCxDQUFjNE0sT0FBZCxFQUF1QixLQUFLak4sUUFBTCxDQUFjLEtBQUtTLFVBQUwsQ0FBZ0JqQyxHQUFHLENBQUNpRCxpQkFBSixFQUFoQixDQUFkLENBQXZCLENBQVA7QUFDSDs7QUFFRDRHLEVBQUFBLGtCQUFrQixDQUFDN0osR0FBRCxFQUE0QjtBQUMxQ3JCLElBQUFBLE9BQU8sQ0FBQ0MsSUFBUixDQUFhLCtCQUFiLEVBQThDb0IsR0FBRyxDQUFDa0IsYUFBSixFQUE5QyxFQUFtRWxCLEdBQUcsQ0FBQzJDLE9BQUosRUFBbkU7QUFDQSxVQUFNaEYsS0FBSyxHQUFHcUMsR0FBRyxDQUFDMkMsT0FBSixFQUFkO0FBQ0EsVUFBTThMLE9BQU8sR0FBRyxJQUFJQyxjQUFKLENBQVkvUSxLQUFaLEVBQW1CQSxLQUFuQixDQUFoQjtBQUNBLFdBQU8sS0FBS2tFLFFBQUwsQ0FBYzRNLE9BQWQsRUFBdUIsS0FBS2pOLFFBQUwsQ0FBYyxLQUFLUyxVQUFMLENBQWdCakMsR0FBRyxDQUFDaUQsaUJBQUosRUFBaEIsQ0FBZCxDQUF2QixDQUFQO0FBQ0gsR0FsbUMrQyxDQW9tQ2hEOzs7QUFDQTZHLEVBQUFBLG1CQUFtQixDQUFDOUosR0FBRCxFQUErQjtBQUM5Q3JCLElBQUFBLE9BQU8sQ0FBQ0MsSUFBUixDQUFhLGdDQUFiLEVBQStDb0IsR0FBRyxDQUFDa0IsYUFBSixFQUEvQyxFQUFvRWxCLEdBQUcsQ0FBQzJDLE9BQUosRUFBcEU7QUFDQSxTQUFLRixVQUFMLENBQWdCekMsR0FBaEIsRUFBcUJQLG1DQUFpQm1QLHFCQUF0QztBQUNBLFNBQUt2SyxlQUFMLENBQXFCckUsR0FBckIsRUFBMEIsQ0FBMUI7QUFDQSxVQUFNckMsS0FBSyxHQUFHcUMsR0FBRyxDQUFDMkMsT0FBSixFQUFkO0FBQ0EsVUFBTWtNLFVBQVUsR0FBRyxJQUFJekosaUJBQUosQ0FBZXpILEtBQWYsQ0FBbkI7QUFDQSxXQUFPLEtBQUtrRSxRQUFMLENBQWNnTixVQUFkLEVBQTBCLEtBQUtyTixRQUFMLENBQWMsS0FBS1MsVUFBTCxDQUFnQmpDLEdBQUcsQ0FBQ2lELGlCQUFKLEVBQWhCLENBQWQsQ0FBMUIsQ0FBUDtBQUNILEdBNW1DK0MsQ0E4bUNoRDs7O0FBQ0E2TCxFQUFBQSxpQkFBaUIsQ0FBQzlPLEdBQUQsRUFBbUI7QUFDaENyQixJQUFBQSxPQUFPLENBQUNDLElBQVIsQ0FBYSx3QkFBd0JvQixHQUFHLENBQUMyQyxPQUFKLEVBQXJDO0FBQ0gsR0FqbkMrQyxDQW1uQ2hEOzs7QUFDQW9NLEVBQUFBLFlBQVksQ0FBQy9PLEdBQUQsRUFBbUI7QUFDM0JyQixJQUFBQSxPQUFPLENBQUNDLElBQVIsQ0FBYSxtQkFBbUJvQixHQUFHLENBQUMyQyxPQUFKLEVBQWhDO0FBRUgsR0F2bkMrQyxDQTBuQ2hEOzs7QUFDQXFNLEVBQUFBLHVCQUF1QixDQUFDaFAsR0FBRCxFQUFtQjtBQUN0Q3JCLElBQUFBLE9BQU8sQ0FBQ2dJLEtBQVIsQ0FBYyxpQkFBZDtBQUNILEdBN25DK0MsQ0ErbkNoRDs7O0FBQ0FzSSxFQUFBQSxXQUFXLENBQUNqUCxHQUFELEVBQW1CO0FBQzFCckIsSUFBQUEsT0FBTyxDQUFDZ0ksS0FBUixDQUFjLGlCQUFkO0FBQ0gsR0Fsb0MrQyxDQW1vQ2hEOzs7QUFDQXVJLEVBQUFBLFdBQVcsQ0FBQ2xQLEdBQUQsRUFBbUI7QUFDMUJyQixJQUFBQSxPQUFPLENBQUNnSSxLQUFSLENBQWMsaUJBQWQ7QUFDSCxHQXRvQytDLENBd29DaEQ7OztBQUNBd0ksRUFBQUEsUUFBUSxDQUFDblAsR0FBRCxFQUFtQixDQUUxQixDQUZPLENBQ0o7QUFHSjs7O0FBQ0FvUCxFQUFBQSxRQUFRLENBQUNwUCxHQUFELEVBQW1CO0FBQ3ZCckIsSUFBQUEsT0FBTyxDQUFDZ0ksS0FBUixDQUFjLGlCQUFkO0FBQ0g7O0FBaHBDK0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBhbnRscjQgZnJvbSBcImFudGxyNFwiXG5pbXBvcnQgeyBFQ01BU2NyaXB0VmlzaXRvciBhcyBEZWx2ZW5WaXNpdG9yIH0gZnJvbSBcIi4vcGFyc2VyL0VDTUFTY3JpcHRWaXNpdG9yXCJcbmltcG9ydCB7IEVDTUFTY3JpcHRQYXJzZXIgYXMgRGVsdmVuUGFyc2VyLCBFQ01BU2NyaXB0UGFyc2VyIH0gZnJvbSBcIi4vcGFyc2VyL0VDTUFTY3JpcHRQYXJzZXJcIlxuaW1wb3J0IHsgRUNNQVNjcmlwdExleGVyIGFzIERlbHZlbkxleGVyIH0gZnJvbSBcIi4vcGFyc2VyL0VDTUFTY3JpcHRMZXhlclwiXG5pbXBvcnQgeyBSdWxlQ29udGV4dCB9IGZyb20gXCJhbnRscjQvUnVsZUNvbnRleHRcIlxuaW1wb3J0IHsgUHJpbnRWaXNpdG9yIH0gZnJvbSBcIi4vUHJpbnRWaXNpdG9yXCJcbmltcG9ydCBBU1ROb2RlIGZyb20gXCIuL0FTVE5vZGVcIjtcbmltcG9ydCB7IEV4cHJlc3Npb25TdGF0ZW1lbnQsIExpdGVyYWwsIFNjcmlwdCwgQmxvY2tTdGF0ZW1lbnQsIFN0YXRlbWVudCwgU2VxdWVuY2VFeHByZXNzaW9uLCBUaHJvd1N0YXRlbWVudCwgQXNzaWdubWVudEV4cHJlc3Npb24sIElkZW50aWZpZXIsIEJpbmFyeUV4cHJlc3Npb24sIEFycmF5RXhwcmVzc2lvbiwgT2JqZWN0RXhwcmVzc2lvbiwgT2JqZWN0RXhwcmVzc2lvblByb3BlcnR5LCBQcm9wZXJ0eSwgUHJvcGVydHlLZXksIFZhcmlhYmxlRGVjbGFyYXRpb24sIFZhcmlhYmxlRGVjbGFyYXRvciwgRXhwcmVzc2lvbiwgSWZTdGF0ZW1lbnQsIENvbXB1dGVkTWVtYmVyRXhwcmVzc2lvbiwgU3RhdGljTWVtYmVyRXhwcmVzc2lvbiB9IGZyb20gXCIuL25vZGVzXCI7XG5pbXBvcnQgeyBTeW50YXggfSBmcm9tIFwiLi9zeW50YXhcIjtcbmltcG9ydCB7IHR5cGUgfSBmcm9tIFwib3NcIlxuaW1wb3J0ICogYXMgZnMgZnJvbSBcImZzXCJcbmltcG9ydCB7IEludGVydmFsIH0gZnJvbSBcImFudGxyNFwiXG5cbi8qKlxuICogVmVyc2lvbiB0aGF0IHdlIGdlbmVyYXRlIHRoZSBBU1QgZm9yLiBcbiAqIFRoaXMgYWxsb3dzIGZvciB0ZXN0aW5nIGRpZmZlcmVudCBpbXBsZW1lbnRhdGlvbnNcbiAqIFxuICogQ3VycmVudGx5IG9ubHkgRUNNQVNjcmlwdCBpcyBzdXBwb3J0ZWRcbiAqIFxuICogaHR0cHM6Ly9naXRodWIuY29tL2VzdHJlZS9lc3RyZWVcbiAqL1xuZXhwb3J0IGVudW0gUGFyc2VyVHlwZSB7IEVDTUFTY3JpcHQgfVxuZXhwb3J0IHR5cGUgU291cmNlVHlwZSA9IFwiY29kZVwiIHwgXCJmaWxlbmFtZVwiO1xuZXhwb3J0IHR5cGUgU291cmNlQ29kZSA9IHtcbiAgICB0eXBlOiBTb3VyY2VUeXBlLFxuICAgIHZhbHVlOiBzdHJpbmdcbn1cbmV4cG9ydCBpbnRlcmZhY2UgTWFya2VyIHtcbiAgICBpbmRleDogbnVtYmVyO1xuICAgIGxpbmU6IG51bWJlcjtcbiAgICBjb2x1bW46IG51bWJlcjtcbn1cblxuZXhwb3J0IGRlZmF1bHQgYWJzdHJhY3QgY2xhc3MgQVNUUGFyc2VyIHtcbiAgICBwcml2YXRlIHZpc2l0b3I6ICh0eXBlb2YgRGVsdmVuVmlzaXRvciB8IG51bGwpXG5cbiAgICBjb25zdHJ1Y3Rvcih2aXNpdG9yPzogRGVsdmVuQVNUVmlzaXRvcikge1xuICAgICAgICB0aGlzLnZpc2l0b3IgPSB2aXNpdG9yIHx8IG5ldyBEZWx2ZW5BU1RWaXNpdG9yKCk7XG4gICAgfVxuXG4gICAgZ2VuZXJhdGUoc291cmNlOiBTb3VyY2VDb2RlKTogQVNUTm9kZSB7XG4gICAgICAgIGxldCBjb2RlO1xuICAgICAgICBzd2l0Y2ggKHNvdXJjZS50eXBlKSB7XG4gICAgICAgICAgICBjYXNlIFwiY29kZVwiOlxuICAgICAgICAgICAgICAgIGNvZGUgPSBzb3VyY2UudmFsdWU7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwiZmlsZW5hbWVcIjpcbiAgICAgICAgICAgICAgICBjb2RlID0gZnMucmVhZEZpbGVTeW5jKHNvdXJjZS52YWx1ZSwgXCJ1dGY4XCIpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGNoYXJzID0gbmV3IGFudGxyNC5JbnB1dFN0cmVhbShjb2RlKTtcbiAgICAgICAgbGV0IGxleGVyID0gbmV3IERlbHZlbkxleGVyKGNoYXJzKTtcbiAgICAgICAgbGV0IHRva2VucyA9IG5ldyBhbnRscjQuQ29tbW9uVG9rZW5TdHJlYW0obGV4ZXIpO1xuICAgICAgICBsZXQgcGFyc2VyID0gbmV3IERlbHZlblBhcnNlcih0b2tlbnMpO1xuICAgICAgICBsZXQgdHJlZSA9IHBhcnNlci5wcm9ncmFtKCk7XG4gICAgICAgIC8vIGNvbnNvbGUuaW5mbyh0cmVlLnRvU3RyaW5nVHJlZSgpKVxuICAgICAgICB0cmVlLmFjY2VwdChuZXcgUHJpbnRWaXNpdG9yKCkpO1xuICAgICAgICBjb25zb2xlLmluZm8oXCItLS0tLS0tLS0tLS0tLS0tLS0tLS1cIik7XG4gICAgICAgIGxldCByZXN1bHQgPSB0cmVlLmFjY2VwdCh0aGlzLnZpc2l0b3IpO1xuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFBhcnNlIHNvdXJjZSBhbmQgZ2VuZXJlYXRlIEFTVCB0cmVlXG4gICAgICogQHBhcmFtIHNvdXJjZSBcbiAgICAgKiBAcGFyYW0gdHlwZSBcbiAgICAgKi9cbiAgICBzdGF0aWMgcGFyc2Uoc291cmNlOiBTb3VyY2VDb2RlLCB0eXBlPzogUGFyc2VyVHlwZSk6IEFTVE5vZGUge1xuICAgICAgICBpZiAodHlwZSA9PSBudWxsKVxuICAgICAgICAgICAgdHlwZSA9IFBhcnNlclR5cGUuRUNNQVNjcmlwdDtcbiAgICAgICAgbGV0IHBhcnNlcjtcbiAgICAgICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICAgICAgICBjYXNlIFBhcnNlclR5cGUuRUNNQVNjcmlwdDpcbiAgICAgICAgICAgICAgICBwYXJzZXIgPSBuZXcgQVNUUGFyc2VyRGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJVbmtvd24gcGFyc2VyIHR5cGVcIik7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcGFyc2VyLmdlbmVyYXRlKHNvdXJjZSlcbiAgICB9XG59XG5cbmNsYXNzIEFTVFBhcnNlckRlZmF1bHQgZXh0ZW5kcyBBU1RQYXJzZXIge1xuXG59XG5cbmV4cG9ydCBjbGFzcyBEZWx2ZW5BU1RWaXNpdG9yIGV4dGVuZHMgRGVsdmVuVmlzaXRvciB7XG4gICAgcHJpdmF0ZSBydWxlVHlwZU1hcDogTWFwPG51bWJlciwgc3RyaW5nPiA9IG5ldyBNYXAoKTtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLnNldHVwVHlwZVJ1bGVzKCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzZXR1cFR5cGVSdWxlcygpIHtcbiAgICAgICAgY29uc3Qga2V5cyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKEVDTUFTY3JpcHRQYXJzZXIpO1xuICAgICAgICBmb3IgKHZhciBrZXkgaW4ga2V5cykge1xuICAgICAgICAgICAgbGV0IG5hbWUgPSBrZXlzW2tleV07XG4gICAgICAgICAgICBpZiAobmFtZS5zdGFydHNXaXRoKCdSVUxFXycpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5ydWxlVHlwZU1hcC5zZXQocGFyc2VJbnQoRUNNQVNjcmlwdFBhcnNlcltuYW1lXSksIG5hbWUpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGR1bXBDb250ZXh0KGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc3Qga2V5cyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKEVDTUFTY3JpcHRQYXJzZXIpO1xuICAgICAgICBsZXQgY29udGV4dCA9IFtdXG4gICAgICAgIGZvciAodmFyIGtleSBpbiBrZXlzKSB7XG4gICAgICAgICAgICBsZXQgbmFtZSA9IGtleXNba2V5XTtcbiAgICAgICAgICAgIC8vIHRoaXMgb25seSB0ZXN0IGluaGVyaXRhbmNlXG4gICAgICAgICAgICBpZiAobmFtZS5lbmRzV2l0aCgnQ29udGV4dCcpKSB7XG4gICAgICAgICAgICAgICAgaWYgKGN0eCBpbnN0YW5jZW9mIEVDTUFTY3JpcHRQYXJzZXJbbmFtZV0pIHtcbiAgICAgICAgICAgICAgICAgICAgY29udGV4dC5wdXNoKG5hbWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGRpcnkgaGFjayBmb3Igd2Fsa2luZyBhbnRsZXIgZGVwZW5jeSBjaGFpbiBcbiAgICAgICAgLy8gZmluZCBsb25nZXN0IGRlcGVuZGVuY3kgY2hhaW5nO1xuICAgICAgICAvLyB0aGlzIHRyYXZlcnNhbCBpcyBzcGVjaWZpYyB0byBBTlRMIHBhcnNlclxuICAgICAgICAvLyBXZSB3YW50IHRvIGJlIGFibGUgdG8gZmluZCBkZXBlbmRlbmNpZXMgc3VjaCBhcztcbiAgICAgICAgLypcbiAgICAgICAgICAgIC0tLS0tLS0tIC0tLS0tLS0tLS0tLVxuICAgICAgICAgICAgUHJvcGVydHlFeHByZXNzaW9uQXNzaWdubWVudENvbnRleHRcbiAgICAgICAgICAgICoqIFByb3BlcnR5QXNzaWdubWVudENvbnRleHRcbiAgICAgICAgICAgICoqIFBhcnNlclJ1bGVDb250ZXh0XG4gICAgICAgICAgICAtLS0tLS0tLSAtLS0tLS0tLS0tLS1cbiAgICAgICAgICAgIFByb3BlcnR5QXNzaWdubWVudENvbnRleHRcbiAgICAgICAgICAgICoqIFBhcnNlclJ1bGVDb250ZXh0XG4gICAgICAgICAqL1xuICAgICAgICBpZiAoY29udGV4dC5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICBsZXQgY29udGV4dE5hbWU7XG4gICAgICAgICAgICBsZXQgbG9uZ2VzdCA9IDA7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGtleSBpbiBjb250ZXh0KSB7XG4gICAgICAgICAgICAgICAgY29uc3QgbmFtZSA9IGNvbnRleHRba2V5XTtcbiAgICAgICAgICAgICAgICBsZXQgb2JqID0gRUNNQVNjcmlwdFBhcnNlcltuYW1lXTtcbiAgICAgICAgICAgICAgICBsZXQgY2hhaW4gPSAxO1xuICAgICAgICAgICAgICAgIGRvIHtcbiAgICAgICAgICAgICAgICAgICAgKytjaGFpbjtcbiAgICAgICAgICAgICAgICAgICAgb2JqID0gRUNNQVNjcmlwdFBhcnNlcltvYmoucHJvdG90eXBlLl9fcHJvdG9fXy5jb25zdHJ1Y3Rvci5uYW1lXTtcbiAgICAgICAgICAgICAgICB9IHdoaWxlIChvYmogJiYgb2JqLnByb3RvdHlwZSlcbiAgICAgICAgICAgICAgICBpZiAoY2hhaW4gPiBsb25nZXN0KSB7XG4gICAgICAgICAgICAgICAgICAgIGxvbmdlc3QgPSBjaGFpbjtcbiAgICAgICAgICAgICAgICAgICAgY29udGV4dE5hbWUgPSBgJHtuYW1lfSBbICoqICR7Y2hhaW59XWA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIFtjb250ZXh0TmFtZV07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNvbnRleHQ7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBkdW1wQ29udGV4dEFsbENoaWxkcmVuKGN0eDogUnVsZUNvbnRleHQsIGluZGVudDogbnVtYmVyID0gMCkge1xuICAgICAgICBjb25zdCBwYWQgPSBcIiBcIi5wYWRTdGFydChpbmRlbnQsIFwiXFx0XCIpO1xuICAgICAgICBjb25zdCBub2RlcyA9IHRoaXMuZHVtcENvbnRleHQoY3R4KTtcbiAgICAgICAgaWYgKG5vZGVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGNvbnN0IG1hcmtlciA9IGluZGVudCA9PSAwID8gXCIgIyBcIiA6IFwiICogXCI7XG4gICAgICAgICAgICBjb25zb2xlLmluZm8ocGFkICsgbWFya2VyICsgbm9kZXMpXG4gICAgICAgIH1cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjdHguZ2V0Q2hpbGRDb3VudCgpOyArK2kpIHtcbiAgICAgICAgICAgIGxldCBjaGlsZCA9IGN0eD8uZ2V0Q2hpbGQoaSk7XG4gICAgICAgICAgICBpZiAoY2hpbGQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmR1bXBDb250ZXh0QWxsQ2hpbGRyZW4oY2hpbGQsICsraW5kZW50KTtcbiAgICAgICAgICAgICAgICAtLWluZGVudDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldCBydWxlIG5hbWUgYnkgdGhlIElkXG4gICAgICogQHBhcmFtIGlkIFxuICAgICAqL1xuICAgIGdldFJ1bGVCeUlkKGlkOiBudW1iZXIpOiBzdHJpbmcgfCB1bmRlZmluZWQge1xuICAgICAgICByZXR1cm4gdGhpcy5ydWxlVHlwZU1hcC5nZXQoaWQpO1xuICAgIH1cblxuICAgIHByaXZhdGUgYXNNYXJrZXIobWV0YWRhdGE6IGFueSkge1xuICAgICAgICByZXR1cm4geyBpbmRleDogMSwgbGluZTogMSwgY29sdW1uOiAxIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGRlY29yYXRlKG5vZGU6IGFueSwgbWFya2VyOiBNYXJrZXIpOiBhbnkge1xuICAgICAgICBub2RlLnN0YXJ0ID0gMDtcbiAgICAgICAgbm9kZS5lbmQgPSAwO1xuICAgICAgICByZXR1cm4gbm9kZTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFzTWV0YWRhdGEoaW50ZXJ2YWw6IEludGVydmFsKTogYW55IHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHN0YXJ0OiB7XG4gICAgICAgICAgICAgICAgbGluZTogMSxcbiAgICAgICAgICAgICAgICBjb2x1bW46IGludGVydmFsLnN0YXJ0LFxuICAgICAgICAgICAgICAgIG9mZnNldDogMFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGVuZDoge1xuICAgICAgICAgICAgICAgIGxpbmU6IDEsXG4gICAgICAgICAgICAgICAgY29sdW1uOiBpbnRlcnZhbC5zdG9wLFxuICAgICAgICAgICAgICAgIG9mZnNldDogM1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSB0aHJvd1R5cGVFcnJvcih0eXBlSWQ6IGFueSkge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiVW5oYW5kbGVkIHR5cGUgOiBcIiArIHR5cGVJZCArIFwiIDogXCIgKyB0aGlzLmdldFJ1bGVCeUlkKHR5cGVJZCkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRocm93IFR5cGVFcnJvciBvbmx5IHdoZW4gdGhlcmUgaXMgYSB0eXBlIHByb3ZpZGVkLiBcbiAgICAgKiBUaGlzIGlzIHVzZWZ1bGwgd2hlbiB0aGVyZSBub2RlIGl0YSBUZXJtaW5hbE5vZGUgXG4gICAgICogQHBhcmFtIHR5cGUgXG4gICAgICovXG4gICAgcHJpdmF0ZSB0aHJvd0luc2FuY2VFcnJvcih0eXBlOiBhbnkpOiB2b2lkIHtcbiAgICAgICAgLyogICAgICAgICBpZiAodHlwZSA9PSB1bmRlZmluZWQgfHwgdHlwZSA9PSBcIlwiKSB7XG4gICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH0gKi9cbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlVuaGFuZGxlZCBpbnN0YW5jZSB0eXBlIDogXCIgKyB0eXBlKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFzc2VydFR5cGUoY3R4OiBSdWxlQ29udGV4dCwgdHlwZTogYW55KTogdm9pZCB7XG4gICAgICAgIGlmICghKGN0eCBpbnN0YW5jZW9mIHR5cGUpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiSW52YWxpZCB0eXBlIGV4cGVjdGVkIDogJ1wiICsgdHlwZS5uYW1lICsgXCInIHJlY2VpdmVkICdcIiArIHRoaXMuZHVtcENvbnRleHQoY3R4KSkgKyBcIidcIjtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI3Byb2dyYW0uXG4gICAgdmlzaXRQcm9ncmFtKGN0eDogRUNNQVNjcmlwdFBhcnNlci5Qcm9ncmFtQ29udGV4dCk6IFNjcmlwdCB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0UHJvZ3JhbSBbJXNdIDogJXNcIiwgY3R4LmdldENoaWxkQ291bnQoKSwgY3R4LmdldFRleHQoKSk7XG4gICAgICAgIC8vIHZpc2l0UHJvZ3JhbSAtPnZpc2l0U291cmNlRWxlbWVudHMgLT4gdmlzaXRTb3VyY2VFbGVtZW50IC0+IHZpc2l0U3RhdGVtZW50XG4gICAgICAgIGxldCBzdGF0ZW1lbnRzOiBhbnkgPSBbXTtcbiAgICAgICAgbGV0IG5vZGUgPSBjdHguZ2V0Q2hpbGQoMCk7ICAvLyB2aXNpdFByb2dyYW0gLT52aXNpdFNvdXJjZUVsZW1lbnRzIFxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5vZGUuZ2V0Q2hpbGRDb3VudCgpOyArK2kpIHtcbiAgICAgICAgICAgIGxldCBzdG0gPSBub2RlLmdldENoaWxkKGkpLmdldENoaWxkKDApOyAvLyBTb3VyY2VFbGVtZW50c0NvbnRleHQgPiBTdGF0ZW1lbnRDb250ZXh0XG4gICAgICAgICAgICBpZiAoc3RtIGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5TdGF0ZW1lbnRDb250ZXh0KSB7XG4gICAgICAgICAgICAgICAgbGV0IHN0YXRlbWVudCA9IHRoaXMudmlzaXRTdGF0ZW1lbnQoc3RtKTtcbiAgICAgICAgICAgICAgICBzdGF0ZW1lbnRzLnB1c2goc3RhdGVtZW50KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy50aHJvd0luc2FuY2VFcnJvcih0aGlzLmR1bXBDb250ZXh0KHN0bSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGxldCBpbnRlcnZhbCA9IGN0eC5nZXRTb3VyY2VJbnRlcnZhbCgpO1xuICAgICAgICBsZXQgc2NyaXB0ID0gbmV3IFNjcmlwdChzdGF0ZW1lbnRzKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGVjb3JhdGUoc2NyaXB0LCB0aGlzLmFzTWFya2VyKHRoaXMuYXNNZXRhZGF0YShpbnRlcnZhbCkpKTtcbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNzdGF0ZW1lbnQuXG4gICAgdmlzaXRTdGF0ZW1lbnQoY3R4OiBSdWxlQ29udGV4dCkgOiBhbnkge1xuICAgICAgICB0aGlzLmFzc2VydFR5cGUoY3R4LCBFQ01BU2NyaXB0UGFyc2VyLlN0YXRlbWVudENvbnRleHQpXG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0U3RhdGVtZW50IFslc10gOiAlc1wiLCBjdHguZ2V0Q2hpbGRDb3VudCgpLCBjdHguZ2V0VGV4dCgpKTtcbiAgICAgICAgY29uc3Qgbm9kZTogUnVsZUNvbnRleHQgPSBjdHguZ2V0Q2hpbGQoMCk7XG5cbiAgICAgICAgaWYgKG5vZGUgaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLkV4cHJlc3Npb25TdGF0ZW1lbnRDb250ZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy52aXNpdEV4cHJlc3Npb25TdGF0ZW1lbnQobm9kZSk7XG4gICAgICAgIH0gZWxzZSBpZiAobm9kZSBpbnN0YW5jZW9mIEVDTUFTY3JpcHRQYXJzZXIuVmFyaWFibGVTdGF0ZW1lbnRDb250ZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy52aXNpdFZhcmlhYmxlU3RhdGVtZW50KG5vZGUpO1xuICAgICAgICB9IGVsc2UgaWYgKG5vZGUgaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLkJsb2NrQ29udGV4dCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmlzaXRCbG9jayhub2RlKTtcbiAgICAgICAgfWVsc2UgaWYgKG5vZGUgaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLklmU3RhdGVtZW50Q29udGV4dCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmlzaXRJZlN0YXRlbWVudChub2RlKTtcbiAgICAgICAgfSBlbHNlIGlmIChub2RlIGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5FbXB0eVN0YXRlbWVudENvbnRleHQpIHtcbiAgICAgICAgICAgIC8vIE5PT1AsXG4gICAgICAgICAgICAvLyB2YXIgeDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMudGhyb3dJbnNhbmNlRXJyb3IodGhpcy5kdW1wQ29udGV4dChub2RlKSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNibG9jay5cbiAgICAgKiAvLy8gQmxvY2sgOlxuICAgICAqIC8vLyAgICAgeyBTdGF0ZW1lbnRMaXN0PyB9XG4gICAgICovXG4gICAgdmlzaXRCbG9jayhjdHg6IFJ1bGVDb250ZXh0KTogQmxvY2tTdGF0ZW1lbnR7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0QmxvY2sgWyVzXSA6ICVzXCIsIGN0eC5nZXRDaGlsZENvdW50KCksIGN0eC5nZXRUZXh0KCkpO1xuICAgICAgICB0aGlzLmFzc2VydFR5cGUoY3R4LCBFQ01BU2NyaXB0UGFyc2VyLkJsb2NrQ29udGV4dClcbiAgICAgICAgY29uc3QgYm9keSA9IFtdO1xuICAgICAgICBmb3IgKGxldCBpID0gMTsgaSA8IGN0eC5nZXRDaGlsZENvdW50KCktMTsgKytpKSB7XG4gICAgICAgICAgICBjb25zdCBub2RlOiBSdWxlQ29udGV4dCA9IGN0eC5nZXRDaGlsZChpKTtcbiAgICAgICAgICAgIGlmIChub2RlIGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5TdGF0ZW1lbnRMaXN0Q29udGV4dCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHN0YXRlbWVudExpc3QgPSB0aGlzLnZpc2l0U3RhdGVtZW50TGlzdChub2RlKTtcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGluZGV4IGluIHN0YXRlbWVudExpc3QpIHtcbiAgICAgICAgICAgICAgICAgICAgYm9keS5wdXNoKHN0YXRlbWVudExpc3RbaW5kZXhdKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMudGhyb3dJbnNhbmNlRXJyb3IodGhpcy5kdW1wQ29udGV4dChub2RlKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHJldHVybiB0aGlzLmRlY29yYXRlKG5ldyBCbG9ja1N0YXRlbWVudChib2R5KSwgdGhpcy5hc01hcmtlcih0aGlzLmFzTWV0YWRhdGEoY3R4LmdldFNvdXJjZUludGVydmFsKCkpKSk7XG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNzdGF0ZW1lbnRMaXN0LlxuICAgIHZpc2l0U3RhdGVtZW50TGlzdChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0U3RhdGVtZW50TGlzdCBbJXNdIDogJXNcIiwgY3R4LmdldENoaWxkQ291bnQoKSwgY3R4LmdldFRleHQoKSk7XG4gICAgICAgIGNvbnN0IGJvZHkgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjdHguZ2V0Q2hpbGRDb3VudCgpOyArK2kpIHtcbiAgICAgICAgICAgIGxldCBub2RlOiBSdWxlQ29udGV4dCA9IGN0eC5nZXRDaGlsZChpKTtcbiAgICAgICAgICAgIGxldCB0eXBlID0gbm9kZS5ydWxlSW5kZXg7XG4gICAgICAgICAgICBpZiAodHlwZSA9PSBFQ01BU2NyaXB0UGFyc2VyLlJVTEVfc3RhdGVtZW50KSB7XG4gICAgICAgICAgICAgICAgbGV0IHN0YXRlbWVudDogYW55ID0gdGhpcy52aXNpdFN0YXRlbWVudChub2RlKTtcbiAgICAgICAgICAgICAgICBib2R5LnB1c2goc3RhdGVtZW50KTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZSA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMudGhyb3dUeXBlRXJyb3IodHlwZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGJvZHk7XG4gICAgfVxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjdmFyaWFibGVTdGF0ZW1lbnQuXG4gICAgdmlzaXRWYXJpYWJsZVN0YXRlbWVudChjdHg6IFJ1bGVDb250ZXh0KTogVmFyaWFibGVEZWNsYXJhdGlvbiB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0VmFyaWFibGVTdGF0ZW1lbnQgWyVzXSA6ICVzXCIsIGN0eC5nZXRDaGlsZENvdW50KCksIGN0eC5nZXRUZXh0KCkpO1xuICAgICAgICB0aGlzLmFzc2VydFR5cGUoY3R4LCBFQ01BU2NyaXB0UGFyc2VyLlZhcmlhYmxlU3RhdGVtZW50Q29udGV4dClcbiAgICAgICAgdGhpcy5hc3NlcnROb2RlQ291bnQoY3R4LCAzKTtcblxuICAgICAgICBjb25zdCBuMCA9IGN0eC5nZXRDaGlsZCgwKTsgLy8gdmFyXG4gICAgICAgIGNvbnN0IG4xID0gY3R4LmdldENoaWxkKDEpOyAvLyB2YXJpYWJsZSBsaXN0XG4gICAgICAgIGNvbnN0IG4yID0gY3R4LmdldENoaWxkKDIpOyAgLy9Fb3NDb250ZXh0XG5cbiAgICAgICAgdGhpcy5kdW1wQ29udGV4dEFsbENoaWxkcmVuKG4yKVxuICAgICAgICBjb25zdCBkZWNsYXJhdGlvbnM6IFZhcmlhYmxlRGVjbGFyYXRvcltdID0gdGhpcy52aXNpdFZhcmlhYmxlRGVjbGFyYXRpb25MaXN0KG4xKTtcbiAgICAgICAgY29uc3Qga2luZCA9IFwidmFyXCI7XG4gICAgICAgIHJldHVybiBuZXcgVmFyaWFibGVEZWNsYXJhdGlvbihkZWNsYXJhdGlvbnMsIGtpbmQpO1xuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI3ZhcmlhYmxlRGVjbGFyYXRpb25MaXN0LlxuICAgIHZpc2l0VmFyaWFibGVEZWNsYXJhdGlvbkxpc3QoY3R4OiBSdWxlQ29udGV4dCk6IFZhcmlhYmxlRGVjbGFyYXRvcltdIHtcbiAgICAgICAgY29uc29sZS5pbmZvKFwiVmFyaWFibGVEZWNsYXJhdGlvbkxpc3RDb250ZXh0IFslc10gOiAlc1wiLCBjdHguZ2V0Q2hpbGRDb3VudCgpLCBjdHguZ2V0VGV4dCgpKTtcbiAgICAgICAgdGhpcy5hc3NlcnRUeXBlKGN0eCwgRUNNQVNjcmlwdFBhcnNlci5WYXJpYWJsZURlY2xhcmF0aW9uTGlzdENvbnRleHQpXG5cbiAgICAgICAgLy90aGlzLmFzc2VydE5vZGVDb3VudChjdHgsIDMpO1xuXG4gICAgICAgIGNvbnN0IGRlY2xhcmF0aW9uczogVmFyaWFibGVEZWNsYXJhdG9yW10gPSBbXTtcbiAgICAgICAgY29uc3Qgbm9kZXMgPSB0aGlzLmZpbHRlclN5bWJvbHMoY3R4KTtcbiAgICAgICAgbm9kZXMuZm9yRWFjaChub2RlID0+IHtcbiAgICAgICAgICAgIGlmIChub2RlIGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5WYXJpYWJsZURlY2xhcmF0aW9uQ29udGV4dCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGRlY2xhcmF0aW9uID0gdGhpcy52aXNpdFZhcmlhYmxlRGVjbGFyYXRpb24obm9kZSlcbiAgICAgICAgICAgICAgICBkZWNsYXJhdGlvbnMucHVzaChkZWNsYXJhdGlvbilcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy50aHJvd0luc2FuY2VFcnJvcih0aGlzLmR1bXBDb250ZXh0KG5vZGUpKVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGRlY2xhcmF0aW9ucztcbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciN2YXJpYWJsZURlY2xhcmF0aW9uLlxuICAgIHZpc2l0VmFyaWFibGVEZWNsYXJhdGlvbihjdHg6IFJ1bGVDb250ZXh0KTogVmFyaWFibGVEZWNsYXJhdG9yIHtcbiAgICAgICAgY29uc29sZS5pbmZvKFwidmlzaXRWYXJpYWJsZURlY2xhcmF0aW9uIFslc10gOiAlc1wiLCBjdHguZ2V0Q2hpbGRDb3VudCgpLCBjdHguZ2V0VGV4dCgpKTtcbiAgICAgICAgdGhpcy5hc3NlcnRUeXBlKGN0eCwgRUNNQVNjcmlwdFBhcnNlci5WYXJpYWJsZURlY2xhcmF0aW9uQ29udGV4dClcbiAgICAgICAgLy8gbGVuZ2h0IG9mIDEgb3IgMlxuICAgICAgICAvLyAxIGB2YXIgeGBcbiAgICAgICAgLy8gMiBgdmFyIHggPSB7fWBcbiAgICAgICAgY29uc3QgdGV4dCA9IGN0eC5nZXRUZXh0KCk7XG4gICAgICAgIGNvbnN0IGlkID0gbmV3IElkZW50aWZpZXIodGV4dCk7XG4gICAgICAgIGxldCBpbml0ID0gbnVsbDtcbiAgICAgICAgaWYgKGN0eC5nZXRDaGlsZENvdW50KCkgPT0gMikge1xuICAgICAgICAgICAgaW5pdCA9IHRoaXMudmlzaXRJbml0aWFsaXNlcihjdHguZ2V0Q2hpbGQoMSkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlVua25vdyB2YXJpYWJsZSBkZWNsYXJhdGlvbiB0eXBlXCIpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXcgVmFyaWFibGVEZWNsYXJhdG9yKGlkLCBpbml0KTtcbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNpbml0aWFsaXNlci5cbiAgICB2aXNpdEluaXRpYWxpc2VyKGN0eDogUnVsZUNvbnRleHQpOiBPYmplY3RFeHByZXNzaW9uIHwgQXJyYXlFeHByZXNzaW9uIHwgdW5kZWZpbmVkIHtcbiAgICAgICAgY29uc29sZS5pbmZvKFwidmlzaXRJbml0aWFsaXNlciBbJXNdIDogJXNcIiwgY3R4LmdldENoaWxkQ291bnQoKSwgY3R4LmdldFRleHQoKSk7XG4gICAgICAgIHRoaXMuYXNzZXJ0VHlwZShjdHgsIEVDTUFTY3JpcHRQYXJzZXIuSW5pdGlhbGlzZXJDb250ZXh0KVxuICAgICAgICB0aGlzLmFzc2VydE5vZGVDb3VudChjdHgsIDIpO1xuICAgICAgICBjb25zdCBub2RlOiBSdWxlQ29udGV4dCA9IGN0eC5nZXRDaGlsZCgxKTtcbiAgICAgICAgaWYgKG5vZGUgaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLk9iamVjdExpdGVyYWxFeHByZXNzaW9uQ29udGV4dCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmlzaXRPYmplY3RMaXRlcmFsRXhwcmVzc2lvbihub2RlKTtcbiAgICAgICAgfSBlbHNlIGlmIChub2RlIGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5BcnJheUxpdGVyYWxFeHByZXNzaW9uQ29udGV4dCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmlzaXRBcnJheUxpdGVyYWxFeHByZXNzaW9uKG5vZGUpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMudGhyb3dJbnNhbmNlRXJyb3IodGhpcy5kdW1wQ29udGV4dChub2RlKSlcbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNlbXB0eVN0YXRlbWVudC5cbiAgICB2aXNpdEVtcHR5U3RhdGVtZW50KGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS5pbmZvKFwidmlzaXRFbXB0eVN0YXRlbWVudCBbJXNdIDogJXNcIiwgY3R4LmdldENoaWxkQ291bnQoKSwgY3R4LmdldFRleHQoKSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRSdWxlVHlwZShub2RlOiBhbnksIGluZGV4OiBudW1iZXIpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gbm9kZS5nZXRDaGlsZChpbmRleCkucnVsZUluZGV4O1xuICAgIH1cblxuICAgIHByaXZhdGUgYXNzZXJ0Tm9kZUNvdW50KGN0eDogUnVsZUNvbnRleHQsIGNvdW50OiBudW1iZXIpIHtcbiAgICAgICAgaWYgKGN0eC5nZXRDaGlsZENvdW50KCkgIT0gY291bnQpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIldyb25nIGNoaWxkIGNvdW50LCBleHBlY3RlZCAnXCIgKyBjb3VudCArIFwiJyBnb3QgOiBcIiArIGN0eC5nZXRDaGlsZENvdW50KCkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjZXhwcmVzc2lvblN0YXRlbWVudC5cbiAgICB2aXNpdEV4cHJlc3Npb25TdGF0ZW1lbnQoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJ2aXNpdEV4cHJlc3Npb25TdGF0ZW1lbnQgWyVzXSA6ICVzXCIsIGN0eC5nZXRDaGlsZENvdW50KCksIGN0eC5nZXRUZXh0KCkpO1xuICAgICAgICB0aGlzLmFzc2VydFR5cGUoY3R4LCBFQ01BU2NyaXB0UGFyc2VyLkV4cHJlc3Npb25TdGF0ZW1lbnRDb250ZXh0KVxuICAgICAgICB0aGlzLmFzc2VydE5vZGVDb3VudChjdHgsIDEpO1xuICAgICAgICAvLyB2aXNpdEV4cHJlc3Npb25TdGF0ZW1lbnQ6PnZpc2l0RXhwcmVzc2lvblNlcXVlbmNlXG4gICAgICAgIGNvbnN0IG5vZGU6IFJ1bGVDb250ZXh0ID0gY3R4LmdldENoaWxkKDApOyAvLyB2aXNpdEV4cHJlc3Npb25TZXF1ZW5jZSBcbiAgICAgICAgbGV0IGV4cFxuICAgICAgICBpZiAobm9kZSBpbnN0YW5jZW9mIEVDTUFTY3JpcHRQYXJzZXIuRXhwcmVzc2lvblNlcXVlbmNlQ29udGV4dCkge1xuICAgICAgICAgICAgZXhwID0gdGhpcy52aXNpdEV4cHJlc3Npb25TZXF1ZW5jZShub2RlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMudGhyb3dJbnNhbmNlRXJyb3IodGhpcy5kdW1wQ29udGV4dChub2RlKSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZXhwIC8vdGhpcy5kZWNvcmF0ZShleHAsIHRoaXMuYXNNYXJrZXIodGhpcy5hc01ldGFkYXRhKGN0eC5nZXRTb3VyY2VJbnRlcnZhbCgpKSkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogIC8vLyBJZlN0YXRlbWVudCA6XG4gICAgICogLy8vICAgICBpZiAoIEV4cHJlc3Npb24gKSBTdGF0ZW1lbnQgZWxzZSBTdGF0ZW1lbnQgICAgPT4gNyBOb2Rlc1xuICAgICAqIC8vLyAgICAgaWYgKCBFeHByZXNzaW9uICkgU3RhdGVtZW50ICAgICAgICAgICAgICAgICAgID0+IDUgTm9kZXMgICAgXG4gICAgICovXG4gICAgdmlzaXRJZlN0YXRlbWVudChjdHg6IFJ1bGVDb250ZXh0KTogSWZTdGF0ZW1lbnQge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJ2aXNpdElmU3RhdGVtZW50IFslc10gOiAlc1wiLCBjdHguZ2V0Q2hpbGRDb3VudCgpLCBjdHguZ2V0VGV4dCgpKTtcbiAgICAgICAgdGhpcy5hc3NlcnRUeXBlKGN0eCwgRUNNQVNjcmlwdFBhcnNlci5JZlN0YXRlbWVudENvbnRleHQpXG4gICAgICAgIGNvbnN0IGNvdW50ID0gY3R4LmdldENoaWxkQ291bnQoKTtcbiAgICAgICAgY29uc3QgdGVzdCA9IHRoaXMudmlzaXRFeHByZXNzaW9uU2VxdWVuY2UoY3R4LmdldENoaWxkKDIpKTtcbiAgICAgICAgY29uc3QgY29uc2VxdWVudCA9IHRoaXMudmlzaXRTdGF0ZW1lbnQoY3R4LmdldENoaWxkKDQpKTtcbiAgICAgICAgY29uc3QgYWx0ZXJuYXRlID0gY291bnQgPT0gNyA/IHRoaXMudmlzaXRTdGF0ZW1lbnQoY3R4LmdldENoaWxkKDYpKSA6IHVuZGVmaW5lZDtcblxuICAgICAgICByZXR1cm4gbmV3IElmU3RhdGVtZW50KHRlc3QsIGNvbnNlcXVlbnQsIGFsdGVybmF0ZSk7XG4gICAgfVxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjRG9TdGF0ZW1lbnQuXG4gICAgdmlzaXREb1N0YXRlbWVudChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0RG9TdGF0ZW1lbnQ6IFwiICsgY3R4LmdldFRleHQoKSk7XG5cbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI1doaWxlU3RhdGVtZW50LlxuICAgIHZpc2l0V2hpbGVTdGF0ZW1lbnQoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJ2aXNpdFdoaWxlU3RhdGVtZW50OiBcIiArIGN0eC5nZXRUZXh0KCkpO1xuXG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNGb3JTdGF0ZW1lbnQuXG4gICAgdmlzaXRGb3JTdGF0ZW1lbnQoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJ2aXNpdFdoaWxlU3RhdGVtZW50OiBcIiArIGN0eC5nZXRUZXh0KCkpO1xuXG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNGb3JWYXJTdGF0ZW1lbnQuXG4gICAgdmlzaXRGb3JWYXJTdGF0ZW1lbnQoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuXG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNGb3JJblN0YXRlbWVudC5cbiAgICB2aXNpdEZvckluU3RhdGVtZW50KGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcblxuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjRm9yVmFySW5TdGF0ZW1lbnQuXG4gICAgdmlzaXRGb3JWYXJJblN0YXRlbWVudChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG5cbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2NvbnRpbnVlU3RhdGVtZW50LlxuICAgIHZpc2l0Q29udGludWVTdGF0ZW1lbnQoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuXG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNicmVha1N0YXRlbWVudC5cbiAgICB2aXNpdEJyZWFrU3RhdGVtZW50KGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcblxuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjcmV0dXJuU3RhdGVtZW50LlxuICAgIHZpc2l0UmV0dXJuU3RhdGVtZW50KGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcblxuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjd2l0aFN0YXRlbWVudC5cbiAgICB2aXNpdFdpdGhTdGF0ZW1lbnQoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuXG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNzd2l0Y2hTdGF0ZW1lbnQuXG4gICAgdmlzaXRTd2l0Y2hTdGF0ZW1lbnQoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuXG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNjYXNlQmxvY2suXG4gICAgdmlzaXRDYXNlQmxvY2soY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuXG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNjYXNlQ2xhdXNlcy5cbiAgICB2aXNpdENhc2VDbGF1c2VzKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcblxuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjY2FzZUNsYXVzZS5cbiAgICB2aXNpdENhc2VDbGF1c2UoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuXG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNkZWZhdWx0Q2xhdXNlLlxuICAgIHZpc2l0RGVmYXVsdENsYXVzZShjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG5cbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2xhYmVsbGVkU3RhdGVtZW50LlxuICAgIHZpc2l0TGFiZWxsZWRTdGF0ZW1lbnQoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuXG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciN0aHJvd1N0YXRlbWVudC5cbiAgICB2aXNpdFRocm93U3RhdGVtZW50KGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcblxuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjdHJ5U3RhdGVtZW50LlxuICAgIHZpc2l0VHJ5U3RhdGVtZW50KGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcblxuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjY2F0Y2hQcm9kdWN0aW9uLlxuICAgIHZpc2l0Q2F0Y2hQcm9kdWN0aW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcblxuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjZmluYWxseVByb2R1Y3Rpb24uXG4gICAgdmlzaXRGaW5hbGx5UHJvZHVjdGlvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG5cbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2RlYnVnZ2VyU3RhdGVtZW50LlxuICAgIHZpc2l0RGVidWdnZXJTdGF0ZW1lbnQoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuXG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNmdW5jdGlvbkRlY2xhcmF0aW9uLlxuICAgIHZpc2l0RnVuY3Rpb25EZWNsYXJhdGlvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG5cbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2Zvcm1hbFBhcmFtZXRlckxpc3QuXG4gICAgdmlzaXRGb3JtYWxQYXJhbWV0ZXJMaXN0KGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2Z1bmN0aW9uQm9keS5cbiAgICB2aXNpdEZ1bmN0aW9uQm9keShjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0RnVuY3Rpb25Cb2R5OiBcIiArIGN0eC5nZXRUZXh0KCkpO1xuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjYXJyYXlMaXRlcmFsLlxuICAgIHZpc2l0QXJyYXlMaXRlcmFsKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS5pbmZvKFwidmlzaXRBcnJheUxpdGVyYWwgWyVzXSA6ICVzXCIsIGN0eC5nZXRDaGlsZENvdW50KCksIGN0eC5nZXRUZXh0KCkpO1xuICAgICAgICB0aGlzLmFzc2VydFR5cGUoY3R4LCBFQ01BU2NyaXB0UGFyc2VyLkFycmF5TGl0ZXJhbENvbnRleHQpXG4gICAgICAgIC8vIHdlIGp1c3QgZ290IGBbXWBcbiAgICAgICAgaWYgKGN0eC5nZXRDaGlsZENvdW50KCkgPT0gMikge1xuICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHJlc3VsdHMgPSBbXVxuICAgICAgICAvLyBza2lwIGBbIGFuZCAgXWAgXG4gICAgICAgIGZvciAobGV0IGkgPSAxOyBpIDwgY3R4LmdldENoaWxkQ291bnQoKSAtIDE7ICsraSkge1xuICAgICAgICAgICAgY29uc3Qgbm9kZTogUnVsZUNvbnRleHQgPSBjdHguZ2V0Q2hpbGQoaSk7XG4gICAgICAgICAgICBsZXQgZXhwID0gW107XG4gICAgICAgICAgICBpZiAobm9kZSBpbnN0YW5jZW9mIEVDTUFTY3JpcHRQYXJzZXIuRWxlbWVudExpc3RDb250ZXh0KSB7XG4gICAgICAgICAgICAgICAgZXhwID0gdGhpcy52aXNpdEVsZW1lbnRMaXN0KG5vZGUpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChub2RlIGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5FbGlzaW9uQ29udGV4dCkge1xuICAgICAgICAgICAgICAgIGV4cCA9IHRoaXMudmlzaXRFbGlzaW9uKG5vZGUpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBzcGVjaWFsIGNhc2UgZm9yIGhhbmRsaW5nIGVsaXNpb24gdmFsdWVzIGxpa2UgOiAgWzExLCwsMTFdIF0gIFssLF1cbiAgICAgICAgICAgICAgICBpZiAobm9kZS5zeW1ib2wgIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIGV4cCA9IFtudWxsXVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50aHJvd0luc2FuY2VFcnJvcih0aGlzLmR1bXBDb250ZXh0KG5vZGUpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXN1bHRzID0gWy4uLnJlc3VsdHMsIC4uLmV4cF07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgfVxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjZWxlbWVudExpc3QuXG4gICAgdmlzaXRFbGVtZW50TGlzdChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0RWxlbWVudExpc3QgWyVzXSA6ICVzXCIsIGN0eC5nZXRDaGlsZENvdW50KCksIGN0eC5nZXRUZXh0KCkpO1xuICAgICAgICB0aGlzLmFzc2VydFR5cGUoY3R4LCBFQ01BU2NyaXB0UGFyc2VyLkVsZW1lbnRMaXN0Q29udGV4dClcbiAgICAgICAgY29uc3QgZWxlbWVudHMgPSBbXTtcbiAgICAgICAgY29uc3Qgbm9kZXM6IFJ1bGVDb250ZXh0W10gPSB0aGlzLmZpbHRlclN5bWJvbHMoY3R4KTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgY29uc3QgZWxlbSA9IHRoaXMuc2luZ2xlRXhwcmVzc2lvbihub2Rlc1tpXSk7XG4gICAgICAgICAgICBlbGVtZW50cy5wdXNoKGVsZW0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBlbGVtZW50cztcbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNlbGlzaW9uLlxuICAgIHZpc2l0RWxpc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0RWxpc2lvbiBbJXNdIDogJXNcIiwgY3R4LmdldENoaWxkQ291bnQoKSwgY3R4LmdldFRleHQoKSk7XG4gICAgICAgIHRoaXMuYXNzZXJ0VHlwZShjdHgsIEVDTUFTY3JpcHRQYXJzZXIuRWxpc2lvbkNvbnRleHQpXG4gICAgICAgIC8vIGNvbXBsaWFuY2U6IGVzcHJpbWEgY29tcGxpYW5lIG9yIHJldHVybmluZyBgbnVsbGAgXG4gICAgICAgIGNvbnN0IGVsaXNpb24gPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjdHguZ2V0Q2hpbGRDb3VudCgpOyArK2kpIHtcbiAgICAgICAgICAgIGVsaXNpb24ucHVzaChudWxsKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZWxpc2lvbjtcbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNvYmplY3RMaXRlcmFsLlxuICAgIHZpc2l0T2JqZWN0TGl0ZXJhbChjdHg6IFJ1bGVDb250ZXh0KTogT2JqZWN0RXhwcmVzc2lvblByb3BlcnR5W10ge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJ2aXNpdE9iamVjdExpdGVyYWwgWyVzXSA6ICVzXCIsIGN0eC5nZXRDaGlsZENvdW50KCksIGN0eC5nZXRUZXh0KCkpO1xuICAgICAgICB0aGlzLmFzc2VydFR5cGUoY3R4LCBFQ01BU2NyaXB0UGFyc2VyLk9iamVjdExpdGVyYWxDb250ZXh0KTtcbiAgICAgICAgY29uc3Qgbm9kZTogUnVsZUNvbnRleHQgPSBjdHguZ2V0Q2hpbGQoMSk7XG4gICAgICAgIGlmIChub2RlIGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5Qcm9wZXJ0eU5hbWVBbmRWYWx1ZUxpc3RDb250ZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy52aXNpdFByb3BlcnR5TmFtZUFuZFZhbHVlTGlzdChub2RlKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gW107XG4gICAgfVxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjcHJvcGVydHlOYW1lQW5kVmFsdWVMaXN0LlxuICAgIHZpc2l0UHJvcGVydHlOYW1lQW5kVmFsdWVMaXN0KGN0eDogUnVsZUNvbnRleHQpOiBPYmplY3RFeHByZXNzaW9uUHJvcGVydHlbXSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0UHJvcGVydHlOYW1lQW5kVmFsdWVMaXN0IFslc10gOiAlc1wiLCBjdHguZ2V0Q2hpbGRDb3VudCgpLCBjdHguZ2V0VGV4dCgpKTtcbiAgICAgICAgdGhpcy5hc3NlcnRUeXBlKGN0eCwgRUNNQVNjcmlwdFBhcnNlci5Qcm9wZXJ0eU5hbWVBbmRWYWx1ZUxpc3RDb250ZXh0KTtcbiAgICAgICAgY29uc3QgcHJvcGVydGllczogT2JqZWN0RXhwcmVzc2lvblByb3BlcnR5W10gPSBbXTtcbiAgICAgICAgY29uc3Qgbm9kZXM6IFJ1bGVDb250ZXh0W10gPSB0aGlzLmZpbHRlclN5bWJvbHMoY3R4KTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgY29uc3Qgbm9kZSA9IG5vZGVzW2ldO1xuICAgICAgICAgICAgaWYgKG5vZGUgaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLlByb3BlcnR5RXhwcmVzc2lvbkFzc2lnbm1lbnRDb250ZXh0KSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcHJvcGVydHk6IE9iamVjdEV4cHJlc3Npb25Qcm9wZXJ0eSA9IHRoaXMudmlzaXRQcm9wZXJ0eUV4cHJlc3Npb25Bc3NpZ25tZW50KG5vZGUpO1xuICAgICAgICAgICAgICAgIHByb3BlcnRpZXMucHVzaChwcm9wZXJ0eSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMudGhyb3dJbnNhbmNlRXJyb3IodGhpcy5kdW1wQ29udGV4dChub2RlKSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcHJvcGVydGllcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBGaWx0ZXIgb3V0IFRlcm1pbmFsTm9kZXMgKGNvbW1hcywgcGlwZXMsIGJyYWNrZXRzKVxuICAgICAqIEBwYXJhbSBjdHggXG4gICAgICovXG4gICAgcHJpdmF0ZSBmaWx0ZXJTeW1ib2xzKGN0eDogUnVsZUNvbnRleHQpOiBSdWxlQ29udGV4dFtdIHtcbiAgICAgICAgY29uc3QgZmlsdGVyZWQ6IFJ1bGVDb250ZXh0W10gPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjdHguZ2V0Q2hpbGRDb3VudCgpOyArK2kpIHtcbiAgICAgICAgICAgIGNvbnN0IG5vZGUgPSBjdHguZ2V0Q2hpbGQoaSk7XG4gICAgICAgICAgICAvLyB0aGVyZSBtaWdodCBiZSBhIGJldHRlciB3YXlcbiAgICAgICAgICAgIGlmIChub2RlLnN5bWJvbCAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZpbHRlcmVkLnB1c2gobm9kZSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZpbHRlcmVkO1xuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI1Byb3BlcnR5RXhwcmVzc2lvbkFzc2lnbm1lbnQuXG4gICAgdmlzaXRQcm9wZXJ0eUV4cHJlc3Npb25Bc3NpZ25tZW50KGN0eDogUnVsZUNvbnRleHQpOiBPYmplY3RFeHByZXNzaW9uUHJvcGVydHkge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJ2aXNpdFByb3BlcnR5RXhwcmVzc2lvbkFzc2lnbm1lbnQgWyVzXSA6ICVzXCIsIGN0eC5nZXRDaGlsZENvdW50KCksIGN0eC5nZXRUZXh0KCkpO1xuICAgICAgICB0aGlzLmFzc2VydFR5cGUoY3R4LCBFQ01BU2NyaXB0UGFyc2VyLlByb3BlcnR5RXhwcmVzc2lvbkFzc2lnbm1lbnRDb250ZXh0KTtcbiAgICAgICAgdGhpcy5hc3NlcnROb2RlQ291bnQoY3R4LCAzKTtcbiAgICAgICAgbGV0IG4wID0gY3R4LmdldENoaWxkKDApOyAvLyBQcm9wZXJ0eU5hbWVcbiAgICAgICAgbGV0IG4xID0gY3R4LmdldENoaWxkKDEpOyAvLyBzeW1ib2wgOlxuICAgICAgICBsZXQgbjIgPSBjdHguZ2V0Q2hpbGQoMik7IC8vICBzaW5nbGVFeHByZXNzaW9uIFxuICAgICAgICBjb25zdCBrZXk6IFByb3BlcnR5S2V5ID0gdGhpcy52aXNpdFByb3BlcnR5TmFtZShuMCk7XG4gICAgICAgIGNvbnN0IHZhbHVlID0gdGhpcy5zaW5nbGVFeHByZXNzaW9uKG4yKTtcbiAgICAgICAgY29uc3QgY29tcHV0ZWQgPSBmYWxzZTtcbiAgICAgICAgY29uc3QgbWV0aG9kID0gZmFsc2U7XG4gICAgICAgIGNvbnN0IHNob3J0aGFuZCA9IGZhbHNlO1xuXG4gICAgICAgIHJldHVybiBuZXcgUHJvcGVydHkoXCJpbml0XCIsIGtleSwgY29tcHV0ZWQsIHZhbHVlLCBtZXRob2QsIHNob3J0aGFuZCk7XG4gICAgfVxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjUHJvcGVydHlHZXR0ZXIuXG4gICAgdmlzaXRQcm9wZXJ0eUdldHRlcihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG5cbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI1Byb3BlcnR5U2V0dGVyLlxuICAgIHZpc2l0UHJvcGVydHlTZXR0ZXIoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuXG4gICAgfVxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjcHJvcGVydHlOYW1lLlxuICAgIHZpc2l0UHJvcGVydHlOYW1lKGN0eDogUnVsZUNvbnRleHQpOiBQcm9wZXJ0eUtleSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0UHJvcGVydHlOYW1lIFslc10gOiAlc1wiLCBjdHguZ2V0Q2hpbGRDb3VudCgpLCBjdHguZ2V0VGV4dCgpKTtcbiAgICAgICAgdGhpcy5hc3NlcnRUeXBlKGN0eCwgRUNNQVNjcmlwdFBhcnNlci5Qcm9wZXJ0eU5hbWVDb250ZXh0KTtcbiAgICAgICAgdGhpcy5hc3NlcnROb2RlQ291bnQoY3R4LCAxKTtcbiAgICAgICAgY29uc3Qgbm9kZSA9IGN0eC5nZXRDaGlsZCgwKTtcbiAgICAgICAgY29uc3QgY291bnQgPSBub2RlLmdldENoaWxkQ291bnQoKTtcbiAgICAgICAgaWYgKGNvdW50ID09IDApIHsgLy8gbGl0ZXJhbFxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY3JlYXRlTGl0ZXJhbFZhbHVlKG5vZGUpO1xuICAgICAgICB9IGVsc2UgaWYgKGNvdW50ID09IDEpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnZpc2l0SWRlbnRpZmllck5hbWUobm9kZSlcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnRocm93SW5zYW5jZUVycm9yKHRoaXMuZHVtcENvbnRleHQobm9kZSkpO1xuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI3Byb3BlcnR5U2V0UGFyYW1ldGVyTGlzdC5cbiAgICB2aXNpdFByb3BlcnR5U2V0UGFyYW1ldGVyTGlzdChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG5cbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNhcmd1bWVudHMuXG4gICAgdmlzaXRBcmd1bWVudHMoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJ2aXNpdEFyZ3VtZW50czogXCIgKyBjdHguZ2V0VGV4dCgpKTtcblxuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2FyZ3VtZW50TGlzdC5cbiAgICB2aXNpdEFyZ3VtZW50TGlzdChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0QXJndW1lbnRMaXN0OiBcIiArIGN0eC5nZXRUZXh0KCkpO1xuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2V4cHJlc3Npb25TZXF1ZW5jZS5cbiAgICB2aXNpdEV4cHJlc3Npb25TZXF1ZW5jZShjdHg6IFJ1bGVDb250ZXh0KTogRXhwcmVzc2lvblN0YXRlbWVudCB8IFNlcXVlbmNlRXhwcmVzc2lvbiB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0RXhwcmVzc2lvblNlcXVlbmNlIFslc10gOiBbJXNdXCIsIGN0eC5nZXRDaGlsZENvdW50KCksIGN0eC5nZXRUZXh0KCkpO1xuICAgICAgICB0aGlzLmFzc2VydFR5cGUoY3R4LCBFQ01BU2NyaXB0UGFyc2VyLkV4cHJlc3Npb25TZXF1ZW5jZUNvbnRleHQpO1xuICAgICAgICBjb25zdCBleHByZXNzaW9ucyA9IFtdO1xuICAgICAgICAvLyBlYWNoIG5vZGUgaXMgYSBzaW5nbGVFeHByZXNzaW9uXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY3R4LmdldENoaWxkQ291bnQoKTsgKytpKSB7XG4gICAgICAgICAgICBjb25zdCBub2RlOiBSdWxlQ29udGV4dCA9IGN0eC5nZXRDaGlsZChpKTtcbiAgICAgICAgICAgIGNvbnN0IGV4cCA9IHRoaXMuc2luZ2xlRXhwcmVzc2lvbihub2RlKTtcbiAgICAgICAgICAgIGV4cHJlc3Npb25zLnB1c2goZXhwKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBjb21wbGlhbmNlOiBlc3Bpcm1hLCBlc3ByZWVcbiAgICAgICAgLy8gdGhpcyBjaGVjayB0byBzZWUgaWYgdGhlcmUgYXJlIG11bHRpcGxlIGV4cHJlc3Npb25zIGlmIHNvIHRoZW4gd2UgbGVhdmUgdGhlbSBhcyBTZXF1ZW5jZUV4cHJlc3Npb24gXG4gICAgICAgIC8vIG90aGVyd2lzZSB3ZSB3aWxsIHJvbGwgdGhlbSB1cCBpbnRvIEV4cHJlc3Npb25TdGF0ZW1lbnQgd2l0aCBvbmUgZXhwcmVzc2lvblxuICAgICAgICAvLyBgMWAgPSBFeHByZXNzaW9uU3RhdGVtZW50IC0+IExpdGVyYWxcbiAgICAgICAgLy8gYDEsIDJgID0gRXhwcmVzc2lvblN0YXRlbWVudCAtPiBTZXF1ZW5jZUV4cHJlc3Npb24gLT4gTGl0ZXJhbCwgTGl0ZXJhbFxuICAgICAgICBsZXQgZXhwO1xuICAgICAgICBpZiAoZXhwcmVzc2lvbnMubGVuZ3RoID09IDEpIHtcbiAgICAgICAgICAgIGV4cCA9IG5ldyBFeHByZXNzaW9uU3RhdGVtZW50KGV4cHJlc3Npb25zWzBdKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZXhwID0gbmV3IFNlcXVlbmNlRXhwcmVzc2lvbihleHByZXNzaW9ucyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuZGVjb3JhdGUoZXhwLCB0aGlzLmFzTWFya2VyKHRoaXMuYXNNZXRhZGF0YShjdHguZ2V0U291cmNlSW50ZXJ2YWwoKSkpKVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEV2YWx1YXRlIGEgc2luZ2xlRXhwcmVzc2lvblxuICAgICAqIEBwYXJhbSBub2RlIFxuICAgICAqL1xuICAgIHNpbmdsZUV4cHJlc3Npb24obm9kZTogUnVsZUNvbnRleHQpOiBhbnkge1xuICAgICAgICBpZiAobm9kZSBpbnN0YW5jZW9mIEVDTUFTY3JpcHRQYXJzZXIuTGl0ZXJhbEV4cHJlc3Npb25Db250ZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy52aXNpdExpdGVyYWxFeHByZXNzaW9uKG5vZGUpO1xuICAgICAgICB9IGVsc2UgaWYgKG5vZGUgaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLk9iamVjdExpdGVyYWxFeHByZXNzaW9uQ29udGV4dCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmlzaXRPYmplY3RMaXRlcmFsRXhwcmVzc2lvbihub2RlKTtcbiAgICAgICAgfSBlbHNlIGlmIChub2RlIGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5Bc3NpZ25tZW50RXhwcmVzc2lvbkNvbnRleHQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnZpc2l0QXNzaWdubWVudEV4cHJlc3Npb24obm9kZSk7XG4gICAgICAgIH0gZWxzZSBpZiAobm9kZSBpbnN0YW5jZW9mIEVDTUFTY3JpcHRQYXJzZXIuQWRkaXRpdmVFeHByZXNzaW9uQ29udGV4dCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmlzaXRBZGRpdGl2ZUV4cHJlc3Npb24obm9kZSk7XG4gICAgICAgIH0gZWxzZSBpZiAobm9kZSBpbnN0YW5jZW9mIEVDTUFTY3JpcHRQYXJzZXIuTXVsdGlwbGljYXRpdmVFeHByZXNzaW9uQ29udGV4dCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmlzaXRNdWx0aXBsaWNhdGl2ZUV4cHJlc3Npb24obm9kZSk7XG4gICAgICAgIH0gZWxzZSBpZiAobm9kZSBpbnN0YW5jZW9mIEVDTUFTY3JpcHRQYXJzZXIuQXJyYXlMaXRlcmFsRXhwcmVzc2lvbkNvbnRleHQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnZpc2l0QXJyYXlMaXRlcmFsRXhwcmVzc2lvbihub2RlKTtcbiAgICAgICAgfSBlbHNlIGlmIChub2RlIGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5FcXVhbGl0eUV4cHJlc3Npb25Db250ZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy52aXNpdEVxdWFsaXR5RXhwcmVzc2lvbihub2RlKTtcbiAgICAgICAgfSBlbHNlIGlmIChub2RlIGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5QYXJlbnRoZXNpemVkRXhwcmVzc2lvbkNvbnRleHQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnZpc2l0UGFyZW50aGVzaXplZEV4cHJlc3Npb24obm9kZSk7XG4gICAgICAgIH0gZWxzZSBpZiAobm9kZSBpbnN0YW5jZW9mIEVDTUFTY3JpcHRQYXJzZXIuUmVsYXRpb25hbEV4cHJlc3Npb25Db250ZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy52aXNpdFJlbGF0aW9uYWxFeHByZXNzaW9uKG5vZGUpO1xuICAgICAgICB9IGVsc2UgaWYgKG5vZGUgaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLklkZW50aWZpZXJFeHByZXNzaW9uQ29udGV4dCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmlzaXRJZGVudGlmaWVyRXhwcmVzc2lvbihub2RlKTtcbiAgICAgICAgfSBlbHNlIGlmIChub2RlIGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5NZW1iZXJEb3RFeHByZXNzaW9uQ29udGV4dCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmlzaXRNZW1iZXJEb3RFeHByZXNzaW9uKG5vZGUpO1xuICAgICAgICB9IGVsc2UgaWYgKG5vZGUgaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLk1lbWJlckluZGV4RXhwcmVzc2lvbkNvbnRleHQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnZpc2l0TWVtYmVySW5kZXhFeHByZXNzaW9uKG5vZGUpO1xuICAgICAgICB9ZWxzZSBpZiAobm9kZSBpbnN0YW5jZW9mIEVDTUFTY3JpcHRQYXJzZXIuQXNzaWdubWVudE9wZXJhdG9yRXhwcmVzc2lvbkNvbnRleHQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnZpc2l0QXNzaWdubWVudE9wZXJhdG9yRXhwcmVzc2lvbihub2RlKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnRocm93SW5zYW5jZUVycm9yKHRoaXMuZHVtcENvbnRleHQobm9kZSkpO1xuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI1Rlcm5hcnlFeHByZXNzaW9uLlxuICAgIHZpc2l0VGVybmFyeUV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjTG9naWNhbEFuZEV4cHJlc3Npb24uXG4gICAgdmlzaXRMb2dpY2FsQW5kRXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG5cbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI1ByZUluY3JlbWVudEV4cHJlc3Npb24uXG4gICAgdmlzaXRQcmVJbmNyZW1lbnRFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcblxuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI09iamVjdExpdGVyYWxFeHByZXNzaW9uLlxuICAgIHZpc2l0T2JqZWN0TGl0ZXJhbEV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCk6IE9iamVjdEV4cHJlc3Npb24ge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJ2aXNpdE9iamVjdExpdGVyYWxFeHByZXNzaW9uIFslc10gOiAlc1wiLCBjdHguZ2V0Q2hpbGRDb3VudCgpLCBjdHguZ2V0VGV4dCgpKTtcbiAgICAgICAgdGhpcy5hc3NlcnRUeXBlKGN0eCwgRUNNQVNjcmlwdFBhcnNlci5PYmplY3RMaXRlcmFsRXhwcmVzc2lvbkNvbnRleHQpO1xuICAgICAgICBjb25zdCBub2RlID0gY3R4LmdldENoaWxkKDApO1xuICAgICAgICBjb25zdCBwcm9wZXJ0aWVzOiBPYmplY3RFeHByZXNzaW9uUHJvcGVydHlbXSA9IHRoaXMudmlzaXRPYmplY3RMaXRlcmFsKG5vZGUpO1xuICAgICAgICByZXR1cm4gbmV3IE9iamVjdEV4cHJlc3Npb24ocHJvcGVydGllcyk7XG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNJbkV4cHJlc3Npb24uXG4gICAgdmlzaXRJbkV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuXG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNMb2dpY2FsT3JFeHByZXNzaW9uLlxuICAgIHZpc2l0TG9naWNhbE9yRXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG5cbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI05vdEV4cHJlc3Npb24uXG4gICAgdmlzaXROb3RFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcblxuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjUHJlRGVjcmVhc2VFeHByZXNzaW9uLlxuICAgIHZpc2l0UHJlRGVjcmVhc2VFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcblxuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjQXJndW1lbnRzRXhwcmVzc2lvbi5cbiAgICB2aXNpdEFyZ3VtZW50c0V4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJ2aXNpdEFyZ3VtZW50c0V4cHJlc3Npb246IFwiICsgY3R4LmdldFRleHQoKSk7XG5cblxuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjVGhpc0V4cHJlc3Npb24uXG4gICAgdmlzaXRUaGlzRXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG5cbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI0Z1bmN0aW9uRXhwcmVzc2lvbi5cbiAgICB2aXNpdEZ1bmN0aW9uRXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG5cbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI1VuYXJ5TWludXNFeHByZXNzaW9uLlxuICAgIHZpc2l0VW5hcnlNaW51c0V4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuXG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNQb3N0RGVjcmVhc2VFeHByZXNzaW9uLlxuICAgIHZpc2l0UG9zdERlY3JlYXNlRXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG5cbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI0Fzc2lnbm1lbnRFeHByZXNzaW9uLlxuICAgIHZpc2l0QXNzaWdubWVudEV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJ2aXNpdEFzc2lnbm1lbnRFeHByZXNzaW9uIFslc10gOiBbJXNdXCIsIGN0eC5nZXRDaGlsZENvdW50KCksIGN0eC5nZXRUZXh0KCkpO1xuICAgICAgICB0aGlzLmFzc2VydFR5cGUoY3R4LCBFQ01BU2NyaXB0UGFyc2VyLkFzc2lnbm1lbnRFeHByZXNzaW9uQ29udGV4dCk7XG4gICAgICAgIHRoaXMuYXNzZXJ0Tm9kZUNvdW50KGN0eCwgMylcblxuICAgICAgICBsZXQgaW5pdGlhbGlzZXIgPSBjdHguZ2V0Q2hpbGQoMCk7IC8vIElkZW50aWZpZXJFeHByZXNzaW9uQ29udGV4dFxuICAgICAgICBsZXQgb3BlcmF0b3IgPSBjdHguZ2V0Q2hpbGQoMSkuZ2V0VGV4dCgpOyAvLyBObyB0eXBlICggPSApXG4gICAgICAgIGxldCBleHByZXNzaW9uID0gY3R4LmdldENoaWxkKDIpOyAgLy9FeHByZXNzaW9uU2VxdWVuY2VDb250ZXh0XG5cbiAgICAgICAgbGV0IGxocyA9IHRoaXMudmlzaXRJZGVudGlmaWVyRXhwcmVzc2lvbihpbml0aWFsaXNlcik7XG4gICAgICAgIGxldCByaHMgPSB0aGlzLnZpc2l0RXhwcmVzc2lvblNlcXVlbmNlKGV4cHJlc3Npb24pO1xuICAgICAgICAvLyBDb21wbGlhbmNlIDogcHVsbGluZyB1cCBFeHByZXNzaW9uU3RhdGVtZW50IGludG8gQXNzaWdlbWVudEV4cHJlc3Npb25cbiAgICAgICAgbGV0IG5vZGUgPSBuZXcgQXNzaWdubWVudEV4cHJlc3Npb24ob3BlcmF0b3IsIGxocywgcmhzLmV4cHJlc3Npb24pXG4gICAgICAgIHJldHVybiBub2RlO1xuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjVHlwZW9mRXhwcmVzc2lvbi5cbiAgICB2aXNpdFR5cGVvZkV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuXG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNJbnN0YW5jZW9mRXhwcmVzc2lvbi5cbiAgICB2aXNpdEluc3RhbmNlb2ZFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcblxuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI1VuYXJ5UGx1c0V4cHJlc3Npb24uXG4gICAgdmlzaXRVbmFyeVBsdXNFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcblxuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI0RlbGV0ZUV4cHJlc3Npb24uXG4gICAgdmlzaXREZWxldGVFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNFcXVhbGl0eUV4cHJlc3Npb24uXG4gICAgdmlzaXRFcXVhbGl0eUV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCk6QmluYXJ5RXhwcmVzc2lvbiAge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJ2aXNpdEVxdWFsaXR5RXhwcmVzc2lvbiBbJXNdIDogJXNcIiwgY3R4LmdldENoaWxkQ291bnQoKSwgY3R4LmdldFRleHQoKSk7XG4gICAgICAgIHRoaXMuYXNzZXJ0VHlwZShjdHgsIEVDTUFTY3JpcHRQYXJzZXIuRXF1YWxpdHlFeHByZXNzaW9uQ29udGV4dCk7XG4gICAgICAgIHRoaXMuYXNzZXJ0Tm9kZUNvdW50KGN0eCwgMylcblxuICAgICAgICBsZXQgbGVmdCA9IGN0eC5nZXRDaGlsZCgwKTtcbiAgICAgICAgbGV0IG9wZXJhdG9yID0gY3R4LmdldENoaWxkKDEpLmdldFRleHQoKTsgLy8gTm8gdHlwZSAoICssLSApXG4gICAgICAgIGxldCByaWdodCA9IGN0eC5nZXRDaGlsZCgyKTtcbiAgICAgICAgbGV0IGxocyA9IHRoaXMuX3Zpc2l0QmluYXJ5RXhwcmVzc2lvbihsZWZ0KTtcbiAgICAgICAgbGV0IHJocyA9IHRoaXMuX3Zpc2l0QmluYXJ5RXhwcmVzc2lvbihyaWdodCk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuZGVjb3JhdGUobmV3IEJpbmFyeUV4cHJlc3Npb24ob3BlcmF0b3IsIGxocywgcmhzKSwge30pO1xuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjQml0WE9yRXhwcmVzc2lvbi5cbiAgICB2aXNpdEJpdFhPckV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuXG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNNdWx0aXBsaWNhdGl2ZUV4cHJlc3Npb24uXG4gICAgdmlzaXRNdWx0aXBsaWNhdGl2ZUV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCk6IEJpbmFyeUV4cHJlc3Npb24ge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJ2aXNpdE11bHRpcGxpY2F0aXZlRXhwcmVzc2lvbiBbJXNdIDogJXNcIiwgY3R4LmdldENoaWxkQ291bnQoKSwgY3R4LmdldFRleHQoKSk7XG4gICAgICAgIHRoaXMuYXNzZXJ0VHlwZShjdHgsIEVDTUFTY3JpcHRQYXJzZXIuTXVsdGlwbGljYXRpdmVFeHByZXNzaW9uQ29udGV4dCk7XG4gICAgICAgIHRoaXMuYXNzZXJ0Tm9kZUNvdW50KGN0eCwgMylcblxuICAgICAgICBsZXQgbGVmdCA9IGN0eC5nZXRDaGlsZCgwKTtcbiAgICAgICAgbGV0IG9wZXJhdG9yID0gY3R4LmdldENoaWxkKDEpLmdldFRleHQoKTsgLy8gTm8gdHlwZSAoICssLSApXG4gICAgICAgIGxldCByaWdodCA9IGN0eC5nZXRDaGlsZCgyKTtcbiAgICAgICAgbGV0IGxocyA9IHRoaXMudmlzaXRCaW5hcnlFeHByZXNzaW9uKGxlZnQpO1xuICAgICAgICBsZXQgcmhzID0gdGhpcy52aXNpdEJpbmFyeUV4cHJlc3Npb24ocmlnaHQpO1xuXG4gICAgICAgIHJldHVybiB0aGlzLmRlY29yYXRlKG5ldyBCaW5hcnlFeHByZXNzaW9uKG9wZXJhdG9yLCBsaHMsIHJocyksIHt9KTtcbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNCaXRTaGlmdEV4cHJlc3Npb24uXG4gICAgdmlzaXRCaXRTaGlmdEV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuXG4gICAgfVxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjUGFyZW50aGVzaXplZEV4cHJlc3Npb24uXG4gICAgdmlzaXRQYXJlbnRoZXNpemVkRXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0UGFyZW50aGVzaXplZEV4cHJlc3Npb24gWyVzXSA6ICVzXCIsIGN0eC5nZXRDaGlsZENvdW50KCksIGN0eC5nZXRUZXh0KCkpO1xuICAgICAgICB0aGlzLmFzc2VydFR5cGUoY3R4LCBFQ01BU2NyaXB0UGFyc2VyLlBhcmVudGhlc2l6ZWRFeHByZXNzaW9uQ29udGV4dCk7XG4gICAgICAgIHRoaXMuYXNzZXJ0Tm9kZUNvdW50KGN0eCwgMylcbiAgICAgICAgbGV0IGxlZnQgPSBjdHguZ2V0Q2hpbGQoMCk7XG4gICAgICAgIGxldCBleHByZXNzaW9uID0gY3R4LmdldENoaWxkKDEpO1xuICAgICAgICBsZXQgcmlnaHQgPSBjdHguZ2V0Q2hpbGQoMik7XG4gICAgICAgIHRoaXMuZHVtcENvbnRleHRBbGxDaGlsZHJlbihleHByZXNzaW9uKVxuICAgICAgICByZXR1cm4gdGhpcy52aXNpdEV4cHJlc3Npb25TZXF1ZW5jZShleHByZXNzaW9uKTtcbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNBZGRpdGl2ZUV4cHJlc3Npb24uXG4gICAgdmlzaXRBZGRpdGl2ZUV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCk6IEJpbmFyeUV4cHJlc3Npb24ge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJ2aXNpdEFkZGl0aXZlRXhwcmVzc2lvbiBbJXNdIDogJXNcIiwgY3R4LmdldENoaWxkQ291bnQoKSwgY3R4LmdldFRleHQoKSk7XG4gICAgICAgIHRoaXMuYXNzZXJ0VHlwZShjdHgsIEVDTUFTY3JpcHRQYXJzZXIuQWRkaXRpdmVFeHByZXNzaW9uQ29udGV4dCk7XG4gICAgICAgIHRoaXMuYXNzZXJ0Tm9kZUNvdW50KGN0eCwgMylcblxuICAgICAgICBjb25zdCBsZWZ0ID0gY3R4LmdldENoaWxkKDApO1xuICAgICAgICBjb25zdCBvcGVyYXRvciA9IGN0eC5nZXRDaGlsZCgxKS5nZXRUZXh0KCk7IC8vIE5vIHR5cGUgKCArLC0gKVxuICAgICAgICBjb25zdCByaWdodCA9IGN0eC5nZXRDaGlsZCgyKTtcbiAgICAgICAgY29uc3QgbGhzID0gdGhpcy5fdmlzaXRCaW5hcnlFeHByZXNzaW9uKGxlZnQpO1xuICAgICAgICBjb25zdCByaHMgPSB0aGlzLl92aXNpdEJpbmFyeUV4cHJlc3Npb24ocmlnaHQpO1xuICAgICAgICAvLyByZXR1cm4gdGhpcy5kZWNvcmF0ZShuZXcgQmluYXJ5RXhwcmVzc2lvbihvcGVyYXRvciwgbGhzICxyaHMpLCB0aGlzLmFzTWFya2VyKHRoaXMuYXNNZXRhZGF0YShjdHguc3ltYm9sKSkpO1xuICAgICAgICByZXR1cm4gbmV3IEJpbmFyeUV4cHJlc3Npb24ob3BlcmF0b3IsIGxocywgcmhzKTtcbiAgICB9XG5cbiAgICBfdmlzaXRCaW5hcnlFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpICB7XG5cbiAgICAgICAgY29uc29sZS5pbmZvKFwiZXZhbEJpbmFyeUV4cHJlc3Npb24gWyVzXSA6ICVzXCIsIGN0eC5nZXRDaGlsZENvdW50KCksIGN0eC5nZXRUZXh0KCkpO1xuICAgICAgICBpZiAoY3R4IGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5JZGVudGlmaWVyRXhwcmVzc2lvbkNvbnRleHQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnZpc2l0SWRlbnRpZmllckV4cHJlc3Npb24oY3R4KTtcbiAgICAgICAgfSBlbHNlIGlmIChjdHggaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLkxpdGVyYWxFeHByZXNzaW9uQ29udGV4dCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmlzaXRMaXRlcmFsRXhwcmVzc2lvbihjdHgpO1xuICAgICAgICB9IGVsc2UgaWYgKGN0eCBpbnN0YW5jZW9mIEVDTUFTY3JpcHRQYXJzZXIuQWRkaXRpdmVFeHByZXNzaW9uQ29udGV4dCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmlzaXRBZGRpdGl2ZUV4cHJlc3Npb24oY3R4KTtcbiAgICAgICAgfSBlbHNlIGlmIChjdHggaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLk11bHRpcGxpY2F0aXZlRXhwcmVzc2lvbkNvbnRleHQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnZpc2l0TXVsdGlwbGljYXRpdmVFeHByZXNzaW9uKGN0eCk7XG4gICAgICAgIH1lbHNlIGlmIChjdHggaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLlJlbGF0aW9uYWxFeHByZXNzaW9uQ29udGV4dCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmlzaXRSZWxhdGlvbmFsRXhwcmVzc2lvbihjdHgpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMudGhyb3dJbnNhbmNlRXJyb3IodGhpcy5kdW1wQ29udGV4dChjdHgpKTtcbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNSZWxhdGlvbmFsRXhwcmVzc2lvbi5cbiAgICB2aXNpdFJlbGF0aW9uYWxFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpOiBCaW5hcnlFeHByZXNzaW9uIHtcbiAgICAgICAgY29uc29sZS5pbmZvKFwidmlzaXRSZWxhdGlvbmFsRXhwcmVzc2lvbiBbJXNdIDogJXNcIiwgY3R4LmdldENoaWxkQ291bnQoKSwgY3R4LmdldFRleHQoKSk7XG4gICAgICAgIHRoaXMuYXNzZXJ0VHlwZShjdHgsIEVDTUFTY3JpcHRQYXJzZXIuUmVsYXRpb25hbEV4cHJlc3Npb25Db250ZXh0KTtcbiAgICAgICAgdGhpcy5hc3NlcnROb2RlQ291bnQoY3R4LCAzKVxuICAgICAgICBjb25zdCBsZWZ0ID0gY3R4LmdldENoaWxkKDApO1xuICAgICAgICBjb25zdCBvcGVyYXRvciA9IGN0eC5nZXRDaGlsZCgxKS5nZXRUZXh0KCk7IC8vIE5vIHR5cGUgKCArLC0gKVxuICAgICAgICBjb25zdCByaWdodCA9IGN0eC5nZXRDaGlsZCgyKTtcbiAgICAgICAgY29uc3QgbGhzID0gdGhpcy5fdmlzaXRCaW5hcnlFeHByZXNzaW9uKGxlZnQpO1xuICAgICAgICBjb25zdCByaHMgPSB0aGlzLl92aXNpdEJpbmFyeUV4cHJlc3Npb24ocmlnaHQpO1xuICAgICAgICAvLyByZXR1cm4gdGhpcy5kZWNvcmF0ZShuZXcgQmluYXJ5RXhwcmVzc2lvbihvcGVyYXRvciwgbGhzICxyaHMpLCB0aGlzLmFzTWFya2VyKHRoaXMuYXNNZXRhZGF0YShjdHguc3ltYm9sKSkpO1xuICAgICAgICByZXR1cm4gbmV3IEJpbmFyeUV4cHJlc3Npb24ob3BlcmF0b3IsIGxocywgcmhzKTtcbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNQb3N0SW5jcmVtZW50RXhwcmVzc2lvbi5cbiAgICB2aXNpdFBvc3RJbmNyZW1lbnRFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNCaXROb3RFeHByZXNzaW9uLlxuICAgIHZpc2l0Qml0Tm90RXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG5cbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI05ld0V4cHJlc3Npb24uXG4gICAgdmlzaXROZXdFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcblxuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjTGl0ZXJhbEV4cHJlc3Npb24uXG4gICAgdmlzaXRMaXRlcmFsRXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0TGl0ZXJhbEV4cHJlc3Npb24gWyVzXSA6IFslc11cIiwgY3R4LmdldENoaWxkQ291bnQoKSwgY3R4LmdldFRleHQoKSk7XG4gICAgICAgIHRoaXMuYXNzZXJ0VHlwZShjdHgsIEVDTUFTY3JpcHRQYXJzZXIuTGl0ZXJhbEV4cHJlc3Npb25Db250ZXh0KTtcbiAgICAgICAgdGhpcy5hc3NlcnROb2RlQ291bnQoY3R4LCAxKTtcbiAgICAgICAgLy8gdmlzaXRMaXRlcmFsRXhwcmVzc2lvbjogPiB2aXNpdExpdGVyYWxcbiAgICAgICAgbGV0IG5vZGUgPSBjdHguZ2V0Q2hpbGQoMClcbiAgICAgICAgaWYgKG5vZGUgaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLkxpdGVyYWxDb250ZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy52aXNpdExpdGVyYWwobm9kZSk7XG4gICAgICAgIH0gZWxzZSBpZiAobm9kZSBpbnN0YW5jZW9mIEVDTUFTY3JpcHRQYXJzZXIuTnVtZXJpY0xpdGVyYWxDb250ZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy52aXNpdE51bWVyaWNMaXRlcmFsKG5vZGUpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMudGhyb3dJbnNhbmNlRXJyb3IodGhpcy5kdW1wQ29udGV4dChub2RlKSk7XG4gICAgfVxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjQXJyYXlMaXRlcmFsRXhwcmVzc2lvbi5cbiAgICB2aXNpdEFycmF5TGl0ZXJhbEV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCk6IEFycmF5RXhwcmVzc2lvbiB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0QXJyYXlMaXRlcmFsRXhwcmVzc2lvbiBbJXNdIDogJXNcIiwgY3R4LmdldENoaWxkQ291bnQoKSwgY3R4LmdldFRleHQoKSk7XG4gICAgICAgIHRoaXMuYXNzZXJ0VHlwZShjdHgsIEVDTUFTY3JpcHRQYXJzZXIuQXJyYXlMaXRlcmFsRXhwcmVzc2lvbkNvbnRleHQpO1xuICAgICAgICB0aGlzLmFzc2VydE5vZGVDb3VudChjdHgsIDEpO1xuICAgICAgICBjb25zdCBub2RlID0gY3R4LmdldENoaWxkKDApO1xuICAgICAgICBjb25zdCBlbGVtZW50cyA9IHRoaXMudmlzaXRBcnJheUxpdGVyYWwobm9kZSk7XG4gICAgICAgIHJldHVybiBuZXcgQXJyYXlFeHByZXNzaW9uKGVsZW1lbnRzKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAvLyBjb21wdXRlZCA9IGZhbHNlIGB4LnpgXG4gICAgICogLy8gY29tcHV0ZWQgPSB0cnVlIGB5WzFdYFxuICAgICAqIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI01lbWJlckRvdEV4cHJlc3Npb24uXG4gICAgICovXG4gICAgdmlzaXRNZW1iZXJEb3RFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpOiBTdGF0aWNNZW1iZXJFeHByZXNzaW9ue1xuICAgICAgICBjb25zb2xlLmluZm8oXCJ2aXNpdEFycmF5TGl0ZXJhbEV4cHJlc3Npb24gWyVzXSA6ICVzXCIsIGN0eC5nZXRDaGlsZENvdW50KCksIGN0eC5nZXRUZXh0KCkpO1xuICAgICAgICB0aGlzLmFzc2VydFR5cGUoY3R4LCBFQ01BU2NyaXB0UGFyc2VyLk1lbWJlckRvdEV4cHJlc3Npb25Db250ZXh0KTtcbiAgICAgICAgdGhpcy5hc3NlcnROb2RlQ291bnQoY3R4LCAzKTtcbiAgICAgICAgY29uc3QgZXhwciA9IHRoaXMuc2luZ2xlRXhwcmVzc2lvbihjdHguZ2V0Q2hpbGQoMCkpO1xuICAgICAgICBjb25zdCBwcm9wZXJ0eSA9IHRoaXMudmlzaXRJZGVudGlmaWVyTmFtZShjdHguZ2V0Q2hpbGQoMikpOyAgICAgICAgXG4gICAgICAgIHJldHVybiBuZXcgU3RhdGljTWVtYmVyRXhwcmVzc2lvbihleHByLCBwcm9wZXJ0eSk7XG4gICAgfVxuXG4gICAgcHJpbnQoY3R4OiBSdWxlQ29udGV4dCk6IHZvaWR7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcIiAqKioqKiAgXCIpXG4gICAgICAgIGNvbnN0IHZpc2l0b3IgPSBuZXcgUHJpbnRWaXNpdG9yKCk7XG4gICAgICAgIGN0eC5hY2NlcHQodmlzaXRvcik7XG4gICAgfVxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjTWVtYmVySW5kZXhFeHByZXNzaW9uLlxuICAgIHZpc2l0TWVtYmVySW5kZXhFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpOiBDb21wdXRlZE1lbWJlckV4cHJlc3Npb257XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0TWVtYmVySW5kZXhFeHByZXNzaW9uIFslc10gOiAlc1wiLCBjdHguZ2V0Q2hpbGRDb3VudCgpLCBjdHguZ2V0VGV4dCgpKTtcbiAgICAgICAgdGhpcy5hc3NlcnRUeXBlKGN0eCwgRUNNQVNjcmlwdFBhcnNlci5NZW1iZXJJbmRleEV4cHJlc3Npb25Db250ZXh0KTtcbiAgICAgICAgdGhpcy5hc3NlcnROb2RlQ291bnQoY3R4LCA0KTtcbiAgICAgICAgY29uc3QgZXhwciA9IHRoaXMuc2luZ2xlRXhwcmVzc2lvbihjdHguZ2V0Q2hpbGQoMCkpO1xuICAgICAgICBjb25zdCBwcm9wZXJ0eSA9IHRoaXMudmlzaXRFeHByZXNzaW9uU2VxdWVuY2UoY3R4LmdldENoaWxkKDIpKTsgICAgICAgIFxuICAgICAgICByZXR1cm4gbmV3IENvbXB1dGVkTWVtYmVyRXhwcmVzc2lvbihleHByLCBwcm9wZXJ0eSk7XG4gICAgfVxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjSWRlbnRpZmllckV4cHJlc3Npb24uXG4gICAgdmlzaXRJZGVudGlmaWVyRXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KTogSWRlbnRpZmllciB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0SWRlbnRpZmllckV4cHJlc3Npb24gWyVzXSA6ICVzXCIsIGN0eC5nZXRDaGlsZENvdW50KCksIGN0eC5nZXRUZXh0KCkpO1xuICAgICAgICB0aGlzLmFzc2VydFR5cGUoY3R4LCBFQ01BU2NyaXB0UGFyc2VyLklkZW50aWZpZXJFeHByZXNzaW9uQ29udGV4dCk7XG4gICAgICAgIHRoaXMuYXNzZXJ0Tm9kZUNvdW50KGN0eCwgMSlcbiAgICAgICAgY29uc3QgaW5pdGlhbGlzZXIgPSBjdHguZ2V0Q2hpbGQoMCk7XG4gICAgICAgIGNvbnN0IG5hbWUgPSBpbml0aWFsaXNlci5nZXRUZXh0KCk7XG4gICAgICAgIHJldHVybiB0aGlzLmRlY29yYXRlKG5ldyBJZGVudGlmaWVyKG5hbWUpLCB0aGlzLmFzTWFya2VyKHRoaXMuYXNNZXRhZGF0YShpbml0aWFsaXNlci5zeW1ib2wpKSlcbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNCaXRBbmRFeHByZXNzaW9uLlxuICAgIHZpc2l0Qml0QW5kRXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gICAgfVxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjQml0T3JFeHByZXNzaW9uLlxuICAgIHZpc2l0Qml0T3JFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI0Fzc2lnbm1lbnRPcGVyYXRvckV4cHJlc3Npb24uXG4gICAgdmlzaXRBc3NpZ25tZW50T3BlcmF0b3JFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpOiBBc3NpZ25tZW50RXhwcmVzc2lvbntcbiAgICAgICAgY29uc29sZS5pbmZvKFwidmlzaXRBc3NpZ25tZW50T3BlcmF0b3JFeHByZXNzaW9uIFslc10gOiAlc1wiLCBjdHguZ2V0Q2hpbGRDb3VudCgpLCBjdHguZ2V0VGV4dCgpKTtcbiAgICAgICAgdGhpcy5hc3NlcnRUeXBlKGN0eCwgRUNNQVNjcmlwdFBhcnNlci5Bc3NpZ25tZW50T3BlcmF0b3JFeHByZXNzaW9uQ29udGV4dCk7XG4gICAgICAgIHRoaXMuYXNzZXJ0Tm9kZUNvdW50KGN0eCwgMylcbiAgICAgICAgY29uc3QgbGhzID0gdGhpcy5zaW5nbGVFeHByZXNzaW9uKGN0eC5nZXRDaGlsZCgwKSk7XG4gICAgICAgIGNvbnN0IG9wZXJhdG9yID0gY3R4LmdldENoaWxkKDEpLmdldFRleHQoKTtcbiAgICAgICAgY29uc3QgcmhzID0gdGhpcy52aXNpdEV4cHJlc3Npb25TZXF1ZW5jZShjdHguZ2V0Q2hpbGQoMikpO1xuXG4gICAgICAgIHJldHVybiB0aGlzLmRlY29yYXRlKG5ldyBBc3NpZ25tZW50RXhwcmVzc2lvbihvcGVyYXRvciwgbGhzLCByaHMpKVxuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjVm9pZEV4cHJlc3Npb24uXG4gICAgdmlzaXRWb2lkRXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG5cbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNhc3NpZ25tZW50T3BlcmF0b3IuXG4gICAgdmlzaXRBc3NpZ25tZW50T3BlcmF0b3IoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJ2aXNpdEFzc2lnbm1lbnRPcGVyYXRvciBbJXNdIDogWyVzXVwiLCBjdHguZ2V0Q2hpbGRDb3VudCgpLCBjdHguZ2V0VGV4dCgpKTtcbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNsaXRlcmFsLlxuICAgIHZpc2l0TGl0ZXJhbChjdHg6IFJ1bGVDb250ZXh0KTogTGl0ZXJhbCB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0TGl0ZXJhbCBbJXNdIDogWyVzXVwiLCBjdHguZ2V0Q2hpbGRDb3VudCgpLCBjdHguZ2V0VGV4dCgpKTtcbiAgICAgICAgdGhpcy5hc3NlcnRUeXBlKGN0eCwgRUNNQVNjcmlwdFBhcnNlci5MaXRlcmFsQ29udGV4dClcbiAgICAgICAgdGhpcy5hc3NlcnROb2RlQ291bnQoY3R4LCAxKTtcbiAgICAgICAgY29uc3Qgbm9kZTogUnVsZUNvbnRleHQgPSBjdHguZ2V0Q2hpbGQoMCk7XG5cbiAgICAgICAgaWYgKG5vZGUuZ2V0Q2hpbGRDb3VudCgpID09IDApIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNyZWF0ZUxpdGVyYWxWYWx1ZShub2RlKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChub2RlLmdldENoaWxkQ291bnQoKSA9PSAxKSB7XG4gICAgICAgICAgICBpZiAobm9kZSBpbnN0YW5jZW9mIEVDTUFTY3JpcHRQYXJzZXIuTnVtZXJpY0xpdGVyYWxDb250ZXh0KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMudmlzaXROdW1lcmljTGl0ZXJhbChub2RlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMudGhyb3dJbnNhbmNlRXJyb3IodGhpcy5kdW1wQ29udGV4dChub2RlKSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy50aHJvd0luc2FuY2VFcnJvcih0aGlzLmR1bXBDb250ZXh0KG5vZGUpKTtcbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNudW1lcmljTGl0ZXJhbC5cbiAgICB2aXNpdE51bWVyaWNMaXRlcmFsKGN0eDogUnVsZUNvbnRleHQpOiBMaXRlcmFsIHtcbiAgICAgICAgY29uc29sZS5pbmZvKFwidmlzaXROdW1lcmljTGl0ZXJhbCBbJXNdIDogWyVzXVwiLCBjdHguZ2V0Q2hpbGRDb3VudCgpLCBjdHguZ2V0VGV4dCgpKTtcbiAgICAgICAgdGhpcy5hc3NlcnRUeXBlKGN0eCwgRUNNQVNjcmlwdFBhcnNlci5OdW1lcmljTGl0ZXJhbENvbnRleHQpXG4gICAgICAgIHRoaXMuYXNzZXJ0Tm9kZUNvdW50KGN0eCwgMSk7XG4gICAgICAgIGNvbnN0IHZhbHVlID0gY3R4LmdldFRleHQoKTtcbiAgICAgICAgLy8gVE9ETyA6IEZpZ3VyZSBvdXQgYmV0dGVyIHdheVxuICAgICAgICBjb25zdCBsaXRlcmFsID0gbmV3IExpdGVyYWwoTnVtYmVyKHZhbHVlKSwgdmFsdWUpO1xuICAgICAgICByZXR1cm4gdGhpcy5kZWNvcmF0ZShsaXRlcmFsLCB0aGlzLmFzTWFya2VyKHRoaXMuYXNNZXRhZGF0YShjdHguZ2V0U291cmNlSW50ZXJ2YWwoKSkpKVxuICAgIH1cblxuICAgIGNyZWF0ZUxpdGVyYWxWYWx1ZShjdHg6IFJ1bGVDb250ZXh0KTogTGl0ZXJhbCB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcImNyZWF0ZUxpdGVyYWxWYWx1ZSBbJXNdOiBbJXNdXCIsIGN0eC5nZXRDaGlsZENvdW50KCksIGN0eC5nZXRUZXh0KCkpO1xuICAgICAgICBjb25zdCB2YWx1ZSA9IGN0eC5nZXRUZXh0KCk7XG4gICAgICAgIGNvbnN0IGxpdGVyYWwgPSBuZXcgTGl0ZXJhbCh2YWx1ZSwgdmFsdWUpO1xuICAgICAgICByZXR1cm4gdGhpcy5kZWNvcmF0ZShsaXRlcmFsLCB0aGlzLmFzTWFya2VyKHRoaXMuYXNNZXRhZGF0YShjdHguZ2V0U291cmNlSW50ZXJ2YWwoKSkpKVxuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2lkZW50aWZpZXJOYW1lLlxuICAgIHZpc2l0SWRlbnRpZmllck5hbWUoY3R4OiBSdWxlQ29udGV4dCk6IElkZW50aWZpZXIge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJ2aXNpdElkZW50aWZpZXJOYW1lIFslc106IFslc11cIiwgY3R4LmdldENoaWxkQ291bnQoKSwgY3R4LmdldFRleHQoKSk7XG4gICAgICAgIHRoaXMuYXNzZXJ0VHlwZShjdHgsIEVDTUFTY3JpcHRQYXJzZXIuSWRlbnRpZmllck5hbWVDb250ZXh0KVxuICAgICAgICB0aGlzLmFzc2VydE5vZGVDb3VudChjdHgsIDEpO1xuICAgICAgICBjb25zdCB2YWx1ZSA9IGN0eC5nZXRUZXh0KCk7XG4gICAgICAgIGNvbnN0IGlkZW50aWZpZXIgPSBuZXcgSWRlbnRpZmllcih2YWx1ZSk7XG4gICAgICAgIHJldHVybiB0aGlzLmRlY29yYXRlKGlkZW50aWZpZXIsIHRoaXMuYXNNYXJrZXIodGhpcy5hc01ldGFkYXRhKGN0eC5nZXRTb3VyY2VJbnRlcnZhbCgpKSkpXG4gICAgfVxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjcmVzZXJ2ZWRXb3JkLlxuICAgIHZpc2l0UmVzZXJ2ZWRXb3JkKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS5pbmZvKFwidmlzaXRSZXNlcnZlZFdvcmQ6IFwiICsgY3R4LmdldFRleHQoKSk7XG4gICAgfVxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIja2V5d29yZC5cbiAgICB2aXNpdEtleXdvcmQoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJ2aXNpdEtleXdvcmQ6IFwiICsgY3R4LmdldFRleHQoKSk7XG5cbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2Z1dHVyZVJlc2VydmVkV29yZC5cbiAgICB2aXNpdEZ1dHVyZVJlc2VydmVkV29yZChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gICAgfVxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjZ2V0dGVyLlxuICAgIHZpc2l0R2V0dGVyKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICB9XG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjc2V0dGVyLlxuICAgIHZpc2l0U2V0dGVyKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNlb3MuXG4gICAgdmlzaXRFb3MoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICAvL2NvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gICAgfVxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjZW9mLlxuICAgIHZpc2l0RW9mKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICB9XG5cbn0iXX0=