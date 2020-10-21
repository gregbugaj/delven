import { isNullOrUndefined } from "util";
import ASTVisitor, { Binding } from "./ASTVisitor";
import * as Node from "./nodes";
import { hasParenthesis } from "./ParensUtil";
import { Syntax } from "./syntax";
import Utils from "./util";

/**
 * Source generator to transform valid AST back into ECMAScript
 * JS does not support overloading, so the visit methods need different names.
 * 
 * Usage
 * 
 * ```
 *  const generator = new SourceGenerator();
 *  const script = generator.toSource(ast);
 *  console.info('-------')
 *  console.info(script)
 * ```
 */
export default class SourceGeneratorWithBuilder {

    /**
     * Convert ASTNode back into sourcecode representation
     * 
     * @param node 
     */
    toSource(node: Node.Module): string {
        this.decorate(node, null, "")

        const visitor = new ExplicitASTNodeVisitor()
        visitor.visitModule(node)
        return visitor.buffer
    }

    /**
     * Decorate node with new properties `__path__` and `__parent__`
     * to provide additional information durning source transpilling
     * 
     * This will create circurall dependencies and will mess with tests 
     * if the `Util.toJson` is not used. 
     *  
     * @param node the node to decorate 
     * @param parent the partent node 
     * @param path the current path in the object graph
     */
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    decorate(node: any, parent: any | null, path: string): void {
        if (node == null || node == undefined) {
            return
        }
        const keys = Object.getOwnPropertyNames(node)
        for (const key in keys) {
            const name = keys[key];
            if (name.startsWith('__')) {
                continue
            } else if (name == 'type') {
                if (path === "") {
                    path = node[name]
                }
                else {
                    path += "." + node[name]
                }
                node['__parent__'] = parent
            } else if (typeof (node[name]) === 'object') {
                this.decorate(node[name], node, path)
            }
        }
    }
}

interface Doc {
    type: string
    value?: string
    parts?: Doc[],
}

class DocumentBuilder {
    node: Doc
    current: Doc
    groupIndex = 0

    constructor() {
        this.node = {
            type: 'group'
        }
        this.current = this.node
    }

    push(): void {
        console.info("PUSHING")
    }

    groupStart() {
        console.info("  groupStart  ")
        const group = { type: 'group' }
        if (this.node.parts === undefined) {
            this.node.parts = []
        }

        this.node.parts.push(group)
        this.current = group
        this.groupIndex++
    }

    groupEnd() {
        console.info("  groupEnd  ")
        if(this.node.parts !== undefined){
            this.current = this.node.parts[this.groupIndex]
        }

        this.groupIndex--
    }

    write(token: string): void {
        if (this.current?.parts === undefined) {
            this.current.parts = []
        }

        this.current.parts.push({ type: 'string', value: token })
        // console.info('---- STEP ----')
        // console.info(Utils.toJson(this.root))
        // console.info(Utils.toJson(this.root))
    }

    toSource() {
        console.info('---- Builder source ----')
        console.info(Utils.toJson(this.node))
        console.info(JSON.stringify(this.node))

        return "generated source"
    }
}

class ExplicitASTNodeVisitor extends ASTVisitor {
    private _buffer: string
    private indentation: number
    private indent_with: string
    private line: number
    private indent: string
    private builder: DocumentBuilder

    constructor() {
        super()

        this._buffer = ""
        this.indentation = 0
        this.indent_with = ""
        this.indent = ""
        this.line = 1

        this.builder = new DocumentBuilder()
    }

    get buffer(): string {
        const src = this.builder.toSource()
        console.info(src)
        return this._buffer;
    }

    private write(txt: string, useIndent: boolean, newline = false): void {
        this._buffer += this.indentation + " : " + txt;

        this.builder.write(txt)
    }

    private writeNewLine() {
        this.write('\n', false, false)
    }

    private writeConditional(condition: boolean, txt: string, useIndent: boolean, newline = false): void {
        if (condition) {
            this.write(txt, useIndent, newline)
        }
    }

    private indentDecrease() {
        this.indentation--;
    }

    private indentIncease() {
        this.indentation++;
    }

    visitModule(node: Node.Module): void {
        this.write("// Generated code", false, true)

        for (const stm of node.body) {
            this.visitStatement(stm)
        }
    }

