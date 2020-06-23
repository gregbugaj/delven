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

var _os = require("os");

var fs = _interopRequireWildcard(require("fs"));

var _trace = _interopRequireDefault(require("./trace"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

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

  log(ctx, frame) {
    console.info("%s [%s] : %s", frame.function, ctx.getChildCount(), ctx.getText());
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
    this.log(ctx, _trace.default.frame());
    this.assertType(ctx, _ECMAScriptParser.ECMAScriptParser.ProgramContext); // visitProgram ->visitSourceElements -> visitSourceElement -> visitStatement

    const statements = [];
    const node = ctx.getChild(0); // visitProgram ->visitSourceElements 

    for (let i = 0; i < node.getChildCount(); ++i) {
      const stm = node.getChild(i).getChild(0); // SourceElementsContext > StatementContext

      if (stm instanceof _ECMAScriptParser.ECMAScriptParser.StatementContext) {
        const statement = this.visitStatement(stm);
        statements.push(statement);
      } else {
        this.throwInsanceError(this.dumpContext(stm));
      }
    }

    const interval = ctx.getSourceInterval();
    const script = new _nodes.Script(statements);
    return this.decorate(script, this.asMarker(this.asMetadata(interval)));
  } // Visit a parse tree produced by ECMAScriptParser#statement.

  /**
   * statement
   *   : block
   *   | variableStatement
   *   | importStatement
   *   | exportStatement
   *   | emptyStatement
   *   | classDeclaration
   *   | expressionStatement
   *   | ifStatement
   *   | iterationStatement
   *   | continueStatement
   *   | breakStatement
   *   | returnStatement
   *   | yieldStatement
   *   | withStatement
   *   | labelledStatement
   *   | switchStatement
   *   | throwStatement
   *   | tryStatement
   *   | debuggerStatement
   *   | functionDeclaration
   *   ;
   * @param ctx 
   */


  visitStatement(ctx) {
    this.log(ctx, _trace.default.frame());
    this.assertType(ctx, _ECMAScriptParser.ECMAScriptParser.StatementContext);
    const node = ctx.getChild(0);

    if (node instanceof _ECMAScriptParser.ECMAScriptParser.BlockContext) {
      return this.visitBlock(node);
    } else if (node instanceof _ECMAScriptParser.ECMAScriptParser.VariableStatementContext) {
      return this.visitVariableStatement(node);
    } else if (node instanceof _ECMAScriptParser.ECMAScriptParser.ImportStatementContext) {
      return this.visitImportStatement(node);
    } else if (node instanceof _ECMAScriptParser.ECMAScriptParser.ExportStatementContext) {
      return this.visitExportStatement(node);
    } else if (node instanceof _ECMAScriptParser.ECMAScriptParser.EmptyStatementContext) {// NOOP,
    } else if (node instanceof _ECMAScriptParser.ECMAScriptParser.ClassDeclarationContext) {
      return this.visitClassDeclaration(node);
    } else if (node instanceof _ECMAScriptParser.ECMAScriptParser.ExpressionStatementContext) {
      return this.visitExpressionStatement(node);
    } else if (node instanceof _ECMAScriptParser.ECMAScriptParser.IfStatementContext) {
      return this.visitIfStatement(node);
    } else if (node instanceof _ECMAScriptParser.ECMAScriptParser.IterationStatementContext) {
      return this.visitIterationStatement(node);
    } else if (node instanceof _ECMAScriptParser.ECMAScriptParser.ContinueStatementContext) {
      return this.visitContinueStatement(node);
    } else if (node instanceof _ECMAScriptParser.ECMAScriptParser.BreakStatementContext) {
      return this.visitBreakStatement(node);
    } else if (node instanceof _ECMAScriptParser.ECMAScriptParser.ReturnStatementContext) {
      return this.visitReturnStatement(node);
    } else if (node instanceof _ECMAScriptParser.ECMAScriptParser.YieldStatementContext) {
      return this.visitYieldStatement(node);
    } else if (node instanceof _ECMAScriptParser.ECMAScriptParser.WithStatementContext) {
      return this.visitWithStatement(node);
    } else if (node instanceof _ECMAScriptParser.ECMAScriptParser.LabelledStatementContext) {
      return this.visitLabelledStatement(node);
    } else if (node instanceof _ECMAScriptParser.ECMAScriptParser.SwitchStatementContext) {
      return this.visitSwitchStatement(node);
    } else if (node instanceof _ECMAScriptParser.ECMAScriptParser.FunctionExpressionContext) {
      return this.visitFunctionExpression(node);
    } else if (node instanceof _ECMAScriptParser.ECMAScriptParser.ThrowStatementContext) {
      return this.visitThrowStatement(node);
    } else if (node instanceof _ECMAScriptParser.ECMAScriptParser.TryStatementContext) {
      return this.visitTryStatement(node);
    } else if (node instanceof _ECMAScriptParser.ECMAScriptParser.DebuggerStatementContext) {
      return this.visitDebuggerStatement(node);
    } else if (node instanceof _ECMAScriptParser.ECMAScriptParser.FunctionDeclarationContext) {
      return this.visitFunctionDeclaration(node);
    } else {
      this.throwInsanceError(this.dumpContext(node));
    }
  }

  visitImportStatement(ctx) {
    this.log(ctx, _trace.default.frame());
    this.assertType(ctx, _ECMAScriptParser.ECMAScriptParser.ImportStatementContext);
    throw new TypeError("not implemented");
  }

  visitExportStatement(ctx) {
    this.log(ctx, _trace.default.frame());
    this.assertType(ctx, _ECMAScriptParser.ECMAScriptParser.ExportStatementContext);
    throw new TypeError("not implemented");
  }

  visitIterationStatement(ctx) {
    this.log(ctx, _trace.default.frame());
    this.assertType(ctx, _ECMAScriptParser.ECMAScriptParser.IterationStatementContext);
    throw new TypeError("not implemented");
  }
  /**
   * Visit a parse tree produced by ECMAScriptParser#block.
   * /// Block :
   * ///     { StatementList? }
   */


  visitBlock(ctx) {
    this.log(ctx, _trace.default.frame());
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
  }
  /**
   * Visit a parse tree produced by ECMAScriptParser#statementList.
   *  statementList
   *    : statement+
   *    ;
   * @param ctx 
   */


  visitStatementList(ctx) {
    this.log(ctx, _trace.default.frame());
    this.assertType(ctx, _ECMAScriptParser.ECMAScriptParser.StatementListContext);
    const nodes = this.filterSymbols(ctx);
    const body = [];

    for (const node of nodes) {
      if (node instanceof _ECMAScriptParser.ECMAScriptParser.StatementContext) {
        body.push(this.visitStatement(node));
      } else {
        this.throwTypeError(_os.type);
      }
    }

    return body;
  }

  visitVariableStatement(ctx) {
    this.log(ctx, _trace.default.frame());
    this.assertType(ctx, _ECMAScriptParser.ECMAScriptParser.VariableStatementContext);
    const node = this.getTypedRuleContext(ctx, _ECMAScriptParser.ECMAScriptParser.VariableDeclarationListContext);
    return this.visitVariableDeclarationList(node);
  }
  /**
   * Get the type rule context
   * Example
   * <code>
   *   const node = this.getTypedRuleContext(ctx, ECMAScriptParser.VariableDeclarationListContext);
   * </code>
   * @param ctx 
   * @param type 
   * @param index 
   */


  getTypedRuleContext(ctx, type, index = 0) {
    return ctx.getTypedRuleContext(type, index);
  }
  /**
   * <pre>
   * variableDeclarationList
   *   : varModifier variableDeclaration (',' variableDeclaration)*
   *   ;
   * </pre>
   * @param ctx 
   */


  visitVariableDeclarationList(ctx) {
    this.log(ctx, _trace.default.frame());
    this.assertType(ctx, _ECMAScriptParser.ECMAScriptParser.VariableDeclarationListContext);
    const varModifierContext = this.getTypedRuleContext(ctx, _ECMAScriptParser.ECMAScriptParser.VarModifierContext, 0);
    const varModifier = varModifierContext.getText();
    const declarations = [];

    for (const node of this.filterSymbols(ctx)) {
      if (node instanceof _ECMAScriptParser.ECMAScriptParser.VariableDeclarationContext) {
        declarations.push(this.visitVariableDeclaration(node));
      }
    }

    return new _nodes.VariableDeclaration(declarations, varModifier);
  }
  /**
   *  Visit a parse tree produced by ECMAScriptParser#variableDeclaration.
   *  variableDeclaration
   *    : assignable ('=' singleExpression)? // ECMAScript 6: Array & Object Matching
   *    ;
   * @param ctx VariableDeclarationContext
   */
  // 


  visitVariableDeclaration(ctx) {
    this.log(ctx, _trace.default.frame());
    this.assertType(ctx, _ECMAScriptParser.ECMAScriptParser.VariableDeclarationContext);
    const assignableContext = this.getTypedRuleContext(ctx, _ECMAScriptParser.ECMAScriptParser.AssignableContext, 0);
    const assignable = this.visitAssignable(assignableContext); // console.info(assignable)

    let init = null;

    if (ctx.getChildCount() == 3) {
      init = this.singleExpression(ctx.getChild(2));
    }

    return new _nodes.VariableDeclarator(assignable, init);
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
    this.log(ctx, _trace.default.frame());
  }

  assertNodeCount(ctx, count) {
    if (ctx.getChildCount() != count) {
      throw new Error("Wrong child count, expected '" + count + "' got : " + ctx.getChildCount());
    }
  }
  /**
   * Visit a parse tree produced by ECMAScriptParser#expressionStatement.
   * 
   * expressionStatement
   *  : {this.notOpenBraceAndNotFunction()}? expressionSequence eos
   *  ;
   * @param ctx 
   */


  visitExpressionStatement(ctx) {
    console.info("visitExpressionStatement [%s] : %s", ctx.getChildCount(), ctx.getText());
    this.assertType(ctx, _ECMAScriptParser.ECMAScriptParser.ExpressionStatementContext); // visitExpressionStatement:>visitExpressionSequence

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
   * ifStatement
   *   : If '(' expressionSequence ')' statement ( Else statement )?
   *   ;
   */


  visitIfStatement(ctx) {
    this.log(ctx, _trace.default.frame());
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
  }
  /**
   * 
   * labelledStatement
   *   : identifier ':' statement
   *   ; 
   */


  visitLabelledStatement(ctx) {
    this.log(ctx, _trace.default.frame());
    this.assertType(ctx, _ECMAScriptParser.ECMAScriptParser.LabelledStatementContext);
    const identifier = this.visitIdentifier(ctx.getChild(0));
    const statement = this.visitStatement(ctx.getChild(2));
    return new _nodes.LabeledStatement(identifier, statement);
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
    this.log(ctx, _trace.default.frame());
    this.assertType(ctx, _ECMAScriptParser.ECMAScriptParser.FunctionDeclarationContext);
    let async = false;
    let generator = false;
    let identifier;
    let params;
    let body;

    for (let i = 0; i < ctx.getChildCount(); ++i) {
      const node = ctx.getChild(i);

      if (node.symbol) {
        const txt = node.getText();

        if (txt == 'async') {
          async = true;
        } else if (txt == '*') {
          generator = true;
        }
      }

      if (node instanceof _ECMAScriptParser.ECMAScriptParser.IdentifierContext) {
        console.info("ECMAScriptParser ;; IdentifierContext");
        identifier = this.visitIdentifier(node);
      } else if (node instanceof _ECMAScriptParser.ECMAScriptParser.FormalParameterListContext) {
        console.info("ECMAScriptParser ;; FormalParameterListContext");
        params = this.visitFormalParameterList(node);
      } else if (node instanceof _ECMAScriptParser.ECMAScriptParser.FunctionBodyContext) {
        // body = this.visitFunctionBody(node);
        console.info("ECMAScriptParser ;; FormalParameterListContext");
      }

      this.dumpContextAllChildren(node);
    }

    console.info('async  = ' + async);
    console.info('generator  = ' + generator);

    if (async) {
      return new _nodes.AsyncFunctionDeclaration(identifier, params, body, generator);
    } else {
      //  constructor(id: Identifier | null, params: FunctionParameter[], body: BlockStatement, generator: boolean) {
      return new _nodes.FunctionDeclaration(identifier, parmas, body, generator);
    }
  } // Visit a parse tree produced by ECMAScriptParser#functionDecl


  visitFunctionDecl(ctx) {
    this.log(ctx, _trace.default.frame());
    this.assertType(ctx, _ECMAScriptParser.ECMAScriptParser.FunctionDeclContext);
    return this.visitFunctionDeclaration(ctx.getChild(0));
  }
  /**
   * Visit a parse tree produced by ECMAScriptParser#functionBody.
   * 
   * functionBody
   *  : sourceElements?
   *  ;
   * @param ctx 
   */


  visitFunctionBody(ctx) {
    this.log(ctx, _trace.default.frame());
    this.assertType(ctx, _ECMAScriptParser.ECMAScriptParser.FunctionBodyContext);
    const sourceElementsContext = this.getTypedRuleContext(ctx, _ECMAScriptParser.ECMAScriptParser.SourceElementsContext);

    if (sourceElementsContext != null) {
      const statement = this.visitSourceElements(sourceElementsContext);
      return statement;
    }

    throw new Error("not implemented");
  }
  /**
   *  sourceElements
   *    : sourceElement+
   *    ;
   * @param ctx 
   */


  visitSourceElements(ctx) {
    this.log(ctx, _trace.default.frame());
    this.assertType(ctx, _ECMAScriptParser.ECMAScriptParser.SourceElementsContext);
    const statements = [];

    for (const node of ctx.sourceElement()) {
      const statement = this.visitStatement(node.statement());
      console.info(statement);
      statements.push(statement);
    }

    return statements;
  }
  /**
   * Visit a parse tree produced by ECMAScriptParser#arrayLiteral.
   * arrayLiteral
   *  : ('[' elementList ']')
   *  ;
   * @param ctx 
   */


  visitArrayLiteral(ctx) {
    this.log(ctx, _trace.default.frame());
    this.assertType(ctx, _ECMAScriptParser.ECMAScriptParser.ArrayLiteralContext);
    const elementListContext = this.getTypedRuleContext(ctx, _ECMAScriptParser.ECMAScriptParser.ElementListContext);
    const elements = this.visitElementList(elementListContext);
    return new _nodes.ArrayExpression(elements);
  }
  /**
   * Visit a parse tree produced by ECMAScriptParser#elementList.
   * 
   * elementList
   *  : ','* arrayElement? (','+ arrayElement)* ','* // Yes, everything is optional
   *  ;
   * @param ctx 
   */


  visitElementList(ctx) {
    this.log(ctx, _trace.default.frame());
    this.assertType(ctx, _ECMAScriptParser.ECMAScriptParser.ElementListContext);
    const elements = [];

    for (const node of this.iterable(ctx)) {
      //ellison check
      if (node.symbol != null) {
        // compliance: esprima compliane of returning `null` 
        elements.push(null);
      } else {
        elements.push(this.visitArrayElement(node));
      }
    }

    return elements;
  }

  iterable(ctx) {
    const nodes = [];

    for (let i = 0; i < ctx.getChildCount(); ++i) {
      nodes.push(ctx.getChild(i));
    }

    return nodes;
  }
  /**
   * Visit a parse tree produced by ECMAScriptParser#arrayElement.
   * 
   * arrayElement
   *  : Ellipsis? singleExpression
   *  ;
   * @param ctx 
   */


  visitArrayElement(ctx) {
    this.log(ctx, _trace.default.frame());
    this.assertType(ctx, _ECMAScriptParser.ECMAScriptParser.ArrayElementContext);

    if (ctx.getChildCount() == 1) {
      return this.singleExpression(ctx.getChild(0));
    } else {
      const expression = this.singleExpression(ctx.getChild(1));
      return new _nodes.SpreadElement(expression);
    }
  }
  /**
   * Visit a parse tree produced by ECMAScriptParser#objectLiteral.
   * objectLiteral
   *  : '{' (propertyAssignment (',' propertyAssignment)*)? ','? '}'
   *  ;
   * @param ctx 
   */


  visitObjectLiteral(ctx) {
    this.log(ctx, _trace.default.frame());
    this.assertType(ctx, _ECMAScriptParser.ECMAScriptParser.ObjectLiteralContext);

    if (ctx.getChildCount() == 2) {
      return new _nodes.ObjectExpression([]);
    }

    const nodes = this.filterSymbols(ctx);
    const properties = [];

    for (const node of nodes) {
      let property;

      if (node instanceof _ECMAScriptParser.ECMAScriptParser.PropertyExpressionAssignmentContext) {
        property = this.visitPropertyExpressionAssignment(node);
      } else if (node instanceof _ECMAScriptParser.ECMAScriptParser.PropertyShorthandContext) {
        property = this.visitPropertyShorthand(node);
      } else if (node instanceof _ECMAScriptParser.ECMAScriptParser.FunctionPropertyContext) {
        property = this.visitFunctionProperty(node);
      } else {
        this.throwInsanceError(this.dumpContext(node));
      }

      if (property != undefined) {
        properties.push(property);
      }
    }

    return new _nodes.ObjectExpression(properties);
  }
  /**
   * Visit a parse tree produced by ECMAScriptParser#propertyShorthand.
   *  | Ellipsis? singleExpression                                                    # PropertyShorthand
   * @param ctx 
   */


  visitPropertyShorthand(ctx) {
    this.log(ctx, _trace.default.frame());
    this.assertType(ctx, _ECMAScriptParser.ECMAScriptParser.PropertyShorthandContext);
    const computed = false;
    const method = false;
    const shorthand = true;
    const value = this.singleExpression(ctx.getChild(0));
    const key = new _nodes.Identifier(ctx.getText());
    return new _nodes.Property("init", key, computed, value, method, shorthand);
  } // Visit a parse tree produced by ECMAScriptParser#propertyShorthand.


  visitFunctionProperty(ctx) {
    this.log(ctx, _trace.default.frame());
    this.assertType(ctx, _ECMAScriptParser.ECMAScriptParser.FunctionPropertyContext);
    throw new TypeError("not implemented");
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
  }
  /**
   * Visit a parse tree produced by ECMAScriptParser#PropertyExpressionAssignment.
   * propertyAssignment
   *     : propertyName ':' singleExpression                                             # PropertyExpressionAssignment
   *     | '[' singleExpression ']' ':' singleExpression                                 # ComputedPropertyExpressionAssignment
   *     | Async? '*'? propertyName '(' formalParameterList?  ')'  '{' functionBody '}'  # FunctionProperty
   *     | getter '(' ')' '{' functionBody '}'                                           # PropertyGetter
   *     | setter '(' formalParameterArg ')' '{' functionBody '}'                        # PropertySetter
   *     | Ellipsis? singleExpression                                                    # PropertyShorthand
   *     ;
   */


  visitPropertyExpressionAssignment(ctx) {
    this.log(ctx, _trace.default.frame());
    this.assertType(ctx, _ECMAScriptParser.ECMAScriptParser.PropertyExpressionAssignmentContext);
    let node = ctx.getChild(0);
    this.dumpContextAllChildren(ctx);
    let n0 = ctx.getChild(0); // PropertyName

    let n1 = ctx.getChild(1); // symbol :

    let n2 = ctx.getChild(2); //  singleExpression 

    let key = this.visitPropertyName(n0);
    let value;
    const computed = false;
    const method = false;
    const shorthand = false;

    if (n2 instanceof _ECMAScriptParser.ECMAScriptParser.PropertyExpressionAssignmentContext) {
      console.info(' -- PropertyExpressionAssignmentContext');
      key = this.visitPropertyName(n0);
    } else if (n2 instanceof _ECMAScriptParser.ECMAScriptParser.ComputedPropertyExpressionAssignmentContext) {
      console.info(' -- ComputedPropertyExpressionAssignmentContext');
    } else if (n2 instanceof _ECMAScriptParser.ECMAScriptParser.FunctionPropertyContext) {
      console.info(' -- FunctionPropertyContext');
    } else if (n2 instanceof _ECMAScriptParser.ECMAScriptParser.PropertyGetterContext) {
      console.info(' -- PropertyGetterContext');
    } else if (n2 instanceof _ECMAScriptParser.ECMAScriptParser.PropertySetterContext) {
      console.info(' -- PropertySetterContext');
    } else if (n2 instanceof _ECMAScriptParser.ECMAScriptParser.PropertyShorthandContext) {
      console.info(' -- PropertyShorthandContext');
    } // this.singleExpression(n2);


    return new _nodes.Property("init", key, computed, value, method, shorthand);
  } // Visit a parse tree produced by ECMAScriptParser#PropertyGetter.


  visitPropertyGetter(ctx) {
    console.trace('not implemented');
  } // Visit a parse tree produced by ECMAScriptParser#PropertySetter.


  visitPropertySetter(ctx) {
    console.trace('not implemented');
  }
  /**
   * Visit a parse tree produced by ECMAScriptParser#propertyName.
   * 
   * propertyName
   *  : identifierName
   *  | StringLiteral
   *  | numericLiteral
   *  | '[' singleExpression ']'
   *  ;
   */


  visitPropertyName(ctx) {
    this.log(ctx, _trace.default.frame());
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
    this.log(ctx, _trace.default.frame());
    this.assertType(ctx, _ECMAScriptParser.ECMAScriptParser.ExpressionSequenceContext);
    const expressions = []; // each node is a singleExpression

    for (const node of this.filterSymbols(ctx)) {
      // const node: RuleContext = ctx.getChild(i);
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
    } else if (node instanceof _ECMAScriptParser.ECMAScriptParser.FunctionExpressionContext) {
      return this.visitFunctionExpression(node);
    }

    this.throwInsanceError(this.dumpContext(node));
  } // Visit a parse tree produced by ECMAScriptParser#classDeclaration.


  visitClassDeclaration(ctx) {
    this.log(ctx, _trace.default.frame());
    this.assertType(ctx, _ECMAScriptParser.ECMAScriptParser.ClassDeclarationContext); // Class identifier classTail

    const identifier = this.visitIdentifier(ctx.getChild(1));
    const body = this.visitClassTail(ctx.getChild(2));
    const classBody = new _nodes.ClassBody(body);
    return new _nodes.ClassDeclaration(identifier, null, classBody);
  } // Visit a parse tree produced by ECMAScriptParser#classTail.


  visitClassTail(ctx) {
    this.log(ctx, _trace.default.frame());
    this.assertType(ctx, _ECMAScriptParser.ECMAScriptParser.ClassTailContext); //  (Extends singleExpression)? '{' classElement* '}'

    this.dumpContextAllChildren(ctx);
    const node = this.getNodeByType(ctx, _ECMAScriptParser.ECMAScriptParser.ClassElementContext);
  }

  getNodeByType(ctx, type) {
    for (let i = 0; i < ctx.getChildCount(); ++i) {
      if (ctx.getChild(i) instanceof type) {
        return ctx.getChild(i);
      }
    }

    return null;
  } // Visit a parse tree produced by ECMAScriptParser#classElement.


  visitClassElement(ctx) {
    this.log(ctx, _trace.default.frame());
  } // Visit a parse tree produced by ECMAScriptParser#methodDefinition.


  visitMethodDefinition(ctx) {
    this.log(ctx, _trace.default.frame());
  }
  /**
   * Visit a parse tree produced by ECMAScriptParser#formalParameterList.
   * <code>
   * formalParameterList
   *   : formalParameterArg (',' formalParameterArg)* (',' lastFormalParameterArg)?
   *   | lastFormalParameterArg
   *   ;
   * </code>
   * @param ctx 
   */


  visitFormalParameterList(ctx) {
    this.log(ctx, _trace.default.frame());
    this.assertType(ctx, _ECMAScriptParser.ECMAScriptParser.FormalParameterListContext);
    const formal = [];

    for (let i = 0; i < ctx.getChildCount(); ++i) {
      const node = ctx.getChild(i);

      if (node instanceof _ECMAScriptParser.ECMAScriptParser.FormalParameterArgContext) {
        const parameter = this.visitFormalParameterArg(node);
        formal.push(parameter);
      } else if (node instanceof _ECMAScriptParser.ECMAScriptParser.LastFormalParameterArgContext) {
        const parameter = this.visitLastFormalParameterArg(node);
        formal.push(parameter);
      }
    }

    return formal;
  }
  /**
   * Visit a parse tree produced by ECMAScriptParser#formalParameterArg.
   * 
   * formalParameterArg
   *   : assignable ('=' singleExpression)?      // ECMAScript 6: Initialization
   *   ;
   * @param ctx 
   */


  visitFormalParameterArg(ctx) {
    this.log(ctx, _trace.default.frame());
    this.assertType(ctx, _ECMAScriptParser.ECMAScriptParser.FormalParameterArgContext); //  constructor(left: BindingIdentifier | BindingPattern, right: Expression)

    const count = ctx.getChildCount();

    if (count != 1 && count != 3) {
      this.throwInsanceError(this.dumpContext(ctx));
    } // compliance(espree)
    // Following `(param1 = 1, param2) => {  } ` will produce
    // param1 = AssignmentPattern
    // param2 = BindingIdentifier | BindingPattern 


    if (count == 1) {
      return this.visitAssignable(ctx.getChild(0));
    } else {
      const assignable = this.visitAssignable(ctx.getChild(0));
      const expression = this.singleExpression(ctx.getChild(2));
      return new _nodes.AssignmentPattern(assignable, expression);
    }
  }
  /**
   * 
   *  assignable
   *    : identifier
   *    | arrayLiteral
   *    | objectLiteral
   *    ; 
   * @param ctx  AssignableContext
   */


  visitAssignable(ctx) {
    this.log(ctx, _trace.default.frame());
    this.assertType(ctx, _ECMAScriptParser.ECMAScriptParser.AssignableContext);
    const assignable = ctx.getChild(0);

    if (assignable instanceof _ECMAScriptParser.ECMAScriptParser.IdentifierContext) {
      return this.visitIdentifier(assignable);
    } else if (assignable instanceof _ECMAScriptParser.ECMAScriptParser.ArrayLiteralContext) {
      console.info("((((  (((((");
    } else if (assignable instanceof _ECMAScriptParser.ECMAScriptParser.ObjectLiteralContext) {
      console.info("((((  (((((");
    }

    this.throwInsanceError(this.dumpContext(ctx));
  }
  /**
   * Visit a parse tree produced by ECMAScriptParser#lastFormalParameterArg.
   * 
   * lastFormalParameterArg                        // ECMAScript 6: Rest Parameter
   *   : Ellipsis singleExpression
   *   ;
   */


  visitLastFormalParameterArg(ctx) {
    this.log(ctx, _trace.default.frame());
    this.assertType(ctx, _ECMAScriptParser.ECMAScriptParser.LastFormalParameterArgContext);
    const expression = this.singleExpression(ctx.getChild(1));
    return new _nodes.RestElement(expression);
  } // Visit a parse tree produced by ECMAScriptParser#TernaryExpression.


  visitTernaryExpression(ctx) {
    console.trace('not implemented');
  } // Visit a parse tree produced by ECMAScriptParser#LogicalAndExpression.


  visitLogicalAndExpression(ctx) {
    console.trace('not implemented');
  } // Visit a parse tree produced by ECMAScriptParser#PreIncrementExpression.


  visitPreIncrementExpression(ctx) {
    console.trace('not implemented');
  }
  /**
   * Visit a parse tree produced by ECMAScriptParser#ObjectLiteralExpression.
   * @param ctx 
   */


  visitObjectLiteralExpression(ctx) {
    this.log(ctx, _trace.default.frame());
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
  }
  /**
   * Visit a parse tree produced by ECMAScriptParser#FunctionExpression.
   *   anoymousFunction
   *       : functionDeclaration                                                       # FunctionDecl
   *       | Async? Function '*'? '(' formalParameterList? ')' '{' functionBody '}'    # AnoymousFunctionDecl
   *       | Async? arrowFunctionParameters '=>' arrowFunctionBody                     # ArrowFunction
   *       ;
   * @param ctx 
   */


  visitFunctionExpression(ctx) {
    this.log(ctx, _trace.default.frame());
    this.assertType(ctx, _ECMAScriptParser.ECMAScriptParser.FunctionExpressionContext);
    const node = ctx.getChild(0);
    let functionExpression;

    if (node instanceof _ECMAScriptParser.ECMAScriptParser.FunctionDeclContext) {
      functionExpression = this.visitFunctionDecl(ctx.getChild(0));
    } else if (node instanceof _ECMAScriptParser.ECMAScriptParser.AnoymousFunctionDeclContext) {
      functionExpression = this.visitAnoymousFunctionDecl(ctx.getChild(0));
    } else if (node instanceof _ECMAScriptParser.ECMAScriptParser.ArrowFunctionContext) {
      functionExpression = this.visitArrowFunction(ctx.getChild(0));
    } else {
      throw new TypeError("not implemented");
    }

    return functionExpression;
  } // Visit a parse tree produced by ECMAScriptParser#functionDecl


  visitArrowFunction(ctx) {
    this.log(ctx, _trace.default.frame());
    this.assertType(ctx, _ECMAScriptParser.ECMAScriptParser.ArrowFunctionContext);
    this.dumpContextAllChildren(ctx);
    const paramContext = this.getTypedRuleContext(ctx, _ECMAScriptParser.ECMAScriptParser.ArrowFunctionParametersContext);
    const bodyContext = this.getTypedRuleContext(ctx, _ECMAScriptParser.ECMAScriptParser.ArrowFunctionBodyContext);
    const params = this.visitArrowFunctionParameters(paramContext);
    const body = this.visitArrowFunctionBody(bodyContext);
    const expression = false; // (params: FunctionParameter[], body: BlockStatement | Expression, expression: boolean) 

    return new _nodes.ArrowFunctionExpression(params, body, expression);
  }
  /**
   * arrowFunctionParameters
   *  : identifier
   *  | '(' formalParameterList? ')'
   *  ;
   * @param ctx 
   */


  visitArrowFunctionParameters(ctx) {
    this.log(ctx, _trace.default.frame());
    this.assertType(ctx, _ECMAScriptParser.ECMAScriptParser.ArrowFunctionParametersContext); // got only two ()

    if (ctx.getChildCount() == 2) {
      return [];
    }
    /*
    let async = false;
    let generator = false;
    let identifier: Identifier;
    let params;
    let body;
     for (let i = 0; i < ctx.getChildCount(); ++i) {
        const node = ctx.getChild(i);
        if (node.symbol) {
            const txt = node.getText();
            if (txt == 'async') {
                async = true
            } else if (txt == '*') {
                generator = true
            }
        }
        if (node instanceof ECMAScriptParser.IdentifierContext) {
            identifier = this.visitIdentifier(node);
        } else if (node instanceof ECMAScriptParser.FormalParameterListContext) {
            params = this.visitFormalParameterList(node);
        } else if (node instanceof ECMAScriptParser.FunctionBodyContext) {
            // body = this.visitFunctionBody(node);
            console.info("ECMAScriptParser ;; FormalParameterListContext")
        }
        this.dumpContextAllChildren(node)
    }
     console.info('async  = ' + async);
    console.info('generator  = ' + generator);
    */


    let params = [];

    for (const node of this.iterable(ctx)) {
      if (node instanceof _ECMAScriptParser.ECMAScriptParser.IdentifierContext) {
        params.push(this.visitIdentifier(node));
      } else if (node instanceof _ECMAScriptParser.ECMAScriptParser.FormalParameterListContext) {
        params = [...this.visitFormalParameterList(node)];
      }
    }

    return params;
  }
  /**
   *
   *  arrowFunctionBody
   *   : '{' functionBody '}' 
   *   | singleExpression
   *   ;
   * @param ctx 
   */


  visitArrowFunctionBody(ctx) {
    this.log(ctx, _trace.default.frame());
    this.assertType(ctx, _ECMAScriptParser.ECMAScriptParser.ArrowFunctionBodyContext);
    const node = ctx.getChild(0);

    if (ctx.getChildCount() == 3) {
      const bodyContext = this.getTypedRuleContext(ctx, _ECMAScriptParser.ECMAScriptParser.FunctionBodyContext);

      if (bodyContext.getChildCount() == 0) {
        return new _nodes.BlockStatement([]);
      }

      const body = this.visitFunctionBody(bodyContext);
      return new _nodes.BlockStatement(body);
    } else {
      if (node instanceof _ECMAScriptParser.ECMAScriptParser.ParenthesizedExpressionContext) {
        const parametized = this.visitParenthesizedExpression(node); // compliance espree : this function returns ExpressionStatement or ExpressionSequenceContext
        // unwinding ExpressionStatement to to simply return 

        if (parametized instanceof _nodes.ExpressionStatement) {
          return parametized.expression;
        } else if (parametized instanceof _nodes.SequenceExpression) {
          return parametized;
        }
      } else {
        return this.singleExpression(node);
      }
    }

    throw new TypeError("Unknown type for : " + ctx);
  } // Visit a parse tree produced by ECMAScriptParser#UnaryMinusExpression.


  visitUnaryMinusExpression(ctx) {
    console.trace('not implemented');
  } // Visit a parse tree produced by ECMAScriptParser#PostDecreaseExpression.


  visitPostDecreaseExpression(ctx) {
    console.trace('not implemented');
  }
  /**
   * Visit a parse tree produced by ECMAScriptParser#AssignmentExpression.
   * 
   * <assoc=right> singleExpression '=' singleExpression                   # AssignmentExpression
   * @param ctx 
   */


  visitAssignmentExpression(ctx) {
    this.log(ctx, _trace.default.frame());
    this.assertType(ctx, _ECMAScriptParser.ECMAScriptParser.AssignmentExpressionContext);
    this.assertNodeCount(ctx, 3);
    const initialiser = ctx.getChild(0);
    const operator = ctx.getChild(1).getText(); // No type ( = )

    const expression = ctx.getChild(2);
    const lhs = this.singleExpression(initialiser);
    const rhs = this.singleExpression(expression); // Compliance : pulling up ExpressionStatement into AssigementExpression

    return new _nodes.AssignmentExpression(operator, lhs, rhs);
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
    this.log(ctx, _trace.default.frame());
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
    this.log(ctx, _trace.default.frame());
    this.assertType(ctx, _ECMAScriptParser.ECMAScriptParser.ParenthesizedExpressionContext);
    this.assertNodeCount(ctx, 3);
    const expression = ctx.getChild(1);
    return this.visitExpressionSequence(expression);
  } // Visit a parse tree produced by ECMAScriptParser#AdditiveExpression.


  visitAdditiveExpression(ctx) {
    this.log(ctx, _trace.default.frame());
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
    const name = initialiser.getText(); // return this.decorate(new Identifier(name), this.asMarker(this.asMetadata(initialiser.symbol)))

    return new _nodes.Identifier(name);
  } // Visit a parse tree produced by ECMAScriptParser#identifier.


  visitIdentifier(ctx) {
    this.log(ctx, _trace.default.frame());
    this.assertType(ctx, _ECMAScriptParser.ECMAScriptParser.IdentifierContext);
    return new _nodes.Identifier(ctx.getChild(0).getText());
  } // Visit a parse tree produced by ECMAScriptParser#BitAndExpression.


  visitBitAndExpression(ctx) {
    console.trace('not implemented');
  } // Visit a parse tree produced by ECMAScriptParser#BitOrExpression.


  visitBitOrExpression(ctx) {
    console.trace('not implemented');
  }
  /**
   * Visit a parse tree produced by ECMAScriptParser#AssignmentOperatorExpression.
   * 
   * <assoc=right> singleExpression assignmentOperator singleExpression    # AssignmentOperatorExpression
   * @param ctx 
   */


  visitAssignmentOperatorExpression(ctx) {
    this.log(ctx, _trace.default.frame());
    this.assertType(ctx, _ECMAScriptParser.ECMAScriptParser.AssignmentOperatorExpressionContext);
    this.assertNodeCount(ctx, 3);
    const initialiser = ctx.getChild(0);
    const operator = ctx.getChild(1).getText();
    const expression = ctx.getChild(2);
    const lhs = this.singleExpression(initialiser);
    const rhs = this.singleExpression(expression); // Compliance : pulling up ExpressionStatement into AssigementExpression

    return new _nodes.AssignmentExpression(operator, lhs, rhs.expression);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9BU1RQYXJzZXIudHMiXSwibmFtZXMiOlsiUGFyc2VyVHlwZSIsIkFTVFBhcnNlciIsImNvbnN0cnVjdG9yIiwidmlzaXRvciIsIkRlbHZlbkFTVFZpc2l0b3IiLCJnZW5lcmF0ZSIsInNvdXJjZSIsImNvZGUiLCJ0eXBlIiwidmFsdWUiLCJmcyIsInJlYWRGaWxlU3luYyIsImNoYXJzIiwiYW50bHI0IiwiSW5wdXRTdHJlYW0iLCJsZXhlciIsIkRlbHZlbkxleGVyIiwidG9rZW5zIiwiQ29tbW9uVG9rZW5TdHJlYW0iLCJwYXJzZXIiLCJEZWx2ZW5QYXJzZXIiLCJ0cmVlIiwicHJvZ3JhbSIsImFjY2VwdCIsIlByaW50VmlzaXRvciIsImNvbnNvbGUiLCJpbmZvIiwicmVzdWx0IiwicGFyc2UiLCJFQ01BU2NyaXB0IiwiQVNUUGFyc2VyRGVmYXVsdCIsIkVycm9yIiwiRGVsdmVuVmlzaXRvciIsInJ1bGVUeXBlTWFwIiwiTWFwIiwic2V0dXBUeXBlUnVsZXMiLCJrZXlzIiwiT2JqZWN0IiwiZ2V0T3duUHJvcGVydHlOYW1lcyIsImtleSIsIm5hbWUiLCJzdGFydHNXaXRoIiwic2V0IiwicGFyc2VJbnQiLCJsb2ciLCJjdHgiLCJmcmFtZSIsImZ1bmN0aW9uIiwiZ2V0Q2hpbGRDb3VudCIsImdldFRleHQiLCJkdW1wQ29udGV4dCIsImNvbnRleHQiLCJlbmRzV2l0aCIsInB1c2giLCJsZW5ndGgiLCJjb250ZXh0TmFtZSIsImxvbmdlc3QiLCJvYmoiLCJFQ01BU2NyaXB0UGFyc2VyIiwiY2hhaW4iLCJwcm90b3R5cGUiLCJfX3Byb3RvX18iLCJkdW1wQ29udGV4dEFsbENoaWxkcmVuIiwiaW5kZW50IiwicGFkIiwicGFkU3RhcnQiLCJub2RlcyIsIm1hcmtlciIsImkiLCJjaGlsZCIsImdldENoaWxkIiwiZ2V0UnVsZUJ5SWQiLCJpZCIsImdldCIsImFzTWFya2VyIiwibWV0YWRhdGEiLCJpbmRleCIsImxpbmUiLCJjb2x1bW4iLCJkZWNvcmF0ZSIsIm5vZGUiLCJzdGFydCIsImVuZCIsImFzTWV0YWRhdGEiLCJpbnRlcnZhbCIsIm9mZnNldCIsInN0b3AiLCJ0aHJvd1R5cGVFcnJvciIsInR5cGVJZCIsIlR5cGVFcnJvciIsInRocm93SW5zYW5jZUVycm9yIiwiYXNzZXJ0VHlwZSIsInZpc2l0UHJvZ3JhbSIsIlRyYWNlIiwiUHJvZ3JhbUNvbnRleHQiLCJzdGF0ZW1lbnRzIiwic3RtIiwiU3RhdGVtZW50Q29udGV4dCIsInN0YXRlbWVudCIsInZpc2l0U3RhdGVtZW50IiwiZ2V0U291cmNlSW50ZXJ2YWwiLCJzY3JpcHQiLCJTY3JpcHQiLCJCbG9ja0NvbnRleHQiLCJ2aXNpdEJsb2NrIiwiVmFyaWFibGVTdGF0ZW1lbnRDb250ZXh0IiwidmlzaXRWYXJpYWJsZVN0YXRlbWVudCIsIkltcG9ydFN0YXRlbWVudENvbnRleHQiLCJ2aXNpdEltcG9ydFN0YXRlbWVudCIsIkV4cG9ydFN0YXRlbWVudENvbnRleHQiLCJ2aXNpdEV4cG9ydFN0YXRlbWVudCIsIkVtcHR5U3RhdGVtZW50Q29udGV4dCIsIkNsYXNzRGVjbGFyYXRpb25Db250ZXh0IiwidmlzaXRDbGFzc0RlY2xhcmF0aW9uIiwiRXhwcmVzc2lvblN0YXRlbWVudENvbnRleHQiLCJ2aXNpdEV4cHJlc3Npb25TdGF0ZW1lbnQiLCJJZlN0YXRlbWVudENvbnRleHQiLCJ2aXNpdElmU3RhdGVtZW50IiwiSXRlcmF0aW9uU3RhdGVtZW50Q29udGV4dCIsInZpc2l0SXRlcmF0aW9uU3RhdGVtZW50IiwiQ29udGludWVTdGF0ZW1lbnRDb250ZXh0IiwidmlzaXRDb250aW51ZVN0YXRlbWVudCIsIkJyZWFrU3RhdGVtZW50Q29udGV4dCIsInZpc2l0QnJlYWtTdGF0ZW1lbnQiLCJSZXR1cm5TdGF0ZW1lbnRDb250ZXh0IiwidmlzaXRSZXR1cm5TdGF0ZW1lbnQiLCJZaWVsZFN0YXRlbWVudENvbnRleHQiLCJ2aXNpdFlpZWxkU3RhdGVtZW50IiwiV2l0aFN0YXRlbWVudENvbnRleHQiLCJ2aXNpdFdpdGhTdGF0ZW1lbnQiLCJMYWJlbGxlZFN0YXRlbWVudENvbnRleHQiLCJ2aXNpdExhYmVsbGVkU3RhdGVtZW50IiwiU3dpdGNoU3RhdGVtZW50Q29udGV4dCIsInZpc2l0U3dpdGNoU3RhdGVtZW50IiwiRnVuY3Rpb25FeHByZXNzaW9uQ29udGV4dCIsInZpc2l0RnVuY3Rpb25FeHByZXNzaW9uIiwiVGhyb3dTdGF0ZW1lbnRDb250ZXh0IiwidmlzaXRUaHJvd1N0YXRlbWVudCIsIlRyeVN0YXRlbWVudENvbnRleHQiLCJ2aXNpdFRyeVN0YXRlbWVudCIsIkRlYnVnZ2VyU3RhdGVtZW50Q29udGV4dCIsInZpc2l0RGVidWdnZXJTdGF0ZW1lbnQiLCJGdW5jdGlvbkRlY2xhcmF0aW9uQ29udGV4dCIsInZpc2l0RnVuY3Rpb25EZWNsYXJhdGlvbiIsImJvZHkiLCJTdGF0ZW1lbnRMaXN0Q29udGV4dCIsInN0YXRlbWVudExpc3QiLCJ2aXNpdFN0YXRlbWVudExpc3QiLCJCbG9ja1N0YXRlbWVudCIsImZpbHRlclN5bWJvbHMiLCJnZXRUeXBlZFJ1bGVDb250ZXh0IiwiVmFyaWFibGVEZWNsYXJhdGlvbkxpc3RDb250ZXh0IiwidmlzaXRWYXJpYWJsZURlY2xhcmF0aW9uTGlzdCIsInZhck1vZGlmaWVyQ29udGV4dCIsIlZhck1vZGlmaWVyQ29udGV4dCIsInZhck1vZGlmaWVyIiwiZGVjbGFyYXRpb25zIiwiVmFyaWFibGVEZWNsYXJhdGlvbkNvbnRleHQiLCJ2aXNpdFZhcmlhYmxlRGVjbGFyYXRpb24iLCJWYXJpYWJsZURlY2xhcmF0aW9uIiwiYXNzaWduYWJsZUNvbnRleHQiLCJBc3NpZ25hYmxlQ29udGV4dCIsImFzc2lnbmFibGUiLCJ2aXNpdEFzc2lnbmFibGUiLCJpbml0Iiwic2luZ2xlRXhwcmVzc2lvbiIsIlZhcmlhYmxlRGVjbGFyYXRvciIsInZpc2l0SW5pdGlhbGlzZXIiLCJJbml0aWFsaXNlckNvbnRleHQiLCJhc3NlcnROb2RlQ291bnQiLCJPYmplY3RMaXRlcmFsRXhwcmVzc2lvbkNvbnRleHQiLCJ2aXNpdE9iamVjdExpdGVyYWxFeHByZXNzaW9uIiwiQXJyYXlMaXRlcmFsRXhwcmVzc2lvbkNvbnRleHQiLCJ2aXNpdEFycmF5TGl0ZXJhbEV4cHJlc3Npb24iLCJ2aXNpdEVtcHR5U3RhdGVtZW50IiwiY291bnQiLCJleHAiLCJFeHByZXNzaW9uU2VxdWVuY2VDb250ZXh0IiwidmlzaXRFeHByZXNzaW9uU2VxdWVuY2UiLCJ0ZXN0IiwiY29uc2VxdWVudCIsImFsdGVybmF0ZSIsInVuZGVmaW5lZCIsIklmU3RhdGVtZW50IiwidmlzaXREb1N0YXRlbWVudCIsInZpc2l0V2hpbGVTdGF0ZW1lbnQiLCJ2aXNpdEZvclN0YXRlbWVudCIsInZpc2l0Rm9yVmFyU3RhdGVtZW50IiwidHJhY2UiLCJ2aXNpdEZvckluU3RhdGVtZW50IiwidmlzaXRGb3JWYXJJblN0YXRlbWVudCIsInZpc2l0Q2FzZUJsb2NrIiwidmlzaXRDYXNlQ2xhdXNlcyIsInZpc2l0Q2FzZUNsYXVzZSIsInZpc2l0RGVmYXVsdENsYXVzZSIsImlkZW50aWZpZXIiLCJ2aXNpdElkZW50aWZpZXIiLCJMYWJlbGVkU3RhdGVtZW50IiwidmlzaXRDYXRjaFByb2R1Y3Rpb24iLCJ2aXNpdEZpbmFsbHlQcm9kdWN0aW9uIiwiYXN5bmMiLCJnZW5lcmF0b3IiLCJwYXJhbXMiLCJzeW1ib2wiLCJ0eHQiLCJJZGVudGlmaWVyQ29udGV4dCIsIkZvcm1hbFBhcmFtZXRlckxpc3RDb250ZXh0IiwidmlzaXRGb3JtYWxQYXJhbWV0ZXJMaXN0IiwiRnVuY3Rpb25Cb2R5Q29udGV4dCIsIkFzeW5jRnVuY3Rpb25EZWNsYXJhdGlvbiIsIkZ1bmN0aW9uRGVjbGFyYXRpb24iLCJwYXJtYXMiLCJ2aXNpdEZ1bmN0aW9uRGVjbCIsIkZ1bmN0aW9uRGVjbENvbnRleHQiLCJ2aXNpdEZ1bmN0aW9uQm9keSIsInNvdXJjZUVsZW1lbnRzQ29udGV4dCIsIlNvdXJjZUVsZW1lbnRzQ29udGV4dCIsInZpc2l0U291cmNlRWxlbWVudHMiLCJzb3VyY2VFbGVtZW50IiwidmlzaXRBcnJheUxpdGVyYWwiLCJBcnJheUxpdGVyYWxDb250ZXh0IiwiZWxlbWVudExpc3RDb250ZXh0IiwiRWxlbWVudExpc3RDb250ZXh0IiwiZWxlbWVudHMiLCJ2aXNpdEVsZW1lbnRMaXN0IiwiQXJyYXlFeHByZXNzaW9uIiwiaXRlcmFibGUiLCJ2aXNpdEFycmF5RWxlbWVudCIsIkFycmF5RWxlbWVudENvbnRleHQiLCJleHByZXNzaW9uIiwiU3ByZWFkRWxlbWVudCIsInZpc2l0T2JqZWN0TGl0ZXJhbCIsIk9iamVjdExpdGVyYWxDb250ZXh0IiwiT2JqZWN0RXhwcmVzc2lvbiIsInByb3BlcnRpZXMiLCJwcm9wZXJ0eSIsIlByb3BlcnR5RXhwcmVzc2lvbkFzc2lnbm1lbnRDb250ZXh0IiwidmlzaXRQcm9wZXJ0eUV4cHJlc3Npb25Bc3NpZ25tZW50IiwiUHJvcGVydHlTaG9ydGhhbmRDb250ZXh0IiwidmlzaXRQcm9wZXJ0eVNob3J0aGFuZCIsIkZ1bmN0aW9uUHJvcGVydHlDb250ZXh0IiwidmlzaXRGdW5jdGlvblByb3BlcnR5IiwiY29tcHV0ZWQiLCJtZXRob2QiLCJzaG9ydGhhbmQiLCJJZGVudGlmaWVyIiwiUHJvcGVydHkiLCJmaWx0ZXJlZCIsIm4wIiwibjEiLCJuMiIsInZpc2l0UHJvcGVydHlOYW1lIiwiQ29tcHV0ZWRQcm9wZXJ0eUV4cHJlc3Npb25Bc3NpZ25tZW50Q29udGV4dCIsIlByb3BlcnR5R2V0dGVyQ29udGV4dCIsIlByb3BlcnR5U2V0dGVyQ29udGV4dCIsInZpc2l0UHJvcGVydHlHZXR0ZXIiLCJ2aXNpdFByb3BlcnR5U2V0dGVyIiwiUHJvcGVydHlOYW1lQ29udGV4dCIsImNyZWF0ZUxpdGVyYWxWYWx1ZSIsInZpc2l0SWRlbnRpZmllck5hbWUiLCJ2aXNpdFByb3BlcnR5U2V0UGFyYW1ldGVyTGlzdCIsInZpc2l0QXJndW1lbnRzIiwidmlzaXRBcmd1bWVudExpc3QiLCJleHByZXNzaW9ucyIsIkV4cHJlc3Npb25TdGF0ZW1lbnQiLCJTZXF1ZW5jZUV4cHJlc3Npb24iLCJMaXRlcmFsRXhwcmVzc2lvbkNvbnRleHQiLCJ2aXNpdExpdGVyYWxFeHByZXNzaW9uIiwiQXNzaWdubWVudEV4cHJlc3Npb25Db250ZXh0IiwidmlzaXRBc3NpZ25tZW50RXhwcmVzc2lvbiIsIkFkZGl0aXZlRXhwcmVzc2lvbkNvbnRleHQiLCJ2aXNpdEFkZGl0aXZlRXhwcmVzc2lvbiIsIk11bHRpcGxpY2F0aXZlRXhwcmVzc2lvbkNvbnRleHQiLCJ2aXNpdE11bHRpcGxpY2F0aXZlRXhwcmVzc2lvbiIsIkVxdWFsaXR5RXhwcmVzc2lvbkNvbnRleHQiLCJ2aXNpdEVxdWFsaXR5RXhwcmVzc2lvbiIsIlBhcmVudGhlc2l6ZWRFeHByZXNzaW9uQ29udGV4dCIsInZpc2l0UGFyZW50aGVzaXplZEV4cHJlc3Npb24iLCJSZWxhdGlvbmFsRXhwcmVzc2lvbkNvbnRleHQiLCJ2aXNpdFJlbGF0aW9uYWxFeHByZXNzaW9uIiwiSWRlbnRpZmllckV4cHJlc3Npb25Db250ZXh0IiwidmlzaXRJZGVudGlmaWVyRXhwcmVzc2lvbiIsIk1lbWJlckRvdEV4cHJlc3Npb25Db250ZXh0IiwidmlzaXRNZW1iZXJEb3RFeHByZXNzaW9uIiwiTWVtYmVySW5kZXhFeHByZXNzaW9uQ29udGV4dCIsInZpc2l0TWVtYmVySW5kZXhFeHByZXNzaW9uIiwiQXNzaWdubWVudE9wZXJhdG9yRXhwcmVzc2lvbkNvbnRleHQiLCJ2aXNpdEFzc2lnbm1lbnRPcGVyYXRvckV4cHJlc3Npb24iLCJ2aXNpdENsYXNzVGFpbCIsImNsYXNzQm9keSIsIkNsYXNzQm9keSIsIkNsYXNzRGVjbGFyYXRpb24iLCJDbGFzc1RhaWxDb250ZXh0IiwiZ2V0Tm9kZUJ5VHlwZSIsIkNsYXNzRWxlbWVudENvbnRleHQiLCJ2aXNpdENsYXNzRWxlbWVudCIsInZpc2l0TWV0aG9kRGVmaW5pdGlvbiIsImZvcm1hbCIsIkZvcm1hbFBhcmFtZXRlckFyZ0NvbnRleHQiLCJwYXJhbWV0ZXIiLCJ2aXNpdEZvcm1hbFBhcmFtZXRlckFyZyIsIkxhc3RGb3JtYWxQYXJhbWV0ZXJBcmdDb250ZXh0IiwidmlzaXRMYXN0Rm9ybWFsUGFyYW1ldGVyQXJnIiwiQXNzaWdubWVudFBhdHRlcm4iLCJSZXN0RWxlbWVudCIsInZpc2l0VGVybmFyeUV4cHJlc3Npb24iLCJ2aXNpdExvZ2ljYWxBbmRFeHByZXNzaW9uIiwidmlzaXRQcmVJbmNyZW1lbnRFeHByZXNzaW9uIiwidmlzaXRJbkV4cHJlc3Npb24iLCJ2aXNpdExvZ2ljYWxPckV4cHJlc3Npb24iLCJ2aXNpdE5vdEV4cHJlc3Npb24iLCJ2aXNpdFByZURlY3JlYXNlRXhwcmVzc2lvbiIsInZpc2l0QXJndW1lbnRzRXhwcmVzc2lvbiIsInZpc2l0VGhpc0V4cHJlc3Npb24iLCJmdW5jdGlvbkV4cHJlc3Npb24iLCJBbm95bW91c0Z1bmN0aW9uRGVjbENvbnRleHQiLCJ2aXNpdEFub3ltb3VzRnVuY3Rpb25EZWNsIiwiQXJyb3dGdW5jdGlvbkNvbnRleHQiLCJ2aXNpdEFycm93RnVuY3Rpb24iLCJwYXJhbUNvbnRleHQiLCJBcnJvd0Z1bmN0aW9uUGFyYW1ldGVyc0NvbnRleHQiLCJib2R5Q29udGV4dCIsIkFycm93RnVuY3Rpb25Cb2R5Q29udGV4dCIsInZpc2l0QXJyb3dGdW5jdGlvblBhcmFtZXRlcnMiLCJ2aXNpdEFycm93RnVuY3Rpb25Cb2R5IiwiQXJyb3dGdW5jdGlvbkV4cHJlc3Npb24iLCJwYXJhbWV0aXplZCIsInZpc2l0VW5hcnlNaW51c0V4cHJlc3Npb24iLCJ2aXNpdFBvc3REZWNyZWFzZUV4cHJlc3Npb24iLCJpbml0aWFsaXNlciIsIm9wZXJhdG9yIiwibGhzIiwicmhzIiwiQXNzaWdubWVudEV4cHJlc3Npb24iLCJ2aXNpdFR5cGVvZkV4cHJlc3Npb24iLCJ2aXNpdEluc3RhbmNlb2ZFeHByZXNzaW9uIiwidmlzaXRVbmFyeVBsdXNFeHByZXNzaW9uIiwidmlzaXREZWxldGVFeHByZXNzaW9uIiwibGVmdCIsInJpZ2h0IiwiX3Zpc2l0QmluYXJ5RXhwcmVzc2lvbiIsIkJpbmFyeUV4cHJlc3Npb24iLCJ2aXNpdEJpdFhPckV4cHJlc3Npb24iLCJ2aXNpdEJpbmFyeUV4cHJlc3Npb24iLCJ2aXNpdEJpdFNoaWZ0RXhwcmVzc2lvbiIsInZpc2l0UG9zdEluY3JlbWVudEV4cHJlc3Npb24iLCJ2aXNpdEJpdE5vdEV4cHJlc3Npb24iLCJ2aXNpdE5ld0V4cHJlc3Npb24iLCJMaXRlcmFsQ29udGV4dCIsInZpc2l0TGl0ZXJhbCIsIk51bWVyaWNMaXRlcmFsQ29udGV4dCIsInZpc2l0TnVtZXJpY0xpdGVyYWwiLCJleHByIiwiU3RhdGljTWVtYmVyRXhwcmVzc2lvbiIsInByaW50IiwiQ29tcHV0ZWRNZW1iZXJFeHByZXNzaW9uIiwidmlzaXRCaXRBbmRFeHByZXNzaW9uIiwidmlzaXRCaXRPckV4cHJlc3Npb24iLCJ2aXNpdFZvaWRFeHByZXNzaW9uIiwidmlzaXRBc3NpZ25tZW50T3BlcmF0b3IiLCJsaXRlcmFsIiwiTGl0ZXJhbCIsIk51bWJlciIsIklkZW50aWZpZXJOYW1lQ29udGV4dCIsInZpc2l0UmVzZXJ2ZWRXb3JkIiwidmlzaXRLZXl3b3JkIiwidmlzaXRGdXR1cmVSZXNlcnZlZFdvcmQiLCJ2aXNpdEdldHRlciIsInZpc2l0U2V0dGVyIiwidmlzaXRFb3MiLCJ2aXNpdEVvZiJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUNBOztBQUVBOzs7Ozs7OztBQWJBOztBQWdCQTs7Ozs7Ozs7SUFRWUEsVTs7O1dBQUFBLFU7QUFBQUEsRUFBQUEsVSxDQUFBQSxVO0dBQUFBLFUsMEJBQUFBLFU7O0FBWUcsTUFBZUMsU0FBZixDQUF5QjtBQUdwQ0MsRUFBQUEsV0FBVyxDQUFDQyxPQUFELEVBQTZCO0FBQ3BDLFNBQUtBLE9BQUwsR0FBZUEsT0FBTyxJQUFJLElBQUlDLGdCQUFKLEVBQTFCO0FBQ0g7O0FBRURDLEVBQUFBLFFBQVEsQ0FBQ0MsTUFBRCxFQUE4QjtBQUNsQyxRQUFJQyxJQUFKOztBQUNBLFlBQVFELE1BQU0sQ0FBQ0UsSUFBZjtBQUNJLFdBQUssTUFBTDtBQUNJRCxRQUFBQSxJQUFJLEdBQUdELE1BQU0sQ0FBQ0csS0FBZDtBQUNBOztBQUNKLFdBQUssVUFBTDtBQUNJRixRQUFBQSxJQUFJLEdBQUdHLEVBQUUsQ0FBQ0MsWUFBSCxDQUFnQkwsTUFBTSxDQUFDRyxLQUF2QixFQUE4QixNQUE5QixDQUFQO0FBQ0E7QUFOUjs7QUFTQSxRQUFJRyxLQUFLLEdBQUcsSUFBSUMsTUFBTSxDQUFDQyxXQUFYLENBQXVCUCxJQUF2QixDQUFaO0FBQ0EsUUFBSVEsS0FBSyxHQUFHLElBQUlDLGdDQUFKLENBQWdCSixLQUFoQixDQUFaO0FBQ0EsUUFBSUssTUFBTSxHQUFHLElBQUlKLE1BQU0sQ0FBQ0ssaUJBQVgsQ0FBNkJILEtBQTdCLENBQWI7QUFDQSxRQUFJSSxNQUFNLEdBQUcsSUFBSUMsa0NBQUosQ0FBaUJILE1BQWpCLENBQWI7QUFDQSxRQUFJSSxJQUFJLEdBQUdGLE1BQU0sQ0FBQ0csT0FBUCxFQUFYLENBZmtDLENBZ0JsQzs7QUFDQUQsSUFBQUEsSUFBSSxDQUFDRSxNQUFMLENBQVksSUFBSUMsMEJBQUosRUFBWjtBQUNBQyxJQUFBQSxPQUFPLENBQUNDLElBQVIsQ0FBYSx1QkFBYjtBQUNBLFFBQUlDLE1BQU0sR0FBR04sSUFBSSxDQUFDRSxNQUFMLENBQVksS0FBS3BCLE9BQWpCLENBQWI7QUFDQSxXQUFPd0IsTUFBUDtBQUNIO0FBRUQ7Ozs7Ozs7QUFLQSxTQUFPQyxLQUFQLENBQWF0QixNQUFiLEVBQWlDRSxJQUFqQyxFQUE2RDtBQUN6RCxRQUFJQSxJQUFJLElBQUksSUFBWixFQUNJQSxJQUFJLEdBQUdSLFVBQVUsQ0FBQzZCLFVBQWxCO0FBQ0osUUFBSVYsTUFBSjs7QUFDQSxZQUFRWCxJQUFSO0FBQ0ksV0FBS1IsVUFBVSxDQUFDNkIsVUFBaEI7QUFDSVYsUUFBQUEsTUFBTSxHQUFHLElBQUlXLGdCQUFKLEVBQVQ7QUFDQTs7QUFDSjtBQUNJLGNBQU0sSUFBSUMsS0FBSixDQUFVLG9CQUFWLENBQU47QUFMUjs7QUFPQSxXQUFPWixNQUFNLENBQUNkLFFBQVAsQ0FBZ0JDLE1BQWhCLENBQVA7QUFDSDs7QUEvQ21DOzs7O0FBa0R4QyxNQUFNd0IsZ0JBQU4sU0FBK0I3QixTQUEvQixDQUF5Qzs7QUFJbEMsTUFBTUcsZ0JBQU4sU0FBK0I0QixnREFBL0IsQ0FBNkM7QUFDeENDLEVBQUFBLFdBQVIsR0FBMkMsSUFBSUMsR0FBSixFQUEzQzs7QUFFQWhDLEVBQUFBLFdBQVcsR0FBRztBQUNWO0FBQ0EsU0FBS2lDLGNBQUw7QUFDSDs7QUFFT0EsRUFBQUEsY0FBUixHQUF5QjtBQUNyQixVQUFNQyxJQUFJLEdBQUdDLE1BQU0sQ0FBQ0MsbUJBQVAsQ0FBMkJsQixrQ0FBM0IsQ0FBYjs7QUFDQSxTQUFLLElBQUltQixHQUFULElBQWdCSCxJQUFoQixFQUFzQjtBQUNsQixVQUFJSSxJQUFJLEdBQUdKLElBQUksQ0FBQ0csR0FBRCxDQUFmOztBQUNBLFVBQUlDLElBQUksQ0FBQ0MsVUFBTCxDQUFnQixPQUFoQixDQUFKLEVBQThCO0FBQzFCLGFBQUtSLFdBQUwsQ0FBaUJTLEdBQWpCLENBQXFCQyxRQUFRLENBQUN2QixtQ0FBYW9CLElBQWIsQ0FBRCxDQUE3QixFQUFtREEsSUFBbkQ7QUFDSDtBQUNKO0FBQ0o7O0FBRU9JLEVBQUFBLEdBQVIsQ0FBWUMsR0FBWixFQUE4QkMsS0FBOUIsRUFBK0M7QUFDM0NyQixJQUFBQSxPQUFPLENBQUNDLElBQVIsQ0FBYSxjQUFiLEVBQTZCb0IsS0FBSyxDQUFDQyxRQUFuQyxFQUE2Q0YsR0FBRyxDQUFDRyxhQUFKLEVBQTdDLEVBQWtFSCxHQUFHLENBQUNJLE9BQUosRUFBbEU7QUFDSDs7QUFFT0MsRUFBQUEsV0FBUixDQUFvQkwsR0FBcEIsRUFBc0M7QUFDbEMsVUFBTVQsSUFBSSxHQUFHQyxNQUFNLENBQUNDLG1CQUFQLENBQTJCbEIsa0NBQTNCLENBQWI7QUFDQSxRQUFJK0IsT0FBTyxHQUFHLEVBQWQ7O0FBQ0EsU0FBSyxJQUFJWixHQUFULElBQWdCSCxJQUFoQixFQUFzQjtBQUNsQixVQUFJSSxJQUFJLEdBQUdKLElBQUksQ0FBQ0csR0FBRCxDQUFmLENBRGtCLENBRWxCOztBQUNBLFVBQUlDLElBQUksQ0FBQ1ksUUFBTCxDQUFjLFNBQWQsQ0FBSixFQUE4QjtBQUMxQixZQUFJUCxHQUFHLFlBQVl6QixtQ0FBYW9CLElBQWIsQ0FBbkIsRUFBdUM7QUFDbkNXLFVBQUFBLE9BQU8sQ0FBQ0UsSUFBUixDQUFhYixJQUFiO0FBQ0g7QUFDSjtBQUNKLEtBWGlDLENBYWxDO0FBQ0E7QUFDQTtBQUNBOztBQUNBOzs7Ozs7Ozs7OztBQVNBLFFBQUlXLE9BQU8sQ0FBQ0csTUFBUixHQUFpQixDQUFyQixFQUF3QjtBQUNwQixVQUFJQyxXQUFKO0FBQ0EsVUFBSUMsT0FBTyxHQUFHLENBQWQ7O0FBQ0EsV0FBSyxNQUFNakIsR0FBWCxJQUFrQlksT0FBbEIsRUFBMkI7QUFDdkIsY0FBTVgsSUFBSSxHQUFHVyxPQUFPLENBQUNaLEdBQUQsQ0FBcEI7QUFDQSxZQUFJa0IsR0FBRyxHQUFHQyxtQ0FBaUJsQixJQUFqQixDQUFWO0FBQ0EsWUFBSW1CLEtBQUssR0FBRyxDQUFaOztBQUNBLFdBQUc7QUFDQyxZQUFFQSxLQUFGO0FBQ0FGLFVBQUFBLEdBQUcsR0FBR0MsbUNBQWlCRCxHQUFHLENBQUNHLFNBQUosQ0FBY0MsU0FBZCxDQUF3QjNELFdBQXhCLENBQW9Dc0MsSUFBckQsQ0FBTjtBQUNILFNBSEQsUUFHU2lCLEdBQUcsSUFBSUEsR0FBRyxDQUFDRyxTQUhwQjs7QUFJQSxZQUFJRCxLQUFLLEdBQUdILE9BQVosRUFBcUI7QUFDakJBLFVBQUFBLE9BQU8sR0FBR0csS0FBVjtBQUNBSixVQUFBQSxXQUFXLEdBQUksR0FBRWYsSUFBSyxTQUFRbUIsS0FBTSxHQUFwQztBQUNIO0FBQ0o7O0FBQ0QsYUFBTyxDQUFDSixXQUFELENBQVA7QUFDSDs7QUFDRCxXQUFPSixPQUFQO0FBQ0g7O0FBRU9XLEVBQUFBLHNCQUFSLENBQStCakIsR0FBL0IsRUFBaURrQixNQUFNLEdBQUcsQ0FBMUQsRUFBNkQ7QUFDekQsVUFBTUMsR0FBRyxHQUFHLElBQUlDLFFBQUosQ0FBYUYsTUFBYixFQUFxQixJQUFyQixDQUFaO0FBQ0EsVUFBTUcsS0FBSyxHQUFHLEtBQUtoQixXQUFMLENBQWlCTCxHQUFqQixDQUFkOztBQUNBLFFBQUlxQixLQUFLLENBQUNaLE1BQU4sR0FBZSxDQUFuQixFQUFzQjtBQUNsQixZQUFNYSxNQUFNLEdBQUdKLE1BQU0sSUFBSSxDQUFWLEdBQWMsS0FBZCxHQUFzQixLQUFyQztBQUNBdEMsTUFBQUEsT0FBTyxDQUFDQyxJQUFSLENBQWFzQyxHQUFHLEdBQUdHLE1BQU4sR0FBZUQsS0FBNUI7QUFDSDs7QUFDRCxTQUFLLElBQUlFLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUd2QixHQUFHLENBQUNHLGFBQUosRUFBcEIsRUFBeUMsRUFBRW9CLENBQTNDLEVBQThDO0FBQzFDLFVBQUlDLEtBQUssR0FBR3hCLEdBQUgsYUFBR0EsR0FBSCx1QkFBR0EsR0FBRyxDQUFFeUIsUUFBTCxDQUFjRixDQUFkLENBQVo7O0FBQ0EsVUFBSUMsS0FBSixFQUFXO0FBQ1AsYUFBS1Asc0JBQUwsQ0FBNEJPLEtBQTVCLEVBQW1DLEVBQUVOLE1BQXJDO0FBQ0EsVUFBRUEsTUFBRjtBQUNIO0FBQ0o7QUFDSjtBQUVEOzs7Ozs7QUFJQVEsRUFBQUEsV0FBVyxDQUFDQyxFQUFELEVBQWlDO0FBQ3hDLFdBQU8sS0FBS3ZDLFdBQUwsQ0FBaUJ3QyxHQUFqQixDQUFxQkQsRUFBckIsQ0FBUDtBQUNIOztBQUVPRSxFQUFBQSxRQUFSLENBQWlCQyxRQUFqQixFQUFnQztBQUM1QixXQUFPO0FBQUVDLE1BQUFBLEtBQUssRUFBRSxDQUFUO0FBQVlDLE1BQUFBLElBQUksRUFBRSxDQUFsQjtBQUFxQkMsTUFBQUEsTUFBTSxFQUFFO0FBQTdCLEtBQVA7QUFDSDs7QUFFT0MsRUFBQUEsUUFBUixDQUFpQkMsSUFBakIsRUFBNEJiLE1BQTVCLEVBQWlEO0FBQzdDYSxJQUFBQSxJQUFJLENBQUNDLEtBQUwsR0FBYSxDQUFiO0FBQ0FELElBQUFBLElBQUksQ0FBQ0UsR0FBTCxHQUFXLENBQVg7QUFDQSxXQUFPRixJQUFQO0FBQ0g7O0FBRU9HLEVBQUFBLFVBQVIsQ0FBbUJDLFFBQW5CLEVBQTRDO0FBQ3hDLFdBQU87QUFDSEgsTUFBQUEsS0FBSyxFQUFFO0FBQ0hKLFFBQUFBLElBQUksRUFBRSxDQURIO0FBRUhDLFFBQUFBLE1BQU0sRUFBRU0sUUFBUSxDQUFDSCxLQUZkO0FBR0hJLFFBQUFBLE1BQU0sRUFBRTtBQUhMLE9BREo7QUFNSEgsTUFBQUEsR0FBRyxFQUFFO0FBQ0RMLFFBQUFBLElBQUksRUFBRSxDQURMO0FBRURDLFFBQUFBLE1BQU0sRUFBRU0sUUFBUSxDQUFDRSxJQUZoQjtBQUdERCxRQUFBQSxNQUFNLEVBQUU7QUFIUDtBQU5GLEtBQVA7QUFZSDs7QUFFT0UsRUFBQUEsY0FBUixDQUF1QkMsTUFBdkIsRUFBb0M7QUFDaEMsVUFBTSxJQUFJQyxTQUFKLENBQWMsc0JBQXNCRCxNQUF0QixHQUErQixLQUEvQixHQUF1QyxLQUFLakIsV0FBTCxDQUFpQmlCLE1BQWpCLENBQXJELENBQU47QUFDSDtBQUVEOzs7Ozs7O0FBS1FFLEVBQUFBLGlCQUFSLENBQTBCbEYsSUFBMUIsRUFBMkM7QUFDdkM7OztBQUdBLFVBQU0sSUFBSWlGLFNBQUosQ0FBYywrQkFBK0JqRixJQUE3QyxDQUFOO0FBQ0g7O0FBRU9tRixFQUFBQSxVQUFSLENBQW1COUMsR0FBbkIsRUFBcUNyQyxJQUFyQyxFQUFzRDtBQUNsRCxRQUFJLEVBQUVxQyxHQUFHLFlBQVlyQyxJQUFqQixDQUFKLEVBQTRCO0FBQ3hCLFlBQU0sSUFBSWlGLFNBQUosQ0FBYyw4QkFBOEJqRixJQUFJLENBQUNnQyxJQUFuQyxHQUEwQyxjQUExQyxHQUEyRCxLQUFLVSxXQUFMLENBQWlCTCxHQUFqQixDQUF6RSxJQUFrRyxHQUF4RztBQUNIO0FBQ0osR0ExSStDLENBNEloRDs7O0FBQ0ErQyxFQUFBQSxZQUFZLENBQUMvQyxHQUFELEVBQTJCO0FBQ25DLFNBQUtELEdBQUwsQ0FBU0MsR0FBVCxFQUFjZ0QsZUFBTS9DLEtBQU4sRUFBZDtBQUNBLFNBQUs2QyxVQUFMLENBQWdCOUMsR0FBaEIsRUFBcUJhLG1DQUFpQm9DLGNBQXRDLEVBRm1DLENBR25DOztBQUNBLFVBQU1DLFVBQVUsR0FBRyxFQUFuQjtBQUNBLFVBQU1mLElBQUksR0FBR25DLEdBQUcsQ0FBQ3lCLFFBQUosQ0FBYSxDQUFiLENBQWIsQ0FMbUMsQ0FLSjs7QUFDL0IsU0FBSyxJQUFJRixDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHWSxJQUFJLENBQUNoQyxhQUFMLEVBQXBCLEVBQTBDLEVBQUVvQixDQUE1QyxFQUErQztBQUMzQyxZQUFNNEIsR0FBRyxHQUFHaEIsSUFBSSxDQUFDVixRQUFMLENBQWNGLENBQWQsRUFBaUJFLFFBQWpCLENBQTBCLENBQTFCLENBQVosQ0FEMkMsQ0FDRDs7QUFDMUMsVUFBSTBCLEdBQUcsWUFBWXRDLG1DQUFpQnVDLGdCQUFwQyxFQUFzRDtBQUNsRCxjQUFNQyxTQUFTLEdBQUcsS0FBS0MsY0FBTCxDQUFvQkgsR0FBcEIsQ0FBbEI7QUFDQUQsUUFBQUEsVUFBVSxDQUFDMUMsSUFBWCxDQUFnQjZDLFNBQWhCO0FBQ0gsT0FIRCxNQUdPO0FBQ0gsYUFBS1IsaUJBQUwsQ0FBdUIsS0FBS3hDLFdBQUwsQ0FBaUI4QyxHQUFqQixDQUF2QjtBQUNIO0FBQ0o7O0FBQ0QsVUFBTVosUUFBUSxHQUFHdkMsR0FBRyxDQUFDdUQsaUJBQUosRUFBakI7QUFDQSxVQUFNQyxNQUFNLEdBQUcsSUFBSUMsYUFBSixDQUFXUCxVQUFYLENBQWY7QUFDQSxXQUFPLEtBQUtoQixRQUFMLENBQWNzQixNQUFkLEVBQXNCLEtBQUszQixRQUFMLENBQWMsS0FBS1MsVUFBTCxDQUFnQkMsUUFBaEIsQ0FBZCxDQUF0QixDQUFQO0FBQ0gsR0EvSitDLENBaUtoRDs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBeUJBZSxFQUFBQSxjQUFjLENBQUN0RCxHQUFELEVBQXdCO0FBQ2xDLFNBQUtELEdBQUwsQ0FBU0MsR0FBVCxFQUFjZ0QsZUFBTS9DLEtBQU4sRUFBZDtBQUNBLFNBQUs2QyxVQUFMLENBQWdCOUMsR0FBaEIsRUFBcUJhLG1DQUFpQnVDLGdCQUF0QztBQUNBLFVBQU1qQixJQUFpQixHQUFHbkMsR0FBRyxDQUFDeUIsUUFBSixDQUFhLENBQWIsQ0FBMUI7O0FBRUEsUUFBSVUsSUFBSSxZQUFZdEIsbUNBQWlCNkMsWUFBckMsRUFBbUQ7QUFDL0MsYUFBTyxLQUFLQyxVQUFMLENBQWdCeEIsSUFBaEIsQ0FBUDtBQUNILEtBRkQsTUFFTyxJQUFJQSxJQUFJLFlBQVl0QixtQ0FBaUIrQyx3QkFBckMsRUFBK0Q7QUFDbEUsYUFBTyxLQUFLQyxzQkFBTCxDQUE0QjFCLElBQTVCLENBQVA7QUFDSCxLQUZNLE1BRUEsSUFBSUEsSUFBSSxZQUFZdEIsbUNBQWlCaUQsc0JBQXJDLEVBQTZEO0FBQ2hFLGFBQU8sS0FBS0Msb0JBQUwsQ0FBMEI1QixJQUExQixDQUFQO0FBQ0gsS0FGTSxNQUVBLElBQUlBLElBQUksWUFBWXRCLG1DQUFpQm1ELHNCQUFyQyxFQUE2RDtBQUNoRSxhQUFPLEtBQUtDLG9CQUFMLENBQTBCOUIsSUFBMUIsQ0FBUDtBQUNILEtBRk0sTUFFQSxJQUFJQSxJQUFJLFlBQVl0QixtQ0FBaUJxRCxxQkFBckMsRUFBNEQsQ0FDL0Q7QUFDSCxLQUZNLE1BRUEsSUFBSS9CLElBQUksWUFBWXRCLG1DQUFpQnNELHVCQUFyQyxFQUE4RDtBQUNqRSxhQUFPLEtBQUtDLHFCQUFMLENBQTJCakMsSUFBM0IsQ0FBUDtBQUNILEtBRk0sTUFFQSxJQUFJQSxJQUFJLFlBQVl0QixtQ0FBaUJ3RCwwQkFBckMsRUFBaUU7QUFDcEUsYUFBTyxLQUFLQyx3QkFBTCxDQUE4Qm5DLElBQTlCLENBQVA7QUFDSCxLQUZNLE1BRUEsSUFBSUEsSUFBSSxZQUFZdEIsbUNBQWlCMEQsa0JBQXJDLEVBQXlEO0FBQzVELGFBQU8sS0FBS0MsZ0JBQUwsQ0FBc0JyQyxJQUF0QixDQUFQO0FBQ0gsS0FGTSxNQUVBLElBQUlBLElBQUksWUFBWXRCLG1DQUFpQjRELHlCQUFyQyxFQUFnRTtBQUNuRSxhQUFPLEtBQUtDLHVCQUFMLENBQTZCdkMsSUFBN0IsQ0FBUDtBQUNILEtBRk0sTUFFQSxJQUFJQSxJQUFJLFlBQVl0QixtQ0FBaUI4RCx3QkFBckMsRUFBK0Q7QUFDbEUsYUFBTyxLQUFLQyxzQkFBTCxDQUE0QnpDLElBQTVCLENBQVA7QUFDSCxLQUZNLE1BRUEsSUFBSUEsSUFBSSxZQUFZdEIsbUNBQWlCZ0UscUJBQXJDLEVBQTREO0FBQy9ELGFBQU8sS0FBS0MsbUJBQUwsQ0FBeUIzQyxJQUF6QixDQUFQO0FBQ0gsS0FGTSxNQUVBLElBQUlBLElBQUksWUFBWXRCLG1DQUFpQmtFLHNCQUFyQyxFQUE2RDtBQUNoRSxhQUFPLEtBQUtDLG9CQUFMLENBQTBCN0MsSUFBMUIsQ0FBUDtBQUNILEtBRk0sTUFFQSxJQUFJQSxJQUFJLFlBQVl0QixtQ0FBaUJvRSxxQkFBckMsRUFBNEQ7QUFDL0QsYUFBTyxLQUFLQyxtQkFBTCxDQUF5Qi9DLElBQXpCLENBQVA7QUFDSCxLQUZNLE1BRUEsSUFBSUEsSUFBSSxZQUFZdEIsbUNBQWlCc0Usb0JBQXJDLEVBQTJEO0FBQzlELGFBQU8sS0FBS0Msa0JBQUwsQ0FBd0JqRCxJQUF4QixDQUFQO0FBQ0gsS0FGTSxNQUVBLElBQUlBLElBQUksWUFBWXRCLG1DQUFpQndFLHdCQUFyQyxFQUErRDtBQUNsRSxhQUFPLEtBQUtDLHNCQUFMLENBQTRCbkQsSUFBNUIsQ0FBUDtBQUNILEtBRk0sTUFFQSxJQUFJQSxJQUFJLFlBQVl0QixtQ0FBaUIwRSxzQkFBckMsRUFBNkQ7QUFDaEUsYUFBTyxLQUFLQyxvQkFBTCxDQUEwQnJELElBQTFCLENBQVA7QUFDSCxLQUZNLE1BRUEsSUFBSUEsSUFBSSxZQUFZdEIsbUNBQWlCNEUseUJBQXJDLEVBQWdFO0FBQ25FLGFBQU8sS0FBS0MsdUJBQUwsQ0FBNkJ2RCxJQUE3QixDQUFQO0FBQ0gsS0FGTSxNQUVBLElBQUlBLElBQUksWUFBWXRCLG1DQUFpQjhFLHFCQUFyQyxFQUE0RDtBQUMvRCxhQUFPLEtBQUtDLG1CQUFMLENBQXlCekQsSUFBekIsQ0FBUDtBQUNILEtBRk0sTUFFQSxJQUFJQSxJQUFJLFlBQVl0QixtQ0FBaUJnRixtQkFBckMsRUFBMEQ7QUFDN0QsYUFBTyxLQUFLQyxpQkFBTCxDQUF1QjNELElBQXZCLENBQVA7QUFDSCxLQUZNLE1BRUEsSUFBSUEsSUFBSSxZQUFZdEIsbUNBQWlCa0Ysd0JBQXJDLEVBQStEO0FBQ2xFLGFBQU8sS0FBS0Msc0JBQUwsQ0FBNEI3RCxJQUE1QixDQUFQO0FBQ0gsS0FGTSxNQUVBLElBQUlBLElBQUksWUFBWXRCLG1DQUFpQm9GLDBCQUFyQyxFQUFpRTtBQUNwRSxhQUFPLEtBQUtDLHdCQUFMLENBQThCL0QsSUFBOUIsQ0FBUDtBQUNILEtBRk0sTUFFQTtBQUNILFdBQUtVLGlCQUFMLENBQXVCLEtBQUt4QyxXQUFMLENBQWlCOEIsSUFBakIsQ0FBdkI7QUFDSDtBQUNKOztBQUVENEIsRUFBQUEsb0JBQW9CLENBQUMvRCxHQUFELEVBQXdCO0FBQ3hDLFNBQUtELEdBQUwsQ0FBU0MsR0FBVCxFQUFjZ0QsZUFBTS9DLEtBQU4sRUFBZDtBQUNBLFNBQUs2QyxVQUFMLENBQWdCOUMsR0FBaEIsRUFBcUJhLG1DQUFpQmlELHNCQUF0QztBQUNBLFVBQU0sSUFBSWxCLFNBQUosQ0FBYyxpQkFBZCxDQUFOO0FBQ0g7O0FBRURxQixFQUFBQSxvQkFBb0IsQ0FBQ2pFLEdBQUQsRUFBd0I7QUFDeEMsU0FBS0QsR0FBTCxDQUFTQyxHQUFULEVBQWNnRCxlQUFNL0MsS0FBTixFQUFkO0FBQ0EsU0FBSzZDLFVBQUwsQ0FBZ0I5QyxHQUFoQixFQUFxQmEsbUNBQWlCbUQsc0JBQXRDO0FBQ0EsVUFBTSxJQUFJcEIsU0FBSixDQUFjLGlCQUFkLENBQU47QUFDSDs7QUFFRDhCLEVBQUFBLHVCQUF1QixDQUFDMUUsR0FBRCxFQUF3QjtBQUMzQyxTQUFLRCxHQUFMLENBQVNDLEdBQVQsRUFBY2dELGVBQU0vQyxLQUFOLEVBQWQ7QUFDQSxTQUFLNkMsVUFBTCxDQUFnQjlDLEdBQWhCLEVBQXFCYSxtQ0FBaUI0RCx5QkFBdEM7QUFDQSxVQUFNLElBQUk3QixTQUFKLENBQWMsaUJBQWQsQ0FBTjtBQUNIO0FBRUQ7Ozs7Ozs7QUFLQWUsRUFBQUEsVUFBVSxDQUFDM0QsR0FBRCxFQUFtQztBQUN6QyxTQUFLRCxHQUFMLENBQVNDLEdBQVQsRUFBY2dELGVBQU0vQyxLQUFOLEVBQWQ7QUFDQSxTQUFLNkMsVUFBTCxDQUFnQjlDLEdBQWhCLEVBQXFCYSxtQ0FBaUI2QyxZQUF0QztBQUNBLFVBQU15QyxJQUFJLEdBQUcsRUFBYjs7QUFDQSxTQUFLLElBQUk1RSxDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHdkIsR0FBRyxDQUFDRyxhQUFKLEtBQXNCLENBQTFDLEVBQTZDLEVBQUVvQixDQUEvQyxFQUFrRDtBQUM5QyxZQUFNWSxJQUFpQixHQUFHbkMsR0FBRyxDQUFDeUIsUUFBSixDQUFhRixDQUFiLENBQTFCOztBQUNBLFVBQUlZLElBQUksWUFBWXRCLG1DQUFpQnVGLG9CQUFyQyxFQUEyRDtBQUN2RCxjQUFNQyxhQUFhLEdBQUcsS0FBS0Msa0JBQUwsQ0FBd0JuRSxJQUF4QixDQUF0Qjs7QUFDQSxhQUFLLE1BQU1KLEtBQVgsSUFBb0JzRSxhQUFwQixFQUFtQztBQUMvQkYsVUFBQUEsSUFBSSxDQUFDM0YsSUFBTCxDQUFVNkYsYUFBYSxDQUFDdEUsS0FBRCxDQUF2QjtBQUNIO0FBQ0osT0FMRCxNQUtPO0FBQ0gsYUFBS2MsaUJBQUwsQ0FBdUIsS0FBS3hDLFdBQUwsQ0FBaUI4QixJQUFqQixDQUF2QjtBQUNIO0FBQ0o7O0FBQ0QsV0FBTyxLQUFLRCxRQUFMLENBQWMsSUFBSXFFLHFCQUFKLENBQW1CSixJQUFuQixDQUFkLEVBQXdDLEtBQUt0RSxRQUFMLENBQWMsS0FBS1MsVUFBTCxDQUFnQnRDLEdBQUcsQ0FBQ3VELGlCQUFKLEVBQWhCLENBQWQsQ0FBeEMsQ0FBUDtBQUNIO0FBRUQ7Ozs7Ozs7OztBQU9BK0MsRUFBQUEsa0JBQWtCLENBQUN0RyxHQUFELEVBQW1CO0FBQ2pDLFNBQUtELEdBQUwsQ0FBU0MsR0FBVCxFQUFjZ0QsZUFBTS9DLEtBQU4sRUFBZDtBQUNBLFNBQUs2QyxVQUFMLENBQWdCOUMsR0FBaEIsRUFBcUJhLG1DQUFpQnVGLG9CQUF0QztBQUNBLFVBQU0vRSxLQUFLLEdBQUcsS0FBS21GLGFBQUwsQ0FBbUJ4RyxHQUFuQixDQUFkO0FBQ0EsVUFBTW1HLElBQUksR0FBRyxFQUFiOztBQUNBLFNBQUssTUFBTWhFLElBQVgsSUFBbUJkLEtBQW5CLEVBQTBCO0FBQ3RCLFVBQUljLElBQUksWUFBWXRCLG1DQUFpQnVDLGdCQUFyQyxFQUF1RDtBQUNuRCtDLFFBQUFBLElBQUksQ0FBQzNGLElBQUwsQ0FBVSxLQUFLOEMsY0FBTCxDQUFvQm5CLElBQXBCLENBQVY7QUFDSCxPQUZELE1BRU87QUFDSCxhQUFLTyxjQUFMLENBQW9CL0UsUUFBcEI7QUFDSDtBQUNKOztBQUNELFdBQU93SSxJQUFQO0FBQ0g7O0FBRUR0QyxFQUFBQSxzQkFBc0IsQ0FBQzdELEdBQUQsRUFBd0M7QUFDMUQsU0FBS0QsR0FBTCxDQUFTQyxHQUFULEVBQWNnRCxlQUFNL0MsS0FBTixFQUFkO0FBQ0EsU0FBSzZDLFVBQUwsQ0FBZ0I5QyxHQUFoQixFQUFxQmEsbUNBQWlCK0Msd0JBQXRDO0FBQ0EsVUFBTXpCLElBQUksR0FBRyxLQUFLc0UsbUJBQUwsQ0FBeUJ6RyxHQUF6QixFQUE4QmEsbUNBQWlCNkYsOEJBQS9DLENBQWI7QUFDQSxXQUFPLEtBQUtDLDRCQUFMLENBQWtDeEUsSUFBbEMsQ0FBUDtBQUNIO0FBRUQ7Ozs7Ozs7Ozs7OztBQVVRc0UsRUFBQUEsbUJBQVIsQ0FBNEJ6RyxHQUE1QixFQUE4Q3JDLElBQTlDLEVBQXlEb0UsS0FBSyxHQUFHLENBQWpFLEVBQXlFO0FBQ3JFLFdBQU8vQixHQUFHLENBQUN5RyxtQkFBSixDQUF3QjlJLElBQXhCLEVBQThCb0UsS0FBOUIsQ0FBUDtBQUNIO0FBRUQ7Ozs7Ozs7Ozs7QUFRQTRFLEVBQUFBLDRCQUE0QixDQUFDM0csR0FBRCxFQUF3QztBQUNoRSxTQUFLRCxHQUFMLENBQVNDLEdBQVQsRUFBY2dELGVBQU0vQyxLQUFOLEVBQWQ7QUFDQSxTQUFLNkMsVUFBTCxDQUFnQjlDLEdBQWhCLEVBQXFCYSxtQ0FBaUI2Riw4QkFBdEM7QUFDQSxVQUFNRSxrQkFBa0IsR0FBRyxLQUFLSCxtQkFBTCxDQUF5QnpHLEdBQXpCLEVBQThCYSxtQ0FBaUJnRyxrQkFBL0MsRUFBbUUsQ0FBbkUsQ0FBM0I7QUFDQSxVQUFNQyxXQUFXLEdBQUdGLGtCQUFrQixDQUFDeEcsT0FBbkIsRUFBcEI7QUFDQSxVQUFNMkcsWUFBa0MsR0FBRyxFQUEzQzs7QUFDQSxTQUFLLE1BQU01RSxJQUFYLElBQW1CLEtBQUtxRSxhQUFMLENBQW1CeEcsR0FBbkIsQ0FBbkIsRUFBNEM7QUFDeEMsVUFBSW1DLElBQUksWUFBWXRCLG1DQUFpQm1HLDBCQUFyQyxFQUFpRTtBQUM3REQsUUFBQUEsWUFBWSxDQUFDdkcsSUFBYixDQUFrQixLQUFLeUcsd0JBQUwsQ0FBOEI5RSxJQUE5QixDQUFsQjtBQUNIO0FBQ0o7O0FBQ0QsV0FBTyxJQUFJK0UsMEJBQUosQ0FBd0JILFlBQXhCLEVBQXNDRCxXQUF0QyxDQUFQO0FBQ0g7QUFFRDs7Ozs7OztBQU9BOzs7QUFDQUcsRUFBQUEsd0JBQXdCLENBQUNqSCxHQUFELEVBQXVDO0FBQzNELFNBQUtELEdBQUwsQ0FBU0MsR0FBVCxFQUFjZ0QsZUFBTS9DLEtBQU4sRUFBZDtBQUNBLFNBQUs2QyxVQUFMLENBQWdCOUMsR0FBaEIsRUFBcUJhLG1DQUFpQm1HLDBCQUF0QztBQUNBLFVBQU1HLGlCQUFpQixHQUFHLEtBQUtWLG1CQUFMLENBQXlCekcsR0FBekIsRUFBOEJhLG1DQUFpQnVHLGlCQUEvQyxFQUFrRSxDQUFsRSxDQUExQjtBQUNBLFVBQU1DLFVBQVUsR0FBRyxLQUFLQyxlQUFMLENBQXFCSCxpQkFBckIsQ0FBbkIsQ0FKMkQsQ0FLM0Q7O0FBQ0EsUUFBSUksSUFBSSxHQUFHLElBQVg7O0FBQ0EsUUFBSXZILEdBQUcsQ0FBQ0csYUFBSixNQUF1QixDQUEzQixFQUE4QjtBQUMxQm9ILE1BQUFBLElBQUksR0FBRyxLQUFLQyxnQkFBTCxDQUFzQnhILEdBQUcsQ0FBQ3lCLFFBQUosQ0FBYSxDQUFiLENBQXRCLENBQVA7QUFDSDs7QUFDRCxXQUFPLElBQUlnRyx5QkFBSixDQUF1QkosVUFBdkIsRUFBbUNFLElBQW5DLENBQVA7QUFDSCxHQTVXK0MsQ0E4V2hEOzs7QUFDQUcsRUFBQUEsZ0JBQWdCLENBQUMxSCxHQUFELEVBQW1FO0FBQy9FcEIsSUFBQUEsT0FBTyxDQUFDQyxJQUFSLENBQWEsNEJBQWIsRUFBMkNtQixHQUFHLENBQUNHLGFBQUosRUFBM0MsRUFBZ0VILEdBQUcsQ0FBQ0ksT0FBSixFQUFoRTtBQUNBLFNBQUswQyxVQUFMLENBQWdCOUMsR0FBaEIsRUFBcUJhLG1DQUFpQjhHLGtCQUF0QztBQUNBLFNBQUtDLGVBQUwsQ0FBcUI1SCxHQUFyQixFQUEwQixDQUExQjtBQUNBLFVBQU1tQyxJQUFpQixHQUFHbkMsR0FBRyxDQUFDeUIsUUFBSixDQUFhLENBQWIsQ0FBMUI7O0FBRUEsUUFBSVUsSUFBSSxZQUFZdEIsbUNBQWlCZ0gsOEJBQXJDLEVBQXFFO0FBQ2pFLGFBQU8sS0FBS0MsNEJBQUwsQ0FBa0MzRixJQUFsQyxDQUFQO0FBQ0gsS0FGRCxNQUVPLElBQUlBLElBQUksWUFBWXRCLG1DQUFpQmtILDZCQUFyQyxFQUFvRTtBQUN2RSxhQUFPLEtBQUtDLDJCQUFMLENBQWlDN0YsSUFBakMsQ0FBUDtBQUNIOztBQUNELFNBQUtVLGlCQUFMLENBQXVCLEtBQUt4QyxXQUFMLENBQWlCOEIsSUFBakIsQ0FBdkI7QUFDSCxHQTNYK0MsQ0E2WGhEOzs7QUFDQThGLEVBQUFBLG1CQUFtQixDQUFDakksR0FBRCxFQUFtQjtBQUNsQyxTQUFLRCxHQUFMLENBQVNDLEdBQVQsRUFBY2dELGVBQU0vQyxLQUFOLEVBQWQ7QUFDSDs7QUFFTzJILEVBQUFBLGVBQVIsQ0FBd0I1SCxHQUF4QixFQUEwQ2tJLEtBQTFDLEVBQXlEO0FBQ3JELFFBQUlsSSxHQUFHLENBQUNHLGFBQUosTUFBdUIrSCxLQUEzQixFQUFrQztBQUM5QixZQUFNLElBQUloSixLQUFKLENBQVUsa0NBQWtDZ0osS0FBbEMsR0FBMEMsVUFBMUMsR0FBdURsSSxHQUFHLENBQUNHLGFBQUosRUFBakUsQ0FBTjtBQUNIO0FBQ0o7QUFFRDs7Ozs7Ozs7OztBQVFBbUUsRUFBQUEsd0JBQXdCLENBQUN0RSxHQUFELEVBQW9EO0FBQ3hFcEIsSUFBQUEsT0FBTyxDQUFDQyxJQUFSLENBQWEsb0NBQWIsRUFBbURtQixHQUFHLENBQUNHLGFBQUosRUFBbkQsRUFBd0VILEdBQUcsQ0FBQ0ksT0FBSixFQUF4RTtBQUNBLFNBQUswQyxVQUFMLENBQWdCOUMsR0FBaEIsRUFBcUJhLG1DQUFpQndELDBCQUF0QyxFQUZ3RSxDQUd4RTs7QUFDQSxVQUFNbEMsSUFBaUIsR0FBR25DLEdBQUcsQ0FBQ3lCLFFBQUosQ0FBYSxDQUFiLENBQTFCLENBSndFLENBSTdCOztBQUMzQyxRQUFJMEcsR0FBSjs7QUFDQSxRQUFJaEcsSUFBSSxZQUFZdEIsbUNBQWlCdUgseUJBQXJDLEVBQWdFO0FBQzVERCxNQUFBQSxHQUFHLEdBQUcsS0FBS0UsdUJBQUwsQ0FBNkJsRyxJQUE3QixDQUFOO0FBQ0gsS0FGRCxNQUVPO0FBQ0gsV0FBS1UsaUJBQUwsQ0FBdUIsS0FBS3hDLFdBQUwsQ0FBaUI4QixJQUFqQixDQUF2QjtBQUNIOztBQUVELFdBQU9nRyxHQUFQLENBWndFLENBWTdEO0FBQ2Q7QUFFRDs7Ozs7Ozs7QUFNQTNELEVBQUFBLGdCQUFnQixDQUFDeEUsR0FBRCxFQUFnQztBQUM1QyxTQUFLRCxHQUFMLENBQVNDLEdBQVQsRUFBY2dELGVBQU0vQyxLQUFOLEVBQWQ7QUFDQSxTQUFLNkMsVUFBTCxDQUFnQjlDLEdBQWhCLEVBQXFCYSxtQ0FBaUIwRCxrQkFBdEM7QUFDQSxVQUFNMkQsS0FBSyxHQUFHbEksR0FBRyxDQUFDRyxhQUFKLEVBQWQ7QUFDQSxVQUFNbUksSUFBSSxHQUFHLEtBQUtELHVCQUFMLENBQTZCckksR0FBRyxDQUFDeUIsUUFBSixDQUFhLENBQWIsQ0FBN0IsQ0FBYjtBQUNBLFVBQU04RyxVQUFVLEdBQUcsS0FBS2pGLGNBQUwsQ0FBb0J0RCxHQUFHLENBQUN5QixRQUFKLENBQWEsQ0FBYixDQUFwQixDQUFuQjtBQUNBLFVBQU0rRyxTQUFTLEdBQUdOLEtBQUssSUFBSSxDQUFULEdBQWEsS0FBSzVFLGNBQUwsQ0FBb0J0RCxHQUFHLENBQUN5QixRQUFKLENBQWEsQ0FBYixDQUFwQixDQUFiLEdBQW9EZ0gsU0FBdEU7QUFFQSxXQUFPLElBQUlDLGtCQUFKLENBQWdCSixJQUFoQixFQUFzQkMsVUFBdEIsRUFBa0NDLFNBQWxDLENBQVA7QUFDSCxHQTlhK0MsQ0FnYmhEOzs7QUFDQUcsRUFBQUEsZ0JBQWdCLENBQUMzSSxHQUFELEVBQW1CO0FBQy9CcEIsSUFBQUEsT0FBTyxDQUFDQyxJQUFSLENBQWEsdUJBQXVCbUIsR0FBRyxDQUFDSSxPQUFKLEVBQXBDO0FBQ0gsR0FuYitDLENBcWJoRDs7O0FBQ0F3SSxFQUFBQSxtQkFBbUIsQ0FBQzVJLEdBQUQsRUFBbUI7QUFDbENwQixJQUFBQSxPQUFPLENBQUNDLElBQVIsQ0FBYSwwQkFBMEJtQixHQUFHLENBQUNJLE9BQUosRUFBdkM7QUFDSCxHQXhiK0MsQ0EwYmhEOzs7QUFDQXlJLEVBQUFBLGlCQUFpQixDQUFDN0ksR0FBRCxFQUFtQjtBQUNoQ3BCLElBQUFBLE9BQU8sQ0FBQ0MsSUFBUixDQUFhLDBCQUEwQm1CLEdBQUcsQ0FBQ0ksT0FBSixFQUF2QztBQUNILEdBN2IrQyxDQStiaEQ7OztBQUNBMEksRUFBQUEsb0JBQW9CLENBQUM5SSxHQUFELEVBQW1CO0FBQ25DcEIsSUFBQUEsT0FBTyxDQUFDbUssS0FBUixDQUFjLGlCQUFkO0FBQ0gsR0FsYytDLENBb2NoRDs7O0FBQ0FDLEVBQUFBLG1CQUFtQixDQUFDaEosR0FBRCxFQUFtQjtBQUNsQ3BCLElBQUFBLE9BQU8sQ0FBQ21LLEtBQVIsQ0FBYyxpQkFBZDtBQUNILEdBdmMrQyxDQXljaEQ7OztBQUNBRSxFQUFBQSxzQkFBc0IsQ0FBQ2pKLEdBQUQsRUFBbUI7QUFDckNwQixJQUFBQSxPQUFPLENBQUNtSyxLQUFSLENBQWMsaUJBQWQ7QUFDSCxHQTVjK0MsQ0E4Y2hEOzs7QUFDQW5FLEVBQUFBLHNCQUFzQixDQUFDNUUsR0FBRCxFQUFtQjtBQUNyQ3BCLElBQUFBLE9BQU8sQ0FBQ21LLEtBQVIsQ0FBYyxpQkFBZDtBQUVILEdBbGQrQyxDQW9kaEQ7OztBQUNBakUsRUFBQUEsbUJBQW1CLENBQUM5RSxHQUFELEVBQW1CO0FBQ2xDcEIsSUFBQUEsT0FBTyxDQUFDbUssS0FBUixDQUFjLGlCQUFkO0FBRUgsR0F4ZCtDLENBMmRoRDs7O0FBQ0EvRCxFQUFBQSxvQkFBb0IsQ0FBQ2hGLEdBQUQsRUFBbUI7QUFDbkNwQixJQUFBQSxPQUFPLENBQUNtSyxLQUFSLENBQWMsaUJBQWQ7QUFFSCxHQS9kK0MsQ0FrZWhEOzs7QUFDQTNELEVBQUFBLGtCQUFrQixDQUFDcEYsR0FBRCxFQUFtQjtBQUNqQ3BCLElBQUFBLE9BQU8sQ0FBQ21LLEtBQVIsQ0FBYyxpQkFBZDtBQUVILEdBdGUrQyxDQXllaEQ7OztBQUNBdkQsRUFBQUEsb0JBQW9CLENBQUN4RixHQUFELEVBQW1CO0FBQ25DcEIsSUFBQUEsT0FBTyxDQUFDbUssS0FBUixDQUFjLGlCQUFkO0FBRUgsR0E3ZStDLENBZ2ZoRDs7O0FBQ0FHLEVBQUFBLGNBQWMsQ0FBQ2xKLEdBQUQsRUFBbUI7QUFDN0JwQixJQUFBQSxPQUFPLENBQUNtSyxLQUFSLENBQWMsaUJBQWQ7QUFFSCxHQXBmK0MsQ0F1ZmhEOzs7QUFDQUksRUFBQUEsZ0JBQWdCLENBQUNuSixHQUFELEVBQW1CO0FBQy9CcEIsSUFBQUEsT0FBTyxDQUFDbUssS0FBUixDQUFjLGlCQUFkO0FBRUgsR0EzZitDLENBOGZoRDs7O0FBQ0FLLEVBQUFBLGVBQWUsQ0FBQ3BKLEdBQUQsRUFBbUI7QUFDOUJwQixJQUFBQSxPQUFPLENBQUNtSyxLQUFSLENBQWMsaUJBQWQ7QUFFSCxHQWxnQitDLENBcWdCaEQ7OztBQUNBTSxFQUFBQSxrQkFBa0IsQ0FBQ3JKLEdBQUQsRUFBbUI7QUFDakNwQixJQUFBQSxPQUFPLENBQUNtSyxLQUFSLENBQWMsaUJBQWQ7QUFFSDtBQUVEOzs7Ozs7OztBQU1BekQsRUFBQUEsc0JBQXNCLENBQUN0RixHQUFELEVBQXFDO0FBQ3ZELFNBQUtELEdBQUwsQ0FBU0MsR0FBVCxFQUFjZ0QsZUFBTS9DLEtBQU4sRUFBZDtBQUNBLFNBQUs2QyxVQUFMLENBQWdCOUMsR0FBaEIsRUFBcUJhLG1DQUFpQndFLHdCQUF0QztBQUNBLFVBQU1pRSxVQUFVLEdBQUcsS0FBS0MsZUFBTCxDQUFxQnZKLEdBQUcsQ0FBQ3lCLFFBQUosQ0FBYSxDQUFiLENBQXJCLENBQW5CO0FBQ0EsVUFBTTRCLFNBQVMsR0FBRyxLQUFLQyxjQUFMLENBQW9CdEQsR0FBRyxDQUFDeUIsUUFBSixDQUFhLENBQWIsQ0FBcEIsQ0FBbEI7QUFDQSxXQUFPLElBQUkrSCx1QkFBSixDQUFxQkYsVUFBckIsRUFBaUNqRyxTQUFqQyxDQUFQO0FBQ0gsR0F2aEIrQyxDQTBoQmhEOzs7QUFDQXVDLEVBQUFBLG1CQUFtQixDQUFDNUYsR0FBRCxFQUFtQjtBQUNsQ3BCLElBQUFBLE9BQU8sQ0FBQ21LLEtBQVIsQ0FBYyxpQkFBZDtBQUNILEdBN2hCK0MsQ0FnaUJoRDs7O0FBQ0FqRCxFQUFBQSxpQkFBaUIsQ0FBQzlGLEdBQUQsRUFBbUI7QUFDaENwQixJQUFBQSxPQUFPLENBQUNtSyxLQUFSLENBQWMsaUJBQWQ7QUFFSCxHQXBpQitDLENBdWlCaEQ7OztBQUNBVSxFQUFBQSxvQkFBb0IsQ0FBQ3pKLEdBQUQsRUFBbUI7QUFDbkNwQixJQUFBQSxPQUFPLENBQUNtSyxLQUFSLENBQWMsaUJBQWQ7QUFFSCxHQTNpQitDLENBOGlCaEQ7OztBQUNBVyxFQUFBQSxzQkFBc0IsQ0FBQzFKLEdBQUQsRUFBbUI7QUFDckNwQixJQUFBQSxPQUFPLENBQUNtSyxLQUFSLENBQWMsaUJBQWQ7QUFFSCxHQWxqQitDLENBb2pCaEQ7OztBQUNBL0MsRUFBQUEsc0JBQXNCLENBQUNoRyxHQUFELEVBQW1CO0FBQ3JDcEIsSUFBQUEsT0FBTyxDQUFDbUssS0FBUixDQUFjLGlCQUFkO0FBRUgsR0F4akIrQyxDQTBqQmhEOzs7QUFDQTdDLEVBQUFBLHdCQUF3QixDQUFDbEcsR0FBRCxFQUFtRTtBQUN2RixTQUFLRCxHQUFMLENBQVNDLEdBQVQsRUFBY2dELGVBQU0vQyxLQUFOLEVBQWQ7QUFDQSxTQUFLNkMsVUFBTCxDQUFnQjlDLEdBQWhCLEVBQXFCYSxtQ0FBaUJvRiwwQkFBdEM7QUFDQSxRQUFJMEQsS0FBSyxHQUFHLEtBQVo7QUFDQSxRQUFJQyxTQUFTLEdBQUcsS0FBaEI7QUFDQSxRQUFJTixVQUFKO0FBQ0EsUUFBSU8sTUFBSjtBQUNBLFFBQUkxRCxJQUFKOztBQUVBLFNBQUssSUFBSTVFLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUd2QixHQUFHLENBQUNHLGFBQUosRUFBcEIsRUFBeUMsRUFBRW9CLENBQTNDLEVBQThDO0FBQzFDLFlBQU1ZLElBQUksR0FBR25DLEdBQUcsQ0FBQ3lCLFFBQUosQ0FBYUYsQ0FBYixDQUFiOztBQUNBLFVBQUlZLElBQUksQ0FBQzJILE1BQVQsRUFBaUI7QUFDYixjQUFNQyxHQUFHLEdBQUc1SCxJQUFJLENBQUMvQixPQUFMLEVBQVo7O0FBQ0EsWUFBSTJKLEdBQUcsSUFBSSxPQUFYLEVBQW9CO0FBQ2hCSixVQUFBQSxLQUFLLEdBQUcsSUFBUjtBQUNILFNBRkQsTUFFTyxJQUFJSSxHQUFHLElBQUksR0FBWCxFQUFnQjtBQUNuQkgsVUFBQUEsU0FBUyxHQUFHLElBQVo7QUFDSDtBQUNKOztBQUVELFVBQUl6SCxJQUFJLFlBQVl0QixtQ0FBaUJtSixpQkFBckMsRUFBd0Q7QUFDcERwTCxRQUFBQSxPQUFPLENBQUNDLElBQVIsQ0FBYSx1Q0FBYjtBQUNBeUssUUFBQUEsVUFBVSxHQUFHLEtBQUtDLGVBQUwsQ0FBcUJwSCxJQUFyQixDQUFiO0FBQ0gsT0FIRCxNQUdPLElBQUlBLElBQUksWUFBWXRCLG1DQUFpQm9KLDBCQUFyQyxFQUFpRTtBQUNwRXJMLFFBQUFBLE9BQU8sQ0FBQ0MsSUFBUixDQUFhLGdEQUFiO0FBQ0FnTCxRQUFBQSxNQUFNLEdBQUcsS0FBS0ssd0JBQUwsQ0FBOEIvSCxJQUE5QixDQUFUO0FBQ0gsT0FITSxNQUdBLElBQUlBLElBQUksWUFBWXRCLG1DQUFpQnNKLG1CQUFyQyxFQUEwRDtBQUM3RDtBQUNBdkwsUUFBQUEsT0FBTyxDQUFDQyxJQUFSLENBQWEsZ0RBQWI7QUFDSDs7QUFFRCxXQUFLb0Msc0JBQUwsQ0FBNEJrQixJQUE1QjtBQUNIOztBQUVEdkQsSUFBQUEsT0FBTyxDQUFDQyxJQUFSLENBQWEsY0FBYzhLLEtBQTNCO0FBQ0EvSyxJQUFBQSxPQUFPLENBQUNDLElBQVIsQ0FBYSxrQkFBa0IrSyxTQUEvQjs7QUFFQSxRQUFJRCxLQUFKLEVBQVc7QUFDUCxhQUFPLElBQUlTLCtCQUFKLENBQTZCZCxVQUE3QixFQUF5Q08sTUFBekMsRUFBaUQxRCxJQUFqRCxFQUF1RHlELFNBQXZELENBQVA7QUFDSCxLQUZELE1BRU87QUFDSDtBQUNBLGFBQU8sSUFBSVMsMEJBQUosQ0FBd0JmLFVBQXhCLEVBQW9DZ0IsTUFBcEMsRUFBNENuRSxJQUE1QyxFQUFrRHlELFNBQWxELENBQVA7QUFDSDtBQUNKLEdBdG1CK0MsQ0F3bUJoRDs7O0FBQ0FXLEVBQUFBLGlCQUFpQixDQUFDdkssR0FBRCxFQUF3QztBQUNyRCxTQUFLRCxHQUFMLENBQVNDLEdBQVQsRUFBY2dELGVBQU0vQyxLQUFOLEVBQWQ7QUFDQSxTQUFLNkMsVUFBTCxDQUFnQjlDLEdBQWhCLEVBQXFCYSxtQ0FBaUIySixtQkFBdEM7QUFDQSxXQUFPLEtBQUt0RSx3QkFBTCxDQUE4QmxHLEdBQUcsQ0FBQ3lCLFFBQUosQ0FBYSxDQUFiLENBQTlCLENBQVA7QUFDSDtBQUVEOzs7Ozs7Ozs7O0FBUUFnSixFQUFBQSxpQkFBaUIsQ0FBQ3pLLEdBQUQsRUFBbUI7QUFDaEMsU0FBS0QsR0FBTCxDQUFTQyxHQUFULEVBQWNnRCxlQUFNL0MsS0FBTixFQUFkO0FBQ0EsU0FBSzZDLFVBQUwsQ0FBZ0I5QyxHQUFoQixFQUFxQmEsbUNBQWlCc0osbUJBQXRDO0FBQ0EsVUFBTU8scUJBQXFCLEdBQUcsS0FBS2pFLG1CQUFMLENBQXlCekcsR0FBekIsRUFBOEJhLG1DQUFpQjhKLHFCQUEvQyxDQUE5Qjs7QUFDQSxRQUFJRCxxQkFBcUIsSUFBSSxJQUE3QixFQUFtQztBQUMvQixZQUFNckgsU0FBUyxHQUFHLEtBQUt1SCxtQkFBTCxDQUF5QkYscUJBQXpCLENBQWxCO0FBQ0EsYUFBT3JILFNBQVA7QUFDSDs7QUFDRCxVQUFNLElBQUluRSxLQUFKLENBQVUsaUJBQVYsQ0FBTjtBQUNIO0FBRUQ7Ozs7Ozs7O0FBTUEwTCxFQUFBQSxtQkFBbUIsQ0FBQzVLLEdBQUQsRUFBMEI7QUFDekMsU0FBS0QsR0FBTCxDQUFTQyxHQUFULEVBQWNnRCxlQUFNL0MsS0FBTixFQUFkO0FBQ0EsU0FBSzZDLFVBQUwsQ0FBZ0I5QyxHQUFoQixFQUFxQmEsbUNBQWlCOEoscUJBQXRDO0FBQ0EsVUFBTXpILFVBQVUsR0FBRyxFQUFuQjs7QUFDQSxTQUFLLE1BQU1mLElBQVgsSUFBbUJuQyxHQUFHLENBQUM2SyxhQUFKLEVBQW5CLEVBQXdDO0FBQ3BDLFlBQU14SCxTQUFTLEdBQUcsS0FBS0MsY0FBTCxDQUFvQm5CLElBQUksQ0FBQ2tCLFNBQUwsRUFBcEIsQ0FBbEI7QUFDQXpFLE1BQUFBLE9BQU8sQ0FBQ0MsSUFBUixDQUFhd0UsU0FBYjtBQUNBSCxNQUFBQSxVQUFVLENBQUMxQyxJQUFYLENBQWdCNkMsU0FBaEI7QUFDSDs7QUFDRCxXQUFPSCxVQUFQO0FBQ0g7QUFHRDs7Ozs7Ozs7O0FBT0E0SCxFQUFBQSxpQkFBaUIsQ0FBQzlLLEdBQUQsRUFBb0M7QUFDakQsU0FBS0QsR0FBTCxDQUFTQyxHQUFULEVBQWNnRCxlQUFNL0MsS0FBTixFQUFkO0FBQ0EsU0FBSzZDLFVBQUwsQ0FBZ0I5QyxHQUFoQixFQUFxQmEsbUNBQWlCa0ssbUJBQXRDO0FBQ0EsVUFBTUMsa0JBQWtCLEdBQUcsS0FBS3ZFLG1CQUFMLENBQXlCekcsR0FBekIsRUFBOEJhLG1DQUFpQm9LLGtCQUEvQyxDQUEzQjtBQUNBLFVBQU1DLFFBQWtDLEdBQUcsS0FBS0MsZ0JBQUwsQ0FBc0JILGtCQUF0QixDQUEzQztBQUNBLFdBQU8sSUFBSUksc0JBQUosQ0FBb0JGLFFBQXBCLENBQVA7QUFDSDtBQUVEOzs7Ozs7Ozs7O0FBUUFDLEVBQUFBLGdCQUFnQixDQUFDbkwsR0FBRCxFQUE2QztBQUN6RCxTQUFLRCxHQUFMLENBQVNDLEdBQVQsRUFBY2dELGVBQU0vQyxLQUFOLEVBQWQ7QUFDQSxTQUFLNkMsVUFBTCxDQUFnQjlDLEdBQWhCLEVBQXFCYSxtQ0FBaUJvSyxrQkFBdEM7QUFDQSxVQUFNQyxRQUFrQyxHQUFHLEVBQTNDOztBQUNBLFNBQUssTUFBTS9JLElBQVgsSUFBbUIsS0FBS2tKLFFBQUwsQ0FBY3JMLEdBQWQsQ0FBbkIsRUFBdUM7QUFDbkM7QUFDQSxVQUFJbUMsSUFBSSxDQUFDMkgsTUFBTCxJQUFlLElBQW5CLEVBQXlCO0FBQ3JCO0FBQ0FvQixRQUFBQSxRQUFRLENBQUMxSyxJQUFULENBQWMsSUFBZDtBQUNILE9BSEQsTUFHTztBQUNIMEssUUFBQUEsUUFBUSxDQUFDMUssSUFBVCxDQUFjLEtBQUs4SyxpQkFBTCxDQUF1Qm5KLElBQXZCLENBQWQ7QUFDSDtBQUNKOztBQUNELFdBQU8rSSxRQUFQO0FBQ0g7O0FBRU9HLEVBQUFBLFFBQVIsQ0FBaUJyTCxHQUFqQixFQUFtQztBQUMvQixVQUFNcUIsS0FBSyxHQUFHLEVBQWQ7O0FBQ0EsU0FBSyxJQUFJRSxDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHdkIsR0FBRyxDQUFDRyxhQUFKLEVBQXBCLEVBQXlDLEVBQUVvQixDQUEzQyxFQUE4QztBQUMxQ0YsTUFBQUEsS0FBSyxDQUFDYixJQUFOLENBQVdSLEdBQUcsQ0FBQ3lCLFFBQUosQ0FBYUYsQ0FBYixDQUFYO0FBQ0g7O0FBQ0QsV0FBT0YsS0FBUDtBQUNIO0FBRUQ7Ozs7Ozs7Ozs7QUFRQWlLLEVBQUFBLGlCQUFpQixDQUFDdEwsR0FBRCxFQUEyQztBQUN4RCxTQUFLRCxHQUFMLENBQVNDLEdBQVQsRUFBY2dELGVBQU0vQyxLQUFOLEVBQWQ7QUFDQSxTQUFLNkMsVUFBTCxDQUFnQjlDLEdBQWhCLEVBQXFCYSxtQ0FBaUIwSyxtQkFBdEM7O0FBRUEsUUFBSXZMLEdBQUcsQ0FBQ0csYUFBSixNQUF1QixDQUEzQixFQUE4QjtBQUMxQixhQUFPLEtBQUtxSCxnQkFBTCxDQUFzQnhILEdBQUcsQ0FBQ3lCLFFBQUosQ0FBYSxDQUFiLENBQXRCLENBQVA7QUFDSCxLQUZELE1BRU87QUFDSCxZQUFNK0osVUFBVSxHQUFHLEtBQUtoRSxnQkFBTCxDQUFzQnhILEdBQUcsQ0FBQ3lCLFFBQUosQ0FBYSxDQUFiLENBQXRCLENBQW5CO0FBQ0EsYUFBTyxJQUFJZ0ssb0JBQUosQ0FBa0JELFVBQWxCLENBQVA7QUFDSDtBQUNKO0FBRUQ7Ozs7Ozs7OztBQU9BRSxFQUFBQSxrQkFBa0IsQ0FBQzFMLEdBQUQsRUFBcUM7QUFDbkQsU0FBS0QsR0FBTCxDQUFTQyxHQUFULEVBQWNnRCxlQUFNL0MsS0FBTixFQUFkO0FBQ0EsU0FBSzZDLFVBQUwsQ0FBZ0I5QyxHQUFoQixFQUFxQmEsbUNBQWlCOEssb0JBQXRDOztBQUNBLFFBQUkzTCxHQUFHLENBQUNHLGFBQUosTUFBdUIsQ0FBM0IsRUFBOEI7QUFDMUIsYUFBTyxJQUFJeUwsdUJBQUosQ0FBcUIsRUFBckIsQ0FBUDtBQUNIOztBQUVELFVBQU12SyxLQUFLLEdBQUcsS0FBS21GLGFBQUwsQ0FBbUJ4RyxHQUFuQixDQUFkO0FBQ0EsVUFBTTZMLFVBQXNDLEdBQUcsRUFBL0M7O0FBQ0EsU0FBSyxNQUFNMUosSUFBWCxJQUFtQmQsS0FBbkIsRUFBMEI7QUFDdEIsVUFBSXlLLFFBQUo7O0FBQ0EsVUFBSTNKLElBQUksWUFBWXRCLG1DQUFpQmtMLG1DQUFyQyxFQUEwRTtBQUN0RUQsUUFBQUEsUUFBUSxHQUFHLEtBQUtFLGlDQUFMLENBQXVDN0osSUFBdkMsQ0FBWDtBQUNILE9BRkQsTUFFTyxJQUFJQSxJQUFJLFlBQVl0QixtQ0FBaUJvTCx3QkFBckMsRUFBK0Q7QUFDbEVILFFBQUFBLFFBQVEsR0FBRyxLQUFLSSxzQkFBTCxDQUE0Qi9KLElBQTVCLENBQVg7QUFDSCxPQUZNLE1BRUEsSUFBSUEsSUFBSSxZQUFZdEIsbUNBQWlCc0wsdUJBQXJDLEVBQThEO0FBQ2pFTCxRQUFBQSxRQUFRLEdBQUcsS0FBS00scUJBQUwsQ0FBMkJqSyxJQUEzQixDQUFYO0FBQ0gsT0FGTSxNQUVBO0FBQ0gsYUFBS1UsaUJBQUwsQ0FBdUIsS0FBS3hDLFdBQUwsQ0FBaUI4QixJQUFqQixDQUF2QjtBQUNIOztBQUVELFVBQUkySixRQUFRLElBQUlyRCxTQUFoQixFQUEyQjtBQUN2Qm9ELFFBQUFBLFVBQVUsQ0FBQ3JMLElBQVgsQ0FBZ0JzTCxRQUFoQjtBQUNIO0FBQ0o7O0FBQ0QsV0FBTyxJQUFJRix1QkFBSixDQUFxQkMsVUFBckIsQ0FBUDtBQUNIO0FBRUQ7Ozs7Ozs7QUFLQUssRUFBQUEsc0JBQXNCLENBQUNsTSxHQUFELEVBQTZDO0FBQy9ELFNBQUtELEdBQUwsQ0FBU0MsR0FBVCxFQUFjZ0QsZUFBTS9DLEtBQU4sRUFBZDtBQUNBLFNBQUs2QyxVQUFMLENBQWdCOUMsR0FBaEIsRUFBcUJhLG1DQUFpQm9MLHdCQUF0QztBQUNBLFVBQU1JLFFBQVEsR0FBRyxLQUFqQjtBQUNBLFVBQU1DLE1BQU0sR0FBRyxLQUFmO0FBQ0EsVUFBTUMsU0FBUyxHQUFHLElBQWxCO0FBQ0EsVUFBTTNPLEtBQUssR0FBRyxLQUFLNEosZ0JBQUwsQ0FBc0J4SCxHQUFHLENBQUN5QixRQUFKLENBQWEsQ0FBYixDQUF0QixDQUFkO0FBQ0EsVUFBTS9CLEdBQWdCLEdBQUcsSUFBSThNLGlCQUFKLENBQWV4TSxHQUFHLENBQUNJLE9BQUosRUFBZixDQUF6QjtBQUNBLFdBQU8sSUFBSXFNLGVBQUosQ0FBYSxNQUFiLEVBQXFCL00sR0FBckIsRUFBMEIyTSxRQUExQixFQUFvQ3pPLEtBQXBDLEVBQTJDME8sTUFBM0MsRUFBbURDLFNBQW5ELENBQVA7QUFDSCxHQXp3QitDLENBMndCaEQ7OztBQUNBSCxFQUFBQSxxQkFBcUIsQ0FBQ3BNLEdBQUQsRUFBNkM7QUFDOUQsU0FBS0QsR0FBTCxDQUFTQyxHQUFULEVBQWNnRCxlQUFNL0MsS0FBTixFQUFkO0FBQ0EsU0FBSzZDLFVBQUwsQ0FBZ0I5QyxHQUFoQixFQUFxQmEsbUNBQWlCc0wsdUJBQXRDO0FBQ0EsVUFBTSxJQUFJdkosU0FBSixDQUFjLGlCQUFkLENBQU47QUFDSDtBQUVEOzs7Ozs7QUFJUTRELEVBQUFBLGFBQVIsQ0FBc0J4RyxHQUF0QixFQUF1RDtBQUNuRCxVQUFNME0sUUFBdUIsR0FBRyxFQUFoQzs7QUFDQSxTQUFLLElBQUluTCxDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHdkIsR0FBRyxDQUFDRyxhQUFKLEVBQXBCLEVBQXlDLEVBQUVvQixDQUEzQyxFQUE4QztBQUMxQyxZQUFNWSxJQUFJLEdBQUduQyxHQUFHLENBQUN5QixRQUFKLENBQWFGLENBQWIsQ0FBYixDQUQwQyxDQUUxQzs7QUFDQSxVQUFJWSxJQUFJLENBQUMySCxNQUFMLElBQWVyQixTQUFuQixFQUE4QjtBQUMxQjtBQUNIOztBQUNEaUUsTUFBQUEsUUFBUSxDQUFDbE0sSUFBVCxDQUFjMkIsSUFBZDtBQUNIOztBQUNELFdBQU91SyxRQUFQO0FBQ0g7QUFFRDs7Ozs7Ozs7Ozs7OztBQVdBVixFQUFBQSxpQ0FBaUMsQ0FBQ2hNLEdBQUQsRUFBNkM7QUFDMUUsU0FBS0QsR0FBTCxDQUFTQyxHQUFULEVBQWNnRCxlQUFNL0MsS0FBTixFQUFkO0FBQ0EsU0FBSzZDLFVBQUwsQ0FBZ0I5QyxHQUFoQixFQUFxQmEsbUNBQWlCa0wsbUNBQXRDO0FBRUEsUUFBSTVKLElBQUksR0FBR25DLEdBQUcsQ0FBQ3lCLFFBQUosQ0FBYSxDQUFiLENBQVg7QUFFQSxTQUFLUixzQkFBTCxDQUE0QmpCLEdBQTVCO0FBQ0EsUUFBSTJNLEVBQUUsR0FBRzNNLEdBQUcsQ0FBQ3lCLFFBQUosQ0FBYSxDQUFiLENBQVQsQ0FQMEUsQ0FPaEQ7O0FBQzFCLFFBQUltTCxFQUFFLEdBQUc1TSxHQUFHLENBQUN5QixRQUFKLENBQWEsQ0FBYixDQUFULENBUjBFLENBUWhEOztBQUMxQixRQUFJb0wsRUFBRSxHQUFHN00sR0FBRyxDQUFDeUIsUUFBSixDQUFhLENBQWIsQ0FBVCxDQVQwRSxDQVNoRDs7QUFDMUIsUUFBSS9CLEdBQWdCLEdBQUcsS0FBS29OLGlCQUFMLENBQXVCSCxFQUF2QixDQUF2QjtBQUNBLFFBQUkvTyxLQUFKO0FBQ0EsVUFBTXlPLFFBQVEsR0FBRyxLQUFqQjtBQUNBLFVBQU1DLE1BQU0sR0FBRyxLQUFmO0FBQ0EsVUFBTUMsU0FBUyxHQUFHLEtBQWxCOztBQUVBLFFBQUlNLEVBQUUsWUFBWWhNLG1DQUFpQmtMLG1DQUFuQyxFQUF3RTtBQUNwRW5OLE1BQUFBLE9BQU8sQ0FBQ0MsSUFBUixDQUFhLHlDQUFiO0FBQ0FhLE1BQUFBLEdBQUcsR0FBRyxLQUFLb04saUJBQUwsQ0FBdUJILEVBQXZCLENBQU47QUFDSCxLQUhELE1BR08sSUFBSUUsRUFBRSxZQUFZaE0sbUNBQWlCa00sMkNBQW5DLEVBQWdGO0FBQ25Gbk8sTUFBQUEsT0FBTyxDQUFDQyxJQUFSLENBQWEsaURBQWI7QUFDSCxLQUZNLE1BRUEsSUFBSWdPLEVBQUUsWUFBWWhNLG1DQUFpQnNMLHVCQUFuQyxFQUE0RDtBQUMvRHZOLE1BQUFBLE9BQU8sQ0FBQ0MsSUFBUixDQUFhLDZCQUFiO0FBQ0gsS0FGTSxNQUVBLElBQUlnTyxFQUFFLFlBQVloTSxtQ0FBaUJtTSxxQkFBbkMsRUFBMEQ7QUFDN0RwTyxNQUFBQSxPQUFPLENBQUNDLElBQVIsQ0FBYSwyQkFBYjtBQUNILEtBRk0sTUFFQSxJQUFJZ08sRUFBRSxZQUFZaE0sbUNBQWlCb00scUJBQW5DLEVBQTBEO0FBQzdEck8sTUFBQUEsT0FBTyxDQUFDQyxJQUFSLENBQWEsMkJBQWI7QUFDSCxLQUZNLE1BRUEsSUFBSWdPLEVBQUUsWUFBWWhNLG1DQUFpQm9MLHdCQUFuQyxFQUE2RDtBQUNoRXJOLE1BQUFBLE9BQU8sQ0FBQ0MsSUFBUixDQUFhLDhCQUFiO0FBQ0gsS0E3QnlFLENBOEIxRTs7O0FBRUEsV0FBTyxJQUFJNE4sZUFBSixDQUFhLE1BQWIsRUFBcUIvTSxHQUFyQixFQUEwQjJNLFFBQTFCLEVBQW9Dek8sS0FBcEMsRUFBMkMwTyxNQUEzQyxFQUFtREMsU0FBbkQsQ0FBUDtBQUNILEdBLzBCK0MsQ0FpMUJoRDs7O0FBQ0FXLEVBQUFBLG1CQUFtQixDQUFDbE4sR0FBRCxFQUFtQjtBQUNsQ3BCLElBQUFBLE9BQU8sQ0FBQ21LLEtBQVIsQ0FBYyxpQkFBZDtBQUVILEdBcjFCK0MsQ0F3MUJoRDs7O0FBQ0FvRSxFQUFBQSxtQkFBbUIsQ0FBQ25OLEdBQUQsRUFBbUI7QUFDbENwQixJQUFBQSxPQUFPLENBQUNtSyxLQUFSLENBQWMsaUJBQWQ7QUFFSDtBQUVEOzs7Ozs7Ozs7Ozs7QUFVQStELEVBQUFBLGlCQUFpQixDQUFDOU0sR0FBRCxFQUFnQztBQUM3QyxTQUFLRCxHQUFMLENBQVNDLEdBQVQsRUFBY2dELGVBQU0vQyxLQUFOLEVBQWQ7QUFDQSxTQUFLNkMsVUFBTCxDQUFnQjlDLEdBQWhCLEVBQXFCYSxtQ0FBaUJ1TSxtQkFBdEM7QUFDQSxTQUFLeEYsZUFBTCxDQUFxQjVILEdBQXJCLEVBQTBCLENBQTFCO0FBQ0EsVUFBTW1DLElBQUksR0FBR25DLEdBQUcsQ0FBQ3lCLFFBQUosQ0FBYSxDQUFiLENBQWI7QUFDQSxVQUFNeUcsS0FBSyxHQUFHL0YsSUFBSSxDQUFDaEMsYUFBTCxFQUFkOztBQUVBLFFBQUkrSCxLQUFLLElBQUksQ0FBYixFQUFnQjtBQUFFO0FBQ2QsYUFBTyxLQUFLbUYsa0JBQUwsQ0FBd0JsTCxJQUF4QixDQUFQO0FBQ0gsS0FGRCxNQUVPLElBQUkrRixLQUFLLElBQUksQ0FBYixFQUFnQjtBQUNuQixhQUFPLEtBQUtvRixtQkFBTCxDQUF5Qm5MLElBQXpCLENBQVA7QUFDSDs7QUFDRCxTQUFLVSxpQkFBTCxDQUF1QixLQUFLeEMsV0FBTCxDQUFpQjhCLElBQWpCLENBQXZCO0FBQ0gsR0FyM0IrQyxDQXUzQmhEOzs7QUFDQW9MLEVBQUFBLDZCQUE2QixDQUFDdk4sR0FBRCxFQUFtQjtBQUM1Q3BCLElBQUFBLE9BQU8sQ0FBQ21LLEtBQVIsQ0FBYyxpQkFBZDtBQUVILEdBMzNCK0MsQ0E2M0JoRDs7O0FBQ0F5RSxFQUFBQSxjQUFjLENBQUN4TixHQUFELEVBQW1CO0FBQzdCcEIsSUFBQUEsT0FBTyxDQUFDQyxJQUFSLENBQWEscUJBQXFCbUIsR0FBRyxDQUFDSSxPQUFKLEVBQWxDO0FBRUgsR0FqNEIrQyxDQW00QmhEOzs7QUFDQXFOLEVBQUFBLGlCQUFpQixDQUFDek4sR0FBRCxFQUFtQjtBQUNoQ3BCLElBQUFBLE9BQU8sQ0FBQ0MsSUFBUixDQUFhLHdCQUF3Qm1CLEdBQUcsQ0FBQ0ksT0FBSixFQUFyQztBQUNILEdBdDRCK0MsQ0F3NEJoRDs7O0FBQ0FpSSxFQUFBQSx1QkFBdUIsQ0FBQ3JJLEdBQUQsRUFBNkQ7QUFDaEYsU0FBS0QsR0FBTCxDQUFTQyxHQUFULEVBQWNnRCxlQUFNL0MsS0FBTixFQUFkO0FBQ0EsU0FBSzZDLFVBQUwsQ0FBZ0I5QyxHQUFoQixFQUFxQmEsbUNBQWlCdUgseUJBQXRDO0FBQ0EsVUFBTXNGLFdBQVcsR0FBRyxFQUFwQixDQUhnRixDQUloRjs7QUFDQSxTQUFLLE1BQU12TCxJQUFYLElBQW1CLEtBQUtxRSxhQUFMLENBQW1CeEcsR0FBbkIsQ0FBbkIsRUFBNEM7QUFDeEM7QUFDQSxZQUFNbUksR0FBRyxHQUFHLEtBQUtYLGdCQUFMLENBQXNCckYsSUFBdEIsQ0FBWjtBQUNBdUwsTUFBQUEsV0FBVyxDQUFDbE4sSUFBWixDQUFpQjJILEdBQWpCO0FBQ0gsS0FUK0UsQ0FXaEY7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0EsUUFBSUEsR0FBSjs7QUFDQSxRQUFJdUYsV0FBVyxDQUFDak4sTUFBWixJQUFzQixDQUExQixFQUE2QjtBQUN6QjBILE1BQUFBLEdBQUcsR0FBRyxJQUFJd0YsMEJBQUosQ0FBd0JELFdBQVcsQ0FBQyxDQUFELENBQW5DLENBQU47QUFDSCxLQUZELE1BRU87QUFDSHZGLE1BQUFBLEdBQUcsR0FBRyxJQUFJeUYseUJBQUosQ0FBdUJGLFdBQXZCLENBQU47QUFDSDs7QUFDRCxXQUFPLEtBQUt4TCxRQUFMLENBQWNpRyxHQUFkLEVBQW1CLEtBQUt0RyxRQUFMLENBQWMsS0FBS1MsVUFBTCxDQUFnQnRDLEdBQUcsQ0FBQ3VELGlCQUFKLEVBQWhCLENBQWQsQ0FBbkIsQ0FBUDtBQUNIO0FBRUQ7Ozs7OztBQUlBaUUsRUFBQUEsZ0JBQWdCLENBQUNyRixJQUFELEVBQXlCO0FBQ3JDLFFBQUlBLElBQUksWUFBWXRCLG1DQUFpQmdOLHdCQUFyQyxFQUErRDtBQUMzRCxhQUFPLEtBQUtDLHNCQUFMLENBQTRCM0wsSUFBNUIsQ0FBUDtBQUNILEtBRkQsTUFFTyxJQUFJQSxJQUFJLFlBQVl0QixtQ0FBaUJnSCw4QkFBckMsRUFBcUU7QUFDeEUsYUFBTyxLQUFLQyw0QkFBTCxDQUFrQzNGLElBQWxDLENBQVA7QUFDSCxLQUZNLE1BRUEsSUFBSUEsSUFBSSxZQUFZdEIsbUNBQWlCa04sMkJBQXJDLEVBQWtFO0FBQ3JFLGFBQU8sS0FBS0MseUJBQUwsQ0FBK0I3TCxJQUEvQixDQUFQO0FBQ0gsS0FGTSxNQUVBLElBQUlBLElBQUksWUFBWXRCLG1DQUFpQm9OLHlCQUFyQyxFQUFnRTtBQUNuRSxhQUFPLEtBQUtDLHVCQUFMLENBQTZCL0wsSUFBN0IsQ0FBUDtBQUNILEtBRk0sTUFFQSxJQUFJQSxJQUFJLFlBQVl0QixtQ0FBaUJzTiwrQkFBckMsRUFBc0U7QUFDekUsYUFBTyxLQUFLQyw2QkFBTCxDQUFtQ2pNLElBQW5DLENBQVA7QUFDSCxLQUZNLE1BRUEsSUFBSUEsSUFBSSxZQUFZdEIsbUNBQWlCa0gsNkJBQXJDLEVBQW9FO0FBQ3ZFLGFBQU8sS0FBS0MsMkJBQUwsQ0FBaUM3RixJQUFqQyxDQUFQO0FBQ0gsS0FGTSxNQUVBLElBQUlBLElBQUksWUFBWXRCLG1DQUFpQndOLHlCQUFyQyxFQUFnRTtBQUNuRSxhQUFPLEtBQUtDLHVCQUFMLENBQTZCbk0sSUFBN0IsQ0FBUDtBQUNILEtBRk0sTUFFQSxJQUFJQSxJQUFJLFlBQVl0QixtQ0FBaUIwTiw4QkFBckMsRUFBcUU7QUFDeEUsYUFBTyxLQUFLQyw0QkFBTCxDQUFrQ3JNLElBQWxDLENBQVA7QUFDSCxLQUZNLE1BRUEsSUFBSUEsSUFBSSxZQUFZdEIsbUNBQWlCNE4sMkJBQXJDLEVBQWtFO0FBQ3JFLGFBQU8sS0FBS0MseUJBQUwsQ0FBK0J2TSxJQUEvQixDQUFQO0FBQ0gsS0FGTSxNQUVBLElBQUlBLElBQUksWUFBWXRCLG1DQUFpQjhOLDJCQUFyQyxFQUFrRTtBQUNyRSxhQUFPLEtBQUtDLHlCQUFMLENBQStCek0sSUFBL0IsQ0FBUDtBQUNILEtBRk0sTUFFQSxJQUFJQSxJQUFJLFlBQVl0QixtQ0FBaUJnTywwQkFBckMsRUFBaUU7QUFDcEUsYUFBTyxLQUFLQyx3QkFBTCxDQUE4QjNNLElBQTlCLENBQVA7QUFDSCxLQUZNLE1BRUEsSUFBSUEsSUFBSSxZQUFZdEIsbUNBQWlCa08sNEJBQXJDLEVBQW1FO0FBQ3RFLGFBQU8sS0FBS0MsMEJBQUwsQ0FBZ0M3TSxJQUFoQyxDQUFQO0FBQ0gsS0FGTSxNQUVBLElBQUlBLElBQUksWUFBWXRCLG1DQUFpQm9PLG1DQUFyQyxFQUEwRTtBQUM3RSxhQUFPLEtBQUtDLGlDQUFMLENBQXVDL00sSUFBdkMsQ0FBUDtBQUNILEtBRk0sTUFFQSxJQUFJQSxJQUFJLFlBQVl0QixtQ0FBaUI0RSx5QkFBckMsRUFBZ0U7QUFDbkUsYUFBTyxLQUFLQyx1QkFBTCxDQUE2QnZELElBQTdCLENBQVA7QUFDSDs7QUFDRCxTQUFLVSxpQkFBTCxDQUF1QixLQUFLeEMsV0FBTCxDQUFpQjhCLElBQWpCLENBQXZCO0FBQ0gsR0FyOEIrQyxDQXU4QmhEOzs7QUFDQWlDLEVBQUFBLHFCQUFxQixDQUFDcEUsR0FBRCxFQUFxQztBQUN0RCxTQUFLRCxHQUFMLENBQVNDLEdBQVQsRUFBY2dELGVBQU0vQyxLQUFOLEVBQWQ7QUFDQSxTQUFLNkMsVUFBTCxDQUFnQjlDLEdBQWhCLEVBQXFCYSxtQ0FBaUJzRCx1QkFBdEMsRUFGc0QsQ0FHdEQ7O0FBQ0EsVUFBTW1GLFVBQVUsR0FBRyxLQUFLQyxlQUFMLENBQXFCdkosR0FBRyxDQUFDeUIsUUFBSixDQUFhLENBQWIsQ0FBckIsQ0FBbkI7QUFDQSxVQUFNMEUsSUFBZ0IsR0FBRyxLQUFLZ0osY0FBTCxDQUFvQm5QLEdBQUcsQ0FBQ3lCLFFBQUosQ0FBYSxDQUFiLENBQXBCLENBQXpCO0FBQ0EsVUFBTTJOLFNBQVMsR0FBRyxJQUFJQyxnQkFBSixDQUFjbEosSUFBZCxDQUFsQjtBQUNBLFdBQU8sSUFBSW1KLHVCQUFKLENBQXFCaEcsVUFBckIsRUFBaUMsSUFBakMsRUFBdUM4RixTQUF2QyxDQUFQO0FBQ0gsR0FoOUIrQyxDQWs5QmhEOzs7QUFDQUQsRUFBQUEsY0FBYyxDQUFDblAsR0FBRCxFQUFtQjtBQUM3QixTQUFLRCxHQUFMLENBQVNDLEdBQVQsRUFBY2dELGVBQU0vQyxLQUFOLEVBQWQ7QUFDQSxTQUFLNkMsVUFBTCxDQUFnQjlDLEdBQWhCLEVBQXFCYSxtQ0FBaUIwTyxnQkFBdEMsRUFGNkIsQ0FHN0I7O0FBQ0EsU0FBS3RPLHNCQUFMLENBQTRCakIsR0FBNUI7QUFDQSxVQUFNbUMsSUFBSSxHQUFHLEtBQUtxTixhQUFMLENBQW1CeFAsR0FBbkIsRUFBd0JhLG1DQUFpQjRPLG1CQUF6QyxDQUFiO0FBQ0g7O0FBRU9ELEVBQUFBLGFBQVIsQ0FBc0J4UCxHQUF0QixFQUF3Q3JDLElBQXhDLEVBQW1EO0FBQy9DLFNBQUssSUFBSTRELENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUd2QixHQUFHLENBQUNHLGFBQUosRUFBcEIsRUFBeUMsRUFBRW9CLENBQTNDLEVBQThDO0FBQzFDLFVBQUl2QixHQUFHLENBQUN5QixRQUFKLENBQWFGLENBQWIsYUFBMkI1RCxJQUEvQixFQUFxQztBQUNqQyxlQUFPcUMsR0FBRyxDQUFDeUIsUUFBSixDQUFhRixDQUFiLENBQVA7QUFDSDtBQUNKOztBQUNELFdBQU8sSUFBUDtBQUNILEdBbCtCK0MsQ0FxK0JoRDs7O0FBQ0FtTyxFQUFBQSxpQkFBaUIsQ0FBQzFQLEdBQUQsRUFBbUI7QUFDaEMsU0FBS0QsR0FBTCxDQUFTQyxHQUFULEVBQWNnRCxlQUFNL0MsS0FBTixFQUFkO0FBQ0gsR0F4K0IrQyxDQTIrQmhEOzs7QUFDQTBQLEVBQUFBLHFCQUFxQixDQUFDM1AsR0FBRCxFQUFtQjtBQUNwQyxTQUFLRCxHQUFMLENBQVNDLEdBQVQsRUFBY2dELGVBQU0vQyxLQUFOLEVBQWQ7QUFDSDtBQUVEOzs7Ozs7Ozs7Ozs7QUFVQWlLLEVBQUFBLHdCQUF3QixDQUFDbEssR0FBRCxFQUF3QztBQUM1RCxTQUFLRCxHQUFMLENBQVNDLEdBQVQsRUFBY2dELGVBQU0vQyxLQUFOLEVBQWQ7QUFDQSxTQUFLNkMsVUFBTCxDQUFnQjlDLEdBQWhCLEVBQXFCYSxtQ0FBaUJvSiwwQkFBdEM7QUFDQSxVQUFNMkYsTUFBMkIsR0FBRyxFQUFwQzs7QUFDQSxTQUFLLElBQUlyTyxDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHdkIsR0FBRyxDQUFDRyxhQUFKLEVBQXBCLEVBQXlDLEVBQUVvQixDQUEzQyxFQUE4QztBQUMxQyxZQUFNWSxJQUFJLEdBQUduQyxHQUFHLENBQUN5QixRQUFKLENBQWFGLENBQWIsQ0FBYjs7QUFDQSxVQUFJWSxJQUFJLFlBQVl0QixtQ0FBaUJnUCx5QkFBckMsRUFBZ0U7QUFDNUQsY0FBTUMsU0FBUyxHQUFHLEtBQUtDLHVCQUFMLENBQTZCNU4sSUFBN0IsQ0FBbEI7QUFDQXlOLFFBQUFBLE1BQU0sQ0FBQ3BQLElBQVAsQ0FBWXNQLFNBQVo7QUFDSCxPQUhELE1BR08sSUFBSTNOLElBQUksWUFBWXRCLG1DQUFpQm1QLDZCQUFyQyxFQUFvRTtBQUN2RSxjQUFNRixTQUFTLEdBQUcsS0FBS0csMkJBQUwsQ0FBaUM5TixJQUFqQyxDQUFsQjtBQUNBeU4sUUFBQUEsTUFBTSxDQUFDcFAsSUFBUCxDQUFZc1AsU0FBWjtBQUNIO0FBQ0o7O0FBQ0QsV0FBT0YsTUFBUDtBQUNIO0FBRUQ7Ozs7Ozs7Ozs7QUFRQUcsRUFBQUEsdUJBQXVCLENBQUMvUCxHQUFELEVBQTJFO0FBQzlGLFNBQUtELEdBQUwsQ0FBU0MsR0FBVCxFQUFjZ0QsZUFBTS9DLEtBQU4sRUFBZDtBQUNBLFNBQUs2QyxVQUFMLENBQWdCOUMsR0FBaEIsRUFBcUJhLG1DQUFpQmdQLHlCQUF0QyxFQUY4RixDQUc5Rjs7QUFFQSxVQUFNM0gsS0FBSyxHQUFHbEksR0FBRyxDQUFDRyxhQUFKLEVBQWQ7O0FBQ0EsUUFBSStILEtBQUssSUFBSSxDQUFULElBQWNBLEtBQUssSUFBSSxDQUEzQixFQUE4QjtBQUMxQixXQUFLckYsaUJBQUwsQ0FBdUIsS0FBS3hDLFdBQUwsQ0FBaUJMLEdBQWpCLENBQXZCO0FBQ0gsS0FSNkYsQ0FTOUY7QUFDQTtBQUNBO0FBQ0E7OztBQUNBLFFBQUlrSSxLQUFLLElBQUksQ0FBYixFQUFnQjtBQUNaLGFBQU8sS0FBS1osZUFBTCxDQUFxQnRILEdBQUcsQ0FBQ3lCLFFBQUosQ0FBYSxDQUFiLENBQXJCLENBQVA7QUFDSCxLQUZELE1BRU87QUFDSCxZQUFNNEYsVUFBVSxHQUFHLEtBQUtDLGVBQUwsQ0FBcUJ0SCxHQUFHLENBQUN5QixRQUFKLENBQWEsQ0FBYixDQUFyQixDQUFuQjtBQUNBLFlBQU0rSixVQUFVLEdBQUcsS0FBS2hFLGdCQUFMLENBQXNCeEgsR0FBRyxDQUFDeUIsUUFBSixDQUFhLENBQWIsQ0FBdEIsQ0FBbkI7QUFDQSxhQUFPLElBQUl5Tyx3QkFBSixDQUFzQjdJLFVBQXRCLEVBQWtDbUUsVUFBbEMsQ0FBUDtBQUNIO0FBQ0o7QUFDRDs7Ozs7Ozs7Ozs7QUFTQWxFLEVBQUFBLGVBQWUsQ0FBQ3RILEdBQUQsRUFBdUQ7QUFDbEUsU0FBS0QsR0FBTCxDQUFTQyxHQUFULEVBQWNnRCxlQUFNL0MsS0FBTixFQUFkO0FBQ0EsU0FBSzZDLFVBQUwsQ0FBZ0I5QyxHQUFoQixFQUFxQmEsbUNBQWlCdUcsaUJBQXRDO0FBQ0EsVUFBTUMsVUFBVSxHQUFHckgsR0FBRyxDQUFDeUIsUUFBSixDQUFhLENBQWIsQ0FBbkI7O0FBQ0EsUUFBSTRGLFVBQVUsWUFBWXhHLG1DQUFpQm1KLGlCQUEzQyxFQUE4RDtBQUMxRCxhQUFPLEtBQUtULGVBQUwsQ0FBcUJsQyxVQUFyQixDQUFQO0FBQ0gsS0FGRCxNQUVPLElBQUlBLFVBQVUsWUFBWXhHLG1DQUFpQmtLLG1CQUEzQyxFQUFnRTtBQUNuRW5NLE1BQUFBLE9BQU8sQ0FBQ0MsSUFBUixDQUFhLGFBQWI7QUFDSCxLQUZNLE1BRUEsSUFBSXdJLFVBQVUsWUFBWXhHLG1DQUFpQjhLLG9CQUEzQyxFQUFpRTtBQUNwRS9NLE1BQUFBLE9BQU8sQ0FBQ0MsSUFBUixDQUFhLGFBQWI7QUFDSDs7QUFDRCxTQUFLZ0UsaUJBQUwsQ0FBdUIsS0FBS3hDLFdBQUwsQ0FBaUJMLEdBQWpCLENBQXZCO0FBQ0g7QUFFRDs7Ozs7Ozs7O0FBT0FpUSxFQUFBQSwyQkFBMkIsQ0FBQ2pRLEdBQUQsRUFBZ0M7QUFDdkQsU0FBS0QsR0FBTCxDQUFTQyxHQUFULEVBQWNnRCxlQUFNL0MsS0FBTixFQUFkO0FBQ0EsU0FBSzZDLFVBQUwsQ0FBZ0I5QyxHQUFoQixFQUFxQmEsbUNBQWlCbVAsNkJBQXRDO0FBQ0EsVUFBTXhFLFVBQVUsR0FBRyxLQUFLaEUsZ0JBQUwsQ0FBc0J4SCxHQUFHLENBQUN5QixRQUFKLENBQWEsQ0FBYixDQUF0QixDQUFuQjtBQUNBLFdBQU8sSUFBSTBPLGtCQUFKLENBQWdCM0UsVUFBaEIsQ0FBUDtBQUNILEdBM2tDK0MsQ0E2a0NoRDs7O0FBQ0E0RSxFQUFBQSxzQkFBc0IsQ0FBQ3BRLEdBQUQsRUFBbUI7QUFDckNwQixJQUFBQSxPQUFPLENBQUNtSyxLQUFSLENBQWMsaUJBQWQ7QUFDSCxHQWhsQytDLENBa2xDaEQ7OztBQUNBc0gsRUFBQUEseUJBQXlCLENBQUNyUSxHQUFELEVBQW1CO0FBQ3hDcEIsSUFBQUEsT0FBTyxDQUFDbUssS0FBUixDQUFjLGlCQUFkO0FBQ0gsR0FybEMrQyxDQXVsQ2hEOzs7QUFDQXVILEVBQUFBLDJCQUEyQixDQUFDdFEsR0FBRCxFQUFtQjtBQUMxQ3BCLElBQUFBLE9BQU8sQ0FBQ21LLEtBQVIsQ0FBYyxpQkFBZDtBQUNIO0FBRUQ7Ozs7OztBQUlBakIsRUFBQUEsNEJBQTRCLENBQUM5SCxHQUFELEVBQXFDO0FBQzdELFNBQUtELEdBQUwsQ0FBU0MsR0FBVCxFQUFjZ0QsZUFBTS9DLEtBQU4sRUFBZDtBQUNBLFNBQUs2QyxVQUFMLENBQWdCOUMsR0FBaEIsRUFBcUJhLG1DQUFpQmdILDhCQUF0QztBQUNBLFVBQU0xRixJQUFJLEdBQUduQyxHQUFHLENBQUN5QixRQUFKLENBQWEsQ0FBYixDQUFiO0FBQ0EsVUFBTW9LLFVBQXNDLEdBQUcsS0FBS0gsa0JBQUwsQ0FBd0J2SixJQUF4QixDQUEvQztBQUNBLFdBQU8sSUFBSXlKLHVCQUFKLENBQXFCQyxVQUFyQixDQUFQO0FBQ0gsR0F0bUMrQyxDQXdtQ2hEOzs7QUFDQTBFLEVBQUFBLGlCQUFpQixDQUFDdlEsR0FBRCxFQUFtQjtBQUNoQ3BCLElBQUFBLE9BQU8sQ0FBQ21LLEtBQVIsQ0FBYyxpQkFBZDtBQUVILEdBNW1DK0MsQ0ErbUNoRDs7O0FBQ0F5SCxFQUFBQSx3QkFBd0IsQ0FBQ3hRLEdBQUQsRUFBbUI7QUFDdkNwQixJQUFBQSxPQUFPLENBQUNtSyxLQUFSLENBQWMsaUJBQWQ7QUFFSCxHQW5uQytDLENBc25DaEQ7OztBQUNBMEgsRUFBQUEsa0JBQWtCLENBQUN6USxHQUFELEVBQW1CO0FBQ2pDcEIsSUFBQUEsT0FBTyxDQUFDbUssS0FBUixDQUFjLGlCQUFkO0FBQ0gsR0F6bkMrQyxDQTRuQ2hEOzs7QUFDQTJILEVBQUFBLDBCQUEwQixDQUFDMVEsR0FBRCxFQUFtQjtBQUN6Q3BCLElBQUFBLE9BQU8sQ0FBQ21LLEtBQVIsQ0FBYyxpQkFBZDtBQUNILEdBL25DK0MsQ0Frb0NoRDs7O0FBQ0E0SCxFQUFBQSx3QkFBd0IsQ0FBQzNRLEdBQUQsRUFBbUI7QUFDdkNwQixJQUFBQSxPQUFPLENBQUNDLElBQVIsQ0FBYSwrQkFBK0JtQixHQUFHLENBQUNJLE9BQUosRUFBNUM7QUFDSCxHQXJvQytDLENBd29DaEQ7OztBQUNBd1EsRUFBQUEsbUJBQW1CLENBQUM1USxHQUFELEVBQW1CO0FBQ2xDcEIsSUFBQUEsT0FBTyxDQUFDbUssS0FBUixDQUFjLGlCQUFkO0FBRUg7QUFFRDs7Ozs7Ozs7Ozs7QUFTQXJELEVBQUFBLHVCQUF1QixDQUFDMUYsR0FBRCxFQUFtQjtBQUN0QyxTQUFLRCxHQUFMLENBQVNDLEdBQVQsRUFBY2dELGVBQU0vQyxLQUFOLEVBQWQ7QUFDQSxTQUFLNkMsVUFBTCxDQUFnQjlDLEdBQWhCLEVBQXFCYSxtQ0FBaUI0RSx5QkFBdEM7QUFDQSxVQUFNdEQsSUFBSSxHQUFHbkMsR0FBRyxDQUFDeUIsUUFBSixDQUFhLENBQWIsQ0FBYjtBQUNBLFFBQUlvUCxrQkFBSjs7QUFDQSxRQUFJMU8sSUFBSSxZQUFZdEIsbUNBQWlCMkosbUJBQXJDLEVBQTBEO0FBQ3REcUcsTUFBQUEsa0JBQWtCLEdBQUcsS0FBS3RHLGlCQUFMLENBQXVCdkssR0FBRyxDQUFDeUIsUUFBSixDQUFhLENBQWIsQ0FBdkIsQ0FBckI7QUFDSCxLQUZELE1BRU8sSUFBSVUsSUFBSSxZQUFZdEIsbUNBQWlCaVEsMkJBQXJDLEVBQWtFO0FBQ3JFRCxNQUFBQSxrQkFBa0IsR0FBRyxLQUFLRSx5QkFBTCxDQUErQi9RLEdBQUcsQ0FBQ3lCLFFBQUosQ0FBYSxDQUFiLENBQS9CLENBQXJCO0FBQ0gsS0FGTSxNQUVBLElBQUlVLElBQUksWUFBWXRCLG1DQUFpQm1RLG9CQUFyQyxFQUEyRDtBQUM5REgsTUFBQUEsa0JBQWtCLEdBQUcsS0FBS0ksa0JBQUwsQ0FBd0JqUixHQUFHLENBQUN5QixRQUFKLENBQWEsQ0FBYixDQUF4QixDQUFyQjtBQUNILEtBRk0sTUFFQTtBQUNILFlBQU0sSUFBSW1CLFNBQUosQ0FBYyxpQkFBZCxDQUFOO0FBQ0g7O0FBQ0QsV0FBT2lPLGtCQUFQO0FBQ0gsR0F0cUMrQyxDQXdxQ2hEOzs7QUFDQUksRUFBQUEsa0JBQWtCLENBQUNqUixHQUFELEVBQTRDO0FBQzFELFNBQUtELEdBQUwsQ0FBU0MsR0FBVCxFQUFjZ0QsZUFBTS9DLEtBQU4sRUFBZDtBQUNBLFNBQUs2QyxVQUFMLENBQWdCOUMsR0FBaEIsRUFBcUJhLG1DQUFpQm1RLG9CQUF0QztBQUNBLFNBQUsvUCxzQkFBTCxDQUE0QmpCLEdBQTVCO0FBQ0EsVUFBTWtSLFlBQVksR0FBRyxLQUFLekssbUJBQUwsQ0FBeUJ6RyxHQUF6QixFQUE4QmEsbUNBQWlCc1EsOEJBQS9DLENBQXJCO0FBQ0EsVUFBTUMsV0FBVyxHQUFHLEtBQUszSyxtQkFBTCxDQUF5QnpHLEdBQXpCLEVBQThCYSxtQ0FBaUJ3USx3QkFBL0MsQ0FBcEI7QUFDQSxVQUFNeEgsTUFBTSxHQUFHLEtBQUt5SCw0QkFBTCxDQUFrQ0osWUFBbEMsQ0FBZjtBQUNBLFVBQU0vSyxJQUFJLEdBQUcsS0FBS29MLHNCQUFMLENBQTRCSCxXQUE1QixDQUFiO0FBQ0EsVUFBTTVGLFVBQVUsR0FBRyxLQUFuQixDQVIwRCxDQVMxRDs7QUFDQSxXQUFPLElBQUlnRyw4QkFBSixDQUE0QjNILE1BQTVCLEVBQW9DMUQsSUFBcEMsRUFBMENxRixVQUExQyxDQUFQO0FBQ0g7QUFFRDs7Ozs7Ozs7O0FBT0E4RixFQUFBQSw0QkFBNEIsQ0FBQ3RSLEdBQUQsRUFBd0M7QUFDaEUsU0FBS0QsR0FBTCxDQUFTQyxHQUFULEVBQWNnRCxlQUFNL0MsS0FBTixFQUFkO0FBQ0EsU0FBSzZDLFVBQUwsQ0FBZ0I5QyxHQUFoQixFQUFxQmEsbUNBQWlCc1EsOEJBQXRDLEVBRmdFLENBR2hFOztBQUNBLFFBQUluUixHQUFHLENBQUNHLGFBQUosTUFBdUIsQ0FBM0IsRUFBOEI7QUFDMUIsYUFBTyxFQUFQO0FBQ0g7QUFDRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQStCQSxRQUFJMEosTUFBTSxHQUFHLEVBQWI7O0FBQ0EsU0FBSyxNQUFNMUgsSUFBWCxJQUFtQixLQUFLa0osUUFBTCxDQUFjckwsR0FBZCxDQUFuQixFQUF1QztBQUNuQyxVQUFJbUMsSUFBSSxZQUFZdEIsbUNBQWlCbUosaUJBQXJDLEVBQXdEO0FBQ3BESCxRQUFBQSxNQUFNLENBQUNySixJQUFQLENBQVksS0FBSytJLGVBQUwsQ0FBcUJwSCxJQUFyQixDQUFaO0FBQ0gsT0FGRCxNQUVPLElBQUlBLElBQUksWUFBWXRCLG1DQUFpQm9KLDBCQUFyQyxFQUFpRTtBQUNwRUosUUFBQUEsTUFBTSxHQUFHLENBQUMsR0FBRyxLQUFLSyx3QkFBTCxDQUE4Qi9ILElBQTlCLENBQUosQ0FBVDtBQUNIO0FBQ0o7O0FBQ0QsV0FBTzBILE1BQVA7QUFDSDtBQUVEOzs7Ozs7Ozs7O0FBUUEwSCxFQUFBQSxzQkFBc0IsQ0FBQ3ZSLEdBQUQsRUFBZ0Q7QUFDbEUsU0FBS0QsR0FBTCxDQUFTQyxHQUFULEVBQWNnRCxlQUFNL0MsS0FBTixFQUFkO0FBQ0EsU0FBSzZDLFVBQUwsQ0FBZ0I5QyxHQUFoQixFQUFxQmEsbUNBQWlCd1Esd0JBQXRDO0FBQ0EsVUFBTWxQLElBQUksR0FBR25DLEdBQUcsQ0FBQ3lCLFFBQUosQ0FBYSxDQUFiLENBQWI7O0FBQ0EsUUFBSXpCLEdBQUcsQ0FBQ0csYUFBSixNQUF1QixDQUEzQixFQUE4QjtBQUMxQixZQUFNaVIsV0FBVyxHQUFHLEtBQUszSyxtQkFBTCxDQUF5QnpHLEdBQXpCLEVBQThCYSxtQ0FBaUJzSixtQkFBL0MsQ0FBcEI7O0FBQ0EsVUFBSWlILFdBQVcsQ0FBQ2pSLGFBQVosTUFBK0IsQ0FBbkMsRUFBc0M7QUFDbEMsZUFBTyxJQUFJb0cscUJBQUosQ0FBbUIsRUFBbkIsQ0FBUDtBQUNIOztBQUNELFlBQU1KLElBQUksR0FBRyxLQUFLc0UsaUJBQUwsQ0FBdUIyRyxXQUF2QixDQUFiO0FBQ0EsYUFBTyxJQUFJN0sscUJBQUosQ0FBbUJKLElBQW5CLENBQVA7QUFDSCxLQVBELE1BT087QUFDSCxVQUFJaEUsSUFBSSxZQUFZdEIsbUNBQWlCME4sOEJBQXJDLEVBQXFFO0FBRWpFLGNBQU1rRCxXQUFvQyxHQUFHLEtBQUtqRCw0QkFBTCxDQUFrQ3JNLElBQWxDLENBQTdDLENBRmlFLENBR2pFO0FBQ0E7O0FBQ0EsWUFBSXNQLFdBQVcsWUFBWTlELDBCQUEzQixFQUFnRDtBQUM1QyxpQkFBTzhELFdBQVcsQ0FBQ2pHLFVBQW5CO0FBQ0gsU0FGRCxNQUVPLElBQUlpRyxXQUFXLFlBQVk3RCx5QkFBM0IsRUFBK0M7QUFDbEQsaUJBQU82RCxXQUFQO0FBQ0g7QUFDSixPQVZELE1BVU87QUFDSCxlQUFPLEtBQUtqSyxnQkFBTCxDQUFzQnJGLElBQXRCLENBQVA7QUFDSDtBQUNKOztBQUNELFVBQU0sSUFBSVMsU0FBSixDQUFjLHdCQUF3QjVDLEdBQXRDLENBQU47QUFDSCxHQWp4QytDLENBbXhDaEQ7OztBQUNBMFIsRUFBQUEseUJBQXlCLENBQUMxUixHQUFELEVBQW1CO0FBQ3hDcEIsSUFBQUEsT0FBTyxDQUFDbUssS0FBUixDQUFjLGlCQUFkO0FBRUgsR0F2eEMrQyxDQTB4Q2hEOzs7QUFDQTRJLEVBQUFBLDJCQUEyQixDQUFDM1IsR0FBRCxFQUFtQjtBQUMxQ3BCLElBQUFBLE9BQU8sQ0FBQ21LLEtBQVIsQ0FBYyxpQkFBZDtBQUNIO0FBRUQ7Ozs7Ozs7O0FBTUFpRixFQUFBQSx5QkFBeUIsQ0FBQ2hPLEdBQUQsRUFBeUM7QUFDOUQsU0FBS0QsR0FBTCxDQUFTQyxHQUFULEVBQWNnRCxlQUFNL0MsS0FBTixFQUFkO0FBQ0EsU0FBSzZDLFVBQUwsQ0FBZ0I5QyxHQUFoQixFQUFxQmEsbUNBQWlCa04sMkJBQXRDO0FBQ0EsU0FBS25HLGVBQUwsQ0FBcUI1SCxHQUFyQixFQUEwQixDQUExQjtBQUVBLFVBQU00UixXQUFXLEdBQUc1UixHQUFHLENBQUN5QixRQUFKLENBQWEsQ0FBYixDQUFwQjtBQUNBLFVBQU1vUSxRQUFRLEdBQUc3UixHQUFHLENBQUN5QixRQUFKLENBQWEsQ0FBYixFQUFnQnJCLE9BQWhCLEVBQWpCLENBTjhELENBTWxCOztBQUM1QyxVQUFNb0wsVUFBVSxHQUFHeEwsR0FBRyxDQUFDeUIsUUFBSixDQUFhLENBQWIsQ0FBbkI7QUFDQSxVQUFNcVEsR0FBRyxHQUFHLEtBQUt0SyxnQkFBTCxDQUFzQm9LLFdBQXRCLENBQVo7QUFDQSxVQUFNRyxHQUFHLEdBQUcsS0FBS3ZLLGdCQUFMLENBQXNCZ0UsVUFBdEIsQ0FBWixDQVQ4RCxDQVc5RDs7QUFDQSxXQUFPLElBQUl3RywyQkFBSixDQUF5QkgsUUFBekIsRUFBbUNDLEdBQW5DLEVBQXdDQyxHQUF4QyxDQUFQO0FBQ0gsR0FsekMrQyxDQXF6Q2hEOzs7QUFDQUUsRUFBQUEscUJBQXFCLENBQUNqUyxHQUFELEVBQW1CO0FBQ3BDcEIsSUFBQUEsT0FBTyxDQUFDbUssS0FBUixDQUFjLGlCQUFkO0FBRUgsR0F6ekMrQyxDQTR6Q2hEOzs7QUFDQW1KLEVBQUFBLHlCQUF5QixDQUFDbFMsR0FBRCxFQUFtQjtBQUN4Q3BCLElBQUFBLE9BQU8sQ0FBQ21LLEtBQVIsQ0FBYyxpQkFBZDtBQUVILEdBaDBDK0MsQ0FrMENoRDs7O0FBQ0FvSixFQUFBQSx3QkFBd0IsQ0FBQ25TLEdBQUQsRUFBbUI7QUFDdkNwQixJQUFBQSxPQUFPLENBQUNtSyxLQUFSLENBQWMsaUJBQWQ7QUFFSCxHQXQwQytDLENBdzBDaEQ7OztBQUNBcUosRUFBQUEscUJBQXFCLENBQUNwUyxHQUFELEVBQW1CO0FBQ3BDcEIsSUFBQUEsT0FBTyxDQUFDbUssS0FBUixDQUFjLGlCQUFkO0FBQ0gsR0EzMEMrQyxDQTYwQ2hEOzs7QUFDQXVGLEVBQUFBLHVCQUF1QixDQUFDdE8sR0FBRCxFQUFxQztBQUN4RHBCLElBQUFBLE9BQU8sQ0FBQ0MsSUFBUixDQUFhLG1DQUFiLEVBQWtEbUIsR0FBRyxDQUFDRyxhQUFKLEVBQWxELEVBQXVFSCxHQUFHLENBQUNJLE9BQUosRUFBdkU7QUFDQSxTQUFLMEMsVUFBTCxDQUFnQjlDLEdBQWhCLEVBQXFCYSxtQ0FBaUJ3Tix5QkFBdEM7QUFDQSxTQUFLekcsZUFBTCxDQUFxQjVILEdBQXJCLEVBQTBCLENBQTFCO0FBRUEsUUFBSXFTLElBQUksR0FBR3JTLEdBQUcsQ0FBQ3lCLFFBQUosQ0FBYSxDQUFiLENBQVg7QUFDQSxRQUFJb1EsUUFBUSxHQUFHN1IsR0FBRyxDQUFDeUIsUUFBSixDQUFhLENBQWIsRUFBZ0JyQixPQUFoQixFQUFmLENBTndELENBTWQ7O0FBQzFDLFFBQUlrUyxLQUFLLEdBQUd0UyxHQUFHLENBQUN5QixRQUFKLENBQWEsQ0FBYixDQUFaOztBQUNBLFFBQUlxUSxHQUFHLEdBQUcsS0FBS1Msc0JBQUwsQ0FBNEJGLElBQTVCLENBQVY7O0FBQ0EsUUFBSU4sR0FBRyxHQUFHLEtBQUtRLHNCQUFMLENBQTRCRCxLQUE1QixDQUFWOztBQUVBLFdBQU8sS0FBS3BRLFFBQUwsQ0FBYyxJQUFJc1EsdUJBQUosQ0FBcUJYLFFBQXJCLEVBQStCQyxHQUEvQixFQUFvQ0MsR0FBcEMsQ0FBZCxFQUF3RCxFQUF4RCxDQUFQO0FBQ0gsR0ExMUMrQyxDQTYxQ2hEOzs7QUFDQVUsRUFBQUEscUJBQXFCLENBQUN6UyxHQUFELEVBQW1CO0FBQ3BDcEIsSUFBQUEsT0FBTyxDQUFDbUssS0FBUixDQUFjLGlCQUFkO0FBRUgsR0FqMkMrQyxDQW8yQ2hEOzs7QUFDQXFGLEVBQUFBLDZCQUE2QixDQUFDcE8sR0FBRCxFQUFxQztBQUM5RCxTQUFLRCxHQUFMLENBQVNDLEdBQVQsRUFBY2dELGVBQU0vQyxLQUFOLEVBQWQ7QUFDQSxTQUFLNkMsVUFBTCxDQUFnQjlDLEdBQWhCLEVBQXFCYSxtQ0FBaUJzTiwrQkFBdEM7QUFDQSxTQUFLdkcsZUFBTCxDQUFxQjVILEdBQXJCLEVBQTBCLENBQTFCO0FBRUEsUUFBSXFTLElBQUksR0FBR3JTLEdBQUcsQ0FBQ3lCLFFBQUosQ0FBYSxDQUFiLENBQVg7QUFDQSxRQUFJb1EsUUFBUSxHQUFHN1IsR0FBRyxDQUFDeUIsUUFBSixDQUFhLENBQWIsRUFBZ0JyQixPQUFoQixFQUFmLENBTjhELENBTXBCOztBQUMxQyxRQUFJa1MsS0FBSyxHQUFHdFMsR0FBRyxDQUFDeUIsUUFBSixDQUFhLENBQWIsQ0FBWjtBQUNBLFFBQUlxUSxHQUFHLEdBQUcsS0FBS1kscUJBQUwsQ0FBMkJMLElBQTNCLENBQVY7QUFDQSxRQUFJTixHQUFHLEdBQUcsS0FBS1cscUJBQUwsQ0FBMkJKLEtBQTNCLENBQVY7QUFFQSxXQUFPLEtBQUtwUSxRQUFMLENBQWMsSUFBSXNRLHVCQUFKLENBQXFCWCxRQUFyQixFQUErQkMsR0FBL0IsRUFBb0NDLEdBQXBDLENBQWQsRUFBd0QsRUFBeEQsQ0FBUDtBQUNILEdBajNDK0MsQ0FtM0NoRDs7O0FBQ0FZLEVBQUFBLHVCQUF1QixDQUFDM1MsR0FBRCxFQUFtQjtBQUN0Q3BCLElBQUFBLE9BQU8sQ0FBQ21LLEtBQVIsQ0FBYyxpQkFBZDtBQUVILEdBdjNDK0MsQ0F5M0NoRDs7O0FBQ0F5RixFQUFBQSw0QkFBNEIsQ0FBQ3hPLEdBQUQsRUFBbUI7QUFDM0MsU0FBS0QsR0FBTCxDQUFTQyxHQUFULEVBQWNnRCxlQUFNL0MsS0FBTixFQUFkO0FBQ0EsU0FBSzZDLFVBQUwsQ0FBZ0I5QyxHQUFoQixFQUFxQmEsbUNBQWlCME4sOEJBQXRDO0FBQ0EsU0FBSzNHLGVBQUwsQ0FBcUI1SCxHQUFyQixFQUEwQixDQUExQjtBQUNBLFVBQU13TCxVQUFVLEdBQUd4TCxHQUFHLENBQUN5QixRQUFKLENBQWEsQ0FBYixDQUFuQjtBQUNBLFdBQU8sS0FBSzRHLHVCQUFMLENBQTZCbUQsVUFBN0IsQ0FBUDtBQUNILEdBaDRDK0MsQ0FrNENoRDs7O0FBQ0EwQyxFQUFBQSx1QkFBdUIsQ0FBQ2xPLEdBQUQsRUFBcUM7QUFDeEQsU0FBS0QsR0FBTCxDQUFTQyxHQUFULEVBQWNnRCxlQUFNL0MsS0FBTixFQUFkO0FBQ0EsU0FBSzZDLFVBQUwsQ0FBZ0I5QyxHQUFoQixFQUFxQmEsbUNBQWlCb04seUJBQXRDO0FBQ0EsU0FBS3JHLGVBQUwsQ0FBcUI1SCxHQUFyQixFQUEwQixDQUExQjtBQUVBLFVBQU1xUyxJQUFJLEdBQUdyUyxHQUFHLENBQUN5QixRQUFKLENBQWEsQ0FBYixDQUFiO0FBQ0EsVUFBTW9RLFFBQVEsR0FBRzdSLEdBQUcsQ0FBQ3lCLFFBQUosQ0FBYSxDQUFiLEVBQWdCckIsT0FBaEIsRUFBakIsQ0FOd0QsQ0FNWjs7QUFDNUMsVUFBTWtTLEtBQUssR0FBR3RTLEdBQUcsQ0FBQ3lCLFFBQUosQ0FBYSxDQUFiLENBQWQ7O0FBQ0EsVUFBTXFRLEdBQUcsR0FBRyxLQUFLUyxzQkFBTCxDQUE0QkYsSUFBNUIsQ0FBWjs7QUFDQSxVQUFNTixHQUFHLEdBQUcsS0FBS1Esc0JBQUwsQ0FBNEJELEtBQTVCLENBQVosQ0FUd0QsQ0FVeEQ7OztBQUNBLFdBQU8sSUFBSUUsdUJBQUosQ0FBcUJYLFFBQXJCLEVBQStCQyxHQUEvQixFQUFvQ0MsR0FBcEMsQ0FBUDtBQUNIOztBQUVEUSxFQUFBQSxzQkFBc0IsQ0FBQ3ZTLEdBQUQsRUFBbUI7QUFFckNwQixJQUFBQSxPQUFPLENBQUNDLElBQVIsQ0FBYSxnQ0FBYixFQUErQ21CLEdBQUcsQ0FBQ0csYUFBSixFQUEvQyxFQUFvRUgsR0FBRyxDQUFDSSxPQUFKLEVBQXBFOztBQUNBLFFBQUlKLEdBQUcsWUFBWWEsbUNBQWlCOE4sMkJBQXBDLEVBQWlFO0FBQzdELGFBQU8sS0FBS0MseUJBQUwsQ0FBK0I1TyxHQUEvQixDQUFQO0FBQ0gsS0FGRCxNQUVPLElBQUlBLEdBQUcsWUFBWWEsbUNBQWlCZ04sd0JBQXBDLEVBQThEO0FBQ2pFLGFBQU8sS0FBS0Msc0JBQUwsQ0FBNEI5TixHQUE1QixDQUFQO0FBQ0gsS0FGTSxNQUVBLElBQUlBLEdBQUcsWUFBWWEsbUNBQWlCb04seUJBQXBDLEVBQStEO0FBQ2xFLGFBQU8sS0FBS0MsdUJBQUwsQ0FBNkJsTyxHQUE3QixDQUFQO0FBQ0gsS0FGTSxNQUVBLElBQUlBLEdBQUcsWUFBWWEsbUNBQWlCc04sK0JBQXBDLEVBQXFFO0FBQ3hFLGFBQU8sS0FBS0MsNkJBQUwsQ0FBbUNwTyxHQUFuQyxDQUFQO0FBQ0gsS0FGTSxNQUVBLElBQUlBLEdBQUcsWUFBWWEsbUNBQWlCNE4sMkJBQXBDLEVBQWlFO0FBQ3BFLGFBQU8sS0FBS0MseUJBQUwsQ0FBK0IxTyxHQUEvQixDQUFQO0FBQ0g7O0FBQ0QsU0FBSzZDLGlCQUFMLENBQXVCLEtBQUt4QyxXQUFMLENBQWlCTCxHQUFqQixDQUF2QjtBQUNILEdBaDZDK0MsQ0FrNkNoRDs7O0FBQ0EwTyxFQUFBQSx5QkFBeUIsQ0FBQzFPLEdBQUQsRUFBcUM7QUFDMURwQixJQUFBQSxPQUFPLENBQUNDLElBQVIsQ0FBYSxxQ0FBYixFQUFvRG1CLEdBQUcsQ0FBQ0csYUFBSixFQUFwRCxFQUF5RUgsR0FBRyxDQUFDSSxPQUFKLEVBQXpFO0FBQ0EsU0FBSzBDLFVBQUwsQ0FBZ0I5QyxHQUFoQixFQUFxQmEsbUNBQWlCNE4sMkJBQXRDO0FBQ0EsU0FBSzdHLGVBQUwsQ0FBcUI1SCxHQUFyQixFQUEwQixDQUExQjtBQUNBLFVBQU1xUyxJQUFJLEdBQUdyUyxHQUFHLENBQUN5QixRQUFKLENBQWEsQ0FBYixDQUFiO0FBQ0EsVUFBTW9RLFFBQVEsR0FBRzdSLEdBQUcsQ0FBQ3lCLFFBQUosQ0FBYSxDQUFiLEVBQWdCckIsT0FBaEIsRUFBakIsQ0FMMEQsQ0FLZDs7QUFDNUMsVUFBTWtTLEtBQUssR0FBR3RTLEdBQUcsQ0FBQ3lCLFFBQUosQ0FBYSxDQUFiLENBQWQ7O0FBQ0EsVUFBTXFRLEdBQUcsR0FBRyxLQUFLUyxzQkFBTCxDQUE0QkYsSUFBNUIsQ0FBWjs7QUFDQSxVQUFNTixHQUFHLEdBQUcsS0FBS1Esc0JBQUwsQ0FBNEJELEtBQTVCLENBQVosQ0FSMEQsQ0FTMUQ7OztBQUNBLFdBQU8sSUFBSUUsdUJBQUosQ0FBcUJYLFFBQXJCLEVBQStCQyxHQUEvQixFQUFvQ0MsR0FBcEMsQ0FBUDtBQUNILEdBOTZDK0MsQ0FnN0NoRDs7O0FBQ0FhLEVBQUFBLDRCQUE0QixDQUFDNVMsR0FBRCxFQUFtQjtBQUMzQ3BCLElBQUFBLE9BQU8sQ0FBQ21LLEtBQVIsQ0FBYyxpQkFBZDtBQUNILEdBbjdDK0MsQ0FxN0NoRDs7O0FBQ0E4SixFQUFBQSxxQkFBcUIsQ0FBQzdTLEdBQUQsRUFBbUI7QUFDcENwQixJQUFBQSxPQUFPLENBQUNtSyxLQUFSLENBQWMsaUJBQWQ7QUFFSCxHQXo3QytDLENBNDdDaEQ7OztBQUNBK0osRUFBQUEsa0JBQWtCLENBQUM5UyxHQUFELEVBQW1CO0FBQ2pDcEIsSUFBQUEsT0FBTyxDQUFDbUssS0FBUixDQUFjLGlCQUFkO0FBRUgsR0FoOEMrQyxDQW04Q2hEOzs7QUFDQStFLEVBQUFBLHNCQUFzQixDQUFDOU4sR0FBRCxFQUFtQjtBQUNyQ3BCLElBQUFBLE9BQU8sQ0FBQ0MsSUFBUixDQUFhLG9DQUFiLEVBQW1EbUIsR0FBRyxDQUFDRyxhQUFKLEVBQW5ELEVBQXdFSCxHQUFHLENBQUNJLE9BQUosRUFBeEU7QUFDQSxTQUFLMEMsVUFBTCxDQUFnQjlDLEdBQWhCLEVBQXFCYSxtQ0FBaUJnTix3QkFBdEM7QUFDQSxTQUFLakcsZUFBTCxDQUFxQjVILEdBQXJCLEVBQTBCLENBQTFCLEVBSHFDLENBSXJDOztBQUNBLFFBQUltQyxJQUFJLEdBQUduQyxHQUFHLENBQUN5QixRQUFKLENBQWEsQ0FBYixDQUFYOztBQUNBLFFBQUlVLElBQUksWUFBWXRCLG1DQUFpQmtTLGNBQXJDLEVBQXFEO0FBQ2pELGFBQU8sS0FBS0MsWUFBTCxDQUFrQjdRLElBQWxCLENBQVA7QUFDSCxLQUZELE1BRU8sSUFBSUEsSUFBSSxZQUFZdEIsbUNBQWlCb1MscUJBQXJDLEVBQTREO0FBQy9ELGFBQU8sS0FBS0MsbUJBQUwsQ0FBeUIvUSxJQUF6QixDQUFQO0FBQ0g7O0FBQ0QsU0FBS1UsaUJBQUwsQ0FBdUIsS0FBS3hDLFdBQUwsQ0FBaUI4QixJQUFqQixDQUF2QjtBQUNILEdBaDlDK0MsQ0FrOUNoRDs7O0FBQ0E2RixFQUFBQSwyQkFBMkIsQ0FBQ2hJLEdBQUQsRUFBb0M7QUFDM0RwQixJQUFBQSxPQUFPLENBQUNDLElBQVIsQ0FBYSx1Q0FBYixFQUFzRG1CLEdBQUcsQ0FBQ0csYUFBSixFQUF0RCxFQUEyRUgsR0FBRyxDQUFDSSxPQUFKLEVBQTNFO0FBQ0EsU0FBSzBDLFVBQUwsQ0FBZ0I5QyxHQUFoQixFQUFxQmEsbUNBQWlCa0gsNkJBQXRDO0FBQ0EsU0FBS0gsZUFBTCxDQUFxQjVILEdBQXJCLEVBQTBCLENBQTFCO0FBQ0EsVUFBTW1DLElBQUksR0FBR25DLEdBQUcsQ0FBQ3lCLFFBQUosQ0FBYSxDQUFiLENBQWI7QUFDQSxVQUFNeUosUUFBUSxHQUFHLEtBQUtKLGlCQUFMLENBQXVCM0ksSUFBdkIsQ0FBakI7QUFDQSxXQUFPLElBQUlpSixzQkFBSixDQUFvQkYsUUFBcEIsQ0FBUDtBQUNIO0FBRUQ7Ozs7Ozs7QUFLQTRELEVBQUFBLHdCQUF3QixDQUFDOU8sR0FBRCxFQUEyQztBQUMvRHBCLElBQUFBLE9BQU8sQ0FBQ0MsSUFBUixDQUFhLHVDQUFiLEVBQXNEbUIsR0FBRyxDQUFDRyxhQUFKLEVBQXRELEVBQTJFSCxHQUFHLENBQUNJLE9BQUosRUFBM0U7QUFDQSxTQUFLMEMsVUFBTCxDQUFnQjlDLEdBQWhCLEVBQXFCYSxtQ0FBaUJnTywwQkFBdEM7QUFDQSxTQUFLakgsZUFBTCxDQUFxQjVILEdBQXJCLEVBQTBCLENBQTFCO0FBQ0EsVUFBTW1ULElBQUksR0FBRyxLQUFLM0wsZ0JBQUwsQ0FBc0J4SCxHQUFHLENBQUN5QixRQUFKLENBQWEsQ0FBYixDQUF0QixDQUFiO0FBQ0EsVUFBTXFLLFFBQVEsR0FBRyxLQUFLd0IsbUJBQUwsQ0FBeUJ0TixHQUFHLENBQUN5QixRQUFKLENBQWEsQ0FBYixDQUF6QixDQUFqQjtBQUNBLFdBQU8sSUFBSTJSLDZCQUFKLENBQTJCRCxJQUEzQixFQUFpQ3JILFFBQWpDLENBQVA7QUFDSDs7QUFFRHVILEVBQUFBLEtBQUssQ0FBQ3JULEdBQUQsRUFBeUI7QUFDMUJwQixJQUFBQSxPQUFPLENBQUNDLElBQVIsQ0FBYSxVQUFiO0FBQ0EsVUFBTXZCLE9BQU8sR0FBRyxJQUFJcUIsMEJBQUosRUFBaEI7QUFDQXFCLElBQUFBLEdBQUcsQ0FBQ3RCLE1BQUosQ0FBV3BCLE9BQVg7QUFDSCxHQTkrQytDLENBZy9DaEQ7OztBQUNBMFIsRUFBQUEsMEJBQTBCLENBQUNoUCxHQUFELEVBQTZDO0FBQ25FcEIsSUFBQUEsT0FBTyxDQUFDQyxJQUFSLENBQWEsc0NBQWIsRUFBcURtQixHQUFHLENBQUNHLGFBQUosRUFBckQsRUFBMEVILEdBQUcsQ0FBQ0ksT0FBSixFQUExRTtBQUNBLFNBQUswQyxVQUFMLENBQWdCOUMsR0FBaEIsRUFBcUJhLG1DQUFpQmtPLDRCQUF0QztBQUNBLFNBQUtuSCxlQUFMLENBQXFCNUgsR0FBckIsRUFBMEIsQ0FBMUI7QUFDQSxVQUFNbVQsSUFBSSxHQUFHLEtBQUszTCxnQkFBTCxDQUFzQnhILEdBQUcsQ0FBQ3lCLFFBQUosQ0FBYSxDQUFiLENBQXRCLENBQWI7QUFDQSxVQUFNcUssUUFBUSxHQUFHLEtBQUt6RCx1QkFBTCxDQUE2QnJJLEdBQUcsQ0FBQ3lCLFFBQUosQ0FBYSxDQUFiLENBQTdCLENBQWpCO0FBQ0EsV0FBTyxJQUFJNlIsK0JBQUosQ0FBNkJILElBQTdCLEVBQW1DckgsUUFBbkMsQ0FBUDtBQUNILEdBeC9DK0MsQ0EwL0NoRDs7O0FBQ0E4QyxFQUFBQSx5QkFBeUIsQ0FBQzVPLEdBQUQsRUFBK0I7QUFDcERwQixJQUFBQSxPQUFPLENBQUNDLElBQVIsQ0FBYSxxQ0FBYixFQUFvRG1CLEdBQUcsQ0FBQ0csYUFBSixFQUFwRCxFQUF5RUgsR0FBRyxDQUFDSSxPQUFKLEVBQXpFO0FBQ0EsU0FBSzBDLFVBQUwsQ0FBZ0I5QyxHQUFoQixFQUFxQmEsbUNBQWlCOE4sMkJBQXRDO0FBQ0EsU0FBSy9HLGVBQUwsQ0FBcUI1SCxHQUFyQixFQUEwQixDQUExQjtBQUNBLFVBQU00UixXQUFXLEdBQUc1UixHQUFHLENBQUN5QixRQUFKLENBQWEsQ0FBYixDQUFwQjtBQUNBLFVBQU05QixJQUFJLEdBQUdpUyxXQUFXLENBQUN4UixPQUFaLEVBQWIsQ0FMb0QsQ0FNcEQ7O0FBQ0EsV0FBTyxJQUFJb00saUJBQUosQ0FBZTdNLElBQWYsQ0FBUDtBQUNILEdBbmdEK0MsQ0FxZ0RoRDs7O0FBQ0E0SixFQUFBQSxlQUFlLENBQUN2SixHQUFELEVBQStCO0FBQzFDLFNBQUtELEdBQUwsQ0FBU0MsR0FBVCxFQUFjZ0QsZUFBTS9DLEtBQU4sRUFBZDtBQUNBLFNBQUs2QyxVQUFMLENBQWdCOUMsR0FBaEIsRUFBcUJhLG1DQUFpQm1KLGlCQUF0QztBQUNBLFdBQU8sSUFBSXdDLGlCQUFKLENBQWV4TSxHQUFHLENBQUN5QixRQUFKLENBQWEsQ0FBYixFQUFnQnJCLE9BQWhCLEVBQWYsQ0FBUDtBQUNILEdBMWdEK0MsQ0E0Z0RoRDs7O0FBQ0FtVCxFQUFBQSxxQkFBcUIsQ0FBQ3ZULEdBQUQsRUFBbUI7QUFDcENwQixJQUFBQSxPQUFPLENBQUNtSyxLQUFSLENBQWMsaUJBQWQ7QUFDSCxHQS9nRCtDLENBaWhEaEQ7OztBQUNBeUssRUFBQUEsb0JBQW9CLENBQUN4VCxHQUFELEVBQW1CO0FBQ25DcEIsSUFBQUEsT0FBTyxDQUFDbUssS0FBUixDQUFjLGlCQUFkO0FBQ0g7QUFFRDs7Ozs7Ozs7QUFNQW1HLEVBQUFBLGlDQUFpQyxDQUFDbFAsR0FBRCxFQUF5QztBQUN0RSxTQUFLRCxHQUFMLENBQVNDLEdBQVQsRUFBY2dELGVBQU0vQyxLQUFOLEVBQWQ7QUFDQSxTQUFLNkMsVUFBTCxDQUFnQjlDLEdBQWhCLEVBQXFCYSxtQ0FBaUJvTyxtQ0FBdEM7QUFDQSxTQUFLckgsZUFBTCxDQUFxQjVILEdBQXJCLEVBQTBCLENBQTFCO0FBQ0EsVUFBTTRSLFdBQVcsR0FBRzVSLEdBQUcsQ0FBQ3lCLFFBQUosQ0FBYSxDQUFiLENBQXBCO0FBQ0EsVUFBTW9RLFFBQVEsR0FBRzdSLEdBQUcsQ0FBQ3lCLFFBQUosQ0FBYSxDQUFiLEVBQWdCckIsT0FBaEIsRUFBakI7QUFDQSxVQUFNb0wsVUFBVSxHQUFHeEwsR0FBRyxDQUFDeUIsUUFBSixDQUFhLENBQWIsQ0FBbkI7QUFDQSxVQUFNcVEsR0FBRyxHQUFHLEtBQUt0SyxnQkFBTCxDQUFzQm9LLFdBQXRCLENBQVo7QUFDQSxVQUFNRyxHQUFHLEdBQUcsS0FBS3ZLLGdCQUFMLENBQXNCZ0UsVUFBdEIsQ0FBWixDQVJzRSxDQVV0RTs7QUFDQSxXQUFPLElBQUl3RywyQkFBSixDQUF5QkgsUUFBekIsRUFBbUNDLEdBQW5DLEVBQXdDQyxHQUFHLENBQUN2RyxVQUE1QyxDQUFQO0FBQ0gsR0F4aUQrQyxDQTBpRGhEOzs7QUFDQWlJLEVBQUFBLG1CQUFtQixDQUFDelQsR0FBRCxFQUFtQjtBQUNsQ3BCLElBQUFBLE9BQU8sQ0FBQ21LLEtBQVIsQ0FBYyxpQkFBZDtBQUVILEdBOWlEK0MsQ0FnakRoRDs7O0FBQ0EySyxFQUFBQSx1QkFBdUIsQ0FBQzFULEdBQUQsRUFBbUI7QUFDdENwQixJQUFBQSxPQUFPLENBQUNDLElBQVIsQ0FBYSxxQ0FBYixFQUFvRG1CLEdBQUcsQ0FBQ0csYUFBSixFQUFwRCxFQUF5RUgsR0FBRyxDQUFDSSxPQUFKLEVBQXpFO0FBQ0gsR0FuakQrQyxDQXFqRGhEOzs7QUFDQTRTLEVBQUFBLFlBQVksQ0FBQ2hULEdBQUQsRUFBNEI7QUFDcENwQixJQUFBQSxPQUFPLENBQUNDLElBQVIsQ0FBYSwwQkFBYixFQUF5Q21CLEdBQUcsQ0FBQ0csYUFBSixFQUF6QyxFQUE4REgsR0FBRyxDQUFDSSxPQUFKLEVBQTlEO0FBQ0EsU0FBSzBDLFVBQUwsQ0FBZ0I5QyxHQUFoQixFQUFxQmEsbUNBQWlCa1MsY0FBdEM7QUFDQSxTQUFLbkwsZUFBTCxDQUFxQjVILEdBQXJCLEVBQTBCLENBQTFCO0FBQ0EsVUFBTW1DLElBQWlCLEdBQUduQyxHQUFHLENBQUN5QixRQUFKLENBQWEsQ0FBYixDQUExQjs7QUFFQSxRQUFJVSxJQUFJLENBQUNoQyxhQUFMLE1BQXdCLENBQTVCLEVBQStCO0FBQzNCLGFBQU8sS0FBS2tOLGtCQUFMLENBQXdCbEwsSUFBeEIsQ0FBUDtBQUNILEtBRkQsTUFHSyxJQUFJQSxJQUFJLENBQUNoQyxhQUFMLE1BQXdCLENBQTVCLEVBQStCO0FBQ2hDLFVBQUlnQyxJQUFJLFlBQVl0QixtQ0FBaUJvUyxxQkFBckMsRUFBNEQ7QUFDeEQsZUFBTyxLQUFLQyxtQkFBTCxDQUF5Qi9RLElBQXpCLENBQVA7QUFDSDs7QUFDRCxXQUFLVSxpQkFBTCxDQUF1QixLQUFLeEMsV0FBTCxDQUFpQjhCLElBQWpCLENBQXZCO0FBQ0g7O0FBQ0QsU0FBS1UsaUJBQUwsQ0FBdUIsS0FBS3hDLFdBQUwsQ0FBaUI4QixJQUFqQixDQUF2QjtBQUNILEdBdGtEK0MsQ0F3a0RoRDs7O0FBQ0ErUSxFQUFBQSxtQkFBbUIsQ0FBQ2xULEdBQUQsRUFBNEI7QUFDM0NwQixJQUFBQSxPQUFPLENBQUNDLElBQVIsQ0FBYSxpQ0FBYixFQUFnRG1CLEdBQUcsQ0FBQ0csYUFBSixFQUFoRCxFQUFxRUgsR0FBRyxDQUFDSSxPQUFKLEVBQXJFO0FBQ0EsU0FBSzBDLFVBQUwsQ0FBZ0I5QyxHQUFoQixFQUFxQmEsbUNBQWlCb1MscUJBQXRDO0FBQ0EsU0FBS3JMLGVBQUwsQ0FBcUI1SCxHQUFyQixFQUEwQixDQUExQjtBQUNBLFVBQU1wQyxLQUFLLEdBQUdvQyxHQUFHLENBQUNJLE9BQUosRUFBZCxDQUoyQyxDQUszQzs7QUFDQSxVQUFNdVQsT0FBTyxHQUFHLElBQUlDLGNBQUosQ0FBWUMsTUFBTSxDQUFDalcsS0FBRCxDQUFsQixFQUEyQkEsS0FBM0IsQ0FBaEI7QUFDQSxXQUFPLEtBQUtzRSxRQUFMLENBQWN5UixPQUFkLEVBQXVCLEtBQUs5UixRQUFMLENBQWMsS0FBS1MsVUFBTCxDQUFnQnRDLEdBQUcsQ0FBQ3VELGlCQUFKLEVBQWhCLENBQWQsQ0FBdkIsQ0FBUDtBQUNIOztBQUVEOEosRUFBQUEsa0JBQWtCLENBQUNyTixHQUFELEVBQTRCO0FBQzFDcEIsSUFBQUEsT0FBTyxDQUFDQyxJQUFSLENBQWEsK0JBQWIsRUFBOENtQixHQUFHLENBQUNHLGFBQUosRUFBOUMsRUFBbUVILEdBQUcsQ0FBQ0ksT0FBSixFQUFuRTtBQUNBLFVBQU14QyxLQUFLLEdBQUdvQyxHQUFHLENBQUNJLE9BQUosRUFBZDtBQUNBLFVBQU11VCxPQUFPLEdBQUcsSUFBSUMsY0FBSixDQUFZaFcsS0FBWixFQUFtQkEsS0FBbkIsQ0FBaEI7QUFDQSxXQUFPLEtBQUtzRSxRQUFMLENBQWN5UixPQUFkLEVBQXVCLEtBQUs5UixRQUFMLENBQWMsS0FBS1MsVUFBTCxDQUFnQnRDLEdBQUcsQ0FBQ3VELGlCQUFKLEVBQWhCLENBQWQsQ0FBdkIsQ0FBUDtBQUNILEdBeGxEK0MsQ0EwbERoRDs7O0FBQ0ErSixFQUFBQSxtQkFBbUIsQ0FBQ3ROLEdBQUQsRUFBK0I7QUFDOUNwQixJQUFBQSxPQUFPLENBQUNDLElBQVIsQ0FBYSxnQ0FBYixFQUErQ21CLEdBQUcsQ0FBQ0csYUFBSixFQUEvQyxFQUFvRUgsR0FBRyxDQUFDSSxPQUFKLEVBQXBFO0FBQ0EsU0FBSzBDLFVBQUwsQ0FBZ0I5QyxHQUFoQixFQUFxQmEsbUNBQWlCaVQscUJBQXRDO0FBQ0EsU0FBS2xNLGVBQUwsQ0FBcUI1SCxHQUFyQixFQUEwQixDQUExQjtBQUNBLFVBQU1wQyxLQUFLLEdBQUdvQyxHQUFHLENBQUNJLE9BQUosRUFBZDtBQUNBLFVBQU1rSixVQUFVLEdBQUcsSUFBSWtELGlCQUFKLENBQWU1TyxLQUFmLENBQW5CO0FBQ0EsV0FBTyxLQUFLc0UsUUFBTCxDQUFjb0gsVUFBZCxFQUEwQixLQUFLekgsUUFBTCxDQUFjLEtBQUtTLFVBQUwsQ0FBZ0J0QyxHQUFHLENBQUN1RCxpQkFBSixFQUFoQixDQUFkLENBQTFCLENBQVA7QUFDSCxHQWxtRCtDLENBb21EaEQ7OztBQUNBd1EsRUFBQUEsaUJBQWlCLENBQUMvVCxHQUFELEVBQW1CO0FBQ2hDcEIsSUFBQUEsT0FBTyxDQUFDQyxJQUFSLENBQWEsd0JBQXdCbUIsR0FBRyxDQUFDSSxPQUFKLEVBQXJDO0FBQ0gsR0F2bUQrQyxDQXltRGhEOzs7QUFDQTRULEVBQUFBLFlBQVksQ0FBQ2hVLEdBQUQsRUFBbUI7QUFDM0JwQixJQUFBQSxPQUFPLENBQUNDLElBQVIsQ0FBYSxtQkFBbUJtQixHQUFHLENBQUNJLE9BQUosRUFBaEM7QUFFSCxHQTdtRCtDLENBZ25EaEQ7OztBQUNBNlQsRUFBQUEsdUJBQXVCLENBQUNqVSxHQUFELEVBQW1CO0FBQ3RDcEIsSUFBQUEsT0FBTyxDQUFDbUssS0FBUixDQUFjLGlCQUFkO0FBQ0gsR0FubkQrQyxDQXFuRGhEOzs7QUFDQW1MLEVBQUFBLFdBQVcsQ0FBQ2xVLEdBQUQsRUFBbUI7QUFDMUJwQixJQUFBQSxPQUFPLENBQUNtSyxLQUFSLENBQWMsaUJBQWQ7QUFDSCxHQXhuRCtDLENBeW5EaEQ7OztBQUNBb0wsRUFBQUEsV0FBVyxDQUFDblUsR0FBRCxFQUFtQjtBQUMxQnBCLElBQUFBLE9BQU8sQ0FBQ21LLEtBQVIsQ0FBYyxpQkFBZDtBQUNILEdBNW5EK0MsQ0E4bkRoRDs7O0FBQ0FxTCxFQUFBQSxRQUFRLENBQUNwVSxHQUFELEVBQW1CLENBRTFCLENBRk8sQ0FDSjtBQUdKOzs7QUFDQXFVLEVBQUFBLFFBQVEsQ0FBQ3JVLEdBQUQsRUFBbUI7QUFDdkJwQixJQUFBQSxPQUFPLENBQUNtSyxLQUFSLENBQWMsaUJBQWQ7QUFDSDs7QUF0b0QrQyIsInNvdXJjZXNDb250ZW50IjpbIi8qIGVzbGludC1kaXNhYmxlIEB0eXBlc2NyaXB0LWVzbGludC9leHBsaWNpdC1tb2R1bGUtYm91bmRhcnktdHlwZXMgKi9cbmltcG9ydCAqIGFzIGFudGxyNCBmcm9tIFwiYW50bHI0XCJcbmltcG9ydCB7IEVDTUFTY3JpcHRQYXJzZXJWaXNpdG9yIGFzIERlbHZlblZpc2l0b3IgfSBmcm9tIFwiLi9wYXJzZXIvRUNNQVNjcmlwdFBhcnNlclZpc2l0b3JcIlxuaW1wb3J0IHsgRUNNQVNjcmlwdFBhcnNlciBhcyBEZWx2ZW5QYXJzZXIsIEVDTUFTY3JpcHRQYXJzZXIsIFByb2dyYW1Db250ZXh0IH0gZnJvbSBcIi4vcGFyc2VyL0VDTUFTY3JpcHRQYXJzZXJcIlxuaW1wb3J0IHsgRUNNQVNjcmlwdExleGVyIGFzIERlbHZlbkxleGVyIH0gZnJvbSBcIi4vcGFyc2VyL0VDTUFTY3JpcHRMZXhlclwiXG5pbXBvcnQgeyBSdWxlQ29udGV4dCB9IGZyb20gXCJhbnRscjQvUnVsZUNvbnRleHRcIlxuaW1wb3J0IHsgUHJpbnRWaXNpdG9yIH0gZnJvbSBcIi4vUHJpbnRWaXNpdG9yXCJcbmltcG9ydCBBU1ROb2RlIGZyb20gXCIuL0FTVE5vZGVcIjtcbmltcG9ydCB7IEV4cHJlc3Npb25TdGF0ZW1lbnQsIExpdGVyYWwsIFNjcmlwdCwgQmxvY2tTdGF0ZW1lbnQsIFN0YXRlbWVudCwgU2VxdWVuY2VFeHByZXNzaW9uLCBUaHJvd1N0YXRlbWVudCwgQXNzaWdubWVudEV4cHJlc3Npb24sIElkZW50aWZpZXIsIEJpbmFyeUV4cHJlc3Npb24sIEFycmF5RXhwcmVzc2lvbiwgT2JqZWN0RXhwcmVzc2lvbiwgT2JqZWN0RXhwcmVzc2lvblByb3BlcnR5LCBQcm9wZXJ0eSwgUHJvcGVydHlLZXksIFZhcmlhYmxlRGVjbGFyYXRpb24sIFZhcmlhYmxlRGVjbGFyYXRvciwgRXhwcmVzc2lvbiwgSWZTdGF0ZW1lbnQsIENvbXB1dGVkTWVtYmVyRXhwcmVzc2lvbiwgU3RhdGljTWVtYmVyRXhwcmVzc2lvbiwgQ2xhc3NEZWNsYXJhdGlvbiwgQ2xhc3NCb2R5LCBGdW5jdGlvbkRlY2xhcmF0aW9uLCBGdW5jdGlvblBhcmFtZXRlciwgQXN5bmNGdW5jdGlvbkRlY2xhcmF0aW9uLCBBc3NpZ25tZW50UGF0dGVybiwgQmluZGluZ1BhdHRlcm4sIEJpbmRpbmdJZGVudGlmaWVyLCBBcnJheUV4cHJlc3Npb25FbGVtZW50LCBTcHJlYWRFbGVtZW50LCBBcnJvd0Z1bmN0aW9uRXhwcmVzc2lvbiwgTGFiZWxlZFN0YXRlbWVudCwgUmVzdEVsZW1lbnQgfSBmcm9tIFwiLi9ub2Rlc1wiO1xuaW1wb3J0IHsgU3ludGF4IH0gZnJvbSBcIi4vc3ludGF4XCI7XG5pbXBvcnQgeyB0eXBlIH0gZnJvbSBcIm9zXCJcbmltcG9ydCAqIGFzIGZzIGZyb20gXCJmc1wiXG5pbXBvcnQgeyBJbnRlcnZhbCB9IGZyb20gXCJhbnRscjRcIlxuaW1wb3J0IFRyYWNlLCB7IENhbGxTaXRlIH0gZnJvbSBcIi4vdHJhY2VcIlxuXG5cbi8qKlxuICogVmVyc2lvbiB0aGF0IHdlIGdlbmVyYXRlIHRoZSBBU1QgZm9yLiBcbiAqIFRoaXMgYWxsb3dzIGZvciB0ZXN0aW5nIGRpZmZlcmVudCBpbXBsZW1lbnRhdGlvbnNcbiAqIFxuICogQ3VycmVudGx5IG9ubHkgRUNNQVNjcmlwdCBpcyBzdXBwb3J0ZWRcbiAqIFxuICogaHR0cHM6Ly9naXRodWIuY29tL2VzdHJlZS9lc3RyZWVcbiAqL1xuZXhwb3J0IGVudW0gUGFyc2VyVHlwZSB7IEVDTUFTY3JpcHQgfVxuZXhwb3J0IHR5cGUgU291cmNlVHlwZSA9IFwiY29kZVwiIHwgXCJmaWxlbmFtZVwiO1xuZXhwb3J0IHR5cGUgU291cmNlQ29kZSA9IHtcbiAgICB0eXBlOiBTb3VyY2VUeXBlLFxuICAgIHZhbHVlOiBzdHJpbmdcbn1cbmV4cG9ydCBpbnRlcmZhY2UgTWFya2VyIHtcbiAgICBpbmRleDogbnVtYmVyO1xuICAgIGxpbmU6IG51bWJlcjtcbiAgICBjb2x1bW46IG51bWJlcjtcbn1cblxuZXhwb3J0IGRlZmF1bHQgYWJzdHJhY3QgY2xhc3MgQVNUUGFyc2VyIHtcbiAgICBwcml2YXRlIHZpc2l0b3I6ICh0eXBlb2YgRGVsdmVuVmlzaXRvciB8IG51bGwpXG5cbiAgICBjb25zdHJ1Y3Rvcih2aXNpdG9yPzogRGVsdmVuQVNUVmlzaXRvcikge1xuICAgICAgICB0aGlzLnZpc2l0b3IgPSB2aXNpdG9yIHx8IG5ldyBEZWx2ZW5BU1RWaXNpdG9yKCk7XG4gICAgfVxuXG4gICAgZ2VuZXJhdGUoc291cmNlOiBTb3VyY2VDb2RlKTogQVNUTm9kZSB7XG4gICAgICAgIGxldCBjb2RlO1xuICAgICAgICBzd2l0Y2ggKHNvdXJjZS50eXBlKSB7XG4gICAgICAgICAgICBjYXNlIFwiY29kZVwiOlxuICAgICAgICAgICAgICAgIGNvZGUgPSBzb3VyY2UudmFsdWU7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwiZmlsZW5hbWVcIjpcbiAgICAgICAgICAgICAgICBjb2RlID0gZnMucmVhZEZpbGVTeW5jKHNvdXJjZS52YWx1ZSwgXCJ1dGY4XCIpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGNoYXJzID0gbmV3IGFudGxyNC5JbnB1dFN0cmVhbShjb2RlKTtcbiAgICAgICAgbGV0IGxleGVyID0gbmV3IERlbHZlbkxleGVyKGNoYXJzKTtcbiAgICAgICAgbGV0IHRva2VucyA9IG5ldyBhbnRscjQuQ29tbW9uVG9rZW5TdHJlYW0obGV4ZXIpO1xuICAgICAgICBsZXQgcGFyc2VyID0gbmV3IERlbHZlblBhcnNlcih0b2tlbnMpO1xuICAgICAgICBsZXQgdHJlZSA9IHBhcnNlci5wcm9ncmFtKCk7XG4gICAgICAgIC8vIGNvbnNvbGUuaW5mbyh0cmVlLnRvU3RyaW5nVHJlZSgpKVxuICAgICAgICB0cmVlLmFjY2VwdChuZXcgUHJpbnRWaXNpdG9yKCkpO1xuICAgICAgICBjb25zb2xlLmluZm8oXCItLS0tLS0tLS0tLS0tLS0tLS0tLS1cIik7XG4gICAgICAgIGxldCByZXN1bHQgPSB0cmVlLmFjY2VwdCh0aGlzLnZpc2l0b3IpO1xuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFBhcnNlIHNvdXJjZSBhbmQgZ2VuZXJlYXRlIEFTVCB0cmVlXG4gICAgICogQHBhcmFtIHNvdXJjZSBcbiAgICAgKiBAcGFyYW0gdHlwZSBcbiAgICAgKi9cbiAgICBzdGF0aWMgcGFyc2Uoc291cmNlOiBTb3VyY2VDb2RlLCB0eXBlPzogUGFyc2VyVHlwZSk6IEFTVE5vZGUge1xuICAgICAgICBpZiAodHlwZSA9PSBudWxsKVxuICAgICAgICAgICAgdHlwZSA9IFBhcnNlclR5cGUuRUNNQVNjcmlwdDtcbiAgICAgICAgbGV0IHBhcnNlcjtcbiAgICAgICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICAgICAgICBjYXNlIFBhcnNlclR5cGUuRUNNQVNjcmlwdDpcbiAgICAgICAgICAgICAgICBwYXJzZXIgPSBuZXcgQVNUUGFyc2VyRGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJVbmtvd24gcGFyc2VyIHR5cGVcIik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHBhcnNlci5nZW5lcmF0ZShzb3VyY2UpXG4gICAgfVxufVxuXG5jbGFzcyBBU1RQYXJzZXJEZWZhdWx0IGV4dGVuZHMgQVNUUGFyc2VyIHtcblxufVxuXG5leHBvcnQgY2xhc3MgRGVsdmVuQVNUVmlzaXRvciBleHRlbmRzIERlbHZlblZpc2l0b3Ige1xuICAgIHByaXZhdGUgcnVsZVR5cGVNYXA6IE1hcDxudW1iZXIsIHN0cmluZz4gPSBuZXcgTWFwKCk7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5zZXR1cFR5cGVSdWxlcygpO1xuICAgIH1cblxuICAgIHByaXZhdGUgc2V0dXBUeXBlUnVsZXMoKSB7XG4gICAgICAgIGNvbnN0IGtleXMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhEZWx2ZW5QYXJzZXIpO1xuICAgICAgICBmb3IgKHZhciBrZXkgaW4ga2V5cykge1xuICAgICAgICAgICAgbGV0IG5hbWUgPSBrZXlzW2tleV07XG4gICAgICAgICAgICBpZiAobmFtZS5zdGFydHNXaXRoKCdSVUxFXycpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5ydWxlVHlwZU1hcC5zZXQocGFyc2VJbnQoRGVsdmVuUGFyc2VyW25hbWVdKSwgbmFtZSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgbG9nKGN0eDogUnVsZUNvbnRleHQsIGZyYW1lOiBDYWxsU2l0ZSkge1xuICAgICAgICBjb25zb2xlLmluZm8oXCIlcyBbJXNdIDogJXNcIiwgZnJhbWUuZnVuY3Rpb24sIGN0eC5nZXRDaGlsZENvdW50KCksIGN0eC5nZXRUZXh0KCkpO1xuICAgIH1cblxuICAgIHByaXZhdGUgZHVtcENvbnRleHQoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zdCBrZXlzID0gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoRGVsdmVuUGFyc2VyKTtcbiAgICAgICAgbGV0IGNvbnRleHQgPSBbXVxuICAgICAgICBmb3IgKHZhciBrZXkgaW4ga2V5cykge1xuICAgICAgICAgICAgbGV0IG5hbWUgPSBrZXlzW2tleV07XG4gICAgICAgICAgICAvLyB0aGlzIG9ubHkgdGVzdCBpbmhlcml0YW5jZVxuICAgICAgICAgICAgaWYgKG5hbWUuZW5kc1dpdGgoJ0NvbnRleHQnKSkge1xuICAgICAgICAgICAgICAgIGlmIChjdHggaW5zdGFuY2VvZiBEZWx2ZW5QYXJzZXJbbmFtZV0pIHtcbiAgICAgICAgICAgICAgICAgICAgY29udGV4dC5wdXNoKG5hbWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGRpcnkgaGFjayBmb3Igd2Fsa2luZyBhbnRsZXIgZGVwZW5jeSBjaGFpbiBcbiAgICAgICAgLy8gZmluZCBsb25nZXN0IGRlcGVuZGVuY3kgY2hhaW5nO1xuICAgICAgICAvLyB0aGlzIHRyYXZlcnNhbCBpcyBzcGVjaWZpYyB0byBBTlRMIHBhcnNlclxuICAgICAgICAvLyBXZSB3YW50IHRvIGJlIGFibGUgdG8gZmluZCBkZXBlbmRlbmNpZXMgc3VjaCBhcztcbiAgICAgICAgLypcbiAgICAgICAgICAgIC0tLS0tLS0tIC0tLS0tLS0tLS0tLVxuICAgICAgICAgICAgUHJvcGVydHlFeHByZXNzaW9uQXNzaWdubWVudENvbnRleHRcbiAgICAgICAgICAgICoqIFByb3BlcnR5QXNzaWdubWVudENvbnRleHRcbiAgICAgICAgICAgICoqIFBhcnNlclJ1bGVDb250ZXh0XG4gICAgICAgICAgICAtLS0tLS0tLSAtLS0tLS0tLS0tLS1cbiAgICAgICAgICAgIFByb3BlcnR5QXNzaWdubWVudENvbnRleHRcbiAgICAgICAgICAgICoqIFBhcnNlclJ1bGVDb250ZXh0XG4gICAgICAgICAqL1xuICAgICAgICBpZiAoY29udGV4dC5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICBsZXQgY29udGV4dE5hbWU7XG4gICAgICAgICAgICBsZXQgbG9uZ2VzdCA9IDA7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGtleSBpbiBjb250ZXh0KSB7XG4gICAgICAgICAgICAgICAgY29uc3QgbmFtZSA9IGNvbnRleHRba2V5XTtcbiAgICAgICAgICAgICAgICBsZXQgb2JqID0gRUNNQVNjcmlwdFBhcnNlcltuYW1lXTtcbiAgICAgICAgICAgICAgICBsZXQgY2hhaW4gPSAxO1xuICAgICAgICAgICAgICAgIGRvIHtcbiAgICAgICAgICAgICAgICAgICAgKytjaGFpbjtcbiAgICAgICAgICAgICAgICAgICAgb2JqID0gRUNNQVNjcmlwdFBhcnNlcltvYmoucHJvdG90eXBlLl9fcHJvdG9fXy5jb25zdHJ1Y3Rvci5uYW1lXTtcbiAgICAgICAgICAgICAgICB9IHdoaWxlIChvYmogJiYgb2JqLnByb3RvdHlwZSlcbiAgICAgICAgICAgICAgICBpZiAoY2hhaW4gPiBsb25nZXN0KSB7XG4gICAgICAgICAgICAgICAgICAgIGxvbmdlc3QgPSBjaGFpbjtcbiAgICAgICAgICAgICAgICAgICAgY29udGV4dE5hbWUgPSBgJHtuYW1lfSBbICoqICR7Y2hhaW59XWA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIFtjb250ZXh0TmFtZV07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNvbnRleHQ7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBkdW1wQ29udGV4dEFsbENoaWxkcmVuKGN0eDogUnVsZUNvbnRleHQsIGluZGVudCA9IDApIHtcbiAgICAgICAgY29uc3QgcGFkID0gXCIgXCIucGFkU3RhcnQoaW5kZW50LCBcIlxcdFwiKTtcbiAgICAgICAgY29uc3Qgbm9kZXMgPSB0aGlzLmR1bXBDb250ZXh0KGN0eCk7XG4gICAgICAgIGlmIChub2Rlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBjb25zdCBtYXJrZXIgPSBpbmRlbnQgPT0gMCA/IFwiICMgXCIgOiBcIiAqIFwiO1xuICAgICAgICAgICAgY29uc29sZS5pbmZvKHBhZCArIG1hcmtlciArIG5vZGVzKVxuICAgICAgICB9XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY3R4LmdldENoaWxkQ291bnQoKTsgKytpKSB7XG4gICAgICAgICAgICBsZXQgY2hpbGQgPSBjdHg/LmdldENoaWxkKGkpO1xuICAgICAgICAgICAgaWYgKGNoaWxkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5kdW1wQ29udGV4dEFsbENoaWxkcmVuKGNoaWxkLCArK2luZGVudCk7XG4gICAgICAgICAgICAgICAgLS1pbmRlbnQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXQgcnVsZSBuYW1lIGJ5IHRoZSBJZFxuICAgICAqIEBwYXJhbSBpZCBcbiAgICAgKi9cbiAgICBnZXRSdWxlQnlJZChpZDogbnVtYmVyKTogc3RyaW5nIHwgdW5kZWZpbmVkIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucnVsZVR5cGVNYXAuZ2V0KGlkKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFzTWFya2VyKG1ldGFkYXRhOiBhbnkpIHtcbiAgICAgICAgcmV0dXJuIHsgaW5kZXg6IDEsIGxpbmU6IDEsIGNvbHVtbjogMSB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBkZWNvcmF0ZShub2RlOiBhbnksIG1hcmtlcjogTWFya2VyKTogYW55IHtcbiAgICAgICAgbm9kZS5zdGFydCA9IDA7XG4gICAgICAgIG5vZGUuZW5kID0gMDtcbiAgICAgICAgcmV0dXJuIG5vZGU7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc01ldGFkYXRhKGludGVydmFsOiBJbnRlcnZhbCk6IGFueSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBzdGFydDoge1xuICAgICAgICAgICAgICAgIGxpbmU6IDEsXG4gICAgICAgICAgICAgICAgY29sdW1uOiBpbnRlcnZhbC5zdGFydCxcbiAgICAgICAgICAgICAgICBvZmZzZXQ6IDBcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBlbmQ6IHtcbiAgICAgICAgICAgICAgICBsaW5lOiAxLFxuICAgICAgICAgICAgICAgIGNvbHVtbjogaW50ZXJ2YWwuc3RvcCxcbiAgICAgICAgICAgICAgICBvZmZzZXQ6IDNcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgdGhyb3dUeXBlRXJyb3IodHlwZUlkOiBhbnkpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlVuaGFuZGxlZCB0eXBlIDogXCIgKyB0eXBlSWQgKyBcIiA6IFwiICsgdGhpcy5nZXRSdWxlQnlJZCh0eXBlSWQpKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUaHJvdyBUeXBlRXJyb3Igb25seSB3aGVuIHRoZXJlIGlzIGEgdHlwZSBwcm92aWRlZC4gXG4gICAgICogVGhpcyBpcyB1c2VmdWxsIHdoZW4gdGhlcmUgbm9kZSBpdGEgVGVybWluYWxOb2RlIFxuICAgICAqIEBwYXJhbSB0eXBlIFxuICAgICAqL1xuICAgIHByaXZhdGUgdGhyb3dJbnNhbmNlRXJyb3IodHlwZTogYW55KTogdm9pZCB7XG4gICAgICAgIC8qICAgICAgICAgaWYgKHR5cGUgPT0gdW5kZWZpbmVkIHx8IHR5cGUgPT0gXCJcIikge1xuICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9ICovXG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJVbmhhbmRsZWQgaW5zdGFuY2UgdHlwZSA6IFwiICsgdHlwZSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc3NlcnRUeXBlKGN0eDogUnVsZUNvbnRleHQsIHR5cGU6IGFueSk6IHZvaWQge1xuICAgICAgICBpZiAoIShjdHggaW5zdGFuY2VvZiB0eXBlKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkludmFsaWQgdHlwZSBleHBlY3RlZCA6ICdcIiArIHR5cGUubmFtZSArIFwiJyByZWNlaXZlZCAnXCIgKyB0aGlzLmR1bXBDb250ZXh0KGN0eCkpICsgXCInXCI7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNwcm9ncmFtLlxuICAgIHZpc2l0UHJvZ3JhbShjdHg6IFJ1bGVDb250ZXh0KTogU2NyaXB0IHtcbiAgICAgICAgdGhpcy5sb2coY3R4LCBUcmFjZS5mcmFtZSgpKVxuICAgICAgICB0aGlzLmFzc2VydFR5cGUoY3R4LCBFQ01BU2NyaXB0UGFyc2VyLlByb2dyYW1Db250ZXh0KVxuICAgICAgICAvLyB2aXNpdFByb2dyYW0gLT52aXNpdFNvdXJjZUVsZW1lbnRzIC0+IHZpc2l0U291cmNlRWxlbWVudCAtPiB2aXNpdFN0YXRlbWVudFxuICAgICAgICBjb25zdCBzdGF0ZW1lbnRzID0gW107XG4gICAgICAgIGNvbnN0IG5vZGUgPSBjdHguZ2V0Q2hpbGQoMCk7ICAvLyB2aXNpdFByb2dyYW0gLT52aXNpdFNvdXJjZUVsZW1lbnRzIFxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5vZGUuZ2V0Q2hpbGRDb3VudCgpOyArK2kpIHtcbiAgICAgICAgICAgIGNvbnN0IHN0bSA9IG5vZGUuZ2V0Q2hpbGQoaSkuZ2V0Q2hpbGQoMCk7IC8vIFNvdXJjZUVsZW1lbnRzQ29udGV4dCA+IFN0YXRlbWVudENvbnRleHRcbiAgICAgICAgICAgIGlmIChzdG0gaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLlN0YXRlbWVudENvbnRleHQpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBzdGF0ZW1lbnQgPSB0aGlzLnZpc2l0U3RhdGVtZW50KHN0bSk7XG4gICAgICAgICAgICAgICAgc3RhdGVtZW50cy5wdXNoKHN0YXRlbWVudCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMudGhyb3dJbnNhbmNlRXJyb3IodGhpcy5kdW1wQ29udGV4dChzdG0pKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjb25zdCBpbnRlcnZhbCA9IGN0eC5nZXRTb3VyY2VJbnRlcnZhbCgpO1xuICAgICAgICBjb25zdCBzY3JpcHQgPSBuZXcgU2NyaXB0KHN0YXRlbWVudHMpO1xuICAgICAgICByZXR1cm4gdGhpcy5kZWNvcmF0ZShzY3JpcHQsIHRoaXMuYXNNYXJrZXIodGhpcy5hc01ldGFkYXRhKGludGVydmFsKSkpO1xuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI3N0YXRlbWVudC5cbiAgICAvKipcbiAgICAgKiBzdGF0ZW1lbnRcbiAgICAgKiAgIDogYmxvY2tcbiAgICAgKiAgIHwgdmFyaWFibGVTdGF0ZW1lbnRcbiAgICAgKiAgIHwgaW1wb3J0U3RhdGVtZW50XG4gICAgICogICB8IGV4cG9ydFN0YXRlbWVudFxuICAgICAqICAgfCBlbXB0eVN0YXRlbWVudFxuICAgICAqICAgfCBjbGFzc0RlY2xhcmF0aW9uXG4gICAgICogICB8IGV4cHJlc3Npb25TdGF0ZW1lbnRcbiAgICAgKiAgIHwgaWZTdGF0ZW1lbnRcbiAgICAgKiAgIHwgaXRlcmF0aW9uU3RhdGVtZW50XG4gICAgICogICB8IGNvbnRpbnVlU3RhdGVtZW50XG4gICAgICogICB8IGJyZWFrU3RhdGVtZW50XG4gICAgICogICB8IHJldHVyblN0YXRlbWVudFxuICAgICAqICAgfCB5aWVsZFN0YXRlbWVudFxuICAgICAqICAgfCB3aXRoU3RhdGVtZW50XG4gICAgICogICB8IGxhYmVsbGVkU3RhdGVtZW50XG4gICAgICogICB8IHN3aXRjaFN0YXRlbWVudFxuICAgICAqICAgfCB0aHJvd1N0YXRlbWVudFxuICAgICAqICAgfCB0cnlTdGF0ZW1lbnRcbiAgICAgKiAgIHwgZGVidWdnZXJTdGF0ZW1lbnRcbiAgICAgKiAgIHwgZnVuY3Rpb25EZWNsYXJhdGlvblxuICAgICAqICAgO1xuICAgICAqIEBwYXJhbSBjdHggXG4gICAgICovXG4gICAgdmlzaXRTdGF0ZW1lbnQoY3R4OiBSdWxlQ29udGV4dCk6IGFueSB7XG4gICAgICAgIHRoaXMubG9nKGN0eCwgVHJhY2UuZnJhbWUoKSlcbiAgICAgICAgdGhpcy5hc3NlcnRUeXBlKGN0eCwgRUNNQVNjcmlwdFBhcnNlci5TdGF0ZW1lbnRDb250ZXh0KVxuICAgICAgICBjb25zdCBub2RlOiBSdWxlQ29udGV4dCA9IGN0eC5nZXRDaGlsZCgwKTtcblxuICAgICAgICBpZiAobm9kZSBpbnN0YW5jZW9mIEVDTUFTY3JpcHRQYXJzZXIuQmxvY2tDb250ZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy52aXNpdEJsb2NrKG5vZGUpO1xuICAgICAgICB9IGVsc2UgaWYgKG5vZGUgaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLlZhcmlhYmxlU3RhdGVtZW50Q29udGV4dCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmlzaXRWYXJpYWJsZVN0YXRlbWVudChub2RlKTtcbiAgICAgICAgfSBlbHNlIGlmIChub2RlIGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5JbXBvcnRTdGF0ZW1lbnRDb250ZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy52aXNpdEltcG9ydFN0YXRlbWVudChub2RlKTtcbiAgICAgICAgfSBlbHNlIGlmIChub2RlIGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5FeHBvcnRTdGF0ZW1lbnRDb250ZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy52aXNpdEV4cG9ydFN0YXRlbWVudChub2RlKTtcbiAgICAgICAgfSBlbHNlIGlmIChub2RlIGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5FbXB0eVN0YXRlbWVudENvbnRleHQpIHtcbiAgICAgICAgICAgIC8vIE5PT1AsXG4gICAgICAgIH0gZWxzZSBpZiAobm9kZSBpbnN0YW5jZW9mIEVDTUFTY3JpcHRQYXJzZXIuQ2xhc3NEZWNsYXJhdGlvbkNvbnRleHQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnZpc2l0Q2xhc3NEZWNsYXJhdGlvbihub2RlKTtcbiAgICAgICAgfSBlbHNlIGlmIChub2RlIGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5FeHByZXNzaW9uU3RhdGVtZW50Q29udGV4dCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmlzaXRFeHByZXNzaW9uU3RhdGVtZW50KG5vZGUpO1xuICAgICAgICB9IGVsc2UgaWYgKG5vZGUgaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLklmU3RhdGVtZW50Q29udGV4dCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmlzaXRJZlN0YXRlbWVudChub2RlKTtcbiAgICAgICAgfSBlbHNlIGlmIChub2RlIGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5JdGVyYXRpb25TdGF0ZW1lbnRDb250ZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy52aXNpdEl0ZXJhdGlvblN0YXRlbWVudChub2RlKTtcbiAgICAgICAgfSBlbHNlIGlmIChub2RlIGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5Db250aW51ZVN0YXRlbWVudENvbnRleHQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnZpc2l0Q29udGludWVTdGF0ZW1lbnQobm9kZSk7XG4gICAgICAgIH0gZWxzZSBpZiAobm9kZSBpbnN0YW5jZW9mIEVDTUFTY3JpcHRQYXJzZXIuQnJlYWtTdGF0ZW1lbnRDb250ZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy52aXNpdEJyZWFrU3RhdGVtZW50KG5vZGUpO1xuICAgICAgICB9IGVsc2UgaWYgKG5vZGUgaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLlJldHVyblN0YXRlbWVudENvbnRleHQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnZpc2l0UmV0dXJuU3RhdGVtZW50KG5vZGUpO1xuICAgICAgICB9IGVsc2UgaWYgKG5vZGUgaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLllpZWxkU3RhdGVtZW50Q29udGV4dCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmlzaXRZaWVsZFN0YXRlbWVudChub2RlKTtcbiAgICAgICAgfSBlbHNlIGlmIChub2RlIGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5XaXRoU3RhdGVtZW50Q29udGV4dCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmlzaXRXaXRoU3RhdGVtZW50KG5vZGUpO1xuICAgICAgICB9IGVsc2UgaWYgKG5vZGUgaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLkxhYmVsbGVkU3RhdGVtZW50Q29udGV4dCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmlzaXRMYWJlbGxlZFN0YXRlbWVudChub2RlKTtcbiAgICAgICAgfSBlbHNlIGlmIChub2RlIGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5Td2l0Y2hTdGF0ZW1lbnRDb250ZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy52aXNpdFN3aXRjaFN0YXRlbWVudChub2RlKTtcbiAgICAgICAgfSBlbHNlIGlmIChub2RlIGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5GdW5jdGlvbkV4cHJlc3Npb25Db250ZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy52aXNpdEZ1bmN0aW9uRXhwcmVzc2lvbihub2RlKTtcbiAgICAgICAgfSBlbHNlIGlmIChub2RlIGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5UaHJvd1N0YXRlbWVudENvbnRleHQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnZpc2l0VGhyb3dTdGF0ZW1lbnQobm9kZSk7XG4gICAgICAgIH0gZWxzZSBpZiAobm9kZSBpbnN0YW5jZW9mIEVDTUFTY3JpcHRQYXJzZXIuVHJ5U3RhdGVtZW50Q29udGV4dCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmlzaXRUcnlTdGF0ZW1lbnQobm9kZSk7XG4gICAgICAgIH0gZWxzZSBpZiAobm9kZSBpbnN0YW5jZW9mIEVDTUFTY3JpcHRQYXJzZXIuRGVidWdnZXJTdGF0ZW1lbnRDb250ZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy52aXNpdERlYnVnZ2VyU3RhdGVtZW50KG5vZGUpO1xuICAgICAgICB9IGVsc2UgaWYgKG5vZGUgaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLkZ1bmN0aW9uRGVjbGFyYXRpb25Db250ZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy52aXNpdEZ1bmN0aW9uRGVjbGFyYXRpb24obm9kZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnRocm93SW5zYW5jZUVycm9yKHRoaXMuZHVtcENvbnRleHQobm9kZSkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdmlzaXRJbXBvcnRTdGF0ZW1lbnQoY3R4OiBSdWxlQ29udGV4dCk6IGFueSB7XG4gICAgICAgIHRoaXMubG9nKGN0eCwgVHJhY2UuZnJhbWUoKSlcbiAgICAgICAgdGhpcy5hc3NlcnRUeXBlKGN0eCwgRUNNQVNjcmlwdFBhcnNlci5JbXBvcnRTdGF0ZW1lbnRDb250ZXh0KVxuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwibm90IGltcGxlbWVudGVkXCIpO1xuICAgIH1cblxuICAgIHZpc2l0RXhwb3J0U3RhdGVtZW50KGN0eDogUnVsZUNvbnRleHQpOiBhbnkge1xuICAgICAgICB0aGlzLmxvZyhjdHgsIFRyYWNlLmZyYW1lKCkpXG4gICAgICAgIHRoaXMuYXNzZXJ0VHlwZShjdHgsIEVDTUFTY3JpcHRQYXJzZXIuRXhwb3J0U3RhdGVtZW50Q29udGV4dClcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIm5vdCBpbXBsZW1lbnRlZFwiKTtcbiAgICB9XG5cbiAgICB2aXNpdEl0ZXJhdGlvblN0YXRlbWVudChjdHg6IFJ1bGVDb250ZXh0KTogYW55IHtcbiAgICAgICAgdGhpcy5sb2coY3R4LCBUcmFjZS5mcmFtZSgpKVxuICAgICAgICB0aGlzLmFzc2VydFR5cGUoY3R4LCBFQ01BU2NyaXB0UGFyc2VyLkl0ZXJhdGlvblN0YXRlbWVudENvbnRleHQpXG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJub3QgaW1wbGVtZW50ZWRcIik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjYmxvY2suXG4gICAgICogLy8vIEJsb2NrIDpcbiAgICAgKiAvLy8gICAgIHsgU3RhdGVtZW50TGlzdD8gfVxuICAgICAqL1xuICAgIHZpc2l0QmxvY2soY3R4OiBSdWxlQ29udGV4dCk6IEJsb2NrU3RhdGVtZW50IHtcbiAgICAgICAgdGhpcy5sb2coY3R4LCBUcmFjZS5mcmFtZSgpKVxuICAgICAgICB0aGlzLmFzc2VydFR5cGUoY3R4LCBFQ01BU2NyaXB0UGFyc2VyLkJsb2NrQ29udGV4dClcbiAgICAgICAgY29uc3QgYm9keSA9IFtdO1xuICAgICAgICBmb3IgKGxldCBpID0gMTsgaSA8IGN0eC5nZXRDaGlsZENvdW50KCkgLSAxOyArK2kpIHtcbiAgICAgICAgICAgIGNvbnN0IG5vZGU6IFJ1bGVDb250ZXh0ID0gY3R4LmdldENoaWxkKGkpO1xuICAgICAgICAgICAgaWYgKG5vZGUgaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLlN0YXRlbWVudExpc3RDb250ZXh0KSB7XG4gICAgICAgICAgICAgICAgY29uc3Qgc3RhdGVtZW50TGlzdCA9IHRoaXMudmlzaXRTdGF0ZW1lbnRMaXN0KG5vZGUpO1xuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgaW5kZXggaW4gc3RhdGVtZW50TGlzdCkge1xuICAgICAgICAgICAgICAgICAgICBib2R5LnB1c2goc3RhdGVtZW50TGlzdFtpbmRleF0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy50aHJvd0luc2FuY2VFcnJvcih0aGlzLmR1bXBDb250ZXh0KG5vZGUpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5kZWNvcmF0ZShuZXcgQmxvY2tTdGF0ZW1lbnQoYm9keSksIHRoaXMuYXNNYXJrZXIodGhpcy5hc01ldGFkYXRhKGN0eC5nZXRTb3VyY2VJbnRlcnZhbCgpKSkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI3N0YXRlbWVudExpc3QuXG4gICAgICogIHN0YXRlbWVudExpc3RcbiAgICAgKiAgICA6IHN0YXRlbWVudCtcbiAgICAgKiAgICA7XG4gICAgICogQHBhcmFtIGN0eCBcbiAgICAgKi9cbiAgICB2aXNpdFN0YXRlbWVudExpc3QoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICB0aGlzLmxvZyhjdHgsIFRyYWNlLmZyYW1lKCkpXG4gICAgICAgIHRoaXMuYXNzZXJ0VHlwZShjdHgsIEVDTUFTY3JpcHRQYXJzZXIuU3RhdGVtZW50TGlzdENvbnRleHQpXG4gICAgICAgIGNvbnN0IG5vZGVzID0gdGhpcy5maWx0ZXJTeW1ib2xzKGN0eCk7XG4gICAgICAgIGNvbnN0IGJvZHkgPSBbXTtcbiAgICAgICAgZm9yIChjb25zdCBub2RlIG9mIG5vZGVzKSB7XG4gICAgICAgICAgICBpZiAobm9kZSBpbnN0YW5jZW9mIEVDTUFTY3JpcHRQYXJzZXIuU3RhdGVtZW50Q29udGV4dCkge1xuICAgICAgICAgICAgICAgIGJvZHkucHVzaCh0aGlzLnZpc2l0U3RhdGVtZW50KG5vZGUpKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy50aHJvd1R5cGVFcnJvcih0eXBlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYm9keTtcbiAgICB9XG5cbiAgICB2aXNpdFZhcmlhYmxlU3RhdGVtZW50KGN0eDogUnVsZUNvbnRleHQpOiBWYXJpYWJsZURlY2xhcmF0aW9uIHtcbiAgICAgICAgdGhpcy5sb2coY3R4LCBUcmFjZS5mcmFtZSgpKTtcbiAgICAgICAgdGhpcy5hc3NlcnRUeXBlKGN0eCwgRUNNQVNjcmlwdFBhcnNlci5WYXJpYWJsZVN0YXRlbWVudENvbnRleHQpXG4gICAgICAgIGNvbnN0IG5vZGUgPSB0aGlzLmdldFR5cGVkUnVsZUNvbnRleHQoY3R4LCBFQ01BU2NyaXB0UGFyc2VyLlZhcmlhYmxlRGVjbGFyYXRpb25MaXN0Q29udGV4dCk7XG4gICAgICAgIHJldHVybiB0aGlzLnZpc2l0VmFyaWFibGVEZWNsYXJhdGlvbkxpc3Qobm9kZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0IHRoZSB0eXBlIHJ1bGUgY29udGV4dFxuICAgICAqIEV4YW1wbGVcbiAgICAgKiA8Y29kZT5cbiAgICAgKiAgIGNvbnN0IG5vZGUgPSB0aGlzLmdldFR5cGVkUnVsZUNvbnRleHQoY3R4LCBFQ01BU2NyaXB0UGFyc2VyLlZhcmlhYmxlRGVjbGFyYXRpb25MaXN0Q29udGV4dCk7XG4gICAgICogPC9jb2RlPlxuICAgICAqIEBwYXJhbSBjdHggXG4gICAgICogQHBhcmFtIHR5cGUgXG4gICAgICogQHBhcmFtIGluZGV4IFxuICAgICAqL1xuICAgIHByaXZhdGUgZ2V0VHlwZWRSdWxlQ29udGV4dChjdHg6IFJ1bGVDb250ZXh0LCB0eXBlOiBhbnksIGluZGV4ID0gMCk6IGFueSB7XG4gICAgICAgIHJldHVybiBjdHguZ2V0VHlwZWRSdWxlQ29udGV4dCh0eXBlLCBpbmRleCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogPHByZT5cbiAgICAgKiB2YXJpYWJsZURlY2xhcmF0aW9uTGlzdFxuICAgICAqICAgOiB2YXJNb2RpZmllciB2YXJpYWJsZURlY2xhcmF0aW9uICgnLCcgdmFyaWFibGVEZWNsYXJhdGlvbikqXG4gICAgICogICA7XG4gICAgICogPC9wcmU+XG4gICAgICogQHBhcmFtIGN0eCBcbiAgICAgKi9cbiAgICB2aXNpdFZhcmlhYmxlRGVjbGFyYXRpb25MaXN0KGN0eDogUnVsZUNvbnRleHQpOiBWYXJpYWJsZURlY2xhcmF0aW9uIHtcbiAgICAgICAgdGhpcy5sb2coY3R4LCBUcmFjZS5mcmFtZSgpKTtcbiAgICAgICAgdGhpcy5hc3NlcnRUeXBlKGN0eCwgRUNNQVNjcmlwdFBhcnNlci5WYXJpYWJsZURlY2xhcmF0aW9uTGlzdENvbnRleHQpXG4gICAgICAgIGNvbnN0IHZhck1vZGlmaWVyQ29udGV4dCA9IHRoaXMuZ2V0VHlwZWRSdWxlQ29udGV4dChjdHgsIEVDTUFTY3JpcHRQYXJzZXIuVmFyTW9kaWZpZXJDb250ZXh0LCAwKTtcbiAgICAgICAgY29uc3QgdmFyTW9kaWZpZXIgPSB2YXJNb2RpZmllckNvbnRleHQuZ2V0VGV4dCgpO1xuICAgICAgICBjb25zdCBkZWNsYXJhdGlvbnM6IFZhcmlhYmxlRGVjbGFyYXRvcltdID0gW107XG4gICAgICAgIGZvciAoY29uc3Qgbm9kZSBvZiB0aGlzLmZpbHRlclN5bWJvbHMoY3R4KSkge1xuICAgICAgICAgICAgaWYgKG5vZGUgaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLlZhcmlhYmxlRGVjbGFyYXRpb25Db250ZXh0KSB7XG4gICAgICAgICAgICAgICAgZGVjbGFyYXRpb25zLnB1c2godGhpcy52aXNpdFZhcmlhYmxlRGVjbGFyYXRpb24obm9kZSkpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyBWYXJpYWJsZURlY2xhcmF0aW9uKGRlY2xhcmF0aW9ucywgdmFyTW9kaWZpZXIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciN2YXJpYWJsZURlY2xhcmF0aW9uLlxuICAgICAqICB2YXJpYWJsZURlY2xhcmF0aW9uXG4gICAgICogICAgOiBhc3NpZ25hYmxlICgnPScgc2luZ2xlRXhwcmVzc2lvbik/IC8vIEVDTUFTY3JpcHQgNjogQXJyYXkgJiBPYmplY3QgTWF0Y2hpbmdcbiAgICAgKiAgICA7XG4gICAgICogQHBhcmFtIGN0eCBWYXJpYWJsZURlY2xhcmF0aW9uQ29udGV4dFxuICAgICAqL1xuICAgIC8vIFxuICAgIHZpc2l0VmFyaWFibGVEZWNsYXJhdGlvbihjdHg6IFJ1bGVDb250ZXh0KTogVmFyaWFibGVEZWNsYXJhdG9yIHtcbiAgICAgICAgdGhpcy5sb2coY3R4LCBUcmFjZS5mcmFtZSgpKVxuICAgICAgICB0aGlzLmFzc2VydFR5cGUoY3R4LCBFQ01BU2NyaXB0UGFyc2VyLlZhcmlhYmxlRGVjbGFyYXRpb25Db250ZXh0KVxuICAgICAgICBjb25zdCBhc3NpZ25hYmxlQ29udGV4dCA9IHRoaXMuZ2V0VHlwZWRSdWxlQ29udGV4dChjdHgsIEVDTUFTY3JpcHRQYXJzZXIuQXNzaWduYWJsZUNvbnRleHQsIDApO1xuICAgICAgICBjb25zdCBhc3NpZ25hYmxlID0gdGhpcy52aXNpdEFzc2lnbmFibGUoYXNzaWduYWJsZUNvbnRleHQpO1xuICAgICAgICAvLyBjb25zb2xlLmluZm8oYXNzaWduYWJsZSlcbiAgICAgICAgbGV0IGluaXQgPSBudWxsO1xuICAgICAgICBpZiAoY3R4LmdldENoaWxkQ291bnQoKSA9PSAzKSB7XG4gICAgICAgICAgICBpbml0ID0gdGhpcy5zaW5nbGVFeHByZXNzaW9uKGN0eC5nZXRDaGlsZCgyKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyBWYXJpYWJsZURlY2xhcmF0b3IoYXNzaWduYWJsZSwgaW5pdCk7XG4gICAgfVxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjaW5pdGlhbGlzZXIuXG4gICAgdmlzaXRJbml0aWFsaXNlcihjdHg6IFJ1bGVDb250ZXh0KTogT2JqZWN0RXhwcmVzc2lvbiB8IEFycmF5RXhwcmVzc2lvbiB8IHVuZGVmaW5lZCB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0SW5pdGlhbGlzZXIgWyVzXSA6ICVzXCIsIGN0eC5nZXRDaGlsZENvdW50KCksIGN0eC5nZXRUZXh0KCkpO1xuICAgICAgICB0aGlzLmFzc2VydFR5cGUoY3R4LCBFQ01BU2NyaXB0UGFyc2VyLkluaXRpYWxpc2VyQ29udGV4dClcbiAgICAgICAgdGhpcy5hc3NlcnROb2RlQ291bnQoY3R4LCAyKTtcbiAgICAgICAgY29uc3Qgbm9kZTogUnVsZUNvbnRleHQgPSBjdHguZ2V0Q2hpbGQoMSk7XG5cbiAgICAgICAgaWYgKG5vZGUgaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLk9iamVjdExpdGVyYWxFeHByZXNzaW9uQ29udGV4dCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmlzaXRPYmplY3RMaXRlcmFsRXhwcmVzc2lvbihub2RlKTtcbiAgICAgICAgfSBlbHNlIGlmIChub2RlIGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5BcnJheUxpdGVyYWxFeHByZXNzaW9uQ29udGV4dCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmlzaXRBcnJheUxpdGVyYWxFeHByZXNzaW9uKG5vZGUpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMudGhyb3dJbnNhbmNlRXJyb3IodGhpcy5kdW1wQ29udGV4dChub2RlKSlcbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNlbXB0eVN0YXRlbWVudC5cbiAgICB2aXNpdEVtcHR5U3RhdGVtZW50KGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgdGhpcy5sb2coY3R4LCBUcmFjZS5mcmFtZSgpKVxuICAgIH1cblxuICAgIHByaXZhdGUgYXNzZXJ0Tm9kZUNvdW50KGN0eDogUnVsZUNvbnRleHQsIGNvdW50OiBudW1iZXIpIHtcbiAgICAgICAgaWYgKGN0eC5nZXRDaGlsZENvdW50KCkgIT0gY291bnQpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIldyb25nIGNoaWxkIGNvdW50LCBleHBlY3RlZCAnXCIgKyBjb3VudCArIFwiJyBnb3QgOiBcIiArIGN0eC5nZXRDaGlsZENvdW50KCkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjZXhwcmVzc2lvblN0YXRlbWVudC5cbiAgICAgKiBcbiAgICAgKiBleHByZXNzaW9uU3RhdGVtZW50XG4gICAgICogIDoge3RoaXMubm90T3BlbkJyYWNlQW5kTm90RnVuY3Rpb24oKX0/IGV4cHJlc3Npb25TZXF1ZW5jZSBlb3NcbiAgICAgKiAgO1xuICAgICAqIEBwYXJhbSBjdHggXG4gICAgICovXG4gICAgdmlzaXRFeHByZXNzaW9uU3RhdGVtZW50KGN0eDogUnVsZUNvbnRleHQpOiBFeHByZXNzaW9uU3RhdGVtZW50IHwgdW5kZWZpbmVkIHtcbiAgICAgICAgY29uc29sZS5pbmZvKFwidmlzaXRFeHByZXNzaW9uU3RhdGVtZW50IFslc10gOiAlc1wiLCBjdHguZ2V0Q2hpbGRDb3VudCgpLCBjdHguZ2V0VGV4dCgpKTtcbiAgICAgICAgdGhpcy5hc3NlcnRUeXBlKGN0eCwgRUNNQVNjcmlwdFBhcnNlci5FeHByZXNzaW9uU3RhdGVtZW50Q29udGV4dClcbiAgICAgICAgLy8gdmlzaXRFeHByZXNzaW9uU3RhdGVtZW50Oj52aXNpdEV4cHJlc3Npb25TZXF1ZW5jZVxuICAgICAgICBjb25zdCBub2RlOiBSdWxlQ29udGV4dCA9IGN0eC5nZXRDaGlsZCgwKTsgLy8gdmlzaXRFeHByZXNzaW9uU2VxdWVuY2UgXG4gICAgICAgIGxldCBleHBcbiAgICAgICAgaWYgKG5vZGUgaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLkV4cHJlc3Npb25TZXF1ZW5jZUNvbnRleHQpIHtcbiAgICAgICAgICAgIGV4cCA9IHRoaXMudmlzaXRFeHByZXNzaW9uU2VxdWVuY2Uobm9kZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnRocm93SW5zYW5jZUVycm9yKHRoaXMuZHVtcENvbnRleHQobm9kZSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGV4cCAvL3RoaXMuZGVjb3JhdGUoZXhwLCB0aGlzLmFzTWFya2VyKHRoaXMuYXNNZXRhZGF0YShjdHguZ2V0U291cmNlSW50ZXJ2YWwoKSkpKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIGlmU3RhdGVtZW50XG4gICAgICogICA6IElmICcoJyBleHByZXNzaW9uU2VxdWVuY2UgJyknIHN0YXRlbWVudCAoIEVsc2Ugc3RhdGVtZW50ICk/XG4gICAgICogICA7XG4gICAgICovXG4gICAgdmlzaXRJZlN0YXRlbWVudChjdHg6IFJ1bGVDb250ZXh0KTogSWZTdGF0ZW1lbnQge1xuICAgICAgICB0aGlzLmxvZyhjdHgsIFRyYWNlLmZyYW1lKCkpXG4gICAgICAgIHRoaXMuYXNzZXJ0VHlwZShjdHgsIEVDTUFTY3JpcHRQYXJzZXIuSWZTdGF0ZW1lbnRDb250ZXh0KVxuICAgICAgICBjb25zdCBjb3VudCA9IGN0eC5nZXRDaGlsZENvdW50KCk7XG4gICAgICAgIGNvbnN0IHRlc3QgPSB0aGlzLnZpc2l0RXhwcmVzc2lvblNlcXVlbmNlKGN0eC5nZXRDaGlsZCgyKSk7XG4gICAgICAgIGNvbnN0IGNvbnNlcXVlbnQgPSB0aGlzLnZpc2l0U3RhdGVtZW50KGN0eC5nZXRDaGlsZCg0KSk7XG4gICAgICAgIGNvbnN0IGFsdGVybmF0ZSA9IGNvdW50ID09IDcgPyB0aGlzLnZpc2l0U3RhdGVtZW50KGN0eC5nZXRDaGlsZCg2KSkgOiB1bmRlZmluZWQ7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBJZlN0YXRlbWVudCh0ZXN0LCBjb25zZXF1ZW50LCBhbHRlcm5hdGUpO1xuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI0RvU3RhdGVtZW50LlxuICAgIHZpc2l0RG9TdGF0ZW1lbnQoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJ2aXNpdERvU3RhdGVtZW50OiBcIiArIGN0eC5nZXRUZXh0KCkpO1xuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI1doaWxlU3RhdGVtZW50LlxuICAgIHZpc2l0V2hpbGVTdGF0ZW1lbnQoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJ2aXNpdFdoaWxlU3RhdGVtZW50OiBcIiArIGN0eC5nZXRUZXh0KCkpO1xuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI0ZvclN0YXRlbWVudC5cbiAgICB2aXNpdEZvclN0YXRlbWVudChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0V2hpbGVTdGF0ZW1lbnQ6IFwiICsgY3R4LmdldFRleHQoKSk7XG4gICAgfVxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjRm9yVmFyU3RhdGVtZW50LlxuICAgIHZpc2l0Rm9yVmFyU3RhdGVtZW50KGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNGb3JJblN0YXRlbWVudC5cbiAgICB2aXNpdEZvckluU3RhdGVtZW50KGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNGb3JWYXJJblN0YXRlbWVudC5cbiAgICB2aXNpdEZvclZhckluU3RhdGVtZW50KGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNjb250aW51ZVN0YXRlbWVudC5cbiAgICB2aXNpdENvbnRpbnVlU3RhdGVtZW50KGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcblxuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2JyZWFrU3RhdGVtZW50LlxuICAgIHZpc2l0QnJlYWtTdGF0ZW1lbnQoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuXG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNyZXR1cm5TdGF0ZW1lbnQuXG4gICAgdmlzaXRSZXR1cm5TdGF0ZW1lbnQoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuXG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciN3aXRoU3RhdGVtZW50LlxuICAgIHZpc2l0V2l0aFN0YXRlbWVudChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG5cbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI3N3aXRjaFN0YXRlbWVudC5cbiAgICB2aXNpdFN3aXRjaFN0YXRlbWVudChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG5cbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2Nhc2VCbG9jay5cbiAgICB2aXNpdENhc2VCbG9jayhjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG5cbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2Nhc2VDbGF1c2VzLlxuICAgIHZpc2l0Q2FzZUNsYXVzZXMoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuXG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNjYXNlQ2xhdXNlLlxuICAgIHZpc2l0Q2FzZUNsYXVzZShjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG5cbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2RlZmF1bHRDbGF1c2UuXG4gICAgdmlzaXREZWZhdWx0Q2xhdXNlKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFxuICAgICAqIGxhYmVsbGVkU3RhdGVtZW50XG4gICAgICogICA6IGlkZW50aWZpZXIgJzonIHN0YXRlbWVudFxuICAgICAqICAgOyBcbiAgICAgKi9cbiAgICB2aXNpdExhYmVsbGVkU3RhdGVtZW50KGN0eDogUnVsZUNvbnRleHQpOiBMYWJlbGVkU3RhdGVtZW50IHtcbiAgICAgICAgdGhpcy5sb2coY3R4LCBUcmFjZS5mcmFtZSgpKVxuICAgICAgICB0aGlzLmFzc2VydFR5cGUoY3R4LCBFQ01BU2NyaXB0UGFyc2VyLkxhYmVsbGVkU3RhdGVtZW50Q29udGV4dClcbiAgICAgICAgY29uc3QgaWRlbnRpZmllciA9IHRoaXMudmlzaXRJZGVudGlmaWVyKGN0eC5nZXRDaGlsZCgwKSk7XG4gICAgICAgIGNvbnN0IHN0YXRlbWVudCA9IHRoaXMudmlzaXRTdGF0ZW1lbnQoY3R4LmdldENoaWxkKDIpKTtcbiAgICAgICAgcmV0dXJuIG5ldyBMYWJlbGVkU3RhdGVtZW50KGlkZW50aWZpZXIsIHN0YXRlbWVudCk7XG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciN0aHJvd1N0YXRlbWVudC5cbiAgICB2aXNpdFRocm93U3RhdGVtZW50KGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI3RyeVN0YXRlbWVudC5cbiAgICB2aXNpdFRyeVN0YXRlbWVudChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG5cbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2NhdGNoUHJvZHVjdGlvbi5cbiAgICB2aXNpdENhdGNoUHJvZHVjdGlvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG5cbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2ZpbmFsbHlQcm9kdWN0aW9uLlxuICAgIHZpc2l0RmluYWxseVByb2R1Y3Rpb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuXG4gICAgfVxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjZGVidWdnZXJTdGF0ZW1lbnQuXG4gICAgdmlzaXREZWJ1Z2dlclN0YXRlbWVudChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG5cbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNmdW5jdGlvbkRlY2xhcmF0aW9uLlxuICAgIHZpc2l0RnVuY3Rpb25EZWNsYXJhdGlvbihjdHg6IFJ1bGVDb250ZXh0KTogRnVuY3Rpb25EZWNsYXJhdGlvbiB8IEFzeW5jRnVuY3Rpb25EZWNsYXJhdGlvbiB7XG4gICAgICAgIHRoaXMubG9nKGN0eCwgVHJhY2UuZnJhbWUoKSk7XG4gICAgICAgIHRoaXMuYXNzZXJ0VHlwZShjdHgsIEVDTUFTY3JpcHRQYXJzZXIuRnVuY3Rpb25EZWNsYXJhdGlvbkNvbnRleHQpO1xuICAgICAgICBsZXQgYXN5bmMgPSBmYWxzZTtcbiAgICAgICAgbGV0IGdlbmVyYXRvciA9IGZhbHNlO1xuICAgICAgICBsZXQgaWRlbnRpZmllcjogSWRlbnRpZmllcjtcbiAgICAgICAgbGV0IHBhcmFtcztcbiAgICAgICAgbGV0IGJvZHk7XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjdHguZ2V0Q2hpbGRDb3VudCgpOyArK2kpIHtcbiAgICAgICAgICAgIGNvbnN0IG5vZGUgPSBjdHguZ2V0Q2hpbGQoaSk7XG4gICAgICAgICAgICBpZiAobm9kZS5zeW1ib2wpIHtcbiAgICAgICAgICAgICAgICBjb25zdCB0eHQgPSBub2RlLmdldFRleHQoKTtcbiAgICAgICAgICAgICAgICBpZiAodHh0ID09ICdhc3luYycpIHtcbiAgICAgICAgICAgICAgICAgICAgYXN5bmMgPSB0cnVlXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0eHQgPT0gJyonKSB7XG4gICAgICAgICAgICAgICAgICAgIGdlbmVyYXRvciA9IHRydWVcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChub2RlIGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5JZGVudGlmaWVyQ29udGV4dCkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuaW5mbyhcIkVDTUFTY3JpcHRQYXJzZXIgOzsgSWRlbnRpZmllckNvbnRleHRcIilcbiAgICAgICAgICAgICAgICBpZGVudGlmaWVyID0gdGhpcy52aXNpdElkZW50aWZpZXIobm9kZSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG5vZGUgaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLkZvcm1hbFBhcmFtZXRlckxpc3RDb250ZXh0KSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5pbmZvKFwiRUNNQVNjcmlwdFBhcnNlciA7OyBGb3JtYWxQYXJhbWV0ZXJMaXN0Q29udGV4dFwiKVxuICAgICAgICAgICAgICAgIHBhcmFtcyA9IHRoaXMudmlzaXRGb3JtYWxQYXJhbWV0ZXJMaXN0KG5vZGUpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChub2RlIGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5GdW5jdGlvbkJvZHlDb250ZXh0KSB7XG4gICAgICAgICAgICAgICAgLy8gYm9keSA9IHRoaXMudmlzaXRGdW5jdGlvbkJvZHkobm9kZSk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5pbmZvKFwiRUNNQVNjcmlwdFBhcnNlciA7OyBGb3JtYWxQYXJhbWV0ZXJMaXN0Q29udGV4dFwiKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLmR1bXBDb250ZXh0QWxsQ2hpbGRyZW4obm9kZSlcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnNvbGUuaW5mbygnYXN5bmMgID0gJyArIGFzeW5jKTtcbiAgICAgICAgY29uc29sZS5pbmZvKCdnZW5lcmF0b3IgID0gJyArIGdlbmVyYXRvcik7XG5cbiAgICAgICAgaWYgKGFzeW5jKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IEFzeW5jRnVuY3Rpb25EZWNsYXJhdGlvbihpZGVudGlmaWVyLCBwYXJhbXMsIGJvZHksIGdlbmVyYXRvcik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyAgY29uc3RydWN0b3IoaWQ6IElkZW50aWZpZXIgfCBudWxsLCBwYXJhbXM6IEZ1bmN0aW9uUGFyYW1ldGVyW10sIGJvZHk6IEJsb2NrU3RhdGVtZW50LCBnZW5lcmF0b3I6IGJvb2xlYW4pIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgRnVuY3Rpb25EZWNsYXJhdGlvbihpZGVudGlmaWVyLCBwYXJtYXMsIGJvZHksIGdlbmVyYXRvcik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNmdW5jdGlvbkRlY2xcbiAgICB2aXNpdEZ1bmN0aW9uRGVjbChjdHg6IFJ1bGVDb250ZXh0KTogRnVuY3Rpb25EZWNsYXJhdGlvbiB7XG4gICAgICAgIHRoaXMubG9nKGN0eCwgVHJhY2UuZnJhbWUoKSk7XG4gICAgICAgIHRoaXMuYXNzZXJ0VHlwZShjdHgsIEVDTUFTY3JpcHRQYXJzZXIuRnVuY3Rpb25EZWNsQ29udGV4dCk7XG4gICAgICAgIHJldHVybiB0aGlzLnZpc2l0RnVuY3Rpb25EZWNsYXJhdGlvbihjdHguZ2V0Q2hpbGQoMCkpXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjZnVuY3Rpb25Cb2R5LlxuICAgICAqIFxuICAgICAqIGZ1bmN0aW9uQm9keVxuICAgICAqICA6IHNvdXJjZUVsZW1lbnRzP1xuICAgICAqICA7XG4gICAgICogQHBhcmFtIGN0eCBcbiAgICAgKi9cbiAgICB2aXNpdEZ1bmN0aW9uQm9keShjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIHRoaXMubG9nKGN0eCwgVHJhY2UuZnJhbWUoKSk7XG4gICAgICAgIHRoaXMuYXNzZXJ0VHlwZShjdHgsIEVDTUFTY3JpcHRQYXJzZXIuRnVuY3Rpb25Cb2R5Q29udGV4dClcbiAgICAgICAgY29uc3Qgc291cmNlRWxlbWVudHNDb250ZXh0ID0gdGhpcy5nZXRUeXBlZFJ1bGVDb250ZXh0KGN0eCwgRUNNQVNjcmlwdFBhcnNlci5Tb3VyY2VFbGVtZW50c0NvbnRleHQpO1xuICAgICAgICBpZiAoc291cmNlRWxlbWVudHNDb250ZXh0ICE9IG51bGwpIHtcbiAgICAgICAgICAgIGNvbnN0IHN0YXRlbWVudCA9IHRoaXMudmlzaXRTb3VyY2VFbGVtZW50cyhzb3VyY2VFbGVtZW50c0NvbnRleHQpO1xuICAgICAgICAgICAgcmV0dXJuIHN0YXRlbWVudDtcbiAgICAgICAgfVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJub3QgaW1wbGVtZW50ZWRcIilcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAgc291cmNlRWxlbWVudHNcbiAgICAgKiAgICA6IHNvdXJjZUVsZW1lbnQrXG4gICAgICogICAgO1xuICAgICAqIEBwYXJhbSBjdHggXG4gICAgICovXG4gICAgdmlzaXRTb3VyY2VFbGVtZW50cyhjdHg6IFJ1bGVDb250ZXh0KTogYW55W10ge1xuICAgICAgICB0aGlzLmxvZyhjdHgsIFRyYWNlLmZyYW1lKCkpO1xuICAgICAgICB0aGlzLmFzc2VydFR5cGUoY3R4LCBFQ01BU2NyaXB0UGFyc2VyLlNvdXJjZUVsZW1lbnRzQ29udGV4dClcbiAgICAgICAgY29uc3Qgc3RhdGVtZW50cyA9IFtdXG4gICAgICAgIGZvciAoY29uc3Qgbm9kZSBvZiBjdHguc291cmNlRWxlbWVudCgpKSB7XG4gICAgICAgICAgICBjb25zdCBzdGF0ZW1lbnQgPSB0aGlzLnZpc2l0U3RhdGVtZW50KG5vZGUuc3RhdGVtZW50KCkpXG4gICAgICAgICAgICBjb25zb2xlLmluZm8oc3RhdGVtZW50KVxuICAgICAgICAgICAgc3RhdGVtZW50cy5wdXNoKHN0YXRlbWVudCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHN0YXRlbWVudHM7XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNhcnJheUxpdGVyYWwuXG4gICAgICogYXJyYXlMaXRlcmFsXG4gICAgICogIDogKCdbJyBlbGVtZW50TGlzdCAnXScpXG4gICAgICogIDtcbiAgICAgKiBAcGFyYW0gY3R4IFxuICAgICAqL1xuICAgIHZpc2l0QXJyYXlMaXRlcmFsKGN0eDogUnVsZUNvbnRleHQpOiBBcnJheUV4cHJlc3Npb24ge1xuICAgICAgICB0aGlzLmxvZyhjdHgsIFRyYWNlLmZyYW1lKCkpO1xuICAgICAgICB0aGlzLmFzc2VydFR5cGUoY3R4LCBFQ01BU2NyaXB0UGFyc2VyLkFycmF5TGl0ZXJhbENvbnRleHQpXG4gICAgICAgIGNvbnN0IGVsZW1lbnRMaXN0Q29udGV4dCA9IHRoaXMuZ2V0VHlwZWRSdWxlQ29udGV4dChjdHgsIEVDTUFTY3JpcHRQYXJzZXIuRWxlbWVudExpc3RDb250ZXh0KVxuICAgICAgICBjb25zdCBlbGVtZW50czogQXJyYXlFeHByZXNzaW9uRWxlbWVudFtdID0gdGhpcy52aXNpdEVsZW1lbnRMaXN0KGVsZW1lbnRMaXN0Q29udGV4dCk7XG4gICAgICAgIHJldHVybiBuZXcgQXJyYXlFeHByZXNzaW9uKGVsZW1lbnRzKVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2VsZW1lbnRMaXN0LlxuICAgICAqIFxuICAgICAqIGVsZW1lbnRMaXN0XG4gICAgICogIDogJywnKiBhcnJheUVsZW1lbnQ/ICgnLCcrIGFycmF5RWxlbWVudCkqICcsJyogLy8gWWVzLCBldmVyeXRoaW5nIGlzIG9wdGlvbmFsXG4gICAgICogIDtcbiAgICAgKiBAcGFyYW0gY3R4IFxuICAgICAqL1xuICAgIHZpc2l0RWxlbWVudExpc3QoY3R4OiBSdWxlQ29udGV4dCk6IEFycmF5RXhwcmVzc2lvbkVsZW1lbnRbXSB7XG4gICAgICAgIHRoaXMubG9nKGN0eCwgVHJhY2UuZnJhbWUoKSk7XG4gICAgICAgIHRoaXMuYXNzZXJ0VHlwZShjdHgsIEVDTUFTY3JpcHRQYXJzZXIuRWxlbWVudExpc3RDb250ZXh0KVxuICAgICAgICBjb25zdCBlbGVtZW50czogQXJyYXlFeHByZXNzaW9uRWxlbWVudFtdID0gW107XG4gICAgICAgIGZvciAoY29uc3Qgbm9kZSBvZiB0aGlzLml0ZXJhYmxlKGN0eCkpIHtcbiAgICAgICAgICAgIC8vZWxsaXNvbiBjaGVja1xuICAgICAgICAgICAgaWYgKG5vZGUuc3ltYm9sICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAvLyBjb21wbGlhbmNlOiBlc3ByaW1hIGNvbXBsaWFuZSBvZiByZXR1cm5pbmcgYG51bGxgIFxuICAgICAgICAgICAgICAgIGVsZW1lbnRzLnB1c2gobnVsbClcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudHMucHVzaCh0aGlzLnZpc2l0QXJyYXlFbGVtZW50KG5vZGUpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZWxlbWVudHM7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBpdGVyYWJsZShjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnN0IG5vZGVzID0gW107XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY3R4LmdldENoaWxkQ291bnQoKTsgKytpKSB7XG4gICAgICAgICAgICBub2Rlcy5wdXNoKGN0eC5nZXRDaGlsZChpKSlcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbm9kZXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjYXJyYXlFbGVtZW50LlxuICAgICAqIFxuICAgICAqIGFycmF5RWxlbWVudFxuICAgICAqICA6IEVsbGlwc2lzPyBzaW5nbGVFeHByZXNzaW9uXG4gICAgICogIDtcbiAgICAgKiBAcGFyYW0gY3R4IFxuICAgICAqL1xuICAgIHZpc2l0QXJyYXlFbGVtZW50KGN0eDogUnVsZUNvbnRleHQpOiBBcnJheUV4cHJlc3Npb25FbGVtZW50IHtcbiAgICAgICAgdGhpcy5sb2coY3R4LCBUcmFjZS5mcmFtZSgpKTtcbiAgICAgICAgdGhpcy5hc3NlcnRUeXBlKGN0eCwgRUNNQVNjcmlwdFBhcnNlci5BcnJheUVsZW1lbnRDb250ZXh0KVxuXG4gICAgICAgIGlmIChjdHguZ2V0Q2hpbGRDb3VudCgpID09IDEpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNpbmdsZUV4cHJlc3Npb24oY3R4LmdldENoaWxkKDApKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IGV4cHJlc3Npb24gPSB0aGlzLnNpbmdsZUV4cHJlc3Npb24oY3R4LmdldENoaWxkKDEpKTtcbiAgICAgICAgICAgIHJldHVybiBuZXcgU3ByZWFkRWxlbWVudChleHByZXNzaW9uKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI29iamVjdExpdGVyYWwuXG4gICAgICogb2JqZWN0TGl0ZXJhbFxuICAgICAqICA6ICd7JyAocHJvcGVydHlBc3NpZ25tZW50ICgnLCcgcHJvcGVydHlBc3NpZ25tZW50KSopPyAnLCc/ICd9J1xuICAgICAqICA7XG4gICAgICogQHBhcmFtIGN0eCBcbiAgICAgKi9cbiAgICB2aXNpdE9iamVjdExpdGVyYWwoY3R4OiBSdWxlQ29udGV4dCk6IE9iamVjdEV4cHJlc3Npb24ge1xuICAgICAgICB0aGlzLmxvZyhjdHgsIFRyYWNlLmZyYW1lKCkpXG4gICAgICAgIHRoaXMuYXNzZXJ0VHlwZShjdHgsIEVDTUFTY3JpcHRQYXJzZXIuT2JqZWN0TGl0ZXJhbENvbnRleHQpO1xuICAgICAgICBpZiAoY3R4LmdldENoaWxkQ291bnQoKSA9PSAyKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IE9iamVjdEV4cHJlc3Npb24oW10pO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qgbm9kZXMgPSB0aGlzLmZpbHRlclN5bWJvbHMoY3R4KTtcbiAgICAgICAgY29uc3QgcHJvcGVydGllczogT2JqZWN0RXhwcmVzc2lvblByb3BlcnR5W10gPSBbXTtcbiAgICAgICAgZm9yIChjb25zdCBub2RlIG9mIG5vZGVzKSB7XG4gICAgICAgICAgICBsZXQgcHJvcGVydHk6IE9iamVjdEV4cHJlc3Npb25Qcm9wZXJ0eTtcbiAgICAgICAgICAgIGlmIChub2RlIGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5Qcm9wZXJ0eUV4cHJlc3Npb25Bc3NpZ25tZW50Q29udGV4dCkge1xuICAgICAgICAgICAgICAgIHByb3BlcnR5ID0gdGhpcy52aXNpdFByb3BlcnR5RXhwcmVzc2lvbkFzc2lnbm1lbnQobm9kZSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG5vZGUgaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLlByb3BlcnR5U2hvcnRoYW5kQ29udGV4dCkge1xuICAgICAgICAgICAgICAgIHByb3BlcnR5ID0gdGhpcy52aXNpdFByb3BlcnR5U2hvcnRoYW5kKG5vZGUpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChub2RlIGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5GdW5jdGlvblByb3BlcnR5Q29udGV4dCkge1xuICAgICAgICAgICAgICAgIHByb3BlcnR5ID0gdGhpcy52aXNpdEZ1bmN0aW9uUHJvcGVydHkobm9kZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMudGhyb3dJbnNhbmNlRXJyb3IodGhpcy5kdW1wQ29udGV4dChub2RlKSlcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHByb3BlcnR5ICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHByb3BlcnRpZXMucHVzaChwcm9wZXJ0eSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3IE9iamVjdEV4cHJlc3Npb24ocHJvcGVydGllcyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjcHJvcGVydHlTaG9ydGhhbmQuXG4gICAgICogIHwgRWxsaXBzaXM/IHNpbmdsZUV4cHJlc3Npb24gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIyBQcm9wZXJ0eVNob3J0aGFuZFxuICAgICAqIEBwYXJhbSBjdHggXG4gICAgICovXG4gICAgdmlzaXRQcm9wZXJ0eVNob3J0aGFuZChjdHg6IFJ1bGVDb250ZXh0KTogT2JqZWN0RXhwcmVzc2lvblByb3BlcnR5IHtcbiAgICAgICAgdGhpcy5sb2coY3R4LCBUcmFjZS5mcmFtZSgpKTtcbiAgICAgICAgdGhpcy5hc3NlcnRUeXBlKGN0eCwgRUNNQVNjcmlwdFBhcnNlci5Qcm9wZXJ0eVNob3J0aGFuZENvbnRleHQpXG4gICAgICAgIGNvbnN0IGNvbXB1dGVkID0gZmFsc2U7XG4gICAgICAgIGNvbnN0IG1ldGhvZCA9IGZhbHNlO1xuICAgICAgICBjb25zdCBzaG9ydGhhbmQgPSB0cnVlO1xuICAgICAgICBjb25zdCB2YWx1ZSA9IHRoaXMuc2luZ2xlRXhwcmVzc2lvbihjdHguZ2V0Q2hpbGQoMCkpO1xuICAgICAgICBjb25zdCBrZXk6IFByb3BlcnR5S2V5ID0gbmV3IElkZW50aWZpZXIoY3R4LmdldFRleHQoKSlcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9wZXJ0eShcImluaXRcIiwga2V5LCBjb21wdXRlZCwgdmFsdWUsIG1ldGhvZCwgc2hvcnRoYW5kKTtcbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNwcm9wZXJ0eVNob3J0aGFuZC5cbiAgICB2aXNpdEZ1bmN0aW9uUHJvcGVydHkoY3R4OiBSdWxlQ29udGV4dCk6IE9iamVjdEV4cHJlc3Npb25Qcm9wZXJ0eSB7XG4gICAgICAgIHRoaXMubG9nKGN0eCwgVHJhY2UuZnJhbWUoKSk7XG4gICAgICAgIHRoaXMuYXNzZXJ0VHlwZShjdHgsIEVDTUFTY3JpcHRQYXJzZXIuRnVuY3Rpb25Qcm9wZXJ0eUNvbnRleHQpXG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJub3QgaW1wbGVtZW50ZWRcIilcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBGaWx0ZXIgb3V0IFRlcm1pbmFsTm9kZXMgKGNvbW1hcywgcGlwZXMsIGJyYWNrZXRzKVxuICAgICAqIEBwYXJhbSBjdHggXG4gICAgICovXG4gICAgcHJpdmF0ZSBmaWx0ZXJTeW1ib2xzKGN0eDogUnVsZUNvbnRleHQpOiBSdWxlQ29udGV4dFtdIHtcbiAgICAgICAgY29uc3QgZmlsdGVyZWQ6IFJ1bGVDb250ZXh0W10gPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjdHguZ2V0Q2hpbGRDb3VudCgpOyArK2kpIHtcbiAgICAgICAgICAgIGNvbnN0IG5vZGUgPSBjdHguZ2V0Q2hpbGQoaSk7XG4gICAgICAgICAgICAvLyB0aGVyZSBtaWdodCBiZSBhIGJldHRlciB3YXlcbiAgICAgICAgICAgIGlmIChub2RlLnN5bWJvbCAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZpbHRlcmVkLnB1c2gobm9kZSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZpbHRlcmVkO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI1Byb3BlcnR5RXhwcmVzc2lvbkFzc2lnbm1lbnQuXG4gICAgICogcHJvcGVydHlBc3NpZ25tZW50XG4gICAgICogICAgIDogcHJvcGVydHlOYW1lICc6JyBzaW5nbGVFeHByZXNzaW9uICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIyBQcm9wZXJ0eUV4cHJlc3Npb25Bc3NpZ25tZW50XG4gICAgICogICAgIHwgJ1snIHNpbmdsZUV4cHJlc3Npb24gJ10nICc6JyBzaW5nbGVFeHByZXNzaW9uICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIyBDb21wdXRlZFByb3BlcnR5RXhwcmVzc2lvbkFzc2lnbm1lbnRcbiAgICAgKiAgICAgfCBBc3luYz8gJyonPyBwcm9wZXJ0eU5hbWUgJygnIGZvcm1hbFBhcmFtZXRlckxpc3Q/ICAnKScgICd7JyBmdW5jdGlvbkJvZHkgJ30nICAjIEZ1bmN0aW9uUHJvcGVydHlcbiAgICAgKiAgICAgfCBnZXR0ZXIgJygnICcpJyAneycgZnVuY3Rpb25Cb2R5ICd9JyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAjIFByb3BlcnR5R2V0dGVyXG4gICAgICogICAgIHwgc2V0dGVyICcoJyBmb3JtYWxQYXJhbWV0ZXJBcmcgJyknICd7JyBmdW5jdGlvbkJvZHkgJ30nICAgICAgICAgICAgICAgICAgICAgICAgIyBQcm9wZXJ0eVNldHRlclxuICAgICAqICAgICB8IEVsbGlwc2lzPyBzaW5nbGVFeHByZXNzaW9uICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICMgUHJvcGVydHlTaG9ydGhhbmRcbiAgICAgKiAgICAgO1xuICAgICAqL1xuICAgIHZpc2l0UHJvcGVydHlFeHByZXNzaW9uQXNzaWdubWVudChjdHg6IFJ1bGVDb250ZXh0KTogT2JqZWN0RXhwcmVzc2lvblByb3BlcnR5IHtcbiAgICAgICAgdGhpcy5sb2coY3R4LCBUcmFjZS5mcmFtZSgpKTtcbiAgICAgICAgdGhpcy5hc3NlcnRUeXBlKGN0eCwgRUNNQVNjcmlwdFBhcnNlci5Qcm9wZXJ0eUV4cHJlc3Npb25Bc3NpZ25tZW50Q29udGV4dCk7XG5cbiAgICAgICAgbGV0IG5vZGUgPSBjdHguZ2V0Q2hpbGQoMCk7XG5cbiAgICAgICAgdGhpcy5kdW1wQ29udGV4dEFsbENoaWxkcmVuKGN0eClcbiAgICAgICAgbGV0IG4wID0gY3R4LmdldENoaWxkKDApOyAvLyBQcm9wZXJ0eU5hbWVcbiAgICAgICAgbGV0IG4xID0gY3R4LmdldENoaWxkKDEpOyAvLyBzeW1ib2wgOlxuICAgICAgICBsZXQgbjIgPSBjdHguZ2V0Q2hpbGQoMik7IC8vICBzaW5nbGVFeHByZXNzaW9uIFxuICAgICAgICBsZXQga2V5OiBQcm9wZXJ0eUtleSA9IHRoaXMudmlzaXRQcm9wZXJ0eU5hbWUobjApO1xuICAgICAgICBsZXQgdmFsdWU7XG4gICAgICAgIGNvbnN0IGNvbXB1dGVkID0gZmFsc2U7XG4gICAgICAgIGNvbnN0IG1ldGhvZCA9IGZhbHNlO1xuICAgICAgICBjb25zdCBzaG9ydGhhbmQgPSBmYWxzZTtcblxuICAgICAgICBpZiAobjIgaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLlByb3BlcnR5RXhwcmVzc2lvbkFzc2lnbm1lbnRDb250ZXh0KSB7XG4gICAgICAgICAgICBjb25zb2xlLmluZm8oJyAtLSBQcm9wZXJ0eUV4cHJlc3Npb25Bc3NpZ25tZW50Q29udGV4dCcpXG4gICAgICAgICAgICBrZXkgPSB0aGlzLnZpc2l0UHJvcGVydHlOYW1lKG4wKTtcbiAgICAgICAgfSBlbHNlIGlmIChuMiBpbnN0YW5jZW9mIEVDTUFTY3JpcHRQYXJzZXIuQ29tcHV0ZWRQcm9wZXJ0eUV4cHJlc3Npb25Bc3NpZ25tZW50Q29udGV4dCkge1xuICAgICAgICAgICAgY29uc29sZS5pbmZvKCcgLS0gQ29tcHV0ZWRQcm9wZXJ0eUV4cHJlc3Npb25Bc3NpZ25tZW50Q29udGV4dCcpXG4gICAgICAgIH0gZWxzZSBpZiAobjIgaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLkZ1bmN0aW9uUHJvcGVydHlDb250ZXh0KSB7XG4gICAgICAgICAgICBjb25zb2xlLmluZm8oJyAtLSBGdW5jdGlvblByb3BlcnR5Q29udGV4dCcpXG4gICAgICAgIH0gZWxzZSBpZiAobjIgaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLlByb3BlcnR5R2V0dGVyQ29udGV4dCkge1xuICAgICAgICAgICAgY29uc29sZS5pbmZvKCcgLS0gUHJvcGVydHlHZXR0ZXJDb250ZXh0JylcbiAgICAgICAgfSBlbHNlIGlmIChuMiBpbnN0YW5jZW9mIEVDTUFTY3JpcHRQYXJzZXIuUHJvcGVydHlTZXR0ZXJDb250ZXh0KSB7XG4gICAgICAgICAgICBjb25zb2xlLmluZm8oJyAtLSBQcm9wZXJ0eVNldHRlckNvbnRleHQnKVxuICAgICAgICB9IGVsc2UgaWYgKG4yIGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5Qcm9wZXJ0eVNob3J0aGFuZENvbnRleHQpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuaW5mbygnIC0tIFByb3BlcnR5U2hvcnRoYW5kQ29udGV4dCcpXG4gICAgICAgIH1cbiAgICAgICAgLy8gdGhpcy5zaW5nbGVFeHByZXNzaW9uKG4yKTtcblxuICAgICAgICByZXR1cm4gbmV3IFByb3BlcnR5KFwiaW5pdFwiLCBrZXksIGNvbXB1dGVkLCB2YWx1ZSwgbWV0aG9kLCBzaG9ydGhhbmQpO1xuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI1Byb3BlcnR5R2V0dGVyLlxuICAgIHZpc2l0UHJvcGVydHlHZXR0ZXIoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuXG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNQcm9wZXJ0eVNldHRlci5cbiAgICB2aXNpdFByb3BlcnR5U2V0dGVyKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI3Byb3BlcnR5TmFtZS5cbiAgICAgKiBcbiAgICAgKiBwcm9wZXJ0eU5hbWVcbiAgICAgKiAgOiBpZGVudGlmaWVyTmFtZVxuICAgICAqICB8IFN0cmluZ0xpdGVyYWxcbiAgICAgKiAgfCBudW1lcmljTGl0ZXJhbFxuICAgICAqICB8ICdbJyBzaW5nbGVFeHByZXNzaW9uICddJ1xuICAgICAqICA7XG4gICAgICovXG4gICAgdmlzaXRQcm9wZXJ0eU5hbWUoY3R4OiBSdWxlQ29udGV4dCk6IFByb3BlcnR5S2V5IHtcbiAgICAgICAgdGhpcy5sb2coY3R4LCBUcmFjZS5mcmFtZSgpKVxuICAgICAgICB0aGlzLmFzc2VydFR5cGUoY3R4LCBFQ01BU2NyaXB0UGFyc2VyLlByb3BlcnR5TmFtZUNvbnRleHQpO1xuICAgICAgICB0aGlzLmFzc2VydE5vZGVDb3VudChjdHgsIDEpO1xuICAgICAgICBjb25zdCBub2RlID0gY3R4LmdldENoaWxkKDApO1xuICAgICAgICBjb25zdCBjb3VudCA9IG5vZGUuZ2V0Q2hpbGRDb3VudCgpO1xuXG4gICAgICAgIGlmIChjb3VudCA9PSAwKSB7IC8vIGxpdGVyYWxcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNyZWF0ZUxpdGVyYWxWYWx1ZShub2RlKTtcbiAgICAgICAgfSBlbHNlIGlmIChjb3VudCA9PSAxKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy52aXNpdElkZW50aWZpZXJOYW1lKG5vZGUpXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy50aHJvd0luc2FuY2VFcnJvcih0aGlzLmR1bXBDb250ZXh0KG5vZGUpKTtcbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNwcm9wZXJ0eVNldFBhcmFtZXRlckxpc3QuXG4gICAgdmlzaXRQcm9wZXJ0eVNldFBhcmFtZXRlckxpc3QoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuXG4gICAgfVxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjYXJndW1lbnRzLlxuICAgIHZpc2l0QXJndW1lbnRzKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS5pbmZvKFwidmlzaXRBcmd1bWVudHM6IFwiICsgY3R4LmdldFRleHQoKSk7XG5cbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNhcmd1bWVudExpc3QuXG4gICAgdmlzaXRBcmd1bWVudExpc3QoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJ2aXNpdEFyZ3VtZW50TGlzdDogXCIgKyBjdHguZ2V0VGV4dCgpKTtcbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNleHByZXNzaW9uU2VxdWVuY2UuXG4gICAgdmlzaXRFeHByZXNzaW9uU2VxdWVuY2UoY3R4OiBSdWxlQ29udGV4dCk6IEV4cHJlc3Npb25TdGF0ZW1lbnQgfCBTZXF1ZW5jZUV4cHJlc3Npb24ge1xuICAgICAgICB0aGlzLmxvZyhjdHgsIFRyYWNlLmZyYW1lKCkpXG4gICAgICAgIHRoaXMuYXNzZXJ0VHlwZShjdHgsIEVDTUFTY3JpcHRQYXJzZXIuRXhwcmVzc2lvblNlcXVlbmNlQ29udGV4dCk7XG4gICAgICAgIGNvbnN0IGV4cHJlc3Npb25zID0gW107XG4gICAgICAgIC8vIGVhY2ggbm9kZSBpcyBhIHNpbmdsZUV4cHJlc3Npb25cbiAgICAgICAgZm9yIChjb25zdCBub2RlIG9mIHRoaXMuZmlsdGVyU3ltYm9scyhjdHgpKSB7XG4gICAgICAgICAgICAvLyBjb25zdCBub2RlOiBSdWxlQ29udGV4dCA9IGN0eC5nZXRDaGlsZChpKTtcbiAgICAgICAgICAgIGNvbnN0IGV4cCA9IHRoaXMuc2luZ2xlRXhwcmVzc2lvbihub2RlKTtcbiAgICAgICAgICAgIGV4cHJlc3Npb25zLnB1c2goZXhwKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGNvbXBsaWFuY2U6IGVzcGlybWEsIGVzcHJlZVxuICAgICAgICAvLyB0aGlzIGNoZWNrIHRvIHNlZSBpZiB0aGVyZSBhcmUgbXVsdGlwbGUgZXhwcmVzc2lvbnMgaWYgc28gdGhlbiB3ZSBsZWF2ZSB0aGVtIGFzIFNlcXVlbmNlRXhwcmVzc2lvbiBcbiAgICAgICAgLy8gb3RoZXJ3aXNlIHdlIHdpbGwgcm9sbCB0aGVtIHVwIGludG8gRXhwcmVzc2lvblN0YXRlbWVudCB3aXRoIG9uZSBleHByZXNzaW9uXG4gICAgICAgIC8vIGAxYCA9IEV4cHJlc3Npb25TdGF0ZW1lbnQgLT4gTGl0ZXJhbFxuICAgICAgICAvLyBgMSwgMmAgPSBFeHByZXNzaW9uU3RhdGVtZW50IC0+IFNlcXVlbmNlRXhwcmVzc2lvbiAtPiBMaXRlcmFsLCBMaXRlcmFsXG4gICAgICAgIGxldCBleHA7XG4gICAgICAgIGlmIChleHByZXNzaW9ucy5sZW5ndGggPT0gMSkge1xuICAgICAgICAgICAgZXhwID0gbmV3IEV4cHJlc3Npb25TdGF0ZW1lbnQoZXhwcmVzc2lvbnNbMF0pXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBleHAgPSBuZXcgU2VxdWVuY2VFeHByZXNzaW9uKGV4cHJlc3Npb25zKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5kZWNvcmF0ZShleHAsIHRoaXMuYXNNYXJrZXIodGhpcy5hc01ldGFkYXRhKGN0eC5nZXRTb3VyY2VJbnRlcnZhbCgpKSkpXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRXZhbHVhdGUgYSBzaW5nbGVFeHByZXNzaW9uXG4gICAgICogQHBhcmFtIG5vZGUgXG4gICAgICovXG4gICAgc2luZ2xlRXhwcmVzc2lvbihub2RlOiBSdWxlQ29udGV4dCk6IGFueSB7XG4gICAgICAgIGlmIChub2RlIGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5MaXRlcmFsRXhwcmVzc2lvbkNvbnRleHQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnZpc2l0TGl0ZXJhbEV4cHJlc3Npb24obm9kZSk7XG4gICAgICAgIH0gZWxzZSBpZiAobm9kZSBpbnN0YW5jZW9mIEVDTUFTY3JpcHRQYXJzZXIuT2JqZWN0TGl0ZXJhbEV4cHJlc3Npb25Db250ZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy52aXNpdE9iamVjdExpdGVyYWxFeHByZXNzaW9uKG5vZGUpO1xuICAgICAgICB9IGVsc2UgaWYgKG5vZGUgaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLkFzc2lnbm1lbnRFeHByZXNzaW9uQ29udGV4dCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmlzaXRBc3NpZ25tZW50RXhwcmVzc2lvbihub2RlKTtcbiAgICAgICAgfSBlbHNlIGlmIChub2RlIGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5BZGRpdGl2ZUV4cHJlc3Npb25Db250ZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy52aXNpdEFkZGl0aXZlRXhwcmVzc2lvbihub2RlKTtcbiAgICAgICAgfSBlbHNlIGlmIChub2RlIGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5NdWx0aXBsaWNhdGl2ZUV4cHJlc3Npb25Db250ZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy52aXNpdE11bHRpcGxpY2F0aXZlRXhwcmVzc2lvbihub2RlKTtcbiAgICAgICAgfSBlbHNlIGlmIChub2RlIGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5BcnJheUxpdGVyYWxFeHByZXNzaW9uQ29udGV4dCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmlzaXRBcnJheUxpdGVyYWxFeHByZXNzaW9uKG5vZGUpO1xuICAgICAgICB9IGVsc2UgaWYgKG5vZGUgaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLkVxdWFsaXR5RXhwcmVzc2lvbkNvbnRleHQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnZpc2l0RXF1YWxpdHlFeHByZXNzaW9uKG5vZGUpO1xuICAgICAgICB9IGVsc2UgaWYgKG5vZGUgaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLlBhcmVudGhlc2l6ZWRFeHByZXNzaW9uQ29udGV4dCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmlzaXRQYXJlbnRoZXNpemVkRXhwcmVzc2lvbihub2RlKTtcbiAgICAgICAgfSBlbHNlIGlmIChub2RlIGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5SZWxhdGlvbmFsRXhwcmVzc2lvbkNvbnRleHQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnZpc2l0UmVsYXRpb25hbEV4cHJlc3Npb24obm9kZSk7XG4gICAgICAgIH0gZWxzZSBpZiAobm9kZSBpbnN0YW5jZW9mIEVDTUFTY3JpcHRQYXJzZXIuSWRlbnRpZmllckV4cHJlc3Npb25Db250ZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy52aXNpdElkZW50aWZpZXJFeHByZXNzaW9uKG5vZGUpO1xuICAgICAgICB9IGVsc2UgaWYgKG5vZGUgaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLk1lbWJlckRvdEV4cHJlc3Npb25Db250ZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy52aXNpdE1lbWJlckRvdEV4cHJlc3Npb24obm9kZSk7XG4gICAgICAgIH0gZWxzZSBpZiAobm9kZSBpbnN0YW5jZW9mIEVDTUFTY3JpcHRQYXJzZXIuTWVtYmVySW5kZXhFeHByZXNzaW9uQ29udGV4dCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmlzaXRNZW1iZXJJbmRleEV4cHJlc3Npb24obm9kZSk7XG4gICAgICAgIH0gZWxzZSBpZiAobm9kZSBpbnN0YW5jZW9mIEVDTUFTY3JpcHRQYXJzZXIuQXNzaWdubWVudE9wZXJhdG9yRXhwcmVzc2lvbkNvbnRleHQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnZpc2l0QXNzaWdubWVudE9wZXJhdG9yRXhwcmVzc2lvbihub2RlKTtcbiAgICAgICAgfSBlbHNlIGlmIChub2RlIGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5GdW5jdGlvbkV4cHJlc3Npb25Db250ZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy52aXNpdEZ1bmN0aW9uRXhwcmVzc2lvbihub2RlKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnRocm93SW5zYW5jZUVycm9yKHRoaXMuZHVtcENvbnRleHQobm9kZSkpO1xuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2NsYXNzRGVjbGFyYXRpb24uXG4gICAgdmlzaXRDbGFzc0RlY2xhcmF0aW9uKGN0eDogUnVsZUNvbnRleHQpOiBDbGFzc0RlY2xhcmF0aW9uIHtcbiAgICAgICAgdGhpcy5sb2coY3R4LCBUcmFjZS5mcmFtZSgpKTtcbiAgICAgICAgdGhpcy5hc3NlcnRUeXBlKGN0eCwgRUNNQVNjcmlwdFBhcnNlci5DbGFzc0RlY2xhcmF0aW9uQ29udGV4dCk7XG4gICAgICAgIC8vIENsYXNzIGlkZW50aWZpZXIgY2xhc3NUYWlsXG4gICAgICAgIGNvbnN0IGlkZW50aWZpZXIgPSB0aGlzLnZpc2l0SWRlbnRpZmllcihjdHguZ2V0Q2hpbGQoMSkpO1xuICAgICAgICBjb25zdCBib2R5OiBQcm9wZXJ0eVtdID0gdGhpcy52aXNpdENsYXNzVGFpbChjdHguZ2V0Q2hpbGQoMikpXG4gICAgICAgIGNvbnN0IGNsYXNzQm9keSA9IG5ldyBDbGFzc0JvZHkoYm9keSk7XG4gICAgICAgIHJldHVybiBuZXcgQ2xhc3NEZWNsYXJhdGlvbihpZGVudGlmaWVyLCBudWxsLCBjbGFzc0JvZHkpO1xuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2NsYXNzVGFpbC5cbiAgICB2aXNpdENsYXNzVGFpbChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIHRoaXMubG9nKGN0eCwgVHJhY2UuZnJhbWUoKSk7XG4gICAgICAgIHRoaXMuYXNzZXJ0VHlwZShjdHgsIEVDTUFTY3JpcHRQYXJzZXIuQ2xhc3NUYWlsQ29udGV4dCk7XG4gICAgICAgIC8vICAoRXh0ZW5kcyBzaW5nbGVFeHByZXNzaW9uKT8gJ3snIGNsYXNzRWxlbWVudCogJ30nXG4gICAgICAgIHRoaXMuZHVtcENvbnRleHRBbGxDaGlsZHJlbihjdHgpXG4gICAgICAgIGNvbnN0IG5vZGUgPSB0aGlzLmdldE5vZGVCeVR5cGUoY3R4LCBFQ01BU2NyaXB0UGFyc2VyLkNsYXNzRWxlbWVudENvbnRleHQpO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0Tm9kZUJ5VHlwZShjdHg6IFJ1bGVDb250ZXh0LCB0eXBlOiBhbnkpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjdHguZ2V0Q2hpbGRDb3VudCgpOyArK2kpIHtcbiAgICAgICAgICAgIGlmIChjdHguZ2V0Q2hpbGQoaSkgaW5zdGFuY2VvZiB0eXBlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGN0eC5nZXRDaGlsZChpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2NsYXNzRWxlbWVudC5cbiAgICB2aXNpdENsYXNzRWxlbWVudChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIHRoaXMubG9nKGN0eCwgVHJhY2UuZnJhbWUoKSk7XG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNtZXRob2REZWZpbml0aW9uLlxuICAgIHZpc2l0TWV0aG9kRGVmaW5pdGlvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIHRoaXMubG9nKGN0eCwgVHJhY2UuZnJhbWUoKSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjZm9ybWFsUGFyYW1ldGVyTGlzdC5cbiAgICAgKiA8Y29kZT5cbiAgICAgKiBmb3JtYWxQYXJhbWV0ZXJMaXN0XG4gICAgICogICA6IGZvcm1hbFBhcmFtZXRlckFyZyAoJywnIGZvcm1hbFBhcmFtZXRlckFyZykqICgnLCcgbGFzdEZvcm1hbFBhcmFtZXRlckFyZyk/XG4gICAgICogICB8IGxhc3RGb3JtYWxQYXJhbWV0ZXJBcmdcbiAgICAgKiAgIDtcbiAgICAgKiA8L2NvZGU+XG4gICAgICogQHBhcmFtIGN0eCBcbiAgICAgKi9cbiAgICB2aXNpdEZvcm1hbFBhcmFtZXRlckxpc3QoY3R4OiBSdWxlQ29udGV4dCk6IEZ1bmN0aW9uUGFyYW1ldGVyW10ge1xuICAgICAgICB0aGlzLmxvZyhjdHgsIFRyYWNlLmZyYW1lKCkpO1xuICAgICAgICB0aGlzLmFzc2VydFR5cGUoY3R4LCBFQ01BU2NyaXB0UGFyc2VyLkZvcm1hbFBhcmFtZXRlckxpc3RDb250ZXh0KTtcbiAgICAgICAgY29uc3QgZm9ybWFsOiBGdW5jdGlvblBhcmFtZXRlcltdID0gW11cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjdHguZ2V0Q2hpbGRDb3VudCgpOyArK2kpIHtcbiAgICAgICAgICAgIGNvbnN0IG5vZGUgPSBjdHguZ2V0Q2hpbGQoaSk7XG4gICAgICAgICAgICBpZiAobm9kZSBpbnN0YW5jZW9mIEVDTUFTY3JpcHRQYXJzZXIuRm9ybWFsUGFyYW1ldGVyQXJnQ29udGV4dCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHBhcmFtZXRlciA9IHRoaXMudmlzaXRGb3JtYWxQYXJhbWV0ZXJBcmcobm9kZSk7XG4gICAgICAgICAgICAgICAgZm9ybWFsLnB1c2gocGFyYW1ldGVyKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAobm9kZSBpbnN0YW5jZW9mIEVDTUFTY3JpcHRQYXJzZXIuTGFzdEZvcm1hbFBhcmFtZXRlckFyZ0NvbnRleHQpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBwYXJhbWV0ZXIgPSB0aGlzLnZpc2l0TGFzdEZvcm1hbFBhcmFtZXRlckFyZyhub2RlKTtcbiAgICAgICAgICAgICAgICBmb3JtYWwucHVzaChwYXJhbWV0ZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmb3JtYWw7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjZm9ybWFsUGFyYW1ldGVyQXJnLlxuICAgICAqIFxuICAgICAqIGZvcm1hbFBhcmFtZXRlckFyZ1xuICAgICAqICAgOiBhc3NpZ25hYmxlICgnPScgc2luZ2xlRXhwcmVzc2lvbik/ICAgICAgLy8gRUNNQVNjcmlwdCA2OiBJbml0aWFsaXphdGlvblxuICAgICAqICAgO1xuICAgICAqIEBwYXJhbSBjdHggXG4gICAgICovXG4gICAgdmlzaXRGb3JtYWxQYXJhbWV0ZXJBcmcoY3R4OiBSdWxlQ29udGV4dCk6IEFzc2lnbm1lbnRQYXR0ZXJuIHwgQmluZGluZ0lkZW50aWZpZXIgfCBCaW5kaW5nUGF0dGVybiB7XG4gICAgICAgIHRoaXMubG9nKGN0eCwgVHJhY2UuZnJhbWUoKSk7XG4gICAgICAgIHRoaXMuYXNzZXJ0VHlwZShjdHgsIEVDTUFTY3JpcHRQYXJzZXIuRm9ybWFsUGFyYW1ldGVyQXJnQ29udGV4dCk7XG4gICAgICAgIC8vICBjb25zdHJ1Y3RvcihsZWZ0OiBCaW5kaW5nSWRlbnRpZmllciB8IEJpbmRpbmdQYXR0ZXJuLCByaWdodDogRXhwcmVzc2lvbilcblxuICAgICAgICBjb25zdCBjb3VudCA9IGN0eC5nZXRDaGlsZENvdW50KCk7XG4gICAgICAgIGlmIChjb3VudCAhPSAxICYmIGNvdW50ICE9IDMpIHtcbiAgICAgICAgICAgIHRoaXMudGhyb3dJbnNhbmNlRXJyb3IodGhpcy5kdW1wQ29udGV4dChjdHgpKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBjb21wbGlhbmNlKGVzcHJlZSlcbiAgICAgICAgLy8gRm9sbG93aW5nIGAocGFyYW0xID0gMSwgcGFyYW0yKSA9PiB7ICB9IGAgd2lsbCBwcm9kdWNlXG4gICAgICAgIC8vIHBhcmFtMSA9IEFzc2lnbm1lbnRQYXR0ZXJuXG4gICAgICAgIC8vIHBhcmFtMiA9IEJpbmRpbmdJZGVudGlmaWVyIHwgQmluZGluZ1BhdHRlcm4gXG4gICAgICAgIGlmIChjb3VudCA9PSAxKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy52aXNpdEFzc2lnbmFibGUoY3R4LmdldENoaWxkKDApKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgYXNzaWduYWJsZSA9IHRoaXMudmlzaXRBc3NpZ25hYmxlKGN0eC5nZXRDaGlsZCgwKSlcbiAgICAgICAgICAgIGNvbnN0IGV4cHJlc3Npb24gPSB0aGlzLnNpbmdsZUV4cHJlc3Npb24oY3R4LmdldENoaWxkKDIpKTtcbiAgICAgICAgICAgIHJldHVybiBuZXcgQXNzaWdubWVudFBhdHRlcm4oYXNzaWduYWJsZSwgZXhwcmVzc2lvbik7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICogXG4gICAgICogIGFzc2lnbmFibGVcbiAgICAgKiAgICA6IGlkZW50aWZpZXJcbiAgICAgKiAgICB8IGFycmF5TGl0ZXJhbFxuICAgICAqICAgIHwgb2JqZWN0TGl0ZXJhbFxuICAgICAqICAgIDsgXG4gICAgICogQHBhcmFtIGN0eCAgQXNzaWduYWJsZUNvbnRleHRcbiAgICAgKi9cbiAgICB2aXNpdEFzc2lnbmFibGUoY3R4OiBSdWxlQ29udGV4dCk6IEJpbmRpbmdJZGVudGlmaWVyIHwgQmluZGluZ1BhdHRlcm4ge1xuICAgICAgICB0aGlzLmxvZyhjdHgsIFRyYWNlLmZyYW1lKCkpO1xuICAgICAgICB0aGlzLmFzc2VydFR5cGUoY3R4LCBFQ01BU2NyaXB0UGFyc2VyLkFzc2lnbmFibGVDb250ZXh0KTtcbiAgICAgICAgY29uc3QgYXNzaWduYWJsZSA9IGN0eC5nZXRDaGlsZCgwKTtcbiAgICAgICAgaWYgKGFzc2lnbmFibGUgaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLklkZW50aWZpZXJDb250ZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy52aXNpdElkZW50aWZpZXIoYXNzaWduYWJsZSk7XG4gICAgICAgIH0gZWxzZSBpZiAoYXNzaWduYWJsZSBpbnN0YW5jZW9mIEVDTUFTY3JpcHRQYXJzZXIuQXJyYXlMaXRlcmFsQ29udGV4dCkge1xuICAgICAgICAgICAgY29uc29sZS5pbmZvKFwiKCgoKCAgKCgoKChcIilcbiAgICAgICAgfSBlbHNlIGlmIChhc3NpZ25hYmxlIGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5PYmplY3RMaXRlcmFsQ29udGV4dCkge1xuICAgICAgICAgICAgY29uc29sZS5pbmZvKFwiKCgoKCAgKCgoKChcIilcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnRocm93SW5zYW5jZUVycm9yKHRoaXMuZHVtcENvbnRleHQoY3R4KSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjbGFzdEZvcm1hbFBhcmFtZXRlckFyZy5cbiAgICAgKiBcbiAgICAgKiBsYXN0Rm9ybWFsUGFyYW1ldGVyQXJnICAgICAgICAgICAgICAgICAgICAgICAgLy8gRUNNQVNjcmlwdCA2OiBSZXN0IFBhcmFtZXRlclxuICAgICAqICAgOiBFbGxpcHNpcyBzaW5nbGVFeHByZXNzaW9uXG4gICAgICogICA7XG4gICAgICovXG4gICAgdmlzaXRMYXN0Rm9ybWFsUGFyYW1ldGVyQXJnKGN0eDogUnVsZUNvbnRleHQpOiBSZXN0RWxlbWVudCB7XG4gICAgICAgIHRoaXMubG9nKGN0eCwgVHJhY2UuZnJhbWUoKSk7XG4gICAgICAgIHRoaXMuYXNzZXJ0VHlwZShjdHgsIEVDTUFTY3JpcHRQYXJzZXIuTGFzdEZvcm1hbFBhcmFtZXRlckFyZ0NvbnRleHQpO1xuICAgICAgICBjb25zdCBleHByZXNzaW9uID0gdGhpcy5zaW5nbGVFeHByZXNzaW9uKGN0eC5nZXRDaGlsZCgxKSlcbiAgICAgICAgcmV0dXJuIG5ldyBSZXN0RWxlbWVudChleHByZXNzaW9uKVxuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI1Rlcm5hcnlFeHByZXNzaW9uLlxuICAgIHZpc2l0VGVybmFyeUV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI0xvZ2ljYWxBbmRFeHByZXNzaW9uLlxuICAgIHZpc2l0TG9naWNhbEFuZEV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI1ByZUluY3JlbWVudEV4cHJlc3Npb24uXG4gICAgdmlzaXRQcmVJbmNyZW1lbnRFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNPYmplY3RMaXRlcmFsRXhwcmVzc2lvbi5cbiAgICAgKiBAcGFyYW0gY3R4IFxuICAgICAqL1xuICAgIHZpc2l0T2JqZWN0TGl0ZXJhbEV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCk6IE9iamVjdEV4cHJlc3Npb24ge1xuICAgICAgICB0aGlzLmxvZyhjdHgsIFRyYWNlLmZyYW1lKCkpXG4gICAgICAgIHRoaXMuYXNzZXJ0VHlwZShjdHgsIEVDTUFTY3JpcHRQYXJzZXIuT2JqZWN0TGl0ZXJhbEV4cHJlc3Npb25Db250ZXh0KTtcbiAgICAgICAgY29uc3Qgbm9kZSA9IGN0eC5nZXRDaGlsZCgwKTtcbiAgICAgICAgY29uc3QgcHJvcGVydGllczogT2JqZWN0RXhwcmVzc2lvblByb3BlcnR5W10gPSB0aGlzLnZpc2l0T2JqZWN0TGl0ZXJhbChub2RlKTtcbiAgICAgICAgcmV0dXJuIG5ldyBPYmplY3RFeHByZXNzaW9uKHByb3BlcnRpZXMpO1xuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI0luRXhwcmVzc2lvbi5cbiAgICB2aXNpdEluRXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG5cbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI0xvZ2ljYWxPckV4cHJlc3Npb24uXG4gICAgdmlzaXRMb2dpY2FsT3JFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcblxuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjTm90RXhwcmVzc2lvbi5cbiAgICB2aXNpdE5vdEV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjUHJlRGVjcmVhc2VFeHByZXNzaW9uLlxuICAgIHZpc2l0UHJlRGVjcmVhc2VFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI0FyZ3VtZW50c0V4cHJlc3Npb24uXG4gICAgdmlzaXRBcmd1bWVudHNFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS5pbmZvKFwidmlzaXRBcmd1bWVudHNFeHByZXNzaW9uOiBcIiArIGN0eC5nZXRUZXh0KCkpO1xuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjVGhpc0V4cHJlc3Npb24uXG4gICAgdmlzaXRUaGlzRXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNGdW5jdGlvbkV4cHJlc3Npb24uXG4gICAgICogICBhbm95bW91c0Z1bmN0aW9uXG4gICAgICogICAgICAgOiBmdW5jdGlvbkRlY2xhcmF0aW9uICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICMgRnVuY3Rpb25EZWNsXG4gICAgICogICAgICAgfCBBc3luYz8gRnVuY3Rpb24gJyonPyAnKCcgZm9ybWFsUGFyYW1ldGVyTGlzdD8gJyknICd7JyBmdW5jdGlvbkJvZHkgJ30nICAgICMgQW5veW1vdXNGdW5jdGlvbkRlY2xcbiAgICAgKiAgICAgICB8IEFzeW5jPyBhcnJvd0Z1bmN0aW9uUGFyYW1ldGVycyAnPT4nIGFycm93RnVuY3Rpb25Cb2R5ICAgICAgICAgICAgICAgICAgICAgIyBBcnJvd0Z1bmN0aW9uXG4gICAgICogICAgICAgO1xuICAgICAqIEBwYXJhbSBjdHggXG4gICAgICovXG4gICAgdmlzaXRGdW5jdGlvbkV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICB0aGlzLmxvZyhjdHgsIFRyYWNlLmZyYW1lKCkpO1xuICAgICAgICB0aGlzLmFzc2VydFR5cGUoY3R4LCBFQ01BU2NyaXB0UGFyc2VyLkZ1bmN0aW9uRXhwcmVzc2lvbkNvbnRleHQpO1xuICAgICAgICBjb25zdCBub2RlID0gY3R4LmdldENoaWxkKDApO1xuICAgICAgICBsZXQgZnVuY3Rpb25FeHByZXNzaW9uO1xuICAgICAgICBpZiAobm9kZSBpbnN0YW5jZW9mIEVDTUFTY3JpcHRQYXJzZXIuRnVuY3Rpb25EZWNsQ29udGV4dCkge1xuICAgICAgICAgICAgZnVuY3Rpb25FeHByZXNzaW9uID0gdGhpcy52aXNpdEZ1bmN0aW9uRGVjbChjdHguZ2V0Q2hpbGQoMCkpO1xuICAgICAgICB9IGVsc2UgaWYgKG5vZGUgaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLkFub3ltb3VzRnVuY3Rpb25EZWNsQ29udGV4dCkge1xuICAgICAgICAgICAgZnVuY3Rpb25FeHByZXNzaW9uID0gdGhpcy52aXNpdEFub3ltb3VzRnVuY3Rpb25EZWNsKGN0eC5nZXRDaGlsZCgwKSk7XG4gICAgICAgIH0gZWxzZSBpZiAobm9kZSBpbnN0YW5jZW9mIEVDTUFTY3JpcHRQYXJzZXIuQXJyb3dGdW5jdGlvbkNvbnRleHQpIHtcbiAgICAgICAgICAgIGZ1bmN0aW9uRXhwcmVzc2lvbiA9IHRoaXMudmlzaXRBcnJvd0Z1bmN0aW9uKGN0eC5nZXRDaGlsZCgwKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwibm90IGltcGxlbWVudGVkXCIpXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uRXhwcmVzc2lvbjtcbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNmdW5jdGlvbkRlY2xcbiAgICB2aXNpdEFycm93RnVuY3Rpb24oY3R4OiBSdWxlQ29udGV4dCk6IEFycm93RnVuY3Rpb25FeHByZXNzaW9uIHtcbiAgICAgICAgdGhpcy5sb2coY3R4LCBUcmFjZS5mcmFtZSgpKTtcbiAgICAgICAgdGhpcy5hc3NlcnRUeXBlKGN0eCwgRUNNQVNjcmlwdFBhcnNlci5BcnJvd0Z1bmN0aW9uQ29udGV4dCk7XG4gICAgICAgIHRoaXMuZHVtcENvbnRleHRBbGxDaGlsZHJlbihjdHgpXG4gICAgICAgIGNvbnN0IHBhcmFtQ29udGV4dCA9IHRoaXMuZ2V0VHlwZWRSdWxlQ29udGV4dChjdHgsIEVDTUFTY3JpcHRQYXJzZXIuQXJyb3dGdW5jdGlvblBhcmFtZXRlcnNDb250ZXh0KTtcbiAgICAgICAgY29uc3QgYm9keUNvbnRleHQgPSB0aGlzLmdldFR5cGVkUnVsZUNvbnRleHQoY3R4LCBFQ01BU2NyaXB0UGFyc2VyLkFycm93RnVuY3Rpb25Cb2R5Q29udGV4dCk7XG4gICAgICAgIGNvbnN0IHBhcmFtcyA9IHRoaXMudmlzaXRBcnJvd0Z1bmN0aW9uUGFyYW1ldGVycyhwYXJhbUNvbnRleHQpO1xuICAgICAgICBjb25zdCBib2R5ID0gdGhpcy52aXNpdEFycm93RnVuY3Rpb25Cb2R5KGJvZHlDb250ZXh0KTtcbiAgICAgICAgY29uc3QgZXhwcmVzc2lvbiA9IGZhbHNlO1xuICAgICAgICAvLyAocGFyYW1zOiBGdW5jdGlvblBhcmFtZXRlcltdLCBib2R5OiBCbG9ja1N0YXRlbWVudCB8IEV4cHJlc3Npb24sIGV4cHJlc3Npb246IGJvb2xlYW4pIFxuICAgICAgICByZXR1cm4gbmV3IEFycm93RnVuY3Rpb25FeHByZXNzaW9uKHBhcmFtcywgYm9keSwgZXhwcmVzc2lvbik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogYXJyb3dGdW5jdGlvblBhcmFtZXRlcnNcbiAgICAgKiAgOiBpZGVudGlmaWVyXG4gICAgICogIHwgJygnIGZvcm1hbFBhcmFtZXRlckxpc3Q/ICcpJ1xuICAgICAqICA7XG4gICAgICogQHBhcmFtIGN0eCBcbiAgICAgKi9cbiAgICB2aXNpdEFycm93RnVuY3Rpb25QYXJhbWV0ZXJzKGN0eDogUnVsZUNvbnRleHQpOiBGdW5jdGlvblBhcmFtZXRlcltdIHtcbiAgICAgICAgdGhpcy5sb2coY3R4LCBUcmFjZS5mcmFtZSgpKTtcbiAgICAgICAgdGhpcy5hc3NlcnRUeXBlKGN0eCwgRUNNQVNjcmlwdFBhcnNlci5BcnJvd0Z1bmN0aW9uUGFyYW1ldGVyc0NvbnRleHQpO1xuICAgICAgICAvLyBnb3Qgb25seSB0d28gKClcbiAgICAgICAgaWYgKGN0eC5nZXRDaGlsZENvdW50KCkgPT0gMikge1xuICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICB9XG4gICAgICAgIC8qXG4gICAgICAgIGxldCBhc3luYyA9IGZhbHNlO1xuICAgICAgICBsZXQgZ2VuZXJhdG9yID0gZmFsc2U7XG4gICAgICAgIGxldCBpZGVudGlmaWVyOiBJZGVudGlmaWVyO1xuICAgICAgICBsZXQgcGFyYW1zO1xuICAgICAgICBsZXQgYm9keTtcblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGN0eC5nZXRDaGlsZENvdW50KCk7ICsraSkge1xuICAgICAgICAgICAgY29uc3Qgbm9kZSA9IGN0eC5nZXRDaGlsZChpKTtcbiAgICAgICAgICAgIGlmIChub2RlLnN5bWJvbCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHR4dCA9IG5vZGUuZ2V0VGV4dCgpO1xuICAgICAgICAgICAgICAgIGlmICh0eHQgPT0gJ2FzeW5jJykge1xuICAgICAgICAgICAgICAgICAgICBhc3luYyA9IHRydWVcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHR4dCA9PSAnKicpIHtcbiAgICAgICAgICAgICAgICAgICAgZ2VuZXJhdG9yID0gdHJ1ZVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChub2RlIGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5JZGVudGlmaWVyQ29udGV4dCkge1xuICAgICAgICAgICAgICAgIGlkZW50aWZpZXIgPSB0aGlzLnZpc2l0SWRlbnRpZmllcihub2RlKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAobm9kZSBpbnN0YW5jZW9mIEVDTUFTY3JpcHRQYXJzZXIuRm9ybWFsUGFyYW1ldGVyTGlzdENvbnRleHQpIHtcbiAgICAgICAgICAgICAgICBwYXJhbXMgPSB0aGlzLnZpc2l0Rm9ybWFsUGFyYW1ldGVyTGlzdChub2RlKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAobm9kZSBpbnN0YW5jZW9mIEVDTUFTY3JpcHRQYXJzZXIuRnVuY3Rpb25Cb2R5Q29udGV4dCkge1xuICAgICAgICAgICAgICAgIC8vIGJvZHkgPSB0aGlzLnZpc2l0RnVuY3Rpb25Cb2R5KG5vZGUpO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuaW5mbyhcIkVDTUFTY3JpcHRQYXJzZXIgOzsgRm9ybWFsUGFyYW1ldGVyTGlzdENvbnRleHRcIilcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuZHVtcENvbnRleHRBbGxDaGlsZHJlbihub2RlKVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc29sZS5pbmZvKCdhc3luYyAgPSAnICsgYXN5bmMpO1xuICAgICAgICBjb25zb2xlLmluZm8oJ2dlbmVyYXRvciAgPSAnICsgZ2VuZXJhdG9yKTtcbiAgICAgICAgKi9cbiAgICAgICAgbGV0IHBhcmFtcyA9IFtdO1xuICAgICAgICBmb3IgKGNvbnN0IG5vZGUgb2YgdGhpcy5pdGVyYWJsZShjdHgpKSB7XG4gICAgICAgICAgICBpZiAobm9kZSBpbnN0YW5jZW9mIEVDTUFTY3JpcHRQYXJzZXIuSWRlbnRpZmllckNvbnRleHQpIHtcbiAgICAgICAgICAgICAgICBwYXJhbXMucHVzaCh0aGlzLnZpc2l0SWRlbnRpZmllcihub2RlKSlcbiAgICAgICAgICAgIH0gZWxzZSBpZiAobm9kZSBpbnN0YW5jZW9mIEVDTUFTY3JpcHRQYXJzZXIuRm9ybWFsUGFyYW1ldGVyTGlzdENvbnRleHQpIHtcbiAgICAgICAgICAgICAgICBwYXJhbXMgPSBbLi4udGhpcy52aXNpdEZvcm1hbFBhcmFtZXRlckxpc3Qobm9kZSldO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBwYXJhbXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiAgYXJyb3dGdW5jdGlvbkJvZHlcbiAgICAgKiAgIDogJ3snIGZ1bmN0aW9uQm9keSAnfScgXG4gICAgICogICB8IHNpbmdsZUV4cHJlc3Npb25cbiAgICAgKiAgIDtcbiAgICAgKiBAcGFyYW0gY3R4IFxuICAgICAqL1xuICAgIHZpc2l0QXJyb3dGdW5jdGlvbkJvZHkoY3R4OiBSdWxlQ29udGV4dCk6IEJsb2NrU3RhdGVtZW50IHwgRXhwcmVzc2lvbiB7XG4gICAgICAgIHRoaXMubG9nKGN0eCwgVHJhY2UuZnJhbWUoKSk7XG4gICAgICAgIHRoaXMuYXNzZXJ0VHlwZShjdHgsIEVDTUFTY3JpcHRQYXJzZXIuQXJyb3dGdW5jdGlvbkJvZHlDb250ZXh0KTtcbiAgICAgICAgY29uc3Qgbm9kZSA9IGN0eC5nZXRDaGlsZCgwKTtcbiAgICAgICAgaWYgKGN0eC5nZXRDaGlsZENvdW50KCkgPT0gMykge1xuICAgICAgICAgICAgY29uc3QgYm9keUNvbnRleHQgPSB0aGlzLmdldFR5cGVkUnVsZUNvbnRleHQoY3R4LCBFQ01BU2NyaXB0UGFyc2VyLkZ1bmN0aW9uQm9keUNvbnRleHQpO1xuICAgICAgICAgICAgaWYgKGJvZHlDb250ZXh0LmdldENoaWxkQ291bnQoKSA9PSAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBCbG9ja1N0YXRlbWVudChbXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBib2R5ID0gdGhpcy52aXNpdEZ1bmN0aW9uQm9keShib2R5Q29udGV4dCk7XG4gICAgICAgICAgICByZXR1cm4gbmV3IEJsb2NrU3RhdGVtZW50KGJvZHkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKG5vZGUgaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLlBhcmVudGhlc2l6ZWRFeHByZXNzaW9uQ29udGV4dCkge1xuICAgICAgICAgICAgICAgIHR5cGUgUGFyZW50aGVzaXplZEV4cHJlc3Npb24gPSBFeHByZXNzaW9uU3RhdGVtZW50IHwgU2VxdWVuY2VFeHByZXNzaW9uXG4gICAgICAgICAgICAgICAgY29uc3QgcGFyYW1ldGl6ZWQ6IFBhcmVudGhlc2l6ZWRFeHByZXNzaW9uID0gdGhpcy52aXNpdFBhcmVudGhlc2l6ZWRFeHByZXNzaW9uKG5vZGUpO1xuICAgICAgICAgICAgICAgIC8vIGNvbXBsaWFuY2UgZXNwcmVlIDogdGhpcyBmdW5jdGlvbiByZXR1cm5zIEV4cHJlc3Npb25TdGF0ZW1lbnQgb3IgRXhwcmVzc2lvblNlcXVlbmNlQ29udGV4dFxuICAgICAgICAgICAgICAgIC8vIHVud2luZGluZyBFeHByZXNzaW9uU3RhdGVtZW50IHRvIHRvIHNpbXBseSByZXR1cm4gXG4gICAgICAgICAgICAgICAgaWYgKHBhcmFtZXRpemVkIGluc3RhbmNlb2YgRXhwcmVzc2lvblN0YXRlbWVudCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcGFyYW1ldGl6ZWQuZXhwcmVzc2lvbjtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHBhcmFtZXRpemVkIGluc3RhbmNlb2YgU2VxdWVuY2VFeHByZXNzaW9uKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBwYXJhbWV0aXplZDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnNpbmdsZUV4cHJlc3Npb24obm9kZSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiVW5rbm93biB0eXBlIGZvciA6IFwiICsgY3R4KTtcbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNVbmFyeU1pbnVzRXhwcmVzc2lvbi5cbiAgICB2aXNpdFVuYXJ5TWludXNFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcblxuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjUG9zdERlY3JlYXNlRXhwcmVzc2lvbi5cbiAgICB2aXNpdFBvc3REZWNyZWFzZUV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI0Fzc2lnbm1lbnRFeHByZXNzaW9uLlxuICAgICAqIFxuICAgICAqIDxhc3NvYz1yaWdodD4gc2luZ2xlRXhwcmVzc2lvbiAnPScgc2luZ2xlRXhwcmVzc2lvbiAgICAgICAgICAgICAgICAgICAjIEFzc2lnbm1lbnRFeHByZXNzaW9uXG4gICAgICogQHBhcmFtIGN0eCBcbiAgICAgKi9cbiAgICB2aXNpdEFzc2lnbm1lbnRFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpOiBBc3NpZ25tZW50RXhwcmVzc2lvbiB7XG4gICAgICAgIHRoaXMubG9nKGN0eCwgVHJhY2UuZnJhbWUoKSlcbiAgICAgICAgdGhpcy5hc3NlcnRUeXBlKGN0eCwgRUNNQVNjcmlwdFBhcnNlci5Bc3NpZ25tZW50RXhwcmVzc2lvbkNvbnRleHQpO1xuICAgICAgICB0aGlzLmFzc2VydE5vZGVDb3VudChjdHgsIDMpXG5cbiAgICAgICAgY29uc3QgaW5pdGlhbGlzZXIgPSBjdHguZ2V0Q2hpbGQoMCk7XG4gICAgICAgIGNvbnN0IG9wZXJhdG9yID0gY3R4LmdldENoaWxkKDEpLmdldFRleHQoKTsgLy8gTm8gdHlwZSAoID0gKVxuICAgICAgICBjb25zdCBleHByZXNzaW9uID0gY3R4LmdldENoaWxkKDIpO1xuICAgICAgICBjb25zdCBsaHMgPSB0aGlzLnNpbmdsZUV4cHJlc3Npb24oaW5pdGlhbGlzZXIpO1xuICAgICAgICBjb25zdCByaHMgPSB0aGlzLnNpbmdsZUV4cHJlc3Npb24oZXhwcmVzc2lvbik7XG5cbiAgICAgICAgLy8gQ29tcGxpYW5jZSA6IHB1bGxpbmcgdXAgRXhwcmVzc2lvblN0YXRlbWVudCBpbnRvIEFzc2lnZW1lbnRFeHByZXNzaW9uXG4gICAgICAgIHJldHVybiBuZXcgQXNzaWdubWVudEV4cHJlc3Npb24ob3BlcmF0b3IsIGxocywgcmhzKVxuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjVHlwZW9mRXhwcmVzc2lvbi5cbiAgICB2aXNpdFR5cGVvZkV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuXG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNJbnN0YW5jZW9mRXhwcmVzc2lvbi5cbiAgICB2aXNpdEluc3RhbmNlb2ZFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcblxuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI1VuYXJ5UGx1c0V4cHJlc3Npb24uXG4gICAgdmlzaXRVbmFyeVBsdXNFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcblxuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI0RlbGV0ZUV4cHJlc3Npb24uXG4gICAgdmlzaXREZWxldGVFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNFcXVhbGl0eUV4cHJlc3Npb24uXG4gICAgdmlzaXRFcXVhbGl0eUV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCk6IEJpbmFyeUV4cHJlc3Npb24ge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJ2aXNpdEVxdWFsaXR5RXhwcmVzc2lvbiBbJXNdIDogJXNcIiwgY3R4LmdldENoaWxkQ291bnQoKSwgY3R4LmdldFRleHQoKSk7XG4gICAgICAgIHRoaXMuYXNzZXJ0VHlwZShjdHgsIEVDTUFTY3JpcHRQYXJzZXIuRXF1YWxpdHlFeHByZXNzaW9uQ29udGV4dCk7XG4gICAgICAgIHRoaXMuYXNzZXJ0Tm9kZUNvdW50KGN0eCwgMylcblxuICAgICAgICBsZXQgbGVmdCA9IGN0eC5nZXRDaGlsZCgwKTtcbiAgICAgICAgbGV0IG9wZXJhdG9yID0gY3R4LmdldENoaWxkKDEpLmdldFRleHQoKTsgLy8gTm8gdHlwZSAoICssLSApXG4gICAgICAgIGxldCByaWdodCA9IGN0eC5nZXRDaGlsZCgyKTtcbiAgICAgICAgbGV0IGxocyA9IHRoaXMuX3Zpc2l0QmluYXJ5RXhwcmVzc2lvbihsZWZ0KTtcbiAgICAgICAgbGV0IHJocyA9IHRoaXMuX3Zpc2l0QmluYXJ5RXhwcmVzc2lvbihyaWdodCk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuZGVjb3JhdGUobmV3IEJpbmFyeUV4cHJlc3Npb24ob3BlcmF0b3IsIGxocywgcmhzKSwge30pO1xuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjQml0WE9yRXhwcmVzc2lvbi5cbiAgICB2aXNpdEJpdFhPckV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuXG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNNdWx0aXBsaWNhdGl2ZUV4cHJlc3Npb24uXG4gICAgdmlzaXRNdWx0aXBsaWNhdGl2ZUV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCk6IEJpbmFyeUV4cHJlc3Npb24ge1xuICAgICAgICB0aGlzLmxvZyhjdHgsIFRyYWNlLmZyYW1lKCkpO1xuICAgICAgICB0aGlzLmFzc2VydFR5cGUoY3R4LCBFQ01BU2NyaXB0UGFyc2VyLk11bHRpcGxpY2F0aXZlRXhwcmVzc2lvbkNvbnRleHQpO1xuICAgICAgICB0aGlzLmFzc2VydE5vZGVDb3VudChjdHgsIDMpXG5cbiAgICAgICAgbGV0IGxlZnQgPSBjdHguZ2V0Q2hpbGQoMCk7XG4gICAgICAgIGxldCBvcGVyYXRvciA9IGN0eC5nZXRDaGlsZCgxKS5nZXRUZXh0KCk7IC8vIE5vIHR5cGUgKCArLC0gKVxuICAgICAgICBsZXQgcmlnaHQgPSBjdHguZ2V0Q2hpbGQoMik7XG4gICAgICAgIGxldCBsaHMgPSB0aGlzLnZpc2l0QmluYXJ5RXhwcmVzc2lvbihsZWZ0KTtcbiAgICAgICAgbGV0IHJocyA9IHRoaXMudmlzaXRCaW5hcnlFeHByZXNzaW9uKHJpZ2h0KTtcblxuICAgICAgICByZXR1cm4gdGhpcy5kZWNvcmF0ZShuZXcgQmluYXJ5RXhwcmVzc2lvbihvcGVyYXRvciwgbGhzLCByaHMpLCB7fSk7XG4gICAgfVxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjQml0U2hpZnRFeHByZXNzaW9uLlxuICAgIHZpc2l0Qml0U2hpZnRFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcblxuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI1BhcmVudGhlc2l6ZWRFeHByZXNzaW9uLlxuICAgIHZpc2l0UGFyZW50aGVzaXplZEV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICB0aGlzLmxvZyhjdHgsIFRyYWNlLmZyYW1lKCkpO1xuICAgICAgICB0aGlzLmFzc2VydFR5cGUoY3R4LCBFQ01BU2NyaXB0UGFyc2VyLlBhcmVudGhlc2l6ZWRFeHByZXNzaW9uQ29udGV4dCk7XG4gICAgICAgIHRoaXMuYXNzZXJ0Tm9kZUNvdW50KGN0eCwgMylcbiAgICAgICAgY29uc3QgZXhwcmVzc2lvbiA9IGN0eC5nZXRDaGlsZCgxKTtcbiAgICAgICAgcmV0dXJuIHRoaXMudmlzaXRFeHByZXNzaW9uU2VxdWVuY2UoZXhwcmVzc2lvbik7XG4gICAgfVxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjQWRkaXRpdmVFeHByZXNzaW9uLlxuICAgIHZpc2l0QWRkaXRpdmVFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpOiBCaW5hcnlFeHByZXNzaW9uIHtcbiAgICAgICAgdGhpcy5sb2coY3R4LCBUcmFjZS5mcmFtZSgpKTtcbiAgICAgICAgdGhpcy5hc3NlcnRUeXBlKGN0eCwgRUNNQVNjcmlwdFBhcnNlci5BZGRpdGl2ZUV4cHJlc3Npb25Db250ZXh0KTtcbiAgICAgICAgdGhpcy5hc3NlcnROb2RlQ291bnQoY3R4LCAzKVxuXG4gICAgICAgIGNvbnN0IGxlZnQgPSBjdHguZ2V0Q2hpbGQoMCk7XG4gICAgICAgIGNvbnN0IG9wZXJhdG9yID0gY3R4LmdldENoaWxkKDEpLmdldFRleHQoKTsgLy8gTm8gdHlwZSAoICssLSApXG4gICAgICAgIGNvbnN0IHJpZ2h0ID0gY3R4LmdldENoaWxkKDIpO1xuICAgICAgICBjb25zdCBsaHMgPSB0aGlzLl92aXNpdEJpbmFyeUV4cHJlc3Npb24obGVmdCk7XG4gICAgICAgIGNvbnN0IHJocyA9IHRoaXMuX3Zpc2l0QmluYXJ5RXhwcmVzc2lvbihyaWdodCk7XG4gICAgICAgIC8vIHJldHVybiB0aGlzLmRlY29yYXRlKG5ldyBCaW5hcnlFeHByZXNzaW9uKG9wZXJhdG9yLCBsaHMgLHJocyksIHRoaXMuYXNNYXJrZXIodGhpcy5hc01ldGFkYXRhKGN0eC5zeW1ib2wpKSk7XG4gICAgICAgIHJldHVybiBuZXcgQmluYXJ5RXhwcmVzc2lvbihvcGVyYXRvciwgbGhzLCByaHMpO1xuICAgIH1cblxuICAgIF92aXNpdEJpbmFyeUV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuXG4gICAgICAgIGNvbnNvbGUuaW5mbyhcImV2YWxCaW5hcnlFeHByZXNzaW9uIFslc10gOiAlc1wiLCBjdHguZ2V0Q2hpbGRDb3VudCgpLCBjdHguZ2V0VGV4dCgpKTtcbiAgICAgICAgaWYgKGN0eCBpbnN0YW5jZW9mIEVDTUFTY3JpcHRQYXJzZXIuSWRlbnRpZmllckV4cHJlc3Npb25Db250ZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy52aXNpdElkZW50aWZpZXJFeHByZXNzaW9uKGN0eCk7XG4gICAgICAgIH0gZWxzZSBpZiAoY3R4IGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5MaXRlcmFsRXhwcmVzc2lvbkNvbnRleHQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnZpc2l0TGl0ZXJhbEV4cHJlc3Npb24oY3R4KTtcbiAgICAgICAgfSBlbHNlIGlmIChjdHggaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLkFkZGl0aXZlRXhwcmVzc2lvbkNvbnRleHQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnZpc2l0QWRkaXRpdmVFeHByZXNzaW9uKGN0eCk7XG4gICAgICAgIH0gZWxzZSBpZiAoY3R4IGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5NdWx0aXBsaWNhdGl2ZUV4cHJlc3Npb25Db250ZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy52aXNpdE11bHRpcGxpY2F0aXZlRXhwcmVzc2lvbihjdHgpO1xuICAgICAgICB9IGVsc2UgaWYgKGN0eCBpbnN0YW5jZW9mIEVDTUFTY3JpcHRQYXJzZXIuUmVsYXRpb25hbEV4cHJlc3Npb25Db250ZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy52aXNpdFJlbGF0aW9uYWxFeHByZXNzaW9uKGN0eCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy50aHJvd0luc2FuY2VFcnJvcih0aGlzLmR1bXBDb250ZXh0KGN0eCkpO1xuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI1JlbGF0aW9uYWxFeHByZXNzaW9uLlxuICAgIHZpc2l0UmVsYXRpb25hbEV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCk6IEJpbmFyeUV4cHJlc3Npb24ge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJ2aXNpdFJlbGF0aW9uYWxFeHByZXNzaW9uIFslc10gOiAlc1wiLCBjdHguZ2V0Q2hpbGRDb3VudCgpLCBjdHguZ2V0VGV4dCgpKTtcbiAgICAgICAgdGhpcy5hc3NlcnRUeXBlKGN0eCwgRUNNQVNjcmlwdFBhcnNlci5SZWxhdGlvbmFsRXhwcmVzc2lvbkNvbnRleHQpO1xuICAgICAgICB0aGlzLmFzc2VydE5vZGVDb3VudChjdHgsIDMpXG4gICAgICAgIGNvbnN0IGxlZnQgPSBjdHguZ2V0Q2hpbGQoMCk7XG4gICAgICAgIGNvbnN0IG9wZXJhdG9yID0gY3R4LmdldENoaWxkKDEpLmdldFRleHQoKTsgLy8gTm8gdHlwZSAoICssLSApXG4gICAgICAgIGNvbnN0IHJpZ2h0ID0gY3R4LmdldENoaWxkKDIpO1xuICAgICAgICBjb25zdCBsaHMgPSB0aGlzLl92aXNpdEJpbmFyeUV4cHJlc3Npb24obGVmdCk7XG4gICAgICAgIGNvbnN0IHJocyA9IHRoaXMuX3Zpc2l0QmluYXJ5RXhwcmVzc2lvbihyaWdodCk7XG4gICAgICAgIC8vIHJldHVybiB0aGlzLmRlY29yYXRlKG5ldyBCaW5hcnlFeHByZXNzaW9uKG9wZXJhdG9yLCBsaHMgLHJocyksIHRoaXMuYXNNYXJrZXIodGhpcy5hc01ldGFkYXRhKGN0eC5zeW1ib2wpKSk7XG4gICAgICAgIHJldHVybiBuZXcgQmluYXJ5RXhwcmVzc2lvbihvcGVyYXRvciwgbGhzLCByaHMpO1xuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI1Bvc3RJbmNyZW1lbnRFeHByZXNzaW9uLlxuICAgIHZpc2l0UG9zdEluY3JlbWVudEV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI0JpdE5vdEV4cHJlc3Npb24uXG4gICAgdmlzaXRCaXROb3RFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcblxuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjTmV3RXhwcmVzc2lvbi5cbiAgICB2aXNpdE5ld0V4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuXG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNMaXRlcmFsRXhwcmVzc2lvbi5cbiAgICB2aXNpdExpdGVyYWxFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS5pbmZvKFwidmlzaXRMaXRlcmFsRXhwcmVzc2lvbiBbJXNdIDogWyVzXVwiLCBjdHguZ2V0Q2hpbGRDb3VudCgpLCBjdHguZ2V0VGV4dCgpKTtcbiAgICAgICAgdGhpcy5hc3NlcnRUeXBlKGN0eCwgRUNNQVNjcmlwdFBhcnNlci5MaXRlcmFsRXhwcmVzc2lvbkNvbnRleHQpO1xuICAgICAgICB0aGlzLmFzc2VydE5vZGVDb3VudChjdHgsIDEpO1xuICAgICAgICAvLyB2aXNpdExpdGVyYWxFeHByZXNzaW9uOiA+IHZpc2l0TGl0ZXJhbFxuICAgICAgICBsZXQgbm9kZSA9IGN0eC5nZXRDaGlsZCgwKVxuICAgICAgICBpZiAobm9kZSBpbnN0YW5jZW9mIEVDTUFTY3JpcHRQYXJzZXIuTGl0ZXJhbENvbnRleHQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnZpc2l0TGl0ZXJhbChub2RlKTtcbiAgICAgICAgfSBlbHNlIGlmIChub2RlIGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5OdW1lcmljTGl0ZXJhbENvbnRleHQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnZpc2l0TnVtZXJpY0xpdGVyYWwobm9kZSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy50aHJvd0luc2FuY2VFcnJvcih0aGlzLmR1bXBDb250ZXh0KG5vZGUpKTtcbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNBcnJheUxpdGVyYWxFeHByZXNzaW9uLlxuICAgIHZpc2l0QXJyYXlMaXRlcmFsRXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KTogQXJyYXlFeHByZXNzaW9uIHtcbiAgICAgICAgY29uc29sZS5pbmZvKFwidmlzaXRBcnJheUxpdGVyYWxFeHByZXNzaW9uIFslc10gOiAlc1wiLCBjdHguZ2V0Q2hpbGRDb3VudCgpLCBjdHguZ2V0VGV4dCgpKTtcbiAgICAgICAgdGhpcy5hc3NlcnRUeXBlKGN0eCwgRUNNQVNjcmlwdFBhcnNlci5BcnJheUxpdGVyYWxFeHByZXNzaW9uQ29udGV4dCk7XG4gICAgICAgIHRoaXMuYXNzZXJ0Tm9kZUNvdW50KGN0eCwgMSk7XG4gICAgICAgIGNvbnN0IG5vZGUgPSBjdHguZ2V0Q2hpbGQoMCk7XG4gICAgICAgIGNvbnN0IGVsZW1lbnRzID0gdGhpcy52aXNpdEFycmF5TGl0ZXJhbChub2RlKTtcbiAgICAgICAgcmV0dXJuIG5ldyBBcnJheUV4cHJlc3Npb24oZWxlbWVudHMpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIC8vIGNvbXB1dGVkID0gZmFsc2UgYHguemBcbiAgICAgKiAvLyBjb21wdXRlZCA9IHRydWUgYHlbMV1gXG4gICAgICogLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjTWVtYmVyRG90RXhwcmVzc2lvbi5cbiAgICAgKi9cbiAgICB2aXNpdE1lbWJlckRvdEV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCk6IFN0YXRpY01lbWJlckV4cHJlc3Npb24ge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJ2aXNpdEFycmF5TGl0ZXJhbEV4cHJlc3Npb24gWyVzXSA6ICVzXCIsIGN0eC5nZXRDaGlsZENvdW50KCksIGN0eC5nZXRUZXh0KCkpO1xuICAgICAgICB0aGlzLmFzc2VydFR5cGUoY3R4LCBFQ01BU2NyaXB0UGFyc2VyLk1lbWJlckRvdEV4cHJlc3Npb25Db250ZXh0KTtcbiAgICAgICAgdGhpcy5hc3NlcnROb2RlQ291bnQoY3R4LCAzKTtcbiAgICAgICAgY29uc3QgZXhwciA9IHRoaXMuc2luZ2xlRXhwcmVzc2lvbihjdHguZ2V0Q2hpbGQoMCkpO1xuICAgICAgICBjb25zdCBwcm9wZXJ0eSA9IHRoaXMudmlzaXRJZGVudGlmaWVyTmFtZShjdHguZ2V0Q2hpbGQoMikpO1xuICAgICAgICByZXR1cm4gbmV3IFN0YXRpY01lbWJlckV4cHJlc3Npb24oZXhwciwgcHJvcGVydHkpO1xuICAgIH1cblxuICAgIHByaW50KGN0eDogUnVsZUNvbnRleHQpOiB2b2lkIHtcbiAgICAgICAgY29uc29sZS5pbmZvKFwiICoqKioqICBcIilcbiAgICAgICAgY29uc3QgdmlzaXRvciA9IG5ldyBQcmludFZpc2l0b3IoKTtcbiAgICAgICAgY3R4LmFjY2VwdCh2aXNpdG9yKTtcbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNNZW1iZXJJbmRleEV4cHJlc3Npb24uXG4gICAgdmlzaXRNZW1iZXJJbmRleEV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCk6IENvbXB1dGVkTWVtYmVyRXhwcmVzc2lvbiB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0TWVtYmVySW5kZXhFeHByZXNzaW9uIFslc10gOiAlc1wiLCBjdHguZ2V0Q2hpbGRDb3VudCgpLCBjdHguZ2V0VGV4dCgpKTtcbiAgICAgICAgdGhpcy5hc3NlcnRUeXBlKGN0eCwgRUNNQVNjcmlwdFBhcnNlci5NZW1iZXJJbmRleEV4cHJlc3Npb25Db250ZXh0KTtcbiAgICAgICAgdGhpcy5hc3NlcnROb2RlQ291bnQoY3R4LCA0KTtcbiAgICAgICAgY29uc3QgZXhwciA9IHRoaXMuc2luZ2xlRXhwcmVzc2lvbihjdHguZ2V0Q2hpbGQoMCkpO1xuICAgICAgICBjb25zdCBwcm9wZXJ0eSA9IHRoaXMudmlzaXRFeHByZXNzaW9uU2VxdWVuY2UoY3R4LmdldENoaWxkKDIpKTtcbiAgICAgICAgcmV0dXJuIG5ldyBDb21wdXRlZE1lbWJlckV4cHJlc3Npb24oZXhwciwgcHJvcGVydHkpO1xuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI0lkZW50aWZpZXJFeHByZXNzaW9uLlxuICAgIHZpc2l0SWRlbnRpZmllckV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCk6IElkZW50aWZpZXIge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJ2aXNpdElkZW50aWZpZXJFeHByZXNzaW9uIFslc10gOiAlc1wiLCBjdHguZ2V0Q2hpbGRDb3VudCgpLCBjdHguZ2V0VGV4dCgpKTtcbiAgICAgICAgdGhpcy5hc3NlcnRUeXBlKGN0eCwgRUNNQVNjcmlwdFBhcnNlci5JZGVudGlmaWVyRXhwcmVzc2lvbkNvbnRleHQpO1xuICAgICAgICB0aGlzLmFzc2VydE5vZGVDb3VudChjdHgsIDEpXG4gICAgICAgIGNvbnN0IGluaXRpYWxpc2VyID0gY3R4LmdldENoaWxkKDApO1xuICAgICAgICBjb25zdCBuYW1lID0gaW5pdGlhbGlzZXIuZ2V0VGV4dCgpO1xuICAgICAgICAvLyByZXR1cm4gdGhpcy5kZWNvcmF0ZShuZXcgSWRlbnRpZmllcihuYW1lKSwgdGhpcy5hc01hcmtlcih0aGlzLmFzTWV0YWRhdGEoaW5pdGlhbGlzZXIuc3ltYm9sKSkpXG4gICAgICAgIHJldHVybiBuZXcgSWRlbnRpZmllcihuYW1lKTtcbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNpZGVudGlmaWVyLlxuICAgIHZpc2l0SWRlbnRpZmllcihjdHg6IFJ1bGVDb250ZXh0KTogSWRlbnRpZmllciB7XG4gICAgICAgIHRoaXMubG9nKGN0eCwgVHJhY2UuZnJhbWUoKSk7XG4gICAgICAgIHRoaXMuYXNzZXJ0VHlwZShjdHgsIEVDTUFTY3JpcHRQYXJzZXIuSWRlbnRpZmllckNvbnRleHQpXG4gICAgICAgIHJldHVybiBuZXcgSWRlbnRpZmllcihjdHguZ2V0Q2hpbGQoMCkuZ2V0VGV4dCgpKVxuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI0JpdEFuZEV4cHJlc3Npb24uXG4gICAgdmlzaXRCaXRBbmRFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNCaXRPckV4cHJlc3Npb24uXG4gICAgdmlzaXRCaXRPckV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI0Fzc2lnbm1lbnRPcGVyYXRvckV4cHJlc3Npb24uXG4gICAgICogXG4gICAgICogPGFzc29jPXJpZ2h0PiBzaW5nbGVFeHByZXNzaW9uIGFzc2lnbm1lbnRPcGVyYXRvciBzaW5nbGVFeHByZXNzaW9uICAgICMgQXNzaWdubWVudE9wZXJhdG9yRXhwcmVzc2lvblxuICAgICAqIEBwYXJhbSBjdHggXG4gICAgICovXG4gICAgdmlzaXRBc3NpZ25tZW50T3BlcmF0b3JFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpOiBBc3NpZ25tZW50RXhwcmVzc2lvbiB7XG4gICAgICAgIHRoaXMubG9nKGN0eCwgVHJhY2UuZnJhbWUoKSlcbiAgICAgICAgdGhpcy5hc3NlcnRUeXBlKGN0eCwgRUNNQVNjcmlwdFBhcnNlci5Bc3NpZ25tZW50T3BlcmF0b3JFeHByZXNzaW9uQ29udGV4dCk7XG4gICAgICAgIHRoaXMuYXNzZXJ0Tm9kZUNvdW50KGN0eCwgMylcbiAgICAgICAgY29uc3QgaW5pdGlhbGlzZXIgPSBjdHguZ2V0Q2hpbGQoMCk7XG4gICAgICAgIGNvbnN0IG9wZXJhdG9yID0gY3R4LmdldENoaWxkKDEpLmdldFRleHQoKTtcbiAgICAgICAgY29uc3QgZXhwcmVzc2lvbiA9IGN0eC5nZXRDaGlsZCgyKTtcbiAgICAgICAgY29uc3QgbGhzID0gdGhpcy5zaW5nbGVFeHByZXNzaW9uKGluaXRpYWxpc2VyKTtcbiAgICAgICAgY29uc3QgcmhzID0gdGhpcy5zaW5nbGVFeHByZXNzaW9uKGV4cHJlc3Npb24pO1xuXG4gICAgICAgIC8vIENvbXBsaWFuY2UgOiBwdWxsaW5nIHVwIEV4cHJlc3Npb25TdGF0ZW1lbnQgaW50byBBc3NpZ2VtZW50RXhwcmVzc2lvblxuICAgICAgICByZXR1cm4gbmV3IEFzc2lnbm1lbnRFeHByZXNzaW9uKG9wZXJhdG9yLCBsaHMsIHJocy5leHByZXNzaW9uKVxuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI1ZvaWRFeHByZXNzaW9uLlxuICAgIHZpc2l0Vm9pZEV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuXG4gICAgfVxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjYXNzaWdubWVudE9wZXJhdG9yLlxuICAgIHZpc2l0QXNzaWdubWVudE9wZXJhdG9yKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS5pbmZvKFwidmlzaXRBc3NpZ25tZW50T3BlcmF0b3IgWyVzXSA6IFslc11cIiwgY3R4LmdldENoaWxkQ291bnQoKSwgY3R4LmdldFRleHQoKSk7XG4gICAgfVxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjbGl0ZXJhbC5cbiAgICB2aXNpdExpdGVyYWwoY3R4OiBSdWxlQ29udGV4dCk6IExpdGVyYWwge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJ2aXNpdExpdGVyYWwgWyVzXSA6IFslc11cIiwgY3R4LmdldENoaWxkQ291bnQoKSwgY3R4LmdldFRleHQoKSk7XG4gICAgICAgIHRoaXMuYXNzZXJ0VHlwZShjdHgsIEVDTUFTY3JpcHRQYXJzZXIuTGl0ZXJhbENvbnRleHQpXG4gICAgICAgIHRoaXMuYXNzZXJ0Tm9kZUNvdW50KGN0eCwgMSk7XG4gICAgICAgIGNvbnN0IG5vZGU6IFJ1bGVDb250ZXh0ID0gY3R4LmdldENoaWxkKDApO1xuXG4gICAgICAgIGlmIChub2RlLmdldENoaWxkQ291bnQoKSA9PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jcmVhdGVMaXRlcmFsVmFsdWUobm9kZSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAobm9kZS5nZXRDaGlsZENvdW50KCkgPT0gMSkge1xuICAgICAgICAgICAgaWYgKG5vZGUgaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLk51bWVyaWNMaXRlcmFsQ29udGV4dCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnZpc2l0TnVtZXJpY0xpdGVyYWwobm9kZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnRocm93SW5zYW5jZUVycm9yKHRoaXMuZHVtcENvbnRleHQobm9kZSkpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMudGhyb3dJbnNhbmNlRXJyb3IodGhpcy5kdW1wQ29udGV4dChub2RlKSk7XG4gICAgfVxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjbnVtZXJpY0xpdGVyYWwuXG4gICAgdmlzaXROdW1lcmljTGl0ZXJhbChjdHg6IFJ1bGVDb250ZXh0KTogTGl0ZXJhbCB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0TnVtZXJpY0xpdGVyYWwgWyVzXSA6IFslc11cIiwgY3R4LmdldENoaWxkQ291bnQoKSwgY3R4LmdldFRleHQoKSk7XG4gICAgICAgIHRoaXMuYXNzZXJ0VHlwZShjdHgsIEVDTUFTY3JpcHRQYXJzZXIuTnVtZXJpY0xpdGVyYWxDb250ZXh0KVxuICAgICAgICB0aGlzLmFzc2VydE5vZGVDb3VudChjdHgsIDEpO1xuICAgICAgICBjb25zdCB2YWx1ZSA9IGN0eC5nZXRUZXh0KCk7XG4gICAgICAgIC8vIFRPRE8gOiBGaWd1cmUgb3V0IGJldHRlciB3YXlcbiAgICAgICAgY29uc3QgbGl0ZXJhbCA9IG5ldyBMaXRlcmFsKE51bWJlcih2YWx1ZSksIHZhbHVlKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGVjb3JhdGUobGl0ZXJhbCwgdGhpcy5hc01hcmtlcih0aGlzLmFzTWV0YWRhdGEoY3R4LmdldFNvdXJjZUludGVydmFsKCkpKSlcbiAgICB9XG5cbiAgICBjcmVhdGVMaXRlcmFsVmFsdWUoY3R4OiBSdWxlQ29udGV4dCk6IExpdGVyYWwge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJjcmVhdGVMaXRlcmFsVmFsdWUgWyVzXTogWyVzXVwiLCBjdHguZ2V0Q2hpbGRDb3VudCgpLCBjdHguZ2V0VGV4dCgpKTtcbiAgICAgICAgY29uc3QgdmFsdWUgPSBjdHguZ2V0VGV4dCgpO1xuICAgICAgICBjb25zdCBsaXRlcmFsID0gbmV3IExpdGVyYWwodmFsdWUsIHZhbHVlKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGVjb3JhdGUobGl0ZXJhbCwgdGhpcy5hc01hcmtlcih0aGlzLmFzTWV0YWRhdGEoY3R4LmdldFNvdXJjZUludGVydmFsKCkpKSlcbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNpZGVudGlmaWVyTmFtZS5cbiAgICB2aXNpdElkZW50aWZpZXJOYW1lKGN0eDogUnVsZUNvbnRleHQpOiBJZGVudGlmaWVyIHtcbiAgICAgICAgY29uc29sZS5pbmZvKFwidmlzaXRJZGVudGlmaWVyTmFtZSBbJXNdOiBbJXNdXCIsIGN0eC5nZXRDaGlsZENvdW50KCksIGN0eC5nZXRUZXh0KCkpO1xuICAgICAgICB0aGlzLmFzc2VydFR5cGUoY3R4LCBFQ01BU2NyaXB0UGFyc2VyLklkZW50aWZpZXJOYW1lQ29udGV4dClcbiAgICAgICAgdGhpcy5hc3NlcnROb2RlQ291bnQoY3R4LCAxKTtcbiAgICAgICAgY29uc3QgdmFsdWUgPSBjdHguZ2V0VGV4dCgpO1xuICAgICAgICBjb25zdCBpZGVudGlmaWVyID0gbmV3IElkZW50aWZpZXIodmFsdWUpO1xuICAgICAgICByZXR1cm4gdGhpcy5kZWNvcmF0ZShpZGVudGlmaWVyLCB0aGlzLmFzTWFya2VyKHRoaXMuYXNNZXRhZGF0YShjdHguZ2V0U291cmNlSW50ZXJ2YWwoKSkpKVxuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI3Jlc2VydmVkV29yZC5cbiAgICB2aXNpdFJlc2VydmVkV29yZChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0UmVzZXJ2ZWRXb3JkOiBcIiArIGN0eC5nZXRUZXh0KCkpO1xuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2tleXdvcmQuXG4gICAgdmlzaXRLZXl3b3JkKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS5pbmZvKFwidmlzaXRLZXl3b3JkOiBcIiArIGN0eC5nZXRUZXh0KCkpO1xuXG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNmdXR1cmVSZXNlcnZlZFdvcmQuXG4gICAgdmlzaXRGdXR1cmVSZXNlcnZlZFdvcmQoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2dldHRlci5cbiAgICB2aXNpdEdldHRlcihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gICAgfVxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI3NldHRlci5cbiAgICB2aXNpdFNldHRlcihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gICAgfVxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjZW9zLlxuICAgIHZpc2l0RW9zKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgLy9jb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2VvZi5cbiAgICB2aXNpdEVvZihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gICAgfVxuXG59Il19