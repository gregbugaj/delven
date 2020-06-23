
// Check parsing syntax
params => {foo: bar}
params => ({foo: bar, 2:3}, x2)
params => ({foo: bar, 2:3})

params => ({foo: bar, x:2}, z = 3);
(param1 = (x+2), param2) => {  } 
(param1, param2, ...rest) => {  }
(param1 = defaultValue1, param2) => { 1 }

(param1 = [], param2) => {  } 

()=> { x = 2, y = 3 }
()=>{}
()=>{a:2}

let x = (a, b)=>{}
 let x = yy => {}

(param1, param2, ...rest) =>  1 + 1
