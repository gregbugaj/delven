// Object literal assigement

let x = {
    dataA: select css('#sel1') from Source(),
    dataB: using context() select css('#sel1') from Source()
}