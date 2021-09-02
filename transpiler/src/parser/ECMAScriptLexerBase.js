import antlr4 from 'antlr4';
import ECMAScriptLexer from './ECMAScriptLexer.js';

export default class ECMAScriptLexerBase extends antlr4.Lexer {

    constructor(input) {
        super(input);
        this.scopeStrictModes = new Array();
        this.lastToken = null;
        this.useStrictDefault = false;
        this.useStrictCurrent = false;
        this.templateDepth = 0;
    }

    getStrictDefault() {
        return this.useStrictDefault;
    }

    setUseStrictDefault(value) {
        this.useStrictDefault = value;
        this.useStrictCurrent = value;
    }

    IsStrictMode() {
        return this.useStrictCurrent;
    }

    IsInTemplateString() {
        return this.templateDepth > 0;
    }

    getCurrentToken() {
        return this.nextToken();
    }

    nextToken() {
        var next = super.nextToken();

        if (next.channel === antlr4.Token.DEFAULT_CHANNEL) {
            this.lastToken = next;
        }
        return next;
    }

    ProcessOpenBrace() {
        this.useStrictCurrent =
            this.scopeStrictModes.length > 0 && this.scopeStrictModes[this.scopeStrictModes.length - 1]
                ? true
                : this.useStrictDefault;
        this.scopeStrictModes.push(this.useStrictCurrent);
    }

    ProcessCloseBrace() {
        this.useStrictCurrent =
            this.scopeStrictModes.length > 0
                ? this.scopeStrictModes.pop()
                : this.useStrictDefault;
    }

    ProcessStringLiteral() {
        if (this.lastToken === null ||
            this.lastToken.type === ECMAScriptLexer.OpenBrace) {
            if (super.text === '"use strict"' || super.text === "'use strict'") {
                if (this.scopeStrictModes.length > 0) {
                    this.scopeStrictModes.pop();
                }
                this.useStrictCurrent = true;
                this.scopeStrictModes.push(this.useStrictCurrent);
            }
        }
    }

    IncreaseTemplateDepth() {
        this.templateDepth++;
    }

    DecreaseTemplateDepth() {
        this.templateDepth--;
    }

    IsRegexPossible() {
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
    }

    IsStartOfFile() {
        return this.lastToken === null;
    }
}
