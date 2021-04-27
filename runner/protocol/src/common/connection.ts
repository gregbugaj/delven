import {
	Message, NotificationMessage, CancellationToken,
	Disposable, Event, MessageReader, MessageWriter, Logger, ConnectionStrategy, ConnectionOptions, createMessageConnection,
	RequestType0, RequestType, NotificationType0, NotificationType
} from 'delven-jsonrpc';

export interface ProtocolConnection {
    
}

export function createProtocolConnection(input: MessageReader, output: MessageWriter, logger?: Logger, options?: ConnectionStrategy | ConnectionOptions): ProtocolConnection {
	if (ConnectionStrategy.is(options)) {
		options = { connectionStrategy: options } as ConnectionOptions;
	}
	return createMessageConnection(input, output, logger, options);
}