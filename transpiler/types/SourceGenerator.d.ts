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
export default class SourceGenerator {
    /**
     * Convert ASTNode back into sourcecode representation
     *
     * @param node
     */
    toSource(node: Node.Module): string
}
