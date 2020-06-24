import * as Node from "./nodes";


/**
 * A visitor for abstract syntax tree.
 */
export default interface ASTVisitor {

    /**
     * 
     * @param node V
     */
    visitScript(node: Node.Script): void;

    /**
     * 
     * @param node 
     */
    visitExpressionStatement(node: Node.ExpressionStatement): void;

    /**
     * 
     * @param node 
     */
    visitSequenceExpression(node: Node.SequenceExpression): void;

    /**
     * 
     * @param literal 
     */
    visitLiteral(literal: Node.Literal): void;

    /**
     * 
     * @param identifier 
     */
    visitIdentifier(identifier: Node.Identifier): void;

    /**
     * 
     * @param expression 
     */
    visitExpression(expression: Node.Expression): void;

    /**
     * 
     * @param expression 
     */
    visitAssignmentExpression(expression: Node.AssignmentExpression): void;
}