    visitStatement(statement: Node.Declaration | Node.Statement) {

        switch (statement.type) {
            case Syntax.BlockStatement: {
                this.visitBlockStatement(statement as Node.BlockStatement)
                break
            } case Syntax.ExpressionStatement: {
                this.visitExpressionStatement(statement as Node.ExpressionStatement)
                break
            } case Syntax.VariableDeclaration: {
                this.visitVariableDeclaration(statement as Node.VariableDeclaration)
                break
            } case Syntax.ClassDeclaration: {
                this.visitClassDeclaration(statement as Node.ClassDeclaration)
                break
            } case Syntax.LabeledStatement: {
                this.visitLabeledStatement(statement as Node.LabeledStatement)
                break
            } case Syntax.ReturnStatement: {
                this.vistReturnStatement(statement as Node.ReturnStatement)
                break
            } case Syntax.IfStatement: {
                this.visitIfStatement(statement as Node.IfStatement)
                break
            } case Syntax.FunctionDeclaration: {
                this.visitFunctionDeclaration(statement as Node.FunctionDeclaration)
                break
            } case Syntax.SwitchStatement: {
                this.visitSwitchStatement(statement as Node.SwitchStatement)
                break
            } case Syntax.BreakStatement: {
                this.visitBreakStatement(statement as Node.BreakStatement)
                break
            } case Syntax.EmptyStatement: {
                this.visitEmptyStatement(statement as Node.EmptyStatement)
                break
            } case Syntax.TryStatement: {
                this.visitTryStatement(statement as Node.TryStatement)
                break
            } case Syntax.ThrowStatement: {
                this.visitThrowStatement(statement as Node.ThrowStatement)
                break
            } case Syntax.WhileStatement: {
                this.visitWhileStatement(statement as Node.WhileStatement)
                break
            } case Syntax.DoWhileStatement: {
                this.visitDoWhileStatement(statement as Node.DoWhileStatement)
                break
            } case Syntax.ForOfStatement: {
                this.visitForOfStatement(statement as Node.ForOfStatement)
                break
            } case Syntax.ForInStatement: {
                this.visitForInStatement(statement as Node.ForInStatement)
                break
            } case Syntax.ForStatement: {
                this.visitForStatement(statement as Node.ForStatement)
                break
            } case Syntax.ContinueStatement: {
                this.visitContinueStatement(statement as Node.ContinueStatement)
                break
            } case Syntax.ExportNamedDeclaration: {
                this.visitExportNamedDeclaration(statement as Node.ExportNamedDeclaration)
                break
            } case Syntax.ExportDefaultDeclaration: {
                this.visitExportDefaultDeclaration(statement as Node.ExportDefaultDeclaration)
                break
            } case Syntax.ExportAllDeclaration: {
                this.visitExportAllDeclaration(statement as Node.ExportAllDeclaration)
                break
            } case Syntax.ImportDeclaration: {
                this.visitImportDeclaration(statement as Node.ImportDeclaration)
                break
            } case Syntax.SelectStatement: {
                this.visitSelectStatement(statement as Node.SelectStatement)
                break
            } case Syntax.DebuggerStatement: {
                this.visitDebuggerStatement(statement as Node.DebuggerStatement)
                break
            }
            default:
                throw new TypeError("Type not handled : " + statement.type)
        }

        this.write('\n', false, false)
    }


