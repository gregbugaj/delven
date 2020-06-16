"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.YieldExpression = exports.WithStatement = exports.WhileStatement = exports.VariableDeclarator = exports.VariableDeclaration = exports.UpdateExpression = exports.UnaryExpression = exports.TryStatement = exports.ThrowStatement = exports.ThisExpression = exports.TemplateLiteral = exports.TemplateElement = exports.TaggedTemplateExpression = exports.SwitchStatement = exports.SwitchCase = exports.Super = exports.StaticMemberExpression = exports.SpreadElement = exports.SequenceExpression = exports.Script = exports.ReturnStatement = exports.RestElement = exports.RegexLiteral = exports.Property = exports.ObjectPattern = exports.ObjectExpression = exports.NewExpression = exports.Module = exports.MethodDefinition = exports.MetaProperty = exports.Literal = exports.LabeledStatement = exports.ImportSpecifier = exports.ImportNamespaceSpecifier = exports.ImportDefaultSpecifier = exports.ImportDeclaration = exports.Import = exports.IfStatement = exports.Identifier = exports.FunctionExpression = exports.FunctionDeclaration = exports.ForStatement = exports.ForOfStatement = exports.ForInStatement = exports.ExpressionStatement = exports.ExportSpecifier = exports.ExportNamedDeclaration = exports.ExportDefaultDeclaration = exports.ExportAllDeclaration = exports.EmptyStatement = exports.DoWhileStatement = exports.Directive = exports.DebuggerStatement = exports.ContinueStatement = exports.ConditionalExpression = exports.ComputedMemberExpression = exports.ClassExpression = exports.ClassDeclaration = exports.ClassBody = exports.CatchClause = exports.CallExpression = exports.BreakStatement = exports.BlockStatement = exports.BinaryExpression = exports.AwaitExpression = exports.AsyncFunctionExpression = exports.AsyncFunctionDeclaration = exports.AsyncArrowFunctionExpression = exports.AssignmentPattern = exports.AssignmentExpression = exports.ArrowFunctionExpression = exports.ArrayPattern = exports.ArrayExpression = void 0;

var _syntax = require("./syntax");

/**
 * https://raw.githubusercontent.com/jquery/esprima/master/src/nodes.ts
 */
class ArrayExpression {
  constructor(elements) {
    this.type = _syntax.Syntax.ArrayExpression;
    this.elements = elements;
  }

}

exports.ArrayExpression = ArrayExpression;

class ArrayPattern {
  constructor(elements) {
    this.type = _syntax.Syntax.ArrayPattern;
    this.elements = elements;
  }

}

exports.ArrayPattern = ArrayPattern;

class ArrowFunctionExpression {
  constructor(params, body, expression) {
    this.type = _syntax.Syntax.ArrowFunctionExpression;
    this.id = null;
    this.params = params;
    this.body = body;
    this.generator = false;
    this.expression = expression;
    this.async = false;
  }

}

exports.ArrowFunctionExpression = ArrowFunctionExpression;

class AssignmentExpression {
  constructor(operator, left, right) {
    this.type = _syntax.Syntax.AssignmentExpression;
    this.operator = operator;
    this.left = left;
    this.right = right;
  }

}

exports.AssignmentExpression = AssignmentExpression;

class AssignmentPattern {
  constructor(left, right) {
    this.type = _syntax.Syntax.AssignmentPattern;
    this.left = left;
    this.right = right;
  }

}

exports.AssignmentPattern = AssignmentPattern;

class AsyncArrowFunctionExpression {
  constructor(params, body, expression) {
    this.type = _syntax.Syntax.ArrowFunctionExpression;
    this.id = null;
    this.params = params;
    this.body = body;
    this.generator = false;
    this.expression = expression;
    this.async = true;
  }

}

exports.AsyncArrowFunctionExpression = AsyncArrowFunctionExpression;

class AsyncFunctionDeclaration {
  constructor(id, params, body) {
    this.type = _syntax.Syntax.FunctionDeclaration;
    this.id = id;
    this.params = params;
    this.body = body;
    this.generator = false;
    this.expression = false;
    this.async = true;
  }

}

exports.AsyncFunctionDeclaration = AsyncFunctionDeclaration;

class AsyncFunctionExpression {
  constructor(id, params, body) {
    this.type = _syntax.Syntax.FunctionExpression;
    this.id = id;
    this.params = params;
    this.body = body;
    this.generator = false;
    this.expression = false;
    this.async = true;
  }

}

exports.AsyncFunctionExpression = AsyncFunctionExpression;

class AwaitExpression {
  constructor(argument) {
    this.type = _syntax.Syntax.AwaitExpression;
    this.argument = argument;
  }

}

exports.AwaitExpression = AwaitExpression;

class BinaryExpression {
  constructor(operator, left, right) {
    const logical = operator === '||' || operator === '&&';
    this.type = logical ? _syntax.Syntax.LogicalExpression : _syntax.Syntax.BinaryExpression;
    this.operator = operator;
    this.left = left;
    this.right = right;
  }

}

exports.BinaryExpression = BinaryExpression;

class BlockStatement {
  constructor(body) {
    this.type = _syntax.Syntax.BlockStatement;
    this.body = body;
  }

}

exports.BlockStatement = BlockStatement;

class BreakStatement {
  constructor(label) {
    this.type = _syntax.Syntax.BreakStatement;
    this.label = label;
  }

}

exports.BreakStatement = BreakStatement;

class CallExpression {
  constructor(callee, args) {
    this.type = _syntax.Syntax.CallExpression;
    this.callee = callee;
    this.arguments = args;
  }

}

exports.CallExpression = CallExpression;

class CatchClause {
  constructor(param, body) {
    this.type = _syntax.Syntax.CatchClause;
    this.param = param;
    this.body = body;
  }

}

exports.CatchClause = CatchClause;

class ClassBody {
  constructor(body) {
    this.type = _syntax.Syntax.ClassBody;
    this.body = body;
  }

}

exports.ClassBody = ClassBody;

class ClassDeclaration {
  constructor(id, superClass, body) {
    this.type = _syntax.Syntax.ClassDeclaration;
    this.id = id;
    this.superClass = superClass;
    this.body = body;
  }

}

exports.ClassDeclaration = ClassDeclaration;

class ClassExpression {
  constructor(id, superClass, body) {
    this.type = _syntax.Syntax.ClassExpression;
    this.id = id;
    this.superClass = superClass;
    this.body = body;
  }

}

exports.ClassExpression = ClassExpression;

class ComputedMemberExpression {
  constructor(object, property) {
    this.type = _syntax.Syntax.MemberExpression;
    this.computed = true;
    this.object = object;
    this.property = property;
  }

}

exports.ComputedMemberExpression = ComputedMemberExpression;

class ConditionalExpression {
  constructor(test, consequent, alternate) {
    this.type = _syntax.Syntax.ConditionalExpression;
    this.test = test;
    this.consequent = consequent;
    this.alternate = alternate;
  }

}

exports.ConditionalExpression = ConditionalExpression;

class ContinueStatement {
  constructor(label) {
    this.type = _syntax.Syntax.ContinueStatement;
    this.label = label;
  }

}

exports.ContinueStatement = ContinueStatement;

class DebuggerStatement {
  constructor() {
    this.type = _syntax.Syntax.DebuggerStatement;
  }

}

exports.DebuggerStatement = DebuggerStatement;

class Directive {
  constructor(expression, directive) {
    this.type = _syntax.Syntax.ExpressionStatement;
    this.expression = expression;
    this.directive = directive;
  }

}

exports.Directive = Directive;

class DoWhileStatement {
  constructor(body, test) {
    this.type = _syntax.Syntax.DoWhileStatement;
    this.body = body;
    this.test = test;
  }

}

exports.DoWhileStatement = DoWhileStatement;

class EmptyStatement {
  constructor() {
    this.type = _syntax.Syntax.EmptyStatement;
  }

}

exports.EmptyStatement = EmptyStatement;

class ExportAllDeclaration {
  constructor(source) {
    this.type = _syntax.Syntax.ExportAllDeclaration;
    this.source = source;
  }

}

exports.ExportAllDeclaration = ExportAllDeclaration;

class ExportDefaultDeclaration {
  constructor(declaration) {
    this.type = _syntax.Syntax.ExportDefaultDeclaration;
    this.declaration = declaration;
  }

}

exports.ExportDefaultDeclaration = ExportDefaultDeclaration;

class ExportNamedDeclaration {
  constructor(declaration, specifiers, source) {
    this.type = _syntax.Syntax.ExportNamedDeclaration;
    this.declaration = declaration;
    this.specifiers = specifiers;
    this.source = source;
  }

}

exports.ExportNamedDeclaration = ExportNamedDeclaration;

class ExportSpecifier {
  constructor(local, exported) {
    this.type = _syntax.Syntax.ExportSpecifier;
    this.exported = exported;
    this.local = local;
  }

}

exports.ExportSpecifier = ExportSpecifier;

class ExpressionStatement {
  constructor(expression) {
    this.type = _syntax.Syntax.ExpressionStatement;
    this.expression = expression;
  }

}

exports.ExpressionStatement = ExpressionStatement;

class ForInStatement {
  constructor(left, right, body) {
    this.type = _syntax.Syntax.ForInStatement;
    this.left = left;
    this.right = right;
    this.body = body;
    this.each = false;
  }

}

exports.ForInStatement = ForInStatement;

class ForOfStatement {
  constructor(left, right, body) {
    this.type = _syntax.Syntax.ForOfStatement;
    this.left = left;
    this.right = right;
    this.body = body;
  }

}

exports.ForOfStatement = ForOfStatement;

class ForStatement {
  constructor(init, test, update, body) {
    this.type = _syntax.Syntax.ForStatement;
    this.init = init;
    this.test = test;
    this.update = update;
    this.body = body;
  }

}

exports.ForStatement = ForStatement;

class FunctionDeclaration {
  constructor(id, params, body, generator) {
    this.type = _syntax.Syntax.FunctionDeclaration;
    this.id = id;
    this.params = params;
    this.body = body;
    this.generator = generator;
    this.expression = false;
    this.async = false;
  }

}

exports.FunctionDeclaration = FunctionDeclaration;

class FunctionExpression {
  constructor(id, params, body, generator) {
    this.type = _syntax.Syntax.FunctionExpression;
    this.id = id;
    this.params = params;
    this.body = body;
    this.generator = generator;
    this.expression = false;
    this.async = false;
  }

}

exports.FunctionExpression = FunctionExpression;

class Identifier {
  constructor(name) {
    this.type = _syntax.Syntax.Identifier;
    this.name = name;
  }

}

exports.Identifier = Identifier;

class IfStatement {
  constructor(test, consequent, alternate) {
    this.type = _syntax.Syntax.IfStatement;
    this.test = test;
    this.consequent = consequent;
    this.alternate = alternate;
  }

}

exports.IfStatement = IfStatement;

class Import {
  constructor() {
    this.type = _syntax.Syntax.Import;
  }

}

exports.Import = Import;

class ImportDeclaration {
  constructor(specifiers, source) {
    this.type = _syntax.Syntax.ImportDeclaration;
    this.specifiers = specifiers;
    this.source = source;
  }

}

exports.ImportDeclaration = ImportDeclaration;

class ImportDefaultSpecifier {
  constructor(local) {
    this.type = _syntax.Syntax.ImportDefaultSpecifier;
    this.local = local;
  }

}

exports.ImportDefaultSpecifier = ImportDefaultSpecifier;

class ImportNamespaceSpecifier {
  constructor(local) {
    this.type = _syntax.Syntax.ImportNamespaceSpecifier;
    this.local = local;
  }

}

exports.ImportNamespaceSpecifier = ImportNamespaceSpecifier;

class ImportSpecifier {
  constructor(local, imported) {
    this.type = _syntax.Syntax.ImportSpecifier;
    this.local = local;
    this.imported = imported;
  }

}

exports.ImportSpecifier = ImportSpecifier;

class LabeledStatement {
  constructor(label, body) {
    this.type = _syntax.Syntax.LabeledStatement;
    this.label = label;
    this.body = body;
  }

}

exports.LabeledStatement = LabeledStatement;

class Literal {
  constructor(value, raw) {
    this.type = _syntax.Syntax.Literal;
    this.value = value;
    this.raw = raw;
  }

}

exports.Literal = Literal;

class MetaProperty {
  constructor(meta, property) {
    this.type = _syntax.Syntax.MetaProperty;
    this.meta = meta;
    this.property = property;
  }

}

exports.MetaProperty = MetaProperty;

class MethodDefinition {
  constructor(key, computed, value, kind, isStatic) {
    this.type = _syntax.Syntax.MethodDefinition;
    this.key = key;
    this.computed = computed;
    this.value = value;
    this.kind = kind;
    this.static = isStatic;
  }

}

exports.MethodDefinition = MethodDefinition;

class Module {
  constructor(body) {
    this.type = _syntax.Syntax.Program;
    this.body = body;
    this.sourceType = 'module';
  }

}

exports.Module = Module;

class NewExpression {
  constructor(callee, args) {
    this.type = _syntax.Syntax.NewExpression;
    this.callee = callee;
    this.arguments = args;
  }

}

exports.NewExpression = NewExpression;

