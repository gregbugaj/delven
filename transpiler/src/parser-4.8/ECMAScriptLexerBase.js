const antlr4 = require("antlr4");
const ECMAScriptLexer = require("./ECMAScriptLexer");

function ECMAScriptLexerBase(input) {
    antlr4.Lexer.call(this, input);

    this.scopeStrictModes = new Array();
    this.lastToken = null;
    this.useStrictDefault = false;
    this.useStrictCurrent = false;
}

ECMAScriptLexerBase.prototype = Object.create(antlr4.Lexer.prototype);

ECMAScriptLexerBase.prototype.getStrictDefault = function() {
    return this.useStrictDefault;
};

ECMAScriptLexerBase.prototype.setUseStrictDefault = function(value) {
    this.useStrictDefault = value;
    this.useStrictCurrent = value;
};

ECMAScriptLexerBase.prototype.IsStrictMode = function() {
    return this.useStrictCurrent;
};

ECMAScriptLexerBase.prototype.getCurrentToken = function() {
    return antlr4.Lexer.prototype.nextToken.call(this);
};

ECMAScriptLexerBase.prototype.nextToken = function() {
    var next = antlr4.Lexer.prototype.nextToken.call(this);

    if (next.channel === antlr4.Token.DEFAULT_CHANNEL) {
        this.lastToken = next;
    }
    return next;
};

ECMAScriptLexerBase.prototype.ProcessOpenBrace = function() {
    this.useStrictCurrent =
        this.scopeStrictModes.length > 0 && this.scopeStrictModes[0]
            ? true
            : this.useStrictDefault;
    this.scopeStrictModes.push(this.useStrictCurrent);
};

ECMAScriptLexerBase.prototype.ProcessCloseBrace = function() {
    this.useStrictCurrent =
        this.scopeStrictModes.length > 0
            ? this.scopeStrictModes.pop()
            : this.useStrictDefault;
};

ECMAScriptLexerBase.prototype.ProcessStringLiteral = function() {
    if (
        this.lastToken !== undefined &&
        (this.lastToken === null ||
            this.lastToken.type === ECMAScriptLexer.OpenBrace)
    ) {
        const text = this._input.strdata.slice(0, "use strict".length);
        if (text === '"use strict"' || text === "'use strict'") {
            if (this.scopeStrictModes.length > 0) {
                this.scopeStrictModes.pop();
            }
            this.useStrictCurrent = true;
            this.scopeStrictModes.push(this.useStrictCurrent);
        }
    }
};

ECMAScriptLexerBase.prototype.IsRegexPossible = function() {
    if (this.lastToken === null) {
        return true;
    }

    switch (this.lastToken.type) {
        case ECMAScriptLexer.Identifier:
        case ECMAScriptLexer.NullLiteral:
        case ECMAScriptLexer.BooleanLiteral:
        case ECMAScriptLexer.This:
        case ECMAScriptLexer.CloseBracket:
        case ECMAScriptLexer.CloseParen:
        case ECMAScriptLexer.OctalIntegerLiteral:
        case ECMAScriptLexer.DecimalLiteral:
        case ECMAScriptLexer.HexIntegerLiteral:
        case ECMAScriptLexer.StringLiteral:
        case ECMAScriptLexer.PlusPlus:
        case ECMAScriptLexer.MinusMinus:
            return false;
        default:
            return true;
    }
};

ECMAScriptLexerBase.prototype.IsStartOfFile = function() {
    return this.lastToken === null;
};


module.exports.ECMAScriptLexerBase = ECMAScriptLexerBase;