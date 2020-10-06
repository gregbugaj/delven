import { IExecutor, CallbackFunction, CompilationUnit } from './executor';
import request from 'request'

/**
 * Local script executor
 */
export default class LocalExecutor implements IExecutor {
    id?: string

    constructor() {
        console.info(`Setting up executor`)
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