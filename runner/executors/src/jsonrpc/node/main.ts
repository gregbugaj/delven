import {RAL, AbstractMessageReader, DataCallback, Disposable, ReadableStreamMessageReader, WriteableStreamMessageWriter, AbstractMessageWriter, MessageWriter } from '../common/api';
import RIL from './ril';

import { ChildProcess } from 'child_process';
import { Message } from '../common/protocol';

// Install the node runtime abstract.
RIL.install();

export class IPCMessageReader extends AbstractMessageReader {

	private process: NodeJS.Process | ChildProcess;

	public constructor(process: NodeJS.Process | ChildProcess) {
		super();
		this.process = process;
		let eventEmitter: NodeJS.EventEmitter = this.process;
		eventEmitter.on('error', (error: any) => this.fireError(error));
		eventEmitter.on('close', () => this.fireClose());
	}

	public listen(callback: DataCallback): Disposable {
		(this.process as NodeJS.EventEmitter).on('message', callback);
		return Disposable.create(() => (this.process as NodeJS.EventEmitter).off('message', callback));
	}
}


export class IPCMessageWriter extends AbstractMessageWriter implements MessageWriter {

	private process: NodeJS.Process | ChildProcess;
	private errorCount: number;

	public constructor(process: NodeJS.Process | ChildProcess) {
		super();
		this.process = process;
		this.errorCount = 0;
		let eventEmitter: NodeJS.EventEmitter = this.process;
		eventEmitter.on('error', (error: any) => this.fireError(error));
		eventEmitter.on('close', () => this.fireClose);
	}

	public write(msg: Message): Promise<void> {
		try {
			if (typeof this.process.send === 'function') {

				(this.process.send as Function)(msg, undefined, undefined, (error: any) => {
					if (error) {
						this.errorCount++;
						this.handleError(error, msg);
					} else {
						this.errorCount = 0;
					}
				});
			}
			return Promise.resolve();
		} catch (error) {
			this.handleError(error, msg);
			return Promise.reject(error);
		}
	}

	private handleError(error: any, msg: Message): void {
		this.errorCount++;
		this.fireError(error, msg, this.errorCount);
	}

	public end(): void {
	}
}

export class StreamMessageReader extends ReadableStreamMessageReader {
	public constructor(readble: NodeJS.ReadableStream, encoding?: RAL.MessageBufferEncoding) {
		super(RIL().stream.asReadableStream(readble), encoding);
	}
}

export class StreamMessageWriter extends WriteableStreamMessageWriter {
	public constructor(writable: NodeJS.WritableStream, options?: RAL.MessageBufferEncoding) {
		super(RIL().stream.asWritableStream(writable), options);
	}
}
