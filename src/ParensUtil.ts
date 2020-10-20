import { Syntax } from "./syntax";

function isStatementOrDeclaration(node: any): boolean {
    if (node === null || node.type === null)
        return false
    const type = node.type
    return (
        type === Syntax.BlockStatement ||
        type === Syntax.BreakStatement ||
        type === Syntax.ClassBody ||
        type === Syntax.ClassDeclaration ||
        type === Syntax.ClassProperty ||
        type === Syntax.ClassPrivateProperty ||
        type === Syntax.ContinueStatement ||
        type === Syntax.DebuggerStatement ||
        type === Syntax.ClassDeclaration ||
        type === Syntax.ExportAllDeclaration ||
        type === Syntax.ExportDefaultDeclaration ||
        type === Syntax.ExportNamedDeclaration ||
        type === Syntax.FunctionDeclaration ||
        type === Syntax.VariableDeclaration ||
        type === Syntax.MethodDefinition ||
        type === Syntax.ImportDeclaration ||
        type === Syntax.DoWhileStatement ||
        type === Syntax.ReturnStatement ||
        type === Syntax.ExpressionStatement ||
        type === Syntax.ForInStatement ||
        type === Syntax.ForOfStatement ||
        type === Syntax.IfStatement ||
        type === Syntax.LabeledStatement ||
        type === Syntax.ReturnStatement ||
        type === Syntax.SwitchStatement ||
        type === Syntax.ThrowStatement ||
        type === Syntax.TryStatement ||
        type === Syntax.WhileStatement ||
        type === Syntax.WithStatement
    )
}
/**
 * Check if the node needs wrapping parentheses
 * 
 * @param node the node the check
 */
function needsParens(node: any): boolean {
    // Statements and Declarations don't need brackets
    if (isStatementOrDeclaration(node)) {
        return false
    }
    const type = node.type
    console.info('type >>  ' + type)
    const parent = node.__parent__
    console.info(`parent.type = ${parent.type}`)

    switch (node.type) {
        case Syntax.AssignmentExpression: {
            if (parent.type === Syntax.ExpressionStatement) {
                return node.left.type === Syntax.ObjectPattern
            } else if (parent.type == Syntax.AssignmentExpression) {
                return false
            }
            return true
        }

        case Syntax.Literal: {
            return false
        }

        case Syntax.BinaryExpression:
            {
                if (parent.type === Syntax.UpdateExpression) {
                    return true
                }

                break;
            }

        case Syntax.LogicalExpression: {

            return true;
        }
    }

    return false
}

export {
    needsParens
}