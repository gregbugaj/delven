/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import * as antlr4 from "antlr4"
import { ECMAScriptParserVisitor as DelvenVisitor } from "./parser/ECMAScriptParserVisitor"
import { ECMAScriptParser as DelvenParser, ECMAScriptParser } from "./parser/ECMAScriptParser"
import { ECMAScriptLexer as DelvenLexer } from "./parser/ECMAScriptLexer"
import { RuleContext } from "antlr4/RuleContext"
import { ExpressionStatement, Literal, Script, BlockStatement, Statement, SequenceExpression, ThrowStatement, AssignmentExpression, Identifier, BinaryExpression, ArrayExpression, ObjectExpression, ObjectExpressionProperty, Property, PropertyKey, VariableDeclaration, VariableDeclarator, Expression, IfStatement, ComputedMemberExpression, StaticMemberExpression, ClassDeclaration, ClassBody, FunctionDeclaration, FunctionParameter, AsyncFunctionDeclaration, AssignmentPattern, BindingPattern, BindingIdentifier, ArrayExpressionElement, SpreadElement, ArrowFunctionExpression, LabeledStatement, RestElement, NewExpression, ArgumentListElement, ThisExpression, FunctionExpression, AsyncFunctionExpression, UnaryExpression, UpdateExpression, WhileStatement, DoWhileStatement, ContinueStatement, BreakStatement, ReturnStatement, ArrayPattern, ObjectPattern, CallExpression, TemplateLiteral, RegexLiteral, TemplateElement } from "./nodes";
import * as Node from "./nodes";
import { type } from "os"
import * as fs from "fs"
import { Interval, Recognizer, Token } from "antlr4"
import Trace, { CallSite } from "./trace"
import ASTNode from "./ASTNode"
import { ErrorListener } from "antlr4/error/ErrorListener"
import { ErrorNode } from "antlr4/tree/Tree"

/**
 * Version that we generate the AST for. 
 * This allows for testing different implementations
 * 
 * Currently only ECMAScript is supported
 * 
 * https://github.com/estree/estree
 */
export enum ParserType { ECMAScript }
export type SourceType = "code" | "filename";
export type SourceCode = {
    type: SourceType,
    value: string
}
export interface Marker {
    index: number;
    line: number;
    column: number;
}
export class MyErrorListener extends ErrorListener {
    syntaxError(recognizer: Recognizer, offendingSymbol: Token, line: number, column: number, msg: string, e: any): void {
        console.log(`Error at ${line}, ${column}  : ${msg}  ${offendingSymbol}`);
    }
}

export default abstract class ASTParser {
    private visitor: (typeof DelvenVisitor | null)

    constructor(visitor?: DelvenASTVisitor) {
        this.visitor = visitor || new DelvenASTVisitor()
    }

    generate(source: SourceCode): ASTNode {
        let code;
        switch (source.type) {
            case "code":
                code = source.value;
                break;
            case "filename":
                code = fs.readFileSync(source.value, "utf8")
                break;
        }

        const chars = new antlr4.InputStream(code)
        const lexer = new DelvenLexer(chars)
        lexer.removeErrorListeners();
        lexer.addErrorListener(new MyErrorListener());

        const parser = new DelvenParser(new antlr4.CommonTokenStream(lexer))
        parser.setTrace(true)

        parser.removeErrorListeners();
        parser.addErrorListener(new MyErrorListener());

        const tree = parser.program()
        console.info(tree.toStringTree(parser.ruleNames))

        // tree.accept(new PrintVisitor())
        console.info("---------------------")
        return tree.accept(this.visitor)
    }

    /**
     * Parse source and genereate AST tree
     * @param source 
     * @param type 
     */
    static parse(source: SourceCode, type?: ParserType): ASTNode {
        if (type == null)
            type = ParserType.ECMAScript;
        let parser;
        switch (type) {
            case ParserType.ECMAScript:
                parser = new ASTParserDefault()
                break;
            default:
                throw new Error("Unkown parser type")
        }
        return parser.generate(source)
    }
}

class ASTParserDefault extends ASTParser {

}

export class DelvenASTVisitor extends DelvenVisitor {
    private ruleTypeMap: Map<number, string> = new Map()

    constructor() {
        super()
        this.setupTypeRules()
    }

    private setupTypeRules() {
        const keys = Object.getOwnPropertyNames(DelvenParser)
        for (var key in keys) {
            let name = keys[key];
            if (name.startsWith('RULE_')) {
                this.ruleTypeMap.set(parseInt(DelvenParser[name]), name)
            }
        }
    }

    private log(ctx: RuleContext, frame: CallSite) {
        console.info("%s [%s] : %s", frame.function, ctx.getChildCount(), ctx.getText())
    }

