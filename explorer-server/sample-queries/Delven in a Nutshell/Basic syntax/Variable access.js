
let iterator = select css('#test'), css('#test') from sourceA()

for (x of iterator) {
    console.info(x)
}