class ObjectExpression {
  constructor(properties) {
    this.type = _syntax.Syntax.ObjectExpression;
    this.properties = properties;
  }

}

exports.ObjectExpression = ObjectExpression;

class ObjectPattern {
  constructor(properties) {
    this.type = _syntax.Syntax.ObjectPattern;
    this.properties = properties;
  }

}

exports.ObjectPattern = ObjectPattern;

class Property {
  constructor(kind, key, computed, value, method, shorthand) {
    this.type = _syntax.Syntax.Property;
    this.key = key;
    this.computed = computed;
    this.value = value;
    this.kind = kind;
    this.method = method;
    this.shorthand = shorthand;
  }

}

exports.Property = Property;

class RegexLiteral {
  constructor(value, raw, pattern, flags) {
    this.type = _syntax.Syntax.Literal;
    this.value = value;
    this.raw = raw;
    this.regex = {
      pattern,
      flags
    };
  }

}

exports.RegexLiteral = RegexLiteral;

class RestElement {
  constructor(argument) {
    this.type = _syntax.Syntax.RestElement;
    this.argument = argument;
  }

}

exports.RestElement = RestElement;

class ReturnStatement {
  constructor(argument) {
    this.type = _syntax.Syntax.ReturnStatement;
    this.argument = argument;
  }

}

exports.ReturnStatement = ReturnStatement;

class Script {
  constructor(body) {
    this.type = _syntax.Syntax.Program;
    this.body = body;
    this.sourceType = 'script';
  }

}

exports.Script = Script;

class SequenceExpression {
  constructor(expressions) {
    this.type = _syntax.Syntax.SequenceExpression;
    this.expressions = expressions;
  }

}

exports.SequenceExpression = SequenceExpression;

class SpreadElement {
  constructor(argument) {
    this.type = _syntax.Syntax.SpreadElement;
    this.argument = argument;
  }

}

exports.SpreadElement = SpreadElement;

class StaticMemberExpression {
  constructor(object, property) {
    this.type = _syntax.Syntax.MemberExpression;
    this.computed = false;
    this.object = object;
    this.property = property;
  }

}

exports.StaticMemberExpression = StaticMemberExpression;

class Super {
  constructor() {
    this.type = _syntax.Syntax.Super;
  }

}

exports.Super = Super;

class SwitchCase {
  constructor(test, consequent) {
    this.type = _syntax.Syntax.SwitchCase;
    this.test = test;
    this.consequent = consequent;
  }

}

exports.SwitchCase = SwitchCase;

class SwitchStatement {
  constructor(discriminant, cases) {
    this.type = _syntax.Syntax.SwitchStatement;
    this.discriminant = discriminant;
    this.cases = cases;
  }

}

exports.SwitchStatement = SwitchStatement;

class TaggedTemplateExpression {
  constructor(tag, quasi) {
    this.type = _syntax.Syntax.TaggedTemplateExpression;
    this.tag = tag;
    this.quasi = quasi;
  }

}

exports.TaggedTemplateExpression = TaggedTemplateExpression;

class TemplateElement {
  constructor(value, tail) {
    this.type = _syntax.Syntax.TemplateElement;
    this.value = value;
    this.tail = tail;
  }

}

exports.TemplateElement = TemplateElement;

class TemplateLiteral {
  constructor(quasis, expressions) {
    this.type = _syntax.Syntax.TemplateLiteral;
    this.quasis = quasis;
    this.expressions = expressions;
  }

}

exports.TemplateLiteral = TemplateLiteral;

class ThisExpression {
  constructor() {
    this.type = _syntax.Syntax.ThisExpression;
  }

}

exports.ThisExpression = ThisExpression;

class ThrowStatement {
  constructor(argument) {
    this.type = _syntax.Syntax.ThrowStatement;
    this.argument = argument;
  }

}

exports.ThrowStatement = ThrowStatement;

class TryStatement {
  constructor(block, handler, finalizer) {
    this.type = _syntax.Syntax.TryStatement;
    this.block = block;
    this.handler = handler;
    this.finalizer = finalizer;
  }

}

exports.TryStatement = TryStatement;

class UnaryExpression {
  constructor(operator, argument) {
    this.type = _syntax.Syntax.UnaryExpression;
    this.operator = operator;
    this.argument = argument;
    this.prefix = true;
  }

}

exports.UnaryExpression = UnaryExpression;

class UpdateExpression {
  constructor(operator, argument, prefix) {
    this.type = _syntax.Syntax.UpdateExpression;
    this.operator = operator;
    this.argument = argument;
    this.prefix = prefix;
  }

}

exports.UpdateExpression = UpdateExpression;

class VariableDeclaration {
  constructor(declarations, kind) {
    this.type = _syntax.Syntax.VariableDeclaration;
    this.declarations = declarations;
    this.kind = kind;
  }

}

exports.VariableDeclaration = VariableDeclaration;

class VariableDeclarator {
  constructor(id, init) {
    this.type = _syntax.Syntax.VariableDeclarator;
    this.id = id;
    this.init = init;
  }

}

exports.VariableDeclarator = VariableDeclarator;

class WhileStatement {
  constructor(test, body) {
    this.type = _syntax.Syntax.WhileStatement;
    this.test = test;
    this.body = body;
  }

}

exports.WhileStatement = WhileStatement;

class WithStatement {
  constructor(object, body) {
    this.type = _syntax.Syntax.WithStatement;
    this.object = object;
    this.body = body;
  }

}

exports.WithStatement = WithStatement;

class YieldExpression {
  constructor(argument, delegate) {
    this.type = _syntax.Syntax.YieldExpression;
    this.argument = argument;
    this.delegate = delegate;
  }

}

