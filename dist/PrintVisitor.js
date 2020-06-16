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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9QcmludFZpc2l0b3IudHMiXSwibmFtZXMiOlsiUHJpbnRWaXNpdG9yIiwiRGVsdmVuVmlzaXRvciIsInZpc2l0UHJvZ3JhbSIsImN0eCIsImNvbnNvbGUiLCJpbmZvIiwiZ2V0VGV4dCIsInZpc2l0Q2hpbGRyZW4iLCJ2aXNpdFNvdXJjZUVsZW1lbnRzIiwidmlzaXRTb3VyY2VFbGVtZW50IiwidmlzaXRTdGF0ZW1lbnQiLCJ2aXNpdEJsb2NrIiwidmlzaXRTdGF0ZW1lbnRMaXN0IiwidmlzaXRWYXJpYWJsZVN0YXRlbWVudCIsInZpc2l0VmFyaWFibGVEZWNsYXJhdGlvbkxpc3QiLCJ2aXNpdFZhcmlhYmxlRGVjbGFyYXRpb24iLCJ2aXNpdEluaXRpYWxpc2VyIiwidmlzaXRFbXB0eVN0YXRlbWVudCIsInZpc2l0RXhwcmVzc2lvblN0YXRlbWVudCIsInZpc2l0SWZTdGF0ZW1lbnQiLCJ2aXNpdERvU3RhdGVtZW50IiwidmlzaXRXaGlsZVN0YXRlbWVudCIsInZpc2l0Rm9yU3RhdGVtZW50IiwidmlzaXRGb3JWYXJTdGF0ZW1lbnQiLCJ0cmFjZSIsInZpc2l0Rm9ySW5TdGF0ZW1lbnQiLCJ2aXNpdEZvclZhckluU3RhdGVtZW50IiwidmlzaXRDb250aW51ZVN0YXRlbWVudCIsInZpc2l0QnJlYWtTdGF0ZW1lbnQiLCJ2aXNpdFJldHVyblN0YXRlbWVudCIsInZpc2l0V2l0aFN0YXRlbWVudCIsInZpc2l0U3dpdGNoU3RhdGVtZW50IiwidmlzaXRDYXNlQmxvY2siLCJ2aXNpdENhc2VDbGF1c2VzIiwidmlzaXRDYXNlQ2xhdXNlIiwidmlzaXREZWZhdWx0Q2xhdXNlIiwidmlzaXRMYWJlbGxlZFN0YXRlbWVudCIsInZpc2l0VGhyb3dTdGF0ZW1lbnQiLCJ2aXNpdFRyeVN0YXRlbWVudCIsInZpc2l0Q2F0Y2hQcm9kdWN0aW9uIiwidmlzaXRGaW5hbGx5UHJvZHVjdGlvbiIsInZpc2l0RGVidWdnZXJTdGF0ZW1lbnQiLCJ2aXNpdEZ1bmN0aW9uRGVjbGFyYXRpb24iLCJ2aXNpdEZvcm1hbFBhcmFtZXRlckxpc3QiLCJ2aXNpdEZ1bmN0aW9uQm9keSIsInZpc2l0QXJyYXlMaXRlcmFsIiwidmlzaXRFbGVtZW50TGlzdCIsInZpc2l0RWxpc2lvbiIsInZpc2l0T2JqZWN0TGl0ZXJhbCIsInZpc2l0UHJvcGVydHlOYW1lQW5kVmFsdWVMaXN0IiwidmlzaXRQcm9wZXJ0eUV4cHJlc3Npb25Bc3NpZ25tZW50IiwidmlzaXRQcm9wZXJ0eUdldHRlciIsInZpc2l0UHJvcGVydHlTZXR0ZXIiLCJ2aXNpdFByb3BlcnR5TmFtZSIsInZpc2l0UHJvcGVydHlTZXRQYXJhbWV0ZXJMaXN0IiwidmlzaXRBcmd1bWVudHMiLCJ2aXNpdEFyZ3VtZW50TGlzdCIsInZpc2l0RXhwcmVzc2lvblNlcXVlbmNlIiwidmlzaXRUZXJuYXJ5RXhwcmVzc2lvbiIsInZpc2l0TG9naWNhbEFuZEV4cHJlc3Npb24iLCJ2aXNpdFByZUluY3JlbWVudEV4cHJlc3Npb24iLCJ2aXNpdE9iamVjdExpdGVyYWxFeHByZXNzaW9uIiwidmlzaXRJbkV4cHJlc3Npb24iLCJ2aXNpdExvZ2ljYWxPckV4cHJlc3Npb24iLCJ2aXNpdE5vdEV4cHJlc3Npb24iLCJ2aXNpdFByZURlY3JlYXNlRXhwcmVzc2lvbiIsInZpc2l0QXJndW1lbnRzRXhwcmVzc2lvbiIsInZpc2l0VGhpc0V4cHJlc3Npb24iLCJ2aXNpdEZ1bmN0aW9uRXhwcmVzc2lvbiIsInZpc2l0VW5hcnlNaW51c0V4cHJlc3Npb24iLCJ2aXNpdFBvc3REZWNyZWFzZUV4cHJlc3Npb24iLCJ2aXNpdEFzc2lnbm1lbnRFeHByZXNzaW9uIiwidmlzaXRUeXBlb2ZFeHByZXNzaW9uIiwidmlzaXRJbnN0YW5jZW9mRXhwcmVzc2lvbiIsInZpc2l0VW5hcnlQbHVzRXhwcmVzc2lvbiIsInZpc2l0RGVsZXRlRXhwcmVzc2lvbiIsInZpc2l0RXF1YWxpdHlFeHByZXNzaW9uIiwidmlzaXRCaXRYT3JFeHByZXNzaW9uIiwidmlzaXRNdWx0aXBsaWNhdGl2ZUV4cHJlc3Npb24iLCJ2aXNpdEJpdFNoaWZ0RXhwcmVzc2lvbiIsInZpc2l0UGFyZW50aGVzaXplZEV4cHJlc3Npb24iLCJ2aXNpdEFkZGl0aXZlRXhwcmVzc2lvbiIsInZpc2l0UmVsYXRpb25hbEV4cHJlc3Npb24iLCJ2aXNpdFBvc3RJbmNyZW1lbnRFeHByZXNzaW9uIiwidmlzaXRCaXROb3RFeHByZXNzaW9uIiwidmlzaXROZXdFeHByZXNzaW9uIiwidmlzaXRMaXRlcmFsRXhwcmVzc2lvbiIsInZpc2l0QXJyYXlMaXRlcmFsRXhwcmVzc2lvbiIsInZpc2l0TWVtYmVyRG90RXhwcmVzc2lvbiIsInZpc2l0TWVtYmVySW5kZXhFeHByZXNzaW9uIiwidmlzaXRJZGVudGlmaWVyRXhwcmVzc2lvbiIsInZpc2l0Qml0QW5kRXhwcmVzc2lvbiIsInZpc2l0Qml0T3JFeHByZXNzaW9uIiwidmlzaXRBc3NpZ25tZW50T3BlcmF0b3JFeHByZXNzaW9uIiwidmlzaXRWb2lkRXhwcmVzc2lvbiIsInZpc2l0QXNzaWdubWVudE9wZXJhdG9yIiwidmlzaXRMaXRlcmFsIiwidmlzaXROdW1lcmljTGl0ZXJhbCIsInZpc2l0SWRlbnRpZmllck5hbWUiLCJ2aXNpdFJlc2VydmVkV29yZCIsInZpc2l0S2V5d29yZCIsInZpc2l0RnV0dXJlUmVzZXJ2ZWRXb3JkIiwidmlzaXRHZXR0ZXIiLCJ2aXNpdFNldHRlciIsInZpc2l0RW9zIiwidmlzaXRFb2YiLCJ2aXNpdENoaWxkcmVuWFgiLCJjaGlsZHJlbiIsIm1hcCIsImNoaWxkIiwibGVuZ3RoIiwiYWNjZXB0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBR08sTUFBTUEsWUFBTixTQUEyQkMsb0NBQTNCLENBQXlDO0FBRWhEO0FBQ0NDLEVBQUFBLFlBQVksQ0FBRUMsR0FBRixFQUFtQjtBQUM5QkMsSUFBQUEsT0FBTyxDQUFDQyxJQUFSLENBQWEsbUJBQW1CRixHQUFHLENBQUNHLE9BQUosRUFBaEM7QUFFQSxXQUFPLEtBQUtDLGFBQUwsQ0FBbUJK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LFFBQU4sQ0FBZUcsTUFBZixJQUF5QixDQUEvQyxFQUFrRDtBQUNoRCxpQkFBT0QsS0FBSyxDQUFDRSxNQUFOLENBQWEsSUFBYixDQUFQO0FBQ0QsU0FGRCxNQUVPO0FBQ0wsaUJBQU9GLEtBQUssQ0FBQ3ZHLE9BQU4sRUFBUDtBQUNEO0FBQ0YsT0FOTSxDQUFQO0FBT0Q7QUFDRjs7QUF6b0I2QyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7RUNNQVNjcmlwdFZpc2l0b3IgYXMgRGVsdmVuVmlzaXRvcn0gZnJvbSBcIi4vcGFyc2VyL0VDTUFTY3JpcHRWaXNpdG9yXCJcbmltcG9ydCB7IFJ1bGVDb250ZXh0IH0gZnJvbSBcImFudGxyNC9SdWxlQ29udGV4dFwiXG5cbmV4cG9ydCBjbGFzcyBQcmludFZpc2l0b3IgZXh0ZW5kcyBEZWx2ZW5WaXNpdG9yIHtcblxuLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjcHJvZ3JhbS5cbiB2aXNpdFByb2dyYW0gKGN0eDpSdWxlQ29udGV4dCkgeyAgXG4gIGNvbnNvbGUuaW5mbyhcInZpc2l0UHJvZ3JhbTogXCIgKyBjdHguZ2V0VGV4dCgpKTtcbiAgXG4gIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbn07XG5cblxuLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjc291cmNlRWxlbWVudHMuXG4gdmlzaXRTb3VyY2VFbGVtZW50cyAoY3R4OlJ1bGVDb250ZXh0KSB7IFxuICBjb25zb2xlLmluZm8oXCJ2aXNpdFNvdXJjZUVsZW1lbnRzOiBcIiArIGN0eC5nZXRUZXh0KCkpO1xuICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG59O1xuXG5cbi8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI3NvdXJjZUVsZW1lbnQuXG4gdmlzaXRTb3VyY2VFbGVtZW50IChjdHg6UnVsZUNvbnRleHQpIHsgIFxuICBjb25zb2xlLmluZm8oXCJ2aXNpdFNvdXJjZUVsZW1lbnQ6IFwiICsgY3R4LmdldFRleHQoKSk7XG4gIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbn07XG5cblxuLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjc3RhdGVtZW50LlxuIHZpc2l0U3RhdGVtZW50IChjdHg6UnVsZUNvbnRleHQpIHsgXG4gIGNvbnNvbGUuaW5mbyhcInZpc2l0U3RhdGVtZW50OiBcIiArIGN0eC5nZXRUZXh0KCkpO1xuICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG59O1xuXG5cbi8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2Jsb2NrLlxuIHZpc2l0QmxvY2sgKGN0eDpSdWxlQ29udGV4dCkgeyAgXG4gIGNvbnNvbGUuaW5mbyhcInZpc2l0QmxvY2s6IFwiICsgY3R4LmdldFRleHQoKSk7XG4gIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbn07XG5cblxuLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjc3RhdGVtZW50TGlzdC5cbiB2aXNpdFN0YXRlbWVudExpc3QgKGN0eDpSdWxlQ29udGV4dCkgeyAgXG4gIGNvbnNvbGUuaW5mbyhcInZpc2l0U3RhdGVtZW50TGlzdDogXCIgKyBjdHguZ2V0VGV4dCgpKTtcbiAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xufTtcblxuXG4vLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciN2YXJpYWJsZVN0YXRlbWVudC5cbiB2aXNpdFZhcmlhYmxlU3RhdGVtZW50IChjdHg6UnVsZUNvbnRleHQpIHsgIFxuICBjb25zb2xlLmluZm8oXCJ2aXNpdFZhcmlhYmxlU3RhdGVtZW50OiBcIiArIGN0eC5nZXRUZXh0KCkpO1xuXG4gIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbn07XG5cblxuLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjdmFyaWFibGVEZWNsYXJhdGlvbkxpc3QuXG4gdmlzaXRWYXJpYWJsZURlY2xhcmF0aW9uTGlzdCAoY3R4OlJ1bGVDb250ZXh0KSB7IFxuIGNvbnNvbGUuaW5mbyhcInZpc2l0VmFyaWFibGVEZWNsYXJhdGlvbkxpc3Q6IFwiICsgY3R4LmdldFRleHQoKSk7XG5cbiAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xufTtcblxuXG4vLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciN2YXJpYWJsZURlY2xhcmF0aW9uLlxuIHZpc2l0VmFyaWFibGVEZWNsYXJhdGlvbiAoY3R4OlJ1bGVDb250ZXh0KSB7ICBcbiAgY29uc29sZS5pbmZvKFwidmlzaXRWYXJpYWJsZURlY2xhcmF0aW9uOiBcIiArIGN0eC5nZXRUZXh0KCkpO1xuXG4gIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbn07XG5cblxuLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjaW5pdGlhbGlzZXIuXG4gdmlzaXRJbml0aWFsaXNlciAoY3R4OlJ1bGVDb250ZXh0KSB7XG4gIGNvbnNvbGUuaW5mbyhcInZpc2l0SW5pdGlhbGlzZXI6IFwiICsgY3R4LmdldFRleHQoKSk7XG4gIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbn07XG5cblxuLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjZW1wdHlTdGF0ZW1lbnQuXG4gdmlzaXRFbXB0eVN0YXRlbWVudCAoY3R4OlJ1bGVDb250ZXh0KSB7ICBcbiAgY29uc29sZS5pbmZvKFwidmlzaXRFbXB0eVN0YXRlbWVudDogXCIgKyBjdHguZ2V0VGV4dCgpKTtcbiAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xufTtcblxuXG4vLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNleHByZXNzaW9uU3RhdGVtZW50LlxuIHZpc2l0RXhwcmVzc2lvblN0YXRlbWVudCAoY3R4OlJ1bGVDb250ZXh0KSB7IFxuICBjb25zb2xlLmluZm8oXCJ2aXNpdEV4cHJlc3Npb25TdGF0ZW1lbnQ6IFwiICsgY3R4LmdldFRleHQoKSk7XG4gIFxuICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG59O1xuXG5cbi8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2lmU3RhdGVtZW50LlxuIHZpc2l0SWZTdGF0ZW1lbnQgKGN0eDpSdWxlQ29udGV4dCkgeyAgXG4gIGNvbnNvbGUuaW5mbyhcInZpc2l0SWZTdGF0ZW1lbnQ6IFwiICsgY3R4LmdldFRleHQoKSk7XG4gIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbn07XG5cblxuLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjRG9TdGF0ZW1lbnQuXG4gdmlzaXREb1N0YXRlbWVudCAoY3R4OlJ1bGVDb250ZXh0KSB7IFxuICBjb25zb2xlLmluZm8oXCJ2aXNpdERvU3RhdGVtZW50OiBcIiArIGN0eC5nZXRUZXh0KCkpO1xuICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG59O1xuXG5cbi8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI1doaWxlU3RhdGVtZW50LlxuIHZpc2l0V2hpbGVTdGF0ZW1lbnQgKGN0eDpSdWxlQ29udGV4dCkgeyAgXG4gIGNvbnNvbGUuaW5mbyhcInZpc2l0V2hpbGVTdGF0ZW1lbnQ6IFwiICsgY3R4LmdldFRleHQoKSk7XG4gIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbn07XG5cblxuLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjRm9yU3RhdGVtZW50LlxuIHZpc2l0Rm9yU3RhdGVtZW50IChjdHg6UnVsZUNvbnRleHQpIHsgIFxuICBjb25zb2xlLmluZm8oXCJ2aXNpdFdoaWxlU3RhdGVtZW50OiBcIiArIGN0eC5nZXRUZXh0KCkpO1xuICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG59O1xuXG5cbi8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI0ZvclZhclN0YXRlbWVudC5cbiB2aXNpdEZvclZhclN0YXRlbWVudCAoY3R4OlJ1bGVDb250ZXh0KSB7ICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG59O1xuXG5cbi8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI0ZvckluU3RhdGVtZW50LlxuIHZpc2l0Rm9ySW5TdGF0ZW1lbnQgKGN0eDpSdWxlQ29udGV4dCkgeyAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xufTtcblxuXG4vLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNGb3JWYXJJblN0YXRlbWVudC5cbiB2aXNpdEZvclZhckluU3RhdGVtZW50IChjdHg6UnVsZUNvbnRleHQpIHsgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbn07XG5cblxuLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjY29udGludWVTdGF0ZW1lbnQuXG4gdmlzaXRDb250aW51ZVN0YXRlbWVudCAoY3R4OlJ1bGVDb250ZXh0KSB7ICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG59O1xuXG5cbi8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2JyZWFrU3RhdGVtZW50LlxuIHZpc2l0QnJlYWtTdGF0ZW1lbnQgKGN0eDpSdWxlQ29udGV4dCkgeyAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xufTtcblxuXG4vLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNyZXR1cm5TdGF0ZW1lbnQuXG4gdmlzaXRSZXR1cm5TdGF0ZW1lbnQgKGN0eDpSdWxlQ29udGV4dCkgeyAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xufTtcblxuXG4vLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciN3aXRoU3RhdGVtZW50LlxuIHZpc2l0V2l0aFN0YXRlbWVudCAoY3R4OlJ1bGVDb250ZXh0KSB7ICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG59O1xuXG5cbi8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI3N3aXRjaFN0YXRlbWVudC5cbiB2aXNpdFN3aXRjaFN0YXRlbWVudCAoY3R4OlJ1bGVDb250ZXh0KSB7ICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG59O1xuXG5cbi8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2Nhc2VCbG9jay5cbiB2aXNpdENhc2VCbG9jayAoY3R4OlJ1bGVDb250ZXh0KSB7ICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG59O1xuXG5cbi8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2Nhc2VDbGF1c2VzLlxuIHZpc2l0Q2FzZUNsYXVzZXMgKGN0eDpSdWxlQ29udGV4dCkgeyAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xufTtcblxuXG4vLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNjYXNlQ2xhdXNlLlxuIHZpc2l0Q2FzZUNsYXVzZSAoY3R4OlJ1bGVDb250ZXh0KSB7ICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG59O1xuXG5cbi8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2RlZmF1bHRDbGF1c2UuXG4gdmlzaXREZWZhdWx0Q2xhdXNlIChjdHg6UnVsZUNvbnRleHQpIHsgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbn07XG5cblxuLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjbGFiZWxsZWRTdGF0ZW1lbnQuXG4gdmlzaXRMYWJlbGxlZFN0YXRlbWVudCAoY3R4OlJ1bGVDb250ZXh0KSB7ICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG59O1xuXG5cbi8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI3Rocm93U3RhdGVtZW50LlxuIHZpc2l0VGhyb3dTdGF0ZW1lbnQgKGN0eDpSdWxlQ29udGV4dCkgeyAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xufTtcblxuXG4vLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciN0cnlTdGF0ZW1lbnQuXG4gdmlzaXRUcnlTdGF0ZW1lbnQgKGN0eDpSdWxlQ29udGV4dCkgeyAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xufTtcblxuXG4vLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNjYXRjaFByb2R1Y3Rpb24uXG4gdmlzaXRDYXRjaFByb2R1Y3Rpb24gKGN0eDpSdWxlQ29udGV4dCkgeyAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xufTtcblxuXG4vLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNmaW5hbGx5UHJvZHVjdGlvbi5cbiB2aXNpdEZpbmFsbHlQcm9kdWN0aW9uIChjdHg6UnVsZUNvbnRleHQpIHsgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbn07XG5cblxuLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjZGVidWdnZXJTdGF0ZW1lbnQuXG4gdmlzaXREZWJ1Z2dlclN0YXRlbWVudCAoY3R4OlJ1bGVDb250ZXh0KSB7ICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG59O1xuXG5cbi8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2Z1bmN0aW9uRGVjbGFyYXRpb24uXG4gdmlzaXRGdW5jdGlvbkRlY2xhcmF0aW9uIChjdHg6UnVsZUNvbnRleHQpIHsgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbn07XG5cblxuLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjZm9ybWFsUGFyYW1ldGVyTGlzdC5cbiB2aXNpdEZvcm1hbFBhcmFtZXRlckxpc3QgKGN0eDpSdWxlQ29udGV4dCkgeyAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xufTtcblxuXG4vLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNmdW5jdGlvbkJvZHkuXG4gdmlzaXRGdW5jdGlvbkJvZHkgKGN0eDpSdWxlQ29udGV4dCkgeyBcbiAgY29uc29sZS5pbmZvKFwidmlzaXRGdW5jdGlvbkJvZHk6IFwiICsgY3R4LmdldFRleHQoKSk7XG5cbiAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xufTtcblxuXG4vLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNhcnJheUxpdGVyYWwuXG4gdmlzaXRBcnJheUxpdGVyYWwgKGN0eDpSdWxlQ29udGV4dCkgeyAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xufTtcblxuXG4vLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNlbGVtZW50TGlzdC5cbiB2aXNpdEVsZW1lbnRMaXN0IChjdHg6UnVsZUNvbnRleHQpIHsgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbn07XG5cblxuLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjZWxpc2lvbi5cbiB2aXNpdEVsaXNpb24gKGN0eDpSdWxlQ29udGV4dCkgeyAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xufTtcblxuXG4vLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNvYmplY3RMaXRlcmFsLlxuIHZpc2l0T2JqZWN0TGl0ZXJhbCAoY3R4OlJ1bGVDb250ZXh0KSB7ICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG59O1xuXG5cbi8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI3Byb3BlcnR5TmFtZUFuZFZhbHVlTGlzdC5cbiB2aXNpdFByb3BlcnR5TmFtZUFuZFZhbHVlTGlzdCAoY3R4OlJ1bGVDb250ZXh0KSB7ICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG59O1xuXG5cbi8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI1Byb3BlcnR5RXhwcmVzc2lvbkFzc2lnbm1lbnQuXG4gdmlzaXRQcm9wZXJ0eUV4cHJlc3Npb25Bc3NpZ25tZW50IChjdHg6UnVsZUNvbnRleHQpIHsgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbn07XG5cblxuLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjUHJvcGVydHlHZXR0ZXIuXG4gdmlzaXRQcm9wZXJ0eUdldHRlciAoY3R4OlJ1bGVDb250ZXh0KSB7ICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG59O1xuXG5cbi8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI1Byb3BlcnR5U2V0dGVyLlxuIHZpc2l0UHJvcGVydHlTZXR0ZXIgKGN0eDpSdWxlQ29udGV4dCkgeyAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xufTtcblxuXG4vLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNwcm9wZXJ0eU5hbWUuXG4gdmlzaXRQcm9wZXJ0eU5hbWUgKGN0eDpSdWxlQ29udGV4dCkgeyAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xufTtcblxuXG4vLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNwcm9wZXJ0eVNldFBhcmFtZXRlckxpc3QuXG4gdmlzaXRQcm9wZXJ0eVNldFBhcmFtZXRlckxpc3QgKGN0eDpSdWxlQ29udGV4dCkgeyAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xufTtcblxuXG4vLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNhcmd1bWVudHMuXG4gdmlzaXRBcmd1bWVudHMgKGN0eDpSdWxlQ29udGV4dCkgeyAgXG4gIGNvbnNvbGUuaW5mbyhcInZpc2l0QXJndW1lbnRzOiBcIiArIGN0eC5nZXRUZXh0KCkpO1xuICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG59O1xuXG5cbi8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2FyZ3VtZW50TGlzdC5cbiB2aXNpdEFyZ3VtZW50TGlzdCAoY3R4OlJ1bGVDb250ZXh0KSB7ICBcbiAgY29uc29sZS5pbmZvKFwidmlzaXRBcmd1bWVudExpc3Q6IFwiICsgY3R4LmdldFRleHQoKSk7XG5cbiAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xufTtcblxuXG4vLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNleHByZXNzaW9uU2VxdWVuY2UuXG4gdmlzaXRFeHByZXNzaW9uU2VxdWVuY2UgKGN0eDpSdWxlQ29udGV4dCkgeyAgXG4gIGNvbnNvbGUuaW5mbyhcInZpc2l0RXhwcmVzc2lvblNlcXVlbmNlOiBcIiArIGN0eC5nZXRUZXh0KCkpO1xuICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG59O1xuXG5cbi8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI1Rlcm5hcnlFeHByZXNzaW9uLlxuIHZpc2l0VGVybmFyeUV4cHJlc3Npb24gKGN0eDpSdWxlQ29udGV4dCkgeyAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xufTtcblxuXG4vLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNMb2dpY2FsQW5kRXhwcmVzc2lvbi5cbiB2aXNpdExvZ2ljYWxBbmRFeHByZXNzaW9uIChjdHg6UnVsZUNvbnRleHQpIHsgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbn07XG5cblxuLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjUHJlSW5jcmVtZW50RXhwcmVzc2lvbi5cbiB2aXNpdFByZUluY3JlbWVudEV4cHJlc3Npb24gKGN0eDpSdWxlQ29udGV4dCkgeyAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xufTtcblxuXG4vLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNPYmplY3RMaXRlcmFsRXhwcmVzc2lvbi5cbiB2aXNpdE9iamVjdExpdGVyYWxFeHByZXNzaW9uIChjdHg6UnVsZUNvbnRleHQpIHsgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbn07XG5cblxuLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjSW5FeHByZXNzaW9uLlxuIHZpc2l0SW5FeHByZXNzaW9uIChjdHg6UnVsZUNvbnRleHQpIHsgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbn07XG5cblxuLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjTG9naWNhbE9yRXhwcmVzc2lvbi5cbiB2aXNpdExvZ2ljYWxPckV4cHJlc3Npb24gKGN0eDpSdWxlQ29udGV4dCkgeyAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xufTtcblxuXG4vLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNOb3RFeHByZXNzaW9uLlxuIHZpc2l0Tm90RXhwcmVzc2lvbiAoY3R4OlJ1bGVDb250ZXh0KSB7ICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG59O1xuXG5cbi8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI1ByZURlY3JlYXNlRXhwcmVzc2lvbi5cbiB2aXNpdFByZURlY3JlYXNlRXhwcmVzc2lvbiAoY3R4OlJ1bGVDb250ZXh0KSB7ICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG59O1xuXG5cbi8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI0FyZ3VtZW50c0V4cHJlc3Npb24uXG4gdmlzaXRBcmd1bWVudHNFeHByZXNzaW9uIChjdHg6UnVsZUNvbnRleHQpIHsgIFxuICBjb25zb2xlLmluZm8oXCJ2aXNpdEFyZ3VtZW50c0V4cHJlc3Npb246IFwiICsgY3R4LmdldFRleHQoKSk7XG5cbiAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xufTtcblxuXG4vLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNUaGlzRXhwcmVzc2lvbi5cbiB2aXNpdFRoaXNFeHByZXNzaW9uIChjdHg6UnVsZUNvbnRleHQpIHsgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbn07XG5cblxuLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjRnVuY3Rpb25FeHByZXNzaW9uLlxuIHZpc2l0RnVuY3Rpb25FeHByZXNzaW9uIChjdHg6UnVsZUNvbnRleHQpIHsgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbn07XG5cblxuLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjVW5hcnlNaW51c0V4cHJlc3Npb24uXG4gdmlzaXRVbmFyeU1pbnVzRXhwcmVzc2lvbiAoY3R4OlJ1bGVDb250ZXh0KSB7ICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG59O1xuXG5cbi8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI1Bvc3REZWNyZWFzZUV4cHJlc3Npb24uXG4gdmlzaXRQb3N0RGVjcmVhc2VFeHByZXNzaW9uIChjdHg6UnVsZUNvbnRleHQpIHsgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbn07XG5cblxuLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjQXNzaWdubWVudEV4cHJlc3Npb24uXG4gdmlzaXRBc3NpZ25tZW50RXhwcmVzc2lvbiAoY3R4OlJ1bGVDb250ZXh0KSB7ICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG59O1xuXG5cbi8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI1R5cGVvZkV4cHJlc3Npb24uXG4gdmlzaXRUeXBlb2ZFeHByZXNzaW9uIChjdHg6UnVsZUNvbnRleHQpIHsgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbn07XG5cblxuLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjSW5zdGFuY2VvZkV4cHJlc3Npb24uXG4gdmlzaXRJbnN0YW5jZW9mRXhwcmVzc2lvbiAoY3R4OlJ1bGVDb250ZXh0KSB7ICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG59O1xuXG5cbi8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI1VuYXJ5UGx1c0V4cHJlc3Npb24uXG4gdmlzaXRVbmFyeVBsdXNFeHByZXNzaW9uIChjdHg6UnVsZUNvbnRleHQpIHsgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbn07XG5cblxuLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjRGVsZXRlRXhwcmVzc2lvbi5cbiB2aXNpdERlbGV0ZUV4cHJlc3Npb24gKGN0eDpSdWxlQ29udGV4dCkgeyAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xufTtcblxuXG4vLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNFcXVhbGl0eUV4cHJlc3Npb24uXG4gdmlzaXRFcXVhbGl0eUV4cHJlc3Npb24gKGN0eDpSdWxlQ29udGV4dCkgeyAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xufTtcblxuXG4vLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNCaXRYT3JFeHByZXNzaW9uLlxuIHZpc2l0Qml0WE9yRXhwcmVzc2lvbiAoY3R4OlJ1bGVDb250ZXh0KSB7ICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG59O1xuXG5cbi8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI011bHRpcGxpY2F0aXZlRXhwcmVzc2lvbi5cbiB2aXNpdE11bHRpcGxpY2F0aXZlRXhwcmVzc2lvbiAoY3R4OlJ1bGVDb250ZXh0KSB7ICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG59O1xuXG5cbi8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI0JpdFNoaWZ0RXhwcmVzc2lvbi5cbiB2aXNpdEJpdFNoaWZ0RXhwcmVzc2lvbiAoY3R4OlJ1bGVDb250ZXh0KSB7ICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG59O1xuXG5cbi8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI1BhcmVudGhlc2l6ZWRFeHByZXNzaW9uLlxuIHZpc2l0UGFyZW50aGVzaXplZEV4cHJlc3Npb24gKGN0eDpSdWxlQ29udGV4dCkgeyAgXG4gIGNvbnNvbGUuaW5mbyhcInZpc2l0UGFyZW50aGVzaXplZEV4cHJlc3Npb246IFwiICsgY3R4LmdldFRleHQoKSk7XG5cbiAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xufTtcblxuXG4vLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNBZGRpdGl2ZUV4cHJlc3Npb24uXG4gdmlzaXRBZGRpdGl2ZUV4cHJlc3Npb24gKGN0eDpSdWxlQ29udGV4dCkgeyAgXG4gIGNvbnNvbGUuaW5mbyhcInZpc2l0QWRkaXRpdmVFeHByZXNzaW9uOiBcIiArIGN0eC5nZXRUZXh0KCkpO1xuICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG59O1xuXG5cbi8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI1JlbGF0aW9uYWxFeHByZXNzaW9uLlxuIHZpc2l0UmVsYXRpb25hbEV4cHJlc3Npb24gKGN0eDpSdWxlQ29udGV4dCkgeyAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xufTtcblxuXG4vLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNQb3N0SW5jcmVtZW50RXhwcmVzc2lvbi5cbiB2aXNpdFBvc3RJbmNyZW1lbnRFeHByZXNzaW9uIChjdHg6UnVsZUNvbnRleHQpIHsgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbn07XG5cblxuLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjQml0Tm90RXhwcmVzc2lvbi5cbiB2aXNpdEJpdE5vdEV4cHJlc3Npb24gKGN0eDpSdWxlQ29udGV4dCkgeyAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xufTtcblxuXG4vLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNOZXdFeHByZXNzaW9uLlxuIHZpc2l0TmV3RXhwcmVzc2lvbiAoY3R4OlJ1bGVDb250ZXh0KSB7ICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG59O1xuXG5cbi8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI0xpdGVyYWxFeHByZXNzaW9uLlxuIHZpc2l0TGl0ZXJhbEV4cHJlc3Npb24gKGN0eDpSdWxlQ29udGV4dCkgeyAgXG4gIGNvbnNvbGUuaW5mbyhcInZpc2l0TGl0ZXJhbEV4cHJlc3Npb246IFwiICsgY3R4LmdldFRleHQoKSk7XG4gIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbn07XG5cblxuLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjQXJyYXlMaXRlcmFsRXhwcmVzc2lvbi5cbiB2aXNpdEFycmF5TGl0ZXJhbEV4cHJlc3Npb24gKGN0eDpSdWxlQ29udGV4dCkgeyAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xufTtcblxuXG4vLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNNZW1iZXJEb3RFeHByZXNzaW9uLlxuIHZpc2l0TWVtYmVyRG90RXhwcmVzc2lvbiAoY3R4OlJ1bGVDb250ZXh0KSB7ICBcbiAgY29uc29sZS5pbmZvKFwidmlzaXRNZW1iZXJEb3RFeHByZXNzaW9uOiBcIiArIGN0eC5nZXRUZXh0KCkpO1xuICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG59O1xuXG5cbi8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI01lbWJlckluZGV4RXhwcmVzc2lvbi5cbiB2aXNpdE1lbWJlckluZGV4RXhwcmVzc2lvbiAoY3R4OlJ1bGVDb250ZXh0KSB7ICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG59O1xuXG5cbi8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI0lkZW50aWZpZXJFeHByZXNzaW9uLlxuIHZpc2l0SWRlbnRpZmllckV4cHJlc3Npb24gKGN0eDpSdWxlQ29udGV4dCkgeyBcbiAgY29uc29sZS5pbmZvKFwidmlzaXRJZGVudGlmaWVyRXhwcmVzc2lvbjogXCIgKyBjdHguZ2V0VGV4dCgpKTtcblxuICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG59O1xuXG5cbi8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI0JpdEFuZEV4cHJlc3Npb24uXG4gdmlzaXRCaXRBbmRFeHByZXNzaW9uIChjdHg6UnVsZUNvbnRleHQpIHsgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbn07XG5cblxuLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjQml0T3JFeHByZXNzaW9uLlxuIHZpc2l0Qml0T3JFeHByZXNzaW9uIChjdHg6UnVsZUNvbnRleHQpIHsgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbn07XG5cblxuLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjQXNzaWdubWVudE9wZXJhdG9yRXhwcmVzc2lvbi5cbiB2aXNpdEFzc2lnbm1lbnRPcGVyYXRvckV4cHJlc3Npb24gKGN0eDpSdWxlQ29udGV4dCkgeyAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xufTtcblxuXG4vLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNWb2lkRXhwcmVzc2lvbi5cbiB2aXNpdFZvaWRFeHByZXNzaW9uIChjdHg6UnVsZUNvbnRleHQpIHsgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbn07XG5cbi8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2Fzc2lnbm1lbnRPcGVyYXRvci5cbiB2aXNpdEFzc2lnbm1lbnRPcGVyYXRvciAoY3R4OlJ1bGVDb250ZXh0KSB7IFxuICBjb25zb2xlLmluZm8oXCJ2aXNpdEFzc2lnbm1lbnRPcGVyYXRvcjogXCIgKyBjdHguZ2V0VGV4dCgpKTtcbiAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xufTtcblxuXG4vLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNsaXRlcmFsLlxuIHZpc2l0TGl0ZXJhbCAoY3R4OlJ1bGVDb250ZXh0KSB7IFxuICBjb25zb2xlLmluZm8oXCJ2aXNpdExpdGVyYWw6IFwiICsgY3R4LmdldFRleHQoKSk7XG4gIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbn07XG5cblxuLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjbnVtZXJpY0xpdGVyYWwuXG4gdmlzaXROdW1lcmljTGl0ZXJhbCAoY3R4OlJ1bGVDb250ZXh0KSB7ICBcbiAgY29uc29sZS5pbmZvKFwidmlzaXROdW1lcmljTGl0ZXJhbDogXCIgKyBjdHguZ2V0VGV4dCgpKTtcbiAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xufTtcblxuXG4vLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNpZGVudGlmaWVyTmFtZS5cbiB2aXNpdElkZW50aWZpZXJOYW1lIChjdHg6UnVsZUNvbnRleHQpIHsgIFxuICBjb25zb2xlLmluZm8oXCJ2aXNpdElkZW50aWZpZXJOYW1lOiBcIiArIGN0eC5nZXRUZXh0KCkpO1xuICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG59O1xuXG5cbi8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI3Jlc2VydmVkV29yZC5cbiB2aXNpdFJlc2VydmVkV29yZCAoY3R4OlJ1bGVDb250ZXh0KSB7ICBcbiAgY29uc29sZS5pbmZvKFwidmlzaXRSZXNlcnZlZFdvcmQ6IFwiICsgY3R4LmdldFRleHQoKSk7XG5cbiAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xufTtcblxuXG4vLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNrZXl3b3JkLlxuIHZpc2l0S2V5d29yZCAoY3R4OlJ1bGVDb250ZXh0KSB7ICBcbiAgY29uc29sZS5pbmZvKFwidmlzaXRLZXl3b3JkOiBcIiArIGN0eC5nZXRUZXh0KCkpO1xuXG4gIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbn07XG5cblxuLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjZnV0dXJlUmVzZXJ2ZWRXb3JkLlxuIHZpc2l0RnV0dXJlUmVzZXJ2ZWRXb3JkIChjdHg6UnVsZUNvbnRleHQpIHsgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbn07XG5cblxuLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjZ2V0dGVyLlxuIHZpc2l0R2V0dGVyIChjdHg6UnVsZUNvbnRleHQpIHsgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbn07XG5cblxuLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjc2V0dGVyLlxuIHZpc2l0U2V0dGVyIChjdHg6UnVsZUNvbnRleHQpIHsgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbn07XG5cblxuLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjZW9zLlxuIHZpc2l0RW9zIChjdHg6UnVsZUNvbnRleHQpIHsgIFxuICAvL2NvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbn07XG5cbi8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2VvZi5cbiB2aXNpdEVvZiAoY3R4OlJ1bGVDb250ZXh0KSB7ICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG59O1xuXG5cblxuICB2aXNpdENoaWxkcmVuWFgoY3R4KSB7XG4gICAgY29uc29sZS5pbmZvKFwiQ29udGV4dCA6XCIgKyBjdHguZ2V0VGV4dCgpKVxuICAgIGlmICghY3R4KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKGN0eC5jaGlsZHJlbikge1xuICAgICAgcmV0dXJuIGN0eC5jaGlsZHJlbi5tYXAoY2hpbGQgPT4ge1xuICAgICAgICBpZiAoY2hpbGQuY2hpbGRyZW4gJiYgY2hpbGQuY2hpbGRyZW4ubGVuZ3RoICE9IDApIHtcbiAgICAgICAgICByZXR1cm4gY2hpbGQuYWNjZXB0KHRoaXMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBjaGlsZC5nZXRUZXh0KCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxufSJdfQ==