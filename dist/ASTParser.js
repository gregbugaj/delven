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
    console.info(nodes.length);
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
  } // Visit a parse tree produced by ECMAScriptParser#functionBody.


  visitFunctionBody(ctx) {
    console.info("visitFunctionBody: " + ctx.getText());
  } // Visit a parse tree produced by ECMAScriptParser#arrayLiteral.


  visitArrayLiteral(ctx) {
    console.info("visitArrayLiteral [%s] : %s", ctx.getChildCount(), ctx.getText());
    this.assertType(ctx, _ECMAScriptParser.ECMAScriptParser.ArrayLiteralContext); // we just got `[]`

    throw new Error("visitArrayLiteral not implemented");

    if (ctx.getChildCount() == 2) {
      return [];
    }
    /* 
            let results = []
            // skip `[ and  ]` 
            for (let i = 1; i < ctx.getChildCount() - 1; ++i) {
                const node: RuleContext = ctx.getChild(i);
                let exp = [];
                if (node instanceof ECMAScriptParser.ElementListContext) {
                    exp = this.visitElementList(node);
                } else if (node instanceof ECMAScriptParser.ElisionContext) {
                    exp = this.visitElision(node);
                } else {
                    // special case for handling elision values like :  [11,,,11] ]  [,,]
                    if (node.symbol != undefined) {
                        exp = [null]
                    }
                    else {
                        this.throwInsanceError(this.dumpContext(node));
                    }
                }
                results = [...results, ...exp];
            }
            return results; */

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
  } // Visit a parse tree produced by ECMAScriptParser#formalParameterList.


  visitFormalParameterList(ctx) {
    this.log(ctx, _trace.default.frame());
    this.assertType(ctx, _ECMAScriptParser.ECMAScriptParser.FormalParameterListContext);
    const formal = [];

    for (let i = 0; i < ctx.getChildCount(); ++i) {
      const node = ctx.getChild(i);

      if (node instanceof _ECMAScriptParser.ECMAScriptParser.FormalParameterArgContext) {
        const parameter = this.visitFormalParameterArg(node);
        formal.push(parameter);
      }
    }

    return formal;
  } // Visit a parse tree produced by ECMAScriptParser#formalParameterArg.


  visitFormalParameterArg(ctx) {
    this.log(ctx, _trace.default.frame());
    this.assertType(ctx, _ECMAScriptParser.ECMAScriptParser.FormalParameterArgContext); //    constructor(left: BindingIdentifier | BindingPattern, right: Expression)

    const count = ctx.getChildCount();

    if (count != 1 && count != 3) {
      this.throwInsanceError(this.dumpContext(ctx));
    }

    const assignable = this.visitAssignable(ctx.getChild(0));
    console.info(assignable);
    /*
    =================================
    # FormalParameterArgContext
    * AssignableContext
        * IdentifierContext
    DelvenASTVisitor.visitFormalParameterArg [3] : x=2
    =================================
    # FormalParameterArgContext
    * AssignableContext
        * IdentifierContext
    * LiteralExpressionContext
        * LiteralContext
            * NumericLiteralContext
    DelvenASTVisitor.visitFormalParameterArg [1] : y
    =================================
     */

    return new _nodes.AssignmentPattern();
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
  } // Visit a parse tree produced by ECMAScriptParser#lastFormalParameterArg.


  visitLastFormalParameterArg(ctx) {
    this.log(ctx, _trace.default.frame());
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
  } // Visit a parse tree produced by ECMAScriptParser#FunctionExpression.


  visitFunctionExpression(ctx) {
    this.log(ctx, _trace.default.frame());
    this.assertType(ctx, _ECMAScriptParser.ECMAScriptParser.FunctionExpressionContext); //  (Extends singleExpression)? '{' classElement* '}'

    this.dumpContextAllChildren(ctx);
    let decl = this.visitFunctionDecl(ctx.getChild(0)); // const node = this.getNodeByType(ctx, ECMAScriptParser.ClassElementContext);

    console.info(decl);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9BU1RQYXJzZXIudHMiXSwibmFtZXMiOlsiUGFyc2VyVHlwZSIsIkFTVFBhcnNlciIsImNvbnN0cnVjdG9yIiwidmlzaXRvciIsIkRlbHZlbkFTVFZpc2l0b3IiLCJnZW5lcmF0ZSIsInNvdXJjZSIsImNvZGUiLCJ0eXBlIiwidmFsdWUiLCJmcyIsInJlYWRGaWxlU3luYyIsImNoYXJzIiwiYW50bHI0IiwiSW5wdXRTdHJlYW0iLCJsZXhlciIsIkRlbHZlbkxleGVyIiwidG9rZW5zIiwiQ29tbW9uVG9rZW5TdHJlYW0iLCJwYXJzZXIiLCJEZWx2ZW5QYXJzZXIiLCJ0cmVlIiwicHJvZ3JhbSIsImFjY2VwdCIsIlByaW50VmlzaXRvciIsImNvbnNvbGUiLCJpbmZvIiwicmVzdWx0IiwicGFyc2UiLCJFQ01BU2NyaXB0IiwiQVNUUGFyc2VyRGVmYXVsdCIsIkVycm9yIiwiRGVsdmVuVmlzaXRvciIsInJ1bGVUeXBlTWFwIiwiTWFwIiwic2V0dXBUeXBlUnVsZXMiLCJrZXlzIiwiT2JqZWN0IiwiZ2V0T3duUHJvcGVydHlOYW1lcyIsImtleSIsIm5hbWUiLCJzdGFydHNXaXRoIiwic2V0IiwicGFyc2VJbnQiLCJsb2ciLCJjdHgiLCJmcmFtZSIsImZ1bmN0aW9uIiwiZ2V0Q2hpbGRDb3VudCIsImdldFRleHQiLCJkdW1wQ29udGV4dCIsImNvbnRleHQiLCJlbmRzV2l0aCIsInB1c2giLCJsZW5ndGgiLCJjb250ZXh0TmFtZSIsImxvbmdlc3QiLCJvYmoiLCJFQ01BU2NyaXB0UGFyc2VyIiwiY2hhaW4iLCJwcm90b3R5cGUiLCJfX3Byb3RvX18iLCJkdW1wQ29udGV4dEFsbENoaWxkcmVuIiwiaW5kZW50IiwicGFkIiwicGFkU3RhcnQiLCJub2RlcyIsIm1hcmtlciIsImkiLCJjaGlsZCIsImdldENoaWxkIiwiZ2V0UnVsZUJ5SWQiLCJpZCIsImdldCIsImFzTWFya2VyIiwibWV0YWRhdGEiLCJpbmRleCIsImxpbmUiLCJjb2x1bW4iLCJkZWNvcmF0ZSIsIm5vZGUiLCJzdGFydCIsImVuZCIsImFzTWV0YWRhdGEiLCJpbnRlcnZhbCIsIm9mZnNldCIsInN0b3AiLCJ0aHJvd1R5cGVFcnJvciIsInR5cGVJZCIsIlR5cGVFcnJvciIsInRocm93SW5zYW5jZUVycm9yIiwiYXNzZXJ0VHlwZSIsInZpc2l0UHJvZ3JhbSIsIlRyYWNlIiwiUHJvZ3JhbUNvbnRleHQiLCJzdGF0ZW1lbnRzIiwic3RtIiwiU3RhdGVtZW50Q29udGV4dCIsInN0YXRlbWVudCIsInZpc2l0U3RhdGVtZW50IiwiZ2V0U291cmNlSW50ZXJ2YWwiLCJzY3JpcHQiLCJTY3JpcHQiLCJCbG9ja0NvbnRleHQiLCJ2aXNpdEJsb2NrIiwiVmFyaWFibGVTdGF0ZW1lbnRDb250ZXh0IiwidmlzaXRWYXJpYWJsZVN0YXRlbWVudCIsIkltcG9ydFN0YXRlbWVudENvbnRleHQiLCJ2aXNpdEltcG9ydFN0YXRlbWVudCIsIkV4cG9ydFN0YXRlbWVudENvbnRleHQiLCJ2aXNpdEV4cG9ydFN0YXRlbWVudCIsIkVtcHR5U3RhdGVtZW50Q29udGV4dCIsIkNsYXNzRGVjbGFyYXRpb25Db250ZXh0IiwidmlzaXRDbGFzc0RlY2xhcmF0aW9uIiwiRXhwcmVzc2lvblN0YXRlbWVudENvbnRleHQiLCJ2aXNpdEV4cHJlc3Npb25TdGF0ZW1lbnQiLCJJZlN0YXRlbWVudENvbnRleHQiLCJ2aXNpdElmU3RhdGVtZW50IiwiSXRlcmF0aW9uU3RhdGVtZW50Q29udGV4dCIsInZpc2l0SXRlcmF0aW9uU3RhdGVtZW50IiwiQ29udGludWVTdGF0ZW1lbnRDb250ZXh0IiwidmlzaXRDb250aW51ZVN0YXRlbWVudCIsIkJyZWFrU3RhdGVtZW50Q29udGV4dCIsInZpc2l0QnJlYWtTdGF0ZW1lbnQiLCJSZXR1cm5TdGF0ZW1lbnRDb250ZXh0IiwidmlzaXRSZXR1cm5TdGF0ZW1lbnQiLCJZaWVsZFN0YXRlbWVudENvbnRleHQiLCJ2aXNpdFlpZWxkU3RhdGVtZW50IiwiV2l0aFN0YXRlbWVudENvbnRleHQiLCJ2aXNpdFdpdGhTdGF0ZW1lbnQiLCJMYWJlbGxlZFN0YXRlbWVudENvbnRleHQiLCJ2aXNpdExhYmVsbGVkU3RhdGVtZW50IiwiU3dpdGNoU3RhdGVtZW50Q29udGV4dCIsInZpc2l0U3dpdGNoU3RhdGVtZW50IiwiRnVuY3Rpb25FeHByZXNzaW9uQ29udGV4dCIsInZpc2l0RnVuY3Rpb25FeHByZXNzaW9uIiwiVGhyb3dTdGF0ZW1lbnRDb250ZXh0IiwidmlzaXRUaHJvd1N0YXRlbWVudCIsIlRyeVN0YXRlbWVudENvbnRleHQiLCJ2aXNpdFRyeVN0YXRlbWVudCIsIkRlYnVnZ2VyU3RhdGVtZW50Q29udGV4dCIsInZpc2l0RGVidWdnZXJTdGF0ZW1lbnQiLCJGdW5jdGlvbkRlY2xhcmF0aW9uQ29udGV4dCIsInZpc2l0RnVuY3Rpb25EZWNsYXJhdGlvbiIsImJvZHkiLCJTdGF0ZW1lbnRMaXN0Q29udGV4dCIsInN0YXRlbWVudExpc3QiLCJ2aXNpdFN0YXRlbWVudExpc3QiLCJCbG9ja1N0YXRlbWVudCIsImZpbHRlclN5bWJvbHMiLCJnZXRUeXBlZFJ1bGVDb250ZXh0IiwiVmFyaWFibGVEZWNsYXJhdGlvbkxpc3RDb250ZXh0IiwidmlzaXRWYXJpYWJsZURlY2xhcmF0aW9uTGlzdCIsInZhck1vZGlmaWVyQ29udGV4dCIsIlZhck1vZGlmaWVyQ29udGV4dCIsInZhck1vZGlmaWVyIiwiZGVjbGFyYXRpb25zIiwiVmFyaWFibGVEZWNsYXJhdGlvbkNvbnRleHQiLCJ2aXNpdFZhcmlhYmxlRGVjbGFyYXRpb24iLCJWYXJpYWJsZURlY2xhcmF0aW9uIiwiYXNzaWduYWJsZUNvbnRleHQiLCJBc3NpZ25hYmxlQ29udGV4dCIsImFzc2lnbmFibGUiLCJ2aXNpdEFzc2lnbmFibGUiLCJpbml0Iiwic2luZ2xlRXhwcmVzc2lvbiIsIlZhcmlhYmxlRGVjbGFyYXRvciIsInZpc2l0SW5pdGlhbGlzZXIiLCJJbml0aWFsaXNlckNvbnRleHQiLCJhc3NlcnROb2RlQ291bnQiLCJPYmplY3RMaXRlcmFsRXhwcmVzc2lvbkNvbnRleHQiLCJ2aXNpdE9iamVjdExpdGVyYWxFeHByZXNzaW9uIiwiQXJyYXlMaXRlcmFsRXhwcmVzc2lvbkNvbnRleHQiLCJ2aXNpdEFycmF5TGl0ZXJhbEV4cHJlc3Npb24iLCJ2aXNpdEVtcHR5U3RhdGVtZW50IiwiY291bnQiLCJleHAiLCJFeHByZXNzaW9uU2VxdWVuY2VDb250ZXh0IiwidmlzaXRFeHByZXNzaW9uU2VxdWVuY2UiLCJ0ZXN0IiwiY29uc2VxdWVudCIsImFsdGVybmF0ZSIsInVuZGVmaW5lZCIsIklmU3RhdGVtZW50IiwidmlzaXREb1N0YXRlbWVudCIsInZpc2l0V2hpbGVTdGF0ZW1lbnQiLCJ2aXNpdEZvclN0YXRlbWVudCIsInZpc2l0Rm9yVmFyU3RhdGVtZW50IiwidHJhY2UiLCJ2aXNpdEZvckluU3RhdGVtZW50IiwidmlzaXRGb3JWYXJJblN0YXRlbWVudCIsInZpc2l0Q2FzZUJsb2NrIiwidmlzaXRDYXNlQ2xhdXNlcyIsInZpc2l0Q2FzZUNsYXVzZSIsInZpc2l0RGVmYXVsdENsYXVzZSIsInZpc2l0Q2F0Y2hQcm9kdWN0aW9uIiwidmlzaXRGaW5hbGx5UHJvZHVjdGlvbiIsImFzeW5jIiwiZ2VuZXJhdG9yIiwiaWRlbnRpZmllciIsInBhcmFtcyIsInN5bWJvbCIsInR4dCIsIklkZW50aWZpZXJDb250ZXh0IiwidmlzaXRJZGVudGlmaWVyIiwiRm9ybWFsUGFyYW1ldGVyTGlzdENvbnRleHQiLCJ2aXNpdEZvcm1hbFBhcmFtZXRlckxpc3QiLCJGdW5jdGlvbkJvZHlDb250ZXh0IiwiQXN5bmNGdW5jdGlvbkRlY2xhcmF0aW9uIiwiRnVuY3Rpb25EZWNsYXJhdGlvbiIsInBhcm1hcyIsInZpc2l0RnVuY3Rpb25EZWNsIiwiRnVuY3Rpb25EZWNsQ29udGV4dCIsInZpc2l0RnVuY3Rpb25Cb2R5IiwidmlzaXRBcnJheUxpdGVyYWwiLCJBcnJheUxpdGVyYWxDb250ZXh0IiwidmlzaXRFbGVtZW50TGlzdCIsIkVsZW1lbnRMaXN0Q29udGV4dCIsImVsZW1lbnRzIiwiZWxlbSIsInZpc2l0RWxpc2lvbiIsIkVsaXNpb25Db250ZXh0IiwiZWxpc2lvbiIsInZpc2l0T2JqZWN0TGl0ZXJhbCIsIk9iamVjdExpdGVyYWxDb250ZXh0IiwiT2JqZWN0RXhwcmVzc2lvbiIsInByb3BlcnRpZXMiLCJwcm9wZXJ0eSIsIlByb3BlcnR5RXhwcmVzc2lvbkFzc2lnbm1lbnRDb250ZXh0IiwidmlzaXRQcm9wZXJ0eUV4cHJlc3Npb25Bc3NpZ25tZW50IiwiUHJvcGVydHlTaG9ydGhhbmRDb250ZXh0IiwidmlzaXRQcm9wZXJ0eVNob3J0aGFuZCIsIkZ1bmN0aW9uUHJvcGVydHlDb250ZXh0IiwidmlzaXRGdW5jdGlvblByb3BlcnR5IiwiY29tcHV0ZWQiLCJtZXRob2QiLCJzaG9ydGhhbmQiLCJJZGVudGlmaWVyIiwiUHJvcGVydHkiLCJmaWx0ZXJlZCIsIm4wIiwibjEiLCJuMiIsInZpc2l0UHJvcGVydHlOYW1lIiwiQ29tcHV0ZWRQcm9wZXJ0eUV4cHJlc3Npb25Bc3NpZ25tZW50Q29udGV4dCIsIlByb3BlcnR5R2V0dGVyQ29udGV4dCIsIlByb3BlcnR5U2V0dGVyQ29udGV4dCIsInZpc2l0UHJvcGVydHlHZXR0ZXIiLCJ2aXNpdFByb3BlcnR5U2V0dGVyIiwiUHJvcGVydHlOYW1lQ29udGV4dCIsImNyZWF0ZUxpdGVyYWxWYWx1ZSIsInZpc2l0SWRlbnRpZmllck5hbWUiLCJ2aXNpdFByb3BlcnR5U2V0UGFyYW1ldGVyTGlzdCIsInZpc2l0QXJndW1lbnRzIiwidmlzaXRBcmd1bWVudExpc3QiLCJleHByZXNzaW9ucyIsIkV4cHJlc3Npb25TdGF0ZW1lbnQiLCJTZXF1ZW5jZUV4cHJlc3Npb24iLCJMaXRlcmFsRXhwcmVzc2lvbkNvbnRleHQiLCJ2aXNpdExpdGVyYWxFeHByZXNzaW9uIiwiQXNzaWdubWVudEV4cHJlc3Npb25Db250ZXh0IiwidmlzaXRBc3NpZ25tZW50RXhwcmVzc2lvbiIsIkFkZGl0aXZlRXhwcmVzc2lvbkNvbnRleHQiLCJ2aXNpdEFkZGl0aXZlRXhwcmVzc2lvbiIsIk11bHRpcGxpY2F0aXZlRXhwcmVzc2lvbkNvbnRleHQiLCJ2aXNpdE11bHRpcGxpY2F0aXZlRXhwcmVzc2lvbiIsIkVxdWFsaXR5RXhwcmVzc2lvbkNvbnRleHQiLCJ2aXNpdEVxdWFsaXR5RXhwcmVzc2lvbiIsIlBhcmVudGhlc2l6ZWRFeHByZXNzaW9uQ29udGV4dCIsInZpc2l0UGFyZW50aGVzaXplZEV4cHJlc3Npb24iLCJSZWxhdGlvbmFsRXhwcmVzc2lvbkNvbnRleHQiLCJ2aXNpdFJlbGF0aW9uYWxFeHByZXNzaW9uIiwiSWRlbnRpZmllckV4cHJlc3Npb25Db250ZXh0IiwidmlzaXRJZGVudGlmaWVyRXhwcmVzc2lvbiIsIk1lbWJlckRvdEV4cHJlc3Npb25Db250ZXh0IiwidmlzaXRNZW1iZXJEb3RFeHByZXNzaW9uIiwiTWVtYmVySW5kZXhFeHByZXNzaW9uQ29udGV4dCIsInZpc2l0TWVtYmVySW5kZXhFeHByZXNzaW9uIiwiQXNzaWdubWVudE9wZXJhdG9yRXhwcmVzc2lvbkNvbnRleHQiLCJ2aXNpdEFzc2lnbm1lbnRPcGVyYXRvckV4cHJlc3Npb24iLCJ2aXNpdENsYXNzVGFpbCIsImNsYXNzQm9keSIsIkNsYXNzQm9keSIsIkNsYXNzRGVjbGFyYXRpb24iLCJDbGFzc1RhaWxDb250ZXh0IiwiZ2V0Tm9kZUJ5VHlwZSIsIkNsYXNzRWxlbWVudENvbnRleHQiLCJ2aXNpdENsYXNzRWxlbWVudCIsInZpc2l0TWV0aG9kRGVmaW5pdGlvbiIsImZvcm1hbCIsIkZvcm1hbFBhcmFtZXRlckFyZ0NvbnRleHQiLCJwYXJhbWV0ZXIiLCJ2aXNpdEZvcm1hbFBhcmFtZXRlckFyZyIsIkFzc2lnbm1lbnRQYXR0ZXJuIiwidmlzaXRMYXN0Rm9ybWFsUGFyYW1ldGVyQXJnIiwidmlzaXRUZXJuYXJ5RXhwcmVzc2lvbiIsInZpc2l0TG9naWNhbEFuZEV4cHJlc3Npb24iLCJ2aXNpdFByZUluY3JlbWVudEV4cHJlc3Npb24iLCJ2aXNpdEluRXhwcmVzc2lvbiIsInZpc2l0TG9naWNhbE9yRXhwcmVzc2lvbiIsInZpc2l0Tm90RXhwcmVzc2lvbiIsInZpc2l0UHJlRGVjcmVhc2VFeHByZXNzaW9uIiwidmlzaXRBcmd1bWVudHNFeHByZXNzaW9uIiwidmlzaXRUaGlzRXhwcmVzc2lvbiIsImRlY2wiLCJ2aXNpdFVuYXJ5TWludXNFeHByZXNzaW9uIiwidmlzaXRQb3N0RGVjcmVhc2VFeHByZXNzaW9uIiwiaW5pdGlhbGlzZXIiLCJvcGVyYXRvciIsImV4cHJlc3Npb24iLCJsaHMiLCJyaHMiLCJBc3NpZ25tZW50RXhwcmVzc2lvbiIsInZpc2l0VHlwZW9mRXhwcmVzc2lvbiIsInZpc2l0SW5zdGFuY2VvZkV4cHJlc3Npb24iLCJ2aXNpdFVuYXJ5UGx1c0V4cHJlc3Npb24iLCJ2aXNpdERlbGV0ZUV4cHJlc3Npb24iLCJsZWZ0IiwicmlnaHQiLCJfdmlzaXRCaW5hcnlFeHByZXNzaW9uIiwiQmluYXJ5RXhwcmVzc2lvbiIsInZpc2l0Qml0WE9yRXhwcmVzc2lvbiIsInZpc2l0QmluYXJ5RXhwcmVzc2lvbiIsInZpc2l0Qml0U2hpZnRFeHByZXNzaW9uIiwidmlzaXRQb3N0SW5jcmVtZW50RXhwcmVzc2lvbiIsInZpc2l0Qml0Tm90RXhwcmVzc2lvbiIsInZpc2l0TmV3RXhwcmVzc2lvbiIsIkxpdGVyYWxDb250ZXh0IiwidmlzaXRMaXRlcmFsIiwiTnVtZXJpY0xpdGVyYWxDb250ZXh0IiwidmlzaXROdW1lcmljTGl0ZXJhbCIsIkFycmF5RXhwcmVzc2lvbiIsImV4cHIiLCJTdGF0aWNNZW1iZXJFeHByZXNzaW9uIiwicHJpbnQiLCJDb21wdXRlZE1lbWJlckV4cHJlc3Npb24iLCJ2aXNpdEJpdEFuZEV4cHJlc3Npb24iLCJ2aXNpdEJpdE9yRXhwcmVzc2lvbiIsInZpc2l0Vm9pZEV4cHJlc3Npb24iLCJ2aXNpdEFzc2lnbm1lbnRPcGVyYXRvciIsImxpdGVyYWwiLCJMaXRlcmFsIiwiTnVtYmVyIiwiSWRlbnRpZmllck5hbWVDb250ZXh0IiwidmlzaXRSZXNlcnZlZFdvcmQiLCJ2aXNpdEtleXdvcmQiLCJ2aXNpdEZ1dHVyZVJlc2VydmVkV29yZCIsInZpc2l0R2V0dGVyIiwidmlzaXRTZXR0ZXIiLCJ2aXNpdEVvcyIsInZpc2l0RW9mIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7O0FBQ0E7O0FBRUE7Ozs7Ozs7O0FBR0E7Ozs7Ozs7O0lBUVlBLFU7OztXQUFBQSxVO0FBQUFBLEVBQUFBLFUsQ0FBQUEsVTtHQUFBQSxVLDBCQUFBQSxVOztBQVlHLE1BQWVDLFNBQWYsQ0FBeUI7QUFHcENDLEVBQUFBLFdBQVcsQ0FBQ0MsT0FBRCxFQUE2QjtBQUNwQyxTQUFLQSxPQUFMLEdBQWVBLE9BQU8sSUFBSSxJQUFJQyxnQkFBSixFQUExQjtBQUNIOztBQUVEQyxFQUFBQSxRQUFRLENBQUNDLE1BQUQsRUFBOEI7QUFDbEMsUUFBSUMsSUFBSjs7QUFDQSxZQUFRRCxNQUFNLENBQUNFLElBQWY7QUFDSSxXQUFLLE1BQUw7QUFDSUQsUUFBQUEsSUFBSSxHQUFHRCxNQUFNLENBQUNHLEtBQWQ7QUFDQTs7QUFDSixXQUFLLFVBQUw7QUFDSUYsUUFBQUEsSUFBSSxHQUFHRyxFQUFFLENBQUNDLFlBQUgsQ0FBZ0JMLE1BQU0sQ0FBQ0csS0FBdkIsRUFBOEIsTUFBOUIsQ0FBUDtBQUNBO0FBTlI7O0FBU0EsUUFBSUcsS0FBSyxHQUFHLElBQUlDLE1BQU0sQ0FBQ0MsV0FBWCxDQUF1QlAsSUFBdkIsQ0FBWjtBQUNBLFFBQUlRLEtBQUssR0FBRyxJQUFJQyxnQ0FBSixDQUFnQkosS0FBaEIsQ0FBWjtBQUNBLFFBQUlLLE1BQU0sR0FBRyxJQUFJSixNQUFNLENBQUNLLGlCQUFYLENBQTZCSCxLQUE3QixDQUFiO0FBQ0EsUUFBSUksTUFBTSxHQUFHLElBQUlDLGtDQUFKLENBQWlCSCxNQUFqQixDQUFiO0FBQ0EsUUFBSUksSUFBSSxHQUFHRixNQUFNLENBQUNHLE9BQVAsRUFBWCxDQWZrQyxDQWdCbEM7O0FBQ0FELElBQUFBLElBQUksQ0FBQ0UsTUFB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QVksQ0FBQzVTLEdBQUQsRUFBbUI7QUFDM0JwQixJQUFBQSxPQUFPLENBQUNDLElBQVIsQ0FBYSxtQkFBbUJtQixHQUFHLENBQUNJLE9BQUosRUFBaEM7QUFFSCxHQXQ4QytDLENBeThDaEQ7OztBQUNBeVMsRUFBQUEsdUJBQXVCLENBQUM3UyxHQUFELEVBQW1CO0FBQ3RDcEIsSUFBQUEsT0FBTyxDQUFDbUssS0FBUixDQUFjLGlCQUFkO0FBQ0gsR0E1OEMrQyxDQTg4Q2hEOzs7QUFDQStKLEVBQUFBLFdBQVcsQ0FBQzlTLEdBQUQsRUFBbUI7QUFDMUJwQixJQUFBQSxPQUFPLENBQUNtSyxLQUFSLENBQWMsaUJBQWQ7QUFDSCxHQWo5QytDLENBazlDaEQ7OztBQUNBZ0ssRUFBQUEsV0FBVyxDQUFDL1MsR0FBRCxFQUFtQjtBQUMxQnBCLElBQUFBLE9BQU8sQ0FBQ21LLEtBQVIsQ0FBYyxpQkFBZDtBQUNILEdBcjlDK0MsQ0F1OUNoRDs7O0FBQ0FpSyxFQUFBQSxRQUFRLENBQUNoVCxHQUFELEVBQW1CLENBRTFCLENBRk8sQ0FDSjtBQUdKOzs7QUFDQWlULEVBQUFBLFFBQVEsQ0FBQ2pULEdBQUQsRUFBbUI7QUFDdkJwQixJQUFBQSxPQUFPLENBQUNtSyxLQUFSLENBQWMsaUJBQWQ7QUFDSDs7QUEvOUMrQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGFudGxyNCBmcm9tIFwiYW50bHI0XCJcbmltcG9ydCB7IEVDTUFTY3JpcHRQYXJzZXJWaXNpdG9yIGFzIERlbHZlblZpc2l0b3IgfSBmcm9tIFwiLi9wYXJzZXIvRUNNQVNjcmlwdFBhcnNlclZpc2l0b3JcIlxuaW1wb3J0IHsgRUNNQVNjcmlwdFBhcnNlciBhcyBEZWx2ZW5QYXJzZXIsIEVDTUFTY3JpcHRQYXJzZXIsIFByb2dyYW1Db250ZXh0IH0gZnJvbSBcIi4vcGFyc2VyL0VDTUFTY3JpcHRQYXJzZXJcIlxuaW1wb3J0IHsgRUNNQVNjcmlwdExleGVyIGFzIERlbHZlbkxleGVyIH0gZnJvbSBcIi4vcGFyc2VyL0VDTUFTY3JpcHRMZXhlclwiXG5pbXBvcnQgeyBSdWxlQ29udGV4dCB9IGZyb20gXCJhbnRscjQvUnVsZUNvbnRleHRcIlxuaW1wb3J0IHsgUHJpbnRWaXNpdG9yIH0gZnJvbSBcIi4vUHJpbnRWaXNpdG9yXCJcbmltcG9ydCBBU1ROb2RlIGZyb20gXCIuL0FTVE5vZGVcIjtcbmltcG9ydCB7IEV4cHJlc3Npb25TdGF0ZW1lbnQsIExpdGVyYWwsIFNjcmlwdCwgQmxvY2tTdGF0ZW1lbnQsIFN0YXRlbWVudCwgU2VxdWVuY2VFeHByZXNzaW9uLCBUaHJvd1N0YXRlbWVudCwgQXNzaWdubWVudEV4cHJlc3Npb24sIElkZW50aWZpZXIsIEJpbmFyeUV4cHJlc3Npb24sIEFycmF5RXhwcmVzc2lvbiwgT2JqZWN0RXhwcmVzc2lvbiwgT2JqZWN0RXhwcmVzc2lvblByb3BlcnR5LCBQcm9wZXJ0eSwgUHJvcGVydHlLZXksIFZhcmlhYmxlRGVjbGFyYXRpb24sIFZhcmlhYmxlRGVjbGFyYXRvciwgRXhwcmVzc2lvbiwgSWZTdGF0ZW1lbnQsIENvbXB1dGVkTWVtYmVyRXhwcmVzc2lvbiwgU3RhdGljTWVtYmVyRXhwcmVzc2lvbiwgQ2xhc3NEZWNsYXJhdGlvbiwgQ2xhc3NCb2R5LCBGdW5jdGlvbkRlY2xhcmF0aW9uLCBGdW5jdGlvblBhcmFtZXRlciwgQXN5bmNGdW5jdGlvbkRlY2xhcmF0aW9uLCBBc3NpZ25tZW50UGF0dGVybiwgQmluZGluZ1BhdHRlcm4sIEJpbmRpbmdJZGVudGlmaWVyIH0gZnJvbSBcIi4vbm9kZXNcIjtcbmltcG9ydCB7IFN5bnRheCB9IGZyb20gXCIuL3N5bnRheFwiO1xuaW1wb3J0IHsgdHlwZSB9IGZyb20gXCJvc1wiXG5pbXBvcnQgKiBhcyBmcyBmcm9tIFwiZnNcIlxuaW1wb3J0IHsgSW50ZXJ2YWwgfSBmcm9tIFwiYW50bHI0XCJcbmltcG9ydCBUcmFjZSwgeyBDYWxsU2l0ZSB9IGZyb20gXCIuL3RyYWNlXCJcblxuXG4vKipcbiAqIFZlcnNpb24gdGhhdCB3ZSBnZW5lcmF0ZSB0aGUgQVNUIGZvci4gXG4gKiBUaGlzIGFsbG93cyBmb3IgdGVzdGluZyBkaWZmZXJlbnQgaW1wbGVtZW50YXRpb25zXG4gKiBcbiAqIEN1cnJlbnRseSBvbmx5IEVDTUFTY3JpcHQgaXMgc3VwcG9ydGVkXG4gKiBcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9lc3RyZWUvZXN0cmVlXG4gKi9cbmV4cG9ydCBlbnVtIFBhcnNlclR5cGUgeyBFQ01BU2NyaXB0IH1cbmV4cG9ydCB0eXBlIFNvdXJjZVR5cGUgPSBcImNvZGVcIiB8IFwiZmlsZW5hbWVcIjtcbmV4cG9ydCB0eXBlIFNvdXJjZUNvZGUgPSB7XG4gICAgdHlwZTogU291cmNlVHlwZSxcbiAgICB2YWx1ZTogc3RyaW5nXG59XG5leHBvcnQgaW50ZXJmYWNlIE1hcmtlciB7XG4gICAgaW5kZXg6IG51bWJlcjtcbiAgICBsaW5lOiBudW1iZXI7XG4gICAgY29sdW1uOiBudW1iZXI7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGFic3RyYWN0IGNsYXNzIEFTVFBhcnNlciB7XG4gICAgcHJpdmF0ZSB2aXNpdG9yOiAodHlwZW9mIERlbHZlblZpc2l0b3IgfCBudWxsKVxuXG4gICAgY29uc3RydWN0b3IodmlzaXRvcj86IERlbHZlbkFTVFZpc2l0b3IpIHtcbiAgICAgICAgdGhpcy52aXNpdG9yID0gdmlzaXRvciB8fCBuZXcgRGVsdmVuQVNUVmlzaXRvcigpO1xuICAgIH1cblxuICAgIGdlbmVyYXRlKHNvdXJjZTogU291cmNlQ29kZSk6IEFTVE5vZGUge1xuICAgICAgICBsZXQgY29kZTtcbiAgICAgICAgc3dpdGNoIChzb3VyY2UudHlwZSkge1xuICAgICAgICAgICAgY2FzZSBcImNvZGVcIjpcbiAgICAgICAgICAgICAgICBjb2RlID0gc291cmNlLnZhbHVlO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcImZpbGVuYW1lXCI6XG4gICAgICAgICAgICAgICAgY29kZSA9IGZzLnJlYWRGaWxlU3luYyhzb3VyY2UudmFsdWUsIFwidXRmOFwiKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBjaGFycyA9IG5ldyBhbnRscjQuSW5wdXRTdHJlYW0oY29kZSk7XG4gICAgICAgIGxldCBsZXhlciA9IG5ldyBEZWx2ZW5MZXhlcihjaGFycyk7XG4gICAgICAgIGxldCB0b2tlbnMgPSBuZXcgYW50bHI0LkNvbW1vblRva2VuU3RyZWFtKGxleGVyKTtcbiAgICAgICAgbGV0IHBhcnNlciA9IG5ldyBEZWx2ZW5QYXJzZXIodG9rZW5zKTtcbiAgICAgICAgbGV0IHRyZWUgPSBwYXJzZXIucHJvZ3JhbSgpO1xuICAgICAgICAvLyBjb25zb2xlLmluZm8odHJlZS50b1N0cmluZ1RyZWUoKSlcbiAgICAgICAgdHJlZS5hY2NlcHQobmV3IFByaW50VmlzaXRvcigpKTtcbiAgICAgICAgY29uc29sZS5pbmZvKFwiLS0tLS0tLS0tLS0tLS0tLS0tLS0tXCIpO1xuICAgICAgICBsZXQgcmVzdWx0ID0gdHJlZS5hY2NlcHQodGhpcy52aXNpdG9yKTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBQYXJzZSBzb3VyY2UgYW5kIGdlbmVyZWF0ZSBBU1QgdHJlZVxuICAgICAqIEBwYXJhbSBzb3VyY2UgXG4gICAgICogQHBhcmFtIHR5cGUgXG4gICAgICovXG4gICAgc3RhdGljIHBhcnNlKHNvdXJjZTogU291cmNlQ29kZSwgdHlwZT86IFBhcnNlclR5cGUpOiBBU1ROb2RlIHtcbiAgICAgICAgaWYgKHR5cGUgPT0gbnVsbClcbiAgICAgICAgICAgIHR5cGUgPSBQYXJzZXJUeXBlLkVDTUFTY3JpcHQ7XG4gICAgICAgIGxldCBwYXJzZXI7XG4gICAgICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgICAgICAgY2FzZSBQYXJzZXJUeXBlLkVDTUFTY3JpcHQ6XG4gICAgICAgICAgICAgICAgcGFyc2VyID0gbmV3IEFTVFBhcnNlckRlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVW5rb3duIHBhcnNlciB0eXBlXCIpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBwYXJzZXIuZ2VuZXJhdGUoc291cmNlKVxuICAgIH1cbn1cblxuY2xhc3MgQVNUUGFyc2VyRGVmYXVsdCBleHRlbmRzIEFTVFBhcnNlciB7XG5cbn1cblxuZXhwb3J0IGNsYXNzIERlbHZlbkFTVFZpc2l0b3IgZXh0ZW5kcyBEZWx2ZW5WaXNpdG9yIHtcbiAgICBwcml2YXRlIHJ1bGVUeXBlTWFwOiBNYXA8bnVtYmVyLCBzdHJpbmc+ID0gbmV3IE1hcCgpO1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuc2V0dXBUeXBlUnVsZXMoKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHNldHVwVHlwZVJ1bGVzKCkge1xuICAgICAgICBjb25zdCBrZXlzID0gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoRGVsdmVuUGFyc2VyKTtcbiAgICAgICAgZm9yICh2YXIga2V5IGluIGtleXMpIHtcbiAgICAgICAgICAgIGxldCBuYW1lID0ga2V5c1trZXldO1xuICAgICAgICAgICAgaWYgKG5hbWUuc3RhcnRzV2l0aCgnUlVMRV8nKSkge1xuICAgICAgICAgICAgICAgIHRoaXMucnVsZVR5cGVNYXAuc2V0KHBhcnNlSW50KERlbHZlblBhcnNlcltuYW1lXSksIG5hbWUpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGxvZyhjdHg6IFJ1bGVDb250ZXh0LCBmcmFtZTogQ2FsbFNpdGUpIHtcbiAgICAgICAgY29uc29sZS5pbmZvKFwiJXMgWyVzXSA6ICVzXCIsIGZyYW1lLmZ1bmN0aW9uLCBjdHguZ2V0Q2hpbGRDb3VudCgpLCBjdHguZ2V0VGV4dCgpKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGR1bXBDb250ZXh0KGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc3Qga2V5cyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKERlbHZlblBhcnNlcik7XG4gICAgICAgIGxldCBjb250ZXh0ID0gW11cbiAgICAgICAgZm9yICh2YXIga2V5IGluIGtleXMpIHtcbiAgICAgICAgICAgIGxldCBuYW1lID0ga2V5c1trZXldO1xuICAgICAgICAgICAgLy8gdGhpcyBvbmx5IHRlc3QgaW5oZXJpdGFuY2VcbiAgICAgICAgICAgIGlmIChuYW1lLmVuZHNXaXRoKCdDb250ZXh0JykpIHtcbiAgICAgICAgICAgICAgICBpZiAoY3R4IGluc3RhbmNlb2YgRGVsdmVuUGFyc2VyW25hbWVdKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRleHQucHVzaChuYW1lKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBkaXJ5IGhhY2sgZm9yIHdhbGtpbmcgYW50bGVyIGRlcGVuY3kgY2hhaW4gXG4gICAgICAgIC8vIGZpbmQgbG9uZ2VzdCBkZXBlbmRlbmN5IGNoYWluZztcbiAgICAgICAgLy8gdGhpcyB0cmF2ZXJzYWwgaXMgc3BlY2lmaWMgdG8gQU5UTCBwYXJzZXJcbiAgICAgICAgLy8gV2Ugd2FudCB0byBiZSBhYmxlIHRvIGZpbmQgZGVwZW5kZW5jaWVzIHN1Y2ggYXM7XG4gICAgICAgIC8qXG4gICAgICAgICAgICAtLS0tLS0tLSAtLS0tLS0tLS0tLS1cbiAgICAgICAgICAgIFByb3BlcnR5RXhwcmVzc2lvbkFzc2lnbm1lbnRDb250ZXh0XG4gICAgICAgICAgICAqKiBQcm9wZXJ0eUFzc2lnbm1lbnRDb250ZXh0XG4gICAgICAgICAgICAqKiBQYXJzZXJSdWxlQ29udGV4dFxuICAgICAgICAgICAgLS0tLS0tLS0gLS0tLS0tLS0tLS0tXG4gICAgICAgICAgICBQcm9wZXJ0eUFzc2lnbm1lbnRDb250ZXh0XG4gICAgICAgICAgICAqKiBQYXJzZXJSdWxlQ29udGV4dFxuICAgICAgICAgKi9cbiAgICAgICAgaWYgKGNvbnRleHQubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgbGV0IGNvbnRleHROYW1lO1xuICAgICAgICAgICAgbGV0IGxvbmdlc3QgPSAwO1xuICAgICAgICAgICAgZm9yIChjb25zdCBrZXkgaW4gY29udGV4dCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IG5hbWUgPSBjb250ZXh0W2tleV07XG4gICAgICAgICAgICAgICAgbGV0IG9iaiA9IEVDTUFTY3JpcHRQYXJzZXJbbmFtZV07XG4gICAgICAgICAgICAgICAgbGV0IGNoYWluID0gMTtcbiAgICAgICAgICAgICAgICBkbyB7XG4gICAgICAgICAgICAgICAgICAgICsrY2hhaW47XG4gICAgICAgICAgICAgICAgICAgIG9iaiA9IEVDTUFTY3JpcHRQYXJzZXJbb2JqLnByb3RvdHlwZS5fX3Byb3RvX18uY29uc3RydWN0b3IubmFtZV07XG4gICAgICAgICAgICAgICAgfSB3aGlsZSAob2JqICYmIG9iai5wcm90b3R5cGUpXG4gICAgICAgICAgICAgICAgaWYgKGNoYWluID4gbG9uZ2VzdCkge1xuICAgICAgICAgICAgICAgICAgICBsb25nZXN0ID0gY2hhaW47XG4gICAgICAgICAgICAgICAgICAgIGNvbnRleHROYW1lID0gYCR7bmFtZX0gWyAqKiAke2NoYWlufV1gO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBbY29udGV4dE5hbWVdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjb250ZXh0O1xuICAgIH1cblxuICAgIHByaXZhdGUgZHVtcENvbnRleHRBbGxDaGlsZHJlbihjdHg6IFJ1bGVDb250ZXh0LCBpbmRlbnQgPSAwKSB7XG4gICAgICAgIGNvbnN0IHBhZCA9IFwiIFwiLnBhZFN0YXJ0KGluZGVudCwgXCJcXHRcIik7XG4gICAgICAgIGNvbnN0IG5vZGVzID0gdGhpcy5kdW1wQ29udGV4dChjdHgpO1xuICAgICAgICBpZiAobm9kZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgY29uc3QgbWFya2VyID0gaW5kZW50ID09IDAgPyBcIiAjIFwiIDogXCIgKiBcIjtcbiAgICAgICAgICAgIGNvbnNvbGUuaW5mbyhwYWQgKyBtYXJrZXIgKyBub2RlcylcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGN0eC5nZXRDaGlsZENvdW50KCk7ICsraSkge1xuICAgICAgICAgICAgbGV0IGNoaWxkID0gY3R4Py5nZXRDaGlsZChpKTtcbiAgICAgICAgICAgIGlmIChjaGlsZCkge1xuICAgICAgICAgICAgICAgIHRoaXMuZHVtcENvbnRleHRBbGxDaGlsZHJlbihjaGlsZCwgKytpbmRlbnQpO1xuICAgICAgICAgICAgICAgIC0taW5kZW50O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0IHJ1bGUgbmFtZSBieSB0aGUgSWRcbiAgICAgKiBAcGFyYW0gaWQgXG4gICAgICovXG4gICAgZ2V0UnVsZUJ5SWQoaWQ6IG51bWJlcik6IHN0cmluZyB8IHVuZGVmaW5lZCB7XG4gICAgICAgIHJldHVybiB0aGlzLnJ1bGVUeXBlTWFwLmdldChpZCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc01hcmtlcihtZXRhZGF0YTogYW55KSB7XG4gICAgICAgIHJldHVybiB7IGluZGV4OiAxLCBsaW5lOiAxLCBjb2x1bW46IDEgfVxuICAgIH1cblxuICAgIHByaXZhdGUgZGVjb3JhdGUobm9kZTogYW55LCBtYXJrZXI6IE1hcmtlcik6IGFueSB7XG4gICAgICAgIG5vZGUuc3RhcnQgPSAwO1xuICAgICAgICBub2RlLmVuZCA9IDA7XG4gICAgICAgIHJldHVybiBub2RlO1xuICAgIH1cblxuICAgIHByaXZhdGUgYXNNZXRhZGF0YShpbnRlcnZhbDogSW50ZXJ2YWwpOiBhbnkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgc3RhcnQ6IHtcbiAgICAgICAgICAgICAgICBsaW5lOiAxLFxuICAgICAgICAgICAgICAgIGNvbHVtbjogaW50ZXJ2YWwuc3RhcnQsXG4gICAgICAgICAgICAgICAgb2Zmc2V0OiAwXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZW5kOiB7XG4gICAgICAgICAgICAgICAgbGluZTogMSxcbiAgICAgICAgICAgICAgICBjb2x1bW46IGludGVydmFsLnN0b3AsXG4gICAgICAgICAgICAgICAgb2Zmc2V0OiAzXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIHRocm93VHlwZUVycm9yKHR5cGVJZDogYW55KSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJVbmhhbmRsZWQgdHlwZSA6IFwiICsgdHlwZUlkICsgXCIgOiBcIiArIHRoaXMuZ2V0UnVsZUJ5SWQodHlwZUlkKSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVGhyb3cgVHlwZUVycm9yIG9ubHkgd2hlbiB0aGVyZSBpcyBhIHR5cGUgcHJvdmlkZWQuIFxuICAgICAqIFRoaXMgaXMgdXNlZnVsbCB3aGVuIHRoZXJlIG5vZGUgaXRhIFRlcm1pbmFsTm9kZSBcbiAgICAgKiBAcGFyYW0gdHlwZSBcbiAgICAgKi9cbiAgICBwcml2YXRlIHRocm93SW5zYW5jZUVycm9yKHR5cGU6IGFueSk6IHZvaWQge1xuICAgICAgICAvKiAgICAgICAgIGlmICh0eXBlID09IHVuZGVmaW5lZCB8fCB0eXBlID09IFwiXCIpIHtcbiAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfSAqL1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiVW5oYW5kbGVkIGluc3RhbmNlIHR5cGUgOiBcIiArIHR5cGUpO1xuICAgIH1cblxuICAgIHByaXZhdGUgYXNzZXJ0VHlwZShjdHg6IFJ1bGVDb250ZXh0LCB0eXBlOiBhbnkpOiB2b2lkIHtcbiAgICAgICAgaWYgKCEoY3R4IGluc3RhbmNlb2YgdHlwZSkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJJbnZhbGlkIHR5cGUgZXhwZWN0ZWQgOiAnXCIgKyB0eXBlLm5hbWUgKyBcIicgcmVjZWl2ZWQgJ1wiICsgdGhpcy5kdW1wQ29udGV4dChjdHgpKSArIFwiJ1wiO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjcHJvZ3JhbS5cbiAgICB2aXNpdFByb2dyYW0oY3R4OiBSdWxlQ29udGV4dCk6IFNjcmlwdCB7XG4gICAgICAgIHRoaXMubG9nKGN0eCwgVHJhY2UuZnJhbWUoKSlcbiAgICAgICAgdGhpcy5hc3NlcnRUeXBlKGN0eCwgRUNNQVNjcmlwdFBhcnNlci5Qcm9ncmFtQ29udGV4dClcbiAgICAgICAgLy8gdmlzaXRQcm9ncmFtIC0+dmlzaXRTb3VyY2VFbGVtZW50cyAtPiB2aXNpdFNvdXJjZUVsZW1lbnQgLT4gdmlzaXRTdGF0ZW1lbnRcbiAgICAgICAgY29uc3Qgc3RhdGVtZW50cyA9IFtdO1xuICAgICAgICBjb25zdCBub2RlID0gY3R4LmdldENoaWxkKDApOyAgLy8gdmlzaXRQcm9ncmFtIC0+dmlzaXRTb3VyY2VFbGVtZW50cyBcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBub2RlLmdldENoaWxkQ291bnQoKTsgKytpKSB7XG4gICAgICAgICAgICBjb25zdCBzdG0gPSBub2RlLmdldENoaWxkKGkpLmdldENoaWxkKDApOyAvLyBTb3VyY2VFbGVtZW50c0NvbnRleHQgPiBTdGF0ZW1lbnRDb250ZXh0XG4gICAgICAgICAgICBpZiAoc3RtIGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5TdGF0ZW1lbnRDb250ZXh0KSB7XG4gICAgICAgICAgICAgICAgY29uc3Qgc3RhdGVtZW50ID0gdGhpcy52aXNpdFN0YXRlbWVudChzdG0pO1xuICAgICAgICAgICAgICAgIHN0YXRlbWVudHMucHVzaChzdGF0ZW1lbnQpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnRocm93SW5zYW5jZUVycm9yKHRoaXMuZHVtcENvbnRleHQoc3RtKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgaW50ZXJ2YWwgPSBjdHguZ2V0U291cmNlSW50ZXJ2YWwoKTtcbiAgICAgICAgY29uc3Qgc2NyaXB0ID0gbmV3IFNjcmlwdChzdGF0ZW1lbnRzKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGVjb3JhdGUoc2NyaXB0LCB0aGlzLmFzTWFya2VyKHRoaXMuYXNNZXRhZGF0YShpbnRlcnZhbCkpKTtcbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNzdGF0ZW1lbnQuXG4gICAgLyoqXG4gICAgICogc3RhdGVtZW50XG4gICAgICogICA6IGJsb2NrXG4gICAgICogICB8IHZhcmlhYmxlU3RhdGVtZW50XG4gICAgICogICB8IGltcG9ydFN0YXRlbWVudFxuICAgICAqICAgfCBleHBvcnRTdGF0ZW1lbnRcbiAgICAgKiAgIHwgZW1wdHlTdGF0ZW1lbnRcbiAgICAgKiAgIHwgY2xhc3NEZWNsYXJhdGlvblxuICAgICAqICAgfCBleHByZXNzaW9uU3RhdGVtZW50XG4gICAgICogICB8IGlmU3RhdGVtZW50XG4gICAgICogICB8IGl0ZXJhdGlvblN0YXRlbWVudFxuICAgICAqICAgfCBjb250aW51ZVN0YXRlbWVudFxuICAgICAqICAgfCBicmVha1N0YXRlbWVudFxuICAgICAqICAgfCByZXR1cm5TdGF0ZW1lbnRcbiAgICAgKiAgIHwgeWllbGRTdGF0ZW1lbnRcbiAgICAgKiAgIHwgd2l0aFN0YXRlbWVudFxuICAgICAqICAgfCBsYWJlbGxlZFN0YXRlbWVudFxuICAgICAqICAgfCBzd2l0Y2hTdGF0ZW1lbnRcbiAgICAgKiAgIHwgdGhyb3dTdGF0ZW1lbnRcbiAgICAgKiAgIHwgdHJ5U3RhdGVtZW50XG4gICAgICogICB8IGRlYnVnZ2VyU3RhdGVtZW50XG4gICAgICogICB8IGZ1bmN0aW9uRGVjbGFyYXRpb25cbiAgICAgKiAgIDtcbiAgICAgKiBAcGFyYW0gY3R4IFxuICAgICAqL1xuICAgIHZpc2l0U3RhdGVtZW50KGN0eDogUnVsZUNvbnRleHQpOiBhbnkge1xuICAgICAgICB0aGlzLmxvZyhjdHgsIFRyYWNlLmZyYW1lKCkpXG4gICAgICAgIHRoaXMuYXNzZXJ0VHlwZShjdHgsIEVDTUFTY3JpcHRQYXJzZXIuU3RhdGVtZW50Q29udGV4dClcbiAgICAgICAgY29uc3Qgbm9kZTogUnVsZUNvbnRleHQgPSBjdHguZ2V0Q2hpbGQoMCk7XG4gICAgICAgIGlmIChub2RlIGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5CbG9ja0NvbnRleHQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnZpc2l0QmxvY2sobm9kZSk7XG4gICAgICAgIH0gZWxzZSBpZiAobm9kZSBpbnN0YW5jZW9mIEVDTUFTY3JpcHRQYXJzZXIuVmFyaWFibGVTdGF0ZW1lbnRDb250ZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy52aXNpdFZhcmlhYmxlU3RhdGVtZW50KG5vZGUpO1xuICAgICAgICB9IGVsc2UgaWYgKG5vZGUgaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLkltcG9ydFN0YXRlbWVudENvbnRleHQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnZpc2l0SW1wb3J0U3RhdGVtZW50KG5vZGUpO1xuICAgICAgICB9IGVsc2UgaWYgKG5vZGUgaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLkV4cG9ydFN0YXRlbWVudENvbnRleHQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnZpc2l0RXhwb3J0U3RhdGVtZW50KG5vZGUpO1xuICAgICAgICB9IGVsc2UgaWYgKG5vZGUgaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLkVtcHR5U3RhdGVtZW50Q29udGV4dCkge1xuICAgICAgICAgICAgLy8gTk9PUCxcbiAgICAgICAgfSBlbHNlIGlmIChub2RlIGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5DbGFzc0RlY2xhcmF0aW9uQ29udGV4dCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmlzaXRDbGFzc0RlY2xhcmF0aW9uKG5vZGUpO1xuICAgICAgICB9IGVsc2UgaWYgKG5vZGUgaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLkV4cHJlc3Npb25TdGF0ZW1lbnRDb250ZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy52aXNpdEV4cHJlc3Npb25TdGF0ZW1lbnQobm9kZSk7XG4gICAgICAgIH0gZWxzZSBpZiAobm9kZSBpbnN0YW5jZW9mIEVDTUFTY3JpcHRQYXJzZXIuSWZTdGF0ZW1lbnRDb250ZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy52aXNpdElmU3RhdGVtZW50KG5vZGUpO1xuICAgICAgICB9IGVsc2UgaWYgKG5vZGUgaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLkl0ZXJhdGlvblN0YXRlbWVudENvbnRleHQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnZpc2l0SXRlcmF0aW9uU3RhdGVtZW50KG5vZGUpO1xuICAgICAgICB9IGVsc2UgaWYgKG5vZGUgaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLkNvbnRpbnVlU3RhdGVtZW50Q29udGV4dCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmlzaXRDb250aW51ZVN0YXRlbWVudChub2RlKTtcbiAgICAgICAgfSBlbHNlIGlmIChub2RlIGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5CcmVha1N0YXRlbWVudENvbnRleHQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnZpc2l0QnJlYWtTdGF0ZW1lbnQobm9kZSk7XG4gICAgICAgIH0gZWxzZSBpZiAobm9kZSBpbnN0YW5jZW9mIEVDTUFTY3JpcHRQYXJzZXIuUmV0dXJuU3RhdGVtZW50Q29udGV4dCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmlzaXRSZXR1cm5TdGF0ZW1lbnQobm9kZSk7XG4gICAgICAgIH0gZWxzZSBpZiAobm9kZSBpbnN0YW5jZW9mIEVDTUFTY3JpcHRQYXJzZXIuWWllbGRTdGF0ZW1lbnRDb250ZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy52aXNpdFlpZWxkU3RhdGVtZW50KG5vZGUpO1xuICAgICAgICB9IGVsc2UgaWYgKG5vZGUgaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLldpdGhTdGF0ZW1lbnRDb250ZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy52aXNpdFdpdGhTdGF0ZW1lbnQobm9kZSk7XG4gICAgICAgIH0gZWxzZSBpZiAobm9kZSBpbnN0YW5jZW9mIEVDTUFTY3JpcHRQYXJzZXIuTGFiZWxsZWRTdGF0ZW1lbnRDb250ZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy52aXNpdExhYmVsbGVkU3RhdGVtZW50KG5vZGUpO1xuICAgICAgICB9IGVsc2UgaWYgKG5vZGUgaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLlN3aXRjaFN0YXRlbWVudENvbnRleHQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnZpc2l0U3dpdGNoU3RhdGVtZW50KG5vZGUpO1xuICAgICAgICB9IGVsc2UgaWYgKG5vZGUgaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLkZ1bmN0aW9uRXhwcmVzc2lvbkNvbnRleHQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnZpc2l0RnVuY3Rpb25FeHByZXNzaW9uKG5vZGUpO1xuICAgICAgICB9IGVsc2UgaWYgKG5vZGUgaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLlRocm93U3RhdGVtZW50Q29udGV4dCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmlzaXRUaHJvd1N0YXRlbWVudChub2RlKTtcbiAgICAgICAgfSBlbHNlIGlmIChub2RlIGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5UcnlTdGF0ZW1lbnRDb250ZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy52aXNpdFRyeVN0YXRlbWVudChub2RlKTtcbiAgICAgICAgfSBlbHNlIGlmIChub2RlIGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5EZWJ1Z2dlclN0YXRlbWVudENvbnRleHQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnZpc2l0RGVidWdnZXJTdGF0ZW1lbnQobm9kZSk7XG4gICAgICAgIH0gZWxzZSBpZiAobm9kZSBpbnN0YW5jZW9mIEVDTUFTY3JpcHRQYXJzZXIuRnVuY3Rpb25EZWNsYXJhdGlvbkNvbnRleHQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnZpc2l0RnVuY3Rpb25EZWNsYXJhdGlvbihub2RlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMudGhyb3dJbnNhbmNlRXJyb3IodGhpcy5kdW1wQ29udGV4dChub2RlKSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB2aXNpdEltcG9ydFN0YXRlbWVudChjdHg6IFJ1bGVDb250ZXh0KTogYW55IHtcbiAgICAgICAgdGhpcy5sb2coY3R4LCBUcmFjZS5mcmFtZSgpKVxuICAgICAgICB0aGlzLmFzc2VydFR5cGUoY3R4LCBFQ01BU2NyaXB0UGFyc2VyLkltcG9ydFN0YXRlbWVudENvbnRleHQpXG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJub3QgaW1wbGVtZW50ZWRcIik7XG4gICAgfVxuXG4gICAgdmlzaXRFeHBvcnRTdGF0ZW1lbnQoY3R4OiBSdWxlQ29udGV4dCk6IGFueSB7XG4gICAgICAgIHRoaXMubG9nKGN0eCwgVHJhY2UuZnJhbWUoKSlcbiAgICAgICAgdGhpcy5hc3NlcnRUeXBlKGN0eCwgRUNNQVNjcmlwdFBhcnNlci5FeHBvcnRTdGF0ZW1lbnRDb250ZXh0KVxuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwibm90IGltcGxlbWVudGVkXCIpO1xuICAgIH1cblxuICAgIHZpc2l0SXRlcmF0aW9uU3RhdGVtZW50KGN0eDogUnVsZUNvbnRleHQpOiBhbnkge1xuICAgICAgICB0aGlzLmxvZyhjdHgsIFRyYWNlLmZyYW1lKCkpXG4gICAgICAgIHRoaXMuYXNzZXJ0VHlwZShjdHgsIEVDTUFTY3JpcHRQYXJzZXIuSXRlcmF0aW9uU3RhdGVtZW50Q29udGV4dClcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIm5vdCBpbXBsZW1lbnRlZFwiKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNibG9jay5cbiAgICAgKiAvLy8gQmxvY2sgOlxuICAgICAqIC8vLyAgICAgeyBTdGF0ZW1lbnRMaXN0PyB9XG4gICAgICovXG4gICAgdmlzaXRCbG9jayhjdHg6IFJ1bGVDb250ZXh0KTogQmxvY2tTdGF0ZW1lbnQge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJ2aXNpdEJsb2NrIFslc10gOiAlc1wiLCBjdHguZ2V0Q2hpbGRDb3VudCgpLCBjdHguZ2V0VGV4dCgpKTtcbiAgICAgICAgdGhpcy5hc3NlcnRUeXBlKGN0eCwgRUNNQVNjcmlwdFBhcnNlci5CbG9ja0NvbnRleHQpXG4gICAgICAgIGNvbnN0IGJvZHkgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPCBjdHguZ2V0Q2hpbGRDb3VudCgpIC0gMTsgKytpKSB7XG4gICAgICAgICAgICBjb25zdCBub2RlOiBSdWxlQ29udGV4dCA9IGN0eC5nZXRDaGlsZChpKTtcbiAgICAgICAgICAgIGlmIChub2RlIGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5TdGF0ZW1lbnRMaXN0Q29udGV4dCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHN0YXRlbWVudExpc3QgPSB0aGlzLnZpc2l0U3RhdGVtZW50TGlzdChub2RlKTtcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGluZGV4IGluIHN0YXRlbWVudExpc3QpIHtcbiAgICAgICAgICAgICAgICAgICAgYm9keS5wdXNoKHN0YXRlbWVudExpc3RbaW5kZXhdKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMudGhyb3dJbnNhbmNlRXJyb3IodGhpcy5kdW1wQ29udGV4dChub2RlKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcy5kZWNvcmF0ZShuZXcgQmxvY2tTdGF0ZW1lbnQoYm9keSksIHRoaXMuYXNNYXJrZXIodGhpcy5hc01ldGFkYXRhKGN0eC5nZXRTb3VyY2VJbnRlcnZhbCgpKSkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI3N0YXRlbWVudExpc3QuXG4gICAgICogIHN0YXRlbWVudExpc3RcbiAgICAgKiAgICA6IHN0YXRlbWVudCtcbiAgICAgKiAgICA7XG4gICAgICogQHBhcmFtIGN0eCBcbiAgICAgKi9cbiAgICB2aXNpdFN0YXRlbWVudExpc3QoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICB0aGlzLmxvZyhjdHgsIFRyYWNlLmZyYW1lKCkpXG4gICAgICAgIHRoaXMuYXNzZXJ0VHlwZShjdHgsIEVDTUFTY3JpcHRQYXJzZXIuU3RhdGVtZW50TGlzdENvbnRleHQpXG4gICAgICAgIGNvbnN0IG5vZGVzID0gdGhpcy5maWx0ZXJTeW1ib2xzKGN0eCk7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhub2Rlcy5sZW5ndGgpXG4gICAgICAgIGNvbnN0IGJvZHkgPSBbXTtcbiAgICAgICAgZm9yIChjb25zdCBub2RlIG9mIG5vZGVzKSB7XG4gICAgICAgICAgICBpZiAobm9kZSBpbnN0YW5jZW9mIEVDTUFTY3JpcHRQYXJzZXIuU3RhdGVtZW50Q29udGV4dCkge1xuICAgICAgICAgICAgICAgIGJvZHkucHVzaCh0aGlzLnZpc2l0U3RhdGVtZW50KG5vZGUpKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy50aHJvd1R5cGVFcnJvcih0eXBlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYm9keTtcbiAgICB9XG5cblxuICAgIHZpc2l0VmFyaWFibGVTdGF0ZW1lbnQoY3R4OiBSdWxlQ29udGV4dCk6IFZhcmlhYmxlRGVjbGFyYXRpb24ge1xuICAgICAgICB0aGlzLmxvZyhjdHgsIFRyYWNlLmZyYW1lKCkpO1xuICAgICAgICB0aGlzLmFzc2VydFR5cGUoY3R4LCBFQ01BU2NyaXB0UGFyc2VyLlZhcmlhYmxlU3RhdGVtZW50Q29udGV4dClcbiAgICAgICAgY29uc3Qgbm9kZSA9IHRoaXMuZ2V0VHlwZWRSdWxlQ29udGV4dChjdHgsIEVDTUFTY3JpcHRQYXJzZXIuVmFyaWFibGVEZWNsYXJhdGlvbkxpc3RDb250ZXh0KTtcbiAgICAgICAgcmV0dXJuIHRoaXMudmlzaXRWYXJpYWJsZURlY2xhcmF0aW9uTGlzdChub2RlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXQgdGhlIHR5cGUgcnVsZSBjb250ZXh0XG4gICAgICogRXhhbXBsZVxuICAgICAqIDxjb2RlPlxuICAgICAqICAgY29uc3Qgbm9kZSA9IHRoaXMuZ2V0VHlwZWRSdWxlQ29udGV4dChjdHgsIEVDTUFTY3JpcHRQYXJzZXIuVmFyaWFibGVEZWNsYXJhdGlvbkxpc3RDb250ZXh0KTtcbiAgICAgKiA8L2NvZGU+XG4gICAgICogQHBhcmFtIGN0eCBcbiAgICAgKiBAcGFyYW0gdHlwZSBcbiAgICAgKiBAcGFyYW0gaW5kZXggXG4gICAgICovXG4gICAgcHJpdmF0ZSBnZXRUeXBlZFJ1bGVDb250ZXh0KGN0eDogUnVsZUNvbnRleHQsIHR5cGU6IGFueSwgaW5kZXggPSAwKTogYW55IHtcbiAgICAgICAgcmV0dXJuIGN0eC5nZXRUeXBlZFJ1bGVDb250ZXh0KHR5cGUsIGluZGV4KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiA8cHJlPlxuICAgICAqIHZhcmlhYmxlRGVjbGFyYXRpb25MaXN0XG4gICAgICogICA6IHZhck1vZGlmaWVyIHZhcmlhYmxlRGVjbGFyYXRpb24gKCcsJyB2YXJpYWJsZURlY2xhcmF0aW9uKSpcbiAgICAgKiAgIDtcbiAgICAgKiA8L3ByZT5cbiAgICAgKiBAcGFyYW0gY3R4IFxuICAgICAqL1xuICAgIHZpc2l0VmFyaWFibGVEZWNsYXJhdGlvbkxpc3QoY3R4OiBSdWxlQ29udGV4dCk6IFZhcmlhYmxlRGVjbGFyYXRpb24ge1xuICAgICAgICB0aGlzLmxvZyhjdHgsIFRyYWNlLmZyYW1lKCkpO1xuICAgICAgICB0aGlzLmFzc2VydFR5cGUoY3R4LCBFQ01BU2NyaXB0UGFyc2VyLlZhcmlhYmxlRGVjbGFyYXRpb25MaXN0Q29udGV4dClcbiAgICAgICAgY29uc3QgdmFyTW9kaWZpZXJDb250ZXh0ID0gdGhpcy5nZXRUeXBlZFJ1bGVDb250ZXh0KGN0eCwgRUNNQVNjcmlwdFBhcnNlci5WYXJNb2RpZmllckNvbnRleHQsIDApO1xuICAgICAgICBjb25zdCB2YXJNb2RpZmllciA9IHZhck1vZGlmaWVyQ29udGV4dC5nZXRUZXh0KCk7XG4gICAgICAgIGNvbnN0IGRlY2xhcmF0aW9uczogVmFyaWFibGVEZWNsYXJhdG9yW10gPSBbXTtcbiAgICAgICAgZm9yIChjb25zdCBub2RlIG9mIHRoaXMuZmlsdGVyU3ltYm9scyhjdHgpKSB7XG4gICAgICAgICAgICBpZiAobm9kZSBpbnN0YW5jZW9mIEVDTUFTY3JpcHRQYXJzZXIuVmFyaWFibGVEZWNsYXJhdGlvbkNvbnRleHQpIHtcbiAgICAgICAgICAgICAgICBkZWNsYXJhdGlvbnMucHVzaCh0aGlzLnZpc2l0VmFyaWFibGVEZWNsYXJhdGlvbihub2RlKSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3IFZhcmlhYmxlRGVjbGFyYXRpb24oZGVjbGFyYXRpb25zLCB2YXJNb2RpZmllcik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI3ZhcmlhYmxlRGVjbGFyYXRpb24uXG4gICAgICogIHZhcmlhYmxlRGVjbGFyYXRpb25cbiAgICAgKiAgICA6IGFzc2lnbmFibGUgKCc9JyBzaW5nbGVFeHByZXNzaW9uKT8gLy8gRUNNQVNjcmlwdCA2OiBBcnJheSAmIE9iamVjdCBNYXRjaGluZ1xuICAgICAqICAgIDtcbiAgICAgKiBAcGFyYW0gY3R4IFZhcmlhYmxlRGVjbGFyYXRpb25Db250ZXh0XG4gICAgICovXG4gICAgLy8gXG4gICAgdmlzaXRWYXJpYWJsZURlY2xhcmF0aW9uKGN0eDogUnVsZUNvbnRleHQpOiBWYXJpYWJsZURlY2xhcmF0b3Ige1xuICAgICAgICB0aGlzLmxvZyhjdHgsIFRyYWNlLmZyYW1lKCkpXG4gICAgICAgIHRoaXMuYXNzZXJ0VHlwZShjdHgsIEVDTUFTY3JpcHRQYXJzZXIuVmFyaWFibGVEZWNsYXJhdGlvbkNvbnRleHQpXG4gICAgICAgIGNvbnN0IGFzc2lnbmFibGVDb250ZXh0ID0gdGhpcy5nZXRUeXBlZFJ1bGVDb250ZXh0KGN0eCwgRUNNQVNjcmlwdFBhcnNlci5Bc3NpZ25hYmxlQ29udGV4dCwgMCk7XG4gICAgICAgIGNvbnN0IGFzc2lnbmFibGUgPSB0aGlzLnZpc2l0QXNzaWduYWJsZShhc3NpZ25hYmxlQ29udGV4dCk7XG4gICAgICAgIC8vIGNvbnNvbGUuaW5mbyhhc3NpZ25hYmxlKVxuICAgICAgICBsZXQgaW5pdCA9IG51bGw7XG4gICAgICAgIGlmIChjdHguZ2V0Q2hpbGRDb3VudCgpID09IDMpIHtcbiAgICAgICAgICAgIGluaXQgPSB0aGlzLnNpbmdsZUV4cHJlc3Npb24oY3R4LmdldENoaWxkKDIpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3IFZhcmlhYmxlRGVjbGFyYXRvcihhc3NpZ25hYmxlLCBpbml0KTtcbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNpbml0aWFsaXNlci5cbiAgICB2aXNpdEluaXRpYWxpc2VyKGN0eDogUnVsZUNvbnRleHQpOiBPYmplY3RFeHByZXNzaW9uIHwgQXJyYXlFeHByZXNzaW9uIHwgdW5kZWZpbmVkIHtcbiAgICAgICAgY29uc29sZS5pbmZvKFwidmlzaXRJbml0aWFsaXNlciBbJXNdIDogJXNcIiwgY3R4LmdldENoaWxkQ291bnQoKSwgY3R4LmdldFRleHQoKSk7XG4gICAgICAgIHRoaXMuYXNzZXJ0VHlwZShjdHgsIEVDTUFTY3JpcHRQYXJzZXIuSW5pdGlhbGlzZXJDb250ZXh0KVxuICAgICAgICB0aGlzLmFzc2VydE5vZGVDb3VudChjdHgsIDIpO1xuICAgICAgICBjb25zdCBub2RlOiBSdWxlQ29udGV4dCA9IGN0eC5nZXRDaGlsZCgxKTtcblxuICAgICAgICBpZiAobm9kZSBpbnN0YW5jZW9mIEVDTUFTY3JpcHRQYXJzZXIuT2JqZWN0TGl0ZXJhbEV4cHJlc3Npb25Db250ZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy52aXNpdE9iamVjdExpdGVyYWxFeHByZXNzaW9uKG5vZGUpO1xuICAgICAgICB9IGVsc2UgaWYgKG5vZGUgaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLkFycmF5TGl0ZXJhbEV4cHJlc3Npb25Db250ZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy52aXNpdEFycmF5TGl0ZXJhbEV4cHJlc3Npb24obm9kZSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy50aHJvd0luc2FuY2VFcnJvcih0aGlzLmR1bXBDb250ZXh0KG5vZGUpKVxuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2VtcHR5U3RhdGVtZW50LlxuICAgIHZpc2l0RW1wdHlTdGF0ZW1lbnQoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICB0aGlzLmxvZyhjdHgsIFRyYWNlLmZyYW1lKCkpXG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc3NlcnROb2RlQ291bnQoY3R4OiBSdWxlQ29udGV4dCwgY291bnQ6IG51bWJlcikge1xuICAgICAgICBpZiAoY3R4LmdldENoaWxkQ291bnQoKSAhPSBjb3VudCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiV3JvbmcgY2hpbGQgY291bnQsIGV4cGVjdGVkICdcIiArIGNvdW50ICsgXCInIGdvdCA6IFwiICsgY3R4LmdldENoaWxkQ291bnQoKSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNleHByZXNzaW9uU3RhdGVtZW50LlxuICAgICAqIFxuICAgICAqIGV4cHJlc3Npb25TdGF0ZW1lbnRcbiAgICAgKiAgOiB7dGhpcy5ub3RPcGVuQnJhY2VBbmROb3RGdW5jdGlvbigpfT8gZXhwcmVzc2lvblNlcXVlbmNlIGVvc1xuICAgICAqICA7XG4gICAgICogQHBhcmFtIGN0eCBcbiAgICAgKi9cbiAgICB2aXNpdEV4cHJlc3Npb25TdGF0ZW1lbnQoY3R4OiBSdWxlQ29udGV4dCk6IEV4cHJlc3Npb25TdGF0ZW1lbnQgfCB1bmRlZmluZWQge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJ2aXNpdEV4cHJlc3Npb25TdGF0ZW1lbnQgWyVzXSA6ICVzXCIsIGN0eC5nZXRDaGlsZENvdW50KCksIGN0eC5nZXRUZXh0KCkpO1xuICAgICAgICB0aGlzLmFzc2VydFR5cGUoY3R4LCBFQ01BU2NyaXB0UGFyc2VyLkV4cHJlc3Npb25TdGF0ZW1lbnRDb250ZXh0KVxuICAgICAgICAvLyB2aXNpdEV4cHJlc3Npb25TdGF0ZW1lbnQ6PnZpc2l0RXhwcmVzc2lvblNlcXVlbmNlXG4gICAgICAgIGNvbnN0IG5vZGU6IFJ1bGVDb250ZXh0ID0gY3R4LmdldENoaWxkKDApOyAvLyB2aXNpdEV4cHJlc3Npb25TZXF1ZW5jZSBcbiAgICAgICAgbGV0IGV4cFxuICAgICAgICBpZiAobm9kZSBpbnN0YW5jZW9mIEVDTUFTY3JpcHRQYXJzZXIuRXhwcmVzc2lvblNlcXVlbmNlQ29udGV4dCkge1xuICAgICAgICAgICAgZXhwID0gdGhpcy52aXNpdEV4cHJlc3Npb25TZXF1ZW5jZShub2RlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMudGhyb3dJbnNhbmNlRXJyb3IodGhpcy5kdW1wQ29udGV4dChub2RlKSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZXhwIC8vdGhpcy5kZWNvcmF0ZShleHAsIHRoaXMuYXNNYXJrZXIodGhpcy5hc01ldGFkYXRhKGN0eC5nZXRTb3VyY2VJbnRlcnZhbCgpKSkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogaWZTdGF0ZW1lbnRcbiAgICAgKiAgIDogSWYgJygnIGV4cHJlc3Npb25TZXF1ZW5jZSAnKScgc3RhdGVtZW50ICggRWxzZSBzdGF0ZW1lbnQgKT9cbiAgICAgKiAgIDtcbiAgICAgKi9cbiAgICB2aXNpdElmU3RhdGVtZW50KGN0eDogUnVsZUNvbnRleHQpOiBJZlN0YXRlbWVudCB7XG4gICAgICAgIHRoaXMubG9nKGN0eCwgVHJhY2UuZnJhbWUoKSlcbiAgICAgICAgdGhpcy5hc3NlcnRUeXBlKGN0eCwgRUNNQVNjcmlwdFBhcnNlci5JZlN0YXRlbWVudENvbnRleHQpXG4gICAgICAgIGNvbnN0IGNvdW50ID0gY3R4LmdldENoaWxkQ291bnQoKTtcbiAgICAgICAgY29uc3QgdGVzdCA9IHRoaXMudmlzaXRFeHByZXNzaW9uU2VxdWVuY2UoY3R4LmdldENoaWxkKDIpKTtcbiAgICAgICAgY29uc3QgY29uc2VxdWVudCA9IHRoaXMudmlzaXRTdGF0ZW1lbnQoY3R4LmdldENoaWxkKDQpKTtcbiAgICAgICAgY29uc3QgYWx0ZXJuYXRlID0gY291bnQgPT0gNyA/IHRoaXMudmlzaXRTdGF0ZW1lbnQoY3R4LmdldENoaWxkKDYpKSA6IHVuZGVmaW5lZDtcblxuICAgICAgICByZXR1cm4gbmV3IElmU3RhdGVtZW50KHRlc3QsIGNvbnNlcXVlbnQsIGFsdGVybmF0ZSk7XG4gICAgfVxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjRG9TdGF0ZW1lbnQuXG4gICAgdmlzaXREb1N0YXRlbWVudChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0RG9TdGF0ZW1lbnQ6IFwiICsgY3R4LmdldFRleHQoKSk7XG4gICAgfVxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjV2hpbGVTdGF0ZW1lbnQuXG4gICAgdmlzaXRXaGlsZVN0YXRlbWVudChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0V2hpbGVTdGF0ZW1lbnQ6IFwiICsgY3R4LmdldFRleHQoKSk7XG4gICAgfVxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjRm9yU3RhdGVtZW50LlxuICAgIHZpc2l0Rm9yU3RhdGVtZW50KGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS5pbmZvKFwidmlzaXRXaGlsZVN0YXRlbWVudDogXCIgKyBjdHguZ2V0VGV4dCgpKTtcbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNGb3JWYXJTdGF0ZW1lbnQuXG4gICAgdmlzaXRGb3JWYXJTdGF0ZW1lbnQoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI0ZvckluU3RhdGVtZW50LlxuICAgIHZpc2l0Rm9ySW5TdGF0ZW1lbnQoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI0ZvclZhckluU3RhdGVtZW50LlxuICAgIHZpc2l0Rm9yVmFySW5TdGF0ZW1lbnQoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2NvbnRpbnVlU3RhdGVtZW50LlxuICAgIHZpc2l0Q29udGludWVTdGF0ZW1lbnQoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuXG4gICAgfVxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjYnJlYWtTdGF0ZW1lbnQuXG4gICAgdmlzaXRCcmVha1N0YXRlbWVudChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG5cbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI3JldHVyblN0YXRlbWVudC5cbiAgICB2aXNpdFJldHVyblN0YXRlbWVudChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG5cbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI3dpdGhTdGF0ZW1lbnQuXG4gICAgdmlzaXRXaXRoU3RhdGVtZW50KGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcblxuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjc3dpdGNoU3RhdGVtZW50LlxuICAgIHZpc2l0U3dpdGNoU3RhdGVtZW50KGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcblxuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjY2FzZUJsb2NrLlxuICAgIHZpc2l0Q2FzZUJsb2NrKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcblxuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjY2FzZUNsYXVzZXMuXG4gICAgdmlzaXRDYXNlQ2xhdXNlcyhjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG5cbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2Nhc2VDbGF1c2UuXG4gICAgdmlzaXRDYXNlQ2xhdXNlKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcblxuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjZGVmYXVsdENsYXVzZS5cbiAgICB2aXNpdERlZmF1bHRDbGF1c2UoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuXG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNsYWJlbGxlZFN0YXRlbWVudC5cbiAgICB2aXNpdExhYmVsbGVkU3RhdGVtZW50KGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcblxuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjdGhyb3dTdGF0ZW1lbnQuXG4gICAgdmlzaXRUaHJvd1N0YXRlbWVudChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG5cbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI3RyeVN0YXRlbWVudC5cbiAgICB2aXNpdFRyeVN0YXRlbWVudChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG5cbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2NhdGNoUHJvZHVjdGlvbi5cbiAgICB2aXNpdENhdGNoUHJvZHVjdGlvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG5cbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2ZpbmFsbHlQcm9kdWN0aW9uLlxuICAgIHZpc2l0RmluYWxseVByb2R1Y3Rpb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuXG4gICAgfVxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjZGVidWdnZXJTdGF0ZW1lbnQuXG4gICAgdmlzaXREZWJ1Z2dlclN0YXRlbWVudChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG5cbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNmdW5jdGlvbkRlY2xhcmF0aW9uLlxuICAgIHZpc2l0RnVuY3Rpb25EZWNsYXJhdGlvbihjdHg6IFJ1bGVDb250ZXh0KTogRnVuY3Rpb25EZWNsYXJhdGlvbiB8IEFzeW5jRnVuY3Rpb25EZWNsYXJhdGlvbiB7XG4gICAgICAgIHRoaXMubG9nKGN0eCwgVHJhY2UuZnJhbWUoKSk7XG4gICAgICAgIHRoaXMuYXNzZXJ0VHlwZShjdHgsIEVDTUFTY3JpcHRQYXJzZXIuRnVuY3Rpb25EZWNsYXJhdGlvbkNvbnRleHQpO1xuICAgICAgICBsZXQgYXN5bmMgPSBmYWxzZTtcbiAgICAgICAgbGV0IGdlbmVyYXRvciA9IGZhbHNlO1xuICAgICAgICBsZXQgaWRlbnRpZmllcjogSWRlbnRpZmllcjtcbiAgICAgICAgbGV0IHBhcmFtcztcbiAgICAgICAgbGV0IGJvZHk7XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjdHguZ2V0Q2hpbGRDb3VudCgpOyArK2kpIHtcbiAgICAgICAgICAgIGNvbnN0IG5vZGUgPSBjdHguZ2V0Q2hpbGQoaSk7XG4gICAgICAgICAgICBpZiAobm9kZS5zeW1ib2wpIHtcbiAgICAgICAgICAgICAgICBjb25zdCB0eHQgPSBub2RlLmdldFRleHQoKTtcbiAgICAgICAgICAgICAgICBpZiAodHh0ID09ICdhc3luYycpIHtcbiAgICAgICAgICAgICAgICAgICAgYXN5bmMgPSB0cnVlXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0eHQgPT0gJyonKSB7XG4gICAgICAgICAgICAgICAgICAgIGdlbmVyYXRvciA9IHRydWVcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChub2RlIGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5JZGVudGlmaWVyQ29udGV4dCkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuaW5mbyhcIkVDTUFTY3JpcHRQYXJzZXIgOzsgSWRlbnRpZmllckNvbnRleHRcIilcbiAgICAgICAgICAgICAgICBpZGVudGlmaWVyID0gdGhpcy52aXNpdElkZW50aWZpZXIobm9kZSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG5vZGUgaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLkZvcm1hbFBhcmFtZXRlckxpc3RDb250ZXh0KSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5pbmZvKFwiRUNNQVNjcmlwdFBhcnNlciA7OyBGb3JtYWxQYXJhbWV0ZXJMaXN0Q29udGV4dFwiKVxuICAgICAgICAgICAgICAgIHBhcmFtcyA9IHRoaXMudmlzaXRGb3JtYWxQYXJhbWV0ZXJMaXN0KG5vZGUpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChub2RlIGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5GdW5jdGlvbkJvZHlDb250ZXh0KSB7XG4gICAgICAgICAgICAgICAgLy8gYm9keSA9IHRoaXMudmlzaXRGdW5jdGlvbkJvZHkobm9kZSk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5pbmZvKFwiRUNNQVNjcmlwdFBhcnNlciA7OyBGb3JtYWxQYXJhbWV0ZXJMaXN0Q29udGV4dFwiKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLmR1bXBDb250ZXh0QWxsQ2hpbGRyZW4obm9kZSlcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnNvbGUuaW5mbygnYXN5bmMgID0gJyArIGFzeW5jKTtcbiAgICAgICAgY29uc29sZS5pbmZvKCdnZW5lcmF0b3IgID0gJyArIGdlbmVyYXRvcik7XG5cbiAgICAgICAgaWYgKGFzeW5jKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IEFzeW5jRnVuY3Rpb25EZWNsYXJhdGlvbihpZGVudGlmaWVyLCBwYXJhbXMsIGJvZHksIGdlbmVyYXRvcik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyAgY29uc3RydWN0b3IoaWQ6IElkZW50aWZpZXIgfCBudWxsLCBwYXJhbXM6IEZ1bmN0aW9uUGFyYW1ldGVyW10sIGJvZHk6IEJsb2NrU3RhdGVtZW50LCBnZW5lcmF0b3I6IGJvb2xlYW4pIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgRnVuY3Rpb25EZWNsYXJhdGlvbihpZGVudGlmaWVyLCBwYXJtYXMsIGJvZHksIGdlbmVyYXRvcik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNmdW5jdGlvbkRlY2xcbiAgICB2aXNpdEZ1bmN0aW9uRGVjbChjdHg6IFJ1bGVDb250ZXh0KTogRnVuY3Rpb25EZWNsYXJhdGlvbiB7XG4gICAgICAgIHRoaXMubG9nKGN0eCwgVHJhY2UuZnJhbWUoKSk7XG4gICAgICAgIHRoaXMuYXNzZXJ0VHlwZShjdHgsIEVDTUFTY3JpcHRQYXJzZXIuRnVuY3Rpb25EZWNsQ29udGV4dCk7XG4gICAgICAgIHJldHVybiB0aGlzLnZpc2l0RnVuY3Rpb25EZWNsYXJhdGlvbihjdHguZ2V0Q2hpbGQoMCkpXG4gICAgfVxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjZnVuY3Rpb25Cb2R5LlxuICAgIHZpc2l0RnVuY3Rpb25Cb2R5KGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS5pbmZvKFwidmlzaXRGdW5jdGlvbkJvZHk6IFwiICsgY3R4LmdldFRleHQoKSk7XG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNhcnJheUxpdGVyYWwuXG4gICAgdmlzaXRBcnJheUxpdGVyYWwoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJ2aXNpdEFycmF5TGl0ZXJhbCBbJXNdIDogJXNcIiwgY3R4LmdldENoaWxkQ291bnQoKSwgY3R4LmdldFRleHQoKSk7XG4gICAgICAgIHRoaXMuYXNzZXJ0VHlwZShjdHgsIEVDTUFTY3JpcHRQYXJzZXIuQXJyYXlMaXRlcmFsQ29udGV4dClcbiAgICAgICAgLy8gd2UganVzdCBnb3QgYFtdYFxuXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcInZpc2l0QXJyYXlMaXRlcmFsIG5vdCBpbXBsZW1lbnRlZFwiKVxuXG4gICAgICAgIGlmIChjdHguZ2V0Q2hpbGRDb3VudCgpID09IDIpIHtcbiAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgfVxuICAgICAgICAvKiBcbiAgICAgICAgICAgICAgICBsZXQgcmVzdWx0cyA9IFtdXG4gICAgICAgICAgICAgICAgLy8gc2tpcCBgWyBhbmQgIF1gIFxuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAxOyBpIDwgY3R4LmdldENoaWxkQ291bnQoKSAtIDE7ICsraSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBub2RlOiBSdWxlQ29udGV4dCA9IGN0eC5nZXRDaGlsZChpKTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGV4cCA9IFtdO1xuICAgICAgICAgICAgICAgICAgICBpZiAobm9kZSBpbnN0YW5jZW9mIEVDTUFTY3JpcHRQYXJzZXIuRWxlbWVudExpc3RDb250ZXh0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBleHAgPSB0aGlzLnZpc2l0RWxlbWVudExpc3Qobm9kZSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAobm9kZSBpbnN0YW5jZW9mIEVDTUFTY3JpcHRQYXJzZXIuRWxpc2lvbkNvbnRleHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGV4cCA9IHRoaXMudmlzaXRFbGlzaW9uKG5vZGUpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gc3BlY2lhbCBjYXNlIGZvciBoYW5kbGluZyBlbGlzaW9uIHZhbHVlcyBsaWtlIDogIFsxMSwsLDExXSBdICBbLCxdXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobm9kZS5zeW1ib2wgIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZXhwID0gW251bGxdXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRocm93SW5zYW5jZUVycm9yKHRoaXMuZHVtcENvbnRleHQobm9kZSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdHMgPSBbLi4ucmVzdWx0cywgLi4uZXhwXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdHM7ICovXG4gICAgfVxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjZWxlbWVudExpc3QuXG4gICAgdmlzaXRFbGVtZW50TGlzdChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0RWxlbWVudExpc3QgWyVzXSA6ICVzXCIsIGN0eC5nZXRDaGlsZENvdW50KCksIGN0eC5nZXRUZXh0KCkpO1xuICAgICAgICB0aGlzLmFzc2VydFR5cGUoY3R4LCBFQ01BU2NyaXB0UGFyc2VyLkVsZW1lbnRMaXN0Q29udGV4dClcbiAgICAgICAgY29uc3QgZWxlbWVudHMgPSBbXTtcbiAgICAgICAgY29uc3Qgbm9kZXM6IFJ1bGVDb250ZXh0W10gPSB0aGlzLmZpbHRlclN5bWJvbHMoY3R4KTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgY29uc3QgZWxlbSA9IHRoaXMuc2luZ2xlRXhwcmVzc2lvbihub2Rlc1tpXSk7XG4gICAgICAgICAgICBlbGVtZW50cy5wdXNoKGVsZW0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBlbGVtZW50cztcbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNlbGlzaW9uLlxuICAgIHZpc2l0RWxpc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0RWxpc2lvbiBbJXNdIDogJXNcIiwgY3R4LmdldENoaWxkQ291bnQoKSwgY3R4LmdldFRleHQoKSk7XG4gICAgICAgIHRoaXMuYXNzZXJ0VHlwZShjdHgsIEVDTUFTY3JpcHRQYXJzZXIuRWxpc2lvbkNvbnRleHQpXG4gICAgICAgIC8vIGNvbXBsaWFuY2U6IGVzcHJpbWEgY29tcGxpYW5lIG9yIHJldHVybmluZyBgbnVsbGAgXG4gICAgICAgIGNvbnN0IGVsaXNpb24gPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjdHguZ2V0Q2hpbGRDb3VudCgpOyArK2kpIHtcbiAgICAgICAgICAgIGVsaXNpb24ucHVzaChudWxsKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZWxpc2lvbjtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNvYmplY3RMaXRlcmFsLlxuICAgICAqIG9iamVjdExpdGVyYWxcbiAgICAgKiAgOiAneycgKHByb3BlcnR5QXNzaWdubWVudCAoJywnIHByb3BlcnR5QXNzaWdubWVudCkqKT8gJywnPyAnfSdcbiAgICAgKiAgO1xuICAgICAqIEBwYXJhbSBjdHggXG4gICAgICovXG4gICAgdmlzaXRPYmplY3RMaXRlcmFsKGN0eDogUnVsZUNvbnRleHQpOiBPYmplY3RFeHByZXNzaW9uIHtcbiAgICAgICAgdGhpcy5sb2coY3R4LCBUcmFjZS5mcmFtZSgpKVxuICAgICAgICB0aGlzLmFzc2VydFR5cGUoY3R4LCBFQ01BU2NyaXB0UGFyc2VyLk9iamVjdExpdGVyYWxDb250ZXh0KTtcbiAgICAgICAgaWYgKGN0eC5nZXRDaGlsZENvdW50KCkgPT0gMikge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBPYmplY3RFeHByZXNzaW9uKFtdKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IG5vZGVzID0gdGhpcy5maWx0ZXJTeW1ib2xzKGN0eCk7XG4gICAgICAgIGNvbnN0IHByb3BlcnRpZXM6IE9iamVjdEV4cHJlc3Npb25Qcm9wZXJ0eVtdID0gW107XG4gICAgICAgIGZvciAoY29uc3Qgbm9kZSBvZiBub2Rlcykge1xuICAgICAgICAgICAgbGV0IHByb3BlcnR5OiBPYmplY3RFeHByZXNzaW9uUHJvcGVydHk7XG4gICAgICAgICAgICBpZiAobm9kZSBpbnN0YW5jZW9mIEVDTUFTY3JpcHRQYXJzZXIuUHJvcGVydHlFeHByZXNzaW9uQXNzaWdubWVudENvbnRleHQpIHtcbiAgICAgICAgICAgICAgICBwcm9wZXJ0eSA9IHRoaXMudmlzaXRQcm9wZXJ0eUV4cHJlc3Npb25Bc3NpZ25tZW50KG5vZGUpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChub2RlIGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5Qcm9wZXJ0eVNob3J0aGFuZENvbnRleHQpIHtcbiAgICAgICAgICAgICAgICBwcm9wZXJ0eSA9IHRoaXMudmlzaXRQcm9wZXJ0eVNob3J0aGFuZChub2RlKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAobm9kZSBpbnN0YW5jZW9mIEVDTUFTY3JpcHRQYXJzZXIuRnVuY3Rpb25Qcm9wZXJ0eUNvbnRleHQpIHtcbiAgICAgICAgICAgICAgICBwcm9wZXJ0eSA9IHRoaXMudmlzaXRGdW5jdGlvblByb3BlcnR5KG5vZGUpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnRocm93SW5zYW5jZUVycm9yKHRoaXMuZHVtcENvbnRleHQobm9kZSkpXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChwcm9wZXJ0eSAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2gocHJvcGVydHkpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyBPYmplY3RFeHByZXNzaW9uKHByb3BlcnRpZXMpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI3Byb3BlcnR5U2hvcnRoYW5kLlxuICAgICAqICB8IEVsbGlwc2lzPyBzaW5nbGVFeHByZXNzaW9uICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICMgUHJvcGVydHlTaG9ydGhhbmRcbiAgICAgKiBAcGFyYW0gY3R4IFxuICAgICAqL1xuICAgIHZpc2l0UHJvcGVydHlTaG9ydGhhbmQoY3R4OiBSdWxlQ29udGV4dCk6IE9iamVjdEV4cHJlc3Npb25Qcm9wZXJ0eSB7XG4gICAgICAgIHRoaXMubG9nKGN0eCwgVHJhY2UuZnJhbWUoKSk7XG4gICAgICAgIHRoaXMuYXNzZXJ0VHlwZShjdHgsIEVDTUFTY3JpcHRQYXJzZXIuUHJvcGVydHlTaG9ydGhhbmRDb250ZXh0KVxuICAgICAgICBjb25zdCBjb21wdXRlZCA9IGZhbHNlO1xuICAgICAgICBjb25zdCBtZXRob2QgPSBmYWxzZTtcbiAgICAgICAgY29uc3Qgc2hvcnRoYW5kID0gdHJ1ZTtcbiAgICAgICAgY29uc3QgdmFsdWUgPSB0aGlzLnNpbmdsZUV4cHJlc3Npb24oY3R4LmdldENoaWxkKDApKTtcbiAgICAgICAgY29uc3Qga2V5OiBQcm9wZXJ0eUtleSA9ICBuZXcgSWRlbnRpZmllcihjdHguZ2V0VGV4dCgpKVxuICAgICAgICByZXR1cm4gbmV3IFByb3BlcnR5KFwiaW5pdFwiLCBrZXksIGNvbXB1dGVkLCB2YWx1ZSwgbWV0aG9kLCBzaG9ydGhhbmQpO1xuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI3Byb3BlcnR5U2hvcnRoYW5kLlxuICAgIHZpc2l0RnVuY3Rpb25Qcm9wZXJ0eShjdHg6IFJ1bGVDb250ZXh0KTogT2JqZWN0RXhwcmVzc2lvblByb3BlcnR5IHtcbiAgICAgICAgdGhpcy5sb2coY3R4LCBUcmFjZS5mcmFtZSgpKTtcbiAgICAgICAgdGhpcy5hc3NlcnRUeXBlKGN0eCwgRUNNQVNjcmlwdFBhcnNlci5GdW5jdGlvblByb3BlcnR5Q29udGV4dClcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIm5vdCBpbXBsZW1lbnRlZFwiKVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEZpbHRlciBvdXQgVGVybWluYWxOb2RlcyAoY29tbWFzLCBwaXBlcywgYnJhY2tldHMpXG4gICAgICogQHBhcmFtIGN0eCBcbiAgICAgKi9cbiAgICBwcml2YXRlIGZpbHRlclN5bWJvbHMoY3R4OiBSdWxlQ29udGV4dCk6IFJ1bGVDb250ZXh0W10ge1xuICAgICAgICBjb25zdCBmaWx0ZXJlZDogUnVsZUNvbnRleHRbXSA9IFtdO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGN0eC5nZXRDaGlsZENvdW50KCk7ICsraSkge1xuICAgICAgICAgICAgY29uc3Qgbm9kZSA9IGN0eC5nZXRDaGlsZChpKTtcbiAgICAgICAgICAgIC8vIHRoZXJlIG1pZ2h0IGJlIGEgYmV0dGVyIHdheVxuICAgICAgICAgICAgaWYgKG5vZGUuc3ltYm9sICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZmlsdGVyZWQucHVzaChub2RlKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmlsdGVyZWQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjUHJvcGVydHlFeHByZXNzaW9uQXNzaWdubWVudC5cbiAgICAgKiBwcm9wZXJ0eUFzc2lnbm1lbnRcbiAgICAgKiAgICAgOiBwcm9wZXJ0eU5hbWUgJzonIHNpbmdsZUV4cHJlc3Npb24gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAjIFByb3BlcnR5RXhwcmVzc2lvbkFzc2lnbm1lbnRcbiAgICAgKiAgICAgfCAnWycgc2luZ2xlRXhwcmVzc2lvbiAnXScgJzonIHNpbmdsZUV4cHJlc3Npb24gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAjIENvbXB1dGVkUHJvcGVydHlFeHByZXNzaW9uQXNzaWdubWVudFxuICAgICAqICAgICB8IEFzeW5jPyAnKic/IHByb3BlcnR5TmFtZSAnKCcgZm9ybWFsUGFyYW1ldGVyTGlzdD8gICcpJyAgJ3snIGZ1bmN0aW9uQm9keSAnfScgICMgRnVuY3Rpb25Qcm9wZXJ0eVxuICAgICAqICAgICB8IGdldHRlciAnKCcgJyknICd7JyBmdW5jdGlvbkJvZHkgJ30nICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICMgUHJvcGVydHlHZXR0ZXJcbiAgICAgKiAgICAgfCBzZXR0ZXIgJygnIGZvcm1hbFBhcmFtZXRlckFyZyAnKScgJ3snIGZ1bmN0aW9uQm9keSAnfScgICAgICAgICAgICAgICAgICAgICAgICAjIFByb3BlcnR5U2V0dGVyXG4gICAgICogICAgIHwgRWxsaXBzaXM/IHNpbmdsZUV4cHJlc3Npb24gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIyBQcm9wZXJ0eVNob3J0aGFuZFxuICAgICAqICAgICA7XG4gICAgICovXG4gICAgdmlzaXRQcm9wZXJ0eUV4cHJlc3Npb25Bc3NpZ25tZW50KGN0eDogUnVsZUNvbnRleHQpOiBPYmplY3RFeHByZXNzaW9uUHJvcGVydHkge1xuICAgICAgICB0aGlzLmxvZyhjdHgsIFRyYWNlLmZyYW1lKCkpO1xuICAgICAgICB0aGlzLmFzc2VydFR5cGUoY3R4LCBFQ01BU2NyaXB0UGFyc2VyLlByb3BlcnR5RXhwcmVzc2lvbkFzc2lnbm1lbnRDb250ZXh0KTtcblxuICAgICAgICBsZXQgbm9kZSA9IGN0eC5nZXRDaGlsZCgwKTtcblxuICAgICAgICB0aGlzLmR1bXBDb250ZXh0QWxsQ2hpbGRyZW4oY3R4KVxuICAgICAgICBsZXQgbjAgPSBjdHguZ2V0Q2hpbGQoMCk7IC8vIFByb3BlcnR5TmFtZVxuICAgICAgICBsZXQgbjEgPSBjdHguZ2V0Q2hpbGQoMSk7IC8vIHN5bWJvbCA6XG4gICAgICAgIGxldCBuMiA9IGN0eC5nZXRDaGlsZCgyKTsgLy8gIHNpbmdsZUV4cHJlc3Npb24gXG4gICAgICAgIGxldCBrZXk6IFByb3BlcnR5S2V5ID0gdGhpcy52aXNpdFByb3BlcnR5TmFtZShuMCk7XG4gICAgICAgIGxldCB2YWx1ZTtcbiAgICAgICAgY29uc3QgY29tcHV0ZWQgPSBmYWxzZTtcbiAgICAgICAgY29uc3QgbWV0aG9kID0gZmFsc2U7XG4gICAgICAgIGNvbnN0IHNob3J0aGFuZCA9IGZhbHNlO1xuXG4gICAgICAgIGlmIChuMiBpbnN0YW5jZW9mIEVDTUFTY3JpcHRQYXJzZXIuUHJvcGVydHlFeHByZXNzaW9uQXNzaWdubWVudENvbnRleHQpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuaW5mbygnIC0tIFByb3BlcnR5RXhwcmVzc2lvbkFzc2lnbm1lbnRDb250ZXh0JylcbiAgICAgICAgICAgIGtleSA9IHRoaXMudmlzaXRQcm9wZXJ0eU5hbWUobjApO1xuICAgICAgICB9IGVsc2UgaWYgKG4yIGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5Db21wdXRlZFByb3BlcnR5RXhwcmVzc2lvbkFzc2lnbm1lbnRDb250ZXh0KSB7XG4gICAgICAgICAgICBjb25zb2xlLmluZm8oJyAtLSBDb21wdXRlZFByb3BlcnR5RXhwcmVzc2lvbkFzc2lnbm1lbnRDb250ZXh0JylcbiAgICAgICAgfSBlbHNlIGlmIChuMiBpbnN0YW5jZW9mIEVDTUFTY3JpcHRQYXJzZXIuRnVuY3Rpb25Qcm9wZXJ0eUNvbnRleHQpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuaW5mbygnIC0tIEZ1bmN0aW9uUHJvcGVydHlDb250ZXh0JylcbiAgICAgICAgfSBlbHNlIGlmIChuMiBpbnN0YW5jZW9mIEVDTUFTY3JpcHRQYXJzZXIuUHJvcGVydHlHZXR0ZXJDb250ZXh0KSB7XG4gICAgICAgICAgICBjb25zb2xlLmluZm8oJyAtLSBQcm9wZXJ0eUdldHRlckNvbnRleHQnKVxuICAgICAgICB9IGVsc2UgaWYgKG4yIGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5Qcm9wZXJ0eVNldHRlckNvbnRleHQpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuaW5mbygnIC0tIFByb3BlcnR5U2V0dGVyQ29udGV4dCcpXG4gICAgICAgIH0gZWxzZSBpZiAobjIgaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLlByb3BlcnR5U2hvcnRoYW5kQ29udGV4dCkge1xuICAgICAgICAgICAgY29uc29sZS5pbmZvKCcgLS0gUHJvcGVydHlTaG9ydGhhbmRDb250ZXh0JylcbiAgICAgICAgfVxuICAgICAgICAvLyB0aGlzLnNpbmdsZUV4cHJlc3Npb24objIpO1xuXG4gICAgICAgIHJldHVybiBuZXcgUHJvcGVydHkoXCJpbml0XCIsIGtleSwgY29tcHV0ZWQsIHZhbHVlLCBtZXRob2QsIHNob3J0aGFuZCk7XG4gICAgfVxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjUHJvcGVydHlHZXR0ZXIuXG4gICAgdmlzaXRQcm9wZXJ0eUdldHRlcihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG5cbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI1Byb3BlcnR5U2V0dGVyLlxuICAgIHZpc2l0UHJvcGVydHlTZXR0ZXIoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjcHJvcGVydHlOYW1lLlxuICAgICAqIFxuICAgICAqIHByb3BlcnR5TmFtZVxuICAgICAqICA6IGlkZW50aWZpZXJOYW1lXG4gICAgICogIHwgU3RyaW5nTGl0ZXJhbFxuICAgICAqICB8IG51bWVyaWNMaXRlcmFsXG4gICAgICogIHwgJ1snIHNpbmdsZUV4cHJlc3Npb24gJ10nXG4gICAgICogIDtcbiAgICAgKi9cbiAgICB2aXNpdFByb3BlcnR5TmFtZShjdHg6IFJ1bGVDb250ZXh0KTogUHJvcGVydHlLZXkge1xuICAgICAgICB0aGlzLmxvZyhjdHgsIFRyYWNlLmZyYW1lKCkpXG4gICAgICAgIHRoaXMuYXNzZXJ0VHlwZShjdHgsIEVDTUFTY3JpcHRQYXJzZXIuUHJvcGVydHlOYW1lQ29udGV4dCk7XG4gICAgICAgIHRoaXMuYXNzZXJ0Tm9kZUNvdW50KGN0eCwgMSk7XG4gICAgICAgIGNvbnN0IG5vZGUgPSBjdHguZ2V0Q2hpbGQoMCk7XG4gICAgICAgIGNvbnN0IGNvdW50ID0gbm9kZS5nZXRDaGlsZENvdW50KCk7XG5cbiAgICAgICAgaWYgKGNvdW50ID09IDApIHsgLy8gbGl0ZXJhbFxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY3JlYXRlTGl0ZXJhbFZhbHVlKG5vZGUpO1xuICAgICAgICB9IGVsc2UgaWYgKGNvdW50ID09IDEpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnZpc2l0SWRlbnRpZmllck5hbWUobm9kZSlcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnRocm93SW5zYW5jZUVycm9yKHRoaXMuZHVtcENvbnRleHQobm9kZSkpO1xuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI3Byb3BlcnR5U2V0UGFyYW1ldGVyTGlzdC5cbiAgICB2aXNpdFByb3BlcnR5U2V0UGFyYW1ldGVyTGlzdChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG5cbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNhcmd1bWVudHMuXG4gICAgdmlzaXRBcmd1bWVudHMoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJ2aXNpdEFyZ3VtZW50czogXCIgKyBjdHguZ2V0VGV4dCgpKTtcblxuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2FyZ3VtZW50TGlzdC5cbiAgICB2aXNpdEFyZ3VtZW50TGlzdChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0QXJndW1lbnRMaXN0OiBcIiArIGN0eC5nZXRUZXh0KCkpO1xuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2V4cHJlc3Npb25TZXF1ZW5jZS5cbiAgICB2aXNpdEV4cHJlc3Npb25TZXF1ZW5jZShjdHg6IFJ1bGVDb250ZXh0KTogRXhwcmVzc2lvblN0YXRlbWVudCB7XG4gICAgICAgIHRoaXMubG9nKGN0eCwgVHJhY2UuZnJhbWUoKSlcbiAgICAgICAgdGhpcy5hc3NlcnRUeXBlKGN0eCwgRUNNQVNjcmlwdFBhcnNlci5FeHByZXNzaW9uU2VxdWVuY2VDb250ZXh0KTtcbiAgICAgICAgY29uc3QgZXhwcmVzc2lvbnMgPSBbXTtcbiAgICAgICAgLy8gZWFjaCBub2RlIGlzIGEgc2luZ2xlRXhwcmVzc2lvblxuICAgICAgICBmb3IgKGNvbnN0IG5vZGUgb2YgdGhpcy5maWx0ZXJTeW1ib2xzKGN0eCkpIHtcbiAgICAgICAgICAgIC8vIGNvbnN0IG5vZGU6IFJ1bGVDb250ZXh0ID0gY3R4LmdldENoaWxkKGkpO1xuICAgICAgICAgICAgY29uc3QgZXhwID0gdGhpcy5zaW5nbGVFeHByZXNzaW9uKG5vZGUpO1xuICAgICAgICAgICAgZXhwcmVzc2lvbnMucHVzaChleHApO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gY29tcGxpYW5jZTogZXNwaXJtYSwgZXNwcmVlXG4gICAgICAgIC8vIHRoaXMgY2hlY2sgdG8gc2VlIGlmIHRoZXJlIGFyZSBtdWx0aXBsZSBleHByZXNzaW9ucyBpZiBzbyB0aGVuIHdlIGxlYXZlIHRoZW0gYXMgU2VxdWVuY2VFeHByZXNzaW9uIFxuICAgICAgICAvLyBvdGhlcndpc2Ugd2Ugd2lsbCByb2xsIHRoZW0gdXAgaW50byBFeHByZXNzaW9uU3RhdGVtZW50IHdpdGggb25lIGV4cHJlc3Npb25cbiAgICAgICAgLy8gYDFgID0gRXhwcmVzc2lvblN0YXRlbWVudCAtPiBMaXRlcmFsXG4gICAgICAgIC8vIGAxLCAyYCA9IEV4cHJlc3Npb25TdGF0ZW1lbnQgLT4gU2VxdWVuY2VFeHByZXNzaW9uIC0+IExpdGVyYWwsIExpdGVyYWxcbiAgICAgICAgbGV0IGV4cDtcbiAgICAgICAgaWYgKGV4cHJlc3Npb25zLmxlbmd0aCA9PSAxKSB7XG4gICAgICAgICAgICBleHAgPSBuZXcgRXhwcmVzc2lvblN0YXRlbWVudChleHByZXNzaW9uc1swXSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGV4cCA9IG5ldyBTZXF1ZW5jZUV4cHJlc3Npb24oZXhwcmVzc2lvbnMpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmRlY29yYXRlKGV4cCwgdGhpcy5hc01hcmtlcih0aGlzLmFzTWV0YWRhdGEoY3R4LmdldFNvdXJjZUludGVydmFsKCkpKSlcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBFdmFsdWF0ZSBhIHNpbmdsZUV4cHJlc3Npb25cbiAgICAgKiBAcGFyYW0gbm9kZSBcbiAgICAgKi9cbiAgICBzaW5nbGVFeHByZXNzaW9uKG5vZGU6IFJ1bGVDb250ZXh0KTogYW55IHtcbiAgICAgICAgaWYgKG5vZGUgaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLkxpdGVyYWxFeHByZXNzaW9uQ29udGV4dCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmlzaXRMaXRlcmFsRXhwcmVzc2lvbihub2RlKTtcbiAgICAgICAgfSBlbHNlIGlmIChub2RlIGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5PYmplY3RMaXRlcmFsRXhwcmVzc2lvbkNvbnRleHQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnZpc2l0T2JqZWN0TGl0ZXJhbEV4cHJlc3Npb24obm9kZSk7XG4gICAgICAgIH0gZWxzZSBpZiAobm9kZSBpbnN0YW5jZW9mIEVDTUFTY3JpcHRQYXJzZXIuQXNzaWdubWVudEV4cHJlc3Npb25Db250ZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy52aXNpdEFzc2lnbm1lbnRFeHByZXNzaW9uKG5vZGUpO1xuICAgICAgICB9IGVsc2UgaWYgKG5vZGUgaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLkFkZGl0aXZlRXhwcmVzc2lvbkNvbnRleHQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnZpc2l0QWRkaXRpdmVFeHByZXNzaW9uKG5vZGUpO1xuICAgICAgICB9IGVsc2UgaWYgKG5vZGUgaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLk11bHRpcGxpY2F0aXZlRXhwcmVzc2lvbkNvbnRleHQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnZpc2l0TXVsdGlwbGljYXRpdmVFeHByZXNzaW9uKG5vZGUpO1xuICAgICAgICB9IGVsc2UgaWYgKG5vZGUgaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLkFycmF5TGl0ZXJhbEV4cHJlc3Npb25Db250ZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy52aXNpdEFycmF5TGl0ZXJhbEV4cHJlc3Npb24obm9kZSk7XG4gICAgICAgIH0gZWxzZSBpZiAobm9kZSBpbnN0YW5jZW9mIEVDTUFTY3JpcHRQYXJzZXIuRXF1YWxpdHlFeHByZXNzaW9uQ29udGV4dCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmlzaXRFcXVhbGl0eUV4cHJlc3Npb24obm9kZSk7XG4gICAgICAgIH0gZWxzZSBpZiAobm9kZSBpbnN0YW5jZW9mIEVDTUFTY3JpcHRQYXJzZXIuUGFyZW50aGVzaXplZEV4cHJlc3Npb25Db250ZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy52aXNpdFBhcmVudGhlc2l6ZWRFeHByZXNzaW9uKG5vZGUpO1xuICAgICAgICB9IGVsc2UgaWYgKG5vZGUgaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLlJlbGF0aW9uYWxFeHByZXNzaW9uQ29udGV4dCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmlzaXRSZWxhdGlvbmFsRXhwcmVzc2lvbihub2RlKTtcbiAgICAgICAgfSBlbHNlIGlmIChub2RlIGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5JZGVudGlmaWVyRXhwcmVzc2lvbkNvbnRleHQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnZpc2l0SWRlbnRpZmllckV4cHJlc3Npb24obm9kZSk7XG4gICAgICAgIH0gZWxzZSBpZiAobm9kZSBpbnN0YW5jZW9mIEVDTUFTY3JpcHRQYXJzZXIuTWVtYmVyRG90RXhwcmVzc2lvbkNvbnRleHQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnZpc2l0TWVtYmVyRG90RXhwcmVzc2lvbihub2RlKTtcbiAgICAgICAgfSBlbHNlIGlmIChub2RlIGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5NZW1iZXJJbmRleEV4cHJlc3Npb25Db250ZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy52aXNpdE1lbWJlckluZGV4RXhwcmVzc2lvbihub2RlKTtcbiAgICAgICAgfSBlbHNlIGlmIChub2RlIGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5Bc3NpZ25tZW50T3BlcmF0b3JFeHByZXNzaW9uQ29udGV4dCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmlzaXRBc3NpZ25tZW50T3BlcmF0b3JFeHByZXNzaW9uKG5vZGUpO1xuICAgICAgICB9IGVsc2UgaWYgKG5vZGUgaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLkZ1bmN0aW9uRXhwcmVzc2lvbkNvbnRleHQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnZpc2l0RnVuY3Rpb25FeHByZXNzaW9uKG5vZGUpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMudGhyb3dJbnNhbmNlRXJyb3IodGhpcy5kdW1wQ29udGV4dChub2RlKSk7XG4gICAgfVxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjY2xhc3NEZWNsYXJhdGlvbi5cbiAgICB2aXNpdENsYXNzRGVjbGFyYXRpb24oY3R4OiBSdWxlQ29udGV4dCk6IENsYXNzRGVjbGFyYXRpb24ge1xuICAgICAgICB0aGlzLmxvZyhjdHgsIFRyYWNlLmZyYW1lKCkpO1xuICAgICAgICB0aGlzLmFzc2VydFR5cGUoY3R4LCBFQ01BU2NyaXB0UGFyc2VyLkNsYXNzRGVjbGFyYXRpb25Db250ZXh0KTtcbiAgICAgICAgLy8gQ2xhc3MgaWRlbnRpZmllciBjbGFzc1RhaWxcbiAgICAgICAgY29uc3QgaWRlbnRpZmllciA9IHRoaXMudmlzaXRJZGVudGlmaWVyKGN0eC5nZXRDaGlsZCgxKSk7XG4gICAgICAgIGNvbnN0IGJvZHk6IFByb3BlcnR5W10gPSB0aGlzLnZpc2l0Q2xhc3NUYWlsKGN0eC5nZXRDaGlsZCgyKSlcbiAgICAgICAgY29uc3QgY2xhc3NCb2R5ID0gbmV3IENsYXNzQm9keShib2R5KTtcbiAgICAgICAgcmV0dXJuIG5ldyBDbGFzc0RlY2xhcmF0aW9uKGlkZW50aWZpZXIsIG51bGwsIGNsYXNzQm9keSk7XG4gICAgfVxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjY2xhc3NUYWlsLlxuICAgIHZpc2l0Q2xhc3NUYWlsKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgdGhpcy5sb2coY3R4LCBUcmFjZS5mcmFtZSgpKTtcbiAgICAgICAgdGhpcy5hc3NlcnRUeXBlKGN0eCwgRUNNQVNjcmlwdFBhcnNlci5DbGFzc1RhaWxDb250ZXh0KTtcbiAgICAgICAgLy8gIChFeHRlbmRzIHNpbmdsZUV4cHJlc3Npb24pPyAneycgY2xhc3NFbGVtZW50KiAnfSdcbiAgICAgICAgdGhpcy5kdW1wQ29udGV4dEFsbENoaWxkcmVuKGN0eClcbiAgICAgICAgY29uc3Qgbm9kZSA9IHRoaXMuZ2V0Tm9kZUJ5VHlwZShjdHgsIEVDTUFTY3JpcHRQYXJzZXIuQ2xhc3NFbGVtZW50Q29udGV4dCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXROb2RlQnlUeXBlKGN0eDogUnVsZUNvbnRleHQsIHR5cGU6IGFueSkge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGN0eC5nZXRDaGlsZENvdW50KCk7ICsraSkge1xuICAgICAgICAgICAgaWYgKGN0eC5nZXRDaGlsZChpKSBpbnN0YW5jZW9mIHR5cGUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY3R4LmdldENoaWxkKGkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjY2xhc3NFbGVtZW50LlxuICAgIHZpc2l0Q2xhc3NFbGVtZW50KGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgdGhpcy5sb2coY3R4LCBUcmFjZS5mcmFtZSgpKTtcbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI21ldGhvZERlZmluaXRpb24uXG4gICAgdmlzaXRNZXRob2REZWZpbml0aW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgdGhpcy5sb2coY3R4LCBUcmFjZS5mcmFtZSgpKTtcbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2Zvcm1hbFBhcmFtZXRlckxpc3QuXG4gICAgdmlzaXRGb3JtYWxQYXJhbWV0ZXJMaXN0KGN0eDogUnVsZUNvbnRleHQpOiBGdW5jdGlvblBhcmFtZXRlcltdIHtcbiAgICAgICAgdGhpcy5sb2coY3R4LCBUcmFjZS5mcmFtZSgpKTtcbiAgICAgICAgdGhpcy5hc3NlcnRUeXBlKGN0eCwgRUNNQVNjcmlwdFBhcnNlci5Gb3JtYWxQYXJhbWV0ZXJMaXN0Q29udGV4dCk7XG4gICAgICAgIGNvbnN0IGZvcm1hbDogRnVuY3Rpb25QYXJhbWV0ZXJbXSA9IFtdXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY3R4LmdldENoaWxkQ291bnQoKTsgKytpKSB7XG4gICAgICAgICAgICBjb25zdCBub2RlID0gY3R4LmdldENoaWxkKGkpO1xuICAgICAgICAgICAgaWYgKG5vZGUgaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLkZvcm1hbFBhcmFtZXRlckFyZ0NvbnRleHQpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBwYXJhbWV0ZXIgPSB0aGlzLnZpc2l0Rm9ybWFsUGFyYW1ldGVyQXJnKG5vZGUpO1xuICAgICAgICAgICAgICAgIGZvcm1hbC5wdXNoKHBhcmFtZXRlcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZvcm1hbDtcbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNmb3JtYWxQYXJhbWV0ZXJBcmcuXG4gICAgdmlzaXRGb3JtYWxQYXJhbWV0ZXJBcmcoY3R4OiBSdWxlQ29udGV4dCk6IEFzc2lnbm1lbnRQYXR0ZXJuIHtcbiAgICAgICAgdGhpcy5sb2coY3R4LCBUcmFjZS5mcmFtZSgpKTtcbiAgICAgICAgdGhpcy5hc3NlcnRUeXBlKGN0eCwgRUNNQVNjcmlwdFBhcnNlci5Gb3JtYWxQYXJhbWV0ZXJBcmdDb250ZXh0KTtcbiAgICAgICAgLy8gICAgY29uc3RydWN0b3IobGVmdDogQmluZGluZ0lkZW50aWZpZXIgfCBCaW5kaW5nUGF0dGVybiwgcmlnaHQ6IEV4cHJlc3Npb24pXG5cbiAgICAgICAgY29uc3QgY291bnQgPSBjdHguZ2V0Q2hpbGRDb3VudCgpO1xuICAgICAgICBpZiAoY291bnQgIT0gMSAmJiBjb3VudCAhPSAzKSB7XG4gICAgICAgICAgICB0aGlzLnRocm93SW5zYW5jZUVycm9yKHRoaXMuZHVtcENvbnRleHQoY3R4KSk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBhc3NpZ25hYmxlID0gdGhpcy52aXNpdEFzc2lnbmFibGUoY3R4LmdldENoaWxkKDApKTtcbiAgICAgICAgY29uc29sZS5pbmZvKGFzc2lnbmFibGUpXG5cbiAgICAgICAgLypcbiAgICAgICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgICAgICMgRm9ybWFsUGFyYW1ldGVyQXJnQ29udGV4dFxuICAgICAgICAqIEFzc2lnbmFibGVDb250ZXh0XG4gICAgICAgICAgICAqIElkZW50aWZpZXJDb250ZXh0XG4gICAgICAgIERlbHZlbkFTVFZpc2l0b3IudmlzaXRGb3JtYWxQYXJhbWV0ZXJBcmcgWzNdIDogeD0yXG4gICAgICAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgICAgICAjIEZvcm1hbFBhcmFtZXRlckFyZ0NvbnRleHRcbiAgICAgICAgKiBBc3NpZ25hYmxlQ29udGV4dFxuICAgICAgICAgICAgKiBJZGVudGlmaWVyQ29udGV4dFxuICAgICAgICAqIExpdGVyYWxFeHByZXNzaW9uQ29udGV4dFxuICAgICAgICAgICAgKiBMaXRlcmFsQ29udGV4dFxuICAgICAgICAgICAgICAgICogTnVtZXJpY0xpdGVyYWxDb250ZXh0XG4gICAgICAgIERlbHZlbkFTVFZpc2l0b3IudmlzaXRGb3JtYWxQYXJhbWV0ZXJBcmcgWzFdIDogeVxuICAgICAgICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICAgICAgICAqL1xuICAgICAgICByZXR1cm4gbmV3IEFzc2lnbm1lbnRQYXR0ZXJuKCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFxuICAgICAqICBhc3NpZ25hYmxlXG4gICAgICogICAgOiBpZGVudGlmaWVyXG4gICAgICogICAgfCBhcnJheUxpdGVyYWxcbiAgICAgKiAgICB8IG9iamVjdExpdGVyYWxcbiAgICAgKiAgICA7IFxuICAgICAqIEBwYXJhbSBjdHggIEFzc2lnbmFibGVDb250ZXh0XG4gICAgICovXG4gICAgdmlzaXRBc3NpZ25hYmxlKGN0eDogUnVsZUNvbnRleHQpOiBCaW5kaW5nSWRlbnRpZmllciB8IEJpbmRpbmdQYXR0ZXJuIHtcbiAgICAgICAgdGhpcy5sb2coY3R4LCBUcmFjZS5mcmFtZSgpKTtcbiAgICAgICAgdGhpcy5hc3NlcnRUeXBlKGN0eCwgRUNNQVNjcmlwdFBhcnNlci5Bc3NpZ25hYmxlQ29udGV4dCk7XG4gICAgICAgIGNvbnN0IGFzc2lnbmFibGUgPSBjdHguZ2V0Q2hpbGQoMCk7XG4gICAgICAgIGlmIChhc3NpZ25hYmxlIGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5JZGVudGlmaWVyQ29udGV4dCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmlzaXRJZGVudGlmaWVyKGFzc2lnbmFibGUpO1xuICAgICAgICB9IGVsc2UgaWYgKGFzc2lnbmFibGUgaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLkFycmF5TGl0ZXJhbENvbnRleHQpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuaW5mbyhcIigoKCggICgoKCgoXCIpXG4gICAgICAgIH0gZWxzZSBpZiAoYXNzaWduYWJsZSBpbnN0YW5jZW9mIEVDTUFTY3JpcHRQYXJzZXIuT2JqZWN0TGl0ZXJhbENvbnRleHQpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuaW5mbyhcIigoKCggICgoKCgoXCIpXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy50aHJvd0luc2FuY2VFcnJvcih0aGlzLmR1bXBDb250ZXh0KGN0eCkpO1xuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2xhc3RGb3JtYWxQYXJhbWV0ZXJBcmcuXG4gICAgdmlzaXRMYXN0Rm9ybWFsUGFyYW1ldGVyQXJnKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgdGhpcy5sb2coY3R4LCBUcmFjZS5mcmFtZSgpKTtcbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNUZXJuYXJ5RXhwcmVzc2lvbi5cbiAgICB2aXNpdFRlcm5hcnlFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNMb2dpY2FsQW5kRXhwcmVzc2lvbi5cbiAgICB2aXNpdExvZ2ljYWxBbmRFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcblxuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjUHJlSW5jcmVtZW50RXhwcmVzc2lvbi5cbiAgICB2aXNpdFByZUluY3JlbWVudEV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjT2JqZWN0TGl0ZXJhbEV4cHJlc3Npb24uXG4gICAgICogQHBhcmFtIGN0eCBcbiAgICAgKi9cbiAgICB2aXNpdE9iamVjdExpdGVyYWxFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpOiBPYmplY3RFeHByZXNzaW9uIHtcbiAgICAgICAgdGhpcy5sb2coY3R4LCBUcmFjZS5mcmFtZSgpKVxuICAgICAgICB0aGlzLmFzc2VydFR5cGUoY3R4LCBFQ01BU2NyaXB0UGFyc2VyLk9iamVjdExpdGVyYWxFeHByZXNzaW9uQ29udGV4dCk7XG4gICAgICAgIGNvbnN0IG5vZGUgPSBjdHguZ2V0Q2hpbGQoMCk7XG4gICAgICAgIGNvbnN0IHByb3BlcnRpZXM6IE9iamVjdEV4cHJlc3Npb25Qcm9wZXJ0eVtdID0gdGhpcy52aXNpdE9iamVjdExpdGVyYWwobm9kZSk7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBPYmplY3RFeHByZXNzaW9uKHByb3BlcnRpZXMpO1xuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjSW5FeHByZXNzaW9uLlxuICAgIHZpc2l0SW5FeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcblxuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjTG9naWNhbE9yRXhwcmVzc2lvbi5cbiAgICB2aXNpdExvZ2ljYWxPckV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuXG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNOb3RFeHByZXNzaW9uLlxuICAgIHZpc2l0Tm90RXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG5cbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI1ByZURlY3JlYXNlRXhwcmVzc2lvbi5cbiAgICB2aXNpdFByZURlY3JlYXNlRXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG5cbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI0FyZ3VtZW50c0V4cHJlc3Npb24uXG4gICAgdmlzaXRBcmd1bWVudHNFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS5pbmZvKFwidmlzaXRBcmd1bWVudHNFeHByZXNzaW9uOiBcIiArIGN0eC5nZXRUZXh0KCkpO1xuXG5cbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI1RoaXNFeHByZXNzaW9uLlxuICAgIHZpc2l0VGhpc0V4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuXG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNGdW5jdGlvbkV4cHJlc3Npb24uXG4gICAgdmlzaXRGdW5jdGlvbkV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICB0aGlzLmxvZyhjdHgsIFRyYWNlLmZyYW1lKCkpO1xuICAgICAgICB0aGlzLmFzc2VydFR5cGUoY3R4LCBFQ01BU2NyaXB0UGFyc2VyLkZ1bmN0aW9uRXhwcmVzc2lvbkNvbnRleHQpO1xuICAgICAgICAvLyAgKEV4dGVuZHMgc2luZ2xlRXhwcmVzc2lvbik/ICd7JyBjbGFzc0VsZW1lbnQqICd9J1xuICAgICAgICB0aGlzLmR1bXBDb250ZXh0QWxsQ2hpbGRyZW4oY3R4KVxuICAgICAgICBsZXQgZGVjbCA9IHRoaXMudmlzaXRGdW5jdGlvbkRlY2woY3R4LmdldENoaWxkKDApKVxuICAgICAgICAvLyBjb25zdCBub2RlID0gdGhpcy5nZXROb2RlQnlUeXBlKGN0eCwgRUNNQVNjcmlwdFBhcnNlci5DbGFzc0VsZW1lbnRDb250ZXh0KTtcbiAgICAgICAgY29uc29sZS5pbmZvKGRlY2wpXG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNVbmFyeU1pbnVzRXhwcmVzc2lvbi5cbiAgICB2aXNpdFVuYXJ5TWludXNFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcblxuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjUG9zdERlY3JlYXNlRXhwcmVzc2lvbi5cbiAgICB2aXNpdFBvc3REZWNyZWFzZUV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI0Fzc2lnbm1lbnRFeHByZXNzaW9uLlxuICAgICAqIFxuICAgICAqIDxhc3NvYz1yaWdodD4gc2luZ2xlRXhwcmVzc2lvbiAnPScgc2luZ2xlRXhwcmVzc2lvbiAgICAgICAgICAgICAgICAgICAjIEFzc2lnbm1lbnRFeHByZXNzaW9uXG4gICAgICogQHBhcmFtIGN0eCBcbiAgICAgKi9cbiAgICB2aXNpdEFzc2lnbm1lbnRFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpOiBBc3NpZ25tZW50RXhwcmVzc2lvbiB7XG4gICAgICAgIHRoaXMubG9nKGN0eCwgVHJhY2UuZnJhbWUoKSlcbiAgICAgICAgdGhpcy5hc3NlcnRUeXBlKGN0eCwgRUNNQVNjcmlwdFBhcnNlci5Bc3NpZ25tZW50RXhwcmVzc2lvbkNvbnRleHQpO1xuICAgICAgICB0aGlzLmFzc2VydE5vZGVDb3VudChjdHgsIDMpXG5cbiAgICAgICAgY29uc3QgaW5pdGlhbGlzZXIgPSBjdHguZ2V0Q2hpbGQoMCk7XG4gICAgICAgIGNvbnN0IG9wZXJhdG9yID0gY3R4LmdldENoaWxkKDEpLmdldFRleHQoKTsgLy8gTm8gdHlwZSAoID0gKVxuICAgICAgICBjb25zdCBleHByZXNzaW9uID0gY3R4LmdldENoaWxkKDIpO1xuICAgICAgICBjb25zdCBsaHMgPSB0aGlzLnNpbmdsZUV4cHJlc3Npb24oaW5pdGlhbGlzZXIpO1xuICAgICAgICBjb25zdCByaHMgPSB0aGlzLnNpbmdsZUV4cHJlc3Npb24oZXhwcmVzc2lvbik7XG5cbiAgICAgICAgLy8gQ29tcGxpYW5jZSA6IHB1bGxpbmcgdXAgRXhwcmVzc2lvblN0YXRlbWVudCBpbnRvIEFzc2lnZW1lbnRFeHByZXNzaW9uXG4gICAgICAgIHJldHVybiBuZXcgQXNzaWdubWVudEV4cHJlc3Npb24ob3BlcmF0b3IsIGxocywgcmhzKVxuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjVHlwZW9mRXhwcmVzc2lvbi5cbiAgICB2aXNpdFR5cGVvZkV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuXG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNJbnN0YW5jZW9mRXhwcmVzc2lvbi5cbiAgICB2aXNpdEluc3RhbmNlb2ZFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcblxuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI1VuYXJ5UGx1c0V4cHJlc3Npb24uXG4gICAgdmlzaXRVbmFyeVBsdXNFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcblxuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI0RlbGV0ZUV4cHJlc3Npb24uXG4gICAgdmlzaXREZWxldGVFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNFcXVhbGl0eUV4cHJlc3Npb24uXG4gICAgdmlzaXRFcXVhbGl0eUV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCk6IEJpbmFyeUV4cHJlc3Npb24ge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJ2aXNpdEVxdWFsaXR5RXhwcmVzc2lvbiBbJXNdIDogJXNcIiwgY3R4LmdldENoaWxkQ291bnQoKSwgY3R4LmdldFRleHQoKSk7XG4gICAgICAgIHRoaXMuYXNzZXJ0VHlwZShjdHgsIEVDTUFTY3JpcHRQYXJzZXIuRXF1YWxpdHlFeHByZXNzaW9uQ29udGV4dCk7XG4gICAgICAgIHRoaXMuYXNzZXJ0Tm9kZUNvdW50KGN0eCwgMylcblxuICAgICAgICBsZXQgbGVmdCA9IGN0eC5nZXRDaGlsZCgwKTtcbiAgICAgICAgbGV0IG9wZXJhdG9yID0gY3R4LmdldENoaWxkKDEpLmdldFRleHQoKTsgLy8gTm8gdHlwZSAoICssLSApXG4gICAgICAgIGxldCByaWdodCA9IGN0eC5nZXRDaGlsZCgyKTtcbiAgICAgICAgbGV0IGxocyA9IHRoaXMuX3Zpc2l0QmluYXJ5RXhwcmVzc2lvbihsZWZ0KTtcbiAgICAgICAgbGV0IHJocyA9IHRoaXMuX3Zpc2l0QmluYXJ5RXhwcmVzc2lvbihyaWdodCk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuZGVjb3JhdGUobmV3IEJpbmFyeUV4cHJlc3Npb24ob3BlcmF0b3IsIGxocywgcmhzKSwge30pO1xuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjQml0WE9yRXhwcmVzc2lvbi5cbiAgICB2aXNpdEJpdFhPckV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuXG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNNdWx0aXBsaWNhdGl2ZUV4cHJlc3Npb24uXG4gICAgdmlzaXRNdWx0aXBsaWNhdGl2ZUV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCk6IEJpbmFyeUV4cHJlc3Npb24ge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJ2aXNpdE11bHRpcGxpY2F0aXZlRXhwcmVzc2lvbiBbJXNdIDogJXNcIiwgY3R4LmdldENoaWxkQ291bnQoKSwgY3R4LmdldFRleHQoKSk7XG4gICAgICAgIHRoaXMuYXNzZXJ0VHlwZShjdHgsIEVDTUFTY3JpcHRQYXJzZXIuTXVsdGlwbGljYXRpdmVFeHByZXNzaW9uQ29udGV4dCk7XG4gICAgICAgIHRoaXMuYXNzZXJ0Tm9kZUNvdW50KGN0eCwgMylcblxuICAgICAgICBsZXQgbGVmdCA9IGN0eC5nZXRDaGlsZCgwKTtcbiAgICAgICAgbGV0IG9wZXJhdG9yID0gY3R4LmdldENoaWxkKDEpLmdldFRleHQoKTsgLy8gTm8gdHlwZSAoICssLSApXG4gICAgICAgIGxldCByaWdodCA9IGN0eC5nZXRDaGlsZCgyKTtcbiAgICAgICAgbGV0IGxocyA9IHRoaXMudmlzaXRCaW5hcnlFeHByZXNzaW9uKGxlZnQpO1xuICAgICAgICBsZXQgcmhzID0gdGhpcy52aXNpdEJpbmFyeUV4cHJlc3Npb24ocmlnaHQpO1xuXG4gICAgICAgIHJldHVybiB0aGlzLmRlY29yYXRlKG5ldyBCaW5hcnlFeHByZXNzaW9uKG9wZXJhdG9yLCBsaHMsIHJocyksIHt9KTtcbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNCaXRTaGlmdEV4cHJlc3Npb24uXG4gICAgdmlzaXRCaXRTaGlmdEV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuXG4gICAgfVxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjUGFyZW50aGVzaXplZEV4cHJlc3Npb24uXG4gICAgdmlzaXRQYXJlbnRoZXNpemVkRXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0UGFyZW50aGVzaXplZEV4cHJlc3Npb24gWyVzXSA6ICVzXCIsIGN0eC5nZXRDaGlsZENvdW50KCksIGN0eC5nZXRUZXh0KCkpO1xuICAgICAgICB0aGlzLmFzc2VydFR5cGUoY3R4LCBFQ01BU2NyaXB0UGFyc2VyLlBhcmVudGhlc2l6ZWRFeHByZXNzaW9uQ29udGV4dCk7XG4gICAgICAgIHRoaXMuYXNzZXJ0Tm9kZUNvdW50KGN0eCwgMylcbiAgICAgICAgbGV0IGxlZnQgPSBjdHguZ2V0Q2hpbGQoMCk7XG4gICAgICAgIGxldCBleHByZXNzaW9uID0gY3R4LmdldENoaWxkKDEpO1xuICAgICAgICBsZXQgcmlnaHQgPSBjdHguZ2V0Q2hpbGQoMik7XG4gICAgICAgIHRoaXMuZHVtcENvbnRleHRBbGxDaGlsZHJlbihleHByZXNzaW9uKVxuICAgICAgICByZXR1cm4gdGhpcy52aXNpdEV4cHJlc3Npb25TZXF1ZW5jZShleHByZXNzaW9uKTtcbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNBZGRpdGl2ZUV4cHJlc3Npb24uXG4gICAgdmlzaXRBZGRpdGl2ZUV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCk6IEJpbmFyeUV4cHJlc3Npb24ge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJ2aXNpdEFkZGl0aXZlRXhwcmVzc2lvbiBbJXNdIDogJXNcIiwgY3R4LmdldENoaWxkQ291bnQoKSwgY3R4LmdldFRleHQoKSk7XG4gICAgICAgIHRoaXMuYXNzZXJ0VHlwZShjdHgsIEVDTUFTY3JpcHRQYXJzZXIuQWRkaXRpdmVFeHByZXNzaW9uQ29udGV4dCk7XG4gICAgICAgIHRoaXMuYXNzZXJ0Tm9kZUNvdW50KGN0eCwgMylcblxuICAgICAgICBjb25zdCBsZWZ0ID0gY3R4LmdldENoaWxkKDApO1xuICAgICAgICBjb25zdCBvcGVyYXRvciA9IGN0eC5nZXRDaGlsZCgxKS5nZXRUZXh0KCk7IC8vIE5vIHR5cGUgKCArLC0gKVxuICAgICAgICBjb25zdCByaWdodCA9IGN0eC5nZXRDaGlsZCgyKTtcbiAgICAgICAgY29uc3QgbGhzID0gdGhpcy5fdmlzaXRCaW5hcnlFeHByZXNzaW9uKGxlZnQpO1xuICAgICAgICBjb25zdCByaHMgPSB0aGlzLl92aXNpdEJpbmFyeUV4cHJlc3Npb24ocmlnaHQpO1xuICAgICAgICAvLyByZXR1cm4gdGhpcy5kZWNvcmF0ZShuZXcgQmluYXJ5RXhwcmVzc2lvbihvcGVyYXRvciwgbGhzICxyaHMpLCB0aGlzLmFzTWFya2VyKHRoaXMuYXNNZXRhZGF0YShjdHguc3ltYm9sKSkpO1xuICAgICAgICByZXR1cm4gbmV3IEJpbmFyeUV4cHJlc3Npb24ob3BlcmF0b3IsIGxocywgcmhzKTtcbiAgICB9XG5cbiAgICBfdmlzaXRCaW5hcnlFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcblxuICAgICAgICBjb25zb2xlLmluZm8oXCJldmFsQmluYXJ5RXhwcmVzc2lvbiBbJXNdIDogJXNcIiwgY3R4LmdldENoaWxkQ291bnQoKSwgY3R4LmdldFRleHQoKSk7XG4gICAgICAgIGlmIChjdHggaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLklkZW50aWZpZXJFeHByZXNzaW9uQ29udGV4dCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmlzaXRJZGVudGlmaWVyRXhwcmVzc2lvbihjdHgpO1xuICAgICAgICB9IGVsc2UgaWYgKGN0eCBpbnN0YW5jZW9mIEVDTUFTY3JpcHRQYXJzZXIuTGl0ZXJhbEV4cHJlc3Npb25Db250ZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy52aXNpdExpdGVyYWxFeHByZXNzaW9uKGN0eCk7XG4gICAgICAgIH0gZWxzZSBpZiAoY3R4IGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5BZGRpdGl2ZUV4cHJlc3Npb25Db250ZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy52aXNpdEFkZGl0aXZlRXhwcmVzc2lvbihjdHgpO1xuICAgICAgICB9IGVsc2UgaWYgKGN0eCBpbnN0YW5jZW9mIEVDTUFTY3JpcHRQYXJzZXIuTXVsdGlwbGljYXRpdmVFeHByZXNzaW9uQ29udGV4dCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmlzaXRNdWx0aXBsaWNhdGl2ZUV4cHJlc3Npb24oY3R4KTtcbiAgICAgICAgfSBlbHNlIGlmIChjdHggaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLlJlbGF0aW9uYWxFeHByZXNzaW9uQ29udGV4dCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmlzaXRSZWxhdGlvbmFsRXhwcmVzc2lvbihjdHgpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMudGhyb3dJbnNhbmNlRXJyb3IodGhpcy5kdW1wQ29udGV4dChjdHgpKTtcbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNSZWxhdGlvbmFsRXhwcmVzc2lvbi5cbiAgICB2aXNpdFJlbGF0aW9uYWxFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpOiBCaW5hcnlFeHByZXNzaW9uIHtcbiAgICAgICAgY29uc29sZS5pbmZvKFwidmlzaXRSZWxhdGlvbmFsRXhwcmVzc2lvbiBbJXNdIDogJXNcIiwgY3R4LmdldENoaWxkQ291bnQoKSwgY3R4LmdldFRleHQoKSk7XG4gICAgICAgIHRoaXMuYXNzZXJ0VHlwZShjdHgsIEVDTUFTY3JpcHRQYXJzZXIuUmVsYXRpb25hbEV4cHJlc3Npb25Db250ZXh0KTtcbiAgICAgICAgdGhpcy5hc3NlcnROb2RlQ291bnQoY3R4LCAzKVxuICAgICAgICBjb25zdCBsZWZ0ID0gY3R4LmdldENoaWxkKDApO1xuICAgICAgICBjb25zdCBvcGVyYXRvciA9IGN0eC5nZXRDaGlsZCgxKS5nZXRUZXh0KCk7IC8vIE5vIHR5cGUgKCArLC0gKVxuICAgICAgICBjb25zdCByaWdodCA9IGN0eC5nZXRDaGlsZCgyKTtcbiAgICAgICAgY29uc3QgbGhzID0gdGhpcy5fdmlzaXRCaW5hcnlFeHByZXNzaW9uKGxlZnQpO1xuICAgICAgICBjb25zdCByaHMgPSB0aGlzLl92aXNpdEJpbmFyeUV4cHJlc3Npb24ocmlnaHQpO1xuICAgICAgICAvLyByZXR1cm4gdGhpcy5kZWNvcmF0ZShuZXcgQmluYXJ5RXhwcmVzc2lvbihvcGVyYXRvciwgbGhzICxyaHMpLCB0aGlzLmFzTWFya2VyKHRoaXMuYXNNZXRhZGF0YShjdHguc3ltYm9sKSkpO1xuICAgICAgICByZXR1cm4gbmV3IEJpbmFyeUV4cHJlc3Npb24ob3BlcmF0b3IsIGxocywgcmhzKTtcbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNQb3N0SW5jcmVtZW50RXhwcmVzc2lvbi5cbiAgICB2aXNpdFBvc3RJbmNyZW1lbnRFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNCaXROb3RFeHByZXNzaW9uLlxuICAgIHZpc2l0Qml0Tm90RXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG5cbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI05ld0V4cHJlc3Npb24uXG4gICAgdmlzaXROZXdFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcblxuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjTGl0ZXJhbEV4cHJlc3Npb24uXG4gICAgdmlzaXRMaXRlcmFsRXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0TGl0ZXJhbEV4cHJlc3Npb24gWyVzXSA6IFslc11cIiwgY3R4LmdldENoaWxkQ291bnQoKSwgY3R4LmdldFRleHQoKSk7XG4gICAgICAgIHRoaXMuYXNzZXJ0VHlwZShjdHgsIEVDTUFTY3JpcHRQYXJzZXIuTGl0ZXJhbEV4cHJlc3Npb25Db250ZXh0KTtcbiAgICAgICAgdGhpcy5hc3NlcnROb2RlQ291bnQoY3R4LCAxKTtcbiAgICAgICAgLy8gdmlzaXRMaXRlcmFsRXhwcmVzc2lvbjogPiB2aXNpdExpdGVyYWxcbiAgICAgICAgbGV0IG5vZGUgPSBjdHguZ2V0Q2hpbGQoMClcbiAgICAgICAgaWYgKG5vZGUgaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLkxpdGVyYWxDb250ZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy52aXNpdExpdGVyYWwobm9kZSk7XG4gICAgICAgIH0gZWxzZSBpZiAobm9kZSBpbnN0YW5jZW9mIEVDTUFTY3JpcHRQYXJzZXIuTnVtZXJpY0xpdGVyYWxDb250ZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy52aXNpdE51bWVyaWNMaXRlcmFsKG5vZGUpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMudGhyb3dJbnNhbmNlRXJyb3IodGhpcy5kdW1wQ29udGV4dChub2RlKSk7XG4gICAgfVxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjQXJyYXlMaXRlcmFsRXhwcmVzc2lvbi5cbiAgICB2aXNpdEFycmF5TGl0ZXJhbEV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCk6IEFycmF5RXhwcmVzc2lvbiB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0QXJyYXlMaXRlcmFsRXhwcmVzc2lvbiBbJXNdIDogJXNcIiwgY3R4LmdldENoaWxkQ291bnQoKSwgY3R4LmdldFRleHQoKSk7XG4gICAgICAgIHRoaXMuYXNzZXJ0VHlwZShjdHgsIEVDTUFTY3JpcHRQYXJzZXIuQXJyYXlMaXRlcmFsRXhwcmVzc2lvbkNvbnRleHQpO1xuICAgICAgICB0aGlzLmFzc2VydE5vZGVDb3VudChjdHgsIDEpO1xuICAgICAgICBjb25zdCBub2RlID0gY3R4LmdldENoaWxkKDApO1xuICAgICAgICBjb25zdCBlbGVtZW50cyA9IHRoaXMudmlzaXRBcnJheUxpdGVyYWwobm9kZSk7XG4gICAgICAgIHJldHVybiBuZXcgQXJyYXlFeHByZXNzaW9uKGVsZW1lbnRzKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAvLyBjb21wdXRlZCA9IGZhbHNlIGB4LnpgXG4gICAgICogLy8gY29tcHV0ZWQgPSB0cnVlIGB5WzFdYFxuICAgICAqIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI01lbWJlckRvdEV4cHJlc3Npb24uXG4gICAgICovXG4gICAgdmlzaXRNZW1iZXJEb3RFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpOiBTdGF0aWNNZW1iZXJFeHByZXNzaW9uIHtcbiAgICAgICAgY29uc29sZS5pbmZvKFwidmlzaXRBcnJheUxpdGVyYWxFeHByZXNzaW9uIFslc10gOiAlc1wiLCBjdHguZ2V0Q2hpbGRDb3VudCgpLCBjdHguZ2V0VGV4dCgpKTtcbiAgICAgICAgdGhpcy5hc3NlcnRUeXBlKGN0eCwgRUNNQVNjcmlwdFBhcnNlci5NZW1iZXJEb3RFeHByZXNzaW9uQ29udGV4dCk7XG4gICAgICAgIHRoaXMuYXNzZXJ0Tm9kZUNvdW50KGN0eCwgMyk7XG4gICAgICAgIGNvbnN0IGV4cHIgPSB0aGlzLnNpbmdsZUV4cHJlc3Npb24oY3R4LmdldENoaWxkKDApKTtcbiAgICAgICAgY29uc3QgcHJvcGVydHkgPSB0aGlzLnZpc2l0SWRlbnRpZmllck5hbWUoY3R4LmdldENoaWxkKDIpKTtcbiAgICAgICAgcmV0dXJuIG5ldyBTdGF0aWNNZW1iZXJFeHByZXNzaW9uKGV4cHIsIHByb3BlcnR5KTtcbiAgICB9XG5cbiAgICBwcmludChjdHg6IFJ1bGVDb250ZXh0KTogdm9pZCB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcIiAqKioqKiAgXCIpXG4gICAgICAgIGNvbnN0IHZpc2l0b3IgPSBuZXcgUHJpbnRWaXNpdG9yKCk7XG4gICAgICAgIGN0eC5hY2NlcHQodmlzaXRvcik7XG4gICAgfVxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjTWVtYmVySW5kZXhFeHByZXNzaW9uLlxuICAgIHZpc2l0TWVtYmVySW5kZXhFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpOiBDb21wdXRlZE1lbWJlckV4cHJlc3Npb24ge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJ2aXNpdE1lbWJlckluZGV4RXhwcmVzc2lvbiBbJXNdIDogJXNcIiwgY3R4LmdldENoaWxkQ291bnQoKSwgY3R4LmdldFRleHQoKSk7XG4gICAgICAgIHRoaXMuYXNzZXJ0VHlwZShjdHgsIEVDTUFTY3JpcHRQYXJzZXIuTWVtYmVySW5kZXhFeHByZXNzaW9uQ29udGV4dCk7XG4gICAgICAgIHRoaXMuYXNzZXJ0Tm9kZUNvdW50KGN0eCwgNCk7XG4gICAgICAgIGNvbnN0IGV4cHIgPSB0aGlzLnNpbmdsZUV4cHJlc3Npb24oY3R4LmdldENoaWxkKDApKTtcbiAgICAgICAgY29uc3QgcHJvcGVydHkgPSB0aGlzLnZpc2l0RXhwcmVzc2lvblNlcXVlbmNlKGN0eC5nZXRDaGlsZCgyKSk7XG4gICAgICAgIHJldHVybiBuZXcgQ29tcHV0ZWRNZW1iZXJFeHByZXNzaW9uKGV4cHIsIHByb3BlcnR5KTtcbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNJZGVudGlmaWVyRXhwcmVzc2lvbi5cbiAgICB2aXNpdElkZW50aWZpZXJFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpOiBJZGVudGlmaWVyIHtcbiAgICAgICAgY29uc29sZS5pbmZvKFwidmlzaXRJZGVudGlmaWVyRXhwcmVzc2lvbiBbJXNdIDogJXNcIiwgY3R4LmdldENoaWxkQ291bnQoKSwgY3R4LmdldFRleHQoKSk7XG4gICAgICAgIHRoaXMuYXNzZXJ0VHlwZShjdHgsIEVDTUFTY3JpcHRQYXJzZXIuSWRlbnRpZmllckV4cHJlc3Npb25Db250ZXh0KTtcbiAgICAgICAgdGhpcy5hc3NlcnROb2RlQ291bnQoY3R4LCAxKVxuICAgICAgICBjb25zdCBpbml0aWFsaXNlciA9IGN0eC5nZXRDaGlsZCgwKTtcbiAgICAgICAgY29uc3QgbmFtZSA9IGluaXRpYWxpc2VyLmdldFRleHQoKTtcbiAgICAgICAgLy8gcmV0dXJuIHRoaXMuZGVjb3JhdGUobmV3IElkZW50aWZpZXIobmFtZSksIHRoaXMuYXNNYXJrZXIodGhpcy5hc01ldGFkYXRhKGluaXRpYWxpc2VyLnN5bWJvbCkpKVxuICAgICAgICByZXR1cm4gbmV3IElkZW50aWZpZXIobmFtZSk7XG4gICAgfVxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjaWRlbnRpZmllci5cbiAgICB2aXNpdElkZW50aWZpZXIoY3R4OiBSdWxlQ29udGV4dCk6IElkZW50aWZpZXIge1xuICAgICAgICB0aGlzLmxvZyhjdHgsIFRyYWNlLmZyYW1lKCkpO1xuICAgICAgICB0aGlzLmFzc2VydFR5cGUoY3R4LCBFQ01BU2NyaXB0UGFyc2VyLklkZW50aWZpZXJDb250ZXh0KVxuICAgICAgICByZXR1cm4gbmV3IElkZW50aWZpZXIoY3R4LmdldENoaWxkKDApLmdldFRleHQoKSlcbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNCaXRBbmRFeHByZXNzaW9uLlxuICAgIHZpc2l0Qml0QW5kRXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gICAgfVxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjQml0T3JFeHByZXNzaW9uLlxuICAgIHZpc2l0Qml0T3JFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNBc3NpZ25tZW50T3BlcmF0b3JFeHByZXNzaW9uLlxuICAgICAqIFxuICAgICAqIDxhc3NvYz1yaWdodD4gc2luZ2xlRXhwcmVzc2lvbiBhc3NpZ25tZW50T3BlcmF0b3Igc2luZ2xlRXhwcmVzc2lvbiAgICAjIEFzc2lnbm1lbnRPcGVyYXRvckV4cHJlc3Npb25cbiAgICAgKiBAcGFyYW0gY3R4IFxuICAgICAqL1xuICAgIHZpc2l0QXNzaWdubWVudE9wZXJhdG9yRXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KTogQXNzaWdubWVudEV4cHJlc3Npb24ge1xuICAgICAgICB0aGlzLmxvZyhjdHgsIFRyYWNlLmZyYW1lKCkpXG4gICAgICAgIHRoaXMuYXNzZXJ0VHlwZShjdHgsIEVDTUFTY3JpcHRQYXJzZXIuQXNzaWdubWVudE9wZXJhdG9yRXhwcmVzc2lvbkNvbnRleHQpO1xuICAgICAgICB0aGlzLmFzc2VydE5vZGVDb3VudChjdHgsIDMpXG4gICAgICAgIGNvbnN0IGluaXRpYWxpc2VyID0gY3R4LmdldENoaWxkKDApO1xuICAgICAgICBjb25zdCBvcGVyYXRvciA9IGN0eC5nZXRDaGlsZCgxKS5nZXRUZXh0KCk7XG4gICAgICAgIGNvbnN0IGV4cHJlc3Npb24gPSBjdHguZ2V0Q2hpbGQoMik7XG4gICAgICAgIGNvbnN0IGxocyA9IHRoaXMuc2luZ2xlRXhwcmVzc2lvbihpbml0aWFsaXNlcik7XG4gICAgICAgIGNvbnN0IHJocyA9IHRoaXMuc2luZ2xlRXhwcmVzc2lvbihleHByZXNzaW9uKTtcblxuICAgICAgICAvLyBDb21wbGlhbmNlIDogcHVsbGluZyB1cCBFeHByZXNzaW9uU3RhdGVtZW50IGludG8gQXNzaWdlbWVudEV4cHJlc3Npb25cbiAgICAgICAgcmV0dXJuIG5ldyBBc3NpZ25tZW50RXhwcmVzc2lvbihvcGVyYXRvciwgbGhzLCByaHMuZXhwcmVzc2lvbilcbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNWb2lkRXhwcmVzc2lvbi5cbiAgICB2aXNpdFZvaWRFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcblxuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2Fzc2lnbm1lbnRPcGVyYXRvci5cbiAgICB2aXNpdEFzc2lnbm1lbnRPcGVyYXRvcihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0QXNzaWdubWVudE9wZXJhdG9yIFslc10gOiBbJXNdXCIsIGN0eC5nZXRDaGlsZENvdW50KCksIGN0eC5nZXRUZXh0KCkpO1xuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2xpdGVyYWwuXG4gICAgdmlzaXRMaXRlcmFsKGN0eDogUnVsZUNvbnRleHQpOiBMaXRlcmFsIHtcbiAgICAgICAgY29uc29sZS5pbmZvKFwidmlzaXRMaXRlcmFsIFslc10gOiBbJXNdXCIsIGN0eC5nZXRDaGlsZENvdW50KCksIGN0eC5nZXRUZXh0KCkpO1xuICAgICAgICB0aGlzLmFzc2VydFR5cGUoY3R4LCBFQ01BU2NyaXB0UGFyc2VyLkxpdGVyYWxDb250ZXh0KVxuICAgICAgICB0aGlzLmFzc2VydE5vZGVDb3VudChjdHgsIDEpO1xuICAgICAgICBjb25zdCBub2RlOiBSdWxlQ29udGV4dCA9IGN0eC5nZXRDaGlsZCgwKTtcblxuICAgICAgICBpZiAobm9kZS5nZXRDaGlsZENvdW50KCkgPT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY3JlYXRlTGl0ZXJhbFZhbHVlKG5vZGUpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKG5vZGUuZ2V0Q2hpbGRDb3VudCgpID09IDEpIHtcbiAgICAgICAgICAgIGlmIChub2RlIGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5OdW1lcmljTGl0ZXJhbENvbnRleHQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy52aXNpdE51bWVyaWNMaXRlcmFsKG5vZGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy50aHJvd0luc2FuY2VFcnJvcih0aGlzLmR1bXBDb250ZXh0KG5vZGUpKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnRocm93SW5zYW5jZUVycm9yKHRoaXMuZHVtcENvbnRleHQobm9kZSkpO1xuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI251bWVyaWNMaXRlcmFsLlxuICAgIHZpc2l0TnVtZXJpY0xpdGVyYWwoY3R4OiBSdWxlQ29udGV4dCk6IExpdGVyYWwge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJ2aXNpdE51bWVyaWNMaXRlcmFsIFslc10gOiBbJXNdXCIsIGN0eC5nZXRDaGlsZENvdW50KCksIGN0eC5nZXRUZXh0KCkpO1xuICAgICAgICB0aGlzLmFzc2VydFR5cGUoY3R4LCBFQ01BU2NyaXB0UGFyc2VyLk51bWVyaWNMaXRlcmFsQ29udGV4dClcbiAgICAgICAgdGhpcy5hc3NlcnROb2RlQ291bnQoY3R4LCAxKTtcbiAgICAgICAgY29uc3QgdmFsdWUgPSBjdHguZ2V0VGV4dCgpO1xuICAgICAgICAvLyBUT0RPIDogRmlndXJlIG91dCBiZXR0ZXIgd2F5XG4gICAgICAgIGNvbnN0IGxpdGVyYWwgPSBuZXcgTGl0ZXJhbChOdW1iZXIodmFsdWUpLCB2YWx1ZSk7XG4gICAgICAgIHJldHVybiB0aGlzLmRlY29yYXRlKGxpdGVyYWwsIHRoaXMuYXNNYXJrZXIodGhpcy5hc01ldGFkYXRhKGN0eC5nZXRTb3VyY2VJbnRlcnZhbCgpKSkpXG4gICAgfVxuXG4gICAgY3JlYXRlTGl0ZXJhbFZhbHVlKGN0eDogUnVsZUNvbnRleHQpOiBMaXRlcmFsIHtcbiAgICAgICAgY29uc29sZS5pbmZvKFwiY3JlYXRlTGl0ZXJhbFZhbHVlIFslc106IFslc11cIiwgY3R4LmdldENoaWxkQ291bnQoKSwgY3R4LmdldFRleHQoKSk7XG4gICAgICAgIGNvbnN0IHZhbHVlID0gY3R4LmdldFRleHQoKTtcbiAgICAgICAgY29uc3QgbGl0ZXJhbCA9IG5ldyBMaXRlcmFsKHZhbHVlLCB2YWx1ZSk7XG4gICAgICAgIHJldHVybiB0aGlzLmRlY29yYXRlKGxpdGVyYWwsIHRoaXMuYXNNYXJrZXIodGhpcy5hc01ldGFkYXRhKGN0eC5nZXRTb3VyY2VJbnRlcnZhbCgpKSkpXG4gICAgfVxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjaWRlbnRpZmllck5hbWUuXG4gICAgdmlzaXRJZGVudGlmaWVyTmFtZShjdHg6IFJ1bGVDb250ZXh0KTogSWRlbnRpZmllciB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0SWRlbnRpZmllck5hbWUgWyVzXTogWyVzXVwiLCBjdHguZ2V0Q2hpbGRDb3VudCgpLCBjdHguZ2V0VGV4dCgpKTtcbiAgICAgICAgdGhpcy5hc3NlcnRUeXBlKGN0eCwgRUNNQVNjcmlwdFBhcnNlci5JZGVudGlmaWVyTmFtZUNvbnRleHQpXG4gICAgICAgIHRoaXMuYXNzZXJ0Tm9kZUNvdW50KGN0eCwgMSk7XG4gICAgICAgIGNvbnN0IHZhbHVlID0gY3R4LmdldFRleHQoKTtcbiAgICAgICAgY29uc3QgaWRlbnRpZmllciA9IG5ldyBJZGVudGlmaWVyKHZhbHVlKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGVjb3JhdGUoaWRlbnRpZmllciwgdGhpcy5hc01hcmtlcih0aGlzLmFzTWV0YWRhdGEoY3R4LmdldFNvdXJjZUludGVydmFsKCkpKSlcbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNyZXNlcnZlZFdvcmQuXG4gICAgdmlzaXRSZXNlcnZlZFdvcmQoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJ2aXNpdFJlc2VydmVkV29yZDogXCIgKyBjdHguZ2V0VGV4dCgpKTtcbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNrZXl3b3JkLlxuICAgIHZpc2l0S2V5d29yZChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0S2V5d29yZDogXCIgKyBjdHguZ2V0VGV4dCgpKTtcblxuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjZnV0dXJlUmVzZXJ2ZWRXb3JkLlxuICAgIHZpc2l0RnV0dXJlUmVzZXJ2ZWRXb3JkKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNnZXR0ZXIuXG4gICAgdmlzaXRHZXR0ZXIoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgIH1cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNzZXR0ZXIuXG4gICAgdmlzaXRTZXR0ZXIoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2Vvcy5cbiAgICB2aXNpdEVvcyhjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIC8vY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNlb2YuXG4gICAgdmlzaXRFb2YoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgIH1cblxufSJdfQ==