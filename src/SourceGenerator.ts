import ASTVisitor from "./ASTVisitor";
import ASTNode from "./ASTNode";

/**
 * Source generator to transform valid AST back into ECMAScript
 */
export default class SourceGenerator extends ASTVisitor {

    constructor() {
        super();
    }

    /**
     * Convert ASTNode back into sourcecode representation
     * 
     * @param node 
     */
    public toSource(node: ASTNode): void {
        
    }

    toString() {
        return "Generated";
    }
}


class ExplicitASTNodeVisitor  {
    constructor() {
    }
}