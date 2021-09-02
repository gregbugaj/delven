import antlr4 from 'antlr4';
import ECMAScriptParser from './ECMAScriptParser.js';

export default class ECMAScriptParserBase extends antlr4.Parser {

    constructor(input) {
        super(input);
    }

    p(str) {
        return this.prev(str);
    }

    prev(str) {
        return  this._input.LT(-1).text === str;
    }

    // Short form for next(String str)
    n(str)
    {
        return this.next(str);
    }

    // Whether the next token value equals to @param str
    next(str)
    {
        return  this._input.LT(1).text === str;
    }

    notLineTerminator() {
        return !this.here(ECMAScriptParser.LineTerminator);
    }

    notOpenBraceAndNotFunction() {
        const nextTokenType = this._input.LT(1).type;
        return (
            nextTokenType !== ECMAScriptParser.OpenBrace &&
            nextTokenType !== ECMAScriptParser.Function
        );
    }

    closeBrace() {
        return this._input.LT(1).type === ECMAScriptParser.CloseBrace;
    }

    here(type) {
        const possibleIndexEosToken = this.getCurrentToken().tokenIndex - 1;
        const ahead = this._input.get(possibleIndexEosToken);
        return ahead.channel === antlr4.Lexer.HIDDEN && ahead.type === type;
    }

    lineTerminatorAhead() {
        let possibleIndexEosToken = this.getCurrentToken().tokenIndex - 1;
        let ahead = this._input.get(possibleIndexEosToken);
        if (ahead.channel !== antlr4.Lexer.HIDDEN) {
            return false;
        }
        if (ahead.type === ECMAScriptParser.LineTerminator) {
            return true;
        }
        if (ahead.type === ECMAScriptParser.WhiteSpaces) {
            possibleIndexEosToken = this.getCurrentToken().tokenIndex - 2;
            ahead = this._input.get(possibleIndexEosToken);
        }
        const text = ahead.text;
        const type = ahead.type;
        return (
            (type === ECMAScriptParser.MultiLineComment &&
                (text.includes("\r") || text.includes("\n"))) ||
            type === ECMAScriptParser.LineTerminator
        );
    }
}
