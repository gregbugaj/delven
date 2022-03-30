/**
 * The exception that is thrown when a null or undefined value is passed to a method that does not accept it as a valid argument.
 */
export default class ArgumentNullException extends Error {
    constructor(message?: string);
}