    visitExpression(expression: Node.Expression): void {
        switch (expression.type) {
            case Syntax.SequenceExpression: {
                this.visitSequenceExpression(expression as Node.SequenceExpression)
                break
            } case Syntax.Literal: {
                this.visitLiteral(expression as Node.Literal)
                break
            } case Syntax.Identifier: {
                this.visitIdentifier(expression as Node.Identifier)
                break
            } case Syntax.SpreadElement: {
                this.vistSpreadElement(expression as Node.SpreadElement)
                break
            } case Syntax.AssignmentExpression: {
                this.visitAssignmentExpression(expression as Node.AssignmentExpression)
                break
            } case Syntax.ObjectExpression: {
                this.visitObjectExpression(expression as Node.ObjectExpression)
                break
            } case Syntax.ArrayExpression: {
                this.visitArrayExpression(expression as Node.ArrayExpression)
                break
            } case Syntax.BinaryExpression: {
                this.visitBinaryExpression(expression as Node.BinaryExpression)
                break
            } case Syntax.LogicalExpression: {
                this.visitLogicalExpression(expression as Node.BinaryExpression)
                break
            } case Syntax.ClassExpression: {
                this.visitClassExpression(expression as Node.ClassExpression)
                break
            } case Syntax.ArrowFunctionExpression: {
                this.visitArrowFunctionExpression(expression as Node.ArrowFunctionExpression)
                break
            } case Syntax.FunctionExpression: {
                this.visitFunctionExpression(expression as Node.FunctionExpression)
                break
            } case Syntax.CallExpression: {
                this.visitCallExpression(expression as Node.CallExpression)
                break
            } case Syntax.OptionalCallExpression: {
                this.visitOptionalCallExpression(expression as Node.OptionalCallExpression)
                break
            } case Syntax.MemberExpression: {
                this.visitMemberExpression(expression as Node.StaticMemberExpression | Node.ComputedMemberExpression)
                break
            } case Syntax.ThisExpression: {
                this.visitThisExpression(expression as Node.ThisExpression)
                break
            } case Syntax.UpdateExpression: {
                this.visitUpdateExpression(expression as Node.UpdateExpression)
                break
            } case Syntax.UnaryExpression: {
                this.visitUnaryExpression(expression as Node.UnaryExpression)
                break
            } case Syntax.NewExpression: {
                this.visitNewExpression(expression as Node.NewExpression)
                break
            } case Syntax.VariableDeclaration: {
                this.visitVariableDeclaration(expression as Node.VariableDeclaration)
                break
            } case Syntax.Property: {
                this.visitProperty(expression as Node.Property)
                break
            } case Syntax.ArrayPattern: {
                this.visitArrayPattern(expression as Node.ArrayPattern)
                break
            } case Syntax.ObjectPattern: {
                this.visitObjectPattern(expression as Node.ObjectPattern)
                break
            } case Syntax.AwaitExpression: {
                this.visitAwaitExpression(expression as Node.AwaitExpression)
                break
            } case Syntax.ConditionalExpression: {
                this.visitConditionalExpression(expression as Node.ConditionalExpression)
                break
            } case Syntax.AssignmentPattern: {
                this.visitAssignmentPattern(expression as Node.AssignmentPattern)
                break
            } case Syntax.Super: {
                this.visitSuper(expression as Node.Super)
                break
            } case Syntax.RestElement: {
                this.vistiRestElement(expression as Node.RestElement)
                break
            } case Syntax.YieldExpression: {
                this.visitYieldExpression(expression as Node.YieldExpression)
                break
            } case Syntax.MetaProperty: {
                this.visitMetaProperty(expression as Node.MetaProperty)
                break
            } case Syntax.OptionalMemberExpression: {
                this.visitOptionalMemberExpression(expression as Node.OptionalMemberExpression)
                break
            } case Syntax.TemplateLiteral: {
                this.visitTemplateLiteral(expression as Node.TemplateLiteral)
                break
            } case Syntax.TaggedTemplateExpression: {
                this.visitTaggedTemplateExpression(expression as Node.TaggedTemplateExpression)
                break
            }
            default:
                throw new TypeError("Type not handled : " + expression.type)
        }
    }

    visitTaggedTemplateExpression(expression: Node.TaggedTemplateExpression): void {
        this.assertNotNull(expression)
        this.visitExpression(expression.tag)
        this.visitTemplateLiteral(expression.quasi)
    }

    visitDebuggerStatement(statement: Node.DebuggerStatement): void {
        this.assertNotNull(statement)
        this.write('debugger ', false, false)
    }

    visitContinueStatement(statement: Node.ContinueStatement): void {
        this.assertNotNull(statement)
        this.write('continue ', false, false)

        if (statement.label) {
            this.write(' ', false, false)
            this.visitIdentifier(statement.label)
        }
    }

