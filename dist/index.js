"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ASTParser = _interopRequireDefault(require("./ASTParser"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let toJson = obj => JSON.stringify(obj, function replacer(key, value) {
  return value;
});

console.info('Transpiller');
let input1 = "1";
let input2 = "var x = function(y, z) { console.info('this is a string') ; }";
let input3 = "var x =  2 + 4";
/*
        {
        true 
        false
        "true"
        }
 */
//let astparser = ASTParser.parse({ type: "code", value: "source" }, ParserType.ECMAScript);
// let ast = ASTParser.parse({ type: "code", value: "{ var x = 1;   var x = 2; }" });
// let ast = ASTParser.parse({ type: "code", value: "{ {  } }" });
//let ast = ASTParser.parse({ type: "code", value: "{  x = 1 }" });
//let ast = ASTParser.parse({ type: "code", value: "{ { 1, true, 'A'} }" });
// let ast = ASTParser.parse({ type: "code", value: "true, 1, 'A', \"X\"" });
//let ast = ASTParser.parse({ type: "code", value: "x = 1" });
//  let ast = ASTParser.parse({ type: "code", value: " 1, true, 'A' "});
//let ast = ASTParser.parse({ type: "code", value: " 1.2 ,true, \"Text\""});
// let ast = ASTParser.parse({ type: "code", value: " function AA(x, y){}  function BB(x, y){} "});
// let ast = ASTParser.parse({ type: "code", value: "(1 + 1)"});
//let ast = ASTParser.parse({ type: "code", value: "1 + 2"});
//let ast = ASTParser.parse({ type: "code", value: "x / 2"});
// let ast = ASTParser.parse({ type: "code", value: "x / 1  + 1"});
//let ast = ASTParser.parse({ type: "code", value: "x + 1 + 1"});
//let ast = ASTParser.parse({ type: "code", value: "y = x + 1 + 1"});
/////..let ast = ASTParser.parse({ type: "code", value: "x = 1+2"});
// let ast = ASTParser.parse({ type: "code", value: "var x = 1 + 1"});
// let ast = ASTParser.parse({ type: "code", value: "x = [x, 2 + 1]"});
// let ast = ASTParser.parse({ type: "code", value: "[1, 2, 3,,,,]"});
//let ast = ASTParser.parse({ type: "code", value: "var x, y"});
//let ast = ASTParser.parse({ type: "code", value: 'x = {"A": 1, x:2}'});
//let ast = ASTParser.parse({ type: "code", value: '[11,,,]'});
// let ast = ASTParser.parse({ type: "code", value: 'var x = {"a":1}'});
//let ast = ASTParser.parse({ type: "code", value: 'var x = [1,2]'});
//let ast = ASTParser.parse({ type: "code", value: ' var x = [1, {}]'});
// let ast = ASTParser.parse({ type: "code", value: ' var x = [1, {"a":23, z:"abc"}]'});
// let ast = ASTParser.parse({ type: "code", value: '(1 + 1 )'});
// let ast = ASTParser.parse({ type: "code", value: ' x != 1 '});
//let ast = ASTParser.parse({ type: "code", value: ' if(x != 1){ }'});
// let ast = ASTParser.parse({ type: "code", value: ' if(x){ }'});
//let ast = ASTParser.parse({ type: "code", value: ' if(x != 1){ } else {} '});
//let ast = ASTParser.parse({ type: "code", value: ' if(x != 1){ } else if (x == 2) {}'});
//let ast = ASTParser.parse({ type: "code", value: ' if(x != 1){ } else if (x == 2) {} else {}'});
// let ast = ASTParser.parse({ type: "code", value: ' x = y.z '});
//let ast = ASTParser.parse({ type: "code", value: ' x[1] '}); 

let ast = _ASTParser.default.parse({
  type: "code",
  value: ' x+=1 '
}); //let ast = ASTParser.parse({ type: "code", value: ' x+=y '});


