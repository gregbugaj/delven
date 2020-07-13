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
    toSource(node: Node.Script | Node.Module): string {
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

    private writeNewLine() {
        this.write('\n', false, false)
    }

    private writeConditional(condition: boolean, txt: string, useIndent: boolean, newline = false): void {
        if (condition) {
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
        this.write("// Generated code", false, true);
        for (const stm of node.body) {
            this.visitStatement(stm);
        }
    }

    visitStatement(statement: Node.Declaration | Node.Statement) {

        switch (statement.type) {
            case Syntax.BlockStatement: {
                this.visitBlockStatement(statement as Node.BlockStatement);
                break;
            } case Syntax.ExpressionStatement: {
                this.visitExpressionStatement(statement as Node.ExpressionStatement);
                break;
            } case Syntax.VariableDeclaration: {
                this.visitVariableDeclaration(statement as Node.VariableDeclaration);
                break;
            } case Syntax.ClassDeclaration: {
                this.visitClassDeclaration(statement as Node.ClassDeclaration);
                break;
            } case Syntax.LabeledStatement: {
                this.visitLabeledStatement(statement as Node.LabeledStatement);
                break;
            } case Syntax.ReturnStatement: {
                this.vistReturnStatement(statement as Node.ReturnStatement);
                break;
            } case Syntax.IfStatement: {
                this.visitIfStatement(statement as Node.IfStatement);
                break;
            } case Syntax.FunctionDeclaration: {
                this.visitFunctionDeclaration(statement as Node.FunctionDeclaration);
                break;
            } case Syntax.SwitchStatement: {
                this.visitSwitchStatement(statement as Node.SwitchStatement);
                break;
            } case Syntax.BreakStatement: {
                this.visitBreakStatement(statement as Node.BreakStatement);
                break;
            } case Syntax.EmptyStatement: {
                this.visitEmptyStatement(statement as Node.EmptyStatement);
                break;
            } case Syntax.TryStatement: {
                this.visitTryStatement(statement as Node.TryStatement);
                break;
            } case Syntax.ThrowStatement: {
                this.visitThrowStatement(statement as Node.ThrowStatement);
                break;
            } case Syntax.WhileStatement: {
                this.visitWhileStatement(statement as Node.WhileStatement);
                break;
            } case Syntax.DoWhileStatement: {
                this.visitDoWhileStatement(statement as Node.DoWhileStatement);
                break;
            } case Syntax.ForOfStatement: {
                this.visitForOfStatement(statement as Node.ForOfStatement);
                break;
            } case Syntax.ForInStatement: {
                this.visitForInStatement(statement as Node.ForInStatement);
                break;
            } case Syntax.ForStatement: {
                this.visitForStatement(statement as Node.ForStatement);
                break;
            } case Syntax.ExportNamedDeclaration: {
                this.visitExportNamedDeclaration(statement as Node.ExportNamedDeclaration);
                break;
            } case Syntax.ExportDefaultDeclaration: {
                this.visitExportDefaultDeclaration(statement as Node.ExportDefaultDeclaration);
                break;
            } case Syntax.ExportAllDeclaration: {
                this.visitExportAllDeclaration(statement as Node.ExportAllDeclaration);
                break;
            } case Syntax.SelectStatement: {
                this.visitSelectStatement(statement as Node.SelectStatement);
                break;
            }
            default:
                throw new TypeError("Type not handled : " + statement.type)
        }

        this.write('\n', false, false)

    }

    visitSelectStatement(statement: Node.SelectStatement) {
        console.info(statement)
    }

    visitExportAllDeclaration(statement: Node.ExportAllDeclaration) {
        this.write('export * ', false, false)
        this.write('from ', false, false)
        this.visitLiteral(statement.source)
    }

    visitExportDefaultDeclaration(statement: Node.ExportDefaultDeclaration) {
        this.write('export default ', false, false)
        this.visitExpression(statement.declaration)
    }

    visitExportNamedDeclaration(statement: Node.ExportNamedDeclaration) {
        this.write('export', false, false)
        this.write(' ', false, false)
        if (statement.declaration) {
            this.visitStatement(statement.declaration)
        } else if (statement.specifiers && statement.specifiers.length > 0) {
            this.write('{', false, false)
            const specifiers: Node.ExportSpecifier[] = statement.specifiers
            for (let i = 0; i < specifiers.length; ++i) {
                const specifier: Node.ExportSpecifier = specifiers[i]
                this.visitIdentifier(specifier.local)
                if (specifier.exported) {
                    this.write(' as ', false, false)
                    this.visitIdentifier(specifier.exported)
                }
                this.write(i < specifiers.length - 1 ? ' ,' : '', false, false)
            }
            this.write('}', false, false)
        } else {
            throw new Error("No 'export's to emit")
        }

        if (statement.source) {
            this.write(' ', false, false)
            this.write('from', false, false)
            this.write(' ', false, false)
            this.visitLiteral(statement.source)
        }
    }

    visitForStatement(statement: Node.ForStatement): void {
        this.write('for', false, false)
        this.write('(', false, false)

        if (statement.init) {
            this.visitExpression(statement.init)
        }
        this.write(';', false, false)

        if (statement.test) {
            this.visitExpression(statement.test)
        }
        this.write(';', false, false)

        if (statement.update) {
            this.visitExpression(statement.update)
        }
        this.write(';', false, false)
        this.write(')', false, false)
        this.visitStatement(statement.body)
    }


    visitForOfStatement(statement: Node.ForOfStatement) {
        this.write('for', false, false)
        this.write('(', false, false)
        this.visitExpression(statement.left)
        this.write(' of ', false, false)
        this.visitExpression(statement.right)
        this.write(')', false, false)
        this.visitStatement(statement.body)
    }

    visitForInStatement(statement: Node.ForInStatement) {
        this.write('for', false, false)
        this.write('(', false, false)
        this.visitExpression(statement.left)
        this.write(' in ', false, false)
        this.visitExpression(statement.right)
        this.write(')', false, false)
        this.visitStatement(statement.body)
    }

    visitDoWhileStatement(statement: Node.DoWhileStatement) {
        this.write('do', false, false)
        this.visitStatement(statement.body)
        this.write('while', false, false)
        this.write('(', false, false)
        this.visitExpression(statement.test)
        this.write(')', false, false)


    }

    visitWhileStatement(statement: Node.WhileStatement): void {
        this.write('while', false, false)
        this.write('(', false, false)
        this.visitExpression(statement.test)
        this.write(')', false, false)
        this.visitStatement(statement.body)
    }

    visitThrowStatement(statement: Node.ThrowStatement): void {
        this.write('throw ', false, false)
        this.visitExpression(statement.argument)
    }

    visitTryStatement(statement: Node.TryStatement): void {
        this.write('try', false, true)
        this.visitBlockStatement(statement.block)

        if (statement.handler) {
            this.write('\n', false, false)
            this.visitCatchClause(statement.handler)
        }

        if (statement.finalizer) {
            this.write('\n', false, false)
            this.write('finally', false, true)
            this.visitBlockStatement(statement.finalizer)
        }
    }

    visitCatchClause(clause: Node.CatchClause): void {
        this.write('catch', false, false)
        if (clause.param) {
            this.write('(', false, false)
            this.visitBinding(clause.param as Binding)
            this.write(')', false, false)
        }

        this.writeNewLine();
        this.visitBlockStatement(clause.body)
    }

    visitEmptyStatement(statement: Node.EmptyStatement): void {
        this.write(';', false, false)
    }

    visitBreakStatement(statement: Node.BreakStatement): void {
        this.write('break', false, false)
        if (statement.label) {
            this.write(' ', false, false)
            this.visitIdentifier(statement.label)
        }
    }

    visitSwitchStatement(statement: Node.SwitchStatement): void {
        this.write('switch', false, false)
        this.write('(', false, false)
        this.visitExpression(statement.discriminant)
        this.write(') ', false, false)
        this.write('{', false, true)

        if (statement.cases) {
            for (const _case of statement.cases) {
                this.visitSwitchCase(_case)
            }
        }

        this.write('}', false, true)
    }

    visitSwitchCase(_case: Node.SwitchCase) {
        const isDefault = _case.test == null

        if (isDefault) {
            this.write('default : ', false, false)
        } else {
            this.write('case ', false, false)
            if (_case.test != null) {
                this.visitExpression(_case.test)
            }
            this.write(' : ', false, false)
        }

        if (_case.consequent) {
            for (const statement of _case.consequent) {
                this.visitStatement(statement)
            }
        }
    }

    visitIfStatement(node: Node.IfStatement) {
        this.write('if', false, false)
        this.write('(', false, false)
        this.visitExpression(node.test)
        this.write(') ', false, false)
        this.visitStatement(node.consequent)
        if (node.alternate) {
            this.write('else ', false, false)
            this.visitStatement(node.alternate)
        }
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
            this.visitStatement(expression.body)
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
                this.visitStatement(statement);
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
            } case Syntax.Literal: {
                this.visitLiteral(expression as Node.Literal)
                break;
            } case Syntax.Identifier: {
                this.visitIdentifier(expression as Node.Identifier);
                break;
            } case Syntax.SpreadElement: {
                this.vistSpreadElement(expression as Node.SpreadElement);
                break;
            } case Syntax.AssignmentExpression: {
                this.visitAssignmentExpression(expression as Node.AssignmentExpression);
                break;
            } case Syntax.ObjectExpression: {
                this.visitObjectExpression(expression as Node.ObjectExpression);
                break;
            } case Syntax.ArrayExpression: {
                this.visitArrayExpression(expression as Node.ArrayExpression);
                break;
            } case Syntax.BinaryExpression: {
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
            } case Syntax.MemberExpression: {
                this.visitMemberExpression(expression as Node.StaticMemberExpression | Node.ComputedMemberExpression);
                break;
            } case Syntax.ThisExpression: {
                this.visitThisExpression(expression as Node.ThisExpression);
                break;
            } case Syntax.UpdateExpression: {
                this.visitUpdateExpression(expression as Node.UpdateExpression);
                break;
            } case Syntax.UnaryExpression: {
                this.visitUnaryExpression(expression as Node.UnaryExpression);
                break;
            } case Syntax.NewExpression: {
                this.visitNewExpression(expression as Node.NewExpression);
                break;
            } case Syntax.VariableDeclaration: {
                this.visitVariableDeclaration(expression as Node.VariableDeclaration);
                break;
            } case Syntax.Property: {
                this.visitProperty(expression as Node.Property);
                break;
            } case Syntax.ArrayPattern: {
                this.visitArrayPattern(expression as Node.ArrayPattern);
                break;
            } case Syntax.ObjectPattern: {
                this.visitObjectPattern(expression as Node.ObjectPattern);
                break;
            } case Syntax.AwaitExpression: {
                this.visitAwaitExpression(expression as Node.AwaitExpression);
                break;
            } case Syntax.ConditionalExpression: {
                this.visitConditionalExpression(expression as Node.ConditionalExpression);
                break;
            } case Syntax.AssignmentPattern: {
                this.visitAssignmentPattern(expression as Node.AssignmentPattern)
                break;
            } case Syntax.Super: {
                this.visitSuper(expression as Node.Super)
                break;
            } case Syntax.RestElement: {
                this.vistiRestElement(expression as Node.RestElement)
                break;
            }

            default:
                throw new TypeError("Type not handled : " + expression.type)
        }
    }

    visitSuper(expression: Node.Super) {
        this.write('super', false, false)
    }

    visitConditionalExpression(expression: Node.ConditionalExpression): void {
        this.visitExpression(expression.test)
        this.write('?', false, false)
        this.visitExpression(expression.consequent)
        this.write(':', false, false)
        this.visitExpression(expression.alternate)
    }


    visitAwaitExpression(expression: Node.AwaitExpression) {
        this.write('await', false, false)
        this.write(' ', false, false)
        this.visitExpression(expression.argument)
    }

    visitProperty(expression: Node.Property): void {
        const key = expression.key
        const value = expression.value
        if (expression.shorthand) {
            // ({c=z}) => 0 // shorthand
            // ({c}) => 0 // shorthand
            if (value instanceof Node.AssignmentPattern) {
                this.visitAssignmentPattern(value)
            } else {
                this.visitExpression(key)
                if (value) {
                    this.visitExpression(value)
                }
            }
        } else {
            this.writeConditional(expression.computed, '[', false, false)
            this.visitExpression(key)
            this.writeConditional(expression.computed, ']', false, false)

            if (value) {
                this.write(' : ', false, false)
                this.visitExpression(value)
            }
        }
    }

    visitUnaryExpression(expression: Node.UnaryExpression): void {
        this.write(expression.operator, false, false)
        this.writeConditional((expression.operator === 'typeof' || expression.operator === 'void'), ' ', false, false)
        this.visitExpression(expression.argument)
    }

    visitNewExpression(expression: Node.NewExpression): void {
        const callee = expression.callee;
        const args = expression.arguments;

        this.write('new ', false, false)
        this.visitExpression(callee)
        this.visitParams(args)
    }

    visitThisExpression(expression: Node.ThisExpression) {
        this.write('this', false, false);
    }

    visitCallExpression(expression: Node.CallExpression) {
        const args = expression.arguments;
        if (expression.callee.type == Syntax.FunctionExpression) {
            this.write('(', false, false);
            this.visitFunctionExpression(expression.callee as Node.FunctionExpression)
            this.write(')', false, false);
            this.visitParams(args)
        } else if (expression.callee.type == Syntax.MemberExpression) {
            this.visitMemberExpression(expression.callee as (Node.StaticMemberExpression | Node.ComputedMemberExpression))
            this.visitParams(args)
        } else if (expression.callee.type == Syntax.Identifier) {
            this.visitIdentifier(expression.callee as Node.Identifier)
            this.visitParams(args)
        } else {
            console.info(expression)
            throw new TypeError("Not implemented : " + expression.type)
        }
    }

    visitMemberExpression(expression: Node.StaticMemberExpression | Node.ComputedMemberExpression) {

        if (expression instanceof Node.StaticMemberExpression) {
            this.visitExpression(expression.object)
            this.write('.', false, false);
            this.visitExpression(expression.property)
        } else if (expression instanceof Node.ComputedMemberExpression) {
            this.visitExpression(expression.object)
            this.write('[', false, false);
            this.visitExpression(expression.property)
            this.write(']', false, false);
        } else {
            throw new TypeError("Unhandled type : " + expression)
        }

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
        this.write('...', false, false)
        this.visitExpression(expression.argument)
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
                if (property.method) {
                    this.write(property.computed ? '[' : '', false, false)
                    this.visitPropertyKey(key);
                    this.write(property.computed ? ']' : '', false, false)
                    this.visitPropertyValue(value);
                } else {
                    if (property.shorthand) {
                        this.visitPropertyKey(key);
                    } else {
                        this.write(property.computed ? '[' : '', false, false)
                        this.visitPropertyKey(key);
                        this.write(property.computed ? ']' : '', false, false)
                        this.write(':', false, false)
                        this.visitPropertyValue(value);
                    }
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
        //AssignmentPattern | AsyncFunctionExpression | BindingIdentifier | BindingPattern | FunctionExpression;
        switch (value.type) {
            case Syntax.AssignmentPattern: {
                this.visitAssignmentPattern(value as Node.AssignmentPattern)
                break;
            }
            case Syntax.FunctionExpression: {
                this.visitFunctionExpression(value as Node.FunctionExpression)
                break;
            }
            case Syntax.ArrowFunctionExpression: {
                this.visitArrowFunctionExpression(value as Node.ArrowFunctionExpression);
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
                this.visitArrayPattern(value as Node.ArrayPattern)
                break;
            } case Syntax.ObjectPattern: {
                this.visitObjectPattern(value as Node.ObjectPattern)
                break;
            }
            case Syntax.ObjectExpression: {
                this.visitObjectExpression(value as Node.ObjectExpression);
                break;
            } case Syntax.ArrayExpression: {
                this.visitArrayExpression(value as Node.ArrayExpression);
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
        this.writeFunctionDefinition(expression);
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

        if (expression.async) {
            this.write('async', false, false)
            this.write(' ', false, false)
        }

        this.visitFunctionParameterArray(expression.params)
        this.write('=>', false, false)

        if (expression.body instanceof Node.BlockStatement) {
            this.visitBlockStatement(expression.body as Node.BlockStatement)
        } else {
            this.write('(', false, false)
            this.visitExpression(expression.body)
            this.write(')', false, false)
        }
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
                this.visitArrayPattern(param as Node.ArrayPattern)
                break;
            }
            case Syntax.ObjectPattern: {
                this.visitObjectPattern(param as Node.ObjectPattern)
                break;
            }
            case Syntax.RestElement: {
                this.vistiRestElement(param as Node.RestElement)
                break;
            }
            default:
                throw new TypeError("Type not handled : " + param.type)
        }
    }

    visitAssignmentPattern(expression: Node.AssignmentPattern): void {
        this.visitBinding(expression.left as Binding);
        this.write(' = ', false, false);
        this.visitExpression(expression.right)
    }

    visitBinding(binding: Binding) {
        if (binding == undefined || binding === null) {
            return;
        }

        if (binding instanceof Node.Identifier) {
            this.visitIdentifier(binding as Node.Identifier)
        } else if (binding instanceof Node.ArrayPattern) {
            this.visitArrayPattern(binding as Node.ArrayPattern)
        } else if (binding instanceof Node.ObjectPattern) {
            this.visitObjectPattern(binding as Node.ObjectPattern)
        } else {
            throw new TypeError("Type not handled")
        }
    }

    visitObjectPattern(node: Node.ObjectPattern): void {
        this.write('{', false, false);
        const elements = node.properties
        for (let i = 0; i < elements.length; ++i) {
            const pattern: Node.ObjectPatternProperty = elements[i]
            if (pattern) {
                this.visitExpression(pattern)
            }
            this.writeConditional(i < elements.length - 1, ', ', false, false)
        }
        this.write('}', false, false);
    }

    visitArrayPattern(node: Node.ArrayPattern): void {
        this.write('[', false, false);
        const elements = node.elements
        for (let i = 0; i < elements.length; ++i) {
            const pattern: Node.ArrayPatternElement = elements[i]
            if (pattern) {
                this.visitExpression(pattern)
            } else {
                this.write(', ', false, false)
                continue;
            }
            this.writeConditional(i < elements.length - 1, ', ', false, false)
        }
        this.write(']', false, false);
    }

    visitPropertyKey(key: Node.PropertyKey) {
        if (key instanceof Node.Identifier) {
            this.visitIdentifier(key as Node.Identifier)
        } else if (key instanceof Node.Literal) {
            this.visitLiteral(key as Node.Literal)
        } else if (key instanceof Node.BinaryExpression) {
            this.visitBinaryExpression(key as Node.BinaryExpression)
        } else {
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
        for (let i = 0; i < declarations.length; ++i) {
            this.visitVariableDeclarator(declarations[i] as Node.VariableDeclarator)
            this.writeConditional(i < declarations.length - 1, ', ', false, false)
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
}