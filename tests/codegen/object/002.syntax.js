// FunctionExpression , both should be equivalent
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer

//ES5 
// let x = {  fn1 : function(x, y) {return xyz;} }

//ES6 
//let x = {  fn1(x, y) {return xyz;} }
let x = { x:1,  tt: ()=>{ console.info('')} }


let object = {
    foo: 'bar',
    age: 42,
    baz: {myProp: 12}
  }