console.info(toJson(ast)); //let generator = new SourceGenerator();
//generator.visit(ast);
// Trick to prevent  
// All files must be modules when the '--isolatedModules' flag is provided.ts(1208)
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC50cyJdLCJuYW1lcyI6WyJ0b0pzb24iLCJvYmoiLCJKU09OIiwic3RyaW5naWZ5IiwicmVwbGFjZXIiLCJrZXkiLCJ2YWx1ZSIsImNvbnNvbGUiLCJpbmZvIiwiaW5wdXQxIiwiaW5wdXQyIiwiaW5wdXQzIiwiYXN0IiwiQVNUUGFyc2VyIiwicGFyc2UiLCJ0eXBlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7OztBQUdBLElBQUlBLE1BQU0sR0FBSUMsR0FBRCxJQUFtQkMsSUFBSSxDQUFDQyxTQUFMLENBQWVGLEdBQWYsRUFBb0IsU0FBU0csUUFBVCxDQUFrQkMsR0FBbEIsRUFBdUJDLEtBQXZCLEVBQThCO0FBQUUsU0FBT0EsS0FBUDtBQUFhLENBQWpFLENBQWhDOztBQUVBQyxPQUFPLENBQUNDLElBQVIsQ0FBYSxhQUFiO0FBQ0EsSUFBSUMsTUFBTSxHQUFHLEdBQWI7QUFDQSxJQUFJQyxNQUFNLEdBQUcsK0RBQWI7QUFDQSxJQUFJQyxNQUFNLEdBQUcsZ0JBQWI7QUFDQTs7Ozs7OztBQU9BO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQztBQUNEO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFDQSxJQUFJQyxHQUFHLEdBQUdDLG1CQUFVQyxLQUFWLENBQWdCO0FBQUVDLEVBQUFBLElBQUksRUFBRSxNQUFSO0FBQWdCVCxFQUFBQSxLQUFLLEVBQUU7QUFBdkIsQ0FBaEIsQ0FBVixDLENBQ0E7OztBQUNBQyxPQUFPLENBQUNDLElBQVIsQ0FBYVIsTUFBTSxDQUFDWSxHQUFELENBQW5CLEUsQ0FDQTtBQUNBO0FBRUE7QUFDQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBBU1RQYXJzZXIsIHsgUGFyc2VyVHlwZSB9IGZyb20gXCIuL0FTVFBhcnNlclwiXG5pbXBvcnQgU291cmNlR2VuZXJhdG9yIGZyb20gXCIuL1NvdXJjZUdlbmVyYXRvclwiO1xuXG5sZXQgdG9Kc29uID0gKG9iajphbnkpOiBzdHJpbmc9PkpTT04uc3RyaW5naWZ5KG9iaiwgZnVuY3Rpb24gcmVwbGFjZXIoa2V5LCB2YWx1ZSkgeyByZXR1cm4gdmFsdWV9KTtcblxuY29uc29sZS5pbmZvKCdUcmFuc3BpbGxlcicpO1xubGV0IGlucHV0MSA9IFwiMVwiXG5sZXQgaW5wdXQyID0gXCJ2YXIgeCA9IGZ1bmN0aW9uKHksIHopIHsgY29uc29sZS5pbmZvKCd0aGlzIGlzIGEgc3RyaW5nJykgOyB9XCJcbmxldCBpbnB1dDMgPSBcInZhciB4ID0gIDIgKyA0XCJcbi8qXG4gICAgICAgIHtcbiAgICAgICAgdHJ1ZSBcbiAgICAgICAgZmFsc2VcbiAgICAgICAgXCJ0cnVlXCJcbiAgICAgICAgfVxuICovXG4vL2xldCBhc3RwYXJzZXIgPSBBU1RQYXJzZXIucGFyc2UoeyB0eXBlOiBcImNvZGVcIiwgdmFsdWU6IFwic291cmNlXCIgfSwgUGFyc2VyVHlwZS5FQ01BU2NyaXB0KTtcbi8vIGxldCBhc3QgPSBBU1RQYXJzZXIucGFyc2UoeyB0eXBlOiBcImNvZGVcIiwgdmFsdWU6IFwieyB2YXIgeCA9IDE7ICAgdmFyIHggPSAyOyB9XCIgfSk7XG4vLyBsZXQgYXN0ID0gQVNUUGFyc2VyLnBhcnNlKHsgdHlwZTogXCJjb2RlXCIsIHZhbHVlOiBcInsgeyAgfSB9XCIgfSk7XG4vL2xldCBhc3QgPSBBU1RQYXJzZXIucGFyc2UoeyB0eXBlOiBcImNvZGVcIiwgdmFsdWU6IFwieyAgeCA9IDEgfVwiIH0pO1xuXG4vL2xldCBhc3QgPSBBU1RQYXJzZXIucGFyc2UoeyB0eXBlOiBcImNvZGVcIiwgdmFsdWU6IFwieyB7IDEsIHRydWUsICdBJ30gfVwiIH0pO1xuLy8gbGV0IGFzdCA9IEFTVFBhcnNlci5wYXJzZSh7IHR5cGU6IFwiY29kZVwiLCB2YWx1ZTogXCJ0cnVlLCAxLCAnQScsIFxcXCJYXFxcIlwiIH0pO1xuLy9sZXQgYXN0ID0gQVNUUGFyc2VyLnBhcnNlKHsgdHlwZTogXCJjb2RlXCIsIHZhbHVlOiBcInggPSAxXCIgfSk7XG4vLyAgbGV0IGFzdCA9IEFTVFBhcnNlci5wYXJzZSh7IHR5cGU6IFwiY29kZVwiLCB2YWx1ZTogXCIgMSwgdHJ1ZSwgJ0EnIFwifSk7XG4gLy9sZXQgYXN0ID0gQVNUUGFyc2VyLnBhcnNlKHsgdHlwZTogXCJjb2RlXCIsIHZhbHVlOiBcIiAxLjIgLHRydWUsIFxcXCJUZXh0XFxcIlwifSk7XG4vLyBsZXQgYXN0ID0gQVNUUGFyc2VyLnBhcnNlKHsgdHlwZTogXCJjb2RlXCIsIHZhbHVlOiBcIiBmdW5jdGlvbiBBQSh4LCB5KXt9ICBmdW5jdGlvbiBCQih4LCB5KXt9IFwifSk7XG5cbi8vIGxldCBhc3QgPSBBU1RQYXJzZXIucGFyc2UoeyB0eXBlOiBcImNvZGVcIiwgdmFsdWU6IFwiKDEgKyAxKVwifSk7XG4vL2xldCBhc3QgPSBBU1RQYXJzZXIucGFyc2UoeyB0eXBlOiBcImNvZGVcIiwgdmFsdWU6IFwiMSArIDJcIn0pO1xuLy9sZXQgYXN0ID0gQVNUUGFyc2VyLnBhcnNlKHsgdHlwZTogXCJjb2RlXCIsIHZhbHVlOiBcInggLyAyXCJ9KTtcbi8vIGxldCBhc3QgPSBBU1RQYXJzZXIucGFyc2UoeyB0eXBlOiBcImNvZGVcIiwgdmFsdWU6IFwieCAvIDEgICsgMVwifSk7XG4vL2xldCBhc3QgPSBBU1RQYXJzZXIucGFyc2UoeyB0eXBlOiBcImNvZGVcIiwgdmFsdWU6IFwieCArIDEgKyAxXCJ9KTtcbi8vbGV0IGFzdCA9IEFTVFBhcnNlci5wYXJzZSh7IHR5cGU6IFwiY29kZVwiLCB2YWx1ZTogXCJ5ID0geCArIDEgKyAxXCJ9KTtcbi8vLy8vLi5sZXQgYXN0ID0gQVNUUGFyc2VyLnBhcnNlKHsgdHlwZTogXCJjb2RlXCIsIHZhbHVlOiBcInggPSAxKzJcIn0pO1xuLy8gbGV0IGFzdCA9IEFTVFBhcnNlci5wYXJzZSh7IHR5cGU6IFwiY29kZVwiLCB2YWx1ZTogXCJ2YXIgeCA9IDEgKyAxXCJ9KTtcbi8vIGxldCBhc3QgPSBBU1RQYXJzZXIucGFyc2UoeyB0eXBlOiBcImNvZGVcIiwgdmFsdWU6IFwieCA9IFt4LCAyICsgMV1cIn0pO1xuLy8gbGV0IGFzdCA9IEFTVFBhcnNlci5wYXJzZSh7IHR5cGU6IFwiY29kZVwiLCB2YWx1ZTogXCJbMSwgMiwgMywsLCxdXCJ9KTtcbi8vbGV0IGFzdCA9IEFTVFBhcnNlci5wYXJzZSh7IHR5cGU6IFwiY29kZVwiLCB2YWx1ZTogXCJ2YXIgeCwgeVwifSk7XG4vL2xldCBhc3QgPSBBU1RQYXJzZXIucGFyc2UoeyB0eXBlOiBcImNvZGVcIiwgdmFsdWU6ICd4ID0ge1wiQVwiOiAxLCB4OjJ9J30pO1xuLy9sZXQgYXN0ID0gQVNUUGFyc2VyLnBhcnNlKHsgdHlwZTogXCJjb2RlXCIsIHZhbHVlOiAnWzExLCwsXSd9KTtcbi8vIGxldCBhc3QgPSBBU1RQYXJzZXIucGFyc2UoeyB0eXBlOiBcImNvZGVcIiwgdmFsdWU6ICd2YXIgeCA9IHtcImFcIjoxfSd9KTtcbi8vbGV0IGFzdCA9IEFTVFBhcnNlci5wYXJzZSh7IHR5cGU6IFwiY29kZVwiLCB2YWx1ZTogJ3ZhciB4ID0gWzEsMl0nfSk7XG4vL2xldCBhc3QgPSBBU1RQYXJzZXIucGFyc2UoeyB0eXBlOiBcImNvZGVcIiwgdmFsdWU6ICcgdmFyIHggPSBbMSwge31dJ30pO1xuLy8gbGV0IGFzdCA9IEFTVFBhcnNlci5wYXJzZSh7IHR5cGU6IFwiY29kZVwiLCB2YWx1ZTogJyB2YXIgeCA9IFsxLCB7XCJhXCI6MjMsIHo6XCJhYmNcIn1dJ30pO1xuIC8vIGxldCBhc3QgPSBBU1RQYXJzZXIucGFyc2UoeyB0eXBlOiBcImNvZGVcIiwgdmFsdWU6ICcoMSArIDEgKSd9KTtcbi8vIGxldCBhc3QgPSBBU1RQYXJzZXIucGFyc2UoeyB0eXBlOiBcImNvZGVcIiwgdmFsdWU6ICcgeCAhPSAxICd9KTtcbi8vbGV0IGFzdCA9IEFTVFBhcnNlci5wYXJzZSh7IHR5cGU6IFwiY29kZVwiLCB2YWx1ZTogJyBpZih4ICE9IDEpeyB9J30pO1xuLy8gbGV0IGFzdCA9IEFTVFBhcnNlci5wYXJzZSh7IHR5cGU6IFwiY29kZVwiLCB2YWx1ZTogJyBpZih4KXsgfSd9KTtcbi8vbGV0IGFzdCA9IEFTVFBhcnNlci5wYXJzZSh7IHR5cGU6IFwiY29kZVwiLCB2YWx1ZTogJyBpZih4ICE9IDEpeyB9IGVsc2Uge30gJ30pO1xuLy9sZXQgYXN0ID0gQVNUUGFyc2VyLnBhcnNlKHsgdHlwZTogXCJjb2RlXCIsIHZhbHVlOiAnIGlmKHggIT0gMSl7IH0gZWxzZSBpZiAoeCA9PSAyKSB7fSd9KTtcbi8vbGV0IGFzdCA9IEFTVFBhcnNlci5wYXJzZSh7IHR5cGU6IFwiY29kZVwiLCB2YWx1ZTogJyBpZih4ICE9IDEpeyB9IGVsc2UgaWYgKHggPT0gMikge30gZWxzZSB7fSd9KTtcbi8vIGxldCBhc3QgPSBBU1RQYXJzZXIucGFyc2UoeyB0eXBlOiBcImNvZGVcIiwgdmFsdWU6ICcgeCA9IHkueiAnfSk7XG4vL2xldCBhc3QgPSBBU1RQYXJzZXIucGFyc2UoeyB0eXBlOiBcImNvZGVcIiwgdmFsdWU6ICcgeFsxXSAnfSk7IFxubGV0IGFzdCA9IEFTVFBhcnNlci5wYXJzZSh7IHR5cGU6IFwiY29kZVwiLCB2YWx1ZTogJyB4Kz0xICd9KTsgXG4vL2xldCBhc3QgPSBBU1RQYXJzZXIucGFyc2UoeyB0eXBlOiBcImNvZGVcIiwgdmFsdWU6ICcgeCs9eSAnfSk7XG5jb25zb2xlLmluZm8odG9Kc29uKGFzdCkpXG4vL2xldCBnZW5lcmF0b3IgPSBuZXcgU291cmNlR2VuZXJhdG9yKCk7XG4vL2dlbmVyYXRvci52aXNpdChhc3QpO1xuXG4vLyBUcmljayB0byBwcmV2ZW50ICBcbi8vIEFsbCBmaWxlcyBtdXN0IGJlIG1vZHVsZXMgd2hlbiB0aGUgJy0taXNvbGF0ZWRNb2R1bGVzJyBmbGFnIGlzIHByb3ZpZGVkLnRzKDEyMDgpXG5leHBvcnQgeyB9ICJdfQ==