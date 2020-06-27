import ASTVisitor, { Binding } from "./ASTVisitor";
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

    private writeConditional(condition:boolean, txt: string, useIndent: boolean, newline = false): void {
        if(condition){
            this.write(txt, useIndent, newline);
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
            } case Syntax.VariableDeclaration: {
                this.visitVariableDeclaration(node as Node.VariableDeclaration);
                break;
            } case Syntax.ClassDeclaration: {
                this.visitClassDeclaration(node as Node.ClassDeclaration);
                break;
            } case Syntax.LabeledStatement: {
                this.visitLabeledStatement(node as Node.LabeledStatement);
                break;
            } case Syntax.ReturnStatement: {
                this.vistReturnStatement(node as Node.ReturnStatement);
                break;
            }
            default:
                throw new TypeError("Type not handled : " + node.type)
        }

        this.write('\n', false, false)
    }

    visitUpdateExpression(expression: Node.UpdateExpression): void {
        this.writeConditional(expression.prefix, expression.operator, false, false)
        this.visitExpression(expression.argument)
        this.writeConditional(!expression.prefix, expression.operator, false, false)
    }

    vistReturnStatement(expression: Node.ReturnStatement): void {
        this.write('return ', false, false)

        if (expression.argument != null) {
            this.visitExpression(expression.argument)
        }
    }

    visitLabeledStatement(expression: Node.LabeledStatement) {
        this.visitIdentifier(expression.label)
        this.write(':', false, false)
        if (expression.body) {
            this.visit(expression.body)
        }
    }

    visitClassDeclaration(expression: Node.ClassDeclaration): void {
        this.classDefinition(expression)
    }

    visitClassExpression(expression: Node.ClassExpression): void {
        this.write('(', false, true)
        this.indentIncease()
        this.classDefinition(expression)
        this.write(')', false, true)
    }


    classDefinition(expression: Node.ClassDeclaration | Node.ClassExpression) {
        this.write('class ', false, false)
        if (expression.id != null) {
            this.visitIdentifier(expression.id as Node.Identifier)
            this.write('\n', false, false)
        }
        this.write('{ ', false, true)

        const clzBody: Node.ClassBody = expression.body
        for (let i = 0; i < clzBody.body.length; i++) {
            const property = clzBody.body[i]
            if (property.type == Syntax.MethodDefinition) {
                this.visitMethodDefinition(property as Node.MethodDefinition)
            } else {
                throw new TypeError("Type not handled  : " + property.type)
            }

            this.write('\n', false, false)
        }
        this.write('}', false, false)
    }

    visitMethodDefinition(expression: Node.MethodDefinition) {
        // AsyncFunctionExpression | FunctionExpression | null;
        if (expression.key != null) {
            this.visitExpression(expression.key as Node.Expression)
        }

        const value = expression.value;
        if (value instanceof Node.FunctionExpression) {
            this.visitFunctionExpression(value as Node.FunctionExpression)
        }
    }

    visitBlockStatement(node: Node.BlockStatement): void {
        this.write("{", true, true);
        const body = node.body;
        if (body != null) {
            for (let i = 0; i < body.length; ++i) {
                const statement = body[i]
                this.indentIncease()
                this.visit(statement);
                this.write(i < body.length - 1 ? '\n' : '', false, false)
                this.indentDecrease()
            }
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
            case Syntax.SequenceExpression: {
                this.visitSequenceExpression(expression as Node.SequenceExpression);
                break;
            }
            case Syntax.Literal: {
                this.visitLiteral(expression as Node.Literal)
                break;
            } case Syntax.Identifier: {
                this.visitIdentifier(expression as Node.Identifier);
                break;
            } 
            case Syntax.SpreadElement: {
                this.vistSpreadElement(expression as Node.SpreadElement);
                break;
            }
            case Syntax.AssignmentExpression: {
                this.visitAssignmentExpression(expression as Node.AssignmentExpression);
                break;
            } case Syntax.ObjectExpression: {
                this.visitObjectExpression(expression as Node.ObjectExpression);
                break;
            } case Syntax.ArrayExpression: {
                this.visitArrayExpression(expression as Node.ArrayExpression);
                break;
            }  case Syntax.BinaryExpression: {
                this.visitBinaryExpression(expression as Node.BinaryExpression);
                break;
            } case Syntax.LogicalExpression: {
                this.visitLogicalExpression(expression as Node.BinaryExpression);
                break;
            } case Syntax.ClassExpression: {
                this.visitClassExpression(expression as Node.ClassExpression);
                break;
            } case Syntax.ArrowFunctionExpression: {
                this.visitArrowFunctionExpression(expression as Node.ArrowFunctionExpression);
                break;
            } case Syntax.FunctionExpression: {
                this.visitFunctionExpression(expression as Node.FunctionExpression);
                break;
            } case Syntax.CallExpression: {
                this.visitCallExpression(expression as Node.CallExpression);
                break;
            } case Syntax.BlockStatement: {
                this.visitBlockStatement(expression as Node.BlockStatement);
                break;
                // TODO : This should not be here but rather under the statements
            } case Syntax.FunctionDeclaration: {
                this.visitFunctionDeclaration(expression as Node.FunctionDeclaration);
                break;
            } case Syntax.MemberExpression: {
                this.visitMemberExpression(expression as Node.StaticMemberExpression | Node.ComputedMemberExpression);
                break;
            } case Syntax.ThisExpression: {
                this.visitThisExpression(expression as Node.ThisExpression);
                break;
            }case Syntax.UpdateExpression: {
                this.visitUpdateExpression(expression as Node.UpdateExpression);
                break;
            }
            default:
                throw new TypeError("Type not handled : " + expression.type)
        }
    }

    visitThisExpression(expression: Node.ThisExpression) {
        this.write('this', false, false);
    }

    visitCallExpression(expression: Node.CallExpression) {
        if (expression.callee.type == Syntax.MemberExpression) {
            const args = expression.arguments;
            const callee = expression.callee as (Node.StaticMemberExpression | Node.ComputedMemberExpression);
            this.visitMemberExpression(callee)
            this.visitParams(args)

        } else {
            throw new TypeError("Not implemented : " + expression.type)
        }
    }

    visitMemberExpression(expression: Node.StaticMemberExpression | Node.ComputedMemberExpression) {
        const object = expression.object;
        const property = expression.property;
        this.visitExpression(object)
        this.write('.', false, false);
        this.visitExpression(property)
    }

    visitParams(args: Node.ArgumentListElement[] | Node.FunctionParameter[]) {
        this.write('(', false, false);
        for (let i = 0; i < args.length; ++i) {
            const arg = args[i];
            if (arg instanceof Node.RestElement) {
                this.vistiRestElement(arg as Node.RestElement)
            } else {
                this.visitExpression(arg as Node.Expression)
            }
            this.write(i < args.length - 1 ? ', ' : '', false, false);
        }
        this.write(')', false, false);
    }

    visitFunctionDeclaration(expression: Node.FunctionDeclaration): void {
        this.writeFunctionDefinition(expression)
    }

    visitBinaryExpression(expression: Node.BinaryExpression): void {
        this.binaryExpression(expression)
    }

    visitLogicalExpression(expression: Node.BinaryExpression): void {
        this.binaryExpression(expression)
    }

    binaryExpression(expression: Node.BinaryExpression): void {
        const leftParen = (expression.left.type == Syntax.LogicalExpression || expression.left.type == Syntax.BinaryExpression)
        const rightParen = (expression.right.type == Syntax.LogicalExpression || expression.right.type == Syntax.BinaryExpression)

        this.write(leftParen ? '(' : '', false, false)
        this.visitExpression(expression.left)
        this.write(leftParen ? ')' : '', false, false)
        this.write(` ${expression.operator} `, false, false)
        this.write(rightParen ? '(' : '', false, false)
        this.visitExpression(expression.right)
        this.write(rightParen ? ')' : '', false, false)
    }

    visitArrayExpression(expression: Node.ArrayExpression): void {
        const elements: Node.ArrayExpressionElement[] = expression.elements;
        this.write('[', false, false)
        for (let i = 0; i < elements.length; ++i) {
            const element: Node.ArrayExpressionElement = elements[i]//  Expression | SpreadElement | null;
            if (element == null) {
                this.write('null', false, false)
            } else if (element instanceof Node.RestElement) {
                this.vistiRestElement(element as Node.RestElement)
            } else {
                this.visitExpression(element as Node.Expression)
            }
            this.write(i < elements.length - 1 ? ', ' : '', false, false);
        }
        this.write(']', false, false)
    }

    vistSpreadElement(expression: Node.SpreadElement): void {
        const wrap = !(expression.argument instanceof Node.Identifier)
        this.write('...', false, false)
        this.write(wrap ? '(' : '', false, false)
        this.visitExpression(expression.argument)
        this.write(wrap ? ')' : '', false, false)
    }

    vistiRestElement(expression: Node.RestElement): void {
        throw new Error("Method not implemented.");
    }

    visitObjectExpression(expression: Node.ObjectExpression): void {
        const properties: Node.ObjectExpressionProperty[] = expression.properties;
        this.write('{', false, false)
        for (let i = 0; i < properties.length; ++i) {
            this.visitObjectExpressionProperty(properties[i]);
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

                // This is mostl implemented, somewhat hacky
                if(property.method) {
                    this.write(property.computed? '[' : '', false, false)
                    this.visitPropertyKey(key);
                    this.write(property.computed? ']' : '', false, false)
                    this.visitPropertyValue(value);
                }else{
                    this.write(property.computed? '[' : '', false, false)
                    this.visitPropertyKey(key);
                    this.write(property.computed? ']' : '', false, false)
                    this.write(':', false, false)
                    this.visitPropertyValue(value);
                }

                break;
            } case Syntax.SpreadElement: {
                this.write('SPREAD', false, false)
                throw new Error("not implemented")
                break;
            }
            default:
                throw new TypeError("Type not handled : " + expression.type)
        }
    }

    visitPropertyValue(value: Node.PropertyValue) {
        switch (value.type) {
            case Syntax.AssignmentPattern: {
                this.visitAssignmentPattern(value as Node.AssignmentPattern)
                break;
            }
            case Syntax.FunctionExpression: {
                const expression = value as Node.FunctionExpression;
                this.visitParams(expression.params)
                this.visitBlockStatement(expression.body)
                break;
            } case Syntax.ArrowFunctionExpression: {
                this.visitArrowFunctionExpression(value as Node.AsyncFunctionExpression);
                break;
            }
            case Syntax.Literal: {
                this.visitLiteral(value as Node.Literal)
                break;
            } case Syntax.Identifier: {
                this.visitIdentifier(value as Node.Identifier)
                break;
            } case Syntax.FunctionDeclaration: {
                this.visitFunctionDeclaration(value as Node.FunctionDeclaration)
                break;
            }
            case Syntax.ArrayPattern: {
                this.visitArrayPattern(value as Node.ArrayPattern)
                break;
            } case Syntax.ObjectPattern: {
                this.visitObjectPattern(value as Node.ObjectPattern)
                break;
            }
            case Syntax.ObjectExpression: {
                this.visitObjectExpression(value as Node.ObjectExpression);
                break;
            } 
            default:
                throw new TypeError("Type not handled : " + value.type)
        }
    }

    visitFunctionParameterArray(params: Node.FunctionParameter[]): void {
        this.write('(', false, false);
        for (let i = 0; i < params.length; ++i) {
            this.visitFunctionParameter(params[i])
            this.write(i < params.length - 1 ? ', ' : '', false, false)
        }
        this.write(')', false, false)
    }

    visitFunctionExpression(expression: Node.FunctionExpression): void {
        this.write('(', false, false)
        this.writeFunctionDefinition(expression);
        this.write(')', false, false)
    }

    writeFunctionDefinition(expression: Node.FunctionExpression | Node.FunctionDeclaration) {
        if (expression.async) {
            this.write(' async', false, false)
        }

        this.write(' function ', false, false)

        if (expression.generator) {
            this.write('*', false, false)
        }

        if (expression.id != null) {
            this.visitIdentifier(expression.id)
        }

        this.visitParams(expression.params)
        this.visitBlockStatement(expression.body)
    }

    visitArrowFunctionExpression(expression: Node.ArrowFunctionExpression): void {
        this.visitFunctionParameterArray(expression.params)
        this.write('=>', false, false)
        this.visitExpression(expression.body)
    }

    visitFunctionParameter(param: Node.FunctionParameter): void {
        switch (param.type) {
            case Syntax.AssignmentPattern: {
                this.visitAssignmentPattern(param as Node.AssignmentPattern)
                break;
            }
            case Syntax.Identifier: {
                this.visitIdentifier(param as Node.Identifier)
                break;
            } case Syntax.ArrayPattern: {
                break;
            }
            case Syntax.ObjectPattern: {
                break;
            }
            default:
                throw new TypeError("Type not handled : " + param.type)
        }
    }

    visitAssignmentPattern(expression: Node.AssignmentPattern): void {
        console.log(expression)
        this.visitBinding(expression.left as Binding);
        this.write(' = ', false, false);
        this.visitExpression(expression.right)
    }

    visitBinding(binding: Binding) {
        if (binding == undefined || binding == null) {
            return;
        }

        if (binding instanceof Node.Identifier) {
            this.visitIdentifier(binding as Node.Identifier)
        } else if (binding instanceof Node.ArrayPattern) {
            this.visitArrayPattern(binding as Node.ArrayPattern)
        } else if (binding instanceof Node.ObjectPattern) {
            this.visitObjectPattern(binding as Node.ObjectPattern)
        } else {
            throw new TypeError("")
        }
    }

    visitObjectPattern(node: Node.ObjectPattern): void {
        throw new Error("Method not implemented.");
    }

    visitArrayPattern(node: Node.ArrayPattern): void {
        throw new Error("Method not implemented.");
    }

    visitPropertyKey(key: Node.PropertyKey) {
        if (key instanceof Node.Identifier) {
            this.visitIdentifier(key as Node.Identifier)
        } else if (key instanceof Node.Literal) {
            this.visitLiteral(key as Node.Literal)
        }else if (key instanceof Node.BinaryExpression) {
            this.visitBinaryExpression(key as Node.BinaryExpression)
        }else{
            throw new TypeError("Not implemented")
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
        this.write(`${kind} `, true, false);

        for (const declaration of declarations) {
            this.visitVariableDeclarator(declaration as Node.VariableDeclarator)
        }
    }

    visitVariableDeclarator(declarator: Node.VariableDeclarator) {
        const ident = declarator.id as Binding
        const init = declarator.init as (Node.Expression | null)
        if (ident != null) {
            this.visitBinding(ident)
        }

        if (init != null) {
            this.write(' = ', false, false);
            this.visitExpression(init);
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
