import ASTVisitor from "./ASTVisitor";
import * as Node from "./nodes";
import { Syntax } from "./syntax";

/**
 * Source generator to transform valid AST back into ECMAScript
 * JS does not support overloading, so the visit methods need different names.
 */
export default class SourceGenerator {

    constructor() {
        // 
    }

    /**
     * Convert ASTNode back into sourcecode representation
     * 
     * @param node 
     */
    toSource(node: Node.Script): string {
        const visitor = new ExplicitASTNodeVisitor();
        visitor.visitScript(node);
        return visitor.buffer;
    }
}

class ExplicitASTNodeVisitor implements ASTVisitor {

    private _buffer: string;

    constructor() {
        this._buffer = "";
    }


    get buffer(): string {
        return this._buffer;
    }

    private append(txt: string, newline = false): void {
        this._buffer += txt;
        if (newline) {
            this._buffer += "\n";
        }
    }

    visitScript(node: Node.Script): void {
        this.append(" // Generated code", true);
        for (const stm of node.body) {
            console.info(" stm : " + stm.type)
            switch (stm.type) {
                case Syntax.ExpressionStatement: {
                    this.visitExpressionStatement(stm as Node.ExpressionStatement);
                    break;
                } case Syntax.SequenceExpression: {
                    this.visitSequenceExpression(stm as Node.SequenceExpression);
                    break;
                }
                default:
                    throw new TypeError("Type not handled : " + stm.type)
            }
        }
    }

    visitExpressionStatement(node: Node.ExpressionStatement): void {
        this.visitExpression(node.expression)
    }

    visitAssignmentExpression(expression: Node.AssignmentExpression): void {
        this.visitExpression(expression.left);
        this.append(" " + expression.operator + " ", false)
        this.visitExpression(expression.right);
    }

    visitSequenceExpression(sequence: Node.SequenceExpression): void {
        for (let i = 0; i < sequence.expressions.length; ++i) {
            this.visitExpression(sequence.expressions[i] as Node.Expression);
            if (i < sequence.expressions.length - 1) {
                this.append(", ", false)
            }
        }
        this.append("", true);
    }

    visitExpression(expression: Node.Expression): void {
        switch (expression.type) {
            case Syntax.Literal: {
                this.visitLiteral(expression as Node.Literal)
                break;
            } case Syntax.Identifier: {
                this.visitIdentifier(expression as Node.Identifier);
                break;
            } case Syntax.AssignmentExpression: {
                this.visitAssignmentExpression(expression as Node.AssignmentExpression);
                break;
            }
            default:
                throw new TypeError("Type not handled : " + expression.type)
        }
    }


    visitLiteral(literal: Node.Literal): void {
        this.append(literal.raw, false)
    }

    visitIdentifier(identifier: Node.Identifier): void {
        this.append(identifier.name, false)
    }

    teamplate(node: Node.ExpressionStatement): void {
        switch (node.expression.type) {
            case Syntax.Identifier: {
                break;
            }
            default:
                throw new TypeError("Type not handled : " + stm.type)
        }
    }
}


let toJson = (obj: any): string => JSON.stringify(obj, function replacer(key, value) { return value }, 2);
