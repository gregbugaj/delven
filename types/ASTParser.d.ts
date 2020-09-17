import { ECMAScriptParserVisitor as DelvenVisitor } from "./parser/ECMAScriptParserVisitor";
import { RuleContext } from "antlr4/RuleContext";
import { Literal, Identifier, BinaryExpression, Property, Expression, ClassBody, ArrayExpressionElement, TemplateLiteral, RegexLiteral } from "./nodes";
import * as Node from "./nodes";
import ASTNode from "./ASTNode";
/**
 * Version that we generate the AST for.
 * This allows for testing different implementations
 *
 * Currently only ECMAScript is supported
 *
 * https://github.com/estree/estree
 */
export declare enum ParserType {
    ECMAScript = 0
}
export declare type SourceType = "code" | "filename";
export declare type SourceCode = {
    type: SourceType;
    value: string;
};
export interface Marker {
    index: number;
    line: number;
    column: number;
}
declare class ModuleSpecifier {
    readonly lhs: Identifier;
    readonly rhs: Identifier;
    constructor(lhs: Identifier, rhs: Identifier);
}
declare class ClassTail {
    readonly superClass: Expression | null;
    readonly body: ClassBody;
    constructor(superClass: Expression | null, body: ClassBody);
}
interface ExportFromBlock {
    tag: "namespace" | "module";
    source: Node.Literal | null;
    specifiers: Node.ExportSpecifier[];
    namespace: Node.ImportDefaultSpecifier | null;
}
declare type ClassElement = Node.MethodDefinition | Node.EmptyStatement | Node.ClassPrivateProperty | Node.ClassProperty;
declare type IterableStatement = Node.DoWhileStatement | Node.WhileStatement | Node.ForStatement | Node.ForInStatement | Node.ForOfStatement;
export declare type ErrorInfo = {
    line: number;
    column: number;
    msg: string;
};
export declare class ErrorNode extends ASTNode {
    private errror;
    constructor(errror: ErrorInfo);
}
/**
 * Ecmascript parser fro creating abstract syntax trees (ASTs) that are compliant The ESTree Spec https://github.com/estree/estree
 *
 * Usage
 * ```
 *  const code = 'let x = 1 + 2'
 *  const ast  = ASTParser.parse({ type: "code", value: code });
 *  console.info(JSON.stringify(ast))
 * ```
 */
export default abstract class ASTParser {
    private visitor;
    static _trace: boolean;
    /**
     * Enable trace messages
     *
     * @param trace
     */
    static trace(trace: boolean): void;
    constructor(visitor: DelvenASTVisitor);
    /**
     * Generate source code
     * @param source
     */
    generate(source: SourceCode): ASTNode;
    /**
     * Parse source and genereate AST tree, ParsetType will be used to make determination of what interla parser to use
     *
     * @param source
     * @param type
     */
    static parse(source: SourceCode, type?: ParserType): ASTNode;
}
/**
 * Default AST visitor implementation
 */
