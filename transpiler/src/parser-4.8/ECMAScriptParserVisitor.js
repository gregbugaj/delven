// Generated from ECMAScriptParser.g4 by ANTLR 4.8
// jshint ignore: start
var antlr4 = require('antlr4');

// This class defines a complete generic visitor for a parse tree produced by ECMAScriptParser.

function ECMAScriptParserVisitor() {
	antlr4.tree.ParseTreeVisitor.call(this);
	return this;
}

ECMAScriptParserVisitor.prototype = Object.create(antlr4.tree.ParseTreeVisitor.prototype);
ECMAScriptParserVisitor.prototype.constructor = ECMAScriptParserVisitor;

// Visit a parse tree produced by ECMAScriptParser#program.
ECMAScriptParserVisitor.prototype.visitProgram = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#sourceElement.
ECMAScriptParserVisitor.prototype.visitSourceElement = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#statement.
ECMAScriptParserVisitor.prototype.visitStatement = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#block.
ECMAScriptParserVisitor.prototype.visitBlock = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#statementList.
ECMAScriptParserVisitor.prototype.visitStatementList = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#importStatement.
ECMAScriptParserVisitor.prototype.visitImportStatement = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#importFromBlock.
ECMAScriptParserVisitor.prototype.visitImportFromBlock = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#moduleItems.
ECMAScriptParserVisitor.prototype.visitModuleItems = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#importDefault.
ECMAScriptParserVisitor.prototype.visitImportDefault = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#importNamespace.
ECMAScriptParserVisitor.prototype.visitImportNamespace = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#importFrom.
ECMAScriptParserVisitor.prototype.visitImportFrom = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#aliasName.
ECMAScriptParserVisitor.prototype.visitAliasName = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#ExportDeclaration.
ECMAScriptParserVisitor.prototype.visitExportDeclaration = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#ExportDefaultDeclaration.
ECMAScriptParserVisitor.prototype.visitExportDefaultDeclaration = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#exportFromBlock.
ECMAScriptParserVisitor.prototype.visitExportFromBlock = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#declaration.
ECMAScriptParserVisitor.prototype.visitDeclaration = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#variableStatement.
ECMAScriptParserVisitor.prototype.visitVariableStatement = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#variableDeclarationList.
ECMAScriptParserVisitor.prototype.visitVariableDeclarationList = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#variableDeclaration.
ECMAScriptParserVisitor.prototype.visitVariableDeclaration = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#emptyStatement.
ECMAScriptParserVisitor.prototype.visitEmptyStatement = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#expressionStatement.
ECMAScriptParserVisitor.prototype.visitExpressionStatement = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#ifStatement.
ECMAScriptParserVisitor.prototype.visitIfStatement = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#DoStatement.
ECMAScriptParserVisitor.prototype.visitDoStatement = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#WhileStatement.
ECMAScriptParserVisitor.prototype.visitWhileStatement = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#ForStatement.
ECMAScriptParserVisitor.prototype.visitForStatement = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#ForInStatement.
ECMAScriptParserVisitor.prototype.visitForInStatement = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#ForOfStatement.
ECMAScriptParserVisitor.prototype.visitForOfStatement = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#varModifier.
ECMAScriptParserVisitor.prototype.visitVarModifier = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#continueStatement.
ECMAScriptParserVisitor.prototype.visitContinueStatement = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#breakStatement.
ECMAScriptParserVisitor.prototype.visitBreakStatement = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#returnStatement.
ECMAScriptParserVisitor.prototype.visitReturnStatement = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#withStatement.
ECMAScriptParserVisitor.prototype.visitWithStatement = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#switchStatement.
ECMAScriptParserVisitor.prototype.visitSwitchStatement = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#caseBlock.
ECMAScriptParserVisitor.prototype.visitCaseBlock = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#caseClauses.
ECMAScriptParserVisitor.prototype.visitCaseClauses = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#caseClause.
ECMAScriptParserVisitor.prototype.visitCaseClause = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#defaultClause.
ECMAScriptParserVisitor.prototype.visitDefaultClause = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#labelledStatement.
ECMAScriptParserVisitor.prototype.visitLabelledStatement = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#throwStatement.
ECMAScriptParserVisitor.prototype.visitThrowStatement = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#tryStatement.
ECMAScriptParserVisitor.prototype.visitTryStatement = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#catchProduction.
ECMAScriptParserVisitor.prototype.visitCatchProduction = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#finallyProduction.
ECMAScriptParserVisitor.prototype.visitFinallyProduction = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#debuggerStatement.
ECMAScriptParserVisitor.prototype.visitDebuggerStatement = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#functionDeclaration.
ECMAScriptParserVisitor.prototype.visitFunctionDeclaration = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#classDeclaration.
ECMAScriptParserVisitor.prototype.visitClassDeclaration = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#classTail.
ECMAScriptParserVisitor.prototype.visitClassTail = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#classHeritage.
ECMAScriptParserVisitor.prototype.visitClassHeritage = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#classElement.
ECMAScriptParserVisitor.prototype.visitClassElement = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#methodDefinition.
ECMAScriptParserVisitor.prototype.visitMethodDefinition = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#formalParameterList.
ECMAScriptParserVisitor.prototype.visitFormalParameterList = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#formalParameterArg.
ECMAScriptParserVisitor.prototype.visitFormalParameterArg = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#lastFormalParameterArg.
ECMAScriptParserVisitor.prototype.visitLastFormalParameterArg = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#functionBody.
ECMAScriptParserVisitor.prototype.visitFunctionBody = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#sourceElements.
ECMAScriptParserVisitor.prototype.visitSourceElements = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#arrayLiteral.
ECMAScriptParserVisitor.prototype.visitArrayLiteral = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#elementList.
ECMAScriptParserVisitor.prototype.visitElementList = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#arrayElement.
ECMAScriptParserVisitor.prototype.visitArrayElement = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#PropertyExpressionAssignment.
ECMAScriptParserVisitor.prototype.visitPropertyExpressionAssignment = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#ComputedPropertyExpressionAssignment.
ECMAScriptParserVisitor.prototype.visitComputedPropertyExpressionAssignment = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#FunctionProperty.
ECMAScriptParserVisitor.prototype.visitFunctionProperty = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#PropertyGetter.
ECMAScriptParserVisitor.prototype.visitPropertyGetter = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#PropertySetter.
ECMAScriptParserVisitor.prototype.visitPropertySetter = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#PropertyShorthand.
ECMAScriptParserVisitor.prototype.visitPropertyShorthand = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#propertyName.
ECMAScriptParserVisitor.prototype.visitPropertyName = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#arguments.
ECMAScriptParserVisitor.prototype.visitArguments = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#argument.
ECMAScriptParserVisitor.prototype.visitArgument = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#expressionSequence.
ECMAScriptParserVisitor.prototype.visitExpressionSequence = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#TemplateStringExpression.
ECMAScriptParserVisitor.prototype.visitTemplateStringExpression = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#TernaryExpression.
ECMAScriptParserVisitor.prototype.visitTernaryExpression = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#LogicalAndExpression.
ECMAScriptParserVisitor.prototype.visitLogicalAndExpression = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#PowerExpression.
ECMAScriptParserVisitor.prototype.visitPowerExpression = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#PreIncrementExpression.
ECMAScriptParserVisitor.prototype.visitPreIncrementExpression = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#ObjectLiteralExpression.
ECMAScriptParserVisitor.prototype.visitObjectLiteralExpression = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#MetaExpression.
ECMAScriptParserVisitor.prototype.visitMetaExpression = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#InExpression.
ECMAScriptParserVisitor.prototype.visitInExpression = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#LogicalOrExpression.
ECMAScriptParserVisitor.prototype.visitLogicalOrExpression = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#NotExpression.
ECMAScriptParserVisitor.prototype.visitNotExpression = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#PreDecreaseExpression.
ECMAScriptParserVisitor.prototype.visitPreDecreaseExpression = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#ArgumentsExpression.
ECMAScriptParserVisitor.prototype.visitArgumentsExpression = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#AwaitExpression.
ECMAScriptParserVisitor.prototype.visitAwaitExpression = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#ThisExpression.
ECMAScriptParserVisitor.prototype.visitThisExpression = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#FunctionExpression.
ECMAScriptParserVisitor.prototype.visitFunctionExpression = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#UnaryMinusExpression.
ECMAScriptParserVisitor.prototype.visitUnaryMinusExpression = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#AssignmentExpression.
ECMAScriptParserVisitor.prototype.visitAssignmentExpression = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#PostDecreaseExpression.
ECMAScriptParserVisitor.prototype.visitPostDecreaseExpression = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#MemberNewExpression.
ECMAScriptParserVisitor.prototype.visitMemberNewExpression = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#TypeofExpression.
ECMAScriptParserVisitor.prototype.visitTypeofExpression = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#InstanceofExpression.
ECMAScriptParserVisitor.prototype.visitInstanceofExpression = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#UnaryPlusExpression.
ECMAScriptParserVisitor.prototype.visitUnaryPlusExpression = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#DeleteExpression.
ECMAScriptParserVisitor.prototype.visitDeleteExpression = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#InlinedQueryExpression.
ECMAScriptParserVisitor.prototype.visitInlinedQueryExpression = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#ImportExpression.
ECMAScriptParserVisitor.prototype.visitImportExpression = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#EqualityExpression.
ECMAScriptParserVisitor.prototype.visitEqualityExpression = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#BitXOrExpression.
ECMAScriptParserVisitor.prototype.visitBitXOrExpression = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#SuperExpression.
ECMAScriptParserVisitor.prototype.visitSuperExpression = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#MultiplicativeExpression.
ECMAScriptParserVisitor.prototype.visitMultiplicativeExpression = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#BitShiftExpression.
ECMAScriptParserVisitor.prototype.visitBitShiftExpression = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#ParenthesizedExpression.
ECMAScriptParserVisitor.prototype.visitParenthesizedExpression = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#AdditiveExpression.
ECMAScriptParserVisitor.prototype.visitAdditiveExpression = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#RelationalExpression.
ECMAScriptParserVisitor.prototype.visitRelationalExpression = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#PostIncrementExpression.
ECMAScriptParserVisitor.prototype.visitPostIncrementExpression = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#YieldExpression.
ECMAScriptParserVisitor.prototype.visitYieldExpression = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#BitNotExpression.
ECMAScriptParserVisitor.prototype.visitBitNotExpression = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#NewExpression.
ECMAScriptParserVisitor.prototype.visitNewExpression = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#LiteralExpression.
ECMAScriptParserVisitor.prototype.visitLiteralExpression = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#ArrayLiteralExpression.
ECMAScriptParserVisitor.prototype.visitArrayLiteralExpression = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#MemberDotExpression.
ECMAScriptParserVisitor.prototype.visitMemberDotExpression = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#ClassExpression.
ECMAScriptParserVisitor.prototype.visitClassExpression = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#MemberIndexExpression.
ECMAScriptParserVisitor.prototype.visitMemberIndexExpression = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#IdentifierExpression.
ECMAScriptParserVisitor.prototype.visitIdentifierExpression = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#BitAndExpression.
ECMAScriptParserVisitor.prototype.visitBitAndExpression = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#BitOrExpression.
ECMAScriptParserVisitor.prototype.visitBitOrExpression = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#AssignmentOperatorExpression.
ECMAScriptParserVisitor.prototype.visitAssignmentOperatorExpression = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#VoidExpression.
ECMAScriptParserVisitor.prototype.visitVoidExpression = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#CoalesceExpression.
ECMAScriptParserVisitor.prototype.visitCoalesceExpression = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#assignable.
ECMAScriptParserVisitor.prototype.visitAssignable = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#objectLiteral.
ECMAScriptParserVisitor.prototype.visitObjectLiteral = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#FunctionDecl.
ECMAScriptParserVisitor.prototype.visitFunctionDecl = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#AnoymousFunctionDecl.
ECMAScriptParserVisitor.prototype.visitAnoymousFunctionDecl = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#ArrowFunction.
ECMAScriptParserVisitor.prototype.visitArrowFunction = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#arrowFunctionParameters.
ECMAScriptParserVisitor.prototype.visitArrowFunctionParameters = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#arrowFunctionBody.
ECMAScriptParserVisitor.prototype.visitArrowFunctionBody = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#assignmentOperator.
ECMAScriptParserVisitor.prototype.visitAssignmentOperator = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#literal.
ECMAScriptParserVisitor.prototype.visitLiteral = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#numericLiteral.
ECMAScriptParserVisitor.prototype.visitNumericLiteral = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#bigintLiteral.
ECMAScriptParserVisitor.prototype.visitBigintLiteral = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#getter.
ECMAScriptParserVisitor.prototype.visitGetter = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#setter.
ECMAScriptParserVisitor.prototype.visitSetter = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#identifierName.
ECMAScriptParserVisitor.prototype.visitIdentifierName = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#identifier.
ECMAScriptParserVisitor.prototype.visitIdentifier = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#reservedWord.
ECMAScriptParserVisitor.prototype.visitReservedWord = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#keyword.
ECMAScriptParserVisitor.prototype.visitKeyword = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#eos.
ECMAScriptParserVisitor.prototype.visitEos = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#querySelectStatement.
ECMAScriptParserVisitor.prototype.visitQuerySelectStatement = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#queryExpression.
ECMAScriptParserVisitor.prototype.visitQueryExpression = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#QueryUnionExpression.
ECMAScriptParserVisitor.prototype.visitQueryUnionExpression = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#QuerySelectExpression.
ECMAScriptParserVisitor.prototype.visitQuerySelectExpression = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#QuerySelectListExpression.
ECMAScriptParserVisitor.prototype.visitQuerySelectListExpression = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#select_list_elem.
ECMAScriptParserVisitor.prototype.visitSelect_list_elem = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#QueryFromExpression.
ECMAScriptParserVisitor.prototype.visitQueryFromExpression = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#QueryWhereExpression.
ECMAScriptParserVisitor.prototype.visitQueryWhereExpression = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#QueryDataSourcesExpression.
ECMAScriptParserVisitor.prototype.visitQueryDataSourcesExpression = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#dataSource.
ECMAScriptParserVisitor.prototype.visitDataSource = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#QueryDataSourceExpression.
ECMAScriptParserVisitor.prototype.visitQueryDataSourceExpression = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#QueryDataSourceItemUrlExpression.
ECMAScriptParserVisitor.prototype.visitQueryDataSourceItemUrlExpression = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#QueryDataSourceItemArgumentsExpression.
ECMAScriptParserVisitor.prototype.visitQueryDataSourceItemArgumentsExpression = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#QueryDataSourceItemIdentifierExpression.
ECMAScriptParserVisitor.prototype.visitQueryDataSourceItemIdentifierExpression = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#QueryDataSourceItemSubqueryExpression.
ECMAScriptParserVisitor.prototype.visitQueryDataSourceItemSubqueryExpression = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#QueryJoinCrossApplyExpression.
ECMAScriptParserVisitor.prototype.visitQueryJoinCrossApplyExpression = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#QueryJoinOnExpression.
ECMAScriptParserVisitor.prototype.visitQueryJoinOnExpression = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#QuerySourceUsingLiteralExpression.
ECMAScriptParserVisitor.prototype.visitQuerySourceUsingLiteralExpression = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#QuerySourceUsingSingleExpression.
ECMAScriptParserVisitor.prototype.visitQuerySourceUsingSingleExpression = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#QueryProduceExpression.
ECMAScriptParserVisitor.prototype.visitQueryProduceExpression = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#QueryBindExpression.
ECMAScriptParserVisitor.prototype.visitQueryBindExpression = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#QueryWithinExpression.
ECMAScriptParserVisitor.prototype.visitQueryWithinExpression = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#queryObjectLiteral.
ECMAScriptParserVisitor.prototype.visitQueryObjectLiteral = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#queryPropertyAssignment.
ECMAScriptParserVisitor.prototype.visitQueryPropertyAssignment = function(ctx) {
  return this.visitChildren(ctx);
};



exports.ECMAScriptParserVisitor = ECMAScriptParserVisitor;