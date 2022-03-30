declare class ECMAScriptParser extends ECMAScriptParserBase {
    static grammarFileName: string;
    static literalNames: (string | null)[];
    static symbolicNames: (string | null)[];
    static ruleNames: string[];
    constructor(input: any);
    _interp: any;
    ruleNames: string[];
    literalNames: (string | null)[];
    symbolicNames: (string | null)[];
    get atn(): any;
    sempred(localctx: any, ruleIndex: any, predIndex: any): any;
    expressionStatement_sempred(localctx: any, predIndex: any): boolean;
    iterationStatement_sempred(localctx: any, predIndex: any): boolean;
    continueStatement_sempred(localctx: any, predIndex: any): boolean;
    breakStatement_sempred(localctx: any, predIndex: any): boolean;
    returnStatement_sempred(localctx: any, predIndex: any): boolean;
    throwStatement_sempred(localctx: any, predIndex: any): boolean;
    classElement_sempred(localctx: any, predIndex: any): boolean;
    singleExpression_sempred(localctx: any, predIndex: any): any;
    getter_sempred(localctx: any, predIndex: any): boolean;
    setter_sempred(localctx: any, predIndex: any): boolean;
    eos_sempred(localctx: any, predIndex: any): any;
    program(): ProgramContext;
    state: number | undefined;
    sourceElement(): SourceElementContext;
    statement(): StatementContext;
    block(): BlockContext;
    statementList(): StatementListContext;
    importStatement(): ImportStatementContext;
    importFromBlock(): ImportFromBlockContext;
    moduleItems(): ModuleItemsContext;
    importDefault(): ImportDefaultContext;
    importNamespace(): ImportNamespaceContext;
    importFrom(): ImportFromContext;
    aliasName(): AliasNameContext;
    exportStatement(): ExportStatementContext;
    exportFromBlock(): ExportFromBlockContext;
    declaration(): DeclarationContext;
    variableStatement(): VariableStatementContext;
    variableDeclarationList(): VariableDeclarationListContext;
    variableDeclaration(): VariableDeclarationContext;
    emptyStatement(): EmptyStatementContext;
    expressionStatement(): ExpressionStatementContext;
    ifStatement(): IfStatementContext;
    iterationStatement(): IterationStatementContext;
    varModifier(): VarModifierContext;
    continueStatement(): ContinueStatementContext;
    breakStatement(): BreakStatementContext;
    returnStatement(): ReturnStatementContext;
    withStatement(): WithStatementContext;
    switchStatement(): SwitchStatementContext;
    caseBlock(): CaseBlockContext;
    caseClauses(): CaseClausesContext;
    caseClause(): CaseClauseContext;
    defaultClause(): DefaultClauseContext;
    labelledStatement(): LabelledStatementContext;
    throwStatement(): ThrowStatementContext;
    tryStatement(): TryStatementContext;
    catchProduction(): CatchProductionContext;
    finallyProduction(): FinallyProductionContext;
    debuggerStatement(): DebuggerStatementContext;
    functionDeclaration(): FunctionDeclarationContext;
    classDeclaration(): ClassDeclarationContext;
    classTail(): ClassTailContext;
    classHeritage(): ClassHeritageContext;
    classElement(): ClassElementContext;
    methodDefinition(): MethodDefinitionContext;
    formalParameterList(): FormalParameterListContext;
    formalParameterArg(): FormalParameterArgContext;
    lastFormalParameterArg(): LastFormalParameterArgContext;
    functionBody(): FunctionBodyContext;
    sourceElements(): SourceElementsContext;
    arrayLiteral(): ArrayLiteralContext;
    elementList(): ElementListContext;
    arrayElement(): ArrayElementContext;
    propertyAssignment(): PropertyAssignmentContext;
    propertyName(): PropertyNameContext;
    arguments(): ArgumentsContext;
    argument(): ArgumentContext;
    expressionSequence(): ExpressionSequenceContext;
    singleExpression(_p: any, ...args: any[]): any;
    _ctx: any;
    assignable(): AssignableContext;
    objectLiteral(): ObjectLiteralContext;
    anonymousFunction(): AnonymousFunctionContext;
    arrowFunctionParameters(): ArrowFunctionParametersContext;
    arrowFunctionBody(): ArrowFunctionBodyContext;
    assignmentOperator(): AssignmentOperatorContext;
    literal(): LiteralContext;
    templateStringLiteral(): TemplateStringLiteralContext;
    templateStringAtom(): TemplateStringAtomContext;
    numericLiteral(): NumericLiteralContext;
    bigintLiteral(): BigintLiteralContext;
    getter(): GetterContext;
    setter(): SetterContext;
    identifierName(): IdentifierNameContext;
    identifier(): IdentifierContext;
    reservedWord(): ReservedWordContext;
    keyword(): KeywordContext;
    let_(): Let_Context;
    eos(): EosContext;
    querySelectStatement(): QuerySelectStatementContext;
    queryExpression(): QueryExpressionContext;
    sql_union(): Sql_unionContext;
    querySpecification(): QuerySpecificationContext;
    select_list(): Select_listContext;
    select_list_elem(...args: any[]): Select_list_elemContext;
    fromClause(): FromClauseContext;
    whereClause(): WhereClauseContext;
    dataSources(): DataSourcesContext;
    dataSource(): DataSourceContext;
    data_source_item_joined(): Data_source_item_joinedContext;
    data_source_item(...args: any[]): Data_source_itemContext;
    join_clause(): Join_clauseContext;
    using_source_clause(): Using_source_clauseContext;
    produce_clause(): Produce_clauseContext;
    bind_clause(): Bind_clauseContext;
    withinClause(): WithinClauseContext;
    queryObjectLiteral(): QueryObjectLiteralContext;
    queryPropertyAssignment(): QueryPropertyAssignmentContext;
}
declare namespace ECMAScriptParser {
    export const EOF: any;
    export const HashBangLine: number;
    export const MultiLineComment: number;
    export const SingleLineComment: number;
    export const RegularExpressionLiteral: number;
    export const OpenBracket: number;
    export const CloseBracket: number;
    export const OpenParen: number;
    export const CloseParen: number;
    export const OpenBrace: number;
    export const TemplateCloseBrace: number;
    export const CloseBrace: number;
    export const SemiColon: number;
    export const Comma: number;
    export const Assign: number;
    export const QuestionMark: number;
    export const Colon: number;
    export const Ellipsis: number;
    export const Dot: number;
    export const PlusPlus: number;
    export const MinusMinus: number;
    export const Plus: number;
    export const Minus: number;
    export const BitNot: number;
    export const Not: number;
    export const Multiply: number;
    export const Divide: number;
    export const Modulus: number;
    export const Power: number;
    export const NullCoalesce: number;
    export const Hashtag: number;
    export const RightShiftArithmetic: number;
    export const LeftShiftArithmetic: number;
    export const RightShiftLogical: number;
    export const LessThan: number;
    export const MoreThan: number;
    export const LessThanEquals: number;
    export const GreaterThanEquals: number;
    export const Equals_: number;
    export const NotEquals: number;
    export const IdentityEquals: number;
    export const IdentityNotEquals: number;
    export const BitAnd: number;
    export const BitXOr: number;
    export const BitOr: number;
    export const And: number;
    export const Or: number;
    export const MultiplyAssign: number;
    export const DivideAssign: number;
    export const ModulusAssign: number;
    export const PlusAssign: number;
    export const MinusAssign: number;
    export const LeftShiftArithmeticAssign: number;
    export const RightShiftArithmeticAssign: number;
    export const RightShiftLogicalAssign: number;
    export const BitAndAssign: number;
    export const BitXorAssign: number;
    export const BitOrAssign: number;
    export const PowerAssign: number;
    export const ARROW: number;
    export const NullLiteral: number;
    export const BooleanLiteral: number;
    export const DecimalLiteral: number;
    export const HexIntegerLiteral: number;
    export const OctalIntegerLiteral: number;
    export const OctalIntegerLiteral2: number;
    export const BinaryIntegerLiteral: number;
    export const BigHexIntegerLiteral: number;
    export const BigOctalIntegerLiteral: number;
    export const BigBinaryIntegerLiteral: number;
    export const BigDecimalIntegerLiteral: number;
    export const Break: number;
    export const Do: number;
    export const Instanceof: number;
    export const Typeof: number;
    export const Case: number;
    export const Else: number;
    export const New: number;
    export const Var: number;
    export const Catch: number;
    export const Finally: number;
    export const Return: number;
    export const Void: number;
    export const Continue: number;
    export const For: number;
    export const Switch: number;
    export const While: number;
    export const Debugger: number;
    export const Function_: number;
    export const This: number;
    export const With: number;
    export const Default: number;
    export const If: number;
    export const Throw: number;
    export const Delete: number;
    export const In: number;
    export const Try: number;
    export const As: number;
    export const From: number;
    export const Class: number;
    export const Enum: number;
    export const Extends: number;
    export const Super: number;
    export const Const: number;
    export const Export: number;
    export const Import: number;
    export const Async: number;
    export const Await: number;
    export const Url: number;
    export const Select: number;
    export const Union: number;
    export const Where: number;
    export const Join: number;
    export const On: number;
    export const Produce: number;
    export const Using: number;
    export const All: number;
    export const Within: number;
    export const Implements: number;
    export const StrictLet: number;
    export const NonStrictLet: number;
    export const Private: number;
    export const Public: number;
    export const Interface: number;
    export const Package: number;
    export const Protected: number;
    export const Static: number;
    export const Yield: number;
    export const Identifier: number;
    export const StringLiteral: number;
    export const BackTick: number;
    export const WhiteSpaces: number;
    export const LineTerminator: number;
    export const HtmlComment: number;
    export const CDataComment: number;
    export const UnexpectedCharacter: number;
    export const TemplateStringStartExpression: number;
    export const TemplateStringAtom: number;
    export const RULE_program: number;
    export const RULE_sourceElement: number;
    export const RULE_statement: number;
    export const RULE_block: number;
    export const RULE_statementList: number;
    export const RULE_importStatement: number;
    export const RULE_importFromBlock: number;
    export const RULE_moduleItems: number;
    export const RULE_importDefault: number;
    export const RULE_importNamespace: number;
    export const RULE_importFrom: number;
    export const RULE_aliasName: number;
    export const RULE_exportStatement: number;
    export const RULE_exportFromBlock: number;
    export const RULE_declaration: number;
    export const RULE_variableStatement: number;
    export const RULE_variableDeclarationList: number;
    export const RULE_variableDeclaration: number;
    export const RULE_emptyStatement: number;
    export const RULE_expressionStatement: number;
    export const RULE_ifStatement: number;
    export const RULE_iterationStatement: number;
    export const RULE_varModifier: number;
    export const RULE_continueStatement: number;
    export const RULE_breakStatement: number;
    export const RULE_returnStatement: number;
    export const RULE_withStatement: number;
    export const RULE_switchStatement: number;
    export const RULE_caseBlock: number;
    export const RULE_caseClauses: number;
    export const RULE_caseClause: number;
    export const RULE_defaultClause: number;
    export const RULE_labelledStatement: number;
    export const RULE_throwStatement: number;
    export const RULE_tryStatement: number;
    export const RULE_catchProduction: number;
    export const RULE_finallyProduction: number;
    export const RULE_debuggerStatement: number;
    export const RULE_functionDeclaration: number;
    export const RULE_classDeclaration: number;
    export const RULE_classTail: number;
    export const RULE_classHeritage: number;
    export const RULE_classElement: number;
    export const RULE_methodDefinition: number;
    export const RULE_formalParameterList: number;
    export const RULE_formalParameterArg: number;
    export const RULE_lastFormalParameterArg: number;
    export const RULE_functionBody: number;
    export const RULE_sourceElements: number;
    export const RULE_arrayLiteral: number;
    export const RULE_elementList: number;
    export const RULE_arrayElement: number;
    export const RULE_propertyAssignment: number;
    export const RULE_propertyName: number;
    export const RULE_arguments: number;
    export const RULE_argument: number;
    export const RULE_expressionSequence: number;
    export const RULE_singleExpression: number;
    export const RULE_assignable: number;
    export const RULE_objectLiteral: number;
    export const RULE_anonymousFunction: number;
    export const RULE_arrowFunctionParameters: number;
    export const RULE_arrowFunctionBody: number;
    export const RULE_assignmentOperator: number;
    export const RULE_literal: number;
    export const RULE_templateStringLiteral: number;
    export const RULE_templateStringAtom: number;
    export const RULE_numericLiteral: number;
    export const RULE_bigintLiteral: number;
    export const RULE_getter: number;
    export const RULE_setter: number;
    export const RULE_identifierName: number;
    export const RULE_identifier: number;
    export const RULE_reservedWord: number;
    export const RULE_keyword: number;
    export const RULE_let_: number;
    export const RULE_eos: number;
    export const RULE_querySelectStatement: number;
    export const RULE_queryExpression: number;
    export const RULE_sql_union: number;
    export const RULE_querySpecification: number;
    export const RULE_select_list: number;
    export const RULE_select_list_elem: number;
    export const RULE_fromClause: number;
    export const RULE_whereClause: number;
    export const RULE_dataSources: number;
    export const RULE_dataSource: number;
    export const RULE_data_source_item_joined: number;
    export const RULE_data_source_item: number;
    export const RULE_join_clause: number;
    export const RULE_using_source_clause: number;
    export const RULE_produce_clause: number;
    export const RULE_bind_clause: number;
    export const RULE_withinClause: number;
    export const RULE_queryObjectLiteral: number;
    export const RULE_queryPropertyAssignment: number;
    export { ExportDefaultDeclarationContext };
    export { ExportDeclarationContext };
    export { DoStatementContext };
    export { WhileStatementContext };
    export { ForStatementContext };
    export { ForInStatementContext };
    export { ForOfStatementContext };
    export { PropertyExpressionAssignmentContext };
    export { ComputedPropertyExpressionAssignmentContext };
    export { PropertyShorthandContext };
    export { PropertySetterContext };
    export { PropertyGetterContext };
    export { FunctionPropertyContext };
    export { TemplateStringExpressionContext };
    export { TernaryExpressionContext };
    export { LogicalAndExpressionContext };
    export { PowerExpressionContext };
    export { PreIncrementExpressionContext };
    export { ObjectLiteralExpressionContext };
    export { MetaExpressionContext };
    export { InExpressionContext };
    export { LogicalOrExpressionContext };
    export { NotExpressionContext };
    export { PreDecreaseExpressionContext };
    export { ArgumentsExpressionContext };
    export { AwaitExpressionContext };
    export { ThisExpressionContext };
    export { FunctionExpressionContext };
    export { UnaryMinusExpressionContext };
    export { AssignmentExpressionContext };
    export { PostDecreaseExpressionContext };
    export { MemberNewExpressionContext };
    export { TypeofExpressionContext };
    export { InstanceofExpressionContext };
    export { UnaryPlusExpressionContext };
    export { DeleteExpressionContext };
    export { InlinedQueryExpressionContext };
    export { ImportExpressionContext };
    export { EqualityExpressionContext };
    export { BitXOrExpressionContext };
    export { SuperExpressionContext };
    export { MultiplicativeExpressionContext };
    export { BitShiftExpressionContext };
    export { ParenthesizedExpressionContext };
    export { AdditiveExpressionContext };
    export { RelationalExpressionContext };
    export { PostIncrementExpressionContext };
    export { YieldExpressionContext };
    export { BitNotExpressionContext };
    export { NewExpressionContext };
    export { LiteralExpressionContext };
    export { ArrayLiteralExpressionContext };
    export { MemberDotExpressionContext };
    export { ClassExpressionContext };
    export { MemberIndexExpressionContext };
    export { IdentifierExpressionContext };
    export { BitAndExpressionContext };
    export { BitOrExpressionContext };
    export { AssignmentOperatorExpressionContext };
    export { VoidExpressionContext };
    export { CoalesceExpressionContext };
    export { AnonymousFunctionDeclContext };
    export { ArrowFunctionContext };
    export { FunctionDeclContext };
    export { QueryUnionExpressionContext };
    export { QuerySelectExpressionContext };
    export { QuerySelectListExpressionContext };
    export { QueryFromExpressionContext };
    export { QueryWhereExpressionContext };
    export { QueryDataSourcesExpressionContext };
    export { QueryDataSourceExpressionContext };
    export { QueryDataSourceItemIdentifierExpressionContext };
    export { QueryDataSourceItemUrlExpressionContext };
    export { QueryDataSourceItemArgumentsExpressionContext };
    export { QueryDataSourceItemSubqueryExpressionContext };
    export { QueryJoinCrossApplyExpressionContext };
    export { QueryJoinOnExpressionContext };
    export { QuerySourceUsingLiteralExpressionContext };
    export { QuerySourceUsingSingleExpressionContext };
    export { QueryProduceExpressionContext };
    export { QueryBindExpressionContext };
    export { QueryWithinExpressionContext };
    export { ProgramContext };
    export { SourceElementContext };
    export { StatementContext };
    export { BlockContext };
    export { StatementListContext };
    export { ImportStatementContext };
    export { ImportFromBlockContext };
    export { ModuleItemsContext };
    export { ImportDefaultContext };
    export { ImportNamespaceContext };
    export { ImportFromContext };
    export { AliasNameContext };
    export { ExportStatementContext };
    export { ExportFromBlockContext };
    export { DeclarationContext };
    export { VariableStatementContext };
    export { VariableDeclarationListContext };
    export { VariableDeclarationContext };
    export { EmptyStatementContext };
    export { ExpressionStatementContext };
    export { IfStatementContext };
    export { IterationStatementContext };
    export { VarModifierContext };
    export { ContinueStatementContext };
    export { BreakStatementContext };
    export { ReturnStatementContext };
    export { WithStatementContext };
    export { SwitchStatementContext };
    export { CaseBlockContext };
    export { CaseClausesContext };
    export { CaseClauseContext };
    export { DefaultClauseContext };
    export { LabelledStatementContext };
    export { ThrowStatementContext };
    export { TryStatementContext };
    export { CatchProductionContext };
    export { FinallyProductionContext };
    export { DebuggerStatementContext };
    export { FunctionDeclarationContext };
    export { ClassDeclarationContext };
    export { ClassTailContext };
    export { ClassHeritageContext };
    export { ClassElementContext };
    export { MethodDefinitionContext };
    export { FormalParameterListContext };
    export { FormalParameterArgContext };
    export { LastFormalParameterArgContext };
    export { FunctionBodyContext };
    export { SourceElementsContext };
    export { ArrayLiteralContext };
    export { ElementListContext };
    export { ArrayElementContext };
    export { PropertyAssignmentContext };
    export { PropertyNameContext };
    export { ArgumentsContext };
    export { ArgumentContext };
    export { ExpressionSequenceContext };
    export { SingleExpressionContext };
    export { AssignableContext };
    export { ObjectLiteralContext };
    export { AnonymousFunctionContext };
    export { ArrowFunctionParametersContext };
    export { ArrowFunctionBodyContext };
    export { AssignmentOperatorContext };
    export { LiteralContext };
    export { TemplateStringLiteralContext };
    export { TemplateStringAtomContext };
    export { NumericLiteralContext };
    export { BigintLiteralContext };
    export { GetterContext };
    export { SetterContext };
    export { IdentifierNameContext };
    export { IdentifierContext };
    export { ReservedWordContext };
    export { KeywordContext };
    export { Let_Context };
    export { EosContext };
    export { QuerySelectStatementContext };
    export { QueryExpressionContext };
    export { Sql_unionContext };
    export { QuerySpecificationContext };
    export { Select_listContext };
    export { Select_list_elemContext };
    export { FromClauseContext };
    export { WhereClauseContext };
    export { DataSourcesContext };
    export { DataSourceContext };
    export { Data_source_item_joinedContext };
    export { Data_source_itemContext };
    export { Join_clauseContext };
    export { Using_source_clauseContext };
    export { Produce_clauseContext };
    export { Bind_clauseContext };
    export { WithinClauseContext };
    export { QueryObjectLiteralContext };
    export { QueryPropertyAssignmentContext };
}
export default ECMAScriptParser;
import ECMAScriptParserBase from "./ECMAScriptParserBase.js";
declare class ProgramContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    EOF(): any;
    HashBangLine(): any;
    sourceElements(): any;
    accept(visitor: any): any;
}
declare class SourceElementContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    statement(): any;
    accept(visitor: any): any;
}
declare class StatementContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    block(): any;
    querySelectStatement(): any;
    variableStatement(): any;
    importStatement(): any;
    exportStatement(): any;
    emptyStatement(): any;
    classDeclaration(): any;
    functionDeclaration(): any;
    expressionStatement(): any;
    ifStatement(): any;
    iterationStatement(): any;
    continueStatement(): any;
    breakStatement(): any;
    returnStatement(): any;
    withStatement(): any;
    labelledStatement(): any;
    switchStatement(): any;
    throwStatement(): any;
    tryStatement(): any;
    debuggerStatement(): any;
    accept(visitor: any): any;
}
declare class BlockContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    OpenBrace(): any;
    CloseBrace(): any;
    statementList(): any;
    accept(visitor: any): any;
}
declare class StatementListContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    statement: (i: any) => any;
    accept(visitor: any): any;
}
declare class ImportStatementContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    Import(): any;
    importFromBlock(): any;
    accept(visitor: any): any;
}
declare class ImportFromBlockContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    StringLiteral(): any;
    eos(): any;
    importDefault(): any;
    Comma(): any;
    importFrom(): any;
    importNamespace(): any;
    moduleItems(): any;
    accept(visitor: any): any;
}
declare class ModuleItemsContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    OpenBrace(): any;
    CloseBrace(): any;
    aliasName: (i: any) => any;
    Comma: (i: any) => any;
    accept(visitor: any): any;
}
declare class ImportDefaultContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    aliasName(): any;
    accept(visitor: any): any;
}
declare class ImportNamespaceContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    Multiply(): any;
    identifierName: (i: any) => any;
    As(): any;
    accept(visitor: any): any;
}
declare class ImportFromContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    From(): any;
    StringLiteral(): any;
    accept(visitor: any): any;
}
declare class AliasNameContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    identifierName: (i: any) => any;
    As(): any;
    accept(visitor: any): any;
}
declare class ExportStatementContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    copyFrom(ctx: any): void;
}
declare class ExportFromBlockContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    importNamespace(): any;
    importFrom(): any;
    eos(): any;
    moduleItems(): any;
    accept(visitor: any): any;
}
declare class DeclarationContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    variableStatement(): any;
    classDeclaration(): any;
    functionDeclaration(): any;
    accept(visitor: any): any;
}
declare class VariableStatementContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    variableDeclarationList(): any;
    eos(): any;
    accept(visitor: any): any;
}
declare class VariableDeclarationListContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    varModifier(): any;
    variableDeclaration: (i: any) => any;
    Comma: (i: any) => any;
    accept(visitor: any): any;
}
declare class VariableDeclarationContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    assignable(): any;
    Assign(): any;
    singleExpression(): any;
    accept(visitor: any): any;
}
declare class EmptyStatementContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    SemiColon(): any;
    accept(visitor: any): any;
}
declare class ExpressionStatementContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    expressionSequence(): any;
    eos(): any;
    accept(visitor: any): any;
}
declare class IfStatementContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    If(): any;
    OpenParen(): any;
    expressionSequence(): any;
    CloseParen(): any;
    statement: (i: any) => any;
    Else(): any;
    accept(visitor: any): any;
}
declare class IterationStatementContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    copyFrom(ctx: any): void;
}
declare class VarModifierContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    Var(): any;
    let_(): any;
    Const(): any;
    accept(visitor: any): any;
}
declare class ContinueStatementContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    Continue(): any;
    eos(): any;
    identifier(): any;
    accept(visitor: any): any;
}
declare class BreakStatementContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    Break(): any;
    eos(): any;
    identifier(): any;
    accept(visitor: any): any;
}
declare class ReturnStatementContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    Return(): any;
    eos(): any;
    expressionSequence(): any;
    accept(visitor: any): any;
}
declare class WithStatementContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    With(): any;
    OpenParen(): any;
    expressionSequence(): any;
    CloseParen(): any;
    statement(): any;
    accept(visitor: any): any;
}
declare class SwitchStatementContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    Switch(): any;
    OpenParen(): any;
    expressionSequence(): any;
    CloseParen(): any;
    caseBlock(): any;
    accept(visitor: any): any;
}
declare class CaseBlockContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    OpenBrace(): any;
    CloseBrace(): any;
    caseClauses: (i: any) => any;
    defaultClause(): any;
    accept(visitor: any): any;
}
declare class CaseClausesContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    caseClause: (i: any) => any;
    accept(visitor: any): any;
}
declare class CaseClauseContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    Case(): any;
    expressionSequence(): any;
    Colon(): any;
    statementList(): any;
    accept(visitor: any): any;
}
declare class DefaultClauseContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    Default(): any;
    Colon(): any;
    statementList(): any;
    accept(visitor: any): any;
}
declare class LabelledStatementContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    identifier(): any;
    Colon(): any;
    statement(): any;
    accept(visitor: any): any;
}
declare class ThrowStatementContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    Throw(): any;
    expressionSequence(): any;
    eos(): any;
    accept(visitor: any): any;
}
declare class TryStatementContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    Try(): any;
    block(): any;
    catchProduction(): any;
    finallyProduction(): any;
    accept(visitor: any): any;
}
declare class CatchProductionContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    Catch(): any;
    block(): any;
    OpenParen(): any;
    CloseParen(): any;
    assignable(): any;
    accept(visitor: any): any;
}
declare class FinallyProductionContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    Finally(): any;
    block(): any;
    accept(visitor: any): any;
}
declare class DebuggerStatementContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    Debugger(): any;
    eos(): any;
    accept(visitor: any): any;
}
declare class FunctionDeclarationContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    Function_(): any;
    identifier(): any;
    OpenParen(): any;
    CloseParen(): any;
    OpenBrace(): any;
    functionBody(): any;
    CloseBrace(): any;
    Async(): any;
    Multiply(): any;
    formalParameterList(): any;
    accept(visitor: any): any;
}
declare class ClassDeclarationContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    Class(): any;
    identifier(): any;
    classTail(): any;
    accept(visitor: any): any;
}
declare class ClassTailContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    OpenBrace(): any;
    CloseBrace(): any;
    classHeritage(): any;
    classElement: (i: any) => any;
    accept(visitor: any): any;
}
declare class ClassHeritageContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    Extends(): any;
    singleExpression(): any;
    accept(visitor: any): any;
}
declare class ClassElementContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    methodDefinition(): any;
    Static: (i: any) => any;
    identifier: (i: any) => any;
    Async: (i: any) => any;
    emptyStatement(): any;
    propertyName(): any;
    Assign(): any;
    singleExpression(): any;
    Hashtag(): any;
    accept(visitor: any): any;
}
declare class MethodDefinitionContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    propertyName(): any;
    OpenParen(): any;
    CloseParen(): any;
    OpenBrace(): any;
    functionBody(): any;
    CloseBrace(): any;
    Multiply(): any;
    Hashtag(): any;
    formalParameterList(): any;
    getter(): any;
    setter(): any;
    accept(visitor: any): any;
}
declare class FormalParameterListContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    formalParameterArg: (i: any) => any;
    Comma: (i: any) => any;
    lastFormalParameterArg(): any;
    accept(visitor: any): any;
}
declare class FormalParameterArgContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    assignable(): any;
    Assign(): any;
    singleExpression(): any;
    accept(visitor: any): any;
}
declare class LastFormalParameterArgContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    Ellipsis(): any;
    singleExpression(): any;
    accept(visitor: any): any;
}
declare class FunctionBodyContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    sourceElements(): any;
    accept(visitor: any): any;
}
declare class SourceElementsContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    sourceElement: (i: any) => any;
    accept(visitor: any): any;
}
declare class ArrayLiteralContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    OpenBracket(): any;
    elementList(): any;
    CloseBracket(): any;
    accept(visitor: any): any;
}
declare class ElementListContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    Comma: (i: any) => any;
    arrayElement: (i: any) => any;
    accept(visitor: any): any;
}
declare class ArrayElementContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    singleExpression(): any;
    Ellipsis(): any;
    accept(visitor: any): any;
}
declare class PropertyAssignmentContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    copyFrom(ctx: any): void;
}
declare class PropertyNameContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    identifierName(): any;
    StringLiteral(): any;
    numericLiteral(): any;
    OpenBracket(): any;
    singleExpression(): any;
    CloseBracket(): any;
    accept(visitor: any): any;
}
declare class ArgumentsContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    OpenParen(): any;
    CloseParen(): any;
    argument: (i: any) => any;
    Comma: (i: any) => any;
    accept(visitor: any): any;
}
declare class ArgumentContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    singleExpression(): any;
    identifier(): any;
    Ellipsis(): any;
    accept(visitor: any): any;
}
declare class ExpressionSequenceContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    singleExpression: (i: any) => any;
    Comma: (i: any) => any;
    accept(visitor: any): any;
}
declare class AssignableContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    identifier(): any;
    arrayLiteral(): any;
    objectLiteral(): any;
    accept(visitor: any): any;
}
declare class ObjectLiteralContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    OpenBrace(): any;
    CloseBrace(): any;
    propertyAssignment: (i: any) => any;
    Comma: (i: any) => any;
    accept(visitor: any): any;
}
declare class AnonymousFunctionContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    copyFrom(ctx: any): void;
}
declare class ArrowFunctionParametersContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    identifier(): any;
    OpenParen(): any;
    CloseParen(): any;
    formalParameterList(): any;
    accept(visitor: any): any;
}
declare class ArrowFunctionBodyContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    OpenBrace(): any;
    functionBody(): any;
    CloseBrace(): any;
    singleExpression(): any;
    accept(visitor: any): any;
}
declare class AssignmentOperatorContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    MultiplyAssign(): any;
    DivideAssign(): any;
    ModulusAssign(): any;
    PlusAssign(): any;
    MinusAssign(): any;
    LeftShiftArithmeticAssign(): any;
    RightShiftArithmeticAssign(): any;
    RightShiftLogicalAssign(): any;
    BitAndAssign(): any;
    BitXorAssign(): any;
    BitOrAssign(): any;
    PowerAssign(): any;
    accept(visitor: any): any;
}
declare class LiteralContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    NullLiteral(): any;
    BooleanLiteral(): any;
    StringLiteral(): any;
    templateStringLiteral(): any;
    RegularExpressionLiteral(): any;
    numericLiteral(): any;
    bigintLiteral(): any;
    accept(visitor: any): any;
}
declare class TemplateStringLiteralContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    BackTick: (i: any) => any;
    templateStringAtom: (i: any) => any;
    accept(visitor: any): any;
}
declare class TemplateStringAtomContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    TemplateStringAtom(): any;
    TemplateStringStartExpression(): any;
    singleExpression(): any;
    TemplateCloseBrace(): any;
    accept(visitor: any): any;
}
declare class NumericLiteralContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    DecimalLiteral(): any;
    HexIntegerLiteral(): any;
    OctalIntegerLiteral(): any;
    OctalIntegerLiteral2(): any;
    BinaryIntegerLiteral(): any;
    accept(visitor: any): any;
}
declare class BigintLiteralContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    BigDecimalIntegerLiteral(): any;
    BigHexIntegerLiteral(): any;
    BigOctalIntegerLiteral(): any;
    BigBinaryIntegerLiteral(): any;
    accept(visitor: any): any;
}
declare class GetterContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    identifier(): any;
    propertyName(): any;
    accept(visitor: any): any;
}
declare class SetterContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    identifier(): any;
    propertyName(): any;
    accept(visitor: any): any;
}
declare class IdentifierNameContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    Identifier(): any;
    reservedWord(): any;
    accept(visitor: any): any;
}
declare class IdentifierContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    Identifier(): any;
    NonStrictLet(): any;
    Async(): any;
    accept(visitor: any): any;
}
declare class ReservedWordContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    keyword(): any;
    NullLiteral(): any;
    BooleanLiteral(): any;
    accept(visitor: any): any;
}
declare class KeywordContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    Break(): any;
    Do(): any;
    Instanceof(): any;
    Typeof(): any;
    Case(): any;
    Else(): any;
    New(): any;
    Var(): any;
    Catch(): any;
    Finally(): any;
    Return(): any;
    Void(): any;
    Continue(): any;
    For(): any;
    Switch(): any;
    While(): any;
    Debugger(): any;
    Function_(): any;
    This(): any;
    With(): any;
    Default(): any;
    If(): any;
    Throw(): any;
    Delete(): any;
    In(): any;
    Try(): any;
    Class(): any;
    Enum(): any;
    Extends(): any;
    Super(): any;
    Const(): any;
    Export(): any;
    Import(): any;
    Implements(): any;
    let_(): any;
    Private(): any;
    Public(): any;
    Interface(): any;
    Package(): any;
    Protected(): any;
    Static(): any;
    Yield(): any;
    Async(): any;
    Await(): any;
    From(): any;
    As(): any;
    accept(visitor: any): any;
}
declare class Let_Context {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    NonStrictLet(): any;
    StrictLet(): any;
    accept(visitor: any): any;
}
declare class EosContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    SemiColon(): any;
    EOF(): any;
    accept(visitor: any): any;
}
declare class QuerySelectStatementContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    queryExpression(): any;
    accept(visitor: any): any;
}
declare class QueryExpressionContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    querySpecification(): any;
    OpenParen(): any;
    queryExpression(): any;
    CloseParen(): any;
    sql_union: (i: any) => any;
    accept(visitor: any): any;
}
declare class Sql_unionContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    copyFrom(ctx: any): void;
}
declare class QuerySpecificationContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    copyFrom(ctx: any): void;
}
declare class Select_listContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    copyFrom(ctx: any): void;
}
declare class Select_list_elemContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    Multiply(): any;
    identifier(): any;
    As(): any;
    identifierName(): any;
    singleExpression(): any;
    arguments(): any;
    accept(visitor: any): any;
}
declare class FromClauseContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    copyFrom(ctx: any): void;
}
declare class WhereClauseContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    copyFrom(ctx: any): void;
}
declare class DataSourcesContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    copyFrom(ctx: any): void;
}
declare class DataSourceContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    data_source_item_joined(): any;
    OpenParen(): any;
    CloseParen(): any;
    accept(visitor: any): any;
}
declare class Data_source_item_joinedContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    copyFrom(ctx: any): void;
}
declare class Data_source_itemContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    copyFrom(ctx: any): void;
}
declare class Join_clauseContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    copyFrom(ctx: any): void;
}
declare class Using_source_clauseContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    copyFrom(ctx: any): void;
}
declare class Produce_clauseContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    copyFrom(ctx: any): void;
}
declare class Bind_clauseContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    copyFrom(ctx: any): void;
}
declare class WithinClauseContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    copyFrom(ctx: any): void;
}
declare class QueryObjectLiteralContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    OpenBrace(): any;
    CloseBrace(): any;
    queryPropertyAssignment: (i: any) => any;
    Comma: (i: any) => any;
    accept(visitor: any): any;
}
declare class QueryPropertyAssignmentContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    propertyName(): any;
    Colon(): any;
    singleExpression(): any;
    accept(visitor: any): any;
}
declare class ExportDefaultDeclarationContext extends ExportStatementContext {
    constructor(parser: any, ctx: any);
    Export(): any;
    Default(): any;
    eos(): any;
    classDeclaration(): any;
    functionDeclaration(): any;
    singleExpression(): any;
    accept(visitor: any): any;
}
declare class ExportDeclarationContext extends ExportStatementContext {
    constructor(parser: any, ctx: any);
    Export(): any;
    eos(): any;
    exportFromBlock(): any;
    declaration(): any;
    accept(visitor: any): any;
}
declare class DoStatementContext extends IterationStatementContext {
    constructor(parser: any, ctx: any);
    Do(): any;
    statement(): any;
    While(): any;
    OpenParen(): any;
    expressionSequence(): any;
    CloseParen(): any;
    eos(): any;
    accept(visitor: any): any;
}
declare class WhileStatementContext extends IterationStatementContext {
    constructor(parser: any, ctx: any);
    While(): any;
    OpenParen(): any;
    expressionSequence(): any;
    CloseParen(): any;
    statement(): any;
    accept(visitor: any): any;
}
declare class ForStatementContext extends IterationStatementContext {
    constructor(parser: any, ctx: any);
    For(): any;
    OpenParen(): any;
    SemiColon: (i: any) => any;
    CloseParen(): any;
    statement(): any;
    expressionSequence: (i: any) => any;
    variableDeclarationList(): any;
    accept(visitor: any): any;
}
declare class ForInStatementContext extends IterationStatementContext {
    constructor(parser: any, ctx: any);
    For(): any;
    OpenParen(): any;
    In(): any;
    expressionSequence(): any;
    CloseParen(): any;
    statement(): any;
    singleExpression(): any;
    variableDeclarationList(): any;
    accept(visitor: any): any;
}
declare class ForOfStatementContext extends IterationStatementContext {
    constructor(parser: any, ctx: any);
    For(): any;
    OpenParen(): any;
    identifier(): any;
    expressionSequence(): any;
    CloseParen(): any;
    statement(): any;
    singleExpression(): any;
    variableDeclarationList(): any;
    Await(): any;
    accept(visitor: any): any;
}
declare class PropertyExpressionAssignmentContext extends PropertyAssignmentContext {
    constructor(parser: any, ctx: any);
    propertyName(): any;
    Colon(): any;
    singleExpression(): any;
    accept(visitor: any): any;
}
declare class ComputedPropertyExpressionAssignmentContext extends PropertyAssignmentContext {
    constructor(parser: any, ctx: any);
    OpenBracket(): any;
    singleExpression: (i: any) => any;
    CloseBracket(): any;
    Colon(): any;
    accept(visitor: any): any;
}
declare class PropertyShorthandContext extends PropertyAssignmentContext {
    constructor(parser: any, ctx: any);
    singleExpression(): any;
    Ellipsis(): any;
    accept(visitor: any): any;
}
declare class PropertySetterContext extends PropertyAssignmentContext {
    constructor(parser: any, ctx: any);
    setter(): any;
    OpenParen(): any;
    formalParameterArg(): any;
    CloseParen(): any;
    OpenBrace(): any;
    functionBody(): any;
    CloseBrace(): any;
    accept(visitor: any): any;
}
declare class PropertyGetterContext extends PropertyAssignmentContext {
    constructor(parser: any, ctx: any);
    getter(): any;
    OpenParen(): any;
    CloseParen(): any;
    OpenBrace(): any;
    functionBody(): any;
    CloseBrace(): any;
    accept(visitor: any): any;
}
declare class FunctionPropertyContext extends PropertyAssignmentContext {
    constructor(parser: any, ctx: any);
    propertyName(): any;
    OpenParen(): any;
    CloseParen(): any;
    OpenBrace(): any;
    functionBody(): any;
    CloseBrace(): any;
    Async(): any;
    Multiply(): any;
    formalParameterList(): any;
    accept(visitor: any): any;
}
declare class TemplateStringExpressionContext extends SingleExpressionContext {
    constructor(parser: any, ctx: any);
    singleExpression(): any;
    templateStringLiteral(): any;
    accept(visitor: any): any;
}
declare class TernaryExpressionContext extends SingleExpressionContext {
    constructor(parser: any, ctx: any);
    singleExpression: (i: any) => any;
    QuestionMark(): any;
    Colon(): any;
    accept(visitor: any): any;
}
declare class LogicalAndExpressionContext extends SingleExpressionContext {
    constructor(parser: any, ctx: any);
    singleExpression: (i: any) => any;
    And(): any;
    accept(visitor: any): any;
}
declare class PowerExpressionContext extends SingleExpressionContext {
    constructor(parser: any, ctx: any);
    singleExpression: (i: any) => any;
    Power(): any;
    accept(visitor: any): any;
}
declare class PreIncrementExpressionContext extends SingleExpressionContext {
    constructor(parser: any, ctx: any);
    PlusPlus(): any;
    singleExpression(): any;
    accept(visitor: any): any;
}
declare class ObjectLiteralExpressionContext extends SingleExpressionContext {
    constructor(parser: any, ctx: any);
    objectLiteral(): any;
    accept(visitor: any): any;
}
declare class MetaExpressionContext extends SingleExpressionContext {
    constructor(parser: any, ctx: any);
    New(): any;
    Dot(): any;
    identifier(): any;
    accept(visitor: any): any;
}
declare class InExpressionContext extends SingleExpressionContext {
    constructor(parser: any, ctx: any);
    singleExpression: (i: any) => any;
    In(): any;
    accept(visitor: any): any;
}
declare class LogicalOrExpressionContext extends SingleExpressionContext {
    constructor(parser: any, ctx: any);
    singleExpression: (i: any) => any;
    Or(): any;
    accept(visitor: any): any;
}
declare class NotExpressionContext extends SingleExpressionContext {
    constructor(parser: any, ctx: any);
    Not(): any;
    singleExpression(): any;
    accept(visitor: any): any;
}
declare class PreDecreaseExpressionContext extends SingleExpressionContext {
    constructor(parser: any, ctx: any);
    MinusMinus(): any;
    singleExpression(): any;
    accept(visitor: any): any;
}
declare class ArgumentsExpressionContext extends SingleExpressionContext {
    constructor(parser: any, ctx: any);
    singleExpression(): any;
    arguments(): any;
    accept(visitor: any): any;
}
declare class AwaitExpressionContext extends SingleExpressionContext {
    constructor(parser: any, ctx: any);
    Await(): any;
    singleExpression(): any;
    accept(visitor: any): any;
}
declare class ThisExpressionContext extends SingleExpressionContext {
    constructor(parser: any, ctx: any);
    This(): any;
    accept(visitor: any): any;
}
declare class FunctionExpressionContext extends SingleExpressionContext {
    constructor(parser: any, ctx: any);
    anonymousFunction(): any;
    accept(visitor: any): any;
}
declare class UnaryMinusExpressionContext extends SingleExpressionContext {
    constructor(parser: any, ctx: any);
    Minus(): any;
    singleExpression(): any;
    accept(visitor: any): any;
}
declare class AssignmentExpressionContext extends SingleExpressionContext {
    constructor(parser: any, ctx: any);
    singleExpression: (i: any) => any;
    Assign(): any;
    accept(visitor: any): any;
}
declare class PostDecreaseExpressionContext extends SingleExpressionContext {
    constructor(parser: any, ctx: any);
    singleExpression(): any;
    MinusMinus(): any;
    accept(visitor: any): any;
}
declare class MemberNewExpressionContext extends SingleExpressionContext {
    constructor(parser: any, ctx: any);
    New(): any;
    singleExpression(): any;
    Dot(): any;
    identifierName(): any;
    arguments(): any;
    accept(visitor: any): any;
}
declare class TypeofExpressionContext extends SingleExpressionContext {
    constructor(parser: any, ctx: any);
    Typeof(): any;
    singleExpression(): any;
    accept(visitor: any): any;
}
declare class InstanceofExpressionContext extends SingleExpressionContext {
    constructor(parser: any, ctx: any);
    singleExpression: (i: any) => any;
    Instanceof(): any;
    accept(visitor: any): any;
}
declare class UnaryPlusExpressionContext extends SingleExpressionContext {
    constructor(parser: any, ctx: any);
    Plus(): any;
    singleExpression(): any;
    accept(visitor: any): any;
}
declare class DeleteExpressionContext extends SingleExpressionContext {
    constructor(parser: any, ctx: any);
    Delete(): any;
    singleExpression(): any;
    accept(visitor: any): any;
}
declare class InlinedQueryExpressionContext extends SingleExpressionContext {
    constructor(parser: any, ctx: any);
    queryExpression(): any;
    accept(visitor: any): any;
}
declare class ImportExpressionContext extends SingleExpressionContext {
    constructor(parser: any, ctx: any);
    Import(): any;
    OpenParen(): any;
    singleExpression(): any;
    CloseParen(): any;
    accept(visitor: any): any;
}
declare class EqualityExpressionContext extends SingleExpressionContext {
    constructor(parser: any, ctx: any);
    singleExpression: (i: any) => any;
    Equals_(): any;
    NotEquals(): any;
    IdentityEquals(): any;
    IdentityNotEquals(): any;
    accept(visitor: any): any;
}
declare class BitXOrExpressionContext extends SingleExpressionContext {
    constructor(parser: any, ctx: any);
    singleExpression: (i: any) => any;
    BitXOr(): any;
    accept(visitor: any): any;
}
declare class SuperExpressionContext extends SingleExpressionContext {
    constructor(parser: any, ctx: any);
    Super(): any;
    accept(visitor: any): any;
}
declare class MultiplicativeExpressionContext extends SingleExpressionContext {
    constructor(parser: any, ctx: any);
    singleExpression: (i: any) => any;
    Multiply(): any;
    Divide(): any;
    Modulus(): any;
    accept(visitor: any): any;
}
declare class BitShiftExpressionContext extends SingleExpressionContext {
    constructor(parser: any, ctx: any);
    singleExpression: (i: any) => any;
    LeftShiftArithmetic(): any;
    RightShiftArithmetic(): any;
    RightShiftLogical(): any;
    accept(visitor: any): any;
}
declare class ParenthesizedExpressionContext extends SingleExpressionContext {
    constructor(parser: any, ctx: any);
    OpenParen(): any;
    expressionSequence(): any;
    CloseParen(): any;
    accept(visitor: any): any;
}
declare class AdditiveExpressionContext extends SingleExpressionContext {
    constructor(parser: any, ctx: any);
    singleExpression: (i: any) => any;
    Plus(): any;
    Minus(): any;
    accept(visitor: any): any;
}
declare class RelationalExpressionContext extends SingleExpressionContext {
    constructor(parser: any, ctx: any);
    singleExpression: (i: any) => any;
    LessThan(): any;
    MoreThan(): any;
    LessThanEquals(): any;
    GreaterThanEquals(): any;
    accept(visitor: any): any;
}
declare class PostIncrementExpressionContext extends SingleExpressionContext {
    constructor(parser: any, ctx: any);
    singleExpression(): any;
    PlusPlus(): any;
    accept(visitor: any): any;
}
declare class YieldExpressionContext extends SingleExpressionContext {
    constructor(parser: any, ctx: any);
    Yield(): any;
    expressionSequence(): any;
    Multiply(): any;
    accept(visitor: any): any;
}
declare class BitNotExpressionContext extends SingleExpressionContext {
    constructor(parser: any, ctx: any);
    BitNot(): any;
    singleExpression(): any;
    accept(visitor: any): any;
}
declare class NewExpressionContext extends SingleExpressionContext {
    constructor(parser: any, ctx: any);
    New(): any;
    singleExpression(): any;
    arguments(): any;
    accept(visitor: any): any;
}
declare class LiteralExpressionContext extends SingleExpressionContext {
    constructor(parser: any, ctx: any);
    literal(): any;
    accept(visitor: any): any;
}
declare class ArrayLiteralExpressionContext extends SingleExpressionContext {
    constructor(parser: any, ctx: any);
    arrayLiteral(): any;
    accept(visitor: any): any;
}
declare class MemberDotExpressionContext extends SingleExpressionContext {
    constructor(parser: any, ctx: any);
    singleExpression(): any;
    Dot(): any;
    identifierName(): any;
    QuestionMark(): any;
    Hashtag(): any;
    accept(visitor: any): any;
}
declare class ClassExpressionContext extends SingleExpressionContext {
    constructor(parser: any, ctx: any);
    Class(): any;
    classTail(): any;
    identifier(): any;
    accept(visitor: any): any;
}
declare class MemberIndexExpressionContext extends SingleExpressionContext {
    constructor(parser: any, ctx: any);
    singleExpression(): any;
    OpenBracket(): any;
    expressionSequence(): any;
    CloseBracket(): any;
    accept(visitor: any): any;
}
declare class IdentifierExpressionContext extends SingleExpressionContext {
    constructor(parser: any, ctx: any);
    identifier(): any;
    accept(visitor: any): any;
}
declare class BitAndExpressionContext extends SingleExpressionContext {
    constructor(parser: any, ctx: any);
    singleExpression: (i: any) => any;
    BitAnd(): any;
    accept(visitor: any): any;
}
declare class BitOrExpressionContext extends SingleExpressionContext {
    constructor(parser: any, ctx: any);
    singleExpression: (i: any) => any;
    BitOr(): any;
    accept(visitor: any): any;
}
declare class AssignmentOperatorExpressionContext extends SingleExpressionContext {
    constructor(parser: any, ctx: any);
    singleExpression: (i: any) => any;
    assignmentOperator(): any;
    accept(visitor: any): any;
}
declare class VoidExpressionContext extends SingleExpressionContext {
    constructor(parser: any, ctx: any);
    Void(): any;
    singleExpression(): any;
    accept(visitor: any): any;
}
declare class CoalesceExpressionContext extends SingleExpressionContext {
    constructor(parser: any, ctx: any);
    singleExpression: (i: any) => any;
    NullCoalesce(): any;
    accept(visitor: any): any;
}
declare class AnonymousFunctionDeclContext extends AnonymousFunctionContext {
    constructor(parser: any, ctx: any);
    Function_(): any;
    OpenParen(): any;
    CloseParen(): any;
    OpenBrace(): any;
    functionBody(): any;
    CloseBrace(): any;
    Async(): any;
    Multiply(): any;
    formalParameterList(): any;
    accept(visitor: any): any;
}
declare class ArrowFunctionContext extends AnonymousFunctionContext {
    constructor(parser: any, ctx: any);
    arrowFunctionParameters(): any;
    ARROW(): any;
    arrowFunctionBody(): any;
    Async(): any;
    accept(visitor: any): any;
}
declare class FunctionDeclContext extends AnonymousFunctionContext {
    constructor(parser: any, ctx: any);
    functionDeclaration(): any;
    accept(visitor: any): any;
}
declare class QueryUnionExpressionContext extends Sql_unionContext {
    constructor(parser: any, ctx: any);
    Union(): any;
    querySpecification(): any;
    OpenParen(): any;
    queryExpression(): any;
    CloseParen(): any;
    All(): any;
    accept(visitor: any): any;
}
declare class QuerySelectExpressionContext extends QuerySpecificationContext {
    constructor(parser: any, ctx: any);
    Select(): any;
    select_list(): any;
    bind_clause(): any;
    withinClause(): any;
    fromClause(): any;
    whereClause(): any;
    produce_clause(): any;
    accept(visitor: any): any;
}
declare class QuerySelectListExpressionContext extends Select_listContext {
    constructor(parser: any, ctx: any);
    select_list_elem: (i: any) => any;
    Comma: (i: any) => any;
    accept(visitor: any): any;
}
declare class QueryFromExpressionContext extends FromClauseContext {
    constructor(parser: any, ctx: any);
    From(): any;
    dataSources(): any;
    accept(visitor: any): any;
}
declare class QueryWhereExpressionContext extends WhereClauseContext {
    constructor(parser: any, ctx: any);
    Where(): any;
    expressionSequence(): any;
    accept(visitor: any): any;
}
declare class QueryDataSourcesExpressionContext extends DataSourcesContext {
    constructor(parser: any, ctx: any);
    dataSource: (i: any) => any;
    Comma: (i: any) => any;
    accept(visitor: any): any;
}
declare class QueryDataSourceExpressionContext extends Data_source_item_joinedContext {
    constructor(parser: any, ctx: any);
    data_source_item(): any;
    using_source_clause(): any;
    join_clause: (i: any) => any;
    accept(visitor: any): any;
}
declare class QueryDataSourceItemIdentifierExpressionContext extends Data_source_itemContext {
    constructor(parser: any, ctx: any);
    identifier(): any;
    accept(visitor: any): any;
}
declare class QueryDataSourceItemUrlExpressionContext extends Data_source_itemContext {
    constructor(parser: any, ctx: any);
    Url(): any;
    accept(visitor: any): any;
}
declare class QueryDataSourceItemArgumentsExpressionContext extends Data_source_itemContext {
    constructor(parser: any, ctx: any);
    singleExpression(): any;
    arguments(): any;
    accept(visitor: any): any;
}
declare class QueryDataSourceItemSubqueryExpressionContext extends Data_source_itemContext {
    constructor(parser: any, ctx: any);
    OpenParen(): any;
    queryExpression(): any;
    CloseParen(): any;
    accept(visitor: any): any;
}
declare class QueryJoinCrossApplyExpressionContext extends Join_clauseContext {
    constructor(parser: any, ctx: any);
    Join(): any;
    dataSources(): any;
    accept(visitor: any): any;
}
declare class QueryJoinOnExpressionContext extends Join_clauseContext {
    constructor(parser: any, ctx: any);
    Join(): any;
    dataSources(): any;
    On(): any;
    singleExpression: (i: any) => any;
    Equals_(): any;
    IdentityEquals(): any;
    accept(visitor: any): any;
}
declare class QuerySourceUsingLiteralExpressionContext extends Using_source_clauseContext {
    constructor(parser: any, ctx: any);
    Using(): any;
    queryObjectLiteral(): any;
    accept(visitor: any): any;
}
declare class QuerySourceUsingSingleExpressionContext extends Using_source_clauseContext {
    constructor(parser: any, ctx: any);
    Using(): any;
    singleExpression(): any;
    accept(visitor: any): any;
}
declare class QueryProduceExpressionContext extends Produce_clauseContext {
    constructor(parser: any, ctx: any);
    Produce(): any;
    singleExpression(): any;
    accept(visitor: any): any;
}
declare class QueryBindExpressionContext extends Bind_clauseContext {
    constructor(parser: any, ctx: any);
    Using(): any;
    singleExpression(): any;
    accept(visitor: any): any;
}
declare class QueryWithinExpressionContext extends WithinClauseContext {
    constructor(parser: any, ctx: any);
    Within(): any;
    singleExpression: (i: any) => any;
    Comma: (i: any) => any;
    accept(visitor: any): any;
}
declare class SingleExpressionContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    copyFrom(ctx: any): void;
}
