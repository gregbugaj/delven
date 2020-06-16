"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/**
 * Base class for AST node types
 */
class ASTNode {
  /**
   * Visits this node and its children in an arbitrary order.
   * @param visitor 
   */
  visit(visitor) {
    visitor.visit(this);
  }

}

exports.default = ASTNode;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9BU1ROb2RlLnRzIl0sIm5hbWVzIjpbIkFTVE5vZGUiLCJ2aXNpdCIsInZpc2l0b3IiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFFQTs7O0FBR2UsTUFBZUEsT0FBZixDQUF1QjtBQUNsQzs7OztBQUlBQyxFQUFBQSxLQUFLLENBQUNDLE9BQUQsRUFBNEI7QUFDN0JBLElBQUFBLE9BQU8sQ0FBQ0QsS0FBUixDQUFjLElBQWQ7QUFDSDs7QUFQaUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQVNUVmlzaXRvciBmcm9tIFwiLi9BU1RWaXNpdG9yXCI7XG5cbi8qKlxuICogQmFzZSBjbGFzcyBmb3IgQVNUIG5vZGUgdHlwZXNcbiAqL1xuZXhwb3J0IGRlZmF1bHQgYWJzdHJhY3QgY2xhc3MgQVNUTm9kZSB7XG4gICAgLyoqXG4gICAgICogVmlzaXRzIHRoaXMgbm9kZSBhbmQgaXRzIGNoaWxkcmVuIGluIGFuIGFyYml0cmFyeSBvcmRlci5cbiAgICAgKiBAcGFyYW0gdmlzaXRvciBcbiAgICAgKi9cbiAgICB2aXNpdCh2aXNpdG9yOiBBU1RWaXNpdG9yKTogdm9pZCB7XG4gICAgICAgIHZpc2l0b3IudmlzaXQodGhpcyk7XG4gICAgfVxufSJdfQ==