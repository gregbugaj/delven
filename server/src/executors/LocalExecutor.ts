import { IExecutor, CallbackFunction, CompilationUnit } from './executor';
import request from 'request'
const stream = require('stream')

export type EvaluationResult = {
    exception?: string
    stdout?: string
    stderr?: string
}

/**
 * Local script executor
 */
export default class LocalExecutor implements IExecutor {
    id?: string

    constructor() {
        console.info(`Setting up executor`)
    }

    evaluate(script: string): EvaluationResult {

        const _org = console;

        const original = {
            stdout: process.stdout,
            stderr: process.stderr
        }

        const collection = {
            stdout: new stream.Writable(),
            stderr: new stream.Writable()
        }

        let buffer = ""

        Object.keys(collection).forEach((name) => {
            collection[name].write = function (chunk, encoding, callback) {
                _org.log(chunk)
                buffer += chunk;
                original[name].write(chunk, encoding, callback)
            }
        })

        const options = {}
        const overwrites = Object.assign({}, {
            stdout: collection.stdout,
            stderr: collection.stderr
        }, options)

        let exception: string | undefined
        try {

            const Console = console.Console
            console = new Console(overwrites)
            let _eval = (str) => {
                return Function(` ${str}`)
            }

            const fragment = `
                'use strict'; 
                try {
                    ${script}
                } catch(e){
                    console.error(e)
                }
            `

            _eval(fragment)()

        } catch (ex) {
            exception = ex
            console.log(ex)
        } finally {
            console = _org
        }

        console.info('\x1B[96mCaptured stdout\x1B[00m' + new Date().getTime())
        console.log(buffer)

        let fs = require('fs')
        fs.writeFile('./buffer.txt', buffer, { encoding: 'utf8', flag: "a" },
            (err) => {
                if (err) {
                    return console.log(err);
                }
            });

        return { "exception": exception, stdout: buffer, stderr: "" }
    }

    async compile(script: string): Promise<CompilationUnit> {
        console.info('Compiling script')
        let unit: CompilationUnit = {
            id: create_UUID(),
            code: script,
            compileTime: 0
        }

        const options = {
            url: 'http://localhost:5000/runner/compile',
            form: {
                code: JSON.stringify(unit)
            }
        };
        return new Promise((resolve, reject) => {
            request.post(options, (err, res, body) => {
                if (err) {
                    console.log(err);
                    reject(err)
                }

                const result = JSON.parse(body)
                resolve(result)
            });
        })
    }

    public async dispose() {
        // noop
    }

    private terminalMessage(msg: string) {
        // this.emit('terminal:message', `> Sandbox Container: ${msg}\n\r`);
    }
}

function create_UUID() {
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
} 