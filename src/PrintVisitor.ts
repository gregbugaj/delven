import { ECMAScriptParserVisitor as DelvenVisitor } from "./parser/ECMAScriptParserVisitor"
import { RuleContext } from "antlr4/RuleContext"
import Trace, { CallSite } from "./trace"

export class PrintVisitor extends DelvenVisitor {

  log(ctx: RuleContext, frame: CallSite) {
    console.info("%s [%s] : %s", frame.function, ctx.getChildCount(), ctx.getText());
  }

  // Visit a parse tree produced by ECMAScriptParser#program.
  visitProgram(ctx: RuleContext) {
    this.log(ctx, Trace.frame());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#sourceElement.
  visitSourceElement(ctx: RuleContext) {
    this.log(ctx, Trace.frame());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#statement.
  visitStatement(ctx: RuleContext) {
    this.log(ctx, Trace.frame());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#block.
  visitBlock(ctx: RuleContext) {
    this.log(ctx, Trace.frame());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#statementList.
  visitStatementList(ctx: RuleContext) {
    this.log(ctx, Trace.frame());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#importStatement.
  visitImportStatement(ctx: RuleContext) {
    this.log(ctx, Trace.frame());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#importFromBlock.
  visitImportFromBlock(ctx: RuleContext) {
    this.log(ctx, Trace.frame());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#moduleItems.
  visitModuleItems(ctx: RuleContext) {
    this.log(ctx, Trace.frame());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#importDefault.
  visitImportDefault(ctx: RuleContext) {
    this.log(ctx, Trace.frame());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#importNamespace.
  visitImportNamespace(ctx: RuleContext) {
    this.log(ctx, Trace.frame());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#importFrom.
  visitImportFrom(ctx: RuleContext) {
    this.log(ctx, Trace.frame());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#aliasName.
  visitAliasName(ctx: RuleContext) {
    this.log(ctx, Trace.frame());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#ExportDeclaration.
  visitExportDeclaration(ctx: RuleContext) {
    this.log(ctx, Trace.frame());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#ExportDefaultDeclaration.
  visitExportDefaultDeclaration(ctx: RuleContext) {
    this.log(ctx, Trace.frame());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#exportFromBlock.
  visitExportFromBlock(ctx: RuleContext) {
    this.log(ctx, Trace.frame());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#declaration.
  visitDeclaration(ctx: RuleContext) {
    this.log(ctx, Trace.frame());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#variableStatement.
  visitVariableStatement(ctx: RuleContext) {
    this.log(ctx, Trace.frame());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#variableDeclarationList.
  visitVariableDeclarationList(ctx: RuleContext) {
    this.log(ctx, Trace.frame());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#variableDeclaration.
  visitVariableDeclaration(ctx: RuleContext) {
    this.log(ctx, Trace.frame());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#emptyStatement.
  visitEmptyStatement(ctx: RuleContext) {
    this.log(ctx, Trace.frame());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#expressionStatement.
  visitExpressionStatement(ctx: RuleContext) {
    this.log(ctx, Trace.frame());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#ifStatement.
  visitIfStatement(ctx: RuleContext) {
    this.log(ctx, Trace.frame());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#DoStatement.
  visitDoStatement(ctx: RuleContext) {
    this.log(ctx, Trace.frame());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#WhileStatement.
  visitWhileStatement(ctx: RuleContext) {
    this.log(ctx, Trace.frame());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#ForStatement.
  visitForStatement(ctx: RuleContext) {
    this.log(ctx, Trace.frame());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#ForInStatement.
  visitForInStatement(ctx: RuleContext) {
    this.log(ctx, Trace.frame());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#ForOfStatement.
  visitForOfStatement(ctx: RuleContext) {
    this.log(ctx, Trace.frame());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#varModifier.
  visitVarModifier(ctx: RuleContext) {
    this.log(ctx, Trace.frame());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#continueStatement.
  visitContinueStatement(ctx: RuleContext) {
    this.log(ctx, Trace.frame());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#breakStatement.
  visitBreakStatement(ctx: RuleContext) {
    this.log(ctx, Trace.frame());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#returnStatement.
  visitReturnStatement(ctx: RuleContext) {
    this.log(ctx, Trace.frame());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#yieldStatement.
  visitYieldStatement(ctx: RuleContext) {
    this.log(ctx, Trace.frame());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#withStatement.
  visitWithStatement(ctx: RuleContext) {
    this.log(ctx, Trace.frame());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#switchStatement.
  visitSwitchStatement(ctx: RuleContext) {
    this.log(ctx, Trace.frame());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#caseBlock.
  visitCaseBlock(ctx: RuleContext) {
    this.log(ctx, Trace.frame());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#caseClauses.
  visitCaseClauses(ctx: RuleContext) {
    this.log(ctx, Trace.frame());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#caseClause.
  visitCaseClause(ctx: RuleContext) {
    this.log(ctx, Trace.frame());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#defaultClause.
  visitDefaultClause(ctx: RuleContext) {
    this.log(ctx, Trace.frame());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#labelledStatement.
  visitLabelledStatement(ctx: RuleContext) {
    this.log(ctx, Trace.frame());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#throwStatement.
  visitThrowStatement(ctx: RuleContext) {
    this.log(ctx, Trace.frame());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#tryStatement.
  visitTryStatement(ctx: RuleContext) {
    this.log(ctx, Trace.frame());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#catchProduction.
  visitCatchProduction(ctx: RuleContext) {
    this.log(ctx, Trace.frame());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#finallyProduction.
  visitFinallyProduction(ctx: RuleContext) {
    this.log(ctx, Trace.frame());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#debuggerStatement.
  visitDebuggerStatement(ctx: RuleContext) {
    this.log(ctx, Trace.frame());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#functionDeclaration.
  visitFunctionDeclaration(ctx: RuleContext) {
    this.log(ctx, Trace.frame());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#classDeclaration.
  visitClassDeclaration(ctx: RuleContext) {
    this.log(ctx, Trace.frame());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#classTail.
  visitClassTail(ctx: RuleContext) {
    this.log(ctx, Trace.frame());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#classElement.
  visitClassElement(ctx: RuleContext) {
    this.log(ctx, Trace.frame());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#methodDefinition.
  visitMethodDefinition(ctx: RuleContext) {
    this.log(ctx, Trace.frame());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#formalParameterList.
  visitFormalParameterList(ctx: RuleContext) {
    this.log(ctx, Trace.frame());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#formalParameterArg.
  visitFormalParameterArg(ctx: RuleContext) {
    this.log(ctx, Trace.frame());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#lastFormalParameterArg.
  visitLastFormalParameterArg(ctx: RuleContext) {
    this.log(ctx, Trace.frame());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#functionBody.
  visitFunctionBody(ctx: RuleContext) {
    this.log(ctx, Trace.frame());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#sourceElements.
  visitSourceElements(ctx: RuleContext) {
    this.log(ctx, Trace.frame());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#arrayLiteral.
  visitArrayLiteral(ctx: RuleContext) {
    this.log(ctx, Trace.frame());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#elementList.
  visitElementList(ctx: RuleContext) {
    this.log(ctx, Trace.frame());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#arrayElement.
  visitArrayElement(ctx: RuleContext) {
    this.log(ctx, Trace.frame());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#PropertyExpressionAssignment.
  visitPropertyExpressionAssignment(ctx: RuleContext) {
    this.log(ctx, Trace.frame());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#ComputedPropertyExpressionAssignment.
  visitComputedPropertyExpressionAssignment(ctx: RuleContext) {
    this.log(ctx, Trace.frame());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#FunctionProperty.
  visitFunctionProperty(ctx: RuleContext) {
    this.log(ctx, Trace.frame());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#PropertyGetter.
  visitPropertyGetter(ctx: RuleContext) {
    this.log(ctx, Trace.frame());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#PropertySetter.
  visitPropertySetter(ctx: RuleContext) {
    this.log(ctx, Trace.frame());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#PropertyShorthand.
  visitPropertyShorthand(ctx: RuleContext) {
    this.log(ctx, Trace.frame());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#propertyName.
  visitPropertyName(ctx: RuleContext) {
    this.log(ctx, Trace.frame());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#arguments.
  visitArguments(ctx: RuleContext) {
    this.log(ctx, Trace.frame());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#argument.
  visitArgument(ctx: RuleContext) {
    this.log(ctx, Trace.frame());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#expressionSequence.
  visitExpressionSequence(ctx: RuleContext) {
    this.log(ctx, Trace.frame());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#TemplateStringExpression.
  visitTemplateStringExpression(ctx: RuleContext) {
    this.log(ctx, Trace.frame());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#TernaryExpression.
  visitTernaryExpression(ctx: RuleContext) {
    this.log(ctx, Trace.frame());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#LogicalAndExpression.
  visitLogicalAndExpression(ctx: RuleContext) {
    this.log(ctx, Trace.frame());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#PowerExpression.
  visitPowerExpression(ctx: RuleContext) {
    this.log(ctx, Trace.frame());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#PreIncrementExpression.
  visitPreIncrementExpression(ctx: RuleContext) {
    this.log(ctx, Trace.frame());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#ObjectLiteralExpression.
  visitObjectLiteralExpression(ctx: RuleContext) {
    this.log(ctx, Trace.frame());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#MetaExpression.
  visitMetaExpression(ctx: RuleContext) {
    this.log(ctx, Trace.frame());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#InExpression.
  visitInExpression(ctx: RuleContext) {
    this.log(ctx, Trace.frame());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#LogicalOrExpression.
  visitLogicalOrExpression(ctx: RuleContext) {
    this.log(ctx, Trace.frame());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#NotExpression.
  visitNotExpression(ctx: RuleContext) {
    this.log(ctx, Trace.frame());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#PreDecreaseExpression.
  visitPreDecreaseExpression(ctx: RuleContext) {
    this.log(ctx, Trace.frame());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#ArgumentsExpression.
  visitArgumentsExpression(ctx: RuleContext) {
    this.log(ctx, Trace.frame());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#AwaitExpression.
  visitAwaitExpression(ctx: RuleContext) {
    this.log(ctx, Trace.frame());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#ThisExpression.
  visitThisExpression(ctx: RuleContext) {
    this.log(ctx, Trace.frame());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#FunctionExpression.
  visitFunctionExpression(ctx: RuleContext) {
    this.log(ctx, Trace.frame());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#UnaryMinusExpression.
  visitUnaryMinusExpression(ctx: RuleContext) {
    this.log(ctx, Trace.frame());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#AssignmentExpression.
  visitAssignmentExpression(ctx: RuleContext) {
    this.log(ctx, Trace.frame());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#PostDecreaseExpression.
  visitPostDecreaseExpression(ctx: RuleContext) {
    this.log(ctx, Trace.frame());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#TypeofExpression.
  visitTypeofExpression(ctx: RuleContext) {
    this.log(ctx, Trace.frame());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#InstanceofExpression.
  visitInstanceofExpression(ctx: RuleContext) {
    this.log(ctx, Trace.frame());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#UnaryPlusExpression.
  visitUnaryPlusExpression(ctx: RuleContext) {
    this.log(ctx, Trace.frame());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#DeleteExpression.
  visitDeleteExpression(ctx: RuleContext) {
    this.log(ctx, Trace.frame());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#ImportExpression.
  visitImportExpression(ctx: RuleContext) {
    this.log(ctx, Trace.frame());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#EqualityExpression.
  visitEqualityExpression(ctx: RuleContext) {
    this.log(ctx, Trace.frame());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#BitXOrExpression.
  visitBitXOrExpression(ctx: RuleContext) {
    this.log(ctx, Trace.frame());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#SuperExpression.
  visitSuperExpression(ctx: RuleContext) {
    this.log(ctx, Trace.frame());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#MultiplicativeExpression.
  visitMultiplicativeExpression(ctx: RuleContext) {
    this.log(ctx, Trace.frame());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#BitShiftExpression.
  visitBitShiftExpression(ctx: RuleContext) {
    this.log(ctx, Trace.frame());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#ParenthesizedExpression.
  visitParenthesizedExpression(ctx: RuleContext) {
    this.log(ctx, Trace.frame());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#AdditiveExpression.
  visitAdditiveExpression(ctx: RuleContext) {
    this.log(ctx, Trace.frame());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#RelationalExpression.
  visitRelationalExpression(ctx: RuleContext) {
    this.log(ctx, Trace.frame());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#PostIncrementExpression.
  visitPostIncrementExpression(ctx: RuleContext) {
    this.log(ctx, Trace.frame());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#YieldExpression.
  visitYieldExpression(ctx: RuleContext) {
    this.log(ctx, Trace.frame());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#BitNotExpression.
  visitBitNotExpression(ctx: RuleContext) {
    this.log(ctx, Trace.frame());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#NewExpression.
  visitNewExpression(ctx: RuleContext) {
    this.log(ctx, Trace.frame());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#LiteralExpression.
  visitLiteralExpression(ctx: RuleContext) {
    this.log(ctx, Trace.frame());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#ArrayLiteralExpression.
  visitArrayLiteralExpression(ctx: RuleContext) {
    this.log(ctx, Trace.frame());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#MemberDotExpression.
  visitMemberDotExpression(ctx: RuleContext) {
    this.log(ctx, Trace.frame());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#ClassExpression.
  visitClassExpression(ctx: RuleContext) {
    this.log(ctx, Trace.frame());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#MemberIndexExpression.
  visitMemberIndexExpression(ctx: RuleContext) {
    this.log(ctx, Trace.frame());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#IdentifierExpression.
  visitIdentifierExpression(ctx: RuleContext) {
    this.log(ctx, Trace.frame());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#BitAndExpression.
  visitBitAndExpression(ctx: RuleContext) {
    this.log(ctx, Trace.frame());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#BitOrExpression.
  visitBitOrExpression(ctx: RuleContext) {
    this.log(ctx, Trace.frame());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#AssignmentOperatorExpression.
  visitAssignmentOperatorExpression(ctx: RuleContext) {
    this.log(ctx, Trace.frame());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#VoidExpression.
  visitVoidExpression(ctx: RuleContext) {
    this.log(ctx, Trace.frame());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#CoalesceExpression.
  visitCoalesceExpression(ctx: RuleContext) {
    this.log(ctx, Trace.frame());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#assignable.
  visitAssignable(ctx: RuleContext) {
    this.log(ctx, Trace.frame());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#objectLiteral.
  visitObjectLiteral(ctx: RuleContext) {
    this.log(ctx, Trace.frame());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#FunctionDecl.
  visitFunctionDecl(ctx: RuleContext) {
    this.log(ctx, Trace.frame());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#AnoymousFunctionDecl.
  visitAnoymousFunctionDecl(ctx: RuleContext) {
    this.log(ctx, Trace.frame());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#ArrowFunction.
  visitArrowFunction(ctx: RuleContext) {
    this.log(ctx, Trace.frame());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#arrowFunctionParameters.
  visitArrowFunctionParameters(ctx: RuleContext) {
    this.log(ctx, Trace.frame());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#arrowFunctionBody.
  visitArrowFunctionBody(ctx: RuleContext) {
    this.log(ctx, Trace.frame());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#assignmentOperator.
  visitAssignmentOperator(ctx: RuleContext) {
    this.log(ctx, Trace.frame());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#literal.
  visitLiteral(ctx: RuleContext) {
    this.log(ctx, Trace.frame());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#numericLiteral.
  visitNumericLiteral(ctx: RuleContext) {
    this.log(ctx, Trace.frame());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#bigintLiteral.
  visitBigintLiteral(ctx: RuleContext) {
    this.log(ctx, Trace.frame());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#getter.
  visitGetter(ctx: RuleContext) {
    this.log(ctx, Trace.frame());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#setter.
  visitSetter(ctx: RuleContext) {
    this.log(ctx, Trace.frame());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#identifierName.
  visitIdentifierName(ctx: RuleContext) {
    this.log(ctx, Trace.frame());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#identifier.
  visitIdentifier(ctx: RuleContext) {
    this.log(ctx, Trace.frame());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#reservedWord.
  visitReservedWord(ctx: RuleContext) {
    this.log(ctx, Trace.frame());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#keyword.
  visitKeyword(ctx: RuleContext) {
    this.log(ctx, Trace.frame());
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by ECMAScriptParser#eos.
  visitEos(ctx: RuleContext) {
    this.log(ctx, Trace.frame());
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