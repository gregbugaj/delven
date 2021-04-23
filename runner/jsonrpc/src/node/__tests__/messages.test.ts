import { Message, RequestMessage } from 'src/jsonrpc/common/protocol';
import { Writable, Readable } from 'stream';
import { inherits } from 'util';
import { TextDecoder } from 'util';

import { StreamMessageReader, StreamMessageWriter } from '../main';

interface TestWritable extends Writable {
	constructor: Function;
	readonly data: Buffer | undefined;
}
interface TestWritableConstructor {
	new(): TestWritable;
}

const TestWritable: TestWritableConstructor = function (): TestWritableConstructor {
	function TestWritable(this: any): void {
		Writable.call(this);
	}

	inherits(TestWritable, Writable);
	TestWritable.prototype._write = function (this: any, chunk: string | Buffer, encoding: BufferEncoding, done: Function) {

		const toAdd: Buffer = (typeof chunk === 'string')
			? Buffer.from(chunk, encoding)
			: chunk;
		if (this.data === undefined) {
			this.data = toAdd;
		} else {
			this.data = Buffer.concat([this.data as Buffer, toAdd]);
		}
		done();
	};
	return (<any>TestWritable) as TestWritableConstructor;
}();


describe('Messages', () => {
		test('Writing', async () => {
			const writable = new TestWritable();
			const writer = new StreamMessageWriter(writable, 'ascii');
			const request: RequestMessage = {
				jsonrpc: '2.0',
				id: 1,
				method: 'example'
			};

			await writer.write(request);
			writable.end();

			expect(writable.data).not.toEqual(null)
			expect(writable.data).toStrictEqual(Buffer.from('Content-Length: 43\r\n\r\n{"jsonrpc":"2.0","id":1,"method":"example"}', 'ascii'))
		})


	test('Reading', async (done) => {
		try {
			const readable = new Readable()
			const request: RequestMessage = {
				jsonrpc: '2.0',
				id: 1,
				method: 'example'
			};

			new StreamMessageReader(readable).listen((msg: Message) => {
				const message: RequestMessage = msg as RequestMessage;
				console.info(message)
				expect(message.id).toEqual(1);
				expect(message.method).toEqual('example');

				done();
			});

			readable.push('Content-Length: 43\r\n\r\n{"jsonrpc":"2.0","id":1,"method":"example"}');
			readable.push(null)
		} catch (e) {
			done.fail(e)
		}
	})
})
