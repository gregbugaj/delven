import { Syntax } from "./syntax";

// Parentisis logic based on 'prettier' project
const debug = true

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
 * Check if the node needs wrapping parenthesis
 * 
 * @param node the node the check
 */
function hasParenthesis(node: any, name?: string | null): boolean {
    const type = node.type
    const parent = node.__parent__

    if (debug) {
        console.debug(`type(current, parent, node) = ${type} > ${parent.type}  : ${name}`)
    }
    // Statements and Declarations don't need brackets
    if (isStatementOrDeclaration(node)) {
        return false
    }

    // Add parens around the extends clause of a class. 
    if ((parent.type === Syntax.ClassDeclaration || parent.type == Syntax.ClassExpression) &&
        parent.superClass == node && (
            node.type == Syntax.ArrowFunctionExpression ||
            node.type == Syntax.AssignmentExpression ||
            node.type == Syntax.AwaitExpression ||
            node.type == Syntax.BinaryExpression ||
            node.type == Syntax.ConditionalExpression ||
            node.type == Syntax.LogicalExpression ||
            node.type == Syntax.NewExpression ||
            node.type == Syntax.ObjectExpression ||
            node.type == Syntax.SequenceExpression ||
            node.type == Syntax.TaggedTemplateExpression ||
            node.type == Syntax.UnaryExpression ||
            node.type == Syntax.UpdateExpression ||
            node.type == Syntax.YieldExpression)
    ) {
        return true
    }

    
    switch (node.type) {
        case Syntax.Identifier:
        case Syntax.Literal:
            return false

        case Syntax.SpreadElement:
            return true

        case Syntax.UpdateExpression: {
            if (parent.type === Syntax.UnaryExpression) {
                return (node.prefix &&
                    ((node.operator === "++" && parent.operator === "+") ||
                        (node.operator === "--" && parent.operator === "-"))
                )
            } 
            // is this correct ?
            if (parent.type === Syntax.ExpressionStatement){
                return false
            }
        }

        // eslint-disable-next-line no-fallthrough
        case Syntax.AssignmentExpression: {
            if (parent.type === Syntax.ExpressionStatement) {
                return node.left.type === Syntax.ObjectPattern
            } else if (parent.type == Syntax.AssignmentExpression) {
                return false
            }
            return true
        }

        case Syntax.BinaryExpression: {
            if (parent.type === Syntax.UpdateExpression) {
                return true
            }
        }

        // eslint-disable-next-line no-fallthrough
        case Syntax.LogicalExpression: {
            switch (parent.type) {

                case Syntax.UnaryExpression:
                case Syntax.UpdateExpression:
                case Syntax.AwaitExpression:
                    return true

                // TODO : Implement operator precedence so we can do better than this
                case Syntax.BinaryExpression:
                    return true
                case Syntax.LogicalExpression: {
                    if (node.type == Syntax.LogicalExpression) {
                        return node.operator !== parent.operator
                    }
                }
                // eslint-disable-next-line no-fallthrough
                default:
                    return false
            }
        }

        case Syntax.ObjectExpression: {
            switch (parent.type) {
                case Syntax.ExpressionStatement:
                case Syntax.ArrowFunctionExpression:
                    return true
                default:
                    return false
            }
        }

        case Syntax.SequenceExpression: {
            switch (parent.type) {
                case Syntax.ReturnStatement:
                    return false
                case Syntax.ForStatement:
                    return false
                case Syntax.ExpressionStatement:
                    return name !== "expression"
                default:
                    return true
            }
        }

        // This is never hit as the code renders parens directry
        case Syntax.FunctionExpression: {
            return true;
        }

        case Syntax.ArrowFunctionExpression: {
            switch (parent.type) {
                case Syntax.NewExpression:
                case Syntax.CallExpression:
                case Syntax.MemberExpression:
                case Syntax.LogicalExpression:
                case Syntax.AwaitExpression:
                case Syntax.BinaryExpression:
                    return true
                default:
                    return false
            }
        }
    }

    return false
}

export {
    hasParenthesis
}