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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9BU1RQYXJzZXIudHMiXSwibmFtZXMiOlsiUGFyc2VyVHlwZSIsIkFTVFBhcnNlciIsImNvbnN0cnVjdG9yIiwidmlzaXRvciIsIkRlbHZlbkFTVFZpc2l0b3IiLCJnZW5lcmF0ZSIsInNvdXJjZSIsImNvZGUiLCJ0eXBlIiwidmFsdWUiLCJmcyIsInJlYWRGaWxlU3luYyIsImNoYXJzIiwiYW50bHI0IiwiSW5wdXRTdHJlYW0iLCJsZXhlciIsIkRlbHZlbkxleGVyIiwidG9rZW5zIiwiQ29tbW9uVG9rZW5TdHJlYW0iLCJwYXJzZXIiLCJEZWx2ZW5QYXJzZXIiLCJ0cmVlIiwicHJvZ3JhbSIsImFjY2VwdCIsIlByaW50VmlzaXRvciIsImNvbnNvbGUiLCJpbmZvIiwicmVzdWx0IiwicGFyc2UiLCJFQ01BU2NyaXB0IiwiQVNUUGFyc2VyRGVmYXVsdCIsIkVycm9yIiwiRGVsdmVuVmlzaXRvciIsInJ1bGVUeXBlTWFwIiwiTWFwIiwic2V0dXBUeXBlUnVsZXMiLCJrZXlzIiwiT2JqZWN0IiwiZ2V0T3duUHJvcGVydHlOYW1lcyIsImtleSIsIm5hbWUiLCJzdGFydHNXaXRoIiwic2V0IiwicGFyc2VJbnQiLCJsb2ciLCJjdHgiLCJmcmFtZSIsImZ1bmN0aW9uIiwiZ2V0Q2hpbGRDb3VudCIsImdldFRleHQiLCJkdW1wQ29udGV4dCIsImNvbnRleHQiLCJlbmRzV2l0aCIsInB1c2giLCJsZW5ndGgiLCJjb250ZXh0TmFtZSIsImxvbmdlc3QiLCJvYmoiLCJFQ01BU2NyaXB0UGFyc2VyIiwiY2hhaW4iLCJwcm90b3R5cGUiLCJfX3Byb3RvX18iLCJkdW1wQ29udGV4dEFsbENoaWxkcmVuIiwiaW5kZW50IiwicGFkIiwicGFkU3RhcnQiLCJub2RlcyIsIm1hcmtlciIsImkiLCJjaGlsZCIsImdldENoaWxkIiwiZ2V0UnVsZUJ5SWQiLCJpZCIsImdldCIsImFzTWFya2VyIiwibWV0YWRhdGEiLCJpbmRleCIsImxpbmUiLCJjb2x1bW4iLCJkZWNvcmF0ZSIsIm5vZGUiLCJzdGFydCIsImVuZCIsImFzTWV0YWRhdGEiLCJpbnRlcnZhbCIsIm9mZnNldCIsInN0b3AiLCJ0aHJvd1R5cGVFcnJvciIsInR5cGVJZCIsIlR5cGVFcnJvciIsInRocm93SW5zYW5jZUVycm9yIiwiYXNzZXJ0VHlwZSIsInZpc2l0UHJvZ3JhbSIsIlRyYWNlIiwiUHJvZ3JhbUNvbnRleHQiLCJzdGF0ZW1lbnRzIiwic3RtIiwiU3RhdGVtZW50Q29udGV4dCIsInN0YXRlbWVudCIsInZpc2l0U3RhdGVtZW50IiwiZ2V0U291cmNlSW50ZXJ2YWwiLCJzY3JpcHQiLCJTY3JpcHQiLCJCbG9ja0NvbnRleHQiLCJ2aXNpdEJsb2NrIiwiVmFyaWFibGVTdGF0ZW1lbnRDb250ZXh0IiwidmlzaXRWYXJpYWJsZVN0YXRlbWVudCIsIkltcG9ydFN0YXRlbWVudENvbnRleHQiLCJ2aXNpdEltcG9ydFN0YXRlbWVudCIsIkV4cG9ydFN0YXRlbWVudENvbnRleHQiLCJ2aXNpdEV4cG9ydFN0YXRlbWVudCIsIkVtcHR5U3RhdGVtZW50Q29udGV4dCIsIkNsYXNzRGVjbGFyYXRpb25Db250ZXh0IiwidmlzaXRDbGFzc0RlY2xhcmF0aW9uIiwiRXhwcmVzc2lvblN0YXRlbWVudENvbnRleHQiLCJ2aXNpdEV4cHJlc3Npb25TdGF0ZW1lbnQiLCJJZlN0YXRlbWVudENvbnRleHQiLCJ2aXNpdElmU3RhdGVtZW50IiwiSXRlcmF0aW9uU3RhdGVtZW50Q29udGV4dCIsInZpc2l0SXRlcmF0aW9uU3RhdGVtZW50IiwiQ29udGludWVTdGF0ZW1lbnRDb250ZXh0IiwidmlzaXRDb250aW51ZVN0YXRlbWVudCIsIkJyZWFrU3RhdGVtZW50Q29udGV4dCIsInZpc2l0QnJlYWtTdGF0ZW1lbnQiLCJSZXR1cm5TdGF0ZW1lbnRDb250ZXh0IiwidmlzaXRSZXR1cm5TdGF0ZW1lbnQiLCJZaWVsZFN0YXRlbWVudENvbnRleHQiLCJ2aXNpdFlpZWxkU3RhdGVtZW50IiwiV2l0aFN0YXRlbWVudENvbnRleHQiLCJ2aXNpdFdpdGhTdGF0ZW1lbnQiLCJMYWJlbGxlZFN0YXRlbWVudENvbnRleHQiLCJ2aXNpdExhYmVsbGVkU3RhdGVtZW50IiwiU3dpdGNoU3RhdGVtZW50Q29udGV4dCIsInZpc2l0U3dpdGNoU3RhdGVtZW50IiwiRnVuY3Rpb25FeHByZXNzaW9uQ29udGV4dCIsInZpc2l0RnVuY3Rpb25FeHByZXNzaW9uIiwiVGhyb3dTdGF0ZW1lbnRDb250ZXh0IiwidmlzaXRUaHJvd1N0YXRlbWVudCIsIlRyeVN0YXRlbWVudENvbnRleHQiLCJ2aXNpdFRyeVN0YXRlbWVudCIsIkRlYnVnZ2VyU3RhdGVtZW50Q29udGV4dCIsInZpc2l0RGVidWdnZXJTdGF0ZW1lbnQiLCJGdW5jdGlvbkRlY2xhcmF0aW9uQ29udGV4dCIsInZpc2l0RnVuY3Rpb25EZWNsYXJhdGlvbiIsImJvZHkiLCJTdGF0ZW1lbnRMaXN0Q29udGV4dCIsInN0YXRlbWVudExpc3QiLCJ2aXNpdFN0YXRlbWVudExpc3QiLCJCbG9ja1N0YXRlbWVudCIsImZpbHRlclN5bWJvbHMiLCJnZXRUeXBlZFJ1bGVDb250ZXh0IiwiVmFyaWFibGVEZWNsYXJhdGlvbkxpc3RDb250ZXh0IiwidmlzaXRWYXJpYWJsZURlY2xhcmF0aW9uTGlzdCIsInZhck1vZGlmaWVyQ29udGV4dCIsIlZhck1vZGlmaWVyQ29udGV4dCIsInZhck1vZGlmaWVyIiwiZGVjbGFyYXRpb25zIiwiVmFyaWFibGVEZWNsYXJhdGlvbkNvbnRleHQiLCJ2aXNpdFZhcmlhYmxlRGVjbGFyYXRpb24iLCJWYXJpYWJsZURlY2xhcmF0aW9uIiwiYXNzaWduYWJsZUNvbnRleHQiLCJBc3NpZ25hYmxlQ29udGV4dCIsImFzc2lnbmFibGUiLCJ2aXNpdEFzc2lnbmFibGUiLCJpbml0Iiwic2luZ2xlRXhwcmVzc2lvbiIsIlZhcmlhYmxlRGVjbGFyYXRvciIsInZpc2l0SW5pdGlhbGlzZXIiLCJJbml0aWFsaXNlckNvbnRleHQiLCJhc3NlcnROb2RlQ291bnQiLCJPYmplY3RMaXRlcmFsRXhwcmVzc2lvbkNvbnRleHQiLCJ2aXNpdE9iamVjdExpdGVyYWxFeHByZXNzaW9uIiwiQXJyYXlMaXRlcmFsRXhwcmVzc2lvbkNvbnRleHQiLCJ2aXNpdEFycmF5TGl0ZXJhbEV4cHJlc3Npb24iLCJ2aXNpdEVtcHR5U3RhdGVtZW50IiwiY291bnQiLCJleHAiLCJFeHByZXNzaW9uU2VxdWVuY2VDb250ZXh0IiwidmlzaXRFeHByZXNzaW9uU2VxdWVuY2UiLCJ0ZXN0IiwiY29uc2VxdWVudCIsImFsdGVybmF0ZSIsInVuZGVmaW5lZCIsIklmU3RhdGVtZW50IiwidmlzaXREb1N0YXRlbWVudCIsInZpc2l0V2hpbGVTdGF0ZW1lbnQiLCJ2aXNpdEZvclN0YXRlbWVudCIsInZpc2l0Rm9yVmFyU3RhdGVtZW50IiwidHJhY2UiLCJ2aXNpdEZvckluU3RhdGVtZW50IiwidmlzaXRGb3JWYXJJblN0YXRlbWVudCIsInZpc2l0Q2FzZUJsb2NrIiwidmlzaXRDYXNlQ2xhdXNlcyIsInZpc2l0Q2FzZUNsYXVzZSIsInZpc2l0RGVmYXVsdENsYXVzZSIsImlkZW50aWZpZXIiLCJ2aXNpdElkZW50aWZpZXIiLCJMYWJlbGVkU3RhdGVtZW50IiwidmlzaXRDYXRjaFByb2R1Y3Rpb24iLCJ2aXNpdEZpbmFsbHlQcm9kdWN0aW9uIiwiYXN5bmMiLCJnZW5lcmF0b3IiLCJwYXJhbXMiLCJzeW1ib2wiLCJ0eHQiLCJJZGVudGlmaWVyQ29udGV4dCIsIkZvcm1hbFBhcmFtZXRlckxpc3RDb250ZXh0IiwidmlzaXRGb3JtYWxQYXJhbWV0ZXJMaXN0IiwiRnVuY3Rpb25Cb2R5Q29udGV4dCIsIkFzeW5jRnVuY3Rpb25EZWNsYXJhdGlvbiIsIkZ1bmN0aW9uRGVjbGFyYXRpb24iLCJwYXJtYXMiLCJ2aXNpdEZ1bmN0aW9uRGVjbCIsIkZ1bmN0aW9uRGVjbENvbnRleHQiLCJ2aXNpdEZ1bmN0aW9uQm9keSIsInNvdXJjZUVsZW1lbnRzQ29udGV4dCIsIlNvdXJjZUVsZW1lbnRzQ29udGV4dCIsInZpc2l0U291cmNlRWxlbWVudHMiLCJzb3VyY2VFbGVtZW50IiwidmlzaXRBcnJheUxpdGVyYWwiLCJBcnJheUxpdGVyYWxDb250ZXh0IiwiZWxlbWVudExpc3RDb250ZXh0IiwiRWxlbWVudExpc3RDb250ZXh0IiwiZWxlbWVudHMiLCJ2aXNpdEVsZW1lbnRMaXN0IiwiQXJyYXlFeHByZXNzaW9uIiwiaXRlcmFibGUiLCJ2aXNpdEFycmF5RWxlbWVudCIsIkFycmF5RWxlbWVudENvbnRleHQiLCJleHByZXNzaW9uIiwiU3ByZWFkRWxlbWVudCIsInZpc2l0T2JqZWN0TGl0ZXJhbCIsIk9iamVjdExpdGVyYWxDb250ZXh0IiwiT2JqZWN0RXhwcmVzc2lvbiIsInByb3BlcnRpZXMiLCJwcm9wZXJ0eSIsIlByb3BlcnR5RXhwcmVzc2lvbkFzc2lnbm1lbnRDb250ZXh0IiwidmlzaXRQcm9wZXJ0eUV4cHJlc3Npb25Bc3NpZ25tZW50IiwiUHJvcGVydHlTaG9ydGhhbmRDb250ZXh0IiwidmlzaXRQcm9wZXJ0eVNob3J0aGFuZCIsIkZ1bmN0aW9uUHJvcGVydHlDb250ZXh0IiwidmlzaXRGdW5jdGlvblByb3BlcnR5IiwiY29tcHV0ZWQiLCJtZXRob2QiLCJzaG9ydGhhbmQiLCJJZGVudGlmaWVyIiwiUHJvcGVydHkiLCJmaWx0ZXJlZCIsIm4wIiwibjEiLCJuMiIsInZpc2l0UHJvcGVydHlOYW1lIiwiQ29tcHV0ZWRQcm9wZXJ0eUV4cHJlc3Npb25Bc3NpZ25tZW50Q29udGV4dCIsIlByb3BlcnR5R2V0dGVyQ29udGV4dCIsIlByb3BlcnR5U2V0dGVyQ29udGV4dCIsInZpc2l0UHJvcGVydHlHZXR0ZXIiLCJ2aXNpdFByb3BlcnR5U2V0dGVyIiwiUHJvcGVydHlOYW1lQ29udGV4dCIsImNyZWF0ZUxpdGVyYWxWYWx1ZSIsInZpc2l0SWRlbnRpZmllck5hbWUiLCJ2aXNpdFByb3BlcnR5U2V0UGFyYW1ldGVyTGlzdCIsInZpc2l0QXJndW1lbnRzIiwidmlzaXRBcmd1bWVudExpc3QiLCJleHByZXNzaW9ucyIsIkV4cHJlc3Npb25TdGF0ZW1lbnQiLCJTZXF1ZW5jZUV4cHJlc3Npb24iLCJMaXRlcmFsRXhwcmVzc2lvbkNvbnRleHQiLCJ2aXNpdExpdGVyYWxFeHByZXNzaW9uIiwiQXNzaWdubWVudEV4cHJlc3Npb25Db250ZXh0IiwidmlzaXRBc3NpZ25tZW50RXhwcmVzc2lvbiIsIkFkZGl0aXZlRXhwcmVzc2lvbkNvbnRleHQiLCJ2aXNpdEFkZGl0aXZlRXhwcmVzc2lvbiIsIk11bHRpcGxpY2F0aXZlRXhwcmVzc2lvbkNvbnRleHQiLCJ2aXNpdE11bHRpcGxpY2F0aXZlRXhwcmVzc2lvbiIsIkVxdWFsaXR5RXhwcmVzc2lvbkNvbnRleHQiLCJ2aXNpdEVxdWFsaXR5RXhwcmVzc2lvbiIsIlBhcmVudGhlc2l6ZWRFeHByZXNzaW9uQ29udGV4dCIsInZpc2l0UGFyZW50aGVzaXplZEV4cHJlc3Npb24iLCJSZWxhdGlvbmFsRXhwcmVzc2lvbkNvbnRleHQiLCJ2aXNpdFJlbGF0aW9uYWxFeHByZXNzaW9uIiwiSWRlbnRpZmllckV4cHJlc3Npb25Db250ZXh0IiwidmlzaXRJZGVudGlmaWVyRXhwcmVzc2lvbiIsIk1lbWJlckRvdEV4cHJlc3Npb25Db250ZXh0IiwidmlzaXRNZW1iZXJEb3RFeHByZXNzaW9uIiwiTWVtYmVySW5kZXhFeHByZXNzaW9uQ29udGV4dCIsInZpc2l0TWVtYmVySW5kZXhFeHByZXNzaW9uIiwiQXNzaWdubWVudE9wZXJhdG9yRXhwcmVzc2lvbkNvbnRleHQiLCJ2aXNpdEFzc2lnbm1lbnRPcGVyYXRvckV4cHJlc3Npb24iLCJ2aXNpdENsYXNzVGFpbCIsImNsYXNzQm9keSIsIkNsYXNzQm9keSIsIkNsYXNzRGVjbGFyYXRpb24iLCJDbGFzc1RhaWxDb250ZXh0IiwiZ2V0Tm9kZUJ5VHlwZSIsIkNsYXNzRWxlbWVudENvbnRleHQiLCJ2aXNpdENsYXNzRWxlbWVudCIsInZpc2l0TWV0aG9kRGVmaW5pdGlvbiIsImZvcm1hbCIsIkZvcm1hbFBhcmFtZXRlckFyZ0NvbnRleHQiLCJwYXJhbWV0ZXIiLCJ2aXNpdEZvcm1hbFBhcmFtZXRlckFyZyIsIkxhc3RGb3JtYWxQYXJhbWV0ZXJBcmdDb250ZXh0IiwidmlzaXRMYXN0Rm9ybWFsUGFyYW1ldGVyQXJnIiwiQXNzaWdubWVudFBhdHRlcm4iLCJSZXN0RWxlbWVudCIsInZpc2l0VGVybmFyeUV4cHJlc3Npb24iLCJ2aXNpdExvZ2ljYWxBbmRFeHByZXNzaW9uIiwidmlzaXRQcmVJbmNyZW1lbnRFeHByZXNzaW9uIiwidmlzaXRJbkV4cHJlc3Npb24iLCJ2aXNpdExvZ2ljYWxPckV4cHJlc3Npb24iLCJ2aXNpdE5vdEV4cHJlc3Npb24iLCJ2aXNpdFByZURlY3JlYXNlRXhwcmVzc2lvbiIsInZpc2l0QXJndW1lbnRzRXhwcmVzc2lvbiIsInZpc2l0VGhpc0V4cHJlc3Npb24iLCJmdW5jdGlvbkV4cHJlc3Npb24iLCJBbm95bW91c0Z1bmN0aW9uRGVjbENvbnRleHQiLCJ2aXNpdEFub3ltb3VzRnVuY3Rpb25EZWNsIiwiQXJyb3dGdW5jdGlvbkNvbnRleHQiLCJ2aXNpdEFycm93RnVuY3Rpb24iLCJwYXJhbUNvbnRleHQiLCJBcnJvd0Z1bmN0aW9uUGFyYW1ldGVyc0NvbnRleHQiLCJib2R5Q29udGV4dCIsIkFycm93RnVuY3Rpb25Cb2R5Q29udGV4dCIsInZpc2l0QXJyb3dGdW5jdGlvblBhcmFtZXRlcnMiLCJ2aXNpdEFycm93RnVuY3Rpb25Cb2R5IiwiQXJyb3dGdW5jdGlvbkV4cHJlc3Npb24iLCJwYXJhbWV0aXplZCIsInZpc2l0VW5hcnlNaW51c0V4cHJlc3Npb24iLCJ2aXNpdFBvc3REZWNyZWFzZUV4cHJlc3Npb24iLCJpbml0aWFsaXNlciIsIm9wZXJhdG9yIiwibGhzIiwicmhzIiwiQXNzaWdubWVudEV4cHJlc3Npb24iLCJ2aXNpdFR5cGVvZkV4cHJlc3Npb24iLCJ2aXNpdEluc3RhbmNlb2ZFeHByZXNzaW9uIiwidmlzaXRVbmFyeVBsdXNFeHByZXNzaW9uIiwidmlzaXREZWxldGVFeHByZXNzaW9uIiwibGVmdCIsInJpZ2h0IiwiX3Zpc2l0QmluYXJ5RXhwcmVzc2lvbiIsIkJpbmFyeUV4cHJlc3Npb24iLCJ2aXNpdEJpdFhPckV4cHJlc3Npb24iLCJ2aXNpdEJpbmFyeUV4cHJlc3Npb24iLCJ2aXNpdEJpdFNoaWZ0RXhwcmVzc2lvbiIsInZpc2l0UG9zdEluY3JlbWVudEV4cHJlc3Npb24iLCJ2aXNpdEJpdE5vdEV4cHJlc3Npb24iLCJ2aXNpdE5ld0V4cHJlc3Npb24iLCJMaXRlcmFsQ29udGV4dCIsInZpc2l0TGl0ZXJhbCIsIk51bWVyaWNMaXRlcmFsQ29udGV4dCIsInZpc2l0TnVtZXJpY0xpdGVyYWwiLCJleHByIiwiU3RhdGljTWVtYmVyRXhwcmVzc2lvbiIsInByaW50IiwiQ29tcHV0ZWRNZW1iZXJFeHByZXNzaW9uIiwidmlzaXRCaXRBbmRFeHByZXNzaW9uIiwidmlzaXRCaXRPckV4cHJlc3Npb24iLCJ2aXNpdFZvaWRFeHByZXNzaW9uIiwidmlzaXRBc3NpZ25tZW50T3BlcmF0b3IiLCJsaXRlcmFsIiwiTGl0ZXJhbCIsIk51bWJlciIsIklkZW50aWZpZXJOYW1lQ29udGV4dCIsInZpc2l0UmVzZXJ2ZWRXb3JkIiwidmlzaXRLZXl3b3JkIiwidmlzaXRGdXR1cmVSZXNlcnZlZFdvcmQiLCJ2aXNpdEdldHRlciIsInZpc2l0U2V0dGVyIiwidmlzaXRFb3MiLCJ2aXNpdEVvZiJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUNBOztBQUVBOzs7Ozs7OztBQWJBOztBQWVBOzs7Ozs7OztJQVFZQSxVOzs7V0FBQUEsVTtBQUFBQSxFQUFBQSxVLENBQUFBLFU7R0FBQUEsVSwwQkFBQUEsVTs7QUFZRyxNQUFlQyxTQUFmLENBQXlCO0FBR3BDQyxFQUFBQSxXQUFXLENBQUNDLE9BQUQsRUFBNkI7QUFDcEMsU0FBS0EsT0FBTCxHQUFlQSxPQUFPLElBQUksSUFBSUMsZ0JBQUosRUFBMUI7QUFDSDs7QUFFREMsRUFBQUEsUUFBUSxDQUFDQyxNQUFELEVBQThCO0FBQ2xDLFFBQUlDLElBQUo7O0FB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bUwsRUFBQUEsV0FBVyxDQUFDbFUsR0FBRCxFQUFtQjtBQUMxQnBCLElBQUFBLE9BQU8sQ0FBQ21LLEtBQVIsQ0FBYyxpQkFBZDtBQUNILEdBem5EK0MsQ0EwbkRoRDs7O0FBQ0FvTCxFQUFBQSxXQUFXLENBQUNuVSxHQUFELEVBQW1CO0FBQzFCcEIsSUFBQUEsT0FBTyxDQUFDbUssS0FBUixDQUFjLGlCQUFkO0FBQ0gsR0E3bkQrQyxDQStuRGhEOzs7QUFDQXFMLEVBQUFBLFFBQVEsQ0FBQ3BVLEdBQUQsRUFBbUIsQ0FFMUIsQ0FGTyxDQUNKO0FBR0o7OztBQUNBcVUsRUFBQUEsUUFBUSxDQUFDclUsR0FBRCxFQUFtQjtBQUN2QnBCLElBQUFBLE9BQU8sQ0FBQ21LLEtBQVIsQ0FBYyxpQkFBZDtBQUNIOztBQXZvRCtDIiwic291cmNlc0NvbnRlbnQiOlsiLyogZXNsaW50LWRpc2FibGUgQHR5cGVzY3JpcHQtZXNsaW50L2V4cGxpY2l0LW1vZHVsZS1ib3VuZGFyeS10eXBlcyAqL1xuaW1wb3J0ICogYXMgYW50bHI0IGZyb20gXCJhbnRscjRcIlxuaW1wb3J0IHsgRUNNQVNjcmlwdFBhcnNlclZpc2l0b3IgYXMgRGVsdmVuVmlzaXRvciB9IGZyb20gXCIuL3BhcnNlci9FQ01BU2NyaXB0UGFyc2VyVmlzaXRvclwiXG5pbXBvcnQgeyBFQ01BU2NyaXB0UGFyc2VyIGFzIERlbHZlblBhcnNlciwgRUNNQVNjcmlwdFBhcnNlciwgUHJvZ3JhbUNvbnRleHQgfSBmcm9tIFwiLi9wYXJzZXIvRUNNQVNjcmlwdFBhcnNlclwiXG5pbXBvcnQgeyBFQ01BU2NyaXB0TGV4ZXIgYXMgRGVsdmVuTGV4ZXIgfSBmcm9tIFwiLi9wYXJzZXIvRUNNQVNjcmlwdExleGVyXCJcbmltcG9ydCB7IFJ1bGVDb250ZXh0IH0gZnJvbSBcImFudGxyNC9SdWxlQ29udGV4dFwiXG5pbXBvcnQgeyBQcmludFZpc2l0b3IgfSBmcm9tIFwiLi9QcmludFZpc2l0b3JcIlxuaW1wb3J0IEFTVE5vZGUgZnJvbSBcIi4vQVNUTm9kZVwiO1xuaW1wb3J0IHsgRXhwcmVzc2lvblN0YXRlbWVudCwgTGl0ZXJhbCwgU2NyaXB0LCBCbG9ja1N0YXRlbWVudCwgU3RhdGVtZW50LCBTZXF1ZW5jZUV4cHJlc3Npb24sIFRocm93U3RhdGVtZW50LCBBc3NpZ25tZW50RXhwcmVzc2lvbiwgSWRlbnRpZmllciwgQmluYXJ5RXhwcmVzc2lvbiwgQXJyYXlFeHByZXNzaW9uLCBPYmplY3RFeHByZXNzaW9uLCBPYmplY3RFeHByZXNzaW9uUHJvcGVydHksIFByb3BlcnR5LCBQcm9wZXJ0eUtleSwgVmFyaWFibGVEZWNsYXJhdGlvbiwgVmFyaWFibGVEZWNsYXJhdG9yLCBFeHByZXNzaW9uLCBJZlN0YXRlbWVudCwgQ29tcHV0ZWRNZW1iZXJFeHByZXNzaW9uLCBTdGF0aWNNZW1iZXJFeHByZXNzaW9uLCBDbGFzc0RlY2xhcmF0aW9uLCBDbGFzc0JvZHksIEZ1bmN0aW9uRGVjbGFyYXRpb24sIEZ1bmN0aW9uUGFyYW1ldGVyLCBBc3luY0Z1bmN0aW9uRGVjbGFyYXRpb24sIEFzc2lnbm1lbnRQYXR0ZXJuLCBCaW5kaW5nUGF0dGVybiwgQmluZGluZ0lkZW50aWZpZXIsIEFycmF5RXhwcmVzc2lvbkVsZW1lbnQsIFNwcmVhZEVsZW1lbnQsIEFycm93RnVuY3Rpb25FeHByZXNzaW9uLCBMYWJlbGVkU3RhdGVtZW50LCBSZXN0RWxlbWVudCB9IGZyb20gXCIuL25vZGVzXCI7XG5pbXBvcnQgeyBTeW50YXggfSBmcm9tIFwiLi9zeW50YXhcIjtcbmltcG9ydCB7IHR5cGUgfSBmcm9tIFwib3NcIlxuaW1wb3J0ICogYXMgZnMgZnJvbSBcImZzXCJcbmltcG9ydCB7IEludGVydmFsIH0gZnJvbSBcImFudGxyNFwiXG5pbXBvcnQgVHJhY2UsIHsgQ2FsbFNpdGUgfSBmcm9tIFwiLi90cmFjZVwiXG5cbi8qKlxuICogVmVyc2lvbiB0aGF0IHdlIGdlbmVyYXRlIHRoZSBBU1QgZm9yLiBcbiAqIFRoaXMgYWxsb3dzIGZvciB0ZXN0aW5nIGRpZmZlcmVudCBpbXBsZW1lbnRhdGlvbnNcbiAqIFxuICogQ3VycmVudGx5IG9ubHkgRUNNQVNjcmlwdCBpcyBzdXBwb3J0ZWRcbiAqIFxuICogaHR0cHM6Ly9naXRodWIuY29tL2VzdHJlZS9lc3RyZWVcbiAqL1xuZXhwb3J0IGVudW0gUGFyc2VyVHlwZSB7IEVDTUFTY3JpcHQgfVxuZXhwb3J0IHR5cGUgU291cmNlVHlwZSA9IFwiY29kZVwiIHwgXCJmaWxlbmFtZVwiO1xuZXhwb3J0IHR5cGUgU291cmNlQ29kZSA9IHtcbiAgICB0eXBlOiBTb3VyY2VUeXBlLFxuICAgIHZhbHVlOiBzdHJpbmdcbn1cbmV4cG9ydCBpbnRlcmZhY2UgTWFya2VyIHtcbiAgICBpbmRleDogbnVtYmVyO1xuICAgIGxpbmU6IG51bWJlcjtcbiAgICBjb2x1bW46IG51bWJlcjtcbn1cblxuZXhwb3J0IGRlZmF1bHQgYWJzdHJhY3QgY2xhc3MgQVNUUGFyc2VyIHtcbiAgICBwcml2YXRlIHZpc2l0b3I6ICh0eXBlb2YgRGVsdmVuVmlzaXRvciB8IG51bGwpXG5cbiAgICBjb25zdHJ1Y3Rvcih2aXNpdG9yPzogRGVsdmVuQVNUVmlzaXRvcikge1xuICAgICAgICB0aGlzLnZpc2l0b3IgPSB2aXNpdG9yIHx8IG5ldyBEZWx2ZW5BU1RWaXNpdG9yKCk7XG4gICAgfVxuXG4gICAgZ2VuZXJhdGUoc291cmNlOiBTb3VyY2VDb2RlKTogQVNUTm9kZSB7XG4gICAgICAgIGxldCBjb2RlO1xuICAgICAgICBzd2l0Y2ggKHNvdXJjZS50eXBlKSB7XG4gICAgICAgICAgICBjYXNlIFwiY29kZVwiOlxuICAgICAgICAgICAgICAgIGNvZGUgPSBzb3VyY2UudmFsdWU7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwiZmlsZW5hbWVcIjpcbiAgICAgICAgICAgICAgICBjb2RlID0gZnMucmVhZEZpbGVTeW5jKHNvdXJjZS52YWx1ZSwgXCJ1dGY4XCIpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGNoYXJzID0gbmV3IGFudGxyNC5JbnB1dFN0cmVhbShjb2RlKTtcbiAgICAgICAgbGV0IGxleGVyID0gbmV3IERlbHZlbkxleGVyKGNoYXJzKTtcbiAgICAgICAgbGV0IHRva2VucyA9IG5ldyBhbnRscjQuQ29tbW9uVG9rZW5TdHJlYW0obGV4ZXIpO1xuICAgICAgICBsZXQgcGFyc2VyID0gbmV3IERlbHZlblBhcnNlcih0b2tlbnMpO1xuICAgICAgICBsZXQgdHJlZSA9IHBhcnNlci5wcm9ncmFtKCk7XG4gICAgICAgIC8vIGNvbnNvbGUuaW5mbyh0cmVlLnRvU3RyaW5nVHJlZSgpKVxuICAgICAgICB0cmVlLmFjY2VwdChuZXcgUHJpbnRWaXNpdG9yKCkpO1xuICAgICAgICBjb25zb2xlLmluZm8oXCItLS0tLS0tLS0tLS0tLS0tLS0tLS1cIik7XG4gICAgICAgIGxldCByZXN1bHQgPSB0cmVlLmFjY2VwdCh0aGlzLnZpc2l0b3IpO1xuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFBhcnNlIHNvdXJjZSBhbmQgZ2VuZXJlYXRlIEFTVCB0cmVlXG4gICAgICogQHBhcmFtIHNvdXJjZSBcbiAgICAgKiBAcGFyYW0gdHlwZSBcbiAgICAgKi9cbiAgICBzdGF0aWMgcGFyc2Uoc291cmNlOiBTb3VyY2VDb2RlLCB0eXBlPzogUGFyc2VyVHlwZSk6IEFTVE5vZGUge1xuICAgICAgICBpZiAodHlwZSA9PSBudWxsKVxuICAgICAgICAgICAgdHlwZSA9IFBhcnNlclR5cGUuRUNNQVNjcmlwdDtcbiAgICAgICAgbGV0IHBhcnNlcjtcbiAgICAgICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICAgICAgICBjYXNlIFBhcnNlclR5cGUuRUNNQVNjcmlwdDpcbiAgICAgICAgICAgICAgICBwYXJzZXIgPSBuZXcgQVNUUGFyc2VyRGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJVbmtvd24gcGFyc2VyIHR5cGVcIik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHBhcnNlci5nZW5lcmF0ZShzb3VyY2UpXG4gICAgfVxufVxuXG5jbGFzcyBBU1RQYXJzZXJEZWZhdWx0IGV4dGVuZHMgQVNUUGFyc2VyIHtcblxufVxuXG5leHBvcnQgY2xhc3MgRGVsdmVuQVNUVmlzaXRvciBleHRlbmRzIERlbHZlblZpc2l0b3Ige1xuICAgIHByaXZhdGUgcnVsZVR5cGVNYXA6IE1hcDxudW1iZXIsIHN0cmluZz4gPSBuZXcgTWFwKCk7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5zZXR1cFR5cGVSdWxlcygpO1xuICAgIH1cblxuICAgIHByaXZhdGUgc2V0dXBUeXBlUnVsZXMoKSB7XG4gICAgICAgIGNvbnN0IGtleXMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhEZWx2ZW5QYXJzZXIpO1xuICAgICAgICBmb3IgKHZhciBrZXkgaW4ga2V5cykge1xuICAgICAgICAgICAgbGV0IG5hbWUgPSBrZXlzW2tleV07XG4gICAgICAgICAgICBpZiAobmFtZS5zdGFydHNXaXRoKCdSVUxFXycpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5ydWxlVHlwZU1hcC5zZXQocGFyc2VJbnQoRGVsdmVuUGFyc2VyW25hbWVdKSwgbmFtZSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgbG9nKGN0eDogUnVsZUNvbnRleHQsIGZyYW1lOiBDYWxsU2l0ZSkge1xuICAgICAgICBjb25zb2xlLmluZm8oXCIlcyBbJXNdIDogJXNcIiwgZnJhbWUuZnVuY3Rpb24sIGN0eC5nZXRDaGlsZENvdW50KCksIGN0eC5nZXRUZXh0KCkpO1xuICAgIH1cblxuICAgIHByaXZhdGUgZHVtcENvbnRleHQoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zdCBrZXlzID0gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoRGVsdmVuUGFyc2VyKTtcbiAgICAgICAgbGV0IGNvbnRleHQgPSBbXVxuICAgICAgICBmb3IgKHZhciBrZXkgaW4ga2V5cykge1xuICAgICAgICAgICAgbGV0IG5hbWUgPSBrZXlzW2tleV07XG4gICAgICAgICAgICAvLyB0aGlzIG9ubHkgdGVzdCBpbmhlcml0YW5jZVxuICAgICAgICAgICAgaWYgKG5hbWUuZW5kc1dpdGgoJ0NvbnRleHQnKSkge1xuICAgICAgICAgICAgICAgIGlmIChjdHggaW5zdGFuY2VvZiBEZWx2ZW5QYXJzZXJbbmFtZV0pIHtcbiAgICAgICAgICAgICAgICAgICAgY29udGV4dC5wdXNoKG5hbWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGRpcnkgaGFjayBmb3Igd2Fsa2luZyBhbnRsZXIgZGVwZW5jeSBjaGFpbiBcbiAgICAgICAgLy8gZmluZCBsb25nZXN0IGRlcGVuZGVuY3kgY2hhaW5nO1xuICAgICAgICAvLyB0aGlzIHRyYXZlcnNhbCBpcyBzcGVjaWZpYyB0byBBTlRMIHBhcnNlclxuICAgICAgICAvLyBXZSB3YW50IHRvIGJlIGFibGUgdG8gZmluZCBkZXBlbmRlbmNpZXMgc3VjaCBhcztcbiAgICAgICAgLypcbiAgICAgICAgICAgIC0tLS0tLS0tIC0tLS0tLS0tLS0tLVxuICAgICAgICAgICAgUHJvcGVydHlFeHByZXNzaW9uQXNzaWdubWVudENvbnRleHRcbiAgICAgICAgICAgICoqIFByb3BlcnR5QXNzaWdubWVudENvbnRleHRcbiAgICAgICAgICAgICoqIFBhcnNlclJ1bGVDb250ZXh0XG4gICAgICAgICAgICAtLS0tLS0tLSAtLS0tLS0tLS0tLS1cbiAgICAgICAgICAgIFByb3BlcnR5QXNzaWdubWVudENvbnRleHRcbiAgICAgICAgICAgICoqIFBhcnNlclJ1bGVDb250ZXh0XG4gICAgICAgICAqL1xuICAgICAgICBpZiAoY29udGV4dC5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICBsZXQgY29udGV4dE5hbWU7XG4gICAgICAgICAgICBsZXQgbG9uZ2VzdCA9IDA7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGtleSBpbiBjb250ZXh0KSB7XG4gICAgICAgICAgICAgICAgY29uc3QgbmFtZSA9IGNvbnRleHRba2V5XTtcbiAgICAgICAgICAgICAgICBsZXQgb2JqID0gRUNNQVNjcmlwdFBhcnNlcltuYW1lXTtcbiAgICAgICAgICAgICAgICBsZXQgY2hhaW4gPSAxO1xuICAgICAgICAgICAgICAgIGRvIHtcbiAgICAgICAgICAgICAgICAgICAgKytjaGFpbjtcbiAgICAgICAgICAgICAgICAgICAgb2JqID0gRUNNQVNjcmlwdFBhcnNlcltvYmoucHJvdG90eXBlLl9fcHJvdG9fXy5jb25zdHJ1Y3Rvci5uYW1lXTtcbiAgICAgICAgICAgICAgICB9IHdoaWxlIChvYmogJiYgb2JqLnByb3RvdHlwZSlcbiAgICAgICAgICAgICAgICBpZiAoY2hhaW4gPiBsb25nZXN0KSB7XG4gICAgICAgICAgICAgICAgICAgIGxvbmdlc3QgPSBjaGFpbjtcbiAgICAgICAgICAgICAgICAgICAgY29udGV4dE5hbWUgPSBgJHtuYW1lfSBbICoqICR7Y2hhaW59XWA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIFtjb250ZXh0TmFtZV07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNvbnRleHQ7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBkdW1wQ29udGV4dEFsbENoaWxkcmVuKGN0eDogUnVsZUNvbnRleHQsIGluZGVudCA9IDApIHtcbiAgICAgICAgY29uc3QgcGFkID0gXCIgXCIucGFkU3RhcnQoaW5kZW50LCBcIlxcdFwiKTtcbiAgICAgICAgY29uc3Qgbm9kZXMgPSB0aGlzLmR1bXBDb250ZXh0KGN0eCk7XG4gICAgICAgIGlmIChub2Rlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBjb25zdCBtYXJrZXIgPSBpbmRlbnQgPT0gMCA/IFwiICMgXCIgOiBcIiAqIFwiO1xuICAgICAgICAgICAgY29uc29sZS5pbmZvKHBhZCArIG1hcmtlciArIG5vZGVzKVxuICAgICAgICB9XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY3R4LmdldENoaWxkQ291bnQoKTsgKytpKSB7XG4gICAgICAgICAgICBsZXQgY2hpbGQgPSBjdHg/LmdldENoaWxkKGkpO1xuICAgICAgICAgICAgaWYgKGNoaWxkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5kdW1wQ29udGV4dEFsbENoaWxkcmVuKGNoaWxkLCArK2luZGVudCk7XG4gICAgICAgICAgICAgICAgLS1pbmRlbnQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXQgcnVsZSBuYW1lIGJ5IHRoZSBJZFxuICAgICAqIEBwYXJhbSBpZCBcbiAgICAgKi9cbiAgICBnZXRSdWxlQnlJZChpZDogbnVtYmVyKTogc3RyaW5nIHwgdW5kZWZpbmVkIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucnVsZVR5cGVNYXAuZ2V0KGlkKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFzTWFya2VyKG1ldGFkYXRhOiBhbnkpIHtcbiAgICAgICAgcmV0dXJuIHsgaW5kZXg6IDEsIGxpbmU6IDEsIGNvbHVtbjogMSB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBkZWNvcmF0ZShub2RlOiBhbnksIG1hcmtlcjogTWFya2VyKTogYW55IHtcbiAgICAgICAgbm9kZS5zdGFydCA9IDA7XG4gICAgICAgIG5vZGUuZW5kID0gMDtcbiAgICAgICAgcmV0dXJuIG5vZGU7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc01ldGFkYXRhKGludGVydmFsOiBJbnRlcnZhbCk6IGFueSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBzdGFydDoge1xuICAgICAgICAgICAgICAgIGxpbmU6IDEsXG4gICAgICAgICAgICAgICAgY29sdW1uOiBpbnRlcnZhbC5zdGFydCxcbiAgICAgICAgICAgICAgICBvZmZzZXQ6IDBcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBlbmQ6IHtcbiAgICAgICAgICAgICAgICBsaW5lOiAxLFxuICAgICAgICAgICAgICAgIGNvbHVtbjogaW50ZXJ2YWwuc3RvcCxcbiAgICAgICAgICAgICAgICBvZmZzZXQ6IDNcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgdGhyb3dUeXBlRXJyb3IodHlwZUlkOiBhbnkpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlVuaGFuZGxlZCB0eXBlIDogXCIgKyB0eXBlSWQgKyBcIiA6IFwiICsgdGhpcy5nZXRSdWxlQnlJZCh0eXBlSWQpKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUaHJvdyBUeXBlRXJyb3Igb25seSB3aGVuIHRoZXJlIGlzIGEgdHlwZSBwcm92aWRlZC4gXG4gICAgICogVGhpcyBpcyB1c2VmdWxsIHdoZW4gdGhlcmUgbm9kZSBpdGEgVGVybWluYWxOb2RlIFxuICAgICAqIEBwYXJhbSB0eXBlIFxuICAgICAqL1xuICAgIHByaXZhdGUgdGhyb3dJbnNhbmNlRXJyb3IodHlwZTogYW55KTogdm9pZCB7XG4gICAgICAgIC8qICAgICAgICAgaWYgKHR5cGUgPT0gdW5kZWZpbmVkIHx8IHR5cGUgPT0gXCJcIikge1xuICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9ICovXG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJVbmhhbmRsZWQgaW5zdGFuY2UgdHlwZSA6IFwiICsgdHlwZSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc3NlcnRUeXBlKGN0eDogUnVsZUNvbnRleHQsIHR5cGU6IGFueSk6IHZvaWQge1xuICAgICAgICBpZiAoIShjdHggaW5zdGFuY2VvZiB0eXBlKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkludmFsaWQgdHlwZSBleHBlY3RlZCA6ICdcIiArIHR5cGUubmFtZSArIFwiJyByZWNlaXZlZCAnXCIgKyB0aGlzLmR1bXBDb250ZXh0KGN0eCkpICsgXCInXCI7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNwcm9ncmFtLlxuICAgIHZpc2l0UHJvZ3JhbShjdHg6IFJ1bGVDb250ZXh0KTogU2NyaXB0IHtcbiAgICAgICAgdGhpcy5sb2coY3R4LCBUcmFjZS5mcmFtZSgpKVxuICAgICAgICB0aGlzLmFzc2VydFR5cGUoY3R4LCBFQ01BU2NyaXB0UGFyc2VyLlByb2dyYW1Db250ZXh0KVxuICAgICAgICAvLyB2aXNpdFByb2dyYW0gLT52aXNpdFNvdXJjZUVsZW1lbnRzIC0+IHZpc2l0U291cmNlRWxlbWVudCAtPiB2aXNpdFN0YXRlbWVudFxuICAgICAgICBjb25zdCBzdGF0ZW1lbnRzID0gW107XG4gICAgICAgIGNvbnN0IG5vZGUgPSBjdHguZ2V0Q2hpbGQoMCk7ICAvLyB2aXNpdFByb2dyYW0gLT52aXNpdFNvdXJjZUVsZW1lbnRzIFxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5vZGUuZ2V0Q2hpbGRDb3VudCgpOyArK2kpIHtcbiAgICAgICAgICAgIGNvbnN0IHN0bSA9IG5vZGUuZ2V0Q2hpbGQoaSkuZ2V0Q2hpbGQoMCk7IC8vIFNvdXJjZUVsZW1lbnRzQ29udGV4dCA+IFN0YXRlbWVudENvbnRleHRcbiAgICAgICAgICAgIGlmIChzdG0gaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLlN0YXRlbWVudENvbnRleHQpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBzdGF0ZW1lbnQgPSB0aGlzLnZpc2l0U3RhdGVtZW50KHN0bSk7XG4gICAgICAgICAgICAgICAgc3RhdGVtZW50cy5wdXNoKHN0YXRlbWVudCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMudGhyb3dJbnNhbmNlRXJyb3IodGhpcy5kdW1wQ29udGV4dChzdG0pKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjb25zdCBpbnRlcnZhbCA9IGN0eC5nZXRTb3VyY2VJbnRlcnZhbCgpO1xuICAgICAgICBjb25zdCBzY3JpcHQgPSBuZXcgU2NyaXB0KHN0YXRlbWVudHMpO1xuICAgICAgICByZXR1cm4gdGhpcy5kZWNvcmF0ZShzY3JpcHQsIHRoaXMuYXNNYXJrZXIodGhpcy5hc01ldGFkYXRhKGludGVydmFsKSkpO1xuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI3N0YXRlbWVudC5cbiAgICAvKipcbiAgICAgKiBzdGF0ZW1lbnRcbiAgICAgKiAgIDogYmxvY2tcbiAgICAgKiAgIHwgdmFyaWFibGVTdGF0ZW1lbnRcbiAgICAgKiAgIHwgaW1wb3J0U3RhdGVtZW50XG4gICAgICogICB8IGV4cG9ydFN0YXRlbWVudFxuICAgICAqICAgfCBlbXB0eVN0YXRlbWVudFxuICAgICAqICAgfCBjbGFzc0RlY2xhcmF0aW9uXG4gICAgICogICB8IGV4cHJlc3Npb25TdGF0ZW1lbnRcbiAgICAgKiAgIHwgaWZTdGF0ZW1lbnRcbiAgICAgKiAgIHwgaXRlcmF0aW9uU3RhdGVtZW50XG4gICAgICogICB8IGNvbnRpbnVlU3RhdGVtZW50XG4gICAgICogICB8IGJyZWFrU3RhdGVtZW50XG4gICAgICogICB8IHJldHVyblN0YXRlbWVudFxuICAgICAqICAgfCB5aWVsZFN0YXRlbWVudFxuICAgICAqICAgfCB3aXRoU3RhdGVtZW50XG4gICAgICogICB8IGxhYmVsbGVkU3RhdGVtZW50XG4gICAgICogICB8IHN3aXRjaFN0YXRlbWVudFxuICAgICAqICAgfCB0aHJvd1N0YXRlbWVudFxuICAgICAqICAgfCB0cnlTdGF0ZW1lbnRcbiAgICAgKiAgIHwgZGVidWdnZXJTdGF0ZW1lbnRcbiAgICAgKiAgIHwgZnVuY3Rpb25EZWNsYXJhdGlvblxuICAgICAqICAgO1xuICAgICAqIEBwYXJhbSBjdHggXG4gICAgICovXG4gICAgdmlzaXRTdGF0ZW1lbnQoY3R4OiBSdWxlQ29udGV4dCk6IGFueSB7XG4gICAgICAgIHRoaXMubG9nKGN0eCwgVHJhY2UuZnJhbWUoKSlcbiAgICAgICAgdGhpcy5hc3NlcnRUeXBlKGN0eCwgRUNNQVNjcmlwdFBhcnNlci5TdGF0ZW1lbnRDb250ZXh0KVxuICAgICAgICBjb25zdCBub2RlOiBSdWxlQ29udGV4dCA9IGN0eC5nZXRDaGlsZCgwKTtcblxuICAgICAgICBpZiAobm9kZSBpbnN0YW5jZW9mIEVDTUFTY3JpcHRQYXJzZXIuQmxvY2tDb250ZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy52aXNpdEJsb2NrKG5vZGUpO1xuICAgICAgICB9IGVsc2UgaWYgKG5vZGUgaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLlZhcmlhYmxlU3RhdGVtZW50Q29udGV4dCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmlzaXRWYXJpYWJsZVN0YXRlbWVudChub2RlKTtcbiAgICAgICAgfSBlbHNlIGlmIChub2RlIGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5JbXBvcnRTdGF0ZW1lbnRDb250ZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy52aXNpdEltcG9ydFN0YXRlbWVudChub2RlKTtcbiAgICAgICAgfSBlbHNlIGlmIChub2RlIGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5FeHBvcnRTdGF0ZW1lbnRDb250ZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy52aXNpdEV4cG9ydFN0YXRlbWVudChub2RlKTtcbiAgICAgICAgfSBlbHNlIGlmIChub2RlIGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5FbXB0eVN0YXRlbWVudENvbnRleHQpIHtcbiAgICAgICAgICAgIC8vIE5PT1AsXG4gICAgICAgIH0gZWxzZSBpZiAobm9kZSBpbnN0YW5jZW9mIEVDTUFTY3JpcHRQYXJzZXIuQ2xhc3NEZWNsYXJhdGlvbkNvbnRleHQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnZpc2l0Q2xhc3NEZWNsYXJhdGlvbihub2RlKTtcbiAgICAgICAgfSBlbHNlIGlmIChub2RlIGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5FeHByZXNzaW9uU3RhdGVtZW50Q29udGV4dCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmlzaXRFeHByZXNzaW9uU3RhdGVtZW50KG5vZGUpO1xuICAgICAgICB9IGVsc2UgaWYgKG5vZGUgaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLklmU3RhdGVtZW50Q29udGV4dCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmlzaXRJZlN0YXRlbWVudChub2RlKTtcbiAgICAgICAgfSBlbHNlIGlmIChub2RlIGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5JdGVyYXRpb25TdGF0ZW1lbnRDb250ZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy52aXNpdEl0ZXJhdGlvblN0YXRlbWVudChub2RlKTtcbiAgICAgICAgfSBlbHNlIGlmIChub2RlIGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5Db250aW51ZVN0YXRlbWVudENvbnRleHQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnZpc2l0Q29udGludWVTdGF0ZW1lbnQobm9kZSk7XG4gICAgICAgIH0gZWxzZSBpZiAobm9kZSBpbnN0YW5jZW9mIEVDTUFTY3JpcHRQYXJzZXIuQnJlYWtTdGF0ZW1lbnRDb250ZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy52aXNpdEJyZWFrU3RhdGVtZW50KG5vZGUpO1xuICAgICAgICB9IGVsc2UgaWYgKG5vZGUgaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLlJldHVyblN0YXRlbWVudENvbnRleHQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnZpc2l0UmV0dXJuU3RhdGVtZW50KG5vZGUpO1xuICAgICAgICB9IGVsc2UgaWYgKG5vZGUgaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLllpZWxkU3RhdGVtZW50Q29udGV4dCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmlzaXRZaWVsZFN0YXRlbWVudChub2RlKTtcbiAgICAgICAgfSBlbHNlIGlmIChub2RlIGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5XaXRoU3RhdGVtZW50Q29udGV4dCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmlzaXRXaXRoU3RhdGVtZW50KG5vZGUpO1xuICAgICAgICB9IGVsc2UgaWYgKG5vZGUgaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLkxhYmVsbGVkU3RhdGVtZW50Q29udGV4dCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmlzaXRMYWJlbGxlZFN0YXRlbWVudChub2RlKTtcbiAgICAgICAgfSBlbHNlIGlmIChub2RlIGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5Td2l0Y2hTdGF0ZW1lbnRDb250ZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy52aXNpdFN3aXRjaFN0YXRlbWVudChub2RlKTtcbiAgICAgICAgfSBlbHNlIGlmIChub2RlIGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5GdW5jdGlvbkV4cHJlc3Npb25Db250ZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy52aXNpdEZ1bmN0aW9uRXhwcmVzc2lvbihub2RlKTtcbiAgICAgICAgfSBlbHNlIGlmIChub2RlIGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5UaHJvd1N0YXRlbWVudENvbnRleHQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnZpc2l0VGhyb3dTdGF0ZW1lbnQobm9kZSk7XG4gICAgICAgIH0gZWxzZSBpZiAobm9kZSBpbnN0YW5jZW9mIEVDTUFTY3JpcHRQYXJzZXIuVHJ5U3RhdGVtZW50Q29udGV4dCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmlzaXRUcnlTdGF0ZW1lbnQobm9kZSk7XG4gICAgICAgIH0gZWxzZSBpZiAobm9kZSBpbnN0YW5jZW9mIEVDTUFTY3JpcHRQYXJzZXIuRGVidWdnZXJTdGF0ZW1lbnRDb250ZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy52aXNpdERlYnVnZ2VyU3RhdGVtZW50KG5vZGUpO1xuICAgICAgICB9IGVsc2UgaWYgKG5vZGUgaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLkZ1bmN0aW9uRGVjbGFyYXRpb25Db250ZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy52aXNpdEZ1bmN0aW9uRGVjbGFyYXRpb24obm9kZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnRocm93SW5zYW5jZUVycm9yKHRoaXMuZHVtcENvbnRleHQobm9kZSkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdmlzaXRJbXBvcnRTdGF0ZW1lbnQoY3R4OiBSdWxlQ29udGV4dCk6IGFueSB7XG4gICAgICAgIHRoaXMubG9nKGN0eCwgVHJhY2UuZnJhbWUoKSlcbiAgICAgICAgdGhpcy5hc3NlcnRUeXBlKGN0eCwgRUNNQVNjcmlwdFBhcnNlci5JbXBvcnRTdGF0ZW1lbnRDb250ZXh0KVxuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwibm90IGltcGxlbWVudGVkXCIpO1xuICAgIH1cblxuICAgIHZpc2l0RXhwb3J0U3RhdGVtZW50KGN0eDogUnVsZUNvbnRleHQpOiBhbnkge1xuICAgICAgICB0aGlzLmxvZyhjdHgsIFRyYWNlLmZyYW1lKCkpXG4gICAgICAgIHRoaXMuYXNzZXJ0VHlwZShjdHgsIEVDTUFTY3JpcHRQYXJzZXIuRXhwb3J0U3RhdGVtZW50Q29udGV4dClcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIm5vdCBpbXBsZW1lbnRlZFwiKTtcbiAgICB9XG5cbiAgICB2aXNpdEl0ZXJhdGlvblN0YXRlbWVudChjdHg6IFJ1bGVDb250ZXh0KTogYW55IHtcbiAgICAgICAgdGhpcy5sb2coY3R4LCBUcmFjZS5mcmFtZSgpKVxuICAgICAgICB0aGlzLmFzc2VydFR5cGUoY3R4LCBFQ01BU2NyaXB0UGFyc2VyLkl0ZXJhdGlvblN0YXRlbWVudENvbnRleHQpXG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJub3QgaW1wbGVtZW50ZWRcIik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjYmxvY2suXG4gICAgICogLy8vIEJsb2NrIDpcbiAgICAgKiAvLy8gICAgIHsgU3RhdGVtZW50TGlzdD8gfVxuICAgICAqL1xuICAgIHZpc2l0QmxvY2soY3R4OiBSdWxlQ29udGV4dCk6IEJsb2NrU3RhdGVtZW50IHtcbiAgICAgICAgdGhpcy5sb2coY3R4LCBUcmFjZS5mcmFtZSgpKVxuICAgICAgICB0aGlzLmFzc2VydFR5cGUoY3R4LCBFQ01BU2NyaXB0UGFyc2VyLkJsb2NrQ29udGV4dClcbiAgICAgICAgY29uc3QgYm9keSA9IFtdO1xuICAgICAgICBmb3IgKGxldCBpID0gMTsgaSA8IGN0eC5nZXRDaGlsZENvdW50KCkgLSAxOyArK2kpIHtcbiAgICAgICAgICAgIGNvbnN0IG5vZGU6IFJ1bGVDb250ZXh0ID0gY3R4LmdldENoaWxkKGkpO1xuICAgICAgICAgICAgaWYgKG5vZGUgaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLlN0YXRlbWVudExpc3RDb250ZXh0KSB7XG4gICAgICAgICAgICAgICAgY29uc3Qgc3RhdGVtZW50TGlzdCA9IHRoaXMudmlzaXRTdGF0ZW1lbnRMaXN0KG5vZGUpO1xuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgaW5kZXggaW4gc3RhdGVtZW50TGlzdCkge1xuICAgICAgICAgICAgICAgICAgICBib2R5LnB1c2goc3RhdGVtZW50TGlzdFtpbmRleF0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy50aHJvd0luc2FuY2VFcnJvcih0aGlzLmR1bXBDb250ZXh0KG5vZGUpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5kZWNvcmF0ZShuZXcgQmxvY2tTdGF0ZW1lbnQoYm9keSksIHRoaXMuYXNNYXJrZXIodGhpcy5hc01ldGFkYXRhKGN0eC5nZXRTb3VyY2VJbnRlcnZhbCgpKSkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI3N0YXRlbWVudExpc3QuXG4gICAgICogIHN0YXRlbWVudExpc3RcbiAgICAgKiAgICA6IHN0YXRlbWVudCtcbiAgICAgKiAgICA7XG4gICAgICogQHBhcmFtIGN0eCBcbiAgICAgKi9cbiAgICB2aXNpdFN0YXRlbWVudExpc3QoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICB0aGlzLmxvZyhjdHgsIFRyYWNlLmZyYW1lKCkpXG4gICAgICAgIHRoaXMuYXNzZXJ0VHlwZShjdHgsIEVDTUFTY3JpcHRQYXJzZXIuU3RhdGVtZW50TGlzdENvbnRleHQpXG4gICAgICAgIGNvbnN0IG5vZGVzID0gdGhpcy5maWx0ZXJTeW1ib2xzKGN0eCk7XG4gICAgICAgIGNvbnN0IGJvZHkgPSBbXTtcbiAgICAgICAgZm9yIChjb25zdCBub2RlIG9mIG5vZGVzKSB7XG4gICAgICAgICAgICBpZiAobm9kZSBpbnN0YW5jZW9mIEVDTUFTY3JpcHRQYXJzZXIuU3RhdGVtZW50Q29udGV4dCkge1xuICAgICAgICAgICAgICAgIGJvZHkucHVzaCh0aGlzLnZpc2l0U3RhdGVtZW50KG5vZGUpKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy50aHJvd1R5cGVFcnJvcih0eXBlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYm9keTtcbiAgICB9XG5cbiAgICB2aXNpdFZhcmlhYmxlU3RhdGVtZW50KGN0eDogUnVsZUNvbnRleHQpOiBWYXJpYWJsZURlY2xhcmF0aW9uIHtcbiAgICAgICAgdGhpcy5sb2coY3R4LCBUcmFjZS5mcmFtZSgpKTtcbiAgICAgICAgdGhpcy5hc3NlcnRUeXBlKGN0eCwgRUNNQVNjcmlwdFBhcnNlci5WYXJpYWJsZVN0YXRlbWVudENvbnRleHQpXG4gICAgICAgIGNvbnN0IG5vZGUgPSB0aGlzLmdldFR5cGVkUnVsZUNvbnRleHQoY3R4LCBFQ01BU2NyaXB0UGFyc2VyLlZhcmlhYmxlRGVjbGFyYXRpb25MaXN0Q29udGV4dCk7XG4gICAgICAgIHJldHVybiB0aGlzLnZpc2l0VmFyaWFibGVEZWNsYXJhdGlvbkxpc3Qobm9kZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0IHRoZSB0eXBlIHJ1bGUgY29udGV4dFxuICAgICAqIEV4YW1wbGVcbiAgICAgKiA8Y29kZT5cbiAgICAgKiAgIGNvbnN0IG5vZGUgPSB0aGlzLmdldFR5cGVkUnVsZUNvbnRleHQoY3R4LCBFQ01BU2NyaXB0UGFyc2VyLlZhcmlhYmxlRGVjbGFyYXRpb25MaXN0Q29udGV4dCk7XG4gICAgICogPC9jb2RlPlxuICAgICAqIEBwYXJhbSBjdHggXG4gICAgICogQHBhcmFtIHR5cGUgXG4gICAgICogQHBhcmFtIGluZGV4IFxuICAgICAqL1xuICAgIHByaXZhdGUgZ2V0VHlwZWRSdWxlQ29udGV4dChjdHg6IFJ1bGVDb250ZXh0LCB0eXBlOiBhbnksIGluZGV4ID0gMCk6IGFueSB7XG4gICAgICAgIHJldHVybiBjdHguZ2V0VHlwZWRSdWxlQ29udGV4dCh0eXBlLCBpbmRleCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogPHByZT5cbiAgICAgKiB2YXJpYWJsZURlY2xhcmF0aW9uTGlzdFxuICAgICAqICAgOiB2YXJNb2RpZmllciB2YXJpYWJsZURlY2xhcmF0aW9uICgnLCcgdmFyaWFibGVEZWNsYXJhdGlvbikqXG4gICAgICogICA7XG4gICAgICogPC9wcmU+XG4gICAgICogQHBhcmFtIGN0eCBcbiAgICAgKi9cbiAgICB2aXNpdFZhcmlhYmxlRGVjbGFyYXRpb25MaXN0KGN0eDogUnVsZUNvbnRleHQpOiBWYXJpYWJsZURlY2xhcmF0aW9uIHtcbiAgICAgICAgdGhpcy5sb2coY3R4LCBUcmFjZS5mcmFtZSgpKTtcbiAgICAgICAgdGhpcy5hc3NlcnRUeXBlKGN0eCwgRUNNQVNjcmlwdFBhcnNlci5WYXJpYWJsZURlY2xhcmF0aW9uTGlzdENvbnRleHQpXG4gICAgICAgIGNvbnN0IHZhck1vZGlmaWVyQ29udGV4dCA9IHRoaXMuZ2V0VHlwZWRSdWxlQ29udGV4dChjdHgsIEVDTUFTY3JpcHRQYXJzZXIuVmFyTW9kaWZpZXJDb250ZXh0LCAwKTtcbiAgICAgICAgY29uc3QgdmFyTW9kaWZpZXIgPSB2YXJNb2RpZmllckNvbnRleHQuZ2V0VGV4dCgpO1xuICAgICAgICBjb25zdCBkZWNsYXJhdGlvbnM6IFZhcmlhYmxlRGVjbGFyYXRvcltdID0gW107XG4gICAgICAgIGZvciAoY29uc3Qgbm9kZSBvZiB0aGlzLmZpbHRlclN5bWJvbHMoY3R4KSkge1xuICAgICAgICAgICAgaWYgKG5vZGUgaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLlZhcmlhYmxlRGVjbGFyYXRpb25Db250ZXh0KSB7XG4gICAgICAgICAgICAgICAgZGVjbGFyYXRpb25zLnB1c2godGhpcy52aXNpdFZhcmlhYmxlRGVjbGFyYXRpb24obm9kZSkpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyBWYXJpYWJsZURlY2xhcmF0aW9uKGRlY2xhcmF0aW9ucywgdmFyTW9kaWZpZXIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciN2YXJpYWJsZURlY2xhcmF0aW9uLlxuICAgICAqICB2YXJpYWJsZURlY2xhcmF0aW9uXG4gICAgICogICAgOiBhc3NpZ25hYmxlICgnPScgc2luZ2xlRXhwcmVzc2lvbik/IC8vIEVDTUFTY3JpcHQgNjogQXJyYXkgJiBPYmplY3QgTWF0Y2hpbmdcbiAgICAgKiAgICA7XG4gICAgICogQHBhcmFtIGN0eCBWYXJpYWJsZURlY2xhcmF0aW9uQ29udGV4dFxuICAgICAqL1xuICAgIC8vIFxuICAgIHZpc2l0VmFyaWFibGVEZWNsYXJhdGlvbihjdHg6IFJ1bGVDb250ZXh0KTogVmFyaWFibGVEZWNsYXJhdG9yIHtcbiAgICAgICAgdGhpcy5sb2coY3R4LCBUcmFjZS5mcmFtZSgpKVxuICAgICAgICB0aGlzLmFzc2VydFR5cGUoY3R4LCBFQ01BU2NyaXB0UGFyc2VyLlZhcmlhYmxlRGVjbGFyYXRpb25Db250ZXh0KVxuICAgICAgICBjb25zdCBhc3NpZ25hYmxlQ29udGV4dCA9IHRoaXMuZ2V0VHlwZWRSdWxlQ29udGV4dChjdHgsIEVDTUFTY3JpcHRQYXJzZXIuQXNzaWduYWJsZUNvbnRleHQsIDApO1xuICAgICAgICBjb25zdCBhc3NpZ25hYmxlID0gdGhpcy52aXNpdEFzc2lnbmFibGUoYXNzaWduYWJsZUNvbnRleHQpO1xuICAgICAgICAvLyBjb25zb2xlLmluZm8oYXNzaWduYWJsZSlcbiAgICAgICAgbGV0IGluaXQgPSBudWxsO1xuICAgICAgICBpZiAoY3R4LmdldENoaWxkQ291bnQoKSA9PSAzKSB7XG4gICAgICAgICAgICBpbml0ID0gdGhpcy5zaW5nbGVFeHByZXNzaW9uKGN0eC5nZXRDaGlsZCgyKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyBWYXJpYWJsZURlY2xhcmF0b3IoYXNzaWduYWJsZSwgaW5pdCk7XG4gICAgfVxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjaW5pdGlhbGlzZXIuXG4gICAgdmlzaXRJbml0aWFsaXNlcihjdHg6IFJ1bGVDb250ZXh0KTogT2JqZWN0RXhwcmVzc2lvbiB8IEFycmF5RXhwcmVzc2lvbiB8IHVuZGVmaW5lZCB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0SW5pdGlhbGlzZXIgWyVzXSA6ICVzXCIsIGN0eC5nZXRDaGlsZENvdW50KCksIGN0eC5nZXRUZXh0KCkpO1xuICAgICAgICB0aGlzLmFzc2VydFR5cGUoY3R4LCBFQ01BU2NyaXB0UGFyc2VyLkluaXRpYWxpc2VyQ29udGV4dClcbiAgICAgICAgdGhpcy5hc3NlcnROb2RlQ291bnQoY3R4LCAyKTtcbiAgICAgICAgY29uc3Qgbm9kZTogUnVsZUNvbnRleHQgPSBjdHguZ2V0Q2hpbGQoMSk7XG5cbiAgICAgICAgaWYgKG5vZGUgaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLk9iamVjdExpdGVyYWxFeHByZXNzaW9uQ29udGV4dCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmlzaXRPYmplY3RMaXRlcmFsRXhwcmVzc2lvbihub2RlKTtcbiAgICAgICAgfSBlbHNlIGlmIChub2RlIGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5BcnJheUxpdGVyYWxFeHByZXNzaW9uQ29udGV4dCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmlzaXRBcnJheUxpdGVyYWxFeHByZXNzaW9uKG5vZGUpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMudGhyb3dJbnNhbmNlRXJyb3IodGhpcy5kdW1wQ29udGV4dChub2RlKSlcbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNlbXB0eVN0YXRlbWVudC5cbiAgICB2aXNpdEVtcHR5U3RhdGVtZW50KGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgdGhpcy5sb2coY3R4LCBUcmFjZS5mcmFtZSgpKVxuICAgIH1cblxuICAgIHByaXZhdGUgYXNzZXJ0Tm9kZUNvdW50KGN0eDogUnVsZUNvbnRleHQsIGNvdW50OiBudW1iZXIpIHtcbiAgICAgICAgaWYgKGN0eC5nZXRDaGlsZENvdW50KCkgIT0gY291bnQpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIldyb25nIGNoaWxkIGNvdW50LCBleHBlY3RlZCAnXCIgKyBjb3VudCArIFwiJyBnb3QgOiBcIiArIGN0eC5nZXRDaGlsZENvdW50KCkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjZXhwcmVzc2lvblN0YXRlbWVudC5cbiAgICAgKiBcbiAgICAgKiBleHByZXNzaW9uU3RhdGVtZW50XG4gICAgICogIDoge3RoaXMubm90T3BlbkJyYWNlQW5kTm90RnVuY3Rpb24oKX0/IGV4cHJlc3Npb25TZXF1ZW5jZSBlb3NcbiAgICAgKiAgO1xuICAgICAqIEBwYXJhbSBjdHggXG4gICAgICovXG4gICAgdmlzaXRFeHByZXNzaW9uU3RhdGVtZW50KGN0eDogUnVsZUNvbnRleHQpOiBFeHByZXNzaW9uU3RhdGVtZW50IHwgdW5kZWZpbmVkIHtcbiAgICAgICAgY29uc29sZS5pbmZvKFwidmlzaXRFeHByZXNzaW9uU3RhdGVtZW50IFslc10gOiAlc1wiLCBjdHguZ2V0Q2hpbGRDb3VudCgpLCBjdHguZ2V0VGV4dCgpKTtcbiAgICAgICAgdGhpcy5hc3NlcnRUeXBlKGN0eCwgRUNNQVNjcmlwdFBhcnNlci5FeHByZXNzaW9uU3RhdGVtZW50Q29udGV4dClcbiAgICAgICAgLy8gdmlzaXRFeHByZXNzaW9uU3RhdGVtZW50Oj52aXNpdEV4cHJlc3Npb25TZXF1ZW5jZVxuICAgICAgICBjb25zdCBub2RlOiBSdWxlQ29udGV4dCA9IGN0eC5nZXRDaGlsZCgwKTsgLy8gdmlzaXRFeHByZXNzaW9uU2VxdWVuY2UgXG4gICAgICAgIGxldCBleHBcbiAgICAgICAgaWYgKG5vZGUgaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLkV4cHJlc3Npb25TZXF1ZW5jZUNvbnRleHQpIHtcbiAgICAgICAgICAgIGV4cCA9IHRoaXMudmlzaXRFeHByZXNzaW9uU2VxdWVuY2Uobm9kZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnRocm93SW5zYW5jZUVycm9yKHRoaXMuZHVtcENvbnRleHQobm9kZSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGV4cCAvL3RoaXMuZGVjb3JhdGUoZXhwLCB0aGlzLmFzTWFya2VyKHRoaXMuYXNNZXRhZGF0YShjdHguZ2V0U291cmNlSW50ZXJ2YWwoKSkpKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIGlmU3RhdGVtZW50XG4gICAgICogICA6IElmICcoJyBleHByZXNzaW9uU2VxdWVuY2UgJyknIHN0YXRlbWVudCAoIEVsc2Ugc3RhdGVtZW50ICk/XG4gICAgICogICA7XG4gICAgICovXG4gICAgdmlzaXRJZlN0YXRlbWVudChjdHg6IFJ1bGVDb250ZXh0KTogSWZTdGF0ZW1lbnQge1xuICAgICAgICB0aGlzLmxvZyhjdHgsIFRyYWNlLmZyYW1lKCkpXG4gICAgICAgIHRoaXMuYXNzZXJ0VHlwZShjdHgsIEVDTUFTY3JpcHRQYXJzZXIuSWZTdGF0ZW1lbnRDb250ZXh0KVxuICAgICAgICBjb25zdCBjb3VudCA9IGN0eC5nZXRDaGlsZENvdW50KCk7XG4gICAgICAgIGNvbnN0IHRlc3QgPSB0aGlzLnZpc2l0RXhwcmVzc2lvblNlcXVlbmNlKGN0eC5nZXRDaGlsZCgyKSk7XG4gICAgICAgIGNvbnN0IGNvbnNlcXVlbnQgPSB0aGlzLnZpc2l0U3RhdGVtZW50KGN0eC5nZXRDaGlsZCg0KSk7XG4gICAgICAgIGNvbnN0IGFsdGVybmF0ZSA9IGNvdW50ID09IDcgPyB0aGlzLnZpc2l0U3RhdGVtZW50KGN0eC5nZXRDaGlsZCg2KSkgOiB1bmRlZmluZWQ7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBJZlN0YXRlbWVudCh0ZXN0LCBjb25zZXF1ZW50LCBhbHRlcm5hdGUpO1xuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI0RvU3RhdGVtZW50LlxuICAgIHZpc2l0RG9TdGF0ZW1lbnQoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJ2aXNpdERvU3RhdGVtZW50OiBcIiArIGN0eC5nZXRUZXh0KCkpO1xuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI1doaWxlU3RhdGVtZW50LlxuICAgIHZpc2l0V2hpbGVTdGF0ZW1lbnQoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJ2aXNpdFdoaWxlU3RhdGVtZW50OiBcIiArIGN0eC5nZXRUZXh0KCkpO1xuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI0ZvclN0YXRlbWVudC5cbiAgICB2aXNpdEZvclN0YXRlbWVudChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0V2hpbGVTdGF0ZW1lbnQ6IFwiICsgY3R4LmdldFRleHQoKSk7XG4gICAgfVxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjRm9yVmFyU3RhdGVtZW50LlxuICAgIHZpc2l0Rm9yVmFyU3RhdGVtZW50KGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNGb3JJblN0YXRlbWVudC5cbiAgICB2aXNpdEZvckluU3RhdGVtZW50KGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNGb3JWYXJJblN0YXRlbWVudC5cbiAgICB2aXNpdEZvclZhckluU3RhdGVtZW50KGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNjb250aW51ZVN0YXRlbWVudC5cbiAgICB2aXNpdENvbnRpbnVlU3RhdGVtZW50KGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcblxuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2JyZWFrU3RhdGVtZW50LlxuICAgIHZpc2l0QnJlYWtTdGF0ZW1lbnQoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuXG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNyZXR1cm5TdGF0ZW1lbnQuXG4gICAgdmlzaXRSZXR1cm5TdGF0ZW1lbnQoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuXG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciN3aXRoU3RhdGVtZW50LlxuICAgIHZpc2l0V2l0aFN0YXRlbWVudChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG5cbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI3N3aXRjaFN0YXRlbWVudC5cbiAgICB2aXNpdFN3aXRjaFN0YXRlbWVudChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG5cbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2Nhc2VCbG9jay5cbiAgICB2aXNpdENhc2VCbG9jayhjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG5cbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2Nhc2VDbGF1c2VzLlxuICAgIHZpc2l0Q2FzZUNsYXVzZXMoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuXG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNjYXNlQ2xhdXNlLlxuICAgIHZpc2l0Q2FzZUNsYXVzZShjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG5cbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2RlZmF1bHRDbGF1c2UuXG4gICAgdmlzaXREZWZhdWx0Q2xhdXNlKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFxuICAgICAqIGxhYmVsbGVkU3RhdGVtZW50XG4gICAgICogICA6IGlkZW50aWZpZXIgJzonIHN0YXRlbWVudFxuICAgICAqICAgOyBcbiAgICAgKi9cbiAgICB2aXNpdExhYmVsbGVkU3RhdGVtZW50KGN0eDogUnVsZUNvbnRleHQpOiBMYWJlbGVkU3RhdGVtZW50IHtcbiAgICAgICAgdGhpcy5sb2coY3R4LCBUcmFjZS5mcmFtZSgpKVxuICAgICAgICB0aGlzLmFzc2VydFR5cGUoY3R4LCBFQ01BU2NyaXB0UGFyc2VyLkxhYmVsbGVkU3RhdGVtZW50Q29udGV4dClcbiAgICAgICAgY29uc3QgaWRlbnRpZmllciA9IHRoaXMudmlzaXRJZGVudGlmaWVyKGN0eC5nZXRDaGlsZCgwKSk7XG4gICAgICAgIGNvbnN0IHN0YXRlbWVudCA9IHRoaXMudmlzaXRTdGF0ZW1lbnQoY3R4LmdldENoaWxkKDIpKTtcbiAgICAgICAgcmV0dXJuIG5ldyBMYWJlbGVkU3RhdGVtZW50KGlkZW50aWZpZXIsIHN0YXRlbWVudCk7XG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciN0aHJvd1N0YXRlbWVudC5cbiAgICB2aXNpdFRocm93U3RhdGVtZW50KGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI3RyeVN0YXRlbWVudC5cbiAgICB2aXNpdFRyeVN0YXRlbWVudChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG5cbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2NhdGNoUHJvZHVjdGlvbi5cbiAgICB2aXNpdENhdGNoUHJvZHVjdGlvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG5cbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2ZpbmFsbHlQcm9kdWN0aW9uLlxuICAgIHZpc2l0RmluYWxseVByb2R1Y3Rpb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuXG4gICAgfVxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjZGVidWdnZXJTdGF0ZW1lbnQuXG4gICAgdmlzaXREZWJ1Z2dlclN0YXRlbWVudChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG5cbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNmdW5jdGlvbkRlY2xhcmF0aW9uLlxuICAgIHZpc2l0RnVuY3Rpb25EZWNsYXJhdGlvbihjdHg6IFJ1bGVDb250ZXh0KTogRnVuY3Rpb25EZWNsYXJhdGlvbiB8IEFzeW5jRnVuY3Rpb25EZWNsYXJhdGlvbiB7XG4gICAgICAgIHRoaXMubG9nKGN0eCwgVHJhY2UuZnJhbWUoKSk7XG4gICAgICAgIHRoaXMuYXNzZXJ0VHlwZShjdHgsIEVDTUFTY3JpcHRQYXJzZXIuRnVuY3Rpb25EZWNsYXJhdGlvbkNvbnRleHQpO1xuICAgICAgICBsZXQgYXN5bmMgPSBmYWxzZTtcbiAgICAgICAgbGV0IGdlbmVyYXRvciA9IGZhbHNlO1xuICAgICAgICBsZXQgaWRlbnRpZmllcjogSWRlbnRpZmllcjtcbiAgICAgICAgbGV0IHBhcmFtcztcbiAgICAgICAgbGV0IGJvZHk7XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjdHguZ2V0Q2hpbGRDb3VudCgpOyArK2kpIHtcbiAgICAgICAgICAgIGNvbnN0IG5vZGUgPSBjdHguZ2V0Q2hpbGQoaSk7XG4gICAgICAgICAgICBpZiAobm9kZS5zeW1ib2wpIHtcbiAgICAgICAgICAgICAgICBjb25zdCB0eHQgPSBub2RlLmdldFRleHQoKTtcbiAgICAgICAgICAgICAgICBpZiAodHh0ID09ICdhc3luYycpIHtcbiAgICAgICAgICAgICAgICAgICAgYXN5bmMgPSB0cnVlXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0eHQgPT0gJyonKSB7XG4gICAgICAgICAgICAgICAgICAgIGdlbmVyYXRvciA9IHRydWVcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChub2RlIGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5JZGVudGlmaWVyQ29udGV4dCkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuaW5mbyhcIkVDTUFTY3JpcHRQYXJzZXIgOzsgSWRlbnRpZmllckNvbnRleHRcIilcbiAgICAgICAgICAgICAgICBpZGVudGlmaWVyID0gdGhpcy52aXNpdElkZW50aWZpZXIobm9kZSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG5vZGUgaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLkZvcm1hbFBhcmFtZXRlckxpc3RDb250ZXh0KSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5pbmZvKFwiRUNNQVNjcmlwdFBhcnNlciA7OyBGb3JtYWxQYXJhbWV0ZXJMaXN0Q29udGV4dFwiKVxuICAgICAgICAgICAgICAgIHBhcmFtcyA9IHRoaXMudmlzaXRGb3JtYWxQYXJhbWV0ZXJMaXN0KG5vZGUpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChub2RlIGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5GdW5jdGlvbkJvZHlDb250ZXh0KSB7XG4gICAgICAgICAgICAgICAgLy8gYm9keSA9IHRoaXMudmlzaXRGdW5jdGlvbkJvZHkobm9kZSk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5pbmZvKFwiRUNNQVNjcmlwdFBhcnNlciA7OyBGb3JtYWxQYXJhbWV0ZXJMaXN0Q29udGV4dFwiKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLmR1bXBDb250ZXh0QWxsQ2hpbGRyZW4obm9kZSlcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnNvbGUuaW5mbygnYXN5bmMgID0gJyArIGFzeW5jKTtcbiAgICAgICAgY29uc29sZS5pbmZvKCdnZW5lcmF0b3IgID0gJyArIGdlbmVyYXRvcik7XG5cbiAgICAgICAgaWYgKGFzeW5jKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IEFzeW5jRnVuY3Rpb25EZWNsYXJhdGlvbihpZGVudGlmaWVyLCBwYXJhbXMsIGJvZHksIGdlbmVyYXRvcik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyAgY29uc3RydWN0b3IoaWQ6IElkZW50aWZpZXIgfCBudWxsLCBwYXJhbXM6IEZ1bmN0aW9uUGFyYW1ldGVyW10sIGJvZHk6IEJsb2NrU3RhdGVtZW50LCBnZW5lcmF0b3I6IGJvb2xlYW4pIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgRnVuY3Rpb25EZWNsYXJhdGlvbihpZGVudGlmaWVyLCBwYXJtYXMsIGJvZHksIGdlbmVyYXRvcik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNmdW5jdGlvbkRlY2xcbiAgICB2aXNpdEZ1bmN0aW9uRGVjbChjdHg6IFJ1bGVDb250ZXh0KTogRnVuY3Rpb25EZWNsYXJhdGlvbiB7XG4gICAgICAgIHRoaXMubG9nKGN0eCwgVHJhY2UuZnJhbWUoKSk7XG4gICAgICAgIHRoaXMuYXNzZXJ0VHlwZShjdHgsIEVDTUFTY3JpcHRQYXJzZXIuRnVuY3Rpb25EZWNsQ29udGV4dCk7XG4gICAgICAgIHJldHVybiB0aGlzLnZpc2l0RnVuY3Rpb25EZWNsYXJhdGlvbihjdHguZ2V0Q2hpbGQoMCkpXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjZnVuY3Rpb25Cb2R5LlxuICAgICAqIFxuICAgICAqIGZ1bmN0aW9uQm9keVxuICAgICAqICA6IHNvdXJjZUVsZW1lbnRzP1xuICAgICAqICA7XG4gICAgICogQHBhcmFtIGN0eCBcbiAgICAgKi9cbiAgICB2aXNpdEZ1bmN0aW9uQm9keShjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIHRoaXMubG9nKGN0eCwgVHJhY2UuZnJhbWUoKSk7XG4gICAgICAgIHRoaXMuYXNzZXJ0VHlwZShjdHgsIEVDTUFTY3JpcHRQYXJzZXIuRnVuY3Rpb25Cb2R5Q29udGV4dClcbiAgICAgICAgY29uc3Qgc291cmNlRWxlbWVudHNDb250ZXh0ID0gdGhpcy5nZXRUeXBlZFJ1bGVDb250ZXh0KGN0eCwgRUNNQVNjcmlwdFBhcnNlci5Tb3VyY2VFbGVtZW50c0NvbnRleHQpO1xuICAgICAgICBpZiAoc291cmNlRWxlbWVudHNDb250ZXh0ICE9IG51bGwpIHtcbiAgICAgICAgICAgIGNvbnN0IHN0YXRlbWVudCA9IHRoaXMudmlzaXRTb3VyY2VFbGVtZW50cyhzb3VyY2VFbGVtZW50c0NvbnRleHQpO1xuICAgICAgICAgICAgcmV0dXJuIHN0YXRlbWVudDtcbiAgICAgICAgfVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJub3QgaW1wbGVtZW50ZWRcIilcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAgc291cmNlRWxlbWVudHNcbiAgICAgKiAgICA6IHNvdXJjZUVsZW1lbnQrXG4gICAgICogICAgO1xuICAgICAqIEBwYXJhbSBjdHggXG4gICAgICovXG4gICAgdmlzaXRTb3VyY2VFbGVtZW50cyhjdHg6IFJ1bGVDb250ZXh0KTogYW55W10ge1xuICAgICAgICB0aGlzLmxvZyhjdHgsIFRyYWNlLmZyYW1lKCkpO1xuICAgICAgICB0aGlzLmFzc2VydFR5cGUoY3R4LCBFQ01BU2NyaXB0UGFyc2VyLlNvdXJjZUVsZW1lbnRzQ29udGV4dClcbiAgICAgICAgY29uc3Qgc3RhdGVtZW50cyA9IFtdXG4gICAgICAgIGZvciAoY29uc3Qgbm9kZSBvZiBjdHguc291cmNlRWxlbWVudCgpKSB7XG4gICAgICAgICAgICBjb25zdCBzdGF0ZW1lbnQgPSB0aGlzLnZpc2l0U3RhdGVtZW50KG5vZGUuc3RhdGVtZW50KCkpXG4gICAgICAgICAgICBjb25zb2xlLmluZm8oc3RhdGVtZW50KVxuICAgICAgICAgICAgc3RhdGVtZW50cy5wdXNoKHN0YXRlbWVudCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHN0YXRlbWVudHM7XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNhcnJheUxpdGVyYWwuXG4gICAgICogYXJyYXlMaXRlcmFsXG4gICAgICogIDogKCdbJyBlbGVtZW50TGlzdCAnXScpXG4gICAgICogIDtcbiAgICAgKiBAcGFyYW0gY3R4IFxuICAgICAqL1xuICAgIHZpc2l0QXJyYXlMaXRlcmFsKGN0eDogUnVsZUNvbnRleHQpOiBBcnJheUV4cHJlc3Npb24ge1xuICAgICAgICB0aGlzLmxvZyhjdHgsIFRyYWNlLmZyYW1lKCkpO1xuICAgICAgICB0aGlzLmFzc2VydFR5cGUoY3R4LCBFQ01BU2NyaXB0UGFyc2VyLkFycmF5TGl0ZXJhbENvbnRleHQpXG4gICAgICAgIGNvbnN0IGVsZW1lbnRMaXN0Q29udGV4dCA9IHRoaXMuZ2V0VHlwZWRSdWxlQ29udGV4dChjdHgsIEVDTUFTY3JpcHRQYXJzZXIuRWxlbWVudExpc3RDb250ZXh0KVxuICAgICAgICBjb25zdCBlbGVtZW50czogQXJyYXlFeHByZXNzaW9uRWxlbWVudFtdID0gdGhpcy52aXNpdEVsZW1lbnRMaXN0KGVsZW1lbnRMaXN0Q29udGV4dCk7XG4gICAgICAgIFxuICAgICAgICByZXR1cm4gbmV3IEFycmF5RXhwcmVzc2lvbihlbGVtZW50cylcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNlbGVtZW50TGlzdC5cbiAgICAgKiBcbiAgICAgKiBlbGVtZW50TGlzdFxuICAgICAqICA6ICcsJyogYXJyYXlFbGVtZW50PyAoJywnKyBhcnJheUVsZW1lbnQpKiAnLCcqIC8vIFllcywgZXZlcnl0aGluZyBpcyBvcHRpb25hbFxuICAgICAqICA7XG4gICAgICogQHBhcmFtIGN0eCBcbiAgICAgKi9cbiAgICB2aXNpdEVsZW1lbnRMaXN0KGN0eDogUnVsZUNvbnRleHQpOiBBcnJheUV4cHJlc3Npb25FbGVtZW50W10ge1xuICAgICAgICB0aGlzLmxvZyhjdHgsIFRyYWNlLmZyYW1lKCkpO1xuICAgICAgICB0aGlzLmFzc2VydFR5cGUoY3R4LCBFQ01BU2NyaXB0UGFyc2VyLkVsZW1lbnRMaXN0Q29udGV4dClcbiAgICAgICAgY29uc3QgZWxlbWVudHM6IEFycmF5RXhwcmVzc2lvbkVsZW1lbnRbXSA9IFtdO1xuICAgICAgICBmb3IgKGNvbnN0IG5vZGUgb2YgdGhpcy5pdGVyYWJsZShjdHgpKSB7XG4gICAgICAgICAgICAvL2VsbGlzb24gY2hlY2tcbiAgICAgICAgICAgIGlmIChub2RlLnN5bWJvbCAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgLy8gY29tcGxpYW5jZTogZXNwcmltYSBjb21wbGlhbmUgb2YgcmV0dXJuaW5nIGBudWxsYCBcbiAgICAgICAgICAgICAgICBlbGVtZW50cy5wdXNoKG51bGwpXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGVsZW1lbnRzLnB1c2godGhpcy52aXNpdEFycmF5RWxlbWVudChub2RlKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGVsZW1lbnRzO1xuICAgIH1cblxuICAgIHByaXZhdGUgaXRlcmFibGUoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zdCBub2RlcyA9IFtdO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGN0eC5nZXRDaGlsZENvdW50KCk7ICsraSkge1xuICAgICAgICAgICAgbm9kZXMucHVzaChjdHguZ2V0Q2hpbGQoaSkpXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5vZGVzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2FycmF5RWxlbWVudC5cbiAgICAgKiBcbiAgICAgKiBhcnJheUVsZW1lbnRcbiAgICAgKiAgOiBFbGxpcHNpcz8gc2luZ2xlRXhwcmVzc2lvblxuICAgICAqICA7XG4gICAgICogQHBhcmFtIGN0eCBcbiAgICAgKi9cbiAgICB2aXNpdEFycmF5RWxlbWVudChjdHg6IFJ1bGVDb250ZXh0KTogQXJyYXlFeHByZXNzaW9uRWxlbWVudCB7XG4gICAgICAgIHRoaXMubG9nKGN0eCwgVHJhY2UuZnJhbWUoKSk7XG4gICAgICAgIHRoaXMuYXNzZXJ0VHlwZShjdHgsIEVDTUFTY3JpcHRQYXJzZXIuQXJyYXlFbGVtZW50Q29udGV4dClcblxuICAgICAgICBpZiAoY3R4LmdldENoaWxkQ291bnQoKSA9PSAxKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zaW5nbGVFeHByZXNzaW9uKGN0eC5nZXRDaGlsZCgwKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCBleHByZXNzaW9uID0gdGhpcy5zaW5nbGVFeHByZXNzaW9uKGN0eC5nZXRDaGlsZCgxKSk7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFNwcmVhZEVsZW1lbnQoZXhwcmVzc2lvbik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNvYmplY3RMaXRlcmFsLlxuICAgICAqIG9iamVjdExpdGVyYWxcbiAgICAgKiAgOiAneycgKHByb3BlcnR5QXNzaWdubWVudCAoJywnIHByb3BlcnR5QXNzaWdubWVudCkqKT8gJywnPyAnfSdcbiAgICAgKiAgO1xuICAgICAqIEBwYXJhbSBjdHggXG4gICAgICovXG4gICAgdmlzaXRPYmplY3RMaXRlcmFsKGN0eDogUnVsZUNvbnRleHQpOiBPYmplY3RFeHByZXNzaW9uIHtcbiAgICAgICAgdGhpcy5sb2coY3R4LCBUcmFjZS5mcmFtZSgpKVxuICAgICAgICB0aGlzLmFzc2VydFR5cGUoY3R4LCBFQ01BU2NyaXB0UGFyc2VyLk9iamVjdExpdGVyYWxDb250ZXh0KTtcbiAgICAgICAgaWYgKGN0eC5nZXRDaGlsZENvdW50KCkgPT0gMikge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBPYmplY3RFeHByZXNzaW9uKFtdKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IG5vZGVzID0gdGhpcy5maWx0ZXJTeW1ib2xzKGN0eCk7XG4gICAgICAgIGNvbnN0IHByb3BlcnRpZXM6IE9iamVjdEV4cHJlc3Npb25Qcm9wZXJ0eVtdID0gW107XG4gICAgICAgIGZvciAoY29uc3Qgbm9kZSBvZiBub2Rlcykge1xuICAgICAgICAgICAgbGV0IHByb3BlcnR5OiBPYmplY3RFeHByZXNzaW9uUHJvcGVydHk7XG4gICAgICAgICAgICBpZiAobm9kZSBpbnN0YW5jZW9mIEVDTUFTY3JpcHRQYXJzZXIuUHJvcGVydHlFeHByZXNzaW9uQXNzaWdubWVudENvbnRleHQpIHtcbiAgICAgICAgICAgICAgICBwcm9wZXJ0eSA9IHRoaXMudmlzaXRQcm9wZXJ0eUV4cHJlc3Npb25Bc3NpZ25tZW50KG5vZGUpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChub2RlIGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5Qcm9wZXJ0eVNob3J0aGFuZENvbnRleHQpIHtcbiAgICAgICAgICAgICAgICBwcm9wZXJ0eSA9IHRoaXMudmlzaXRQcm9wZXJ0eVNob3J0aGFuZChub2RlKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAobm9kZSBpbnN0YW5jZW9mIEVDTUFTY3JpcHRQYXJzZXIuRnVuY3Rpb25Qcm9wZXJ0eUNvbnRleHQpIHtcbiAgICAgICAgICAgICAgICBwcm9wZXJ0eSA9IHRoaXMudmlzaXRGdW5jdGlvblByb3BlcnR5KG5vZGUpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnRocm93SW5zYW5jZUVycm9yKHRoaXMuZHVtcENvbnRleHQobm9kZSkpXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChwcm9wZXJ0eSAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2gocHJvcGVydHkpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyBPYmplY3RFeHByZXNzaW9uKHByb3BlcnRpZXMpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI3Byb3BlcnR5U2hvcnRoYW5kLlxuICAgICAqICB8IEVsbGlwc2lzPyBzaW5nbGVFeHByZXNzaW9uICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICMgUHJvcGVydHlTaG9ydGhhbmRcbiAgICAgKiBAcGFyYW0gY3R4IFxuICAgICAqL1xuICAgIHZpc2l0UHJvcGVydHlTaG9ydGhhbmQoY3R4OiBSdWxlQ29udGV4dCk6IE9iamVjdEV4cHJlc3Npb25Qcm9wZXJ0eSB7XG4gICAgICAgIHRoaXMubG9nKGN0eCwgVHJhY2UuZnJhbWUoKSk7XG4gICAgICAgIHRoaXMuYXNzZXJ0VHlwZShjdHgsIEVDTUFTY3JpcHRQYXJzZXIuUHJvcGVydHlTaG9ydGhhbmRDb250ZXh0KVxuICAgICAgICBjb25zdCBjb21wdXRlZCA9IGZhbHNlO1xuICAgICAgICBjb25zdCBtZXRob2QgPSBmYWxzZTtcbiAgICAgICAgY29uc3Qgc2hvcnRoYW5kID0gdHJ1ZTtcbiAgICAgICAgY29uc3QgdmFsdWUgPSB0aGlzLnNpbmdsZUV4cHJlc3Npb24oY3R4LmdldENoaWxkKDApKTtcbiAgICAgICAgY29uc3Qga2V5OiBQcm9wZXJ0eUtleSA9IG5ldyBJZGVudGlmaWVyKGN0eC5nZXRUZXh0KCkpXG4gICAgICAgIHJldHVybiBuZXcgUHJvcGVydHkoXCJpbml0XCIsIGtleSwgY29tcHV0ZWQsIHZhbHVlLCBtZXRob2QsIHNob3J0aGFuZCk7XG4gICAgfVxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjcHJvcGVydHlTaG9ydGhhbmQuXG4gICAgdmlzaXRGdW5jdGlvblByb3BlcnR5KGN0eDogUnVsZUNvbnRleHQpOiBPYmplY3RFeHByZXNzaW9uUHJvcGVydHkge1xuICAgICAgICB0aGlzLmxvZyhjdHgsIFRyYWNlLmZyYW1lKCkpO1xuICAgICAgICB0aGlzLmFzc2VydFR5cGUoY3R4LCBFQ01BU2NyaXB0UGFyc2VyLkZ1bmN0aW9uUHJvcGVydHlDb250ZXh0KVxuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwibm90IGltcGxlbWVudGVkXCIpXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRmlsdGVyIG91dCBUZXJtaW5hbE5vZGVzIChjb21tYXMsIHBpcGVzLCBicmFja2V0cylcbiAgICAgKiBAcGFyYW0gY3R4IFxuICAgICAqL1xuICAgIHByaXZhdGUgZmlsdGVyU3ltYm9scyhjdHg6IFJ1bGVDb250ZXh0KTogUnVsZUNvbnRleHRbXSB7XG4gICAgICAgIGNvbnN0IGZpbHRlcmVkOiBSdWxlQ29udGV4dFtdID0gW107XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY3R4LmdldENoaWxkQ291bnQoKTsgKytpKSB7XG4gICAgICAgICAgICBjb25zdCBub2RlID0gY3R4LmdldENoaWxkKGkpO1xuICAgICAgICAgICAgLy8gdGhlcmUgbWlnaHQgYmUgYSBiZXR0ZXIgd2F5XG4gICAgICAgICAgICBpZiAobm9kZS5zeW1ib2wgIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmaWx0ZXJlZC5wdXNoKG5vZGUpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmaWx0ZXJlZDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNQcm9wZXJ0eUV4cHJlc3Npb25Bc3NpZ25tZW50LlxuICAgICAqIHByb3BlcnR5QXNzaWdubWVudFxuICAgICAqICAgICA6IHByb3BlcnR5TmFtZSAnOicgc2luZ2xlRXhwcmVzc2lvbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICMgUHJvcGVydHlFeHByZXNzaW9uQXNzaWdubWVudFxuICAgICAqICAgICB8ICdbJyBzaW5nbGVFeHByZXNzaW9uICddJyAnOicgc2luZ2xlRXhwcmVzc2lvbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICMgQ29tcHV0ZWRQcm9wZXJ0eUV4cHJlc3Npb25Bc3NpZ25tZW50XG4gICAgICogICAgIHwgQXN5bmM/ICcqJz8gcHJvcGVydHlOYW1lICcoJyBmb3JtYWxQYXJhbWV0ZXJMaXN0PyAgJyknICAneycgZnVuY3Rpb25Cb2R5ICd9JyAgIyBGdW5jdGlvblByb3BlcnR5XG4gICAgICogICAgIHwgZ2V0dGVyICcoJyAnKScgJ3snIGZ1bmN0aW9uQm9keSAnfScgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIyBQcm9wZXJ0eUdldHRlclxuICAgICAqICAgICB8IHNldHRlciAnKCcgZm9ybWFsUGFyYW1ldGVyQXJnICcpJyAneycgZnVuY3Rpb25Cb2R5ICd9JyAgICAgICAgICAgICAgICAgICAgICAgICMgUHJvcGVydHlTZXR0ZXJcbiAgICAgKiAgICAgfCBFbGxpcHNpcz8gc2luZ2xlRXhwcmVzc2lvbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAjIFByb3BlcnR5U2hvcnRoYW5kXG4gICAgICogICAgIDtcbiAgICAgKi9cbiAgICB2aXNpdFByb3BlcnR5RXhwcmVzc2lvbkFzc2lnbm1lbnQoY3R4OiBSdWxlQ29udGV4dCk6IE9iamVjdEV4cHJlc3Npb25Qcm9wZXJ0eSB7XG4gICAgICAgIHRoaXMubG9nKGN0eCwgVHJhY2UuZnJhbWUoKSk7XG4gICAgICAgIHRoaXMuYXNzZXJ0VHlwZShjdHgsIEVDTUFTY3JpcHRQYXJzZXIuUHJvcGVydHlFeHByZXNzaW9uQXNzaWdubWVudENvbnRleHQpO1xuXG4gICAgICAgIGxldCBub2RlID0gY3R4LmdldENoaWxkKDApO1xuXG4gICAgICAgIHRoaXMuZHVtcENvbnRleHRBbGxDaGlsZHJlbihjdHgpXG4gICAgICAgIGxldCBuMCA9IGN0eC5nZXRDaGlsZCgwKTsgLy8gUHJvcGVydHlOYW1lXG4gICAgICAgIGxldCBuMSA9IGN0eC5nZXRDaGlsZCgxKTsgLy8gc3ltYm9sIDpcbiAgICAgICAgbGV0IG4yID0gY3R4LmdldENoaWxkKDIpOyAvLyAgc2luZ2xlRXhwcmVzc2lvbiBcbiAgICAgICAgbGV0IGtleTogUHJvcGVydHlLZXkgPSB0aGlzLnZpc2l0UHJvcGVydHlOYW1lKG4wKTtcbiAgICAgICAgbGV0IHZhbHVlO1xuICAgICAgICBjb25zdCBjb21wdXRlZCA9IGZhbHNlO1xuICAgICAgICBjb25zdCBtZXRob2QgPSBmYWxzZTtcbiAgICAgICAgY29uc3Qgc2hvcnRoYW5kID0gZmFsc2U7XG5cbiAgICAgICAgaWYgKG4yIGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5Qcm9wZXJ0eUV4cHJlc3Npb25Bc3NpZ25tZW50Q29udGV4dCkge1xuICAgICAgICAgICAgY29uc29sZS5pbmZvKCcgLS0gUHJvcGVydHlFeHByZXNzaW9uQXNzaWdubWVudENvbnRleHQnKVxuICAgICAgICAgICAga2V5ID0gdGhpcy52aXNpdFByb3BlcnR5TmFtZShuMCk7XG4gICAgICAgIH0gZWxzZSBpZiAobjIgaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLkNvbXB1dGVkUHJvcGVydHlFeHByZXNzaW9uQXNzaWdubWVudENvbnRleHQpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuaW5mbygnIC0tIENvbXB1dGVkUHJvcGVydHlFeHByZXNzaW9uQXNzaWdubWVudENvbnRleHQnKVxuICAgICAgICB9IGVsc2UgaWYgKG4yIGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5GdW5jdGlvblByb3BlcnR5Q29udGV4dCkge1xuICAgICAgICAgICAgY29uc29sZS5pbmZvKCcgLS0gRnVuY3Rpb25Qcm9wZXJ0eUNvbnRleHQnKVxuICAgICAgICB9IGVsc2UgaWYgKG4yIGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5Qcm9wZXJ0eUdldHRlckNvbnRleHQpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuaW5mbygnIC0tIFByb3BlcnR5R2V0dGVyQ29udGV4dCcpXG4gICAgICAgIH0gZWxzZSBpZiAobjIgaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLlByb3BlcnR5U2V0dGVyQ29udGV4dCkge1xuICAgICAgICAgICAgY29uc29sZS5pbmZvKCcgLS0gUHJvcGVydHlTZXR0ZXJDb250ZXh0JylcbiAgICAgICAgfSBlbHNlIGlmIChuMiBpbnN0YW5jZW9mIEVDTUFTY3JpcHRQYXJzZXIuUHJvcGVydHlTaG9ydGhhbmRDb250ZXh0KSB7XG4gICAgICAgICAgICBjb25zb2xlLmluZm8oJyAtLSBQcm9wZXJ0eVNob3J0aGFuZENvbnRleHQnKVxuICAgICAgICB9XG4gICAgICAgIC8vIHRoaXMuc2luZ2xlRXhwcmVzc2lvbihuMik7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBQcm9wZXJ0eShcImluaXRcIiwga2V5LCBjb21wdXRlZCwgdmFsdWUsIG1ldGhvZCwgc2hvcnRoYW5kKTtcbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNQcm9wZXJ0eUdldHRlci5cbiAgICB2aXNpdFByb3BlcnR5R2V0dGVyKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcblxuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjUHJvcGVydHlTZXR0ZXIuXG4gICAgdmlzaXRQcm9wZXJ0eVNldHRlcihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNwcm9wZXJ0eU5hbWUuXG4gICAgICogXG4gICAgICogcHJvcGVydHlOYW1lXG4gICAgICogIDogaWRlbnRpZmllck5hbWVcbiAgICAgKiAgfCBTdHJpbmdMaXRlcmFsXG4gICAgICogIHwgbnVtZXJpY0xpdGVyYWxcbiAgICAgKiAgfCAnWycgc2luZ2xlRXhwcmVzc2lvbiAnXSdcbiAgICAgKiAgO1xuICAgICAqL1xuICAgIHZpc2l0UHJvcGVydHlOYW1lKGN0eDogUnVsZUNvbnRleHQpOiBQcm9wZXJ0eUtleSB7XG4gICAgICAgIHRoaXMubG9nKGN0eCwgVHJhY2UuZnJhbWUoKSlcbiAgICAgICAgdGhpcy5hc3NlcnRUeXBlKGN0eCwgRUNNQVNjcmlwdFBhcnNlci5Qcm9wZXJ0eU5hbWVDb250ZXh0KTtcbiAgICAgICAgdGhpcy5hc3NlcnROb2RlQ291bnQoY3R4LCAxKTtcbiAgICAgICAgY29uc3Qgbm9kZSA9IGN0eC5nZXRDaGlsZCgwKTtcbiAgICAgICAgY29uc3QgY291bnQgPSBub2RlLmdldENoaWxkQ291bnQoKTtcblxuICAgICAgICBpZiAoY291bnQgPT0gMCkgeyAvLyBsaXRlcmFsXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jcmVhdGVMaXRlcmFsVmFsdWUobm9kZSk7XG4gICAgICAgIH0gZWxzZSBpZiAoY291bnQgPT0gMSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmlzaXRJZGVudGlmaWVyTmFtZShub2RlKVxuICAgICAgICB9XG4gICAgICAgIHRoaXMudGhyb3dJbnNhbmNlRXJyb3IodGhpcy5kdW1wQ29udGV4dChub2RlKSk7XG4gICAgfVxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjcHJvcGVydHlTZXRQYXJhbWV0ZXJMaXN0LlxuICAgIHZpc2l0UHJvcGVydHlTZXRQYXJhbWV0ZXJMaXN0KGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcblxuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2FyZ3VtZW50cy5cbiAgICB2aXNpdEFyZ3VtZW50cyhjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0QXJndW1lbnRzOiBcIiArIGN0eC5nZXRUZXh0KCkpO1xuXG4gICAgfVxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjYXJndW1lbnRMaXN0LlxuICAgIHZpc2l0QXJndW1lbnRMaXN0KGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS5pbmZvKFwidmlzaXRBcmd1bWVudExpc3Q6IFwiICsgY3R4LmdldFRleHQoKSk7XG4gICAgfVxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjZXhwcmVzc2lvblNlcXVlbmNlLlxuICAgIHZpc2l0RXhwcmVzc2lvblNlcXVlbmNlKGN0eDogUnVsZUNvbnRleHQpOiBFeHByZXNzaW9uU3RhdGVtZW50IHwgU2VxdWVuY2VFeHByZXNzaW9uIHtcbiAgICAgICAgdGhpcy5sb2coY3R4LCBUcmFjZS5mcmFtZSgpKVxuICAgICAgICB0aGlzLmFzc2VydFR5cGUoY3R4LCBFQ01BU2NyaXB0UGFyc2VyLkV4cHJlc3Npb25TZXF1ZW5jZUNvbnRleHQpO1xuICAgICAgICBjb25zdCBleHByZXNzaW9ucyA9IFtdO1xuICAgICAgICAvLyBlYWNoIG5vZGUgaXMgYSBzaW5nbGVFeHByZXNzaW9uXG4gICAgICAgIGZvciAoY29uc3Qgbm9kZSBvZiB0aGlzLmZpbHRlclN5bWJvbHMoY3R4KSkge1xuICAgICAgICAgICAgLy8gY29uc3Qgbm9kZTogUnVsZUNvbnRleHQgPSBjdHguZ2V0Q2hpbGQoaSk7XG4gICAgICAgICAgICBjb25zdCBleHAgPSB0aGlzLnNpbmdsZUV4cHJlc3Npb24obm9kZSk7XG4gICAgICAgICAgICBleHByZXNzaW9ucy5wdXNoKGV4cCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBjb21wbGlhbmNlOiBlc3Bpcm1hLCBlc3ByZWVcbiAgICAgICAgLy8gdGhpcyBjaGVjayB0byBzZWUgaWYgdGhlcmUgYXJlIG11bHRpcGxlIGV4cHJlc3Npb25zIGlmIHNvIHRoZW4gd2UgbGVhdmUgdGhlbSBhcyBTZXF1ZW5jZUV4cHJlc3Npb24gXG4gICAgICAgIC8vIG90aGVyd2lzZSB3ZSB3aWxsIHJvbGwgdGhlbSB1cCBpbnRvIEV4cHJlc3Npb25TdGF0ZW1lbnQgd2l0aCBvbmUgZXhwcmVzc2lvblxuICAgICAgICAvLyBgMWAgPSBFeHByZXNzaW9uU3RhdGVtZW50IC0+IExpdGVyYWxcbiAgICAgICAgLy8gYDEsIDJgID0gRXhwcmVzc2lvblN0YXRlbWVudCAtPiBTZXF1ZW5jZUV4cHJlc3Npb24gLT4gTGl0ZXJhbCwgTGl0ZXJhbFxuICAgICAgICBsZXQgZXhwO1xuICAgICAgICBpZiAoZXhwcmVzc2lvbnMubGVuZ3RoID09IDEpIHtcbiAgICAgICAgICAgIGV4cCA9IG5ldyBFeHByZXNzaW9uU3RhdGVtZW50KGV4cHJlc3Npb25zWzBdKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZXhwID0gbmV3IFNlcXVlbmNlRXhwcmVzc2lvbihleHByZXNzaW9ucyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuZGVjb3JhdGUoZXhwLCB0aGlzLmFzTWFya2VyKHRoaXMuYXNNZXRhZGF0YShjdHguZ2V0U291cmNlSW50ZXJ2YWwoKSkpKVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEV2YWx1YXRlIGEgc2luZ2xlRXhwcmVzc2lvblxuICAgICAqIEBwYXJhbSBub2RlIFxuICAgICAqL1xuICAgIHNpbmdsZUV4cHJlc3Npb24obm9kZTogUnVsZUNvbnRleHQpOiBhbnkge1xuICAgICAgICBpZiAobm9kZSBpbnN0YW5jZW9mIEVDTUFTY3JpcHRQYXJzZXIuTGl0ZXJhbEV4cHJlc3Npb25Db250ZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy52aXNpdExpdGVyYWxFeHByZXNzaW9uKG5vZGUpO1xuICAgICAgICB9IGVsc2UgaWYgKG5vZGUgaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLk9iamVjdExpdGVyYWxFeHByZXNzaW9uQ29udGV4dCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmlzaXRPYmplY3RMaXRlcmFsRXhwcmVzc2lvbihub2RlKTtcbiAgICAgICAgfSBlbHNlIGlmIChub2RlIGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5Bc3NpZ25tZW50RXhwcmVzc2lvbkNvbnRleHQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnZpc2l0QXNzaWdubWVudEV4cHJlc3Npb24obm9kZSk7XG4gICAgICAgIH0gZWxzZSBpZiAobm9kZSBpbnN0YW5jZW9mIEVDTUFTY3JpcHRQYXJzZXIuQWRkaXRpdmVFeHByZXNzaW9uQ29udGV4dCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmlzaXRBZGRpdGl2ZUV4cHJlc3Npb24obm9kZSk7XG4gICAgICAgIH0gZWxzZSBpZiAobm9kZSBpbnN0YW5jZW9mIEVDTUFTY3JpcHRQYXJzZXIuTXVsdGlwbGljYXRpdmVFeHByZXNzaW9uQ29udGV4dCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmlzaXRNdWx0aXBsaWNhdGl2ZUV4cHJlc3Npb24obm9kZSk7XG4gICAgICAgIH0gZWxzZSBpZiAobm9kZSBpbnN0YW5jZW9mIEVDTUFTY3JpcHRQYXJzZXIuQXJyYXlMaXRlcmFsRXhwcmVzc2lvbkNvbnRleHQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnZpc2l0QXJyYXlMaXRlcmFsRXhwcmVzc2lvbihub2RlKTtcbiAgICAgICAgfSBlbHNlIGlmIChub2RlIGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5FcXVhbGl0eUV4cHJlc3Npb25Db250ZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy52aXNpdEVxdWFsaXR5RXhwcmVzc2lvbihub2RlKTtcbiAgICAgICAgfSBlbHNlIGlmIChub2RlIGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5QYXJlbnRoZXNpemVkRXhwcmVzc2lvbkNvbnRleHQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnZpc2l0UGFyZW50aGVzaXplZEV4cHJlc3Npb24obm9kZSk7XG4gICAgICAgIH0gZWxzZSBpZiAobm9kZSBpbnN0YW5jZW9mIEVDTUFTY3JpcHRQYXJzZXIuUmVsYXRpb25hbEV4cHJlc3Npb25Db250ZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy52aXNpdFJlbGF0aW9uYWxFeHByZXNzaW9uKG5vZGUpO1xuICAgICAgICB9IGVsc2UgaWYgKG5vZGUgaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLklkZW50aWZpZXJFeHByZXNzaW9uQ29udGV4dCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmlzaXRJZGVudGlmaWVyRXhwcmVzc2lvbihub2RlKTtcbiAgICAgICAgfSBlbHNlIGlmIChub2RlIGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5NZW1iZXJEb3RFeHByZXNzaW9uQ29udGV4dCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmlzaXRNZW1iZXJEb3RFeHByZXNzaW9uKG5vZGUpO1xuICAgICAgICB9IGVsc2UgaWYgKG5vZGUgaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLk1lbWJlckluZGV4RXhwcmVzc2lvbkNvbnRleHQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnZpc2l0TWVtYmVySW5kZXhFeHByZXNzaW9uKG5vZGUpO1xuICAgICAgICB9IGVsc2UgaWYgKG5vZGUgaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLkFzc2lnbm1lbnRPcGVyYXRvckV4cHJlc3Npb25Db250ZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy52aXNpdEFzc2lnbm1lbnRPcGVyYXRvckV4cHJlc3Npb24obm9kZSk7XG4gICAgICAgIH0gZWxzZSBpZiAobm9kZSBpbnN0YW5jZW9mIEVDTUFTY3JpcHRQYXJzZXIuRnVuY3Rpb25FeHByZXNzaW9uQ29udGV4dCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmlzaXRGdW5jdGlvbkV4cHJlc3Npb24obm9kZSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy50aHJvd0luc2FuY2VFcnJvcih0aGlzLmR1bXBDb250ZXh0KG5vZGUpKTtcbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNjbGFzc0RlY2xhcmF0aW9uLlxuICAgIHZpc2l0Q2xhc3NEZWNsYXJhdGlvbihjdHg6IFJ1bGVDb250ZXh0KTogQ2xhc3NEZWNsYXJhdGlvbiB7XG4gICAgICAgIHRoaXMubG9nKGN0eCwgVHJhY2UuZnJhbWUoKSk7XG4gICAgICAgIHRoaXMuYXNzZXJ0VHlwZShjdHgsIEVDTUFTY3JpcHRQYXJzZXIuQ2xhc3NEZWNsYXJhdGlvbkNvbnRleHQpO1xuICAgICAgICAvLyBDbGFzcyBpZGVudGlmaWVyIGNsYXNzVGFpbFxuICAgICAgICBjb25zdCBpZGVudGlmaWVyID0gdGhpcy52aXNpdElkZW50aWZpZXIoY3R4LmdldENoaWxkKDEpKTtcbiAgICAgICAgY29uc3QgYm9keTogUHJvcGVydHlbXSA9IHRoaXMudmlzaXRDbGFzc1RhaWwoY3R4LmdldENoaWxkKDIpKVxuICAgICAgICBjb25zdCBjbGFzc0JvZHkgPSBuZXcgQ2xhc3NCb2R5KGJvZHkpO1xuICAgICAgICByZXR1cm4gbmV3IENsYXNzRGVjbGFyYXRpb24oaWRlbnRpZmllciwgbnVsbCwgY2xhc3NCb2R5KTtcbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNjbGFzc1RhaWwuXG4gICAgdmlzaXRDbGFzc1RhaWwoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICB0aGlzLmxvZyhjdHgsIFRyYWNlLmZyYW1lKCkpO1xuICAgICAgICB0aGlzLmFzc2VydFR5cGUoY3R4LCBFQ01BU2NyaXB0UGFyc2VyLkNsYXNzVGFpbENvbnRleHQpO1xuICAgICAgICAvLyAgKEV4dGVuZHMgc2luZ2xlRXhwcmVzc2lvbik/ICd7JyBjbGFzc0VsZW1lbnQqICd9J1xuICAgICAgICB0aGlzLmR1bXBDb250ZXh0QWxsQ2hpbGRyZW4oY3R4KVxuICAgICAgICBjb25zdCBub2RlID0gdGhpcy5nZXROb2RlQnlUeXBlKGN0eCwgRUNNQVNjcmlwdFBhcnNlci5DbGFzc0VsZW1lbnRDb250ZXh0KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldE5vZGVCeVR5cGUoY3R4OiBSdWxlQ29udGV4dCwgdHlwZTogYW55KSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY3R4LmdldENoaWxkQ291bnQoKTsgKytpKSB7XG4gICAgICAgICAgICBpZiAoY3R4LmdldENoaWxkKGkpIGluc3RhbmNlb2YgdHlwZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjdHguZ2V0Q2hpbGQoaSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNjbGFzc0VsZW1lbnQuXG4gICAgdmlzaXRDbGFzc0VsZW1lbnQoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICB0aGlzLmxvZyhjdHgsIFRyYWNlLmZyYW1lKCkpO1xuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjbWV0aG9kRGVmaW5pdGlvbi5cbiAgICB2aXNpdE1ldGhvZERlZmluaXRpb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICB0aGlzLmxvZyhjdHgsIFRyYWNlLmZyYW1lKCkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2Zvcm1hbFBhcmFtZXRlckxpc3QuXG4gICAgICogPGNvZGU+XG4gICAgICogZm9ybWFsUGFyYW1ldGVyTGlzdFxuICAgICAqICAgOiBmb3JtYWxQYXJhbWV0ZXJBcmcgKCcsJyBmb3JtYWxQYXJhbWV0ZXJBcmcpKiAoJywnIGxhc3RGb3JtYWxQYXJhbWV0ZXJBcmcpP1xuICAgICAqICAgfCBsYXN0Rm9ybWFsUGFyYW1ldGVyQXJnXG4gICAgICogICA7XG4gICAgICogPC9jb2RlPlxuICAgICAqIEBwYXJhbSBjdHggXG4gICAgICovXG4gICAgdmlzaXRGb3JtYWxQYXJhbWV0ZXJMaXN0KGN0eDogUnVsZUNvbnRleHQpOiBGdW5jdGlvblBhcmFtZXRlcltdIHtcbiAgICAgICAgdGhpcy5sb2coY3R4LCBUcmFjZS5mcmFtZSgpKTtcbiAgICAgICAgdGhpcy5hc3NlcnRUeXBlKGN0eCwgRUNNQVNjcmlwdFBhcnNlci5Gb3JtYWxQYXJhbWV0ZXJMaXN0Q29udGV4dCk7XG4gICAgICAgIGNvbnN0IGZvcm1hbDogRnVuY3Rpb25QYXJhbWV0ZXJbXSA9IFtdXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY3R4LmdldENoaWxkQ291bnQoKTsgKytpKSB7XG4gICAgICAgICAgICBjb25zdCBub2RlID0gY3R4LmdldENoaWxkKGkpO1xuICAgICAgICAgICAgaWYgKG5vZGUgaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLkZvcm1hbFBhcmFtZXRlckFyZ0NvbnRleHQpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBwYXJhbWV0ZXIgPSB0aGlzLnZpc2l0Rm9ybWFsUGFyYW1ldGVyQXJnKG5vZGUpO1xuICAgICAgICAgICAgICAgIGZvcm1hbC5wdXNoKHBhcmFtZXRlcik7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG5vZGUgaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLkxhc3RGb3JtYWxQYXJhbWV0ZXJBcmdDb250ZXh0KSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcGFyYW1ldGVyID0gdGhpcy52aXNpdExhc3RGb3JtYWxQYXJhbWV0ZXJBcmcobm9kZSk7XG4gICAgICAgICAgICAgICAgZm9ybWFsLnB1c2gocGFyYW1ldGVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZm9ybWFsO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2Zvcm1hbFBhcmFtZXRlckFyZy5cbiAgICAgKiBcbiAgICAgKiBmb3JtYWxQYXJhbWV0ZXJBcmdcbiAgICAgKiAgIDogYXNzaWduYWJsZSAoJz0nIHNpbmdsZUV4cHJlc3Npb24pPyAgICAgIC8vIEVDTUFTY3JpcHQgNjogSW5pdGlhbGl6YXRpb25cbiAgICAgKiAgIDtcbiAgICAgKiBAcGFyYW0gY3R4IFxuICAgICAqL1xuICAgIHZpc2l0Rm9ybWFsUGFyYW1ldGVyQXJnKGN0eDogUnVsZUNvbnRleHQpOiBBc3NpZ25tZW50UGF0dGVybiB8IEJpbmRpbmdJZGVudGlmaWVyIHwgQmluZGluZ1BhdHRlcm4ge1xuICAgICAgICB0aGlzLmxvZyhjdHgsIFRyYWNlLmZyYW1lKCkpO1xuICAgICAgICB0aGlzLmFzc2VydFR5cGUoY3R4LCBFQ01BU2NyaXB0UGFyc2VyLkZvcm1hbFBhcmFtZXRlckFyZ0NvbnRleHQpO1xuICAgICAgICAvLyAgY29uc3RydWN0b3IobGVmdDogQmluZGluZ0lkZW50aWZpZXIgfCBCaW5kaW5nUGF0dGVybiwgcmlnaHQ6IEV4cHJlc3Npb24pXG5cbiAgICAgICAgY29uc3QgY291bnQgPSBjdHguZ2V0Q2hpbGRDb3VudCgpO1xuICAgICAgICBpZiAoY291bnQgIT0gMSAmJiBjb3VudCAhPSAzKSB7XG4gICAgICAgICAgICB0aGlzLnRocm93SW5zYW5jZUVycm9yKHRoaXMuZHVtcENvbnRleHQoY3R4KSk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gY29tcGxpYW5jZShlc3ByZWUpXG4gICAgICAgIC8vIEZvbGxvd2luZyBgKHBhcmFtMSA9IDEsIHBhcmFtMikgPT4geyAgfSBgIHdpbGwgcHJvZHVjZVxuICAgICAgICAvLyBwYXJhbTEgPSBBc3NpZ25tZW50UGF0dGVyblxuICAgICAgICAvLyBwYXJhbTIgPSBCaW5kaW5nSWRlbnRpZmllciB8IEJpbmRpbmdQYXR0ZXJuIFxuICAgICAgICBpZiAoY291bnQgPT0gMSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmlzaXRBc3NpZ25hYmxlKGN0eC5nZXRDaGlsZCgwKSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IGFzc2lnbmFibGUgPSB0aGlzLnZpc2l0QXNzaWduYWJsZShjdHguZ2V0Q2hpbGQoMCkpXG4gICAgICAgICAgICBjb25zdCBleHByZXNzaW9uID0gdGhpcy5zaW5nbGVFeHByZXNzaW9uKGN0eC5nZXRDaGlsZCgyKSk7XG4gICAgICAgICAgICByZXR1cm4gbmV3IEFzc2lnbm1lbnRQYXR0ZXJuKGFzc2lnbmFibGUsIGV4cHJlc3Npb24pO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFxuICAgICAqICBhc3NpZ25hYmxlXG4gICAgICogICAgOiBpZGVudGlmaWVyXG4gICAgICogICAgfCBhcnJheUxpdGVyYWxcbiAgICAgKiAgICB8IG9iamVjdExpdGVyYWxcbiAgICAgKiAgICA7IFxuICAgICAqIEBwYXJhbSBjdHggIEFzc2lnbmFibGVDb250ZXh0XG4gICAgICovXG4gICAgdmlzaXRBc3NpZ25hYmxlKGN0eDogUnVsZUNvbnRleHQpOiBCaW5kaW5nSWRlbnRpZmllciB8IEJpbmRpbmdQYXR0ZXJuIHtcbiAgICAgICAgdGhpcy5sb2coY3R4LCBUcmFjZS5mcmFtZSgpKTtcbiAgICAgICAgdGhpcy5hc3NlcnRUeXBlKGN0eCwgRUNNQVNjcmlwdFBhcnNlci5Bc3NpZ25hYmxlQ29udGV4dCk7XG4gICAgICAgIGNvbnN0IGFzc2lnbmFibGUgPSBjdHguZ2V0Q2hpbGQoMCk7XG4gICAgICAgIGlmIChhc3NpZ25hYmxlIGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5JZGVudGlmaWVyQ29udGV4dCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmlzaXRJZGVudGlmaWVyKGFzc2lnbmFibGUpO1xuICAgICAgICB9IGVsc2UgaWYgKGFzc2lnbmFibGUgaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLkFycmF5TGl0ZXJhbENvbnRleHQpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuaW5mbyhcIigoKCggICgoKCgoXCIpXG4gICAgICAgIH0gZWxzZSBpZiAoYXNzaWduYWJsZSBpbnN0YW5jZW9mIEVDTUFTY3JpcHRQYXJzZXIuT2JqZWN0TGl0ZXJhbENvbnRleHQpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuaW5mbyhcIigoKCggICgoKCgoXCIpXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy50aHJvd0luc2FuY2VFcnJvcih0aGlzLmR1bXBDb250ZXh0KGN0eCkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2xhc3RGb3JtYWxQYXJhbWV0ZXJBcmcuXG4gICAgICogXG4gICAgICogbGFzdEZvcm1hbFBhcmFtZXRlckFyZyAgICAgICAgICAgICAgICAgICAgICAgIC8vIEVDTUFTY3JpcHQgNjogUmVzdCBQYXJhbWV0ZXJcbiAgICAgKiAgIDogRWxsaXBzaXMgc2luZ2xlRXhwcmVzc2lvblxuICAgICAqICAgO1xuICAgICAqL1xuICAgIHZpc2l0TGFzdEZvcm1hbFBhcmFtZXRlckFyZyhjdHg6IFJ1bGVDb250ZXh0KTogUmVzdEVsZW1lbnQge1xuICAgICAgICB0aGlzLmxvZyhjdHgsIFRyYWNlLmZyYW1lKCkpO1xuICAgICAgICB0aGlzLmFzc2VydFR5cGUoY3R4LCBFQ01BU2NyaXB0UGFyc2VyLkxhc3RGb3JtYWxQYXJhbWV0ZXJBcmdDb250ZXh0KTtcbiAgICAgICAgY29uc3QgZXhwcmVzc2lvbiA9IHRoaXMuc2luZ2xlRXhwcmVzc2lvbihjdHguZ2V0Q2hpbGQoMSkpXG4gICAgICAgIHJldHVybiBuZXcgUmVzdEVsZW1lbnQoZXhwcmVzc2lvbilcbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNUZXJuYXJ5RXhwcmVzc2lvbi5cbiAgICB2aXNpdFRlcm5hcnlFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNMb2dpY2FsQW5kRXhwcmVzc2lvbi5cbiAgICB2aXNpdExvZ2ljYWxBbmRFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNQcmVJbmNyZW1lbnRFeHByZXNzaW9uLlxuICAgIHZpc2l0UHJlSW5jcmVtZW50RXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjT2JqZWN0TGl0ZXJhbEV4cHJlc3Npb24uXG4gICAgICogQHBhcmFtIGN0eCBcbiAgICAgKi9cbiAgICB2aXNpdE9iamVjdExpdGVyYWxFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpOiBPYmplY3RFeHByZXNzaW9uIHtcbiAgICAgICAgdGhpcy5sb2coY3R4LCBUcmFjZS5mcmFtZSgpKVxuICAgICAgICB0aGlzLmFzc2VydFR5cGUoY3R4LCBFQ01BU2NyaXB0UGFyc2VyLk9iamVjdExpdGVyYWxFeHByZXNzaW9uQ29udGV4dCk7XG4gICAgICAgIGNvbnN0IG5vZGUgPSBjdHguZ2V0Q2hpbGQoMCk7XG4gICAgICAgIGNvbnN0IHByb3BlcnRpZXM6IE9iamVjdEV4cHJlc3Npb25Qcm9wZXJ0eVtdID0gdGhpcy52aXNpdE9iamVjdExpdGVyYWwobm9kZSk7XG4gICAgICAgIHJldHVybiBuZXcgT2JqZWN0RXhwcmVzc2lvbihwcm9wZXJ0aWVzKTtcbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNJbkV4cHJlc3Npb24uXG4gICAgdmlzaXRJbkV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuXG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNMb2dpY2FsT3JFeHByZXNzaW9uLlxuICAgIHZpc2l0TG9naWNhbE9yRXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG5cbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI05vdEV4cHJlc3Npb24uXG4gICAgdmlzaXROb3RFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI1ByZURlY3JlYXNlRXhwcmVzc2lvbi5cbiAgICB2aXNpdFByZURlY3JlYXNlRXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNBcmd1bWVudHNFeHByZXNzaW9uLlxuICAgIHZpc2l0QXJndW1lbnRzRXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0QXJndW1lbnRzRXhwcmVzc2lvbjogXCIgKyBjdHguZ2V0VGV4dCgpKTtcbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI1RoaXNFeHByZXNzaW9uLlxuICAgIHZpc2l0VGhpc0V4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjRnVuY3Rpb25FeHByZXNzaW9uLlxuICAgICAqICAgYW5veW1vdXNGdW5jdGlvblxuICAgICAqICAgICAgIDogZnVuY3Rpb25EZWNsYXJhdGlvbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAjIEZ1bmN0aW9uRGVjbFxuICAgICAqICAgICAgIHwgQXN5bmM/IEZ1bmN0aW9uICcqJz8gJygnIGZvcm1hbFBhcmFtZXRlckxpc3Q/ICcpJyAneycgZnVuY3Rpb25Cb2R5ICd9JyAgICAjIEFub3ltb3VzRnVuY3Rpb25EZWNsXG4gICAgICogICAgICAgfCBBc3luYz8gYXJyb3dGdW5jdGlvblBhcmFtZXRlcnMgJz0+JyBhcnJvd0Z1bmN0aW9uQm9keSAgICAgICAgICAgICAgICAgICAgICMgQXJyb3dGdW5jdGlvblxuICAgICAqICAgICAgIDtcbiAgICAgKiBAcGFyYW0gY3R4IFxuICAgICAqL1xuICAgIHZpc2l0RnVuY3Rpb25FeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgdGhpcy5sb2coY3R4LCBUcmFjZS5mcmFtZSgpKTtcbiAgICAgICAgdGhpcy5hc3NlcnRUeXBlKGN0eCwgRUNNQVNjcmlwdFBhcnNlci5GdW5jdGlvbkV4cHJlc3Npb25Db250ZXh0KTtcbiAgICAgICAgY29uc3Qgbm9kZSA9IGN0eC5nZXRDaGlsZCgwKTtcbiAgICAgICAgbGV0IGZ1bmN0aW9uRXhwcmVzc2lvbjtcbiAgICAgICAgaWYgKG5vZGUgaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLkZ1bmN0aW9uRGVjbENvbnRleHQpIHtcbiAgICAgICAgICAgIGZ1bmN0aW9uRXhwcmVzc2lvbiA9IHRoaXMudmlzaXRGdW5jdGlvbkRlY2woY3R4LmdldENoaWxkKDApKTtcbiAgICAgICAgfSBlbHNlIGlmIChub2RlIGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5Bbm95bW91c0Z1bmN0aW9uRGVjbENvbnRleHQpIHtcbiAgICAgICAgICAgIGZ1bmN0aW9uRXhwcmVzc2lvbiA9IHRoaXMudmlzaXRBbm95bW91c0Z1bmN0aW9uRGVjbChjdHguZ2V0Q2hpbGQoMCkpO1xuICAgICAgICB9IGVsc2UgaWYgKG5vZGUgaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLkFycm93RnVuY3Rpb25Db250ZXh0KSB7XG4gICAgICAgICAgICBmdW5jdGlvbkV4cHJlc3Npb24gPSB0aGlzLnZpc2l0QXJyb3dGdW5jdGlvbihjdHguZ2V0Q2hpbGQoMCkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIm5vdCBpbXBsZW1lbnRlZFwiKVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmdW5jdGlvbkV4cHJlc3Npb247XG4gICAgfVxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjZnVuY3Rpb25EZWNsXG4gICAgdmlzaXRBcnJvd0Z1bmN0aW9uKGN0eDogUnVsZUNvbnRleHQpOiBBcnJvd0Z1bmN0aW9uRXhwcmVzc2lvbiB7XG4gICAgICAgIHRoaXMubG9nKGN0eCwgVHJhY2UuZnJhbWUoKSk7XG4gICAgICAgIHRoaXMuYXNzZXJ0VHlwZShjdHgsIEVDTUFTY3JpcHRQYXJzZXIuQXJyb3dGdW5jdGlvbkNvbnRleHQpO1xuICAgICAgICB0aGlzLmR1bXBDb250ZXh0QWxsQ2hpbGRyZW4oY3R4KVxuICAgICAgICBjb25zdCBwYXJhbUNvbnRleHQgPSB0aGlzLmdldFR5cGVkUnVsZUNvbnRleHQoY3R4LCBFQ01BU2NyaXB0UGFyc2VyLkFycm93RnVuY3Rpb25QYXJhbWV0ZXJzQ29udGV4dCk7XG4gICAgICAgIGNvbnN0IGJvZHlDb250ZXh0ID0gdGhpcy5nZXRUeXBlZFJ1bGVDb250ZXh0KGN0eCwgRUNNQVNjcmlwdFBhcnNlci5BcnJvd0Z1bmN0aW9uQm9keUNvbnRleHQpO1xuICAgICAgICBjb25zdCBwYXJhbXMgPSB0aGlzLnZpc2l0QXJyb3dGdW5jdGlvblBhcmFtZXRlcnMocGFyYW1Db250ZXh0KTtcbiAgICAgICAgY29uc3QgYm9keSA9IHRoaXMudmlzaXRBcnJvd0Z1bmN0aW9uQm9keShib2R5Q29udGV4dCk7XG4gICAgICAgIGNvbnN0IGV4cHJlc3Npb24gPSBmYWxzZTtcbiAgICAgICAgLy8gKHBhcmFtczogRnVuY3Rpb25QYXJhbWV0ZXJbXSwgYm9keTogQmxvY2tTdGF0ZW1lbnQgfCBFeHByZXNzaW9uLCBleHByZXNzaW9uOiBib29sZWFuKSBcbiAgICAgICAgcmV0dXJuIG5ldyBBcnJvd0Z1bmN0aW9uRXhwcmVzc2lvbihwYXJhbXMsIGJvZHksIGV4cHJlc3Npb24pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGFycm93RnVuY3Rpb25QYXJhbWV0ZXJzXG4gICAgICogIDogaWRlbnRpZmllclxuICAgICAqICB8ICcoJyBmb3JtYWxQYXJhbWV0ZXJMaXN0PyAnKSdcbiAgICAgKiAgO1xuICAgICAqIEBwYXJhbSBjdHggXG4gICAgICovXG4gICAgdmlzaXRBcnJvd0Z1bmN0aW9uUGFyYW1ldGVycyhjdHg6IFJ1bGVDb250ZXh0KTogRnVuY3Rpb25QYXJhbWV0ZXJbXSB7XG4gICAgICAgIHRoaXMubG9nKGN0eCwgVHJhY2UuZnJhbWUoKSk7XG4gICAgICAgIHRoaXMuYXNzZXJ0VHlwZShjdHgsIEVDTUFTY3JpcHRQYXJzZXIuQXJyb3dGdW5jdGlvblBhcmFtZXRlcnNDb250ZXh0KTtcbiAgICAgICAgLy8gZ290IG9ubHkgdHdvICgpXG4gICAgICAgIGlmIChjdHguZ2V0Q2hpbGRDb3VudCgpID09IDIpIHtcbiAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgfVxuICAgICAgICAvKlxuICAgICAgICBsZXQgYXN5bmMgPSBmYWxzZTtcbiAgICAgICAgbGV0IGdlbmVyYXRvciA9IGZhbHNlO1xuICAgICAgICBsZXQgaWRlbnRpZmllcjogSWRlbnRpZmllcjtcbiAgICAgICAgbGV0IHBhcmFtcztcbiAgICAgICAgbGV0IGJvZHk7XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjdHguZ2V0Q2hpbGRDb3VudCgpOyArK2kpIHtcbiAgICAgICAgICAgIGNvbnN0IG5vZGUgPSBjdHguZ2V0Q2hpbGQoaSk7XG4gICAgICAgICAgICBpZiAobm9kZS5zeW1ib2wpIHtcbiAgICAgICAgICAgICAgICBjb25zdCB0eHQgPSBub2RlLmdldFRleHQoKTtcbiAgICAgICAgICAgICAgICBpZiAodHh0ID09ICdhc3luYycpIHtcbiAgICAgICAgICAgICAgICAgICAgYXN5bmMgPSB0cnVlXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0eHQgPT0gJyonKSB7XG4gICAgICAgICAgICAgICAgICAgIGdlbmVyYXRvciA9IHRydWVcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobm9kZSBpbnN0YW5jZW9mIEVDTUFTY3JpcHRQYXJzZXIuSWRlbnRpZmllckNvbnRleHQpIHtcbiAgICAgICAgICAgICAgICBpZGVudGlmaWVyID0gdGhpcy52aXNpdElkZW50aWZpZXIobm9kZSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG5vZGUgaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLkZvcm1hbFBhcmFtZXRlckxpc3RDb250ZXh0KSB7XG4gICAgICAgICAgICAgICAgcGFyYW1zID0gdGhpcy52aXNpdEZvcm1hbFBhcmFtZXRlckxpc3Qobm9kZSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG5vZGUgaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLkZ1bmN0aW9uQm9keUNvbnRleHQpIHtcbiAgICAgICAgICAgICAgICAvLyBib2R5ID0gdGhpcy52aXNpdEZ1bmN0aW9uQm9keShub2RlKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmluZm8oXCJFQ01BU2NyaXB0UGFyc2VyIDs7IEZvcm1hbFBhcmFtZXRlckxpc3RDb250ZXh0XCIpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmR1bXBDb250ZXh0QWxsQ2hpbGRyZW4obm9kZSlcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnNvbGUuaW5mbygnYXN5bmMgID0gJyArIGFzeW5jKTtcbiAgICAgICAgY29uc29sZS5pbmZvKCdnZW5lcmF0b3IgID0gJyArIGdlbmVyYXRvcik7XG4gICAgICAgICovXG4gICAgICAgIGxldCBwYXJhbXMgPSBbXTtcbiAgICAgICAgZm9yIChjb25zdCBub2RlIG9mIHRoaXMuaXRlcmFibGUoY3R4KSkge1xuICAgICAgICAgICAgaWYgKG5vZGUgaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLklkZW50aWZpZXJDb250ZXh0KSB7XG4gICAgICAgICAgICAgICAgcGFyYW1zLnB1c2godGhpcy52aXNpdElkZW50aWZpZXIobm9kZSkpXG4gICAgICAgICAgICB9IGVsc2UgaWYgKG5vZGUgaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLkZvcm1hbFBhcmFtZXRlckxpc3RDb250ZXh0KSB7XG4gICAgICAgICAgICAgICAgcGFyYW1zID0gWy4uLnRoaXMudmlzaXRGb3JtYWxQYXJhbWV0ZXJMaXN0KG5vZGUpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcGFyYW1zO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogIGFycm93RnVuY3Rpb25Cb2R5XG4gICAgICogICA6ICd7JyBmdW5jdGlvbkJvZHkgJ30nIFxuICAgICAqICAgfCBzaW5nbGVFeHByZXNzaW9uXG4gICAgICogICA7XG4gICAgICogQHBhcmFtIGN0eCBcbiAgICAgKi9cbiAgICB2aXNpdEFycm93RnVuY3Rpb25Cb2R5KGN0eDogUnVsZUNvbnRleHQpOiBCbG9ja1N0YXRlbWVudCB8IEV4cHJlc3Npb24ge1xuICAgICAgICB0aGlzLmxvZyhjdHgsIFRyYWNlLmZyYW1lKCkpO1xuICAgICAgICB0aGlzLmFzc2VydFR5cGUoY3R4LCBFQ01BU2NyaXB0UGFyc2VyLkFycm93RnVuY3Rpb25Cb2R5Q29udGV4dCk7XG4gICAgICAgIGNvbnN0IG5vZGUgPSBjdHguZ2V0Q2hpbGQoMCk7XG4gICAgICAgIGlmIChjdHguZ2V0Q2hpbGRDb3VudCgpID09IDMpIHtcbiAgICAgICAgICAgIGNvbnN0IGJvZHlDb250ZXh0ID0gdGhpcy5nZXRUeXBlZFJ1bGVDb250ZXh0KGN0eCwgRUNNQVNjcmlwdFBhcnNlci5GdW5jdGlvbkJvZHlDb250ZXh0KTtcbiAgICAgICAgICAgIGlmIChib2R5Q29udGV4dC5nZXRDaGlsZENvdW50KCkgPT0gMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgQmxvY2tTdGF0ZW1lbnQoW10pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgYm9keSA9IHRoaXMudmlzaXRGdW5jdGlvbkJvZHkoYm9keUNvbnRleHQpO1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBCbG9ja1N0YXRlbWVudChib2R5KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChub2RlIGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5QYXJlbnRoZXNpemVkRXhwcmVzc2lvbkNvbnRleHQpIHtcbiAgICAgICAgICAgICAgICB0eXBlIFBhcmVudGhlc2l6ZWRFeHByZXNzaW9uID0gRXhwcmVzc2lvblN0YXRlbWVudCB8IFNlcXVlbmNlRXhwcmVzc2lvblxuICAgICAgICAgICAgICAgIGNvbnN0IHBhcmFtZXRpemVkOiBQYXJlbnRoZXNpemVkRXhwcmVzc2lvbiA9IHRoaXMudmlzaXRQYXJlbnRoZXNpemVkRXhwcmVzc2lvbihub2RlKTtcbiAgICAgICAgICAgICAgICAvLyBjb21wbGlhbmNlIGVzcHJlZSA6IHRoaXMgZnVuY3Rpb24gcmV0dXJucyBFeHByZXNzaW9uU3RhdGVtZW50IG9yIEV4cHJlc3Npb25TZXF1ZW5jZUNvbnRleHRcbiAgICAgICAgICAgICAgICAvLyB1bndpbmRpbmcgRXhwcmVzc2lvblN0YXRlbWVudCB0byB0byBzaW1wbHkgcmV0dXJuIFxuICAgICAgICAgICAgICAgIGlmIChwYXJhbWV0aXplZCBpbnN0YW5jZW9mIEV4cHJlc3Npb25TdGF0ZW1lbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHBhcmFtZXRpemVkLmV4cHJlc3Npb247XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChwYXJhbWV0aXplZCBpbnN0YW5jZW9mIFNlcXVlbmNlRXhwcmVzc2lvbikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcGFyYW1ldGl6ZWQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5zaW5nbGVFeHByZXNzaW9uKG5vZGUpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlVua25vd24gdHlwZSBmb3IgOiBcIiArIGN0eCk7XG4gICAgfVxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjVW5hcnlNaW51c0V4cHJlc3Npb24uXG4gICAgdmlzaXRVbmFyeU1pbnVzRXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG5cbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI1Bvc3REZWNyZWFzZUV4cHJlc3Npb24uXG4gICAgdmlzaXRQb3N0RGVjcmVhc2VFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNBc3NpZ25tZW50RXhwcmVzc2lvbi5cbiAgICAgKiBcbiAgICAgKiA8YXNzb2M9cmlnaHQ+IHNpbmdsZUV4cHJlc3Npb24gJz0nIHNpbmdsZUV4cHJlc3Npb24gICAgICAgICAgICAgICAgICAgIyBBc3NpZ25tZW50RXhwcmVzc2lvblxuICAgICAqIEBwYXJhbSBjdHggXG4gICAgICovXG4gICAgdmlzaXRBc3NpZ25tZW50RXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KTogQXNzaWdubWVudEV4cHJlc3Npb24ge1xuICAgICAgICB0aGlzLmxvZyhjdHgsIFRyYWNlLmZyYW1lKCkpXG4gICAgICAgIHRoaXMuYXNzZXJ0VHlwZShjdHgsIEVDTUFTY3JpcHRQYXJzZXIuQXNzaWdubWVudEV4cHJlc3Npb25Db250ZXh0KTtcbiAgICAgICAgdGhpcy5hc3NlcnROb2RlQ291bnQoY3R4LCAzKVxuXG4gICAgICAgIGNvbnN0IGluaXRpYWxpc2VyID0gY3R4LmdldENoaWxkKDApO1xuICAgICAgICBjb25zdCBvcGVyYXRvciA9IGN0eC5nZXRDaGlsZCgxKS5nZXRUZXh0KCk7IC8vIE5vIHR5cGUgKCA9IClcbiAgICAgICAgY29uc3QgZXhwcmVzc2lvbiA9IGN0eC5nZXRDaGlsZCgyKTtcbiAgICAgICAgY29uc3QgbGhzID0gdGhpcy5zaW5nbGVFeHByZXNzaW9uKGluaXRpYWxpc2VyKTtcbiAgICAgICAgY29uc3QgcmhzID0gdGhpcy5zaW5nbGVFeHByZXNzaW9uKGV4cHJlc3Npb24pO1xuXG4gICAgICAgIC8vIENvbXBsaWFuY2UgOiBwdWxsaW5nIHVwIEV4cHJlc3Npb25TdGF0ZW1lbnQgaW50byBBc3NpZ2VtZW50RXhwcmVzc2lvblxuICAgICAgICByZXR1cm4gbmV3IEFzc2lnbm1lbnRFeHByZXNzaW9uKG9wZXJhdG9yLCBsaHMsIHJocylcbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI1R5cGVvZkV4cHJlc3Npb24uXG4gICAgdmlzaXRUeXBlb2ZFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcblxuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjSW5zdGFuY2VvZkV4cHJlc3Npb24uXG4gICAgdmlzaXRJbnN0YW5jZW9mRXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG5cbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNVbmFyeVBsdXNFeHByZXNzaW9uLlxuICAgIHZpc2l0VW5hcnlQbHVzRXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG5cbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNEZWxldGVFeHByZXNzaW9uLlxuICAgIHZpc2l0RGVsZXRlRXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gICAgfVxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjRXF1YWxpdHlFeHByZXNzaW9uLlxuICAgIHZpc2l0RXF1YWxpdHlFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpOiBCaW5hcnlFeHByZXNzaW9uIHtcbiAgICAgICAgY29uc29sZS5pbmZvKFwidmlzaXRFcXVhbGl0eUV4cHJlc3Npb24gWyVzXSA6ICVzXCIsIGN0eC5nZXRDaGlsZENvdW50KCksIGN0eC5nZXRUZXh0KCkpO1xuICAgICAgICB0aGlzLmFzc2VydFR5cGUoY3R4LCBFQ01BU2NyaXB0UGFyc2VyLkVxdWFsaXR5RXhwcmVzc2lvbkNvbnRleHQpO1xuICAgICAgICB0aGlzLmFzc2VydE5vZGVDb3VudChjdHgsIDMpXG5cbiAgICAgICAgbGV0IGxlZnQgPSBjdHguZ2V0Q2hpbGQoMCk7XG4gICAgICAgIGxldCBvcGVyYXRvciA9IGN0eC5nZXRDaGlsZCgxKS5nZXRUZXh0KCk7IC8vIE5vIHR5cGUgKCArLC0gKVxuICAgICAgICBsZXQgcmlnaHQgPSBjdHguZ2V0Q2hpbGQoMik7XG4gICAgICAgIGxldCBsaHMgPSB0aGlzLl92aXNpdEJpbmFyeUV4cHJlc3Npb24obGVmdCk7XG4gICAgICAgIGxldCByaHMgPSB0aGlzLl92aXNpdEJpbmFyeUV4cHJlc3Npb24ocmlnaHQpO1xuXG4gICAgICAgIHJldHVybiB0aGlzLmRlY29yYXRlKG5ldyBCaW5hcnlFeHByZXNzaW9uKG9wZXJhdG9yLCBsaHMsIHJocyksIHt9KTtcbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI0JpdFhPckV4cHJlc3Npb24uXG4gICAgdmlzaXRCaXRYT3JFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcblxuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjTXVsdGlwbGljYXRpdmVFeHByZXNzaW9uLlxuICAgIHZpc2l0TXVsdGlwbGljYXRpdmVFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpOiBCaW5hcnlFeHByZXNzaW9uIHtcbiAgICAgICAgdGhpcy5sb2coY3R4LCBUcmFjZS5mcmFtZSgpKTtcbiAgICAgICAgdGhpcy5hc3NlcnRUeXBlKGN0eCwgRUNNQVNjcmlwdFBhcnNlci5NdWx0aXBsaWNhdGl2ZUV4cHJlc3Npb25Db250ZXh0KTtcbiAgICAgICAgdGhpcy5hc3NlcnROb2RlQ291bnQoY3R4LCAzKVxuXG4gICAgICAgIGxldCBsZWZ0ID0gY3R4LmdldENoaWxkKDApO1xuICAgICAgICBsZXQgb3BlcmF0b3IgPSBjdHguZ2V0Q2hpbGQoMSkuZ2V0VGV4dCgpOyAvLyBObyB0eXBlICggKywtIClcbiAgICAgICAgbGV0IHJpZ2h0ID0gY3R4LmdldENoaWxkKDIpO1xuICAgICAgICBsZXQgbGhzID0gdGhpcy52aXNpdEJpbmFyeUV4cHJlc3Npb24obGVmdCk7XG4gICAgICAgIGxldCByaHMgPSB0aGlzLnZpc2l0QmluYXJ5RXhwcmVzc2lvbihyaWdodCk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuZGVjb3JhdGUobmV3IEJpbmFyeUV4cHJlc3Npb24ob3BlcmF0b3IsIGxocywgcmhzKSwge30pO1xuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI0JpdFNoaWZ0RXhwcmVzc2lvbi5cbiAgICB2aXNpdEJpdFNoaWZ0RXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG5cbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNQYXJlbnRoZXNpemVkRXhwcmVzc2lvbi5cbiAgICB2aXNpdFBhcmVudGhlc2l6ZWRFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgdGhpcy5sb2coY3R4LCBUcmFjZS5mcmFtZSgpKTtcbiAgICAgICAgdGhpcy5hc3NlcnRUeXBlKGN0eCwgRUNNQVNjcmlwdFBhcnNlci5QYXJlbnRoZXNpemVkRXhwcmVzc2lvbkNvbnRleHQpO1xuICAgICAgICB0aGlzLmFzc2VydE5vZGVDb3VudChjdHgsIDMpXG4gICAgICAgIGNvbnN0IGV4cHJlc3Npb24gPSBjdHguZ2V0Q2hpbGQoMSk7XG4gICAgICAgIHJldHVybiB0aGlzLnZpc2l0RXhwcmVzc2lvblNlcXVlbmNlKGV4cHJlc3Npb24pO1xuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI0FkZGl0aXZlRXhwcmVzc2lvbi5cbiAgICB2aXNpdEFkZGl0aXZlRXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KTogQmluYXJ5RXhwcmVzc2lvbiB7XG4gICAgICAgIHRoaXMubG9nKGN0eCwgVHJhY2UuZnJhbWUoKSk7XG4gICAgICAgIHRoaXMuYXNzZXJ0VHlwZShjdHgsIEVDTUFTY3JpcHRQYXJzZXIuQWRkaXRpdmVFeHByZXNzaW9uQ29udGV4dCk7XG4gICAgICAgIHRoaXMuYXNzZXJ0Tm9kZUNvdW50KGN0eCwgMylcblxuICAgICAgICBjb25zdCBsZWZ0ID0gY3R4LmdldENoaWxkKDApO1xuICAgICAgICBjb25zdCBvcGVyYXRvciA9IGN0eC5nZXRDaGlsZCgxKS5nZXRUZXh0KCk7IC8vIE5vIHR5cGUgKCArLC0gKVxuICAgICAgICBjb25zdCByaWdodCA9IGN0eC5nZXRDaGlsZCgyKTtcbiAgICAgICAgY29uc3QgbGhzID0gdGhpcy5fdmlzaXRCaW5hcnlFeHByZXNzaW9uKGxlZnQpO1xuICAgICAgICBjb25zdCByaHMgPSB0aGlzLl92aXNpdEJpbmFyeUV4cHJlc3Npb24ocmlnaHQpO1xuICAgICAgICAvLyByZXR1cm4gdGhpcy5kZWNvcmF0ZShuZXcgQmluYXJ5RXhwcmVzc2lvbihvcGVyYXRvciwgbGhzICxyaHMpLCB0aGlzLmFzTWFya2VyKHRoaXMuYXNNZXRhZGF0YShjdHguc3ltYm9sKSkpO1xuICAgICAgICByZXR1cm4gbmV3IEJpbmFyeUV4cHJlc3Npb24ob3BlcmF0b3IsIGxocywgcmhzKTtcbiAgICB9XG5cbiAgICBfdmlzaXRCaW5hcnlFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcblxuICAgICAgICBjb25zb2xlLmluZm8oXCJldmFsQmluYXJ5RXhwcmVzc2lvbiBbJXNdIDogJXNcIiwgY3R4LmdldENoaWxkQ291bnQoKSwgY3R4LmdldFRleHQoKSk7XG4gICAgICAgIGlmIChjdHggaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLklkZW50aWZpZXJFeHByZXNzaW9uQ29udGV4dCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmlzaXRJZGVudGlmaWVyRXhwcmVzc2lvbihjdHgpO1xuICAgICAgICB9IGVsc2UgaWYgKGN0eCBpbnN0YW5jZW9mIEVDTUFTY3JpcHRQYXJzZXIuTGl0ZXJhbEV4cHJlc3Npb25Db250ZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy52aXNpdExpdGVyYWxFeHByZXNzaW9uKGN0eCk7XG4gICAgICAgIH0gZWxzZSBpZiAoY3R4IGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5BZGRpdGl2ZUV4cHJlc3Npb25Db250ZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy52aXNpdEFkZGl0aXZlRXhwcmVzc2lvbihjdHgpO1xuICAgICAgICB9IGVsc2UgaWYgKGN0eCBpbnN0YW5jZW9mIEVDTUFTY3JpcHRQYXJzZXIuTXVsdGlwbGljYXRpdmVFeHByZXNzaW9uQ29udGV4dCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmlzaXRNdWx0aXBsaWNhdGl2ZUV4cHJlc3Npb24oY3R4KTtcbiAgICAgICAgfSBlbHNlIGlmIChjdHggaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLlJlbGF0aW9uYWxFeHByZXNzaW9uQ29udGV4dCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmlzaXRSZWxhdGlvbmFsRXhwcmVzc2lvbihjdHgpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMudGhyb3dJbnNhbmNlRXJyb3IodGhpcy5kdW1wQ29udGV4dChjdHgpKTtcbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNSZWxhdGlvbmFsRXhwcmVzc2lvbi5cbiAgICB2aXNpdFJlbGF0aW9uYWxFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpOiBCaW5hcnlFeHByZXNzaW9uIHtcbiAgICAgICAgY29uc29sZS5pbmZvKFwidmlzaXRSZWxhdGlvbmFsRXhwcmVzc2lvbiBbJXNdIDogJXNcIiwgY3R4LmdldENoaWxkQ291bnQoKSwgY3R4LmdldFRleHQoKSk7XG4gICAgICAgIHRoaXMuYXNzZXJ0VHlwZShjdHgsIEVDTUFTY3JpcHRQYXJzZXIuUmVsYXRpb25hbEV4cHJlc3Npb25Db250ZXh0KTtcbiAgICAgICAgdGhpcy5hc3NlcnROb2RlQ291bnQoY3R4LCAzKVxuICAgICAgICBjb25zdCBsZWZ0ID0gY3R4LmdldENoaWxkKDApO1xuICAgICAgICBjb25zdCBvcGVyYXRvciA9IGN0eC5nZXRDaGlsZCgxKS5nZXRUZXh0KCk7IC8vIE5vIHR5cGUgKCArLC0gKVxuICAgICAgICBjb25zdCByaWdodCA9IGN0eC5nZXRDaGlsZCgyKTtcbiAgICAgICAgY29uc3QgbGhzID0gdGhpcy5fdmlzaXRCaW5hcnlFeHByZXNzaW9uKGxlZnQpO1xuICAgICAgICBjb25zdCByaHMgPSB0aGlzLl92aXNpdEJpbmFyeUV4cHJlc3Npb24ocmlnaHQpO1xuICAgICAgICAvLyByZXR1cm4gdGhpcy5kZWNvcmF0ZShuZXcgQmluYXJ5RXhwcmVzc2lvbihvcGVyYXRvciwgbGhzICxyaHMpLCB0aGlzLmFzTWFya2VyKHRoaXMuYXNNZXRhZGF0YShjdHguc3ltYm9sKSkpO1xuICAgICAgICByZXR1cm4gbmV3IEJpbmFyeUV4cHJlc3Npb24ob3BlcmF0b3IsIGxocywgcmhzKTtcbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNQb3N0SW5jcmVtZW50RXhwcmVzc2lvbi5cbiAgICB2aXNpdFBvc3RJbmNyZW1lbnRFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNCaXROb3RFeHByZXNzaW9uLlxuICAgIHZpc2l0Qml0Tm90RXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG5cbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI05ld0V4cHJlc3Npb24uXG4gICAgdmlzaXROZXdFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcblxuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjTGl0ZXJhbEV4cHJlc3Npb24uXG4gICAgdmlzaXRMaXRlcmFsRXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0TGl0ZXJhbEV4cHJlc3Npb24gWyVzXSA6IFslc11cIiwgY3R4LmdldENoaWxkQ291bnQoKSwgY3R4LmdldFRleHQoKSk7XG4gICAgICAgIHRoaXMuYXNzZXJ0VHlwZShjdHgsIEVDTUFTY3JpcHRQYXJzZXIuTGl0ZXJhbEV4cHJlc3Npb25Db250ZXh0KTtcbiAgICAgICAgdGhpcy5hc3NlcnROb2RlQ291bnQoY3R4LCAxKTtcbiAgICAgICAgLy8gdmlzaXRMaXRlcmFsRXhwcmVzc2lvbjogPiB2aXNpdExpdGVyYWxcbiAgICAgICAgbGV0IG5vZGUgPSBjdHguZ2V0Q2hpbGQoMClcbiAgICAgICAgaWYgKG5vZGUgaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLkxpdGVyYWxDb250ZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy52aXNpdExpdGVyYWwobm9kZSk7XG4gICAgICAgIH0gZWxzZSBpZiAobm9kZSBpbnN0YW5jZW9mIEVDTUFTY3JpcHRQYXJzZXIuTnVtZXJpY0xpdGVyYWxDb250ZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy52aXNpdE51bWVyaWNMaXRlcmFsKG5vZGUpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMudGhyb3dJbnNhbmNlRXJyb3IodGhpcy5kdW1wQ29udGV4dChub2RlKSk7XG4gICAgfVxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjQXJyYXlMaXRlcmFsRXhwcmVzc2lvbi5cbiAgICB2aXNpdEFycmF5TGl0ZXJhbEV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCk6IEFycmF5RXhwcmVzc2lvbiB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0QXJyYXlMaXRlcmFsRXhwcmVzc2lvbiBbJXNdIDogJXNcIiwgY3R4LmdldENoaWxkQ291bnQoKSwgY3R4LmdldFRleHQoKSk7XG4gICAgICAgIHRoaXMuYXNzZXJ0VHlwZShjdHgsIEVDTUFTY3JpcHRQYXJzZXIuQXJyYXlMaXRlcmFsRXhwcmVzc2lvbkNvbnRleHQpO1xuICAgICAgICB0aGlzLmFzc2VydE5vZGVDb3VudChjdHgsIDEpO1xuICAgICAgICBjb25zdCBub2RlID0gY3R4LmdldENoaWxkKDApO1xuICAgICAgICBjb25zdCBlbGVtZW50cyA9IHRoaXMudmlzaXRBcnJheUxpdGVyYWwobm9kZSk7XG4gICAgICAgIHJldHVybiBuZXcgQXJyYXlFeHByZXNzaW9uKGVsZW1lbnRzKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAvLyBjb21wdXRlZCA9IGZhbHNlIGB4LnpgXG4gICAgICogLy8gY29tcHV0ZWQgPSB0cnVlIGB5WzFdYFxuICAgICAqIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI01lbWJlckRvdEV4cHJlc3Npb24uXG4gICAgICovXG4gICAgdmlzaXRNZW1iZXJEb3RFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpOiBTdGF0aWNNZW1iZXJFeHByZXNzaW9uIHtcbiAgICAgICAgY29uc29sZS5pbmZvKFwidmlzaXRBcnJheUxpdGVyYWxFeHByZXNzaW9uIFslc10gOiAlc1wiLCBjdHguZ2V0Q2hpbGRDb3VudCgpLCBjdHguZ2V0VGV4dCgpKTtcbiAgICAgICAgdGhpcy5hc3NlcnRUeXBlKGN0eCwgRUNNQVNjcmlwdFBhcnNlci5NZW1iZXJEb3RFeHByZXNzaW9uQ29udGV4dCk7XG4gICAgICAgIHRoaXMuYXNzZXJ0Tm9kZUNvdW50KGN0eCwgMyk7XG4gICAgICAgIGNvbnN0IGV4cHIgPSB0aGlzLnNpbmdsZUV4cHJlc3Npb24oY3R4LmdldENoaWxkKDApKTtcbiAgICAgICAgY29uc3QgcHJvcGVydHkgPSB0aGlzLnZpc2l0SWRlbnRpZmllck5hbWUoY3R4LmdldENoaWxkKDIpKTtcbiAgICAgICAgcmV0dXJuIG5ldyBTdGF0aWNNZW1iZXJFeHByZXNzaW9uKGV4cHIsIHByb3BlcnR5KTtcbiAgICB9XG5cbiAgICBwcmludChjdHg6IFJ1bGVDb250ZXh0KTogdm9pZCB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcIiAqKioqKiAgXCIpXG4gICAgICAgIGNvbnN0IHZpc2l0b3IgPSBuZXcgUHJpbnRWaXNpdG9yKCk7XG4gICAgICAgIGN0eC5hY2NlcHQodmlzaXRvcik7XG4gICAgfVxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjTWVtYmVySW5kZXhFeHByZXNzaW9uLlxuICAgIHZpc2l0TWVtYmVySW5kZXhFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpOiBDb21wdXRlZE1lbWJlckV4cHJlc3Npb24ge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJ2aXNpdE1lbWJlckluZGV4RXhwcmVzc2lvbiBbJXNdIDogJXNcIiwgY3R4LmdldENoaWxkQ291bnQoKSwgY3R4LmdldFRleHQoKSk7XG4gICAgICAgIHRoaXMuYXNzZXJ0VHlwZShjdHgsIEVDTUFTY3JpcHRQYXJzZXIuTWVtYmVySW5kZXhFeHByZXNzaW9uQ29udGV4dCk7XG4gICAgICAgIHRoaXMuYXNzZXJ0Tm9kZUNvdW50KGN0eCwgNCk7XG4gICAgICAgIGNvbnN0IGV4cHIgPSB0aGlzLnNpbmdsZUV4cHJlc3Npb24oY3R4LmdldENoaWxkKDApKTtcbiAgICAgICAgY29uc3QgcHJvcGVydHkgPSB0aGlzLnZpc2l0RXhwcmVzc2lvblNlcXVlbmNlKGN0eC5nZXRDaGlsZCgyKSk7XG4gICAgICAgIHJldHVybiBuZXcgQ29tcHV0ZWRNZW1iZXJFeHByZXNzaW9uKGV4cHIsIHByb3BlcnR5KTtcbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNJZGVudGlmaWVyRXhwcmVzc2lvbi5cbiAgICB2aXNpdElkZW50aWZpZXJFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpOiBJZGVudGlmaWVyIHtcbiAgICAgICAgY29uc29sZS5pbmZvKFwidmlzaXRJZGVudGlmaWVyRXhwcmVzc2lvbiBbJXNdIDogJXNcIiwgY3R4LmdldENoaWxkQ291bnQoKSwgY3R4LmdldFRleHQoKSk7XG4gICAgICAgIHRoaXMuYXNzZXJ0VHlwZShjdHgsIEVDTUFTY3JpcHRQYXJzZXIuSWRlbnRpZmllckV4cHJlc3Npb25Db250ZXh0KTtcbiAgICAgICAgdGhpcy5hc3NlcnROb2RlQ291bnQoY3R4LCAxKVxuICAgICAgICBjb25zdCBpbml0aWFsaXNlciA9IGN0eC5nZXRDaGlsZCgwKTtcbiAgICAgICAgY29uc3QgbmFtZSA9IGluaXRpYWxpc2VyLmdldFRleHQoKTtcbiAgICAgICAgLy8gcmV0dXJuIHRoaXMuZGVjb3JhdGUobmV3IElkZW50aWZpZXIobmFtZSksIHRoaXMuYXNNYXJrZXIodGhpcy5hc01ldGFkYXRhKGluaXRpYWxpc2VyLnN5bWJvbCkpKVxuICAgICAgICByZXR1cm4gbmV3IElkZW50aWZpZXIobmFtZSk7XG4gICAgfVxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjaWRlbnRpZmllci5cbiAgICB2aXNpdElkZW50aWZpZXIoY3R4OiBSdWxlQ29udGV4dCk6IElkZW50aWZpZXIge1xuICAgICAgICB0aGlzLmxvZyhjdHgsIFRyYWNlLmZyYW1lKCkpO1xuICAgICAgICB0aGlzLmFzc2VydFR5cGUoY3R4LCBFQ01BU2NyaXB0UGFyc2VyLklkZW50aWZpZXJDb250ZXh0KVxuICAgICAgICByZXR1cm4gbmV3IElkZW50aWZpZXIoY3R4LmdldENoaWxkKDApLmdldFRleHQoKSlcbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNCaXRBbmRFeHByZXNzaW9uLlxuICAgIHZpc2l0Qml0QW5kRXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gICAgfVxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjQml0T3JFeHByZXNzaW9uLlxuICAgIHZpc2l0Qml0T3JFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNBc3NpZ25tZW50T3BlcmF0b3JFeHByZXNzaW9uLlxuICAgICAqIFxuICAgICAqIDxhc3NvYz1yaWdodD4gc2luZ2xlRXhwcmVzc2lvbiBhc3NpZ25tZW50T3BlcmF0b3Igc2luZ2xlRXhwcmVzc2lvbiAgICAjIEFzc2lnbm1lbnRPcGVyYXRvckV4cHJlc3Npb25cbiAgICAgKiBAcGFyYW0gY3R4IFxuICAgICAqL1xuICAgIHZpc2l0QXNzaWdubWVudE9wZXJhdG9yRXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KTogQXNzaWdubWVudEV4cHJlc3Npb24ge1xuICAgICAgICB0aGlzLmxvZyhjdHgsIFRyYWNlLmZyYW1lKCkpXG4gICAgICAgIHRoaXMuYXNzZXJ0VHlwZShjdHgsIEVDTUFTY3JpcHRQYXJzZXIuQXNzaWdubWVudE9wZXJhdG9yRXhwcmVzc2lvbkNvbnRleHQpO1xuICAgICAgICB0aGlzLmFzc2VydE5vZGVDb3VudChjdHgsIDMpXG4gICAgICAgIGNvbnN0IGluaXRpYWxpc2VyID0gY3R4LmdldENoaWxkKDApO1xuICAgICAgICBjb25zdCBvcGVyYXRvciA9IGN0eC5nZXRDaGlsZCgxKS5nZXRUZXh0KCk7XG4gICAgICAgIGNvbnN0IGV4cHJlc3Npb24gPSBjdHguZ2V0Q2hpbGQoMik7XG4gICAgICAgIGNvbnN0IGxocyA9IHRoaXMuc2luZ2xlRXhwcmVzc2lvbihpbml0aWFsaXNlcik7XG4gICAgICAgIGNvbnN0IHJocyA9IHRoaXMuc2luZ2xlRXhwcmVzc2lvbihleHByZXNzaW9uKTtcblxuICAgICAgICAvLyBDb21wbGlhbmNlIDogcHVsbGluZyB1cCBFeHByZXNzaW9uU3RhdGVtZW50IGludG8gQXNzaWdlbWVudEV4cHJlc3Npb25cbiAgICAgICAgcmV0dXJuIG5ldyBBc3NpZ25tZW50RXhwcmVzc2lvbihvcGVyYXRvciwgbGhzLCByaHMuZXhwcmVzc2lvbilcbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNWb2lkRXhwcmVzc2lvbi5cbiAgICB2aXNpdFZvaWRFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcblxuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2Fzc2lnbm1lbnRPcGVyYXRvci5cbiAgICB2aXNpdEFzc2lnbm1lbnRPcGVyYXRvcihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0QXNzaWdubWVudE9wZXJhdG9yIFslc10gOiBbJXNdXCIsIGN0eC5nZXRDaGlsZENvdW50KCksIGN0eC5nZXRUZXh0KCkpO1xuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2xpdGVyYWwuXG4gICAgdmlzaXRMaXRlcmFsKGN0eDogUnVsZUNvbnRleHQpOiBMaXRlcmFsIHtcbiAgICAgICAgY29uc29sZS5pbmZvKFwidmlzaXRMaXRlcmFsIFslc10gOiBbJXNdXCIsIGN0eC5nZXRDaGlsZENvdW50KCksIGN0eC5nZXRUZXh0KCkpO1xuICAgICAgICB0aGlzLmFzc2VydFR5cGUoY3R4LCBFQ01BU2NyaXB0UGFyc2VyLkxpdGVyYWxDb250ZXh0KVxuICAgICAgICB0aGlzLmFzc2VydE5vZGVDb3VudChjdHgsIDEpO1xuICAgICAgICBjb25zdCBub2RlOiBSdWxlQ29udGV4dCA9IGN0eC5nZXRDaGlsZCgwKTtcblxuICAgICAgICBpZiAobm9kZS5nZXRDaGlsZENvdW50KCkgPT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY3JlYXRlTGl0ZXJhbFZhbHVlKG5vZGUpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKG5vZGUuZ2V0Q2hpbGRDb3VudCgpID09IDEpIHtcbiAgICAgICAgICAgIGlmIChub2RlIGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5OdW1lcmljTGl0ZXJhbENvbnRleHQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy52aXNpdE51bWVyaWNMaXRlcmFsKG5vZGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy50aHJvd0luc2FuY2VFcnJvcih0aGlzLmR1bXBDb250ZXh0KG5vZGUpKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnRocm93SW5zYW5jZUVycm9yKHRoaXMuZHVtcENvbnRleHQobm9kZSkpO1xuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI251bWVyaWNMaXRlcmFsLlxuICAgIHZpc2l0TnVtZXJpY0xpdGVyYWwoY3R4OiBSdWxlQ29udGV4dCk6IExpdGVyYWwge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJ2aXNpdE51bWVyaWNMaXRlcmFsIFslc10gOiBbJXNdXCIsIGN0eC5nZXRDaGlsZENvdW50KCksIGN0eC5nZXRUZXh0KCkpO1xuICAgICAgICB0aGlzLmFzc2VydFR5cGUoY3R4LCBFQ01BU2NyaXB0UGFyc2VyLk51bWVyaWNMaXRlcmFsQ29udGV4dClcbiAgICAgICAgdGhpcy5hc3NlcnROb2RlQ291bnQoY3R4LCAxKTtcbiAgICAgICAgY29uc3QgdmFsdWUgPSBjdHguZ2V0VGV4dCgpO1xuICAgICAgICAvLyBUT0RPIDogRmlndXJlIG91dCBiZXR0ZXIgd2F5XG4gICAgICAgIGNvbnN0IGxpdGVyYWwgPSBuZXcgTGl0ZXJhbChOdW1iZXIodmFsdWUpLCB2YWx1ZSk7XG4gICAgICAgIHJldHVybiB0aGlzLmRlY29yYXRlKGxpdGVyYWwsIHRoaXMuYXNNYXJrZXIodGhpcy5hc01ldGFkYXRhKGN0eC5nZXRTb3VyY2VJbnRlcnZhbCgpKSkpXG4gICAgfVxuXG4gICAgY3JlYXRlTGl0ZXJhbFZhbHVlKGN0eDogUnVsZUNvbnRleHQpOiBMaXRlcmFsIHtcbiAgICAgICAgY29uc29sZS5pbmZvKFwiY3JlYXRlTGl0ZXJhbFZhbHVlIFslc106IFslc11cIiwgY3R4LmdldENoaWxkQ291bnQoKSwgY3R4LmdldFRleHQoKSk7XG4gICAgICAgIGNvbnN0IHZhbHVlID0gY3R4LmdldFRleHQoKTtcbiAgICAgICAgY29uc3QgbGl0ZXJhbCA9IG5ldyBMaXRlcmFsKHZhbHVlLCB2YWx1ZSk7XG4gICAgICAgIHJldHVybiB0aGlzLmRlY29yYXRlKGxpdGVyYWwsIHRoaXMuYXNNYXJrZXIodGhpcy5hc01ldGFkYXRhKGN0eC5nZXRTb3VyY2VJbnRlcnZhbCgpKSkpXG4gICAgfVxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjaWRlbnRpZmllck5hbWUuXG4gICAgdmlzaXRJZGVudGlmaWVyTmFtZShjdHg6IFJ1bGVDb250ZXh0KTogSWRlbnRpZmllciB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0SWRlbnRpZmllck5hbWUgWyVzXTogWyVzXVwiLCBjdHguZ2V0Q2hpbGRDb3VudCgpLCBjdHguZ2V0VGV4dCgpKTtcbiAgICAgICAgdGhpcy5hc3NlcnRUeXBlKGN0eCwgRUNNQVNjcmlwdFBhcnNlci5JZGVudGlmaWVyTmFtZUNvbnRleHQpXG4gICAgICAgIHRoaXMuYXNzZXJ0Tm9kZUNvdW50KGN0eCwgMSk7XG4gICAgICAgIGNvbnN0IHZhbHVlID0gY3R4LmdldFRleHQoKTtcbiAgICAgICAgY29uc3QgaWRlbnRpZmllciA9IG5ldyBJZGVudGlmaWVyKHZhbHVlKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGVjb3JhdGUoaWRlbnRpZmllciwgdGhpcy5hc01hcmtlcih0aGlzLmFzTWV0YWRhdGEoY3R4LmdldFNvdXJjZUludGVydmFsKCkpKSlcbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNyZXNlcnZlZFdvcmQuXG4gICAgdmlzaXRSZXNlcnZlZFdvcmQoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJ2aXNpdFJlc2VydmVkV29yZDogXCIgKyBjdHguZ2V0VGV4dCgpKTtcbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNrZXl3b3JkLlxuICAgIHZpc2l0S2V5d29yZChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0S2V5d29yZDogXCIgKyBjdHguZ2V0VGV4dCgpKTtcblxuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjZnV0dXJlUmVzZXJ2ZWRXb3JkLlxuICAgIHZpc2l0RnV0dXJlUmVzZXJ2ZWRXb3JkKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNnZXR0ZXIuXG4gICAgdmlzaXRHZXR0ZXIoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgIH1cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNzZXR0ZXIuXG4gICAgdmlzaXRTZXR0ZXIoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2Vvcy5cbiAgICB2aXNpdEVvcyhjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIC8vY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNlb2YuXG4gICAgdmlzaXRFb2YoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgIH1cblxufSJdfQ==