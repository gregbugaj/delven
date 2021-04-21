
/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ----------------------------------------------------------------------------------------- */

import {RAL, AbstractMessageReader, DataCallback, Disposable, ReadableStreamMessageReader, WriteableStreamMessageWriter, AbstractMessageWriter, MessageWriter, MessageReader, MessageConnection } from '../common/api';
import RIL from './ril';
import { Message } from '../common/messages';
import { ChildProcess } from 'child_process';
import { createMessageConnection as _createMessageConnection } from '../common/connection';

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


function isReadableStream(value: any): value is NodeJS.ReadableStream {
	const candidate: NodeJS.ReadableStream = value;
	return candidate.read !== undefined && candidate.addListener !== undefined;
}

function isWritableStream(value: any): value is NodeJS.WritableStream {
	const candidate: NodeJS.WritableStream = value;
	return candidate.write !== undefined && candidate.addListener !== undefined;
}

export function createMessageConnection(input: MessageReader | NodeJS.ReadableStream, output: MessageWriter | NodeJS.WritableStream): MessageConnection {

	const reader = isReadableStream(input) ? new StreamMessageReader(input) : input;
	const writer = isWritableStream(output) ? new StreamMessageWriter(output) : output;

	return _createMessageConnection(reader, writer);
}
