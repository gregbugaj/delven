import * as cp from 'child_process';
import { inherits } from 'util';
import * as process from 'process';
import { Duplex } from 'stream';
import * as hostConnection from '../main';
import { RequestType } from '../../common/messages';


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

		test("Establish connection", async (done) => {

			let type = new RequestType<string, string, void>('test/handleSingleRequest');
			const up = new TestDuplex('ds1', true);
			const down = new TestDuplex('ds2', true);

			let connection = hostConnection.createMessageConnection(up, down);
			connection.listen()

			let content: string = '';
			let counter = 0;
			down.on('data', (chunk)=>{
				content+= chunk.toString()
				if(++counter == 2){
					console.warn(content)
					done();
				}
			})

			connection.sendRequest(type, 'foo');
			// serverConnection.sendNotification('Notify me')
		})

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