    visitSelectStatement(statement: Node.SelectStatement) {
        const body: Node.QueryExpression = statement.body;
        const from = body.from;
        const select = body.select;
        const where = body.where;

        // console.info(from)
        // console.info(select)
        // console.info(where)

        this.write('Select', false, false)
        this.write('([ ', false, false)
        for (let i = 0; i < select.projections.length; ++i) {
            const projection = select.projections[i];
            const expression = projection.expression
            this.writeNewLine()
            this.write('{expr: ', false, false)
            this.visitExpression(expression)

            if (projection.alias) {
                this.write(', alias: ', false, false)
                this.visitExpression(projection.alias)
            }

            this.write('}', false, false)
            this.writeConditional(i < select.projections.length - 1, ', ', false, false)
            this.writeNewLine()
        }

        this.write(']', false, false)
        this.write(')', false, false)

        if (from) {
            this.writeNewLine()
            const fce: Node.FromClauseElement = from.expressions[0]
            const exp = fce.expression;
            console.info(exp)
            console.info(from.expressions[0])
            this.write('.From', false, false)
            this.write('(', false, false)
            if (exp.type == Syntax.URIIdentifier) {
                this.write(`URIDataSource.of('${exp.uri}')`, false, false)
            }
            this.write(')', false, false)
        }

        if (where) {
            this.writeNewLine()
            this.write('.Where', false, false)
            this.write('((row)=> {', false, false)
            this.write('return (', false, false)
            this.visitExpression(where.expression)
            this.write(')', false, false)
            this.write('})', false, false)
        }
    }

    visitImportDeclaration(statement: Node.ImportDeclaration): void {
        this.assertNotNull(statement)
        this.write('import ', false, false)

        if (statement.specifiers && statement.specifiers.length > 0) {
            const specifiers: Node.ImportDeclarationSpecifier[] = statement.specifiers
            let hasImporSpec = false
            for (let i = 0; i < specifiers.length; ++i) {
                const specifier = specifiers[i]
                if (specifier.type === Syntax.ImportDefaultSpecifier) {
                    if (specifier.local) {
                        this.visitIdentifier(specifier.local)
                        this.write(' ', false, false)
                    }
                } else if (specifier.type === Syntax.ImportSpecifier) {
                    const is = specifier as Node.ImportSpecifier
                    this.writeConditional(hasImporSpec == false, '{', false, false)

                    if (is.local != null && is.imported) {
                        this.visitIdentifier(is.imported)
                        this.write(' as ', false, false)
                        this.visitIdentifier(is.local)
                    } else {
                        this.visitIdentifier(is.imported)
                    }

                    hasImporSpec = true
                } else if (specifier.type === Syntax.ImportNamespaceSpecifier) {
                    this.write('*', false, false)
                    this.write(' as ', false, false)
                    this.visitIdentifier(specifier.local)
                    this.write(' ', false, false)
                } else {
                    throw new TypeError("Unhandled type")
                }

                this.writeConditional(i < specifiers.length - 1, ', ', false, false)
            }

            this.writeConditional(hasImporSpec, '} ', false, false)
            this.write('from ', false, false)
        }

        this.visitLiteral(statement.source)
    }

    visitExportAllDeclaration(statement: Node.ExportAllDeclaration) {
        this.write('export * ', false, false)
        this.write('from ', false, false)
        this.visitLiteral(statement.source)
    }

    visitExportDefaultDeclaration(statement: Node.ExportDefaultDeclaration) {
        this.write('export default ', false, false)

        switch (statement.declaration.type) {
            case Syntax.FunctionDeclaration:
                this.visitFunctionDeclaration(statement.declaration as Node.FunctionDeclaration)
                break;
            default:
                this.visitExpression(statement.declaration)
        }
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

        this.write(')', false, false)
        this.visitStatement(statement.body)
    }


    visitForOfStatement(statement: Node.ForOfStatement) {
        this.write('for', false, false)
        this.writeConditional(statement.await, ' await ', false, false)
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
        this.write(' ', false, false)
        this.visitStatement(statement.body)
    }

