export var ECMAScriptParserVisitor: typeof ECMAScriptParserVisitor;
declare function ECMAScriptParserVisitor(): any;
declare class ECMAScriptParserVisitor {
    constructor: typeof ECMAScriptParserVisitor;
    visitProgram(ctx: any): any;
    visitSourceElement(ctx: any): any;
    visitStatement(ctx: any): any;
    visitBlock(ctx: any): any;
    visitStatementList(ctx: any): any;
    visitImportStatement(ctx: any): any;
    visitImportFromBlock(ctx: any): any;
    visitModuleItems(ctx: any): any;
    visitImportDefault(ctx: any): any;
    visitImportNamespace(ctx: any): any;
    visitImportFrom(ctx: any): any;
    visitAliasName(ctx: any): any;
    visitExportDeclaration(ctx: any): any;
    visitExportDefaultDeclaration(ctx: any): any;
    visitExportFromBlock(ctx: any): any;
    visitDeclaration(ctx: any): any;
    visitVariableStatement(ctx: any): any;
    visitVariableDeclarationList(ctx: any): any;
    visitVariableDeclaration(ctx: any): any;
    visitEmptyStatement(ctx: any): any;
    visitExpressionStatement(ctx: any): any;
    visitIfStatement(ctx: any): any;
    visitDoStatement(ctx: any): any;
    visitWhileStatement(ctx: any): any;
    visitForStatement(ctx: any): any;
    visitForInStatement(ctx: any): any;
    visitForOfStatement(ctx: any): any;
    visitVarModifier(ctx: any): any;
    visitContinueStatement(ctx: any): any;
    visitBreakStatement(ctx: any): any;
    visitReturnStatement(ctx: any): any;
    visitWithStatement(ctx: any): any;
    visitSwitchStatement(ctx: any): any;
    visitCaseBlock(ctx: any): any;
    visitCaseClauses(ctx: any): any;
    visitCaseClause(ctx: any): any;
    visitDefaultClause(ctx: any): any;
    visitLabelledStatement(ctx: any): any;
    visitThrowStatement(ctx: any): any;
    visitTryStatement(ctx: any): any;
    visitCatchProduction(ctx: any): any;
    visitFinallyProduction(ctx: any): any;
    visitDebuggerStatement(ctx: any): any;
    visitFunctionDeclaration(ctx: any): any;
    visitClassDeclaration(ctx: any): any;
    visitClassTail(ctx: any): any;
    visitClassHeritage(ctx: any): any;
    visitClassElement(ctx: any): any;
    visitMethodDefinition(ctx: any): any;
    visitFormalParameterList(ctx: any): any;
    visitFormalParameterArg(ctx: any): any;
    visitLastFormalParameterArg(ctx: any): any;
    visitFunctionBody(ctx: any): any;
    visitSourceElements(ctx: any): any;
    visitArrayLiteral(ctx: any): any;
    visitElementList(ctx: any): any;
    visitArrayElement(ctx: any): any;
    visitPropertyExpressionAssignment(ctx: any): any;
    visitComputedPropertyExpressionAssignment(ctx: any): any;
    visitFunctionProperty(ctx: any): any;
    visitPropertyGetter(ctx: any): any;
    visitPropertySetter(ctx: any): any;
    visitPropertyShorthand(ctx: any): any;
    visitPropertyName(ctx: any): any;
    visitArguments(ctx: any): any;
    visitArgument(ctx: any): any;
    visitExpressionSequence(ctx: any): any;
    visitTemplateStringExpression(ctx: any): any;
    visitTernaryExpression(ctx: any): any;
    visitLogicalAndExpression(ctx: any): any;
    visitPowerExpression(ctx: any): any;
    visitPreIncrementExpression(ctx: any): any;
    visitObjectLiteralExpression(ctx: any): any;
    visitMetaExpression(ctx: any): any;
    visitInExpression(ctx: any): any;
    visitLogicalOrExpression(ctx: any): any;
    visitNotExpression(ctx: any): any;
    visitPreDecreaseExpression(ctx: any): any;
    visitArgumentsExpression(ctx: any): any;
    visitAwaitExpression(ctx: any): any;
    visitThisExpression(ctx: any): any;
    visitFunctionExpression(ctx: any): any;
    visitUnaryMinusExpression(ctx: any): any;
    visitAssignmentExpression(ctx: any): any;
    visitPostDecreaseExpression(ctx: any): any;
    visitMemberNewExpression(ctx: any): any;
    visitTypeofExpression(ctx: any): any;
    visitInstanceofExpression(ctx: any): any;
    visitUnaryPlusExpression(ctx: any): any;
    visitDeleteExpression(ctx: any): any;
    visitInlinedQueryExpression(ctx: any): any;
    visitImportExpression(ctx: any): any;
    visitEqualityExpression(ctx: any): any;
    visitBitXOrExpression(ctx: any): any;
    visitSuperExpression(ctx: any): any;
    visitMultiplicativeExpression(ctx: any): any;
    visitBitShiftExpression(ctx: any): any;
    visitParenthesizedExpression(ctx: any): any;
    visitAdditiveExpression(ctx: any): any;
    visitRelationalExpression(ctx: any): any;
    visitPostIncrementExpression(ctx: any): any;
    visitYieldExpression(ctx: any): any;
    visitBitNotExpression(ctx: any): any;
    visitNewExpression(ctx: any): any;
    visitLiteralExpression(ctx: any): any;
    visitArrayLiteralExpression(ctx: any): any;
    visitMemberDotExpression(ctx: any): any;
    visitClassExpression(ctx: any): any;
    visitMemberIndexExpression(ctx: any): any;
    visitIdentifierExpression(ctx: any): any;
    visitBitAndExpression(ctx: any): any;
    visitBitOrExpression(ctx: any): any;
    visitAssignmentOperatorExpression(ctx: any): any;
    visitVoidExpression(ctx: any): any;
    visitCoalesceExpression(ctx: any): any;
    visitAssignable(ctx: any): any;
    visitObjectLiteral(ctx: any): any;
    visitFunctionDecl(ctx: any): any;
    visitAnoymousFunctionDecl(ctx: any): any;
    visitArrowFunction(ctx: any): any;
    visitArrowFunctionParameters(ctx: any): any;
    visitArrowFunctionBody(ctx: any): any;
    visitAssignmentOperator(ctx: any): any;
    visitLiteral(ctx: any): any;
    visitNumericLiteral(ctx: any): any;
    visitBigintLiteral(ctx: any): any;
    visitGetter(ctx: any): any;
    visitSetter(ctx: any): any;
    visitIdentifierName(ctx: any): any;
    visitIdentifier(ctx: any): any;
    visitReservedWord(ctx: any): any;
    visitKeyword(ctx: any): any;
    visitEos(ctx: any): any;
    visitQuerySelectStatement(ctx: any): any;
    visitQueryExpression(ctx: any): any;
    visitQueryUnionExpression(ctx: any): any;
    visitQuerySelectExpression(ctx: any): any;
    visitQuerySelectListExpression(ctx: any): any;
    visitSelect_list_elem(ctx: any): any;
    visitQueryFromExpression(ctx: any): any;
    visitQueryWhereExpression(ctx: any): any;
    visitQueryDataSourcesExpression(ctx: any): any;
    visitDataSource(ctx: any): any;
    visitQueryDataSourceExpression(ctx: any): any;
    visitQueryDataSourceItemUrlExpression(ctx: any): any;
    visitQueryDataSourceItemArgumentsExpression(ctx: any): any;
    visitQueryDataSourceItemIdentifierExpression(ctx: any): any;
    visitQueryDataSourceItemSubqueryExpression(ctx: any): any;
    visitQueryJoinCrossApplyExpression(ctx: any): any;
    visitQueryJoinOnExpression(ctx: any): any;
    visitQuerySourceUsingLiteralExpression(ctx: any): any;
    visitQuerySourceUsingSingleExpression(ctx: any): any;
    visitQueryProduceExpression(ctx: any): any;
    visitQueryBindExpression(ctx: any): any;
    visitQueryWithinExpression(ctx: any): any;
    visitQueryObjectLiteral(ctx: any): any;
    visitQueryPropertyAssignment(ctx: any): any;
}
export {};
