import * as antlr4 from "antlr4"
import { ECMAScriptParserVisitor as DelvenVisitor } from "./parser/ECMAScriptParserVisitor"
import { ECMAScriptParser as DelvenParser, ECMAScriptParser, ProgramContext } from "./parser/ECMAScriptParser"
import { ECMAScriptLexer as DelvenLexer } from "./parser/ECMAScriptLexer"
import { RuleContext } from "antlr4/RuleContext"
import { PrintVisitor } from "./PrintVisitor"
import ASTNode from "./ASTNode";
import { ExpressionStatement, Literal, Script, BlockStatement, Statement, SequenceExpression, ThrowStatement, AssignmentExpression, Identifier, BinaryExpression, ArrayExpression, ObjectExpression, ObjectExpressionProperty, Property, PropertyKey, VariableDeclaration, VariableDeclarator, Expression, IfStatement, ComputedMemberExpression, StaticMemberExpression, ClassDeclaration, ClassBody, FunctionDeclaration, FunctionParameter, AsyncFunctionDeclaration, AssignmentPattern, BindingPattern, BindingIdentifier } from "./nodes";
import { Syntax } from "./syntax";
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
        this.visitor = visitor || new DelvenASTVisitor();
    }

    generate(source: SourceCode): ASTNode {
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
        let lexer = new DelvenLexer(chars);
        let tokens = new antlr4.CommonTokenStream(lexer);
        let parser = new DelvenParser(tokens);
        let tree = parser.program();
        // console.info(tree.toStringTree())
        tree.accept(new PrintVisitor());
        console.info("---------------------");
        let result = tree.accept(this.visitor);
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
                parser = new ASTParserDefault();
                break;
            default:
                throw new Error("Unkown parser type");
        }
        return parser.generate(source)
    }
}

class ASTParserDefault extends ASTParser {

}

export class DelvenASTVisitor extends DelvenVisitor {
    private ruleTypeMap: Map<number, string> = new Map();

    constructor() {
        super();
        this.setupTypeRules();
    }

    private setupTypeRules() {
        const keys = Object.getOwnPropertyNames(DelvenParser);
        for (var key in keys) {
            let name = keys[key];
            if (name.startsWith('RULE_')) {
                this.ruleTypeMap.set(parseInt(DelvenParser[name]), name)
            }
        }
    }

    private log(ctx: RuleContext, frame: CallSite) {
        console.info("%s [%s] : %s", frame.function, ctx.getChildCount(), ctx.getText());
    }

