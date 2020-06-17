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
    console.trace('not implemented');
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
    console.trace('not implemented');
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
    console.trace('not implemented');
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#ObjectLiteralExpression.


  visitObjectLiteralExpression(ctx) {
    console.trace('not implemented');
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#InExpression.


  visitInExpression(ctx) {
    console.trace('not implemented');
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
    console.trace('not implemented');
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
    console.trace('not implemented');
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#IdentifierExpression.


  visitIdentifierExpression(ctx) {
    console.info("visitIdentifierExpression: " + ctx.getText());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#BitAndExpression.


  visitBitAndExpression(ctx) {
    console.trace('not implemented');
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#BitOrExpression.


  visitBitOrExpression(ctx) {
    console.trace('not implemented');
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#AssignmentOperatorExpression.


  visitAssignmentOperatorExpression(ctx) {
    console.trace('not implemented');
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#VoidExpression.


  visitVoidExpression(ctx) {
    console.trace('not implemented');
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#assignmentOperator.


  visitAssignmentOperator(ctx) {
    console.info("visitAssignmentOperator: " + ctx.getText());
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9QcmludFZpc2l0b3IudHMiXSwibmFtZXMiOlsiUHJpbnRWaXNpdG9yIiwiRGVsdmVuVmlzaXRvciIsInZpc2l0UHJvZ3JhbSIsImN0eCIsImNvbnNvbGUiLCJpbmZvIiwiZ2V0VGV4dCIsInZpc2l0Q2hpbGRyZW4iLCJ2aXNpdFNvdXJjZUVsZW1lbnRzIiwidmlzaXRTb3VyY2VFbGVtZW50IiwidmlzaXRTdGF0ZW1lbnQiLCJ2aXNpdEJsb2NrIiwidmlzaXRTdGF0ZW1lbnRMaXN0IiwidmlzaXRWYXJpYWJsZVN0YXRlbWVudCIsInZpc2l0VmFyaWFibGVEZWNsYXJhdGlvbkxpc3QiLCJ2aXNpdFZhcmlhYmxlRGVjbGFyYXRpb24iLCJ2aXNpdEluaXRpYWxpc2VyIiwidmlzaXRFbXB0eVN0YXRlbWVudCIsInZpc2l0RXhwcmVzc2lvblN0YXRlbWVudCIsInZpc2l0SWZTdGF0ZW1lbnQiLCJ2aXNpdERvU3RhdGVtZW50IiwidmlzaXRXaGlsZVN0YXRlbWVudCIsInZpc2l0Rm9yU3RhdGVtZW50IiwidmlzaXRGb3JWYXJTdGF0ZW1lbnQiLCJ0cmFjZSIsInZpc2l0Rm9ySW5TdGF0ZW1lbnQiLCJ2aXNpdEZvclZhckluU3RhdGVtZW50IiwidmlzaXRDb250aW51ZVN0YXRlbWVudCIsInZpc2l0QnJlYWtTdGF0ZW1lbnQiLCJ2aXNpdFJldHVyblN0YXRlbWVudCIsInZpc2l0V2l0aFN0YXRlbWVudCIsInZpc2l0U3dpdGNoU3RhdGVtZW50IiwidmlzaXRDYXNlQmxvY2siLCJ2aXNpdENhc2VDbGF1c2VzIiwidmlzaXRDYXNlQ2xhdXNlIiwidmlzaXREZWZhdWx0Q2xhdXNlIiwidmlzaXRMYWJlbGxlZFN0YXRlbWVudCIsInZpc2l0VGhyb3dTdGF0ZW1lbnQiLCJ2aXNpdFRyeVN0YXRlbWVudCIsInZpc2l0Q2F0Y2hQcm9kdWN0aW9uIiwidmlzaXRGaW5hbGx5UHJvZHVjdGlvbiIsInZpc2l0RGVidWdnZXJTdGF0ZW1lbnQiLCJ2aXNpdEZ1bmN0aW9uRGVjbGFyYXRpb24iLCJ2aXNpdEZvcm1hbFBhcmFtZXRlckxpc3QiLCJnZXRDaGlsZENvdW50IiwidmlzaXRGdW5jdGlvbkJvZHkiLCJ2aXNpdEFycmF5TGl0ZXJhbCIsInZpc2l0RWxlbWVudExpc3QiLCJ2aXNpdEVsaXNpb24iLCJ2aXNpdE9iamVjdExpdGVyYWwiLCJ2aXNpdFByb3BlcnR5TmFtZUFuZFZhbHVlTGlzdCIsInZpc2l0UHJvcGVydHlFeHByZXNzaW9uQXNzaWdubWVudCIsInZpc2l0UHJvcGVydHlHZXR0ZXIiLCJ2aXNpdFByb3BlcnR5U2V0dGVyIiwidmlzaXRQcm9wZXJ0eU5hbWUiLCJ2aXNpdFByb3BlcnR5U2V0UGFyYW1ldGVyTGlzdCIsInZpc2l0QXJndW1lbnRzIiwidmlzaXRBcmd1bWVudExpc3QiLCJ2aXNpdEV4cHJlc3Npb25TZXF1ZW5jZSIsInZpc2l0VGVybmFyeUV4cHJlc3Npb24iLCJ2aXNpdExvZ2ljYWxBbmRFeHByZXNzaW9uIiwidmlzaXRQcmVJbmNyZW1lbnRFeHByZXNzaW9uIiwidmlzaXRPYmplY3RMaXRlcmFsRXhwcmVzc2lvbiIsInZpc2l0SW5FeHByZXNzaW9uIiwidmlzaXRMb2dpY2FsT3JFeHByZXNzaW9uIiwidmlzaXROb3RFeHByZXNzaW9uIiwidmlzaXRQcmVEZWNyZWFzZUV4cHJlc3Npb24iLCJ2aXNpdEFyZ3VtZW50c0V4cHJlc3Npb24iLCJ2aXNpdFRoaXNFeHByZXNzaW9uIiwidmlzaXRGdW5jdGlvbkV4cHJlc3Npb24iLCJ2aXNpdFVuYXJ5TWludXNFeHByZXNzaW9uIiwidmlzaXRQb3N0RGVjcmVhc2VFeHByZXNzaW9uIiwidmlzaXRBc3NpZ25tZW50RXhwcmVzc2lvbiIsInZpc2l0VHlwZW9mRXhwcmVzc2lvbiIsInZpc2l0SW5zdGFuY2VvZkV4cHJlc3Npb24iLCJ2aXNpdFVuYXJ5UGx1c0V4cHJlc3Npb24iLCJ2aXNpdERlbGV0ZUV4cHJlc3Npb24iLCJ2aXNpdEVxdWFsaXR5RXhwcmVzc2lvbiIsInZpc2l0Qml0WE9yRXhwcmVzc2lvbiIsInZpc2l0TXVsdGlwbGljYXRpdmVFeHByZXNzaW9uIiwidmlzaXRCaXRTaGlmdEV4cHJlc3Npb24iLCJ2aXNpdFBhcmVudGhlc2l6ZWRFeHByZXNzaW9uIiwidmlzaXRBZGRpdGl2ZUV4cHJlc3Npb24iLCJ2aXNpdFJlbGF0aW9uYWxFeHByZXNzaW9uIiwidmlzaXRQb3N0SW5jcmVtZW50RXhwcmVzc2lvbiIsInZpc2l0Qml0Tm90RXhwcmVzc2lvbiIsInZpc2l0TmV3RXhwcmVzc2lvbiIsInZpc2l0TGl0ZXJhbEV4cHJlc3Npb24iLCJ2aXNpdEFycmF5TGl0ZXJhbEV4cHJlc3Npb24iLCJ2aXNpdE1lbWJlckRvdEV4cHJlc3Npb24iLCJ2aXNpdE1lbWJlckluZGV4RXhwcmVzc2lvbiIsInZpc2l0SWRlbnRpZmllckV4cHJlc3Npb24iLCJ2aXNpdEJpdEFuZEV4cHJlc3Npb24iLCJ2aXNpdEJpdE9yRXhwcmVzc2lvbiIsInZpc2l0QXNzaWdubWVudE9wZXJhdG9yRXhwcmVzc2lvbiIsInZpc2l0Vm9pZEV4cHJlc3Npb24iLCJ2aXNpdEFzc2lnbm1lbnRPcGVyYXRvciIsInZpc2l0TGl0ZXJhbCIsInZpc2l0TnVtZXJpY0xpdGVyYWwiLCJ2aXNpdElkZW50aWZpZXJOYW1lIiwidmlzaXRSZXNlcnZlZFdvcmQiLCJ2aXNpdEtleXdvcmQiLCJ2aXNpdEZ1dHVyZVJlc2VydmVkV29yZCIsInZpc2l0R2V0dGVyIiwidmlzaXRTZXR0ZXIiLCJ2aXNpdEVvcyIsInZpc2l0RW9mIiwidmlzaXRDaGlsZHJlblhYIiwiY2hpbGRyZW4iLCJtYXAiLCJjaGlsZCIsImxlbmd0aCIsImFjY2VwdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUdPLE1BQU1BLFlBQU4sU0FBMkJDLG9DQUEzQixDQUF5QztBQUU5QztBQUNBQyxFQUFBQSxZQUFZLENBQUNDLEdBQUQsRUFBbUI7QUFDN0JDLElBQUFBLE9BQU8sQ0FBQ0MsSUFBUixDQUFhLG1CQUFtQkYsR0FBRyxDQUFDRyxPQUFKLEVBQWhDO0FBQ0EsV0FBTyxL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LE9BQU8sQ0FBQ0MsSUFBUixDQUFhLGNBQWNGLEdBQUcsQ0FBQ0csT0FBSixFQUEzQjs7QUFDQSxRQUFJLENBQUNILEdBQUwsRUFBVTtBQUNSO0FBQ0Q7O0FBRUQsUUFBSUEsR0FBRyxDQUFDeUcsUUFBUixFQUFrQjtBQUNoQixhQUFPekcsR0FBRyxDQUFDeUcsUUFBSixDQUFhQyxHQUFiLENBQWlCQyxLQUFLLElBQUk7QUFDL0IsWUFBSUEsS0FBSyxDQUFDRixRQUFOLElBQWtCRSxLQUFLLENBQUNGLFFBQU4sQ0FBZUcsTUFBZixJQUF5QixDQUEvQyxFQUFrRDtBQUNoRCxpQkFBT0QsS0FBSyxDQUFDRSxNQUFOLENBQWEsSUFBYixDQUFQO0FBQ0QsU0FGRCxNQUVPO0FBQ0wsaUJBQU9GLEtBQUssQ0FBQ3hHLE9BQU4sRUFBUDtBQUNEO0FBQ0YsT0FOTSxDQUFQO0FBT0Q7QUFDRjs7QUF0c0I2QyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEVDTUFTY3JpcHRWaXNpdG9yIGFzIERlbHZlblZpc2l0b3IgfSBmcm9tIFwiLi9wYXJzZXIvRUNNQVNjcmlwdFZpc2l0b3JcIlxuaW1wb3J0IHsgUnVsZUNvbnRleHQgfSBmcm9tIFwiYW50bHI0L1J1bGVDb250ZXh0XCJcblxuZXhwb3J0IGNsYXNzIFByaW50VmlzaXRvciBleHRlbmRzIERlbHZlblZpc2l0b3Ige1xuXG4gIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI3Byb2dyYW0uXG4gIHZpc2l0UHJvZ3JhbShjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgY29uc29sZS5pbmZvKFwidmlzaXRQcm9ncmFtOiBcIiArIGN0eC5nZXRUZXh0KCkpO1xuICAgIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgfVxuXG5cbiAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjc291cmNlRWxlbWVudHMuXG4gIHZpc2l0U291cmNlRWxlbWVudHMoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0U291cmNlRWxlbWVudHM6IFwiICsgY3R4LmdldFRleHQoKSk7XG4gICAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICB9XG5cblxuICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNzb3VyY2VFbGVtZW50LlxuICB2aXNpdFNvdXJjZUVsZW1lbnQoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0U291cmNlRWxlbWVudDogXCIgKyBjdHguZ2V0VGV4dCgpKTtcbiAgICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gIH1cblxuXG4gIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI3N0YXRlbWVudC5cbiAgdmlzaXRTdGF0ZW1lbnQoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0U3RhdGVtZW50OiBcIiArIGN0eC5nZXRUZXh0KCkpO1xuICAgIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgfVxuXG5cbiAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjYmxvY2suXG4gIHZpc2l0QmxvY2soY3R4OiBSdWxlQ29udGV4dCkge1xuICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0QmxvY2s6IFwiICsgY3R4LmdldFRleHQoKSk7XG4gICAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICB9XG5cblxuICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNzdGF0ZW1lbnRMaXN0LlxuICB2aXNpdFN0YXRlbWVudExpc3QoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0U3RhdGVtZW50TGlzdDogXCIgKyBjdHguZ2V0VGV4dCgpKTtcbiAgICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gIH1cblxuXG4gIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI3ZhcmlhYmxlU3RhdGVtZW50LlxuICB2aXNpdFZhcmlhYmxlU3RhdGVtZW50KGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICBjb25zb2xlLmluZm8oXCJ2aXNpdFZhcmlhYmxlU3RhdGVtZW50OiBcIiArIGN0eC5nZXRUZXh0KCkpO1xuXG4gICAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICB9XG5cblxuICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciN2YXJpYWJsZURlY2xhcmF0aW9uTGlzdC5cbiAgdmlzaXRWYXJpYWJsZURlY2xhcmF0aW9uTGlzdChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgY29uc29sZS5pbmZvKFwidmlzaXRWYXJpYWJsZURlY2xhcmF0aW9uTGlzdDogXCIgKyBjdHguZ2V0VGV4dCgpKTtcblxuICAgIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgfVxuXG5cbiAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjdmFyaWFibGVEZWNsYXJhdGlvbi5cbiAgdmlzaXRWYXJpYWJsZURlY2xhcmF0aW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICBjb25zb2xlLmluZm8oXCJ2aXNpdFZhcmlhYmxlRGVjbGFyYXRpb246IFwiICsgY3R4LmdldFRleHQoKSk7XG5cbiAgICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gIH1cblxuXG4gIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2luaXRpYWxpc2VyLlxuICB2aXNpdEluaXRpYWxpc2VyKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICBjb25zb2xlLmluZm8oXCJ2aXNpdEluaXRpYWxpc2VyOiBcIiArIGN0eC5nZXRUZXh0KCkpO1xuICAgIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgfVxuXG5cbiAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjZW1wdHlTdGF0ZW1lbnQuXG4gIHZpc2l0RW1wdHlTdGF0ZW1lbnQoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0RW1wdHlTdGF0ZW1lbnQ6IFwiICsgY3R4LmdldFRleHQoKSk7XG4gICAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICB9XG5cblxuICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNleHByZXNzaW9uU3RhdGVtZW50LlxuICB2aXNpdEV4cHJlc3Npb25TdGF0ZW1lbnQoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0RXhwcmVzc2lvblN0YXRlbWVudDogXCIgKyBjdHguZ2V0VGV4dCgpKTtcblxuICAgIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgfVxuXG5cbiAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjaWZTdGF0ZW1lbnQuXG4gIHZpc2l0SWZTdGF0ZW1lbnQoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0SWZTdGF0ZW1lbnQ6IFwiICsgY3R4LmdldFRleHQoKSk7XG4gICAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICB9XG5cblxuICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNEb1N0YXRlbWVudC5cbiAgdmlzaXREb1N0YXRlbWVudChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgY29uc29sZS5pbmZvKFwidmlzaXREb1N0YXRlbWVudDogXCIgKyBjdHguZ2V0VGV4dCgpKTtcbiAgICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gIH1cblxuXG4gIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI1doaWxlU3RhdGVtZW50LlxuICB2aXNpdFdoaWxlU3RhdGVtZW50KGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICBjb25zb2xlLmluZm8oXCJ2aXNpdFdoaWxlU3RhdGVtZW50OiBcIiArIGN0eC5nZXRUZXh0KCkpO1xuICAgIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgfVxuXG5cbiAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjRm9yU3RhdGVtZW50LlxuICB2aXNpdEZvclN0YXRlbWVudChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgY29uc29sZS5pbmZvKFwidmlzaXRXaGlsZVN0YXRlbWVudDogXCIgKyBjdHguZ2V0VGV4dCgpKTtcbiAgICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gIH1cblxuXG4gIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI0ZvclZhclN0YXRlbWVudC5cbiAgdmlzaXRGb3JWYXJTdGF0ZW1lbnQoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gICAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICB9XG5cblxuICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNGb3JJblN0YXRlbWVudC5cbiAgdmlzaXRGb3JJblN0YXRlbWVudChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gIH1cblxuXG4gIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI0ZvclZhckluU3RhdGVtZW50LlxuICB2aXNpdEZvclZhckluU3RhdGVtZW50KGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgfVxuXG5cbiAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjY29udGludWVTdGF0ZW1lbnQuXG4gIHZpc2l0Q29udGludWVTdGF0ZW1lbnQoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gICAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICB9XG5cblxuICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNicmVha1N0YXRlbWVudC5cbiAgdmlzaXRCcmVha1N0YXRlbWVudChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gIH1cblxuXG4gIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI3JldHVyblN0YXRlbWVudC5cbiAgdmlzaXRSZXR1cm5TdGF0ZW1lbnQoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gICAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICB9XG5cblxuICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciN3aXRoU3RhdGVtZW50LlxuICB2aXNpdFdpdGhTdGF0ZW1lbnQoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gICAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICB9XG5cblxuICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNzd2l0Y2hTdGF0ZW1lbnQuXG4gIHZpc2l0U3dpdGNoU3RhdGVtZW50KGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgfVxuXG5cbiAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjY2FzZUJsb2NrLlxuICB2aXNpdENhc2VCbG9jayhjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gIH1cblxuXG4gIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2Nhc2VDbGF1c2VzLlxuICB2aXNpdENhc2VDbGF1c2VzKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgfVxuXG5cbiAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjY2FzZUNsYXVzZS5cbiAgdmlzaXRDYXNlQ2xhdXNlKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgfVxuXG5cbiAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjZGVmYXVsdENsYXVzZS5cbiAgdmlzaXREZWZhdWx0Q2xhdXNlKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgfVxuXG5cbiAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjbGFiZWxsZWRTdGF0ZW1lbnQuXG4gIHZpc2l0TGFiZWxsZWRTdGF0ZW1lbnQoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gICAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICB9XG5cblxuICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciN0aHJvd1N0YXRlbWVudC5cbiAgdmlzaXRUaHJvd1N0YXRlbWVudChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gIH1cblxuXG4gIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI3RyeVN0YXRlbWVudC5cbiAgdmlzaXRUcnlTdGF0ZW1lbnQoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gICAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICB9XG5cblxuICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNjYXRjaFByb2R1Y3Rpb24uXG4gIHZpc2l0Q2F0Y2hQcm9kdWN0aW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgfVxuXG5cbiAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjZmluYWxseVByb2R1Y3Rpb24uXG4gIHZpc2l0RmluYWxseVByb2R1Y3Rpb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gICAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICB9XG5cblxuICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNkZWJ1Z2dlclN0YXRlbWVudC5cbiAgdmlzaXREZWJ1Z2dlclN0YXRlbWVudChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gIH1cblxuXG4gIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2Z1bmN0aW9uRGVjbGFyYXRpb24uXG4gIHZpc2l0RnVuY3Rpb25EZWNsYXJhdGlvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gIH1cblxuXG4gIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2Zvcm1hbFBhcmFtZXRlckxpc3QuXG4gIHZpc2l0Rm9ybWFsUGFyYW1ldGVyTGlzdChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgY29uc29sZS5pbmZvKFwidmlzaXRGb3JtYWxQYXJhbWV0ZXJMaXN0IFslc10gOiBbJXNdXCIsIGN0eC5nZXRDaGlsZENvdW50KCksIGN0eC5nZXRUZXh0KCkpO1xuICAgIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgfVxuXG5cbiAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjZnVuY3Rpb25Cb2R5LlxuICB2aXNpdEZ1bmN0aW9uQm9keShjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgY29uc29sZS5pbmZvKFwidmlzaXRGdW5jdGlvbkJvZHkgWyVzXSA6IFslc11cIiwgY3R4LmdldENoaWxkQ291bnQoKSwgY3R4LmdldFRleHQoKSk7XG4gICAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICB9XG5cblxuICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNhcnJheUxpdGVyYWwuXG4gIHZpc2l0QXJyYXlMaXRlcmFsKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICBjb25zb2xlLmluZm8oXCJ2aXNpdEFycmF5TGl0ZXJhbCBbJXNdIDogWyVzXVwiLCBjdHguZ2V0Q2hpbGRDb3VudCgpLCBjdHguZ2V0VGV4dCgpKTtcbiAgICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gIH1cblxuXG4gIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2VsZW1lbnRMaXN0LlxuICB2aXNpdEVsZW1lbnRMaXN0KGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICBjb25zb2xlLmluZm8oXCJ2aXNpdEVsZW1lbnRMaXN0IFslc10gOiBbJXNdXCIsIGN0eC5nZXRDaGlsZENvdW50KCksIGN0eC5nZXRUZXh0KCkpO1xuICAgIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgfVxuXG4gIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2VsaXNpb24uXG4gIHZpc2l0RWxpc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgY29uc29sZS5pbmZvKFwidmlzaXRFbGlzaW9uIFslc10gOiBbJXNdXCIsIGN0eC5nZXRDaGlsZENvdW50KCksIGN0eC5nZXRUZXh0KCkpO1xuICAgIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgfVxuXG5cbiAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjb2JqZWN0TGl0ZXJhbC5cbiAgdmlzaXRPYmplY3RMaXRlcmFsKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICBjb25zb2xlLmluZm8oXCJ2aXNpdE9iamVjdExpdGVyYWwgWyVzXSA6IFslc11cIiwgY3R4LmdldENoaWxkQ291bnQoKSwgY3R4LmdldFRleHQoKSk7XG4gICAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICB9XG5cblxuICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNwcm9wZXJ0eU5hbWVBbmRWYWx1ZUxpc3QuXG4gIHZpc2l0UHJvcGVydHlOYW1lQW5kVmFsdWVMaXN0KGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICBjb25zb2xlLmluZm8oXCJ2aXNpdFByb3BlcnR5TmFtZUFuZFZhbHVlTGlzdCBbJXNdIDogWyVzXVwiLCBjdHguZ2V0Q2hpbGRDb3VudCgpLCBjdHguZ2V0VGV4dCgpKTtcbiAgICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gIH1cblxuXG4gIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI1Byb3BlcnR5RXhwcmVzc2lvbkFzc2lnbm1lbnQuXG4gIHZpc2l0UHJvcGVydHlFeHByZXNzaW9uQXNzaWdubWVudChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gIH1cblxuXG4gIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI1Byb3BlcnR5R2V0dGVyLlxuICB2aXNpdFByb3BlcnR5R2V0dGVyKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgfVxuXG5cbiAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjUHJvcGVydHlTZXR0ZXIuXG4gIHZpc2l0UHJvcGVydHlTZXR0ZXIoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gICAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICB9XG5cblxuICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNwcm9wZXJ0eU5hbWUuXG4gIHZpc2l0UHJvcGVydHlOYW1lKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgfVxuXG5cbiAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjcHJvcGVydHlTZXRQYXJhbWV0ZXJMaXN0LlxuICB2aXNpdFByb3BlcnR5U2V0UGFyYW1ldGVyTGlzdChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gIH1cblxuXG4gIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2FyZ3VtZW50cy5cbiAgdmlzaXRBcmd1bWVudHMoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0QXJndW1lbnRzOiBcIiArIGN0eC5nZXRUZXh0KCkpO1xuICAgIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgfVxuXG5cbiAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjYXJndW1lbnRMaXN0LlxuICB2aXNpdEFyZ3VtZW50TGlzdChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgY29uc29sZS5pbmZvKFwidmlzaXRBcmd1bWVudExpc3Q6IFwiICsgY3R4LmdldFRleHQoKSk7XG5cbiAgICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gIH1cblxuXG4gIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2V4cHJlc3Npb25TZXF1ZW5jZS5cbiAgdmlzaXRFeHByZXNzaW9uU2VxdWVuY2UoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0RXhwcmVzc2lvblNlcXVlbmNlOiBcIiArIGN0eC5nZXRUZXh0KCkpO1xuICAgIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgfVxuXG5cbiAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjVGVybmFyeUV4cHJlc3Npb24uXG4gIHZpc2l0VGVybmFyeUV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gICAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICB9XG5cblxuICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNMb2dpY2FsQW5kRXhwcmVzc2lvbi5cbiAgdmlzaXRMb2dpY2FsQW5kRXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gIH1cblxuXG4gIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI1ByZUluY3JlbWVudEV4cHJlc3Npb24uXG4gIHZpc2l0UHJlSW5jcmVtZW50RXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gIH1cblxuXG4gIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI09iamVjdExpdGVyYWxFeHByZXNzaW9uLlxuICB2aXNpdE9iamVjdExpdGVyYWxFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgfVxuXG5cbiAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjSW5FeHByZXNzaW9uLlxuICB2aXNpdEluRXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gIH1cblxuXG4gIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI0xvZ2ljYWxPckV4cHJlc3Npb24uXG4gIHZpc2l0TG9naWNhbE9yRXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gIH1cblxuXG4gIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI05vdEV4cHJlc3Npb24uXG4gIHZpc2l0Tm90RXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gIH1cblxuXG4gIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI1ByZURlY3JlYXNlRXhwcmVzc2lvbi5cbiAgdmlzaXRQcmVEZWNyZWFzZUV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gICAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICB9XG5cblxuICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNBcmd1bWVudHNFeHByZXNzaW9uLlxuICB2aXNpdEFyZ3VtZW50c0V4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0QXJndW1lbnRzRXhwcmVzc2lvbjogXCIgKyBjdHguZ2V0VGV4dCgpKTtcblxuICAgIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgfVxuXG5cbiAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjVGhpc0V4cHJlc3Npb24uXG4gIHZpc2l0VGhpc0V4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gICAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICB9XG5cblxuICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNGdW5jdGlvbkV4cHJlc3Npb24uXG4gIHZpc2l0RnVuY3Rpb25FeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICBjb25zb2xlLmluZm8oXCJ2aXNpdEZ1bmN0aW9uRXhwcmVzc2lvbiBbJXNdIDogWyVzXVwiLCBjdHguZ2V0Q2hpbGRDb3VudCgpLCBjdHguZ2V0VGV4dCgpKTtcbiAgICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gIH1cblxuXG4gIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI1VuYXJ5TWludXNFeHByZXNzaW9uLlxuICB2aXNpdFVuYXJ5TWludXNFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgfVxuXG5cbiAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjUG9zdERlY3JlYXNlRXhwcmVzc2lvbi5cbiAgdmlzaXRQb3N0RGVjcmVhc2VFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgfVxuXG5cbiAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjQXNzaWdubWVudEV4cHJlc3Npb24uXG4gIHZpc2l0QXNzaWdubWVudEV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0QXNzaWdubWVudEV4cHJlc3Npb24gWyVzXTogWyVzXVwiLCBjdHguZ2V0Q2hpbGRDb3VudCgpLCAgY3R4LmdldFRleHQoKSk7XG4gICAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICB9XG5cblxuICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNUeXBlb2ZFeHByZXNzaW9uLlxuICB2aXNpdFR5cGVvZkV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gICAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICB9XG5cblxuICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNJbnN0YW5jZW9mRXhwcmVzc2lvbi5cbiAgdmlzaXRJbnN0YW5jZW9mRXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gIH1cblxuXG4gIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI1VuYXJ5UGx1c0V4cHJlc3Npb24uXG4gIHZpc2l0VW5hcnlQbHVzRXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgY29uc29sZS5pbmZvKFwidmlzaXRVbmFyeVBsdXNFeHByZXNzaW9uIFslc106IFslc11cIiwgY3R4LmdldENoaWxkQ291bnQoKSwgIGN0eC5nZXRUZXh0KCkpO1xuICAgIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgfVxuXG5cbiAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjRGVsZXRlRXhwcmVzc2lvbi5cbiAgdmlzaXREZWxldGVFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgfVxuXG5cbiAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjRXF1YWxpdHlFeHByZXNzaW9uLlxuICB2aXNpdEVxdWFsaXR5RXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gIH1cblxuXG4gIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI0JpdFhPckV4cHJlc3Npb24uXG4gIHZpc2l0Qml0WE9yRXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gIH1cblxuXG4gIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI011bHRpcGxpY2F0aXZlRXhwcmVzc2lvbi5cbiAgdmlzaXRNdWx0aXBsaWNhdGl2ZUV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0TXVsdGlwbGljYXRpdmVFeHByZXNzaW9uIFslc10gOiBbJXNdXCIsIGN0eC5nZXRDaGlsZENvdW50KCksIGN0eC5nZXRUZXh0KCkpO1xuICAgIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgfVxuXG5cbiAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjQml0U2hpZnRFeHByZXNzaW9uLlxuICB2aXNpdEJpdFNoaWZ0RXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gIH1cblxuXG4gIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI1BhcmVudGhlc2l6ZWRFeHByZXNzaW9uLlxuICB2aXNpdFBhcmVudGhlc2l6ZWRFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICBjb25zb2xlLmluZm8oXCJ2aXNpdFBhcmVudGhlc2l6ZWRFeHByZXNzaW9uIFslc10gOiBbJXNdXCIsIGN0eC5nZXRDaGlsZENvdW50KCksIGN0eC5nZXRUZXh0KCkpO1xuICAgIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgfVxuXG5cbiAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjQWRkaXRpdmVFeHByZXNzaW9uLlxuICB2aXNpdEFkZGl0aXZlRXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgY29uc29sZS5pbmZvKFwidmlzaXRBZGRpdGl2ZUV4cHJlc3Npb24gWyVzXSA6IFslc11cIiwgY3R4LmdldENoaWxkQ291bnQoKSwgY3R4LmdldFRleHQoKSk7XG4gICAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICB9XG5cblxuICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNSZWxhdGlvbmFsRXhwcmVzc2lvbi5cbiAgdmlzaXRSZWxhdGlvbmFsRXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgY29uc29sZS5pbmZvKFwidmlzaXRSZWxhdGlvbmFsRXhwcmVzc2lvbiBbJXNdIDogWyVzXVwiLCBjdHguZ2V0Q2hpbGRDb3VudCgpLCBjdHguZ2V0VGV4dCgpKTtcbiAgICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gIH1cblxuXG4gIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI1Bvc3RJbmNyZW1lbnRFeHByZXNzaW9uLlxuICB2aXNpdFBvc3RJbmNyZW1lbnRFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICBjb25zb2xlLmluZm8oXCJ2aXNpdFBvc3RJbmNyZW1lbnRFeHByZXNzaW9uIFslc10gOiBbJXNdXCIsIGN0eC5nZXRDaGlsZENvdW50KCksIGN0eC5nZXRUZXh0KCkpO1xuICAgIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgfVxuXG5cbiAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjQml0Tm90RXhwcmVzc2lvbi5cbiAgdmlzaXRCaXROb3RFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgfVxuXG5cbiAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjTmV3RXhwcmVzc2lvbi5cbiAgdmlzaXROZXdFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICBjb25zb2xlLmluZm8oXCJ2aXNpdE5ld0V4cHJlc3Npb24gWyVzXSA6IFslc11cIiwgY3R4LmdldENoaWxkQ291bnQoKSwgY3R4LmdldFRleHQoKSk7XG4gICAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICB9XG5cblxuICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNMaXRlcmFsRXhwcmVzc2lvbi5cbiAgdmlzaXRMaXRlcmFsRXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgY29uc29sZS5pbmZvKFwidmlzaXRMaXRlcmFsRXhwcmVzc2lvbiBbJXNdIDogWyVzXVwiLCBjdHguZ2V0Q2hpbGRDb3VudCgpLCBjdHguZ2V0VGV4dCgpKTtcbiAgICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gIH1cblxuXG4gIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI0FycmF5TGl0ZXJhbEV4cHJlc3Npb24uXG4gIHZpc2l0QXJyYXlMaXRlcmFsRXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgY29uc29sZS5pbmZvKFwidmlzaXRBcnJheUxpdGVyYWxFeHByZXNzaW9uIFslc10gOiBbJXNdXCIsIGN0eC5nZXRDaGlsZENvdW50KCksIGN0eC5nZXRUZXh0KCkpO1xuICAgIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgfVxuXG5cbiAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjTWVtYmVyRG90RXhwcmVzc2lvbi5cbiAgdmlzaXRNZW1iZXJEb3RFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICBjb25zb2xlLmluZm8oXCJ2aXNpdE1lbWJlckRvdEV4cHJlc3Npb24gWyVzXSA6IFslc11cIiwgY3R4LmdldENoaWxkQ291bnQoKSwgY3R4LmdldFRleHQoKSk7XG4gICAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICB9XG5cblxuICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNNZW1iZXJJbmRleEV4cHJlc3Npb24uXG4gIHZpc2l0TWVtYmVySW5kZXhFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgfVxuXG5cbiAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjSWRlbnRpZmllckV4cHJlc3Npb24uXG4gIHZpc2l0SWRlbnRpZmllckV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0SWRlbnRpZmllckV4cHJlc3Npb246IFwiICsgY3R4LmdldFRleHQoKSk7XG5cbiAgICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gIH1cblxuXG4gIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI0JpdEFuZEV4cHJlc3Npb24uXG4gIHZpc2l0Qml0QW5kRXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gIH1cblxuXG4gIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI0JpdE9yRXhwcmVzc2lvbi5cbiAgdmlzaXRCaXRPckV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gICAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICB9XG5cblxuICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNBc3NpZ25tZW50T3BlcmF0b3JFeHByZXNzaW9uLlxuICB2aXNpdEFzc2lnbm1lbnRPcGVyYXRvckV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gICAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICB9XG5cblxuICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNWb2lkRXhwcmVzc2lvbi5cbiAgdmlzaXRWb2lkRXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gIH1cblxuICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNhc3NpZ25tZW50T3BlcmF0b3IuXG4gIHZpc2l0QXNzaWdubWVudE9wZXJhdG9yKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICBjb25zb2xlLmluZm8oXCJ2aXNpdEFzc2lnbm1lbnRPcGVyYXRvcjogXCIgKyBjdHguZ2V0VGV4dCgpKTtcbiAgICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gIH1cblxuXG4gIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2xpdGVyYWwuXG4gIHZpc2l0TGl0ZXJhbChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgY29uc29sZS5pbmZvKFwidmlzaXRMaXRlcmFsOiBcIiArIGN0eC5nZXRUZXh0KCkpO1xuICAgIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgfVxuXG5cbiAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjbnVtZXJpY0xpdGVyYWwuXG4gIHZpc2l0TnVtZXJpY0xpdGVyYWwoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0TnVtZXJpY0xpdGVyYWw6IFwiICsgY3R4LmdldFRleHQoKSk7XG4gICAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICB9XG5cblxuICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNpZGVudGlmaWVyTmFtZS5cbiAgdmlzaXRJZGVudGlmaWVyTmFtZShjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgY29uc29sZS5pbmZvKFwidmlzaXRJZGVudGlmaWVyTmFtZTogXCIgKyBjdHguZ2V0VGV4dCgpKTtcbiAgICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gIH1cblxuXG4gIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI3Jlc2VydmVkV29yZC5cbiAgdmlzaXRSZXNlcnZlZFdvcmQoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0UmVzZXJ2ZWRXb3JkOiBcIiArIGN0eC5nZXRUZXh0KCkpO1xuXG4gICAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICB9XG5cblxuICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNrZXl3b3JkLlxuICB2aXNpdEtleXdvcmQoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgIGNvbnNvbGUuaW5mbyhcInZpc2l0S2V5d29yZDogXCIgKyBjdHguZ2V0VGV4dCgpKTtcblxuICAgIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgfVxuXG5cbiAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjZnV0dXJlUmVzZXJ2ZWRXb3JkLlxuICB2aXNpdEZ1dHVyZVJlc2VydmVkV29yZChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgY29uc29sZS50cmFjZSgnbm90IGltcGxlbWVudGVkJylcbiAgICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gIH1cblxuXG4gIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2dldHRlci5cbiAgdmlzaXRHZXR0ZXIoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gICAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICB9XG5cblxuICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNzZXR0ZXIuXG4gIHZpc2l0U2V0dGVyKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICBjb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgfVxuXG5cbiAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjZW9zLlxuICB2aXNpdEVvcyhjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgLy9jb25zb2xlLnRyYWNlKCdub3QgaW1wbGVtZW50ZWQnKVxuICAgIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgfVxuXG4gIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2VvZi5cbiAgdmlzaXRFb2YoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgIGNvbnNvbGUudHJhY2UoJ25vdCBpbXBsZW1lbnRlZCcpXG4gICAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICB9XG5cblxuXG4gIHZpc2l0Q2hpbGRyZW5YWChjdHgpIHtcbiAgICBjb25zb2xlLmluZm8oXCJDb250ZXh0IDpcIiArIGN0eC5nZXRUZXh0KCkpXG4gICAgaWYgKCFjdHgpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoY3R4LmNoaWxkcmVuKSB7XG4gICAgICByZXR1cm4gY3R4LmNoaWxkcmVuLm1hcChjaGlsZCA9PiB7XG4gICAgICAgIGlmIChjaGlsZC5jaGlsZHJlbiAmJiBjaGlsZC5jaGlsZHJlbi5sZW5ndGggIT0gMCkge1xuICAgICAgICAgIHJldHVybiBjaGlsZC5hY2NlcHQodGhpcyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIGNoaWxkLmdldFRleHQoKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG59Il19