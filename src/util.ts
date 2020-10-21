import * as fs from 'fs'

/**
 * 
 * @param obj the object to sanitize
 */
function sanitize(obj: any | null): void {
    if (obj == null || obj == undefined) {
        return
    }

    // prevent circular dependenices
    delete obj['__parent__'];
    delete obj['__path__'];

    const keys = Object.getOwnPropertyNames(obj)

    for (const key in keys) {
        const name = keys[key];
        if (obj[name] && typeof obj[name] === 'object') {
            sanitize(obj[name])
        }
    }
}
export default class Utils {

    static toJson = (obj: unknown): string => {
        const clone = Object.assign({}, obj)// same as clone = {...obj};
        sanitize(clone)
        return JSON.stringify(clone, function replacer(key, value) { return value }, 4)
    };

    /**
     * Create directory from a path
     * @param path 
     */
    static createDirs = async (path: string): Promise<boolean> => {
        let dir = path
        if (path.indexOf('.') > -1) {
            dir = path.slice(0, path.lastIndexOf('/'))
        }

        if (fs.existsSync(dir)) {
            return false
        }

        fs.mkdirSync(dir, { recursive: true })
        return true
    }

    static async _write(outputFilename: string, value: string): Promise<void> {
        await this.createDirs(outputFilename)

        fs.writeFile(outputFilename, value, function (err) {
            if (err) {
                console.log(err);
            } else {
                console.log(`Saved to :${outputFilename}`);
            }
        });
    }
    /**
     * Write json file
     * @param outputFilename 
     * @param obj 
     */
    static writeJson(outputFilename: string, obj: unknown): void {
        Utils._write(outputFilename, this.toJson(obj))
    }

    /**
     * Write string or object out
     * @param outputFilename 
     * @param value 
     */
    static write(outputFilename: string, value: string | unknown): void {

        if (typeof value === 'string') {
            Utils._write(outputFilename, value)
        } else {
            Utils._write(outputFilename, this.toJson(value))
        }
    }
}
