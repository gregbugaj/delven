export var ECMAScriptParserBase: typeof ECMAScriptParserBase;
declare function ECMAScriptParserBase(input: any): void;
declare class ECMAScriptParserBase {
    constructor(input: any);
    n(str: any): boolean;
    next(str: any): boolean;
    p(str: any): boolean;
    prev(str: any): boolean;
    notLineTerminator(): boolean;
    notOpenBraceAndNotFunction(): boolean;
    closeBrace(): boolean;
    here(type: any): any;
    lineTerminatorAhead(): any;
}
export {};
