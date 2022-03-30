export default class ECMAScriptParserBase {
    constructor(input: any);
    p(str: any): boolean;
    prev(str: any): boolean;
    n(str: any): boolean;
    next(str: any): boolean;
    notLineTerminator(): boolean;
    notOpenBraceAndNotFunction(): boolean;
    closeBrace(): boolean;
    here_ORIGINAL(type: any): boolean;
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
    here(type: any): any;
    lineTerminatorAhead(): any;
}
