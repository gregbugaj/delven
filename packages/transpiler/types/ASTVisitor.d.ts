import * as Node from "./nodes";
export declare type Binding = Node.BindingIdentifier | Node.BindingPattern;
/**
 * A visitor for abstract syntax tree.
 */
export default abstract class ASTVisitor<T> {
    /**
     *
     * @param node the node we want to process
     */
    abstract visitModule(node: Node.Script): T;
    /**
     * Visit statement
     *
     * @param statement
     */
    abstract visitStatement(statement: Node.Declaration | Node.Statement): T;
    /**
     *
     * @param node
     */
    abstract visitExpressionStatement(node: Node.ExpressionStatement): T;
    /**
     *
     * @param node
     */
    abstract visitSequenceExpression(node: Node.SequenceExpression): T;
    /**
     *
     * @param literal
     */
    abstract visitLiteral(literal: Node.Literal): T;
    /**
     *
     * @param identifier
     */
    abstract visitIdentifier(identifier: Node.Identifier): T;
    /**
     *
     * @param expression
     */
    abstract visitExpression(expression: Node.Expression): T;
    /**
     *
     * @param expression
     */
    abstract visitAssignmentExpression(expression: Node.AssignmentExpression): T;
    /**
     *
     * @param declaration
     */
    abstract visitVariableDeclaration(declaration: Node.VariableDeclaration): T;
    /**
     *
     */
    abstract visitVariableDeclarator(node: Node.VariableDeclarator): T;
    /**
     *
     * @param node
     */
    abstract visitBlockStatement(node: Node.BlockStatement): T;
    /**
     *
     * @param expression
     */
    abstract visitObjectExpression(expression: Node.ObjectExpression): T;
    /**
     *
     * @param property
     */
    abstract visitObjectExpressionProperty(expression: Node.ObjectExpressionProperty): T;
    /**
     * @param expression
     */
    abstract visitArrowFunctionExpression(expression: Node.AsyncFunctionExpression): T;
    /**
     * @param expression
     */
    abstract visitFunctionExpression(expression: Node.FunctionExpression): T;
    /**
     *
     * @param param
     */
    abstract visitFunctionParameter(param: Node.FunctionParameter): T;
    /**
     *
     * @param expression
     */
    abstract visitAssignmentPattern(expression: Node.AssignmentPattern): T;
    /**
     *
     * @param node
     */
    abstract visitObjectPattern(node: Node.ObjectPattern): T;
    /**
     *
     * @param node
     */
    abstract visitArrayPattern(node: Node.ArrayPattern): T;
    /**
     *
     * @param expression
     */
    abstract visitArrayExpression(expression: Node.ArrayExpression): T;
    /**
     *
     * @param binding
     */
    abstract visitBinding(binding: Binding): T;
    /**
     *
     * @param expression
     */
    abstract visitRestElement(expression: Node.RestElement): T;
    /**
     *
     * @param expression
     */
    abstract visitSpreadElement(expression: Node.SpreadElement): T;
    /**
     *
     * @param expression
     */
    abstract visitBinaryExpression(expression: Node.BinaryExpression): T;
    /**
     *
     * @param expression
     */
    abstract visitLogicalExpression(expression: Node.BinaryExpression): T;
    /**
     *
     * @param expression
     */
    abstract visitClassDeclaration(expression: Node.ClassDeclaration): T;
    /**
     *
     * @param expression ]
     */
    abstract visitClassExpression(expression: Node.ClassExpression): T;
    /**
     *
     * @param expression
     */
    abstract visitCallExpression(expression: Node.CallExpression): T;
    /**
     *
     * @param expression
     */
    abstract visitFunctionDeclaration(expression: Node.FunctionDeclaration): T;
    /**
     *
     * @param expression
     */
    abstract visitMemberExpression(expression: Node.StaticMemberExpression | Node.ComputedMemberExpression): T;
    /**
     *
     * @param expression
     */
    abstract visitThisExpression(expression: Node.ThisExpression): T;
    /**
     *
     * @param expression
     */
    abstract visitUpdateExpression(expression: Node.UpdateExpression): T;
    /**
     *
     * @param node
     */
    abstract visitIfStatement(node: Node.IfStatement): T;
    /**
     *
     * @param statement
     */
    abstract visitSwitchStatement(statement: Node.SwitchStatement): T;
    /**
     *
     * @param _case
     */
    abstract visitSwitchCase(_case: Node.SwitchCase): T;
    /**
     *
     * @param statement
     */
    abstract visitBreakStatement(statement: Node.BreakStatement): T;
    /**
     *
     * @param statement
     */
    abstract visitEmptyStatement(statement: Node.EmptyStatement): T;
    /**
     *
     * @param statement
     */
    abstract visitTryStatement(statement: Node.TryStatement): T;
    /**
     *
     * @param handler
     */
    abstract visitCatchClause(handler: Node.CatchClause | null): T;
    /**
     *
     */
    abstract visitThrowStatement(statement: Node.ThrowStatement): T;
    /**
     *
     * @param expression
     */
    abstract visitNewExpression(expression: Node.NewExpression): T;
    /**
     *
     * @param statement
     */
    abstract visitWhileStatement(statement: Node.WhileStatement): T;
    /**
     *
     * @param statement
     */
    abstract visitDoWhileStatement(statement: Node.DoWhileStatement): T;
    /**
     *
     */
    abstract visitForOfStatement(statement: Node.ForOfStatement): T;
    /**
     *
     * @param statement
     */
    abstract visitForStatement(statement: Node.ForStatement): T;
    /**
     *
     * @param expression
     */
    abstract visitUnaryExpression(expression: Node.UnaryExpression): T;
    /**
     *
     * @param statement
     */
    abstract visitExportNamedDeclaration(statement: Node.ExportNamedDeclaration): T;
    /**
     *
     * @param expression
     */
    abstract visitAwaitExpression(expression: Node.AwaitExpression): T;
    /**
     *
     * @param expression
     */
    abstract visitConditionalExpression(expression: Node.ConditionalExpression): T;
    /**
     *
     * @param expression
     */
    abstract visitExportAllDeclaration(statement: Node.ExportAllDeclaration): T;
    /**
     *
     * @param statement
     */
    abstract visitImportDeclaration(statement: Node.ImportDeclaration): T;
    /**
     *
     * @param expression
     */
    abstract visitSuper(expression: Node.Super): T;
    /**
     *
     *  @param expression
     */
    abstract visitYieldExpression(expression: Node.YieldExpression): T;
    /**
     *
     * @param expression
     */
    abstract visitMetaProperty(expression: Node.MetaProperty): T;
    /**
     *
     * @param property
     */
    abstract visitClassPrivateProperty(property: Node.ClassPrivateProperty): T;
    /**
     *
     * @param property
     */
    abstract visitClassProperty(property: Node.ClassProperty): T;
    /**
     *
     * @param statement
     */
    abstract visitContinueStatement(statement: Node.ContinueStatement): T;
    /**
     *
     * @param statement
     */
    abstract visitOptionalMemberExpression(expression: Node.OptionalMemberExpression): T;
    /**
     *
     * @param expression
     */
    abstract visitOptionalCallExpression(expression: Node.OptionalCallExpression): T;
    /**
     *
     * @param template
     */
    abstract visitTemplateLiteral(template: Node.TemplateLiteral): T;
    /**
     *
     * @param statement
     */
    abstract visitDebuggerStatement(statement: Node.DebuggerStatement): T;
    /**
     *
     * @param expression
     */
    abstract visitTaggedTemplateExpression(expression: Node.TaggedTemplateExpression): T;
    /**
     *
     * @param statement
     */
    abstract visitSelectStatement(statement: Node.SelectStatement): T;
    /**
     * Visit query expression
     * @param statement
     */
    abstract visitQueryExpression(statement: Node.QueryExpression): T;
}
