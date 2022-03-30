export declare type ArgumentListElement = Expression | SpreadElement;
export declare type ArrayExpressionElement = Expression | SpreadElement | null;
export declare type ArrayPatternElement = AssignmentPattern | BindingIdentifier | BindingPattern | RestElement | null;
export declare type BindingPattern = ArrayPattern | ObjectPattern;
export declare type BindingIdentifier = Identifier;
export declare type Declaration = AsyncFunctionDeclaration | ClassDeclaration | ExportDeclaration | FunctionDeclaration | ImportDeclaration | VariableDeclaration;
export declare type ExportableDefaultDeclaration = BindingIdentifier | BindingPattern | ClassDeclaration | Expression | FunctionDeclaration;
export declare type ExportableNamedDeclaration = AsyncFunctionDeclaration | ClassDeclaration | FunctionDeclaration | VariableDeclaration;
export declare type ExportDeclaration = ExportAllDeclaration | ExportDefaultDeclaration | ExportNamedDeclaration;
export declare type Expression = ArrayExpression | ArrowFunctionExpression | AssignmentExpression | AsyncArrowFunctionExpression | AsyncFunctionExpression | AwaitExpression | BinaryExpression | CallExpression | ClassExpression | ComputedMemberExpression | ConditionalExpression | Identifier | FunctionExpression | Literal | NewExpression | ObjectExpression | RegexLiteral | SequenceExpression | StaticMemberExpression | TaggedTemplateExpression | ThisExpression | UnaryExpression | UpdateExpression | YieldExpression;
export declare type FunctionParameter = AssignmentPattern | BindingIdentifier | BindingPattern | RestElement;
export declare type ImportDeclarationSpecifier = ImportDefaultSpecifier | ImportNamespaceSpecifier | ImportSpecifier;
export declare type ObjectExpressionProperty = Property | SpreadElement;
export declare type ObjectPatternProperty = Property | RestElement;
export declare type Statement = AsyncFunctionDeclaration | BreakStatement | ContinueStatement | DebuggerStatement | DoWhileStatement | EmptyStatement | ExpressionStatement | Directive | ForStatement | ForInStatement | ForOfStatement | FunctionDeclaration | IfStatement | ReturnStatement | SwitchStatement | ThrowStatement | TryStatement | VariableDeclaration | WhileStatement | WithStatement;
export declare type PropertyKey = Identifier | Literal | Expression;
export declare type PropertyValue = Literal | AssignmentPattern | AsyncFunctionExpression | BindingIdentifier | BindingPattern | FunctionExpression | ArrowFunctionExpression;
export declare type StatementListItem = Declaration | Statement;
export declare class ArrayExpression {
    readonly type: string;
    readonly elements: ArrayExpressionElement[];
    constructor(elements: ArrayExpressionElement[]);
}
export declare class ArrayPattern {
    readonly type: string;
    readonly elements: ArrayPatternElement[];
    constructor(elements: ArrayPatternElement[]);
}
export declare class ArrowFunctionExpression {
    readonly type: string;
    readonly id: Identifier | null;
    readonly params: FunctionParameter[];
    readonly body: BlockStatement | Expression;
    readonly generator: boolean;
    readonly expression: boolean;
    readonly async: boolean;
    constructor(params: FunctionParameter[], body: BlockStatement | Expression, expression: boolean);
}
export declare class AssignmentExpression {
    readonly type: string;
    readonly operator: string;
    readonly left: Expression;
    readonly right: Expression;
    constructor(operator: string, left: Expression, right: Expression);
}
export declare class AssignmentPattern {
    readonly type: string;
    readonly left: BindingIdentifier | BindingPattern;
    readonly right: Expression;
    constructor(left: BindingIdentifier | BindingPattern, right: Expression);
}
export declare class AsyncArrowFunctionExpression {
    readonly type: string;
    readonly id: Identifier | null;
    readonly params: FunctionParameter[];
    readonly body: BlockStatement | Expression;
    readonly generator: boolean;
    readonly expression: boolean;
    readonly async: boolean;
    constructor(params: FunctionParameter[], body: BlockStatement | Expression, expression: boolean);
}
export declare class AsyncFunctionDeclaration {
    readonly type: string;
    readonly id: Identifier | null;
    readonly params: FunctionParameter[];
    readonly body: BlockStatement;
    readonly generator: boolean;
    readonly expression: boolean;
    readonly async: boolean;
    constructor(id: Identifier | null, params: FunctionParameter[], body: BlockStatement, generator: boolean);
}
export declare class AsyncFunctionExpression {
    readonly type: string;
    readonly id: Identifier | null;
    readonly params: FunctionParameter[];
    readonly body: BlockStatement;
    readonly generator: boolean;
    readonly expression: boolean;
    readonly async: boolean;
    constructor(id: Identifier | null, params: FunctionParameter[], body: BlockStatement);
}
export declare class AwaitExpression {
    readonly type: string;
    readonly argument: Expression;
    constructor(argument: Expression);
}
export declare class BinaryExpression {
    readonly type: string;
    readonly operator: string;
    readonly left: Expression;
    readonly right: Expression;
    constructor(operator: string, left: Expression, right: Expression);
}
export declare class BlockStatement {
    readonly type: string;
    readonly body: Statement[];
    constructor(body: any);
}
export declare class BreakStatement {
    readonly type: string;
    readonly label: Identifier | null;
    constructor(label: Identifier | null);
}
export declare class CallExpression {
    readonly type: string;
    readonly callee: Expression | Import;
    readonly arguments: ArgumentListElement[];
    constructor(callee: Expression | Import, args: ArgumentListElement[]);
}
export declare class OptionalCallExpression {
    readonly type: string;
    readonly optional: boolean;
    readonly callee: Expression | Import;
    readonly arguments: ArgumentListElement[];
    constructor(callee: Expression | Import, args: ArgumentListElement[], optional: boolean);
}
export declare class CatchClause {
    readonly type: string;
    readonly param: BindingIdentifier | BindingPattern | null;
    readonly body: BlockStatement;
    constructor(param: BindingIdentifier | BindingPattern | null, body: BlockStatement);
}
export declare class ClassBody {
    readonly type: string;
    readonly body: Property[];
    constructor(body: Property[]);
}
export declare class ClassDeclaration {
    readonly type: string;
    readonly id: Identifier | null;
    readonly superClass: Expression | null;
    readonly body: ClassBody;
    constructor(id: Identifier | null, superClass: Expression | null, body: ClassBody);
}
export declare class ClassExpression {
    readonly type: string;
    readonly id: Identifier | null;
    readonly superClass: Expression | null;
    readonly body: ClassBody;
    constructor(id: Identifier | null, superClass: Expression | null, body: ClassBody);
}
export declare class ClassProperty {
    readonly type: string;
    readonly id: PropertyKey;
    readonly expression: Expression;
    constructor(id: PropertyKey, expression: Expression);
}
export declare class ClassPrivateProperty {
    readonly type: string;
    readonly id: PropertyKey;
    readonly expression: Expression;
    constructor(id: PropertyKey, expression: Expression);
}
export declare class ComputedMemberExpression {
    readonly type: string;
    readonly computed: boolean;
    readonly object: Expression;
    readonly property: Expression;
    constructor(object: Expression, property: Expression);
}
export declare class ConditionalExpression {
    readonly type: string;
    readonly test: Expression;
    readonly consequent: Expression;
    readonly alternate: Expression;
    constructor(test: Expression, consequent: Expression, alternate: Expression);
}
export declare class ContinueStatement {
    readonly type: string;
    readonly label: Identifier | null;
    constructor(label: Identifier | null);
}
export declare class DebuggerStatement {
    readonly type: string;
    constructor();
}
export declare class Directive {
    readonly type: string;
    readonly expression: Expression;
    readonly directive: string;
    constructor(expression: Expression, directive: string);
}
export declare class DoWhileStatement {
    readonly type: string;
    readonly body: Statement;
    readonly test: Expression;
    constructor(body: Statement, test: Expression);
}
export declare class EmptyStatement {
    readonly type: string;
    constructor();
}
export declare class ExportAllDeclaration {
    readonly type: string;
    readonly source: Literal;
    constructor(source: Literal);
}
export declare class ExportDefaultDeclaration {
    readonly type: string;
    readonly declaration: ExportableDefaultDeclaration;
    constructor(declaration: ExportableDefaultDeclaration);
}
export declare class ExportNamedDeclaration {
    readonly type: string;
    readonly declaration: ExportableNamedDeclaration | null;
    readonly specifiers: ExportSpecifier[];
    readonly source: Literal | null;
    constructor(declaration: ExportableNamedDeclaration | null, specifiers: ExportSpecifier[], source: Literal | null);
}
export declare class ExportSpecifier {
    readonly type: string;
    readonly exported: Identifier | null;
    readonly local: Identifier;
    constructor(local: Identifier, exported: Identifier | null);
}
export declare class ExpressionStatement {
    readonly type: string;
    readonly expression: Expression;
    constructor(expression: Expression);
}
export declare class ForInStatement {
    readonly type: string;
    readonly left: Expression;
    readonly right: Expression;
    readonly body: Statement;
    readonly each: boolean;
    constructor(left: Expression, right: Expression, body: Statement);
}
export declare class ForOfStatement {
    readonly type: string;
    readonly left: Expression;
    readonly right: Expression;
    readonly body: Statement;
    readonly await_: boolean;
    constructor(left: Expression, right: Expression, body: Statement, await_: boolean);
}
export declare class ForStatement {
    readonly type: string;
    readonly init: Expression | null;
    readonly test: Expression | null;
    readonly update: Expression | null;
    body: Statement;
    constructor(init: Expression | null, test: Expression | null, update: Expression | null, body: Statement);
}
export declare class FunctionDeclaration {
    readonly type: string;
    readonly id: Identifier | null;
    readonly params: FunctionParameter[];
    readonly body: BlockStatement;
    readonly generator: boolean;
    readonly expression: boolean;
    readonly async: boolean;
    constructor(id: Identifier | null, params: FunctionParameter[], body: BlockStatement, generator: boolean);
}
export declare class FunctionExpression {
    readonly type: string;
    readonly id: Identifier | null;
    readonly params: FunctionParameter[];
    readonly body: BlockStatement;
    readonly generator: boolean;
    readonly expression: boolean;
    readonly async: boolean;
    constructor(id: Identifier | null, params: FunctionParameter[], body: BlockStatement, generator: boolean);
}
export declare class Identifier {
    readonly type: string;
    readonly name: string;
    constructor(name: any);
}
export declare class IfStatement {
    readonly type: string;
    readonly test: Expression;
    readonly consequent: Statement;
    readonly alternate: Statement | null;
    constructor(test: Expression, consequent: Statement, alternate: Statement | null);
}
export declare class Import {
    readonly type: string;
    constructor();
}
export declare class ImportDeclaration {
    readonly type: string;
    readonly specifiers: ImportDeclarationSpecifier[];
    readonly source: Literal;
    constructor(specifiers: any, source: any);
}
export declare class ImportDefaultSpecifier {
    readonly type: string;
    readonly local: Identifier;
    constructor(local: Identifier);
}
export declare class ImportNamespaceSpecifier {
    readonly type: string;
    readonly local: Identifier;
    constructor(local: Identifier);
}
export declare class ImportSpecifier {
    readonly type: string;
    readonly local: Identifier | null;
    readonly imported: Identifier;
    constructor(local: Identifier | null, imported: Identifier);
}
export declare class LabeledStatement {
    readonly type: string;
    readonly label: Identifier;
    readonly body: Statement;
    constructor(label: Identifier, body: Statement);
}
export declare class Literal {
    readonly type: string;
    readonly value: boolean | number | string | null;
    readonly raw: string;
    constructor(value: boolean | number | string | null, raw: string);
}
export declare class MetaProperty {
    readonly type: string;
    readonly meta: Identifier;
    readonly property: Identifier;
    constructor(meta: Identifier, property: Identifier);
}
export declare class MethodDefinition {
    readonly type: string;
    readonly key: Expression | null;
    readonly computed: boolean;
    readonly value: AsyncFunctionExpression | FunctionExpression | null;
    readonly kind: string;
    readonly static: boolean;
    constructor(key: Expression | null, computed: boolean, value: AsyncFunctionExpression | FunctionExpression | null, kind: string, isStatic: boolean);
}
export declare class Module {
    readonly type: string;
    readonly body: StatementListItem[];
    readonly sourceType: string;
    constructor(body: StatementListItem[]);
}
export declare class NewExpression {
    readonly type: string;
    readonly callee: Expression;
    readonly arguments: ArgumentListElement[];
    constructor(callee: Expression, args: ArgumentListElement[]);
}
export declare class ObjectExpression {
    readonly type: string;
    readonly properties: ObjectExpressionProperty[];
    constructor(properties: ObjectExpressionProperty[]);
}
export declare class ObjectPattern {
    readonly type: string;
    readonly properties: ObjectPatternProperty[];
    constructor(properties: ObjectPatternProperty[]);
}
export declare class Property {
    readonly type: string;
    readonly key: PropertyKey;
    readonly computed: boolean;
    readonly value: PropertyValue | null;
    readonly kind: string;
    readonly method: boolean;
    readonly shorthand: boolean;
    constructor(kind: string, key: PropertyKey, computed: boolean, value: PropertyValue | null, method: boolean, shorthand: boolean);
}
export declare class RegexLiteral {
    readonly type: string;
    readonly value: RegExp;
    readonly raw: string;
    readonly regex: {
        pattern: string;
        flags: string;
    };
    constructor(value: RegExp, raw: string, pattern: string, flags: string);
}
export declare class RestElement {
    readonly type: string;
    readonly argument: BindingIdentifier | BindingPattern;
    constructor(argument: BindingIdentifier | BindingPattern);
}
export declare class ReturnStatement {
    readonly type: string;
    readonly argument: Expression | null;
    constructor(argument: Expression | null);
}
export declare class Script {
    readonly type: string;
    readonly body: StatementListItem[];
    readonly sourceType: string;
    constructor(body: StatementListItem[]);
}
export declare class SequenceExpression {
    readonly type: string;
    readonly expressions: Expression[];
    constructor(expressions: Expression[]);
}
export declare class SpreadElement {
    readonly type: string;
    readonly argument: Expression;
    constructor(argument: Expression);
}
export declare class StaticMemberExpression {
    readonly type: string;
    readonly computed: boolean;
    readonly object: Expression;
    readonly property: Expression;
    constructor(object: Expression, property: Expression);
}
export declare class OptionalMemberExpression {
    readonly type: string;
    readonly computed: boolean;
    readonly optional: boolean;
    readonly object: Expression;
    readonly property: Expression;
    constructor(object: Expression, property: Expression);
}
export declare class Super {
    readonly type: string;
    constructor();
}
export declare class SwitchCase {
    readonly type: string;
    readonly test: Expression | null;
    readonly consequent: Statement[];
    constructor(test: Expression | null, consequent: Statement[]);
}
export declare class SwitchStatement {
    readonly type: string;
    readonly discriminant: Expression;
    readonly cases: SwitchCase[];
    constructor(discriminant: Expression, cases: SwitchCase[]);
}
export declare class TaggedTemplateExpression {
    readonly type: string;
    readonly tag: Expression;
    readonly quasi: TemplateLiteral;
    constructor(tag: Expression, quasi: TemplateLiteral);
}
interface TemplateElementValue {
    cooked: string;
    raw: string;
}
export declare class TemplateElement {
    readonly type: string;
    readonly value: TemplateElementValue;
    readonly tail: boolean;
    constructor(value: TemplateElementValue, tail: boolean);
}
export declare class TemplateLiteral {
    readonly type: string;
    readonly quasis: TemplateElement[];
    readonly expressions: Expression[];
    constructor(quasis: TemplateElement[], expressions: Expression[]);
}
export declare class ThisExpression {
    readonly type: string;
    constructor();
}
export declare class ThrowStatement {
    readonly type: string;
    readonly argument: Expression;
    constructor(argument: Expression);
}
export declare class TryStatement {
    readonly type: string;
    readonly block: BlockStatement;
    readonly handler: CatchClause | null;
    readonly finalizer: BlockStatement | null;
    constructor(block: BlockStatement, handler: CatchClause | null, finalizer: BlockStatement | null);
}
export declare class UnaryExpression {
    readonly type: string;
    readonly operator: string;
    readonly argument: Expression;
    readonly prefix: boolean;
    constructor(operator: string, argument: Expression);
}
export declare class UpdateExpression {
    readonly type: string;
    readonly operator: string;
    readonly argument: Expression;
    readonly prefix: boolean;
    constructor(operator: string, argument: Expression, prefix: boolean);
}
export declare class VariableDeclaration {
    readonly type: string;
    readonly declarations: VariableDeclarator[];
    readonly kind: string;
    constructor(declarations: VariableDeclarator[], kind: string);
}
export declare class VariableDeclarator {
    readonly type: string;
    readonly id: BindingIdentifier | BindingPattern;
    readonly init: Expression | null;
    constructor(id: BindingIdentifier | BindingPattern, init: Expression | null);
}
export declare class WhileStatement {
    readonly type: string;
    readonly test: Expression;
    readonly body: Statement;
    constructor(test: Expression, body: Statement);
}
export declare class WithStatement {
    readonly type: string;
    readonly object: Expression;
    readonly body: Statement;
    constructor(object: Expression, body: Statement);
}
export declare class YieldExpression {
    readonly type: string;
    readonly argument: Expression | null;
    readonly delegate: boolean;
    constructor(argument: Expression | null, delegate: boolean);
}
export declare class URIIdentifier {
    readonly type: string;
    readonly uri: string;
    constructor(uri: string);
}
export declare class QueryExpression {
    readonly type: string;
    readonly select: SelectClause;
    readonly from: FromClause;
    readonly where: WhereClause | null;
    constructor(selectClause: SelectClause, fromClause: FromClause, whereClause: WhereClause | null);
}
export declare class SelectStatement {
    readonly type: string;
    readonly body: QueryExpression;
    constructor(body: QueryExpression);
}
/**
 * The SELECT clause defines the projection of the SELECT expression.
 * The result has at least one column.
 */
export declare class SelectClause {
    readonly type: string;
    readonly projections: SelectItemExpression[];
    constructor(projections: SelectItemExpression[]);
}
/**
 *  A FromClause has one or more FromClauseElement
 */
export declare class FromClause {
    readonly type: string;
    readonly expressions: FromClauseElement[];
    constructor(expressions: FromClauseElement[]);
}
export declare class FromClauseElement {
    readonly type: string;
    readonly expression: Expression;
    readonly alias: Literal | null;
    constructor(expression: Expression, alias: Literal | null);
}
export declare class WhereClause {
    readonly type: string;
    readonly expression: Expression;
    constructor(expression: Expression);
}
export declare class SelectItemExpression {
    readonly type: string;
    readonly alias: Identifier | null;
    readonly expression: Expression;
    constructor(expression: Expression, alias: Identifier | null);
}
export {};
