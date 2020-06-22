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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9BU1RQYXJzZXIudHMiXSwibmFtZXMiOlsiUGFyc2VyVHlwZSIsIkFTVFBhcnNlciIsImNvbnN0cnVjdG9yIiwidmlzaXRvciIsIkRlbHZlbkFTVFZpc2l0b3IiLCJnZW5lcmF0ZSIsInNvdXJjZSIsImNvZGUiLCJ0eXBlIiwidmFsdWUiLCJmcyIsInJlYWRGaWxlU3luYyIsImNoYXJzIiwiYW50bHI0IiwiSW5wdXRTdHJlYW0iLCJsZXhlciIsIkRlbHZlbkxleGVyIiwidG9rZW5zIiwiQ29tbW9uVG9rZW5TdHJlYW0iLCJwYXJzZXIiLCJEZWx2ZW5QYXJzZXIiLCJ0cmVlIiwicHJvZ3JhbSIsImFjY2VwdCIsIlByaW50VmlzaXRvciIsImNvbnNvbGUiLCJpbmZvIiwicmVzdWx0IiwicGFyc2UiLCJFQ01BU2NyaXB0IiwiQVNUUGFyc2VyRGVmYXVsdCIsIkVycm9yIiwiRGVsdmVuVmlzaXRvciIsInJ1bGVUeXBlTWFwIiwiTWFwIiwic2V0dXBUeXBlUnVsZXMiLCJrZXlzIiwiT2JqZWN0IiwiZ2V0T3duUHJvcGVydHlOYW1lcyIsImtleSIsIm5hbWUiLCJzdGFydHNXaXRoIiwic2V0IiwicGFyc2VJbnQiLCJsb2ciLCJjdHgiLCJmcmFtZSIsImZ1bmN0aW9uIiwiZ2V0Q2hpbGRDb3VudCIsImdldFRleHQiLCJkdW1wQ29udGV4dCIsImNvbnRleHQiLCJlbmRzV2l0aCIsInB1c2giLCJsZW5ndGgiLCJjb250ZXh0TmFtZSIsImxvbmdlc3QiLCJvYmoiLCJFQ01BU2NyaXB0UGFyc2VyIiwiY2hhaW4iLCJwcm90b3R5cGUiLCJfX3Byb3RvX18iLCJkdW1wQ29udGV4dEFsbENoaWxkcmVuIiwiaW5kZW50IiwicGFkIiwicGFkU3RhcnQiLCJub2RlcyIsIm1hcmtlciIsImkiLCJjaGlsZCIsImdldENoaWxkIiwiZ2V0UnVsZUJ5SWQiLCJpZCIsImdldCIsImFzTWFya2VyIiwibWV0YWRhdGEiLCJpbmRleCIsImxpbmUiLCJjb2x1bW4iLCJkZWNvcmF0ZSIsIm5vZGUiLCJzdGFydCIsImVuZCIsImFzTWV0YWRhdGEiLCJpbnRlcnZhbCIsIm9mZnNldCIsInN0b3AiLCJ0aHJvd1R5cGVFcnJvciIsInR5cGVJZCIsIlR5cGVFcnJvciIsInRocm93SW5zYW5jZUVycm9yIiwiYXNzZXJ0VHlwZSIsInZpc2l0UHJvZ3JhbSIsIlRyYWNlIiwiUHJvZ3JhbUNvbnRleHQiLCJzdGF0ZW1lbnRzIiwic3RtIiwiU3RhdGVtZW50Q29udGV4dCIsInN0YXRlbWVudCIsInZpc2l0U3RhdGVtZW50IiwiZ2V0U291cmNlSW50ZXJ2YWwiLCJzY3JpcHQiLCJTY3JpcHQiLCJCbG9ja0NvbnRleHQiLCJ2aXNpdEJsb2NrIiwiVmFyaWFibGVTdGF0ZW1lbnRDb250ZXh0IiwidmlzaXRWYXJpYWJsZVN0YXRlbWVudCIsIkltcG9ydFN0YXRlbWVudENvbnRleHQiLCJ2aXNpdEltcG9ydFN0YXRlbWVudCIsIkV4cG9ydFN0YXRlbWVudENvbnRleHQiLCJ2aXNpdEV4cG9ydFN0YXRlbWVudCIsIkVtcHR5U3RhdGVtZW50Q29udGV4dCIsIkNsYXNzRGVjbGFyYXRpb25Db250ZXh0IiwidmlzaXRDbGFzc0RlY2xhcmF0aW9uIiwiRXhwcmVzc2lvblN0YXRlbWVudENvbnRleHQiLCJ2aXNpdEV4cHJlc3Npb25TdGF0ZW1lbnQiLCJJZlN0YXRlbWVudENvbnRleHQiLCJ2aXNpdElmU3RhdGVtZW50IiwiSXRlcmF0aW9uU3RhdGVtZW50Q29udGV4dCIsInZpc2l0SXRlcmF0aW9uU3RhdGVtZW50IiwiQ29udGludWVTdGF0ZW1lbnRDb250ZXh0IiwidmlzaXRDb250aW51ZVN0YXRlbWVudCIsIkJyZWFrU3RhdGVtZW50Q29udGV4dCIsInZpc2l0QnJlYWtTdGF0ZW1lbnQiLCJSZXR1cm5TdGF0ZW1lbnRDb250ZXh0IiwidmlzaXRSZXR1cm5TdGF0ZW1lbnQiLCJZaWVsZFN0YXRlbWVudENvbnRleHQiLCJ2aXNpdFlpZWxkU3RhdGVtZW50IiwiV2l0aFN0YXRlbWVudENvbnRleHQiLCJ2aXNpdFdpdGhTdGF0ZW1lbnQiLCJMYWJlbGxlZFN0YXRlbWVudENvbnRleHQiLCJ2aXNpdExhYmVsbGVkU3RhdGVtZW50IiwiU3dpdGNoU3RhdGVtZW50Q29udGV4dCIsInZpc2l0U3dpdGNoU3RhdGVtZW50IiwiRnVuY3Rpb25FeHByZXNzaW9uQ29udGV4dCIsInZpc2l0RnVuY3Rpb25FeHByZXNzaW9uIiwiVGhyb3dTdGF0ZW1lbnRDb250ZXh0IiwidmlzaXRUaHJvd1N0YXRlbWVudCIsIlRyeVN0YXRlbWVudENvbnRleHQiLCJ2aXNpdFRyeVN0YXRlbWVudCIsIkRlYnVnZ2VyU3RhdGVtZW50Q29udGV4dCIsInZpc2l0RGVidWdnZXJTdGF0ZW1lbnQiLCJGdW5jdGlvbkRlY2xhcmF0aW9uQ29udGV4dCIsInZpc2l0RnVuY3Rpb25EZWNsYXJhdGlvbiIsImJvZHkiLCJTdGF0ZW1lbnRMaXN0Q29udGV4dCIsInN0YXRlbWVudExpc3QiLCJ2aXNpdFN0YXRlbWVudExpc3QiLCJCbG9ja1N0YXRlbWVudCIsImZpbHRlclN5bWJvbHMiLCJnZXRUeXBlZFJ1bGVDb250ZXh0IiwiVmFyaWFibGVEZWNsYXJhdGlvbkxpc3RDb250ZXh0IiwidmlzaXRWYXJpYWJsZURlY2xhcmF0aW9uTGlzdCIsInZhck1vZGlmaWVyQ29udGV4dCIsIlZhck1vZGlmaWVyQ29udGV4dCIsInZhck1vZGlmaWVyIiwiZGVjbGFyYXRpb25zIiwiVmFyaWFibGVEZWNsYXJhdGlvbkNvbnRleHQiLCJ2aXNpdFZhcmlhYmxlRGVjbGFyYXRpb24iLCJWYXJpYWJsZURlY2xhcmF0aW9uIiwiYXNzaWduYWJsZUNvbnRleHQiLCJBc3NpZ25hYmxlQ29udGV4dCIsImFzc2lnbmFibGUiLCJ2aXNpdEFzc2lnbmFibGUiLCJpbml0Iiwic2luZ2xlRXhwcmVzc2lvbiIsIlZhcmlhYmxlRGVjbGFyYXRvciIsInZpc2l0SW5pdGlhbGlzZXIiLCJJbml0aWFsaXNlckNvbnRleHQiLCJhc3NlcnROb2RlQ291bnQiLCJPYmplY3RMaXRlcmFsRXhwcmVzc2lvbkNvbnRleHQiLCJ2aXNpdE9iamVjdExpdGVyYWxFeHByZXNzaW9uIiwiQXJyYXlMaXRlcmFsRXhwcmVzc2lvbkNvbnRleHQiLCJ2aXNpdEFycmF5TGl0ZXJhbEV4cHJlc3Npb24iLCJ2aXNpdEVtcHR5U3RhdGVtZW50IiwiY291bnQiLCJleHAiLCJFeHByZXNzaW9uU2VxdWVuY2VDb250ZXh0IiwidmlzaXRFeHByZXNzaW9uU2VxdWVuY2UiLCJ0ZXN0IiwiY29uc2VxdWVudCIsImFsdGVybmF0ZSIsInVuZGVmaW5lZCIsIklmU3RhdGVtZW50IiwidmlzaXREb1N0YXRlbWVudCIsInZpc2l0V2hpbGVTdGF0ZW1lbnQiLCJ2aXNpdEZvclN0YXRlbWVudCIsInZpc2l0Rm9yVmFyU3RhdGVtZW50IiwidHJhY2UiLCJ2aXNpdEZvckluU3RhdGVtZW50IiwidmlzaXRGb3JWYXJJblN0YXRlbWVudCIsInZpc2l0Q2FzZUJsb2NrIiwidmlzaXRDYXNlQ2xhdXNlcyIsInZpc2l0Q2FzZUNsYXVzZSIsInZpc2l0RGVmYXVsdENsYXVzZSIsInZpc2l0Q2F0Y2hQcm9kdWN0aW9uIiwidmlzaXRGaW5hbGx5UHJvZHVjdGlvbiIsImFzeW5jIiwiZ2VuZXJhdG9yIiwiaWRlbnRpZmllciIsInBhcmFtcyIsInN5bWJvbCIsInR4dCIsIklkZW50aWZpZXJDb250ZXh0IiwidmlzaXRJZGVudGlmaWVyIiwiRm9ybWFsUGFyYW1ldGVyTGlzdENvbnRleHQiLCJ2aXNpdEZvcm1hbFBhcmFtZXRlckxpc3QiLCJGdW5jdGlvbkJvZHlDb250ZXh0IiwiQXN5bmNGdW5jdGlvbkRlY2xhcmF0aW9uIiwiRnVuY3Rpb25EZWNsYXJhdGlvbiIsInBhcm1hcyIsInZpc2l0RnVuY3Rpb25EZWNsIiwiRnVuY3Rpb25EZWNsQ29udGV4dCIsInZpc2l0RnVuY3Rpb25Cb2R5IiwidmlzaXRBcnJheUxpdGVyYWwiLCJBcnJheUxpdGVyYWxDb250ZXh0IiwidmlzaXRFbGVtZW50TGlzdCIsIkVsZW1lbnRMaXN0Q29udGV4dCIsImVsZW1lbnRzIiwiZWxlbSIsInZpc2l0RWxpc2lvbiIsIkVsaXNpb25Db250ZXh0IiwiZWxpc2lvbiIsInZpc2l0T2JqZWN0TGl0ZXJhbCIsIk9iamVjdExpdGVyYWxDb250ZXh0IiwiT2JqZWN0RXhwcmVzc2lvbiIsInByb3BlcnRpZXMiLCJwcm9wZXJ0eSIsIlByb3BlcnR5RXhwcmVzc2lvbkFzc2lnbm1lbnRDb250ZXh0IiwidmlzaXRQcm9wZXJ0eUV4cHJlc3Npb25Bc3NpZ25tZW50IiwiUHJvcGVydHlTaG9ydGhhbmRDb250ZXh0IiwidmlzaXRQcm9wZXJ0eVNob3J0aGFuZCIsIkZ1bmN0aW9uUHJvcGVydHlDb250ZXh0IiwidmlzaXRGdW5jdGlvblByb3BlcnR5IiwiY29tcHV0ZWQiLCJtZXRob2QiLCJzaG9ydGhhbmQiLCJJZGVudGlmaWVyIiwiUHJvcGVydHkiLCJ2aXNpdFByb3BlcnR5TmFtZUFuZFZhbHVlTGlzdCIsIlByb3BlcnR5TmFtZUFuZFZhbHVlTGlzdENvbnRleHQiLCJmaWx0ZXJlZCIsIm4wIiwibjEiLCJuMiIsInZpc2l0UHJvcGVydHlOYW1lIiwiQ29tcHV0ZWRQcm9wZXJ0eUV4cHJlc3Npb25Bc3NpZ25tZW50Q29udGV4dCIsIlByb3BlcnR5R2V0dGVyQ29udGV4dCIsIlByb3BlcnR5U2V0dGVyQ29udGV4dCIsInZpc2l0UHJvcGVydHlHZXR0ZXIiLCJ2aXNpdFByb3BlcnR5U2V0dGVyIiwiUHJvcGVydHlOYW1lQ29udGV4dCIsImNyZWF0ZUxpdGVyYWxWYWx1ZSIsInZpc2l0SWRlbnRpZmllck5hbWUiLCJ2aXNpdFByb3BlcnR5U2V0UGFyYW1ldGVyTGlzdCIsInZpc2l0QXJndW1lbnRzIiwidmlzaXRBcmd1bWVudExpc3QiLCJleHByZXNzaW9ucyIsIkV4cHJlc3Npb25TdGF0ZW1lbnQiLCJTZXF1ZW5jZUV4cHJlc3Npb24iLCJMaXRlcmFsRXhwcmVzc2lvbkNvbnRleHQiLCJ2aXNpdExpdGVyYWxFeHByZXNzaW9uIiwiQXNzaWdubWVudEV4cHJlc3Npb25Db250ZXh0IiwidmlzaXRBc3NpZ25tZW50RXhwcmVzc2lvbiIsIkFkZGl0aXZlRXhwcmVzc2lvbkNvbnRleHQiLCJ2aXNpdEFkZGl0aXZlRXhwcmVzc2lvbiIsIk11bHRpcGxpY2F0aXZlRXhwcmVzc2lvbkNvbnRleHQiLCJ2aXNpdE11bHRpcGxpY2F0aXZlRXhwcmVzc2lvbiIsIkVxdWFsaXR5RXhwcmVzc2lvbkNvbnRleHQiLCJ2aXNpdEVxdWFsaXR5RXhwcmVzc2lvbiIsIlBhcmVudGhlc2l6ZWRFeHByZXNzaW9uQ29udGV4dCIsInZpc2l0UGFyZW50aGVzaXplZEV4cHJlc3Npb24iLCJSZWxhdGlvbmFsRXhwcmVzc2lvbkNvbnRleHQiLCJ2aXNpdFJlbGF0aW9uYWxFeHByZXNzaW9uIiwiSWRlbnRpZmllckV4cHJlc3Npb25Db250ZXh0IiwidmlzaXRJZGVudGlmaWVyRXhwcmVzc2lvbiIsIk1lbWJlckRvdEV4cHJlc3Npb25Db250ZXh0IiwidmlzaXRNZW1iZXJEb3RFeHByZXNzaW9uIiwiTWVtYmVySW5kZXhFeHByZXNzaW9uQ29udGV4dCIsInZpc2l0TWVtYmVySW5kZXhFeHByZXNzaW9uIiwiQXNzaWdubWVudE9wZXJhdG9yRXhwcmVzc2lvbkNvbnRleHQiLCJ2aXNpdEFzc2lnbm1lbnRPcGVyYXRvckV4cHJlc3Npb24iLCJ2aXNpdENsYXNzVGFpbCIsImNsYXNzQm9keSIsIkNsYXNzQm9keSIsIkNsYXNzRGVjbGFyYXRpb24iLCJDbGFzc1RhaWxDb250ZXh0IiwiZ2V0Tm9kZUJ5VHlwZSIsIkNsYXNzRWxlbWVudENvbnRleHQiLCJ2aXNpdENsYXNzRWxlbWVudCIsInZpc2l0TWV0aG9kRGVmaW5pdGlvbiIsImZvcm1hbCIsIkZvcm1hbFBhcmFtZXRlckFyZ0NvbnRleHQiLCJwYXJhbWV0ZXIiLCJ2aXNpdEZvcm1hbFBhcmFtZXRlckFyZyIsIkFzc2lnbm1lbnRQYXR0ZXJuIiwidmlzaXRMYXN0Rm9ybWFsUGFyYW1ldGVyQXJnIiwidmlzaXRUZXJuYXJ5RXhwcmVzc2lvbiIsInZpc2l0TG9naWNhbEFuZEV4cHJlc3Npb24iLCJ2aXNpdFByZUluY3JlbWVudEV4cHJlc3Npb24iLCJ2aXNpdEluRXhwcmVzc2lvbiIsInZpc2l0TG9naWNhbE9yRXhwcmVzc2lvbiIsInZpc2l0Tm90RXhwcmVzc2lvbiIsInZpc2l0UHJlRGVjcmVhc2VFeHByZXNzaW9uIiwidmlzaXRBcmd1bWVudHNFeHByZXNzaW9uIiwidmlzaXRUaGlzRXhwcmVzc2lvbiIsImRlY2wiLCJ2aXNpdFVuYXJ5TWludXNFeHByZXNzaW9uIiwidmlzaXRQb3N0RGVjcmVhc2VFeHByZXNzaW9uIiwiaW5pdGlhbGlzZXIiLCJvcGVyYXRvciIsImV4cHJlc3Npb24iLCJsaHMiLCJyaHMiLCJBc3NpZ25tZW50RXhwcmVzc2lvbiIsInZpc2l0VHlwZW9mRXhwcmVzc2lvbiIsInZpc2l0SW5zdGFuY2VvZkV4cHJlc3Npb24iLCJ2aXNpdFVuYXJ5UGx1c0V4cHJlc3Npb24iLCJ2aXNpdERlbGV0ZUV4cHJlc3Npb24iLCJsZWZ0IiwicmlnaHQiLCJfdmlzaXRCaW5hcnlFeHByZXNzaW9uIiwiQmluYXJ5RXhwcmVzc2lvbiIsInZpc2l0Qml0WE9yRXhwcmVzc2lvbiIsInZpc2l0QmluYXJ5RXhwcmVzc2lvbiIsInZpc2l0Qml0U2hpZnRFeHByZXNzaW9uIiwidmlzaXRQb3N0SW5jcmVtZW50RXhwcmVzc2lvbiIsInZpc2l0Qml0Tm90RXhwcmVzc2lvbiIsInZpc2l0TmV3RXhwcmVzc2lvbiIsIkxpdGVyYWxDb250ZXh0IiwidmlzaXRMaXRlcmFsIiwiTnVtZXJpY0xpdGVyYWxDb250ZXh0IiwidmlzaXROdW1lcmljTGl0ZXJhbCIsIkFycmF5RXhwcmVzc2lvbiIsImV4cHIiLCJTdGF0aWNNZW1iZXJFeHByZXNzaW9uIiwicHJpbnQiLCJDb21wdXRlZE1lbWJlckV4cHJlc3Npb24iLCJ2aXNpdEJpdEFuZEV4cHJlc3Npb24iLCJ2aXNpdEJpdE9yRXhwcmVzc2lvbiIsInZpc2l0Vm9pZEV4cHJlc3Npb24iLCJ2aXNpdEFzc2lnbm1lbnRPcGVyYXRvciIsImxpdGVyYWwiLCJMaXRlcmFsIiwiTnVtYmVyIiwiSWRlbnRpZmllck5hbWVDb250ZXh0IiwidmlzaXRSZXNlcnZlZFdvcmQiLCJ2aXNpdEtleXdvcmQiLCJ2aXNpdEZ1dHVyZVJlc2VydmVkV29yZCIsInZpc2l0R2V0dGVyIiwidmlzaXRTZXR0ZXIiLCJ2aXNpdEVvcyIsInZpc2l0RW9mIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7O0FBQ0E7O0FBRUE7Ozs7Ozs7O0FBR0E7Ozs7Ozs7O0lBUVlBLFU7OztXQUFBQSxVO0FBQUFBLEVBQUFBLFUsQ0FBQUEsVTtHQUFBQSxVLDBCQUFBQSxVOztBQVlHLE1BQWVDLFNBQWYsQ0FBeUI7QUFHcENDLEVBQUFBLFdBQVcsQ0FBQ0MsT0FBRCxFQUE2QjtBQUNwQyxTQUFLQSxPQUFMLEdBQWVBLE9BQU8sSUFBSSxJQUFJQyxnQkFBSixFQUExQjtBQUNIOztBQUVEQyxFQUFBQSxRQUFRLENBQUNDLE1BQUQsRUFBOEI7QUFDbEMsUUFBSUMsSUFBSjs7QUFDQSxZQUFRRCxNQUFNLENBQUNFLElBQWY7QUFDSSxXQUFLLE1BQUw7QUFDSUQsUUFBQUEsSUFBSSxHQUFHRCxNQUFNLENBQUNHLEtBQWQ7QUFDQTs7QUFDSixXQUFLLFVBQUw7QUFDSUYsUUFBQUEsSUFBSSxHQUFHRyxFQUFFLENBQUNDLFlBQUgsQ0FBZ0JMLE1BQU0sQ0FBQ0csS0FBdkIsRUFBOEIsTUFBOUIsQ0FBUDtBQUNBO0FBTlI7O0FBU0EsUUFBSUcsS0FBSyxHQUFHLElBQUlDLE1BQU0sQ0FBQ0MsV0FBWCxDQUF1QlAsSUFBdkIsQ0FBWjtBQUNBLFFBQUlRLEtBQUssR0FBRyxJQUFJQyxnQ0FBSixDQUFnQkosS0FBaEIsQ0FBWjtBQUNBLFFBQUlLLE1BQU0sR0FBRyxJQUFJSixNQUFNLENBQUNLLGlCQUFYLENBQTZCSCxLQUE3QixDQUFiO0FBQ0EsUUFBSUksTUFBTSxHQUFHLElBQUlDLGtDQUFKLENBQWlCSCxNQUFqQixDQUFiO0FBQ0EsUUFBSUksSUFBSSxH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LElBQUFBLE9BQU8sQ0FBQ21LLEtBQVIsQ0FBYyxpQkFBZDtBQUNILEdBOTlDK0MsQ0FnK0NoRDs7O0FBQ0FpSyxFQUFBQSxXQUFXLENBQUNoVCxHQUFELEVBQW1CO0FBQzFCcEIsSUFBQUEsT0FBTyxDQUFDbUssS0FBUixDQUFjLGlCQUFkO0FBQ0gsR0FuK0MrQyxDQW8rQ2hEOzs7QUFDQWtLLEVBQUFBLFdBQVcsQ0FBQ2pULEdBQUQsRUFBbUI7QUFDMUJwQixJQUFBQSxPQUFPLENBQUNtSyxLQUFSLENBQWMsaUJBQWQ7QUFDSCxHQXYrQytDLENBeStDaEQ7OztBQUNBbUssRUFBQUEsUUFBUSxDQUFDbFQsR0FBRCxFQUFtQixDQUUxQixDQUZPLENBQ0o7QUFHSjs7O0FBQ0FtVCxFQUFBQSxRQUFRLENBQUNuVCxHQUFELEVBQW1CO0FBQ3ZCcEIsSUFBQUEsT0FBTyxDQUFDbUssS0FBUixDQUFjLGlCQUFkO0FBQ0g7O0FBai9DK0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBhbnRscjQgZnJvbSBcImFudGxyNFwiXG5pbXBvcnQgeyBFQ01BU2NyaXB0UGFyc2VyVmlzaXRvciBhcyBEZWx2ZW5WaXNpdG9yIH0gZnJvbSBcIi4vcGFyc2VyL0VDTUFTY3JpcHRQYXJzZXJWaXNpdG9yXCJcbmltcG9ydCB7IEVDTUFTY3JpcHRQYXJzZXIgYXMgRGVsdmVuUGFyc2VyLCBFQ01BU2NyaXB0UGFyc2VyLCBQcm9ncmFtQ29udGV4dCB9IGZyb20gXCIuL3BhcnNlci9FQ01BU2NyaXB0UGFyc2VyXCJcbmltcG9ydCB7IEVDTUFTY3JpcHRMZXhlciBhcyBEZWx2ZW5MZXhlciB9IGZyb20gXCIuL3BhcnNlci9FQ01BU2NyaXB0TGV4ZXJcIlxuaW1wb3J0IHsgUnVsZUNvbnRleHQgfSBmcm9tIFwiYW50bHI0L1J1bGVDb250ZXh0XCJcbmltcG9ydCB7IFByaW50VmlzaXRvciB9IGZyb20gXCIuL1ByaW50VmlzaXRvclwiXG5pbXBvcnQgQVNUTm9kZSBmcm9tIFwiLi9BU1ROb2RlXCI7XG5pbXBvcnQgeyBFeHByZXNzaW9uU3RhdGVtZW50LCBMaXRlcmFsLCBTY3JpcHQsIEJsb2NrU3RhdGVtZW50LCBTdGF0ZW1lbnQsIFNlcXVlbmNlRXhwcmVzc2lvbiwgVGhyb3dTdGF0ZW1lbnQsIEFzc2lnbm1lbnRFeHByZXNzaW9uLCBJZGVudGlmaWVyLCBCaW5hcnlFeHByZXNzaW9uLCBBcnJheUV4cHJlc3Npb24sIE9iamVjdEV4cHJlc3Npb24sIE9iamVjdEV4cHJlc3Npb25Qcm9wZXJ0eSwgUHJvcGVydHksIFByb3BlcnR5S2V5LCBWYXJpYWJsZURlY2xhcmF0aW9uLCBWYXJpYWJsZURlY2xhcmF0b3IsIEV4cHJlc3Npb24sIElmU3RhdGVtZW50LCBDb21wdXRlZE1lbWJlckV4cHJlc3Npb24sIFN0YXRpY01lbWJlckV4cHJlc3Npb24sIENsYXNzRGVjbGFyYXRpb24sIENsYXNzQm9keSwgRnVuY3Rpb25EZWNsYXJhdGlvbiwgRnVuY3Rpb25QYXJhbWV0ZXIsIEFzeW5jRnVuY3Rpb25EZWNsYXJhdGlvbiwgQXNzaWdubWVudFBhdHRlcm4sIEJpbmRpbmdQYXR0ZXJuLCBCaW5kaW5nSWRlbnRpZmllciB9IGZyb20gXCIuL25vZGVzXCI7XG5pbXBvcnQgeyBTeW50YXggfSBmcm9tIFwiLi9zeW50YXhcIjtcbmltcG9ydCB7IHR5cGUgfSBmcm9tIFwib3NcIlxuaW1wb3J0ICogYXMgZnMgZnJvbSBcImZzXCJcbmltcG9ydCB7IEludGVydmFsIH0gZnJvbSBcImFudGxyNFwiXG5pbXBvcnQgVHJhY2UsIHsgQ2FsbFNpdGUgfSBmcm9tIFwiLi90cmFjZVwiXG5cblxuLyoqXG4gKiBWZXJzaW9uIHRoYXQgd2UgZ2VuZXJhdGUgdGhlIEFTVCBmb3IuIFxuICogVGhpcyBhbGxvd3MgZm9yIHRlc3RpbmcgZGlmZmVyZW50IGltcGxlbWVudGF0aW9uc1xuICogXG4gKiBDdXJyZW50bHkgb25seSBFQ01BU2NyaXB0IGlzIHN1cHBvcnRlZFxuICogXG4gKiBodHRwczovL2dpdGh1Yi5jb20vZXN0cmVlL2VzdHJlZVxuICovXG5leHBvcnQgZW51bSBQYXJzZXJUeXBlIHsgRUNNQVNjcmlwdCB9XG5leHBvcnQgdHlwZSBTb3VyY2VUeXBlID0gXCJjb2RlXCIgfCBcImZpbGVuYW1lXCI7XG5leHBvcnQgdHlwZSBTb3VyY2VDb2RlID0ge1xuICAgIHR5cGU6IFNvdXJjZVR5cGUsXG4gICAgdmFsdWU6IHN0cmluZ1xufVxuZXhwb3J0IGludGVyZmFjZSBNYXJrZXIge1xuICAgIGluZGV4OiBudW1iZXI7XG4gICAgbGluZTogbnVtYmVyO1xuICAgIGNvbHVtbjogbnVtYmVyO1xufVxuXG5leHBvcnQgZGVmYXVsdCBhYnN0cmFjdCBjbGFzcyBBU1RQYXJzZXIge1xuICAgIHByaXZhdGUgdmlzaXRvcjogKHR5cGVvZiBEZWx2ZW5WaXNpdG9yIHwgbnVsbClcblxuICAgIGNvbnN0cnVjdG9yKHZpc2l0b3I/OiBEZWx2ZW5BU1RWaXNpdG9yKSB7XG4gICAgICAgIHRoaXMudmlzaXRvciA9IHZpc2l0b3IgfHwgbmV3IERlbHZlbkFTVFZpc2l0b3IoKTtcbiAgICB9XG5cbiAgICBnZW5lcmF0ZShzb3VyY2U6IFNvdXJjZUNvZGUpOiBBU1ROb2RlIHtcbiAgICAgICAgbGV0IGNvZGU7XG4gICAgICAgIHN3aXRjaCAoc291cmNlLnR5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgXCJjb2RlXCI6XG4gICAgICAgICAgICAgICAgY29kZSA9IHNvdXJjZS52YWx1ZTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJmaWxlbmFtZVwiOlxuICAgICAgICAgICAgICAgIGNvZGUgPSBmcy5yZWFkRmlsZVN5bmMoc291cmNlLnZhbHVlLCBcInV0ZjhcIik7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgY2hhcnMgPSBuZXcgYW50bHI0LklucHV0U3RyZWFtKGNvZGUpO1xuICAgICAgICBsZXQgbGV4ZXIgPSBuZXcgRGVsdmVuTGV4ZXIoY2hhcnMpO1xuICAgICAgICBsZXQgdG9rZW5zID0gbmV3IGFudGxyNC5Db21tb25Ub2tlblN0cmVhbShsZXhlcik7XG4gICAgICAgIGxldCBwYXJzZXIgPSBuZXcgRGVsdmVuUGFyc2VyKHRva2Vucyk7XG4gICAgICAgIGxldCB0cmVlID0gcGFyc2VyLnByb2dyYW0oKTtcbiAgICAgICAgLy8gY29uc29sZS5pbmZvKHRyZWUudG9TdHJpbmdUcmVlKCkpXG4gICAgICAgIHRyZWUuYWNjZXB0KG5ldyBQcmludFZpc2l0b3IoKSk7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcIi0tLS0tLS0tLS0tLS0tLS0tLS0tLVwiKTtcbiAgICAgICAgbGV0IHJlc3VsdCA9IHRyZWUuYWNjZXB0KHRoaXMudmlzaXRvcik7XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUGFyc2Ugc291cmNlIGFuZCBnZW5lcmVhdGUgQVNUIHRyZWVcbiAgICAgKiBAcGFyYW0gc291cmNlIFxuICAgICAqIEBwYXJhbSB0eXBlIFxuICAgICAqL1xuICAgIHN0YXRpYyBwYXJzZShzb3VyY2U6IFNvdXJjZUNvZGUsIHR5cGU/OiBQYXJzZXJUeXBlKTogQVNUTm9kZSB7XG4gICAgICAgIGlmICh0eXBlID09IG51bGwpXG4gICAgICAgICAgICB0eXBlID0gUGFyc2VyVHlwZS5FQ01BU2NyaXB0O1xuICAgICAgICBsZXQgcGFyc2VyO1xuICAgICAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgUGFyc2VyVHlwZS5FQ01BU2NyaXB0OlxuICAgICAgICAgICAgICAgIHBhcnNlciA9IG5ldyBBU1RQYXJzZXJEZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlVua293biBwYXJzZXIgdHlwZVwiKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcGFyc2VyLmdlbmVyYXRlKHNvdXJjZSlcbiAgICB9XG59XG5cbmNsYXNzIEFTVFBhcnNlckRlZmF1bHQgZXh0ZW5kcyBBU1RQYXJzZXIge1xuXG59XG5cbmV4cG9ydCBjbGFzcyBEZWx2ZW5BU1RWaXNpdG9yIGV4dGVuZHMgRGVsdmVuVmlzaXRvciB7XG4gICAgcHJpdmF0ZSBydWxlVHlwZU1hcDogTWFwPG51bWJlciwgc3RyaW5nPiA9IG5ldyBNYXAoKTtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLnNldHVwVHlwZVJ1bGVzKCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzZXR1cFR5cGVSdWxlcygpIHtcbiAgICAgICAgY29uc3Qga2V5cyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKERlbHZlblBhcnNlcik7XG4gICAgICAgIGZvciAodmFyIGtleSBpbiBrZXlzKSB7XG4gICAgICAgICAgICBsZXQgbmFtZSA9IGtleXNba2V5XTtcbiAgICAgICAgICAgIGlmIChuYW1lLnN0YXJ0c1dpdGgoJ1JVTEVfJykpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJ1bGVUeXBlTWFwLnNldChwYXJzZUludChEZWx2ZW5QYXJzZXJbbmFtZV0pLCBuYW1lKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBsb2coY3R4OiBSdWxlQ29udGV4dCwgZnJhbWU6IENhbGxTaXRlKSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcIiVzIFslc10gOiAlc1wiLCBmcmFtZS5mdW5jdGlvbiwgY3R4LmdldENoaWxkQ291bnQoKSwgY3R4LmdldFRleHQoKSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBkdW1wQ29udGV4dChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnN0IGtleXMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhEZWx2ZW5QYXJzZXIpO1xuICAgICAgICBsZXQgY29udGV4dCA9IFtdXG4gICAgICAgIGZvciAodmFyIGtleSBpbiBrZXlzKSB7XG4gICAgICAgICAgICBsZXQgbmFtZSA9IGtleXNba2V5XTtcbiAgICAgICAgICAgIC8vIHRoaXMgb25seSB0ZXN0IGluaGVyaXRhbmNlXG4gICAgICAgICAgICBpZiAobmFtZS5lbmRzV2l0aCgnQ29udGV4dCcpKSB7XG4gICAgICAgICAgICAgICAgaWYgKGN0eCBpbnN0YW5jZW9mIERlbHZlblBhcnNlcltuYW1lXSkge1xuICAgICAgICAgICAgICAgICAgICBjb250ZXh0LnB1c2gobmFtZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gZGlyeSBoYWNrIGZvciB3YWxraW5nIGFudGxlciBkZXBlbmN5IGNoYWluIFxuICAgICAgICAvLyBmaW5kIGxvbmdlc3QgZGVwZW5kZW5jeSBjaGFpbmc7XG4gICAgICAgIC8vIHRoaXMgdHJhdmVyc2FsIGlzIHNwZWNpZmljIHRvIEFOVEwgcGFyc2VyXG4gICAgICAgIC8vIFdlIHdhbnQgdG8gYmUgYWJsZSB0byBmaW5kIGRlcGVuZGVuY2llcyBzdWNoIGFzO1xuICAgICAgICAvKlxuICAgICAgICAgICAgLS0tLS0tLS0gLS0tLS0tLS0tLS0tXG4gICAgICAgICAgICBQcm9wZXJ0eUV4cHJlc3Npb25Bc3NpZ25tZW50Q29udGV4dFxuICAgICAgICAgICAgKiogUHJvcGVydHlBc3NpZ25tZW50Q29udGV4dFxuICAgICAgICAgICAgKiogUGFyc2VyUnVsZUNvbnRleHRcbiAgICAgICAgICAgIC0tLS0tLS0tIC0tLS0tLS0tLS0tLVxuICAgICAgICAgICAgUHJvcGVydHlBc3NpZ25tZW50Q29udGV4dFxuICAgICAgICAgICAgKiogUGFyc2VyUnVsZUNvbnRleHRcbiAgICAgICAgICovXG4gICAgICAgIGlmIChjb250ZXh0Lmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgIGxldCBjb250ZXh0TmFtZTtcbiAgICAgICAgICAgIGxldCBsb25nZXN0ID0gMDtcbiAgICAgICAgICAgIGZvciAoY29uc3Qga2V5IGluIGNvbnRleHQpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBuYW1lID0gY29udGV4dFtrZXldO1xuICAgICAgICAgICAgICAgIGxldCBvYmogPSBFQ01BU2NyaXB0UGFyc2VyW25hbWVdO1xuICAgICAgICAgICAgICAgIGxldCBjaGFpbiA9IDE7XG4gICAgICAgICAgICAgICAgZG8ge1xuICAgICAgICAgICAgICAgICAgICArK2NoYWluO1xuICAgICAgICAgICAgICAgICAgICBvYmogPSBFQ01BU2NyaXB0UGFyc2VyW29iai5wcm90b3R5cGUuX19wcm90b19fLmNvbnN0cnVjdG9yLm5hbWVdO1xuICAgICAgICAgICAgICAgIH0gd2hpbGUgKG9iaiAmJiBvYmoucHJvdG90eXBlKVxuICAgICAgICAgICAgICAgIGlmIChjaGFpbiA+IGxvbmdlc3QpIHtcbiAgICAgICAgICAgICAgICAgICAgbG9uZ2VzdCA9IGNoYWluO1xuICAgICAgICAgICAgICAgICAgICBjb250ZXh0TmFtZSA9IGAke25hbWV9IFsgKiogJHtjaGFpbn1dYDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gW2NvbnRleHROYW1lXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY29udGV4dDtcbiAgICB9XG5cbiAgICBwcml2YXRlIGR1bXBDb250ZXh0QWxsQ2hpbGRyZW4oY3R4OiBSdWxlQ29udGV4dCwgaW5kZW50ID0gMCkge1xuICAgICAgICBjb25zdCBwYWQgPSBcIiBcIi5wYWRTdGFydChpbmRlbnQsIFwiXFx0XCIpO1xuICAgICAgICBjb25zdCBub2RlcyA9IHRoaXMuZHVtcENvbnRleHQoY3R4KTtcbiAgICAgICAgaWYgKG5vZGVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGNvbnN0IG1hcmtlciA9IGluZGVudCA9PSAwID8gXCIgIyBcIiA6IFwiICogXCI7XG4gICAgICAgICAgICBjb25zb2xlLmluZm8ocGFkICsgbWFya2VyICsgbm9kZXMpXG4gICAgICAgIH1cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjdHguZ2V0Q2hpbGRDb3VudCgpOyArK2kpIHtcbiAgICAgICAgICAgIGxldCBjaGlsZCA9IGN0eD8uZ2V0Q2hpbGQoaSk7XG4gICAgICAgICAgICBpZiAoY2hpbGQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmR1bXBDb250ZXh0QWxsQ2hpbGRyZW4oY2hpbGQsICsraW5kZW50KTtcbiAgICAgICAgICAgICAgICAtLWluZGVudDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldCBydWxlIG5hbWUgYnkgdGhlIElkXG4gICAgICogQHBhcmFtIGlkIFxuICAgICAqL1xuICAgIGdldFJ1bGVCeUlkKGlkOiBudW1iZXIpOiBzdHJpbmcgfCB1bmRlZmluZWQge1xuICAgICAgICByZXR1cm4gdGhpcy5ydWxlVHlwZU1hcC5nZXQoaWQpO1xuICAgIH1cblxuICAgIHByaXZhdGUgYXNNYXJrZXIobWV0YWRhdGE6IGFueSkge1xuICAgICAgICByZXR1cm4geyBpbmRleDogMSwgbGluZTogMSwgY29sdW1uOiAxIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGRlY29yYXRlKG5vZGU6IGFueSwgbWFya2VyOiBNYXJrZXIpOiBhbnkge1xuICAgICAgICBub2RlLnN0YXJ0ID0gMDtcbiAgICAgICAgbm9kZS5lbmQgPSAwO1xuICAgICAgICByZXR1cm4gbm9kZTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFzTWV0YWRhdGEoaW50ZXJ2YWw6IEludGVydmFsKTogYW55IHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHN0YXJ0OiB7XG4gICAgICAgICAgICAgICAgbGluZTogMSxcbiAgICAgICAgICAgICAgICBjb2x1bW46IGludGVydmFsLnN0YXJ0LFxuICAgICAgICAgICAgICAgIG9mZnNldDogMFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGVuZDoge1xuICAgICAgICAgICAgICAgIGxpbmU6IDEsXG4gICAgICAgICAgICAgICAgY29sdW1uOiBpbnRlcnZhbC5zdG9wLFxuICAgICAgICAgICAgICAgIG9mZnNldDogM1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSB0aHJvd1R5cGVFcnJvcih0eXBlSWQ6IGFueSkge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiVW5oYW5kbGVkIHR5cGUgOiBcIiArIHR5cGVJZCArIFwiIDogXCIgKyB0aGlzLmdldFJ1bGVCeUlkKHR5cGVJZCkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRocm93IFR5cGVFcnJvciBvbmx5IHdoZW4gdGhlcmUgaXMgYSB0eXBlIHByb3ZpZGVkLiBcbiAgICAgKiBUaGlzIGlzIHVzZWZ1bGwgd2hlbiB0aGVyZSBub2RlIGl0YSBUZXJtaW5hbE5vZGUgXG4gICAgICogQHBhcmFtIHR5cGUgXG4gICAgICovXG4gICAgcHJpdmF0ZSB0aHJvd0luc2FuY2VFcnJvcih0eXBlOiBhbnkpOiB2b2lkIHtcbiAgICAgICAgLyogICAgICAgICBpZiAodHlwZSA9PSB1bmRlZmluZWQgfHwgdHlwZSA9PSBcIlwiKSB7XG4gICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH0gKi9cbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlVuaGFuZGxlZCBpbnN0YW5jZSB0eXBlIDogXCIgKyB0eXBlKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFzc2VydFR5cGUoY3R4OiBSdWxlQ29udGV4dCwgdHlwZTogYW55KTogdm9pZCB7XG4gICAgICAgIGlmICghKGN0eCBpbnN0YW5jZW9mIHR5cGUpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiSW52YWxpZCB0eXBlIGV4cGVjdGVkIDogJ1wiICsgdHlwZS5uYW1lICsgXCInIHJlY2VpdmVkICdcIiArIHRoaXMuZHVtcENvbnRleHQoY3R4KSkgKyBcIidcIjtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI3Byb2dyYW0uXG4gICAgdmlzaXRQcm9ncmFtKGN0eDogUnVsZUNvbnRleHQpOiBTY3JpcHQge1xuICAgICAgICB0aGlzLmxvZyhjdHgsIFRyYWNlLmZyYW1lKCkpXG4gICAgICAgIHRoaXMuYXNzZXJ0VHlwZShjdHgsIEVDTUFTY3JpcHRQYXJzZXIuUHJvZ3JhbUNvbnRleHQpXG4gICAgICAgIC8vIHZpc2l0UHJvZ3JhbSAtPnZpc2l0U291cmNlRWxlbWVudHMgLT4gdmlzaXRTb3VyY2VFbGVtZW50IC0+IHZpc2l0U3RhdGVtZW50XG4gICAgICAgIGNvbnN0IHN0YXRlbWVudHMgPSBbXTtcbiAgICAgICAgY29uc3Qgbm9kZSA9IGN0eC5nZXRDaGlsZCgwKTsgIC8vIHZpc2l0UHJvZ3JhbSAtPnZpc2l0U291cmNlRWxlbWVudHMgXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbm9kZS5nZXRDaGlsZENvdW50KCk7ICsraSkge1xuICAgICAgICAgICAgY29uc3Qgc3RtID0gbm9kZS5nZXRDaGlsZChpKS5nZXRDaGlsZCgwKTsgLy8gU291cmNlRWxlbWVudHNDb250ZXh0ID4gU3RhdGVtZW50Q29udGV4dFxuICAgICAgICAgICAgaWYgKHN0bSBpbnN0YW5jZW9mIEVDTUFTY3JpcHRQYXJzZXIuU3RhdGVtZW50Q29udGV4dCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHN0YXRlbWVudCA9IHRoaXMudmlzaXRTdGF0ZW1lbnQoc3RtKTtcbiAgICAgICAgICAgICAgICBzdGF0ZW1lbnRzLnB1c2goc3RhdGVtZW50KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy50aHJvd0luc2FuY2VFcnJvcih0aGlzLmR1bXBDb250ZXh0KHN0bSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGludGVydmFsID0gY3R4LmdldFNvdXJjZUludGVydmFsKCk7XG4gICAgICAgIGNvbnN0IHNjcmlwdCA9IG5ldyBTY3JpcHQoc3RhdGVtZW50cyk7XG4gICAgICAgIHJldHVybiB0aGlzLmRlY29yYXRlKHNjcmlwdCwgdGhpcy5hc01hcmtlcih0aGlzLmFzTWV0YWRhdGEoaW50ZXJ2YWwpKSk7XG4gICAgfVxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjc3RhdGVtZW50LlxuICAgIC8qKlxuICAgICAqIHN0YXRlbWVudFxuICAgICAqICAgOiBibG9ja1xuICAgICAqICAgfCB2YXJpYWJsZVN0YXRlbWVudFxuICAgICAqICAgfCBpbXBvcnRTdGF0ZW1lbnRcbiAgICAgKiAgIHwgZXhwb3J0U3RhdGVtZW50XG4gICAgICogICB8IGVtcHR5U3RhdGVtZW50XG4gICAgICogICB8IGNsYXNzRGVjbGFyYXRpb25cbiAgICAgKiAgIHwgZXhwcmVzc2lvblN0YXRlbWVudFxuICAgICAqICAgfCBpZlN0YXRlbWVudFxuICAgICAqICAgfCBpdGVyYXRpb25TdGF0ZW1lbnRcbiAgICAgKiAgIHwgY29udGludWVTdGF0ZW1lbnRcbiAgICAgKiAgIHwgYnJlYWtTdGF0ZW1lbnRcbiAgICAgKiAgIHwgcmV0dXJuU3RhdGVtZW50XG4gICAgICogICB8IHlpZWxkU3RhdGVtZW50XG4gICAgICogICB8IHdpdGhTdGF0ZW1lbnRcbiAgICAgKiAgIHwgbGFiZWxsZWRTdGF0ZW1lbnRcbiAgICAgKiAgIHwgc3dpdGNoU3RhdGVtZW50XG4gICAgICogICB8IHRocm93U3RhdGVtZW50XG4gICAgICogICB8IHRyeVN0YXRlbWVudFxuICAgICAqICAgfCBkZWJ1Z2dlclN0YXRlbWVudFxuICAgICAqICAgfCBmdW5jdGlvbkRlY2xhcmF0aW9uXG4gICAgICogICA7XG4gICAgICogQHBhcmFtIGN0eCBcbiAgICAgKi9cbiAgICB2aXNpdFN0YXRlbWVudChjdHg6IFJ1bGVDb250ZXh0KTogYW55IHtcbiAgICAgICAgdGhpcy5sb2coY3R4LCBUcmFjZS5mcmFtZSgpKVxuICAgICAgICB0aGlzLmFzc2VydFR5cGUoY3R4LCBFQ01BU2NyaXB0UGFyc2VyLlN0YXRlbWVudENvbnRleHQpXG4gICAgICAgIGNvbnN0IG5vZGU6IFJ1bGVDb250ZXh0ID0gY3R4LmdldENoaWxkKDApO1xuICAgICAgICBpZiAobm9kZSBpbnN0YW5jZW9mIEVDTUFTY3JpcHRQYXJzZXIuQmxvY2tDb250ZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy52aXNpdEJsb2NrKG5vZGUpO1xuICAgICAgICB9IGVsc2UgaWYgKG5vZGUgaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLlZhcmlhYmxlU3RhdGVtZW50Q29udGV4dCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmlzaXRWYXJpYWJsZVN0YXRlbWVudChub2RlKTtcbiAgICAgICAgfSBlbHNlIGlmIChub2RlIGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5JbXBvcnRTdGF0ZW1lbnRDb250ZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy52aXNpdEltcG9ydFN0YXRlbWVudChub2RlKTtcbiAgICAgICAgfSBlbHNlIGlmIChub2RlIGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5FeHBvcnRTdGF0ZW1lbnRDb250ZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy52aXNpdEV4cG9ydFN0YXRlbWVudChub2RlKTtcbiAgICAgICAgfSBlbHNlIGlmIChub2RlIGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5FbXB0eVN0YXRlbWVudENvbnRleHQpIHtcbiAgICAgICAgICAgIC8vIE5PT1AsXG4gICAgICAgIH0gZWxzZSBpZiAobm9kZSBpbnN0YW5jZW9mIEVDTUFTY3JpcHRQYXJzZXIuQ2xhc3NEZWNsYXJhdGlvbkNvbnRleHQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnZpc2l0Q2xhc3NEZWNsYXJhdGlvbihub2RlKTtcbiAgICAgICAgfSBlbHNlIGlmIChub2RlIGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5FeHByZXNzaW9uU3RhdGVtZW50Q29udGV4dCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmlzaXRFeHByZXNzaW9uU3RhdGVtZW50KG5vZGUpO1xuICAgICAgICB9IGVsc2UgaWYgKG5vZGUgaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLklmU3RhdGVtZW50Q29udGV4dCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmlzaXRJZlN0YXRlbWVudChub2RlKTtcbiAgICAgICAgfSBlbHNlIGlmIChub2RlIGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5JdGVyYXRpb25TdGF0ZW1lbnRDb250ZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy52aXNpdEl0ZXJhdGlvblN0YXRlbWVudChub2RlKTtcbiAgICAgICAgfSBlbHNlIGlmIChub2RlIGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5Db250aW51ZVN0YXRlbWVudENvbnRleHQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnZpc2l0Q29udGludWVTdGF0ZW1lbnQobm9kZSk7XG4gICAgICAgIH0gZWxzZSBpZiAobm9kZSBpbnN0YW5jZW9mIEVDTUFTY3JpcHRQYXJzZXIuQnJlYWtTdGF0ZW1lbnRDb250ZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy52aXNpdEJyZWFrU3RhdGVtZW50KG5vZGUpO1xuICAgICAgICB9IGVsc2UgaWYgKG5vZGUgaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLlJldHVyblN0YXRlbWVudENvbnRleHQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnZpc2l0UmV0dXJuU3RhdGVtZW50KG5vZGUpO1xuICAgICAgICB9IGVsc2UgaWYgKG5vZGUgaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLllpZWxkU3RhdGVtZW50Q29udGV4dCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmlzaXRZaWVsZFN0YXRlbWVudChub2RlKTtcbiAgICAgICAgfSBlbHNlIGlmIChub2RlIGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5XaXRoU3RhdGVtZW50Q29udGV4dCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmlzaXRXaXRoU3RhdGVtZW50KG5vZGUpO1xuICAgICAgICB9IGVsc2UgaWYgKG5vZGUgaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLkxhYmVsbGVkU3RhdGVtZW50Q29udGV4dCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmlzaXRMYWJlbGxlZFN0YXRlbWVudChub2RlKTtcbiAgICAgICAgfSBlbHNlIGlmIChub2RlIGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5Td2l0Y2hTdGF0ZW1lbnRDb250ZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy52aXNpdFN3aXRjaFN0YXRlbWVudChub2RlKTtcbiAgICAgICAgfSBlbHNlIGlmIChub2RlIGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5GdW5jdGlvbkV4cHJlc3Npb25Db250ZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy52aXNpdEZ1bmN0aW9uRXhwcmVzc2lvbihub2RlKTtcbiAgICAgICAgfSBlbHNlIGlmIChub2RlIGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5UaHJvd1N0YXRlbWVudENvbnRleHQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnZpc2l0VGhyb3dTdGF0ZW1lbnQobm9kZSk7XG4gICAgICAgIH0gZWxzZSBpZiAobm9kZSBpbnN0YW5jZW9mIEVDTUFTY3JpcHRQYXJzZXIuVHJ5U3RhdGVtZW50Q29udGV4dCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmlzaXRUcnlTdGF0ZW1lbnQobm9kZSk7XG4gICAgICAgIH0gZWxzZSBpZiAobm9kZSBpbnN0YW5jZW9mIEVDTUFTY3JpcHRQYXJzZXIuRGVidWdnZXJTdGF0ZW1lbnRDb250ZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy52aXNpdERlYnVnZ2VyU3RhdGVtZW50KG5vZGUpO1xuICAgICAgICB9IGVsc2UgaWYgKG5vZGUgaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLkZ1bmN0aW9uRGVjbGFyYXRpb25Db250ZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy52aXNpdEZ1bmN0aW9uRGVjbGFyYXRpb24obm9kZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnRocm93SW5zYW5jZUVycm9yKHRoaXMuZHVtcENvbnRleHQobm9kZSkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdmlzaXRJbXBvcnRTdGF0ZW1lbnQoY3R4OiBSdWxlQ29udGV4dCk6IGFueSB7XG4gICAgICAgIHRoaXMubG9nKGN0eCwgVHJhY2UuZnJhbWUoKSlcbiAgICAgICAgdGhpcy5hc3NlcnRUeXBlKGN0eCwgRUNNQVNjcmlwdFBhcnNlci5JbXBvcnRTdGF0ZW1lbnRDb250ZXh0KVxuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwibm90IGltcGxlbWVudGVkXCIpO1xuICAgIH1cblxuICAgIHZpc2l0RXhwb3J0U3RhdGVtZW50KGN0eDogUnVsZUNvbnRleHQpOiBhbnkge1xuICAgICAgICB0aGlzLmxvZyhjdHgsIFRyYWNlLmZyYW1lKCkpXG4gICAgICAgIHRoaXMuYXNzZXJ0VHlwZShjdHgsIEVDTUFTY3JpcHRQYXJzZXIuRXhwb3J0U3RhdGVtZW50Q29udGV4dClcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIm5vdCBpbXBsZW1lbnRlZFwiKTtcbiAgICB9XG5cbiAgICB2aXNpdEl0ZXJhdGlvblN0YXRlbWVudChjdHg6IFJ1bGVDb250ZXh0KTogYW55IHtcbiAgICAgICAgdGhpcy5sb2coY3R4LCBUcmFjZS5mcmFtZSgpKVxuICAgICAgICB0aGlzLmFzc2VydFR5cGUoY3R4LCBFQ01BU2NyaXB0UGFyc2VyLkl0ZXJhdGlvblN0YXRlbWVudENvbnRleHQpXG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJub3QgaW1wbGVtZW50ZWRcIik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjYmxvY2suXG4gICAgICogLy8vIEJsb2NrIDpcbiAgICAgKiAvLy8gICAgIHsgU3RhdGVtZW50TGlzdD8gfVxuICAgICAqL1xuICAgIHZpc2l0QmxvY2soY3R4OiBSdWxlQ29udGV4dCk6IEJsb2NrU3RhdGVtZW50IHtcbiAgICAgICAgY29uc29sZS5pbmZvKFwidmlzaXRCbG9jayBbJXNdIDogJXNcIiwgY3R4LmdldENoaWxkQ291bnQoKSwgY3R4LmdldFRleHQoKSk7XG4gICAgICAgIHRoaXMuYXNzZXJ0VHlwZShjdHgsIEVDTUFTY3JpcHRQYXJzZXIuQmxvY2tDb250ZXh0KVxuICAgICAgICBjb25zdCBib2R5ID0gW107XG4gICAgICAgIGZvciAobGV0IGkgPSAxOyBpIDwgY3R4LmdldENoaWxkQ291bnQoKSAtIDE7ICsraSkge1xuICAgICAgICAgICAgY29uc3Qgbm9kZTogUnVsZUNvbnRleHQgPSBjdHguZ2V0Q2hpbGQoaSk7XG4gICAgICAgICAgICBpZiAobm9kZSBpbnN0YW5jZW9mIEVDTUFTY3JpcHRQYXJzZXIuU3RhdGVtZW50TGlzdENvbnRleHQpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBzdGF0ZW1lbnRMaXN0ID0gdGhpcy52aXNpdFN0YXRlbWVudExpc3Qobm9kZSk7XG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBpbmRleCBpbiBzdGF0ZW1lbnRMaXN0KSB7XG4gICAgICAgICAgICAgICAgICAgIGJvZHkucHVzaChzdGF0ZW1lbnRMaXN0W2luZGV4XSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnRocm93SW5zYW5jZUVycm9yKHRoaXMuZHVtcENvbnRleHQobm9kZSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuZGVjb3JhdGUobmV3IEJsb2NrU3RhdGVtZW50KGJvZHkpLCB0aGlzLmFzTWFya2VyKHRoaXMuYXNNZXRhZGF0YShjdHguZ2V0U291cmNlSW50ZXJ2YWwoKSkpKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNzdGF0ZW1lbnRMaXN0LlxuICAgICAqICBzdGF0ZW1lbnRMaXN0XG4gICAgICogICAgOiBzdGF0ZW1lbnQrXG4gICAgICogICAgO1xuICAgICAqIEBwYXJhbSBjdHggXG4gICAgICovXG4gICAgdmlzaXRTdGF0ZW1lbnRMaXN0KGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgdGhpcy5sb2coY3R4LCBUcmFjZS5mcmFtZSgpKVxuICAgICAgICB0aGlzLmFzc2VydFR5cGUoY3R4LCBFQ01BU2NyaXB0UGFyc2VyLlN0YXRlbWVudExpc3RDb250ZXh0KVxuICAgICAgICBjb25zdCBub2RlcyA9IHRoaXMuZmlsdGVyU3ltYm9scyhjdHgpO1xuICAgICAgICBjb25zb2xlLmluZm8obm9kZXMubGVuZ3RoKVxuICAgICAgICBjb25zdCBib2R5ID0gW107XG4gICAgICAgIGZvciAoY29uc3Qgbm9kZSBvZiBub2Rlcykge1xuICAgICAgICAgICAgaWYgKG5vZGUgaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLlN0YXRlbWVudENvbnRleHQpIHtcbiAgICAgICAgICAgICAgICBib2R5LnB1c2godGhpcy52aXNpdFN0YXRlbWVudChub2RlKSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMudGhyb3dUeXBlRXJyb3IodHlwZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGJvZHk7XG4gICAgfVxuXG5cbiAgICB2aXNpdFZhcmlhYmxlU3RhdGVtZW50KGN0eDogUnVsZUNvbnRleHQpOiBWYXJpYWJsZURlY2xhcmF0aW9uIHtcbiAgICAgICAgdGhpcy5sb2coY3R4LCBUcmFjZS5mcmFtZSgpKTtcbiAgICAgICAgdGhpcy5hc3NlcnRUeXBlKGN0eCwgRUNNQVNjcmlwdFBhcnNlci5WYXJpYWJsZVN0YXRlbWVudENvbnRleHQpXG4gICAgICAgIGNvbnN0IG5vZGUgPSB0aGlzLmdldFR5cGVkUnVsZUNvbnRleHQoY3R4LCBFQ01BU2NyaXB0UGFyc2VyLlZhcmlhYmxlRGVjbGFyYXRpb25MaXN0Q29udGV4dCk7XG4gICAgICAgIHJldHVybiB0aGlzLnZpc2l0VmFyaWFibGVEZWNsYXJhdGlvbkxpc3Qobm9kZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0IHRoZSB0eXBlIHJ1bGUgY29udGV4dFxuICAgICAqIEV4YW1wbGVcbiAgICAgKiA8Y29kZT5cbiAgICAgKiAgIGNvbnN0IG5vZGUgPSB0aGlzLmdldFR5cGVkUnVsZUNvbnRleHQoY3R4LCBFQ01BU2NyaXB0UGFyc2VyLlZhcmlhYmxlRGVjbGFyYXRpb25MaXN0Q29udGV4dCk7XG4gICAgICogPC9jb2RlPlxuICAgICAqIEBwYXJhbSBjdHggXG4gICAgICogQHBhcmFtIHR5cGUgXG4gICAgICogQHBhcmFtIGluZGV4IFxuICAgICAqL1xuICAgIHByaXZhdGUgZ2V0VHlwZWRSdWxlQ29udGV4dChjdHg6IFJ1bGVDb250ZXh0LCB0eXBlOiBhbnksIGluZGV4ID0gMCk6IGFueSB7XG4gICAgICAgIHJldHVybiBjdHguZ2V0VHlwZWRSdWxlQ29udGV4dCh0eXBlLCBpbmRleCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogPHByZT5cbiAgICAgKiB2YXJpYWJsZURlY2xhcmF0aW9uTGlzdFxuICAgICAqICAgOiB2YXJNb2RpZmllciB2YXJpYWJsZURlY2xhcmF0aW9uICgnLCcgdmFyaWFibGVEZWNsYXJhdGlvbikqXG4gICAgICogICA7XG4gICAgICogPC9wcmU+XG4gICAgICogQHBhcmFtIGN0eCBcbiAgICAgKi9cbiAgICB2aXNpdFZhcmlhYmxlRGVjbGFyYXRpb25MaXN0KGN0eDogUnVsZUNvbnRleHQpOiBWYXJpYWJsZURlY2xhcmF0aW9uIHtcbiAgICAgICAgdGhpcy5sb2coY3R4LCBUcmFjZS5mcmFtZSgpKTtcbiAgICAgICAgdGhpcy5hc3NlcnRUeXBlKGN0eCwgRUNNQVNjcmlwdFBhcnNlci5WYXJpYWJsZURlY2xhcmF0aW9uTGlzdENvbnRleHQpXG4gICAgICAgIGNvbnN0IHZhck1vZGlmaWVyQ29udGV4dCA9IHRoaXMuZ2V0VHlwZWRSdWxlQ29udGV4dChjdHgsIEVDTUFTY3JpcHRQYXJzZXIuVmFyTW9kaWZpZXJDb250ZXh0LCAwKTtcbiAgICAgICAgY29uc3QgdmFyTW9kaWZpZXIgPSB2YXJNb2RpZmllckNvbnRleHQuZ2V0VGV4dCgpO1xuICAgICAgICBjb25zdCBkZWNsYXJhdGlvbnM6IFZhcmlhYmxlRGVjbGFyYXRvcltdID0gW107XG4gICAgICAgIGZvciAoY29uc3Qgbm9kZSBvZiB0aGlzLmZpbHRlclN5bWJvbHMoY3R4KSkge1xuICAgICAgICAgICAgaWYgKG5vZGUgaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLlZhcmlhYmxlRGVjbGFyYXRpb25Db250ZXh0KSB7XG4gICAgICAgICAgICAgICAgZGVjbGFyYXRpb25zLnB1c2godGhpcy52aXNpdFZhcmlhYmxlRGVjbGFyYXRpb24obm9kZSkpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyBWYXJpYWJsZURlY2xhcmF0aW9uKGRlY2xhcmF0aW9ucywgdmFyTW9kaWZpZXIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciN2YXJpYWJsZURlY2xhcmF0aW9uLlxuICAgICAqICB2YXJpYWJsZURlY2xhcmF0aW9uXG4gICAgICogICAgOiBhc3NpZ25hYmxlICgnPScgc2luZ2xlRXhwcmVzc2lvbik/IC8vIEVDTUFTY3JpcHQgNjogQXJyYXkgJiBPYmplY3QgTWF0Y2hpbmdcbiAgICAgKiAgICA7XG4gICAgICogQHBhcmFtIGN0eCBWYXJpYWJsZURlY2xhcmF0aW9uQ29udGV4dFxuICAgICAqL1xuICAgIC8vIFxuICAgIHZpc2l0VmFyaWFibGVEZWNsYXJhdGlvbihjdHg6IFJ1bGVDb250ZXh0KTogVmFyaWFibGVEZWNsYXJhdG9yIHtcbiAgICAgICAgdGhpcy5sb2coY3R4LCBUcmFjZS5mcmFtZSgpKVxuICAgICAgICB0aGlzLmFzc2VydFR5cGUoY3R4LCBFQ01BU2NyaXB0UGFyc2VyLlZhcmlhYmxlRGVjbGFyYXRpb25Db250ZXh0KVxuICAgICAgICBjb25zdCBhc3NpZ25hYmxlQ29udGV4dCA9IHRoaXMuZ2V0VHlwZWRSdWxlQ29udGV4dChjdHgsIEVDTUFTY3JpcHRQYXJzZXIuQXNzaWduYWJsZUNvbnRleHQsIDApO1xuICAgICAgICBjb25zdCBhc3NpZ25hYmxlID0gdGhpcy52aXNpdEFzc2lnbmFibGUoYXNzaWduYWJsZUNvbnRleHQpO1xuICAgICAgICAvLyBjb25zb2xlLmluZm8oYXNzaWduYWJsZSlcbiAgICAgICAgbGV0IGluaXQgPSBudWxsO1xuICAgICAgICBpZiAoY3R4LmdldENoaWxkQ291bnQoKSA9PSAzKSB7XG4gICAgICAgICAgICBpbml0ID0gdGhpcy5zaW5nbGVFeHByZXNzaW9uKGN0eC5nZXRDaGlsZCgyKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyBWYXJpYWJsZURlY2xhcmF0b3IoYXNzaWduYWJsZSwgaW5pdCk7XG4gICAgfVxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjaW5pdGlhbGlzZXIuXG4gICAgdmlzaXRJbml0aWFsaXNlcihjdHg6IFJ1bGVDb250ZXh0KTogT2JqZWN0RXhwcmVzc2lvbiB8IEFycmF5RXhwcmVzc2lvbiB8IHVuZGVmaW5lZCB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0SW5pdGlhbGlzZXIgWyVzXSA6ICVzXCIsIGN0eC5nZXRDaGlsZENvdW50KCksIGN0eC5nZXRUZXh0KCkpO1xuICAgICAgICB0aGlzLmFzc2VydFR5cGUoY3R4LCBFQ01BU2NyaXB0UGFyc2VyLkluaXRpYWxpc2VyQ29udGV4dClcbiAgICAgICAgdGhpcy5hc3NlcnROb2RlQ291bnQoY3R4LCAyKTtcbiAgICAgICAgY29uc3Qgbm9kZTogUnVsZUNvbnRleHQgPSBjdHguZ2V0Q2hpbGQoMSk7XG5cbiAgICAgICAgaWYgKG5vZGUgaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLk9iamVjdExpdGVyYWxFeHByZXNzaW9uQ29udGV4dCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmlzaXRPYmplY3RMaXRlcmFsRXhwcmVzc2lvbihub2RlKTtcbiAgICAgICAgfSBlbHNlIGlmIChub2RlIGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5BcnJheUxpdGVyYWxFeHByZXNzaW9uQ29udGV4dCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmlzaXRBcnJheUxpdGVyYWxFeHByZXNzaW9uKG5vZGUpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMudGhyb3dJbnNhbmNlRXJyb3IodGhpcy5kdW1wQ29udGV4dChub2RlKSlcbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNlbXB0eVN0YXRlbWVudC5cbiAgICB2aXNpdEVtcHR5U3RhdGVtZW50KGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgdGhpcy5sb2coY3R4LCBUcmFjZS5mcmFtZSgpKVxuICAgIH1cblxuICAgIHByaXZhdGUgYXNzZXJ0Tm9kZUNvdW50KGN0eDogUnVsZUNvbnRleHQsIGNvdW50OiBudW1iZXIpIHtcbiAgICAgICAgaWYgKGN0eC5nZXRDaGlsZENvdW50KCkgIT0gY291bnQpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIldyb25nIGNoaWxkIGNvdW50LCBleHBlY3RlZCAnXCIgKyBjb3VudCArIFwiJyBnb3QgOiBcIiArIGN0eC5nZXRDaGlsZENvdW50KCkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjZXhwcmVzc2lvblN0YXRlbWVudC5cbiAgICAgKiBcbiAgICAgKiBleHByZXNzaW9uU3RhdGVtZW50XG4gICAgICogIDoge3RoaXMubm90T3BlbkJyYWNlQW5kTm90RnVuY3Rpb24oKX0/IGV4cHJlc3Npb25TZXF1ZW5jZSBlb3NcbiAgICAgKiAgO1xuICAgICAqIEBwYXJhbSBjdHggXG4gICAgICovXG4gICAgdmlzaXRFeHByZXNzaW9uU3RhdGVtZW50KGN0eDogUnVsZUNvbnRleHQpOiBFeHByZXNzaW9uU3RhdGVtZW50IHwgdW5kZWZpbmVkIHtcbiAgICAgICAgY29uc29sZS5pbmZvKFwidmlzaXRFeHByZXNzaW9uU3RhdGVtZW50IFslc10gOiAlc1wiLCBjdHguZ2V0Q2hpbGRDb3VudCgpLCBjdHguZ2V0VGV4dCgpKTtcbiAgICAgICAgdGhpcy5hc3NlcnRUeXBlKGN0eCwgRUNNQVNjcmlwdFBhcnNlci5FeHByZXNzaW9uU3RhdGVtZW50Q29udGV4dClcbiAgICAgICAgLy8gdmlzaXRFeHByZXNzaW9uU3RhdGVtZW50Oj52aXNpdEV4cHJlc3Npb25TZXF1ZW5jZVxuICAgICAgICBjb25zdCBub2RlOiBSdWxlQ29udGV4dCA9IGN0eC5nZXRDaGlsZCgwKTsgLy8gdmlzaXRFeHByZXNzaW9uU2VxdWVuY2UgXG4gICAgICAgIGxldCBleHBcbiAgICAgICAgaWYgKG5vZGUgaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLkV4cHJlc3Npb25TZXF1ZW5jZUNvbnRleHQpIHtcbiAgICAgICAgICAgIGV4cCA9IHRoaXMudmlzaXRFeHByZXNzaW9uU2VxdWVuY2Uobm9kZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnRocm93SW5zYW5jZUVycm9yKHRoaXMuZHVtcENvbnRleHQobm9kZSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGV4cCAvL3RoaXMuZGVjb3JhdGUoZXhwLCB0aGlzLmFzTWFya2VyKHRoaXMuYXNNZXRhZGF0YShjdHguZ2V0U291cmNlSW50ZXJ2YWwoKSkpKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIGlmU3RhdGVtZW50XG4gICAgICogICA6IElmICcoJyBleHByZXNzaW9uU2VxdWVuY2UgJyknIHN0YXRlbWVudCAoIEVsc2Ugc3RhdGVtZW50ICk/XG4gICAgICogICA7XG4gICAgICovXG4gICAgdmlzaXRJZlN0YXRlbWVudChjdHg6IFJ1bGVDb250ZXh0KTogSWZTdGF0ZW1lbnQge1xuICAgICAgICB0aGlzLmxvZyhjdHgsIFRyYWNlLmZyYW1lKCkpXG4gICAgICAgIHRoaXMuYXNzZXJ0VHlwZShjdHgsIEVDTUFTY3JpcHRQYXJzZXIuSWZTdGF0ZW1lbnRDb250ZXh0KVxuICAgICAgICBjb25zdCBjb3VudCA9IGN0eC5nZXRDaGlsZENvdW50KCk7XG4gICAgICAgIGNvbnN0IHRlc3QgPSB0aGlzLnZpc2l0RXhwcmVzc2lvblNlcXVlbmNlKGN0eC5nZXRDaGlsZCgyKSk7XG4gICAgICAgIGNvbnN0IGNvbnNlcXVlbnQgPSB0aGlzLnZpc2l0U3RhdGVtZW50KGN0eC5nZXRDaGlsZCg0KSk7XG4gICAgICAgIGNvbnN0IGFsdGVybmF0ZSA9IGNvdW50ID09IDcgPyB0aGlzLnZpc2l0U3RhdGVtZW50KGN0eC5nZXRDaGlsZCg2KSkgOiB1bmRlZmluZWQ7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBJZlN0YXRlbWVudCh0ZXN0LCBjb25zZXF1ZW50LCBhbHRlcm5hdGUpO1xuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI0RvU3RhdGVtZW50LlxuICAgIHZpc2l0RG9TdGF0ZW1lbnQoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJ2aXNpdERvU3RhdGVtZW50OiBcIiArIGN0eC5nZXRUZXh0KCkpO1xuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI1doaWxlU3RhdGVtZW50LlxuICAgIHZpc2l0V2hpbGVTdGF0ZW1lbnQoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJ2aXNpdFdoaWxlU3RhdGVtZW50OiBcIiArIGN0eC5nZXRUZXh0KCkpO1xuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI0ZvclN0YXRlbWVudC5cbiAgICB2aXNpdEZvclN0YXRlbWVudChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0V2hpbGVTdGF0ZW1lbnQ6IFwiICsgY3R4LmdldFRleHQoKSk7XG4gICAgfVxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjRm9yVmFyU3RhdGVtZW50LlxuICAgIHZpc2l0Rm9yVmFyU3RhdGVtZW50KGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNGb3JJblN0YXRlbWVudC5cbiAgICB2aXNpdEZvckluU3RhdGVtZW50KGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNGb3JWYXJJblN0YXRlbWVudC5cbiAgICB2aXNpdEZvclZhckluU3RhdGVtZW50KGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNjb250aW51ZVN0YXRlbWVudC5cbiAgICB2aXNpdENvbnRpbnVlU3RhdGVtZW50KGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcblxuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2JyZWFrU3RhdGVtZW50LlxuICAgIHZpc2l0QnJlYWtTdGF0ZW1lbnQoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuXG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNyZXR1cm5TdGF0ZW1lbnQuXG4gICAgdmlzaXRSZXR1cm5TdGF0ZW1lbnQoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuXG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciN3aXRoU3RhdGVtZW50LlxuICAgIHZpc2l0V2l0aFN0YXRlbWVudChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG5cbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI3N3aXRjaFN0YXRlbWVudC5cbiAgICB2aXNpdFN3aXRjaFN0YXRlbWVudChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG5cbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2Nhc2VCbG9jay5cbiAgICB2aXNpdENhc2VCbG9jayhjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG5cbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2Nhc2VDbGF1c2VzLlxuICAgIHZpc2l0Q2FzZUNsYXVzZXMoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuXG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNjYXNlQ2xhdXNlLlxuICAgIHZpc2l0Q2FzZUNsYXVzZShjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG5cbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2RlZmF1bHRDbGF1c2UuXG4gICAgdmlzaXREZWZhdWx0Q2xhdXNlKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcblxuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjbGFiZWxsZWRTdGF0ZW1lbnQuXG4gICAgdmlzaXRMYWJlbGxlZFN0YXRlbWVudChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG5cbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI3Rocm93U3RhdGVtZW50LlxuICAgIHZpc2l0VGhyb3dTdGF0ZW1lbnQoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuXG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciN0cnlTdGF0ZW1lbnQuXG4gICAgdmlzaXRUcnlTdGF0ZW1lbnQoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuXG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNjYXRjaFByb2R1Y3Rpb24uXG4gICAgdmlzaXRDYXRjaFByb2R1Y3Rpb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuXG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNmaW5hbGx5UHJvZHVjdGlvbi5cbiAgICB2aXNpdEZpbmFsbHlQcm9kdWN0aW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcblxuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2RlYnVnZ2VyU3RhdGVtZW50LlxuICAgIHZpc2l0RGVidWdnZXJTdGF0ZW1lbnQoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuXG4gICAgfVxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjZnVuY3Rpb25EZWNsYXJhdGlvbi5cbiAgICB2aXNpdEZ1bmN0aW9uRGVjbGFyYXRpb24oY3R4OiBSdWxlQ29udGV4dCk6IEZ1bmN0aW9uRGVjbGFyYXRpb24gfCBBc3luY0Z1bmN0aW9uRGVjbGFyYXRpb24ge1xuICAgICAgICB0aGlzLmxvZyhjdHgsIFRyYWNlLmZyYW1lKCkpO1xuICAgICAgICB0aGlzLmFzc2VydFR5cGUoY3R4LCBFQ01BU2NyaXB0UGFyc2VyLkZ1bmN0aW9uRGVjbGFyYXRpb25Db250ZXh0KTtcbiAgICAgICAgbGV0IGFzeW5jID0gZmFsc2U7XG4gICAgICAgIGxldCBnZW5lcmF0b3IgPSBmYWxzZTtcbiAgICAgICAgbGV0IGlkZW50aWZpZXI6IElkZW50aWZpZXI7XG4gICAgICAgIGxldCBwYXJhbXM7XG4gICAgICAgIGxldCBib2R5O1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY3R4LmdldENoaWxkQ291bnQoKTsgKytpKSB7XG4gICAgICAgICAgICBjb25zdCBub2RlID0gY3R4LmdldENoaWxkKGkpO1xuICAgICAgICAgICAgaWYgKG5vZGUuc3ltYm9sKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgdHh0ID0gbm9kZS5nZXRUZXh0KCk7XG4gICAgICAgICAgICAgICAgaWYgKHR4dCA9PSAnYXN5bmMnKSB7XG4gICAgICAgICAgICAgICAgICAgIGFzeW5jID0gdHJ1ZVxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodHh0ID09ICcqJykge1xuICAgICAgICAgICAgICAgICAgICBnZW5lcmF0b3IgPSB0cnVlXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAobm9kZSBpbnN0YW5jZW9mIEVDTUFTY3JpcHRQYXJzZXIuSWRlbnRpZmllckNvbnRleHQpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmluZm8oXCJFQ01BU2NyaXB0UGFyc2VyIDs7IElkZW50aWZpZXJDb250ZXh0XCIpXG4gICAgICAgICAgICAgICAgaWRlbnRpZmllciA9IHRoaXMudmlzaXRJZGVudGlmaWVyKG5vZGUpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChub2RlIGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5Gb3JtYWxQYXJhbWV0ZXJMaXN0Q29udGV4dCkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuaW5mbyhcIkVDTUFTY3JpcHRQYXJzZXIgOzsgRm9ybWFsUGFyYW1ldGVyTGlzdENvbnRleHRcIilcbiAgICAgICAgICAgICAgICBwYXJhbXMgPSB0aGlzLnZpc2l0Rm9ybWFsUGFyYW1ldGVyTGlzdChub2RlKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAobm9kZSBpbnN0YW5jZW9mIEVDTUFTY3JpcHRQYXJzZXIuRnVuY3Rpb25Cb2R5Q29udGV4dCkge1xuICAgICAgICAgICAgICAgIC8vIGJvZHkgPSB0aGlzLnZpc2l0RnVuY3Rpb25Cb2R5KG5vZGUpO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuaW5mbyhcIkVDTUFTY3JpcHRQYXJzZXIgOzsgRm9ybWFsUGFyYW1ldGVyTGlzdENvbnRleHRcIilcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5kdW1wQ29udGV4dEFsbENoaWxkcmVuKG5vZGUpXG4gICAgICAgIH1cblxuICAgICAgICBjb25zb2xlLmluZm8oJ2FzeW5jICA9ICcgKyBhc3luYyk7XG4gICAgICAgIGNvbnNvbGUuaW5mbygnZ2VuZXJhdG9yICA9ICcgKyBnZW5lcmF0b3IpO1xuXG4gICAgICAgIGlmIChhc3luYykge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBBc3luY0Z1bmN0aW9uRGVjbGFyYXRpb24oaWRlbnRpZmllciwgcGFyYW1zLCBib2R5LCBnZW5lcmF0b3IpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gIGNvbnN0cnVjdG9yKGlkOiBJZGVudGlmaWVyIHwgbnVsbCwgcGFyYW1zOiBGdW5jdGlvblBhcmFtZXRlcltdLCBib2R5OiBCbG9ja1N0YXRlbWVudCwgZ2VuZXJhdG9yOiBib29sZWFuKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IEZ1bmN0aW9uRGVjbGFyYXRpb24oaWRlbnRpZmllciwgcGFybWFzLCBib2R5LCBnZW5lcmF0b3IpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjZnVuY3Rpb25EZWNsXG4gICAgdmlzaXRGdW5jdGlvbkRlY2woY3R4OiBSdWxlQ29udGV4dCk6IEZ1bmN0aW9uRGVjbGFyYXRpb24ge1xuICAgICAgICB0aGlzLmxvZyhjdHgsIFRyYWNlLmZyYW1lKCkpO1xuICAgICAgICB0aGlzLmFzc2VydFR5cGUoY3R4LCBFQ01BU2NyaXB0UGFyc2VyLkZ1bmN0aW9uRGVjbENvbnRleHQpO1xuICAgICAgICByZXR1cm4gdGhpcy52aXNpdEZ1bmN0aW9uRGVjbGFyYXRpb24oY3R4LmdldENoaWxkKDApKVxuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2Z1bmN0aW9uQm9keS5cbiAgICB2aXNpdEZ1bmN0aW9uQm9keShjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0RnVuY3Rpb25Cb2R5OiBcIiArIGN0eC5nZXRUZXh0KCkpO1xuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjYXJyYXlMaXRlcmFsLlxuICAgIHZpc2l0QXJyYXlMaXRlcmFsKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS5pbmZvKFwidmlzaXRBcnJheUxpdGVyYWwgWyVzXSA6ICVzXCIsIGN0eC5nZXRDaGlsZENvdW50KCksIGN0eC5nZXRUZXh0KCkpO1xuICAgICAgICB0aGlzLmFzc2VydFR5cGUoY3R4LCBFQ01BU2NyaXB0UGFyc2VyLkFycmF5TGl0ZXJhbENvbnRleHQpXG4gICAgICAgIC8vIHdlIGp1c3QgZ290IGBbXWBcblxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJ2aXNpdEFycmF5TGl0ZXJhbCBub3QgaW1wbGVtZW50ZWRcIilcblxuICAgICAgICBpZiAoY3R4LmdldENoaWxkQ291bnQoKSA9PSAyKSB7XG4gICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgIH1cbiAgICAgICAgLyogXG4gICAgICAgICAgICAgICAgbGV0IHJlc3VsdHMgPSBbXVxuICAgICAgICAgICAgICAgIC8vIHNraXAgYFsgYW5kICBdYCBcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMTsgaSA8IGN0eC5nZXRDaGlsZENvdW50KCkgLSAxOyArK2kpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgbm9kZTogUnVsZUNvbnRleHQgPSBjdHguZ2V0Q2hpbGQoaSk7XG4gICAgICAgICAgICAgICAgICAgIGxldCBleHAgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG5vZGUgaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLkVsZW1lbnRMaXN0Q29udGV4dCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZXhwID0gdGhpcy52aXNpdEVsZW1lbnRMaXN0KG5vZGUpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKG5vZGUgaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLkVsaXNpb25Db250ZXh0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBleHAgPSB0aGlzLnZpc2l0RWxpc2lvbihub2RlKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHNwZWNpYWwgY2FzZSBmb3IgaGFuZGxpbmcgZWxpc2lvbiB2YWx1ZXMgbGlrZSA6ICBbMTEsLCwxMV0gXSAgWywsXVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG5vZGUuc3ltYm9sICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV4cCA9IFtudWxsXVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50aHJvd0luc2FuY2VFcnJvcih0aGlzLmR1bXBDb250ZXh0KG5vZGUpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXN1bHRzID0gWy4uLnJlc3VsdHMsIC4uLmV4cF07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHRzOyAqL1xuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2VsZW1lbnRMaXN0LlxuICAgIHZpc2l0RWxlbWVudExpc3QoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJ2aXNpdEVsZW1lbnRMaXN0IFslc10gOiAlc1wiLCBjdHguZ2V0Q2hpbGRDb3VudCgpLCBjdHguZ2V0VGV4dCgpKTtcbiAgICAgICAgdGhpcy5hc3NlcnRUeXBlKGN0eCwgRUNNQVNjcmlwdFBhcnNlci5FbGVtZW50TGlzdENvbnRleHQpXG4gICAgICAgIGNvbnN0IGVsZW1lbnRzID0gW107XG4gICAgICAgIGNvbnN0IG5vZGVzOiBSdWxlQ29udGV4dFtdID0gdGhpcy5maWx0ZXJTeW1ib2xzKGN0eCk7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgIGNvbnN0IGVsZW0gPSB0aGlzLnNpbmdsZUV4cHJlc3Npb24obm9kZXNbaV0pO1xuICAgICAgICAgICAgZWxlbWVudHMucHVzaChlbGVtKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZWxlbWVudHM7XG4gICAgfVxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjZWxpc2lvbi5cbiAgICB2aXNpdEVsaXNpb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJ2aXNpdEVsaXNpb24gWyVzXSA6ICVzXCIsIGN0eC5nZXRDaGlsZENvdW50KCksIGN0eC5nZXRUZXh0KCkpO1xuICAgICAgICB0aGlzLmFzc2VydFR5cGUoY3R4LCBFQ01BU2NyaXB0UGFyc2VyLkVsaXNpb25Db250ZXh0KVxuICAgICAgICAvLyBjb21wbGlhbmNlOiBlc3ByaW1hIGNvbXBsaWFuZSBvciByZXR1cm5pbmcgYG51bGxgIFxuICAgICAgICBjb25zdCBlbGlzaW9uID0gW107XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY3R4LmdldENoaWxkQ291bnQoKTsgKytpKSB7XG4gICAgICAgICAgICBlbGlzaW9uLnB1c2gobnVsbCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGVsaXNpb247XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjb2JqZWN0TGl0ZXJhbC5cbiAgICAgKiBvYmplY3RMaXRlcmFsXG4gICAgICogIDogJ3snIChwcm9wZXJ0eUFzc2lnbm1lbnQgKCcsJyBwcm9wZXJ0eUFzc2lnbm1lbnQpKik/ICcsJz8gJ30nXG4gICAgICogIDtcbiAgICAgKiBAcGFyYW0gY3R4IFxuICAgICAqL1xuICAgIHZpc2l0T2JqZWN0TGl0ZXJhbChjdHg6IFJ1bGVDb250ZXh0KTogT2JqZWN0RXhwcmVzc2lvbiB7XG4gICAgICAgIHRoaXMubG9nKGN0eCwgVHJhY2UuZnJhbWUoKSlcbiAgICAgICAgdGhpcy5hc3NlcnRUeXBlKGN0eCwgRUNNQVNjcmlwdFBhcnNlci5PYmplY3RMaXRlcmFsQ29udGV4dCk7XG4gICAgICAgIGlmIChjdHguZ2V0Q2hpbGRDb3VudCgpID09IDIpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgT2JqZWN0RXhwcmVzc2lvbihbXSk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBub2RlcyA9IHRoaXMuZmlsdGVyU3ltYm9scyhjdHgpO1xuICAgICAgICBjb25zdCBwcm9wZXJ0aWVzOiBPYmplY3RFeHByZXNzaW9uUHJvcGVydHlbXSA9IFtdO1xuICAgICAgICBmb3IgKGNvbnN0IG5vZGUgb2Ygbm9kZXMpIHtcbiAgICAgICAgICAgIGxldCBwcm9wZXJ0eTogT2JqZWN0RXhwcmVzc2lvblByb3BlcnR5O1xuICAgICAgICAgICAgaWYgKG5vZGUgaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLlByb3BlcnR5RXhwcmVzc2lvbkFzc2lnbm1lbnRDb250ZXh0KSB7XG4gICAgICAgICAgICAgICAgcHJvcGVydHkgPSB0aGlzLnZpc2l0UHJvcGVydHlFeHByZXNzaW9uQXNzaWdubWVudChub2RlKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAobm9kZSBpbnN0YW5jZW9mIEVDTUFTY3JpcHRQYXJzZXIuUHJvcGVydHlTaG9ydGhhbmRDb250ZXh0KSB7XG4gICAgICAgICAgICAgICAgcHJvcGVydHkgPSB0aGlzLnZpc2l0UHJvcGVydHlTaG9ydGhhbmQobm9kZSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG5vZGUgaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLkZ1bmN0aW9uUHJvcGVydHlDb250ZXh0KSB7XG4gICAgICAgICAgICAgICAgcHJvcGVydHkgPSB0aGlzLnZpc2l0RnVuY3Rpb25Qcm9wZXJ0eShub2RlKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy50aHJvd0luc2FuY2VFcnJvcih0aGlzLmR1bXBDb250ZXh0KG5vZGUpKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAocHJvcGVydHkgIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgcHJvcGVydGllcy5wdXNoKHByb3BlcnR5KVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXcgT2JqZWN0RXhwcmVzc2lvbihwcm9wZXJ0aWVzKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNwcm9wZXJ0eVNob3J0aGFuZC5cbiAgICAgKiAgfCBFbGxpcHNpcz8gc2luZ2xlRXhwcmVzc2lvbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAjIFByb3BlcnR5U2hvcnRoYW5kXG4gICAgICogQHBhcmFtIGN0eCBcbiAgICAgKi9cbiAgICB2aXNpdFByb3BlcnR5U2hvcnRoYW5kKGN0eDogUnVsZUNvbnRleHQpOiBPYmplY3RFeHByZXNzaW9uUHJvcGVydHkge1xuICAgICAgICB0aGlzLmxvZyhjdHgsIFRyYWNlLmZyYW1lKCkpO1xuICAgICAgICB0aGlzLmFzc2VydFR5cGUoY3R4LCBFQ01BU2NyaXB0UGFyc2VyLlByb3BlcnR5U2hvcnRoYW5kQ29udGV4dClcbiAgICAgICAgY29uc3QgY29tcHV0ZWQgPSBmYWxzZTtcbiAgICAgICAgY29uc3QgbWV0aG9kID0gZmFsc2U7XG4gICAgICAgIGNvbnN0IHNob3J0aGFuZCA9IHRydWU7XG4gICAgICAgIGNvbnN0IHZhbHVlID0gdGhpcy5zaW5nbGVFeHByZXNzaW9uKGN0eC5nZXRDaGlsZCgwKSk7XG4gICAgICAgIGNvbnN0IGtleTogUHJvcGVydHlLZXkgPSAgbmV3IElkZW50aWZpZXIoY3R4LmdldFRleHQoKSlcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9wZXJ0eShcImluaXRcIiwga2V5LCBjb21wdXRlZCwgdmFsdWUsIG1ldGhvZCwgc2hvcnRoYW5kKTtcbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNwcm9wZXJ0eVNob3J0aGFuZC5cbiAgICB2aXNpdEZ1bmN0aW9uUHJvcGVydHkoY3R4OiBSdWxlQ29udGV4dCk6IE9iamVjdEV4cHJlc3Npb25Qcm9wZXJ0eSB7XG4gICAgICAgIHRoaXMubG9nKGN0eCwgVHJhY2UuZnJhbWUoKSk7XG4gICAgICAgIHRoaXMuYXNzZXJ0VHlwZShjdHgsIEVDTUFTY3JpcHRQYXJzZXIuRnVuY3Rpb25Qcm9wZXJ0eUNvbnRleHQpXG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJub3QgaW1wbGVtZW50ZWRcIilcbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNwcm9wZXJ0eU5hbWVBbmRWYWx1ZUxpc3QuXG4gICAgdmlzaXRQcm9wZXJ0eU5hbWVBbmRWYWx1ZUxpc3QoY3R4OiBSdWxlQ29udGV4dCk6IE9iamVjdEV4cHJlc3Npb25Qcm9wZXJ0eVtdIHtcbiAgICAgICAgY29uc29sZS5pbmZvKFwidmlzaXRQcm9wZXJ0eU5hbWVBbmRWYWx1ZUxpc3QgWyVzXSA6ICVzXCIsIGN0eC5nZXRDaGlsZENvdW50KCksIGN0eC5nZXRUZXh0KCkpO1xuICAgICAgICB0aGlzLmFzc2VydFR5cGUoY3R4LCBFQ01BU2NyaXB0UGFyc2VyLlByb3BlcnR5TmFtZUFuZFZhbHVlTGlzdENvbnRleHQpO1xuICAgICAgICBjb25zdCBwcm9wZXJ0aWVzOiBPYmplY3RFeHByZXNzaW9uUHJvcGVydHlbXSA9IFtdO1xuICAgICAgICBjb25zdCBub2RlczogUnVsZUNvbnRleHRbXSA9IHRoaXMuZmlsdGVyU3ltYm9scyhjdHgpO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICBjb25zdCBub2RlID0gbm9kZXNbaV07XG4gICAgICAgICAgICBpZiAobm9kZSBpbnN0YW5jZW9mIEVDTUFTY3JpcHRQYXJzZXIuUHJvcGVydHlFeHByZXNzaW9uQXNzaWdubWVudENvbnRleHQpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBwcm9wZXJ0eTogT2JqZWN0RXhwcmVzc2lvblByb3BlcnR5ID0gdGhpcy52aXNpdFByb3BlcnR5RXhwcmVzc2lvbkFzc2lnbm1lbnQobm9kZSk7XG4gICAgICAgICAgICAgICAgcHJvcGVydGllcy5wdXNoKHByb3BlcnR5KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy50aHJvd0luc2FuY2VFcnJvcih0aGlzLmR1bXBDb250ZXh0KG5vZGUpKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBwcm9wZXJ0aWVzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEZpbHRlciBvdXQgVGVybWluYWxOb2RlcyAoY29tbWFzLCBwaXBlcywgYnJhY2tldHMpXG4gICAgICogQHBhcmFtIGN0eCBcbiAgICAgKi9cbiAgICBwcml2YXRlIGZpbHRlclN5bWJvbHMoY3R4OiBSdWxlQ29udGV4dCk6IFJ1bGVDb250ZXh0W10ge1xuICAgICAgICBjb25zdCBmaWx0ZXJlZDogUnVsZUNvbnRleHRbXSA9IFtdO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGN0eC5nZXRDaGlsZENvdW50KCk7ICsraSkge1xuICAgICAgICAgICAgY29uc3Qgbm9kZSA9IGN0eC5nZXRDaGlsZChpKTtcbiAgICAgICAgICAgIC8vIHRoZXJlIG1pZ2h0IGJlIGEgYmV0dGVyIHdheVxuICAgICAgICAgICAgaWYgKG5vZGUuc3ltYm9sICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZmlsdGVyZWQucHVzaChub2RlKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmlsdGVyZWQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjUHJvcGVydHlFeHByZXNzaW9uQXNzaWdubWVudC5cbiAgICAgKiBwcm9wZXJ0eUFzc2lnbm1lbnRcbiAgICAgKiAgICAgOiBwcm9wZXJ0eU5hbWUgJzonIHNpbmdsZUV4cHJlc3Npb24gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAjIFByb3BlcnR5RXhwcmVzc2lvbkFzc2lnbm1lbnRcbiAgICAgKiAgICAgfCAnWycgc2luZ2xlRXhwcmVzc2lvbiAnXScgJzonIHNpbmdsZUV4cHJlc3Npb24gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAjIENvbXB1dGVkUHJvcGVydHlFeHByZXNzaW9uQXNzaWdubWVudFxuICAgICAqICAgICB8IEFzeW5jPyAnKic/IHByb3BlcnR5TmFtZSAnKCcgZm9ybWFsUGFyYW1ldGVyTGlzdD8gICcpJyAgJ3snIGZ1bmN0aW9uQm9keSAnfScgICMgRnVuY3Rpb25Qcm9wZXJ0eVxuICAgICAqICAgICB8IGdldHRlciAnKCcgJyknICd7JyBmdW5jdGlvbkJvZHkgJ30nICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICMgUHJvcGVydHlHZXR0ZXJcbiAgICAgKiAgICAgfCBzZXR0ZXIgJygnIGZvcm1hbFBhcmFtZXRlckFyZyAnKScgJ3snIGZ1bmN0aW9uQm9keSAnfScgICAgICAgICAgICAgICAgICAgICAgICAjIFByb3BlcnR5U2V0dGVyXG4gICAgICogICAgIHwgRWxsaXBzaXM/IHNpbmdsZUV4cHJlc3Npb24gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIyBQcm9wZXJ0eVNob3J0aGFuZFxuICAgICAqICAgICA7XG4gICAgICovXG4gICAgdmlzaXRQcm9wZXJ0eUV4cHJlc3Npb25Bc3NpZ25tZW50KGN0eDogUnVsZUNvbnRleHQpOiBPYmplY3RFeHByZXNzaW9uUHJvcGVydHkge1xuICAgICAgICB0aGlzLmxvZyhjdHgsIFRyYWNlLmZyYW1lKCkpO1xuICAgICAgICB0aGlzLmFzc2VydFR5cGUoY3R4LCBFQ01BU2NyaXB0UGFyc2VyLlByb3BlcnR5RXhwcmVzc2lvbkFzc2lnbm1lbnRDb250ZXh0KTtcblxuICAgICAgICBsZXQgbm9kZSA9IGN0eC5nZXRDaGlsZCgwKTtcblxuICAgICAgICB0aGlzLmR1bXBDb250ZXh0QWxsQ2hpbGRyZW4oY3R4KVxuICAgICAgICBsZXQgbjAgPSBjdHguZ2V0Q2hpbGQoMCk7IC8vIFByb3BlcnR5TmFtZVxuICAgICAgICBsZXQgbjEgPSBjdHguZ2V0Q2hpbGQoMSk7IC8vIHN5bWJvbCA6XG4gICAgICAgIGxldCBuMiA9IGN0eC5nZXRDaGlsZCgyKTsgLy8gIHNpbmdsZUV4cHJlc3Npb24gXG4gICAgICAgIGxldCBrZXk6IFByb3BlcnR5S2V5ID0gdGhpcy52aXNpdFByb3BlcnR5TmFtZShuMCk7XG4gICAgICAgIGxldCB2YWx1ZTtcbiAgICAgICAgY29uc3QgY29tcHV0ZWQgPSBmYWxzZTtcbiAgICAgICAgY29uc3QgbWV0aG9kID0gZmFsc2U7XG4gICAgICAgIGNvbnN0IHNob3J0aGFuZCA9IGZhbHNlO1xuXG4gICAgICAgIGlmIChuMiBpbnN0YW5jZW9mIEVDTUFTY3JpcHRQYXJzZXIuUHJvcGVydHlFeHByZXNzaW9uQXNzaWdubWVudENvbnRleHQpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuaW5mbygnIC0tIFByb3BlcnR5RXhwcmVzc2lvbkFzc2lnbm1lbnRDb250ZXh0JylcbiAgICAgICAgICAgIGtleSA9IHRoaXMudmlzaXRQcm9wZXJ0eU5hbWUobjApO1xuICAgICAgICB9IGVsc2UgaWYgKG4yIGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5Db21wdXRlZFByb3BlcnR5RXhwcmVzc2lvbkFzc2lnbm1lbnRDb250ZXh0KSB7XG4gICAgICAgICAgICBjb25zb2xlLmluZm8oJyAtLSBDb21wdXRlZFByb3BlcnR5RXhwcmVzc2lvbkFzc2lnbm1lbnRDb250ZXh0JylcbiAgICAgICAgfSBlbHNlIGlmIChuMiBpbnN0YW5jZW9mIEVDTUFTY3JpcHRQYXJzZXIuRnVuY3Rpb25Qcm9wZXJ0eUNvbnRleHQpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuaW5mbygnIC0tIEZ1bmN0aW9uUHJvcGVydHlDb250ZXh0JylcbiAgICAgICAgfSBlbHNlIGlmIChuMiBpbnN0YW5jZW9mIEVDTUFTY3JpcHRQYXJzZXIuUHJvcGVydHlHZXR0ZXJDb250ZXh0KSB7XG4gICAgICAgICAgICBjb25zb2xlLmluZm8oJyAtLSBQcm9wZXJ0eUdldHRlckNvbnRleHQnKVxuICAgICAgICB9IGVsc2UgaWYgKG4yIGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5Qcm9wZXJ0eVNldHRlckNvbnRleHQpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuaW5mbygnIC0tIFByb3BlcnR5U2V0dGVyQ29udGV4dCcpXG4gICAgICAgIH0gZWxzZSBpZiAobjIgaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLlByb3BlcnR5U2hvcnRoYW5kQ29udGV4dCkge1xuICAgICAgICAgICAgY29uc29sZS5pbmZvKCcgLS0gUHJvcGVydHlTaG9ydGhhbmRDb250ZXh0JylcbiAgICAgICAgfVxuICAgICAgICAvLyB0aGlzLnNpbmdsZUV4cHJlc3Npb24objIpO1xuXG4gICAgICAgIHJldHVybiBuZXcgUHJvcGVydHkoXCJpbml0XCIsIGtleSwgY29tcHV0ZWQsIHZhbHVlLCBtZXRob2QsIHNob3J0aGFuZCk7XG4gICAgfVxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjUHJvcGVydHlHZXR0ZXIuXG4gICAgdmlzaXRQcm9wZXJ0eUdldHRlcihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG5cbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI1Byb3BlcnR5U2V0dGVyLlxuICAgIHZpc2l0UHJvcGVydHlTZXR0ZXIoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjcHJvcGVydHlOYW1lLlxuICAgICAqIFxuICAgICAqIHByb3BlcnR5TmFtZVxuICAgICAqICA6IGlkZW50aWZpZXJOYW1lXG4gICAgICogIHwgU3RyaW5nTGl0ZXJhbFxuICAgICAqICB8IG51bWVyaWNMaXRlcmFsXG4gICAgICogIHwgJ1snIHNpbmdsZUV4cHJlc3Npb24gJ10nXG4gICAgICogIDtcbiAgICAgKi9cbiAgICB2aXNpdFByb3BlcnR5TmFtZShjdHg6IFJ1bGVDb250ZXh0KTogUHJvcGVydHlLZXkge1xuICAgICAgICB0aGlzLmxvZyhjdHgsIFRyYWNlLmZyYW1lKCkpXG4gICAgICAgIHRoaXMuYXNzZXJ0VHlwZShjdHgsIEVDTUFTY3JpcHRQYXJzZXIuUHJvcGVydHlOYW1lQ29udGV4dCk7XG4gICAgICAgIHRoaXMuYXNzZXJ0Tm9kZUNvdW50KGN0eCwgMSk7XG4gICAgICAgIGNvbnN0IG5vZGUgPSBjdHguZ2V0Q2hpbGQoMCk7XG4gICAgICAgIGNvbnN0IGNvdW50ID0gbm9kZS5nZXRDaGlsZENvdW50KCk7XG5cbiAgICAgICAgaWYgKGNvdW50ID09IDApIHsgLy8gbGl0ZXJhbFxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY3JlYXRlTGl0ZXJhbFZhbHVlKG5vZGUpO1xuICAgICAgICB9IGVsc2UgaWYgKGNvdW50ID09IDEpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnZpc2l0SWRlbnRpZmllck5hbWUobm9kZSlcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnRocm93SW5zYW5jZUVycm9yKHRoaXMuZHVtcENvbnRleHQobm9kZSkpO1xuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI3Byb3BlcnR5U2V0UGFyYW1ldGVyTGlzdC5cbiAgICB2aXNpdFByb3BlcnR5U2V0UGFyYW1ldGVyTGlzdChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG5cbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNhcmd1bWVudHMuXG4gICAgdmlzaXRBcmd1bWVudHMoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJ2aXNpdEFyZ3VtZW50czogXCIgKyBjdHguZ2V0VGV4dCgpKTtcblxuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2FyZ3VtZW50TGlzdC5cbiAgICB2aXNpdEFyZ3VtZW50TGlzdChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0QXJndW1lbnRMaXN0OiBcIiArIGN0eC5nZXRUZXh0KCkpO1xuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2V4cHJlc3Npb25TZXF1ZW5jZS5cbiAgICB2aXNpdEV4cHJlc3Npb25TZXF1ZW5jZShjdHg6IFJ1bGVDb250ZXh0KTogRXhwcmVzc2lvblN0YXRlbWVudCB7XG4gICAgICAgIHRoaXMubG9nKGN0eCwgVHJhY2UuZnJhbWUoKSlcbiAgICAgICAgdGhpcy5hc3NlcnRUeXBlKGN0eCwgRUNNQVNjcmlwdFBhcnNlci5FeHByZXNzaW9uU2VxdWVuY2VDb250ZXh0KTtcbiAgICAgICAgY29uc3QgZXhwcmVzc2lvbnMgPSBbXTtcbiAgICAgICAgLy8gZWFjaCBub2RlIGlzIGEgc2luZ2xlRXhwcmVzc2lvblxuICAgICAgICBmb3IgKGNvbnN0IG5vZGUgb2YgdGhpcy5maWx0ZXJTeW1ib2xzKGN0eCkpIHtcbiAgICAgICAgICAgIC8vIGNvbnN0IG5vZGU6IFJ1bGVDb250ZXh0ID0gY3R4LmdldENoaWxkKGkpO1xuICAgICAgICAgICAgY29uc3QgZXhwID0gdGhpcy5zaW5nbGVFeHByZXNzaW9uKG5vZGUpO1xuICAgICAgICAgICAgZXhwcmVzc2lvbnMucHVzaChleHApO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gY29tcGxpYW5jZTogZXNwaXJtYSwgZXNwcmVlXG4gICAgICAgIC8vIHRoaXMgY2hlY2sgdG8gc2VlIGlmIHRoZXJlIGFyZSBtdWx0aXBsZSBleHByZXNzaW9ucyBpZiBzbyB0aGVuIHdlIGxlYXZlIHRoZW0gYXMgU2VxdWVuY2VFeHByZXNzaW9uIFxuICAgICAgICAvLyBvdGhlcndpc2Ugd2Ugd2lsbCByb2xsIHRoZW0gdXAgaW50byBFeHByZXNzaW9uU3RhdGVtZW50IHdpdGggb25lIGV4cHJlc3Npb25cbiAgICAgICAgLy8gYDFgID0gRXhwcmVzc2lvblN0YXRlbWVudCAtPiBMaXRlcmFsXG4gICAgICAgIC8vIGAxLCAyYCA9IEV4cHJlc3Npb25TdGF0ZW1lbnQgLT4gU2VxdWVuY2VFeHByZXNzaW9uIC0+IExpdGVyYWwsIExpdGVyYWxcbiAgICAgICAgbGV0IGV4cDtcbiAgICAgICAgaWYgKGV4cHJlc3Npb25zLmxlbmd0aCA9PSAxKSB7XG4gICAgICAgICAgICBleHAgPSBuZXcgRXhwcmVzc2lvblN0YXRlbWVudChleHByZXNzaW9uc1swXSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGV4cCA9IG5ldyBTZXF1ZW5jZUV4cHJlc3Npb24oZXhwcmVzc2lvbnMpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmRlY29yYXRlKGV4cCwgdGhpcy5hc01hcmtlcih0aGlzLmFzTWV0YWRhdGEoY3R4LmdldFNvdXJjZUludGVydmFsKCkpKSlcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBFdmFsdWF0ZSBhIHNpbmdsZUV4cHJlc3Npb25cbiAgICAgKiBAcGFyYW0gbm9kZSBcbiAgICAgKi9cbiAgICBzaW5nbGVFeHByZXNzaW9uKG5vZGU6IFJ1bGVDb250ZXh0KTogYW55IHtcbiAgICAgICAgaWYgKG5vZGUgaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLkxpdGVyYWxFeHByZXNzaW9uQ29udGV4dCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmlzaXRMaXRlcmFsRXhwcmVzc2lvbihub2RlKTtcbiAgICAgICAgfSBlbHNlIGlmIChub2RlIGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5PYmplY3RMaXRlcmFsRXhwcmVzc2lvbkNvbnRleHQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnZpc2l0T2JqZWN0TGl0ZXJhbEV4cHJlc3Npb24obm9kZSk7XG4gICAgICAgIH0gZWxzZSBpZiAobm9kZSBpbnN0YW5jZW9mIEVDTUFTY3JpcHRQYXJzZXIuQXNzaWdubWVudEV4cHJlc3Npb25Db250ZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy52aXNpdEFzc2lnbm1lbnRFeHByZXNzaW9uKG5vZGUpO1xuICAgICAgICB9IGVsc2UgaWYgKG5vZGUgaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLkFkZGl0aXZlRXhwcmVzc2lvbkNvbnRleHQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnZpc2l0QWRkaXRpdmVFeHByZXNzaW9uKG5vZGUpO1xuICAgICAgICB9IGVsc2UgaWYgKG5vZGUgaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLk11bHRpcGxpY2F0aXZlRXhwcmVzc2lvbkNvbnRleHQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnZpc2l0TXVsdGlwbGljYXRpdmVFeHByZXNzaW9uKG5vZGUpO1xuICAgICAgICB9IGVsc2UgaWYgKG5vZGUgaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLkFycmF5TGl0ZXJhbEV4cHJlc3Npb25Db250ZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy52aXNpdEFycmF5TGl0ZXJhbEV4cHJlc3Npb24obm9kZSk7XG4gICAgICAgIH0gZWxzZSBpZiAobm9kZSBpbnN0YW5jZW9mIEVDTUFTY3JpcHRQYXJzZXIuRXF1YWxpdHlFeHByZXNzaW9uQ29udGV4dCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmlzaXRFcXVhbGl0eUV4cHJlc3Npb24obm9kZSk7XG4gICAgICAgIH0gZWxzZSBpZiAobm9kZSBpbnN0YW5jZW9mIEVDTUFTY3JpcHRQYXJzZXIuUGFyZW50aGVzaXplZEV4cHJlc3Npb25Db250ZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy52aXNpdFBhcmVudGhlc2l6ZWRFeHByZXNzaW9uKG5vZGUpO1xuICAgICAgICB9IGVsc2UgaWYgKG5vZGUgaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLlJlbGF0aW9uYWxFeHByZXNzaW9uQ29udGV4dCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmlzaXRSZWxhdGlvbmFsRXhwcmVzc2lvbihub2RlKTtcbiAgICAgICAgfSBlbHNlIGlmIChub2RlIGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5JZGVudGlmaWVyRXhwcmVzc2lvbkNvbnRleHQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnZpc2l0SWRlbnRpZmllckV4cHJlc3Npb24obm9kZSk7XG4gICAgICAgIH0gZWxzZSBpZiAobm9kZSBpbnN0YW5jZW9mIEVDTUFTY3JpcHRQYXJzZXIuTWVtYmVyRG90RXhwcmVzc2lvbkNvbnRleHQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnZpc2l0TWVtYmVyRG90RXhwcmVzc2lvbihub2RlKTtcbiAgICAgICAgfSBlbHNlIGlmIChub2RlIGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5NZW1iZXJJbmRleEV4cHJlc3Npb25Db250ZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy52aXNpdE1lbWJlckluZGV4RXhwcmVzc2lvbihub2RlKTtcbiAgICAgICAgfSBlbHNlIGlmIChub2RlIGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5Bc3NpZ25tZW50T3BlcmF0b3JFeHByZXNzaW9uQ29udGV4dCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmlzaXRBc3NpZ25tZW50T3BlcmF0b3JFeHByZXNzaW9uKG5vZGUpO1xuICAgICAgICB9IGVsc2UgaWYgKG5vZGUgaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLkZ1bmN0aW9uRXhwcmVzc2lvbkNvbnRleHQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnZpc2l0RnVuY3Rpb25FeHByZXNzaW9uKG5vZGUpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMudGhyb3dJbnNhbmNlRXJyb3IodGhpcy5kdW1wQ29udGV4dChub2RlKSk7XG4gICAgfVxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjY2xhc3NEZWNsYXJhdGlvbi5cbiAgICB2aXNpdENsYXNzRGVjbGFyYXRpb24oY3R4OiBSdWxlQ29udGV4dCk6IENsYXNzRGVjbGFyYXRpb24ge1xuICAgICAgICB0aGlzLmxvZyhjdHgsIFRyYWNlLmZyYW1lKCkpO1xuICAgICAgICB0aGlzLmFzc2VydFR5cGUoY3R4LCBFQ01BU2NyaXB0UGFyc2VyLkNsYXNzRGVjbGFyYXRpb25Db250ZXh0KTtcbiAgICAgICAgLy8gQ2xhc3MgaWRlbnRpZmllciBjbGFzc1RhaWxcbiAgICAgICAgY29uc3QgaWRlbnRpZmllciA9IHRoaXMudmlzaXRJZGVudGlmaWVyKGN0eC5nZXRDaGlsZCgxKSk7XG4gICAgICAgIGNvbnN0IGJvZHk6IFByb3BlcnR5W10gPSB0aGlzLnZpc2l0Q2xhc3NUYWlsKGN0eC5nZXRDaGlsZCgyKSlcbiAgICAgICAgY29uc3QgY2xhc3NCb2R5ID0gbmV3IENsYXNzQm9keShib2R5KTtcbiAgICAgICAgcmV0dXJuIG5ldyBDbGFzc0RlY2xhcmF0aW9uKGlkZW50aWZpZXIsIG51bGwsIGNsYXNzQm9keSk7XG4gICAgfVxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjY2xhc3NUYWlsLlxuICAgIHZpc2l0Q2xhc3NUYWlsKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgdGhpcy5sb2coY3R4LCBUcmFjZS5mcmFtZSgpKTtcbiAgICAgICAgdGhpcy5hc3NlcnRUeXBlKGN0eCwgRUNNQVNjcmlwdFBhcnNlci5DbGFzc1RhaWxDb250ZXh0KTtcbiAgICAgICAgLy8gIChFeHRlbmRzIHNpbmdsZUV4cHJlc3Npb24pPyAneycgY2xhc3NFbGVtZW50KiAnfSdcbiAgICAgICAgdGhpcy5kdW1wQ29udGV4dEFsbENoaWxkcmVuKGN0eClcbiAgICAgICAgY29uc3Qgbm9kZSA9IHRoaXMuZ2V0Tm9kZUJ5VHlwZShjdHgsIEVDTUFTY3JpcHRQYXJzZXIuQ2xhc3NFbGVtZW50Q29udGV4dCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXROb2RlQnlUeXBlKGN0eDogUnVsZUNvbnRleHQsIHR5cGU6IGFueSkge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGN0eC5nZXRDaGlsZENvdW50KCk7ICsraSkge1xuICAgICAgICAgICAgaWYgKGN0eC5nZXRDaGlsZChpKSBpbnN0YW5jZW9mIHR5cGUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY3R4LmdldENoaWxkKGkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjY2xhc3NFbGVtZW50LlxuICAgIHZpc2l0Q2xhc3NFbGVtZW50KGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgdGhpcy5sb2coY3R4LCBUcmFjZS5mcmFtZSgpKTtcbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI21ldGhvZERlZmluaXRpb24uXG4gICAgdmlzaXRNZXRob2REZWZpbml0aW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgdGhpcy5sb2coY3R4LCBUcmFjZS5mcmFtZSgpKTtcbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2Zvcm1hbFBhcmFtZXRlckxpc3QuXG4gICAgdmlzaXRGb3JtYWxQYXJhbWV0ZXJMaXN0KGN0eDogUnVsZUNvbnRleHQpOiBGdW5jdGlvblBhcmFtZXRlcltdIHtcbiAgICAgICAgdGhpcy5sb2coY3R4LCBUcmFjZS5mcmFtZSgpKTtcbiAgICAgICAgdGhpcy5hc3NlcnRUeXBlKGN0eCwgRUNNQVNjcmlwdFBhcnNlci5Gb3JtYWxQYXJhbWV0ZXJMaXN0Q29udGV4dCk7XG4gICAgICAgIGNvbnN0IGZvcm1hbDogRnVuY3Rpb25QYXJhbWV0ZXJbXSA9IFtdXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY3R4LmdldENoaWxkQ291bnQoKTsgKytpKSB7XG4gICAgICAgICAgICBjb25zdCBub2RlID0gY3R4LmdldENoaWxkKGkpO1xuICAgICAgICAgICAgaWYgKG5vZGUgaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLkZvcm1hbFBhcmFtZXRlckFyZ0NvbnRleHQpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBwYXJhbWV0ZXIgPSB0aGlzLnZpc2l0Rm9ybWFsUGFyYW1ldGVyQXJnKG5vZGUpO1xuICAgICAgICAgICAgICAgIGZvcm1hbC5wdXNoKHBhcmFtZXRlcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZvcm1hbDtcbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNmb3JtYWxQYXJhbWV0ZXJBcmcuXG4gICAgdmlzaXRGb3JtYWxQYXJhbWV0ZXJBcmcoY3R4OiBSdWxlQ29udGV4dCk6IEFzc2lnbm1lbnRQYXR0ZXJuIHtcbiAgICAgICAgdGhpcy5sb2coY3R4LCBUcmFjZS5mcmFtZSgpKTtcbiAgICAgICAgdGhpcy5hc3NlcnRUeXBlKGN0eCwgRUNNQVNjcmlwdFBhcnNlci5Gb3JtYWxQYXJhbWV0ZXJBcmdDb250ZXh0KTtcbiAgICAgICAgLy8gICAgY29uc3RydWN0b3IobGVmdDogQmluZGluZ0lkZW50aWZpZXIgfCBCaW5kaW5nUGF0dGVybiwgcmlnaHQ6IEV4cHJlc3Npb24pXG5cbiAgICAgICAgY29uc3QgY291bnQgPSBjdHguZ2V0Q2hpbGRDb3VudCgpO1xuICAgICAgICBpZiAoY291bnQgIT0gMSAmJiBjb3VudCAhPSAzKSB7XG4gICAgICAgICAgICB0aGlzLnRocm93SW5zYW5jZUVycm9yKHRoaXMuZHVtcENvbnRleHQoY3R4KSk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBhc3NpZ25hYmxlID0gdGhpcy52aXNpdEFzc2lnbmFibGUoY3R4LmdldENoaWxkKDApKTtcbiAgICAgICAgY29uc29sZS5pbmZvKGFzc2lnbmFibGUpXG5cbiAgICAgICAgLypcbiAgICAgICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgICAgICMgRm9ybWFsUGFyYW1ldGVyQXJnQ29udGV4dFxuICAgICAgICAqIEFzc2lnbmFibGVDb250ZXh0XG4gICAgICAgICAgICAqIElkZW50aWZpZXJDb250ZXh0XG4gICAgICAgIERlbHZlbkFTVFZpc2l0b3IudmlzaXRGb3JtYWxQYXJhbWV0ZXJBcmcgWzNdIDogeD0yXG4gICAgICAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgICAgICAjIEZvcm1hbFBhcmFtZXRlckFyZ0NvbnRleHRcbiAgICAgICAgKiBBc3NpZ25hYmxlQ29udGV4dFxuICAgICAgICAgICAgKiBJZGVudGlmaWVyQ29udGV4dFxuICAgICAgICAqIExpdGVyYWxFeHByZXNzaW9uQ29udGV4dFxuICAgICAgICAgICAgKiBMaXRlcmFsQ29udGV4dFxuICAgICAgICAgICAgICAgICogTnVtZXJpY0xpdGVyYWxDb250ZXh0XG4gICAgICAgIERlbHZlbkFTVFZpc2l0b3IudmlzaXRGb3JtYWxQYXJhbWV0ZXJBcmcgWzFdIDogeVxuICAgICAgICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICAgICAgICAqL1xuICAgICAgICByZXR1cm4gbmV3IEFzc2lnbm1lbnRQYXR0ZXJuKCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFxuICAgICAqICBhc3NpZ25hYmxlXG4gICAgICogICAgOiBpZGVudGlmaWVyXG4gICAgICogICAgfCBhcnJheUxpdGVyYWxcbiAgICAgKiAgICB8IG9iamVjdExpdGVyYWxcbiAgICAgKiAgICA7IFxuICAgICAqIEBwYXJhbSBjdHggIEFzc2lnbmFibGVDb250ZXh0XG4gICAgICovXG4gICAgdmlzaXRBc3NpZ25hYmxlKGN0eDogUnVsZUNvbnRleHQpOiBCaW5kaW5nSWRlbnRpZmllciB8IEJpbmRpbmdQYXR0ZXJuIHtcbiAgICAgICAgdGhpcy5sb2coY3R4LCBUcmFjZS5mcmFtZSgpKTtcbiAgICAgICAgdGhpcy5hc3NlcnRUeXBlKGN0eCwgRUNNQVNjcmlwdFBhcnNlci5Bc3NpZ25hYmxlQ29udGV4dCk7XG4gICAgICAgIGNvbnN0IGFzc2lnbmFibGUgPSBjdHguZ2V0Q2hpbGQoMCk7XG4gICAgICAgIGlmIChhc3NpZ25hYmxlIGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5JZGVudGlmaWVyQ29udGV4dCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmlzaXRJZGVudGlmaWVyKGFzc2lnbmFibGUpO1xuICAgICAgICB9IGVsc2UgaWYgKGFzc2lnbmFibGUgaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLkFycmF5TGl0ZXJhbENvbnRleHQpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuaW5mbyhcIigoKCggICgoKCgoXCIpXG4gICAgICAgIH0gZWxzZSBpZiAoYXNzaWduYWJsZSBpbnN0YW5jZW9mIEVDTUFTY3JpcHRQYXJzZXIuT2JqZWN0TGl0ZXJhbENvbnRleHQpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuaW5mbyhcIigoKCggICgoKCgoXCIpXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy50aHJvd0luc2FuY2VFcnJvcih0aGlzLmR1bXBDb250ZXh0KGN0eCkpO1xuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2xhc3RGb3JtYWxQYXJhbWV0ZXJBcmcuXG4gICAgdmlzaXRMYXN0Rm9ybWFsUGFyYW1ldGVyQXJnKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgdGhpcy5sb2coY3R4LCBUcmFjZS5mcmFtZSgpKTtcbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNUZXJuYXJ5RXhwcmVzc2lvbi5cbiAgICB2aXNpdFRlcm5hcnlFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNMb2dpY2FsQW5kRXhwcmVzc2lvbi5cbiAgICB2aXNpdExvZ2ljYWxBbmRFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcblxuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjUHJlSW5jcmVtZW50RXhwcmVzc2lvbi5cbiAgICB2aXNpdFByZUluY3JlbWVudEV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjT2JqZWN0TGl0ZXJhbEV4cHJlc3Npb24uXG4gICAgICogQHBhcmFtIGN0eCBcbiAgICAgKi9cbiAgICB2aXNpdE9iamVjdExpdGVyYWxFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpOiBPYmplY3RFeHByZXNzaW9uIHtcbiAgICAgICAgdGhpcy5sb2coY3R4LCBUcmFjZS5mcmFtZSgpKVxuICAgICAgICB0aGlzLmFzc2VydFR5cGUoY3R4LCBFQ01BU2NyaXB0UGFyc2VyLk9iamVjdExpdGVyYWxFeHByZXNzaW9uQ29udGV4dCk7XG4gICAgICAgIGNvbnN0IG5vZGUgPSBjdHguZ2V0Q2hpbGQoMCk7XG4gICAgICAgIGNvbnN0IHByb3BlcnRpZXM6IE9iamVjdEV4cHJlc3Npb25Qcm9wZXJ0eVtdID0gdGhpcy52aXNpdE9iamVjdExpdGVyYWwobm9kZSk7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBPYmplY3RFeHByZXNzaW9uKHByb3BlcnRpZXMpO1xuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjSW5FeHByZXNzaW9uLlxuICAgIHZpc2l0SW5FeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcblxuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjTG9naWNhbE9yRXhwcmVzc2lvbi5cbiAgICB2aXNpdExvZ2ljYWxPckV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuXG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNOb3RFeHByZXNzaW9uLlxuICAgIHZpc2l0Tm90RXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG5cbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI1ByZURlY3JlYXNlRXhwcmVzc2lvbi5cbiAgICB2aXNpdFByZURlY3JlYXNlRXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG5cbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI0FyZ3VtZW50c0V4cHJlc3Npb24uXG4gICAgdmlzaXRBcmd1bWVudHNFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS5pbmZvKFwidmlzaXRBcmd1bWVudHNFeHByZXNzaW9uOiBcIiArIGN0eC5nZXRUZXh0KCkpO1xuXG5cbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI1RoaXNFeHByZXNzaW9uLlxuICAgIHZpc2l0VGhpc0V4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuXG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNGdW5jdGlvbkV4cHJlc3Npb24uXG4gICAgdmlzaXRGdW5jdGlvbkV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICB0aGlzLmxvZyhjdHgsIFRyYWNlLmZyYW1lKCkpO1xuICAgICAgICB0aGlzLmFzc2VydFR5cGUoY3R4LCBFQ01BU2NyaXB0UGFyc2VyLkZ1bmN0aW9uRXhwcmVzc2lvbkNvbnRleHQpO1xuICAgICAgICAvLyAgKEV4dGVuZHMgc2luZ2xlRXhwcmVzc2lvbik/ICd7JyBjbGFzc0VsZW1lbnQqICd9J1xuICAgICAgICB0aGlzLmR1bXBDb250ZXh0QWxsQ2hpbGRyZW4oY3R4KVxuICAgICAgICBsZXQgZGVjbCA9IHRoaXMudmlzaXRGdW5jdGlvbkRlY2woY3R4LmdldENoaWxkKDApKVxuICAgICAgICAvLyBjb25zdCBub2RlID0gdGhpcy5nZXROb2RlQnlUeXBlKGN0eCwgRUNNQVNjcmlwdFBhcnNlci5DbGFzc0VsZW1lbnRDb250ZXh0KTtcbiAgICAgICAgY29uc29sZS5pbmZvKGRlY2wpXG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNVbmFyeU1pbnVzRXhwcmVzc2lvbi5cbiAgICB2aXNpdFVuYXJ5TWludXNFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcblxuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjUG9zdERlY3JlYXNlRXhwcmVzc2lvbi5cbiAgICB2aXNpdFBvc3REZWNyZWFzZUV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI0Fzc2lnbm1lbnRFeHByZXNzaW9uLlxuICAgICAqIFxuICAgICAqIDxhc3NvYz1yaWdodD4gc2luZ2xlRXhwcmVzc2lvbiAnPScgc2luZ2xlRXhwcmVzc2lvbiAgICAgICAgICAgICAgICAgICAjIEFzc2lnbm1lbnRFeHByZXNzaW9uXG4gICAgICogQHBhcmFtIGN0eCBcbiAgICAgKi9cbiAgICB2aXNpdEFzc2lnbm1lbnRFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpOiBBc3NpZ25tZW50RXhwcmVzc2lvbiB7XG4gICAgICAgIHRoaXMubG9nKGN0eCwgVHJhY2UuZnJhbWUoKSlcbiAgICAgICAgdGhpcy5hc3NlcnRUeXBlKGN0eCwgRUNNQVNjcmlwdFBhcnNlci5Bc3NpZ25tZW50RXhwcmVzc2lvbkNvbnRleHQpO1xuICAgICAgICB0aGlzLmFzc2VydE5vZGVDb3VudChjdHgsIDMpXG5cbiAgICAgICAgY29uc3QgaW5pdGlhbGlzZXIgPSBjdHguZ2V0Q2hpbGQoMCk7XG4gICAgICAgIGNvbnN0IG9wZXJhdG9yID0gY3R4LmdldENoaWxkKDEpLmdldFRleHQoKTsgLy8gTm8gdHlwZSAoID0gKVxuICAgICAgICBjb25zdCBleHByZXNzaW9uID0gY3R4LmdldENoaWxkKDIpO1xuICAgICAgICBjb25zdCBsaHMgPSB0aGlzLnNpbmdsZUV4cHJlc3Npb24oaW5pdGlhbGlzZXIpO1xuICAgICAgICBjb25zdCByaHMgPSB0aGlzLnNpbmdsZUV4cHJlc3Npb24oZXhwcmVzc2lvbik7XG5cbiAgICAgICAgLy8gQ29tcGxpYW5jZSA6IHB1bGxpbmcgdXAgRXhwcmVzc2lvblN0YXRlbWVudCBpbnRvIEFzc2lnZW1lbnRFeHByZXNzaW9uXG4gICAgICAgIHJldHVybiBuZXcgQXNzaWdubWVudEV4cHJlc3Npb24ob3BlcmF0b3IsIGxocywgcmhzKVxuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjVHlwZW9mRXhwcmVzc2lvbi5cbiAgICB2aXNpdFR5cGVvZkV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuXG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNJbnN0YW5jZW9mRXhwcmVzc2lvbi5cbiAgICB2aXNpdEluc3RhbmNlb2ZFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcblxuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI1VuYXJ5UGx1c0V4cHJlc3Npb24uXG4gICAgdmlzaXRVbmFyeVBsdXNFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcblxuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI0RlbGV0ZUV4cHJlc3Npb24uXG4gICAgdmlzaXREZWxldGVFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNFcXVhbGl0eUV4cHJlc3Npb24uXG4gICAgdmlzaXRFcXVhbGl0eUV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCk6IEJpbmFyeUV4cHJlc3Npb24ge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJ2aXNpdEVxdWFsaXR5RXhwcmVzc2lvbiBbJXNdIDogJXNcIiwgY3R4LmdldENoaWxkQ291bnQoKSwgY3R4LmdldFRleHQoKSk7XG4gICAgICAgIHRoaXMuYXNzZXJ0VHlwZShjdHgsIEVDTUFTY3JpcHRQYXJzZXIuRXF1YWxpdHlFeHByZXNzaW9uQ29udGV4dCk7XG4gICAgICAgIHRoaXMuYXNzZXJ0Tm9kZUNvdW50KGN0eCwgMylcblxuICAgICAgICBsZXQgbGVmdCA9IGN0eC5nZXRDaGlsZCgwKTtcbiAgICAgICAgbGV0IG9wZXJhdG9yID0gY3R4LmdldENoaWxkKDEpLmdldFRleHQoKTsgLy8gTm8gdHlwZSAoICssLSApXG4gICAgICAgIGxldCByaWdodCA9IGN0eC5nZXRDaGlsZCgyKTtcbiAgICAgICAgbGV0IGxocyA9IHRoaXMuX3Zpc2l0QmluYXJ5RXhwcmVzc2lvbihsZWZ0KTtcbiAgICAgICAgbGV0IHJocyA9IHRoaXMuX3Zpc2l0QmluYXJ5RXhwcmVzc2lvbihyaWdodCk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuZGVjb3JhdGUobmV3IEJpbmFyeUV4cHJlc3Npb24ob3BlcmF0b3IsIGxocywgcmhzKSwge30pO1xuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjQml0WE9yRXhwcmVzc2lvbi5cbiAgICB2aXNpdEJpdFhPckV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuXG4gICAgfVxuXG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNNdWx0aXBsaWNhdGl2ZUV4cHJlc3Npb24uXG4gICAgdmlzaXRNdWx0aXBsaWNhdGl2ZUV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCk6IEJpbmFyeUV4cHJlc3Npb24ge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJ2aXNpdE11bHRpcGxpY2F0aXZlRXhwcmVzc2lvbiBbJXNdIDogJXNcIiwgY3R4LmdldENoaWxkQ291bnQoKSwgY3R4LmdldFRleHQoKSk7XG4gICAgICAgIHRoaXMuYXNzZXJ0VHlwZShjdHgsIEVDTUFTY3JpcHRQYXJzZXIuTXVsdGlwbGljYXRpdmVFeHByZXNzaW9uQ29udGV4dCk7XG4gICAgICAgIHRoaXMuYXNzZXJ0Tm9kZUNvdW50KGN0eCwgMylcblxuICAgICAgICBsZXQgbGVmdCA9IGN0eC5nZXRDaGlsZCgwKTtcbiAgICAgICAgbGV0IG9wZXJhdG9yID0gY3R4LmdldENoaWxkKDEpLmdldFRleHQoKTsgLy8gTm8gdHlwZSAoICssLSApXG4gICAgICAgIGxldCByaWdodCA9IGN0eC5nZXRDaGlsZCgyKTtcbiAgICAgICAgbGV0IGxocyA9IHRoaXMudmlzaXRCaW5hcnlFeHByZXNzaW9uKGxlZnQpO1xuICAgICAgICBsZXQgcmhzID0gdGhpcy52aXNpdEJpbmFyeUV4cHJlc3Npb24ocmlnaHQpO1xuXG4gICAgICAgIHJldHVybiB0aGlzLmRlY29yYXRlKG5ldyBCaW5hcnlFeHByZXNzaW9uKG9wZXJhdG9yLCBsaHMsIHJocyksIHt9KTtcbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNCaXRTaGlmdEV4cHJlc3Npb24uXG4gICAgdmlzaXRCaXRTaGlmdEV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuXG4gICAgfVxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjUGFyZW50aGVzaXplZEV4cHJlc3Npb24uXG4gICAgdmlzaXRQYXJlbnRoZXNpemVkRXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0UGFyZW50aGVzaXplZEV4cHJlc3Npb24gWyVzXSA6ICVzXCIsIGN0eC5nZXRDaGlsZENvdW50KCksIGN0eC5nZXRUZXh0KCkpO1xuICAgICAgICB0aGlzLmFzc2VydFR5cGUoY3R4LCBFQ01BU2NyaXB0UGFyc2VyLlBhcmVudGhlc2l6ZWRFeHByZXNzaW9uQ29udGV4dCk7XG4gICAgICAgIHRoaXMuYXNzZXJ0Tm9kZUNvdW50KGN0eCwgMylcbiAgICAgICAgbGV0IGxlZnQgPSBjdHguZ2V0Q2hpbGQoMCk7XG4gICAgICAgIGxldCBleHByZXNzaW9uID0gY3R4LmdldENoaWxkKDEpO1xuICAgICAgICBsZXQgcmlnaHQgPSBjdHguZ2V0Q2hpbGQoMik7XG4gICAgICAgIHRoaXMuZHVtcENvbnRleHRBbGxDaGlsZHJlbihleHByZXNzaW9uKVxuICAgICAgICByZXR1cm4gdGhpcy52aXNpdEV4cHJlc3Npb25TZXF1ZW5jZShleHByZXNzaW9uKTtcbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNBZGRpdGl2ZUV4cHJlc3Npb24uXG4gICAgdmlzaXRBZGRpdGl2ZUV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCk6IEJpbmFyeUV4cHJlc3Npb24ge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJ2aXNpdEFkZGl0aXZlRXhwcmVzc2lvbiBbJXNdIDogJXNcIiwgY3R4LmdldENoaWxkQ291bnQoKSwgY3R4LmdldFRleHQoKSk7XG4gICAgICAgIHRoaXMuYXNzZXJ0VHlwZShjdHgsIEVDTUFTY3JpcHRQYXJzZXIuQWRkaXRpdmVFeHByZXNzaW9uQ29udGV4dCk7XG4gICAgICAgIHRoaXMuYXNzZXJ0Tm9kZUNvdW50KGN0eCwgMylcblxuICAgICAgICBjb25zdCBsZWZ0ID0gY3R4LmdldENoaWxkKDApO1xuICAgICAgICBjb25zdCBvcGVyYXRvciA9IGN0eC5nZXRDaGlsZCgxKS5nZXRUZXh0KCk7IC8vIE5vIHR5cGUgKCArLC0gKVxuICAgICAgICBjb25zdCByaWdodCA9IGN0eC5nZXRDaGlsZCgyKTtcbiAgICAgICAgY29uc3QgbGhzID0gdGhpcy5fdmlzaXRCaW5hcnlFeHByZXNzaW9uKGxlZnQpO1xuICAgICAgICBjb25zdCByaHMgPSB0aGlzLl92aXNpdEJpbmFyeUV4cHJlc3Npb24ocmlnaHQpO1xuICAgICAgICAvLyByZXR1cm4gdGhpcy5kZWNvcmF0ZShuZXcgQmluYXJ5RXhwcmVzc2lvbihvcGVyYXRvciwgbGhzICxyaHMpLCB0aGlzLmFzTWFya2VyKHRoaXMuYXNNZXRhZGF0YShjdHguc3ltYm9sKSkpO1xuICAgICAgICByZXR1cm4gbmV3IEJpbmFyeUV4cHJlc3Npb24ob3BlcmF0b3IsIGxocywgcmhzKTtcbiAgICB9XG5cbiAgICBfdmlzaXRCaW5hcnlFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcblxuICAgICAgICBjb25zb2xlLmluZm8oXCJldmFsQmluYXJ5RXhwcmVzc2lvbiBbJXNdIDogJXNcIiwgY3R4LmdldENoaWxkQ291bnQoKSwgY3R4LmdldFRleHQoKSk7XG4gICAgICAgIGlmIChjdHggaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLklkZW50aWZpZXJFeHByZXNzaW9uQ29udGV4dCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmlzaXRJZGVudGlmaWVyRXhwcmVzc2lvbihjdHgpO1xuICAgICAgICB9IGVsc2UgaWYgKGN0eCBpbnN0YW5jZW9mIEVDTUFTY3JpcHRQYXJzZXIuTGl0ZXJhbEV4cHJlc3Npb25Db250ZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy52aXNpdExpdGVyYWxFeHByZXNzaW9uKGN0eCk7XG4gICAgICAgIH0gZWxzZSBpZiAoY3R4IGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5BZGRpdGl2ZUV4cHJlc3Npb25Db250ZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy52aXNpdEFkZGl0aXZlRXhwcmVzc2lvbihjdHgpO1xuICAgICAgICB9IGVsc2UgaWYgKGN0eCBpbnN0YW5jZW9mIEVDTUFTY3JpcHRQYXJzZXIuTXVsdGlwbGljYXRpdmVFeHByZXNzaW9uQ29udGV4dCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmlzaXRNdWx0aXBsaWNhdGl2ZUV4cHJlc3Npb24oY3R4KTtcbiAgICAgICAgfSBlbHNlIGlmIChjdHggaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLlJlbGF0aW9uYWxFeHByZXNzaW9uQ29udGV4dCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmlzaXRSZWxhdGlvbmFsRXhwcmVzc2lvbihjdHgpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMudGhyb3dJbnNhbmNlRXJyb3IodGhpcy5kdW1wQ29udGV4dChjdHgpKTtcbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNSZWxhdGlvbmFsRXhwcmVzc2lvbi5cbiAgICB2aXNpdFJlbGF0aW9uYWxFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpOiBCaW5hcnlFeHByZXNzaW9uIHtcbiAgICAgICAgY29uc29sZS5pbmZvKFwidmlzaXRSZWxhdGlvbmFsRXhwcmVzc2lvbiBbJXNdIDogJXNcIiwgY3R4LmdldENoaWxkQ291bnQoKSwgY3R4LmdldFRleHQoKSk7XG4gICAgICAgIHRoaXMuYXNzZXJ0VHlwZShjdHgsIEVDTUFTY3JpcHRQYXJzZXIuUmVsYXRpb25hbEV4cHJlc3Npb25Db250ZXh0KTtcbiAgICAgICAgdGhpcy5hc3NlcnROb2RlQ291bnQoY3R4LCAzKVxuICAgICAgICBjb25zdCBsZWZ0ID0gY3R4LmdldENoaWxkKDApO1xuICAgICAgICBjb25zdCBvcGVyYXRvciA9IGN0eC5nZXRDaGlsZCgxKS5nZXRUZXh0KCk7IC8vIE5vIHR5cGUgKCArLC0gKVxuICAgICAgICBjb25zdCByaWdodCA9IGN0eC5nZXRDaGlsZCgyKTtcbiAgICAgICAgY29uc3QgbGhzID0gdGhpcy5fdmlzaXRCaW5hcnlFeHByZXNzaW9uKGxlZnQpO1xuICAgICAgICBjb25zdCByaHMgPSB0aGlzLl92aXNpdEJpbmFyeUV4cHJlc3Npb24ocmlnaHQpO1xuICAgICAgICAvLyByZXR1cm4gdGhpcy5kZWNvcmF0ZShuZXcgQmluYXJ5RXhwcmVzc2lvbihvcGVyYXRvciwgbGhzICxyaHMpLCB0aGlzLmFzTWFya2VyKHRoaXMuYXNNZXRhZGF0YShjdHguc3ltYm9sKSkpO1xuICAgICAgICByZXR1cm4gbmV3IEJpbmFyeUV4cHJlc3Npb24ob3BlcmF0b3IsIGxocywgcmhzKTtcbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNQb3N0SW5jcmVtZW50RXhwcmVzc2lvbi5cbiAgICB2aXNpdFBvc3RJbmNyZW1lbnRFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNCaXROb3RFeHByZXNzaW9uLlxuICAgIHZpc2l0Qml0Tm90RXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG5cbiAgICB9XG5cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI05ld0V4cHJlc3Npb24uXG4gICAgdmlzaXROZXdFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcblxuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjTGl0ZXJhbEV4cHJlc3Npb24uXG4gICAgdmlzaXRMaXRlcmFsRXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0TGl0ZXJhbEV4cHJlc3Npb24gWyVzXSA6IFslc11cIiwgY3R4LmdldENoaWxkQ291bnQoKSwgY3R4LmdldFRleHQoKSk7XG4gICAgICAgIHRoaXMuYXNzZXJ0VHlwZShjdHgsIEVDTUFTY3JpcHRQYXJzZXIuTGl0ZXJhbEV4cHJlc3Npb25Db250ZXh0KTtcbiAgICAgICAgdGhpcy5hc3NlcnROb2RlQ291bnQoY3R4LCAxKTtcbiAgICAgICAgLy8gdmlzaXRMaXRlcmFsRXhwcmVzc2lvbjogPiB2aXNpdExpdGVyYWxcbiAgICAgICAgbGV0IG5vZGUgPSBjdHguZ2V0Q2hpbGQoMClcbiAgICAgICAgaWYgKG5vZGUgaW5zdGFuY2VvZiBFQ01BU2NyaXB0UGFyc2VyLkxpdGVyYWxDb250ZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy52aXNpdExpdGVyYWwobm9kZSk7XG4gICAgICAgIH0gZWxzZSBpZiAobm9kZSBpbnN0YW5jZW9mIEVDTUFTY3JpcHRQYXJzZXIuTnVtZXJpY0xpdGVyYWxDb250ZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy52aXNpdE51bWVyaWNMaXRlcmFsKG5vZGUpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMudGhyb3dJbnNhbmNlRXJyb3IodGhpcy5kdW1wQ29udGV4dChub2RlKSk7XG4gICAgfVxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjQXJyYXlMaXRlcmFsRXhwcmVzc2lvbi5cbiAgICB2aXNpdEFycmF5TGl0ZXJhbEV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCk6IEFycmF5RXhwcmVzc2lvbiB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0QXJyYXlMaXRlcmFsRXhwcmVzc2lvbiBbJXNdIDogJXNcIiwgY3R4LmdldENoaWxkQ291bnQoKSwgY3R4LmdldFRleHQoKSk7XG4gICAgICAgIHRoaXMuYXNzZXJ0VHlwZShjdHgsIEVDTUFTY3JpcHRQYXJzZXIuQXJyYXlMaXRlcmFsRXhwcmVzc2lvbkNvbnRleHQpO1xuICAgICAgICB0aGlzLmFzc2VydE5vZGVDb3VudChjdHgsIDEpO1xuICAgICAgICBjb25zdCBub2RlID0gY3R4LmdldENoaWxkKDApO1xuICAgICAgICBjb25zdCBlbGVtZW50cyA9IHRoaXMudmlzaXRBcnJheUxpdGVyYWwobm9kZSk7XG4gICAgICAgIHJldHVybiBuZXcgQXJyYXlFeHByZXNzaW9uKGVsZW1lbnRzKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAvLyBjb21wdXRlZCA9IGZhbHNlIGB4LnpgXG4gICAgICogLy8gY29tcHV0ZWQgPSB0cnVlIGB5WzFdYFxuICAgICAqIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI01lbWJlckRvdEV4cHJlc3Npb24uXG4gICAgICovXG4gICAgdmlzaXRNZW1iZXJEb3RFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpOiBTdGF0aWNNZW1iZXJFeHByZXNzaW9uIHtcbiAgICAgICAgY29uc29sZS5pbmZvKFwidmlzaXRBcnJheUxpdGVyYWxFeHByZXNzaW9uIFslc10gOiAlc1wiLCBjdHguZ2V0Q2hpbGRDb3VudCgpLCBjdHguZ2V0VGV4dCgpKTtcbiAgICAgICAgdGhpcy5hc3NlcnRUeXBlKGN0eCwgRUNNQVNjcmlwdFBhcnNlci5NZW1iZXJEb3RFeHByZXNzaW9uQ29udGV4dCk7XG4gICAgICAgIHRoaXMuYXNzZXJ0Tm9kZUNvdW50KGN0eCwgMyk7XG4gICAgICAgIGNvbnN0IGV4cHIgPSB0aGlzLnNpbmdsZUV4cHJlc3Npb24oY3R4LmdldENoaWxkKDApKTtcbiAgICAgICAgY29uc3QgcHJvcGVydHkgPSB0aGlzLnZpc2l0SWRlbnRpZmllck5hbWUoY3R4LmdldENoaWxkKDIpKTtcbiAgICAgICAgcmV0dXJuIG5ldyBTdGF0aWNNZW1iZXJFeHByZXNzaW9uKGV4cHIsIHByb3BlcnR5KTtcbiAgICB9XG5cbiAgICBwcmludChjdHg6IFJ1bGVDb250ZXh0KTogdm9pZCB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcIiAqKioqKiAgXCIpXG4gICAgICAgIGNvbnN0IHZpc2l0b3IgPSBuZXcgUHJpbnRWaXNpdG9yKCk7XG4gICAgICAgIGN0eC5hY2NlcHQodmlzaXRvcik7XG4gICAgfVxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjTWVtYmVySW5kZXhFeHByZXNzaW9uLlxuICAgIHZpc2l0TWVtYmVySW5kZXhFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpOiBDb21wdXRlZE1lbWJlckV4cHJlc3Npb24ge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJ2aXNpdE1lbWJlckluZGV4RXhwcmVzc2lvbiBbJXNdIDogJXNcIiwgY3R4LmdldENoaWxkQ291bnQoKSwgY3R4LmdldFRleHQoKSk7XG4gICAgICAgIHRoaXMuYXNzZXJ0VHlwZShjdHgsIEVDTUFTY3JpcHRQYXJzZXIuTWVtYmVySW5kZXhFeHByZXNzaW9uQ29udGV4dCk7XG4gICAgICAgIHRoaXMuYXNzZXJ0Tm9kZUNvdW50KGN0eCwgNCk7XG4gICAgICAgIGNvbnN0IGV4cHIgPSB0aGlzLnNpbmdsZUV4cHJlc3Npb24oY3R4LmdldENoaWxkKDApKTtcbiAgICAgICAgY29uc3QgcHJvcGVydHkgPSB0aGlzLnZpc2l0RXhwcmVzc2lvblNlcXVlbmNlKGN0eC5nZXRDaGlsZCgyKSk7XG4gICAgICAgIHJldHVybiBuZXcgQ29tcHV0ZWRNZW1iZXJFeHByZXNzaW9uKGV4cHIsIHByb3BlcnR5KTtcbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNJZGVudGlmaWVyRXhwcmVzc2lvbi5cbiAgICB2aXNpdElkZW50aWZpZXJFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpOiBJZGVudGlmaWVyIHtcbiAgICAgICAgY29uc29sZS5pbmZvKFwidmlzaXRJZGVudGlmaWVyRXhwcmVzc2lvbiBbJXNdIDogJXNcIiwgY3R4LmdldENoaWxkQ291bnQoKSwgY3R4LmdldFRleHQoKSk7XG4gICAgICAgIHRoaXMuYXNzZXJ0VHlwZShjdHgsIEVDTUFTY3JpcHRQYXJzZXIuSWRlbnRpZmllckV4cHJlc3Npb25Db250ZXh0KTtcbiAgICAgICAgdGhpcy5hc3NlcnROb2RlQ291bnQoY3R4LCAxKVxuICAgICAgICBjb25zdCBpbml0aWFsaXNlciA9IGN0eC5nZXRDaGlsZCgwKTtcbiAgICAgICAgY29uc3QgbmFtZSA9IGluaXRpYWxpc2VyLmdldFRleHQoKTtcbiAgICAgICAgLy8gcmV0dXJuIHRoaXMuZGVjb3JhdGUobmV3IElkZW50aWZpZXIobmFtZSksIHRoaXMuYXNNYXJrZXIodGhpcy5hc01ldGFkYXRhKGluaXRpYWxpc2VyLnN5bWJvbCkpKVxuICAgICAgICByZXR1cm4gbmV3IElkZW50aWZpZXIobmFtZSk7XG4gICAgfVxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjaWRlbnRpZmllci5cbiAgICB2aXNpdElkZW50aWZpZXIoY3R4OiBSdWxlQ29udGV4dCk6IElkZW50aWZpZXIge1xuICAgICAgICB0aGlzLmxvZyhjdHgsIFRyYWNlLmZyYW1lKCkpO1xuICAgICAgICB0aGlzLmFzc2VydFR5cGUoY3R4LCBFQ01BU2NyaXB0UGFyc2VyLklkZW50aWZpZXJDb250ZXh0KVxuICAgICAgICByZXR1cm4gbmV3IElkZW50aWZpZXIoY3R4LmdldENoaWxkKDApLmdldFRleHQoKSlcbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNCaXRBbmRFeHByZXNzaW9uLlxuICAgIHZpc2l0Qml0QW5kRXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gICAgfVxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjQml0T3JFeHByZXNzaW9uLlxuICAgIHZpc2l0Qml0T3JFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNBc3NpZ25tZW50T3BlcmF0b3JFeHByZXNzaW9uLlxuICAgICAqIFxuICAgICAqIDxhc3NvYz1yaWdodD4gc2luZ2xlRXhwcmVzc2lvbiBhc3NpZ25tZW50T3BlcmF0b3Igc2luZ2xlRXhwcmVzc2lvbiAgICAjIEFzc2lnbm1lbnRPcGVyYXRvckV4cHJlc3Npb25cbiAgICAgKiBAcGFyYW0gY3R4IFxuICAgICAqL1xuICAgIHZpc2l0QXNzaWdubWVudE9wZXJhdG9yRXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KTogQXNzaWdubWVudEV4cHJlc3Npb24ge1xuICAgICAgICB0aGlzLmxvZyhjdHgsIFRyYWNlLmZyYW1lKCkpXG4gICAgICAgIHRoaXMuYXNzZXJ0VHlwZShjdHgsIEVDTUFTY3JpcHRQYXJzZXIuQXNzaWdubWVudE9wZXJhdG9yRXhwcmVzc2lvbkNvbnRleHQpO1xuICAgICAgICB0aGlzLmFzc2VydE5vZGVDb3VudChjdHgsIDMpXG4gICAgICAgIGNvbnN0IGluaXRpYWxpc2VyID0gY3R4LmdldENoaWxkKDApO1xuICAgICAgICBjb25zdCBvcGVyYXRvciA9IGN0eC5nZXRDaGlsZCgxKS5nZXRUZXh0KCk7XG4gICAgICAgIGNvbnN0IGV4cHJlc3Npb24gPSBjdHguZ2V0Q2hpbGQoMik7XG4gICAgICAgIGNvbnN0IGxocyA9IHRoaXMuc2luZ2xlRXhwcmVzc2lvbihpbml0aWFsaXNlcik7XG4gICAgICAgIGNvbnN0IHJocyA9IHRoaXMuc2luZ2xlRXhwcmVzc2lvbihleHByZXNzaW9uKTtcblxuICAgICAgICAvLyBDb21wbGlhbmNlIDogcHVsbGluZyB1cCBFeHByZXNzaW9uU3RhdGVtZW50IGludG8gQXNzaWdlbWVudEV4cHJlc3Npb25cbiAgICAgICAgcmV0dXJuIG5ldyBBc3NpZ25tZW50RXhwcmVzc2lvbihvcGVyYXRvciwgbGhzLCByaHMuZXhwcmVzc2lvbilcbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNWb2lkRXhwcmVzc2lvbi5cbiAgICB2aXNpdFZvaWRFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcblxuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2Fzc2lnbm1lbnRPcGVyYXRvci5cbiAgICB2aXNpdEFzc2lnbm1lbnRPcGVyYXRvcihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0QXNzaWdubWVudE9wZXJhdG9yIFslc10gOiBbJXNdXCIsIGN0eC5nZXRDaGlsZENvdW50KCksIGN0eC5nZXRUZXh0KCkpO1xuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2xpdGVyYWwuXG4gICAgdmlzaXRMaXRlcmFsKGN0eDogUnVsZUNvbnRleHQpOiBMaXRlcmFsIHtcbiAgICAgICAgY29uc29sZS5pbmZvKFwidmlzaXRMaXRlcmFsIFslc10gOiBbJXNdXCIsIGN0eC5nZXRDaGlsZENvdW50KCksIGN0eC5nZXRUZXh0KCkpO1xuICAgICAgICB0aGlzLmFzc2VydFR5cGUoY3R4LCBFQ01BU2NyaXB0UGFyc2VyLkxpdGVyYWxDb250ZXh0KVxuICAgICAgICB0aGlzLmFzc2VydE5vZGVDb3VudChjdHgsIDEpO1xuICAgICAgICBjb25zdCBub2RlOiBSdWxlQ29udGV4dCA9IGN0eC5nZXRDaGlsZCgwKTtcblxuICAgICAgICBpZiAobm9kZS5nZXRDaGlsZENvdW50KCkgPT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY3JlYXRlTGl0ZXJhbFZhbHVlKG5vZGUpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKG5vZGUuZ2V0Q2hpbGRDb3VudCgpID09IDEpIHtcbiAgICAgICAgICAgIGlmIChub2RlIGluc3RhbmNlb2YgRUNNQVNjcmlwdFBhcnNlci5OdW1lcmljTGl0ZXJhbENvbnRleHQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy52aXNpdE51bWVyaWNMaXRlcmFsKG5vZGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy50aHJvd0luc2FuY2VFcnJvcih0aGlzLmR1bXBDb250ZXh0KG5vZGUpKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnRocm93SW5zYW5jZUVycm9yKHRoaXMuZHVtcENvbnRleHQobm9kZSkpO1xuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI251bWVyaWNMaXRlcmFsLlxuICAgIHZpc2l0TnVtZXJpY0xpdGVyYWwoY3R4OiBSdWxlQ29udGV4dCk6IExpdGVyYWwge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJ2aXNpdE51bWVyaWNMaXRlcmFsIFslc10gOiBbJXNdXCIsIGN0eC5nZXRDaGlsZENvdW50KCksIGN0eC5nZXRUZXh0KCkpO1xuICAgICAgICB0aGlzLmFzc2VydFR5cGUoY3R4LCBFQ01BU2NyaXB0UGFyc2VyLk51bWVyaWNMaXRlcmFsQ29udGV4dClcbiAgICAgICAgdGhpcy5hc3NlcnROb2RlQ291bnQoY3R4LCAxKTtcbiAgICAgICAgY29uc3QgdmFsdWUgPSBjdHguZ2V0VGV4dCgpO1xuICAgICAgICAvLyBUT0RPIDogRmlndXJlIG91dCBiZXR0ZXIgd2F5XG4gICAgICAgIGNvbnN0IGxpdGVyYWwgPSBuZXcgTGl0ZXJhbChOdW1iZXIodmFsdWUpLCB2YWx1ZSk7XG4gICAgICAgIHJldHVybiB0aGlzLmRlY29yYXRlKGxpdGVyYWwsIHRoaXMuYXNNYXJrZXIodGhpcy5hc01ldGFkYXRhKGN0eC5nZXRTb3VyY2VJbnRlcnZhbCgpKSkpXG4gICAgfVxuXG4gICAgY3JlYXRlTGl0ZXJhbFZhbHVlKGN0eDogUnVsZUNvbnRleHQpOiBMaXRlcmFsIHtcbiAgICAgICAgY29uc29sZS5pbmZvKFwiY3JlYXRlTGl0ZXJhbFZhbHVlIFslc106IFslc11cIiwgY3R4LmdldENoaWxkQ291bnQoKSwgY3R4LmdldFRleHQoKSk7XG4gICAgICAgIGNvbnN0IHZhbHVlID0gY3R4LmdldFRleHQoKTtcbiAgICAgICAgY29uc3QgbGl0ZXJhbCA9IG5ldyBMaXRlcmFsKHZhbHVlLCB2YWx1ZSk7XG4gICAgICAgIHJldHVybiB0aGlzLmRlY29yYXRlKGxpdGVyYWwsIHRoaXMuYXNNYXJrZXIodGhpcy5hc01ldGFkYXRhKGN0eC5nZXRTb3VyY2VJbnRlcnZhbCgpKSkpXG4gICAgfVxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjaWRlbnRpZmllck5hbWUuXG4gICAgdmlzaXRJZGVudGlmaWVyTmFtZShjdHg6IFJ1bGVDb250ZXh0KTogSWRlbnRpZmllciB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0SWRlbnRpZmllck5hbWUgWyVzXTogWyVzXVwiLCBjdHguZ2V0Q2hpbGRDb3VudCgpLCBjdHguZ2V0VGV4dCgpKTtcbiAgICAgICAgdGhpcy5hc3NlcnRUeXBlKGN0eCwgRUNNQVNjcmlwdFBhcnNlci5JZGVudGlmaWVyTmFtZUNvbnRleHQpXG4gICAgICAgIHRoaXMuYXNzZXJ0Tm9kZUNvdW50KGN0eCwgMSk7XG4gICAgICAgIGNvbnN0IHZhbHVlID0gY3R4LmdldFRleHQoKTtcbiAgICAgICAgY29uc3QgaWRlbnRpZmllciA9IG5ldyBJZGVudGlmaWVyKHZhbHVlKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGVjb3JhdGUoaWRlbnRpZmllciwgdGhpcy5hc01hcmtlcih0aGlzLmFzTWV0YWRhdGEoY3R4LmdldFNvdXJjZUludGVydmFsKCkpKSlcbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNyZXNlcnZlZFdvcmQuXG4gICAgdmlzaXRSZXNlcnZlZFdvcmQoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJ2aXNpdFJlc2VydmVkV29yZDogXCIgKyBjdHguZ2V0VGV4dCgpKTtcbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNrZXl3b3JkLlxuICAgIHZpc2l0S2V5d29yZChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0S2V5d29yZDogXCIgKyBjdHguZ2V0VGV4dCgpKTtcblxuICAgIH1cblxuXG4gICAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjZnV0dXJlUmVzZXJ2ZWRXb3JkLlxuICAgIHZpc2l0RnV0dXJlUmVzZXJ2ZWRXb3JkKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNnZXR0ZXIuXG4gICAgdmlzaXRHZXR0ZXIoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgIH1cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNzZXR0ZXIuXG4gICAgdmlzaXRTZXR0ZXIoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgIH1cblxuICAgIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2Vvcy5cbiAgICB2aXNpdEVvcyhjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgICAgIC8vY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICB9XG5cbiAgICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNlb2YuXG4gICAgdmlzaXRFb2YoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgIH1cblxufSJdfQ==