
import * as fs from 'fs'

export default class Utils {

    static toJson = (obj: any): string => JSON.stringify(obj, function replacer(key, value) { return value }, 4);

    /**
     * Write json file
     * @param outputFilename 
     * @param obj 
     */
    static writeJson(outputFilename: string, obj: any): void {

        fs.writeFile(outputFilename, this.toJson(obj), function (err) {
            if (err) {
                console.log(err);
            } else {
                console.log("JSON saved to " + outputFilename);
            }
        });
    }
}