    private dumpContext(ctx: RuleContext) {
        const keys = Object.getOwnPropertyNames(DelvenParser)
        const context = []
        for (const key in keys) {
            const name = keys[key];
            // this only test inheritance
            if (name.endsWith('Context')) {
                if (ctx instanceof DelvenParser[name]) {
                    context.push(name)
                }
            }
        }

        // diry hack for walking antler depency chain 
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
                let obj = ECMAScriptParser[name];
                let chain = 1;
                do {
                    ++chain;
                    obj = ECMAScriptParser[obj.prototype.__proto__.constructor.name];
                } while (obj && obj.prototype)
                if (chain > longest) {
                    longest = chain;
                    contextName = `${name} [ ** ${chain}]`;
                }
            }
            return [contextName];
        }
        return context;
    }

    private dumpContextAllChildren(ctx: RuleContext, indent = 0) {
        const pad = " ".padStart(indent, "\t")
        const nodes = this.dumpContext(ctx)
        if (nodes.length > 0) {
            const marker = indent == 0 ? " # " : " * ";
            console.info(pad + marker + nodes)
        }
        for (let i = 0; i < ctx.getChildCount(); ++i) {
            const child = ctx?.getChild(i)
            if (child) {
                this.dumpContextAllChildren(child, ++indent)
                --indent;
            }
        }
    }

    /**
     * Get rule name by the Id
     * @param id 
     */
    getRuleById(id: number): string | undefined {
        return this.ruleTypeMap.get(id)
    }

    private asMarker(metadata: any) {
        return { index: 1, line: 1, column: 1 }
    }

    private decorate(node: any, marker: Marker): any {
        node.start = 0;
        node.end = 0;
        return node;
    }

    private asMetadata(interval: Interval): any {
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
        }
    }

    private throwTypeError(typeId: any) {
        throw new TypeError("Unhandled type : " + typeId + " : " + this.getRuleById(typeId))
    }

    /**
     * Throw TypeError only when there is a type provided. 
     * This is usefull when there node ita TerminalNode 
     * @param type 
     */
    private throwInsanceError(type: any): void {
        /*         if (type == undefined || type == "") {
                   return;
                } */
        throw new TypeError("Unhandled instance type : " + type)
    }

    private assertType(ctx: RuleContext, type: any): void {
        if (!(ctx instanceof type)) {
            throw new TypeError("Invalid type expected : '" + type.name + "' received '" + this.dumpContext(ctx)); + "'";
        }
    }

    visitErrorNode(node: ErrorNode): any {
        console.info("node  " + node)
        //   syntaxError(recognizer, offendingSymbol, line, column, msg, e) 
        // console.log("ERROR " + msg);
    }

    /**
     * Visit a parse tree produced by ECMAScriptParser#program.
     * ```
     *  program
     *    : HashBangLine? sourceElements? EOF
     *    ;
     * ```
     * @param ctx 
     */
    visitProgram(ctx: RuleContext): Node.Module {
        this.log(ctx, Trace.frame())
        this.assertType(ctx, ECMAScriptParser.ProgramContext)
        const statements = [];
        const node = ctx.getChild(0)  // visitProgram ->visitSourceElements 
        for (let i = 0; i < node.getChildCount(); ++i) {
            const stm = node.getChild(i).getChild(0) // SourceElementsContext > StatementContext
            if (stm instanceof ECMAScriptParser.StatementContext) {
                statements.push(this.visitStatement(stm))
            } else {
                this.throwInsanceError(this.dumpContext(stm))
            }
        }
        const interval = ctx.getSourceInterval()
        const script = new Node.Module(statements)
        return this.decorate(script, this.asMarker(this.asMetadata(interval)))
    }

    // Visit a parse tree produced by ECMAScriptParser#statement.
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
    visitStatement(ctx: RuleContext): Node.Statement {
        this.log(ctx, Trace.frame())
        this.assertType(ctx, ECMAScriptParser.StatementContext)
        const node: RuleContext = ctx.getChild(0)

        if (node instanceof ECMAScriptParser.BlockContext) {
            return this.visitBlock(node)
        } else if (node instanceof ECMAScriptParser.VariableStatementContext) {
            return this.visitVariableStatement(node)
        } else if (node instanceof ECMAScriptParser.ImportStatementContext) {
            return this.visitImportStatement(node)
        } else if (node instanceof ECMAScriptParser.ExportStatementContext) {
            return this.visitExportStatement(node)
        } else if (node instanceof ECMAScriptParser.EmptyStatementContext) {
            return this.visitEmptyStatement(node)
        } else if (node instanceof ECMAScriptParser.ClassDeclarationContext) {
            return this.visitClassDeclaration(node)
        } else if (node instanceof ECMAScriptParser.ExpressionStatementContext) {
            return this.visitExpressionStatement(node)
        } else if (node instanceof ECMAScriptParser.IfStatementContext) {
            return this.visitIfStatement(node)
        } else if (node instanceof ECMAScriptParser.IterationStatementContext) {
            return this.visitIterationStatement(node)
        } else if (node instanceof ECMAScriptParser.ContinueStatementContext) {
            return this.visitContinueStatement(node)
        } else if (node instanceof ECMAScriptParser.BreakStatementContext) {
            return this.visitBreakStatement(node)
        } else if (node instanceof ECMAScriptParser.ReturnStatementContext) {
            return this.visitReturnStatement(node)
        } else if (node instanceof ECMAScriptParser.WithStatementContext) {
            return this.visitWithStatement(node)
        } else if (node instanceof ECMAScriptParser.LabelledStatementContext) {
            return this.visitLabelledStatement(node)
        } else if (node instanceof ECMAScriptParser.SwitchStatementContext) {
            return this.visitSwitchStatement(node)
            // } else if (node instanceof ECMAScriptParser.FunctionExpressionContext) {
            //     return this.visitFunctionExpression(node, true)
        } else if (node instanceof ECMAScriptParser.ThrowStatementContext) {
            return this.visitThrowStatement(node)
        } else if (node instanceof ECMAScriptParser.TryStatementContext) {
            return this.visitTryStatement(node)
        } else if (node instanceof ECMAScriptParser.DebuggerStatementContext) {
            return this.visitDebuggerStatement(node)
        } else if (node instanceof ECMAScriptParser.FunctionDeclarationContext) {
            return this.visitFunctionDeclaration(node)
        } else {
            this.throwInsanceError(this.dumpContext(node))
        }
    }

    /**
     * 
     * ```
     * importStatement
     *   : Import importFromBlock
     *   ;
     * ```
     * @param ctx 
     */
    visitImportStatement(ctx: RuleContext): Node.ImportDeclaration {
        this.log(ctx, Trace.frame())
        this.assertType(ctx, ECMAScriptParser.ImportStatementContext)
        return this.visitImportFromBlock(ctx.getChild(1))
    }

    /**
     * 
     * ```
     * importFromBlock
     *   : importDefault? (importNamespace | moduleItems) importFrom eos
     *   | StringLiteral eos
     *   ;
     * ```
     * @param ctx 
     */
    visitImportFromBlock(ctx: RuleContext): Node.ImportDeclaration {
        this.log(ctx, Trace.frame())
        this.assertType(ctx, ECMAScriptParser.ImportFromBlockContext)
        // source
        const source: Literal = this.visitImportFrom(this.getTypedRuleContext(ctx, ECMAScriptParser.ImportFromContext))

        // specifiers
        let specifiers: Node.ImportDeclarationSpecifier[] = []
        const importDefaultContext = this.getTypedRuleContext(ctx, ECMAScriptParser.ImportDefaultContext);
        const importNamespaceContext = this.getTypedRuleContext(ctx, ECMAScriptParser.ImportNamespaceContext);
        const moduleItemsContext = this.getTypedRuleContext(ctx, ECMAScriptParser.ModuleItemsContext);

        if (importDefaultContext) {
            specifiers.push(this.visitImportDefault(importDefaultContext))
        }

        if (importNamespaceContext) {
            specifiers.push(this.visitImportNamespace(importNamespaceContext))
        }

        if (moduleItemsContext) {
            specifiers = [...specifiers, this.visitModuleItems(moduleItemsContext)]
        }

        return new Node.ImportDeclaration(specifiers, source);
    }

    /**
     * 
     * ```
     * moduleItems
     *   : '{' (aliasName ',')* (aliasName ','?)? '}'
     *   ;
     * ```
     * @param ctx 
     */
    visitModuleItems(ctx: RuleContext): Node.ImportSpecifier[] {
        this.log(ctx, Trace.frame())
        this.assertType(ctx, ECMAScriptParser.ModuleItemsContext)
        const aliases = this.getTypedRuleContexts(ctx, ECMAScriptParser.AliasNameContext)
        const specifiers: Node.ImportSpecifier[] = []

        for (let i = 0; i < aliases.length; ++i) {
            const alias = aliases[i]
            const local: Node.Identifier = this.visitIdentifierName(alias.getChild(0))
            const imported: Node.Identifier = (alias.getChildCount == 2) ? this.visitIdentifierName(alias.getChild(1)) : local
            const specifier = new Node.ImportSpecifier(local, imported)
            specifiers.push(specifier)
        }
        return specifiers
    }

    /**
     * Examples :
     * 
     * ```
     *   import defaultExport from 'module_name'; // 1 node
     *   import * as name from 'module_name';  // 3 nodes
     * ```
     * 
     * ```
     * importNamespace
     *    : ('*' | identifierName) (As identifierName)?
     *    ;
     * ```
     * @param ctx 
     */
    visitImportNamespace(ctx: RuleContext): Node.ImportDefaultSpecifier {
        this.log(ctx, Trace.frame())
        this.assertType(ctx, ECMAScriptParser.ImportNamespaceContext)
        const identifierNameContext = this.getTypedRuleContext(ctx, ECMAScriptParser.IdentifierNameContext)
        const ident = this.visitIdentifierName(identifierNameContext)
        return new Node.ImportDefaultSpecifier(ident)
    }

    visitImportDefault(ctx: RuleContext): Node.ImportDefaultSpecifier {
        this.log(ctx, Trace.frame())
        this.assertType(ctx, ECMAScriptParser.ImportDefaultContext)
        const identifierNameContext = this.getTypedRuleContext(ctx.aliasName(), ECMAScriptParser.IdentifierNameContext)
        const ident = this.visitIdentifierName(identifierNameContext)
        return new Node.ImportDefaultSpecifier(ident)
    }

    /**
     * 
     * ```
     * importFrom
     *   : From StringLiteral
     *   ;
     * ```
     * @param ctx 
     */
    visitImportFrom(ctx: RuleContext): Node.Literal {
        this.log(ctx, Trace.frame())
        this.assertType(ctx, ECMAScriptParser.ImportFromContext)
        const node = ctx.getChild(1)
        return this.createStringLiteral(node)
    }

    visitExportStatement(ctx: RuleContext): any {
        console.trace('not implemented')
    }

    /**
     * iterationStatement
     *    : Do statement While '(' expressionSequence ')' eos                                                                       # DoStatement
     *    | While '(' expressionSequence ')' statement                                                                              # WhileStatement
     *    | For '(' (expressionSequence | variableDeclarationList)? ';' expressionSequence? ';' expressionSequence? ')' statement   # ForStatement
     *    | For '(' (singleExpression | variableDeclarationList) In expressionSequence ')' statement                                # ForInStatement
     *    // strange, 'of' is an identifier. and this.p("of") not work in sometime.
     *    | For Await? '(' (singleExpression | variableDeclarationList) identifier{this.p("of")}? expressionSequence ')' statement  # ForOfStatement
     *    ;
     */
    visitIterationStatement(ctx: RuleContext): Node.DoWhileStatement | Node.WhileStatement | undefined {
        this.log(ctx, Trace.frame())
        this.assertType(ctx, ECMAScriptParser.IterationStatementContext)

        if (ctx instanceof ECMAScriptParser.ForStatementContext) {
            return this.visitForStatement(ctx)
        } else if (ctx instanceof ECMAScriptParser.WhileStatementContext) {
            return this.visitWhileStatement(ctx)
        } else if (ctx instanceof ECMAScriptParser.DoStatementContext) {
            return this.visitDoStatement(ctx)
        } else if (ctx instanceof ECMAScriptParser.ForInStatementContext) {
            return this.visitForInStatement(ctx)
        } else if (ctx instanceof ECMAScriptParser.ForOfStatementContext) {
            return this.visitForOfStatement(ctx)
        }

        this.throwInsanceError(this.dumpContext(ctx))
    }

    /**
     * Visit a parse tree produced by ECMAScriptParser#block.
     * /// Block :
     * ///     { StatementList? }
     */
    visitBlock(ctx: RuleContext): Node.BlockStatement {
        this.log(ctx, Trace.frame())
        this.assertType(ctx, ECMAScriptParser.BlockContext)
        const body = [];
        for (let i = 1; i < ctx.getChildCount() - 1; ++i) {
            const node: RuleContext = ctx.getChild(i)
            if (node instanceof ECMAScriptParser.StatementListContext) {
                const statementList = this.visitStatementList(node)
                for (const index in statementList) {
                    body.push(statementList[index])
                }
            } else {
                this.throwInsanceError(this.dumpContext(node))
            }
        }
        return this.decorate(new Node.BlockStatement(body), this.asMarker(this.asMetadata(ctx.getSourceInterval())))
    }

    /**
     * Visit a parse tree produced by ECMAScriptParser#statementList.
     * 
     * ```
     *  statementList
     *    : statement+
     *    ;
     * ```
     * @param ctx 
     */
    visitStatementList(ctx: RuleContext): Node.Statement[] {
        this.log(ctx, Trace.frame())
        this.assertType(ctx, ECMAScriptParser.StatementListContext)

        const nodes = this.filterSymbols(ctx)
        const body: Node.Statement[] = []

        for (const node of nodes) {
            if (node instanceof ECMAScriptParser.StatementContext) {
                body.push(this.visitStatement(node))
            } else {
                this.throwTypeError(type)
            }
        }
        return body;
    }

    visitVariableStatement(ctx: RuleContext): Node.VariableDeclaration {
        this.log(ctx, Trace.frame())
        this.assertType(ctx, ECMAScriptParser.VariableStatementContext)
        const node = this.getTypedRuleContext(ctx, ECMAScriptParser.VariableDeclarationListContext)

        return this.visitVariableDeclarationList(node)
    }

    /**
     * Get the type rule context
     * 
     * Example
     * ```
     *   const node = this.getTypedRuleContext(ctx, ECMAScriptParser.VariableDeclarationListContext)
     * ```
     * @param ctx 
     * @param type 
     * @param index 
     */
    private getTypedRuleContext(ctx: RuleContext, type: any, index = 0): any {
        return ctx.getTypedRuleContext(type, index)
    }

    /**
     * Get all typed rules
     *  
     * @param ctx 
     * @param type 
     */
    private getTypedRuleContexts(ctx: RuleContext, type: any): any[] {
        return ctx.getTypedRuleContexts(type)
    }

    /**
     * <pre>
     * variableDeclarationList
     *   : varModifier variableDeclaration (',' variableDeclaration)*
     *   ;
     * </pre>
     * @param ctx 
     */
    visitVariableDeclarationList(ctx: RuleContext): Node.VariableDeclaration {
        this.log(ctx, Trace.frame())
        this.assertType(ctx, ECMAScriptParser.VariableDeclarationListContext)
        const varModifierContext = this.getTypedRuleContext(ctx, ECMAScriptParser.VarModifierContext, 0)
        const varModifier = varModifierContext.getText()
        const declarations: VariableDeclarator[] = [];
        for (const node of this.filterSymbols(ctx)) {
            if (node instanceof ECMAScriptParser.VariableDeclarationContext) {
                declarations.push(this.visitVariableDeclaration(node))
            }
        }
        return new VariableDeclaration(declarations, varModifier)
    }

    /**
     *  Visit a parse tree produced by ECMAScriptParser#variableDeclaration.
     *  variableDeclaration
     *    : assignable ('=' singleExpression)? // ECMAScript 6: Array & Object Matching
     *    ;
     * @param ctx VariableDeclarationContext
     */
    // 
    visitVariableDeclaration(ctx: RuleContext): Node.VariableDeclarator {
        this.log(ctx, Trace.frame())
        this.assertType(ctx, ECMAScriptParser.VariableDeclarationContext)
        const assignableContext = this.getTypedRuleContext(ctx, ECMAScriptParser.AssignableContext, 0)
        const assignable = this.visitAssignable(assignableContext)
        let init = null;
        if (ctx.getChildCount() == 3) {
            init = this.singleExpression(ctx.getChild(2), false)
        }
        return new VariableDeclarator(assignable, init)
    }

    // Visit a parse tree produced by ECMAScriptParser#emptyStatement.
    visitEmptyStatement(ctx: RuleContext): Node.EmptyStatement {
        this.log(ctx, Trace.frame())
        return new Node.EmptyStatement()
    }

    private assertNodeCount(ctx: RuleContext, count: number) {
        if (ctx.getChildCount() != count) {
            throw new Error("Wrong child count, expected '" + count + "' got : " + ctx.getChildCount())
        }
    }

    /**
     * Visit a parse tree produced by ECMAScriptParser#expressionStatement.
     * 
     * ```
     * expressionStatement
     *  : {this.notOpenBraceAndNotFunction()}? expressionSequence eos
     *  ;
     * ```
     * @param ctx 
     */
    visitExpressionStatement(ctx: RuleContext): Node.ExpressionStatement {
        this.log(ctx, Trace.frame())
        this.assertType(ctx, ECMAScriptParser.ExpressionStatementContext)

        const sequence = this.visitExpressionSequence(ctx.getChild(0))
        const expression = this.coerceToExpressionOrSequence(sequence)

        return new Node.ExpressionStatement(expression)

    }

    /**
     * ifStatement
     * 
     * Example 
     * ```
     *  if (x || y) {}
     *  if (x || y) {} else {}
     * ```
     * Grammar
     * ```
     *   : If '(' expressionSequence ')' statement ( Else statement )?
     *   ;
     * ```
     */
    visitIfStatement(ctx: RuleContext): Node.IfStatement {
        this.log(ctx, Trace.frame())
        this.assertType(ctx, ECMAScriptParser.IfStatementContext)

        const count = ctx.getChildCount()
        const sequence = this.visitExpressionSequence(ctx.getChild(2))
        const consequent = this.visitStatement(ctx.getChild(4))
        const alternate = count == 7 ? this.visitStatement(ctx.getChild(6)) : null
        const test = this.coerceToExpressionOrSequence(sequence)

        return new Node.IfStatement(test, consequent, alternate)
    }


    /**
     * Visit a parse tree produced by ECMAScriptParser#DoStatement.
     * 
     * ```
     * : Do statement While '(' expressionSequence ')' eos                                                                       # DoStatement
     * ```
     * @param ctx 
     */
    visitDoStatement(ctx: RuleContext): Node.DoWhileStatement {
        this.log(ctx, Trace.frame())
        this.assertType(ctx, ECMAScriptParser.DoStatementContext)
        const body: Node.Statement = this.visitStatement(ctx.statement())
        const test: Node.Expression = this.coerceToExpressionOrSequence(this.visitExpressionSequence(ctx.expressionSequence()))

        return new Node.DoWhileStatement(body, test)
    }

    /**
     * Visit a parse tree produced by ECMAScriptParser#WhileStatement.
     * 
     * ```
     * While '(' expressionSequence ')' statement 
     * ```
     * @param ctx 
     */
    visitWhileStatement(ctx: RuleContext): Node.WhileStatement {
        this.log(ctx, Trace.frame())
        this.assertType(ctx, ECMAScriptParser.WhileStatementContext)
        const test: Node.Expression = this.coerceToExpressionOrSequence(this.visitExpressionSequence(ctx.expressionSequence()))
        const body: Node.Statement = this.visitStatement(ctx.statement())

        return new Node.WhileStatement(test, body)
    }

    /**
     * 
     * ```
     *    | For Await? '(' (singleExpression | variableDeclarationList) identifier{this.p("of")}? expressionSequence ')' statement  # ForOfStatement
     * ```
     * @param ctx 
     */
    visitForOfStatement(ctx: RuleContext): Node.ForOfStatement {
        this.log(ctx, Trace.frame())
        this.assertType(ctx, ECMAScriptParser.ForOfStatementContext)

        // TODO : Implement await syntax
        let await_ = false
        for (let i = 0; i < ctx.getChildCount(); ++i) {
            const node = ctx.getChild(i)
            if (node.symbol) {
                const txt = node.getText()
                if (txt == 'await') {
                    await_ = true
                }
            }
        }

        let lhs: Node.Expression
        const identifierExpressionContext = this.getTypedRuleContext(ctx, ECMAScriptParser.IdentifierExpressionContext)
        const iVariableDeclarationListContext = this.getTypedRuleContext(ctx, ECMAScriptParser.VariableDeclarationListContext)

        if (identifierExpressionContext) {
            lhs = this.coerceToExpressionOrSequence(this.singleExpression(identifierExpressionContext))
        } else if (iVariableDeclarationListContext) {
            lhs = this.visitVariableDeclarationList(iVariableDeclarationListContext)
        }

        const rhs: Node.Expression = this.coerceToExpressionOrSequence(this.visitExpressionSequence(ctx.expressionSequence()))
        const body: Node.Statement = this.visitStatement(ctx.statement())
        return new Node.ForOfStatement(lhs, rhs, body)
    }

    /**
    * Visit a parse tree produced by ECMAScriptParser#ForInStatement.
    * 
    * ```
    * | For '(' (singleExpression | variableDeclarationList) In expressionSequence ')' statement                                # ForInStatement
    * ```
    * @param ctx 
    */
    visitForInStatement(ctx: RuleContext): Node.ForInStatement {
        this.log(ctx, Trace.frame())
        this.assertType(ctx, ECMAScriptParser.ForInStatementContext)

        let left: Node.Expression
        if (ctx.singleExpression()) {
            left = this.coerceToExpressionOrSequence(this.singleExpression(ctx.singleExpression()))
        } else if (ctx.variableDeclarationList()) {
            left = this.visitVariableDeclarationList(ctx.variableDeclarationList())
        }

        const right: Node.Expression = this.coerceToExpressionOrSequence(this.visitExpressionSequence(ctx.expressionSequence()))
        const body: Node.Statement = this.visitStatement(ctx.statement())
        return new Node.ForInStatement(left, right, body)
    }

    /**
     * Visit a parse tree produced by ECMAScriptParser#ForStatement.
     * ```
     * For '(' (expressionSequence | variableDeclarationList)? ';' expressionSequence? ';' expressionSequence? ')' statement   # ForStatement
     * ```
     * @param ctx 
     */
    visitForStatement(ctx: RuleContext): Node.ForStatement {
        this.log(ctx, Trace.frame())
        this.assertType(ctx, ECMAScriptParser.ForStatementContext)
        let init: Expression | null = null
        const vdl = ctx.variableDeclarationList()
        const es0 = ctx.expressionSequence(0)
        const es1 = ctx.expressionSequence(1)
        const es2 = ctx.expressionSequence(2)

        if (vdl) {
            init = this.visitVariableDeclarationList(vdl)
        } else if (es0) {
            init = this.coerceToExpressionOrSequence(this.visitExpressionSequence(es0))
        }

        const test: Node.Expression | null = es1 ? this.coerceToExpressionOrSequence(this.visitExpressionSequence(es1)) : null
        const update: Node.Expression | null = es2 ? this.coerceToExpressionOrSequence(this.visitExpressionSequence(es2)) : null
        const body: Node.Statement = this.visitStatement(ctx.statement())

        return new Node.ForStatement(init, test, update, body)
    }

    // Visit a parse tree produced by ECMAScriptParser#continueStatement.
    visitContinueStatement(ctx: RuleContext): Node.ContinueStatement {
        this.log(ctx, Trace.frame())
        this.assertType(ctx, ECMAScriptParser.ContinueStatementContext)
        let identifier = null;
        if (ctx.identifier()) {
            identifier = this.visitIdentifier(ctx.identifier())
        }
        return new Node.ContinueStatement(identifier)
    }

    // Visit a parse tree produced by ECMAScriptParser#breakStatement.
    visitBreakStatement(ctx: RuleContext): Node.BreakStatement {
        this.log(ctx, Trace.frame())
        this.assertType(ctx, ECMAScriptParser.BreakStatementContext)
        let identifier = null;
        if (ctx.identifier()) {
            identifier = this.visitIdentifier(ctx.identifier())
        }
        return new Node.BreakStatement(identifier)
    }

    // Visit a parse tree produced by ECMAScriptParser#returnStatement.
    visitReturnStatement(ctx: RuleContext): Node.ReturnStatement {
        this.log(ctx, Trace.frame())
        this.assertType(ctx, ECMAScriptParser.ReturnStatementContext)
        let expression = null;
        if (ctx.expressionSequence()) {
            expression = this.coerceToExpressionOrSequence(this.visitExpressionSequence(ctx.expressionSequence()))
        }
        return new Node.ReturnStatement(expression)
    }

    // Visit a parse tree produced by ECMAScriptParser#withStatement.
    visitWithStatement(ctx: RuleContext) {
        console.trace('not implemented')
    }

    /**
     * Visit a parse tree produced by ECMAScriptParser#switchStatement.
     * 
     * ```
     * switchStatement
     *   : Switch '(' expressionSequence ')' caseBlock
         ;
     * ```
     * @param ctx 
     */
    visitSwitchStatement(ctx: RuleContext): Node.SwitchStatement {
        this.log(ctx, Trace.frame())
        this.assertType(ctx, ECMAScriptParser.SwitchStatementContext)

        const sequence = this.visitExpressionSequence(ctx.expressionSequence())
        const discriminant: Node.Expression = this.coerceToExpressionOrSequence(sequence)
        let cases: Node.SwitchCase[] = []
        if (ctx.caseBlock()) {
            cases = this.visitCaseBlock(ctx.caseBlock())
        }
        return new Node.SwitchStatement(discriminant, cases)
    }

    /**
     * Visit a parse tree produced by ECMAScriptParser#caseBlock.
     * 
     * ```
     * caseBlock
     *  : '{' caseClauses? (defaultClause caseClauses?)? '}'
     *  ;
     * ```
     * @param ctx 
     */
    visitCaseBlock(ctx: RuleContext): Node.SwitchCase[] {
        const casesCtx = this.getTypedRuleContext(ctx, ECMAScriptParser.CaseClausesContext)
        const defaultCtx = this.getTypedRuleContext(ctx, ECMAScriptParser.DefaultClauseContext)

        let switches: Node.SwitchCase[] = []
        const cases: Node.SwitchCase[] = casesCtx ? this.visitCaseClauses(casesCtx) : []
        switches = [...cases]
        if (defaultCtx) {
            switches = [...switches, this.visitDefaultClause(defaultCtx)]
        }
        return switches
    }

    /**
     * Visit a parse tree produced by ECMAScriptParser#caseClauses.
     * 
     * ```
     * caseClauses
     *  : caseClause+
     *  ;
     * ```
     * @param ctx 
     */
    visitCaseClauses(ctx: RuleContext): Node.SwitchCase[] {
        this.log(ctx, Trace.frame())
        this.assertType(ctx, ECMAScriptParser.CaseClausesContext)
        const switches: Node.SwitchCase[] = []
        for (let i = 0; i < ctx.getChildCount(); ++i) {
            const node = ctx.getChild(i)
            if (node instanceof ECMAScriptParser.CaseClauseContext) {
                switches.push(this.visitCaseClause(node))
            }
        }
        return switches
    }

    /**
     * Visit a parse tree produced by ECMAScriptParser#caseClause.
     * 
     * ```
     * caseClause
     *  : Case expressionSequence ':' statementList?
     *  ;
     * ```
     * @param ctx 
     */
    visitCaseClause(ctx: RuleContext): Node.SwitchCase {
        this.log(ctx, Trace.frame())
        this.assertType(ctx, ECMAScriptParser.CaseClauseContext)

        const sequenceCtx = this.getTypedRuleContext(ctx, ECMAScriptParser.ExpressionSequenceContext)
        const statementCtx = this.getTypedRuleContext(ctx, ECMAScriptParser.StatementListContext)
        const test: Expression = this.coerceToExpressionOrSequence(this.visitExpressionSequence(sequenceCtx))
        const consequent: Statement[] = statementCtx ? this.visitStatementList(statementCtx) : []

        return new Node.SwitchCase(test, consequent)
    }

    /**
     * Visit a parse tree produced by ECMAScriptParser#defaultClause.
     * 
     * ```
     * defaultClause
     *  : Default ':' statementList?
     *  ;
     * ```
     * @param ctx 
     */
    visitDefaultClause(ctx: RuleContext): Node.SwitchCase {
        this.log(ctx, Trace.frame())
        this.assertType(ctx, ECMAScriptParser.DefaultClauseContext)

        const statementCtx = this.getTypedRuleContext(ctx, ECMAScriptParser.StatementListContext)
        const consequent: Statement[] = statementCtx ? this.visitStatementList(statementCtx) : []

        return new Node.SwitchCase(null, consequent)
    }

    /**
     * 
     * labelledStatement
     *   : identifier ':' statement
     *   ; 
     */
    visitLabelledStatement(ctx: RuleContext): Node.LabeledStatement {
        this.log(ctx, Trace.frame())
        this.assertType(ctx, ECMAScriptParser.LabelledStatementContext)
        const identifier = this.visitIdentifier(ctx.getChild(0))
        const statement = this.visitStatement(ctx.getChild(2))
        return new Node.LabeledStatement(identifier, statement)
    }

    /**
     * Visit a parse tree produced by ECMAScriptParser#throwStatement.
     * ```
     * throwStatement
     *   : Throw {this.notLineTerminator()}? expressionSequence eos
     *   ;
     * ```
     * @param ctx 
     */
    visitThrowStatement(ctx: RuleContext): Node.ThrowStatement {
        this.log(ctx, Trace.frame())
        this.assertType(ctx, ECMAScriptParser.ThrowStatementContext)
        const exp = this.getTypedRuleContext(ctx, ECMAScriptParser.ExpressionSequenceContext)
        const argument: Expression = this.coerceToExpressionOrSequence(this.visitExpressionSequence(exp))
        return new Node.ThrowStatement(argument)
    }

    /**
     * Visit a parse tree produced by ECMAScriptParser#tryStatement.
     * 
     * ```
     * tryStatement
     *   : Try block (catchProduction finallyProduction? | finallyProduction)
     *   ;
     * ```
     * @param ctx 
     */
    visitTryStatement(ctx: RuleContext): Node.TryStatement {
        this.log(ctx, Trace.frame())
        this.assertType(ctx, ECMAScriptParser.TryStatementContext)

        const finallyCtx = this.getTypedRuleContext(ctx, ECMAScriptParser.FinallyProductionContext)
        const catchCtx = this.getTypedRuleContext(ctx, ECMAScriptParser.CatchProductionContext)

        const block: Node.BlockStatement = this.visitBlock(this.getTypedRuleContext(ctx, ECMAScriptParser.BlockContext))
        const handler: Node.CatchClause | null = (catchCtx == null) ? null : this.visitCatchProduction(catchCtx)
        const finalizer: Node.BlockStatement | null = (finallyCtx == null) ? null : this.visitFinallyProduction(finallyCtx)

        return new Node.TryStatement(block, handler, finalizer)
    }

    /**
     * Visit a parse tree produced by ECMAScriptParser#catchProduction.
     * Node count
     * 2 = `catch {}`
     * 5 = `catch (e) {}`
     * 
     * ```
     * catchProduction
     *  : Catch ('(' assignable? ')')? block
     *  ;
     * ```
     * @param ctx 
     */
    visitCatchProduction(ctx: RuleContext): Node.CatchClause {
        this.log(ctx, Trace.frame())
        this.assertType(ctx, ECMAScriptParser.CatchProductionContext)

        const assignableCtx = this.getTypedRuleContext(ctx, ECMAScriptParser.AssignableContext)
        const param: Node.BindingIdentifier | Node.BindingPattern | null = (assignableCtx == null) ? null : this.visitAssignable(assignableCtx)
        const body: Node.BlockStatement = this.visitBlock(this.getTypedRuleContext(ctx, ECMAScriptParser.BlockContext))

        return new Node.CatchClause(param, body)
    }

    // Visit a parse tree produced by ECMAScriptParser#finallyProduction.
    visitFinallyProduction(ctx: RuleContext): Node.BlockStatement {
        this.log(ctx, Trace.frame())
        this.assertType(ctx, ECMAScriptParser.FinallyProductionContext)
        return this.visitBlock(this.getTypedRuleContext(ctx, ECMAScriptParser.BlockContext))
    }

    // Visit a parse tree produced by ECMAScriptParser#debuggerStatement.
    visitDebuggerStatement(ctx: RuleContext) {
        throw new TypeError("Not implemented")
    }

    /**
     * Visit a parse tree produced by ECMAScriptParser#functionDeclaration.
     * 
     * ```
     * functionDeclaration
     *    : Async? Function '*'? identifier '(' formalParameterList? ')' '{' functionBody '}'
     *    ;   
     * ```
     * @param ctx 
     */
    visitFunctionDeclaration(ctx: RuleContext): Node.FunctionDeclaration | Node.AsyncFunctionDeclaration {
        this.log(ctx, Trace.frame())
        this.assertType(ctx, ECMAScriptParser.FunctionDeclarationContext)

        return this.functionDeclaration(ctx)
    }


    /**
     * Get funciton attribues 
     * @param ctx 
     */
    getFunctionAttributes(ctx: RuleContext): { async: boolean, generator: boolean } {
        let async = false;
        let generator = false;
        for (let i = 0; i < ctx.getChildCount(); ++i) {
            const node = ctx.getChild(i)
            if (node.symbol) {
                const txt = node.getText()
                if (txt == 'async') {
                    async = true
                } else if (txt == '*') {
                    generator = true
                }
            }
        }
        return { async, generator }
    }

    private functionDeclaration(ctx: RuleContext): FunctionDeclaration | AsyncFunctionDeclaration {
        let identifier: Identifier | null = null;
        let params: FunctionParameter[] = []
        let body: BlockStatement;
        const { async, generator } = this.getFunctionAttributes(ctx)

        for (let i = 0; i < ctx.getChildCount(); ++i) {
            const node = ctx.getChild(i)
            if (node instanceof ECMAScriptParser.IdentifierContext) {
                identifier = this.visitIdentifier(node)
            } else if (node instanceof ECMAScriptParser.FormalParameterListContext) {
                params = this.visitFormalParameterList(node)
            } else if (node instanceof ECMAScriptParser.FunctionBodyContext) {
                body = this.visitFunctionBody(node)
            }
        }

        if (async) {
            return new Node.AsyncFunctionDeclaration(identifier, params, body)
        } else {
            return new Node.FunctionDeclaration(identifier, params, body, generator)
        }
    }

    // Visit a parse tree produced by ECMAScriptParser#functionDecl
    visitFunctionDecl(ctx: RuleContext): Node.FunctionDeclaration {
        this.log(ctx, Trace.frame())
        this.assertType(ctx, ECMAScriptParser.FunctionDeclContext)
        return this.visitFunctionDeclaration(ctx.getChild(0))
    }

    /**
     * Visit a parse tree produced by ECMAScriptParser#functionBody.
     * 
     * ```
     * functionBody
     *  : sourceElements?
     *  ;
     * ```
     * @param ctx 
     */
    visitFunctionBody(ctx: RuleContext): Node.BlockStatement {
        this.log(ctx, Trace.frame())
        this.assertType(ctx, ECMAScriptParser.FunctionBodyContext)
        const sourceElements = ctx.sourceElements()
        let body: Node.Statement[] = [];
        if (sourceElements) {
            const statements: Node.Statement[] = this.visitSourceElements(sourceElements)
            body = [...statements]
        }

        return new Node.BlockStatement(body)
    }

    /**
     *  Visit a parse tree produced by ECMAScriptParser#sourceElements.
     * ```
     *  sourceElements
     *    : sourceElement+
     *    ;
     * ```
     * @param ctx 
     */
    visitSourceElements(ctx: RuleContext): Node.Statement[] {
        this.log(ctx, Trace.frame())
        this.assertType(ctx, ECMAScriptParser.SourceElementsContext)
        const statements: Node.Statement[] = []
        for (const node of ctx.sourceElement()) {
            const statement = this.visitStatement(node.statement())
            statements.push(statement)
        }
        return statements;
    }

    /**
     * Visit a parse tree produced by ECMAScriptParser#arrayLiteral.
     * 
     * ```
     * arrayLiteral
     *  : ('[' elementList ']')
     *  ;
     * ```
     * @param ctx 
     */
    visitArrayLiteral(ctx: RuleContext): Node.ArrayExpressionElement[] {
        this.log(ctx, Trace.frame())
        this.assertType(ctx, ECMAScriptParser.ArrayLiteralContext)
        const elementListContext = this.getTypedRuleContext(ctx, ECMAScriptParser.ElementListContext)
        return this.visitElementList(elementListContext)
    }

    /**
     * Visit a parse tree produced by ECMAScriptParser#elementList.
     * compliance: esprima compliane of returning `null` 
     * `[,,]` should have 2 null values
     * 
     * ```
     * elementList
     *  : ','* arrayElement? (','+ arrayElement)* ','* // Yes, everything is optional
     *  ;
     * ```
     * @param ctx 
     */
    visitElementList(ctx: RuleContext): Node.ArrayExpressionElement[] {
        this.log(ctx, Trace.frame())
        this.assertType(ctx, ECMAScriptParser.ElementListContext)
        const elements: Node.ArrayExpressionElement[] = [];
        const iterable = this.iterable(ctx)
        let lastTokenWasComma = false;        
        if(iterable.length > 0){
            if(iterable[0].symbol != null){
                lastTokenWasComma = true;
            }
        }

        for (const node of iterable) {
            //ellison check
            if (node.symbol != null) {
                if (lastTokenWasComma) {
                    elements.push(null)
                }
                lastTokenWasComma = true;
            } else {
                elements.push(this.visitArrayElement(node))
                lastTokenWasComma = false
            }
        }
        return elements;
    }

    private iterable(ctx: RuleContext) {
        const nodes = [];
        for (let i = 0; i < ctx.getChildCount(); ++i) {
            nodes.push(ctx.getChild(i))
        }
        return nodes;
    }

    /**
     * Visit a parse tree produced by ECMAScriptParser#arrayElement.
     * 
     * ```
     * arrayElement
     *  : Ellipsis? singleExpression
     *  ;
     * ```
     * @param ctx 
     */
    visitArrayElement(ctx: RuleContext): Node.ArrayExpressionElement {
        this.log(ctx, Trace.frame())
        this.assertType(ctx, ECMAScriptParser.ArrayElementContext)

        if (ctx.getChildCount() == 1) {
            return this.singleExpression(ctx.getChild(0))
        } else {
            const expression = this.singleExpression(ctx.getChild(1))
            return new SpreadElement(expression)
        }
    }

    /**
     * Visit a parse tree produced by ECMAScriptParser#objectLiteral.
     * 
     * ```
     * objectLiteral
     *  : '{' (propertyAssignment (',' propertyAssignment)*)? ','? '}'
     *  ;
     * ```
     * @param ctx 
     */
    visitObjectLiteral(ctx: RuleContext): Node.ObjectExpression {
        this.log(ctx, Trace.frame())
        this.assertType(ctx, ECMAScriptParser.ObjectLiteralContext)
        if (ctx.getChildCount() == 2) {
            return new Node.ObjectExpression([])
        }

        const nodes = this.filterSymbols(ctx)
        const properties: Node.ObjectExpressionProperty[] = [];
        for (const node of nodes) {
            let property: Node.ObjectExpressionProperty = null;
            if (node instanceof ECMAScriptParser.PropertyExpressionAssignmentContext) {
                property = this.visitPropertyExpressionAssignment(node)
            } else if (node instanceof ECMAScriptParser.PropertyShorthandContext) {
                property = this.visitPropertyShorthand(node)
            } else if (node instanceof ECMAScriptParser.FunctionPropertyContext) {
                property = this.visitFunctionProperty(node)
            } else {
                this.throwInsanceError(this.dumpContext(node))
            }

            if (property != undefined) {
                properties.push(property)
            }
        }
        return new Node.ObjectExpression(properties)
    }

    /**
     * Visit a parse tree produced by ECMAScriptParser#propertyShorthand.
     * AssignmentExpression unrolling into ExpressionStatement > ArrowFunctionExpression> ObjectPattern
     * 
     * Added Identifier to NOde.PropertyType so we can handle both cases
     * ```
     * ({b=2}) => 0 this will have the right type as Literal
     * ({b=z}) => 0 this will have the right type as Identifier
     * ```
     * Shorthand
     * 
     * ```
     * ({b:z}) => 0
     * ({c=z}) => 0
     * ({c}) => 0 
     * ```
     * 
     * Grammar
     *  ```
     * | Ellipsis? singleExpression                                                    # PropertyShorthand
     * ```
     * @param ctx 
     */
    visitPropertyShorthand(ctx: RuleContext): Node.ObjectExpressionProperty {
        this.log(ctx, Trace.frame())
        this.assertType(ctx, ECMAScriptParser.PropertyShorthandContext)
        const computed = false;
        const method = false;
        const shorthand = true;

        let key: Node.PropertyKey
        let value: Node.PropertyValue | null = null
        const expression: Node.Expression = this.singleExpression(ctx.getChild(0))

        if (expression instanceof Node.AssignmentExpression) {
            const assignable: Node.AssignmentExpression = expression as Node.AssignmentExpression
            key = assignable.left as Node.PropertyKey
            value = this.isPropertyValue(assignable.right) ? assignable.right : null
        } else {
            if (ctx.getChildCount()) {
                key = new Identifier(ctx.getText())
            } else {
                key = new Identifier(ctx.getText())
                const expression = this.singleExpression(ctx.getChild(0))
                value = this.isPropertyValue(expression) ? expression : null
            }
        }

        return new Node.Property("init", key, computed, value, method, shorthand)
    }

    /**
     * Type Guard for Node.PropertyValue 
     *  
     * @param expression
     */
    isPropertyValue(expression: Node.Expression): expression is Node.PropertyValue {
        console.info(expression)
        // Added Node.Literal
        //export type BindingPattern = ArrayPattern | ObjectPattern;
        //export type BindingIdentifier = Identifier;
        // PropertyValue = AssignmentPattern | AsyncFunctionExpression | BindingIdentifier | BindingPattern | FunctionExpression;
        const types = [Node.Literal,
        Node.AssignmentPattern,
        Node.AsyncFunctionExpression,
        Node.Identifier,
        Node.ArrayPattern,
        Node.ObjectPattern,
        Node.FunctionExpression,
        Node.ArrowFunctionExpression]

        for (const type of types) {
            if (expression instanceof type) {
                return true
            }
        }
        throw new TypeError('Not a valid PropertyValue type got : ' + expression?.constructor)
    }

    /**
     * 
     * Visit a parse tree produced by ECMAScriptParser#propertyAssignment.
     * ```
     *  | Async? '*'? propertyName '(' formalParameterList?  ')'  '{' functionBody '}'  # FunctionProperty
     * ```
     * @param ctx 
     */
    visitFunctionProperty(ctx: RuleContext): Node.ObjectExpressionProperty {
        this.log(ctx, Trace.frame())
        this.assertType(ctx, ECMAScriptParser.FunctionPropertyContext)
        const key = this.visitPropertyName(ctx.propertyName())
        const computed = false;
        const method = true;
        const shorthand = false;
        let expression: FunctionExpression | AsyncFunctionExpression;
        let params: FunctionParameter[] = []
        let body: BlockStatement;
        const { async, generator } = this.getFunctionAttributes(ctx)
        for (let i = 0; i < ctx.getChildCount(); ++i) {
            const node = ctx.getChild(i)
            if (node instanceof ECMAScriptParser.FormalParameterListContext) {
                params = this.visitFormalParameterList(node)
            } else if (node instanceof ECMAScriptParser.FunctionBodyContext) {
                body = this.visitFunctionBody(node)
            }
        }

        if (async) {
            expression = new Node.AsyncFunctionExpression(null, params, body)
        } else {
            expression = new Node.FunctionExpression(null, params, body, generator)
        }

        return new Node.Property("init", key, computed, expression, method, shorthand)
    }

    /**
     * Filter out TerminalNodes (commas, pipes, brackets)
     * @param ctx 
     */
    private filterSymbols(ctx: RuleContext): RuleContext[] {
        const filtered: RuleContext[] = [];
        for (let i = 0; i < ctx.getChildCount(); ++i) {
            const node = ctx.getChild(i)
            // there might be a better way
            if (node.symbol != undefined) {
                continue;
            }
            filtered.push(node)
        }
        return filtered;
    }

    /**
     * Visit a parse tree produced by ECMAScriptParser#PropertyExpressionAssignment.
     * 
     * ```
     * propertyAssignment
     *     : propertyName ':' singleExpression                                             # PropertyExpressionAssignment
     *     | '[' singleExpression ']' ':' singleExpression                                 # ComputedPropertyExpressionAssignment
     *     | Async? '*'? propertyName '(' formalParameterList?  ')'  '{' functionBody '}'  # FunctionProperty
     *     | getter '(' ')' '{' functionBody '}'                                           # PropertyGetter
     *     | setter '(' formalParameterArg ')' '{' functionBody '}'                        # PropertySetter
     *     | Ellipsis? singleExpression                                                    # PropertyShorthand
     *     ;
     *``` 
     */
    visitPropertyExpressionAssignment(ctx: RuleContext): Node.ObjectExpressionProperty {
        this.log(ctx, Trace.frame())
        this.assertType(ctx, ECMAScriptParser.PropertyExpressionAssignmentContext)
        const propNode: RuleContext = ctx.getChild(0) // PropertyName
        let key: PropertyKey;
        let value;
        let computed = false;
        const method = false;
        const shorthand = false;

        if (propNode instanceof ECMAScriptParser.PropertyNameContext) {
            // should check for actuall `[expression]`
            if (propNode.getChildCount() == 3) {
                computed = true
            }
            key = this.visitPropertyName(propNode)
            value = this.singleExpression(ctx.getChild(2), false)
        } else if (propNode instanceof ECMAScriptParser.ComputedPropertyExpressionAssignmentContext) {
            throw new TypeError("Not implemented : ComputedPropertyExpressionAssignmentContext")
        } else if (propNode instanceof ECMAScriptParser.FunctionPropertyContext) {
            throw new TypeError("Not implemented : FunctionPropertyContext")
        } else if (propNode instanceof ECMAScriptParser.PropertyGetterContext) {
            throw new TypeError("Not implemented : PropertyGetterContext")
        } else if (propNode instanceof ECMAScriptParser.PropertySetterContext) {
            throw new TypeError("Not implemented : PropertySetterContext")
        } else if (propNode instanceof ECMAScriptParser.PropertyShorthandContext) {
            throw new TypeError("Not implemented : PropertyShorthandContext")
        }

        return new Node.Property("init", key, computed, value, method, shorthand)
    }

    // Visit a parse tree produced by ECMAScriptParser#PropertyGetter.
    visitPropertyGetter(ctx: RuleContext) {
        console.trace('not implemented')

    }


    // Visit a parse tree produced by ECMAScriptParser#PropertySetter.
    visitPropertySetter(ctx: RuleContext) {
        console.trace('not implemented')

    }

    /**
     * Visit a parse tree produced by ECMAScriptParser#propertyName.
     * 
     * ```
     * propertyName
     *  : identifierName
     *  | StringLiteral
     *  | numericLiteral
     *  | '[' singleExpression ']'
     *  ;
     * ```
     */
    visitPropertyName(ctx: RuleContext): Node.PropertyKey {
        this.log(ctx, Trace.frame())
        this.assertType(ctx, ECMAScriptParser.PropertyNameContext)
        let count = ctx.getChildCount()
        if (count == 3) {
            const node = ctx.getChild(1)
            return this.singleExpression(node)
        } else {
            const node = ctx.getChild(0)
            count = node.getChildCount()

            if (count == 0) { // literal
                const symbol = node.symbol;
                const state = symbol.type;
                const raw = node.getText()
                switch (state) {
                    case ECMAScriptParser.BooleanLiteral:
                        return this.createLiteralValue(node, raw === 'true', raw)
                    case ECMAScriptParser.StringLiteral:
                        return this.createStringLiteral(node)
                }

            } else if (count == 1) {
                if (node instanceof ECMAScriptParser.IdentifierNameContext) {
                    return this.visitIdentifierName(node)
                } else if (node instanceof ECMAScriptParser.NumericLiteralContext) {
                    return this.visitNumericLiteral(node)
                }
            }
        }
        this.throwInsanceError(this.dumpContext(node))
    }

    private createStringLiteral(node: RuleContext): Node.Literal {
        const raw = node.getText()
        return this.createLiteralValue(node, raw.replace(/"/g, "").replace(/'/g, ""), raw)
    }

    /**
      * Visit a parse tree produced by ECMAScriptParser#arguments.
      * 
      * arguments
      *   : '('(argument (',' argument)* ','?)?')'
      *   ;
      * @param ctx 
      * @returns ArgumentListElement[]
      */
    visitArguments(ctx: RuleContext): Node.ArgumentListElement[] {
        this.log(ctx, Trace.frame())
        this.assertType(ctx, ECMAScriptParser.ArgumentsContext)
        const elems: Node.ArgumentListElement[] = []
        const args = ctx.argument()
        if (args) {
            for (let node of args) {
                elems.push(this.visitArgument(node))
            }
        }
        return elems;
    }

    /**
     * Visit a parse tree produced by ECMAScriptParser#argument.
     * argument
     *   : Ellipsis? (singleExpression | identifier)
     *   ;
     * @param ctx 
     */
    visitArgument(ctx: RuleContext): Node.ArgumentListElement {
        this.log(ctx, Trace.frame())
        this.assertType(ctx, ECMAScriptParser.ArgumentContext)
        const evalNode = (node: RuleContext) => {
            if (node instanceof ECMAScriptParser.IdentifierContext) {
                return this.visitIdentifier(node)
            } else {
                return this.singleExpression(node)
            }
        }

        if (ctx.getChildCount() == 1) {
            return evalNode(ctx.getChild(0))
        } else {
            return new Node.SpreadElement(evalNode(ctx.getChild(1)))
        }
    }

    /**
     * Visit a parse tree produced by ECMAScriptParser#expressionSequence.
     * 
     * ```
     * expressionSequence
     *   : singleExpression ( ',' singleExpression )*
     *   ;
     * ```
     * @param ctx 
     */
    visitExpressionSequence(ctx: RuleContext): Node.SequenceExpression {
        this.log(ctx, Trace.frame())
        this.assertType(ctx, ECMAScriptParser.ExpressionSequenceContext)
        const expressions: Node.Expression[] = []
        for (const node of this.filterSymbols(ctx)) {
            expressions.push(this.singleExpression(node, false))
        }
        return this.decorate(new Node.SequenceExpression(expressions), this.asMarker(this.asMetadata(ctx.getSourceInterval())))
    }

    /**
     * Evaluate a singleExpression
     * Currently singleExpression is called from both Statements and Expressions which causes problems for 
     * distinguishing function declaration from function expressions 
     * 
     * @param node 
     * @param isStatement 
     */
    singleExpression(node: RuleContext): Node.Expression {

        if (node instanceof ECMAScriptParser.LiteralExpressionContext) {
            return this.visitLiteralExpression(node)
        } else if (node instanceof ECMAScriptParser.ObjectLiteralExpressionContext) {
            return this.visitObjectLiteralExpression(node)
        } else if (node instanceof ECMAScriptParser.AssignmentExpressionContext) {
            return this.visitAssignmentExpression(node)
        } else if (node instanceof ECMAScriptParser.AdditiveExpressionContext) {
            return this.visitAdditiveExpression(node)
        } else if (node instanceof ECMAScriptParser.MultiplicativeExpressionContext) {
            return this.visitMultiplicativeExpression(node)
        } else if (node instanceof ECMAScriptParser.ArrayLiteralExpressionContext) {
            return this.visitArrayLiteralExpression(node)
        } else if (node instanceof ECMAScriptParser.EqualityExpressionContext) {
            return this.visitEqualityExpression(node)
        } else if (node instanceof ECMAScriptParser.ParenthesizedExpressionContext) {
            return this.visitParenthesizedExpression(node)
        } else if (node instanceof ECMAScriptParser.RelationalExpressionContext) {
            return this.visitRelationalExpression(node)
        } else if (node instanceof ECMAScriptParser.IdentifierExpressionContext) {
            return this.visitIdentifierExpression(node)
        } else if (node instanceof ECMAScriptParser.MemberDotExpressionContext) {
            return this.visitMemberDotExpression(node)
        } else if (node instanceof ECMAScriptParser.MemberIndexExpressionContext) {
            return this.visitMemberIndexExpression(node)
        } else if (node instanceof ECMAScriptParser.AssignmentOperatorExpressionContext) {
            return this.visitAssignmentOperatorExpression(node)
        } else if (node instanceof ECMAScriptParser.FunctionExpressionContext) {
            return this.visitFunctionExpression(node)
        } else if (node instanceof ECMAScriptParser.NewExpressionContext) {
            return this.visitNewExpression(node)
        } else if (node instanceof ECMAScriptParser.ArgumentsExpressionContext) {
            return this.visitArgumentsExpression(node)
        } else if (node instanceof ECMAScriptParser.MetaExpressionContext) {
            return this.visitMetaExpression(node)
        } else if (node instanceof ECMAScriptParser.VoidExpressionContext) {
            return this.visitVoidExpression(node)
        } else if (node instanceof ECMAScriptParser.PostIncrementExpressionContext) {
            return this.visitPostIncrementExpression(node)
        } else if (node instanceof ECMAScriptParser.PreIncrementExpressionContext) {
            return this.visitPreIncrementExpression(node)
        } else if (node instanceof ECMAScriptParser.PreDecreaseExpressionContext) {
            return this.visitPreDecreaseExpression(node)
        } else if (node instanceof ECMAScriptParser.PostDecreaseExpressionContext) {
            return this.visitPostDecreaseExpression(node)
        } else if (node instanceof ECMAScriptParser.ThisExpressionContext) {
            return this.visitThisExpression(node)
        } else if (node instanceof ECMAScriptParser.ClassExpressionContext) {
            return this.visitClassExpression(node)
        } else if (node instanceof ECMAScriptParser.LogicalAndExpressionContext) {
            return this.visitLogicalAndExpression(node)
        } else if (node instanceof ECMAScriptParser.LogicalOrExpressionContext) {
            return this.visitLogicalOrExpression(node)
        } else if (node instanceof ECMAScriptParser.InExpressionContext) {
            return this.visitInExpression(node)
        } else if (node instanceof ECMAScriptParser.IdentifierContext) {
            return this.visitIdentifier(node)
        } else if (node instanceof ECMAScriptParser.PowerExpressionContext) {
            return this.visitPowerExpression(node)
        } else if (node instanceof ECMAScriptParser.DeleteExpressionContext) {
            return this.visitDeleteExpression(node)
        }

        this.throwInsanceError(this.dumpContext(node))
    }

    /**
     * Visit a parse tree produced by ECMAScriptParser#MetaExpression.
     * 
     * ```
     *  New '.' identifier 
     * ```
     * @param ctx 
     */
    visitMetaExpression(ctx: RuleContext): Node.MetaProperty {
        this.log(ctx, Trace.frame())
        this.assertType(ctx, ECMAScriptParser.MetaExpressionContext)
        throw new TypeError("Opperation not supported at this time")
    }

    /***
     * Visit a parse tree produced by ECMAScriptParser#classDeclaration.
     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/class
     * 
     * ```
     *  classDeclaration
     *      : Class identifier classTail
     *      ;
     * ```
     */
    visitClassDeclaration(ctx: RuleContext): Node.ClassDeclaration {
        this.log(ctx, Trace.frame())
        this.assertType(ctx, ECMAScriptParser.ClassDeclarationContext)

        const count = ctx.getChildCount()
        let identifier: Node.Identifier;
        let body: Node.ClassBody;

        if (count == 2) {
            identifier = this.visitIdentifier(ctx.getChild(1))
            body = this.visitClassTail(ctx.getChild(2))
        } else if (count == 3) {
            identifier = this.visitIdentifier(ctx.getChild(1))
            body = this.visitClassTail(ctx.getChild(2))
        } else {
            throw new TypeError("Unhandled type")
        }

        return new Node.ClassDeclaration(identifier, null, body)
    }

    /**
     * Visit a parse tree produced by ECMAScriptParser#classTail.
     * TODO : fix extens functionality
     * 
     * ```
     * classTail
     *   : (Extends singleExpression)? '{' classElement* '}'
     *   ;
     * ```
     * @param ctx 
     */
    visitClassTail(ctx: RuleContext): Node.ClassBody {
        this.log(ctx, Trace.frame())
        this.assertType(ctx, ECMAScriptParser.ClassTailContext)
        const properties: Node.Property[] = [];
        for (const node of this.iterable(ctx)) {
            if (node instanceof ECMAScriptParser.ClassElementContext) {
                properties.push(this.visitClassElement(node))
            }
        }
        return new Node.ClassBody(properties)
    }

    /**
     * Visit a parse tree produced by ECMAScriptParser#classElement.
     * 
     * ```
     *  classElement
     *      : (Static | {this.n("static")}? identifier | Async)* (methodDefinition | assignable '=' objectLiteral ';')
     *      | emptyStatement
     *      | '#'? propertyName '=' singleExpression
     *      ;
     * ```
     * @param ctx 
     */
    visitClassElement(ctx: RuleContext): Node.ClassExpression | Node.EmptyStatement {
        this.log(ctx, Trace.frame())
        this.assertType(ctx, ECMAScriptParser.ClassElementContext)
        const methodDefContext = this.getTypedRuleContext(ctx, ECMAScriptParser.MethodDefinitionContext)
        if (methodDefContext) {
            return this.visitMethodDefinition(methodDefContext)
        }
        return new Node.EmptyStatement()
    }

    /**
     * Examples :
     * ```
     *  let x = class y {}
     *  let x = class {}
     *  let x = (class {})
     * ```
     * 
     * Grammar :
     * ```
     *  Class identifier? classTail    # ClassExpression
     * ```
     * @param ctx 
     */
    visitClassExpression(ctx: RuleContext): Node.ClassExpression {
        this.log(ctx, Trace.frame())
        this.assertType(ctx, ECMAScriptParser.ClassExpressionContext)

        if (ctx.getChildCount() == 2) {
            const body = this.visitClassTail(ctx.getChild(1))
            return new Node.ClassExpression(null, null, body)
        } else {
            const identifier = this.visitIdentifier(ctx.getChild(1))
            const body = this.visitClassTail(ctx.getChild(2))
            return new Node.ClassExpression(identifier, null, body)
        }
    }

    /**
     * Visit a parse tree produced by ECMAScriptParser#methodDefinition.
     * 
     * ```
     *  methodDefinition
     *     : '*'? '#'? propertyName '(' formalParameterList? ')' '{' functionBody '}'
     *     | '*'? '#'? getter '(' ')' '{' functionBody '}'
     *     | '*'? '#'? setter '(' formalParameterList? ')' '{' functionBody '}'
     *     ;
     * ```
     * @param ctx 
     */
    visitMethodDefinition(ctx: RuleContext): Node.MethodDefinition {
        this.log(ctx, Trace.frame())
        this.assertType(ctx, ECMAScriptParser.MethodDefinitionContext)
        // parent contains info for Asyn and Generator in the parentContext
        //  (Static | {this.n("static")}? identifier | Async)*
        const isAsync = this.hasToken(ctx.parentCtx, ECMAScriptParser.Async)
        const isGenerator = this.hasToken(ctx, ECMAScriptParser.Multiply)
        const isStatic = this.hasToken(ctx.parentCtx, ECMAScriptParser.Static) // FIXME

        const prop = ctx.propertyName()
        const computed = false;
        let key: Node.PropertyKey = null;
        let value: AsyncFunctionExpression | FunctionExpression | null = null;

        // case #1
        if (prop) {
            key = this.visitPropertyName(prop)
            const params: FunctionParameter[] = ctx.formalParameterList() ? this.visitFormalParameterList(ctx.formalParameterList()) : []
            const body: BlockStatement = this.visitFunctionBody(ctx.functionBody())
            if (isAsync) {
                value = new AsyncFunctionExpression(null, params, body)
            } else {
                value = new FunctionExpression(null, params, body, isGenerator)
            }
        }

        return new Node.MethodDefinition(key, computed, value, "method", isStatic)
    }

    hasToken(ctx: antlr4.ParserRuleContext, tokenType: number): boolean {
        for (let i = 0; i < ctx.getChildCount(); ++i) {
            const n = ctx.getChild(i)
            if (n.symbol && tokenType === n.symbol.type) {
                return true;
            }
        }
        return false;
    }

    /**
     * Visit a parse tree produced by ECMAScriptParser#formalParameterList.
     * 
     * ```
     * formalParameterList
     *   : formalParameterArg (',' formalParameterArg)* (',' lastFormalParameterArg)?
     *   | lastFormalParameterArg
     *   ;
     * ```
     * @param ctx 
     */
    visitFormalParameterList(ctx: RuleContext): Node.FunctionParameter[] {
        this.log(ctx, Trace.frame())
        this.assertType(ctx, ECMAScriptParser.FormalParameterListContext)
        const formal: Node.FunctionParameter[] = []
        for (let i = 0; i < ctx.getChildCount(); ++i) {
            const node = ctx.getChild(i)
            if (node instanceof ECMAScriptParser.FormalParameterArgContext) {
                const parameter = this.visitFormalParameterArg(node)
                formal.push(parameter)
            } else if (node instanceof ECMAScriptParser.LastFormalParameterArgContext) {
                const parameter = this.visitLastFormalParameterArg(node)
                formal.push(parameter)
            }
        }
        return formal;
    }

    /**
     * Visit a parse tree produced by ECMAScriptParser#formalParameterArg.
     * 
     * ```
     * formalParameterArg
     *   : assignable ('=' singleExpression)?      // ECMAScript 6: Initialization
     *   ;
     * ```
     * @param ctx 
     */
    visitFormalParameterArg(ctx: RuleContext): Node.AssignmentPattern | Node.BindingIdentifier | Node.BindingPattern {
        this.log(ctx, Trace.frame())
        this.assertType(ctx, ECMAScriptParser.FormalParameterArgContext)
        const count = ctx.getChildCount()
        if (count != 1 && count != 3) {
            this.throwInsanceError(this.dumpContext(ctx))
        }
        // compliance(espree)
        // Following `(param1 = 1, param2) => {  } ` will produce
        // param1 = AssignmentPattern
        // param2 = BindingIdentifier | BindingPattern 
        if (count == 1) {
            return this.visitAssignable(ctx.getChild(0))
        } else {
            const assignable = this.visitAssignable(ctx.getChild(0))
            const expression = this.singleExpression(ctx.getChild(2))
            return new AssignmentPattern(assignable, expression)
        }
    }
    /**
     * ```
     *  assignable
     *    : identifier
     *    | arrayLiteral
     *    | objectLiteral
     *    ; 
     * ```
     * @param ctx  AssignableContext
     */
    visitAssignable(ctx: RuleContext): Node.BindingIdentifier | Node.BindingPattern {
        this.log(ctx, Trace.frame())
        this.assertType(ctx, ECMAScriptParser.AssignableContext)
        const assignable = ctx.getChild(0)
        if (assignable instanceof ECMAScriptParser.IdentifierContext) {
            return this.visitIdentifier(assignable)
        } else if (assignable instanceof ECMAScriptParser.ArrayLiteralContext) {
            const elements = this.visitArrayLiteral(assignable)
            return new ArrayPattern(elements)
        } else if (assignable instanceof ECMAScriptParser.ObjectLiteralContext) {
            // Unroll expression into ObjectPattern
            const elements = this.visitObjectLiteral(assignable)
            const properties: Node.ObjectPatternProperty[] = elements.properties;
            return new Node.ObjectPattern(properties)
        }

        this.throwInsanceError(this.dumpContext(ctx))
    }

    /**
     * Visit a parse tree produced by ECMAScriptParser#lastFormalParameterArg.
     * 
     * lastFormalParameterArg                        // ECMAScript 6: Rest Parameter
     *   : Ellipsis singleExpression
     *   ;
     */
    visitLastFormalParameterArg(ctx: RuleContext): Node.RestElement {
        this.log(ctx, Trace.frame())
        this.assertType(ctx, ECMAScriptParser.LastFormalParameterArgContext)
        const expression = this.singleExpression(ctx.getChild(1))

        return new Node.RestElement(expression)
    }

    // Visit a parse tree produced by ECMAScriptParser#TernaryExpression.
    visitTernaryExpression(ctx: RuleContext) {
        console.trace('not implemented')
    }

    /**
     * Visit a parse tree produced by ECMAScriptParser#LogicalAndExpression.
     * 
     * ```
     * singleExpression '&&' singleExpression    
     * ```
     * @param ctx 
     */
    visitLogicalAndExpression(ctx: RuleContext): Node.BinaryExpression {
        this.log(ctx, Trace.frame())
        this.assertType(ctx, ECMAScriptParser.LogicalAndExpressionContext)
        return this._binaryExpression(ctx)
    }

    /**
    * Visit a parse tree produced by ECMAScriptParser#LogicalOrExpression.
    * 
    * ```
    * singleExpression '||' singleExpression    
    * ```
    * @param ctx 
    */
    visitLogicalOrExpression(ctx: RuleContext): Node.BinaryExpression {
        this.log(ctx, Trace.frame())
        this.assertType(ctx, ECMAScriptParser.LogicalOrExpressionContext)
        return this._binaryExpression(ctx)
    }


    visitPowerExpression(ctx: RuleContext): Node.BinaryExpression {
        this.log(ctx, Trace.frame())
        this.assertType(ctx, ECMAScriptParser.PowerExpressionContext)
        return this._binaryExpression(ctx)
    }

    /**
     * Evaluate binary expression.
     * This applies to following types
     * LogicalAndExpressionContext
     * LogicalOrExpressionContext
     * @param ctx 
     */
    _binaryExpression(ctx: RuleContext): Node.BinaryExpression {
        const lhs = this._visitBinaryExpression(ctx.getChild(0))
        const operator = ctx.getChild(1).getText()
        const rhs = this._visitBinaryExpression(ctx.getChild(2))

        return new Node.BinaryExpression(operator, lhs, rhs)
    }

    /**
     * Visit a parse tree produced by ECMAScriptParser#ObjectLiteralExpression.
     * @param ctx 
     */
    visitObjectLiteralExpression(ctx: RuleContext): Node.ObjectExpression {
        this.log(ctx, Trace.frame())
        this.assertType(ctx, ECMAScriptParser.ObjectLiteralExpressionContext)
        const node = ctx.getChild(0)
        return this.visitObjectLiteral(node)
    }

    /**
     * Visit a parse tree produced by ECMAScriptParser#InExpression.
     * 
     * ```
     * | singleExpression In singleExpression                                  # InExpression
     * ```
     * @param ctx 
     */
    visitInExpression(ctx: RuleContext) {
        this.log(ctx, Trace.frame())
        this.assertType(ctx, ECMAScriptParser.InExpressionContext)
        this.assertNodeCount(ctx, 3)

        return this._binaryExpression(ctx)
    }

    // Visit a parse tree produced by ECMAScriptParser#NotExpression.
    visitNotExpression(ctx: RuleContext) {
        console.trace('not implemented')
    }

    /**
     * Visit a parse tree produced by ECMAScriptParser#ArgumentsExpression.
     * 
     * ```
     * | singleExpression arguments                # ArgumentsExpression
     * ```
     * @param ctx 
     */
    visitArgumentsExpression(ctx: RuleContext): Node.CallExpression {
        this.log(ctx, Trace.frame())
        this.assertType(ctx, ECMAScriptParser.ArgumentsExpressionContext)
        const arg = ctx.arguments()
        const callee = this.singleExpression(ctx.singleExpression())
        const args: Node.ArgumentListElement[] = arg ? this.visitArguments(arg) : [];
        return new Node.CallExpression(callee, args)
    }


    /**
     * Visit a parse tree produced by ECMAScriptParser#ThisExpression.
     * 
     * @param ctx 
     */
    visitThisExpression(ctx: RuleContext): Node.ThisExpression {
        this.log(ctx, Trace.frame())
        this.assertType(ctx, ECMAScriptParser.ThisExpressionContext)

        return new Node.ThisExpression()
    }

    /**
     * Need to unroll functionDeclaration as a FunctionExpression 
     * Visit a parse tree produced by ECMAScriptParser#FunctionExpression.
     * 
     * ```
     *  anoymousFunction
     *     : functionDeclaration                                                       # FunctionDecl
     *     | Async? Function '*'? '(' formalParameterList? ')' '{' functionBody '}'    # AnoymousFunctionDecl
     *     | Async? arrowFunctionParameters '=>' arrowFunctionBody                     # ArrowFunction
     *     ;
     * ```
     * @param ctx 
     * @param isStatement 
     */
    visitFunctionExpression(ctx: RuleContext)
        : Node.FunctionExpression
        | Node.AsyncFunctionExpression
        | Node.ArrowFunctionExpression
        | Node.AsyncArrowFunctionExpression
        | Node.FunctionDeclaration
        | Node.AsyncFunctionDeclaration {
        this.log(ctx, Trace.frame())
        this.assertType(ctx, ECMAScriptParser.FunctionExpressionContext)

        // determinte if we are performing expression or declaration
        //  FunctionExpression | FunctionDeclaration
        const node = ctx.getChild(0)
        let exp;
        if (node instanceof ECMAScriptParser.FunctionDeclContext) {
            exp = this.visitFunctionDecl(ctx.getChild(0))
        } else if (node instanceof ECMAScriptParser.AnoymousFunctionDeclContext) {
            exp = this.visitAnoymousFunctionDecl(ctx.getChild(0))
        } else if (node instanceof ECMAScriptParser.ArrowFunctionContext) {
            exp = this.visitArrowFunction(ctx.getChild(0))
        } else {
            throw new TypeError("not implemented")
        }

        // FunctionDeclaration | AsyncFunctionDeclaration  
        if (exp instanceof Node.AsyncFunctionDeclaration) {
            return new Node.AsyncFunctionExpression(exp.id, exp.params, exp.body)
        } else if (exp instanceof Node.FunctionDeclaration) {
            return new Node.FunctionExpression(exp.id, exp.params, exp.body, exp.generator)
        }
        return exp;
    }

    /**
     * Visit a parse tree produced by ECMAScriptParser#functionDecl
     * ```
     * functionDeclaration
     *   : Async? Function '*'? identifier '(' formalParameterList? ')' '{' functionBody '}'
     *   ;   
     * ```
     * @param ctx 
     */
    visitAnoymousFunctionDecl(ctx: RuleContext): Node.FunctionDeclaration {
        this.log(ctx, Trace.frame())
        this.assertType(ctx, ECMAScriptParser.AnoymousFunctionDeclContext)
        return this.functionDeclaration(ctx)
    }

    /**
     * Visit a parse tree produced by ECMAScriptParser#functionDecl
     * @param ctx 
     */
    visitArrowFunction(ctx: RuleContext): Node.ArrowFunctionExpression {
        this.log(ctx, Trace.frame())
        this.assertType(ctx, ECMAScriptParser.ArrowFunctionContext)

        const paramContext = this.getTypedRuleContext(ctx, ECMAScriptParser.ArrowFunctionParametersContext)
        const bodyContext = this.getTypedRuleContext(ctx, ECMAScriptParser.ArrowFunctionBodyContext)
        const params = this.visitArrowFunctionParameters(paramContext)
        const body = this.visitArrowFunctionBody(bodyContext)
        const expression = !(body instanceof Node.BlockStatement);

        return new Node.ArrowFunctionExpression(params, body, expression)
    }

    /**
     * Visit a parse tree produced by ECMAScriptParser#arrowFunctionParameters
     * 
     * ```
     * arrowFunctionParameters
     *  : identifier
     *  | '(' formalParameterList? ')'
     *  ;
     * ```
     * @param ctx 
     */
    visitArrowFunctionParameters(ctx: RuleContext): Node.FunctionParameter[] {
        this.log(ctx, Trace.frame())
        this.assertType(ctx, ECMAScriptParser.ArrowFunctionParametersContext)
        // got only two ()
        if (ctx.getChildCount() == 2) {
            return [];
        }

        let params = [];
        for (const node of this.iterable(ctx)) {
            if (node instanceof ECMAScriptParser.IdentifierContext) {
                params.push(this.visitIdentifier(node))
            } else if (node instanceof ECMAScriptParser.FormalParameterListContext) {
                params = [...this.visitFormalParameterList(node)];
            }
        }
        return params;
    }

    /**
     * Visit a parse tree produced by ECMAScriptParser#arrowFunctionBody
     * 
     *```
     *  arrowFunctionBody
     *   : '{' functionBody '}' 
     *   | singleExpression
     *   ;
     * ```
     * @param ctx 
     */
    visitArrowFunctionBody(ctx: RuleContext): Node.BlockStatement | Node.Expression {
        this.log(ctx, Trace.frame())
        this.assertType(ctx, ECMAScriptParser.ArrowFunctionBodyContext)
        const node = ctx.getChild(0)
        if (ctx.getChildCount() == 3) {
            const bodyContext = this.getTypedRuleContext(ctx, ECMAScriptParser.FunctionBodyContext)
            if (bodyContext.getChildCount() == 0) {
                return new BlockStatement([])
            }
            return this.visitFunctionBody(bodyContext)
        } else {
            if (node instanceof ECMAScriptParser.ParenthesizedExpressionContext) {
                return this.coerceToExpressionOrSequence(this.visitParenthesizedExpression(node))
            }
            return this.singleExpression(node)
        }
    }

    // Visit a parse tree produced by ECMAScriptParser#UnaryMinusExpression.
    visitUnaryMinusExpression(ctx: RuleContext) {
        console.trace('not implemented')
    }

    /**
     * Visit a parse tree produced by ECMAScriptParser#AssignmentExpression.
     * 
     * ```
     * <assoc=right> singleExpression '=' singleExpression                   # AssignmentExpression
     * ```
     * @param ctx 
     */
    visitAssignmentExpression(ctx: RuleContext): Node.AssignmentExpression {
        this.log(ctx, Trace.frame())
        this.assertType(ctx, ECMAScriptParser.AssignmentExpressionContext)
        this.assertNodeCount(ctx, 3)

        const initialiser = ctx.getChild(0)
        const operator = ctx.getChild(1).getText()
        const expression = ctx.getChild(2)
        let lhs = this.singleExpression(initialiser)
        const rhs = this.singleExpression(expression)

        // [a , b] = 1// ArrayPattern
        if (lhs instanceof Node.ArrayExpression) {
            const tmp = lhs as Node.ArrayPattern
            lhs = new Node.ArrayPattern(tmp.elements)
        }

        return new AssignmentExpression(operator, lhs, rhs)
    }


    // Visit a parse tree produced by ECMAScriptParser#TypeofExpression.
    visitTypeofExpression(ctx: RuleContext) {
        console.trace('not implemented')
    }

    // Visit a parse tree produced by ECMAScriptParser#InstanceofExpression.
    visitInstanceofExpression(ctx: RuleContext) {
        console.trace('not implemented')
    }

    // Visit a parse tree produced by ECMAScriptParser#UnaryPlusExpression.
    visitUnaryPlusExpression(ctx: RuleContext) {
        console.trace('not implemented')

    }

    /**
     * Visit a parse tree produced by ECMAScriptParser#DeleteExpression.
     * ```
     *     | Delete singleExpression                                               # DeleteExpression
     * ```
     * @param ctx 
     */
    visitDeleteExpression(ctx: RuleContext): Node.UnaryExpression {
        this.log(ctx, Trace.frame())
        this.assertType(ctx, ECMAScriptParser.DeleteExpressionContext)
        this.assertNodeCount(ctx, 2)
        const argument: Node.Expression = this.singleExpression(ctx.singleExpression())

        return new Node.UnaryExpression("delete", argument)
    }

    // Visit a parse tree produced by ECMAScriptParser#EqualityExpression.
    visitEqualityExpression(ctx: RuleContext): Node.BinaryExpression {
        this.log(ctx, Trace.frame())
        this.assertType(ctx, ECMAScriptParser.EqualityExpressionContext)
        this.assertNodeCount(ctx, 3)

        return this._binaryExpression(ctx)
    }

    // Visit a parse tree produced by ECMAScriptParser#BitXOrExpression.
    visitBitXOrExpression(ctx: RuleContext) {
        console.trace('not implemented')
    }

    // Visit a parse tree produced by ECMAScriptParser#MultiplicativeExpression.
    visitMultiplicativeExpression(ctx: RuleContext): Node.BinaryExpression {
        this.log(ctx, Trace.frame())
        this.assertType(ctx, ECMAScriptParser.MultiplicativeExpressionContext)
        this.assertNodeCount(ctx, 3)

        return this._binaryExpression(ctx)
    }

    // Visit a parse tree produced by ECMAScriptParser#BitShiftExpression.
    visitBitShiftExpression(ctx: RuleContext) {
        console.trace('not implemented')
    }

    /**
     * sequences that have only one node will be pulled up to `Node.Expression`
     * complaince(esprima) 
     * 
     * @param sequence 
     */
    private coerceToExpressionOrSequence(sequence: Node.SequenceExpression): Node.Expression {
        if (sequence.expressions) {
            if (sequence.expressions.length == 1) {
                return sequence.expressions[0]
            }
        }
        return sequence;
    }

    /**
     * Visit a parse tree produced by ECMAScriptParser#ParenthesizedExpression.
     * 
     * ```
     *     | '(' expressionSequence ')'                                            # ParenthesizedExpression
     * ```
     * @param ctx 
     */
    visitParenthesizedExpression(ctx: RuleContext): Node.Expression | Node.SequenceExpression {
        this.log(ctx, Trace.frame())
        this.assertType(ctx, ECMAScriptParser.ParenthesizedExpressionContext)
        this.assertNodeCount(ctx, 3)

        return this.coerceToExpressionOrSequence(this.visitExpressionSequence(ctx.getChild(1)))
    }


    // Visit a parse tree produced by ECMAScriptParser#AdditiveExpression.
    visitAdditiveExpression(ctx: RuleContext): Node.BinaryExpression {
        this.log(ctx, Trace.frame())
        this.assertType(ctx, ECMAScriptParser.AdditiveExpressionContext)
        this.assertNodeCount(ctx, 3)

        return this._binaryExpression(ctx)
    }

    _visitBinaryExpression(ctx: RuleContext) {
        if (ctx instanceof ECMAScriptParser.ParenthesizedExpressionContext) {
            return this.visitParenthesizedExpression(ctx)
        } else if (ctx instanceof ECMAScriptParser.IdentifierExpressionContext) {
            return this.visitIdentifierExpression(ctx)
        } else if (ctx instanceof ECMAScriptParser.LiteralExpressionContext) {
            return this.visitLiteralExpression(ctx)
        } else if (ctx instanceof ECMAScriptParser.AdditiveExpressionContext) {
            return this.visitAdditiveExpression(ctx)
        } else if (ctx instanceof ECMAScriptParser.MultiplicativeExpressionContext) {
            return this.visitMultiplicativeExpression(ctx)
        } else if (ctx instanceof ECMAScriptParser.RelationalExpressionContext) {
            return this.visitRelationalExpression(ctx)
        } else if (ctx instanceof ECMAScriptParser.LogicalAndExpressionContext) {
            return this.visitLogicalAndExpression(ctx)
        } else if (ctx instanceof ECMAScriptParser.LogicalOrExpressionContext) {
            return this.visitLogicalOrExpression(ctx)
        } else if (ctx instanceof ECMAScriptParser.MemberDotExpressionContext) {
            return this.visitMemberDotExpression(ctx)
        } else if (ctx instanceof ECMAScriptParser.ArgumentsExpressionContext) {
            return this.visitArgumentsExpression(ctx)
        }

        this.throwInsanceError(this.dumpContext(ctx))
    }

    // Visit a parse tree produced by ECMAScriptParser#RelationalExpression.
    visitRelationalExpression(ctx: RuleContext): Node.BinaryExpression {
        console.info("visitRelationalExpression [%s] : %s", ctx.getChildCount(), ctx.getText())
        this.assertType(ctx, ECMAScriptParser.RelationalExpressionContext)
        this.assertNodeCount(ctx, 3)
        const left = ctx.getChild(0)
        const operator = ctx.getChild(1).getText() // No type ( +,- )
        const right = ctx.getChild(2)
        const lhs = this._visitBinaryExpression(left)
        const rhs = this._visitBinaryExpression(right)
        return new BinaryExpression(operator, lhs, rhs)
    }

    private getUpdateExpression(ctx: RuleContext, prefix: boolean): Node.UpdateExpression {
        const operator = ctx.getChild(prefix ? 0 : 1).getText()
        const argument = this.singleExpression(ctx.singleExpression())

        return new UpdateExpression(operator, argument, prefix)
    }

    // Visit a parse tree produced by ECMAScriptParser#PostIncrementExpression.
    visitPostIncrementExpression(ctx: RuleContext): Node.UpdateExpression {
        this.assertType(ctx, ECMAScriptParser.PostIncrementExpressionContext)
        this.assertNodeCount(ctx, 2)

        return this.getUpdateExpression(ctx, false)
    }

    // Visit a parse tree produced by ECMAScriptParser#PreIncrementExpression.
    visitPreIncrementExpression(ctx: RuleContext): Node.UpdateExpression {
        this.assertType(ctx, ECMAScriptParser.PreIncrementExpressionContext)
        this.assertNodeCount(ctx, 2)
        return this.getUpdateExpression(ctx, true)
    }

    // Visit a parse tree produced by ECMAScriptParser#PreDecreaseExpression.
    visitPreDecreaseExpression(ctx: RuleContext): Node.UpdateExpression {
        this.assertType(ctx, ECMAScriptParser.PreDecreaseExpressionContext)
        this.assertNodeCount(ctx, 2)
        return this.getUpdateExpression(ctx, true)
    }

    // Visit a parse tree produced by ECMAScriptParser#PostDecreaseExpression.
    visitPostDecreaseExpression(ctx: RuleContext): Node.UpdateExpression {
        this.assertType(ctx, ECMAScriptParser.PostDecreaseExpressionContext)
        this.assertNodeCount(ctx, 2)
        return this.getUpdateExpression(ctx, false)
    }

    // Visit a parse tree produced by ECMAScriptParser#BitNotExpression.
    visitBitNotExpression(ctx: RuleContext) {
        console.trace('not implemented')
    }

    /**
     * Visit a parse tree produced by ECMAScriptParser#NewExpression.
     * This rule is problematic as 
     * 
     * ```
     * | New singleExpression arguments?    # NewExpression
     * ```
     * @param ctx 
     */
    visitNewExpression(ctx: RuleContext): Node.NewExpression {
        this.log(ctx, Trace.frame())
        this.assertType(ctx, ECMAScriptParser.NewExpressionContext)
        const single = ctx.singleExpression()
        const arg = ctx.arguments()
        const callee = this.singleExpression(single)
        let args: Node.ArgumentListElement[] = []
        if (arg) {
            args = this.visitArguments(arg)
        }

        return new Node.NewExpression(callee, args)
    }

    /**
     * Visit a parse tree produced by ECMAScriptParser#LiteralExpression.
     * 
     * ```
     * literal
     *   : NullLiteral
     *   | BooleanLiteral
     *   | StringLiteral
     *   | TemplateStringLiteral
     *   | RegularExpressionLiteral
     *   | numericLiteral
     *   | bigintLiteral
     *   ;
     * ```
     * @param ctx 
     */
    visitLiteralExpression(ctx: RuleContext) {
        this.log(ctx, Trace.frame())
        this.assertType(ctx, ECMAScriptParser.LiteralExpressionContext)
        this.assertNodeCount(ctx, 1)

        const node = ctx.getChild(0)
        if (node instanceof ECMAScriptParser.LiteralContext) {
            return this.visitLiteral(node)
        } else if (node instanceof ECMAScriptParser.NumericLiteralContext) {
            return this.visitNumericLiteral(node)
        }
        this.throwInsanceError(this.dumpContext(node))
    }

    /**
     *  Visit a parse tree produced by ECMAScriptParser#ArrayLiteralExpression.
     * 
     * ```
     *  arrayLiteral
     *    : ('[' elementList ']')
     *    ;
     * ```
     * @param ctx 
     */
    visitArrayLiteralExpression(ctx: RuleContext): Node.ArrayExpression {
        this.log(ctx, Trace.frame())
        this.assertType(ctx, ECMAScriptParser.ArrayLiteralExpressionContext)
        this.assertNodeCount(ctx, 1)
        const node = ctx.getChild(0)
        const elements = this.visitArrayLiteral(node)

        return new ArrayExpression(elements)
    }

    /**
     * Visit a parse tree produced by ECMAScriptParser#MemberDotExpression.
     * 
     * computed = false `x.z`
     * computed = true `y[1]`
     */
    visitMemberDotExpression(ctx: RuleContext): Node.StaticMemberExpression {
        this.log(ctx, Trace.frame())
        this.assertType(ctx, ECMAScriptParser.MemberDotExpressionContext)
        this.assertNodeCount(ctx, 3)

        const expr = this.singleExpression(ctx.getChild(0))
        const property = this.visitIdentifierName(ctx.getChild(2))

        return new Node.StaticMemberExpression(expr, property)
    }

    /**
     * Visit a parse tree produced by ECMAScriptParser#MemberIndexExpression.
     * 
     * ```
     * | singleExpression '[' expressionSequence ']'                           # MemberIndexExpression
     * ```
     * @param ctx 
     */
    visitMemberIndexExpression(ctx: RuleContext): Node.ComputedMemberExpression {
        this.log(ctx, Trace.frame())
        this.assertType(ctx, ECMAScriptParser.MemberIndexExpressionContext)
        this.assertNodeCount(ctx, 4)
        const expr = this.singleExpression(ctx.getChild(0))
        const property = this.coerceToExpressionOrSequence(this.visitExpressionSequence(ctx.getChild(2)))

        return new ComputedMemberExpression(expr, property)
    }

    /**
     * Visit a parse tree produced by ECMAScriptParser#IdentifierExpression.
     * 
     * ```
     * | identifier                                                            # IdentifierExpression
     * ```
     * @param ctx 
     */
    visitIdentifierExpression(ctx: RuleContext): Node.Identifier {
        this.log(ctx, Trace.frame())
        this.assertType(ctx, ECMAScriptParser.IdentifierExpressionContext)
        this.assertNodeCount(ctx, 1)
        const initialiser = ctx.getChild(0)
        const name = initialiser.getText()

        return new Node.Identifier(name)
    }

    // Visit a parse tree produced by ECMAScriptParser#identifier.
    visitIdentifier(ctx: RuleContext): Node.Identifier {
        this.log(ctx, Trace.frame())
        this.assertType(ctx, ECMAScriptParser.IdentifierContext)
        return new Node.Identifier(ctx.getChild(0).getText())
    }

    // Visit a parse tree produced by ECMAScriptParser#BitAndExpression.
    visitBitAndExpression(ctx: RuleContext) {
        console.trace('not implemented')
    }

    // Visit a parse tree produced by ECMAScriptParser#BitOrExpression.
    visitBitOrExpression(ctx: RuleContext) {
        console.trace('not implemented')
    }

    /**
     * Visit a parse tree produced by ECMAScriptParser#AssignmentOperatorExpression.
     * 
     * ```
     * <assoc=right> singleExpression assignmentOperator singleExpression    # AssignmentOperatorExpression
     * ```
     * @param ctx 
     */
    visitAssignmentOperatorExpression(ctx: RuleContext): Node.AssignmentExpression {
        this.log(ctx, Trace.frame())
        this.assertType(ctx, ECMAScriptParser.AssignmentOperatorExpressionContext)
        this.assertNodeCount(ctx, 3)
        const initialiser = ctx.getChild(0)
        const operator = ctx.getChild(1).getText()
        const expression = ctx.getChild(2)
        const lhs = this.singleExpression(initialiser)
        const rhs = this.singleExpression(expression)

        // | <assoc=right> singleExpression '=' singleExpression                   # AssignmentExpression



        return new Node.AssignmentExpression(operator, lhs, rhs)
    }

    /**
     * Visit a parse tree produced by ECMAScriptParser#VoidExpression.
     * 
     * ```
     *  | Void singleExpression                                                 # VoidExpression
     * ```
     * @param ctx 
     */
    visitVoidExpression(ctx: RuleContext): Node.UnaryExpression {
        this.log(ctx, Trace.frame())
        this.assertType(ctx, ECMAScriptParser.VoidExpressionContext)
        return new Node.UnaryExpression("void", this.singleExpression(ctx.singleExpression()))
    }

    /**
     * Visit a parse tree produced by ECMAScriptParser#assignmentOperator.
     * 
     * ```
     * | <assoc=right> singleExpression assignmentOperator singleExpression    # AssignmentOperatorExpression
     * ```
     * @param ctx 
     */
    visitAssignmentOperator(ctx: RuleContext) {
        console.info("visitAssignmentOperator [%s] : [%s]", ctx.getChildCount(), ctx.getText())
        throw new Error("not implemented")
    }

    /**
     * Visit a parse tree produced by ECMAScriptParser#literal.
     * 
     * `numericLiteral` and  `bigintLiteral` are production rules, everthing else is a `TerminalNode`
     * We inspect Token type to figure out what type of literal we are working with
     * 
     * ```
     * literal
     *   : NullLiteral
     *   | BooleanLiteral
     *   | StringLiteral
     *   | TemplateStringLiteral
     *   | RegularExpressionLiteral
     *   | numericLiteral
     *   | bigintLiteral
     *   ;
     * ```
     * @param ctx 
     */
    visitLiteral(ctx: RuleContext): Node.Literal | Node.TemplateLiteral | Node.RegexLiteral {
        this.log(ctx, Trace.frame())
        this.assertType(ctx, ECMAScriptParser.LiteralContext)
        this.assertNodeCount(ctx, 1)
        const node: RuleContext = ctx.getChild(0)
        if (node.getChildCount() == 0) {
            const symbol = node.symbol
            const state = symbol.type
            const raw = node.getText()
            switch (state) {
                case ECMAScriptParser.NullLiteral:
                    return this.createLiteralValue(node, null, "null")
                case ECMAScriptParser.BooleanLiteral:
                    return this.createLiteralValue(node, raw === 'true', raw)
                case ECMAScriptParser.StringLiteral:
                    return this.createLiteralValue(node, raw.replace(/"/g, "").replace(/'/g, ""), raw)
                case ECMAScriptParser.TemplateStringLiteral:
                    return this.createTemplateLiteral(node)
                case ECMAScriptParser.RegularExpressionLiteral:
                    return this.createRegularExpressionLiteral(node)
            }
        }

        if (node instanceof ECMAScriptParser.NumericLiteralContext) {
            return this.visitNumericLiteral(node)
        } else if (node instanceof ECMAScriptParser.BigintLiteralContext) {
            return this.visitBigintLiteral(node)
        }

        this.throwInsanceError(this.dumpContext(node))
    }

    // Visit a parse tree produced by ECMAScriptParser#numericLiteral.
    visitNumericLiteral(ctx: RuleContext): Node.Literal {
        this.log(ctx, Trace.frame())
        this.assertType(ctx, ECMAScriptParser.NumericLiteralContext)
        this.assertNodeCount(ctx, 1)
        const value = ctx.getText()
        const literal = new Node.Literal(Number(value), value)
        return this.decorate(literal, this.asMarker(this.asMetadata(ctx.getSourceInterval())))
    }

    private createLiteralValue(ctx: RuleContext, value: boolean | number | string | null, raw: string): Node.Literal {
        const literal = new Literal(value, raw)
        return this.decorate(literal, this.asMarker(this.asMetadata(ctx.getSourceInterval())))
    }

    private createRegularExpressionLiteral(ctx: RuleContext): Node.RegexLiteral {
        // (value: RegExp, raw: string, pattern: string, flags: string)
        const txt = ctx.getText()
        const raw = txt;
        const pattern = txt.substring(txt.indexOf('/') + 1, txt.lastIndexOf('/'))
        const flags = txt.substring(txt.lastIndexOf('/') + 1)
        return new RegexLiteral(new RegExp("", ""), raw, pattern, flags)
    }

    private createTemplateLiteral(ctx: RuleContext): Node.TemplateLiteral {
        const expressions: Node.Expression[] = [];
        const quasis: Node.TemplateElement[] = [];

        throw new TypeError("Not implemented")
        // return new Node.TemplateLiteral(quasis, expressions)
    }

    // Visit a parse tree produced by ECMAScriptParser#identifierName.
    visitIdentifierName(ctx: RuleContext): Node.Identifier {
        this.log(ctx, Trace.frame())
        this.assertType(ctx, ECMAScriptParser.IdentifierNameContext)
        this.assertNodeCount(ctx, 1)
        const value = ctx.getText()
        const identifier = new Node.Identifier(value)
        return this.decorate(identifier, this.asMarker(this.asMetadata(ctx.getSourceInterval())))
    }

    // Visit a parse tree produced by ECMAScriptParser#reservedWord.
    visitReservedWord(ctx: RuleContext) {
        console.info("visitReservedWord: " + ctx.getText())
    }

    // Visit a parse tree produced by ECMAScriptParser#keyword.
    visitKeyword(ctx: RuleContext) {
        console.info("visitKeyword: " + ctx.getText())
    }

    // Visit a parse tree produced by ECMAScriptParser#futureReservedWord.
    visitFutureReservedWord(ctx: RuleContext) {
        console.trace('not implemented')
    }

    // Visit a parse tree produced by ECMAScriptParser#getter.
    visitGetter(ctx: RuleContext) {
        console.trace('not implemented')
    }
    // Visit a parse tree produced by ECMAScriptParser#setter.
    visitSetter(ctx: RuleContext) {
        console.trace('not implemented')
    }

    // Visit a parse tree produced by ECMAScriptParser#eos.
    visitEos(ctx: RuleContext) {
        //console.trace('not implemented')
    }

    // Visit a parse tree produced by ECMAScriptParser#eof.
    visitEof(ctx: RuleContext) {
        console.trace('not implemented')
    }
}