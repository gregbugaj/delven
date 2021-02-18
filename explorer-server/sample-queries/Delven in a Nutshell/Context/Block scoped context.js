// Block scoped context

using context() {
    select css('#test'), css('#test') from sourceA()
    union
    select css('#test'), css('#test') from sourceB()
}