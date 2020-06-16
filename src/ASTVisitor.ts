import ASTNode from "./ASTNode";

/**
 * A visitor for abstract syntax tree.
 */
export default class ASTVisitor {
    
    constructor(){

    }

    visit(ast: ASTNode): void {
        console.info('Generating : ' + JSON.stringify(ast, replacer))
    }
}

function replacer(key, value) { return value};