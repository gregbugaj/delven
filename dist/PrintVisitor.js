"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PrintVisitor = void 0;

var _ECMAScriptVisitor = require("./parser/ECMAScriptVisitor");

class PrintVisitor extends _ECMAScriptVisitor.ECMAScriptVisitor {
  // Visit a parse tree produced by ECMAScriptParser#program.
  visitProgram(ctx) {
    //  console.trace('not implemented')
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#sourceElements.
  visitSourceElements(ctx) {
    console.info("visitSourceElements: " + ctx.getText());
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#sourceElement.
  visitSourceElement(ctx) {
    console.info("visitSourceElement: " + ctx.getText());
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#statement.
  visitStatement(ctx) {
    console.info("visitStatement: " + ctx.getText());
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#block.
  visitBlock(ctx) {
    console.trace('not implemented');
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#statementList.
  visitStatementList(ctx) {
    console.info("visitStatementList: " + ctx.getText());
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#variableStatement.
  visitVariableStatement(ctx) {
    console.info("visitVariableStatement: " + ctx.getText());
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#variableDeclarationList.
  visitVariableDeclarationList(ctx) {
    console.info("visitVariableDeclarationList: " + ctx.getText());
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#variableDeclaration.
  visitVariableDeclaration(ctx) {
    console.info("visitVariableDeclaration: " + ctx.getText());
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#initialiser.
  visitInitialiser(ctx) {
    console.info("visitInitialiser: " + ctx.getText());
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#emptyStatement.
  visitEmptyStatement(ctx) {
    console.trace('not implemented');
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#expressionStatement.
  visitExpressionStatement(ctx) {
    console.info("visitExpressionStatement: " + ctx.getText());
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#ifStatement.
  visitIfStatement(ctx) {
    console.trace('not implemented');
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#DoStatement.
  visitDoStatement(ctx) {
    console.trace('not implemented');
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#WhileStatement.
  visitWhileStatement(ctx) {
    console.trace('not implemented');
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#ForStatement.
  visitForStatement(ctx) {
    console.trace('not implemented');
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#ForVarStatement.
  visitForVarStatement(ctx) {
    console.trace('not implemented');
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#ForInStatement.
  visitForInStatement(ctx) {
    console.trace('not implemented');
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#ForVarInStatement.
  visitForVarInStatement(ctx) {
    console.trace('not implemented');
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#continueStatement.
  visitContinueStatement(ctx) {
    console.trace('not implemented');
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#breakStatement.
  visitBreakStatement(ctx) {
    console.trace('not implemented');
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#returnStatement.
  visitReturnStatement(ctx) {
    console.trace('not implemented');
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#withStatement.
  visitWithStatement(ctx) {
    console.trace('not implemented');
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#switchStatement.
  visitSwitchStatement(ctx) {
    console.trace('not implemented');
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#caseBlock.
  visitCaseBlock(ctx) {
    console.trace('not implemented');
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#caseClauses.
  visitCaseClauses(ctx) {
    console.trace('not implemented');
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#caseClause.
  visitCaseClause(ctx) {
    console.trace('not implemented');
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#defaultClause.
  visitDefaultClause(ctx) {
    console.trace('not implemented');
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#labelledStatement.
  visitLabelledStatement(ctx) {
    console.trace('not implemented');
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#throwStatement.
  visitThrowStatement(ctx) {
    console.trace('not implemented');
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#tryStatement.
  visitTryStatement(ctx) {
    console.trace('not implemented');
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#catchProduction.
  visitCatchProduction(ctx) {
    console.trace('not implemented');
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#finallyProduction.
  visitFinallyProduction(ctx) {
    console.trace('not implemented');
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#debuggerStatement.
  visitDebuggerStatement(ctx) {
    console.trace('not implemented');
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#functionDeclaration.
  visitFunctionDeclaration(ctx) {
    console.trace('not implemented');
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#formalParameterList.
  visitFormalParameterList(ctx) {
    console.trace('not implemented');
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#functionBody.
  visitFunctionBody(ctx) {
    console.trace('not implemented');
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#arrayLiteral.
  visitArrayLiteral(ctx) {
    console.trace('not implemented');
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#elementList.
  visitElementList(ctx) {
    console.trace('not implemented');
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#elision.
  visitElision(ctx) {
    console.trace('not implemented');
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#objectLiteral.
  visitObjectLiteral(ctx) {
    console.trace('not implemented');
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#propertyNameAndValueList.
  visitPropertyNameAndValueList(ctx) {
    console.trace('not implemented');
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#PropertyExpressionAssignment.
  visitPropertyExpressionAssignment(ctx) {
    console.trace('not implemented');
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#PropertyGetter.
  visitPropertyGetter(ctx) {
    console.trace('not implemented');
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#PropertySetter.
  visitPropertySetter(ctx) {
    console.trace('not implemented');
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#propertyName.
  visitPropertyName(ctx) {
    console.trace('not implemented');
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#propertySetParameterList.
  visitPropertySetParameterList(ctx) {
    console.trace('not implemented');
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#arguments.
  visitArguments(ctx) {
    console.trace('not implemented');
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#argumentList.
  visitArgumentList(ctx) {
    console.trace('not implemented');
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#expressionSequence.
  visitExpressionSequence(ctx) {
    console.info("visitExpressionSequence: " + ctx.getText());
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#TernaryExpression.
  visitTernaryExpression(ctx) {
    console.trace('not implemented');
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#LogicalAndExpression.
  visitLogicalAndExpression(ctx) {
    console.trace('not implemented');
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#PreIncrementExpression.
  visitPreIncrementExpression(ctx) {
    console.trace('not implemented');
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#ObjectLiteralExpression.
  visitObjectLiteralExpression(ctx) {
    console.trace('not implemented');
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#InExpression.
  visitInExpression(ctx) {
    console.trace('not implemented');
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#LogicalOrExpression.
  visitLogicalOrExpression(ctx) {
    console.trace('not implemented');
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#NotExpression.
  visitNotExpression(ctx) {
    console.trace('not implemented');
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#PreDecreaseExpression.
  visitPreDecreaseExpression(ctx) {
    console.trace('not implemented');
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#ArgumentsExpression.
  visitArgumentsExpression(ctx) {
    console.trace('not implemented');
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#ThisExpression.
  visitThisExpression(ctx) {
    console.trace('not implemented');
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#FunctionExpression.
  visitFunctionExpression(ctx) {
    console.trace('not implemented');
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#UnaryMinusExpression.
  visitUnaryMinusExpression(ctx) {
    console.trace('not implemented');
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#PostDecreaseExpression.
  visitPostDecreaseExpression(ctx) {
    console.trace('not implemented');
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#AssignmentExpression.
  visitAssignmentExpression(ctx) {
    console.trace('not implemented');
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#TypeofExpression.
  visitTypeofExpression(ctx) {
    console.trace('not implemented');
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#InstanceofExpression.
  visitInstanceofExpression(ctx) {
    console.trace('not implemented');
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#UnaryPlusExpression.
  visitUnaryPlusExpression(ctx) {
    console.trace('not implemented');
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#DeleteExpression.
  visitDeleteExpression(ctx) {
    console.trace('not implemented');
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#EqualityExpression.
  visitEqualityExpression(ctx) {
    console.trace('not implemented');
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#BitXOrExpression.
  visitBitXOrExpression(ctx) {
    console.trace('not implemented');
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#MultiplicativeExpression.
  visitMultiplicativeExpression(ctx) {
    console.trace('not implemented');
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#BitShiftExpression.
  visitBitShiftExpression(ctx) {
    console.trace('not implemented');
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#ParenthesizedExpression.
  visitParenthesizedExpression(ctx) {
    console.info("visitParenthesizedExpression: " + ctx.getText());
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#AdditiveExpression.
  visitAdditiveExpression(ctx) {
    console.info("visitAdditiveExpression: " + ctx.getText());
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#RelationalExpression.
  visitRelationalExpression(ctx) {
    console.trace('not implemented');
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#PostIncrementExpression.
  visitPostIncrementExpression(ctx) {
    console.trace('not implemented');
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#BitNotExpression.
  visitBitNotExpression(ctx) {
    console.trace('not implemented');
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#NewExpression.
  visitNewExpression(ctx) {
    console.trace('not implemented');
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#LiteralExpression.
  visitLiteralExpression(ctx) {
    console.info("visitLiteralExpression: " + ctx.getText());
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#ArrayLiteralExpression.
  visitArrayLiteralExpression(ctx) {
    console.trace('not implemented');
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#MemberDotExpression.
  visitMemberDotExpression(ctx) {
    console.trace('not implemented');
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#MemberIndexExpression.
  visitMemberIndexExpression(ctx) {
    console.trace('not implemented');
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#IdentifierExpression.
  visitIdentifierExpression(ctx) {
    console.trace('not implemented');
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#BitAndExpression.
  visitBitAndExpression(ctx) {
    console.trace('not implemented');
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#BitOrExpression.
  visitBitOrExpression(ctx) {
    console.trace('not implemented');
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#AssignmentOperatorExpression.
  visitAssignmentOperatorExpression(ctx) {
    console.trace('not implemented');
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#VoidExpression.
  visitVoidExpression(ctx) {
    console.trace('not implemented');
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#assignmentOperator.
  visitAssignmentOperator(ctx) {
    console.trace('not implemented');
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#literal.
  visitLiteral(ctx) {
    console.info("visitLiteral: " + ctx.getText());
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#numericLiteral.
  visitNumericLiteral(ctx) {
    console.info("visitNumericLiteral: " + ctx.getText());
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#identifierName.
  visitIdentifierName(ctx) {
    console.trace('not implemented');
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#reservedWord.
  visitReservedWord(ctx) {
    console.trace('not implemented');
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#keyword.
  visitKeyword(ctx) {
    console.trace('not implemented');
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#futureReservedWord.
  visitFutureReservedWord(ctx) {
    console.trace('not implemented');
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#getter.
  visitGetter(ctx) {
    console.trace('not implemented');
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#setter.
  visitSetter(ctx) {
    console.trace('not implemented');
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#eos.
  visitEos(ctx) {
    //console.trace('not implemented')
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#eof.
  visitEof(ctx) {
    console.trace('not implemented');
    return this.visitChildren(ctx);
  }

  visitChildrenXX(ctx) {
    console.info("Context :" + ctx.getText());

    if (!ctx) {
      return;
    }

    if (ctx.children) {
      return ctx.children.map(child => {
        if (child.children && child.children.length != 0) {
          return child.accept(this);
        } else {
          return child.getText();
        }
      });
    }
  }

}

exports.PrintVisitor = PrintVisitor;