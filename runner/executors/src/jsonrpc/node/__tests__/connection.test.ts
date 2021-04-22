import * as cp from 'child_process';
import { inherits } from 'util';
import * as process from 'process';
import { Duplex } from 'stream';
import * as hostConnection from '../main';
import { ErrorCodes, NotificationType, NotificationType2, ParameterStructures, RequestType, RequestType3, ResponseError } from '../../common/messages';
import assert from 'assert';
import { CancellationTokenSource } from '../../common/api';


// let childProcess = cp.spawn('sh');
// console.log(`Spawned child pid: ${childProcess.pid}`);
interface TestDuplex extends Duplex {
}

interface TestDuplexConstructor {
	new(name?: string, dbg?: boolean): TestDuplex
}

const TestDuplex: TestDuplexConstructor = function (): TestDuplexConstructor {

	function TestDuplex(this: any, name: string = 'ds1', dbg = false) {
		Duplex.call(this)
		this.name = name
		this.dbg = dbg;
	}

	inherits(TestDuplex, Duplex)
	TestDuplex.prototype._write = function (this: any, chunk: string | Buffer, _encoding: string, done: Function) {
		// eslint-disable-next-line no-console
		if (this.dbg) { console.log(this.name + ': write: ' + chunk.toString()); }
		setImmediate(() => {
			this.emit('data', chunk);
		});
		done();
	}

	TestDuplex.prototype._read = function (this: any, _size: number) {
	};

	return (<any>TestDuplex) as TestDuplexConstructor
}();

