import { IExecutor, CallbackFunction } from './executor';

/**
 * Local script executor
 */
export default class LocalExecutor implements IExecutor {
    id?: string

    constructor() {
        console.info(`Setting up executor`)
    }

    async compile(script: string): Promise<string> {
        console.info('Compiling script')

        return Promise.resolve(create_UUID())
    }

    public async dispose() {

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