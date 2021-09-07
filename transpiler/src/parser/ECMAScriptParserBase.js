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
        const term = !this.here(ECMAScriptParser.LineTerminator);
        // console.warn(` >  notLineTerminator ::  : ${term}` )
        return term
    }

    notOpenBraceAndNotFunction() {
        const nextTokenType = this._input.LT(1).type;
        return (
            nextTokenType !== ECMAScriptParser.OpenBrace &&
            nextTokenType !== ECMAScriptParser.Function_
        );
    }

    closeBrace() {
        return this._input.LT(1).type === ECMAScriptParser.CloseBrace;
    }

    here_ORIGINAL(type) {
        const possibleIndexEosToken = this.getCurrentToken().tokenIndex - 1;
        const ahead = this._input.get(possibleIndexEosToken);
        return ahead.channel === antlr4.Lexer.HIDDEN && ahead.type === type;
    }

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
    here(type) {
        let possibleIndexEosToken = this.getCurrentToken().tokenIndex - 1;
        let ahead = this._input.get(possibleIndexEosToken);
        if (ahead.channel !== antlr4.Lexer.HIDDEN) {
            return false;
        }

        // TODO : Figure out why LineTerminator token is not recognized correctly
        /*
          GB : Added to deal with snippets such as
          {   x
            --y
          }

          This breaks the contract of this method as the token WhiteSpace does not exist on the HIDDEN channel
         */
        if (ahead.type === ECMAScriptParser.WhiteSpaces) {
            possibleIndexEosToken = this.getCurrentToken().tokenIndex - 2;
            ahead = this._input.get(possibleIndexEosToken);
        }
        return ahead.type === type;
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
