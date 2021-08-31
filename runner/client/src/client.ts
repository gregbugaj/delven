
interface Connection {
    listen(): void;
    end(): void;
    dispose(): void;
}

class ConsoleLogger implements Logger {
    public error(message: string): void {
        RAL().console.error(message);
    }
    public warn(message: string): void {
        RAL().console.warn(message);
    }
    public info(message: string): void {
        RAL().console.info(message);
    }
    public log(message: string): void {
        RAL().console.log(message);
    }
}


function createConnection(input: MessageReader, output: MessageWriter, errorHandler: ConnectionErrorHandler, closeHandler: ConnectionCloseHandler, options?: ConnectionOptions): Connection {
    let logger = new ConsoleLogger();
    let connection = createProtocolConnection(input, output, logger, options);

    connection.onError((data) => { errorHandler(data[0], data[1], data[2]); });
    connection.onClose(closeHandler);
    let result: Connection = {
    }

}