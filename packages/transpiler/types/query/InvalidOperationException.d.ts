/**
 * Signals that a method has been invoked at an illegal or inappropriate time
 */
export default class InvalidOperationException extends Error {
    constructor(message?: string);
}
