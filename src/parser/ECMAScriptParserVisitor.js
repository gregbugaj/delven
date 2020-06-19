// Generated from ECMAScriptParser.g4 by ANTLR 4.8
// jshint ignore: start
var antlr4 = require('antlr4/index');

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


// Visit a parse tree produced by ECMAScriptParser#sourceElements.
ECMAScriptParserVisitor.prototype.visitSourceElements = function(ctx) {
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


// Visit a parse tree produced by ECMAScriptParser#initialiser.
ECMAScriptParserVisitor.prototype.visitInitialiser = function(ctx) {
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


// Visit a parse tree produced by ECMAScriptParser#ForVarStatement.
ECMAScriptParserVisitor.prototype.visitForVarStatement = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#ForInStatement.
ECMAScriptParserVisitor.prototype.visitForInStatement = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#ForVarInStatement.
ECMAScriptParserVisitor.prototype.visitForVarInStatement = function(ctx) {
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


// Visit a parse tree produced by ECMAScriptParser#formalParameterList.
ECMAScriptParserVisitor.prototype.visitFormalParameterList = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#functionBody.
ECMAScriptParserVisitor.prototype.visitFunctionBody = function(ctx) {
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


// Visit a parse tree produced by ECMAScriptParser#elision.
ECMAScriptParserVisitor.prototype.visitElision = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#objectLiteral.
ECMAScriptParserVisitor.prototype.visitObjectLiteral = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#propertyNameAndValueList.
ECMAScriptParserVisitor.prototype.visitPropertyNameAndValueList = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#PropertyExpressionAssignment.
ECMAScriptParserVisitor.prototype.visitPropertyExpressionAssignment = function(ctx) {
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


// Visit a parse tree produced by ECMAScriptParser#propertyName.
ECMAScriptParserVisitor.prototype.visitPropertyName = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#propertySetParameterList.
ECMAScriptParserVisitor.prototype.visitPropertySetParameterList = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#arguments.
ECMAScriptParserVisitor.prototype.visitArguments = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#argumentList.
ECMAScriptParserVisitor.prototype.visitArgumentList = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#expressionSequence.
ECMAScriptParserVisitor.prototype.visitExpressionSequence = function(ctx) {
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


// Visit a parse tree produced by ECMAScriptParser#PreIncrementExpression.
ECMAScriptParserVisitor.prototype.visitPreIncrementExpression = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#ObjectLiteralExpression.
ECMAScriptParserVisitor.prototype.visitObjectLiteralExpression = function(ctx) {
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


// Visit a parse tree produced by ECMAScriptParser#PostDecreaseExpression.
ECMAScriptParserVisitor.prototype.visitPostDecreaseExpression = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#AssignmentExpression.
ECMAScriptParserVisitor.prototype.visitAssignmentExpression = function(ctx) {
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


// Visit a parse tree produced by ECMAScriptParser#EqualityExpression.
ECMAScriptParserVisitor.prototype.visitEqualityExpression = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#BitXOrExpression.
ECMAScriptParserVisitor.prototype.visitBitXOrExpression = function(ctx) {
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


// Visit a parse tree produced by ECMAScriptParser#identifierName.
ECMAScriptParserVisitor.prototype.visitIdentifierName = function(ctx) {
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


// Visit a parse tree produced by ECMAScriptParser#futureReservedWord.
ECMAScriptParserVisitor.prototype.visitFutureReservedWord = function(ctx) {
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


// Visit a parse tree produced by ECMAScriptParser#eos.
ECMAScriptParserVisitor.prototype.visitEos = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by ECMAScriptParser#eof.
ECMAScriptParserVisitor.prototype.visitEof = function(ctx) {
  return this.visitChildren(ctx);
};



exports.ECMAScriptParserVisitor = ECMAScriptParserVisitor;