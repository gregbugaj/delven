export interface CallSite {
    function: string | undefined;
    filename: string;
    line: number;
    column: number;
}
export default class Trace {
    static frame(): CallSite;
    static debug(): void;
}
