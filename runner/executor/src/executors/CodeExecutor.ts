import { IExecutor, CompilationUnit, EvaluationResult, NotifierEvent } from './executor';
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

  evaluate(unit: CompilationUnit, notifier: (msg: NotifierEvent) => void): Promise<EvaluationResult> {
    // need to return a promise here as Node will complain about
    // UnhandledPromiseRejectionWarning
    return new Promise((resolve, reject) => {
      console.info("Evaluating script")
      const id = unit.id
      const script = unit.code

      notifier({
        id: id,
        type: "console",
        payload: "Code executor ready"
      })

      const evalStreamSubscriber = (event: any) => {
        notifier({ id: id, type: "console", payload: event })
      }

      // Compile script in order to find compilation errors first
      try {
        const sleep = function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)) }
        const status = new VMScript(`
          (async () => {
            ${script}
          })().catch(err => {
              console.error("compile:error in main", err)
              console.error(\`compile: error in mainYYY : \${JSON.stringify(err)}\`, err)
          })
        `, 'sandbox.js').compile();

        console.info('Compilation status', status)

        const vm = new NodeVM({
          require: {
            external: true
          },
          console: 'redirect',
          compiler: 'javascript',
          fixAsync: false,
          sandbox: {
            done: (...args) => {
              console.info('Sandbox complete : ' + Date.now())
            },

            sleep: sleep,
            generator: async function* generator(count, sleeptime) {
              for (let i = 0; i < count; ++i) {
                await sleep(sleeptime)
                yield { "index": i, "time": Date.now() }
              }
              return
            }
          }
        });

        const logStream = new LogStream(id)
        logStream.subscribe(evalStreamSubscriber)

        vm.on('console.log', (...args) => {
          console.log(`VM stdout[log]`, ...args);
          logStream.log(...args)
        });

        vm.on('console.info', (...args) => {
          console.log(`VM stdout[info]`, ...args);
          logStream.info(...args)
        });

        vm.on('console.warn', (...args) => {
          console.log(`VM stdout[warn]`, ...args);
          logStream.warn(...args)
        });

        vm.on('console.error', (...args) => {
          console.log(`VM stdout[error]`, ...args);
          logStream.error(...args)
        });

        vm.on('console.trace', (...args) => {
          console.log(`VM stdout[trace]`, ...args);
          logStream.trace(...args)
        });

        process.on('uncaughtException', function (err) {
          console.log('Caught exception: ' + err);
        });

        try {
          const code = `
                      async function main() {
                            console.info('Eval : start')
                            ${script}

                            for await(let val of generator(15, 500)){
                              console.info('generated : ' + JSON.stringify(val))
                            }

                            console.info('Eval : complete')
                            // setTimeout(function(){ console.info("Timeout task"); }, 5000);
                        }

                        (async () => {
                            await main()
                            done()
                        })().catch(err => {
                          console.error(err)
                          // console.error("compile:error in main", err)
                          // console.error('compile: error in mainXXX :' + JSON.stringify(err), err)
                        })
                    `
          vm.run(code);
        } catch (err) {
          console.error('Failed to execute script.', err);
        }

        let buff = 'NA'
        return resolve({ "exception": null, stdout: buff, stderr: "" })

      } catch (err) {
        console.error('Failed to compile script.', err);
        return resolve({ "exception": err, stdout: "", stderr: "" })
      }
    })
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