exports.YieldExpression = YieldExpression;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9ub2Rlcy50cyJdLCJuYW1lcyI6WyJBcnJheUV4cHJlc3Npb24iLCJjb25zdHJ1Y3RvciIsImVsZW1lbnRzIiwidHlwZSIsIlN5bnRheCIsIkFycmF5UGF0dGVybiIsIkFycm93RnVuY3Rpb25FeHByZXNzaW9uIiwicGFyYW1zIiwiYm9keSIsImV4cHJlc3Npb24iLCJpZCIsImdlbmVyYXRvciIsImFzeW5jIiwiQXNzaWdubWVudEV4cHJlc3Npb24iLCJvcGVyYXRvciIsImxlZnQiLCJyaWdodCIsIkFzc2lnbm1lbnRQYXR0ZXJuIiwiQXN5bmNBcnJvd0Z1bmN0aW9uRXhwcmVzc2lvbiIsIkFzeW5jRnVuY3Rpb25EZWNsYXJhdGlvbiIsIkZ1bmN0aW9uRGVjbGFyYXRpb24iLCJBc3luY0Z1bmN0aW9uRXhwcmVzc2lvbiIsIkZ1bmN0aW9uRXhwcmVzc2lvbiIsIkF3YWl0RXhwcmVzc2lvbiIsImFyZ3VtZW50IiwiQmluYXJ5RXhwcmVzc2lvbiIsImxvZ2ljYWwiLCJMb2dpY2FsRXhwcmVzc2lvbiIsIkJsb2NrU3RhdGVtZW50IiwiQnJlYWtTdGF0ZW1lbnQiLCJsYWJlbCIsIkNhbGxFeHByZXNzaW9uIiwiY2FsbGVlIiwiYXJncyIsImFyZ3VtZW50cyIsIkNhdGNoQ2xhdXNlIiwicGFyYW0iLCJDbGFzc0JvZHkiLCJDbGFzc0RlY2xhcmF0aW9uIiwic3VwZXJDbGFzcyIsIkNsYXNzRXhwcmVzc2lvbiIsIkNvbXB1dGVkTWVtYmVyRXhwcmVzc2lvbiIsIm9iamVjdCIsInByb3BlcnR5IiwiTWVtYmVyRXhwcmVzc2lvbiIsImNvbXB1dGVkIiwiQ29uZGl0aW9uYWxFeHByZXNzaW9uIiwidGVzdCIsImNvbnNlcXVlbnQiLCJhbHRlcm5hdGUiLCJDb250aW51ZVN0YXRlbWVudCIsIkRlYnVnZ2VyU3RhdGVtZW50IiwiRGlyZWN0aXZlIiwiZGlyZWN0aXZlIiwiRXhwcmVzc2lvblN0YXRlbWVudCIsIkRvV2hpbGVTdGF0ZW1lbnQiLCJFbXB0eVN0YXRlbWVudCIsIkV4cG9ydEFsbERlY2xhcmF0aW9uIiwic291cmNlIiwiRXhwb3J0RGVmYXVsdERlY2xhcmF0aW9uIiwiZGVjbGFyYXRpb24iLCJFeHBvcnROYW1lZERlY2xhcmF0aW9uIiwic3BlY2lmaWVycyIsIkV4cG9ydFNwZWNpZmllciIsImxvY2FsIiwiZXhwb3J0ZWQiLCJGb3JJblN0YXRlbWVudCIsImVhY2giLCJGb3JPZlN0YXRlbWVudCIsIkZvclN0YXRlbWVudCIsImluaXQiLCJ1cGRhdGUiLCJJZGVudGlmaWVyIiwibmFtZSIsIklmU3RhdGVtZW50IiwiSW1wb3J0IiwiSW1wb3J0RGVjbGFyYXRpb24iLCJJbXBvcnREZWZhdWx0U3BlY2lmaWVyIiwiSW1wb3J0TmFtZXNwYWNlU3BlY2lmaWVyIiwiSW1wb3J0U3BlY2lmaWVyIiwiaW1wb3J0ZWQiLCJMYWJlbGVkU3RhdGVtZW50IiwiTGl0ZXJhbCIsInZhbHVlIiwicmF3IiwiTWV0YVByb3BlcnR5IiwibWV0YSIsIk1ldGhvZERlZmluaXRpb24iLCJrZXkiLCJraW5kIiwiaXNTdGF0aWMiLCJzdGF0aWMiLCJNb2R1bGUiLCJQcm9ncmFtIiwic291cmNlVHlwZSIsIk5ld0V4cHJlc3Npb24iLCJPYmplY3RFeHByZXNzaW9uIiwicHJvcGVydGllcyIsIk9iamVjdFBhdHRlcm4iLCJQcm9wZXJ0eSIsIm1ldGhvZCIsInNob3J0aGFuZCIsIlJlZ2V4TGl0ZXJhbCIsInBhdHRlcm4iLCJmbGFncyIsInJlZ2V4IiwiUmVzdEVsZW1lbnQiLCJSZXR1cm5TdGF0ZW1lbnQiLCJTY3JpcHQiLCJTZXF1ZW5jZUV4cHJlc3Npb24iLCJleHByZXNzaW9ucyIsIlNwcmVhZEVsZW1lbnQiLCJTdGF0aWNNZW1iZXJFeHByZXNzaW9uIiwiU3VwZXIiLCJTd2l0Y2hDYXNlIiwiU3dpdGNoU3RhdGVtZW50IiwiZGlzY3JpbWluYW50IiwiY2FzZXMiLCJUYWdnZWRUZW1wbGF0ZUV4cHJlc3Npb24iLCJ0YWciLCJxdWFzaSIsIlRlbXBsYXRlRWxlbWVudCIsInRhaWwiLCJUZW1wbGF0ZUxpdGVyYWwiLCJxdWFzaXMiLCJUaGlzRXhwcmVzc2lvbiIsIlRocm93U3RhdGVtZW50IiwiVHJ5U3RhdGVtZW50IiwiYmxvY2siLCJoYW5kbGVyIiwiZmluYWxpemVyIiwiVW5hcnlFeHByZXNzaW9uIiwicHJlZml4IiwiVXBkYXRlRXhwcmVzc2lvbiIsIlZhcmlhYmxlRGVjbGFyYXRpb24iLCJkZWNsYXJhdGlvbnMiLCJWYXJpYWJsZURlY2xhcmF0b3IiLCJXaGlsZVN0YXRlbWVudCIsIldpdGhTdGF0ZW1lbnQiLCJZaWVsZEV4cHJlc3Npb24iLCJkZWxlZ2F0ZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUdBOztBQUhBOzs7QUFnQ08sTUFBTUEsZUFBTixDQUFzQjtBQUd6QkMsRUFBQUEsV0FBVyxDQUFDQyxRQUFELEVBQXFDO0FBQzVDLFNBQUtDLElBQUwsR0FBWUMsZUFBT0osZUFBbkI7QUFDQSxTQUFLRSxRQUFMLEdBQWdCQSxRQUFoQjtBQUNIOztBQU53Qjs7OztBQVN0QixNQUFNRyxZQUFOLENBQW1CO0FBR3RCSixFQUFBQSxXQUFXLENBQUNDLFFBQUQsRUFBa0M7QUFDekMsU0FBS0MsSUFBTCxHQUFZQyxlQUFPQyxZQUFuQjtBQUNBLFNBQUtILFFBQUwsR0FBZ0JBLFFBQWhCO0FBQ0g7O0FBTnFCOzs7O0FBU25CLE1BQU1JLHVCQUFOLENBQThCO0FBUWpDTCxFQUFBQSxXQUFXLENBQUNNLE1BQUQsRUFBOEJDLElBQTlCLEVBQWlFQyxVQUFqRSxFQUFzRjtBQUM3RixTQUFLTixJQUFMLEdBQVlDLGVBQU9FLHVCQUFuQjtBQUNBLFNBQUtJLEVBQUwsR0FBVSxJQUFWO0FBQ0EsU0FBS0gsTUFBTCxHQUFjQSxNQUFkO0FBQ0EsU0FBS0MsSUFBTCxHQUFZQSxJQUFaO0FBQ0EsU0FBS0csU0FBTCxHQUFpQixLQUFqQjtBQUNBLFNBQUtGLFVBQUwsR0FBa0JBLFVBQWxCO0FBQ0EsU0FBS0csS0FBTCxHQUFhLEtBQWI7QUFDSDs7QUFoQmdDOzs7O0FBbUI5QixNQUFNQyxvQkFBTixD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NEQsSUFBekMsRUFBa0U7QUFDekUsU0FBS25FLElBQUwsR0FBWUMsZUFBT29JLGtCQUFuQjtBQUNBLFNBQUs5SCxFQUFMLEdBQVVBLEVBQVY7QUFDQSxTQUFLNEQsSUFBTCxHQUFZQSxJQUFaO0FBQ0g7O0FBUjJCOzs7O0FBV3pCLE1BQU1tRSxjQUFOLENBQXFCO0FBSXhCeEksRUFBQUEsV0FBVyxDQUFDOEMsSUFBRCxFQUFtQnZDLElBQW5CLEVBQW9DO0FBQzNDLFNBQUtMLElBQUwsR0FBWUMsZUFBT3FJLGNBQW5CO0FBQ0EsU0FBSzFGLElBQUwsR0FBWUEsSUFBWjtBQUNBLFNBQUt2QyxJQUFMLEdBQVlBLElBQVo7QUFDSDs7QUFSdUI7Ozs7QUFXckIsTUFBTWtJLGFBQU4sQ0FBb0I7QUFJdkJ6SSxFQUFBQSxXQUFXLENBQUN5QyxNQUFELEVBQXFCbEMsSUFBckIsRUFBc0M7QUFDN0MsU0FBS0wsSUFBTCxHQUFZQyxlQUFPc0ksYUFBbkI7QUFDQSxTQUFLaEcsTUFBTCxHQUFjQSxNQUFkO0FBQ0EsU0FBS2xDLElBQUwsR0FBWUEsSUFBWjtBQUNIOztBQVJzQjs7OztBQVdwQixNQUFNbUksZUFBTixDQUFzQjtBQUl6QjFJLEVBQUFBLFdBQVcsQ0FBQ3VCLFFBQUQsRUFBOEJvSCxRQUE5QixFQUFpRDtBQUN4RCxTQUFLekksSUFBTCxHQUFZQyxlQUFPdUksZUFBbkI7QUFDQSxTQUFLbkgsUUFBTCxHQUFnQkEsUUFBaEI7QUFDQSxTQUFLb0gsUUFBTCxHQUFnQkEsUUFBaEI7QUFDSDs7QUFSd0IiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIGh0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS9qcXVlcnkvZXNwcmltYS9tYXN0ZXIvc3JjL25vZGVzLnRzXG4gKi9cbmltcG9ydCB7IFN5bnRheCB9IGZyb20gJy4vc3ludGF4JztcbmltcG9ydCBBU1ROb2RlIGZyb20gJy4vQVNUTm9kZSc7XG5cbmV4cG9ydCB0eXBlIEFyZ3VtZW50TGlzdEVsZW1lbnQgPSBFeHByZXNzaW9uIHwgU3ByZWFkRWxlbWVudDtcbmV4cG9ydCB0eXBlIEFycmF5RXhwcmVzc2lvbkVsZW1lbnQgPSBFeHByZXNzaW9uIHwgU3ByZWFkRWxlbWVudCB8IG51bGw7XG5leHBvcnQgdHlwZSBBcnJheVBhdHRlcm5FbGVtZW50ID0gQXNzaWdubWVudFBhdHRlcm4gfCBCaW5kaW5nSWRlbnRpZmllciB8IEJpbmRpbmdQYXR0ZXJuIHwgUmVzdEVsZW1lbnQgfCBudWxsO1xuZXhwb3J0IHR5cGUgQmluZGluZ1BhdHRlcm4gPSBBcnJheVBhdHRlcm4gfCBPYmplY3RQYXR0ZXJuO1xuZXhwb3J0IHR5cGUgQmluZGluZ0lkZW50aWZpZXIgPSBJZGVudGlmaWVyO1xuZXhwb3J0IHR5cGUgRGVjbGFyYXRpb24gPSBBc3luY0Z1bmN0aW9uRGVjbGFyYXRpb24gfCBDbGFzc0RlY2xhcmF0aW9uIHwgRXhwb3J0RGVjbGFyYXRpb24gfCBGdW5jdGlvbkRlY2xhcmF0aW9uIHwgSW1wb3J0RGVjbGFyYXRpb24gfCBWYXJpYWJsZURlY2xhcmF0aW9uO1xuZXhwb3J0IHR5cGUgRXhwb3J0YWJsZURlZmF1bHREZWNsYXJhdGlvbiA9IEJpbmRpbmdJZGVudGlmaWVyIHwgQmluZGluZ1BhdHRlcm4gfCBDbGFzc0RlY2xhcmF0aW9uIHwgRXhwcmVzc2lvbiB8IEZ1bmN0aW9uRGVjbGFyYXRpb247XG5leHBvcnQgdHlwZSBFeHBvcnRhYmxlTmFtZWREZWNsYXJhdGlvbiA9IEFzeW5jRnVuY3Rpb25EZWNsYXJhdGlvbiB8IENsYXNzRGVjbGFyYXRpb24gfCBGdW5jdGlvbkRlY2xhcmF0aW9uIHwgVmFyaWFibGVEZWNsYXJhdGlvbjtcbmV4cG9ydCB0eXBlIEV4cG9ydERlY2xhcmF0aW9uID0gRXhwb3J0QWxsRGVjbGFyYXRpb24gfCBFeHBvcnREZWZhdWx0RGVjbGFyYXRpb24gfCBFeHBvcnROYW1lZERlY2xhcmF0aW9uO1xuZXhwb3J0IHR5cGUgRXhwcmVzc2lvbiA9IEFycmF5RXhwcmVzc2lvbiB8IEFycm93RnVuY3Rpb25FeHByZXNzaW9uIHwgQXNzaWdubWVudEV4cHJlc3Npb24gfCBBc3luY0Fycm93RnVuY3Rpb25FeHByZXNzaW9uIHwgQXN5bmNGdW5jdGlvbkV4cHJlc3Npb24gfFxuICAgIEF3YWl0RXhwcmVzc2lvbiB8IEJpbmFyeUV4cHJlc3Npb24gfCBDYWxsRXhwcmVzc2lvbiB8IENsYXNzRXhwcmVzc2lvbiB8IENvbXB1dGVkTWVtYmVyRXhwcmVzc2lvbiB8XG4gICAgQ29uZGl0aW9uYWxFeHByZXNzaW9uIHwgSWRlbnRpZmllciB8IEZ1bmN0aW9uRXhwcmVzc2lvbiB8IExpdGVyYWwgfCBOZXdFeHByZXNzaW9uIHwgT2JqZWN0RXhwcmVzc2lvbiB8XG4gICAgUmVnZXhMaXRlcmFsIHwgU2VxdWVuY2VFeHByZXNzaW9uIHwgU3RhdGljTWVtYmVyRXhwcmVzc2lvbiB8IFRhZ2dlZFRlbXBsYXRlRXhwcmVzc2lvbiB8XG4gICAgVGhpc0V4cHJlc3Npb24gfCBVbmFyeUV4cHJlc3Npb24gfCBVcGRhdGVFeHByZXNzaW9uIHwgWWllbGRFeHByZXNzaW9uO1xuZXhwb3J0IHR5cGUgRnVuY3Rpb25QYXJhbWV0ZXIgPSBBc3NpZ25tZW50UGF0dGVybiB8IEJpbmRpbmdJZGVudGlmaWVyIHwgQmluZGluZ1BhdHRlcm47XG5leHBvcnQgdHlwZSBJbXBvcnREZWNsYXJhdGlvblNwZWNpZmllciA9IEltcG9ydERlZmF1bHRTcGVjaWZpZXIgfCBJbXBvcnROYW1lc3BhY2VTcGVjaWZpZXIgfCBJbXBvcnRTcGVjaWZpZXI7XG5leHBvcnQgdHlwZSBPYmplY3RFeHByZXNzaW9uUHJvcGVydHkgPSBQcm9wZXJ0eSB8IFNwcmVhZEVsZW1lbnQ7XG5leHBvcnQgdHlwZSBPYmplY3RQYXR0ZXJuUHJvcGVydHkgPSBQcm9wZXJ0eSB8IFJlc3RFbGVtZW50O1xuZXhwb3J0IHR5cGUgU3RhdGVtZW50ID0gQXN5bmNGdW5jdGlvbkRlY2xhcmF0aW9uIHwgQnJlYWtTdGF0ZW1lbnQgfCBDb250aW51ZVN0YXRlbWVudCB8IERlYnVnZ2VyU3RhdGVtZW50IHwgRG9XaGlsZVN0YXRlbWVudCB8XG4gICAgRW1wdHlTdGF0ZW1lbnQgfCBFeHByZXNzaW9uU3RhdGVtZW50IHwgRGlyZWN0aXZlIHwgRm9yU3RhdGVtZW50IHwgRm9ySW5TdGF0ZW1lbnQgfCBGb3JPZlN0YXRlbWVudCB8XG4gICAgRnVuY3Rpb25EZWNsYXJhdGlvbiB8IElmU3RhdGVtZW50IHwgUmV0dXJuU3RhdGVtZW50IHwgU3dpdGNoU3RhdGVtZW50IHwgVGhyb3dTdGF0ZW1lbnQgfFxuICAgIFRyeVN0YXRlbWVudCB8IFZhcmlhYmxlRGVjbGFyYXRpb24gfCBXaGlsZVN0YXRlbWVudCB8IFdpdGhTdGF0ZW1lbnQ7XG5leHBvcnQgdHlwZSBQcm9wZXJ0eUtleSA9IElkZW50aWZpZXIgfCBMaXRlcmFsO1xuZXhwb3J0IHR5cGUgUHJvcGVydHlWYWx1ZSA9IEFzc2lnbm1lbnRQYXR0ZXJuIHwgQXN5bmNGdW5jdGlvbkV4cHJlc3Npb24gfCBCaW5kaW5nSWRlbnRpZmllciB8IEJpbmRpbmdQYXR0ZXJuIHwgRnVuY3Rpb25FeHByZXNzaW9uO1xuZXhwb3J0IHR5cGUgU3RhdGVtZW50TGlzdEl0ZW0gPSBEZWNsYXJhdGlvbiB8IFN0YXRlbWVudDtcblxuZXhwb3J0IGNsYXNzIEFycmF5RXhwcmVzc2lvbiB7XG4gICAgcmVhZG9ubHkgdHlwZTogc3RyaW5nO1xuICAgIHJlYWRvbmx5IGVsZW1lbnRzOiBBcnJheUV4cHJlc3Npb25FbGVtZW50W107XG4gICAgY29uc3RydWN0b3IoZWxlbWVudHM6IEFycmF5RXhwcmVzc2lvbkVsZW1lbnRbXSkge1xuICAgICAgICB0aGlzLnR5cGUgPSBTeW50YXguQXJyYXlFeHByZXNzaW9uO1xuICAgICAgICB0aGlzLmVsZW1lbnRzID0gZWxlbWVudHM7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgQXJyYXlQYXR0ZXJuIHtcbiAgICByZWFkb25seSB0eXBlOiBzdHJpbmc7XG4gICAgcmVhZG9ubHkgZWxlbWVudHM6IEFycmF5UGF0dGVybkVsZW1lbnRbXTtcbiAgICBjb25zdHJ1Y3RvcihlbGVtZW50czogQXJyYXlQYXR0ZXJuRWxlbWVudFtdKSB7XG4gICAgICAgIHRoaXMudHlwZSA9IFN5bnRheC5BcnJheVBhdHRlcm47XG4gICAgICAgIHRoaXMuZWxlbWVudHMgPSBlbGVtZW50cztcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBBcnJvd0Z1bmN0aW9uRXhwcmVzc2lvbiB7XG4gICAgcmVhZG9ubHkgdHlwZTogc3RyaW5nO1xuICAgIHJlYWRvbmx5IGlkOiBJZGVudGlmaWVyIHwgbnVsbDtcbiAgICByZWFkb25seSBwYXJhbXM6IEZ1bmN0aW9uUGFyYW1ldGVyW107XG4gICAgcmVhZG9ubHkgYm9keTogQmxvY2tTdGF0ZW1lbnQgfCBFeHByZXNzaW9uO1xuICAgIHJlYWRvbmx5IGdlbmVyYXRvcjogYm9vbGVhbjtcbiAgICByZWFkb25seSBleHByZXNzaW9uOiBib29sZWFuO1xuICAgIHJlYWRvbmx5IGFzeW5jOiBib29sZWFuO1xuICAgIGNvbnN0cnVjdG9yKHBhcmFtczogRnVuY3Rpb25QYXJhbWV0ZXJbXSwgYm9keTogQmxvY2tTdGF0ZW1lbnQgfCBFeHByZXNzaW9uLCBleHByZXNzaW9uOiBib29sZWFuKSB7XG4gICAgICAgIHRoaXMudHlwZSA9IFN5bnRheC5BcnJvd0Z1bmN0aW9uRXhwcmVzc2lvbjtcbiAgICAgICAgdGhpcy5pZCA9IG51bGw7XG4gICAgICAgIHRoaXMucGFyYW1zID0gcGFyYW1zO1xuICAgICAgICB0aGlzLmJvZHkgPSBib2R5O1xuICAgICAgICB0aGlzLmdlbmVyYXRvciA9IGZhbHNlO1xuICAgICAgICB0aGlzLmV4cHJlc3Npb24gPSBleHByZXNzaW9uO1xuICAgICAgICB0aGlzLmFzeW5jID0gZmFsc2U7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgQXNzaWdubWVudEV4cHJlc3Npb24ge1xuICAgIHJlYWRvbmx5IHR5cGU6IHN0cmluZztcbiAgICByZWFkb25seSBvcGVyYXRvcjogc3RyaW5nO1xuICAgIHJlYWRvbmx5IGxlZnQ6IEV4cHJlc3Npb247XG4gICAgcmVhZG9ubHkgcmlnaHQ6IEV4cHJlc3Npb247XG4gICAgY29uc3RydWN0b3Iob3BlcmF0b3I6IHN0cmluZywgbGVmdDogRXhwcmVzc2lvbiwgcmlnaHQ6IEV4cHJlc3Npb24pIHtcbiAgICAgICAgdGhpcy50eXBlID0gU3ludGF4LkFzc2lnbm1lbnRFeHByZXNzaW9uO1xuICAgICAgICB0aGlzLm9wZXJhdG9yID0gb3BlcmF0b3I7XG4gICAgICAgIHRoaXMubGVmdCA9IGxlZnQ7XG4gICAgICAgIHRoaXMucmlnaHQgPSByaWdodDtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBBc3NpZ25tZW50UGF0dGVybiB7XG4gICAgcmVhZG9ubHkgdHlwZTogc3RyaW5nO1xuICAgIHJlYWRvbmx5IGxlZnQ6IEJpbmRpbmdJZGVudGlmaWVyIHwgQmluZGluZ1BhdHRlcm47XG4gICAgcmVhZG9ubHkgcmlnaHQ6IEV4cHJlc3Npb247XG4gICAgY29uc3RydWN0b3IobGVmdDogQmluZGluZ0lkZW50aWZpZXIgfCBCaW5kaW5nUGF0dGVybiwgcmlnaHQ6IEV4cHJlc3Npb24pIHtcbiAgICAgICAgdGhpcy50eXBlID0gU3ludGF4LkFzc2lnbm1lbnRQYXR0ZXJuO1xuICAgICAgICB0aGlzLmxlZnQgPSBsZWZ0O1xuICAgICAgICB0aGlzLnJpZ2h0ID0gcmlnaHQ7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgQXN5bmNBcnJvd0Z1bmN0aW9uRXhwcmVzc2lvbiB7XG4gICAgcmVhZG9ubHkgdHlwZTogc3RyaW5nO1xuICAgIHJlYWRvbmx5IGlkOiBJZGVudGlmaWVyIHwgbnVsbDtcbiAgICByZWFkb25seSBwYXJhbXM6IEZ1bmN0aW9uUGFyYW1ldGVyW107XG4gICAgcmVhZG9ubHkgYm9keTogQmxvY2tTdGF0ZW1lbnQgfCBFeHByZXNzaW9uO1xuICAgIHJlYWRvbmx5IGdlbmVyYXRvcjogYm9vbGVhbjtcbiAgICByZWFkb25seSBleHByZXNzaW9uOiBib29sZWFuO1xuICAgIHJlYWRvbmx5IGFzeW5jOiBib29sZWFuO1xuICAgIGNvbnN0cnVjdG9yKHBhcmFtczogRnVuY3Rpb25QYXJhbWV0ZXJbXSwgYm9keTogQmxvY2tTdGF0ZW1lbnQgfCBFeHByZXNzaW9uLCBleHByZXNzaW9uOiBib29sZWFuKSB7XG4gICAgICAgIHRoaXMudHlwZSA9IFN5bnRheC5BcnJvd0Z1bmN0aW9uRXhwcmVzc2lvbjtcbiAgICAgICAgdGhpcy5pZCA9IG51bGw7XG4gICAgICAgIHRoaXMucGFyYW1zID0gcGFyYW1zO1xuICAgICAgICB0aGlzLmJvZHkgPSBib2R5O1xuICAgICAgICB0aGlzLmdlbmVyYXRvciA9IGZhbHNlO1xuICAgICAgICB0aGlzLmV4cHJlc3Npb24gPSBleHByZXNzaW9uO1xuICAgICAgICB0aGlzLmFzeW5jID0gdHJ1ZTtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBBc3luY0Z1bmN0aW9uRGVjbGFyYXRpb24ge1xuICAgIHJlYWRvbmx5IHR5cGU6IHN0cmluZztcbiAgICByZWFkb25seSBpZDogSWRlbnRpZmllciB8IG51bGw7XG4gICAgcmVhZG9ubHkgcGFyYW1zOiBGdW5jdGlvblBhcmFtZXRlcltdO1xuICAgIHJlYWRvbmx5IGJvZHk6IEJsb2NrU3RhdGVtZW50O1xuICAgIHJlYWRvbmx5IGdlbmVyYXRvcjogYm9vbGVhbjtcbiAgICByZWFkb25seSBleHByZXNzaW9uOiBib29sZWFuO1xuICAgIHJlYWRvbmx5IGFzeW5jOiBib29sZWFuO1xuICAgIGNvbnN0cnVjdG9yKGlkOiBJZGVudGlmaWVyIHwgbnVsbCwgcGFyYW1zOiBGdW5jdGlvblBhcmFtZXRlcltdLCBib2R5OiBCbG9ja1N0YXRlbWVudCkge1xuICAgICAgICB0aGlzLnR5cGUgPSBTeW50YXguRnVuY3Rpb25EZWNsYXJhdGlvbjtcbiAgICAgICAgdGhpcy5pZCA9IGlkO1xuICAgICAgICB0aGlzLnBhcmFtcyA9IHBhcmFtcztcbiAgICAgICAgdGhpcy5ib2R5ID0gYm9keTtcbiAgICAgICAgdGhpcy5nZW5lcmF0b3IgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5leHByZXNzaW9uID0gZmFsc2U7XG4gICAgICAgIHRoaXMuYXN5bmMgPSB0cnVlO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIEFzeW5jRnVuY3Rpb25FeHByZXNzaW9uIHtcbiAgICByZWFkb25seSB0eXBlOiBzdHJpbmc7XG4gICAgcmVhZG9ubHkgaWQ6IElkZW50aWZpZXIgfCBudWxsO1xuICAgIHJlYWRvbmx5IHBhcmFtczogRnVuY3Rpb25QYXJhbWV0ZXJbXTtcbiAgICByZWFkb25seSBib2R5OiBCbG9ja1N0YXRlbWVudDtcbiAgICByZWFkb25seSBnZW5lcmF0b3I6IGJvb2xlYW47XG4gICAgcmVhZG9ubHkgZXhwcmVzc2lvbjogYm9vbGVhbjtcbiAgICByZWFkb25seSBhc3luYzogYm9vbGVhbjtcbiAgICBjb25zdHJ1Y3RvcihpZDogSWRlbnRpZmllciB8IG51bGwsIHBhcmFtczogRnVuY3Rpb25QYXJhbWV0ZXJbXSwgYm9keTogQmxvY2tTdGF0ZW1lbnQpIHtcbiAgICAgICAgdGhpcy50eXBlID0gU3ludGF4LkZ1bmN0aW9uRXhwcmVzc2lvbjtcbiAgICAgICAgdGhpcy5pZCA9IGlkO1xuICAgICAgICB0aGlzLnBhcmFtcyA9IHBhcmFtcztcbiAgICAgICAgdGhpcy5ib2R5ID0gYm9keTtcbiAgICAgICAgdGhpcy5nZW5lcmF0b3IgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5leHByZXNzaW9uID0gZmFsc2U7XG4gICAgICAgIHRoaXMuYXN5bmMgPSB0cnVlO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIEF3YWl0RXhwcmVzc2lvbiB7XG4gICAgcmVhZG9ubHkgdHlwZTogc3RyaW5nO1xuICAgIHJlYWRvbmx5IGFyZ3VtZW50OiBFeHByZXNzaW9uO1xuICAgIGNvbnN0cnVjdG9yKGFyZ3VtZW50OiBFeHByZXNzaW9uKSB7XG4gICAgICAgIHRoaXMudHlwZSA9IFN5bnRheC5Bd2FpdEV4cHJlc3Npb247XG4gICAgICAgIHRoaXMuYXJndW1lbnQgPSBhcmd1bWVudDtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBCaW5hcnlFeHByZXNzaW9uIHtcbiAgICByZWFkb25seSB0eXBlOiBzdHJpbmc7XG4gICAgcmVhZG9ubHkgb3BlcmF0b3I6IHN0cmluZztcbiAgICByZWFkb25seSBsZWZ0OiBFeHByZXNzaW9uO1xuICAgIHJlYWRvbmx5IHJpZ2h0OiBFeHByZXNzaW9uO1xuICAgIGNvbnN0cnVjdG9yKG9wZXJhdG9yOiBzdHJpbmcsIGxlZnQ6IEV4cHJlc3Npb24sIHJpZ2h0OiBFeHByZXNzaW9uKSB7XG4gICAgICAgIGNvbnN0IGxvZ2ljYWwgPSAob3BlcmF0b3IgPT09ICd8fCcgfHwgb3BlcmF0b3IgPT09ICcmJicpO1xuICAgICAgICB0aGlzLnR5cGUgPSBsb2dpY2FsID8gU3ludGF4LkxvZ2ljYWxFeHByZXNzaW9uIDogU3ludGF4LkJpbmFyeUV4cHJlc3Npb247XG4gICAgICAgIHRoaXMub3BlcmF0b3IgPSBvcGVyYXRvcjtcbiAgICAgICAgdGhpcy5sZWZ0ID0gbGVmdDtcbiAgICAgICAgdGhpcy5yaWdodCA9IHJpZ2h0O1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIEJsb2NrU3RhdGVtZW50IHtcbiAgICByZWFkb25seSB0eXBlOiBzdHJpbmc7XG4gICAgcmVhZG9ubHkgYm9keTogU3RhdGVtZW50W107XG4gICAgY29uc3RydWN0b3IoYm9keSkge1xuICAgICAgICB0aGlzLnR5cGUgPSBTeW50YXguQmxvY2tTdGF0ZW1lbnQ7XG4gICAgICAgIHRoaXMuYm9keSA9IGJvZHk7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgQnJlYWtTdGF0ZW1lbnQge1xuICAgIHJlYWRvbmx5IHR5cGU6IHN0cmluZztcbiAgICByZWFkb25seSBsYWJlbDogSWRlbnRpZmllciB8IG51bGw7XG4gICAgY29uc3RydWN0b3IobGFiZWw6IElkZW50aWZpZXIgfCBudWxsKSB7XG4gICAgICAgIHRoaXMudHlwZSA9IFN5bnRheC5CcmVha1N0YXRlbWVudDtcbiAgICAgICAgdGhpcy5sYWJlbCA9IGxhYmVsO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIENhbGxFeHByZXNzaW9uIHtcbiAgICByZWFkb25seSB0eXBlOiBzdHJpbmc7XG4gICAgcmVhZG9ubHkgY2FsbGVlOiBFeHByZXNzaW9uIHwgSW1wb3J0O1xuICAgIHJlYWRvbmx5IGFyZ3VtZW50czogQXJndW1lbnRMaXN0RWxlbWVudFtdO1xuICAgIGNvbnN0cnVjdG9yKGNhbGxlZTogRXhwcmVzc2lvbiB8IEltcG9ydCwgYXJnczogQXJndW1lbnRMaXN0RWxlbWVudFtdKSB7XG4gICAgICAgIHRoaXMudHlwZSA9IFN5bnRheC5DYWxsRXhwcmVzc2lvbjtcbiAgICAgICAgdGhpcy5jYWxsZWUgPSBjYWxsZWU7XG4gICAgICAgIHRoaXMuYXJndW1lbnRzID0gYXJncztcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBDYXRjaENsYXVzZSB7XG4gICAgcmVhZG9ubHkgdHlwZTogc3RyaW5nO1xuICAgIHJlYWRvbmx5IHBhcmFtOiBCaW5kaW5nSWRlbnRpZmllciB8IEJpbmRpbmdQYXR0ZXJuO1xuICAgIHJlYWRvbmx5IGJvZHk6IEJsb2NrU3RhdGVtZW50O1xuICAgIGNvbnN0cnVjdG9yKHBhcmFtOiBCaW5kaW5nSWRlbnRpZmllciB8IEJpbmRpbmdQYXR0ZXJuLCBib2R5OiBCbG9ja1N0YXRlbWVudCkge1xuICAgICAgICB0aGlzLnR5cGUgPSBTeW50YXguQ2F0Y2hDbGF1c2U7XG4gICAgICAgIHRoaXMucGFyYW0gPSBwYXJhbTtcbiAgICAgICAgdGhpcy5ib2R5ID0gYm9keTtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBDbGFzc0JvZHkge1xuICAgIHJlYWRvbmx5IHR5cGU6IHN0cmluZztcbiAgICByZWFkb25seSBib2R5OiBQcm9wZXJ0eVtdO1xuICAgIGNvbnN0cnVjdG9yKGJvZHk6IFByb3BlcnR5W10pIHtcbiAgICAgICAgdGhpcy50eXBlID0gU3ludGF4LkNsYXNzQm9keTtcbiAgICAgICAgdGhpcy5ib2R5ID0gYm9keTtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBDbGFzc0RlY2xhcmF0aW9uIHtcbiAgICByZWFkb25seSB0eXBlOiBzdHJpbmc7XG4gICAgcmVhZG9ubHkgaWQ6IElkZW50aWZpZXIgfCBudWxsO1xuICAgIHJlYWRvbmx5IHN1cGVyQ2xhc3M6IElkZW50aWZpZXIgfCBudWxsO1xuICAgIHJlYWRvbmx5IGJvZHk6IENsYXNzQm9keTtcbiAgICBjb25zdHJ1Y3RvcihpZDogSWRlbnRpZmllciB8IG51bGwsIHN1cGVyQ2xhc3M6IElkZW50aWZpZXIgfCBudWxsLCBib2R5OiBDbGFzc0JvZHkpIHtcbiAgICAgICAgdGhpcy50eXBlID0gU3ludGF4LkNsYXNzRGVjbGFyYXRpb247XG4gICAgICAgIHRoaXMuaWQgPSBpZDtcbiAgICAgICAgdGhpcy5zdXBlckNsYXNzID0gc3VwZXJDbGFzcztcbiAgICAgICAgdGhpcy5ib2R5ID0gYm9keTtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBDbGFzc0V4cHJlc3Npb24ge1xuICAgIHJlYWRvbmx5IHR5cGU6IHN0cmluZztcbiAgICByZWFkb25seSBpZDogSWRlbnRpZmllciB8IG51bGw7XG4gICAgcmVhZG9ubHkgc3VwZXJDbGFzczogSWRlbnRpZmllciB8IG51bGw7XG4gICAgcmVhZG9ubHkgYm9keTogQ2xhc3NCb2R5O1xuICAgIGNvbnN0cnVjdG9yKGlkOiBJZGVudGlmaWVyIHwgbnVsbCwgc3VwZXJDbGFzczogSWRlbnRpZmllciB8IG51bGwsIGJvZHk6IENsYXNzQm9keSkge1xuICAgICAgICB0aGlzLnR5cGUgPSBTeW50YXguQ2xhc3NFeHByZXNzaW9uO1xuICAgICAgICB0aGlzLmlkID0gaWQ7XG4gICAgICAgIHRoaXMuc3VwZXJDbGFzcyA9IHN1cGVyQ2xhc3M7XG4gICAgICAgIHRoaXMuYm9keSA9IGJvZHk7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgQ29tcHV0ZWRNZW1iZXJFeHByZXNzaW9uIHtcbiAgICByZWFkb25seSB0eXBlOiBzdHJpbmc7XG4gICAgcmVhZG9ubHkgY29tcHV0ZWQ6IGJvb2xlYW47XG4gICAgcmVhZG9ubHkgb2JqZWN0OiBFeHByZXNzaW9uO1xuICAgIHJlYWRvbmx5IHByb3BlcnR5OiBFeHByZXNzaW9uO1xuICAgIGNvbnN0cnVjdG9yKG9iamVjdDogRXhwcmVzc2lvbiwgcHJvcGVydHk6IEV4cHJlc3Npb24pIHtcbiAgICAgICAgdGhpcy50eXBlID0gU3ludGF4Lk1lbWJlckV4cHJlc3Npb247XG4gICAgICAgIHRoaXMuY29tcHV0ZWQgPSB0cnVlO1xuICAgICAgICB0aGlzLm9iamVjdCA9IG9iamVjdDtcbiAgICAgICAgdGhpcy5wcm9wZXJ0eSA9IHByb3BlcnR5O1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIENvbmRpdGlvbmFsRXhwcmVzc2lvbiB7XG4gICAgcmVhZG9ubHkgdHlwZTogc3RyaW5nO1xuICAgIHJlYWRvbmx5IHRlc3Q6IEV4cHJlc3Npb247XG4gICAgcmVhZG9ubHkgY29uc2VxdWVudDogRXhwcmVzc2lvbjtcbiAgICByZWFkb25seSBhbHRlcm5hdGU6IEV4cHJlc3Npb247XG4gICAgY29uc3RydWN0b3IodGVzdDogRXhwcmVzc2lvbiwgY29uc2VxdWVudDogRXhwcmVzc2lvbiwgYWx0ZXJuYXRlOiBFeHByZXNzaW9uKSB7XG4gICAgICAgIHRoaXMudHlwZSA9IFN5bnRheC5Db25kaXRpb25hbEV4cHJlc3Npb247XG4gICAgICAgIHRoaXMudGVzdCA9IHRlc3Q7XG4gICAgICAgIHRoaXMuY29uc2VxdWVudCA9IGNvbnNlcXVlbnQ7XG4gICAgICAgIHRoaXMuYWx0ZXJuYXRlID0gYWx0ZXJuYXRlO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIENvbnRpbnVlU3RhdGVtZW50IHtcbiAgICByZWFkb25seSB0eXBlOiBzdHJpbmc7XG4gICAgcmVhZG9ubHkgbGFiZWw6IElkZW50aWZpZXIgfCBudWxsO1xuICAgIGNvbnN0cnVjdG9yKGxhYmVsOiBJZGVudGlmaWVyIHwgbnVsbCkge1xuICAgICAgICB0aGlzLnR5cGUgPSBTeW50YXguQ29udGludWVTdGF0ZW1lbnQ7XG4gICAgICAgIHRoaXMubGFiZWwgPSBsYWJlbDtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBEZWJ1Z2dlclN0YXRlbWVudCB7XG4gICAgcmVhZG9ubHkgdHlwZTogc3RyaW5nO1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLnR5cGUgPSBTeW50YXguRGVidWdnZXJTdGF0ZW1lbnQ7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgRGlyZWN0aXZlIHtcbiAgICByZWFkb25seSB0eXBlOiBzdHJpbmc7XG4gICAgcmVhZG9ubHkgZXhwcmVzc2lvbjogRXhwcmVzc2lvbjtcbiAgICByZWFkb25seSBkaXJlY3RpdmU6IHN0cmluZztcbiAgICBjb25zdHJ1Y3RvcihleHByZXNzaW9uOiBFeHByZXNzaW9uLCBkaXJlY3RpdmU6IHN0cmluZykge1xuICAgICAgICB0aGlzLnR5cGUgPSBTeW50YXguRXhwcmVzc2lvblN0YXRlbWVudDtcbiAgICAgICAgdGhpcy5leHByZXNzaW9uID0gZXhwcmVzc2lvbjtcbiAgICAgICAgdGhpcy5kaXJlY3RpdmUgPSBkaXJlY3RpdmU7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgRG9XaGlsZVN0YXRlbWVudCB7XG4gICAgcmVhZG9ubHkgdHlwZTogc3RyaW5nO1xuICAgIHJlYWRvbmx5IGJvZHk6IFN0YXRlbWVudDtcbiAgICByZWFkb25seSB0ZXN0OiBFeHByZXNzaW9uO1xuICAgIGNvbnN0cnVjdG9yKGJvZHk6IFN0YXRlbWVudCwgdGVzdDogRXhwcmVzc2lvbikge1xuICAgICAgICB0aGlzLnR5cGUgPSBTeW50YXguRG9XaGlsZVN0YXRlbWVudDtcbiAgICAgICAgdGhpcy5ib2R5ID0gYm9keTtcbiAgICAgICAgdGhpcy50ZXN0ID0gdGVzdDtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBFbXB0eVN0YXRlbWVudCB7XG4gICAgcmVhZG9ubHkgdHlwZTogc3RyaW5nO1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLnR5cGUgPSBTeW50YXguRW1wdHlTdGF0ZW1lbnQ7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgRXhwb3J0QWxsRGVjbGFyYXRpb24ge1xuICAgIHJlYWRvbmx5IHR5cGU6IHN0cmluZztcbiAgICByZWFkb25seSBzb3VyY2U6IExpdGVyYWw7XG4gICAgY29uc3RydWN0b3Ioc291cmNlOiBMaXRlcmFsKSB7XG4gICAgICAgIHRoaXMudHlwZSA9IFN5bnRheC5FeHBvcnRBbGxEZWNsYXJhdGlvbjtcbiAgICAgICAgdGhpcy5zb3VyY2UgPSBzb3VyY2U7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgRXhwb3J0RGVmYXVsdERlY2xhcmF0aW9uIHtcbiAgICByZWFkb25seSB0eXBlOiBzdHJpbmc7XG4gICAgcmVhZG9ubHkgZGVjbGFyYXRpb246IEV4cG9ydGFibGVEZWZhdWx0RGVjbGFyYXRpb247XG4gICAgY29uc3RydWN0b3IoZGVjbGFyYXRpb246IEV4cG9ydGFibGVEZWZhdWx0RGVjbGFyYXRpb24pIHtcbiAgICAgICAgdGhpcy50eXBlID0gU3ludGF4LkV4cG9ydERlZmF1bHREZWNsYXJhdGlvbjtcbiAgICAgICAgdGhpcy5kZWNsYXJhdGlvbiA9IGRlY2xhcmF0aW9uO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIEV4cG9ydE5hbWVkRGVjbGFyYXRpb24ge1xuICAgIHJlYWRvbmx5IHR5cGU6IHN0cmluZztcbiAgICByZWFkb25seSBkZWNsYXJhdGlvbjogRXhwb3J0YWJsZU5hbWVkRGVjbGFyYXRpb24gfCBudWxsO1xuICAgIHJlYWRvbmx5IHNwZWNpZmllcnM6IEV4cG9ydFNwZWNpZmllcltdO1xuICAgIHJlYWRvbmx5IHNvdXJjZTogTGl0ZXJhbCB8IG51bGw7XG4gICAgY29uc3RydWN0b3IoZGVjbGFyYXRpb246IEV4cG9ydGFibGVOYW1lZERlY2xhcmF0aW9uIHwgbnVsbCwgc3BlY2lmaWVyczogRXhwb3J0U3BlY2lmaWVyW10sIHNvdXJjZTogTGl0ZXJhbCB8IG51bGwpIHtcbiAgICAgICAgdGhpcy50eXBlID0gU3ludGF4LkV4cG9ydE5hbWVkRGVjbGFyYXRpb247XG4gICAgICAgIHRoaXMuZGVjbGFyYXRpb24gPSBkZWNsYXJhdGlvbjtcbiAgICAgICAgdGhpcy5zcGVjaWZpZXJzID0gc3BlY2lmaWVycztcbiAgICAgICAgdGhpcy5zb3VyY2UgPSBzb3VyY2U7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgRXhwb3J0U3BlY2lmaWVyIHtcbiAgICByZWFkb25seSB0eXBlOiBzdHJpbmc7XG4gICAgcmVhZG9ubHkgZXhwb3J0ZWQ6IElkZW50aWZpZXI7XG4gICAgcmVhZG9ubHkgbG9jYWw6IElkZW50aWZpZXI7XG4gICAgY29uc3RydWN0b3IobG9jYWw6IElkZW50aWZpZXIsIGV4cG9ydGVkOiBJZGVudGlmaWVyKSB7XG4gICAgICAgIHRoaXMudHlwZSA9IFN5bnRheC5FeHBvcnRTcGVjaWZpZXI7XG4gICAgICAgIHRoaXMuZXhwb3J0ZWQgPSBleHBvcnRlZDtcbiAgICAgICAgdGhpcy5sb2NhbCA9IGxvY2FsO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIEV4cHJlc3Npb25TdGF0ZW1lbnQge1xuICAgIHJlYWRvbmx5IHR5cGU6IHN0cmluZztcbiAgICByZWFkb25seSBleHByZXNzaW9uOiBFeHByZXNzaW9uO1xuICAgIGNvbnN0cnVjdG9yKGV4cHJlc3Npb246IEV4cHJlc3Npb24pIHtcbiAgICAgICAgdGhpcy50eXBlID0gU3ludGF4LkV4cHJlc3Npb25TdGF0ZW1lbnQ7XG4gICAgICAgIHRoaXMuZXhwcmVzc2lvbiA9IGV4cHJlc3Npb247XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgRm9ySW5TdGF0ZW1lbnQge1xuICAgIHJlYWRvbmx5IHR5cGU6IHN0cmluZztcbiAgICByZWFkb25seSBsZWZ0OiBFeHByZXNzaW9uO1xuICAgIHJlYWRvbmx5IHJpZ2h0OiBFeHByZXNzaW9uO1xuICAgIHJlYWRvbmx5IGJvZHk6IFN0YXRlbWVudDtcbiAgICByZWFkb25seSBlYWNoOiBib29sZWFuO1xuICAgIGNvbnN0cnVjdG9yKGxlZnQ6IEV4cHJlc3Npb24sIHJpZ2h0OiBFeHByZXNzaW9uLCBib2R5OiBTdGF0ZW1lbnQpIHtcbiAgICAgICAgdGhpcy50eXBlID0gU3ludGF4LkZvckluU3RhdGVtZW50O1xuICAgICAgICB0aGlzLmxlZnQgPSBsZWZ0O1xuICAgICAgICB0aGlzLnJpZ2h0ID0gcmlnaHQ7XG4gICAgICAgIHRoaXMuYm9keSA9IGJvZHk7XG4gICAgICAgIHRoaXMuZWFjaCA9IGZhbHNlO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIEZvck9mU3RhdGVtZW50IHtcbiAgICByZWFkb25seSB0eXBlOiBzdHJpbmc7XG4gICAgcmVhZG9ubHkgbGVmdDogRXhwcmVzc2lvbjtcbiAgICByZWFkb25seSByaWdodDogRXhwcmVzc2lvbjtcbiAgICByZWFkb25seSBib2R5OiBTdGF0ZW1lbnQ7XG4gICAgY29uc3RydWN0b3IobGVmdDogRXhwcmVzc2lvbiwgcmlnaHQ6IEV4cHJlc3Npb24sIGJvZHk6IFN0YXRlbWVudCkge1xuICAgICAgICB0aGlzLnR5cGUgPSBTeW50YXguRm9yT2ZTdGF0ZW1lbnQ7XG4gICAgICAgIHRoaXMubGVmdCA9IGxlZnQ7XG4gICAgICAgIHRoaXMucmlnaHQgPSByaWdodDtcbiAgICAgICAgdGhpcy5ib2R5ID0gYm9keTtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBGb3JTdGF0ZW1lbnQge1xuICAgIHJlYWRvbmx5IHR5cGU6IHN0cmluZztcbiAgICByZWFkb25seSBpbml0OiBFeHByZXNzaW9uIHwgbnVsbDtcbiAgICByZWFkb25seSB0ZXN0OiBFeHByZXNzaW9uIHwgbnVsbDtcbiAgICByZWFkb25seSB1cGRhdGU6IEV4cHJlc3Npb24gfCBudWxsO1xuICAgIGJvZHk6IFN0YXRlbWVudDtcbiAgICBjb25zdHJ1Y3Rvcihpbml0OiBFeHByZXNzaW9uIHwgbnVsbCwgdGVzdDogRXhwcmVzc2lvbiB8IG51bGwsIHVwZGF0ZTogRXhwcmVzc2lvbiB8IG51bGwsIGJvZHk6IFN0YXRlbWVudCkge1xuICAgICAgICB0aGlzLnR5cGUgPSBTeW50YXguRm9yU3RhdGVtZW50O1xuICAgICAgICB0aGlzLmluaXQgPSBpbml0O1xuICAgICAgICB0aGlzLnRlc3QgPSB0ZXN0O1xuICAgICAgICB0aGlzLnVwZGF0ZSA9IHVwZGF0ZTtcbiAgICAgICAgdGhpcy5ib2R5ID0gYm9keTtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBGdW5jdGlvbkRlY2xhcmF0aW9uIHtcbiAgICByZWFkb25seSB0eXBlOiBzdHJpbmc7XG4gICAgcmVhZG9ubHkgaWQ6IElkZW50aWZpZXIgfCBudWxsO1xuICAgIHJlYWRvbmx5IHBhcmFtczogRnVuY3Rpb25QYXJhbWV0ZXJbXTtcbiAgICByZWFkb25seSBib2R5OiBCbG9ja1N0YXRlbWVudDtcbiAgICByZWFkb25seSBnZW5lcmF0b3I6IGJvb2xlYW47XG4gICAgcmVhZG9ubHkgZXhwcmVzc2lvbjogYm9vbGVhbjtcbiAgICByZWFkb25seSBhc3luYzogYm9vbGVhbjtcbiAgICBjb25zdHJ1Y3RvcihpZDogSWRlbnRpZmllciB8IG51bGwsIHBhcmFtczogRnVuY3Rpb25QYXJhbWV0ZXJbXSwgYm9keTogQmxvY2tTdGF0ZW1lbnQsIGdlbmVyYXRvcjogYm9vbGVhbikge1xuICAgICAgICB0aGlzLnR5cGUgPSBTeW50YXguRnVuY3Rpb25EZWNsYXJhdGlvbjtcbiAgICAgICAgdGhpcy5pZCA9IGlkO1xuICAgICAgICB0aGlzLnBhcmFtcyA9IHBhcmFtcztcbiAgICAgICAgdGhpcy5ib2R5ID0gYm9keTtcbiAgICAgICAgdGhpcy5nZW5lcmF0b3IgPSBnZW5lcmF0b3I7XG4gICAgICAgIHRoaXMuZXhwcmVzc2lvbiA9IGZhbHNlO1xuICAgICAgICB0aGlzLmFzeW5jID0gZmFsc2U7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgRnVuY3Rpb25FeHByZXNzaW9uIHtcbiAgICByZWFkb25seSB0eXBlOiBzdHJpbmc7XG4gICAgcmVhZG9ubHkgaWQ6IElkZW50aWZpZXIgfCBudWxsO1xuICAgIHJlYWRvbmx5IHBhcmFtczogRnVuY3Rpb25QYXJhbWV0ZXJbXTtcbiAgICByZWFkb25seSBib2R5OiBCbG9ja1N0YXRlbWVudDtcbiAgICByZWFkb25seSBnZW5lcmF0b3I6IGJvb2xlYW47XG4gICAgcmVhZG9ubHkgZXhwcmVzc2lvbjogYm9vbGVhbjtcbiAgICByZWFkb25seSBhc3luYzogYm9vbGVhbjtcbiAgICBjb25zdHJ1Y3RvcihpZDogSWRlbnRpZmllciB8IG51bGwsIHBhcmFtczogRnVuY3Rpb25QYXJhbWV0ZXJbXSwgYm9keTogQmxvY2tTdGF0ZW1lbnQsIGdlbmVyYXRvcjogYm9vbGVhbikge1xuICAgICAgICB0aGlzLnR5cGUgPSBTeW50YXguRnVuY3Rpb25FeHByZXNzaW9uO1xuICAgICAgICB0aGlzLmlkID0gaWQ7XG4gICAgICAgIHRoaXMucGFyYW1zID0gcGFyYW1zO1xuICAgICAgICB0aGlzLmJvZHkgPSBib2R5O1xuICAgICAgICB0aGlzLmdlbmVyYXRvciA9IGdlbmVyYXRvcjtcbiAgICAgICAgdGhpcy5leHByZXNzaW9uID0gZmFsc2U7XG4gICAgICAgIHRoaXMuYXN5bmMgPSBmYWxzZTtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBJZGVudGlmaWVyIHtcbiAgICByZWFkb25seSB0eXBlOiBzdHJpbmc7XG4gICAgcmVhZG9ubHkgbmFtZTogc3RyaW5nO1xuICAgIGNvbnN0cnVjdG9yKG5hbWUpIHtcbiAgICAgICAgdGhpcy50eXBlID0gU3ludGF4LklkZW50aWZpZXI7XG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgSWZTdGF0ZW1lbnQge1xuICAgIHJlYWRvbmx5IHR5cGU6IHN0cmluZztcbiAgICByZWFkb25seSB0ZXN0OiBFeHByZXNzaW9uO1xuICAgIHJlYWRvbmx5IGNvbnNlcXVlbnQ6IFN0YXRlbWVudDtcbiAgICByZWFkb25seSBhbHRlcm5hdGU6IFN0YXRlbWVudCB8IG51bGw7XG4gICAgY29uc3RydWN0b3IodGVzdDogRXhwcmVzc2lvbiwgY29uc2VxdWVudDogU3RhdGVtZW50LCBhbHRlcm5hdGU6IFN0YXRlbWVudCB8IG51bGwpIHtcbiAgICAgICAgdGhpcy50eXBlID0gU3ludGF4LklmU3RhdGVtZW50O1xuICAgICAgICB0aGlzLnRlc3QgPSB0ZXN0O1xuICAgICAgICB0aGlzLmNvbnNlcXVlbnQgPSBjb25zZXF1ZW50O1xuICAgICAgICB0aGlzLmFsdGVybmF0ZSA9IGFsdGVybmF0ZTtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBJbXBvcnQge1xuICAgIHJlYWRvbmx5IHR5cGU6IHN0cmluZztcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy50eXBlID0gU3ludGF4LkltcG9ydDtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBJbXBvcnREZWNsYXJhdGlvbiB7XG4gICAgcmVhZG9ubHkgdHlwZTogc3RyaW5nO1xuICAgIHJlYWRvbmx5IHNwZWNpZmllcnM6IEltcG9ydERlY2xhcmF0aW9uU3BlY2lmaWVyW107XG4gICAgcmVhZG9ubHkgc291cmNlOiBMaXRlcmFsO1xuICAgIGNvbnN0cnVjdG9yKHNwZWNpZmllcnMsIHNvdXJjZSkge1xuICAgICAgICB0aGlzLnR5cGUgPSBTeW50YXguSW1wb3J0RGVjbGFyYXRpb247XG4gICAgICAgIHRoaXMuc3BlY2lmaWVycyA9IHNwZWNpZmllcnM7XG4gICAgICAgIHRoaXMuc291cmNlID0gc291cmNlO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIEltcG9ydERlZmF1bHRTcGVjaWZpZXIge1xuICAgIHJlYWRvbmx5IHR5cGU6IHN0cmluZztcbiAgICByZWFkb25seSBsb2NhbDogSWRlbnRpZmllcjtcbiAgICBjb25zdHJ1Y3Rvcihsb2NhbDogSWRlbnRpZmllcikge1xuICAgICAgICB0aGlzLnR5cGUgPSBTeW50YXguSW1wb3J0RGVmYXVsdFNwZWNpZmllcjtcbiAgICAgICAgdGhpcy5sb2NhbCA9IGxvY2FsO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIEltcG9ydE5hbWVzcGFjZVNwZWNpZmllciB7XG4gICAgcmVhZG9ubHkgdHlwZTogc3RyaW5nO1xuICAgIHJlYWRvbmx5IGxvY2FsOiBJZGVudGlmaWVyO1xuICAgIGNvbnN0cnVjdG9yKGxvY2FsOiBJZGVudGlmaWVyKSB7XG4gICAgICAgIHRoaXMudHlwZSA9IFN5bnRheC5JbXBvcnROYW1lc3BhY2VTcGVjaWZpZXI7XG4gICAgICAgIHRoaXMubG9jYWwgPSBsb2NhbDtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBJbXBvcnRTcGVjaWZpZXIge1xuICAgIHJlYWRvbmx5IHR5cGU6IHN0cmluZztcbiAgICByZWFkb25seSBsb2NhbDogSWRlbnRpZmllcjtcbiAgICByZWFkb25seSBpbXBvcnRlZDogSWRlbnRpZmllcjtcbiAgICBjb25zdHJ1Y3Rvcihsb2NhbDogSWRlbnRpZmllciwgaW1wb3J0ZWQ6IElkZW50aWZpZXIpIHtcbiAgICAgICAgdGhpcy50eXBlID0gU3ludGF4LkltcG9ydFNwZWNpZmllcjtcbiAgICAgICAgdGhpcy5sb2NhbCA9IGxvY2FsO1xuICAgICAgICB0aGlzLmltcG9ydGVkID0gaW1wb3J0ZWQ7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgTGFiZWxlZFN0YXRlbWVudCB7XG4gICAgcmVhZG9ubHkgdHlwZTogc3RyaW5nO1xuICAgIHJlYWRvbmx5IGxhYmVsOiBJZGVudGlmaWVyO1xuICAgIHJlYWRvbmx5IGJvZHk6IFN0YXRlbWVudDtcbiAgICBjb25zdHJ1Y3RvcihsYWJlbDogSWRlbnRpZmllciwgYm9keTogU3RhdGVtZW50KSB7XG4gICAgICAgIHRoaXMudHlwZSA9IFN5bnRheC5MYWJlbGVkU3RhdGVtZW50O1xuICAgICAgICB0aGlzLmxhYmVsID0gbGFiZWw7XG4gICAgICAgIHRoaXMuYm9keSA9IGJvZHk7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgTGl0ZXJhbCB7XG4gICAgcmVhZG9ubHkgdHlwZTogc3RyaW5nO1xuICAgIHJlYWRvbmx5IHZhbHVlOiBib29sZWFuIHwgbnVtYmVyIHwgc3RyaW5nIHwgbnVsbDtcbiAgICByZWFkb25seSByYXc6IHN0cmluZztcbiAgICBjb25zdHJ1Y3Rvcih2YWx1ZTogYm9vbGVhbiB8IG51bWJlciB8IHN0cmluZyB8IG51bGwsIHJhdzogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMudHlwZSA9IFN5bnRheC5MaXRlcmFsO1xuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIHRoaXMucmF3ID0gcmF3O1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIE1ldGFQcm9wZXJ0eSB7XG4gICAgcmVhZG9ubHkgdHlwZTogc3RyaW5nO1xuICAgIHJlYWRvbmx5IG1ldGE6IElkZW50aWZpZXI7XG4gICAgcmVhZG9ubHkgcHJvcGVydHk6IElkZW50aWZpZXI7XG4gICAgY29uc3RydWN0b3IobWV0YTogSWRlbnRpZmllciwgcHJvcGVydHk6IElkZW50aWZpZXIpIHtcbiAgICAgICAgdGhpcy50eXBlID0gU3ludGF4Lk1ldGFQcm9wZXJ0eTtcbiAgICAgICAgdGhpcy5tZXRhID0gbWV0YTtcbiAgICAgICAgdGhpcy5wcm9wZXJ0eSA9IHByb3BlcnR5O1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIE1ldGhvZERlZmluaXRpb24ge1xuICAgIHJlYWRvbmx5IHR5cGU6IHN0cmluZztcbiAgICByZWFkb25seSBrZXk6IEV4cHJlc3Npb24gfCBudWxsO1xuICAgIHJlYWRvbmx5IGNvbXB1dGVkOiBib29sZWFuO1xuICAgIHJlYWRvbmx5IHZhbHVlOiBBc3luY0Z1bmN0aW9uRXhwcmVzc2lvbiB8IEZ1bmN0aW9uRXhwcmVzc2lvbiB8IG51bGw7XG4gICAgcmVhZG9ubHkga2luZDogc3RyaW5nO1xuICAgIHJlYWRvbmx5IHN0YXRpYzogYm9vbGVhbjtcbiAgICBjb25zdHJ1Y3RvcihrZXk6IEV4cHJlc3Npb24gfCBudWxsLCBjb21wdXRlZDogYm9vbGVhbiwgdmFsdWU6IEFzeW5jRnVuY3Rpb25FeHByZXNzaW9uIHwgRnVuY3Rpb25FeHByZXNzaW9uIHwgbnVsbCwga2luZDogc3RyaW5nLCBpc1N0YXRpYzogYm9vbGVhbikge1xuICAgICAgICB0aGlzLnR5cGUgPSBTeW50YXguTWV0aG9kRGVmaW5pdGlvbjtcbiAgICAgICAgdGhpcy5rZXkgPSBrZXk7XG4gICAgICAgIHRoaXMuY29tcHV0ZWQgPSBjb21wdXRlZDtcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB0aGlzLmtpbmQgPSBraW5kO1xuICAgICAgICB0aGlzLnN0YXRpYyA9IGlzU3RhdGljO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIE1vZHVsZSB7XG4gICAgcmVhZG9ubHkgdHlwZTogc3RyaW5nO1xuICAgIHJlYWRvbmx5IGJvZHk6IFN0YXRlbWVudExpc3RJdGVtW107XG4gICAgcmVhZG9ubHkgc291cmNlVHlwZTogc3RyaW5nO1xuICAgIGNvbnN0cnVjdG9yKGJvZHk6IFN0YXRlbWVudExpc3RJdGVtW10pIHtcbiAgICAgICAgdGhpcy50eXBlID0gU3ludGF4LlByb2dyYW07XG4gICAgICAgIHRoaXMuYm9keSA9IGJvZHk7XG4gICAgICAgIHRoaXMuc291cmNlVHlwZSA9ICdtb2R1bGUnO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIE5ld0V4cHJlc3Npb24ge1xuICAgIHJlYWRvbmx5IHR5cGU6IHN0cmluZztcbiAgICByZWFkb25seSBjYWxsZWU6IEV4cHJlc3Npb247XG4gICAgcmVhZG9ubHkgYXJndW1lbnRzOiBBcmd1bWVudExpc3RFbGVtZW50W107XG4gICAgY29uc3RydWN0b3IoY2FsbGVlOiBFeHByZXNzaW9uLCBhcmdzOiBBcmd1bWVudExpc3RFbGVtZW50W10pIHtcbiAgICAgICAgdGhpcy50eXBlID0gU3ludGF4Lk5ld0V4cHJlc3Npb247XG4gICAgICAgIHRoaXMuY2FsbGVlID0gY2FsbGVlO1xuICAgICAgICB0aGlzLmFyZ3VtZW50cyA9IGFyZ3M7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgT2JqZWN0RXhwcmVzc2lvbiB7XG4gICAgcmVhZG9ubHkgdHlwZTogc3RyaW5nO1xuICAgIHJlYWRvbmx5IHByb3BlcnRpZXM6IE9iamVjdEV4cHJlc3Npb25Qcm9wZXJ0eVtdO1xuICAgIGNvbnN0cnVjdG9yKHByb3BlcnRpZXM6IE9iamVjdEV4cHJlc3Npb25Qcm9wZXJ0eVtdKSB7XG4gICAgICAgIHRoaXMudHlwZSA9IFN5bnRheC5PYmplY3RFeHByZXNzaW9uO1xuICAgICAgICB0aGlzLnByb3BlcnRpZXMgPSBwcm9wZXJ0aWVzO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIE9iamVjdFBhdHRlcm4ge1xuICAgIHJlYWRvbmx5IHR5cGU6IHN0cmluZztcbiAgICByZWFkb25seSBwcm9wZXJ0aWVzOiBPYmplY3RQYXR0ZXJuUHJvcGVydHlbXTtcbiAgICBjb25zdHJ1Y3Rvcihwcm9wZXJ0aWVzOiBPYmplY3RQYXR0ZXJuUHJvcGVydHlbXSkge1xuICAgICAgICB0aGlzLnR5cGUgPSBTeW50YXguT2JqZWN0UGF0dGVybjtcbiAgICAgICAgdGhpcy5wcm9wZXJ0aWVzID0gcHJvcGVydGllcztcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBQcm9wZXJ0eSB7XG4gICAgcmVhZG9ubHkgdHlwZTogc3RyaW5nO1xuICAgIHJlYWRvbmx5IGtleTogUHJvcGVydHlLZXk7XG4gICAgcmVhZG9ubHkgY29tcHV0ZWQ6IGJvb2xlYW47XG4gICAgcmVhZG9ubHkgdmFsdWU6IFByb3BlcnR5VmFsdWUgfCBudWxsO1xuICAgIHJlYWRvbmx5IGtpbmQ6IHN0cmluZztcbiAgICByZWFkb25seSBtZXRob2Q6IGJvb2xlYW47XG4gICAgcmVhZG9ubHkgc2hvcnRoYW5kOiBib29sZWFuO1xuICAgIGNvbnN0cnVjdG9yKGtpbmQ6IHN0cmluZywga2V5OiBQcm9wZXJ0eUtleSwgY29tcHV0ZWQ6IGJvb2xlYW4sIHZhbHVlOiBQcm9wZXJ0eVZhbHVlIHwgbnVsbCwgbWV0aG9kOiBib29sZWFuLCBzaG9ydGhhbmQ6IGJvb2xlYW4pIHtcbiAgICAgICAgdGhpcy50eXBlID0gU3ludGF4LlByb3BlcnR5O1xuICAgICAgICB0aGlzLmtleSA9IGtleTtcbiAgICAgICAgdGhpcy5jb21wdXRlZCA9IGNvbXB1dGVkO1xuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIHRoaXMua2luZCA9IGtpbmQ7XG4gICAgICAgIHRoaXMubWV0aG9kID0gbWV0aG9kO1xuICAgICAgICB0aGlzLnNob3J0aGFuZCA9IHNob3J0aGFuZDtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBSZWdleExpdGVyYWwge1xuICAgIHJlYWRvbmx5IHR5cGU6IHN0cmluZztcbiAgICByZWFkb25seSB2YWx1ZTogUmVnRXhwO1xuICAgIHJlYWRvbmx5IHJhdzogc3RyaW5nO1xuICAgIHJlYWRvbmx5IHJlZ2V4OiB7IHBhdHRlcm46IHN0cmluZzsgZmxhZ3M6IHN0cmluZyB9O1xuICAgIGNvbnN0cnVjdG9yKHZhbHVlOiBSZWdFeHAsIHJhdzogc3RyaW5nLCBwYXR0ZXJuOiBzdHJpbmcsIGZsYWdzOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy50eXBlID0gU3ludGF4LkxpdGVyYWw7XG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5yYXcgPSByYXc7XG4gICAgICAgIHRoaXMucmVnZXggPSB7IHBhdHRlcm4sIGZsYWdzIH07XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgUmVzdEVsZW1lbnQge1xuICAgIHJlYWRvbmx5IHR5cGU6IHN0cmluZztcbiAgICByZWFkb25seSBhcmd1bWVudDogQmluZGluZ0lkZW50aWZpZXIgfCBCaW5kaW5nUGF0dGVybjtcbiAgICBjb25zdHJ1Y3Rvcihhcmd1bWVudDogQmluZGluZ0lkZW50aWZpZXIgfCBCaW5kaW5nUGF0dGVybikge1xuICAgICAgICB0aGlzLnR5cGUgPSBTeW50YXguUmVzdEVsZW1lbnQ7XG4gICAgICAgIHRoaXMuYXJndW1lbnQgPSBhcmd1bWVudDtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBSZXR1cm5TdGF0ZW1lbnQge1xuICAgIHJlYWRvbmx5IHR5cGU6IHN0cmluZztcbiAgICByZWFkb25seSBhcmd1bWVudDogRXhwcmVzc2lvbiB8IG51bGw7XG4gICAgY29uc3RydWN0b3IoYXJndW1lbnQ6IEV4cHJlc3Npb24gfCBudWxsKSB7XG4gICAgICAgIHRoaXMudHlwZSA9IFN5bnRheC5SZXR1cm5TdGF0ZW1lbnQ7XG4gICAgICAgIHRoaXMuYXJndW1lbnQgPSBhcmd1bWVudDtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBTY3JpcHQge1xuICAgIHJlYWRvbmx5IHR5cGU6IHN0cmluZztcbiAgICByZWFkb25seSBib2R5OiBTdGF0ZW1lbnRMaXN0SXRlbVtdO1xuICAgIHJlYWRvbmx5IHNvdXJjZVR5cGU6IHN0cmluZztcbiAgICBjb25zdHJ1Y3Rvcihib2R5OiBTdGF0ZW1lbnRMaXN0SXRlbVtdKSB7XG4gICAgICAgIHRoaXMudHlwZSA9IFN5bnRheC5Qcm9ncmFtO1xuICAgICAgICB0aGlzLmJvZHkgPSBib2R5O1xuICAgICAgICB0aGlzLnNvdXJjZVR5cGUgPSAnc2NyaXB0JztcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBTZXF1ZW5jZUV4cHJlc3Npb24ge1xuICAgIHJlYWRvbmx5IHR5cGU6IHN0cmluZztcbiAgICByZWFkb25seSBleHByZXNzaW9uczogRXhwcmVzc2lvbltdO1xuICAgIGNvbnN0cnVjdG9yKGV4cHJlc3Npb25zOiBFeHByZXNzaW9uW10pIHtcbiAgICAgICAgdGhpcy50eXBlID0gU3ludGF4LlNlcXVlbmNlRXhwcmVzc2lvbjtcbiAgICAgICAgdGhpcy5leHByZXNzaW9ucyA9IGV4cHJlc3Npb25zO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIFNwcmVhZEVsZW1lbnQge1xuICAgIHJlYWRvbmx5IHR5cGU6IHN0cmluZztcbiAgICByZWFkb25seSBhcmd1bWVudDogRXhwcmVzc2lvbjtcbiAgICBjb25zdHJ1Y3Rvcihhcmd1bWVudDogRXhwcmVzc2lvbikge1xuICAgICAgICB0aGlzLnR5cGUgPSBTeW50YXguU3ByZWFkRWxlbWVudDtcbiAgICAgICAgdGhpcy5hcmd1bWVudCA9IGFyZ3VtZW50O1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIFN0YXRpY01lbWJlckV4cHJlc3Npb24ge1xuICAgIHJlYWRvbmx5IHR5cGU6IHN0cmluZztcbiAgICByZWFkb25seSBjb21wdXRlZDogYm9vbGVhbjtcbiAgICByZWFkb25seSBvYmplY3Q6IEV4cHJlc3Npb247XG4gICAgcmVhZG9ubHkgcHJvcGVydHk6IEV4cHJlc3Npb247XG4gICAgY29uc3RydWN0b3Iob2JqZWN0OiBFeHByZXNzaW9uLCBwcm9wZXJ0eTogRXhwcmVzc2lvbikge1xuICAgICAgICB0aGlzLnR5cGUgPSBTeW50YXguTWVtYmVyRXhwcmVzc2lvbjtcbiAgICAgICAgdGhpcy5jb21wdXRlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLm9iamVjdCA9IG9iamVjdDtcbiAgICAgICAgdGhpcy5wcm9wZXJ0eSA9IHByb3BlcnR5O1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIFN1cGVyIHtcbiAgICByZWFkb25seSB0eXBlOiBzdHJpbmc7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMudHlwZSA9IFN5bnRheC5TdXBlcjtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBTd2l0Y2hDYXNlIHtcbiAgICByZWFkb25seSB0eXBlOiBzdHJpbmc7XG4gICAgcmVhZG9ubHkgdGVzdDogRXhwcmVzc2lvbiB8IG51bGw7XG4gICAgcmVhZG9ubHkgY29uc2VxdWVudDogU3RhdGVtZW50W107XG4gICAgY29uc3RydWN0b3IodGVzdDogRXhwcmVzc2lvbiwgY29uc2VxdWVudDogU3RhdGVtZW50W10pIHtcbiAgICAgICAgdGhpcy50eXBlID0gU3ludGF4LlN3aXRjaENhc2U7XG4gICAgICAgIHRoaXMudGVzdCA9IHRlc3Q7XG4gICAgICAgIHRoaXMuY29uc2VxdWVudCA9IGNvbnNlcXVlbnQ7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgU3dpdGNoU3RhdGVtZW50IHtcbiAgICByZWFkb25seSB0eXBlOiBzdHJpbmc7XG4gICAgcmVhZG9ubHkgZGlzY3JpbWluYW50OiBFeHByZXNzaW9uO1xuICAgIHJlYWRvbmx5IGNhc2VzOiBTd2l0Y2hDYXNlW107XG4gICAgY29uc3RydWN0b3IoZGlzY3JpbWluYW50OiBFeHByZXNzaW9uLCBjYXNlczogU3dpdGNoQ2FzZVtdKSB7XG4gICAgICAgIHRoaXMudHlwZSA9IFN5bnRheC5Td2l0Y2hTdGF0ZW1lbnQ7XG4gICAgICAgIHRoaXMuZGlzY3JpbWluYW50ID0gZGlzY3JpbWluYW50O1xuICAgICAgICB0aGlzLmNhc2VzID0gY2FzZXM7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgVGFnZ2VkVGVtcGxhdGVFeHByZXNzaW9uIHtcbiAgICByZWFkb25seSB0eXBlOiBzdHJpbmc7XG4gICAgcmVhZG9ubHkgdGFnOiBFeHByZXNzaW9uO1xuICAgIHJlYWRvbmx5IHF1YXNpOiBUZW1wbGF0ZUxpdGVyYWw7XG4gICAgY29uc3RydWN0b3IodGFnOiBFeHByZXNzaW9uLCBxdWFzaTogVGVtcGxhdGVMaXRlcmFsKSB7XG4gICAgICAgIHRoaXMudHlwZSA9IFN5bnRheC5UYWdnZWRUZW1wbGF0ZUV4cHJlc3Npb247XG4gICAgICAgIHRoaXMudGFnID0gdGFnO1xuICAgICAgICB0aGlzLnF1YXNpID0gcXVhc2k7XG4gICAgfVxufVxuXG5pbnRlcmZhY2UgVGVtcGxhdGVFbGVtZW50VmFsdWUge1xuICAgIGNvb2tlZDogc3RyaW5nO1xuICAgIHJhdzogc3RyaW5nO1xufVxuXG5leHBvcnQgY2xhc3MgVGVtcGxhdGVFbGVtZW50IHtcbiAgICByZWFkb25seSB0eXBlOiBzdHJpbmc7XG4gICAgcmVhZG9ubHkgdmFsdWU6IFRlbXBsYXRlRWxlbWVudFZhbHVlO1xuICAgIHJlYWRvbmx5IHRhaWw6IGJvb2xlYW47XG4gICAgY29uc3RydWN0b3IodmFsdWU6IFRlbXBsYXRlRWxlbWVudFZhbHVlLCB0YWlsOiBib29sZWFuKSB7XG4gICAgICAgIHRoaXMudHlwZSA9IFN5bnRheC5UZW1wbGF0ZUVsZW1lbnQ7XG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy50YWlsID0gdGFpbDtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBUZW1wbGF0ZUxpdGVyYWwge1xuICAgIHJlYWRvbmx5IHR5cGU6IHN0cmluZztcbiAgICByZWFkb25seSBxdWFzaXM6IFRlbXBsYXRlRWxlbWVudFtdO1xuICAgIHJlYWRvbmx5IGV4cHJlc3Npb25zOiBFeHByZXNzaW9uW107XG4gICAgY29uc3RydWN0b3IocXVhc2lzOiBUZW1wbGF0ZUVsZW1lbnRbXSwgZXhwcmVzc2lvbnM6IEV4cHJlc3Npb25bXSkge1xuICAgICAgICB0aGlzLnR5cGUgPSBTeW50YXguVGVtcGxhdGVMaXRlcmFsO1xuICAgICAgICB0aGlzLnF1YXNpcyA9IHF1YXNpcztcbiAgICAgICAgdGhpcy5leHByZXNzaW9ucyA9IGV4cHJlc3Npb25zO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIFRoaXNFeHByZXNzaW9uIHtcbiAgICByZWFkb25seSB0eXBlOiBzdHJpbmc7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMudHlwZSA9IFN5bnRheC5UaGlzRXhwcmVzc2lvbjtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBUaHJvd1N0YXRlbWVudCB7XG4gICAgcmVhZG9ubHkgdHlwZTogc3RyaW5nO1xuICAgIHJlYWRvbmx5IGFyZ3VtZW50OiBFeHByZXNzaW9uO1xuICAgIGNvbnN0cnVjdG9yKGFyZ3VtZW50OiBFeHByZXNzaW9uKSB7XG4gICAgICAgIHRoaXMudHlwZSA9IFN5bnRheC5UaHJvd1N0YXRlbWVudDtcbiAgICAgICAgdGhpcy5hcmd1bWVudCA9IGFyZ3VtZW50O1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIFRyeVN0YXRlbWVudCB7XG4gICAgcmVhZG9ubHkgdHlwZTogc3RyaW5nO1xuICAgIHJlYWRvbmx5IGJsb2NrOiBCbG9ja1N0YXRlbWVudDtcbiAgICByZWFkb25seSBoYW5kbGVyOiBDYXRjaENsYXVzZSB8IG51bGw7XG4gICAgcmVhZG9ubHkgZmluYWxpemVyOiBCbG9ja1N0YXRlbWVudCB8IG51bGw7XG4gICAgY29uc3RydWN0b3IoYmxvY2s6IEJsb2NrU3RhdGVtZW50LCBoYW5kbGVyOiBDYXRjaENsYXVzZSB8IG51bGwsIGZpbmFsaXplcjogQmxvY2tTdGF0ZW1lbnQgfCBudWxsKSB7XG4gICAgICAgIHRoaXMudHlwZSA9IFN5bnRheC5UcnlTdGF0ZW1lbnQ7XG4gICAgICAgIHRoaXMuYmxvY2sgPSBibG9jaztcbiAgICAgICAgdGhpcy5oYW5kbGVyID0gaGFuZGxlcjtcbiAgICAgICAgdGhpcy5maW5hbGl6ZXIgPSBmaW5hbGl6ZXI7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgVW5hcnlFeHByZXNzaW9uIHtcbiAgICByZWFkb25seSB0eXBlOiBzdHJpbmc7XG4gICAgcmVhZG9ubHkgb3BlcmF0b3I6IHN0cmluZztcbiAgICByZWFkb25seSBhcmd1bWVudDogRXhwcmVzc2lvbjtcbiAgICByZWFkb25seSBwcmVmaXg6IGJvb2xlYW47XG4gICAgY29uc3RydWN0b3Iob3BlcmF0b3IsIGFyZ3VtZW50KSB7XG4gICAgICAgIHRoaXMudHlwZSA9IFN5bnRheC5VbmFyeUV4cHJlc3Npb247XG4gICAgICAgIHRoaXMub3BlcmF0b3IgPSBvcGVyYXRvcjtcbiAgICAgICAgdGhpcy5hcmd1bWVudCA9IGFyZ3VtZW50O1xuICAgICAgICB0aGlzLnByZWZpeCA9IHRydWU7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgVXBkYXRlRXhwcmVzc2lvbiB7XG4gICAgcmVhZG9ubHkgdHlwZTogc3RyaW5nO1xuICAgIHJlYWRvbmx5IG9wZXJhdG9yOiBzdHJpbmc7XG4gICAgcmVhZG9ubHkgYXJndW1lbnQ6IEV4cHJlc3Npb247XG4gICAgcmVhZG9ubHkgcHJlZml4OiBib29sZWFuO1xuICAgIGNvbnN0cnVjdG9yKG9wZXJhdG9yLCBhcmd1bWVudCwgcHJlZml4KSB7XG4gICAgICAgIHRoaXMudHlwZSA9IFN5bnRheC5VcGRhdGVFeHByZXNzaW9uO1xuICAgICAgICB0aGlzLm9wZXJhdG9yID0gb3BlcmF0b3I7XG4gICAgICAgIHRoaXMuYXJndW1lbnQgPSBhcmd1bWVudDtcbiAgICAgICAgdGhpcy5wcmVmaXggPSBwcmVmaXg7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgVmFyaWFibGVEZWNsYXJhdGlvbiB7XG4gICAgcmVhZG9ubHkgdHlwZTogc3RyaW5nO1xuICAgIHJlYWRvbmx5IGRlY2xhcmF0aW9uczogVmFyaWFibGVEZWNsYXJhdG9yW107XG4gICAgcmVhZG9ubHkga2luZDogc3RyaW5nO1xuICAgIGNvbnN0cnVjdG9yKGRlY2xhcmF0aW9uczogVmFyaWFibGVEZWNsYXJhdG9yW10sIGtpbmQ6IHN0cmluZykge1xuICAgICAgICB0aGlzLnR5cGUgPSBTeW50YXguVmFyaWFibGVEZWNsYXJhdGlvbjtcbiAgICAgICAgdGhpcy5kZWNsYXJhdGlvbnMgPSBkZWNsYXJhdGlvbnM7XG4gICAgICAgIHRoaXMua2luZCA9IGtpbmQ7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgVmFyaWFibGVEZWNsYXJhdG9yIHtcbiAgICByZWFkb25seSB0eXBlOiBzdHJpbmc7XG4gICAgcmVhZG9ubHkgaWQ6IEJpbmRpbmdJZGVudGlmaWVyIHwgQmluZGluZ1BhdHRlcm47XG4gICAgcmVhZG9ubHkgaW5pdDogRXhwcmVzc2lvbiB8IG51bGw7XG4gICAgY29uc3RydWN0b3IoaWQ6IEJpbmRpbmdJZGVudGlmaWVyIHwgQmluZGluZ1BhdHRlcm4sIGluaXQ6IEV4cHJlc3Npb24gfCBudWxsKSB7XG4gICAgICAgIHRoaXMudHlwZSA9IFN5bnRheC5WYXJpYWJsZURlY2xhcmF0b3I7XG4gICAgICAgIHRoaXMuaWQgPSBpZDtcbiAgICAgICAgdGhpcy5pbml0ID0gaW5pdDtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBXaGlsZVN0YXRlbWVudCB7XG4gICAgcmVhZG9ubHkgdHlwZTogc3RyaW5nO1xuICAgIHJlYWRvbmx5IHRlc3Q6IEV4cHJlc3Npb247XG4gICAgcmVhZG9ubHkgYm9keTogU3RhdGVtZW50O1xuICAgIGNvbnN0cnVjdG9yKHRlc3Q6IEV4cHJlc3Npb24sIGJvZHk6IFN0YXRlbWVudCkge1xuICAgICAgICB0aGlzLnR5cGUgPSBTeW50YXguV2hpbGVTdGF0ZW1lbnQ7XG4gICAgICAgIHRoaXMudGVzdCA9IHRlc3Q7XG4gICAgICAgIHRoaXMuYm9keSA9IGJvZHk7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgV2l0aFN0YXRlbWVudCB7XG4gICAgcmVhZG9ubHkgdHlwZTogc3RyaW5nO1xuICAgIHJlYWRvbmx5IG9iamVjdDogRXhwcmVzc2lvbjtcbiAgICByZWFkb25seSBib2R5OiBTdGF0ZW1lbnQ7XG4gICAgY29uc3RydWN0b3Iob2JqZWN0OiBFeHByZXNzaW9uLCBib2R5OiBTdGF0ZW1lbnQpIHtcbiAgICAgICAgdGhpcy50eXBlID0gU3ludGF4LldpdGhTdGF0ZW1lbnQ7XG4gICAgICAgIHRoaXMub2JqZWN0ID0gb2JqZWN0O1xuICAgICAgICB0aGlzLmJvZHkgPSBib2R5O1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIFlpZWxkRXhwcmVzc2lvbiB7XG4gICAgcmVhZG9ubHkgdHlwZTogc3RyaW5nO1xuICAgIHJlYWRvbmx5IGFyZ3VtZW50OiBFeHByZXNzaW9uIHwgbnVsbDtcbiAgICByZWFkb25seSBkZWxlZ2F0ZTogYm9vbGVhbjtcbiAgICBjb25zdHJ1Y3Rvcihhcmd1bWVudDogRXhwcmVzc2lvbiB8IG51bGwsIGRlbGVnYXRlOiBib29sZWFuKSB7XG4gICAgICAgIHRoaXMudHlwZSA9IFN5bnRheC5ZaWVsZEV4cHJlc3Npb247XG4gICAgICAgIHRoaXMuYXJndW1lbnQgPSBhcmd1bWVudDtcbiAgICAgICAgdGhpcy5kZWxlZ2F0ZSA9IGRlbGVnYXRlO1xuICAgIH1cbn0iXX0=