    private dumpContext(ctx: RuleContext) {
        const keys = Object.getOwnPropertyNames(DelvenParser);
        let context = []
        for (var key in keys) {
            let name = keys[key];
            // this only test inheritance
            if (name.endsWith('Context')) {
                if (ctx instanceof DelvenParser[name]) {
                    context.push(name);
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
        const pad = " ".padStart(indent, "\t");
        const nodes = this.dumpContext(ctx);
        if (nodes.length > 0) {
            const marker = indent == 0 ? " # " : " * ";
            console.info(pad + marker + nodes)
        }
        for (let i = 0; i < ctx.getChildCount(); ++i) {
            let child = ctx?.getChild(i);
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
    getRuleById(id: number): string | undefined {
        return this.ruleTypeMap.get(id);
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
        throw new TypeError("Unhandled type : " + typeId + " : " + this.getRuleById(typeId));
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
        throw new TypeError("Unhandled instance type : " + type);
    }

    private assertType(ctx: RuleContext, type: any): void {
        if (!(ctx instanceof type)) {
            throw new TypeError("Invalid type expected : '" + type.name + "' received '" + this.dumpContext(ctx)) + "'";
        }
    }

    // Visit a parse tree produced by ECMAScriptParser#program.
    visitProgram(ctx: RuleContext): Script {
        this.log(ctx, Trace.frame())
        this.assertType(ctx, ECMAScriptParser.ProgramContext)
        // visitProgram ->visitSourceElements -> visitSourceElement -> visitStatement
        const statements = [];
        const node = ctx.getChild(0);  // visitProgram ->visitSourceElements 
        for (let i = 0; i < node.getChildCount(); ++i) {
            const stm = node.getChild(i).getChild(0); // SourceElementsContext > StatementContext
            if (stm instanceof ECMAScriptParser.StatementContext) {
                const statement = this.visitStatement(stm);
                statements.push(statement);
            } else {
                this.throwInsanceError(this.dumpContext(stm));
            }
        }
        const interval = ctx.getSourceInterval();
        const script = new Script(statements);
        return this.decorate(script, this.asMarker(this.asMetadata(interval)));
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
        const node: RuleContext = ctx.getChild(0);
        if (node instanceof ECMAScriptParser.BlockContext) {
            return this.visitBlock(node);
        } else if (node instanceof ECMAScriptParser.VariableStatementContext) {
            return this.visitVariableStatement(node);
        } else if (node instanceof ECMAScriptParser.ImportStatementContext) {
            return this.visitImportStatement(node);
        } else if (node instanceof ECMAScriptParser.ExportStatementContext) {
            return this.visitExportStatement(node);
        } else if (node instanceof ECMAScriptParser.EmptyStatementContext) {
            // NOOP,
        } else if (node instanceof ECMAScriptParser.ClassDeclarationContext) {
            return this.visitClassDeclaration(node);
        } else if (node instanceof ECMAScriptParser.ExpressionStatementContext) {
            return this.visitExpressionStatement(node);
        } else if (node instanceof ECMAScriptParser.IfStatementContext) {
            return this.visitIfStatement(node);
        } else if (node instanceof ECMAScriptParser.IterationStatementContext) {
            return this.visitIterationStatement(node);
        } else if (node instanceof ECMAScriptParser.ContinueStatementContext) {
            return this.visitContinueStatement(node);
        } else if (node instanceof ECMAScriptParser.BreakStatementContext) {
            return this.visitBreakStatement(node);
        } else if (node instanceof ECMAScriptParser.ReturnStatementContext) {
            return this.visitReturnStatement(node);
        } else if (node instanceof ECMAScriptParser.YieldStatementContext) {
            return this.visitYieldStatement(node);
        } else if (node instanceof ECMAScriptParser.WithStatementContext) {
            return this.visitWithStatement(node);
        } else if (node instanceof ECMAScriptParser.LabelledStatementContext) {
            return this.visitLabelledStatement(node);
        } else if (node instanceof ECMAScriptParser.SwitchStatementContext) {
            return this.visitSwitchStatement(node);
        } else if (node instanceof ECMAScriptParser.FunctionExpressionContext) {
            return this.visitFunctionExpression(node);
        } else if (node instanceof ECMAScriptParser.ThrowStatementContext) {
            return this.visitThrowStatement(node);
        } else if (node instanceof ECMAScriptParser.TryStatementContext) {
            return this.visitTryStatement(node);
        } else if (node instanceof ECMAScriptParser.DebuggerStatementContext) {
            return this.visitDebuggerStatement(node);
        } else if (node instanceof ECMAScriptParser.FunctionDeclarationContext) {
            return this.visitFunctionDeclaration(node);
        } else {
            this.throwInsanceError(this.dumpContext(node));
        }
    }

    visitImportStatement(ctx: RuleContext): any {
        this.log(ctx, Trace.frame())
        this.assertType(ctx, ECMAScriptParser.ImportStatementContext)
        throw new TypeError("not implemented");
    }

    visitExportStatement(ctx: RuleContext): any {
        this.log(ctx, Trace.frame())
        this.assertType(ctx, ECMAScriptParser.ExportStatementContext)
        throw new TypeError("not implemented");
    }

    visitIterationStatement(ctx: RuleContext): any {
        this.log(ctx, Trace.frame())
        this.assertType(ctx, ECMAScriptParser.IterationStatementContext)
        throw new TypeError("not implemented");
    }

    /**
     * Visit a parse tree produced by ECMAScriptParser#block.
     * /// Block :
     * ///     { StatementList? }
     */
    visitBlock(ctx: RuleContext): BlockStatement {
        console.info("visitBlock [%s] : %s", ctx.getChildCount(), ctx.getText());
        this.assertType(ctx, ECMAScriptParser.BlockContext)
        const body = [];
        for (let i = 1; i < ctx.getChildCount() - 1; ++i) {
            const node: RuleContext = ctx.getChild(i);
            if (node instanceof ECMAScriptParser.StatementListContext) {
                const statementList = this.visitStatementList(node);
                for (const index in statementList) {
                    body.push(statementList[index]);
                }
            } else {
                this.throwInsanceError(this.dumpContext(node));
            }
        }

        return this.decorate(new BlockStatement(body), this.asMarker(this.asMetadata(ctx.getSourceInterval())));
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
        const nodes = this.filterSymbols(ctx);
        console.info(nodes.length)
        const body = [];
        for (const node of nodes) {
            if (node instanceof ECMAScriptParser.StatementContext) {
                body.push(this.visitStatement(node));
            } else {
                this.throwTypeError(type);
            }
        }
        return body;
    }


    visitVariableStatement(ctx: RuleContext): VariableDeclaration {
        this.log(ctx, Trace.frame());
        this.assertType(ctx, ECMAScriptParser.VariableStatementContext)
        const node = this.getTypedRuleContext(ctx, ECMAScriptParser.VariableDeclarationListContext);
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
    private getTypedRuleContext(ctx: RuleContext, type: any, index = 0): any {
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
    visitVariableDeclarationList(ctx: RuleContext): VariableDeclaration {
        this.log(ctx, Trace.frame());
        this.assertType(ctx, ECMAScriptParser.VariableDeclarationListContext)
        const varModifierContext = this.getTypedRuleContext(ctx, ECMAScriptParser.VarModifierContext, 0);
        const varModifier = varModifierContext.getText();
        const declarations: VariableDeclarator[] = [];
        for (const node of this.filterSymbols(ctx)) {
            if (node instanceof ECMAScriptParser.VariableDeclarationContext) {
                declarations.push(this.visitVariableDeclaration(node))
            }
        }
        return new VariableDeclaration(declarations, varModifier);
    }

    /**
     *  Visit a parse tree produced by ECMAScriptParser#variableDeclaration.
     *  variableDeclaration
     *    : assignable ('=' singleExpression)? // ECMAScript 6: Array & Object Matching
     *    ;
     * @param ctx VariableDeclarationContext
     */
    // 
    visitVariableDeclaration(ctx: RuleContext): VariableDeclarator {
        this.log(ctx, Trace.frame())
        this.assertType(ctx, ECMAScriptParser.VariableDeclarationContext)
        const assignableContext = this.getTypedRuleContext(ctx, ECMAScriptParser.AssignableContext, 0);
        const assignable = this.visitAssignable(assignableContext);
        // console.info(assignable)
        let init = null;
        if (ctx.getChildCount() == 3) {
            init = this.singleExpression(ctx.getChild(2));
        }
        return new VariableDeclarator(assignable, init);
    }

    // Visit a parse tree produced by ECMAScriptParser#initialiser.
    visitInitialiser(ctx: RuleContext): ObjectExpression | ArrayExpression | undefined {
        console.info("visitInitialiser [%s] : %s", ctx.getChildCount(), ctx.getText());
        this.assertType(ctx, ECMAScriptParser.InitialiserContext)
        this.assertNodeCount(ctx, 2);
        const node: RuleContext = ctx.getChild(1);

        if (node instanceof ECMAScriptParser.ObjectLiteralExpressionContext) {
            return this.visitObjectLiteralExpression(node);
        } else if (node instanceof ECMAScriptParser.ArrayLiteralExpressionContext) {
            return this.visitArrayLiteralExpression(node);
        }
        this.throwInsanceError(this.dumpContext(node))
    }

    // Visit a parse tree produced by ECMAScriptParser#emptyStatement.
    visitEmptyStatement(ctx: RuleContext) {
        this.log(ctx, Trace.frame())
    }

    private assertNodeCount(ctx: RuleContext, count: number) {
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
    visitExpressionStatement(ctx: RuleContext): ExpressionStatement | undefined {
        console.info("visitExpressionStatement [%s] : %s", ctx.getChildCount(), ctx.getText());
        this.assertType(ctx, ECMAScriptParser.ExpressionStatementContext)
        // visitExpressionStatement:>visitExpressionSequence
        const node: RuleContext = ctx.getChild(0); // visitExpressionSequence 
        let exp
        if (node instanceof ECMAScriptParser.ExpressionSequenceContext) {
            exp = this.visitExpressionSequence(node);
        } else {
            this.throwInsanceError(this.dumpContext(node));
        }

        return exp //this.decorate(exp, this.asMarker(this.asMetadata(ctx.getSourceInterval())));
    }

    /**
     *
     * ifStatement
     *   : If '(' expressionSequence ')' statement ( Else statement )?
     *   ;
     */
    visitIfStatement(ctx: RuleContext): IfStatement {
        this.log(ctx, Trace.frame())
        this.assertType(ctx, ECMAScriptParser.IfStatementContext)
        const count = ctx.getChildCount();
        const test = this.visitExpressionSequence(ctx.getChild(2));
        const consequent = this.visitStatement(ctx.getChild(4));
        const alternate = count == 7 ? this.visitStatement(ctx.getChild(6)) : undefined;

        return new IfStatement(test, consequent, alternate);
    }

    // Visit a parse tree produced by ECMAScriptParser#DoStatement.
    visitDoStatement(ctx: RuleContext) {
        console.info("visitDoStatement: " + ctx.getText());
    }

    // Visit a parse tree produced by ECMAScriptParser#WhileStatement.
    visitWhileStatement(ctx: RuleContext) {
        console.info("visitWhileStatement: " + ctx.getText());
    }

    // Visit a parse tree produced by ECMAScriptParser#ForStatement.
    visitForStatement(ctx: RuleContext) {
        console.info("visitWhileStatement: " + ctx.getText());
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
    visitContinueStatement(ctx: RuleContext) {
        console.trace('not implemented')

    }

    // Visit a parse tree produced by ECMAScriptParser#breakStatement.
    visitBreakStatement(ctx: RuleContext) {
        console.trace('not implemented')

    }


    // Visit a parse tree produced by ECMAScriptParser#returnStatement.
    visitReturnStatement(ctx: RuleContext) {
        console.trace('not implemented')

    }


    // Visit a parse tree produced by ECMAScriptParser#withStatement.
    visitWithStatement(ctx: RuleContext) {
        console.trace('not implemented')

    }


    // Visit a parse tree produced by ECMAScriptParser#switchStatement.
    visitSwitchStatement(ctx: RuleContext) {
        console.trace('not implemented')

    }


    // Visit a parse tree produced by ECMAScriptParser#caseBlock.
    visitCaseBlock(ctx: RuleContext) {
        console.trace('not implemented')

    }


    // Visit a parse tree produced by ECMAScriptParser#caseClauses.
    visitCaseClauses(ctx: RuleContext) {
        console.trace('not implemented')

    }


    // Visit a parse tree produced by ECMAScriptParser#caseClause.
    visitCaseClause(ctx: RuleContext) {
        console.trace('not implemented')

    }


    // Visit a parse tree produced by ECMAScriptParser#defaultClause.
    visitDefaultClause(ctx: RuleContext) {
        console.trace('not implemented')

    }


    // Visit a parse tree produced by ECMAScriptParser#labelledStatement.
    visitLabelledStatement(ctx: RuleContext) {
        console.trace('not implemented')

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

    // Visit a parse tree produced by ECMAScriptParser#functionDeclaration.
    visitFunctionDeclaration(ctx: RuleContext): FunctionDeclaration | AsyncFunctionDeclaration {
        this.log(ctx, Trace.frame());
        this.assertType(ctx, ECMAScriptParser.FunctionDeclarationContext);
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
                console.info("ECMAScriptParser ;; IdentifierContext")
                identifier = this.visitIdentifier(node);
            } else if (node instanceof ECMAScriptParser.FormalParameterListContext) {
                console.info("ECMAScriptParser ;; FormalParameterListContext")
                params = this.visitFormalParameterList(node);
            } else if (node instanceof ECMAScriptParser.FunctionBodyContext) {
                // body = this.visitFunctionBody(node);
                console.info("ECMAScriptParser ;; FormalParameterListContext")
            }

            this.dumpContextAllChildren(node)
        }

        console.info('async  = ' + async);
        console.info('generator  = ' + generator);

        if (async) {
            return new AsyncFunctionDeclaration(identifier, params, body, generator);
        } else {
            //  constructor(id: Identifier | null, params: FunctionParameter[], body: BlockStatement, generator: boolean) {
            return new FunctionDeclaration(identifier, parmas, body, generator);
        }
    }

    // Visit a parse tree produced by ECMAScriptParser#functionDecl
    visitFunctionDecl(ctx: RuleContext): FunctionDeclaration {
        this.log(ctx, Trace.frame());
        this.assertType(ctx, ECMAScriptParser.FunctionDeclContext);
        return this.visitFunctionDeclaration(ctx.getChild(0))
    }

    // Visit a parse tree produced by ECMAScriptParser#functionBody.
    visitFunctionBody(ctx: RuleContext) {
        console.info("visitFunctionBody: " + ctx.getText());
    }


    // Visit a parse tree produced by ECMAScriptParser#arrayLiteral.
    visitArrayLiteral(ctx: RuleContext) {
        console.info("visitArrayLiteral [%s] : %s", ctx.getChildCount(), ctx.getText());
        this.assertType(ctx, ECMAScriptParser.ArrayLiteralContext)
        // we just got `[]`

        throw new Error("visitArrayLiteral not implemented")

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
    }

    // Visit a parse tree produced by ECMAScriptParser#elementList.
    visitElementList(ctx: RuleContext) {
        console.info("visitElementList [%s] : %s", ctx.getChildCount(), ctx.getText());
        this.assertType(ctx, ECMAScriptParser.ElementListContext)
        const elements = [];
        const nodes: RuleContext[] = this.filterSymbols(ctx);
        for (let i = 0; i < nodes.length; ++i) {
            const elem = this.singleExpression(nodes[i]);
            elements.push(elem);
        }
        return elements;
    }

    // Visit a parse tree produced by ECMAScriptParser#elision.
    visitElision(ctx: RuleContext) {
        console.info("visitElision [%s] : %s", ctx.getChildCount(), ctx.getText());
        this.assertType(ctx, ECMAScriptParser.ElisionContext)
        // compliance: esprima compliane or returning `null` 
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
    visitObjectLiteral(ctx: RuleContext): ObjectExpression {
        this.log(ctx, Trace.frame())
        this.assertType(ctx, ECMAScriptParser.ObjectLiteralContext);
        if (ctx.getChildCount() == 2) {
            return new ObjectExpression([]);
        }

        const nodes = this.filterSymbols(ctx);
        const properties: ObjectExpressionProperty[] = [];
        for (const node of nodes) {
            let property: ObjectExpressionProperty;
            if (node instanceof ECMAScriptParser.PropertyExpressionAssignmentContext) {
                property = this.visitPropertyExpressionAssignment(node);
            } else if (node instanceof ECMAScriptParser.PropertyShorthandContext) {
                property = this.visitPropertyShorthand(node);
            } else if (node instanceof ECMAScriptParser.FunctionPropertyContext) {
                property = this.visitFunctionProperty(node);
            } else {
                this.throwInsanceError(this.dumpContext(node))
            }

            if (property != undefined) {
                properties.push(property)
            }
        }
        return new ObjectExpression(properties);
    }

    /**
     * Visit a parse tree produced by ECMAScriptParser#propertyShorthand.
     *  | Ellipsis? singleExpression                                                    # PropertyShorthand
     * @param ctx 
     */
    visitPropertyShorthand(ctx: RuleContext): ObjectExpressionProperty {
        this.log(ctx, Trace.frame());
        this.assertType(ctx, ECMAScriptParser.PropertyShorthandContext)
        const computed = false;
        const method = false;
        const shorthand = true;
        const value = this.singleExpression(ctx.getChild(0));
        const key: PropertyKey =  new Identifier(ctx.getText())
        return new Property("init", key, computed, value, method, shorthand);
    }

    // Visit a parse tree produced by ECMAScriptParser#propertyShorthand.
    visitFunctionProperty(ctx: RuleContext): ObjectExpressionProperty {
        this.log(ctx, Trace.frame());
        this.assertType(ctx, ECMAScriptParser.FunctionPropertyContext)
        throw new TypeError("not implemented")
    }

    // Visit a parse tree produced by ECMAScriptParser#propertyNameAndValueList.
    visitPropertyNameAndValueList(ctx: RuleContext): ObjectExpressionProperty[] {
        console.info("visitPropertyNameAndValueList [%s] : %s", ctx.getChildCount(), ctx.getText());
        this.assertType(ctx, ECMAScriptParser.PropertyNameAndValueListContext);
        const properties: ObjectExpressionProperty[] = [];
        const nodes: RuleContext[] = this.filterSymbols(ctx);
        for (let i = 0; i < nodes.length; ++i) {
            const node = nodes[i];
            if (node instanceof ECMAScriptParser.PropertyExpressionAssignmentContext) {
                const property: ObjectExpressionProperty = this.visitPropertyExpressionAssignment(node);
                properties.push(property);
            } else {
                this.throwInsanceError(this.dumpContext(node))
            }
        }
        return properties;
    }

    /**
     * Filter out TerminalNodes (commas, pipes, brackets)
     * @param ctx 
     */
    private filterSymbols(ctx: RuleContext): RuleContext[] {
        const filtered: RuleContext[] = [];
        for (let i = 0; i < ctx.getChildCount(); ++i) {
            const node = ctx.getChild(i);
            // there might be a better way
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
    visitPropertyExpressionAssignment(ctx: RuleContext): ObjectExpressionProperty {
        this.log(ctx, Trace.frame());
        this.assertType(ctx, ECMAScriptParser.PropertyExpressionAssignmentContext);

        let node = ctx.getChild(0);

        this.dumpContextAllChildren(ctx)
        let n0 = ctx.getChild(0); // PropertyName
        let n1 = ctx.getChild(1); // symbol :
        let n2 = ctx.getChild(2); //  singleExpression 
        let key: PropertyKey = this.visitPropertyName(n0);
        let value;
        const computed = false;
        const method = false;
        const shorthand = false;

        if (n2 instanceof ECMAScriptParser.PropertyExpressionAssignmentContext) {
            console.info(' -- PropertyExpressionAssignmentContext')
            key = this.visitPropertyName(n0);
        } else if (n2 instanceof ECMAScriptParser.ComputedPropertyExpressionAssignmentContext) {
            console.info(' -- ComputedPropertyExpressionAssignmentContext')
        } else if (n2 instanceof ECMAScriptParser.FunctionPropertyContext) {
            console.info(' -- FunctionPropertyContext')
        } else if (n2 instanceof ECMAScriptParser.PropertyGetterContext) {
            console.info(' -- PropertyGetterContext')
        } else if (n2 instanceof ECMAScriptParser.PropertySetterContext) {
            console.info(' -- PropertySetterContext')
        } else if (n2 instanceof ECMAScriptParser.PropertyShorthandContext) {
            console.info(' -- PropertyShorthandContext')
        }
        // this.singleExpression(n2);

        return new Property("init", key, computed, value, method, shorthand);
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
     * propertyName
     *  : identifierName
     *  | StringLiteral
     *  | numericLiteral
     *  | '[' singleExpression ']'
     *  ;
     */
    visitPropertyName(ctx: RuleContext): PropertyKey {
        this.log(ctx, Trace.frame())
        this.assertType(ctx, ECMAScriptParser.PropertyNameContext);
        this.assertNodeCount(ctx, 1);
        const node = ctx.getChild(0);
        const count = node.getChildCount();

        if (count == 0) { // literal
            return this.createLiteralValue(node);
        } else if (count == 1) {
            return this.visitIdentifierName(node)
        }
        this.throwInsanceError(this.dumpContext(node));
    }

    // Visit a parse tree produced by ECMAScriptParser#propertySetParameterList.
    visitPropertySetParameterList(ctx: RuleContext) {
        console.trace('not implemented')

    }

    // Visit a parse tree produced by ECMAScriptParser#arguments.
    visitArguments(ctx: RuleContext) {
        console.info("visitArguments: " + ctx.getText());

    }

    // Visit a parse tree produced by ECMAScriptParser#argumentList.
    visitArgumentList(ctx: RuleContext) {
        console.info("visitArgumentList: " + ctx.getText());
    }

    // Visit a parse tree produced by ECMAScriptParser#expressionSequence.
    visitExpressionSequence(ctx: RuleContext): ExpressionStatement {
        this.log(ctx, Trace.frame())
        this.assertType(ctx, ECMAScriptParser.ExpressionSequenceContext);
        const expressions = [];
        // each node is a singleExpression
        for (const node of this.filterSymbols(ctx)) {
            // const node: RuleContext = ctx.getChild(i);
            const exp = this.singleExpression(node);
            expressions.push(exp);
        }

        // compliance: espirma, espree
        // this check to see if there are multiple expressions if so then we leave them as SequenceExpression 
        // otherwise we will roll them up into ExpressionStatement with one expression
        // `1` = ExpressionStatement -> Literal
        // `1, 2` = ExpressionStatement -> SequenceExpression -> Literal, Literal
        let exp;
        if (expressions.length == 1) {
            exp = new ExpressionStatement(expressions[0])
        } else {
            exp = new SequenceExpression(expressions);
        }
        return this.decorate(exp, this.asMarker(this.asMetadata(ctx.getSourceInterval())))
    }

    /**
     * Evaluate a singleExpression
     * @param node 
     */
    singleExpression(node: RuleContext): any {
        if (node instanceof ECMAScriptParser.LiteralExpressionContext) {
            return this.visitLiteralExpression(node);
        } else if (node instanceof ECMAScriptParser.ObjectLiteralExpressionContext) {
            return this.visitObjectLiteralExpression(node);
        } else if (node instanceof ECMAScriptParser.AssignmentExpressionContext) {
            return this.visitAssignmentExpression(node);
        } else if (node instanceof ECMAScriptParser.AdditiveExpressionContext) {
            return this.visitAdditiveExpression(node);
        } else if (node instanceof ECMAScriptParser.MultiplicativeExpressionContext) {
            return this.visitMultiplicativeExpression(node);
        } else if (node instanceof ECMAScriptParser.ArrayLiteralExpressionContext) {
            return this.visitArrayLiteralExpression(node);
        } else if (node instanceof ECMAScriptParser.EqualityExpressionContext) {
            return this.visitEqualityExpression(node);
        } else if (node instanceof ECMAScriptParser.ParenthesizedExpressionContext) {
            return this.visitParenthesizedExpression(node);
        } else if (node instanceof ECMAScriptParser.RelationalExpressionContext) {
            return this.visitRelationalExpression(node);
        } else if (node instanceof ECMAScriptParser.IdentifierExpressionContext) {
            return this.visitIdentifierExpression(node);
        } else if (node instanceof ECMAScriptParser.MemberDotExpressionContext) {
            return this.visitMemberDotExpression(node);
        } else if (node instanceof ECMAScriptParser.MemberIndexExpressionContext) {
            return this.visitMemberIndexExpression(node);
        } else if (node instanceof ECMAScriptParser.AssignmentOperatorExpressionContext) {
            return this.visitAssignmentOperatorExpression(node);
        } else if (node instanceof ECMAScriptParser.FunctionExpressionContext) {
            return this.visitFunctionExpression(node);
        }
        this.throwInsanceError(this.dumpContext(node));
    }

    // Visit a parse tree produced by ECMAScriptParser#classDeclaration.
    visitClassDeclaration(ctx: RuleContext): ClassDeclaration {
        this.log(ctx, Trace.frame());
        this.assertType(ctx, ECMAScriptParser.ClassDeclarationContext);
        // Class identifier classTail
        const identifier = this.visitIdentifier(ctx.getChild(1));
        const body: Property[] = this.visitClassTail(ctx.getChild(2))
        const classBody = new ClassBody(body);
        return new ClassDeclaration(identifier, null, classBody);
    }

    // Visit a parse tree produced by ECMAScriptParser#classTail.
    visitClassTail(ctx: RuleContext) {
        this.log(ctx, Trace.frame());
        this.assertType(ctx, ECMAScriptParser.ClassTailContext);
        //  (Extends singleExpression)? '{' classElement* '}'
        this.dumpContextAllChildren(ctx)
        const node = this.getNodeByType(ctx, ECMAScriptParser.ClassElementContext);
    }

    private getNodeByType(ctx: RuleContext, type: any) {
        for (let i = 0; i < ctx.getChildCount(); ++i) {
            if (ctx.getChild(i) instanceof type) {
                return ctx.getChild(i);
            }
        }
        return null;
    }


    // Visit a parse tree produced by ECMAScriptParser#classElement.
    visitClassElement(ctx: RuleContext) {
        this.log(ctx, Trace.frame());
    }


    // Visit a parse tree produced by ECMAScriptParser#methodDefinition.
    visitMethodDefinition(ctx: RuleContext) {
        this.log(ctx, Trace.frame());
    }


    // Visit a parse tree produced by ECMAScriptParser#formalParameterList.
    visitFormalParameterList(ctx: RuleContext): FunctionParameter[] {
        this.log(ctx, Trace.frame());
        this.assertType(ctx, ECMAScriptParser.FormalParameterListContext);
        const formal: FunctionParameter[] = []
        for (let i = 0; i < ctx.getChildCount(); ++i) {
            const node = ctx.getChild(i);
            if (node instanceof ECMAScriptParser.FormalParameterArgContext) {
                const parameter = this.visitFormalParameterArg(node);
                formal.push(parameter);
            }
        }
        return formal;
    }

    // Visit a parse tree produced by ECMAScriptParser#formalParameterArg.
    visitFormalParameterArg(ctx: RuleContext): AssignmentPattern {
        this.log(ctx, Trace.frame());
        this.assertType(ctx, ECMAScriptParser.FormalParameterArgContext);
        //    constructor(left: BindingIdentifier | BindingPattern, right: Expression)

        const count = ctx.getChildCount();
        if (count != 1 && count != 3) {
            this.throwInsanceError(this.dumpContext(ctx));
        }

        const assignable = this.visitAssignable(ctx.getChild(0));
        console.info(assignable)

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
        return new AssignmentPattern();
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
    visitAssignable(ctx: RuleContext): BindingIdentifier | BindingPattern {
        this.log(ctx, Trace.frame());
        this.assertType(ctx, ECMAScriptParser.AssignableContext);
        const assignable = ctx.getChild(0);
        if (assignable instanceof ECMAScriptParser.IdentifierContext) {
            return this.visitIdentifier(assignable);
        } else if (assignable instanceof ECMAScriptParser.ArrayLiteralContext) {
            console.info("((((  (((((")
        } else if (assignable instanceof ECMAScriptParser.ObjectLiteralContext) {
            console.info("((((  (((((")
        }
        this.throwInsanceError(this.dumpContext(ctx));
    }

    // Visit a parse tree produced by ECMAScriptParser#lastFormalParameterArg.
    visitLastFormalParameterArg(ctx: RuleContext) {
        this.log(ctx, Trace.frame());
    }

    // Visit a parse tree produced by ECMAScriptParser#TernaryExpression.
    visitTernaryExpression(ctx: RuleContext) {
        console.trace('not implemented')
    }

    // Visit a parse tree produced by ECMAScriptParser#LogicalAndExpression.
    visitLogicalAndExpression(ctx: RuleContext) {
        console.trace('not implemented')

    }


    // Visit a parse tree produced by ECMAScriptParser#PreIncrementExpression.
    visitPreIncrementExpression(ctx: RuleContext) {
        console.trace('not implemented')

    }

    /**
     * Visit a parse tree produced by ECMAScriptParser#ObjectLiteralExpression.
     * @param ctx 
     */
    visitObjectLiteralExpression(ctx: RuleContext): ObjectExpression {
        this.log(ctx, Trace.frame())
        this.assertType(ctx, ECMAScriptParser.ObjectLiteralExpressionContext);
        const node = ctx.getChild(0);
        const properties: ObjectExpressionProperty[] = this.visitObjectLiteral(node);

        return new ObjectExpression(properties);
    }


    // Visit a parse tree produced by ECMAScriptParser#InExpression.
    visitInExpression(ctx: RuleContext) {
        console.trace('not implemented')

    }


    // Visit a parse tree produced by ECMAScriptParser#LogicalOrExpression.
    visitLogicalOrExpression(ctx: RuleContext) {
        console.trace('not implemented')

    }


    // Visit a parse tree produced by ECMAScriptParser#NotExpression.
    visitNotExpression(ctx: RuleContext) {
        console.trace('not implemented')

    }


    // Visit a parse tree produced by ECMAScriptParser#PreDecreaseExpression.
    visitPreDecreaseExpression(ctx: RuleContext) {
        console.trace('not implemented')

    }


    // Visit a parse tree produced by ECMAScriptParser#ArgumentsExpression.
    visitArgumentsExpression(ctx: RuleContext) {
        console.info("visitArgumentsExpression: " + ctx.getText());


    }


    // Visit a parse tree produced by ECMAScriptParser#ThisExpression.
    visitThisExpression(ctx: RuleContext) {
        console.trace('not implemented')

    }


    // Visit a parse tree produced by ECMAScriptParser#FunctionExpression.
    visitFunctionExpression(ctx: RuleContext) {
        this.log(ctx, Trace.frame());
        this.assertType(ctx, ECMAScriptParser.FunctionExpressionContext);
        //  (Extends singleExpression)? '{' classElement* '}'
        this.dumpContextAllChildren(ctx)
        let decl = this.visitFunctionDecl(ctx.getChild(0))
        // const node = this.getNodeByType(ctx, ECMAScriptParser.ClassElementContext);
        console.info(decl)
    }


    // Visit a parse tree produced by ECMAScriptParser#UnaryMinusExpression.
    visitUnaryMinusExpression(ctx: RuleContext) {
        console.trace('not implemented')

    }


    // Visit a parse tree produced by ECMAScriptParser#PostDecreaseExpression.
    visitPostDecreaseExpression(ctx: RuleContext) {
        console.trace('not implemented')
    }

    /**
     * Visit a parse tree produced by ECMAScriptParser#AssignmentExpression.
     * 
     * <assoc=right> singleExpression '=' singleExpression                   # AssignmentExpression
     * @param ctx 
     */
    visitAssignmentExpression(ctx: RuleContext): AssignmentExpression {
        this.log(ctx, Trace.frame())
        this.assertType(ctx, ECMAScriptParser.AssignmentExpressionContext);
        this.assertNodeCount(ctx, 3)

        const initialiser = ctx.getChild(0);
        const operator = ctx.getChild(1).getText(); // No type ( = )
        const expression = ctx.getChild(2);
        const lhs = this.singleExpression(initialiser);
        const rhs = this.singleExpression(expression);

        // Compliance : pulling up ExpressionStatement into AssigementExpression
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
    visitEqualityExpression(ctx: RuleContext): BinaryExpression {
        console.info("visitEqualityExpression [%s] : %s", ctx.getChildCount(), ctx.getText());
        this.assertType(ctx, ECMAScriptParser.EqualityExpressionContext);
        this.assertNodeCount(ctx, 3)

        let left = ctx.getChild(0);
        let operator = ctx.getChild(1).getText(); // No type ( +,- )
        let right = ctx.getChild(2);
        let lhs = this._visitBinaryExpression(left);
        let rhs = this._visitBinaryExpression(right);

        return this.decorate(new BinaryExpression(operator, lhs, rhs), {});
    }


    // Visit a parse tree produced by ECMAScriptParser#BitXOrExpression.
    visitBitXOrExpression(ctx: RuleContext) {
        console.trace('not implemented')

    }


    // Visit a parse tree produced by ECMAScriptParser#MultiplicativeExpression.
    visitMultiplicativeExpression(ctx: RuleContext): BinaryExpression {
        console.info("visitMultiplicativeExpression [%s] : %s", ctx.getChildCount(), ctx.getText());
        this.assertType(ctx, ECMAScriptParser.MultiplicativeExpressionContext);
        this.assertNodeCount(ctx, 3)

        let left = ctx.getChild(0);
        let operator = ctx.getChild(1).getText(); // No type ( +,- )
        let right = ctx.getChild(2);
        let lhs = this.visitBinaryExpression(left);
        let rhs = this.visitBinaryExpression(right);

        return this.decorate(new BinaryExpression(operator, lhs, rhs), {});
    }

    // Visit a parse tree produced by ECMAScriptParser#BitShiftExpression.
    visitBitShiftExpression(ctx: RuleContext) {
        console.trace('not implemented')

    }

    // Visit a parse tree produced by ECMAScriptParser#ParenthesizedExpression.
    visitParenthesizedExpression(ctx: RuleContext) {
        console.info("visitParenthesizedExpression [%s] : %s", ctx.getChildCount(), ctx.getText());
        this.assertType(ctx, ECMAScriptParser.ParenthesizedExpressionContext);
        this.assertNodeCount(ctx, 3)
        let left = ctx.getChild(0);
        let expression = ctx.getChild(1);
        let right = ctx.getChild(2);
        this.dumpContextAllChildren(expression)
        return this.visitExpressionSequence(expression);
    }

    // Visit a parse tree produced by ECMAScriptParser#AdditiveExpression.
    visitAdditiveExpression(ctx: RuleContext): BinaryExpression {
        console.info("visitAdditiveExpression [%s] : %s", ctx.getChildCount(), ctx.getText());
        this.assertType(ctx, ECMAScriptParser.AdditiveExpressionContext);
        this.assertNodeCount(ctx, 3)

        const left = ctx.getChild(0);
        const operator = ctx.getChild(1).getText(); // No type ( +,- )
        const right = ctx.getChild(2);
        const lhs = this._visitBinaryExpression(left);
        const rhs = this._visitBinaryExpression(right);
        // return this.decorate(new BinaryExpression(operator, lhs ,rhs), this.asMarker(this.asMetadata(ctx.symbol)));
        return new BinaryExpression(operator, lhs, rhs);
    }

    _visitBinaryExpression(ctx: RuleContext) {

        console.info("evalBinaryExpression [%s] : %s", ctx.getChildCount(), ctx.getText());
        if (ctx instanceof ECMAScriptParser.IdentifierExpressionContext) {
            return this.visitIdentifierExpression(ctx);
        } else if (ctx instanceof ECMAScriptParser.LiteralExpressionContext) {
            return this.visitLiteralExpression(ctx);
        } else if (ctx instanceof ECMAScriptParser.AdditiveExpressionContext) {
            return this.visitAdditiveExpression(ctx);
        } else if (ctx instanceof ECMAScriptParser.MultiplicativeExpressionContext) {
            return this.visitMultiplicativeExpression(ctx);
        } else if (ctx instanceof ECMAScriptParser.RelationalExpressionContext) {
            return this.visitRelationalExpression(ctx);
        }
        this.throwInsanceError(this.dumpContext(ctx));
    }

    // Visit a parse tree produced by ECMAScriptParser#RelationalExpression.
    visitRelationalExpression(ctx: RuleContext): BinaryExpression {
        console.info("visitRelationalExpression [%s] : %s", ctx.getChildCount(), ctx.getText());
        this.assertType(ctx, ECMAScriptParser.RelationalExpressionContext);
        this.assertNodeCount(ctx, 3)
        const left = ctx.getChild(0);
        const operator = ctx.getChild(1).getText(); // No type ( +,- )
        const right = ctx.getChild(2);
        const lhs = this._visitBinaryExpression(left);
        const rhs = this._visitBinaryExpression(right);
        // return this.decorate(new BinaryExpression(operator, lhs ,rhs), this.asMarker(this.asMetadata(ctx.symbol)));
        return new BinaryExpression(operator, lhs, rhs);
    }

    // Visit a parse tree produced by ECMAScriptParser#PostIncrementExpression.
    visitPostIncrementExpression(ctx: RuleContext) {
        console.trace('not implemented')
    }

    // Visit a parse tree produced by ECMAScriptParser#BitNotExpression.
    visitBitNotExpression(ctx: RuleContext) {
        console.trace('not implemented')

    }


    // Visit a parse tree produced by ECMAScriptParser#NewExpression.
    visitNewExpression(ctx: RuleContext) {
        console.trace('not implemented')

    }


    // Visit a parse tree produced by ECMAScriptParser#LiteralExpression.
    visitLiteralExpression(ctx: RuleContext) {
        console.info("visitLiteralExpression [%s] : [%s]", ctx.getChildCount(), ctx.getText());
        this.assertType(ctx, ECMAScriptParser.LiteralExpressionContext);
        this.assertNodeCount(ctx, 1);
        // visitLiteralExpression: > visitLiteral
        let node = ctx.getChild(0)
        if (node instanceof ECMAScriptParser.LiteralContext) {
            return this.visitLiteral(node);
        } else if (node instanceof ECMAScriptParser.NumericLiteralContext) {
            return this.visitNumericLiteral(node);
        }
        this.throwInsanceError(this.dumpContext(node));
    }

    // Visit a parse tree produced by ECMAScriptParser#ArrayLiteralExpression.
    visitArrayLiteralExpression(ctx: RuleContext): ArrayExpression {
        console.info("visitArrayLiteralExpression [%s] : %s", ctx.getChildCount(), ctx.getText());
        this.assertType(ctx, ECMAScriptParser.ArrayLiteralExpressionContext);
        this.assertNodeCount(ctx, 1);
        const node = ctx.getChild(0);
        const elements = this.visitArrayLiteral(node);
        return new ArrayExpression(elements);
    }

    /**
     * // computed = false `x.z`
     * // computed = true `y[1]`
     * // Visit a parse tree produced by ECMAScriptParser#MemberDotExpression.
     */
    visitMemberDotExpression(ctx: RuleContext): StaticMemberExpression {
        console.info("visitArrayLiteralExpression [%s] : %s", ctx.getChildCount(), ctx.getText());
        this.assertType(ctx, ECMAScriptParser.MemberDotExpressionContext);
        this.assertNodeCount(ctx, 3);
        const expr = this.singleExpression(ctx.getChild(0));
        const property = this.visitIdentifierName(ctx.getChild(2));
        return new StaticMemberExpression(expr, property);
    }

    print(ctx: RuleContext): void {
        console.info(" *****  ")
        const visitor = new PrintVisitor();
        ctx.accept(visitor);
    }

    // Visit a parse tree produced by ECMAScriptParser#MemberIndexExpression.
    visitMemberIndexExpression(ctx: RuleContext): ComputedMemberExpression {
        console.info("visitMemberIndexExpression [%s] : %s", ctx.getChildCount(), ctx.getText());
        this.assertType(ctx, ECMAScriptParser.MemberIndexExpressionContext);
        this.assertNodeCount(ctx, 4);
        const expr = this.singleExpression(ctx.getChild(0));
        const property = this.visitExpressionSequence(ctx.getChild(2));
        return new ComputedMemberExpression(expr, property);
    }

    // Visit a parse tree produced by ECMAScriptParser#IdentifierExpression.
    visitIdentifierExpression(ctx: RuleContext): Identifier {
        console.info("visitIdentifierExpression [%s] : %s", ctx.getChildCount(), ctx.getText());
        this.assertType(ctx, ECMAScriptParser.IdentifierExpressionContext);
        this.assertNodeCount(ctx, 1)
        const initialiser = ctx.getChild(0);
        const name = initialiser.getText();
        // return this.decorate(new Identifier(name), this.asMarker(this.asMetadata(initialiser.symbol)))
        return new Identifier(name);
    }

    // Visit a parse tree produced by ECMAScriptParser#identifier.
    visitIdentifier(ctx: RuleContext): Identifier {
        this.log(ctx, Trace.frame());
        this.assertType(ctx, ECMAScriptParser.IdentifierContext)
        return new Identifier(ctx.getChild(0).getText())
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
    visitAssignmentOperatorExpression(ctx: RuleContext): AssignmentExpression {
        this.log(ctx, Trace.frame())
        this.assertType(ctx, ECMAScriptParser.AssignmentOperatorExpressionContext);
        this.assertNodeCount(ctx, 3)
        const initialiser = ctx.getChild(0);
        const operator = ctx.getChild(1).getText();
        const expression = ctx.getChild(2);
        const lhs = this.singleExpression(initialiser);
        const rhs = this.singleExpression(expression);

        // Compliance : pulling up ExpressionStatement into AssigementExpression
        return new AssignmentExpression(operator, lhs, rhs.expression)
    }

    // Visit a parse tree produced by ECMAScriptParser#VoidExpression.
    visitVoidExpression(ctx: RuleContext) {
        console.trace('not implemented')

    }

    // Visit a parse tree produced by ECMAScriptParser#assignmentOperator.
    visitAssignmentOperator(ctx: RuleContext) {
        console.info("visitAssignmentOperator [%s] : [%s]", ctx.getChildCount(), ctx.getText());
    }

    // Visit a parse tree produced by ECMAScriptParser#literal.
    visitLiteral(ctx: RuleContext): Literal {
        console.info("visitLiteral [%s] : [%s]", ctx.getChildCount(), ctx.getText());
        this.assertType(ctx, ECMAScriptParser.LiteralContext)
        this.assertNodeCount(ctx, 1);
        const node: RuleContext = ctx.getChild(0);

        if (node.getChildCount() == 0) {
            return this.createLiteralValue(node);
        }
        else if (node.getChildCount() == 1) {
            if (node instanceof ECMAScriptParser.NumericLiteralContext) {
                return this.visitNumericLiteral(node);
            }
            this.throwInsanceError(this.dumpContext(node));
        }
        this.throwInsanceError(this.dumpContext(node));
    }

    // Visit a parse tree produced by ECMAScriptParser#numericLiteral.
    visitNumericLiteral(ctx: RuleContext): Literal {
        console.info("visitNumericLiteral [%s] : [%s]", ctx.getChildCount(), ctx.getText());
        this.assertType(ctx, ECMAScriptParser.NumericLiteralContext)
        this.assertNodeCount(ctx, 1);
        const value = ctx.getText();
        // TODO : Figure out better way
        const literal = new Literal(Number(value), value);
        return this.decorate(literal, this.asMarker(this.asMetadata(ctx.getSourceInterval())))
    }

    createLiteralValue(ctx: RuleContext): Literal {
        console.info("createLiteralValue [%s]: [%s]", ctx.getChildCount(), ctx.getText());
        const value = ctx.getText();
        const literal = new Literal(value, value);
        return this.decorate(literal, this.asMarker(this.asMetadata(ctx.getSourceInterval())))
    }

    // Visit a parse tree produced by ECMAScriptParser#identifierName.
    visitIdentifierName(ctx: RuleContext): Identifier {
        console.info("visitIdentifierName [%s]: [%s]", ctx.getChildCount(), ctx.getText());
        this.assertType(ctx, ECMAScriptParser.IdentifierNameContext)
        this.assertNodeCount(ctx, 1);
        const value = ctx.getText();
        const identifier = new Identifier(value);
        return this.decorate(identifier, this.asMarker(this.asMetadata(ctx.getSourceInterval())))
    }

    // Visit a parse tree produced by ECMAScriptParser#reservedWord.
    visitReservedWord(ctx: RuleContext) {
        console.info("visitReservedWord: " + ctx.getText());
    }

    // Visit a parse tree produced by ECMAScriptParser#keyword.
    visitKeyword(ctx: RuleContext) {
        console.info("visitKeyword: " + ctx.getText());

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