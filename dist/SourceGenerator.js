"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _ASTVisitor = _interopRequireDefault(require("./ASTVisitor"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Source generator to transform valid AST back into ECMAScript
 */
class SourceGenerator extends _ASTVisitor.default {
  constructor() {
    super();
  }
  /**
   * Convert ASTNode back into sourcecode representation
   * 
   * @param node 
   */


  toSource(node) {}

  toString() {
    return "Generated";
  }

}

exports.default = SourceGenerator;

class ExplicitASTNodeVisitor {
  constructor() {}

}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9Tb3VyY2VHZW5lcmF0b3IudHMiXSwibmFtZXMiOlsiU291cmNlR2VuZXJhdG9yIiwiQVNUVmlzaXRvciIsImNvbnN0cnVjdG9yIiwidG9Tb3VyY2UiLCJub2RlIiwidG9TdHJpbmciLCJFeHBsaWNpdEFTVE5vZGVWaXNpdG9yIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7Ozs7QUFHQTs7O0FBR2UsTUFBTUEsZUFBTixTQUE4QkMsbUJBQTlCLENBQXlDO0FBRXBEQyxFQUFBQSxXQUFXLEdBQUc7QUFDVjtBQUNIO0FBRUQ7Ozs7Ozs7QUFLT0MsRUFBQUEsUUFBUCxDQUFnQkMsSUFBaEIsRUFBcUMsQ0FFcEM7O0FBRURDLEVBQUFBLFFBQVEsR0FBRztBQUNQLFdBQU8sV0FBUDtBQUNIOztBQWpCbUQ7Ozs7QUFxQnhELE1BQU1DLHNCQUFOLENBQThCO0FBQzFCSixFQUFBQSxXQUFXLEdBQUcsQ0FDYjs7QUFGeUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQVNUVmlzaXRvciBmcm9tIFwiLi9BU1RWaXNpdG9yXCI7XG5pbXBvcnQgQVNUTm9kZSBmcm9tIFwiLi9BU1ROb2RlXCI7XG5cbi8qKlxuICogU291cmNlIGdlbmVyYXRvciB0byB0cmFuc2Zvcm0gdmFsaWQgQVNUIGJhY2sgaW50byBFQ01BU2NyaXB0XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNvdXJjZUdlbmVyYXRvciBleHRlbmRzIEFTVFZpc2l0b3Ige1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ29udmVydCBBU1ROb2RlIGJhY2sgaW50byBzb3VyY2Vjb2RlIHJlcHJlc2VudGF0aW9uXG4gICAgICogXG4gICAgICogQHBhcmFtIG5vZGUgXG4gICAgICovXG4gICAgcHVibGljIHRvU291cmNlKG5vZGU6IEFTVE5vZGUpOiB2b2lkIHtcbiAgICAgICAgXG4gICAgfVxuXG4gICAgdG9TdHJpbmcoKSB7XG4gICAgICAgIHJldHVybiBcIkdlbmVyYXRlZFwiO1xuICAgIH1cbn1cblxuXG5jbGFzcyBFeHBsaWNpdEFTVE5vZGVWaXNpdG9yICB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgfVxufSJdfQ==