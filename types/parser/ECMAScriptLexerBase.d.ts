export var ECMAScriptLexerBase: typeof ECMAScriptLexerBase;
declare function ECMAScriptLexerBase(input: any): void;
declare class ECMAScriptLexerBase {
    constructor(input: any);
    scopeStrictModes: any[];
    lastToken: import("antlr4").Token | null;
    useStrictDefault: boolean;
    useStrictCurrent: boolean;
    getStrictDefault(): boolean;
    setUseStrictDefault(value: any): void;
    IsStrictMode(): boolean;
    getCurrentToken(): import("antlr4").Token;
    nextToken(): import("antlr4").Token;
    ProcessOpenBrace(): void;
    ProcessCloseBrace(): void;
    ProcessStringLiteral(): void;
    IsRegexPossible(): boolean;
    IsStartOfFile(): boolean;
}
export {};
