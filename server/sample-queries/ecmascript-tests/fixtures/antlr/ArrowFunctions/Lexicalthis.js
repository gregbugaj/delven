
//------------------------------------------------------------------------------
// Lexical this
// More intuitive handling of current object context.
// http://es6-features.org/#Lexicalthis
//------------------------------------------------------------------------------

this.nums.forEach((v) => {
    if (v % 5 === 0)
        this.fives.push(v)
})
