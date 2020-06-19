import { ECMAScriptVisitor as DelvenVisitor } from "./parser/ECMAScriptVisitor"
import { RuleContext } from "antlr4/RuleContext"

export class PrintVisitor extends DelvenVisitor {

  // Visit a parse tree produced by ECMAScriptParser#program.
  visitProgram(ctx: RuleContext) {
    console.info("visitProgram: " + ctx.getText());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#sourceElements.
  visitSourceElements(ctx: RuleContext) {
    console.info("visitSourceElements: " + ctx.getText());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#sourceElement.
  visitSourceElement(ctx: RuleContext) {
    console.info("visitSourceElement: " + ctx.getText());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#statement.
  visitStatement(ctx: RuleContext) {
    console.info("visitStatement: " + ctx.getText());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#block.
  visitBlock(ctx: RuleContext) {
    console.info("visitBlock: " + ctx.getText());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#statementList.
  visitStatementList(ctx: RuleContext) {
    console.info("visitStatementList: " + ctx.getText());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#variableStatement.
  visitVariableStatement(ctx: RuleContext) {
    console.info("visitVariableStatement: " + ctx.getText());

    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#variableDeclarationList.
  visitVariableDeclarationList(ctx: RuleContext) {
    console.info("visitVariableDeclarationList: " + ctx.getText());

    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#variableDeclaration.
  visitVariableDeclaration(ctx: RuleContext) {
    console.info("visitVariableDeclaration: " + ctx.getText());

    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#initialiser.
  visitInitialiser(ctx: RuleContext) {
    console.info("visitInitialiser: " + ctx.getText());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#emptyStatement.
  visitEmptyStatement(ctx: RuleContext) {
    console.info("visitEmptyStatement: " + ctx.getText());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#expressionStatement.
  visitExpressionStatement(ctx: RuleContext) {
    console.info("visitExpressionStatement: " + ctx.getText());

    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#ifStatement.
  visitIfStatement(ctx: RuleContext) {
    console.info("visitIfStatement: " + ctx.getText());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#DoStatement.
  visitDoStatement(ctx: RuleContext) {
    console.info("visitDoStatement: " + ctx.getText());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#WhileStatement.
  visitWhileStatement(ctx: RuleContext) {
    console.info("visitWhileStatement: " + ctx.getText());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#ForStatement.
  visitForStatement(ctx: RuleContext) {
    console.info("visitWhileStatement: " + ctx.getText());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#ForVarStatement.
  visitForVarStatement(ctx: RuleContext) {
    console.trace('not implemented')
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#ForInStatement.
  visitForInStatement(ctx: RuleContext) {
    console.trace('not implemented')
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#ForVarInStatement.
  visitForVarInStatement(ctx: RuleContext) {
    console.trace('not implemented')
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#continueStatement.
  visitContinueStatement(ctx: RuleContext) {
    console.trace('not implemented')
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#breakStatement.
  visitBreakStatement(ctx: RuleContext) {
    console.trace('not implemented')
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#returnStatement.
  visitReturnStatement(ctx: RuleContext) {
    console.trace('not implemented')
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#withStatement.
  visitWithStatement(ctx: RuleContext) {
    console.trace('not implemented')
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#switchStatement.
  visitSwitchStatement(ctx: RuleContext) {
    console.trace('not implemented')
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#caseBlock.
  visitCaseBlock(ctx: RuleContext) {
    console.trace('not implemented')
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#caseClauses.
  visitCaseClauses(ctx: RuleContext) {
    console.trace('not implemented')
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#caseClause.
  visitCaseClause(ctx: RuleContext) {
    console.trace('not implemented')
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#defaultClause.
  visitDefaultClause(ctx: RuleContext) {
    console.trace('not implemented')
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#labelledStatement.
  visitLabelledStatement(ctx: RuleContext) {
    console.trace('not implemented')
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#throwStatement.
  visitThrowStatement(ctx: RuleContext) {
    console.trace('not implemented')
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#tryStatement.
  visitTryStatement(ctx: RuleContext) {
    console.trace('not implemented')
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#catchProduction.
  visitCatchProduction(ctx: RuleContext) {
    console.trace('not implemented')
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#finallyProduction.
  visitFinallyProduction(ctx: RuleContext) {
    console.trace('not implemented')
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#debuggerStatement.
  visitDebuggerStatement(ctx: RuleContext) {
    console.trace('not implemented')
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#functionDeclaration.
  visitFunctionDeclaration(ctx: RuleContext) {
    console.trace('not implemented')
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#formalParameterList.
  visitFormalParameterList(ctx: RuleContext) {
    console.info("visitFormalParameterList [%s] : [%s]", ctx.getChildCount(), ctx.getText());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#functionBody.
  visitFunctionBody(ctx: RuleContext) {
    console.info("visitFunctionBody [%s] : [%s]", ctx.getChildCount(), ctx.getText());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#arrayLiteral.
  visitArrayLiteral(ctx: RuleContext) {
    console.info("visitArrayLiteral [%s] : [%s]", ctx.getChildCount(), ctx.getText());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#elementList.
  visitElementList(ctx: RuleContext) {
    console.info("visitElementList [%s] : [%s]", ctx.getChildCount(), ctx.getText());
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#elision.
  visitElision(ctx: RuleContext) {
    console.info("visitElision [%s] : [%s]", ctx.getChildCount(), ctx.getText());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#objectLiteral.
  visitObjectLiteral(ctx: RuleContext) {
    console.info("visitObjectLiteral [%s] : [%s]", ctx.getChildCount(), ctx.getText());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#propertyNameAndValueList.
  visitPropertyNameAndValueList(ctx: RuleContext) {
    console.info("visitPropertyNameAndValueList [%s] : [%s]", ctx.getChildCount(), ctx.getText());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#PropertyExpressionAssignment.
  visitPropertyExpressionAssignment(ctx: RuleContext) {
    console.info("visitPropertyExpressionAssignment [%s] : [%s]", ctx.getChildCount(), ctx.getText());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#PropertyGetter.
  visitPropertyGetter(ctx: RuleContext) {
    console.trace('not implemented')
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#PropertySetter.
  visitPropertySetter(ctx: RuleContext) {
    console.trace('not implemented')
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#propertyName.
  visitPropertyName(ctx: RuleContext) {
    console.info("visitPropertyName [%s] : [%s]", ctx.getChildCount(), ctx.getText());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#propertySetParameterList.
  visitPropertySetParameterList(ctx: RuleContext) {
    console.trace('not implemented')
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#arguments.
  visitArguments(ctx: RuleContext) {
    console.info("visitArguments: " + ctx.getText());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#argumentList.
  visitArgumentList(ctx: RuleContext) {
    console.info("visitArgumentList: " + ctx.getText());

    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#expressionSequence.
  visitExpressionSequence(ctx: RuleContext) {
    console.info("visitExpressionSequence: " + ctx.getText());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#TernaryExpression.
  visitTernaryExpression(ctx: RuleContext) {
    console.trace('not implemented')
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#LogicalAndExpression.
  visitLogicalAndExpression(ctx: RuleContext) {
    console.trace('not implemented')
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#PreIncrementExpression.
  visitPreIncrementExpression(ctx: RuleContext) {
    console.info("visitPreIncrementExpression [%s] : [%s]", ctx.getChildCount(), ctx.getText());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#ObjectLiteralExpression.
  visitObjectLiteralExpression(ctx: RuleContext) {
    console.info("visitObjectLiteralExpression [%s] : [%s]", ctx.getChildCount(), ctx.getText());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#InExpression.
  visitInExpression(ctx: RuleContext) {
    console.info("visitInExpression [%s] : [%s]", ctx.getChildCount(), ctx.getText());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#LogicalOrExpression.
  visitLogicalOrExpression(ctx: RuleContext) {
    console.trace('not implemented')
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#NotExpression.
  visitNotExpression(ctx: RuleContext) {
    console.trace('not implemented')
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#PreDecreaseExpression.
  visitPreDecreaseExpression(ctx: RuleContext) {
    console.trace('not implemented')
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#ArgumentsExpression.
  visitArgumentsExpression(ctx: RuleContext) {
    console.info("visitArgumentsExpression: " + ctx.getText());

    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#ThisExpression.
  visitThisExpression(ctx: RuleContext) {
    console.trace('not implemented')
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#FunctionExpression.
  visitFunctionExpression(ctx: RuleContext) {
    console.info("visitFunctionExpression [%s] : [%s]", ctx.getChildCount(), ctx.getText());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#UnaryMinusExpression.
  visitUnaryMinusExpression(ctx: RuleContext) {
    console.trace('not implemented')
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#PostDecreaseExpression.
  visitPostDecreaseExpression(ctx: RuleContext) {
    console.trace('not implemented')
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#AssignmentExpression.
  visitAssignmentExpression(ctx: RuleContext) {
    console.info("visitAssignmentExpression [%s]: [%s]", ctx.getChildCount(),  ctx.getText());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#TypeofExpression.
  visitTypeofExpression(ctx: RuleContext) {
    console.trace('not implemented')
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#InstanceofExpression.
  visitInstanceofExpression(ctx: RuleContext) {
    console.trace('not implemented')
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#UnaryPlusExpression.
  visitUnaryPlusExpression(ctx: RuleContext) {
    console.info("visitUnaryPlusExpression [%s]: [%s]", ctx.getChildCount(),  ctx.getText());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#DeleteExpression.
  visitDeleteExpression(ctx: RuleContext) {
    console.trace('not implemented')
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#EqualityExpression.
  visitEqualityExpression(ctx: RuleContext) {
    console.info("visitEqualityExpression [%s] : [%s]", ctx.getChildCount(), ctx.getText());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#BitXOrExpression.
  visitBitXOrExpression(ctx: RuleContext) {
    console.trace('not implemented')
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#MultiplicativeExpression.
  visitMultiplicativeExpression(ctx: RuleContext) {
    console.info("visitMultiplicativeExpression [%s] : [%s]", ctx.getChildCount(), ctx.getText());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#BitShiftExpression.
  visitBitShiftExpression(ctx: RuleContext) {
    console.trace('not implemented')
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#ParenthesizedExpression.
  visitParenthesizedExpression(ctx: RuleContext) {
    console.info("visitParenthesizedExpression [%s] : [%s]", ctx.getChildCount(), ctx.getText());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#AdditiveExpression.
  visitAdditiveExpression(ctx: RuleContext) {
    console.info("visitAdditiveExpression [%s] : [%s]", ctx.getChildCount(), ctx.getText());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#RelationalExpression.
  visitRelationalExpression(ctx: RuleContext) {
    console.info("visitRelationalExpression [%s] : [%s]", ctx.getChildCount(), ctx.getText());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#PostIncrementExpression.
  visitPostIncrementExpression(ctx: RuleContext) {
    console.info("visitPostIncrementExpression [%s] : [%s]", ctx.getChildCount(), ctx.getText());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#BitNotExpression.
  visitBitNotExpression(ctx: RuleContext) {
    console.trace('not implemented')
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#NewExpression.
  visitNewExpression(ctx: RuleContext) {
    console.info("visitNewExpression [%s] : [%s]", ctx.getChildCount(), ctx.getText());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#LiteralExpression.
  visitLiteralExpression(ctx: RuleContext) {
    console.info("visitLiteralExpression [%s] : [%s]", ctx.getChildCount(), ctx.getText());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#ArrayLiteralExpression.
  visitArrayLiteralExpression(ctx: RuleContext) {
    console.info("visitArrayLiteralExpression [%s] : [%s]", ctx.getChildCount(), ctx.getText());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#MemberDotExpression.
  visitMemberDotExpression(ctx: RuleContext) {
    console.info("visitMemberDotExpression [%s] : [%s]", ctx.getChildCount(), ctx.getText());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#MemberIndexExpression.
  visitMemberIndexExpression(ctx: RuleContext) {
    console.info("visitMemberIndexExpression [%s] : [%s]", ctx.getChildCount(), ctx.getText());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#IdentifierExpression.
  visitIdentifierExpression(ctx: RuleContext) {
    console.info("visitIdentifierExpression [%s] : [%s]", ctx.getChildCount(), ctx.getText());

    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#BitAndExpression.
  visitBitAndExpression(ctx: RuleContext) {
    console.info("visitBitAndExpression [%s] : [%s]", ctx.getChildCount(), ctx.getText());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#BitOrExpression.
  visitBitOrExpression(ctx: RuleContext) {
    console.info("visitBitOrExpression [%s] : [%s]", ctx.getChildCount(), ctx.getText());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#AssignmentOperatorExpression.
  visitAssignmentOperatorExpression(ctx: RuleContext) {
    console.info("visitAssignmentOperatorExpression [%s] : [%s]", ctx.getChildCount(), ctx.getText());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#VoidExpression.
  visitVoidExpression(ctx: RuleContext) {
    console.info("visitVoidExpression [%s] : [%s]", ctx.getChildCount(), ctx.getText());
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#assignmentOperator.
  visitAssignmentOperator(ctx: RuleContext) {
    console.info("visitAssignmentOperator [%s] : [%s]", ctx.getChildCount(), ctx.getText());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#literal.
  visitLiteral(ctx: RuleContext) {
    console.info("visitLiteral: " + ctx.getText());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#numericLiteral.
  visitNumericLiteral(ctx: RuleContext) {
    console.info("visitNumericLiteral: " + ctx.getText());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#identifierName.
  visitIdentifierName(ctx: RuleContext) {
    console.info("visitIdentifierName: " + ctx.getText());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#reservedWord.
  visitReservedWord(ctx: RuleContext) {
    console.info("visitReservedWord: " + ctx.getText());

    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#keyword.
  visitKeyword(ctx: RuleContext) {
    console.info("visitKeyword: " + ctx.getText());

    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#futureReservedWord.
  visitFutureReservedWord(ctx: RuleContext) {
    console.trace('not implemented')
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#getter.
  visitGetter(ctx: RuleContext) {
    console.trace('not implemented')
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#setter.
  visitSetter(ctx: RuleContext) {
    console.trace('not implemented')
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#eos.
  visitEos(ctx: RuleContext) {
    //console.trace('not implemented')
    return this.visitChildren(ctx);
  }

  // Visit a parse tree produced by ECMAScriptParser#eof.
  visitEof(ctx: RuleContext) {
    console.trace('not implemented')
    return this.visitChildren(ctx);
  }



  visitChildrenXX(ctx) {
    console.info("Context :" + ctx.getText())
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