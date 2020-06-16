"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PrintVisitor = void 0;

var _ECMAScriptVisitor = require("./parser/ECMAScriptVisitor");

class PrintVisitor extends _ECMAScriptVisitor.ECMAScriptVisitor {
  // Visit a parse tree produced by ECMAScriptParser#program.
  visitProgram(ctx) {
    console.info("visitProgram: " + ctx.getText());
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
    console.info("visitBlock: " + ctx.getText());
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
    console.info("visitEmptyStatement: " + ctx.getText());
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#expressionStatement.
  visitExpressionStatement(ctx) {
    console.info("visitExpressionStatement: " + ctx.getText());
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#ifStatement.
  visitIfStatement(ctx) {
    console.info("visitIfStatement: " + ctx.getText());
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#DoStatement.
  visitDoStatement(ctx) {
    console.info("visitDoStatement: " + ctx.getText());
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#WhileStatement.
  visitWhileStatement(ctx) {
    console.info("visitWhileStatement: " + ctx.getText());
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#ForStatement.
  visitForStatement(ctx) {
    console.info("visitWhileStatement: " + ctx.getText());
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
    console.info("visitFunctionBody: " + ctx.getText());
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
    console.info("visitArguments: " + ctx.getText());
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#argumentList.
  visitArgumentList(ctx) {
    console.info("visitArgumentList: " + ctx.getText());
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
    console.info("visitArgumentsExpression: " + ctx.getText());
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
    console.info("visitAssignmentExpression [%s]: [%s]", ctx.getChildCount(), ctx.getText());
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
    console.info("visitUnaryPlusExpression [%s]: [%s]", ctx.getChildCount(), ctx.getText());
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
    console.info("visitMemberDotExpression: " + ctx.getText());
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#MemberIndexExpression.
  visitMemberIndexExpression(ctx) {
    console.trace('not implemented');
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#IdentifierExpression.
  visitIdentifierExpression(ctx) {
    console.info("visitIdentifierExpression: " + ctx.getText());
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
    console.info("visitAssignmentOperator: " + ctx.getText());
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
    console.info("visitIdentifierName: " + ctx.getText());
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#reservedWord.
  visitReservedWord(ctx) {
    console.info("visitReservedWord: " + ctx.getText());
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#keyword.
  visitKeyword(ctx) {
    console.info("visitKeyword: " + ctx.getText());
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9QcmludFZpc2l0b3IudHMiXSwibmFtZXMiOlsiUHJpbnRWaXNpdG9yIiwiRGVsdmVuVmlzaXRvciIsInZpc2l0UHJvZ3JhbSIsImN0eCIsImNvbnNvbGUiLCJpbmZvIiwiZ2V0VGV4dCIsInZpc2l0Q2hpbGRyZW4iLCJ2aXNpdFNvdXJjZUVsZW1lbnRzIiwidmlzaXRTb3VyY2VFbGVtZW50IiwidmlzaXRTdGF0ZW1lbnQiLCJ2aXNpdEJsb2NrIiwidmlzaXRTdGF0ZW1lbnRMaXN0IiwidmlzaXRWYXJpYWJsZVN0YXRlbWVudCIsInZpc2l0VmFyaWFibGVEZWNsYXJhdGlvbkxpc3QiLCJ2aXNpdFZhcmlhYmxlRGVjbGFyYXRpb24iLCJ2aXNpdEluaXRpYWxpc2VyIiwidmlzaXRFbXB0eVN0YXRlbWVudCIsInZpc2l0RXhwcmVzc2lvblN0YXRlbWVudCIsInZpc2l0SWZTdGF0ZW1lbnQiLCJ2aXNpdERvU3RhdGVtZW50IiwidmlzaXRXaGlsZVN0YXRlbWVudCIsInZpc2l0Rm9yU3RhdGVtZW50IiwidmlzaXRGb3JWYXJTdGF0ZW1lbnQiLCJ0cmFjZSIsInZpc2l0Rm9ySW5TdGF0ZW1lbnQiLCJ2aXNpdEZvclZhckluU3RhdGVtZW50IiwidmlzaXRDb250aW51ZVN0YXRlbWVudCIsInZpc2l0QnJlYWtTdGF0ZW1lbnQiLCJ2aXNpdFJldHVyblN0YXRlbWVudCIsInZpc2l0V2l0aFN0YXRlbWVudCIsInZpc2l0U3dpdGNoU3RhdGVtZW50IiwidmlzaXRDYXNlQmxvY2siLCJ2aXNpdENhc2VDbGF1c2VzIiwidmlzaXRDYXNlQ2xhdXNlIiwidmlzaXREZWZhdWx0Q2xhdXNlIiwidmlzaXRMYWJlbGxlZFN0YXRlbWVudCIsInZpc2l0VGhyb3dTdGF0ZW1lbnQiLCJ2aXNpdFRyeVN0YXRlbWVudCIsInZpc2l0Q2F0Y2hQcm9kdWN0aW9uIiwidmlzaXRGaW5hbGx5UHJvZHVjdGlvbiIsInZpc2l0RGVidWdnZXJTdGF0ZW1lbnQiLCJ2aXNpdEZ1bmN0aW9uRGVjbGFyYXRpb24iLCJ2aXNpdEZvcm1hbFBhcmFtZXRlckxpc3QiLCJ2aXNpdEZ1bmN0aW9uQm9keSIsInZpc2l0QXJyYXlMaXRlcmFsIiwidmlzaXRFbGVtZW50TGlzdCIsInZpc2l0RWxpc2lvbiIsInZpc2l0T2JqZWN0TGl0ZXJhbCIsInZpc2l0UHJvcGVydHlOYW1lQW5kVmFsdWVMaXN0IiwidmlzaXRQcm9wZXJ0eUV4cHJlc3Npb25Bc3NpZ25tZW50IiwidmlzaXRQcm9wZXJ0eUdldHRlciIsInZpc2l0UHJvcGVydHlTZXR0ZXIiLCJ2aXNpdFByb3BlcnR5TmFtZSIsInZpc2l0UHJvcGVydHlTZXRQYXJhbWV0ZXJMaXN0IiwidmlzaXRBcmd1bWVudHMiLCJ2aXNpdEFyZ3VtZW50TGlzdCIsInZpc2l0RXhwcmVzc2lvblNlcXVlbmNlIiwidmlzaXRUZXJuYXJ5RXhwcmVzc2lvbiIsInZpc2l0TG9naWNhbEFuZEV4cHJlc3Npb24iLCJ2aXNpdFByZUluY3JlbWVudEV4cHJlc3Npb24iLCJ2aXNpdE9iamVjdExpdGVyYWxFeHByZXNzaW9uIiwidmlzaXRJbkV4cHJlc3Npb24iLCJ2aXNpdExvZ2ljYWxPckV4cHJlc3Npb24iLCJ2aXNpdE5vdEV4cHJlc3Npb24iLCJ2aXNpdFByZURlY3JlYXNlRXhwcmVzc2lvbiIsInZpc2l0QXJndW1lbnRzRXhwcmVzc2lvbiIsInZpc2l0VGhpc0V4cHJlc3Npb24iLCJ2aXNpdEZ1bmN0aW9uRXhwcmVzc2lvbiIsInZpc2l0VW5hcnlNaW51c0V4cHJlc3Npb24iLCJ2aXNpdFBvc3REZWNyZWFzZUV4cHJlc3Npb24iLCJ2aXNpdEFzc2lnbm1lbnRFeHByZXNzaW9uIiwiZ2V0Q2hpbGRDb3VudCIsInZpc2l0VHlwZW9mRXhwcmVzc2lvbiIsInZpc2l0SW5zdGFuY2VvZkV4cHJlc3Npb24iLCJ2aXNpdFVuYXJ5UGx1c0V4cHJlc3Npb24iLCJ2aXNpdERlbGV0ZUV4cHJlc3Npb24iLCJ2aXNpdEVxdWFsaXR5RXhwcmVzc2lvbiIsInZpc2l0Qml0WE9yRXhwcmVzc2lvbiIsInZpc2l0TXVsdGlwbGljYXRpdmVFeHByZXNzaW9uIiwidmlzaXRCaXRTaGlmdEV4cHJlc3Npb24iLCJ2aXNpdFBhcmVudGhlc2l6ZWRFeHByZXNzaW9uIiwidmlzaXRBZGRpdGl2ZUV4cHJlc3Npb24iLCJ2aXNpdFJlbGF0aW9uYWxFeHByZXNzaW9uIiwidmlzaXRQb3N0SW5jcmVtZW50RXhwcmVzc2lvbiIsInZpc2l0Qml0Tm90RXhwcmVzc2lvbiIsInZpc2l0TmV3RXhwcmVzc2lvbiIsInZpc2l0TGl0ZXJhbEV4cHJlc3Npb24iLCJ2aXNpdEFycmF5TGl0ZXJhbEV4cHJlc3Npb24iLCJ2aXNpdE1lbWJlckRvdEV4cHJlc3Npb24iLCJ2aXNpdE1lbWJlckluZGV4RXhwcmVzc2lvbiIsInZpc2l0SWRlbnRpZmllckV4cHJlc3Npb24iLCJ2aXNpdEJpdEFuZEV4cHJlc3Npb24iLCJ2aXNpdEJpdE9yRXhwcmVzc2lvbiIsInZpc2l0QXNzaWdubWVudE9wZXJhdG9yRXhwcmVzc2lvbiIsInZpc2l0Vm9pZEV4cHJlc3Npb24iLCJ2aXNpdEFzc2lnbm1lbnRPcGVyYXRvciIsInZpc2l0TGl0ZXJhbCIsInZpc2l0TnVtZXJpY0xpdGVyYWwiLCJ2aXNpdElkZW50aWZpZXJOYW1lIiwidmlzaXRSZXNlcnZlZFdvcmQiLCJ2aXNpdEtleXdvcmQiLCJ2aXNpdEZ1dHVyZVJlc2VydmVkV29yZCIsInZpc2l0R2V0dGVyIiwidmlzaXRTZXR0ZXIiLCJ2aXNpdEVvcyIsInZpc2l0RW9mIiwidmlzaXRDaGlsZHJlblhYIiwiY2hpbGRyZW4iLCJtYXAiLCJjaGlsZCIsImxlbmd0aCIsImFjY2VwdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUdPLE1BQU1BLFlBQU4sU0FBMkJDLG9DQUEzQixDQUF5QztBQUU5QztBQUNBQyxFQUFBQSxZQUFZLENBQUNDLEdBQUQsRUFBbUI7QUFDN0JDLElBQUFBLE9BQU8sQ0FBQ0MsSUFBUixDQUFhLG1CQUFtQkYsR0FBRyxDQUFDRyxPQUFKLEVBQWhDO0FBRUEsV0FBTyxL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UUFBSUEsR0FBRyxDQUFDeUcsUUFBUixFQUFrQjtBQUNoQixhQUFPekcsR0FBRyxDQUFDeUcsUUFBSixDQUFhQyxHQUFiLENBQWlCQyxLQUFLLElBQUk7QUFDL0IsWUFBSUEsS0FBSyxDQUFDRixRQUFOLElBQWtCRSxLQUFLLENBQUNGLFFBQU4sQ0FBZUcsTUFBZixJQUF5QixDQUEvQyxFQUFrRDtBQUNoRCxpQkFBT0QsS0FBSyxDQUFDRSxNQUFOLENBQWEsSUFBYixDQUFQO0FBQ0QsU0FGRCxNQUVPO0FBQ0wsaUJBQU9GLEtBQUssQ0FBQ3hHLE9BQU4sRUFBUDtBQUNEO0FBQ0YsT0FOTSxDQUFQO0FBT0Q7QUFDRjs7QUExc0I2QyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEVDTUFTY3JpcHRWaXNpdG9yIGFzIERlbHZlblZpc2l0b3IgfSBmcm9tIFwiLi9wYXJzZXIvRUNNQVNjcmlwdFZpc2l0b3JcIlxuaW1wb3J0IHsgUnVsZUNvbnRleHQgfSBmcm9tIFwiYW50bHI0L1J1bGVDb250ZXh0XCJcblxuZXhwb3J0IGNsYXNzIFByaW50VmlzaXRvciBleHRlbmRzIERlbHZlblZpc2l0b3Ige1xuXG4gIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI3Byb2dyYW0uXG4gIHZpc2l0UHJvZ3JhbShjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgY29uc29sZS5pbmZvKFwidmlzaXRQcm9ncmFtOiBcIiArIGN0eC5nZXRUZXh0KCkpO1xuXG4gICAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICB9O1xuXG5cbiAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjc291cmNlRWxlbWVudHMuXG4gIHZpc2l0U291cmNlRWxlbWVudHMoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0U291cmNlRWxlbWVudHM6IFwiICsgY3R4LmdldFRleHQoKSk7XG4gICAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICB9O1xuXG5cbiAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjc291cmNlRWxlbWVudC5cbiAgdmlzaXRTb3VyY2VFbGVtZW50KGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICBjb25zb2xlLmluZm8oXCJ2aXNpdFNvdXJjZUVsZW1lbnQ6IFwiICsgY3R4LmdldFRleHQoKSk7XG4gICAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICB9O1xuXG5cbiAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjc3RhdGVtZW50LlxuICB2aXNpdFN0YXRlbWVudChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgY29uc29sZS5pbmZvKFwidmlzaXRTdGF0ZW1lbnQ6IFwiICsgY3R4LmdldFRleHQoKSk7XG4gICAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICB9O1xuXG5cbiAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjYmxvY2suXG4gIHZpc2l0QmxvY2soY3R4OiBSdWxlQ29udGV4dCkge1xuICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0QmxvY2s6IFwiICsgY3R4LmdldFRleHQoKSk7XG4gICAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICB9O1xuXG5cbiAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjc3RhdGVtZW50TGlzdC5cbiAgdmlzaXRTdGF0ZW1lbnRMaXN0KGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICBjb25zb2xlLmluZm8oXCJ2aXNpdFN0YXRlbWVudExpc3Q6IFwiICsgY3R4LmdldFRleHQoKSk7XG4gICAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICB9O1xuXG5cbiAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjdmFyaWFibGVTdGF0ZW1lbnQuXG4gIHZpc2l0VmFyaWFibGVTdGF0ZW1lbnQoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0VmFyaWFibGVTdGF0ZW1lbnQ6IFwiICsgY3R4LmdldFRleHQoKSk7XG5cbiAgICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gIH07XG5cblxuICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciN2YXJpYWJsZURlY2xhcmF0aW9uTGlzdC5cbiAgdmlzaXRWYXJpYWJsZURlY2xhcmF0aW9uTGlzdChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgY29uc29sZS5pbmZvKFwidmlzaXRWYXJpYWJsZURlY2xhcmF0aW9uTGlzdDogXCIgKyBjdHguZ2V0VGV4dCgpKTtcblxuICAgIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgfTtcblxuXG4gIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI3ZhcmlhYmxlRGVjbGFyYXRpb24uXG4gIHZpc2l0VmFyaWFibGVEZWNsYXJhdGlvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgY29uc29sZS5pbmZvKFwidmlzaXRWYXJpYWJsZURlY2xhcmF0aW9uOiBcIiArIGN0eC5nZXRUZXh0KCkpO1xuXG4gICAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICB9O1xuXG5cbiAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjaW5pdGlhbGlzZXIuXG4gIHZpc2l0SW5pdGlhbGlzZXIoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0SW5pdGlhbGlzZXI6IFwiICsgY3R4LmdldFRleHQoKSk7XG4gICAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICB9O1xuXG5cbiAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjZW1wdHlTdGF0ZW1lbnQuXG4gIHZpc2l0RW1wdHlTdGF0ZW1lbnQoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0RW1wdHlTdGF0ZW1lbnQ6IFwiICsgY3R4LmdldFRleHQoKSk7XG4gICAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICB9O1xuXG5cbiAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjZXhwcmVzc2lvblN0YXRlbWVudC5cbiAgdmlzaXRFeHByZXNzaW9uU3RhdGVtZW50KGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICBjb25zb2xlLmluZm8oXCJ2aXNpdEV4cHJlc3Npb25TdGF0ZW1lbnQ6IFwiICsgY3R4LmdldFRleHQoKSk7XG5cbiAgICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gIH07XG5cblxuICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNpZlN0YXRlbWVudC5cbiAgdmlzaXRJZlN0YXRlbWVudChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgY29uc29sZS5pbmZvKFwidmlzaXRJZlN0YXRlbWVudDogXCIgKyBjdHguZ2V0VGV4dCgpKTtcbiAgICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gIH07XG5cblxuICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNEb1N0YXRlbWVudC5cbiAgdmlzaXREb1N0YXRlbWVudChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgY29uc29sZS5pbmZvKFwidmlzaXREb1N0YXRlbWVudDogXCIgKyBjdHguZ2V0VGV4dCgpKTtcbiAgICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gIH07XG5cblxuICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNXaGlsZVN0YXRlbWVudC5cbiAgdmlzaXRXaGlsZVN0YXRlbWVudChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgY29uc29sZS5pbmZvKFwidmlzaXRXaGlsZVN0YXRlbWVudDogXCIgKyBjdHguZ2V0VGV4dCgpKTtcbiAgICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gIH07XG5cblxuICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNGb3JTdGF0ZW1lbnQuXG4gIHZpc2l0Rm9yU3RhdGVtZW50KGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICBjb25zb2xlLmluZm8oXCJ2aXNpdFdoaWxlU3RhdGVtZW50OiBcIiArIGN0eC5nZXRUZXh0KCkpO1xuICAgIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgfTtcblxuXG4gIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI0ZvclZhclN0YXRlbWVudC5cbiAgdmlzaXRGb3JWYXJTdGF0ZW1lbnQoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gICAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICB9O1xuXG5cbiAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjRm9ySW5TdGF0ZW1lbnQuXG4gIHZpc2l0Rm9ySW5TdGF0ZW1lbnQoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gICAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICB9O1xuXG5cbiAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjRm9yVmFySW5TdGF0ZW1lbnQuXG4gIHZpc2l0Rm9yVmFySW5TdGF0ZW1lbnQoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gICAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICB9O1xuXG5cbiAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjY29udGludWVTdGF0ZW1lbnQuXG4gIHZpc2l0Q29udGludWVTdGF0ZW1lbnQoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gICAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICB9O1xuXG5cbiAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjYnJlYWtTdGF0ZW1lbnQuXG4gIHZpc2l0QnJlYWtTdGF0ZW1lbnQoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gICAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICB9O1xuXG5cbiAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjcmV0dXJuU3RhdGVtZW50LlxuICB2aXNpdFJldHVyblN0YXRlbWVudChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gIH07XG5cblxuICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciN3aXRoU3RhdGVtZW50LlxuICB2aXNpdFdpdGhTdGF0ZW1lbnQoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gICAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICB9O1xuXG5cbiAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjc3dpdGNoU3RhdGVtZW50LlxuICB2aXNpdFN3aXRjaFN0YXRlbWVudChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gIH07XG5cblxuICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNjYXNlQmxvY2suXG4gIHZpc2l0Q2FzZUJsb2NrKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgfTtcblxuXG4gIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2Nhc2VDbGF1c2VzLlxuICB2aXNpdENhc2VDbGF1c2VzKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgfTtcblxuXG4gIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2Nhc2VDbGF1c2UuXG4gIHZpc2l0Q2FzZUNsYXVzZShjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gIH07XG5cblxuICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNkZWZhdWx0Q2xhdXNlLlxuICB2aXNpdERlZmF1bHRDbGF1c2UoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gICAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICB9O1xuXG5cbiAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjbGFiZWxsZWRTdGF0ZW1lbnQuXG4gIHZpc2l0TGFiZWxsZWRTdGF0ZW1lbnQoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gICAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICB9O1xuXG5cbiAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjdGhyb3dTdGF0ZW1lbnQuXG4gIHZpc2l0VGhyb3dTdGF0ZW1lbnQoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gICAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICB9O1xuXG5cbiAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjdHJ5U3RhdGVtZW50LlxuICB2aXNpdFRyeVN0YXRlbWVudChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gIH07XG5cblxuICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNjYXRjaFByb2R1Y3Rpb24uXG4gIHZpc2l0Q2F0Y2hQcm9kdWN0aW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgfTtcblxuXG4gIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2ZpbmFsbHlQcm9kdWN0aW9uLlxuICB2aXNpdEZpbmFsbHlQcm9kdWN0aW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgfTtcblxuXG4gIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2RlYnVnZ2VyU3RhdGVtZW50LlxuICB2aXNpdERlYnVnZ2VyU3RhdGVtZW50KGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgfTtcblxuXG4gIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2Z1bmN0aW9uRGVjbGFyYXRpb24uXG4gIHZpc2l0RnVuY3Rpb25EZWNsYXJhdGlvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gIH07XG5cblxuICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNmb3JtYWxQYXJhbWV0ZXJMaXN0LlxuICB2aXNpdEZvcm1hbFBhcmFtZXRlckxpc3QoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gICAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICB9O1xuXG5cbiAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjZnVuY3Rpb25Cb2R5LlxuICB2aXNpdEZ1bmN0aW9uQm9keShjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgY29uc29sZS5pbmZvKFwidmlzaXRGdW5jdGlvbkJvZHk6IFwiICsgY3R4LmdldFRleHQoKSk7XG5cbiAgICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gIH07XG5cblxuICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNhcnJheUxpdGVyYWwuXG4gIHZpc2l0QXJyYXlMaXRlcmFsKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgfTtcblxuXG4gIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2VsZW1lbnRMaXN0LlxuICB2aXNpdEVsZW1lbnRMaXN0KGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgfTtcblxuXG4gIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2VsaXNpb24uXG4gIHZpc2l0RWxpc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gIH07XG5cblxuICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNvYmplY3RMaXRlcmFsLlxuICB2aXNpdE9iamVjdExpdGVyYWwoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gICAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICB9O1xuXG5cbiAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjcHJvcGVydHlOYW1lQW5kVmFsdWVMaXN0LlxuICB2aXNpdFByb3BlcnR5TmFtZUFuZFZhbHVlTGlzdChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gIH07XG5cblxuICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNQcm9wZXJ0eUV4cHJlc3Npb25Bc3NpZ25tZW50LlxuICB2aXNpdFByb3BlcnR5RXhwcmVzc2lvbkFzc2lnbm1lbnQoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gICAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICB9O1xuXG5cbiAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjUHJvcGVydHlHZXR0ZXIuXG4gIHZpc2l0UHJvcGVydHlHZXR0ZXIoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gICAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICB9O1xuXG5cbiAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjUHJvcGVydHlTZXR0ZXIuXG4gIHZpc2l0UHJvcGVydHlTZXR0ZXIoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gICAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICB9O1xuXG5cbiAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjcHJvcGVydHlOYW1lLlxuICB2aXNpdFByb3BlcnR5TmFtZShjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gIH07XG5cblxuICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNwcm9wZXJ0eVNldFBhcmFtZXRlckxpc3QuXG4gIHZpc2l0UHJvcGVydHlTZXRQYXJhbWV0ZXJMaXN0KGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgfTtcblxuXG4gIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2FyZ3VtZW50cy5cbiAgdmlzaXRBcmd1bWVudHMoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0QXJndW1lbnRzOiBcIiArIGN0eC5nZXRUZXh0KCkpO1xuICAgIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgfTtcblxuXG4gIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2FyZ3VtZW50TGlzdC5cbiAgdmlzaXRBcmd1bWVudExpc3QoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0QXJndW1lbnRMaXN0OiBcIiArIGN0eC5nZXRUZXh0KCkpO1xuXG4gICAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICB9O1xuXG5cbiAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjZXhwcmVzc2lvblNlcXVlbmNlLlxuICB2aXNpdEV4cHJlc3Npb25TZXF1ZW5jZShjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgY29uc29sZS5pbmZvKFwidmlzaXRFeHByZXNzaW9uU2VxdWVuY2U6IFwiICsgY3R4LmdldFRleHQoKSk7XG4gICAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICB9O1xuXG5cbiAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjVGVybmFyeUV4cHJlc3Npb24uXG4gIHZpc2l0VGVybmFyeUV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gICAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICB9O1xuXG5cbiAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjTG9naWNhbEFuZEV4cHJlc3Npb24uXG4gIHZpc2l0TG9naWNhbEFuZEV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gICAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICB9O1xuXG5cbiAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjUHJlSW5jcmVtZW50RXhwcmVzc2lvbi5cbiAgdmlzaXRQcmVJbmNyZW1lbnRFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgfTtcblxuXG4gIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI09iamVjdExpdGVyYWxFeHByZXNzaW9uLlxuICB2aXNpdE9iamVjdExpdGVyYWxFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgfTtcblxuXG4gIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI0luRXhwcmVzc2lvbi5cbiAgdmlzaXRJbkV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gICAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICB9O1xuXG5cbiAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjTG9naWNhbE9yRXhwcmVzc2lvbi5cbiAgdmlzaXRMb2dpY2FsT3JFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgfTtcblxuXG4gIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI05vdEV4cHJlc3Npb24uXG4gIHZpc2l0Tm90RXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gIH07XG5cblxuICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNQcmVEZWNyZWFzZUV4cHJlc3Npb24uXG4gIHZpc2l0UHJlRGVjcmVhc2VFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgfTtcblxuXG4gIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI0FyZ3VtZW50c0V4cHJlc3Npb24uXG4gIHZpc2l0QXJndW1lbnRzRXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgY29uc29sZS5pbmZvKFwidmlzaXRBcmd1bWVudHNFeHByZXNzaW9uOiBcIiArIGN0eC5nZXRUZXh0KCkpO1xuXG4gICAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICB9O1xuXG5cbiAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjVGhpc0V4cHJlc3Npb24uXG4gIHZpc2l0VGhpc0V4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gICAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICB9O1xuXG5cbiAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjRnVuY3Rpb25FeHByZXNzaW9uLlxuICB2aXNpdEZ1bmN0aW9uRXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gIH07XG5cblxuICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNVbmFyeU1pbnVzRXhwcmVzc2lvbi5cbiAgdmlzaXRVbmFyeU1pbnVzRXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gIH07XG5cblxuICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNQb3N0RGVjcmVhc2VFeHByZXNzaW9uLlxuICB2aXNpdFBvc3REZWNyZWFzZUV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gICAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICB9O1xuXG5cbiAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjQXNzaWdubWVudEV4cHJlc3Npb24uXG4gIHZpc2l0QXNzaWdubWVudEV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0QXNzaWdubWVudEV4cHJlc3Npb24gWyVzXTogWyVzXVwiLCBjdHguZ2V0Q2hpbGRDb3VudCgpLCAgY3R4LmdldFRleHQoKSk7XG4gICAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICB9O1xuXG5cbiAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjVHlwZW9mRXhwcmVzc2lvbi5cbiAgdmlzaXRUeXBlb2ZFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgfTtcblxuXG4gIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI0luc3RhbmNlb2ZFeHByZXNzaW9uLlxuICB2aXNpdEluc3RhbmNlb2ZFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgfTtcblxuXG4gIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI1VuYXJ5UGx1c0V4cHJlc3Npb24uXG4gIHZpc2l0VW5hcnlQbHVzRXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgY29uc29sZS5pbmZvKFwidmlzaXRVbmFyeVBsdXNFeHByZXNzaW9uIFslc106IFslc11cIiwgY3R4LmdldENoaWxkQ291bnQoKSwgIGN0eC5nZXRUZXh0KCkpO1xuICAgIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgfTtcblxuXG4gIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI0RlbGV0ZUV4cHJlc3Npb24uXG4gIHZpc2l0RGVsZXRlRXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gIH07XG5cblxuICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNFcXVhbGl0eUV4cHJlc3Npb24uXG4gIHZpc2l0RXF1YWxpdHlFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgfTtcblxuXG4gIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI0JpdFhPckV4cHJlc3Npb24uXG4gIHZpc2l0Qml0WE9yRXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gIH07XG5cblxuICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNNdWx0aXBsaWNhdGl2ZUV4cHJlc3Npb24uXG4gIHZpc2l0TXVsdGlwbGljYXRpdmVFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgfTtcblxuXG4gIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI0JpdFNoaWZ0RXhwcmVzc2lvbi5cbiAgdmlzaXRCaXRTaGlmdEV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gICAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICB9O1xuXG5cbiAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjUGFyZW50aGVzaXplZEV4cHJlc3Npb24uXG4gIHZpc2l0UGFyZW50aGVzaXplZEV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0UGFyZW50aGVzaXplZEV4cHJlc3Npb246IFwiICsgY3R4LmdldFRleHQoKSk7XG5cbiAgICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gIH07XG5cblxuICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNBZGRpdGl2ZUV4cHJlc3Npb24uXG4gIHZpc2l0QWRkaXRpdmVFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICBjb25zb2xlLmluZm8oXCJ2aXNpdEFkZGl0aXZlRXhwcmVzc2lvbjogXCIgKyBjdHguZ2V0VGV4dCgpKTtcbiAgICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gIH07XG5cblxuICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNSZWxhdGlvbmFsRXhwcmVzc2lvbi5cbiAgdmlzaXRSZWxhdGlvbmFsRXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gIH07XG5cblxuICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNQb3N0SW5jcmVtZW50RXhwcmVzc2lvbi5cbiAgdmlzaXRQb3N0SW5jcmVtZW50RXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gIH07XG5cblxuICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNCaXROb3RFeHByZXNzaW9uLlxuICB2aXNpdEJpdE5vdEV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gICAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICB9O1xuXG5cbiAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjTmV3RXhwcmVzc2lvbi5cbiAgdmlzaXROZXdFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgfTtcblxuXG4gIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI0xpdGVyYWxFeHByZXNzaW9uLlxuICB2aXNpdExpdGVyYWxFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICBjb25zb2xlLmluZm8oXCJ2aXNpdExpdGVyYWxFeHByZXNzaW9uOiBcIiArIGN0eC5nZXRUZXh0KCkpO1xuICAgIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgfTtcblxuXG4gIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI0FycmF5TGl0ZXJhbEV4cHJlc3Npb24uXG4gIHZpc2l0QXJyYXlMaXRlcmFsRXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gIH07XG5cblxuICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNNZW1iZXJEb3RFeHByZXNzaW9uLlxuICB2aXNpdE1lbWJlckRvdEV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0TWVtYmVyRG90RXhwcmVzc2lvbjogXCIgKyBjdHguZ2V0VGV4dCgpKTtcbiAgICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gIH07XG5cblxuICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNNZW1iZXJJbmRleEV4cHJlc3Npb24uXG4gIHZpc2l0TWVtYmVySW5kZXhFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgfTtcblxuXG4gIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI0lkZW50aWZpZXJFeHByZXNzaW9uLlxuICB2aXNpdElkZW50aWZpZXJFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICBjb25zb2xlLmluZm8oXCJ2aXNpdElkZW50aWZpZXJFeHByZXNzaW9uOiBcIiArIGN0eC5nZXRUZXh0KCkpO1xuXG4gICAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICB9O1xuXG5cbiAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjQml0QW5kRXhwcmVzc2lvbi5cbiAgdmlzaXRCaXRBbmRFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgfTtcblxuXG4gIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI0JpdE9yRXhwcmVzc2lvbi5cbiAgdmlzaXRCaXRPckV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gICAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICB9O1xuXG5cbiAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjQXNzaWdubWVudE9wZXJhdG9yRXhwcmVzc2lvbi5cbiAgdmlzaXRBc3NpZ25tZW50T3BlcmF0b3JFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgfTtcblxuXG4gIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI1ZvaWRFeHByZXNzaW9uLlxuICB2aXNpdFZvaWRFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgfTtcblxuICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNhc3NpZ25tZW50T3BlcmF0b3IuXG4gIHZpc2l0QXNzaWdubWVudE9wZXJhdG9yKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICBjb25zb2xlLmluZm8oXCJ2aXNpdEFzc2lnbm1lbnRPcGVyYXRvcjogXCIgKyBjdHguZ2V0VGV4dCgpKTtcbiAgICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gIH07XG5cblxuICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNsaXRlcmFsLlxuICB2aXNpdExpdGVyYWwoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0TGl0ZXJhbDogXCIgKyBjdHguZ2V0VGV4dCgpKTtcbiAgICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gIH07XG5cblxuICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNudW1lcmljTGl0ZXJhbC5cbiAgdmlzaXROdW1lcmljTGl0ZXJhbChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgY29uc29sZS5pbmZvKFwidmlzaXROdW1lcmljTGl0ZXJhbDogXCIgKyBjdHguZ2V0VGV4dCgpKTtcbiAgICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gIH07XG5cblxuICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNpZGVudGlmaWVyTmFtZS5cbiAgdmlzaXRJZGVudGlmaWVyTmFtZShjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgY29uc29sZS5pbmZvKFwidmlzaXRJZGVudGlmaWVyTmFtZTogXCIgKyBjdHguZ2V0VGV4dCgpKTtcbiAgICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gIH07XG5cblxuICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNyZXNlcnZlZFdvcmQuXG4gIHZpc2l0UmVzZXJ2ZWRXb3JkKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICBjb25zb2xlLmluZm8oXCJ2aXNpdFJlc2VydmVkV29yZDogXCIgKyBjdHguZ2V0VGV4dCgpKTtcblxuICAgIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgfTtcblxuXG4gIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2tleXdvcmQuXG4gIHZpc2l0S2V5d29yZChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgY29uc29sZS5pbmZvKFwidmlzaXRLZXl3b3JkOiBcIiArIGN0eC5nZXRUZXh0KCkpO1xuXG4gICAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICB9O1xuXG5cbiAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjZnV0dXJlUmVzZXJ2ZWRXb3JkLlxuICB2aXNpdEZ1dHVyZVJlc2VydmVkV29yZChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gIH07XG5cblxuICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNnZXR0ZXIuXG4gIHZpc2l0R2V0dGVyKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgfTtcblxuXG4gIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI3NldHRlci5cbiAgdmlzaXRTZXR0ZXIoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gICAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICB9O1xuXG5cbiAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjZW9zLlxuICB2aXNpdEVvcyhjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgLy9jb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgfTtcblxuICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNlb2YuXG4gIHZpc2l0RW9mKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgfTtcblxuXG5cbiAgdmlzaXRDaGlsZHJlblhYKGN0eCkge1xuICAgIGNvbnNvbGUuaW5mbyhcIkNvbnRleHQgOlwiICsgY3R4LmdldFRleHQoKSlcbiAgICBpZiAoIWN0eCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChjdHguY2hpbGRyZW4pIHtcbiAgICAgIHJldHVybiBjdHguY2hpbGRyZW4ubWFwKGNoaWxkID0+IHtcbiAgICAgICAgaWYgKGNoaWxkLmNoaWxkcmVuICYmIGNoaWxkLmNoaWxkcmVuLmxlbmd0aCAhPSAwKSB7XG4gICAgICAgICAgcmV0dXJuIGNoaWxkLmFjY2VwdCh0aGlzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gY2hpbGQuZ2V0VGV4dCgpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cbn0iXX0=