import ASTNode from "./ASTNode";

/**
 * A visitor for abstract syntax tree.
 */
export default class ASTVisitor {

    constructor(){

    }

    visit(node: ASTNode): void {
        console.info(`Visiting node : ${node}`)
    }
}