declare class DelvenASTVisitor extends DelvenVisitor {
    private ruleTypeMap;
    constructor();
    private setupTypeRules;
    private log;
    private dumpContext;
    private dumpContextAllChildren;
    /**
     * Get rule name by the Id
     * @param id
     */
    getRuleById(id: number): string | undefined;
    private asMarker;
    private decorate;
    private asMetadata;
    private throwTypeError;
    /**
     * Throw TypeError only when there is a type provided.
     * This is usefull when there node ita TerminalNode
     * @param type
     */
    private throwInsanceError;
    private assertType;
    /**
     * Visit a parse tree produced by ECMAScriptParser#program.
     *
     * ```
     *  program
     *    : HashBangLine? sourceElements? EOF
     *    ;
     * ```
     * @param ctx
     */
    visitProgram(ctx: RuleContext): Node.Module;
    /**
     * Visit a parse tree produced by ECMAScriptParser#statement.
     *
     * ```
     * statement
     *   : block
     *   | variableStatement
     *   | importStatement
     *   | exportStatement
     *   | emptyStatement
     *   | classDeclaration
     *   | expressionStatement
     *   | ifStatement
     *   | iterationStatement
     *   | continueStatement
     *   | breakStatement
     *   | returnStatement
     *   | withStatement
     *   | labelledStatement
     *   | switchStatement
     *   | throwStatement
     *   | tryStatement
     *   | debuggerStatement
     *   | functionDeclaration
     *   ;
     * ```
     *
     * @param ctx
     */
    visitStatement(ctx: RuleContext): Node.Statement;
    /**
    * Evaluate a singleExpression
    * Currently singleExpression is called from both Statements and Expressions which causes problems for
    * distinguishing function declaration from function expressions
    *
    * @param node
    */
    singleExpression(node: RuleContext): Node.Expression;
    /**
     *
     * ```
     * importStatement
     *   : Import importFromBlock
     *   ;
     * ```
     * @param ctx
     */
    visitImportStatement(ctx: RuleContext): Node.ImportDeclaration;
    /**
     * Example
     *
     * ```
     * let x = import(z)
     * ```
     * Grammar
     * ```
     * Import '(' singleExpression ')'   # ImportExpression
     * ```
     */
    visitImportExpression(ctx: RuleContext): Node.CallExpression;
    /**
     *
     * ```
     * importFromBlock
     *   : StringLiteral eos
     *   | importDefault? (importNamespace | moduleItems) importFrom eos
     *   ;
     * ```
     * @param ctx
     */
    visitImportFromBlock(ctx: RuleContext): Node.ImportDeclaration;
    /**
     * This could be called from Import or Export statement
     *
     * ```
     * moduleItems
     *   : '{' (aliasName ',')* (aliasName ','?)? '}'
     *   ;
     * ```
     * @param ctx
     */
    visitModuleItems(ctx: RuleContext): ModuleSpecifier[];
    /**
     * Examples :
     *
     * ```
     *   import defaultExport from 'module_name'; // 1 node  ImportDefaultSpecifier
     *   import * as name from 'module_name';  // 3 nodes    ImportNamespaceSpecifier
     * ```
     *
     * ```
     * importNamespace
     *    : ('*' | identifierName) (As identifierName)?
     *    ;
     * ```
     * @param ctx
     */
    visitImportNamespace(ctx: RuleContext): Node.ImportNamespaceSpecifier | Node.ImportDefaultSpecifier;
    visitImportDefault(ctx: RuleContext): Node.ImportDefaultSpecifier;
    /**
     *
     * ```
     * importFrom
     *   : From StringLiteral
     *   ;
     * ```
     * @param ctx
     */
    visitImportFrom(ctx: RuleContext): Node.Literal;
    /**
     * Visit a parse tree produced by ECMAScriptParser#iterationStatement.
     * There are two different types of export, named and default.
     * You can have multiple named exports per module but only one default export.
     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export
     *
     * We currently do not implement `Aggregating modules`
     *
     * ```
     * exportStatement
     *  : Export (exportFromBlock | declaration) eos    # ExportDeclaration
     *  | Export Default singleExpression eos           # ExportDefaultDeclaration
     *  ;
     * ```
     * @param ctx
     */
    visitExportStatement(ctx: RuleContext): Node.ExportNamedDeclaration | Node.ExportDefaultDeclaration;
    /**
     * FIXME : This is not fully working for FunctionDeclaration
     * Visit a parse tree produced by ECMAScriptParser#exportStatement.
     *
     *
     * Examples
     * ```
     * export default class { }           // ClassDeclaration
     * export default (class { })         // ClassExpression
     *
     * export default function () { }     // FunctionDeclaration
     * export default (function () { })   // FunctionExpression
     * ```
     *
     * Grammar
     * ```
     * exportStatement
     *  : Export (exportFromBlock | declaration) eos    # ExportDeclaration
     *  | Export Default (classDeclaration | functionDeclaration | singleExpression) eos           # ExportDefaultDeclaration  // GB Footnote 7
     *  ;
     * ```
     *
     * @param ctx
     */
    visitExportDefaultDeclaration(ctx: RuleContext): Node.ExportDefaultDeclaration;
    /**
     * Example
     *
     * ```
     *  export { myClass as ZZ } from 'module';
     *  export {myClass} from 'module'
     * ```
     *
     * Grammar fragment
     * ```
     *     : Export (exportFromBlock | declaration) eos    # ExportDeclaration
     * ```
     * @param ctx
     */
    visitExportDeclaration(ctx: RuleContext): Node.ExportNamedDeclaration | Node.ExportAllDeclaration;
    /**
     * Example
     *
     * ```
     * export { classA, classB } from 'module';
     * ```
     *
     * Grammar
     * ```
     * exportFromBlock
     *  : importNamespace importFrom eos
     *  | moduleItems importFrom? eos
     *  ;
     * ```
     *
     * @param ctx
     */
    visitExportFromBlock(ctx: RuleContext): ExportFromBlock;
    /**
     *
     * ```
     * declaration
     *  : variableStatement
     *  | classDeclaration
     *  | functionDeclaration
     *  ;
     * ```
     */
    visitDeclaration(ctx: RuleContext): Node.ExportableNamedDeclaration;
    /**
     * Visit a parse tree produced by ECMAScriptParser#iterationStatement.
     *
     * ```
     * iterationStatement
     *    : Do statement While '(' expressionSequence ')' eos                                                                       # DoStatement
     *    | While '(' expressionSequence ')' statement                                                                              # WhileStatement
     *    | For '(' (expressionSequence | variableDeclarationList)? ';' expressionSequence? ';' expressionSequence? ')' statement   # ForStatement
     *    | For '(' (singleExpression | variableDeclarationList) In expressionSequence ')' statement                                # ForInStatement
     *    // strange, 'of' is an identifier. and this.p("of") not work in sometime.
     *    | For Await? '(' (singleExpression | variableDeclarationList) identifier{this.p("of")}? expressionSequence ')' statement  # ForOfStatement
     *    ;
     * ```
     */
    visitIterationStatement(ctx: RuleContext): IterableStatement;
    /**
     * Visit a parse tree produced by ECMAScriptParser#block.
     * /// Block :
     * ///     { StatementList? }
     */
    visitBlock(ctx: RuleContext): Node.BlockStatement;
    /**
     * Visit a parse tree produced by ECMAScriptParser#statementList.
     *
     * ```
     *  statementList
     *    : statement+
     *    ;
     * ```
     * @param ctx
     */
    visitStatementList(ctx: RuleContext): Node.Statement[];
    visitVariableStatement(ctx: RuleContext): Node.VariableDeclaration;
    /**
     * Get the type rule context
     *
     * Example
     * ```
     *   const node = this.getTypedRuleContext(ctx, ECMAScriptParser.VariableDeclarationListContext)
     * ```
     * @param ctx
     * @param type
     * @param index
     */
    private getTypedRuleContext;
    /**
     * Get all typed rules
     *
     * @param ctx
     * @param type
     */
    private getTypedRuleContexts;
    /**
     * <pre>
     * variableDeclarationList
     *   : varModifier variableDeclaration (',' variableDeclaration)*
     *   ;
     * </pre>
     * @param ctx
     */
    visitVariableDeclarationList(ctx: RuleContext): Node.VariableDeclaration;
    /**
     *  Visit a parse tree produced by ECMAScriptParser#variableDeclaration.
     *  variableDeclaration
     *    : assignable ('=' singleExpression)? // ECMAScript 6: Array & Object Matching
     *    ;
     * @param ctx VariableDeclarationContext
     */
    visitVariableDeclaration(ctx: RuleContext): Node.VariableDeclarator;
    visitEmptyStatement(ctx: RuleContext): Node.EmptyStatement;
    private assertNodeCount;
    /**
     * Visit a parse tree produced by ECMAScriptParser#expressionStatement.
     *
     * ```
     * expressionStatement
     *  : {this.notOpenBraceAndNotFunction()}? expressionSequence eos
     *  ;
     * ```
     * @param ctx
     */
    visitExpressionStatement(ctx: RuleContext): Node.ExpressionStatement;
    /**
     * ifStatement
     *
     * Example
     * ```
     *  if (x || y) {}
     *  if (x || y) {} else {}
     * ```
     * Grammar
     * ```
     *   : If '(' expressionSequence ')' statement ( Else statement )?
     *   ;
     * ```
     */
    visitIfStatement(ctx: RuleContext): Node.IfStatement;
    /**
     * Visit a parse tree produced by ECMAScriptParser#DoStatement.
     *
     * ```
     * : Do statement While '(' expressionSequence ')' eos                                                                       # DoStatement
     * ```
     * @param ctx
     */
    visitDoStatement(ctx: RuleContext): Node.DoWhileStatement;
    /**
     * Visit a parse tree produced by ECMAScriptParser#WhileStatement.
     *
     * ```
     * While '(' expressionSequence ')' statement
     * ```
     * @param ctx
     */
    visitWhileStatement(ctx: RuleContext): Node.WhileStatement;
    /**
     * Visit for statement
     * Sample
     * ```
     *  for await (let num of asyncIterable) {
     *     console.log(num);
     *  }
     * ```

     * Grammar
     * ```
     *    | For Await? '(' (singleExpression | variableDeclarationList) identifier{this.p("of")}? expressionSequence ')' statement  # ForOfStatement
     * ```
     * @param ctx
     */
    visitForOfStatement(ctx: RuleContext): Node.ForOfStatement;
    /**
    * Visit a parse tree produced by ECMAScriptParser#ForInStatement.
    *
    * ```
    * | For '(' (singleExpression | variableDeclarationList) In expressionSequence ')' statement                                # ForInStatement
    * ```
    * @param ctx
    */
    visitForInStatement(ctx: RuleContext): Node.ForInStatement;
    /**
     * Visit a parse tree produced by ECMAScriptParser#ForStatement.
     * ```
     * For '(' (expressionSequence | variableDeclarationList)? ';' expressionSequence? ';' expressionSequence? ')' statement   # ForStatement
     * ```
     * @param ctx
     */
    visitForStatement(ctx: RuleContext): Node.ForStatement;
    visitContinueStatement(ctx: RuleContext): Node.ContinueStatement;
    visitBreakStatement(ctx: RuleContext): Node.BreakStatement;
    visitReturnStatement(ctx: RuleContext): Node.ReturnStatement;
    /**
     * Visit a parse tree produced by ECMAScriptParser#withStatement.
     * ```
     * withStatement
     *   : With '(' expressionSequence ')' statement
     *   ;
     * ```
     * @param ctx
     */
    visitWithStatement(ctx: RuleContext): Node.WithStatement;
    /**
     * Visit a parse tree produced by ECMAScriptParser#switchStatement.
     *
     * ```
     * switchStatement
     *   : Switch '(' expressionSequence ')' caseBlock
         ;
     * ```
     * @param ctx
     */
    visitSwitchStatement(ctx: RuleContext): Node.SwitchStatement;
    /**
     * Visit a parse tree produced by ECMAScriptParser#caseBlock.
     *
     * ```
     * caseBlock
     *  : '{' caseClauses? (defaultClause caseClauses?)? '}'
     *  ;
     * ```
     * @param ctx
     */
    visitCaseBlock(ctx: RuleContext): Node.SwitchCase[];
    /**
     * Visit a parse tree produced by ECMAScriptParser#caseClauses.
     *
     * ```
     * caseClauses
     *  : caseClause+
     *  ;
     * ```
     * @param ctx
     */
    visitCaseClauses(ctx: RuleContext): Node.SwitchCase[];
    /**
     * Visit a parse tree produced by ECMAScriptParser#caseClause.
     *
     * ```
     * caseClause
     *  : Case expressionSequence ':' statementList?
     *  ;
     * ```
     * @param ctx
     */
    visitCaseClause(ctx: RuleContext): Node.SwitchCase;
    /**
     * Visit a parse tree produced by ECMAScriptParser#defaultClause.
     *
     * ```
     * defaultClause
     *  : Default ':' statementList?
     *  ;
     * ```
     * @param ctx
     */
    visitDefaultClause(ctx: RuleContext): Node.SwitchCase;
    /**
     * Visit a parse tree produced by ECMAScriptParser#labelledStatement.
     *
     * ```
     * labelledStatement
     *   : identifier ':' statement
     *   ;
     * ```
     */
    visitLabelledStatement(ctx: RuleContext): Node.LabeledStatement;
    /**
     * Visit a parse tree produced by ECMAScriptParser#throwStatement.
     *
     * ```
     * throwStatement
     *   : Throw {this.notLineTerminator()}? expressionSequence eos
     *   ;
     * ```
     * @param ctx
     */
    visitThrowStatement(ctx: RuleContext): Node.ThrowStatement;
    /**
     * Visit a parse tree produced by ECMAScriptParser#tryStatement.
     *
     * ```
     * tryStatement
     *   : Try block (catchProduction finallyProduction? | finallyProduction)
     *   ;
     * ```
     * @param ctx
     */
    visitTryStatement(ctx: RuleContext): Node.TryStatement;
    /**
     * Visit a parse tree produced by ECMAScriptParser#catchProduction.
     * Node count
     * 2 = `catch {}`
     * 5 = `catch (e) {}`
     *
     * ```
     * catchProduction
     *  : Catch ('(' assignable? ')')? block
     *  ;
     * ```
     * @param ctx
     */
    visitCatchProduction(ctx: RuleContext): Node.CatchClause;
    /**
     * Visit a parse tree produced by ECMAScriptParser#finallyProduction.
     *
     * @param ctx
     */
    visitFinallyProduction(ctx: RuleContext): Node.BlockStatement;
    /**
     * Visit a parse tree produced by ECMAScriptParser#debuggerStatement.
     *
     * @param ctx
     */
    visitDebuggerStatement(ctx: RuleContext): Node.DebuggerStatement;
    /**
     * Visit a parse tree produced by ECMAScriptParser#functionDeclaration.
     *
     * ```
     * functionDeclaration
     *    : Async? Function '*'? identifier '(' formalParameterList? ')' '{' functionBody '}'
     *    ;
     * ```
     * @param ctx
     */
    visitFunctionDeclaration(ctx: RuleContext): Node.FunctionDeclaration | Node.AsyncFunctionDeclaration;
    /**
     * Get funciton attribues
     * @param ctx
     */
    getFunctionAttributes(ctx: RuleContext): {
        isAsync: boolean;
        isGenerator: boolean;
        isStatic: boolean;
    };
    /**
     * Following fragment breaks 'esprima' compliance but is a perfecly valid.
     * Validated via 'espree'
     * ```
     * async function* gen(){}
     * ```
     * @ref https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for-await...of
     * @param ctx
     */
    private functionDeclaration;
    visitFunctionDecl(ctx: RuleContext): Node.FunctionDeclaration;
    /**
     * Visit a parse tree produced by ECMAScriptParser#functionBody.
     *
     * ```
     * functionBody
     *  : sourceElements?
     *  ;
     * ```
     * @param ctx
     */
    visitFunctionBody(ctx: RuleContext): Node.BlockStatement;
    /**
     * Visit a parse tree produced by ECMAScriptParser#sourceElements.
     *
     * ```
     *  sourceElements
     *    : sourceElement+
     *    ;
     * ```
     * @param ctx
     */
    visitSourceElements(ctx: RuleContext): Node.Statement[];
    /**
     * Visit a parse tree produced by ECMAScriptParser#arrayLiteral.
     *
     * ```
     * arrayLiteral
     *  : ('[' elementList ']')
     *  ;
     * ```
     * @param ctx
     */
    visitArrayLiteral(ctx: RuleContext): Node.ArrayExpressionElement[];
    /**
     * Visit a parse tree produced by ECMAScriptParser#elementList.
     * compliance: esprima compliane of returning `null`
     * `[,,]` should have 2 null values
     *
     * ```
     * let x  = [a,...b]  // ArrayExpression > SpreadElement
     * ([...b])=>0;       // ArrayPattern > RestElement
     * ```
     * ```
     * elementList
     *  : ','* arrayElement? (','+ arrayElement)* ','* // Yes, everything is optional
     *  ;
     * ```
     * @param ctx
     */
    visitElementList(ctx: RuleContext): Node.ArrayExpressionElement[];
    /**
     * Convert context child nodes into an iterable/arraylike object that can be used with 'for' loops directly
     *
     * @param ctx
     */
    private iterable;
    /**
     * Visit a parse tree produced by ECMAScriptParser#arrayElement.
     *
     * ```
     * arrayElement
     *  : Ellipsis? singleExpression
     *  ;
     * ```
     * @param ctx
     */
    visitArrayElement(ctx: RuleContext): Node.ArrayExpressionElement;
    /**
     * Visit a parse tree produced by ECMAScriptParser#objectLiteral.
     *
     * Sample
     * ```
     * ({[a]:[d]}) => 0; // ArrowFunctionExpression > ObjectPattern > ArrayPattern
     * x = {[a]:[d]}     // AssignmentExpression > ObjectExpression > ArrayExpression[computed = true]
     * ```
     *
     * Grammar :
     * ```
     * objectLiteral
     *  : '{' (propertyAssignment (',' propertyAssignment)*)? ','? '}'
     *  ;
     * ```
     *
     * ```
     * propertyAssignment
     *     : propertyName ':' singleExpression                                             # PropertyExpressionAssignment
     *     | '[' singleExpression ']' ':' singleExpression                                 # ComputedPropertyExpressionAssignment ??? FIXME : Never will be hit
     *     | Async? '*'? propertyName '(' formalParameterList?  ')'  '{' functionBody '}'  # FunctionProperty
     *     | getter '(' ')' '{' functionBody '}'                                           # PropertyGetter
     *     | setter '(' formalParameterArg ')' '{' functionBody '}'                        # PropertySetter
     *     | Ellipsis? singleExpression                                                    # PropertyShorthand
     *     ;
     *```
     * @param ctx
     */
    visitObjectLiteral(ctx: RuleContext): Node.ObjectExpression;
    /**
     * Visit a parse tree produced by ECMAScriptParser#propertyShorthand.
     * AssignmentExpression unrolling into ExpressionStatement > ArrowFunctionExpression> ObjectPattern
     *
     * Added Identifier to NOde.PropertyType so we can handle both cases
     * ```
     * ({b=2}) => 0 this will have the right type as Literal
     * ({b=z}) => 0 this will have the right type as Identifier
     * ```
     * Shorthand
     *
     * ```
     * ({b:z}) => 0
     * ({c=z}) => 0
     * ({c}) => 0
     * ```
     *
     * AssignmentPattern
     * ```
     *  ({b = c})=>0;
     * ```
     *
     *
     * Grammar
     *  ```
     * | Ellipsis? singleExpression                                                    # PropertyShorthand
     * ```
     * @param ctx
     */
    visitPropertyShorthand(ctx: RuleContext): Node.ObjectExpressionProperty;
    /**
     * Type Guard for Node.PropertyValue
     * @TODO remove TypeError and return false
     * @param expression
     */
    isPropertyValue(expression: Node.Expression): expression is Node.PropertyValue;
    /**
     * Type Guard for Node.PropertyKey, we are passing in an `Node.Expression`
     *
     * @param expression
     */
    isPropertyKey(expression: any): expression is Node.PropertyKey;
    /**
     * Type Guard for Node.Expression type
     * @param expression
     */
    isExpression(expression: any): expression is Node.Expression;
    /**
     * Type guard
     * @param val
     * @param types
     */
    isInstanceOfAny(val: unknown, types: any[]): boolean;
    /**
     * Visit a parse tree produced by ECMAScriptParser#propertyAssignment.
     *
     * Sample
     * ```
     *
     * ({ [x]() { } })   // computed  = true
     * ({ foo() { } })   // computed  = false
     * ```
     *
     * Grammar
     *
     * ```
     *  | Async? '*'? propertyName '(' formalParameterList?  ')'  '{' functionBody '}'  # FunctionProperty
     * ```
     * @param ctx
     */
    visitFunctionProperty(ctx: RuleContext): Node.ObjectExpressionProperty;
    /**
     * Filter out TerminalNodes (commas, pipes, brackets)
     * @param ctx
     */
    private filterSymbols;
    /**
     * Visit a parse tree produced by ECMAScriptParser#PropertyExpressionAssignment.
     *
     * Code:
     *
     * ```
     * x = {[a]:[d]}
     * ```
     *
     */
    visitPropertyExpressionAssignment(ctx: RuleContext): Node.ObjectExpressionProperty;
    /**
     * Visit a parse tree produced by ECMAScriptParser#PropertyGetter.
     * Sample:
     * ```
     * x = { get [expr]() { return 'bar'; } }  // computed = true
     *  x = { get width() { return m_width } } // computed = false
     * ```
     * Grammar :
     * ```
     * | getter '(' ')' '{' functionBody '}'                                           # PropertyGetter
     * ```
     */
    visitPropertyGetter(ctx: RuleContext): Node.Property;
    /**
     * Visit a parse tree produced by ECMAScriptParser#PropertySetter.
     * Sample:
     * ```
     *  y =  {
     *          set z(_x) { x = _x },
     *       };
     * ```
     
     * Grammar :
     * ```
     * | setter '(' formalParameterArg ')' '{' functionBody '}'                        # PropertySetter
     * ```
     */
    visitPropertySetter(ctx: RuleContext): Property;
    /**
     * Visit a parse tree produced by ECMAScriptParser#propertyName.
     *
     * ```
     * propertyName
     *  : identifierName
     *  | StringLiteral
     *  | numericLiteral
     *  | '[' singleExpression ']'
     *  ;
     * ```
     */
    visitPropertyName(ctx: RuleContext): Node.PropertyKey;
    private createStringLiteral;
    /**
      * Visit a parse tree produced by ECMAScriptParser#arguments.
      *
      * ```
      * arguments
      *   : '('(argument (',' argument)* ','?)?')'
      *   ;
      * ```
      * @param ctx
      */
    visitArguments(ctx: RuleContext): Node.ArgumentListElement[];
    /**
     * Visit a parse tree produced by ECMAScriptParser#argument.
     *
     * ```
     * argument
     *   : Ellipsis? (singleExpression | identifier)
     *   ;
     * ```
     * @param ctx
     */
    visitArgument(ctx: RuleContext): Node.ArgumentListElement;
    /**
     * Visit a parse tree produced by ECMAScriptParser#expressionSequence.
     *
     * ```
     * expressionSequence
     *   : singleExpression ( ',' singleExpression )*
     *   ;
     * ```
     * @param ctx
     */
    visitExpressionSequence(ctx: RuleContext): Node.SequenceExpression;
    /**
     * Example :
     * ```
     * async ()=> await 1
     * async ()=> await (1, 2)
     * ```
     * Grammar fragment
     * ```
     * | Await singleExpression                                                # AwaitExpression
     * ```
     * @param ctx
     */
    visitAwaitExpression(ctx: RuleContext): Node.AwaitExpression;
    /**
     *
     * @param ctx
     */
    visitSuperExpression(ctx: RuleContext): Node.Super;
    /**
     * Visit a parse tree produced by ECMAScriptParser#MetaExpression.
     *
     * ```
     *  New '.' identifier
     * ```
     * @param ctx
     */
    visitMetaExpression(ctx: RuleContext): Node.MetaProperty;
    /**
     * Visit a parse tree produced by ECMAScriptParser#classDeclaration.
     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/class
     *
     * ```
     *  classDeclaration
     *    : Class identifier classTail
     *    ;
     * ```
     */
    visitClassDeclaration(ctx: RuleContext): Node.ClassDeclaration;
    /**
     * Visit a parse tree produced by ECMAScriptParser#classTail.
     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes
     *
     * ```
     * classTail
     *   :  : classHeritage?  '{' classElement* '}'
     *   ;
     * ```
     * @param ctx
     */
    visitClassTail(ctx: RuleContext): ClassTail;
    /**
     * Visit a parse tree produced by ECMAScriptParser#classElement.
     *
     * ```
     *  classElement
     *      : (Static | {this.n("static")}? identifier | Async)* methodDefinition
     *      | emptyStatement
     *      | '#'? propertyName '=' singleExpression
     *      ;
     * ```
     * @param ctx
     */
    visitClassElement(ctx: RuleContext): ClassElement;
    /**
     * Examples :
     * ```
     *  let x = class y {}
     *  let x = class {}
     *  let x = (class {})
     * ```
     *
     * Grammar :
     * ```
     *  Class identifier? classTail    # ClassExpression
     * ```
     * @param ctx
     */
    visitClassExpression(ctx: RuleContext): Node.ClassExpression;
    /**
     * TODO : Implement stage-3 private properties
     *
     * Visit a parse tree produced by ECMAScriptParser#methodDefinition.
     *
     * ```
     *  methodDefinition
     *     : '*'? '#'? propertyName '(' formalParameterList? ')' '{' functionBody '}'
     *     | '*'? '#'? getter '(' ')' '{' functionBody '}'
     *     | '*'? '#'? setter '(' formalParameterList? ')' '{' functionBody '}'
     *     ;
     * ```
     * @param ctx
     */
    visitMethodDefinition(ctx: RuleContext): Node.MethodDefinition;
    private crateFunctionExpression;
    /**
     * Check for specific token type present
     *
     * @param ctx
     * @param tokenType
     */
    hasToken(ctx: RuleContext, tokenType: number): boolean;
    /**
     * Visit a parse tree produced by ECMAScriptParser#formalParameterList.
     *
     * ```
     * formalParameterList
     *   : formalParameterArg (',' formalParameterArg)* (',' lastFormalParameterArg)?
     *   | lastFormalParameterArg
     *   ;
     * ```
     * @param ctx
     */
    visitFormalParameterList(ctx: RuleContext): Node.FunctionParameter[];
    /**
     * Visit a parse tree produced by ECMAScriptParser#formalParameterArg.
     *
     * ```
     * formalParameterArg
     *   : assignable ('=' singleExpression)?      // ECMAScript 6: Initialization
     *   ;
     * ```
     * @param ctx
     */
    visitFormalParameterArg(ctx: RuleContext): Node.AssignmentPattern | Node.BindingIdentifier | Node.BindingPattern;
    /**
     * We have to perform converions here for the ArrayLiteral and ObjectLiteral
     *
     * Code :
     * ```
     *  ([...b]) => 0;  //ArrayPattern > RestElement
     *  ( x = [...b]) => 0;  // AssignmentPattern  ArrayExpression > SpreadElement
     *  (...args) => 0  // ArrowFunctionExpression > RestElement
     * ```
     * Grammar :
     * ```
     *  assignable
     *    : identifier
     *    | arrayLiteral
     *    | objectLiteral
     *    ;
     * ```
     * @param ctx  AssignableContext
     */
    visitAssignable(ctx: RuleContext): Node.BindingIdentifier | Node.BindingPattern;
    /**
     * Convert SpreadElement to RestElement
     * @param element
     */
    convertToRestElement(element: Node.SpreadElement): Node.RestElement;
    /**
         * Visit a parse tree produced by ECMAScriptParser#lastFormalParameterArg.
         *
         * lastFormalParameterArg                        // ECMAScript 6: Rest Parameter
         *   : Ellipsis singleExpression
         *   ;
         */
    visitLastFormalParameterArg(ctx: RuleContext): Node.RestElement;
    /**
     * Visit a parse tree produced by ECMAScriptParser#TernaryExpression.
     *
     * ```
     * | singleExpression '?' singleExpression ':' singleExpression            # TernaryExpression
     * ```
     * @param ctx
     */
    visitTernaryExpression(ctx: RuleContext): Node.ConditionalExpression;
    /**
     * Visit a parse tree produced by ECMAScriptParser#LogicalAndExpression.
     *
     * ```
     * singleExpression '&&' singleExpression
     * ```
     * @param ctx
     */
    visitLogicalAndExpression(ctx: RuleContext): Node.BinaryExpression;
    /**
    * Visit a parse tree produced by ECMAScriptParser#LogicalOrExpression.
    *
    * ```
    * singleExpression '||' singleExpression
    * ```
    * @param ctx
    */
    visitLogicalOrExpression(ctx: RuleContext): Node.BinaryExpression;
    visitPowerExpression(ctx: RuleContext): Node.BinaryExpression;
    /**
     * Nullish Coalescing Operator
     *
     * ```
     * x = param ?? 1
     * ```
     *
     * Grammar fragment
     * ```
     * | singleExpression '??' singleExpression                                # CoalesceExpression
     * ```
     * @param ctx
     */
    visitCoalesceExpression(ctx: RuleContext): Node.BinaryExpression;
    /**
     * Evaluate binary expression.
     * This applies to following types
     * LogicalAndExpressionContext
     * LogicalOrExpressionContext
     * @param ctx
     */
    _binaryExpression(ctx: RuleContext): Node.BinaryExpression;
    /**
     * Visit a parse tree produced by ECMAScriptParser#ObjectLiteralExpression.
     * @param ctx
     */
    visitObjectLiteralExpression(ctx: RuleContext): Node.ObjectExpression;
    /**
     * Visit a parse tree produced by ECMAScriptParser#InExpression.
     *
     * ```
     * | singleExpression In singleExpression                                  # InExpression
     * ```
     * @param ctx
     */
    visitInExpression(ctx: RuleContext): BinaryExpression;
    /**
     * Visit a parse tree produced by ECMAScriptParser#ArgumentsExpression.
     *
     * ```
     * | singleExpression arguments                # ArgumentsExpression
     * ```
     * @param ctx
     */
    visitArgumentsExpression(ctx: RuleContext): Node.CallExpression | Node.OptionalCallExpression;
    /**
     * Visit a parse tree produced by ECMAScriptParser#ThisExpression.
     *
     * @param ctx
     */
    visitThisExpression(ctx: RuleContext): Node.ThisExpression;
    /**
     * Need to unroll functionDeclaration as a FunctionExpression
     * Visit a parse tree produced by ECMAScriptParser#FunctionExpression.
     *
     * ```
     *  anoymousFunction
     *     : functionDeclaration                                                       # FunctionDecl
     *     | Async? Function '*'? '(' formalParameterList? ')' '{' functionBody '}'    # AnoymousFunctionDecl
     *     | Async? arrowFunctionParameters '=>' arrowFunctionBody                     # ArrowFunction
     *     ;
     * ```
     * @param ctx
     * @param isStatement
     */
    visitFunctionExpression(ctx: RuleContext): Node.FunctionExpression | Node.AsyncFunctionExpression | Node.ArrowFunctionExpression | Node.AsyncArrowFunctionExpression | Node.FunctionDeclaration | Node.AsyncFunctionDeclaration;
    /**
     * Visit a parse tree produced by ECMAScriptParser#functionDecl
     * ```
     * functionDeclaration
     *   : Async? Function '*'? identifier '(' formalParameterList? ')' '{' functionBody '}'
     *   ;
     * ```
     * @param ctx
     */
    visitAnoymousFunctionDecl(ctx: RuleContext): Node.FunctionDeclaration;
    /**
     * Visit a parse tree produced by ECMAScriptParser#functionDecl
     *
     * https://stackoverflow.com/questions/27661306/can-i-use-es6s-arrow-function-syntax-with-generators-arrow-notation
     *
     * Example
     * ```
     * async ()=> (await 1, 2)
     * ()=> 1
     * ```
     *
     * Grammar fragment
     * ```
     * anoymousFunction
     *   : functionDeclaration                                                       # FunctionDecl
     *   | Async? Function '*'? '(' formalParameterList? ')' '{' functionBody '}'    # AnoymousFunctionDecl
     *   | Async? arrowFunctionParameters '=>' arrowFunctionBody                     # ArrowFunction
     *   ;
     * ```
     * @param ctx
     */
    visitArrowFunction(ctx: RuleContext): Node.ArrowFunctionExpression;
    /**
     * Visit a parse tree produced by ECMAScriptParser#arrowFunctionParameters
     *
     * ```
     * arrowFunctionParameters
     *  : identifier
     *  | '(' formalParameterList? ')'
     *  ;
     * ```
     * @param ctx
     */
    visitArrowFunctionParameters(ctx: RuleContext): Node.FunctionParameter[];
    /**
     * Visit a parse tree produced by ECMAScriptParser#arrowFunctionBody
     *
     *```
     *  arrowFunctionBody
     *   : '{' functionBody '}'
     *   | singleExpression
     *   ;
     * ```
     * @param ctx
     */
    visitArrowFunctionBody(ctx: RuleContext): Node.BlockStatement | Node.Expression;
    /**
     * Visit a parse tree produced by ECMAScriptParser#AssignmentExpression.
     *
     * Example :
     * ```
     * [a , b] = 1          // ExpressionStatement > AssignmentExpression > ArrayPattern
     * [a , b,...rest] = 1  // ExpressionStatement > AssignmentExpression > ArrayPattern > RestElement
     * ```
     *
     * Grammar :
     * ```
     * <assoc=right> singleExpression '=' singleExpression                   # AssignmentExpression
     * ```
     * @param ctx
     */
    visitAssignmentExpression(ctx: RuleContext): Node.AssignmentExpression;
    /**
     * Convert ArrayExpression into ArrayPattern subsequently modifying the underlying nodes.
     *
     * @param expression
     */
    convertToArrayPattern(expression: Node.ArrayExpression): Node.ArrayPattern;
    /**
     * Type guard to check if node is and BindingIdentifier | BindingPattern
     * @param node
     */
    isBindingIdentifierOrBindingPattern(node: unknown): node is Node.Identifier | Node.ArrayPattern | Node.ObjectPattern;
    /**
     * Convert ArrayExpressionElement[] into ArrayPatternElement[]
     * SpreadElement will be converted to RestElement
     * @param elements
     */
    convertToArrayPatternElements(elements: ArrayExpressionElement[]): Node.ArrayPatternElement[];
    /**
     * Convert ObjectExpressionProperty[] into an ObjectPatternProperty[]
     * @param elements
     */
    convertToObjectPatternProperty(elements: Node.ObjectExpressionProperty[]): Node.ObjectPatternProperty[];
    visitTypeofExpression(ctx: RuleContext): Node.UnaryExpression;
    visitInstanceofExpression(ctx: RuleContext): Node.BinaryExpression;
    visitUnaryPlusExpression(ctx: RuleContext): Node.UnaryExpression;
    visitUnaryMinusExpression(ctx: RuleContext): Node.UnaryExpression;
    visitBitNotExpression(ctx: RuleContext): Node.UnaryExpression;
    visitNotExpression(ctx: RuleContext): Node.UnaryExpression;
    /**
     * Visit a parse tree produced by ECMAScriptParser#DeleteExpression.
     * ```
     *     | Delete singleExpression                                               # DeleteExpression
     * ```
     * @param ctx
     */
    visitDeleteExpression(ctx: RuleContext): Node.UnaryExpression;
    /**
     * Visit a parse tree produced by ECMAScriptParser#EqualityExpression.
     *
     * @param ctx
     */
    visitEqualityExpression(ctx: RuleContext): Node.BinaryExpression;
    /**
     * Visit a parse tree produced by ECMAScriptParser#BitXOrExpression.
     *
     * @param ctx
     */
    visitBitXOrExpression(ctx: RuleContext): Node.BinaryExpression;
    /**
     * Visit a parse tree produced by ECMAScriptParser#BitAndExpression.
     *
     * @param ctx
     */
    visitBitAndExpression(ctx: RuleContext): Node.BinaryExpression;
    /**
     * Visit a parse tree produced by ECMAScriptParser#BitOrExpression.
     *
     * @param ctx
     */
    visitBitOrExpression(ctx: RuleContext): Node.BinaryExpression;
    /**
     * Visit a parse tree produced by ECMAScriptParser#MultiplicativeExpression.
     *
     * @param ctx
     */
    visitMultiplicativeExpression(ctx: RuleContext): Node.BinaryExpression;
    /**
     * Visit a parse tree produced by ECMAScriptParser#BitShiftExpression.
     *
     * @param ctx
     */
    visitBitShiftExpression(ctx: RuleContext): Node.BinaryExpression;
    /**
     * Coerce SequenceExpression that have only one node will be pulled up to `Node.Expression`
     * complaince(esprima)
     *
     * @param sequence
     */
    private coerceToExpressionOrSequence;
    /**
     * Visit a parse tree produced by ECMAScriptParser#ParenthesizedExpression.
     *
     * ```
     *     | '(' expressionSequence ')'                                            # ParenthesizedExpression
     * ```
     * @param ctx
     */
    visitParenthesizedExpression(ctx: RuleContext): Node.Expression | Node.SequenceExpression;
    /**
     * Visit a parse tree produced by ECMAScriptParser#AdditiveExpression.
     *
     * @param ctx
     */
    visitAdditiveExpression(ctx: RuleContext): Node.BinaryExpression;
    /**
     * Visit binary expression
     *
     * @param ctx
     */
    private _visitBinaryExpression;
    /**
     * Visit a parse tree produced by ECMAScriptParser#RelationalExpression.
     *
     * @param ctx
     */
    visitRelationalExpression(ctx: RuleContext): Node.BinaryExpression;
    private getUpdateExpression;
    /**
     * Visit a parse tree produced by ECMAScriptParser#PostIncrementExpression.
     * @param ctx
     */
    visitPostIncrementExpression(ctx: RuleContext): Node.UpdateExpression;
    /**
     * Visit a parse tree produced by ECMAScriptParser#PreIncrementExpression.
     *
     * @param ctx
     */
    visitPreIncrementExpression(ctx: RuleContext): Node.UpdateExpression;
    /**
     * Visit a parse tree produced by ECMAScriptParser#PreDecreaseExpression.
     *
     * @param ctx
     */
    visitPreDecreaseExpression(ctx: RuleContext): Node.UpdateExpression;
    /**
     * Visit a parse tree produced by ECMAScriptParser#PostDecreaseExpression.
     *
     * @param ctx
     */
    visitPostDecreaseExpression(ctx: RuleContext): Node.UpdateExpression;
    /**
     * Visit a parse tree produced by ECMAScriptParser#NewExpression.
     * This rule is problematic as
     *
     * ```
     * | New singleExpression arguments?    # NewExpression
     * ```
     * @param ctx
     */
    visitNewExpression(ctx: RuleContext): Node.NewExpression;
    /**
     * Visit a parse tree produced by ECMAScriptParser#LiteralExpression.
     *
     * ```
     * literal
     *   : NullLiteral
     *   | BooleanLiteral
     *   | StringLiteral
     *   | TemplateStringLiteral
     *   | RegularExpressionLiteral
     *   | numericLiteral
     *   | bigintLiteral
     *   ;
     * ```
     * @param ctx
     */
    visitLiteralExpression(ctx: RuleContext): Literal | RegexLiteral | TemplateLiteral;
    /**
     *  Visit a parse tree produced by ECMAScriptParser#ArrayLiteralExpression.
     *
     * ```
     *  arrayLiteral
     *    : ('[' elementList ']')
     *    ;
     * ```
     * @param ctx
     */
    visitArrayLiteralExpression(ctx: RuleContext): Node.ArrayExpression;
    /**
     * Visit a parse tree produced by ECMAScriptParser#MemberDotExpression.
     *
     * Grammar fragment
     * ```
     * | singleExpression '?'? '.' '#'? identifierName                         # MemberDotExpression
     * ```
     * ```
     * new foo().bar
     * ```
     *
     * Following snippet will produce an `OptionalMemberExpression`
     * ```
     * let x = y?.test()
     * ```
     *
     * computed = false `x.z`
     * computed = true `y[1]`
     */
    visitMemberDotExpression(ctx: RuleContext): Node.StaticMemberExpression | Node.OptionalMemberExpression;
    /**
     * Visit a parse tree produced by ECMAScriptParser#MemberNewExpression.
     *
     * GB: Footnote 8
     *
     * To distinguish between this two expressions we check if the node has ArgumentsExpression it does
     * then we know it is a CallExpression
     *
     * ```
     * new {}.foo()
     * new {}().foo()  // ArgumentsExpression
     * ```
     * ```
     * Grammar :
     * ```
     * | New singleExpression '.' identifierName arguments                     # MemberNewExpression
     * ```
     * @param ctx
     */
    visitMemberNewExpression(ctx: RuleContext): Node.NewExpression | Node.CallExpression;
    /**
     * Visit a parse tree produced by ECMAScriptParser#MemberIndexExpression.
     *
     * ```
     * | singleExpression '[' expressionSequence ']'                           # MemberIndexExpression
     * ```
     * @param ctx
     */
    visitMemberIndexExpression(ctx: RuleContext): Node.ComputedMemberExpression;
    /**
     * Visit a parse tree produced by ECMAScriptParser#IdentifierExpression.
     *
     * ```
     * | identifier                                                            # IdentifierExpression
     * ```
     * @param ctx
     */
    visitIdentifierExpression(ctx: RuleContext): Node.Identifier;
    /**
     * Visit a parse tree produced by ECMAScriptParser#identifier.
     *
     * @ref https://stackoverflow.com/questions/7885096/how-do-i-decode-a-string-with-escaped-unicode
     * @param ctx
     */
    visitIdentifier(ctx: RuleContext): Node.Identifier;
    /**
     * Visit a parse tree produced by ECMAScriptParser#AssignmentOperatorExpression.
     *
     * ```
     * <assoc=right> singleExpression assignmentOperator singleExpression    # AssignmentOperatorExpression
     * ```
     * @param ctx
     */
    visitAssignmentOperatorExpression(ctx: RuleContext): Node.AssignmentExpression;
    /**
     * Visit a parse tree produced by ECMAScriptParser#VoidExpression.
     *
     * ```
     *  | Void singleExpression                                                 # VoidExpression
     * ```
     * @param ctx
     */
    visitVoidExpression(ctx: RuleContext): Node.UnaryExpression;
    /**
     * Visit a parse tree produced by ECMAScriptParser#literal.
     *
     * `numericLiteral` and  `bigintLiteral` are production rules, everthing else is a `TerminalNode`
     * We inspect Token type to figure out what type of literal we are working with
     *
     * ```
     * literal
     *   : NullLiteral
     *   | BooleanLiteral
     *   | StringLiteral
     *   | TemplateStringLiteral
     *   | RegularExpressionLiteral
     *   | numericLiteral
     *   | bigintLiteral
     *   ;
     * ```
     * @param ctx
     */
    visitLiteral(ctx: RuleContext): Node.Literal | Node.TemplateLiteral | Node.RegexLiteral;
    /**
     * Visit a parse tree produced by ECMAScriptParser#numericLiteral.
     *
     * @param ctx
     */
    visitNumericLiteral(ctx: RuleContext): Node.Literal;
    private createLiteralValue;
    private createRegularExpressionLiteral;
    /**
     * This is quikc and dirty implemenation of TemplateLiteral string iterpolation
     * TODO : Update grammar to use ANTLR lexer modes to properly parse the expressions tree rather than reinterpeting expression here
     *
     * Example
     * ```
     * const code =  "let x = `A ${1+2} B + C${b}D`"
     * ```
     *
     * @param ctx
     */
    private createTemplateLiteral;
    /**
     * Template string expression
     * Usage
     * ```
     *  const code =  "let x = tag`A ${1+2} B + C${b}D`"
     * ```
     *
     * Grammar
     * ```
     * singleExpression TemplateStringLiteral
     * ```
     * @param ctx
     */
    visitTemplateStringExpression(ctx: RuleContext): Node.TaggedTemplateExpression;
    /**
     * Visit a parse tree produced by ECMAScriptParser#identifierName.
     *
     * @param ctx
     */
    visitIdentifierName(ctx: RuleContext): Node.Identifier;
    /**
     * Visit a parse tree produced by ECMAScriptParser#reservedWord.
     *
     * @param ctx
     */
    visitReservedWord(ctx: RuleContext): void;
    /**
     * Visit a parse tree produced by ECMAScriptParser#keyword.
     *
     * @param ctx
     */
    visitKeyword(ctx: RuleContext): void;
    visitFutureReservedWord(ctx: RuleContext): void;
    /**
     * Visit a parse tree produced by ECMAScriptParser#getter.
     *
     * Code sample
     * ```
     * x =   {
     *   get (a){ return 'a'},
     *   get foo(){ return 'foo'},
     *   get [bar]() { return 'bar'; },
     *   get [z+y]() { return 'bar'; },
     *   get [z=y]() { return 'bar'; }
     *   };
     * ```
     *
     * Grammar :
     * ```
     * getter
     *   : {this.n("get")}? identifier propertyName
     *   ;
     * ```
     *
     * @param ctx
     */
    visitGetter(ctx: RuleContext): {
        computed: boolean;
        key: Node.PropertyKey;
    };
    /**
     * Check if PropertyNameContext is a computed property
     * When IdentifierExpression / LiteralExpressionContext / is present
     * we are having a computed field ex `[expression]()` or `['name']()`  or `{*[Symbol.iterator](){}}`
     *
     * @param propertyNameCtx
     */
    isComputedProperty(propertyNameCtx: RuleContext): boolean;
    /**
     * Check if current context has computed property
     *
     * @param propertyNameCtx
     */
    hasComputedProperty(propertyNameCtx: RuleContext): boolean;
    /**
     * Visit a parse tree produced by ECMAScriptParser#setter.
     *
     * ```
     * setter
     *  : {this.n("set")}? identifier propertyName
     *  ;
     * ```
     * @param ctx
     */
    visitSetter(ctx: RuleContext): {
        computed: boolean;
        key: Node.PropertyKey;
    };
    /**
     * Sample :
     * ```
     *  yield         // delegate  = false
     *  yield 1,2     // sequence
     *  yield ()=>1   // delegate  = false
     *  yield *gen()  // delegate  = true
     *  yield (2) *gen() // YieldExpression (BinaryExpression (Literal, CallExpression))
     * ```
     *
     * Grammar :
     * ```
     * yieldDeclaration
     *   : Yield {this.notLineTerminator()} ('*')? expressionSequence
     *   | Yield eos
     * ;
     * ```
     */
    visitYieldExpression(ctx: RuleContext): Node.YieldExpression;
    visitInlinedQueryExpression(ctx: RuleContext): Node.QueryExpression;
    visitQuerySelectStatement(ctx: RuleContext): Node.SelectStatement;
    visitQueryExpression(ctx: RuleContext): Node.QueryExpression;
    visitQuerySelectExpression(ctx: RuleContext): Node.QueryExpression;
    visitQuerySelectListExpression(ctx: RuleContext): Node.SelectClause;
    visitQueryFromExpression(ctx: RuleContext): Node.FromClause;
    visitQueryDataSourcesExpression(ctx: RuleContext): Node.FromClauseElement[];
    visitDataSource(ctx: RuleContext): Node.FromClauseElement;
    visitQueryDataSourceItemArgumentsExpression(ctx: RuleContext): Node.FromClauseElement;
    visitQueryWhereExpression(ctx: RuleContext): Node.WhereClause;
    /**
     * Asserts that a condition is true.
     *
     * @param condition
     * @param message
     */
    assertTrue(condition: boolean, message?: string): void;
}
export {};