describe("Connection Test", () => {

	if (false)
		test("Test Duplex Stream", async (done) => {
			let stream = new TestDuplex('ds1', true);
			stream.on('data', (chunk) => {
				expect('Hello World').toBe(chunk.toString());
				done();
			});
			stream.write('Hello World');
		})

	test("Test Duplex Stream Connection", async (done) => {

		let type = new RequestType<string, string, void>('test/handleSingleRequest');
		const up = new TestDuplex('ds1', true);
		const down = new TestDuplex('ds2', true);

		let connection = hostConnection.createMessageConnection(up, down);
		connection.listen()

		let content: string = '';
		let counter = 0;
		down.on('data', (chunk) => {
			content += chunk.toString()
			if (++counter == 2) {
				expect(content.indexOf('Content-Length: 77')).toStrictEqual(0)
				done();
			}
		})

		connection.sendRequest(type, 'foo');
	})

	test("Primitive param as positional", async (done) => {

		let type = new RequestType<boolean, number, void>('test/handleSingleRequest');
		let duplexStream1 = new TestDuplex('ds1');
		let duplexStream2 = new TestDuplex('ds2');

		let connection = hostConnection.createMessageConnection(duplexStream1, duplexStream2, hostConnection.NullLogger);
		connection.listen();
		let counter = 0;
		let content: string = '';
		duplexStream2.on('data', (chunk) => {
			content += chunk.toString();
			if (++counter === 2) {
				expect(content.indexOf('"params":[true]') !== -1).toBe(true)
				done();
			}
		});
		connection.sendRequest(type, true);
	})

	test("Array param as positional", async (done) => {
		let type = new RequestType<boolean[], number, void>('test/handleSingleRequest');
		let duplexStream1 = new TestDuplex('ds1');
		let duplexStream2 = new TestDuplex('ds2');

		let connection = hostConnection.createMessageConnection(duplexStream1, duplexStream2, hostConnection.NullLogger);
		connection.listen();
		let counter = 0;
		let content: string = '';
		duplexStream2.on('data', (chunk) => {
			content += chunk.toString();
			if (++counter === 2) {
				expect(content.indexOf('"params":[[true]]') !== -1).toBe(true)
				done();
			}
		});
		connection.sendRequest(type, [true]);
	})

	test("Literal param as named", async (done) => {

		let type = new RequestType<{ value: boolean }, number, void>('test/handleSingleRequest');
		let duplexStream1 = new TestDuplex('ds1');
		let duplexStream2 = new TestDuplex('ds2');

		let connection = hostConnection.createMessageConnection(duplexStream1, duplexStream2, hostConnection.NullLogger);
		connection.listen();
		let counter = 0;
		let content: string = '';
		duplexStream2.on('data', (chunk) => {
			content += chunk.toString();
			if (++counter === 2) {
				expect(content.indexOf('"params":{"value":true}') !== -1).toBe(true)
				done();
			}
		});
		connection.sendRequest(type, { value: true });
	})

	test("Literal param as positional", async (done) => {

		let type = new RequestType<{ value: boolean }, number, void>('test/handleSingleRequest', ParameterStructures.byPosition);
		let duplexStream1 = new TestDuplex('ds1');
		let duplexStream2 = new TestDuplex('ds2');

		let connection = hostConnection.createMessageConnection(duplexStream1, duplexStream2, hostConnection.NullLogger);
		connection.listen();
		let counter = 0;
		let content: string = '';
		duplexStream2.on('data', (chunk) => {
			content += chunk.toString();
			if (++counter === 2) {
				expect(content.indexOf('"params":[{"value":true}]') !== -1).toBe(true)
				done();
			}
		});
		connection.sendRequest(type, { value: true });
	})



	test("Handle Single Request", async (done) => {
		let type = new RequestType<string, string, void>('test/handleSingleRequest');
		let duplexStream1 = new TestDuplex('ds1');
		let duplexStream2 = new TestDuplex('ds2');

		let server = hostConnection.createMessageConnection(duplexStream2, duplexStream1, hostConnection.NullLogger);
		server.onRequest(type, (p1, _token) => {
			// assert.strictEqual(p1, 'foo');
			expect(p1).toStrictEqual('foo')
			return p1;
		});
		server.listen();

		let client = hostConnection.createMessageConnection(duplexStream1, duplexStream2, hostConnection.NullLogger);
		client.listen();
		client.sendRequest(type, 'foo').then((result) => {
			// assert.strictEqual(result, 'foo');
			expect(result).toStrictEqual('foo')
			done();
		});
	})


	test('Handle Multiple Requests', (done) => {
		let type = new RequestType<string, string, void>('test/handleSingleRequest');
		let duplexStream1 = new TestDuplex('ds1');
		let duplexStream2 = new TestDuplex('ds2');

		let server = hostConnection.createMessageConnection(duplexStream2, duplexStream1, hostConnection.NullLogger);
		server.onRequest(type, (p1, _token) => {
			console.info(_token)
			return p1;
		});
		server.listen();

		let client = hostConnection.createMessageConnection(duplexStream1, duplexStream2, hostConnection.NullLogger);
		client.listen();
		let promises: Promise<string>[] = [];
		promises.push(client.sendRequest(type, 'foo'));
		promises.push(client.sendRequest(type, 'bar'));

		Promise.all(promises).then((values) => {
			expect(values.length).toStrictEqual(2)
			expect(values[0]).toStrictEqual('foo')
			expect(values[1]).toStrictEqual('bar')
			done();
		});
	});

	test('Unhandled Request', (done) => {
		let type = new RequestType<string, string, void>('test/handleSingleRequest');
		let duplexStream1 = new TestDuplex('ds1');
		let duplexStream2 = new TestDuplex('ds2');

		let server = hostConnection.createMessageConnection(duplexStream2, duplexStream1, hostConnection.NullLogger);
		server.listen();

		let client = hostConnection.createMessageConnection(duplexStream1, duplexStream2, hostConnection.NullLogger);
		client.listen();
		client.sendRequest(type, 'foo').then((_result) => {
		}, (error: ResponseError<any>) => {
			expect(error.code).toStrictEqual(ErrorCodes.MethodNotFound);
			done();
		});
	});

	test('Receives undefined param as null', (done) => {
		let type = new RequestType<string, string, void>('test/handleSingleRequest');
		let duplexStream1 = new TestDuplex('ds1');
		let duplexStream2 = new TestDuplex('ds2');

		let server = hostConnection.createMessageConnection(duplexStream2, duplexStream1, hostConnection.NullLogger);
		server.onRequest(type, (param) => {
			expect(param).toStrictEqual(null);
			return '';
		});
		server.listen();

		let client = hostConnection.createMessageConnection(duplexStream1, duplexStream2, hostConnection.NullLogger);
		client.listen();
		client.sendRequest(type, undefined).then((_result) => {
			done();
		});
	});


	test('Receives null as null', (done) => {
		let type = new RequestType<string | null, string | null, void>('test/handleSingleRequest');
		let duplexStream1 = new TestDuplex('ds1');
		let duplexStream2 = new TestDuplex('ds2');

		let server = hostConnection.createMessageConnection(duplexStream2, duplexStream1, hostConnection.NullLogger);
		server.onRequest(type, (param) => {
			expect(param).toStrictEqual(null);
			return null;
		});
		server.listen();

		let client = hostConnection.createMessageConnection(duplexStream1, duplexStream2, hostConnection.NullLogger);
		client.listen();
		client.sendRequest(type, null).then(result => {
			expect(result).toStrictEqual(null);
			done();
		});
	});

	test('Receives 0 as 0', (done) => {
		let type = new RequestType<number, number, void>('test/handleSingleRequest');
		let duplexStream1 = new TestDuplex('ds1');
		let duplexStream2 = new TestDuplex('ds2');

		let server = hostConnection.createMessageConnection(duplexStream2, duplexStream1, hostConnection.NullLogger);
		server.onRequest(type, (param) => {
			expect(param).toStrictEqual(0);
			return 0;
		});
		server.listen();

		let client = hostConnection.createMessageConnection(duplexStream1, duplexStream2, hostConnection.NullLogger);
		client.listen();
		client.sendRequest(type, 0).then(result => {
			expect(result).toStrictEqual(0);
			done();
		});
	});

	let testNotification = new NotificationType<{ value: boolean }>('testNotification');
	test('Send and Receive Notification', (done) => {

		let duplexStream1 = new TestDuplex('ds1');
		let duplexStream2 = new TestDuplex('ds2');

		let server = hostConnection.createMessageConnection(duplexStream2, duplexStream1, hostConnection.NullLogger);
		server.onNotification(testNotification, (param) => {
			// assert.strictEqual(param.value, true);
			expect(param.value).toStrictEqual(true);
			done();
		});
		server.listen();

		let client = hostConnection.createMessageConnection(duplexStream1, duplexStream2, hostConnection.NullLogger);
		client.listen();
		client.sendNotification(testNotification, { value: true });
	});


	test('Unhandled notification event', (done) => {
		let duplexStream1 = new TestDuplex('ds1');
		let duplexStream2 = new TestDuplex('ds2');

		let server = hostConnection.createMessageConnection(duplexStream2, duplexStream1, hostConnection.NullLogger);
		server.onUnhandledNotification((message) => {
			expect(message.method).toStrictEqual(testNotification.method);
			done();
		});
		server.listen();

		let client = hostConnection.createMessageConnection(duplexStream1, duplexStream2, hostConnection.NullLogger);
		client.listen();
		client.sendNotification(testNotification, { value: true });
	});


	test('Dispose connection', (done) => {
		let type = new RequestType<string | null, string | null, void>('test/handleSingleRequest');
		let duplexStream1 = new TestDuplex('ds1');
		let duplexStream2 = new TestDuplex('ds2');

		let client = hostConnection.createMessageConnection(duplexStream1, duplexStream2, hostConnection.NullLogger);
		let server = hostConnection.createMessageConnection(duplexStream2, duplexStream1, hostConnection.NullLogger);
		server.onRequest(type, (_param) => {
			client.dispose();
			return '';
		});
		server.listen();

		client.listen();
		client.sendRequest(type, '').then(_result => {
			fail();
		}, () => {
			done();
		});
	});

	test('Disposed connection throws', (done) => {
		let duplexStream1 = new TestDuplex('ds1');
		let duplexStream2 = new TestDuplex('ds2');

		let client = hostConnection.createMessageConnection(duplexStream1, duplexStream2, hostConnection.NullLogger);
		client.listen();
		client.dispose();
		try {
			client.sendNotification(testNotification);
			fail();
		} catch (error) {
			done();
		}
	});


	test('N params in notifications', (done) => {
		let type = new NotificationType2<number, string>('test');
		let duplexStream1 = new TestDuplex('ds1');
		let duplexStream2 = new TestDuplex('ds2');

		let server = hostConnection.createMessageConnection(duplexStream2, duplexStream1, hostConnection.NullLogger);
		server.onNotification(type, (p1, p2) => {
			assert.strictEqual(p1, 10);
			assert.strictEqual(p2, 'vscode');
			done();
		});
		server.listen();

		let client = hostConnection.createMessageConnection(duplexStream1, duplexStream2, hostConnection.NullLogger);
		client.listen();
		client.sendNotification(type, 10, 'vscode');
	});


	test('N params in request / response', (done) => {
		let type = new RequestType3<number, number, number, number, void>('add');
		let duplexStream1 = new TestDuplex('ds1');
		let duplexStream2 = new TestDuplex('ds2');

		let server = hostConnection.createMessageConnection(duplexStream2, duplexStream1, hostConnection.NullLogger);
		server.onRequest(type, (p1, p2, p3) => {
			assert.strictEqual(p1, 10);
			assert.strictEqual(p2, 20);
			assert.strictEqual(p3, 30);
			return p1 + p2 + p3;
		});
		server.listen();

		let client = hostConnection.createMessageConnection(duplexStream1, duplexStream2, hostConnection.NullLogger);
		client.listen();
		client.sendRequest(type, 10, 20, 30).then(result => {
			assert.strictEqual(result, 60);
			done();
		}, () => {
			assert(false);
			done();
		});
	});

	test('N params in request / response with token', (done) => {
		let type = new RequestType3<number, number, number, number, void>('add');
		let duplexStream1 = new TestDuplex('ds1');
		let duplexStream2 = new TestDuplex('ds2');

		let server = hostConnection.createMessageConnection(duplexStream2, duplexStream1, hostConnection.NullLogger);
		server.onRequest(type, (p1, p2, p3, _token) => {
			assert.strictEqual(p1, 10);
			assert.strictEqual(p2, 20);
			assert.strictEqual(p3, 30);
			return p1 + p2 + p3;
		});
		server.listen();

		let client = hostConnection.createMessageConnection(duplexStream1, duplexStream2, hostConnection.NullLogger);
		let token = new CancellationTokenSource().token;
		client.listen();
		client.sendRequest(type, 10, 20, 30, token).then(result => {
			assert.strictEqual(result, 60);
			done();
		}, () => {
			assert(false);
			done();
		});
	});

	test('One Param as array in request', (done) => {
		let type = new RequestType<number[], number, void>('add', ParameterStructures.byPosition);
		let duplexStream1 = new TestDuplex('ds1');
		let duplexStream2 = new TestDuplex('ds2');

		let server = hostConnection.createMessageConnection(duplexStream2, duplexStream1, hostConnection.NullLogger);
		server.onRequest(type, (p1) => {
			assert(Array.isArray(p1));
			assert.strictEqual(p1[0], 10);
			assert.strictEqual(p1[1], 20);
			assert.strictEqual(p1[2], 30);
			return 60;
		});
		server.listen();

		let client = hostConnection.createMessageConnection(duplexStream1, duplexStream2, hostConnection.NullLogger);
		let token = new CancellationTokenSource().token;
		client.listen();
		client.sendRequest(type, [10, 20, 30], token).then(result => {
			assert.strictEqual(result, 60);
			done();
		}, () => {
			assert(false);
			done();
		});
	});

	test('One Param as array in notification', (done) => {
		let type = new NotificationType<number[]>('add', ParameterStructures.byPosition);
		let duplexStream1 = new TestDuplex('ds1');
		let duplexStream2 = new TestDuplex('ds2');

		let server = hostConnection.createMessageConnection(duplexStream2, duplexStream1, hostConnection.NullLogger);
		server.onNotification(type, (p1) => {
			assert(Array.isArray(p1));
			assert.strictEqual(p1[0], 10);
			assert.strictEqual(p1[1], 20);
			assert.strictEqual(p1[2], 30);
			done();
		});
		server.listen();

		let client = hostConnection.createMessageConnection(duplexStream1, duplexStream2, hostConnection.NullLogger);
		client.listen();
		client.sendNotification(type, [10, 20, 30]);
	});

	// test("Establish connection", async () => {
	//   const expectedResult = 5
	//   let input = 5

	//   // // Use stdin and stdout for communication:
	//   let connection = rpc.createMessageConnection(
	//     new rpc.StreamMessageReader(process.stdout),
	//     new rpc.StreamMessageWriter(process.stdin));

	//   expect(input).toBe(expectedResult)
	// })

})