    visitDoWhileStatement(statement: Node.DoWhileStatement) {
        this.write('do', false, false)
        this.write(' ', false, false)

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

        this.writeNewLine()
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
        const parens = hasParenthesis(expression.argument, 'argument')
        this.writeConditional(parens, "(", false, false)

        this.writeConditional(expression.prefix, expression.operator, false, false)
        this.visitExpression(expression.argument)
        this.writeConditional(!expression.prefix, expression.operator, false, false)

        this.writeConditional(parens, ")", false, false)
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
        this.assertNotNull(expression)

        this.write('class ', false, false)
        if (expression.id != null) {
            this.visitIdentifier(expression.id as Node.Identifier)
            // this.write('\n', false, false)
        }

        if (expression.superClass) {
            this.write(' extends ', false, false)
            const parens = hasParenthesis(expression.superClass, 'superClass')
            this.writeConditional(parens, "(", false, false)
            this.visitExpression(expression.superClass)
            this.writeConditional(parens, ")", false, false)
        }

        this.write('{ ', false, true)
        const clzBody: Node.ClassBody = expression.body

        for (let i = 0; i < clzBody.body.length; i++) {
            const property: Node.MethodDefinition | Node.EmptyStatement | Node.ClassPrivateProperty | Node.ClassProperty = clzBody.body[i]

            switch (property.type) {
                case Syntax.EmptyStatement: {
                    this.visitEmptyStatement(property as Node.EmptyStatement)
                    break
                }
                case Syntax.MethodDefinition: {
                    this.visitMethodDefinition(property as Node.MethodDefinition)
                    break
                }
                case Syntax.ClassPrivateProperty: {
                    this.visitClassPrivateProperty(property as Node.ClassPrivateProperty)
                    break
                } case Syntax.ClassProperty: {
                    this.visitClassProperty(property as Node.ClassProperty)
                    break
                }

                default: throw new TypeError("Type not handled  : " + property.type)
            }

            this.write('\n', false, false)
        }
        this.write('}', false, false)
    }

    visitClassPrivateProperty(property: Node.ClassPrivateProperty) {
        this.write('#', false, false)
        this.visitClassProperty(property as Node.ClassProperty)
    }

    visitClassProperty(property: Node.ClassProperty) {
        this.visitPropertyKey(property.id)
        this.write(' = ', false, false)
        this.visitExpression(property.expression)
    }

    visitMethodDefinition(expression: Node.MethodDefinition) {
        this.assertNotNull(expression)

        if (expression.value) {
            if (expression.value.type == Syntax.FunctionExpression) {

                if (expression.static) {
                    this.write('static', false, false)
                    this.write(' ', false, false)
                }

                if (expression.value.async) {
                    this.write('async', false, false)
                    this.write(' ', false, false)
                }

                if (expression.value.generator) {
                    this.write('*', false, false)
                }
            }
        }

        if (expression.kind === 'get' || expression.kind === 'set') {
            this.write(expression.kind, false, false)
            this.write(' ', false, false)
        }


        if (expression.key != null) {
            this.writeConditional(expression.computed, '[', false, false)
            this.visitPropertyKey(expression.key)
            this.writeConditional(expression.computed, ']', false, false)
        }

        if (expression.value) {
            if (expression.value.type == Syntax.FunctionExpression) {
                const value: Node.FunctionExpression = expression.value
                this.visitFunctionParameterArray(value.params)
                this.visitBlockStatement(value.body)
            } else {
                throw new TypeError("Unknow type")
            }
        }
    }

    visitBlockStatement(statement: Node.BlockStatement): void {
        this.assertNotNull(statement)

        if (statement.body.length == 0) {
            this.write("{}", false, false)
        } else {
            this.builder.groupStart()
            this.write("{", true, true)

            const body = statement.body;
            if (body != null) {
                for (let i = 0; i < body.length; ++i) {
                    this.visitStatement(body[i])
                }
            }

            this.write("}", true, false)
            this.builder.groupEnd()
        }
    }

    visitExpressionStatement(statement: Node.ExpressionStatement): void {
        const parens = hasParenthesis(statement.expression)

        this.writeConditional(parens, "(", false, false)
        this.visitExpression(statement.expression)
        this.writeConditional(parens, ")", false, false)
    }

    visitAssignmentExpression(expression: Node.AssignmentExpression): void {
        this.visitExpression(expression.left)
        this.write(" " + expression.operator + " ", false, false)
        this.visitExpression(expression.right)
    }

