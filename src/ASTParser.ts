import * as antlr4 from "antlr4"
import { ECMAScriptVisitor as DelvenVisitor } from "./parser/ECMAScriptVisitor"
import { ECMAScriptParser as DelvenParser, ECMAScriptParser } from "./parser/ECMAScriptParser"
import { ECMAScriptLexer as DelvenLexer } from "./parser/ECMAScriptLexer"
import { RuleContext } from "antlr4/RuleContext"
import { PrintVisitor } from "./PrintVisitor"
import ASTNode from "./ASTNode";
import { ExpressionStatement, Literal, Script, BlockStatement, Statement, SequenceExpression, ThrowStatement, AssignmentExpression, Identifier, BinaryExpression, ArrayExpression } from "./nodes";
import { Syntax } from "./syntax";
import { type } from "os"
import { Interval } from "antlr4"
let fs = require("fs");

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
        const keys = Object.getOwnPropertyNames(ECMAScriptParser);
        for (var key in keys) {
            let name = keys[key];
            if (name.startsWith('RULE_')) {
                this.ruleTypeMap.set(parseInt(ECMAScriptParser[name]), name)
            }
        }
    }

    private dumpContext(ctx: RuleContext) {
        const keys = Object.getOwnPropertyNames(ECMAScriptParser);
        let context = []
        
        for (var key in keys) {
            let name = keys[key];
            // this only test inheritance
            if (name.endsWith('Context')) {
                if (ctx instanceof ECMAScriptParser[name]) {
                    context.push(name);
                }
            }
        }
        
        for(let key in context){
            let name = context[key];
            let clazz =  ECMAScriptParser[name];
            if(ctx == clazz.prototype) {
                console.info("Target : " + clazz)
            }
            
            // console.info("CLAZZ : "+  key+ " -- "+ clazz.prototype.constructor.)
            //console.info("CLAZZ : "+  key+ " -- " + clazz.prototype)

        }

        return  context;
    }

    private dumpContextAllChildren(ctx: RuleContext, indent: number = 0) {
        let pad = " ".padStart(indent, "\t");
        let nodes = this.dumpContext(ctx);
        if (nodes.length > 0) {
            console.info(pad + " * " + nodes)
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

    private throwTypeError(typeId: any) {
        throw new TypeError("Unhandled type : " + typeId + " : " + this.getRuleById(typeId));
    }

    /**
     * Throw TypeError only when there is a type provided. 
     * This is usefull when there node ita TerminalNode 
     * @param type 
     */
    private throwInsanceError(type: any) {
/*         if (type == undefined || type == "") {
           return;
        } */
        throw new TypeError("Unhandled instance type : " + type);
    }

    assertType(ctx: RuleContext, type: any) {
        if (!(ctx instanceof type)) {
            throw new TypeError("Invalid type expected : '" + type.name + "' received '" + this.dumpContext(ctx)) + "'";
        }
    }

    // Visit a parse tree produced by ECMAScriptParser#program.
    visitProgram(ctx: ECMAScriptParser.ProgramContext) {
        console.info("visitProgram [%s] : %s", ctx.getChildCount(), ctx.getText());
        // visitProgram ->visitSourceElements -> visitSourceElement -> visitStatement
        let statements: any = [];
        let node = ctx.getChild(0);  // visitProgram ->visitSourceElements 
        for (let i = 0; i < node.getChildCount(); ++i) {
            let stm = node.getChild(i).getChild(0); // SourceElementsContext > StatementContext
            if (stm instanceof ECMAScriptParser.StatementContext) {
                let statement = this.visitStatement(stm);
                statements.push(statement);
            } else {
                this.throwInsanceError(this.dumpContext(stm));
            }
        }
        let interval = ctx.getSourceInterval();
        let script = new Script(statements);
        return this.decorate(script, this.asMarker(this.asMetadata(interval)));
    }

    // Visit a parse tree produced by ECMAScriptParser#statement.
    visitStatement(ctx: RuleContext) {
        this.assertType(ctx, ECMAScriptParser.StatementContext)
        console.info("visitStatement [%s] : %s", ctx.getChildCount(), ctx.getText());
        let node: RuleContext = ctx.getChild(0);

        if (node instanceof ECMAScriptParser.ExpressionStatementContext) {
            return this.visitExpressionStatement(node);
        } else if (node instanceof ECMAScriptParser.VariableStatementContext) {
            return this.visitVariableStatement(node);
        } else if (node instanceof ECMAScriptParser.BlockContext) {
            return this.visitBlock(node);}
         else if (node instanceof ECMAScriptParser.EmptyStatementContext) {
            // NOOP,
            // var x;
        } else {
            this.throwInsanceError(this.dumpContext(node));
        }
    }

    // Visit a parse tree produced by ECMAScriptParser#block.
    visitBlock(ctx: RuleContext) {
        console.info("visitBlock [%s] : %s", ctx.getChildCount(), ctx.getText());
        this.assertType(ctx, ECMAScriptParser.BlockContext)
        let body = [];
        for (let i = 0; i < ctx.getChildCount(); ++i) {
            let node: RuleContext = ctx.getChild(i);
            if (node instanceof ECMAScriptParser.StatementListContext) {
                let statementList = this.visitStatementList(node);
                for (let index in statementList) {
                    body.push(statementList[index]);
                }
            } else {
                this.throwInsanceError(this.dumpContext(node));
            }
        }
        return this.decorate(new BlockStatement(body), this.asMarker(this.asMetadata(ctx.getSourceInterval())));
    }


    // Visit a parse tree produced by ECMAScriptParser#statementList.
    visitStatementList(ctx: RuleContext) {
        console.info("visitStatementList [%s] : %s", ctx.getChildCount(), ctx.getText());
        let body = [];
        for (let i = 0; i < ctx.getChildCount(); ++i) {
            let node: RuleContext = ctx.getChild(i);
            let type = node.ruleIndex;
            if (type == ECMAScriptParser.RULE_statement) {
                let statement: any = this.visitStatement(node);
                body.push(statement);
            } else if (type == undefined) {
                continue;
            }
            else {
                this.throwTypeError(type);
            }
        }
        return body;
    }

    // Visit a parse tree produced by ECMAScriptParser#variableStatement.
    visitVariableStatement(ctx: RuleContext) {
        console.info("visitVariableStatement [%s] : %s", ctx.getChildCount(), ctx.getText());
        this.dumpContextAllChildren(ctx)

    }

    // Visit a parse tree produced by ECMAScriptParser#variableDeclarationList.
    visitVariableDeclarationList(ctx: RuleContext) {
        console.trace("visitVariableDeclarationList: " + ctx.getText());
    }

    // Visit a parse tree produced by ECMAScriptParser#variableDeclaration.
    visitVariableDeclaration(ctx: RuleContext) {
        console.trace("visitVariableDeclaration: " + ctx.getText());
    }


    // Visit a parse tree produced by ECMAScriptParser#initialiser.
    visitInitialiser(ctx: RuleContext) {
        console.trace("visitInitialiser: " + ctx.getText());
    }


    // Visit a parse tree produced by ECMAScriptParser#emptyStatement.
    visitEmptyStatement(ctx: RuleContext) {
        console.info("visitEmptyStatementXX: " + ctx.getText());
    }

    private getRuleType(node: any, index: number): number {
        return node.getChild(index).ruleIndex;
    }

    private assertNodeCount(ctx: RuleContext, count: number) {
        if (ctx.getChildCount() != count) {
            throw new Error("Wrong child count, expected '" + count + "' got : " + ctx.getChildCount());
        }
    }

    // Visit a parse tree produced by ECMAScriptParser#expressionStatement.
    visitExpressionStatement(ctx: RuleContext) {
        console.info("visitExpressionStatement: " + ctx.getText());
        this.assertType(ctx, ECMAScriptParser.ExpressionStatementContext)
        this.assertNodeCount(ctx, 1);
        // visitExpressionStatement:>visitExpressionSequence
        let node: RuleContext = ctx.getChild(0); // visitExpressionSequence 
        let exp
        if (node instanceof ECMAScriptParser.ExpressionSequenceContext) {
            exp = this.visitExpressionSequence(node);
        } else {
            this.throwInsanceError(this.dumpContext(node));
        }

        return exp //this.decorate(exp, this.asMarker(this.asMetadata(ctx.getSourceInterval())));
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

    // Visit a parse tree produced by ECMAScriptParser#ifStatement.
    visitIfStatement(ctx: RuleContext) {
        console.info("visitIfStatement: " + ctx.getText());

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
    visitFunctionDeclaration(ctx: RuleContext) {
        console.trace('not implemented')

    }


    // Visit a parse tree produced by ECMAScriptParser#formalParameterList.
    visitFormalParameterList(ctx: RuleContext) {
        console.trace('not implemented')
    }


    // Visit a parse tree produced by ECMAScriptParser#functionBody.
    visitFunctionBody(ctx: RuleContext) {
        console.info("visitFunctionBody: " + ctx.getText());
    }


    // Visit a parse tree produced by ECMAScriptParser#arrayLiteral.
    visitArrayLiteral(ctx: RuleContext) {
        console.info("visitArrayLiteral [%s] : %s", ctx.getChildCount(), ctx.getText());
        this.assertType(ctx, ECMAScriptParser.ArrayLiteralContext)
        // this.assertNodeCount(ctx, 3)
        let elementList = ctx.getChild(1);
        let elements =  this.visitElementList(elementList);
        let elisionValues
        if(ctx.getChildCount() == 5) {
            let elision = ctx.getChild(3);
            elisionValues = this.visitElision(elision);
        }

        let literals = [];
        literals = literals.concat(elements);
        literals = literals.concat(elisionValues);
        return literals;
    }

    // Visit a parse tree produced by ECMAScriptParser#elementList.
    visitElementList(ctx: RuleContext) {
        console.info("visitElementList [%s] : %s", ctx.getChildCount(), ctx.getText());
        this.assertType(ctx, ECMAScriptParser.ElementListContext)

        let elements = [];
        for (let i = 0; i < ctx.getChildCount(); ++i) {
            let node = ctx.getChild(i);

            if(node.symbol != undefined)
                continue;
            
            let elem;
            if (node instanceof ECMAScriptParser.IdentifierExpressionContext) {
                elem = this.visitIdentifierExpression(node);
            } else if (node instanceof ECMAScriptParser.LiteralExpressionContext) {
                elem = this.visitLiteralExpression(node);
            } else if (node instanceof ECMAScriptParser.AdditiveExpressionContext) {
                elem = this.visitAdditiveExpression(node);
            } else if (node instanceof ECMAScriptParser.MultiplicativeExpressionContext) {
                elem = this.visitMultiplicativeExpression(node);
            } else {
               this.throwInsanceError(this.dumpContext(node));
            }
            elements.push(elem);
        }
        return elements;
    }

    // Visit a parse tree produced by ECMAScriptParser#elision.
    visitElision(ctx: RuleContext) {
        console.info("visitElision [%s] : %s", ctx.getChildCount(), ctx.getText());
        this.assertType(ctx, ECMAScriptParser.ElisionContext)
        // compliance: esprima compliane or returning `null` 
        let elision = [];
        for(let i = 0; i < ctx.getChildCount(); ++i) {
            elision.push(null);
        }
        return elision;
    }

    // Visit a parse tree produced by ECMAScriptParser#objectLiteral.
    visitObjectLiteral(ctx: RuleContext) {
        console.info("visitObjectLiteral [%s] : %s", ctx.getChildCount(), ctx.getText());
        this.assertType(ctx, ECMAScriptParser.ObjectLiteralContext);
        // this.dumpContextAllChildren(ctx)
        let val = this.dumpContext(ctx.getChild(1).getChild(0));
        console.info(val)
    }

    // Visit a parse tree produced by ECMAScriptParser#propertyNameAndValueList.
    visitPropertyNameAndValueList(ctx: RuleContext) {
        console.trace('not implemented')
    }


    // Visit a parse tree produced by ECMAScriptParser#PropertyExpressionAssignment.
    visitPropertyExpressionAssignment(ctx: RuleContext) {
        console.trace('not implemented')

    }


    // Visit a parse tree produced by ECMAScriptParser#PropertyGetter.
    visitPropertyGetter(ctx: RuleContext) {
        console.trace('not implemented')

    }


    // Visit a parse tree produced by ECMAScriptParser#PropertySetter.
    visitPropertySetter(ctx: RuleContext) {
        console.trace('not implemented')

    }


    // Visit a parse tree produced by ECMAScriptParser#propertyName.
    visitPropertyName(ctx: RuleContext) {
        console.trace('not implemented')

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
    visitExpressionSequence(ctx: RuleContext) {
        console.info("visitExpressionSequence [%s] : [%s]", ctx.getChildCount(), ctx.getText());
        this.assertType(ctx, ECMAScriptParser.ExpressionSequenceContext);
        let expressions = [];

        for (let i = 0; i < ctx.getChildCount(); ++i) {
            let node: RuleContext = ctx.getChild(i);
            let exp;
            if (node instanceof ECMAScriptParser.LiteralExpressionContext) {
                exp = this.visitLiteralExpression(node);
            } else if (node instanceof ECMAScriptParser.ObjectLiteralExpressionContext) {
                exp = this.visitObjectLiteralExpression(node);
            }else if (node instanceof ECMAScriptParser.AssignmentExpressionContext) {
                exp = this.visitAssignmentExpression(node);
            } else if (node instanceof ECMAScriptParser.AdditiveExpressionContext) {
                let node = exp = this.visitAdditiveExpression(node);
            } else if (node instanceof ECMAScriptParser.MultiplicativeExpressionContext) {
                exp = this.visitMultiplicativeExpression(node);
            } else if (node instanceof ECMAScriptParser.ArrayLiteralExpressionContext) {
                exp = this.visitArrayLiteralExpression(node);
            } else {
                this.throwInsanceError(this.dumpContext(node));
            }
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


    // Visit a parse tree produced by ECMAScriptParser#ObjectLiteralExpression.
    visitObjectLiteralExpression(ctx: RuleContext) {
        console.info("visitObjectLiteralExpression [%s] : %s", ctx.getChildCount(), ctx.getText());
        this.assertType(ctx, ECMAScriptParser.ObjectLiteralExpressionContext);
        let expressions = [];
        let node = ctx.getChild(0);
        this.dumpContextAllChildren(node);
        let obj = this.visitObjectLiteral(node);
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
        console.trace('not implemented')

    }


    // Visit a parse tree produced by ECMAScriptParser#UnaryMinusExpression.
    visitUnaryMinusExpression(ctx: RuleContext) {
        console.trace('not implemented')

    }


    // Visit a parse tree produced by ECMAScriptParser#PostDecreaseExpression.
    visitPostDecreaseExpression(ctx: RuleContext) {
        console.trace('not implemented')

    }


    // Visit a parse tree produced by ECMAScriptParser#AssignmentExpression.
    visitAssignmentExpression(ctx: RuleContext) {
        console.info("visitAssignmentExpression [%s] : [%s]", ctx.getChildCount(), ctx.getText());
        this.assertType(ctx, ECMAScriptParser.AssignmentExpressionContext);
        this.assertNodeCount(ctx, 3)

        let initialiser = ctx.getChild(0); // IdentifierExpressionContext
        let operator = ctx.getChild(1).getText(); // No type ( = )
        let expression = ctx.getChild(2);  //ExpressionSequenceContext

        let lhs = this.visitIdentifierExpression(initialiser);
        let rhs = this.visitExpressionSequence(expression);
        // Compliance : pulling up ExpressionStatement into AssigementExpression
        let node = new AssignmentExpression(operator, lhs, rhs.expression)
        return node;
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
    visitEqualityExpression(ctx: RuleContext) {
        console.trace('not implemented')

    }


    // Visit a parse tree produced by ECMAScriptParser#BitXOrExpression.
    visitBitXOrExpression(ctx: RuleContext) {
        console.trace('not implemented')

    }


    // Visit a parse tree produced by ECMAScriptParser#MultiplicativeExpression.
    visitMultiplicativeExpression(ctx: RuleContext) {
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
        console.info("visitParenthesizedExpression: " + ctx.getText());
    }

    // Visit a parse tree produced by ECMAScriptParser#AdditiveExpression.
    visitAdditiveExpression(ctx: RuleContext) {
        console.info("visitAdditiveExpression [%s] : %s", ctx.getChildCount(), ctx.getText());
        this.assertType(ctx, ECMAScriptParser.AdditiveExpressionContext);
        this.assertNodeCount(ctx, 3)

        let left = ctx.getChild(0);
        let operator = ctx.getChild(1).getText(); // No type ( +,- )
        let right = ctx.getChild(2);
        let lhs = this._visitBinaryExpression(left);
        let rhs = this._visitBinaryExpression(right);
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
        }
        this.throwInsanceError(this.dumpContext(ctx));
    }

    // Visit a parse tree produced by ECMAScriptParser#RelationalExpression.
    visitRelationalExpression(ctx: RuleContext) {
        console.trace('not implemented')
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
    visitArrayLiteralExpression(ctx: RuleContext) {
        console.info("visitArrayLiteralExpression [%s] : %s", ctx.getChildCount(), ctx.getText());
        this.assertType(ctx, ECMAScriptParser.ArrayLiteralExpressionContext);
        this.assertNodeCount(ctx, 1);
        let node = ctx.getChild(0);
        let elements = this.visitArrayLiteral(node);

        return new ArrayExpression(elements);
    }

    // Visit a parse tree produced by ECMAScriptParser#MemberDotExpression.
    visitMemberDotExpression(ctx: RuleContext) {
        console.info("visitMemberDotExpression [%s] : %s", ctx.getChildCount(), ctx.getText());
    }

    // Visit a parse tree produced by ECMAScriptParser#MemberIndexExpression.
    visitMemberIndexExpression(ctx: RuleContext) {
        console.trace('not implemented')
    }


    // Visit a parse tree produced by ECMAScriptParser#IdentifierExpression.
    visitIdentifierExpression(ctx: RuleContext) {
        console.info("visitIdentifierExpression [%s] : %s", ctx.getChildCount(), ctx.getText());
        this.assertType(ctx, ECMAScriptParser.IdentifierExpressionContext);
        this.assertNodeCount(ctx, 1)
        let initialiser = ctx.getChild(0);
        let name = initialiser.getText();
        return this.decorate(new Identifier(name), this.asMarker(this.asMetadata(initialiser.symbol)))
    }

    // Visit a parse tree produced by ECMAScriptParser#BitAndExpression.
    visitBitAndExpression(ctx: RuleContext) {
        console.trace('not implemented')
    }

    // Visit a parse tree produced by ECMAScriptParser#BitOrExpression.
    visitBitOrExpression(ctx: RuleContext) {
        console.trace('not implemented')
    }


    // Visit a parse tree produced by ECMAScriptParser#AssignmentOperatorExpression.
    visitAssignmentOperatorExpression(ctx: RuleContext) {
        console.trace('not implemented')
    }


    // Visit a parse tree produced by ECMAScriptParser#VoidExpression.
    visitVoidExpression(ctx: RuleContext) {
        console.trace('not implemented')

    }

    // Visit a parse tree produced by ECMAScriptParser#assignmentOperator.
    visitAssignmentOperator(ctx: RuleContext) {
        console.info("visitAssignmentOperator: " + ctx.getText());
    }

    // Visit a parse tree produced by ECMAScriptParser#literal.
    visitLiteral(ctx: RuleContext) {
        console.info("visitLiteral [%s] : [%s]", ctx.getChildCount(), ctx.getText());
        this.assertType(ctx, ECMAScriptParser.LiteralContext)
        this.assertNodeCount(ctx, 1);
        let node: RuleContext = ctx.getChild(0);
        if (node.getChildCount() == 1) {
            if (node instanceof ECMAScriptParser.NumericLiteralContext) {
                return this.visitNumericLiteral(node);
            }
            this.throwInsanceError(this.dumpContext(node));
        }
        else if (node.getChildCount() == 0) {
            return this.createLiteralValue(node);
        }
    }

    // Visit a parse tree produced by ECMAScriptParser#numericLiteral.
    visitNumericLiteral(ctx: RuleContext) {
        console.info("visitNumericLiteral [%s] : [%s]", ctx.getChildCount(), ctx.getText());
        this.assertType(ctx, ECMAScriptParser.NumericLiteralContext)
        this.assertNodeCount(ctx, 1);
        let value = ctx.getText();
        // TODO : Figure out better way
        let literal = new Literal(Number(value), value);
        return this.decorate(literal, this.asMarker(this.asMetadata(ctx.getSourceInterval())))
    }

    createLiteralValue(ctx: RuleContext) {
        console.info("createLiteralValue [%s]: [%s]", ctx.getChildCount(), ctx.getText());
        let value = ctx.getText();
        let literal = new Literal(value, value);
        return this.decorate(literal, this.asMarker(this.asMetadata(ctx.getSourceInterval())))
    }

    // Visit a parse tree produced by ECMAScriptParser#identifierName.
    visitIdentifierName(ctx: RuleContext) {
        console.info("visitIdentifierName: " + ctx.getText());
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