import { ECMAScriptParserVisitor as DelvenVisitor } from "./parser/ECMAScriptParserVisitor";
import { RuleContext } from "antlr4/RuleContext";
import { CallSite } from "./trace";
export declare class PrintVisitor extends DelvenVisitor {
    log(ctx: RuleContext, frame: CallSite): void;
    visitProgram(ctx: RuleContext): any;
    visitSourceElement(ctx: RuleContext): any;
    visitStatement(ctx: RuleContext): any;
    visitBlock(ctx: RuleContext): any;
    visitStatementList(ctx: RuleContext): any;
    visitImportStatement(ctx: RuleContext): any;
    visitImportFromBlock(ctx: RuleContext): any;
    visitModuleItems(ctx: RuleContext): any;
    visitImportDefault(ctx: RuleContext): any;
    visitImportNamespace(ctx: RuleContext): any;
    visitImportFrom(ctx: RuleContext): any;
    visitAliasName(ctx: RuleContext): any;
    visitExportDeclaration(ctx: RuleContext): any;
    visitExportDefaultDeclaration(ctx: RuleContext): any;
    visitExportFromBlock(ctx: RuleContext): any;
    visitDeclaration(ctx: RuleContext): any;
    visitVariableStatement(ctx: RuleContext): any;
    visitVariableDeclarationList(ctx: RuleContext): any;
    visitVariableDeclaration(ctx: RuleContext): any;
    visitEmptyStatement(ctx: RuleContext): any;
    visitExpressionStatement(ctx: RuleContext): any;
    visitIfStatement(ctx: RuleContext): any;
    visitDoStatement(ctx: RuleContext): any;
    visitWhileStatement(ctx: RuleContext): any;
    visitForStatement(ctx: RuleContext): any;
    visitForInStatement(ctx: RuleContext): any;
    visitForOfStatement(ctx: RuleContext): any;
    visitVarModifier(ctx: RuleContext): any;
    visitContinueStatement(ctx: RuleContext): any;
    visitBreakStatement(ctx: RuleContext): any;
    visitReturnStatement(ctx: RuleContext): any;
    visitYieldStatement(ctx: RuleContext): any;
    visitWithStatement(ctx: RuleContext): any;
    visitSwitchStatement(ctx: RuleContext): any;
    visitCaseBlock(ctx: RuleContext): any;
    visitCaseClauses(ctx: RuleContext): any;
    visitCaseClause(ctx: RuleContext): any;
    visitDefaultClause(ctx: RuleContext): any;
    visitLabelledStatement(ctx: RuleContext): any;
    visitThrowStatement(ctx: RuleContext): any;
    visitTryStatement(ctx: RuleContext): any;
    visitCatchProduction(ctx: RuleContext): any;
    visitFinallyProduction(ctx: RuleContext): any;
    visitDebuggerStatement(ctx: RuleContext): any;
    visitFunctionDeclaration(ctx: RuleContext): any;
    visitClassDeclaration(ctx: RuleContext): any;
    visitClassTail(ctx: RuleContext): any;
    visitClassElement(ctx: RuleContext): any;
    visitMethodDefinition(ctx: RuleContext): any;
    visitFormalParameterList(ctx: RuleContext): any;
    visitFormalParameterArg(ctx: RuleContext): any;
    visitLastFormalParameterArg(ctx: RuleContext): any;
    visitFunctionBody(ctx: RuleContext): any;
    visitSourceElements(ctx: RuleContext): any;
    visitArrayLiteral(ctx: RuleContext): any;
    visitElementList(ctx: RuleContext): any;
    visitArrayElement(ctx: RuleContext): any;
    visitPropertyExpressionAssignment(ctx: RuleContext): any;
    visitComputedPropertyExpressionAssignment(ctx: RuleContext): any;
    visitFunctionProperty(ctx: RuleContext): any;
    visitPropertyGetter(ctx: RuleContext): any;
    visitPropertySetter(ctx: RuleContext): any;
    visitPropertyShorthand(ctx: RuleContext): any;
    visitPropertyName(ctx: RuleContext): any;
    visitArguments(ctx: RuleContext): any;
    visitArgument(ctx: RuleContext): any;
    visitExpressionSequence(ctx: RuleContext): any;
    visitTemplateStringExpression(ctx: RuleContext): any;
    visitTernaryExpression(ctx: RuleContext): any;
    visitLogicalAndExpression(ctx: RuleContext): any;
    visitPowerExpression(ctx: RuleContext): any;
    visitPreIncrementExpression(ctx: RuleContext): any;
    visitObjectLiteralExpression(ctx: RuleContext): any;
    visitMetaExpression(ctx: RuleContext): any;
    visitInExpression(ctx: RuleContext): any;
    visitLogicalOrExpression(ctx: RuleContext): any;
    visitNotExpression(ctx: RuleContext): any;
    visitPreDecreaseExpression(ctx: RuleContext): any;
    visitArgumentsExpression(ctx: RuleContext): any;
    visitAwaitExpression(ctx: RuleContext): any;
    visitThisExpression(ctx: RuleContext): any;
    visitFunctionExpression(ctx: RuleContext): any;
    visitUnaryMinusExpression(ctx: RuleContext): any;
    visitAssignmentExpression(ctx: RuleContext): any;
    visitPostDecreaseExpression(ctx: RuleContext): any;
    visitTypeofExpression(ctx: RuleContext): any;
    visitInstanceofExpression(ctx: RuleContext): any;
    visitUnaryPlusExpression(ctx: RuleContext): any;
    visitDeleteExpression(ctx: RuleContext): any;
    visitImportExpression(ctx: RuleContext): any;
    visitEqualityExpression(ctx: RuleContext): any;
    visitBitXOrExpression(ctx: RuleContext): any;
    visitSuperExpression(ctx: RuleContext): any;
    visitMultiplicativeExpression(ctx: RuleContext): any;
    visitBitShiftExpression(ctx: RuleContext): any;
    visitParenthesizedExpression(ctx: RuleContext): any;
    visitAdditiveExpression(ctx: RuleContext): any;
    visitRelationalExpression(ctx: RuleContext): any;
    visitPostIncrementExpression(ctx: RuleContext): any;
    visitYieldExpression(ctx: RuleContext): any;
    visitBitNotExpression(ctx: RuleContext): any;
    visitNewExpression(ctx: RuleContext): any;
    visitLiteralExpression(ctx: RuleContext): any;
    visitArrayLiteralExpression(ctx: RuleContext): any;
    visitMemberDotExpression(ctx: RuleContext): any;
    visitClassExpression(ctx: RuleContext): any;
    visitMemberIndexExpression(ctx: RuleContext): any;
    visitIdentifierExpression(ctx: RuleContext): any;
    visitBitAndExpression(ctx: RuleContext): any;
    visitBitOrExpression(ctx: RuleContext): any;
    visitAssignmentOperatorExpression(ctx: RuleContext): any;
    visitVoidExpression(ctx: RuleContext): any;
    visitCoalesceExpression(ctx: RuleContext): any;
    visitAssignable(ctx: RuleContext): any;
    visitObjectLiteral(ctx: RuleContext): any;
    visitFunctionDecl(ctx: RuleContext): any;
    visitAnoymousFunctionDecl(ctx: RuleContext): any;
    visitArrowFunction(ctx: RuleContext): any;
    visitArrowFunctionParameters(ctx: RuleContext): any;
    visitArrowFunctionBody(ctx: RuleContext): any;
    visitAssignmentOperator(ctx: RuleContext): any;
    visitLiteral(ctx: RuleContext): any;
    visitNumericLiteral(ctx: RuleContext): any;
    visitBigintLiteral(ctx: RuleContext): any;
    visitGetter(ctx: RuleContext): any;
    visitSetter(ctx: RuleContext): any;
    visitIdentifierName(ctx: RuleContext): any;
    visitIdentifier(ctx: RuleContext): any;
    visitReservedWord(ctx: RuleContext): any;
    visitKeyword(ctx: RuleContext): any;
    visitEos(ctx: RuleContext): any;
    visitChildrenXX(ctx: any): any;
}