    visitSequenceExpression(sequence: Node.SequenceExpression): void {
        const parens = hasParenthesis(sequence)
        this.writeConditional(parens, '(', false, false)

        for (let i = 0; i < sequence.expressions.length; ++i) {
            this.visitExpression(sequence.expressions[i] as Node.Expression)
            if (i < sequence.expressions.length - 1) {
                this.write(", ", false, false)
            }
        }

        this.writeConditional(parens, ')', false, false)
    }


    visitTemplateLiteral(template: Node.TemplateLiteral): void {
        if (template.quasis.length === 0) {
            this.write('``', false, false)
        } else {
            this.write('`', false, false)
            for (let i = 0; i < template.quasis.length; ++i) {
                const quasi = template.quasis[i]
                this.write(quasi.value.raw, false, false)
                if (i < template.expressions.length) {
                    this.write('${', false, false)
                    this.visitExpression(template.expressions[i])
                    this.write('}', false, false)
                }
            }
            this.write('`', false, false)
        }
    }

    visitMetaProperty(expression: Node.MetaProperty): void {
        this.visitIdentifier(expression.meta)
        this.write('.', false, false)
        this.visitIdentifier(expression.property)
    }

    visitYieldExpression(expression: Node.YieldExpression): void {
        this.write('yield', false, false)

        if (expression.delegate) {
            this.write('*', false, false)
        }

        if (expression.argument) {
            this.write(' ', false, false)
            this.visitExpression(expression.argument)
        }
    }

    visitSuper(expression: Node.Super) {
        this.write('super', false, false)
    }

    visitConditionalExpression(expression: Node.ConditionalExpression): void {
        this.visitExpression(expression.test)
        this.write(' ? ', false, false)
        this.visitExpression(expression.consequent)
        this.write(' : ', false, false)
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
        const parens = hasParenthesis(expression.argument, 'argument')

        this.write(expression.operator, false, false)
        this.writeConditional(parens, '(', false, false)
        this.writeConditional((expression.operator === 'typeof' || expression.operator === 'void'), ' ', false, false)
        this.visitExpression(expression.argument)
        this.writeConditional(parens, ')', false, false)
    }

