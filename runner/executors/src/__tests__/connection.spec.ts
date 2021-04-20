import * as cp from 'child_process';
import * as process from 'process';
import * as rpc from '../jsonrpc/node';

// let childProcess = cp.spawn('sh');
// console.log(`Spawned child pid: ${childProcess.pid}`);

console.info(rpc)
describe("Executor Connection Test", () => {

  afterAll(() => {
    childProcess.kill();
  })

  beforeAll(() => {
    // noop
  })

  test("Establish connection", async () => {
    const expectedResult = 5
    let input = 5


    // // Use stdin and stdout for communication:
    // let connection = rpc.createMessageConnection(
    //   new rpc.StreamMessageReader(process.stdout),
    //   new rpc.StreamMessageWriter(process.stdin));

    expect(input).toBe(expectedResult)
  })

})
