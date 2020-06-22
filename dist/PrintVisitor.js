"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PrintVisitor = void 0;

var _ECMAScriptParserVisitor = require("./parser/ECMAScriptParserVisitor");

var _trace = _interopRequireDefault(require("./trace"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class PrintVisitor extends _ECMAScriptParserVisitor.ECMAScriptParserVisitor {
  log(ctx, frame) {
    console.info("%s [%s] : %s", frame.function, ctx.getChildCount(), ctx.getText());
  } // Visit a parse tree produced by ECMAScriptParser#program.


  visitProgram(ctx) {
    this.log(ctx, _trace.default.frame());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#sourceElement.


  visitSourceElement(ctx) {
    this.log(ctx, _trace.default.frame());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#statement.


  visitStatement(ctx) {
    this.log(ctx, _trace.default.frame());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#block.


  visitBlock(ctx) {
    this.log(ctx, _trace.default.frame());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#statementList.


  visitStatementList(ctx) {
    this.log(ctx, _trace.default.frame());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#importStatement.


  visitImportStatement(ctx) {
    this.log(ctx, _trace.default.frame());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#importFromBlock.


  visitImportFromBlock(ctx) {
    this.log(ctx, _trace.default.frame());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#moduleItems.


  visitModuleItems(ctx) {
    this.log(ctx, _trace.default.frame());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#importDefault.


  visitImportDefault(ctx) {
    this.log(ctx, _trace.default.frame());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#importNamespace.


  visitImportNamespace(ctx) {
    this.log(ctx, _trace.default.frame());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#importFrom.


  visitImportFrom(ctx) {
    this.log(ctx, _trace.default.frame());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#aliasName.


  visitAliasName(ctx) {
    this.log(ctx, _trace.default.frame());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#ExportDeclaration.


  visitExportDeclaration(ctx) {
    this.log(ctx, _trace.default.frame());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#ExportDefaultDeclaration.


  visitExportDefaultDeclaration(ctx) {
    this.log(ctx, _trace.default.frame());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#exportFromBlock.


  visitExportFromBlock(ctx) {
    this.log(ctx, _trace.default.frame());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#declaration.


  visitDeclaration(ctx) {
    this.log(ctx, _trace.default.frame());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#variableStatement.


  visitVariableStatement(ctx) {
    this.log(ctx, _trace.default.frame());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#variableDeclarationList.


  visitVariableDeclarationList(ctx) {
    this.log(ctx, _trace.default.frame());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#variableDeclaration.


  visitVariableDeclaration(ctx) {
    this.log(ctx, _trace.default.frame());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#emptyStatement.


  visitEmptyStatement(ctx) {
    this.log(ctx, _trace.default.frame());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#expressionStatement.


  visitExpressionStatement(ctx) {
    this.log(ctx, _trace.default.frame());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#ifStatement.


  visitIfStatement(ctx) {
    this.log(ctx, _trace.default.frame());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#DoStatement.


  visitDoStatement(ctx) {
    this.log(ctx, _trace.default.frame());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#WhileStatement.


  visitWhileStatement(ctx) {
    this.log(ctx, _trace.default.frame());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#ForStatement.


  visitForStatement(ctx) {
    this.log(ctx, _trace.default.frame());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#ForInStatement.


  visitForInStatement(ctx) {
    this.log(ctx, _trace.default.frame());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#ForOfStatement.


  visitForOfStatement(ctx) {
    this.log(ctx, _trace.default.frame());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#varModifier.


  visitVarModifier(ctx) {
    this.log(ctx, _trace.default.frame());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#continueStatement.


  visitContinueStatement(ctx) {
    this.log(ctx, _trace.default.frame());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#breakStatement.


  visitBreakStatement(ctx) {
    this.log(ctx, _trace.default.frame());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#returnStatement.


  visitReturnStatement(ctx) {
    this.log(ctx, _trace.default.frame());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#yieldStatement.


  visitYieldStatement(ctx) {
    this.log(ctx, _trace.default.frame());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#withStatement.


  visitWithStatement(ctx) {
    this.log(ctx, _trace.default.frame());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#switchStatement.


  visitSwitchStatement(ctx) {
    this.log(ctx, _trace.default.frame());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#caseBlock.


  visitCaseBlock(ctx) {
    this.log(ctx, _trace.default.frame());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#caseClauses.


  visitCaseClauses(ctx) {
    this.log(ctx, _trace.default.frame());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#caseClause.


  visitCaseClause(ctx) {
    this.log(ctx, _trace.default.frame());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#defaultClause.


  visitDefaultClause(ctx) {
    this.log(ctx, _trace.default.frame());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#labelledStatement.


  visitLabelledStatement(ctx) {
    this.log(ctx, _trace.default.frame());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#throwStatement.


  visitThrowStatement(ctx) {
    this.log(ctx, _trace.default.frame());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#tryStatement.


  visitTryStatement(ctx) {
    this.log(ctx, _trace.default.frame());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#catchProduction.


  visitCatchProduction(ctx) {
    this.log(ctx, _trace.default.frame());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#finallyProduction.


  visitFinallyProduction(ctx) {
    this.log(ctx, _trace.default.frame());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#debuggerStatement.


  visitDebuggerStatement(ctx) {
    this.log(ctx, _trace.default.frame());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#functionDeclaration.


  visitFunctionDeclaration(ctx) {
    this.log(ctx, _trace.default.frame());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#classDeclaration.


  visitClassDeclaration(ctx) {
    this.log(ctx, _trace.default.frame());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#classTail.


  visitClassTail(ctx) {
    this.log(ctx, _trace.default.frame());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#classElement.


  visitClassElement(ctx) {
    this.log(ctx, _trace.default.frame());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#methodDefinition.


  visitMethodDefinition(ctx) {
    this.log(ctx, _trace.default.frame());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#formalParameterList.


  visitFormalParameterList(ctx) {
    this.log(ctx, _trace.default.frame());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#formalParameterArg.


  visitFormalParameterArg(ctx) {
    this.log(ctx, _trace.default.frame());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#lastFormalParameterArg.


  visitLastFormalParameterArg(ctx) {
    this.log(ctx, _trace.default.frame());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#functionBody.


  visitFunctionBody(ctx) {
    this.log(ctx, _trace.default.frame());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#sourceElements.


  visitSourceElements(ctx) {
    this.log(ctx, _trace.default.frame());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#arrayLiteral.


  visitArrayLiteral(ctx) {
    this.log(ctx, _trace.default.frame());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#elementList.


  visitElementList(ctx) {
    this.log(ctx, _trace.default.frame());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#arrayElement.


  visitArrayElement(ctx) {
    this.log(ctx, _trace.default.frame());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#PropertyExpressionAssignment.


  visitPropertyExpressionAssignment(ctx) {
    this.log(ctx, _trace.default.frame());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#ComputedPropertyExpressionAssignment.


  visitComputedPropertyExpressionAssignment(ctx) {
    this.log(ctx, _trace.default.frame());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#FunctionProperty.


  visitFunctionProperty(ctx) {
    this.log(ctx, _trace.default.frame());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#PropertyGetter.


  visitPropertyGetter(ctx) {
    this.log(ctx, _trace.default.frame());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#PropertySetter.


  visitPropertySetter(ctx) {
    this.log(ctx, _trace.default.frame());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#PropertyShorthand.


  visitPropertyShorthand(ctx) {
    this.log(ctx, _trace.default.frame());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#propertyName.


  visitPropertyName(ctx) {
    this.log(ctx, _trace.default.frame());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#arguments.


  visitArguments(ctx) {
    this.log(ctx, _trace.default.frame());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#argument.


  visitArgument(ctx) {
    this.log(ctx, _trace.default.frame());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#expressionSequence.


  visitExpressionSequence(ctx) {
    this.log(ctx, _trace.default.frame());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#TemplateStringExpression.


  visitTemplateStringExpression(ctx) {
    this.log(ctx, _trace.default.frame());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#TernaryExpression.


  visitTernaryExpression(ctx) {
    this.log(ctx, _trace.default.frame());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#LogicalAndExpression.


  visitLogicalAndExpression(ctx) {
    this.log(ctx, _trace.default.frame());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#PowerExpression.


  visitPowerExpression(ctx) {
    this.log(ctx, _trace.default.frame());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#PreIncrementExpression.


  visitPreIncrementExpression(ctx) {
    this.log(ctx, _trace.default.frame());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#ObjectLiteralExpression.


  visitObjectLiteralExpression(ctx) {
    this.log(ctx, _trace.default.frame());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#MetaExpression.


  visitMetaExpression(ctx) {
    this.log(ctx, _trace.default.frame());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#InExpression.


  visitInExpression(ctx) {
    this.log(ctx, _trace.default.frame());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#LogicalOrExpression.


  visitLogicalOrExpression(ctx) {
    this.log(ctx, _trace.default.frame());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#NotExpression.


  visitNotExpression(ctx) {
    this.log(ctx, _trace.default.frame());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#PreDecreaseExpression.


  visitPreDecreaseExpression(ctx) {
    this.log(ctx, _trace.default.frame());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#ArgumentsExpression.


  visitArgumentsExpression(ctx) {
    this.log(ctx, _trace.default.frame());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#AwaitExpression.


  visitAwaitExpression(ctx) {
    this.log(ctx, _trace.default.frame());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#ThisExpression.


  visitThisExpression(ctx) {
    this.log(ctx, _trace.default.frame());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#FunctionExpression.


  visitFunctionExpression(ctx) {
    this.log(ctx, _trace.default.frame());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#UnaryMinusExpression.


  visitUnaryMinusExpression(ctx) {
    this.log(ctx, _trace.default.frame());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#AssignmentExpression.


  visitAssignmentExpression(ctx) {
    this.log(ctx, _trace.default.frame());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#PostDecreaseExpression.


  visitPostDecreaseExpression(ctx) {
    this.log(ctx, _trace.default.frame());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#TypeofExpression.


  visitTypeofExpression(ctx) {
    this.log(ctx, _trace.default.frame());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#InstanceofExpression.


  visitInstanceofExpression(ctx) {
    this.log(ctx, _trace.default.frame());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#UnaryPlusExpression.


  visitUnaryPlusExpression(ctx) {
    this.log(ctx, _trace.default.frame());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#DeleteExpression.


  visitDeleteExpression(ctx) {
    this.log(ctx, _trace.default.frame());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#ImportExpression.


  visitImportExpression(ctx) {
    this.log(ctx, _trace.default.frame());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#EqualityExpression.


  visitEqualityExpression(ctx) {
    this.log(ctx, _trace.default.frame());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#BitXOrExpression.


  visitBitXOrExpression(ctx) {
    this.log(ctx, _trace.default.frame());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#SuperExpression.


  visitSuperExpression(ctx) {
    this.log(ctx, _trace.default.frame());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#MultiplicativeExpression.


  visitMultiplicativeExpression(ctx) {
    this.log(ctx, _trace.default.frame());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#BitShiftExpression.


  visitBitShiftExpression(ctx) {
    this.log(ctx, _trace.default.frame());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#ParenthesizedExpression.


  visitParenthesizedExpression(ctx) {
    this.log(ctx, _trace.default.frame());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#AdditiveExpression.


  visitAdditiveExpression(ctx) {
    this.log(ctx, _trace.default.frame());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#RelationalExpression.


  visitRelationalExpression(ctx) {
    this.log(ctx, _trace.default.frame());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#PostIncrementExpression.


  visitPostIncrementExpression(ctx) {
    this.log(ctx, _trace.default.frame());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#YieldExpression.


  visitYieldExpression(ctx) {
    this.log(ctx, _trace.default.frame());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#BitNotExpression.


  visitBitNotExpression(ctx) {
    this.log(ctx, _trace.default.frame());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#NewExpression.


  visitNewExpression(ctx) {
    this.log(ctx, _trace.default.frame());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#LiteralExpression.


  visitLiteralExpression(ctx) {
    this.log(ctx, _trace.default.frame());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#ArrayLiteralExpression.


  visitArrayLiteralExpression(ctx) {
    this.log(ctx, _trace.default.frame());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#MemberDotExpression.


  visitMemberDotExpression(ctx) {
    this.log(ctx, _trace.default.frame());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#ClassExpression.


  visitClassExpression(ctx) {
    this.log(ctx, _trace.default.frame());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#MemberIndexExpression.


  visitMemberIndexExpression(ctx) {
    this.log(ctx, _trace.default.frame());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#IdentifierExpression.


  visitIdentifierExpression(ctx) {
    this.log(ctx, _trace.default.frame());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#BitAndExpression.


  visitBitAndExpression(ctx) {
    this.log(ctx, _trace.default.frame());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#BitOrExpression.


  visitBitOrExpression(ctx) {
    this.log(ctx, _trace.default.frame());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#AssignmentOperatorExpression.


  visitAssignmentOperatorExpression(ctx) {
    this.log(ctx, _trace.default.frame());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#VoidExpression.


  visitVoidExpression(ctx) {
    this.log(ctx, _trace.default.frame());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#CoalesceExpression.


  visitCoalesceExpression(ctx) {
    this.log(ctx, _trace.default.frame());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#assignable.


  visitAssignable(ctx) {
    this.log(ctx, _trace.default.frame());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#objectLiteral.


  visitObjectLiteral(ctx) {
    this.log(ctx, _trace.default.frame());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#FunctionDecl.


  visitFunctionDecl(ctx) {
    this.log(ctx, _trace.default.frame());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#AnoymousFunctionDecl.


  visitAnoymousFunctionDecl(ctx) {
    this.log(ctx, _trace.default.frame());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#ArrowFunction.


  visitArrowFunction(ctx) {
    this.log(ctx, _trace.default.frame());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#arrowFunctionParameters.


  visitArrowFunctionParameters(ctx) {
    this.log(ctx, _trace.default.frame());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#arrowFunctionBody.


  visitArrowFunctionBody(ctx) {
    this.log(ctx, _trace.default.frame());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#assignmentOperator.


  visitAssignmentOperator(ctx) {
    this.log(ctx, _trace.default.frame());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#literal.


  visitLiteral(ctx) {
    this.log(ctx, _trace.default.frame());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#numericLiteral.


  visitNumericLiteral(ctx) {
    this.log(ctx, _trace.default.frame());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#bigintLiteral.


  visitBigintLiteral(ctx) {
    this.log(ctx, _trace.default.frame());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#getter.


  visitGetter(ctx) {
    this.log(ctx, _trace.default.frame());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#setter.


  visitSetter(ctx) {
    this.log(ctx, _trace.default.frame());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#identifierName.


  visitIdentifierName(ctx) {
    this.log(ctx, _trace.default.frame());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#identifier.


  visitIdentifier(ctx) {
    this.log(ctx, _trace.default.frame());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#reservedWord.


  visitReservedWord(ctx) {
    this.log(ctx, _trace.default.frame());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#keyword.


  visitKeyword(ctx) {
    this.log(ctx, _trace.default.frame());
    return this.visitChildren(ctx);
  } // Visit a parse tree produced by ECMAScriptParser#eos.


  visitEos(ctx) {
    this.log(ctx, _trace.default.frame());
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9QcmludFZpc2l0b3IudHMiXSwibmFtZXMiOlsiUHJpbnRWaXNpdG9yIiwiRGVsdmVuVmlzaXRvciIsImxvZyIsImN0eCIsImZyYW1lIiwiY29uc29sZSIsImluZm8iLCJmdW5jdGlvbiIsImdldENoaWxkQ291bnQiLCJnZXRUZXh0IiwidmlzaXRQcm9ncmFtIiwiVHJhY2UiLCJ2aXNpdENoaWxkcmVuIiwidmlzaXRTb3VyY2VFbGVtZW50IiwidmlzaXRTdGF0ZW1lbnQiLCJ2aXNpdEJsb2NrIiwidmlzaXRTdGF0ZW1lbnRMaXN0IiwidmlzaXRJbXBvcnRTdGF0ZW1lbnQiLCJ2aXNpdEltcG9ydEZyb21CbG9jayIsInZpc2l0TW9kdWxlSXRlbXMiLCJ2aXNpdEltcG9ydERlZmF1bHQiLCJ2aXNpdEltcG9ydE5hbWVzcGFjZSIsInZpc2l0SW1wb3J0RnJvbSIsInZpc2l0QWxpYXNOYW1lIiwidmlzaXRFeHBvcnREZWNsYXJhdGlvbiIsInZpc2l0RXhwb3J0RGVmYXVsdERlY2xhcmF0aW9uIiwidmlzaXRFeHBvcnRGcm9tQmxvY2siLCJ2aXNpdERlY2xhcmF0aW9uIiwidmlzaXRWYXJpYWJsZVN0YXRlbWVudCIsInZpc2l0VmFyaWFibGVEZWNsYXJhdGlvbkxpc3QiLCJ2aXNpdFZhcmlhYmxlRGVjbGFyYXRpb24iLCJ2aXNpdEVtcHR5U3RhdGVtZW50IiwidmlzaXRFeHByZXNzaW9uU3RhdGVtZW50IiwidmlzaXRJZlN0YXRlbWVudCIsInZpc2l0RG9TdGF0ZW1lbnQiLCJ2aXNpdFdoaWxlU3RhdGVtZW50IiwidmlzaXRGb3JTdGF0ZW1lbnQiLCJ2aXNpdEZvckluU3RhdGVtZW50IiwidmlzaXRGb3JPZlN0YXRlbWVudCIsInZpc2l0VmFyTW9kaWZpZXIiLCJ2aXNpdENvbnRpbnVlU3RhdGVtZW50IiwidmlzaXRCcmVha1N0YXRlbWVudCIsInZpc2l0UmV0dXJuU3RhdGVtZW50IiwidmlzaXRZaWVsZFN0YXRlbWVudCIsInZpc2l0V2l0aFN0YXRlbWVudCIsInZpc2l0U3dpdGNoU3RhdGVtZW50IiwidmlzaXRDYXNlQmxvY2siLCJ2aXNpdENhc2VDbGF1c2VzIiwidmlzaXRDYXNlQ2xhdXNlIiwidmlzaXREZWZhdWx0Q2xhdXNlIiwidmlzaXRMYWJlbGxlZFN0YXRlbWVudCIsInZpc2l0VGhyb3dTdGF0ZW1lbnQiLCJ2aXNpdFRyeVN0YXRlbWVudCIsInZpc2l0Q2F0Y2hQcm9kdWN0aW9uIiwidmlzaXRGaW5hbGx5UHJvZHVjdGlvbiIsInZpc2l0RGVidWdnZXJTdGF0ZW1lbnQiLCJ2aXNpdEZ1bmN0aW9uRGVjbGFyYXRpb24iLCJ2aXNpdENsYXNzRGVjbGFyYXRpb24iLCJ2aXNpdENsYXNzVGFpbCIsInZpc2l0Q2xhc3NFbGVtZW50IiwidmlzaXRNZXRob2REZWZpbml0aW9uIiwidmlzaXRGb3JtYWxQYXJhbWV0ZXJMaXN0IiwidmlzaXRGb3JtYWxQYXJhbWV0ZXJBcmciLCJ2aXNpdExhc3RGb3JtYWxQYXJhbWV0ZXJBcmciLCJ2aXNpdEZ1bmN0aW9uQm9keSIsInZpc2l0U291cmNlRWxlbWVudHMiLCJ2aXNpdEFycmF5TGl0ZXJhbCIsInZpc2l0RWxlbWVudExpc3QiLCJ2aXNpdEFycmF5RWxlbWVudCIsInZpc2l0UHJvcGVydHlFeHByZXNzaW9uQXNzaWdubWVudCIsInZpc2l0Q29tcHV0ZWRQcm9wZXJ0eUV4cHJlc3Npb25Bc3NpZ25tZW50IiwidmlzaXRGdW5jdGlvblByb3BlcnR5IiwidmlzaXRQcm9wZXJ0eUdldHRlciIsInZpc2l0UHJvcGVydHlTZXR0ZXIiLCJ2aXNpdFByb3BlcnR5U2hvcnRoYW5kIiwidmlzaXRQcm9wZXJ0eU5hbWUiLCJ2aXNpdEFyZ3VtZW50cyIsInZpc2l0QXJndW1lbnQiLCJ2aXNpdEV4cHJlc3Npb25TZXF1ZW5jZSIsInZpc2l0VGVtcGxhdGVTdHJpbmdFeHByZXNzaW9uIiwidmlzaXRUZXJuYXJ5RXhwcmVzc2lvbiIsInZpc2l0TG9naWNhbEFuZEV4cHJlc3Npb24iLCJ2aXNpdFBvd2VyRXhwcmVzc2lvbiIsInZpc2l0UHJlSW5jcmVtZW50RXhwcmVzc2lvbiIsInZpc2l0T2JqZWN0TGl0ZXJhbEV4cHJlc3Npb24iLCJ2aXNpdE1ldGFFeHByZXNzaW9uIiwidmlzaXRJbkV4cHJlc3Npb24iLCJ2aXNpdExvZ2ljYWxPckV4cHJlc3Npb24iLCJ2aXNpdE5vdEV4cHJlc3Npb24iLCJ2aXNpdFByZURlY3JlYXNlRXhwcmVzc2lvbiIsInZpc2l0QXJndW1lbnRzRXhwcmVzc2lvbiIsInZpc2l0QXdhaXRFeHByZXNzaW9uIiwidmlzaXRUaGlzRXhwcmVzc2lvbiIsInZpc2l0RnVuY3Rpb25FeHByZXNzaW9uIiwidmlzaXRVbmFyeU1pbnVzRXhwcmVzc2lvbiIsInZpc2l0QXNzaWdubWVudEV4cHJlc3Npb24iLCJ2aXNpdFBvc3REZWNyZWFzZUV4cHJlc3Npb24iLCJ2aXNpdFR5cGVvZkV4cHJlc3Npb24iLCJ2aXNpdEluc3RhbmNlb2ZFeHByZXNzaW9uIiwidmlzaXRVbmFyeVBsdXNFeHByZXNzaW9uIiwidmlzaXREZWxldGVFeHByZXNzaW9uIiwidmlzaXRJbXBvcnRFeHByZXNzaW9uIiwidmlzaXRFcXVhbGl0eUV4cHJlc3Npb24iLCJ2aXNpdEJpdFhPckV4cHJlc3Npb24iLCJ2aXNpdFN1cGVyRXhwcmVzc2lvbiIsInZpc2l0TXVsdGlwbGljYXRpdmVFeHByZXNzaW9uIiwidmlzaXRCaXRTaGlmdEV4cHJlc3Npb24iLCJ2aXNpdFBhcmVudGhlc2l6ZWRFeHByZXNzaW9uIiwidmlzaXRBZGRpdGl2ZUV4cHJlc3Npb24iLCJ2aXNpdFJlbGF0aW9uYWxFeHByZXNzaW9uIiwidmlzaXRQb3N0SW5jcmVtZW50RXhwcmVzc2lvbiIsInZpc2l0WWllbGRFeHByZXNzaW9uIiwidmlzaXRCaXROb3RFeHByZXNzaW9uIiwidmlzaXROZXdFeHByZXNzaW9uIiwidmlzaXRMaXRlcmFsRXhwcmVzc2lvbiIsInZpc2l0QXJyYXlMaXRlcmFsRXhwcmVzc2lvbiIsInZpc2l0TWVtYmVyRG90RXhwcmVzc2lvbiIsInZpc2l0Q2xhc3NFeHByZXNzaW9uIiwidmlzaXRNZW1iZXJJbmRleEV4cHJlc3Npb24iLCJ2aXNpdElkZW50aWZpZXJFeHByZXNzaW9uIiwidmlzaXRCaXRBbmRFeHByZXNzaW9uIiwidmlzaXRCaXRPckV4cHJlc3Npb24iLCJ2aXNpdEFzc2lnbm1lbnRPcGVyYXRvckV4cHJlc3Npb24iLCJ2aXNpdFZvaWRFeHByZXNzaW9uIiwidmlzaXRDb2FsZXNjZUV4cHJlc3Npb24iLCJ2aXNpdEFzc2lnbmFibGUiLCJ2aXNpdE9iamVjdExpdGVyYWwiLCJ2aXNpdEZ1bmN0aW9uRGVjbCIsInZpc2l0QW5veW1vdXNGdW5jdGlvbkRlY2wiLCJ2aXNpdEFycm93RnVuY3Rpb24iLCJ2aXNpdEFycm93RnVuY3Rpb25QYXJhbWV0ZXJzIiwidmlzaXRBcnJvd0Z1bmN0aW9uQm9keSIsInZpc2l0QXNzaWdubWVudE9wZXJhdG9yIiwidmlzaXRMaXRlcmFsIiwidmlzaXROdW1lcmljTGl0ZXJhbCIsInZpc2l0QmlnaW50TGl0ZXJhbCIsInZpc2l0R2V0dGVyIiwidmlzaXRTZXR0ZXIiLCJ2aXNpdElkZW50aWZpZXJOYW1lIiwidmlzaXRJZGVudGlmaWVyIiwidmlzaXRSZXNlcnZlZFdvcmQiLCJ2aXNpdEtleXdvcmQiLCJ2aXNpdEVvcyIsInZpc2l0Q2hpbGRyZW5YWCIsImNoaWxkcmVuIiwibWFwIiwiY2hpbGQiLCJsZW5ndGgiLCJhY2NlcHQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFFQTs7OztBQUVPLE1BQU1BLFlBQU4sU0FBMkJDLGdEQUEzQixDQUF5QztBQUU5Q0MsRUFBQUEsR0FBRyxDQUFDQyxHQUFELEVBQW1CQyxLQUFuQixFQUFvQztBQUNyQ0MsSUFBQUEsT0FBTyxDQUFDQyxJQUFSLENBQWEsY0FBYixFQUE2QkYsS0FBSyxDQUFDRyxRQUFuQyxFQUE2Q0osR0FBRyxDQUFDSyxhQUFKLEVBQTdDLEVBQWtFTCxHQUFHLENBQUNNLE9BQUosRUFBbEU7QUFDRCxHQUo2QyxDQU05Qzs7O0FBQ0FDLEVBQUFBLFlBQVksQ0FB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SyxDQUFDekksT0FBTixFQUFQO0FBQ0Q7QUFDRixPQU5NLENBQVA7QUFPRDtBQUNGOztBQXo2QjZDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRUNNQVNjcmlwdFBhcnNlclZpc2l0b3IgYXMgRGVsdmVuVmlzaXRvciB9IGZyb20gXCIuL3BhcnNlci9FQ01BU2NyaXB0UGFyc2VyVmlzaXRvclwiXG5pbXBvcnQgeyBSdWxlQ29udGV4dCB9IGZyb20gXCJhbnRscjQvUnVsZUNvbnRleHRcIlxuaW1wb3J0IFRyYWNlLCB7IENhbGxTaXRlIH0gZnJvbSBcIi4vdHJhY2VcIlxuXG5leHBvcnQgY2xhc3MgUHJpbnRWaXNpdG9yIGV4dGVuZHMgRGVsdmVuVmlzaXRvciB7XG5cbiAgbG9nKGN0eDogUnVsZUNvbnRleHQsIGZyYW1lOiBDYWxsU2l0ZSkge1xuICAgIGNvbnNvbGUuaW5mbyhcIiVzIFslc10gOiAlc1wiLCBmcmFtZS5mdW5jdGlvbiwgY3R4LmdldENoaWxkQ291bnQoKSwgY3R4LmdldFRleHQoKSk7XG4gIH1cblxuICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNwcm9ncmFtLlxuICB2aXNpdFByb2dyYW0oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgIHRoaXMubG9nKGN0eCwgVHJhY2UuZnJhbWUoKSk7XG4gICAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICB9XG5cblxuICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNzb3VyY2VFbGVtZW50LlxuICB2aXNpdFNvdXJjZUVsZW1lbnQoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgIHRoaXMubG9nKGN0eCwgVHJhY2UuZnJhbWUoKSk7XG4gICAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICB9XG5cblxuICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNzdGF0ZW1lbnQuXG4gIHZpc2l0U3RhdGVtZW50KGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICB0aGlzLmxvZyhjdHgsIFRyYWNlLmZyYW1lKCkpO1xuICAgIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgfVxuXG5cbiAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjYmxvY2suXG4gIHZpc2l0QmxvY2soY3R4OiBSdWxlQ29udGV4dCkge1xuICAgIHRoaXMubG9nKGN0eCwgVHJhY2UuZnJhbWUoKSk7XG4gICAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICB9XG5cblxuICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNzdGF0ZW1lbnRMaXN0LlxuICB2aXNpdFN0YXRlbWVudExpc3QoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgIHRoaXMubG9nKGN0eCwgVHJhY2UuZnJhbWUoKSk7XG4gICAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICB9XG5cblxuICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNpbXBvcnRTdGF0ZW1lbnQuXG4gIHZpc2l0SW1wb3J0U3RhdGVtZW50KGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICB0aGlzLmxvZyhjdHgsIFRyYWNlLmZyYW1lKCkpO1xuICAgIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgfVxuXG5cbiAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjaW1wb3J0RnJvbUJsb2NrLlxuICB2aXNpdEltcG9ydEZyb21CbG9jayhjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgdGhpcy5sb2coY3R4LCBUcmFjZS5mcmFtZSgpKTtcbiAgICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gIH1cblxuXG4gIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI21vZHVsZUl0ZW1zLlxuICB2aXNpdE1vZHVsZUl0ZW1zKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICB0aGlzLmxvZyhjdHgsIFRyYWNlLmZyYW1lKCkpO1xuICAgIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgfVxuXG5cbiAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjaW1wb3J0RGVmYXVsdC5cbiAgdmlzaXRJbXBvcnREZWZhdWx0KGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICB0aGlzLmxvZyhjdHgsIFRyYWNlLmZyYW1lKCkpO1xuICAgIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgfVxuXG5cbiAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjaW1wb3J0TmFtZXNwYWNlLlxuICB2aXNpdEltcG9ydE5hbWVzcGFjZShjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgdGhpcy5sb2coY3R4LCBUcmFjZS5mcmFtZSgpKTtcbiAgICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gIH1cblxuXG4gIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2ltcG9ydEZyb20uXG4gIHZpc2l0SW1wb3J0RnJvbShjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgdGhpcy5sb2coY3R4LCBUcmFjZS5mcmFtZSgpKTtcbiAgICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gIH1cblxuXG4gIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2FsaWFzTmFtZS5cbiAgdmlzaXRBbGlhc05hbWUoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgIHRoaXMubG9nKGN0eCwgVHJhY2UuZnJhbWUoKSk7XG4gICAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICB9XG5cblxuICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNFeHBvcnREZWNsYXJhdGlvbi5cbiAgdmlzaXRFeHBvcnREZWNsYXJhdGlvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgdGhpcy5sb2coY3R4LCBUcmFjZS5mcmFtZSgpKTtcbiAgICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gIH1cblxuXG4gIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI0V4cG9ydERlZmF1bHREZWNsYXJhdGlvbi5cbiAgdmlzaXRFeHBvcnREZWZhdWx0RGVjbGFyYXRpb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgIHRoaXMubG9nKGN0eCwgVHJhY2UuZnJhbWUoKSk7XG4gICAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICB9XG5cblxuICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNleHBvcnRGcm9tQmxvY2suXG4gIHZpc2l0RXhwb3J0RnJvbUJsb2NrKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICB0aGlzLmxvZyhjdHgsIFRyYWNlLmZyYW1lKCkpO1xuICAgIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgfVxuXG5cbiAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjZGVjbGFyYXRpb24uXG4gIHZpc2l0RGVjbGFyYXRpb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgIHRoaXMubG9nKGN0eCwgVHJhY2UuZnJhbWUoKSk7XG4gICAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICB9XG5cblxuICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciN2YXJpYWJsZVN0YXRlbWVudC5cbiAgdmlzaXRWYXJpYWJsZVN0YXRlbWVudChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgdGhpcy5sb2coY3R4LCBUcmFjZS5mcmFtZSgpKTtcbiAgICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gIH1cblxuXG4gIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI3ZhcmlhYmxlRGVjbGFyYXRpb25MaXN0LlxuICB2aXNpdFZhcmlhYmxlRGVjbGFyYXRpb25MaXN0KGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICB0aGlzLmxvZyhjdHgsIFRyYWNlLmZyYW1lKCkpO1xuICAgIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgfVxuXG5cbiAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjdmFyaWFibGVEZWNsYXJhdGlvbi5cbiAgdmlzaXRWYXJpYWJsZURlY2xhcmF0aW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICB0aGlzLmxvZyhjdHgsIFRyYWNlLmZyYW1lKCkpO1xuICAgIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgfVxuXG5cbiAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjZW1wdHlTdGF0ZW1lbnQuXG4gIHZpc2l0RW1wdHlTdGF0ZW1lbnQoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgIHRoaXMubG9nKGN0eCwgVHJhY2UuZnJhbWUoKSk7XG4gICAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICB9XG5cblxuICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNleHByZXNzaW9uU3RhdGVtZW50LlxuICB2aXNpdEV4cHJlc3Npb25TdGF0ZW1lbnQoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgIHRoaXMubG9nKGN0eCwgVHJhY2UuZnJhbWUoKSk7XG4gICAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICB9XG5cblxuICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNpZlN0YXRlbWVudC5cbiAgdmlzaXRJZlN0YXRlbWVudChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgdGhpcy5sb2coY3R4LCBUcmFjZS5mcmFtZSgpKTtcbiAgICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gIH1cblxuXG4gIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI0RvU3RhdGVtZW50LlxuICB2aXNpdERvU3RhdGVtZW50KGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICB0aGlzLmxvZyhjdHgsIFRyYWNlLmZyYW1lKCkpO1xuICAgIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgfVxuXG5cbiAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjV2hpbGVTdGF0ZW1lbnQuXG4gIHZpc2l0V2hpbGVTdGF0ZW1lbnQoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgIHRoaXMubG9nKGN0eCwgVHJhY2UuZnJhbWUoKSk7XG4gICAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICB9XG5cblxuICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNGb3JTdGF0ZW1lbnQuXG4gIHZpc2l0Rm9yU3RhdGVtZW50KGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICB0aGlzLmxvZyhjdHgsIFRyYWNlLmZyYW1lKCkpO1xuICAgIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgfVxuXG5cbiAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjRm9ySW5TdGF0ZW1lbnQuXG4gIHZpc2l0Rm9ySW5TdGF0ZW1lbnQoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgIHRoaXMubG9nKGN0eCwgVHJhY2UuZnJhbWUoKSk7XG4gICAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICB9XG5cblxuICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNGb3JPZlN0YXRlbWVudC5cbiAgdmlzaXRGb3JPZlN0YXRlbWVudChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgdGhpcy5sb2coY3R4LCBUcmFjZS5mcmFtZSgpKTtcbiAgICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gIH1cblxuXG4gIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI3Zhck1vZGlmaWVyLlxuICB2aXNpdFZhck1vZGlmaWVyKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICB0aGlzLmxvZyhjdHgsIFRyYWNlLmZyYW1lKCkpO1xuICAgIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgfVxuXG5cbiAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjY29udGludWVTdGF0ZW1lbnQuXG4gIHZpc2l0Q29udGludWVTdGF0ZW1lbnQoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgIHRoaXMubG9nKGN0eCwgVHJhY2UuZnJhbWUoKSk7XG4gICAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICB9XG5cblxuICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNicmVha1N0YXRlbWVudC5cbiAgdmlzaXRCcmVha1N0YXRlbWVudChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgdGhpcy5sb2coY3R4LCBUcmFjZS5mcmFtZSgpKTtcbiAgICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gIH1cblxuXG4gIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI3JldHVyblN0YXRlbWVudC5cbiAgdmlzaXRSZXR1cm5TdGF0ZW1lbnQoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgIHRoaXMubG9nKGN0eCwgVHJhY2UuZnJhbWUoKSk7XG4gICAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICB9XG5cblxuICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciN5aWVsZFN0YXRlbWVudC5cbiAgdmlzaXRZaWVsZFN0YXRlbWVudChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgdGhpcy5sb2coY3R4LCBUcmFjZS5mcmFtZSgpKTtcbiAgICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gIH1cblxuXG4gIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI3dpdGhTdGF0ZW1lbnQuXG4gIHZpc2l0V2l0aFN0YXRlbWVudChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgdGhpcy5sb2coY3R4LCBUcmFjZS5mcmFtZSgpKTtcbiAgICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gIH1cblxuXG4gIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI3N3aXRjaFN0YXRlbWVudC5cbiAgdmlzaXRTd2l0Y2hTdGF0ZW1lbnQoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgIHRoaXMubG9nKGN0eCwgVHJhY2UuZnJhbWUoKSk7XG4gICAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICB9XG5cblxuICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNjYXNlQmxvY2suXG4gIHZpc2l0Q2FzZUJsb2NrKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICB0aGlzLmxvZyhjdHgsIFRyYWNlLmZyYW1lKCkpO1xuICAgIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgfVxuXG5cbiAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjY2FzZUNsYXVzZXMuXG4gIHZpc2l0Q2FzZUNsYXVzZXMoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgIHRoaXMubG9nKGN0eCwgVHJhY2UuZnJhbWUoKSk7XG4gICAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICB9XG5cblxuICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNjYXNlQ2xhdXNlLlxuICB2aXNpdENhc2VDbGF1c2UoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgIHRoaXMubG9nKGN0eCwgVHJhY2UuZnJhbWUoKSk7XG4gICAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICB9XG5cblxuICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNkZWZhdWx0Q2xhdXNlLlxuICB2aXNpdERlZmF1bHRDbGF1c2UoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgIHRoaXMubG9nKGN0eCwgVHJhY2UuZnJhbWUoKSk7XG4gICAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICB9XG5cblxuICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNsYWJlbGxlZFN0YXRlbWVudC5cbiAgdmlzaXRMYWJlbGxlZFN0YXRlbWVudChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgdGhpcy5sb2coY3R4LCBUcmFjZS5mcmFtZSgpKTtcbiAgICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gIH1cblxuXG4gIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI3Rocm93U3RhdGVtZW50LlxuICB2aXNpdFRocm93U3RhdGVtZW50KGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICB0aGlzLmxvZyhjdHgsIFRyYWNlLmZyYW1lKCkpO1xuICAgIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgfVxuXG5cbiAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjdHJ5U3RhdGVtZW50LlxuICB2aXNpdFRyeVN0YXRlbWVudChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgdGhpcy5sb2coY3R4LCBUcmFjZS5mcmFtZSgpKTtcbiAgICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gIH1cblxuXG4gIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2NhdGNoUHJvZHVjdGlvbi5cbiAgdmlzaXRDYXRjaFByb2R1Y3Rpb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgIHRoaXMubG9nKGN0eCwgVHJhY2UuZnJhbWUoKSk7XG4gICAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICB9XG5cblxuICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNmaW5hbGx5UHJvZHVjdGlvbi5cbiAgdmlzaXRGaW5hbGx5UHJvZHVjdGlvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgdGhpcy5sb2coY3R4LCBUcmFjZS5mcmFtZSgpKTtcbiAgICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gIH1cblxuXG4gIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2RlYnVnZ2VyU3RhdGVtZW50LlxuICB2aXNpdERlYnVnZ2VyU3RhdGVtZW50KGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICB0aGlzLmxvZyhjdHgsIFRyYWNlLmZyYW1lKCkpO1xuICAgIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgfVxuXG5cbiAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjZnVuY3Rpb25EZWNsYXJhdGlvbi5cbiAgdmlzaXRGdW5jdGlvbkRlY2xhcmF0aW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICB0aGlzLmxvZyhjdHgsIFRyYWNlLmZyYW1lKCkpO1xuICAgIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgfVxuXG5cbiAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjY2xhc3NEZWNsYXJhdGlvbi5cbiAgdmlzaXRDbGFzc0RlY2xhcmF0aW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICB0aGlzLmxvZyhjdHgsIFRyYWNlLmZyYW1lKCkpO1xuICAgIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgfVxuXG5cbiAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjY2xhc3NUYWlsLlxuICB2aXNpdENsYXNzVGFpbChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgdGhpcy5sb2coY3R4LCBUcmFjZS5mcmFtZSgpKTtcbiAgICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gIH1cblxuXG4gIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2NsYXNzRWxlbWVudC5cbiAgdmlzaXRDbGFzc0VsZW1lbnQoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgIHRoaXMubG9nKGN0eCwgVHJhY2UuZnJhbWUoKSk7XG4gICAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICB9XG5cblxuICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNtZXRob2REZWZpbml0aW9uLlxuICB2aXNpdE1ldGhvZERlZmluaXRpb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgIHRoaXMubG9nKGN0eCwgVHJhY2UuZnJhbWUoKSk7XG4gICAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICB9XG5cblxuICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNmb3JtYWxQYXJhbWV0ZXJMaXN0LlxuICB2aXNpdEZvcm1hbFBhcmFtZXRlckxpc3QoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgIHRoaXMubG9nKGN0eCwgVHJhY2UuZnJhbWUoKSk7XG4gICAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICB9XG5cblxuICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNmb3JtYWxQYXJhbWV0ZXJBcmcuXG4gIHZpc2l0Rm9ybWFsUGFyYW1ldGVyQXJnKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICB0aGlzLmxvZyhjdHgsIFRyYWNlLmZyYW1lKCkpO1xuICAgIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgfVxuXG5cbiAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjbGFzdEZvcm1hbFBhcmFtZXRlckFyZy5cbiAgdmlzaXRMYXN0Rm9ybWFsUGFyYW1ldGVyQXJnKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICB0aGlzLmxvZyhjdHgsIFRyYWNlLmZyYW1lKCkpO1xuICAgIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgfVxuXG5cbiAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjZnVuY3Rpb25Cb2R5LlxuICB2aXNpdEZ1bmN0aW9uQm9keShjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgdGhpcy5sb2coY3R4LCBUcmFjZS5mcmFtZSgpKTtcbiAgICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gIH1cblxuXG4gIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI3NvdXJjZUVsZW1lbnRzLlxuICB2aXNpdFNvdXJjZUVsZW1lbnRzKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICB0aGlzLmxvZyhjdHgsIFRyYWNlLmZyYW1lKCkpO1xuICAgIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgfVxuXG5cbiAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjYXJyYXlMaXRlcmFsLlxuICB2aXNpdEFycmF5TGl0ZXJhbChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgdGhpcy5sb2coY3R4LCBUcmFjZS5mcmFtZSgpKTtcbiAgICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gIH1cblxuXG4gIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2VsZW1lbnRMaXN0LlxuICB2aXNpdEVsZW1lbnRMaXN0KGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICB0aGlzLmxvZyhjdHgsIFRyYWNlLmZyYW1lKCkpO1xuICAgIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgfVxuXG5cbiAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjYXJyYXlFbGVtZW50LlxuICB2aXNpdEFycmF5RWxlbWVudChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgdGhpcy5sb2coY3R4LCBUcmFjZS5mcmFtZSgpKTtcbiAgICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gIH1cblxuXG4gIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI1Byb3BlcnR5RXhwcmVzc2lvbkFzc2lnbm1lbnQuXG4gIHZpc2l0UHJvcGVydHlFeHByZXNzaW9uQXNzaWdubWVudChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgdGhpcy5sb2coY3R4LCBUcmFjZS5mcmFtZSgpKTtcbiAgICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gIH1cblxuXG4gIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI0NvbXB1dGVkUHJvcGVydHlFeHByZXNzaW9uQXNzaWdubWVudC5cbiAgdmlzaXRDb21wdXRlZFByb3BlcnR5RXhwcmVzc2lvbkFzc2lnbm1lbnQoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgIHRoaXMubG9nKGN0eCwgVHJhY2UuZnJhbWUoKSk7XG4gICAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICB9XG5cblxuICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNGdW5jdGlvblByb3BlcnR5LlxuICB2aXNpdEZ1bmN0aW9uUHJvcGVydHkoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgIHRoaXMubG9nKGN0eCwgVHJhY2UuZnJhbWUoKSk7XG4gICAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICB9XG5cblxuICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNQcm9wZXJ0eUdldHRlci5cbiAgdmlzaXRQcm9wZXJ0eUdldHRlcihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgdGhpcy5sb2coY3R4LCBUcmFjZS5mcmFtZSgpKTtcbiAgICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gIH1cblxuXG4gIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI1Byb3BlcnR5U2V0dGVyLlxuICB2aXNpdFByb3BlcnR5U2V0dGVyKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICB0aGlzLmxvZyhjdHgsIFRyYWNlLmZyYW1lKCkpO1xuICAgIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgfVxuXG5cbiAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjUHJvcGVydHlTaG9ydGhhbmQuXG4gIHZpc2l0UHJvcGVydHlTaG9ydGhhbmQoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgIHRoaXMubG9nKGN0eCwgVHJhY2UuZnJhbWUoKSk7XG4gICAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICB9XG5cblxuICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNwcm9wZXJ0eU5hbWUuXG4gIHZpc2l0UHJvcGVydHlOYW1lKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICB0aGlzLmxvZyhjdHgsIFRyYWNlLmZyYW1lKCkpO1xuICAgIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgfVxuXG5cbiAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjYXJndW1lbnRzLlxuICB2aXNpdEFyZ3VtZW50cyhjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgdGhpcy5sb2coY3R4LCBUcmFjZS5mcmFtZSgpKTtcbiAgICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gIH1cblxuXG4gIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2FyZ3VtZW50LlxuICB2aXNpdEFyZ3VtZW50KGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICB0aGlzLmxvZyhjdHgsIFRyYWNlLmZyYW1lKCkpO1xuICAgIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgfVxuXG5cbiAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjZXhwcmVzc2lvblNlcXVlbmNlLlxuICB2aXNpdEV4cHJlc3Npb25TZXF1ZW5jZShjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgdGhpcy5sb2coY3R4LCBUcmFjZS5mcmFtZSgpKTtcbiAgICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gIH1cblxuXG4gIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI1RlbXBsYXRlU3RyaW5nRXhwcmVzc2lvbi5cbiAgdmlzaXRUZW1wbGF0ZVN0cmluZ0V4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgIHRoaXMubG9nKGN0eCwgVHJhY2UuZnJhbWUoKSk7XG4gICAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICB9XG5cblxuICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNUZXJuYXJ5RXhwcmVzc2lvbi5cbiAgdmlzaXRUZXJuYXJ5RXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgdGhpcy5sb2coY3R4LCBUcmFjZS5mcmFtZSgpKTtcbiAgICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gIH1cblxuXG4gIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI0xvZ2ljYWxBbmRFeHByZXNzaW9uLlxuICB2aXNpdExvZ2ljYWxBbmRFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICB0aGlzLmxvZyhjdHgsIFRyYWNlLmZyYW1lKCkpO1xuICAgIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgfVxuXG5cbiAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjUG93ZXJFeHByZXNzaW9uLlxuICB2aXNpdFBvd2VyRXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgdGhpcy5sb2coY3R4LCBUcmFjZS5mcmFtZSgpKTtcbiAgICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gIH1cblxuXG4gIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI1ByZUluY3JlbWVudEV4cHJlc3Npb24uXG4gIHZpc2l0UHJlSW5jcmVtZW50RXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgdGhpcy5sb2coY3R4LCBUcmFjZS5mcmFtZSgpKTtcbiAgICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gIH1cblxuXG4gIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI09iamVjdExpdGVyYWxFeHByZXNzaW9uLlxuICB2aXNpdE9iamVjdExpdGVyYWxFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICB0aGlzLmxvZyhjdHgsIFRyYWNlLmZyYW1lKCkpO1xuICAgIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgfVxuXG5cbiAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjTWV0YUV4cHJlc3Npb24uXG4gIHZpc2l0TWV0YUV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgIHRoaXMubG9nKGN0eCwgVHJhY2UuZnJhbWUoKSk7XG4gICAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICB9XG5cblxuICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNJbkV4cHJlc3Npb24uXG4gIHZpc2l0SW5FeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICB0aGlzLmxvZyhjdHgsIFRyYWNlLmZyYW1lKCkpO1xuICAgIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgfVxuXG5cbiAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjTG9naWNhbE9yRXhwcmVzc2lvbi5cbiAgdmlzaXRMb2dpY2FsT3JFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICB0aGlzLmxvZyhjdHgsIFRyYWNlLmZyYW1lKCkpO1xuICAgIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgfVxuXG5cbiAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjTm90RXhwcmVzc2lvbi5cbiAgdmlzaXROb3RFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICB0aGlzLmxvZyhjdHgsIFRyYWNlLmZyYW1lKCkpO1xuICAgIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgfVxuXG5cbiAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjUHJlRGVjcmVhc2VFeHByZXNzaW9uLlxuICB2aXNpdFByZURlY3JlYXNlRXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgdGhpcy5sb2coY3R4LCBUcmFjZS5mcmFtZSgpKTtcbiAgICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gIH1cblxuXG4gIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI0FyZ3VtZW50c0V4cHJlc3Npb24uXG4gIHZpc2l0QXJndW1lbnRzRXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgdGhpcy5sb2coY3R4LCBUcmFjZS5mcmFtZSgpKTtcbiAgICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gIH1cblxuXG4gIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI0F3YWl0RXhwcmVzc2lvbi5cbiAgdmlzaXRBd2FpdEV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgIHRoaXMubG9nKGN0eCwgVHJhY2UuZnJhbWUoKSk7XG4gICAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICB9XG5cblxuICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNUaGlzRXhwcmVzc2lvbi5cbiAgdmlzaXRUaGlzRXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgdGhpcy5sb2coY3R4LCBUcmFjZS5mcmFtZSgpKTtcbiAgICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gIH1cblxuXG4gIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI0Z1bmN0aW9uRXhwcmVzc2lvbi5cbiAgdmlzaXRGdW5jdGlvbkV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgIHRoaXMubG9nKGN0eCwgVHJhY2UuZnJhbWUoKSk7XG4gICAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICB9XG5cblxuICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNVbmFyeU1pbnVzRXhwcmVzc2lvbi5cbiAgdmlzaXRVbmFyeU1pbnVzRXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgdGhpcy5sb2coY3R4LCBUcmFjZS5mcmFtZSgpKTtcbiAgICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gIH1cblxuXG4gIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI0Fzc2lnbm1lbnRFeHByZXNzaW9uLlxuICB2aXNpdEFzc2lnbm1lbnRFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICB0aGlzLmxvZyhjdHgsIFRyYWNlLmZyYW1lKCkpO1xuICAgIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgfVxuXG5cbiAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjUG9zdERlY3JlYXNlRXhwcmVzc2lvbi5cbiAgdmlzaXRQb3N0RGVjcmVhc2VFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICB0aGlzLmxvZyhjdHgsIFRyYWNlLmZyYW1lKCkpO1xuICAgIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgfVxuXG5cbiAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjVHlwZW9mRXhwcmVzc2lvbi5cbiAgdmlzaXRUeXBlb2ZFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICB0aGlzLmxvZyhjdHgsIFRyYWNlLmZyYW1lKCkpO1xuICAgIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgfVxuXG5cbiAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjSW5zdGFuY2VvZkV4cHJlc3Npb24uXG4gIHZpc2l0SW5zdGFuY2VvZkV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgIHRoaXMubG9nKGN0eCwgVHJhY2UuZnJhbWUoKSk7XG4gICAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICB9XG5cblxuICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNVbmFyeVBsdXNFeHByZXNzaW9uLlxuICB2aXNpdFVuYXJ5UGx1c0V4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgIHRoaXMubG9nKGN0eCwgVHJhY2UuZnJhbWUoKSk7XG4gICAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICB9XG5cblxuICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNEZWxldGVFeHByZXNzaW9uLlxuICB2aXNpdERlbGV0ZUV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgIHRoaXMubG9nKGN0eCwgVHJhY2UuZnJhbWUoKSk7XG4gICAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICB9XG5cblxuICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNJbXBvcnRFeHByZXNzaW9uLlxuICB2aXNpdEltcG9ydEV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgIHRoaXMubG9nKGN0eCwgVHJhY2UuZnJhbWUoKSk7XG4gICAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICB9XG5cblxuICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNFcXVhbGl0eUV4cHJlc3Npb24uXG4gIHZpc2l0RXF1YWxpdHlFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICB0aGlzLmxvZyhjdHgsIFRyYWNlLmZyYW1lKCkpO1xuICAgIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgfVxuXG5cbiAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjQml0WE9yRXhwcmVzc2lvbi5cbiAgdmlzaXRCaXRYT3JFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICB0aGlzLmxvZyhjdHgsIFRyYWNlLmZyYW1lKCkpO1xuICAgIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgfVxuXG5cbiAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjU3VwZXJFeHByZXNzaW9uLlxuICB2aXNpdFN1cGVyRXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgdGhpcy5sb2coY3R4LCBUcmFjZS5mcmFtZSgpKTtcbiAgICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gIH1cblxuXG4gIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI011bHRpcGxpY2F0aXZlRXhwcmVzc2lvbi5cbiAgdmlzaXRNdWx0aXBsaWNhdGl2ZUV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgIHRoaXMubG9nKGN0eCwgVHJhY2UuZnJhbWUoKSk7XG4gICAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICB9XG5cblxuICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNCaXRTaGlmdEV4cHJlc3Npb24uXG4gIHZpc2l0Qml0U2hpZnRFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICB0aGlzLmxvZyhjdHgsIFRyYWNlLmZyYW1lKCkpO1xuICAgIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgfVxuXG5cbiAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjUGFyZW50aGVzaXplZEV4cHJlc3Npb24uXG4gIHZpc2l0UGFyZW50aGVzaXplZEV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgIHRoaXMubG9nKGN0eCwgVHJhY2UuZnJhbWUoKSk7XG4gICAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICB9XG5cblxuICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNBZGRpdGl2ZUV4cHJlc3Npb24uXG4gIHZpc2l0QWRkaXRpdmVFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICB0aGlzLmxvZyhjdHgsIFRyYWNlLmZyYW1lKCkpO1xuICAgIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgfVxuXG5cbiAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjUmVsYXRpb25hbEV4cHJlc3Npb24uXG4gIHZpc2l0UmVsYXRpb25hbEV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgIHRoaXMubG9nKGN0eCwgVHJhY2UuZnJhbWUoKSk7XG4gICAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICB9XG5cblxuICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNQb3N0SW5jcmVtZW50RXhwcmVzc2lvbi5cbiAgdmlzaXRQb3N0SW5jcmVtZW50RXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgdGhpcy5sb2coY3R4LCBUcmFjZS5mcmFtZSgpKTtcbiAgICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gIH1cblxuXG4gIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI1lpZWxkRXhwcmVzc2lvbi5cbiAgdmlzaXRZaWVsZEV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgIHRoaXMubG9nKGN0eCwgVHJhY2UuZnJhbWUoKSk7XG4gICAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICB9XG5cblxuICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNCaXROb3RFeHByZXNzaW9uLlxuICB2aXNpdEJpdE5vdEV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgIHRoaXMubG9nKGN0eCwgVHJhY2UuZnJhbWUoKSk7XG4gICAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICB9XG5cblxuICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNOZXdFeHByZXNzaW9uLlxuICB2aXNpdE5ld0V4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgIHRoaXMubG9nKGN0eCwgVHJhY2UuZnJhbWUoKSk7XG4gICAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICB9XG5cblxuICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNMaXRlcmFsRXhwcmVzc2lvbi5cbiAgdmlzaXRMaXRlcmFsRXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgdGhpcy5sb2coY3R4LCBUcmFjZS5mcmFtZSgpKTtcbiAgICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gIH1cblxuXG4gIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI0FycmF5TGl0ZXJhbEV4cHJlc3Npb24uXG4gIHZpc2l0QXJyYXlMaXRlcmFsRXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgdGhpcy5sb2coY3R4LCBUcmFjZS5mcmFtZSgpKTtcbiAgICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gIH1cblxuXG4gIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI01lbWJlckRvdEV4cHJlc3Npb24uXG4gIHZpc2l0TWVtYmVyRG90RXhwcmVzc2lvbihjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgdGhpcy5sb2coY3R4LCBUcmFjZS5mcmFtZSgpKTtcbiAgICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gIH1cblxuXG4gIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI0NsYXNzRXhwcmVzc2lvbi5cbiAgdmlzaXRDbGFzc0V4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgIHRoaXMubG9nKGN0eCwgVHJhY2UuZnJhbWUoKSk7XG4gICAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICB9XG5cblxuICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNNZW1iZXJJbmRleEV4cHJlc3Npb24uXG4gIHZpc2l0TWVtYmVySW5kZXhFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICB0aGlzLmxvZyhjdHgsIFRyYWNlLmZyYW1lKCkpO1xuICAgIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgfVxuXG5cbiAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjSWRlbnRpZmllckV4cHJlc3Npb24uXG4gIHZpc2l0SWRlbnRpZmllckV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgIHRoaXMubG9nKGN0eCwgVHJhY2UuZnJhbWUoKSk7XG4gICAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICB9XG5cblxuICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNCaXRBbmRFeHByZXNzaW9uLlxuICB2aXNpdEJpdEFuZEV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgIHRoaXMubG9nKGN0eCwgVHJhY2UuZnJhbWUoKSk7XG4gICAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICB9XG5cblxuICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNCaXRPckV4cHJlc3Npb24uXG4gIHZpc2l0Qml0T3JFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICB0aGlzLmxvZyhjdHgsIFRyYWNlLmZyYW1lKCkpO1xuICAgIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgfVxuXG5cbiAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjQXNzaWdubWVudE9wZXJhdG9yRXhwcmVzc2lvbi5cbiAgdmlzaXRBc3NpZ25tZW50T3BlcmF0b3JFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICB0aGlzLmxvZyhjdHgsIFRyYWNlLmZyYW1lKCkpO1xuICAgIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgfVxuXG5cbiAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjVm9pZEV4cHJlc3Npb24uXG4gIHZpc2l0Vm9pZEV4cHJlc3Npb24oY3R4OiBSdWxlQ29udGV4dCkge1xuICAgIHRoaXMubG9nKGN0eCwgVHJhY2UuZnJhbWUoKSk7XG4gICAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICB9XG5cblxuICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNDb2FsZXNjZUV4cHJlc3Npb24uXG4gIHZpc2l0Q29hbGVzY2VFeHByZXNzaW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICB0aGlzLmxvZyhjdHgsIFRyYWNlLmZyYW1lKCkpO1xuICAgIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgfVxuXG5cbiAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjYXNzaWduYWJsZS5cbiAgdmlzaXRBc3NpZ25hYmxlKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICB0aGlzLmxvZyhjdHgsIFRyYWNlLmZyYW1lKCkpO1xuICAgIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgfVxuXG5cbiAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjb2JqZWN0TGl0ZXJhbC5cbiAgdmlzaXRPYmplY3RMaXRlcmFsKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICB0aGlzLmxvZyhjdHgsIFRyYWNlLmZyYW1lKCkpO1xuICAgIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgfVxuXG5cbiAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjRnVuY3Rpb25EZWNsLlxuICB2aXNpdEZ1bmN0aW9uRGVjbChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgdGhpcy5sb2coY3R4LCBUcmFjZS5mcmFtZSgpKTtcbiAgICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gIH1cblxuXG4gIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI0Fub3ltb3VzRnVuY3Rpb25EZWNsLlxuICB2aXNpdEFub3ltb3VzRnVuY3Rpb25EZWNsKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICB0aGlzLmxvZyhjdHgsIFRyYWNlLmZyYW1lKCkpO1xuICAgIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgfVxuXG5cbiAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjQXJyb3dGdW5jdGlvbi5cbiAgdmlzaXRBcnJvd0Z1bmN0aW9uKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICB0aGlzLmxvZyhjdHgsIFRyYWNlLmZyYW1lKCkpO1xuICAgIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgfVxuXG5cbiAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjYXJyb3dGdW5jdGlvblBhcmFtZXRlcnMuXG4gIHZpc2l0QXJyb3dGdW5jdGlvblBhcmFtZXRlcnMoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgIHRoaXMubG9nKGN0eCwgVHJhY2UuZnJhbWUoKSk7XG4gICAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICB9XG5cblxuICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNhcnJvd0Z1bmN0aW9uQm9keS5cbiAgdmlzaXRBcnJvd0Z1bmN0aW9uQm9keShjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgdGhpcy5sb2coY3R4LCBUcmFjZS5mcmFtZSgpKTtcbiAgICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gIH1cblxuXG4gIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2Fzc2lnbm1lbnRPcGVyYXRvci5cbiAgdmlzaXRBc3NpZ25tZW50T3BlcmF0b3IoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgIHRoaXMubG9nKGN0eCwgVHJhY2UuZnJhbWUoKSk7XG4gICAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICB9XG5cblxuICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNsaXRlcmFsLlxuICB2aXNpdExpdGVyYWwoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgIHRoaXMubG9nKGN0eCwgVHJhY2UuZnJhbWUoKSk7XG4gICAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICB9XG5cblxuICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNudW1lcmljTGl0ZXJhbC5cbiAgdmlzaXROdW1lcmljTGl0ZXJhbChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgdGhpcy5sb2coY3R4LCBUcmFjZS5mcmFtZSgpKTtcbiAgICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gIH1cblxuXG4gIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2JpZ2ludExpdGVyYWwuXG4gIHZpc2l0QmlnaW50TGl0ZXJhbChjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgdGhpcy5sb2coY3R4LCBUcmFjZS5mcmFtZSgpKTtcbiAgICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gIH1cblxuXG4gIC8vIFZpc2l0IGEgcGFyc2UgdHJlZSBwcm9kdWNlZCBieSBFQ01BU2NyaXB0UGFyc2VyI2dldHRlci5cbiAgdmlzaXRHZXR0ZXIoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgIHRoaXMubG9nKGN0eCwgVHJhY2UuZnJhbWUoKSk7XG4gICAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICB9XG5cblxuICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNzZXR0ZXIuXG4gIHZpc2l0U2V0dGVyKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICB0aGlzLmxvZyhjdHgsIFRyYWNlLmZyYW1lKCkpO1xuICAgIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgfVxuXG5cbiAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjaWRlbnRpZmllck5hbWUuXG4gIHZpc2l0SWRlbnRpZmllck5hbWUoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgIHRoaXMubG9nKGN0eCwgVHJhY2UuZnJhbWUoKSk7XG4gICAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICB9XG5cblxuICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNpZGVudGlmaWVyLlxuICB2aXNpdElkZW50aWZpZXIoY3R4OiBSdWxlQ29udGV4dCkge1xuICAgIHRoaXMubG9nKGN0eCwgVHJhY2UuZnJhbWUoKSk7XG4gICAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjdHgpO1xuICB9XG5cblxuICAvLyBWaXNpdCBhIHBhcnNlIHRyZWUgcHJvZHVjZWQgYnkgRUNNQVNjcmlwdFBhcnNlciNyZXNlcnZlZFdvcmQuXG4gIHZpc2l0UmVzZXJ2ZWRXb3JkKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICB0aGlzLmxvZyhjdHgsIFRyYWNlLmZyYW1lKCkpO1xuICAgIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgfVxuXG5cbiAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIja2V5d29yZC5cbiAgdmlzaXRLZXl3b3JkKGN0eDogUnVsZUNvbnRleHQpIHtcbiAgICB0aGlzLmxvZyhjdHgsIFRyYWNlLmZyYW1lKCkpO1xuICAgIHJldHVybiB0aGlzLnZpc2l0Q2hpbGRyZW4oY3R4KTtcbiAgfVxuXG5cbiAgLy8gVmlzaXQgYSBwYXJzZSB0cmVlIHByb2R1Y2VkIGJ5IEVDTUFTY3JpcHRQYXJzZXIjZW9zLlxuICB2aXNpdEVvcyhjdHg6IFJ1bGVDb250ZXh0KSB7XG4gICAgdGhpcy5sb2coY3R4LCBUcmFjZS5mcmFtZSgpKTtcbiAgICByZXR1cm4gdGhpcy52aXNpdENoaWxkcmVuKGN0eCk7XG4gIH1cblxuICB2aXNpdENoaWxkcmVuWFgoY3R4KSB7XG4gICAgY29uc29sZS5pbmZvKFwiQ29udGV4dCA6XCIgKyBjdHguZ2V0VGV4dCgpKVxuICAgIGlmICghY3R4KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKGN0eC5jaGlsZHJlbikge1xuICAgICAgcmV0dXJuIGN0eC5jaGlsZHJlbi5tYXAoY2hpbGQgPT4ge1xuICAgICAgICBpZiAoY2hpbGQuY2hpbGRyZW4gJiYgY2hpbGQuY2hpbGRyZW4ubGVuZ3RoICE9IDApIHtcbiAgICAgICAgICByZXR1cm4gY2hpbGQuYWNjZXB0KHRoaXMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBjaGlsZC5nZXRUZXh0KCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxufSJdfQ==