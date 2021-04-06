import { IExecutor, CallbackFunction, CompilationUnit, EvaluationResult } from './executor';
import { ASTParser, SourceGenerator } from "delven-transpiler";
import LogStream from './LogStream';
const stream = require('stream')
const { VM, NodeVM, VMScript } = require('vm2');

/**
 * Code compiler
 */
export default class CodeExecutor implements IExecutor {
  id?: string

  constructor() {
    console.info(`Setting up executor`)
  }

  capture(callback: CallableFunction) {
    const _org = console;
    const original = {
      stdout: process.stdout,
      stderr: process.stderr
    }

    const collection = {
      stdout: new stream.Writable(),
      stderr: new stream.Writable()
    }

    let buffer = ""

    Object.keys(collection).forEach((name) => {

      collection[name].write = function (chunk, encoding, callback) {
        _org.log("ORIGINAL: " + chunk)

        buffer += chunk;
        original[name].write(chunk, encoding, callback)
      }
    })

    const options = {}
    const overwrites = Object.assign({}, {
      stdout: collection.stdout,
      stderr: collection.stderr
    }, options)

    let exception: string | undefined
    try {

      const Console = console.Console
      console = new Console(overwrites)

      console.log('capture #1')

      callback()

      console.info('capture #2')
    } catch (ex) {
      exception = ex
      console.log(ex)
    } finally {
      console = _org
    }

    console.info('\x1B[96mCaptured stdout\x1B[00m' + new Date().getTime())
    let fs = require('fs')
    fs.writeFile('./buffer.txt', buffer, { encoding: 'utf8', flag: "a" },
      (err) => {
        if (err) {
          return console.log(err);
        }
      });

    return buffer
  }

  evaluate(unit: CompilationUnit): Promise<EvaluationResult> {
    return new Promise((resolve, reject) => {
      console.info("Evaluating script")
      const script = unit.code
      // Compile script in order to find compilation errors first
      try {
        const status = new VMScript(script, 'sandbox.js').compile();
        console.info('Compilation status', status)
        const start = Date.now();
        const vm = new NodeVM({
          require: {
            external: true
          },
          console: 'redirect',
          compiler: 'javascript',
          fixAsync: false,
          sandbox: {
            done: (arg) => {
              console.info('Sandbox complete : ' + Date.now())
            }
          }
        });

        const log = new LogStream('12123')

        vm.on('console.log', (data) => {
          console.log(`VM stdout[log]: ${data}`);
        });

        vm.on('console.info', (data) => {
          // console.log(`VM stdout[info]: ${data}`);
          log.info(data)
        });

        vm.on('console.warn', (data) => {
          console.log(`VM stdout[warn]: ${data}`);
        });

        vm.on('console.error', (data) => {
          console.log(`VM stdout[error]: ${data}`);
        });

        vm.on('console.dir', (data) => {
          console.log(`VM stdout[dir]: ${data}`);
        });

        vm.on('console.trace', (data) => {
          console.log(`VM stdout[dir]: ${data}`);
        });

        process.on('uncaughtException', function (err) {
          console.log('Caught exception: ' + err);
        });

        try {
          let code = `

                      let z = {
                        "a":1212,
                        "b":0001,
                      }
                      console.info('Eval : Async')
                      console.info(\`Eval : Async  \${z}\`)
                      console.info(z)

                      async function main() {
                          console.info('Eval : start')
                          ${script}
                          console.info('Eval : complete')
                          setTimeout(function(){ console.info("Timeout task"); }, 5000);
                      }

                      (async () => {
                          await main()
                          done()
                      })().catch(err => {
                          console.error("error in main", err)
                      })
                  `
          vm.run(code);

        } catch (err) {
          console.error('Failed to execute script.', err);
        }

        let buff = ' NA '
        console.info('LOG 2')
        console.info(buff)

        return resolve({ "exception": null, stdout: buff, stderr: "" })

      } catch (err) {
        console.error('Failed to compile script.', err);
        return resolve({ "exception": err, stdout: "", stderr: "" })
      }
    });
  }

  async compile(unit: CompilationUnit): Promise<CompilationUnit> {
    try {
      console.info(unit)
      const code = unit.code
      const start = Date.now()
      const generator = new SourceGenerator();
      console.info('Compiling script')
      console.info('---------------')
      console.log(code);
      console.info('---------------')

      unit.ast = ASTParser.parse({ type: "code", value: code });
      unit.generated = generator.toSource(unit.ast);
      unit.compileTime = Date.now() - start

      return unit;
    } catch (e) {
      throw e
    }
  }

  public async dispose() {
    // noop
  }
}
