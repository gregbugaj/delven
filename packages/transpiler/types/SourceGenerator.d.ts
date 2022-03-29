import * as Node from "./nodes"
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
    toSource(node: Node.Module): string
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
    decorate(node: any, parent: any | null, path: string): void
}
