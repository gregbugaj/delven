// "YieldExpression"
function* f2() {
    // Flow has a bug parsing it.
    // class a extends (yield 1) {}
  }