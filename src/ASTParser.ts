/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import * as antlr4 from "antlr4"
import { ECMAScriptParserVisitor as DelvenVisitor } from "./parser/ECMAScriptParserVisitor"
import { ECMAScriptParser as DelvenParser, ECMAScriptParser } from "./parser/ECMAScriptParser"
import { ECMAScriptLexer as DelvenLexer } from "./parser/ECMAScriptLexer"
import { RuleContext } from "antlr4/RuleContext"
import { PrintVisitor } from "./PrintVisitor"
import { ExpressionStatement, Literal, Script, BlockStatement, Statement, SequenceExpression, ThrowStatement, AssignmentExpression, Identifier, BinaryExpression, ArrayExpression, ObjectExpression, ObjectExpressionProperty, Property, PropertyKey, VariableDeclaration, VariableDeclarator, Expression, IfStatement, ComputedMemberExpression, StaticMemberExpression, ClassDeclaration, ClassBody, FunctionDeclaration, FunctionParameter, AsyncFunctionDeclaration, AssignmentPattern, BindingPattern, BindingIdentifier, ArrayExpressionElement, SpreadElement, ArrowFunctionExpression, LabeledStatement, RestElement, NewExpression, ArgumentListElement, ThisExpression, FunctionExpression, AsyncFunctionExpression, UnaryExpression, UpdateExpression, WhileStatement, DoWhileStatement, ContinueStatement, BreakStatement, ReturnStatement, ArrayPattern, ObjectPattern, CallExpression, TemplateLiteral, RegexLiteral, TemplateElement } from "./nodes";
import * as Node from "./nodes";
import { type } from "os"
import * as fs from "fs"
import { Interval } from "antlr4"
import Trace, { CallSite } from "./trace"

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

        let chars = new antlr4.InputStream(code)
        let lexer = new DelvenLexer(chars)
        let tokens = new antlr4.CommonTokenStream(lexer)
        let parser = new DelvenParser(tokens)
        let tree = parser.program()
        // console.info(tree.toStringTree())
        tree.accept(new PrintVisitor())
        console.info("---------------------")
        let result = tree.accept(this.visitor)
        return result;
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
        let context = []
        for (var key in keys) {
            let name = keys[key];
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
            let child = ctx?.getChild(i)
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

    // Visit a parse tree produced by ECMAScriptParser#program.
    visitProgram(ctx: RuleContext): Node.Script {
        this.log(ctx, Trace.frame())
        this.assertType(ctx, ECMAScriptParser.ProgramContext)
        // visitProgram ->visitSourceElements -> visitSourceElement -> visitStatement
        const statements = [];
        const node = ctx.getChild(0)  // visitProgram ->visitSourceElements 
        for (let i = 0; i < node.getChildCount(); ++i) {
            const stm = node.getChild(i).getChild(0) // SourceElementsContext > StatementContext
            if (stm instanceof ECMAScriptParser.StatementContext) {
                const statement = this.visitStatement(stm)
                statements.push(statement)
            } else {
                this.throwInsanceError(this.dumpContext(stm))
            }
        }
        const interval = ctx.getSourceInterval()
        const script = new Node.Script(statements)
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
    visitStatement(ctx: RuleContext): any {
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
            // NOOP,
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
        } else if (node instanceof ECMAScriptParser.FunctionExpressionContext) {
            return this.visitFunctionExpression(node, true)
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

    visitImportStatement(ctx: RuleContext): any {
        this.log(ctx, Trace.frame())
        this.assertType(ctx, ECMAScriptParser.ImportStatementContext)
        throw new TypeError("not implemented")
    }

    visitExportStatement(ctx: RuleContext): any {
        this.log(ctx, Trace.frame())
        this.assertType(ctx, ECMAScriptParser.ExportStatementContext)
        throw new TypeError("not implemented")
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

        if (ctx instanceof ECMAScriptParser.WhileStatementContext) {
            return this.visitWhileStatement(ctx)
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
     *  statementList
     *    : statement+
     *    ;
     * @param ctx 
     */
    visitStatementList(ctx: RuleContext) {
        this.log(ctx, Trace.frame())
        this.assertType(ctx, ECMAScriptParser.StatementListContext)
        const nodes = this.filterSymbols(ctx)
        const body = [];
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
     * Example
     * <code>
     *   const node = this.getTypedRuleContext(ctx, ECMAScriptParser.VariableDeclarationListContext)
     * </code>
     * @param ctx 
     * @param type 
     * @param index 
     */
    private getTypedRuleContext(ctx: RuleContext, type: any, index = 0): any {
        return ctx.getTypedRuleContext(type, index)
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
    visitEmptyStatement(ctx: RuleContext) {
        this.log(ctx, Trace.frame())
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
    visitExpressionStatement(ctx: RuleContext): Node.ExpressionStatement | undefined {
        console.info("visitExpressionStatement [%s] : %s", ctx.getChildCount(), ctx.getText())
        this.assertType(ctx, ECMAScriptParser.ExpressionStatementContext)
        // visitExpressionStatement:>visitExpressionSequence
        const node: RuleContext = ctx.getChild(0) // visitExpressionSequence 
        let exp
        if (node instanceof ECMAScriptParser.ExpressionSequenceContext) {
            exp = this.visitExpressionSequence(node)
        } else {
            this.throwInsanceError(this.dumpContext(node))
        }

        return exp //this.decorate(exp, this.asMarker(this.asMetadata(ctx.getSourceInterval())))
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
        const test = this.coerceToExpression(sequence)

        return new Node.IfStatement(test, consequent, alternate)
    }

    // Visit a parse tree produced by ECMAScriptParser#DoStatement.
    visitDoStatement(ctx: RuleContext) {
        console.info("visitDoStatement: " + ctx.getText())
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
        const test: Node.Expression = this.coerceToExpressionOrThrow(this.visitExpressionSequence(ctx.expressionSequence()))
        const body: Node.Statement = this.visitStatement(ctx.statement())

        return new Node.WhileStatement(test, body)
    }

    // Visit a parse tree produced by ECMAScriptParser#ForStatement.
    visitForStatement(ctx: RuleContext) {
        console.info("visitWhileStatement: " + ctx.getText())
    }

    // Visit a parse tree produced by ECMAScriptParser#ForVarStatement.
    visitForVarStatement(ctx: RuleContext) {
        console.trace('not implemented')
    }

    // Visit a parse tree produced by ECMAScriptParser#ForInStatement.
    visitForInStatement(ctx: RuleContext) {
        console.trace('not implemented')
    }

    // Visit a parse tree produced by ECMAScriptParser#ForVarInStatement.
    visitForVarInStatement(ctx: RuleContext) {
        console.trace('not implemented')
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
            expression = this.unrollExpressionSequence(this.visitExpressionSequence(ctx.expressionSequence()))
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
     * Grammar : 
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
        let discriminant: Node.Expression
        let cases: Node.SwitchCase[] = []
        if (sequence instanceof Node.ExpressionStatement) {
            discriminant = sequence.expression
        } else {
            throw new TypeError("Type not handled : " + sequence)
        }

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
        this.dumpContextAllChildren(casesCtx)
        const switches: Node.SwitchCase[] = []
        this.visitCaseClauses(casesCtx)
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
        let test: Expression | null  = null
        let consequent:Statement;

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
    visitDefaultClause(ctx: RuleContext) {
        console.trace('not implemented')
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


    // Visit a parse tree produced by ECMAScriptParser#throwStatement.
    visitThrowStatement(ctx: RuleContext) {
        console.trace('not implemented')
    }


    // Visit a parse tree produced by ECMAScriptParser#tryStatement.
    visitTryStatement(ctx: RuleContext) {
        console.trace('not implemented')

    }


    // Visit a parse tree produced by ECMAScriptParser#catchProduction.
    visitCatchProduction(ctx: RuleContext) {
        console.trace('not implemented')

    }


    // Visit a parse tree produced by ECMAScriptParser#finallyProduction.
    visitFinallyProduction(ctx: RuleContext) {
        console.trace('not implemented')

    }

    // Visit a parse tree produced by ECMAScriptParser#debuggerStatement.
    visitDebuggerStatement(ctx: RuleContext) {
        console.trace('not implemented')

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

    functionDeclaration(ctx: RuleContext): FunctionDeclaration | AsyncFunctionDeclaration {
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
     * functionBody
     *  : sourceElements?
     *  ;
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
     *  sourceElements
     *    : sourceElement+
     *    ;
     * @param ctx 
     */
    visitSourceElements(ctx: RuleContext): any[] {
        this.log(ctx, Trace.frame())
        this.assertType(ctx, ECMAScriptParser.SourceElementsContext)
        const statements = []
        for (const node of ctx.sourceElement()) {
            const statement = this.visitStatement(node.statement())
            console.info(statement)
            statements.push(statement)
        }
        return statements;
    }


    /**
     * Visit a parse tree produced by ECMAScriptParser#arrayLiteral.
     * 
     * arrayLiteral
     *  : ('[' elementList ']')
     *  ;
     * @param ctx 
     */
    visitArrayLiteral(ctx: RuleContext): Node.ArrayExpressionElement[] {
        this.log(ctx, Trace.frame())
        this.assertType(ctx, ECMAScriptParser.ArrayLiteralContext)
        const elementListContext = this.getTypedRuleContext(ctx, ECMAScriptParser.ElementListContext)
        const elements: Node.ArrayExpressionElement[] = this.visitElementList(elementListContext)
        return elements;

    }

    /**
     * Visit a parse tree produced by ECMAScriptParser#elementList.
     * 
     * elementList
     *  : ','* arrayElement? (','+ arrayElement)* ','* // Yes, everything is optional
     *  ;
     * @param ctx 
     */
    visitElementList(ctx: RuleContext): Node.ArrayExpressionElement[] {
        this.log(ctx, Trace.frame())
        this.assertType(ctx, ECMAScriptParser.ElementListContext)
        const elements: Node.ArrayExpressionElement[] = [];

        let lastTokenWasComma = false;

        for (const node of this.iterable(ctx)) {
            //ellison check
            if (node.symbol != null) {
                // compliance: esprima compliane of returning `null` 
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
     * arrayElement
     *  : Ellipsis? singleExpression
     *  ;
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
            let property: Node.ObjectExpressionProperty = undefined;
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
     *  | Ellipsis? singleExpression                                                    # PropertyShorthand
     * @param ctx 
     */
    visitPropertyShorthand(ctx: RuleContext): Node.ObjectExpressionProperty {
        this.log(ctx, Trace.frame())
        this.assertType(ctx, ECMAScriptParser.PropertyShorthandContext)
        const computed = false;
        const method = false;
        const shorthand = true;
        const value = this.singleExpression(ctx.getChild(0))
        const key: Node.PropertyKey = new Identifier(ctx.getText())
        // unroll declaration in to an expression

        return new Node.Property("init", key, computed, value, method, shorthand)
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
                        return this.createLiteralValue(node, raw.replace(/"/g, "").replace(/'/g, ""), raw)
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
    singleExpression(node: RuleContext, isStatement = true): Node.Expression{

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
            return this.visitFunctionExpression(node, isStatement)
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
     * 
     *  assignable
     *    : identifier
     *    | arrayLiteral
     *    | objectLiteral
     *    ; 
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

    /**
     * Evaluate binary expression.
     * This applies to following types
     * LogicalAndExpressionContext
     * LogicalOrExpressionContext
     * @param ctx 
     */
    _binaryExpression(ctx: RuleContext): Node.BinaryExpression {
        let lhs = this._visitBinaryExpression(ctx.getChild(0))
        let operator = ctx.getChild(1).getText()
        let rhs = this._visitBinaryExpression(ctx.getChild(2))
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

    // Visit a parse tree produced by ECMAScriptParser#InExpression.
    visitInExpression(ctx: RuleContext) {
        console.trace('not implemented')

    }

    // Visit a parse tree produced by ECMAScriptParser#NotExpression.
    visitNotExpression(ctx: RuleContext) {
        console.trace('not implemented')
    }

    /**
     * Visit a parse tree produced by ECMAScriptParser#ArgumentsExpression.
     * 
     * | singleExpression arguments                # ArgumentsExpression
     * @param ctx 
     */
    visitArgumentsExpression(ctx: RuleContext): Node.CallExpression {
        this.log(ctx, Trace.frame())
        this.assertType(ctx, ECMAScriptParser.ArgumentsExpressionContext)
        const arg = ctx.arguments()
        const callee = this.singleExpression(ctx.singleExpression())
        let args: Node.ArgumentListElement[] = [];
        if (arg) {
            args = this.visitArguments(arg)
        }
        // (callee: Expression | Import, args: ArgumentListElement[])
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
     * 
     * Visit a parse tree produced by ECMAScriptParser#FunctionExpression.
     * 
     *   anoymousFunction
     *       : functionDeclaration                                                       # FunctionDecl
     *       | Async? Function '*'? '(' formalParameterList? ')' '{' functionBody '}'    # AnoymousFunctionDecl
     *       | Async? arrowFunctionParameters '=>' arrowFunctionBody                     # ArrowFunction
     *       ;
     * @param ctx 
     * @param isStatement 
     */
    visitFunctionExpression(ctx: RuleContext, isStatement = true): Node.FunctionExpression | Node.FunctionDeclaration {
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

        // unroll into an expression 
        if (!isStatement) {
            // FunctionDeclaration | AsyncFunctionDeclaration 
            if (exp instanceof Node.AsyncFunctionDeclaration) {
                return new Node.AsyncFunctionExpression(exp.id, exp.params, exp.body)
            } else {
                return new Node.FunctionExpression(exp.id, exp.params, exp.body, exp.generator)
            }
        }

        return exp;
    }


    // Visit a parse tree produced by ECMAScriptParser#functionDecl
    visitAnoymousFunctionDecl(ctx: RuleContext): Node.FunctionDeclaration {
        this.log(ctx, Trace.frame())
        this.assertType(ctx, ECMAScriptParser.AnoymousFunctionDeclContext)
        return this.functionDeclaration(ctx)
    }

    // Visit a parse tree produced by ECMAScriptParser#functionDecl
    visitArrowFunction(ctx: RuleContext): Node.ArrowFunctionExpression {
        this.log(ctx, Trace.frame())
        this.assertType(ctx, ECMAScriptParser.ArrowFunctionContext)
        const paramContext = this.getTypedRuleContext(ctx, ECMAScriptParser.ArrowFunctionParametersContext)
        const bodyContext = this.getTypedRuleContext(ctx, ECMAScriptParser.ArrowFunctionBodyContext)
        const params = this.visitArrowFunctionParameters(paramContext)
        const body = this.visitArrowFunctionBody(bodyContext)
        const expression = false;
        return new Node.ArrowFunctionExpression(params, body, expression)
    }

    /**
     * arrowFunctionParameters
     *  : identifier
     *  | '(' formalParameterList? ')'
     *  ;
     * @param ctx 
     */
    visitArrowFunctionParameters(ctx: RuleContext): Node.FunctionParameter[] {
        this.log(ctx, Trace.frame())
        this.assertType(ctx, ECMAScriptParser.ArrowFunctionParametersContext)
        // got only two ()
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
            const node = ctx.getChild(i)
            if (node.symbol) {
                const txt = node.getText()
                if (txt == 'async') {
                    async = true
                } else if (txt == '*') {
                    generator = true
                }
            }
            if (node instanceof ECMAScriptParser.IdentifierContext) {
                identifier = this.visitIdentifier(node)
            } else if (node instanceof ECMAScriptParser.FormalParameterListContext) {
                params = this.visitFormalParameterList(node)
            } else if (node instanceof ECMAScriptParser.FunctionBodyContext) {
                // body = this.visitFunctionBody(node)
                console.info("ECMAScriptParser ;; FormalParameterListContext")
            }
            this.dumpContextAllChildren(node)
        }

        console.info('async  = ' + async)
        console.info('generator  = ' + generator)
        */
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
     *
     *  arrowFunctionBody
     *   : '{' functionBody '}' 
     *   | singleExpression
     *   ;
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
                type ParenthesizedExpression = Node.ExpressionStatement | Node.SequenceExpression
                const parametized: ParenthesizedExpression = this.visitParenthesizedExpression(node)
                // compliance espree : this function returns ExpressionStatement or ExpressionSequenceContext
                // unwinding ExpressionStatement to to simply return 
                if (parametized instanceof Node.ExpressionStatement) {
                    return parametized.expression;
                } else //if (parametized instanceof Node.SequenceExpression) 
                {
                    return parametized;
                }
            }
        }
        throw new TypeError("Unknown type for : " + ctx)
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
        const lhs = this.singleExpression(initialiser, false)
        const rhs = this.singleExpression(expression, false)

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

    // Visit a parse tree produced by ECMAScriptParser#DeleteExpression.
    visitDeleteExpression(ctx: RuleContext) {
        console.trace('not implemented')
    }

    // Visit a parse tree produced by ECMAScriptParser#EqualityExpression.
    visitEqualityExpression(ctx: RuleContext): Node.BinaryExpression {
        console.info("visitEqualityExpression [%s] : %s", ctx.getChildCount(), ctx.getText())
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
    private coerceToExpressionOrSequence(sequence: Node.SequenceExpression): Node.Expression | Node.SequenceExpression {        
        if(sequence.expressions) {
            if(sequence.expressions.length  == 1) {
                return sequence.expressions[0]
            }
        }
        return sequence;
    }

    
    /**
     * sequences that have only one node will be pulled up to `Node.Expression` otherwise we will throw an TypeError
     * complaince(esprima) 
     * 
     * @param sequence 
     */
    private coerceToExpression(sequence: Node.SequenceExpression): Node.Expression {        
        if(sequence.expressions) {
            if(sequence.expressions.length  == 1) {
                return sequence.expressions[0]
            }
        }
        throw new TypeError("Unable to coerce to expression from sequence")
    }


    /**
     * Visit a parse tree produced by ECMAScriptParser#ParenthesizedExpression.
     * 
     * ```
     *     | '(' expressionSequence ')'                                            # ParenthesizedExpression
     * ```
     * @param ctx 
     */
    visitParenthesizedExpression(ctx: RuleContext):  Node.Expression | Node.SequenceExpression {
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
        // return this.decorate(new BinaryExpression(operator, lhs ,rhs), this.asMarker(this.asMetadata(ctx.symbol)))
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
     * This rule is problematic as it will be consume by 
     * 
     * | New singleExpression arguments?    # NewExpression
     * @param ctx 
     */
    visitNewExpression(ctx: RuleContext): Node.NewExpression {
        this.log(ctx, Trace.frame())
        this.assertType(ctx, ECMAScriptParser.NewExpressionContext)
        const single = ctx.singleExpression()
        const arg = ctx.arguments()
        const callee = this.singleExpression(single)
        let args: Node.ArgumentListElement[] = [];
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
     * // computed = false `x.z`
     * // computed = true `y[1]`
     * // Visit a parse tree produced by ECMAScriptParser#MemberDotExpression.
     */
    visitMemberDotExpression(ctx: RuleContext): Node.StaticMemberExpression {
        this.log(ctx, Trace.frame())
        this.assertType(ctx, ECMAScriptParser.MemberDotExpressionContext)
        this.assertNodeCount(ctx, 3)
        const expr = this.singleExpression(ctx.getChild(0))
        const property = this.visitIdentifierName(ctx.getChild(2))
        return new Node.StaticMemberExpression(expr, property)
    }

    print(ctx: RuleContext): void {
        console.info(" *****  ")
        const visitor = new PrintVisitor()
        ctx.accept(visitor)
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
        const property = this.coerceToExpression(this.visitExpressionSequence(ctx.getChild(2)))

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
        // return this.decorate(new Identifier(name), this.asMarker(this.asMetadata(initialiser.symbol)))
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
     * <assoc=right> singleExpression assignmentOperator singleExpression    # AssignmentOperatorExpression
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