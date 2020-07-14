const antlr4 = require("antlr4/index");
// const ECMAScriptParser = require("./ECMAScriptParser");
const parent = require('./ECMAScriptParser');
let ECMAScriptParser;

function ECMAScriptParserBase(input) {
    // GB : footnote > the property chain in not inheriting from the parent properly
    ECMAScriptParser = parent.ECMAScriptParser;
    antlr4.Parser.call(this, input);
}

ECMAScriptParserBase.prototype = Object.create(antlr4.Parser.prototype);

/**
 * Check if the the token matches a string
 * Todo : create pull request
 */
ECMAScriptParserBase.prototype.n = function (str) {
    return this.next(str);
};

ECMAScriptParserBase.prototype.next = function (str) {
    const source = this._input.LT(1).source[1].strdata;
    const start = this._input.LT(1).start;
    const stop = this._input.LT(1).stop;
    const next = source.slice(start, stop + 1);
    return next === str;
};

ECMAScriptParserBase.prototype.p = function (str) {
    return this.prev(str);
};

ECMAScriptParserBase.prototype.prev = function (str) {
    const source = this._input.LT(-1).source[1].strdata;
    const start = this._input.LT(-1).start;
    const stop = this._input.LT(-1).stop;
    const prev = source.slice(start, stop + 1);
    return prev === str;
};

ECMAScriptParserBase.prototype.notLineTerminator = function () {
    return !this.here(ECMAScriptParser.LineTerminator)
};

ECMAScriptParserBase.prototype.notOpenBraceAndNotFunction = function () {
    const nextTokenType = this._input.LT(1).type;
    return (
        nextTokenType !== ECMAScriptParser.OpenBrace &&
        nextTokenType !== ECMAScriptParser.Function
    );
};

ECMAScriptParserBase.prototype.closeBrace = function () {
    return this._input.LT(1).type === ECMAScriptParser.CloseBrace;
};

    
/**
 * Returns {@code true} iff on the current index of the parser's
 * token stream a token of the given {@code type} exists on the
 * {@code HIDDEN} channel.
 *
 * @param type
 *         the type of the token on the {@code HIDDEN} channel
 *         to check.
 *
 * @return {@code true} iff on the current index of the parser's
 * token stream a token of the given {@code type} exists on the
 * {@code HIDDEN} channel.
 */
ECMAScriptParserBase.prototype.here = function (type) {
    let possibleIndexEosToken = this.getCurrentToken().tokenIndex - 1;
    let ahead = this._input.get(possibleIndexEosToken);
    if (ahead.channel !== antlr4.Lexer.HIDDEN) {
        return false;
    }

    if (ahead.type === ECMAScriptParser.WhiteSpaces) {
        possibleIndexEosToken = this.getCurrentToken().tokenIndex - 2;
        ahead = this._input.get(possibleIndexEosToken);
    }
    return ahead.type === type;
};

ECMAScriptParserBase.prototype.lineTerminatorAhead = function (){
    let possibleIndexEosToken = this.getCurrentToken().tokenIndex - 1;
    let ahead = this._input.get(possibleIndexEosToken);
    if (ahead.channel !== antlr4.Lexer.HIDDEN) {
        return false;
    }

    if (ahead.type === ECMAScriptParser.LineTerminator) {
        return true;
    }

    // GB: Footnote> getTokenIndex is not a function so we are using 'tokenIndex'
    if (ahead.type === ECMAScriptParser.WhiteSpaces) {
        possibleIndexEosToken = this.getCurrentToken().tokenIndex - 2;
        ahead = this._input.get(possibleIndexEosToken);
    }
    
    const text = ahead.text; // GB :Footnote  this should be .text not type
    const type = ahead.type;

    return (
        (type === ECMAScriptParser.MultiLineComment &&
            (text.includes("\r") || text.includes("\n"))) ||
        type === ECMAScriptParser.LineTerminator
    );
}

module.exports.ECMAScriptParserBase = ECMAScriptParserBase;