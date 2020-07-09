export interface CallSite {
    function: string | undefined,
    filename: string,
    line: number,
    column: number
}

export default class Trace {
    static frame(): CallSite {
        const stack = (new Error().stack);

        if (stack === undefined) {
            return {
                function: 'undefined',
                filename: 'undefined',
                line: 0,
                column: 0,
            }
        }

        const frame = stack.split("at ")[2];
        // /PrintVisitor.js:15:32
        // xyz (/PrintVisitor.js:17:32)
        // Object.<anonymous> (/PrintVisitor.js:21:30)
        let fname;
        let data;
        if (frame.indexOf("(") > -1) {
            fname = frame.substring(0, frame.indexOf("(")).trim();
            data = frame.substring(frame.indexOf("(") + 1, frame.indexOf(")")).split(":");
        } else {
            data = frame.split(":");
        }

        return {
            function: fname,
            filename: data[0],
            line: parseInt(data[1].trim()),
            column: parseInt(data[2].trim()),
        }
    }

    static debug(): void {
        console.log('DEBUG', new Date().toUTCString(), Trace.frame());
    }
}