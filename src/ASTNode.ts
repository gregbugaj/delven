import ASTVisitor from "./ASTVisitor";

/**
 * Base class for AST node types
 */
export default abstract class ASTNode {
    /**
     * Visits this node and its children in an arbitrary order.
     * @param visitor 
     */
    visit(visitor: ASTVisitor): void {
        visitor.visit(this);
    }
}