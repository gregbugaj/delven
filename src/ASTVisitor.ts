import * as Node from "./nodes";

export type Binding = Node.BindingIdentifier | Node.BindingPattern

/**
 * A visitor for abstract syntax tree.
 */
export default abstract class ASTVisitor {

    /**
     * 
     * @param node V
     */
    abstract visitModule(node: Node.Script): void

    /**
     * 
     * @param node 
     */
    abstract visitExpressionStatement(node: Node.ExpressionStatement): void

    /**
     * 
     * @param node 
     */
    abstract visitSequenceExpression(node: Node.SequenceExpression): void

    /**
     * 
     * @param literal 
     */
    abstract visitLiteral(literal: Node.Literal): void

    /**
     * 
     * @param identifier 
     */
    abstract visitIdentifier(identifier: Node.Identifier): void

    /**
     * 
     * @param expression 
     */
    abstract visitExpression(expression: Node.Expression): void

    /**
     * 
     * @param expression 
     */
    abstract visitAssignmentExpression(expression: Node.AssignmentExpression): void

    /**
     * 
     * @param declaration 
     */
    abstract visitVariableDeclaration(declaration: Node.VariableDeclaration): void

    /**
     * 
     */
    abstract visitVariableDeclarator(node: Node.VariableDeclarator): void

    /**
     * 
     * @param node 
     */
    abstract visitBlockStatement(node: Node.BlockStatement): void

    /**
     * 
     * @param expression 
     */
    abstract visitObjectExpression(expression: Node.ObjectExpression): void

    /**
     * 
     * @param property 
     */
    abstract visitObjectExpressionProperty(expression: Node.ObjectExpressionProperty): void

    /**
     * @param expression 
     */
    abstract visitArrowFunctionExpression(expression: Node.AsyncFunctionExpression): void

    /**
     * @param expression 
     */
    abstract visitFunctionExpression(expression: Node.FunctionExpression): void

    /**
     * 
     * @param param 
     */
    abstract visitFunctionParameter(param: Node.FunctionParameter): void

    /**
     * 
     * @param expression 
     */
    abstract visitAssignmentPattern(expression: Node.AssignmentPattern): void

    /**
     * 
     * @param node 
     */
    abstract visitObjectPattern(node: Node.ObjectPattern): void

    /**
     * 
     * @param node 
     */
    abstract visitArrayPattern(node: Node.ArrayPattern): void

    /**
     * 
     * @param expression 
     */
    abstract visitArrayExpression(expression: Node.ArrayExpression): void

    /**
     * 
     * @param binding 
     */
    abstract visitBinding(binding: Binding): void

    /**
     * 
     * @param expression 
     */
    abstract vistiRestElement(expression: Node.RestElement): void

    /**
     * 
     * @param expression 
     */
    abstract vistSpreadElement(expression: Node.SpreadElement): void

    /**
     * 
     * @param expression 
     */
    abstract visitBinaryExpression(expression: Node.BinaryExpression): void

    /**
     * 
     * @param expression 
     */
    abstract visitLogicalExpression(expression: Node.BinaryExpression): void

    /**
     * 
     * @param expression 
     */
    abstract visitClassDeclaration(expression: Node.ClassDeclaration): void

    /**
     * 
     * @param expression ]
     */
    abstract visitClassExpression(expression: Node.ClassExpression): void

    /**
     * 
     * @param expression 
     */
    abstract visitCallExpression(expression: Node.CallExpression): void

    /**
     * 
     * @param expression 
     */
    abstract visitFunctionDeclaration(expression: Node.FunctionDeclaration): void

    /**
     * 
     * @param expression 
     */
    abstract visitMemberExpression(expression: Node.StaticMemberExpression | Node.ComputedMemberExpression): void
    /**
     * 
     * @param expression 
     */
    abstract visitThisExpression(expression: Node.ThisExpression): void

    /**
     * 
     * @param expression 
     */
    abstract visitUpdateExpression(expression: Node.UpdateExpression): void

    /**
     * 
     * @param node 
     */
    abstract visitIfStatement(node: Node.IfStatement): void

    /**
     * 
     * @param statement 
     */
    abstract visitSwitchStatement(statement: Node.SwitchStatement): void

    /**
     * 
     * @param _case 
     */
    abstract visitSwitchCase(_case: Node.SwitchCase): void

    /**
     * 
     * @param statement 
     */
    abstract visitBreakStatement(statement: Node.BreakStatement): void

    /**
     * 
     * @param statement 
     */
    abstract visitEmptyStatement(statement: Node.EmptyStatement): void

    /**
     * 
     * @param statement 
     */
    abstract visitTryStatement(statement: Node.TryStatement): void

    /**
     * 
     * @param handler 
     */
    abstract visitCatchClause(handler: Node.CatchClause | null): void

    /**
     * 
     */
    abstract visitThrowStatement(statement: Node.ThrowStatement): void

    /**
     * 
     * @param expression 
     */
    abstract visitNewExpression(expression: Node.NewExpression): void

    /**
     * 
     * @param statement 
     */
    abstract visitWhileStatement(statement: Node.WhileStatement): void

    /**
     * 
     * @param statement 
     */
    abstract visitDoWhileStatement(statement: Node.DoWhileStatement): void

    /**
     * 
     */
    abstract visitForOfStatement(statement: Node.ForOfStatement): void

    /**
     * 
     * @param statement 
     */
    abstract visitForStatement(statement: Node.ForStatement): void

    /**
     * 
     * @param expression 
     */
    abstract visitUnaryExpression(expression: Node.UnaryExpression): void

    /**
     * 
     * @param statement 
     */
    abstract visitExportNamedDeclaration(statement: Node.ExportNamedDeclaration): void

    /**
     * 
     * @param expression 
     */
    abstract visitAwaitExpression(expression: Node.AwaitExpression): void

    /**
     * 
     * @param expression 
     */
    abstract visitConditionalExpression(expression: Node.ConditionalExpression): void

    /**
     * 
     * @param expression 
     */
    abstract visitExportAllDeclaration(statement: Node.ExportAllDeclaration): void

    /**
     * 
     * @param statement 
     */
    abstract visitImportDeclaration(statement: Node.ImportDeclaration): void

    /**
     * 
     * @param expression 
     */
    abstract visitSuper(expression: Node.Super): void

    /**
     * 
     *  @param expression 
     */
    abstract visitYieldExpression(expression: Node.YieldExpression): void

    /**
     * 
     * @param expression 
     */
    abstract visitMetaProperty(expression: Node.MetaProperty): void

    /**
     * 
     * @param property 
     */
    abstract visitClassPrivateProperty(property: Node.ClassPrivateProperty): void

    /**
     * 
     * @param property 
     */
    abstract visitClassProperty(property: Node.ClassProperty): void

    /**
     * 
     * @param statement 
     */
    abstract visitContinueStatement(statement: Node.ContinueStatement): void

    /**
     * 
     * @param statement 
     */
    abstract visitOptionalMemberExpression(expression: Node.OptionalMemberExpression): void

    /**
     * 
     * @param expression 
     */
    abstract visitOptionalCallExpression(expression: Node.OptionalCallExpression): void

    /**
     * 
     * @param template 
     */
    abstract visitTemplateLiteral(template: Node.TemplateLiteral): void

    /**
     * 
     * @param statement 
     */
    abstract visitDebuggerStatement(statement: Node.DebuggerStatement): void

    /**
     * 
     * @param expression 
     */
    abstract visitTaggedTemplateExpression(expression: Node.TaggedTemplateExpression): void
}
