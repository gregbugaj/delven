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

class ExplicitASTNodeVisitor extends ASTVisitor {

    private _buffer: string
    private indentation: number
    private indent_with: string;
    private line: number;
    private indent: string;

    constructor() {
        super();
        this._buffer = ""
        this.indentation = 0
        this.indent_with = "    "
        this.indent = ""
        this.line = 1
    }

    get buffer(): string {
        return this._buffer;
    }

    private write(txt: string, useIndent: boolean, newline = false): void {
        this._buffer += (useIndent ? this.indent : "") + txt;
        if (newline) {
            this._buffer += '\n';
            this.line++;
        }
    }

    private indentDecrease() {
        this.indentation--;
        this.updateIndent();
    }

    private indentIncease() {
        this.indentation++;
        this.updateIndent();
    }

    private updateIndent() {
        let pad = "";
        for (let i = 0; i < this.indentation; ++i) {
            pad += this.indent_with;
        }
        this.indent = pad;
    }

    visitScript(node: Node.Script): void {
        this.write(" // Generated code", false, true);
        for (const stm of node.body) {
            this.visit(stm);
        }
    }

    visit(node: Node.Declaration | Node.Statement) {

        switch (node.type) {
            case Syntax.BlockStatement: {
                this.visitBlockStatement(node as Node.BlockStatement);
                break;
            } case Syntax.ExpressionStatement: {
                this.visitExpressionStatement(node as Node.ExpressionStatement);
                break;
            } case Syntax.SequenceExpression: {
                this.visitSequenceExpression(node as Node.SequenceExpression);
                break;
            } case Syntax.VariableDeclaration: {
                this.visitVariableDeclaration(node as Node.VariableDeclaration);
                break;
            }
            default:
                throw new TypeError("Type not handled : " + node.type)
        }
    }

    visitBlockStatement(node: Node.BlockStatement): void {
        this.write("{", true, true);

        for (const statement of node.body) {
            this.indentIncease()
            this.visit(statement);
            this.write("\n", false, false)
            this.indentDecrease()
        }

        this.write("}", true, false);
    }

    visitExpressionStatement(node: Node.ExpressionStatement): void {
        this.visitExpression(node.expression)
    }

    visitAssignmentExpression(expression: Node.AssignmentExpression): void {

        this.visitExpression(expression.left);
        this.write(" " + expression.operator + " ", false, false)
        this.visitExpression(expression.right);
    }

    visitSequenceExpression(sequence: Node.SequenceExpression): void {
        for (let i = 0; i < sequence.expressions.length; ++i) {
            this.visitExpression(sequence.expressions[i] as Node.Expression);
            if (i < sequence.expressions.length - 1) {
                this.write(", ", false, false)
            }
        }
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
            } case Syntax.ObjectExpression: {
                this.visitObjectExpression(expression as Node.ObjectExpression);
                break;
            }
            default:
                throw new TypeError("Type not handled : " + expression.type)
        }
    }

    visitObjectExpression(expression: Node.ObjectExpression): void {
        const properties: Node.ObjectExpressionProperty[] = expression.properties;

        this.write('{', false, false)
        for (let i = 0; i < properties.length; ++i) {
            const property = properties[i];
            this.visitObjectExpressionProperty(property);
            this.write(i < properties.length - 1 ? ', ' : '', false, false);
        }
        this.write('}', false, false)
    }

    visitObjectExpressionProperty(expression: Node.ObjectExpressionProperty): void {

        switch (expression.type) {
            case Syntax.Property: {
                const property = expression as Node.Property;
                const key: Node.PropertyKey = property.key;
                const value: Node.PropertyValue = property.value;

                this.visitPropertyKey(key);
                this.write(':', false, false)
                this.visitPropertyValue(value);

                console.info(value)
                break;
            } case Syntax.SpreadElement: {
                this.write('SPREAD', false, false)
                break;
            }
            default:
                throw new TypeError("Type not handled : " + expression.type)
        }
    }

    visitPropertyValue(value: Node.PropertyValue) {

        switch (value.type) {
            case Syntax.AssignmentPattern: {
                console.info('X AssignmentPattern')
                break;
            }
            case Syntax.FunctionExpression: {
                console.info('X FunctionExpression')
                break;
            } case Syntax.ArrowFunctionExpression: {
                console.info('X ArrowFunctionExpression')
                break;
            }
            case Syntax.Literal: {
                this.visitLiteral(value as Node.Literal)
                break;
            } case Syntax.Identifier: {
                this.visitIdentifier(value as Node.Identifier)
                break;
            }
            case Syntax.ArrayPattern: {
                console.info('X ArrayPattern')
                break;
            } case Syntax.ObjectPattern: {
                console.info('X ObjectPattern')
                break;
            } default:
                throw new TypeError("Type not handled : " + value.type)
        }
    }

    visitPropertyKey(key: Node.PropertyKey) {
        if (key instanceof Node.Identifier) {
            this.visitIdentifier(key as Node.Identifier)
        } else if (key instanceof Node.Literal) {
            this.visitLiteral(key as Node.Literal)
        }
    }

    visitLiteral(literal: Node.Literal): void {
        this.write(literal.raw, false, false)
    }

    visitIdentifier(identifier: Node.Identifier): void {
        this.write(identifier.name, false, false)
    }

    visitVariableDeclaration(declaration: Node.VariableDeclaration): void {
        const kind = declaration.kind;
        const declarations = declaration.declarations;
        this.write(kind, true, false);

        for (const declaration of declarations) {
            this.visitVariableDeclarator(declaration as Node.VariableDeclarator)
        }
    }

    visitVariableDeclarator(declarator: Node.VariableDeclarator) {
        const ident = declarator.id as (Node.BindingIdentifier | Node.BindingPattern)
        const init = declarator.init as (Node.Expression | null)
        let lhs = ''

        if (ident instanceof Node.Identifier) {
            lhs = (ident as Node.Identifier).name
        } else {
            throw new TypeError("Type not handled : " + ident.type)
        }

        if (init != null) {
            this.write(` ${lhs} = `, false, false);
            this.visitExpression(init);
        } else {
            this.write(` ${lhs} `, false, false);
        }
    }

    teamplate(node: Node.ExpressionStatement): void {
        switch (node.expression.type) {
            case Syntax.Identifier: {
                break;
            }
            default:
                throw new TypeError("Type not handled : " + node.type)
        }
    }
}


let toJson = (obj: any): string => JSON.stringify(obj, function replacer(key, value) { return value }, 2);
