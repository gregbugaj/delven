export default class Utils {
    static toJson: (obj: unknown) => string;
    /**
     * Create directory from a path
     * @param path
     */
    static createDirs: (path: string) => Promise<boolean>;
    static _write(outputFilename: string, value: string): Promise<void>;
    /**
     * Write json file
     * @param outputFilename
     * @param obj
     */
    static writeJson(outputFilename: string, obj: unknown): void;
    /**
     * Write string or object out
     * @param outputFilename
     * @param value
     */
    static write(outputFilename: string, value: string | unknown): void;
}
