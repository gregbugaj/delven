import * as fs from 'fs'
export default class Utils {

    static toJson = (obj: unknown): string => JSON.stringify(obj, function replacer(key, value) { return value }, 4);

    /**
     * Create directory from a path
     * @param path 
     */
    static createDir = async (path: string): Promise<boolean> => {
        let dir = path
        if (path.indexOf('.') > -1) {
            dir = path.slice(0, path.lastIndexOf('/'))
        }

        if (fs.existsSync(dir)) {
            return true
        }
        fs.mkdirSync(dir)
        return true
    }

    static async _write(outputFilename: string, value: string): Promise<void> {
        await this.createDir(outputFilename)

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
