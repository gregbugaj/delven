export var ECMAScriptParser: typeof ECMAScriptParser;
declare function ECMAScriptParser(input: any): any;
declare class ECMAScriptParser {
    constructor(input: any);
    _interp: any;
    ruleNames: string[];
    literalNames: (string | null)[];
    symbolicNames: (string | null)[];
    constructor: typeof ECMAScriptParser;
    get atn(): any;
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
    anoymousFunction(): AnoymousFunctionContext;
    arrowFunctionParameters(): ArrowFunctionParametersContext;
    arrowFunctionBody(): ArrowFunctionBodyContext;
    assignmentOperator(): AssignmentOperatorContext;
    literal(): LiteralContext;
    numericLiteral(): NumericLiteralContext;
    bigintLiteral(): BigintLiteralContext;
    getter(): GetterContext;
    setter(): SetterContext;
    identifierName(): IdentifierNameContext;
    identifier(): IdentifierContext;
    reservedWord(): ReservedWordContext;
    keyword(): KeywordContext;
    eos(): EosContext;
    querySelectStatement(): QuerySelectStatementContext;
    queryExpression(): QueryExpressionContext;
    sql_union(): Sql_unionContext;
    querySpecification(): QuerySpecificationContext;
    select_list(): Select_listContext;
    select_list_elem(): Select_list_elemContext;
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
    sempred(localctx: any, ruleIndex: any, predIndex: any): any;
    expressionStatement_sempred(localctx: any, predIndex: any): any;
    iterationStatement_sempred(localctx: any, predIndex: any): any;
    continueStatement_sempred(localctx: any, predIndex: any): any;
    breakStatement_sempred(localctx: any, predIndex: any): any;
    returnStatement_sempred(localctx: any, predIndex: any): any;
    throwStatement_sempred(localctx: any, predIndex: any): any;
    classElement_sempred(localctx: any, predIndex: any): any;
    singleExpression_sempred(localctx: any, predIndex: any): any;
    getter_sempred(localctx: any, predIndex: any): any;
    setter_sempred(localctx: any, predIndex: any): any;
    eos_sempred(localctx: any, predIndex: any): any;
}
declare namespace ECMAScriptParser {
    export const EOF: number;
    export const HashBangLine: number;
    export const MultiLineComment: number;
    export const SingleLineComment: number;
    export const RegularExpressionLiteral: number;
    export const OpenBracket: number;
    export const CloseBracket: number;
    export const OpenParen: number;
    export const CloseParen: number;
    export const OpenBrace: number;
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
    export const Function: number;
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
    export const Let: number;
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
    export const TemplateStringLiteral: number;
    export const WhiteSpaces: number;
    export const LineTerminator: number;
    export const NEWLINE: number;
    export const HtmlComment: number;
    export const CDataComment: number;
    export const UnexpectedCharacter: number;
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
    export const RULE_anoymousFunction: number;
    export const RULE_arrowFunctionParameters: number;
    export const RULE_arrowFunctionBody: number;
    export const RULE_assignmentOperator: number;
    export const RULE_literal: number;
    export const RULE_numericLiteral: number;
    export const RULE_bigintLiteral: number;
    export const RULE_getter: number;
    export const RULE_setter: number;
    export const RULE_identifierName: number;
    export const RULE_identifier: number;
    export const RULE_reservedWord: number;
    export const RULE_keyword: number;
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
    export { ExportDefaultDeclarationContext };
    export { ExportDeclarationContext };
    export { ExportStatementContext };
    export { ExportFromBlockContext };
    export { DeclarationContext };
    export { VariableStatementContext };
    export { VariableDeclarationListContext };
    export { VariableDeclarationContext };
    export { EmptyStatementContext };
    export { ExpressionStatementContext };
    export { IfStatementContext };
    export { DoStatementContext };
    export { WhileStatementContext };
    export { ForStatementContext };
    export { ForInStatementContext };
    export { ForOfStatementContext };
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
    export { PropertyExpressionAssignmentContext };
    export { ComputedPropertyExpressionAssignmentContext };
    export { PropertyShorthandContext };
    export { PropertySetterContext };
    export { PropertyGetterContext };
    export { FunctionPropertyContext };
    export { PropertyAssignmentContext };
    export { PropertyNameContext };
    export { ArgumentsContext };
    export { ArgumentContext };
    export { ExpressionSequenceContext };
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
    export { AssignableContext };
    export { ObjectLiteralContext };
    export { AnoymousFunctionDeclContext };
    export { ArrowFunctionContext };
    export { FunctionDeclContext };
    export { AnoymousFunctionContext };
    export { ArrowFunctionParametersContext };
    export { ArrowFunctionBodyContext };
    export { AssignmentOperatorContext };
    export { LiteralContext };
    export { NumericLiteralContext };
    export { BigintLiteralContext };
    export { GetterContext };
    export { SetterContext };
    export { IdentifierNameContext };
    export { IdentifierContext };
    export { ReservedWordContext };
    export { KeywordContext };
    export { EosContext };
    export { QuerySelectStatementContext };
    export { QueryExpressionContext };
    export { QueryUnionExpressionContext };
    export { Sql_unionContext };
    export { QuerySelectExpressionContext };
    export { QuerySpecificationContext };
    export { QuerySelectListExpressionContext };
    export { Select_listContext };
    export { Select_list_elemContext };
    export { QueryFromExpressionContext };
    export { FromClauseContext };
    export { QueryWhereExpressionContext };
    export { WhereClauseContext };
    export { QueryDataSourcesExpressionContext };
    export { DataSourcesContext };
    export { DataSourceContext };
    export { QueryDataSourceExpressionContext };
    export { Data_source_item_joinedContext };
    export { QueryDataSourceItemIdentifierExpressionContext };
    export { QueryDataSourceItemUrlExpressionContext };
    export { QueryDataSourceItemArgumentsExpressionContext };
    export { QueryDataSourceItemSubqueryExpressionContext };
    export { Data_source_itemContext };
    export { QueryJoinCrossApplyExpressionContext };
    export { QueryJoinOnExpressionContext };
    export { Join_clauseContext };
    export { QuerySourceUsingLiteralExpressionContext };
    export { QuerySourceUsingSingleExpressionContext };
    export { Using_source_clauseContext };
    export { QueryProduceExpressionContext };
    export { Produce_clauseContext };
    export { QueryBindExpressionContext };
    export { Bind_clauseContext };
    export { QueryWithinExpressionContext };
    export { WithinClauseContext };
    export { QueryObjectLiteralContext };
    export { QueryPropertyAssignmentContext };
}
declare function ProgramContext(parser: any, parent: any, invokingState: any): any;
declare class ProgramContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    constructor: typeof ProgramContext;
    EOF(): any;
    HashBangLine(): any;
    sourceElements(): any;
    accept(visitor: any): any;
}
declare function SourceElementContext(parser: any, parent: any, invokingState: any): any;
declare class SourceElementContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    constructor: typeof SourceElementContext;
    statement(): any;
    accept(visitor: any): any;
}
declare function StatementContext(parser: any, parent: any, invokingState: any): any;
declare class StatementContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    constructor: typeof StatementContext;
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
declare function BlockContext(parser: any, parent: any, invokingState: any): any;
declare class BlockContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    constructor: typeof BlockContext;
    OpenBrace(): any;
    CloseBrace(): any;
    statementList(): any;
    accept(visitor: any): any;
}
declare function StatementListContext(parser: any, parent: any, invokingState: any): any;
declare class StatementListContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    constructor: typeof StatementListContext;
    statement(i: any): any;
    accept(visitor: any): any;
}
declare function ImportStatementContext(parser: any, parent: any, invokingState: any): any;
declare class ImportStatementContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    constructor: typeof ImportStatementContext;
    Import(): any;
    importFromBlock(): any;
    accept(visitor: any): any;
}
declare function ImportFromBlockContext(parser: any, parent: any, invokingState: any): any;
declare class ImportFromBlockContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    constructor: typeof ImportFromBlockContext;
    StringLiteral(): any;
    eos(): any;
    importDefault(): any;
    Comma(): any;
    importFrom(): any;
    importNamespace(): any;
    moduleItems(): any;
    accept(visitor: any): any;
}
declare function ModuleItemsContext(parser: any, parent: any, invokingState: any): any;
declare class ModuleItemsContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    constructor: typeof ModuleItemsContext;
    OpenBrace(): any;
    CloseBrace(): any;
    aliasName(i: any): any;
    Comma(i: any): any;
    accept(visitor: any): any;
}
declare function ImportDefaultContext(parser: any, parent: any, invokingState: any): any;
declare class ImportDefaultContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    constructor: typeof ImportDefaultContext;
    aliasName(): any;
    accept(visitor: any): any;
}
declare function ImportNamespaceContext(parser: any, parent: any, invokingState: any): any;
declare class ImportNamespaceContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    constructor: typeof ImportNamespaceContext;
    Multiply(): any;
    identifierName(i: any): any;
    As(): any;
    accept(visitor: any): any;
}
declare function ImportFromContext(parser: any, parent: any, invokingState: any): any;
declare class ImportFromContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    constructor: typeof ImportFromContext;
    From(): any;
    StringLiteral(): any;
    accept(visitor: any): any;
}
declare function AliasNameContext(parser: any, parent: any, invokingState: any): any;
declare class AliasNameContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    constructor: typeof AliasNameContext;
    identifierName(i: any): any;
    As(): any;
    accept(visitor: any): any;
}
declare function ExportStatementContext(parser: any, parent: any, invokingState: any): any;
declare class ExportStatementContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    constructor: typeof ExportStatementContext;
    copyFrom(ctx: any): void;
}
declare function ExportFromBlockContext(parser: any, parent: any, invokingState: any): any;
declare class ExportFromBlockContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    constructor: typeof ExportFromBlockContext;
    importNamespace(): any;
    importFrom(): any;
    eos(): any;
    moduleItems(): any;
    accept(visitor: any): any;
}
declare function DeclarationContext(parser: any, parent: any, invokingState: any): any;
declare class DeclarationContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    constructor: typeof DeclarationContext;
    variableStatement(): any;
    classDeclaration(): any;
    functionDeclaration(): any;
    accept(visitor: any): any;
}
declare function VariableStatementContext(parser: any, parent: any, invokingState: any): any;
declare class VariableStatementContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    constructor: typeof VariableStatementContext;
    variableDeclarationList(): any;
    eos(): any;
    accept(visitor: any): any;
}
declare function VariableDeclarationListContext(parser: any, parent: any, invokingState: any): any;
declare class VariableDeclarationListContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    constructor: typeof VariableDeclarationListContext;
    varModifier(): any;
    variableDeclaration(i: any): any;
    Comma(i: any): any;
    accept(visitor: any): any;
}
declare function VariableDeclarationContext(parser: any, parent: any, invokingState: any): any;
declare class VariableDeclarationContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    constructor: typeof VariableDeclarationContext;
    assignable(): any;
    Assign(): any;
    singleExpression(): any;
    accept(visitor: any): any;
}
declare function EmptyStatementContext(parser: any, parent: any, invokingState: any): any;
declare class EmptyStatementContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    constructor: typeof EmptyStatementContext;
    SemiColon(): any;
    accept(visitor: any): any;
}
declare function ExpressionStatementContext(parser: any, parent: any, invokingState: any): any;
declare class ExpressionStatementContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    constructor: typeof ExpressionStatementContext;
    expressionSequence(): any;
    eos(): any;
    accept(visitor: any): any;
}
declare function IfStatementContext(parser: any, parent: any, invokingState: any): any;
declare class IfStatementContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    constructor: typeof IfStatementContext;
    If(): any;
    OpenParen(): any;
    expressionSequence(): any;
    CloseParen(): any;
    statement(i: any): any;
    Else(): any;
    accept(visitor: any): any;
}
declare function IterationStatementContext(parser: any, parent: any, invokingState: any): any;
declare class IterationStatementContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    constructor: typeof IterationStatementContext;
    copyFrom(ctx: any): void;
}
declare function VarModifierContext(parser: any, parent: any, invokingState: any): any;
declare class VarModifierContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    constructor: typeof VarModifierContext;
    Var(): any;
    Let(): any;
    Const(): any;
    accept(visitor: any): any;
}
declare function ContinueStatementContext(parser: any, parent: any, invokingState: any): any;
declare class ContinueStatementContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    constructor: typeof ContinueStatementContext;
    Continue(): any;
    eos(): any;
    identifier(): any;
    accept(visitor: any): any;
}
declare function BreakStatementContext(parser: any, parent: any, invokingState: any): any;
declare class BreakStatementContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    constructor: typeof BreakStatementContext;
    Break(): any;
    eos(): any;
    identifier(): any;
    accept(visitor: any): any;
}
declare function ReturnStatementContext(parser: any, parent: any, invokingState: any): any;
declare class ReturnStatementContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    constructor: typeof ReturnStatementContext;
    Return(): any;
    eos(): any;
    expressionSequence(): any;
    accept(visitor: any): any;
}
declare function WithStatementContext(parser: any, parent: any, invokingState: any): any;
declare class WithStatementContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    constructor: typeof WithStatementContext;
    With(): any;
    OpenParen(): any;
    expressionSequence(): any;
    CloseParen(): any;
    statement(): any;
    accept(visitor: any): any;
}
declare function SwitchStatementContext(parser: any, parent: any, invokingState: any): any;
declare class SwitchStatementContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    constructor: typeof SwitchStatementContext;
    Switch(): any;
    OpenParen(): any;
    expressionSequence(): any;
    CloseParen(): any;
    caseBlock(): any;
    accept(visitor: any): any;
}
declare function CaseBlockContext(parser: any, parent: any, invokingState: any): any;
declare class CaseBlockContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    constructor: typeof CaseBlockContext;
    OpenBrace(): any;
    CloseBrace(): any;
    caseClauses(i: any): any;
    defaultClause(): any;
    accept(visitor: any): any;
}
declare function CaseClausesContext(parser: any, parent: any, invokingState: any): any;
declare class CaseClausesContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    constructor: typeof CaseClausesContext;
    caseClause(i: any): any;
    accept(visitor: any): any;
}
declare function CaseClauseContext(parser: any, parent: any, invokingState: any): any;
declare class CaseClauseContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    constructor: typeof CaseClauseContext;
    Case(): any;
    expressionSequence(): any;
    Colon(): any;
    statementList(): any;
    accept(visitor: any): any;
}
declare function DefaultClauseContext(parser: any, parent: any, invokingState: any): any;
declare class DefaultClauseContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    constructor: typeof DefaultClauseContext;
    Default(): any;
    Colon(): any;
    statementList(): any;
    accept(visitor: any): any;
}
declare function LabelledStatementContext(parser: any, parent: any, invokingState: any): any;
declare class LabelledStatementContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    constructor: typeof LabelledStatementContext;
    identifier(): any;
    Colon(): any;
    statement(): any;
    accept(visitor: any): any;
}
declare function ThrowStatementContext(parser: any, parent: any, invokingState: any): any;
declare class ThrowStatementContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    constructor: typeof ThrowStatementContext;
    Throw(): any;
    expressionSequence(): any;
    eos(): any;
    accept(visitor: any): any;
}
declare function TryStatementContext(parser: any, parent: any, invokingState: any): any;
declare class TryStatementContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    constructor: typeof TryStatementContext;
    Try(): any;
    block(): any;
    catchProduction(): any;
    finallyProduction(): any;
    accept(visitor: any): any;
}
declare function CatchProductionContext(parser: any, parent: any, invokingState: any): any;
declare class CatchProductionContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    constructor: typeof CatchProductionContext;
    Catch(): any;
    block(): any;
    OpenParen(): any;
    CloseParen(): any;
    assignable(): any;
    accept(visitor: any): any;
}
declare function FinallyProductionContext(parser: any, parent: any, invokingState: any): any;
declare class FinallyProductionContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    constructor: typeof FinallyProductionContext;
    Finally(): any;
    block(): any;
    accept(visitor: any): any;
}
declare function DebuggerStatementContext(parser: any, parent: any, invokingState: any): any;
declare class DebuggerStatementContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    constructor: typeof DebuggerStatementContext;
    Debugger(): any;
    eos(): any;
    accept(visitor: any): any;
}
declare function FunctionDeclarationContext(parser: any, parent: any, invokingState: any): any;
declare class FunctionDeclarationContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    constructor: typeof FunctionDeclarationContext;
    Function(): any;
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
declare function ClassDeclarationContext(parser: any, parent: any, invokingState: any): any;
declare class ClassDeclarationContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    constructor: typeof ClassDeclarationContext;
    Class(): any;
    identifier(): any;
    classTail(): any;
    accept(visitor: any): any;
}
declare function ClassTailContext(parser: any, parent: any, invokingState: any): any;
declare class ClassTailContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    constructor: typeof ClassTailContext;
    OpenBrace(): any;
    CloseBrace(): any;
    classHeritage(): any;
    classElement(i: any): any;
    accept(visitor: any): any;
}
declare function ClassHeritageContext(parser: any, parent: any, invokingState: any): any;
declare class ClassHeritageContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    constructor: typeof ClassHeritageContext;
    Extends(): any;
    singleExpression(): any;
    accept(visitor: any): any;
}
declare function ClassElementContext(parser: any, parent: any, invokingState: any): any;
declare class ClassElementContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    constructor: typeof ClassElementContext;
    methodDefinition(): any;
    Static(i: any): any;
    identifier(i: any): any;
    Async(i: any): any;
    emptyStatement(): any;
    propertyName(): any;
    Assign(): any;
    singleExpression(): any;
    Hashtag(): any;
    accept(visitor: any): any;
}
declare function MethodDefinitionContext(parser: any, parent: any, invokingState: any): any;
declare class MethodDefinitionContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    constructor: typeof MethodDefinitionContext;
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
declare function FormalParameterListContext(parser: any, parent: any, invokingState: any): any;
declare class FormalParameterListContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    constructor: typeof FormalParameterListContext;
    formalParameterArg(i: any): any;
    Comma(i: any): any;
    lastFormalParameterArg(): any;
    accept(visitor: any): any;
}
declare function FormalParameterArgContext(parser: any, parent: any, invokingState: any): any;
declare class FormalParameterArgContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    constructor: typeof FormalParameterArgContext;
    assignable(): any;
    Assign(): any;
    singleExpression(): any;
    accept(visitor: any): any;
}
declare function LastFormalParameterArgContext(parser: any, parent: any, invokingState: any): any;
declare class LastFormalParameterArgContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    constructor: typeof LastFormalParameterArgContext;
    Ellipsis(): any;
    singleExpression(): any;
    accept(visitor: any): any;
}
declare function FunctionBodyContext(parser: any, parent: any, invokingState: any): any;
declare class FunctionBodyContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    constructor: typeof FunctionBodyContext;
    sourceElements(): any;
    accept(visitor: any): any;
}
declare function SourceElementsContext(parser: any, parent: any, invokingState: any): any;
declare class SourceElementsContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    constructor: typeof SourceElementsContext;
    sourceElement(i: any): any;
    accept(visitor: any): any;
}
declare function ArrayLiteralContext(parser: any, parent: any, invokingState: any): any;
declare class ArrayLiteralContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    constructor: typeof ArrayLiteralContext;
    OpenBracket(): any;
    elementList(): any;
    CloseBracket(): any;
    accept(visitor: any): any;
}
declare function ElementListContext(parser: any, parent: any, invokingState: any): any;
declare class ElementListContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    constructor: typeof ElementListContext;
    Comma(i: any): any;
    arrayElement(i: any): any;
    accept(visitor: any): any;
}
declare function ArrayElementContext(parser: any, parent: any, invokingState: any): any;
declare class ArrayElementContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    constructor: typeof ArrayElementContext;
    singleExpression(): any;
    Ellipsis(): any;
    accept(visitor: any): any;
}
declare function PropertyAssignmentContext(parser: any, parent: any, invokingState: any): any;
declare class PropertyAssignmentContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    constructor: typeof PropertyAssignmentContext;
    copyFrom(ctx: any): void;
}
declare function PropertyNameContext(parser: any, parent: any, invokingState: any): any;
declare class PropertyNameContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    constructor: typeof PropertyNameContext;
    identifierName(): any;
    StringLiteral(): any;
    numericLiteral(): any;
    OpenBracket(): any;
    singleExpression(): any;
    CloseBracket(): any;
    accept(visitor: any): any;
}
declare function ArgumentsContext(parser: any, parent: any, invokingState: any): any;
declare class ArgumentsContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    constructor: typeof ArgumentsContext;
    OpenParen(): any;
    CloseParen(): any;
    argument(i: any): any;
    Comma(i: any): any;
    accept(visitor: any): any;
}
declare function ArgumentContext(parser: any, parent: any, invokingState: any): any;
declare class ArgumentContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    constructor: typeof ArgumentContext;
    singleExpression(): any;
    identifier(): any;
    Ellipsis(): any;
    accept(visitor: any): any;
}
declare function ExpressionSequenceContext(parser: any, parent: any, invokingState: any): any;
declare class ExpressionSequenceContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    constructor: typeof ExpressionSequenceContext;
    singleExpression(i: any): any;
    Comma(i: any): any;
    accept(visitor: any): any;
}
declare function AssignableContext(parser: any, parent: any, invokingState: any): any;
declare class AssignableContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    constructor: typeof AssignableContext;
    identifier(): any;
    arrayLiteral(): any;
    objectLiteral(): any;
    accept(visitor: any): any;
}
declare function ObjectLiteralContext(parser: any, parent: any, invokingState: any): any;
declare class ObjectLiteralContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    constructor: typeof ObjectLiteralContext;
    OpenBrace(): any;
    CloseBrace(): any;
    propertyAssignment(i: any): any;
    Comma(i: any): any;
    accept(visitor: any): any;
}
declare function AnoymousFunctionContext(parser: any, parent: any, invokingState: any): any;
declare class AnoymousFunctionContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    constructor: typeof AnoymousFunctionContext;
    copyFrom(ctx: any): void;
}
declare function ArrowFunctionParametersContext(parser: any, parent: any, invokingState: any): any;
declare class ArrowFunctionParametersContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    constructor: typeof ArrowFunctionParametersContext;
    identifier(): any;
    OpenParen(): any;
    CloseParen(): any;
    formalParameterList(): any;
    accept(visitor: any): any;
}
declare function ArrowFunctionBodyContext(parser: any, parent: any, invokingState: any): any;
declare class ArrowFunctionBodyContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    constructor: typeof ArrowFunctionBodyContext;
    OpenBrace(): any;
    functionBody(): any;
    CloseBrace(): any;
    singleExpression(): any;
    accept(visitor: any): any;
}
declare function AssignmentOperatorContext(parser: any, parent: any, invokingState: any): any;
declare class AssignmentOperatorContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    constructor: typeof AssignmentOperatorContext;
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
declare function LiteralContext(parser: any, parent: any, invokingState: any): any;
declare class LiteralContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    constructor: typeof LiteralContext;
    NullLiteral(): any;
    BooleanLiteral(): any;
    StringLiteral(): any;
    TemplateStringLiteral(): any;
    RegularExpressionLiteral(): any;
    numericLiteral(): any;
    bigintLiteral(): any;
    accept(visitor: any): any;
}
declare function NumericLiteralContext(parser: any, parent: any, invokingState: any): any;
declare class NumericLiteralContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    constructor: typeof NumericLiteralContext;
    DecimalLiteral(): any;
    HexIntegerLiteral(): any;
    OctalIntegerLiteral(): any;
    OctalIntegerLiteral2(): any;
    BinaryIntegerLiteral(): any;
    accept(visitor: any): any;
}
declare function BigintLiteralContext(parser: any, parent: any, invokingState: any): any;
declare class BigintLiteralContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    constructor: typeof BigintLiteralContext;
    BigDecimalIntegerLiteral(): any;
    BigHexIntegerLiteral(): any;
    BigOctalIntegerLiteral(): any;
    BigBinaryIntegerLiteral(): any;
    accept(visitor: any): any;
}
declare function GetterContext(parser: any, parent: any, invokingState: any): any;
declare class GetterContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    constructor: typeof GetterContext;
    identifier(): any;
    propertyName(): any;
    accept(visitor: any): any;
}
declare function SetterContext(parser: any, parent: any, invokingState: any): any;
declare class SetterContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    constructor: typeof SetterContext;
    identifier(): any;
    propertyName(): any;
    accept(visitor: any): any;
}
declare function IdentifierNameContext(parser: any, parent: any, invokingState: any): any;
declare class IdentifierNameContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    constructor: typeof IdentifierNameContext;
    Identifier(): any;
    reservedWord(): any;
    accept(visitor: any): any;
}
declare function IdentifierContext(parser: any, parent: any, invokingState: any): any;
declare class IdentifierContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    constructor: typeof IdentifierContext;
    Identifier(): any;
    NonStrictLet(): any;
    Async(): any;
    accept(visitor: any): any;
}
declare function ReservedWordContext(parser: any, parent: any, invokingState: any): any;
declare class ReservedWordContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    constructor: typeof ReservedWordContext;
    keyword(): any;
    NullLiteral(): any;
    BooleanLiteral(): any;
    accept(visitor: any): any;
}
declare function KeywordContext(parser: any, parent: any, invokingState: any): any;
declare class KeywordContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    constructor: typeof KeywordContext;
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
    Function(): any;
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
    Let(): any;
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
declare function EosContext(parser: any, parent: any, invokingState: any): any;
declare class EosContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    constructor: typeof EosContext;
    SemiColon(): any;
    EOF(): any;
    accept(visitor: any): any;
}
declare function QuerySelectStatementContext(parser: any, parent: any, invokingState: any): any;
declare class QuerySelectStatementContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    constructor: typeof QuerySelectStatementContext;
    queryExpression(): any;
    accept(visitor: any): any;
}
declare function QueryExpressionContext(parser: any, parent: any, invokingState: any): any;
declare class QueryExpressionContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    constructor: typeof QueryExpressionContext;
    querySpecification(): any;
    OpenParen(): any;
    queryExpression(): any;
    CloseParen(): any;
    sql_union(i: any): any;
    accept(visitor: any): any;
}
declare function Sql_unionContext(parser: any, parent: any, invokingState: any): any;
declare class Sql_unionContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    constructor: typeof Sql_unionContext;
    copyFrom(ctx: any): void;
}
declare function QuerySpecificationContext(parser: any, parent: any, invokingState: any): any;
declare class QuerySpecificationContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    constructor: typeof QuerySpecificationContext;
    copyFrom(ctx: any): void;
}
declare function Select_listContext(parser: any, parent: any, invokingState: any): any;
declare class Select_listContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    constructor: typeof Select_listContext;
    copyFrom(ctx: any): void;
}
declare function Select_list_elemContext(parser: any, parent: any, invokingState: any): any;
declare class Select_list_elemContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    constructor: typeof Select_list_elemContext;
    Multiply(): any;
    identifier(): any;
    As(): any;
    identifierName(): any;
    singleExpression(): any;
    argument(): any;
    accept(visitor: any): any;
}
declare function FromClauseContext(parser: any, parent: any, invokingState: any): any;
declare class FromClauseContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    constructor: typeof FromClauseContext;
    copyFrom(ctx: any): void;
}
declare function WhereClauseContext(parser: any, parent: any, invokingState: any): any;
declare class WhereClauseContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    constructor: typeof WhereClauseContext;
    copyFrom(ctx: any): void;
}
declare function DataSourcesContext(parser: any, parent: any, invokingState: any): any;
declare class DataSourcesContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    constructor: typeof DataSourcesContext;
    copyFrom(ctx: any): void;
}
declare function DataSourceContext(parser: any, parent: any, invokingState: any): any;
declare class DataSourceContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    constructor: typeof DataSourceContext;
    data_source_item_joined(): any;
    OpenParen(): any;
    CloseParen(): any;
    accept(visitor: any): any;
}
declare function Data_source_item_joinedContext(parser: any, parent: any, invokingState: any): any;
declare class Data_source_item_joinedContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    constructor: typeof Data_source_item_joinedContext;
    copyFrom(ctx: any): void;
}
declare function Data_source_itemContext(parser: any, parent: any, invokingState: any): any;
declare class Data_source_itemContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    constructor: typeof Data_source_itemContext;
    copyFrom(ctx: any): void;
}
declare function Join_clauseContext(parser: any, parent: any, invokingState: any): any;
declare class Join_clauseContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    constructor: typeof Join_clauseContext;
    copyFrom(ctx: any): void;
}
declare function Using_source_clauseContext(parser: any, parent: any, invokingState: any): any;
declare class Using_source_clauseContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    constructor: typeof Using_source_clauseContext;
    copyFrom(ctx: any): void;
}
declare function Produce_clauseContext(parser: any, parent: any, invokingState: any): any;
declare class Produce_clauseContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    constructor: typeof Produce_clauseContext;
    copyFrom(ctx: any): void;
}
declare function Bind_clauseContext(parser: any, parent: any, invokingState: any): any;
declare class Bind_clauseContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    constructor: typeof Bind_clauseContext;
    copyFrom(ctx: any): void;
}
declare function WithinClauseContext(parser: any, parent: any, invokingState: any): any;
declare class WithinClauseContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    constructor: typeof WithinClauseContext;
    copyFrom(ctx: any): void;
}
declare function QueryObjectLiteralContext(parser: any, parent: any, invokingState: any): any;
declare class QueryObjectLiteralContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    constructor: typeof QueryObjectLiteralContext;
    OpenBrace(): any;
    CloseBrace(): any;
    queryPropertyAssignment(i: any): any;
    Comma(i: any): any;
    accept(visitor: any): any;
}
declare function QueryPropertyAssignmentContext(parser: any, parent: any, invokingState: any): any;
declare class QueryPropertyAssignmentContext {
    constructor(parser: any, parent: any, invokingState: any);
    parser: any;
    ruleIndex: number;
    constructor: typeof QueryPropertyAssignmentContext;
    propertyName(): any;
    Colon(): any;
    singleExpression(): any;
    accept(visitor: any): any;
}
declare function ExportDefaultDeclarationContext(parser: any, ctx: any): any;
declare class ExportDefaultDeclarationContext {
    constructor(parser: any, ctx: any);
    constructor: typeof ExportDefaultDeclarationContext;
    Export(): any;
    Default(): any;
    eos(): any;
    classDeclaration(): any;
    functionDeclaration(): any;
    singleExpression(): any;
    accept(visitor: any): any;
}
declare function ExportDeclarationContext(parser: any, ctx: any): any;
declare class ExportDeclarationContext {
    constructor(parser: any, ctx: any);
    constructor: typeof ExportDeclarationContext;
    Export(): any;
    eos(): any;
    exportFromBlock(): any;
    declaration(): any;
    accept(visitor: any): any;
}
declare function DoStatementContext(parser: any, ctx: any): any;
declare class DoStatementContext {
    constructor(parser: any, ctx: any);
    constructor: typeof DoStatementContext;
    Do(): any;
    statement(): any;
    While(): any;
    OpenParen(): any;
    expressionSequence(): any;
    CloseParen(): any;
    eos(): any;
    accept(visitor: any): any;
}
declare function WhileStatementContext(parser: any, ctx: any): any;
declare class WhileStatementContext {
    constructor(parser: any, ctx: any);
    constructor: typeof WhileStatementContext;
    While(): any;
    OpenParen(): any;
    expressionSequence(): any;
    CloseParen(): any;
    statement(): any;
    accept(visitor: any): any;
}
declare function ForStatementContext(parser: any, ctx: any): any;
declare class ForStatementContext {
    constructor(parser: any, ctx: any);
    constructor: typeof ForStatementContext;
    For(): any;
    OpenParen(): any;
    SemiColon(i: any): any;
    CloseParen(): any;
    statement(): any;
    expressionSequence(i: any): any;
    variableDeclarationList(): any;
    accept(visitor: any): any;
}
declare function ForInStatementContext(parser: any, ctx: any): any;
declare class ForInStatementContext {
    constructor(parser: any, ctx: any);
    constructor: typeof ForInStatementContext;
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
declare function ForOfStatementContext(parser: any, ctx: any): any;
declare class ForOfStatementContext {
    constructor(parser: any, ctx: any);
    constructor: typeof ForOfStatementContext;
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
declare function PropertyExpressionAssignmentContext(parser: any, ctx: any): any;
declare class PropertyExpressionAssignmentContext {
    constructor(parser: any, ctx: any);
    constructor: typeof PropertyExpressionAssignmentContext;
    propertyName(): any;
    Colon(): any;
    singleExpression(): any;
    accept(visitor: any): any;
}
declare function ComputedPropertyExpressionAssignmentContext(parser: any, ctx: any): any;
declare class ComputedPropertyExpressionAssignmentContext {
    constructor(parser: any, ctx: any);
    constructor: typeof ComputedPropertyExpressionAssignmentContext;
    OpenBracket(): any;
    singleExpression(i: any): any;
    CloseBracket(): any;
    Colon(): any;
    accept(visitor: any): any;
}
declare function PropertyShorthandContext(parser: any, ctx: any): any;
declare class PropertyShorthandContext {
    constructor(parser: any, ctx: any);
    constructor: typeof PropertyShorthandContext;
    singleExpression(): any;
    Ellipsis(): any;
    accept(visitor: any): any;
}
declare function PropertySetterContext(parser: any, ctx: any): any;
declare class PropertySetterContext {
    constructor(parser: any, ctx: any);
    constructor: typeof PropertySetterContext;
    setter(): any;
    OpenParen(): any;
    formalParameterArg(): any;
    CloseParen(): any;
    OpenBrace(): any;
    functionBody(): any;
    CloseBrace(): any;
    accept(visitor: any): any;
}
declare function PropertyGetterContext(parser: any, ctx: any): any;
declare class PropertyGetterContext {
    constructor(parser: any, ctx: any);
    constructor: typeof PropertyGetterContext;
    getter(): any;
    OpenParen(): any;
    CloseParen(): any;
    OpenBrace(): any;
    functionBody(): any;
    CloseBrace(): any;
    accept(visitor: any): any;
}
declare function FunctionPropertyContext(parser: any, ctx: any): any;
declare class FunctionPropertyContext {
    constructor(parser: any, ctx: any);
    constructor: typeof FunctionPropertyContext;
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
declare function TemplateStringExpressionContext(parser: any, ctx: any): any;
declare class TemplateStringExpressionContext {
    constructor(parser: any, ctx: any);
    constructor: typeof TemplateStringExpressionContext;
    singleExpression(): any;
    TemplateStringLiteral(): any;
    accept(visitor: any): any;
}
declare function TernaryExpressionContext(parser: any, ctx: any): any;
declare class TernaryExpressionContext {
    constructor(parser: any, ctx: any);
    constructor: typeof TernaryExpressionContext;
    singleExpression(i: any): any;
    QuestionMark(): any;
    Colon(): any;
    accept(visitor: any): any;
}
declare function LogicalAndExpressionContext(parser: any, ctx: any): any;
declare class LogicalAndExpressionContext {
    constructor(parser: any, ctx: any);
    constructor: typeof LogicalAndExpressionContext;
    singleExpression(i: any): any;
    And(): any;
    accept(visitor: any): any;
}
declare function PowerExpressionContext(parser: any, ctx: any): any;
declare class PowerExpressionContext {
    constructor(parser: any, ctx: any);
    constructor: typeof PowerExpressionContext;
    singleExpression(i: any): any;
    Power(): any;
    accept(visitor: any): any;
}
declare function PreIncrementExpressionContext(parser: any, ctx: any): any;
declare class PreIncrementExpressionContext {
    constructor(parser: any, ctx: any);
    constructor: typeof PreIncrementExpressionContext;
    PlusPlus(): any;
    singleExpression(): any;
    accept(visitor: any): any;
}
declare function ObjectLiteralExpressionContext(parser: any, ctx: any): any;
declare class ObjectLiteralExpressionContext {
    constructor(parser: any, ctx: any);
    constructor: typeof ObjectLiteralExpressionContext;
    objectLiteral(): any;
    accept(visitor: any): any;
}
declare function MetaExpressionContext(parser: any, ctx: any): any;
declare class MetaExpressionContext {
    constructor(parser: any, ctx: any);
    constructor: typeof MetaExpressionContext;
    New(): any;
    Dot(): any;
    identifier(): any;
    accept(visitor: any): any;
}
declare function InExpressionContext(parser: any, ctx: any): any;
declare class InExpressionContext {
    constructor(parser: any, ctx: any);
    constructor: typeof InExpressionContext;
    singleExpression(i: any): any;
    In(): any;
    accept(visitor: any): any;
}
declare function LogicalOrExpressionContext(parser: any, ctx: any): any;
declare class LogicalOrExpressionContext {
    constructor(parser: any, ctx: any);
    constructor: typeof LogicalOrExpressionContext;
    singleExpression(i: any): any;
    Or(): any;
    accept(visitor: any): any;
}
declare function NotExpressionContext(parser: any, ctx: any): any;
declare class NotExpressionContext {
    constructor(parser: any, ctx: any);
    constructor: typeof NotExpressionContext;
    Not(): any;
    singleExpression(): any;
    accept(visitor: any): any;
}
declare function PreDecreaseExpressionContext(parser: any, ctx: any): any;
declare class PreDecreaseExpressionContext {
    constructor(parser: any, ctx: any);
    constructor: typeof PreDecreaseExpressionContext;
    MinusMinus(): any;
    singleExpression(): any;
    accept(visitor: any): any;
}
declare function ArgumentsExpressionContext(parser: any, ctx: any): any;
declare class ArgumentsExpressionContext {
    constructor(parser: any, ctx: any);
    constructor: typeof ArgumentsExpressionContext;
    singleExpression(): any;
    arguments(): any;
    accept(visitor: any): any;
}
declare function AwaitExpressionContext(parser: any, ctx: any): any;
declare class AwaitExpressionContext {
    constructor(parser: any, ctx: any);
    constructor: typeof AwaitExpressionContext;
    Await(): any;
    singleExpression(): any;
    accept(visitor: any): any;
}
declare function ThisExpressionContext(parser: any, ctx: any): any;
declare class ThisExpressionContext {
    constructor(parser: any, ctx: any);
    constructor: typeof ThisExpressionContext;
    This(): any;
    accept(visitor: any): any;
}
declare function FunctionExpressionContext(parser: any, ctx: any): any;
declare class FunctionExpressionContext {
    constructor(parser: any, ctx: any);
    constructor: typeof FunctionExpressionContext;
    anoymousFunction(): any;
    accept(visitor: any): any;
}
declare function UnaryMinusExpressionContext(parser: any, ctx: any): any;
declare class UnaryMinusExpressionContext {
    constructor(parser: any, ctx: any);
    constructor: typeof UnaryMinusExpressionContext;
    Minus(): any;
    singleExpression(): any;
    accept(visitor: any): any;
}
declare function AssignmentExpressionContext(parser: any, ctx: any): any;
declare class AssignmentExpressionContext {
    constructor(parser: any, ctx: any);
    constructor: typeof AssignmentExpressionContext;
    singleExpression(i: any): any;
    Assign(): any;
    accept(visitor: any): any;
}
declare function PostDecreaseExpressionContext(parser: any, ctx: any): any;
declare class PostDecreaseExpressionContext {
    constructor(parser: any, ctx: any);
    constructor: typeof PostDecreaseExpressionContext;
    singleExpression(): any;
    MinusMinus(): any;
    accept(visitor: any): any;
}
declare function MemberNewExpressionContext(parser: any, ctx: any): any;
declare class MemberNewExpressionContext {
    constructor(parser: any, ctx: any);
    constructor: typeof MemberNewExpressionContext;
    New(): any;
    singleExpression(): any;
    Dot(): any;
    identifierName(): any;
    arguments(): any;
    accept(visitor: any): any;
}
declare function TypeofExpressionContext(parser: any, ctx: any): any;
declare class TypeofExpressionContext {
    constructor(parser: any, ctx: any);
    constructor: typeof TypeofExpressionContext;
    Typeof(): any;
    singleExpression(): any;
    accept(visitor: any): any;
}
declare function InstanceofExpressionContext(parser: any, ctx: any): any;
declare class InstanceofExpressionContext {
    constructor(parser: any, ctx: any);
    constructor: typeof InstanceofExpressionContext;
    singleExpression(i: any): any;
    Instanceof(): any;
    accept(visitor: any): any;
}
declare function UnaryPlusExpressionContext(parser: any, ctx: any): any;
declare class UnaryPlusExpressionContext {
    constructor(parser: any, ctx: any);
    constructor: typeof UnaryPlusExpressionContext;
    Plus(): any;
    singleExpression(): any;
    accept(visitor: any): any;
}
declare function DeleteExpressionContext(parser: any, ctx: any): any;
declare class DeleteExpressionContext {
    constructor(parser: any, ctx: any);
    constructor: typeof DeleteExpressionContext;
    Delete(): any;
    singleExpression(): any;
    accept(visitor: any): any;
}
declare function InlinedQueryExpressionContext(parser: any, ctx: any): any;
declare class InlinedQueryExpressionContext {
    constructor(parser: any, ctx: any);
    constructor: typeof InlinedQueryExpressionContext;
    queryExpression(): any;
    accept(visitor: any): any;
}
declare function ImportExpressionContext(parser: any, ctx: any): any;
declare class ImportExpressionContext {
    constructor(parser: any, ctx: any);
    constructor: typeof ImportExpressionContext;
    Import(): any;
    OpenParen(): any;
    singleExpression(): any;
    CloseParen(): any;
    accept(visitor: any): any;
}
declare function EqualityExpressionContext(parser: any, ctx: any): any;
declare class EqualityExpressionContext {
    constructor(parser: any, ctx: any);
    constructor: typeof EqualityExpressionContext;
    singleExpression(i: any): any;
    Equals_(): any;
    NotEquals(): any;
    IdentityEquals(): any;
    IdentityNotEquals(): any;
    accept(visitor: any): any;
}
declare function BitXOrExpressionContext(parser: any, ctx: any): any;
declare class BitXOrExpressionContext {
    constructor(parser: any, ctx: any);
    constructor: typeof BitXOrExpressionContext;
    singleExpression(i: any): any;
    BitXOr(): any;
    accept(visitor: any): any;
}
declare function SuperExpressionContext(parser: any, ctx: any): any;
declare class SuperExpressionContext {
    constructor(parser: any, ctx: any);
    constructor: typeof SuperExpressionContext;
    Super(): any;
    accept(visitor: any): any;
}
declare function MultiplicativeExpressionContext(parser: any, ctx: any): any;
declare class MultiplicativeExpressionContext {
    constructor(parser: any, ctx: any);
    constructor: typeof MultiplicativeExpressionContext;
    singleExpression(i: any): any;
    Multiply(): any;
    Divide(): any;
    Modulus(): any;
    accept(visitor: any): any;
}
declare function BitShiftExpressionContext(parser: any, ctx: any): any;
declare class BitShiftExpressionContext {
    constructor(parser: any, ctx: any);
    constructor: typeof BitShiftExpressionContext;
    singleExpression(i: any): any;
    LeftShiftArithmetic(): any;
    RightShiftArithmetic(): any;
    RightShiftLogical(): any;
    accept(visitor: any): any;
}
declare function ParenthesizedExpressionContext(parser: any, ctx: any): any;
declare class ParenthesizedExpressionContext {
    constructor(parser: any, ctx: any);
    constructor: typeof ParenthesizedExpressionContext;
    OpenParen(): any;
    expressionSequence(): any;
    CloseParen(): any;
    accept(visitor: any): any;
}
declare function AdditiveExpressionContext(parser: any, ctx: any): any;
declare class AdditiveExpressionContext {
    constructor(parser: any, ctx: any);
    constructor: typeof AdditiveExpressionContext;
    singleExpression(i: any): any;
    Plus(): any;
    Minus(): any;
    accept(visitor: any): any;
}
declare function RelationalExpressionContext(parser: any, ctx: any): any;
declare class RelationalExpressionContext {
    constructor(parser: any, ctx: any);
    constructor: typeof RelationalExpressionContext;
    singleExpression(i: any): any;
    LessThan(): any;
    MoreThan(): any;
    LessThanEquals(): any;
    GreaterThanEquals(): any;
    accept(visitor: any): any;
}
declare function PostIncrementExpressionContext(parser: any, ctx: any): any;
declare class PostIncrementExpressionContext {
    constructor(parser: any, ctx: any);
    constructor: typeof PostIncrementExpressionContext;
    singleExpression(): any;
    PlusPlus(): any;
    accept(visitor: any): any;
}
declare function YieldExpressionContext(parser: any, ctx: any): any;
declare class YieldExpressionContext {
    constructor(parser: any, ctx: any);
    constructor: typeof YieldExpressionContext;
    Yield(): any;
    expressionSequence(): any;
    Multiply(): any;
    accept(visitor: any): any;
}
declare function BitNotExpressionContext(parser: any, ctx: any): any;
declare class BitNotExpressionContext {
    constructor(parser: any, ctx: any);
    constructor: typeof BitNotExpressionContext;
    BitNot(): any;
    singleExpression(): any;
    accept(visitor: any): any;
}
declare function NewExpressionContext(parser: any, ctx: any): any;
declare class NewExpressionContext {
    constructor(parser: any, ctx: any);
    constructor: typeof NewExpressionContext;
    New(): any;
    singleExpression(): any;
    arguments(): any;
    accept(visitor: any): any;
}
declare function LiteralExpressionContext(parser: any, ctx: any): any;
declare class LiteralExpressionContext {
    constructor(parser: any, ctx: any);
    constructor: typeof LiteralExpressionContext;
    literal(): any;
    accept(visitor: any): any;
}
declare function ArrayLiteralExpressionContext(parser: any, ctx: any): any;
declare class ArrayLiteralExpressionContext {
    constructor(parser: any, ctx: any);
    constructor: typeof ArrayLiteralExpressionContext;
    arrayLiteral(): any;
    accept(visitor: any): any;
}
declare function MemberDotExpressionContext(parser: any, ctx: any): any;
declare class MemberDotExpressionContext {
    constructor(parser: any, ctx: any);
    constructor: typeof MemberDotExpressionContext;
    singleExpression(): any;
    Dot(): any;
    identifierName(): any;
    QuestionMark(): any;
    Hashtag(): any;
    accept(visitor: any): any;
}
declare function ClassExpressionContext(parser: any, ctx: any): any;
declare class ClassExpressionContext {
    constructor(parser: any, ctx: any);
    constructor: typeof ClassExpressionContext;
    Class(): any;
    classTail(): any;
    identifier(): any;
    accept(visitor: any): any;
}
declare function MemberIndexExpressionContext(parser: any, ctx: any): any;
declare class MemberIndexExpressionContext {
    constructor(parser: any, ctx: any);
    constructor: typeof MemberIndexExpressionContext;
    singleExpression(): any;
    OpenBracket(): any;
    expressionSequence(): any;
    CloseBracket(): any;
    accept(visitor: any): any;
}
declare function IdentifierExpressionContext(parser: any, ctx: any): any;
declare class IdentifierExpressionContext {
    constructor(parser: any, ctx: any);
    constructor: typeof IdentifierExpressionContext;
    identifier(): any;
    accept(visitor: any): any;
}
declare function BitAndExpressionContext(parser: any, ctx: any): any;
declare class BitAndExpressionContext {
    constructor(parser: any, ctx: any);
    constructor: typeof BitAndExpressionContext;
    singleExpression(i: any): any;
    BitAnd(): any;
    accept(visitor: any): any;
}
declare function BitOrExpressionContext(parser: any, ctx: any): any;
declare class BitOrExpressionContext {
    constructor(parser: any, ctx: any);
    constructor: typeof BitOrExpressionContext;
    singleExpression(i: any): any;
    BitOr(): any;
    accept(visitor: any): any;
}
declare function AssignmentOperatorExpressionContext(parser: any, ctx: any): any;
declare class AssignmentOperatorExpressionContext {
    constructor(parser: any, ctx: any);
    constructor: typeof AssignmentOperatorExpressionContext;
    singleExpression(i: any): any;
    assignmentOperator(): any;
    accept(visitor: any): any;
}
declare function VoidExpressionContext(parser: any, ctx: any): any;
declare class VoidExpressionContext {
    constructor(parser: any, ctx: any);
    constructor: typeof VoidExpressionContext;
    Void(): any;
    singleExpression(): any;
    accept(visitor: any): any;
}
declare function CoalesceExpressionContext(parser: any, ctx: any): any;
declare class CoalesceExpressionContext {
    constructor(parser: any, ctx: any);
    constructor: typeof CoalesceExpressionContext;
    singleExpression(i: any): any;
    NullCoalesce(): any;
    accept(visitor: any): any;
}
declare function AnoymousFunctionDeclContext(parser: any, ctx: any): any;
declare class AnoymousFunctionDeclContext {
    constructor(parser: any, ctx: any);
    constructor: typeof AnoymousFunctionDeclContext;
    Function(): any;
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
declare function ArrowFunctionContext(parser: any, ctx: any): any;
declare class ArrowFunctionContext {
    constructor(parser: any, ctx: any);
    constructor: typeof ArrowFunctionContext;
    arrowFunctionParameters(): any;
    ARROW(): any;
    arrowFunctionBody(): any;
    Async(): any;
    accept(visitor: any): any;
}
declare function FunctionDeclContext(parser: any, ctx: any): any;
declare class FunctionDeclContext {
    constructor(parser: any, ctx: any);
    constructor: typeof FunctionDeclContext;
    functionDeclaration(): any;
    accept(visitor: any): any;
}
declare function QueryUnionExpressionContext(parser: any, ctx: any): any;
declare class QueryUnionExpressionContext {
    constructor(parser: any, ctx: any);
    constructor: typeof QueryUnionExpressionContext;
    Union(): any;
    querySpecification(): any;
    OpenParen(): any;
    queryExpression(): any;
    CloseParen(): any;
    All(): any;
    accept(visitor: any): any;
}
declare function QuerySelectExpressionContext(parser: any, ctx: any): any;
declare class QuerySelectExpressionContext {
    constructor(parser: any, ctx: any);
    constructor: typeof QuerySelectExpressionContext;
    Select(): any;
    select_list(): any;
    bind_clause(): any;
    withinClause(): any;
    fromClause(): any;
    whereClause(): any;
    produce_clause(): any;
    accept(visitor: any): any;
}
declare function QuerySelectListExpressionContext(parser: any, ctx: any): any;
declare class QuerySelectListExpressionContext {
    constructor(parser: any, ctx: any);
    constructor: typeof QuerySelectListExpressionContext;
    select_list_elem(i: any): any;
    Comma(i: any): any;
    accept(visitor: any): any;
}
declare function QueryFromExpressionContext(parser: any, ctx: any): any;
declare class QueryFromExpressionContext {
    constructor(parser: any, ctx: any);
    constructor: typeof QueryFromExpressionContext;
    From(): any;
    dataSources(): any;
    accept(visitor: any): any;
}
declare function QueryWhereExpressionContext(parser: any, ctx: any): any;
declare class QueryWhereExpressionContext {
    constructor(parser: any, ctx: any);
    constructor: typeof QueryWhereExpressionContext;
    Where(): any;
    expressionSequence(): any;
    accept(visitor: any): any;
}
declare function QueryDataSourcesExpressionContext(parser: any, ctx: any): any;
declare class QueryDataSourcesExpressionContext {
    constructor(parser: any, ctx: any);
    constructor: typeof QueryDataSourcesExpressionContext;
    dataSource(i: any): any;
    Comma(i: any): any;
    accept(visitor: any): any;
}
declare function QueryDataSourceExpressionContext(parser: any, ctx: any): any;
declare class QueryDataSourceExpressionContext {
    constructor(parser: any, ctx: any);
    constructor: typeof QueryDataSourceExpressionContext;
    data_source_item(): any;
    using_source_clause(): any;
    join_clause(i: any): any;
    accept(visitor: any): any;
}
declare function QueryDataSourceItemIdentifierExpressionContext(parser: any, ctx: any): any;
declare class QueryDataSourceItemIdentifierExpressionContext {
    constructor(parser: any, ctx: any);
    constructor: typeof QueryDataSourceItemIdentifierExpressionContext;
    identifier(): any;
    accept(visitor: any): any;
}
declare function QueryDataSourceItemUrlExpressionContext(parser: any, ctx: any): any;
declare class QueryDataSourceItemUrlExpressionContext {
    constructor(parser: any, ctx: any);
    constructor: typeof QueryDataSourceItemUrlExpressionContext;
    Url(): any;
    accept(visitor: any): any;
}
declare function QueryDataSourceItemArgumentsExpressionContext(parser: any, ctx: any): any;
declare class QueryDataSourceItemArgumentsExpressionContext {
    constructor(parser: any, ctx: any);
    constructor: typeof QueryDataSourceItemArgumentsExpressionContext;
    singleExpression(): any;
    arguments(): any;
    accept(visitor: any): any;
}
declare function QueryDataSourceItemSubqueryExpressionContext(parser: any, ctx: any): any;
declare class QueryDataSourceItemSubqueryExpressionContext {
    constructor(parser: any, ctx: any);
    constructor: typeof QueryDataSourceItemSubqueryExpressionContext;
    OpenParen(): any;
    queryExpression(): any;
    CloseParen(): any;
    accept(visitor: any): any;
}
declare function QueryJoinCrossApplyExpressionContext(parser: any, ctx: any): any;
declare class QueryJoinCrossApplyExpressionContext {
    constructor(parser: any, ctx: any);
    constructor: typeof QueryJoinCrossApplyExpressionContext;
    Join(): any;
    dataSources(): any;
    accept(visitor: any): any;
}
declare function QueryJoinOnExpressionContext(parser: any, ctx: any): any;
declare class QueryJoinOnExpressionContext {
    constructor(parser: any, ctx: any);
    constructor: typeof QueryJoinOnExpressionContext;
    Join(): any;
    dataSources(): any;
    On(): any;
    singleExpression(i: any): any;
    Equals_(): any;
    IdentityEquals(): any;
    accept(visitor: any): any;
}
declare function QuerySourceUsingLiteralExpressionContext(parser: any, ctx: any): any;
declare class QuerySourceUsingLiteralExpressionContext {
    constructor(parser: any, ctx: any);
    constructor: typeof QuerySourceUsingLiteralExpressionContext;
    Using(): any;
    queryObjectLiteral(): any;
    accept(visitor: any): any;
}
declare function QuerySourceUsingSingleExpressionContext(parser: any, ctx: any): any;
declare class QuerySourceUsingSingleExpressionContext {
    constructor(parser: any, ctx: any);
    constructor: typeof QuerySourceUsingSingleExpressionContext;
    Using(): any;
    singleExpression(): any;
    accept(visitor: any): any;
}
declare function QueryProduceExpressionContext(parser: any, ctx: any): any;
declare class QueryProduceExpressionContext {
    constructor(parser: any, ctx: any);
    constructor: typeof QueryProduceExpressionContext;
    Produce(): any;
    singleExpression(): any;
    accept(visitor: any): any;
}
declare function QueryBindExpressionContext(parser: any, ctx: any): any;
declare class QueryBindExpressionContext {
    constructor(parser: any, ctx: any);
    constructor: typeof QueryBindExpressionContext;
    Using(): any;
    singleExpression(): any;
    accept(visitor: any): any;
}
declare function QueryWithinExpressionContext(parser: any, ctx: any): any;
declare class QueryWithinExpressionContext {
    constructor(parser: any, ctx: any);
    constructor: typeof QueryWithinExpressionContext;
    Within(): any;
    singleExpression(i: any): any;
    Comma(i: any): any;
    accept(visitor: any): any;
}
export {};
