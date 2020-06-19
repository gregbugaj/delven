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
  } // Visit a parse tree produced by ECMAScriptParser#sourceElements.


  visitSourceElements(ctx) {
    console.info("visitSourceElements: " + ctx.getText());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#sourceElement.


  visitSourceElement(ctx) {
    console.info("visitSourceElement: " + ctx.getText());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#statement.


  visitStatement(ctx) {
    console.info("visitStatement: " + ctx.getText());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#block.


  visitBlock(ctx) {
    console.info("visitBlock: " + ctx.getText());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#statementList.


  visitStatementList(ctx) {
    console.info("visitStatementList: " + ctx.getText());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#variableStatement.


  visitVariableStatement(ctx) {
    console.info("visitVariableStatement: " + ctx.getText());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#variableDeclarationList.


  visitVariableDeclarationList(ctx) {
    console.info("visitVariableDeclarationList: " + ctx.getText());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#variableDeclaration.


  visitVariableDeclaration(ctx) {
    console.info("visitVariableDeclaration: " + ctx.getText());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#initialiser.


  visitInitialiser(ctx) {
    console.info("visitInitialiser: " + ctx.getText());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#emptyStatement.


  visitEmptyStatement(ctx) {
    console.info("visitEmptyStatement: " + ctx.getText());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#expressionStatement.


  visitExpressionStatement(ctx) {
    console.info("visitExpressionStatement: " + ctx.getText());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#ifStatement.


  visitIfStatement(ctx) {
    console.info("visitIfStatement: " + ctx.getText());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#DoStatement.


  visitDoStatement(ctx) {
    console.info("visitDoStatement: " + ctx.getText());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#WhileStatement.


  visitWhileStatement(ctx) {
    console.info("visitWhileStatement: " + ctx.getText());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#ForStatement.


  visitForStatement(ctx) {
    console.info("visitWhileStatement: " + ctx.getText());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#ForVarStatement.


  visitForVarStatement(ctx) {
    console.trace('not implemented');
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#ForInStatement.


  visitForInStatement(ctx) {
    console.trace('not implemented');
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#ForVarInStatement.


  visitForVarInStatement(ctx) {
    console.trace('not implemented');
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#continueStatement.


  visitContinueStatement(ctx) {
    console.trace('not implemented');
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#breakStatement.


  visitBreakStatement(ctx) {
    console.trace('not implemented');
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#returnStatement.


  visitReturnStatement(ctx) {
    console.trace('not implemented');
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#withStatement.


  visitWithStatement(ctx) {
    console.trace('not implemented');
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#switchStatement.


  visitSwitchStatement(ctx) {
    console.trace('not implemented');
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#caseBlock.


  visitCaseBlock(ctx) {
    console.trace('not implemented');
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#caseClauses.


  visitCaseClauses(ctx) {
    console.trace('not implemented');
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#caseClause.


  visitCaseClause(ctx) {
    console.trace('not implemented');
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#defaultClause.


  visitDefaultClause(ctx) {
    console.trace('not implemented');
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#labelledStatement.


  visitLabelledStatement(ctx) {
    console.trace('not implemented');
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#throwStatement.


  visitThrowStatement(ctx) {
    console.trace('not implemented');
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#tryStatement.


  visitTryStatement(ctx) {
    console.trace('not implemented');
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#catchProduction.


  visitCatchProduction(ctx) {
    console.trace('not implemented');
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#finallyProduction.


  visitFinallyProduction(ctx) {
    console.trace('not implemented');
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#debuggerStatement.


  visitDebuggerStatement(ctx) {
    console.trace('not implemented');
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#functionDeclaration.


  visitFunctionDeclaration(ctx) {
    console.trace('not implemented');
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#formalParameterList.


  visitFormalParameterList(ctx) {
    console.info("visitFormalParameterList [%s] : [%s]", ctx.getChildCount(), ctx.getText());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#functionBody.


  visitFunctionBody(ctx) {
    console.info("visitFunctionBody [%s] : [%s]", ctx.getChildCount(), ctx.getText());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#arrayLiteral.


  visitArrayLiteral(ctx) {
    console.info("visitArrayLiteral [%s] : [%s]", ctx.getChildCount(), ctx.getText());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#elementList.


  visitElementList(ctx) {
    console.info("visitElementList [%s] : [%s]", ctx.getChildCount(), ctx.getText());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#elision.


  visitElision(ctx) {
    console.info("visitElision [%s] : [%s]", ctx.getChildCount(), ctx.getText());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#objectLiteral.


  visitObjectLiteral(ctx) {
    console.info("visitObjectLiteral [%s] : [%s]", ctx.getChildCount(), ctx.getText());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#propertyNameAndValueList.


  visitPropertyNameAndValueList(ctx) {
    console.info("visitPropertyNameAndValueList [%s] : [%s]", ctx.getChildCount(), ctx.getText());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#PropertyExpressionAssignment.


  visitPropertyExpressionAssignment(ctx) {
    console.info("visitPropertyExpressionAssignment [%s] : [%s]", ctx.getChildCount(), ctx.getText());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#PropertyGetter.


  visitPropertyGetter(ctx) {
    console.trace('not implemented');
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#PropertySetter.


  visitPropertySetter(ctx) {
    console.trace('not implemented');
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#propertyName.


  visitPropertyName(ctx) {
    console.info("visitPropertyName [%s] : [%s]", ctx.getChildCount(), ctx.getText());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#propertySetParameterList.


  visitPropertySetParameterList(ctx) {
    console.trace('not implemented');
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#arguments.


  visitArguments(ctx) {
    console.info("visitArguments: " + ctx.getText());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#argumentList.


  visitArgumentList(ctx) {
    console.info("visitArgumentList: " + ctx.getText());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#expressionSequence.


  visitExpressionSequence(ctx) {
    console.info("visitExpressionSequence: " + ctx.getText());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#TernaryExpression.


  visitTernaryExpression(ctx) {
    console.trace('not implemented');
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#LogicalAndExpression.


  visitLogicalAndExpression(ctx) {
    console.trace('not implemented');
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#PreIncrementExpression.


  visitPreIncrementExpression(ctx) {
    console.info("visitPreIncrementExpression [%s] : [%s]", ctx.getChildCount(), ctx.getText());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#ObjectLiteralExpression.


  visitObjectLiteralExpression(ctx) {
    console.info("visitObjectLiteralExpression [%s] : [%s]", ctx.getChildCount(), ctx.getText());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#InExpression.


  visitInExpression(ctx) {
    console.info("visitInExpression [%s] : [%s]", ctx.getChildCount(), ctx.getText());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#LogicalOrExpression.


  visitLogicalOrExpression(ctx) {
    console.trace('not implemented');
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#NotExpression.


  visitNotExpression(ctx) {
    console.trace('not implemented');
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#PreDecreaseExpression.


  visitPreDecreaseExpression(ctx) {
    console.trace('not implemented');
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#ArgumentsExpression.


  visitArgumentsExpression(ctx) {
    console.info("visitArgumentsExpression: " + ctx.getText());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#ThisExpression.


  visitThisExpression(ctx) {
    console.trace('not implemented');
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#FunctionExpression.


  visitFunctionExpression(ctx) {
    console.info("visitFunctionExpression [%s] : [%s]", ctx.getChildCount(), ctx.getText());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#UnaryMinusExpression.


  visitUnaryMinusExpression(ctx) {
    console.trace('not implemented');
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#PostDecreaseExpression.


  visitPostDecreaseExpression(ctx) {
    console.trace('not implemented');
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#AssignmentExpression.


  visitAssignmentExpression(ctx) {
    console.info("visitAssignmentExpression [%s]: [%s]", ctx.getChildCount(), ctx.getText());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#TypeofExpression.


  visitTypeofExpression(ctx) {
    console.trace('not implemented');
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#InstanceofExpression.


  visitInstanceofExpression(ctx) {
    console.trace('not implemented');
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#UnaryPlusExpression.


  visitUnaryPlusExpression(ctx) {
    console.info("visitUnaryPlusExpression [%s]: [%s]", ctx.getChildCount(), ctx.getText());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#DeleteExpression.


  visitDeleteExpression(ctx) {
    console.trace('not implemented');
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#EqualityExpression.


  visitEqualityExpression(ctx) {
    console.info("visitEqualityExpression [%s] : [%s]", ctx.getChildCount(), ctx.getText());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#BitXOrExpression.


  visitBitXOrExpression(ctx) {
    console.trace('not implemented');
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#MultiplicativeExpression.


  visitMultiplicativeExpression(ctx) {
    console.info("visitMultiplicativeExpression [%s] : [%s]", ctx.getChildCount(), ctx.getText());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#BitShiftExpression.


  visitBitShiftExpression(ctx) {
    console.trace('not implemented');
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#ParenthesizedExpression.


  visitParenthesizedExpression(ctx) {
    console.info("visitParenthesizedExpression [%s] : [%s]", ctx.getChildCount(), ctx.getText());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#AdditiveExpression.


  visitAdditiveExpression(ctx) {
    console.info("visitAdditiveExpression [%s] : [%s]", ctx.getChildCount(), ctx.getText());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#RelationalExpression.


  visitRelationalExpression(ctx) {
    console.info("visitRelationalExpression [%s] : [%s]", ctx.getChildCount(), ctx.getText());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#PostIncrementExpression.


  visitPostIncrementExpression(ctx) {
    console.info("visitPostIncrementExpression [%s] : [%s]", ctx.getChildCount(), ctx.getText());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#BitNotExpression.


  visitBitNotExpression(ctx) {
    console.trace('not implemented');
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#NewExpression.


  visitNewExpression(ctx) {
    console.info("visitNewExpression [%s] : [%s]", ctx.getChildCount(), ctx.getText());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#LiteralExpression.


  visitLiteralExpression(ctx) {
    console.info("visitLiteralExpression [%s] : [%s]", ctx.getChildCount(), ctx.getText());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#ArrayLiteralExpression.


  visitArrayLiteralExpression(ctx) {
    console.info("visitArrayLiteralExpression [%s] : [%s]", ctx.getChildCount(), ctx.getText());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#MemberDotExpression.


  visitMemberDotExpression(ctx) {
    console.info("visitMemberDotExpression [%s] : [%s]", ctx.getChildCount(), ctx.getText());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#MemberIndexExpression.


  visitMemberIndexExpression(ctx) {
    console.info("visitMemberIndexExpression [%s] : [%s]", ctx.getChildCount(), ctx.getText());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#IdentifierExpression.


  visitIdentifierExpression(ctx) {
    console.info("visitIdentifierExpression [%s] : [%s]", ctx.getChildCount(), ctx.getText());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#BitAndExpression.


  visitBitAndExpression(ctx) {
    console.info("visitBitAndExpression [%s] : [%s]", ctx.getChildCount(), ctx.getText());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#BitOrExpression.


  visitBitOrExpression(ctx) {
    console.info("visitBitOrExpression [%s] : [%s]", ctx.getChildCount(), ctx.getText());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#AssignmentOperatorExpression.


  visitAssignmentOperatorExpression(ctx) {
    console.info("visitAssignmentOperatorExpression [%s] : [%s]", ctx.getChildCount(), ctx.getText());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#VoidExpression.


  visitVoidExpression(ctx) {
    console.info("visitVoidExpression [%s] : [%s]", ctx.getChildCount(), ctx.getText());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#assignmentOperator.


  visitAssignmentOperator(ctx) {
    console.info("visitAssignmentOperator [%s] : [%s]", ctx.getChildCount(), ctx.getText());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#literal.


  visitLiteral(ctx) {
    console.info("visitLiteral: " + ctx.getText());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#numericLiteral.


  visitNumericLiteral(ctx) {
    console.info("visitNumericLiteral: " + ctx.getText());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#identifierName.


  visitIdentifierName(ctx) {
    console.info("visitIdentifierName: " + ctx.getText());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#reservedWord.


  visitReservedWord(ctx) {
    console.info("visitReservedWord: " + ctx.getText());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#keyword.


  visitKeyword(ctx) {
    console.info("visitKeyword: " + ctx.getText());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#futureReservedWord.


  visitFutureReservedWord(ctx) {
    console.trace('not implemented');
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#getter.


  visitGetter(ctx) {
    console.trace('not implemented');
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#setter.


  visitSetter(ctx) {
    console.trace('not implemented');
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#eos.


  visitEos(ctx) {
    //console.trace('not implemented')
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#eof.


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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9QcmludFZpc2l0b3IudHMiXSwibmFtZXMiOlsiUHJpbnRWaXNpdG9yIiwiRGVsdmVuVmlzaXRvciIsInZpc2l0UHJvZ3JhbSIsImN0eCIsImNvbnNvbGUiLCJpbmZvIiwiZ2V0VGV4dCIsInZpc2l0Q2hpbGRyZW4iLCJ2aXNpdFNvdXJjZUVsZW1lbnRzIiwidmlzaXRTb3VyY2VFbGVtZW50IiwidmlzaXRTdGF0ZW1lbnQiLCJ2aXNpdEJsb2NrIiwidmlzaXRTdGF0ZW1lbnRMaXN0IiwidmlzaXRWYXJpYWJsZVN0YXRlbWVudCIsInZpc2l0VmFyaWFibGVEZWNsYXJhdGlvbkxpc3QiLCJ2aXNpdFZhcmlhYmxlRGVjbGFyYXRpb24iLCJ2aXNpdEluaXRpYWxpc2VyIiwidmlzaXRFbXB0eVN0YXRlbWVudCIsInZpc2l0RXhwcmVzc2lvblN0YXRlbWVudCIsInZpc2l0SWZTdGF0ZW1lbnQiLCJ2aXNpdERvU3RhdGVtZW50IiwidmlzaXRXaGlsZVN0YXRlbWVudCIsInZpc2l0Rm9yU3RhdGVtZW50IiwidmlzaXRGb3JWYXJTdGF0ZW1lbnQiLCJ0cmFjZSIsInZpc2l0Rm9ySW5TdGF0ZW1lbnQiLCJ2aXNpdEZvclZhckluU3RhdGVtZW50IiwidmlzaXRDb250aW51ZVN0YXRlbWVudCIsInZpc2l0QnJlYWtTdGF0ZW1lbnQiLCJ2aXNpdFJldHVyblN0YXRlbWVudCIsInZpc2l0V2l0aFN0YXRlbWVudCIsInZpc2l0U3dpdGNoU3RhdGVtZW50IiwidmlzaXRDYXNlQmxvY2siLCJ2aXNpdENhc2VDbGF1c2VzIiwidmlzaXRDYXNlQ2xhdXNlIiwidmlzaXREZWZhdWx0Q2xhdXNlIiwidmlzaXRMYWJlbGxlZFN0YXRlbWVudCIsInZpc2l0VGhyb3dTdGF0ZW1lbnQiLCJ2aXNpdFRyeVN0YXRlbWVudCIsInZpc2l0Q2F0Y2hQcm9kdWN0aW9uIiwidmlzaXRGaW5hbGx5UHJvZHVjdGlvbiIsInZpc2l0RGVidWdnZXJTdGF0ZW1lbnQiLCJ2aXNpdEZ1bmN0aW9uRGVjbGFyYXRpb24iLCJ2aXNpdEZvcm1hbFBhcmFtZXRlckxpc3QiLCJnZXRDaGlsZENvdW50IiwidmlzaXRGdW5jdGlvbkJvZHkiLCJ2aXNpdEFycmF5TGl0ZXJhbCIsInZpc2l0RWxlbWVudExpc3QiLCJ2aXNpdEVsaXNpb24iLCJ2aXNpdE9iamVjdExpdGVyYWwiLCJ2aXNpdFByb3BlcnR5TmFtZUFuZFZhbHVlTGlzdCIsInZpc2l0UHJvcGVydHlFeHByZXNzaW9uQXNzaWdubWVudCIsInZpc2l0UHJvcGVydHlHZXR0ZXIiLCJ2aXNpdFByb3BlcnR5U2V0dGVyIiwidmlzaXRQcm9wZXJ0eU5hbWUiLCJ2aXNpdFByb3BlcnR5U2V0UGFyYW1ldGVyTGlzdCIsInZpc2l0QXJndW1lbnRzIiwidmlzaXRBcmd1bWVudExpc3QiLCJ2aXNpdEV4cHJlc3Npb25TZXF1ZW5jZSIsInZpc2l0VGVybmFyeUV4cHJlc3Npb24iLCJ2aXNpdExvZ2ljYWxBbmRFeHByZXNzaW9uIiwidmlzaXRQcmVJbmNyZW1lbnRFeHByZXNzaW9uIiwidmlzaXRPYmplY3RMaXRlcmFsRXhwcmVzc2lvbiIsInZpc2l0SW5FeHByZXNzaW9uIiwidmlzaXRMb2dpY2FsT3JFeHByZXNzaW9uIiwidmlzaXROb3RFeHByZXNzaW9uIiwidmlzaXRQcmVEZWNyZWFzZUV4cHJlc3Npb24iLCJ2aXNpdEFyZ3VtZW50c0V4cHJlc3Npb24iLCJ2aXNpdFRoaXNFeHByZXNzaW9uIiwidmlzaXRGdW5jdGlvbkV4cHJlc3Npb24iLCJ2aXNpdFVuYXJ5TWludXNFeHByZXNzaW9uIiwidmlzaXRQb3N0RGVjcmVhc2VFeHByZXNzaW9uIiwidmlzaXRBc3NpZ25tZW50RXhwcmVzc2lvbiIsInZpc2l0VHlwZW9mRXhwcmVzc2lvbiIsInZpc2l0SW5zdGFuY2VvZkV4cHJlc3Npb24iLCJ2aXNpdFVuYXJ5UGx1c0V4cHJlc3Npb24iLCJ2aXNpdERlbGV0ZUV4cHJlc3Npb24iLCJ2aXNpdEVxdWFsaXR5RXhwcmVzc2lvbiIsInZpc2l0Qml0WE9yRXhwcmVzc2lvbiIsInZpc2l0TXVsdGlwbGljYXRpdmVFeHByZXNzaW9uIiwidmlzaXRCaXRTaGlmdEV4cHJlc3Npb24iLCJ2aXNpdFBhcmVudGhlc2l6ZWRFeHByZXNzaW9uIiwidmlzaXRBZGRpdGl2ZUV4cHJlc3Npb24iLCJ2aXNpdFJlbGF0aW9uYWxFeHByZXNzaW9uIiwidmlzaXRQb3N0SW5jcmVtZW50RXhwcmVzc2lvbiIsInZpc2l0Qml0Tm90RXhwcmVzc2lvbiIsInZpc2l0TmV3RXhwcmVzc2lvbiIsInZpc2l0TGl0ZXJhbEV4cHJlc3Npb24iLCJ2aXNpdEFycmF5TGl0ZXJhbEV4cHJlc3Npb24iLCJ2aXNpdE1lbWJlckRvdEV4cHJlc3Npb24iLCJ2aXNpdE1lbWJlckluZGV4RXhwcmVzc2lvbiIsInZpc2l0SWRlbnRpZmllckV4cHJlc3Npb24iLCJ2aXNpdEJpdEFuZEV4cHJlc3Npb24iLCJ2aXNpdEJpdE9yRXhwcmVzc2lvbiIsInZpc2l0QXNzaWdubWVudE9wZXJhdG9yRXhwcmVzc2lvbiIsInZpc2l0Vm9pZEV4cHJlc3Npb24iLCJ2aXNpdEFzc2lnbm1lbnRPcGVyYXRvciIsInZpc2l0TGl0ZXJhbCIsInZpc2l0TnVtZXJpY0xpdGVyYWwiLCJ2aXNpdElkZW50aWZpZXJOYW1lIiwidmlzaXRSZXNlcnZlZFdvcmQiLCJ2aXNpdEtleXdvcmQiLCJ2aXNpdEZ1dHVyZVJlc2VydmVkV29yZCIsInZpc2l0R2V0dGVyIiwidmlzaXRTZXR0ZXIiLCJ2aXNpdEVvcyIsInZpc2l0RW9mIiwidmlzaXRDaGlsZHJlblhYIiwiY2hpbGRyZW4iLCJtYXAiLCJjaGlsZCIsImxlbmd0aCIsImFjY2VwdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUdPLE1BQU1BLFlBQU4sU0FBMkJDLG9DQUEzQixDQUF5QztBQUU5QztBQUNBQyxFQUFBQSxZQUFZLENBQUNDLEdBQUQsRUFBbUI7QUFDN0JDLElBQUFBLE9BQU8sQ0FBQ0MsSUFBUixDQUFhLG1CQUFtQkYsR0FBRyxDQUFDRyxPQUFKLEVBQWhDO0FBQ0EsV0FBTyxL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QSxLQUFLLENBQUNGLFFBQU4sSUFBa0JFLEtBQUssQ0FBQ0YsUUFBTixDQUFlRyxNQUFmLElBQXlCLENBQS9DLEVBQWtEO0FBQ2hELGlCQUFPRCxLQUFLLENBQUNFLE1BQU4sQ0FBYSxJQUFiLENBQVA7QUFDRCxTQUZELE1BRU87QUFDTCxpQkFBT0YsS0FBSyxDQUFDeEcsT0FBTixFQUFQO0FBQ0Q7QUFDRixPQU5NLENBQVA7QUFPRDtBQUNGOztBQXRzQjZDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRUNNQVNjcmlwdFZpc2l0b3IgYXMgRGVsdmVuVmlzaXRvciB9IGZyb20gXCIuL3BhcnNlci9FQ01BU2NyaXB0VmlzaXRvclwiXG5pbXBvcnQgeyBSdWxlQ29udGV4dCB9IGZyb20gXCJhbnRscjQvUnVsZUNvbnRleHRcIlxuXG5leHBvcnQgY2xhc3MgUHJpbnRWaXNpdG9yIGV4dGVuZHMgRGVsdmVuVmlzaXRvciB7XG5cbiAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjcHJvZ3JhbS5cbiAgdmlzaXRQcm9ncmFtKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICBjb25zb2xlLmluZm8oXCJ2aXNpdFByb2dyYW06IFwiICsgY3R4LmdldFRleHQoKSk7XG4gICAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICB9XG5cblxuICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNzb3VyY2VFbGVtZW50cy5cbiAgdmlzaXRTb3VyY2VFbGVtZW50cyhjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgY29uc29sZS5pbmZvKFwidmlzaXRTb3VyY2VFbGVtZW50czogXCIgKyBjdHguZ2V0VGV4dCgpKTtcbiAgICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gIH1cblxuXG4gIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI3NvdXJjZUVsZW1lbnQuXG4gIHZpc2l0U291cmNlRWxlbWVudChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgY29uc29sZS5pbmZvKFwidmlzaXRTb3VyY2VFbGVtZW50OiBcIiArIGN0eC5nZXRUZXh0KCkpO1xuICAgIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgfVxuXG5cbiAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjc3RhdGVtZW50LlxuICB2aXNpdFN0YXRlbWVudChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgY29uc29sZS5pbmZvKFwidmlzaXRTdGF0ZW1lbnQ6IFwiICsgY3R4LmdldFRleHQoKSk7XG4gICAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICB9XG5cblxuICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNibG9jay5cbiAgdmlzaXRCbG9jayhjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgY29uc29sZS5pbmZvKFwidmlzaXRCbG9jazogXCIgKyBjdHguZ2V0VGV4dCgpKTtcbiAgICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gIH1cblxuXG4gIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI3N0YXRlbWVudExpc3QuXG4gIHZpc2l0U3RhdGVtZW50TGlzdChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgY29uc29sZS5pbmZvKFwidmlzaXRTdGF0ZW1lbnRMaXN0OiBcIiArIGN0eC5nZXRUZXh0KCkpO1xuICAgIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgfVxuXG5cbiAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjdmFyaWFibGVTdGF0ZW1lbnQuXG4gIHZpc2l0VmFyaWFibGVTdGF0ZW1lbnQoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0VmFyaWFibGVTdGF0ZW1lbnQ6IFwiICsgY3R4LmdldFRleHQoKSk7XG5cbiAgICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gIH1cblxuXG4gIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI3ZhcmlhYmxlRGVjbGFyYXRpb25MaXN0LlxuICB2aXNpdFZhcmlhYmxlRGVjbGFyYXRpb25MaXN0KGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICBjb25zb2xlLmluZm8oXCJ2aXNpdFZhcmlhYmxlRGVjbGFyYXRpb25MaXN0OiBcIiArIGN0eC5nZXRUZXh0KCkpO1xuXG4gICAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICB9XG5cblxuICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciN2YXJpYWJsZURlY2xhcmF0aW9uLlxuICB2aXNpdFZhcmlhYmxlRGVjbGFyYXRpb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0VmFyaWFibGVEZWNsYXJhdGlvbjogXCIgKyBjdHguZ2V0VGV4dCgpKTtcblxuICAgIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgfVxuXG5cbiAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjaW5pdGlhbGlzZXIuXG4gIHZpc2l0SW5pdGlhbGlzZXIoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0SW5pdGlhbGlzZXI6IFwiICsgY3R4LmdldFRleHQoKSk7XG4gICAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICB9XG5cblxuICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNlbXB0eVN0YXRlbWVudC5cbiAgdmlzaXRFbXB0eVN0YXRlbWVudChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgY29uc29sZS5pbmZvKFwidmlzaXRFbXB0eVN0YXRlbWVudDogXCIgKyBjdHguZ2V0VGV4dCgpKTtcbiAgICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gIH1cblxuXG4gIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2V4cHJlc3Npb25TdGF0ZW1lbnQuXG4gIHZpc2l0RXhwcmVzc2lvblN0YXRlbWVudChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgY29uc29sZS5pbmZvKFwidmlzaXRFeHByZXNzaW9uU3RhdGVtZW50OiBcIiArIGN0eC5nZXRUZXh0KCkpO1xuXG4gICAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICB9XG5cblxuICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNpZlN0YXRlbWVudC5cbiAgdmlzaXRJZlN0YXRlbWVudChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgY29uc29sZS5pbmZvKFwidmlzaXRJZlN0YXRlbWVudDogXCIgKyBjdHguZ2V0VGV4dCgpKTtcbiAgICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gIH1cblxuXG4gIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI0RvU3RhdGVtZW50LlxuICB2aXNpdERvU3RhdGVtZW50KGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICBjb25zb2xlLmluZm8oXCJ2aXNpdERvU3RhdGVtZW50OiBcIiArIGN0eC5nZXRUZXh0KCkpO1xuICAgIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgfVxuXG5cbiAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjV2hpbGVTdGF0ZW1lbnQuXG4gIHZpc2l0V2hpbGVTdGF0ZW1lbnQoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0V2hpbGVTdGF0ZW1lbnQ6IFwiICsgY3R4LmdldFRleHQoKSk7XG4gICAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICB9XG5cblxuICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNGb3JTdGF0ZW1lbnQuXG4gIHZpc2l0Rm9yU3RhdGVtZW50KGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICBjb25zb2xlLmluZm8oXCJ2aXNpdFdoaWxlU3RhdGVtZW50OiBcIiArIGN0eC5nZXRUZXh0KCkpO1xuICAgIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgfVxuXG5cbiAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjRm9yVmFyU3RhdGVtZW50LlxuICB2aXNpdEZvclZhclN0YXRlbWVudChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gIH1cblxuXG4gIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI0ZvckluU3RhdGVtZW50LlxuICB2aXNpdEZvckluU3RhdGVtZW50KGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgfVxuXG5cbiAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjRm9yVmFySW5TdGF0ZW1lbnQuXG4gIHZpc2l0Rm9yVmFySW5TdGF0ZW1lbnQoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gICAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICB9XG5cblxuICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNjb250aW51ZVN0YXRlbWVudC5cbiAgdmlzaXRDb250aW51ZVN0YXRlbWVudChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gIH1cblxuXG4gIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2JyZWFrU3RhdGVtZW50LlxuICB2aXNpdEJyZWFrU3RhdGVtZW50KGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgfVxuXG5cbiAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjcmV0dXJuU3RhdGVtZW50LlxuICB2aXNpdFJldHVyblN0YXRlbWVudChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gIH1cblxuXG4gIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI3dpdGhTdGF0ZW1lbnQuXG4gIHZpc2l0V2l0aFN0YXRlbWVudChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gIH1cblxuXG4gIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI3N3aXRjaFN0YXRlbWVudC5cbiAgdmlzaXRTd2l0Y2hTdGF0ZW1lbnQoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gICAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICB9XG5cblxuICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNjYXNlQmxvY2suXG4gIHZpc2l0Q2FzZUJsb2NrKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgfVxuXG5cbiAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjY2FzZUNsYXVzZXMuXG4gIHZpc2l0Q2FzZUNsYXVzZXMoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gICAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICB9XG5cblxuICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNjYXNlQ2xhdXNlLlxuICB2aXNpdENhc2VDbGF1c2UoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gICAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICB9XG5cblxuICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNkZWZhdWx0Q2xhdXNlLlxuICB2aXNpdERlZmF1bHRDbGF1c2UoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gICAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICB9XG5cblxuICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNsYWJlbGxlZFN0YXRlbWVudC5cbiAgdmlzaXRMYWJlbGxlZFN0YXRlbWVudChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gIH1cblxuXG4gIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI3Rocm93U3RhdGVtZW50LlxuICB2aXNpdFRocm93U3RhdGVtZW50KGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgfVxuXG5cbiAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjdHJ5U3RhdGVtZW50LlxuICB2aXNpdFRyeVN0YXRlbWVudChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gIH1cblxuXG4gIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2NhdGNoUHJvZHVjdGlvbi5cbiAgdmlzaXRDYXRjaFByb2R1Y3Rpb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gICAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICB9XG5cblxuICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNmaW5hbGx5UHJvZHVjdGlvbi5cbiAgdmlzaXRGaW5hbGx5UHJvZHVjdGlvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gIH1cblxuXG4gIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2RlYnVnZ2VyU3RhdGVtZW50LlxuICB2aXNpdERlYnVnZ2VyU3RhdGVtZW50KGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgfVxuXG5cbiAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjZnVuY3Rpb25EZWNsYXJhdGlvbi5cbiAgdmlzaXRGdW5jdGlvbkRlY2xhcmF0aW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgfVxuXG5cbiAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjZm9ybWFsUGFyYW1ldGVyTGlzdC5cbiAgdmlzaXRGb3JtYWxQYXJhbWV0ZXJMaXN0KGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICBjb25zb2xlLmluZm8oXCJ2aXNpdEZvcm1hbFBhcmFtZXRlckxpc3QgWyVzXSA6IFslc11cIiwgY3R4LmdldENoaWxkQ291bnQoKSwgY3R4LmdldFRleHQoKSk7XG4gICAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICB9XG5cblxuICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNmdW5jdGlvbkJvZHkuXG4gIHZpc2l0RnVuY3Rpb25Cb2R5KGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICBjb25zb2xlLmluZm8oXCJ2aXNpdEZ1bmN0aW9uQm9keSBbJXNdIDogWyVzXVwiLCBjdHguZ2V0Q2hpbGRDb3VudCgpLCBjdHguZ2V0VGV4dCgpKTtcbiAgICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gIH1cblxuXG4gIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2FycmF5TGl0ZXJhbC5cbiAgdmlzaXRBcnJheUxpdGVyYWwoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0QXJyYXlMaXRlcmFsIFslc10gOiBbJXNdXCIsIGN0eC5nZXRDaGlsZENvdW50KCksIGN0eC5nZXRUZXh0KCkpO1xuICAgIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgfVxuXG5cbiAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjZWxlbWVudExpc3QuXG4gIHZpc2l0RWxlbWVudExpc3QoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0RWxlbWVudExpc3QgWyVzXSA6IFslc11cIiwgY3R4LmdldENoaWxkQ291bnQoKSwgY3R4LmdldFRleHQoKSk7XG4gICAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICB9XG5cbiAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjZWxpc2lvbi5cbiAgdmlzaXRFbGlzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICBjb25zb2xlLmluZm8oXCJ2aXNpdEVsaXNpb24gWyVzXSA6IFslc11cIiwgY3R4LmdldENoaWxkQ291bnQoKSwgY3R4LmdldFRleHQoKSk7XG4gICAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICB9XG5cblxuICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNvYmplY3RMaXRlcmFsLlxuICB2aXNpdE9iamVjdExpdGVyYWwoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0T2JqZWN0TGl0ZXJhbCBbJXNdIDogWyVzXVwiLCBjdHguZ2V0Q2hpbGRDb3VudCgpLCBjdHguZ2V0VGV4dCgpKTtcbiAgICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gIH1cblxuXG4gIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI3Byb3BlcnR5TmFtZUFuZFZhbHVlTGlzdC5cbiAgdmlzaXRQcm9wZXJ0eU5hbWVBbmRWYWx1ZUxpc3QoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0UHJvcGVydHlOYW1lQW5kVmFsdWVMaXN0IFslc10gOiBbJXNdXCIsIGN0eC5nZXRDaGlsZENvdW50KCksIGN0eC5nZXRUZXh0KCkpO1xuICAgIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgfVxuXG5cbiAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjUHJvcGVydHlFeHByZXNzaW9uQXNzaWdubWVudC5cbiAgdmlzaXRQcm9wZXJ0eUV4cHJlc3Npb25Bc3NpZ25tZW50KGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICBjb25zb2xlLmluZm8oXCJ2aXNpdFByb3BlcnR5RXhwcmVzc2lvbkFzc2lnbm1lbnQgWyVzXSA6IFslc11cIiwgY3R4LmdldENoaWxkQ291bnQoKSwgY3R4LmdldFRleHQoKSk7XG4gICAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICB9XG5cblxuICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNQcm9wZXJ0eUdldHRlci5cbiAgdmlzaXRQcm9wZXJ0eUdldHRlcihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gIH1cblxuXG4gIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI1Byb3BlcnR5U2V0dGVyLlxuICB2aXNpdFByb3BlcnR5U2V0dGVyKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgfVxuXG5cbiAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjcHJvcGVydHlOYW1lLlxuICB2aXNpdFByb3BlcnR5TmFtZShjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgY29uc29sZS5pbmZvKFwidmlzaXRQcm9wZXJ0eU5hbWUgWyVzXSA6IFslc11cIiwgY3R4LmdldENoaWxkQ291bnQoKSwgY3R4LmdldFRleHQoKSk7XG4gICAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICB9XG5cblxuICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNwcm9wZXJ0eVNldFBhcmFtZXRlckxpc3QuXG4gIHZpc2l0UHJvcGVydHlTZXRQYXJhbWV0ZXJMaXN0KGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgfVxuXG5cbiAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjYXJndW1lbnRzLlxuICB2aXNpdEFyZ3VtZW50cyhjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgY29uc29sZS5pbmZvKFwidmlzaXRBcmd1bWVudHM6IFwiICsgY3R4LmdldFRleHQoKSk7XG4gICAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICB9XG5cblxuICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNhcmd1bWVudExpc3QuXG4gIHZpc2l0QXJndW1lbnRMaXN0KGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICBjb25zb2xlLmluZm8oXCJ2aXNpdEFyZ3VtZW50TGlzdDogXCIgKyBjdHguZ2V0VGV4dCgpKTtcblxuICAgIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgfVxuXG5cbiAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjZXhwcmVzc2lvblNlcXVlbmNlLlxuICB2aXNpdEV4cHJlc3Npb25TZXF1ZW5jZShjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgY29uc29sZS5pbmZvKFwidmlzaXRFeHByZXNzaW9uU2VxdWVuY2U6IFwiICsgY3R4LmdldFRleHQoKSk7XG4gICAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICB9XG5cblxuICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNUZXJuYXJ5RXhwcmVzc2lvbi5cbiAgdmlzaXRUZXJuYXJ5RXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gIH1cblxuXG4gIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI0xvZ2ljYWxBbmRFeHByZXNzaW9uLlxuICB2aXNpdExvZ2ljYWxBbmRFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgfVxuXG5cbiAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjUHJlSW5jcmVtZW50RXhwcmVzc2lvbi5cbiAgdmlzaXRQcmVJbmNyZW1lbnRFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICBjb25zb2xlLmluZm8oXCJ2aXNpdFByZUluY3JlbWVudEV4cHJlc3Npb24gWyVzXSA6IFslc11cIiwgY3R4LmdldENoaWxkQ291bnQoKSwgY3R4LmdldFRleHQoKSk7XG4gICAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICB9XG5cblxuICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNPYmplY3RMaXRlcmFsRXhwcmVzc2lvbi5cbiAgdmlzaXRPYmplY3RMaXRlcmFsRXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgY29uc29sZS5pbmZvKFwidmlzaXRPYmplY3RMaXRlcmFsRXhwcmVzc2lvbiBbJXNdIDogWyVzXVwiLCBjdHguZ2V0Q2hpbGRDb3VudCgpLCBjdHguZ2V0VGV4dCgpKTtcbiAgICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gIH1cblxuXG4gIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI0luRXhwcmVzc2lvbi5cbiAgdmlzaXRJbkV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0SW5FeHByZXNzaW9uIFslc10gOiBbJXNdXCIsIGN0eC5nZXRDaGlsZENvdW50KCksIGN0eC5nZXRUZXh0KCkpO1xuICAgIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgfVxuXG5cbiAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjTG9naWNhbE9yRXhwcmVzc2lvbi5cbiAgdmlzaXRMb2dpY2FsT3JFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgfVxuXG5cbiAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjTm90RXhwcmVzc2lvbi5cbiAgdmlzaXROb3RFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgfVxuXG5cbiAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjUHJlRGVjcmVhc2VFeHByZXNzaW9uLlxuICB2aXNpdFByZURlY3JlYXNlRXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gIH1cblxuXG4gIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI0FyZ3VtZW50c0V4cHJlc3Npb24uXG4gIHZpc2l0QXJndW1lbnRzRXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgY29uc29sZS5pbmZvKFwidmlzaXRBcmd1bWVudHNFeHByZXNzaW9uOiBcIiArIGN0eC5nZXRUZXh0KCkpO1xuXG4gICAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICB9XG5cblxuICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNUaGlzRXhwcmVzc2lvbi5cbiAgdmlzaXRUaGlzRXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gIH1cblxuXG4gIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI0Z1bmN0aW9uRXhwcmVzc2lvbi5cbiAgdmlzaXRGdW5jdGlvbkV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0RnVuY3Rpb25FeHByZXNzaW9uIFslc10gOiBbJXNdXCIsIGN0eC5nZXRDaGlsZENvdW50KCksIGN0eC5nZXRUZXh0KCkpO1xuICAgIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgfVxuXG5cbiAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjVW5hcnlNaW51c0V4cHJlc3Npb24uXG4gIHZpc2l0VW5hcnlNaW51c0V4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gICAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICB9XG5cblxuICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNQb3N0RGVjcmVhc2VFeHByZXNzaW9uLlxuICB2aXNpdFBvc3REZWNyZWFzZUV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gICAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICB9XG5cblxuICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNBc3NpZ25tZW50RXhwcmVzc2lvbi5cbiAgdmlzaXRBc3NpZ25tZW50RXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgY29uc29sZS5pbmZvKFwidmlzaXRBc3NpZ25tZW50RXhwcmVzc2lvbiBbJXNdOiBbJXNdXCIsIGN0eC5nZXRDaGlsZENvdW50KCksICBjdHguZ2V0VGV4dCgpKTtcbiAgICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gIH1cblxuXG4gIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI1R5cGVvZkV4cHJlc3Npb24uXG4gIHZpc2l0VHlwZW9mRXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gIH1cblxuXG4gIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI0luc3RhbmNlb2ZFeHByZXNzaW9uLlxuICB2aXNpdEluc3RhbmNlb2ZFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgfVxuXG5cbiAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjVW5hcnlQbHVzRXhwcmVzc2lvbi5cbiAgdmlzaXRVbmFyeVBsdXNFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICBjb25zb2xlLmluZm8oXCJ2aXNpdFVuYXJ5UGx1c0V4cHJlc3Npb24gWyVzXTogWyVzXVwiLCBjdHguZ2V0Q2hpbGRDb3VudCgpLCAgY3R4LmdldFRleHQoKSk7XG4gICAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICB9XG5cblxuICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNEZWxldGVFeHByZXNzaW9uLlxuICB2aXNpdERlbGV0ZUV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gICAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICB9XG5cblxuICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNFcXVhbGl0eUV4cHJlc3Npb24uXG4gIHZpc2l0RXF1YWxpdHlFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICBjb25zb2xlLmluZm8oXCJ2aXNpdEVxdWFsaXR5RXhwcmVzc2lvbiBbJXNdIDogWyVzXVwiLCBjdHguZ2V0Q2hpbGRDb3VudCgpLCBjdHguZ2V0VGV4dCgpKTtcbiAgICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gIH1cblxuXG4gIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI0JpdFhPckV4cHJlc3Npb24uXG4gIHZpc2l0Qml0WE9yRXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gIH1cblxuXG4gIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI011bHRpcGxpY2F0aXZlRXhwcmVzc2lvbi5cbiAgdmlzaXRNdWx0aXBsaWNhdGl2ZUV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0TXVsdGlwbGljYXRpdmVFeHByZXNzaW9uIFslc10gOiBbJXNdXCIsIGN0eC5nZXRDaGlsZENvdW50KCksIGN0eC5nZXRUZXh0KCkpO1xuICAgIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgfVxuXG5cbiAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjQml0U2hpZnRFeHByZXNzaW9uLlxuICB2aXNpdEJpdFNoaWZ0RXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gIH1cblxuXG4gIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI1BhcmVudGhlc2l6ZWRFeHByZXNzaW9uLlxuICB2aXNpdFBhcmVudGhlc2l6ZWRFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICBjb25zb2xlLmluZm8oXCJ2aXNpdFBhcmVudGhlc2l6ZWRFeHByZXNzaW9uIFslc10gOiBbJXNdXCIsIGN0eC5nZXRDaGlsZENvdW50KCksIGN0eC5nZXRUZXh0KCkpO1xuICAgIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgfVxuXG5cbiAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjQWRkaXRpdmVFeHByZXNzaW9uLlxuICB2aXNpdEFkZGl0aXZlRXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgY29uc29sZS5pbmZvKFwidmlzaXRBZGRpdGl2ZUV4cHJlc3Npb24gWyVzXSA6IFslc11cIiwgY3R4LmdldENoaWxkQ291bnQoKSwgY3R4LmdldFRleHQoKSk7XG4gICAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICB9XG5cblxuICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNSZWxhdGlvbmFsRXhwcmVzc2lvbi5cbiAgdmlzaXRSZWxhdGlvbmFsRXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgY29uc29sZS5pbmZvKFwidmlzaXRSZWxhdGlvbmFsRXhwcmVzc2lvbiBbJXNdIDogWyVzXVwiLCBjdHguZ2V0Q2hpbGRDb3VudCgpLCBjdHguZ2V0VGV4dCgpKTtcbiAgICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gIH1cblxuXG4gIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI1Bvc3RJbmNyZW1lbnRFeHByZXNzaW9uLlxuICB2aXNpdFBvc3RJbmNyZW1lbnRFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICBjb25zb2xlLmluZm8oXCJ2aXNpdFBvc3RJbmNyZW1lbnRFeHByZXNzaW9uIFslc10gOiBbJXNdXCIsIGN0eC5nZXRDaGlsZENvdW50KCksIGN0eC5nZXRUZXh0KCkpO1xuICAgIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgfVxuXG5cbiAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjQml0Tm90RXhwcmVzc2lvbi5cbiAgdmlzaXRCaXROb3RFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgfVxuXG5cbiAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjTmV3RXhwcmVzc2lvbi5cbiAgdmlzaXROZXdFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICBjb25zb2xlLmluZm8oXCJ2aXNpdE5ld0V4cHJlc3Npb24gWyVzXSA6IFslc11cIiwgY3R4LmdldENoaWxkQ291bnQoKSwgY3R4LmdldFRleHQoKSk7XG4gICAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICB9XG5cblxuICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNMaXRlcmFsRXhwcmVzc2lvbi5cbiAgdmlzaXRMaXRlcmFsRXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgY29uc29sZS5pbmZvKFwidmlzaXRMaXRlcmFsRXhwcmVzc2lvbiBbJXNdIDogWyVzXVwiLCBjdHguZ2V0Q2hpbGRDb3VudCgpLCBjdHguZ2V0VGV4dCgpKTtcbiAgICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gIH1cblxuXG4gIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI0FycmF5TGl0ZXJhbEV4cHJlc3Npb24uXG4gIHZpc2l0QXJyYXlMaXRlcmFsRXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgY29uc29sZS5pbmZvKFwidmlzaXRBcnJheUxpdGVyYWxFeHByZXNzaW9uIFslc10gOiBbJXNdXCIsIGN0eC5nZXRDaGlsZENvdW50KCksIGN0eC5nZXRUZXh0KCkpO1xuICAgIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgfVxuXG5cbiAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjTWVtYmVyRG90RXhwcmVzc2lvbi5cbiAgdmlzaXRNZW1iZXJEb3RFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICBjb25zb2xlLmluZm8oXCJ2aXNpdE1lbWJlckRvdEV4cHJlc3Npb24gWyVzXSA6IFslc11cIiwgY3R4LmdldENoaWxkQ291bnQoKSwgY3R4LmdldFRleHQoKSk7XG4gICAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICB9XG5cblxuICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNNZW1iZXJJbmRleEV4cHJlc3Npb24uXG4gIHZpc2l0TWVtYmVySW5kZXhFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICBjb25zb2xlLmluZm8oXCJ2aXNpdE1lbWJlckluZGV4RXhwcmVzc2lvbiBbJXNdIDogWyVzXVwiLCBjdHguZ2V0Q2hpbGRDb3VudCgpLCBjdHguZ2V0VGV4dCgpKTtcbiAgICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gIH1cblxuXG4gIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI0lkZW50aWZpZXJFeHByZXNzaW9uLlxuICB2aXNpdElkZW50aWZpZXJFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICBjb25zb2xlLmluZm8oXCJ2aXNpdElkZW50aWZpZXJFeHByZXNzaW9uIFslc10gOiBbJXNdXCIsIGN0eC5nZXRDaGlsZENvdW50KCksIGN0eC5nZXRUZXh0KCkpO1xuXG4gICAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICB9XG5cblxuICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNCaXRBbmRFeHByZXNzaW9uLlxuICB2aXNpdEJpdEFuZEV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0Qml0QW5kRXhwcmVzc2lvbiBbJXNdIDogWyVzXVwiLCBjdHguZ2V0Q2hpbGRDb3VudCgpLCBjdHguZ2V0VGV4dCgpKTtcbiAgICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gIH1cblxuXG4gIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI0JpdE9yRXhwcmVzc2lvbi5cbiAgdmlzaXRCaXRPckV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0Qml0T3JFeHByZXNzaW9uIFslc10gOiBbJXNdXCIsIGN0eC5nZXRDaGlsZENvdW50KCksIGN0eC5nZXRUZXh0KCkpO1xuICAgIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgfVxuXG5cbiAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjQXNzaWdubWVudE9wZXJhdG9yRXhwcmVzc2lvbi5cbiAgdmlzaXRBc3NpZ25tZW50T3BlcmF0b3JFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICBjb25zb2xlLmluZm8oXCJ2aXNpdEFzc2lnbm1lbnRPcGVyYXRvckV4cHJlc3Npb24gWyVzXSA6IFslc11cIiwgY3R4LmdldENoaWxkQ291bnQoKSwgY3R4LmdldFRleHQoKSk7XG4gICAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICB9XG5cblxuICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNWb2lkRXhwcmVzc2lvbi5cbiAgdmlzaXRWb2lkRXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgY29uc29sZS5pbmZvKFwidmlzaXRWb2lkRXhwcmVzc2lvbiBbJXNdIDogWyVzXVwiLCBjdHguZ2V0Q2hpbGRDb3VudCgpLCBjdHguZ2V0VGV4dCgpKTtcbiAgICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gIH1cblxuICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNhc3NpZ25tZW50T3BlcmF0b3IuXG4gIHZpc2l0QXNzaWdubWVudE9wZXJhdG9yKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICBjb25zb2xlLmluZm8oXCJ2aXNpdEFzc2lnbm1lbnRPcGVyYXRvciBbJXNdIDogWyVzXVwiLCBjdHguZ2V0Q2hpbGRDb3VudCgpLCBjdHguZ2V0VGV4dCgpKTtcbiAgICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gIH1cblxuXG4gIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2xpdGVyYWwuXG4gIHZpc2l0TGl0ZXJhbChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgY29uc29sZS5pbmZvKFwidmlzaXRMaXRlcmFsOiBcIiArIGN0eC5nZXRUZXh0KCkpO1xuICAgIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgfVxuXG5cbiAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjbnVtZXJpY0xpdGVyYWwuXG4gIHZpc2l0TnVtZXJpY0xpdGVyYWwoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0TnVtZXJpY0xpdGVyYWw6IFwiICsgY3R4LmdldFRleHQoKSk7XG4gICAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICB9XG5cblxuICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNpZGVudGlmaWVyTmFtZS5cbiAgdmlzaXRJZGVudGlmaWVyTmFtZShjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgY29uc29sZS5pbmZvKFwidmlzaXRJZGVudGlmaWVyTmFtZTogXCIgKyBjdHguZ2V0VGV4dCgpKTtcbiAgICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gIH1cblxuXG4gIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI3Jlc2VydmVkV29yZC5cbiAgdmlzaXRSZXNlcnZlZFdvcmQoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0UmVzZXJ2ZWRXb3JkOiBcIiArIGN0eC5nZXRUZXh0KCkpO1xuXG4gICAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICB9XG5cblxuICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNrZXl3b3JkLlxuICB2aXNpdEtleXdvcmQoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0S2V5d29yZDogXCIgKyBjdHguZ2V0VGV4dCgpKTtcblxuICAgIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgfVxuXG5cbiAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjZnV0dXJlUmVzZXJ2ZWRXb3JkLlxuICB2aXNpdEZ1dHVyZVJlc2VydmVkV29yZChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gIH1cblxuXG4gIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2dldHRlci5cbiAgdmlzaXRHZXR0ZXIoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gICAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICB9XG5cblxuICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNzZXR0ZXIuXG4gIHZpc2l0U2V0dGVyKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgfVxuXG5cbiAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjZW9zLlxuICB2aXNpdEVvcyhjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgLy9jb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgfVxuXG4gIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2VvZi5cbiAgdmlzaXRFb2YoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gICAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICB9XG5cblxuXG4gIHZpc2l0Q2hpbGRyZW5YWChjdHgpIHtcbiAgICBjb25zb2xlLmluZm8oXCJDb250ZXh0IDpcIiArIGN0eC5nZXRUZXh0KCkpXG4gICAgaWYgKCFjdHgpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoY3R4LmNoaWxkcmVuKSB7XG4gICAgICByZXR1cm4gY3R4LmNoaWxkcmVuLm1hcChjaGlsZCA9PiB7XG4gICAgICAgIGlmIChjaGlsZC5jaGlsZHJlbiAmJiBjaGlsZC5jaGlsZHJlbi5sZW5ndGggIT0gMCkge1xuICAgICAgICAgIHJldHVybiBjaGlsZC5hY2NlcHQodGhpcyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIGNoaWxkLmdldFRleHQoKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG59Il19