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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9ub2Rlcy50cyJdLCJuYW1lcyI6WyJBcnJheUV4cHJlc3Npb24iLCJjb25zdHJ1Y3RvciIsImVsZW1lbnRzIiwidHlwZSIsIlN5bnRheCIsIkFycmF5UGF0dGVybiIsIkFycm93RnVuY3Rpb25FeHByZXNzaW9uIiwicGFyYW1zIiwiYm9keSIsImV4cHJlc3Npb24iLCJpZCIsImdlbmVyYXRvciIsImFzeW5jIiwiQXNzaWdubWVudEV4cHJlc3Npb24iLCJvcGVyYXRvciIsImxlZnQiLCJyaWdodCIsIkFzc2lnbm1lbnRQYXR0ZXJuIiwiQXN5bmNBcnJvd0Z1bmN0aW9uRXhwcmVzc2lvbiIsIkFzeW5jRnVuY3Rpb25EZWNsYXJhdGlvbiIsIkZ1bmN0aW9uRGVjbGFyYXRpb24iLCJBc3luY0Z1bmN0aW9uRXhwcmVzc2lvbiIsIkZ1bmN0aW9uRXhwcmVzc2lvbiIsIkF3YWl0RXhwcmVzc2lvbiIsImFyZ3VtZW50IiwiQmluYXJ5RXhwcmVzc2lvbiIsImxvZ2ljYWwiLCJMb2dpY2FsRXhwcmVzc2lvbiIsIkJsb2NrU3RhdGVtZW50IiwiQnJlYWtTdGF0ZW1lbnQiLCJsYWJlbCIsIkNhbGxFeHByZXNzaW9uIiwiY2FsbGVlIiwiYXJncyIsImFyZ3VtZW50cyIsIkNhdGNoQ2xhdXNlIiwicGFyYW0iLCJDbGFzc0JvZHkiLCJDbGFzc0RlY2xhcmF0aW9uIiwic3VwZXJDbGFzcyIsIkNsYXNzRXhwcmVzc2lvbiIsIkNvbXB1dGVkTWVtYmVyRXhwcmVzc2lvbiIsIm9iamVjdCIsInByb3BlcnR5IiwiTWVtYmVyRXhwcmVzc2lvbiIsImNvbXB1dGVkIiwiQ29uZGl0aW9uYWxFeHByZXNzaW9uIiwidGVzdCIsImNvbnNlcXVlbnQiLCJhbHRlcm5hdGUiLCJDb250aW51ZVN0YXRlbWVudCIsIkRlYnVnZ2VyU3RhdGVtZW50IiwiRGlyZWN0aXZlIiwiZGlyZWN0aXZlIiwiRXhwcmVzc2lvblN0YXRlbWVudCIsIkRvV2hpbGVTdGF0ZW1lbnQiLCJFbXB0eVN0YXRlbWVudCIsIkV4cG9ydEFsbERlY2xhcmF0aW9uIiwic291cmNlIiwiRXhwb3J0RGVmYXVsdERlY2xhcmF0aW9uIiwiZGVjbGFyYXRpb24iLCJFeHBvcnROYW1lZERlY2xhcmF0aW9uIiwic3BlY2lmaWVycyIsIkV4cG9ydFNwZWNpZmllciIsImxvY2FsIiwiZXhwb3J0ZWQiLCJGb3JJblN0YXRlbWVudCIsImVhY2giLCJGb3JPZlN0YXRlbWVudCIsIkZvclN0YXRlbWVudCIsImluaXQiLCJ1cGRhdGUiLCJJZGVudGlmaWVyIiwibmFtZSIsIklmU3RhdGVtZW50IiwiSW1wb3J0IiwiSW1wb3J0RGVjbGFyYXRpb24iLCJJbXBvcnREZWZhdWx0U3BlY2lmaWVyIiwiSW1wb3J0TmFtZXNwYWNlU3BlY2lmaWVyIiwiSW1wb3J0U3BlY2lmaWVyIiwiaW1wb3J0ZWQiLCJMYWJlbGVkU3RhdGVtZW50IiwiTGl0ZXJhbCIsInZhbHVlIiwicmF3IiwiTWV0YVByb3BlcnR5IiwibWV0YSIsIk1ldGhvZERlZmluaXRpb24iLCJrZXkiLCJraW5kIiwiaXNTdGF0aWMiLCJzdGF0aWMiLCJNb2R1bGUiLCJQcm9ncmFtIiwic291cmNlVHlwZSIsIk5ld0V4cHJlc3Npb24iLCJPYmplY3RFeHByZXNzaW9uIiwicHJvcGVydGllcyIsIk9iamVjdFBhdHRlcm4iLCJQcm9wZXJ0eSIsIm1ldGhvZCIsInNob3J0aGFuZCIsIlJlZ2V4TGl0ZXJhbCIsInBhdHRlcm4iLCJmbGFncyIsInJlZ2V4IiwiUmVzdEVsZW1lbnQiLCJSZXR1cm5TdGF0ZW1lbnQiLCJTY3JpcHQiLCJTZXF1ZW5jZUV4cHJlc3Npb24iLCJleHByZXNzaW9ucyIsIlNwcmVhZEVsZW1lbnQiLCJTdGF0aWNNZW1iZXJFeHByZXNzaW9uIiwiU3VwZXIiLCJTd2l0Y2hDYXNlIiwiU3dpdGNoU3RhdGVtZW50IiwiZGlzY3JpbWluYW50IiwiY2FzZXMiLCJUYWdnZWRUZW1wbGF0ZUV4cHJlc3Npb24iLCJ0YWciLCJxdWFzaSIsIlRlbXBsYXRlRWxlbWVudCIsInRhaWwiLCJUZW1wbGF0ZUxpdGVyYWwiLCJxdWFzaXMiLCJUaGlzRXhwcmVzc2lvbiIsIlRocm93U3RhdGVtZW50IiwiVHJ5U3RhdGVtZW50IiwiYmxvY2siLCJoYW5kbGVyIiwiZmluYWxpemVyIiwiVW5hcnlFeHByZXNzaW9uIiwicHJlZml4IiwiVXBkYXRlRXhwcmVzc2lvbiIsIlZhcmlhYmxlRGVjbGFyYXRpb24iLCJkZWNsYXJhdGlvbnMiLCJWYXJpYWJsZURlY2xhcmF0b3IiLCJXaGlsZVN0YXRlbWVudCIsIldpdGhTdGF0ZW1lbnQiLCJZaWVsZEV4cHJlc3Npb24iLCJkZWxlZ2F0ZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUdBOztBQUhBOzs7QUErQk8sTUFBTUEsZUFBTixDQUFzQjtBQUd6QkMsRUFBQUEsV0FBVyxDQUFDQyxRQUFELEVBQXFDO0FBQzVDLFNBQUtDLElBQUwsR0FBWUMsZUFBT0osZUFBbkI7QUFDQSxTQUFLRSxRQUFMLEdBQWdCQSxRQUFoQjtBQUNIOztBQU53Qjs7OztBQVN0QixNQUFNRyxZQUFOLENBQW1CO0FBR3RCSixFQUFBQSxXQUFXLENBQUNDLFFBQUQsRUFBa0M7QUFDekMsU0FBS0MsSUFBTCxHQUFZQyxlQUFPQyxZQUFuQjtBQUNBLFNBQUtILFFBQUwsR0FBZ0JBLFFBQWhCO0FBQ0g7O0FBTnFCOzs7O0FBU25CLE1BQU1JLHVCQUFOLENBQThCO0FBUWpDTCxFQUFBQSxXQUFXLENBQUNNLE1BQUQsRUFBOEJDLElBQTlCLEVBQWlFQyxVQUFqRSxFQUFzRjtBQUM3RixTQUFLTixJQUFMLEdBQVlDLGVBQU9FLHVCQUFuQjtBQUNBLFNBQUtJLEVBQUwsR0FBVSxJQUFWO0FBQ0EsU0FBS0gsTUFBTCxHQUFjQSxNQUFkO0FBQ0EsU0FBS0MsSUFBTCxHQUFZQSxJQUFaO0FBQ0EsU0FBS0csU0FBTCxHQUFpQixLQUFqQjtBQUNBLFNBQUtGLFVBQUwsR0FBa0JBLFVBQWxCO0FBQ0EsU0FBS0csS0FBTCxHQUFhLEtBQWI7QUFDSDs7QUFoQmdDOzs7O0FBbUI5QixNQUFNQyxvQkFBTixD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NEQsSUFBekMsRUFBa0U7QUFDekUsU0FBS25FLElBQUwsR0FBWUMsZUFBT29JLGtCQUFuQjtBQUNBLFNBQUs5SCxFQUFMLEdBQVVBLEVBQVY7QUFDQSxTQUFLNEQsSUFBTCxHQUFZQSxJQUFaO0FBQ0g7O0FBUjJCOzs7O0FBV3pCLE1BQU1tRSxjQUFOLENBQXFCO0FBSXhCeEksRUFBQUEsV0FBVyxDQUFDOEMsSUFBRCxFQUFtQnZDLElBQW5CLEVBQW9DO0FBQzNDLFNBQUtMLElBQUwsR0FBWUMsZUFBT3FJLGNBQW5CO0FBQ0EsU0FBSzFGLElBQUwsR0FBWUEsSUFBWjtBQUNBLFNBQUt2QyxJQUFMLEdBQVlBLElBQVo7QUFDSDs7QUFSdUI7Ozs7QUFXckIsTUFBTWtJLGFBQU4sQ0FBb0I7QUFJdkJ6SSxFQUFBQSxXQUFXLENBQUN5QyxNQUFELEVBQXFCbEMsSUFBckIsRUFBc0M7QUFDN0MsU0FBS0wsSUFBTCxHQUFZQyxlQUFPc0ksYUFBbkI7QUFDQSxTQUFLaEcsTUFBTCxHQUFjQSxNQUFkO0FBQ0EsU0FBS2xDLElBQUwsR0FBWUEsSUFBWjtBQUNIOztBQVJzQjs7OztBQVdwQixNQUFNbUksZUFBTixDQUFzQjtBQUl6QjFJLEVBQUFBLFdBQVcsQ0FBQ3VCLFFBQUQsRUFBOEJvSCxRQUE5QixFQUFpRDtBQUN4RCxTQUFLekksSUFBTCxHQUFZQyxlQUFPdUksZUFBbkI7QUFDQSxTQUFLbkgsUUFBTCxHQUFnQkEsUUFBaEI7QUFDQSxTQUFLb0gsUUFBTCxHQUFnQkEsUUFBaEI7QUFDSDs7QUFSd0IiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIGh0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS9qcXVlcnkvZXNwcmltYS9tYXN0ZXIvc3JjL25vZGVzLnRzXG4gKi9cbmltcG9ydCB7IFN5bnRheCB9IGZyb20gJy4vc3ludGF4JztcblxuZXhwb3J0IHR5cGUgQXJndW1lbnRMaXN0RWxlbWVudCA9IEV4cHJlc3Npb24gfCBTcHJlYWRFbGVtZW50O1xuZXhwb3J0IHR5cGUgQXJyYXlFeHByZXNzaW9uRWxlbWVudCA9IEV4cHJlc3Npb24gfCBTcHJlYWRFbGVtZW50IHwgbnVsbDtcbmV4cG9ydCB0eXBlIEFycmF5UGF0dGVybkVsZW1lbnQgPSBBc3NpZ25tZW50UGF0dGVybiB8IEJpbmRpbmdJZGVudGlmaWVyIHwgQmluZGluZ1BhdHRlcm4gfCBSZXN0RWxlbWVudCB8IG51bGw7XG5leHBvcnQgdHlwZSBCaW5kaW5nUGF0dGVybiA9IEFycmF5UGF0dGVybiB8IE9iamVjdFBhdHRlcm47XG5leHBvcnQgdHlwZSBCaW5kaW5nSWRlbnRpZmllciA9IElkZW50aWZpZXI7XG5leHBvcnQgdHlwZSBEZWNsYXJhdGlvbiA9IEFzeW5jRnVuY3Rpb25EZWNsYXJhdGlvbiB8IENsYXNzRGVjbGFyYXRpb24gfCBFeHBvcnREZWNsYXJhdGlvbiB8IEZ1bmN0aW9uRGVjbGFyYXRpb24gfCBJbXBvcnREZWNsYXJhdGlvbiB8IFZhcmlhYmxlRGVjbGFyYXRpb247XG5leHBvcnQgdHlwZSBFeHBvcnRhYmxlRGVmYXVsdERlY2xhcmF0aW9uID0gQmluZGluZ0lkZW50aWZpZXIgfCBCaW5kaW5nUGF0dGVybiB8IENsYXNzRGVjbGFyYXRpb24gfCBFeHByZXNzaW9uIHwgRnVuY3Rpb25EZWNsYXJhdGlvbjtcbmV4cG9ydCB0eXBlIEV4cG9ydGFibGVOYW1lZERlY2xhcmF0aW9uID0gQXN5bmNGdW5jdGlvbkRlY2xhcmF0aW9uIHwgQ2xhc3NEZWNsYXJhdGlvbiB8IEZ1bmN0aW9uRGVjbGFyYXRpb24gfCBWYXJpYWJsZURlY2xhcmF0aW9uO1xuZXhwb3J0IHR5cGUgRXhwb3J0RGVjbGFyYXRpb24gPSBFeHBvcnRBbGxEZWNsYXJhdGlvbiB8IEV4cG9ydERlZmF1bHREZWNsYXJhdGlvbiB8IEV4cG9ydE5hbWVkRGVjbGFyYXRpb247XG5leHBvcnQgdHlwZSBFeHByZXNzaW9uID0gQXJyYXlFeHByZXNzaW9uIHwgQXJyb3dGdW5jdGlvbkV4cHJlc3Npb24gfCBBc3NpZ25tZW50RXhwcmVzc2lvbiB8IEFzeW5jQXJyb3dGdW5jdGlvbkV4cHJlc3Npb24gfCBBc3luY0Z1bmN0aW9uRXhwcmVzc2lvbiB8XG4gICAgQXdhaXRFeHByZXNzaW9uIHwgQmluYXJ5RXhwcmVzc2lvbiB8IENhbGxFeHByZXNzaW9uIHwgQ2xhc3NFeHByZXNzaW9uIHwgQ29tcHV0ZWRNZW1iZXJFeHByZXNzaW9uIHxcbiAgICBDb25kaXRpb25hbEV4cHJlc3Npb24gfCBJZGVudGlmaWVyIHwgRnVuY3Rpb25FeHByZXNzaW9uIHwgTGl0ZXJhbCB8IE5ld0V4cHJlc3Npb24gfCBPYmplY3RFeHByZXNzaW9uIHxcbiAgICBSZWdleExpdGVyYWwgfCBTZXF1ZW5jZUV4cHJlc3Npb24gfCBTdGF0aWNNZW1iZXJFeHByZXNzaW9uIHwgVGFnZ2VkVGVtcGxhdGVFeHByZXNzaW9uIHxcbiAgICBUaGlzRXhwcmVzc2lvbiB8IFVuYXJ5RXhwcmVzc2lvbiB8IFVwZGF0ZUV4cHJlc3Npb24gfCBZaWVsZEV4cHJlc3Npb247XG5leHBvcnQgdHlwZSBGdW5jdGlvblBhcmFtZXRlciA9IEFzc2lnbm1lbnRQYXR0ZXJuIHwgQmluZGluZ0lkZW50aWZpZXIgfCBCaW5kaW5nUGF0dGVybjtcbmV4cG9ydCB0eXBlIEltcG9ydERlY2xhcmF0aW9uU3BlY2lmaWVyID0gSW1wb3J0RGVmYXVsdFNwZWNpZmllciB8IEltcG9ydE5hbWVzcGFjZVNwZWNpZmllciB8IEltcG9ydFNwZWNpZmllcjtcbmV4cG9ydCB0eXBlIE9iamVjdEV4cHJlc3Npb25Qcm9wZXJ0eSA9IFByb3BlcnR5IHwgU3ByZWFkRWxlbWVudDtcbmV4cG9ydCB0eXBlIE9iamVjdFBhdHRlcm5Qcm9wZXJ0eSA9IFByb3BlcnR5IHwgUmVzdEVsZW1lbnQ7XG5leHBvcnQgdHlwZSBTdGF0ZW1lbnQgPSBBc3luY0Z1bmN0aW9uRGVjbGFyYXRpb24gfCBCcmVha1N0YXRlbWVudCB8IENvbnRpbnVlU3RhdGVtZW50IHwgRGVidWdnZXJTdGF0ZW1lbnQgfCBEb1doaWxlU3RhdGVtZW50IHxcbiAgICBFbXB0eVN0YXRlbWVudCB8IEV4cHJlc3Npb25TdGF0ZW1lbnQgfCBEaXJlY3RpdmUgfCBGb3JTdGF0ZW1lbnQgfCBGb3JJblN0YXRlbWVudCB8IEZvck9mU3RhdGVtZW50IHxcbiAgICBGdW5jdGlvbkRlY2xhcmF0aW9uIHwgSWZTdGF0ZW1lbnQgfCBSZXR1cm5TdGF0ZW1lbnQgfCBTd2l0Y2hTdGF0ZW1lbnQgfCBUaHJvd1N0YXRlbWVudCB8XG4gICAgVHJ5U3RhdGVtZW50IHwgVmFyaWFibGVEZWNsYXJhdGlvbiB8IFdoaWxlU3RhdGVtZW50IHwgV2l0aFN0YXRlbWVudDtcbmV4cG9ydCB0eXBlIFByb3BlcnR5S2V5ID0gSWRlbnRpZmllciB8IExpdGVyYWw7XG5leHBvcnQgdHlwZSBQcm9wZXJ0eVZhbHVlID0gQXNzaWdubWVudFBhdHRlcm4gfCBBc3luY0Z1bmN0aW9uRXhwcmVzc2lvbiB8IEJpbmRpbmdJZGVudGlmaWVyIHwgQmluZGluZ1BhdHRlcm4gfCBGdW5jdGlvbkV4cHJlc3Npb247XG5leHBvcnQgdHlwZSBTdGF0ZW1lbnRMaXN0SXRlbSA9IERlY2xhcmF0aW9uIHwgU3RhdGVtZW50O1xuXG5leHBvcnQgY2xhc3MgQXJyYXlFeHByZXNzaW9uIHtcbiAgICByZWFkb25seSB0eXBlOiBzdHJpbmc7XG4gICAgcmVhZG9ubHkgZWxlbWVudHM6IEFycmF5RXhwcmVzc2lvbkVsZW1lbnRbXTtcbiAgICBjb25zdHJ1Y3RvcihlbGVtZW50czogQXJyYXlFeHByZXNzaW9uRWxlbWVudFtdKSB7XG4gICAgICAgIHRoaXMudHlwZSA9IFN5bnRheC5BcnJheUV4cHJlc3Npb247XG4gICAgICAgIHRoaXMuZWxlbWVudHMgPSBlbGVtZW50cztcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBBcnJheVBhdHRlcm4ge1xuICAgIHJlYWRvbmx5IHR5cGU6IHN0cmluZztcbiAgICByZWFkb25seSBlbGVtZW50czogQXJyYXlQYXR0ZXJuRWxlbWVudFtdO1xuICAgIGNvbnN0cnVjdG9yKGVsZW1lbnRzOiBBcnJheVBhdHRlcm5FbGVtZW50W10pIHtcbiAgICAgICAgdGhpcy50eXBlID0gU3ludGF4LkFycmF5UGF0dGVybjtcbiAgICAgICAgdGhpcy5lbGVtZW50cyA9IGVsZW1lbnRzO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIEFycm93RnVuY3Rpb25FeHByZXNzaW9uIHtcbiAgICByZWFkb25seSB0eXBlOiBzdHJpbmc7XG4gICAgcmVhZG9ubHkgaWQ6IElkZW50aWZpZXIgfCBudWxsO1xuICAgIHJlYWRvbmx5IHBhcmFtczogRnVuY3Rpb25QYXJhbWV0ZXJbXTtcbiAgICByZWFkb25seSBib2R5OiBCbG9ja1N0YXRlbWVudCB8IEV4cHJlc3Npb247XG4gICAgcmVhZG9ubHkgZ2VuZXJhdG9yOiBib29sZWFuO1xuICAgIHJlYWRvbmx5IGV4cHJlc3Npb246IGJvb2xlYW47XG4gICAgcmVhZG9ubHkgYXN5bmM6IGJvb2xlYW47XG4gICAgY29uc3RydWN0b3IocGFyYW1zOiBGdW5jdGlvblBhcmFtZXRlcltdLCBib2R5OiBCbG9ja1N0YXRlbWVudCB8IEV4cHJlc3Npb24sIGV4cHJlc3Npb246IGJvb2xlYW4pIHtcbiAgICAgICAgdGhpcy50eXBlID0gU3ludGF4LkFycm93RnVuY3Rpb25FeHByZXNzaW9uO1xuICAgICAgICB0aGlzLmlkID0gbnVsbDtcbiAgICAgICAgdGhpcy5wYXJhbXMgPSBwYXJhbXM7XG4gICAgICAgIHRoaXMuYm9keSA9IGJvZHk7XG4gICAgICAgIHRoaXMuZ2VuZXJhdG9yID0gZmFsc2U7XG4gICAgICAgIHRoaXMuZXhwcmVzc2lvbiA9IGV4cHJlc3Npb247XG4gICAgICAgIHRoaXMuYXN5bmMgPSBmYWxzZTtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBBc3NpZ25tZW50RXhwcmVzc2lvbiB7XG4gICAgcmVhZG9ubHkgdHlwZTogc3RyaW5nO1xuICAgIHJlYWRvbmx5IG9wZXJhdG9yOiBzdHJpbmc7XG4gICAgcmVhZG9ubHkgbGVmdDogRXhwcmVzc2lvbjtcbiAgICByZWFkb25seSByaWdodDogRXhwcmVzc2lvbjtcbiAgICBjb25zdHJ1Y3RvcihvcGVyYXRvcjogc3RyaW5nLCBsZWZ0OiBFeHByZXNzaW9uLCByaWdodDogRXhwcmVzc2lvbikge1xuICAgICAgICB0aGlzLnR5cGUgPSBTeW50YXguQXNzaWdubWVudEV4cHJlc3Npb247XG4gICAgICAgIHRoaXMub3BlcmF0b3IgPSBvcGVyYXRvcjtcbiAgICAgICAgdGhpcy5sZWZ0ID0gbGVmdDtcbiAgICAgICAgdGhpcy5yaWdodCA9IHJpZ2h0O1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIEFzc2lnbm1lbnRQYXR0ZXJuIHtcbiAgICByZWFkb25seSB0eXBlOiBzdHJpbmc7XG4gICAgcmVhZG9ubHkgbGVmdDogQmluZGluZ0lkZW50aWZpZXIgfCBCaW5kaW5nUGF0dGVybjtcbiAgICByZWFkb25seSByaWdodDogRXhwcmVzc2lvbjtcbiAgICBjb25zdHJ1Y3RvcihsZWZ0OiBCaW5kaW5nSWRlbnRpZmllciB8IEJpbmRpbmdQYXR0ZXJuLCByaWdodDogRXhwcmVzc2lvbikge1xuICAgICAgICB0aGlzLnR5cGUgPSBTeW50YXguQXNzaWdubWVudFBhdHRlcm47XG4gICAgICAgIHRoaXMubGVmdCA9IGxlZnQ7XG4gICAgICAgIHRoaXMucmlnaHQgPSByaWdodDtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBBc3luY0Fycm93RnVuY3Rpb25FeHByZXNzaW9uIHtcbiAgICByZWFkb25seSB0eXBlOiBzdHJpbmc7XG4gICAgcmVhZG9ubHkgaWQ6IElkZW50aWZpZXIgfCBudWxsO1xuICAgIHJlYWRvbmx5IHBhcmFtczogRnVuY3Rpb25QYXJhbWV0ZXJbXTtcbiAgICByZWFkb25seSBib2R5OiBCbG9ja1N0YXRlbWVudCB8IEV4cHJlc3Npb247XG4gICAgcmVhZG9ubHkgZ2VuZXJhdG9yOiBib29sZWFuO1xuICAgIHJlYWRvbmx5IGV4cHJlc3Npb246IGJvb2xlYW47XG4gICAgcmVhZG9ubHkgYXN5bmM6IGJvb2xlYW47XG4gICAgY29uc3RydWN0b3IocGFyYW1zOiBGdW5jdGlvblBhcmFtZXRlcltdLCBib2R5OiBCbG9ja1N0YXRlbWVudCB8IEV4cHJlc3Npb24sIGV4cHJlc3Npb246IGJvb2xlYW4pIHtcbiAgICAgICAgdGhpcy50eXBlID0gU3ludGF4LkFycm93RnVuY3Rpb25FeHByZXNzaW9uO1xuICAgICAgICB0aGlzLmlkID0gbnVsbDtcbiAgICAgICAgdGhpcy5wYXJhbXMgPSBwYXJhbXM7XG4gICAgICAgIHRoaXMuYm9keSA9IGJvZHk7XG4gICAgICAgIHRoaXMuZ2VuZXJhdG9yID0gZmFsc2U7XG4gICAgICAgIHRoaXMuZXhwcmVzc2lvbiA9IGV4cHJlc3Npb247XG4gICAgICAgIHRoaXMuYXN5bmMgPSB0cnVlO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIEFzeW5jRnVuY3Rpb25EZWNsYXJhdGlvbiB7XG4gICAgcmVhZG9ubHkgdHlwZTogc3RyaW5nO1xuICAgIHJlYWRvbmx5IGlkOiBJZGVudGlmaWVyIHwgbnVsbDtcbiAgICByZWFkb25seSBwYXJhbXM6IEZ1bmN0aW9uUGFyYW1ldGVyW107XG4gICAgcmVhZG9ubHkgYm9keTogQmxvY2tTdGF0ZW1lbnQ7XG4gICAgcmVhZG9ubHkgZ2VuZXJhdG9yOiBib29sZWFuO1xuICAgIHJlYWRvbmx5IGV4cHJlc3Npb246IGJvb2xlYW47XG4gICAgcmVhZG9ubHkgYXN5bmM6IGJvb2xlYW47XG4gICAgY29uc3RydWN0b3IoaWQ6IElkZW50aWZpZXIgfCBudWxsLCBwYXJhbXM6IEZ1bmN0aW9uUGFyYW1ldGVyW10sIGJvZHk6IEJsb2NrU3RhdGVtZW50KSB7XG4gICAgICAgIHRoaXMudHlwZSA9IFN5bnRheC5GdW5jdGlvbkRlY2xhcmF0aW9uO1xuICAgICAgICB0aGlzLmlkID0gaWQ7XG4gICAgICAgIHRoaXMucGFyYW1zID0gcGFyYW1zO1xuICAgICAgICB0aGlzLmJvZHkgPSBib2R5O1xuICAgICAgICB0aGlzLmdlbmVyYXRvciA9IGZhbHNlO1xuICAgICAgICB0aGlzLmV4cHJlc3Npb24gPSBmYWxzZTtcbiAgICAgICAgdGhpcy5hc3luYyA9IHRydWU7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgQXN5bmNGdW5jdGlvbkV4cHJlc3Npb24ge1xuICAgIHJlYWRvbmx5IHR5cGU6IHN0cmluZztcbiAgICByZWFkb25seSBpZDogSWRlbnRpZmllciB8IG51bGw7XG4gICAgcmVhZG9ubHkgcGFyYW1zOiBGdW5jdGlvblBhcmFtZXRlcltdO1xuICAgIHJlYWRvbmx5IGJvZHk6IEJsb2NrU3RhdGVtZW50O1xuICAgIHJlYWRvbmx5IGdlbmVyYXRvcjogYm9vbGVhbjtcbiAgICByZWFkb25seSBleHByZXNzaW9uOiBib29sZWFuO1xuICAgIHJlYWRvbmx5IGFzeW5jOiBib29sZWFuO1xuICAgIGNvbnN0cnVjdG9yKGlkOiBJZGVudGlmaWVyIHwgbnVsbCwgcGFyYW1zOiBGdW5jdGlvblBhcmFtZXRlcltdLCBib2R5OiBCbG9ja1N0YXRlbWVudCkge1xuICAgICAgICB0aGlzLnR5cGUgPSBTeW50YXguRnVuY3Rpb25FeHByZXNzaW9uO1xuICAgICAgICB0aGlzLmlkID0gaWQ7XG4gICAgICAgIHRoaXMucGFyYW1zID0gcGFyYW1zO1xuICAgICAgICB0aGlzLmJvZHkgPSBib2R5O1xuICAgICAgICB0aGlzLmdlbmVyYXRvciA9IGZhbHNlO1xuICAgICAgICB0aGlzLmV4cHJlc3Npb24gPSBmYWxzZTtcbiAgICAgICAgdGhpcy5hc3luYyA9IHRydWU7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgQXdhaXRFeHByZXNzaW9uIHtcbiAgICByZWFkb25seSB0eXBlOiBzdHJpbmc7XG4gICAgcmVhZG9ubHkgYXJndW1lbnQ6IEV4cHJlc3Npb247XG4gICAgY29uc3RydWN0b3IoYXJndW1lbnQ6IEV4cHJlc3Npb24pIHtcbiAgICAgICAgdGhpcy50eXBlID0gU3ludGF4LkF3YWl0RXhwcmVzc2lvbjtcbiAgICAgICAgdGhpcy5hcmd1bWVudCA9IGFyZ3VtZW50O1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIEJpbmFyeUV4cHJlc3Npb24ge1xuICAgIHJlYWRvbmx5IHR5cGU6IHN0cmluZztcbiAgICByZWFkb25seSBvcGVyYXRvcjogc3RyaW5nO1xuICAgIHJlYWRvbmx5IGxlZnQ6IEV4cHJlc3Npb247XG4gICAgcmVhZG9ubHkgcmlnaHQ6IEV4cHJlc3Npb247XG4gICAgY29uc3RydWN0b3Iob3BlcmF0b3I6IHN0cmluZywgbGVmdDogRXhwcmVzc2lvbiwgcmlnaHQ6IEV4cHJlc3Npb24pIHtcbiAgICAgICAgY29uc3QgbG9naWNhbCA9IChvcGVyYXRvciA9PT0gJ3x8JyB8fCBvcGVyYXRvciA9PT0gJyYmJyk7XG4gICAgICAgIHRoaXMudHlwZSA9IGxvZ2ljYWwgPyBTeW50YXguTG9naWNhbEV4cHJlc3Npb24gOiBTeW50YXguQmluYXJ5RXhwcmVzc2lvbjtcbiAgICAgICAgdGhpcy5vcGVyYXRvciA9IG9wZXJhdG9yO1xuICAgICAgICB0aGlzLmxlZnQgPSBsZWZ0O1xuICAgICAgICB0aGlzLnJpZ2h0ID0gcmlnaHQ7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgQmxvY2tTdGF0ZW1lbnQge1xuICAgIHJlYWRvbmx5IHR5cGU6IHN0cmluZztcbiAgICByZWFkb25seSBib2R5OiBTdGF0ZW1lbnRbXTtcbiAgICBjb25zdHJ1Y3Rvcihib2R5KSB7XG4gICAgICAgIHRoaXMudHlwZSA9IFN5bnRheC5CbG9ja1N0YXRlbWVudDtcbiAgICAgICAgdGhpcy5ib2R5ID0gYm9keTtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBCcmVha1N0YXRlbWVudCB7XG4gICAgcmVhZG9ubHkgdHlwZTogc3RyaW5nO1xuICAgIHJlYWRvbmx5IGxhYmVsOiBJZGVudGlmaWVyIHwgbnVsbDtcbiAgICBjb25zdHJ1Y3RvcihsYWJlbDogSWRlbnRpZmllciB8IG51bGwpIHtcbiAgICAgICAgdGhpcy50eXBlID0gU3ludGF4LkJyZWFrU3RhdGVtZW50O1xuICAgICAgICB0aGlzLmxhYmVsID0gbGFiZWw7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgQ2FsbEV4cHJlc3Npb24ge1xuICAgIHJlYWRvbmx5IHR5cGU6IHN0cmluZztcbiAgICByZWFkb25seSBjYWxsZWU6IEV4cHJlc3Npb24gfCBJbXBvcnQ7XG4gICAgcmVhZG9ubHkgYXJndW1lbnRzOiBBcmd1bWVudExpc3RFbGVtZW50W107XG4gICAgY29uc3RydWN0b3IoY2FsbGVlOiBFeHByZXNzaW9uIHwgSW1wb3J0LCBhcmdzOiBBcmd1bWVudExpc3RFbGVtZW50W10pIHtcbiAgICAgICAgdGhpcy50eXBlID0gU3ludGF4LkNhbGxFeHByZXNzaW9uO1xuICAgICAgICB0aGlzLmNhbGxlZSA9IGNhbGxlZTtcbiAgICAgICAgdGhpcy5hcmd1bWVudHMgPSBhcmdzO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIENhdGNoQ2xhdXNlIHtcbiAgICByZWFkb25seSB0eXBlOiBzdHJpbmc7XG4gICAgcmVhZG9ubHkgcGFyYW06IEJpbmRpbmdJZGVudGlmaWVyIHwgQmluZGluZ1BhdHRlcm47XG4gICAgcmVhZG9ubHkgYm9keTogQmxvY2tTdGF0ZW1lbnQ7XG4gICAgY29uc3RydWN0b3IocGFyYW06IEJpbmRpbmdJZGVudGlmaWVyIHwgQmluZGluZ1BhdHRlcm4sIGJvZHk6IEJsb2NrU3RhdGVtZW50KSB7XG4gICAgICAgIHRoaXMudHlwZSA9IFN5bnRheC5DYXRjaENsYXVzZTtcbiAgICAgICAgdGhpcy5wYXJhbSA9IHBhcmFtO1xuICAgICAgICB0aGlzLmJvZHkgPSBib2R5O1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIENsYXNzQm9keSB7XG4gICAgcmVhZG9ubHkgdHlwZTogc3RyaW5nO1xuICAgIHJlYWRvbmx5IGJvZHk6IFByb3BlcnR5W107XG4gICAgY29uc3RydWN0b3IoYm9keTogUHJvcGVydHlbXSkge1xuICAgICAgICB0aGlzLnR5cGUgPSBTeW50YXguQ2xhc3NCb2R5O1xuICAgICAgICB0aGlzLmJvZHkgPSBib2R5O1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIENsYXNzRGVjbGFyYXRpb24ge1xuICAgIHJlYWRvbmx5IHR5cGU6IHN0cmluZztcbiAgICByZWFkb25seSBpZDogSWRlbnRpZmllciB8IG51bGw7XG4gICAgcmVhZG9ubHkgc3VwZXJDbGFzczogSWRlbnRpZmllciB8IG51bGw7XG4gICAgcmVhZG9ubHkgYm9keTogQ2xhc3NCb2R5O1xuICAgIGNvbnN0cnVjdG9yKGlkOiBJZGVudGlmaWVyIHwgbnVsbCwgc3VwZXJDbGFzczogSWRlbnRpZmllciB8IG51bGwsIGJvZHk6IENsYXNzQm9keSkge1xuICAgICAgICB0aGlzLnR5cGUgPSBTeW50YXguQ2xhc3NEZWNsYXJhdGlvbjtcbiAgICAgICAgdGhpcy5pZCA9IGlkO1xuICAgICAgICB0aGlzLnN1cGVyQ2xhc3MgPSBzdXBlckNsYXNzO1xuICAgICAgICB0aGlzLmJvZHkgPSBib2R5O1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIENsYXNzRXhwcmVzc2lvbiB7XG4gICAgcmVhZG9ubHkgdHlwZTogc3RyaW5nO1xuICAgIHJlYWRvbmx5IGlkOiBJZGVudGlmaWVyIHwgbnVsbDtcbiAgICByZWFkb25seSBzdXBlckNsYXNzOiBJZGVudGlmaWVyIHwgbnVsbDtcbiAgICByZWFkb25seSBib2R5OiBDbGFzc0JvZHk7XG4gICAgY29uc3RydWN0b3IoaWQ6IElkZW50aWZpZXIgfCBudWxsLCBzdXBlckNsYXNzOiBJZGVudGlmaWVyIHwgbnVsbCwgYm9keTogQ2xhc3NCb2R5KSB7XG4gICAgICAgIHRoaXMudHlwZSA9IFN5bnRheC5DbGFzc0V4cHJlc3Npb247XG4gICAgICAgIHRoaXMuaWQgPSBpZDtcbiAgICAgICAgdGhpcy5zdXBlckNsYXNzID0gc3VwZXJDbGFzcztcbiAgICAgICAgdGhpcy5ib2R5ID0gYm9keTtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBDb21wdXRlZE1lbWJlckV4cHJlc3Npb24ge1xuICAgIHJlYWRvbmx5IHR5cGU6IHN0cmluZztcbiAgICByZWFkb25seSBjb21wdXRlZDogYm9vbGVhbjtcbiAgICByZWFkb25seSBvYmplY3Q6IEV4cHJlc3Npb247XG4gICAgcmVhZG9ubHkgcHJvcGVydHk6IEV4cHJlc3Npb247XG4gICAgY29uc3RydWN0b3Iob2JqZWN0OiBFeHByZXNzaW9uLCBwcm9wZXJ0eTogRXhwcmVzc2lvbikge1xuICAgICAgICB0aGlzLnR5cGUgPSBTeW50YXguTWVtYmVyRXhwcmVzc2lvbjtcbiAgICAgICAgdGhpcy5jb21wdXRlZCA9IHRydWU7XG4gICAgICAgIHRoaXMub2JqZWN0ID0gb2JqZWN0O1xuICAgICAgICB0aGlzLnByb3BlcnR5ID0gcHJvcGVydHk7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgQ29uZGl0aW9uYWxFeHByZXNzaW9uIHtcbiAgICByZWFkb25seSB0eXBlOiBzdHJpbmc7XG4gICAgcmVhZG9ubHkgdGVzdDogRXhwcmVzc2lvbjtcbiAgICByZWFkb25seSBjb25zZXF1ZW50OiBFeHByZXNzaW9uO1xuICAgIHJlYWRvbmx5IGFsdGVybmF0ZTogRXhwcmVzc2lvbjtcbiAgICBjb25zdHJ1Y3Rvcih0ZXN0OiBFeHByZXNzaW9uLCBjb25zZXF1ZW50OiBFeHByZXNzaW9uLCBhbHRlcm5hdGU6IEV4cHJlc3Npb24pIHtcbiAgICAgICAgdGhpcy50eXBlID0gU3ludGF4LkNvbmRpdGlvbmFsRXhwcmVzc2lvbjtcbiAgICAgICAgdGhpcy50ZXN0ID0gdGVzdDtcbiAgICAgICAgdGhpcy5jb25zZXF1ZW50ID0gY29uc2VxdWVudDtcbiAgICAgICAgdGhpcy5hbHRlcm5hdGUgPSBhbHRlcm5hdGU7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgQ29udGludWVTdGF0ZW1lbnQge1xuICAgIHJlYWRvbmx5IHR5cGU6IHN0cmluZztcbiAgICByZWFkb25seSBsYWJlbDogSWRlbnRpZmllciB8IG51bGw7XG4gICAgY29uc3RydWN0b3IobGFiZWw6IElkZW50aWZpZXIgfCBudWxsKSB7XG4gICAgICAgIHRoaXMudHlwZSA9IFN5bnRheC5Db250aW51ZVN0YXRlbWVudDtcbiAgICAgICAgdGhpcy5sYWJlbCA9IGxhYmVsO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIERlYnVnZ2VyU3RhdGVtZW50IHtcbiAgICByZWFkb25seSB0eXBlOiBzdHJpbmc7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMudHlwZSA9IFN5bnRheC5EZWJ1Z2dlclN0YXRlbWVudDtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBEaXJlY3RpdmUge1xuICAgIHJlYWRvbmx5IHR5cGU6IHN0cmluZztcbiAgICByZWFkb25seSBleHByZXNzaW9uOiBFeHByZXNzaW9uO1xuICAgIHJlYWRvbmx5IGRpcmVjdGl2ZTogc3RyaW5nO1xuICAgIGNvbnN0cnVjdG9yKGV4cHJlc3Npb246IEV4cHJlc3Npb24sIGRpcmVjdGl2ZTogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMudHlwZSA9IFN5bnRheC5FeHByZXNzaW9uU3RhdGVtZW50O1xuICAgICAgICB0aGlzLmV4cHJlc3Npb24gPSBleHByZXNzaW9uO1xuICAgICAgICB0aGlzLmRpcmVjdGl2ZSA9IGRpcmVjdGl2ZTtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBEb1doaWxlU3RhdGVtZW50IHtcbiAgICByZWFkb25seSB0eXBlOiBzdHJpbmc7XG4gICAgcmVhZG9ubHkgYm9keTogU3RhdGVtZW50O1xuICAgIHJlYWRvbmx5IHRlc3Q6IEV4cHJlc3Npb247XG4gICAgY29uc3RydWN0b3IoYm9keTogU3RhdGVtZW50LCB0ZXN0OiBFeHByZXNzaW9uKSB7XG4gICAgICAgIHRoaXMudHlwZSA9IFN5bnRheC5Eb1doaWxlU3RhdGVtZW50O1xuICAgICAgICB0aGlzLmJvZHkgPSBib2R5O1xuICAgICAgICB0aGlzLnRlc3QgPSB0ZXN0O1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIEVtcHR5U3RhdGVtZW50IHtcbiAgICByZWFkb25seSB0eXBlOiBzdHJpbmc7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMudHlwZSA9IFN5bnRheC5FbXB0eVN0YXRlbWVudDtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBFeHBvcnRBbGxEZWNsYXJhdGlvbiB7XG4gICAgcmVhZG9ubHkgdHlwZTogc3RyaW5nO1xuICAgIHJlYWRvbmx5IHNvdXJjZTogTGl0ZXJhbDtcbiAgICBjb25zdHJ1Y3Rvcihzb3VyY2U6IExpdGVyYWwpIHtcbiAgICAgICAgdGhpcy50eXBlID0gU3ludGF4LkV4cG9ydEFsbERlY2xhcmF0aW9uO1xuICAgICAgICB0aGlzLnNvdXJjZSA9IHNvdXJjZTtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBFeHBvcnREZWZhdWx0RGVjbGFyYXRpb24ge1xuICAgIHJlYWRvbmx5IHR5cGU6IHN0cmluZztcbiAgICByZWFkb25seSBkZWNsYXJhdGlvbjogRXhwb3J0YWJsZURlZmF1bHREZWNsYXJhdGlvbjtcbiAgICBjb25zdHJ1Y3RvcihkZWNsYXJhdGlvbjogRXhwb3J0YWJsZURlZmF1bHREZWNsYXJhdGlvbikge1xuICAgICAgICB0aGlzLnR5cGUgPSBTeW50YXguRXhwb3J0RGVmYXVsdERlY2xhcmF0aW9uO1xuICAgICAgICB0aGlzLmRlY2xhcmF0aW9uID0gZGVjbGFyYXRpb247XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgRXhwb3J0TmFtZWREZWNsYXJhdGlvbiB7XG4gICAgcmVhZG9ubHkgdHlwZTogc3RyaW5nO1xuICAgIHJlYWRvbmx5IGRlY2xhcmF0aW9uOiBFeHBvcnRhYmxlTmFtZWREZWNsYXJhdGlvbiB8IG51bGw7XG4gICAgcmVhZG9ubHkgc3BlY2lmaWVyczogRXhwb3J0U3BlY2lmaWVyW107XG4gICAgcmVhZG9ubHkgc291cmNlOiBMaXRlcmFsIHwgbnVsbDtcbiAgICBjb25zdHJ1Y3RvcihkZWNsYXJhdGlvbjogRXhwb3J0YWJsZU5hbWVkRGVjbGFyYXRpb24gfCBudWxsLCBzcGVjaWZpZXJzOiBFeHBvcnRTcGVjaWZpZXJbXSwgc291cmNlOiBMaXRlcmFsIHwgbnVsbCkge1xuICAgICAgICB0aGlzLnR5cGUgPSBTeW50YXguRXhwb3J0TmFtZWREZWNsYXJhdGlvbjtcbiAgICAgICAgdGhpcy5kZWNsYXJhdGlvbiA9IGRlY2xhcmF0aW9uO1xuICAgICAgICB0aGlzLnNwZWNpZmllcnMgPSBzcGVjaWZpZXJzO1xuICAgICAgICB0aGlzLnNvdXJjZSA9IHNvdXJjZTtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBFeHBvcnRTcGVjaWZpZXIge1xuICAgIHJlYWRvbmx5IHR5cGU6IHN0cmluZztcbiAgICByZWFkb25seSBleHBvcnRlZDogSWRlbnRpZmllcjtcbiAgICByZWFkb25seSBsb2NhbDogSWRlbnRpZmllcjtcbiAgICBjb25zdHJ1Y3Rvcihsb2NhbDogSWRlbnRpZmllciwgZXhwb3J0ZWQ6IElkZW50aWZpZXIpIHtcbiAgICAgICAgdGhpcy50eXBlID0gU3ludGF4LkV4cG9ydFNwZWNpZmllcjtcbiAgICAgICAgdGhpcy5leHBvcnRlZCA9IGV4cG9ydGVkO1xuICAgICAgICB0aGlzLmxvY2FsID0gbG9jYWw7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgRXhwcmVzc2lvblN0YXRlbWVudCB7XG4gICAgcmVhZG9ubHkgdHlwZTogc3RyaW5nO1xuICAgIHJlYWRvbmx5IGV4cHJlc3Npb246IEV4cHJlc3Npb247XG4gICAgY29uc3RydWN0b3IoZXhwcmVzc2lvbjogRXhwcmVzc2lvbikge1xuICAgICAgICB0aGlzLnR5cGUgPSBTeW50YXguRXhwcmVzc2lvblN0YXRlbWVudDtcbiAgICAgICAgdGhpcy5leHByZXNzaW9uID0gZXhwcmVzc2lvbjtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBGb3JJblN0YXRlbWVudCB7XG4gICAgcmVhZG9ubHkgdHlwZTogc3RyaW5nO1xuICAgIHJlYWRvbmx5IGxlZnQ6IEV4cHJlc3Npb247XG4gICAgcmVhZG9ubHkgcmlnaHQ6IEV4cHJlc3Npb247XG4gICAgcmVhZG9ubHkgYm9keTogU3RhdGVtZW50O1xuICAgIHJlYWRvbmx5IGVhY2g6IGJvb2xlYW47XG4gICAgY29uc3RydWN0b3IobGVmdDogRXhwcmVzc2lvbiwgcmlnaHQ6IEV4cHJlc3Npb24sIGJvZHk6IFN0YXRlbWVudCkge1xuICAgICAgICB0aGlzLnR5cGUgPSBTeW50YXguRm9ySW5TdGF0ZW1lbnQ7XG4gICAgICAgIHRoaXMubGVmdCA9IGxlZnQ7XG4gICAgICAgIHRoaXMucmlnaHQgPSByaWdodDtcbiAgICAgICAgdGhpcy5ib2R5ID0gYm9keTtcbiAgICAgICAgdGhpcy5lYWNoID0gZmFsc2U7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgRm9yT2ZTdGF0ZW1lbnQge1xuICAgIHJlYWRvbmx5IHR5cGU6IHN0cmluZztcbiAgICByZWFkb25seSBsZWZ0OiBFeHByZXNzaW9uO1xuICAgIHJlYWRvbmx5IHJpZ2h0OiBFeHByZXNzaW9uO1xuICAgIHJlYWRvbmx5IGJvZHk6IFN0YXRlbWVudDtcbiAgICBjb25zdHJ1Y3RvcihsZWZ0OiBFeHByZXNzaW9uLCByaWdodDogRXhwcmVzc2lvbiwgYm9keTogU3RhdGVtZW50KSB7XG4gICAgICAgIHRoaXMudHlwZSA9IFN5bnRheC5Gb3JPZlN0YXRlbWVudDtcbiAgICAgICAgdGhpcy5sZWZ0ID0gbGVmdDtcbiAgICAgICAgdGhpcy5yaWdodCA9IHJpZ2h0O1xuICAgICAgICB0aGlzLmJvZHkgPSBib2R5O1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIEZvclN0YXRlbWVudCB7XG4gICAgcmVhZG9ubHkgdHlwZTogc3RyaW5nO1xuICAgIHJlYWRvbmx5IGluaXQ6IEV4cHJlc3Npb24gfCBudWxsO1xuICAgIHJlYWRvbmx5IHRlc3Q6IEV4cHJlc3Npb24gfCBudWxsO1xuICAgIHJlYWRvbmx5IHVwZGF0ZTogRXhwcmVzc2lvbiB8IG51bGw7XG4gICAgYm9keTogU3RhdGVtZW50O1xuICAgIGNvbnN0cnVjdG9yKGluaXQ6IEV4cHJlc3Npb24gfCBudWxsLCB0ZXN0OiBFeHByZXNzaW9uIHwgbnVsbCwgdXBkYXRlOiBFeHByZXNzaW9uIHwgbnVsbCwgYm9keTogU3RhdGVtZW50KSB7XG4gICAgICAgIHRoaXMudHlwZSA9IFN5bnRheC5Gb3JTdGF0ZW1lbnQ7XG4gICAgICAgIHRoaXMuaW5pdCA9IGluaXQ7XG4gICAgICAgIHRoaXMudGVzdCA9IHRlc3Q7XG4gICAgICAgIHRoaXMudXBkYXRlID0gdXBkYXRlO1xuICAgICAgICB0aGlzLmJvZHkgPSBib2R5O1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIEZ1bmN0aW9uRGVjbGFyYXRpb24ge1xuICAgIHJlYWRvbmx5IHR5cGU6IHN0cmluZztcbiAgICByZWFkb25seSBpZDogSWRlbnRpZmllciB8IG51bGw7XG4gICAgcmVhZG9ubHkgcGFyYW1zOiBGdW5jdGlvblBhcmFtZXRlcltdO1xuICAgIHJlYWRvbmx5IGJvZHk6IEJsb2NrU3RhdGVtZW50O1xuICAgIHJlYWRvbmx5IGdlbmVyYXRvcjogYm9vbGVhbjtcbiAgICByZWFkb25seSBleHByZXNzaW9uOiBib29sZWFuO1xuICAgIHJlYWRvbmx5IGFzeW5jOiBib29sZWFuO1xuICAgIGNvbnN0cnVjdG9yKGlkOiBJZGVudGlmaWVyIHwgbnVsbCwgcGFyYW1zOiBGdW5jdGlvblBhcmFtZXRlcltdLCBib2R5OiBCbG9ja1N0YXRlbWVudCwgZ2VuZXJhdG9yOiBib29sZWFuKSB7XG4gICAgICAgIHRoaXMudHlwZSA9IFN5bnRheC5GdW5jdGlvbkRlY2xhcmF0aW9uO1xuICAgICAgICB0aGlzLmlkID0gaWQ7XG4gICAgICAgIHRoaXMucGFyYW1zID0gcGFyYW1zO1xuICAgICAgICB0aGlzLmJvZHkgPSBib2R5O1xuICAgICAgICB0aGlzLmdlbmVyYXRvciA9IGdlbmVyYXRvcjtcbiAgICAgICAgdGhpcy5leHByZXNzaW9uID0gZmFsc2U7XG4gICAgICAgIHRoaXMuYXN5bmMgPSBmYWxzZTtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBGdW5jdGlvbkV4cHJlc3Npb24ge1xuICAgIHJlYWRvbmx5IHR5cGU6IHN0cmluZztcbiAgICByZWFkb25seSBpZDogSWRlbnRpZmllciB8IG51bGw7XG4gICAgcmVhZG9ubHkgcGFyYW1zOiBGdW5jdGlvblBhcmFtZXRlcltdO1xuICAgIHJlYWRvbmx5IGJvZHk6IEJsb2NrU3RhdGVtZW50O1xuICAgIHJlYWRvbmx5IGdlbmVyYXRvcjogYm9vbGVhbjtcbiAgICByZWFkb25seSBleHByZXNzaW9uOiBib29sZWFuO1xuICAgIHJlYWRvbmx5IGFzeW5jOiBib29sZWFuO1xuICAgIGNvbnN0cnVjdG9yKGlkOiBJZGVudGlmaWVyIHwgbnVsbCwgcGFyYW1zOiBGdW5jdGlvblBhcmFtZXRlcltdLCBib2R5OiBCbG9ja1N0YXRlbWVudCwgZ2VuZXJhdG9yOiBib29sZWFuKSB7XG4gICAgICAgIHRoaXMudHlwZSA9IFN5bnRheC5GdW5jdGlvbkV4cHJlc3Npb247XG4gICAgICAgIHRoaXMuaWQgPSBpZDtcbiAgICAgICAgdGhpcy5wYXJhbXMgPSBwYXJhbXM7XG4gICAgICAgIHRoaXMuYm9keSA9IGJvZHk7XG4gICAgICAgIHRoaXMuZ2VuZXJhdG9yID0gZ2VuZXJhdG9yO1xuICAgICAgICB0aGlzLmV4cHJlc3Npb24gPSBmYWxzZTtcbiAgICAgICAgdGhpcy5hc3luYyA9IGZhbHNlO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIElkZW50aWZpZXIge1xuICAgIHJlYWRvbmx5IHR5cGU6IHN0cmluZztcbiAgICByZWFkb25seSBuYW1lOiBzdHJpbmc7XG4gICAgY29uc3RydWN0b3IobmFtZSkge1xuICAgICAgICB0aGlzLnR5cGUgPSBTeW50YXguSWRlbnRpZmllcjtcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBJZlN0YXRlbWVudCB7XG4gICAgcmVhZG9ubHkgdHlwZTogc3RyaW5nO1xuICAgIHJlYWRvbmx5IHRlc3Q6IEV4cHJlc3Npb247XG4gICAgcmVhZG9ubHkgY29uc2VxdWVudDogU3RhdGVtZW50O1xuICAgIHJlYWRvbmx5IGFsdGVybmF0ZTogU3RhdGVtZW50IHwgbnVsbDtcbiAgICBjb25zdHJ1Y3Rvcih0ZXN0OiBFeHByZXNzaW9uLCBjb25zZXF1ZW50OiBTdGF0ZW1lbnQsIGFsdGVybmF0ZTogU3RhdGVtZW50IHwgbnVsbCkge1xuICAgICAgICB0aGlzLnR5cGUgPSBTeW50YXguSWZTdGF0ZW1lbnQ7XG4gICAgICAgIHRoaXMudGVzdCA9IHRlc3Q7XG4gICAgICAgIHRoaXMuY29uc2VxdWVudCA9IGNvbnNlcXVlbnQ7XG4gICAgICAgIHRoaXMuYWx0ZXJuYXRlID0gYWx0ZXJuYXRlO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIEltcG9ydCB7XG4gICAgcmVhZG9ubHkgdHlwZTogc3RyaW5nO1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLnR5cGUgPSBTeW50YXguSW1wb3J0O1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIEltcG9ydERlY2xhcmF0aW9uIHtcbiAgICByZWFkb25seSB0eXBlOiBzdHJpbmc7XG4gICAgcmVhZG9ubHkgc3BlY2lmaWVyczogSW1wb3J0RGVjbGFyYXRpb25TcGVjaWZpZXJbXTtcbiAgICByZWFkb25seSBzb3VyY2U6IExpdGVyYWw7XG4gICAgY29uc3RydWN0b3Ioc3BlY2lmaWVycywgc291cmNlKSB7XG4gICAgICAgIHRoaXMudHlwZSA9IFN5bnRheC5JbXBvcnREZWNsYXJhdGlvbjtcbiAgICAgICAgdGhpcy5zcGVjaWZpZXJzID0gc3BlY2lmaWVycztcbiAgICAgICAgdGhpcy5zb3VyY2UgPSBzb3VyY2U7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgSW1wb3J0RGVmYXVsdFNwZWNpZmllciB7XG4gICAgcmVhZG9ubHkgdHlwZTogc3RyaW5nO1xuICAgIHJlYWRvbmx5IGxvY2FsOiBJZGVudGlmaWVyO1xuICAgIGNvbnN0cnVjdG9yKGxvY2FsOiBJZGVudGlmaWVyKSB7XG4gICAgICAgIHRoaXMudHlwZSA9IFN5bnRheC5JbXBvcnREZWZhdWx0U3BlY2lmaWVyO1xuICAgICAgICB0aGlzLmxvY2FsID0gbG9jYWw7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgSW1wb3J0TmFtZXNwYWNlU3BlY2lmaWVyIHtcbiAgICByZWFkb25seSB0eXBlOiBzdHJpbmc7XG4gICAgcmVhZG9ubHkgbG9jYWw6IElkZW50aWZpZXI7XG4gICAgY29uc3RydWN0b3IobG9jYWw6IElkZW50aWZpZXIpIHtcbiAgICAgICAgdGhpcy50eXBlID0gU3ludGF4LkltcG9ydE5hbWVzcGFjZVNwZWNpZmllcjtcbiAgICAgICAgdGhpcy5sb2NhbCA9IGxvY2FsO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIEltcG9ydFNwZWNpZmllciB7XG4gICAgcmVhZG9ubHkgdHlwZTogc3RyaW5nO1xuICAgIHJlYWRvbmx5IGxvY2FsOiBJZGVudGlmaWVyO1xuICAgIHJlYWRvbmx5IGltcG9ydGVkOiBJZGVudGlmaWVyO1xuICAgIGNvbnN0cnVjdG9yKGxvY2FsOiBJZGVudGlmaWVyLCBpbXBvcnRlZDogSWRlbnRpZmllcikge1xuICAgICAgICB0aGlzLnR5cGUgPSBTeW50YXguSW1wb3J0U3BlY2lmaWVyO1xuICAgICAgICB0aGlzLmxvY2FsID0gbG9jYWw7XG4gICAgICAgIHRoaXMuaW1wb3J0ZWQgPSBpbXBvcnRlZDtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBMYWJlbGVkU3RhdGVtZW50IHtcbiAgICByZWFkb25seSB0eXBlOiBzdHJpbmc7XG4gICAgcmVhZG9ubHkgbGFiZWw6IElkZW50aWZpZXI7XG4gICAgcmVhZG9ubHkgYm9keTogU3RhdGVtZW50O1xuICAgIGNvbnN0cnVjdG9yKGxhYmVsOiBJZGVudGlmaWVyLCBib2R5OiBTdGF0ZW1lbnQpIHtcbiAgICAgICAgdGhpcy50eXBlID0gU3ludGF4LkxhYmVsZWRTdGF0ZW1lbnQ7XG4gICAgICAgIHRoaXMubGFiZWwgPSBsYWJlbDtcbiAgICAgICAgdGhpcy5ib2R5ID0gYm9keTtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBMaXRlcmFsIHtcbiAgICByZWFkb25seSB0eXBlOiBzdHJpbmc7XG4gICAgcmVhZG9ubHkgdmFsdWU6IGJvb2xlYW4gfCBudW1iZXIgfCBzdHJpbmcgfCBudWxsO1xuICAgIHJlYWRvbmx5IHJhdzogc3RyaW5nO1xuICAgIGNvbnN0cnVjdG9yKHZhbHVlOiBib29sZWFuIHwgbnVtYmVyIHwgc3RyaW5nIHwgbnVsbCwgcmF3OiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy50eXBlID0gU3ludGF4LkxpdGVyYWw7XG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5yYXcgPSByYXc7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgTWV0YVByb3BlcnR5IHtcbiAgICByZWFkb25seSB0eXBlOiBzdHJpbmc7XG4gICAgcmVhZG9ubHkgbWV0YTogSWRlbnRpZmllcjtcbiAgICByZWFkb25seSBwcm9wZXJ0eTogSWRlbnRpZmllcjtcbiAgICBjb25zdHJ1Y3RvcihtZXRhOiBJZGVudGlmaWVyLCBwcm9wZXJ0eTogSWRlbnRpZmllcikge1xuICAgICAgICB0aGlzLnR5cGUgPSBTeW50YXguTWV0YVByb3BlcnR5O1xuICAgICAgICB0aGlzLm1ldGEgPSBtZXRhO1xuICAgICAgICB0aGlzLnByb3BlcnR5ID0gcHJvcGVydHk7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgTWV0aG9kRGVmaW5pdGlvbiB7XG4gICAgcmVhZG9ubHkgdHlwZTogc3RyaW5nO1xuICAgIHJlYWRvbmx5IGtleTogRXhwcmVzc2lvbiB8IG51bGw7XG4gICAgcmVhZG9ubHkgY29tcHV0ZWQ6IGJvb2xlYW47XG4gICAgcmVhZG9ubHkgdmFsdWU6IEFzeW5jRnVuY3Rpb25FeHByZXNzaW9uIHwgRnVuY3Rpb25FeHByZXNzaW9uIHwgbnVsbDtcbiAgICByZWFkb25seSBraW5kOiBzdHJpbmc7XG4gICAgcmVhZG9ubHkgc3RhdGljOiBib29sZWFuO1xuICAgIGNvbnN0cnVjdG9yKGtleTogRXhwcmVzc2lvbiB8IG51bGwsIGNvbXB1dGVkOiBib29sZWFuLCB2YWx1ZTogQXN5bmNGdW5jdGlvbkV4cHJlc3Npb24gfCBGdW5jdGlvbkV4cHJlc3Npb24gfCBudWxsLCBraW5kOiBzdHJpbmcsIGlzU3RhdGljOiBib29sZWFuKSB7XG4gICAgICAgIHRoaXMudHlwZSA9IFN5bnRheC5NZXRob2REZWZpbml0aW9uO1xuICAgICAgICB0aGlzLmtleSA9IGtleTtcbiAgICAgICAgdGhpcy5jb21wdXRlZCA9IGNvbXB1dGVkO1xuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIHRoaXMua2luZCA9IGtpbmQ7XG4gICAgICAgIHRoaXMuc3RhdGljID0gaXNTdGF0aWM7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgTW9kdWxlIHtcbiAgICByZWFkb25seSB0eXBlOiBzdHJpbmc7XG4gICAgcmVhZG9ubHkgYm9keTogU3RhdGVtZW50TGlzdEl0ZW1bXTtcbiAgICByZWFkb25seSBzb3VyY2VUeXBlOiBzdHJpbmc7XG4gICAgY29uc3RydWN0b3IoYm9keTogU3RhdGVtZW50TGlzdEl0ZW1bXSkge1xuICAgICAgICB0aGlzLnR5cGUgPSBTeW50YXguUHJvZ3JhbTtcbiAgICAgICAgdGhpcy5ib2R5ID0gYm9keTtcbiAgICAgICAgdGhpcy5zb3VyY2VUeXBlID0gJ21vZHVsZSc7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgTmV3RXhwcmVzc2lvbiB7XG4gICAgcmVhZG9ubHkgdHlwZTogc3RyaW5nO1xuICAgIHJlYWRvbmx5IGNhbGxlZTogRXhwcmVzc2lvbjtcbiAgICByZWFkb25seSBhcmd1bWVudHM6IEFyZ3VtZW50TGlzdEVsZW1lbnRbXTtcbiAgICBjb25zdHJ1Y3RvcihjYWxsZWU6IEV4cHJlc3Npb24sIGFyZ3M6IEFyZ3VtZW50TGlzdEVsZW1lbnRbXSkge1xuICAgICAgICB0aGlzLnR5cGUgPSBTeW50YXguTmV3RXhwcmVzc2lvbjtcbiAgICAgICAgdGhpcy5jYWxsZWUgPSBjYWxsZWU7XG4gICAgICAgIHRoaXMuYXJndW1lbnRzID0gYXJncztcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBPYmplY3RFeHByZXNzaW9uIHtcbiAgICByZWFkb25seSB0eXBlOiBzdHJpbmc7XG4gICAgcmVhZG9ubHkgcHJvcGVydGllczogT2JqZWN0RXhwcmVzc2lvblByb3BlcnR5W107XG4gICAgY29uc3RydWN0b3IocHJvcGVydGllczogT2JqZWN0RXhwcmVzc2lvblByb3BlcnR5W10pIHtcbiAgICAgICAgdGhpcy50eXBlID0gU3ludGF4Lk9iamVjdEV4cHJlc3Npb247XG4gICAgICAgIHRoaXMucHJvcGVydGllcyA9IHByb3BlcnRpZXM7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgT2JqZWN0UGF0dGVybiB7XG4gICAgcmVhZG9ubHkgdHlwZTogc3RyaW5nO1xuICAgIHJlYWRvbmx5IHByb3BlcnRpZXM6IE9iamVjdFBhdHRlcm5Qcm9wZXJ0eVtdO1xuICAgIGNvbnN0cnVjdG9yKHByb3BlcnRpZXM6IE9iamVjdFBhdHRlcm5Qcm9wZXJ0eVtdKSB7XG4gICAgICAgIHRoaXMudHlwZSA9IFN5bnRheC5PYmplY3RQYXR0ZXJuO1xuICAgICAgICB0aGlzLnByb3BlcnRpZXMgPSBwcm9wZXJ0aWVzO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIFByb3BlcnR5IHtcbiAgICByZWFkb25seSB0eXBlOiBzdHJpbmc7XG4gICAgcmVhZG9ubHkga2V5OiBQcm9wZXJ0eUtleTtcbiAgICByZWFkb25seSBjb21wdXRlZDogYm9vbGVhbjtcbiAgICByZWFkb25seSB2YWx1ZTogUHJvcGVydHlWYWx1ZSB8IG51bGw7XG4gICAgcmVhZG9ubHkga2luZDogc3RyaW5nO1xuICAgIHJlYWRvbmx5IG1ldGhvZDogYm9vbGVhbjtcbiAgICByZWFkb25seSBzaG9ydGhhbmQ6IGJvb2xlYW47XG4gICAgY29uc3RydWN0b3Ioa2luZDogc3RyaW5nLCBrZXk6IFByb3BlcnR5S2V5LCBjb21wdXRlZDogYm9vbGVhbiwgdmFsdWU6IFByb3BlcnR5VmFsdWUgfCBudWxsLCBtZXRob2Q6IGJvb2xlYW4sIHNob3J0aGFuZDogYm9vbGVhbikge1xuICAgICAgICB0aGlzLnR5cGUgPSBTeW50YXguUHJvcGVydHk7XG4gICAgICAgIHRoaXMua2V5ID0ga2V5O1xuICAgICAgICB0aGlzLmNvbXB1dGVkID0gY29tcHV0ZWQ7XG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5raW5kID0ga2luZDtcbiAgICAgICAgdGhpcy5tZXRob2QgPSBtZXRob2Q7XG4gICAgICAgIHRoaXMuc2hvcnRoYW5kID0gc2hvcnRoYW5kO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIFJlZ2V4TGl0ZXJhbCB7XG4gICAgcmVhZG9ubHkgdHlwZTogc3RyaW5nO1xuICAgIHJlYWRvbmx5IHZhbHVlOiBSZWdFeHA7XG4gICAgcmVhZG9ubHkgcmF3OiBzdHJpbmc7XG4gICAgcmVhZG9ubHkgcmVnZXg6IHsgcGF0dGVybjogc3RyaW5nOyBmbGFnczogc3RyaW5nIH07XG4gICAgY29uc3RydWN0b3IodmFsdWU6IFJlZ0V4cCwgcmF3OiBzdHJpbmcsIHBhdHRlcm46IHN0cmluZywgZmxhZ3M6IHN0cmluZykge1xuICAgICAgICB0aGlzLnR5cGUgPSBTeW50YXguTGl0ZXJhbDtcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB0aGlzLnJhdyA9IHJhdztcbiAgICAgICAgdGhpcy5yZWdleCA9IHsgcGF0dGVybiwgZmxhZ3MgfTtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBSZXN0RWxlbWVudCB7XG4gICAgcmVhZG9ubHkgdHlwZTogc3RyaW5nO1xuICAgIHJlYWRvbmx5IGFyZ3VtZW50OiBCaW5kaW5nSWRlbnRpZmllciB8IEJpbmRpbmdQYXR0ZXJuO1xuICAgIGNvbnN0cnVjdG9yKGFyZ3VtZW50OiBCaW5kaW5nSWRlbnRpZmllciB8IEJpbmRpbmdQYXR0ZXJuKSB7XG4gICAgICAgIHRoaXMudHlwZSA9IFN5bnRheC5SZXN0RWxlbWVudDtcbiAgICAgICAgdGhpcy5hcmd1bWVudCA9IGFyZ3VtZW50O1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIFJldHVyblN0YXRlbWVudCB7XG4gICAgcmVhZG9ubHkgdHlwZTogc3RyaW5nO1xuICAgIHJlYWRvbmx5IGFyZ3VtZW50OiBFeHByZXNzaW9uIHwgbnVsbDtcbiAgICBjb25zdHJ1Y3Rvcihhcmd1bWVudDogRXhwcmVzc2lvbiB8IG51bGwpIHtcbiAgICAgICAgdGhpcy50eXBlID0gU3ludGF4LlJldHVyblN0YXRlbWVudDtcbiAgICAgICAgdGhpcy5hcmd1bWVudCA9IGFyZ3VtZW50O1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIFNjcmlwdCB7XG4gICAgcmVhZG9ubHkgdHlwZTogc3RyaW5nO1xuICAgIHJlYWRvbmx5IGJvZHk6IFN0YXRlbWVudExpc3RJdGVtW107XG4gICAgcmVhZG9ubHkgc291cmNlVHlwZTogc3RyaW5nO1xuICAgIGNvbnN0cnVjdG9yKGJvZHk6IFN0YXRlbWVudExpc3RJdGVtW10pIHtcbiAgICAgICAgdGhpcy50eXBlID0gU3ludGF4LlByb2dyYW07XG4gICAgICAgIHRoaXMuYm9keSA9IGJvZHk7XG4gICAgICAgIHRoaXMuc291cmNlVHlwZSA9ICdzY3JpcHQnO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIFNlcXVlbmNlRXhwcmVzc2lvbiB7XG4gICAgcmVhZG9ubHkgdHlwZTogc3RyaW5nO1xuICAgIHJlYWRvbmx5IGV4cHJlc3Npb25zOiBFeHByZXNzaW9uW107XG4gICAgY29uc3RydWN0b3IoZXhwcmVzc2lvbnM6IEV4cHJlc3Npb25bXSkge1xuICAgICAgICB0aGlzLnR5cGUgPSBTeW50YXguU2VxdWVuY2VFeHByZXNzaW9uO1xuICAgICAgICB0aGlzLmV4cHJlc3Npb25zID0gZXhwcmVzc2lvbnM7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgU3ByZWFkRWxlbWVudCB7XG4gICAgcmVhZG9ubHkgdHlwZTogc3RyaW5nO1xuICAgIHJlYWRvbmx5IGFyZ3VtZW50OiBFeHByZXNzaW9uO1xuICAgIGNvbnN0cnVjdG9yKGFyZ3VtZW50OiBFeHByZXNzaW9uKSB7XG4gICAgICAgIHRoaXMudHlwZSA9IFN5bnRheC5TcHJlYWRFbGVtZW50O1xuICAgICAgICB0aGlzLmFyZ3VtZW50ID0gYXJndW1lbnQ7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgU3RhdGljTWVtYmVyRXhwcmVzc2lvbiB7XG4gICAgcmVhZG9ubHkgdHlwZTogc3RyaW5nO1xuICAgIHJlYWRvbmx5IGNvbXB1dGVkOiBib29sZWFuO1xuICAgIHJlYWRvbmx5IG9iamVjdDogRXhwcmVzc2lvbjtcbiAgICByZWFkb25seSBwcm9wZXJ0eTogRXhwcmVzc2lvbjtcbiAgICBjb25zdHJ1Y3RvcihvYmplY3Q6IEV4cHJlc3Npb24sIHByb3BlcnR5OiBFeHByZXNzaW9uKSB7XG4gICAgICAgIHRoaXMudHlwZSA9IFN5bnRheC5NZW1iZXJFeHByZXNzaW9uO1xuICAgICAgICB0aGlzLmNvbXB1dGVkID0gZmFsc2U7XG4gICAgICAgIHRoaXMub2JqZWN0ID0gb2JqZWN0O1xuICAgICAgICB0aGlzLnByb3BlcnR5ID0gcHJvcGVydHk7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgU3VwZXIge1xuICAgIHJlYWRvbmx5IHR5cGU6IHN0cmluZztcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy50eXBlID0gU3ludGF4LlN1cGVyO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIFN3aXRjaENhc2Uge1xuICAgIHJlYWRvbmx5IHR5cGU6IHN0cmluZztcbiAgICByZWFkb25seSB0ZXN0OiBFeHByZXNzaW9uIHwgbnVsbDtcbiAgICByZWFkb25seSBjb25zZXF1ZW50OiBTdGF0ZW1lbnRbXTtcbiAgICBjb25zdHJ1Y3Rvcih0ZXN0OiBFeHByZXNzaW9uLCBjb25zZXF1ZW50OiBTdGF0ZW1lbnRbXSkge1xuICAgICAgICB0aGlzLnR5cGUgPSBTeW50YXguU3dpdGNoQ2FzZTtcbiAgICAgICAgdGhpcy50ZXN0ID0gdGVzdDtcbiAgICAgICAgdGhpcy5jb25zZXF1ZW50ID0gY29uc2VxdWVudDtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBTd2l0Y2hTdGF0ZW1lbnQge1xuICAgIHJlYWRvbmx5IHR5cGU6IHN0cmluZztcbiAgICByZWFkb25seSBkaXNjcmltaW5hbnQ6IEV4cHJlc3Npb247XG4gICAgcmVhZG9ubHkgY2FzZXM6IFN3aXRjaENhc2VbXTtcbiAgICBjb25zdHJ1Y3RvcihkaXNjcmltaW5hbnQ6IEV4cHJlc3Npb24sIGNhc2VzOiBTd2l0Y2hDYXNlW10pIHtcbiAgICAgICAgdGhpcy50eXBlID0gU3ludGF4LlN3aXRjaFN0YXRlbWVudDtcbiAgICAgICAgdGhpcy5kaXNjcmltaW5hbnQgPSBkaXNjcmltaW5hbnQ7XG4gICAgICAgIHRoaXMuY2FzZXMgPSBjYXNlcztcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBUYWdnZWRUZW1wbGF0ZUV4cHJlc3Npb24ge1xuICAgIHJlYWRvbmx5IHR5cGU6IHN0cmluZztcbiAgICByZWFkb25seSB0YWc6IEV4cHJlc3Npb247XG4gICAgcmVhZG9ubHkgcXVhc2k6IFRlbXBsYXRlTGl0ZXJhbDtcbiAgICBjb25zdHJ1Y3Rvcih0YWc6IEV4cHJlc3Npb24sIHF1YXNpOiBUZW1wbGF0ZUxpdGVyYWwpIHtcbiAgICAgICAgdGhpcy50eXBlID0gU3ludGF4LlRhZ2dlZFRlbXBsYXRlRXhwcmVzc2lvbjtcbiAgICAgICAgdGhpcy50YWcgPSB0YWc7XG4gICAgICAgIHRoaXMucXVhc2kgPSBxdWFzaTtcbiAgICB9XG59XG5cbmludGVyZmFjZSBUZW1wbGF0ZUVsZW1lbnRWYWx1ZSB7XG4gICAgY29va2VkOiBzdHJpbmc7XG4gICAgcmF3OiBzdHJpbmc7XG59XG5cbmV4cG9ydCBjbGFzcyBUZW1wbGF0ZUVsZW1lbnQge1xuICAgIHJlYWRvbmx5IHR5cGU6IHN0cmluZztcbiAgICByZWFkb25seSB2YWx1ZTogVGVtcGxhdGVFbGVtZW50VmFsdWU7XG4gICAgcmVhZG9ubHkgdGFpbDogYm9vbGVhbjtcbiAgICBjb25zdHJ1Y3Rvcih2YWx1ZTogVGVtcGxhdGVFbGVtZW50VmFsdWUsIHRhaWw6IGJvb2xlYW4pIHtcbiAgICAgICAgdGhpcy50eXBlID0gU3ludGF4LlRlbXBsYXRlRWxlbWVudDtcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB0aGlzLnRhaWwgPSB0YWlsO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIFRlbXBsYXRlTGl0ZXJhbCB7XG4gICAgcmVhZG9ubHkgdHlwZTogc3RyaW5nO1xuICAgIHJlYWRvbmx5IHF1YXNpczogVGVtcGxhdGVFbGVtZW50W107XG4gICAgcmVhZG9ubHkgZXhwcmVzc2lvbnM6IEV4cHJlc3Npb25bXTtcbiAgICBjb25zdHJ1Y3RvcihxdWFzaXM6IFRlbXBsYXRlRWxlbWVudFtdLCBleHByZXNzaW9uczogRXhwcmVzc2lvbltdKSB7XG4gICAgICAgIHRoaXMudHlwZSA9IFN5bnRheC5UZW1wbGF0ZUxpdGVyYWw7XG4gICAgICAgIHRoaXMucXVhc2lzID0gcXVhc2lzO1xuICAgICAgICB0aGlzLmV4cHJlc3Npb25zID0gZXhwcmVzc2lvbnM7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgVGhpc0V4cHJlc3Npb24ge1xuICAgIHJlYWRvbmx5IHR5cGU6IHN0cmluZztcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy50eXBlID0gU3ludGF4LlRoaXNFeHByZXNzaW9uO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIFRocm93U3RhdGVtZW50IHtcbiAgICByZWFkb25seSB0eXBlOiBzdHJpbmc7XG4gICAgcmVhZG9ubHkgYXJndW1lbnQ6IEV4cHJlc3Npb247XG4gICAgY29uc3RydWN0b3IoYXJndW1lbnQ6IEV4cHJlc3Npb24pIHtcbiAgICAgICAgdGhpcy50eXBlID0gU3ludGF4LlRocm93U3RhdGVtZW50O1xuICAgICAgICB0aGlzLmFyZ3VtZW50ID0gYXJndW1lbnQ7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgVHJ5U3RhdGVtZW50IHtcbiAgICByZWFkb25seSB0eXBlOiBzdHJpbmc7XG4gICAgcmVhZG9ubHkgYmxvY2s6IEJsb2NrU3RhdGVtZW50O1xuICAgIHJlYWRvbmx5IGhhbmRsZXI6IENhdGNoQ2xhdXNlIHwgbnVsbDtcbiAgICByZWFkb25seSBmaW5hbGl6ZXI6IEJsb2NrU3RhdGVtZW50IHwgbnVsbDtcbiAgICBjb25zdHJ1Y3RvcihibG9jazogQmxvY2tTdGF0ZW1lbnQsIGhhbmRsZXI6IENhdGNoQ2xhdXNlIHwgbnVsbCwgZmluYWxpemVyOiBCbG9ja1N0YXRlbWVudCB8IG51bGwpIHtcbiAgICAgICAgdGhpcy50eXBlID0gU3ludGF4LlRyeVN0YXRlbWVudDtcbiAgICAgICAgdGhpcy5ibG9jayA9IGJsb2NrO1xuICAgICAgICB0aGlzLmhhbmRsZXIgPSBoYW5kbGVyO1xuICAgICAgICB0aGlzLmZpbmFsaXplciA9IGZpbmFsaXplcjtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBVbmFyeUV4cHJlc3Npb24ge1xuICAgIHJlYWRvbmx5IHR5cGU6IHN0cmluZztcbiAgICByZWFkb25seSBvcGVyYXRvcjogc3RyaW5nO1xuICAgIHJlYWRvbmx5IGFyZ3VtZW50OiBFeHByZXNzaW9uO1xuICAgIHJlYWRvbmx5IHByZWZpeDogYm9vbGVhbjtcbiAgICBjb25zdHJ1Y3RvcihvcGVyYXRvciwgYXJndW1lbnQpIHtcbiAgICAgICAgdGhpcy50eXBlID0gU3ludGF4LlVuYXJ5RXhwcmVzc2lvbjtcbiAgICAgICAgdGhpcy5vcGVyYXRvciA9IG9wZXJhdG9yO1xuICAgICAgICB0aGlzLmFyZ3VtZW50ID0gYXJndW1lbnQ7XG4gICAgICAgIHRoaXMucHJlZml4ID0gdHJ1ZTtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBVcGRhdGVFeHByZXNzaW9uIHtcbiAgICByZWFkb25seSB0eXBlOiBzdHJpbmc7XG4gICAgcmVhZG9ubHkgb3BlcmF0b3I6IHN0cmluZztcbiAgICByZWFkb25seSBhcmd1bWVudDogRXhwcmVzc2lvbjtcbiAgICByZWFkb25seSBwcmVmaXg6IGJvb2xlYW47XG4gICAgY29uc3RydWN0b3Iob3BlcmF0b3IsIGFyZ3VtZW50LCBwcmVmaXgpIHtcbiAgICAgICAgdGhpcy50eXBlID0gU3ludGF4LlVwZGF0ZUV4cHJlc3Npb247XG4gICAgICAgIHRoaXMub3BlcmF0b3IgPSBvcGVyYXRvcjtcbiAgICAgICAgdGhpcy5hcmd1bWVudCA9IGFyZ3VtZW50O1xuICAgICAgICB0aGlzLnByZWZpeCA9IHByZWZpeDtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBWYXJpYWJsZURlY2xhcmF0aW9uIHtcbiAgICByZWFkb25seSB0eXBlOiBzdHJpbmc7XG4gICAgcmVhZG9ubHkgZGVjbGFyYXRpb25zOiBWYXJpYWJsZURlY2xhcmF0b3JbXTtcbiAgICByZWFkb25seSBraW5kOiBzdHJpbmc7XG4gICAgY29uc3RydWN0b3IoZGVjbGFyYXRpb25zOiBWYXJpYWJsZURlY2xhcmF0b3JbXSwga2luZDogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMudHlwZSA9IFN5bnRheC5WYXJpYWJsZURlY2xhcmF0aW9uO1xuICAgICAgICB0aGlzLmRlY2xhcmF0aW9ucyA9IGRlY2xhcmF0aW9ucztcbiAgICAgICAgdGhpcy5raW5kID0ga2luZDtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBWYXJpYWJsZURlY2xhcmF0b3Ige1xuICAgIHJlYWRvbmx5IHR5cGU6IHN0cmluZztcbiAgICByZWFkb25seSBpZDogQmluZGluZ0lkZW50aWZpZXIgfCBCaW5kaW5nUGF0dGVybjtcbiAgICByZWFkb25seSBpbml0OiBFeHByZXNzaW9uIHwgbnVsbDtcbiAgICBjb25zdHJ1Y3RvcihpZDogQmluZGluZ0lkZW50aWZpZXIgfCBCaW5kaW5nUGF0dGVybiwgaW5pdDogRXhwcmVzc2lvbiB8IG51bGwpIHtcbiAgICAgICAgdGhpcy50eXBlID0gU3ludGF4LlZhcmlhYmxlRGVjbGFyYXRvcjtcbiAgICAgICAgdGhpcy5pZCA9IGlkO1xuICAgICAgICB0aGlzLmluaXQgPSBpbml0O1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIFdoaWxlU3RhdGVtZW50IHtcbiAgICByZWFkb25seSB0eXBlOiBzdHJpbmc7XG4gICAgcmVhZG9ubHkgdGVzdDogRXhwcmVzc2lvbjtcbiAgICByZWFkb25seSBib2R5OiBTdGF0ZW1lbnQ7XG4gICAgY29uc3RydWN0b3IodGVzdDogRXhwcmVzc2lvbiwgYm9keTogU3RhdGVtZW50KSB7XG4gICAgICAgIHRoaXMudHlwZSA9IFN5bnRheC5XaGlsZVN0YXRlbWVudDtcbiAgICAgICAgdGhpcy50ZXN0ID0gdGVzdDtcbiAgICAgICAgdGhpcy5ib2R5ID0gYm9keTtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBXaXRoU3RhdGVtZW50IHtcbiAgICByZWFkb25seSB0eXBlOiBzdHJpbmc7XG4gICAgcmVhZG9ubHkgb2JqZWN0OiBFeHByZXNzaW9uO1xuICAgIHJlYWRvbmx5IGJvZHk6IFN0YXRlbWVudDtcbiAgICBjb25zdHJ1Y3RvcihvYmplY3Q6IEV4cHJlc3Npb24sIGJvZHk6IFN0YXRlbWVudCkge1xuICAgICAgICB0aGlzLnR5cGUgPSBTeW50YXguV2l0aFN0YXRlbWVudDtcbiAgICAgICAgdGhpcy5vYmplY3QgPSBvYmplY3Q7XG4gICAgICAgIHRoaXMuYm9keSA9IGJvZHk7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgWWllbGRFeHByZXNzaW9uIHtcbiAgICByZWFkb25seSB0eXBlOiBzdHJpbmc7XG4gICAgcmVhZG9ubHkgYXJndW1lbnQ6IEV4cHJlc3Npb24gfCBudWxsO1xuICAgIHJlYWRvbmx5IGRlbGVnYXRlOiBib29sZWFuO1xuICAgIGNvbnN0cnVjdG9yKGFyZ3VtZW50OiBFeHByZXNzaW9uIHwgbnVsbCwgZGVsZWdhdGU6IGJvb2xlYW4pIHtcbiAgICAgICAgdGhpcy50eXBlID0gU3ludGF4LllpZWxkRXhwcmVzc2lvbjtcbiAgICAgICAgdGhpcy5hcmd1bWVudCA9IGFyZ3VtZW50O1xuICAgICAgICB0aGlzLmRlbGVnYXRlID0gZGVsZWdhdGU7XG4gICAgfVxufSJdfQ==