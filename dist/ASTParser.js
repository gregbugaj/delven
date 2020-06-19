"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DelvenASTVisitor = exports.default = exports.ParserType = void 0;

var antlr4 = _interopRequireWildcard(require("antlr4"));

var _ECMAScriptParserVisitor = require("./parser/ECMAScriptParserVisitor");

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

class DelvenASTVisitor extends _ECMAScriptParserVisitor.ECMAScriptParserVisitor {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9BU1RQYXJzZXIudHMiXSwibmFtZXMiOlsiUGFyc2VyVHlwZSIsIkFTVFBhcnNlciIsImNvbnN0cnVjdG9yIiwidmlzaXRvciIsIkRlbHZlbkFTVFZpc2l0b3IiLCJnZW5lcmF0ZSIsInNvdXJjZSIsImNvZGUiLCJ0eXBlIiwidmFsdWUiLCJmcyIsInJlYWRGaWxlU3luYyIsImNoYXJzIiwiYW50bHI0IiwiSW5wdXRTdHJlYW0iLCJsZXhlciIsIkRlbHZlbkxleGVyIiwidG9rZW5zIiwiQ29tbW9uVG9rZW5TdHJlYW0iLCJwYXJzZXIiLCJEZWx2ZW5QYXJzZXIiLCJ0cmVlIiwicHJvZ3JhbSIsImFjY2VwdCIsIlByaW50VmlzaXRvciIsImNvbnNvbGUiLCJpbmZvIiwicmVzdWx0IiwicGFyc2UiLCJFQ01BU2NyaXB0IiwiQVNUUGFyc2VyRGVmYXVsdCIsIkVycm9yIiwiRGVsdmVuVmlzaXRvciIsInJ1bGVUeXBlTWFwIiwiTWFwIiwic2V0dXBUeXBlUnVsZXMiLCJrZXlzIiwiT2JqZWN0IiwiZ2V0T3duUHJvcGVydHlOYW1lcyIsImtleSIsIm5hbWUiLCJzdGFydHNXaXRoIiwic2V0IiwicGFyc2VJbnQiLCJkdW1wQ29udGV4dCIsImN0eCIsImNvbnRleHQiLCJlbmRzV2l0aCIsInB1c2giLCJsZW5ndGgiLCJjb250ZXh0TmFtZSIsImxvbmdlc3QiLCJvYmoiLCJFQ01BU2NyaXB0UGFyc2VyIiwiY2hhaW4iLCJwcm90b3R5cGUiLCJfX3Byb3RvX18iLCJkdW1wQ29udGV4dEFsbENoaWxkcmVuIiwiaW5kZW50IiwicGFkIiwicGFkU3RhcnQiLCJub2RlcyIsIm1hcmtlciIsImkiLCJnZXRDaGlsZENvdW50IiwiY2hpbGQiLCJnZXRDaGlsZCIsImdldFJ1bGVCeUlkIiwiaWQiLCJnZXQiLCJhc01hcmtlciIsIm1ldGFkYXRhIiwiaW5kZXgiLCJsaW5lIiwiY29sdW1uIiwiZGVjb3JhdGUiLCJub2RlIiwic3RhcnQiLCJlbmQiLCJhc01ldGFkYXRhIiwiaW50ZXJ2YWwiLCJvZmZzZXQiLCJzdG9wIiwidGhyb3dUeXBlRXJyb3IiLCJ0eXBlSWQiLCJUeXBlRXJyb3IiLCJ0aHJvd0luc2FuY2VFcnJvciIsImFzc2VydFR5cGUiLCJ2aXNpdFByb2dyYW0iLCJnZXRUZXh0Iiwic3RhdGVtZW50cyIsInN0bSIsIlN0YXRlbWVudENvbnRleHQiLCJzdGF0ZW1lbnQiLCJ2aXNpdFN0YXRlbWVudCIsImdldFNvdXJjZUludGVydmFsIiwic2NyaXB0IiwiU2NyaXB0IiwiRXhwcmVzc2lvblN0YXRlbWVudENvbnRleHQiLCJ2aXNpdEV4cHJlc3Npb25TdGF0ZW1lbnQiLCJWYXJpYWJsZVN0YXRlbWVudENvbnRleHQiLCJ2aXNpdFZhcmlhYmxlU3RhdGVtZW50IiwiQmxvY2tDb250ZXh0IiwidmlzaXRCbG9jayIsIklmU3RhdGVtZW50Q29udGV4dCIsInZpc2l0SWZTdGF0ZW1lbnQiLCJFbXB0eVN0YXRlbWVudENvbnRleHQiLCJib2R5IiwiU3RhdGVtZW50TGlzdENvbnRleHQiLCJzdGF0ZW1lbnRMaXN0IiwidmlzaXRTdGF0ZW1lbnRMaXN0IiwiQmxvY2tTdGF0ZW1lbnQiLCJydWxlSW5kZXgiLCJSVUxFX3N0YXRlbWVudCIsInVuZGVmaW5lZCIsImFzc2VydE5vZGVDb3VudCIsIm4wIiwibjEiLCJuMiIsImRlY2xhcmF0aW9ucyIsInZpc2l0VmFyaWFibGVEZWNsYXJhdGlvbkxpc3QiLCJraW5kIiwiVmFyaWFibGVEZWNsYXJhdGlvbiIsIlZhcmlhYmxlRGVjbGFyYXRpb25MaXN0Q29udGV4dCIsImZpbHRlclN5bWJvbHMiLCJmb3JFYWNoIiwiVmFyaWFibGVEZWNsYXJhdGlvbkNvbnRleHQiLCJkZWNsYXJhdGlvbiIsInZpc2l0VmFyaWFibGVEZWNsYXJhdGlvbiIsInRleHQiLCJJZGVudGlmaWVyIiwiaW5pdCIsInZpc2l0SW5pdGlhbGlzZXIiLCJWYXJpYWJsZURlY2xhcmF0b3IiLCJJbml0aWFsaXNlckNvbnRleHQiLCJPYmplY3RMaXRlcmFsRXhwcmVzc2lvbkNvbnRleHQiLCJ2aXNpdE9iamVjdExpdGVyYWxFeHByZXNzaW9uIiwiQXJyYXlMaXRlcmFsRXhwcmVzc2lvbkNvbnRleHQiLCJ2aXNpdEFycmF5TGl0ZXJhbEV4cHJlc3Npb24iLCJ2aXNpdEVtcHR5U3RhdGVtZW50IiwiZ2V0UnVsZVR5cGUiLCJjb3VudCIsImV4cCIsIkV4cHJlc3Npb25TZXF1ZW5jZUNvbnRleHQiLCJ2aXNpdEV4cHJlc3Npb25TZXF1ZW5jZSIsInRlc3QiLCJjb25zZXF1ZW50IiwiYWx0ZXJuYXRlIiwiSWZTdGF0ZW1lbnQiLCJ2aXNpdERvU3RhdGVtZW50IiwidmlzaXRXaGlsZVN0YXRlbWVudCIsInZpc2l0Rm9yU3RhdGVtZW50IiwidmlzaXRGb3JWYXJTdGF0ZW1lbnQiLCJ0cmFjZSIsInZpc2l0Rm9ySW5TdGF0ZW1lbnQiLCJ2aXNpdEZvclZhckluU3RhdGVtZW50IiwidmlzaXRDb250aW51ZVN0YXRlbWVudCIsInZpc2l0QnJlYWtTdGF0ZW1lbnQiLCJ2aXNpdFJldHVyblN0YXRlbWVudCIsInZpc2l0V2l0aFN0YXRlbWVudCIsInZpc2l0U3dpdGNoU3RhdGVtZW50IiwidmlzaXRDYXNlQmxvY2siLCJ2aXNpdENhc2VDbGF1c2VzIiwidmlzaXRDYXNlQ2xhdXNlIiwidmlzaXREZWZhdWx0Q2xhdXNlIiwidmlzaXRMYWJlbGxlZFN0YXRlbWVudCIsInZpc2l0VGhyb3dTdGF0ZW1lbnQiLCJ2aXNpdFRyeVN0YXRlbWVudCIsInZpc2l0Q2F0Y2hQcm9kdWN0aW9uIiwidmlzaXRGaW5hbGx5UHJvZHVjdGlvbiIsInZpc2l0RGVidWdnZXJTdGF0ZW1lbnQiLCJ2aXNpdEZ1bmN0aW9uRGVjbGFyYXRpb24iLCJ2aXNpdEZvcm1hbFBhcmFtZXRlckxpc3QiLCJ2aXNpdEZ1bmN0aW9uQm9keSIsInZpc2l0QXJyYXlMaXRlcmFsIiwiQXJyYXlMaXRlcmFsQ29udGV4dCIsInJlc3VsdHMiLCJFbGVtZW50TGlzdENvbnRleHQiLCJ2aXNpdEVsZW1lbnRMaXN0IiwiRWxpc2lvbkNvbnRleHQiLCJ2aXNpdEVsaXNpb24iLCJzeW1ib2wiLCJlbGVtZW50cyIsImVsZW0iLCJzaW5nbGVFeHByZXNzaW9uIiwiZWxpc2lvbiIsInZpc2l0T2JqZWN0TGl0ZXJhbCIsIk9iamVjdExpdGVyYWxDb250ZXh0IiwiUHJvcGVydHlOYW1lQW5kVmFsdWVMaXN0Q29udGV4dCIsInZpc2l0UHJvcGVydHlOYW1lQW5kVmFsdWVMaXN0IiwicHJvcGVydGllcyIsIlByb3BlcnR5RXhwcmVzc2lvbkFzc2lnbm1lbnRDb250ZXh0IiwicHJvcGVydHkiLCJ2aXNpdFByb3BlcnR5RXhwcmVzc2lvbkFzc2lnbm1lbnQiLCJmaWx0ZXJlZCIsInZpc2l0UHJvcGVydHlOYW1lIiwiY29tcHV0ZWQiLCJtZXRob2QiLCJzaG9ydGhhbmQiLCJQcm9wZXJ0eSIsInZpc2l0UHJvcGVydHlHZXR0ZXIiLCJ2aXNpdFByb3BlcnR5U2V0dGVyIiwiUHJvcGVydHlOYW1lQ29udGV4dCIsImNyZWF0ZUxpdGVyYWxWYWx1ZSIsInZpc2l0SWRlbnRpZmllck5hbWUiLCJ2aXNpdFByb3BlcnR5U2V0UGFyYW1ldGVyTGlzdCIsInZpc2l0QXJndW1lbnRzIiwidmlzaXRBcmd1bWVudExpc3QiLCJleHByZXNzaW9ucyIsIkV4cHJlc3Npb25TdGF0ZW1lbnQiLCJTZXF1ZW5jZUV4cHJlc3Npb24iLCJMaXRlcmFsRXhwcmVzc2lvbkNvbnRleHQiLCJ2aXNpdExpdGVyYWxFeHByZXNzaW9uIiwiQXNzaWdubWVudEV4cHJlc3Npb25Db250ZXh0IiwidmlzaXRBc3NpZ25tZW50RXhwcmVzc2lvbiIsIkFkZGl0aXZlRXhwcmVzc2lvbkNvbnRleHQiLCJ2aXNpdEFkZGl0aXZlRXhwcmVzc2lvbiIsIk11bHRpcGxpY2F0aXZlRXhwcmVzc2lvbkNvbnRleHQiLCJ2aXNpdE11bHRpcGxpY2F0aXZlRXhwcmVzc2lvbiIsIkVxdWFsaXR5RXhwcmVzc2lvbkNvbnRleHQiLCJ2aXNpdEVxdWFsaXR5RXhwcmVzc2lvbiIsIlBhcmVudGhlc2l6ZWRFeHByZXNzaW9uQ29udGV4dCIsInZpc2l0UGFyZW50aGVzaXplZEV4cHJlc3Npb24iLCJSZWxhdGlvbmFsRXhwcmVzc2lvbkNvbnRleHQiLCJ2aXNpdFJlbGF0aW9uYWxFeHByZXNzaW9uIiwiSWRlbnRpZmllckV4cHJlc3Npb25Db250ZXh0IiwidmlzaXRJZGVudGlmaWVyRXhwcmVzc2lvbiIsIk1lbWJlckRvdEV4cHJlc3Npb25Db250ZXh0IiwidmlzaXRNZW1iZXJEb3RFeHByZXNzaW9uIiwiTWVtYmVySW5kZXhFeHByZXNzaW9uQ29udGV4dCIsInZpc2l0TWVtYmVySW5kZXhFeHByZXNzaW9uIiwiQXNzaWdubWVudE9wZXJhdG9yRXhwcmVzc2lvbkNvbnRleHQiLCJ2aXNpdEFzc2lnbm1lbnRPcGVyYXRvckV4cHJlc3Npb24iLCJ2aXNpdFRlcm5hcnlFeHByZXNzaW9uIiwidmlzaXRMb2dpY2FsQW5kRXhwcmVzc2lvbiIsInZpc2l0UHJlSW5jcmVtZW50RXhwcmVzc2lvbiIsIk9iamVjdEV4cHJlc3Npb24iLCJ2aXNpdEluRXhwcmVzc2lvbiIsInZpc2l0TG9naWNhbE9yRXhwcmVzc2lvbiIsInZpc2l0Tm90RXhwcmVzc2lvbiIsInZpc2l0UHJlRGVjcmVhc2VFeHByZXNzaW9uIiwidmlzaXRBcmd1bWVudHNFeHByZXNzaW9uIiwidmlzaXRUaGlzRXhwcmVzc2lvbiIsInZpc2l0RnVuY3Rpb25FeHByZXNzaW9uIiwidmlzaXRVbmFyeU1pbnVzRXhwcmVzc2lvbiIsInZpc2l0UG9zdERlY3JlYXNlRXhwcmVzc2lvbiIsImluaXRpYWxpc2VyIiwib3BlcmF0b3IiLCJleHByZXNzaW9uIiwibGhzIiwicmhzIiwiQXNzaWdubWVudEV4cHJlc3Npb24iLCJ2aXNpdFR5cGVvZkV4cHJlc3Npb24iLCJ2aXNpdEluc3RhbmNlb2ZFeHByZXNzaW9uIiwidmlzaXRVbmFyeVBsdXNFeHByZXNzaW9uIiwidmlzaXREZWxldGVFeHByZXNzaW9uIiwibGVmdCIsInJpZ2h0IiwiX3Zpc2l0QmluYXJ5RXhwcmVzc2lvbiIsIkJpbmFyeUV4cHJlc3Npb24iLCJ2aXNpdEJpdFhPckV4cHJlc3Npb24iLCJ2aXNpdEJpbmFyeUV4cHJlc3Npb24iLCJ2aXNpdEJpdFNoaWZ0RXhwcmVzc2lvbiIsInZpc2l0UG9zdEluY3JlbWVudEV4cHJlc3Npb24iLCJ2aXNpdEJpdE5vdEV4cHJlc3Npb24iLCJ2aXNpdE5ld0V4cHJlc3Npb24iLCJMaXRlcmFsQ29udGV4dCIsInZpc2l0TGl0ZXJhbCIsIk51bWVyaWNMaXRlcmFsQ29udGV4dCIsInZpc2l0TnVtZXJpY0xpdGVyYWwiLCJBcnJheUV4cHJlc3Npb24iLCJleHByIiwiU3RhdGljTWVtYmVyRXhwcmVzc2lvbiIsInByaW50IiwiQ29tcHV0ZWRNZW1iZXJFeHByZXNzaW9uIiwidmlzaXRCaXRBbmRFeHByZXNzaW9uIiwidmlzaXRCaXRPckV4cHJlc3Npb24iLCJ2aXNpdFZvaWRFeHByZXNzaW9uIiwidmlzaXRBc3NpZ25tZW50T3BlcmF0b3IiLCJsaXRlcmFsIiwiTGl0ZXJhbCIsIk51bWJlciIsIklkZW50aWZpZXJOYW1lQ29udGV4dCIsImlkZW50aWZpZXIiLCJ2aXNpdFJlc2VydmVkV29yZCIsInZpc2l0S2V5d29yZCIsInZpc2l0RnV0dXJlUmVzZXJ2ZWRXb3JkIiwidmlzaXRHZXR0ZXIiLCJ2aXNpdFNldHRlciIsInZpc2l0RW9zIiwidmlzaXRFb2YiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFFQTs7QUFFQTs7QUFHQTs7Ozs7O0FBSUE7Ozs7Ozs7O0lBUVlBLFU7OztXQUFBQSxVO0FBQUFBLEVBQUFBLFUsQ0FBQUEsVTtHQUFBQSxVLDBCQUFBQSxVOztBQVlHLE1BQWVDLFNBQWYsQ0FBeUI7QUFHcENDLEVBQUFBLFdBQVcsQ0FBQ0MsT0FBRCxFQUE2QjtBQUNwQyxTQUFLQSxPQUFMLEdBQWVBLE9BQU8sSUFBSSxJQUFJQyxnQkFBSixFQUExQjtBQUNIOztBQUVEQyxFQUFBQSxRQUFRLENBQUNDLE1BQUQsRUFBOEI7QUFDbEMsUUFBSUMsSUFB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RUFBaEIsQ0FBZCxDQUExQixDQUFQO0FBQ0gsR0E1bUMrQyxDQThtQ2hEOzs7QUFDQTZMLEVBQUFBLGlCQUFpQixDQUFDL08sR0FBRCxFQUFtQjtBQUNoQ3BCLElBQUFBLE9BQU8sQ0FBQ0MsSUFBUixDQUFhLHdCQUF3Qm1CLEdBQUcsQ0FBQzRDLE9BQUosRUFBckM7QUFDSCxHQWpuQytDLENBbW5DaEQ7OztBQUNBb00sRUFBQUEsWUFBWSxDQUFDaFAsR0FBRCxFQUFtQjtBQUMzQnBCLElBQUFBLE9BQU8sQ0FBQ0MsSUFBUixDQUFhLG1CQUFtQm1CLEdBQUcsQ0FBQzRDLE9BQUosRUFBaEM7QUFFSCxHQXZuQytDLENBMG5DaEQ7OztBQUNBcU0sRUFBQUEsdUJBQXVCLENBQUNqUCxHQUFELEVBQW1CO0FBQ3RDcEIsSUFBQUEsT0FBTyxDQUFDZ0ksS0FBUixDQUFjLGlCQUFkO0FBQ0gsR0E3bkMrQyxDQStuQ2hEOzs7QUFDQXNJLEVBQUFBLFdBQVcsQ0FBQ2xQLEdBQUQsRUFBbUI7QUFDMUJwQixJQUFBQSxPQUFPLENBQUNnSSxLQUFSLENBQWMsaUJBQWQ7QUFDSCxHQWxvQytDLENBbW9DaEQ7OztBQUNBdUksRUFBQUEsV0FBVyxDQUFDblAsR0FBRCxFQUFtQjtBQUMxQnBCLElBQUFBLE9BQU8sQ0FBQ2dJLEtBQVIsQ0FBYyxpQkFBZDtBQUNILEdBdG9DK0MsQ0F3b0NoRDs7O0FBQ0F3SSxFQUFBQSxRQUFRLENBQUNwUCxHQUFELEVBQW1CLENBRTFCLENBRk8sQ0FDSjtBQUdKOzs7QUFDQXFQLEVBQUFBLFFBQVEsQ0FBQ3JQLEdBQUQsRUFBbUI7QUFDdkJwQixJQUFBQSxPQUFPLENBQUNnSSxLQUFSLENBQWMsaUJBQWQ7QUFDSDs7QUFocEMrQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGFudGxyNCBmcm9tIFwiYW50bHI0XCJcbmltcG9ydCB7IEVDTUFTY3JpcHRQYXJzZXJWaXNpdG9yIGFzIERlbHZlblZpc2l0b3IgfSBmcm9tIFwiLi9wYXJzZXIvRUNNQVNjcmlwdFBhcnNlclZpc2l0b3JcIlxuaW1wb3J0IHsgRUNNQVNjcmlwdFBhcnNlciBhcyBEZWx2ZW5QYXJzZXIsIEVDTUFTY3JpcHRQYXJzZXJ9IGZyb20gXCIuL3BhcnNlci9FQ01BU2NyaXB0UGFyc2VyXCJcbmltcG9ydCB7IEVDTUFTY3JpcHRMZXhlciBhcyBEZWx2ZW5MZXhlciB9IGZyb20gXCIuL3BhcnNlci9FQ01BU2NyaXB0TGV4ZXJcIlxuaW1wb3J0IHsgUnVsZUNvbnRleHQgfSBmcm9tIFwiYW50bHI0L1J1bGVDb250ZXh0XCJcbmltcG9ydCB7IFByaW50VmlzaXRvciB9IGZyb20gXCIuL1ByaW50VmlzaXRvclwiXG5pbXBvcnQgQVNUTm9kZSBmcm9tIFwiLi9BU1ROb2RlXCI7XG5pbXBvcnQgeyBFeHByZXNzaW9uU3RhdGVtZW50LCBMaXRlcmFsLCBTY3JpcHQsIEJsb2NrU3RhdGVtZW50LCBTdGF0ZW1lbnQsIFNlcXVlbmNlRXhwcmVzc2lvbiwgVGhyb3dTdGF0ZW1lbnQsIEFzc2lnbm1lbnRFeHByZXNzaW9uLCBJZGVudGlmaWVyLCBCaW5hcnlFeHByZXNzaW9uLCBBcnJheUV4cHJlc3Npb24sIE9iamVjdEV4cHJlc3Npb24sIE9iamVjdEV4cHJlc3Npb25Qcm9wZXJ0eSwgUHJvcGVydHksIFByb3BlcnR5S2V5LCBWYXJpYWJsZURlY2xhcmF0aW9uLCBWYXJpYWJsZURlY2xhcmF0b3IsIEV4cHJlc3Npb24sIElmU3RhdGVtZW50LCBDb21wdXRlZE1lbWJlckV4cHJlc3Npb24sIFN0YXRpY01lbWJlckV4cHJlc3Npb24gfSBmcm9tIFwiLi9ub2Rlc1wiO1xuaW1wb3J0IHsgU3ludGF4IH0gZnJvbSBcIi4vc3ludGF4XCI7XG5pbXBvcnQgeyB0eXBlIH0gZnJvbSBcIm9zXCJcbmltcG9ydCAqIGFzIGZzIGZyb20gXCJmc1wiXG5pbXBvcnQgeyBJbnRlcnZhbCB9IGZyb20gXCJhbnRscjRcIlxuXG5cbi8qKlxuICogVmVyc2lvbiB0aGF0IHdlIGdlbmVyYXRlIHRoZSBBU1QgZm9yLiBcbiAqIFRoaXMgYWxsb3dzIGZvciB0ZXN0aW5nIGRpZmZlcmVudCBpbXBsZW1lbnRhdGlvbnNcbiAqIFxuICogQ3VycmVudGx5IG9ubHkgRUNNQVNjcmlwdCBpcyBzdXBwb3J0ZWRcbiAqIFxuICogaHR0cHM6Ly9naXRodWIuY29tL2VzdHJlZS9lc3RyZWVcbiAqL1xuZXhwb3J0IGVudW0gUGFyc2VyVHlwZSB7IEVDTUFTY3JpcHQgfVxuZXhwb3J0IHR5cGUgU291cmNlVHlwZSA9IFwiY29kZVwiIHwgXCJmaWxlbmFtZVwiO1xuZXhwb3J0IHR5cGUgU291cmNlQ29kZSA9IHtcbiAgICB0eXBlOiBTb3VyY2VUeXBlLFxuICAgIHZhbHVlOiBzdHJpbmdcbn1cbmV4cG9ydCBpbnRlcmZhY2UgTWFya2VyIHtcbiAgICBpbmRleDogbnVtYmVyO1xuICAgIGxpbmU6IG51bWJlcjtcbiAgICBjb2x1bW46IG51bWJlcjtcbn1cblxuZXhwb3J0IGRlZmF1bHQgYWJzdHJhY3QgY2xhc3MgQVNUUGFyc2VyIHtcbiAgICBwcml2YXRlIHZpc2l0b3I6ICh0eXBlb2YgRGVsdmVuVmlzaXRvciB8IG51bGwpXG5cbiAgICBjb25zdHJ1Y3Rvcih2aXNpdG9yPzogRGVsdmVuQVNUVmlzaXRvcikge1xuICAgICAgICB0aGlzLnZpc2l0b3IgPSB2aXNpdG9yIHx8IG5ldyBEZWx2ZW5BU1RWaXNpdG9yKCk7XG4gICAgfVxuXG4gICAgZ2VuZXJhdGUoc291cmNlOiBTb3VyY2VDb2RlKTogQVNUTm9kZSB7XG4gICAgICAgIGxldCBjb2RlO1xuICAgICAgICBzd2l0Y2ggKHNvdXJjZS50eXBlKSB7XG4gICAgICAgICAgICBjYXNlIFwiY29kZVwiOlxuICAgICAgICAgICAgICAgIGNvZGUgPSBzb3VyY2UudmFsdWU7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwiZmlsZW5hbWVcIjpcbiAgICAgICAgICAgICAgICBjb2RlID0gZnMucmVhZEZpbGVTeW5jKHNvdXJjZS52YWx1ZSwgXCJ1dGY4XCIpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGNoYXJzID0gbmV3IGFudGxyNC5JbnB1dFN0cmVhbShjb2RlKTtcbiAgICAgICAgbGV0IGxleGVyID0gbmV3IERlbHZlbkxleGVyKGNoYXJzKTtcbiAgICAgICAgbGV0IHRva2VucyA9IG5ldyBhbnRscjQuQ29tbW9uVG9rZW5TdHJlYW0obGV4ZXIpO1xuICAgICAgICBsZXQgcGFyc2VyID0gbmV3IERlbHZlblBhcnNlcih0b2tlbnMpO1xuICAgICAgICBsZXQgdHJlZSA9IHBhcnNlci5wcm9ncmFtKCk7XG4gICAgICAgIC8vIGNvbnNvbGUuaW5mbyh0cmVlLnRvU3RyaW5nVHJlZSgpKVxuICAgICAgICB0cmVlLmFjY2VwdChuZXcgUHJpbnRWaXNpdG9yKCkpO1xuICAgICAgICBjb25zb2xlLmluZm8oXCItLS0tLS0tLS0tLS0tLS0tLS0tLS1cIik7XG4gICAgICAgIGxldCByZXN1bHQgPSB0cmVlLmFjY2VwdCh0aGlzLnZpc2l0b3IpO1xuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFBhcnNlIHNvdXJjZSBhbmQgZ2VuZXJlYXRlIEFTVCB0cmVlXG4gICAgICogQHBhcmFtIHNvdXJjZSBcbiAgICAgKiBAcGFyYW0gdHlwZSBcbiAgICAgKi9cbiAgICBzdGF0aWMgcGFyc2Uoc291cmNlOiBTb3VyY2VDb2RlLCB0eXBlPzogUGFyc2VyVHlwZSk6IEFTVE5vZGUge1xuICAgICAgICBpZiAodHlwZSA9PSBudWxsKVxuICAgICAgICAgICAgdHlwZSA9IFBhcnNlclR5cGUuRUNNQVNjcmlwdDtcbiAgICAgICAgbGV0IHBhcnNlcjtcbiAgICAgICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICAgICAgICBjYXNlIFBhcnNlclR5cGUuRUNNQVNjcmlwdDpcbiAgICAgICAgICAgICAgICBwYXJzZXIgPSBuZXcgQVNUUGFyc2VyRGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJVbmtvd24gcGFyc2VyIHR5cGVcIik7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcGFyc2VyLmdlbmVyYXRlKHNvdXJjZSlcbiAgICB9XG59XG5cbmNsYXNzIEFTVFBhcnNlckRlZmF1bHQgZXh0ZW5kcyBBU1RQYXJzZXIge1xuXG59XG5cbmV4cG9ydCBjbGFzcyBEZWx2ZW5BU1RWaXNpdG9yIGV4dGVuZHMgRGVsdmVuVmlzaXRvciB7XG4gICAgcHJpdmF0ZSBydWxlVHlwZU1hcDogTWFwPG51bWJlciwgc3RyaW5nPiA9IG5ldyBNYXAoKTtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLnNldHVwVHlwZVJ1bGVzKCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzZXR1cFR5cGVSdWxlcygpIHtcbiAgICAgICAgY29uc3Qga2V5cyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKERlbHZlblBhcnNlcik7XG4gICAgICAgIGZvciAodmFyIGtleSBpbiBrZXlzKSB7XG4gICAgICAgICAgICBsZXQgbmFtZSA9IGtleXNba2V5XTtcbiAgICAgICAgICAgIGlmIChuYW1lLnN0YXJ0c1dpdGgoJ1JVTEVfJykpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJ1bGVUeXBlTWFwLnNldChwYXJzZUludChEZWx2ZW5QYXJzZXJbbmFtZV0pLCBuYW1lKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBkdW1wQ29udGV4dChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnN0IGtleXMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhEZWx2ZW5QYXJzZXIpO1xuICAgICAgICBsZXQgY29udGV4dCA9IFtdXG4gICAgICAgIGZvciAodmFyIGtleSBpbiBrZXlzKSB7XG4gICAgICAgICAgICBsZXQgbmFtZSA9IGtleXNba2V5XTtcbiAgICAgICAgICAgIC8vIHRoaXMgb25seSB0ZXN0IGluaGVyaXRhbmNlXG4gICAgICAgICAgICBpZiAobmFtZS5lbmRzV2l0aCgnQ29udGV4dCcpKSB7XG4gICAgICAgICAgICAgICAgaWYgKGN0eCBpbnN0YW5jZW9mIERlbHZlblBhcnNlcltuYW1lXSkge1xuICAgICAgICAgICAgICAgICAgICBjb250ZXh0LnB1c2gobmFtZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gZGlyeSBoYWNrIGZvciB3YWxraW5nIGFudGxlciBkZXBlbmN5IGNoYWluIFxuICAgICAgICAvLyBmaW5kIGxvbmdlc3QgZGVwZW5kZW5jeSBjaGFpbmc7XG4gICAgICAgIC8vIHRoaXMgdHJhdmVyc2FsIGlzIHNwZWNpZmljIHRvIEFOVEwgcGFyc2VyXG4gICAgICAgIC8vIFdlIHdhbnQgdG8gYmUgYWJsZSB0byBmaW5kIGRlcGVuZGVuY2llcyBzdWNoIGFzO1xuICAgICAgICAvKlxuICAgICAgICAgICAgLS0tLS0tLS0gLS0tLS0tLS0tLS0tXG4gICAgICAgICAgICBQcm9wZXJ0eUV4cHJlc3Npb25Bc3NpZ25tZW50Q29udGV4dFxuICAgICAgICAgICAgKiogUHJvcGVydHlBc3NpZ25tZW50Q29udGV4dFxuICAgICAgICAgICAgKiogUGFyc2VyUnVsZUNvbnRleHRcbiAgICAgICAgICAgIC0tLS0tLS0tIC0tLS0tLS0tLS0tLVxuICAgICAgICAgICAgUHJvcGVydHlBc3NpZ25tZW50Q29udGV4dFxuICAgICAgICAgICAgKiogUGFyc2VyUnVsZUNvbnRleHRcbiAgICAgICAgICovXG4gICAgICAgIGlmIChjb250ZXh0Lmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgIGxldCBjb250ZXh0TmFtZTtcbiAgICAgICAgICAgIGxldCBsb25nZXN0ID0gMDtcbiAgICAgICAgICAgIGZvciAoY29uc3Qga2V5IGluIGNvbnRleHQpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBuYW1lID0gY29udGV4dFtrZXldO1xuICAgICAgICAgICAgICAgIGxldCBvYmogPSBFQ01BU2NyaXB0UGFyc2VyW25hbWVdO1xuICAgICAgICAgICAgICAgIGxldCBjaGFpbiA9IDE7XG4gICAgICAgICAgICAgICAgZG8ge1xuICAgICAgICAgICAgICAgICAgICArK2NoYWluO1xuICAgICAgICAgICAgICAgICAgICBvYmogPSBFQ01BU2NyaXB0UGFyc2VyW29iai5wcm90b3R5cGUuX19wcm90b19fLmNvbnN0cnVjdG9yLm5hbWVdO1xuICAgICAgICAgICAgICAgIH0gd2hpbGUgKG9iaiAmJiBvYmoucHJvdG90eXBlKVxuICAgICAgICAgICAgICAgIGlmIChjaGFpbiA+IGxvbmdlc3QpIHtcbiAgICAgICAgICAgICAgICAgICAgbG9uZ2VzdCA9IGNoYWluO1xuICAgICAgICAgICAgICAgICAgICBjb250ZXh0TmFtZSA9IGAke25hbWV9IFsgKiogJHtjaGFpbn1dYDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gW2NvbnRleHROYW1lXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY29udGV4dDtcbiAgICB9XG5cbiAgICBwcml2YXRlIGR1bXBDb250ZXh0QWxsQ2hpbGRyZW4oY3R4OiBSdWxlQ29udGV4dCwgaW5kZW50OiBudW1iZXIgPSAwKSB7XG4gICAgICAgIGNvbnN0IHBhZCA9IFwiIFwiLnBhZFN0YXJ0KGluZGVudCwgXCJcXHRcIik7XG4gICAgICAgIGNvbnN0IG5vZGVzID0gdGhpcy5kdW1wQ29udGV4dChjdHgpO1xuICAgICAgICBpZiAobm9kZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgY29uc3QgbWFya2VyID0gaW5kZW50ID09IDAgPyBcIiAjIFwiIDogXCIgKiBcIjtcbiAgICAgICAgICAgIGNvbnNvbGUuaW5mbyhwYWQgKyBtYXJrZXIgKyBub2RlcylcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGN0eC5nZXRDaGlsZENvdW50KCk7ICsraSkge1xuICAgICAgICAgICAgbGV0IGNoaWxkID0gY3R4Py5nZXRDaGlsZChpKTtcbiAgICAgICAgICAgIGlmIChjaGlsZCkge1xuICAgICAgICAgICAgICAgIHRoaXMuZHVtcENvbnRleHRBbGxDaGlsZHJlbihjaGlsZCwgKytpbmRlbnQpO1xuICAgICAgICAgICAgICAgIC0taW5kZW50O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0IHJ1bGUgbmFtZSBieSB0aGUgSWRcbiAgICAgKiBAcGFyYW0gaWQgXG4gICAgICovXG4gICAgZ2V0UnVsZUJ5SWQoaWQ6IG51bWJlcik6IHN0cmluZyB8IHVuZGVmaW5lZCB7XG4gICAgICAgIHJldHVybiB0aGlzLnJ1bGVUeXBlTWFwLmdldChpZCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc01hcmtlcihtZXRhZGF0YTogYW55KSB7XG4gICAgICAgIHJldHVybiB7IGluZGV4OiAxLCBsaW5lOiAxLCBjb2x1bW46IDEgfVxuICAgIH1cblxuICAgIHByaXZhdGUgZGVjb3JhdGUobm9kZTogYW55LCBtYXJrZXI6IE1hcmtlcik6IGFueSB7XG4gICAgICAgIG5vZGUuc3RhcnQgPSAwO1xuICAgICAgICBub2RlLmVuZCA9IDA7XG4gICAgICAgIHJldHVybiBub2RlO1xuICAgIH1cblxuICAgIHByaXZhdGUgYXNNZXRhZGF0YShpbnRlcnZhbDogSW50ZXJ2YWwpOiBhbnkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgc3RhcnQ6IHtcbiAgICAgICAgICAgICAgICBsaW5lOiAxLFxuICAgICAgICAgICAgICAgIGNvbHVtbjogaW50ZXJ2YWwuc3RhcnQsXG4gICAgICAgICAgICAgICAgb2Zmc2V0OiAwXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZW5kOiB7XG4gICAgICAgICAgICAgICAgbGluZTogMSxcbiAgICAgICAgICAgICAgICBjb2x1bW46IGludGVydmFsLnN0b3AsXG4gICAgICAgICAgICAgICAgb2Zmc2V0OiAzXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIHRocm93VHlwZUVycm9yKHR5cGVJZDogYW55KSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJVbmhhbmRsZWQgdHlwZSA6IFwiICsgdHlwZUlkICsgXCIgOiBcIiArIHRoaXMuZ2V0UnVsZUJ5SWQodHlwZUlkKSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVGhyb3cgVHlwZUVycm9yIG9ubHkgd2hlbiB0aGVyZSBpcyBhIHR5cGUgcHJvdmlkZWQuIFxuICAgICAqIFRoaXMgaXMgdXNlZnVsbCB3aGVuIHRoZXJlIG5vZGUgaXRhIFRlcm1pbmFsTm9kZSBcbiAgICAgKiBAcGFyYW0gdHlwZSBcbiAgICAgKi9cbiAgICBwcml2YXRlIHRocm93SW5zYW5jZUVycm9yKHR5cGU6IGFueSk6IHZvaWQge1xuICAgICAgICAvKiAgICAgICAgIGlmICh0eXBlID09IHVuZGVmaW5lZCB8fCB0eXBlID09IFwiXCIpIHtcbiAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfSAqL1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiVW5oYW5kbGVkIGluc3RhbmNlIHR5cGUgOiBcIiArIHR5cGUpO1xuICAgIH1cblxuICAgIHByaXZhdGUgYXNzZXJ0VHlwZShjdHg6IFJ1bGVDb250ZXh0LCB0eXBlOiBhbnkpOiB2b2lkIHtcbiAgICAgICAgaWYgKCEoY3R4IGluc3RhbmNlb2YgdHlwZSkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJJbnZhbGlkIHR5cGUgZXhwZWN0ZWQgOiAnXCIgKyB0eXBlLm5hbWUgKyBcIicgcmVjZWl2ZWQgJ1wiICsgdGhpcy5kdW1wQ29udGV4dChjdHgpKSArIFwiJ1wiO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjcHJvZ3JhbS5cbiAgICB2aXNpdFByb2dyYW0oY3R4OiBSdWxlQ29udGV4dCk6IFNjcmlwdCB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0UHJvZ3JhbSBbJXNdIDogJXNcIiwgY3R4LmdldENoaWxkQ291bnQoKSwgY3R4LmdldFRleHQoKSk7XG4gICAgICAgIC8vIHZpc2l0UHJvZ3JhbSAtPnZpc2l0U291cmNlRWxlbWVudHMgLT4gdmlzaXRTb3VyY2VFbGVtZW50IC0+IHZpc2l0U3RhdGVtZW50XG4gICAgICAgIGxldCBzdGF0ZW1lbnRzOiBhbnkgPSBbXTtcbiAgICAgICAgbGV0IG5vZGUgPSBjdHguZ2V0Q2hpbGQoMCk7ICAvLyB2aXNpdFByb2dyYW0gLT52aXNpdFNvdXJjZUVsZW1lbnRzIFxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5vZGUuZ2V0Q2hpbGRDb3VudCgpOyArK2kpIHtcbiAgICAgICAgICAgIGxldCBzdG0gPSBub2RlLmdldENoaWxkKGkpLmdldENoaWxkKDApOyAvLyBTb3VyY2VFbGVtZW50c0NvbnRleHQgPiBTdGF0ZW1lbnRDb250ZXh0XG4gICAgICAgICAgICBpZiAoc3RtIGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5TdGF0ZW1lbnRDb250ZXh0KSB7XG4gICAgICAgICAgICAgICAgbGV0IHN0YXRlbWVudCA9IHRoaXMudmlzaXRTdGF0ZW1lbnQoc3RtKTtcbiAgICAgICAgICAgICAgICBzdGF0ZW1lbnRzLnB1c2goc3RhdGVtZW50KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy50aHJvd0luc2FuY2VFcnJvcih0aGlzLmR1bXBDb250ZXh0KHN0bSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGxldCBpbnRlcnZhbCA9IGN0eC5nZXRTb3VyY2VJbnRlcnZhbCgpO1xuICAgICAgICBsZXQgc2NyaXB0ID0gbmV3IFNjcmlwdChzdGF0ZW1lbnRzKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGVjb3JhdGUoc2NyaXB0LCB0aGlzLmFzTWFya2VyKHRoaXMuYXNNZXRhZGF0YShpbnRlcnZhbCkpKTtcbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNzdGF0ZW1lbnQuXG4gICAgdmlzaXRTdGF0ZW1lbnQoY3R4OiBSdWxlQ29udGV4dCkgOiBhbnkge1xuICAgICAgICB0aGlzLmFzc2VydFR5cGUoY3R4LCBFQ01BU2NyaXB0UGFyc2VyLlN0YXRlbWVudENvbnRleHQpXG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0U3RhdGVtZW50IFslc10gOiAlc1wiLCBjdHguZ2V0Q2hpbGRDb3VudCgpLCBjdHguZ2V0VGV4dCgpKTtcbiAgICAgICAgY29uc3Qgbm9kZTogUnVsZUNvbnRleHQgPSBjdHguZ2V0Q2hpbGQoMCk7XG5cbiAgICAgICAgaWYgKG5vZGUgaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLkV4cHJlc3Npb25TdGF0ZW1lbnRDb250ZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy52aXNpdEV4cHJlc3Npb25TdGF0ZW1lbnQobm9kZSk7XG4gICAgICAgIH0gZWxzZSBpZiAobm9kZSBpbnN0YW5jZW9mIEVDTUFTY3JpcHRQYXJzZXIuVmFyaWFibGVTdGF0ZW1lbnRDb250ZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy52aXNpdFZhcmlhYmxlU3RhdGVtZW50KG5vZGUpO1xuICAgICAgICB9IGVsc2UgaWYgKG5vZGUgaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLkJsb2NrQ29udGV4dCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmlzaXRCbG9jayhub2RlKTtcbiAgICAgICAgfWVsc2UgaWYgKG5vZGUgaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLklmU3RhdGVtZW50Q29udGV4dCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmlzaXRJZlN0YXRlbWVudChub2RlKTtcbiAgICAgICAgfSBlbHNlIGlmIChub2RlIGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5FbXB0eVN0YXRlbWVudENvbnRleHQpIHtcbiAgICAgICAgICAgIC8vIE5PT1AsXG4gICAgICAgICAgICAvLyB2YXIgeDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMudGhyb3dJbnNhbmNlRXJyb3IodGhpcy5kdW1wQ29udGV4dChub2RlKSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNibG9jay5cbiAgICAgKiAvLy8gQmxvY2sgOlxuICAgICAqIC8vLyAgICAgeyBTdGF0ZW1lbnRMaXN0PyB9XG4gICAgICovXG4gICAgdmlzaXRCbG9jayhjdHg6IFJ1bGVDb250ZXh0KTogQmxvY2tTdGF0ZW1lbnR7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0QmxvY2sgWyVzXSA6ICVzXCIsIGN0eC5nZXRDaGlsZENvdW50KCksIGN0eC5nZXRUZXh0KCkpO1xuICAgICAgICB0aGlzLmFzc2VydFR5cGUoY3R4LCBFQ01BU2NyaXB0UGFyc2VyLkJsb2NrQ29udGV4dClcbiAgICAgICAgY29uc3QgYm9keSA9IFtdO1xuICAgICAgICBmb3IgKGxldCBpID0gMTsgaSA8IGN0eC5nZXRDaGlsZENvdW50KCktMTsgKytpKSB7XG4gICAgICAgICAgICBjb25zdCBub2RlOiBSdWxlQ29udGV4dCA9IGN0eC5nZXRDaGlsZChpKTtcbiAgICAgICAgICAgIGlmIChub2RlIGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5TdGF0ZW1lbnRMaXN0Q29udGV4dCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHN0YXRlbWVudExpc3QgPSB0aGlzLnZpc2l0U3RhdGVtZW50TGlzdChub2RlKTtcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGluZGV4IGluIHN0YXRlbWVudExpc3QpIHtcbiAgICAgICAgICAgICAgICAgICAgYm9keS5wdXNoKHN0YXRlbWVudExpc3RbaW5kZXhdKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMudGhyb3dJbnNhbmNlRXJyb3IodGhpcy5kdW1wQ29udGV4dChub2RlKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHJldHVybiB0aGlzLmRlY29yYXRlKG5ldyBCbG9ja1N0YXRlbWVudChib2R5KSwgdGhpcy5hc01hcmtlcih0aGlzLmFzTWV0YWRhdGEoY3R4LmdldFNvdXJjZUludGVydmFsKCkpKSk7XG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNzdGF0ZW1lbnRMaXN0LlxuICAgIHZpc2l0U3RhdGVtZW50TGlzdChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0U3RhdGVtZW50TGlzdCBbJXNdIDogJXNcIiwgY3R4LmdldENoaWxkQ291bnQoKSwgY3R4LmdldFRleHQoKSk7XG4gICAgICAgIGNvbnN0IGJvZHkgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjdHguZ2V0Q2hpbGRDb3VudCgpOyArK2kpIHtcbiAgICAgICAgICAgIGxldCBub2RlOiBSdWxlQ29udGV4dCA9IGN0eC5nZXRDaGlsZChpKTtcbiAgICAgICAgICAgIGxldCB0eXBlID0gbm9kZS5ydWxlSW5kZXg7XG4gICAgICAgICAgICBpZiAodHlwZSA9PSBFQ01BU2NyaXB0UGFyc2VyLlJVTEVfc3RhdGVtZW50KSB7XG4gICAgICAgICAgICAgICAgbGV0IHN0YXRlbWVudDogYW55ID0gdGhpcy52aXNpdFN0YXRlbWVudChub2RlKTtcbiAgICAgICAgICAgICAgICBib2R5LnB1c2goc3RhdGVtZW50KTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZSA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMudGhyb3dUeXBlRXJyb3IodHlwZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGJvZHk7XG4gICAgfVxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjdmFyaWFibGVTdGF0ZW1lbnQuXG4gICAgdmlzaXRWYXJpYWJsZVN0YXRlbWVudChjdHg6IFJ1bGVDb250ZXh0KTogVmFyaWFibGVEZWNsYXJhdGlvbiB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0VmFyaWFibGVTdGF0ZW1lbnQgWyVzXSA6ICVzXCIsIGN0eC5nZXRDaGlsZENvdW50KCksIGN0eC5nZXRUZXh0KCkpO1xuICAgICAgICB0aGlzLmFzc2VydFR5cGUoY3R4LCBFQ01BU2NyaXB0UGFyc2VyLlZhcmlhYmxlU3RhdGVtZW50Q29udGV4dClcbiAgICAgICAgdGhpcy5hc3NlcnROb2RlQ291bnQoY3R4LCAzKTtcblxuICAgICAgICBjb25zdCBuMCA9IGN0eC5nZXRDaGlsZCgwKTsgLy8gdmFyXG4gICAgICAgIGNvbnN0IG4xID0gY3R4LmdldENoaWxkKDEpOyAvLyB2YXJpYWJsZSBsaXN0XG4gICAgICAgIGNvbnN0IG4yID0gY3R4LmdldENoaWxkKDIpOyAgLy9Fb3NDb250ZXh0XG5cbiAgICAgICAgdGhpcy5kdW1wQ29udGV4dEFsbENoaWxkcmVuKG4yKVxuICAgICAgICBjb25zdCBkZWNsYXJhdGlvbnM6IFZhcmlhYmxlRGVjbGFyYXRvcltdID0gdGhpcy52aXNpdFZhcmlhYmxlRGVjbGFyYXRpb25MaXN0KG4xKTtcbiAgICAgICAgY29uc3Qga2luZCA9IFwidmFyXCI7XG4gICAgICAgIHJldHVybiBuZXcgVmFyaWFibGVEZWNsYXJhdGlvbihkZWNsYXJhdGlvbnMsIGtpbmQpO1xuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI3ZhcmlhYmxlRGVjbGFyYXRpb25MaXN0LlxuICAgIHZpc2l0VmFyaWFibGVEZWNsYXJhdGlvbkxpc3QoY3R4OiBSdWxlQ29udGV4dCk6IFZhcmlhYmxlRGVjbGFyYXRvcltdIHtcbiAgICAgICAgY29uc29sZS5pbmZvKFwiVmFyaWFibGVEZWNsYXJhdGlvbkxpc3RDb250ZXh0IFslc10gOiAlc1wiLCBjdHguZ2V0Q2hpbGRDb3VudCgpLCBjdHguZ2V0VGV4dCgpKTtcbiAgICAgICAgdGhpcy5hc3NlcnRUeXBlKGN0eCwgRUNNQVNjcmlwdFBhcnNlci5WYXJpYWJsZURlY2xhcmF0aW9uTGlzdENvbnRleHQpXG5cbiAgICAgICAgLy90aGlzLmFzc2VydE5vZGVDb3VudChjdHgsIDMpO1xuXG4gICAgICAgIGNvbnN0IGRlY2xhcmF0aW9uczogVmFyaWFibGVEZWNsYXJhdG9yW10gPSBbXTtcbiAgICAgICAgY29uc3Qgbm9kZXMgPSB0aGlzLmZpbHRlclN5bWJvbHMoY3R4KTtcbiAgICAgICAgbm9kZXMuZm9yRWFjaChub2RlID0+IHtcbiAgICAgICAgICAgIGlmIChub2RlIGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5WYXJpYWJsZURlY2xhcmF0aW9uQ29udGV4dCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGRlY2xhcmF0aW9uID0gdGhpcy52aXNpdFZhcmlhYmxlRGVjbGFyYXRpb24obm9kZSlcbiAgICAgICAgICAgICAgICBkZWNsYXJhdGlvbnMucHVzaChkZWNsYXJhdGlvbilcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy50aHJvd0luc2FuY2VFcnJvcih0aGlzLmR1bXBDb250ZXh0KG5vZGUpKVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGRlY2xhcmF0aW9ucztcbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciN2YXJpYWJsZURlY2xhcmF0aW9uLlxuICAgIHZpc2l0VmFyaWFibGVEZWNsYXJhdGlvbihjdHg6IFJ1bGVDb250ZXh0KTogVmFyaWFibGVEZWNsYXJhdG9yIHtcbiAgICAgICAgY29uc29sZS5pbmZvKFwidmlzaXRWYXJpYWJsZURlY2xhcmF0aW9uIFslc10gOiAlc1wiLCBjdHguZ2V0Q2hpbGRDb3VudCgpLCBjdHguZ2V0VGV4dCgpKTtcbiAgICAgICAgdGhpcy5hc3NlcnRUeXBlKGN0eCwgRUNNQVNjcmlwdFBhcnNlci5WYXJpYWJsZURlY2xhcmF0aW9uQ29udGV4dClcbiAgICAgICAgLy8gbGVuZ2h0IG9mIDEgb3IgMlxuICAgICAgICAvLyAxIGB2YXIgeGBcbiAgICAgICAgLy8gMiBgdmFyIHggPSB7fWBcbiAgICAgICAgY29uc3QgdGV4dCA9IGN0eC5nZXRUZXh0KCk7XG4gICAgICAgIGNvbnN0IGlkID0gbmV3IElkZW50aWZpZXIodGV4dCk7XG4gICAgICAgIGxldCBpbml0ID0gbnVsbDtcbiAgICAgICAgaWYgKGN0eC5nZXRDaGlsZENvdW50KCkgPT0gMikge1xuICAgICAgICAgICAgaW5pdCA9IHRoaXMudmlzaXRJbml0aWFsaXNlcihjdHguZ2V0Q2hpbGQoMSkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlVua25vdyB2YXJpYWJsZSBkZWNsYXJhdGlvbiB0eXBlXCIpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXcgVmFyaWFibGVEZWNsYXJhdG9yKGlkLCBpbml0KTtcbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNpbml0aWFsaXNlci5cbiAgICB2aXNpdEluaXRpYWxpc2VyKGN0eDogUnVsZUNvbnRleHQpOiBPYmplY3RFeHByZXNzaW9uIHwgQXJyYXlFeHByZXNzaW9uIHwgdW5kZWZpbmVkIHtcbiAgICAgICAgY29uc29sZS5pbmZvKFwidmlzaXRJbml0aWFsaXNlciBbJXNdIDogJXNcIiwgY3R4LmdldENoaWxkQ291bnQoKSwgY3R4LmdldFRleHQoKSk7XG4gICAgICAgIHRoaXMuYXNzZXJ0VHlwZShjdHgsIEVDTUFTY3JpcHRQYXJzZXIuSW5pdGlhbGlzZXJDb250ZXh0KVxuICAgICAgICB0aGlzLmFzc2VydE5vZGVDb3VudChjdHgsIDIpO1xuICAgICAgICBjb25zdCBub2RlOiBSdWxlQ29udGV4dCA9IGN0eC5nZXRDaGlsZCgxKTtcbiAgICAgICAgaWYgKG5vZGUgaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLk9iamVjdExpdGVyYWxFeHByZXNzaW9uQ29udGV4dCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmlzaXRPYmplY3RMaXRlcmFsRXhwcmVzc2lvbihub2RlKTtcbiAgICAgICAgfSBlbHNlIGlmIChub2RlIGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5BcnJheUxpdGVyYWxFeHByZXNzaW9uQ29udGV4dCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmlzaXRBcnJheUxpdGVyYWxFeHByZXNzaW9uKG5vZGUpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMudGhyb3dJbnNhbmNlRXJyb3IodGhpcy5kdW1wQ29udGV4dChub2RlKSlcbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNlbXB0eVN0YXRlbWVudC5cbiAgICB2aXNpdEVtcHR5U3RhdGVtZW50KGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS5pbmZvKFwidmlzaXRFbXB0eVN0YXRlbWVudCBbJXNdIDogJXNcIiwgY3R4LmdldENoaWxkQ291bnQoKSwgY3R4LmdldFRleHQoKSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRSdWxlVHlwZShub2RlOiBhbnksIGluZGV4OiBudW1iZXIpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gbm9kZS5nZXRDaGlsZChpbmRleCkucnVsZUluZGV4O1xuICAgIH1cblxuICAgIHByaXZhdGUgYXNzZXJ0Tm9kZUNvdW50KGN0eDogUnVsZUNvbnRleHQsIGNvdW50OiBudW1iZXIpIHtcbiAgICAgICAgaWYgKGN0eC5nZXRDaGlsZENvdW50KCkgIT0gY291bnQpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIldyb25nIGNoaWxkIGNvdW50LCBleHBlY3RlZCAnXCIgKyBjb3VudCArIFwiJyBnb3QgOiBcIiArIGN0eC5nZXRDaGlsZENvdW50KCkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjZXhwcmVzc2lvblN0YXRlbWVudC5cbiAgICB2aXNpdEV4cHJlc3Npb25TdGF0ZW1lbnQoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJ2aXNpdEV4cHJlc3Npb25TdGF0ZW1lbnQgWyVzXSA6ICVzXCIsIGN0eC5nZXRDaGlsZENvdW50KCksIGN0eC5nZXRUZXh0KCkpO1xuICAgICAgICB0aGlzLmFzc2VydFR5cGUoY3R4LCBFQ01BU2NyaXB0UGFyc2VyLkV4cHJlc3Npb25TdGF0ZW1lbnRDb250ZXh0KVxuICAgICAgICB0aGlzLmFzc2VydE5vZGVDb3VudChjdHgsIDEpO1xuICAgICAgICAvLyB2aXNpdEV4cHJlc3Npb25TdGF0ZW1lbnQ6PnZpc2l0RXhwcmVzc2lvblNlcXVlbmNlXG4gICAgICAgIGNvbnN0IG5vZGU6IFJ1bGVDb250ZXh0ID0gY3R4LmdldENoaWxkKDApOyAvLyB2aXNpdEV4cHJlc3Npb25TZXF1ZW5jZSBcbiAgICAgICAgbGV0IGV4cFxuICAgICAgICBpZiAobm9kZSBpbnN0YW5jZW9mIEVDTUFTY3JpcHRQYXJzZXIuRXhwcmVzc2lvblNlcXVlbmNlQ29udGV4dCkge1xuICAgICAgICAgICAgZXhwID0gdGhpcy52aXNpdEV4cHJlc3Npb25TZXF1ZW5jZShub2RlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMudGhyb3dJbnNhbmNlRXJyb3IodGhpcy5kdW1wQ29udGV4dChub2RlKSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZXhwIC8vdGhpcy5kZWNvcmF0ZShleHAsIHRoaXMuYXNNYXJrZXIodGhpcy5hc01ldGFkYXRhKGN0eC5nZXRTb3VyY2VJbnRlcnZhbCgpKSkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogIC8vLyBJZlN0YXRlbWVudCA6XG4gICAgICogLy8vICAgICBpZiAoIEV4cHJlc3Npb24gKSBTdGF0ZW1lbnQgZWxzZSBTdGF0ZW1lbnQgICAgPT4gNyBOb2Rlc1xuICAgICAqIC8vLyAgICAgaWYgKCBFeHByZXNzaW9uICkgU3RhdGVtZW50ICAgICAgICAgICAgICAgICAgID0+IDUgTm9kZXMgICAgXG4gICAgICovXG4gICAgdmlzaXRJZlN0YXRlbWVudChjdHg6IFJ1bGVDb250ZXh0KTogSWZTdGF0ZW1lbnQge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJ2aXNpdElmU3RhdGVtZW50IFslc10gOiAlc1wiLCBjdHguZ2V0Q2hpbGRDb3VudCgpLCBjdHguZ2V0VGV4dCgpKTtcbiAgICAgICAgdGhpcy5hc3NlcnRUeXBlKGN0eCwgRUNNQVNjcmlwdFBhcnNlci5JZlN0YXRlbWVudENvbnRleHQpXG4gICAgICAgIGNvbnN0IGNvdW50ID0gY3R4LmdldENoaWxkQ291bnQoKTtcbiAgICAgICAgY29uc3QgdGVzdCA9IHRoaXMudmlzaXRFeHByZXNzaW9uU2VxdWVuY2UoY3R4LmdldENoaWxkKDIpKTtcbiAgICAgICAgY29uc3QgY29uc2VxdWVudCA9IHRoaXMudmlzaXRTdGF0ZW1lbnQoY3R4LmdldENoaWxkKDQpKTtcbiAgICAgICAgY29uc3QgYWx0ZXJuYXRlID0gY291bnQgPT0gNyA/IHRoaXMudmlzaXRTdGF0ZW1lbnQoY3R4LmdldENoaWxkKDYpKSA6IHVuZGVmaW5lZDtcblxuICAgICAgICByZXR1cm4gbmV3IElmU3RhdGVtZW50KHRlc3QsIGNvbnNlcXVlbnQsIGFsdGVybmF0ZSk7XG4gICAgfVxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjRG9TdGF0ZW1lbnQuXG4gICAgdmlzaXREb1N0YXRlbWVudChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0RG9TdGF0ZW1lbnQ6IFwiICsgY3R4LmdldFRleHQoKSk7XG5cbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI1doaWxlU3RhdGVtZW50LlxuICAgIHZpc2l0V2hpbGVTdGF0ZW1lbnQoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJ2aXNpdFdoaWxlU3RhdGVtZW50OiBcIiArIGN0eC5nZXRUZXh0KCkpO1xuXG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNGb3JTdGF0ZW1lbnQuXG4gICAgdmlzaXRGb3JTdGF0ZW1lbnQoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJ2aXNpdFdoaWxlU3RhdGVtZW50OiBcIiArIGN0eC5nZXRUZXh0KCkpO1xuXG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNGb3JWYXJTdGF0ZW1lbnQuXG4gICAgdmlzaXRGb3JWYXJTdGF0ZW1lbnQoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuXG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNGb3JJblN0YXRlbWVudC5cbiAgICB2aXNpdEZvckluU3RhdGVtZW50KGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcblxuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjRm9yVmFySW5TdGF0ZW1lbnQuXG4gICAgdmlzaXRGb3JWYXJJblN0YXRlbWVudChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG5cbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2NvbnRpbnVlU3RhdGVtZW50LlxuICAgIHZpc2l0Q29udGludWVTdGF0ZW1lbnQoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuXG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNicmVha1N0YXRlbWVudC5cbiAgICB2aXNpdEJyZWFrU3RhdGVtZW50KGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcblxuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjcmV0dXJuU3RhdGVtZW50LlxuICAgIHZpc2l0UmV0dXJuU3RhdGVtZW50KGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcblxuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjd2l0aFN0YXRlbWVudC5cbiAgICB2aXNpdFdpdGhTdGF0ZW1lbnQoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuXG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNzd2l0Y2hTdGF0ZW1lbnQuXG4gICAgdmlzaXRTd2l0Y2hTdGF0ZW1lbnQoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuXG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNjYXNlQmxvY2suXG4gICAgdmlzaXRDYXNlQmxvY2soY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuXG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNjYXNlQ2xhdXNlcy5cbiAgICB2aXNpdENhc2VDbGF1c2VzKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcblxuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjY2FzZUNsYXVzZS5cbiAgICB2aXNpdENhc2VDbGF1c2UoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuXG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNkZWZhdWx0Q2xhdXNlLlxuICAgIHZpc2l0RGVmYXVsdENsYXVzZShjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG5cbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2xhYmVsbGVkU3RhdGVtZW50LlxuICAgIHZpc2l0TGFiZWxsZWRTdGF0ZW1lbnQoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuXG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciN0aHJvd1N0YXRlbWVudC5cbiAgICB2aXNpdFRocm93U3RhdGVtZW50KGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcblxuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjdHJ5U3RhdGVtZW50LlxuICAgIHZpc2l0VHJ5U3RhdGVtZW50KGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcblxuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjY2F0Y2hQcm9kdWN0aW9uLlxuICAgIHZpc2l0Q2F0Y2hQcm9kdWN0aW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcblxuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjZmluYWxseVByb2R1Y3Rpb24uXG4gICAgdmlzaXRGaW5hbGx5UHJvZHVjdGlvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG5cbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2RlYnVnZ2VyU3RhdGVtZW50LlxuICAgIHZpc2l0RGVidWdnZXJTdGF0ZW1lbnQoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuXG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNmdW5jdGlvbkRlY2xhcmF0aW9uLlxuICAgIHZpc2l0RnVuY3Rpb25EZWNsYXJhdGlvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG5cbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2Zvcm1hbFBhcmFtZXRlckxpc3QuXG4gICAgdmlzaXRGb3JtYWxQYXJhbWV0ZXJMaXN0KGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2Z1bmN0aW9uQm9keS5cbiAgICB2aXNpdEZ1bmN0aW9uQm9keShjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0RnVuY3Rpb25Cb2R5OiBcIiArIGN0eC5nZXRUZXh0KCkpO1xuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjYXJyYXlMaXRlcmFsLlxuICAgIHZpc2l0QXJyYXlMaXRlcmFsKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS5pbmZvKFwidmlzaXRBcnJheUxpdGVyYWwgWyVzXSA6ICVzXCIsIGN0eC5nZXRDaGlsZENvdW50KCksIGN0eC5nZXRUZXh0KCkpO1xuICAgICAgICB0aGlzLmFzc2VydFR5cGUoY3R4LCBFQ01BU2NyaXB0UGFyc2VyLkFycmF5TGl0ZXJhbENvbnRleHQpXG4gICAgICAgIC8vIHdlIGp1c3QgZ290IGBbXWBcbiAgICAgICAgaWYgKGN0eC5nZXRDaGlsZENvdW50KCkgPT0gMikge1xuICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHJlc3VsdHMgPSBbXVxuICAgICAgICAvLyBza2lwIGBbIGFuZCAgXWAgXG4gICAgICAgIGZvciAobGV0IGkgPSAxOyBpIDwgY3R4LmdldENoaWxkQ291bnQoKSAtIDE7ICsraSkge1xuICAgICAgICAgICAgY29uc3Qgbm9kZTogUnVsZUNvbnRleHQgPSBjdHguZ2V0Q2hpbGQoaSk7XG4gICAgICAgICAgICBsZXQgZXhwID0gW107XG4gICAgICAgICAgICBpZiAobm9kZSBpbnN0YW5jZW9mIEVDTUFTY3JpcHRQYXJzZXIuRWxlbWVudExpc3RDb250ZXh0KSB7XG4gICAgICAgICAgICAgICAgZXhwID0gdGhpcy52aXNpdEVsZW1lbnRMaXN0KG5vZGUpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChub2RlIGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5FbGlzaW9uQ29udGV4dCkge1xuICAgICAgICAgICAgICAgIGV4cCA9IHRoaXMudmlzaXRFbGlzaW9uKG5vZGUpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBzcGVjaWFsIGNhc2UgZm9yIGhhbmRsaW5nIGVsaXNpb24gdmFsdWVzIGxpa2UgOiAgWzExLCwsMTFdIF0gIFssLF1cbiAgICAgICAgICAgICAgICBpZiAobm9kZS5zeW1ib2wgIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIGV4cCA9IFtudWxsXVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50aHJvd0luc2FuY2VFcnJvcih0aGlzLmR1bXBDb250ZXh0KG5vZGUpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXN1bHRzID0gWy4uLnJlc3VsdHMsIC4uLmV4cF07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgfVxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjZWxlbWVudExpc3QuXG4gICAgdmlzaXRFbGVtZW50TGlzdChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0RWxlbWVudExpc3QgWyVzXSA6ICVzXCIsIGN0eC5nZXRDaGlsZENvdW50KCksIGN0eC5nZXRUZXh0KCkpO1xuICAgICAgICB0aGlzLmFzc2VydFR5cGUoY3R4LCBFQ01BU2NyaXB0UGFyc2VyLkVsZW1lbnRMaXN0Q29udGV4dClcbiAgICAgICAgY29uc3QgZWxlbWVudHMgPSBbXTtcbiAgICAgICAgY29uc3Qgbm9kZXM6IFJ1bGVDb250ZXh0W10gPSB0aGlzLmZpbHRlclN5bWJvbHMoY3R4KTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgY29uc3QgZWxlbSA9IHRoaXMuc2luZ2xlRXhwcmVzc2lvbihub2Rlc1tpXSk7XG4gICAgICAgICAgICBlbGVtZW50cy5wdXNoKGVsZW0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBlbGVtZW50cztcbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNlbGlzaW9uLlxuICAgIHZpc2l0RWxpc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0RWxpc2lvbiBbJXNdIDogJXNcIiwgY3R4LmdldENoaWxkQ291bnQoKSwgY3R4LmdldFRleHQoKSk7XG4gICAgICAgIHRoaXMuYXNzZXJ0VHlwZShjdHgsIEVDTUFTY3JpcHRQYXJzZXIuRWxpc2lvbkNvbnRleHQpXG4gICAgICAgIC8vIGNvbXBsaWFuY2U6IGVzcHJpbWEgY29tcGxpYW5lIG9yIHJldHVybmluZyBgbnVsbGAgXG4gICAgICAgIGNvbnN0IGVsaXNpb24gPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjdHguZ2V0Q2hpbGRDb3VudCgpOyArK2kpIHtcbiAgICAgICAgICAgIGVsaXNpb24ucHVzaChudWxsKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZWxpc2lvbjtcbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNvYmplY3RMaXRlcmFsLlxuICAgIHZpc2l0T2JqZWN0TGl0ZXJhbChjdHg6IFJ1bGVDb250ZXh0KTogT2JqZWN0RXhwcmVzc2lvblByb3BlcnR5W10ge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJ2aXNpdE9iamVjdExpdGVyYWwgWyVzXSA6ICVzXCIsIGN0eC5nZXRDaGlsZENvdW50KCksIGN0eC5nZXRUZXh0KCkpO1xuICAgICAgICB0aGlzLmFzc2VydFR5cGUoY3R4LCBFQ01BU2NyaXB0UGFyc2VyLk9iamVjdExpdGVyYWxDb250ZXh0KTtcbiAgICAgICAgY29uc3Qgbm9kZTogUnVsZUNvbnRleHQgPSBjdHguZ2V0Q2hpbGQoMSk7XG4gICAgICAgIGlmIChub2RlIGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5Qcm9wZXJ0eU5hbWVBbmRWYWx1ZUxpc3RDb250ZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy52aXNpdFByb3BlcnR5TmFtZUFuZFZhbHVlTGlzdChub2RlKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gW107XG4gICAgfVxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjcHJvcGVydHlOYW1lQW5kVmFsdWVMaXN0LlxuICAgIHZpc2l0UHJvcGVydHlOYW1lQW5kVmFsdWVMaXN0KGN0eDogUnVsZUNvbnRleHQpOiBPYmplY3RFeHByZXNzaW9uUHJvcGVydHlbXSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0UHJvcGVydHlOYW1lQW5kVmFsdWVMaXN0IFslc10gOiAlc1wiLCBjdHguZ2V0Q2hpbGRDb3VudCgpLCBjdHguZ2V0VGV4dCgpKTtcbiAgICAgICAgdGhpcy5hc3NlcnRUeXBlKGN0eCwgRUNNQVNjcmlwdFBhcnNlci5Qcm9wZXJ0eU5hbWVBbmRWYWx1ZUxpc3RDb250ZXh0KTtcbiAgICAgICAgY29uc3QgcHJvcGVydGllczogT2JqZWN0RXhwcmVzc2lvblByb3BlcnR5W10gPSBbXTtcbiAgICAgICAgY29uc3Qgbm9kZXM6IFJ1bGVDb250ZXh0W10gPSB0aGlzLmZpbHRlclN5bWJvbHMoY3R4KTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgY29uc3Qgbm9kZSA9IG5vZGVzW2ldO1xuICAgICAgICAgICAgaWYgKG5vZGUgaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLlByb3BlcnR5RXhwcmVzc2lvbkFzc2lnbm1lbnRDb250ZXh0KSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcHJvcGVydHk6IE9iamVjdEV4cHJlc3Npb25Qcm9wZXJ0eSA9IHRoaXMudmlzaXRQcm9wZXJ0eUV4cHJlc3Npb25Bc3NpZ25tZW50KG5vZGUpO1xuICAgICAgICAgICAgICAgIHByb3BlcnRpZXMucHVzaChwcm9wZXJ0eSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMudGhyb3dJbnNhbmNlRXJyb3IodGhpcy5kdW1wQ29udGV4dChub2RlKSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcHJvcGVydGllcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBGaWx0ZXIgb3V0IFRlcm1pbmFsTm9kZXMgKGNvbW1hcywgcGlwZXMsIGJyYWNrZXRzKVxuICAgICAqIEBwYXJhbSBjdHggXG4gICAgICovXG4gICAgcHJpdmF0ZSBmaWx0ZXJTeW1ib2xzKGN0eDogUnVsZUNvbnRleHQpOiBSdWxlQ29udGV4dFtdIHtcbiAgICAgICAgY29uc3QgZmlsdGVyZWQ6IFJ1bGVDb250ZXh0W10gPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjdHguZ2V0Q2hpbGRDb3VudCgpOyArK2kpIHtcbiAgICAgICAgICAgIGNvbnN0IG5vZGUgPSBjdHguZ2V0Q2hpbGQoaSk7XG4gICAgICAgICAgICAvLyB0aGVyZSBtaWdodCBiZSBhIGJldHRlciB3YXlcbiAgICAgICAgICAgIGlmIChub2RlLnN5bWJvbCAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZpbHRlcmVkLnB1c2gobm9kZSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZpbHRlcmVkO1xuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI1Byb3BlcnR5RXhwcmVzc2lvbkFzc2lnbm1lbnQuXG4gICAgdmlzaXRQcm9wZXJ0eUV4cHJlc3Npb25Bc3NpZ25tZW50KGN0eDogUnVsZUNvbnRleHQpOiBPYmplY3RFeHByZXNzaW9uUHJvcGVydHkge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJ2aXNpdFByb3BlcnR5RXhwcmVzc2lvbkFzc2lnbm1lbnQgWyVzXSA6ICVzXCIsIGN0eC5nZXRDaGlsZENvdW50KCksIGN0eC5nZXRUZXh0KCkpO1xuICAgICAgICB0aGlzLmFzc2VydFR5cGUoY3R4LCBFQ01BU2NyaXB0UGFyc2VyLlByb3BlcnR5RXhwcmVzc2lvbkFzc2lnbm1lbnRDb250ZXh0KTtcbiAgICAgICAgdGhpcy5hc3NlcnROb2RlQ291bnQoY3R4LCAzKTtcbiAgICAgICAgbGV0IG4wID0gY3R4LmdldENoaWxkKDApOyAvLyBQcm9wZXJ0eU5hbWVcbiAgICAgICAgbGV0IG4xID0gY3R4LmdldENoaWxkKDEpOyAvLyBzeW1ib2wgOlxuICAgICAgICBsZXQgbjIgPSBjdHguZ2V0Q2hpbGQoMik7IC8vICBzaW5nbGVFeHByZXNzaW9uIFxuICAgICAgICBjb25zdCBrZXk6IFByb3BlcnR5S2V5ID0gdGhpcy52aXNpdFByb3BlcnR5TmFtZShuMCk7XG4gICAgICAgIGNvbnN0IHZhbHVlID0gdGhpcy5zaW5nbGVFeHByZXNzaW9uKG4yKTtcbiAgICAgICAgY29uc3QgY29tcHV0ZWQgPSBmYWxzZTtcbiAgICAgICAgY29uc3QgbWV0aG9kID0gZmFsc2U7XG4gICAgICAgIGNvbnN0IHNob3J0aGFuZCA9IGZhbHNlO1xuXG4gICAgICAgIHJldHVybiBuZXcgUHJvcGVydHkoXCJpbml0XCIsIGtleSwgY29tcHV0ZWQsIHZhbHVlLCBtZXRob2QsIHNob3J0aGFuZCk7XG4gICAgfVxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjUHJvcGVydHlHZXR0ZXIuXG4gICAgdmlzaXRQcm9wZXJ0eUdldHRlcihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG5cbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI1Byb3BlcnR5U2V0dGVyLlxuICAgIHZpc2l0UHJvcGVydHlTZXR0ZXIoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuXG4gICAgfVxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjcHJvcGVydHlOYW1lLlxuICAgIHZpc2l0UHJvcGVydHlOYW1lKGN0eDogUnVsZUNvbnRleHQpOiBQcm9wZXJ0eUtleSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0UHJvcGVydHlOYW1lIFslc10gOiAlc1wiLCBjdHguZ2V0Q2hpbGRDb3VudCgpLCBjdHguZ2V0VGV4dCgpKTtcbiAgICAgICAgdGhpcy5hc3NlcnRUeXBlKGN0eCwgRUNNQVNjcmlwdFBhcnNlci5Qcm9wZXJ0eU5hbWVDb250ZXh0KTtcbiAgICAgICAgdGhpcy5hc3NlcnROb2RlQ291bnQoY3R4LCAxKTtcbiAgICAgICAgY29uc3Qgbm9kZSA9IGN0eC5nZXRDaGlsZCgwKTtcbiAgICAgICAgY29uc3QgY291bnQgPSBub2RlLmdldENoaWxkQ291bnQoKTtcbiAgICAgICAgaWYgKGNvdW50ID09IDApIHsgLy8gbGl0ZXJhbFxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY3JlYXRlTGl0ZXJhbFZhbHVlKG5vZGUpO1xuICAgICAgICB9IGVsc2UgaWYgKGNvdW50ID09IDEpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnZpc2l0SWRlbnRpZmllck5hbWUobm9kZSlcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnRocm93SW5zYW5jZUVycm9yKHRoaXMuZHVtcENvbnRleHQobm9kZSkpO1xuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI3Byb3BlcnR5U2V0UGFyYW1ldGVyTGlzdC5cbiAgICB2aXNpdFByb3BlcnR5U2V0UGFyYW1ldGVyTGlzdChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG5cbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNhcmd1bWVudHMuXG4gICAgdmlzaXRBcmd1bWVudHMoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJ2aXNpdEFyZ3VtZW50czogXCIgKyBjdHguZ2V0VGV4dCgpKTtcblxuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2FyZ3VtZW50TGlzdC5cbiAgICB2aXNpdEFyZ3VtZW50TGlzdChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0QXJndW1lbnRMaXN0OiBcIiArIGN0eC5nZXRUZXh0KCkpO1xuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2V4cHJlc3Npb25TZXF1ZW5jZS5cbiAgICB2aXNpdEV4cHJlc3Npb25TZXF1ZW5jZShjdHg6IFJ1bGVDb250ZXh0KTogRXhwcmVzc2lvblN0YXRlbWVudHtcbiAgICAgICAgY29uc29sZS5pbmZvKFwidmlzaXRFeHByZXNzaW9uU2VxdWVuY2UgWyVzXSA6IFslc11cIiwgY3R4LmdldENoaWxkQ291bnQoKSwgY3R4LmdldFRleHQoKSk7XG4gICAgICAgIHRoaXMuYXNzZXJ0VHlwZShjdHgsIEVDTUFTY3JpcHRQYXJzZXIuRXhwcmVzc2lvblNlcXVlbmNlQ29udGV4dCk7XG4gICAgICAgIGNvbnN0IGV4cHJlc3Npb25zID0gW107XG4gICAgICAgIC8vIGVhY2ggbm9kZSBpcyBhIHNpbmdsZUV4cHJlc3Npb25cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjdHguZ2V0Q2hpbGRDb3VudCgpOyArK2kpIHtcbiAgICAgICAgICAgIGNvbnN0IG5vZGU6IFJ1bGVDb250ZXh0ID0gY3R4LmdldENoaWxkKGkpO1xuICAgICAgICAgICAgY29uc3QgZXhwID0gdGhpcy5zaW5nbGVFeHByZXNzaW9uKG5vZGUpO1xuICAgICAgICAgICAgZXhwcmVzc2lvbnMucHVzaChleHApO1xuICAgICAgICB9XG4gICAgICAgIC8vIGNvbXBsaWFuY2U6IGVzcGlybWEsIGVzcHJlZVxuICAgICAgICAvLyB0aGlzIGNoZWNrIHRvIHNlZSBpZiB0aGVyZSBhcmUgbXVsdGlwbGUgZXhwcmVzc2lvbnMgaWYgc28gdGhlbiB3ZSBsZWF2ZSB0aGVtIGFzIFNlcXVlbmNlRXhwcmVzc2lvbiBcbiAgICAgICAgLy8gb3RoZXJ3aXNlIHdlIHdpbGwgcm9sbCB0aGVtIHVwIGludG8gRXhwcmVzc2lvblN0YXRlbWVudCB3aXRoIG9uZSBleHByZXNzaW9uXG4gICAgICAgIC8vIGAxYCA9IEV4cHJlc3Npb25TdGF0ZW1lbnQgLT4gTGl0ZXJhbFxuICAgICAgICAvLyBgMSwgMmAgPSBFeHByZXNzaW9uU3RhdGVtZW50IC0+IFNlcXVlbmNlRXhwcmVzc2lvbiAtPiBMaXRlcmFsLCBMaXRlcmFsXG4gICAgICAgIGxldCBleHA7XG4gICAgICAgIGlmIChleHByZXNzaW9ucy5sZW5ndGggPT0gMSkge1xuICAgICAgICAgICAgZXhwID0gbmV3IEV4cHJlc3Npb25TdGF0ZW1lbnQoZXhwcmVzc2lvbnNbMF0pXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBleHAgPSBuZXcgU2VxdWVuY2VFeHByZXNzaW9uKGV4cHJlc3Npb25zKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5kZWNvcmF0ZShleHAsIHRoaXMuYXNNYXJrZXIodGhpcy5hc01ldGFkYXRhKGN0eC5nZXRTb3VyY2VJbnRlcnZhbCgpKSkpXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRXZhbHVhdGUgYSBzaW5nbGVFeHByZXNzaW9uXG4gICAgICogQHBhcmFtIG5vZGUgXG4gICAgICovXG4gICAgc2luZ2xlRXhwcmVzc2lvbihub2RlOiBSdWxlQ29udGV4dCk6IGFueSB7XG4gICAgICAgIGlmIChub2RlIGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5MaXRlcmFsRXhwcmVzc2lvbkNvbnRleHQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnZpc2l0TGl0ZXJhbEV4cHJlc3Npb24obm9kZSk7XG4gICAgICAgIH0gZWxzZSBpZiAobm9kZSBpbnN0YW5jZW9mIEVDTUFTY3JpcHRQYXJzZXIuT2JqZWN0TGl0ZXJhbEV4cHJlc3Npb25Db250ZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy52aXNpdE9iamVjdExpdGVyYWxFeHByZXNzaW9uKG5vZGUpO1xuICAgICAgICB9IGVsc2UgaWYgKG5vZGUgaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLkFzc2lnbm1lbnRFeHByZXNzaW9uQ29udGV4dCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmlzaXRBc3NpZ25tZW50RXhwcmVzc2lvbihub2RlKTtcbiAgICAgICAgfSBlbHNlIGlmIChub2RlIGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5BZGRpdGl2ZUV4cHJlc3Npb25Db250ZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy52aXNpdEFkZGl0aXZlRXhwcmVzc2lvbihub2RlKTtcbiAgICAgICAgfSBlbHNlIGlmIChub2RlIGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5NdWx0aXBsaWNhdGl2ZUV4cHJlc3Npb25Db250ZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy52aXNpdE11bHRpcGxpY2F0aXZlRXhwcmVzc2lvbihub2RlKTtcbiAgICAgICAgfSBlbHNlIGlmIChub2RlIGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5BcnJheUxpdGVyYWxFeHByZXNzaW9uQ29udGV4dCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmlzaXRBcnJheUxpdGVyYWxFeHByZXNzaW9uKG5vZGUpO1xuICAgICAgICB9IGVsc2UgaWYgKG5vZGUgaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLkVxdWFsaXR5RXhwcmVzc2lvbkNvbnRleHQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnZpc2l0RXF1YWxpdHlFeHByZXNzaW9uKG5vZGUpO1xuICAgICAgICB9IGVsc2UgaWYgKG5vZGUgaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLlBhcmVudGhlc2l6ZWRFeHByZXNzaW9uQ29udGV4dCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmlzaXRQYXJlbnRoZXNpemVkRXhwcmVzc2lvbihub2RlKTtcbiAgICAgICAgfSBlbHNlIGlmIChub2RlIGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5SZWxhdGlvbmFsRXhwcmVzc2lvbkNvbnRleHQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnZpc2l0UmVsYXRpb25hbEV4cHJlc3Npb24obm9kZSk7XG4gICAgICAgIH0gZWxzZSBpZiAobm9kZSBpbnN0YW5jZW9mIEVDTUFTY3JpcHRQYXJzZXIuSWRlbnRpZmllckV4cHJlc3Npb25Db250ZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy52aXNpdElkZW50aWZpZXJFeHByZXNzaW9uKG5vZGUpO1xuICAgICAgICB9IGVsc2UgaWYgKG5vZGUgaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLk1lbWJlckRvdEV4cHJlc3Npb25Db250ZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy52aXNpdE1lbWJlckRvdEV4cHJlc3Npb24obm9kZSk7XG4gICAgICAgIH0gZWxzZSBpZiAobm9kZSBpbnN0YW5jZW9mIEVDTUFTY3JpcHRQYXJzZXIuTWVtYmVySW5kZXhFeHByZXNzaW9uQ29udGV4dCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmlzaXRNZW1iZXJJbmRleEV4cHJlc3Npb24obm9kZSk7XG4gICAgICAgIH1lbHNlIGlmIChub2RlIGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5Bc3NpZ25tZW50T3BlcmF0b3JFeHByZXNzaW9uQ29udGV4dCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmlzaXRBc3NpZ25tZW50T3BlcmF0b3JFeHByZXNzaW9uKG5vZGUpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMudGhyb3dJbnNhbmNlRXJyb3IodGhpcy5kdW1wQ29udGV4dChub2RlKSk7XG4gICAgfVxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjVGVybmFyeUV4cHJlc3Npb24uXG4gICAgdmlzaXRUZXJuYXJ5RXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNMb2dpY2FsQW5kRXhwcmVzc2lvbi5cbiAgICB2aXNpdExvZ2ljYWxBbmRFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcblxuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjUHJlSW5jcmVtZW50RXhwcmVzc2lvbi5cbiAgICB2aXNpdFByZUluY3JlbWVudEV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuXG4gICAgfVxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjT2JqZWN0TGl0ZXJhbEV4cHJlc3Npb24uXG4gICAgdmlzaXRPYmplY3RMaXRlcmFsRXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KTogT2JqZWN0RXhwcmVzc2lvbiB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0T2JqZWN0TGl0ZXJhbEV4cHJlc3Npb24gWyVzXSA6ICVzXCIsIGN0eC5nZXRDaGlsZENvdW50KCksIGN0eC5nZXRUZXh0KCkpO1xuICAgICAgICB0aGlzLmFzc2VydFR5cGUoY3R4LCBFQ01BU2NyaXB0UGFyc2VyLk9iamVjdExpdGVyYWxFeHByZXNzaW9uQ29udGV4dCk7XG4gICAgICAgIGNvbnN0IG5vZGUgPSBjdHguZ2V0Q2hpbGQoMCk7XG4gICAgICAgIGNvbnN0IHByb3BlcnRpZXM6IE9iamVjdEV4cHJlc3Npb25Qcm9wZXJ0eVtdID0gdGhpcy52aXNpdE9iamVjdExpdGVyYWwobm9kZSk7XG4gICAgICAgIHJldHVybiBuZXcgT2JqZWN0RXhwcmVzc2lvbihwcm9wZXJ0aWVzKTtcbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI0luRXhwcmVzc2lvbi5cbiAgICB2aXNpdEluRXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG5cbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI0xvZ2ljYWxPckV4cHJlc3Npb24uXG4gICAgdmlzaXRMb2dpY2FsT3JFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcblxuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjTm90RXhwcmVzc2lvbi5cbiAgICB2aXNpdE5vdEV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuXG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNQcmVEZWNyZWFzZUV4cHJlc3Npb24uXG4gICAgdmlzaXRQcmVEZWNyZWFzZUV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuXG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNBcmd1bWVudHNFeHByZXNzaW9uLlxuICAgIHZpc2l0QXJndW1lbnRzRXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0QXJndW1lbnRzRXhwcmVzc2lvbjogXCIgKyBjdHguZ2V0VGV4dCgpKTtcblxuXG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNUaGlzRXhwcmVzc2lvbi5cbiAgICB2aXNpdFRoaXNFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcblxuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjRnVuY3Rpb25FeHByZXNzaW9uLlxuICAgIHZpc2l0RnVuY3Rpb25FeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcblxuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjVW5hcnlNaW51c0V4cHJlc3Npb24uXG4gICAgdmlzaXRVbmFyeU1pbnVzRXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG5cbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI1Bvc3REZWNyZWFzZUV4cHJlc3Npb24uXG4gICAgdmlzaXRQb3N0RGVjcmVhc2VFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcblxuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjQXNzaWdubWVudEV4cHJlc3Npb24uXG4gICAgdmlzaXRBc3NpZ25tZW50RXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0QXNzaWdubWVudEV4cHJlc3Npb24gWyVzXSA6IFslc11cIiwgY3R4LmdldENoaWxkQ291bnQoKSwgY3R4LmdldFRleHQoKSk7XG4gICAgICAgIHRoaXMuYXNzZXJ0VHlwZShjdHgsIEVDTUFTY3JpcHRQYXJzZXIuQXNzaWdubWVudEV4cHJlc3Npb25Db250ZXh0KTtcbiAgICAgICAgdGhpcy5hc3NlcnROb2RlQ291bnQoY3R4LCAzKVxuXG4gICAgICAgIGxldCBpbml0aWFsaXNlciA9IGN0eC5nZXRDaGlsZCgwKTsgLy8gSWRlbnRpZmllckV4cHJlc3Npb25Db250ZXh0XG4gICAgICAgIGxldCBvcGVyYXRvciA9IGN0eC5nZXRDaGlsZCgxKS5nZXRUZXh0KCk7IC8vIE5vIHR5cGUgKCA9IClcbiAgICAgICAgbGV0IGV4cHJlc3Npb24gPSBjdHguZ2V0Q2hpbGQoMik7ICAvL0V4cHJlc3Npb25TZXF1ZW5jZUNvbnRleHRcblxuICAgICAgICBsZXQgbGhzID0gdGhpcy52aXNpdElkZW50aWZpZXJFeHByZXNzaW9uKGluaXRpYWxpc2VyKTtcbiAgICAgICAgbGV0IHJocyA9IHRoaXMudmlzaXRFeHByZXNzaW9uU2VxdWVuY2UoZXhwcmVzc2lvbik7XG4gICAgICAgIC8vIENvbXBsaWFuY2UgOiBwdWxsaW5nIHVwIEV4cHJlc3Npb25TdGF0ZW1lbnQgaW50byBBc3NpZ2VtZW50RXhwcmVzc2lvblxuICAgICAgICBsZXQgbm9kZSA9IG5ldyBBc3NpZ25tZW50RXhwcmVzc2lvbihvcGVyYXRvciwgbGhzLCByaHMuZXhwcmVzc2lvbilcbiAgICAgICAgcmV0dXJuIG5vZGU7XG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNUeXBlb2ZFeHByZXNzaW9uLlxuICAgIHZpc2l0VHlwZW9mRXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG5cbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI0luc3RhbmNlb2ZFeHByZXNzaW9uLlxuICAgIHZpc2l0SW5zdGFuY2VvZkV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuXG4gICAgfVxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjVW5hcnlQbHVzRXhwcmVzc2lvbi5cbiAgICB2aXNpdFVuYXJ5UGx1c0V4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuXG4gICAgfVxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjRGVsZXRlRXhwcmVzc2lvbi5cbiAgICB2aXNpdERlbGV0ZUV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI0VxdWFsaXR5RXhwcmVzc2lvbi5cbiAgICB2aXNpdEVxdWFsaXR5RXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KTpCaW5hcnlFeHByZXNzaW9uICB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0RXF1YWxpdHlFeHByZXNzaW9uIFslc10gOiAlc1wiLCBjdHguZ2V0Q2hpbGRDb3VudCgpLCBjdHguZ2V0VGV4dCgpKTtcbiAgICAgICAgdGhpcy5hc3NlcnRUeXBlKGN0eCwgRUNNQVNjcmlwdFBhcnNlci5FcXVhbGl0eUV4cHJlc3Npb25Db250ZXh0KTtcbiAgICAgICAgdGhpcy5hc3NlcnROb2RlQ291bnQoY3R4LCAzKVxuXG4gICAgICAgIGxldCBsZWZ0ID0gY3R4LmdldENoaWxkKDApO1xuICAgICAgICBsZXQgb3BlcmF0b3IgPSBjdHguZ2V0Q2hpbGQoMSkuZ2V0VGV4dCgpOyAvLyBObyB0eXBlICggKywtIClcbiAgICAgICAgbGV0IHJpZ2h0ID0gY3R4LmdldENoaWxkKDIpO1xuICAgICAgICBsZXQgbGhzID0gdGhpcy5fdmlzaXRCaW5hcnlFeHByZXNzaW9uKGxlZnQpO1xuICAgICAgICBsZXQgcmhzID0gdGhpcy5fdmlzaXRCaW5hcnlFeHByZXNzaW9uKHJpZ2h0KTtcblxuICAgICAgICByZXR1cm4gdGhpcy5kZWNvcmF0ZShuZXcgQmluYXJ5RXhwcmVzc2lvbihvcGVyYXRvciwgbGhzLCByaHMpLCB7fSk7XG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNCaXRYT3JFeHByZXNzaW9uLlxuICAgIHZpc2l0Qml0WE9yRXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG5cbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI011bHRpcGxpY2F0aXZlRXhwcmVzc2lvbi5cbiAgICB2aXNpdE11bHRpcGxpY2F0aXZlRXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KTogQmluYXJ5RXhwcmVzc2lvbiB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0TXVsdGlwbGljYXRpdmVFeHByZXNzaW9uIFslc10gOiAlc1wiLCBjdHguZ2V0Q2hpbGRDb3VudCgpLCBjdHguZ2V0VGV4dCgpKTtcbiAgICAgICAgdGhpcy5hc3NlcnRUeXBlKGN0eCwgRUNNQVNjcmlwdFBhcnNlci5NdWx0aXBsaWNhdGl2ZUV4cHJlc3Npb25Db250ZXh0KTtcbiAgICAgICAgdGhpcy5hc3NlcnROb2RlQ291bnQoY3R4LCAzKVxuXG4gICAgICAgIGxldCBsZWZ0ID0gY3R4LmdldENoaWxkKDApO1xuICAgICAgICBsZXQgb3BlcmF0b3IgPSBjdHguZ2V0Q2hpbGQoMSkuZ2V0VGV4dCgpOyAvLyBObyB0eXBlICggKywtIClcbiAgICAgICAgbGV0IHJpZ2h0ID0gY3R4LmdldENoaWxkKDIpO1xuICAgICAgICBsZXQgbGhzID0gdGhpcy52aXNpdEJpbmFyeUV4cHJlc3Npb24obGVmdCk7XG4gICAgICAgIGxldCByaHMgPSB0aGlzLnZpc2l0QmluYXJ5RXhwcmVzc2lvbihyaWdodCk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuZGVjb3JhdGUobmV3IEJpbmFyeUV4cHJlc3Npb24ob3BlcmF0b3IsIGxocywgcmhzKSwge30pO1xuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI0JpdFNoaWZ0RXhwcmVzc2lvbi5cbiAgICB2aXNpdEJpdFNoaWZ0RXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG5cbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNQYXJlbnRoZXNpemVkRXhwcmVzc2lvbi5cbiAgICB2aXNpdFBhcmVudGhlc2l6ZWRFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS5pbmZvKFwidmlzaXRQYXJlbnRoZXNpemVkRXhwcmVzc2lvbiBbJXNdIDogJXNcIiwgY3R4LmdldENoaWxkQ291bnQoKSwgY3R4LmdldFRleHQoKSk7XG4gICAgICAgIHRoaXMuYXNzZXJ0VHlwZShjdHgsIEVDTUFTY3JpcHRQYXJzZXIuUGFyZW50aGVzaXplZEV4cHJlc3Npb25Db250ZXh0KTtcbiAgICAgICAgdGhpcy5hc3NlcnROb2RlQ291bnQoY3R4LCAzKVxuICAgICAgICBsZXQgbGVmdCA9IGN0eC5nZXRDaGlsZCgwKTtcbiAgICAgICAgbGV0IGV4cHJlc3Npb24gPSBjdHguZ2V0Q2hpbGQoMSk7XG4gICAgICAgIGxldCByaWdodCA9IGN0eC5nZXRDaGlsZCgyKTtcbiAgICAgICAgdGhpcy5kdW1wQ29udGV4dEFsbENoaWxkcmVuKGV4cHJlc3Npb24pXG4gICAgICAgIHJldHVybiB0aGlzLnZpc2l0RXhwcmVzc2lvblNlcXVlbmNlKGV4cHJlc3Npb24pO1xuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI0FkZGl0aXZlRXhwcmVzc2lvbi5cbiAgICB2aXNpdEFkZGl0aXZlRXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KTogQmluYXJ5RXhwcmVzc2lvbiB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0QWRkaXRpdmVFeHByZXNzaW9uIFslc10gOiAlc1wiLCBjdHguZ2V0Q2hpbGRDb3VudCgpLCBjdHguZ2V0VGV4dCgpKTtcbiAgICAgICAgdGhpcy5hc3NlcnRUeXBlKGN0eCwgRUNNQVNjcmlwdFBhcnNlci5BZGRpdGl2ZUV4cHJlc3Npb25Db250ZXh0KTtcbiAgICAgICAgdGhpcy5hc3NlcnROb2RlQ291bnQoY3R4LCAzKVxuXG4gICAgICAgIGNvbnN0IGxlZnQgPSBjdHguZ2V0Q2hpbGQoMCk7XG4gICAgICAgIGNvbnN0IG9wZXJhdG9yID0gY3R4LmdldENoaWxkKDEpLmdldFRleHQoKTsgLy8gTm8gdHlwZSAoICssLSApXG4gICAgICAgIGNvbnN0IHJpZ2h0ID0gY3R4LmdldENoaWxkKDIpO1xuICAgICAgICBjb25zdCBsaHMgPSB0aGlzLl92aXNpdEJpbmFyeUV4cHJlc3Npb24obGVmdCk7XG4gICAgICAgIGNvbnN0IHJocyA9IHRoaXMuX3Zpc2l0QmluYXJ5RXhwcmVzc2lvbihyaWdodCk7XG4gICAgICAgIC8vIHJldHVybiB0aGlzLmRlY29yYXRlKG5ldyBCaW5hcnlFeHByZXNzaW9uKG9wZXJhdG9yLCBsaHMgLHJocyksIHRoaXMuYXNNYXJrZXIodGhpcy5hc01ldGFkYXRhKGN0eC5zeW1ib2wpKSk7XG4gICAgICAgIHJldHVybiBuZXcgQmluYXJ5RXhwcmVzc2lvbihvcGVyYXRvciwgbGhzLCByaHMpO1xuICAgIH1cblxuICAgIF92aXNpdEJpbmFyeUV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkgIHtcblxuICAgICAgICBjb25zb2xlLmluZm8oXCJldmFsQmluYXJ5RXhwcmVzc2lvbiBbJXNdIDogJXNcIiwgY3R4LmdldENoaWxkQ291bnQoKSwgY3R4LmdldFRleHQoKSk7XG4gICAgICAgIGlmIChjdHggaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLklkZW50aWZpZXJFeHByZXNzaW9uQ29udGV4dCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmlzaXRJZGVudGlmaWVyRXhwcmVzc2lvbihjdHgpO1xuICAgICAgICB9IGVsc2UgaWYgKGN0eCBpbnN0YW5jZW9mIEVDTUFTY3JpcHRQYXJzZXIuTGl0ZXJhbEV4cHJlc3Npb25Db250ZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy52aXNpdExpdGVyYWxFeHByZXNzaW9uKGN0eCk7XG4gICAgICAgIH0gZWxzZSBpZiAoY3R4IGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5BZGRpdGl2ZUV4cHJlc3Npb25Db250ZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy52aXNpdEFkZGl0aXZlRXhwcmVzc2lvbihjdHgpO1xuICAgICAgICB9IGVsc2UgaWYgKGN0eCBpbnN0YW5jZW9mIEVDTUFTY3JpcHRQYXJzZXIuTXVsdGlwbGljYXRpdmVFeHByZXNzaW9uQ29udGV4dCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmlzaXRNdWx0aXBsaWNhdGl2ZUV4cHJlc3Npb24oY3R4KTtcbiAgICAgICAgfWVsc2UgaWYgKGN0eCBpbnN0YW5jZW9mIEVDTUFTY3JpcHRQYXJzZXIuUmVsYXRpb25hbEV4cHJlc3Npb25Db250ZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy52aXNpdFJlbGF0aW9uYWxFeHByZXNzaW9uKGN0eCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy50aHJvd0luc2FuY2VFcnJvcih0aGlzLmR1bXBDb250ZXh0KGN0eCkpO1xuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI1JlbGF0aW9uYWxFeHByZXNzaW9uLlxuICAgIHZpc2l0UmVsYXRpb25hbEV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCk6IEJpbmFyeUV4cHJlc3Npb24ge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJ2aXNpdFJlbGF0aW9uYWxFeHByZXNzaW9uIFslc10gOiAlc1wiLCBjdHguZ2V0Q2hpbGRDb3VudCgpLCBjdHguZ2V0VGV4dCgpKTtcbiAgICAgICAgdGhpcy5hc3NlcnRUeXBlKGN0eCwgRUNNQVNjcmlwdFBhcnNlci5SZWxhdGlvbmFsRXhwcmVzc2lvbkNvbnRleHQpO1xuICAgICAgICB0aGlzLmFzc2VydE5vZGVDb3VudChjdHgsIDMpXG4gICAgICAgIGNvbnN0IGxlZnQgPSBjdHguZ2V0Q2hpbGQoMCk7XG4gICAgICAgIGNvbnN0IG9wZXJhdG9yID0gY3R4LmdldENoaWxkKDEpLmdldFRleHQoKTsgLy8gTm8gdHlwZSAoICssLSApXG4gICAgICAgIGNvbnN0IHJpZ2h0ID0gY3R4LmdldENoaWxkKDIpO1xuICAgICAgICBjb25zdCBsaHMgPSB0aGlzLl92aXNpdEJpbmFyeUV4cHJlc3Npb24obGVmdCk7XG4gICAgICAgIGNvbnN0IHJocyA9IHRoaXMuX3Zpc2l0QmluYXJ5RXhwcmVzc2lvbihyaWdodCk7XG4gICAgICAgIC8vIHJldHVybiB0aGlzLmRlY29yYXRlKG5ldyBCaW5hcnlFeHByZXNzaW9uKG9wZXJhdG9yLCBsaHMgLHJocyksIHRoaXMuYXNNYXJrZXIodGhpcy5hc01ldGFkYXRhKGN0eC5zeW1ib2wpKSk7XG4gICAgICAgIHJldHVybiBuZXcgQmluYXJ5RXhwcmVzc2lvbihvcGVyYXRvciwgbGhzLCByaHMpO1xuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI1Bvc3RJbmNyZW1lbnRFeHByZXNzaW9uLlxuICAgIHZpc2l0UG9zdEluY3JlbWVudEV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI0JpdE5vdEV4cHJlc3Npb24uXG4gICAgdmlzaXRCaXROb3RFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcblxuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjTmV3RXhwcmVzc2lvbi5cbiAgICB2aXNpdE5ld0V4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuXG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNMaXRlcmFsRXhwcmVzc2lvbi5cbiAgICB2aXNpdExpdGVyYWxFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS5pbmZvKFwidmlzaXRMaXRlcmFsRXhwcmVzc2lvbiBbJXNdIDogWyVzXVwiLCBjdHguZ2V0Q2hpbGRDb3VudCgpLCBjdHguZ2V0VGV4dCgpKTtcbiAgICAgICAgdGhpcy5hc3NlcnRUeXBlKGN0eCwgRUNNQVNjcmlwdFBhcnNlci5MaXRlcmFsRXhwcmVzc2lvbkNvbnRleHQpO1xuICAgICAgICB0aGlzLmFzc2VydE5vZGVDb3VudChjdHgsIDEpO1xuICAgICAgICAvLyB2aXNpdExpdGVyYWxFeHByZXNzaW9uOiA+IHZpc2l0TGl0ZXJhbFxuICAgICAgICBsZXQgbm9kZSA9IGN0eC5nZXRDaGlsZCgwKVxuICAgICAgICBpZiAobm9kZSBpbnN0YW5jZW9mIEVDTUFTY3JpcHRQYXJzZXIuTGl0ZXJhbENvbnRleHQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnZpc2l0TGl0ZXJhbChub2RlKTtcbiAgICAgICAgfSBlbHNlIGlmIChub2RlIGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5OdW1lcmljTGl0ZXJhbENvbnRleHQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnZpc2l0TnVtZXJpY0xpdGVyYWwobm9kZSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy50aHJvd0luc2FuY2VFcnJvcih0aGlzLmR1bXBDb250ZXh0KG5vZGUpKTtcbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNBcnJheUxpdGVyYWxFeHByZXNzaW9uLlxuICAgIHZpc2l0QXJyYXlMaXRlcmFsRXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KTogQXJyYXlFeHByZXNzaW9uIHtcbiAgICAgICAgY29uc29sZS5pbmZvKFwidmlzaXRBcnJheUxpdGVyYWxFeHByZXNzaW9uIFslc10gOiAlc1wiLCBjdHguZ2V0Q2hpbGRDb3VudCgpLCBjdHguZ2V0VGV4dCgpKTtcbiAgICAgICAgdGhpcy5hc3NlcnRUeXBlKGN0eCwgRUNNQVNjcmlwdFBhcnNlci5BcnJheUxpdGVyYWxFeHByZXNzaW9uQ29udGV4dCk7XG4gICAgICAgIHRoaXMuYXNzZXJ0Tm9kZUNvdW50KGN0eCwgMSk7XG4gICAgICAgIGNvbnN0IG5vZGUgPSBjdHguZ2V0Q2hpbGQoMCk7XG4gICAgICAgIGNvbnN0IGVsZW1lbnRzID0gdGhpcy52aXNpdEFycmF5TGl0ZXJhbChub2RlKTtcbiAgICAgICAgcmV0dXJuIG5ldyBBcnJheUV4cHJlc3Npb24oZWxlbWVudHMpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIC8vIGNvbXB1dGVkID0gZmFsc2UgYHguemBcbiAgICAgKiAvLyBjb21wdXRlZCA9IHRydWUgYHlbMV1gXG4gICAgICogLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjTWVtYmVyRG90RXhwcmVzc2lvbi5cbiAgICAgKi9cbiAgICB2aXNpdE1lbWJlckRvdEV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCk6IFN0YXRpY01lbWJlckV4cHJlc3Npb257XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0QXJyYXlMaXRlcmFsRXhwcmVzc2lvbiBbJXNdIDogJXNcIiwgY3R4LmdldENoaWxkQ291bnQoKSwgY3R4LmdldFRleHQoKSk7XG4gICAgICAgIHRoaXMuYXNzZXJ0VHlwZShjdHgsIEVDTUFTY3JpcHRQYXJzZXIuTWVtYmVyRG90RXhwcmVzc2lvbkNvbnRleHQpO1xuICAgICAgICB0aGlzLmFzc2VydE5vZGVDb3VudChjdHgsIDMpO1xuICAgICAgICBjb25zdCBleHByID0gdGhpcy5zaW5nbGVFeHByZXNzaW9uKGN0eC5nZXRDaGlsZCgwKSk7XG4gICAgICAgIGNvbnN0IHByb3BlcnR5ID0gdGhpcy52aXNpdElkZW50aWZpZXJOYW1lKGN0eC5nZXRDaGlsZCgyKSk7ICAgICAgICBcbiAgICAgICAgcmV0dXJuIG5ldyBTdGF0aWNNZW1iZXJFeHByZXNzaW9uKGV4cHIsIHByb3BlcnR5KTtcbiAgICB9XG5cbiAgICBwcmludChjdHg6IFJ1bGVDb250ZXh0KTogdm9pZHtcbiAgICAgICAgY29uc29sZS5pbmZvKFwiICoqKioqICBcIilcbiAgICAgICAgY29uc3QgdmlzaXRvciA9IG5ldyBQcmludFZpc2l0b3IoKTtcbiAgICAgICAgY3R4LmFjY2VwdCh2aXNpdG9yKTtcbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNNZW1iZXJJbmRleEV4cHJlc3Npb24uXG4gICAgdmlzaXRNZW1iZXJJbmRleEV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCk6IENvbXB1dGVkTWVtYmVyRXhwcmVzc2lvbntcbiAgICAgICAgY29uc29sZS5pbmZvKFwidmlzaXRNZW1iZXJJbmRleEV4cHJlc3Npb24gWyVzXSA6ICVzXCIsIGN0eC5nZXRDaGlsZENvdW50KCksIGN0eC5nZXRUZXh0KCkpO1xuICAgICAgICB0aGlzLmFzc2VydFR5cGUoY3R4LCBFQ01BU2NyaXB0UGFyc2VyLk1lbWJlckluZGV4RXhwcmVzc2lvbkNvbnRleHQpO1xuICAgICAgICB0aGlzLmFzc2VydE5vZGVDb3VudChjdHgsIDQpO1xuICAgICAgICBjb25zdCBleHByID0gdGhpcy5zaW5nbGVFeHByZXNzaW9uKGN0eC5nZXRDaGlsZCgwKSk7XG4gICAgICAgIGNvbnN0IHByb3BlcnR5ID0gdGhpcy52aXNpdEV4cHJlc3Npb25TZXF1ZW5jZShjdHguZ2V0Q2hpbGQoMikpOyAgICAgICAgXG4gICAgICAgIHJldHVybiBuZXcgQ29tcHV0ZWRNZW1iZXJFeHByZXNzaW9uKGV4cHIsIHByb3BlcnR5KTtcbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNJZGVudGlmaWVyRXhwcmVzc2lvbi5cbiAgICB2aXNpdElkZW50aWZpZXJFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpOiBJZGVudGlmaWVyIHtcbiAgICAgICAgY29uc29sZS5pbmZvKFwidmlzaXRJZGVudGlmaWVyRXhwcmVzc2lvbiBbJXNdIDogJXNcIiwgY3R4LmdldENoaWxkQ291bnQoKSwgY3R4LmdldFRleHQoKSk7XG4gICAgICAgIHRoaXMuYXNzZXJ0VHlwZShjdHgsIEVDTUFTY3JpcHRQYXJzZXIuSWRlbnRpZmllckV4cHJlc3Npb25Db250ZXh0KTtcbiAgICAgICAgdGhpcy5hc3NlcnROb2RlQ291bnQoY3R4LCAxKVxuICAgICAgICBjb25zdCBpbml0aWFsaXNlciA9IGN0eC5nZXRDaGlsZCgwKTtcbiAgICAgICAgY29uc3QgbmFtZSA9IGluaXRpYWxpc2VyLmdldFRleHQoKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGVjb3JhdGUobmV3IElkZW50aWZpZXIobmFtZSksIHRoaXMuYXNNYXJrZXIodGhpcy5hc01ldGFkYXRhKGluaXRpYWxpc2VyLnN5bWJvbCkpKVxuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI0JpdEFuZEV4cHJlc3Npb24uXG4gICAgdmlzaXRCaXRBbmRFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNCaXRPckV4cHJlc3Npb24uXG4gICAgdmlzaXRCaXRPckV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjQXNzaWdubWVudE9wZXJhdG9yRXhwcmVzc2lvbi5cbiAgICB2aXNpdEFzc2lnbm1lbnRPcGVyYXRvckV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCk6IEFzc2lnbm1lbnRFeHByZXNzaW9ue1xuICAgICAgICBjb25zb2xlLmluZm8oXCJ2aXNpdEFzc2lnbm1lbnRPcGVyYXRvckV4cHJlc3Npb24gWyVzXSA6ICVzXCIsIGN0eC5nZXRDaGlsZENvdW50KCksIGN0eC5nZXRUZXh0KCkpO1xuICAgICAgICB0aGlzLmFzc2VydFR5cGUoY3R4LCBFQ01BU2NyaXB0UGFyc2VyLkFzc2lnbm1lbnRPcGVyYXRvckV4cHJlc3Npb25Db250ZXh0KTtcbiAgICAgICAgdGhpcy5hc3NlcnROb2RlQ291bnQoY3R4LCAzKVxuICAgICAgICBjb25zdCBsaHMgPSB0aGlzLnNpbmdsZUV4cHJlc3Npb24oY3R4LmdldENoaWxkKDApKTtcbiAgICAgICAgY29uc3Qgb3BlcmF0b3IgPSBjdHguZ2V0Q2hpbGQoMSkuZ2V0VGV4dCgpO1xuICAgICAgICBjb25zdCByaHMgPSB0aGlzLnZpc2l0RXhwcmVzc2lvblNlcXVlbmNlKGN0eC5nZXRDaGlsZCgyKSk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuZGVjb3JhdGUobmV3IEFzc2lnbm1lbnRFeHByZXNzaW9uKG9wZXJhdG9yLCBsaHMsIHJocykpXG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNWb2lkRXhwcmVzc2lvbi5cbiAgICB2aXNpdFZvaWRFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcblxuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2Fzc2lnbm1lbnRPcGVyYXRvci5cbiAgICB2aXNpdEFzc2lnbm1lbnRPcGVyYXRvcihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0QXNzaWdubWVudE9wZXJhdG9yIFslc10gOiBbJXNdXCIsIGN0eC5nZXRDaGlsZENvdW50KCksIGN0eC5nZXRUZXh0KCkpO1xuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2xpdGVyYWwuXG4gICAgdmlzaXRMaXRlcmFsKGN0eDogUnVsZUNvbnRleHQpOiBMaXRlcmFsIHtcbiAgICAgICAgY29uc29sZS5pbmZvKFwidmlzaXRMaXRlcmFsIFslc10gOiBbJXNdXCIsIGN0eC5nZXRDaGlsZENvdW50KCksIGN0eC5nZXRUZXh0KCkpO1xuICAgICAgICB0aGlzLmFzc2VydFR5cGUoY3R4LCBFQ01BU2NyaXB0UGFyc2VyLkxpdGVyYWxDb250ZXh0KVxuICAgICAgICB0aGlzLmFzc2VydE5vZGVDb3VudChjdHgsIDEpO1xuICAgICAgICBjb25zdCBub2RlOiBSdWxlQ29udGV4dCA9IGN0eC5nZXRDaGlsZCgwKTtcblxuICAgICAgICBpZiAobm9kZS5nZXRDaGlsZENvdW50KCkgPT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY3JlYXRlTGl0ZXJhbFZhbHVlKG5vZGUpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKG5vZGUuZ2V0Q2hpbGRDb3VudCgpID09IDEpIHtcbiAgICAgICAgICAgIGlmIChub2RlIGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5OdW1lcmljTGl0ZXJhbENvbnRleHQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy52aXNpdE51bWVyaWNMaXRlcmFsKG5vZGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy50aHJvd0luc2FuY2VFcnJvcih0aGlzLmR1bXBDb250ZXh0KG5vZGUpKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnRocm93SW5zYW5jZUVycm9yKHRoaXMuZHVtcENvbnRleHQobm9kZSkpO1xuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI251bWVyaWNMaXRlcmFsLlxuICAgIHZpc2l0TnVtZXJpY0xpdGVyYWwoY3R4OiBSdWxlQ29udGV4dCk6IExpdGVyYWwge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJ2aXNpdE51bWVyaWNMaXRlcmFsIFslc10gOiBbJXNdXCIsIGN0eC5nZXRDaGlsZENvdW50KCksIGN0eC5nZXRUZXh0KCkpO1xuICAgICAgICB0aGlzLmFzc2VydFR5cGUoY3R4LCBFQ01BU2NyaXB0UGFyc2VyLk51bWVyaWNMaXRlcmFsQ29udGV4dClcbiAgICAgICAgdGhpcy5hc3NlcnROb2RlQ291bnQoY3R4LCAxKTtcbiAgICAgICAgY29uc3QgdmFsdWUgPSBjdHguZ2V0VGV4dCgpO1xuICAgICAgICAvLyBUT0RPIDogRmlndXJlIG91dCBiZXR0ZXIgd2F5XG4gICAgICAgIGNvbnN0IGxpdGVyYWwgPSBuZXcgTGl0ZXJhbChOdW1iZXIodmFsdWUpLCB2YWx1ZSk7XG4gICAgICAgIHJldHVybiB0aGlzLmRlY29yYXRlKGxpdGVyYWwsIHRoaXMuYXNNYXJrZXIodGhpcy5hc01ldGFkYXRhKGN0eC5nZXRTb3VyY2VJbnRlcnZhbCgpKSkpXG4gICAgfVxuXG4gICAgY3JlYXRlTGl0ZXJhbFZhbHVlKGN0eDogUnVsZUNvbnRleHQpOiBMaXRlcmFsIHtcbiAgICAgICAgY29uc29sZS5pbmZvKFwiY3JlYXRlTGl0ZXJhbFZhbHVlIFslc106IFslc11cIiwgY3R4LmdldENoaWxkQ291bnQoKSwgY3R4LmdldFRleHQoKSk7XG4gICAgICAgIGNvbnN0IHZhbHVlID0gY3R4LmdldFRleHQoKTtcbiAgICAgICAgY29uc3QgbGl0ZXJhbCA9IG5ldyBMaXRlcmFsKHZhbHVlLCB2YWx1ZSk7XG4gICAgICAgIHJldHVybiB0aGlzLmRlY29yYXRlKGxpdGVyYWwsIHRoaXMuYXNNYXJrZXIodGhpcy5hc01ldGFkYXRhKGN0eC5nZXRTb3VyY2VJbnRlcnZhbCgpKSkpXG4gICAgfVxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjaWRlbnRpZmllck5hbWUuXG4gICAgdmlzaXRJZGVudGlmaWVyTmFtZShjdHg6IFJ1bGVDb250ZXh0KTogSWRlbnRpZmllciB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0SWRlbnRpZmllck5hbWUgWyVzXTogWyVzXVwiLCBjdHguZ2V0Q2hpbGRDb3VudCgpLCBjdHguZ2V0VGV4dCgpKTtcbiAgICAgICAgdGhpcy5hc3NlcnRUeXBlKGN0eCwgRUNNQVNjcmlwdFBhcnNlci5JZGVudGlmaWVyTmFtZUNvbnRleHQpXG4gICAgICAgIHRoaXMuYXNzZXJ0Tm9kZUNvdW50KGN0eCwgMSk7XG4gICAgICAgIGNvbnN0IHZhbHVlID0gY3R4LmdldFRleHQoKTtcbiAgICAgICAgY29uc3QgaWRlbnRpZmllciA9IG5ldyBJZGVudGlmaWVyKHZhbHVlKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGVjb3JhdGUoaWRlbnRpZmllciwgdGhpcy5hc01hcmtlcih0aGlzLmFzTWV0YWRhdGEoY3R4LmdldFNvdXJjZUludGVydmFsKCkpKSlcbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNyZXNlcnZlZFdvcmQuXG4gICAgdmlzaXRSZXNlcnZlZFdvcmQoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJ2aXNpdFJlc2VydmVkV29yZDogXCIgKyBjdHguZ2V0VGV4dCgpKTtcbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNrZXl3b3JkLlxuICAgIHZpc2l0S2V5d29yZChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0S2V5d29yZDogXCIgKyBjdHguZ2V0VGV4dCgpKTtcblxuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjZnV0dXJlUmVzZXJ2ZWRXb3JkLlxuICAgIHZpc2l0RnV0dXJlUmVzZXJ2ZWRXb3JkKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNnZXR0ZXIuXG4gICAgdmlzaXRHZXR0ZXIoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgIH1cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNzZXR0ZXIuXG4gICAgdmlzaXRTZXR0ZXIoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2Vvcy5cbiAgICB2aXNpdEVvcyhjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIC8vY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNlb2YuXG4gICAgdmlzaXRFb2YoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgIH1cblxufSJdfQ==