    visitNewExpression(expression: Node.NewExpression): void {
        const callee = expression.callee;
        const args = expression.arguments;

        this.write('new ', false, false)
        this.visitExpression(callee)
        this.visitParams(args)
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    visitThisExpression(expression: Node.ThisExpression) {
        this.write('this', false, false)
    }


    visitOptionalCallExpression(expression: Node.OptionalCallExpression) {
        this._visitCallExpression(expression)
    }

    visitCallExpression(expression: Node.CallExpression) {
        this._visitCallExpression(expression)
    }

    private _visitCallExpression(expression: Node.CallExpression | Node.OptionalCallExpression) {
        const args = expression.arguments;
        if (expression.callee.type == Syntax.FunctionExpression) {
            this.write('(', false, false)
            this.visitFunctionExpression(expression.callee as Node.FunctionExpression)
            this.write(')', false, false)
            this.visitParams(args)
        } else if (expression.callee.type == Syntax.Import) {
            this.write('import', false, false)
            this.visitParams(args)
        } else {
            this.visitExpression(expression.callee)
            this.visitParams(args)
        }
    }

    visitMemberExpression(expression: Node.StaticMemberExpression | Node.ComputedMemberExpression | Node.OptionalMemberExpression) {
        if (expression instanceof Node.StaticMemberExpression || expression instanceof Node.OptionalMemberExpression) {
            const isOptional = expression instanceof Node.OptionalMemberExpression
            this.visitExpression(expression.object)
            this.write(isOptional ? '?.' : '.', false, false)
            this.visitExpression(expression.property)
        } else if (expression instanceof Node.ComputedMemberExpression) {
            this.visitExpression(expression.object)
            this.write('[', false, false)
            this.visitExpression(expression.property)
            this.write(']', false, false)
        } else {
            throw new TypeError("Unhandled type : " + expression)
        }
    }

    visitOptionalMemberExpression(expression: Node.OptionalMemberExpression) {
        this.visitMemberExpression(expression)
    }

    visitParams(args: Node.ArgumentListElement[] | Node.FunctionParameter[]) {
        this.write('(', false, false)
        for (let i = 0; i < args.length; ++i) {
            const arg = args[i];
            if (arg instanceof Node.RestElement) {
                this.vistiRestElement(arg as Node.RestElement)
            } else {
                this.visitExpression(arg as Node.Expression)
            }
            this.write(i < args.length - 1 ? ', ' : '', false, false)
        }
        this.write(')', false, false)
    }


    visitFunctionDeclaration(expression: Node.FunctionDeclaration): void {
        this.builder.push()

        if (expression.async) {
            this.write(' async', false, false)
        }

        this.write(' function', false, false)

        if (expression.generator) {
            this.write('*', false, false)
        }

        this.write(' ', false, false)

        if (expression.id != null) {
            this.visitIdentifier(expression.id)
        }

        this.visitParams(expression.params)
        this.visitBlockStatement(expression.body)
        
        this.builder.push()
    }

    visitBinaryExpression(expression: Node.BinaryExpression): void {
        this.binaryExpression(expression)
    }

    visitLogicalExpression(expression: Node.BinaryExpression): void {
        this.binaryExpression(expression)
    }

    binaryExpression(expression: Node.BinaryExpression): void {

        const leftParen = hasParenthesis(expression.left, 'left')
        const rightParen = hasParenthesis(expression.right, 'right')

        this.writeConditional(leftParen, '(', false, false)
        this.visitExpression(expression.left)
        this.writeConditional(leftParen, ')', false, false)

        this.write(` ${expression.operator} `, false, false)

        this.writeConditional(rightParen, '(', false, false)
        this.visitExpression(expression.right)
        this.writeConditional(rightParen, ')', false, false)
    }

    visitArrayExpression(expression: Node.ArrayExpression): void {
        const elements: Node.ArrayExpressionElement[] = expression.elements
        this.write('[', false, false)
        for (let i = 0; i < elements.length; ++i) {
            const element: Node.ArrayExpressionElement = elements[i]//  Expression | SpreadElement | null;
            if (element == null) {
                // this.write('null', false, false)//
                this.write(' ', false, false)//
            } else if (element instanceof Node.RestElement) {
                this.vistiRestElement(element as Node.RestElement)
            } else {
                this.visitExpression(element as Node.Expression)
            }
            this.write(i < elements.length - 1 ? ', ' : '', false, false)
        }
        this.write(']', false, false)
    }

    vistSpreadElement(expression: Node.SpreadElement): void {
        const wrap = hasParenthesis(expression.argument, 'argument')
        this.write('...', false, false)
        this.writeConditional(wrap, '(', false, false)
        this.visitExpression(expression.argument)
        this.writeConditional(wrap, ')', false, false)
    }

    vistiRestElement(expression: Node.RestElement): void {
        this.write('...', false, false)
        this.visitExpression(expression.argument)
    }

    visitObjectExpression(expression: Node.ObjectExpression): void {
        const properties: Node.ObjectExpressionProperty[] = expression.properties
        if (expression.properties.length === 0) {
            this.write('{}', false, false)
        } else {

            this.write('{', false, false)
            for (let i = 0; i < properties.length; ++i) {
                this.visitObjectExpressionProperty(properties[i])
                this.write(i < properties.length - 1 ? ', ' : '', false, false)
            }
            this.write('}', false, false)
        }
    }


    visitObjectExpressionProperty(expression: Node.ObjectExpressionProperty): void {
        switch (expression.type) {
            case Syntax.Property: {
                const property = expression as Node.Property
                const key: Node.PropertyKey = property.key
                const value: Node.PropertyValue | null = property.value

                if ((property.method && property.kind === 'init') || property.kind === 'get' || property.kind === 'set') {
                    const method = new Node.MethodDefinition(key, property.computed, value as Node.FunctionExpression, property.kind, false)
                    this.visitMethodDefinition(method)
                } else {
                    if (property.shorthand) {
                        this.visitPropertyKey(key)
                    } else {
                        this.write(property.computed ? '[' : '', false, false)
                        this.visitPropertyKey(key)
                        this.write(property.computed ? ']' : '', false, false)
                        this.write(':', false, false)
                        this.visitPropertyValue(value)
                    }
                }
                break
            } case Syntax.SpreadElement: {
                const property = expression as Node.SpreadElement
                this.write('...', false, false)
                this.visitExpression(property.argument)
                break
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
                break
            } case Syntax.Literal: {
                this.visitLiteral(value as Node.Literal)
                break
            } case Syntax.Identifier: {
                this.visitIdentifier(value as Node.Identifier)
                break
            } case Syntax.ArrayPattern: {
                this.visitArrayPattern(value as Node.ArrayPattern)
                break
            } case Syntax.ObjectPattern: {
                this.visitObjectPattern(value as Node.ObjectPattern)
                break
            }
            case Syntax.FunctionExpression:
            case Syntax.ArrowFunctionExpression:
            case Syntax.ObjectExpression:
            case Syntax.ArrayExpression:
            case Syntax.BinaryExpression:
            case Syntax.LogicalExpression:
            case Syntax.UnaryExpression:
            case Syntax.MemberExpression: {
                this.visitExpression(value)
                break
            } default:
                throw new TypeError("Type not handled : " + value.type)
        }
    }

    visitFunctionParameterArray(params: Node.FunctionParameter[]): void {
        this.write('(', false, false)
        for (let i = 0; i < params.length; ++i) {
            this.visitFunctionParameter(params[i])
            this.write(i < params.length - 1 ? ', ' : '', false, false)
        }
        this.write(')', false, false)
    }

    visitFunctionExpression(expression: Node.FunctionExpression): void {
        if (expression.async) {
            this.write('async', false, false)
            this.write(' ', false, false)
        }

        this.write('function', false, false)

        if (expression.generator) {
            this.write('*', false, false)
        }

        this.write(' ', false, false)

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
            this.visitBlockStatement(expression.body)
        } else {
            const parens = hasParenthesis(expression.body, 'body')
            this.writeConditional(parens, '(', false, false)
            this.visitExpression(expression.body)
            this.writeConditional(parens, ')', false, false)
        }
    }

