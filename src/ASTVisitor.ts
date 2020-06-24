import * as Node from "./nodes";


/**
 * A visitor for abstract syntax tree.
 */
export default abstract class ASTVisitor {

    /**
     * 
     * @param node V
     */
    abstract visitScript(node: Node.Script): void;

    /**
     * 
     * @param node 
     */
    abstract visitExpressionStatement(node: Node.ExpressionStatement): void;

    /**
     * 
     * @param node 
     */
    abstract visitSequenceExpression(node: Node.SequenceExpression): void;

    /**
     * 
     * @param literal 
     */
    abstract visitLiteral(literal: Node.Literal): void;

    /**
     * 
     * @param identifier 
     */
    abstract visitIdentifier(identifier: Node.Identifier): void;

    /**
     * 
     * @param expression 
     */
    abstract visitExpression(expression: Node.Expression): void;

    /**
     * 
     * @param expression 
     */
    abstract visitAssignmentExpression(expression: Node.AssignmentExpression): void;
}
