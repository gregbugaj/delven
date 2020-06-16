"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Syntax = void 0;

/**
 *  https://github.com/jquery/esprima/blob/master/src/syntax.ts
 */
const Syntax = {
  AssignmentExpression: 'AssignmentExpression',
  AssignmentPattern: 'AssignmentPattern',
  ArrayExpression: 'ArrayExpression',
  ArrayPattern: 'ArrayPattern',
  ArrowFunctionExpression: 'ArrowFunctionExpression',
  AwaitExpression: 'AwaitExpression',
  BlockStatement: 'BlockStatement',
  BinaryExpression: 'BinaryExpression',
  BreakStatement: 'BreakStatement',
  CallExpression: 'CallExpression',
  CatchClause: 'CatchClause',
  ClassBody: 'ClassBody',
  ClassDeclaration: 'ClassDeclaration',
  ClassExpression: 'ClassExpression',
  ConditionalExpression: 'ConditionalExpression',
  ContinueStatement: 'ContinueStatement',
  DoWhileStatement: 'DoWhileStatement',
  DebuggerStatement: 'DebuggerStatement',
  EmptyStatement: 'EmptyStatement',
  ExportAllDeclaration: 'ExportAllDeclaration',
  ExportDefaultDeclaration: 'ExportDefaultDeclaration',
  ExportNamedDeclaration: 'ExportNamedDeclaration',
  ExportSpecifier: 'ExportSpecifier',
  ExpressionStatement: 'ExpressionStatement',
  ForStatement: 'ForStatement',
  ForOfStatement: 'ForOfStatement',
  ForInStatement: 'ForInStatement',
  FunctionDeclaration: 'FunctionDeclaration',
  FunctionExpression: 'FunctionExpression',
  Identifier: 'Identifier',
  IfStatement: 'IfStatement',
  Import: 'Import',
  ImportDeclaration: 'ImportDeclaration',
  ImportDefaultSpecifier: 'ImportDefaultSpecifier',
  ImportNamespaceSpecifier: 'ImportNamespaceSpecifier',
  ImportSpecifier: 'ImportSpecifier',
  Literal: 'Literal',
  LabeledStatement: 'LabeledStatement',
  LogicalExpression: 'LogicalExpression',
  MemberExpression: 'MemberExpression',
  MetaProperty: 'MetaProperty',
  MethodDefinition: 'MethodDefinition',
  NewExpression: 'NewExpression',
  ObjectExpression: 'ObjectExpression',
  ObjectPattern: 'ObjectPattern',
  Program: 'Program',
  Property: 'Property',
  RestElement: 'RestElement',
  ReturnStatement: 'ReturnStatement',
  SequenceExpression: 'SequenceExpression',
  SpreadElement: 'SpreadElement',
  Super: 'Super',
  SwitchCase: 'SwitchCase',
  SwitchStatement: 'SwitchStatement',
  TaggedTemplateExpression: 'TaggedTemplateExpression',
  TemplateElement: 'TemplateElement',
  TemplateLiteral: 'TemplateLiteral',
  ThisExpression: 'ThisExpression',
  ThrowStatement: 'ThrowStatement',
  TryStatement: 'TryStatement',
  UnaryExpression: 'UnaryExpression',
  UpdateExpression: 'UpdateExpression',
  VariableDeclaration: 'VariableDeclaration',
  VariableDeclarator: 'VariableDeclarator',
  WhileStatement: 'WhileStatement',
  WithStatement: 'WithStatement',
  YieldExpression: 'YieldExpression'
};
exports.Syntax = Syntax;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9zeW50YXgudHMiXSwibmFtZXMiOlsiU3ludGF4IiwiQXNzaWdubWVudEV4cHJlc3Npb24iLCJBc3NpZ25tZW50UGF0dGVybiIsIkFycmF5RXhwcmVzc2lvbiIsIkFycmF5UGF0dGVybiIsIkFycm93RnVuY3Rpb25FeHByZXNzaW9uIiwiQXdhaXRFeHByZXNzaW9uIiwiQmxvY2tTdGF0ZW1lbnQiLCJCaW5hcnlFeHByZXNzaW9uIiwiQnJlYWtTdGF0ZW1lbnQiLCJDYWxsRXhwcmVzc2lvbiIsIkNhdGNoQ2xhdXNlIiwiQ2xhc3NCb2R5IiwiQ2xhc3NEZWNsYXJhdGlvbiIsIkNsYXNzRXhwcmVzc2lvbiIsIkNvbmRpdGlvbmFsRXhwcmVzc2lvbiIsIkNvbnRpbnVlU3RhdGVtZW50IiwiRG9XaGlsZVN0YXRlbWVudCIsIkRlYnVnZ2VyU3RhdGVtZW50IiwiRW1wdHlTdGF0ZW1lbnQiLCJFeHBvcnRBbGxEZWNsYXJhdGlvbiIsIkV4cG9ydERlZmF1bHREZWNsYXJhdGlvbiIsIkV4cG9ydE5hbWVkRGVjbGFyYXRpb24iLCJFeHBvcnRTcGVjaWZpZXIiLCJFeHByZXNzaW9uU3RhdGVtZW50IiwiRm9yU3RhdGVtZW50IiwiRm9yT2ZTdGF0ZW1lbnQiLCJGb3JJblN0YXRlbWVudCIsIkZ1bmN0aW9uRGVjbGFyYXRpb24iLCJGdW5jdGlvbkV4cHJlc3Npb24iLCJJZGVudGlmaWVyIiwiSWZTdGF0ZW1lbnQiLCJJbXBvcnQiLCJJbXBvcnREZWNsYXJhdGlvbiIsIkltcG9ydERlZmF1bHRTcGVjaWZpZXIiLCJJbXBvcnROYW1lc3BhY2VTcGVjaWZpZXIiLCJJbXBvcnRTcGVjaWZpZXIiLCJMaXRlcmFsIiwiTGFiZWxlZFN0YXRlbWVudCIsIkxvZ2ljYWxFeHByZXNzaW9uIiwiTWVtYmVyRXhwcmVzc2lvbiIsIk1ldGFQcm9wZXJ0eSIsIk1ldGhvZERlZmluaXRpb24iLCJOZXdFeHByZXNzaW9uIiwiT2JqZWN0RXhwcmVzc2lvbiIsIk9iamVjdFBhdHRlcm4iLCJQcm9ncmFtIiwiUHJvcGVydHkiLCJSZXN0RWxlbWVudCIsIlJldHVyblN0YXRlbWVudCIsIlNlcXVlbmNlRXhwcmVzc2lvbiIsIlNwcmVhZEVsZW1lbnQiLCJTdXBlciIsIlN3aXRjaENhc2UiLCJTd2l0Y2hTdGF0ZW1lbnQiLCJUYWdnZWRUZW1wbGF0ZUV4cHJlc3Npb24iLCJUZW1wbGF0ZUVsZW1lbnQiLCJUZW1wbGF0ZUxpdGVyYWwiLCJUaGlzRXhwcmVzc2lvbiIsIlRocm93U3RhdGVtZW50IiwiVHJ5U3RhdGVtZW50IiwiVW5hcnlFeHByZXNzaW9uIiwiVXBkYXRlRXhwcmVzc2lvbiIsIlZhcmlhYmxlRGVjbGFyYXRpb24iLCJWYXJpYWJsZURlY2xhcmF0b3IiLCJXaGlsZVN0YXRlbWVudCIsIldpdGhTdGF0ZW1lbnQiLCJZaWVsZEV4cHJlc3Npb24iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7O0FBR08sTUFBTUEsTUFBTSxHQUFHO0FBQ2xCQyxFQUFBQSxvQkFBb0IsRUFBRSxzQkFESjtBQUVsQkMsRUFBQUEsaUJBQWlCLEVBQUUsbUJBRkQ7QUFHbEJDLEVBQUFBLGVBQWUsRUFBRSxpQkFIQztBQUlsQkMsRUFBQUEsWUFBWSxFQUFFLGNBSkk7QUFLbEJDLEVBQUFBLHVCQUF1QixFQUFFLHlCQUxQO0FBTWxCQyxFQUFBQSxlQUFlLEVBQUUsaUJBTkM7QUFPbEJDLEVBQUFBLGNBQWMsRUFBRSxnQkFQRTtBQVFsQkMsRUFBQUEsZ0JBQWdCLEVBQUUsa0JBUkE7QUFTbEJDLEVBQUFBLGNBQWMsRUFBRSxnQkFURTtBQVVsQkMsRUFBQUEsY0FBYyxFQUFFLGdCQVZFO0FBV2xCQyxFQUFBQSxXQUFXLEVBQUUsYUFYSztBQVlsQkMsRUFBQUEsU0FBUyxFQUFFLFdBWk87QUFhbEJDLEVBQUFBLGdCQUFnQixFQUFFLGtCQWJBO0FBY2xCQyxFQUFBQSxlQUFlLEVBQUUsaUJBZEM7QUFlbEJDLEVBQUFBLHFCQUFxQixFQUFFLHVCQWZMO0FBZ0JsQkMsRUFBQUEsaUJBQWlCLEVBQUUsbUJBaEJEO0FBaUJsQkMsRUFBQUEsZ0JBQWdCLEVBQUUsa0JBakJBO0FBa0JsQkMsRUFBQUEsaUJBQWlCLEVBQUUsbUJBbEJEO0FBbUJsQkMsRUFBQUEsY0FBYyxFQUFFLGdCQW5CRTtBQW9CbEJDLEVBQUFBLG9CQUFvQixFQUFFLHNCQXBCSjtBQXFCbEJDLEVBQUFBLHdCQUF3QixFQUFFLDBCQXJCUjtBQXNCbEJDLEVBQUFBLHNCQUFzQixFQUFFLHdCQXRCTjtBQXVCbEJDLEVBQUFBLGVBQWUsRUFBRSxpQkF2QkM7QUF3QmxCQyxFQUFBQSxtQkFBbUIsRUFBRSxxQkF4Qkg7QUF5QmxCQyxFQUFBQSxZQUFZLEVBQUUsY0F6Qkk7QUEwQmxCQyxFQUFBQSxjQUFjLEVBQUUsZ0JBMUJFO0FBMkJsQkMsRUFBQUEsY0FBYyxFQUFFLGdCQTNCRTtBQTRCbEJDLEVBQUFBLG1CQUFtQixFQUFFLHFCQTVCSDtBQTZCbEJDLEVBQUFBLGtCQUFrQixFQUFFLG9CQTdCRjtBQThCbEJDLEVBQUFBLFVBQVUsRUFBRSxZQTlCTTtBQStCbEJDLEVBQUFBLFdBQVcsRUFBRSxhQS9CSztBQWdDbEJDLEVBQUFBLE1BQU0sRUFBRSxRQWhDVTtBQWlDbEJDLEVBQUFBLGlCQUFpQixFQUFFLG1CQWpDRDtBQWtDbEJDLEVBQUFBLHNCQUFzQixFQUFFLHdCQWxDTjtBQW1DbEJDLEVBQUFBLHdCQUF3QixFQUFFLDBCQW5DUjtBQW9DbEJDLEVBQUFBLGVBQWUsRUFBRSxpQkFwQ0M7QUFxQ2xCQyxFQUFBQSxPQUFPLEVBQUUsU0FyQ1M7QUFzQ2xCQyxFQUFBQSxnQkFBZ0IsRUFBRSxrQkF0Q0E7QUF1Q2xCQyxFQUFBQSxpQkFBaUIsRUFBRSxtQkF2Q0Q7QUF3Q2xCQyxFQUFBQSxnQkFBZ0IsRUFBRSxrQkF4Q0E7QUF5Q2xCQyxFQUFBQSxZQUFZLEVBQUUsY0F6Q0k7QUEwQ2xCQyxFQUFBQSxnQkFBZ0IsRUFBRSxrQkExQ0E7QUEyQ2xCQyxFQUFBQSxhQUFhLEVBQUUsZUEzQ0c7QUE0Q2xCQyxFQUFBQSxnQkFBZ0IsRUFBRSxrQkE1Q0E7QUE2Q2xCQyxFQUFBQSxhQUFhLEVBQUUsZUE3Q0c7QUE4Q2xCQyxFQUFBQSxPQUFPLEVBQUUsU0E5Q1M7QUErQ2xCQyxFQUFBQSxRQUFRLEVBQUUsVUEvQ1E7QUFnRGxCQyxFQUFBQSxXQUFXLEVBQUUsYUFoREs7QUFpRGxCQyxFQUFBQSxlQUFlLEVBQUUsaUJBakRDO0FBa0RsQkMsRUFBQUEsa0JBQWtCLEVBQUUsb0JBbERGO0FBbURsQkMsRUFBQUEsYUFBYSxFQUFFLGVBbkRHO0FBb0RsQkMsRUFBQUEsS0FBSyxFQUFFLE9BcERXO0FBcURsQkMsRUFBQUEsVUFBVSxFQUFFLFlBckRNO0FBc0RsQkMsRUFBQUEsZUFBZSxFQUFFLGlCQXREQztBQXVEbEJDLEVBQUFBLHdCQUF3QixFQUFFLDBCQXZEUjtBQXdEbEJDLEVBQUFBLGVBQWUsRUFBRSxpQkF4REM7QUF5RGxCQyxFQUFBQSxlQUFlLEVBQUUsaUJBekRDO0FBMERsQkMsRUFBQUEsY0FBYyxFQUFFLGdCQTFERTtBQTJEbEJDLEVBQUFBLGNBQWMsRUFBRSxnQkEzREU7QUE0RGxCQyxFQUFBQSxZQUFZLEVBQUUsY0E1REk7QUE2RGxCQyxFQUFBQSxlQUFlLEVBQUUsaUJBN0RDO0FBOERsQkMsRUFBQUEsZ0JBQWdCLEVBQUUsa0JBOURBO0FBK0RsQkMsRUFBQUEsbUJBQW1CLEVBQUUscUJBL0RIO0FBZ0VsQkMsRUFBQUEsa0JBQWtCLEVBQUUsb0JBaEVGO0FBaUVsQkMsRUFBQUEsY0FBYyxFQUFFLGdCQWpFRTtBQWtFbEJDLEVBQUFBLGFBQWEsRUFBRSxlQWxFRztBQW1FbEJDLEVBQUFBLGVBQWUsRUFBRTtBQW5FQyxDQUFmIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiAgaHR0cHM6Ly9naXRodWIuY29tL2pxdWVyeS9lc3ByaW1hL2Jsb2IvbWFzdGVyL3NyYy9zeW50YXgudHNcbiAqL1xuZXhwb3J0IGNvbnN0IFN5bnRheCA9IHtcbiAgICBBc3NpZ25tZW50RXhwcmVzc2lvbjogJ0Fzc2lnbm1lbnRFeHByZXNzaW9uJyxcbiAgICBBc3NpZ25tZW50UGF0dGVybjogJ0Fzc2lnbm1lbnRQYXR0ZXJuJyxcbiAgICBBcnJheUV4cHJlc3Npb246ICdBcnJheUV4cHJlc3Npb24nLFxuICAgIEFycmF5UGF0dGVybjogJ0FycmF5UGF0dGVybicsXG4gICAgQXJyb3dGdW5jdGlvbkV4cHJlc3Npb246ICdBcnJvd0Z1bmN0aW9uRXhwcmVzc2lvbicsXG4gICAgQXdhaXRFeHByZXNzaW9uOiAnQXdhaXRFeHByZXNzaW9uJyxcbiAgICBCbG9ja1N0YXRlbWVudDogJ0Jsb2NrU3RhdGVtZW50JyxcbiAgICBCaW5hcnlFeHByZXNzaW9uOiAnQmluYXJ5RXhwcmVzc2lvbicsXG4gICAgQnJlYWtTdGF0ZW1lbnQ6ICdCcmVha1N0YXRlbWVudCcsXG4gICAgQ2FsbEV4cHJlc3Npb246ICdDYWxsRXhwcmVzc2lvbicsXG4gICAgQ2F0Y2hDbGF1c2U6ICdDYXRjaENsYXVzZScsXG4gICAgQ2xhc3NCb2R5OiAnQ2xhc3NCb2R5JyxcbiAgICBDbGFzc0RlY2xhcmF0aW9uOiAnQ2xhc3NEZWNsYXJhdGlvbicsXG4gICAgQ2xhc3NFeHByZXNzaW9uOiAnQ2xhc3NFeHByZXNzaW9uJyxcbiAgICBDb25kaXRpb25hbEV4cHJlc3Npb246ICdDb25kaXRpb25hbEV4cHJlc3Npb24nLFxuICAgIENvbnRpbnVlU3RhdGVtZW50OiAnQ29udGludWVTdGF0ZW1lbnQnLFxuICAgIERvV2hpbGVTdGF0ZW1lbnQ6ICdEb1doaWxlU3RhdGVtZW50JyxcbiAgICBEZWJ1Z2dlclN0YXRlbWVudDogJ0RlYnVnZ2VyU3RhdGVtZW50JyxcbiAgICBFbXB0eVN0YXRlbWVudDogJ0VtcHR5U3RhdGVtZW50JyxcbiAgICBFeHBvcnRBbGxEZWNsYXJhdGlvbjogJ0V4cG9ydEFsbERlY2xhcmF0aW9uJyxcbiAgICBFeHBvcnREZWZhdWx0RGVjbGFyYXRpb246ICdFeHBvcnREZWZhdWx0RGVjbGFyYXRpb24nLFxuICAgIEV4cG9ydE5hbWVkRGVjbGFyYXRpb246ICdFeHBvcnROYW1lZERlY2xhcmF0aW9uJyxcbiAgICBFeHBvcnRTcGVjaWZpZXI6ICdFeHBvcnRTcGVjaWZpZXInLFxuICAgIEV4cHJlc3Npb25TdGF0ZW1lbnQ6ICdFeHByZXNzaW9uU3RhdGVtZW50JyxcbiAgICBGb3JTdGF0ZW1lbnQ6ICdGb3JTdGF0ZW1lbnQnLFxuICAgIEZvck9mU3RhdGVtZW50OiAnRm9yT2ZTdGF0ZW1lbnQnLFxuICAgIEZvckluU3RhdGVtZW50OiAnRm9ySW5TdGF0ZW1lbnQnLFxuICAgIEZ1bmN0aW9uRGVjbGFyYXRpb246ICdGdW5jdGlvbkRlY2xhcmF0aW9uJyxcbiAgICBGdW5jdGlvbkV4cHJlc3Npb246ICdGdW5jdGlvbkV4cHJlc3Npb24nLFxuICAgIElkZW50aWZpZXI6ICdJZGVudGlmaWVyJyxcbiAgICBJZlN0YXRlbWVudDogJ0lmU3RhdGVtZW50JyxcbiAgICBJbXBvcnQ6ICdJbXBvcnQnLFxuICAgIEltcG9ydERlY2xhcmF0aW9uOiAnSW1wb3J0RGVjbGFyYXRpb24nLFxuICAgIEltcG9ydERlZmF1bHRTcGVjaWZpZXI6ICdJbXBvcnREZWZhdWx0U3BlY2lmaWVyJyxcbiAgICBJbXBvcnROYW1lc3BhY2VTcGVjaWZpZXI6ICdJbXBvcnROYW1lc3BhY2VTcGVjaWZpZXInLFxuICAgIEltcG9ydFNwZWNpZmllcjogJ0ltcG9ydFNwZWNpZmllcicsXG4gICAgTGl0ZXJhbDogJ0xpdGVyYWwnLFxuICAgIExhYmVsZWRTdGF0ZW1lbnQ6ICdMYWJlbGVkU3RhdGVtZW50JyxcbiAgICBMb2dpY2FsRXhwcmVzc2lvbjogJ0xvZ2ljYWxFeHByZXNzaW9uJyxcbiAgICBNZW1iZXJFeHByZXNzaW9uOiAnTWVtYmVyRXhwcmVzc2lvbicsXG4gICAgTWV0YVByb3BlcnR5OiAnTWV0YVByb3BlcnR5JyxcbiAgICBNZXRob2REZWZpbml0aW9uOiAnTWV0aG9kRGVmaW5pdGlvbicsXG4gICAgTmV3RXhwcmVzc2lvbjogJ05ld0V4cHJlc3Npb24nLFxuICAgIE9iamVjdEV4cHJlc3Npb246ICdPYmplY3RFeHByZXNzaW9uJyxcbiAgICBPYmplY3RQYXR0ZXJuOiAnT2JqZWN0UGF0dGVybicsXG4gICAgUHJvZ3JhbTogJ1Byb2dyYW0nLFxuICAgIFByb3BlcnR5OiAnUHJvcGVydHknLFxuICAgIFJlc3RFbGVtZW50OiAnUmVzdEVsZW1lbnQnLFxuICAgIFJldHVyblN0YXRlbWVudDogJ1JldHVyblN0YXRlbWVudCcsXG4gICAgU2VxdWVuY2VFeHByZXNzaW9uOiAnU2VxdWVuY2VFeHByZXNzaW9uJyxcbiAgICBTcHJlYWRFbGVtZW50OiAnU3ByZWFkRWxlbWVudCcsXG4gICAgU3VwZXI6ICdTdXBlcicsXG4gICAgU3dpdGNoQ2FzZTogJ1N3aXRjaENhc2UnLFxuICAgIFN3aXRjaFN0YXRlbWVudDogJ1N3aXRjaFN0YXRlbWVudCcsXG4gICAgVGFnZ2VkVGVtcGxhdGVFeHByZXNzaW9uOiAnVGFnZ2VkVGVtcGxhdGVFeHByZXNzaW9uJyxcbiAgICBUZW1wbGF0ZUVsZW1lbnQ6ICdUZW1wbGF0ZUVsZW1lbnQnLFxuICAgIFRlbXBsYXRlTGl0ZXJhbDogJ1RlbXBsYXRlTGl0ZXJhbCcsXG4gICAgVGhpc0V4cHJlc3Npb246ICdUaGlzRXhwcmVzc2lvbicsXG4gICAgVGhyb3dTdGF0ZW1lbnQ6ICdUaHJvd1N0YXRlbWVudCcsXG4gICAgVHJ5U3RhdGVtZW50OiAnVHJ5U3RhdGVtZW50JyxcbiAgICBVbmFyeUV4cHJlc3Npb246ICdVbmFyeUV4cHJlc3Npb24nLFxuICAgIFVwZGF0ZUV4cHJlc3Npb246ICdVcGRhdGVFeHByZXNzaW9uJyxcbiAgICBWYXJpYWJsZURlY2xhcmF0aW9uOiAnVmFyaWFibGVEZWNsYXJhdGlvbicsXG4gICAgVmFyaWFibGVEZWNsYXJhdG9yOiAnVmFyaWFibGVEZWNsYXJhdG9yJyxcbiAgICBXaGlsZVN0YXRlbWVudDogJ1doaWxlU3RhdGVtZW50JyxcbiAgICBXaXRoU3RhdGVtZW50OiAnV2l0aFN0YXRlbWVudCcsXG4gICAgWWllbGRFeHByZXNzaW9uOiAnWWllbGRFeHByZXNzaW9uJ1xufTsiXX0=