    visitFunctionParameter(param: Node.FunctionParameter): void {
        switch (param.type) {
            case Syntax.AssignmentPattern: {
                this.visitAssignmentPattern(param as Node.AssignmentPattern)
                break
            } case Syntax.Identifier: {
                this.visitIdentifier(param as Node.Identifier)
                break
            } case Syntax.ArrayPattern: {
                this.visitArrayPattern(param as Node.ArrayPattern)
                break
            } case Syntax.ObjectPattern: {
                this.visitObjectPattern(param as Node.ObjectPattern)
                break
            } case Syntax.RestElement: {
                this.vistiRestElement(param as Node.RestElement)
                break
            }
            default:
                throw new TypeError("Type not handled : " + param.type)
        }
    }

    visitAssignmentPattern(expression: Node.AssignmentPattern): void {
        this.visitBinding(expression.left as Binding)
        this.write(' = ', false, false)
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
        this.write('{', false, false)
        const elements = node.properties
        for (let i = 0; i < elements.length; ++i) {
            const pattern: Node.ObjectPatternProperty = elements[i]
            if (pattern) {
                this.visitExpression(pattern)
            }
            this.writeConditional(i < elements.length - 1, ', ', false, false)
        }
        this.write('}', false, false)
    }

    visitArrayPattern(node: Node.ArrayPattern): void {
        this.write('[', false, false)
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
        this.write(']', false, false)
    }

    visitPropertyKey(key: Node.PropertyKey) {
        if (key instanceof Node.Identifier) {
            this.visitIdentifier(key as Node.Identifier)
        } else if (key instanceof Node.Literal) {
            this.visitLiteral(key as Node.Literal)
        } else if (key instanceof Node.BinaryExpression) {
            this.visitBinaryExpression(key as Node.BinaryExpression)
        } else if (key instanceof Node.StaticMemberExpression) {
            this.visitMemberExpression(key as Node.StaticMemberExpression)
        } else {
            throw new TypeError("Not implemented : " + key.constructor)
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
        this.write(`${kind} `, true, false)
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
            this.write(' = ', false, false)
            this.visitExpression(init)
        }
    }

    /**
     * Asserts that a object is not null
     * 
     * @param condition 
     * @param message 
     */
    private assertNotNull(obj: any, message = 'Assertion failed'): void {
        if (isNullOrUndefined(obj)) {
            throw new TypeError(message)
        }
    }
}