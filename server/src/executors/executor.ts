export interface CallbackFunction<T = any> {
    (event: T): void;
}

/**
 * An executor is responsible for communication with the service that compiles/executes the code
 */
export interface IExecutor {
    id?: string

    /**
     * Compile script
     * @param script the script to compile
     */
    compile(script: string): Promise<string>

    /**
     * Perform cleanup
     */
    dispose()
}
