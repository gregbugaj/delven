import { CompilationUnit, EvaluationResult, NotifierEvent } from "../jsonrpc/protocol";

/**
 * An executor is responsible for communication with the service that compiles/executes the code
 */
export interface IExecutor {
  id?: string

  /**
   * Compile script
   * @param script the script to compile
   */
  compile(unit: CompilationUnit): Promise<any>

  /**
   * Evaluate script in a sandbox environment
   * @param script the script to evaluate
   * @param notifier the callback to send messagteto
   */
  evaluate(unit: CompilationUnit, notifier: (msg: NotifierEvent) => void): Promise<EvaluationResult>

  /**
   * Perform cleanup
   */
  dispose()
}
