import * as cp from 'child_process';
import * as process from 'process';
import { Duplex } from 'stream';
import { createMessageConnection } from '../../common/api';
import { StreamMessageReader, StreamMessageWriter } from '../main';

// let childProcess = cp.spawn('sh');
// console.log(`Spawned child pid: ${childProcess.pid}`);

class TestStream extends Duplex {
  _write(chunk: string, _encoding: string, done: () => void) {
    this.emit('data', chunk);
    done();
  }

  _read(_size: number) {
  }
}

describe("Executor Connection Test", () => {

  beforeAll(() => {
    // noop
  })

  afterAll(() => {
    // childProcess.kill();
  })


  test("Establish connection", async () => {
    const expectedResult = 5
    let input = 5
    const up = new TestStream();
		const down = new TestStream();
    let serverConnection =  createMessageConnection(new StreamMessageReader(up), new StreamMessageWriter(down));
		serverConnection.listen()


    expect(input).toBe(expectedResult)
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
